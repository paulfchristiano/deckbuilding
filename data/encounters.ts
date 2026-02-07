// data/encounters.ts - Encounter definitions using inline reward options
// Each encounter provides createInitialData and getOptions methods

import { Encounter, registerEncounter, RewardOption,
    MetaState, MetaTransform,
    addBuffer, gainCard, gainEvent, gainPotion, gainRelic,
    addTimelineAction,
    RelicSpec,
    GameSetupParams,
    compose,
} from '../metaLogic.js'
import { calledShot, delayedGratification, emptyBottle, giftBox, inkwell, sacredBark, silverMirror } from './relics.js'
import { CardSpec, CardUpgrade,
    cardRewards, eventRewards, relicRewards, potionRewards,
    displayName
} from '../gameLogic.js'

import { Generator } from '../rng.js'
import { mirrorBrew } from './potions.js'
import { makeBottledCardPotion, makeBottledEventPotion } from './specialSpecs.js'
import {
    bulkPurchaseUpgrade,
    fortifyUpgrade,
    polishUpgrade,
    possessUpgrade,
    redesignUpgrade,
    saleUpgrade,
    sharpenUpgrade,
    streetFairUpgrade,
    tacticianAgilityUpgrade,
    tacticianCooperationUpgrade,
    tacticianStrengthUpgrade,
    transmuteUpgrade,
} from './upgrades.js'

// ----------------------------- Helper Functions

function standardRelicRewards(): RelicSpec[] {
    return relicRewards as RelicSpec[]
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

interface DistilleryData {
    selectedIndex: number | null
}

export const distillery: Encounter = {
    name: 'Distillery',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as DistilleryData
        const hasCards = metaState.data.collectedCards.length > 0
        const hasEvents = metaState.data.collectedEvents.length > 0

        return [
            {
                label: 'Bottle a card',
                description: 'Choose a card from your deck, and gain a potion that creates a copy of that card in your hand.',
                disabled: d.selectedIndex !== null || !hasCards,
                checked: d.selectedIndex === 0,
                onClick: async () => {
                    const card = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a card to bottle:',
                        [...metaState.data.collectedCards],
                        true
                    )
                    if (!card) {
                        return { newData: data }
                    }
                    return {
                        newData: { selectedIndex: 0 },
                        transform: gainPotion(makeBottledCardPotion(card), {
                            details: `Bottled card ${displayName(card)}`
                        }),
                    }
                }
            },
            {
                label: 'Bottle an event',
                description: 'Choose an event from your deck, and gain a potion that uses that event for free.',
                disabled: d.selectedIndex !== null || !hasEvents,
                checked: d.selectedIndex === 1,
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
                        newData: { selectedIndex: 1 },
                        transform: gainPotion(makeBottledEventPotion(event), {
                            details: `Bottled event ${displayName(event)}`
                        }),
                    }
                }
            },
            {
                label: 'Gift Box',
                spec: giftBox,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 2,
                onClick: async () => ({
                    newData: { selectedIndex: 2 },
                    transform: gainRelic(giftBox)
                })
            },
            {
                label: 'Empty Bottle',
                spec: emptyBottle,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 3,
                onClick: async () => ({
                    newData: { selectedIndex: 3 },
                    transform: gainRelic(emptyBottle)
                })
            }
        ]
    }
}
registerEncounter(distillery)

// Mirror Maker encounter
export const mirrorMaker: Encounter = {
    name: 'Mirror Maker',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasRelics = metaState.data.relics.length > 0

        return [
            {
                label: 'Distill the mirror',
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
                        transform: gainRelic(relic, {
                            details: `Mirrored ${displayName(relic)}`
                        })
                    }
                }
            },
            {
                label: 'Take the mirror for the road',
                description: 'The next time you gain a relic, gain two additional copies.',
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async () => ({
                    newData: { selectedIndex: 2 },
                    transform: gainRelic(silverMirror)
                })
            }
        ]
    }
}
registerEncounter(mirrorMaker)

export const blacksmith: Encounter = {
    name: 'The Blacksmith',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string) => {
            const card = await metaState.ui.chooseCard(
                metaState,
                'Choose a card to upgrade:',
                [...metaState.data.collectedCards],
                true
            )
            if (!card) {
                return { newData: data }
            }
            const chosenName = displayName(card)
            return {
                newData: { selectedIndex: index },
                transform: async (state: MetaState) => {
                    const updated = upgradeCardSpec(card, upgrade)
                    const cards = [...state.data.collectedCards]
                    const cardIndex = cards.indexOf(card)
                    if (cardIndex >= 0) {
                        cards[cardIndex] = updated
                        state.update({ collectedCards: cards })
                        await addTimelineAction(`The Blacksmith: Upgraded ${chosenName} with ${upgradeName}`)(state)
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
                onClick: async () => chooseUpgrade(polishUpgrade, 0, 'Polish'),
            },
            {
                label: 'Sharpen',
                description: 'Add +1 action to a card.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(sharpenUpgrade, 1, 'Sharpen'),
            },
            {
                label: 'Redesign',
                description: 'Reduce the play cost by @1 (not below @0).',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(redesignUpgrade, 2, 'Redesign'),
            }
        ]
    }
}
registerEncounter(blacksmith)

export const enchantress: Encounter = {
    name: 'Enchantress',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string) => {
            const card = await metaState.ui.chooseCard(
                metaState,
                'Choose a card to enchant:',
                [...metaState.data.collectedCards],
                true
            )
            if (!card) {
                return { newData: data }
            }
            const chosenName = displayName(card)
            return {
                newData: { selectedIndex: index },
                transform: async (state: MetaState) => {
                    const updated = upgradeCardSpec(card, upgrade)
                    const cards = [...state.data.collectedCards]
                    const cardIndex = cards.indexOf(card)
                    if (cardIndex >= 0) {
                        cards[cardIndex] = updated
                        state.update({ collectedCards: cards })
                        await addTimelineAction(`Enchantress: Upgraded ${chosenName} with ${upgradeName}`)(state)
                    }
                }
            }
        }

        return [
            {
                label: 'Transmute',
                description: 'After playing this, trash it and buy a card costing up to $2 more.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(transmuteUpgrade, 0, 'Transmute'),
            },
            {
                label: 'Fortify',
                description: 'When this is trashed, create a card costing $1, $2, or $3 more in your hand.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(fortifyUpgrade, 1, 'Fortify'),
            },
            {
                label: 'Possess',
                description: 'When you buy this, trash a card in hand and copy one costing up to $2 more into hand.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(possessUpgrade, 2, 'Possess'),
            }
        ]
    }
}
registerEncounter(enchantress)

export const shopkeeper: Encounter = {
    name: 'Shopkeeper',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string) => {
            const card = await metaState.ui.chooseCard(
                metaState,
                'Choose a card to upgrade:',
                [...metaState.data.collectedCards],
                true
            )
            if (!card) {
                return { newData: data }
            }
            const chosenName = displayName(card)
            return {
                newData: { selectedIndex: index },
                transform: async (state: MetaState) => {
                    const updated = upgradeCardSpec(card, upgrade)
                    const cards = [...state.data.collectedCards]
                    const cardIndex = cards.indexOf(card)
                    if (cardIndex >= 0) {
                        cards[cardIndex] = updated
                        state.update({ collectedCards: cards })
                        await addTimelineAction(`Shopkeeper: Upgraded ${chosenName} with ${upgradeName}`)(state)
                    }
                }
            }
        }

        return [
            {
                label: 'Bulk purchase',
                description: 'Add: whenever you buy this, +1 buy.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(bulkPurchaseUpgrade, 0, 'Bulk purchase'),
            },
            {
                label: 'Street fair',
                description: 'Add: whenever this would be created in discard, create it in hand instead.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(streetFairUpgrade, 1, 'Street fair'),
            },
            {
                label: 'Sale',
                description: 'Reduce buy cost by $2 (not below $1).',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(saleUpgrade, 2, 'Sale'),
            }
        ]
    }
}
registerEncounter(shopkeeper)

export const tactician: Encounter = {
    name: 'Tactician',
    createInitialData: () => ({ selectedIndex: null as number | null }),
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const { selectedIndex } = data as { selectedIndex: number | null }
        const hasEvents = metaState.data.collectedEvents.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string) => {
            const event = await metaState.ui.chooseCard(
                metaState,
                'Choose an event to upgrade:',
                [...metaState.data.collectedEvents],
                true
            )
            if (!event) {
                return { newData: data }
            }
            const chosenName = displayName(event)
            return {
                newData: { selectedIndex: index },
                transform: async (state: MetaState) => {
                    const updated = upgradeCardSpec(event, upgrade)
                    const events = [...state.data.collectedEvents]
                    const eventIndex = events.indexOf(event)
                    if (eventIndex >= 0) {
                        events[eventIndex] = updated
                        state.update({ collectedEvents: events })
                        await addTimelineAction(`Tactician: Upgraded ${chosenName} with ${upgradeName}`)(state)
                    }
                }
            }
        }

        return [
            {
                label: 'Strength',
                description: 'Strength. Upgrade an event. Whenever you use it, use it again.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(tacticianStrengthUpgrade, 0, 'Strength'),
            },
            {
                label: 'Agility',
                description: 'Agility. Upgrade an event. The first three times you use it it costs @ less.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(tacticianAgilityUpgrade, 1, 'Agility'),
            },
            {
                label: 'Cooperation',
                description: 'Cooperation. Upgrade an event. After using it, use another event with equal or lesser cost for free.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(tacticianCooperationUpgrade, 2, 'Cooperation'),
            }
        ]
    }
}
registerEncounter(tactician)

interface PotionShopData {
    selectedIndex: number | null
    offers: CardSpec[]
}

export const potionShop: Encounter = {
    name: 'Potion Shop',
    createInitialData(_metaState: MetaState, generator: Generator): PotionShopData {
        return {
            selectedIndex: null,
            offers: generator.samples(potionRewards, 4),
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as PotionShopData
        const [first, second, third, fourth] = d.offers
        const bundleDetail = `Potion Shop bundle for 3@: with ${displayName(third)} and ${displayName(fourth)}`
        return [
            {
                label: `Take ${displayName(first)}`,
                description: 'Take this potion for free.',
                tooltipSpec: first,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 0,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 0 },
                    transform: gainPotion(first, { details: 'Potion Shop: free sample' }),
                })
            },
            {
                label: `Buy ${displayName(second)}`,
                description: 'Spend 1@ to take this potion.',
                tooltipSpec: second,
                disabled: d.selectedIndex !== null || metaState.data.buffer < 1,
                checked: d.selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 1 },
                    transform: compose(
                        addBuffer(-1),
                        gainPotion(second, { details: 'Potion Shop: paid 1@' })
                    ),
                })
            },
            {
                label: `Buy ${displayName(third)} + ${displayName(fourth)}`,
                description: 'Spend 3@ to take both potions.',
                disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
                checked: d.selectedIndex === 2,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 2 },
                    transform: compose(
                        addBuffer(-3),
                        gainPotion(third, { details: bundleDetail }),
                        gainPotion(fourth, { details: bundleDetail }),
                    ),
                })
            }
        ]
    }
}
registerEncounter(potionShop)

interface PotionLabData {
    selectedIndex: number | null
    offer: CardSpec
}

export const potionLab: Encounter = {
    name: 'Potion Lab',
    createInitialData(_metaState: MetaState, generator: Generator): PotionLabData {
        return {
            selectedIndex: null,
            offer: generator.sample(potionRewards),
        }
    },
    getOptions(data: unknown): RewardOption[] {
        const d = data as PotionLabData
        const offerName = displayName(d.offer)
        return [
            {
                label: 'House special',
                description: `Gain 2 copies of ${offerName}.`,
                tooltipSpec: d.offer,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 0,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 0 },
                    transform: compose(
                        addTimelineAction('Potion Lab: House special', `Gained two ${offerName}`),
                        gainPotion(d.offer, { silent: true }),
                        gainPotion(d.offer, { silent: true }),
                    )
                })
            },
            {
                label: 'Mirror brew',
                spec: mirrorBrew,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 1 },
                    transform: gainPotion(mirrorBrew, { details: 'Potion Lab' }),
                })
            },
            {
                label: 'Sacred bark',
                spec: sacredBark,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 2,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 2 },
                    transform: gainRelic(sacredBark, { details: 'Potion Lab' }),
                })
            }
        ]
    }
}
registerEncounter(potionLab)

// Variety Pack encounter - pre-generates options at creation time
export const varietyPack: Encounter = {
    name: 'Variety Pack',
    createInitialData(metaState: MetaState, generator: Generator) {
        return {
            selectedIndex: null as number | null,
            offerCard: generator.sample(cardRewards),
            offerEvent: generator.sample(eventRewards),
            offerPotion: generator.sample(potionRewards),
            offerRelic: generator.sample(standardRelicRewards())
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
        const allOptionNames = [
            displayName(offerCard),
            displayName(offerEvent),
            displayName(offerPotion),
            displayName(offerRelic),
        ]
        return [
            {
                label: 'Take Card',
                spec: offerCard,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 0,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 0 },
                    transform: gainCard(offerCard, { skipped: allOptionNames.filter((_, i) => i !== 0) })
                })
            },
            {
                label: 'Take Event',
                spec: offerEvent,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 1 },
                    transform: gainEvent(offerEvent, { skipped: allOptionNames.filter((_, i) => i !== 1) })
                })
            },
            {
                label: 'Take Potion',
                spec: offerPotion,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 2 },
                    transform: gainPotion(offerPotion, { skipped: allOptionNames.filter((_, i) => i !== 2) })
                })
            },
            {
                label: 'Take Relic',
                spec: offerRelic,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 3,
                onClick: async () => ({
                    newData: { ...currentData, selectedIndex: 3 },
                    transform: gainRelic(offerRelic, { skipped: allOptionNames.filter((_, i) => i !== 3) })
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
}

const tradingPost: Encounter = {
    name: 'Trading Post',
    createInitialData(metaState: MetaState, generator: Generator): TradingPostData {
        return {
            offerCard: generator.sample(cardRewards),
            offerEvent: generator.sample(eventRewards),
            offerPotion: generator.sample(potionRewards),
            offerRelic: generator.sample(standardRelicRewards()),
            cardTraded: false,
            eventTraded: false,
            potionTraded: false,
            relicTraded: false
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as TradingPostData

        return [
            {
                label: `Trade Card for ${displayName(d.offerCard)}`,
                description: 'Give up one of your cards to receive this one.',
                tooltipSpec: d.offerCard,
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
                            await gainCard(d.offerCard, {
                                details: `Traded away ${displayName(card)}`
                            })(state)
                        }
                    }
                }
            },
            {
                label: `Trade Event for ${displayName(d.offerEvent)}`,
                description: 'Give up one of your events to receive this one.',
                tooltipSpec: d.offerEvent,
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
                            await gainEvent(d.offerEvent, {
                                details: `Traded away ${displayName(event)}`
                            })(state)
                        }
                    }
                }
            },
            {
                label: `Trade Potion for ${displayName(d.offerPotion)}`,
                description: 'Give up one of your potions to receive this one.',
                tooltipSpec: d.offerPotion,
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
                            await gainPotion(d.offerPotion, {
                                details: `Traded away ${displayName(potion.spec)}`
                            })(state)
                        }
                    }
                }
            },
            {
                label: `Trade Relic for ${displayName(d.offerRelic)}`,
                description: 'Give up one of your relics to receive this one.',
                tooltipSpec: d.offerRelic,
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
                            await gainRelic(d.offerRelic, {
                                details: `Traded away ${displayName(relic.spec)}`
                            })(state)
                        }
                    }
                }
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

export const callYourShot: Encounter = simpleEncounter({
    name: 'Call your shot',
    options: [
        {
            label: 'Go for it',
            description: 'This stage, gain 1 buffer for each @ you beat par.',
            transform: gainRelic(calledShot)
        },
        {
            label: 'Wait for it',
            description: 'Get 1 additional reward next stage.',
            transform: gainRelic(delayedGratification)
        }
    ]
})
registerEncounter(callYourShot, { maxStage: 4 })

// Export for testing
export { tradingPost }
