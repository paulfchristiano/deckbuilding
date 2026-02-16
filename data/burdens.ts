import {
    Card,
    CardSpec,
    CardUpgrade,
    ResourceEvent,
    addCosts,
    addToken,
    coin,
    copper,
    displayName,
    energy,
    gainCoins,
    incrementMap,
    refresh,
} from '../gameLogic.js'
import {
    BurdenOptionState,
    MetaState,
    Relic,
    RelicSpec,
    addBuffer,
    addTimelineAction,
    gainNotedRelic,
    gainPotion,
    gainRelic,
    registerBurden,
    registerEncounterUpgrade,
    removeRelic,
} from '../metaLogic.js'
import { beggarsBrew } from './potions.js'
import { registerSpec } from '../registry.js'

function upgradeCardSpec(spec: CardSpec, upgrade: CardUpgrade): CardSpec {
    return {
        ...spec,
        upgrades: [...(spec.upgrades || []), upgrade],
    }
}

const frozenRelic: RelicSpec = {
    name: 'Frozen Relic',
    burden: true,
    simpleText: [
        'This starts with 3 charge tokens.',
        'At the start of each course, remove a charge token.',
        'When this has none, gain the frozen relic back and destroy this.',
    ],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 3 charge tokens on it.'],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 3)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'start',
        text: ['At the start of each course, remove a charge token from this. Then if it has no charge tokens, gain the frozen relic back and destroy this.'],
        handles: (_e, _s, _self: Relic) => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            const current = state.data.relics.find(r => r.id === self.id)
            if (!current) return
            const nextCharge = Math.max(current.count('charge') - 1, 0)
            const tokens = new Map(current.tokens)
            tokens.set('charge', nextCharge)
            state.applyToRelic(r => r.update({ tokens }), current)
            if (nextCharge > 0) return
            const thawed = (current.notedCards?.[0] as RelicSpec | undefined) ?? null
            await removeRelic(state, current.id)
            if (thawed) {
                await gainRelic(thawed, { details: `Thawed ${displayName(thawed)}` })(state)
            }
        }
    }]
}
registerSpec(frozenRelic)

const fakeCoin: RelicSpec = {
    name: 'Fake Coin',
    burden: true,
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put a decay token on a Copper without decay tokens.'],
        handles: () => true,
        transform: () => async function (state) {
            const target = state.supply.find(card => card.name === copper.name && card.count('decay') === 0)
            if (!target) return state
            return addToken(target, 'decay')(state)
        }
    }]
}
registerSpec(fakeCoin)

const miserlyTouch: RelicSpec = {
    name: 'Miserly Touch',
    burden: true,
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put 3 decay tokens on each Copper without decay tokens.'],
        handles: () => true,
        transform: () => async function (state) {
            for (const target of state.supply.filter(card => card.name === copper.name && card.count('decay') === 0)) {
                state = await addToken(target, 'decay', 3)(state)
            }
            return state
        }
    }]
}
registerSpec(miserlyTouch)

const heavyStone: RelicSpec = {
    name: 'Heavy Stone',
    burden: true,
    staticReplacers: [{
        kind: 'resource',
        text: [`Whenever you would gain actions from ${refresh.name}, gain 1 less action.`],
        handles: (params: ResourceEvent) =>
            params.resource === 'actions'
            && params.amount > 0
            && params.source instanceof Card
            && params.source.name === refresh.name,
        replace: params => ({ ...params, amount: Math.max(0, params.amount - 1) })
    }]
}
registerSpec(heavyStone)

const cursedHourglass: RelicSpec = {
    name: 'Cursed Hourglass',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Your next 3 stages have par 1 lower.'],
        replace: (params, _state, self: Relic) => (
            self.count('charge') > 0
                ? { ...params, par: params.par - 1 }
                : params
        )
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 3 charge tokens on it.'],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 3)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'path',
        text: ['After generating paths, remove a charge token from this. Then if it has no charge tokens, destroy it.'],
        handles: (_e, _s, _self: Relic) => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            const current = state.data.relics.find(r => r.id === self.id)
            if (!current) return
            const nextCharge = Math.max(current.count('charge') - 1, 0)
            const tokens = new Map(current.tokens)
            tokens.set('charge', nextCharge)
            state.applyToRelic(r => r.update({ tokens }), current)
            if (nextCharge === 0) {
                await removeRelic(state, current.id)
            }
        }
    }]
}
registerSpec(cursedHourglass)

const cursedDoll: RelicSpec = {
    name: 'Cursed Doll',
    burden: true,
    metaReplacers: [{
        kind: 'pathRewards',
        text: ['Your next 2 stages have an additional burden on each path after the first.'],
        replace: (params, _state, self: Relic) => (
            self.count('charge') > 0
                ? { ...params, numBurdens: params.numBurdens + 1 }
                : params
        )
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 2 charge tokens on it.'],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 2)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'path',
        text: ['After generating paths, remove a charge token from this. Then if it has no charge tokens, destroy it.'],
        handles: (_e, _s, _self: Relic) => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            const current = state.data.relics.find(r => r.id === self.id)
            if (!current) return
            const nextCharge = Math.max(current.count('charge') - 1, 0)
            const tokens = new Map(current.tokens)
            tokens.set('charge', nextCharge)
            state.applyToRelic(r => r.update({ tokens }), current)
            if (nextCharge === 0) {
                await removeRelic(state, current.id)
            }
        }
    }]
}
registerSpec(cursedDoll)

const cursedSozu: RelicSpec = {
    name: 'Cursed Sozu',
    burden: true,
    staticReplacers: [{
        kind: 'cost',
        text: ['Potions cost @ more to drink.'],
        handles: params =>
            params.card.spec.isPotion === true
            && (params.actionKind === 'potion' || params.actionKind === 'use'),
        replace: params => ({ ...params, cost: addCosts(params.cost, energy(1)) })
    }]
}
registerSpec(cursedSozu)

const expensiveSozu: RelicSpec = {
    name: 'Expensive Sozu',
    burden: true,
    staticReplacers: [{
        kind: 'cost',
        text: ['Potions cost $2 more to drink.'],
        handles: params =>
            params.card.spec.isPotion === true
            && (params.actionKind === 'potion' || params.actionKind === 'use'),
        replace: params => ({ ...params, cost: addCosts(params.cost, coin(2)) })
    }]
}
registerSpec(expensiveSozu)

const brokenCrown: RelicSpec = {
    name: 'Broken Crown',
    burden: true,
    metaReplacers: [{
        kind: 'reward',
        text: ['Future rewards have 1 less option.'],
        replace: params => ({ ...params, optionCount: Math.max(1, params.optionCount - 1) })
    }]
}
registerSpec(brokenCrown)

const taxCardUpgrade: CardUpgrade = {
    id: 'burden_tax_card',
    name: name => `${name}-`,
    cost: (cost, kind) => kind === 'buy'
        ? { ...cost, coin: cost.coin + 2 }
        : cost,
}
registerEncounterUpgrade('burden_tax_card', taxCardUpgrade)

const decayCardUpgrade: CardUpgrade = {
    id: 'burden_decay_card',
    name: name => `${name}-`,
    staticReplacers: [{
        kind: 'create',
        text: ['When you buy this, put 2 decay tokens on it.'],
        handles: params => params.zone === 'discard',
        replace: params => {
            const tokens = new Map(params.tokens || [])
            incrementMap(tokens, 'decay', 2)
            return { ...params, tokens }
        }
    }]
}
registerEncounterUpgrade('burden_decay_card', decayCardUpgrade)

const taxEventUpgrade: CardUpgrade = {
    id: 'burden_tax_event',
    name: name => `${name}-`,
    cost: (cost, kind) => kind === 'use'
        ? { ...cost, coin: cost.coin + 2 }
        : cost,
}
registerEncounterUpgrade('burden_tax_event', taxEventUpgrade)

function relicBurdenOption(
    id: string,
    spec: RelicSpec,
    description: string,
    options: { minStage?: number, maxStage?: number } = {}
): void {
    registerBurden({
        id,
        title: displayName(spec),
        description,
        ...options,
        createOption: () => ({
            id,
            title: displayName(spec),
            description,
            spec,
            data: null,
        }),
        resolveTransform: async () => gainRelic(spec, { details: `Burden: ${displayName(spec)}` }),
    })
}

relicBurdenOption(
    'fake_coin',
    fakeCoin,
    'At the start of each course, put a decay token on a Copper.'
)

relicBurdenOption(
    'miserly_touch',
    miserlyTouch,
    'At the start of each course, put 3 decay tokens on each Copper without decay.'
)

relicBurdenOption(
    'heavy_stone',
    heavyStone,
    `Whenever you would gain actions from ${refresh.name}, gain 1 less action.`
)

relicBurdenOption(
    'cursed_hourglass',
    cursedHourglass,
    'Your next 3 stages have par 1 lower.',
    { maxStage: 5 }
)

relicBurdenOption(
    'cursed_doll',
    cursedDoll,
    'Your next 2 stages have an additional burden on each path after the first.',
    { maxStage: 5 }
)

relicBurdenOption(
    'cursed_sozu',
    cursedSozu,
    'Potions cost @ more to drink.'
)

relicBurdenOption(
    'expensive_sozu',
    expensiveSozu,
    'Potions cost $2 more to drink.'
)

relicBurdenOption(
    'broken_crown',
    brokenCrown,
    'Future rewards have 1 less option.'
)

registerBurden({
    id: 'lose_anything',
    title: 'Give something up',
    description: 'Give up a card, event, potion, or relic.',
    weight: 3,
    applies: state =>
        state.data.collectedCards.length > 0
        || state.data.collectedEvents.length > 0
        || state.data.potions.length > 0
        || state.data.relics.length > 0,
    createOption: () => ({
        id: 'lose_anything',
        title: 'Give something up',
        description: 'Give up a card, event, potion, or relic.',
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option: BurdenOptionState, state: MetaState) => {
        type LossChoice =
            | { kind: 'card', card: CardSpec }
            | { kind: 'event', event: CardSpec }
            | { kind: 'potion', potion: Card }
            | { kind: 'relic', relic: Relic }
        const options: Array<{ label: string, value: LossChoice, spec?: CardSpec }> = []
        for (const card of state.data.collectedCards) {
            options.push({
                label: `Lose card: ${displayName(card)}`,
                value: { kind: 'card', card },
                spec: card
            })
        }
        for (const event of state.data.collectedEvents) {
            options.push({
                label: `Lose event: ${displayName(event)}`,
                value: { kind: 'event', event },
                spec: event
            })
        }
        for (const potion of state.data.potions) {
            options.push({
                label: `Lose potion: ${displayName(potion.spec)}`,
                value: { kind: 'potion', potion },
                spec: potion.spec
            })
        }
        for (const relic of state.data.relics) {
            options.push({
                label: `Lose relic: ${displayName(relic.spec)}`,
                value: { kind: 'relic', relic },
                spec: relic.spec
            })
        }
        if (options.length === 0) return null
        const picked = await state.ui.chooseOption(
            state,
            'Choose what to give up:',
            options,
            true
        )
        if (!picked) return null
        if (picked.kind === 'card') {
            const chosenName = displayName(picked.card)
            return async function (innerState: MetaState) {
                innerState.removeCard(picked.card.name)
                await addTimelineAction('Burden: Lost a card', chosenName)(innerState)
            }
        }
        if (picked.kind === 'event') {
            const chosenName = displayName(picked.event)
            return async function (innerState: MetaState) {
                innerState.removeEvent(picked.event.name)
                await addTimelineAction('Burden: Lost an event', chosenName)(innerState)
            }
        }
        if (picked.kind === 'potion') {
            const chosenName = displayName(picked.potion.spec)
            return async function (innerState: MetaState) {
                innerState.removePotion(picked.potion.id)
                await addTimelineAction('Burden: Lost a potion', chosenName)(innerState)
            }
        }
        const chosenName = displayName(picked.relic.spec)
        return async function (innerState: MetaState) {
            await removeRelic(innerState, picked.relic.id)
            await addTimelineAction('Burden: Lost a relic', chosenName)(innerState)
        }
    },
})

registerBurden({
    id: 'lose_buffer',
    title: 'Lose 1 buffer',
    description: 'Lose 1 buffer.',
    applies: state => state.data.buffer > 0,
    createOption: () => ({
        id: 'lose_buffer',
        title: 'Lose 1 buffer',
        description: 'Lose 1 buffer.',
        spec: null,
        data: null,
    }),
    resolveTransform: async () => async function (state: MetaState) {
        await addBuffer(-1)(state)
        await addTimelineAction('Burden: Lost 1 buffer')(state)
    },
})

registerBurden({
    id: 'lose_potion_brew',
    title: 'Trade a potion',
    description: `Give up a potion and gain ${beggarsBrew.name}.`,
    applies: state => state.data.potions.length > 0,
    createOption: () => ({
        id: 'lose_potion_brew',
        title: 'Trade a potion',
        description: `Give up a potion and gain ${beggarsBrew.name}.`,
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option, state) => {
        const picked = await state.ui.chooseCard(state, 'Choose a potion to give up:', [...state.data.potions], true)
        if (!picked) return null
        const chosenName = displayName(picked.spec)
        return async function (innerState: MetaState) {
            innerState.removePotion(picked.id)
            await gainPotion(beggarsBrew, { details: `Gave up ${chosenName}` })(innerState)
        }
    },
})

registerBurden({
    id: 'freeze_relic',
    title: 'Freeze a relic',
    description: 'Give up a relic and gain a Frozen version of it.',
    maxStage: 5,
    applies: state => state.data.relics.some(relic => relic.spec.burden !== true),
    createOption: () => ({
        id: 'freeze_relic',
        title: 'Freeze a relic',
        description: 'Give up a relic and gain a Frozen version of it.',
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option, state) => {
        const options = state.data.relics.filter(relic => relic.spec.burden !== true)
        if (options.length === 0) return null
        const picked = await state.ui.chooseCard(state, 'Choose a relic to freeze:', options, true)
        if (!picked) return null
        const chosenName = displayName(picked.spec)
        return async function (innerState: MetaState) {
            await removeRelic(innerState, picked.id)
            await gainNotedRelic(frozenRelic, [picked.spec], {
                details: `Froze ${chosenName}`
            })(innerState)
        }
    },
})

registerBurden({
    id: 'tax_card',
    title: 'Tax a card',
    description: 'Choose a card. It costs $2 more to buy.',
    applies: state => state.data.collectedCards.length > 0,
    createOption: () => ({
        id: 'tax_card',
        title: 'Tax a card',
        description: 'Choose a card. It costs $2 more to buy.',
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option, state) => {
        const picked = await state.ui.chooseCard(state, 'Choose a card to tax:', [...state.data.collectedCards], true)
        if (!picked) return null
        const chosenName = displayName(picked)
        return async function (innerState: MetaState) {
            const cards = [...innerState.data.collectedCards]
            const index = cards.indexOf(picked)
            if (index >= 0) {
                cards[index] = upgradeCardSpec(cards[index], taxCardUpgrade)
                innerState.update({ collectedCards: cards })
                await addTimelineAction('Burden: Taxed a card', chosenName)(innerState)
            }
        }
    },
})

registerBurden({
    id: 'decay_card',
    title: 'Decay a card',
    description: 'Choose a card. It is bought with 2 decay tokens.',
    applies: state => state.data.collectedCards.length > 0,
    createOption: () => ({
        id: 'decay_card',
        title: 'Decay a card',
        description: 'Choose a card. It is bought with 2 decay tokens.',
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option, state) => {
        const picked = await state.ui.chooseCard(state, 'Choose a card to decay:', [...state.data.collectedCards], true)
        if (!picked) return null
        const chosenName = displayName(picked)
        return async function (innerState: MetaState) {
            const cards = [...innerState.data.collectedCards]
            const index = cards.indexOf(picked)
            if (index >= 0) {
                cards[index] = upgradeCardSpec(cards[index], decayCardUpgrade)
                innerState.update({ collectedCards: cards })
                await addTimelineAction('Burden: Decayed a card', chosenName)(innerState)
            }
        }
    },
})

registerBurden({
    id: 'tax_event',
    title: 'Tax an event',
    description: 'Choose an event. It costs $2 more to use.',
    applies: state => state.data.collectedEvents.length > 0,
    createOption: () => ({
        id: 'tax_event',
        title: 'Tax an event',
        description: 'Choose an event. It costs $2 more to use.',
        spec: null,
        data: null,
    }),
    resolveTransform: async (_option, state) => {
        const picked = await state.ui.chooseCard(state, 'Choose an event to tax:', [...state.data.collectedEvents], true)
        if (!picked) return null
        const chosenName = displayName(picked)
        return async function (innerState: MetaState) {
            const events = [...innerState.data.collectedEvents]
            const index = events.indexOf(picked)
            if (index >= 0) {
                events[index] = upgradeCardSpec(events[index], taxEventUpgrade)
                innerState.update({ collectedEvents: events })
                await addTimelineAction('Burden: Taxed an event', chosenName)(innerState)
            }
        }
    },
})
