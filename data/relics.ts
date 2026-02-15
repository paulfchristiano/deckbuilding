import {
    CardSpec, Card,
    gainActions, gainBuys,
    addCosts,
    create,
    copper,
    silver,
    gold,
    ResourceEvent,
    refresh, relicRewards,
    sourceHasName,
    displayName,
    doAll,
    repeat
} from '../gameLogic.js'
import { registerSpec } from '../registry.js'

import {
    GameSetupParams, RewardParams, ExtraOptionsParams, PathRewardParams,
    CourseEndEvent, CourseStartEvent, GainRelicEvent, GainCardEvent, GainEventEvent, PathGenerationEvent,
    MetaTransform, addBuffer, gainPotion, gainRelic, RelicSpec, Relic,
    MetaState,
} from '../metaLogic.js'
import { makeBottledEventPotion } from './specialSpecs.js'

// Bag of Coins: Start with an extra copper
export const bagOfCoins: RelicSpec = {
    name: 'Bag of Coins',
    simpleText: ['Start with an extra copper.'],
    triggers: [{
        kind: 'beforeStart',
        text: 'At the start of the game, create two coppers in your discard.',
        handles: () => true,
        transform: () => repeat(create(copper, 'discard'), 2)
    }]
}
relicRewards.push(bagOfCoins)

export const bagOfPreparation: RelicSpec = {
    name: 'Bag of Preparation',
    simpleText: [
        'At the start of the game, +10 actions.',
        'You can\'t lose actions except by paying costs.'
    ],
    staticReplacers: [{
        text: `You can't lose actions (other than by paying costs).`,
        kind: 'resource',
        handles: (p: ResourceEvent) => p.amount < 0 && p.resource == 'actions',
        replace: p => ({ ...p, amount: 0 })
    }],
    triggers: [{
        kind: 'afterStart',
        handles: () => true,
        text: 'At the start of the game, +10 actions.',
        transform: (_e, _s, c) => gainActions(10, c)
    }]
}
relicRewards.push(bagOfPreparation)

export const courier: RelicSpec = {
    name: 'Courier',
    simpleText: ['+2 buys, +1 action each time you refresh.'],
    triggers: [{
        kind: 'afterUse',
        text: `After using ${refresh.name}, +2 buys and +1 action.`,
        handles: (e, s, c) => e.card.name === refresh.name,
        transform: (e, s, c) => doAll([gainBuys(2, c), gainActions(1, c)])
    }],
}
relicRewards.push(courier)

// Inkwell: Par is 1@ higher on each course
export const inkwell: RelicSpec = {
    name: 'Inkwell',
    simpleText: [`Par is 1@ higher on each course.`],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, par: p.par + 1 })
    }]
}
relicRewards.push(inkwell)

// Elegant Quill: Gain 2@ buffer (one-time effect on acquisition)
export const elegantQuill: RelicSpec = {
    name: 'Elegant Quill',
    simpleText: [`+2@ buffer when you gain this.`],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, s: MetaState, self: Relic) => self.id == e.relic.id,
        transform: (e: GainRelicEvent) => addBuffer(2)
    }]
}
relicRewards.push(elegantQuill)

// Broken Lever: VP targets are 25% lower
export const brokenLever: RelicSpec = {
    name: 'Broken Lever',
    simpleText: [`VP targets are 25% lower.`],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, vpGoal: Math.ceil(p.vpGoal * 0.75) })
    }]
}
relicRewards.push(brokenLever)

export const darkBanner: RelicSpec = {
    name: 'Dark Banner',
    simpleText: [
        'Par is 4@ lower on each course.',
        'Gain 3@ buffer at the start of each course.'
    ],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 4 })
    }],
    metaTriggers: [{
        kind: 'start',
        handles: (e: CourseStartEvent) => true,
        transform: (e: CourseStartEvent) => addBuffer(3)
    }]
}
relicRewards.push(darkBanner)

export const silverMirror: RelicSpec = {
    name: 'Silver Mirror',
    simpleText: [
        'The next time you gain a relic,',
        'gain two additional copies of that relic.'
    ],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, _s: MetaState, relic: Relic) => e.relic.id !== relic.id && e.relic.name !== 'Silver Mirror',
        transform: (e: GainRelicEvent, _s: MetaState, relic: Relic) => async function (state: MetaState) {
            state.removeRelic(relic.id)
            await gainRelic(e.relic.spec)(state)
            await gainRelic(e.relic.spec)(state)
        },
    }]
}
relicRewards.push(silverMirror)

export const sacredBark: RelicSpec = {
    name: 'Sacred Bark',
    simpleText: [
        'Whenever you use a potion, repeat its effect.',
        'When you gain this, lose 3 buffer.'
    ],
    gainRequirement: (state: MetaState) => state.data.buffer >= 3,
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
        transform: () => addBuffer(-3)
    }],
    triggers: [{
        kind: 'afterUse',
        text: 'After using a potion other than with this, use it again.',
        handles: (e, _state, _card) => e.card.spec.isPotion === true && !sourceHasName(e.source, 'Sacred Bark'),
        transform: (e, _state, card) => e.card.activate('potion', card)
    }]
}
relicRewards.push(sacredBark)

export const discountCard: RelicSpec = {
    name: 'Discount card',
    simpleText: ['Silver and Gold cost $2 less to buy (but not less than $1).'],
    staticReplacers: [{
        text: 'Silver and Gold cost $2 less to buy, but not less than $1.',
        kind: 'cost',
        handles: p =>
            p.actionKind === 'buy'
            && (p.card.spec.name === silver.name || p.card.spec.name === gold.name),
        replace: p => {
            const reduction = Math.max(Math.min(2, p.cost.coin - 1), 0)
            return { ...p, cost: addCosts(p.cost, { coin: -reduction }) }
        }
    }]
}
relicRewards.push(discountCard)

export const singingBowl: RelicSpec = {
    name: 'Singing Bowl',
    simpleText: ['Whenever you are offered a reward, you may gain 2@ buffer instead.'],
    metaReplacers: [{
        kind: 'extraOptions',
        replace: (p: ExtraOptionsParams) => ({ ...p, options: p.options.concat(['singingBowl']) })
    }]
}
relicRewards.push(singingBowl)

export const piggyBank: RelicSpec = {
    name: 'Piggy Bank',
    simpleText: ['One time, you can take all of the rewards from a pack.'],
    metaReplacers: [{
        kind: 'extraOptions',
        replace: (p: ExtraOptionsParams) => ({ ...p, options: p.options.concat(['takeItAll']) })
    }]
}
relicRewards.push(piggyBank)

export const wingedBoots: RelicSpec = {
    name: 'Winged Boots',
    simpleText: ['Each stage has an additional path.'],
    metaReplacers: [{
        kind: 'pathRewards',
        replace: (p: PathRewardParams) => ({
            ...p,
            paths: [...p.paths, 'Use Winged Boots']
        })
    }]
}
relicRewards.push(wingedBoots)

export const matryoshkaDoll: RelicSpec = {
    name: 'Matryoshka Doll',
    simpleText: ['Your next two stages have an additional reward.'],
    metaReplacers: [{
        kind: 'pathRewards',
        replace: (p, self) => self.count('charge') > 0
            ? ({ ...p, rewardsPerPath: p.rewardsPerPath + 1 })
            : p
    }],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
        transform: (_e: GainRelicEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            const tokens = new Map(self.tokens)
            tokens.set('charge', 2)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'path',
        handles: (_e, _s, self: Relic) => self.count('charge') > 0,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            const current = state.data.relics.find(r => r.id === self.id)
            if (!current || current.count('charge') <= 0) return
            const tokens = new Map(current.tokens)
            tokens.set('charge', current.count('charge') - 1)
            state.applyToRelic(r => r.update({ tokens }), current)
        }
    }]
}
relicRewards.push(matryoshkaDoll)

export const calledShot: RelicSpec = {
    name: 'Called Shot',
    simpleText: ['At end of the next course, gain 1 buffer for each @ you beat par.'],
    metaTriggers: [{
        kind: 'end',
        handles: (_e: CourseEndEvent, _s: MetaState, _self: Relic) => true,
        transform: (e: CourseEndEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            const gain = Math.max(0, e.par - e.score)
            state.removeRelic(self.id)
            if (gain > 0) await addBuffer(gain)(state)
        }
    }]
}

export const delayedGratification: RelicSpec = {
    name: 'Delayed Gratification',
    simpleText: ['Your next path has an additional reward.'],
    metaReplacers: [{
        kind: 'pathRewards',
        replace: (p) => ({ ...p, rewardsPerPath: p.rewardsPerPath + 1 })
    }],
    metaTriggers: [{
        kind: 'path',
        handles: (_e: PathGenerationEvent, _s: MetaState, _self: Relic) => true,
        transform: (_e: PathGenerationEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            state.removeRelic(self.id)
        }
    }]
}
registerSpec(calledShot)
registerSpec(delayedGratification)

// TODO: implement
// Need to have a replacer that can put in cards into the challengespec
// But then also want it to take effect immediately.
/*
export const lookingGlass: CardSpec = {
    name: 'Looking Glass',
    simpleText: [
        '2 random cards and 1 random event',
        'in all future encounters.'
    ],
    // This relic's effect requires random selection from available cards/events,
    // which must be done in main.ts. We use a gameSetup replacer with a marker.
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({
            ...p,
            // Add markers that main.ts will interpret
            // The actual random cards/events are added by main.ts before calling this
        })
    }]
}
    */

export const giftBox: RelicSpec = {
    name: 'Gift Box',
    simpleText: [
        'When you add a card to your deck,',
        'start the next course with a copy in hand.'
    ],
    mutableTriggers: (relic: Relic) => [{
        kind: 'afterStart',
        text: 'At the start of the game, create a copy of each bottled card in your hand.',
        handles: () => true,
        transform: () => async function (state) {
            for (const spec of relic.notedCards || []) {
                state = await create(spec, 'hand')(state)
            }
            return state
        }
    }],
    metaTriggers: [{
        kind: 'end',
        handles: () => true,
        transform: (_e, _s, relic: Relic) => async function (state: MetaState) {
            state.applyToRelic((r:Relic) => r.update({notedCards: []}), relic)
        },
    }, {
        kind: 'card',
        handles: () => true,
        transform: (e: GainCardEvent, _s: MetaState, relic: Relic) => async function (state: MetaState) {
            const notedCards = relic.notedCards || []
            state.applyToRelic((r:Relic) => r.update({notedCards: [...notedCards, e.card]}), relic)
        },
    }]
}
relicRewards.push(giftBox)

export const emptyBottle: RelicSpec = {
    name: 'Empty Bottle',
    simpleText: [
        'When you gain this, choose an event you own and gain a potion that uses that event for free.',
        'Whenever you gain an event, gain a potion that uses that event for free.'
    ],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
        transform: () => async function (state: MetaState) {
            if (state.data.collectedEvents.length === 0) return
            const event = await state.ui.chooseCard(
                state,
                'Choose an event to bottle:',
                [...state.data.collectedEvents],
                true
            )
            if (!event) return
            await gainPotion(makeBottledEventPotion(event), {
                details: `Bottled ${displayName(event)}`
            })(state)
        }
    }, {
        kind: 'event',
        handles: () => true,
        transform: (e: GainEventEvent) => gainPotion(makeBottledEventPotion(e.event), {
            details: `Bottled ${displayName(e.event)}`
        })
    }]
}
registerSpec(emptyBottle)

export const banner: RelicSpec = {
    name: 'Banner',
    simpleText: [
        'For each 2@ you beat par,',
        'gain 1@ buffer.'
    ],
    metaTriggers: [{
        kind: 'end',
        handles: (e: CourseEndEvent) => e.score < e.par,
        transform: (e: CourseEndEvent) => {
            const energyUnderPar = e.par - e.score
            const bufferGain = Math.floor(energyUnderPar / 2)
            return addBuffer(bufferGain)
        }
    }]
}
relicRewards.push(banner)

// Question Card: Future rewards have 1 more option
export const questionCard: RelicSpec = {
    name: 'Question Card',
    simpleText: ['Future rewards have 2 more options.'],
    metaReplacers: [{
        kind: 'reward',
        replace: (p: RewardParams) => ({ ...p, optionCount: p.optionCount + 2 })
    }]
}
relicRewards.push(questionCard)

export const lookingGlass: RelicSpec = {
    name: 'Looking Glass',
    simpleText: ['2 random cards and 1 random event are added to each kingdom.']
}
relicRewards.push(lookingGlass)
