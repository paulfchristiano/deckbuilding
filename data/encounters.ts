// data/encounters.ts - Encounter definitions using inline reward options
// Each encounter provides createInitialData and getOptions methods

import { Encounter, registerEncounter, RewardOption,
    MetaState, MetaTransform,
    addBuffer, gainCard, gainEvent, gainPotion, gainRelic, removeRelic,
    addTimelineAction,
    RelicSpec,
    sampleEligibleRelicReward,
    GameSetupParams,
    compose,
    registerEncounterUpgrade,
} from '../metaLogic.js'
import { calledShot, delayedGratification, emptyBottle, giftBox, inkwell, sacredBark, silverMirror } from './relics.js'
import { CardSpec, CardUpgrade,
    cardRewards, eventRewards, potionRewards,
    displayName,
    Card,
    State,
    leq,
    coinsEffect,
    actionsEffect,
    addCosts, coin, trash, applyToTarget,
    create, buyTrigger, afterBuyTrigger, buysEffect, sourceHasName, addToken, removeToken,
    doAll,
    duplicateRule,
    isBurdened
} from '../gameLogic.js'

import { Generator } from '../rng.js'
import { mirrorBrew } from './potions.js'
import { makeBottledCardPotion } from './specialSpecs.js'
import { registerRelicSpec } from '../registry.js'

function registerUpgrade(id: string, upgrade: CardUpgrade): CardUpgrade {
    upgrade.id = id
    registerEncounterUpgrade(id, upgrade)
    return upgrade
}

function cooperationTargets(state: State, sourceCard: Card): Card[] {
    const source = state.find(sourceCard)
    const maxCost = source.cost('use', state)
    return state.events.filter(event => {
        if (event.id === source.id) return false
        if (!leq(event.cost('use', state), maxCost)) return false
        return event.available('use', state)
    })
}

export const polishUpgrade: CardUpgrade = registerUpgrade('polish', {
    name: name => `${name}+`,
    effects: [coinsEffect(1)],
})

export const sharpenUpgrade: CardUpgrade = registerUpgrade('sharpen', {
    name: name => `${name}+`,
    effects: [actionsEffect(1)],
})

export const streamlineUpgrade: CardUpgrade = registerUpgrade('streamline', {
    name: name => `${name}+`,
    cost: (cost, kind) => kind === 'play'
        ? { ...cost, energy: Math.max(cost.energy - 1, 0) }
        : cost,
})

export const transmuteUpgrade: CardUpgrade = registerUpgrade('transmute', {
    name: name => `${name}+`,
    effects: [{
        text: [
            'Trash this.',
            'Buy a card in the supply costing up to $2 more than this.'
        ],
        transform: (_state: State, sourceCard: Card) => async function (state: State) {
            const maxCost = addCosts(sourceCard.cost('buy', state), coin(2))
            state = await trash(sourceCard)(state)
            state = await applyToTarget(
                target => target.buy(sourceCard),
                'Choose a card to buy.',
                s => s.supply.filter(c => leq(c.cost('buy', s), maxCost))
            )(state)
            return state
        }
    }]
})

export const fortifyUpgrade: CardUpgrade = registerUpgrade('fortify', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'move',
        text: ['Whenever a card that shares a name with this is trashed, create a card costing $1, $2, or $3 more in your hand.'],
        handles: (e, _state, card) => e.toZone === 'void' && card !== null && e.card.name === card.name,
        transform: (e, _state, _card) => async function (state: State) {
            const trashedCard = state.find(e.card)
            const trashedCost = trashedCard.cost('buy', state)
            const minCoin = trashedCost.coin + 1
            const maxCoin = trashedCost.coin + 3
            state = await applyToTarget(
                target => create(target.spec, 'hand'),
                'Choose a card to create in hand.',
                s => s.supply.filter(candidate => {
                    const candidateCost = candidate.cost('buy', s).coin
                    return candidateCost >= minCoin && candidateCost <= maxCoin
                })
            )(state)
            return state
        }
    }]
})

export const possessUpgrade: CardUpgrade = registerUpgrade('possess', {
    name: name => `${name}+`,
    staticTriggers: [buyTrigger({
        text: [
            'Trash a card in your hand.',
            'Choose a card in the supply costing up to $2 more than it and create a copy in your hand.'
        ],
        transform: (_state: State, _sourceCard: Card) => async function (state: State) {
            if (state.hand.length === 0) {
                return state
            }
            state = await applyToTarget(
                trashed => async function (state: State) {
                    const maxCost = addCosts(trashed.cost('buy', state), coin(2))
                    state = await trash(trashed)(state)
                    state = await applyToTarget(
                        target => create(target.spec, 'hand'),
                        'Choose a card to copy.',
                        s => s.supply.filter(c => leq(c.cost('buy', s), maxCost))
                    )(state)
                    return state
                },
                'Choose a card to trash.',
                s => s.hand
            )(state)
            return state
        }
    })]
})

export const buyOneGetOneUpgrade: CardUpgrade = registerUpgrade('buyOneGetOne', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put a duplicate token on this.'],
        simpleText: ['The first time you buy this each stage, buy it again for free.'],
        handles: () => true,
        transform: (_e, _s, card) => addToken(card!, 'duplicate', 1),
    }]
})

export const rushOrderUpgrade: CardUpgrade = registerUpgrade('rushOrder', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'afterStart',
        text: ['At the start of the game, put a priority token on this.'],
        handles: (p, _state, card) => true,
        transform: (_e, _s, card) => addToken(card!, 'priority', 1),
    }]
})

export const saleUpgrade: CardUpgrade = registerUpgrade('sale', {
    name: name => `${name}+`,
    cost: (cost, kind) => {
        if (kind !== 'buy' || cost.coin <= 1) {
            return cost
        }
        return { ...cost, coin: Math.max(cost.coin - 2, 1) }
    }
})

export const tacticianStrengthUpgrade: CardUpgrade = registerUpgrade('tacticianStrength', {
    name: name => `${name}+`,
    staticTriggers: [
        {
            kind: 'afterStart',
            text: ['This starts with 4 reflect tokens.'],
            handles: (_e, state, sourceCard) => true,
            transform: (_e, _state, sourceCard) => addToken(sourceCard!, 'reflect', 4),
        }, {
                text: [`After using this other than with this ability, if it has a reflect token on it remove the token to use it again.`],
                kind: 'afterUse',
                handles: (e, state, card) => {
                    const played: Card = state.find(e.card)
                    // Don't trigger if the play was already from this rule (prevent infinite loops)
                    // TODO: should have upgrades as sources I guess?
                    return played.count('reflect') > 0 && !sourceHasName(e.source, card!.name)
                },
                transform: (e, s, card) => doAll([
                    removeToken(e.card, 'reflect'),
                    e.card.use(card), // the source is the card itself
                ]),
            }
    ]
})

export const tacticianAgilityUpgrade: CardUpgrade = registerUpgrade('tacticianAgility', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'afterStart',
        text: ['This starts with 2 reduction tokens on it.'],
        handles: (_e, state, sourceCard) => state.find(sourceCard!).count('reduce') === 0,
        transform: (_e, _state, sourceCard) => addToken(sourceCard!, 'reduce', 2),
    }],
    staticReplacers: [{
        kind: 'cost',
        text: ['This costs @ less to use for each reduction token on it. Whenever this reduces a cost, remove that many reduction tokens.'],
        handles: (params, state, sourceCard) =>
            params.actionKind === 'use' &&
            params.card.id === sourceCard!.id &&
            state.find(sourceCard!).count('reduce') > 0,
        replace: (params, state, sourceCard) => {
            const available = state.find(sourceCard!).count('reduce')
            const reduction = Math.min(available, params.cost.energy, 1)
            if (reduction <= 0) return params
            return {
                ...params,
                cost: {
                    ...params.cost,
                    energy: params.cost.energy - reduction,
                    effects: params.cost.effects.concat([removeToken(params.card, 'reduce', reduction, true)])
                }
            }
        }
    }]
})

export const tacticianCooperationUpgrade: CardUpgrade = registerUpgrade('tacticianCooperation', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'afterUse',
        text: ["Every time you use this, use another event that's cheaper or equal for free."],
        handles: (e, state, sourceCard) =>
            e.card.id === sourceCard!.id &&
            !sourceHasName(e.source, sourceCard!.name) &&
            cooperationTargets(state, sourceCard!).length > 0,
        transform: (_e, _state, sourceCard) => async function (state: State) {
            const source = state.find(sourceCard!)
            return applyToTarget(
                target => target.use(source),
                'Choose another event with equal or lesser cost to use for free.',
                s => cooperationTargets(s, source),
                { optional: 'none' }
            )(state)
        },
    }]
})

export const allEncounterUpgrades: CardUpgrade[] = [
    polishUpgrade,
    sharpenUpgrade,
    streamlineUpgrade,
    transmuteUpgrade,
    fortifyUpgrade,
    possessUpgrade,
    buyOneGetOneUpgrade,
    rushOrderUpgrade,
    saleUpgrade,
    tacticianStrengthUpgrade,
    tacticianAgilityUpgrade,
    tacticianCooperationUpgrade,
]


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
                label: 'Gift Box',
                spec: giftBox,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 1,
                onClick: async () => ({
                    newData: { selectedIndex: 1 },
                    transform: gainRelic(giftBox)
                })
            },
            {
                label: 'Empty Bottle',
                spec: emptyBottle,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 2,
                onClick: async () => ({
                    newData: { selectedIndex: 2 },
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
                label: 'Streamline',
                description: 'Reduce the play cost of a card by @.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(streamlineUpgrade, 2, 'Streamline'),
            }
        ]
    }
}
registerEncounter(blacksmith)

/*
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
*/

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
                label: 'Buy one get one',
                description: 'Choose a card. The first time you buy it each stage, buy it again for free.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(buyOneGetOneUpgrade, 0, 'Buy one get one'),
            },
            {
                label: 'Rush order',
                description: 'Choose a card. The first time you create it each stage, play it for free.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(rushOrderUpgrade, 1, 'Rush order'),
            },
            {
                label: 'Sale',
                description: 'Choose a card. Reduce its buy cost by $2 (but not less than $1).',
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
                label: 'Brute Force',
                description: 'Brute Force. Upgrade an event. The first four times you use that event each stage, use it again.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 0,
                onClick: async () => chooseUpgrade(tacticianStrengthUpgrade, 0, 'Brute Force'),
            },
            {
                label: 'Finesse',
                description: 'Finesse. Upgrade an event. The first two times you use it it costs @ less.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 1,
                onClick: async () => chooseUpgrade(tacticianAgilityUpgrade, 1, 'Finesse'),
            },
            {
                label: 'Teamwork',
                description: "Teamwork. Upgrade an event. Every time you use that event, use another event that's cheaper or equal for free.",
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 2,
                onClick: async () => chooseUpgrade(tacticianCooperationUpgrade, 2, 'Teamwork'),
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
            offers: generator.samples(potionRewards, 3),
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as PotionShopData
        const [first, second, third] = d.offers
        const sellablePotions = metaState.data.potions.filter(potion => !isBurdened(potion.spec))
        const bundleDetail = `Potion Shop bundle for 3@: with ${displayName(second)} and ${displayName(third)}`
        const bundleTooltipSpec: CardSpec = {
            ...second,
            relatedCards: [...(second.relatedCards || []), third]
        }
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
                label: `Buy ${displayName(second)} + ${displayName(third)}`,
                description: 'Lose 3@ buffer to buy both potions.',
                tooltipSpec: bundleTooltipSpec,
                disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
                checked: d.selectedIndex === 1,
                onClick: async () => ({
                    newData: { ...d, selectedIndex: 1 },
                    transform: compose(
                        addBuffer(-3),
                        gainPotion(second, { details: bundleDetail }),
                        gainPotion(third, { details: bundleDetail }),
                    ),
                })
            },
            {
                label: 'Sell a potion',
                description: 'Lose a potion and gain 4@ buffer.',
                disabled: d.selectedIndex !== null || sellablePotions.length === 0,
                checked: d.selectedIndex === 2,
                onClick: async () => {
                    const potion = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a potion to give up:',
                        sellablePotions,
                        true
                    )
                    if (!potion) return { newData: data }
                    return {
                        newData: { ...d, selectedIndex: 2 },
                        transform: compose(
                            async (state: MetaState) => {
                                state.removePotion(potion.id)
                            },
                            addBuffer(4),
                            addTimelineAction('Potion Shop', `Gave up ${displayName(potion.spec)} for 4@`)
                        ),
                    }
                }
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
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as PotionLabData
        const offerName = displayName(d.offer)
        const hasPotions = metaState.data.potions.length > 0
        return [
            {
                label: 'House special',
                description: `Trade in a potion to gain 2 copies of ${offerName}.`,
                tooltipSpec: d.offer,
                disabled: d.selectedIndex !== null || !hasPotions,
                checked: d.selectedIndex === 0,
                onClick: async () => {
                    const potion = await metaState.ui.chooseCard(
                        metaState, 'Choose a potion to trade in:', metaState.data.potions, true
                    )
                    if (!potion) return { newData: d }
                    const potionName = displayName(potion.spec)
                    return {
                        newData: { ...d, selectedIndex: 0 },
                        transform: async (state: MetaState) => {
                            state.removePotion(potion.id)
                            await addTimelineAction('Potion Lab: House special', `Traded ${potionName} for two ${offerName}`)(state)
                            await gainPotion(d.offer, { silent: true })(state)
                            await gainPotion(d.offer, { silent: true })(state)
                        }
                    }
                }
            },
            {
                label: 'Double batch',
                description: 'Pay 1 buffer. For each potion you have, gain a copy of that potion.',
                disabled: d.selectedIndex !== null || metaState.data.buffer < 1,
                checked: d.selectedIndex === 1,
                onClick: async () => {
                    const copiedPotionNames = metaState.data.potions.map(p => displayName(p.spec))
                    const details = copiedPotionNames.length > 0
                        ? `Copied: ${copiedPotionNames.join(', ')}`
                        : 'Copied: none'
                    return {
                        newData: { ...d, selectedIndex: 1 },
                        transform: async (state: MetaState) => {
                            await addBuffer(-1)(state)
                            await addTimelineAction('Potion Lab: Double batch', details)(state)
                            const potionSpecs = state.data.potions.map(p => p.spec)
                            for (const spec of potionSpecs) {
                                await gainPotion(spec, { silent: true })(state)
                            }
                        },
                    }
                }
            },
            {
                label: 'Sacred Bark',
                spec: sacredBark,
                disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
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
        const ownedCardNames = new Set(metaState.data.collectedCards.map(c => c.name))
        const ownedEventNames = new Set(metaState.data.collectedEvents.map(e => e.name))
        const offerCard = generator.permute(cardRewards).find(c => !ownedCardNames.has(c.name)) ?? generator.sample(cardRewards)
        const offerEvent = generator.permute(eventRewards).find(e => !ownedEventNames.has(e.name)) ?? generator.sample(eventRewards)
        return {
            selectedIndex: null as number | null,
            offerCard,
            offerEvent,
            offerPotion: generator.sample(potionRewards),
            offerRelic: sampleEligibleRelicReward(generator, metaState)
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
            offerRelic: sampleEligibleRelicReward(generator, metaState),
            cardTraded: false,
            eventTraded: false,
            potionTraded: false,
            relicTraded: false
        }
    },
    getOptions(data: unknown, metaState: MetaState): RewardOption[] {
        const d = data as TradingPostData
        const tradableCards = metaState.data.collectedCards.filter(card => !isBurdened(card))
        const tradableEvents = metaState.data.collectedEvents.filter(event => !isBurdened(event))
        const tradablePotions = metaState.data.potions.filter(potion => !isBurdened(potion.spec))
        const tradableRelics = metaState.data.relics.filter(relic => !isBurdened(relic.spec))
        const offeredRelicIsBad = isBurdened(d.offerRelic)
        const alreadyHasCard = metaState.data.collectedCards.some(card => card.name === d.offerCard.name)
        const alreadyHasEvent = metaState.data.collectedEvents.some(event => event.name === d.offerEvent.name)

        return [
            {
                label: `Trade Card for ${displayName(d.offerCard)}`,
                description: 'Give up one of your cards to receive this one.',
                tooltipSpec: d.offerCard,
                disabled: d.cardTraded || tradableCards.length === 0 || alreadyHasCard,
                checked: d.cardTraded,
                onClick: async () => {
                    const card = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a card to trade away:',
                        tradableCards,
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
                disabled: d.eventTraded || tradableEvents.length === 0 || alreadyHasEvent,
                checked: d.eventTraded,
                onClick: async () => {
                    const event = await metaState.ui.chooseCard(
                        metaState,
                        'Choose an event to trade away:',
                        tradableEvents,
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
                disabled: d.potionTraded || tradablePotions.length === 0,
                checked: d.potionTraded,
                onClick: async () => {
                    const potion = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a potion to trade away:',
                        tradablePotions,
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
                disabled: d.relicTraded || tradableRelics.length === 0 || offeredRelicIsBad,
                checked: d.relicTraded,
                onClick: async () => {
                    if (offeredRelicIsBad) return { newData: data }
                    const relic = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a relic to trade away:',
                        tradableRelics,
                        true
                    )
                    if (!relic) return { newData: data }
                    return {
                        newData: { ...d, relicTraded: true },
                        transform: async (state: MetaState) => {
                            await removeRelic(state, relic.id)
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
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 1@ lower on each course.'],
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 1 })
    }]
}
registerRelicSpec(cursedInkwell)

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
