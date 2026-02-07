import {
    Card,
    CardSpec,
    CardUpgrade,
    State,
    actionsEffect,
    addCosts,
    afterBuyTrigger,
    applyToTarget,
    buysEffect,
    buyTrigger,
    coin,
    coinsEffect,
    create,
    displayName,
    leq,
    trash,
} from '../gameLogic.js'

function registerUpgrade(id: string, upgrade: CardUpgrade): CardUpgrade {
    upgrade.id = id
    return upgrade
}

export const polishUpgrade: CardUpgrade = registerUpgrade('polish', {
    name: name => `${name}+`,
    effects: [coinsEffect(1)],
})

export const sharpenUpgrade: CardUpgrade = registerUpgrade('sharpen', {
    name: name => `${name}+`,
    effects: [actionsEffect(1)],
})

export const redesignUpgrade: CardUpgrade = registerUpgrade('redesign', {
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
        text: 'Whenever a card that shares a name with this is trashed, create a card costing $1, $2, or $3 more in your hand.',
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

export const bulkPurchaseUpgrade: CardUpgrade = registerUpgrade('bulkPurchase', {
    name: name => `${name}+`,
    staticTriggers: [afterBuyTrigger(buysEffect(1))]
})

export const streetFairUpgrade: CardUpgrade = registerUpgrade('streetFair', {
    name: name => `${name}+`,
    staticReplacers: [{
        kind: 'create',
        text: 'Whenever you would create this in your discard, instead create it in your hand.',
        handles: (p, _state, card) => p.zone === 'discard' && displayName(p.spec) === card.name,
        replace: p => ({ ...p, zone: 'hand' }),
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

export const allEncounterUpgrades: CardUpgrade[] = [
    polishUpgrade,
    sharpenUpgrade,
    redesignUpgrade,
    transmuteUpgrade,
    fortifyUpgrade,
    possessUpgrade,
    bulkPurchaseUpgrade,
    streetFairUpgrade,
    saleUpgrade,
]

const upgradesById = new Map<string, CardUpgrade>()
for (const upgrade of allEncounterUpgrades) {
    if (!upgrade.id) continue
    upgradesById.set(upgrade.id, upgrade)
}

export function getEncounterUpgradeById(id: string): CardUpgrade | null {
    return upgradesById.get(id) || null
}
