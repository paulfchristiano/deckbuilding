// TODO: merge in the refactor from branch nodeck
// TODO: if a zone gets bigger and then smaller, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay out the zones a bit more nicely
// TODO: starting to see performance hiccups in big games
// TODO: probably don't want the public move method to allow moves into or out of resolving.

import { Cost, Shadow, State, Card, CardSpec, PlaceName } from './logic.js'
import { GameSpec, SlotSpec } from './logic.js'
import { Trigger, Replacer, Ability, CalculatedCost } from './logic.js'
import { ID } from './logic.js'
import { renderCost, renderEnergy } from './logic.js'
import { emptyState } from './logic.js'
import { Option, OptionRender, HotkeyHint } from './logic.js'
import { UI, Undo, Victory, InvalidHistory, ReplayEnded } from './logic.js'
import { playGame, initialState, verifyScore} from './logic.js'
import { Replay, coerceReplayVersion, parseReplay, MalformedReplay } from './logic.js'
import { mixins, eventMixins, randomPlaceholder } from './logic.js'
import { VERSION, VP_GOAL } from './logic.js'
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
const hotkeys:Key[] = supplyAndPlayHotkeys.concat(handHotkeys).concat(symbolHotkeys)
const choiceHotkeys:Key[] = handHotkeys.concat(supplyAndPlayHotkeys)

$(document).keydown((e: any) => {
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

class HotkeyMapper {
    constructor() {
    }
    map(state:State, options:Option<any>[]): Map<OptionRender, Key> {
        const result:Map<OptionRender, Key> = new Map()
        const taken:Map<Key, OptionRender> = new Map()
        const pickable:Set<OptionRender> = new Set()
        for (const option of options) pickable.add(option.render)
        function takenByPickable(key:Key): boolean {
            const takenBy:OptionRender|undefined = taken.get(key)
            return (takenBy != undefined && pickable.has(takenBy))
        }
        function set(x:OptionRender, k:Key): void {
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
            if (hint != undefined && !result.has(option.render)) {
                if (!takenByPickable(hint))
                    set(option.render, hint)
            }
        }
        let index = 0
        function nextHotkey(): Key|null {
            while (true) {
                const key:Key = hotkeys[index]
                if (!takenByPickable(key)) return key
                else index++
            }
            return hotkeys[index]
        }
        for (const option of options) {
            if (!result.has(option.render)) {
                const key = nextHotkey()
                if (key != null) set(option.render, key)
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
    tokenRenderer:TokenRenderer
):string {
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer)
    } else {
        const costType:'use'|'play' = (zone == 'events') ? 'use' : 'play'
        const tokenhtml:string = tokenRenderer.render(card.tokens)
        const costhtml:string = (zone == 'supply') ?
            renderCost(card.cost('buy', state)) || '&nbsp' :
            renderCost(card.cost(costType, state)) || '&nbsp'
        const picktext:string = (options.pick !== undefined) ? `<div class='pickorder'>${options.pick}</div>` : ''
        const choosetext:string = (options.option !== undefined) ? `choosable chosen='false' option=${options.option}` : ''
        const hotkeytext:string = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : ''
        const ticktext:string = `tick=${card.ticks[card.ticks.length-1]}`
        return `<div class='card' ${ticktext} ${choosetext}> ${picktext}
                    <div class='cardbody'>${hotkeytext} ${card}${tokenhtml}</div>
                    <div class='cardcost'>${costhtml}</div>
                    <span class='tooltip'>${renderTooltip(card, state, tokenRenderer)}</span>
                </div>`
    }
}

function renderTrigger(x:Trigger|Replacer, staticTrigger:boolean): string {
    const desc:string = (staticTrigger) ? '(static)' : '(effect)'
    return `<div>${desc} ${x.text}</div>`
}

function renderCalculatedCost(c:CalculatedCost): string {
    return `<div>(cost) ${c.text}</div>`
}

function renderBuyable(bs:{text?:string}[]): string{
    return bs.map(
        b => (b.text == undefined) ? '' : `<div>(static) ${b.text}</div>`
    ).join('')
}

function isZero(c:Cost|undefined) {
    return (c===undefined || renderCost(c) == '')
}

function cardText(spec:CardSpec): string {
    const effectHtml:string = renderEffects(spec)
    const buyableHtml:string = (spec.restrictions != undefined) ? renderBuyable(spec.restrictions) : ''
    const costHtml:string = (spec.calculatedCost != undefined) ? renderCalculatedCost(spec.calculatedCost) : ''
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
        `(${renderCost(card.cost('play', emptyState) as Cost)})` : '---'
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
    optionsMap?: Map<number, number>;
    pickMap?: Map<number|string, number>;
    updateURL?: boolean;
}

declare global {
    interface Window { renderedState: State; serverSeed?: string; }
}

//TODO: this is all a mess, this should be part of the webUI

interface RendererState {
    hotkeysOn:boolean;
    userURL:boolean;
    hotkeyMapper: HotkeyMapper;
    tokenRenderer: TokenRenderer;
    viewingKingdom: boolean,
}

const globalRendererState:RendererState = {
    hotkeysOn:false,
    userURL:true,
    viewingKingdom:false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
}

function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper()
    globalRendererState.tokenRenderer = new TokenRenderer()
}

function renderState(
    state:State,
    settings:RenderSettings = {},
): void {
    window.renderedState = state
    clearChoice()
    function render(zone:PlaceName) {
        return function (card:Card|Shadow) {
            const cardRenderOptions:CardRenderOptions = {
                option: getIfDef(settings.optionsMap, card.id),
                hotkey: getIfDef(settings.hotkeyMap, card.id),
                pick: getIfDef(settings.pickMap, card.id),
            }
            return renderCard(card, state, zone,
                cardRenderOptions,
                globalRendererState.tokenRenderer)
        }
    }
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false
        window.history.replaceState(
            null,
            "",
            `play?${specToURL(state.spec)}#${state.serializeHistory(false)}`
        );
    }
    $('#resolvingHeader').html('Resolving:')
    $('#energy').html(state.energy.toString())
    $('#actions').html(state.actions.toString())
    $('#buys').html(state.buys.toString())
    $('#coin').html(state.coin.toString())
    $('#points').html(state.points.toString())
    $('#aside').html(state.aside.map(render('aside')).join(''))
    $('#resolving').html(state.resolving.map(render('resolving')).join(''))
    $('#play').html(state.play.map(render('play')).join(''))
    $('#supply').html(state.supply.map(render('supply')).join(''))
    $('#events').html(state.events.map(render('events')).join(''))
    $('#hand').html(state.hand.map(render('hand')).join(''))
    $('#discard').html(state.discard.map(render('discard')).join(''))
    $('#playsize').html('' + state.play.length)
    $('#handsize').html('' + state.hand.length)
    $('#discardsize').html('' + state.discard.length)
    $('#log').html(renderLogs(state.logs))
}

function renderLog(msg: string) {
  return `<div class="log">${msg}</div>`
}

function renderLogs(logs:string[]) {
    const result:string[] = []
    for (let i = logs.length-1; i >= 0; i--) {
        result.push(renderLog(logs[i]))
        if (i > 0 && result.length > 100) {
            result.push(renderLog('... (earlier events truncated)'))
            break
        }
    }
    return result.join('')
}


// ------------------------------- Rendering choices

class webUI {
    public undoing:boolean = false;
    constructor() {}
    choice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        info: string[],
    ): Promise<number> {
        const ui:webUI = this;
        const automate:number|null = this.automateChoice(state, options, info)
        if (automate !== null) {
            if (this.undoing) throw new Undo(state)
            else return Promise.resolve(automate)
        }
        this.undoing = false;
        return new Promise(function(resolve, reject) {
            function newReject(reason:any) {
                if (reason instanceof Undo) ui.undoing = true
                reject(reason)
            }
            function pick(i:number) {
                clearChoice()
                resolve(i)
            }
            function renderer() {
                renderChoice(
                    state,
                    choicePrompt,
                    options.map((x, i) => ({...x, value:() => pick(i)})),
                    x => resolve(x[0]),
                    newReject,
                    renderer
                )
            }
            renderer()
        })
    }
    automateChoice<T>(
        state:State,
        options: Option<T>[],
        info: string[],
    ): number|null {
        if (info.indexOf('tutorial') != -1) return null
        if (info.indexOf('actChoice') != -1) return null
        if (options.length == 1) return 0
        return null
    }
    multichoice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        validator:((xs:T[]) => boolean) = (xs => true),
        info: string[],
    ): Promise<number[]> {
        const ui:webUI = this;
        const automate:number[]|null = this.automateMultichoice(state, options, info)
        if (automate !== null) {
            if (this.undoing) throw new Undo(state)
            else return Promise.resolve(automate)
        }
        this.undoing = false;
        return new Promise(function(resolve, reject){
            function newReject(reason:any) {
                if (reason instanceof Undo) ui.undoing = true
                reject(reason)
            }
            const chosen:Set<number> = new Set()
            function chosenOptions(): T[] {
                const result = []
                for (let i of chosen) result.push(options[i].value)
                return result
            }
            function isReady(): boolean {
                return validator(chosenOptions())
            }
            const submitIndex = options.length
            function setReady(): void {
                if (isReady()) {
                    $(`[option='${submitIndex}']`).attr('choosable', 'true')
                } else {
                    $(`[option='${submitIndex}']`).removeAttr('choosable')
                }
            }
            function elem(i:number): any {
                return $(`[option='${i}']`)
            }
            function picks(): Map<ID|string, number> {
                const result = new Map<ID|string, number>()
                var i = 0;
                for (const k of chosen) {
                    result.set(options[k].render, i++)
                }
                return result
            }
            function pick(i:number): void {
                if (chosen.has(i)) {
                    chosen.delete(i)
                    elem(i).attr('chosen', false)
                } else {
                    chosen.add(i)
                    elem(i).attr('chosen', true)
                }
                renderer()
                setReady()
            }
            const newOptions:Option<() => void>[] = options.map(
                (x, i) => ({...x, value: () => pick(i)})
            )
            const hint:HotkeyHint = {kind:'key', val:' '}
            newOptions.push({render:'Done', hotkeyHint: hint, value: () => {
                if (isReady()) {
                    resolve(Array.from(chosen.values()))
                }
            }})
            chosen.clear()
            function renderer() {
                renderChoice(state, choicePrompt, newOptions, resolve, newReject, renderer, picks)
                for (const j of chosen) elem(j).attr('chosen', true)
            }
            renderer()
        })
    }
    automateMultichoice<T>(
        state:State,
        options: Option<T>[],
        info: string[],
    ): number[]|null {
        if (options.length == 0) return []
        return null
    }
    async victory(state:State): Promise<void> {
        const submitOrUndo: () => Promise<void> = () =>
            new Promise(function (resolve, reject) {
                heartbeat(state.spec)
                const submitDialog = () => {
                    keyListeners.clear()
                    renderScoreSubmission(state, () => submitOrUndo().then(resolve, reject))
                }
                const options:Option<() => void>[] = (!submittable(state.spec)) ? [] : [{
                        render: 'Submit',
                        value: submitDialog,
                        hotkeyHint: {kind:'key', val:'!'}
                    }]
                renderChoice(state, `You won using ${state.energy} energy!`,
                    options, resolve, resolve, () => {})
            })
        return submitOrUndo()
    }
}

interface StringOption<T> {
    render: string,
    value: T
}


function renderChoice(
    state: State,
    choicePrompt: string,
    options: Option<() => void>[],
    resolve:((x:any) => void),
    reject:((x:any) => void),
    renderer:() => void,
    picks?: () => Map<ID|string, number>,
): void {

    const optionsMap:Map<number,number> = new Map() //map card ids to their position in the choice list
    const stringOptions:StringOption<number>[] = [] // values are indices into options
    for (let i = 0; i < options.length; i++) {
        const rendered:OptionRender = options[i].render
        if (typeof rendered == 'string') {
            stringOptions.push({render:(rendered as string), value:i})
        } else if (typeof rendered === 'number') {
            optionsMap.set((rendered as ID), i)
        }
    }

    let hotkeyMap:Map<OptionRender,Key>;
    let pickMap:Map<OptionRender,number>;
    if (globalRendererState.hotkeysOn) {
        hotkeyMap = globalRendererState.hotkeyMapper.map(state, options)
    }
    else {
        hotkeyMap = new Map()
    }
    if (picks != undefined) {
        pickMap = picks()
    } else {
        pickMap = new Map()
    }

    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap:optionsMap,
        pickMap:pickMap,
        updateURL:(!globalRendererState.userURL || state.hasHistory())
    })

    $('#choicePrompt').html(choicePrompt)
    $('#options').html(stringOptions.map(localRender).join(''))
    $('#undoArea').html(renderSpecials(state))
    bindSpecials(state, resolve, reject, renderer)

    function elem(i:number): any {
        return $(`[option='${i}']`)
    }
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const f: () => void = option.value;
        elem(i).on('click', f)
        let hotkey:Key|undefined = hotkeyMap.get(option.render)
        if (hotkey != undefined) keyListeners.set(hotkey, f)
    }

    function localRender(option:StringOption<number>): string {
        return renderStringOption(option, hotkeyMap.get(option.render), pickMap.get(option.render))
    }
}



function renderStringOption(option:StringOption<number>, hotkey?:Key, pick?:number): string {
    const hotkeyText = (hotkey!==undefined) ? renderHotkey(hotkey) : ''
    const picktext:string = (pick !== undefined) ? `<div class='pickorder'>${pick}</div>` : ''
    return `<span class='option' option='${option.value}' choosable chosen='false'>${picktext}${hotkeyText}${option.render}</span>`
}

function renderSpecials(state:State): string {
    return [
        renderUndo(state.undoable()),
        renderRedo(state.redo.length > 0),
        renderHotkeyToggle(),
        renderKingdomViewer(),
        renderHelp(),
        renderRestart()
    ].join('')
}

function renderRestart(): string {
    return `<span id='deeplink' class='option', option='restart' choosable chosen='false'>Restart</span>`
}

function renderKingdomViewer(): string {
    return `<span id='viewKingdom' class='option', option='viewKingdom' choosable chosen='false'>Kingdom</span>`
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
    accept: ((x:any) => void),
    reject: ((x:any) => void),
    renderer: () => void
): void {
    bindHotkeyToggle(renderer)
    bindUndo(state, reject)
    bindHelp(state, renderer)
    bindRestart(state)
    bindRedo(state, accept)
    bindViewKingdom(state)
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

function bindHotkeyToggle(renderer: () => void) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn
        renderer()
    }
    keyListeners.set('/', pick)
    $(`[option='hotkeyToggle']`).on('click', pick)
}

function bindRestart(state:State): void {
    $(`[option='restart']`).on('click', () => restart(state))
}

function bindRedo(state:State, accept: ((x:any) => void)): void {
    function pick() {
        if (state.redo.length > 0) accept(state.redo[state.redo.length - 1])
    }
    keyListeners.set('Z', pick)
    $(`[option='redo']`).on('click', pick)
}

function bindUndo(state:State, reject: ((x:any) => void)): void {
    function pick() {
        if (state.undoable()) reject(new Undo(state))
    }
    keyListeners.set('z', pick)
    $(`[option='undo']`).on('click', pick)
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
    $('#link').val(url)
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
         directly above the events (it might be behind this popup).
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
        Then you gain a copy of that card in your discard pile.
        Next time you Refresh you will have an extra Silver to play.`,
        `Note that using an event like Refresh or Duplicate doesn't require a buy.`,
        `For now, click on an Estate to play it.`],
        nextAction: 0
    },
    { 
        text: [`You spent @ to play the estate, and gained 1 vp.
        The goal of the game is to get to ${VP_GOAL}vp
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
    ): Promise<number> {
        if (this.stage < this.stages.length) {
            const stage = this.stages[this.stage]
            const validIndex = stage.nextAction;

            if (validIndex != undefined) options = [options[validIndex]];
            const result = this.innerUI.choice(
                state,
                choicePrompt,
                options,
                info.concat(['tutorial'])
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
        else return this.innerUI.choice(state, choicePrompt, options, info)
    }
    async multichoice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        validator:((xs:T[]) => boolean) = (xs => true),
        info: string[],
    ) {
        return this.innerUI.multichoice(
            state,
            choicePrompt,
            options,
            validator,
            info.concat(['tutorial'])
        )
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
function bindHelp(state:State, renderer: () => void) {
    function attach(f: () => void) {
        $('#help').on('click', f)
        keyListeners.set('?', f)
    }
    function pick() {
        attach(renderer)
        const helpLines:string[] = [
            `Rules:`,
            `The goal of the game is to get to ${VP_GOAL} points (vp) using as little energy (@) as possible.`,
            `To buy a card, pay its buy cost then create a copy of it in your discard pile.`,
            "To play a card or use an event, pay its cost then follow its instructions.",
            "If an effect instructs you to play or buy a card, you don't have to pay a cost.",
            "The symbols below a card's name indicate its cost or buy cost.",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to pay it.",
            "When a cost is measured in coin ($) then you can only pay it if you have enough coin.",
            'After playing a card, discard it.',
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (effect) apply whenever the card is in play.",
            "Effects marked with (static) apply whenever the card is in the supply.",
            `&nbsp;`,
            `Other help:`,
            "Click the 'Kingdom' button to view the text of all cards at once.",
            "Press 'z' or click the 'Undo' button to undo the last move.",
            "Press '/' or click the 'Hotkeys' button to turn on hotkeys.",
            "Go <a href='index.html'>here</a> to see all the ways to play the game.",
            `Check out the scoreboard <a href=${scoreboardURL(state.spec)}>here</a>.`,
            `Copy <a href='play?${specToURL(state.spec)}'>this link</a> to replay this game any time.`,
            `You can use the URL in the address bar to link to the current state of this game.`,
        ]
        $('#choicePrompt').html('')
        $('#resolvingHeader').html('')
        $('#resolving').html(helpLines.map(x => `<div class='helpLine'>${x}</div class='helpline'>`).join(''))
    }
    attach(pick)
}

//TODO: many of the URLs seem wrong
//TODO: play is not successfuly defaulting to a random seed
//TODO: make it so that you combine the daily seed

function dateString() {
    const date = new Date()
    return (String(date.getMonth() + 1)) + String(date.getDate()).padStart(2, '0') + date.getFullYear()
}

// ------------------------------ High score submission

function submittable(spec:GameSpec): boolean {
    return true;
}


function setCookie(name:string,value:string) {
    document.cookie = `${name}=${value}; max-age=315360000; path=/`
}
function getCookie(name:string): string|null {
    let nameEQ:string = name + "=";
    let ca:string[] = document.cookie.split(';');
    for(let c of document.cookie.split(';')) {
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function rememberUsername(username:string) {
    setCookie('username', username)
}
function getUsername():string|null {
    return getCookie('username')
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
            console.log(url)
            const query = [
                `url=${encodeURIComponent(url)}`,
                `score=${score}`,
                `username=${username}`,
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

//TODO: live updates?
function heartbeat(spec:GameSpec, interval?:any): void {
    if (submittable(spec)) {
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
    $('#best').html(`Fastest win on this kingdom: ${best} (<a target='_blank' href='${scoreboardURL(spec)}'>scoreboard</a>)`)
}
function renderScoreboardLink(spec:GameSpec): void {
    $('#best').html(`No wins yet for this kingdom (<a target='_blank' href='${scoreboardURL(spec)}'>scoreboard</a>)`)
}


// Creating the game spec and starting the game ------------------------------


function getHistory(): string | null {
    return window.location.hash.substring(1) || null;
}

export function load(fixedURL:string=''): void {
    const url = (fixedURL.length == 0) ? window.location.search : fixedURL
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
            playGame(e.state.clearFuture())
        } else {
            alert(e)
        }
    })
}

function restart(state:State): void {
    //TODO: detach the UI to avoid a race?
    //TODO: clear hearatbeat? (currently assumes spec is the same...)
    const spec = state.spec
    state = initialState(spec)
    globalRendererState.userURL = false
    window.history.pushState(null, "")
    playGame(state.attachUI(new webUI())).catch(e => {
        if (e instanceof InvalidHistory) {
            alert(e)
            playGame(e.state.clearFuture())
        } else {
            alert(e)
        }
    })
}

// ----------------------------------- Kingdom picker
//

function kingdomURL(cards:CardSpec[], events:CardSpec[]) {
    return `play?cards=${cards.map(card => card.name).join(',')}&events=${events.map(card => card.name)}`
}

function countIn<T>(s:Set<T>, f:((t:T) => boolean)): number{
    let count = 0
    for (const x of s) if (f(x)) count += 1;
    return count
}

//TODO: refactor the logic into logic.ts, probably just state initialization
export function loadPicker(): void {
    let state = emptyState;
    const cards = mixins.slice()
    const events = eventMixins.slice()
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
    function elem(i:number): any {
        return $(`[option='${i}']`)
    }
    function prefix(s:string): string {
        const parts:string[] = s.split('/')
        return parts.slice(0, parts.length-1).join('/')
    }
    function kingdomLink(): string {
        return kingdomURL(
            Array.from(chosen.values()).filter(i => i < cards.length).map(i => cards[i]),
            Array.from(chosen.values()).filter(i => i >= cards.length).map(i => events[i - cards.length]),
        )
    }
    const chosen:Set<number> = new Set()
    function pick(i:number): void {
        if (chosen.has(i)) {
            chosen.delete(i)
            elem(i).attr('chosen', false)
        } else {
            chosen.add(i)
            elem(i).attr('chosen', true)
        }
        $('#cardCount').html(String(countIn(chosen, x => x < cards.length)))
        $('#eventCount').html(String(countIn(chosen, x => x >= cards.length)))
        if (chosen.size > 0) {
            $('#kingdomLink').attr('href', kingdomLink())
        } else {
            $('#kingdomLink').removeAttr('href')
        }
    }
    renderChoice(state,
        'Choose which events and cards to use.',
        state.supply.map((card, i) => ({
            render: card.id,
            value: () => pick(i)
        })).concat(state.events.map((card, i) => ({
            render: card.id,
            value: () => pick(cards.length + i)
        }))), trivial, trivial, trivial, undefined)
}
