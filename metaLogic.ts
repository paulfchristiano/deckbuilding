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
    VictoryData
 } from './gameLogic.js'

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
    // Choose from a list of cards (for rewards, encounters, etc.)
    chooseCard<T extends CardSpec | Card>(
        state: MetaState,
        prompt: string,
        options: T[],
        canCancel?: boolean
    ): Promise<T | null>

    playGame(spec: GameSpec): Promise<VictoryData>

    pickNextStep(state: MetaState): Promise<ChallengeOrReward>

    pickPath(state: MetaState, paths: Path[]): Promise<Path>

    // Choose from generic options (for encounters with non-card choices)
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

// --------------------- Encounters


export type EncounterFactory = (state: MetaState, generator: Generator) => Encounter

// Encounter registration with stage constraints
interface EncounterRegistration {
    factory: EncounterFactory
    minStage: number
    maxStage: number
}

const encounterRegistry: EncounterRegistration[] = []

export function registerEncounter(
    factory: EncounterFactory,
    options?: { minStage?: number, maxStage?: number }
) {
    encounterRegistry.push({
        factory,
        minStage: options?.minStage ?? 0,
        maxStage: options?.maxStage ?? 7
    })
}

export function getEncounter(state: MetaState, generator: Generator, stage: number): Encounter {
    const available = encounterRegistry.filter(e => e.minStage <= stage && stage <= e.maxStage)
    const registration = generator.sample(available)
    return registration.factory(state, generator)
}

// ----------------------------- Constants

export const TOTAL_STAGES = 8
export const INITIAL_BUFFER = 10

// Base par values for each stage
export const BASE_PARS: number[] = [30, 27, 25, 23, 21, 19, 18, 8]

// ----------------------------- Meta-game Types

// This defines a challenge. It will be combined with the user's deck, and then acted on by relics, to get a spec.
export interface ChallengeSpec {
    stage: number,
    vpMode: VPMode,
    boons: Boon[],
}

// TODO: add a tooltip that shows you the par and target, the cards, etc.
export function renderChallenge(spec: ChallengeSpec, state: MetaState): string {
    const gameSpec:GameSpec = makeSpec(state, spec)
    return `${spec.vpMode.name} + ${spec.boons.map(b => b.name).join(' + ')} (${gameSpec.vp}vp in ${gameSpec.par}@)`
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
    rewards: Reward[]
    challenge: ChallengeSpec
}

export type RewardKind = 'card' | 'event' | 'potion' | 'relic' | 'encounter'

export type RewardResult = string | null

export interface Encounter {
    name: string
    transform: (state:MetaState) => Promise<RewardResult>
}

// A pending reward that the player can claim
export type Reward = {result: RewardResult} & ({
    kind: 'card' | 'event' | 'potion',
    options: CardSpec[]
} | {
    kind: 'relic',
    options: RelicSpec[]
} | {
    kind: 'encounter'
    encounter: Encounter
})

async function doReward(state:MetaState, rewardIndex: number) {
    const reward = state.data.rewards[rewardIndex]
    switch (reward.kind) {
        case 'encounter':
            const result = await reward.encounter.transform(state)
            markRewardResult(state, rewardIndex, result)
            return
        case 'card':
            const card = await state.ui.chooseCard(state, 'Choose a card reward', reward.options)
            if (card !== null) {
                await gainCard(card)(state)
                markRewardResult(state, rewardIndex, card.name)
            }
            return
        case 'event':
            const event = await state.ui.chooseCard(state, 'Choose an event reward:', reward.options)
            if (event !== null) {
                await gainEvent(event)(state)
                markRewardResult(state, rewardIndex, event.name)
            }
            return
        case 'potion':
            const potion = await state.ui.chooseCard(state, 'Choose a potion reward:', reward.options)
            if (potion !== null) {
                await gainPotion(potion)(state)
                markRewardResult(state, rewardIndex, potion.name)
            }
            return
        case 'relic':
            const relic = await state.ui.chooseCard(state, 'Choose a relic reward:', reward.options)
            if (relic !== null) {
                await gainRelic(relic)(state)
                markRewardResult(state, rewardIndex, relic.name)
            }
            return
    }
}

// ----------------------------- MetaState

export interface MetaStateData {
    // Current stage (1-8)
    stage: number

    // Current kingdom configuration (null if not yet selected)
    challenge: ChallengeSpec | null

    // Score tracking
    stageScores: (number | null)[]
    stagePars: (number | null)[]

    // Buffer (life total)
    buffer: number

    // Pending rewards for current stage
    rewards: Reward[]

    // Collected cards/events (persist across stages)
    collectedCards: CardSpec[]
    collectedEvents: CardSpec[]

    // Potions and relics (persist across stages)
    potions: Card[]
    relics: Relic[]

    nextID: number

    playingGame: boolean

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
            challenge: null,
            rewards: [],
            collectedCards: [],
            collectedEvents: [],
            potions: [],
            relics: [],
            nextID: 1,
            playingGame: false,
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
        console.assert(this.data.challenge != null) // Should not a set checkpoint while selecting paths.
    }

    setCheckpoint() {
        console.assert(this.data.challenge != null) // Should not a set checkpoint while selecting paths.
        this.undoStack.push(this.checkpoint)
        this.checkpoint = this.data
        this.redoStack = []
    }
    
    update(updates: Partial<MetaStateData>) {
        this.data = {...this.data, ...updates}
    }
    
    // Undo to previous checkpoint
    undo() {
        if (this.checkpoint != this.data) this.data = this.checkpoint; 
        if (this.undoStack.length == 0) return
        const previousCheckpoint = this.undoStack.pop()!
        this.redoStack.push(this.checkpoint)
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

// Mark a reward as used with selected card
export function markRewardResult(state: MetaState, index: number, result: string | null) {
    const rewards = [...state.data.rewards]
    if (index >= 0 && index < rewards.length) {
        rewards[index] = { ...rewards[index], result: result }
    }
    state.update({rewards})
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
    challenge: ChallengeSpec
}

function makePaths(state: MetaState): PathSkeleton[] {
    const stage = state.data.stage
    const generator = state.generator(`paths${stage}`).newGenerator()
    const allOptions: RewardKind[] = ['card', 'card', 'event', 'potion', 'relic', 'encounter']
    const shuffledOptions = generator.samples(allOptions, 4)
    const challenge1 = randomChallenge(state)
    const challenge2 = randomChallenge(state)
    return [
        { rewards: shuffledOptions.slice(0, 2), challenge: challenge1 },
        { rewards: shuffledOptions.slice(2, 4), challenge: challenge2 },
    ]
}

// TODO: actually create these in gameLogic and then then fill them in the ./data files
import { potionRewards, relicRewards } from './gameLogic.js'

// TODO: avoid repeating (by passing in a list of already-chosen items to avoid, and making the PRG re-sample after hitting one)
function fillPath(state: MetaState, skeleton: PathSkeleton): Path {
    const rewards: Reward[] = []
    for (const rewardKind of skeleton.rewards) {
        // Generate options for each reward
        // For now, just use placeholder empty arrays
        const generator = state.generator(`rewards${rewardKind}`).newGenerator()
        if (rewardKind === 'encounter') {
            const encounter = getEncounter(state, generator, state.data.stage)
            rewards.push({kind: 'encounter', encounter: encounter, result: null})
        } else if (rewardKind === 'card') {
            const options = generator.samples(cardRewards, getRewardOptionCount(state), state.data.collectedCards)
            rewards.push({ kind: 'card', options: options, result: null })
        } else if (rewardKind === 'event') {
            const options = generator.samples(eventRewards, getRewardOptionCount(state), state.data.collectedEvents)
            rewards.push({ kind: 'event', options: options, result: null })
        } else if (rewardKind === 'potion') {
            const options = generator.samples(potionRewards, getRewardOptionCount(state))
            rewards.push({ kind: 'potion', options: options, result: null })
        } else if (rewardKind === 'relic') {
            const options = generator.samples(relicRewards, getRewardOptionCount(state))
            rewards.push({ kind: 'relic', options: options, result: null })
        }
    }
    return { rewards: rewards, challenge: skeleton.challenge }
}

// ------------------ Meta loop -------------------

export type ChallengeOrReward = {kind: 'challenge'} | {kind: 'reward', index: number}

export class Undo extends Error {
    constructor() {
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

function adoptPath(state:MetaState, path: Path) {
    state.update({challenge: path.challenge, rewards: path.rewards})
}

// We can define test in order to get a given reward immediately, for testing purposes.

export type TestSpec = ['potion', CardSpec] | ['relic', RelicSpec] | ['card', CardSpec] | ['event', CardSpec] | ['encounter', EncounterFactory]

function makeTestReward(state: MetaState, spec: TestSpec): Reward {
    switch (spec[0]) {
        case 'potion':
        case 'event':
        case 'card':
        case 'relic':
            return {kind: spec[0], options: [spec[1]], result: null}
        case 'encounter':
            const generator = state.generator('test')
            const factory = spec[1]
            return {kind: 'encounter', encounter: factory(state, generator), result: null}
    }

}

// TODO: implement undo (figure out how it is done right now).
// Note that all checkpoints are at a point where you want to back into the main loop in this method.
export async function playGame(ui: MetaUI, test:null|TestSpec = null): Promise<void> {
    const state: MetaState = new MetaState(ui)
    const initialPath = fillPath(state, {
        rewards: ['card', 'card', 'event', 'potion'] as RewardKind[],
        challenge: randomChallenge(state)
    })
    if (test !== null) initialPath.rewards.push(makeTestReward(state, test));
    adoptPath(state, initialPath)
    state.clearHistory()
    while (true) {
        console.assert(state.checkpoint == state.data) // Should always be at a checkpoint when starting this loop
        try {
            if (state.data.playingGame) {
                const gameSpec = makeSpec(state, state.data.challenge!)
                const { score, potionsRemaining } = await state.ui.playGame(gameSpec)
                state.update({ potions: potionsRemaining })
                await endCourse(score, gameSpec.par, state)
                state.update({ stage: state.data.stage + 1 })
                if (state.data.stage >= TOTAL_STAGES) {
                    // Game over - player has completed all stages
                    await state.ui.showMessage(state, 'Congratulations! You have completed all stages!')
                    return
                }
                const paths = makePaths(state).map(skel => fillPath(state, skel))
                const path: Path = (paths.length > 1) ? await state.ui.pickPath(state, paths) : paths[0]
                state.update({ challenge: path.challenge, rewards: path.rewards, playingGame: false } )
                state.clearHistory()
            } else {
                const challengeOrReward = await state.ui.pickNextStep(state)
                switch (challengeOrReward.kind) {
                    case('challenge'):
                        await trigger({kind: 'start', stage: state.data.stage}, state)
                        state.update({ playingGame: true })
                        state.setCheckpoint()
                        break;
                    case('reward'):
                        await doReward(state, challengeOrReward.index)
                        state.setCheckpoint()
                        break;
                }
            }
        } catch (e) {
            if (e instanceof Undo) {
                state.undo()
            } else if (e instanceof Redo) {
                state.redo()
            } else {
                throw e
            }
        }
    }
}