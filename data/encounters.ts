// data/encounters.ts - Encounter definitions using inline reward options
// Each encounter provides createInitialData and getOptions methods

import { Encounter, registerEncounter, RewardOption,
    MetaState, MetaTransform,
    addBuffer, gainCard, gainEvent, gainPotion, gainRelic,
    RelicSpec, Relic,
    GainRelicEvent,
    GameSetupParams,
    compose,
} from '../metaLogic.js'
import { emptyBottle, inkwell } from './relics.js'
import { create, State, Card, CardSpec, CardUpgrade,
    cardRewards, eventRewards, relicRewards, potionRewards,
    cardSpecEffects,
    leq,
    coin,
    cardSpecCost,
    cardSpecName,
    actionsEffect,
    coinsEffect,
    free
} from '../gameLogic.js'

import { Generator } from '../rng.js'
import { accelerate, duplicate } from './events.js'
import { geminiBrew, mirrorBrew, potionOfEchoes, potionOfReflection } from './potions.js'

// ----------------------------- Helper Functions

function bottledCard(spec: CardSpec): RelicSpec {
    const displayName = cardSpecName(spec)
    return {
        name: `Bottled ${displayName}`,
        triggers: [{
            kind: 'gameStart',
            text: `Start each course with a copy of ${displayName} in hand.`,
            handles: () => true,
            transform: () => async function (state: State) {
                state = await create(spec, 'hand')(state)
                return state
            }
        }],
        relatedCards: [spec]
    }
}

function bottledEventPotion(
    spec: CardSpec,
    options: { useUnderlyingEvent?: boolean } = {}
): CardSpec {
    const displayName = cardSpecName(spec)
    const copiedEffects = cardSpecEffects(spec)
    const useUnderlyingEvent = options.useUnderlyingEvent ?? true
    const copiedText = copiedEffects.flatMap(effect => effect.text)
    const displayText = spec.simpleText
        ? [...spec.simpleText]
        : (copiedText.length > 0 ? copiedText : [`Use ${displayName}.`])

    const effects = useUnderlyingEvent
        ? [{
            text: copiedText.length > 0 ? copiedText : [`Use ${displayName}.`],
            transform: (_state: State, sourceCard: Card) => async function (state: State) {
                const target = state.events.find(event => event.name === displayName)
                if (!target) {
                    return state
                }
                return target.use(sourceCard)(state)
            }
        }]
        : copiedEffects

    return {
        name: `Bottled ${displayName}`,
        isPotion: true,
        simpleText: displayText,
        relatedCards: [spec],
        rules: spec.rules ? [...spec.rules] : undefined,
        effects,
    }
}

function upgradeCardSpec(spec: CardSpec, upgrade: CardUpgrade): CardSpec {
    return {
        ...spec,
        upgrades: [...(spec.upgrades || []), upgrade],
    }
}

// Helper to create a simple encounter where clicking any option completes it
function simpleEncounter(config: {
    name: string,
    options: Array<{
        label: string,
        description?: string,
        spec?: CardSpec,
        transform: MetaTransform,
        disabled?: (state: MetaState) => boolean
    }>
}): Encounter {
    return {
        name: config.name,
        createInitialData: () => ({ selectedIndex: null as number | null }),
        getOptions(data: unknown, metaState: MetaState): RewardOption[] {
            const { selectedIndex } = data as { selectedIndex: number | null }
            return config.options.map((opt, i) => ({
                label: opt.label,
                description: opt.description,
                spec: opt.spec,
                disabled: selectedIndex !== null || (opt.disabled ? opt.disabled(metaState) : false),
                checked: selectedIndex === i,
                onClick: async () => ({
                    newData: { selectedIndex: i },
                    transform: opt.transform
                })
            }))
        }
    }
}

// ----------------------------- Encounters

// Find a Bottle encounter
// Note: "Bottle a Card" requires a sub-dialog, so we handle it specially
const findABottle: Encounter = {
    name: 'Find a Bottle',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasCards = metaState.data.collectedCards.filter(
            x => leq(cardSpecCost(x, 'buy') || free, coin(5))
        ).length > 0

        return [
            {
                label: 'Bottle a Card',
                description: 'Lose a card costing up to $5. Gain a relic that starts each course with a copy.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async () => {
                    // Open sub-dialog to choose card
                    const card = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a card to bottle:',
                        [...metaState.data.collectedCards.filter(x => leq(cardSpecCost(x, 'buy') || free, coin(5)))],
                        true
                    )
                    if (!card) {
                        // User cancelled, don't change state
                        return { newData: data }
                    }
                    return {
                        newData: { selectedIndex: 0 },
                        transform: async (state: MetaState) => {
                            state.removeCard(card.name)
                            await gainRelic(bottledCard(card))(state)
                        }
                    }
                }
            },
            {
                label: 'Gain Empty Bottle',
                description: 'Each time you add a card to your deck, start the course with a copy.',
                disabled: selectedIndex !== null,
                checked: selectedIndex === 1,
                onClick: async () => ({
                    newData: { selectedIndex: 1 },
                    transform: gainRelic(emptyBottle)
                })
            }
        ]
    }
}
registerEncounter(findABottle)

// Mirror Maker encounter
const mirrorName = 'Silver Mirror'
const mirrorRelic: RelicSpec = {
    name: mirrorName,
    simpleText: [
        'The next time you gain a relic,',
        'gain an additional copy of that relic.'
    ],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, s: MetaState, relic: Relic) => e.relic.name != mirrorName,
        transform: (e: GainRelicEvent, s: MetaState, relic: Relic) => async function (state: MetaState) {
            await gainRelic(e.relic.spec)(state)
            state.removeRelic(relic.id)
        },
    }]
}

const mirrorMaker: Encounter = {
    name: 'Mirror Maker',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasRelics = metaState.data.relics.length > 0

        return [
            {
                label: 'Grind the mirror into a potion',
                description: 'Gain a Mirror Brew.',
                disabled: selectedIndex !== null,
                checked: selectedIndex === 0,
                onClick: async () => ({
                    newData: { selectedIndex: 0 },
                    transform: gainPotion(mirrorBrew)
                })
            },
            {
                label: 'Use the mirror',
                description: 'Copy one of your relics.',
                disabled: selectedIndex !== null || !hasRelics,
                checked: selectedIndex === 1,
                onClick: async () => {
                    const relicSpecs = metaState.data.relics.map(r => r.spec)
                    const relic = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a relic to duplicate:',
                        relicSpecs,
                        true
                    )
                    if (!relic) {
                        return { newData: data }
                    }
                    return {
                        newData: { selectedIndex: 1 },
                        transform: gainRelic(relic)
                    }
                }
            },
            {
                label: 'Take the mirror for the road',
                description: 'The next time you gain a relic, gain another copy.',
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async () => ({
                    newData: { selectedIndex: 2 },
                    transform: gainRelic(mirrorRelic)
                })
            }
        ]
    }
}
registerEncounter(mirrorMaker)

const polishUpgrade: CardUpgrade = {
    name: name => `${name}+`,
    effects: [coinsEffect(1)],
}

const sharpenUpgrade: CardUpgrade = {
    name: name => `${name}+`,
    effects: [actionsEffect(1)],
}

const redesignUpgrade: CardUpgrade = {
    name: name => `${name}+`,
    cost: (cost, kind) => kind === 'buy'
        ? { ...cost, coin: Math.max(cost.coin - 1, 1) }
        : cost,
}

export const blacksmith: Encounter = {
    name: 'The Blacksmith',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number) => {
            const card = await metaState.ui.chooseCard(
                metaState,
                'Choose a card to upgrade:',
                [...metaState.data.collectedCards],
                true
            )
            if (!card) {
                return { newData: data }
            }
            return {
                newData: { selectedIndex: index },
                transform: async (state: MetaState) => {
                    const updated = upgradeCardSpec(card, upgrade)
                    const cards = [...state.data.collectedCards]
                    const cardIndex = cards.indexOf(card)
                    if (cardIndex >= 0) {
                        cards[cardIndex] = updated
                        state.update({ collectedCards: cards })
                    }
                }
            }
        }

        return [
            {
                label: 'Polish',
                description: 'Add +$1 to a card.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(polishUpgrade, 0),
            },
            {
                label: 'Sharpen',
                description: 'Add +1 action to a card.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(sharpenUpgrade, 1),
            },
            {
                label: 'Redesign',
                description: 'Reduce the buy cost by $1 (not below $1).',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(redesignUpgrade, 2),
            }
        ]
    }
}
registerEncounter(blacksmith)

interface BreweryData {
    selectedIndex: number | null
    shelfPotion: CardSpec
}

export const brewery: Encounter = {
    name: 'Brewery',
    createInitialData(_metaState: MetaState, generator: Generator): BreweryData {
        const shelfOptions: CardSpec[] = [
            potionOfEchoes,
            potionOfReflection,
            { ...geminiBrew, name: 'Gemini Potion' },
            bottledEventPotion(duplicate, { useUnderlyingEvent: false }),
            bottledEventPotion(accelerate, { useUnderlyingEvent: false }),
        ]
        return {
            selectedIndex: null,
            shelfPotion: generator.sample(shelfOptions),
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as BreweryData
        const hasEvents = metaState.data.collectedEvents.length > 0

        return [
            {
                label: 'Bottle an event',
                description: 'Choose an event to bottle. Gain a potion that uses that event.',
                disabled: d.selectedIndex !== null || !hasEvents,
                checked: d.selectedIndex === 0,
                onClick: async () => {
                    const event = await metaState.ui.chooseCard(
                        metaState,
                        'Choose an event to bottle:',
                        [...metaState.data.collectedEvents],
                        true
                    )
                    if (!event) {
                        return { newData: data }
                    }
                    return {
                        newData: { ...d, selectedIndex: 0 },
                        transform: gainPotion(bottledEventPotion(event)),
                    }
                }
            },
            {
                label: 'Take one from the shelf',
                description: `Gain ${d.shelfPotion.name}.`,
                spec: d.shelfPotion,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 1 },
                    transform: gainPotion(d.shelfPotion),
                })
            }
        ]
    }
}
registerEncounter(brewery)

// Variety Pack encounter - pre-generates options at creation time
const varietyPack: Encounter = {
    name: 'Variety Pack',
    createInitialData(metaState: MetaState, generator: Generator) {
        return {
            selectedIndex: null as number | null,
            offerCard: generator.sample(cardRewards),
            offerEvent: generator.sample(eventRewards),
            offerPotion: generator.sample(potionRewards),
            offerRelic: generator.sample(relicRewards)
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex, offerCard, offerEvent, offerPotion, offerRelic } = data as {
            selectedIndex: number | null,
            offerCard: CardSpec,
            offerEvent: CardSpec,
            offerPotion: CardSpec,
            offerRelic: RelicSpec
        }

        const currentData = { selectedIndex, offerCard, offerEvent, offerPotion, offerRelic }
        return [
            {
                label: 'Take Card',
                spec: offerCard,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 0,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 0 },
                    transform: gainCard(offerCard)
                })
            },
            {
                label: 'Take Event',
                spec: offerEvent,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 1 },
                    transform: gainEvent(offerEvent)
                })
            },
            {
                label: 'Take Potion',
                spec: offerPotion,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 2 },
                    transform: gainPotion(offerPotion)
                })
            },
            {
                label: 'Take Relic',
                spec: offerRelic,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 3,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 3 },
                    transform: gainRelic(offerRelic)
                })
            }
        ]
    }
}
registerEncounter(varietyPack)

// Trading Post encounter - allows multiple trades
interface TradingPostData {
    offerCard: CardSpec
    offerEvent: CardSpec
    offerPotion: CardSpec
    offerRelic: RelicSpec
    cardTraded: boolean
    eventTraded: boolean
    potionTraded: boolean
    relicTraded: boolean
    finished: boolean
}

const tradingPost: Encounter = {
    name: 'Trading Post',
    createInitialData(metaState: MetaState, generator: Generator): TradingPostData {
        return {
            offerCard: generator.sample(cardRewards),
            offerEvent: generator.sample(eventRewards),
            offerPotion: generator.sample(potionRewards),
            offerRelic: generator.sample(relicRewards),
            cardTraded: false,
            eventTraded: false,
            potionTraded: false,
            relicTraded: false,
            finished: false
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as TradingPostData

        if (d.finished) {
            // Show completed state
            return [
                { label: 'Trading Complete', disabled: true, checked: true, onClick: async () => ({ newData: data }) }
            ]
        }

        return [
            {
                label: `Trade Card for ${d.offerCard.name}`,
                description: 'Give up one of your cards to receive this one.',
                disabled: d.cardTraded || metaState.data.collectedCards.length === 0,
                checked: d.cardTraded,
                onClick: async () => {
                    const card = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a card to trade away:',
                        [...metaState.data.collectedCards],
                        true
                    )
                    if (!card) return { newData: data }
                    return {
                        newData: { ...d, cardTraded: true },
                        transform: async (state: MetaState) => {
                            state.removeCard(card.name)
                            await gainCard(d.offerCard)(state)
                        }
                    }
                }
            },
            {
                label: `Trade Event for ${d.offerEvent.name}`,
                description: 'Give up one of your events to receive this one.',
                disabled: d.eventTraded || metaState.data.collectedEvents.length === 0,
                checked: d.eventTraded,
                onClick: async () => {
                    const event = await metaState.ui.chooseCard(
                        metaState,
                        'Choose an event to trade away:',
                        [...metaState.data.collectedEvents],
                        true
                    )
                    if (!event) return { newData: data }
                    return {
                        newData: { ...d, eventTraded: true },
                        transform: async (state: MetaState) => {
                            state.removeEvent(event.name)
                            await gainEvent(d.offerEvent)(state)
                        }
                    }
                }
            },
            {
                label: `Trade Potion for ${d.offerPotion.name}`,
                description: 'Give up one of your potions to receive this one.',
                disabled: d.potionTraded || metaState.data.potions.length === 0,
                checked: d.potionTraded,
                onClick: async () => {
                    const potion = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a potion to trade away:',
                        [...metaState.data.potions],
                        true
                    )
                    if (!potion) return { newData: data }
                    return {
                        newData: { ...d, potionTraded: true },
                        transform: async (state: MetaState) => {
                            state.removePotion(potion.id)
                            await gainPotion(d.offerPotion)(state)
                        }
                    }
                }
            },
            {
                label: `Trade Relic for ${d.offerRelic.name}`,
                description: 'Give up one of your relics to receive this one.',
                disabled: d.relicTraded || metaState.data.relics.length === 0,
                checked: d.relicTraded,
                onClick: async () => {
                    const relic = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a relic to trade away:',
                        metaState.data.relics,
                        true
                    )
                    if (!relic) return { newData: data }
                    return {
                        newData: { ...d, relicTraded: true },
                        transform: async (state: MetaState) => {
                            state.removeRelic(relic.id)
                            await gainRelic(d.offerRelic)(state)
                        }
                    }
                }
            },
            {
                label: 'Finish Trading',
                description: 'Done making trades.',
                disabled: false,
                checked: false,
                onClick: async () => ({
                    newData: { ...d, finished: true }
                })
            }
        ]
    }
}
registerEncounter(tradingPost, { minStage: 4 })

// The Scribe encounter
const cursedInkwell: RelicSpec = {
    name: 'Cursed Inkwell',
    simpleText: ['Par is 1@ lower on each course.'],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 1 })
    }]
}

const theScribe: Encounter = simpleEncounter({
    name: 'The Scribe',
    options: [
        {
            label: 'Take the Inkwell',
            description: 'Par is 1@ higher on each course.',
            transform: gainRelic(inkwell)
        },
        {
            label: 'Use the quill',
            description: '+3@ buffer.',
            transform: addBuffer(3)
        },
        {
            label: 'Use the cursed quill',
            description: '+5@ buffer, but par is 1@ lower on each course.',
            transform: compose(addBuffer(5), gainRelic(cursedInkwell))
        }
    ]
})
registerEncounter(theScribe, { maxStage: 4 })

// Export for testing
export { tradingPost, findABottle }
