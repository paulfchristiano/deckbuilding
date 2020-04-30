// TODO: render tokens more nicely if there are multiples
// TODO: move CSS into a separate style file
// TODO: the first 90 lines of this file aren't sorted very well
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: History?
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: Undo isn't in a great position
// TODO: if a zone gets bigger and then, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: probably worth distinguishing items with 1 vs 2 tokens?
// TODO: minimum width for option choices

// returns a copy x of object with x.k = v for all k:v in kvs
function updates(x:object, y:object): object {
    const result = Object.assign({}, x)
    return Object.assign(result, y)
    return result
}

type Transform = ((state:State) => Promise<State>) | ((state:State) => State)

//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e:GameEvent): Transform {
    return async function(state:State): Promise<State> {
        const initialState = state;
        for (const card of state.supply.concat(state.play)) {
            for (const trigger of card.triggers()) {
                if (trigger.handles(e, initialState) && trigger.handles(e, state)) {
                    state = state.addShadow(card, 'trigger', trigger.description)
                    state = state.startTicker(card)
                    state = await trigger.effect(e)(state)
                    state = state.endTicker(card)
                    state = state.popResolving()
                }
            }
        }
        return state
    }
}

//x is an event that is about to happen
//each card in play or supply can change properties of x
function replace(x: Params, state: State): any {
    var replacers = state.supply.concat(state.play).map(x => x.replacers()).flat()
    for (var i = 0; i < replacers.length; i++) {
        const replacer = replacers[i]
        if (replacer.handles(x, state)) {
            x = replacer.replace(x, state)
        }
    }
    return x
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

type GameEvent = any

type Params = any

// ----------------------------- Cards

interface CardSpec {
    name: string;
    fixedCost?: Cost;
    calculatedCost?: (card:Card, state:State) => Cost;
    relatedCards?: CardSpec[];
    effect?: (card:Card) => Effect;
    triggers?: (card:Card) => Trigger[];
    abilities?: (card:Card) => Ability[];
    replacers?: (card:Card) => Replacer[];
}

interface Cost {
    coin: number
    time: number
}


interface Effect {
    description: string;
    skipDiscard?: boolean;
    effect: Transform;
}

interface Trigger {
    description: string;
    handles: (e:GameEvent, s:State) => boolean;
    effect: (e:GameEvent) => Transform;
}


interface Replacer{
    description: string;
    handles: (p:Params, s:State) => boolean;
    replace: (p:Params, s:State) => Params;
}

interface Ability {
    description: string;
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
}

class Card {
    readonly name: string;
    constructor(
        private readonly spec:CardSpec,
        public readonly id:number,
        public readonly charge:number = 0,
        public readonly ticks: number[] = [0],
        public readonly tokens: string[] = [],
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
            return {coin:0, time:0}
    }
    // the cost after replacement effects
    cost(state:State): Cost {
        const card:Card = this
        const initialCost:Params = {type:'cost', card:card, cost:card.baseCost(state)}
        //TODO: would be nice to type check manipulations of these params, but seems harder
        const newCost:Params = replace(initialCost, state)
        return newCost.cost
    }
    // the transformation that actually pays the cost
    payCost(): Transform {
        const card = this
        return async function(state:State): Promise<State> {
            const cost:Cost = card.cost(state)
            return doAll([gainTime(cost.time), payCoin(cost.coin)])(state)
        }
    }
    effect(): Effect {
        if (this.spec.effect == undefined) return {description: '', effect: noop}
        return this.spec.effect(this)
    }
    buy(source:Source={name:'?'}): Transform {
        let card:Card = this
        return async function(state:State): Promise<State> {
            const result:FindResult = state.find(card)
            if (!result.found)
                return state
            card = result.card
            state = await trigger({type:'buy', card:card, source:source})(state)
            state = state.addShadow(card, 'buy')
            state = state.startTicker(card)
            state = await card.effect().effect(state)
            state = state.endTicker(card)
            state = state.popResolving()
            return trigger({type:'afterBuy', before:card, after:state.find(card).card, source:source})(state)
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
            state = await move(card, 'resolving')(state)
            state = await trigger({type:'play', card:card, source:source})(state)
            state = state.startTicker(card)
            state = await effect.effect(state)
            state = state.endTicker(card)
            if (!effect['skipDiscard']) state = await move(card, 'discard')(state)
            return trigger({type:'afterPlay', before:card, after:state.find(card).card, source:source})(state)
        }
    }
    triggers(): Trigger[] {
        if (this.spec.triggers == undefined) return []
        return this.spec.triggers(this)
    }
    abilities(): Ability[] {
        if (this.spec.abilities == undefined) return []
        return this.spec.abilities(this)
    }
    replacers(): Replacer[] {
        if (this.spec.replacers == undefined) return []
        return this.spec.replacers(this)
    }
    relatedCards(): CardSpec[] {
        return this.spec.relatedCards || []
    }
}

// ------------------------- State

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

type InsertLocation = 'bottom' | 'top' | 'start' | 'end' | 'sorted'

type ZoneName = 'supply' | 'hand' | 'deck' | 'discard' | 'play' | 'aside'
type Zone = Card[]
type PlaceName = ZoneName | null | 'resolving'

type Resolving = (Card|Shadow)[]

interface Counters {
    coin:number;
    time:number;
    points:number
}

type CounterName = 'coin' | 'time' | 'points'

interface StateUpdate {
    counters?:Counters;
    zones?:Map<ZoneName,Zone>;
    resolving?:Resolving;
    history?:Replayable[];
    future?:Replayable[];
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
    public readonly time:number;
    public readonly points:number;

    public readonly supply:Zone;
    public readonly hand:Zone;
    public readonly deck:Zone;
    public readonly discard:Zone;
    public readonly play:Zone;
    public readonly aside:Zone;
    constructor(
        private readonly counters:Counters,
        private readonly zones:Map<ZoneName,Zone>,
        public readonly resolving:Resolving,
        private readonly nextID:number,
        private readonly history: Replayable[],
        private readonly future: Replayable[],
        private readonly checkpoint: State|null
    ) {
        this.coin = counters.coin
        this.time = counters.time
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
            read(stateUpdate, 'counters', this.counters),
            read(stateUpdate, 'zones', this.zones),
            read(stateUpdate, 'resolving', this.resolving),
            read(stateUpdate, 'nextID', this.nextID),
            read(stateUpdate, 'history', this.history),
            read(stateUpdate, 'future', this.future),
            read(stateUpdate, 'checkpoint', this.checkpoint),
        )
    }
    addResolving(x:Card|Shadow): State {
        return this.update({resolving: this.resolving.concat([x])})
    }
    popResolving(): State {
        return this.update({resolving: this.resolving.slice(0, this.resolving.length-1)})
    }
    addToZone(card:Card, zone:ZoneName|'resolving', loc:InsertLocation='end'): State {
        if (zone == 'hand') loc = 'sorted'
        if (zone == 'resolving') return this.addResolving(card)
        const newZones:Map<ZoneName,Zone> = new Map(this.zones)
        newZones.set(zone,  insertAt(this[zone], card, loc))
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
        function fOnCards(c:(Card|Shadow)): Card|Shadow {
            if (c instanceof Shadow) return c
            return f(c)
        }
        return this.update({zones:newZones, resolving:this.resolving.map(fOnCards)})
    }
    setCoin(n:number): State {
        return this.update({counters: {coin:n, time:this.time, points:this.points}})
    }
    addShadow(original:Card, kind:ShadowKind, text?: string): State {
        let state:State = this
        let id:number; [state, id] = state.makeID()
        let shadow:Shadow = new Shadow(id, original, kind, 1, text)
        return state.addResolving(shadow)
    }
    setTime(n:number): State {
        return this.update({counters: {coin:this.coin, time:n, points:this.points}})
    }
    setPoints(n:number): State {
        return this.update({counters: {coin:this.coin, time:this.time, points:n}})
    }
    find(card:Card): FindResult {
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
        return (record != null && record.kind == 'choice')
    }
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
    {coin:0, time:0, points:0},
    new Map([ ['supply', []], ['hand', []], ['deck', []], ['discard', []], ['play', []], ['aside', []] ]),
    [], 0, [], [], null // resolving, nextID, history, future, checkpoint
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

function insertAt(zone:Zone, card:Card, loc:InsertLocation): Zone {
    switch(loc) {
        case 'start':
        case 'top':
            return [card].concat(zone)
        case 'bottom':
        case 'end':
            return zone.concat([card])
        case 'sorted':
            for (var i = 0; i < zone.length; i++) {
                if (comesBefore(card, zone[i])) return insertInto(card, zone, i)
            }
            return zone.concat([card])
        default: return assertNever(loc)
    }
}

// --------------------- Shadows

// a Shadow is displayed in the resolving area if there is no card to put there

type ShadowKind = 'ability' | 'trigger' | 'replacer' | 'buy'

class Shadow {
    public readonly text: string;
    constructor(
        public readonly id:number,
        public readonly original:Card,
        public readonly kind: ShadowKind,
        public readonly tick:number,
        text?: string,
    ) {
        if (text == undefined) {
            //TODO: analyze this statically?
            if (kind != 'buy') throw Error("Shadow needs to have text")
            this.text = original.effect().description
        } else {
            this.text = text
        }
    }
    tickUp(): Shadow {
        return new Shadow(this.id, this.original, this.kind, this.tick+1, this.text)
    }
}


// ---------------------------------- Transformations that move cards

function create(spec:CardSpec, zone:ZoneName='discard', loc:InsertLocation='bottom'): Transform {
    return async function(state: State): Promise<State> {
        let id:number; [state, id] = state.makeID()
        const card:Card = new Card(spec, id)
        state = state.addToZone(card, zone, loc)
        return trigger({type:'create', card:card, zone:zone})(state)
    }
}

function recycle(cards:Card[]): Transform {
    return async function(state: State): Promise<State> {
        [state, cards] = randomChoices(state, cards, cards.length);
        state = await trigger({type:'recycle', cards:cards})(state)
        state = await moveMany(cards, 'deck')(state)
        return state
    }
}

function move(card:Card, toZone:PlaceName, loc:InsertLocation='end'): Transform {
    return async function(state) {
        console.log(card, toZone)
        let result = state.find(card)
        console.log(result)
        if (result.found) {
            const card = result.card
            state = state.remove(card)
            if (toZone != null)
                state = state.addToZone(card, toZone, loc)
            console.log(state)
            state = await trigger({type:'move', fromZone:result.place, toZone:toZone, loc:loc, card:card})(state)
            console.log(state)
        }
        return state
    }
}

function moveMany(cards:Card[], toZone:PlaceName, loc:InsertLocation='end'): Transform {
    return doAll(cards.map(card => move(card, toZone)))
}

function moveWholeZone(fromZone:ZoneName, toZone:PlaceName, loc:InsertLocation='end'): Transform {
    return async function(state) {
        return moveMany(state[fromZone], toZone, loc)(state)
    }
}

function trash(card:Card): Transform {
    return move(card, null)
}

function draw(n:number, source:Source={name:'?'}):Transform {
    return async function(state:State):Promise<State> {
        var drawParams:Params = {type:'draw', draw:n, source:source, effects:[]}
        drawParams = replace(drawParams, state)
        state = await doAll(drawParams.effects)(state)
        n = drawParams.draw
        let drawn = 0
        for (let i = 0; i < n; i++) {
            let nextCard:Card|null, rest:Card[];
            [nextCard, rest] = shiftFirst(state.deck)
            if (nextCard != null) {
                console.log(state)
                state = await move(nextCard, 'hand', 'sorted')(state)
                console.log(state)
                drawn += 1
            }
        }
        return trigger({type:'draw', drawn:drawn, triedToDraw:n, source:source})(state)
    }
}

function discard(n:number): Transform {
    return async function(state) {
        let toDiscard:Card[];
        [state, toDiscard] = (state.hand.length <= n) ? [state, state.hand] :
            await multichoice(state, `Choose ${n} cards to discard.`,
                state.hand.map(asChoice),
                (xs => xs.length == n))
        return moveMany(toDiscard, 'discard')(state)
    }
}

// --------------- Transforms that change points, time, and coints

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

function gainTime(n:number): Transform {
    return async function(state) {
        state = state.setTime(state.time+n)
        return trigger({type:'gainTime', amount:n})(state)
    }
}

class Victory extends Error {
    constructor(public state:State) {
        super('Victory')
        Object.setPrototypeOf(this, Victory.prototype)
    }
}


function gainPoints(n:number, source:Source={name:'?'}): Transform {
    return async function(state) {
        let params:Params = {type:'gainPoints', points:n, effects:[], source:source}
        params = replace(params, state)
        state = await doAll(params.effects)(state)
        n = params.points
        state = state.setPoints(state.points+n)
        if (state.points > 50) throw new Victory(state)
        return trigger({type:'gainPoints', points:n, source:source})(state)
    }
}

function gainCoin(n:number, cost:boolean=false): Transform {
    return async function(state) {
        if (state.coin + n < 0 && cost) throw new CostNotPaid("Not enough coin")
        const adjustment = state.coin + n < 0 ? - state.coin : n
        state = state.setCoin(state.coin+adjustment)
        return trigger({type:'gainCoin', amount:adjustment, cost:cost})(state)
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
        return trigger({type:'chargeChange', card:card,
            oldCharge:oldCharge, newCharge:newCharge, cost:cost})(state)
    }
}

function addToken(card:Card, token:string): Transform {
    return async function(state) {
        state = state.apply(card=>card.update({tokens: card.tokens.concat([token])}), card)
        return trigger({type:'addToken', card:card, token:token})(state)
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
        const removed: number = countTokens(card, token)
        state = state.apply(card => card.update({tokens: card.tokens.filter(x => (x != token))}), card)
        return trigger({type:'removeTokens', token:token, removed:removed})(state)
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
        state = state.apply(card => card.update({tokens: removeOneToken(card.tokens)}), card)
        return trigger({type:'removeTokens', token:token, removed:removed})(state)
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
    const timeHtml: string = renderTime(cost.time)
    if (coinHtml == '' && timeHtml == '') return '&nbsp'
    else if (coinHtml == '') return timeHtml
    else return [coinHtml, timeHtml].join(' ')
}

function renderTime(n:number): string {
    const result: string[] = []
    for (var i = 0; i < n; i++) {
        result.push('@')
    }
    return result.join('')
}

function renderShadow(shadow:Shadow, state:State):string {
    const card:Card = shadow.original
    const tokenhtml:string = card.tokens.length > 0 ? '*' : ''
    const chargehtml:string = card.charge > 0 ? `(${card.charge})` : ''
    const costhtml:string = renderCost(card.cost(state))
    const ticktext:string = `tick=${shadow.tick}`
    const shadowtext:string = `shadow='true'`
    let tooltip:string;
    switch (shadow.kind) {
        case 'ability':
            tooltip = renderAbility((shadow.text as string))
            break
        case 'trigger':
        case 'replacer':
            tooltip = renderStatic((shadow.text as string))
            break
        case 'buy':
            tooltip = shadow.original.effect().description
            break
        default: assertNever(shadow.kind)
    }
    return [`<div class='card' ${ticktext} ${shadowtext}>`,
            `<div class='cardbody'>${card}${tokenhtml}${chargehtml}</div>`,
            `<div class='cardcost'>${costhtml}</div>`,
            `<span class='tooltip'>${tooltip}</span>`,
            `</div>`].join('')
}

function renderCard(card:Card|Shadow, state:State, asOption:number|null=null):string {
    if (card instanceof Shadow) {
        return renderShadow(card, state)
    } else {
        const tokenhtml:string = card.tokens.length > 0 ? '*' : ''
        const chargehtml:string = card.charge > 0 ? `(${card.charge})` : ''
        const costhtml:string = renderCost(card.cost(state))
        const choosetext:string = asOption == null ? '' : `choosable chosen='false' option=${asOption}`
        const ticktext:string = `tick=${card.ticks[card.ticks.length-1]}`
        return [`<div class='card' ${ticktext} ${choosetext}>`,
                `<div class='cardbody'>${card}${tokenhtml}${chargehtml}</div>`,
                `<div class='cardcost'>${costhtml}</div>`,
                `<span class='tooltip'>${renderTooltip(card, state)}</span>`,
                `</div>`].join('')
    }
}

function renderStatic(text:string): string {
    return `<div>(static) ${text}</div>`
}

function renderAbility(text:string): string {
    return `<div>(ability) ${text}</div>`
}

function renderTooltip(card:Card, state:State): string {
    const effectHtml:string = `<div>${card.effect().description}</div>`
    const abilitiesHtml:string = card.abilities().map(x => renderAbility(x.description)).join('')
    const triggerHtml:string = card.triggers().map(x => renderStatic(x.description)).join('')
    const replacerHtml:string = card.replacers().map(x => renderStatic(x.description)).join('')
    const staticHtml:string = triggerHtml + replacerHtml
    const tokensHtml:string = card.tokens.length > 0 ? `Tokens: ${card.tokens.join(', ')}` : ''
    const baseFilling:string = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('')
    function renderRelated(spec:CardSpec) {
        const card:Card = new Card(spec, -1)
        const costStr = renderCost(card.cost(emptyState))
        return `<div>---${card.toString()} (${costStr})---</div>${renderTooltip(card, state)}`
    }
    const relatedFilling:string = card.relatedCards().map(renderRelated).join('')
    return `${baseFilling}${relatedFilling}`
}

// make the currently rendered state available in the console for debugging purposes
var renderedState: State 

function renderState(state:State, optionsMap:Map<number,number>|null=null): void {
    renderedState = state
    clearChoice()
    function render(card:Card|Shadow) {
        if (optionsMap != null && optionsMap.has(card.id)) {
            return renderCard(card, state, optionsMap.get(card.id))
        } else {
            return renderCard(card, state)
        }
    }
    $('#time').html(state.time)
    $('#coin').html(state.coin)
    $('#points').html(state.points)
    $('#aside').html(state.aside.map(render).join(''))
    $('#resolving').html(state.resolving.map(render).join(''))
    $('#play').html(state.play.map(render).join(''))
    $('#supply').html(state.supply.map(render).join(''))
    $('#hand').html(state.hand.map(render).join(''))
    $('#deck').html(state.deck.map(render).join(''))
    $('#discard').html(state.discard.map(render).join(''))
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

type OptionTypes = 'string' | 'card'

interface StringOption<T> {
    kind: 'string';
    render: string;
    value: T;
}

interface CardOption<T> {
    kind: 'card';
    render: Card;
    value: T
}

type ChoiceOption<T> = StringOption<T>|CardOption<T>;

async function multichoice<T>(
    state:State, 
    prompt:string,
    options:ChoiceOption<T>[],
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
    options:ChoiceOption<T>[],
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

const yesOrNo:ChoiceOption<boolean>[] = [
    {kind:'string', render:'Yes', value:true},
    {kind:'string', render:'No', value:false}
]

function asChoice(x:Card): ChoiceOption<Card> {
    return {kind: 'card', render: x, value:x}
}

function allowNull<T>(options: ChoiceOption<T>[], message:string="None"): ChoiceOption<T|null>[] {
    return (options as ChoiceOption<T|null>[]).concat([{kind:'string', render:message, value:null}])
}

function renderChoice(
    state: State,
    choicePrompt: string,
    options: ChoiceOption<any>[],
    multi: boolean,
): void {
    const optionsMap:Map<number,number> = new Map() //map card ids to their position in the choice list
    const stringOptions:[number|'submit', string][] = []
    for (let i = 0; i < options.length; i++) {
        const option = options[i]
        switch (option.kind) {
            case 'card':
                optionsMap.set(option.render.id, i)
                break
            case 'string':
                stringOptions.push([i, option.render])
                break
            default: assertNever(option)
        }
    }
    if (multi) stringOptions.push(['submit', 'Done'])
    renderState(state, optionsMap)
    $('#choicePrompt').html(choicePrompt)
    $('#options').html(stringOptions.map(renderOption).join(''))
    $('#undoArea').html(renderUndo(state.undoable()))
}

function renderOption(option:[number|'submit', string]): string {
    return `<span class='option' option='${option[0]}' choosable='true' chosen='false'>${option[1]}</span>`
}

function renderUndo(undoable:boolean): string {
    return `<span class='option', option='undo' chooseable='${undoable}' chosen='false'>Undo</span>`
}

function clearChoice(): void {
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

function bindUndo(state:State, reject: ((x:any) => void)): void {
    $(`[option='undo']`).on('click', function(e: any){
        if (state.undoable()) reject(new Undo(state))
    })
}

function freshChoice<T>(
    state: State,
    choicePrompt: string,
    options: ChoiceOption<T>[],
): Promise<number> {
    renderChoice(state, choicePrompt, options, false)
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < options.length; i++) {
            const j = i;
            const elem = $(`[option='${i}']`)
            elem.on('click', function (e: any) {
                clearChoice()
                resolve(j)
            })
        }
        bindUndo(state, reject)
    })
}

//TODO: order can matter, should we make order visible somehow?
//TODO: what to do if you can't pick a valid set for the validator?
function freshMultichoice<T>(
    state: State,
    choicePrompt: string,
    options: ChoiceOption<T>[],
    validator:((xs:T[]) => boolean) = (xs => true)
): Promise<number[]> {
    renderChoice(state, choicePrompt, options, true)
    const chosen:Set<number> = new Set()
    function chosenOptions(): T[] {
        const result = []
        for (let i of chosen) result.push(options[i].value)
        return result
    }
    function isReady(): boolean {
        return validator(chosenOptions())
    }
    function setReady(): void {
        if (isReady()) {
            $(`[option='submit']`).attr('choosable', true)
        } else {
            $(`[option='submit']`).removeAttr('choosable')
        }
    }
    setReady()
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < options.length; i++) {
            const j = i;
            const elem = $(`[option='${i}']`)
            elem.on('click', function(e:any) {
                if (chosen.has(j)) {
                    chosen.delete(j)
                    elem.attr('chosen', false)
                } else {
                    chosen.add(j)
                    elem.attr('chosen', true)
                }
            })
        }
        $(`[option='submit']`).on('click', function(e:any){
            if (isReady()) {
                resolve(Array.from(chosen.values()))
            }
        })
        bindUndo(state, reject)
    })
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
    const validSupplies:Card[] = state.supply.filter(x => (x.cost(state).coin <= state.coin))
    const validHand:Card[] = state.hand
    const validPlay:Card[] = state.play.filter(x => (x.abilities().length > 0))
    const cards:Card[] = validSupplies.concat(validHand).concat(validPlay)
    return choice(state,
        'Play from your hand, use an ability, or buy from a supply.',
        cards.map(asChoice))
}

function useCard(card: Card): Transform {
    return async function(state: State): Promise<State> {
        state = state.startTicker(card);
        let ability:Ability|null; [state, ability] = await choice(state,
            "Choose an ability to use:",
            allowNull(card.abilities().map(x => ({kind:'string', render:x.description, value:x})))
        )
        state = state.endTicker(card)
        if (ability != null) {
            state = state.addShadow(card, 'ability', ability.description)
            state = state.startTicker(card)
            state = await payToDo(ability.cost, ability.effect)(state)
            state = state.endTicker(card)
            state = state.popResolving()
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
            if (state == null) throw Error("tried to undo past beginning of time")
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

async function mainLoop(state: State): Promise<State> {
    state = state.setCheckpoint()
    try {
        state = await act(state)
        return state
    } catch (error) {
        if (error instanceof Undo) {
            return undo(error.state)
        } else {
            throw error
        }
    }
}

// ------------------------------ Start the game

function supplyKey(spec:CardSpec): number {
    return new Card(spec, -1).cost(emptyState).coin
}
function supplySort(card1:CardSpec, card2:CardSpec): number {
    return supplyKey(card1) - supplyKey(card2)
}


async function playGame(seed?:number): Promise<void> {
    const startingDeck:CardSpec[] = [copper, copper, copper, copper, copper,
                                 copper, copper, estate, estate, estate]
    let state = emptyState;
    let shuffledDeck; [state, shuffledDeck] = randomChoices(state, startingDeck, startingDeck.length, seed)
    state = await doAll(shuffledDeck.map(x => create(x, 'deck')))(state);
    let variableSupplies; [state, variableSupplies] = randomChoices(state, mixins, 12, seed)
    variableSupplies.sort(supplySort)
    if (testing.length > 0) for (let i = 0; i < cheats.length; i++) testing.push(cheats[i])
    const kingdom = coreSupplies.concat(variableSupplies).concat(testing)
    state = await doAll(kingdom.map(x => create(x, 'supply')))(state)
    state = await trigger({type:'gameStart'})(state)
    try {
        while (true) {
            state = await mainLoop(state) 
        }
    } catch (error) {
        if (error instanceof Victory) {
            renderState(error.state)
            $('#choicePrompt').html(`You won using ${error.state.time} time!`)
        }
    }
}

function getSeed(): number|undefined {
    const seed = new URLSearchParams(window.location.search).get('seed')
    const n:number = Number(seed)
    return (isNaN(n)) ? undefined : n

}

function load(): void {
    playGame(getSeed())
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
        description:`Create a ${card.name} in your discard pile.`,
        effect: create(card)
    }
}
function supplyForCard(card:CardSpec, cost:Cost): CardSpec  {
    return {name: card.name,
        fixedCost: cost,
        effect: (supply:Card) => gainCard(card),
        relatedCards: [card],
    }
}
function register(card:CardSpec, test:'test'|null=null):void {
    mixins.push(card)
    if (test=='test') testing.push(card)
}
function buyable(card:CardSpec, n: number, test:'test'|null=null):void {
    register(supplyForCard(card, coin(n)), test)
}

function time(n:number):Cost {
    return {time:n, coin:0}
}
function coin(n:number):Cost {
    return {time:0, coin:n}
}

//renders either "a" or "an" as appropriate
function a(x:any): string {
    const s = x.toString()
    const c = s[0].toLowerCase()
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s
    return 'a ' + s
}


function makeCard(card:CardSpec, cost:Cost, selfdestruct:boolean=false):CardSpec  {
    return {name:card.name,
        fixedCost: cost,
        effect: supply => ({
            description:`Create ${a(card.name)} in play.` + selfdestruct ? ' Trash this.': '',
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
        }),
        relatedCards: [card],
    }
}



//
//
// ------ CORE ------
//


const reboot:CardSpec = {name: 'Reboot',
    fixedCost: time(3),
    effect: card => ({
        description: 'Recycle your hand and discard pile, lose all $, and +5 cards.',
        effect: async function(state) {
            state = await setCoin(0)(state)
            state = await recycle(state.hand.concat(state.discard))(state)
            state = await draw(5, reboot)(state)
            return state
        }
    })
}
coreSupplies.push(reboot)

const copper:CardSpec = {name: 'Copper',
    fixedCost: time(0),
    effect: card => ({
        description: '+$1',
        effect: gainCoin(1),
    })
}
coreSupplies.push(supplyForCard(copper, coin(1)))

const silver:CardSpec = {name: 'Silver',
    fixedCost: time(0),
    effect: card => ({
        description: '+$2',
        effect: gainCoin(2)
    })
}
coreSupplies.push(supplyForCard(silver, coin(3)))

const gold:CardSpec = {name: 'Gold',
    fixedCost: time(0),
    effect: card => ({
        description: '+$3',
        effect: gainCoin(3)
    })
}
coreSupplies.push(supplyForCard(gold, coin(6)))

const estate:CardSpec = {name: 'Estate',
    fixedCost: time(1),
    effect: card => ({
        description: '+1vp',
        effect: gainPoints(1),
    })
}
coreSupplies.push(supplyForCard(estate, coin(1)))

const duchy:CardSpec = {name: 'Duchy',
    fixedCost: time(1),
    effect: card => ({
        description: '+2vp',
        effect: gainPoints(2),
    })
}
coreSupplies.push(supplyForCard(duchy, coin(4)))

const province:CardSpec = {name: 'Province',
    fixedCost: time(1),
    effect: card => ({
        description: '+3vp',
        effect: gainPoints(3),
    })
}
coreSupplies.push(supplyForCard(province, coin(8)))

//
// ----- MIXINS -----
//

const throneRoom:CardSpec = {name: 'Throne Room',
    fixedCost: time(1),
    effect: card => ({
        description: `Play a card in your hand. Then if it's in your discard pile play it again.`,
        effect: async function(state) {
            let target; [state, target] = await choice(state,
                'Choose a card to play twice.',
                state.hand.map(asChoice))
            if (target == null) return state
            state = await target.play(card)(state)
            state = tick(card)(state)
            let result = state.find(target)
            if (result.place == 'discard') state = await result.card.play(card)(state)
            return state
        }
    })
}
buyable(throneRoom, 4)

const mule:CardSpec = {name: 'Mule',
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
}
buyable(mule, 1)


const smithy:CardSpec = {name: 'Smithy',
    fixedCost: time(1),
    effect: card => ({
        description: '+3 cards',
        effect: draw(3)
    })
}
buyable(smithy, 4)

const tutor:CardSpec = {name: 'Tutor',
    fixedCost: time(1),
    effect: card => ({
        description: 'Put any card from your deck into your hand.',
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

const cellar:CardSpec = {name: 'Cellar',
    fixedCost: time(0),
    effect: card => ({
        description: 'Discard any number of cards in your hand, then draw that many cards.',
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
buyable(cellar, 2)

const pearlDiver:CardSpec = {name: 'Pearl Diver',
    fixedCost: time(0),
    effect: _ => ({
        description: '+1 card. You may put the bottom card of your deck on top of your deck.',
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
    fixedCost: time(0),
    effect: card => ({
        description: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    })
}
const makePeddler:CardSpec = {name: 'Peddler',
    fixedCost: coin(5),
    effect: card => ({
        description: 'Create a peddler on top of your deck',
        effect: create(peddler, 'deck', 'top')
    }),
    relatedCards: [peddler]
}
register(makePeddler)

async function freeAction(state: State): Promise<State> {
    const options = state.hand.filter((card:Card) => (card.cost(state).time <= 1)).map(asChoice);
    let target;
    [state, target] = await choice(state, 'Choose a card costing up to @ to play',allowNull(options))
    return (target == null) ? state : target.play()(state)
}
const villagestr = 'Do this up to two times: play a card in your hand costing up to @.'

const village:CardSpec = {name: 'Village',
    fixedCost: time(1),
    effect: card => ({
        description: `+1 card. ${villagestr}`,
        effect: doAll([draw(1), freeAction, tick(card), freeAction])
    })
}
buyable(village, 3)

const bazaar:CardSpec = {name: 'Bazaar',
    fixedCost: time(1),
    effect: card => ({
        description: `+1 card. +$1. ${villagestr}`,
        effect: doAll([draw(1), gainCoin(1), freeAction, tick(card), freeAction])
    })
}
buyable(bazaar, 5)

const workshop:CardSpec = {name: 'Workshop',
    effect: card => ({
        description: 'Buy a card in the supply costing up to $4.',
        effect: async function(state) {
            const options = state.supply.filter(card => (card.cost(state).coin <= 4 && card.cost(state).time <= 0));
            let target;
            [state, target] = await choice(state, 'Choose a card costing up to $4 to buy.',
                allowNull(options.map(asChoice)))
            return (target == null) ? state : target.buy(card)(state)
        }
    })
}
buyable(workshop, 3)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: time(1),
    effect: card => ({
        description: "+$2. Next time you finish buying a card, buy it again if it still exists.",
        effect: doAll([
            gainCoin(2),
            nextTime('Shipping Lane', 'When you finish buying a card, discard this and buy it again if it still exists.',
                e => e.type == 'afterBuy', e => (e.after == null) ? noop : e.after.buy(card))
        ])
    })
}
buyable(shippingLane, 5, 'test')

const factory:CardSpec = {name: 'Factory',
    fixedCost: time(1),
    effect: card => ({
        description: 'Buy a card in the supply costing up to $6.',
        effect: async function(state) {
            const options = state.supply.filter(card => (card.cost(state).coin <= 6 && card.cost(state).time <= 0));
            let target;
            [state, target] = await choice(state, 'Choose a card costing up to $6 to buy.',
                allowNull(options.map(asChoice)))
            return (target == null) ? state : target.buy(card)(state)
        }
    })
}
buyable(factory, 4)

const feast:CardSpec = {name: 'Feast',
    fixedCost: time(0),
    effect: card => ({
        description: '+$5. Trash this.',
        effect: doAll([gainCoin(5), trash(card)]),
    })
}
buyable(feast, 4)

//TODO: let Reboot choose cards arbitrarily if it costs 0
const warFooting:CardSpec = {name: 'War Footing',
    replacers: card => [{
        description: 'Reboot costs @ less to play.',
        handles: x => (x.type == 'cost' && x.card == 'Reboot'),
        replace: x => updates(x, {'cost': {'coin': x.cost.coin, 'time': Math.max(0, x.cost.time-1)}})
    }]
}
const gainWarFooting:CardSpec = {name: 'War Footing',
    calculatedCost: (card, state) => ({time:0, coin:15+10*card.charge}),
    effect: card => ({
        description: `Create a ${warFooting.name} in play.` +
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(warFooting, 'play'), charge(card, 1)])
    }),
    relatedCards: [warFooting],
}
mixins.push(gainWarFooting)

const junkDealer:CardSpec = {name: 'Junk Dealer',
    fixedCost: time(0),
    effect: card => ({
        description: '+1 card. +$1. Trash a card in your hand.',
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
    fixedCost: time(1),
    effect: card => ({
        description: 'Recycle your discard pile.',
        effect: async function(state) { return recycle(state.discard)(state) }
    })
}
mixins.push(refresh)

const plough:CardSpec = {name: 'Plough',
    fixedCost: time(1),
    effect: card => ({
        description: 'Recycle any number of cards from your discard pile. +2 cards.',
        effect: async function(state) {
            let cards
            [state, cards] = await multichoice(state,
                'Choose any number of cards to recycle.',
                state.discard.map(asChoice),
                xs => true)
            state = await recycle(cards)(state)
            return draw(2)(state)
        }
    })
}
buyable(plough, 5)

const vassal:CardSpec = {name: 'Vassal',
    fixedCost: time(1),
    effect: card => ({
        description: "+$2. Look at a random card from your deck. You may play it.",
        effect: async function(state) {
            state = await gainCoin(2)(state);
            if (state.deck.length == 0) return state
            const target = state.deck[0]
            let playIt; [state, playIt] = await choice(state, `Play ${target.name}?`, yesOrNo)
            return playIt ? target.play(card)(state) : state
        }
    })
}
buyable(vassal, 3)

const reinforce:CardSpec = {name: 'Reinforce',
    fixedCost: {time:2, coin:7},
    effect: card => ({
        description: 'Put a reinforce token on a card in your hand.',
        effect: async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to put a reinforce token on.',
                state.hand.map(asChoice))
            if (target == null) return state
            return addToken(target, 'reinforce')(state)
        }
    }),
    triggers: card => [{
        'description': `After playing a card with a reinforce token other than with this, if it's in your discard pile play it again.`,
        'handles':e => (e.type == 'afterPlay' && e.before.tokens.includes('reinforce') && e.source.id != card.id),
        'effect':e => async function(state) {
            const result = state.find(e.before)
            return (result.place == 'discard') ? result.card.play(card)(state) : state
        }
    }],
}
register(reinforce)

const blacksmith:CardSpec = {name: 'Blacksmith',
    fixedCost: time(1),
    effect: card => ({
        description: 'Add a charge token to this, then +1 card per charge token on this.',
        effect: async function(state) {
            state = await charge(card, 1)(state);
            const result = state.find(card)
            if (result.found) {
                state = await draw(result.card.charge)(state);
                state = await move(result.card, 'discard')(state)
            }
            return state
        },
        skipDiscard: true
    })
}
buyable(blacksmith, 2)

function nextTime(name:string,
    description:string,
    when: (e:GameEvent, state:State) => boolean,
    what: (e:GameEvent)  => Transform
): Transform {
    const spec:CardSpec = {
        name:name,
        triggers: card => [{
            description: description,
            handles: (e:GameEvent, state:State) => (when(e, state) && state.find(card).place == 'play'),
            effect: (e:GameEvent) => doAll([trash(card), what(e)]),
        }]
    }
    return create(spec, 'play')

}

const expedite:CardSpec = {name: 'Expedite',
    calculatedCost: (card, state) => ({time:1, coin:card.charge}),
    effect: card => ({
        description: 'The next time you create a card, put it into your hand.'+
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: nextTime('Expedite', 'When you create a card, trash this and put it into your hand.',
            (e, state) => (e.type == 'create'), e => move(e.card, 'hand'))
    })
}
register(expedite)

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: time(2),
    effect: card => ({
        description: 'Create a gold in your hand and a gold on top of your deck.',
        effect: doAll([create(gold, 'hand', 'top'), create(gold, 'hand')]),
    })
}
buyable(goldMine, 6)

const vault:CardSpec = {name: 'Vault',
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards. Discard any number of cards from your hand, +1 card per card discarded.',
        effect: async function(state) {
            state = await draw(2)(state);
            let toDiscard;
            [state, toDiscard] = await multichoice(state,
                'Discard any number of cards for +$1 each.',
                state.hand.map(asChoice),
                xs => true)
            state = await moveMany(toDiscard, 'discard')(state)
            return draw(toDiscard.length)(state)
        }
    })
}
buyable(vault, 5)

const cursedKingdom:CardSpec = {name: 'Cursed Kingdom',
    fixedCost: time(0),
    effect: card => ({
        description: '+4 vp. Put a charge token on this.',
        effect: doAll([gainPoints(4), charge(card, 1)])
    })
}
const gainCursedKingdom:CardSpec = {name: 'Cursed Kingdom',
    fixedCost: coin(5),
    relatedCards: [cursedKingdom],
    effect: card => ({
        description: `Create a ${card.name} in your discard pile.`,
        effect: create(cursedKingdom, 'discard')
    }),
    triggers: card => [{
        description: `Whenever you put a ${card.name} into your hand, +@ for each charge token on it.`,
        handles: e => (e.type == 'moved' && e.card.name == card.name && e.toZone == 'hand'),
        effect: e => gainTime(e.card.charge)
    }]
}
mixins.push(gainCursedKingdom)

const junkyard:CardSpec = {name: 'Junkyard',
    fixedCost: time(0),
    triggers: card => [{
        description: 'Whenever you trash a card, +1 vp.',
        handles: e => (e.type == 'moved' && e.toZone == null),
        effect: e => gainPoints(1)
    }]
}
mixins.push(makeCard(junkyard, {coin:7, time:3}))


const bustlingSquare:CardSpec = {name: 'Bustling Square',
    fixedCost: time(1),
    effect: card => ({
        description: `+1 card. Set aside all cards in your hand. Play them in any order.`,
        effect: async function(state) {
            state = await draw(1)(state)
            let hand:Card[]= state.hand;
            state = await moveWholeZone('hand', 'aside')(state)
            while (true) {
                let target:Card|null; [state, target] = await choice(state,
                    'Choose which card to play next.', hand.map(asChoice))
                if (target == null) {
                    return state
                } else {
                    state = await target.play(card)(state)
                    const id = target.id
                    hand = hand.filter((c:Card) => c.id != id)
                }
            }
        }
    })
}
buyable(bustlingSquare, 6)

const colony:CardSpec = {name: 'Colony',
    fixedCost: time(1),
    effect: card => ({
        description: '+5vp',
        effect: gainPoints(5),
    })
}
buyable(colony, 16)

const windfall:CardSpec = {name: 'Windfall',
    fixedCost: {time:0, coin:6},
    effect: card => ({
        description: 'If there are no cards in your deck, create two golds in your discard pile.',
        effect: async function(state) {
            return (state.deck.length == 0) ? doAll([create(gold), create(gold)])(state) : state
        }
    })
}
register(windfall)

const stables:CardSpec = {name: 'Stables',
    abilities: card => [{
        description: 'Remove a charge token from this. If you do, +1 card.',
        cost: discharge(card, 1),
        effect: draw(1, card),
    }]
}
const horse:CardSpec = {name: 'Horse',
    fixedCost: coin(2),
    effect: card => ({
        description: `Put a charge token on a ${stables.name} in play.`,
        effect: fill(stables, 1),
    }),
    triggers: card => [ensureAtStart(stables)],
}
register(horse)


const lookout:CardSpec = {name: 'Lookout',
    fixedCost: time(0),
    effect: card => ({
        description: 'Look at the top 3 cards from your deck. Trash one then discard one.',
        effect: async function(state) {
            let picks = state.deck.slice(0, 3)
            async function pickOne(descriptor: string, zone: PlaceName, state: State) {
                let pick:Card|null; [state, pick] = await choice(state,
                    `Pick a card to ${descriptor}.`,
                    picks.map(asChoice))
                if (pick==null) return state // shouldn't be possible
                const id = pick.id
                picks = picks.filter(card => card.id != id)
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
buyable(lookout, 3)

const lab:CardSpec = {name: 'Lab',
    fixedCost: time(0),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
}
buyable(lab, 5)

const roadNetwork:CardSpec = {name: 'Road Network',
    fixedCost: time(0),
    triggers: _ => [{
        description: 'Whenever you create a card in your discard pile, move it to the top of your deck.',
        handles: e => (e.type == 'create' && e.toZone == 'discard'),
        effect: e => move(e.card, 'deck', 'top')
    }]
}
mixins.push(makeCard(roadNetwork, coin(5), true))

const twins:CardSpec = {name: 'Twins',
    fixedCost: time(0),
    triggers: card => [{
        description: `When you finish playing a card other than with ${twins.name}, if it costs @ or more then you may play a card in your hand with the same name.`,
        handles: e => (e.type == 'afterPlay' && e.source.name != twins.name),
        effect: e => async function(state) {
            if (e.before.cost(state).time == 0) return state
            const cardOptions = state.hand.filter(x => (x.name == e.before.name))
            let replay;
            [state, replay] = await choice(state, `Choose a card named '${e.before.name}' to play.`,
                allowNull(cardOptions.map(asChoice), "Don't play"))
            return (replay == null) ? state : replay.play(card)(state)
        }
    }]
}
register(makeCard(twins, {time:0, coin:6}))

const masterSmith:CardSpec = {name: 'Master Smith',
    fixedCost: time(2),
    effect: card => ({
        description: '+5 cards',
        effect: draw(5),
    })
}
buyable(masterSmith, 5)

const reuse:CardSpec = {name: 'Reuse',
    calculatedCost: (card, state) => ({time:1, coin:card.charge}),
    effect: card => ({
        description: 'Put a card from your discard into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
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

const reconfigure:CardSpec = {name: 'Reconfigure',
    fixedCost: time(1),
    effect: card => ({
        description: 'Recycle your hand and discard pile, lose all $, and +1 card per card that was in your hand.',
        effect: async function(state) {
            state = await setCoin(0)(state)
            const n = state.hand.length
            state = await recycle(state.hand.concat(state.discard))(state)
            return draw(n, card)(state)
        }
    })
}
mixins.push(reconfigure)

const bootstrap:CardSpec = {name: 'Bootstrap',
    fixedCost: time(1),
    effect: card => ({
        description: 'Recycle your hand and discard pile, lose all $, and +2 cards.',
        effect: async function(state) {
            state = await setCoin(0)(state)
            state = await recycle(state.hand.concat(state.discard))(state)
            return draw(2, bootstrap)(state)
        }
    })
}
mixins.push(bootstrap)

const retry:CardSpec = {name: 'Resume',
    fixedCost: time(2),
    effect: card => ({
        description: 'Discard your hand, lose all $, and +5 cards.',
        effect: doAll([
            setCoin(0),
            moveWholeZone('hand', 'discard'),
            draw(5, retry)
        ])
    })
}
mixins.push(retry)

const research:CardSpec = {name: 'Research',
    calculatedCost: (card, state) => ({time:1, coin:card.charge}),
    effect: card => ({
        description: 'Put a card from your deck into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: async function(state) {
            let target;
            [state, target] = await choice(state, 'Choose a card to put into your hand.',
                state.deck.map(asChoice))
            state = await charge(card, 1)(state)
            return (target == null) ? state : move(target, 'hand')(state)
        }
    })
}
mixins.push(research)

const platinum:CardSpec = {name: "Platinum",
    fixedCost: time(0),
    effect: card => ({
        description: '+$5',
        effect: gainCoin(5)
    })
}
buyable(platinum, 10)

const innovation:CardSpec = {name: "Innovation",
    triggers: card => [{
        description: "Whenever you create a card in your discard pile, if this has an innovate token on it:" +
        " remove all innovate tokens from this, discard your hand, lose all $, and play the card.",
        handles: e => (e.type == 'create' && e.toZone == 'discard' && countTokens(card, 'innovate') > 0),
        effect: e => doAll([
            removeTokens(card, 'innovate'),
            moveWholeZone('hand', 'discard'),
            setCoin(0),
            e.card.play(card)
        ]),
    }],
    abilities: card => [{
        description: "Put an innovate token on this.",
        cost: noop,
        effect: addToken(card, 'innovate')
    }]
}
register(makeCard(innovation, {coin:7, time:0}, true))

const citadel:CardSpec = {name: "Citadel",
    triggers: card => [{
        description: `After playing a card the normal way, if it's the only card in your discard pile, play it again.`,
        handles: e => (e.type == 'afterPlay' && e.source.name == 'act'),
        effect: e => async function(state) {
            if (e.after != null && state.find(e.after).place == 'discard' && state.discard.length == 1) {
                return e.after.play(card)(state)
            } else {
                return state
            }
        }
    }]
}
register(makeCard(citadel, {coin:8, time:0}, true))

const foolsGold:CardSpec = {name: "Fool's Gold",
    fixedCost: time(0),
    effect: card => ({
        description: "+$1. +$1 per Fool's Gold in your discard pile.",
        effect: async function(state) {
            const n = state.discard.filter(x => x.name == card.name).length
            return gainCoin(n+1)(state)
        }
    })
}
buyable(foolsGold, 2)

const hireling:CardSpec = {name: 'Hireling',
    fixedCost: time(0),
    replacers: card => [{
        description: "Whenever you draw a card from Reboot, draw an additional card.",
        handles: x => (x.type == 'draw' && x.source.name == reboot.name),
        replace: x => updates(x, {draw:x.draw+1})
    }]
}
register(makeCard(hireling, {coin:6, time:2}))

const sacrifice:CardSpec = {name: 'Sacrifice',
    fixedCost: time(0),
    effect: card => ({
        description: 'Play a card in your hand, then trash it.',
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
    fixedCost: time(1),
    effect: _ => ({
        description: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    })
}
buyable(horseTraders, 4)

const purge:CardSpec = {name: 'Purge',
    fixedCost: time(5),
    effect: card => ({
        description: 'Trash any number of cards from your hand. Trash this.',
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
    fixedCost: time(1),
    effect: _ => ({
        description: 'Trash up to four cards from your hand.',
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
    fixedCost: time(1),
    effect: card => ({
        description: '+$1 per copper in your hand.',
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
    fixedCost: time(1),
    effect: _ => ({
        description: '+$1 per differently named card in your hand, up to +$4.',
        effect: async function(state) {
            return gainCoin(Math.min(4, countDistinct(state.hand.map(x => x.name))))(state)
        }
    })
}
buyable(harvest, 4)

const fortify:CardSpec = {name: 'Fortify',
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your discard pile in your hand. Trash this.',
        effect: doAll([moveWholeZone('discard', 'hand'), trash(card)]),
        skipDiscard:true,
    })
}
const gainFortify:CardSpec = {name: 'Fortify',
    fixedCost: coin(5),
    effect: card => ({
        description: 'Create a fortify in your discard pile. Discard your hand.',
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }),
    relatedCards: [fortify],
}
mixins.push(gainFortify)

const explorer:CardSpec = {name: "Explorer",
    fixedCost: time(1),
    effect: card => ({
        description: "Create a silver in your hand. "+
            "If you have a province in your hand, instead create a gold in your hand.",
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
    fixedCost: time(2),
    effect: card => ({
        description: "Choose a card in your hand. Play it, " +
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
    fixedCost: {time:1, coin:4},
    effect: card => ({
        description: "+1 vp per 10 cards in your deck, hand, and discard pile.",
        effect: async function(state) {
            const n = state.hand.length + state.deck.length + state.discard.length
            return gainPoints(Math.floor(n/10))(state)
        }
    })
}
mixins.push(gardens)


const pathfinding:CardSpec = {name: 'Pathfinding',
    fixedCost: {coin:5, time:1},
    effect: card => ({
        description: 'Put a path token on a card in your hand.',
        effect: async function(state) {
            let target; [state, target] = await choice(state,
                'Choose a card to put a path token on.',
                state.hand.map(asChoice))
            if (target == null) return state
            return addToken(target, 'path')(state)
        }
    }),
    triggers: card => [{
        description: 'Whenever you play a card, draw a card per path token on it.',
        handles:e => (e.type == 'play' && e.card.tokens.includes('path')),
        effect:e => draw(countTokens(e.card, 'path'))
    }],
}
mixins.push(pathfinding)

const counterfeit:CardSpec = {name: 'Counterfeit',
    effect: card => ({
        description: 'Play a card from your deck, then trash it.',
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
buyable(counterfeit, 5)

const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(4),
    effect: card => ({
        description: 'Remove all decay tokens from all cards in your hand.',
        effect: async function(state) {
            return doAll(state.hand.map(x => removeTokens(x, 'decay')))(state)
        }
    }),
    triggers: card => [{
        description: 'Whenever you play a card, put a decay token on it.',
        handles: e => (e.type == 'play'),
        effect: e => addToken(e.card, 'decay')
    }, {
        description: 'After you play a card, if it has 3 or more decay tokens on it trash it.',
        handles: e => (e.type == 'afterPlay' && e.after != null && countTokens(e.after, 'decay') >= 3),
        effect: e => trash(e.after),
    }]
}
mixins.push(decay)

const perpetualMotion:CardSpec = {name: 'Perpetual Motion',
    triggers: card => [{
        description: 'Whenever you have no cards in hand, draw a card.',
        handles: (e, state) => (state.hand.length == 0 && state.deck.length > 0),
        effect: e => draw(1),
    }]
}
register(makeCard(perpetualMotion, time(7), true))

const looter:CardSpec = {name: 'Looter',
    effect: card => ({
        description: '+1 card. Discard any number of cards from the top of your deck.',
        effect: async function(state) {
            state = await draw(1)(state)
            let index; [state, index] = await choice(state,
                'Choose a card to discard (along with everything above it).',
                allowNull(state.deck.map((x, i) => ({kind:'card', render:state.deck[i], value:i}))))
            return (index == null) ? state  : moveMany(state.deck.slice(0, index+1), 'discard')(state)
        }
    })
}
buyable(looter, 3)

const scavenger:CardSpec = {name: 'Scavenger',
    fixedCost: time(1),
    effect: card => ({
        description: '+$2. Put a card from your discard pile on top of your deck.',
        effect: async function(state) {
            state = await gainCoin(2)(state)
            let target; [state, target] = await choice(state,
                'Choose a card to put on top of your deck.',
                allowNull(state.discard.map(asChoice)))
            return (target == null) ? state : move(target, 'deck', 'top')(state)
        }
    })
}
buyable(scavenger, 4)


const coffers:CardSpec = {name: 'Coffers',
    abilities: card => [{
        description: 'Remove a charge token from this. If you do, +$1.',
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
function ensureAtStart(spec:CardSpec): Trigger {
    return {
        description: `At the start of the game, create a ${spec.name} in play if there isn't one.`,
        handles: e => e.type == 'gameStart',
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
        description: `Put two charge tokens on a ${coffers.name} in play.`,
        effect: fill(coffers, 2)
    }),
    triggers: card => [ensureAtStart(coffers)]
}
register(fillCoffers)

const cotr:CardSpec = {name: 'Coin of the Realm',
    fixedCost: time(1),
    effect: card => ({
        description: '+$1. Put this in play.',
        skipDiscard: true,
        effect: doAll([gainCoin(1), move(card, 'play')])
    }),
    abilities: card => [{
        description: `${villagestr} Discard this.`,
        cost: noop,
        effect: doAll([freeAction, tick(card), freeAction, move(card, 'discard')]),
    }]
}
buyable(cotr, 3)

const mountainVillage:CardSpec = {name: 'Mountain Village',
    fixedCost: time(1),
    effect: card => ({
        description: "You may play a card in your hand or discard pile costing up to @." +
            " You may play a card in your hand costing up to @.",
        effect: async function(state) {
            const options = state.hand.concat(state.discard).filter(card => (card.cost(state).time <= 1)).map(asChoice);
            let target;
            [state, target] = await choice(state, 'Choose a card costing up to @ to play',allowNull(options))
            if (target != null) state = await target.play()(state)
            state = tick(card)(state)
            return freeAction(state)
        }
    })
}
buyable(mountainVillage, 3)

const fillStables:CardSpec = {name: 'Fill Stables',
    fixedCost: coin(4),
    effect: card => ({
        description: `Put two charge tokens on a ${stables.name} in play.`,
        effect: fill(stables, 2),
    }),
    triggers: card => [ensureAtStart(stables)],
}
register(fillStables)



const sleigh:CardSpec = {name: 'Sleigh',
    fixedCost: time(1),
    effect: card => ({
        description: `Put two charge tokens on a ${stables.name} in play.`,
        effect: fill(stables, 2),
    })
}
const makeSleigh:CardSpec = {name: 'Sleigh',
    fixedCost: coin(2),
    relatedCards: [sleigh],
    effect: card => gainCard(sleigh),
    triggers: card => [
        ensureAtStart(stables),
        {
            description: `Whenever you create a card, if you have a ${sleigh.name} in your hand,` +
                ' you may discard it to put the card into your hand.',
            handles: e => (e.type == 'create'),
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
    fixedCost: time(1),
    effect: card => ({
        description: 'Put a ferry token on a supply.',
        effect: async function(state) {
            let target; [state, target] = await choice(state, 'Put a ferry token on a supply.',
                state.supply.map(asChoice))
            if (target != null) state = await addToken(target, 'ferry')(state)
            return state
        }
    })
}
function ferryReduce(cost:Cost, n:number): Cost {
    return {time: cost.time, coin: Math.max(cost.coin - n, (cost.time > 0) ? 0 : 1)}
}
const makeFerry:CardSpec = {name: 'Ferry',
    fixedCost: coin(3),
    relatedCards: [ferry],
    effect: card => gainCard(ferry),
    replacers: card => [{
        description: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
        handles: p => (p.type == 'cost' && countTokens(p.card, 'ferry') > 0),
        replace: p => updates(p, {cost: ferryReduce(p.cost, countTokens(p.card, 'ferry'))})
    }]
}
register(makeFerry)





const livery:CardSpec = {name: 'Livery',
    replacers: card => [{
        description: `Whenever you would draw cards other than with ${stables.name},` +
            ` put that many charge tokens on a ${stables.name} in play instead.`,
        handles: x => (x.type == 'draw' && x.source.name != stables.name),
        replace: x => updates(x, {'draw':0, 'effects':x.effects.concat([fill(stables, x.draw)])})
    }]
}
const makeLivery:CardSpec = {name: 'Livery',
    fixedCost: time(4),
    relatedCards: [livery, stables],
    effect: card => ({
        description: `Create a ${livery.name} in play, and a stables if there isn't one. Trash this.`,
        effect: doAll([create(livery, 'play'), createIfNeeded(stables), trash(card)])
    }),
}
register(makeLivery)

function slogCheck(card: Card): (state: State) => Promise<State> {
    return async function(state) {
        const result = state.find(card)
        if (result.found && result.card.charge >= 100) state = await gainPoints(100, card)(state)
        return state
    }
}
const slog:CardSpec = {name: 'Slog',
    fixedCost: coin(4),
    effect: card => ({
        description: 'Add a charge token to this. Whenever this has 100 or more charge tokens, +100 points.',
        effect: doAll([charge(card, 1), slogCheck(card)]),
    }),
    replacers: card => [{
        description: 'Whenever you gain points other than with this, instead put that many charge tokens on this.',
        handles: x => (x.type == 'gainPoints' && x.source.id != card.id),
        replace: x => updates(x, {points: 0, effects: x.effects.concat([charge(card, x.points), slogCheck(card)])})
    }]
}
register(slog)

const burden:CardSpec = {name: 'Burden',
    fixedCost: time(1),
    effect: card => ({
        description: 'Remove a burden token from a card in the supply',
        effect: async function(state) {
            const options = state.supply.filter(x => countTokens(x, 'burden') > 0)
            let target; [state, target] = await choice(state, 'Choose a supply to unburden.',
                allowNull(options.map(asChoice)))
            if (target == null) return state
            return removeOneToken(target, 'burden')(state)
        }
    }),
    triggers: card => [{
        description: 'Whenever you buy a card costing $, put a burden token on it.',
        handles: (e, state) => (e.type == 'buy' && e.card.cost(state).coin >= 1),
        effect: e => addToken(e.card, 'burden')
    }],
    replacers: card => [{
        description: 'Cards cost $1 more for each burden token on them.',
        handles: x => (x.type == 'cost' && countTokens(x.card, 'burden') > 0),
        replace: x => updates(x, {cost: {time:x.cost.time, coin: x.cost.coin+countTokens(x.card, 'burden')}})
    }]
}
register(burden, 'test')

const artisan:CardSpec = {name: 'Artisan',
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    })
}
buyable(artisan, 6)

const chancellor:CardSpec = {name: 'Chancellor',
    effect: card => ({
        description: '+$2. You may discard your deck.',
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


// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Free money',
    fixedCost: time(0),
    effect: card => ({
        description: '+$100',
        effect: gainCoin(100)
    })
}
cheats.push(freeMoney)

const freeTutor:CardSpec = {name: 'Free tutor',
    fixedCost: time(0),
    effect: card => ({
        description: 'Put any card from your deck or discard pile into your hand.',
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
    fixedCost: time(0),
    effect: card => ({
        description: 'Draw a card.',
        effect: draw(1),
    })
}
cheats.push(freeDraw)

const freeTrash:CardSpec = {name: 'Free trash',
    effect: card => ({
        description: 'Trash any number of cards in your hand, deck, and discard pile.',
        effect: async function(state) {
            let toTrash: Card[]; [state, toTrash] = await multichoice(state, 'Choose cards to trash.',
                state.deck.concat(state.discard).concat(state.hand).map(asChoice),
                xs => true)
            return moveMany(toTrash, null)(state)
        }
    })
}
cheats.push(freeTrash)

const drawAll:CardSpec = {name: 'Draw all',
    fixedCost: time(0),
    effect: card => ({
        description: 'Put all cards from your deck and discard pile into your hand.',
        effect: doAll([moveWholeZone('discard', 'hand'), moveWholeZone('deck', 'hand')]),
    })
}
cheats.push(drawAll)
