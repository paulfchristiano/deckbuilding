// gameUI.ts - In-game UI for card game play
// Handles rendering game state, player choices, hotkeys, macros

import { Cost, Shadow, State, Card, CardSpec, PlaceName, Rule, ID, VictoryData, UndoPastBeginning } from './gameLogic.js'
import { GameSpec, SlotSpec } from './gameLogic.js'
import { Trigger, Replacer, VariableCost, Token } from './gameLogic.js'
import { renderCost, renderEnergy } from './gameLogic.js'
import { LogType, logTypes } from './gameLogic.js'
import { Option, OptionRender, HotkeyHint } from './gameLogic.js'
import { UI, Undo, SetState } from './gameLogic.js'
import { playGame, initialState, Replayable } from './gameLogic.js'

// ----------------------------- DOM Helpers

function getElement(id: string): HTMLElement {
    return document.getElementById(id)!
}

function querySelector(selector: string): HTMLElement | null {
    return document.querySelector(selector)
}

function querySelectorAll(selector: string): NodeListOf<Element> {
    return document.querySelectorAll(selector)
}

function clearElement(el: HTMLElement): void {
    el.innerHTML = ''
}

function createElementFromHTML(html: string): HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild as HTMLElement
}

function showElement(el: HTMLElement): void {
    el.removeAttribute('hidden')
}

function hideElement(el: HTMLElement): void {
    el.setAttribute('hidden', '')
}

function updateGameReplaySidebar(replayStage: number | null | undefined): void {
    const circles = document.querySelectorAll('#progressLineGame .progressCircle')
    circles.forEach(circle => {
        const el = circle as HTMLElement
        const stage = parseInt(el.getAttribute('data-stage') || '-1')
        if (replayStage !== null && replayStage !== undefined && stage === replayStage) {
            el.classList.add('replaying')
        } else {
            el.classList.remove('replaying')
        }
    })
}

let clearMacroDeleteMenuHandlers: (() => void) | null = null
let activeMacroDeleteMenu: HTMLElement | null = null

function closeMacroDeleteMenu(): void {
    if (activeMacroDeleteMenu !== null) {
        activeMacroDeleteMenu.remove()
        activeMacroDeleteMenu = null
    }
    if (clearMacroDeleteMenuHandlers !== null) {
        clearMacroDeleteMenuHandlers()
        clearMacroDeleteMenuHandlers = null
    }
}

function openMacroDeleteMenu(anchor: HTMLElement, onDelete: () => void): void {
    closeMacroDeleteMenu()
    const menu = document.createElement('div')
    menu.className = 'macroDeleteMenuOverlay'
    const deleteButton = document.createElement('button')
    deleteButton.className = 'macroDeleteButton'
    deleteButton.textContent = 'Delete macro'
    deleteButton.onclick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        closeMacroDeleteMenu()
        onDelete()
    }
    menu.appendChild(deleteButton)
    document.body.appendChild(menu)

    const anchorRect = anchor.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()
    let left = anchorRect.left
    if (left + menuRect.width + 8 > window.innerWidth) {
        left = window.innerWidth - menuRect.width - 8
    }
    left = Math.max(8, left)
    let top = anchorRect.bottom + 6
    if (top + menuRect.height + 8 > window.innerHeight) {
        top = Math.max(8, anchorRect.top - menuRect.height - 6)
    }
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`
    activeMacroDeleteMenu = menu

    const onMouseDown = (e: MouseEvent) => {
        if (!menu!.contains(e.target as Node)) closeMacroDeleteMenu()
    }
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeMacroDeleteMenu()
    }
    const onViewportChange = () => closeMacroDeleteMenu()
    document.addEventListener('mousedown', onMouseDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('resize', onViewportChange, true)
    window.addEventListener('scroll', onViewportChange, true)
    clearMacroDeleteMenuHandlers = () => {
        document.removeEventListener('mousedown', onMouseDown, true)
        document.removeEventListener('keydown', onKeyDown, true)
        window.removeEventListener('resize', onViewportChange, true)
        window.removeEventListener('scroll', onViewportChange, true)
    }
}

// ----------------------------- Types

type Key = string
type RenderKey = string | ID

interface ChoiceState {
    state: State
    choicePrompt: string
    options: Option<any>[]
    info: string[]
    chosen: number[]
    resolve: (n: number, shifted: boolean) => void
    reject: (x: any) => void
}

type MacroVerb = 'Choose' | 'Buy' | 'Play' | 'Use'
type CardMacro = { kind: 'card', card: Card, chosen: boolean, verb: MacroVerb }
type StringMacro = { kind: 'string', string: string, verb: MacroVerb }
type MacroStep = CardMacro | StringMacro
interface MacroRequirements {
    coin: number
    actions: number
    buys: number
    hand: Map<string, number>
    discard: Map<string, number>
}

interface Macro {
    steps: MacroStep[]
    requirements: MacroRequirements
    startPrompt: string | null
}

interface MacroMatchResult {
    option: number | null
    failed: boolean
}

interface CardRenderOptions {
    option?: number
    pick?: number
    hotkey?: Key
}

interface RenderSettings {
    hotkeyMap?: Map<number | string, Key>
    optionsMap?: Map<number, (shifted: boolean) => void>
    pickMap?: Map<number | string, number>
    updateURL?: boolean
}

type ZoneName = 'play' | 'supply' | 'events' | 'hand' | 'discard' | 'potions' | 'relics'
const zoneNames: ZoneName[] = ['play', 'supply', 'events', 'hand', 'discard', 'potions', 'relics']

// ----------------------------- Hotkeys

// Exported so metaUI can also use the same keyboard system
export const keyListeners: Map<Key, () => void> = new Map()
const potionHotkeys: Key[] = ['!', '@', '#', '$', '%']
const symbolHotkeys = ['!', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']']
const lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']
const upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
const numHotkeys: Key[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const supplyAndPlayHotkeys: Key[] = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys)
const handHotkeys = lowerHotkeys.concat(upperHotkeys)
const hotkeys: Key[] = potionHotkeys.concat(supplyAndPlayHotkeys).concat(handHotkeys)

export function initHotkeys(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.altKey || e.ctrlKey || e.metaKey) return

        const listener = keyListeners.get(e.key)
        if (listener) {
            e.preventDefault()
            listener()
        }
        if (e.key === ' ') {
            e.preventDefault()
        }
        if (e.key === 'Shift') {
            document.body.classList.add('shift-held')
        }
    })

    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            document.body.classList.remove('shift-held')
        }
    })
}

// ----------------------------- Utility Functions

function assertNever(x: never): never {
    throw new Error(`Unexpected: ${x}`)
}

function renderHotkey(hotkey: Key): string {
    if (hotkey === ' ') hotkey = '&#x23B5;'
    return `<div class="hotkey">${hotkey}</div> `
}

function interpretHint(hint: HotkeyHint | undefined): Key | undefined {
    if (!hint) return undefined
    switch (hint.kind) {
        case 'number':
            const candidates = numHotkeys.concat(lowerHotkeys).concat(upperHotkeys)
            return hint.val < candidates.length ? candidates[hint.val] : undefined
        case 'none':
            return ' '
        case 'boolean':
            return hint.val ? 'y' : 'n'
        case 'key':
            return hint.val
        default:
            return assertNever(hint)
    }
}

function renderKey(x: OptionRender): RenderKey {
    switch (x.kind) {
        case 'card': return x.card.id
        case 'string': return x.string
        default: return assertNever(x)
    }
}

function getIfDef<S, T>(m: Map<S, T> | undefined, x: S): T | undefined {
    return m?.get(x)
}

function repeat<T>(xs: T[], n: number): T[] {
    return Array(n).fill(xs).flat(1)
}

function emptyMacroRequirements(): MacroRequirements {
    return {
        coin: 0,
        actions: 0,
        buys: 0,
        hand: new Map(),
        discard: new Map()
    }
}

function cardCountsByName(cards: Card[]): Map<string, number> {
    const counts = new Map<string, number>()
    for (const card of cards) {
        counts.set(card.name, (counts.get(card.name) || 0) + 1)
    }
    return counts
}

function noteDecrease(
    target: Map<string, number>,
    start: Map<string, number>,
    current: Map<string, number>
): void {
    const names = new Set<string>([...start.keys(), ...current.keys()])
    for (const name of names) {
        const decrease = (start.get(name) || 0) - (current.get(name) || 0)
        if (decrease > 0) {
            target.set(name, Math.max(target.get(name) || 0, decrease))
        }
    }
}

function updateMacroRequirements(
    requirements: MacroRequirements,
    startState: State,
    currentState: State
): void {
    requirements.coin = Math.max(requirements.coin, startState.coin - currentState.coin)
    requirements.actions = Math.max(requirements.actions, startState.actions - currentState.actions)
    requirements.buys = Math.max(requirements.buys, startState.buys - currentState.buys)

    noteDecrease(
        requirements.hand,
        cardCountsByName(startState.hand),
        cardCountsByName(currentState.hand)
    )
    noteDecrease(
        requirements.discard,
        cardCountsByName(startState.discard),
        cardCountsByName(currentState.discard)
    )
}

function recomputeMacroRequirements(
    requirements: MacroRequirements,
    startState: State,
    states: State[]
): void {
    requirements.coin = 0
    requirements.actions = 0
    requirements.buys = 0
    requirements.hand.clear()
    requirements.discard.clear()
    for (const state of states) {
        updateMacroRequirements(requirements, startState, state)
    }
}

function hasRequiredCounts(
    required: Map<string, number>,
    current: Map<string, number>
): boolean {
    for (const [name, minimum] of required) {
        if ((current.get(name) || 0) < minimum) return false
    }
    return true
}

function canPlayMacro(macro: Macro, state: State, choiceState: ChoiceState | null): boolean {
    if (state.coin < macro.requirements.coin) return false
    if (state.actions < macro.requirements.actions) return false
    if (state.buys < macro.requirements.buys) return false
    if (!hasRequiredCounts(macro.requirements.hand, cardCountsByName(state.hand))) return false
    if (!hasRequiredCounts(macro.requirements.discard, cardCountsByName(state.discard))) return false
    if (choiceState === null) return false
    if (macro.startPrompt !== choiceState.choicePrompt) return false
    const firstStep = macro.steps[0]
    if (firstStep === undefined) return false
    if (matchMacro(firstStep, choiceState.state, choiceState.options, choiceState.chosen) === null) return false
    return true
}

function macroStepVerb(step: MacroStep): string {
    return step.verb
}

function macroStepLabel(step: MacroStep): string {
    if (step.kind === 'string') return step.string
    return step.card.name
}

function renderMacroTooltip(macro: Macro): string {
    if (macro.steps.length === 0) return '<div>No actions recorded.</div>'
    return macro.steps.map(step => `<div>${macroStepVerb(step)} ${macroStepLabel(step)}</div>`).join('')
}

// ----------------------------- Hotkey Mapper

class HotkeyMapper {
    map(state: State, options: Option<any>[]): Map<RenderKey, Key> {
        const result: Map<RenderKey, Key> = new Map()
        const taken: Map<Key, RenderKey> = new Map()
        const pickable: Set<RenderKey> = new Set(options.map(o => renderKey(o.render)))

        function takenByPickable(key: Key): boolean {
            const takenBy = taken.get(key)
            return takenBy !== undefined && pickable.has(takenBy)
        }

        function set(x: RenderKey, k: Key): void {
            result.set(x, k)
            taken.set(k, x)
        }

        function setFrom(cards: Card[], preferredHotkeys: Key[]) {
            const preferredSet = new Set(preferredHotkeys)
            const otherHotkeys = hotkeys.filter(x => !preferredSet.has(x))
            const toAssign = preferredHotkeys.concat(otherHotkeys).filter(x => !taken.has(x))

            for (const card of cards) {
                if (card.zoneIndex < toAssign.length) {
                    set(card.id, toAssign[card.zoneIndex])
                }
            }
        }

        // Assign hotkeys to zones in priority order
        setFrom(state.events, supplyAndPlayHotkeys)
        setFrom(state.supply, supplyAndPlayHotkeys)
        setFrom(state.hand, handHotkeys)
        setFrom(state.play, supplyAndPlayHotkeys)
        setFrom(state.potions, potionHotkeys)

        // Assign hinted hotkeys to options
        for (const option of options) {
            const hint = interpretHint(option.hotkeyHint)
            if (hint && !result.has(renderKey(option.render)) && !takenByPickable(hint)) {
                set(renderKey(option.render), hint)
            }
        }

        // Assign remaining hotkeys to unassigned options
        let index = 0
        for (const option of options) {
            if (!result.has(renderKey(option.render))) {
                while (index < hotkeys.length && takenByPickable(hotkeys[index])) {
                    index++
                }
                if (index < hotkeys.length) {
                    set(renderKey(option.render), hotkeys[index])
                }
            }
        }

        return result
    }
}

// ----------------------------- Token Renderer

class TokenRenderer {
    private tokenTypes: string[] = ['charge']
    private tokenColors = ['black', 'red', 'orange', 'green', 'fuchsia', 'blue']

    private getTokenIndex(token: string): number {
        let idx = this.tokenTypes.indexOf(token)
        if (idx < 0) {
            this.tokenTypes.push(token)
            idx = this.tokenTypes.length - 1
        }
        return idx
    }

    render(tokens: Map<string, number>): string {
        const parts: string[] = []
        for (const [token, count] of tokens) {
            if (count > 0) {
                const idx = this.getTokenIndex(token)
                const color = this.tokenColors[idx % this.tokenColors.length]
                const display = count === 1 ? '*' : count.toString()
                parts.push(`<span id='token' style='color:${color}'>${display}</span>`)
            }
        }
        return parts.length > 0 ? `(${parts.join('')})` : ''
    }

    renderTooltip(tokens: Map<string, number>): string {
        const parts: string[] = []
        for (const [token, count] of tokens) {
            if (count > 0) {
                parts.push(count === 1 ? token : `${token} (${count})`)
            }
        }
        return parts.length > 0 ? `Tokens: ${parts.join(', ')}` : ''
    }
}

// ----------------------------- Renderer State

interface RendererState {
    hotkeysOn: boolean
    userURL: boolean
    hotkeyMapper: HotkeyMapper
    tokenRenderer: TokenRenderer
    viewingKingdom: boolean
    viewingMacros: boolean
    logType: LogType
    compress: Record<ZoneName, boolean>
}

const globalRendererState: RendererState = {
    hotkeysOn: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('hotkeysOn')!) === true,
    userURL: true,
    viewingKingdom: false,
    viewingMacros: false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: 'energy',
    compress: {
        play: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compressplay')!) === true,
        supply: false,
        events: false,
        hand: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compresshand')!) === true,
        discard: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compressdiscard')!) === true,
        potions: false,
        relics: false
    }
}

function resetGlobalRenderer(): void {
    globalRendererState.hotkeyMapper = new HotkeyMapper()
    globalRendererState.tokenRenderer = new TokenRenderer()
}

// ----------------------------- Card Text Rendering

function describeCost(cost: Cost): string {
    const parts: string[] = []
    if (cost.coin > 0) parts.push(`lose $${cost.coin}`)
    if (cost.energy > 0) parts.push(`gain ${renderEnergy(cost.energy)}`)
    return `Cost: ${parts.length > 0 ? parts.join(' and ') : 'do nothing'}.`
}

function renderEffects(spec: CardSpec): string {
    const parts: string[] = []
    for (const effect of spec.effects || []) {
        parts.push(...effect.text)
    }
    return parts.map(x => `<div>${x}</div>`).join('')
}

function renderAbility(spec: CardSpec): string {
    const parts: string[] = []
    for (const effect of spec.ability || []) {
        parts.push(...effect.text.map(x => `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}

function renderTrigger(x: Trigger | Replacer, staticTrigger: boolean): string {
    const desc = staticTrigger ? '(static)' : '(effect)'
    return `<div>${desc} ${x.text}</div>`
}

function renderVariableCosts(cs: VariableCost[]): string {
    return cs.map(c => `<div>(cost) +${c.text}</div>`).join('')
}

function renderBuyable(bs: { text?: string }[]): string {
    return bs.filter(b => b.text).map(b => `<div>(req) ${b.text}</div>`).join('')
}

function isZero(c: Cost | undefined): boolean {
    return !c || renderCost(c) === ''
}

function renderRuleText(rule: Rule): string {
    const parts: string[] = []
    for (const trigger of rule.triggers || []) {
        parts.push(`<div>(rule) ${trigger.text}</div>`)
    }
    for (const replacer of rule.replacers || []) {
        parts.push(`<div>(rule) ${replacer.text}</div>`)
    }
    return parts.join('')
}

export function cardText(spec: CardSpec): string {
    return [
        spec.restrictions ? renderBuyable(spec.restrictions) : '',
        spec.variableCosts ? renderVariableCosts(spec.variableCosts) : '',
        renderEffects(spec),
        renderAbility(spec),
        (spec.triggers || []).map(x => renderTrigger(x, false)).join(''),
        (spec.replacers || []).map(x => renderTrigger(x, false)).join(''),
        (spec.staticTriggers || []).map(x => renderTrigger(x, true)).join(''),
        (spec.staticReplacers || []).map(x => renderTrigger(x, true)).join(''),
        (spec.rules || []).map(renderRuleText).join('')
    ].join('')
}

// ----------------------------- Tooltip Rendering

function renderTooltipSimple(card: Card, state: State, tokenRenderer: TokenRenderer): string {
    const buyStr = !isZero(card.spec.buyCost) ? `(${renderCost(card.spec.buyCost!)})` : '---'
    const costStr = !isZero(card.spec.fixedCost) ? `(${renderCost(card.spec.fixedCost!)})` : '---'
    const header = `<div>---${buyStr} ${card.name} ${costStr}---</div>`
    const tokensHtml = tokenRenderer.renderTooltip(card.tokens)
    const bodyText = card.spec.simpleText
        ? card.spec.simpleText.map(line => `<div>${line}</div>`).join('')
        : cardText(card.spec)
    return header + bodyText + tokensHtml
}

function renderTooltipFull(card: Card, state: State, tokenRenderer: TokenRenderer): string {
    const buyStr = !isZero(card.spec.buyCost) ? `(${renderCost(card.spec.buyCost!)})` : '---'
    const costStr = !isZero(card.spec.fixedCost) ? `(${renderCost(card.spec.fixedCost!)})` : '---'
    const header = `<div>---${buyStr} ${card.name} ${costStr}---</div>`
    const tokensHtml = tokenRenderer.renderTooltip(card.tokens)
    const baseFilling = header + cardText(card.spec) + tokensHtml

    const relatedFilling = card.relatedCards().map(spec => {
        const tempCard = new Card(spec, -1)
        return renderTooltipFull(tempCard, state, tokenRenderer)
    }).join('')

    return baseFilling + relatedFilling
}

// ----------------------------- Card/Shadow Rendering

function renderShadow(shadow: Shadow, state: State, tokenRenderer: TokenRenderer): string {
    const card = shadow.spec.card
    const tokenhtml = tokenRenderer.render(card.tokens)
    let tooltip: string

    switch (shadow.spec.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.spec.card.spec)
            break
        case 'trigger':
            tooltip = renderTrigger(shadow.spec.trigger, false)
            break
        case 'effect':
            tooltip = renderEffects(shadow.spec.card.spec)
            break
        case 'cost':
            tooltip = describeCost(shadow.spec.cost)
            break
        case 'buying':
            tooltip = `Buying ${shadow.spec.card.name}`
            break
        default:
            return assertNever(shadow.spec)
    }

    return `<div class='card' tick=${shadow.tick} shadow='true'>
        <div class='cardbody'>${card}${tokenhtml}</div>
        <div class='cardcost'>&nbsp</div>
        <span class='tooltip tooltip-simple'>${tooltip}</span>
    </div>`
}

function renderCard(
    card: Card | Shadow,
    state: State,
    zone: PlaceName,
    options: CardRenderOptions,
    tokenRenderer: TokenRenderer,
    count: number = 1
): string {
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer)
    }

    const costType: 'use' | 'play' = zone === 'events' ? 'use' : 'play'
    const tokenhtml = tokenRenderer.render(card.tokens)
    const costhtml = zone === 'supply'
        ? renderCost(card.cost('buy', state)) || '&nbsp'
        : renderCost(card.cost(costType, state)) || '&nbsp'

    const picktext = options.pick !== undefined ? `<div class='pickorder'>${options.pick + 1}</div>` : ''
    const counttext = count !== 1 ? `<div class='cardcount'>${count}</div>` : ''
    const chosenText = options.pick !== undefined ? 'true' : 'false'
    const choosetext = options.option !== undefined
        ? `choosable chosen='${chosenText}' option=${options.option}`
        : ''
    const hotkeytext = options.hotkey ? renderHotkey(options.hotkey) : ''
    const ticktext = `tick=${card.ticks[card.ticks.length - 1]}`

    const replayUsedPotion = zone === 'potions' &&
        state.spec.replayUsedPotionIDs !== undefined &&
        state.spec.replayUsedPotionIDs.includes(card.id)
    const replayPotionClass = replayUsedPotion ? ' replay-used-potion' : ''

    return `<div id='card${card.id}' class='card${replayPotionClass}' ${ticktext} ${choosetext}>
        ${picktext} ${counttext}
        <div class='cardbody'>${hotkeytext} ${card}${tokenhtml}</div>
        <div class='cardcost'>${costhtml}</div>
        <span class='tooltip tooltip-simple'>${renderTooltipSimple(card, state, tokenRenderer)}</span>
        <span class='tooltip tooltip-full'>${renderTooltipFull(card, state, tokenRenderer)}</span>
    </div>`
}

// ----------------------------- Spec Rendering (for meta UI)

export function renderSpec(spec: CardSpec): string {
    const buyText = isZero(spec.buyCost) ? '' : `(${renderCost(spec.buyCost!)})&nbsp;`
    const costText = isZero(spec.fixedCost) ? '' : `&nbsp;(${renderCost(spec.fixedCost!)})`
    const header = `<div>${buyText}<strong>${spec.name}</strong>${costText}</div>`
    const me = `<div class='spec'>${header}${cardText(spec)}</div>`
    const related = (spec.relatedCards || []).map(renderSpec)
    return [me, ...related].join('')
}

export function buildSpecTooltip(spec: CardSpec): string {
    const buyStr = !isZero(spec.buyCost) ? `(${renderCost(spec.buyCost!)})` : '---'
    const costStr = !isZero(spec.fixedCost) ? `(${renderCost(spec.fixedCost!)})` : '---'
    const header = `<div>---${buyStr} ${spec.name} ${costStr}---</div>`
    const baseFilling = header + cardText(spec)
    const relatedFilling = (spec.relatedCards || []).map(buildSpecTooltip).join('')
    return baseFilling + relatedFilling
}

export function renderSpecNoRelated(spec: CardSpec): string {
    const buyText = isZero(spec.buyCost) ? '' : `(${renderCost(spec.buyCost!)})&nbsp;`
    const costText = isZero(spec.fixedCost) ? '' : `&nbsp;(${renderCost(spec.fixedCost!)})`
    const header = `<div>${buyText}<strong>${spec.name}</strong>${costText}</div>`
    const displayText = spec.simpleText
        ? spec.simpleText.map(line => `<div>${line}</div>`).join('')
        : cardText(spec)
    const tooltipHtml = buildSpecTooltip(spec)
    return `<div class='spec'>${header}${displayText}<span class='tooltip'>${tooltipHtml}</span></div>`
}

// ----------------------------- Zone Rendering

function sketchMap<T>(x: Map<T, number>): string {
    return [...x.entries()]
        .filter(([_, v]) => v > 0)
        .map(([k, v]) => `${k}${v}`)
        .sort()
        .join(',')
}

function sketchCard(card: Card, settings: RenderSettings): string {
    return `${card.name}${sketchMap(card.tokens)}${getIfDef(settings.pickMap, card.id)}${getIfDef(settings.optionsMap, card.id)}`
}

function sketchCards(cards: Card[], settings: RenderSettings): Array<[string, { first: Card, last: Card, count: number }]> {
    const sketches: string[] = []
    const counts = new Map<string, number>()
    const first = new Map<string, Card>()
    const last = new Map<string, Card>()

    for (const card of cards) {
        const s = sketchCard(card, settings)
        if (!counts.has(s)) {
            sketches.push(s)
            first.set(s, card)
        }
        counts.set(s, (counts.get(s) || 0) + 1)
        last.set(s, card)
    }

    return sketches.map(s => [s, { first: first.get(s)!, last: last.get(s)!, count: counts.get(s) || 0 }])
}

function renderZone(state: State, zone: ZoneName, settings: RenderSettings = {}): void {
    const container = getElement(zone)
    const optionsFns: Array<(shifted: boolean) => void> = []
    const optionsIds: number[] = []

    function render(card: Card, count = 1, forceHotkey?: Key): string {
        let option: number | undefined
        const optionFn = getIfDef(settings.optionsMap, card.id)
        const hotkey = forceHotkey || getIfDef(settings.hotkeyMap, card.id)

        if (optionFn) {
            option = optionsFns.length
            optionsFns.push(optionFn)
            optionsIds.push(card.id)
            if (hotkey) keyListeners.set(hotkey, () => optionFn(false))
        }

        return renderCard(card, state, zone, { option, hotkey, pick: getIfDef(settings.pickMap, card.id) },
            globalRendererState.tokenRenderer, count)
    }

    const cards = state.zones.get(zone) || []
    const compress = globalRendererState.compress[zone]

    if (compress) {
        const sketches = sketchCards(cards, settings)
        container.innerHTML = sketches.map(
            ([_, data]) => render(data.last, data.count, settings.hotkeyMap?.get(data.first.id))
        ).join('')
    } else {
        container.innerHTML = cards.map(c => render(c)).join('')
    }

    // Bind click handlers
    for (let i = 0; i < optionsFns.length; i++) {
        const cardEl = getElement(`card${optionsIds[i]}`)
        if (cardEl) {
            cardEl.onclick = (e) => optionsFns[i]((e as MouseEvent).shiftKey)
        }
    }
}

// ----------------------------- State Rendering

declare global {
    interface Window {
        renderedState: State
        serverSeed?: string
    }
}

function renderState(state: State, settings: RenderSettings = {}): void {
    window.renderedState = state
    clearChoice()

    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false
    }

    getElement('resolvingHeader').innerHTML = 'Resolving:'

    // Display energy as X/Y where Y is par
    const par = state.spec.par
    const previousScore = state.spec.previousScore
    const previousDisplay = (previousScore === undefined || previousScore === null)
        ? ''
        : ` (previous: ${previousScore})`
    const energyDisplay = `${state.energy}/${par}${previousDisplay}`
    const energyEl = getElement('energy')
    if (state.energy > par) {
        energyEl.innerHTML = `<span style="color: red">${energyDisplay}</span>`
    } else {
        energyEl.innerHTML = energyDisplay
    }

    getElement('actions').innerHTML = state.actions.toString()
    getElement('buys').innerHTML = state.buys.toString()
    getElement('coin').innerHTML = state.coin.toString()
    getElement('points').innerHTML = `${state.points}/${state.vp_goal}`

    const resolvingEl = getElement('resolving')
    resolvingEl.innerHTML = state.resolving.map(
        c => renderCard(c, state, 'resolving', {}, globalRendererState.tokenRenderer)
    ).join('')

    for (const zone of zoneNames) {
        renderZone(state, zone, settings)
        const zoneNameEl = querySelector(`[zone='${zone}'] .zonename`)
        if (zoneNameEl) {
            (zoneNameEl as HTMLElement).onclick = () => {
                globalRendererState.compress[zone] = !globalRendererState.compress[zone]
                localStorage.setItem(`compress${zone}`, JSON.stringify(globalRendererState.compress[zone]))
                renderZone(state, zone, settings)
            }
        }
    }

    getElement('playsize').innerHTML = '' + state.play.length
    getElement('handsize').innerHTML = '' + state.hand.length
    getElement('discardsize').innerHTML = '' + state.discard.length
}

// ----------------------------- Log Rendering

function bindLogTypeButtons(state: State, ui: GameUI): void {
    const inputs = querySelectorAll(`input[name='logType']`)
    inputs.forEach(input => {
        (input as HTMLInputElement).onchange = function() {
            const logType = (this as HTMLInputElement).value as LogType
            globalRendererState.logType = logType
            setVisibleLog(state, logType, ui)
        }
    })
}

function setVisibleLog(state: State, logType: LogType, ui: GameUI): void {
    for (const lt of logTypes) {
        const el = querySelector(`.logOption[option=${lt}]`)
        if (el) {
            if (lt === globalRendererState.logType) {
                el.removeAttribute('choosable')
            } else {
                el.setAttribute('choosable', 'true')
            }
        }
    }
    displayLogLines(state.logs[logType], ui)
}

function displayLogLines(logs: [string, State | null][], ui: GameUI): void {
    const result: string[] = []
    for (let i = logs.length - 1; i >= 0; i--) {
        result.push(`<div><span class="logLine" pos=${i}>${logs[i][0]}</span></div>`)
    }
    getElement('log').innerHTML = result.join('')

    for (const [i, [_, state]] of logs.entries()) {
        if (state !== null) {
            const logLine = querySelector(`.logLine[pos='${i}']`)
            if (logLine) {
                (logLine as HTMLElement).onclick = () => {
                    if (ui.choiceState) {
                        ui.choiceState.reject(new SetState(state))
                    }
                }
            }
        }
    }
}

// ----------------------------- Choice Rendering

function clearChoice(): void {
    keyListeners.clear()
    getElement('choicePrompt').innerHTML = ''
    getElement('options').innerHTML = ''
    getElement('undoArea').innerHTML = ''
}

interface StringOption {
    render: string
    value: (shifted: boolean) => void
}

function renderStringOption(option: StringOption, hotkey?: Key, pick?: number): HTMLElement {
    const hotkeyText = hotkey ? renderHotkey(hotkey) : ''
    if (hotkey) keyListeners.set(hotkey, () => option.value(false))
    const picktext = pick !== undefined ? `<div class='pickorder'>${pick}</div>` : ''
    const el = createElementFromHTML(
        `<span class='option' choosable chosen='false'>${picktext}${hotkeyText}${option.render}</span>`
    )
    el.onclick = (e) => option.value((e as MouseEvent).shiftKey)
    return el
}

function renderChoice(
    ui: GameUI | null,
    state: State,
    choicePrompt: string,
    options: Option<(shifted: boolean) => void>[],
    picks: OptionRender[] = []
): void {
    const optionsMap = new Map<number, (shifted: boolean) => void>()
    const stringOptions: StringOption[] = []

    for (const option of options) {
        const rendered = option.render
        if (rendered.kind === 'string') {
            stringOptions.push({ render: rendered.string, value: option.value })
        } else if (rendered.kind === 'card') {
            optionsMap.set(rendered.card.id, option.value)
        }
    }

    const pickMap = new Map<RenderKey, number>()
    for (const [i, x] of picks.entries()) {
        pickMap.set(renderKey(x), i)
    }

    const hotkeyMap = globalRendererState.hotkeysOn
        ? globalRendererState.hotkeyMapper.map(state, options)
        : new Map<RenderKey, Key>()

    renderState(state, { hotkeyMap, optionsMap, pickMap, updateURL: false })

    if (ui) {
        setVisibleLog(state, globalRendererState.logType, ui)
        bindLogTypeButtons(state, ui)
    }

    getElement('choicePrompt').innerHTML = choicePrompt
    const optionsEl = getElement('options')
    clearElement(optionsEl)

    for (const option of stringOptions) {
        const hotkey = hotkeyMap.get(option.render)
        optionsEl.appendChild(renderStringOption(option, hotkey, pickMap.get(option.render)))
    }

    getElement('undoArea').innerHTML = renderSpecials(state)
    if (ui) bindSpecials(state, ui)
}

// ----------------------------- Special Buttons

function renderSpecials(state: State): string {
    return [
        renderBack(),
        renderUndo(state.undoable()),
        renderRedo(state.redo.length > 0),
        renderHotkeyToggle(),
        renderMacroToggle(),
        renderRestart(),
    ].join('')
}

function renderBack(): string {
    return `<span class='option' option='back' choosable chosen='false'>${renderHotkey('Esc')}Back</span>`
}

function renderRestart(): string {
    return `<span id='restart' class='option' option='restart' choosable chosen='false'>Restart</span>`
}

function renderKingdomViewer(): string {
    return `<span id='viewKingdom' class='option' option='viewKingdom' choosable chosen='false'>Kingdom</span>`
}

function renderMacroToggle(): string {
    return `<span id='macroToggle' class='option' option='macroToggle' choosable chosen='false'>Macros</span>`
}

function renderHotkeyToggle(): string {
    return `<span class='option' option='hotkeyToggle' choosable chosen='false'>${renderHotkey('/')} Hotkeys</span>`
}

function renderHelp(): string {
    return `<span id='help' class='option' option='help' choosable chosen='false'>${renderHotkey('?')} Help</span>`
}

function renderDeepLink(): string {
    return `<span id='deeplink' class='option' option='link' choosable chosen='false'>Link</span>`
}

function renderUndo(undoable: boolean): string {
    return `<span class='option' option='undo' choosable chosen='false'>${renderHotkey('z')}Undo</span>`
}

function renderRedo(redoable: boolean): string {
    return `<span class='option' option='redo' ${redoable ? 'choosable' : ''} chosen='false'>${renderHotkey('Z')}Redo</span>`
}

// ----------------------------- Special Button Bindings

function bindSpecials(state: State, ui: GameUI): void {
    bindHotkeyToggle(ui)
    bindRestart(state, ui)
    bindUndo(state, ui)
    bindRedo(state, ui)
    bindMacroToggle(state, ui)
    bindBack(ui)
}

function bindBack(ui: GameUI): void {
    function pick() {
        if (ui.choiceState) {
            const state = ui.choiceState.state
            // Capture full history and redo buffer for restoration on meta-redo
            const history = state.origin().future
            const redo = state.redo
            ui.choiceState.reject(new UndoPastBeginning(history, redo))
        }
    }
    keyListeners.set('Escape', pick)
    const el = querySelector(`[option='back']`)
    if (el) (el as HTMLElement).onclick = pick
}

function bindViewKingdom(state: State): void {
    function onClick() {
        const container = getElement('kingdomViewSpot')
        if (globalRendererState.viewingKingdom) {
            container.innerHTML = ''
            globalRendererState.viewingKingdom = false
        } else {
            const contents = state.events.concat(state.supply).map(card => renderSpec(card.spec)).join('')
            container.innerHTML = `<div id='kingdomView'>${contents}</div>`
            globalRendererState.viewingKingdom = true
        }
    }
    const el = querySelector(`[option='viewKingdom']`)
    if (el) (el as HTMLElement).onclick = onClick
}

function bindMacroToggle(state: State, ui: GameUI): void {
    function updateMacroDisplay() {
        const container = getElement('macroSpot')
        if (globalRendererState.viewingMacros) {
            makeMacroButtons(ui, container, state)
        } else {
            closeMacroDeleteMenu()
            container.innerHTML = ''
        }
    }
    updateMacroDisplay()

    const el = querySelector(`[option='macroToggle']`)
    if (el) {
        (el as HTMLElement).onclick = () => {
            globalRendererState.viewingMacros = !globalRendererState.viewingMacros
            updateMacroDisplay()
        }
    }
}

function makeMacroButtons(ui: GameUI, container: HTMLElement, state: State): void {
    closeMacroDeleteMenu()
    const macroButtons = ui.macros.map((macro, index) => renderPlayMacroButton(macro, index, canPlayMacro(macro, state, ui.choiceState)))
    const contents = [renderRecordMacroButton(ui), ...macroButtons].join('')
    container.innerHTML = `<div id='macros'>${contents}</div>`
    bindRecordMacroButton(ui, state)
    bindPlayMacroButtons(ui, state)
}

function renderRecordMacroButton(ui: GameUI): string {
    const buttonText = ui.recordingMacro === null ? 'Start recording' : 'Stop recording'
    return `<span id='recordMacro' class='option' option='recordMacro' choosable chosen='false'>${buttonText}</span>`
}

function renderPlayMacroButton(macro: Macro, index: number, enabled: boolean): string {
    const firstStep = macro.steps[0]
    const firstStepText = firstStep ? macroStepLabel(firstStep) : '(empty)'
    const buttonText = `${firstStepText} (${macro.steps.length})`
    const statusAttr = enabled ? 'choosable' : `disabled='disabled'`
    const styleAttr = enabled ? '' : `style='opacity:0.45; cursor:default;'`
    return `<span id='playMacro' class='option' option='macro${index}' ${statusAttr} chosen='false' ${styleAttr}>${buttonText}<span class='tooltip'>${renderMacroTooltip(macro)}</span></span>`
}

function bindRecordMacroButton(ui: GameUI, state: State): void {
    const el = querySelector(`[option='recordMacro']`)
    if (el) {
        (el as HTMLElement).onclick = () => {
            if (ui.recordingMacro === null) {
                ui.recordingMacro = {
                    steps: [],
                    requirements: emptyMacroRequirements(),
                    startPrompt: ui.choiceState ? ui.choiceState.choicePrompt : null
                }
                ui.recordingStates = ui.choiceState ? [ui.choiceState.state] : []
            } else if (ui.recordingMacro.steps.length === 0) {
                ui.recordingMacro = null
                ui.recordingStates = []
            } else {
                if (ui.choiceState) {
                    ui.observeRecordingState(ui.choiceState.state)
                }
                ui.macros.push({
                    steps: [...ui.recordingMacro.steps],
                    requirements: {
                        coin: ui.recordingMacro.requirements.coin,
                        actions: ui.recordingMacro.requirements.actions,
                        buys: ui.recordingMacro.requirements.buys,
                        hand: new Map(ui.recordingMacro.requirements.hand),
                        discard: new Map(ui.recordingMacro.requirements.discard)
                    },
                    startPrompt: ui.recordingMacro.startPrompt
                })
                ui.recordingMacro = null
                ui.recordingStates = []
            }
            makeMacroButtons(ui, getElement('macroSpot'), state)
        }
    }
}

function bindPlayMacroButtons(ui: GameUI, state: State): void {
    for (let i = 0; i < ui.macros.length; i++) {
        const el = querySelector(`[option='macro${i}']`)
        if (!el) continue
        const macroButton = el as HTMLElement
        macroButton.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            openMacroDeleteMenu(macroButton, () => {
                ui.macros.splice(i, 1)
                makeMacroButtons(ui, getElement('macroSpot'), ui.choiceState ? ui.choiceState.state : state)
            })
            return false
        }
        if (!canPlayMacro(ui.macros[i], state, ui.choiceState)) continue
        macroButton.onclick = (e) => {
            closeMacroDeleteMenu()
            if (ui.choiceState && ui.playingMacro.length === 0) {
                ui.playingMacro = repeat(ui.macros[i].steps, (e as MouseEvent).shiftKey ? 10 : 1)
                ui.macroStartState = ui.choiceState.state
                ui.resolveWithMacro()
            }
        }
    }
}

function bindHotkeyToggle(ui: GameUI): void {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn
        localStorage.setItem('hotkeysOn', JSON.stringify(globalRendererState.hotkeysOn))
        ui.render()
    }
    keyListeners.set('/', pick)
    const el = querySelector(`[option='hotkeyToggle']`)
    if (el) (el as HTMLElement).onclick = pick
}

function startState(state: State): State {
    return state.origin().update({ future: [] })
}

function bindRestart(state: State, ui: GameUI): void {
    const el = querySelector(`[option='restart']`)
    if (el) {
        (el as HTMLElement).onclick = () => {
            if (ui.choiceState) {
                ui.choiceState.reject(new SetState(startState(state)))
            }
        }
    }
}

function bindRedo(state: State, ui: GameUI): void {
    function pick() {
        if (ui.choiceState && state.redo.length > 0) {
            ui.choiceState.resolve(state.redo[state.redo.length - 1], false)
        }
    }
    keyListeners.set('Z', pick)
    const el = querySelector(`[option='redo']`)
    if (el) (el as HTMLElement).onclick = pick
}

function bindUndo(state: State, ui: GameUI): void {
    function pick() {
        if (ui.choiceState) {
            ui.choiceState.reject(new Undo(state))
        }
    }
    keyListeners.set('z', pick)
    const el = querySelector(`[option='undo']`)
    if (el) (el as HTMLElement).onclick = pick
}

function bindHelp(state: State, ui: GameUI): void {
    function pick() {
        alert('Hotkeys:\n/ - Toggle hotkeys\nz - Undo\nZ - Redo\n? - Help\nShift+click - Repeat action')
    }
    keyListeners.set('?', pick)
    const el = querySelector(`[option='help']`)
    if (el) (el as HTMLElement).onclick = pick
}

// ----------------------------- Macro Helpers

function choiceVerb(x: OptionRender, info: string[]): MacroVerb {
    if (!info.includes('actChoice')) return 'Choose'
    if (x.kind === 'string') return 'Choose'
    switch (x.card.place) {
        case 'supply': return 'Buy'
        case 'hand': return 'Play'
        case 'events': return 'Use'
        case 'potions': return 'Use'
        case 'play': return 'Use'
        default: return 'Choose'
    }
}

function macroStepFromChoice(x: OptionRender, chosen: boolean, info: string[]): MacroStep {
    const verb = choiceVerb(x, info)
    switch (x.kind) {
        case 'string': return { ...x, verb }
        case 'card': return { ...x, chosen, verb }
        default: return assertNever(x)
    }
}

function macroMismatch(card: Card, macroCard: Card): number {
    let result = 0
    for (const [token, count] of card.tokens) {
        if ((macroCard.tokens.get(token) || 0) < count) result++
    }
    for (const [token, count] of macroCard.tokens) {
        if ((card.tokens.get(token) || 0) < count) result++
    }
    return result
}

function macroMatchCandidate(card: Card, macroCard: Card): boolean {
    return card.place === macroCard.place && card.name === macroCard.name
}

function matchMacro<T>(macro: MacroStep, state: State, options: Option<T>[], chosen: number[]): number | null {
    let renders: [OptionRender, number][] = options.map((x, i) => [x.render, i])

    if (macro.kind === 'string') {
        renders = renders.filter(([r]) => r.kind === 'string' && r.string === macro.string)
        return renders.length > 0 ? renders[0][1] : null
    }

    renders = renders.filter(([r]) =>
        r.kind === 'card' &&
        macroMatchCandidate(r.card, macro.card) &&
        (chosen.includes(renders.find(x => x[0] === r)![1]) === macro.chosen)
    )

    renders.sort((a, b) => {
        if (a[0].kind === 'card' && b[0].kind === 'card') {
            return macroMismatch(a[0].card, macro.card) - macroMismatch(b[0].card, macro.card)
        }
        return 0
    })

    return renders.length > 0 ? renders[0][1] : null
}

// ----------------------------- GameUI Class

export class GameUI implements UI {
    public undoing = false
    public macros: Macro[] = []
    public recordingMacro: Macro | null = null
    public recordingStates: State[] = []
    public playingMacro: MacroStep[] = []
    public macroStartState: State | null = null
    public choiceState: ChoiceState | null = null

    recordStep(x: MacroStep): void {
        if (this.recordingMacro) {
            this.recordingMacro.steps.push(x)
        }
    }

    eraseStep(): void {
        if (this.recordingMacro) {
            if (this.recordingMacro.steps.length > 0) {
                this.recordingMacro.steps.pop()
            }
            if (this.recordingStates.length > 1) {
                this.recordingStates.pop()
            }
            if (this.recordingStates.length > 0) {
                recomputeMacroRequirements(
                    this.recordingMacro.requirements,
                    this.recordingStates[0],
                    this.recordingStates
                )
            } else {
                this.recordingMacro.requirements = emptyMacroRequirements()
            }
        }
    }

    observeRecordingState(state: State): void {
        if (this.recordingMacro === null) return
        if (this.recordingStates.length === 0) {
            this.recordingStates.push(state)
            return
        }
        this.recordingStates.push(state)
        recomputeMacroRequirements(
            this.recordingMacro.requirements,
            this.recordingStates[0],
            this.recordingStates
        )
    }

    matchNextMacroStep(): MacroMatchResult {
        const macro = this.playingMacro.shift()
        if (macro && this.choiceState) {
            const option = matchMacro(macro, this.choiceState.state, this.choiceState.options, this.choiceState.chosen)
            if (option === null) {
                this.playingMacro = []
                return { option: null, failed: true }
            }
            return { option, failed: false }
        }
        return { option: null, failed: false }
    }

    clearChoice(): void {
        this.choiceState = null
        clearChoice()
    }

    resolveWithMacro(): void {
        if (this.choiceState) {
            const match = this.matchNextMacroStep()
            if (match.option !== null) {
                this.choiceState.resolve(match.option, false)
            }
        }
    }

    render(): void {
        if (this.choiceState) {
            const cs = this.choiceState
            renderChoice(
                this,
                cs.state,
                cs.choicePrompt,
                cs.options.map((x, i) => ({ ...x, value: (shifted: boolean) => cs.resolve(i, shifted) })),
                cs.chosen.map(i => cs.options[i].render)
            )
        }
    }

    choice(
        state: State,
        choicePrompt: string,
        options: Option<any>[],
        info: string[],
        chosen: number[]
    ): Promise<number> {
        const ui = this
        return new Promise((resolve, reject) => {
            function newResolve(n: number, shifted: boolean) {
                ui.clearChoice()
                const macroStep = macroStepFromChoice(options[n].render, chosen.includes(n), info)
                ui.recordStep(macroStep)
                if (shifted) ui.playingMacro = repeat([macroStep], 9)
                if (ui.playingMacro.length === 0) {
                    ui.macroStartState = null
                }
                resolve(n)
            }

            function newReject(reason: any) {
                if (reason instanceof Undo) {
                    ui.undoing = true
                    ui.eraseStep()
                }
                if (reason instanceof SetState) {
                    ui.playingMacro = []
                    ui.macroStartState = null
                }
                ui.clearChoice()
                reject(reason)
            }

            ui.choiceState = {
                state,
                choicePrompt,
                options,
                info,
                chosen,
                resolve: newResolve,
                reject: newReject
            }

            ui.observeRecordingState(state)
            const macroMatch = ui.matchNextMacroStep()
            if (macroMatch.failed && ui.macroStartState !== null) {
                newReject(new SetState(ui.macroStartState))
                return
            }
            const chooseTrivial = ui.chooseTrivial(state, options, info)

            if (macroMatch.option !== null) {
                newResolve(macroMatch.option, false)
            } else if (chooseTrivial !== null) {
                if (ui.undoing) {
                    newReject(new Undo(state))
                } else {
                    newResolve(chooseTrivial, false)
                }
            } else {
                ui.undoing = false
                ui.render()
            }
        })
    }

    chooseTrivial(state: State, options: Option<any>[], info: string[]): number | null {
        if (info.includes('tutorial') || info.includes('actChoice')) return null
        if (options.length === 1) return 0
        return null
    }

    async victory(state: State): Promise<void> {
        const ui = this
        return new Promise((resolve, reject) => {
            ui.undoing = true

            function newReject(reason: any) {
                if (reason instanceof Undo) ui.undoing = true
                ui.clearChoice()
                reject(reason)
            }

            const options: Option<null>[] = [{
                render: { kind: 'string', string: 'Done' },
                value: null,
                hotkeyHint: { kind: 'key', val: '!' }
            }]

            ui.choiceState = {
                state,
                choicePrompt: `You won using ${state.energy} energy!`,
                options,
                info: ['victory'],
                chosen: [],
                resolve: () => {
                    ui.clearChoice()
                    resolve()
                },
                reject: newReject
            }
            ui.render()
        })
    }
}

// ----------------------------- Game Entry Point

export async function startGame(
    spec: GameSpec,
    initialHistory: Replayable[] = [],
    initialRedo: Replayable[] = []
): Promise<VictoryData> {
    resetGlobalRenderer()
    const ui = new GameUI()

    // Show game container
    showElement(getElement('gameContainer'))
    hideElement(getElement('stageScreen'))
    hideElement(getElement('pathSelectionScreen'))
    hideElement(getElement('victoryScreen'))
    hideElement(getElement('gameOverScreen'))
    updateGameReplaySidebar(spec.replayStage)

    return await playGame(spec, ui, initialHistory, initialRedo)
}
