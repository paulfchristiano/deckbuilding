export const VERSION = "1.5.1"

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
        case 'energy': return repeatSymbol('@', amount)
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
    calculatedCost?: CalculatedCost;
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

export interface CalculatedCost {
    initial: Cost; //used for sorting
    calculate: (card:Card, state:State) => Cost;
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
        public readonly place:PlaceName = null,
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
                let result:Cost = free
                if (this.spec.fixedCost != undefined)
                    result = this.spec.fixedCost
                else if (this.spec.calculatedCost != undefined)
                    result = this.spec.calculatedCost.calculate(this, state)
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
        const initialCost:CostParams = {
            kind:'cost',
            actionKind:kind,
            card:card,
            cost:card.baseCost(state, kind)
        }
        const newCost:Params = replace(initialCost, state)
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
                    state = await move(card, 'resolving')(state)
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
                    if (card.place == 'resolving')
                        state = await move(card, 'discard')(state);
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

type ZoneName = 'supply' | 'hand' | 'discard' | 'play' | 'aside' | 'events'
export type PlaceName = ZoneName | null | 'resolving'

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

export type GameSpec = 
    { kind: 'test' } |
    { kind: 'pick', cards:CardSpec[], events:CardSpec[] } |
    { kind: 'pickR', cards:SlotSpec[], events:SlotSpec[], seed: string } |
    { kind: 'require', cards:SlotSpec[], events:SlotSpec[], seed: string } |
    { kind: 'full', seed: string} | 
    { kind: 'half', seed: string} |
    { kind: 'mini', seed: string}

export class State {
    public readonly coin:number;
    public readonly energy:number;
    public readonly points:number;
    public readonly actions:number;
    public readonly buys:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly aside:Zone;
    public readonly events:Zone;
    constructor(
        public readonly spec: GameSpec = {kind:'full', seed: ''},
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
        this.aside = zones.get('aside') || []
        this.events = zones.get('events') || []
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
        return card.update({place:null})
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
        for (const card of state.supply)
            for (const trigger of card.staticTriggers())
                triggers.push([card, trigger])
        for (const card of state.events.concat(state.play))
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

interface ResourceParams {kind:'resource', resource:ResourceName, amount:number, source:Source}
interface CostParams {kind:'cost', actionKind: ActionKind, card:Card, cost:Cost}
interface MoveParams {kind:'move', card:Card, fromZone:PlaceName, toZone:PlaceName, effects:Transform[], skip:boolean}
interface CreateParams {kind:'create', spec:CardSpec, zone:ZoneName, effects:Transform[]}

type Params = ResourceParams | CostParams | MoveParams | CreateParams
type TypedReplacer = Replacer<ResourceParams> | Replacer<CostParams> |
    Replacer<MoveParams> | Replacer<CreateParams>

function replace<T extends Params>(x: T, state: State): T {
    const replacers:[Card, TypedReplacer][] = []
    for (const card of state.supply)
        for (const replacer of card.staticReplacers())
            replacers.push([card, replacer])
    for (const card of state.events.concat(state.play))
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
        state = await postprocess(card)(state)
        return state
    }
}

function createAndTrack(
    spec:CardSpec,
    zone:ZoneName='discard',
): ((s:State) => Promise<[Card, State]>) {
    return async function(state: State): Promise<[Card, State]> {
        let params:CreateParams = {kind:'create', spec:spec, zone:zone, effects:[]}
        params = replace(params, state)
        spec = params.spec
        zone = params.zone
        for (const effect of params.effects) state = await effect(state)
        let card:Card; [state, card] = createRaw(state, spec, zone)
        state = state.log(`Created ${a(card.name)} in ${zone}`)
        state = await trigger({kind:'create', card:card, zone:zone})(state)
        return [card, state]
    }
}

function createAndPlay(spec:CardSpec, source:Source=unk): Transform {
    return create(spec, 'aside', (c => c.play(source)))
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
    return (card == null) ? noop : move(card, null, logged)
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
            source:source
        }
        params = replace(params, state)
        resource = params.resource
        amount = params.amount
        newResources[resource] = Math.max(newResources[resource] + amount, 0)
        state = state.setResources(newResources)
        state = state.log(amount > 0 ?
            `Gained ${renderResource(resource, amount)}` :
            `Lost ${renderResource(resource, -amount)}`)
        return trigger({kind:'resource', resource:resource, amount:amount, source:source})(state)
    }
}

function setResource(resource:ResourceName, amount:number, source:Source=unk) {
    return async function(state:State) {
        const newResources = {...state.resources}
        newResources[resource] = amount
        return state.setResources(newResources)
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

export const VP_GOAL = 40
function gainPoints(n:number, source:Source=unk): Transform {
    return async function(state) {
        state = await gainResource('points', n, source)(state)
        if (state.points >= VP_GOAL) throw new Victory(state)
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

type Token = 'charge' | 'cost' | 'mirror' | 'duplicate' | 'twin' | 'synergy' |
    'shelter' | 'echo' | 'decay' | 'burden' | 'pathfinding' | 'neglect' |
    'reuse' | 'polish' | 'priority' | 'hesitation' | 'parallelize' | 'art' |
    'mire' | 'onslaught' | 'expedite'

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

function charge(card:Card, n:number, cost:boolean=false): Transform {
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
    if (options.length == 0) return [state, null];
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
    if (picked == null) throw new Error('No valid options.');
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

function coinKey(spec:CardSpec): number {
    if (spec.buyCost !== undefined)
        return spec.buyCost.coin
    if (spec.fixedCost !== undefined)
        return spec.fixedCost.coin
    if (spec.calculatedCost !== undefined)
        return spec.calculatedCost.initial.coin
    return 0
}
function energyKey(spec:CardSpec): number {
    if (spec.fixedCost !== undefined)
        return spec.fixedCost.energy
    if (spec.calculatedCost !== undefined)
        return spec.calculatedCost.initial.energy
    return 0
}
type Comp<T> = (a:T, b:T) => number
function toComp<T>(key:(x:T) => number): Comp<T> {
    return (a, b) => key(a) - key(b)
}
function nameComp(a:CardSpec, b:CardSpec): number {
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
const supplySort:Comp<CardSpec> = lexical([
    toComp(coinKey), toComp(energyKey), nameComp
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
        case 'full': return {cards: Array(10).fill(RANDOM), events:Array(4).fill(RANDOM)}
        case 'half': return {cards: Array(5).fill(RANDOM), events:Array(2).fill(RANDOM)}
        case 'mini': return {cards: Array(3).fill(RANDOM), events:Array(1).fill(RANDOM)}
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

export function makeKingdom(spec:GameSpec): Kingdom {
    switch (spec.kind) {
        case 'test':
            return {
                cards:mixins,
                events:eventMixins.concat(cheats),
            }
        case 'pick':
            return {cards:spec.cards, events:spec.events}
        default:
            const kingdom = cardsAndEvents(spec)
            return {
                cards: pickRandoms(kingdom.cards, mixins, 'cards' + spec.seed),
                events: pickRandoms(kingdom.events, eventMixins, 'events' + spec.seed),
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

export function specToURL(spec:GameSpec): string {
    const args:Map<string, string> = new Map()
    if (spec.kind != 'full')
        args.set('kind', spec.kind)
    switch (spec.kind) {
        case 'full':
        case 'mini':
        case 'half':
            args.set('seed', spec.seed)
            break
        case 'pickR':
        case 'require':
            args.set('cards', renderSlots(spec.cards))
            args.set('events', renderSlots(spec.events))
            args.set('seed', spec.seed)
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

export function specFromURL(search:string): GameSpec {
    const searchParams = new URLSearchParams(search)
    const urlKind:string|null = searchParams.get('kind')
    const cardsString:string|null = searchParams.get('cards')
    const cards:string[] = (cardsString === null) ? []
        : normalize(split(cardsString, ','))
    const eventsString:string|null = searchParams.get('events')
    const events:string[] = (eventsString === null) ? []
        : normalize(split(eventsString, ','))
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
        case 'half':
        case 'mini':
            return {kind:kind, seed:seed}
        case 'pick':
            const cardSpecs:CardSpec[] = [];
            const eventSpecs:CardSpec[] = [];
            if (cards !== null) {
                for (const card of extractList(cards, mixins)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else cardSpecs.push(card)
                }
            }
            if (events !== null) {
                for (const card of extractList(events, eventMixins)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else eventSpecs.push(card)
                }
            }
            return {kind:kind, cards:cardSpecs, events:eventSpecs}
        case 'require':
            return {
                seed:seed,
                kind:'require',
                cards: (cards === null) ? [] : extractList(cards, mixins),
                events: (events === null) ? [] : extractList(events, eventMixins),
            }
        case 'pickR':
            return {kind:kind, seed:seed,
                    cards:(cards === null) ? [] : extractList(cards, mixins),
                    events:(events === null) ? [] : extractList(events, eventMixins)}
        case 'test': return {kind: 'test'}
        default: throw new MalformedSpec(`Invalid kind ${kind}`)
    }
}

function getFixedKingdom(kingdomString:string|null): CardSpec[]|null {
    if (kingdomString==null) return null
    const cardStrings:string[] = kingdomString.split(',')
    const mixinsByName:Map<string, CardSpec> = new Map()
    for (const spec of mixins) mixinsByName.set(spec.name, spec)
    const result:CardSpec[] = []
    for (const cardString of cardStrings) {
        const cardSpec:CardSpec|undefined = mixinsByName.get(cardString)
        if (cardSpec == undefined) {
            alert(`URL specified invalid card ${cardString}`)
            return null
        }  else {
            result.push(cardSpec)
        }
    }
    return result
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

export function initialState(spec:GameSpec): State {
    const startingHand:CardSpec[] = [copper, copper, copper, estate, estate]

    const kingdom:Kingdom = makeKingdom(spec)

    const variableSupplies = kingdom.cards.slice()
    const variableEvents = kingdom.events.slice()
    variableSupplies.sort(supplySort)
    variableEvents.sort(supplySort)

    const supply = coreSupplies.concat(variableSupplies)
    const events = coreEvents.concat(variableEvents)

    let state = new State(spec)
    state = createRawMulti(state, supply, 'supply')
    state = createRawMulti(state, events, 'events')
    state = createRawMulti(state, startingHand, 'discard')
    return state
}

export async function playGame(state:State): Promise<void> {
    state = await trigger({kind:'gameStart'})(state)
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

const coreSupplies:CardSpec[] = []
const coreEvents:CardSpec[] = []
export const mixins:CardSpec[] = []
export const eventMixins:CardSpec[] = []
const cheats:CardSpec[] = []

//
// ----------- UTILS -------------------
//

function createEffect(spec:CardSpec, zone:'discard'='discard'): Effect {
    return {
        text: [`Create ${a(spec.name)} in your discard.`],
        transform: () => create(spec, zone),
    }
}

interface Extras {
    triggers?:TypedTrigger[];
    replacers?:TypedReplacer[];
    onBuy?:Effect[];
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
        })
    )
    const triggers:TypedTrigger[] = (buyTriggers as TypedTrigger[])
    return {
        ...card,
        buyCost: cost,
        staticTriggers: triggers.concat(extra.triggers || []),
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

function registerEvent(card:CardSpec):void {
    eventMixins.push(card)
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
coreEvents.push(refresh)


const copper:CardSpec = {name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
}
coreSupplies.push(copper)

const silver:CardSpec = {name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
}
coreSupplies.push(silver)

const gold:CardSpec = {name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
}
coreSupplies.push(gold)

const estate:CardSpec = {name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}
coreSupplies.push(estate)

const duchy:CardSpec = {name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
}
coreSupplies.push(duchy)

const province:CardSpec = {name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
}
coreSupplies.push(province)


//
// ----- MIXINS -----
//

function register(card:CardSpec):void {
    mixins.push(card)
}
function buyable(card:CardSpec, n:number, extra:Extras={}) {
    card.buyCost = coin(n)
    register(supplyForCard(card, coin(n), extra))
}
function buyableFree(card:CardSpec, coins:number): void {
    buyable(card, coins, {onBuy: [buyEffect()]})
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
    special:{optional?:boolean, cost?:boolean} = {},
): Transform {
    return async function(state) {
        let choices:Option<Card|null>[] = options(state).map(asChoice)
        if (special.optional == true) choices = allowNull(choices, "Don't play")
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
    }, {
        text: `Whenever this would leave play, trash it instead.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play',
        replace: x => ({...x, toZone:null})
    }]
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
buyable(ghostTown, 3, {onBuy: [actionsEffect(2)]})

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
buyable(transmogrify, 3)


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
        text: [`Put up to 3 non-${Till} from your
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
buyable(till, 3)

const village:CardSpec = {name: 'Village',
    effects:  [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
}
buyable(village, 4)

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect(), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)]
}
buyable(bridge, 4)

const coven:CardSpec = {name: 'Coven',
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
buyable(coven, 4)

const lab:CardSpec = {name: 'Lab',
    effects: [actionsEffect(2)]
}
buyable(lab, 4)

const payAction = payCost({...free, actions:1})

function tickEffect(): Effect {
    return {
        text: [],
        transform: (state, card) => tick(card)
    }
}

function playTwice(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
            ]), 'Choose a card to play twice.', s => s.hand))
    }
}

const throneRoom:CardSpec = {name: 'Throne Room',
    fixedCost: energy(1),
    effects: [playTwice()]
}
buyable(throneRoom, 5)

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
buyable(coppersmith, 3)

const unearth:CardSpec = {name: 'Unearth',
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(
            target => move(target, 'hand'),
            'Put a card from your discard into your hand.',
            state => state.discard
        )
    ]
}
buyable(unearth, 5)

const celebration:CardSpec = {name: 'Celebration',
    fixedCost: energy(2),
    effects: [toPlay()],
    replacers: [costReduce('play', {energy:1})]
}
buyable(celebration, 8)

const Plow = 'Plow'
const plow:CardSpec = {name: Plow,
    fixedCost: energy(1),
    effects: [{
        text: [`Put all non-${Plow} cards from your discard into your hand.`],
        transform: state => moveMany(state.discard.filter(
            c => c.name != Plow
        ), 'hand')
    }]
}
buyable(plow, 4)

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    effects: [actionsEffect(3), toPlay()],
    triggers: [{
        text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
        kind: 'cost',
        handles: () => true,
        transform: e => doAll([
            gainActions(e.cost.energy),
            gainCoins(e.cost.energy),
            gainBuys(e.cost.energy)
        ])
    }]
}
buyable(construction, 5)

const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:1, coin:5},
    effects: [{
        text: ['Put a mirror token on each card in your hand.'],
        transform: (state:State, card:Card) => 
            doAll(state.hand.map(c => addToken(c, 'mirror')))
    }],
    triggers: [{
        text: `After playing a card with a mirror token on it 
        other than with this, remove a mirror token and play it again.`,
        kind:'afterPlay',
        handles: (e, state, card) => {
            const played:Card = state.find(e.card)
            return played.count('mirror') > 0 && e.source.name != card.name
        },
        transform: (e, s, card) => doAll([
            removeToken(e.card, 'mirror'),
            e.card.play(card),
        ]),
    }]
}
registerEvent(hallOfMirrors)

function costPlus(initial:Cost, increment:Cost): CalculatedCost {
    const extraStr:string = `${renderCost(increment, true)} for each cost token on this.`
    return {
        calculate: function(card:Card, state:State) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).count('cost')))
        },
        text: eq(initial, free) ? extraStr : `${renderCost(initial, true)} plus ${extraStr}`,
        initial: initial,
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
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [
        chargeEffect(),
        {
            text: ['Put a cost token on this for each charge token on it.'],
            transform: (s:State, c:Card) => addToken(c, 'cost', s.find(c).charge)
        },
        refreshEffect(5),
    ]
}
registerEvent(escalate)

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
        text: [`Play then trash any number of cards in your hand.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await trash(picked)(state)
                    const id = picked.id
                    options = options.filter(c => 
                        c.value.id != id
                        && state.find(c.value).place == 'hand'
                    )
                }
            }
        }
    }]
}
registerEvent(volley)


const parallelize:CardSpec = {name: 'Parallelize',
    fixedCost: {...free, coin:2, energy:1},
    effects: [{
        text: [`Put a parallelize token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'parallelize')))
    }],
    replacers: [{
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
registerEvent(parallelize)

const reach:CardSpec = {name:'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
}
registerEvent(reach)

const fair:CardSpec = {
    name: 'Fair',
    replacers: [{
        text: `Whenever you would create a card in your discard,
        instead trash this to create the card in your hand.`,
        kind: 'create',
        handles: (e, state, card) => e.zone == 'discard'
            && state.find(card).place == 'play',
        replace: (x, state, card) => ({
            ...x, zone:'hand', effects:x.effects.concat(trash(card))
        })
    }, {
        text: `Whenever this would leave play, trash it.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play',
        replace: x => ({...x, toZone:null})
    }]
}

const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(1),
    effects: [buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
}
registerEvent(travelingFair)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:6, energy:1},
    effects: [{
        text: ['Lose all $.', '+1 vp per $ lost.'],
        transform: () => async function(state) {
            const n = state.coin
            state = await gainCoins(-n)(state)
            state = await gainPoints(n)(state)
            return state
        }
    }]
}
registerEvent(philanthropy)

const finance:CardSpec = {name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
}
registerEvent(finance)

const flowerMarket:CardSpec = {
    name: 'Flower Market',
    effects: [buyEffect(), pointsEffect(1)],
}
buyable(flowerMarket, 2, {onBuy: [pointsEffect(1)]})
/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/

const coffers:CardSpec = {name: 'Coffers',
    effects: [{
        text: [
            'If you have any $, lose all $ and put that many charge tokens on this.',
            'Otherwise, remove all charge tokens from this and gain that much $.'
        ],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            const m = state.coin
            if (m == 0) {
                state = await discharge(card, n)(state)
                state = await gainCoins(n)(state)
                return state
            } else {
                state = await gainCoins(-m)(state)
                state = await charge(card, m)(state)
                return state
            }
        }
    }]
}
registerEvent(coffers)

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effects: [pointsEffect(1), actionsEffect(1)],
}
buyable(vibrantCity, 4)

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
    frontier, 7,
    {triggers: [startsWithCharge(frontier.name, 2)]}
)

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effects: [{
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, chargeUpTo(5)]
}
buyable(investment, 4, {triggers: [startsWithCharge(investment.name, 2)]})

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:12, energy:3},
    effects: [{
        text: ['Buy each card in the supply.'],
        transform: (state, card) => doAll(state.supply.map(s => s.buy(card)))
    }]
}
registerEvent(populate)

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:4, energy:1},
    effects: [{
        text: [`Put a duplicate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'duplicate')))
    }],
    triggers: [{
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
registerEvent(duplicate)

const royalSeal:CardSpec = {name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair]
}
buyable(royalSeal, 5)

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
buyable(workshop, 4)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    triggers: [{
        text: `After buying a card while this is in play,
            discard this to buy the card again.`,
        kind: 'afterBuy',
        handles: (e, state, card) => state.find(card).place == 'play'
            && e.before.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.buy(card)(state)
        }
    }]
}
buyable(shippingLane, 5)

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(1),
    effects: [workshopEffect(6)],
}
buyable(factory, 3)

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a fresh copy of it in your hand.',
        state => state.hand,
    )]
}
buyable(imitation, 3)

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
    ), trashThis()]
}
buyableFree(feast, 3)

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

const stables:CardSpec = {name: 'Stables',
    effects: [{
        text: [
            'If you have any actions, lose them all and put that many charge tokens on this.',
            'Otherwise, remove all charge tokens from this and gain that many actions.'
        ],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            const m = state.actions
            if (m==0) {
                state = await discharge(card, n)(state)
                state = await gainActions(n)(state)
                return state
            } else {
                state = await gainActions(-m)(state)
                state = await charge(card, m)(state)
                return state
            }
        }
    }]
}
registerEvent(stables)

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
registerEvent(recycle)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:8},
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    triggers: [{
        text: `After playing a card with a twin token other than with this, play it again.`,
        kind: 'afterPlay',
        handles: (e, state, card) => (e.card.count('twin') > 0 && e.source.id != card.id),
        transform: (e, state, card) => e.card.play(card),
    }],
}
registerEvent(twin)

function startsWithCharge(name:string, n:number):Trigger<CreateEvent> {
    return {
        text: `When you create a ${name},
               put ${aOrNum(n, 'charge token')} on it.`,
        kind: 'create',
        handles: e => e.card.name == name,
        transform: e => charge(e.card, n)
    }
}

const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+1 action per charge token on this.'],
        transform: (state, card) => gainActions(state.find(card).charge, card)
    }, chargeUpTo(5)]
}
buyable(youngSmith, 3, {triggers: [startsWithCharge(youngSmith.name, 2)]})

/*
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
buyable(lackeys, 3, {onBuy:[createInPlayEffect(villager)]})

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [{
        text: ['Create two golds in your hand.'],
        transform: () => doAll([create(gold, 'hand'), create(gold, 'hand')]),
    }]
}
buyable(goldMine, 8)

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
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), targetedEffect(
        card => addToken(card, 'expedite', 1),
        'Put an expedite token on a card in the supply.',
        state => state.supply,
    )],
    triggers: [{
        text: `Whenever you create a card with the same name
            as a card in the supply with an expedite token,
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
registerEvent(expedite)

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
    triggers: [{
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
registerEvent(synergy)

const shelter:CardSpec = {name: 'Shelter',
    effects: [actionsEffect(1), targetedEffect(
        target => addToken(target, 'shelter'),
        'Put a shelter token on a card in play.',
        state => state.play
    )]
}
buyable(shelter, 3, {
    replacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token from play,
               instead remove a shelter token from it.`,
        handles: (x, state) => (x.fromZone == 'play' && x.skip == false, state.find(x.card).count('shelter') > 0),
        replace: x => ({...x, skip:true, toZone:'play', effects:x.effects.concat([removeToken(x.card, 'shelter')])})
    }]
})

const market:CardSpec = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
}
buyable(market, 4)

const focus:CardSpec = {name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(1)],
}
registerEvent(focus)

const sacrifice:CardSpec = {name: 'Sacrifice',
    effects: [actionsEffect(1), buyEffect(), targetedEffect(
        (target, card) => doAll([target.play(card), trash(target)]),
        'Play a card in your hand, then trash it.',
        state => state.hand)]
}
buyable(sacrifice, 4)

const herbs:CardSpec = {name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
}
buyableFree(herbs, 2)

const spices:CardSpec = {name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
}
buyable(spices, 5, {onBuy: [coinsEffect(4)]})

const onslaught:CardSpec = {name: 'Onslaught',
    calculatedCost: costPlus(coin(6), energy(1)),
    effects: [incrementCost(), {
        text: [`Play any number of cards in your hand.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    const id = picked.id
                    options = options.filter(c => 
                        c.value.id != id
                        && state.find(c.value).place == 'hand'
                    )
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
registerEvent(onslaught)

//TODO: link these together, modules in general?

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(5)],
}
buyable(colony, 16)

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(5)]
}
buyable(platinum, 9)

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(6), buysEffect(2)]
}
buyable(greatSmithy, 6)

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
}
registerEvent(pressOn)

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
buyable(kingsCourt, 9)

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
buyable(gardens, 4)

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(3),
    effects: [{
        text: ['Remove a decay token from each card.'],
        transform: state => doAll(
            state.discard.concat(state.play).concat(state.hand).
            map(x => removeToken(x, 'decay'))
        )
    }],
    triggers: [{
        text: 'Whenever you move a card to your hand, if it has 3 or more decay tokens on it trash it,'+
            ' otherwise put a decay token on it.',
        kind: 'move',
        handles: e => e.toZone == 'hand',
        transform: e => (e.card.count('decay') >= 3) ?
            trash(e.card) : addToken(e.card, 'decay')
    }]
}
registerEvent(decay)

const reflect:CardSpec = {name: 'Reflect',
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), playTwice()],
}
registerEvent(reflect)

const replicate:CardSpec = {name: 'Replicate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a fresh copy of it in your hand.',
        state => state.hand,
    )]
}
registerEvent(replicate)

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

const inflation:CardSpec = {name: 'Inflation',
    calculatedCost: costPlus(energy(3), energy(1)),
    effects: [incrementCost(), setCoinEffect(15), setBuyEffect(5)],
    replacers: [{
        text: `All costs of $1 or more are increased by $1 per cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.cost.coin > 0,
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
registerEvent(inflation)

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effects: [{
        text: ['Remove a burden token from each card in the supply.'],
        transform: state => doAll(state.supply.map(c => removeToken(c, 'burden')))
    }],
    triggers: [{
        text: 'Whenever you buy a card in the supply, put a burden token on it.',
        kind:'buy',
        handles: (e, state) => (state.find(e.card).place == 'supply'),
        transform: e => addToken(e.card, 'burden')
    }],
    replacers: [{
        kind: 'cost',
        text: 'Cards cost $2 more to buy for each burden token on them.',
        handles: x => x.card.count('burden') > 0,
        replace: x => ({...x, cost: addCosts(x.cost, {coin:2 * x.card.count('burden')})})
    }]
}
registerEvent(burden)

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
                then trash it and buy a card in the supply costing exactly $1 more.`],
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
                    ))
                )
            ]), 'Choose a card to play twice.', s => s.hand
        ))
    }]
}
buyable(procession, 4)

const publicWorks:CardSpec = {name: 'Public Works',
    effects: [toPlay()],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
buyable(publicWorks, 5)

function echoEffect(card:Card): Transform {
    return create(card.spec, 'play', c => addToken(c, 'echo'))
}

function fragileEcho(): Trigger<MoveEvent> {
    return {
        text: `Whenever a card with an echo token is moved to your hand or discard,
               trash it.`,
        kind: 'move',
        handles: (x, state) => state.find(x.card).count('echo') > 0
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
            let copy:Card; [copy, state] = await createAndTrack(target.spec, 'aside')(state)
            state = await addToken(copy, 'echo')(state)
            state = await copy.play(card)(state)
            return state
        },
        `Create a fresh copy of a card you have in play,
         then put an echo token on the copy and play it.`,
        state => dedupBy(state.play, c => c.spec)
    )]
}
buyable(echo, 6, {triggers: [fragileEcho()]})

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
buyable(mastermind, 6)

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

//TODO: should "this is in play" always be a requirement for triggers?
const recruitment:CardSpec = {
    name: 'Recruitment',
    relatedCards: [villager],
    effects: [actionsEffect(1), toPlay()],
    triggers: [{
        text: `Whenever you pay @, create that many ${villager.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => repeat(
            create(villager, 'play'), e.cost.energy
        )
    }]
}
buyable(recruitment, 3)

const dragon:CardSpec = {name: 'Dragon',
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              actionsEffect(4), coinsEffect(4), buyEffect()]
}
const egg:CardSpec = {name: 'Egg',
    fixedCost: energy(1),
    relatedCards: [dragon],
    effects: [chargeEffect(), {
        text: [`If this has three or more charge tokens on it, trash it and 
        create ${a(dragon.name)} in your hand.`],
        transform: (state, card) => state.find(card).charge >= 3 ?
            doAll([trash(card), create(dragon, 'hand')]) : noop
    }]
}
buyable(egg, 4)

const looter:CardSpec = {name: 'Looter',
    effects: [{
        text: [`Discard up to three cards from your hand.`,
            `+1 action per card you discarded.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to three cards to discard',
                state.hand.map(asChoice), 3)
            state = await moveMany(targets, 'discard')(state)
            state = await gainActions(targets.length)(state)
            return state
        }
    }]
}
buyable(looter, 5)

const palace:CardSpec = {name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(3), pointsEffect(3), coinsEffect(3)]
}
buyable(palace, 10)

const Innovation:string = 'Innovation'
const innovation:CardSpec = {name: Innovation,
    effects: [actionsEffect(1), toPlay()],
}
buyable(innovation, 6, {triggers: [{
    text: `When you create a card in your discard,
    discard an ${innovation.name} from play in order to play it.`,
    kind: 'create',
    handles: e => e.zone == 'discard',
    transform: (e, state, card) => payToDo(
        applyToTarget(
            target => move(target, 'discard'),
            `Discard an ${innovation.name} from play.`,
            s => s.play.filter(c => c.name == innovation.name),
            {cost:true}
        ),
        e.card.play(card)
    )
}]})

//TODO test this and coven
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
buyable(formation, 4)

const Traveler = 'Traveler'
const traveler:CardSpec = {
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay an action to play a card in your hand once for each charge token on this.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => async function(state){
                const n = state.find(card).charge
                for (let i = 0; i < Math.min(n, 3); i++) {
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
    traveler, 7,
    {triggers:[startsWithCharge(traveler.name, 1)]}
)

const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(1),
    effects: [{
        text: [`Lose all actions and $.`],
        transform: (state, card) => doAll([
            setResource('coin', 0),
            setResource('actions', 0)
        ])
    }, actionsEffect(7)]
}
buyable(fountain, 5)

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
    replacers: [{
        text: `Cards you play cost @ less for each art token on a card
               in the supply with the same name.
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
                        'Remove an art token for a supply pile.',
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
registerEvent(lostArts)

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
buyable(grandMarket, 6)

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
function industryEffect(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing up to $${n} not named ${Industry}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n)) && x.name != Industry
        )
    )
}
const industry:CardSpec = {
    name: Industry,
    fixedCost: energy(2),
    effects: [industryEffect(8), tickEffect(), industryEffect(8)],
}
buyable(industry, 6)

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [actionsEffect(1), toPlay()],
    relatedCards: [villager],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, create a villager in play.`,
        kind: 'play',
        handles: (e, state, card) => e.card.name == estate.name
            && state.find(card).place == 'play',
        transform: (e, state, card) => create(villager, 'play')

    }],
}
buyable(homesteading, 3)

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
buyable(duke, 4)

const carpenter:CardSpec = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }]
}
buyable(carpenter, 4)

/*
const flourishing_n = 5
const flourishing:CardSpec = {
    name: 'Flourishing',
    fixedCost: free,
    effects: [actionsEffect(1), {
        text: [`+1 action for each ${flourishing_n} vp you have.`],
        transform: (state, card) => gainActions(Math.floor(state.points / flourishing_n))
    }]
}
buyable(flourishing, 2)
*/
const artificer:CardSpec = {
    name: 'Artificer',
    effects: [actionsEffect(1), {
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
buyable(artificer, 4)

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
buyable(banquet, 3)

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

const harvest:CardSpec = {
    name:'Harvest',
    fixedCost: energy(1),
    effects: [{
        text: [`+$1 for every differently-named card in your discard.`],
        transform: state => gainCoins(countDistinct(state.discard.map(x => x.name)))
    }]
}
buyable(harvest, 3)

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
        text: [`Discard up to 8 cards from your hand for +$1 each.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 8 cards to discard for +$1 each.',
                state.hand.map(asChoice), 8)
            state = await moveMany(targets, 'discard')(state)
            state = await gainCoins(targets.length)(state)
            return state
        }
    }]
}
buyable(secretChamber, 3)

const supplies:CardSpec = {
    name: 'Supplies',
    effects: [coinsEffect(1), toPlay()],
    replacers: [{
        text: 'Whenever you would move this to your hand, first +1 action and +$1.',
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand',
        replace: (p, s, c) => ({...p, effects:p.effects.concat([
            gainActions(1, c),
            gainCoins(1, c)
        ])})
    }]
}
buyable(supplies, 2)

//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
}
buyable(haggler, 5, {
    triggers: [{
        text: `After buying a card the normal way,
        buy an additional card for each ${haggler.name} in play.
        Each card you buy this way must cost at least $1 less than the previous one.`,
        kind: 'afterBuy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => async function(state) {
            let lastCard:Card = p.card
            let lastCost:Cost = lastCard.cost('buy', p.before)
            let hagglers:Card[] = state.play.filter(c => c.name == haggler.name)
            while (true) {
                const haggler:Card|undefined = hagglers.shift()
                if (haggler === undefined) {
                    return state
                }
                state = state.startTicker(haggler)
                let target:Card|null; [state, target] = await choice(state,
                    `Choose a cheaper card than ${lastCard.name} to buy.`,
                     state.supply.filter(c => leq(
                        addCosts(c.cost('buy', state), {coin:1}),
                        lastCost
                    )).map(asChoice)
                )
                if (target !== null) {
                    lastCard = target
                    lastCost = lastCard.cost('buy', state)
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
        text: [`Play any number of cards in your discard without a reuse token.`,
                `Put a reuse token on each card played in this way.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.discard.filter(c => c.count('reuse') == 0)
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await addToken(picked, 'reuse')(state)
                    const id = picked.id
                    options = options.filter(c => 
                        c.value.id != id
                        && state.find(c.value).place == 'discard'
                    )
                }
            }
        }
    }]
}
registerEvent(reuse)

const polish:CardSpec = {
    name: 'Polish',
    fixedCost: {...free, coin:1, energy:1},
    effects: [{
        text: [`Put a polish token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'polish')))
    }],
    triggers: [{
        text: `Whenever you play a card with a polish token on it,
        remove a polish token from it and +$1.`,
        kind: 'play',
        handles: (e, state) => (e.card.count('polish') > 0),
        transform: e => doAll([removeToken(e.card, 'polish'), gainCoins(1)])
    }]
}
registerEvent(polish)

/*
//NOT INCLUDED
const slog:CardSpec = {
    name: 'Slog',
    restrictions: [{
        test: () => true
    }],
    replacers: [{
        text: `Cards that cost at least @ cost an additional @.`,
        kind: 'cost',
        handles: (p, state) => p.cost.energy > 0,
        replace: p => ({...p, cost:addCosts(p.cost, {energy:1})})
    }]
}

const hesitation:CardSpec = {
    name: 'Hesitation',
    restrictions: [{
        test: () => true
    }],
    triggers: [{
        text: `Whenever you buy a card without a hesitation token on it,
        put a hesitation token on it and gain @@.`,
        kind: 'buy',
        handles: (e, state) => state.find(e.card).count('hesitation') == 0,
        transform: (e, state, card) => doAll([
            addToken(e.card, 'hesitation'),
            gainEnergy(2, card)
        ])
    }]
}
registerEvent(hesitation)
*/
/*
*/
const mire:CardSpec = {
    name: 'Mire',
    fixedCost: energy(4),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }],
    triggers: [{
        text: `Whenever a card leaves your hand, put a mire token on it.`,
        kind: 'move',
        handles: (e, state) => e.fromZone == 'hand',
        transform: e => addToken(e.card, 'mire'),
    }],
    replacers: [{
        text: `Cards with mire tokens can't move to your hand.`,
        kind: 'move',
        handles: x => (x.toZone == 'hand') && x.card.count('mire') > 0,
        replace: x => ({...x, skip:true})
    }]
}
registerEvent(mire)

const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: energy(1),
    effects: [{
        text: [`Lose all $.`, `Put a charge token on this for each $ lost.`],
        transform: (state, card) => async function(state) {
            const n = state.coin
            state = await setResource('coin', 0)(state)
            state = await charge(card, n)(state)
            return state
        }
    }],
    replacers: [chargeVillage()]
}
registerEvent(commerce)

const reverberate:CardSpec = {
    name: 'Reverberate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), {
        text: [`For each card in play without an echo token,
            create a copy in play with an echo token on it.`],
        transform: state => doAll(
            state.play.filter(c => c.count('echo') == 0).map(echoEffect)
        )
    }],
    triggers: [fragileEcho()]
}
registerEvent(reverberate)

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
buyable(turnpike, 5)

const highway:CardSpec = {
    name: 'Highway',
    effects: [actionsEffect(1), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)],
}
buyable(highway, 6, {replacers: [{
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
    triggers: [{
        text: `Whenever you create a card with the same name
            as a card in the supply with a priority token,
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
registerEvent(prioritize)

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
buyable(composting, 3)

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
buyable(fairyGold, 3, {
    triggers: [startsWithCharge(fairyGold.name, 3)]
})

const pathfinding:CardSpec = {
    name: 'Pathfinding',
    fixedCost: {...free, coin:7, energy:1},
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(
        target => addToken(target, 'pathfinding'),
        `Put a pathfinding token on a card in the supply other than Copper.`,
        state => state.supply.filter(target => target.name != copper.name)
    )],
    triggers: [{
        kind: 'play',
        text: `Whenever you play a card that has the same name as a card in the supply
        with a  pathfinding token on it, +1 action.`,
        handles: (e, state) => nameHasToken(e.card, 'pathfinding', state),
        transform: (e, state, card) => gainActions(1, card)
    }]
}
registerEvent(pathfinding)

/*
const fortune:CardSpec = {
    name: 'Fortune',
    effects: [{
        text: [`Double your $.`],
        transform: (state, card) => gainCoin(state.coin)
    }, {
        text: [`Double your buys.`],
        transform: (state, card) => gainBuys(state.buys)
    }]
}
const fortuneSupply = supplyForCard(fortune, coin(12), {
    onBuy: [trashThis()],
})
const gladiatorName:string = 'Gladiator'
const gladiator:CardSpec = {
    name: gladiatorName,
    relatedCards: [fortuneSupply],
    fixedCost: energy(1),
    effects: [gainCoinEffect(3), targetedEffect(
        target => charge(target, 1),
        `Put a charge token on a card named ${gladiatorName} in the supply.`,
        state => state.supply.filter(s => s.name == gladiatorName)
    )],
}
buyableAnd(gladiator, 3, {
    onBuy: [chargeEffect()],
    triggers: [{
        kind: 'gainCharge',
        text: `Whenever this has 6 or more charge tokens on it,
        trash it and create a ${fortuneSupply.name} in the supply.`,
        handles: (e, state, card) => state.find(card).charge >= 6,
        transform: (e, state, card) => doAll([trash(card), create(fortuneSupply, 'supply')])
    }]
})
*/

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
buyable(fortune, 12, {onBuy: [{text: ['trash it'], transform: (s, c) => trash(c)}]})



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
