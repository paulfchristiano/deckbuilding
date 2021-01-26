// TODO: merge in the refactor from branch nodeck
// TODO: if a zone gets bigger and then smaller, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay out the zones a bit more nicely
// TODO: starting to see performance hiccups in big games
// TODO: probably don't want the public move method to allow moves into or out of resolving.

import { Cost, Shadow, State, Card, CardSpec, PlaceName } from './logic.js'
import { GameSpec, SlotSpec } from './logic.js'
import { Trigger, Replacer, Ability, VariableCost, Token } from './logic.js'
import { ID } from './logic.js'
import { renderCost, renderEnergy } from './logic.js'
import { emptyState } from './logic.js'
import { LogType, logTypes } from './logic.js'
import { sets } from './cards/index.js'
import { ExpansionName } from './logic.js'
import { Option, OptionRender, HotkeyHint } from './logic.js'
import { UI, SetState, Undo, Victory, InvalidHistory, ReplayEnded } from './logic.js'
import { playGame, initialState, verifyScore} from './logic.js'
import { Replay, coerceReplayVersion, parseReplay, MalformedReplay } from './logic.js'
import { allCards, allEvents, randomPlaceholder } from './logic.js'
import { VERSION, DEFAULT_VP_GOAL } from './logic.js'
import { MalformedSpec, getTutorialSpec, specToURL, specFromURL } from './logic.js'

// --------------------- Hotkeys

type Key = string

const keyListeners: Map<Key, () => void> = new Map();
const symbolHotkeys = ['!','%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']'] // '@', '#', '$' are confusing
const lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'] // 'z' reserved for undo
const upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'] // 'Z' reserved for redo
const numHotkeys:Key[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const supplyAndPlayHotkeys:Key[] = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys)
const handHotkeys = lowerHotkeys.concat(upperHotkeys)
// want to put zones that are least likely to change earlier, to not distrupt assignment
const hotkeys:Key[] = supplyAndPlayHotkeys.concat(handHotkeys)
const choiceHotkeys:Key[] = handHotkeys.concat(supplyAndPlayHotkeys)

window.addEventListener('keydown', (e: KeyboardEvent) => {
    const listener = keyListeners.get(e.key)
    if (e.altKey || e.ctrlKey || e.metaKey) return
    if (listener != undefined) {
        e.preventDefault()
        listener()
    }
    if (e.key == ' ') { //It's easy and annoying to accidentally hit space
        e.preventDefault()
    }
});

function renderHotkey(hotkey: Key) {
    if (hotkey == ' ') hotkey = '&#x23B5;'
    return `<div class="hotkey">${hotkey}</div> `
}

function interpretHint(hint:HotkeyHint|undefined): Key|undefined {
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
        default: assertNever(hint)
    }
}

//hashable version of optionRender
//must be distinct amongst options available at any given time
type RenderKey = string | ID

function renderKey(x:OptionRender): RenderKey {
    switch (x.kind) {
        case 'card': return x.card.id
        case 'string': return x.string
        default: assertNever(x)
    }
}

class HotkeyMapper {
    constructor() {
    }
    map(state:State, options:Option<any>[]): Map<RenderKey, Key> {
        const result:Map<RenderKey, Key> = new Map()
        const taken:Map<Key, RenderKey> = new Map()
        const pickable:Set<RenderKey> = new Set()
        for (const option of options) {
            pickable.add(renderKey(option.render))
        }
        function takenByPickable(key:Key): boolean {
            const takenBy:RenderKey|undefined = taken.get(key)
            return (takenBy != undefined && pickable.has(takenBy))
        }
        function set(x:RenderKey, k:Key): void {
            result.set(x, k)
            taken.set(k, x)
        }
        function setFrom(cards:Card[], preferredHotkeys:Key[]) {
            const preferredSet:Set<Key> = new Set(preferredHotkeys)
            const otherHotkeys:Key[] = hotkeys.filter(x => !preferredSet.has(x))
            const toAssign:Key[] = (preferredHotkeys.concat(otherHotkeys)).filter(x => !taken.has(x))
            for (const card of cards) {
                let n = card.zoneIndex
                if (n < toAssign.length) {
                    set(card.id, toAssign[n])
                }
            }
        }
        //want to put zones that are most important not to change earlier
        setFrom(state.events, supplyAndPlayHotkeys)
        setFrom(state.supply, supplyAndPlayHotkeys)
        setFrom(state.hand, handHotkeys)
        setFrom(state.play, supplyAndPlayHotkeys)
        for (const option of options) {
            const hint:Key|undefined = interpretHint(option.hotkeyHint);
            if (
                hint != undefined &&
                !result.has(renderKey(option.render))
            ) {
                if (!takenByPickable(hint))
                    set(renderKey(option.render), hint)
            }
        }
        let index = 0
        function nextHotkey(): Key|null {
            while (true) {
                const key:Key = hotkeys[index]
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

// ------------------ Rendering State

function assertNever(x: never): never {
    throw new Error(`Unexpected: ${x}`)
}

class TokenRenderer {
    private readonly tokenTypes:string[];
    constructor() {
        this.tokenTypes = ['charge'];
    }
    tokenColor(token:string): string {
        const tokenColors:string[] = ['black', 'red', 'orange', 'green', 'fuchsia', 'blue']
        return tokenColors[this.tokenType(token) % tokenColors.length]
    }
    tokenType(token:string): number {
        const n:number = this.tokenTypes.indexOf(token)
        if (n >= 0) return n
        this.tokenTypes.push(token)
        return this.tokenTypes.length - 1
    }
    render(tokens:Map<string, number>): string {
        function f(n:number): string {
            return (n == 1) ? '*' : n.toString()
        }
        const tokenHtmls:string[] = [];
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
    renderTooltip(tokens:Map<string, number>): string {
        function f(n:number, s:string): string {
            return (n == 1) ? s : `${s} (${n})`
        }
        const tokenHtmls:string[] = [];
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

function describeCost(cost:Cost): string {
    const coinCost = (cost.coin > 0) ? [`lose $${cost.coin}`] : []
    const energyCost = (cost.energy > 0) ? [`gain ${renderEnergy(cost.energy)}`] : []
    const costs = coinCost.concat(energyCost)
    const costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing'
    return `Cost: ${costStr}.`
}

function renderShadow(shadow:Shadow, state:State, tokenRenderer:TokenRenderer):string {
    const card:Card = shadow.spec.card
    const tokenhtml:string = tokenRenderer.render(card.tokens)
    const costhtml:string = '&nbsp'
    const ticktext:string = `tick=${shadow.tick}`
    const shadowtext:string = `shadow='true'`
    let tooltip:string;
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
        default: assertNever(shadow.spec)
    }
    return [`<div class='card' ${ticktext} ${shadowtext}>`,
             `<div class='cardbody'>${card}${tokenhtml}</div>`,
             `<div class='cardcost'>${costhtml}</div>`,
             `<span class='tooltip'>${tooltip}</span>`,
             `</div>`].join('')
}

function renderEffects(spec:CardSpec) {
    let parts:string[] = []
    for (const effect of spec.effects || []) {
        parts = parts.concat(effect.text)
    }
    return parts.map(x => `<div>${x}</div>`).join('')
}

function renderAbility(spec:CardSpec): string {
    let parts:string[] = []
    for (const effect of spec.ability || []) {
        parts = parts.concat(effect.text.map(x => `<div>(ability) ${x}</div>`))
    }
    return parts.join('')
}


function renderCard(
    card:Card|Shadow,
    state:State,
    zone:PlaceName,
    options:CardRenderOptions,
    tokenRenderer:TokenRenderer,
    count:number=1,
): string {
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer)
    } else {
        const costType:'use'|'play' = (zone == 'events') ? 'use' : 'play'
        const tokenhtml:string = tokenRenderer.render(card.tokens)
        const costhtml:string = (zone == 'supply') ?
            renderCost(card.cost('buy', state)) || '&nbsp' :
            renderCost(card.cost(costType, state)) || '&nbsp'
        const picktext:string = (options.pick !== undefined) ? `<div class='pickorder'>${options.pick+1}</div>` : ''
        const counttext:string = (count != 1) ? `<div class='cardcount'>${count}</div>` : ''
        const chosenText:string = (options.pick !== undefined) ? 'true' : 'false'
        const choosetext:string = (options.option !== undefined)
	        ? `choosable chosen='${chosenText}' option=${options.option}`
            : ''
        const hotkeytext:string = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : ''
        const ticktext:string = `tick=${card.ticks[card.ticks.length-1]}`
        const result = `<div id='card${card.id}' class='card' ${ticktext} ${choosetext}> ${picktext} ${counttext}
                    <div class='cardbody'>${hotkeytext} ${card}${tokenhtml}</div>
                    <div class='cardcost'>${costhtml}</div>
                    <span class='tooltip'>${renderTooltip(card, state, tokenRenderer)}</span>
                </div>`
        return result
    }
}

function renderTrigger(x:Trigger|Replacer, staticTrigger:boolean): string {
    const desc:string = (staticTrigger) ? '(static)' : '(effect)'
    return `<div>${desc} ${x.text}</div>`
}

function renderVariableCosts(cs:VariableCost[]): string {
    return cs.map(c => `<div>(cost) +${c.text}</div>`).join('')
}

function renderBuyable(bs:{text?:string}[]): string{
    return bs.map(
        b => (b.text == undefined) ? '' : `<div>(req) ${b.text}</div>`
    ).join('')
}

function isZero(c:Cost|undefined) {
    return (c===undefined || renderCost(c) == '')
}

function cardText(spec:CardSpec): string {
    const effectHtml:string = renderEffects(spec)
    const buyableHtml:string = (spec.restrictions != undefined) ? renderBuyable(spec.restrictions) : ''
    const costHtml:string = (spec.variableCosts != undefined) ? renderVariableCosts(spec.variableCosts) : ''
    const abilitiesHtml:string = renderAbility(spec)
    const triggerHtml:string = (spec.triggers || []).map(
        x => renderTrigger(x, false)
    ).join('')
    const replacerHtml:string = (spec.replacers || []).map(
        x => renderTrigger(x, false)
    ).join('')
    const staticTriggerHtml:string = (spec.staticTriggers || []).map(
        x => renderTrigger(x, true)
    ).join('')
    const staticReplacerHtml:string = (spec.staticReplacers || []).map(
        x => renderTrigger(x, true)
    ).join('')
    return [buyableHtml, costHtml, effectHtml, abilitiesHtml,
            triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml].join('')

}

function renderTooltip(card:Card, state:State, tokenRenderer:TokenRenderer): string {
    const buyStr = !isZero(card.spec.buyCost) ?
        `(${renderCost(card.spec.buyCost as Cost)})` : '---'
    const costStr = !isZero(card.spec.fixedCost) ?
        `(${renderCost(card.spec.fixedCost as Cost)})` : '---'
    const header = `<div>---${buyStr} ${card.name} ${costStr}---</div>`
    const tokensHtml:string = tokenRenderer.renderTooltip(card.tokens)
    const baseFilling:string = header + cardText(card.spec) + tokensHtml

    function renderRelated(spec:CardSpec) {
        const card:Card = new Card(spec, -1)
        return renderTooltip(card, state, tokenRenderer)
    }
    const relatedFilling:string = card.relatedCards().map(renderRelated).join('')

    return `${baseFilling}${relatedFilling}`
}

function renderSpec(spec:CardSpec): string {
    const buyText = isZero(spec.buyCost) ? '' : `(${renderCost(spec.buyCost as Cost)})&nbsp;`
    const costText = isZero(spec.fixedCost) ? '' : `&nbsp;(${renderCost(spec.fixedCost as Cost)})`
    const header = `<div>${buyText}<strong>${spec.name}</strong>${costText}</div>`
    const me = `<div class='spec'>${header}${cardText(spec)}</div>`
    const related:string[] = (spec.relatedCards || []).map(renderSpec)
    return [me].concat(related).join('')
}


interface CardRenderOptions {
    option?: number;
    pick?: number;
    hotkey?: Key;
}

function getIfDef<S, T>(m:Map<S, T>|undefined, x:S): T|undefined {
    return (m == undefined) ? undefined : m.get(x)
}

interface RenderSettings {
    hotkeyMap?: Map<number|string, Key>;
    optionsMap?: Map<number, (shifted:boolean)=>void>;
    pickMap?: Map<number|string, number>;
    updateURL?: boolean;
}

declare global {
    interface Window {
        renderedState: State;
        serverSeed?: string;
    }
}

//TODO: this is all a mess, this should be part of the webUI

interface RendererState {
    hotkeysOn:boolean;
    userURL:boolean;
    hotkeyMapper: HotkeyMapper;
    tokenRenderer: TokenRenderer;
    viewingKingdom: boolean,
    viewingMacros: boolean,
    logType:LogType,
    compress: {play: boolean, supply: boolean, events: boolean, hand: boolean, discard: boolean}
}

const globalRendererState:RendererState = {
    hotkeysOn:false,
    userURL:true,
    viewingKingdom:false,
    viewingMacros:false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType:'energy',
    compress: {play: false, supply: false, events: false, hand: false, discard: false}
}

type ZoneName = 'play' | 'supply' | 'events' | 'hand' | 'discard'
const zoneNames:ZoneName[] = ['play', 'supply', 'events', 'hand', 'discard']

function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper()
    globalRendererState.tokenRenderer = new TokenRenderer()
}

function linkForState(state:State, campaign:boolean=false) {
    const cs = campaign ? 'campaign&' : ''
    return `play?${cs}${specToURL(state.spec)}#${state.serializeHistory(false)}`
}

//Two maps should have the same sketch if the keys and values serialize the same
//0 is treated the same as no entry
function sketchMap<T>(x:Map<T, number>): string {
    const kvs:string[] = [...x.entries()].filter(
        kv => kv[1] > 0
    ).map(
        kv => `${kv[0]}${kv[1]}`
    )
    kvs.sort()
    return kvs.join(',')
}

function renderZone(state:State, zone:ZoneName, settings:RenderSettings = {}) {
    const e = $(`#${zone}`)
    const optionsFns:(((shifted:boolean) => void)[]) = []
    const optionsIds:number[] = []
    function render(card:Card, count:number=1): string {
    	let option:number|undefined;
    	let optionFn = getIfDef(settings.optionsMap, card.id)
    	if (optionFn !== undefined) {
    		option = optionsFns.length
    		optionsFns.push(optionFn)
    		optionsIds.push(card.id)
    	}
        const cardRenderOptions:CardRenderOptions = {
            option: option,
            hotkey: getIfDef(settings.hotkeyMap, card.id),
            pick: getIfDef(settings.pickMap, card.id),
        }
        return renderCard(card, state, zone,
            cardRenderOptions,
            globalRendererState.tokenRenderer, count)
    }
    // two cards are rendered together in compress mode iff they have the same sketch
    function sketch(card:Card) {
        return `${card.name}${sketchMap(card.tokens)}
                ${getIfDef(settings.pickMap, card.id)}
                ${getIfDef(settings.optionsMap, card.id)}`
    }
    const cards:Card[] = state.zones.get(zone) || []
    const compress:boolean = globalRendererState.compress[zone]
    const sketches = cards.map(sketch)
    if (compress) {
        const seen:Set<string> = new Set()
        const counts:Map<string, number> = new Map()
        const distinctCards:Card[] = []
        for (const card of cards) {
            const s = sketch(card)
            if (counts.get(s) === undefined) {
                distinctCards.push(card)
            }
            counts.set(s, (counts.get(s) || 0) + 1)
        }
        const distinctCounts:number[] = distinctCards.map(c => counts.get(sketch(c)) || 0)
        const rendered:string[] = []
        e.html(distinctCards.map(
            (card, i) => render(card, distinctCounts[i])
        ).join(''))
    } else {
        e.html(cards.map(c => render(c)).join(''))
    }
    for (const [i, fn] of optionsFns.entries()) {
        bindClickEvent(e.find(`#card${optionsIds[i]}`), fn)
    }
}

function bindClickEvent(element:JQuery, handler:(shifted:boolean) => void): void {
    element.unbind('click')
    element.bind('click', e => handler(e.shiftKey))
}

function renderState(
    state:State,
    settings:RenderSettings = {},
): void {
    window.renderedState = state
    clearChoice()
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false
        window.history.replaceState(null, "", linkForState(state, isCampaign))
    }
    $('#resolvingHeader').html('Resolving:')
    $('#energy').html(state.energy.toString())
    $('#actions').html(state.actions.toString())
    $('#buys').html(state.buys.toString())
    $('#coin').html(state.coin.toString())
    $('#points').html(state.points.toString())

    $('#resolving').empty()
    $('#resolving').html(state.resolving.map(
    	c => renderCard(c, state, 'resolving', {}, globalRendererState.tokenRenderer)
	).join(''))
    for (const zone of zoneNames) {
        renderZone(state, zone, settings)
        const e = $(`[zone='${zone}'] .zonename`)
        e.unbind('click')
        e.click(() => {
            globalRendererState.compress[zone] = !globalRendererState.compress[zone];
            renderZone(state, zone, settings);
        })
    }
    $('#playsize').html('' + state.play.length)
    $('#handsize').html('' + state.hand.length)
    $('#discardsize').html('' + state.discard.length)
}

function bindLogTypeButtons(state:State, ui:webUI) {
    const e = $(`input[name='logType']`)
    e.off('change')
    e.change(function() {
        const logType = (this as any).value
        globalRendererState.logType = logType
        setVisibleLog(state, logType, ui)
    })
}
function setVisibleLog(state:State, logType:LogType, ui:webUI) {
    for (const logType of logTypes) {
        const e = $(`.logOption[option=${logType}]`)
        const choosable = e.attr('option') != globalRendererState.logType
        e.attr('choosable', choosable ? 'true' : null)
    }
    displayLogLines(state.logs[logType], ui)
}

function renderLogLine(msg: string, i:number) {
  return `<div><span class="logLine" pos=${i}>${msg}</span></div>`
}

function displayLogLines(logs:[string, State|null][], ui:webUI) {
    const result:string[] = []
    for (let i = logs.length-1; i >= 0; i--) {
        result.push(renderLogLine(logs[i][0], i))
    }
    $('#log').html(result.join(''))
    for (const [i, e] of logs.entries()) {
        const state:State|null = e[1]
        if (state !== null) {
            $(`.logLine[pos=${i}]`).click(function() {
                if (ui.choiceState !== null) {
                    ui.choiceState.reject(new SetState(state))
                }
            })
        }
    }
}

// ------------------------------- Macros

type CardMacro = {kind: 'card', card: Card, chosen:boolean}
type StringMacro = {kind: 'string', string: string}
type MacroStep = CardMacro | StringMacro
type Macro = MacroStep[]

// We will prefer the card option that has the lowest mismatch
function macroMismatch(card:Card, macroCard:Card) {
    // Take the number of token counts where they disagree
    // (Could instead do total magnitude of disagreement, but this is probably best)
    let result:number = 0
    function addDisagreements(from:Card, to:Card) {
        for (const [token, count] of from.tokens.entries()) {
            // We count a disagreement only on the side with more tokens
            // (since it might not appear in the tokens dict on the other side)
            if ((to.tokens.get(token) || 0) < count) {
                result += 1
            }
        }
    }
    addDisagreements(card, macroCard)
    addDisagreements(macroCard, card)
    return result
}

// A card must pass this filter to be considered as a macro match
function macroMatchCandidate(card:Card, macroCard:Card) {
    return (card.place == macroCard.place) && (card.name == macroCard.name)
}

function matchMacro<T>(
    macro:MacroStep,
    state:State,
    options:Option<T>[],
    chosen:number[],
): (number|null) {
    let renders:[OptionRender, number][];
    renders = options.map((x, i) => [x.render, i]);
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


// ------------------------------- Rendering choices

interface ChoiceState {
    state:State;
    choicePrompt: string;
    options: Option<any>[];
    info: string[];
    chosen: number[];
    resolve: (n:number, shifted:boolean) => void;
    reject: (x:any) => void;
}

function macroStepFromChoice(x:OptionRender, chosen:boolean): MacroStep {
    switch (x.kind) {
        case 'string': return x
        case 'card': return {...x, chosen:chosen}
        default: return assertNever(x)
    }
}

class webUI {
    public undoing:boolean = false;
    public macros: Macro[] = []
    public recordingMacro: (MacroStep[]|null) = null
    //invariant: whenever undoing = true, playingMacro = []
    public playingMacro: MacroStep[] = []
    //If the game is paused, these are the continuation
    //(resolve is used to give an answer, reject to Undo)
    //render is used to refresh the state
    public choiceState:ChoiceState|null = null
    constructor() {}
    recordStep(x:MacroStep): void {
        if(this.recordingMacro === null) return
        this.recordingMacro.push(x)
    }
    eraseStep(): void {
        if (this.recordingMacro === null) return
        this.recordingMacro.pop()
    }
    matchNextMacroStep(): number|null {
        const macro = this.playingMacro.shift()
        if (macro !== undefined && this.choiceState != null) {
            const option:number|null = matchMacro(
                macro,
                this.choiceState.state,
                this.choiceState.options,
                this.choiceState.chosen
            )
            if (option===null) this.playingMacro = []
            return option
        } else {
            return null
        }
    }
    clearChoice() {
        this.choiceState = null
        clearChoice()
    }
    resolveWithMacro() {
        if (this.choiceState !== null) {
            const option = this.matchNextMacroStep()
            if (option !== null) this.choiceState.resolve(option, false)
        }
    }
    render() {
        if (this.choiceState != null) {
            const cs = this.choiceState
            renderChoice(
                this,
                cs.state,
                cs.choicePrompt,
                cs.options.map((x, i) => ({...x, value:(shifted) => cs.resolve(i, shifted)})),
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
        const ui:webUI = this;
        return new Promise(function(resolve, reject) {
            function newResolve(n:number, shifted:boolean) {
                ui.clearChoice()
                const macroStep = macroStepFromChoice(options[n].render, chosen.indexOf(n) >= 0)
                ui.recordStep(macroStep)
                if (shifted) ui.playingMacro = repeat([macroStep], 9)
                resolve(n)
            }
            function newReject(reason:any) {
                if (reason instanceof Undo) {
                    ui.undoing = true
                    ui.eraseStep()
                }
                ui.clearChoice()
                reject(reason)
            }

            ui.choiceState = {
                state:state,
                choicePrompt:choicePrompt,
                options:options,
                info:info,
                chosen:chosen,
                resolve:newResolve,
                reject:newReject,
            }

            const option:number|null = ui.matchNextMacroStep()
            const chooseTrivial:number|null = ui.chooseTrivial(state, options, info)
            if (option != null) {
                newResolve(option, false)
            } else if (chooseTrivial !== null) {
                if (ui.undoing) {
                    newReject(new Undo(state))
                } else {
                    newResolve(chooseTrivial, false)
                }
            } else {
                ui.undoing = false;
                ui.render()
            }
        })
    }
    chooseTrivial(
        state:State,
        options: Option<any>[],
        info: string[],
    ): number|null {
        if (info.indexOf('tutorial') != -1) return null
        if (info.indexOf('actChoice') != -1) return null
        if (options.length == 1) return 0
        return null
    }
    //NOTE: we always undo after resolving the victory promise
    //(and we won't catch an undo here)
    //(would be nice to clean this up so you use undo to go back)
    async victory(state:State): Promise<void> {
        const ui:webUI = this;
        if (isCampaign) {
            const score = state.energy
            const url = specToURL(state.spec)
            const query = [
                credentialParams(),
                `url=${encodeURIComponent(url)}`,
                `score=${score}`,
                `history=${state.serializeHistory()}`
            ].join('&')
            $.post(`campaignSubmit?${query}`).then(
                () => heartbeat(state.spec)
            )
        }
        const submitOrUndo: () => Promise<void> = () =>
            new Promise(function (resolve, reject) {
                ui.undoing = true;
                heartbeat(state.spec)
                const submitDialog = () => {
                    keyListeners.clear()
                    renderScoreSubmission(state, () => submitOrUndo().then(resolve, reject))
                }
                function newReject(reason:any) {
                    if (reason instanceof Undo) ui.undoing = true
                    ui.clearChoice()
                    reject(reason)
                }
                const options:Option<() => void>[] = (!submittable(state.spec)) ? [] : [{
                        render: {kind:'string', string:'Submit'},
                        value: submitDialog,
                        hotkeyHint: {kind:'key', val:'!'}
                    }]
                ui.choiceState = {
                    state:state,
                    choicePrompt:`You won using ${state.energy} energy!`,
                    options:options,
                    info:["victory"],
                    chosen:[],
                    resolve:submitDialog,
                    reject:newReject,
                }
                ui.render()
            })
        return submitOrUndo()
    }
}

function renderCheckbox(
    div: JQuery,
    additionalHtml: string,
    checked: boolean,
    cb: (checked:boolean) => void,
): void {
    div.html(`<input type="checkbox" ${checked ? 'checked' : ''}> ${additionalHtml}`)
    div.off('click');
    div.click((e: any) => cb(e.target.checked));
}


interface StringOption {
    render: string,
    value: (shifted:boolean) => void
}

function renderChoice(
    ui:webUI|null,
    state: State,
    choicePrompt: string,
    options: Option<(shifted:boolean) => void>[],
    picks: Array<OptionRender>=[],
): void {

    const optionsMap:Map<number,(shifted:boolean) => void> = new Map() //map card ids to the corresponding option
    const stringOptions:StringOption[] = [] // values are indices into options
    for (let i = 0; i < options.length; i++) {
        const rendered:OptionRender = options[i].render
        switch (rendered.kind) {
            case 'string':
                stringOptions.push({render:rendered.string, value:options[i].value})
                break
            case 'card':
                optionsMap.set(rendered.card.id, options[i].value)
                break
            default: assertNever(rendered)
        }
        if (typeof rendered == 'string') {
        } else if (typeof rendered === 'number') {
        }
    }

    let hotkeyMap:Map<RenderKey,Key>;
    let pickMap:Map<RenderKey,number>;
    if (globalRendererState.hotkeysOn) {
        hotkeyMap = globalRendererState.hotkeyMapper.map(state, options)
    }
    else {
        hotkeyMap = new Map()
    }
    pickMap = new Map()
    for (const [i, x] of picks.entries()) {
        pickMap.set(renderKey(x), i)
    }
    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap:optionsMap,
        pickMap:pickMap,
        updateURL:(!globalRendererState.userURL || state.hasHistory())
    })

    if (ui != null) {
        setVisibleLog(state, globalRendererState.logType, ui)
        bindLogTypeButtons(state, ui)
    }

    $('#choicePrompt').html(choicePrompt)
    $('#options').empty()
    for (const option of stringOptions) {
        $('#options').append(renderStringOption(
            option, hotkeyMap.get(option.render), pickMap.get(option.render))
        )
        const e = renderStringOption
    }
    $('#undoArea').html(renderSpecials(state))
    if (ui !== null) bindSpecials(state, ui)

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const f: (shifted:boolean) => void = option.value;
        let hotkey:Key|undefined = hotkeyMap.get(renderKey(option.render))
        if (hotkey != undefined) keyListeners.set(hotkey, () => f(false))
    }

}



function renderStringOption(option:StringOption, hotkey?:Key, pick?:number) {
    const hotkeyText = (hotkey!==undefined) ? renderHotkey(hotkey) : ''
    const picktext:string = (pick !== undefined) ? `<div class='pickorder'>${pick}</div>` : ''
    const e = $(`<span class='option' choosable chosen='false'>${picktext}${hotkeyText}${option.render}</span>`)
    bindClickEvent(e, option.value)
    return e
}

function renderSpecials(state:State): string {
    return [
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

function renderUndo(undoable:boolean): string {
    const hotkeyText = renderHotkey('z')
    return `<span class='option', option='undo' ${undoable ? 'choosable' : ''} chosen='false'>${hotkeyText}Undo</span>`
}

function renderRedo(redoable:boolean): string {
    const hotkeyText = renderHotkey('Z')
    return `<span class='option', option='redo' ${redoable ? 'choosable' : ''} chosen='false'>${hotkeyText}Redo</span>`
}

function bindSpecials(
    state:State,
    ui:webUI
): void {
    bindHotkeyToggle(ui)
    bindHelp(state, ui)
    bindRestart(state, ui)
    bindUndo(state, ui)
    bindRedo(state, ui)
    if (ui !== null) bindMacroToggle(ui)
    bindViewKingdom(state)
    bindDeepLink(state)
}

function bindViewKingdom(state:State): void {
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

//TODO: move globalRendererState into the webUI...
//TODO: these should probably all be webUI methods...
function bindMacroToggle(ui:webUI) {
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

function makeMacroButtons(ui:webUI, e:any) {
    const contents = [renderRecordMacroButton(ui)].concat(
        ui.macros.map(renderPlayMacroButton)
    ).join('')
    e.html(`<div id='macros'>${contents}</div>`)
    bindRecordMacroButton(ui)
    bindPlayMacroButtons(ui)
}

function renderRecordMacroButton(ui:webUI): string {
    const buttonText = (ui.recordingMacro === null)
        ? 'Start recording'
        : 'Stop recording'
    return `<span id='recordMacro' class='option'
             option='recordMacro' choosable chosen='false'>
                 ${buttonText}
             </span>`
}

function renderPlayMacroButton(macro:Macro, index:number): string {
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

function bindRecordMacroButton(ui:webUI) {
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

function repeat<T>(xs:T[], n:number): T[] {
    return Array(n).fill(xs).flat(1)
}

function bindPlayMacroButtons(ui:webUI): void {
    function onClick(i:number, shifted:boolean=false) {
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

function unbindPlayMacroButtons(ui:webUI) {
    for (const [i, macro] of ui.macros.entries()) {
        const e = $(`[option='macro${i}'`)
        e.off('click')
    }
}


function bindHotkeyToggle(ui:webUI) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn
        ui.render()
    }
    keyListeners.set('/', pick)
    $(`[option='hotkeyToggle']`).on('click', pick)
}

function startState(state:State) {
    return state.origin().update({future:[]})
}

function bindRestart(state:State, ui:webUI): void {
    function pick() {
        if (ui.choiceState !== null) {
            ui.choiceState.reject(new SetState(startState(state)))
        }
    }
    $(`[option='restart']`).on('click', pick)
}

function bindRedo(state:State, ui:webUI): void {
    function pick() {
        if (ui.choiceState != null && state.redo.length > 0) {
            ui.choiceState.resolve(state.redo[state.redo.length - 1], false)
        }
    }
    keyListeners.set('Z', pick)
    $(`[option='redo']`).on('click', pick)
}

function bindUndo(state:State, ui:webUI): void {
    function pick() {
        if (ui.choiceState != null && state.undoable()) {
            ui.choiceState.reject(new Undo(state))
        }
    }
    keyListeners.set('z', pick)
    $(`[option='undo']`).on('click', pick)
}

function bindDeepLink(state:State): void {
    $('#deeplink').click(() => showLinkDialog(linkForState(state)))
}


function randomString(): string {
    return Math.random().toString(36).substring(2, 8)
}

function baseURL(): string {
    const url = window.location;
    return url.protocol + '//' + url.host
}

function showLinkDialog(url:string) {
    $('#scoreSubmitter').attr('active', 'true')
    $('#scoreSubmitter').html(
        `<label for="link">Link:</label>` +
        `<textarea id="link"></textarea>` +
        `<div>` +
        `<span class="option" choosable id="copyLink">${renderHotkey('⏎')}Copy</span>` +
        `<span class="option" choosable id="cancel">${renderHotkey('Esc')}Cancel</span>` +
        `</div>`
    )
    const id:string = randomString()
    //TOOD: include base URL
    $('#link').val(`${baseURL()}/g/${id}`)
    $('#link').select()
    $.get(`link?id=${id}&url=${encodeURIComponent(url)}`).done(function(x:string) {
        if (x != 'ok') {
            alert(x)
        }
    })
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
    $('#link').keydown((e:any) => {
        if (e.keyCode == 27) {
            exit()
            e.preventDefault()
        } else if (e.keyCode == 13) {
            submit()
            e.preventDefault()
        }
    })
}

function clearChoice(): void {
    keyListeners.clear()
    $('#choicePrompt').html('')
    $('#options').html('')
    $('#undoArea').html('')
}

// ------------------------------------------ Tutorial

interface tutorialStage {
    text: string[];
    nextAction?: number;
}

const tutorialStages:tutorialStage[] = [
    {
        text: [`Welcome to the tutorial.
        It will walk you through the first few actions of a simple game.
        Press enter or click 'Next' to advance.`,
        `When you use an event or play a card, you first pay its cost
        then follow its instructions.`,
        `You can read what a card does by hovering over it,
        or view all cards by clicking the 'Kingdom' button
        at the top of the screen. After pressing 'Next',
        read what Refresh does, then click on it to use it.`],
        nextAction:0,
    },
    {
        text: [`When you used Refresh you spent @@@@,
        because that's the cost of Refresh.
         You can see how much @ you've spent in the resources row,
         directly above the events.
         The goal of the game is to spend as little as possible.`,
        `After paying Refresh's cost, you put your discard pile into your hand.
         These are the cards available to play.`,
        `Then you gained 5 actions, which you can use to play cards from your hand,
         and 1 buy, which you can use to buy a card from the supply.
         Your actions and buys are visible above the events.`,
        `You have $0, so you can't buy much.
         But you can use an action to play a Copper from your hand.`],
        nextAction:0,
    },
    {
        text: [
            `When you play Copper, you follow its instructions and gain $1.
             You can see your $ above the events.
             You can also see that you've spent 1 action so have 4 remaining.`,
        ],
        nextAction: 0
    },
    { text: [], nextAction: 0 },
    {
        text: [`Now that you have $3 and a buy, you can buy a Silver.`],
        nextAction: 3
    },
    {
        text: [`When you buy a card, you lose a buy and the $ you spent on it.
        Then you create a copy of that card in your discard.
        Next time you Refresh you will be able to play your new Silver.`,
        `Note that using an event like Refresh or Duplicate doesn't require a buy.`,
        `For now, click on an Estate to play it.`],
        nextAction: 0
    },
    {
        text: [`You spent @ to play the estate, and gained 1 vp.
        The goal of the game is to get to ${DEFAULT_VP_GOAL}vp
        using as little @ as possible.`,
        `If you play an Estate using a Throne Room, you won't pay @. You only
        pay a card's cost when you play or buy it the 'normal' way.
        You also wouldn't pay an action, except that Throne Room tells you to.`,
        `This is a very small kingdom for the purposes of learning.
        The fastest win with these cards is 38@. Good luck!`,
        `You can press '?' or click 'Help' to view the help at any time.`],
    },
]

class tutorialUI {
    public stage:number = 0;
    constructor(
        public readonly stages:tutorialStage[],
        public readonly innerUI:UI = new webUI()
    ) {}
    async choice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        info: string[],
        chosen: number[],
    ): Promise<number> {
        if (this.stage < this.stages.length) {
            const stage = this.stages[this.stage]
            const validIndex = stage.nextAction;

            if (validIndex != undefined) options = [options[validIndex]];
            const result = this.innerUI.choice(
                state,
                choicePrompt,
                options,
                info.concat(['tutorial']),
                chosen,
            ).then(x => {
                this.stage += 1
                return (validIndex != undefined) ? validIndex : x
            }).catch(e => {
                if (e instanceof Undo) {
                    if (validIndex === undefined) this.stage += 1;
                    else this.stage -= 1
                }
                throw e
            })
            renderTutorialMessage(stage.text)
            return result
        }
        else return this.innerUI.choice(state, choicePrompt, options, info, chosen)
    }
    async victory(state:State) {
        return this.innerUI.victory(state)
    }
}

function renderTutorialMessage(text:string[]) {
    $('#tutorialDialog').html(
        `<div id='tutorialText'></div>` +
         `<span class="option" choosable id="tutorialNext">
             ${renderHotkey('⏎')} Next
         </span>`
    )
    let step:number = 0;
    $('#tutorialDialog').attr('active', 'true')
    function next() {
        if (step >= text.length) {
            $('#tutorialDialog').attr('active', 'false')
        } else {
            $('#tutorialText').html(text[step])
            step += 1
        }
    }
    keyListeners.set('Enter', next)
    next()
    $('#tutorialDialog').keydown((e:any) => {
        if (e.keyCode == 13 || e.keyCode == 27) {
            next()
            e.preventDefault()
        }
    })
    $('#tutorialNext').on('click', next)
}

export function loadTutorial(){
    const state = initialState(getTutorialSpec())
    startGame(state, new tutorialUI(tutorialStages))
}

// ------------------------------------------ Help

//TODO: should handle help and the kingdom view in the same way
function bindHelp(state:State, ui:webUI) {
    function attach(f: () => void) {
        $('#help').on('click', f)
        keyListeners.set('?', f)
    }
    function pick() {
        attach(() => ui.render())
        const helpLines:string[] = [
            `Rules:`,
            `The goal of the game is to get to ${DEFAULT_VP_GOAL} points (vp) using as little energy (@) as possible.`,
            `You can buy a card by spending a buy and pay its buy cost.`,
            `When you buy a card, create a copy of it in your discard pile.`,
            `You can play a card by spending an action and pay its cost.`,
            `When you play a card, put it in the resolving zone and follow its instructions.`,
            `After playing a card, discard it if it's still in the resolving zone.`,
            `You can use an event by paying its cost. When you use an event, folllow its instructions.`,
            "The symbols below a card's name indicate its cost (or buy cost for cards in the supply).",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to pay it.",
            "When a cost is measured in coin ($) then you can only pay it if you have enough coin.",
            "If an effect instructs you to play or buy a card, you don't have to pay the normal cost.",
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (effect) apply whenever the card is in play.",
            "If a card has an (effect), then put it in play after playing it, instead of discarding it.",
            "Effects marked with (static) apply whenever the card is in the supply or events zone.",
            `&nbsp;`,
            `Other help:`,
            "Click the 'Kingdom' button to view the text of all cards at once.",
            "Press 'z' or click the 'Undo' button to undo the last move.",
            "Press '/' or click the 'Hotkeys' button to turn on hotkeys.",
            "Click the 'Link' button to copy a shortlink to the current state.",
            "Click on a zone's name to compress identical cards in that zone.",
            "Go <a href='index.html'>here</a> to see all the ways to play the game.",
            `Check out the scoreboard <a href=${scoreboardURL(state.spec)}>here</a>.`,
            `Copy <a href='play?${specToURL(state.spec)}'>this link</a> to replay this game any time.`,
            `Use the URL in the address bar to link to the current state of this game.`,
            `(Or click the 'Link' button to get a shortlink.)`,
            `Click the 'Macros' button to record and replay sequences of actions.`,
            `Shift+click a card or macro to repeat that action up to 10 times.`
        ]
        $('#choicePrompt').html('')
        $('#resolvingHeader').html('')
        $('#resolving').html(helpLines.map(x => `<div class='helpLine'>${x}</div class='helpline'>`).join(''))
    }
    attach(pick)
}

function dateString() {
    const date = new Date()
    return (String(date.getMonth() + 1)) + String(date.getDate()).padStart(2, '0') + date.getFullYear()
}

// ------------------------------ High score submission

function submittable(spec:GameSpec): boolean {
    return true;
}


function rememberUsername(username:string) {
    localStorage.setItem('username', username)
}
function getUsername():string|null {
    return localStorage.username
}

function credentialParams(): string {
    return `username=${localStorage.campaignUsername}&hashedPassword=${localStorage.hashedPassword}`
}

//TODO: should factor credentials differently
function renderCampaignSubmission(state:State, done:() => void) {
    const score = state.energy
    const url = specToURL(state.spec)
    $('#campaignSubmitter').attr('active', 'true')
    function exit() {
        $('#campaignSubmitter').attr('active', 'false')
    }
    async function submit() {
        const query = [
            credentialParams(),
            `url=${encodeURIComponent(url)}`,
            `score=${score}`,
            `history=${state.serializeHistory()}`
        ].join('&')
        return $.post(`campaignSubmit?${query}`)
    }
    //TODO: handle bad submissions here
    submit().then(data => {
        $('#newbest').text(score)
        $('#priorbest').text(data.priorBest)
        $('#awards').text(data.newAwards)
        $('#nextAward').text(data.nextAward)
        heartbeat(state.spec)
    })
    $('#campaignSubmitter').focus()
    $('#campaignSubmitter').keydown((e:any) => {
        if (e.keyCode == 13) {
            exit()
            e.preventDefault()
        } else if (e.keyCode == 27) {
            exit()
            e.preventDefault()
        }
    })
    $('#campaignSubmitter').on('click', exit)
}

function renderScoreSubmission(state:State, done:() => void) {
    const score = state.energy
    const url = specToURL(state.spec)
    $('#scoreSubmitter').attr('active', 'true')
    const pattern = "[a-ZA-Z0-9]"
    $('#scoreSubmitter').html(
        `<label for="username">Name:</label>` +
        `<textarea id="username"></textarea>` +
        `<div>` +
        `<span class="option" choosable id="submitScore">${renderHotkey('⏎')}Submit</span>` +
        `<span class="option" choosable id="cancelSubmit">${renderHotkey('Esc')}Cancel</span>` +
        `</div>`
    )
    const username = getUsername()
    if (username != null) $('#username').val(username)
    $('#username').focus()
    function exit() {
        $('#scoreSubmitter').attr('active', 'false')
        done()
    }
    function submit() {
        const username:string = $('#username').val() as string
        if (username.length > 0) {
            rememberUsername(username)
            const query = [
                `url=${encodeURIComponent(url)}`,
                `score=${score}`,
                `username=${encodeURIComponent(username)}`,
                `history=${state.serializeHistory()}`
            ].join('&')
            $.post(`submit?${query}`).done(function(resp:string) {
                if (resp == 'OK') {
                    heartbeat(state.spec)
                } else {
                    alert(resp)
                }
            })
            exit()
        }
    }
    $('#username').keydown((e:any) => {
        if (e.keyCode == 13) {
            submit()
            e.preventDefault()
        } else if (e.keyCode == 8) {
        } else if (e.keyCode == 189) {
        } else if (e.keyCode == 27) {
            exit()
            e.preventDefault()
        } else if (e.keyCode < 48 || e.keyCode > 90) {
            e.preventDefault()
        }
    })
    $('#submitScore').on('click', submit)
    $('#cancelSubmit').on('click', exit)
}

function scoreboardURL(spec:GameSpec) {
    return `scoreboard?${specToURL(spec)}`
}

//TODO: change the sidebar based on whether you are in a campaign
function campaignHeartbeat(spec:GameSpec, interval?:any): void {
    const queryStr = `campaignHeartbeat?${credentialParams()}&url=${encodeURIComponent(specToURL(spec))}&version=${VERSION}`
    $('#homeLink').attr('href', 'campaign.html')
    $('#homeLink').text('back to campaign')
    $.get(queryStr).done(function(x) {
        if (x == 'version mismatch') {
            clearInterval(interval)
            alert("The server has updated to a new version, please refresh. You will get an error and your game will restart if the history is no longer valid.")
            return
        }
        if (x == 'user not found') {
            clearInterval(interval)
            alert("Your username+password were not recognized")
            return
        }
        let [personalBest, nextStar, starsWon, totalStars] = x
        console.log(x)
        const starStr = (totalStars > 1)
            ? `<div>Stars won: ${starsWon}/${totalStars}</div>`
            : ``
        const personalBestStr = personalBest !== null
            ? `<div>Your best: @${personalBest}</div>`
            : ``
        const nextStarStr = nextStar !== null
            ? `<div>Next star: @${nextStar}</div>`
            : ``
        $('#best').html(starStr + nextStarStr + personalBestStr)
    })
}

//TODO: still need to refactor global state
let isCampaign:boolean = false;

function heartbeat(spec:GameSpec, interval?:any): void {
    if (isCampaign) {
        campaignHeartbeat(spec, interval)
    } else if (submittable(spec)) {
        $.get(`topScore?url=${encodeURIComponent(specToURL(spec))}&version=${VERSION}`).done(function(x:string) {
            if (x == 'version mismatch') {
                clearInterval(interval)
                alert("The server has updated to a new version, please refresh. You will get an error and your game will restart if the history is no longer valid.")
            }
            const n:number = parseInt(x, 10)
            if (!isNaN(n)) renderBest(n, spec)
            else renderScoreboardLink(spec)
        })
    }
}

function renderBest(best:number, spec:GameSpec): void {
    $('#best').html(`Fastest win on this kingdom: ${best} (<a target='_blank' href="${scoreboardURL(spec)}">scoreboard</a>)`)
}
function renderScoreboardLink(spec:GameSpec): void {
    $('#best').html(`No wins yet for this kingdom (<a target='_blank' href="${scoreboardURL(spec)}">scoreboard</a>)`)
}


// Creating the game spec and starting the game ------------------------------


function getHistory(): string | null {
    return window.location.hash.substring(1) || null;
}

function isURLCampaign(url:string):boolean {
    const searchParams = new URLSearchParams(url)
    return searchParams.get('campaign') !== null
}

export function load(fixedURL:string=''): void {
    const url = (fixedURL.length == 0) ? window.location.search : fixedURL
    isCampaign = isURLCampaign(url)
    let spec:GameSpec;
    try {
        spec = specFromURL(url)
    } catch(e) {
        if (e instanceof MalformedSpec) {
            alert(e)
            spec = specFromURL('')
        } else {
            throw e
        }
    }

    let history:Replay|null = null;
    const historyString:string|null = getHistory()
    if (historyString != null) {
        try {
            history = coerceReplayVersion(parseReplay(historyString))
        } catch (e) {
            if (e instanceof MalformedReplay) {
                alert(e)
                history = null
            } else {
                throw e
            }
        }
    }
    let state:State;
    if (history !== null) {
        try {
            state = State.fromReplay(history, spec)
        } catch(e) {
            alert(`Error loading history: ${e}`);
            state = initialState(spec);
        }
    } else {
        state = initialState(spec)
    }

    startGame(state)
}

function startGame(state:State, ui?:UI): void {
    if (ui === undefined) ui = new webUI()
    heartbeat(state.spec)
    const interval:any = setInterval(() => heartbeat(state.spec, interval), 10000)

    window.addEventListener("hashchange", () => load(), false);

    playGame(state.attachUI(ui)).catch(e => {
        if (e instanceof InvalidHistory) {
            alert(e)
            playGame(e.state.clearFuture(), true)
        } else {
            //alert(e)
            throw e
        }
    })
}

function restart(state:State): void {
    //TODO: detach the UI to avoid a race?
    //TODO: clear hearatbeat? (currently assumes spec is the same...)
    const spec = state.spec
    const ui = state.ui
    state = initialState(spec)
    globalRendererState.userURL = false
    window.history.pushState(null, "")
    playGame(state.attachUI(ui)).catch(e => {
        if (e instanceof InvalidHistory) {
            alert(e)
            playGame(e.state.clearFuture(), true)
        } else {
            alert(e)
        }
    })
}

// ----------------------------------- Kingdom picker
//

function kingdomURL(kindParam:string, cards:CardSpec[], events:CardSpec[]) {
    return `play?${kindParam}cards=${cards.map(card => card.name).join(',')}&events=${events.map(card => card.name)}`
}

function countIn<T>(s:Set<T>, f:((t:T) => boolean)): number{
    let count = 0
    for (const x of s) if (f(x)) count += 1;
    return count
}

//TODO: refactor the logic into logic.ts, probably just state initialization
export function loadPicker(picked_sets: ExpansionName[]): void {
    let state = emptyState;
    const cards: CardSpec[] = []
    const events: CardSpec[] = []
    picked_sets.forEach((picked_set) => {
      cards.push(...sets[picked_set]['cards'].slice())
      events.push(...sets[picked_set]['events'].slice())
    })

    $('#expansionPicker').empty()
    Object.keys(sets).forEach((set_option_str: string) => {
      if (set_option_str === 'core') {
        return;
      }
      const set_option = set_option_str as ExpansionName;

      const d = $('<div>');
      renderCheckbox(
        d,
        set_option,
        picked_sets.includes(set_option),
        (checked) => {
          let new_picked_sets = picked_sets.slice();
          if (checked) {
            new_picked_sets.push(set_option)
          } else {
            new_picked_sets = new_picked_sets.filter((x) => x !== set_option)
          }
          loadPicker(new_picked_sets);
        }
      );
      $('#expansionPicker').append(d)
    });

    // allCards.slice()
    // allEvents.slice()
    cards.sort((spec1, spec2) => spec1.name.localeCompare(spec2.name))
    events.sort((spec1, spec2) => spec1.name.localeCompare(spec2.name))
    for (let i = 0; i < 8; i++) events.push(randomPlaceholder)
    for (let i = 0; i < 20; i++) cards.push(randomPlaceholder)
    for (let i = 0; i < cards.length; i++) {
        const spec = cards[i]
        state = state.addToZone(new Card(spec, i), 'supply')
    }
    for (let i = 0; i < events.length; i++) {
        const spec = events[i]
        state = state.addToZone(new Card(events[i], cards.length + i), 'events')
    }
    const specs = cards.concat(events)
    function trivial() {}
    function elem(i:number, kind:'card'|'event'): any {
        const id = (kind == 'card') ? 'supply' : 'events'
        return $(`#${id} [option='${i}']`)
    }
    function prefix(s:string): string {
        const parts:string[] = s.split('/')
        return parts.slice(0, parts.length-1).join('/')
    }
    function kingdomLink(kind:string=''): string {
        return kingdomURL(kind,
            Array.from(chosen.card.values()).map(i => cards[i]),
            Array.from(chosen.event.values()).map(i => events[i])
        )
    }
    const chosen = {
        'card': new Set<number>(),
        'event': new Set<number>(),
    }
    $('#cardCount').html(String(chosen.card.size))
    $('#eventCount').html(String(chosen.event.size))
    function pick(i:number, kind:'card'|'event'): void {
        if (chosen[kind].has(i)) {
            chosen[kind].delete(i)
            elem(i, kind).attr('chosen', false)
        } else {
            chosen[kind].add(i)
            elem(i, kind).attr('chosen', true)
        }
        $('#cardCount').html(String(chosen.card.size))
        $('#eventCount').html(String(chosen.event.size))
        if (chosen.card.size > 0 || chosen.event.size > 0) {
            $('#pickLink').attr('href', kingdomLink())
            $('#requireLink').attr('href', kingdomLink('kind=require&'))
        } else {
            $('#pickLink').removeAttr('href')
            $('#requireLink').removeAttr('href')
        }
    }
    function makeOption(card:Card, i:number, kind:'card'|'event'):Option<() => void>{
        return {
            value: () => pick(i, kind),
            render: {kind:'card', card:card}
        }
    }
    renderChoice(null, state,
        'Choose which events and cards to use.',
        state.supply.map(
            (card, i) => makeOption(card, i, 'card')
        ).concat(state.events.map(
            (card, i) => makeOption(card, i, 'event')
        )))
}
