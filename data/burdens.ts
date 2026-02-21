import {
    Card,
    CardSpec,
    CardUpgrade,
    ResourceEvent,
    addCosts,
    addToken,
    coin,
    copper,
    decayRule,
    displayName,
    gainCoins,
    incrementMap,
    refresh,
} from '../gameLogic.js'
import {
    BurdenOptionState,
    MetaState,
    Relic,
    RelicSpec,
    TOTAL_STAGES,
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
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 3 charge tokens on it.'],
        simpleText: [`This starts with 3 charge tokens on it.`],
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

function makeFrozenRelicSpec(baseRelic: RelicSpec): RelicSpec {
    return {
        ...frozenRelic,
        name: `Frozen ${displayName(baseRelic)}`
    }
}

const fakeCoin: RelicSpec = {
    name: 'Fake Coin',
    burden: true,
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put a decay token on a Copper without decay tokens.'],
        simpleText: [`One of your coppers starts with a decay token.`],
        handles: () => true,
        transform: () => async function (state) {
            const target = state.discard.find(card => card.name === copper.name && card.count('decay') === 0)
            if (!target) return state
            return addToken(target, 'decay')(state)
        }
    }],
    rules: [decayRule]
}
registerSpec(fakeCoin)

const miserlyTouch: RelicSpec = {
    name: 'Miserly Touch',
    burden: true,
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put 3 decay tokens on each Copper in your discard without decay tokens.'],
        simpleText: [`Your coppers start with 3 decay tokens.`],
        handles: () => true,
        transform: () => async function (state) {
            for (const target of state.discard.filter(card => card.name === copper.name && card.count('decay') === 0)) {
                state = await addToken(target, 'decay', 3)(state)
            }
            return state
        }
    }],
    rules: [decayRule]
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
    name: 'Leaking Inkwell',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Each stage has par 1 lower.'],
        simpleText: ['Your next 2 stages have par 1 lower.'],
        replace: (params, _state, self: Relic) => ({ ...params, par: params.par - 1 })
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 2 charge tokens on it.'],
        simpleText: [],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 2)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'end',
        text: ['At the end of each stage remove a charge token from this. Then if it has no charge tokens, destroy it.'],
        simpleText: [],
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
        simpleText: ['Your next 2 stages have an additional burden on each path.'],
        text: ['Each path has an additional burden on it.'],
        replace: (params, _state, self: Relic) => (
            { ...params, numBurdens: params.numBurdens + 1 }
        )
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 2 charge tokens on it.'],
        simpleText: [],
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
        simpleText: [],
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

const cursedKey: RelicSpec = {
    name: 'Cursed Key',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 1 lower.'],
        replace: (params, state) => (
            {...params, par: params.par - 1 }
        )
    }, {
        kind: 'extraOptions',
        text: ['You can skip any reward to destroy this.'],
        replace: params => ({ ...params, options: params.options.concat(['destroyCursedKey']) })
    }]
}
registerSpec(cursedKey)

const cursedBoots: RelicSpec = {
    name: 'Cursed Boots',
    burden: true,
    metaReplacers: [{
        kind: 'pathRewards',
        text: [
            'Remove the first path option.',
            'If this has a charge token, add a path option "Use Cursed Boots."'
        ],
        simpleText: ['Remove first path; if charged, add Use Cursed Boots.'],
        replace: (params, _state, self: Relic) => {
            const paths = params.paths.slice(1)
            if (self.count('charge') > 0) {
                paths.push({
                    label: 'Use Cursed Boots',
                    onSelectEffects: [{ kind: 'spendRelicCharge', relicID: self.id, amount: 1 }]
                })
            }
            return { ...params, paths }
        }
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put a charge token on it.'],
        simpleText: ['This starts with a charge token.'],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 1)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }]
}
registerSpec(cursedBoots)

const cursedBanner: RelicSpec = {
    name: 'Cursed Hourglass',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 3 lower on the final stage.'],
        simpleText: ['Final-stage par is 3 lower.'],
        replace: (params, state) => (
            state.data.stage === TOTAL_STAGES - 1
                ? { ...params, par: params.par - 3 }
                : params
        )
    }],
    metaTriggers: [{
        kind: 'end',
        text: ['Whenever you beat par by 3 or more, destroy this.'],
        simpleText: ['Beat par by 3+: destroy this.'],
        handles: e => e.score <= e.par - 3,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            await removeRelic(state, self.id)
        }
    }]
}
registerSpec(cursedBanner)

const cursedSozu: RelicSpec = {
    name: 'Sozu',
    burden: true,
    metaTriggers: [{
        kind: 'potion',
        text: ['Whenever you gain a potion, lose 1 buffer.'],
        simpleText: ['Whenever you gain a potion, lose 1 buffer.'],
        handles: () => true,
        transform: () => addBuffer(-1)
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
        text: ['When you pick the third option from a reward pack, lose 1 buffer.'],
        simpleText: ['Third reward option: lose 1 buffer.'],
        replace: params => {
            const pickBufferAdjustments = [...params.pickBufferAdjustments]
            pickBufferAdjustments[2] = (pickBufferAdjustments[2] ?? 0) - 1
            return { ...params, pickBufferAdjustments }
        }
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
        handles: (params, s, source) => params.zone === 'discard' && params.spec.name === source.name,
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
    options: { minStage?: number, maxStage?: number } = {}
): void {
    registerBurden({
        id,
        title: displayName(spec),
        ...options,
        applies: state => !state.data.relics.some(relic => relic.spec.name === spec.name),
        createOption: () => ({
            id,
            title: displayName(spec),
            spec,
            data: null,
        }),
        resolveTransform: async () => gainRelic(spec, { details: `Burden: ${displayName(spec)}` }),
    })
}

relicBurdenOption(
    'fake_coin',
    fakeCoin
)

relicBurdenOption(
    'miserly_touch',
    miserlyTouch
)

relicBurdenOption(
    'heavy_stone',
    heavyStone
)

relicBurdenOption(
    'cursed_hourglass',
    cursedHourglass,
    { maxStage: 5 }
)

relicBurdenOption(
    'cursed_doll',
    cursedDoll,
    { maxStage: 5 }
)

relicBurdenOption(
    'cursed_key',
    cursedKey,
    { maxStage: TOTAL_STAGES - 2 }
)

relicBurdenOption(
    'cursed_boots',
    cursedBoots,
    { maxStage: TOTAL_STAGES - 3 }
)

relicBurdenOption(
    'cursed_banner',
    cursedBanner
)

relicBurdenOption(
    'cursed_sozu',
    cursedSozu
)

relicBurdenOption(
    'expensive_sozu',
    expensiveSozu
)

relicBurdenOption(
    'broken_crown',
    brokenCrown,
    { maxStage: TOTAL_STAGES - 2 }
)

registerBurden({
    id: 'lose_anything',
    title: 'Forsake',
    description: 'Give up a card, event, potion, or relic.',
    weight: 3,
    applies: state =>
        state.data.collectedCards.length > 0
        || state.data.collectedEvents.length > 0
        || state.data.potions.length > 0
        || state.data.relics.some(relic => relic.spec.burden !== true),
    resolveTransform: async (_option: BurdenOptionState, state: MetaState) => {
        const cardOptions = [...state.data.collectedCards]
        const eventOptions = [...state.data.collectedEvents]
        const potionOptions = [...state.data.potions]
        const relicOptions = state.data.relics.filter(candidate => candidate.spec.burden !== true)
        const options: Array<CardSpec | Card> = [
            ...cardOptions,
            ...eventOptions,
            ...potionOptions,
            ...relicOptions
        ]
        if (options.length === 0) return null
        const picked = await state.ui.chooseCard(
            state,
            'Choose what to give up:',
            options,
            true
        )
        if (!picked) return null
        if (picked instanceof Relic) {
            const chosenName = displayName(picked.spec)
            return async function (innerState: MetaState) {
                await removeRelic(innerState, picked.id)
                await addTimelineAction('Burden: Lost a relic', chosenName)(innerState)
            }
        }
        if (picked instanceof Card) {
            const chosenName = displayName(picked.spec)
            return async function (innerState: MetaState) {
                innerState.removePotion(picked.id)
                await addTimelineAction('Burden: Lost a potion', chosenName)(innerState)
            }
        }
        if (eventOptions.includes(picked)) {
            const chosenName = displayName(picked)
            return async function (innerState: MetaState) {
                innerState.removeEvent(picked.name)
                await addTimelineAction('Burden: Lost an event', chosenName)(innerState)
            }
        }
        const chosenName = displayName(picked)
        return async function (innerState: MetaState) {
            innerState.removeCard(picked.name)
            await addTimelineAction('Burden: Lost a card', chosenName)(innerState)
        }
    },
})

registerBurden({
    id: 'lose_buffer',
    title: 'Falter',
    description: 'Lose 1 buffer.',
    applies: state => state.data.buffer > 0,
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
    description: 'Freeze a relic for the next 2 stages.',
    maxStage: 5,
    applies: state => state.data.relics.some(relic => relic.spec.burden !== true),
    resolveTransform: async (_option, state) => {
        const options = state.data.relics.filter(relic => relic.spec.burden !== true)
        if (options.length === 0) return null
        const picked = await state.ui.chooseCard(state, 'Choose a relic to freeze:', options, true)
        if (!picked) return null
        const chosenName = displayName(picked.spec)
        const frozenSpec = makeFrozenRelicSpec(picked.spec)
        return async function (innerState: MetaState) {
            await removeRelic(innerState, picked.id)
            await gainNotedRelic(frozenSpec, [picked.spec], {
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
    title: 'Weaken a card',
    description: 'Choose a card. Whenever that card is created, put 2 decay tokens on it.',
    rules: [decayRule],
    applies: state => state.data.collectedCards.length > 0,
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
