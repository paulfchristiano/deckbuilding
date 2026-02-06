// metaLogic.ts - Meta-game state and transformations
// This handles the roguelike progression layer on top of the core game.

import { CardSpec, Card, State, vpModes,
    TypedTrigger, TypedReplacer,
    Boon, VPMode,
    boons,
    core,
    PlaceName,
    Token,
    cardRewards, eventRewards, potionRewards, relicRewards,
    coinKey, energyEventKey, displayName,
    VictoryData,
    Replayable
 } from './gameLogic.js'
import type { GameSpec } from './gameLogic.js'

import { buildSpecTooltip } from './cardRendering.js'
import { makeBottledCardPotion, makeBottledEventPotion, makeCardInABoxRelic } from './data/specialSpecs.js'
import { getEncounterUpgradeById } from './data/upgrades.js'

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

    playGame(
        spec: GameSpec,
        gameHistory?: number[],
        gameRedo?: number[],
        macros?: unknown,
        viewingMacros?: boolean,
        onProgress?: ((progress: ActiveGameProgress) => void) | null
    ): Promise<VictoryData>

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

export interface ActiveGameProgress {
    history: Replayable[]
    redo: Replayable[]
    macros: unknown
    viewingMacros: boolean
}

// --------------------- Reward Options and Encounters

// A button/option displayed for a reward or encounter
export interface RewardOption {
    label: string
    description?: string
    spec?: CardSpec           // Display as card if provided
    tooltipSpec?: CardSpec    // Optional tooltip card content for text options
    compact?: boolean         // Render as compact text option
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
const PIGGY_BANK_SELECTED_INDEX = -2

function singingBowlCount(state: MetaState): number {
    return state.data.relics.filter(relic => relic.name === 'Singing Bowl').length
}

function piggyBankCount(state: MetaState): number {
    return state.data.relics.filter(relic => relic.name === 'Piggy Bank').length
}

function encounterRewardCompleted(rewardState: EncounterRewardState): boolean {
    const data = rewardState.data as Record<string, unknown> | null
    if (data && typeof data === 'object') {
        if ('selectedIndex' in data) return data.selectedIndex !== null
        if ('finished' in data) return data.finished === true
    }
    return false
}

// Get options for a simple reward
function getSimpleRewardOptions(state: SimpleRewardState, metaState: MetaState): RewardOption[] {
    const options = state.options as Array<CardSpec | RelicSpec>
    return options.map((option: CardSpec | RelicSpec, i: number) => ({
        label: displayName(option as CardSpec),
        spec: option as CardSpec,
        disabled: state.selectedIndex !== null,
        checked: state.selectedIndex === i || state.selectedIndex === PIGGY_BANK_SELECTED_INDEX,
        onClick: async () => {
            const skipped = options
                .filter((_, optionIndex) => optionIndex !== i)
                .map(spec => displayName(spec as CardSpec))
            const transform =
                state.kind === 'card' ? gainCard(option as CardSpec, { skipped }) :
                state.kind === 'event' ? gainEvent(option as CardSpec, { skipped }) :
                state.kind === 'potion' ? gainPotion(option as CardSpec, { skipped }) :
                gainRelic(option as RelicSpec, { skipped })
            return {
                newData: { ...state, selectedIndex: i },
                transform
            }
        }
    }))
}

// Get options for any reward state
export function getRewardOptions(rewardState: RewardState, metaState: MetaState): RewardOption[] {
    const baseOptions = rewardState.kind === 'encounter'
        ? (!rewardState.encounter ? [] : rewardState.encounter.getOptions(rewardState.data, metaState))
        : getSimpleRewardOptions(rewardState, metaState)

    const alreadySelected = rewardState.kind === 'encounter'
        ? encounterRewardCompleted(rewardState)
        : rewardState.selectedIndex !== null
    const piggySelected = rewardState.kind !== 'encounter' && rewardState.selectedIndex === PIGGY_BANK_SELECTED_INDEX
    const hasSingingBowl = rewardState.kind === 'card' && singingBowlCount(metaState) > 0
    if (hasSingingBowl) {
        const optionIndex = baseOptions.length
        const skippedLabels = baseOptions.map(option => option.label)
        const details = skippedLabels.length > 0 ? `Skipped: ${skippedLabels.join(', ')}` : undefined
        baseOptions.push({
            label: '+2 Buffer',
            compact: true,
            disabled: alreadySelected,
            checked: rewardState.selectedIndex === optionIndex,
            onClick: async () => {
                const transform = compose(
                    addTimelineAction('Gain 2 buffer', details),
                    addBuffer(2)
                )
                return {
                    newData: { ...rewardState, selectedIndex: optionIndex },
                    transform
                }
            }
        })
    }

    const hasPiggyBank = rewardState.kind !== 'encounter' && (piggyBankCount(metaState) > 0 || piggySelected)
    if (hasPiggyBank) {
        const takenNames = rewardState.options.map(option => displayName(option as CardSpec))
        const details = takenNames.length > 0 ? `Taken: ${takenNames.join(', ')}` : undefined
        baseOptions.push({
            label: 'Take it all',
            compact: true,
            disabled: alreadySelected,
            checked: piggySelected,
            onClick: async () => {
                const transform: MetaTransform = async (state: MetaState) => {
                    const piggyBank = state.data.relics.find(relic => relic.name === 'Piggy Bank')
                    if (piggyBank) state.removeRelic(piggyBank.id)
                    await addTimelineAction('Take it all', details)(state)
                    for (const option of rewardState.options) {
                        if (rewardState.kind === 'card') await gainCard(option as CardSpec, { silent: true })(state)
                        else if (rewardState.kind === 'event') await gainEvent(option as CardSpec, { silent: true })(state)
                        else if (rewardState.kind === 'potion') await gainPotion(option as CardSpec, { silent: true })(state)
                        else await gainRelic(option as RelicSpec, { silent: true })(state)
                    }
                }
                return {
                    newData: { ...rewardState, selectedIndex: PIGGY_BANK_SELECTED_INDEX },
                    transform
                }
            }
        })
    }

    return baseOptions
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
    const ordered = generator.permute(encounterRegistry)
    const registration = ordered.find(e => e.minStage <= stage && stage <= e.maxStage)
    if (!registration) {
        throw new Error(`No encounters available for stage ${stage}`)
    }
    return {
        kind: 'encounter',
        encounter: registration.encounter,
        data: registration.encounter.createInitialData(state, generator)
    }
}

export function getEncounterByName(name: string): Encounter | null {
    const registration = encounterRegistry.find(entry => entry.encounter.name === name)
    return registration ? registration.encounter : null
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

export function challengeSummary(challenge: ChallengeSpec): string {
    const boonSummary = challenge.boons.map(b => b.name).join(' + ')
    return boonSummary.length > 0 ? `${challenge.vpMode.name} + ${boonSummary}` : challenge.vpMode.name
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

export interface PathRewardParams {
    rewardsPerPath: number
}

// TODO: render relics appropriately when you hold shift etc.
export type MetaReplacer =
    | { kind: 'gameSetup', replace: (params: GameSetupParams, self: Relic) => GameSetupParams }
    | { kind: 'reward', replace: (params: RewardParams, self: Relic) => RewardParams }
    | { kind: 'pathRewards', replace: (params: PathRewardParams, self: Relic) => PathRewardParams }

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

export interface PathGenerationEvent {
    kind: 'path'
    baseRewardsPerPath: number
    rewardsPerPath: number
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

export type MetaGameEvent = CourseEndEvent | CourseStartEvent | PathGenerationEvent | GainRelicEvent | GainPotionEvent | GainCardEvent | GainEventEvent

export interface MetaTrigger<T extends MetaGameEvent> {
    kind: T['kind'];
    handles: (e:T, s:MetaState, self:Relic) => boolean;
    transform: (e:T, s:MetaState, self:Relic) => MetaTransform;
}

// Meta trigger types - now return MetaTransform instead of just a result
export type TypedMetaTrigger =
    | MetaTrigger<CourseEndEvent>
    | MetaTrigger<CourseStartEvent>
    | MetaTrigger<PathGenerationEvent>
    | MetaTrigger<GainRelicEvent>
    | MetaTrigger<GainPotionEvent>
    | MetaTrigger<GainCardEvent>
    | MetaTrigger<GainEventEvent>

// ----------------------------- State Types


// A path the player can choose (contains rewards + kingdom)
export interface Path {
    rewardStates: RewardState[]
    challenges: ChallengeSpec[]
}

export type MetaPhase = 'stage_select' | 'path_select' | 'in_game' | 'game_over'

export type RewardKind = 'card' | 'event' | 'potion' | 'relic' | 'encounter'

export interface StageReplayData {
    stage: number
    challenge: ChallengeSpec
    spec: GameSpec
    score: number
    par: number
    history: Replayable[]
    potionsRemaining: Card[]
    bufferBeforeCourse: number
    bufferAfterCourse: number
}

export type MetaTimelineEntry =
    | {
        kind: 'stage'
        stage: number
        challenge: string
        score: number
        par: number
        usedPotions?: string[]
    }
    | {
        kind: 'gain'
        stage: number
        gainKind: 'card' | 'event' | 'potion' | 'relic'
        name: string
        skipped?: string[]
        details?: string
    }
    | {
        kind: 'action'
        stage: number
        action: string
        details?: string
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
    phase: MetaPhase

    // Challenge options for current stage (user selects one to play)
    challenges: ChallengeSpec[]
    availablePaths: Path[]

    // Score tracking
    stageScores: (number | null)[]
    stagePars: (number | null)[]
    stageReplays: (StageReplayData | null)[]
    timeline: MetaTimelineEntry[]

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

    // Saved game state for restoration on redo
    gameHistory: number[]
    gameRedo: number[]
}

export interface MetaGlobalState {
    macros: unknown
    viewingMacros: boolean
}

import { Generator, randomString } from './rng.js'

export class MetaState {

    public checkpoint: MetaStateData
    public redoStack: MetaStateData[] = []
    public undoStack: MetaStateData[] = []
    public readonly seed: string
    public masterGenerator: Generator
    public generators: Map<string, Generator> = new Map()
    public data: MetaStateData
    public global: MetaGlobalState
    private onChange: (() => void) | null

    constructor(
        public readonly ui: MetaUI,
        seed: null | string = null,
        onChange: (() => void) | null = null,
    ) {
        this.onChange = onChange
        if (seed === null) {
            this.seed = randomString()
        } else {
            this.seed = seed
        }
        this.masterGenerator = new Generator(this.seed)
        const data = {
            stage: 0,
            phase: 'stage_select' as MetaPhase,
            buffer: INITIAL_BUFFER,
            stageScores: Array(TOTAL_STAGES).fill(null),
            stagePars: Array(TOTAL_STAGES).fill(null),
            stageReplays: Array(TOTAL_STAGES).fill(null),
            timeline: [] as MetaTimelineEntry[],
            challenges: [] as ChallengeSpec[],
            availablePaths: [] as Path[],
            rewardStates: [] as RewardState[],
            collectedCards: [] as CardSpec[],
            collectedEvents: [] as CardSpec[],
            potions: [] as Card[],
            relics: [] as Relic[],
            nextID: 1,
            gameHistory: [] as number[],
            gameRedo: [] as number[],
        }
        this.data = data
        this.checkpoint = data
        this.global = {
            macros: [],
            viewingMacros: false
        }
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
        if (this.data.phase === 'in_game') {
            throw new Error('Invariant violation: clearHistory() called while in active game')
        }
        this.undoStack = []
        this.redoStack = []
        this.checkpoint = this.data
        this.notifyChanged()
    }

    setCheckpoint() {
        console.assert(this.data.phase !== 'path_select') // Should not set checkpoint while selecting paths.
        this.undoStack.push(this.checkpoint)
        this.checkpoint = this.data
        this.redoStack = []
        this.notifyChanged()
    }

    updateAndSetCheckpoint(updates: Partial<MetaStateData>) {
        console.assert(this.data.phase !== 'path_select') // Should not set checkpoint while selecting paths.
        const nextData = { ...this.data, ...updates }
        this.undoStack.push(this.checkpoint)
        this.data = nextData
        this.checkpoint = nextData
        this.redoStack = []
        this.notifyChanged()
    }

    replaceAndClearHistory(updates: Partial<MetaStateData>) {
        const nextData = { ...this.data, ...updates }
        if (nextData.phase === 'in_game') {
            throw new Error('Invariant violation: replaceAndClearHistory() cannot enter active game')
        }
        this.data = nextData
        this.undoStack = []
        this.redoStack = []
        this.checkpoint = nextData
        this.notifyChanged()
    }
    
    update(updates: Partial<MetaStateData>) {
        this.data = {...this.data, ...updates}
        this.notifyChanged()
    }

    updateGlobal(updates: Partial<MetaGlobalState>) {
        this.global = {...this.global, ...updates}
        this.notifyChanged()
    }

    private inPathSelection(): boolean {
        return this.data.challenges.length === 0
    }
    
    // Undo to previous checkpoint
    // If checkpointUpdate is provided, apply it to the checkpoint before pushing to redoStack
    undo(checkpointUpdate?: Partial<MetaStateData>) {
        // Path selection intentionally has no meta undo/redo.
        if (this.inPathSelection()) {
            this.undoStack = []
            this.redoStack = []
            this.checkpoint = this.data
            return
        }
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
        this.notifyChanged()
    }

    // Redo a previously undone action
    redo() {
        if (this.inPathSelection()) return
        if (this.redoStack.length === 0) return
        const nextState = this.redoStack.pop()
        this.undoStack.push(this.checkpoint)
        this.checkpoint = nextState!
        this.data = nextState!
        this.notifyChanged()
    }

    canUndo(): boolean {
        if (this.inPathSelection()) return false
        return this.undoStack.length > 0 || this.checkpoint != this.data
    }

    canRedo(): boolean {
        if (this.inPathSelection()) return false
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
        this.notifyChanged()
    }

    setChangeListener(listener: (() => void) | null): void {
        this.onChange = listener
    }

    private notifyChanged(): void {
        if (this.onChange) this.onChange()
    }
}

// ----------------------------- Serialization

type SerializedSpecCategory = 'card' | 'event' | 'potion' | 'relic'

type SerializedSpecRef =
    | {
        type: 'base'
        category: SerializedSpecCategory
        name: string
        upgradeIDs: string[]
    }
    | {
        type: 'dynamic'
        dynamicKind: 'cardInABoxRelic' | 'bottledCardPotion' | 'bottledEventPotion'
        base: SerializedSpecRef
        useUnderlyingEvent?: boolean
    }

interface SerializedCard {
    kind: 'card' | 'relic'
    id: number
    spec: SerializedSpecRef
    ticks: number[]
    tokens: [Token, number][]
    place: PlaceName
    zoneIndex: number
    notedCards?: SerializedSpecRef[]
}

interface SerializedSimpleRewardState {
    kind: 'card' | 'event' | 'potion' | 'relic'
    options: SerializedSpecRef[]
    selectedIndex: number | null
}

interface SerializedEncounterRewardState {
    kind: 'encounter'
    encounterName: string | null
    data: unknown
}

type SerializedRewardState = SerializedSimpleRewardState | SerializedEncounterRewardState

interface SerializedChallengeSpec {
    stage: number
    vpModeName: string
    boonNames: string[]
}

interface SerializedPath {
    rewardStates: SerializedRewardState[]
    challenges: SerializedChallengeSpec[]
}

interface SerializedGameSpec {
    vp: number
    par: number
    cards: SerializedSpecRef[]
    events: SerializedSpecRef[]
    potions: SerializedCard[]
    relics: SerializedCard[]
    metaStage?: number
    metaStageScores?: (number | null)[]
    metaStagePars?: (number | null)[]
    metaStageTooltips?: (string | null)[]
    previousScore?: number | null
    replayUsedPotionIDs?: number[]
    replayStage?: number | null
}

interface SerializedStageReplayData {
    stage: number
    challenge: SerializedChallengeSpec
    spec: SerializedGameSpec
    score: number
    par: number
    history: Replayable[]
    potionsRemaining: SerializedCard[]
    bufferBeforeCourse: number
    bufferAfterCourse: number
}

interface SerializedMetaStateData {
    stage: number
    phase?: MetaPhase
    challenges: SerializedChallengeSpec[]
    availablePaths?: SerializedPath[]
    stageScores: (number | null)[]
    stagePars: (number | null)[]
    stageReplays: (SerializedStageReplayData | null)[]
    buffer: number
    rewardStates: SerializedRewardState[]
    collectedCards: SerializedSpecRef[]
    collectedEvents: SerializedSpecRef[]
    potions: SerializedCard[]
    relics: SerializedCard[]
    nextID: number
    playingGame?: boolean
    timeline?: MetaTimelineEntry[]
    gameHistory: number[]
    gameRedo: number[]
}

interface SerializedMetaHistory {
    checkpoint: SerializedMetaStateData
    undoStack: SerializedMetaStateData[]
    redoStack: SerializedMetaStateData[]
}

export interface SerializedMetaGame {
    version: 1
    seed: string
    masterGeneratorState: number
    generatorStates: Array<{ key: string, state: number }>
    data: SerializedMetaStateData
    history?: SerializedMetaHistory
    global: unknown
}

function validateMetaStateData(data: MetaStateData, context: string): void {
    if (data.phase === 'path_select' && data.availablePaths.length === 0) {
        throw new Error(`Invariant violation (${context}): path_select requires available paths`)
    }
    if (data.phase !== 'path_select' && data.availablePaths.length > 0) {
        throw new Error(`Invariant violation (${context}): only path_select may store available paths`)
    }
    if (data.phase === 'stage_select' && data.challenges.length === 0) {
        throw new Error(`Invariant violation (${context}): stage_select requires challenge options`)
    }
    if (data.phase === 'in_game' && data.challenges.length !== 1) {
        throw new Error(`Invariant violation (${context}): in_game requires exactly one selected challenge`)
    }
    if (data.phase !== 'in_game' && (data.gameHistory.length > 0 || data.gameRedo.length > 0)) {
        throw new Error(`Invariant violation (${context}): saved game history only allowed in in_game`)
    }
}

function looksLikeCardSpec(value: unknown): value is CardSpec {
    if (value === null || typeof value !== 'object') return false
    const record = value as Record<string, unknown>
    if (typeof record.name !== 'string') return false
    if ('spec' in record && 'id' in record && 'place' in record) return false
    return 'effects' in record
        || 'buyCost' in record
        || 'fixedCost' in record
        || 'isPotion' in record
        || 'upgrades' in record
        || 'persistence' in record
        || 'metaReplacers' in record
        || 'metaTriggers' in record
        || 'relatedCards' in record
        || 'simpleText' in record
}

function encodeUnknown(value: unknown): unknown {
    if (value instanceof Relic) {
        return {
            __type: 'relic',
            value: serializeCard(value)
        }
    }
    if (value instanceof Card) {
        return {
            __type: 'card',
            value: serializeCard(value)
        }
    }
    if (value instanceof Map) {
        return {
            __type: 'map',
            entries: [...value.entries()].map(([key, entryValue]) => [encodeUnknown(key), encodeUnknown(entryValue)])
        }
    }
    if (Array.isArray(value)) {
        return value.map(encodeUnknown)
    }
    if (looksLikeCardSpec(value)) {
        return {
            __type: 'spec',
            value: serializeSpec(value)
        }
    }
    if (value !== null && typeof value === 'object') {
        const result: Record<string, unknown> = {}
        for (const [key, entryValue] of Object.entries(value as Record<string, unknown>)) {
            result[key] = encodeUnknown(entryValue)
        }
        return result
    }
    return value
}

function decodeUnknown(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(decodeUnknown)
    }
    if (value !== null && typeof value === 'object') {
        const record = value as Record<string, unknown>
        if (record.__type === 'map') {
            const entries = (record.entries as unknown[]).map(entry => {
                const pair = entry as [unknown, unknown]
                return [decodeUnknown(pair[0]), decodeUnknown(pair[1])] as [unknown, unknown]
            })
            return new Map(entries)
        }
        if (record.__type === 'spec') {
            return deserializeSpec(record.value as SerializedSpecRef)
        }
        if (record.__type === 'card' || record.__type === 'relic') {
            return deserializeCard(record.value as SerializedCard)
        }
        const result: Record<string, unknown> = {}
        for (const [key, entryValue] of Object.entries(record)) {
            result[key] = decodeUnknown(entryValue)
        }
        return result
    }
    return value
}

function specsForCategory(category: SerializedSpecCategory): CardSpec[] {
    const fromVP = category === 'card'
        ? vpModes.flatMap(vpMode => vpMode.cards)
        : category === 'event'
            ? vpModes.flatMap(vpMode => vpMode.events)
            : []
    const fromBoons = category === 'card'
        ? boons.flatMap(boon => boon.cards)
        : category === 'event'
            ? boons.flatMap(boon => boon.events)
            : []
    const fromCore = category === 'card'
        ? core.cards
        : category === 'event'
            ? core.events
            : []
    const fromRewards =
        category === 'card' ? cardRewards :
        category === 'event' ? eventRewards :
        category === 'potion' ? potionRewards :
        relicRewards
    const all = [...fromRewards, ...fromVP, ...fromBoons, ...fromCore]
    const byName = new Map<string, CardSpec>()
    for (const spec of all) {
        if (!byName.has(spec.name)) byName.set(spec.name, spec)
    }
    return [...byName.values()]
}

function inferSpecCategory(spec: CardSpec): SerializedSpecCategory {
    const categories: SerializedSpecCategory[] = []
    for (const category of ['card', 'event', 'potion', 'relic'] as SerializedSpecCategory[]) {
        if (specsForCategory(category).some(candidate => candidate.name === spec.name)) {
            categories.push(category)
        }
    }
    if (categories.length === 1) return categories[0]
    if (categories.length === 0) {
        if (spec.isPotion) return 'potion'
        throw new Error(`Unable to infer category for spec "${spec.name}"`)
    }
    throw new Error(`Ambiguous category for spec "${spec.name}"`)
}

function findBaseSpec(category: SerializedSpecCategory, name: string): CardSpec {
    const primaryPool = specsForCategory(category)
    const primaryMatch = primaryPool.find(spec => spec.name === name)
    if (primaryMatch) return primaryMatch

    const crossCategoryMatches: CardSpec[] = []
    for (const categoryName of ['card', 'event', 'potion', 'relic'] as SerializedSpecCategory[]) {
        const match = specsForCategory(categoryName).find(spec => spec.name === name)
        if (match) crossCategoryMatches.push(match)
    }
    if (crossCategoryMatches.length === 1) {
        return crossCategoryMatches[0]
    }

    throw new Error(`Unable to resolve ${category} spec "${name}"`)
}

function serializeSpec(spec: CardSpec, categoryHint: SerializedSpecCategory | null = null): SerializedSpecRef {
    if (spec.persistence) {
        const base = spec.relatedCards?.[0]
        if (!base) {
            throw new Error(`Dynamic spec "${spec.name}" is missing related base card`)
        }
        return {
            type: 'dynamic',
            dynamicKind: spec.persistence.kind,
            base: serializeSpec(base),
            useUnderlyingEvent: spec.persistence.useUnderlyingEvent,
        }
    }

    const category = categoryHint || inferSpecCategory(spec)
    const upgradeIDs = (spec.upgrades || []).map(upgrade => upgrade.id)
    if (upgradeIDs.some(id => id === undefined)) {
        throw new Error(`Spec "${spec.name}" has non-serializable upgrades`)
    }
    return {
        type: 'base',
        category,
        name: spec.name,
        upgradeIDs: upgradeIDs as string[],
    }
}

function applyUpgrades(base: CardSpec, upgradeIDs: string[]): CardSpec {
    let result: CardSpec = base
    for (const id of upgradeIDs) {
        const upgrade = getEncounterUpgradeById(id)
        if (!upgrade) {
            throw new Error(`Unknown upgrade id "${id}"`)
        }
        result = {
            ...result,
            upgrades: [...(result.upgrades || []), upgrade]
        }
    }
    return result
}

function deserializeSpec(spec: SerializedSpecRef): CardSpec {
    if (spec.type === 'base') {
        const base = findBaseSpec(spec.category, spec.name)
        return applyUpgrades(base, spec.upgradeIDs)
    }
    const base = deserializeSpec(spec.base)
    switch (spec.dynamicKind) {
        case 'cardInABoxRelic':
            return makeCardInABoxRelic(base)
        case 'bottledCardPotion':
            return makeBottledCardPotion(base)
        case 'bottledEventPotion':
            return makeBottledEventPotion(base, { useUnderlyingEvent: spec.useUnderlyingEvent ?? true })
        default:
            throw new Error(`Unknown dynamic spec kind`)
    }
}

function serializeCard(card: Card): SerializedCard {
    const common = {
        id: card.id,
        spec: serializeSpec(card.spec),
        ticks: [...card.ticks],
        tokens: [...card.tokens.entries()],
        place: card.place,
        zoneIndex: card.zoneIndex,
    }
    if (card instanceof Relic) {
        return {
            kind: 'relic',
            ...common,
            notedCards: (card.notedCards || []).map(spec => serializeSpec(spec)),
        }
    }
    return {
        kind: 'card',
        ...common
    }
}

function deserializeCard(card: SerializedCard): Card {
    const spec = deserializeSpec(card.spec)
    const tokens = new Map<Token, number>(card.tokens)
    if (card.kind === 'relic') {
        const notedCards = (card.notedCards || []).map(deserializeSpec)
        return new Relic(spec as RelicSpec, card.id, notedCards, card.ticks, tokens, card.place, card.zoneIndex)
    }
    return new Card(spec, card.id, card.ticks, tokens, card.place, card.zoneIndex)
}

function serializeChallenge(challenge: ChallengeSpec): SerializedChallengeSpec {
    return {
        stage: challenge.stage,
        vpModeName: challenge.vpMode.name,
        boonNames: challenge.boons.map(boon => boon.name)
    }
}

function deserializeChallenge(challenge: SerializedChallengeSpec): ChallengeSpec {
    const vpMode = vpModes.find(mode => mode.name === challenge.vpModeName)
    if (!vpMode) throw new Error(`Unknown vp mode "${challenge.vpModeName}"`)
    const resolvedBoons = challenge.boonNames.map(name => {
        const boon = boons.find(candidate => candidate.name === name)
        if (!boon) throw new Error(`Unknown boon "${name}"`)
        return boon
    })
    return {
        stage: challenge.stage,
        vpMode,
        boons: resolvedBoons
    }
}

function serializePath(path: Path): SerializedPath {
    return {
        rewardStates: path.rewardStates.map(serializeRewardState),
        challenges: path.challenges.map(serializeChallenge)
    }
}

function deserializePath(path: SerializedPath): Path {
    return {
        rewardStates: path.rewardStates.map(deserializeRewardState),
        challenges: path.challenges.map(deserializeChallenge)
    }
}

function serializeRewardState(rewardState: RewardState): SerializedRewardState {
    if (rewardState.kind === 'encounter') {
        return {
            kind: 'encounter',
            encounterName: rewardState.encounter ? rewardState.encounter.name : null,
            data: encodeUnknown(rewardState.data)
        }
    }
    const category =
        rewardState.kind === 'card' ? 'card' :
        rewardState.kind === 'event' ? 'event' :
        rewardState.kind === 'potion' ? 'potion' :
        'relic'
    return {
        kind: rewardState.kind,
        options: (rewardState.options as CardSpec[]).map(spec => serializeSpec(spec, category)),
        selectedIndex: rewardState.selectedIndex
    }
}

function deserializeRewardState(rewardState: SerializedRewardState): RewardState {
    if (rewardState.kind === 'encounter') {
        return {
            kind: 'encounter',
            encounter: rewardState.encounterName ? getEncounterByName(rewardState.encounterName) : null,
            data: decodeUnknown(rewardState.data)
        }
    }
    return {
        kind: rewardState.kind,
        options: rewardState.options.map(deserializeSpec) as CardSpec[],
        selectedIndex: rewardState.selectedIndex
    }
}

function serializeGameSpec(spec: GameSpec): SerializedGameSpec {
    return {
        vp: spec.vp,
        par: spec.par,
        cards: spec.cards.map(card => serializeSpec(card, 'card')),
        events: spec.events.map(event => serializeSpec(event, 'event')),
        potions: spec.potions.map(potion => serializeCard(potion)),
        relics: spec.relics.map(relic => serializeCard(relic)),
        metaStage: spec.metaStage,
        metaStageScores: spec.metaStageScores ? [...spec.metaStageScores] : undefined,
        metaStagePars: spec.metaStagePars ? [...spec.metaStagePars] : undefined,
        metaStageTooltips: spec.metaStageTooltips ? [...spec.metaStageTooltips] : undefined,
        previousScore: spec.previousScore,
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined,
        replayStage: spec.replayStage
    }
}

function deserializeGameSpec(spec: SerializedGameSpec): GameSpec {
    return {
        vp: spec.vp,
        par: spec.par,
        cards: spec.cards.map(card => deserializeSpec(card)),
        events: spec.events.map(event => deserializeSpec(event)),
        potions: spec.potions.map(card => deserializeCard(card)),
        relics: spec.relics.map(card => deserializeCard(card)),
        metaStage: spec.metaStage,
        metaStageScores: spec.metaStageScores ? [...spec.metaStageScores] : undefined,
        metaStagePars: spec.metaStagePars ? [...spec.metaStagePars] : undefined,
        metaStageTooltips: spec.metaStageTooltips ? [...spec.metaStageTooltips] : undefined,
        previousScore: spec.previousScore,
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined,
        replayStage: spec.replayStage
    }
}

function serializeMetaStateData(data: MetaStateData): SerializedMetaStateData {
    validateMetaStateData(data, 'serialize')
    return {
        stage: data.stage,
        phase: data.phase,
        challenges: data.challenges.map(serializeChallenge),
        availablePaths: data.availablePaths.map(serializePath),
        stageScores: [...data.stageScores],
        stagePars: [...data.stagePars],
        stageReplays: data.stageReplays.map(stageReplay => {
            if (stageReplay === null) return null
            return {
                stage: stageReplay.stage,
                challenge: serializeChallenge(stageReplay.challenge),
                spec: serializeGameSpec(stageReplay.spec),
                score: stageReplay.score,
                par: stageReplay.par,
                history: [...stageReplay.history],
                potionsRemaining: stageReplay.potionsRemaining.map(card => serializeCard(card)),
                bufferBeforeCourse: stageReplay.bufferBeforeCourse,
                bufferAfterCourse: stageReplay.bufferAfterCourse
            }
        }),
        buffer: data.buffer,
        rewardStates: data.rewardStates.map(serializeRewardState),
        collectedCards: data.collectedCards.map(card => serializeSpec(card, 'card')),
        collectedEvents: data.collectedEvents.map(event => serializeSpec(event, 'event')),
        potions: data.potions.map(card => serializeCard(card)),
        relics: data.relics.map(card => serializeCard(card)),
        nextID: data.nextID,
        timeline: data.timeline.map(entry => ({ ...entry })),
        gameHistory: [...data.gameHistory],
        gameRedo: [...data.gameRedo]
    }
}

function cloneSerializedMetaStateData(data: SerializedMetaStateData): SerializedMetaStateData {
    return JSON.parse(JSON.stringify(data)) as SerializedMetaStateData
}

function deserializeMetaStateData(data: SerializedMetaStateData): MetaStateData {
    const phase: MetaPhase = data.phase ?? (
        data.playingGame === true
            ? 'in_game'
            : (data.availablePaths && data.availablePaths.length > 0 ? 'path_select' : 'stage_select')
    )
    const result: MetaStateData = {
        stage: data.stage,
        phase,
        challenges: data.challenges.map(deserializeChallenge),
        availablePaths: (data.availablePaths || []).map(deserializePath),
        stageScores: [...data.stageScores],
        stagePars: [...data.stagePars],
        stageReplays: data.stageReplays.map(stageReplay => {
            if (stageReplay === null) return null
            return {
                stage: stageReplay.stage,
                challenge: deserializeChallenge(stageReplay.challenge),
                spec: deserializeGameSpec(stageReplay.spec),
                score: stageReplay.score,
                par: stageReplay.par,
                history: [...stageReplay.history],
                potionsRemaining: stageReplay.potionsRemaining.map(card => deserializeCard(card)),
                bufferBeforeCourse: stageReplay.bufferBeforeCourse,
                bufferAfterCourse: stageReplay.bufferAfterCourse
            }
        }),
        buffer: data.buffer,
        rewardStates: data.rewardStates.map(deserializeRewardState),
        collectedCards: data.collectedCards.map(card => deserializeSpec(card)),
        collectedEvents: data.collectedEvents.map(event => deserializeSpec(event)),
        potions: data.potions.map(card => deserializeCard(card)),
        relics: data.relics.map(card => deserializeCard(card) as Relic),
        nextID: data.nextID,
        timeline: (data.timeline || []).map(entry => ({ ...entry })),
        gameHistory: [...data.gameHistory],
        gameRedo: [...data.gameRedo],
    }
    if (!data.timeline) {
        result.timeline = result.stageReplays.flatMap(stageReplay => {
            if (stageReplay === null) return []
            return [{
                kind: 'stage' as const,
                stage: stageReplay.stage,
                challenge: challengeSummary(stageReplay.challenge),
                score: stageReplay.score,
                par: stageReplay.par,
                usedPotions: usedPotionNames(stageReplay.spec.potions, stageReplay.potionsRemaining),
            }]
        })
    }
    validateMetaStateData(result, 'deserialize')
    return result
}

export function serializeMetaGame(state: MetaState): SerializedMetaGame {
    return {
        version: 1,
        seed: state.seed,
        masterGeneratorState: state.masterGenerator.exportState(),
        generatorStates: [...state.generators.entries()].map(([key, generator]) => ({
            key,
            state: generator.exportState()
        })),
        data: serializeMetaStateData(state.data),
        history: {
            checkpoint: serializeMetaStateData(state.checkpoint),
            undoStack: state.undoStack.map(serializeMetaStateData),
            redoStack: state.redoStack.map(serializeMetaStateData),
        },
        global: encodeUnknown(state.global)
    }
}

export function deserializeMetaGame(
    ui: MetaUI,
    serialized: SerializedMetaGame,
    onChange: (() => void) | null = null
): MetaState {
    if (serialized.version !== 1) {
        throw new Error(`Unsupported save version ${serialized.version}`)
    }
    const state = new MetaState(ui, serialized.seed, onChange)
    state.masterGenerator = Generator.fromState(serialized.masterGeneratorState)
    state.generators = new Map(
        serialized.generatorStates.map(entry => [entry.key, Generator.fromState(entry.state)])
    )
    const serializedData = cloneSerializedMetaStateData(serialized.data)
    const history = serialized.history
    const serializedCheckpoint = history ? cloneSerializedMetaStateData(history.checkpoint) : serializedData
    const serializedUndo = (history ? history.undoStack : []).map(cloneSerializedMetaStateData)
    const serializedRedo = (history ? history.redoStack : []).map(cloneSerializedMetaStateData)

    const dataBySerialized = new Map<SerializedMetaStateData, MetaStateData>()
    const decodeSnapshot = (snapshot: SerializedMetaStateData): MetaStateData => {
        if (!dataBySerialized.has(snapshot)) {
            dataBySerialized.set(snapshot, deserializeMetaStateData(snapshot))
        }
        return dataBySerialized.get(snapshot)!
    }

    state.data = decodeSnapshot(serializedData)
    state.checkpoint = history ? decodeSnapshot(serializedCheckpoint) : state.data
    state.undoStack = serializedUndo.map(decodeSnapshot)
    state.redoStack = serializedRedo.map(decodeSnapshot)
    if (state.data.phase === 'in_game' && state.undoStack.length === 0) {
        throw new Error('Malformed save: in-progress game is missing a meta undo checkpoint')
    }
    const restoredGlobal = decodeUnknown(serialized.global) as Partial<MetaGlobalState>
    state.global = {
        macros: restoredGlobal.macros ?? [],
        viewingMacros: restoredGlobal.viewingMacros ?? false
    }
    return state
}

// ----------------------------- MetaTransform

// A function that transforms meta-game state (analogous to Transform in gameLogic)
// Can be sync or async, like Transform in gameLogic
// Note that these mutate MetaStates in place.
export type MetaTransform = (state: MetaState) => Promise<void> | ((state: MetaState) => void)

// Identity transform - does nothing
export const noop: MetaTransform = async function (state: MetaState) { return }

interface GainTimelineDetails {
    skipped?: string[]
    details?: string
    silent?: boolean
}

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

export function addTimelineAction(action: string, details?: string): MetaTransform {
    return async function(state: MetaState) {
        state.update({
            timeline: [...state.data.timeline, {
                kind: 'action',
                stage: state.data.stage,
                action,
                details
            }]
        })
    }
}

// Add a card to collection
export function gainCard(card: CardSpec, timelineDetails: GainTimelineDetails = {}): MetaTransform {
    return async function(state: MetaState) {
        const nextData: Partial<MetaStateData> = {
            collectedCards: [...state.data.collectedCards, card],
        }
        if (!timelineDetails.silent) {
            nextData.timeline = [...state.data.timeline, {
                kind: 'gain',
                stage: state.data.stage,
                gainKind: 'card',
                name: displayName(card),
                skipped: timelineDetails.skipped ? [...timelineDetails.skipped] : undefined,
                details: timelineDetails.details
            }]
        }
        state.update(nextData)
        await trigger({kind: 'card', card: card}, state)
    }
}

// Add an event to collection
export function gainEvent(event: CardSpec, timelineDetails: GainTimelineDetails = {}): MetaTransform {
    return async function(state: MetaState) {
        const nextData: Partial<MetaStateData> = {
            collectedEvents: [...state.data.collectedEvents, event],
        }
        if (!timelineDetails.silent) {
            nextData.timeline = [...state.data.timeline, {
                kind: 'gain',
                stage: state.data.stage,
                gainKind: 'event',
                name: displayName(event),
                skipped: timelineDetails.skipped ? [...timelineDetails.skipped] : undefined,
                details: timelineDetails.details
            }]
        }
        state.update(nextData)
    }
}

// Add a potion
export function gainPotion(potion: CardSpec, timelineDetails: GainTimelineDetails = {}): MetaTransform {
    return async function(state: MetaState) {
        const nextID = state.data.nextID
        const potionCard = new Card(potion, nextID)
        const nextData: Partial<MetaStateData> = {
            potions: [...state.data.potions, potionCard],
            nextID: nextID + 1,
        }
        if (!timelineDetails.silent) {
            nextData.timeline = [...state.data.timeline, {
                kind: 'gain',
                stage: state.data.stage,
                gainKind: 'potion',
                name: displayName(potion),
                skipped: timelineDetails.skipped ? [...timelineDetails.skipped] : undefined,
                details: timelineDetails.details
            }]
        }
        state.update(nextData)
    }
} 

// Add a relic
export function gainRelic(relic: RelicSpec, timelineDetails: GainTimelineDetails = {}): MetaTransform {
    return async function(state: MetaState) {
        const nextID = state.data.nextID
        const relicCard:Relic = new Relic(relic, nextID)
        const nextData: Partial<MetaStateData> = {
            relics: [...state.data.relics, relicCard],
            nextID: nextID + 1,
        }
        if (!timelineDetails.silent) {
            nextData.timeline = [...state.data.timeline, {
                kind: 'gain',
                stage: state.data.stage,
                gainKind: 'relic',
                name: displayName(relic),
                skipped: timelineDetails.skipped ? [...timelineDetails.skipped] : undefined,
                details: timelineDetails.details
            }]
        }
        state.update(nextData)
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
    'pathRewards': PathRewardParams
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
                const replaceFn = replacer.replace as unknown as (p: MetaReplacerParamMap[K], self: Relic) => MetaReplacerParamMap[K]
                params = replaceFn(params, relic)
            }
        }
    }
    return params
}

function signedAmount(amount: number): string {
    return amount > 0 ? `+${amount}` : `${amount}`
}

export function describeParCalculation(stage: number, challenge: ChallengeSpec | null | undefined, relicCards: Card[]): string {
    const basePar = BASE_PARS[stage]
    if (basePar === undefined) return ''

    const parts = [`${basePar} (base)`]
    let par = basePar
    if (challenge !== null && challenge !== undefined) {
        for (const boon of challenge.boons) {
            par -= boon.parReduction
            if (boon.parReduction !== 0) {
                parts.push(`${signedAmount(-boon.parReduction)} for ${boon.name}`)
            }
        }
    }

    let params: GameSetupParams = {
        par,
        vpGoal: challenge?.vpMode.target ?? 0,
        cardSpecs: [],
        eventSpecs: []
    }
    for (const relicCard of relicCards) {
        if (!(relicCard instanceof Relic)) continue
        const metaReplacers = relicCard.metaReplacers() as MetaReplacer[]
        for (const replacer of metaReplacers) {
            if (replacer.kind !== 'gameSetup') continue
            const replaceFn = replacer.replace as unknown as (p: GameSetupParams, self: Relic) => GameSetupParams
            const nextParams = replaceFn(params, relicCard)
            const parDelta = nextParams.par - params.par
            if (parDelta !== 0) {
                parts.push(`${signedAmount(parDelta)} for ${relicCard.name}`)
            }
            params = nextParams
        }
    }

    parts.push(`= ${params.par}`)
    return parts.join(', ')
}

function stageTooltipTexts(state: MetaState): (string | null)[] {
    return BASE_PARS.map((basePar, stage) => {
        if (basePar === undefined) return null
        if (stage < state.data.stage) {
            const replayData = state.data.stageReplays[stage]
            if (replayData !== null) {
                return describeParCalculation(stage, replayData.challenge, replayData.spec.relics)
            }
        }
        if (stage === state.data.stage && state.data.challenges.length === 1) {
            return describeParCalculation(stage, state.data.challenges[0], state.data.relics)
        }
        return `${basePar} (base)`
    })
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
        metaStage: state.data.stage,
        metaStageScores: [...state.data.stageScores],
        metaStagePars: [...state.data.stagePars],
        metaStageTooltips: stageTooltipTexts(state),
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

async function makePaths(state: MetaState): Promise<PathSkeleton[]> {
    const stage = state.data.stage
    const generator = state.generator(`paths${stage}`).newGenerator()
    const baseRewardsPerPath = 2
    const pathRewardParams = applyMetaReplacers('pathRewards', { rewardsPerPath: baseRewardsPerPath }, state)
    await trigger({
        kind: 'path',
        baseRewardsPerPath,
        rewardsPerPath: pathRewardParams.rewardsPerPath
    }, state)
    const totalRewardsPerPath = pathRewardParams.rewardsPerPath
    const leftRewards: RewardKind[] = []
    const rightRewards: RewardKind[] = []
    let remainingRewards = totalRewardsPerPath
    while (remainingRewards > 0) {
        const chunkSize = Math.min(3, remainingRewards)
        const sampled: RewardKind[] = generator.permute(['card', 'card', 'event', 'potion', 'relic', 'encounter'])
        leftRewards.push(...sampled.slice(0, chunkSize))
        rightRewards.push(...sampled.slice(chunkSize, chunkSize * 2))
        remainingRewards -= chunkSize
    }
    const challenge1 = randomChallenge(state)
    const challenge2 = randomChallenge(state)
    return [
        { rewards: leftRewards, challenges: [challenge1] },
        { rewards: rightRewards, challenges: [challenge2] },
    ]
}

function pathFromSkeleton(skeleton: PathSkeleton): Path {
    const rewardStates: RewardState[] = []
    for (const rewardKind of skeleton.rewards) {
        if (rewardKind === 'encounter') {
            rewardStates.push({ kind: 'encounter', encounter: null, data: null })
        } else if (rewardKind === 'relic') {
            rewardStates.push({ kind: 'relic', options: [] as RelicSpec[], selectedIndex: null })
        } else if (rewardKind === 'card') {
            rewardStates.push({ kind: 'card', options: [] as CardSpec[], selectedIndex: null })
        } else if (rewardKind === 'event') {
            rewardStates.push({ kind: 'event', options: [] as CardSpec[], selectedIndex: null })
        } else if (rewardKind === 'potion') {
            rewardStates.push({ kind: 'potion', options: [] as CardSpec[], selectedIndex: null })
        }
    }
    return { rewardStates, challenges: skeleton.challenges }
}

// ------------------ Meta loop -------------------

export class Undo extends Error {
    constructor(
        public gameHistory: number[] = [],
        public gameRedo: number[] = [],
        public macros: unknown = null,
        public viewingMacros: boolean | null = null
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
        metaStageScores: spec.metaStageScores ? [...spec.metaStageScores] : undefined,
        metaStagePars: spec.metaStagePars ? [...spec.metaStagePars] : undefined,
        metaStageTooltips: spec.metaStageTooltips ? [...spec.metaStageTooltips] : undefined,
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined
    }
}

function cloneStageReplayData(replayData: StageReplayData): StageReplayData {
    return {
        ...replayData,
        challenge: {
            ...replayData.challenge,
            boons: [...replayData.challenge.boons]
        },
        spec: cloneGameSpec(replayData.spec),
        history: [...replayData.history],
        potionsRemaining: [...replayData.potionsRemaining]
    }
}

function replayUsedPotionIDs(replayData: StageReplayData): number[] {
    const remainingIDs = new Set(replayData.potionsRemaining.map(p => p.id))
    return replayData.spec.potions.map(p => p.id).filter(id => !remainingIDs.has(id))
}

function usedPotionNames(startingPotions: Card[], remainingPotions: Card[]): string[] {
    const remainingIDs = new Set(remainingPotions.map(potion => potion.id))
    return startingPotions
        .filter(potion => !remainingIDs.has(potion.id))
        .map(potion => displayName(potion.spec))
}

function sampleRewardOptionsByBaseName(
    generator: Generator,
    allOptions: CardSpec[],
    count: number,
    collected: CardSpec[]
): CardSpec[] {
    const collectedBaseNames = new Set(collected.map(spec => spec.name))
    const eligible = allOptions.filter(spec => !collectedBaseNames.has(spec.name))
    return generator.samples(eligible, count)
}

export function replaySpecForStage(state: MetaState, replayData: StageReplayData): GameSpec {
    return {
        ...cloneGameSpec(replayData.spec),
        metaStage: state.data.stage,
        metaStageScores: [...state.data.stageScores],
        metaStagePars: [...state.data.stagePars],
        metaStageTooltips: stageTooltipTexts(state),
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
    playGame: async (
        _spec: GameSpec,
        _gameHistory: number[] = [],
        _gameRedo: number[] = [],
        _macros: unknown = null,
        _viewingMacros: boolean = false,
        _onProgress: ((progress: ActiveGameProgress) => void) | null = null
    ): Promise<VictoryData> => {
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
        phase: 'stage_select',
        challenges: [],
        availablePaths: [],
        stageScores: Array(TOTAL_STAGES).fill(null),
        stagePars: Array(TOTAL_STAGES).fill(null),
        stageReplays: Array(TOTAL_STAGES).fill(null),
        timeline: [],
        buffer: replayData.bufferBeforeCourse,
        rewardStates: [],
        collectedCards: [],
        collectedEvents: [],
        potions: [...replayData.spec.potions],
        relics: [...(replayData.spec.relics as Relic[])],
        nextID: 1,
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
            replaySpecForStage(state, replayData),
            replayData.history,
            [],
            state.global.macros,
            state.global.viewingMacros,
            null
        )
    } catch (e) {
        if (e instanceof Undo) {
            const macros = e.macros ?? state.global.macros
            const viewingMacros = e.viewingMacros ?? state.global.viewingMacros
            state.updateGlobal({ macros, viewingMacros })
            return
        }
        if (e instanceof Redo) return
        throw e
    }

    state.updateGlobal({
        macros: replayResult.macros ?? state.global.macros,
        viewingMacros: replayResult.viewingMacros ?? state.global.viewingMacros
    })

    const newBufferAfterCourse = await computeReplayBufferAfterCourse(replayData, replayResult.score)
    const updatedReplayData: StageReplayData = {
        ...replayData,
        score: replayResult.score,
        history: [...replayResult.history],
        potionsRemaining: [...replayResult.potionsRemaining],
        bufferAfterCourse: newBufferAfterCourse
    }
    const bufferAdjustment = newBufferAfterCourse - replayData.bufferAfterCourse
    const usedPotions = usedPotionNames(replayData.spec.potions, replayResult.potionsRemaining)
    applyReplayResultToAllSnapshots(state, stage, updatedReplayData, bufferAdjustment)
    state.update({
        timeline: [...state.data.timeline, {
            kind: 'stage',
            stage,
            challenge: challengeSummary(updatedReplayData.challenge),
            score: replayResult.score,
            par: updatedReplayData.par,
            usedPotions
        }]
    })
    state.ui.updateBuffer(state)
}

function materializePath(state: MetaState, path: Path): Pick<MetaStateData, 'challenges' | 'rewardStates'> {
    // Materialize rewards only when the path is actually selected.
    const rewardStates = path.rewardStates.map(rs => {
        if (rs.kind === 'encounter' && rs.encounter === null) {
            const generator = state.generator(`encounter`).newGenerator()
            return getEncounterState(state, generator, state.data.stage)
        } else if (rs.kind === 'card' && rs.options.length === 0) {
            const generator = state.generator(`rewardscard`).newGenerator()
            return {
                kind: 'card' as const,
                options: sampleRewardOptionsByBaseName(
                    generator,
                    cardRewards,
                    getRewardOptionCount(state),
                    state.data.collectedCards
                ),
                selectedIndex: null
            }
        } else if (rs.kind === 'event' && rs.options.length === 0) {
            const generator = state.generator(`rewardsevent`).newGenerator()
            return {
                kind: 'event' as const,
                options: sampleRewardOptionsByBaseName(
                    generator,
                    eventRewards,
                    getRewardOptionCount(state),
                    state.data.collectedEvents
                ),
                selectedIndex: null
            }
        } else if (rs.kind === 'potion' && rs.options.length === 0) {
            const generator = state.generator(`rewardspotion`).newGenerator()
            return {
                kind: 'potion' as const,
                options: generator.samples(potionRewards, getRewardOptionCount(state)),
                selectedIndex: null
            }
        } else if (rs.kind === 'relic' && rs.options.length === 0) {
            const generator = state.generator(`rewardsrelic`).newGenerator()
            return {
                kind: 'relic' as const,
                options: generator.samples(relicRewards, getRewardOptionCount(state)),
                selectedIndex: null
            }
        }
        return rs
    })
    return { challenges: path.challenges, rewardStates }
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
export async function playGame(
    ui: MetaUI,
    test:null|TestSpec = null,
    seed: string | null = null,
    initialSnapshot: SerializedMetaGame | null = null,
    onStateChange: ((snapshot: SerializedMetaGame) => void) | null = null
): Promise<void> {
    const state: MetaState = initialSnapshot
        ? deserializeMetaGame(ui, initialSnapshot, null)
        : new MetaState(ui, seed, null)
    state.setChangeListener(onStateChange ? () => onStateChange!(serializeMetaGame(state)) : null)

    if (!initialSnapshot) {
        // Stage 0 offers two challenge options
        const initialPath = pathFromSkeleton({
            rewards: ['card', 'card', 'event', 'potion'] as RewardKind[],
            challenges: [randomChallenge(state), randomChallenge(state)]
        })
        if (test !== null) initialPath.rewardStates.push(makeTestReward(state, test));
        state.replaceAndClearHistory({
            ...materializePath(state, initialPath),
            phase: 'stage_select',
            availablePaths: [],
        })
    } else if (onStateChange) {
        onStateChange(serializeMetaGame(state))
    }
    state.ui.updateBuffer(state)
    while (true) {
        try {
            if (state.data.phase === 'in_game') {
                const sameReplay = (a: number[], b: number[]): boolean =>
                    a.length === b.length && a.every((value, index) => value === b[index])
                const stage = state.data.stage
                // challenges[0] is the selected challenge (set when user clicks a challenge button)
                const gameSpec = makeSpec(state, state.data.challenges[0])
                const startingBuffer = state.data.buffer
                // Pass saved game state for replay (from previous redo)
                const { score, potionsRemaining, history, macros, viewingMacros } = await state.ui.playGame(
                    gameSpec,
                    state.data.gameHistory,
                    state.data.gameRedo,
                    state.global.macros,
                    state.global.viewingMacros,
                    progress => {
                        if (!sameReplay(state.data.gameHistory, progress.history) || !sameReplay(state.data.gameRedo, progress.redo)) {
                            state.update({
                                gameHistory: [...progress.history],
                                gameRedo: [...progress.redo],
                            })
                        }
                        state.updateGlobal({
                            macros: progress.macros,
                            viewingMacros: progress.viewingMacros
                        })
                    }
                )
                const usedPotions = usedPotionNames(gameSpec.potions, potionsRemaining)
                const persistedMacros = macros ?? state.global.macros
                const persistedViewingMacros = viewingMacros ?? state.global.viewingMacros
                state.updateGlobal({
                    macros: persistedMacros,
                    viewingMacros: persistedViewingMacros
                })
                // Clear saved game state after successful completion
                state.update({
                    potions: potionsRemaining,
                    gameHistory: [],
                    gameRedo: [],
                })
                await endCourse(score, gameSpec.par, state)
                const stageReplays = [...state.data.stageReplays]
                stageReplays[stage] = {
                    stage,
                    challenge: {
                        ...state.data.challenges[0],
                        boons: [...state.data.challenges[0].boons]
                    },
                    spec: cloneGameSpec(gameSpec),
                    score,
                    par: gameSpec.par,
                    history: [...history],
                    potionsRemaining: [...potionsRemaining],
                    bufferBeforeCourse: startingBuffer,
                    bufferAfterCourse: state.data.buffer
                }
                state.update({
                    stageReplays,
                    timeline: [...state.data.timeline, {
                        kind: 'stage',
                        stage,
                        challenge: challengeSummary(state.data.challenges[0]),
                        score,
                        par: gameSpec.par,
                        usedPotions
                    }]
                })
                const nextStage = state.data.stage + 1
                state.update({ stage: nextStage })
                if (nextStage >= TOTAL_STAGES) {
                    state.update({ phase: 'game_over' })
                    // Game over - player has completed all stages
                    await state.ui.showMessage(state, 'Congratulations! You have completed all stages!')
                    return
                }
                const paths = (await makePaths(state)).map(skel => pathFromSkeleton(skel))
                state.replaceAndClearHistory({
                    phase: 'path_select',
                    challenges: [],
                    rewardStates: [],
                    availablePaths: paths,
                })
            } else if (state.data.phase === 'path_select') {
                const paths = state.data.availablePaths
                if (paths.length === 0) {
                    throw new Error('Invariant violation: path_select phase missing available paths')
                }
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
                state.replaceAndClearHistory({
                    ...materializePath(state, path),
                    phase: 'stage_select',
                    availablePaths: [],
                })
            } else if (state.data.phase === 'stage_select') {
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
                state.update({ challenges: [selectedChallenge], availablePaths: [] })
                await trigger({kind: 'start', stage: state.data.stage}, state)
                state.updateAndSetCheckpoint({
                    phase: 'in_game',
                    gameHistory: [],
                    gameRedo: [],
                })
            } else {
                return
            }
        } catch (e) {
            if (e instanceof Undo) {
                const persistedMacros = e.macros ?? state.global.macros
                const persistedViewingMacros = e.viewingMacros ?? state.global.viewingMacros
                state.updateGlobal({
                    macros: persistedMacros,
                    viewingMacros: persistedViewingMacros
                })
                // Pass game state to undo so it's saved in the redo checkpoint
                state.undo({
                    gameHistory: e.gameHistory,
                    gameRedo: e.gameRedo,
                })
            } else if (e instanceof Redo) {
                state.redo()
            } else {
                throw e
            }
        }
    }
}
