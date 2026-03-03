import {
    Card,
    CardSpec,
    CardUpgrade,
    CreateParams,
    Effect,
    ResourceEvent,
    Rule,
    State,
    Token,
    Transform,
    addCosts,
    addToken,
    coin,
    copper,
    decayRule,
    displayName,
    gainCoins,
    isBurdened,
    incrementMap,
    refresh,
} from '../gameLogic.js'
import {
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
    GameSetupParams,
    Burden,
} from '../metaLogic.js'
import { beggarsBrew } from './potions.js'
import { registerRelicSpec } from '../registry.js'

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
        text: ['When you gain this, put 2 charge tokens on it.'],
        simpleText: [`This starts with 2 charge tokens on it.`],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 2)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'start',
        text: ['At the start of each course, remove a charge token from this. If it had no charge tokens, instead destroy it and regain the frozen relic.'],
        handles: (_e, _s, _self: Relic) => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            const current = state.data.relics.find(r => r.id === self.id)
            if (!current) return
            if (current.count('charge') === 0) {
                const thawed = (current.notedCards?.[0] as RelicSpec | undefined) ?? null
                await removeRelic(state, current.id)
                await gainRelic(thawed!, { details: `Thawed ${displayName(thawed!)}` })(state)
            } else {
                const nextCharge = Math.max(current.count('charge') - 1, 0)
                const tokens = new Map(current.tokens)
                tokens.set('charge', nextCharge)
                state.applyToRelic(r => r.update({ tokens }), current)
            }
        }
    }]
}
registerRelicSpec(frozenRelic)

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
        text: ['At the start of the game, put a decay token on a Copper without any, or if all of your Coppers have a decay token remove all but one token from a Copper with the maximal number of decay tokens.'],
        simpleText: [`One of your coppers starts with a decay token.`],
        handles: () => true,
        transform: () => async function (state) {
            // Set target to be the copper with the smallest card.count('decay')
            const target = state.discard.filter(card => card.name === copper.name).reduce((best, card) => {
                if (!best) return card
                if (card.count('decay') == 0) return card
                else if (card.count('decay') > best.count('decay')) return card
                return best
            }, null as Card | null)
            if (target != null) {
                return setDecayTransform(target, 1)(state)
            } else {
                return state
            }
        }
    }],
    rules: [decayRule]
}
registerRelicSpec(fakeCoin)

const miserlyTouch: RelicSpec = {
    name: 'Miserly Touch',
    burden: true,
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, put 3 decay tokens on each Copper in your discard without decay tokens or with more than 3 tokens.'],
        simpleText: [`Your coppers start with 3 decay tokens.`],
        handles: () => true,
        transform: () => async function (state) {
            for (const target of state.discard.filter(card => card.name === copper.name)) {
                state = await setDecayTransform(target, 3)(state)
            }
            return state
        }
    }],
    rules: [decayRule]
}
registerRelicSpec(miserlyTouch)

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
registerRelicSpec(heavyStone)

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
registerRelicSpec(cursedHourglass)

const cursedDoll: RelicSpec = {
    name: 'Cursed Doll',
    burden: true,
    metaReplacers: [{
        kind: 'burden',
        simpleText: ['In the next burden you encounter, pick 2 of 3 options instead of 1 of 2.'],
        text: ['In the next burden you encounter, pick 2 of 3 options instead of 1 of 2.'],
        replace: params => ({ ...params, numOptions: params.numOptions + 1, numPicked: params.numPicked + 1 })
    }],
    metaTriggers: [{
        kind: 'burdenGeneration',
        text: [],
        simpleText: [],
        handles: () => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            await removeRelic(state, self.id)
        }
    }]
}
registerRelicSpec(cursedDoll)

const cursedKey: RelicSpec = {
    name: 'Cursed Key',
    burden: true,
    metaReplacers: [{
        kind: 'reward',
        text: ['Each reward has 1 fewer option.'],
        replace: (params) => ({
            ...params,
            optionCount: Math.max(1, params.optionCount - 1)
        })
    }, {
        kind: 'extraOptions',
        text: ['You can skip any reward to destroy this.'],
        replace: params => ({ ...params, options: params.options.concat(['destroyCursedKey']) })
    }]
}
registerRelicSpec(cursedKey)

const cursedBoots: RelicSpec = {
    name: 'Cursed Boots',
    burden: true,
    metaReplacers: [{
        kind: 'pathRewards',
        text: [
            'Remove the first path option.',
            'If this has a charge token, add a new path option that spends the charge token.'
        ],
        simpleText: ['You can only pick the first path one more time this game.'],
        replace: (params, _state, self: Relic) => {
            const paths = params.paths.slice(1)
            if (self.count('charge') > 0) {
                paths.unshift({
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
        simpleText: [],
        handles: (e, _s, self: Relic) => self.id === e.relic.id,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            if (!state.data.relics.some(r => r.id === self.id)) return
            const tokens = new Map(self.tokens)
            tokens.set('charge', 1)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }]
}
registerRelicSpec(cursedBoots)

const cursedBanner: RelicSpec = {
    name: 'Cursed Hourglass',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 3 lower on the final stage.'],
        replace: (params, state) => (
            state.data.stage === TOTAL_STAGES - 1
                ? { ...params, par: params.par - 3 }
                : params
        )
    }],
    metaTriggers: [{
        kind: 'end',
        text: ['Whenever you beat par by 3 or more, destroy this.'],
        handles: e => e.score <= e.par - 3,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            await removeRelic(state, self.id)
        }
    }]
}
registerRelicSpec(cursedBanner)

const sozu: RelicSpec = {
    name: 'Sozu',
    burden: true,
    metaReplacers: [{
        kind: 'reward',
        text: ['Whenever you pick a potion reward, lose 1 buffer.'],
        replace: params => {
            if (params.rewardKind !== 'potion') return params
            const pickBufferAdjustments = [...params.pickBufferAdjustments]
            for (let i = 0; i < params.optionCount; i++) {
                pickBufferAdjustments[i] = (pickBufferAdjustments[i] ?? 0) - 1
            }
            return { ...params, pickBufferAdjustments }
        }
    }]
}
registerRelicSpec(sozu)

const expensiveFlask: RelicSpec = {
    name: 'Expensive Flask',
    burden: true,
    staticReplacers: [{
        kind: 'cost',
        text: ['Potions cost $1 more to drink.'],
        handles: params =>
            params.card.spec.isPotion === true
            && (params.actionKind === 'potion' || params.actionKind === 'use'),
        replace: params => ({ ...params, cost: addCosts(params.cost, coin(1)) })
    }]
}
registerRelicSpec(expensiveFlask)

const brokenCrown: RelicSpec = {
    name: 'Broken Crown',
    burden: true,
    metaReplacers: [{
        kind: 'reward',
        text: ['When you pick the first option from a reward pack, lose 1 buffer.'],
        replace: params => {
            const pickBufferAdjustments = [...params.pickBufferAdjustments]
            pickBufferAdjustments[0] = (pickBufferAdjustments[0] ?? 0) - 1
            return { ...params, pickBufferAdjustments }
        }
    }]
}
registerRelicSpec(brokenCrown)

const taxCardUpgrade: CardUpgrade = {
    id: 'burden_tax_card',
    burden: true,
    name: name => `${name}−`,
    cost: (cost, kind) => kind === 'buy'
        ? { ...cost, coin: cost.coin + 2 }
        : cost,
}
registerEncounterUpgrade('burden_tax_card', taxCardUpgrade)

function setDecayTransform(card: Card, numTokens: number): Transform {
    return async function (state: State) {
        const currentCount = card.count('decay')
        if (currentCount < numTokens && currentCount > 0) return state // Don't increase decay tokens
        state = await addToken(card, 'decay', numTokens - currentCount)(state)
        return state
    }
} 

function setDecayReplacer(numTokens: number): ((params: CreateParams) => CreateParams) {
    return params => {
        const tokens = new Map(params.tokens || [])
        if (!tokens.has('decay') || tokens.get('decay')! > numTokens) {
            tokens.set('decay', numTokens)
        }
        return { ...params, tokens }
    }
}

const weakenCardUpgrade: CardUpgrade = {
    id: 'burden_weaken_card',
    burden: true,
    name: name => `${name}−`,
    rules: [decayRule],
    staticReplacers: [{
        kind: 'create',
        text: ['When you create a card from this supply put 2 decay tokens on it if it has none. If it has more than 2 decay tokens, remove all but 2.'],
        simpleText: [`This is created with 2 decay tokens on it.`],
        handles: (params, s, source) => params.spec.name === source.name,
        replace: setDecayReplacer(2)
    }]
}
registerEncounterUpgrade('burden_weaken_card', weakenCardUpgrade)

const dullCardUpgrade: CardUpgrade = {
    id: 'burden_dull_card',
    burden: true,
    name: name => `${name}−`,
    cost: (cost, kind) => kind === 'play'
        ? { ...cost, coin: cost.coin + 1 }
        : cost,
}
registerEncounterUpgrade('burden_dull_card', dullCardUpgrade)

const taxEventUpgrade: CardUpgrade = {
    id: 'burden_tax_event',
    burden: true,
    name: name => `${name}−`,
    cost: (cost, kind) => kind === 'use'
        ? { ...cost, coin: cost.coin + 2 }
        : cost,
}
registerEncounterUpgrade('burden_tax_event', taxEventUpgrade)

function relicBurdenOption(
    spec: RelicSpec,
    options: { minStage?: number, maxStage?: number } = {}
): Burden {
    registerRelicSpec(spec)
    const id = spec.name
    return registerBurden({
        name: id,
        render: {
            kind: 'relic',
            spec: spec
        },
        minStage: options.minStage,
        maxStage: options.maxStage,
        ...options,
        applies: state => !state.data.relics.some(relic => relic.spec.name === spec.name),
        resolve: async function (state, skipped) {
            await addTimelineAction(`Burden: ${id}`, undefined, skipped)(state)
            await gainRelic(spec, { silent: true })(state)
            return true
        }
    })
}

export const fakeCoinBurden = relicBurdenOption(fakeCoin)
export const miserlyTouchBurden = relicBurdenOption(miserlyTouch)
export const heavyStoneBurden = relicBurdenOption(heavyStone)
export const cursedHourglassBurden = relicBurdenOption(cursedHourglass, { maxStage: TOTAL_STAGES - 2 })
export const cursedDollBurden = relicBurdenOption(cursedDoll, { maxStage: TOTAL_STAGES - 2 })
export const cursedKeyBurden = relicBurdenOption(cursedKey, { maxStage: TOTAL_STAGES - 2 })
export const cursedBootsBurden = relicBurdenOption(cursedBoots, { maxStage: TOTAL_STAGES - 3 })
export const cursedBannerBurden = relicBurdenOption(cursedBanner)
export const sozuBurden = relicBurdenOption(sozu, { maxStage: TOTAL_STAGES - 2 })
export const expensiveFlaskBurden = relicBurdenOption(expensiveFlask)
export const brokenCrownBurden = relicBurdenOption(brokenCrown, { maxStage: TOTAL_STAGES - 2 })

const cursedCompass: RelicSpec = {
    name: 'Cursed Compass',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['The left challenge has par 1 lower.'],
        replace: (p: GameSetupParams) => p.challengeIndex === 0 ? { ...p, par: p.par - 1 } : p
    }]
}
registerRelicSpec(cursedCompass)
export const cursedCompassBurden = relicBurdenOption(cursedCompass)

const cursedLever: RelicSpec = {
    name: 'Cursed Lever',
    burden: true,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['VP targets are 20% higher (rounded down).'],
        replace: (p: GameSetupParams) => ({ ...p, vpGoal: Math.floor(p.vpGoal * 1.2) })
    }]
}
registerRelicSpec(cursedLever)
export const cursedLeverBurden = relicBurdenOption(cursedLever)

registerBurden({
    name: 'Forsake',
    render: {
        kind: 'text',
        description: 'Give up a card, event, potion, or relic.',
    },
    applies: state =>
        state.data.collectedCards.some(card => !isBurdened(card))
        || state.data.collectedEvents.some(event => !isBurdened(event))
        || state.data.potions.some(potion => !isBurdened(potion.spec))
        || state.data.relics.some(relic => !isBurdened(relic.spec)),
    resolve: async function (state: MetaState, skipped: string[]): Promise<boolean> {
        const cardOptions = state.data.collectedCards.filter(card => !isBurdened(card))
        const eventOptions = state.data.collectedEvents.filter(event => !isBurdened(event))
        const potionOptions = state.data.potions.filter(potion => !isBurdened(potion.spec))
        const relicOptions = state.data.relics.filter(candidate => !isBurdened(candidate.spec))
        const options: Array<['card', CardSpec] | ['event', CardSpec] | ['potion', Card] | ['relic', Relic]> = [
            ...cardOptions.map(spec => ['card', spec] as ['card', CardSpec]),
            ...eventOptions.map(spec => ['event', spec] as ['event', CardSpec]),
            ...potionOptions.map(spec => ['potion', spec] as ['potion', Card]),
            ...relicOptions.map(relic => ['relic', relic] as ['relic', Relic])
        ]
        if (options.length === 0) return false
        const picked = await state.ui.chooseCard(
            state,
            'Choose what to give up:',
            options,
            true
        )
        if (!picked) return false
        switch (picked[0]) {
            case 'relic':
                const relic:Relic = picked[1]
                const relicName = displayName(relic.spec)
                await removeRelic(state, relic.id)
                await addTimelineAction('Burden: Forsake', `Lost ${relicName}`, skipped)(state)
                return true
            case 'potion':
                const potion:Card = picked[1]
                const potionName = displayName(potion.spec)
                state.removePotion(potion.id)
                await addTimelineAction('Burden: Forsake', `Lost ${potionName}`, skipped)(state)
                return true
            case 'event':
                const eventSpec:CardSpec = picked[1]
                const eventName = displayName(eventSpec)
                state.removeEvent(eventSpec.name)
                await addTimelineAction('Burden: Forsake', `Lost ${eventName}`, skipped)(state)
                return true
            case 'card':
                const cardSpec:CardSpec = picked[1]
                const cardName = displayName(cardSpec)
                state.removeCard(cardSpec.name)
                await addTimelineAction('Burden: Forsake', `Lost ${cardName}`, skipped)(state)
                return true
        }
    },
})

export const falter = registerBurden({
    name: 'Falter',
    render: {
        kind: 'text',
        description: 'Lose 1 buffer.',
    },
    applies: state => state.data.buffer > 0,
    resolve: async function (state:MetaState, skipped) {
        await addBuffer(-1)(state)
        await addTimelineAction('Burden: Lost 1 buffer', undefined, skipped)(state)
        return true
    },
})

export const tradePotion = registerBurden({
    name: 'Trade a potion',
    render: {
        kind: 'text',
        description: `Give up a potion and gain ${beggarsBrew.name}.`,
    },
    applies: state => state.data.potions.some(potion => !isBurdened(potion.spec)),
    resolve: async function (state:MetaState, skipped: string[]) {
        const validPotions = state.data.potions.filter(potion => !isBurdened(potion.spec)).map(potion => ['potion', potion] as ['potion', Card])
        const picked = await state.ui.chooseCard(state, 'Choose a potion to give up:', validPotions, true)
        if (!picked) return false
        const chosenName = displayName(picked[1].spec)
        state.removePotion(picked[1].id)
        await gainPotion(beggarsBrew, { details: `Gave up ${chosenName}`, skipped })(state)
        return true
    },
})

export const freezeRelic = registerBurden({
    name: 'Freeze a relic',
    render: {
        kind: 'text',
        description: 'Freeze a relic for the next 2 stages.',
    },
    maxStage: 5,
    applies: state => state.data.relics.some(relic => !isBurdened(relic.spec)),
    resolve: async function (state, skipped) {
        const options = state.data.relics.filter(relic => !isBurdened(relic.spec)).map(relic => ['relic', relic] as ['relic', Relic])
        if (options.length === 0) return false
        const picked = await state.ui.chooseCard(state, 'Choose a relic to freeze:', options, true)
        if (!picked) return false
        const chosenName = displayName(picked[1].spec)
        const frozenSpec = makeFrozenRelicSpec(picked[1].spec)
        await removeRelic(state, picked[1].id)
        await gainNotedRelic(frozenSpec, [picked[1].spec], { silent: true })(state)
        await addTimelineAction(`Froze ${chosenName}`, undefined, skipped)(state)
        return true
    },
})

function registerDowngradeBurden(options: {
    name: string,
    description: string,
    upgrade: CardUpgrade,
    type: 'card' | 'event',
    prompt: string,
    timelineLabel: string,
    rules?: Rule[],
}): Burden {
    const collection = options.type === 'card' ? 'collectedCards' : 'collectedEvents'
    return registerBurden({
        name: options.name,
        render: {
            kind: 'text',
            description: options.description,
            rules: options.rules,
        },
        applies: state => state.data[collection].some(spec => !isBurdened(spec)),
        resolve: async function(state: MetaState, skipped: string[]) {
            const valid:['card' | 'event', CardSpec][] = state.data[collection].filter(spec => !isBurdened(spec)).map(spec => [options.type, spec])
            const picked = await state.ui.chooseCard(state, options.prompt, valid, true)
            if (!picked) return false
            const chosenName = displayName(picked[1])
            const items = [...state.data[collection]]
            const index = items.indexOf(picked[1])
            if (index >= 0) {
                items[index] = upgradeCardSpec(items[index], options.upgrade)
                state.update({ [collection]: items })
                await addTimelineAction(options.timelineLabel, chosenName, skipped)(state)
            }
            return true
        },
    })
}

export const taxCard = registerDowngradeBurden({
    name: 'Tax a card',
    description: 'Choose a card. It costs $2 more to buy.',
    upgrade: taxCardUpgrade, type: 'card',
    prompt: 'Choose a card to tax:', timelineLabel: 'Burden: Taxed a card',
})

export const weakenCard = registerDowngradeBurden({
    name: 'Weaken a card',
    description: 'Choose a card. Whenever that card is created, put 2 decay tokens on it.',
    upgrade: weakenCardUpgrade, type: 'card',
    prompt: 'Choose a card to decay:', timelineLabel: 'Burden: Decayed a card',
    rules: [decayRule],
})

export const dullCard = registerDowngradeBurden({
    name: 'Dull a card',
    description: 'Choose a card. It costs $1 more to play.',
    upgrade: dullCardUpgrade, type: 'card',
    prompt: 'Choose a card to dull:', timelineLabel: 'Burden: Dulled a card',
})

export const taxEvent = registerDowngradeBurden({
    name: 'Tax an event',
    description: 'Choose an event. It costs $2 more to use.',
    upgrade: taxEventUpgrade, type: 'event',
    prompt: 'Choose an event to tax:', timelineLabel: 'Burden: Taxed an event',
})
