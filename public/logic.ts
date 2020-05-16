export const VERSION = "0.1.1"

// ----------------------------- Formatting

export function renderCost(cost:Cost): string {
    const parts:string[] = []
    for (const name of allCostResources) {
        if (cost[name] > 0) parts.push(renderResource(name, cost[name]))
    }
    return parts.join(' ')
}

function renderResource(resource:ResourceName, amount:number): string {
    if (amount < 0) return '-' + renderResource(resource, -amount)
    switch(resource) {
        case 'coin': return `$${amount}`
        case 'energy': return repeatSymbol('@', amount)
        case 'points': return `${amount} vp`
        case 'action': return (amount > 3) ? `#${amount}` : repeatSymbol('#', amount)
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
    calculatedCost?: CalculatedCost;
    relatedCards?: CardSpec[];
    effect?: (card:Card) => Effect;
    triggers?: (card:Card) => TypedTrigger[];
    abilities?: (card:Card) => Ability[];
    replacers?: (card:Card) => TypedReplacer[];
}

export interface Cost {
    coin: number;
    energy: number;
    action: number;
}
const free:Cost = {coin:0, energy:0, action:0}

export interface CalculatedCost {
    calculate: (card:Card, state:State) => Cost;
    text: string;
}

interface Effect {
    text: string;
    toZone?: ZoneName | null;
    toLoc?: InsertLocation;
    effect: Transform;
}

export interface Trigger <T extends GameEvent = any> {
    text: string;
    kind: T['kind'];
    handles: (e:T, s:State) => boolean;
    effect: (e:T) => Transform;
}

export interface Replacer <T extends Params = any> {
    text: string;
    kind: T['kind'];
    handles: (p:T, s:State) => boolean;
    replace: (p:T, s:State) => T;
}

export interface Ability {
    text: string;
    cost: Transform;
    effect: Transform;
}

interface Source {
    id?: number;
    name: string;
}
const unk:Source = {name:'?'} //Used as a default when we don't know the source

function read<T>(x:any, k:string, fallback:T) {
    return (x[k] == undefined) ? fallback : x[k]
}

interface CardUpdate {
    ticks?: number[];
    place?: PlaceName;
    tokens?: Map<string, number>;
    zoneIndex?: number;
}

//TODO: should Token be a type? can avoid token name typos...
//(could also have token rendering hints...)
export class Card {
    readonly name: string;
    readonly charge: number;
    constructor(
        public readonly spec:CardSpec,
        public readonly id:number,
        public readonly ticks: number[] = [0],
        public readonly tokens: Map<string, number> = new Map(),
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
            (newValues.ticks == undefined) ? this.ticks : newValues.ticks,
            (newValues.tokens == undefined) ? this.tokens : newValues.tokens,
            (newValues.place == undefined) ? this.place : newValues.place,
            (newValues.zoneIndex == undefined) ? this.zoneIndex : newValues.zoneIndex,
        )
    }
    setTokens(token:string, n:number): Card {
        const tokens: Map<string, number> = new Map(this.tokens)
        tokens.set(token, n)
        return this.update({tokens:tokens})
    }
    addTokens(token:string, n:number): Card {
        return this.setTokens(token, this.count(token) + n)
    }
    count(token:string): number {
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
    baseCost(state:State): Cost {
        if (this.spec.fixedCost != undefined)
            return this.spec.fixedCost
        else if (this.spec.calculatedCost != undefined)
            return this.spec.calculatedCost.calculate(this, state)
        else
            return free
    }
    // the cost after replacement effects
    cost(state:State): Cost {
        const card:Card = this
        const initialCost:CostParams = {kind:'cost', card:card, cost:card.baseCost(state)}
        const newCost:Params = replace(initialCost, state)
        return newCost.cost
    }
    // the transformation that actually pays the cost
    payCost(kind:'play' | 'buy'): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            state = state.log(`Paying for ${card.name}`)
            let cost:Cost = card.cost(state)
            if (kind == 'play') cost = addCosts(cost, {...free, action:1})
            return withTracking(payCost(cost, card), {kind:'effect', card:card})(state)
        }
    }
    effect(): Effect {
        if (this.spec.effect == undefined) return {text: '', effect: noop}
        return this.spec.effect(this)
    }
    buy(source:Source=unk): Transform {
        let card:Card = this
        return async function(state:State): Promise<State> {
            card = state.find(card)
            if (card.place == null) return state
            state = state.log(`Buying ${card.name}`)
            state = await withTracking(doAll([
                trigger({kind:'buy', card:card, source:source}),
                card.effect().effect,
             ]), {kind:'effect', card:card})(state)
             state = await trigger({kind:'afterBuy', before:card, after:state.find(card), source:source})(state)
            return state
        }
    }
    play(source:Source=unk): Transform {
        const effect:Effect = this.effect()
        let card:Card = this
        return async function(state:State):Promise<State> {
            card = state.find(card)
            if (card.place == null) return state
            state = await move(card, 'resolving', 'end', true)(state)
            state = state.log(`Playing ${card.name}`)
            state = await withTracking(async function(state) {
                state = await trigger({kind:'play', card:card, source:source})(state)
                state = await effect.effect(state)
                return state
            }, {kind:'none', card:card})(state)
            const toZone:ZoneName|null = (effect['toZone'] == undefined) ? 'discard' : effect['toZone']
            const toLoc:InsertLocation = effect['toLoc'] || 'end'
            state = await move(card, toZone, toLoc, toZone == 'discard')(state)
            state = await trigger({kind:'afterPlay', before:card, after:state.find(card), source:source})(state)
            return state
        }
    }
    triggers(): TypedTrigger[] {
        if (this.spec.triggers == undefined) return []
        return this.spec.triggers(this)
    }
    abilities(): Ability[] {
        if (this.spec.abilities == undefined) return []
        return this.spec.abilities(this)
    }
    replacers(): TypedReplacer[] {
        if (this.spec.replacers == undefined) return []
        return this.spec.replacers(this)
    }
    relatedCards(): CardSpec[] {
        return this.spec.relatedCards || []
    }
}

// ------------------------- State

export interface GameSpec {
    seed: string;
    kingdom: string|null;
    testing?: boolean;
}

type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

type ZoneName = 'supply' | 'hand' | 'discard' | 'play' | 'aside'
type PlaceName = ZoneName | null | 'resolving'

type Zone = Card[]

type Resolving = (Card|Shadow)[]

export type Replayable = number[]

interface Resources {
    coin:number;
    energy:number;
    action:number;
    points:number
}

type CostResourceName = 'coin' | 'energy' | 'action'
const allCostResources:CostResourceName[] = ['coin', 'energy', 'action']
type ResourceName = CostResourceName | 'points'
const allResources:ResourceName[] = (allCostResources as ResourceName[]).concat(['points'])

interface StateUpdate {
    resources?:Resources;
    ui?:UI;
    zones?:Map<ZoneName,Zone>;
    resolving?:Resolving;
    history?:Replayable[];
    future?:Replayable[];
    logs?:string[];
    logIndent?:number;
    checkpoint?:State;
    nextID?:number;
}

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
        options:Option<T>[]
    ): Promise<number>;
    multichoice<T>(
        s:State,
        prompt:string,
        options:Option<T>[],
        validator: ((xs:T[]) => boolean)
    ): Promise<number[]>;
    victory(s:State): Promise<void>;
}

const noUI:UI = {
    async choice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
    ): Promise<number> {
        throw new ReplayEnded(state)
    },
    async multichoice<T>(
        state: State,
        choicePrompt: string,
        options: Option<T>[],
        validator:((xs:T[]) => boolean) = (xs => true)
    ): Promise<number[]> {
        throw new ReplayEnded(state)
    },
    async victory(state:State): Promise<void> {
        throw new Victory(state)
    }
}

export class State {
    public readonly coin:number;
    public readonly energy:number;
    public readonly points:number;
    public readonly action:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly aside:Zone;
    constructor(
        public readonly spec: GameSpec = {seed:'', kingdom:null},
        public readonly ui: UI = noUI,
        private readonly resources:Resources = {coin:0, energy:0, points:0, action:0},
        private readonly zones:Map<ZoneName,Zone> = new Map(),
        public readonly resolving:Resolving = [],
        private readonly nextID:number = 0,
        private readonly history: Replayable[] = [],
        public readonly future: Replayable[] = [],
        private readonly checkpoint: State|null = null,
        public readonly logs: string[] = [],
        private readonly logIndent: number = 0,
    ) {
        this.coin = resources.coin
        this.energy = resources.energy
        this.points = resources.points
        this.action = resources.action

        this.supply = zones.get('supply') || []
        this.hand = zones.get('hand') || []
        this.discard= zones.get('discard') || []
        this.play = zones.get('play') || []
        this.aside = zones.get('aside') || []
    }
    private update(stateUpdate:StateUpdate) {
        return new State(
            this.spec,
            read(stateUpdate, 'ui', this.ui),
            read(stateUpdate, 'resources', this.resources),
            read(stateUpdate, 'zones', this.zones),
            read(stateUpdate, 'resolving', this.resolving),
            read(stateUpdate, 'nextID', this.nextID),
            read(stateUpdate, 'history', this.history),
            read(stateUpdate, 'future', this.future),
            read(stateUpdate, 'checkpoint', this.checkpoint),
            read(stateUpdate, 'logs', this.logs),
            read(stateUpdate, 'logIndent', this.logIndent),
        )
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
    addToZone(card:Card, zone:ZoneName|'resolving', loc:InsertLocation='end'): State {
        if (zone == 'resolving') return this.addResolving(card)
        const newZones:Map<ZoneName,Zone> = new Map(this.zones)
        const currentZone = this[zone]
        card = card.update({zoneIndex: firstFreeIndex(currentZone), place:zone})
        newZones.set(zone,  insertAt(currentZone, card, loc))
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
    find(card:Card): Card {
        for (let [name, zone] of this.zones) {
            const matches:Card[] = zone.filter(c => c.id == card.id)
            if (matches.length > 0) return matches[0]
        }
        const name = 'resolving', zone = this.resolving;
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
    addHistory(record:Replayable): State {
        return this.update({history: this.history.concat([record])})
    }
    log(msg:string): State {
        return this.update({logs: this.logs.concat([indent(this.logIndent, msg)])})
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
    // To maintain this invariant, we need to record history every energy there is a change
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
        return (last==null) ? null : last.update({future:this.history.concat(this.future)})
    }
    //TODO: serialize the full history
    //TODO: make a version of state that raises an exception if player choice is required
    //TODO: write a routine that creates dummy state and a proposed score, and tells if it's valid
    serializeHistory(): string {
        let state:State = this;
        let prev:State|null = state;
        while (prev != null) {
            state = prev;
            prev = state.backup()
        }
        return [VERSION].concat(state.future.map(xs => xs.map(x => `${x}`).join(','))).join(';')
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
    static fromHistory(s:string, spec:GameSpec): State {
        let historyVersion:string|null;
        let pieces:string[];
        [historyVersion, pieces] = shiftFirst(s.split(';'))
        if (VERSION != historyVersion) {
            throw new VersionMismatch(historyVersion || 'null')
        }
        function renderPiece(piece:string): number[] {
            if (piece == '') return []
            return piece.split(',').map(x => parseInt(x))
        }
        const future = pieces.map(renderPiece)
        console.log(future.slice(16))
        return initialState(spec).update({future: future})
    }
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

type InsertLocation = 'bottom' | 'top' | 'start' | 'end'

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

function insertAt(zone:Zone, card:Card, loc:InsertLocation): Zone {
    switch(loc) {
        case 'start':
        case 'top':
            return [card].concat(zone)
        case 'bottom':
        case 'end':
            return zone.concat([card])
        default: return assertNever(loc)
    }
}

function createRaw(state:State, spec:CardSpec, zone:ZoneName='discard', loc:InsertLocation='bottom'): [State, Card] {
    let id:number; [state, id] = state.makeID()
    const card:Card = new Card(spec, id)
    state = state.addToZone(card, zone, loc)
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
interface AfterBuyEvent {kind:'afterBuy'; before:Card; after:Card|null; source:Source}
interface PlayEvent {kind:'play'; card:Card; source:Source}
interface AfterPlayEvent {kind:'afterPlay'; before:Card; after:Card|null; source:Source}
interface CreateEvent {kind:'create', card:Card, zone:ZoneName}
interface MoveEvent {kind:'move', fromZone:PlaceName, toZone:PlaceName, loc:InsertLocation, card:Card}
interface DiscardEvent {kind:'discard', cards:Card[]}
interface DrawEvent {kind:'draw', cards:Card[], drawn:number, triedToDraw:number, source:Source}
interface CostEvent {kind:'cost', cost:Cost, source:Source}
interface ResourceEvent {kind:'resource', resource:ResourceName, amount:number, source:Source}
interface GainChargeEvent {kind:'gainCharge', card:Card, oldCharge:number, newCharge:number, cost:boolean}
interface RemoveTokensEvent { kind:'removeTokens', card:Card, token:string, removed:number }
interface AddTokenEvent {kind: 'addToken', card:Card, token:string}
interface GameStartEvent {kind:'gameStart' }

type GameEvent = BuyEvent | AfterBuyEvent | PlayEvent | AfterPlayEvent |
    CreateEvent | MoveEvent | DrawEvent | DiscardEvent |
    CostEvent | ResourceEvent |
    GainChargeEvent | RemoveTokensEvent | AddTokenEvent |
    GameStartEvent
type TypedTrigger = Trigger<BuyEvent> | Trigger<AfterBuyEvent> | Trigger<PlayEvent> | Trigger<AfterPlayEvent> |
    Trigger<CreateEvent> | Trigger<MoveEvent> | Trigger<DrawEvent> | Trigger<DiscardEvent> |
    Trigger<CostEvent> | Trigger<ResourceEvent> |
    Trigger<GainChargeEvent> | Trigger<RemoveTokensEvent> | Trigger<AddTokenEvent> |
    Trigger<GameStartEvent>

//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger<T extends GameEvent>(e:T): Transform {
    return async function(state:State): Promise<State> {
        const initialState = state;
        for (const card of state.supply.concat(state.play)) {
            for (const rawtrigger of card.triggers()) {
                if (rawtrigger.kind == e.kind) {
                    const trigger:Trigger<T> = ((rawtrigger as unknown) as Trigger<T>)
                    if (trigger.handles(e, initialState) && trigger.handles(e, state)) {
                        state = state.log(`Triggering ${card}`)
                        state = await withTracking(
                            trigger.effect(e),
                            {kind:'trigger', trigger:trigger, card:card}
                        )(state)
                    }
                }
            }
        }
        return state
    }
}

// ----------------------- Params and replacement

interface GainPointsParams {kind:'gainPoints', points:number, effects:Transform[], source:Source}
interface CostParams {kind:'cost', card:Card, cost:Cost}
interface DrawParams {kind:'draw', draw:number, source:Source, effects:Transform[]}
interface MoveParams {kind:'move', card:Card, fromZone:PlaceName, toZone:PlaceName, effects:Transform[], skip:boolean}

type Params = GainPointsParams | CostParams | DrawParams | MoveParams
type TypedReplacer = Replacer<GainPointsParams> | Replacer<CostParams> | Replacer<DrawParams> |
    Replacer<MoveParams>

//TODO: this should maybe be async and return a new state?
//(e.g. the "put it into your hand" should maybe be replacement effects)
//x is an event that is about to happen
//each card in play or supply can change properties of x
function replace<T extends Params>(x: T, state: State): T {
    var replacers:TypedReplacer[] = state.supply.concat(state.play).map(x => x.replacers()).flat()
    for (const rawreplacer of replacers) {
        if (rawreplacer.kind == x.kind) {
            const replacer = ((rawreplacer as unknown) as Replacer<T>)
            if (replacer.handles(x, state)) {
                x = replacer.replace(x, state)
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
    card:Card;
}
interface ShadowAbilitySpec {
    kind:'ability';
    card:Card;
    ability:Ability;
}
interface ShadowTriggerSpec {
    kind:'trigger';
    card:Card;
    trigger:Trigger;
}
interface ShadowAbilityChoiceSpec {
    kind:'abilities';
    card:Card
}
interface NoShadowSpec {
    kind:'none',
    card:Card
}
type ShadowSpec = ShadowEffectSpec | ShadowAbilitySpec |
    ShadowTriggerSpec | ShadowAbilityChoiceSpec | ShadowCostSpec
type TrackingSpec = ShadowSpec | NoShadowSpec

export class Shadow {
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

function create(spec:CardSpec, zone:ZoneName='discard', loc:InsertLocation='bottom'): Transform {
    return async function(state: State): Promise<State> {
        let card:Card; [state, card] = createRaw(state, spec, zone, loc)
        state = state.log(`Created ${a(card.name)} in ${zone}`)
        return trigger({kind:'create', card:card, zone:zone})(state)
    }
}

function move(card:Card, toZone:PlaceName, loc:InsertLocation='end', logged:boolean=false): Transform {
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
                state = state.addToZone(card, toZone, loc)
                if (!logged) state = state.log(`Moved ${card.name} from ${card.place} to ${toZone}`)
            }
            state = await trigger({kind:'move', fromZone:card.place, toZone:toZone, loc:loc, card:card})(state)
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

function moveMany(cards:Card[], toZone:PlaceName, loc:InsertLocation='end', logged:boolean=false): Transform {
    return async function(state) {
        state = await doAll(cards.map(card => move(card, toZone, loc, true)))(state)
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

function moveWholeZone(fromZone:ZoneName, toZone:PlaceName, loc:InsertLocation='end'): Transform {
    return async function(state) {
        return moveMany(state[fromZone], toZone, loc)(state)
    }
}

function trash(card:Card|null, logged:boolean=false): Transform {
    return (card == null) ? noop : move(card, null, 'end', logged)
}

function discard(n:number): Transform {
    return async function(state) {
        let cards:Card[];
        [state, cards] = (state.hand.length <= n) ? [state, state.hand] :
            await multichoice(state, `Choose ${n} cards to discard.`,
                state.hand.map(asChoice),
                (xs => xs.length == n))
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
        if (state.action < c.action) throw new CostNotPaid("Not enough action")
        state = state.setResources({
            coin:state.coin - c.coin,
            action:state.action - c.action,
            energy:state.energy + c.energy,
            points:state.points
        })
        return trigger({kind:'cost', cost:c, source:source})(state)
    }
}

function gainResource(resource:ResourceName, amount:number, source:Source=unk) {
    return async function(state:State): Promise<State> {
        if (amount == 0) return state
        const newResources =  {coin:state.coin, energy:state.energy, points:state.points, action:state.action}
        newResources[resource] = newResources[resource] + amount
        state = state.setResources(newResources)
        state = state.log(amount > 0 ? 
            `Gained ${renderResource(resource, amount)}` : 
            `Lost ${renderResource(resource, -amount)}`)
        return trigger({kind:'resource', resource:resource, amount:amount, source:source})(state)
    }
}

function setCoin(n:number, source:Source=unk): Transform {
    return async function(state:State) {
        return gainResource('coin', -state.coin, source)(state)
    }
}

export class Victory extends Error {
    constructor(public state:State) {
        super('Victory')
        Object.setPrototypeOf(this, Victory.prototype)
    }
}

function gainEnergy(n:number, source:Source=unk): Transform {
    return gainResource('energy', n, source)
}

function gainPoints(n:number, source:Source=unk): Transform {
    return async function(state) {
        state = await gainResource('points', n, source)(state)
        if (state.points >= 50) throw new Victory(state)
        return state
    }
}

function gainCoin(n:number, source:Source=unk): Transform {
    return gainResource('coin', n, source)
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


// ----------------- Transforms for charge and tokens

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

function logTokenChange(state:State, card:Card, token:string, n:number): State {
    return logChange(state, `${token} token`, n,
        ['Added ', ` to ${card.name}`],
        ['Removed ', ` from ${card.name}`])
}

function addToken(card:Card, token:string): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place == null) return state
        const newCard = card.addTokens(token, 1)
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, 1)
        return trigger({kind:'addToken', card:newCard, token:token})(state)
    }
}

function removeTokens(card:Card, token:string): Transform {
    return async function(state)  {
        card = state.find(card)
        if (card.place == null) return state
        const removed: number = card.count(token)
        const newCard = card.setTokens(token, 0)
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, -removed)
        return trigger({kind:'removeTokens', card:newCard, token:token, removed:removed})(state)
    }
}
function removeOneToken(card:Card, token:string): Transform {
    return async function(state) {
        let removed:number = 0
        card = state.find(card)
        if (card.place == null) return state
        if (card.count(token) == 0) return state
        const newCard:Card = card.addTokens(token, -1)
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

function randomChoices<T>(xs:T[], n:number, seed?:number): T[] {
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

export type OptionRender = ID | string

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

async function doOrReplay(
    state: State,
    f: () => Promise<Replayable>,
): Promise<[State, Replayable]> {
    let record:Replayable | null; [state, record] = state.shiftFuture()
    const x: Replayable = (record == null) ? await f() : record
    return [state.addHistory(x), x]
}


async function multichoice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    validator:(xs:T[]) => boolean = (xs => true),
    automateTrivial:boolean=true,
): Promise<[State, T[]]> {
    if (automateTrivial && options.length == 0) return [state, []]
    else {
        let indices:number[]; [state, indices] = await doOrReplay(
            state,
            () => state.ui.multichoice(state, prompt, options, validator),
        )
        if (indices.some(x => x >= options.length))
            throw new HistoryMismatch(indices, state)
        return [state, indices.map(i => options[i].value)]
    }
}

export class HistoryMismatch extends Error {
    constructor(public indices:Replayable, public state:State) {
        super('HistoryMismatch')
        Object.setPrototypeOf(this, HistoryMismatch.prototype)
    }
}

export class Undo extends Error {
    constructor(public state:State) {
        super('Undo')
        Object.setPrototypeOf(this, Undo.prototype)
    }
}

async function choice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    automateTrivial:boolean=true,
): Promise<[State, T|null]> {
    let index:number;
    if (options.length == 0) return [state, null]
    else if (automateTrivial && options.length == 1) return [state, options[0].value]
    else {
        let indices:number[]; [state, indices] = await doOrReplay(
            state,
            async function() {const x = await state.ui.choice(state, prompt, options); return [x]},
        )
        if (indices.length != 1 || indices[0] >= options.length)
            throw new HistoryMismatch(indices, state)
        return [state, options[indices[0]].value]
    }
}

async function multichoiceIfNeeded<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    n:number,
    upto:boolean,
): Promise<[State, T[]]> {
    if (n == 0) return [state, []]
    else if (n == 1) {
        let x:T|null; [state, x] = await choice(state, prompt, upto ? allowNull(options) : options)
        return (x == null) ? [state, []] : [state, [x]]
    } else {
        return multichoice(state, prompt, options, xs => (upto ? xs.length <= n : xs.length == n))
    }
}

const yesOrNo:Option<boolean>[] = [
    {render:'Yes', value:true, hotkeyHint:{kind:'boolean', val:true}},
    {render:'No', value:false, hotkeyHint:{kind:'boolean', val:false}}
]

function range(n:number):number[] {
    const result:number[] = []
    for (let i = 0; i < n; i++) result.push(i)
    return result
}

function chooseNatural(n:number):Option<number>[] {
    return range(n).map(x => ({render:String(x), value:x, hotkeyHint:{kind:'number', val:x}}))
}

function asChoice(x:Card): Option<Card> {
    return {render:x.id, value:x}
}

function asNumberedChoices(xs:Card[]): Option<Card>[] {
    return xs.map((card, i) => (
        {render:card.id, value:card, hotkeyHint:{kind:'number', val:i}}
    ))
}

function allowNull<T>(options: Option<T>[], message:string="None"): Option<T|null>[] {
    const newOptions:Option<T|null>[] = options.slice()
    newOptions.push({render:message, value:null, hotkeyHint:{kind:'none'}})
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
            return state
        }
    }
}

async function mainLoop(state: State): Promise<State> {
    state = state.setCheckpoint()
    try {
        state = await act(state)
        return state
    } catch (error) {
        if (error instanceof Undo) {
            return undo(error.state)
        } else if (error instanceof Victory) {
            state = error.state
            await state.ui.victory(state)
            return undo(state)
        } else {
            throw error
        }
    }
}

export async function verifyScore(seed:string, history:string, score:number): Promise<[boolean, string]> {
    try {
        await playGame(State.fromHistory(history, {seed:seed, kingdom:null}))
        console.log("Uh oh!!!")
        return [true, ""] //unreachable
    } catch(e) {
        if (e instanceof Victory) {
            if (e.state.energy == score)
                return [true, ""]
            else
                return [false, `Computed score was ${e.state.energy}`]
        } else if (e instanceof HistoryMismatch) {
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

async function act(state:State): Promise<State> {
    let card:Card|null;
    [state, card] = await actChoice(state)
    if (card == null) throw new Error('No valid options.')
    const newCard = state.find(card)
    switch (newCard.place) {
        case 'play':
            return useCard(card)(state)
        case 'hand':
            return tryToPlay(card)(state)
        case 'supply':
            return tryToBuy(card)(state)
        case 'aside':
        case 'discard':
        case 'resolving':
        case null:
            throw new Error(`Card can't be in zone ${newCard.place}`)
        default: assertNever(newCard.place)
    }
}

function canPay(cost:Cost, state:State) {
    return (cost.coin <= state.coin && cost.action <= state.action)
}

function addCosts(a:Cost, b:Cost) {
    return {coin:a.coin + b.coin, energy:a.energy+b.energy, action:a.action+b.action}
}

function canAffordIn(state:State, extra:Cost=free): (c:Card) => boolean {
    return x => canPay(addCosts(x.cost(state), extra), state)
}

function actChoice(state:State): Promise<[State, Card|null]> {
    const validHand:Card[] = state.hand.filter(canAffordIn(state, {...free, action:1}))
    const validSupplies:Card[] = state.supply.filter(canAffordIn(state))
    const validPlay:Card[] = state.play.filter(x => (x.abilities().length > 0))
    const cards:Card[] = validHand.concat(validSupplies).concat(validPlay)
    return choice(state,
        'Buy a card from the supply, use a card in hand, or pay # to play a card from your hand.',
        cards.map(asChoice), false)
}

function useCard(card: Card): Transform {
    return async function(state: State): Promise<State> {
        state = startTracking(state, {kind:'abilities', card:card})
        let ability:Ability|null = null
        if (card.abilities().length == 1) {
            ability = card.abilities()[0]
        } else {
            [state, ability] = await choice(state,
                "Choose an ability to use:",
                allowNull(card.abilities().map(x => ({kind:'string', render:x.text, value:x})))
            )
        }
        state = stopTracking(state, {kind:'abilities', card:card})
        if (ability != null) {
            state = state.log(`Activating ${card.name}`)
            state = await withTracking(
                payToDo(ability.cost, ability.effect),
                {card:card, kind:'ability', ability:ability}
            )(state)
        }
        return state
    }
}

function tryToBuy(card: Card): Transform {
    return payToDo(card.payCost('buy'), card.buy({name:'act'}))
}

function tryToPlay(card:Card): Transform {
    return payToDo(card.payCost('play'), card.play({name:'act'}))
}

// ------------------------------ Start the game

function supplyKey(spec:CardSpec): number {
    return new Card(spec, -1).cost(emptyState).coin
}
function supplySort(card1:CardSpec, card2:CardSpec): number {
    return supplyKey(card1) - supplyKey(card2)
}

// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s:string):number{
    var hash:number = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash<<5)-hash)+s.charCodeAt(i)
    }
    return hash
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

export function initialState(spec:GameSpec): State {
    const startingHand:CardSpec[] = [copper, copper, copper, copper, copper,
                                 copper, copper, estate, estate, estate]
    const intSeed:number = hash(spec.seed)
    let variableSupplies = randomChoices(mixins, 12, intSeed+1)
    const fixedKingdom:CardSpec[]|null = getFixedKingdom(spec.kingdom)
    if (fixedKingdom != null) variableSupplies = fixedKingdom
    variableSupplies.sort(supplySort)
    if (spec.testing) {
        for (let i = 0; i < cheats.length; i++) testing.push(cheats[i])
        variableSupplies = variableSupplies.concat(testing)
    }
    const kingdom = coreSupplies.concat(variableSupplies)
    let state = new State(spec)
    state = createRawMulti(state, kingdom, 'supply')
    state = createRawMulti(state, startingHand, 'hand')
    return state
}

export async function playGame(state:State): Promise<void> {
    state = await trigger({kind:'gameStart'})(state)
    while (true) {
        state = await mainLoop(state)
    }
}




//
// ----------------- CARDS -----------------
//

const coreSupplies:CardSpec[] = []
export const mixins:CardSpec[] = []
const testing:CardSpec[] = []
const cheats:CardSpec[] = []

//
// ----------- UTILS -------------------
//

function gainCard(card:CardSpec): Effect {
    return {
        text:`Create ${a(card.name)} in your discard pile.`,
        effect: create(card)
    }
}
function supplyForCard(card:CardSpec, cost:Cost, triggers:Trigger[]=[]): CardSpec  {
    return {name: card.name,
        fixedCost: cost,
        effect: (supply:Card) => gainCard(card),
        relatedCards: [card],
        triggers: card => triggers,
    }
}
function register(card:CardSpec, test:'test'|null=null):void {
    mixins.push(card)
    if (test=='test') testing.push(card)
}
function buyable(card:CardSpec, n: number, test:'test'|null=null):void {
    register(supplyForCard(card, coin(n)), test)
}
function buyableAnd(card:CardSpec, n: number, triggers:Trigger[], test:'test'|null=null):void {
    register(supplyForCard(card, coin(n), triggers), test)
}

function energy(n:number):Cost {
    return {...free, energy:n}
}
function coin(n:number):Cost {
    return {...free, coin:n}
}

//renders either "a" or "an" as appropriate
function a(s:string): string {
    const c = s[0].toLowerCase()
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s
    return 'a ' + s
}


function makeCard(card:CardSpec, cost:Cost, selfdestruct:boolean=false):CardSpec  {
    return {name:card.name,
        fixedCost: cost,
        effect: supply => ({
            text:`Create ${a(card.name)} in play.` + (selfdestruct ? ' Trash this.': ''),
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
        }),
        relatedCards: [card],
    }
}



//
//
// ------ CORE ------
//


function reboot(card:Card, n:number): Transform {
    return async function(state) {
        state = await setCoin(0)(state)
        state = await gainResource('action', n)(state)
        return state
    }
}

const apE = energy

const rest:CardSpec = {name: 'Rest',
    fixedCost: energy(3),
    effect: card => ({
        text: 'Lose all $ and +#5.',
        effect: reboot(card, 5),
    })
}
coreSupplies.push(rest)

//TODO: make cards only buyable under certain conditions?
const regroup:CardSpec = {name: 'Regroup',
    fixedCost: energy(3),
    effect: card => ({
        text: 'If your hand is empty, put your discard pile and play into your hand.',
        effect: async function(state) {
            if (state.hand.length == 0) {
                state = await moveMany(state.discard, 'hand')(state)
                state = await moveMany(state.play, 'hand')(state)
                state = state.sortZone('hand')
            }
            return state
        }
    })
}
coreSupplies.push(regroup)

const retire:CardSpec = {name: 'Retire',
    fixedCost: {...free, action:1},
    effect: card => ({
        text: 'Discard a card from your hand.',
        effect: async function(state) {
            let target:Card|null ; [state, target] = await choice(state,
                'Discard a card.',
                state.hand.map(asChoice)
            )
            if (target != null) state = await move(target, 'discard')(state)
            return state
        }
    })
}
coreSupplies.push(retire)


const copper:CardSpec = {name: 'Copper',
    fixedCost: apE(0),
    effect: card => ({
        text: '+$1',
        effect: gainCoin(1),
    })
}
coreSupplies.push(supplyForCard(copper, coin(1)))

const silver:CardSpec = {name: 'Silver',
    fixedCost: apE(0),
    effect: card => ({
        text: '+$2',
        effect: gainCoin(2)
    })
}
coreSupplies.push(supplyForCard(silver, coin(3)))

const gold:CardSpec = {name: 'Gold',
    fixedCost: apE(0),
    effect: card => ({
        text: '+$3',
        effect: gainCoin(3)
    })
}
coreSupplies.push(supplyForCard(gold, coin(6)))

const estate:CardSpec = {name: 'Estate',
    fixedCost: apE(1),
    effect: card => ({
        text: '+1vp',
        effect: gainPoints(1),
    })
}
coreSupplies.push(supplyForCard(estate, coin(1)))

const duchy:CardSpec = {name: 'Duchy',
    fixedCost: apE(1),
    effect: card => ({
        text: '+2vp',
        effect: gainPoints(2),
    })
}
coreSupplies.push(supplyForCard(duchy, coin(4)))

const province:CardSpec = {name: 'Province',
    fixedCost: apE(1),
    effect: card => ({
        text: '+3vp',
        effect: gainPoints(3),
    })
}
coreSupplies.push(supplyForCard(province, coin(8)))

//
// ----- MIXINS -----
//

function playAgain(target:Card, source:Source=unk): Transform {
    return async function(state:State) {
        target = state.find(target)
        if (target.place == 'discard') state = await target.play(source)(state)
        return state
    }
}

function playTwice(card:Card): Transform {
    return async function(state:State): Promise<State> {
        let target; [state, target] = await choice(state,
            'Choose a card to play twice.',
            state.hand.map(asChoice))
        if (target == null) return state
        state = await target.play(card)(state)
        state = tick(card)(state)
        return playAgain(target, card)(state)
    }
}

// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Free money',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$100',
        effect: gainCoin(100)
    })
}
cheats.push(freeMoney)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effect: card => ({
        text: '+10vp',
        effect: gainPoints(10),
    })
}
cheats.push(freePoints)
