// metaLogic.ts - Meta-game state and transformations
// This handles the roguelike progression layer on top of the core game.

import { CardSpec, Card, State, vpModes,
    TypedTrigger, TypedReplacer,
    CardUpgrade,
    Boon, VPMode,
    boons,
    PlaceName,
    Token,
    cardRewards, eventRewards, potionRewards, relicRewards,
    coinKey, energyEventKey, displayName,
    VictoryData,
    Replayable
 } from './gameLogic.js'
import type { GameSpec, Rule } from './gameLogic.js'
import { getSpecByName } from './registry.js'

import { buildSpecTooltip } from './cardRendering.js'
import { makeBottledCardPotion, makeBottledEventPotion, makeCardInABoxRelic } from './data/specialSpecs.js'
import { allMajorCurses, allMinorCurses, Curse } from './data/curses.js'

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
        onProgress?: ((progress: ActiveGameProgress) => void) | null,
        undoAtBeginning?: 'leave' | 'nothing'
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
    bufferDelta?: number      // Buffer gained/lost when this option is picked
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

export interface BurdenOptionState {
    id: string
    title: string
    description?: string
    spec: CardSpec | null
    data: unknown
}

export interface BurdenState {
    options: BurdenOptionState[]
    selectedIndex: number | null
    selectedIndices: number[]
    numPicked: number
}

export interface BurdenDefinition {
    id: string
    title: string
    description?: string
    rules?: Rule[]
    weight: number
    minStage: number
    maxStage: number
    applies: (state: MetaState) => boolean
    createOption: (state: MetaState, generator: Generator) => BurdenOptionState
    resolveTransform: (option: BurdenOptionState, state: MetaState, skipped: string[]) => Promise<MetaTransform | null> | MetaTransform | null
}

export type ExtraOptionID = string

export interface ExtraOptionRender {
    label: string
    description?: string
    tooltipSpec?: CardSpec
    compact?: boolean
    transform: MetaTransform
}

export interface ExtraOptionDefinition {
    id: ExtraOptionID
    selectionMarker: number
    render: (rewardState: SimpleRewardState, state: MetaState) => ExtraOptionRender
}

const extraOptionRegistry = new Map<ExtraOptionID, ExtraOptionDefinition>()
const extraOptionSelectionRegistry = new Map<number, ExtraOptionDefinition>()

export function registerExtraOption(definition: ExtraOptionDefinition): void {
    if (extraOptionRegistry.has(definition.id)) {
        throw new Error(`Duplicate extra option id "${definition.id}"`)
    }
    if (extraOptionSelectionRegistry.has(definition.selectionMarker)) {
        throw new Error(`Duplicate extra option marker "${definition.selectionMarker}"`)
    }
    extraOptionRegistry.set(definition.id, definition)
    extraOptionSelectionRegistry.set(definition.selectionMarker, definition)
}

function getRegisteredExtraOptions(): ExtraOptionDefinition[] {
    return [...extraOptionRegistry.values()]
}

function extraOptionBySelectionMarker(marker: number): ExtraOptionDefinition | null {
    return extraOptionSelectionRegistry.get(marker) ?? null
}

function encounterRewardCompleted(rewardState: EncounterRewardState): boolean {
    const data = rewardState.data as Record<string, unknown> | null
    if (data && typeof data === 'object') {
        if ('selectedIndex' in data) return data.selectedIndex !== null
        if ('finished' in data) return data.finished === true
    }
    return false
}

function relicGainRequirementSatisfied(relic: RelicSpec, state: MetaState): boolean {
    return relic.gainRequirement ? relic.gainRequirement(state) : true
}

function enabledExtraOptions(state: MetaState): Set<ExtraOptionID> {
    const allowed = new Set<ExtraOptionID>(extraOptionRegistry.keys())
    const params = applyMetaReplacers({ kind: 'extraOptions', options: [] as ExtraOptionID[] }, state)
    return new Set(params.options.filter(option => allowed.has(option)))
}

// Get options for a simple reward
function getSimpleRewardOptions(state: SimpleRewardState, metaState: MetaState): RewardOption[] {
    const options = state.options as Array<CardSpec | RelicSpec>
    const rewardParams = applyMetaReplacers({
        kind: 'reward',
        optionCount: options.length,
        pickBufferAdjustments: [],
        rewardKind: state.kind
    }, metaState)
    return options.map((option: CardSpec | RelicSpec, i: number) => ({
        label: displayName(option as CardSpec),
        spec: option as CardSpec,
        disabled: state.selectedIndex !== null
            || (state.kind === 'relic' && !relicGainRequirementSatisfied(option as RelicSpec, metaState)),
        checked: state.selectedIndex === i,
        bufferDelta: rewardParams.pickBufferAdjustments[i] ?? 0,
        onClick: async () => {
            const skipped = options
                .filter((_, optionIndex) => optionIndex !== i)
                .map(spec => displayName(spec as CardSpec))
            const transform =
                state.kind === 'card' ? gainCard(option as CardSpec, { skipped }) :
                state.kind === 'event' ? gainEvent(option as CardSpec, { skipped }) :
                state.kind === 'potion' ? gainPotion(option as CardSpec, { skipped }) :
                gainRelic(option as RelicSpec, { skipped })
            const pickBufferAdjustment = rewardParams.pickBufferAdjustments[i] ?? 0
            return {
                newData: { ...state, selectedIndex: i },
                transform: pickBufferAdjustment === 0
                    ? transform
                    : compose(transform, addBuffer(pickBufferAdjustment))
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

    if (rewardState.kind !== 'encounter') {
        const enabledIDs = enabledExtraOptions(metaState)
        const selectedExtraOption = rewardState.selectedIndex === null
            ? null
            : extraOptionBySelectionMarker(rewardState.selectedIndex)
        if (selectedExtraOption !== null) enabledIDs.add(selectedExtraOption.id)

        for (const definition of getRegisteredExtraOptions()) {
            if (!enabledIDs.has(definition.id)) continue
            const rendered = definition.render(rewardState, metaState)
            baseOptions.push({
                label: rendered.label,
                description: rendered.description,
                tooltipSpec: rendered.tooltipSpec,
                compact: rendered.compact,
                disabled: alreadySelected,
                checked: rewardState.selectedIndex === definition.selectionMarker,
                onClick: async () => {
                    return {
                        newData: { ...rewardState, selectedIndex: definition.selectionMarker },
                        transform: rendered.transform
                    }
                }
            })
        }
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

function burdenDefinitionById(id: string): BurdenDefinition | null {
    return burdenRegistry.find(definition => definition.id === id) ?? null
}

export function getRegisteredBurdenIds(): string[] {
    return burdenRegistry.map(definition => definition.id)
}

export function isBurdenResolved(burdenState: BurdenState): boolean {
    return burdenState.selectedIndices.length >= burdenState.numPicked
}

export function getBurdenOptions(burdenState: BurdenState, metaState: MetaState): RewardOption[] {
    return burdenState.options.map((option, index) => {
        const definition = burdenDefinitionById(option.id)
        if (!definition) {
            throw new Error(`Unknown burden option "${option.id}"`)
        }
        const applicable = definition.applies(metaState)
        const ruleLines = (definition.rules || []).flatMap(rule => {
            const lines: string[] = []
            for (const trigger of (rule.triggers || [])) {
                lines.push(...(trigger.simpleText ?? trigger.text))
            }
            for (const replacer of (rule.replacers || [])) {
                lines.push(...(replacer.simpleText ?? replacer.text))
            }
            return lines
        })
        const baseDescription = option.description || ''
        const descriptionLines = baseDescription.length > 0
            ? [baseDescription, ...ruleLines]
            : ruleLines
        const resolved = isBurdenResolved(burdenState)
        const alreadyPicked = burdenState.selectedIndices.includes(index)
        return {
            label: option.title,
            description: descriptionLines.join('\n'),
            spec: option.spec ?? undefined,
            disabled: resolved || alreadyPicked || !applicable,
            checked: alreadyPicked,
            onClick: async () => {
                if (!definition.applies(metaState)) {
                    return { newData: burdenState }
                }
                const selectedIndices = [...burdenState.selectedIndices, index]
                const isFinalPick = selectedIndices.length >= burdenState.numPicked
                const skipped = isFinalPick
                    ? burdenState.options.filter((_, i) => !selectedIndices.includes(i)).map(o => o.title)
                    : []
                const transform = await definition.resolveTransform(option, metaState, skipped)
                if (!transform) {
                    return {
                        newData: burdenState,
                    }
                }
                return {
                    newData: {
                        ...burdenState,
                        selectedIndex: selectedIndices[0] ?? null,
                        selectedIndices
                    },
                    transform
                }
            }
        }
    })
}

export function updateBurdenState(burdenState: BurdenState, newData: unknown): BurdenState {
    return newData as BurdenState
}

// Encounter and burden registration with stage constraints
interface EncounterRegistration {
    encounter: Encounter
    minStage: number
    maxStage: number
}

const encounterRegistry: EncounterRegistration[] = []
const encounterUpgradeRegistry = new Map<string, CardUpgrade>()
const burdenRegistry: BurdenDefinition[] = []

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

export function registerEncounterUpgrade(id: string, upgrade: CardUpgrade): void {
    encounterUpgradeRegistry.set(id, upgrade)
}

export function getEncounterUpgradeById(id: string): CardUpgrade | null {
    return encounterUpgradeRegistry.get(id) || null
}

export function registerBurden(definition: Omit<BurdenDefinition, 'weight' | 'minStage' | 'maxStage' | 'applies' | 'createOption'> & {
    weight?: number
    minStage?: number
    maxStage?: number
    applies?: (state: MetaState) => boolean
    createOption?: (state: MetaState, generator: Generator) => BurdenOptionState
}): void {
    burdenRegistry.push({
        ...definition,
        weight: definition.weight ?? 1,
        minStage: definition.minStage ?? 0,
        maxStage: definition.maxStage ?? (TOTAL_STAGES - 1),
        applies: definition.applies ?? (() => true),
        createOption: definition.createOption ?? ((state, _generator) => ({
            id: definition.id,
            title: definition.title,
            description: definition.description,
            spec: null,
            data: null,
        })),
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
export const MINOR_CURSE_STAGE = 3
export const MAJOR_CURSE_STAGE = 6

// Base par values for each stage
export const BASE_PARS: number[] = [26, 24, 22, 20, 18, 16, 14, 4]

// ----------------------------- Meta-game Types

// This defines a challenge. It will be combined with the user's deck, and then acted on by relics, to get a spec.
export interface ChallengeSpec {
    stage: number,
    vpMode: VPMode,
    boons: Boon[],
    curse?: Curse | null,
}

function displayCurseName(curse: Curse): string {
    return curse.name.replace(/ \(Major\)$/, '')
}

export function renderChallenge(spec: ChallengeSpec, state: MetaState): string {
    const gameSpec:GameSpec = makeSpec(state, spec)
    const label = `${challengeSummaryWithState(spec, state)} (${gameSpec.vp}vp in ${gameSpec.par}@)`
    const stageCurse = selectedCurseForChallenge(spec, state)

    // Build tooltip with all related cards from VP mode and boons
    const relatedCards: CardSpec[] = [
        ...spec.vpMode.cards,
        ...spec.vpMode.events,
        ...(stageCurse ? stageCurse.events : []),
        ...spec.boons.flatMap(b => [...b.cards, ...b.events])
    ]
    const tooltipParts: string[] = []
    if (relatedCards.length > 0) {
        tooltipParts.push(relatedCards.map(buildSpecTooltip).join(''))
    }
    if (tooltipParts.length === 0) return label
    const tooltipContent = tooltipParts.join('')
    return `${label}<span class='tooltip'>${tooltipContent}</span>`
}

export function challengeSummary(challenge: ChallengeSpec): string {
    const parts = [challenge.vpMode.name, ...challenge.boons.map(boon => boon.name)]
    if (challenge.curse !== undefined && challenge.curse !== null) {
        parts.push(displayCurseName(challenge.curse))
    }
    return parts.join(' + ')
}

export function challengeSummaryWithState(challenge: ChallengeSpec, state: MetaState): string {
    const parts = [challenge.vpMode.name, ...challenge.boons.map(boon => boon.name)]
    const stageCurse = selectedCurseForChallenge(challenge, state)
    if (stageCurse !== null) {
        parts.push(displayCurseName(stageCurse))
    }
    return parts.join(' + ')
}

// Meta replacer types - modify game setup parameters
export interface GameSetupParams {
    kind: 'gameSetup'
    par: number
    vpGoal: number
    cardSpecs: CardSpec[]
    eventSpecs: CardSpec[]
}

export interface RelicSpec extends CardSpec {
    minStage?: number
    maxStage?: number
    burden?: boolean
    gainRequirement?: (state: MetaState) => boolean
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
    ){
        super(spec, id, ticks, tokens, place)
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
        )
    }
}

export interface RewardParams {
    kind: 'reward'
    optionCount: number
    pickBufferAdjustments: number[]
    rewardKind?: RewardKind
}

export interface ExtraOptionsParams {
    kind: 'extraOptions'
    options: ExtraOptionID[]
}

export type PathOnSelectEffect = {
    kind: 'spendRelicCharge'
    relicID: number
    amount: number
}

export interface PathOptionSpec {
    label: string
    onSelectEffects?: PathOnSelectEffect[]
}

export interface PathRewardParams {
    kind: 'pathRewards'
    rewardsPerPath: number
    paths: Array<string | PathOptionSpec>
    numBurdens: number
}

export interface BurdenParams {
    kind: 'burden'
    numOptions: number
    numPicked: number
}

export type MetaParams = GameSetupParams | RewardParams | ExtraOptionsParams | PathRewardParams | BurdenParams

export interface TypedMetaReplacer<T extends MetaParams> {
    kind: T['kind']
    text: string[]
    simpleText?: string[]
    replace: (params: T, state: MetaState, self: Relic) => T
}

// TODO: render relics appropriately when you hold shift etc.
export type MetaReplacer =
    | TypedMetaReplacer<GameSetupParams>
    | TypedMetaReplacer<RewardParams>
    | TypedMetaReplacer<ExtraOptionsParams>
    | TypedMetaReplacer<PathRewardParams>
    | TypedMetaReplacer<BurdenParams>

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
    baseNumBurdens: number
    numBurdens: number
}

export interface GainRelicEvent {
    kind: 'relic'
    relic: Relic
}

export interface LoseRelicEvent {
    kind: 'loseRelic'
    relic: Relic
}

export interface GainPotionEvent {
    kind: 'potion'
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

export interface BurdenGenerationEvent {
    kind: 'burdenGeneration'
}

export type MetaGameEvent = CourseEndEvent | CourseStartEvent | PathGenerationEvent | GainRelicEvent | LoseRelicEvent | GainPotionEvent | GainCardEvent | GainEventEvent | BurdenGenerationEvent

export interface MetaTrigger<T extends MetaGameEvent> {
    kind: T['kind'];
    text: string[];
    simpleText?: string[];
    handles: (e:T, s:MetaState, self:Relic) => boolean;
    transform: (e:T, s:MetaState, self:Relic) => MetaTransform;
}

// Meta trigger types - now return MetaTransform instead of just a result
export type TypedMetaTrigger =
    | MetaTrigger<CourseEndEvent>
    | MetaTrigger<CourseStartEvent>
    | MetaTrigger<PathGenerationEvent>
    | MetaTrigger<GainRelicEvent>
    | MetaTrigger<LoseRelicEvent>
    | MetaTrigger<GainPotionEvent>
    | MetaTrigger<GainCardEvent>
    | MetaTrigger<GainEventEvent>
    | MetaTrigger<BurdenGenerationEvent>

// ----------------------------- State Types


// A path the player can choose (contains rewards + kingdom)
export interface Path {
    label: string
    onSelectEffects?: PathOnSelectEffect[]
    rewardStates: RewardState[]
    burdenStates: BurdenState[]
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
        skipped?: string[]
        details?: string
    }

function normalizeTimelineEntries(timeline: MetaTimelineEntry[]): MetaTimelineEntry[] {
    const result: MetaTimelineEntry[] = []
    const firstStageRowIndex = new Map<number, number>()
    for (const entry of timeline) {
        if (entry.kind !== 'stage') {
            result.push(entry)
            continue
        }
        const existing = firstStageRowIndex.get(entry.stage)
        if (existing === undefined) {
            firstStageRowIndex.set(entry.stage, result.length)
            result.push(entry)
        } else {
            result[existing] = entry
        }
    }
    return result
}

function upsertStageTimelineEntry(timeline: MetaTimelineEntry[], entry: Extract<MetaTimelineEntry, { kind: 'stage' }>): MetaTimelineEntry[] {
    const normalized = normalizeTimelineEntries(timeline)
    const existingIndex = normalized.findIndex(t => t.kind === 'stage' && t.stage === entry.stage)
    if (existingIndex < 0) return [...normalized, entry]
    const updated = [...normalized]
    updated[existingIndex] = entry
    return updated
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
    burdenStates: BurdenState[]

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

interface MetaStateOptions {
    debugEnabled?: boolean
    burdensEnabled?: boolean
    scarcityEnabled?: boolean
    cursesEnabled?: boolean
}

export class MetaState {

    public checkpoint: MetaStateData
    public redoStack: MetaStateData[] = []
    public undoStack: MetaStateData[] = []
    public readonly seed: string
    public readonly debugEnabled: boolean
    public readonly burdensEnabled: boolean
    public readonly scarcityEnabled: boolean
    public readonly cursesEnabled: boolean
    public masterGenerator: Generator
    public generators: Map<string, Generator> = new Map()
    public data: MetaStateData
    public global: MetaGlobalState
    private onChange: (() => void) | null

    constructor(
        public readonly ui: MetaUI,
        seed: null | string = null,
        onChange: (() => void) | null = null,
        options: MetaStateOptions = {},
    ) {
        this.onChange = onChange
        this.debugEnabled = options.debugEnabled ?? false
        this.burdensEnabled = options.burdensEnabled ?? false
        this.scarcityEnabled = options.scarcityEnabled ?? false
        this.cursesEnabled = options.cursesEnabled ?? false
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
            burdenStates: [] as BurdenState[],
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
    }

interface SerializedCard {
    kind: 'card' | 'relic'
    id: number
    spec: SerializedSpecRef
    ticks: number[]
    tokens: [Token, number][]
    place: PlaceName
    notedCards?: SerializedSpecRef[]
}

interface SerializedSimpleRewardState {
    kind: 'card' | 'event' | 'potion' | 'relic'
    options: SerializedSpecRef[]
    selectedIndex: number | null
}

interface SerializedBurdenOptionState {
    id: string
    title: string
    description?: string
    spec: unknown
    data: unknown
}

interface SerializedBurdenState {
    options: SerializedBurdenOptionState[]
    selectedIndex: number | null
    selectedIndices?: number[]
    numPicked?: number
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
    curseName?: string
}

interface SerializedPath {
    label?: string
    onSelectEffects?: PathOnSelectEffect[]
    rewardStates: SerializedRewardState[]
    burdenStates?: SerializedBurdenState[]
    challenges: SerializedChallengeSpec[]
}

interface SerializedGameSpec {
    vp: number
    par: number
    buffer?: number
    cards: SerializedSpecRef[]
    events: SerializedSpecRef[]
    potions: SerializedCard[]
    relics: SerializedCard[]
    metaStage?: number
    metaStageScores?: (number | null)[]
    metaStagePars?: (number | null)[]
    metaStageTooltips?: (string | null)[]
    metaCursesEnabled?: boolean
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
    burdenStates?: SerializedBurdenState[]
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
    debugEnabled?: boolean
    burdensEnabled?: boolean
    scarcityEnabled?: boolean
    cursesEnabled?: boolean
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
    if (data.phase !== 'stage_select' && data.burdenStates.length > 0) {
        throw new Error(`Invariant violation (${context}): burden selections only allowed in stage_select`)
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
            value: serializeSpec(value, 'card')
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

function findBaseSpec(name: string): CardSpec {
    const spec = getSpecByName(name)
    if (spec) return spec
    if (name.startsWith('Frozen ')) {
        const frozenRelic = getSpecByName('Frozen Relic')
        if (frozenRelic) return { ...frozenRelic, name }
    }
    throw new Error(`Unable to resolve spec "${name}"`)
}

function serializeSpec(spec: CardSpec, categoryHint: SerializedSpecCategory): SerializedSpecRef {
    if (spec.persistence) {
        const base = spec.relatedCards?.[0]
        if (!base) {
            throw new Error(`Dynamic spec "${spec.name}" is missing related base card`)
        }
        const baseCategory: SerializedSpecCategory =
            spec.persistence.kind === 'bottledEventPotion'
                ? 'event'
                : 'card'
        return {
            type: 'dynamic',
            dynamicKind: spec.persistence.kind,
            base: serializeSpec(base, baseCategory),
        }
    }

    const upgradeIDs = (spec.upgrades || []).map(upgrade => upgrade.id)
    if (upgradeIDs.some(id => id === undefined)) {
        throw new Error(`Spec "${spec.name}" has non-serializable upgrades`)
    }
    return {
        type: 'base',
        category: categoryHint,
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
        const base = findBaseSpec(spec.name)
        return applyUpgrades(base, spec.upgradeIDs)
    }
    const base = deserializeSpec(spec.base)
    switch (spec.dynamicKind) {
        case 'cardInABoxRelic':
            return makeCardInABoxRelic(base)
        case 'bottledCardPotion':
            return makeBottledCardPotion(base)
        case 'bottledEventPotion':
            return makeBottledEventPotion(base)
        default:
            throw new Error(`Unknown dynamic spec kind`)
    }
}

function serializeCard(card: Card): SerializedCard {
    const specCategory: SerializedSpecCategory = card instanceof Relic
        ? 'relic'
        : card.spec.isPotion ? 'potion' : 'card'
    const common = {
        id: card.id,
        spec: serializeSpec(card.spec, specCategory),
        ticks: [...card.ticks],
        tokens: [...card.tokens.entries()],
        place: card.place,
    }
    if (card instanceof Relic) {
        return {
            kind: 'relic',
            ...common,
            notedCards: (card.notedCards || []).map(spec => serializeSpec(spec, 'card')),
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
        return new Relic(spec as RelicSpec, card.id, notedCards, card.ticks, tokens, card.place)
    }
    return new Card(spec, card.id, card.ticks, tokens, card.place)
}

function serializeChallenge(challenge: ChallengeSpec): SerializedChallengeSpec {
    return {
        stage: challenge.stage,
        vpModeName: challenge.vpMode.name,
        boonNames: challenge.boons.map(boon => boon.name),
        curseName: challenge.curse?.name
    }
}

function findCurseByName(name: string): Curse | null {
    return [...allMinorCurses(), ...allMajorCurses()].find(c => c.name === name) ?? null
}

function deserializeChallenge(challenge: SerializedChallengeSpec): ChallengeSpec {
    const vpMode = vpModes.find(mode => mode.name === challenge.vpModeName)
    if (!vpMode) throw new Error(`Unknown vp mode "${challenge.vpModeName}"`)
    const resolvedBoons = challenge.boonNames.map(name => {
        const boon = boons.find(candidate => candidate.name === name)
        if (!boon) throw new Error(`Unknown boon "${name}"`)
        return boon
    })
    const curse = challenge.curseName === undefined
        ? null
        : findCurseByName(challenge.curseName)
    return {
        stage: challenge.stage,
        vpMode,
        boons: resolvedBoons,
        curse
    }
}

function serializePath(path: Path): SerializedPath {
    return {
        label: path.label,
        onSelectEffects: path.onSelectEffects ? path.onSelectEffects.map(effect => ({ ...effect })) : undefined,
        rewardStates: path.rewardStates.map(serializeRewardState),
        burdenStates: path.burdenStates.map(serializeBurdenState),
        challenges: path.challenges.map(serializeChallenge)
    }
}

function deserializePath(path: SerializedPath): Path {
    return {
        label: path.label ?? 'Path',
        onSelectEffects: (path.onSelectEffects || []).map(effect => ({ ...effect })),
        rewardStates: path.rewardStates.map(deserializeRewardState),
        burdenStates: (path.burdenStates || []).map(deserializeBurdenState),
        challenges: path.challenges.map(deserializeChallenge)
    }
}

function serializeBurdenState(burdenState: BurdenState): SerializedBurdenState {
    return {
        selectedIndex: burdenState.selectedIndices[0] ?? null,
        selectedIndices: [...burdenState.selectedIndices],
        numPicked: burdenState.numPicked,
        options: burdenState.options.map(option => ({
            id: option.id,
            title: option.title,
            description: option.description,
            spec: encodeUnknown(option.spec),
            data: encodeUnknown(option.data)
        }))
    }
}

function deserializeBurdenState(burdenState: SerializedBurdenState): BurdenState {
    const selectedIndices = burdenState.selectedIndices !== undefined
        ? [...burdenState.selectedIndices]
        : (burdenState.selectedIndex === null ? [] : [burdenState.selectedIndex])
    const numPicked = Math.max(1, burdenState.numPicked ?? 1)
    return {
        selectedIndex: selectedIndices[0] ?? null,
        selectedIndices,
        numPicked,
        options: burdenState.options.map(option => ({
            id: option.id,
            title: option.title,
            description: option.description,
            spec: decodeUnknown(option.spec) as CardSpec | null,
            data: decodeUnknown(option.data)
        }))
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
        buffer: spec.buffer,
        cards: spec.cards.map(card => serializeSpec(card, 'card')),
        events: spec.events.map(event => serializeSpec(event, 'event')),
        potions: spec.potions.map(potion => serializeCard(potion)),
        relics: spec.relics.map(relic => serializeCard(relic)),
        metaStage: spec.metaStage,
        metaStageScores: spec.metaStageScores ? [...spec.metaStageScores] : undefined,
        metaStagePars: spec.metaStagePars ? [...spec.metaStagePars] : undefined,
        metaStageTooltips: spec.metaStageTooltips ? [...spec.metaStageTooltips] : undefined,
        metaCursesEnabled: spec.metaCursesEnabled,
        previousScore: spec.previousScore,
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined,
        replayStage: spec.replayStage
    }
}

function deserializeGameSpec(spec: SerializedGameSpec): GameSpec {
    return {
        vp: spec.vp,
        par: spec.par,
        buffer: spec.buffer,
        cards: spec.cards.map(card => deserializeSpec(card)),
        events: spec.events.map(event => deserializeSpec(event)),
        potions: spec.potions.map(card => deserializeCard(card)),
        relics: spec.relics.map(card => deserializeCard(card)),
        metaStage: spec.metaStage,
        metaStageScores: spec.metaStageScores ? [...spec.metaStageScores] : undefined,
        metaStagePars: spec.metaStagePars ? [...spec.metaStagePars] : undefined,
        metaStageTooltips: spec.metaStageTooltips ? [...spec.metaStageTooltips] : undefined,
        metaCursesEnabled: spec.metaCursesEnabled,
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
        burdenStates: data.burdenStates.map(serializeBurdenState),
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
        burdenStates: (data.burdenStates || []).map(deserializeBurdenState),
        collectedCards: data.collectedCards.map(card => deserializeSpec(card)),
        collectedEvents: data.collectedEvents.map(event => deserializeSpec(event)),
        potions: data.potions.map(card => deserializeCard(card)),
        relics: data.relics.map(card => deserializeCard(card) as Relic),
        nextID: data.nextID,
        timeline: normalizeTimelineEntries((data.timeline || []).map(entry => ({ ...entry }))),
        gameHistory: [...data.gameHistory],
        gameRedo: [...data.gameRedo],
    }
    if (!data.timeline) {
        result.timeline = normalizeTimelineEntries(result.stageReplays.flatMap(stageReplay => {
            if (stageReplay === null) return []
            return [{
                kind: 'stage' as const,
                stage: stageReplay.stage,
                challenge: challengeSummary(stageReplay.challenge),
                score: stageReplay.score,
                par: stageReplay.par,
                usedPotions: usedPotionNames(stageReplay.spec.potions, stageReplay.potionsRemaining),
            }]
        }))
    }
    validateMetaStateData(result, 'deserialize')
    return result
}

export function serializeMetaGame(state: MetaState): SerializedMetaGame {
    return {
        version: 1,
        seed: state.seed,
        debugEnabled: state.debugEnabled,
        burdensEnabled: state.burdensEnabled,
        scarcityEnabled: state.scarcityEnabled,
        cursesEnabled: state.cursesEnabled,
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
    const debugEnabled = serialized.debugEnabled ?? false
    const burdensEnabled = serialized.burdensEnabled ?? false
    const scarcityEnabled = serialized.scarcityEnabled ?? false
    const cursesEnabled = serialized.cursesEnabled ?? false
    const state = new MetaState(ui, serialized.seed, onChange, { debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled })
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

export function addTimelineAction(action: string, details?: string, skipped?: string[]): MetaTransform {
    return async function(state: MetaState) {
        state.update({
            timeline: [...state.data.timeline, {
                kind: 'action',
                stage: state.data.stage,
                action,
                skipped,
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
        await trigger({kind: 'event', event: event}, state)
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
        await trigger({kind: 'potion', potion: potionCard}, state)
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

export function gainNotedRelic(
    relic: RelicSpec,
    notedCards: CardSpec[],
    timelineDetails: GainTimelineDetails = {}
): MetaTransform {
    return async function(state: MetaState) {
        const nextID = state.data.nextID
        const relicCard:Relic = new Relic(relic, nextID, notedCards)
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

export async function removeRelic(state: MetaState, id: number) {
    const relic = state.data.relics.find(r => r.id === id)
    if (!relic) return
    await trigger({ kind: 'loseRelic', relic }, state)
    state.removeRelic(id)
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

export function updateBurdenAtIndex(state: MetaState, index: number, newBurdenState: BurdenState) {
    const burdenStates = [...state.data.burdenStates]
    if (index >= 0 && index < burdenStates.length) {
        burdenStates[index] = newBurdenState
    }
    state.update({ burdenStates })
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

export function applyMetaReplacers<T extends MetaParams>(
    params: T,
    state: MetaState,
): T {
    for (const relic of state.data.relics) {
        const metaReplacers = relic.metaReplacers() as MetaReplacer[]
        for (const rawReplacer of metaReplacers) {
            if (rawReplacer.kind !== params.kind) continue
            const replacer = rawReplacer as unknown as TypedMetaReplacer<T>
            params = replacer.replace(params, state, relic)
        }
    }
    return params
}

function signedAmount(amount: number): string {
    return amount > 0 ? `+${amount}` : `${amount}`
}

function scarcityParAdjustment(stage: number, state: MetaState): number {
    return state.scarcityEnabled && stage < TOTAL_STAGES - 1 ? -1 : 0
}

type CurseLevel = 'minor' | 'major'

function stageCurseLevel(stage: number, state: MetaState): CurseLevel | null {
    if (!state.cursesEnabled) return null
    if (stage === MINOR_CURSE_STAGE) return 'minor'
    if (stage === MAJOR_CURSE_STAGE) return 'major'
    return null
}

function sampledCurseForStage(stage: number, state: MetaState): Curse | null {
    const level = stageCurseLevel(stage, state)
    if (level === null) return null
    const pool = level === 'minor' ? allMinorCurses() : allMajorCurses()
    if (pool.length === 0) {
        throw new Error(`No ${level} curses registered`)
    }
    const generator = new Generator(`${state.seed}-CURSE-${stage + 1}-${level.toUpperCase()}`)
    return generator.sample(pool)
}

function selectedCurseForChallenge(challenge: ChallengeSpec, state: MetaState): Curse | null {
    if (challenge.curse !== undefined && challenge.curse !== null) return challenge.curse
    return sampledCurseForStage(challenge.stage, state)
}

export function stageParMarker(stage: number, state: MetaState): string {
    const level = stageCurseLevel(stage, state)
    if (level === 'minor') return '*'
    if (level === 'major') return '**'
    return ''
}

export function formatParDisplay(stage: number, par: number, state: MetaState): string {
    return `${par}${stageParMarker(stage, state)}`
}

export function displayBasePar(stage: number, state: MetaState): number | null {
    const basePar = BASE_PARS[stage]
    if (basePar === undefined) return null
    return Math.max(0, basePar + scarcityParAdjustment(stage, state))
}

export function describeBasePar(stage: number, state: MetaState): string {
    const basePar = BASE_PARS[stage]
    if (basePar === undefined) return ''
    const scarcityDelta = scarcityParAdjustment(stage, state)
    if (scarcityDelta === 0) return `${basePar} (base)`
    const adjusted = displayBasePar(stage, state)
    if (adjusted === null) return `${basePar} (base)`
    return `${basePar} (base), ${signedAmount(scarcityDelta)} for scarcity, = ${adjusted}`
}

export function describeParCalculation(stage: number, challenge: ChallengeSpec | null | undefined, relicCards: Card[], state: MetaState): string {
    const basePar = BASE_PARS[stage]
    if (basePar === undefined) return ''

    const parts = [`${basePar} (base)`]
    let par = basePar
    const scarcityDelta = scarcityParAdjustment(stage, state)
    if (scarcityDelta !== 0) {
        par += scarcityDelta
        parts.push(`${signedAmount(scarcityDelta)} for scarcity`)
    }
    if (challenge !== null && challenge !== undefined) {
        for (const boon of challenge.boons) {
            par += boon.parAdjustment
            if (boon.parAdjustment !== 0) {
                parts.push(`${signedAmount(boon.parAdjustment)} for ${boon.name}`)
            }
        }
    }

    let params: GameSetupParams = {
        kind: 'gameSetup',
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
            const replaceFn = replacer.replace as unknown as (p: GameSetupParams, s: MetaState, self: Relic) => GameSetupParams
            const nextParams = replaceFn(params, state, relicCard)
            const parDelta = nextParams.par - params.par
            if (parDelta !== 0) {
                parts.push(`${signedAmount(parDelta)} for ${relicCard.name}`)
            }
            params = nextParams
        }
    }

    params.par = Math.max(0, params.par)
    parts.push(`= ${params.par}`)
    return parts.join(', ')
}

function stageTooltipTexts(state: MetaState): (string | null)[] {
    return BASE_PARS.map((basePar, stage) => {
        if (basePar === undefined) return null
        if (stage < state.data.stage) {
            const replayData = state.data.stageReplays[stage]
            if (replayData !== null) {
                return describeParCalculation(stage, replayData.challenge, replayData.spec.relics, state)
            }
        }
        if (stage === state.data.stage && state.data.challenges.length === 1) {
            return describeParCalculation(stage, state.data.challenges[0], state.data.relics, state)
        }
        return describeBasePar(stage, state)
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
    par += scarcityParAdjustment(state.data.stage, state)
    let vpTarget = challenge.vpMode.target
    const cards = challenge.vpMode.cards.slice()
    const events = challenge.vpMode.events.slice()
    const stageCurse = selectedCurseForChallenge(challenge, state)
    if (stageCurse !== null) {
        events.push(...stageCurse.events)
        vpTarget = Math.ceil(vpTarget * (stageCurse.vpTargetMultiplier ?? 1))
    }
    for (const boon of challenge.boons) {
        par += boon.parAdjustment
        cards.push(...boon.cards)
        events.push(...boon.events)
    }
    // Add collected cards and events, sorted by cost
    const sortedCollectedCards = [...state.data.collectedCards].sort((a, b) => coinKey(a) - coinKey(b))
    const sortedCollectedEvents = [...state.data.collectedEvents].sort((a, b) => energyEventKey(a) - energyEventKey(b))
    cards.push(...sortedCollectedCards)
    events.push(...sortedCollectedEvents)
    if (state.debugEnabled) {
        const cheatSpec = getSpecByName('Cheat')
        if (cheatSpec !== null && !events.some(event => event.name === cheatSpec.name)) {
            events.push(cheatSpec)
        }
    }

    const gameSetupParams = applyMetaReplacers({
        kind: 'gameSetup',
        par: par,
        vpGoal: vpTarget,
        cardSpecs: cards,
        eventSpecs: events
    }, state)
    const finalCards = gameSetupParams.cardSpecs
    const finalEvents = gameSetupParams.eventSpecs
    const finalPar = Math.max(0, gameSetupParams.par)
    return {
        vp: gameSetupParams.vpGoal,
        par: finalPar,
        buffer: state.data.buffer,
        cards: finalCards,
        events: finalEvents,
        potions: state.data.potions,
        relics: state.data.relics,
        metaStage: state.data.stage,
        metaStageScores: [...state.data.stageScores],
        metaStagePars: [...state.data.stagePars],
        metaStageTooltips: stageTooltipTexts(state),
        metaCursesEnabled: state.cursesEnabled,
    }
}

// Get reward option count based on relics
export function getRewardOptionCount(state: MetaState, rewardKind?: RewardKind): number {
    const params = applyMetaReplacers({
        kind: 'reward',
        optionCount: 3,
        pickBufferAdjustments: [],
        rewardKind
    }, state)
    return params.optionCount
}

function relicAvailableOnStage(relic: RelicSpec, stage: number): boolean {
    const minStage = relic.minStage ?? 0
    const maxStage = relic.maxStage ?? (TOTAL_STAGES - 1)
    return minStage <= stage && stage <= maxStage
}

export function standardRelicRewards(): RelicSpec[] {
    return relicRewards as RelicSpec[]
}

export function sampleEligibleRelicRewards(
    generator: Generator,
    count: number,
    state: MetaState
): RelicSpec[] {
    const blockedNames = new Set(state.data.relics.map(relic => relic.spec.name))
    const result: RelicSpec[] = []
    for (const relic of generator.permute(standardRelicRewards())) {
        if (blockedNames.has(relic.name)) continue
        if (!relicAvailableOnStage(relic, state.data.stage)) continue
        result.push(relic)
        blockedNames.add(relic.name)
        if (result.length >= count) break
    }
    return result
}

export function sampleEligibleRelicReward(
    generator: Generator,
    state: MetaState
): RelicSpec {
    const sampled = sampleEligibleRelicRewards(generator, 1, state)[0]
    if (!sampled) {
        throw new Error(`No eligible relic rewards for stage ${state.data.stage + 1}`)
    }
    return sampled
}

// ----------------------- Generate data

interface ChallengeOverrides {
    vpMode?: VPMode
    boon?: Boon
    curse?: Curse | null
}

function nextDistinctByName<T extends { name: string }>(
    ordered: T[],
    used: Set<string>,
    fallbackIndex: { value: number }
): T {
    const next = ordered.find(item => !used.has(item.name))
    if (next !== undefined) {
        used.add(next.name)
        return next
    }
    const fallback = ordered[fallbackIndex.value % ordered.length]
    fallbackIndex.value += 1
    return fallback
}

function sampleChallengesForStage(
    state: MetaState,
    count: number,
    challengeTests: ChallengeTestSpec[] = []
): ChallengeSpec[] {
    const stage = state.data.stage
    const generator = state.generator(`challenges${stage}`)
    const vpModeOrder = generator.permute(vpModes)
    const isFinalStage = stage === TOTAL_STAGES - 1
    const boonOrder = isFinalStage ? [] : generator.permute(boons)
    const curseLevel = stageCurseLevel(stage, state)
    const cursePool = curseLevel === 'minor' ? allMinorCurses()
        : curseLevel === 'major' ? allMajorCurses()
        : []
    const curseOrder = cursePool.length > 0 ? generator.permute(cursePool) : []
    const usedVPModes = new Set<string>()
    const usedBoons = new Set<string>()
    const usedCurses = new Set<string>()
    const vpFallbackIndex = { value: 0 }
    const boonFallbackIndex = { value: 0 }
    const curseFallbackIndex = { value: 0 }
    const result: ChallengeSpec[] = []

    for (let pathIndex = 0; pathIndex < count; pathIndex++) {
        const overrides = challengeOverridesForStage(challengeTests, stage, pathIndex)
        const vpMode = overrides.vpMode ?? nextDistinctByName(vpModeOrder, usedVPModes, vpFallbackIndex)
        usedVPModes.add(vpMode.name)

        let challengeBoons: Boon[] = []
        if (!isFinalStage) {
            const boon = overrides.boon ?? nextDistinctByName(boonOrder, usedBoons, boonFallbackIndex)
            usedBoons.add(boon.name)
            challengeBoons = [boon]
        }

        let curse: Curse | null = overrides.curse ?? null
        if (curse === null && curseOrder.length > 0) {
            curse = nextDistinctByName(curseOrder, usedCurses, curseFallbackIndex)
        }

        result.push({
            stage,
            vpMode,
            boons: challengeBoons,
            curse,
        })
    }

    return result
}

function orderedBurdenCandidates(
    _state: MetaState,
    generator: Generator
): BurdenDefinition[] {
    const weighted: BurdenDefinition[] = []
    for (const definition of burdenRegistry) {
        const weight = Math.max(1, definition.weight)
        for (let index = 0; index < weight; index++) {
            weighted.push(definition)
        }
    }
    return generator.permute(weighted)
}

async function sampleBurdenState(state: MetaState, generator: Generator): Promise<BurdenState> {
    const stage = state.data.stage
    const burdenParams = applyMetaReplacers({
        kind: 'burden',
        numOptions: 2,
        numPicked: 1
    }, state)
    await trigger({kind: 'burdenGeneration'}, state)
    const numOptions = Math.max(1, burdenParams.numOptions)
    const numPicked = Math.max(1, Math.min(burdenParams.numPicked, numOptions))
    const ordered = orderedBurdenCandidates(state, generator)
    const options: BurdenOptionState[] = []
    const chosenIDs = new Set<string>()
    for (const definition of ordered) {
        if (chosenIDs.has(definition.id)) continue
        if (definition.minStage > stage || stage > definition.maxStage) continue
        if (!definition.applies(state)) continue
        options.push(definition.createOption(state, generator))
        chosenIDs.add(definition.id)
        if (options.length === numOptions) break
    }
    if (options.length < numOptions) {
        throw new Error(`No valid burden options for stage ${state.data.stage + 1}`)
    }
    return {
        options,
        selectedIndex: null,
        selectedIndices: [],
        numPicked
    }
}

interface PathSkeleton {
    label: string,
    onSelectEffects: PathOnSelectEffect[],
    rewards: RewardKind[],
    burdens: number,
    challenges: ChallengeSpec[]
}

function normalizePathOptionSpec(path: string | PathOptionSpec): Required<PathOptionSpec> {
    if (typeof path === 'string') return { label: path, onSelectEffects: [] }
    return {
        label: path.label,
        onSelectEffects: (path.onSelectEffects || []).map(effect => ({ ...effect }))
    }
}

async function makePaths(state: MetaState, challengeTests: ChallengeTestSpec[] = []): Promise<PathSkeleton[]> {
    const stage = state.data.stage
    const generator = state.generator(`paths${stage}`).newGenerator()
    const baseRewardsPerPath = 2
    const basePaths = ['Go left', 'Go right']
    const baseNumBurdens = state.burdensEnabled && stage > 0 ? 1 : 0
    const pathRewardParams = applyMetaReplacers({
        kind: 'pathRewards',
        rewardsPerPath: baseRewardsPerPath,
        paths: basePaths,
        numBurdens: baseNumBurdens
    }, state)
    await trigger({
        kind: 'path',
        baseRewardsPerPath,
        rewardsPerPath: pathRewardParams.rewardsPerPath,
        baseNumBurdens,
        numBurdens: pathRewardParams.numBurdens
    }, state)
    const rewardsPerPath = pathRewardParams.rewardsPerPath
    const pathOptions = pathRewardParams.paths.map(normalizePathOptionSpec)
    const pathCount = pathOptions.length
    const numBurdens = Math.max(0, pathRewardParams.numBurdens)
    const challenges = sampleChallengesForStage(state, pathCount, challengeTests)
    const rewardsPerSet = 6
    const fullSet: RewardKind[] = ['card', 'card', 'event', 'encounter', 'potion', 'relic']
    const totalRewards = pathCount * rewardsPerPath
    const completeSets = Math.floor(totalRewards / rewardsPerSet)
    const partialSetRewards = totalRewards % rewardsPerSet

    const rewardPool: RewardKind[] = []
    for (let i = 0; i < completeSets; i++) rewardPool.push(...fullSet)
    if (partialSetRewards > 0) rewardPool.push(...generator.samples(fullSet, partialSetRewards))

    const shuffledRewards = generator.permute(rewardPool)
    const paths: PathSkeleton[] = []
    for (let pathIndex = 0; pathIndex < pathCount; pathIndex++) {
        const start = pathIndex * rewardsPerPath
        const end = start + rewardsPerPath
        const pathOption = pathOptions[pathIndex]
        paths.push({
            label: pathOption?.label ?? 'Path',
            onSelectEffects: pathOption?.onSelectEffects || [],
            rewards: shuffledRewards.slice(start, end),
            burdens: numBurdens,
            challenges: [challenges[pathIndex]]
        })
    }
    return paths
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
    const burdenStates: BurdenState[] = []
    for (let index = 0; index < skeleton.burdens; index++) {
        burdenStates.push({ options: [], selectedIndex: null, selectedIndices: [], numPicked: 1 })
    }
    return {
        label: skeleton.label,
        onSelectEffects: [...skeleton.onSelectEffects],
        rewardStates,
        burdenStates,
        challenges: skeleton.challenges
    }
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
export class ExitToLauncher extends Error {
    constructor() {
        super('ExitToLauncher')
        Object.setPrototypeOf(this, ExitToLauncher.prototype)
    }
}

function cloneGameSpec(spec: GameSpec): GameSpec {
    return {
        ...spec,
        buffer: spec.buffer,
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
    const blockedBaseNames = new Set(collected.map(spec => spec.name))
    const result: CardSpec[] = []
    for (const spec of generator.permute(allOptions)) {
        if (blockedBaseNames.has(spec.name)) continue
        result.push(spec)
        blockedBaseNames.add(spec.name)
        if (result.length >= count) break
    }
    return result
}

// TODO: I think there is probably a bug where you are passing in the wrong state here.
export function replaySpecForStage(state: MetaState, replayData: StageReplayData): GameSpec {
    return {
        ...cloneGameSpec(replayData.spec),
        buffer: replayData.bufferBeforeCourse,
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
        burdenStates: [],
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
            null,
            'nothing'
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
    const stageTimelineEntry: Extract<MetaTimelineEntry, { kind: 'stage' }> = {
        kind: 'stage',
        stage,
        challenge: challengeSummaryWithState(updatedReplayData.challenge, state),
        score: replayResult.score,
        par: updatedReplayData.par,
        usedPotions
    }
    state.update({
        timeline: upsertStageTimelineEntry(state.data.timeline, stageTimelineEntry)
    })
    state.ui.updateBuffer(state)
}

async function materializePath(state: MetaState, path: Path): Promise<Pick<MetaStateData, 'challenges' | 'rewardStates' | 'burdenStates'>> {
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
                    getRewardOptionCount(state, 'card'),
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
                    getRewardOptionCount(state, 'event'),
                    state.data.collectedEvents
                ),
                selectedIndex: null
            }
        } else if (rs.kind === 'potion' && rs.options.length === 0) {
            const generator = state.generator(`rewardspotion`).newGenerator()
            return {
                kind: 'potion' as const,
                options: generator.samples(potionRewards, getRewardOptionCount(state, 'potion')),
                selectedIndex: null
            }
        } else if (rs.kind === 'relic' && rs.options.length === 0) {
            const generator = state.generator(`rewardsrelic`).newGenerator()
            return {
                kind: 'relic' as const,
                options: sampleEligibleRelicRewards(generator, getRewardOptionCount(state, 'relic'), state),
                selectedIndex: null
            }
        }
        return rs
    })
    const burdenGenerator = state.generator(`rewardsburden`).newGenerator()
    const burdenStates: BurdenState[] = []
    for (const burdenState of path.burdenStates) {
        if (burdenState.options.length === 0) {
            burdenStates.push(await sampleBurdenState(state, burdenGenerator))
        } else {
            burdenStates.push(burdenState)
        }
    }
    return { challenges: path.challenges, rewardStates, burdenStates }
}

async function applyPathOnSelectEffects(state: MetaState, path: Path): Promise<void> {
    for (const effect of (path.onSelectEffects || [])) {
        if (effect.kind === 'spendRelicCharge') {
            const relic = state.data.relics.find(candidate => candidate.id === effect.relicID)
            if (!relic) continue
            const nextCharge = Math.max(relic.count('charge') - effect.amount, 0)
            const tokens = new Map(relic.tokens)
            tokens.set('charge', nextCharge)
            state.applyToRelic(current => current.update({ tokens }), relic)
        }
    }
}

// We can define staged tests in order to inject a given reward for a specific stage while debugging.
// Stage is 1-based for readability (stage 1 = first stage shown to the player).
type RewardTestSpec =
    | ['potion', CardSpec | CardSpec[]]
    | ['relic', RelicSpec | RelicSpec[]]
    | ['card', CardSpec | CardSpec[]]
    | ['event', CardSpec | CardSpec[]]
    | ['encounter', Encounter]
export type TestSpec = [number, RewardTestSpec]
type VPModeTestRef = VPMode | string
type BoonTestRef = Boon | string
type CurseTestRef = Curse | string
type BurdenTestRef = string
type BurdenTestGroupRef = ['burden', BurdenTestRef | BurdenTestRef[]]
type ChallengeStageTest = ['vpMode', VPModeTestRef] | ['boon', BoonTestRef] | ['curse', CurseTestRef]
export type ChallengeTestSpec = [number, ChallengeStageTest]
export type BurdenTestSpec = [number, BurdenTestRef | BurdenTestGroupRef]
export interface DebugTestConfig {
    rewards?: TestSpec[]
    challenges?: ChallengeTestSpec[]
    burdens?: BurdenTestSpec[]
    allCards?: boolean
    allEvents?: boolean
    allPotions?: boolean
    allRelics?: boolean
    allBurdens?: boolean
}

interface ParsedTests {
    rewards: TestSpec[]
    challenges: ChallengeTestSpec[]
    burdens: BurdenTestSpec[]
}

function isRewardTestSpec(value: unknown): value is RewardTestSpec {
    return Array.isArray(value)
        && value.length === 2
        && typeof value[0] === 'string'
}

function isTestSpec(value: unknown): value is TestSpec {
    return Array.isArray(value)
        && value.length === 2
        && typeof value[0] === 'number'
        && Number.isInteger(value[0])
        && isRewardTestSpec(value[1])
}

function isChallengeStageTest(value: unknown): value is ChallengeStageTest {
    return Array.isArray(value)
        && value.length === 2
        && (value[0] === 'vpMode' || value[0] === 'boon' || value[0] === 'curse')
        && (typeof value[1] === 'string' || (value[1] !== null && typeof value[1] === 'object'))
}

function isChallengeTestSpec(value: unknown): value is ChallengeTestSpec {
    return Array.isArray(value)
        && value.length === 2
        && typeof value[0] === 'number'
        && Number.isInteger(value[0])
        && isChallengeStageTest(value[1])
}

function isBurdenTestSpec(value: unknown): value is BurdenTestSpec {
    const isGroup =
        Array.isArray(value)
        && value.length === 2
        && Array.isArray(value[1])
        && value[1].length === 2
        && value[1][0] === 'burden'
        && (
            typeof value[1][1] === 'string'
            || (Array.isArray(value[1][1]) && value[1][1].every(entry => typeof entry === 'string'))
        )
    return Array.isArray(value)
        && value.length === 2
        && typeof value[0] === 'number'
        && Number.isInteger(value[0])
        && (typeof value[1] === 'string' || isGroup)
}

function isDebugTestConfig(value: unknown): value is DebugTestConfig {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) return false
    const record = value as Record<string, unknown>
    const rewards = record.rewards
    const challenges = record.challenges
    const burdens = record.burdens
    const allCards = record.allCards
    const allEvents = record.allEvents
    const allPotions = record.allPotions
    const allRelics = record.allRelics
    const allBurdens = record.allBurdens
    const rewardsValid = rewards === undefined || (Array.isArray(rewards) && rewards.every(isTestSpec))
    const challengesValid = challenges === undefined || (Array.isArray(challenges) && challenges.every(isChallengeTestSpec))
    const burdensValid = burdens === undefined || (Array.isArray(burdens) && burdens.every(isBurdenTestSpec))
    const allCardsValid = allCards === undefined || typeof allCards === 'boolean'
    const allEventsValid = allEvents === undefined || typeof allEvents === 'boolean'
    const allPotionsValid = allPotions === undefined || typeof allPotions === 'boolean'
    const allRelicsValid = allRelics === undefined || typeof allRelics === 'boolean'
    const allBurdensValid = allBurdens === undefined || typeof allBurdens === 'boolean'
    return rewardsValid
        && challengesValid
        && burdensValid
        && allCardsValid
        && allEventsValid
        && allPotionsValid
        && allRelicsValid
        && allBurdensValid
}

function normalizeTests(test: null | TestSpec | TestSpec[] | DebugTestConfig): ParsedTests {
    if (test === null) return { rewards: [], challenges: [], burdens: [] }
    if (isDebugTestConfig(test)) {
        const rewards = test.rewards ? [...test.rewards] : []
        const bulkStage = 1
        if (test.allCards) {
            rewards.push([bulkStage, ['card', [...cardRewards]]])
        }
        if (test.allEvents) {
            rewards.push([bulkStage, ['event', [...eventRewards]]])
        }
        if (test.allPotions) {
            rewards.push([bulkStage, ['potion', [...potionRewards]]])
        }
        if (test.allRelics) {
            rewards.push([bulkStage, ['relic', [...(relicRewards as RelicSpec[])]]])
        }

        const burdens = test.burdens ? [...test.burdens] : []
        if (test.allBurdens) {
            burdens.push([bulkStage, ['burden', getRegisteredBurdenIds()]])
        }
        return {
            rewards,
            challenges: test.challenges ? [...test.challenges] : [],
            burdens,
        }
    }
    if (isTestSpec(test)) return { rewards: [test], challenges: [], burdens: [] }
    if (Array.isArray(test) && test.every(isTestSpec)) {
        return { rewards: [...test], challenges: [], burdens: [] }
    }
    throw new Error('Invalid debug test specification')
}

const warnedUnknownVPModeTests = new Set<string>()
const warnedUnknownBoonTests = new Set<string>()
const warnedUnknownCurseTests = new Set<string>()
const warnedUnknownBurdenTests = new Set<string>()

function resolveVPModeTestRef(ref: VPModeTestRef): VPMode | null {
    if (typeof ref !== 'string') return ref
    const mode = vpModes.find(vpMode => vpMode.name === ref) ?? null
    if (mode === null && !warnedUnknownVPModeTests.has(ref)) {
        warnedUnknownVPModeTests.add(ref)
        console.warn(`Unknown vp mode in debug test config: ${ref}`)
    }
    return mode
}

function resolveBoonTestRef(ref: BoonTestRef): Boon | null {
    if (typeof ref !== 'string') return ref
    const boon = boons.find(candidate => candidate.name === ref) ?? null
    if (boon === null && !warnedUnknownBoonTests.has(ref)) {
        warnedUnknownBoonTests.add(ref)
        console.warn(`Unknown boon in debug test config: ${ref}`)
    }
    return boon
}

function resolveCurseTestRef(ref: CurseTestRef): Curse | null {
    if (typeof ref !== 'string') return ref
    const curse = findCurseByName(ref)
    if (curse !== null) return curse
    if (!warnedUnknownCurseTests.has(ref)) {
        warnedUnknownCurseTests.add(ref)
        console.warn(`Unknown curse in debug test config: ${ref}`)
    }
    return null
}

function resolveBurdenTestRef(ref: BurdenTestRef): BurdenDefinition | null {
    const burden = burdenDefinitionById(ref)
    if (burden === null && !warnedUnknownBurdenTests.has(ref)) {
        warnedUnknownBurdenTests.add(ref)
        console.warn(`Unknown burden in debug test config: ${ref}`)
    }
    return burden
}

function challengeOverridesForStage(
    tests: ChallengeTestSpec[],
    stageIndex: number,
    pathIndex: number
): ChallengeOverrides {
    if (pathIndex !== 0) return {}
    const stageNumber = stageIndex + 1
    const overrides: ChallengeOverrides = {}
    for (const [stage, stageTest] of tests) {
        if (stage !== stageNumber) continue
        if (stageTest[0] === 'vpMode') {
            const mode = resolveVPModeTestRef(stageTest[1])
            if (mode !== null) overrides.vpMode = mode
        } else if (stageTest[0] === 'boon') {
            const boon = resolveBoonTestRef(stageTest[1])
            if (boon !== null) overrides.boon = boon
        } else {
            const curse = resolveCurseTestRef(stageTest[1])
            if (curse !== null) overrides.curse = curse
        }
    }
    return overrides
}

function rewardTestsForStage(tests: TestSpec[], stageIndex: number): RewardTestSpec[] {
    const stageNumber = stageIndex + 1
    return tests
        .filter(([stage]) => stage === stageNumber)
        .map(([, spec]) => spec)
}

function burdenTestsForStage(tests: BurdenTestSpec[], stageIndex: number): BurdenDefinition[][] {
    const stageNumber = stageIndex + 1
    const result: BurdenDefinition[][] = []
    for (const [stage, refOrGroup] of tests) {
        if (stage !== stageNumber) continue
        if (typeof refOrGroup === 'string') {
            const burden = resolveBurdenTestRef(refOrGroup)
            if (burden !== null) result.push([burden])
            continue
        }
        const refs = Array.isArray(refOrGroup[1]) ? refOrGroup[1] : [refOrGroup[1]]
        const group: BurdenDefinition[] = []
        const seen = new Set<string>()
        for (const ref of refs) {
            const burden = resolveBurdenTestRef(ref)
            if (burden === null || seen.has(burden.id)) continue
            seen.add(burden.id)
            group.push(burden)
        }
        if (group.length > 0) result.push(group)
    }
    return result
}

function makeTestBurdenState(state: MetaState, burdenDefinitions: BurdenDefinition[]): BurdenState {
    const generator = state.generator('test')
    const options = burdenDefinitions.map(definition => definition.createOption(state, generator))
    return {
        options,
        selectedIndex: null,
        selectedIndices: [],
        numPicked: 1
    }
}

function makeTestReward(state: MetaState, spec: RewardTestSpec): RewardState {
    switch (spec[0]) {
        case 'potion':
        case 'event':
        case 'card': {
            const options = Array.isArray(spec[1]) ? [...spec[1]] : [spec[1]]
            return { kind: spec[0], options: options as CardSpec[], selectedIndex: null }
        }
        case 'relic':
            return {
                kind: 'relic',
                options: (Array.isArray(spec[1]) ? [...spec[1]] : [spec[1]]) as RelicSpec[],
                selectedIndex: null
            }
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
    test: null | TestSpec | TestSpec[] | DebugTestConfig = null,
    seed: string | null = null,
    initialSnapshot: SerializedMetaGame | null = null,
    onStateChange: ((snapshot: SerializedMetaGame) => void) | null = null,
    debugEnabled: boolean = false,
    burdensEnabled: boolean = false,
    scarcityEnabled: boolean = false,
    cursesEnabled: boolean = false
): Promise<void> {
    const state: MetaState = initialSnapshot
        ? deserializeMetaGame(ui, initialSnapshot, null)
        : new MetaState(ui, seed, null, { debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled })
    state.setChangeListener(onStateChange ? () => onStateChange!(serializeMetaGame(state)) : null)
    const tests = state.debugEnabled
        ? normalizeTests(test)
        : { rewards: [], challenges: [], burdens: [] } as ParsedTests

    if (!initialSnapshot) {
        // Stage 0 offers two challenge options
        const initialChallenges = sampleChallengesForStage(state, 2, tests.challenges)
        const initialPath = pathFromSkeleton({
            label: 'Go left',
            onSelectEffects: [],
            rewards: ['card', 'card', 'event', 'potion'] as RewardKind[],
            burdens: 0,
            challenges: initialChallenges
        })
        for (const testSpec of rewardTestsForStage(tests.rewards, 0)) {
            initialPath.rewardStates.push(makeTestReward(state, testSpec))
        }
        const initialBurdenTests = burdenTestsForStage(tests.burdens, 0)
        for (const burdenDefinitions of initialBurdenTests) {
            initialPath.burdenStates.push(makeTestBurdenState(state, burdenDefinitions))
        }
        state.replaceAndClearHistory({
            ...(await materializePath(state, initialPath)),
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
                    },
                    'leave'
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
                const stageTimelineEntry: Extract<MetaTimelineEntry, { kind: 'stage' }> = {
                    kind: 'stage',
                    stage,
                    challenge: challengeSummaryWithState(state.data.challenges[0], state),
                    score,
                    par: gameSpec.par,
                    usedPotions
                }
                state.update({
                    stageReplays,
                    timeline: upsertStageTimelineEntry(state.data.timeline, stageTimelineEntry)
                })
                const nextStage = state.data.stage + 1
                state.update({ stage: nextStage })
                if (nextStage >= TOTAL_STAGES) {
                    state.update({ phase: 'game_over' })
                    // Game over - player has completed all stages
                    await state.ui.showMessage(state, 'Congratulations! You have completed all stages!')
                    return
                }
                const paths = (await makePaths(state, tests.challenges)).map(skel => pathFromSkeleton(skel))
                for (const testSpec of rewardTestsForStage(tests.rewards, nextStage)) {
                    paths[0].rewardStates.push(makeTestReward(state, testSpec))
                }
                const pathBurdenTests = burdenTestsForStage(tests.burdens, nextStage)
                for (const burdenDefinitions of pathBurdenTests) {
                    paths[0].burdenStates.push(makeTestBurdenState(state, burdenDefinitions))
                }
                state.replaceAndClearHistory({
                    phase: 'path_select',
                    challenges: [],
                    rewardStates: [],
                    burdenStates: [],
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
                await applyPathOnSelectEffects(state, path)
                state.replaceAndClearHistory({
                    ...(await materializePath(state, path)),
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
                if (state.data.burdenStates.some(burden => !isBurdenResolved(burden))) {
                    throw new Error('Invariant violation: cannot start stage with unresolved burdens')
                }
                state.updateAndSetCheckpoint({
                    phase: 'in_game',
                    rewardStates: [],
                    burdenStates: [],
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
