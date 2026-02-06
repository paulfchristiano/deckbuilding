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
    MetaTransform, addBuffer, gainRelic, RelicSpec, Relic,
    MetaState,
} from '../metaLogic.js'

// Bag of Coins: Start with an extra copper
export const bagOfCoins: RelicSpec = {
    name: 'Bag of Coins',
    simpleText: ['Start with an extra copper.'],
    triggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, create a copper in your discard.',
        handles: () => true,
        transform: () => create(copper, 'discard')
    }]
}
relicRewards.push(bagOfCoins)

export const bagOfPreparation: RelicSpec = {
    name: 'Bag of Preparation',
    simpleText: ['+3 actions each time you refresh.'],
    triggers: [{
        kind: 'afterUse',
        handles: (e, s, c) => e.card.name === refresh.name,
        text: `After using ${refresh.name}, +3 actions.`,
        transform: (e, s, c) => gainActions(3, c)
    }],
}
relicRewards.push(bagOfPreparation)

export const courier: RelicSpec = {
    name: 'Courier',
    simpleText: ['+1 buy each time you refresh.'],
    triggers: [{
        kind: 'afterUse',
        text: `After using ${refresh.name}, +1 buy.`,
        handles: (e, s, c) => e.card.name === refresh.name,
        transform: (e, s, c) => gainBuys(1, c)
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

// Elegant Quill: Gain 3@ buffer (one-time effect on acquisition)
export const elegantQuill: RelicSpec = {
    name: 'Elegant Quill',
    simpleText: [`+3@ buffer when you gain this.`],
    metaTriggers: [{
        kind: 'relic',
        handles: (e: GainRelicEvent, s: MetaState, self: Relic) => self.id == e.relic.id,
        transform: (e: GainRelicEvent) => addBuffer(3)
    }]
}
relicRewards.push(elegantQuill)

// Broken Lever: VP targets are 25% lower
export const brokenLever: RelicSpec = {
    name: 'Broken Lever',
    simpleText: [`VP targets are 25% lower.`],
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({ ...p, vpGoal: Math.floor(p.vpGoal * 0.75) })
    }]
}
relicRewards.push(brokenLever)

// Cursed Quill: Par is 6@ lower, gain 2@ buffer at start of each course
export const cursedInkwell: RelicSpec = {
    name: 'Cursed Inkwell',
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
relicRewards.push(cursedInkwell)

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
    simpleText: ['Whenever you use a potion, repeat its effect.'],
    triggers: [{
        kind: 'afterUse',
        text: 'After using a potion other than with this, use it again.',
        handles: (e, _state, _card) => e.card.spec.isPotion === true && !sourceHasName(e.source, 'Sacred Bark'),
        transform: (e, _state, card) => e.card.activate('potion', card)
    }]
}
relicRewards.push(sacredBark)

export const singingBowl: RelicSpec = {
    name: 'Singing Bowl',
    simpleText: ['Whenever you are offered a reward, you may gain 2@ buffer instead.'],
}
relicRewards.push(singingBowl)

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
    name: 'Gift box',
    simpleText: [
        'When you add a card to your deck,',
        'start the next course with a copy in hand.'
    ],
    mutableTriggers: (relic: Relic) => [{
        kind: 'gameStart',
        text: 'At the start of the game, create a copy of each bottled card in your hand.',
        handles: () => true,
        transform: () => async function (state: State) {
            for (const spec of relic.notedCards || []) {
                state = await create(spec, 'hand')(state)
            }
            return state
        }
    }],
    metaTriggers: [{
        kind: 'end',
        handles: () => true,
        transform: (e, s, relic: Relic) => async function (state: MetaState) {
            state.applyToRelic((r:Relic) => r.update({notedCards: []}), relic)
        },
    }, {
        kind: 'card',
        handles: () => true,
        transform: (e: GainCardEvent, s: MetaState, relic: Relic) => async function (state: MetaState) {
            const notedCards = relic.notedCards || []
            state.applyToRelic((r:Relic) => r.update({notedCards: [...notedCards, e.card]}), relic)
        },
    }]
}
relicRewards.push(giftBox)

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
