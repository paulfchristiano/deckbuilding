// gameUI.ts - Game state rendering and interaction during gameplay
// This handles the in-game UI (playing cards, making choices, etc.)
// Extracted from main.ts to separate game UI from meta-game UI.

import { Cost, Shadow, State, Card, CardSpec, PlaceName, Rule, ID, VictoryData, UndoPastBeginning } from './gameLogic.js'
import { GameSpec, SlotSpec } from './gameLogic.js'
import { Trigger, Replacer, VariableCost, Token } from './gameLogic.js'
import { renderCost, renderEnergy } from './gameLogic.js'
import { LogType, logTypes } from './gameLogic.js'
import { Option, OptionRender, HotkeyHint } from './gameLogic.js'
import { UI, Undo, SetState } from './gameLogic.js'
import { playGame, initialState } from './gameLogic.js'

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

type CardMacro = { kind: 'card', card: Card, chosen: boolean }
type StringMacro = { kind: 'string', string: string }
type MacroStep = CardMacro | StringMacro
type Macro = MacroStep[]

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

interface StringOption {
    render: string
    value: (shifted: boolean) => void
}

type ZoneName = 'play' | 'supply' | 'events' | 'hand' | 'discard' | 'potions' | 'relics'
const zoneNames: ZoneName[] = ['play', 'supply', 'events', 'hand', 'discard', 'potions', 'relics']

// ----------------------------- Hotkeys

const keyListeners: Map<Key, () => void> = new Map()
const symbolHotkeys = ['!', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']']
const lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']
const upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']
const numHotkeys: Key[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const supplyAndPlayHotkeys: Key[] = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys)
const handHotkeys = lowerHotkeys.concat(upperHotkeys)
const hotkeys: Key[] = supplyAndPlayHotkeys.concat(handHotkeys)

// Initialize hotkey listeners
export function initHotkeys(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
        const listener = keyListeners.get(e.key)
        if (e.altKey || e.ctrlKey || e.metaKey) return
        if (listener != undefined) {
            e.preventDefault()
            listener()
        }
        if (e.key == ' ') {
            e.preventDefault()
        }
        if (e.key == 'Shift') {
            document.body.classList.add('shift-held')
        }
    })

    window.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key == 'Shift') {
            document.body.classList.remove('shift-held')
        }
    })
}

// ----------------------------- Utility Functions

function assertNever(x: never): never {
    throw new Error(`Unexpected: ${x}`)
}

function renderHotkey(hotkey: Key): string {
    if (hotkey == ' ') hotkey = '&#x23B5;'
    return `<div class="hotkey">${hotkey}</div> `
}

function interpretHint(hint: HotkeyHint | undefined): Key | undefined {
    if (hint == undefined) return undefined
    switch (hint.kind) {
        case "number":
            const n = hint.val
            const candidates = numHotkeys.concat(lowerHotkeys).concat(upperHotkeys)
            if (n < candidates.length) return candidates[n]
            else return undefined
        case "none":
            return ' '
        case "boolean":
            return (hint.val) ? 'y' : 'n'
        case "key":
            return hint.val
        default: return assertNever(hint)
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
    return (m == undefined) ? undefined : m.get(x)
}

function repeat<T>(xs: T[], n: number): T[] {
    return Array(n).fill(xs).flat(1)
}

function bindClickEvent(element: JQuery, handler: (shifted: boolean) => void): void {
    element.unbind('click')
    element.bind('click', e => handler(e.shiftKey))
}

// ----------------------------- Hotkey Mapper

class HotkeyMapper {
    constructor() { }

    map(state: State, options: Option<any>[]): Map<RenderKey, Key> {
        const result: Map<RenderKey, Key> = new Map()
        const taken: Map<Key, RenderKey> = new Map()
        const pickable: Set<RenderKey> = new Set()

        for (const option of options) {
            pickable.add(renderKey(option.render))
        }

        function takenByPickable(key: Key): boolean {
            const takenBy: RenderKey | undefined = taken.get(key)
            return (takenBy != undefined && pickable.has(takenBy))
        }

        function set(x: RenderKey, k: Key): void {
            result.set(x, k)
            taken.set(k, x)
        }

        function setFrom(cards: Card[], preferredHotkeys: Key[]) {
            const preferredSet: Set<Key> = new Set(preferredHotkeys)
            const otherHotkeys: Key[] = hotkeys.filter(x => !preferredSet.has(x))
            const toAssign: Key[] = (preferredHotkeys.concat(otherHotkeys)).filter(x => !taken.has(x))
            for (const card of cards) {
                let n = card.zoneIndex
                if (n < toAssign.length) {
                    set(card.id, toAssign[n])
                }
            }
        }

        // Put zones that are most important not to change earlier
        setFrom(state.events, supplyAndPlayHotkeys)
        setFrom(state.supply, supplyAndPlayHotkeys)
        setFrom(state.hand, handHotkeys)
        setFrom(state.play, supplyAndPlayHotkeys)

        for (const option of options) {
            const hint: Key | undefined = interpretHint(option.hotkeyHint)
            if (hint != undefined && !result.has(renderKey(option.render))) {
                if (!takenByPickable(hint))
                    set(renderKey(option.render), hint)
            }
        }

        let index = 0
        function nextHotkey(): Key | null {
            while (true) {
                const key: Key = hotkeys[index]
                if (!takenByPickable(key)) {
                    return key
                }
                else index++
            }
        }

        for (const option of options) {
            if (!result.has(renderKey(option.render))) {
                const key = nextHotkey()
                if (key != null) set(renderKey(option.render), key)
            }
        }

        return result
    }
}

// ----------------------------- Token Renderer

class TokenRenderer {
    private readonly tokenTypes: string[]

    constructor() {
        this.tokenTypes = ['charge']
    }

    tokenColor(token: string): string {
        const tokenColors: string[] = ['black', 'red', 'orange', 'green', 'fuchsia', 'blue']
        return tokenColors[this.tokenType(token) % tokenColors.length]
    }

    tokenType(token: string): number {
        const n: number = this.tokenTypes.indexOf(token)
        if (n >= 0) return n
        this.tokenTypes.push(token)
        return this.tokenTypes.length - 1
    }

    render(tokens: Map<string, number>): string {
        function f(n: number): string {
            return (n == 1) ? '*' : n.toString()
        }
        const tokenHtmls: string[] = []
        for (const token of tokens.keys()) {
            this.tokenType(token)
        }
        for (let i = 0; i < this.tokenTypes.length; i++) {
            const token = this.tokenTypes[i]
            const n = tokens.get(token) || 0
            if (n > 0) {
                tokenHtmls.push(`<span id='token' style='color:${this.tokenColor(token)}'>${f(n)}</span>`)
            }
        }
        return (tokenHtmls.length > 0) ? `(${tokenHtmls.join('')})` : ''
    }

    renderTooltip(tokens: Map<string, number>): string {
        function f(n: number, s: string): string {
            return (n == 1) ? s : `${s} (${n})`
        }
        const tokenHtmls: string[] = []
        for (const token of tokens.keys()) {
            this.tokenType(token)
        }
        for (const token of this.tokenTypes) {
            const n = tokens.get(token) || 0
            if (n > 0) tokenHtmls.push(f(n, token))
        }
        return (tokenHtmls.length > 0) ? `Tokens: ${tokenHtmls.join(', ')}` : ''
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

// ----------------------------- Callbacks for Meta-game Integration


// ----------------------------- Card Text Rendering

function describeCost(cost: Cost): string {
    const coinCost = (cost.coin > 0) ? [`lose $${cost.coin}`] : []
    const energyCost = (cost.energy > 0) ? [`gain ${renderEnergy(cost.energy)}`] : []
    const costs = coinCost.concat(energyCost)
    const costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing'
    return `Cost: ${costStr}.`
}

function renderEffects(spec: CardSpec): string {
    let parts: string[] = []
    for (const effect of spec.effects || []) {
        parts = parts.concat(effect.text)
    }
    return parts.map(x => `<div>${x}</div>`).join('')
}

function renderAbility(spec: CardSpec): string {
    let parts: string[] = []
    for (const effect of spec.ability || []) {
        parts = parts.concat(effect.text.map(x => `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}

function renderTrigger(x: Trigger | Replacer, staticTrigger: boolean): string {
    const desc: string = (staticTrigger) ? '(static)' : '(effect)'
    return `<div>${desc} ${x.text}</div>`
}

function renderVariableCosts(cs: VariableCost[]): string {
    return cs.map(c => `<div>(cost) +${c.text}</div>`).join('')
}

function renderBuyable(bs: { text?: string }[]): string {
    return bs.map(
        b => (b.text == undefined) ? '' : `<div>(req) ${b.text}</div>`
    ).join('')
}

function isZero(c: Cost | undefined): boolean {
    return (c === undefined || renderCost(c) == '')
}

function renderRuleText(rule: Rule): string {
    const parts: string[] = []
    for (const trigger of (rule.triggers || [])) {
        parts.push(`<div>(rule) ${trigger.text}</div>`)
    }
    for (const replacer of (rule.replacers || [])) {
        parts.push(`<div>(rule) ${replacer.text}</div>`)
    }
    return parts.join('')
}

export function cardText(spec: CardSpec): string {
    const effectHtml: string = renderEffects(spec)
    const buyableHtml: string = (spec.restrictions != undefined) ? renderBuyable(spec.restrictions) : ''
    const costHtml: string = (spec.variableCosts != undefined) ? renderVariableCosts(spec.variableCosts) : ''
    const abilitiesHtml: string = renderAbility(spec)
    const triggerHtml: string = (spec.triggers || []).map(
        x => renderTrigger(x, false)
    ).join('')
    const replacerHtml: string = (spec.replacers || []).map(
        x => renderTrigger(x, false)
    ).join('')
    const staticTriggerHtml: string = (spec.staticTriggers || []).map(
        x => renderTrigger(x, true)
    ).join('')
    const staticReplacerHtml: string = (spec.staticReplacers || []).map(
        x => renderTrigger(x, true)
    ).join('')
    const rulesHtml: string = (spec.rules || []).map(renderRuleText).join('')
    return [buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml].join('')
}

// ----------------------------- Tooltip Rendering

function renderTooltipSimple(card: Card, state: State, tokenRenderer: TokenRenderer): string {
    const buyStr = !isZero(card.spec.buyCost) ?
        `(${renderCost(card.spec.buyCost as Cost)})` : '---'
    const costStr = !isZero(card.spec.fixedCost) ?
        `(${renderCost(card.spec.fixedCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${card.name} ${costStr}---</div>`
    const tokensHtml: string = tokenRenderer.renderTooltip(card.tokens)
    const bodyText = card.spec.simpleText
        ? card.spec.simpleText.map(line => `<div>${line}</div>`).join('')
        : cardText(card.spec)
    return header + bodyText + tokensHtml
}

function renderTooltipFull(card: Card, state: State, tokenRenderer: TokenRenderer): string {
    const buyStr = !isZero(card.spec.buyCost) ?
        `(${renderCost(card.spec.buyCost as Cost)})` : '---'
    const costStr = !isZero(card.spec.fixedCost) ?
        `(${renderCost(card.spec.fixedCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${card.name} ${costStr}---</div>`
    const tokensHtml: string = tokenRenderer.renderTooltip(card.tokens)
    const baseFilling: string = header + cardText(card.spec) + tokensHtml

    function renderRelated(spec: CardSpec) {
        const card: Card = new Card(spec, -1)
        return renderTooltipFull(card, state, tokenRenderer)
    }
    const relatedFilling: string = card.relatedCards().map(renderRelated).join('')

    return `${baseFilling}${relatedFilling}`
}

// ----------------------------- Card/Shadow Rendering

function renderShadow(shadow: Shadow, state: State, tokenRenderer: TokenRenderer): string {
    const card: Card = shadow.spec.card
    const tokenhtml: string = tokenRenderer.render(card.tokens)
    const costhtml: string = '&nbsp'
    const ticktext: string = `tick=${shadow.tick}`
    const shadowtext: string = `shadow='true'`
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
        default: return assertNever(shadow.spec)
    }
    return [`<div class='card' ${ticktext} ${shadowtext}>`,
        `<div class='cardbody'>${card}${tokenhtml}</div>`,
        `<div class='cardcost'>${costhtml}</div>`,
        `<span class='tooltip tooltip-simple'>${tooltip}</span>`,
        `</div>`].join('')
}

function renderCard(
    card: Card | Shadow,
    state: State,
    zone: PlaceName,
    options: CardRenderOptions,
    tokenRenderer: TokenRenderer,
    count: number = 1,
): string {
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer)
    } else {
        const costType: 'use' | 'play' = (zone == 'events') ? 'use' : 'play'
        const tokenhtml: string = tokenRenderer.render(card.tokens)
        const costhtml: string = (zone == 'supply') ?
            renderCost(card.cost('buy', state)) || '&nbsp' :
            renderCost(card.cost(costType, state)) || '&nbsp'
        const picktext: string = (options.pick !== undefined) ? `<div class='pickorder'>${options.pick + 1}</div>` : ''
        const counttext: string = (count != 1) ? `<div class='cardcount'>${count}</div>` : ''
        const chosenText: string = (options.pick !== undefined) ? 'true' : 'false'
        const choosetext: string = (options.option !== undefined)
            ? `choosable chosen='${chosenText}' option=${options.option}`
            : ''
        const hotkeytext: string = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : ''
        const ticktext: string = `tick=${card.ticks[card.ticks.length - 1]}`
        const result = `<div id='card${card.id}' class='card' ${ticktext} ${choosetext}> ${picktext} ${counttext}
                    <div class='cardbody'>${hotkeytext} ${card}${tokenhtml}</div>
                    <div class='cardcost'>${costhtml}</div>
                    <span class='tooltip tooltip-simple'>${renderTooltipSimple(card, state, tokenRenderer)}</span>
                    <span class='tooltip tooltip-full'>${renderTooltipFull(card, state, tokenRenderer)}</span>
                </div>`
        return result
    }
}

// ----------------------------- Spec Rendering (for meta UI)

export function renderSpec(spec: CardSpec): string {
    const buyText = isZero(spec.buyCost) ? '' : `(${renderCost(spec.buyCost as Cost)})&nbsp;`
    const costText = isZero(spec.fixedCost) ? '' : `&nbsp;(${renderCost(spec.fixedCost as Cost)})`
    const header = `<div>${buyText}<strong>${spec.name}</strong>${costText}</div>`
    const me = `<div class='spec'>${header}${cardText(spec)}</div>`
    const related: string[] = (spec.relatedCards || []).map(renderSpec)
    return [me].concat(related).join('')
}

export function buildSpecTooltip(spec: CardSpec): string {
    const buyStr = !isZero(spec.buyCost) ?
        `(${renderCost(spec.buyCost as Cost)})` : '---'
    const costStr = !isZero(spec.fixedCost) ?
        `(${renderCost(spec.fixedCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${spec.name} ${costStr}---</div>`
    const baseFilling = header + cardText(spec)

    const relatedCards = spec.relatedCards || []
    const relatedFilling = relatedCards.map(r => buildSpecTooltip(r)).join('')

    return `${baseFilling}${relatedFilling}`
}

export function renderSpecNoRelated(spec: CardSpec): string {
    const buyText = isZero(spec.buyCost) ? '' : `(${renderCost(spec.buyCost as Cost)})&nbsp;`
    const costText = isZero(spec.fixedCost) ? '' : `&nbsp;(${renderCost(spec.fixedCost as Cost)})`
    const header = `<div>${buyText}<strong>${spec.name}</strong>${costText}</div>`

    const displayText = spec.simpleText
        ? spec.simpleText.map(line => `<div>${line}</div>`).join('')
        : cardText(spec)

    const tooltipHtml = buildSpecTooltip(spec)

    return `<div class='spec'>${header}${displayText}<span class='tooltip'>${tooltipHtml}</span></div>`
}

// ----------------------------- Zone Rendering

function sketchMap<T>(x: Map<T, number>): string {
    const kvs: string[] = [...x.entries()].filter(
        kv => kv[1] > 0
    ).map(
        kv => `${kv[0]}${kv[1]}`
    )
    kvs.sort()
    return kvs.join(',')
}

function sketchCard(card: Card, settings: RenderSettings) {
    return `${card.name}${sketchMap(card.tokens)}
            ${getIfDef(settings.pickMap, card.id)}
            ${getIfDef(settings.optionsMap, card.id)}`
}

function sketchCards(
    cards: Card[],
    settings: RenderSettings,
): Array<[string, { first: Card, last: Card, count: number }]> {
    const sketches: string[] = []
    const counts: Map<string, number> = new Map()
    const first: Map<string, Card> = new Map()
    const last: Map<string, Card> = new Map()
    for (const card of cards) {
        const s = sketchCard(card, settings)
        if (counts.get(s) === undefined) {
            sketches.push(s)
            first.set(s, card)
        }
        counts.set(s, (counts.get(s) || 0) + 1)
        last.set(s, card)
    }
    return sketches.map(s => [s, { first: first.get(s) as Card, last: last.get(s) as Card, count: counts.get(s) || 0 }])
}

function renderZone(state: State, zone: ZoneName, settings: RenderSettings = {}): void {
    const e = $(`#${zone}`)
    const optionsFns: (((shifted: boolean) => void)[]) = []
    const optionsIds: number[] = []

    function render(card: Card, count: number = 1, forceHotkey: Key | undefined = undefined): string {
        let option: number | undefined
        const optionFn = getIfDef(settings.optionsMap, card.id)
        const hotkey = forceHotkey || getIfDef(settings.hotkeyMap, card.id)
        if (optionFn !== undefined) {
            option = optionsFns.length
            optionsFns.push(optionFn)
            optionsIds.push(card.id)
            if (hotkey !== undefined) keyListeners.set(hotkey, () => optionFn(false))
        }
        const cardRenderOptions: CardRenderOptions = {
            option: option,
            hotkey: hotkey,
            pick: getIfDef(settings.pickMap, card.id),
        }
        return renderCard(card, state, zone,
            cardRenderOptions,
            globalRendererState.tokenRenderer, count)
    }

    const cards: Card[] = state.zones.get(zone) || []
    const compress: boolean = globalRendererState.compress[zone]

    if (compress) {
        const sketches = sketchCards(cards, settings)
        e.html(sketches.map(
            data => render(data[1].last, data[1].count || 0, settings.hotkeyMap?.get(data[1].first.id))
        ).join(''))
    } else {
        e.html(cards.map(c => render(c)).join(''))
    }

    for (const [i, fn] of optionsFns.entries()) {
        bindClickEvent(e.find(`#card${optionsIds[i]}`), fn)
    }
}

// ----------------------------- State Rendering

declare global {
    interface Window {
        renderedState: State
        serverSeed?: string
    }
}

/*
function linkForState(state: State, campaign: boolean = false): string {
    const cs = campaign ? 'campaign&' : ''
    return `play?${cs}${specToURL(state.spec)}#${state.serializeHistory(false)}`
}
    */

function renderState(
    state: State,
    settings: RenderSettings = {},
): void {
    window.renderedState = state
    clearChoice()

    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false
        // URL update disabled for meta-game integration
    }

    $('#resolvingHeader').html('Resolving:')

    // Display energy as X/Y where Y is par, red if over par
    const par = state.spec.par
    const energyDisplay = `${state.energy}/${par}`
    if (state.energy > par) {
        $('#energy').html(`<span style="color: red">${energyDisplay}</span>`)
    } else {
        $('#energy').html(energyDisplay)
    }

    $('#actions').html(state.actions.toString())
    $('#buys').html(state.buys.toString())
    $('#coin').html(state.coin.toString())
    $('#points').html(`${state.points}/${state.vp_goal}`)

    $('#resolving').empty()
    $('#resolving').html(state.resolving.map(
        c => renderCard(c, state, 'resolving', {}, globalRendererState.tokenRenderer)
    ).join(''))

    for (const zone of zoneNames) {
        renderZone(state, zone, settings)
        const e = $(`[zone='${zone}'] .zonename`)
        e.unbind('click')
        e.click(() => {
            globalRendererState.compress[zone] = !globalRendererState.compress[zone]
            localStorage.setItem(`compress${zone}`, JSON.stringify(globalRendererState.compress[zone]))
            renderZone(state, zone, settings)
        })
    }

    $('#playsize').html('' + state.play.length)
    $('#handsize').html('' + state.hand.length)
    $('#discardsize').html('' + state.discard.length)
}

// ----------------------------- Log Rendering

function bindLogTypeButtons(state: State, ui: GameUI): void {
    const e = $(`input[name='logType']`)
    e.off('change')
    e.change(function () {
        const logType = (this as any).value
        globalRendererState.logType = logType
        setVisibleLog(state, logType, ui)
    })
}

function setVisibleLog(state: State, logType: LogType, ui: GameUI): void {
    for (const lt of logTypes) {
        const e = $(`.logOption[option=${lt}]`)
        const choosable = e.attr('option') != globalRendererState.logType
        e.attr('choosable', choosable ? 'true' : null)
    }
    displayLogLines(state.logs[logType], ui)
}

function renderLogLine(msg: string, i: number): string {
    return `<div><span class="logLine" pos=${i}>${msg}</span></div>`
}

function displayLogLines(logs: [string, State | null][], ui: GameUI): void {
    const result: string[] = []
    for (let i = logs.length - 1; i >= 0; i--) {
        result.push(renderLogLine(logs[i][0], i))
    }
    $('#log').html(result.join(''))
    for (const [i, e] of logs.entries()) {
        const state: State | null = e[1]
        if (state !== null) {
            $(`.logLine[pos=${i}]`).click(function () {
                if (ui.choiceState !== null) {
                    ui.choiceState.reject(new SetState(state))
                }
            })
        }
    }
}

// ----------------------------- Choice Rendering

function clearChoice(): void {
    keyListeners.clear()
    $('#choicePrompt').html('')
    $('#options').html('')
    $('#undoArea').html('')
}

function renderStringOption(option: StringOption, hotkey?: Key, pick?: number): JQuery {
    const hotkeyText = (hotkey !== undefined) ? renderHotkey(hotkey) : ''
    if (hotkey !== undefined) keyListeners.set(hotkey, () => option.value(false))
    const picktext: string = (pick !== undefined) ? `<div class='pickorder'>${pick}</div>` : ''
    const e = $(`<span class='option' choosable chosen='false'>${picktext}${hotkeyText}${option.render}</span>`)
    bindClickEvent(e, option.value)
    return e
}

function renderChoice(
    ui: GameUI | null,
    state: State,
    choicePrompt: string,
    options: Option<(shifted: boolean) => void>[],
    picks: Array<OptionRender> = [],
): void {
    const optionsMap: Map<number, (shifted: boolean) => void> = new Map()
    const stringOptions: StringOption[] = []

    for (let i = 0; i < options.length; i++) {
        const rendered: OptionRender = options[i].render
        switch (rendered.kind) {
            case 'string':
                stringOptions.push({ render: rendered.string, value: options[i].value })
                break
            case 'card':
                optionsMap.set(rendered.card.id, options[i].value)
                break
            default: assertNever(rendered)
        }
    }

    let pickMap: Map<RenderKey, number> = new Map()
    for (const [i, x] of picks.entries()) {
        pickMap.set(renderKey(x), i)
    }

    const hotkeyMap: Map<RenderKey, Key> = (globalRendererState.hotkeysOn)
        ? globalRendererState.hotkeyMapper.map(state, options)
        : new Map()

    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap: optionsMap,
        pickMap: pickMap,
        updateURL: false
    })

    if (ui != null) {
        setVisibleLog(state, globalRendererState.logType, ui)
        bindLogTypeButtons(state, ui)
    }

    $('#choicePrompt').html(choicePrompt)
    $('#options').empty()
    for (const option of stringOptions) {
        const hotkey = hotkeyMap.get(option.render)
        $('#options').append(renderStringOption(
            option, hotkey, pickMap.get(option.render))
        )
    }
    $('#undoArea').html(renderSpecials(state))
    if (ui !== null) bindSpecials(state, ui)
}

// ----------------------------- Special Buttons

function renderSpecials(state: State): string {
    return [
        renderBack(),
        renderUndo(state.undoable()),
        renderRedo(state.redo.length > 0),
        renderHotkeyToggle(),
        renderMacroToggle(),
        renderKingdomViewer(),
        renderHelp(),
        renderRestart(),
        renderDeepLink()
    ].join('')
}

function renderBack(): string {
    return `<span class='option' option='back' choosable chosen='false'>Back</span>`
}

function renderRestart(): string {
    return `<span id='restart' class='option', option='restart' choosable chosen='false'>Restart</span>`
}

function renderKingdomViewer(): string {
    return `<span id='viewKingdom' class='option', option='viewKingdom' choosable chosen='false'>Kingdom</span>`
}

function renderMacroToggle(): string {
    return `<span id='macroToggle' class='option', option='macroToggle' choosable chosen='false'>Macros</span>`
}

function renderHotkeyToggle(): string {
    return `<span class='option', option='hotkeyToggle' choosable chosen='false'>${renderHotkey('/')} Hotkeys</span>`
}

function renderHelp(): string {
    return `<span id='help' class='option', option='help' choosable chosen='false'>${renderHotkey('?')} Help</span>`
}

function renderDeepLink(): string {
    return `<span id='deeplink' class='option', option='link' choosable chosen='false'>Link</span>`
}

function renderUndo(undoable: boolean): string {
    const hotkeyText = renderHotkey('z')
    return `<span class='option', option='undo' choosable chosen='false'>${hotkeyText}Undo</span>`
}

function renderRedo(redoable: boolean): string {
    const hotkeyText = renderHotkey('Z')
    return `<span class='option', option='redo' ${redoable ? 'choosable' : ''} chosen='false'>${hotkeyText}Redo</span>`
}

// ----------------------------- Special Button Bindings

function bindSpecials(state: State, ui: GameUI): void {
    bindHotkeyToggle(ui)
    bindHelp(state, ui)
    bindRestart(state, ui)
    bindUndo(state, ui)
    bindRedo(state, ui)
    bindMacroToggle(ui)
    bindViewKingdom(state)
    //bindDeepLink(state)
    bindBack(ui)
}

function bindBack(ui: GameUI): void {
    function pick() {
        if (ui.choiceState != null) {
            ui.choiceState.reject(new UndoPastBeginning())
        }
    }
    keyListeners.set('Escape', pick)
    $(`[option='back']`).on('click', pick)
}

function bindViewKingdom(state: State): void {
    function onClick() {
        const e = $('#kingdomViewSpot')
        if (globalRendererState.viewingKingdom) {
            e.html('')
            globalRendererState.viewingKingdom = false
        } else {
            const contents = state.events.concat(state.supply).map(
                card => renderSpec(card.spec)
            ).join('')
            e.html(`<div id='kingdomView'>${contents}</div>`)
            globalRendererState.viewingKingdom = true
        }
    }
    $(`[option='viewKingdom']`).on('click', onClick)
}

function bindMacroToggle(ui: GameUI): void {
    function makeMacroButtonsIfNeeded() {
        const e = $('#macroSpot')
        if (globalRendererState.viewingMacros) {
            makeMacroButtons(ui, e)
        } else {
            e.html('')
        }
    }
    makeMacroButtonsIfNeeded()
    function onClick() {
        globalRendererState.viewingMacros = !globalRendererState.viewingMacros
        makeMacroButtonsIfNeeded()
    }
    const e = $(`[option='macroToggle']`)
    e.off('click')
    e.on('click', onClick)
}

function makeMacroButtons(ui: GameUI, e: any): void {
    const contents = [renderRecordMacroButton(ui)].concat(
        ui.macros.map(renderPlayMacroButton)
    ).join('')
    e.html(`<div id='macros'>${contents}</div>`)
    bindRecordMacroButton(ui)
    bindPlayMacroButtons(ui)
}

function renderRecordMacroButton(ui: GameUI): string {
    const buttonText = (ui.recordingMacro === null)
        ? 'Start recording'
        : 'Stop recording'
    return `<span id='recordMacro' class='option'
             option='recordMacro' choosable chosen='false'>
                 ${buttonText}
             </span>`
}

function renderPlayMacroButton(macro: Macro, index: number): string {
    const optionText = `macro${index}`
    const firstStep = macro[0]
    const firstStepText = (firstStep.kind == 'card')
        ? firstStep.card.name
        : firstStep.string
    const buttonText = `${firstStepText} (${macro.length})`
    return `<span id='playMacro' class='option'
             option='${optionText}' choosable chosen='false'>
                 ${buttonText}
             </span>`
}

function bindRecordMacroButton(ui: GameUI): void {
    function onClick() {
        if (ui.recordingMacro === null) {
            ui.recordingMacro = []
        } else if (ui.recordingMacro.length == 0) {
            ui.recordingMacro = null
        } else {
            ui.macros.push(ui.recordingMacro)
            ui.recordingMacro = null
        }
        makeMacroButtons(ui, $('#macroSpot'))
    }
    const e = $(`[option='recordMacro'`)
    e.off('click')
    e.on('click', onClick)
}

function bindPlayMacroButtons(ui: GameUI): void {
    function onClick(i: number, shifted: boolean = false) {
        if (ui.choiceState !== null && ui.playingMacro.length == 0) {
            ui.playingMacro = repeat(ui.macros[i], shifted ? 10 : 1)
            ui.resolveWithMacro()
        }
    }
    for (const [i, macro] of ui.macros.entries()) {
        const e = $(`[option='macro${i}'`)
        e.off('click')
        e.on('click', (e) => onClick(i, e.shiftKey))
    }
}

function bindHotkeyToggle(ui: GameUI): void {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn
        localStorage.setItem('hotkeysOn', JSON.stringify(globalRendererState.hotkeysOn))
        ui.render()
    }
    keyListeners.set('/', pick)
    $(`[option='hotkeyToggle']`).on('click', pick)
}

function startState(state: State): State {
    return state.origin().update({ future: [] })
}

function bindRestart(state: State, ui: GameUI): void {
    function pick() {
        if (ui.choiceState !== null) {
            ui.choiceState.reject(new SetState(startState(state)))
        }
    }
    $(`[option='restart']`).on('click', pick)
}

function bindRedo(state: State, ui: GameUI): void {
    function pick() {
        if (ui.choiceState != null && state.redo.length > 0) {
            ui.choiceState.resolve(state.redo[state.redo.length - 1], false)
        }
    }
    keyListeners.set('Z', pick)
    $(`[option='redo']`).on('click', pick)
}

function bindUndo(state: State, ui: GameUI): void {
    function pick() {
        if (ui.choiceState != null) {
            ui.choiceState.reject(new Undo(state))
        }
    }
    keyListeners.set('z', pick)
    $(`[option='undo']`).on('click', pick)
}

/*
function bindDeepLink(state: State): void {
    $('#deeplink').click(() => showLinkDialog(linkForState(state)))
}
    */

function baseURL(): string {
    const url = window.location
    return url.protocol + '//' + url.host
}

function showLinkDialog(url: string): void {
    $('#scoreSubmitter').attr('active', 'true')
    $('#scoreSubmitter').html(
        `<label for="link">Link:</label>` +
        `<textarea id="link"></textarea>` +
        `<div>` +
        `<span class="option" choosable id="copyLink">${renderHotkey('⏎')}Copy</span>` +
        `<span class="option" choosable id="cancel">${renderHotkey('Esc')}Cancel</span>` +
        `</div>`
    )
    $('#link').val(`${baseURL()}?${url}`)
    $('#link').select()
    function exit() {
        $('#link').blur()
        $('#scoreSubmitter').attr('active', 'false')
    }
    function submit() {
        $('#link').select()
        document.execCommand('copy')
        exit()
    }
    $('#cancel').click(exit)
    $('#copyLink').click(submit)
    $('#link').keydown((e: any) => {
        if (e.keyCode == 27) {
            exit()
            e.preventDefault()
        } else if (e.keyCode == 13) {
            submit()
            e.preventDefault()
        }
    })
}

function bindHelp(state: State, ui: GameUI): void {
    function pick() {
        alert('Hotkeys:\n' +
            '/ - Toggle hotkeys\n' +
            'z - Undo\n' +
            'Z - Redo\n' +
            '? - Help\n' +
            'Shift+click - Repeat action')
    }
    keyListeners.set('?', pick)
    $(`[option='help']`).on('click', pick)
}

// ----------------------------- Macro Helpers

function macroStepFromChoice(x: OptionRender, chosen: boolean): MacroStep {
    switch (x.kind) {
        case 'string': return x
        case 'card': return { ...x, chosen: chosen }
        default: return assertNever(x)
    }
}

function macroMismatch(card: Card, macroCard: Card): number {
    let result: number = 0
    function addDisagreements(from: Card, to: Card) {
        for (const [token, count] of from.tokens.entries()) {
            if ((to.tokens.get(token) || 0) < count) {
                result += 1
            }
        }
    }
    addDisagreements(card, macroCard)
    addDisagreements(macroCard, card)
    return result
}

function macroMatchCandidate(card: Card, macroCard: Card): boolean {
    return (card.place == macroCard.place) && (card.name == macroCard.name)
}

function matchMacro<T>(
    macro: MacroStep,
    state: State,
    options: Option<T>[],
    chosen: number[],
): (number | null) {
    let renders: [OptionRender, number][]
    renders = options.map((x, i) => [x.render, i])
    switch (macro.kind) {
        case 'string':
            renders = renders.filter(x =>
                x[0].kind == 'string'
                && x[0].string == macro.string
            )
            return (renders.length > 0) ? renders[0][1] : null
        case 'card':
            renders = renders.filter(x =>
                x[0].kind == 'card'
                && macroMatchCandidate(x[0].card, macro.card)
                && ((chosen.indexOf(x[1]) >= 0) == macro.chosen)
            )
            const card = macro.card
            renders.sort((a, b) => {
                if (a[0].kind == 'card') {
                    if (b[0].kind == 'card') {
                        const c = a[0].card
                        const d = b[0].card
                        return macroMismatch(c, card) - macroMismatch(d, card)
                    } else {
                        return 1
                    }
                } else {
                    return -1
                }
            })
            return (renders.length > 0) ? renders[0][1] : null
    }
}

// ----------------------------- GameUI Class (webUI)

export class GameUI implements UI {
    public undoing: boolean = false
    public macros: Macro[] = []
    public recordingMacro: (MacroStep[] | null) = null
    public playingMacro: MacroStep[] = []
    public choiceState: ChoiceState | null = null

    constructor() {}

    recordStep(x: MacroStep): void {
        if (this.recordingMacro === null) return
        this.recordingMacro.push(x)
    }

    eraseStep(): void {
        if (this.recordingMacro === null) return
        this.recordingMacro.pop()
    }

    matchNextMacroStep(): number | null {
        const macro = this.playingMacro.shift()
        if (macro !== undefined && this.choiceState != null) {
            const option: number | null = matchMacro(
                macro,
                this.choiceState.state,
                this.choiceState.options,
                this.choiceState.chosen
            )
            if (option === null) this.playingMacro = []
            return option
        } else {
            return null
        }
    }

    clearChoice(): void {
        this.choiceState = null
        clearChoice()
    }

    resolveWithMacro(): void {
        if (this.choiceState !== null) {
            const option = this.matchNextMacroStep()
            if (option !== null) this.choiceState.resolve(option, false)
        }
    }

    render(): void {
        if (this.choiceState != null) {
            const cs = this.choiceState
            renderChoice(
                this,
                cs.state,
                cs.choicePrompt,
                cs.options.map((x, i) => ({ ...x, value: (shifted) => cs.resolve(i, shifted) })),
                cs.chosen.map(i => cs.options[i].render)
            )
        }
    }

    choice(
        state: State,
        choicePrompt: string,
        options: Option<any>[],
        info: string[],
        chosen: number[],
    ): Promise<number> {
        const ui: GameUI = this
        return new Promise(function (resolve, reject) {
            function newResolve(n: number, shifted: boolean) {
                ui.clearChoice()
                const macroStep = macroStepFromChoice(options[n].render, chosen.indexOf(n) >= 0)
                ui.recordStep(macroStep)
                if (shifted) ui.playingMacro = repeat([macroStep], 9)
                resolve(n)
            }
            function newReject(reason: any) {
                if (reason instanceof Undo) {
                    ui.undoing = true
                    ui.eraseStep()
                }
                ui.clearChoice()
                reject(reason)
            }

            ui.choiceState = {
                state: state,
                choicePrompt: choicePrompt,
                options: options,
                info: info,
                chosen: chosen,
                resolve: newResolve,
                reject: newReject,
            }

            const option: number | null = ui.matchNextMacroStep()
            const chooseTrivial: number | null = ui.chooseTrivial(state, options, info)
            if (option != null) {
                newResolve(option, false)
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

    chooseTrivial(
        state: State,
        options: Option<any>[],
        info: string[],
    ): number | null {
        if (info.indexOf('tutorial') != -1) return null
        if (info.indexOf('actChoice') != -1) return null
        if (options.length == 1) return 0
        return null
    }

    async victory(state: State): Promise<void> {
        const ui: GameUI = this
        const score = state.energy
        const remainingPotions = state.potions
        
        const submitOrUndo: () => Promise<void> = () =>

            new Promise(function (resolve, reject) {
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
                    state: state,
                    choicePrompt: `You won using ${state.energy} energy!`,
                    options: options,
                    info: ["victory"],
                    chosen: [],
                    resolve: (n, shifted) => {
                        ui.clearChoice()
                        resolve()
                    },
                    reject: newReject,
                }
                ui.render()
            })
        return submitOrUndo()
    }
}

// ----------------------------- Game Entry Points

export async function startGame(spec: GameSpec): Promise<VictoryData> {
    resetGlobalRenderer()

    const ui = new GameUI()

    // Show game container, hide other screens
    $('#gameContainer').show()
    $('#stageScreen').hide()
    $('#pathSelectionScreen').hide()
    $('#victoryScreen').hide()
    $('#gameOverScreen').hide()

    // Start the game loop
    return await playGame(spec, ui)
}