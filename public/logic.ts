export const VERSION = "2.1"

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

export function renderCostOrZero(cost:Partial<Cost>): string {
    return renderCost(cost) || '$0'
}

//renders either "1 x" or "n xs" as appropriate
export function num(n:number, x:string) {
    return `${n} ${x}${n == 1 ? '' : 's'}`
}
export function aOrNum(n:number, x:string) {
    return (n == 1) ? a(x) : `${n} ${x}s`
}

//renders either "a" or "an" as appropriate
export function a(s:string): string {
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
export const free:Cost = {coin:0, energy:0, actions:0, buys:0, effects: [], tests: []}

export type ActionKind = 'play' | 'use' | 'buy' | 'activate'

interface Restriction {
    text?: string;
    test: (card:Card, state:State, kind:ActionKind) => boolean;
}

export interface VariableCost {
    calculate: (card:Card, state:State) => Partial<Cost>;
    text: string;
}

export interface Effect {
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

export type Source = Card | 'act'

export function sourceHasName(s:Source, name:string): boolean {
    return s != 'act' && s.name == name
}

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
    play(source:Source): Transform {
        return this.activate('play', source)
    }
    buy(source:Source): Transform {
        return this.activate('buy', source)
    }
    use(source:Source): Transform {
        return this.activate('use', source)
    }
    activate(kind:ActionKind, source:Source) {
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
                        state = await move(card, card.afterPlayDestination())(state);
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

    afterPlayDestination(): 'discard'|'play' {
        return (this.replacers().length > 0 || this.triggers().length > 0 || this.abilityEffects().length > 0) ?
            'play' : 'discard'
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


export type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

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
        /*if (replay.version != VERSION)
            throw new VersionMismatch(replay.version || 'null');*/
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

function createRaw(state:State, spec:CardSpec, zone:ZoneName='discard', tokens?:Map<Token, number>): [State, Card] {
    let id:number; [state, id] = state.makeID()
    const card:Card = new Card(spec, id)
    if (tokens != undefined) {
        for (const [token, n] of tokens) {
            card.tokens.set(token, n)
        }
    }
    state = state.addToZone(card, zone)
    return [state, card]
}

function createRawMulti(state:State, specs:CardSpec[], zone:ZoneName='discard'): State {
    for (const spec of specs) {
        let card; [state, card] = createRaw(state, spec, zone)
    }
    return state
}

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

export function countDistinctNames(xs:Card[]): number {
    return countDistinct(xs.map(c => c.name))
}


// --------------------- Events and triggers

export interface BuyEvent {kind:'buy'; card:Card; source:Source}
export interface AfterBuyEvent {kind:'afterBuy'; card:Card; source:Source, before:State}
export interface PlayEvent {kind:'play'; card:Card; source:Source}
export interface AfterPlayEvent {kind:'afterPlay'; card:Card; source:Source, before:State}
export interface UseEvent {kind:'use'; card:Card; source:Source}
export interface AfterUseEvent {kind:'afterUse'; card:Card; source:Source, before:State}
export interface ActivateEvent {kind:'activate', card:Card, source:Source}
export interface CreateEvent {kind:'create', card:Card, zone:ZoneName}
export interface MoveEvent {kind:'move', fromZone:PlaceName, toZone:PlaceName, card:Card}
export interface DiscardEvent {kind:'discard', cards:Card[]}
export interface CostEvent {kind:'cost', cost:Cost, source:Source}
export interface ResourceEvent {kind:'resource', resource:ResourceName, amount:number, source:Source}
export interface GainChargeEvent {kind:'gainCharge', card:Card, oldCharge:number, newCharge:number, cost:boolean}
export interface RemoveTokensEvent { kind:'removeTokens', card:Card, token:string, removed:number }
export interface AddTokenEvent {kind: 'addToken', card:Card, token:Token, amount:number}
export interface GameStartEvent {kind:'gameStart' }

export type GameEvent = BuyEvent | AfterBuyEvent | PlayEvent | AfterPlayEvent |
    UseEvent | AfterUseEvent | ActivateEvent |
    CreateEvent | MoveEvent | DiscardEvent |
    CostEvent | ResourceEvent |
    GainChargeEvent | RemoveTokensEvent | AddTokenEvent |
    GameStartEvent
export type TypedTrigger = Trigger<BuyEvent> | Trigger<AfterBuyEvent> | Trigger<PlayEvent> | Trigger<AfterPlayEvent> |
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
export interface CostParams {kind:'cost', actionKind: ActionKind, card:Card, cost:Cost}
interface CostIncreaseParams {kind:'costIncrease', actionKind: ActionKind, card:Card, cost:Cost}
export interface MoveParams {kind:'move', card:Card, fromZone:PlaceName, toZone:PlaceName, effects:Transform[], skip:boolean}
interface VictoryParams {kind: 'victory', victory: boolean}
export interface CreateParams {
    kind:'create',
    spec:CardSpec,
    zone:ZoneName|null,
    tokens?:Map<Token,number>,
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
export function tick(card: Card): ((s: State) => State) {
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

export function create(
    spec:CardSpec,
    zone:ZoneName='discard',
    postprocess:(c:Card) =>Transform=()=>noop,
    tokens?:Map<Token, number>
): Transform {
    return async function(state:State) {
        let card; [card, state] = await createAndTrack(spec, zone, tokens)(state)
        if (card != null) state = await postprocess(card)(state)
        return state
    }
}

export function createAndTrack(
    spec:CardSpec,
    zone:ZoneName='discard',
    tokens?:Map<Token, number>
): ((s:State) => Promise<[Card|null, State]>) {
    return async function(state: State): Promise<[Card|null, State]> {
        let params:CreateParams = {kind:'create', spec:spec, zone:zone, effects:[], tokens:tokens}
        params = replace(params, state)
        spec = params.spec
        let card:Card|null = null
        if (params.zone !=  null) {
            [state, card] = createRaw(state, spec, params.zone, params.tokens)
            state = await trigger({kind:'create', card:card, zone:params.zone})(state)
            for (const effect of params.effects) state = await effect(card)(state)
        }
        return [card, state]
    }
}

export function createAndPlay(spec:CardSpec, source:Source): Transform {
    return create(spec, 'void', (c => c.play(source)))
}

export function move(card:Card, toZone:PlaceName, logged:boolean=false): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) return state
        let params:MoveParams = {kind:'move', card:card, fromZone:card.place, toZone:toZone, effects:[], skip:false}
        params = replace(params, state)
        if (!params.skip) {
            toZone = params.toZone
            card = params.card
            state = state.remove(card)
            if (toZone == 'void') {
                if (!logged) state = state.log(`Trashed ${card.name} from ${card.place}`)
            } else {
                if (!logged) state = state.log(`Moved ${card.name} from ${card.place} to ${toZone}`)
            }
            state = state.addToZone(card, toZone)
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

export function moveMany(cards:Card[], toZone:PlaceName, logged:boolean=false): Transform {
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

export function trash(card:Card|null, logged:boolean=false): Transform {
    return (card == null) ? noop : move(card, 'void', logged)
}

export function discard(n:number): Transform {
    return async function(state) {
        let cards:Card[];
        [state, cards] = (state.hand.length <= n) ? [state, state.hand] :
            await multichoice(state, `Choose ${n} cards to discard.`,
                state.hand.map(asChoice), n, n)
        state = await moveMany(cards, 'discard')(state)
        return trigger({kind:'discard', cards:cards})(state)
    }
}

export function discardFromPlay(card:Card): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place != 'play') throw new CostNotPaid("Card not in play.");
        return move(card, 'discard')(state)
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

export function payCost(c:Cost, source:Source): Transform {
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

export function gainResource(resource:ResourceName, amount:number, source:Source) {
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

export function setResource(resource:ResourceName, amount:number, source:Source) {
    return async function(state:State) {
        return gainResource(
            resource,
            amount - state.resources[resource],
            source
        )(state)
    }
}

export function gainActions(n:number, source:Source): Transform {
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

function gainEnergy(n:number, source:Source): Transform {
    return gainResource('energy', n, source)
}

export const DEFAULT_VP_GOAL = 40
export function gainPoints(n:number, source:Source): Transform {
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

export function gainCoins(n:number, source:Source): Transform {
    return gainResource('coin', n, source)
}

export function gainBuys(n:number, source:Source): Transform {
    return gainResource('buys', n, source)
}

export function dischargeCost(c:Card, n:number=1): Cost {
    return {...free,
        effects: [discharge(c, n)],
        tests: [state => state.find(c).charge >= n]
    }
}

export function discardCost(card:Card): Cost {
    return {...free,
        effects: [discardFromPlay(card)],
        tests: [state => state.find(card).place == 'play'],
    }
}

export function fragileEcho(t:Token = 'echo'): Replacer<MoveParams> {
    return {
        text: `Whenever a card with ${a(t)} token would move to your hand or discard,
               trash it instead.`,
        kind: 'move',
        handles: (p, state) => state.find(p.card).count(t) > 0
            && (p.toZone == 'hand' || p.toZone == 'discard'),
        replace: p => ({...p, toZone: 'void'})
    }
}

export function dedupBy<T>(xs:T[], f:(x:T) => any): T[] {
    const result:T[] = []
    for (const x of xs) {
        if (result.every(r => f(r) != f(x))) {
            result.push(x)
        }
    }
    return result
}

export function payAction(c:Card): Transform { return payCost({...free, actions:1}, c) }

export function tickEffect(): Effect {
    return {
        text: [],
        transform: (state, card) => tick(card)
    }
}

export function playTwice(card:Card): Transform {
    return applyToTarget(
        target => doAll([
            target.play(card),
            tick(card),
            target.play(card),
        ]), 'Choose a card to play twice.', s => s.hand
    )
}

export function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction(card), playTwice(card))
    }
}

export function useRefresh(): Effect {
    return targetedEffect(
        (target, c) => target.use(c),
        `Use ${refresh.name}.`,
        state => state.events.filter(c => c.name == refresh.name)
    )
}


export function sum<T>(xs:T[], f:(x:T) => number): number {
    return xs.map(f).reduce((a, b) => a+b)
}

export function countNameTokens(card:Card, token:Token, state:State): number {
    return sum(
        state.supply,
        c => (c.name == card.name) ? c.count(token) : 0
    )
}

export function nameHasToken(card:Card|CardSpec, token:Token, state:State): boolean {
    return state.supply.some(s => s.name == card.name && s.count(token) > 0)
}

export function costPer(increment:Partial<Cost>): VariableCost {
    const extraStr:string = `${renderCost(increment, true)} for each cost token on this.`
    return {
        calculate: function(card:Card, state:State) {
            return multiplyCosts(increment, state.find(card).count('cost'))
        },
        text: extraStr,
    }
}

export function incrementCost(): Effect {
    return {
        text: ['Put a cost token on this.'],
        transform: (s:State, c:Card) => addToken(c, 'cost')
    }
}

function incrementMap<K>(m:Map<K, number>, k:K, n:number): void {
    m.set(k, (m.get(k) || 0) + n)
}

export function startsWithCharge(name:string, n:number):Replacer<CreateParams> {
    return {
        text: `Each ${name} is created with ${aOrNum(n, 'charge token')} on it.`,
        kind: 'create',
        handles: p => p.spec.name == name,
        replace: function(p:CreateParams) {
            const tokens:Map<Token, number> = p.tokens || new Map()
            incrementMap(tokens, 'charge', n)
            return {...p, tokens:tokens}
        }
    }
}

export function literalOptions(xs:string[], keys:Key[]): Option<string>[] {
    return xs.map((x, i) => ({
        render: {kind:'string', string:x},
        hotkeyHint: {kind:'key', val:keys[i]},
        value:x
    }))
}

export function createInPlayEffect(spec:CardSpec, n:number=1) {
    return {
        text: [`Create ${aOrNum(n, spec.name)} in play.`],
        transform: () => repeat(create(spec, 'play'), n)
    }
}

export function reflectTrigger(token:Token): Trigger<AfterPlayEvent> {
    return {
        text: `After playing a card with ${a(token)} token on it
        other than with this, remove ${a(token)} token and play it again.`,
        kind:'afterPlay',
        handles: (e, state, card) => {
            const played:Card = state.find(e.card)
            return played.count(token) > 0 && !sourceHasName(e.source, card.name)
        },
        transform: (e, s, card) => doAll([
            removeToken(e.card, token),
            e.card.play(card),
        ]),
    }
}


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

export function payToDo(cost:Transform, effect:Transform, fallback:Transform|null=null): Transform {
    return doOrAbort(async function(state) {
        state = await cost(state)
        return effect(state)
    }, fallback)
}

export function doAll(effects:Transform[]): Transform {
    return async function(state) {
        for (let i = 0; i < effects.length; i++) {
            state = await effects[i](state)
        }
        return state
    }
}

export function repeat(t:Transform, n:number): Transform {
    return doAll(Array(n).fill(t))
}


export function noop(state:State): State {
    return state
}

// -------------------- Utilities for manipulating costs

export function addCosts(a:Cost, b:Partial<Cost>): Cost {
    return {
        coin:a.coin + (b.coin || 0),
        energy:a.energy+(b.energy || 0),
        actions:a.actions+(b.actions || 0),
        buys:a.buys + (b.buys || 0),
        effects:a.effects.concat(b.effects || []),
        tests:a.tests.concat(b.tests || []),
    }
}

export function multiplyCosts(c:Partial<Cost>, n:number): Partial<Cost> {
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

export function subtractCost(c:Cost, reduction:Partial<Cost>): Cost {
    return {
        coin:Math.max(0, c.coin - (reduction.coin || 0)),
        energy:Math.max(0, c.energy - (reduction.energy || 0)),
        actions:Math.max(0, c.actions - (reduction.actions || 0)),
        buys:Math.max(0, c.buys - (reduction.buys || 0)),
        effects:c.effects,
        tests:c.tests
    }
}

export function eq(a:Cost, b:Cost): boolean {
    return a.coin == b.coin && a.energy == b.energy && a.actions == b.actions
}


export function leq(cost1:Cost, cost2:Cost) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy
}


// ----------------- Transforms for charge and tokens

export type Token = 'charge' | 'cost' | 'mirror' | 'duplicate' | 'twin' | 'synergy' |
    'shelter' | 'echo' | 'decay' | 'burden' | 'pathfinding' | 'neglect' |
    'reuse' | 'polish' | 'priority' | 'parallelize' | 'art' | 'reduce' |
    'mire' | 'onslaught' | 'accelerate' | 'reflect' | 'brigade' | 'bulk' |
    'pillage' | 'bargain' | 'splay' | 'crown' | 'ferry' | 'ideal' | 'reconfigure' |
    'logistics'

export function discharge(card:Card, n:number): Transform {
    return charge(card, -n, true)
}

export function uncharge(card:Card): Transform {
    return async function(state:State): Promise<State> {
        card = state.find(card)
        if (card.place != null) state = await charge(card, -card.charge)(state)
        return state
    }
}

export function charge(card:Card, n:number=1, cost:boolean=false): Transform {
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

export function addToken(card:Card, token:Token, n:number=1): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) return state
        const newCard = card.addTokens(token, n)
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, n)
        return trigger({kind:'addToken', card:newCard, token:token, amount:n})(state)
    }
}

export function removeToken(card:Card, token:Token, n:number|'all'=1, isCost:boolean=false): Transform {
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

export type Key = string

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

export async function choice<T>(
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

export async function multichoice<T>(
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
        if (chosen.length < min && chosen.length == options.length) break
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

export function range(n:number):number[] {
    const result:number[] = []
    for (let i = 0; i < n; i++) result.push(i)
    return result
}

export function chooseNatural(n:number):Option<number>[] {
    return range(n).map(x => ({
        render:{kind:'string', string:String(x)},
        value:x,
        hotkeyHint:{kind:'number', val:x}
    }))
}

export function asChoice(x:Card): Option<Card> {
    return {render:{kind:'card', card:x}, value:x}
}

export function asNumberedChoices(xs:Card[]): Option<Card>[] {
    return xs.map((card, i) => ({
        render:{kind:'card', card:card},
        value:card,
        hotkeyHint:{kind:'number', val:i}
    }))
}

export function allowNull<T>(options: Option<T>[], message:string="None"): Option<T|null>[] {
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
    return payToDo(card.payCost(kind), card.activate(kind, 'act'))(state)
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

export type ExpansionName = 'base' | 'expansion' | 'absurd' | 'test'
const expansionNames:ExpansionName[] = ['base', 'expansion', 'absurd', 'test']
type SetName = 'core' | ExpansionName

function emptySet(): SetSpec {
    return {'cards': [], 'events': []}
}

export const sets = {
    'core': emptySet(),
    'base': emptySet(),
    'expansion': emptySet(),
    'absurd': emptySet(),
    'test': emptySet(),
}

export function makeKingdom(spec:GameSpec): Kingdom {
    switch (spec.kind) {
        case 'test':
            return {
                cards:allCards(),
                events:allEvents().concat(cheats),
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
                for (const card of extractList(cards, allCards())) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else cardSpecs.push(card)
                }
            }
            if (events !== null) {
                for (const card of extractList(events, allEvents())) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else eventSpecs.push(card)
                }
            }
            return {kind:kind, cards:cardSpecs, events:eventSpecs}
        case 'require':
            return {
                kind:kind, randomizer: {seed:seed, expansions:expansions},
                cards: (cards === null) ? [] : extractList(cards, allCards()),
                events: (events === null) ? [] : extractList(events, allEvents()),
            }
        case 'pickR':
            return {kind:kind, randomizer: {seed:seed, expansions:expansions},
                    cards:(cards === null) ? [] : extractList(cards, allCards()),
                    events:(events === null) ? [] : extractList(events, allEvents())}
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

export function createEffect(spec:CardSpec, zone:ZoneName='discard', n:number=1): Effect {
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
export function supplyForCard(
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
        staticTriggers: (card.staticTriggers || []).concat(triggers),
        staticReplacers: (card.staticReplacers || []).concat(extra.replacers || []),
    }
}
export function energy(n:number):Cost {
    return {...free, energy:n}
}
export function coin(n:number):Cost {
    return {...free, coin:n}
}
export function trashThis():Effect {
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

//
//
// ------ CORE ------
//

export function sortHand(state:State): State {
    return state.sortZone('hand')
}

async function ploughTransform(state:State): Promise<State> {
    return doAll([
        moveMany(state.discard, 'hand'),
        moveMany(state.play, 'hand'),
        sortHand,
    ])(state)
}


export function ploughEffect(): Effect {
    return {
        text: ['Put your discard and play into your hand'],
        transform: () => ploughTransform
    }
}

export function refreshEffect(n:number, doRecycle:boolean=true): Effect {
    let text:string[] = ['Lose all $, actions, and buys.']
    if (doRecycle) text.push('Put your discard and play into your hand.');
    text.push(`+${num(n, 'action')}, +1 buy.`)
    return {
        text: text,
        transform: (state, card) => async function(state) {
            state = await setResource('coin', 0, card)(state)
            state = await setResource('actions', 0, card)(state)
            state = await setResource('buys', 0, card)(state)
            if (doRecycle) state = await ploughTransform(state);
            state = await gainActions(n, card)(state)
            state = await gainBuys(1, card)(state)
            return state
        }
    }
}

export function recycleEffect(): Effect {
    return {
        text: ['Put your discard into your hand.'],
        transform: state => doAll([moveMany(state.discard, 'hand'), sortHand])
    }
}

export function workshopEffect(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing up to $${n}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n))
        )
    )
}

export function coinsEffect(n:number): Effect {
    return {
        text: [`+$${n}.`],
        transform: (s:State, c:Card) => gainCoins(n, c),
    }
}
export function pointsEffect(n:number): Effect {
    return {
        text: [`+${n} vp.`],
        transform: (s:State, c:Card) => gainPoints(n, c),
    }
}
export function actionsEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'action')}.`],
        transform: (s:State, c:Card) => gainActions(n, c),
    }
}
export function buysEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'buy')}.`],
        transform: (state, card) => gainBuys(n, card),
    }
}
export function buyEffect() { return buysEffect(1) }

export function chargeEffect(n:number=1): Effect {
    return {
        text: [`Put ${aOrNum(n, 'charge token')} on this.`],
        transform: (s, card) => charge(card, n)
    }
}

export const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
}
sets.core.events.push(refresh)

export const copper:CardSpec = {name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
}
sets.core.cards.push(copper)

export const silver:CardSpec = {name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
}
sets.core.cards.push(silver)

export const gold:CardSpec = {name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
}
sets.core.cards.push(gold)

export const estate:CardSpec = {name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}
sets.core.cards.push(estate)

export const duchy:CardSpec = {name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
}
sets.core.cards.push(duchy)

export const province:CardSpec = {name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
}
sets.core.cards.push(province)

//
//
// ------ CORE CREATED CARDS ------
//

export function trashOnLeavePlay():Replacer<MoveParams> {
    return {
        text: `Whenever this would leave play, trash it.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play',
        replace: x => ({...x, toZone:'void'})
    }
}

export function stayInPlay():Replacer<MoveParams> {
    return {
        text: `This doesn't move to your hand.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play' && x.toZone == 'hand',
        replace: x => ({...x, skip: true})
    }
}


function villageReplacer(): Replacer<CostParams> {
    return costReduceNext('play', {energy:1})
}

export const villager:CardSpec = {
    name: 'Villager',
    replacers: [{
        text: `Cards cost @ less to play. Whenever this reduces a cost, trash it.`,
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

export function playReplacer(
    text:string,
    condition: (p: CreateParams, s:State, c:Card) => boolean,
    cost: (p:CreateParams, s:State, c:Card) => Transform
): Replacer<CreateParams> {
    return {
        kind: 'create',
        text: text,
        handles: (p, s, c) => p.zone == 'discard' && condition(p, s, c),
        replace: (p, s, c) => ({...p, zone: 'void', effects: p.effects.concat([
            () => cost(p, s, c),
            t => async function(state) {
                t = state.find(t)
                if (t.place == 'void') {
                    state = await t.play(c)(state)
                }
                return state
            }
        ])})
    }
}


export const fair:CardSpec = {
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


//
// ----- MIXINS -----
//


function playAgain(target:Card, source:Source): Transform {
    return async function(state:State) {
        target = state.find(target)
        if (target.place == 'discard') state = await target.play(source)(state)
        return state
    }
}

function costReduceDescriptor(kind:ActionKind, reduction:Partial<Cost>, nonzero:boolean):string {
    const d:string = renderCost(reduction, true)
    const s:string = nonzero ? ' but not zero' : ''
    switch (kind) {
        case 'play': return `Cards cost ${d} less to play${s}.`
        case 'buy': return `Cards cost ${d} less to buy${s}.`
        case 'use': return `Events cost ${d} less to use${s}.`
        case 'activate': return `Abilities cost ${d} less to use${s}.`
        default: return assertNever(kind)
    }
}

export function reducedCost(cost:Cost, reduction:Partial<Cost>, nonzero:boolean=false) {
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

export function costReduce(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false,
): Replacer<CostParams> {
    return {
        text: costReduceDescriptor(kind, reduction, nonzero),
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            return {...x, cost:newCost}
        }
    }
}

export function costReduceNext(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false
): Replacer<CostParams> {
    return {
        text: costReduceDescriptor(kind, reduction, nonzero) +
            ' Whenever this reduces a cost, discard it',
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            if (!eq(newCost, x.cost)) newCost.effects = newCost.effects.concat([move(card, 'discard')])
            return {...x, cost:newCost}
        }
    }
}

export function applyToTarget(
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
export function targetedEffect(
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

export function allCards(): CardSpec[] {
  return cardsFrom('cards', expansionNames)
}
export function allEvents(): CardSpec[] {
  return cardsFrom('events', expansionNames)
}
