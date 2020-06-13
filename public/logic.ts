export const VERSION = "0.7"

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

//renders either "a" or "an" as appropriate
function a(s:string): string {
    const c = s[0].toLowerCase()
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s
    return 'a ' + s
}

function lowercase(s:string): string {
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


//TODO: should Token be a type? can avoid token name typos...
//(could also have token rendering hints...)
export class Card {
    readonly name: string;
    readonly charge: number;
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

export type Replayable = number[]

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

function get<T, K extends keyof T>(
    stateUpdate:Partial<T>,
    k:K,
    state:T,
): Partial<T>[K] {
    return (stateUpdate[k] === undefined) ? state[k] : stateUpdate[k]
}

export type SlotSpec = CardSpec|'Random'
export const RANDOM = 'Random'

export interface FullGameSpec {
    seed: string;
    cards: SlotSpec[];
    events: SlotSpec[];
    testing: boolean;
}

export interface GameSpec {
    seed: string;
    cards?: SlotSpec[];
    events?: SlotSpec[];
    testing?: boolean;
    type: 'main';
}


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
        public readonly spec: GameSpec = {seed: '', type:'main'},
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
        public readonly logs: string[] = [],
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
    private update(stateUpdate:Partial<State>) {
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
    addHistory(record:Replayable): State {
        let result:Replayable|null, redo:Replayable[]; [result, redo] = popLast(this.redo)
        if (result === null || result.some((x, i) => x != record[i])) {
            redo = []
        }
        return this.update({history: this.history.concat([record]), redo:redo})
    }
    log(msg:string): State {
        //return this
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
        return this.update({redo: this.redo.concat([action])})
    }
    serializeHistory(includeVersion:boolean=true): string {
        let state:State = this;
        let prev:State|null = state;
        while (prev != null) {
            state = prev;
            prev = state.backup()
        }
        return serializeReplay({
            version: includeVersion ? VERSION : '',
            actions:state.future
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
    return [r.version].concat(
        r.actions.map(xs => xs.map(String).join(','))
    ).join(';')
}

export function parseReplay(s:string): Replay {
    const [version, pieces] = shiftFirst(s.split(';'))
    if (version === null) throw new MalformedReplay('No version');
    function parsePiece(piece:string): number[] {
        if (piece == '') return [];
        const result:number[] = piece.split(',').map(x => parseInt(x))
        if (result.some(isNaN)) throw new MalformedReplay(`${piece} is not a valid action`);
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
interface AfterBuyEvent {kind:'afterBuy'; card:Card; source:Source, before:State}
interface PlayEvent {kind:'play'; card:Card; source:Source}
interface AfterPlayEvent {kind:'afterPlay'; card:Card; source:Source, before:State}
interface UseEvent {kind:'use'; card:Card; source:Source}
interface AfterUseEvent {kind:'afterUse'; card:Card; source:Source, before:State}
interface ActivateEvent {kind:'activate', card:Card, source:Source}
interface CreateEvent {kind:'create', card:Card, zone:ZoneName}
interface MoveEvent {kind:'move', fromZone:PlaceName, toZone:PlaceName, loc:InsertLocation, card:Card}
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

//TODO: this should maybe be async and return a new state?
//(e.g. the "put it into your hand" should maybe be replacement effects)
//x is an event that is about to happen
//each card in play or supply can change properties of x
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
        if (state.actions < c.actions) throw new CostNotPaid("Not enough actions")
        if (state.buys < c.buys) throw new CostNotPaid("Not enough buys")
        state = state.setResources({
            coin:state.coin - c.coin,
            actions:state.actions - c.actions,
            buys:state.buys - c.buys,
            energy:state.energy + c.energy,
            points:state.points
        })
        if (renderCost(c, true) != '') state = state.log(`Paid ${renderCost(c, true)}`)
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
    'reuse' | 'polish' | 'priority' | 'hesitation'

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

function removeTokens(card:Card, token:Token): Transform {
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
function removeToken(card:Card, token:Token, isCost:boolean=false): Transform {
    return async function(state) {
        let removed:number = 0
        card = state.find(card)
        console.log(token)
        console.log(card)
        console.log(card.count(token))
        if (card.place == null || card.count(token) == 0) {
            if (isCost) throw new CostNotPaid(`Couldn't remove ${token} token.`)
            return state
        }
        console.log('!')
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

export class InvalidHistory extends Error {
    constructor(public indices:Replayable, public state:State) {
        super(`Indices ${indices} do not correspond to a valid choice`)
        Object.setPrototypeOf(this, InvalidHistory.prototype)
    }
}

export class Undo extends Error {
    constructor(public state:State) {
        super('Undo')
        Object.setPrototypeOf(this, Undo.prototype)
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
        let indices:number[], newState:State; [newState, indices] = await doOrReplay(
            state,
            () => state.ui.multichoice(state, prompt, options, validator),
        )
        if (indices.some(x => x >= options.length))
            throw new InvalidHistory(indices, state)
        return [newState, indices.map(i => options[i].value)]
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
        let indices:number[], newState:State; [newState, indices] = await doOrReplay(
            state,
            async function() {const x = await state.ui.choice(state, prompt, options); return [x]},
        )
        if (indices.length != 1 || indices[0] >= options.length)
            throw new InvalidHistory(indices, state)
        return [newState, options[indices[0]].value]
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
            return state.addRedo(last)
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

export async function verifyScore(spec:GameSpec, history:string, score:number): Promise<[boolean, string]> {
    try {
        await playGame(State.fromReplayString(history, spec))
        return [true, ""] //unreachable
    } catch(e) {
        if (e instanceof Victory) {
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
            return {render:c.id, value:[c, kind]}
        }
    }
    function available(kind:ActionKind) { return (c:Card) => c.available(kind, state) }
    const hand = state.hand.filter(available('play')).map(asActChoice('play'))
    const supply = state.supply.filter(available('buy')).map(asActChoice('buy'))
    const events = state.events.filter(available('use')).map(asActChoice('use'))
    const play = state.play.filter(available('activate')).map(asActChoice('activate'))
    return choice(state, `Use an event or card in play,
        pay a buy to buy a card from the supply,
        or pay an action to play a card from your hand.`,
        hand.concat(supply).concat(events).concat(play))
}

// ------------------------------ Start the game

function supplyKey(spec:CardSpec): number {
    if (spec.buyCost === undefined) return 0;
    return spec.buyCost.coin
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

const defaultCards:SlotSpec[] = Array(12).fill(RANDOM)
const defaultEvents:SlotSpec[] = Array(4).fill(RANDOM)
export function fillSpec(spec:GameSpec): FullGameSpec {
    if (spec.type != 'main') return assertNever(spec.type)
    return {
        seed: (spec.seed === undefined) ? randomSeed() : spec.seed,
        cards: (spec.cards === undefined) ? defaultCards : spec.cards,
        events: (spec.events === undefined) ? defaultEvents : spec.events,
        testing: (spec.testing === undefined) ? false : spec.testing,
    }
}

function randomSeed(): string {
    return Math.random().toString(36).substring(2, 7)
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

function pickRandoms(slots:SlotSpec[], source:CardSpec[], seed:number): CardSpec[] {
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
        randoms, seed
    ))
}

export function initialState(spec:GameSpec): State {
    const startingHand:CardSpec[] = [copper, copper, copper, estate, estate]
    const intSeed:number = hash(spec.seed)

    const fullSpec:FullGameSpec = fillSpec(spec)
    let variableSupplies = pickRandoms(fullSpec.cards, mixins, intSeed)
    let variableEvents = pickRandoms(fullSpec.events, eventMixins, intSeed+1)

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
            text: `When you buy this, ${t.text.map(lowercase).join(', ')}`,
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
        transform: () => recycle
    }
}

function regroupEffect(n:number, doRecycle:boolean=true): Effect {
    let text:string[] = ['Lose all $, actions, and buys.']
    if (doRecycle) text.push('Put your discard pile and play into your hand.');
    text.push(`+${n} actions, +1 buy.`)
    return {
        text: text,
        transform: (state, card) => async function(state) {
            state = await setResource('coin', 0)(state)
            state = await setResource('actions', 0)(state)
            state = await setResource('buys', 0)(state)
            if (doRecycle) state = await recycle(state);
            state = await gainActions(n, card)(state)
            state = await gainBuy(state)
            return state
        }
    }
}

function gainCoinEffect(n:number): Effect {
    return {
        text: [`+$${n}.`],
        transform: (s:State, c:Card) => gainCoin(n, c),
    }
}
function gainPointsEffect(n:number): Effect {
    return {
        text: [`+${n} vp.`],
        transform: (s:State, c:Card) => gainPoints(n, c),
    }
}
function actionEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'action')}.`],
        transform: (s:State, c:Card) => gainActions(n, c),
    }
}
function gainBuyEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'buy')}.`],
        transform: (state, card) => gainBuys(n, card),
    }
}
function buyEffect() {
    return {
        text: [`+1 buy.`],
        transform: () => gainBuy,
    }
}

function chargeEffect(): Effect {
    return {
        text: ['Put a charge token on this.'],
        transform: (s, card) => charge(card, 1)
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
        if (reduction.coin || 0 > 0) {
            newCost = addCosts(newCost, {coin:1})
        } else if (reduction.energy || 0 > 0) {
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
        text: `${descriptor} cost ${renderCost(reduction, true)} less${nonzero ? ', but not zero.' : '.'}`,
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
        text: `${descriptor} cost ${renderCost(reduction, true)} less${nonzero ? ', but not zero.' : '.'}
        Whenever this reduces a cost, discard this.`,
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
    options:Card[],
    isCost:boolean=false,
): Transform {
    return async function(state) {
        let target:Card|null; [state, target] = await choice(state,
            text, options.map(asChoice))
        if (target != null) state = await f(target)(state);
        if (target == null && isCost) throw new CostNotPaid('No valid targets')
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
            options(s)
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

const necropolis:CardSpec = {name: 'Necropolis',
    effects: [toPlay()],
    replacers: [villageReplacer()],
}
buyableFree(necropolis, 2)

const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
}
buyableFree(hound, 2)

const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effects: [actionEffect(3)],
}
buyable(smithy, 4)

const village:CardSpec = {name: 'Village',
    effects:  [actionEffect(1), toPlay()],
    replacers: [villageReplacer()],
}
buyable(village, 4)

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effects: [gainCoinEffect(1), buyEffect(), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)]
}
buyable(bridge, 4)

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
    effects: [actionEffect(2)]
}
buyable(lab, 5)

const payAction = payCost({...free, actions:1})

function playTwice(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
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
        transform: e => gainCoin(1),
    }]
}
buyable(coppersmith, 4)

const scavenger:CardSpec = {name: 'Scavenger',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), actionEffect(1), targetedEffect(
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
    replacers: [costReduce('play', {energy:1})]
}
buyable(celebration, 10)

const plough:CardSpec = {name: 'Plough',
    fixedCost: energy(2),
    effects: [{
        text: ['Put your discard pile and play into your hand.'],
        transform: () => recycle
    }]
}
buyable(plough, 4)

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    effects: [toPlay()],
    triggers: [{
        text: 'Whenever you pay @, gain twice that many actions.',
        kind: 'cost',
        handles: () => true,
        transform: e => gainActions(2 * e.cost.energy)
    }]
}
buyable(construction, 3)

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
    return {
        calculate: function(card:Card, state:State) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).count('cost')))
        },
        text: `${renderCost(initial, true)} plus ${renderCost(increment, true)} for each cost token on this.`,
    }
}

function incrementCost(): Effect {
    return {
        text: ['Put a cost token on this.'],
        transform: (s:State, c:Card) => addToken(c, 'cost')
    }
}

const restock:CardSpec = {name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), regroupEffect(5)],
}
registerEvent(restock)

const scrapeBy:CardSpec = {name:'Scrape By',
    fixedCost: energy(2),
    effects: [regroupEffect(1)],
}
registerEvent(scrapeBy)

const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    fixedCost: energy(1),
    restrictions: [{
        test: (card, state) => state.hand.length > 0
    }],
    effects: [{
        text: [`If you have no cards in your hand,
        put your discard pile into your hand and +3 actions.`],
        transform: () => async function(state) {
            if (state.hand.length == 0) {
                state = await moveMany(state.discard, 'hand')(state)
                state = await gainActions(3)(state)
                state = sortHand(state)
            }
            return state
        }
    }]
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
    replacers: [{
        text: `Whenever you would create a card in your discard pile,
        if this has a charge token on it
        then instead remove a charge token from this and create the card in your hand.`,
        kind: 'create',
        handles: (e, state, card) => e.zone == 'discard'
            && state.find(card).charge >= 1,
        replace: (x, state, card) => 
            ({...x, zone:'hand', effects:x.effects.concat([charge(card, -1)])})
    }]
}
registerEvent(travelingFair)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:10, energy:2},
    effects: [{
        text: ['Lose all $.', '+1 vp per $ lost.'],
        transform: () => async function(state) {
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
        text: ['Lose all $.', '+1 action per $ lost.'],
        transform: () => async function(state) {
            const n = state.coin
            state = await setResource('coin', 0)(state)
            state = await gainActions(n)(state)
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
        transform: (state, card) => doAll([setResource('coin', 0, card),
                                 setResource('buys', 0, card)])
    }, recycleEffect(), buyEffect()]
}
registerEvent(repurpose)

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effects: [gainPointsEffect(1), actionEffect(1)],
}
buyable(vibrantCity, 6)

function chargeUpTo(max:number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    effects: [chargeUpTo(6), {
        text: ['+1 vp per charge token on this.'],
        transform: (state, card) => gainPoints(state.find(card).charge, card)
    }]
}
buyable(frontier, 7)

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effects: [chargeUpTo(5), {
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoin(state.find(card).charge, card),
    }]
}
buyable(investment, 4)

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:12, energy:3},
    effects: [{
        text: ['Buy each card in the supply.'],
        transform: (state, card) => doAll(state.supply.map(s => s.buy(card)))
    }]
}
registerEvent(populate)

const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:5, energy:1},
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
buyable(royalSeal, 5)

const workshop:CardSpec = {name: 'Workshop',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $4.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(4)))
    )]
}
buyable(workshop, 3)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), toPlay()],
    triggers: [{
        text: `After buying a card in the supply,
            if this is in play and was in play when you bought it,
            then discard it and buy that card again.`,
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
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
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
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
    ), trashThis()]
}
buyable(feast, 4)

const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(10)),
    effects: [chargeEffect(), incrementCost()],
    replacers: [{
        text: `${regroup.name} costs @ less to play for each charge token on this.`,
        kind:'cost',
        handles: x => (x.card.name == regroup.name),
        replace: (x, state, card) => 
            ({...x, cost:subtractCost(x.cost, {energy:state.find(card).charge})})
    }]
}
registerEvent(mobilization)

function refreshEffect(): Effect {
    return {
        text: ['Put your discard pile into your hand.'],
        transform: state => doAll([moveMany(state.discard, 'hand'), sortHand])
    }
}

const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(2),
    effects: [refreshEffect()],
}
registerEvent(refresh)

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

const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [chargeUpTo(4), {
        text: ['+1 action per charge token on this.'],
        transform: (state, card) => gainActions(state.find(card).charge, card)
    }]
}
buyable(youngSmith, 3)

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+4 actions -1 per charge token on this.'],
        transform: (state, card) => gainActions(4 - state.find(card).charge, card),
    }, chargeEffect()]
}
buyable(oldSmith, 3)

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
    effects: [chargeEffect(), incrementCost()],
    triggers: [{
        text: `Whenever you create a card,
        remove a charge token from this to play that card.`,
        kind: 'create',
        handles: (e, state, card) => state.find(card).charge > 0,
        transform: (e, state, card) => payToDo(discharge(card, 1), e.card.play(card)),
    }],
}
registerEvent(expedite)

function removeAllSupplyTokens(token:Token): Effect {
    return {
        text: [`Remove all ${token} tokens from cards in the supply.`],
        transform: (state, card) => doAll(state.supply.map(s => removeTokens(s, token)))
    }
}

const synergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:5, energy:1},
    effects: [removeAllSupplyTokens('synergy'), {
        text: ['Put synergy tokens on two cards in the supply.'],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoiceIfNeeded(state,
                'Choose two cards to synergize.',
                state.supply.map(asChoice), 2, false)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }],
    triggers: [{
        text: 'Whenever you buy a card with a synergy token other than with this,'
        + ' buy a different card with a synergy token with equal or lesser cost.',
        kind:'buy',
        handles: (e, state, card) => (e.source.id != card.id && e.card.count('synergy') > 0),
        transform: (e, state, card) => applyToTarget(
            target => target.buy(card),
            'Choose a card to buy.',
            state.supply.concat(state.events).filter(
                c => c.count('synergy') > 0
                && leq(c.cost('buy', state), e.card.cost('buy', state))
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
    effects: [actionEffect(1), gainCoinEffect(1), buyEffect()],
}
buyable(market, 5)

const spree:CardSpec = {name: 'Spree',
    fixedCost: energy(1),
    effects: [buyEffect()],
}
registerEvent(spree)

const counterfeit:CardSpec = {name: 'Counterfeit',
    effects: [actionEffect(1), buyEffect(), targetedEffect(
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
    effects: [actionEffect(5)]
}
buyable(greatSmithy, 7)

const pressOn:CardSpec = {name: 'Press On',
    fixedCost: energy(1),
    effects: [regroupEffect(5, false)]
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
            ]), 'Choose a card to play three times.', state.hand))
    }
}

const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()]
}
buyable(kingsCourt, 10)

const gardens:CardSpec = {name: "Gardens",
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per 10 cards in your hand, discard pile, and play.'],
        transform: (state, card) => gainPoints(
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
        transform: state => doAll(state.discard.map(x => removeToken(x, 'decay')))
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
        text: 'Cards and events that cost at least $1 cost $1 more per charge token on this.',
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
        transform: e => addToken(e.card, 'burden')
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
    effects: [actionEffect(2), gainCoinEffect(3)]
}
buyable(goldsmith, 7)

const publicWorks:CardSpec = {name: 'Public Works',
    effects: [toPlay()],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
buyable(publicWorks, 4)

function echoEffect(card:Card): Transform {
    return create(card.spec, 'play', 'end', c => addToken(c, 'echo'))
}

function fragileEcho(): Trigger<MoveEvent> {
    return {
        text: 'Whenever you move a card with an echo token on it, trash it.',
        kind: 'move',
        handles: (x, state) => state.find(x.card).count('echo') > 0,
        transform: x => trash(x.card)
    }
}

//TODO: handle skip better, other things shouldn't replace it again...
const echo:CardSpec = {name: 'Echo',
    effects: [targetedEffect(echoEffect,
        `Choose a card you have in play.
        Create a fresh copy of it in play with an echo token on it.`,
        state => state.play
    )]
}
buyableAnd(echo, 4, {triggers: [fragileEcho()]})

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
    replacers: [{
        text: `Whenever you would move this from play to your hand,
            instead put a charge token on it.`,
        kind:'move',
        handles: (x, state, card) => (x.fromZone == 'play' && x.toZone == 'hand'
            && x.card.id == card.id),
        replace: (x, state, card) =>
            ({...x, skip:true, effects:x.effects.concat([charge(card, 1)])})
    }],
    ability:[{
        text: [`Remove a charge counter from this, discard it, and pay 1 action
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
            state.hand
        ))
    }],
}
buyable(mastermind, 6)

function chargeVillage(): Replacer<CostParams> {
    return {
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
const doubleTime:CardSpec = {
    name: 'Double Time',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
        text: 'Whenever you pay @, put that many charge tokens on this.',
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0
            && state.find(card).place == 'play',
        transform: (e, state, card) => charge(card, e.cost.energy)
    }],
    replacers: [chargeVillage(), unchargeOnMove()]
}
buyable(doubleTime, 3)

const dragon:CardSpec = {name: 'Dragon',
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              actionEffect(4), gainCoinEffect(4), buyEffect()]
}
const egg:CardSpec = {name: 'Egg',
    fixedCost: energy(2),
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
                state.hand.map(asChoice),
                xs => xs.length <= 3)
            state = await moveMany(targets, 'discard')(state)
            state = await gainActions(targets.length)(state)
            return state
        }
    }]
}
buyable(looter, 5)

const empire:CardSpec = {name: 'Empire',
    fixedCost: energy(1),
    effects: [actionEffect(3), gainPointsEffect(3)]
}
buyable(empire, 10)

const Innovation:string = 'Innovation'
const innovation:CardSpec = {name: Innovation,
    effects: [actionEffect(1), {
        text: [`If you don't have any cards named ${Innovation} in play,
        put this in play.`],
        transform: (state, card) => move(
            card, 
            (state.play.some(x => x.name == Innovation)) ? 'discard' : 'play'
        )
    }],
    triggers: [{
        text: `When you create a card, discard this to play the card.`,
        kind: 'create',
        handles: () => true,
        transform: (e, state, card) => payToDo(discardFromPlay(card), e.card.play(card)),
    }]
}
buyable(innovation, 6)

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
        text: [`Pay an action to play a card in your hand once for each charge token on this.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => async function(state){
                const n:number = state.find(card).charge
                for (let i = 0; i < Math.min(n, 3); i++) {
                    state = await target.play(card)(state)
                    state = tick(card)(state)
                }
                return state
            },
            `Choose a card to play with ${Traveler}.`,
            state.hand
        ))
    }, chargeUpTo(3)]
}
buyable(traveler, 5)

const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(1),
    effects: [regroupEffect(5, false)]
}
buyable(fountain, 5)

const chameleon:CardSpec = {
    name:'Chameleon',
    replacers: [{
        text: `As long as this has a charge token on it,
        whenever you would gain $ instead gain that many actions and vice versa.`,
        kind: 'resource',
        handles: (x, state, card) => state.find(card).charge > 0,
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

const grandMarket:CardSpec = {
    name: 'Grand Market',
    restrictions: [{
        text: `You can't buy this if you have any
        ${copper.name}s or ${silver.name}s
        in your discard pile.`,
        test: (c:Card, s:State, k:ActionKind) => k == 'buy' &&
            s.discard.some(x => x.name == copper.name || x.name == silver.name)
    }],
    effects: [gainCoinEffect(2), actionEffect(1), buyEffect()],
}
buyable(grandMarket, 6)

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

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, put a charge token on this.`,
        kind: 'play',
        handles: (e, state, card) => e.card.name == estate.name
            && state.find(card).place == 'play',
        transform: (e, state, card) => charge(card, 1),

    }],
    replacers: [chargeVillage(), unchargeOnMove()],
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

const industry:CardSpec = {
    name: 'Industry',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action per card in play up to a max of 5.`],
        transform: (state, card) => gainActions(
            Math.min(state.play.length, 5),
            card
        )
    }]
}
buyable(industry, 4)

const flourishing:CardSpec = {
    name: 'Flourishing',
    calculatedCost: {
        text: `Costs @ if you have less than 10 vp.`,
        calculate: (card, state) => (state.points < 10) ? energy(1) : free
    },
    effects: [actionEffect(2), {
        text: [`If you have at least 20 vp, +1 card.`],
        transform: (state, card) => (state.points < 20) ? noop : gainCoin(2)
    }, {
        text: [`If you have at least 30 vp, +1 card.`],
        transform: (state, card) => (state.points < 30) ? noop : gainCoin(2)
    }]
}
buyable(flourishing, 2)

const banquet:CardSpec = {
    name: 'Banquet',
    effects: [gainCoinEffect(4), toPlay(), {
        text: ['Put a neglect token on each card in your hand.'],
        transform: state => doAll(state.hand.map(x => addToken(x, 'neglect')))
    }],
    triggers: [{
        text: `Whenever a card moves, remove all neglect tokens from it.`,
        kind: 'move',
        handles: p => p.fromZone != p.toZone,
        transform: p => removeTokens(p.card, 'neglect')

    }],
    replacers: [{
        text: `Whenever you'd move this to your hand,
            if you have any cards in your hand with a neglect token,
            instead leave this in play.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone == 'hand'
            && state.hand.some(c => c.count('neglect') > 0),
        replace: (p, state, card) => ({...p, skip:true})
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
        text: [`+$1 for every differently-named card in your discard pile
            up to a max of 5.`],
        transform: state => gainCoin(countDistinct(state.discard.map(x => x.name)))
    }]
}
buyable(harvest, 3)

const horseTraders:CardSpec = {
    name:'Horse Traders',
    fixedCost: energy(1),
    effects: [{
        text: ['If you have any actions, lose 1.'],
        transform: (state, card) => gainActions(-1, card)
    }, gainCoinEffect(4), buyEffect()]
}
buyable(horseTraders, 4)

const supplies:CardSpec = {
    name: 'Supplies',
    effects: [gainCoinEffect(1), toPlay()],
    replacers: [{
        text: 'Whenever you would move this to your hand, first +1 action.',
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand',
        replace: (p, s, c) => ({...p, effects:p.effects.concat([gainActions(1, c)])})
    }]
}
buyable(supplies, 2)

//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), toPlay()],
    triggers: [{
        text: `Whenever you buy a card the normal way,
        buy a card in the supply costing at least $1 less.`,
        kind: 'buy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => applyToTarget(
            target => target.buy(card),
            "Choose a cheaper card to buy.",
            state.supply.filter(
                c => leq(
                    addCosts(c.cost('buy', state), {coin:1}),
                    p.card.cost('buy', state)
                )
            )
        )
    }]
}
buyable(haggler, 6)

const reuse:CardSpec = {
    name: 'Reuse',
    fixedCost: energy(2),
    effects: [{
        text: [`Play any number of cards in your discard pile without a reuse token.`,
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
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                    state = await picked.play(card)(state)
                    state = await addToken(picked, 'reuse')(state)
                }
            }
        }
    }]
}
registerEvent(reuse)

const polish:CardSpec = {
    name: 'Polish',
    fixedCost: {...free, coin:2, energy:1},
    effects: [{
        text: [`Put a polish token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'polish')))
    }],
    triggers: [{
        text: `Whenever you play a card with a polish token on it,
        remove a polish token from it and +$1.`,
        kind: 'play',
        handles: (e, state) => (e.card.count('polish') > 0),
        transform: e => doAll([removeToken(e.card, 'polish'), gainCoin(1)])
    }]
}
registerEvent(polish)

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
registerEvent(hesitation, 'test')

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

const preparations:CardSpec = {
    name: 'Preparations',
    fixedCost: energy(1),
    effects: [toPlay()],
    replacers: [{
        text: `When you move this to your hand, +$2 and +2 actions.`,
        kind: 'move',
        handles: (p, state, card) => (p.card.id == card.id && p.toZone == 'hand'),
        replace: p => ({...p, effects:p.effects.concat([gainCoin(2), gainActions(2)])})
    }]
}
buyable(preparations, 3)

const highway:CardSpec = {
    name: 'Highway',
    effects: [actionEffect(1), toPlay()],
    replacers: [costReduce('buy', {coin:1}, true)],
}
buyable(highway, 7)

function nameHasToken(card:Card, token:Token, state:State): boolean {
    return state.supply.some(s => s.name == card.name && s.count(token) > 0)
}

const prioritize:CardSpec = {
    name: 'Prioritize',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        card => addToken(card, 'priority', 8),
        'Put eight priority tokens on a card in the supply.',
        state => state.supply,
    )],
    triggers: [{
        text: `Whenever you create a card with the same name
            as a card in the supply with a priority token,
            remove a priority token to play the card.`,
        kind: 'create',
        handles: (e, state) => nameHasToken(e.card, 'priority', state),
        transform: (e, state, card) => payToDo(applyToTarget(
                target => removeToken(target, 'priority', true),
                'Remove a prioritize token.',
                state.supply.filter(target => target.name == e.card.name),
                true
            ), e.card.play(card))
    }]
}
registerEvent(prioritize)

const composting:CardSpec = {
    name: 'Composting',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
        kind: 'cost',
        text: `Whenever you gain @,
        put that many cards from your discard pile into your hand.`,
        handles: e => e.cost.energy > 0,
        transform: e => async function(state) {
            const n = e.cost.energy;
            let targets:Card[]; [state, targets] = await multichoiceIfNeeded(state,
                `Choose ${num(n, 'card')} to put into your hand.`,
                state.discard.map(asChoice), n, true)
            return moveMany(targets, 'hand')(state)
        }
    }]
}
buyable(composting, 4)

const fairyGold:CardSpec = {
    name: 'Fairy Gold',
    effects: [gainCoinEffect(3),{
        text: [`If this has a charge token on it, trash it.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge >= 1) state = await trash(card)(state);
            return state
        }
    }, chargeEffect()]
}
buyable(fairyGold, 3)

const pathfinding:CardSpec = {
    name: 'Pathfinding',
    fixedCost: {...free, coin:8, energy:1},
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



// ------------------ Testing -------------------

const freeMoney:CardSpec = {name: 'Free money',
    fixedCost: energy(0),
    effects: [gainCoinEffect(100), gainBuyEffect(100)],
}
cheats.push(freeMoney)

const freeActions:CardSpec = {name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionEffect(100)],
}
cheats.push(freeActions)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effects: [gainPointsEffect(10)],
}
cheats.push(freePoints)


// ------------ Random placeholder --------------

export const randomPlaceholder:CardSpec = {name: RANDOM}