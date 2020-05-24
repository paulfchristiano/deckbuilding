export const VERSION = "0.4"

// ----------------------------- Formatting

export function renderCost(cost:Partial<Cost>): string {
    const parts:string[] = []
    for (const name of allCostResources) {
        const x:number|undefined = cost[name]
        if (x != undefined && x > 0) parts.push(renderResource(name, x))
    }
    return parts.join(' ')
}

function num(n:number, s:string) {
    return `${n} ${s}${n == 1 ? '' : 's'}`
}

//renders either "a" or "an" as appropriate
function a(s:string): string {
    const c = s[0].toLowerCase()
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s
    return 'a ' + s
}

function renderResource(resource:ResourceName, amount:number): string {
    if (amount < 0) return '-' + renderResource(resource, -amount)
    switch(resource) {
        case 'coin': return `$${amount}`
        case 'energy': return repeatSymbol('@', amount)
        case 'points': return `${amount} vp`
        case 'draws': return num(amount, 'draw')
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
    restriction?: Restriction;
    calculatedCost?: CalculatedCost;
    relatedCards?: CardSpec[];
    effects?: Effect[];
    triggers?: TypedTrigger[];
    abilities?: Ability[];
    replacers?: TypedReplacer[];
}

export interface Cost {
    coin: number;
    energy: number;
    draws: number;
    buys: number;
    effects: Transform[];
}
const free:Cost = {coin:0, energy:0, draws:0, buys:0, effects: []}

interface Restriction {
    text: string;
    test: (card:Card, state:State) => boolean;
}

export interface CalculatedCost {
    calculate: (card:Card, state:State) => Cost;
    text: string;
}

interface Effect {
    text: string[];
    effect: (s:State, c:Card) => Transform;
}

export interface Trigger <T extends GameEvent = any> {
    text: string;
    kind: T['kind'];
    handles: (e:T, s:State, c:Card) => boolean;
    effect: (e:T, s:State, c:Card) => Transform;
}

export interface Replacer <T extends Params = any> {
    text: string;
    kind: T['kind'];
    handles: (p:T, s:State, c:Card) => boolean;
    replace: (p:T, s:State, c:Card) => T;
}

export interface Ability {
    text: string;
    cost: (s:State, c:Card) => Transform;
    effect: (s:State, c:Card) => Transform;
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
    payCost(): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            state = state.log(`Paying for ${card.name}`)
            const cost:Cost = card.cost(state)
            return withTracking(payCost(cost, card), {kind:'effect', card:card})(state)
        }
    }
    buy(source:Source=unk): Transform {
        let card:Card = this
        return async function(state:State): Promise<State> {
            card = state.find(card)
            if (card.place == null) return state
            state = state.log(`Buying ${card.name}`)
            state = await withTracking(async function(state) {
                state = await trigger({kind:'buy', card:card, source:source})(state)
                for (const effect of card.effects()) {
                    card = state.find(card)
                    state = await effect.effect(state, card)(state)

                }
                return state
            }, {kind:'effect', card:card})(state)
            card = state.find(card)
            state = await trigger({kind:'afterBuy', card:card, source:source})(state)
            return state
        }
    }
    play(source:Source=unk): Transform {
        let card:Card = this
        return async function(state:State):Promise<State> {
            card = state.find(card)
            if (card.place == null) return state
            state = await move(card, 'resolving', 'end', true)(state)
            state = state.log(`Playing ${card.name}`)
            state = await withTracking(async function(state) {
                state = await trigger({kind:'play', card:card, source:source})(state)
                for (const effect of card.effects()) {
                    card = state.find(card)
                    state = await effect.effect(state, card)(state)
                }
                return state
            }, {kind:'none', card:card})(state)
            card = state.find(card)
            if (card.place == 'resolving') state = await move(card, 'discard')(state);
            state = await trigger({kind:'afterPlay', card:card, source:source})(state)
            return state
        }
    }
    effects(): Effect[] {
        return this.spec.effects || []
    }
    triggers(): TypedTrigger[] {
        return this.spec.triggers || []
    }
    abilities(): Ability[] {
        return this.spec.abilities || []
    }
    replacers(): TypedReplacer[] {
        return this.spec.replacers || []
    }
    relatedCards(): CardSpec[] {
        return this.spec.relatedCards || []
    }
    buyable(state:State): boolean {
        if (this.spec.restriction == undefined) return true
        return this.spec.restriction.test(this, state)
    }
}

// ------------------------- State

export interface GameSpec {
    seed: string;
    kingdom: string|null;
    testing?: boolean;
}

type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

type ZoneName = 'supply' | 'hand' | 'discard' | 'play' | 'aside' | 'events'
type PlaceName = ZoneName | null | 'resolving'

type Zone = Card[]

type Resolving = (Card|Shadow)[]

export type Replayable = number[]

interface Resources {
    coin:number;
    energy:number;
    draws:number;
    buys:number;
    points:number
}

type CostResourceName = 'coin' | 'energy' | 'draws' | 'buys'
const allCostResources:CostResourceName[] = ['coin', 'energy', 'draws', 'buys']
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
    public readonly draws:number;
    public readonly buys:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly aside:Zone;
    public readonly events:Zone;
    constructor(
        public readonly spec: GameSpec = {seed:'', kingdom:null},
        public readonly ui: UI = noUI,
        public readonly resources:Resources = {coin:0, energy:0, points:0, draws:0, buys:0},
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
        this.draws = resources.draws
        this.buys = resources.buys

        this.supply = zones.get('supply') || []
        this.hand = zones.get('hand') || []
        this.discard= zones.get('discard') || []
        this.play = zones.get('play') || []
        this.aside = zones.get('aside') || []
        this.events = zones.get('events') || []
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
    addToZone(card:Card, zone:ZoneName|'resolving', loc:InsertLocation='end'): State {
        card = card.update({place:zone})
        if (zone == 'resolving') return this.addResolving(card)
        const newZones:Map<ZoneName,Zone> = new Map(this.zones)
        const currentZone = this[zone]
        card = card.update({zoneIndex: firstFreeIndex(currentZone)})
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
interface AfterBuyEvent {kind:'afterBuy'; card:Card; source:Source}
interface PlayEvent {kind:'play'; card:Card; source:Source}
interface AfterPlayEvent {kind:'afterPlay'; card:Card; source:Source}
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
        for (const card of state.events.concat(state.supply).concat(state.play)) {
            for (const rawtrigger of card.triggers()) {
                if (rawtrigger.kind == e.kind) {
                    const trigger:Trigger<T> = ((rawtrigger as unknown) as Trigger<T>)
                    if (trigger.handles(e, initialState, card)
                        && trigger.handles(e, state, card)) {
                        state = state.log(`Triggering ${card}`)
                        state = await withTracking(
                            trigger.effect(e, state, card),
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

interface ResourceParams {kind:'resource', resource:ResourceName, amount:number, source:Source}
interface CostParams {kind:'cost', card:Card, cost:Cost}
interface DrawParams {kind:'draw', draw:number, source:Source, effects:Transform[]}
interface MoveParams {kind:'move', card:Card, fromZone:PlaceName, toZone:PlaceName, effects:Transform[], skip:boolean}
interface CreateParams {kind:'create', spec:CardSpec, zone:ZoneName, effects:Transform[]}

type Params = ResourceParams | CostParams | DrawParams | MoveParams | CreateParams
type TypedReplacer = Replacer<ResourceParams> | Replacer<CostParams> | Replacer<DrawParams> |
    Replacer<MoveParams> | Replacer<CreateParams>

//TODO: this should maybe be async and return a new state?
//(e.g. the "put it into your hand" should maybe be replacement effects)
//x is an event that is about to happen
//each card in play or supply can change properties of x
function replace<T extends Params>(x: T, state: State): T {
    var replacers:TypedReplacer[] = state.events.concat(state.supply).concat(state.play).map(x => x.replacers()).flat()
    for (const card of state.events.concat(state.supply).concat(state.play)) {
        for (const rawreplacer of card.replacers()) {
            if (rawreplacer.kind == x.kind) {
                const replacer = ((rawreplacer as unknown) as Replacer<T>)
                if (replacer.handles(x, state, card)) {
                    x = replacer.replace(x, state, card)
                }
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

function create(spec:CardSpec, zone:ZoneName='discard', loc:InsertLocation='bottom',
    postprocess:(c:Card) =>Transform=()=>noop,
): Transform {
    return async function(state: State): Promise<State> {
        let params:CreateParams = {kind:'create', spec:spec, zone:zone, effects:[]}
        params = replace(params, state)
        spec = params.spec
        zone = params.zone
        for (const effect of params.effects) state = await effect(state)
        let card:Card; [state, card] = createRaw(state, spec, zone, loc)
        state = state.log(`Created ${a(card.name)} in ${zone}`)
        state = await trigger({kind:'create', card:card, zone:zone})(state)
        return postprocess(card)(state)
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
        if (state.draws < c.draws) throw new CostNotPaid("Not enough draws")
        if (state.buys < c.buys) throw new CostNotPaid("Not enough buys")
        state = state.setResources({
            coin:state.coin - c.coin,
            draws:state.draws - c.draws,
            buys:state.buys - c.buys,
            energy:state.energy + c.energy,
            points:state.points
        })
        if (renderCost(c) != '') state = state.log(`Paid ${renderCost(c)}`)
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
            draws:state.draws,
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
        newResources[resource] = newResources[resource] + amount
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

function gainCards(n:number, source:Source=unk): Transform {
    return async function(state:State) {
        return gainResource('draws', n, source)(state)
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

export const VP_GOAL = 40
function gainPoints(n:number, source:Source=unk): Transform {
    return async function(state) {
        state = await gainResource('points', n, source)(state)
        if (state.points >= VP_GOAL) throw new Victory(state)
        return state
    }
}

function gainCoin(n:number, source:Source=unk): Transform {
    return gainResource('coin', n, source)
}

function gainBuys(n:number, source:Source=unk): Transform {
    return gainResource('buys', n, source)
}

const gainBuy = gainBuys(1)

function draw(n:number, source:Source=unk): Transform {
    return gainResource('draws', n, source)
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

// -------------------- Utilities for manipulating costs

function addCosts(a:Cost, b:Partial<Cost>): Cost {
    return {
        coin:a.coin + (b.coin || 0),
        energy:a.energy+(b.energy || 0),
        draws:a.draws+(b.draws || 0),
        buys:a.buys + (b.buys || 0),
        effects:a.effects.concat(b.effects || []),
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
        draws:Math.max(0, c.draws - (reduction.draws || 0)),
        buys:Math.max(0, c.buys - (reduction.buys || 0)),
        effects:c.effects,
    }
}

function eq(a:Cost, b:Cost): boolean {
    return a.coin == b.coin && a.energy == b.energy && a.draws == b.draws
}


function leq(cost1:Cost, cost2:Cost) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy
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
function removeToken(card:Card, token:string): Transform {
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
            return tryToBuy(card, 'supply')(state)
        case 'events':
            return tryToBuy(card, 'event')(state)
        case 'aside':
        case 'discard':
        case 'resolving':
        case null:
            throw new Error(`Card can't be in zone ${newCard.place}`)
        default: assertNever(newCard.place)
    }
}

function canPay(cost:Cost, state:State): boolean {
    return (cost.coin <= state.coin && cost.draws <= state.draws && cost.buys <= state.buys)
}

function canAffordIn(state:State, extra:Cost=free): (c:Card) => boolean {
    return x => canPay(addCosts(x.cost(state), extra), state)
}

function actChoice(state:State): Promise<[State, Card|null]> {
    const validHand:Card[] = state.hand.filter(canAffordIn(state, actCost('play')))
    const validSupplies:Card[] = state.supply.
        filter(x => x.buyable(state) && canAffordIn(state, actCost('supply'))(x))
    const validEvents:Card[] = state.events.
        filter(x => x.buyable(state) && canAffordIn(state, actCost('event'))(x))
    const validPlay:Card[] = state.play.filter(x => (x.abilities().length > 0))
    const cards:Card[] = validHand.concat(validEvents).concat(validSupplies).concat(validPlay)
    return choice(state,
        'Buy an event, use a card in play, pay 1 buy to buy a card from the supply, or pay 1 draw to play a card from your hand.',
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
            card = state.find(card)
            state = await withTracking(
                payToDo(ability.cost(state, card), ability.effect(state, card)),
                {card:card, kind:'ability', ability:ability}
            )(state)
        }
        return state
    }
}

function actCost(kind:'supply'|'event'|'play'): Cost {
    switch (kind) {
        case 'supply': return {...free, buys:1}
        case 'event': return free
        case 'play': return {...free, draws:1}
        default: return assertNever(kind)
    }
}

function tryToBuy(card: Card, kind:'supply'|'event'): Transform {
    return payToDo(doAll([payCost(actCost(kind)), card.payCost()]), card.buy({name:'act'}))
}

function tryToPlay(card:Card): Transform {
    return payToDo(doAll([payCost(actCost('play')), card.payCost()]), card.play({name:'act'}))
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
    const startingHand:CardSpec[] = [copper, copper, copper, estate, estate]
    const intSeed:number = hash(spec.seed)
    let variableSupplies = randomChoices(mixins, 10, intSeed)
    let variableEvents = randomChoices(eventMixins, 4, intSeed+1)
    const fixedKingdom:CardSpec[]|null = getFixedKingdom(spec.kingdom)
    if (fixedKingdom != null) variableSupplies = fixedKingdom
    variableSupplies.sort(supplySort)
    variableEvents.sort(supplySort)
    if (spec.testing) {
        for (let i = 0; i < cheats.length; i++) variableEvents.push(cheats[i])
        variableSupplies = variableSupplies.concat(testSupplies)
        variableEvents = variableEvents.concat(testEvents)
    }
    const kingdom = coreSupplies.concat(variableSupplies)
    const events = coreEvents.concat(variableEvents)
    let state = new State(spec)
    state = createRawMulti(state, kingdom, 'supply')
    state = createRawMulti(state, events, 'events')
    state = createRawMulti(state, startingHand, 'discard')
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
const coreEvents:CardSpec[] = []
export const mixins:CardSpec[] = []
export const eventMixins:CardSpec[] = []
const testSupplies:CardSpec[] = []
const testEvents:CardSpec[] = []
const cheats:CardSpec[] = []

//
// ----------- UTILS -------------------
//

function createEffect(spec:CardSpec, zone:'discard'='discard'): Effect {
    return {
        text: [`Create ${a(spec.name)} in your discard pile.`],
        effect: () => create(spec, zone),
    }
}

interface Extras {
    triggers?:TypedTrigger[];
    replacers?:TypedReplacer[];
    restriction?: Restriction;
    onBuy?:Effect[];
}
function supplyForCard(
    card:CardSpec,
    cost:Cost,
    extra:Extras={}
): CardSpec {
    return {
        name: card.name,
        fixedCost: cost,
        restriction: extra.restriction,
        effects: (extra.onBuy || []).concat([createEffect(card)]),
        relatedCards: [card],
        triggers: extra.triggers,
        replacers: extra.replacers,
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
        effect: (s:State, c:Card) => trash(c)
    }
}

function makeCard(card:CardSpec, cost:Cost, selfdestruct:boolean=false):CardSpec  {
    const effects:Effect[] = [{
        text: [`Create ${a(card.name)} in play.`],
        effect: () => create(card, 'play')
    }]
    if (selfdestruct) effects.push(trashThis())
    return {name:card.name,
        fixedCost: cost,
        effects: effects,
        relatedCards: [card],
    }
}

function registerEvent(card:CardSpec, test:'test'|null=null):void {
    eventMixins.push(card)
    if (test=='test') testEvents.push(card)
}


//
//
// ------ CORE ------
//

function sortHand(state:State): State {
    return state.sortZone('hand')
}

async function recycle(state:State): Promise<State> {
    return doAll([
        moveMany(state.discard, 'hand'),
        moveMany(state.play, 'hand'),
        sortHand,
    ])(state)
}


function recycleEffect(): Effect {
    return {
        text: ['Put your discard pile and play into your hand'],
        effect: () => recycle
    }
}

function regroupEffect(n:number, source?:Source): Effect {
    return {
        text: [`Lose all $, draws, and buy.`,
        `Put your discard pile and play into your hand`,
        `+${n} draws, +1 buy.`],
        effect: () => async function(state) {
            state = await setResource('coin', 0)(state)
            state = await setResource('draws', 0)(state)
            state = await setResource('buys', 0)(state)
            state = await recycle(state)
            state = await draw(n, source)(state)
            state = await gainBuy(state)
            return state
        }
    }
}

function gainCoinEffect(n:number): Effect {
    return {
        text: [`+$${n}`],
        effect: (s:State, c:Card) => gainCoin(n, c),
    }
}
function gainPointsEffect(n:number): Effect {
    return {
        text: [`+${n} vp`],
        effect: (s:State, c:Card) => gainPoints(n, c),
    }
}
function drawEffect(n:number): Effect {
    return {
        text: [`+` + num(n, 'draw')],
        effect: (s:State, c:Card) => gainPoints(n, c),
    }
}
function gainBuyEffect(n:number): Effect {
    return {
        text: ['+' + num(n, 'buy')],
        effect: (state, card) => gainBuys(n, card),
    }
}
function buyEffect() {
    return {
        text: [`+1 buy`],
        effect: () => gainBuy,
    }
}

function chargeEffect(): Effect {
    return {
        text: ['Put a charge token on this.'],
        effect: (s, card) => charge(card, 1)
    }
}

const regroup:CardSpec = {name: 'Regroup',
    fixedCost: energy(4),
    effects: [regroupEffect(5)],
}
coreEvents.push(regroup)


const copper:CardSpec = {name: 'Copper',
    effects: [gainCoinEffect(1)]
}
coreSupplies.push(supplyForCard(copper, coin(0)))

const silver:CardSpec = {name: 'Silver',
    effects: [gainCoinEffect(2)]
}
coreSupplies.push(supplyForCard(silver, coin(3)))

const gold:CardSpec = {name: 'Gold',
    effects: [gainCoinEffect(3)]
}
coreSupplies.push(supplyForCard(gold, coin(6)))

const estate:CardSpec = {name: 'Estate',
    fixedCost: energy(1),
    effects: [gainPointsEffect(1)]
}
coreSupplies.push(supplyForCard(estate, coin(2)))

const duchy:CardSpec = {name: 'Duchy',
    fixedCost: energy(1),
    effects: [gainPointsEffect(2)]
}
coreSupplies.push(supplyForCard(duchy, coin(4)))

const province:CardSpec = {name: 'Province',
    fixedCost: energy(1),
    effects: [gainPointsEffect(3)]
}
coreSupplies.push(supplyForCard(province, coin(8)))


//
// ----- MIXINS -----
//

function register(card:CardSpec, test:'test'|null=null):void {
    mixins.push(card)
    if (test=='test') testSupplies.push(card)
}
function buyable(card:CardSpec, n: number, test:'test'|null=null):void {
    return buyableAnd(card, n, {}, test)
}
function buyableAnd(card:CardSpec, n:number, extra:Extras, test:'test'|null=null) {
    register(supplyForCard(card, coin(n), extra), test)
}
function buyableFree(card:CardSpec, coins:number, test:'test'|null=null): void {
    buyableAnd(card, coins, {onBuy: [buyEffect()]}, test)
}


function playAgain(target:Card, source:Source=unk): Transform {
    return async function(state:State) {
        target = state.find(target)
        if (target.place == 'discard') state = await target.play(source)(state)
        return state
    }
}

function descriptorForZone(zone:'hand'|'supply'|'events'):string {
    switch (zone) {
        case 'hand': return 'Cards in your hand'
        case 'supply': return 'Cards in the supply'
        case 'events': return 'Events'
        default: return assertNever(zone)
    }
}

function costReduce(zone:'hand'|'supply'|'events', reduction:Partial<Cost>): Replacer<CostParams> {
    const descriptor = descriptorForZone(zone)
    return {
        text: `${descriptor} cost ${renderCost(reduction)} less.`,
        kind: 'cost',
        handles: () => true,
        replace: function(x:CostParams, state:State) {
            if (x.card.place == zone) return {...x, cost:subtractCost(x.cost, reduction)}
            return x
        }
    }
}

function costReduceNext(
    zone:'hand'|'supply'|'events',
    reduction:Partial<Cost>,
    nonzero:boolean=false
): Replacer<CostParams> {
    const descriptor = descriptorForZone(zone)
    return {
        text: `${descriptor} cost ${renderCost(reduction)} less${nonzero ? ', but not zero.' : '.'}
        Whenever this reduces a cost, discard this.`,
        kind: 'cost',
        handles: x => x.card.place == zone,
        replace: function(x:CostParams, state:State, card:Card) {
            let newCost:Cost = subtractCost(x.cost, reduction)
            if (nonzero && leq(newCost, free) && !leq(x.cost, free)) {
                if (reduction.coin || 0 > 0) {
                    newCost = addCosts(newCost, {coin:1})
                } else if (reduction.energy || 0 > 0) {
                    newCost = addCosts(newCost, {energy:1})
                }
            }
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([move(card, 'discard')])
                return {...x, cost:newCost}
            }
            return x
        }
    }
}

function applyToTarget(
    f:(target:Card) => Transform,
    text:string,
    options:Card[]
): Transform {
    return async function(state) {
        let target:Card|null; [state, target] = await choice(state,
            text, options.map(asChoice))
        if (target != null) state = await f(target)(state)
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
        effect: (s:State, c:Card) => applyToTarget(
            target => f(target, c),
            text,
            options(s)
        )
    }
}


function toPlay(): Effect {
    return {
        text: ['Put this in play.'],
        effect: (state, card) => move(card, 'play')
    }
}
function villageReplacer(): Replacer<CostParams> {
    return costReduceNext('hand', {energy:1})
}

const necropolis:CardSpec = {name: 'Necropolis',
    effects: [toPlay()],
    replacers: [villageReplacer()],
}
buyableFree(necropolis, 2)

const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [drawEffect(2)],
}
buyableFree(hound, 2)

const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effects: [drawEffect(3)],
}
buyable(smithy, 4)

const village:CardSpec = {name: 'Village',
    effects:  [drawEffect(1), toPlay()],
    replacers: [villageReplacer()],
}
buyable(village, 4)

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effects: [buyEffect(), toPlay()],
    replacers: [costReduce('supply', {coin:1})]
}
buyable(bridge, 6)

const coven:CardSpec = {name: 'Coven',
    effects: [toPlay()],
    replacers: [{
        text: 'Cards in your hand cost @ less if you have no card with the same name'
         + ' in your discard pile or play.'
         + ' Whenever this reduces a cost, discard this and +$2.',
        kind: 'cost',
        handles: (e, state) => (state.discard.concat(state.play).every(c => c.name != e.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            if (x.card.place == 'hand') {
                const newCost:Cost = subtractCost(x.cost, {energy:1})
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([move(card, 'discard'), gainCoin(2)])
                    return {...x, cost:newCost}
                }
            }
            return x
        }
    }]
}
buyable(coven, 4)

const lab:CardSpec = {name: 'Lab',
    effects: [drawEffect(2)]
}
buyable(lab, 5)

const payDraw= payCost({...free, draws:1})

function playTwice(): Effect {
    return {
        text: [`Pay 1 draw to play a card in your hand.`,
        `If it's in your discard pile play it again.`],
        effect: (state, card) => payToDo(payDraw, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                playAgain(target, card)
            ]), 'Choose a card to play twice.', state.hand))
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
        effect: e => gainCoin(1),
    }]
}
buyable(coppersmith, 4)

const scavenger:CardSpec = {name: 'Scavenger',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), targetedEffect(
            target => move(target, 'hand'),
            'Put a card from your discard pile into your hand.',
            state => state.discard
        )
    ]
}
buyable(scavenger, 4)

const celebration:CardSpec = {name: 'Celebration',
    fixedCost: energy(2),
    effects: [toPlay()],
    replacers: [costReduce('hand', {energy:1})]
}
buyable(celebration, 10)

const plough:CardSpec = {name: 'Plough',
    fixedCost: energy(2),
    effects: [{
        text: ['Put your discard pile and play into your hand.'],
        effect: () => recycle
    }]
}
buyable(plough, 4)

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    effects: [toPlay()],
    triggers: [{
        text: 'Whenever you pay @, gain twice that many draws.',
        kind: 'cost',
        handles: () => true,
        effect: e => draw(2 * e.cost.energy)
    }]
}
buyable(construction, 3)

//TODO: I would prefer 'other than with this'
const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:2, coin:5},
    effects: [{
        text: ['Put a mirror token on each card in your hand.'],
        effect: (state:State, card:Card) => 
            doAll(state.hand.map(c => addToken(c, 'mirror')))
    }],
    triggers: [{
        text: `Whenever you finish playing a card with a mirror token on it 
        other than with this, if it's in your discard pile
        remove a mirror token and play it again.`,
        kind:'afterPlay',
        handles: (e, state, card) => {
            const played:Card = state.find(e.card)
            return played.count('mirror') > 0 && played.place == 'discard'
                && e.source.name != card.name
        },
        effect: (e, s, card) => doAll([
            playAgain(e.card, card),
            removeToken(e.card, 'mirror')
        ]),
    }]
}
registerEvent(hallOfMirrors, 'test')

function costPlus(initial:Cost, increment:Cost): CalculatedCost {
    return {
        calculate: function(card:Card, state:State) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).count('cost')))
        },
        text: `${renderCost(initial)} plus ${renderCost(increment)} for each cost token on this.`,
    }
}

function incrementCost(): Effect {
    return {
        text: ['Put a cost token on this.'],
        effect: (s:State, c:Card) => addToken(c, 'cost')
    }
}

const retrench:CardSpec = {name: 'Retrench',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), regroupEffect(5)],
}
registerEvent(retrench)

const respite:CardSpec = {name:'Respite',
    fixedCost: energy(2),
    effects: [regroupEffect(2)],
}
registerEvent(respite)

const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    fixedCost: energy(2),
    restriction: {
        text: 'You have no cards in hand.',
        test: (card, state) => state.hand.length == 0
    },
    effects: [regroupEffect(5)],
}
registerEvent(perpetualMotion)

const desperation:CardSpec = {name:'Desperation',
    fixedCost: energy(1),
    effects: [gainCoinEffect(1)]
}
registerEvent(desperation)

const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(2),
    effects: [buyEffect(), chargeEffect()],
    triggers: [{
        text: `Whenever you create a card, if it's in your discard pile and this has a charge token on it,
               remove a charge token from this and put the card in your hand`,
        kind:'create',
        handles: (e, state, card) => (card.charge > 0 &&
            state.find(e.card).place == 'discard'),
        effect: (e, s, card) => doAll([
            charge(card, -1),
            move(e.card, 'hand')
        ])
    }]
}
registerEvent(travelingFair)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:10, energy:2},
    effects: [{
        text: ['Lose all $.', '+1 vp per $ lost.'],
        effect: () => async function(state) {
            const n = state.coin
            state = await gainCoin(-n)(state)
            state = await gainPoints(n)(state)
            return state
        }
    }]
}
registerEvent(philanthropy)

const storytelling:CardSpec = {name: 'Storytelling',
    fixedCost: coin(1),
    effects: [{
        text: ['Lose all $.', '+1 draw per $ lost.'],
        effect: () => async function(state) {
            const n = state.coin
            state = await setResource('coin', 0)(state)
            state = await draw(n)(state)
            return state
        }
    }]
}
registerEvent(storytelling)

const monument:CardSpec = {name: 'Monument',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), gainPointsEffect(1)],
}
buyable(monument, 2)

const repurpose:CardSpec = {name: 'Repurpose',
    fixedCost: energy(2),
    effects: [{
        text: ['Lose all $ and buys.'],
        effect: (state, card) => doAll([setResource('coin', 0, card),
                                 setResource('buys', 0, card)])
    }, recycleEffect(), buyEffect()]
}
registerEvent(repurpose)

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effects: [gainPointsEffect(1), drawEffect(1)],
}
buyable(vibrantCity, 6)

function chargeUpTo(max:number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}`],
        effect: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    effects: [chargeUpTo(6), {
        text: ['+1 vp per charge token on this.'],
        effect: (state, card) => gainPoints(state.find(card).charge, card)
    }]
}
buyable(frontier, 7)

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effects: [chargeUpTo(5), {
        text: ['+$1 per charge token on this.'],
        effect: (state, card) => gainCoin(state.find(card).charge, card),
    }]
}
buyable(investment, 4)

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:12, energy:3},
    effects: [{
        text: ['Buy any number of cards in the supply.'],
        effect: (state, card) => doAll(state.supply.map(s => s.buy(card)))
    }]
}
registerEvent(populate)

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:5, energy:1},
    effects: [{
        text: [`Put a duplicate token on each card in the supply.`],
        effect: (state, card) => doAll(state.supply.map(c => addToken(c, 'duplicate')))
    }],
    triggers: [{
        text: `After buying a card with a duplicate token on it the normal way, remove a duplicate tokens from it and buy it again.`,
        kind:'afterBuy',
        handles: (e, state) => {
            if (e.source.name != 'act') return false
            const target:Card = state.find(e.card);
            return target.place != null && target.count('duplicate') > 0
        },
        effect: (e, state, card) => 
            doAll([removeToken(e.card, 'duplicate'), e.card.buy(card)])
    }]
}
registerEvent(duplicate)

const royalSeal:CardSpec = {name: 'Royal Seal',
    effects: [gainCoinEffect(2), toPlay()],
    replacers: [{
        text: `Whenever you would create a card in your discard pile, if this is in play
        then instead create the card in your hand and discard this.`,
        kind: 'create',
        handles: (e, state, card) => e.zone == 'discard'
            && state.find(card).place == 'play',
        replace: (x, state, card) => 
            ({...x, zone:'hand', effects:x.effects.concat([move(card, 'discard')])})
    }]
}
buyable(royalSeal, 6)

const workshop:CardSpec = {name: 'Workshop',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $4.',
        state => state.supply.filter(x => leq(x.cost(state), coin(4)))
    )]
}
buyable(workshop, 3)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), toPlay()],
    triggers: [{
        text: "When you finish buying a card or event the normal way,"
            + " if this is in play and that card hasn't moved, discard this and buy that card again.",
        kind: 'afterBuy',
        handles: (e, state, card) =>
            (e.source.name == 'act' && state.find(card).place == 'play'),
        effect: (e, state, card) => async function(state) {
            const bought:Card = state.find(e.card)
            state = await move(card, 'discard')(state)
            if (bought.place == e.card.place) state = await bought.buy(card)(state)
            return state
        }
    }]
}
buyable(shippingLane, 5)

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(1),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost(state), coin(6)))
    )]
}
buyable(factory, 4)

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a fresh copy of it in your hand.',
        state => state.hand,
    )]
}
buyable(imitation, 4)

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effects: [gainCoinEffect(6), buyEffect(), trashThis()]
}
buyable(feast, 4)

const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(10)),
    effects: [chargeEffect(), incrementCost()],
    replacers: [{
        text: `${regroup.name} costs @ less to play for each cost token on this.`,
        kind:'cost',
        handles: x => (x.card.name == regroup.name),
        replace: (x, state, card) => 
            ({...x, cost:subtractCost(x.cost, {energy:state.find(card).charge})})
    }]
}
registerEvent(mobilization)

const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(2),
    effects: [{
        text: ['Put your discard pile into your hand.'],
        effect: (state, card) => doAll([moveMany(state.discard, 'hand'), sortHand ]),
    }]
}
registerEvent(refresh)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:8},
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    triggers: [{
        text: `After playing a card with a twin token other than with this, if it's in your discard pile play it again.`,
        kind: 'afterPlay',
        handles: (e, state, card) => (e.card.count('twin') > 0 && e.source.id != card.id),
        effect: (e, state, card) => playAgain(e.card, card)
    }],
}
registerEvent(twin)

const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [chargeUpTo(4), {
        text: ['+1 draw per charge token on this.'],
        effect: (state, card) => draw(state.find(card).charge, card)
    }]
}
buyable(youngSmith, 3)

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+4 draws -1 per charge token on this.'],
        effect: (state, card) => draw(4 - state.find(card).charge, card),
    }, chargeEffect()]
}
buyable(oldSmith, 3)

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [{
        text: ['Create two golds in your hand.'],
        effect: () => doAll([create(gold, 'hand'), create(gold, 'hand')]),
    }]
}
buyable(goldMine, 8)

function fragile(card:Card):Trigger<MoveEvent> {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: x => x.card.id == card.id,
        effect: x => trash(x.card)
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
    effects: [chargeEffect(), incrementCost()],
    triggers: [{
        text: `When you create a card, if it's in your discard pile
               and this has a charge token on it,
               remove a charge token from this and play the card.`,
        kind: 'create',
        handles: (e, state, card) => state.find(e.card).place == 'discard'
            && state.find(card).charge > 0,
        effect: (e, state, card) => doAll([charge(card, -1), playAgain(e.card, card)])
    }],
}
registerEvent(expedite)

const synergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:5, energy:1},
    effects: [{
        text: ['Remove all synergy tokens from cards in the supply and events.'],
        effect: (state, card) => doAll(state.supply.concat(state.events).
            map(s => removeTokens(s, 'synergy'))
        )
    }, {
        text: ['Put synergy tokens on two cards in the supply or events.'],
        effect: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoiceIfNeeded(state,
                'Choose two cards to synergize.',
                state.supply.concat(state.events).map(asChoice), 2, false)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }],
    triggers: [{
        text: 'Whenever you buy a card with a synergy token other than with this,'
        + ' afterwards buy a different card with a synergy token with equal or lesser cost.',
        kind:'afterBuy',
        handles: (e, state, card) => (e.source.id != card.id && e.card.count('synergy') > 0),
        effect: (e, state, card) => applyToTarget(
            target => target.buy(card),
            'Choose a card to buy.',
            state.supply.concat(state.events).filter(
                c => c.count('synergy') > 0
                && leq(c.cost(state), e.card.cost(state))
                && c.buyable(state)
                && c.id != e.card.id
            )
        )
    }]
}
registerEvent(synergy)

const shelter:CardSpec = {name: 'Shelter',
    effects: [targetedEffect(
        target => addToken(target, 'shelter'),
        'Put a shelter token on a card in play.',
        state => state.play
    )]
}
buyableAnd(shelter, 3, {
    replacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token from play,
               instead remove a shelter token from it.`,
        handles: (x, state) => (x.fromZone == 'play' && state.find(x.card).count('shelter') > 0),
        replace: x => ({...x, toZone:'play', effects:x.effects.concat([removeToken(x.card, 'shelter')])})
    }]
})

const market:CardSpec = {
    name: 'Market',
    effects: [drawEffect(1), gainCoinEffect(1), buyEffect()],
}
buyable(market, 5)

const spree:CardSpec = {name: 'Spree',
    fixedCost: energy(1),
    effects: [buyEffect()],
}
registerEvent(spree)

const counterfeit:CardSpec = {name: 'Counterfeit',
    effects: [drawEffect(1), buyEffect(), targetedEffect(
        (target, card) => doAll([target.play(card), trash(target)]),
        'Play a card in your hand, then trash it.',
        state => state.hand)]
}
buyable(counterfeit, 4)

const ruinedMarket:CardSpec = {name: 'Ruined Market',
    effects: [buyEffect()]
}
buyableFree(ruinedMarket, 2)

const spices:CardSpec = {name: 'Spices',
    effects: [gainCoinEffect(2), buyEffect()],
}
buyableAnd(spices, 5, {onBuy: [gainCoinEffect(4)]})

const onslaught:CardSpec = {name: 'Onslaught',
    calculatedCost: costPlus(coin(6), energy(1)),
    effects: [incrementCost(), {
        text: [`Set aside your hand, then play any number of those cards in any order
        and discard the rest.`],
        effect: (state, card) => async function(state) {
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
}
registerEvent(onslaught)

//TODO: link these together, modules in general?

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effects: [gainPointsEffect(5)],
}
buyable(colony, 16)

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [gainCoinEffect(5)]
}
buyable(platinum, 10)

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [drawEffect(5)]
}
buyable(greatSmithy, 7)

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(1),
    effects: [{
        text: ['Set $ to 0, set buys to 1, and set draws to 5.'],
        effect: () => doAll([
            setResource('coin', 0),
            setResource('buys', 1),
            setResource('draws', 5),
        ])
    }]
}
registerEvent(pressOn)

const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effects: [{
        text: [`Pay 1 draw to play a card in your hand.`,
        `If it's in your discard pile play it again.`],
        effect: (state, card) => payToDo(payDraw, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                playAgain(target, card),
                tick(card),
                playAgain(target, card)
            ]), 'Choose a card to play twice.', state.hand))
    }]
}
buyable(kingsCourt, 10)

const gardens:CardSpec = {name: "Gardens",
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per 10 cards in your hand, discard pile, and play.'],
        effect: (state, card) => gainPoints(
            Math.floor((state.hand.length + state.discard.length + state.play.length)/10),
            card
        )
    }]
}
buyable(gardens, 4)

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(3),
    effects: [{
        text: ['Remove a decay token from each card in your discard pile.'],
        effect: state => doAll(state.discard.map(x => removeToken(x, 'decay')))
    }],
    triggers: [{
        text: 'Whenever you move a card to your hand, if it has 3 or more decay tokens on it trash it,'+
            ' otherwise put a decay token on it.',
        kind: 'move',
        handles: e => e.toZone == 'hand',
        effect: e => (e.card.count('decay') >= 3) ?
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
        target => create(target.spec, 'discard'),
        'Choose a card in your hand. Create a fresh copy of it in your discard pile.',
        state => state.hand,
    )]
}
registerEvent(replicate)

const inflation:CardSpec = {name: 'Inflation',
    fixedCost: energy(3),
    effects: [gainCoinEffect(15), gainBuyEffect(5), chargeEffect()],
    replacers: [{
        text: 'Cards that cost at least $1 cost $1 more per charge token on this.',
        kind: 'cost',
        handles: (p, state) => (p.cost.coin >= 1),
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.charge})})
    }]
}
registerEvent(inflation)

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effects: [targetedEffect(
        target => removeToken(target, 'burden'),
        'Remove a burden token from a card in the supply.',
        state => state.supply
    )],
    triggers: [{
        text: 'Whenever you buy a card in the supply, put a burden token on it.',
        kind:'buy',
        handles: (e, state) => (state.find(e.card).place == 'supply'),
        effect: e => addToken(e.card, 'burden')
    }],
    replacers: [{
        kind: 'cost',
        text: 'Cards cost $1 more for each burden token on them.',
        handles: x => x.card.count('burden') > 0,
        replace: x => ({...x, cost: addCosts(x.cost, {coin:x.card.count('burden')})})
    }]
}
registerEvent(burden)

const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [drawEffect(2), gainCoinEffect(3)]
}
buyable(goldsmith, 7)

const publicWorks:CardSpec = {name: 'Public Works',
    effects: [toPlay()],
    replacers: [costReduceNext('events', {energy:1}, true)],
}
buyable(publicWorks, 5)

//TODO: handle skip better, other things shouldn't replace it again...
const echo:CardSpec = {name: 'Echo',
    effects: [targetedEffect(
        target => create(target.spec, 'play', 'end', c => addToken(c, 'echo')),
        `Choose a card you have in play.
        Create a fresh copy of it in play with an echo token on it.`,
        state => state.play
    )]
}
buyableAnd(echo, 4, {
    triggers: [{
        text: 'Whenever you move a card with an echo token on it, trash it.',
        kind: 'move',
        handles: (x, state) => state.find(x.card).count('echo') > 0,
        effect: x => trash(x.card)
    }]
})

const mastermind:CardSpec = {name: 'Mastermind',
    effects: [toPlay()],
    replacers: [{
        text: `Whenever you would move this from play to your hand,
            if it has no charge tokens on it instead put a charge token on it.`,
        kind:'move',
        handles: (x, state, card) => (x.fromZone == 'play' && x.toZone == 'hand'
            && x.card.id == card.id && state.find(card).charge == 0),
        replace: (x, state, card) =>
            ({...x, skip:true, effects:x.effects.concat([charge(card, 1)])})
    }],
    triggers: [{
        text: `Whenever you finish playing a card, if it's in your discard pile and
            this is in play with a charge token on it,
            remove the charge token, discard this, and play that card again.
            Then if it's still in your discard pile, play it a third time.`,
        kind: 'afterPlay',
        handles: (e, state, card) => {
            card = state.find(card);
            return card.place == 'play' && card.charge > 0
                && state.find(e.card).place == 'discard'; 
        },
        effect: (e, state, card) => doAll([
            uncharge(card),
            move(card, 'discard'),
            playAgain(e.card),
            playAgain(e.card)
        ])
    }]
}
buyable(mastermind, 5)

//TODO: haggler makes $2, puts itself in play, buy cheaper things...

const doubleTime:CardSpec = {
    name: 'Double Time',
    effects: [drawEffect(1), toPlay()],
    triggers: [{
        text: 'Whenever you pay @, that many charge tokens on this.',
        kind: 'cost',
        handles: () => true,
        effect: (e, state, card) => charge(card, e.cost.energy)
    }],
    replacers: [{
        text: `Cards in your hand @ less to play for each charge token on this.
            Whenever this reduces a cost by one or more @, remove that many charge tokens from this.`,
        kind: 'cost',
        handles: (x, state, card) => (state.find(x.card).place == 'hand') && card.charge > 0,
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(x.cost.energy, card.charge)
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([discharge(card, reduction)])
            }}
        }
    }, {
        text: 'Whenever this leaves play, remove all charge tokens from it.',
        kind: 'move',
        handles: x => x.fromZone == 'play' && !x.skip,
        replace: (x, state, card) => ({...x, effects:x.effects.concat([uncharge(card)])})
    }]
}
buyable(doubleTime, 2)

const dragon:CardSpec = {name: 'Dragon',
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              drawEffect(4), gainCoinEffect(4), buyEffect()]
}
const egg:CardSpec = {name: 'Egg',
    fixedCost: energy(2),
    relatedCards: [dragon],
    effects: [{
        text:[`If this has two or more charge tokens on it, trash it and create ${a(dragon.name)} in your hand.`,
              `Otherwise, put a charge token on this.`],
        effect: (state:State, card:Card) => async function(state) {
            if (card.charge >= 2) {
                state = await create(dragon, 'hand')(state)
                state = await trash(card)(state)
                return state
            }
            else return charge(card, 1)(state)
        }
    }]
}
buyable(egg, 4)

const looter:CardSpec = {name: 'Looter',
    effects: [{
        text: [`Discard up to three cards from your hand.`,
            `+1 draw per card you discarded.`],
        effect: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to three cards to discard',
                state.hand.map(asChoice),
                xs => xs.length <= 3)
            state = await moveMany(targets, 'discard')(state)
            state = await draw(targets.length)(state)
            return state
        }
    }]
}
buyable(looter, 4)

const empire:CardSpec = {name: 'Empire',
    fixedCost: energy(1),
    effects: [drawEffect(3), gainPointsEffect(3)]
}
buyable(empire, 10)

const innovation:CardSpec = {name: 'Innovation',
    effects: [drawEffect(1), toPlay()],
    triggers: [{
        text: `When you create a card,
            if it's in your discard pile and this is in play,
            discard this and play the card.`,
        kind: 'create',
        handles: (e, state, card) => state.find(e.card).place == 'discard'
            && state.find(card).place == 'play',
        effect: (e, state, card) => doAll([move(card, 'discard'), playAgain(e.card)]),
    }]
}
buyable(innovation, 9)

const formation:CardSpec = {name: 'Formation',
    effects: [toPlay()],
    replacers: [{
        text: 'Cards in your hand cost @ less if you have a card with the same name'
         + ' in your discard pile or play.'
         + ' Whenever this reduces a cost, discard this and +$2.',
        kind: 'cost',
        handles: (e, state) => e.card.place == 'hand'
            && state.discard.concat(state.play).some(c => c.name == e.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoin(2)
                ])
                return {...x, cost:newCost}
            }
            return x
        }
    }]
}
buyable(formation, 4)

const Traveler = 'Traveler'
const traveler:CardSpec = {
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay a draw to play a card in your hand not named ${Traveler}.`,
            `If this has at least one charge token on it,
            play the card again if it's in your discard.`,
            `If this has at least two charge tokens on it,
            gain a fresh copy of the card in your discard.`,
            `If this has at least three charge tokens on it,
            play the card a third time if it's in your discard.`],
        effect: (state, card) => payToDo(payDraw, applyToTarget(
            target => async function(state){
                const n:number = state.find(card).charge
                state = await target.play(card)(state)
                state = tick(card)(state)
                if (n >= 1) state = await playAgain(target, card)(state);
                state = tick(card)(state)
                if (n >= 2) state = await create(target.spec, 'discard')(state);
                if (n >= 3) state = await playAgain(target, card)(state);
                return state
            },
            `Choose a card to play with ${Traveler}.`,
            state.hand.filter(x => x.name != Traveler)
        ))
    }, chargeUpTo(4)]
}
buyable(traveler, 5)

const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(1),
    effects: [{
        text: ['Set $ to 0, draws to 5, and buys to 1.'],
        effect: () => doAll([
            setResource('coin', 0),
            setResource('buys', 1),
            setResource('draws', 5),
        ])
    }]
}
buyable(fountain, 5)

const chameleon:CardSpec = {
    name:'Chameleon',
    replacers: [{
        text: `As long as this has a charge token on it,
        whenever you would gain $ instead gain that many draws and vice versa.`,
        kind: 'resource',
        handles: (x, state, card) => state.find(card).charge > 0,
        replace: x => ({...x, resource:
            (x.resource == 'coin') ? 'draws' :
            (x.resource == 'draws') ? 'coin' :
            x.resource })
    }],
    effects: [{
        text: [`If this has a charge token on it, remove all charge tokens.
        Otherwise, put a charge token on it.`],
        effect: (state, card) => (state.find(card).charge > 0) ?
            uncharge(card) : charge(card, 1),
    }]
}
registerEvent(chameleon)

const grandMarket:CardSpec = {
    name: 'Grand Market',
    effects: [gainCoinEffect(2), drawEffect(1), buyEffect()],
}
buyableAnd(grandMarket, 6, {restriction: {
    text: `You have no cards named ${copper.name} or ${silver.name} in your discard pile.`,
    test: (c:Card, s:State) => s.discard.every(x => x.name != copper.name && x.name != silver.name)
}})

const greatHearth:CardSpec = {
    name: 'Great Hearth',
    effects: [toPlay()],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, +1 draw.`,
        kind: 'play',
        handles: e => e.card.name == estate.name,
        effect: (e, state, card) => draw(1, card)
    }]
}
buyable(greatHearth, 3)

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [drawEffect(1), toPlay()],
    replacers: [{
        text: `${estate.name}s cost @ less.`,
        kind: 'cost',
        handles: x => x.card.name == estate.name,
        replace: x => ({...x, cost:subtractCost(x.cost, {energy:1})}),
    }]
}
buyable(homesteading, 3)

const duke:CardSpec = {
    name: 'Duke',
    effects: [toPlay()],
    triggers: [{
        text: `Whenever you play ${a(duchy.name)}, +1 vp.`,
        kind: 'play',
        handles: e => e.card.name == duchy.name,
        effect: (e, state, card) => gainPoints(1, card)
    }]
}
buyable(duke, 4)

const industry:CardSpec = {
    name: 'Industry',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 draw per card in play up to a max of 5.`],
        effect: (state, card) => draw(
            Math.min(state.play.length, 5),
            card
        )
    }]
}
buyable(industry, 4)


// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Money and buys',
    fixedCost: energy(0),
    effects: [gainCoinEffect(100), gainBuyEffect(100)],
}
cheats.push(freeMoney)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effects: [gainPointsEffect(10)],
}
cheats.push(freePoints)
