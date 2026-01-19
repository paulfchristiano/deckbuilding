import {
    CardSpec, Card, State, Transform,
    TypedTrigger,
    gainActions, gainBuys,
    create,
    copper,
    ResourceEvent,
    refresh, relicRewards,
    sourceHasName
} from '../gameLogic.js'

import {
    GameSetupParams, RewardParams,
    CourseEndEvent, CourseStartEvent, GainRelicEvent, GainCardEvent,
    MetaTransform, addBuffer, RelicSpec, Relic,
    MetaState,
} from '../metaLogic.js'

// Bag of Coins: Start with an extra copper
export const bagOfCoins: RelicSpec = {
    name: 'Bag of Coins',
    simpleText: ['Start with an extra copper.'],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, create a copper in your discard.',
        handles: () => true,
        transform: () => create(copper, 'discard')
    }]
}
relicRewards.push(bagOfCoins)

export const bagOfPreparation: RelicSpec = {
    name: 'Bag of Preparation',
    simpleText: ['+2 actions each time you refresh.'],
    staticTriggers: [{
        kind: 'afterUse',
        handles: (e, s, c) => e.card.name === refresh.name,
        text: 'After using Refresh, +2 actions.',
        transform: (e, s, c) => gainActions(2, c)
    }],
}
relicRewards.push(bagOfPreparation)

export const courier: RelicSpec = {
    name: 'Courier',
    simpleText: ['+1 buy each time you refresh.'],
    staticTriggers: [{
        kind: 'resource',
        text: 'Whenever you gain actions from refreshing, gain 1 buy.',
        handles: (e: ResourceEvent, state, card) =>
            e.resource === 'actions' && e.source !== 'act' &&
            typeof e.source !== 'string' && sourceHasName(e.source, refresh.name),
        transform: (e, s, card) => gainBuys(1, card)
    }]
}
relicRewards.push(courier)

// Inkwell: Par is 1@ higher on each course
export const inkwell: RelicSpec = {
    name: 'Inkwell',
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 1@ higher on each course.'],
        replace: (p: GameSetupParams) => ({ ...p, par: p.par + 1 })
    }]
}
relicRewards.push(inkwell)

// Elegant Quill: Gain 3@ buffer (one-time effect on acquisition)
export const elegantQuill: RelicSpec = {
    name: 'Elegant Quill',
    metaTriggers: [{
        kind: 'relic',
        text: '+3@ buffer when you gain this.',
        handles: (e: GainRelicEvent, s: MetaState, self: Relic) => self.id == e.relic.id,
        transform: (e: GainRelicEvent) => addBuffer(3)
    }]
}
relicRewards.push(elegantQuill)

// Broken Lever: VP targets are 25% lower
export const brokenLever: RelicSpec = {
    name: 'Broken Lever',
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['VP targets are 25% lower.'],
        replace: (p: GameSetupParams) => ({ ...p, vpGoal: Math.floor(p.vpGoal * 0.75) })
    }]
}
relicRewards.push(brokenLever)

// Cursed Quill: Par is 6@ lower, gain 3@ buffer at start of each course
export const cursedQuill: CardSpec = {
    name: 'Cursed Quill',
    simpleText: [
        'Par is 6@ lower on each course.',
        'Gain 3@ buffer at the start of each course.'
    ],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 6 })
    }],
    metaTriggers: [{
        kind: 'courseStart',
        handles: (e: CourseStartEvent) => true,
        transform: (e: CourseStartEvent) => addBuffer(3)
    }]
}
relicRewards.push(cursedQuill)

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

export const emptyBottle: RelicSpec = {
    name: 'Empty Bottle',
    simpleText: [
        'When you add a card to your deck,',
        'start the next course with an echo copy in hand.'
    ],
    mutableTriggers: (relic: Relic) => [{
        kind: 'gameStart',
        text: 'At the start of the game, create a copy of each bottled card in your hand with an echo token.',
        handles: () => true,
        transform: () => async function (state: State) {
            for (const spec of relic.notedCards || []) {
                state = await create(spec, 'hand', undefined, new Map([['echo', 1]]))(state)
            }
            return state
        }
    }],
    metaTriggers: [{
        kind: 'end',
        handles: () => true,
        text: 'At the end of each course, forget all bottled cards.',
        transform: (e, s, relic: Relic) => async function (state: MetaState) {
            state.applyToRelic((r:Relic) => r.update({notedCards: []}), relic)
        },
    }, {
        kind: 'card',
        handles: () => true,
        text: 'When you add a card to your deck, bottle it for the next course.',
        transform: (e: GainCardEvent, s: MetaState, relic: Relic) => async function (state: MetaState) {
            const notedCards = relic.notedCards || []
            state.applyToRelic((r:Relic) => r.update({notedCards: [...notedCards, e.card]}), relic)
        },
    }]
}
relicRewards.push(emptyBottle)

// Ancient Quill: For each 3@ you beat par, gain 1@ buffer
export const ancientQuill: CardSpec = {
    name: 'Ancient Quill',
    simpleText: [
        'For each 3@ you beat par,',
        'gain 1@ buffer.'
    ],
    metaTriggers: [{
        kind: 'gameEnd',
        handles: (e: CourseEndEvent) => e.score < e.par,
        transform: (e: CourseEndEvent) => {
            const energyUnderPar = e.par - e.score
            const bufferGain = Math.floor(energyUnderPar / 3)
            return addBuffer(bufferGain)
        }
    }]
}
relicRewards.push(ancientQuill)

// Question Card: Future rewards have 1 more option
export const questionCard: CardSpec = {
    name: 'Question Card',
    simpleText: ['Future rewards have 1 more option.'],
    metaReplacers: [{
        kind: 'reward',
        replace: (p: RewardParams) => ({ ...p, optionCount: p.optionCount + 1 })
    }]
}
relicRewards.push(questionCard)
