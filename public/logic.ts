export const VERSION = "0.1.1"

// ----------------------------- Formatting

export function renderCost(cost:Partial<Cost>): string {
    const parts:string[] = []
    for (const name of allCostResources) {
        const x:number|undefined = cost[name]
        if (x != undefined && x > 0) parts.push(renderResource(name, x))
    }
    return parts.join(' ')
}

function renderResource(resource:ResourceName, amount:number): string {
    if (amount < 0) return '-' + renderResource(resource, -amount)
    switch(resource) {
        case 'coin': return `$${amount}`
        case 'energy': return repeatSymbol('@', amount)
        case 'points': return `${amount} vp`
        case 'cards': return `${amount} card${amount == 1 ? '' : 's'}`
        case 'buys': return `${amount} buy${amount == 1 ? '' : 's'}`
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
    buyable?: {
        text:string, 
        test: (card:Card, state:State) => boolean;
    }
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
    cards: number;
    buys: number;
    effects: Transform[];
}
const free:Cost = {coin:0, energy:0, cards:0, buys:0, effects: []}

function addCosts(a:Cost, b:Partial<Cost>): Cost {
    return {
        coin:a.coin + (b.coin || 0),
        energy:a.energy+(b.energy || 0),
        cards:a.cards+(b.cards || 0),
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
        cards:Math.max(0, c.cards - (reduction.cards || 0)),
        buys:Math.max(0, c.buys - (reduction.buys || 0)),
        effects:c.effects,
    }
}

function eq(a:Cost, b:Cost): boolean {
    return a.coin == b.coin && a.energy == b.energy && a.cards == b.cards
}

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
    payCost(): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            state = state.log(`Paying for ${card.name}`)
            const cost:Cost = card.cost(state)
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
             state = await trigger({kind:'afterBuy', card:card, source:source})(state)
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
            const toZone:ZoneName|null = (effect['toZone'] === undefined) ? 'discard' : effect['toZone']
            const toLoc:InsertLocation = effect['toLoc'] || 'end'
            state = await move(card, toZone, toLoc, toZone == 'discard')(state)
            state = await trigger({kind:'afterPlay', card:card, source:source})(state)
            return state
        }
    }
    triggers(): TypedTrigger[] {
        if (this.spec.triggers == undefined) return []
        return this.spec.triggers(this)
    }
    buyable(state:State): boolean {
        if (this.spec.buyable == undefined) return true
        return this.spec.buyable.test(this, state)
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

type ZoneName = 'supply' | 'hand' | 'discard' | 'play' | 'aside' | 'events'
type PlaceName = ZoneName | null | 'resolving'

type Zone = Card[]

type Resolving = (Card|Shadow)[]

export type Replayable = number[]

interface Resources {
    coin:number;
    energy:number;
    cards:number;
    buys:number;
    points:number
}

type CostResourceName = 'coin' | 'energy' | 'cards' | 'buys'
const allCostResources:CostResourceName[] = ['coin', 'energy', 'cards', 'buys']
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
    public readonly cards:number;
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
        private readonly resources:Resources = {coin:0, energy:0, points:0, cards:0, buys:0},
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
        this.cards = resources.cards
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
    var replacers:TypedReplacer[] = state.events.concat(state.supply).concat(state.play).map(x => x.replacers()).flat()
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
        if (state.cards < c.cards) throw new CostNotPaid("Not enough cards")
        if (state.buys < c.buys) throw new CostNotPaid("Not enough buys")
        state = state.setResources({
            coin:state.coin - c.coin,
            cards:state.cards - c.cards,
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
            cards:state.cards,
            buys:state.buys,
        }
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
        return gainResource(resource, amount - state[resource], source)(state)
    }
}

function gainCards(n:number, source:Source=unk): Transform {
    return async function(state:State) {
        return gainResource('cards', n, source)(state)
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

function gainBuys(n:number, source:Source=unk): Transform {
    return gainResource('buys', n, source)
}

function draw(n:number, source:Source=unk): Transform {
    return gainResource('cards', n, source)
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
    return (cost.coin <= state.coin && cost.cards <= state.cards && cost.buys <= state.buys)
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
        'Buy an event, use a card in play, pay a buy to buy a card from the supply, or pay a card to play a card from your hand.',
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

function actCost(kind:'supply'|'event'|'play'): Cost {
    switch (kind) {
        case 'supply': return {...free, buys:1}
        case 'event': return free
        case 'play': return {...free, cards:1}
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
    const startingHand:CardSpec[] = [copper, copper, copper]
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

function supplyForCard(card:CardSpec, cost:Cost, extra:{
    triggers?:(c:Card) => TypedTrigger[]
    onBuy?:Transform
}={}): CardSpec  {
    return {name: card.name,
        fixedCost: cost,
        effect: (supply:Card) => ({
            text:`Create ${a(card.name)} in your discard pile.`,
            effect: doAll([create(card), extra.onBuy || noop])
        }),
        relatedCards: [card],
        triggers: extra.triggers,
    }
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

function registerEvent(card:CardSpec, test:'test'|null=null):void {
    eventMixins.push(card)
    if (test=='test') testEvents.push(card)
}


//
//
// ------ CORE ------
//

async function recycle(state:State): Promise<State> {
    state = await moveMany(state.discard, 'hand')(state)
    state = await moveMany(state.play, 'hand')(state)
    state = state.sortZone('hand')
    return state
}

function regroupText(n:number): string {
    return `Lose all $, cards, and buy. Put your discard pile and play into your hand. +${n} cards, +1 buy.`
}

function regroupEffect(n:number): Transform {
    return async function(state) {
        state = await setResource('coin', 0)(state)
        state = await setResource('cards', 0)(state)
        state = await setResource('buys', 0)(state)
        state = await recycle(state)
        state = await draw(n)(state)
        state = await gainBuys(1)(state)
        return state
    }
}

//TODO: make cards only buyable under certain conditions?
const regroup:CardSpec = {name: 'Regroup',
    fixedCost: energy(4),
    effect: card => ({
        text: regroupText(5),
        effect: regroupEffect(5)
    })
}
coreEvents.push(regroup)

const copper:CardSpec = {name: 'Copper',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$1',
        effect: gainCoin(1),
    })
}
coreSupplies.push(supplyForCard(copper, coin(0)))

const silver:CardSpec = {name: 'Silver',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$2',
        effect: gainCoin(2)
    })
}
coreSupplies.push(supplyForCard(silver, coin(3)))

const gold:CardSpec = {name: 'Gold',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$3',
        effect: gainCoin(3)
    })
}
coreSupplies.push(supplyForCard(gold, coin(6)))

const estate:CardSpec = {name: 'Estate',
    fixedCost: energy(1),
    effect: card => ({
        text: '+1vp',
        effect: gainPoints(1),
    })
}
coreSupplies.push(supplyForCard(estate, coin(2)))

const duchy:CardSpec = {name: 'Duchy',
    fixedCost: energy(1),
    effect: card => ({
        text: '+2vp',
        effect: gainPoints(2),
    })
}
coreSupplies.push(supplyForCard(duchy, coin(4)))

const province:CardSpec = {name: 'Province',
    fixedCost: energy(1),
    effect: card => ({
        text: '+3vp',
        effect: gainPoints(3),
    })
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
    register(supplyForCard(card, {...free, coin:n}), test)
}

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

function descriptorForZone(zone:'hand'|'supply'|'events'):string {
    switch (zone) {
        case 'hand': return 'Cards in your hand'
        case 'supply': return 'Cards in the supply'
        case 'events': return 'Events'
        default: return assertNever(zone)
    }
}

function costReduce(card:Card, zone:'hand'|'supply'|'events', reduction:Partial<Cost>): Replacer<CostParams> {
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
    card:Card,
    zone:'hand'|'supply'|'events',
    reduction:Partial<Cost>,
    nonzero:boolean=false
): Replacer<CostParams> {
    const descriptor = descriptorForZone(zone)
    return {
        text: `${descriptor} cost ${renderCost(reduction)} less${nonzero ? ', but not zero.' : '.'}
        Whenever this reduces a cost, discard this.`,
        kind: 'cost',
        handles: () => true,
        replace: function(x:CostParams, state:State) {
            if (x.card.place == zone) {
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
            }
            return x
        }
    }
}


function buyableFree(card:CardSpec, coins:number, test:'test'|null=null): void {
    const supply:CardSpec = {name: card.name,
        fixedCost: coin(coins),
        effect: (supply:Card) => ({
            text:`+1 buy. Create ${a(card.name)} in your discard pile.`,
            effect: doAll([gainBuys(1), create(card)]),
        }),
        relatedCards: [card],
    }
    register(supply, test)
}


const necropolis:CardSpec = {name: 'Necropolis',
    effect: card => ({
        text: 'Put this in play.',
        effect: noop,
        toZone: 'play',
    }),
    replacers: card => [costReduceNext(card, 'hand', {energy:1})],
}
buyableFree(necropolis, 2)

const hound:CardSpec = {name: 'Bloodhound',
    fixedCost: energy(1),
    effect: card => ({
        text: '+2 cards.',
        effect: gainCards(2),
    })
}
buyableFree(hound, 2)

const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effect: card => ({
        text: '+3 cards.',
        effect: gainCards(3),
    })
}
buyable(smithy, 4)

const village:CardSpec = {name: 'Village',
    effect: cantripPlay,
    replacers: card => [costReduceNext(card, 'hand', {energy:1})],
}
buyable(village, 4)

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effect: card => ({
        text: '+1 buy. Put this in play',
        effect: gainResource('buys', 1),
        toZone: 'play'
    }),
    replacers: card => [costReduce(card, 'supply', {coin:1})]
}
buyable(bridge, 6)

const coven:CardSpec = {name: 'Coven',
    effect: justPlay,
    replacers: card => [{
        text: 'Cards in your hand cost @ less if you have no card with the same name'
         + ' in your discard pile or play.'
         + ' Whenever this reduces a cost, discard this and +$2.',
        kind: 'cost',
        handles: (e, state) => (state.discard.concat(state.play).every(c => c.name != e.card.name)),
        replace: function(x:CostParams, state:State) {
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
    effect: card => ({
        text: '+2 cards.',
        effect: gainResource('cards', 2),
    }),
}
buyable(lab, 5)

function justPlay(card:Card): Effect {
    return {
        text: 'Put this in play.',
        toZone: 'play',
        effect: noop
    }
}
function cantripPlay(card:Card): Effect {
    return {
        text: '+1 card. Put this in play.',
        toZone: 'play',
        effect: gainCards(1),
    }
}

const throneRoom:CardSpec = {name: 'Throne Room',
    fixedCost: energy(1),
    effect: card => ({
        text: `Pay 1 card to play a card in your hand. Then if it's in your discard pile play it again.`,
        effect: payToDo(payCost({...free, cards:1}), async function(state) {
            let target; [state, target] = await choice(state,
                'Choose a card to play twice.',
                state.hand.map(asChoice))
            if (target == null) return state
            state = await target.play(card)(state)
            state = tick(card)(state)
            return playAgain(target, card)(state)
        })
    })
}
buyable(throneRoom, 5, 'test')

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    effect: justPlay,
    triggers: card => [{
        kind: 'play',
        text: `When you play a copper, +$1.`,
        handles: e => e.card.name == copper.name,
        effect: e => gainCoin(1),
    }]
}
buyable(coppersmith, 4)

const scavenger:CardSpec = {name: 'Scavenger',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$2. Put a card from your discard pile into yor hand.',
        effect: async function(state) {
            state = await gainCoin(2)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to put in your hand',
                state.discard.map(asChoice)
            )
            if (target != null) state = await move(target, 'hand')(state)
            return state
        }
    })
}
buyable(scavenger, 4)

const celebration:CardSpec = {name: 'Celebration',
    fixedCost: energy(2),
    effect: justPlay,
    replacers: card => [costReduce(card, 'hand', {energy:1})]
}
buyable(celebration, 12)

const plough:CardSpec = {name: 'Plough',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Put your discard pile and play into your hand.',
        effect: recycle
    })
}
buyable(plough, 4)

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effect: justPlay,
    triggers: card => [{
        text: 'Whenever you pay @, + that many cards.',
        kind: 'cost',
        handles: () => true,
        effect: e => draw(e.cost.energy)
    }]
}
buyable(oldSmith, 3)

//TODO: I would prefer 'other than with this'
const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:2, coin:5},
    effect: card => ({
        text: 'Put a mirror token on each card in your hand.',
        effect: async function(state) {
            return doAll(state.hand.map((c:Card) => addToken(c, 'mirror')))(state)
        }
    }),
    triggers: card => [{
        text: 'Whenever you finish playing a card with a mirror token on it the normal way,' +
           ` if it's in your discard pile remove a mirror token and play it again.`,
        kind:'afterPlay',
        handles: (e, state) => state.find(e.card).count('mirror') > 0 && e.source.name == 'act',
        effect: e => doAll([playAgain(e.card), removeToken(e.card, 'mirror')]),
    }]
}
registerEvent(hallOfMirrors)

function costPlus(initial:Cost, increment:Cost): CalculatedCost {
    return {
        calculate: function(card:Card, state:State) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).charge))
        },
        text: `${renderCost(initial)} plus ${renderCost(increment)} for each charge counter on this.`,
    }
}

const retrench:CardSpec = {name: 'Retrench',
    calculatedCost: costPlus({...free, energy:2, coin:1}, coin(1)),
    effect: card => ({
        text: 'Put a charge token on this. ' + regroupText(5),
        effect: doAll([charge(card, 1), regroupEffect(5)])
    })
}
registerEvent(retrench)

const respite:CardSpec = {name:'Respite',
    fixedCost: energy(2),
    effect: card => ({
        text: regroupText(2),
        effect: regroupEffect(2)
    })
}
registerEvent(respite)

const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    fixedCost: energy(2),
    buyable: {
        text: 'You have no cards in hand.',
        test: (card, state) => state.hand.length == 0
    },
    effect: card => ({
        text: regroupText(4),
        effect: regroupEffect(4)
    })
}
registerEvent(perpetualMotion)

const desperation:CardSpec = {name:'Desperation',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$1.',
        effect: gainCoin(1),
    })
}
registerEvent(desperation)

const fairEffect:CardSpec = {name:'Traveling Fair',
    triggers: card => [{
        text:`When you create a card, if it's in your discard pile trash this and put it into your hand.`,
        kind:'create',
        handles: (e, state) => (state.find(e.card).place == 'discard'),
        effect: e => doAll([trash(card), move(e.card, 'hand')])
    }],
    replacers: card => [fragile(card)],
}


const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(2),
    effect: card => ({
        text: `+1 buy. Next time you gain a card this turn, if it's in your discard pile, put it into your hand.`,
        effect: doAll([gainBuys(1), create(fairEffect, 'play')])
    })
}
registerEvent(travelingFair)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:10, energy:2},
    effect: card => ({
        text: 'Lose all $, then +1 vp per coin lost.',
        effect: async function(state) {
            const n = state.coin
            state = await gainCoin(-n)(state)
            state = await gainPoints(n)(state)
            return state
        }
    })
}
registerEvent(philanthropy)

const storytelling:CardSpec = {name: 'Storytelling',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Lose all $. +1 card per $ you lost.',
        effect: async function(state) {
            const n = state.coin
            state = await setResource('coin', 0)(state)
            state = await draw(n)(state)
            return state
        }
    })
}
registerEvent(storytelling)

const monument:CardSpec = {name: 'Monument',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$2, +1 vp.',
        effect: doAll([gainCoin(2), gainPoints(1)])
    })
}
buyable(monument, 2)

const repurpose:CardSpec = {name: 'Repurpose',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Lose all $ and buys. Put your discard pile and play into your deck. +1 buy.',
        effect: async function(state) {
            return regroupEffect(state.cards)(state)
        }
    })
}
registerEvent(repurpose)

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effect: card => ({
        text: '+1 vp, +1 card.',
        effect: doAll([gainPoints(1), draw(1)])
    })
}
buyable(vibrantCity, 7)

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Add a charge token to this if it has less than 5, then +1 vp per charge token on this.',
        effect: async function(state) {
            card = state.find(card)
            if (card.charge < 5) state = await charge(card, 1)(state);
            card = state.find(card)
            if (card.place != null) state = await gainPoints(card.charge)(state);
            return state
        },
    })
}
buyable(frontier, 8)

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Add a charge token to this if it has less than 5, then +$1 per charge token on this.',
        effect: async function(state) {
            card = state.find(card)
            if (card.charge < 5) state = await charge(card, 1)(state);
            card = state.find(card)
            if (card.place != null) state = await gainCoin(card.charge)(state);
            return state
        },
    })
}
buyable(investment, 4)

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:12, energy:3},
    effect: card => ({
        text: 'Buy any number of cards in the supply.',
        effect: async function(state) {
            let options:Card[] = state.supply.filter(c => c.id != card.id)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to buy next.',
                    allowNull(options.map(asChoice)))
                if (picked == null) {
                    return state
                } else {
                    const id = picked.id
                    options = options.filter(c => c.id != id)
                    state = await picked.buy(card)(state)
                }
            }
        }
    })
}
registerEvent(populate)

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:5, energy:1},
    effect: card => ({
        text: `Put a duplicate token on each card in the supply.`,
        effect: async function(state) {
            return doAll(state.supply.map(c => addToken(c, 'duplicate')))(state)
        }
    }),
    triggers: card => [{
        text: `After buying a card with a duplicate token on it the normal way, remove a duplicate tokens from it and buy it again.`,
        kind:'afterBuy',
        handles: (e, state) => {
            if (e.source.name != 'act') return false
            const target:Card = state.find(e.card);
            return target.place != null && target.count('duplicate') > 0
        },
        effect: e => doAll([removeToken(e.card, 'duplicate'), e.card.buy(card)])
    }]
}
registerEvent(duplicate)

const royalSeal:CardSpec = {name: 'Royal Seal',
    effect: card => ({
        text: '+$2. Put this in play.',
        effect: gainCoin(2),
        toZone:'play',
    }),
    triggers: card => [{
        text: `Whenever you create a card, if it's in your discard pile
               and this is in play, discard this and put the card into your hand.`,
        kind: 'create',
        handles: (e, state) => state.find(e.card).place == 'discard' && state.find(card).place == 'play',
        effect: e => doAll([move(card, 'discard'), move(e.card, 'hand')])
    }]
}
buyable(royalSeal, 6)

const workshop:CardSpec = {name: 'Workshop',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Buy a card in the supply costing up to $4.',
        effect: async function(state) {
            const options = state.supply.filter(card => (card.cost(state).coin <= 4 && card.cost(state).energy <= 0));
            let target;
            [state, target] = await choice(state, 'Choose a card costing up to $4 to buy.',options.map(asChoice))
            return (target == null) ? state : target.buy(card)(state)
        }
    })
}
buyable(workshop, 3)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effect: card => ({
        text: "+$2. Put this in play.",
        effect: gainCoin(2),
        toZone:'play'
    }),
    triggers: card => [{
        text: "When you finish buying a card or event the normal way,"
            + " if this is in play and that card hasn't moved, discard this and buy that card again.",
        kind: 'afterBuy',
        handles: (e, state) => (e.source.name == 'act' && state.find(card).place == 'play'),
        effect: e => async function(state) {
            const bought:Card = state.find(e.card)
            state = await move(card, 'discard')(state)
            if (bought.place == e.card.place) state = await bought.buy(card)(state)
            return state
        }
    }]
}
buyable(shippingLane, 5)

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Buy a card in the supply costing up to $6.',
        effect: async function(state) {
            const options = state.supply.filter(card => (card.cost(state).coin <= 6 && card.cost(state).energy <= 0));
            let target;
            [state, target] = await choice(state, 'Choose a card costing up to $6 to buy.',options.map(asChoice))
            return (target == null) ? state : target.buy(card)(state)
        }
    })
}
buyable(factory, 4)

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Choose a card in your hand. Create a fresh copy of it in your hand.',
        effect: async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to replicate.', state.hand.map(asChoice))
            if (target != null) state = await create(target.spec, 'hand')(state)
            return state
        }
    })
}
buyable(imitation, 4, 'test')

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$5. +1 buy. Trash this.',
        toZone: null,
        effect: doAll([gainCoin(5), gainBuys(1)]),
    })
}
buyable(feast, 4)

const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(10)),
    effect: card => ({
        text: `Put a charge token on this.`,
        effect: charge(card, 1),
    }),
    replacers: card => [{
        text: `${regroup.name} costs @ less to play for each charge counter on this.`,
        kind:'cost',
        handles: x => (x.card.name == regroup.name),
        replace: x => ({...x, cost:subtractCost(x.cost, {energy:card.charge})})
    }]
}
registerEvent(mobilization)

const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Put your discard pile into your hand.',
        effect: async function(state) { 
            state = await moveMany(state.discard, 'hand')(state)
            state = state.sortZone('hand')
            return state
        }
    })
}
registerEvent(refresh)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:8},
    effect: card => ({
        text: 'Put a twin token on a card in your hand.',
        effect: async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to put a twin token on.',
                state.hand.map(asChoice))
            if (target == null) return state
            return addToken(target, 'twin')(state)
        }
    }),
    triggers: card => [{
        text: `After playing a card with a twin token other than with this, if it's in your discard pile play it again.`,
        kind: 'afterPlay',
        handles:e => (e.card.count('twin') > 0 && e.source.id != card.id),
        effect:e => async function(state) {
            const target = state.find(e.card)
            return (target.place == 'discard' && target.count('twin') > 0) ? target.play(card)(state) : state
        }
    }],
}
registerEvent(twin)

const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Add a charge token to this if it has less than 5, then +1 card per charge token on this.',
        effect: async function(state) {
            card = state.find(card)
            if (card.charge < 5) state = await charge(card, 1)(state);
            card = state.find(card)
            if (card.place != null) state = await draw(card.charge)(state);
            return state
        },
    })
}
buyable(youngSmith, 2)

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Create two golds in your hand.',
        effect: doAll([create(gold, 'hand'), create(gold, 'hand')]),
    })
}
buyable(goldMine, 8)

function fragile(card:Card):Replacer<MoveParams> {
    return {
        text: 'Whenever this would leave play, trash it instead.',
        kind: 'move',
        handles: x => x.card.id == card.id,
        replace: x => ({...x, toZone:null})
    }
}

const expediteEffect:CardSpec = {name: 'Expedite',
    triggers: card => [{
        text: `When you create a card, if it's in your discard pile and this is in play,`
        + ` trash this and play the new card.`,
        kind: 'create',
        handles: (e, state) => state.find(e.card).place == 'discard' && state.find(card).place =='play',
        effect: e => doAll([trash(card), playAgain(e.card, card)])
    }],
    replacers: card => [fragile(card)],
}
const expedite:CardSpec = {name: 'Expedite',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: card => ({
        text: "The next time you create a card in your discard pile, play it. Put a charge token on this.",
        effect: doAll([create(expediteEffect, 'play'), charge(card, 1)])
    })
}
registerEvent(expedite)

function leq(cost1:Cost, cost2:Cost) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy
}
const makeSynergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:5, energy:1},
    effect: card => ({
        text: 'Remove all synergy tokens from cards in the supply or events,'+
        ` then put synergy tokens on two cards in the supply or events.`,
        effect: async function(state) {
            for (const card of state.supply.concat(state.events)) 
                if (card.count('synergy') > 0)
                    state = await removeTokens(card, 'synergy')(state)
            let cards:Card[]; [state, cards] = await multichoiceIfNeeded(state,
                'Choose two cards to synergize.',
                state.supply.concat(state.events).map(asChoice), 2, false)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }),
    triggers: card => [{
        text: 'Whenever you buy a card with a synergy token other than with this,'
        + ' afterwards buy a different card with a synergy token with equal or lesser cost.',
        kind:'afterBuy',
        handles: e => (e.source.id != card.id && e.card.count('synergy') > 0),
        effect: e => async function(state) {
            const options:Card[] = state.supply.concat(state.events).filter(
                c => c.count('synergy') > 0
                && leq(c.cost(state), e.card.cost(state))
                && c.buyable(state)
                && c.id != e.card.id
            )
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to buy.', options.map(asChoice))
            if (target == null) {
                return state
            } else {
                return target.buy(card)(state)
            }
        }
    }]
}
registerEvent(makeSynergy)

const bustlingSquare:CardSpec = {name: 'Bustling Square',
    fixedCost: energy(2),
    effect: card => ({
        text: `Lose all cards. Set aside up to that many cards, then play them.`,
        effect: async function(state) {
            const n:number = state.cards
            state = await setResource('cards', 0)(state)
            let targets:Card[]; [state, targets] = await multichoiceIfNeeded(state,
                `Choose up to ${n} cards to set aside then play.`,
                state.hand.map(asChoice), n, true)
            state = await moveMany(targets, 'aside')(state)
            return doAll(targets.map(c => c.play(card)))(state)
        }
    })
}
buyable(bustlingSquare, 6)

const market:CardSpec = {name: 'Market',
    effect: card => ({
        text: '+1 card. +$1. +1 buy.',
        effect: doAll([gainCards(1), gainCoin(1), gainBuys(1)]),
    })
}
buyable(market, 5)

const spree:CardSpec = {name: 'Spree',
    fixedCost: energy(1),
    effect: card => ({
        text: '+1 buy.',
        effect: gainBuys(1),
    })
}
registerEvent(spree)

const counterfeit:CardSpec = {name: 'Counterfeit',
    effect: card => ({
        text: '+1 card. Play a card in your hand, then trash it. +1 buy.',
        effect: async function(state) {
            state = await gainCards(1)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to play then trash',
                state.hand.map(asChoice))
            if (target != null) state = await doAll([target.play(card), trash(target), gainBuys(1)])(state)
            return state
        }
    })
}
buyable(counterfeit, 4)

const ruinedMarket:CardSpec = {name: 'Ruined Market',
    effect: card => ({
        text: '+1 buy',
        effect: gainBuys(1)
    })
}
buyableFree(ruinedMarket, 2)

const spices:CardSpec = {name: 'Spices',
    effect: card => ({
        text: '+$2. +1 buy.',
        effect: doAll([gainCoin(2), gainBuys(1)]),
    })
}
register(supplyForCard(spices, coin(5), {onBuy:gainCoin(3)}))

const onslaught:CardSpec = {name: 'Onslaught',
    calculatedCost: costPlus(coin(8), energy(1)),
    effect: card => ({
        text: 'Put a charge counter on this. Play any number of cards from your hand.',
        effect: async function(state) {
            state = await charge(card, 1)(state)
            let options:Option<Card>[] = asNumberedChoices(state.hand)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    return state
                } else {
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                    state = await picked.play(card)(state)
                }
            }
        }
    })
}
registerEvent(onslaught)

//TODO: link these together, modules in general?

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effect: card => ({
        text: '+5 vp',
        effect: gainPoints(5),
    })
}
buyable(colony, 16, 'test')

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effect: card => ({
        text: '+$5',
        effect: gainCoin(5)
    })
}
buyable(platinum, 10, 'test')

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effect: card => ({
        text: '+5 cards',
        effect: draw(5),
    })
}
buyable(greatSmithy, 7)

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Discard your hand, lose all $, set cards to 5.',
        effect: async function(state) {
            return doAll([
                setResource('coin', 0),
                setResource('cards', 5),
            ])(state)
        }
    })
}
const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effect: card => ({
        text: `Pay 1 card to play a card in your hand.
        Then if it's in your discard pile, play it again.
        Then if it's in your discard pile, play it a third time.`,
        effect: payToDo(payCost({...free, cards:1}), async function(state) {
            let target; [state, target] = await choice(state,
                'Choose a card to play three times.',
                state.hand.map(asChoice))
            if (target == null) return state
            state = await target.play(card)(state)
            state = tick(card)(state)
            state = await playAgain(target, card)(state)
            state = tick(card)(state)
            state = await playAgain(target, card)(state)
            return state
        })
    })
}
buyable(kingsCourt, 10, 'test')

const gardens:CardSpec = {name: "Gardens",
    fixedCost: energy(1),
    effect: card => ({
        text: "+1 vp per 10 cards in your hand.",
        effect: async function(state) {
            const n = state.hand.length;
            return gainPoints(Math.floor(n/10))(state)
        }
    })
}
buyable(gardens, 7)

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(3),
    effect: card => ({
        text: 'Remove a decay token from each card in your discard pile.',
        effect: async function(state) {
            return doAll(state.discard.map(x => removeToken(x, 'decay')))(state)
        }
    }),
    triggers: card => [{
        text: 'Whenever you move a card to your hand, if it has 3 or more decay tokens on it trash it,'+
            ' otherwise put a decay token on it.',
        kind: 'move',
        handles: e => e.toZone == 'hand',
        effect: e => (e.card.count('decay') >= 3) ? trash(e.card) : addToken(e.card, 'decay')
    }]
}
registerEvent(decay)

const reflect:CardSpec = {name: 'Reflect',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: card => ({
        text: `Put a charge token on this.
               Pay a card to play a card in your hand. Then if it's in your discard pile, play it again.`,
        effect: doAll([charge(card, 1), payToDo(payCost({...free, cards:1}), playTwice(card))])
    })
}
registerEvent(reflect)

const replicate:CardSpec = {name: 'Replicate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: card => ({
        text: `Put a charge token on this.
               Choose a card in your hand. Create a fresh copy of it in your discard pile.`,
        effect: async function(state) {
            state = await charge(card, 1)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to replicate.', state.hand.map(asChoice))
            if (target != null) state = await create(target.spec, 'discard')(state)
            return state
        }
    })
}
registerEvent(replicate, 'test')

const inflation:CardSpec = {name: 'Inflation',
    fixedCost: energy(3),
    effect: card => ({
        text: '+$15. +5 buys. Put a charge token on this.',
        effect: doAll([gainCoin(15), gainBuys(5), charge(card, 1)])
    }),
    replacers: card => [{
        text: 'Cards that cost at least $1 cost $1 more per charge token on this.',
        kind: 'cost',
        handles: (p, state) => (p.cost.coin >= 1),
        replace: p => ({...p, cost:addCosts(p.cost, {coin:card.charge})})
    }]
}
registerEvent(inflation)

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Remove a burden token from a card in the supply',
        effect: async function(state) {
            const options = state.supply.filter(x => x.count('burden') > 0)
            let target; [state, target] = await choice(state, 'Choose a supply to unburden.',
                allowNull(options.map(asChoice)))
            if (target == null) return state
            return removeToken(target, 'burden')(state)
        }
    }),
    triggers: card => [{
        text: 'Whenever you buy a card costing $, put a burden token on it.',
        kind:'buy',
        handles: (e, state) => (e.card.cost(state).coin >= 1),
        effect: e => addToken(e.card, 'burden')
    }],
    replacers: card => [{
        kind: 'cost',
        text: 'Cards cost $1 more for each burden token on them.',
        handles: x => x.card.count('burden') > 0,
        replace: x => ({...x, cost: addCosts(x.cost, {coin:x.card.count('burden')})})
    }]
}
registerEvent(burden)

const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effect: card => ({
        text: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    })
}
buyable(goldsmith, 7)

const publicWorks:CardSpec = {name: 'Public Works',
    effect: justPlay,
    replacers: card => [costReduceNext(card, 'events', {energy:1}, true)],
}
buyable(publicWorks, 5, 'test')



// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Money and buys',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$100, +100 buys',
        effect: doAll([gainCoin(100), gainBuys(100)])
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
