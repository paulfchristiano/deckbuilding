import {
    Card,
    CardSpec,
    CardUpgrade,
    State,
    addToken,
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
    removeToken,
    sourceHasName,
    trash,
} from '../gameLogic.js'

function registerUpgrade(id: string, upgrade: CardUpgrade): CardUpgrade {
    upgrade.id = id
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

export const tacticianStrengthUpgrade: CardUpgrade = registerUpgrade('tacticianStrength', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'afterUse',
        text: 'After using this other than with this effect, use it again.',
        handles: (e, _state, sourceCard) =>
            e.card.id === sourceCard!.id && !sourceHasName(e.source, sourceCard!.name),
        transform: (_e, _state, sourceCard) => async function (state: State) {
            sourceCard = state.find(sourceCard!)
            return sourceCard.use(sourceCard)(state)
        }
    }]
})

export const tacticianAgilityUpgrade: CardUpgrade = registerUpgrade('tacticianAgility', {
    name: name => `${name}+`,
    staticTriggers: [{
        kind: 'gameStart',
        text: 'This starts with 3 reduction tokens on it.',
        handles: (_e, state, sourceCard) => state.find(sourceCard!).count('reduce') === 0,
        transform: (_e, _state, sourceCard) => addToken(sourceCard!, 'reduce', 3),
    }],
    staticReplacers: [{
        kind: 'cost',
        text: 'This costs @ less to use for each reduction token on it. Whenever this reduces a cost, remove that many reduction tokens.',
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
        text: 'After using this other than with this effect, use another event with equal or lesser cost for free.',
        handles: (e, state, sourceCard) =>
            e.card.id === sourceCard!.id &&
            !sourceHasName(e.source, sourceCard!.name) &&
            cooperationTargets(state, sourceCard!).length > 0,
        transform: (_e, _state, sourceCard) => async function (state: State) {
            const source = state.find(sourceCard!)
            return applyToTarget(
                target => target.use(source),
                'Choose another event with equal or lesser cost to use for free.',
                s => cooperationTargets(s, source)
            )(state)
        },
    }]
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
    tacticianStrengthUpgrade,
    tacticianAgilityUpgrade,
    tacticianCooperationUpgrade,
]

const upgradesById = new Map<string, CardUpgrade>()
for (const upgrade of allEncounterUpgrades) {
    if (!upgrade.id) continue
    upgradesById.set(upgrade.id, upgrade)
}

export function getEncounterUpgradeById(id: string): CardUpgrade | null {
    return upgradesById.get(id) || null
}
