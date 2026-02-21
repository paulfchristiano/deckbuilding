import {
    Card,
    CardSpec,
    ResourceEvent,
    addCosts,
    addToken,
    actionsEffect,
    cannotUse,
    coin,
    copper,
    countNameTokens,
    doAll,
    energy,
    incrementMap,
    refresh,
    removeToken,
} from '../gameLogic.js'
import { registerSpec } from '../registry.js'

const minorCursePool: CardSpec[] = []
const majorCursePool: CardSpec[] = []

type CurseFactory = (isMajor: boolean) => CardSpec

function variant<T>(minor: T, major: T, isMajor: boolean): T {
    return isMajor ? major : minor
}

function curseName(base: string, isMajor: boolean): string {
    return isMajor ? `${base} (Major)` : base
}

function registerCursePair(minor: CardSpec, major: CardSpec): void {
    minorCursePool.push(minor)
    majorCursePool.push(major)
    registerSpec(minor)
    registerSpec(major)
}

function registerMirroredCurse(factory: CurseFactory): void {
    registerCursePair(factory(false), factory(true))
}

export function allMinorCurses(): CardSpec[] {
    return [...minorCursePool]
}

export function allMajorCurses(): CardSpec[] {
    return [...majorCursePool]
}

registerMirroredCurse((isMajor): CardSpec => {
    const decayTokens = variant(3, 2, isMajor)
    return {
        name: curseName('Decay', isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
            kind: 'create',
            text: [`If a card would be created without decay tokens or with more than ${decayTokens} decay tokens, instead create it with ${decayTokens} decay tokens.`],
            simpleText: [`Cards are created with ${decayTokens} decay tokens.`],
            handles: () => true,
            replace: params => {
                const tokens = new Map(params.tokens || [])
                const currentDecay = tokens.get('decay') || 0
                if (currentDecay === 0 || currentDecay > decayTokens) {
                    tokens.set('decay', decayTokens)
                }
                return { ...params, tokens }
            }
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const maxActionsFromRefresh = variant(3, 1, isMajor)
    return {
        name: curseName('Squeeze', isMajor),
        fixedCost: energy(1),
        effects: [actionsEffect(1)],
        staticReplacers: [{
            kind: 'resource',
            text: [`Whenever you would gain actions from ${refresh.name}, gain at most ${maxActionsFromRefresh}.`],
            simpleText: [`You gain at most ${maxActionsFromRefresh} actions from ${refresh.name}.`],
            handles: (params: ResourceEvent) =>
                params.resource === 'actions'
                && params.amount > 0
                && params.source instanceof Card
                && params.source.name === refresh.name,
            replace: params => ({ ...params, amount: Math.min(params.amount, maxActionsFromRefresh) })
        }]
    }
})

registerMirroredCurse((_isMajor): CardSpec => {
    const inflationCostPerToken = 1
    return {
        name: curseName('Inflation', _isMajor),
        restrictions: [cannotUse],
        staticTriggers: [{
            kind: 'create',
            text: ['Whenever you create a card, put an inflation token on its supply.'],
            simpleText: ['Whenever you create a card, put an inflation token on it.'],
            handles: () => true,
            transform: e => async state => await doAll(
                state.supply
                    .filter(card => card.name === e.card.name)
                    .map(card => addToken(card, 'inflation', 1))
            )(state)
        }],
        staticReplacers: [{
            kind: 'cost',
            text: [`Cards cost $${inflationCostPerToken} more to buy for each inflation token on them or their supply.`],
            simpleText: [`Cards cost $${inflationCostPerToken} more to buy for each inflation token on them.`],
            handles: (params, state) =>
                params.actionKind === 'buy'
                && countNameTokens(params.card, 'inflation', state) > 0,
            replace: (params, state) => ({
                ...params,
                cost: addCosts(params.cost, {
                    coin: inflationCostPerToken * countNameTokens(params.card, 'inflation', state)
                })
            })
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const removeCount = variant(2, 1, isMajor)
    return {
        name: curseName('Encumber', isMajor),
        fixedCost: energy(1),
        effects: [{
            text: [`Remove ${removeCount} encumber tokens from each card in the supply.`],
            transform: state => doAll(state.supply.map(card => removeToken(card, 'encumber', removeCount)))
        }],
        staticTriggers: [{
            kind: 'create',
            text: ['Whenever you create a card, put an encumber token on its supply.'],
            handles: () => true,
            transform: e => async state => await doAll(
                state.supply
                    .filter(card => card.name === e.card.name)
                    .map(card => addToken(card, 'encumber', 1))
            )(state)
        }],
        staticReplacers: [{
            kind: 'canCreate',
            text: ['You can\'t create cards whose supply has 2 encumber tokens.'],
            handles: (params, state) =>
                params.canCreate
                && countNameTokens(params.spec, 'encumber', state) >= 2,
            replace: params => ({
                ...params,
                canCreate: false
            })
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const removeCost = variant(2, 4, isMajor)
    return {
        name: curseName('Mire', isMajor),
        fixedCost: energy(removeCost),
        effects: [{
            text: ['Remove all mire tokens from cards in your discard.'],
            transform: state => doAll(state.discard.map(card => removeToken(card, 'mire', 'all')))
        }],
        staticTriggers: [{
            kind: 'move',
            text: ['When you put a card in your discard or play, put a mire token on it.'],
            handles: event => event.toZone === 'discard' || event.toZone === 'play',
            transform: event => addToken(event.card, 'mire')
        }],
        staticReplacers: [{
            kind: 'move',
            text: ['When a card with a mire token would move to your hand, instead leave it where it is.'],
            handles: (params, state) =>
                params.toZone === 'hand'
                && state.find(params.card).count('mire') > 0,
            replace: params => ({ ...params, skip: true })
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const overheadFlat = variant(1, 0, isMajor)
    return {
        name: curseName('Overhead', isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
            kind: 'costIncrease',
            text: isMajor
                ? ['Cards cost 50% more $ (rounded up).']
                : [`Cards other than ${copper.name} cost $1 more.`],
            handles: params =>
                params.actionKind === 'buy'
                && (isMajor || params.card.name !== copper.name)
                && params.cost.coin > 0,
            replace: params => {
                const extraCoin = isMajor
                    ? Math.ceil(params.cost.coin * 0.5)
                    : overheadFlat
                return {
                    ...params,
                    cost: addCosts(params.cost, coin(extraCoin))
                }
            }
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const vpMultiplier = variant(2, 4, isMajor)
    return {
        name: curseName('Slog', isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
            kind: 'victory',
            text: [`You need ${vpMultiplier}x the vp target to win.`],
            handles: params => params.victory,
            replace: (params, state) => ({
                ...params,
                victory: params.victory && state.points >= state.vp_goal * vpMultiplier
            })
        }]
    }
})

registerMirroredCurse((isMajor): CardSpec => {
    const freePlays = variant(1, 2, isMajor)
    return {
        name: curseName('Inefficiency', isMajor),
        restrictions: [cannotUse],
        simpleText: [`After the first ${freePlays} plays, cards other than ${copper.name} cost $1 to play.`],
        staticReplacers: [{
            kind: 'create',
            text: [`Whenever you create a card other than ${copper.name}, put ${freePlays} efficiency tokens on it.`],
            handles: params => params.spec.name !== copper.name && ['play', 'discard', 'hand', null].includes(params.zone),
            replace: params => {
                const tokens = new Map(params.tokens || [])
                incrementMap(tokens, 'efficiency', freePlays)
                return { ...params, tokens }
            }
        }, {
            kind: 'costIncrease',
            text: [`Cards other than ${copper.name} cost $1 more to play if they have no efficiency tokens.`],
            handles: (params, state) =>
                params.actionKind === 'play'
                && params.card.name !== copper.name
                && state.find(params.card).count('efficiency') === 0,
            replace: params => ({ ...params, cost: addCosts(params.cost, coin(1)) })
        }],
        staticTriggers: [{
            kind: 'play',
            text: [`When you play a card other than ${copper.name} the normal way, remove an efficiency token from it.`],
            handles: event => event.source === 'act' && event.card.name !== copper.name && event.card.count('efficiency') > 0,
            transform: event => removeToken(event.card, 'efficiency', 1)
        }]
    }
})
