// data/encounters.ts - Encounter definitions using inline reward options
// Each encounter provides createInitialData and getOptions methods

import { Encounter, registerEncounter, RewardOption,
    MetaState, MetaTransform,
    addBuffer, gainCard, gainEvent, gainPotion, gainRelic, removeRelic,
    addTimelineAction,
    RelicSpec,
    sampleEligibleRelicReward,
    sampleRewards,
    GameSetupParams,
    compose,
    registerEncounterUpgrade,
    sampleReward,
    RewardStateData,
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
    isBurdened,
    initialState
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
            text: ['This starts with a reflect token on it.'],
            handles: (_e, state, sourceCard) => true,
            transform: (_e, _state, sourceCard) => addToken(sourceCard!, 'reflect', 1),
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

const rewardStateInit:RewardStateData & { selectedIndex: number | null } = { selectedIndex: null, rewardState: true }

function selectIndex(index: number): RewardStateData {
    return { ...rewardStateInit, selectedIndex: index }
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
        createInitialData: () => ({ ...rewardStateInit }),
        getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
            const selectedIndex  = data.selectedIndex!
            return config.options.map((opt, i) => ({
                label: opt.label,
                description: opt.description,
                spec: opt.spec,
                disabled: selectedIndex !== null || (opt.disabled ? opt.disabled(metaState) : false),
                checked: selectedIndex === i,
                kind: 'complex',
                onClick: async function (state:MetaState) {
                    await opt.transform(state)
                    return selectIndex(i)
                }
            }))
        }
    }
}

// ----------------------------- Encounters

export const distillery: Encounter = {
    name: 'Distillery',
    createInitialData: () => ({ ...rewardStateInit }),
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const hasCards = metaState.data.collectedCards.length > 0
        const selectedIndex = data.selectedIndex!

        return [
            {
                label: 'Bottle a card',
                description: 'Choose a card from your deck, and gain a potion that creates a copy of that card in your hand.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                kind: 'complex',
                onClick: async function (state:MetaState) {
                    const card = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a card to bottle:',
                        [...metaState.data.collectedCards].map(c => ['card', c]),
                        true
                    )
                    if (!card) {
                        return data
                    }
                    await addTimelineAction('Distillery: Bottled a card', `Bottled ${displayName(card[1])}`)(state)
                    await gainPotion(makeBottledCardPotion(card[1]), {silent: true})(state)
                    return selectIndex(0)
                }
            },
            {
                label: 'Gift Box',
                kind: 'complex',
                spec: giftBox,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 1,
                onClick: async function (state:MetaState) {
                    await gainRelic(giftBox)(state)
                    return selectIndex(1)
                }
            },
            {
                label: 'Empty Bottle',
                kind: 'complex',
                spec: emptyBottle,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async function (state:MetaState) {
                    await gainRelic(emptyBottle)(state)
                    return selectIndex(2)
                }
            }
        ]
    }
}
registerEncounter(distillery)

// Mirror Maker encounter
export const mirrorMaker: Encounter = {
    name: 'Mirror Maker',
    createInitialData: () => ({ ...rewardStateInit }),
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const selectedIndex = data.selectedIndex!
        const hasRelics = metaState.data.relics.length > 0

        return [
            {
                label: 'Mirror Brew',
                kind: 'complex',
                spec: mirrorBrew,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 0,
                onClick: async function (state: MetaState) {
                    await addTimelineAction('Mirror maker: gain Mirror Brew')(state),
                    await gainPotion(mirrorBrew, {silent: true})(state)
                    return selectIndex(0)
                }
            },
            {
                label: 'Use the mirror',
                kind: 'complex',
                description: 'Copy one of your relics.',
                disabled: selectedIndex !== null || !hasRelics,
                checked: selectedIndex === 1,
                onClick: async function (state:MetaState) {
                    const relicSpecs = state.data.relics.map(r => r.spec)
                    const relic = await state.ui.chooseCard(
                        state,
                        'Choose a relic to duplicate:',
                        state.data.relics.map(r => ['relic', r]),
                        true
                    )
                    if (!relic) {
                        return data
                    }
                    await addTimelineAction('Mirror Maker: Copied a relic', `Copied ${displayName(relic[1].spec)}`)(state)
                    await gainRelic(relic[1].spec, { silent: true })(state)
                    return selectIndex(1)
                }
            },
            {
                kind: 'complex',
                label: 'Take the mirror',
                description: `Gain a ${silverMirror.name}.`,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                tooltipSpec: silverMirror,
                onClick: async function (state: MetaState) {
                    await addTimelineAction(`Mirror Maker: gain ${silverMirror.name}`)(state)
                    await gainRelic(silverMirror, { silent: true })(state)
                    return selectIndex(2)
                }
            }
        ]
    }
}
registerEncounter(mirrorMaker)

export const blacksmith: Encounter = {
    name: 'The Blacksmith',
    createInitialData: () => ({ ...rewardStateInit }),
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const selectedIndex = data.selectedIndex!
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string, state:MetaState) => {
            const card = await state.ui.chooseCard(
                state,
                'Choose a card to upgrade:',
                state.data.collectedCards.map(c => ['card', c]),
                true
            )
            if (!card) {
                return data
            }
            const chosenName = displayName(card[1])
            const updated = upgradeCardSpec(card[1], upgrade)
            const cards = [...state.data.collectedCards]
            const cardIndex = cards.indexOf(card[1])
            if (cardIndex >= 0) {
                cards[cardIndex] = updated
                state.update({ collectedCards: cards })
                await addTimelineAction(`The Blacksmith: ${upgradeName}`, `Upgraded ${chosenName}`)(state)
            }
            return selectIndex(index)
        }

        return [
            {
                label: 'Polish',
                kind: 'complex',
                description: 'Add +$1 to a card.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async function (state: MetaState) {
                    return chooseUpgrade(polishUpgrade, 0, 'Polish', state)
                }
            },
            {
                label: 'Sharpen',
                kind: 'complex',
                description: 'Add +1 action to a card.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async function (state: MetaState) {
                    return chooseUpgrade(sharpenUpgrade, 1, 'Sharpen', state)
                }
            },
            {
                label: 'Streamline',
                kind: 'complex',
                description: 'Reduce the play cost of a card by @.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async function (state: MetaState) {
                    return chooseUpgrade(streamlineUpgrade, 2, 'Streamline', state)
                },
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
                        await addTimelineAction(`Enchantress: ${upgradeName}`, `Upgraded ${chosenName}`)(state)
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
    createInitialData: () => rewardStateInit,
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const selectedIndex = data.selectedIndex
        const hasCards = metaState.data.collectedCards.length > 0

        const chooseUpgrade = async (upgrade: CardUpgrade, index: number, upgradeName: string, state: MetaState) => {
            const card = await state.ui.chooseCard(
                state,
                'Choose a card to upgrade:',
                state.data.collectedCards.map(c => ['card', c]),
                true
            )
            if (!card) {
                return data
            }
            const chosenName = displayName(card[1])
            const updated = upgradeCardSpec(card[1], upgrade)
            const cards = [...state.data.collectedCards]
            const cardIndex = cards.indexOf(card[1])
            if (cardIndex >= 0) {
                cards[cardIndex] = updated
                state.update({ collectedCards: cards })
                await addTimelineAction(`Shopkeeper: ${upgradeName}`, `Upgraded ${chosenName}`)(state)
                return selectIndex(index)
            }
            return data
        }

        return [
            {
                label: 'Buy one get one free',
                kind: 'complex',
                description: 'Choose a card. The first time you buy it each stage, buy it again for free.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 0,
                onClick: async (state: MetaState) => chooseUpgrade(buyOneGetOneUpgrade, 0, 'Buy one get one', state),
            },
            {
                label: 'Rush order',
                kind: 'complex',
                description: 'Choose a card. The first time you create it each stage, play it for free.',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 1,
                onClick: async (state: MetaState) => chooseUpgrade(rushOrderUpgrade, 1, 'Rush order', state),
            },
            {
                label: 'Sale',
                kind: 'complex',
                description: 'Choose a card. Reduce its buy cost by $2 (but not less than $1).',
                disabled: selectedIndex !== null || !hasCards,
                checked: selectedIndex === 2,
                onClick: async (state: MetaState) => chooseUpgrade(saleUpgrade, 2, 'Sale', state),
            }
        ]
    }
}
registerEncounter(shopkeeper)

export const tactician: Encounter = {
    name: 'Tactician',
    createInitialData: () => rewardStateInit,
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const selectedIndex = data.selectedIndex
        const hasEvents = metaState.data.collectedEvents.length > 0

        async function chooseUpgrade (upgrade: CardUpgrade, index: number, upgradeName: string, state: MetaState): Promise<RewardStateData> {
            const event = await state.ui.chooseCard(
                state,
                'Choose an event to upgrade:',
                state.data.collectedEvents.map(e => ['event', e]),
                true
            )
            if (!event) {
                return  data
            }
            const chosenName = displayName(event[1])
            const updated = upgradeCardSpec(event[1], upgrade)
            const events = [...state.data.collectedEvents]
            const eventIndex = events.indexOf(event[1])
            if (eventIndex >= 0) {
                events[eventIndex] = updated
                state.update({ collectedEvents: events })
                await addTimelineAction(`Tactician: ${upgradeName}`, `Upgraded ${chosenName}`)(state)
                return selectIndex(index)
            } else {
                return data
            }
        }

        return [
            {
                label: 'Persistence',
                kind: 'complex',
                description: 'Upgrade an event. The first time you use event each stage, use it again.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 0,
                onClick: async (state: MetaState) => chooseUpgrade(tacticianStrengthUpgrade, 0, 'Persistence', state),
            },
            {
                label: 'Finesse',
                kind: 'complex',
                description: 'Finesse. Upgrade an event. The first two times you use it it costs @ less.',
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 1,
                onClick: async (state: MetaState) => chooseUpgrade(tacticianAgilityUpgrade, 1, 'Finesse', state),
            },
            {
                label: 'Teamwork',
                kind: 'complex',
                description: "Teamwork. Upgrade an event. Every time you use that event, use another event that's cheaper or equal for free.",
                disabled: selectedIndex !== null || !hasEvents,
                checked: selectedIndex === 2,
                onClick: async (state: MetaState) => chooseUpgrade(tacticianCooperationUpgrade, 2, 'Teamwork', state),
            }
        ]
    }
}
registerEncounter(tactician)

type PotionShopData = {
    offers: CardSpec[]
} & RewardStateData

export const potionShop: Encounter = {
    name: 'Potion Shop',
    createInitialData(_metaState: MetaState, generator: Generator): PotionShopData {
        return {
            ...rewardStateInit,
            offers: generator.samples(potionRewards, 3),
        }
    },
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const d = data as PotionShopData
        const [first, second, third] = d.offers
        const sellablePotions = metaState.data.potions.filter(potion => !isBurdened(potion.spec))
        const bundleDetail = `${displayName(second)} and ${displayName(third)}`
        const bundleTooltipSpec: CardSpec = {
            ...second,
            relatedCards: [...(second.relatedCards || []), third]
        }
        return [
            {
                label: `Take ${displayName(first)}`,
                kind: 'complex',
                description: 'Take this potion for free.',
                tooltipSpec: first,
                disabled: d.selectedIndex !== null,
                checked: d.selectedIndex === 0,
                onClick: async function (state: MetaState) {
                    await gainPotion(first, { silent: true })(state)
                    await addTimelineAction('Potion shop: free sample', displayName(first))(state)
                    return {...data, selectedIndex: 0}
                }
            },
            {
                label: `Buy ${displayName(second)} + ${displayName(third)}`,
                kind: 'complex',
                description: 'Lose 3@ buffer to buy both potions.',
                tooltipSpec: bundleTooltipSpec,
                disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
                checked: d.selectedIndex === 1,
                onClick: async function (state:MetaState) {
                    await addBuffer(-3)(state)
                    await addTimelineAction('Potion shop: bundle purchase for 3@', bundleDetail)(state)
                    await gainPotion(second, { silent: true })(state)
                    await gainPotion(third, { silent: true })(state)
                    return { ...data, selectedIndex: 1 }
                }
            },
            {
                label: 'Sell a potion',
                kind: 'complex',
                description: 'Lose a potion and gain 4@ buffer.',
                disabled: d.selectedIndex !== null || sellablePotions.length === 0,
                checked: d.selectedIndex === 2,
                onClick: async function (state: MetaState) {
                    const potion = await metaState.ui.chooseCard(
                        metaState,
                        'Choose a potion to give up:',
                        sellablePotions.map(p => ['potion', p]),
                        true
                    )
                    if (!potion) return data
                    state.removePotion(potion[1].id)
                    await addBuffer(4)(state)
                    await addTimelineAction('Potion shop: sell a potion for 4@', `Sold ${displayName(potion[1].spec)}`)(state)
                    return { ...data, selectedIndex: 2 }
                }
            }
        ]
    }
}
registerEncounter(potionShop)

type PotionLabData  = {
    offer: CardSpec,
    selectedIndex: number | null
} & RewardStateData

export const potionLab: Encounter = {
    name: 'Potion Lab',
    createInitialData(_metaState: MetaState, generator: Generator): PotionLabData {
        return {
            ...rewardStateInit,
            offer: generator.sample(potionRewards),
        }
    },
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const d = data as PotionLabData
        const offerName = displayName(d.offer)
        const hasPotions = metaState.data.potions.length > 0
        return [
            {
                label: 'House special',
                kind: 'complex',
                description: `Trade in a potion to gain 2 copies of ${offerName}.`,
                tooltipSpec: d.offer,
                disabled: d.selectedIndex !== null || !hasPotions,
                checked: d.selectedIndex === 0,
                onClick: async function (state:MetaState) {
                    const potion = await metaState.ui.chooseCard(
                        metaState, 'Choose a potion to trade in:', state.data.potions.map(p => ['potion', p]), true
                    )
                    if (!potion) return data
                    const potionName = displayName(potion[1].spec)
                    state.removePotion(potion[1].id)
                    await addTimelineAction('Potion Lab: House special', `Traded ${potionName} for two ${offerName}`)(state)
                    await gainPotion(d.offer, { silent: true })(state)
                    await gainPotion(d.offer, { silent: true })(state)
                    return { ...data, selectedIndex: 0 }
                }
            },
            {
                label: 'Double batch',
                kind: 'complex',
                description: 'Pay 1 buffer. For each potion you have, gain a copy of that potion.',
                disabled: d.selectedIndex !== null || metaState.data.buffer < 1,
                checked: d.selectedIndex === 1,
                onClick: async function (state: MetaState) {
                    const copiedPotionNames = state.data.potions.map(p => displayName(p.spec))
                    const details = copiedPotionNames.length > 0
                        ? `Copied: ${copiedPotionNames.join(', ')}`
                        : 'Copied nothing'
                    await addBuffer(-1)(state)
                    await addTimelineAction('Potion Lab: Double batch', details)(state)
                    const potionSpecs = state.data.potions.map(p => p.spec)
                    for (const spec of potionSpecs) {
                        await gainPotion(spec, { silent: true })(state)
                    }
                    return { ...data, selectedIndex: 1 }
                }
            },
            {
                label: 'Sacred Bark',
                spec: sacredBark,
                kind: 'complex',
                disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
                checked: d.selectedIndex === 2,
                onClick: async function (state:MetaState) {
                    await gainRelic(sacredBark, { silent: true })(state)
                    await addTimelineAction('Potion Lab: Sacred Bark')(state)
                    return { ...data, selectedIndex: 2 }
                }
            }
        ]
    }
}
registerEncounter(potionLab)

type VarietyPackData = {
    offerCard: CardSpec
    offerEvent: CardSpec
    offerPotion: CardSpec
    offerRelic: RelicSpec
} & RewardStateData

// Variety Pack encounter - pre-generates options at creation time
export const varietyPack: Encounter = {
    name: 'Variety Pack',
    createInitialData(metaState: MetaState, generator: Generator) {
        return {
            ...rewardStateInit,
            offerCard: sampleReward(generator, cardRewards, metaState.data.collectedCards),
            offerEvent: sampleReward(generator, eventRewards, metaState.data.collectedEvents),
            offerPotion: generator.sample(potionRewards),
            offerRelic: sampleEligibleRelicReward(generator, metaState)
        }
    },
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const currentData = data as VarietyPackData
        const { selectedIndex, offerCard, offerEvent, offerPotion, offerRelic } = currentData

        const allOptionNames = [
            displayName(offerCard),
            displayName(offerEvent),
            displayName(offerPotion),
            displayName(offerRelic),
        ]
        return [
            {
                label: 'Take Card',
                kind: 'complex',
                spec: offerCard,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 0,
                onClick: async function (state: MetaState) {
                    await gainCard(offerCard, { skipped: allOptionNames.filter((_, i) => i !== 0) })(state)
                    return { ...currentData, selectedIndex: 0 }
                }
            },
            {
                label: 'Take Event',
                kind: 'complex',
                spec: offerEvent,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 1,
                onClick: async function (state: MetaState) {
                    await gainEvent(offerEvent, { skipped: allOptionNames.filter((_, i) => i !== 1) })(state)
                    return { ...currentData, selectedIndex: 1 }
                }
            },
            {
                label: 'Take Potion',
                kind: 'complex',
                spec: offerPotion,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 2,
                onClick: async function (state: MetaState) {
                    await gainPotion(offerPotion, { skipped: allOptionNames.filter((_, i) => i !== 2) })(state)
                    return { ...currentData, selectedIndex: 2 }
                }
            },
            {
                label: 'Take Relic',
                kind: 'complex',
                spec: offerRelic,
                disabled: selectedIndex !== null,
                checked: selectedIndex === 3,
                onClick: async function (state: MetaState) {
                    await gainRelic(offerRelic, { skipped: allOptionNames.filter((_, i) => i !== 3) })(state)
                    return { ...currentData, selectedIndex: 3 }
                }
            }
        ]
    }
}
registerEncounter(varietyPack)

// Trading Post encounter - allows multiple trades
type TradingPostData = {
    offerCard: CardSpec
    offerEvent: CardSpec
    offerPotion: CardSpec
    offerRelic: RelicSpec
    cardTraded: boolean
    eventTraded: boolean
    potionTraded: boolean
    relicTraded: boolean
} & RewardStateData

const tradingPost: Encounter = {
    name: 'Trading Post',
    createInitialData(metaState: MetaState, generator: Generator): TradingPostData {
        return {
            offerCard: sampleReward(generator, cardRewards, metaState.data.collectedCards),
            offerEvent: sampleReward(generator, eventRewards, metaState.data.collectedEvents),
            offerPotion: generator.sample(potionRewards),
            offerRelic: sampleEligibleRelicReward(generator, metaState),
            cardTraded: false,
            eventTraded: false,
            potionTraded: false,
            relicTraded: false,
            rewardState: true,
        }
    },
    getOptions(data: RewardStateData, metaState: MetaState): RewardOption[] {
        const d = data as TradingPostData
        const tradableCards = metaState.data.collectedCards.filter(card => !isBurdened(card))
        const tradableEvents = metaState.data.collectedEvents.filter(event => !isBurdened(event))
        const tradablePotions = metaState.data.potions.filter(potion => !isBurdened(potion.spec))
        const tradableRelics = metaState.data.relics.filter(relic => !isBurdened(relic.spec))

        return [
            {
                label: `Trade Card for ${displayName(d.offerCard)}`,
                kind: 'complex',
                description: 'Give up one of your cards to receive this one.',
                tooltipSpec: d.offerCard,
                disabled: d.cardTraded || tradableCards.length === 0,
                checked: d.cardTraded,
                onClick: async function (state: MetaState) {
                    const card = await state.ui.chooseCard(
                        state,
                        'Choose a card to trade away:',
                        tradableCards.map(c => ['card', c]),
                        true
                    )
                    if (!card) return data
                    state.removeCard(card[1].name)
                    await gainCard(d.offerCard, {details: `Traded away ${displayName(card[1])}`})(state)
                    return {...d, cardTraded: true }
                }
            },
            {
                label: `Trade Event for ${displayName(d.offerEvent)}`,
                kind: 'complex',
                description: 'Give up one of your events to receive this one.',
                tooltipSpec: d.offerEvent,
                disabled: d.eventTraded || tradableEvents.length === 0,
                checked: d.eventTraded,
                onClick: async function (state: MetaState) {
                    const event = await state.ui.chooseCard(
                        state,
                        'Choose an event to trade away:',
                        tradableEvents.map(e => ['event', e]),
                        true
                    )
                    if (!event) return data
                    state.removeEvent(event[1].name)
                    await gainEvent(d.offerEvent, {details: `Traded away ${displayName(event[1])}`})(state)
                    return { ...d, eventTraded: true }
                }
            },
            {
                label: `Trade Potion for ${displayName(d.offerPotion)}`,
                kind: 'complex',
                description: 'Give up one of your potions to receive this one.',
                tooltipSpec: d.offerPotion,
                disabled: d.potionTraded || tradablePotions.length === 0,
                checked: d.potionTraded,
                onClick: async function (state: MetaState) {
                    const potion = await state.ui.chooseCard(
                        state,
                        'Choose a potion to trade away:',
                        tradablePotions.map(p => ['potion', p]),
                        true
                    )
                    if (!potion) return data
                    state.removePotion(potion[1].id)
                    await gainPotion(d.offerPotion, { details: `Traded away ${displayName(potion[1].spec)}` })(state)
                    return { ...d, potionTraded: true }
                }
            },
            {
                label: `Trade Relic for ${displayName(d.offerRelic)}`,
                kind: 'complex',
                description: 'Give up one of your relics to receive this one.',
                tooltipSpec: d.offerRelic,
                disabled: d.relicTraded || tradableRelics.length === 0,
                checked: d.relicTraded,
                onClick: async function (state: MetaState) {
                    const relic = await state.ui.chooseCard(
                        state,
                        'Choose a relic to trade away:',
                        tradableRelics.map(r => ['relic', r]),
                        true
                    )
                    if (!relic) return data
                    await removeRelic(state, relic[1].id)
                    await gainRelic(d.offerRelic, { details: `Traded away ${displayName(relic[1].spec)}` })(state)
                    return { ...d, relicTraded: true }
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
