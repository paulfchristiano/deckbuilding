import {
    CardSpec, Card,
    gainActions, gainBuys,
    addCosts,
    create,
    copper,
    silver,
    gold,
    ResourceEvent,
    refresh,
    sourceHasName,
    displayName,
    doAll,
    repeat,
    cardRewards,
    eventRewards,
    State,
    charge
} from '../gameLogic.js'
import { addRelicReward, registerRelicSpec } from '../registry.js'
import { Generator } from '../rng.js'

import {
    GameSetupParams, RewardParams, ExtraOptionsParams, PathRewardParams,
    CourseEndEvent, CourseStartEvent, GainRelicEvent, LoseRelicEvent, GainCardEvent, GainEventEvent, PathGenerationEvent,
    MetaTransform, addBuffer, gainPotion, gainRelic, removeRelic, RelicSpec, Relic,
    MetaState,
} from '../metaLogic.js'
import { makeBottledEventPotion } from './specialSpecs.js'

// Bag of Coins: Start with an extra copper
export const bagOfCoins: RelicSpec = {
    name: 'Bag of Coins',
    triggers: [{
        kind: 'beforeStart',
        text: ['At the start of the game, create two coppers in your discard.'],
        simpleText: ['Start with two extra coppers.'],
        handles: () => true,
        transform: () => repeat(create(copper, 'discard'), 2)
    }]
}
addRelicReward(bagOfCoins)

export const bagOfPreparation: RelicSpec = {
    name: 'Bag of Preparation',
    staticReplacers: [{
        text: [`You can't lose actions other than by playing cards.`],
        kind: 'resource',
        handles: (p: ResourceEvent) => p.amount < 0 && p.resource == 'actions',
        replace: p => ({ ...p, amount: 0 })
    }],
    triggers: [{
        kind: 'afterStart',
        handles: () => true,
        text: ['At the start of the game, +10 actions.'],
        transform: (_e, _s, c) => gainActions(10, c)
    }]
}
addRelicReward(bagOfPreparation)

export const courier: RelicSpec = {
    name: 'Courier',
    triggers: [{
        kind: 'afterUse',
        text: [`+2 buys and +1 action each time you use ${refresh.name}.`],
        handles: (e, s, c) => e.card.name === refresh.name,
        transform: (e, s, c) => doAll([gainBuys(2, c), gainActions(1, c)])
    }],
}
addRelicReward(courier)

// Inkwell: Par is 1@ higher on each course
export const inkwell: RelicSpec = {
    name: 'Inkwell',
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 1@ higher on each course.'],
        replace: (p: GameSetupParams) => ({ ...p, par: p.par + 1 })
    }]
}
addRelicReward(inkwell)

// Elegant Quill: Gain 2@ buffer (one-time effect on acquisition)
export const elegantQuill: RelicSpec = {
    name: 'Elegant Quill',
    metaTriggers: [
        {
            kind: 'relic',
            text: ['When you gain this, gain 2@ buffer.'],
            handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
            transform: (_e: GainRelicEvent) => addBuffer(2)
        },
        {
            kind: 'loseRelic',
            text: ['When you lose this, lose 2@ buffer.'],
            handles: (e: LoseRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
            transform: (_e: LoseRelicEvent) => addBuffer(-2)
        }
    ]
}
addRelicReward(elegantQuill)

// Broken Lever: VP targets are 25% lower
export const brokenLever: RelicSpec = {
    name: 'Broken Lever',
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['VP targets are 25% lower (rounded up).'],
        simpleText: [`VP targets are 25% lower.`],
        replace: (p: GameSetupParams) => ({ ...p, vpGoal: Math.ceil(p.vpGoal * 0.75) })
    }]
}
addRelicReward(brokenLever)

export const darkBanner: RelicSpec = {
    name: 'Dark Banner',
    maxStage: 6,
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['Par is 4@ lower on each course.'],
        replace: (p: GameSetupParams) => ({ ...p, par: p.par - 4 })
    }],
    metaTriggers: [{
        kind: 'start',
        text: ['At the start of each course, gain 3@ buffer.'],
        handles: (e: CourseStartEvent) => true,
        transform: (e: CourseStartEvent) => addBuffer(3)
    }]
}
addRelicReward(darkBanner)

const mirrorName = `Silver Mirror`
export const silverMirror: RelicSpec = {
    name: mirrorName,
    maxStage: 6,
    metaTriggers: [{
        kind: 'relic',
        simpleText: ['The next time you gain a relic, gain two additional copies of it.'],
        text: [`Whenever you gain a relic other than ${mirrorName}, gain two additional copies of that relic and destroy this.`],
        handles: (e: GainRelicEvent, _s: MetaState, relic: Relic) =>
            e.relic.id !== relic.id
            && e.relic.name !== mirrorName
            && e.relic.spec.burden !== true,
        transform: (e: GainRelicEvent, _s: MetaState, relic: Relic) => async function (state: MetaState) {
            await removeRelic(state, relic.id)
            await gainRelic(e.relic.spec)(state)
            await gainRelic(e.relic.spec)(state)
        },
    }]
}
addRelicReward(silverMirror)

export const sacredBark: RelicSpec = {
    name: 'Sacred Bark',
    gainRequirement: (state: MetaState) => state.data.buffer >= 3,
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, lose 3 buffer.'],
        handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
        transform: () => addBuffer(-3)
    }],
    triggers: [{
        kind: 'afterUse',
        text: ['After using a potion other than with this, use it again.'],
        simpleText: [`Whenever you use a potion, repeat its effect.`],
        handles: (e, _state, _card) => e.card.spec.isPotion === true && !sourceHasName(e.source, 'Sacred Bark'),
        transform: (e, _state, card) => e.card.activate('potion', card)
    }]
}
addRelicReward(sacredBark)

export const discountCard: RelicSpec = {
    name: 'Discount card',
    staticReplacers: [{
        text: ['Silver and Gold cost $2 less to buy, but not less than $1.'],
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
addRelicReward(discountCard)

export const singingBowl: RelicSpec = {
    name: 'Singing Bowl',
    metaReplacers: [{
        kind: 'extraOptions',
        text: ['Whenever you are offered a reward, you may gain 2@ buffer instead.'],
        replace: (p: ExtraOptionsParams) => ({ ...p, options: p.options.concat(['singingBowl']) })
    }]
}
addRelicReward(singingBowl)

export const piggyBank: RelicSpec = {
    name: 'Piggy Bank',
    metaReplacers: [{
        kind: 'extraOptions',
        simpleText: ['One time, you can take all of the rewards from a pack.'],
        text: [`All reward packs contain a new option 'take it all.'`,
                `When you select that option, take all the rewards from the pack and trash this.`],
        replace: (p: ExtraOptionsParams) => ({ ...p, options: p.options.concat(['takeItAll']) })
    }]
}
addRelicReward(piggyBank)

export const wingedBoots: RelicSpec = {
    name: 'Winged Boots',
    metaReplacers: [{
        kind: 'pathRewards',
        text: ['Each stage has two additional paths.'],
        replace: (p: PathRewardParams) => ({
            ...p,
            paths: [...p.paths, 'Use Winged Boots', 'Use Winged Boots']
        })
    }]
}
addRelicReward(wingedBoots)

export const compass: RelicSpec = {
    name: 'Compass',
    metaReplacers: [{
        kind: 'pathRewards',
        text: ['Each stage has an additional challenge option.'],
        replace: (p: PathRewardParams) => ({
            ...p,
            numChallengeOptions: p.numChallengeOptions + 1
        })
    }]
}
addRelicReward(compass)

export const flywheel: RelicSpec = {
    name: 'Flywheel',
    metaTriggers: [{
        kind: 'end',
        text: ['At end of each course, remove all charge counters from this.'],
        simpleText: [],
        handles: () => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            state.applyToRelic(r => r.update({ tokens: new Map() }), self)
        }
    }],
    triggers: [{
        kind: 'play',
        text: ['After you play a card, put a charge token on this, then if it has 5 or more tokens, remove 5 and +1 action.'
        ],
        simpleText: [`Every 5 cards you play, +1 action.`],
        handles: () => true,
        transform: (_e, _s, source: Card|null) => async function (state: State) {
            const relic = source!
            state = await charge(relic, 1)(state)
            while (true) {
                const current = state.find(relic)
                if (!current || current.charge < 5) return state
                state = await charge(relic, -5)(state)
                state = await gainActions(1, relic)(state)
            }
        }
    }]
}
addRelicReward(flywheel)

export const creditVoucher: RelicSpec = {
    name: 'Credit Voucher',
    triggers: [{
        kind: 'buy',
        text: ['Whenever you buy a card costing $5 or more, +1 buy.'],
        handles: (e, _s, _c) => e.card.cost('buy', _s).coin >= 5,
        transform: (e, s, source) => gainBuys(1, source)
    }]
}
addRelicReward(creditVoucher)

export const matryoshkaDoll: RelicSpec = {
    name: 'Matryoshka Doll',
    maxStage: 5,
    metaReplacers: [{
        kind: 'pathRewards',
        text: ['Each stage has an additional reward.'],
        simpleText: [`Your next two stages have an additional reward on each path.`],
        replace: (p, self) => ({ ...p, rewardsPerPath: p.rewardsPerPath + 1 })
    }],
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, put 2 charge tokens on it.'],
        simpleText: [],
        handles: (e: GainRelicEvent, _s: MetaState, self: Relic) => self.id === e.relic.id,
        transform: (_e: GainRelicEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            const tokens = new Map(self.tokens)
            tokens.set('charge', 2)
            state.applyToRelic(r => r.update({ tokens }), self)
        }
    }, {
        kind: 'path',
        text: ['After generating a path, remove a charge token from this. Then if it has no charge tokens destroy it.'],
        simpleText: [],
        handles: (_e, _s, self: Relic) => true,
        transform: (_e, _s, self: Relic) => async function (state: MetaState) {
            let current = state.data.relics.find(r => r.id === self.id)
            if (!current) return
            const tokens = new Map(current.tokens)
            if (current.charge > 0) {
                tokens.set('charge', current.count('charge') - 1)
                state.applyToRelic(r => r.update({ tokens }), current)
            }
            if (tokens.get('charge') === 0) {
                await removeRelic(state, current.id)
            }
        }
    }]
}
addRelicReward(matryoshkaDoll)

export const calledShot: RelicSpec = {
    name: 'Called Shot',
    maxStage: 6,
    metaTriggers: [{
        kind: 'end',
        text: ['At end of the next course, gain 1 buffer for each @ you beat par, then destroy this.'],
        simpleText: ['At end of the next course, gain 1 buffer for each @ you beat par.'],
        handles: (_e: CourseEndEvent, _s: MetaState, _self: Relic) => true,
        transform: (e: CourseEndEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            const gain = Math.max(0, e.par - e.score)
            await removeRelic(state, self.id)
            if (gain > 0) await addBuffer(gain)(state)
        }
    }]
}

export const delayedGratification: RelicSpec = {
    name: 'Delayed Gratification',
    metaReplacers: [{
        kind: 'pathRewards',
        text: ['Each path has an additional reward.'],
        simpleText: [`Your next stage has an additional reward on each path.`],
        replace: (p) => ({ ...p, rewardsPerPath: p.rewardsPerPath + 1 })
    }],
    metaTriggers: [{
        kind: 'path',
        text: ['When a path is generated, destroy this.'],
        simpleText: [],
        handles: (_e: PathGenerationEvent, _s: MetaState, _self: Relic) => true,
        transform: (_e: PathGenerationEvent, _s: MetaState, self: Relic) => async function (state: MetaState) {
            await removeRelic(state, self.id)
        }
    }]
}
registerRelicSpec(calledShot)
registerRelicSpec(delayedGratification)

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
    mutableTriggers: (relic: Relic) => [{
        kind: 'afterStart',
        text: ['At the start of the game, create a copy of each boxed card in your hand.'],
        simpleText: [],
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
        text: ['At end of each course, remove all boxed cards.'],
        simpleText: [],
        handles: () => true,
        transform: (_e, _s, relic: Relic) => async function (state: MetaState) {
            state.applyToRelic((r:Relic) => r.update({notedCards: []}), relic)
        },
    }, {
        kind: 'card',
        text: ['Whenever you add a card to your deck, box it in this.'],
        simpleText: ['When you add a card to your deck, start the next course with a copy in hand.'],
        handles: () => true,
        transform: (e: GainCardEvent, _s: MetaState, relic: Relic) => async function (state: MetaState) {
            const notedCards = relic.notedCards || []
            state.applyToRelic((r:Relic) => r.update({notedCards: [...notedCards, e.card]}), relic)
        },
    }]
}
addRelicReward(giftBox)

export const emptyBottle: RelicSpec = {
    name: 'Empty Bottle',
    metaTriggers: [{
        kind: 'relic',
        text: ['When you gain this, choose an event and gain a potion that uses it for free.'],
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
        text: ['Whenever you gain an event, gain a potion that uses it for free.'],
        handles: () => true,
        transform: (e: GainEventEvent) => gainPotion(makeBottledEventPotion(e.event), {
            details: `Bottled ${displayName(e.event)}`
        })
    }]
}
registerRelicSpec(emptyBottle)

export const banner: RelicSpec = {
    name: 'Banner',
    maxStage: 6,
    metaTriggers: [{
        kind: 'end',
        text: ['At end of course, gain 1@ buffer for each 2@ you beat par.'],
        simpleText: [`For each 2@ you beat par, gain 1@ buffer.`],
        handles: (e: CourseEndEvent) => e.score < e.par,
        transform: (e: CourseEndEvent) => {
            const energyUnderPar = e.par - e.score
            const bufferGain = Math.floor(energyUnderPar / 2)
            return addBuffer(bufferGain)
        }
    }]
}
addRelicReward(banner)

// Question Card: Future rewards have 1 more option
export const questionCard: RelicSpec = {
    name: 'Question Card',
    maxStage: 6,
    metaReplacers: [{
        kind: 'reward',
        text: ['All reward packs are generated with 2 more options.'],
        simpleText: ['All reward packs have 2 more options.'],
        replace: (p: RewardParams) => ({ ...p, optionCount: p.optionCount + 2 })
    }]
}
addRelicReward(questionCard)

// If called multiple times we generate the same permutations, but index further into them.
function lookingGlassNewKingdom(
    state: MetaState,
    cards: CardSpec[],
    events: CardSpec[],
): { cards: CardSpec[], events: CardSpec[] } {
    const result = {cards: cards.slice(), events: events.slice()}

    const neededCards = 2
    const neededEvents = 1
    const skipCardNames = new Set(cards.map(card => card.name))
    const skipEventNames = new Set(events.map(event => event.name))

    const generator = new Generator(`${state.seed}-LOOKINGGLASS-${state.data.stage}`)

    const allCards = generator.permute([...cardRewards])
    const addedCards = []
    for (const card of allCards) {
        if (addedCards.length >= neededCards) break
        if (skipCardNames.has(card.name)) continue
        addedCards.push(card)
    }
    const allEvents = generator.permute([...eventRewards])
    const addedEvents = []
    for (const event of allEvents) {
        if (addedEvents.length >= neededEvents) break
        if (skipEventNames.has(event.name)) continue
        addedEvents.push(event)
    }

    return { cards: cards.concat(addedCards), events: events.concat(addedEvents) }
}


export const lookingGlass: RelicSpec = {
    name: 'Looking Glass',
    metaReplacers: [{
        kind: 'gameSetup',
        text: ['At the start of each stage add 2 random cards and 1 random event to the supply.'],
        replace: function (p: GameSetupParams, state: MetaState, self: Relic): GameSetupParams {
            const newKingdom = lookingGlassNewKingdom(
                state,
                p.cardSpecs,
                p.eventSpecs,
            )
            return {
                ...p,
                cardSpecs: newKingdom.cards,
                eventSpecs: newKingdom.events
            }
        }
    }]
}
addRelicReward(lookingGlass)
