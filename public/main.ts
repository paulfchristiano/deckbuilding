// TODO: would be nice to have 'space' as the default done hint
// TODO: make calculated costs render as "(cost) X"
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: if a zone gets bigger and then smaller, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay out the zones a bit more nicely
// TODO: starting to see performance hiccups in big games
// TODO: probably just want to stop things moving in/out of resolving, as if they didn't exist...
// TODO: it basically breaks the game if you move stuff from set aside or play without putting them there,
// I could probably enforce that through type system

// ----------------------------- Cards

interface CardSpec {
    name: string;
    fixedCost?: Cost;
    calculatedCost?: (card:Card, state:State) => Cost;
    relatedCards?: CardSpec[];
    effect?: (card:Card) => Effect;
    triggers?: (card:Card) => TypedTrigger[];
    abilities?: (card:Card) => Ability[];
    replacers?: (card:Card) => TypedReplacer[];
}

interface Cost {
    coin: number
    energy: number
}


interface Effect {
    text: string;
    toZone?: ZoneName | null;
    toLoc?: InsertLocation;
    effect: Transform;
}

interface Trigger <T extends GameEvent = any> {
    text: string;
    kind: T['kind'];
    handles: (e:T, s:State) => boolean;
    effect: (e:T) => Transform;
}

interface Replacer <T extends Params = any> {
    text: string;
    kind: T['kind'];
    handles: (p:T, s:State) => boolean;
    replace: (p:T, s:State) => T;
}

interface Ability {
    text: string;
    cost: Transform;
    effect: Transform;
}

interface Source {
    id?: number;
    name: string;
}

function read<T>(x:any, k:string, fallback:T) {
    return (x[k] == undefined) ? fallback : x[k]
}

interface CardUpdate {
    charge?: number;
    ticks?: number[];
    tokens?: string[];
    zoneIndex?: number;
}

class Card {
    readonly name: string;
    constructor(
        public readonly spec:CardSpec,
        public readonly id:number,
        public readonly charge:number = 0,
        public readonly ticks: number[] = [0],
        public readonly tokens: string[] = [],
        // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
        public readonly zoneIndex = 0,
    ) {
        this.name = spec.name
    }
    toString():string {
        return this.name
    }
    update(newValues: CardUpdate): Card {
        return new Card(
            this.spec,
            this.id,
            read(newValues, 'charge', this.charge),
            read(newValues, 'ticks', this.ticks),
            read(newValues, 'tokens', this.tokens),
            read(newValues, 'zoneIndex', this.zoneIndex),
        )
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
            return this.spec.calculatedCost(this, state)
        else
            return {coin:0, energy:0}
    }
    // the cost after replacement effects
    cost(state:State): Cost {
        const card:Card = this
        const initialCost:CostParams = {kind:'cost', card:card, cost:card.baseCost(state)}
        //TODO: would be nice to type check manipulations of these params, but seems harder
        const newCost:Params = replace(initialCost, state)
        return newCost.cost
    }
    // the transformation that actually pays the cost
    payCost(): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            state = state.log(`Paying for ${card.name}`)
            return withTracking(async function(state:State): Promise<State> {
                const cost:Cost = card.cost(state)
                state = await gainEnergy(cost.energy)(state)
                state = await payCoin(cost.coin)(state)
                return state
            }, {kind:'effect', card:card})(state)
        }
    }
    effect(): Effect {
        if (this.spec.effect == undefined) return {text: '', effect: noop}
        return this.spec.effect(this)
    }
    buy(source:Source={name:'?'}): Transform {
        let card:Card = this
        return async function(state:State): Promise<State> {
            const result:FindResult = state.find(card)
            if (!result.found)
                return state
            card = result.card
            state = await (state)
            state = state.log(`Buying ${card.name}`)
            state = await withTracking(doAll([
                trigger({kind:'buy', card:card, source:source}),
                card.effect().effect,
             ]), {kind:'effect', card:card})(state)
             state = await trigger({kind:'afterBuy', before:card, after:state.find(card).card, source:source})(state)
            return state
        }
    }
    play(source:Source={name:'?'}): Transform {
        const effect:Effect = this.effect()
        let card:Card = this
        return async function(state:State):Promise<State> {
            const result = state.find(card)
            switch (result.found) {
                case false:
                    return state
                case true:
                    card = result.card
            }
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
            state = await trigger({kind:'afterPlay', before:card, after:state.find(card).card, source:source})(state)
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

type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

type ReplayableKind = 'rng' | 'choice' | 'multichoice'

interface RNGReplayable {
    kind: 'rng';
    value: number;
}
interface ChoiceReplayable {
    kind: 'choice';
    value: number;
}
interface MultichoiceReplayable {
    kind: 'multichoice';
    value: [number];
}
type Replayable = RNGReplayable | ChoiceReplayable | MultichoiceReplayable

type InsertLocation = 'bottom' | 'top' | 'start' | 'end' | 'handSort'

type ZoneName = 'supply' | 'hand' | 'deck' | 'discard' | 'play' | 'aside'
type PlaceName = ZoneName | null | 'resolving'

type Zone = Card[]

type Resolving = (Card|Shadow)[]

interface Counters {
    coin:number;
    energy:number;
    points:number
}

type CounterName = 'coin' | 'energy' | 'points'

interface StateUpdate {
    counters?:Counters;
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

class State {
    public readonly coin:number;
    public readonly energy:number;
    public readonly points:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly deck:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly aside:Zone;
    constructor(
        public readonly spec: GameSpec,
        private readonly counters:Counters = {coin:0, energy:0, points:0},
        private readonly zones:Map<ZoneName,Zone> = new Map(),
        public readonly resolving:Resolving = [],
        private readonly nextID:number = 0,
        private readonly history: Replayable[] = [],
        private readonly future: Replayable[] = [],
        private readonly checkpoint: State|null = null,
        public readonly logs: string[] = [],
        private readonly logIndent: number = 0,
    ) {
        this.coin = counters.coin
        this.energy = counters.energy
        this.points = counters.points

        this.supply = zones.get('supply') || []
        this.hand = zones.get('hand') || []
        this.deck = zones.get('deck') || []
        this.discard= zones.get('discard') || []
        this.play = zones.get('play') || []
        this.aside = zones.get('aside') || []
    }
    private update(stateUpdate:StateUpdate) {
        return new State(
            this.spec,
            read(stateUpdate, 'counters', this.counters),
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
    addResolving(x:Card|Shadow): State {
        return this.update({resolving: this.resolving.concat([x])})
    }
    popResolving(): State {
        return this.update({resolving: this.resolving.slice(0, this.resolving.length-1)})
    }
    addToZone(card:Card, zone:ZoneName|'resolving', loc:InsertLocation='end'): State {
        //if (zone == 'hand') loc = 'handSort'
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
    setCoin(n:number): State {
        return this.update({counters: {coin:n, energy:this.energy, points:this.points}})
    }
    addShadow(spec:ShadowSpec): State {
        let state:State = this
        let id:number; [state, id] = state.makeID()
        let shadow:Shadow = new Shadow(id, spec)
        return state.addResolving(shadow)
    }
    setEnergy(n:number): State {
        return this.update({counters: {coin:this.coin, energy:n, points:this.points}})
    }
    setPoints(n:number): State {
        return this.update({counters: {coin:this.coin, energy:this.energy, points:n}})
    }
    find(card:Card|null): FindResult {
        if (card == null) return notFound
        for (let [name, zone] of this.zones) {
            const matches:Card[] = zone.filter(c => c.id == card.id)
            if (matches.length > 0) return {found:true, card:matches[0], place:name}
        }
        const name = 'resolving', zone = this.resolving;
        const matches:Card[] = (zone.filter(c => c.id == card.id) as Card[])
        if (matches.length > 0) return {found:true, card:matches[0], place:name}
        return notFound
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
        const record:Replayable|null = this.lastReplayable()
        return (record != null && (record.kind == 'choice' || record.kind == 'multichoice'))
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


const emptyState:State = new State(
    {seed:'', kingdom:null, testing:false},
    {coin:0, energy:0, points:0},
    new Map([ ['supply', []], ['hand', []], ['deck', []], ['discard', []], ['play', []], ['aside', []] ]),
    [], 0, [], [], null, [], 0 // resolving, nextID, history, future, checkpoint, logs, logIndent
)


// ---------- Methods for inserting cards into zones

// tests whether card1 should appear before card2 in sorted order

function comesBefore(card1:Card, card2:Card): boolean  {
    const key = (card:Card) => card.name + card.charge + card.tokens.join('')
    return key(card1) < (key(card2))
}

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
        case 'handSort':
            for (var i = 0; i < zone.length; i++) {
                if (comesBefore(card, zone[i])) return insertInto(card, zone, i)
            }
            return zone.concat([card])
        default: return assertNever(loc)
    }
}

// --------------------- Events and triggers

interface BuyEvent {kind:'buy'; card:Card; source:Source}
interface AfterBuyEvent {kind:'afterBuy'; before:Card; after:Card|null; source:Source}
interface PlayEvent {kind:'play'; card:Card; source:Source}
interface AfterPlayEvent {kind:'afterPlay'; before:Card; after:Card|null; source:Source}
interface CreateEvent {kind:'create', card:Card, zone:ZoneName}
interface MoveEvent {kind:'move', fromZone:PlaceName, toZone:PlaceName, loc:InsertLocation, card:Card}
interface RecycleEvent {kind:'recycle', cards:Card[]}
interface DiscardEvent {kind:'discard', cards:Card[]}
interface DrawEvent {kind:'draw', cards:Card[], drawn:number, triedToDraw:number, source:Source}
interface GainEnergyEvent {kind:'gainEnergy', amount:number}
interface GainCoinEvent {kind:'gainCoin', amount:number, cost:boolean}
interface GainPointsEvent {kind:'gainPoints', amount:number, source:Source}
interface GainChargeEvent {kind:'gainCharge', card:Card, oldCharge:number, newCharge:number, cost:boolean}
interface RemoveTokensEvent { kind:'removeTokens', card:Card, token:string, removed:number }
interface AddTokenEvent {kind: 'addToken', card:Card, token:string}
interface GameStartEvent {kind:'gameStart' }

type GameEvent = BuyEvent | AfterBuyEvent | PlayEvent | AfterPlayEvent |
    CreateEvent | MoveEvent | RecycleEvent | DrawEvent | DiscardEvent |
    GainCoinEvent | GainEnergyEvent | GainPointsEvent |
    GainChargeEvent | RemoveTokensEvent | AddTokenEvent |
    GameStartEvent
type TypedTrigger = Trigger<BuyEvent> | Trigger<AfterBuyEvent> | Trigger<PlayEvent> | Trigger<AfterPlayEvent> |
    Trigger<CreateEvent> | Trigger<MoveEvent> | Trigger<RecycleEvent> | Trigger<DrawEvent> | Trigger<DiscardEvent> |
    Trigger<GainCoinEvent> | Trigger<GainEnergyEvent> | Trigger<GainPointsEvent> |
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
interface RecycleParams {kind:'recycle', cards:Card[]}

type Params = GainPointsParams | CostParams | DrawParams | RecycleParams
type TypedReplacer = Replacer<GainPointsParams> | Replacer<CostParams> | Replacer<DrawParams> |
    Replacer<RecycleParams>

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

class Shadow {
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
        let id:number; [state, id] = state.makeID()
        const card:Card = new Card(spec, id)
        state = state.addToZone(card, zone, loc)
        state = state.log(`Created ${a(card.name)} in ${zone}`)
        return trigger({kind:'create', card:card, zone:zone})(state)
    }
}

function move(card:Card, toZone:PlaceName, loc:InsertLocation='end', logged:boolean=false): Transform {
    return async function(state) {
        let result = state.find(card)
        if (result.found) {
            const card = result.card
            state = state.remove(card)
            if (toZone == null) {
                if (!logged) state = state.log(`Trashed ${card.name} from ${result.place}`)
            } else {
                state = state.addToZone(card, toZone, loc)
                if (!logged) state = state.log(`Moved ${card.name} from ${result.place} to ${toZone}`)
            }
            state = await trigger({kind:'move', fromZone:result.place, toZone:toZone, loc:loc, card:card})(state)
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

function recycle(cards:Card[]): Transform {
    return async function(state: State): Promise<State> {
        let params:RecycleParams = {cards:cards, kind:'recycle'}
        params = replace(params, state);
        cards = params.cards;
        //[state, cards] = randomChoices(state, cards, cards.length);
        if (cards.length > 0) {
          state = state.log(`Recycled ${showCards(cards)} to bottom of deck`)
        }
        state = await moveMany(cards, 'deck', 'bottom', true)(state)
        state = await trigger({kind:'recycle', cards:cards})(state)
        return state
    }
}


function draw(n:number, source:Source={name:'?'}):Transform {
    return async function(state:State):Promise<State> {
        var drawParams:Params = {kind:'draw', draw:n, source:source, effects:[]}
        drawParams = replace(drawParams, state)
        state = await doAll(drawParams.effects)(state)
        n = drawParams.draw
        const drawn:Card[] = []
        for (let i = 0; i < n; i++) {
            let nextCard:Card|null, rest:Card[];
            [nextCard, rest] = shiftFirst(state.deck)
            if (nextCard != null) {
                state = await move(nextCard, 'hand', 'end', true)(state)
                drawn.push(nextCard)
            }
        }
        if (drawn.length > 0) {
            state = state.log(`Drew ${showCards(drawn)}`)
        }
        return trigger({kind:'draw', drawn:drawn.length, cards:drawn, triedToDraw:n, source:source})(state)
    }
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

function payCoin(n:number): Transform {
    return gainCoin(-n, true)
}

function setCoin(n:number): Transform {
    return async function(state) {
        const adjustment:number = n - state.coin
        return gainCoin(adjustment)(state)
    }
}

class Victory extends Error {
    constructor(public state:State) {
        super('Victory')
        Object.setPrototypeOf(this, Victory.prototype)
    }
}

function gainEnergy(n:number): Transform {
    return async function(state) {
        state = state.setEnergy(state.energy+n)
        if (n != 0) state = state.log(`Gained ${renderEnergy(n)}`)
        return trigger({kind:'gainEnergy', amount:n})(state)
    }
}

function gainPoints(n:number, source:Source={name:'?'}): Transform {
    return async function(state) {
        let params:Params = {kind:'gainPoints', points:n, effects:[], source:source}
        params = replace(params, state)
        state = await doAll(params.effects)(state)
        n = params.points
        state = state.setPoints(state.points+n)
        if (n != 0) state = state.log(n > 0 ? `Gained ${n} vp` : `Lost ${-n} vp`)
        if (state.points >= 50) throw new Victory(state)
        return trigger({kind:'gainPoints', amount:n, source:source})(state)
    }
}

function gainCoin(n:number, cost:boolean=false): Transform {
    return async function(state) {
        if (state.coin + n < 0) {
            if (cost) throw new CostNotPaid("Not enough coin")
            n = -state.coin
        }
        state = state.setCoin(state.coin+n)
        if (n != 0) state = state.log(n > 0 ? `Gained $${n}` : `Lost $${-n}`)
        return trigger({kind:'gainCoin', amount:n, cost:cost})(state)
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

function charge(card:Card, n:number, cost:boolean=false): Transform {
    return async function(state:State): Promise<State> {
        let result = state.find(card)
        if (!result.found) {
            if (cost) throw new CostNotPaid(`card no longer exists`)
            return state
        }
        card = result.card
        if (card.charge + n < 0 && cost)
            throw new CostNotPaid(`not enough charge`)
        const oldCharge:number = card.charge
        const newCharge:number = Math.max(oldCharge+n, 0)
        state = state.apply(card => card.update({charge:newCharge}), card)
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
        const result = state.find(card)
        if (!result.found) return state
        card = result.card
        const newCard = card.update({tokens: card.tokens.concat([token])})
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, 1)
        return trigger({kind:'addToken', card:newCard, token:token})(state)
    }
}

function countTokens(card:Card, token:string): number {
    var count = 0
    const tokens = card.tokens
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i]  == token) {
            count += 1
        }
    }
    return count
}

function removeTokens(card:Card, token:string): Transform {
    return async function(state)  {
        const result = state.find(card)
        if (!result.found) return state
        card = result.card
        const removed: number = countTokens(card, token)
        const newCard = card.update({tokens: card.tokens.filter(x => (x != token))})
        state = state.replace(card, newCard)
        state = logTokenChange(state, card, token, -removed)
        return trigger({kind:'removeTokens', card:newCard, token:token, removed:removed})(state)
    }
}
function removeOneToken(card:Card, token:string): Transform {
    return async function(state) {
        let removed:number = 0
        function removeOneToken(tokens: string[]) {
            for (var i = 0; i < tokens.length; i++) {
                if (tokens[i] == token) {
                    removed = 1
                    return tokens.slice(0, i).concat(tokens.slice(i+1))
                }
            }
            return tokens
        }
        const result = state.find(card)
        if (!result.found) return state
        card = result.card
        const newCard:Card = card.update({tokens: removeOneToken(card.tokens)})
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

function randomChoice<T>(state:State, xs:T[], seed?:number): [State, T|null] {
    if (xs.length == 0) return [state, null];
    [state, xs] = randomChoices(state, xs, 1, seed)
    return [state, xs[0]]
}

function randomChoices<T>(state:State, xs:T[], n:number, seed?:number): [State, T[]] {
    const result = []
    xs = xs.slice()
    while (result.length < n) {
        if (xs.length == 0) return [state, result];
        if (xs.length == 1) return [state, result.concat(xs)]
        let rand;
        [state, rand] = doOrReplay(state, () => (seed == null) ? Math.random() : PRF(seed, result.length), 'rng')
        const k = Math.floor(rand * xs.length)
        result.push(xs[k])
        xs[k] = xs[xs.length-1]
        xs = xs.slice(0, xs.length-1)
    }
    return [state, result]
}

// ------------------ Rendering


function renderCost(cost:Cost): string {
    const coinHtml: string = cost.coin > 0 ? `$${cost.coin}` : ''
    const energyHtml: string = renderEnergy(cost.energy)
    if (coinHtml == '' && energyHtml == '') return ''
    else if (coinHtml == '') return energyHtml
    else return [coinHtml, energyHtml].join(' ')
}

function renderEnergy(n:number): string {
    const result: string[] = []
    if (n < 0) return '-' + renderEnergy(-n)
    for (var i = 0; i < n; i++) {
        result.push('@')
    }
    return result.join('')
}

function describeCost(cost:Cost): string {
    const coinCost = (cost.coin > 0) ? [`lose $${cost.coin}`] : []
    const energyCost = (cost.energy > 0) ? [`gain ${renderEnergy(cost.energy)}`] : []
    const costs = coinCost.concat(energyCost)
    const costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing'
    return `Cost: ${costStr}.`
}

function renderShadow(shadow:Shadow, state:State):string {
    const card:Card = shadow.spec.card
    const tokenhtml:string = card.tokens.length > 0 ? '*' : ''
    const chargehtml:string = card.charge > 0 ? `(${card.charge})` : ''
    const costhtml:string = renderCost(card.cost(state)) || '&nbsp'
    const ticktext:string = `tick=${shadow.tick}`
    const shadowtext:string = `shadow='true'`
    let tooltip:string;
    switch (shadow.spec.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.spec.ability)
            break
        case 'trigger':
            tooltip = renderStatic(shadow.spec.trigger)
            break
        case 'effect':
            tooltip = card.effect().text
            break
        case 'abilities':
            tooltip = card.abilities().map(renderAbility).join('')
            break
        case 'cost':
            tooltip = describeCost(card.cost(state))
            break
        default: assertNever(shadow.spec)
    }
    return [`<div class='card' ${ticktext} ${shadowtext}>`,
            `<div class='cardbody'>${card}${tokenhtml}${chargehtml}</div>`,
            `<div class='cardcost'>${costhtml}</div>`,
            `<span class='tooltip'>${tooltip}</span>`,
            `</div>`].join('')
}

function renderCard(card:Card|Shadow, state:State, options:CardRenderOptions):string {
    if (card instanceof Shadow) {
        return renderShadow(card, state)
    } else {
        const tokenhtml:string = card.tokens.length > 0 ? '*' : ''
        const chargehtml:string = card.charge > 0 ? `(${card.charge})` : ''
        const costhtml:string = renderCost(card.cost(state)) || '&nbsp'
        const picktext:string = (options.pick !== undefined) ? `<div class='pickorder'>${options.pick}</div>` : ''
        const choosetext:string = (options.option !== undefined) ? `choosable chosen='false' option=${options.option}` : ''
        const hotkeytext:string = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : ''
        const ticktext:string = `tick=${card.ticks[card.ticks.length-1]}`
        return [`<div class='card' ${ticktext} ${choosetext}> ${picktext}`,
                `<div class='cardbody'>${hotkeytext}${card}${tokenhtml}${chargehtml}</div>`,
                `<div class='cardcost'>${costhtml}</div>`,
                `<span class='tooltip'>${renderTooltip(card, state)}</span>`,
                `</div>`].join('')
    }
}

function renderStatic(x:Trigger|Replacer): string {
    return `<div>(static) ${x.text}</div>`
}

function renderAbility(x:Ability): string {
    return `<div>(ability) ${x.text}</div>`
}

function renderTokens(tokens:string[]): string {
    const counter:Map<string,number> = new Map()
    for (const token of tokens) {
        counter.set(token, (counter.get(token) || 0) + 1)
    }
    const parts:string[] = []
    for (const [token, count] of counter) {
        parts.push((count == 1) ? token : `${token}(${count})`)
    }
    return parts.join(', ')
}

function renderTooltip(card:Card, state:State): string {
    const effectHtml:string = `<div>${card.effect().text}</div>`
    const abilitiesHtml:string = card.abilities().map(x => renderAbility(x)).join('')
    const triggerHtml:string = card.triggers().map(x => renderStatic(x)).join('')
    const replacerHtml:string = card.replacers().map(x => renderStatic(x)).join('')
    const staticHtml:string = triggerHtml + replacerHtml
    const tokensHtml:string = card.tokens.length > 0 ? `Tokens: ${renderTokens(card.tokens)}` : ''
    const baseFilling:string = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('')
    function renderRelated(spec:CardSpec) {
        const card:Card = new Card(spec, -1)
        const costStr = renderCost(card.cost(emptyState))
        const header = (costStr.length > 0) ?
            `<div>---${card.toString()} (${costStr})---</div>` :
            `<div>-----${card.toString() }----</div>`
        return header + renderTooltip(card, state)
    }
    const relatedFilling:string = card.relatedCards().map(renderRelated).join('')
    return `${baseFilling}${relatedFilling}`
}

function render_log(msg: string) {
  return `<div class=".log">${msg}</div>`
}

// make the currently rendered state available in the console for debugging purposes
var renderedState: State

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
}

function renderBest(best:number, seed:string): void {
    $('#best').html(`Fastest win on this seed: ${best} (<a href='scoreboard?seed=${seed}'>scoreboard</a>)`)
}

function renderState(state:State,
    settings:RenderSettings = {},
): void {
    renderedState = state
    clearChoice()
    function render(card:Card|Shadow) {
        const cardRenderOptions:CardRenderOptions = {
            option: getIfDef(settings.optionsMap, card.id),
            hotkey: getIfDef(settings.hotkeyMap, card.id),
            pick: getIfDef(settings.pickMap, card.id),
        }
        return renderCard(card, state, cardRenderOptions)
    }
    $('#resolvingHeader').html('Resolving:')
    $('#energy').html(state.energy)
    $('#coin').html(state.coin)
    $('#points').html(state.points)
    $('#aside').html(state.aside.map(render).join(''))
    $('#resolving').html(state.resolving.map(render).join(''))
    $('#play').html(state.play.map(render).join(''))
    $('#supply').html(state.supply.map(render).join(''))
    $('#hand').html(state.hand.map(render).join(''))
    $('#deck').html(state.deck.map(render).join(''))
    $('#discard').html(state.discard.map(render).join(''))
    $('#log').html(state.logs.slice().reverse().map(render_log).join(''))
}

// ------------------------------ History replay

function doOrReplay<T extends number|[number]>(
    state: State,
    f: () => T,
    kind: ReplayableKind
): [State, T] {
    let x: T, k: ReplayableKind, record: Replayable|null;
    [state, record] = state.shiftFuture()
    if (record == null) {
        x = f()
    } else {
        if (record.kind != kind) throw Error(`replaying history we found ${record} where expecting kind ${kind}`)
        x = (record.value as T)
    }
    return [state.addHistory(({kind:kind, value:x} as Replayable)), x]
}

//TODO: surely there is some way to unify these?
async function asyncDoOrReplay<T extends number|number[]>(
    state: State,
    f: () => Promise<T>,
    kind: ReplayableKind
): Promise<[State, T]> {
    let x: T, k: ReplayableKind, record: Replayable|null;
    [state, record] = state.shiftFuture()
    if (record == null) {
        x = await f()
    } else {
        if (record.kind != kind) throw Error(`replaying history we found ${record} where expecting kind ${kind}`)
        x = (record.value as T)
    }
    return [state.addHistory(({kind:kind, value:x} as Replayable)), x]
}

// -------------------------------------- Player choices

type ID = number

type OptionRender = ID | string

interface Option<T> {
    render: OptionRender;
    hotkeyHint?: Key;
    value: T;
}

interface StringOption<T> {
    render: string,
    value: T
}

async function multichoice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
    validator:(xs:T[]) => boolean = (xs => true),
): Promise<[State, T[]]> {
    if (options.length == 0) return [state, []]
    else {
        let indices:number[]; [state, indices] = await asyncDoOrReplay(
            state,
            () => freshMultichoice(state, prompt, options, validator),
            'multichoice',
        )
        return [state, indices.map(i => options[i].value)]
    }
}

async function choice<T>(
    state:State,
    prompt:string,
    options:Option<T>[],
): Promise<[State, T|null]> {
    let index:number;
    if (options.length == 0) return [state, null]
    else if (options.length == 1) return [state, options[0].value]
    else {
        let index:number; [state, index] = await asyncDoOrReplay(
            state,
            () => freshChoice(state, prompt, options),
            'choice'
        )
        return [state, options[index].value]
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
    {render:'Yes', value:true, hotkeyHint:'y'},
    {render:'No', value:false, hotkeyHint:'n'}
]

function range(n:number):number[] {
    const result:number[] = []
    for (let i = 0; i < n; i++) result.push(i)
    return result
}

function chooseNatural(n:number):Option<number>[] {
    return range(n).map(x => ({render:String(x), value:x, hotkeyHint:String(x)}))
}

function asChoice(x:Card): Option<Card> {
    return {render:x.id, value:x}
}

function asNumberedChoices(xs:Card[]): Option<Card>[] {
    return xs.map((card, i) => (
        ( i < choiceHotkeys.length) ? 
        {render:card.id, value:card, hotkeyHint:choiceHotkeys[i]} :
        {render:card.id, value:card}
    ))
}

function allowNull<T>(options: Option<T>[], message:string="None"): Option<T|null>[] {
    const newOptions:Option<T|null>[] = options.slice()
    newOptions.push({render:message, value:null})
    return newOptions
}

function renderChoice(
    state: State,
    choicePrompt: string,
    options: Option<() => void>[],
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

    renderState(state, {hotkeyMap: hotkeyMap, optionsMap:optionsMap, pickMap:pickMap})

    $('#choicePrompt').html(choicePrompt)
    $('#options').html(stringOptions.map(localRender).join(''))
    $('#undoArea').html(renderSpecials(state.undoable()))
    bindSpecials(state, reject, renderer)

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

function renderHotkey(hotkey: Key) {
  return `<span class="hotkey">${hotkey}</span> `
}

function renderSpecials(undoable:boolean): string {
    return renderUndo(undoable) + renderHotkeyToggle() + renderHelp()
}

function renderHotkeyToggle(): string {
    return `<span class='option', option='hotkeyToggle' choosable chosen='false'>${renderHotkey('/')} Hotkeys</span>`
}
function renderHelp(): string {
    return `<span id='help' class='option', option='help' choosable chosen='false'>${renderHotkey('?')} Help</span>`
}

function renderUndo(undoable:boolean): string {
    const hotkeyText = renderHotkey('z')
    return `<span class='option', option='undo' ${undoable ? 'choosable' : ''} chosen='false'>${hotkeyText}Undo</span>`
}

function bindSpecials(state:State, reject: ((x:any) => void), renderer: () => void): void {
    bindHotkeyToggle(renderer)
    bindUndo(state, reject)
    bindHelp(state, renderer)
}

function bindHotkeyToggle(renderer: () => void) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn
        renderer()
    }
    keyListeners.set('/', pick)
    $(`[option='hotkeyToggle']`).on('click', pick)
}

function bindUndo(state:State, reject: ((x:any) => void)): void {
    function pick() {
        if (state.undoable()) reject(new Undo(state))
    }
    keyListeners.set('z', pick)
    $(`[option='undo']`).on('click', pick)
}

function bindHelp(state:State, renderer: () => void) {
    function attach(f: () => void) {
        $('#help').on('click', f)
        keyListeners.set('?', f)
    }
    function pick() {
        attach(renderer)
        const helpLines:string[] = [
            'The goal of the game is to get to 50 points (vp) using as little energy (@) as possible.',
            "When you play or buy a card, follow its instructions. After playing a card, discard it.",
            "You can pay a card's cost in order to buy it from the supply or play it from your hand.",
            "The symbols below a card's name indicate its cost.",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to play it.",
            "When a cost is measured in coin ($) then you can only buy it if you have enough coin.",
            "'Recycling' cards means to shuffle them and put them on the bottom of your deck.",
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (static) apply whenever the card is in play or in the supply.",
            "The game is played with a kingdom of 7 core cards and 12 randomized cards.",
            //TODO: link to replay this kingdom?
            //`You can visit <a href="${kingdomURL(state.info.kingdom)}">this link</a> to replay this kingdom anyenergy.`,
            `Or play the <a href='${dateSeedPath()}'>daily kingdom</a>, using today's date as a seed.`,
            `Or visit the <a href='${basePlus("picker.html")}'>kingdom picker<a> to pick a kingdom.`,
        ]
        $('#choicePrompt').html('')
        $('#resolvingHeader').html('')
        $('#resolving').html(helpLines.map(x => `<div class='helpLine'>${x}</div class='helpline'>`).join(''))
    }
    attach(pick)
}


function clearChoice(): void {
    keyListeners.clear()
    $('#choicePrompt').html('')
    $('#options').html('')
    $('#undoArea').html('')
}

class Undo extends Error {
    constructor(public state:State) {
        super('Undo')
        Object.setPrototypeOf(this, Undo.prototype)
    }
}


function freshChoice<T>(
    state: State,
    choicePrompt: string,
    options: Option<T>[],
): Promise<number> {
    return new Promise(function(resolve, reject) {
        function pick(i:number) {
            clearChoice()
            resolve(i)
        }
        function renderer() {
            renderChoice(state,
                choicePrompt,
                options.map((x, i) => ({...x, value:() => pick(i)})),
                reject, renderer)
        }
        renderer()
    })
}

//TODO: order can matter, should we make order visible somehow?
//TODO: what to do if you can't pick a valid set for the validator?
function freshMultichoice<T>(
    state: State,
    choicePrompt: string,
    options: Option<T>[],
    validator:((xs:T[]) => boolean) = (xs => true)
): Promise<number[]> {
    return new Promise(function(resolve, reject){
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
                $(`[option='${submitIndex}']`).attr('choosable', true)
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
        newOptions.push({render:'Done', value: () => {
            if (isReady()) {
                resolve(Array.from(chosen.values()))
            }
        }})
        chosen.clear()
        function renderer() {
            renderChoice(state, choicePrompt, newOptions, reject, renderer, picks)
            for (const j of chosen) elem(j).attr('chosen', true)
        }
        renderer()
    })
}


// --------------------- Hotkeys

const keyListeners: Map<Key, () => void> = new Map();
const numHotkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const symbolHotkeys = ['!','#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']'] // '@' is confusing
const lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', // 'z' reserved for undo
]
const upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
const handHotkeys:Key[] = numHotkeys.concat(symbolHotkeys)
const supplyAndPlayHotkeys:Key[] = lowerHotkeys.concat(upperHotkeys)
// want to put zones that are least likely to change earlier, to not distrupt assignment
const hotkeys:Key[] = supplyAndPlayHotkeys.concat(handHotkeys)
const choiceHotkeys:Key[] = handHotkeys.concat(supplyAndPlayHotkeys)

$(document).keydown((e: any) => {
    const listener = keyListeners.get(e.key)
    if (listener != undefined) {
        e.preventDefault()
        listener()
    }
});

type Key = string

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
        setFrom(state.supply, supplyAndPlayHotkeys)
        setFrom(state.hand, handHotkeys)
        setFrom(state.play, supplyAndPlayHotkeys)
        for (const option of options) {
            const hint:Key|undefined = option.hotkeyHint;
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

interface RendererState {
    hotkeysOn:boolean;
    hotkeyMapper: HotkeyMapper;
}

const globalRendererState:RendererState = {
    hotkeysOn:false,
    hotkeyMapper: new HotkeyMapper()
}


// --------------------- act

// This is the 'default' choice the player makes when nothing else is happening

async function act(state:State): Promise<State> {
    let card:Card|null;
    [state, card] = await actChoice(state)
    if (card == null) throw new Error('No valid options.')
    let result = state.find(card)
    switch (result.place) {
        case 'play':
            return useCard(card)(state)
        case 'hand':
            return tryToPlay(card)(state)
        case 'supply':
            return tryToBuy(card)(state)
        case 'aside':
        case 'discard':
        case 'deck':
        case 'resolving':
        case null:
            throw new Error(`Card can't be in zone ${result.place}`)
        default: assertNever(result)
    }
}

function actChoice(state:State): Promise<[State, Card|null]> {
    const validHand:Card[] = state.hand
    const validSupplies:Card[] = state.supply.filter(x => (x.cost(state).coin <= state.coin))
    const validPlay:Card[] = state.play.filter(x => (x.abilities().length > 0))
    const cards:Card[] = validPlay.concat(validHand).concat(validSupplies)
    return choice(state,
        'Play a card from your hand, use an ability of a card in play, or buy a card from the supply.',
        cards.map(asChoice))
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
    return payToDo(card.payCost(), card.buy({name:'act'}))
}

function tryToPlay(card:Card): Transform {
    return payToDo(card.payCost(), card.play({name:'act'}))
}

// ---------------------------- Game loop

function undo(startState: State): State {
    let state:State|null = startState
    while (true) {
        let last:Replayable|null; [state, last] = state.popFuture()
        if (last == null) {
            state = state.backup()
            if (state == null) throw Error("tried to undo past beginning of energy")
        } else {
            switch (last.kind) {
                case 'choice':
                case 'multichoice':
                    return state
                case 'rng':
                    throw Error("tried to undo past randomness")
                default: assertNever(last)
            }
        }
    }
}

//TODO: allow submitting custom kingdoms
function submittable(spec:GameSpec): boolean {
    return (spec.kingdom == null) && !spec.testing
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
            const submitOrUndo: () => Promise<State> = () => 
                new Promise(function (resolve, reject) {
                    heartbeat(state.spec)
                    state = error.state
                    function submitDialog(seed:string) {
                        return () => {
                            keyListeners.clear()
                            renderScoreSubmission(state.energy, seed, () => submitOrUndo().then(resolve, reject))
                        }
                    }
                    const options:Option<() => void>[] = (!submittable(state.spec)) ? [] : [{
                            render: 'Submit', 
                            value: submitDialog(state.spec.seed),
                            hotkeyHint: '!',
                        }]
                    renderChoice(state, `You won using ${state.energy} energy!`,
                        options, () => resolve(undo(state)), () => {})
                })
            return submitOrUndo()
        } else {
            throw error
        }
    }
}

// ------------------------------ High score submission

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

function renderScoreSubmission(score:number, seed:string, done:() => void) {
    $('#scoreSubmitter').attr('active', true)
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
        $('#scoreSubmitter').attr('active', false)
        done()
    }
    function submit() {
        const username:string = $('#username').val()
        if (username.length > 0) {
            rememberUsername(username)
            $.post(`submit?seed=${seed}&score=${score}&username=${username}`).done(function(x:any) {
                console.log(x)
            })
            exit()
        }
    }
    $('#username').on('keydown', (e:KeyboardEvent) => {
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


// ------------------------------ Start the game

interface GameSpec {
    seed: string;
    kingdom: string|null;
    testing: boolean
}

function supplyKey(spec:CardSpec): number {
    return new Card(spec, -1).cost(emptyState).coin
}
function supplySort(card1:CardSpec, card2:CardSpec): number {
    return supplyKey(card1) - supplyKey(card2)
}

//TODO: the implementation of randomness is now pretty janky
//if the game is deterministic, it doesn't have to actually consume state
//(and then can get rid of the non-async choice...)
async function playGame(spec:GameSpec): Promise<void> {
    let state = new State(spec)
    const startingDeck:CardSpec[] = [copper, copper, copper, copper, copper,
                                 copper, copper, estate, estate, estate]
    const intSeed:number = hash(spec.seed)
    let shuffledDeck; [state, shuffledDeck] = randomChoices(state, startingDeck, startingDeck.length, intSeed)
    state = await doAll(shuffledDeck.map(x => create(x, 'deck')))(state);
    let variableSupplies; [state, variableSupplies] = randomChoices(state, mixins, 12, intSeed+1)
    const fixedKingdom:CardSpec[]|null = getFixedKingdom(spec.kingdom)
    if (fixedKingdom != null) variableSupplies = fixedKingdom
    variableSupplies.sort(supplySort)
    if (spec.testing) {
        for (let i = 0; i < cheats.length; i++) testing.push(cheats[i])
    }
    const kingdom = coreSupplies.concat(variableSupplies).concat(testing)
    state = await doAll(kingdom.map(x => create(x, 'supply')))(state)
    state = await trigger({kind:'gameStart'})(state)
    state = state.log(`Setup done, game starting`)
    while (true) {
        state = await mainLoop(state)
    }
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

function getGameSpec(): GameSpec {
    return {seed:getSeed(), kingdom:getKingdom(), testing:testing.length > 0}
}

function getKingdom(): string|null {
    return new URLSearchParams(window.location.search).get('kingdom')
}

function getSeed(): string {
    const seed:string|null = new URLSearchParams(window.location.search).get('seed')
    return (seed == null) ? Math.random().toString(36).substring(2, 7) : seed
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

function heartbeat(spec:GameSpec): void {
    if (spec.kingdom == null) {
        $.get(`topScore?seed=${spec.seed}`).done(function(x:string) {
            const n:number = parseInt(x, 10)
            if (!isNaN(n)) renderBest(n, spec.seed)
        })
    }
}

//TODO: live updates?
function load(): void {
    const spec:GameSpec = getGameSpec()
    heartbeat(spec)
    setInterval(() => heartbeat(spec), 30000)
    playGame(spec)
}

// ----------------------------------- Kingdom picker

//TODO: I think these can just be relative links, we don't have to do it ourselves...
function basePlus(s:string): string {
    const urlParts:string[] = window.location.toString().split('/')
    urlParts[urlParts.length-1] = s
    return urlParts.join('/')
}

function dateString() {
    const date = new Date()
    return (String(date.getMonth() + 1)) + String(date.getDate()).padStart(2, '0') + date.getFullYear()
}

function dateSeedPath() {
    const s:string = dateString()
    return basePlus(`index.html?seed=${s}`)
}

function kingdomURL(specs:CardSpec[]) {
    return basePlus(`index.html?kingdom=${specs.map(spec => spec.name).join(',')}`)
}

function loadPicker(): void {
    let state = emptyState;
    const specs = mixins.slice()
    specs.sort((spec1, spec2) => spec1.name.localeCompare(spec2.name))
    for (let i = 0; i < specs.length; i++) {
        const spec = specs[i]
        state = state.addToZone(new Card(spec, i), 'supply')
    }
    function trivial() {}
    function elem(i:number): any {
        return $(`[option='${i}']`)
    }
    function prefix(s:string): string {
        const parts:string[] = s.split('/')
        return parts.slice(0, parts.length-1).join('/')
    }
    function kingdomLink(): string {
        return kingdomURL(Array.from(chosen.values()).map(i => specs[i]))
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
        $('#count').html(String(chosen.size))
        if (chosen.size > 0) {
            $('#kingdomLink').attr('href', kingdomLink())
        } else {
            $('#kingdomLink').removeAttr('href')
        }
    }
    renderChoice(state,
        'Choose which cards to include in the supply.',
        state.supply.map((card, i) => ({
            render: card.id,
            value: () => pick(i)
        })), trivial, trivial)
}

//
// ----------------- CARDS -----------------
//

const coreSupplies:CardSpec[] = []
const mixins:CardSpec[] = []
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
    return {energy:n, coin:0}
}
function coin(n:number):Cost {
    return {energy:0, coin:n}
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
        state = await recycle(state.discard)(state)
        state = await recycle(state.hand)(state)
        state = await draw(n, card)(state)
        return state
    }
}

const regroup:CardSpec = {name: 'Regroup',
    fixedCost: energy(3),
    effect: card => ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +5 cards.',
        effect: reboot(card, 5),
    })
}
coreSupplies.push(regroup)

const copper:CardSpec = {name: 'Copper',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$1',
        effect: gainCoin(1),
    })
}
coreSupplies.push(supplyForCard(copper, coin(1)))

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
coreSupplies.push(supplyForCard(estate, coin(1)))

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

function playAgain(target:Card|null, source:Source = {name:'?'}): Transform {
    return async function(state:State) {
        let result = state.find(target)
        if (result.place == 'discard') state = await result.card.play(source)(state)
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

const throneRoom:CardSpec = {name: 'Throne Room',
    fixedCost: energy(1),
    effect: card => ({
        text: `Play a card in your hand. Then if it's in your discard pile play it again.`,
        effect: playTwice(card)
    })
}
buyable(throneRoom, 4)

const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effect: card => ({
        text: '+2 cards',
        effect: draw(2)
    })
}
buyable(hound, 1)


const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effect: card => ({
        text: '+3 cards',
        effect: draw(3)
    })
}
buyable(smithy, 4)

const tutor:CardSpec = {name: 'Tutor',
    effect: card => ({
        text: 'Put any card from your deck into your hand.',
        effect: async function(state) {
            let toDraw;
            [state, toDraw] = await choice(state,
                'Choose a card to put in your hand.',
                state.deck.map(asChoice))
            if (toDraw == null) return state
            return move(toDraw, 'hand')(state)
        }
    })
}
buyable(tutor, 3)

const education:CardSpec = {name: 'Education',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Put up to three cards from your deck into your hand.',
        effect: async function(state) {
            let toDraw:Card[]; [state, toDraw] = await multichoiceIfNeeded(state,
                'Choose up to three cards to put in your hand.',
                state.deck.map(asChoice), 3, true)
            return moveMany(toDraw, 'hand')(state)
        }
    })
}
buyable(education, 4)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {coin:10, energy:2},
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
register(philanthropy)

const repurpose:CardSpec = {name: 'Repurpose',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +1 card per coin lost.',
        effect: async function(state) {
            const n = state.coin
            return reboot(card, n)(state)
        }
    })
}
register(repurpose)

const crafting:CardSpec = {name: 'Crafting',
    triggers: card => [{
        text: `After playing ${a(estate.name)}, +$1.`,
        kind: 'afterPlay',
        handles: e => (e.before.name == estate.name),
        effect: e => gainCoin(1),
    }]
}
register(makeCard(crafting, energy(1), true))

const homestead:CardSpec = {name: 'Homesteading',
    triggers: card => [{
        text: `After playing ${a(estate.name)}, +1 card`,
        kind: 'afterPlay',
        handles: e => (e.before.name == estate.name),
        effect: e => draw(1)
    }]
}
register(makeCard(homestead, energy(2), true))

const monument:CardSpec = {name: 'Monument',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$2, +1 vp.',
        effect: doAll([gainCoin(2), gainPoints(1)])
    })
}
buyable(monument, 2)

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effect: card => ({
        text: '+1vp, +1 card.',
        effect: doAll([gainPoints(1), draw(1)])
    })
}
buyable(vibrantCity, 8)

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Add a charge token to this, then +1 vp per charge token on this. Put it on the bottom of your deck.',
        toZone:'deck',
        effect: async function(state) {
            state = await charge(card, 1)(state);
            const result = state.find(card)
            if (result.found) state = await gainPoints(result.card.charge)(state);
            return state
        },
    })
}
buyable(frontier, 6)


const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Add a charge token to this, then +$1 per charge token on this.',
        effect: async function(state) {
            state = await charge(card, 1)(state);
            const result = state.find(card)
            if (result.found) state = await gainCoin(result.card.charge)(state);
            return state
        },
    })
}
buyable(investment, 3)


const populate:CardSpec = {name: 'Populate',
    fixedCost: {coin:12, energy:5},
    effect: card => ({
        text: 'Buy any number of cards in the supply other than this.',
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
register(populate)

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Put this in play with 4 charge tokens on it.',
        effect: charge(card, 4),
        toZone: 'play'
    }),
    triggers: card => [{
        text: 'Whenever you gain energy, you may remove up to that many charge tokens from this.' +
            ' Draw a card per token removed, then if there are no charge tokens left discard this.',
        kind: 'gainEnergy',
        handles: e => e.amount > 0,
        effect: e => async function(state) {
            const result = state.find(card)
            if (result.found) {
                const options:Option<number>[] = chooseNatural(Math.min(e.amount, result.card.charge) + 1)
                let m:number|null;
                [state, m] = await choice(state, 'How many charge counters do you want to remove?', options)
                const n:number = (m as number)
                state = await charge(card, -n)(state)
                state = await draw(n)(state)
                const after = state.find(card)
                if (after.found && after.card.charge == 0) {
                    state = await move(card, 'discard')(state)
                }
            }
            return state
        }
    }]
}
buyable(oldSmith, 3)

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {coin:5, energy:1},
    effect: card => ({
        text: `Put a duplicate token on each card in the supply other than this.`,
        effect: async function(state) {
            return doAll(state.supply.filter(
                c => c.id != card.id
            ).map(c => addToken(c, 'duplicate')))(state)
        }
    }),
    triggers: card => [{
        text: `After buying a card with a duplicate token on it, remove all duplicate tokens from it and buy it again.`,
        kind:'afterBuy',
        handles: e => (e.after != null && countTokens(e.after, 'duplicate') > 0),
        effect: e => (e.after != null) ? doAll([removeTokens(e.after, 'duplicate'), e.after.buy(card)]) : noop,
    }]
}
register(duplicate)

const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Put a mirror token on each card in your hand.',
        effect: async function(state) {
            for (const card of state.hand) {
                state = await addToken(card, 'mirror')(state)
            }
            return state
        }
    })
}
const makeHallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: coin(6),
    effect: card => gainCard(hallOfMirrors),
    relatedCards: [hallOfMirrors],
    triggers: card => [{
        text: `Whenever you finish playing a card with a mirror token other than with this,` + 
        ` if it's in your discard pile remove a mirror token from it and play it again.`,
        kind: 'afterPlay',
        handles: e => (e.after != null && countTokens(e.after, 'mirror') > 0 && e.source.id != card.id),
        effect: e => async function(state) {
            if (e.after != null && state.find(e.after).place == 'discard') {
                state = await removeOneToken(e.after, 'mirror')(state)
                state = await e.after.play(card)(state)
            }
            return state
        }
    }]
}
register(makeHallOfMirrors)

const royalCarriage:CardSpec = {name: 'Royal Carriage',
    fixedCost: energy(0),
    effect: card => ({
        text: "Put this in play.",
        toZone: 'play',
        effect: noop,
    }),
    abilities: card => [{
        text: "Put a royalty token on this.",
        cost: noop,
        effect: addToken(card, 'royalty')
    }],
    triggers: card => [{
        text: "When you finish playing a card the normal way, if this has a royalty token on it then"
            + " remove the token, discard this, and play the card again if it's in your discard pile.",
        kind: 'afterPlay',
        handles: e => (e.source.name == 'act'),
        effect: e => async function(state) {
            const findCarriage = state.find(card)
            const findCard = state.find(e.after)
            if (findCarriage.found && countTokens(findCarriage.card, 'royalty') > 0
                    && findCard.place == 'discard') {
                let findagain = state.find(card)
                if (findagain.found)
                    console.log(findagain.card.ticks)
                state = await removeTokens(card, 'royalty')(state)
                findagain = state.find(card)
                if (findagain.found)
                    console.log(findagain.card.ticks)
                state = await move(card, 'discard')(state)
                state = await playAgain(e.after)(state)
            }
            return state
        }
    }]
}
buyable(royalCarriage, 5)

const royalSeal:CardSpec = {name: 'Royal Seal',
    effect: card => ({
        text: '+$2. Next time you create a card in your discard pile, put it into your hand.',
        effect: doAll([
            gainCoin(2),
            nextTime('Capital', "When you create a card in your discard pile, trash this"
            + " and put that card into your hand.",
            'create', (e:CreateEvent) => (e.zone == 'discard'), (e:CreateEvent) => async function(state) {
                if (state.find(e.card).place == 'discard') state = await move(e.card, 'hand')(state)
                return state
            })
        ])
    })
}
buyable(royalSeal, 6)

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$2. Put this in play.',
        toZone: 'play',
        effect: gainCoin(2),
    }),
    replacers: card => [{
        text: 'Cards cost $1 less, unless it would make them cost 0.',
        kind: 'cost',
        handles: p => true,
        replace: p => ({...p, cost:reduceCoinNonzero(p.cost, 1)})
    }, {
        text: 'Whenever you recycle one or more cards, also recycle this.',
        kind: 'recycle',
        handles: p => p.cards.length > 0,
        replace: p => ({...p, cards: p.cards.concat([card])})
    }]
}
buyable(bridge, 4)

const cellar:CardSpec = {name: 'Cellar',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Discard any number of cards in your hand, then draw that many cards.',
        effect: async function(state) {
            let toDiscard;
            [state, toDiscard] = await multichoice(state,
                'Choose any number of cards to discard.',
                state.hand.map(asChoice), xs => true)
            state = await moveMany(toDiscard, 'discard')(state)
            return draw(toDiscard.length)(state)
        }
    })
}
buyable(cellar, 1)

const pearlDiver:CardSpec = {name: 'Pearl Diver',
    fixedCost: energy(0),
    effect: _ => ({
        text: '+1 card. You may put the bottom card of your deck on top of your deck.',
        effect: async function(state) {
            state = await draw(1)(state)
            if (state.deck.length == 0) return state
            const target = state.deck[state.deck.length - 1]
            let moveIt; [state, moveIt] = await choice(state,
                `Move ${target.name} to the top of your deck?`, yesOrNo)
            return moveIt ? move(target, 'deck', 'top')(state) : state
        }
    })
}
buyable(pearlDiver, 2)

const peddler:CardSpec = {name: 'Peddler',
    fixedCost: energy(0),
    effect: card => ({
        text: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    })
}
const makePeddler:CardSpec = {name: 'Peddler',
    fixedCost: coin(5),
    effect: card => ({
        text: 'Create a peddler on top of your deck',
        effect: create(peddler, 'deck', 'top')
    }),
    relatedCards: [peddler]
}
register(makePeddler)

function freeActions(
    totalEnergy: number,
    card:Card,
    constraint:(c:Card, state:State) => boolean = c => true
): Transform {
    return async function(state) {
        let remainingEnergy = totalEnergy;
        while (remainingEnergy > 0) {
            const options = state.hand.filter(
                (card:Card) => (card.cost(state).energy <= remainingEnergy)
                && constraint(card, state)
            );
            let target;
            [state, target] = await choice(state,
                `Choose a card costing up to ${renderEnergy(remainingEnergy)} to play`,
                allowNull(options.map(asChoice))
            )
            if (target == null)
                break
            const energyCost = target.cost(state).energy
            state = await target.play()(state)
            remainingEnergy -= energyCost
            for (let i = 0; i < energyCost; i++) state = tick(card)(state)
        }
        return state
    }
}

function villagestr(n:number): string {
    return `Play cards from your hand with total cost at most ${renderEnergy(n)}.`
}

const coven:CardSpec = {name: 'Coven',
    fixedCost: energy(1),
    effect: card => ({
        text: `+$2. ${villagestr(2)} None of them may have the same name as a card in yor discard pile.`,
        effect: async function(state) {
            state = await gainCoin(2)(state)
            function constraint(cardInHand:Card, s:State):boolean {
                return s.discard.every(cardInDiscard => cardInDiscard.name != cardInHand.name)
            }
            return freeActions(2, card, constraint)(state)
        }
    })
}
buyable(coven, 4)

const canal:CardSpec = {name: 'Canal',
    replacers: card => [{
        text: 'Cards in the supply cost $1 less, unless it would make them cost 0.',
        kind: 'cost',
        handles: () => true,
        replace: p => ({...p, cost: reduceCoinNonzero(p.cost, 1)})
    }]
}
register(makeCard(canal, {coin:7, energy:1}))


const village:CardSpec = {name: 'Village',
    fixedCost: energy(1),
    effect: card => ({
        text: `+1 card. ${villagestr(2)}`,
        effect: doAll([draw(1), freeActions(2, card)]),
    })
}
buyable(village, 4)

const bazaar:CardSpec = {name: 'Bazaar',
    fixedCost: energy(1),
    effect: card => ({
        text: `+1 card. +$1. ${villagestr(2)}`,
        effect: doAll([draw(1), gainCoin(1), freeActions(2, card)])
    })
}
buyable(bazaar, 5)

const workshop:CardSpec = {name: 'Workshop',
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
        text: "+$2. Next time you finish buying a card the normal way, buy it again if it still exists.",
        effect: doAll([
            gainCoin(2),
            nextTime('Shipping Lane', "When you finish buying a card the normal way,"
                + " discard this and buy it again if it's still in the supply.",
                'afterBuy',
                (e:AfterBuyEvent) => (e.source.name == 'act'),
                (e:AfterBuyEvent) => async function(state) {
                    const result = state.find(e.before)
                    if (result.found && result.place == 'supply') state = await result.card.buy(card)(state)
                    return state
                })
        ])
    })
}
buyable(shippingLane, 5)

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(1),
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

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$5. Trash this.',
        effect: doAll([gainCoin(5), trash(card)]),
    })
}
buyable(feast, 4)

const mobilization:CardSpec = {name: 'Mobilization',
    replacers: card => [{
        text: `${regroup.name} costs @ less to play, unless that would make it cost 0.`,
        kind:'cost',
        handles: x => (x.card.name == 'Regroup'),
        replace: x => ({...x, cost:reduceEnergyNonzero(x.cost, 1)})
    }]
}
const gainMobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: (card, state) => ({energy:0, coin:15+10*card.charge}),
    effect: card => ({
        text: `Create a ${mobilization.name} in play.` +
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(mobilization, 'play'), charge(card, 1)])
    }),
    relatedCards: [mobilization],
}
register(gainMobilization)

const junkDealer:CardSpec = {name: 'Junk Dealer',
    fixedCost: energy(0),
    effect: card => ({
        text: '+1 card. +$1. Trash a card in your hand.',
        effect: async function(state) {
            state = await draw(1)(state);
            state = await gainCoin(1)(state);
            let target;
            [state, target] = await choice(state, 'Choose a card to trash.', state.hand.map(asChoice))
            return (target == null) ? state : trash(target)(state)
        }
    })
}
buyable(junkDealer, 5)

const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Recycle your discard pile.',
        effect: async function(state) { return recycle(state.discard)(state) }
    })
}
mixins.push(refresh)

const plough:CardSpec = {name: 'Plough',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Recycle any number of cards from your discard pile. +2 cards.',
        effect: async function(state) {
            let cards
            [state, cards] = await multichoice(state,
                'Choose any number of cards to recycle.',
                state.discard.map(asChoice),
                xs => true)
            state = await recycle(cards)(state)
            return draw(3)(state)
        }
    })
}
buyable(plough, 4)

const vassal:CardSpec = {name: 'Vassal',
    fixedCost: energy(1),
    effect: card => ({
        text: "+$2. Play the top card of your deck.",
        effect: async function(state) {
            state = await gainCoin(2)(state);
            if (state.deck.length == 0) return state
            return state.deck[0].play(card)(state)
        }
    })
}
buyable(vassal, 3)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {energy:1, coin:8},
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
        handles:e => (e.before.tokens.includes('twin') && e.source.id != card.id),
        effect:e => async function(state) {
            const result = state.find(e.before)
            return (result.place == 'discard') ? result.card.play(card)(state) : state
        }
    }],
}
register(twin)

const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Add a charge token to this, then +1 card per charge token on this.',
        effect: async function(state) {
            state = await charge(card, 1)(state);
            const result = state.find(card)
            if (result.found) state = await draw(result.card.charge)(state);
            return state
        },
    })
}
buyable(youngSmith, 1)

function nextTime<T extends GameEvent>(name:string,
    text:string,
    kind: T['kind'],
    when: (e:T, state:State) => boolean,
    what: (e:T)  => Transform
): Transform {
    function triggers(card:Card): Trigger<T>[] {
        return [{
            text: text,
            kind: kind,
            handles: (e:T, state:State) => (when(e, state) && state.find(card).place == 'play'),
            effect: (e:T) => doAll([trash(card), what(e)]),
        }]
    }
    const spec:CardSpec = ({name:name, triggers: triggers} as unknown) as CardSpec
    return create(spec, 'play')
}

const expedite:CardSpec = {name: 'Expedite',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: "The next energy you create a card, if it's in your discard pile put it into your hand."+
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: doAll([
            nextTime('Expedite', "When you create a card, if it's in your discard pile" +
                " then trash this and put it into your hand.",
                'create',
                 (e:CreateEvent, state) => (state.find(e.card).place == 'discard'),
                 (e:CreateEvent) => move(e.card, 'hand')),
            charge(card, 1),
        ])
    })
}
register(expedite)

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Create a gold in your hand and a gold on top of your deck.',
        effect: doAll([create(gold, 'deck', 'top'), create(gold, 'hand')]),
    })
}
buyable(goldMine, 6)

const warehouse:CardSpec = {name: 'Warehouse',
    effect: card => ({
        text: 'Draw 3 cards, then discard 3 cards.',
        effect: doAll([draw(3), discard(3)]),
    })
}
buyable(warehouse, 3)

const cursedKingdom:CardSpec = {name: 'Cursed Kingdom',
    fixedCost: energy(0),
    effect: card => ({
        text: '+4 vp. Put a charge token on this.',
        effect: doAll([gainPoints(4), charge(card, 1)])
    })
}
const gainCursedKingdom:CardSpec = {name: 'Cursed Kingdom',
    fixedCost: coin(5),
    relatedCards: [cursedKingdom],
    effect: card => ({
        text: `Create a ${card.name} in your discard pile.`,
        effect: create(cursedKingdom, 'discard')
    }),
    triggers: card => [{
        text: `Whenever you put a ${card.name} into your hand, +@ for each charge token on it.`,
        kind:'move',
        handles: e => (e.card.name == card.name && e.toZone == 'hand'),
        effect: e => gainEnergy(e.card.charge)
    }]
}
mixins.push(gainCursedKingdom)

const junkyard:CardSpec = {name: 'Junkyard',
    fixedCost: energy(0),
    triggers: card => [{
        text: 'Whenever you trash a card, +1 vp.',
        kind:'move',
        handles: e => (e.toZone == null),
        effect: e => gainPoints(1)
    }]
}
//mixins.push(makeCard(junkyard, {coin:5, energy:2}))

function leq(cost1:Cost, cost2:Cost) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy
}
const makeSynergy:CardSpec = {name: 'Synergy',
    fixedCost: {coin:5, energy:1},
    effect: card => ({
        text: 'Remove all synergy tokens from cards in the supply,'+
        ` then put synergy tokens on two cards in the supply.`,
        effect: async function(state) {
            for (const card of state.supply) 
                if (countTokens(card, 'synergy') > 0)
                    state = await removeTokens(card, 'synergy')(state)
            let cards:Card[]; [state, cards] = await multichoiceIfNeeded(state,
                'Choose two cards to synergize.',
                state.supply.map(asChoice), 2, false)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }),
    triggers: card => [{
        text: 'Whenever you buy a card with a synergy token other than with this,'
        + ' afterwards buy a different card with a synergy token with equal or lesser cost.',
        kind:'afterBuy',
        handles: e => (e.source.id != card.id && countTokens(e.before, 'synergy') > 0),
        effect: e => async function(state) {
            const options:Card[] = state.supply.filter(
                c => countTokens(c, 'synergy') > 0
                && leq(c.cost(state), e.before.cost(state))
                && c.id != e.before.id
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
register(makeSynergy)

const bustlingSquare:CardSpec = {name: 'Bustling Square',
    fixedCost: energy(1),
    effect: card => ({
        text: `+1 card. Set aside all cards in your hand. Play any number of them,`+
        ` then discard the rest.`,
        effect: async function(state) {
            state = await draw(1)(state)
            let hand:Option<Card>[] = asNumberedChoices(state.hand);
            state = await moveWholeZone('hand', 'aside')(state)
            while (true) {
                console.log(hand)
                let target:Card|null; [state, target] = await choice(state,
                    'Choose which card to play next.', allowNull(hand))
                if (target == null) {
                    return moveMany(hand.map(option => option.value), 'discard')(state)
                } else {
                    state = await target.play(card)(state)
                    const id = target.id
                    hand = hand.filter((option:Option<Card>) => option.value.id != id)
                }
            }
        }
    })
}
buyable(bustlingSquare, 6)

function ensureInSupply(spec:CardSpec): Trigger {
    return {
        text: `At the beginning of the game, add ${spec.name} to the supply` +
            ` if it isn't already there.`,
        kind:'gameStart',
        handles: () => true,
        effect: e => async function(state) {
            if (state.supply.every(c => c.name != spec.name)) state = await create(spec, 'supply')(state)
            return state
        }
    }
}

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effect: card => ({
        text: '+5vp',
        effect: gainPoints(5),
    })
}
const buyColony:CardSpec = {name: 'Colony',
    fixedCost: coin(16),
    effect: card => gainCard(colony),
    triggers: card => [ensureInSupply(buyPlatinum)],
    relatedCards: [colony],
}
register(buyColony)

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effect: card => ({
        text: '+$5',
        effect: gainCoin(5)
    })
}
const buyPlatinum:CardSpec = {name: 'Platinum',
    fixedCost: coin(10),
    effect: card => gainCard(platinum),
    triggers: card => [ensureInSupply(buyColony)],
    relatedCards: [platinum],
}
register(buyPlatinum)


const windfall:CardSpec = {name: 'Windfall',
    fixedCost: {energy:0, coin:6},
    effect: card => ({
        text: 'If there are no cards in your deck, create two golds in your discard pile.',
        effect: async function(state) {
            return (state.deck.length == 0) ? doAll([create(gold), create(gold)])(state) : state
        }
    })
}
register(windfall)

const stables:CardSpec = {name: 'Stables',
    abilities: card => [{
        text: 'Remove a charge token from this. If you do, +1 card.',
        cost: discharge(card, 1),
        effect: draw(1, card),
    }]
}
const horse:CardSpec = {name: 'Horse',
    fixedCost: coin(2),
    effect: card => ({
        text: `Put a charge token on a ${stables.name} in play.`,
        effect: fill(stables, 1),
    }),
    triggers: card => [ensureInPlay(stables)],
}
register(horse)


const lookout:CardSpec = {name: 'Lookout',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Look at the top 3 cards from your deck. Trash one then discard one.',
        effect: async function(state) {
            let picks = asNumberedChoices(state.deck.slice(0, 3))
            async function pickOne(descriptor: string, zone: PlaceName, state: State) {
                let pick:Card|null; [state, pick] = await choice(state,
                    `Pick a card to ${descriptor}.`, picks)
                if (pick==null) return state // shouldn't be possible
                const id = pick.id
                picks = picks.filter(pick => pick.value.id != id)
                return move(pick, zone)(state)
            }
            if (picks.length > 0)
                state = await pickOne('trash', null, state)
            if (picks.length > 0)
                state = await pickOne('discard', 'discard', state)
            return state
        }
    })
}
buyable(lookout, 4)

const lab:CardSpec = {name: 'Lab',
    fixedCost: energy(0),
    effect: card => ({
        text: '+2 cards',
        effect: draw(2)
    })
}
buyable(lab, 5)

const expressway:CardSpec = {name: 'Expressway',
    fixedCost: energy(0),
    triggers: _ => [{
        text: "Whenever you create a card," +
            " if it's in your discard pile then move it to the top of your deck.",
        kind:'create',
        handles: (e, state) => (state.find(e.card).place == 'discard'),
        effect: e => move(e.card, 'deck', 'top')
    }]
}
register(makeCard(expressway, coin(5), true))

const formation:CardSpec = {name: 'Formation',
    fixedCost: energy(0),
    triggers: card => [{
        text: `When you finish playing a card other than with ${formation.name}, if it costs @ or more then you may play a card in your hand with the same name.`,
        kind: 'afterPlay',
        handles: e => (e.source.name != formation.name),
        effect: e => async function(state) {
            if (e.before.cost(state).energy == 0) return state
            const cardOptions = state.hand.filter(x => (x.name == e.before.name))
            let replay;
            [state, replay] = await choice(state, `Choose a card named '${e.before.name}' to play.`,
                allowNull(cardOptions.map(asChoice), "Don't play"))
            return (replay == null) ? state : replay.play(card)(state)
        }
    }]
}
register(makeCard(formation, {energy:0, coin:6}))

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effect: card => ({
        text: '+5 cards',
        effect: draw(5),
    })
}
buyable(greatSmithy, 5)

const reuse:CardSpec = {name: 'Reuse',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: 'Put a card from your discard into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: async function(state) {
            let target;
            [state, target] = await choice(state, 'Choose a card to put into your hand.',
                state.discard.map(asChoice))
            state = await charge(card, 1)(state)
            return (target == null) ? state : move(target, 'hand')(state)
        }
    })
}
mixins.push(reuse)

const remake :CardSpec = {name: 'Remake',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +1 card per card that was in your hand.',
        effect: async function(state) {
            const n = state.hand.length
            return reboot(card, n)(state)
        }
    })
}
mixins.push(remake)

const bootstrap:CardSpec = {name: 'Bootstrap',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +2 cards.',
        effect: reboot(card, 2)
    })
}
mixins.push(bootstrap)

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Discard your hand, lose all $, and +5 cards.',
        effect: doAll([
            setCoin(0),
            moveWholeZone('hand', 'discard'),
            draw(5, pressOn)
        ])
    })
}
mixins.push(pressOn)

const seek:CardSpec = {name: 'Seek',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: 'Put a card from your deck into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: async function(state) {
            let target;
            [state, target] = await choice(state, 'Choose a card to put into your hand.',
                state.deck.map(asChoice))
            state = await charge(card, 1)(state)
            return (target == null) ? state : move(target, 'hand')(state)
        }
    })
}
mixins.push(seek)

const innovation:CardSpec = {name: "Innovation",
    triggers: card => [{
        text: "Whenever you create a card, if it's in your discard pile and this has innovate tokens on it," +
        " remove those tokens and play the card.",
        kind:'create',
        handles: (e, state) => (countTokens(card, 'innovate') > 0 && state.find(e.card).place == 'discard'),
        effect: e => doAll([
            removeTokens(card, 'innovate'),
            e.card.play(card)
        ]),
    }, {
        text: "Whenever you draw 5 or more cards, put an innovate token on this.",
        kind: 'draw',
        handles: e => e.cards.length >= 5,
        effect: e => addToken(card, 'innovate')
    }]
}
register(makeCard(innovation, {coin:9, energy:2}, true))

const citadel:CardSpec = {name: "Citadel",
    triggers: card => [{
        text: `Wheneve you draw 5 or more cards, put a citadel counter on this.`,
        kind: 'draw',
        handles: e => e.cards.length >= 5,
        effect: e => addToken(card, 'citadel')
    }, {
        text: `After playing a card other the normal way, if there's a citadel counter on this,`+
            ` remove all citadel counters and play the card again if it's in your discard pile.`,
        kind:'afterPlay',
        handles: (e, state) => (e.source.name == 'act'),
        effect: e => async function(state) {
            const result = state.find(card)
            if (result.found && countTokens(result.card, 'citadel') > 0) {
                card = result.card
                state = await removeTokens(card, 'citadel')(state)
                if (e.after != null && state.find(e.after).place == 'discard') state = await e.after.play(card)(state)
            }
            return state
        }
    }]
}
register(makeCard(citadel, {coin:8, energy:0}, true))

const foolsGold:CardSpec = {name: "Fool's Gold",
    fixedCost: energy(0),
    effect: card => ({
        text: `+$4 if there is ${a(foolsGold.name)} in your discard pile, otherwise +$1.`,
        effect: async function(state) {
            const n = state.discard.filter(x => x.name == card.name).length
            return gainCoin(n > 0 ? 4 : 1)(state)
        }
    })
}
buyable(foolsGold, 3)

const hireling:CardSpec = {name: 'Hireling',
    fixedCost: energy(0),
    replacers: card => [{
        text: "Whenever you draw a card from Regroup, draw an additional card.",
        kind:'draw',
        handles: x => x.source.name == regroup.name,
        replace: x => ({...x, draw:x.draw+1})
    }]
}
register(makeCard(hireling, {coin:6, energy:1}))

const sacrifice:CardSpec = {name: 'Sacrifice',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Play a card in your hand, then trash it.',
        effect: async function(state) {
            let target;
            [state, target] = await choice(state,
                'Choose a card to play and trash.',
                state.hand.map(asChoice))
            if (target == null) return state
            state = await target.play(card)(state)
            return await move(target, null)(state)
        }
    })
}
buyable(sacrifice, 2)

const horseTraders:CardSpec = {name: 'Horse Traders',
    fixedCost: energy(1),
    effect: _ => ({
        text: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    })
}
buyable(horseTraders, 4)

const purge:CardSpec = {name: 'Purge',
    fixedCost: energy(5),
    effect: card => ({
        text: 'Trash any number of cards from your hand. Trash this.',
        effect: async function(state) {
            let toTrash;
            [state, toTrash] = await multichoice(state,
                'Choose any number of cards to trash.',
                state.hand.map(asChoice),
                xs => true)
            state = await moveMany(toTrash, null)(state)
            return trash(card)(state)
        }
    })
}
mixins.push(purge)

const chapel:CardSpec = {name: 'Chapel',
    fixedCost: energy(1),
    effect: _ => ({
        text: 'Trash up to four cards from your hand.',
        effect: async function(state) {
            let toTrash;
            [state, toTrash] = await multichoice(state,
                'Choose up to four cards to trash.',
                state.hand.map(asChoice),
                xs => xs.length <= 4)
            return moveMany(toTrash, null)(state)
        }
    })
}
buyable(chapel, 3)

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$1 per copper in your hand.',
        effect: async function(state) {
            return gainCoin(state.hand.filter(x => x.name == copper.name).length)(state)
        }
    })
}
buyable(coppersmith, 3)

function countDistinct<T>(xs: T[]): number {
    const y: Set<T> = new Set()
    var result = 0
    for (const x of xs) {
        if (!y.has(x)) {
            result += 1
            y.add(x)
        }
    }
    return result
}


const harvest:CardSpec = {name: 'Harvest',
    fixedCost: energy(1),
    effect: _ => ({
        text: '+$1 per differently named card in your hand, up to +$4.',
        effect: async function(state) {
            return gainCoin(Math.min(4, countDistinct(state.hand.map(x => x.name))))(state)
        }
    })
}
buyable(harvest, 3)

const fortify:CardSpec = {name: 'Fortify',
    fixedCost: energy(2),
    effect: card => ({
        text: 'Put your discard pile in your hand. Trash this.',
        effect: moveWholeZone('discard', 'hand'),
        toZone: null,
    })
}
const gainFortify:CardSpec = {name: 'Fortify',
    fixedCost: coin(5),
    effect: card => ({
        text: `Create ${a(fortify.name)} in your discard pile. Discard your hand.`,
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }),
    relatedCards: [fortify],
}
mixins.push(gainFortify)

const explorer:CardSpec = {name: "Explorer",
    fixedCost: energy(0),
    effect: card => ({
        text: `Create ${a(silver.name)} in your hand.` +
            ` If you have ${a(province.name)} in your hand, instead create ${a(gold.name)} in your hand.`,
        effect: async function(state) {
            for (var i = 0; i < state.hand.length; i++) {
                if (state.hand[i].name == 'Province') return create(gold, 'hand')(state)
            }
            return create(silver, 'hand')(state)
        }
    })
}
buyable(explorer, 5)

const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effect: card => ({
        text: "Choose a card in your hand. Play it, " +
            "then if it's in your discard pile play it again, "+
            "then if it's in your discard pile play it again.",
        effect: async function(state) {
            let target:Card, targetNullable; [state, targetNullable] = await choice(state,
                'Choose a card to play three times.',
                state.hand.map(asChoice))
            if (targetNullable == null) return state
            else target = targetNullable
            state = await target.play(card)(state)
            for (var i = 0; i < 2; i++) {
                state = tick(card)(state)
                const result = state.find(target)
                if (result.place != 'discard') break
                else target = result.card
                state = await target.play(card)(state)
            }
            return state
        }
    })
}
buyable(kingsCourt, 10)

const gardens:CardSpec = {name: "Gardens",
    fixedCost: {energy:1, coin:0},
    effect: card => ({
        text: "+1 vp per 5 cards in your deck.",
        effect: async function(state) {
            const n = state.deck.length;
            return gainPoints(Math.floor(n/5))(state)
        }
    })
}
buyable(gardens, 7)


const pathfinding:CardSpec = {name: 'Pathfinding',
    fixedCost: {coin:5, energy:1},
    effect: card => ({
        text: 'Put a path token on a card in your hand.',
        effect: async function(state) {
            let target; [state, target] = await choice(state,
                'Choose a card to put a path token on.',
                state.hand.map(asChoice))
            if (target == null) return state
            return addToken(target, 'path')(state)
        }
    }),
    triggers: card => [{
        text: 'Whenever you play a card, draw a card per path token on it.',
        kind:'play',
        handles:e => e.card.tokens.includes('path'),
        effect:e => draw(countTokens(e.card, 'path'))
    }],
}
register(pathfinding)

const offering:CardSpec = {name: 'Offering',
    effect: card => ({
        text: 'Play a card from your deck, then trash it.',
        effect: async function(state) {
            if (state.deck.length == 0) return state
            let target; [state, target] = await choice(state,
                'Choose a card to play then trash.',
                state.deck.map(asChoice))
            if (target == null) return state
            state = await target.play()(state)
            return trash(target)(state)
        }
    })
}
buyable(offering, 5)

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(2),
    effect: card => ({
        text: 'Remove a decay token from each card in your hand.',
        effect: async function(state) {
            return doAll(state.hand.map(x => removeOneToken(x, 'decay')))(state)
        }
    }),
    triggers: card => [{
        text: 'Whenever you recycle a card, put a decay token on it.',
        kind: 'recycle',
        handles: () => true,
        effect: e => doAll(e.cards.map((c:Card) => addToken(c, 'decay')))
    }, {
        text: 'After you play a card, if it has 3 or more decay tokens on it trash it.',
        kind: 'afterPlay',
        handles: e => (e.after != null && countTokens(e.after, 'decay') >= 3),
        effect: e => trash(e.after),
    }]
}
register(decay)

const perpetualMotion:CardSpec = {name: 'Perpetual Motion',
    fixedCost: energy(1),
    effect: card => ({
        text: `If you have no cards in hand, +2 cards.`,
        effect: async function(state) {
            if (state.hand.length == 0) state = await draw(2, card)(state)
            return state
        }
    })
}
register(perpetualMotion)

const looter:CardSpec = {name: 'Looter',
    effect: card => ({
        text: '+1 card. Discard any number of cards from the top of your deck.',
        effect: async function(state) {
            state = await draw(1)(state)
            let index; [state, index] = await choice(state,
                'Choose a card to discard (along with everything above it).',
                allowNull(state.deck.map((x, i) => ({render:state.deck[i].id, value:i}))))
            return (index == null) ? state  : moveMany(state.deck.slice(0, index+1), 'discard')(state)
        }
    })
}
buyable(looter, 2)

const scavenger:CardSpec = {name: 'Scavenger',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$2. Put up to three cards from your discard pile on top of your deck.',
        effect: async function(state) {
            state = await gainCoin(2)(state)
            let targets; [state, targets] = await multichoice(state,
                'Choose up to three cards to put on top of your deck.',
                state.discard.map(asChoice), xs => xs.length <= 3)
            return moveMany(targets, 'deck', 'top')(state)
        }
    })
}
buyable(scavenger, 4)

const reflect:CardSpec = {name: 'Reflect',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: `Play a card in your hand. Then if it's in your discard pile, play it again.` +
        ` Put a charge counter on this. It costs $1 more to buy for each charge counter on it.`,
        effect: doAll([charge(card, 1), playTwice(card)])
    })
}
register(reflect)

//TODO: add
const cleanse:CardSpec = {name: 'Offering',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: `Trash a card in your hand. Put a charge token on this.`
        + `It costs $1 more for each charge token on it.`,
        effect: async function(state) {
            state = await charge(card, 1)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to trash', state.hand.map(asChoice))
            if (target != null) state = await trash(target)(state)
            return state
        }
    })
}

//TODO: add
const replicate:CardSpec = {name: 'Replicate',
    calculatedCost: (card, state) => ({energy:1, coin:card.charge}),
    effect: card => ({
        text: `Create a copy of a card in your hand in your discard pile. Put a charge count on this.`
        + `It costs $1 more for each charge counter on it.`,
        effect: async function(state) {
            state = await charge(card, 1)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to replicate.', state.hand.map(asChoice))
            if (target != null) state = await create(target.spec, 'discard')(state)
            return state
        }
    })
}

const coffers:CardSpec = {name: 'Coffers',
    abilities: card => [{
        text: 'Remove a charge token from this. If you do, +$1.',
        cost: discharge(card, 1),
        effect: gainCoin(1),
    }]
}
function createIfNeeded(spec:CardSpec): Transform {
    return async function(state) {
        if (state.play.some(x => x.name == spec.name)) return state
        return create(spec, 'play')(state)
    }

}
function ensureInPlay(spec:CardSpec): Trigger<GameStartEvent> {
    return {
        text: `At the start of the game, create ${a(spec.name)} in play if there isn't one.`,
        kind:'gameStart',
        handles: ()=>true,
        effect: e => createIfNeeded(spec)
    }
}
function fill(spec:CardSpec, n:number): Transform {
    return async function(state) {
        let target; [state, target] = await choice(state,
            `Place two ${n} tokens on a ${spec.name} in play.`,
            state.play.filter(c => c.name == spec.name).map(asChoice))
        return (target == null) ? state : charge(target, n)(state)
    }
}
const fillCoffers:CardSpec = {name: 'Fill Coffers',
    fixedCost: coin(3),
    effect: card => ({
        text: `Put two charge tokens on a ${coffers.name} in play.`,
        effect: fill(coffers, 2)
    }),
    triggers: card => [ensureInPlay(coffers)]
}
register(fillCoffers)

const cotr:CardSpec = {name: 'Coin of the Realm',
    fixedCost: energy(1),
    effect: card => ({
        text: '+$1. Put this in play.',
        toZone: 'play',
        effect: doAll([gainCoin(1)])
    }),
    abilities: card => [{
        text: `${villagestr(2)} Discard this.`,
        cost: noop,
        effect: doAll([freeActions(2, card), move(card, 'discard')]),
    }]
}
buyable(cotr, 3)

const mountainVillage:CardSpec = {name: 'Mountain Village',
    fixedCost: energy(1),
    effect: card => ({
        text: "You may play a card in your hand or discard pile costing up to @." +
            " You may play a card in your hand costing up to @.",
        effect: async function(state) {
            function playOne(cards:Card[]): Transform {
                return async function(state) {
                    const options = cards.filter(card => (card.cost(state).energy <= 1)).map(asChoice);
                    let target;
                    [state, target] = await choice(state, 'Choose a card costing up to @ to play',allowNull(options))
                    if (target != null) state = await target.play()(state)
                    return state
                }
            }
            state = await playOne(state.hand.concat(state.discard))(state)
            state = tick(card)(state)
            state = await playOne(state.hand)(state)
            return state
        }
    })
}
buyable(mountainVillage, 3)

const fillStables:CardSpec = {name: 'Fill Stables',
    fixedCost: coin(4),
    effect: card => ({
        text: `Put two charge tokens on a ${stables.name} in play.`,
        effect: fill(stables, 2),
    }),
    triggers: card => [ensureInPlay(stables)],
}
//register(fillStables)

const savings:CardSpec = {name: 'Savings',
    fixedCost: energy(1),
    effect: card => ({
        text: `Put three charge tokens on a ${coffers.name} in play.`,
        effect: fill(coffers, 3),
    })
}
buyableAnd(savings, 3, [ensureInPlay(coffers)])

const duchess:CardSpec = {name: 'Duchess',
    calculatedCost: (card, state) => energy(state.hand.some(c => c.name == duchy.name) ? 0 : 1),
    effect: card => ({
        text: `Draw two cards. This costs @ less to play if you have a ${duchy.name} in your hand.`,
        effect: draw(2)
    })
}
buyable(duchess, 3)

const oasis:CardSpec = {name: 'Oasis',
    effect: card => ({
        text: `+1 card. You may discard a card to add a charge counter to a ${coffers.name} in play.`,
        effect: async function(state) {
            state = await draw(1)(state)
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to discard.',
                allowNull(state.hand.map(asChoice)))
            if (target != null) {
                state = await move(target, 'discard')(state)
                state = await fill(coffers, 1)(state)
            }
            return state
        }
    })
}
buyableAnd(oasis, 3, [ensureInPlay(coffers)])

const desperation:CardSpec = {name:'Desperation',
    fixedCost: energy(1),
    effect: card => ({text: '+$1', effect: gainCoin(1)})
}
register(desperation)


const duke:CardSpec = {name: 'Duke',
    fixedCost: energy(1),
    effect: card => ({
        text: `+1 vp per duchy in your hand or discard pile.`,
        effect: async function(state) {
            return gainPoints(state.hand.concat(state.discard).filter(
                card => card.name == duchy.name).length)(state)
        }
    })
}
buyable(duke, 4)

const inflation:CardSpec = {name: 'Inflation',
    replacers: card => [{
        text: 'Cards in the supply that cost at least $1 cost $1 more.',
        kind: 'cost',
        handles: (p, state) => (p.cost.coin >= 1 && state.find(p.card).place == 'supply'),
        replace: p => ({...p, cost:{coin:p.cost.coin+1, energy:p.cost.energy}})
    }]
}
const makeInflation:CardSpec = {name: 'Inflation',
    fixedCost: energy(3),
    relatedCards: [inflation],
    effect: card => ({
        text: `+$15. Create an ${inflation.name} in play. Trash this.`,
        effect: doAll([gainCoin(15), create(inflation, 'play'), trash(card)]),
    })
}
register(makeInflation)

const publicWorksReduction:CardSpec = {name: 'Public Works',
    replacers: card => [{
        text:"Cards in the supply cost @ less, but not 0.",
        kind: 'cost',
        handles: (e, state) => state.find(e.card).place == 'supply',
        replace: e => ({...e, cost:reduceEnergyNonzero(e.cost, 1)})
    }],
    triggers: card => [{
        text:"When you buy a card, trash this.",
        kind:'buy',
        handles: () => true,
        effect: e => trash(card)
    }]
}
const publicWorks:CardSpec = {name: 'Public Works',
    effect: card => ({
        text: "The next card you buy costs @ less, but not 0.",
        effect: create(publicWorksReduction, 'play')
    })
}
buyable(publicWorks, 5)

const sleigh:CardSpec = {name: 'Sleigh',
    fixedCost: energy(1),
    effect: card => ({
        text: `Put two charge tokens on a ${stables.name} in play.`,
        effect: fill(stables, 2),
    })
}
const makeSleigh:CardSpec = {name: 'Sleigh',
    fixedCost: coin(2),
    relatedCards: [sleigh],
    effect: card => gainCard(sleigh),
    triggers: card => [
        ensureInPlay(stables),
        {
            text: `Whenever you create a card, `
                + ` if it's in your discard pile and you have ${a(sleigh.name)} in your hand,`
                + ` you may discard the ${sleigh.name} to put the new card into your hand.`,
            kind: 'create',
            handles: (e, state) => (state.find(e.card).place == 'discard'),
            effect: e => async function(state) {
                const options: Card[] = state.hand.filter(x => x.name == sleigh.name)
                let target; [state, target] = await choice(state, 'Discard a sleigh?',
                    allowNull(options.map(asChoice)))
                if (target != null) {
                    state = await move(target, 'discard')(state)
                    state = await move(e.card, 'hand')(state)
                }
                return state
            }
        }
    ]
}
register(makeSleigh)

const ferry:CardSpec = {name: 'Ferry',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Put a ferry token on a supply.',
        effect: async function(state) {
            let target; [state, target] = await choice(state, 'Put a ferry token on a supply.',
                state.supply.map(asChoice))
            if (target != null) state = await addToken(target, 'ferry')(state)
            return state
        }
    })
}
function reduceCoin(cost:Cost, n:number): Cost {
    return {coin:Math.max(cost.coin - n,0), energy:cost.energy}
}
function reduceEnergy(cost:Cost, n:number): Cost {
    return {energy:Math.max(cost.energy- n,0), coin:cost.coin}
}
function isZeroCost(cost:Cost): boolean {
    return cost.coin == 0 && cost.energy == 0
}
function reduceCoinNonzero(cost:Cost, n:number): Cost {
    const newCost:Cost = reduceCoin(cost, n)
    return (isZeroCost(newCost)) ? cost : newCost
}
function reduceEnergyNonzero(cost:Cost, n:number): Cost {
    const newCost:Cost = reduceEnergy(cost, n)
    return (isZeroCost(newCost)) ? cost : newCost
}
const makeFerry:CardSpec = {name: 'Ferry',
    fixedCost: coin(3),
    relatedCards: [ferry],
    effect: card => gainCard(ferry),
    replacers: card => [{
        text: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
        kind: 'cost',
        handles: p => countTokens(p.card, 'ferry') > 0,
        replace: p => ({...p, cost: reduceCoinNonzero(p.cost, countTokens(p.card, 'ferry'))})
    }]
}
register(makeFerry)

//TODO: keep updating names
const horsemanship:CardSpec = {name: 'Horsemanship',
    replacers: card => [{
        text: `Whenever you would draw cards other than with ${stables.name},` +
            ` put that many charge tokens on a ${stables.name} in play instead.`,
        kind: 'draw',
        handles: x => (x.source.name != stables.name),
        replace: x => ({...x, draw:0, effects:x.effects.concat([fill(stables, x.draw)])})
    }]
}
const makeHorsemanship:CardSpec = {name: 'Horsemanship',
    fixedCost: energy(4),
    relatedCards: [horsemanship, stables],
    effect: card => ({
        text: `Create ${a(horsemanship.name)} in play. Trsh this.`,
        effect: doAll([create(horsemanship, 'play'), trash(card)])
    }),
    triggers: card => [ensureInPlay(stables)],
}
register(makeHorsemanship)

const wasteland:CardSpec = {name: 'Wasteland',
    fixedCost: energy(1),
    effect: card => ({
        text: '+1 card.',
        effect: draw(1)
    })
}
const stripMine:CardSpec = {name: 'Strip Mine',
    fixedCost: energy(0),
    effect: card => ({
        text: `+$6. Create a ${wasteland.name} in your discard pile.`,
        effect: doAll([gainCoin(6), create(wasteland, 'discard')])
    }),
    relatedCards:[wasteland],
}
buyable(stripMine, 4)

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effect: card => ({
        text: 'Remove a burden token from a card in the supply',
        effect: async function(state) {
            const options = state.supply.filter(x => countTokens(x, 'burden') > 0)
            let target; [state, target] = await choice(state, 'Choose a supply to unburden.',
                allowNull(options.map(asChoice)))
            if (target == null) return state
            return removeOneToken(target, 'burden')(state)
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
        handles: x => countTokens(x.card, 'burden') > 0,
        replace: x => ({...x, cost: {energy:x.cost.energy, coin: x.cost.coin+countTokens(x.card, 'burden')}})
    }]
}
register(burden)

const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effect: card => ({
        text: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    })
}
buyable(goldsmith, 7)

const chancellor:CardSpec = {name: 'Chancellor',
    effect: card => ({
        text: '+$2. You may discard your deck.',
        effect: async function(state) {
            state = await gainCoin(2)(state)
            if (state.deck.length > 0) {
                let doit; [state, doit] = await choice(state, 'Discard your deck?', yesOrNo)
                if (doit) state = await moveWholeZone('deck', 'discard')(state)
            }
            return state
        }
    })
}
buyable(chancellor, 4)

const barracks:CardSpec = {name: 'Barracks',
    triggers: card => [{
        text: 'Whenever you draw 5 or more cards, play cards from your hand with total cost up to @.',
        kind: 'draw',
        handles: e => e.drawn >= 5,
        effect: e => freeActions(1, card)
    }]
}
register(makeCard(barracks, coin(5)))

const composting:CardSpec = {name: 'Composting',
    triggers: card => [{
        text: 'Whenever you gain energy, you may recycle that many cards from your discard pile.',
        kind: 'gainEnergy',
        handles: e => e.amount > 0,
        effect: e => async function(state) {
            const n = e.amount;
            const prompt = (n == 1) ? 'Choose a card to recycle.' : `Choose up to ${n} cards to recycle`
            let cards:Card[]; [state, cards] = await multichoiceIfNeeded(state,
                prompt, state.discard.map(asChoice), n, true)
            return recycle(cards)(state)
        }
    }]
}
register(makeCard(composting, coin(4)))


// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Free money',
    fixedCost: energy(0),
    effect: card => ({
        text: '+$100',
        effect: gainCoin(100)
    })
}
cheats.push(freeMoney)

const freeTutor:CardSpec = {name: 'Free tutor',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Put any card from your deck or discard pile into your hand.',
        effect: async function(state) {
            let toDraw;
            [state, toDraw] = await choice(state,
                'Choose a card to put in your hand.',
                state.deck.concat(state.discard).map(asChoice))
            if (toDraw == null) return state
            return move(toDraw, 'hand')(state)
        }
    })
}
cheats.push(freeTutor)

const freeDraw:CardSpec = {name: 'Free draw',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Draw a card.',
        effect: draw(1),
    })
}
cheats.push(freeDraw)

const freeTrash:CardSpec = {name: 'Free trash',
    effect: card => ({
        text: 'Trash any number of cards in your hand, deck, and discard pile.',
        effect: async function(state) {
            let toTrash: Card[]; [state, toTrash] = await multichoice(state, 'Choose cards to trash.',
                state.deck.concat(state.discard).concat(state.hand).map(asChoice),
                xs => true)
            return moveMany(toTrash, null)(state)
        }
    })
}
cheats.push(freeTrash)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effect: card => ({
        text: '+10vp',
        effect: gainPoints(10),
    })
}
cheats.push(freePoints)

const drawAll:CardSpec = {name: 'Draw all',
    fixedCost: energy(0),
    effect: card => ({
        text: 'Put all cards from your deck and discard pile into your hand.',
        effect: doAll([moveWholeZone('discard', 'hand'), moveWholeZone('deck', 'hand')]),
    })
}
cheats.push(drawAll)
