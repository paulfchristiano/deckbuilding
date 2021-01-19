import { monitorEventLoopDelay } from "perf_hooks"

export const VERSION = "1.7.7"

// ----------------------------- Formatting

export function renderCost(cost:Partial<Cost>, full:boolean=false): string {
    const parts:string[] = []
    const toRender:CostResourceName[] = full ? allCostResources : ['coin', 'energy']
    for (const name of toRender) {
        const x:number|undefined = cost[name]
        if (x != undefined && x > 0) parts.push(renderResource(name, x))
    }
    return parts.join(' ')
}

//renders either "1 x" or "n xs" as appropriate
function num(n:number, x:string) {
    return `${n} ${x}${n == 1 ? '' : 's'}`
}
function aOrNum(n:number, x:string) {
    return (n == 1) ? a(x) : `${n} ${x}s`
}

//renders either "a" or "an" as appropriate
function a(s:string): string {
    const c = s[0].toLowerCase()
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s
    return 'a ' + s
}

function lowercaseFirst(s:string): string {
    return s[0].toLowerCase() + s.slice(1)
}

function renderResource(resource:ResourceName, amount:number): string {
    if (amount < 0) return '-' + renderResource(resource, -amount)
    switch(resource) {
        case 'coin': return `$${amount}`
        case 'energy':
            if (amount > 5 || amount % 1 != 0) return `@x${amount}`
            else return repeatSymbol('@', amount)
        case 'points': return `${amount} vp`
        case 'actions': return num(amount, 'action')
        case 'buys': return num(amount, 'buy')
        default: assertNever(resource)
    }
}

export function renderEnergy(amount:number): string {
    return renderResource('energy', amount)
}

function repeatSymbol(s:string, n:number): string {
    const parts: string[] = []
    for (var i = 0; i < n; i++) {
        parts.push(s)
    }
    return parts.join('')
}

// ----------------------------- Cards

export interface CardSpec {
    name: string;
    fixedCost?: Cost;
    restrictions?: Restriction[];
    variableCosts?: VariableCost[];
    buyCost?: Cost; //TODO: variable buy costs
    relatedCards?: CardSpec[];
    effects?: Effect[];
    triggers?: TypedTrigger[];
    staticTriggers?: TypedTrigger[];
    replacers?: TypedReplacer[];
    staticReplacers?: TypedReplacer[];
    ability?: Effect[];
}

export interface Cost {
    coin: number;
    energy: number;
    actions: number;
    buys: number;
    effects: Transform[];
    tests: ((s:State) => boolean)[];
}
const free:Cost = {coin:0, energy:0, actions:0, buys:0, effects: [], tests: []}

type ActionKind = 'play' | 'use' | 'buy' | 'activate'

interface Restriction {
    text?: string;
    test: (card:Card, state:State, kind:ActionKind) => boolean;
}

export interface VariableCost {
    calculate: (card:Card, state:State) => Partial<Cost>;
    text: string;
}

interface Effect {
    text: string[];
    transform: (s:State, c:Card) => Transform;
}

export interface Trigger <T extends GameEvent = any> {
    text: string;
    kind: T['kind'];
    handles: (e:T, s:State, c:Card) => boolean;
    transform: (e:T, s:State, c:Card) => Transform;
}

export interface Replacer <T extends Params = any> {
    text: string;
    kind: T['kind'];
    handles: (p:T, s:State, c:Card) => boolean;
    replace: (p:T, s:State, c:Card) => T;
}

export interface Ability {
    cost?: (c:Card) => Cost;
    costStr?: string;
    effects: Effect[];
}

interface Source {
    id?: number;
    name: string;
}
const unk:Source = {name:'?'} //Used as a default when we don't know the source

interface CardUpdate {
    ticks?: number[];
    place?: PlaceName;
    tokens?: Map<Token, number>;
    zoneIndex?: number;
}

export class Card {
    readonly name: string;
    readonly charge: number;
    public readonly kind = 'card'
    constructor(
        public readonly spec:CardSpec,
        public readonly id:number,
        public readonly ticks: number[] = [0],
        public readonly tokens: Map<Token, number> = new Map(),
        public readonly place:PlaceName = 'void',
        // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
        public readonly zoneIndex = 0,
    ) {
        this.name = spec.name
        this.charge = this.count('charge')
    }
    toString():string {
        return this.name
    }
    update(newValues: CardUpdate): Card {
        return new Card(
            this.spec,
            this.id,
            (newValues.ticks === undefined) ? this.ticks : newValues.ticks,
            (newValues.tokens === undefined) ? this.tokens : newValues.tokens,
            (newValues.place === undefined) ? this.place : newValues.place,
            (newValues.zoneIndex === undefined) ? this.zoneIndex : newValues.zoneIndex,
        )
    }
    setTokens(token:Token, n:number): Card {
        const tokens: Map<Token, number> = new Map(this.tokens)
        tokens.set(token, n)
        return this.update({tokens:tokens})
    }
    addTokens(token:Token, n:number): Card {
        return this.setTokens(token, this.count(token) + n)
    }
    count(token:Token): number {
        return this.tokens.get(token) || 0
    }
    startTicker(): Card {
        return this.update({ticks: this.ticks.concat([1])})
    }
    endTicker(): Card {
        return this.update({ticks: this.ticks.slice(0, this.ticks.length-1)})
    }
    tick(): Card {
        const n:number = this.ticks.length
        const t:number = this.ticks[n-1]
        return this.update({ticks: this.ticks.slice(0, n-1).concat([t+1])})
    }
    baseCost(state:State, kind:ActionKind): Cost {
        switch (kind) {
            case 'play':
            case 'use':
                let result:Cost = this.spec.fixedCost || free
                if (this.spec.variableCosts != undefined) {
                    for (const vc of this.spec.variableCosts) {
                        result = addCosts(result, vc.calculate(this, state))
                    }
                }

                if (kind == 'play') result = addCosts(result, {actions:1});
                return result
            case 'buy': return addCosts(this.spec.buyCost || free, {buys:1})
            case 'activate': return free
            default: return assertNever(kind)
        }
    }
    // the cost after replacement effects
    cost(kind:ActionKind, state:State): Cost {
        const card:Card = this
        const initialCost:CostIncreaseParams = {
            kind:'costIncrease',
            actionKind:kind,
            card:card,
            cost:card.baseCost(state, kind)
        }
        const increasedCost:CostIncreaseParams = replace(initialCost, state)
        const newCost:CostParams = replace({...increasedCost, kind:'cost'}, state)
        return newCost.cost
    }
    // the transformation that actually pays the cost, with tracking
    payCost(kind:ActionKind): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            state = state.log(`Paying for ${card.name}`)
            const cost:Cost = card.cost(kind, state)
            return withTracking(
                payCost(cost, card),
                {kind:'cost', card:card, cost:cost}
            )(state)
        }
    }
    play(source:Source=unk): Transform {
        return this.activate('play', source)
    }
    buy(source:Source=unk): Transform {
        return this.activate('buy', source)
    }
    use(source:Source=unk): Transform {
        return this.activate('use', source)
    }
    activate(kind:ActionKind, source:Source=unk) {
        let card:Card = this
        return async function(state:State) {
            card = state.find(card)
            state = logAct(state, kind, card)
            const before:State = state
            let trackingSpec:TrackingSpec, gameEvent:GameEvent;
            switch (kind) {
                case 'play':
                    trackingSpec = {kind:'none', card:card}
                    gameEvent = {kind:'play', card:card, source:source}
                    state = state.log(`Playing ${card.name}`)
                    state = state.indent()
                    state = await move(card, 'resolving')(state)
                    state = state.unindent()
                    break
                case 'buy':
                    trackingSpec = {kind:'buying', card:card}
                    gameEvent = {kind:'buy', card:card, source:source}
                    state = state.log(`Buying ${card.name}`)
                    break
                case 'use':
                    trackingSpec = {kind: 'effect', card:card}
                    gameEvent = {kind:'use', card:card, source:source}
                    state = state.log(`Using ${card.name}`)
                    break
                case 'activate':
                    trackingSpec = {kind: 'ability', card:card}
                    gameEvent = {kind:'activate', card:card, source:source}
                    state = state.log(`Activating ${card.name}`)
                    break
                default: return assertNever(kind)
            }
            state = await withTracking(async function(state) {
                state = await trigger(gameEvent)(state)
                switch (kind) {
                    case 'use':
                    case 'play':
                        for (const effect of card.effects()) {
                            card = state.find(card)
                            state = await effect.transform(state, card)(state)
                        }
                        return state
                    case 'activate':
                        for (const effect of card.abilityEffects()) {
                            card = state.find(card)
                            state = await effect.transform(state, card)(state)
                        }
                        return state
                    case 'buy':
                        state = await create(card.spec, 'discard')(state)
                        return state
                    default: return assertNever(kind)
                }
            }, trackingSpec)(state)
            card = state.find(card)
            switch (kind) {
                case 'play':
                    if (card.place == 'resolving') {
                    	state = state.indent()
                        state = await move(card, 'discard')(state);
                    	state = state.unindent()
                    }
                    state = await trigger({
                        kind:'afterPlay',
                        card:card,
                        source:source,
                        before:before,
                    })(state)
                    return state
                case 'use':
                    state = await trigger({
                        kind:'afterUse',
                        card:card,
                        source:source,
                        before:before,
                    })(state)
                    return state
                case 'buy':
                    state = await trigger({
                        kind:'afterBuy',
                        card:card,
                        source:source,
                        before:before
                    })(state)
                    return state
                case 'activate': return state
                default: return assertNever(kind)
            }
        }
    }

    abilityEffects(): Effect[] {
        return this.spec.ability || []
    }
    effects(): Effect[] {
        return this.spec.effects || []
    }
    triggers(): TypedTrigger[] {
        return this.spec.triggers || []
    }
    staticTriggers(): TypedTrigger[] {
        return this.spec.staticTriggers|| []
    }
    replacers(): TypedReplacer[] {
        return this.spec.replacers || []
    }
    staticReplacers(): TypedReplacer[] {
        return this.spec.staticReplacers|| []
    }
    relatedCards(): CardSpec[] {
        return this.spec.relatedCards || []
    }
    restrictions(): Restriction[] {
        return this.spec.restrictions || []
    }
    available(kind:ActionKind, state:State): boolean {
        if (kind == 'activate' && this.spec.ability === undefined) return false;
        for (const restriction of this.restrictions()) {
            if (restriction.test(this, state, kind))
                return false
        }
        return canPay(this.cost(kind, state), state)
    }
}

// ------------------------- State


type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

type ZoneName = 'supply' | 'hand' | 'discard' | 'play' | 'events' | 'void'
export type PlaceName = ZoneName | 'resolving'

type Zone = Card[]

type Resolving = (Card|Shadow)[]

export type Replayable = number

interface Resources {
    coin:number;
    energy:number;
    actions:number;
    buys:number;
    points:number
}

type CostResourceName = 'coin' | 'energy' | 'actions' | 'buys'
const allCostResources:CostResourceName[] = ['coin', 'energy', 'actions', 'buys']
type ResourceName = CostResourceName | 'points'
const allResources:ResourceName[] = (allCostResources as ResourceName[]).concat(['points'])

interface FoundResult {
    found:true;
    card:Card;
    place:ZoneName | 'resolving'
}

interface NotFoundResult {
    found:false;
    card:null;
    place:null;
}
const notFound = {found:(false as false), card:null, place:null}

type FindResult = FoundResult | NotFoundResult

export interface UI {
    choice<T>(
        s:State,
        prompt:string,
        options:Option<T>[],
        info: string[],
        chosen: number[],
    ): Promise<number>;
    victory(s:State): Promise<void>;
}

const noUI:UI = {
    async choice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        info: string[],
    ): Promise<number> {
        throw new ReplayEnded(state)
    },
    async victory(state:State): Promise<void> {
        throw new ReplayVictory(state)
    }
}

function get<T, K extends keyof T>(
    stateUpdate:Partial<T>,
    k:K,
    state:T,
): Partial<T>[K] {
    return (stateUpdate[k] === undefined) ? state[k] : stateUpdate[k]
}

type RANDOMType = 'random'
export const RANDOM:RANDOMType = 'random'
export type SlotSpec = CardSpec|RANDOMType


export type LogType = 'all' | 'energy' | 'acts' | 'costs'
export const logTypes:LogType[] = ['all', 'energy', 'acts', 'costs']
type SingleLog = [string, State|null][]
interface Log {
    'all': SingleLog, 'energy':SingleLog,
    'acts':SingleLog, 'costs':SingleLog
}
const emptyLog:Log = {'all':[], 'energy':[], 'acts':[], 'costs':[]}

export interface Kingdom {
    cards: CardSpec[];
    events: CardSpec[];
}

type Randomizer = {
    'seed': string,
    'expansions': ExpansionName[],
}

export type GameSpec =
    { kind: 'test' } |
    { kind: 'pick', cards:CardSpec[], events:CardSpec[] } |
    { kind: 'pickR', cards:SlotSpec[], events:SlotSpec[], randomizer: Randomizer } |
    { kind: 'require', cards:SlotSpec[], events:SlotSpec[], randomizer: Randomizer } |
    { kind: 'goal', vp: number, spec: GameSpec} |
    { kind: 'full', randomizer: Randomizer}

export class State {
    public readonly coin:number;
    public readonly energy:number;
    public readonly points:number;
    public readonly actions:number;
    public readonly buys:number;

    public readonly vp_goal:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly void:Zone;
    public readonly events:Zone;
    constructor(
        public readonly spec: GameSpec = {kind:'full', randomizer: {expansions: [], seed: ''}},
        public readonly ui: UI = noUI,
        public readonly resources:Resources =
            {coin:0, energy:0, points:0, actions:0, buys:0},
        public readonly zones:Map<ZoneName,Zone> = new Map(),
        public readonly resolving:Resolving = [],
        public readonly nextID:number = 0,
        public readonly history: Replayable[] = [],
        public readonly future: Replayable[] = [],
        public readonly redo: Replayable[] = [],
        public readonly checkpoint: State|null = null,
        public readonly logs: Log = emptyLog,
        public readonly logIndent: number = 0,
    ) {
        this.coin = resources.coin
        this.energy = resources.energy
        this.points = resources.points
        this.actions = resources.actions
        this.buys = resources.buys

        this.supply = zones.get('supply') || []
        this.hand = zones.get('hand') || []
        this.discard= zones.get('discard') || []
        this.play = zones.get('play') || []
        this.void = zones.get('void') || []
        this.events = zones.get('events') || []

        this.vp_goal = goalForSpec(spec)
    }
    update(stateUpdate:Partial<State>) {
        return new State(
            this.spec,
            get(stateUpdate, 'ui', this),
            get(stateUpdate, 'resources', this),
            get(stateUpdate, 'zones', this),
            get(stateUpdate, 'resolving', this),
            get(stateUpdate, 'nextID', this),
            get(stateUpdate, 'history', this),
            get(stateUpdate, 'future', this),
            get(stateUpdate, 'redo', this),
            get(stateUpdate, 'checkpoint', this),
            get(stateUpdate, 'logs', this),
            get(stateUpdate, 'logIndent', this),
        )
    }
    public getZone(zone:ZoneName): Zone {
        return this.zones.get(zone) || []
    }
    attachUI(ui:UI=noUI) {
        return this.update({ui:ui})
    }
    addResolving(x:Card|Shadow): State {
        return this.update({resolving: this.resolving.concat([x])})
    }
    popResolving(): State {
        return this.update({resolving: this.resolving.slice(0, this.resolving.length-1)})
    }
    sortZone(zone:ZoneName): State {
        const newZones:Map<ZoneName,Zone> = new Map(this.zones)
        let newZone:Card[] = (this.zones.get(zone) || []).slice()
        newZone.sort((a, b) => (a.name.localeCompare(b.name)))
        newZone = newZone.map((x, i) => x.update({zoneIndex: i}))
        newZones.set(zone, newZone)
        return this.update({zones:newZones})

    }
    resolvingCards(): Card[] {
        const result:Card[] = []
        for (const c of this.resolving) {
            if (c.kind == 'card') result.push(c)
        }
        return result

    }
    addToZone(card:Card, zone:ZoneName|'resolving'): State {
        card = card.update({place:zone})
        if (zone == 'resolving') return this.addResolving(card)
        const newZones:Map<ZoneName,Zone> = new Map(this.zones)
        const currentZone = this[zone]
        card = card.update({zoneIndex: firstFreeIndex(currentZone)})
        newZones.set(zone,  insertAt(currentZone, card))
        return this.update({zones:newZones})
    }
    remove(card:Card): State {
        const newZones:Map<ZoneName,Zone> = new Map()
        for (let [name, zone] of this.zones) {
            newZones.set(name, zone.filter(c => c.id != card.id))
        }
        return this.update({zones:newZones, resolving:this.resolving.filter(c => c.id != card.id)})
    }
    apply(f:(c:Card) => Card, card:Card): State {
        const newZones:Map<ZoneName,Zone> = new Map()
        for (let [name, zone] of this.zones) {
            newZones.set(name, zone.map(c => (c.id == card.id) ? f(c) : c))
        }
        function fOnCard(c:(Card|Shadow)): Card|Shadow {
            if (c instanceof Shadow || c.id != card.id) return c
            return f(c)
        }
        return this.update({zones:newZones, resolving:this.resolving.map(fOnCard)})
    }
    replace(oldCard:Card, newCard:Card) {
        return this.apply(_ => newCard, oldCard)
    }
    addShadow(spec:ShadowSpec): State {
        let state:State = this
        let id:number; [state, id] = state.makeID()
        let shadow:Shadow = new Shadow(id, spec)
        return state.addResolving(shadow)
    }
    setResources(resources:Resources): State {
        return this.update({resources:resources})
    }
    idMap(): Map<number, Card> {
        const byId:Map<number, Card> = new Map()
        for (const [name, zone] of this.zones) {
            for (const card of zone) {
                byId.set(card.id, card)
            }
        }
        for (const card of this.resolving) {
            if (card.kind == 'card') {
                byId.set(card.id, card)
            }
        }
        return byId
    }
    find(card:Card): Card {
        for (let [name, zone] of this.zones) {
            const matches:Card[] = zone.filter(c => c.id == card.id)
            if (matches.length > 0) return matches[0]
        }
        const zone = this.resolving;
        const matches:Card[] = (zone.filter(c => c.id == card.id) as Card[])
        if (matches.length > 0) return matches[0]
        return card.update({place:'void'})
    }
    startTicker(card:Card): State {
        return this.apply(card => card.startTicker(), card)
    }
    endTicker(card:Card): State {
        return this.apply(card => card.endTicker(), card)
    }
    consumeRedo(record:Replayable): State {
        let result:Replayable|null,
            redo:Replayable[];
        [result, redo] = popLast(this.redo)
        if (result === null) return this;
        return this.update({redo: result == record ? redo : []})
    }
    addHistory(record:Replayable): State {
        return this.update({history: this.history.concat([record])})
    }
    log(msg:string, logType:LogType='all'): State {
        //return this
        const logs:Log = {...this.logs}
        if (logType == 'all') msg = indent(this.logIndent, msg)
        //we need to obliterate future, since we want to log what's happening now
        //we need to backup since we won't remember where we are in the code
        const state:State|null = this.update({future:[]}).backup()
        logs[logType] = logs[logType].concat([[msg, state]])
        return this.update({logs: logs})
    }
    shiftFuture(): [State, Replayable|null] {
        let result:Replayable|null, future:Replayable[]; [result, future] = shiftFirst(this.future);
        return [this.update({future:future,}), result]
    }
    popFuture(): [State, Replayable|null] {
        let result:Replayable|null, future:Replayable[]; [result, future] = popLast(this.future);
        return [this.update({future:future,}), result]
    }
    // Invariant: starting from checkpoint and replaying the history gets you to the current state
    // To maintain this invariant, we need to record history every time there is a change
    setCheckpoint(): State {
        return this.update({history:[], future:this.future, checkpoint:this})
    }
    indent(): State {
        return this.update({logIndent:this.logIndent+1})
    }
    unindent(): State {
        return this.update({logIndent:this.logIndent-1})
    }
    // backup() leads to the same place as this if you run mainLoop, but it has more future
    // this enables undoing by backing up until you have future, then just popping from the future
    backup(): State|null {
        const last:State|null = this.checkpoint
        return (last==null) ? null : last.update({
            future:this.history.concat(this.future),
            redo:this.redo
        })
    }
    makeID(): [State, number] {
        const id:number = this.nextID
        return [this.update({nextID: id+1}), id]
    }
    lastReplayable(): Replayable|null {
        if (this.history.length > 0)
            return this.history[this.history.length-1]
        else if (this.checkpoint == null)
            return null
        else
            return this.checkpoint.lastReplayable()
    }
    undoable(): boolean {
        return (this.lastReplayable() != null)
    }
    clearFuture(): State {
        return this.update({future: []})
    }
    addRedo(action:Replayable): State {
        const result:State = this.update({redo: this.redo.concat([action])})
        return result
    }
    origin(): State {
        let state:State = this;
        let prev:State|null = state;
        while (prev != null) {
            state = prev;
            prev = state.backup()
        }
        return state
    }
    hasHistory(): boolean {
        return this.origin().future.length > 0
    }
    serializeHistory(includeVersion:boolean=true): string {
        return serializeReplay({
            version: includeVersion ? VERSION : '',
            actions:this.origin().future
        })
    }
    static fromReplayString(s:string, spec:GameSpec): State {
        return State.fromReplay(parseReplay(s), spec)
    }
    static fromReplay(replay:Replay, spec:GameSpec): State {
        if (replay.version != VERSION)
            throw new VersionMismatch(replay.version || 'null');
        return initialState(spec).update({future:replay.actions})
    }
}

function arrayEq<T>(xs: T[], ys:T[]): boolean {
    return (xs.length == ys.length) && xs.every((x, i) => x == ys[i])
}

export type Replay = {
    version: string;
    actions: Replayable[];
}

export class MalformedReplay extends Error {
    constructor(public s:string) {
        super(`Not a well-formed replay: ${s}`)
        Object.setPrototypeOf(this, MalformedReplay.prototype)
    }
}

export function coerceReplayVersion(r:Replay): Replay {
    return {version: VERSION, actions:r.actions}
}

export function serializeReplay(r:Replay): string {
    return [r.version].concat(r.actions.map(x => x.toString())).join(';')
}

export function parseReplay(s:string): Replay {
    const [version, pieces] = shiftFirst(s.split(';'))
    if (version === null) throw new MalformedReplay('No version');
    function parsePiece(piece:string): number {
        const result = parseInt(piece)
        if (isNaN(result)) {
            throw new MalformedReplay(`${piece} is not a valid action`);
        }
        return result
    }
    return {version:version, actions: pieces.map(parsePiece)}
}

export class VersionMismatch extends Error {
    constructor(public historyVersion:string) {
        super(`Current version ${VERSION} does not match replay version ${historyVersion}`)
        Object.setPrototypeOf(this, VersionMismatch.prototype)
    }
}

function indent(n:number, s:string) {
    const parts:string[] = []
    for (let i = 0; i < n; i++) {
        parts.push('&nbsp;&nbsp;')
    }
    parts.push(s)
    return parts.join('')
}

function popLast<T>(xs: T[]): [T|null, T[]] {
    const n = xs.length
    if (n == 0) return [null, xs]
    return [xs[n-1], xs.slice(0, n-1)]
}

function shiftFirst<T>(xs:T[]): [T|null, T[]] {
    if (xs.length == 0) return [null, xs]
    return [xs[0], xs.slice(1)]
}

export const emptyState:State = new State()


// ---------- Methods for inserting cards into zones

type InsertLocation = 'bottom'// | 'top' | 'start' | 'end'

function assertNever(x: never): never {
    throw new Error(`Unexpected: ${x}`)
}

function insertInto<T>(x:T, xs:T[], n:number): T[] {
    return xs.slice(0, n).concat([x]).concat(xs.slice(n))
}

function firstFreeIndex(cards:Card[]) {
    const indices = new Set(cards.map(card => card.zoneIndex))
    for (let i = 0; i < cards.length+1; i++) {
        if (!indices.has(i)) return i
    }
}

function insertAt(zone:Zone, card:Card): Zone {
    return zone.concat([card])
}

function createRaw(state:State, spec:CardSpec, zone:ZoneName='discard', loc:InsertLocation='bottom'): [State, Card] {
    let id:number; [state, id] = state.makeID()
    const card:Card = new Card(spec, id)
    state = state.addToZone(card, zone)
    return [state, card]
}

function createRawMulti(state:State, specs:CardSpec[], zone:ZoneName='discard', loc:InsertLocation='bottom'): State {
    for (const spec of specs) {
        let card; [state, card] = createRaw(state, spec, zone, loc)
    }
    return state
}

// --------------------- Events and triggers

interface BuyEvent {kind:'buy'; card:Card; source:Source}
interface AfterBuyEvent {kind:'afterBuy'; card:Card; source:Source, before:State}
interface PlayEvent {kind:'play'; card:Card; source:Source}
interface AfterPlayEvent {kind:'afterPlay'; card:Card; source:Source, before:State}
interface UseEvent {kind:'use'; card:Card; source:Source}
interface AfterUseEvent {kind:'afterUse'; card:Card; source:Source, before:State}
interface ActivateEvent {kind:'activate', card:Card, source:Source}
interface CreateEvent {kind:'create', card:Card, zone:ZoneName}
interface MoveEvent {kind:'move', fromZone:PlaceName, toZone:PlaceName, card:Card}
interface DiscardEvent {kind:'discard', cards:Card[]}
interface CostEvent {kind:'cost', cost:Cost, source:Source}
interface ResourceEvent {kind:'resource', resource:ResourceName, amount:number, source:Source}
interface GainChargeEvent {kind:'gainCharge', card:Card, oldCharge:number, newCharge:number, cost:boolean}
interface RemoveTokensEvent { kind:'removeTokens', card:Card, token:string, removed:number }
interface AddTokenEvent {kind: 'addToken', card:Card, token:Token, amount:number}
interface GameStartEvent {kind:'gameStart' }

type GameEvent = BuyEvent | AfterBuyEvent | PlayEvent | AfterPlayEvent |
    UseEvent | AfterUseEvent | ActivateEvent |
    CreateEvent | MoveEvent | DiscardEvent |
    CostEvent | ResourceEvent |
    GainChargeEvent | RemoveTokensEvent | AddTokenEvent |
    GameStartEvent
type TypedTrigger = Trigger<BuyEvent> | Trigger<AfterBuyEvent> | Trigger<PlayEvent> | Trigger<AfterPlayEvent> |
    Trigger<UseEvent> | Trigger<AfterUseEvent> | Trigger<ActivateEvent> |
    Trigger<CreateEvent> | Trigger<MoveEvent> | Trigger<DiscardEvent> |
    Trigger<CostEvent> | Trigger<ResourceEvent> |
    Trigger<GainChargeEvent> | Trigger<RemoveTokensEvent> | Trigger<AddTokenEvent> |
    Trigger<GameStartEvent>

//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger<T extends GameEvent>(e:T): Transform {
    return async function(state:State): Promise<State> {
        const initialState = state;
        const triggers:[Card, TypedTrigger][] = [];
        for (const card of state.events.concat(state.supply))
            for (const trigger of card.staticTriggers())
                triggers.push([card, trigger])
        for (const card of state.play)
            for (const trigger of card.triggers())
                triggers.push([card, trigger])
        for (const [card, rawTrigger] of triggers) {
            if (rawTrigger.kind == e.kind) {
                const trigger:Trigger<T> = ((rawTrigger as unknown) as Trigger<T>)
                if (trigger.handles(e, initialState, card)
                    && trigger.handles(e, state, card)) {
                    state = state.log(`Triggering ${card}`)
                    state = await withTracking(
                        trigger.transform(e, state, card),
                        {kind:'trigger', trigger:trigger, card:card}
                    )(state)
                }
            }
        }
        return state
    }
}

// ----------------------- Params and replacement

interface ResourceParams {kind:'resource', resource:ResourceName, amount:number, source:Source, effects:Transform[]}
interface CostParams {kind:'cost', actionKind: ActionKind, card:Card, cost:Cost}
interface CostIncreaseParams {kind:'costIncrease', actionKind: ActionKind, card:Card, cost:Cost}
interface MoveParams {kind:'move', card:Card, fromZone:PlaceName, toZone:PlaceName, effects:Transform[], skip:boolean}
interface VictoryParams {kind: 'victory', victory: boolean}
interface CreateParams {
    kind:'create',
    spec:CardSpec,
    zone:ZoneName|null,
    effects:Array<(c:Card) => Transform>
}

type Params = ResourceParams | CostParams | MoveParams | CreateParams | CostIncreaseParams | VictoryParams
type TypedReplacer = Replacer<ResourceParams> | Replacer<CostParams> |
    Replacer<MoveParams> | Replacer<CreateParams> | Replacer<CostIncreaseParams> |
    Replacer<VictoryParams>

function replace<T extends Params>(x: T, state: State): T {
    const replacers:[Card, TypedReplacer][] = []
    for (const card of state.events.concat(state.supply))
        for (const replacer of card.staticReplacers())
            replacers.push([card, replacer])
    for (const card of state.play)
        for (const replacer of card.replacers())
            replacers.push([card, replacer])
    for (const [card, rawReplacer] of replacers) {
        if (rawReplacer.kind == x.kind) {
            const replacer = ((rawReplacer as unknown) as Replacer<T>)
            if (replacer.handles(x, state, card)) {
                x = replacer.replace(x, state, card)
            }
        }
    }
    return x
}


// --------------------- Shadows and tracking

// a Shadow is displayed in the resolving area if there is no card to put there

interface ShadowEffectSpec {
    kind:'effect';
    card:Card;
}
interface ShadowCostSpec {
    kind:'cost';
    cost:Cost;
    card:Card;
}
interface ShadowAbilitySpec {
    kind:'ability';
    card:Card;
}
interface ShadowBuySpec {
    kind:'buying',
    card:Card
}
interface ShadowTriggerSpec {
    kind:'trigger';
    card:Card;
    trigger:Trigger;
}
interface NoShadowSpec {
    kind:'none',
    card:Card
}
type ShadowSpec = ShadowEffectSpec | ShadowAbilitySpec |
    ShadowTriggerSpec | ShadowCostSpec | ShadowBuySpec
type TrackingSpec = ShadowSpec | NoShadowSpec

export class Shadow {
    public readonly kind = 'shadow'
    constructor(
        public readonly id:number,
        public readonly spec:ShadowSpec,
        public readonly tick:number=1,
    ) { }
    tickUp(): Shadow {
        return new Shadow(this.id, this.spec, this.tick+1)
    }
}

function startTracking(state:State, spec:TrackingSpec): State {
    if (spec.kind != 'none') state = state.addShadow((spec as ShadowSpec))
    state = state.startTicker(spec.card).indent()
    return state
}

function stopTracking(state:State, spec:TrackingSpec): State {
    state = state.unindent().endTicker(spec.card)
    if (spec.kind != 'none') state = state.popResolving()
    return state
}

function withTracking(f:Transform, spec:TrackingSpec): Transform {
    return async function(state) {
        state = startTracking(state, spec)
        state = await f(state)
        state = stopTracking(state, spec)
        return state
    }
}

// this updates a state by incrementing the tick on the given card,
// and ticking its shadow (which we assume is the last thing in resolving)
function tick(card: Card): ((s: State) => State) {
    return function(state: State): State {
        state = state.apply(x => x.tick(), card)
        const last:(Card|Shadow) = state.resolving[state.resolving.length-1];
        if (last instanceof Shadow) {
            state = state.popResolving()
            state = state.addResolving(last.tickUp())
        }
        return state
    }
}



// ---------------------------------- Transformations that move cards

function create(
    spec:CardSpec,
    zone:ZoneName='discard',
    postprocess:(c:Card) =>Transform=()=>noop,
): Transform {
    return async function(state:State) {
        let card; [card, state] = await createAndTrack(spec, zone)(state)
        if (card != null) state = await postprocess(card)(state)
        return state
    }
}

function createAndTrack(
    spec:CardSpec,
    zone:ZoneName='discard',
): ((s:State) => Promise<[Card|null, State]>) {
    return async function(state: State): Promise<[Card|null, State]> {
        let params:CreateParams = {kind:'create', spec:spec, zone:zone, effects:[]}
        params = replace(params, state)
        spec = params.spec
        let card:Card|null = null
        if (params.zone !=  null) {
            [state, card] = createRaw(state, spec, params.zone)
            for (const effect of params.effects) state = await effect(card)(state)
            state = state.log(`Created ${a(card.name)} in ${params.zone}`)
            state = await trigger({kind:'create', card:card, zone:params.zone})(state)
        }
        return [card, state]
    }
}

function createAndPlay(spec:CardSpec, source:Source=unk): Transform {
    return create(spec, 'void', (c => c.play(source)))
}

function move(card:Card, toZone:PlaceName, logged:boolean=false): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) return state
        let params:MoveParams = {kind:'move', card:card, fromZone:card.place, toZone:toZone, effects:[], skip:false}
        params = replace(params, state)
        if (!params.skip) {
            toZone = params.toZone
            card = params.card
            state = state.remove(card)
            if (toZone == null) {
                if (!logged) state = state.log(`Trashed ${card.name} from ${card.place}`)
            } else {
                state = state.addToZone(card, toZone)
                if (!logged) state = state.log(`Moved ${card.name} from ${card.place} to ${toZone}`)
            }
            state = await trigger({kind:'move', fromZone:card.place, toZone:toZone, card:card})(state)
        }
        for (const effect of params.effects) {
            state = await effect(state)
        }
        return state
    }
}

function showCards(cards:Card[]): string {
    return cards.map((card:Card) => card.name).join(', ')
}

function moveMany(cards:Card[], toZone:PlaceName, logged:boolean=false): Transform {
    return async function(state) {
        state = await doAll(cards.map(card => move(card, toZone, true)))(state)
        if (cards.length == 0 || logged) {
            return state
        }
        else if (toZone == null) {
            return state.log(`Trashed ${showCards(cards)}`)
        } else {
            return state.log(`Moved ${showCards(cards)} to ${toZone}`)
        }
    }
}

function trash(card:Card|null, logged:boolean=false): Transform {
    return (card == null) ? noop : move(card, 'void', logged)
}

function discard(n:number): Transform {
    return async function(state) {
        let cards:Card[];
        [state, cards] = (state.hand.length <= n) ? [state, state.hand] :
            await multichoice(state, `Choose ${n} cards to discard.`,
                state.hand.map(asChoice), n, n)
        state = await moveMany(cards, 'discard')(state)
        return trigger({kind:'discard', cards:cards})(state)
    }
}

// --------------- Transforms that change points, energy, and coins

function logChange(
    state:State,
    noun:string,
    n:number,
    positive:[string, string],
    negative:[string, string],
): State {
    if (n == 1) {
        return state.log(positive[0] + a(noun) +  positive[1])
    } else if (n > 1) {
        return state.log(positive[0] + `${n} ` + noun + 's' + positive[1])
    } else if (n < 0) {
        return logChange(state, noun, -n, negative, positive)
    }
    return state
}

class CostNotPaid extends Error {
    constructor(message:string) {
        super(message)
        Object.setPrototypeOf(this, CostNotPaid.prototype)
    }
}

function payCost(c:Cost, source:Source=unk): Transform {
    return async function(state:State): Promise<State> {
        if (state.coin < c.coin) throw new CostNotPaid("Not enough coin")
        if (state.actions < c.actions) throw new CostNotPaid("Not enough actions")
        if (state.buys < c.buys) throw new CostNotPaid("Not enough buys")
        state = state.setResources({
            coin:state.coin - c.coin,
            actions:state.actions - c.actions,
            buys:state.buys - c.buys,
            energy:state.energy + c.energy,
            points:state.points
        })
        if (renderCost(c, true) != '') {
            state = state.log(`Paid ${renderCost(c, true)}`)
        }
        if (renderCost(c, false) != '') {
            state = state.log(`${renderCost(c, false)} for ${source}`, 'costs')
        }
        if (c.energy > 0) {
            state = state.log(`${c.energy} for ${source}`, `energy`)
        }
        for (const effect of c.effects) {
            state = await effect(state)
        }
        return trigger({kind:'cost', cost:c, source:source})(state)
    }
}

function gainResource(resource:ResourceName, amount:number, source:Source=unk) {
    return async function(state:State): Promise<State> {
        if (amount == 0) return state
        const newResources =  {
            coin:state.coin,
            energy:state.energy,
            points:state.points,
            actions:state.actions,
            buys:state.buys,
        }
        let params:ResourceParams = {
            kind:'resource',
            amount:amount,
            resource:resource,
            source:source,
            effects: []
        }
        params = replace(params, state)
        resource = params.resource
        amount = params.amount
        newResources[resource] = Math.max(newResources[resource] + amount, 0)
        state = state.setResources(newResources)
        state = state.log(amount > 0 ?
            `Gained ${renderResource(resource, amount)}` :
            `Lost ${renderResource(resource, -amount)}`)
        for (const transform of params.effects) state = await transform(state)
        return trigger({kind:'resource', resource:resource, amount:amount, source:source})(state)
    }
}

function setResource(resource:ResourceName, amount:number, source:Source=unk) {
    return async function(state:State) {
        return gainResource(
            resource,
            amount - state.resources[resource],
            source
        )(state)
    }
}

function gainActions(n:number, source:Source=unk): Transform {
    return async function(state:State) {
        return gainResource('actions', n, source)(state)
    }
}

export class Victory extends Error {
    constructor(public state:State) {
        super('Victory')
        Object.setPrototypeOf(this, Victory.prototype)
    }
}

export class ReplayVictory extends Error {
    constructor(public state:State) {
        super('ReplayVictory')
        Object.setPrototypeOf(this, ReplayVictory.prototype)
    }
}

function gainEnergy(n:number, source:Source=unk): Transform {
    return gainResource('energy', n, source)
}

export const DEFAULT_VP_GOAL = 40
function gainPoints(n:number, source:Source=unk): Transform {
    return async function(state) {
        state = await gainResource('points', n, source)(state)
        const vp_goal = state.vp_goal
        if (vp_goal > 0 && state.points >= vp_goal) {
            const victoryParams:VictoryParams = replace({kind: 'victory', victory: true}, state)
            if (victoryParams.victory) throw new Victory(state)
        }
        return state
    }
}

function gainCoins(n:number, source:Source=unk): Transform {
    return gainResource('coin', n, source)
}

function gainBuys(n:number, source:Source=unk): Transform {
    return gainResource('buys', n, source)
}

const gainBuy = gainBuys(1)

// ------------------------ Utilities for manipulating transformations

function doOrAbort(f:Transform, fallback:Transform|null=null): Transform {
    return async function(state){
        try {
            const result = await f(state)
            return result
        } catch(error){
            if (error instanceof CostNotPaid) {
                if (fallback != null) return fallback(state)
                return state
            } else {
                throw error
            }
        }
    }
}

function payToDo(cost:Transform, effect:Transform): Transform {
    return doOrAbort(async function(state) {
        state = await cost(state)
        return effect(state)
    })
}

function doAll(effects:Transform[]): Transform {
    return async function(state) {
        for (let i = 0; i < effects.length; i++) {
            state = await effects[i](state)
        }
        return state
    }
}

function noop(state:State): State {
    return state
}

// -------------------- Utilities for manipulating costs

function addCosts(a:Cost, b:Partial<Cost>): Cost {
    return {
        coin:a.coin + (b.coin || 0),
        energy:a.energy+(b.energy || 0),
        actions:a.actions+(b.actions || 0),
        buys:a.buys + (b.buys || 0),
        effects:a.effects.concat(b.effects || []),
        tests:a.tests.concat(b.tests || []),
    }
}

function multiplyCosts(c:Partial<Cost>, n:number): Partial<Cost> {
    const result:Partial<Cost> = {}
    for (const resource of allCostResources) {
        const r:number|undefined = c[resource]
        if (r != undefined) result[resource] = n * r
    }
    if (c.effects != undefined) {
        result.effects = []
        for (let i = 0; i < n; i++) {
            result.effects = result.effects.concat(c.effects)
        }
    }
    return result
}

type Partial<T> = { [P in keyof T]?: T[P] }

function subtractCost(c:Cost, reduction:Partial<Cost>): Cost {
    return {
        coin:Math.max(0, c.coin - (reduction.coin || 0)),
        energy:Math.max(0, c.energy - (reduction.energy || 0)),
        actions:Math.max(0, c.actions - (reduction.actions || 0)),
        buys:Math.max(0, c.buys - (reduction.buys || 0)),
        effects:c.effects,
        tests:c.tests
    }
}

function eq(a:Cost, b:Cost): boolean {
    return a.coin == b.coin && a.energy == b.energy && a.actions == b.actions
}


function leq(cost1:Cost, cost2:Cost) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy
}


// ----------------- Transforms for charge and tokens

export type Token = 'charge' | 'cost' | 'mirror' | 'duplicate' | 'twin' | 'synergy' |
    'shelter' | 'echo' | 'decay' | 'burden' | 'pathfinding' | 'neglect' |
    'reuse' | 'polish' | 'priority' | 'parallelize' | 'art' |
    'mire' | 'onslaught' | 'expedite' | 'replicate' | 'reflect' | 'brigade' |
    'pillage' | 'bargain' | 'splay' | 'crown' | 'ferry' | 'ideal' | 'reconfigure'

function discharge(card:Card, n:number): Transform {
    return charge(card, -n, true)
}

function uncharge(card:Card): Transform {
    return async function(state:State): Promise<State> {
        card = state.find(card)
        if (card.place != null) state = await charge(card, -card.charge)(state)
        return state
    }
}

function charge(card:Card, n:number=1, cost:boolean=false): Transform {
    return async function(state:State): Promise<State> {
        card = state.find(card)
        if (card.place == null) {
            if (cost) throw new CostNotPaid(`card no longer exists`)
            return state
        }
        if (card.charge + n < 0 && cost) throw new CostNotPaid(`not enough charge`)
        const oldCharge:number = card.charge
        const newCharge:number = Math.max(oldCharge+n, 0)
        state = state.apply(card => card.setTokens('charge', newCharge), card)
        state = logChange(state, 'charge token', newCharge - oldCharge,
            ['Added ', ` to ${card.name}`],
            ['Removed ', ` from ${card.name}`])
        return trigger({kind:'gainCharge', card:card,
            oldCharge:oldCharge, newCharge:newCharge, cost:cost})(state)
    }
}

function logTokenChange(state:State, card:Card, token:Token, n:number): State {
    return logChange(state, `${token} token`, n,
        ['Added ', ` to ${card.name}`],
        ['Removed ', ` from ${card.name}`])
}

function addToken(card:Card, token:Token, n:number=1): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) return state
        const newCard = card.addTokens(token, n)
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, n)
        return trigger({kind:'addToken', card:newCard, token:token, amount:n})(state)
    }
}

function removeToken(card:Card, token:Token, n:number|'all'=1, isCost:boolean=false): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) {
            if (isCost) throw new CostNotPaid(`Couldn't remove ${token} token.`)
            return state
        }
        const current = card.count(token)
        if (n != 'all' && n > current && isCost)
            throw new CostNotPaid(`Couldn't remove ${num(n, token + ' token')}.`)
        const removed = (n == 'all') ? current : Math.min(current, n)
        const newCard:Card = card.addTokens(token, -removed)
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, -removed)
        return trigger({kind:'removeTokens', card:newCard, token:token, removed:removed})(state)
    }
}

// ---------------- Randomness

// pseudorandom float in [0,1] based on two integers a, b
// homemade, probably not very good
function PRF(a: number, b: number) {
    const N = 123456789
    return ((a * 1003303882 + b * 6690673372 + b * b * 992036483 +
        a * a * 99202618 + ((a*a+1) / (b*b+1)) * 399220 +
        ((b*b+1) / (a*a+1)) * 392901666676)  % N) / N
}

function randomChoices<T>(
    xs:T[],
    n:number,
    seed?:number
): T[] {
    const result = []
    xs = xs.slice()
    while (result.length < n) {
        if (xs.length == 0) return result
        if (xs.length == 1) return result.concat(xs)
        const rand = (seed == null) ? Math.random() : PRF(seed, result.length)
        const k = Math.floor(rand * xs.length)
        result.push(xs[k])
        xs[k] = xs[xs.length-1]
        xs = xs.slice(0, xs.length-1)
    }
    return result
}

// -------------------------------------- Player choices

export type ID = number

export type OptionRender = {kind:'card', card:Card}
                         | {kind:'string', string:string}

type Key = string

export type HotkeyHint = {kind:'number', val:number} | {kind:'none'} |
    {kind:'boolean', val:boolean} | {kind:'key', val:Key}

export interface Option<T> {
    render: OptionRender;
    hotkeyHint?: HotkeyHint;
    value: T;
}

export class ReplayEnded extends Error {
    constructor(public state:State) {
        super('ReplayEnded')
        Object.setPrototypeOf(this, ReplayEnded.prototype)
    }
}

export class InvalidHistory extends Error {
    constructor(public index:Replayable, public state:State) {
        super(`Index ${index} does not correspond to a valid choice`)
        Object.setPrototypeOf(this, InvalidHistory.prototype)
    }
}

export class Undo extends Error {
    constructor(public state:State) {
        super('Undo')
        Object.setPrototypeOf(this, Undo.prototype)
    }
}

export class SetState extends Error {
    constructor(public state:State) {
        super('Undo')
        Object.setPrototypeOf(this, SetState.prototype)
    }
}

async function doOrReplay(
    state: State,
    f: () => Promise<Replayable>,
): Promise<[State, Replayable]> {
    let record:Replayable | null; [state, record] = state.shiftFuture()
    let x: Replayable;
    if (record !== null) {
        x = record
    } else {
        x = await f()
        state = state.consumeRedo(x)
    }
    return [state.addHistory(x), x]
}

async function choice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    info:string[] = [],
    chosen:number[] = [],
): Promise<[State, T|null]> {
    let index:number;
    if (options.length == 0 && info.indexOf('actChoice') == -1) return [state, null];
    let indices:number[], newState:State; [newState, index] = await doOrReplay(
        state,
        () => state.ui.choice(state, prompt, options, info, chosen)
    )
    if (index >= options.length || index < 0)
        throw new InvalidHistory(index, state)
    return [newState, options[index].value]
}

async function multichoice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    max:number|null=null,
    min:number=0,
    info:string[] = [],
): Promise<[State, T[]]> {
    const chosen:number[] = []
    while (true) {
        if (max != null && chosen.length == max) break
        let nextOptions:Option<number|null>[] = options.map(
            (option, i) => ({...option, value:i})
        )
        if (chosen.length >= min) {
            nextOptions = allowNull(nextOptions, 'Done')
        }
        let next:number|null; [state, next] = await choice(
            state, prompt, nextOptions, info, chosen
        )
        if (next === null) break
        const k = chosen.indexOf(next)
        if (k == -1) {
            chosen.push(next)
        } else {
            chosen.splice(k, 1)
        }
    }
    return [state, chosen.map(i => options[i].value)]
}


const yesOrNo:Option<boolean>[] = [
    {
        render: {kind:'string', string:'Yes'},
        value:true,
        hotkeyHint:{kind:'boolean', val:true}
    }, {
        render: {kind:'string', string:'No'},
        value:false,
        hotkeyHint:{kind:'boolean', val:false}
    }
]

function range(n:number):number[] {
    const result:number[] = []
    for (let i = 0; i < n; i++) result.push(i)
    return result
}

function chooseNatural(n:number):Option<number>[] {
    return range(n).map(x => ({
        render:{kind:'string', string:String(x)},
        value:x,
        hotkeyHint:{kind:'number', val:x}
    }))
}

function asChoice(x:Card): Option<Card> {
    return {render:{kind:'card', card:x}, value:x}
}

function asNumberedChoices(xs:Card[]): Option<Card>[] {
    return xs.map((card, i) => ({
        render:{kind:'card', card:card},
        value:card,
        hotkeyHint:{kind:'number', val:i}
    }))
}

function allowNull<T>(options: Option<T>[], message:string="None"): Option<T|null>[] {
    const newOptions:Option<T|null>[] = options.slice()
    newOptions.push({
        render:{kind:'string', string:message},
        value:null,
        hotkeyHint:{kind:'none'}
    })
    return newOptions
}

// ---------------------------- Game loop

function undo(startState: State): State {
    let state:State|null = startState
    while (true) {
        let last:Replayable|null; [state, last] = state.popFuture()
        if (last == null) {
            state = state.backup()
            if (state == null) throw Error("tried to undo past beginning of the game")
        } else {
            return state.addRedo(last)
        }
    }
}

export async function verifyScore(spec:GameSpec, history:string, score:number): Promise<[boolean, string]> {
    try {
        await playGame(State.fromReplayString(history, spec))
        return [true, ""] //unreachable
    } catch(e) {
        if (e instanceof ReplayVictory) {
            if (e.state.energy == score)
                return [true, ""]
            else
                return [false, `Computed score was ${e.state.energy}`]
        } else if (e instanceof InvalidHistory) {
            return [false, `${e}`]
        } else if (e instanceof VersionMismatch) {
            return [false, `${e}`]
        } else if (e instanceof ReplayEnded) {
            return [false, `${e}`]
        } else {
            throw e
        }
    }
}



// --------------------- act

// This is the 'default' choice the player makes when nothing else is happening

function logAct(state:State, act:ActionKind, card:Card): State {
    switch (act) {
        case 'play': return state.log(`Played ${card.name}`, 'acts')
        case 'buy':
            //state = state.log(card.name, 'buys')
            return state.log(`Bought ${card.name}`, 'acts')
        case 'use':
            //state = state.log(card.name, 'buys')
            return state.log(`Used ${card.name}`, 'acts')
        case 'activate': return state
        default: assertNever(act)
    }
}

async function act(state:State): Promise<State> {
    let picked:[Card, ActionKind]|null;
    [state, picked] = await actChoice(state)
    if (picked == null) {
        throw new Error('No valid options.');
    }
    const [card, kind] = picked
    return payToDo(card.payCost(kind), card.activate(kind, {name:'act'}))(state)
}

function canPay(cost:Cost, state:State): boolean {
    return (
        cost.coin <= state.coin &&
        cost.actions <= state.actions &&
        cost.buys <= state.buys &&
        cost.tests.every(t => t(state))
    )
}

function actChoice(state:State): Promise<[State, [Card, ActionKind]|null]> {
    function asActChoice(kind:ActionKind) {
        return function(c:Card): Option<[Card, ActionKind]> {
            return {render:{kind:'card', card:c}, value:[c, kind]}
        }
    }
    function available(kind:ActionKind) { return (c:Card) => c.available(kind, state) }
    const hand = state.hand.filter(available('play')).map(asActChoice('play'))
    const supply = state.supply.filter(available('buy')).map(asActChoice('buy'))
    const events = state.events.filter(available('use')).map(asActChoice('use'))
    const play = state.play.filter(available('activate')).map(asActChoice('activate'))
    return choice(state, `Buy a card (costs 1 buy),
        play a card from your hand (costs 1 action),
        or use an event.`,
        hand.concat(supply).concat(events).concat(play), ['actChoice'])
    /*
    return choice(state, `Use an event or card in play,
        pay a buy to buy a card from the supply,
        or pay an action to play a card from your hand.`,
        hand.concat(supply).concat(events).concat(play), ['actChoice'])
    */
}

// ------------------------------ Start the game

export function coinKey(spec:CardSpec): number {
    if (spec.buyCost !== undefined)
        return spec.buyCost.coin
    return 0
}
export function coinEventKey(spec:CardSpec): number {
    return (spec.fixedCost || free).coin
}
export function energyEventKey(spec:CardSpec): number {
    return (spec.fixedCost || free).energy
}
export type Comp<T> = (a:T, b:T) => number
export function toComp<T>(key:(x:T) => number): Comp<T> {
    return (a, b) => key(a) - key(b)
}
export function nameComp(a:CardSpec, b:CardSpec): number {
    return a.name.localeCompare(b.name, 'en')
}
function lexical<T>(comps:Comp<T>[]): Comp<T> {
    return function(a:T, b:T){
        for (const comp of comps) {
            const result:number = comp(a, b)
            if (result != 0) return result
        }
        return 0
    }
}
export const supplyComp:Comp<CardSpec> = lexical([
    toComp(coinKey), nameComp
])
export const eventComp:Comp<CardSpec> = lexical([
    toComp(coinEventKey), toComp(energyEventKey), nameComp
])

// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s:string):number{
    var hash:number = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash<<5)-hash)+s.charCodeAt(i)
    }
    return hash
}

function fillTo<T>(n:number, filler:T, xs:T[]): T[] {
    const m = n - xs.length
    return (m > 0) ? xs.concat(Array(m).fill(filler)) : xs
}

export function cardsAndEvents(
    spec:GameSpec
): {cards:SlotSpec[], events:SlotSpec[]} {
    switch (spec.kind) {
        case 'goal': return cardsAndEvents(spec.spec)
        case 'full': return {cards: Array(10).fill(RANDOM), events:Array(4).fill(RANDOM)}
        case 'test': return {cards: [], events: []}
        case 'pick': return {cards: [], events: []}
        case 'pickR': return {cards: spec.cards, events: spec.events}
        case 'require': return {
            cards: fillTo(10, RANDOM, spec.cards),
            events: fillTo(4, RANDOM, spec.events)
        }
        default: return assertNever(spec)
    }
}

function usableExpansions(spec:GameSpec): ExpansionName[] {
    switch (spec.kind) {
        case 'test': return expansionNames
        case 'pick': return []
        case 'goal': return usableExpansions(spec.spec)
        default: return spec.randomizer.expansions
    }
}

type SetSpec = {
    'cards': CardSpec[],
    'events': CardSpec[],
}

export type ExpansionName = 'base' | 'expansion' | 'absurd'
const expansionNames:ExpansionName[] = ['base', 'expansion', 'absurd']
type SetName = 'core' | ExpansionName

function emptySet(): SetSpec {
    return {'cards': [], 'events': []}
}

export const sets = {
    'core': emptySet(),
    'base': emptySet(),
    'expansion': emptySet(),
    'absurd': emptySet(),
}

export function makeKingdom(spec:GameSpec): Kingdom {
    switch (spec.kind) {
        case 'test':
            return {
                cards:allCards,
                events:allEvents.concat(cheats),
            }
        case 'pick':
            return {cards:spec.cards, events:spec.events}
        case 'goal':
            return makeKingdom(spec.spec)
        default:
            const kingdom = cardsAndEvents(spec)
            const expansions = usableExpansions(spec)
            return {
                cards: pickRandoms(kingdom.cards, cardsFrom('cards', expansions), 'cards' + spec.randomizer.seed),
                events: pickRandoms(kingdom.events, cardsFrom('events', expansions), 'events' + spec.randomizer.seed),
            }
    }
}

function randomSeed(): string {
    return Math.random().toString(36).substring(2, 7)
}

export class MalformedSpec extends Error {
    constructor(public s:string) {
        super(`Not a well-formed game spec: ${s}`)
        Object.setPrototypeOf(this, MalformedSpec.prototype)
    }
}

export function getTutorialSpec(): GameSpec {
    return {
        cards:[throneRoom],
        events:[duplicate],
        kind: 'pick'
    }
}

function stringComp(a:string, b:string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase(), 'en')
}

function normalizeString(s:string): string {
    return s.split('').filter(c => c != ' ' && c != "'").join('').toLowerCase()
}
function normalizePreservingCase(xs:string[]): string[] {
    function f(s:string) {
        return s.split('').filter(c => c != ' ' && c != "'").join('')
    }
    return xs.map(f).sort(stringComp)
}
function normalize(xs:string[]): string[] {
    return xs.map(normalizeString).sort(stringComp)
}

function makeDictionary(xs:CardSpec[]): Map<string, CardSpec> {
    const result:Map<string, CardSpec> = new Map()
    for (const x of xs) result.set(normalizeString(x.name), x);
    return result
}

function extractList(names:string[], xs:CardSpec[]): SlotSpec[] {
    const dictionary = makeDictionary(xs)
    const result:SlotSpec[] = []
    for (const name of names) {
        if (normalizeString(name) == normalizeString(RANDOM)) {
            result.push(RANDOM)
        } else {
            const lookup = dictionary.get(normalizeString(name))
            if (lookup == undefined)
                throw new MalformedSpec(`${name} is not a valid name`);
            result.push(lookup)
        }
    }
    return result
}

function mapToURL(args:Map<string, string>): string {
    return Array.from(args.entries()).map(x => `${x[0]}=${x[1]}`).join('&')
}

function renderSlots(slots:SlotSpec[]) {
    const result:string[] = []
    for (const slot of slots) {
        if (slot == RANDOM) result.push(slot);
        else result.push(slot.name);
    }
    return normalizePreservingCase(result).join(',')
}

function nontrivialExpansions(expansionNames:ExpansionName[]): boolean {
    return (expansionNames.length != 1 || expansionNames[0] != 'base')
}

export function specToURL(spec:GameSpec): string {
    const args:Map<string, string> = new Map()
    if (spec.kind != 'full')
        args.set('kind', spec.kind)
    switch (spec.kind) {
        case 'goal':
            const goal = spec.vp
            return (goal == DEFAULT_VP_GOAL)
                ? specToURL(spec.spec)
                : `${specToURL(spec.spec)}&vp=${spec.vp}`
        case 'full':
            if (nontrivialExpansions(spec.randomizer.expansions)) {
                args.set('expansions', spec.randomizer.expansions.join(','))
            }
            args.set('seed', spec.randomizer.seed)
            break
        case 'pickR':
        case 'require':
            args.set('cards', renderSlots(spec.cards))
            args.set('events', renderSlots(spec.events))
            if (nontrivialExpansions(spec.randomizer.expansions)) {
                args.set('expansions', spec.randomizer.expansions.join(','))
            }
            args.set('seed', spec.randomizer.seed)
            break
        case 'pick':
            args.set('cards', renderSlots(spec.cards))
            args.set('events', renderSlots(spec.events))
            break
        case 'test': break
        default: return assertNever(spec)
    }
    return mapToURL(args)
}

function split(s:string, sep:string): string[] {
    if (s.length == 0) {
        return []
    } else  {
        return s.split(sep)
    }
}

export function parseExpansionString(expansionString:string|null): ExpansionName[] {
    const expansionStrings:string[] = (expansionString === null) ? ['base']
        : normalize(split(expansionString, ','))
    const expansions:ExpansionName[] = []
    for (const s of expansionStrings) {
        const n = (expansionNames as string[]).indexOf(s)
        if (n < 0) {
            throw new MalformedSpec(`Invalid expansion name ${s}`)
        } else {
            expansions.push(expansionNames[n])
        }
    }
    return expansions;
}

export function specFromURL(search:string, excludeGoal:boolean = false): GameSpec {
    const searchParams = new URLSearchParams(search)
    if (!excludeGoal) {
        const vp_goal:string|null = searchParams.get('vp')
        if (vp_goal !== null) {
            return {kind:'goal',
                    vp: Number(vp_goal),
                    spec: specFromURL(search, true)}
        }
    }
    const urlKind:string|null = searchParams.get('kind')
    const cardsString:string|null = searchParams.get('cards')
    const cards:string[] = (cardsString === null) ? []
        : normalize(split(cardsString, ','))
    const eventsString:string|null = searchParams.get('events')
    const events:string[] = (eventsString === null) ? []
        : normalize(split(eventsString, ','))
    const expansionString:string|null = searchParams.get('expansions')
    const expansions:ExpansionName[] = parseExpansionString(expansionString)
    const seed:string|null = searchParams.get('seed') || randomSeed()
    let kind:string

    function pickOrPickR() {
        if (cards.indexOf(RANDOM) >= 0 || events.indexOf(RANDOM) >= 0) {
            return 'pickR'
        } else {
            return 'pick'
        }
    }

    if (urlKind !== null) {
        if (urlKind == 'pick' || urlKind == 'pickR') kind = pickOrPickR()
        else kind = urlKind
    } else {
        if (cards.length == 0 && events.length == 0) kind = 'full';
        else kind = pickOrPickR()
    }

    switch(kind) {
        case 'full':
            return {kind:kind, randomizer: {seed:seed, expansions: expansions}}
        case 'pick':
            const cardSpecs:CardSpec[] = [];
            const eventSpecs:CardSpec[] = [];
            if (cards !== null) {
                for (const card of extractList(cards, allCards)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else cardSpecs.push(card)
                }
            }
            if (events !== null) {
                for (const card of extractList(events, allEvents)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else eventSpecs.push(card)
                }
            }
            return {kind:kind, cards:cardSpecs, events:eventSpecs}
        case 'require':
            return {
                kind:kind, randomizer: {seed:seed, expansions:expansions},
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents),
            }
        case 'pickR':
            return {kind:kind, randomizer: {seed:seed, expansions:expansions},
                    cards:(cards === null) ? [] : extractList(cards, allCards),
                    events:(events === null) ? [] : extractList(events, allEvents)}
        case 'test': return {kind: 'test'}
        default: throw new MalformedSpec(`Invalid kind ${kind}`)
    }
}

function pickRandoms(slots:SlotSpec[], source:CardSpec[], seed:string): CardSpec[] {
    const taken:Set<string> = new Set()
    const result:CardSpec[] = []
    let randoms = 0;
    for (const slot of slots) {
        if (slot == RANDOM) {
            randoms += 1
        } else {
            taken.add(slot.name);
            result.push(slot)
        }
    }
    return result.concat(randomChoices(
        source.filter(x => !taken.has(x.name)),
        randoms, hash(seed)
    ))
}

function goalForSpec(spec:GameSpec): number {
    switch (spec.kind) {
        case 'goal': return spec.vp
        default: return DEFAULT_VP_GOAL
    }
}

export function normalizeURL(url:string): string{
	const spec:GameSpec = specFromURL(url)
    const kingdom:Kingdom = makeKingdom(spec)
    let normalizedSpec:GameSpec = {
        kind:'goal', vp:goalForSpec(spec),
        spec: {kind:'pick', cards:kingdom.cards, events:kingdom.events}
    }
    return specToURL(normalizedSpec)
}

export function initialState(spec:GameSpec): State {
    const startingHand:CardSpec[] = [copper, copper, copper, estate, estate]

    const kingdom:Kingdom = makeKingdom(spec)

    const variableSupplies = kingdom.cards.slice()
    const variableEvents = kingdom.events.slice()
    variableSupplies.sort(supplyComp)
    variableEvents.sort(eventComp)

    const supply = sets.core.cards.concat(variableSupplies)
    const events = sets.core.events.concat(variableEvents)

    let state = new State(spec)
    state = createRawMulti(state, supply, 'supply')
    state = createRawMulti(state, events, 'events')
    state = createRawMulti(state, startingHand, 'discard')
    return state
}

export async function playGame(state:State, resume:boolean=false): Promise<void> {
    if (resume) {
        const checkpoint:State|null = state.backup()
        if (checkpoint != null) state = checkpoint
    } else {
        state = await trigger({kind:'gameStart'})(state)
    }
    let victorious:boolean = false
    while (true) {
        state = state.setCheckpoint()
        try {
            if (victorious) {
                //never returns, only outcome is raising Undo
                await state.ui.victory(state)
            } else {
                state = await act(state)
            }
        } catch (error) {
            victorious = false
            if (error instanceof Undo) {
                state = undo(error.state)
            } else if (error instanceof SetState) {
                state = undoOrSet(error.state, state)
            } else if (error instanceof Victory) {
                state = error.state
                victorious = true
            } else {
                throw error
            }
        }
    }
}

function reversed<T>(it:IterableIterator<T>): IterableIterator<T> {
    const xs = Array.from(it)
    xs.reverse()
    return xs.values()
}

// ------------------------- Browsing

function undoOrSet(to:State, from:State): State {
    const newHistory = to.origin().future
    const oldHistory = from.origin().future
    const newRedo = from.redo.slice()
    let predecessor = to.spec == from.spec
    if (predecessor) {
        for (const [i, e] of reversed(oldHistory.entries())) {
            if (i >= newHistory.length) {
                newRedo.push(e)
            } else if (newHistory[i] != e) {
                predecessor = false;
            }
        }
    }
    return predecessor ? to.update({redo: newRedo, ui:from.ui}) : to
}



//
// ----------------- CARDS -----------------
//

const cheats:CardSpec[] = []

//
// ----------- UTILS -------------------
//

function createEffect(spec:CardSpec, zone:ZoneName='discard', n:number=1): Effect {
    const zoneText = (zone == 'play') ? 'play' : `your ${zone}`
    return {
        text: [`Create ${aOrNum(n, spec.name)} in ${zoneText}.`],
        transform: () => repeat(create(spec, zone), n),
    }
}

interface Extras {
    triggers?:TypedTrigger[];
    replacers?:TypedReplacer[];
    onBuy?:Effect[];
    afterBuy?:Effect[];
}
function supplyForCard(
    card:CardSpec,
    cost:Cost,
    extra:Extras={}
): CardSpec {
    const buyTriggers:Trigger<BuyEvent>[] = (extra.onBuy || []).map(
        t => ({
            kind: 'buy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `When you buy this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const afterTriggers:Trigger<AfterBuyEvent>[] = (extra.afterBuy || []).map(
        t => ({
            kind: 'afterBuy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `After buying this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const triggers:TypedTrigger[] = (buyTriggers as TypedTrigger[])
        .concat(afterTriggers as TypedTrigger[])
        .concat(extra.triggers || [])
    return {
        ...card,
        buyCost: cost,
        staticTriggers: triggers,
        staticReplacers: extra.replacers,
    }
}
function energy(n:number):Cost {
    return {...free, energy:n}
}
function coin(n:number):Cost {
    return {...free, coin:n}
}
function trashThis():Effect {
    return {
        text: ['Trash this.'],
        transform: (s:State, c:Card) => trash(c)
    }
}

function makeCard(card:CardSpec, cost:Cost, selfdestruct:boolean=false):CardSpec  {
    const effects:Effect[] = [{
        text: [`Create ${a(card.name)} in play.`],
        transform: () => create(card, 'play')
    }]
    if (selfdestruct) effects.push(trashThis())
    return {name:card.name,
        fixedCost: cost,
        effects: effects,
        relatedCards: [card],
    }
}

function registerEvent(card:CardSpec, set:SetName):void {
    sets[set]['events'].push(card)
}


//
//
// ------ CORE ------
//

function sortHand(state:State): State {
    return state.sortZone('hand')
}

async function ploughTransform(state:State): Promise<State> {
    return doAll([
        moveMany(state.discard, 'hand'),
        moveMany(state.play, 'hand'),
        sortHand,
    ])(state)
}


function ploughEffect(): Effect {
    return {
        text: ['Put your discard and play into your hand'],
        transform: () => ploughTransform
    }
}

function refreshEffect(n:number, doRecycle:boolean=true): Effect {
    let text:string[] = ['Lose all $, actions, and buys.']
    if (doRecycle) text.push('Put your discard and play into your hand.');
    text.push(`+${num(n, 'action')}, +1 buy.`)
    return {
        text: text,
        transform: (state, card) => async function(state) {
            state = await setResource('coin', 0)(state)
            state = await setResource('actions', 0)(state)
            state = await setResource('buys', 0)(state)
            if (doRecycle) state = await ploughTransform(state);
            state = await gainActions(n, card)(state)
            state = await gainBuy(state)
            return state
        }
    }
}

function coinsEffect(n:number): Effect {
    return {
        text: [`+$${n}.`],
        transform: (s:State, c:Card) => gainCoins(n, c),
    }
}
function pointsEffect(n:number): Effect {
    return {
        text: [`+${n} vp.`],
        transform: (s:State, c:Card) => gainPoints(n, c),
    }
}
function actionsEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'action')}.`],
        transform: (s:State, c:Card) => gainActions(n, c),
    }
}
function buysEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'buy')}.`],
        transform: (state, card) => gainBuys(n, card),
    }
}
function buyEffect() { return buysEffect(1) }

function chargeEffect(n:number=1): Effect {
    return {
        text: [`Put ${aOrNum(n, 'charge token')} on this.`],
        transform: (s, card) => charge(card, n)
    }
}

const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
}
registerEvent(refresh, 'core')

const copper:CardSpec = {name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
}
register(copper, 'core')

const silver:CardSpec = {name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
}
register(silver, 'core')

const gold:CardSpec = {name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
}
register(gold, 'core')

const estate:CardSpec = {name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}
register(estate, 'core')

const duchy:CardSpec = {name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
}
register(duchy, 'core')

const province:CardSpec = {name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
}
register(province, 'core')


//
// ----- MIXINS -----
//

function register(card:CardSpec, set:SetName):void {
    sets[set].cards.push(card)
}
function buyable(card:CardSpec, n:number, set:SetName, extra:Extras={}) {
    card.buyCost = coin(n)
    register(supplyForCard(card, coin(n), extra), set)
}
function buyableFree(card:CardSpec, coins:number, set:SetName): void {
    buyable(card, coins, set, {onBuy: [buyEffect()]})
}


function playAgain(target:Card, source:Source=unk): Transform {
    return async function(state:State) {
        target = state.find(target)
        if (target.place == 'discard') state = await target.play(source)(state)
        return state
    }
}

function descriptorForKind(kind:ActionKind):string {
    switch (kind) {
        case 'play': return 'Cards you play'
        case 'buy': return 'Cards you buy'
        case 'use': return 'Events you use'
        case 'activate': return 'Abilities you use'
        default: return assertNever(kind)
    }
}

function reducedCost(cost:Cost, reduction:Partial<Cost>, nonzero:boolean=false) {
    let newCost:Cost = subtractCost(cost, reduction)
    if (nonzero && leq(newCost, free) && !leq(cost, free)) {
        if ((reduction.coin || 0) > 0) {
            newCost = addCosts(newCost, {coin:1})
        } else if ((reduction.energy || 0) > 0) {
            newCost = addCosts(newCost, {energy:1})
        }
    }
    return newCost
}

function costReduce(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false,
): Replacer<CostParams> {
    const descriptor = descriptorForKind(kind)
    return {
        text: `${descriptor} cost ${renderCost(reduction, true)}
               less${nonzero ? ' unless it would make them free' : ''}.`,
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            return {...x, cost:newCost}
        }
    }
}

function costReduceNext(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false
): Replacer<CostParams> {
    const descriptor = descriptorForKind(kind)
    return {
        text: `${descriptor} cost ${renderCost(reduction, true)}
               less${nonzero ? ' unless it would make them free' : ''}.
        Whenever this reduces a cost, discard it.`,
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            if (!eq(newCost, x.cost)) newCost.effects = newCost.effects.concat([move(card, 'discard')])
            return {...x, cost:newCost}
        }
    }
}

function applyToTarget(
    f:(target:Card) => Transform,
    text:string,
    options:(s:State) => Card[],
    special:{optional?:string, cost?:boolean} = {},
): Transform {
    return async function(state) {
        let choices:Option<Card|null>[] = options(state).map(asChoice)
        if (special.optional !== undefined) choices = allowNull(choices, special.optional)
        let target:Card|null; [state, target] = await choice(
            state, text, choices, ['applyToTarget']
        )
        if (target != null) state = await f(target)(state);
        if (target == null && special.cost == true) throw new CostNotPaid('No valid targets')
        return state
    }
}
function targetedEffect(
    f:(target:Card, card:Card) => Transform,
    text:string,
    options:(s:State) => Card[]
): Effect {
    return {
        text: [text],
        transform: (s:State, c:Card) => applyToTarget(
            target => f(target, c),
            text,
            options,
        )
    }
}


function toPlay(): Effect {
    return {
        text: ['Put this in play.'],
        transform: (state, card) => move(card, 'play')
    }
}
function villageReplacer(): Replacer<CostParams> {
    return costReduceNext('play', {energy:1})
}

const villager:CardSpec = {
    name: 'Villager',
    replacers: [{
        text: `Cards you play cost @ less. Whenever this reduces a cost, trash it.`,
        kind: 'cost',
        handles: x => x.actionKind == 'play',
        replace: function(x:CostParams, state:State, card:Card) {
            if (x.cost.energy > 0) {
                return {...x, cost: {...x.cost,
                    energy:x.cost.energy - 1,
                    effects:x.cost.effects.concat([trash(card)])
                }}
            } else {
                return x
            }
        }
    }, trashOnLeavePlay()]
}

function repeat(t:Transform, n:number): Transform {
    return doAll(Array(n).fill(t))
}

function createInPlayEffect(spec:CardSpec, n:number=1) {
    return {
        text: [`Create ${aOrNum(n, spec.name)} in play.`],
        transform: () => repeat(create(spec, 'play'), n)
    }
}

/*
const necropolis:CardSpec = {name: 'Necropolis',
    effects: [villagerEffect()],
    relatedCards: [villager],
}
buyableAnd(necropolis, 2, {onBuy: [villagerEffect()]})
*/
const ghostTown:CardSpec = {name: 'Ghost Town',
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager]
}
buyable(ghostTown, 3, 'base', {onBuy: [actionsEffect(2)]})

/*
const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
}
buyableFree(hound, 2)
*/
const transmogrify:CardSpec = {name: 'Transmogrify',
    effects: [{
        text: [`Trash a card in your hand.
                If you do, choose a card in the supply costing up to $2 more than it.
                Create a fresh copy of that card in your hand.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to transmogrify.',
                state.hand.map(asChoice)
            )
            if (target != null) {
                state = await trash(target)(state)
                const cost:Cost = addCosts(
                    target.cost('buy', state),
                    coin(2)
                )
                let target2:Card|null; [state, target2] = await choice(
                    state, 'Choose a card to copy.',
                    state.supply.filter(
                        c => leq(c.cost('buy', state), cost)
                    ).map(asChoice)
                )
                if (target2 != null) {
                    state = await create(target2.spec, 'hand')(state)
                }
            }
            return state
        }
    }]
}
buyable(transmogrify, 3, 'base')


/*
const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effects: [actionEffect(3)],
}
buyable(smithy, 4)
*/
const Till = 'Till'
const till:CardSpec = {name: Till,
    effects: [{
        text: [`Put up to 3 non-${Till} cards from your
               discard into your hand.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to three cards to put into your hand.',
                state.discard.filter(c => c.name != Till).map(asChoice),
                3)
            state = await moveMany(targets, 'hand')(state)
            return state
        }
    }]
}
buyable(till, 3, 'base')

const village:CardSpec = {name: 'Village',
    effects:  [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
}
buyable(village, 4, 'base')

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect(), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)]
}
buyable(bridge, 4, 'base')

const conclave:CardSpec = {name: 'Conclave',
    effects: [toPlay()],
    replacers: [{
        text: `Cards you play cost @ less if they don't share a name
               with a card in your discard or in play.
               Whenever this reduces a cost, discard it and +$2.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && state.discard.concat(state.play).every(c => c.name != x.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoins(2)
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
buyable(conclave, 4, 'base')

const lab:CardSpec = {name: 'Lab',
    effects: [actionsEffect(2)]
}
buyable(lab, 3, 'base')

const payAction = payCost({...free, actions:1})

function tickEffect(): Effect {
    return {
        text: [],
        transform: (state, card) => tick(card)
    }
}

function playTwice(card:Card): Transform {
    return applyToTarget(
        target => doAll([
            target.play(card),
            tick(card),
            target.play(card),
        ]), 'Choose a card to play twice.', s => s.hand
    )
}

function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction, playTwice(card))
    }
}

const throneRoom:CardSpec = {name: 'Throne Room',
    fixedCost: energy(1),
    effects: [throneroomEffect()]
}
buyable(throneRoom, 5, 'base')

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    effects: [toPlay()],
    triggers: [{
        kind: 'play',
        text: `When you play a copper, +$1.`,
        handles: e => e.card.name == copper.name,
        transform: e => gainCoins(1),
    }]
}
buyable(coppersmith, 3, 'base')

const Unearth = 'Unearth'
const unearth:CardSpec = {name: Unearth,
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(
            target => move(target, 'hand'),
            `Put a non-${Unearth} card from your discard into your hand.`,
            state => state.discard.filter(c => c.name != Unearth)
        )
    ]
}
buyable(unearth, 4, 'base')

const celebration:CardSpec = {name: 'Celebration',
    fixedCost: energy(1),
    effects: [toPlay()],
    replacers: [costReduce('play', {energy:1})]
}
buyable(celebration, 8, 'base', {replacers: [{
    text: `Whenever you would create a ${celebration.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == celebration.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]})

const Plow = 'Plow'
const plow:CardSpec = {name: Plow,
    fixedCost: energy(1),
    effects: [{
        text: [`Put all non-${Plow} cards from your discard into your hand.`],
        transform: state => doAll([
            moveMany(state.discard.filter(c => c.name != Plow), 'hand'),
            sortHand
        ])
    }]
}
buyable(plow, 4, 'base')

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    effects: [actionsEffect(3), toPlay()],
    triggers: [{
        text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
        kind: 'cost',
        handles: (e) => e.cost.energy > 0,
        transform: e => doAll([
            gainActions(e.cost.energy),
            gainCoins(e.cost.energy),
            gainBuys(e.cost.energy)
        ])
    }]
}
buyable(construction, 5, 'base')

const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:1, coin:5},
    effects: [{
        text: ['Put a mirror token on each card in your hand.'],
        transform: (state:State, card:Card) =>
            doAll(state.hand.map(c => addToken(c, 'mirror')))
    }],
    staticTriggers: [reflectTrigger('mirror')],
}
registerEvent(hallOfMirrors, 'base')

function costPer(increment:Partial<Cost>): VariableCost {
    const extraStr:string = `${renderCost(increment, true)} for each cost token on this.`
    return {
        calculate: function(card:Card, state:State) {
            return multiplyCosts(increment, state.find(card).count('cost'))
        },
        text: extraStr,
    }
}

function incrementCost(): Effect {
    return {
        text: ['Put a cost token on this.'],
        transform: (s:State, c:Card) => addToken(c, 'cost')
    }
}

/*
const restock:CardSpec = {name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), refreshEffect(5)],
}
registerEvent(restock)
*/

const escalate:CardSpec = {name: 'Escalate',
    fixedCost: energy(1),
    variableCosts: [costPer(coin(1))],
    effects: [
        chargeEffect(),
        {
            text: ['Put a cost token on this for each charge token on it.'],
            transform: (s:State, c:Card) => addToken(c, 'cost', s.find(c).charge)
        },
        refreshEffect(5),
    ]
}
registerEvent(escalate, 'base')

/*
const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    restrictions: [{
        test: (card, state) => state.hand.length > 0
    }],
    effects: [{
        text: [`If you have no cards in your hand,
        put your discard into your hand.`],
        transform: () => async function(state) {
            if (state.hand.length == 0) {
                state = await moveMany(state.discard, 'hand')(state)
                state = sortHand(state)
            }
            return state
        }
    }]
}
registerEvent(perpetualMotion)

const scrapeBy:CardSpec = {name:'Scrape By',
    fixedCost: energy(2),
    effects: [refreshEffect(1)],
}
registerEvent(scrapeBy)
*/

const volley:CardSpec = {
    name: 'Volley',
    fixedCost: energy(1),
    effects: [{
        text: [`Repeat any number of times:
        play then trash a card in your hand that was also there
        at the start of this effect and that you haven't played yet.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(c => state.find(c.value).place == 'hand')))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await trash(picked)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
registerEvent(volley, 'base')


const parallelize:CardSpec = {name: 'Parallelize',
    fixedCost: {...free, coin:1, energy:1},
    effects: [{
        text: [`Put a parallelize token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'parallelize')))
    }],
    staticReplacers: [{
        text: `Cards you play cost @ less to play for each parallelize token on them.
            Whenever this reduces a card's cost by one or more @,
            remove that many parallelize tokens from it.`,
        kind: 'cost',
        handles: (x, state, card) => x.actionKind == 'play'&& x.card.count('parallelize') > 0,
        replace: (x, state, card) => {
            const reduction = Math.min(
                x.cost.energy,
                state.find(x.card).count('parallelize')
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([
                    removeToken(x.card, 'parallelize', reduction, true)
                ])
            }}
        }
    }]
}
registerEvent(parallelize, 'base')

const reach:CardSpec = {name:'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
}
registerEvent(reach, 'base')

function trashOnLeavePlay():Replacer<MoveParams> {
    return {
        text: `Whenever this would leave play, trash it.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play',
        replace: x => ({...x, toZone:'void'})
    }
}

const fair:CardSpec = {
    name: 'Fair',
    replacers: [{
        text: `Whenever you would create a card in your discard,
        instead create the card in your hand and trash this.`,
        kind: 'create',
        handles: (e, state, card) => e.zone == 'discard'
            && state.find(card).place == 'play',
        replace: (x, state, card) => ({
            ...x, zone:'hand', effects:x.effects.concat(() => trash(card))
        })
    }, trashOnLeavePlay()]
}

function costPerN(increment:Partial<Cost>, n:number): VariableCost {
    const extraStr:string = `${renderCost(increment, true)} for every ${n} cost tokens on this.`
    return {
        calculate: function(card:Card, state:State) {
            return multiplyCosts(
                increment,
                Math.floor(state.find(card).count('cost') / n)
            )
        },
        text: extraStr,
    }
}

const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(1),
    variableCosts: [costPerN(coin(1), 10)],
    effects: [incrementCost(), buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
}
registerEvent(travelingFair, 'base')

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:6, energy:1},
    effects: [{
        text: ['Pay all $.', '+1 vp per $ paid.'],
        transform: () => async function(state) {
            const n = state.coin
            state = await payCost({...free, coin:n})(state)
            state = await gainPoints(n)(state)
            return state
        }
    }]
}
registerEvent(philanthropy, 'base')

const finance:CardSpec = {name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
}
registerEvent(finance, 'base')

/*
const Orchard = 'Orchard'
const orchard:CardSpec = {
    name: Orchard,
    effects: [targetedEffect(
        (target, card) => target.buy(card),
        `Buy ${a(Orchard)} in the supply.`,
        state => state.supply.filter(c => c.name == Orchard)
    )]
}
buyable(orchard, 2, {onBuy: [pointsEffect(1)]})
*/
const flowerMarket:CardSpec = {
    name: 'Flower Market',
    effects: [buyEffect(), pointsEffect(1)]
}
buyable(flowerMarket, 2, 'base', {onBuy: [pointsEffect(1)]})


/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/

const vault:CardSpec = {name: 'Vault',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
    staticReplacers: [{
        text: `You can't lose actions, $, or buys (other than by paying costs).`,
        kind: 'resource',
        handles: p => p.amount < 0 && (
            p.resource == 'coin' ||
            p.resource == 'actions' ||
            p.resource == 'buys'
        ),
        replace: p => ({...p, amount:0})
    }]
}
registerEvent(vault, 'base')

/*
const coffers:CardSpec = {name: 'Coffers',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
	staticReplacers: [{
		text: `You can't lose $ (other than by paying costs).`,
		kind: 'resource',
		handles: p => p.amount < 0 && p.resource == 'coin',
		replace: p => ({...p, amount:0})
	}]
}
registerEvent(coffers)
*/

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effects: [pointsEffect(1), actionsEffect(1)],
}
buyable(vibrantCity, 3, 'base')

function chargeUpTo(max:number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per charge token on this.'],
        transform: (state, card) => gainPoints(state.find(card).charge, card)
    }, chargeEffect()]
}
buyable(
    frontier, 7, 'base',
    {replacers: [startsWithCharge(frontier.name, 2)]}
)

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effects: [{
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, chargeUpTo(6)]
}
buyable(investment, 4, 'base', {replacers: [startsWithCharge(investment.name, 2)]})

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:8, energy:2},
    effects: [{
        text: ['Buy up to 6 cards in the supply.'],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 6 cards to buy',
                state.supply.map(asChoice), 6)
            for (const target of targets) {
                state = await target.buy(card)(state)
            }
            return state
        }
    }]
}
registerEvent(populate, 'base')

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:4, energy:1},
    effects: [{
        text: [`Put a duplicate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'duplicate')))
    }],
    staticTriggers: [{
        text: `After buying a card with a duplicate token on it other than with this,
        remove a duplicate token from it to buy it again.`,
        kind:'afterBuy',
        handles: (e, state, card) => {
            if (e.source.name == card.name) return false
            const target:Card = state.find(e.card);
            return target.count('duplicate') > 0
        },
        transform: (e, state, card) =>
            payToDo(removeToken(e.card, 'duplicate'), e.card.buy(card))
    }]
}
registerEvent(duplicate, 'base')

const royalSeal:CardSpec = {name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair]
}
buyable(royalSeal, 5, 'base')

function workshopEffect(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing up to $${n}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n))
        )
    )
}
const workshop:CardSpec = {name: 'Workshop',
    fixedCost: energy(0),
    effects: [workshopEffect(4)],
}
buyable(workshop, 4, 'base')

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        text: `Whenever you buy a card,
            discard this to buy the card again.`,
        kind: 'buy',
        handles: (e, state, card) => state.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.buy(card)(state)
        }
    }]
}
buyable(shippingLane, 5, 'base')

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(1),
    effects: [workshopEffect(6)],
}
buyable(factory, 3, 'base')

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a fresh copy of it in your hand.',
        state => state.hand,
    )]
}
buyable(imitation, 3, 'base')

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
    ), trashThis()]
}
buyableFree(feast, 3, 'base')

/*
const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(5)),
    effects: [chargeEffect(), incrementCost()],
    replacers: [{
        text: `${refresh.name} costs @ less to play for each charge token on this.`,
        kind:'cost',
        handles: x => (x.card.name == refresh.name),
        replace: (x, state, card) =>
            ({...x, cost:subtractCost(x.cost, {energy:state.find(card).charge})})
    }]
}
registerEvent(mobilization)
*/

const toil:CardSpec = {name:'Toil',
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
}
registerEvent(toil, 'base')

function recycleEffect(): Effect {
    return {
        text: ['Put your discard into your hand.'],
        transform: state => doAll([moveMany(state.discard, 'hand'), sortHand])
    }
}

const recycle:CardSpec = {name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
}
registerEvent(recycle, 'base')

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:5},
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    staticTriggers: [{
        text: `After playing a card with a twin token other than with this, play it again.`,
        kind: 'afterPlay',
        handles: (e, state, card) => (e.card.count('twin') > 0 && e.source.id != card.id),
        transform: (e, state, card) => e.card.play(card),
    }],
}
registerEvent(twin, 'base')

function startsWithCharge(name:string, n:number):Replacer<CreateParams> {
    return {
        text: `Each ${name} is created with ${aOrNum(n, 'charge token')} on it.`,
        kind: 'create',
        handles: p => p.spec.name == name,
        replace: p => ({...p, effects:p.effects.concat([c => charge(c, n)])})
    }
}

function literalOptions(xs:string[], keys:Key[]): Option<string>[] {
    return xs.map((x, i) => ({
        render: {kind:'string', string:x},
        hotkeyHint: {kind:'key', val:keys[i]},
        value:x
    }))
}

const researcher:CardSpec = {name: 'Researcher',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action for each charge token on this.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            state = await gainActions(n)(state)
            return state
            /*
            for (let i = 0; i < n; i++) {
                let mode:string|null; [state, mode] = await choice(
                    state,
                    `Choose a benefit (${n - i} remaining)`,
                    literalOptions(['action', 'coin'], ['a', 'c'])
                )
                switch(mode) {
                    case 'coin':
                        state = await gainCoins(1, card)(state)
                        break
                    case 'action':
                        state = await gainActions(1, card)(state)
                        break
                }
            }
            return state
            */
        }
    }, chargeEffect()]
}
buyable(researcher, 3, 'base', {replacers: [startsWithCharge(researcher.name, 3)]})

/*
const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+1 action per charge token on this.'],
        transform: (state, card) => gainActions(state.find(card).charge, card)
    }, chargeEffect()]
}
buyable(youngSmith, 3, {replacers: [startsWithCharge(youngSmith.name, 2)]})

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+4 actions -1 per charge token on this.'],
        transform: (state, card) => gainActions(4 - state.find(card).charge, card),
    }, chargeEffect()]
}
buyable(oldSmith, 3)
*/
const lackeys:CardSpec = {name: 'Lackeys',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    relatedCards: [villager],
}
buyable(lackeys, 3, 'base', {onBuy:[createInPlayEffect(villager, 1)]})

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [{
        text: ['Create two golds in your hand.'],
        transform: () => doAll([create(gold, 'hand'), create(gold, 'hand')]),
    }]
}
buyable(goldMine, 6, 'base')

function fragile(card:Card):Trigger<MoveEvent> {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: x => x.card.id == card.id,
        transform: x => trash(x.card)
    }
}
function robust(card:Card):Replacer<MoveParams> {
    return {
        text: 'Whenever this would move, leave it in play instead.',
        kind: 'move',
        handles: x => (x.card.id == card.id && x.toZone != null && x.fromZone == 'play'),
        replace: x => ({...x, skip:true})
    }
}

const expedite: CardSpec = {
    name: 'Expedite',
    fixedCost: energy(1),
    effects: [targetedEffect(
        card => addToken(card, 'expedite', 1),
        'Put an expedite token on a card in the supply.',
        state => state.supply,
    )],
    staticTriggers: [{
        text: `Whenever you create a card whose supply has an expedite token,
               remove an expedite token to play the card.`,
        kind: 'create',
        handles: (e, state) => nameHasToken(e.card, 'expedite', state),
        transform: (e, state, card) => payToDo(applyToTarget(
                target => removeToken(target, 'expedite', 1, true),
                'Remove an expedite token.',
                s => s.supply.filter(target => target.name == e.card.name),
                {cost:true},
            ), e.card.play(card))
    }]
}
registerEvent(expedite, 'base')

function removeAllSupplyTokens(token:Token): Effect {
    return {
        text: [`Remove all ${token} tokens from cards in the supply.`],
        transform: (state, card) => doAll(state.supply.map(s => removeToken(s, token, 'all')))
    }
}

const synergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:4, energy:1},
    effects: [removeAllSupplyTokens('synergy'), {
        text: ['Put synergy tokens on two cards in the supply.'],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Choose two cards to synergize.',
                state.supply.map(asChoice), 2, 2)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }],
    staticTriggers: [{
        text: 'After buying a card with a synergy token other than with this,'
        + ' buy a different card with a synergy token with equal or lesser cost.',
        kind:'afterBuy',
        handles: (e, state, card) => (e.source.id != card.id && e.card.count('synergy') > 0),
        transform: (e, state, card) => applyToTarget(
            target => target.buy(card),
            'Choose a card to buy.',
            s => s.supply.concat(s.events).filter(
                c => c.count('synergy') > 0
                && leq(c.cost('buy', s), e.card.cost('buy', s))
                && c.id != e.card.id
            )
        )
    }]
}
registerEvent(synergy, 'base')

const shelter:CardSpec = {name: 'Shelter',
    effects: [actionsEffect(1), targetedEffect(
        target => addToken(target, 'shelter'),
        'Put a shelter token on a card.',
        state => state.play
    )]
}
buyable(shelter, 3, 'base', {
    /*
    replacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token,
               instead remove a shelter token from it.`,
        handles: (x, state) => x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x, skip:true,
            effects:x.effects.concat([removeToken(x.card, 'shelter')])
        })
    }]
    */
    replacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token from play,
               instead remove a shelter token from it.`,
        handles: (x, state) => x.fromZone == 'play'
            && x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x,
            skip:true, toZone:'play',
            effects:x.effects.concat([removeToken(x.card, 'shelter')])
        })
    }]
    /*
    }, {
        kind: 'move',
        text: `Whenever you would discard a card with a shelter token after playing it,
               instead put it in your hand and remove a shelter token.`,
        handles: (x, state) => x.fromZone == 'resolving'
            && x.toZone == 'discard'
            && x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x, toZone:'hand', effects:x.effects.concat([removeToken(x.card, 'shelter')])})
    }]
    */
})

const market:CardSpec = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
}
buyable(market, 3, 'base')

const focus:CardSpec = {name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(1)],
}
registerEvent(focus, 'base')

const sacrifice:CardSpec = {name: 'Sacrifice',
    effects: [actionsEffect(1), buyEffect(), targetedEffect(
        (target, card) => doAll([target.play(card), trash(target)]),
        'Play a card in your hand, then trash it.',
        state => state.hand)]
}
buyable(sacrifice, 4, 'base')

const herbs:CardSpec = {name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
}
buyableFree(herbs, 2, 'base')

const spices:CardSpec = {name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
}
buyable(spices, 5, 'base', {onBuy: [coinsEffect(4)]})

const onslaught:CardSpec = {name: 'Onslaught',
    fixedCost: {...free, coin:3, energy:1},
	variableCosts: [costPer({coin:3})],
    effects: [incrementCost(), {
        text: [`Repeat any number of times: play a card in your hand
            that was also there at the start of this effect
            and that you haven't played yet.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'hand'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id )
                }
            }
        }
    }]
/*

    {
        text: [`Play any number of cards in your hand
        and discard the rest.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand
            state = await moveMany(cards, 'aside')(state)
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    state = await moveMany(cards.filter(c => state.find(c).place == 'aside'), 'discard')(state)
                    return state
                } else {
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                    state = await picked.play(card)(state)
                }
            }
        }
    }]
    */
}
registerEvent(onslaught, 'base')

//TODO: link these together, modules in general?

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(6)],
}
buyable(colony, 16, 'base')

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
}
buyable(platinum, 8, 'base')

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(6), buysEffect(2)]
}
buyable(greatSmithy, 6, 'base')

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
}
registerEvent(pressOn, 'base')

function KCEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand three times.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
            ]), 'Choose a card to play three times.', s => s.hand))
    }
}

const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()]
}
buyable(kingsCourt, 9, 'base')

const gardens:CardSpec = {name: "Gardens",
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
        transform: (state, card) => gainPoints(
            Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length)/8),
            card
        )
    }]
}
buyable(gardens, 4, 'base')

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [
        targetedEffect(
            target => removeToken(target, 'decay'),
            'Remove a decay token from a card.',
            s => s.hand.concat(s.play).concat(s.discard)
                       .filter(c => c.count('decay') > 0)
        )
    ],
    staticTriggers: [{
        text: `Whenever you move a card to your hand,
            if it has two or more decay tokens on it trash it,
            otherwise put a decay token on it.`,
        kind: 'move',
        handles: e => e.toZone == 'hand',
        transform: e => (e.card.count('decay') >= 2) ?
            trash(e.card) : addToken(e.card, 'decay')
    }]
}
registerEvent(decay, 'base')

function reflectTrigger(token:Token): Trigger<AfterPlayEvent> {
    return {
        text: `After playing a card with ${a(token)} token on it
        other than with this, remove ${a(token)} token and play it again.`,
        kind:'afterPlay',
        handles: (e, state, card) => {
            const played:Card = state.find(e.card)
            return played.count(token) > 0 && e.source.name != card.name
        },
        transform: (e, s, card) => doAll([
            removeToken(e.card, token),
            e.card.play(card),
        ]),
    }
}

const reflect:CardSpec = {name: 'Reflect',
    fixedCost: coin(1),
    variableCosts: [costPer({coin:1})],
    effects: [incrementCost(), targetedEffect(
    	(target, card) => addToken(target, 'reflect'),
    	'Put a reflect token on a card in your hand',
    	state => state.hand
	)],
    staticTriggers: [reflectTrigger('reflect')],
}
registerEvent(reflect, 'base')

const replicate:CardSpec = {name: 'Replicate',
    fixedCost: energy(1),
    effects: [targetedEffect(
        card => addToken(card, 'replicate', 1),
        'Put a replicate token on a card in the supply.',
        state => state.supply,
    )],
    staticTriggers: [{
        text: `After buying a card with a replicate token on it other than with this,
        remove a replicate token from it to buy it again.`,
        kind:'afterBuy',
        handles: (e, state, card) => {
            if (e.source.name == card.name) return false
            const target:Card = state.find(e.card);
            return target.count('replicate') > 0
        },
        transform: (e, state, card) =>
            payToDo(removeToken(e.card, 'replicate'), e.card.buy(card))
    }]
}
registerEvent(replicate, 'base')

function setCoinEffect(n:number) {
    return {
        text: [`Set $ to ${n}.`],
        transform: (s:State, c:Card) => setResource('coin', n, c),
    }
}

function setBuyEffect(n:number) {
    return {
        text: [`Set buys to ${n}.`],
        transform: (s:State, c:Card) => setResource('buys', n, c),
    }
}

/*
const inflation:CardSpec = {name: 'Inflation',
    calculatedCost: costPlus(energy(3), energy(1)),
    effects: [incrementCost(), setCoinEffect(15), setBuyEffect(5)],
    staticReplacers: [{
        text: `All costs of $1 or more are increased by $1 per cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.cost.coin > 0,
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
registerEvent(inflation)
*/
const inflation:CardSpec = {name: 'Inflation',
    fixedCost: energy(5),
    effects: [{
    	text: [`Lose all $ and buys.`],
    	transform: () => doAll([setResource('coin', 0), setResource('buys', 0)])
    }, {
    	text: ['+$15, +5 buys.'],
    	transform: () => doAll([gainCoins(15), gainBuys(5)])
    }, incrementCost()],
    staticReplacers: [{
        text: `Cards cost $1 more to buy for each cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.actionKind == 'buy',
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }, {
        text: `Events that cost at least $1 cost $1 more to use for each cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.actionKind == 'use' && p.cost.coin > 0,
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
registerEvent(inflation, 'base')

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effects: [{
        text: ['Remove a burden token from each supply.'],
        transform: state => doAll(state.supply.map(c => removeToken(c, 'burden')))
    }],
    staticTriggers: [{
        text: 'Whenever you create a card, put a burden token on its supply.',
        kind:'create',
        handles: (e, state) => true,
        transform: (e, state) => doAll(state.supply.filter(
            c => c.name == e.card.name
        ).map(
            c => addToken(c, 'burden')
        ))
    }],
    staticReplacers: [{
        kind: 'costIncrease',
        text: 'Cards cost $2 more to buy for each burden token on them.',
        handles: x => x.card.count('burden') > 0 && x.actionKind == 'buy',
        replace: x => ({...x, cost: addCosts(x.cost, {coin:2 * x.card.count('burden')})})
    }]
}
registerEvent(burden, 'base')

/*
const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionsEffect(3), coinsEffect(3)]
}
buyable(goldsmith, 7)
*/
const procession:CardSpec = {name: 'Procession',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay one action to play a card in your hand twice,
                then trash it and buy a card in the supply
                costing exactly $1 or $2 more.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(
                    target2 => target2.buy(card),
                    'Choose a card to buy.',
                    s => s.supply.filter(c => eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:1})
                    ) || eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:2})
                    ))
                )
            ]), 'Choose a card to play twice.', s => s.hand
        ))
    }]
}
buyable(procession, 4, 'base')

const publicWorks:CardSpec = {name: 'Public Works',
    effects: [toPlay()],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
buyable(publicWorks, 6, 'base')

function fragileEcho(t:Token = 'echo'): Trigger<MoveEvent> {
    return {
        text: `Whenever a card with ${a(t)} token is moved to your hand or discard,
               trash it.`,
        kind: 'move',
        handles: (x, state) => state.find(x.card).count(t) > 0
            && (x.toZone == 'hand' || x.toZone == 'discard'),
        transform: x => trash(x.card)
    }
}

function dedupBy<T>(xs:T[], f:(x:T) => any): T[] {
    const result:T[] = []
    for (const x of xs) {
        if (result.every(r => f(r) != f(x))) {
            result.push(x)
        }
    }
    return result
}

const echo:CardSpec = {name: 'Echo',
    effects: [targetedEffect(
        (target, card) => async function(state) {
            let copy:Card|null; [copy, state] = await createAndTrack(target.spec, 'void')(state)
            if (copy != null) {
                state = await addToken(copy, 'echo')(state)
                state = await copy.play(card)(state)
            }
            return state
        },
        `Create a fresh copy of a card you have in play,
         then put an echo token on the copy and play it.`,
        state => dedupBy(state.play, c => c.spec)
    )]
}
buyable(echo, 6, 'base', {triggers: [fragileEcho('echo')]})

function dischargeCost(c:Card, n:number=1): Cost {
    return {...free,
        effects: [discharge(c, n)],
        tests: [state => state.find(c).charge >= n]
    }
}

function discardFromPlay(card:Card): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place != 'play') throw new CostNotPaid("Card not in play.");
        return move(card, 'discard')(state)
    }
}

function discardCost(card:Card): Cost {
    return {...free,
        effects: [discardFromPlay(card)],
        tests: [state => state.find(card).place == 'play'],
    }
}

const mastermind:CardSpec = {
    name: 'Mastermind',
    fixedCost: energy(1),
    effects: [toPlay()],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && (c.charge < 1)
    }],
    replacers: [{
        text: `Whenever you would move this from play to your hand,
        instead leave it in play. If it doesn't have a charge token on it, put one on it.`,
        kind:'move',
        handles: (x, state, card) => (x.fromZone == 'play' && x.toZone == 'hand'
            && x.card.id == card.id),
        replace: (x, state, card) =>
            ({...x, skip:true, effects:x.effects.concat([
                async function(state) {
                    if (state.find(card).charge == 0) state = await charge(card, 1)(state)
                    return state
                }
            ])})
    }],
    ability:[{
        text: [`Remove a charge token from this, discard it, and pay 1 action
        to play a card from your hand three times.`],
        transform: (state, card) => payToDo(payCost({
            ...free, actions:1, effects:[discharge(card, 1), discardFromPlay(card)]
        }), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card)
            ]),
            'Choose a card to play three times.',
            s => s.hand
        ))
    }],
}
buyable(mastermind, 6, 'base')

function chargeVillage(): Replacer<CostParams> {
    return {
        text: `Cards you play cost @ less for each charge token on this.
            Whenever this reduces a cost by one or more @, remove that many charge tokens from this.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play') && card.charge > 0,
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(x.cost.energy, card.charge)
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([discharge(card, reduction)])
            }}
        }
    }
}

function unchargeOnMove(): Replacer<MoveParams> {
    return {
        text: 'Whenever this leaves play, remove all charge tokens from it.',
        kind: 'move',
        handles: (x, state, card) => (x.card.id == card.id &&
            x.fromZone == 'play' && !x.skip),
        replace: (x, state, card) => ({...x, effects:x.effects.concat([uncharge(card)])})
    }
}

const recruitment:CardSpec = {
    name: 'Recruitment',
    relatedCards: [villager, fair],
    effects: [actionsEffect(1), toPlay()],
    triggers: [{
        text: `Whenever you pay @,
               create that many ${villager.name}s and ${fair.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => doAll([villager, fair].map(
            c => repeat(create(c, 'play'), e.cost.energy)
        ))
    }]
}
buyable(recruitment, 3, 'base')

const dragon:CardSpec = {name: 'Dragon',
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              coinsEffect(5), actionsEffect(3), buyEffect()]
}
const hatchery:CardSpec = {name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon],
    effects: [actionsEffect(1), {
        text: [`If this has a charge token, remove it and
                create ${a(dragon.name)} in your discard.
                Otherwise, put a charge token on this.`],
        transform: (state, card) => {
            const c = state.find(card);
            return (c.charge >= 1)
                ? doAll([
                    discharge(c, 1),
                    create(dragon, 'discard')
                ]) : charge(c)
        }
    }]
}
buyable(hatchery, 3, 'base')

const looter:CardSpec = {name: 'Looter',
    effects: [{
        text: [`Discard up to four cards from your hand for +1 action each.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to four cards to discard',
                state.hand.map(asChoice), 4)
            state = await moveMany(targets, 'discard')(state)
            state = await gainActions(targets.length)(state)
            return state
        }
    }]
}
buyable(looter, 4, 'base')

const palace:CardSpec = {name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
}
buyable(palace, 5, 'base')

const Innovation:string = 'Innovation'
const innovation:CardSpec = {name: Innovation,
    effects: [actionsEffect(1), toPlay()],
}
buyable(innovation, 6, 'base', {triggers: [{
    text: `When you create a card in your discard,
    discard an ${innovation.name} from play in order to play it.
    (If you have multiple, discard the oldest.)`,
    kind: 'create',
    handles: e => e.zone == 'discard',
    transform: (e, state, card) => async function(state) {
    	const innovations = state.play.filter(c => c.name == innovation.name);
    	if (innovations.length > 0) {
    		state = await move(innovations[0], 'discard')(state)
    		state = await e.card.play(card)(state)
    	}
    	return state
    }
}]})

const formation:CardSpec = {name: 'Formation',
    effects: [toPlay()],
    replacers: [{
        text: 'Cards you play cost @ less if they share a name with a card in your discard or in play.'
         + ' Whenever this reduces a cost, discard it and +2 actions.',
        kind: 'cost',
        handles: (x, state) => x.actionKind == 'play'
            && state.discard.concat(state.play).some(c => c.name == x.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainActions(2),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
buyable(formation, 4, 'base')

const Traveler = 'Traveler'
const traveler:CardSpec = {
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay an action to play a card in your hand once for each charge token on this.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => async function(state){
                const n = state.find(card).charge
                for (let i = 0; i < n; i++) {
                    state = await target.play(card)(state)
                    state = tick(card)(state)
                }
                return state
            },
            `Choose a card to play with ${Traveler}.`,
            s => s.hand
        ))
    }, chargeUpTo(3)]
}
buyable(
    traveler, 7, 'base',
    {replacers:[startsWithCharge(traveler.name, 1)]}
)

const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [refreshEffect(5, false)],
}
buyable(fountain, 4, 'base')

/*
const chameleon:CardSpec = {
    name:'Chameleon',
    replacers: [{
        text: `As long as this has a charge token on it,
        whenever you would gain $ instead gain that many actions and vice versa.`,
        kind: 'resource',
        handles: (x, state, card) => state.find(card).charge > 0 && x.amount > 0,
        replace: x => ({...x, resource:
            (x.resource == 'coin') ? 'actions' :
            (x.resource == 'actions') ? 'coin' :
            x.resource })
    }],
    effects: [{
        text: [`If this has a charge token on it, remove all charge tokens.
        Otherwise, put a charge token on it.`],
        transform: (state, card) => (state.find(card).charge > 0) ?
            uncharge(card) : charge(card, 1),
    }]
}
registerEvent(chameleon)
const ball:CardSpec = {
    name: 'Ball',
    fixedCost: {...free, energy:1, coin:1},
    effects: [chargeEffect()],
    triggers: [{
        text:`Whenever you buy a card,
              remove a charge token from this to buy a card of equal or lesser cost.`,
        kind:'buy',
        handles: (e, s, c) => s.find(c).charge > 0,
        transform: (e, s, c) => payToDo(
            discharge(c, 1),
            applyToTarget(
                target => target.buy(c),
                'Choose a card to buy.',
                state => state.supply.filter(option =>
                    leq(option.cost('buy', s), e.card.cost('buy', s))
                )
            )
        )
    }]
}
registerEvent(ball)
*/
const lostArts:CardSpec = {
    fixedCost: {...free, energy:1, coin:3},
    name: 'Lost Arts',
    effects: [targetedEffect(
        card => async function(state) {
            state = await addToken(card, 'art', 8)(state)
            for (const c of state.supply) {
                if (c.id != card.id) {
                    state = await removeToken(c, 'art', 'all')(state)
                }
            }
            return state
        },
        `Put eight art tokens on a card in the supply.
        Remove all art tokens from other cards in the supply.`,
        s => s.supply
    )],
    staticReplacers: [{
        text: `Cards you play cost @ less for each art token on their supply.
               Whenever this reduces a cost by one or more @,
               remove that many art tokens.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && nameHasToken(x.card, 'art', state),
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(
                x.cost.energy,
                countNameTokens(x.card, 'art', state)
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([repeat(
                    applyToTarget(
                        target => removeToken(target, 'art'),
                        'Remove an art token from a supply.',
                        state => state.supply.filter(
                            c => c.name == x.card.name && c.count('art') > 0
                        )
                    )
                    , reduction
                )])
            }}
        }
    }]
}
registerEvent(lostArts, 'base')

const grandMarket:CardSpec = {
    name: 'Grand Market',
    /*
    restrictions: [{
        text: `You can't buy this if you have any
        ${copper.name}s in your discard.`,
        test: (c:Card, s:State, k:ActionKind) => k == 'buy' &&
            s.discard.some(x => x.name == copper.name)
    }],
    */
    effects: [coinsEffect(2), actionsEffect(1), buyEffect()],
}
buyable(grandMarket, 5, 'base')

/*
const greatHearth:CardSpec = {
    name: 'Great Hearth',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, +1 action.`,
        kind: 'play',
        handles: e => e.card.name == estate.name,
        transform: (e, state, card) => gainActions(1, card)
    }]
}
buyable(greatHearth, 3)
*/
const Industry = 'Industry'
function industryTransform(n:number, except:string=Industry):Transform{
    return applyToTarget(
        target => target.buy(),
        `Buy a card in the supply costing up to $${n} not named ${except}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n)) && x.name != Industry
        )
    )
}
const industry:CardSpec = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
        text: [`Do this twice: buy a card in the supply costing up to $8 other than ${Industry}.`],
        transform: (state, card) => doAll([
            industryTransform(8, Industry),
            tick(card),
            industryTransform(8, Industry)
        ])
    }]
}
buyable(industry, 6, 'base')

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [actionsEffect(1), toPlay()],
    relatedCards: [villager],
    triggers: [{
        text: `Whenever you play ${a(estate.name)} or ${duchy.name},
               create ${a(villager.name)} in play.`,
        kind: 'play',
        handles: (e, state, card) => e.card.name == estate.name
            || e.card.name == duchy.name,
        transform: (e, state, card) => create(villager, 'play')
    }],
}
buyable(homesteading, 3, 'base')

const duke:CardSpec = {
    name: 'Duke',
    effects: [toPlay()],
    triggers: [{
        text: `Whenever you play ${a(duchy.name)}, +1 vp.`,
        kind: 'play',
        handles: e => e.card.name == duchy.name,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}
buyable(duke, 4, 'base')

const carpenter:CardSpec = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }]
}
buyable(carpenter, 4, 'base')

const artificer:CardSpec = {
    name: 'Artificer',
    effects: [{
        text: [`Discard any number of cards.`,
        `Choose a card in the supply costing $1 per card you discarded,
        and create a copy in your hand.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose any number of cards to discard.',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            const n = targets.length
            let target; [state, target] = await choice(state,
                `Choose a card costing $${n} to gain a copy of.`,
                state.supply.filter(
                    c => c.cost('buy', state).coin == n
                ).map(asChoice))
            if (target != null) {
                state = await create(target.spec, 'hand')(state)
            }
            return state
        }

    }]
}
buyable(artificer, 3, 'base')

const banquet:CardSpec = {
    name: 'Banquet',
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) =>
            k == 'activate' &&
            s.hand.some(c => c.count('neglect') > 0)
    }],
    effects: [coinsEffect(3), toPlay(), {
        text: ['Put a neglect token on each card in your hand.'],
        transform: state => doAll(state.hand.map(c => addToken(c, 'neglect'))),
    }],
    triggers: [{
        text: `Whenever a card moves, remove all neglect tokens from it.`,
        kind: 'move',
        handles: p => p.fromZone != p.toZone,
        transform: p => removeToken(p.card, 'neglect', 'all')

    }],
    replacers: [{
        text: `Whenever you'd move this to your hand, instead leave it in play.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone == 'hand',
        replace: (p, state, card) => ({...p, skip:true})
    }],
    ability:[{
        text: [`If you have no cards in your hand with neglect tokens on them,
        discard this for +$3.`],
        transform: (state, card) => payToDo(discardFromPlay(card), gainCoins(3))
    }]
}
buyable(banquet, 3, 'base')

function countDistinct<T>(xs:T[]): number {
    const distinct:Set<T> = new Set()
    let result:number = 0
    for (const x of xs) {
        if (!distinct.has(x)) {
            result += 1
            distinct.add(x)
        }
    }
    return result
}

function countDistinctNames(xs:Card[]): number {
    return countDistinct(xs.map(c => c.name))
}

const harvest:CardSpec = {
    name:'Harvest',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action for each differently-named card in your hand.`],
        transform: state => async function(state) {
            const n = countDistinctNames(state.hand)
            state = await gainActions(n)(state)
            return state
        }
    },{
        text: [`+$1 for each differently-named card in your discard.`],
        transform: state => async function(state) {
            const n = countDistinctNames(state.discard)
            state = await gainCoins(n)(state)
            return state
        }
    } ]
}
buyable(harvest, 3, 'base')

/*
const horseTraders:CardSpec = {
    name:'Horse Traders',
    fixedCost: energy(1),
    effects: [{
        text: ['If you have any actions, lose 1.'],
        transform: (state, card) => gainActions(-1, card)
    }, gainCoinEffect(4), buyEffect()]
}
buyable(horseTraders, 4)
*/

const secretChamber:CardSpec = {
    name: 'Secret Chamber',
    fixedCost: energy(1),
    effects: [{
        text: [`Discard any number of cards from your hand for +$1 each.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Discard any number of cards for +$1 each.',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            state = await gainCoins(targets.length)(state)
            return state
        }
    }]
}
buyable(secretChamber, 3, 'base')


const hireling:CardSpec = {
    name: 'Hireling',
    relatedCards: [fair],
    effects: [toPlay()],
    replacers: [{
        text: `Whenever you would move this to your hand,
               instead +1 action, +1 buy, +$1, and create a ${fair.name} in play.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play')
        ])})
    }]
}
buyable(hireling, 2, 'base')
/*
const hirelings:CardSpec = {
    name: 'Hirelings',
    effects: [buyEffect(), toPlay()],
    replacers: [{
        text: 'Whenever you would move this to your hand, instead +2 actions and +1 buy.',
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(2, c), gainBuys(1, c)
        ])})
    }]
}
buyable(hirelings, 3)
*/

//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
}
buyable(haggler, 5, 'base', {
    triggers: [{
        text: `After buying a card the normal way,
        buy an additional card for each ${haggler.name} in play.
        Each card you buy this way must cost at least $1 less than the previous one.`,
        kind: 'afterBuy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => async function(state) {
            let lastCard:Card = p.card
            let hagglers:Card[] = state.play.filter(c => c.name == haggler.name)
            while (true) {
                const haggler:Card|undefined = hagglers.shift()
                if (haggler === undefined) {
                    return state
                }
                state = state.startTicker(haggler)
                lastCard = state.find(lastCard)
                let target:Card|null; [state, target] = await choice(state,
                    `Choose a cheaper card than ${lastCard.name} to buy.`,
                     state.supply.filter(c => leq(
                        addCosts(c.cost('buy', state), {coin:1}),
                        lastCard.cost('buy', state)
                    )).map(asChoice)
                )
                if (target !== null) {
                    lastCard = target
                    state = await target.buy(card)(state)
                }
                state = state.endTicker(haggler)
                hagglers = hagglers.filter(c => state.find(c).place=='play')
            }
        }
    }]
})
/*
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        text: `Whenever you buy a card the normal way,
        buy a card in the supply costing at least $1 less.`,
        kind: 'buy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => applyToTarget(
            target => target.buy(card),
            "Choose a cheaper card to buy.",
            s => s.supply.filter(
                c => leq(
                    addCosts(c.cost('buy', s), {coin:1}),
                    p.card.cost('buy', s)
                )
            )
        )
    }]
}
buyable(haggler, 6)
*/

const reuse:CardSpec = {
    name: 'Reuse',
    fixedCost: energy(2),
    effects: [{
        text: [`Repeat any number of times:
                choose a card in your discard without a reuse token
                that was also there at the start of this effect.
                Play it then put a reuse token on it.`],
	        transform: (state, card) => async function(state) {
            const cards:Card[] = state.discard.filter(c => c.count('reuse') == 0)
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'discard'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await addToken(picked, 'reuse')(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
registerEvent(reuse, 'base')

const polish:CardSpec = {
    name: 'Polish',
    fixedCost: {...free, coin:1, energy:1},
    effects: [{
        text: [`Put a polish token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'polish')))
    }],
    staticTriggers: [{
        text: `Whenever you play a card with a polish token on it,
        remove a polish token from it and +$1.`,
        kind: 'play',
        handles: (e, state) => (e.card.count('polish') > 0),
        transform: e => doAll([removeToken(e.card, 'polish'), gainCoins(1)])
    }]
}
registerEvent(polish, 'base')

const mire:CardSpec = {
    name: 'Mire',
    fixedCost: energy(4),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }],
    staticTriggers: [{
        text: `Whenever a card leaves your hand, put a mire token on it.`,
        kind: 'move',
        handles: (e, state) => e.fromZone == 'hand',
        transform: e => addToken(e.card, 'mire'),
    }],
    staticReplacers: [{
        text: `Cards with mire tokens can't move to your hand.`,
        kind: 'move',
        handles: x => (x.toZone == 'hand') && x.card.count('mire') > 0,
        replace: x => ({...x, skip:true})
    }]
}
registerEvent(mire, 'base')

const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: coin(1),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager)],
}
/*
const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay all $.`, `Put a charge token on this for each $ paid.`],
        transform: (state, card) => async function(state) {
            const n = state.coin
            state = await payCost({...free, coin:n})(state)
            state = await charge(card, n)(state)
            return state
        }
    }],
    staticReplacers: [chargeVillage()]
}
*/
registerEvent(commerce, 'base')

function reverbEffect(card:Card): Transform {
    return create(card.spec, 'play', c => addToken(c, 'echo'))
}

const reverberate:CardSpec = {
    name: 'Reverberate',
    fixedCost: {...free, energy:1, coin:1},
    effects: [{
        text: [`For each card in play without an echo token,
            create a copy in play with an echo token.`],
        transform: state => doAll(
            state.play.filter(c => c.count('echo') == 0).map(reverbEffect)
        )
    }],
    staticTriggers: [fragileEcho('echo')]
}
registerEvent(reverberate, 'base')

/*
const preparations:CardSpec = {
    name: 'Preparations',
    fixedCost: energy(1),
    effects: [toPlay()],
    replacers: [{
        text: `When you would move this to your hand,
            instead move it to your discard and gain +1 buy, +$2, and +3 actions.`,
        kind: 'move',
        handles: (p, state, card) => (p.card.id == card.id && p.toZone == 'hand'),
        replace: p => ({...p,
            toZone:'discard',
            effects:p.effects.concat([gainBuys(1), gainCoin(2), gainActions(3)])
        })
    }]
}
buyable(preparations, 3)
*/

const turnpike:CardSpec = {
    name: 'Turnpike',
    fixedCost: energy(2),
    effects: [toPlay()],
    triggers: [{
        kind:'play',
        text: `Whenever you play a card, put a charge token on this.
        If it has two charge tokens, remove them for +1vp.`,
        handles: () => true,
        transform: (e, state, card) => doAll([
            charge(card, 1),
            payToDo(discharge(card, 2), gainPoints(1))
        ])
    }]
}
buyable(turnpike, 5, 'base')

const highway:CardSpec = {
    name: 'Highway',
    effects: [actionsEffect(1), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)],
}
buyable(highway, 6, 'base', {replacers: [{
    text: `Whenever you would create a ${highway.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == highway.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]})

function sum<T>(xs:T[], f:(x:T) => number): number {
    return xs.map(f).reduce((a, b) => a+b)
}

function countNameTokens(card:Card, token:Token, state:State): number {
    return sum(
        state.supply,
        c => (c.name == card.name) ? c.count(token) : 0
    )
}

function nameHasToken(card:Card, token:Token, state:State): boolean {
    return state.supply.some(s => s.name == card.name && s.count(token) > 0)
}

const prioritize:CardSpec = {
    name: 'Prioritize',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        card => addToken(card, 'priority', 6),
        'Put six priority tokens on a card in the supply.',
        state => state.supply,
    )],
    staticTriggers: [{
        text: `Whenever you create a card whose supply
            has a priority token,
            remove a priority token to play the card.`,
        kind: 'create',
        handles: (e, state) => nameHasToken(e.card, 'priority', state),
        transform: (e, state, card) => payToDo(applyToTarget(
                target => removeToken(target, 'priority', 1, true),
                'Remove a priority token.',
                s => s.supply.filter(target => target.name == e.card.name),
                {cost:true},
            ), e.card.play(card))
    }]
}
registerEvent(prioritize, 'base')

const composting:CardSpec = {
    name: 'Composting',
    effects: [actionsEffect(1), toPlay()],
    triggers: [{
        kind: 'cost',
        text: `Whenever you pay @,
        you may put a card from your discard into your hand.`,
        handles: e => e.cost.energy > 0,
        transform: e => async function(state) {
            const n = e.cost.energy;
            let targets:Card[]; [state, targets] = await multichoice(state,
                `Choose up to ${num(n, 'card')} to put into your hand.`,
                state.discard.map(asChoice), n)
            return moveMany(targets, 'hand')(state)
        }
    }]
}
buyable(composting, 3, 'base')

const FairyGold = 'Fairy Gold'
const fairyGold:CardSpec = {
    name: FairyGold,
    effects: [buyEffect(), {
        text: [`+$1 per charge token on this.`],
        transform: (state, card) => gainCoins(state.find(card).charge),
    }, {
        text: [`Remove a charge token from this. If you can't, trash it.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            } else {
                state = await trash(card)(state)
            }
            return state
        }

    }],
}
buyable(fairyGold, 3, 'base', {
    replacers: [startsWithCharge(fairyGold.name, 3)]
})

const pathfinding:CardSpec = {
    name: 'Pathfinding',
    fixedCost: {...free, coin:7, energy:1},
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(
        target => addToken(target, 'pathfinding'),
        `Put a pathfinding token on a card in the supply other than Copper.`,
        state => state.supply.filter(target => target.name != copper.name)
    )],
    staticTriggers: [{
        kind: 'play',
        text: `Whenever you play a card whose supply
        has a  pathfinding token on it, +1 action.`,
        handles: (e, state) => nameHasToken(e.card, 'pathfinding', state),
        transform: (e, state, card) => gainActions(1, card)
    }]
}
registerEvent(pathfinding, 'base')

const fortune:CardSpec = {
    name: 'Fortune',
    effects: [{
        text: [`Double your $.`],
        transform: (state, card) => gainCoins(state.coin)
    }, {
        text: [`Double your buys.`],
        transform: (state, card) => gainBuys(state.buys)
    }]
}
buyable(fortune, 12, 'base', {afterBuy: [{text: ['trash it from the supply.'], transform: (s, c) => trash(c)}]})


// ------------------- Expansion ---------------

const flourish:CardSpec = {
    name: 'Flourish',
    fixedCost: energy(1),
    effects: [{
        text: [`Double the number of cost tokens on this, then add one.`],
        transform: (s, c) => async function(state) {
            return addToken(c, 'cost', state.find(c).count('cost') + 1)(state)
        }
    }, refreshEffect(5)],
    restrictions: [{
        text: 'You must have at least 1 vp per cost token on this.',
        test: (c, s, k) => s.points < s.find(c).count('cost')
    }]
}
registerEvent(flourish, 'expansion')

const greed:CardSpec = {
    name: 'Greed',
    fixedCost: energy(1),
    effects: [{
        text: [`Lose all vp. For each lost, +$2, +1 action and +1 buy.`],
        transform: () => async function(state) {
            const n = state.points
            state = await gainPoints(-n)(state)
            state = await gainCoins(2*n)(state)
            state = await gainActions(n)(state)
            state = await gainBuys(n)(state)
            return state
        }
    }]
}
registerEvent(greed, 'expansion')

const strive:CardSpec = {
    name: 'Strive',
    fixedCost: {...free, energy:2, coin:3},
    effects: [workshopEffect(7)]
}
registerEvent(strive, 'expansion')

const delve:CardSpec = {
    name: 'Delve',
    fixedCost: coin(2),
    effects: [createEffect(silver)]
}
registerEvent(delve, 'expansion')

const hesitation:CardSpec = {
    name: 'Hesitation',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
    staticReplacers: [{
        text: `Cards cost an extra @ to play or use.`,
        kind: 'cost',
        handles: (p, s, c) => (p.actionKind == 'play' || p.actionKind == 'use')
            && p.card.id != c.id,
        replace: p => ({...p, cost: {...p.cost, energy:p.cost.energy + 1}})
    }]
}
//registerEvent(hesitation, 'expansion')

/*
const pillage:CardSpec = {
    name: 'Pillage',
    effects: [targetedEffect(
        (target, card) => addToken(target, 'pillage'),
        'Put a pillage token on a card in the supply.',
        s => s.supply
    )],
    staticTriggers: [{
        text: `Whenever you create a card whose supply has a pillage token on it,
        trash the supply to play the card.`,
        kind: 'create',
        handles: (e, s) => s.supply.some(
            sup => sup.count('pillage') > 0 &&
            sup.name == e.card.name
        ),
        transform: (e, s, c) => payToDo(
            applyToTarget(
                target => trash(target),
                'Choose a supply to trash.',
                state => state.supply.filter(sup => sup.name == e.card.name),
                {cost: true}
            ), e.card.play(c)
        )
    }]
}
registerEvent(pillage, 'expansion')
*/

const festival:CardSpec = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 3)],
    relatedCards: [fair]
}
registerEvent(festival, 'expansion')

/*
const Import:CardSpec = {
    name: 'Import',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => addToken(target, 'import', 3),
        'Put three import tokens on a card in the supply.',
        s => s.supply
    )],
    staticReplacers: [{
        text: `Whenever you would create a card in your discard,
            if its supply has an import token on it,
            instead remove a token and create the card in your hand.`,
        kind: 'create',
        handles: (p, s, c) => p.zone == 'discard' && s.supply.some(
            sup => sup.count('import') > 0 &&
            sup.name == p.spec.name
        ),
        replace: p => ({...p, zone:'hand', effects:p.effects.concat([
            () => applyToTarget(
                target => removeToken(target, 'import'),
                `remove an import token.`,
                state => state.supply.filter(sup => sup.name == p.spec.name && sup.count('import') > 0)
            )
        ])})
    }]
}
registerEvent(Import, 'expansion')
*/

const squeeze:CardSpec = {
    name: 'Squeeze',
    fixedCost: energy(1),
    effects: [actionsEffect(1)],
    staticReplacers: [{
        text: `If you have 0 actions, you can't gain actions other than with this.`,
        kind: 'resource',
        handles: (p, s, c) => p.resource == 'actions' && s.actions == 0 && p.source.name != c.name,
        replace: p => ({...p, amount:0}),
    }]
}
registerEvent(squeeze, 'expansion')

const inspiration:CardSpec = {
    name: 'Inspiration',
    effects: [{
        text: ['Remove a charge token from this to double your actions and buys.'],
        transform: (s, c) => payToDo(discharge(c, 1), async function(state) {
            state = await gainActions(state.actions)(state)
            state = await gainBuys(state.buys)(state)
            return state
        })
    }],
    staticTriggers: [{
        text: 'At the start of the game, put 3 charge tokens on this.',
        kind: 'gameStart',
        handles: ()=>true,
        transform: (e, s, c) => charge(c, 3),
    }],
    restrictions: [{
        test: (c, state, kind) => c.charge == 0 && kind == 'use'
    }]

}
registerEvent(inspiration, 'expansion')

/*
const chain:CardSpec = {
    name: 'Chain',
    fixedCost: {...free, energy:1, coin:1},
    effects: [targetedEffect(
        target => addToken(target, 'chain'),
        `Put a chain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterPlay',
        text: `After playing a card whose supply has a chain token,
               you may play a card that costs at least $1 less whose supply also has a chain token.`,
        handles: (e, s) => nameHasToken(e.card, 'chain', s),
        transform: (e, s, c) => applyToTarget(
            target => target.play(c),
            'Choose a card to play.',
            state => state.hand.filter(
                handCard => state.supply.some(
                    supplyCard => (supplyCard.name == handCard.name) && supplyCard.count('chain') > 0
                ) && leq(addCosts(handCard.cost('buy', state), coin(1)), e.card.cost('buy', state))
            ), {optional: "Don't play"}
        )
    }]
}
registerEvent(chain, 'expansion')
*/

function buyCheaper(card:Card, s:State, source:Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        'Choose a card to buy.',
        state => state.supply.filter(target => leq(
            addCosts(target.cost('buy', state), coin(1)),
            card.cost('buy', state))
        )
    )
}

const bargain:CardSpec = {
    name: 'Bargain',
    fixedCost: {...free, energy:1, coin:4},
    effects: [targetedEffect(
        target => addToken(target, 'bargain'),
        `Put a bargain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card with a bargain token,
               buy a card in the supply that costs at least $1 less.`,
        handles: (e, s) => e.card.count('bargain') > 0,
        transform: (e, s, c) => buyCheaper(e.card, s, c)
    }]
}
registerEvent(bargain, 'expansion')

const haggle:CardSpec = {
    name: 'Haggle',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card, remove a charge token from this to buy a card
        in the supply that costs at least $1 less.`,
        handles: (e, s, c) => c.charge > 0,
        transform: (e, s, c) => payToDo(discharge(c, 1), buyCheaper(e.card, s, c)),
    }]
}
registerEvent(haggle, 'expansion')

const horse:CardSpec = {
    name: 'Horse',
    effects: [actionsEffect(2), trashThis()]
}

const ride:CardSpec = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards:[horse],
    effects: [createEffect(horse)]
}
registerEvent(ride, 'expansion')

const ambition:CardSpec = {
    name:'Ambition',
    fixedCost: energy(1),
    effects: [chargeEffect(1), targetedEffect(
        target => create(target.spec, 'hand'),
        'Choose a card in your discard. Create a copy in your hand.',
        state => state.discard,
    )],
    staticReplacers: [{
        kind: 'victory',
        text: "For each charge token on this you need an additional 10 vp to win the game.",
        handles: (p, s, c) => s.points < s.vp_goal + 10 * c.charge,
        replace: p => ({kind: 'victory', victory: false})
    }]
}
registerEvent(ambition, 'expansion')

const splay:CardSpec = {
    name:'Splay',
    fixedCost: energy(2),
    effects: [{
        text: [`Put a splay token on each supply.`],
        transform: s => doAll(s.supply.map(c => addToken(c, 'splay')))
    }],
    staticReplacers: [{
        text: `Cards you play cost @ less for each splay token on their supply.
               Whenever this reduces a card's cost by one or more @,
               remove that many splay tokens from it.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && nameHasToken(x.card, 'splay', state),
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(
                x.cost.energy,
                countNameTokens(x.card, 'splay', state)
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([repeat(
                    applyToTarget(
                        target => removeToken(target, 'splay'),
                        'Remove a fan token from a supply.',
                        state => state.supply.filter(
                            c => c.name == x.card.name && c.count('splay') > 0
                        )
                    )
                    , reduction
                )])
            }}
        }
    }]
}
registerEvent(splay, 'expansion')

const recover:CardSpec = {
    name: 'Recover',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(
        targets => moveMany(targets, 'hand'),
        'Put up to 2 cards from your discard into your hand.',
        state => state.discard,
        2
    ), incrementCost()]
}
registerEvent(recover, 'expansion')

function multitargetedEffect(
    f: (targets:Card[], c:Card) => Transform,
    text: string,
    options: (s:State, c:Card) => Card[],
    max: number|null = null
): Effect {
    return {
        text: [text],
        transform: (s, c) => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(
                state, text, options(state, c).map(asChoice), max
            )
            state = await f(cards, c)(state)
            return state
        }
    }
}

const regroup:CardSpec = {
    name: 'Regroup',
    fixedCost: energy(2),
    effects: [actionsEffect(2), buysEffect(1), multitargetedEffect(
        targets => moveMany(targets, 'hand'),
        'Put up to four cards from your discard into your hand.',
        state => state.discard, 4
    )]
}
registerEvent(regroup, 'expansion')

/*
const multitask:CardSpec = {
    name: 'Multitask',
    fixedCost: {...free, energy:3, coin:6},
    effects: [multitargetedEffect(
        (cards, c) => doAll(cards.map(card => card.use(c))),
        'Use any number of other events.',
        (state, c) => state.events.filter(card => card.id != c.id)
    )]
}
registerEvent(multitask, 'expansion')
*/
const summon:CardSpec = {
    name: 'Summon',
    fixedCost: {...free, energy:1, coin:5},
    effects: [multitargetedEffect(
        (targets, card) => doAll(targets.map(target =>
            create(target.spec, 'hand', c => addToken(c, 'echo'))
        )),
        `Choose up to three cards in the supply. Create a copy of each in your hand with an echo token.`,
        s => s.supply, 3
    )],
    staticTriggers: [fragileEcho('echo')]
}
registerEvent(summon, 'expansion')

/*
const misfitName:string = 'Misfit'
const misfit:CardSpec = {
    name: misfitName,
    buyCost: coin(1),
    effects: [actionsEffect(1), {
        text: [`Choose a card in the supply costing up to $1
        for each charge token on this.
        Create a copy of that card in your hand with an echo token on it.`],
        transform: (s, c) => applyToTarget(
            target => create(target.spec, 'hand', n => addToken(n, 'echo')),
            'Choose a card to copy.',
            state => state.supply.filter(target =>
                leq(target.cost('buy', state), coin(c.charge))
            )
        )
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${misfitName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == misfitName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
register(misfit, 'expansion')
*/

/*
const bandOfMisfitsName = 'Band of Misfits'
const bandOfMisfits:CardSpec = {
    name: bandOfMisfitsName,
    buyCost: coin(2),
    effects: [actionsEffect(1), {
        text: [`Choose up to two cards in the supply each costing up to $1
        per charge token on this.
        Create a copy of each card in your hand with an echo token on it.`],
        transform: (s, c) => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Choose up to two cards to copy.',
                state.supply.filter(
                    target => leq(target.cost('buy', state), coin(c.charge))
                ).map(asChoice),
                2
            )
            for (const target of cards) {
                state = await create(target.spec, 'hand', n => addToken(n, 'echo'))(state)
            }
            return state
        }
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${bandOfMisfitsName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == bandOfMisfitsName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
register(bandOfMisfits, 'expansion')
*/

function magpieEffect(): Effect {
    return {
        text: [`Create a copy of this in your discard.`],
        transform: (s, c) => create(c.spec)
    }
}

const magpie:CardSpec = {
    name: 'Magpie',
    buyCost: coin(2),
    effects: [coinsEffect(1), magpieEffect()]
}
register(magpie, 'expansion')

const crown:CardSpec = {
    name: 'Crown',
    buyCost: coin(4),
    effects: [targetedEffect(
        target => addToken(target, 'crown'),
        'Put a crown token on a card in your hand.',
        s => s.hand
    )],
    staticTriggers: [reflectTrigger('crown')],
}
register(crown, 'expansion')

const remake:CardSpec = {
    name: 'Remake',
    fixedCost: {...free, coin:3, energy:1},
    effects: [{
        text: [`Do this up to six times: trash a card in your hand,
        then buy a card costing up to $2 more.`],
        transform: (s, c) => async function(state) {
            const N = 6;
            for (let i = N-1; i >= 0; i--) {
                let card:Card|null; [state, card] = await choice(state,
                    `Choose a card to remake (${i} remaining).`,
                    allowNull(state.hand.map(asChoice))
                )
                if (card == null) {
                    break
                } else {
                    state = await trash(card)(state)
                    const cost = addCosts(card.cost('buy', state), coin(2))
                    let target:Card|null; [state, target] = await choice(state,
                        `Choose a card to buy (${i} remaining).`,
                        state.supply.filter(t => leq(t.cost('buy', state), cost)).map(asChoice)
                    )
                    if (target != null) state = await target.buy(c)(state)
                }
            }
            return state
        }
    }]
}
registerEvent(remake, 'expansion')

/*
const remake:CardSpec = {
    name: 'Remake',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: [`Do this up to eight times: trash a card in your hand,
        then buy a card costing up to $2 more.`],
        transform: (s, c) => async function(state) {
            const N = 8;
            for (let i = N-1; i >= 0; i--) {
                let card:Card|null; [state, card] = await choice(state,
                    `Choose a card to remake (${i} remaining).`,
                    allowNull(state.hand.map(asChoice))
                )
                if (card == null) {
                    break
                } else {
                    state = await trash(card)(state)
                    const cost = addCosts(card.cost('buy', state), coin(2))
                    let target:Card|null; [state, target] = await choice(state,
                        `Choose a card to buy (${i} remaining).`,
                        state.supply.filter(t => leq(t.cost('buy', state), cost)).map(asChoice)
                    )
                    if (target != null) state = await target.buy(c)(state)
                }
            }
            return state
        }
    }]
}
register(remake, 'expansion')
*/

const ferry:CardSpec = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(
        target => addToken(target, 'ferry'),
        'Put a ferry token on a supply.',
        state => state.supply,
    )],
    staticReplacers: [{
        text: `Cards cost $1 less to buy per ferry token on them, but not zero.`,
        kind: 'cost',
        handles: p => p.actionKind == 'buy',
        replace: p => ({...p, cost: reducedCost(p.cost, coin(p.card.count('ferry')), true)})
    }]
}
register(ferry, 'expansion')

const develop:CardSpec = {
    name: 'Develop',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
        text: [`Trash a card in your hand.`,
        `Choose a card in the supply costing $1 or $2 less and create a copy in your hand.`,
        `Choose a card in the supply costing $1 or $2 more and create a copy in your hand.`],
        transform: (_, c) => async function(state) {
            state = await applyToTarget(
                target => async function(state) {
                    state = await trash(target)(state)
                    const cost = target.cost('buy', state)
                    state = await applyToTarget(
                        target2 => create(target2.spec, 'hand'),
                        'Choose a more expensive card to copy.',
                        s => s.supply.filter(c => eq(
                            c.cost('buy', s),
                            addCosts(target.cost('buy', s), {coin:1})
                        ) || eq(
                            c.cost('buy', s),
                            addCosts(target.cost('buy', s), {coin:2})
                        ))
                    )(state)
                    state = await applyToTarget(
                        target2 => create(target2.spec, 'hand'),
                        'Choose a cheaper card to copy.',
                        s => s.supply.filter(c => eq(
                            target.cost('buy', s),
                            addCosts(c.cost('buy', s), {coin:1})
                        ) || eq(
                            target.cost('buy', s),
                            addCosts(c.cost('buy', s), {coin:2})
                        ))
                    )(state)
                    return state
                }, 'Choose a card to develop.',
                s => s.hand,
            )(state)
            return state
        }
    }]
}
register(develop, 'expansion')

const logistics = {
    name: 'Logistics',
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [toPlay()],
    replacers: [costReduce('use', energy(1), true)]
}
register(logistics, 'expansion')

const territory:CardSpec = {
    name: 'Territory',
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2), {
        text: ['Put this in your hand.'],
        transform: (s, c) => move(c, 'hand')
    }]
}
register(territory, 'expansion')

const resound:CardSpec = {
    name: 'Resound',
    fixedCost: energy(1),
    effects: [{
        text: [`Put each card in your discard into your hand with an echo token on it.`],
        transform: (state) => doAll(state.discard.map(
            c => doAll([move(c, 'hand'), addToken(c, 'echo')])
        ))
    }],
    staticTriggers: [fragileEcho('echo')]
}
registerEvent(resound, 'expansion')
/*
const fossilize:CardSpec = {
    name: 'Fossilize',
    buyCost: coin(3),
    effects: [{
        text: [`Put any number of cards from your discard into your hand.`,
         `Put a fragile token on each of them.`],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Put any number of cards from your discard into your hand.',
                state.discard.map(asChoice)
            )
            state = await moveMany(cards, 'hand')(state)
            for (const card of cards) {
                state = await addToken(card, 'fragile')(state)
            }
            return state
        }
    }],
    staticTriggers: [fragileEcho('fragile')]
}
register(fossilize, 'expansion')
*/

const harrowName = 'Harrow'
const harrow:CardSpec = {
    name: harrowName,
    buyCost: coin(3),
    effects: [{
        text: [`Discard your hand, then put that many cards from your discard into your hand.`],
        transform: () => async function(state) {
            const cards:Card[] = state.hand
            const n = cards.length
            state = await moveMany(cards, 'discard')(state)
            let targets; [state, targets] = await multichoice(state,
                `Choose up to ${n} cards to put into your hand.`,
                state.discard.map(asChoice),
                n)
            state = await moveMany(targets, 'hand')(state)
            return state
        }
    }]
}
register(harrow, 'expansion')

const churnName = "Churn"
const churn:CardSpec = {
    name: churnName,
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    replacers: [{
        text: `Cards named ${churnName} cost an additional @ to play.`,
        kind: 'costIncrease',
        handles: p => (p.card.name == churnName) && (p.actionKind == 'play'),
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
register(churn, 'expansion')

const smithy:CardSpec = {
    name: 'Smithy',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [actionsEffect(3), buysEffect(1)],
}
register(smithy, 'expansion')

const marketSquare:CardSpec = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
}
buyable(marketSquare, 2, 'expansion', {afterBuy: [createInPlayEffect(fair, 2)]})

/*
const brigade:CardSpec = {name: 'Brigade',
    effects: [toPlay()],
    replacers: [{
        text: `Cards you play cost @ less if they share a name
               with a card in your discard and another card in your hand.
               Whenever this reduces a cost, discard it for +$2 and +2 actions.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && state.hand.some(
            c => c.name == x.card.name && c.id != x.card.id
        ) && state.discard.some(c => c.name == x.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoins(2),
                    gainActions(2),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
buyable(brigade, 4, 'expansion')
*/

const brigade:CardSpec = {name: 'Brigade',
    effects: [toPlay()],
    replacers: [{
        text: `Cards you play cost @ less if they have no brigade token on them.
               Whenever this reduces a card's cost, put a brigade token on it,
               discard this, and get +$1 and +1 action.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && x.card.count('brigade') == 0),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    addToken(x.card, 'brigade'),
                    move(card, 'discard'),
                    gainCoins(1),
                    gainActions(1),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
buyable(brigade, 4, 'expansion')

const recruiter:CardSpec = {
    name: 'Recruiter',
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
}
buyable(recruiter, 3, 'expansion')

const silversmith:CardSpec = {
    name: 'Silversmith',
    buyCost: coin(3),
    effects: [toPlay()],
    triggers: [{
        kind: 'play',
        text: `When you play a Silver, +1 action.`,
        handles: e => e.card.name == silver.name,
        transform: e => gainActions(1),
    }]
}
register(silversmith, 'expansion')

const exoticMarket:CardSpec = {
    name: 'Exotic Market',
    buyCost: coin(5),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
}
register(exoticMarket, 'expansion')

const royalChambers:CardSpec = {
    name: 'Royal Chambers',
    buyCost: coin(7),
    fixedCost: energy(2),
    effects: [{
        text: [`Do this twice: pay an action to play a card in your hand twice.`],
        transform: (s, card) => async function(state) {
            for (let i = 0; i < 2; i++) {
                state = await payToDo(payAction, applyToTarget(
                    target => doAll([
                        target.play(card),
                        target.play(card),
                    ]), 'Choose a card to play twice.', s => s.hand, {optional: 'None'}
                ))(state)
                state = tick(card)(state)
            }
            return state
        }
    }]
}
register(royalChambers, 'expansion')

const sculpt:CardSpec = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [targetedEffect(
        target => doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]),
        'Discard a card in your hand to create two copies of it in your discard.',
        state => state.hand
    )]
}
register(sculpt, 'expansion')

const masterpiece:CardSpec = {
    name: 'Masterpiece',
    buyCost:coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(6)]
}
register(masterpiece, 'expansion')

function workshopTransform(n:number, source:Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        `Buy a card in the supply costing up to $${n}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n))
        )
    )
}

const greatFeast:CardSpec = {
    name: 'Great Feast',
    buyCost: coin(9),
    effects: [{
        text: [`Do this three times: buy a card in the supply costing up to $8`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await workshopTransform(8, card)(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
register(greatFeast, 'expansion')

/*
const scaffold:CardSpec = {
    name: 'Scaffold',
    buyCost: coin(5),
    effects: [{
        text: [`Do this two times: buy a card in the supply costing up to $4.`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 2; i++) {
                state = await applyToTarget(
                    target => create(target.spec, 'hand'),
                    'Choose a card to copy.',
                    state => state.supply.filter(target => leq(target.cost('buy', state),coin(5)))
                )(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
register(scaffold, 'expansion')
*/

const universityName = 'University'
const university:CardSpec = {
    name: universityName,
    buyCost: coin(12),
    effects: [actionsEffect(4), buysEffect(1)],
    staticReplacers: [{
        text: `${universityName} costs $1 less to buy for each action you have, but not zero.`,
        kind: 'cost',
        handles: p => (p.card.name == universityName) && p.actionKind == 'buy',
        replace: (p, s) => ({...p, cost: reducedCost(p.cost, coin(s.actions), true)})
    }]
}
register(university, 'expansion')

const steelName = 'Steel'
const steel:CardSpec = {
    name: steelName,
    buyCost: coin(3),
    effects: [coinsEffect(4)],
    staticReplacers: [{
        text: `Whenever you would create a ${steelName}, first pay a buy.
            If you can't, then don't create it.` ,
        kind: 'create',
        handles: p => p.spec.name == steelName,
        replace: (p, s) => (s.buys == 0)
            ? {...p, zone:null}
            : {...p, effects: [(c:Card) => payCost({...free, buys: 1})].concat(p.effects)}
    }]
}
register(steel, 'expansion')

const silverMine:CardSpec = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
}
register(silverMine, 'expansion')

const livery:CardSpec = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        kind: 'afterBuy',
        text: `After buying a card costing $4 or more, create ${aOrNum(2, horse.name)} in your discard.`,
        handles: (e,s) => e.card.cost('buy', s).coin >= 1,
        transform: () => repeat(create(horse, 'discard'), 2)
    }]
}
register(livery, 'expansion')

const stables:CardSpec = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [createEffect(horse, 'discard', 2)]
}
buyable(stables, 3, 'expansion', {onBuy: [{
    text: [`Pay all actions to create that many ${horse.name}s in your discard.`],
    transform: () => async function(state) {
        const n = state.actions
        state = await payCost({...free, actions:n})(state)
        state = await repeat(create(horse), n)(state)
        return state
    }
}]})

const bustlingVillage:CardSpec = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [{
        text: [`+1 action per ${villager.name} in play up to a max of +3.`],
        transform: s => gainActions(Math.min(3, s.play.filter(c => c.name == villager.name).length)),
    }, createInPlayEffect(villager)]
}
register(bustlingVillage, 'expansion')

/*
const inn:CardSpec = {
    name: 'Inn',
    buyCost: coin(6),
    relatedCards: [horse, villager],
    effects: [createEffect(horse, 'discard', 2), createInPlayEffect(villager, 2)],
}
register(inn, 'expansion')
*/

const guildHall:CardSpec = {
    name: 'Guild Hall',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        text: `Whenever you use an event,
            discard this to use it again.`,
        kind: 'use',
        handles: (e, state, card) => state.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.use(card)(state)
        }
    }]
}
register(guildHall, 'expansion')
/*
const overextend:CardSpec = {
    name: 'Overextend',
    buyCost: coin(4),
    effects: [actionsEffect(4), createInPlayEffect(villager, 4), toPlay()],
    relatedCards: [villager],
    replacers: [{
        text: `Cards cost @ more to play.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'play',
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
register(overextend, 'expansion')
*/

const contraband:CardSpec = {
    name: 'Contraband',
    buyCost: coin(4),
    effects: [coinsEffect(3), buysEffect(3), toPlay()],
    replacers: [{
        text: `Cards cost $1 more to buy.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'buy',
        replace: p => ({...p, cost: addCosts(p.cost, coin(1))})
    }]
}
register(contraband, 'expansion')
/*
const diamond:CardSpec = {
    name: 'Diamond',
    buyCost: coin(4),
    effects: [coinsEffect(2), pointsEffect(1)],
}
register(diamond, 'expansion')
*/

const lurkerName = 'Lurker'
const lurker:CardSpec = {
    name: lurkerName,
    buyCost: coin(3),
    effects: [actionsEffect(1), {
        text: [`Trash a card in your hand.
               If you trash a ${lurkerName}, buy a card in the supply costing up to $8,
               otherwise buy a ${lurkerName}.`],
        transform: (s, c) => async function(state) {
            let card:Card|null; [state, card] = await choice(state,
                'Choose a card to trash.',
                state.hand.map(asChoice))
            if (card != null) state = await trash(card)(state)
            if (card !== null && card.name == lurkerName) {
                state = await workshopTransform(8, c)(state)
            } else {
                state = await applyToTarget(
                    target => target.buy(c),
                    'Choose a card to buy.',
                    state => state.supply.filter(sup => sup.name == lurkerName)
                )(state)
            }
            return state
        }
    }]
}
register(lurker, 'expansion')

const kiln:CardSpec = {
    name: 'Kiln',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        text: `After playing a card with this in play, discard this to create a copy of the card you played in your discard.`,
        kind: 'afterPlay',
        handles: (e, s, c) => s.find(c).place == 'play' && e.before.find(c).place == 'play',
        transform: (e, s, c) => doAll([move(c, 'discard'), create(e.card.spec, 'discard')])
    }]
}
register(kiln, 'expansion')

/*
const werewolfName = 'Werewolf'
const werewolf:CardSpec = {
    name: 'Werewolf',
    buyCost: coin(3),
    effects: [{
        text: [`If a ${werewolfName} in the supply has an odd number of charge tokens on it, +3 actions.
        Otherwise, +$3.`],
        transform: () => async function(state) {
            if (state.supply.some(sup => (sup.name == werewolfName) && (sup.charge % 2 == 1) )) {
                state = await gainActions(3)(state)
            } else {
                state = await gainCoins(3)(state)
            }
            return state
        }
    }],
    staticTriggers: [{
        text: `Whenever you use ${refresh.name}, put a charge token on this.`,
        kind: 'use',
        handles: e => e.card.name == refresh.name,
        transform: (e, s, c) => charge(c)
    }]
}
register(werewolf, 'expansion')
*/

const moon:CardSpec = {
    name: 'Moon',
    replacers: [{
        text: `Whenever you would move this from play,
               instead put a charge token on it.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([charge(c)])})
    }]
}

const werewolf:CardSpec = {
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
        text: [`If there is no ${moon.name} in play, create one.`],
        transform: s => (s.play.some(c => c.name == moon.name)) ? noop : create(moon, 'play'),
    }, {
        text: [`If a ${moon.name} in play has an odd number of charge tokens, +$3 and +1 buy.
                Otherwise, +3 actions.`],
        transform: s => (s.play.some(c => c.name == moon.name && c.charge % 2 == 1)) ?
            doAll([gainCoins(3), gainBuys(1)]) :
            gainActions(3)
    }]
}
register(werewolf, 'expansion')

const uncoverName = 'Uncover'
const uncover:CardSpec = {
    name: uncoverName,
    effects: [actionsEffect(1), {
        text: [`For each charge token on this put a non-${uncoverName} card from your discard into your hand.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            let cards:Card[]; [state, cards] = await multichoice(state,
                `Choose ${n} cards to put into your hand.`,
                state.discard.filter(c => c.name != uncoverName).map(asChoice), n
            )
            state = await moveMany(cards, 'hand')(state)
            return state
        }
    }, {
        text: [`Remove a charge token from this.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            }
            return state
        }
    }]
}
buyable(uncover, 4, 'expansion', {
    replacers: [startsWithCharge(uncover.name, 3)]
})

const masonry:CardSpec = {
    name: 'Masonry',
    fixedCost: coin(2),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card other than with this, remove a charge token from this to buy a card
        in the supply with equal or lesser cost.`,
        handles: (e, s, c) => c.charge > 0 && e.source.id != c.id,
        transform: (e, s, c) => payToDo(discharge(c, 1), applyToTarget(
            target => target.buy(c),
            `Choose a card to buy.`,
            state => state.supply.filter(sup => leq(sup.cost('buy', state), e.card.cost('buy', state)))
        ))
    }]
}
registerEvent(masonry, 'expansion')

const swap:CardSpec = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterPlay',
        text: `After playing a card, if this has a charge token and the card is in your discard,
        then remove a charge token and trash the card to buy a card in the supply
        with equal or lesser cost.`,
        handles: (e, s, c) => (c.charge > 0 && s.find(e.card).place == 'discard'),
        transform: (e, s, c) => payToDo(doAll([discharge(c, 1), trash(e.card)]), applyToTarget(
            target => doAll([trash(e.card), target.buy(c)]),
            `Choose a card to buy.`,
            state => state.supply.filter(sup => leq(sup.cost('buy', state), e.card.cost('buy', state)))
        ))
    }]
}
registerEvent(swap, 'expansion')

const infrastructure:CardSpec = {
    name: 'Infrastructure',
    replacers: [{
        text: `Events cost @ less to use. Whenever this reduces a cost, trash it.`,
        kind: 'cost',
        handles: x => x.actionKind == 'use',
        replace: function(x:CostParams, state:State, card:Card) {
            if (x.cost.energy > 0) {
                return {...x, cost: {...x.cost,
                    energy:x.cost.energy - 1,
                    effects:x.cost.effects.concat([trash(card)])
                }}
            } else {
                return x
            }
        }
    }, trashOnLeavePlay()]
}

const planning:CardSpec = {
    name: 'Planning',
    buyCost: coin(6),
    effects: [toPlay()],
    relatedCards: [infrastructure],
    triggers: [{
        text: `Whenever you pay @,
               create that many ${infrastructure.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => repeat(create(infrastructure, 'play'), e.cost.energy)
    }]
}
register(planning, 'expansion')

const privateWorks:CardSpec = {
    name: 'Private Works',
    relatedCards: [infrastructure],
    fixedCost: {...free, coin:4, energy:1},
    effects: [createInPlayEffect(infrastructure, 2)]
}
registerEvent(privateWorks, 'expansion')

function gainExactly(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing $${n}.`,
        state => state.supply.filter(
            x => eq(x.cost('buy', state), coin(n))
        )
    )
}

        /* Swell:
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 6; i++) {
                let target:Card|null; [state, target] = await choice(state,
                    `Buy a card costing $${i}`,
                    state.supply.filter(c => c.cost('buy', state).coin == i).map(asChoice)
                )
                if (target != null) state = await target.buy(card)(state)
            }
            return state
        }
        */
const alliance:CardSpec = {
    name: 'Alliance',
    fixedCost: {...free, coin:6, energy:1},
    effects: [{
        text: [`Create a ${province.name}, ${duchy.name}, ${estate.name}, ${gold.name}, ${silver.name}, and ${copper.name} in your discard.`],
        transform: () => doAll([province, duchy, estate, gold, silver, copper].map(c => create(c)))
    }]
}
registerEvent(alliance, 'expansion')

const buildUp:CardSpec = {
    name: 'Build Up',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [createInPlayEffect(infrastructure), incrementCost()],
    relatedCards: [infrastructure]
}
registerEvent(buildUp, 'expansion')

/*
const avenue:CardSpec = {
    name: 'Avenue',
    effects: [actionsEffect(1), coinsEffect(1), toPlay()],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && s.play.length < 2
    }],
    ability: [{
        text: [`Discard this and another card from play for +$1 and +1 action.`],
        transform: (state, c) => payToDo(
            doAll([discardFromPlay(c), applyToTarget(
                target => discardFromPlay(target),
                `Discard a card from play.`,
                state => state.play,
                {cost: true}
            )]),
            doAll([gainActions(1), gainCoins(1)])
        )
    }]
}
buyable(avenue, 5, 'expansion')
*/

const inn:CardSpec = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
}
buyable(inn, 5, 'expansion', {onBuy: [createEffect(horse, 'discard', 3)]})

/*
const exploit:CardSpec = {
    name: 'Exploit',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash all cards in play for +1 vp each.`],
        transform: state => doAll(state.play.map(c => doAll([trash(c), gainPoints(1)])))
    }]
}
registerEvent(exploit, 'expansion')
*/

const treasury:CardSpec = {
    name: 'Treasury',
    fixedCost: energy(1),
    effects: [actionsEffect(3), toPlay()],
    triggers: [{
        text: `Whenever you gain more than one action, gain that much $ minus one.`,
        kind: 'resource',
        handles: e => e.resource == 'actions' && e.amount > 1,
        transform: e => gainCoins(e.amount - 1)
    }]
}
buyable(treasury, 4, 'expansion')

const statue:CardSpec = {
    name: 'Statue',
    fixedCost: energy(1),
    effects: [toPlay()],
    triggers: [{
        text: `Whenever you buy a card costing $1 or more, +1 vp.`,
        kind: 'buy',
        handles: (e, s) => e.card.cost('buy', s).coin > 0,
        transform: e => gainPoints(1),
    }]
}
buyable(statue, 5, 'expansion')

const scepter:CardSpec = {
    name: 'Scepter',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay an action to play a card in your hand three times then trash it.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),

            ]), 'Choose a card to play three times.', s => s.hand
        ))
    }]
}
buyable(scepter, 7, 'expansion')

const farmlandName = 'Farmland'
const farmland:CardSpec = {
    name: farmlandName,
    fixedCost: energy(3),
    effects: [toPlay()],
    restrictions: [{
        test: (card, state, kind) =>
            kind == 'activate' && state.play.some(c => c.name == farmlandName && c.id != card.id)
    }],
    ability: [{
        text: [`If you have no other ${farmlandName}s in play, discard this for +7 vp.`],
        transform: (s, c) => payToDo(discardFromPlay(c), gainPoints(7)),
    }],
}
buyable(farmland, 8, 'expansion')

const hallOfEchoes:CardSpec = {
    name: 'Hall of Echoes',
    fixedCost: {...free, energy:1, coin:3},
    effects: [{
        text: [`For each card in your hand without an echo token,
                create a copy in your hand with an echo token.`],
        transform: state => doAll(
            state.hand.filter(c => c.count('echo') == 0).map(
                c => create(c.spec, 'hand', x => addToken(x, 'echo'))
            )
        )
    }],
    staticTriggers: [fragileEcho()],
}
registerEvent(hallOfEchoes, 'expansion')

// ----------------- Absurd --------------------

const confusion:CardSpec = {
    name: 'Confusion',
    buyCost: free,
    staticTriggers: [{
        text: `After buying a card, move it to the events.`,
        kind: 'afterBuy',
        handles: () => true,
        transform: e => move(e.card, 'events')
    }, {
        text: `After using an event, move it to the supply.`,
        kind: `afterUse`,
        handles: () => true,
        transform: e => move(e.card, 'supply')
    }]
}
register(confusion, 'absurd')

const chaos:CardSpec = {
    name: 'Chaos',
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [targetedEffect(
        target => move(target, 'events'),
        `Move a card in your discard to the events.`,
        state => state.discard,
    )],
    staticTriggers: [{
        text: `Whenever you use an event, move it to your discard.`,
        kind: 'use',
        handles: () => true,
        transform: e => move(e.card, 'discard')
    }]
}
register(chaos, 'absurd')

const misplace:CardSpec = {
    name: 'Misplace',
    fixedCost: {...free, energy:1, coin:2},
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `After buying a card the normal way, remove a charge token from this to buy all other cards in the supply with the same name.`,
        kind: 'afterBuy',
        handles: (e, s, c) => c.charge > 0 && e.source.name == 'act',
        transform: (e, s, c) => payToDo(discharge(c, 1),
            doAll(s.supply.filter(target => target.name == e.card.name && target.id != e.card.id).map(target => target.buy(c)))
        )
    }, {
        text: `After buying a card, move it to your discard.`,
        kind: 'afterBuy',
        handles: () => true,
        transform: e => move(e.card, 'discard')
    }, {
        text: `After playing a card, move it to the supply.`,
        kind: 'afterPlay',
        handles: () => true,
        transform: e => move(e.card, 'supply')
    }]
}
registerEvent(misplace, 'absurd')

let echoName = 'Weird Echo'
const weirdEcho:CardSpec = {name: echoName,
    buyCost: coin(7),
    effects: [targetedEffect(
        (target, card) => async function(state) {
            let copy:Card|null; [copy, state] = await createAndTrack(target.spec, 'void')(state)
            if (copy != null) {
                state = await addToken(copy, 'echo')(state)
                state = await copy.play(card)(state)
            }
            return state
        },
        `Create a fresh copy of a card you have in play,
         then put an echo token on the copy and play it.`,
        state => dedupBy(state.play, c => c.spec)
    )],
    staticTriggers: [fragileEcho('echo'), {
        text: `After playing a card, put it into play unless its name contains the word "Echo".`,
        kind: 'afterPlay',
        handles: e => !e.card.name.includes("Echo"),
        transform: e => move(e.card, 'play')
    }]
}
register(weirdEcho, 'absurd')

const weirdCarpenter:CardSpec = {
    name: 'Weird Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }, toPlay()],
    triggers: [{
        text: `After playing a card, put it into play.`,
        kind: 'afterPlay',
        handles: e => true,
        transform: e => move(e.card, 'play')
    }]
}
buyable(weirdCarpenter, 5, 'absurd')
/*
const amalgam:CardSpec = {
    name: 'Amalgam',
    fixedCost: energy(0.5),
    buyCost: coin(3),
    effects: [coinsEffect(3)]
}
register(amalgam, 'absurd')
*/

const shinySilver:CardSpec = {
    name: 'Shiny Silver',
    buyCost: coin(2.5),
    effects: [coinsEffect(2.5)]
}
register(shinySilver, 'absurd')

const xSpec:CardSpec = {name: 'X'}
const ySpec:CardSpec = {name: 'Y'}
function xHatchery(x:CardSpec=xSpec): CardSpec {
    return {
        name: `${x.name} Hatchery`,
        buyCost: coin(3),
        effects: [createEffect(x)],
        relatedCards: (x.name == xSpec.name) ? [] : [x]
    }
}

const metaHatchery:CardSpec = {
    name: 'Meta Hatchery',
    buyCost: coin(3),
    relatedCards: [xHatchery()],
    effects: [{
        text: [`Choose a card X in your hand.`,
               `Create an X Hatchery in your discard.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                `Choose card X.`,
                state.hand.map(asChoice)
            )
            if (target != null) {
                state = await create(xHatchery(target.spec))(state)
            }
            return state
        }
    }]
}
register(metaHatchery, 'absurd')

const invertedPalace:CardSpec = {
    name: 'Inverted Palace',
    buyCost: energy(1),
    fixedCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)],
}
register(invertedPalace, 'absurd')

/* Change name, and make resources round down? */
/*
const unfocus:CardSpec = {
    name: 'Unfocus',
    fixedCost: energy(0.01),
    effects: [actionsEffect(1)]
}
registerEvent(unfocus, 'absurd')
*/

function concatIfdef<T>(xs:T[]|undefined, ys:T[]|undefined): T[] {
    return (xs || []).concat(ys || [])
}

function addIfdef<T>(x:Cost|undefined, y:Cost|undefined): Cost {
    return addCosts(x || free, y || free)
}

function mergeSpecs(x:CardSpec=xSpec, y:CardSpec=ySpec): CardSpec {
    return {
        name: `${x.name} + ${y.name}`,
        buyCost: addIfdef(x.buyCost, y.buyCost),
        fixedCost: addIfdef(x.fixedCost, y.fixedCost),
        variableCosts: concatIfdef(x.variableCosts, y.variableCosts),
        effects: concatIfdef(x.effects, y.effects),
        triggers: concatIfdef(x.triggers, y.triggers),
        replacers: concatIfdef(x.replacers, y.replacers),
        staticTriggers: concatIfdef(x.staticTriggers, y.staticTriggers),
        staticReplacers: concatIfdef(x.staticReplacers, y.staticReplacers)
    }
}
const combiner:CardSpec = {
    name: 'Combiner',
    buyCost: coin(3),
    effects: [{
        text: [
            `Trash two cards X and Y from your hand.`,
            `If you do, create an X+Y in your hand that combines all of their costs, effects, and so on.`
        ],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(state,
                'Choose two cards to combine.',
                state.hand.map(asChoice),
                2, 2
            )
            if (targets.length == 2) {
                state = await trash(targets[0])(state)
                state = await trash(targets[1])(state)
                state = await create(mergeSpecs(targets[0].spec, targets[1].spec))(state)
            }
            return state
        }
    }]
}
register(combiner, 'absurd')

const merge:CardSpec = {
    name: 'Merge',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash two cards in the supply each costing at least $1.`,
                `If you do, create an X+Y in the supply that combines all of their costs, effects, and so on.`],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(state,
                'Choose two cards to combine.',
                state.supply.filter(c => c.cost('buy', state).coin > 0).map(asChoice),
                2, 2
            )
            if (targets.length == 2) {
                state = await trash(targets[0])(state)
                state = await trash(targets[1])(state)
                state = await create(mergeSpecs(targets[0].spec, targets[1].spec), 'supply')(state)
            }
            return state
        }
    }]
}
registerEvent(merge, 'absurd')

const idealize:CardSpec = {
    name: 'Idealize',
    fixedCost: {...free, coin:2, energy:1},
    effects: [{
        text: [`Move a card in your hand to the supply and put an ideal token on it.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to idealize.', state.hand.map(asChoice))
            if (target != null) {
                state = await move(target, 'events')(state)
                state = await addToken(target, 'ideal')(state)
            }
            return state
        }
    }],
    staticReplacers: [{
        text: 'Events cost an additional @ to use for each ideal token on themn.',
        kind: 'costIncrease',
        handles: e => e.actionKind == 'use' && e.card.count('ideal') > 0,
        replace: e => ({...e, cost: {...e.cost, energy: e.cost.energy + e.card.count('ideal')}})
    }]
}
registerEvent(idealize, 'absurd')

const reify:CardSpec = {
    name: 'Reify',
    fixedCost: energy(1),
    effects: [{
        text: [`Choose an event. Create two copies in your hand with echo tokens on them.`],
        transform: () => applyToTarget(
            target => repeat(create(target.spec, 'hand', c => addToken(c, 'echo')), 2),
            'Choose a card to reify.',
            s => s.events
        )
    }],
    staticTriggers: [fragileEcho()],
}
registerEvent(reify, 'absurd')

const showOff:CardSpec = {
    name: 'Show Off',
    effects: [chargeEffect()],
    staticReplacers: [{
        text: `If this has a charge token, you can't win the game.`,
        kind: 'victory',
        handles: (e, s, c) => c.charge > 0,
        replace: e => ({...e, victory:false})
    }],
    staticTriggers: [{
        text: `If you have at least 10 times more victory points than needed to win the game
            and this has any charge tokens on it, then remove them and lose 10 @.`,
        kind: 'resource',
        handles: (e, s, c) => s.points >= 10 * s.vp_goal && s.find(c).charge > 0,
        transform: (e, s, c) => async function(state) {
            state = await discharge(c, state.find(c).charge)(state)
            state = await gainResource('energy', -10, c)(state)
            throw new Victory(state)
        }
    }],
}
registerEvent(showOff, 'absurd')

function cardsInState(s:State): Card[] {
    return s.events.concat(s.supply).concat(s.hand).concat(s.play).concat(s.discard)
}

const reconfigure:CardSpec = {
    name: 'Reconfigure',
    effects: [{
        text: [`Remove all tokens from any card. Then put back the same total number of tokens of the same types.`],
        transform: () => applyToTarget(
            target => async function(state) {
                target = state.find(target)
                const allTokens:Set<Token> = new Set()
                let tokenCount:number = 0
                for (const [token, count] of target.tokens) {
                    allTokens.add(token)
                    tokenCount += count
                    state = await removeToken(target, token, 'all')(state)
                }
                const numTypes = allTokens.size;
                let currentType = 0;
                for (const token of allTokens) {
                    currentType += 1;
                    let n:number|null;
                    if (currentType == numTypes) {
                        n = tokenCount
                    } else {
                        [state, n] = await choice(state,
                        `How many ${token} tokens do you want to add? (${tokenCount} remaining)`,
                        chooseNatural(tokenCount+1)
                        )
                    }
                    if (n != null && n >0) {
                        tokenCount -= n
                        state = await addToken(target, token, n)(state)
                    }
                }
                return state
            },
            'Choose a card to reconfigure.',
            state => cardsInState(state),
        )
    }]
}
buyable(reconfigure, 4, 'absurd', {onBuy: [{
    text: [`Add a reconfigure token to each card in your hand.`],
    transform: state => doAll(state.hand.map(c => addToken(c, 'reconfigure')))
}]})

const steal:CardSpec = {
    name: 'Steal',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        target => move(target, 'discard'),
        `Move a supply to your discard.`,
        state => state.supply
    )]
}
registerEvent(steal, 'absurd')

const hoard:CardSpec = {
    name: 'Hoard',
    fixedCost: {...free, energy:2, coin:8},
    effects: [{
        text: [`Move all cards to your hand.`],
        transform: s => moveMany(cardsInState(s), 'hand')
    }]
}
registerEvent(hoard, 'absurd')

const redistribute:CardSpec = {
    name: 'Redistribute',
    effects: [{
        text: [`Choose two cards.
                For each type of token that appears in both of them, redistribute tokens of that type arbitrarily between them.`],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(
                state, 'Choose two cards to redistribute tokens between.',
                cardsInState(state).map(asChoice), 2, 2
            )
            if (targets.length == 2) {
                for (const [token, count] of targets[0].tokens) {
                    if (targets[0].count(token) > 0 && targets[1].count(token) > 0) {
                        const total = targets[0].count(token) + targets[1].count(token)
                        for (const target of targets) {
                            state = await removeToken(target, token, 'all')(state)
                        }
                        let n:number|null; [state, n] = await choice(state,
                            `How many ${token} tokens do you want to put on ${targets[0].name}?`,
                            chooseNatural(total+1)
                        )
                        if (n != null) {
                            state = await addToken(targets[0], token, n)(state)
                            state = await addToken(targets[1], token, total - n)(state)
                        }
                    }
                }
            }
            return state
        }
    }]
}
buyable(redistribute, 4, 'absurd', {replacers: [startsWithCharge(redistribute.name, 2)]})


// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Free money',
    fixedCost: energy(0),
    effects: [coinsEffect(100), buysEffect(100)],
}
cheats.push(freeMoney)

const freeActions:CardSpec = {name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionsEffect(100)],
}
cheats.push(freeActions)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effects: [pointsEffect(10)],
}
cheats.push(freePoints)

const doItAll:CardSpec = {name: 'Do it all',
    fixedCost: energy(0),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }, {
        text: ['Remove all decay tokens from cards in your discard and play.'],
        transform: state => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'decay', 'all'),
        ))
    },refreshEffect(100), coinsEffect(100), buysEffect(100)]
}
cheats.push(doItAll)

// ------------ Random placeholder --------------

export const randomPlaceholder:CardSpec = {name: RANDOM}


function cardsFrom(kind:'cards'|'events', expansions:ExpansionName[]) {
    return expansions.map(c => sets[c][kind]).flat(1)
}

export const allCards:CardSpec[] = cardsFrom('cards', expansionNames)
export const allEvents:CardSpec[] = cardsFrom('events', expansionNames)
