// metaLogic.ts - Meta-game state and transformations
// This handles the roguelike progression layer on top of the core game.

import { CardSpec, Card, type GameSpec, State, vpModes,
    TypedTrigger, TypedReplacer,
    Boon, VPMode,
    boons,
    PlaceName,
    Token,
    cardRewards, eventRewards,
    coinKey, energyEventKey,
    VictoryData,
    Replayable
 } from './gameLogic.js'

import { buildSpecTooltip } from './cardRendering.js'

// ----------------------------- MetaUI Interface

// Option type for meta-game choices (analogous to Option in gameLogic)
export interface MetaOption<T> {
    label: string
    value: T
    spec?: CardSpec  // Optional card spec to display
    disabled?: boolean // Greyed out if it's not enabled
    description?: string
}

// UI interface for meta-game interactions (analogous to UI in gameLogic)
export interface MetaUI {
    // Choose from a list of cards (for encounters with sub-dialogs)
    chooseCard<T extends CardSpec | Card>(
        state: MetaState,
        prompt: string,
        options: T[],
        canCancel?: boolean
    ): Promise<T | null>

    playGame(spec: GameSpec, gameHistory?: number[], gameRedo?: number[]): Promise<VictoryData>

    // Wait for user to select a challenge (reward options are handled inline)
    // Re-renders the stage screen with current state
    // Returns the selected challenge when user clicks one of the challenge buttons
    waitForChallenge(state: MetaState): Promise<ChallengeSpec>

    pickPath(state: MetaState, paths: Path[]): Promise<Path>

    // Choose from generic options (for encounters with sub-dialogs)
    chooseOption<T>(
        state: MetaState,
        prompt: string,
        options: MetaOption<T>[],
        canCancel?: boolean
    ): Promise<T | null>

    // Show a message to the user
    showMessage(state: MetaState, message: string): Promise<void>

    // Update the buffer display when it changes
    updateBuffer(state: MetaState): void
}

// --------------------- Reward Options and Encounters

// A button/option displayed for a reward or encounter
export interface RewardOption {
    label: string
    description?: string
    spec?: CardSpec           // Display as card if provided
    disabled: boolean
    checked: boolean          // Shows checkmark if selected
    onClick: () => Promise<{ newData: unknown, transform?: MetaTransform }>
}

// Encounter interface - defines behavior for encounter rewards
export interface Encounter {
    name: string
    createInitialData(metaState: MetaState, generator: Generator): unknown
    getOptions(data: unknown, metaState: MetaState): RewardOption[]
}

// State for simple rewards (card/event/potion/relic)
export interface SimpleRewardState {
    kind: 'card' | 'event' | 'potion' | 'relic'
    options: CardSpec[] | RelicSpec[]
    selectedIndex: number | null
}

// State for encounters (encounter/data are null until path is selected)
export interface EncounterRewardState {
    kind: 'encounter'
    encounter: Encounter | null
    data: unknown
}

export type RewardState = SimpleRewardState | EncounterRewardState

// Get options for a simple reward
function getSimpleRewardOptions(state: SimpleRewardState, metaState: MetaState): RewardOption[] {
    return state.options.map((option, i) => ({
        label: option.name,
        spec: option,
        disabled: state.selectedIndex !== null,
        checked: state.selectedIndex === i,
        onClick: async () => {
            const transform =
                state.kind === 'card' ? gainCard(option as CardSpec) :
                state.kind === 'event' ? gainEvent(option as CardSpec) :
                state.kind === 'potion' ? gainPotion(option as CardSpec) :
                gainRelic(option as RelicSpec)
            return {
                newData: { ...state, selectedIndex: i },
                transform
            }
        }
    }))
}

// Get options for any reward state
export function getRewardOptions(rewardState: RewardState, metaState: MetaState): RewardOption[] {
    if (rewardState.kind === 'encounter') {
        if (!rewardState.encounter) {
            // Pending encounter - shouldn't be displayed yet
            return []
        }
        return rewardState.encounter.getOptions(rewardState.data, metaState)
    } else {
        return getSimpleRewardOptions(rewardState, metaState)
    }
}

// Update a reward state with new data
export function updateRewardState(rewardState: RewardState, newData: unknown): RewardState {
    if (rewardState.kind === 'encounter') {
        return { ...rewardState, data: newData }
    } else {
        return newData as SimpleRewardState
    }
}

// Encounter registration with stage constraints
interface EncounterRegistration {
    encounter: Encounter
    minStage: number
    maxStage: number
}

const encounterRegistry: EncounterRegistration[] = []

export function registerEncounter(
    encounter: Encounter,
    options?: { minStage?: number, maxStage?: number }
) {
    encounterRegistry.push({
        encounter,
        minStage: options?.minStage ?? 0,
        maxStage: options?.maxStage ?? 7
    })
}

export function getEncounterState(state: MetaState, generator: Generator, stage: number): EncounterRewardState {
    const available = encounterRegistry.filter(e => e.minStage <= stage && stage <= e.maxStage)
    const registration = generator.sample(available)
    return {
        kind: 'encounter',
        encounter: registration.encounter,
        data: registration.encounter.createInitialData(state, generator)
    }
}

// ----------------------------- Constants

export const TOTAL_STAGES = 8
export const INITIAL_BUFFER = 10

// Base par values for each stage
export const BASE_PARS: number[] = [30, 28, 26, 24, 22, 20, 18, 8]

// ----------------------------- Meta-game Types

// This defines a challenge. It will be combined with the user's deck, and then acted on by relics, to get a spec.
export interface ChallengeSpec {
    stage: number,
    vpMode: VPMode,
    boons: Boon[],
}

export function renderChallenge(spec: ChallengeSpec, state: MetaState): string {
    const gameSpec:GameSpec = makeSpec(state, spec)
    const label = `${spec.vpMode.name} + ${spec.boons.map(b => b.name).join(' + ')} (${gameSpec.vp}vp in ${gameSpec.par}@)`

    // Build tooltip with all related cards from VP mode and boons
    const relatedCards: CardSpec[] = [
        ...spec.vpMode.cards,
        ...spec.vpMode.events,
        ...spec.boons.flatMap(b => [...b.cards, ...b.events])
    ]

    if (relatedCards.length === 0) {
        return label
    }

    const tooltipContent = relatedCards.map(buildSpecTooltip).join('')
    return `${label}<span class='tooltip'>${tooltipContent}</span>`
}

// Meta replacer types - modify game setup parameters
export type GameSetupParams = {
    par: number
    vpGoal: number
    cardSpecs: CardSpec[]
    eventSpecs: CardSpec[]
}

export interface RelicSpec extends CardSpec {
    metaReplacers?: MetaReplacer[]
    metaTriggers?: TypedMetaTrigger[]
    // Triggers and replacers that function within a game but depend on information only available to a Relic
    mutableTriggers?: (self: Relic) => TypedTrigger[]
    mutableReplacers? : (self: Relic) => TypedReplacer[]
}

import { CardUpdate } from './gameLogic.js'

export interface RelicUpdate extends CardUpdate {
    notedCards?: CardSpec[]
}

export class Relic extends Card {
    constructor(
        public readonly spec: RelicSpec,
        id: number,
        public readonly notedCards: CardSpec[] | undefined = undefined,
        public readonly ticks: number[] = [0],
        public readonly tokens: Map<Token, number> = new Map(),
        public readonly place:PlaceName = 'void',
        // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
        public readonly zoneIndex = 0,
    ){
        super(spec, id, ticks, tokens, place, zoneIndex)
    }
    metaReplacers(): MetaReplacer[] {
        return this.spec.metaReplacers || []
    }
    metaTriggers(): TypedMetaTrigger[] {
        return this.spec.metaTriggers || []
    }
    triggers(): TypedTrigger[] {
        return (this.spec.mutableTriggers ? this.spec.mutableTriggers(this) : []).concat(super.triggers())
    }
    replacers(): TypedReplacer[] {
        return (this.spec.mutableReplacers ? this.spec.mutableReplacers(this) : []).concat(super.replacers())
    }
    update(newValues: RelicUpdate): Relic {
        return new Relic(
            this.spec,
            this.id,
            (newValues.notedCards === undefined) ? this.notedCards : newValues.notedCards,
            (newValues.ticks === undefined) ? this.ticks : newValues.ticks,
            (newValues.tokens === undefined) ? this.tokens : newValues.tokens,
            (newValues.place === undefined) ? this.place : newValues.place,
            (newValues.zoneIndex === undefined) ? this.zoneIndex : newValues.zoneIndex,
        )
    }
}

export interface RewardParams {
    optionCount: number
}

// TODO: render relics appropriately when you hold shift etc.
export type MetaReplacer =
    | { kind: 'gameSetup', replace: (params: GameSetupParams, self: Relic) => GameSetupParams }
    | { kind: 'reward', replace: (params: RewardParams, self: Relic) => RewardParams }

// Meta trigger event types
export interface CourseEndEvent {
    kind: 'end'
    score: number
    par: number
}

export interface CourseStartEvent {
    kind: 'start',
    stage: number
}

export interface GainRelicEvent {
    kind: 'relic'
    relic: Relic
}

export interface GainPotionEvent {
    kind: 'card'
    potion: Card
}

export interface GainCardEvent {
    kind: 'card'
    card: CardSpec
}

export interface GainEventEvent {
    kind: 'event'
    event: CardSpec
}

export type MetaGameEvent = CourseEndEvent | CourseStartEvent | GainRelicEvent | GainPotionEvent | GainCardEvent | GainEventEvent

export interface MetaTrigger<T extends MetaGameEvent> {
    kind: T['kind'];
    handles: (e:T, s:MetaState, self:Relic) => boolean;
    transform: (e:T, s:MetaState, self:Relic) => MetaTransform;
}

// Meta trigger types - now return MetaTransform instead of just a result
export type TypedMetaTrigger = MetaTrigger<CourseEndEvent> | MetaTrigger<CourseStartEvent> | MetaTrigger<GainRelicEvent> | MetaTrigger<GainPotionEvent> | MetaTrigger<GainCardEvent> | MetaTrigger<GainEventEvent>

// ----------------------------- State Types


// A path the player can choose (contains rewards + kingdom)
export interface Path {
    rewardStates: RewardState[]
    challenges: ChallengeSpec[]
}

export type RewardKind = 'card' | 'event' | 'potion' | 'relic' | 'encounter'

export interface StageReplayData {
    stage: number
    spec: GameSpec
    score: number
    par: number
    history: Replayable[]
    potionsRemaining: Card[]
    bufferBeforeCourse: number
    bufferAfterCourse: number
}

// Get display name for a reward state
export function getRewardName(rewardState: RewardState): string {
    if (rewardState.kind === 'encounter') {
        // Show "???" for pending encounters, name after path is selected
        return rewardState.encounter ? rewardState.encounter.name : '???'
    }
    const labels: Record<string, string> = {
        card: 'Add Card',
        event: 'Add Event',
        potion: 'Add Potion',
        relic: 'Add Relic'
    }
    return labels[rewardState.kind]
}

// ----------------------------- MetaState

export interface MetaStateData {
    // Current stage (1-8)
    stage: number

    // Challenge options for current stage (user selects one to play)
    challenges: ChallengeSpec[]

    // Score tracking
    stageScores: (number | null)[]
    stagePars: (number | null)[]
    stageReplays: (StageReplayData | null)[]

    // Buffer (life total)
    buffer: number

    // Pending rewards for current stage
    rewardStates: RewardState[]

    // Collected cards/events (persist across stages)
    collectedCards: CardSpec[]
    collectedEvents: CardSpec[]

    // Potions and relics (persist across stages)
    potions: Card[]
    relics: Relic[]

    nextID: number

    playingGame: boolean

    // Saved game state for restoration on redo
    gameHistory: number[]
    gameRedo: number[]
}

import { Generator, randomString } from './rng.js'

export class MetaState {

    public checkpoint: MetaStateData
    public redoStack: MetaStateData[] = []
    public undoStack: MetaStateData[] = []
    public readonly seed: string
    public readonly masterGenerator: Generator
    public generators: Map<string, Generator> = new Map()
    public data: MetaStateData

    constructor(
        public readonly ui: MetaUI,
        seed: null | string = null,
    ) {
        if (seed === null) {
            this.seed = randomString()
        } else {
            this.seed = seed
        }
        this.masterGenerator = new Generator(this.seed)
        const data = {
            stage: 0,
            buffer: INITIAL_BUFFER,
            stageScores: Array(TOTAL_STAGES).fill(null),
            stagePars: Array(TOTAL_STAGES).fill(null),
            stageReplays: Array(TOTAL_STAGES).fill(null),
            challenges: [] as ChallengeSpec[],
            rewardStates: [] as RewardState[],
            collectedCards: [] as CardSpec[],
            collectedEvents: [] as CardSpec[],
            potions: [] as Card[],
            relics: [] as Relic[],
            nextID: 1,
            playingGame: false,
            gameHistory: [] as number[],
            gameRedo: [] as number[],
        }
        this.data = data
        this.checkpoint = data
    }

    private removeFromZone(id:number, zone: 'potions' | 'relics') {
        this.update({
            [zone]: this.data[zone].filter(c => c.id !== id)
        })
    }

    applyToRelic(fn: (r:Relic) => Relic, r: Relic) {
        this.update({relics: this.data.relics.map(rel => rel.id === r.id ? fn(rel) : rel)})
    }

    removePotion(id:number) { 
        this.removeFromZone(id, 'potions')
    }

    removeRelic(id:number) {
        this.removeFromZone(id, 'relics')
    }

    removeCard(name:string) {
        this.update({
            collectedCards: this.data.collectedCards.filter(c => c.name !== name)
        })
    }

    removeEvent(name:string) {
        this.update({
            collectedEvents: this.data.collectedEvents.filter(e => e.name !== name)
        })
    }

    generator(key: string): Generator {
        if (!this.generators.has(key)) {
            const newGen = this.masterGenerator.newGenerator()
            this.generators.set(key, newGen)
        }
        return this.generators.get(key)!
    }

    clearHistory() {
        this.undoStack = []
        this.redoStack = []
        this.checkpoint = this.data
        console.assert(this.data.challenges.length > 0) // Should not a set checkpoint while selecting paths.
    }

    setCheckpoint() {
        console.assert(this.data.challenges.length > 0) // Should not a set checkpoint while selecting paths.
        this.undoStack.push(this.checkpoint)
        this.checkpoint = this.data
        this.redoStack = []
    }
    
    update(updates: Partial<MetaStateData>) {
        this.data = {...this.data, ...updates}
    }
    
    // Undo to previous checkpoint
    // If checkpointUpdate is provided, apply it to the checkpoint before pushing to redoStack
    undo(checkpointUpdate?: Partial<MetaStateData>) {
        if (this.checkpoint != this.data) this.data = this.checkpoint;
        if (this.undoStack.length == 0) return
        const previousCheckpoint = this.undoStack.pop()!
        // Push checkpoint (with optional modifications) to redoStack
        const redoCheckpoint = checkpointUpdate
            ? { ...this.checkpoint, ...checkpointUpdate }
            : this.checkpoint
        this.redoStack.push(redoCheckpoint)
        this.checkpoint = previousCheckpoint
        this.data = previousCheckpoint
    }

    // Redo a previously undone action
    redo() {
        if (this.redoStack.length === 0) return
        const nextState = this.redoStack.pop()
        this.undoStack.push(this.checkpoint)
        this.checkpoint = nextState!
        this.data = nextState!
    }

    canUndo(): boolean {
        return this.undoStack.length > 0 || this.checkpoint != this.data
    }

    canRedo(): boolean {
        return this.redoStack.length > 0
    }

    private uniqueSnapshots(): MetaStateData[] {
        const snapshots = [this.data, this.checkpoint, ...this.undoStack, ...this.redoStack]
        const seen = new Set<MetaStateData>()
        const result: MetaStateData[] = []
        for (const snapshot of snapshots) {
            if (!seen.has(snapshot)) {
                seen.add(snapshot)
                result.push(snapshot)
            }
        }
        return result
    }

    mutateAllSnapshots(mutator: (snapshot: MetaStateData) => void): void {
        for (const snapshot of this.uniqueSnapshots()) {
            mutator(snapshot)
        }
    }
}

// ----------------------------- MetaTransform

// A function that transforms meta-game state (analogous to Transform in gameLogic)
// Can be sync or async, like Transform in gameLogic
// Note that these mutate MetaStates in place.
export type MetaTransform = (state: MetaState) => Promise<void> | ((state: MetaState) => void)

// Identity transform - does nothing
export const noop: MetaTransform = async function (state: MetaState) { return }

// Compose multiple transforms (handles async)
export function compose(...transforms: MetaTransform[]): MetaTransform {
    return async function (state): Promise<void> {
        for (const t of transforms) {
            await t(state)
        }
    }
}

// ----------------------------- Transform Builders

// Add buffer
export function addBuffer(amount: number): MetaTransform {
    return async function(state: MetaState) {
        state.update({ buffer: state.data.buffer + amount })
        state.ui.updateBuffer(state)
    }
}

// Add a card to collection
export function gainCard(card: CardSpec): MetaTransform {
    return async function(state: MetaState) {
        state.update({ collectedCards: [...state.data.collectedCards, card ] })
        await trigger({kind: 'card', card: card}, state)
    }
}

// Add an event to collection
export function gainEvent(event: CardSpec): MetaTransform {
    return async function(state: MetaState) {
        state.update({ collectedEvents: [...state.data.collectedEvents, event] })
    }
}

// Add a potion
export function gainPotion(potion: CardSpec): MetaTransform {
    return async function(state: MetaState) {
        const nextID = state.data.nextID
        const potionCard = new Card(potion, nextID)
        state.update({
            potions: [...state.data.potions, potionCard],
            nextID: nextID + 1
        })
    }
} 

// Add a relic
export function gainRelic(relic: RelicSpec): MetaTransform {
    return async function(state: MetaState) {
        const nextID = state.data.nextID
        const relicCard:Relic = new Relic(relic, nextID)
        state.update({
            relics: [...state.data.relics, relicCard],
            nextID: nextID + 1
        })
        await trigger({kind: 'relic', relic: relicCard}, state)
    }
}

// Remove a card from collection by name
export function removeCard(state: MetaState, name: string) {
    state.update({
        collectedCards: state.data.collectedCards.filter(c => c.name !== name)
    })
}

export function removeRelic(state: MetaState, id: number) {
    state.update({
        relics: state.data.relics.filter(c => c.id !== id)
    })
}

// Remove an event from collection by name
export function removeEvent(state: MetaState, name: string) {
    state.update({
        collectedEvents: state.data.collectedEvents.filter(e => e.name !== name)
    })
}

// Update a reward state at the given index
export function updateRewardAtIndex(state: MetaState, index: number, newRewardState: RewardState) {
    const rewardStates = [...state.data.rewardStates]
    if (index >= 0 && index < rewardStates.length) {
        rewardStates[index] = newRewardState
    }
    state.update({ rewardStates })
}

export async function endCourse(score: number, par: number, state:MetaState): Promise<void> {
    // Record the score and par for this stage
    const newScores = [...state.data.stageScores]
    const newPars = [...state.data.stagePars]
    newScores[state.data.stage] = score
    newPars[state.data.stage] = par
    state.update({ stageScores: newScores, stagePars: newPars })

    await trigger({kind: 'end', score, par}, state)
    if (score > par) await addBuffer(par - score)(state);
}

// ----------------------------- Meta Replacer Application

type MetaReplacerParamMap = {
    'gameSetup': GameSetupParams
    'reward': RewardParams
}

export function applyMetaReplacers<K extends keyof MetaReplacerParamMap>(
    kind: K,
    params: MetaReplacerParamMap[K],
    state: MetaState,
): MetaReplacerParamMap[K] {
    const relics = state.data.relics;
    for (const relic of relics) {
        const metaReplacers = relic.metaReplacers() as MetaReplacer[]
        for (const replacer of metaReplacers) {
            if (replacer.kind === kind) {
                // Type assertion via unknown needed due to TypeScript limitations with discriminated unions
                const replaceFn = replacer.replace as unknown as (p: MetaReplacerParamMap[K]) => MetaReplacerParamMap[K]
                params = replaceFn(params)
            }
        }
    }
    return params
}

// ----------------------------- Meta Trigger Application


async function trigger<T extends MetaGameEvent>(e:T, state: MetaState): Promise<void> {
    for (const relic of state.data.relics) {
        const metaTriggers = relic.metaTriggers() as TypedMetaTrigger[]
        if (metaTriggers) {
            for (const rawTrigger of metaTriggers) {
                if (rawTrigger.kind === e.kind) {
                    const trigger:MetaTrigger<T> = rawTrigger as unknown as MetaTrigger<T>
                    const handles = trigger.handles(e, state, relic)
                    if (handles) {
                        await trigger.transform(e, state, relic)(state)
                    }
                }
            }
        }
    }
}

// ----------------------------- Utility Functions

// Create a spec for a given challenge.
export function makeSpec(state: MetaState, challenge: ChallengeSpec): GameSpec {
    let par = BASE_PARS[state.data.stage]
    const vpTarget = challenge.vpMode.target
    const cards = challenge.vpMode.cards.slice()
    const events = challenge.vpMode.events.slice()
    for (const boon of challenge.boons) {
        par -= boon.parReduction
        cards.push(...boon.cards)
        events.push(...boon.events)
    }
    // Add collected cards and events, sorted by cost
    const sortedCollectedCards = [...state.data.collectedCards].sort((a, b) => coinKey(a) - coinKey(b))
    const sortedCollectedEvents = [...state.data.collectedEvents].sort((a, b) => energyEventKey(a) - energyEventKey(b))
    cards.push(...sortedCollectedCards)
    events.push(...sortedCollectedEvents)

    const gameSetupParams = applyMetaReplacers('gameSetup', {
        par: par,
        vpGoal: vpTarget,
        cardSpecs: cards,
        eventSpecs: events
    }, state)
    return {
        vp: gameSetupParams.vpGoal,
        par: gameSetupParams.par,
        cards: gameSetupParams.cardSpecs,
        events: gameSetupParams.eventSpecs,
        potions: state.data.potions,
        relics: state.data.relics,
    }
}

// Get reward option count based on relics
export function getRewardOptionCount(state: MetaState): number {
    const params = applyMetaReplacers('reward', { optionCount: 3 }, state)
    return params.optionCount
}

// ----------------------- Generate data

function randomChallenge(state: MetaState): ChallengeSpec {
    const stage = state.data.stage
    const generator = state.generator(`challenges${stage}`)
    const vpMode = generator.sample(vpModes)
    const boon = generator.sample(boons)
    // For now, no replacement effects
    return {
        stage: stage,
        vpMode: vpMode,
        boons: [boon],
    }
}

interface PathSkeleton {
    rewards: RewardKind[],
    challenges: ChallengeSpec[]
}

function makePaths(state: MetaState): PathSkeleton[] {
    const stage = state.data.stage
    const generator = state.generator(`paths${stage}`).newGenerator()
    const allOptions: RewardKind[] = ['card', 'card', 'event', 'potion', 'relic', 'encounter']
    const shuffledOptions = generator.samples(allOptions, 4)
    const challenge1 = randomChallenge(state)
    const challenge2 = randomChallenge(state)
    return [
        { rewards: shuffledOptions.slice(0, 2), challenges: [challenge1] },
        { rewards: shuffledOptions.slice(2, 4), challenges: [challenge2] },
    ]
}

// TODO: actually create these in gameLogic and then then fill them in the ./data files
import { potionRewards, relicRewards } from './gameLogic.js'

// TODO: avoid repeating (by passing in a list of already-chosen items to avoid, and making the PRG re-sample after hitting one)
function fillPath(state: MetaState, skeleton: PathSkeleton): Path {
    const rewardStates: RewardState[] = []
    for (const rewardKind of skeleton.rewards) {
        const generator = state.generator(`rewards${rewardKind}`).newGenerator()
        if (rewardKind === 'encounter') {
            // Create pending encounter - will be filled in when path is adopted
            rewardStates.push({ kind: 'encounter', encounter: null, data: null })
        } else if (rewardKind === 'card') {
            const options = generator.samples(cardRewards, getRewardOptionCount(state), state.data.collectedCards)
            rewardStates.push({ kind: 'card', options, selectedIndex: null })
        } else if (rewardKind === 'event') {
            const options = generator.samples(eventRewards, getRewardOptionCount(state), state.data.collectedEvents)
            rewardStates.push({ kind: 'event', options, selectedIndex: null })
        } else if (rewardKind === 'potion') {
            const options = generator.samples(potionRewards, getRewardOptionCount(state))
            rewardStates.push({ kind: 'potion', options, selectedIndex: null })
        } else if (rewardKind === 'relic') {
            const options = generator.samples(relicRewards, getRewardOptionCount(state))
            rewardStates.push({ kind: 'relic', options, selectedIndex: null })
        }
    }
    return { rewardStates, challenges: skeleton.challenges }
}

// ------------------ Meta loop -------------------

export class Undo extends Error {
    constructor(
        public gameHistory: number[] = [],
        public gameRedo: number[] = []
    ) {
        super('Undo')
        Object.setPrototypeOf(this, Undo.prototype)
    }
}
export class Redo extends Error {
    constructor() {
        super('Redo')
        Object.setPrototypeOf(this, Redo.prototype)
    }
}
export class ReplayStage extends Error {
    constructor(public stage: number) {
        super('ReplayStage')
        Object.setPrototypeOf(this, ReplayStage.prototype)
    }
}

function cloneGameSpec(spec: GameSpec): GameSpec {
    return {
        ...spec,
        cards: [...spec.cards],
        events: [...spec.events],
        potions: [...spec.potions],
        relics: [...spec.relics],
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined
    }
}

function cloneStageReplayData(replayData: StageReplayData): StageReplayData {
    return {
        ...replayData,
        spec: cloneGameSpec(replayData.spec),
        history: [...replayData.history],
        potionsRemaining: [...replayData.potionsRemaining]
    }
}

function replayUsedPotionIDs(replayData: StageReplayData): number[] {
    const remainingIDs = new Set(replayData.potionsRemaining.map(p => p.id))
    return replayData.spec.potions.map(p => p.id).filter(id => !remainingIDs.has(id))
}

function replaySpecForStage(replayData: StageReplayData): GameSpec {
    return {
        ...cloneGameSpec(replayData.spec),
        previousScore: replayData.score,
        replayUsedPotionIDs: replayUsedPotionIDs(replayData),
        replayStage: replayData.stage
    }
}

const replaySimulationUI: MetaUI = {
    chooseCard: async <T extends CardSpec | Card>(
        _state: MetaState,
        _prompt: string,
        _options: T[]
    ): Promise<T | null> => null,
    playGame: async (): Promise<VictoryData> => {
        throw new Error('Replay simulation does not support playGame')
    },
    waitForChallenge: async (): Promise<ChallengeSpec> => {
        throw new Error('Replay simulation does not support waitForChallenge')
    },
    pickPath: async (): Promise<Path> => {
        throw new Error('Replay simulation does not support pickPath')
    },
    chooseOption: async <T>(
        _state: MetaState,
        _prompt: string,
        _options: MetaOption<T>[]
    ): Promise<T | null> => null,
    showMessage: async (): Promise<void> => {},
    updateBuffer: (): void => {}
}

async function computeReplayBufferAfterCourse(replayData: StageReplayData, score: number): Promise<number> {
    const simulationState = new MetaState(replaySimulationUI, 'replay-sim')
    const data: MetaStateData = {
        stage: replayData.stage,
        challenges: [],
        stageScores: Array(TOTAL_STAGES).fill(null),
        stagePars: Array(TOTAL_STAGES).fill(null),
        stageReplays: Array(TOTAL_STAGES).fill(null),
        buffer: replayData.bufferBeforeCourse,
        rewardStates: [],
        collectedCards: [],
        collectedEvents: [],
        potions: [...replayData.spec.potions],
        relics: [...(replayData.spec.relics as Relic[])],
        nextID: 1,
        playingGame: false,
        gameHistory: [],
        gameRedo: [],
    }
    simulationState.data = data
    simulationState.checkpoint = data
    await endCourse(score, replayData.par, simulationState)
    return simulationState.data.buffer
}

function applyReplayResultToAllSnapshots(
    state: MetaState,
    stage: number,
    replayData: StageReplayData,
    bufferAdjustment: number
): void {
    state.mutateAllSnapshots(snapshot => {
        const stageScores = [...snapshot.stageScores]
        stageScores[stage] = replayData.score
        snapshot.stageScores = stageScores

        const stagePars = [...snapshot.stagePars]
        stagePars[stage] = replayData.par
        snapshot.stagePars = stagePars

        const stageReplays = [...snapshot.stageReplays]
        stageReplays[stage] = cloneStageReplayData(replayData)
        snapshot.stageReplays = stageReplays

        snapshot.buffer += bufferAdjustment
    })
}

async function replayCompletedStage(state: MetaState, stage: number): Promise<void> {
    const replayData = state.data.stageReplays[stage]
    if (replayData === null || replayData === undefined) return

    let replayResult: VictoryData
    try {
        replayResult = await state.ui.playGame(
            replaySpecForStage(replayData),
            replayData.history,
            []
        )
    } catch (e) {
        if (e instanceof Undo || e instanceof Redo) return
        throw e
    }

    const newBufferAfterCourse = await computeReplayBufferAfterCourse(replayData, replayResult.score)
    const updatedReplayData: StageReplayData = {
        ...replayData,
        score: replayResult.score,
        history: [...replayResult.history],
        potionsRemaining: [...replayResult.potionsRemaining],
        bufferAfterCourse: newBufferAfterCourse
    }
    const bufferAdjustment = newBufferAfterCourse - replayData.bufferAfterCourse
    applyReplayResultToAllSnapshots(state, stage, updatedReplayData, bufferAdjustment)
    state.ui.updateBuffer(state)
}

function adoptPath(state:MetaState, path: Path) {
    // Fill in any pending encounters now that the path is selected
    const rewardStates = path.rewardStates.map((rs, index) => {
        if (rs.kind === 'encounter' && rs.encounter === null) {
            const generator = state.generator(`encounter${index}`).newGenerator()
            return getEncounterState(state, generator, state.data.stage)
        }
        return rs
    })
    state.update({challenges: path.challenges, rewardStates})
}

// We can define test in order to get a given reward immediately, for testing purposes.

export type TestSpec = ['potion', CardSpec] | ['relic', RelicSpec] | ['card', CardSpec] | ['event', CardSpec] | ['encounter', Encounter]

function makeTestReward(state: MetaState, spec: TestSpec): RewardState {
    switch (spec[0]) {
        case 'potion':
        case 'event':
        case 'card':
            return { kind: spec[0], options: [spec[1] as CardSpec], selectedIndex: null }
        case 'relic':
            return { kind: 'relic', options: [spec[1] as RelicSpec], selectedIndex: null }
        case 'encounter':
            const generator = state.generator('test')
            const encounter = spec[1]
            return {
                kind: 'encounter',
                encounter,
                data: encounter.createInitialData(state, generator)
            }
    }
}

// TODO: implement undo (figure out how it is done right now).
// Note that all checkpoints are at a point where you want to back into the main loop in this method.
export async function playGame(ui: MetaUI, test:null|TestSpec = null, seed: string | null = null): Promise<void> {
    const state: MetaState = new MetaState(ui, seed)
    // Stage 0 offers two challenge options
    const initialPath = fillPath(state, {
        rewards: ['card', 'card', 'event', 'potion'] as RewardKind[],
        challenges: [randomChallenge(state), randomChallenge(state)]
    })
    if (test !== null) initialPath.rewardStates.push(makeTestReward(state, test));
    adoptPath(state, initialPath)
    state.clearHistory()
    while (true) {
        console.assert(state.checkpoint == state.data) // Should always be at a checkpoint when starting this loop
        try {
            if (state.data.playingGame) {
                const stage = state.data.stage
                // challenges[0] is the selected challenge (set when user clicks a challenge button)
                const gameSpec = makeSpec(state, state.data.challenges[0])
                const startingBuffer = state.data.buffer
                // Pass saved game state for replay (from previous redo)
                const { score, potionsRemaining, history } = await state.ui.playGame(
                    gameSpec,
                    state.data.gameHistory,
                    state.data.gameRedo
                )
                // Clear saved game state after successful completion
                state.update({ potions: potionsRemaining, gameHistory: [], gameRedo: [] })
                await endCourse(score, gameSpec.par, state)
                const stageReplays = [...state.data.stageReplays]
                stageReplays[stage] = {
                    stage,
                    spec: cloneGameSpec(gameSpec),
                    score,
                    par: gameSpec.par,
                    history: [...history],
                    potionsRemaining: [...potionsRemaining],
                    bufferBeforeCourse: startingBuffer,
                    bufferAfterCourse: state.data.buffer
                }
                state.update({ stageReplays })
                state.update({ stage: state.data.stage + 1 })
                if (state.data.stage >= TOTAL_STAGES) {
                    // Game over - player has completed all stages
                    await state.ui.showMessage(state, 'Congratulations! You have completed all stages!')
                    return
                }
                // Crossing a stage boundary should discard all meta undo/redo history.
                state.clearHistory()
                const paths = makePaths(state).map(skel => fillPath(state, skel))
                let path: Path
                while (true) {
                    try {
                        path = (paths.length > 1) ? await state.ui.pickPath(state, paths) : paths[0]
                        break
                    } catch (e) {
                        if (e instanceof ReplayStage) {
                            await replayCompletedStage(state, e.stage)
                            continue
                        }
                        throw e
                    }
                }
                adoptPath(state, path)
                state.update({ playingGame: false })
                state.clearHistory()
            } else {
                // Wait for user to select a challenge (reward options handled inline by UI)
                let selectedChallenge: ChallengeSpec
                while (true) {
                    try {
                        selectedChallenge = await state.ui.waitForChallenge(state)
                        break
                    } catch (e) {
                        if (e instanceof ReplayStage) {
                            await replayCompletedStage(state, e.stage)
                            continue
                        }
                        throw e
                    }
                }
                // Store the selected challenge as the only one
                state.update({ challenges: [selectedChallenge] })
                await trigger({kind: 'start', stage: state.data.stage}, state)
                state.update({ playingGame: true })
                state.setCheckpoint()
            }
        } catch (e) {
            if (e instanceof Undo) {
                // Pass game state to undo so it's saved in the redo checkpoint
                state.undo({ gameHistory: e.gameHistory, gameRedo: e.gameRedo })
            } else if (e instanceof Redo) {
                state.redo()
            } else {
                throw e
            }
        }
    }
}
