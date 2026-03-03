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

import { buildSpecTooltipSimple, buildSpecTooltipFull } from './cardRendering.js'
import { makeBottledCardPotion, makeBottledEventPotion, makeCardInABoxRelic } from './data/specialSpecs.js'
import { allMajorCurses, allMinorCurses, Curse } from './data/curses.js'

// ----------------------------- MetaUI Interface

// Option type for meta-game choices (analogous to Option in gameLogic)
export interface MetaOption<T> {
    label: string
    value: T
    spec?: CardSpec  // Optional card spec to display
    isRelicSpec?: boolean
    disabled?: boolean // Greyed out if it's not enabled
    description?: string
}

export type Renderable = ['card', CardSpec] | ['relic', Relic] | ['potion', Card] | ['event', CardSpec]

// UI interface for meta-game interactions (analogous to UI in gameLogic)
export interface MetaUI {
    // Choose from a list of cards (for encounters with sub-dialogs)
    chooseCard<T extends Renderable>(
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

    // Update the progress sidebar
    updateSidebar(state: MetaState): void
}

export interface ActiveGameProgress {
    history: Replayable[]
    redo: Replayable[]
    macros: unknown
    viewingMacros: boolean
}

// --------------------- Reward Options and Encounters

// This is a pretty redundant and messy implementation, blame the AI.

// A button/option displayed for a reward or encounter
export type RewardOption = {
    label: string
    description?: string
    spec?: CardSpec           // Display as card if provided
    isRelicSpec?: boolean     // True if spec is a relic (for rendering)
    tooltipSpec?: CardSpec    // Optional tooltip card content for text options
    compact?: boolean         // Render as compact text option
    bufferDelta?: number      // Buffer gained/lost when this option is picked
    disabled: boolean
    checked: boolean          // Shows checkmark if selected
} & ({
    kind: 'complex',
    onClick: (state:MetaState) => Promise<RewardStateData> // Returns new data, as per the old function, and mutates state.
} | {
    kind: 'simple',
    onClick: (state: MetaState) => Promise<number | null> // Set this value to optionSelected, and mutates state
})

// Encounter interface - defines behavior for encounter rewards
export interface Encounter {
    name: string
    tooltip?: string
    createInitialData(metaState: MetaState, generator: Generator): RewardStateData
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[]
}

// State for simple rewards (card/event/potion/relic)
export type SimpleRewardState = ({
    kind: 'card' | 'event' | 'potion'
    options: Array<CardSpec>
} | {
    kind: 'relic'
    options: Array<RelicSpec>
}) & {
    data: {selectedIndex: number | null, rewardState: true} // Index of selected option, or null if none
}

// State for encounters
export interface EncounterRewardState {
    kind: 'encounter'
    encounter: Encounter
    data: RewardStateData
}

export type RewardStateData = {
  [key: string]: unknown;
} & {
  rewardState: true;
};

export type RewardState = SimpleRewardState | EncounterRewardState

export interface BurdenState extends RewardStateData {
    options: Burden[]
    selectedIndices: number[]
    numRequired: number
    rewardState: true
}

export interface Burden {
    name: string
    render: {
        kind: 'text',
        description: string
        rules?: Rule[]
    } | {
        kind: 'relic',
        spec: RelicSpec
    }
    weight?: number
    minStage?: number
    maxStage?: number
    applies: (state: MetaState) => boolean
    resolve: (state: MetaState, skipped: string[]) => Promise<boolean> // True if the burden is now discharged
}

export type ExtraOptionID = 'takeItAll' | 'singingBowl' | 'destroyCursedKey'

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

// Compute the buffer adjustments for each option in a simple reward (Sozu, Broken Crown, etc.)
export function rewardPickAdjustments(kind: RewardKind, optionCount: number, metaState: MetaState): number[] {
    const rewardParams = applyMetaReplacers({
        kind: 'reward',
        optionCount,
        pickBufferAdjustments: [],
        rewardKind: kind
    }, metaState)
    return rewardParams.pickBufferAdjustments
}

// Transform for picking a single reward option: gains the item and applies buffer adjustments.
export function pickRewardOption(
    option: CardSpec | RelicSpec,
    kind: RewardKind,
    adjustment: number,
    opts?: { silent?: boolean, skipped?: string[] }
): MetaTransform {
    const gainTransform =
        kind === 'card' ? gainCard(option as CardSpec, opts) :
        kind === 'event' ? gainEvent(option as CardSpec, opts) :
        kind === 'potion' ? gainPotion(option as CardSpec, opts) :
        gainRelic(option as RelicSpec, opts)
    return adjustment === 0 ? gainTransform : compose(gainTransform, addBuffer(adjustment))
}

// Get options for a simple reward
function getSimpleRewardOptions(rewardState: SimpleRewardState, metaState: MetaState): RewardOption[] {
    const options = rewardState.options as Array<CardSpec | RelicSpec>
    const adjustments = rewardPickAdjustments(rewardState.kind, options.length, metaState)
    return options.map((option: CardSpec | RelicSpec, i: number) => ({
        label: displayName(option as CardSpec),
        kind: 'simple',
        spec: option as CardSpec,
        isRelicSpec: rewardState.kind === 'relic',
        disabled: rewardState.data.selectedIndex !== null
            || (rewardState.kind === 'relic' && !relicGainRequirementSatisfied(option as RelicSpec, metaState)),
        checked: rewardState.data.selectedIndex === i,
        bufferDelta: adjustments[i] ?? 0,
        onClick: async (state: MetaState) => {
            const skipped = options
                .filter((_, j) => j !== i)
                .map(spec => displayName(spec as CardSpec))
            await pickRewardOption(option, rewardState.kind, adjustments[i] ?? 0, { skipped })(state)
            return i
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
        : rewardState.data.selectedIndex !== null

    if (rewardState.kind !== 'encounter') {
        const enabledIDs = enabledExtraOptions(metaState)
        const selectedExtraOption = rewardState.data.selectedIndex === null
            ? null
            : extraOptionBySelectionMarker(rewardState.data.selectedIndex!)
        if (selectedExtraOption !== null) enabledIDs.add(selectedExtraOption.id)

        for (const definition of getRegisteredExtraOptions()) {
            if (!enabledIDs.has(definition.id)) continue
            const rendered = definition.render(rewardState, metaState)
            baseOptions.push({
                label: rendered.label,
                kind: 'simple',
                description: rendered.description,
                tooltipSpec: rendered.tooltipSpec,
                compact: rendered.compact,
                disabled: alreadySelected,
                checked: rewardState.data.selectedIndex === definition.selectionMarker,
                onClick: async (state:MetaState) => {
                    await rendered.transform(state)
                    return definition.selectionMarker
                }
            })
        }
    }

    return baseOptions
}

function burdenDefinitionById(id: string): Burden {
    const result = burdenRegistry.find(definition => definition.name === id)
    if (result === undefined) {
        throw new Error('No burden found with id ' + id)
    } else {
        return result
    }
}

export function getRegisteredBurdenIds(): string[] {
    return burdenRegistry.map(definition => definition.name)
}

export function isBurdenResolved(burdenState: BurdenState): boolean {
    return burdenState.selectedIndices.length >= burdenState.numRequired
}

export function getBurdenOptions(burdenState: BurdenState, metaState: MetaState): RewardOption[] {
    return burdenState.options.map((burden, index) => {
        const applicable = burden.applies(metaState)
        const resolved = isBurdenResolved(burdenState)
        const alreadyPicked = burdenState.selectedIndices.includes(index)
        const descriptionLines:string[] = []
        if (burden.render.kind === 'text') {
            descriptionLines.push(burden.render.description)
            for (const rule of burden.render.rules ?? []) {
                for (const trigger of rule.triggers ?? []) {
                    if (trigger.simpleText) { descriptionLines.push(...trigger.simpleText) }
                }
                for (const replacer of rule.replacers ?? []) {
                    if (replacer.simpleText) { descriptionLines.push(...replacer.simpleText) }
                }
            }
        }
        return {
            label: (burden.render.kind === 'text') ? burden.name : '',
            kind: 'complex',
            description: descriptionLines.join('\n'),
            spec: (burden.render.kind === 'relic') ? burden.render.spec : undefined,
            isRelicSpec: burden.render.kind === 'relic',
            disabled: resolved || alreadyPicked || !applicable,
            checked: alreadyPicked,
            onClick: async function (state: MetaState) {
                if (!burden.applies(state)) {
                    return burdenState
                }
                const selectedIndices = [...burdenState.selectedIndices, index]
                const isFinalPick = selectedIndices.length >= burdenState.numRequired
                const skipped = isFinalPick
                    ? burdenState.options.filter((_, i) => !selectedIndices.includes(i)).map(o => o.name)
                    : []
                const done = await burden.resolve(metaState, skipped)
                if (done) {
                    return {
                        ...burdenState,
                        selectedIndices
                    }
                } else {
                    return burdenState
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
const burdenRegistry: Burden[] = []

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


export function registerBurden(definition: Burden): Burden {
    burdenRegistry.push(definition)
    return definition
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

export function getEncounterByName(name: string): Encounter {
    const registration = encounterRegistry.find(entry => entry.encounter.name === name)
    if (!registration) {
        throw new Error(`No encounter found with name "${name}"`)
    } else {
        return registration.encounter
    }
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

export function renderChallenge(spec: ChallengeSpec, state: MetaState, challengeIndex?: number): string {
    const gameSpec:GameSpec = makeSpec(state, spec, challengeIndex)
    const label = `${challengeSummaryWithState(spec, state)} (${gameSpec.vp}vp in ${gameSpec.par}@)`
    const stageCurse = selectedCurseForChallenge(spec, state)

    const hintsHtml = (gameSpec.hints ?? []).length > 0
        ? `<div class='challengeHints'>${(gameSpec.hints ?? []).join('<br>')}</div>`
        : ''

    // Build tooltip with all related cards from VP mode and boons
    const relatedCards: CardSpec[] = [
        ...spec.vpMode.cards,
        ...spec.vpMode.events,
        ...(stageCurse ? stageCurse.events : []),
        ...spec.boons.flatMap(b => [...b.cards, ...b.events])
    ]
    if (relatedCards.length === 0) return label + hintsHtml
    const simpleContent = relatedCards.map(r => buildSpecTooltipSimple(r)).join('')
    const fullContent = relatedCards.map(r => buildSpecTooltipFull(r)).join('')
    return `${label}<span class='tooltip tooltip-simple'>${simpleContent}</span><span class='tooltip tooltip-full'>${fullContent}</span>${hintsHtml}`
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
    challengeIndex?: number
    hints?: string[]
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
    destroyIfEmpty?: boolean
}

export interface PathOptionSpec {
    label: string
    onSelectEffects?: PathOnSelectEffect[]
    bonusRewards?: number
}

export interface PathRewardParams {
    kind: 'pathRewards'
    rewardsPerPath: number
    paths: Array<string | PathOptionSpec>
    numBurdens: number
    numChallengeOptions: number
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
export interface FilledPath {
    // label: string
    // onSelectEffects?: PathOnSelectEffect[]
    rewardStates: RewardState[]
    burdenStates: BurdenState[]
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

// Name in the sidebar when playing the stage.
export function rewardNameInStage(rewardState: RewardState): string {
    if (rewardState.kind === 'encounter') {
        return rewardState.encounter.name
    } else {
        return rewardNamePathSelect(rewardState.kind)
    }
}

// Name in the path when choosing which one to select.
export function rewardNamePathSelect(rewardKind: RewardKind): string {
    const labels: Record<string, string> = {
        card: 'Add Card',
        event: 'Add Event',
        potion: 'Add Potion',
        relic: 'Add Relic',
        encounter: '???'
    }
    return labels[rewardKind]
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

    // Which challenge was selected (index in original challenges array)
    selectedChallengeIndex?: number
}

export function getSelectedChallenge(data: MetaStateData): ChallengeSpec {
    if (data.selectedChallengeIndex === undefined) {
        throw new Error('No challenge selected')
    }
    return data.challenges[data.selectedChallengeIndex]
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
    data: unknown
}

interface SerializedBurdenOptionState {
    name: string,
}

interface SerializedBurdenState {
    options: SerializedBurdenOptionState[]
    selectedIndices: number[]
    numRequired: number
}

interface SerializedEncounterRewardState {
    kind: 'encounter'
    encounterName: string
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
    rewards: RewardKind[]
    burdens: number
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
    selectedChallengeIndex?: number
    collectedCards?: SerializedSpecRef[]
    collectedEvents?: SerializedSpecRef[]
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
    selectedChallengeIndex?: number
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
    if (data.phase === 'in_game' && data.selectedChallengeIndex === undefined) {
        throw new Error(`Invariant violation (${context}): in_game requires a selected challenge index`)
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
        rewards: path.rewards,
        burdens: path.burdens,
    }
}

function deserializePath(path: SerializedPath): Path {
    return {
        label: path.label ?? 'Path',
        onSelectEffects: (path.onSelectEffects || []).map(effect => ({ ...effect })),
        rewards: path.rewards,
        burdens: path.burdens,
    }
}
function serializeBurdenState(burdenState: BurdenState): SerializedBurdenState {
    return {
        selectedIndices: [...burdenState.selectedIndices],
        options: burdenState.options.map(option => ({
            name: option.name,
        })),
        numRequired: burdenState.numRequired
    }
}

function deserializeBurdenState(burdenState: SerializedBurdenState): BurdenState {
    const selectedIndices = burdenState.selectedIndices
    return {
        selectedIndices,
        numRequired: burdenState.numRequired,
        options: burdenState.options.map(option => burdenDefinitionById(option.name)),
        rewardState: true
    }
}

function serializeRewardState(rewardState: RewardState): SerializedRewardState {
    if (rewardState.kind === 'encounter') {
        return {
            kind: 'encounter',
            encounterName: rewardState.encounter.name,
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
        data: rewardState.data
    }
}

function deserializeRewardState(rewardState: SerializedRewardState): RewardState {
    if (rewardState.kind === 'encounter') {
        return {
            kind: 'encounter',
            encounter: getEncounterByName(rewardState.encounterName),
            data: {...decodeUnknown(rewardState.data) as {[key: string]: unknown}, rewardState: true},
        }
    }
    if (rewardState.kind === 'relic') {
        return {
            kind: 'relic',
            options: rewardState.options.map(spec => deserializeSpec(spec)) as RelicSpec[],
            data: {...decodeUnknown(rewardState.data) as {selectedIndex: number | null}, rewardState: true},
        }
    } else {
        return {
            kind: rewardState.kind,
            options: rewardState.options.map(deserializeSpec) as CardSpec[],
            data: {...decodeUnknown(rewardState.data) as {selectedIndex: number | null}, rewardState: true}
        }
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
        replayStage: spec.replayStage,
        selectedChallengeIndex: spec.selectedChallengeIndex,
        collectedCards: spec.collectedCards?.map(card => serializeSpec(card, 'card')),
        collectedEvents: spec.collectedEvents?.map(event => serializeSpec(event, 'event'))
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
        replayStage: spec.replayStage,
        selectedChallengeIndex: spec.selectedChallengeIndex,
        collectedCards: spec.collectedCards?.map(card => deserializeSpec(card)),
        collectedEvents: spec.collectedEvents?.map(event => deserializeSpec(event))
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
        gameRedo: [...data.gameRedo],
        selectedChallengeIndex: data.selectedChallengeIndex
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
        selectedChallengeIndex: data.selectedChallengeIndex,
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

function scarcityParAdjustment(_stage: number, state: MetaState): number {
    return state.scarcityEnabled ? -1 : 0
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
    if (scarcityDelta === 0) return `${basePar} (Base)`
    const adjusted = displayBasePar(stage, state)
    if (adjusted === null) return `${basePar} (Base)`
    return `${basePar} (Base), ${signedAmount(scarcityDelta)} (Scarcity), = ${adjusted}`
}

export function describeParCalculation(stage: number, challenge: ChallengeSpec | null | undefined, relicCards: Card[], state: MetaState, challengeIndex?: number): string {
    const basePar = BASE_PARS[stage]
    if (basePar === undefined) return ''

    const parts = [`${basePar} (Base)`]
    let par = basePar
    const scarcityDelta = scarcityParAdjustment(stage, state)
    if (scarcityDelta !== 0) {
        par += scarcityDelta
        parts.push(`${signedAmount(scarcityDelta)} (Scarcity)`)
    }
    if (challenge !== null && challenge !== undefined) {
        for (const boon of challenge.boons) {
            par += boon.parAdjustment
            if (boon.parAdjustment !== 0) {
                parts.push(`${signedAmount(boon.parAdjustment)} (${boon.name})`)
            }
        }
    }

    let params: GameSetupParams = {
        kind: 'gameSetup',
        par,
        vpGoal: challenge?.vpMode.target ?? 0,
        cardSpecs: [],
        eventSpecs: [],
        challengeIndex
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
                parts.push(`${signedAmount(parDelta)} (${relicCard.name})`)
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
                // Use the tooltip saved at game time, which reflects the modifiers that were active then
                return replayData.spec.metaStageTooltips?.[stage]
                    ?? describeParCalculation(stage, replayData.challenge, replayData.spec.relics, state, replayData.spec.selectedChallengeIndex)
            }
        }
        if (stage === state.data.stage && state.data.selectedChallengeIndex !== undefined) {
            return describeParCalculation(stage, getSelectedChallenge(state.data), state.data.relics, state, state.data.selectedChallengeIndex)
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
export function makeSpec(state: MetaState, challenge: ChallengeSpec, selectedChallengeIndex?: number): GameSpec {
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
        eventSpecs: events,
        challengeIndex: selectedChallengeIndex,
        hints: undefined
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
        selectedChallengeIndex,
        collectedCards: sortedCollectedCards,
        collectedEvents: sortedCollectedEvents,
        hints: gameSetupParams.hints,
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
    test: TestConfig = {}
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
        const overrides = challengeOverridesForStage(test, stage, pathIndex)
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
): Burden[] {
    const weighted: Burden[] = []
    for (const definition of burdenRegistry) {
        const weight = definition.weight ?? 1
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
    const options: Burden[] = []
    const chosenIDs = new Set<string>()
    for (const definition of ordered) {
        if (chosenIDs.has(definition.name)) continue
        if ((definition.minStage ?? 1) > stage || stage > (definition.maxStage ?? TOTAL_STAGES - 1)) continue
        if (!definition.applies(state)) continue
        options.push(definition)
        chosenIDs.add(definition.name)
        if (options.length === numOptions) break
    }
    if (options.length < numOptions) {
        throw new Error(`No valid burden options for stage ${state.data.stage + 1}`)
    }
    return {
        options,
        selectedIndices: [],
        numRequired: numPicked,
        rewardState: true
    }
}

export interface Path {
    label: string,
    onSelectEffects: PathOnSelectEffect[],
    rewards: RewardKind[],
    burdens: number,
}

function normalizePathOptionSpec(path: string | PathOptionSpec): PathOptionSpec {
    if (typeof path === 'string') return { label: path, onSelectEffects: [], bonusRewards: 0 }
    return {
        label: path.label,
        onSelectEffects: (path.onSelectEffects || []).map(effect => ({ ...effect })),
        bonusRewards: path.bonusRewards ?? 0
    }
}

function getNumChallengeOptions(state: MetaState): number {
    const params = applyMetaReplacers({
        kind: 'pathRewards',
        rewardsPerPath: 2,
        paths: ['Go left', 'Go right'],
        numBurdens: 0,
        numChallengeOptions: 2
    }, state)
    return params.numChallengeOptions
}

async function makePaths(state: MetaState): Promise<Path[]> {
    const stage = state.data.stage
    const generator = state.generator(`paths${stage}`).newGenerator()
    const baseRewardsPerPath = 2
    const basePaths = ['Go left', 'Go right']
    const baseNumBurdens = state.burdensEnabled && stage > 0 ? 1 : 0
    const pathRewardParams = applyMetaReplacers({
        kind: 'pathRewards',
        rewardsPerPath: baseRewardsPerPath,
        paths: basePaths,
        numBurdens: baseNumBurdens,
        numChallengeOptions: 2
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
    const rewardsPerSet = 6
    const fullSet: RewardKind[] = ['card', 'card', 'event', 'encounter', 'potion', 'relic']
    const perPathRewards = pathOptions.map(opt => rewardsPerPath + (opt?.bonusRewards ?? 0))
    const totalRewards = perPathRewards.reduce((a, b) => a + b, 0)
    const completeSets = Math.floor(totalRewards / rewardsPerSet)
    const partialSetRewards = totalRewards % rewardsPerSet

    const rewardPool: RewardKind[] = []
    for (let i = 0; i < completeSets; i++) rewardPool.push(...fullSet)
    if (partialSetRewards > 0) rewardPool.push(...generator.samples(fullSet, partialSetRewards))

    const shuffledRewards = generator.permute(rewardPool)
    const paths: Path[] = []
    let rewardCursor = 0
    for (let pathIndex = 0; pathIndex < pathCount; pathIndex++) {
        const numRewards = perPathRewards[pathIndex]
        const pathOption = pathOptions[pathIndex]
        paths.push({
            label: pathOption?.label ?? 'Path',
            onSelectEffects: pathOption?.onSelectEffects || [],
            rewards: shuffledRewards.slice(rewardCursor, rewardCursor + numRewards),
            burdens: numBurdens,
        })
        rewardCursor += numRewards
    }
    return paths
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
        replayUsedPotionIDs: spec.replayUsedPotionIDs ? [...spec.replayUsedPotionIDs] : undefined,
        selectedChallengeIndex: spec.selectedChallengeIndex,
        collectedCards: spec.collectedCards ? [...spec.collectedCards] : undefined,
        collectedEvents: spec.collectedEvents ? [...spec.collectedEvents] : undefined
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

export function sampleRewards(
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

export function sampleReward(
    generator: Generator,
    allOptions: CardSpec[],
    collected: CardSpec[]
): CardSpec {
    const options = sampleRewards(generator, allOptions, 1, collected)
    return options[0]
}

// TODO: I think there is probably a bug where you are passing in the wrong state here.
export function replaySpecForStage(state: MetaState, replayData: StageReplayData): GameSpec {
    return {
        ...cloneGameSpec(replayData.spec),
        buffer: replayData.bufferBeforeCourse,
        metaStage: replayData.stage,
        metaStageScores: [...state.data.stageScores],
        metaStagePars: [...state.data.stagePars],
        metaStageTooltips: stageTooltipTexts(state),
        previousScore: replayData.score,
        replayUsedPotionIDs: replayUsedPotionIDs(replayData),
        replayStage: replayData.stage
    }
}

const replaySimulationUI: MetaUI = {
    chooseCard: async <T extends ['card', CardSpec] | ['relic', Relic] | ['potion', Card] | ['event', CardSpec]>(
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
    updateBuffer: (): void => {},
    updateSidebar: (): void => {}
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
        state.ui.updateSidebar(state)
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

const rewardDataInit:{selectedIndex: null, rewardState: true} = {selectedIndex: null, rewardState: true}

async function materializePath(state: MetaState, pathSkeleton: Path, test: TestConfig = {}): Promise<FilledPath> {

    // Materialize rewards only when the path is actually selected.
    const rewardStates = pathSkeleton.rewards.map(kind => {
        switch (kind) {
            case 'encounter': {
                const generator = state.generator(`encounter`).newGenerator()
                return getEncounterState(state, generator, state.data.stage)
            } case 'card': {
                const generator = state.generator(`rewardscard`).newGenerator()
                return {
                    kind: 'card' as const,
                    options: sampleRewards(
                        generator,
                        cardRewards,
                        getRewardOptionCount(state, 'card'),
                        state.data.collectedCards
                    ),
                    data: rewardDataInit
                }
            } case 'event': {
                const generator = state.generator(`rewardsevent`).newGenerator()
                return {
                    kind: 'event' as const,
                    options: sampleRewards(
                        generator,
                        eventRewards,
                        getRewardOptionCount(state, 'event'),
                        state.data.collectedEvents
                    ),
                    data: rewardDataInit
                }
            } case 'potion': {
                const generator = state.generator(`rewardspotion`).newGenerator()
                return {
                    kind: 'potion' as const,
                    options: generator.samples(potionRewards, getRewardOptionCount(state, 'potion')),
                    data: rewardDataInit
                }
            } case 'relic': {
                const generator = state.generator(`rewardsrelic`).newGenerator()
                return {
                    kind: 'relic' as const,
                    options: sampleEligibleRelicRewards(generator, getRewardOptionCount(state, 'relic'), state),
                    data: rewardDataInit
                }
            }
        }
    })
    const burdenGenerator = state.generator(`rewardsburden`).newGenerator()
    const burdenStates: BurdenState[] = []
    for (let i = 0; i < pathSkeleton.burdens; i++) {
        burdenStates.push(await sampleBurdenState(state, burdenGenerator))
    }
    for (const item of test[state.data.stage + 1] ?? []) {
        switch (item[0]) {
            case 'burdens':
                burdenStates.push({
                    options: item[1],
                    selectedIndices: [],
                    numRequired: 1,
                     rewardState: true
                 })
                break
            case 'potions':
                rewardStates.push({
                    kind: 'potion',
                    options: item[1],
                    data: rewardDataInit
                })
                break
            case 'events':
                rewardStates.push({
                    kind: 'event',
                    options: item[1],
                    data: rewardDataInit
                })
                break
            case 'cards':
                rewardStates.push({
                    kind: 'card',
                    options: item[1],
                    data: rewardDataInit
                })
                break
            case 'encounter':
                const generator = state.generator('test')
                rewardStates.push({
                    kind: 'encounter',
                    encounter: item[1],
                    data: item[1].createInitialData(state, generator)
                })
                break
            case 'relics':
                rewardStates.push({
                    kind: 'relic',
                    options: item[1],
                    data: rewardDataInit
                })
                break
        }
    }
    return { rewardStates, burdenStates }
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
            if (effect.destroyIfEmpty && nextCharge === 0) {
                await removeRelic(state, relic.id)
            }
        }
    }
}

type NormalizedTestItem = ['victory', VPMode]
    | ['boon', Boon] 
    | ['curse', Curse]
    | ['burdens', Burden[]]
    | ['potions', CardSpec[]]
    | ['relics', RelicSpec[]]
    | ['cards', CardSpec[]]
    | ['events', CardSpec[]]
    | ['encounter', Encounter]

export type TestItem = NormalizedTestItem
    | ['burden', Burden]
    | ['allBurdens']
    | ['potion', CardSpec]
    | ['allPotions']
    | ['relic', RelicSpec]
    | ['allRelics']
    | ['card', CardSpec]
    | ['allCards']
    | ['event', CardSpec]
    | ['allEvents']

export interface TestConfig {[stage: number]: NormalizedTestItem[]}
export interface RawTestConfig {[stage: number]: TestItem[]}

function assertNever(x: never): never {
  throw new Error(x)
}

export function normalizeTests(raw: RawTestConfig): TestConfig {
    const result = {} as TestConfig
    for (const stage in raw) {
        const items = raw[stage]
        result[stage] = items.map(item => {
            switch (item[0]) {
                case 'victory':
                case 'boon':
                case 'curse':
                case 'cards':
                case 'events':
                case 'potions':
                case 'relics':
                case 'burdens':
                case 'encounter':
                     return item
                case 'card':
                    return ['cards', [item[1]]]
                case 'event':
                    return ['events', [item[1]]]
                case 'potion':
                    return ['potions', [item[1]]]
                case 'relic':
                    return ['relics', [item[1]]]
                case 'burden':
                    return ['burdens', [item[1]]]
                 case 'allCards':
                    return ['cards', [...cardRewards]]
                case 'allEvents':
                    return ['events', [...eventRewards]]
                case 'allPotions':
                    return ['potions', [...potionRewards]]
                case 'allRelics':
                    return ['relics', [...relicRewards]]
                case 'allBurdens':
                    return ['burdens', [...burdenRegistry]]
                default:
                    return assertNever(item[0])
            }
        })
    }
    return result
}

function challengeOverridesForStage(
    tests: TestConfig,
    stageIndex: number,
    pathIndex: number
): ChallengeOverrides {
    if (pathIndex !== 0) return {}
    const stageNumber = stageIndex + 1
    const overrides: ChallengeOverrides = {}
    const stageTests = tests[stageNumber] ?? []
    for (const item of stageTests) {
        switch (item[0]) {
            case 'victory':
                overrides.vpMode = item[1]
                break
            case 'boon':
                overrides.boon = item[1]
                break
            case 'curse':
                overrides.curse = item[1]
                break
        }
    }
    return overrides
}

export async function playGame(
    ui: MetaUI,
    test: TestConfig = {},
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
    let flushSave: (() => void) | null = null
    if (onStateChange) {
        let saveTimer: ReturnType<typeof setTimeout> | null = null
        const doSave = () => onStateChange!(serializeMetaGame(state))
        state.setChangeListener(() => {
            if (saveTimer !== null) clearTimeout(saveTimer)
            saveTimer = setTimeout(() => { saveTimer = null; doSave() }, 200)
        })
        flushSave = () => {
            if (saveTimer !== null) { clearTimeout(saveTimer); saveTimer = null }
            doSave()
        }
    }
    const activeTests = state.debugEnabled ? normalizeTests(test) : {}

    if (!initialSnapshot) {
        const initialChallenges = sampleChallengesForStage(state, getNumChallengeOptions(state), activeTests)
        const initialPath = await materializePath(state,{
            label: 'Go left',
            onSelectEffects: [],
            rewards: ['card', 'card', 'event', 'potion'] as RewardKind[],
            burdens: 0,
        }, activeTests)
        state.replaceAndClearHistory({
            ...initialPath,
            challenges: initialChallenges,
            phase: 'stage_select',
            availablePaths: [],
        })
    } else {
        flushSave?.()
    }
    state.ui.updateBuffer(state)
    while (true) {
        try {
            if (state.data.phase === 'in_game') {
                const sameReplay = (a: number[], b: number[]): boolean =>
                    a.length === b.length && a.every((value, index) => value === b[index])
                const stage = state.data.stage
                // challenges[0] is the selected challenge (set when user clicks a challenge button)
                state.ui.updateSidebar(state)
                const gameSpec = makeSpec(state, getSelectedChallenge(state.data), state.data.selectedChallengeIndex)
                const startingBuffer = state.data.buffer
                // Pass saved game state for replay (from previous redo)
                const { score, potionsRemaining, history, macros, viewingMacros } = await state.ui.playGame(
                    gameSpec,
                    state.data.gameHistory,
                    state.data.gameRedo,
                    state.global.macros,
                    state.global.viewingMacros,
                    progress => {
                        state.update({
                            gameHistory: [...progress.history],
                            gameRedo: [...progress.redo],
                        })
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
                        ...getSelectedChallenge(state.data),
                        boons: [...getSelectedChallenge(state.data).boons]
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
                    challenge: challengeSummaryWithState(getSelectedChallenge(state.data), state),
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
                const skeletons = await makePaths(state)
                state.replaceAndClearHistory({
                    phase: 'path_select',
                    challenges: [],
                    selectedChallengeIndex: undefined,
                    rewardStates: [],
                    burdenStates: [],
                    availablePaths: skeletons,
                })
            } else if (state.data.phase === 'path_select') {
                const paths = state.data.availablePaths
                if (paths.length === 0) {
                    throw new Error('Invariant violation: path_select phase missing available paths')
                }
                let path: Path
                while (true) {
                    try {
                        path = await state.ui.pickPath(state, paths)
                        break
                    } catch (e) {
                        if (e instanceof ReplayStage) {
                            await replayCompletedStage(state, e.stage)
                            continue
                        }
                        throw e
                    }
                }
                const materialized = await materializePath(state, path, activeTests)
                await applyPathOnSelectEffects(state, path)
                const nextStage = state.data.stage
                const challenges = sampleChallengesForStage(state, getNumChallengeOptions(state), activeTests)
                state.replaceAndClearHistory({
                    ...materialized,
                    challenges,
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
                // Store which challenge was selected
                const selectedChallengeIndex = state.data.challenges.indexOf(selectedChallenge)
                state.update({ selectedChallengeIndex, availablePaths: [] })
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
    flushSave?.()
}
