// data/boons.ts - Boon definitions
// Boons are stage modifiers that affect gameplay with a par reduction trade-off

import { doAll, Boon, boons,
    State, Card, CardSpec,
    free, coin, energy, costPer,
    chargeEffect, useRefresh,
    buyEffect, createInPlayEffect,
    addToken, cannotUse,
    fair, villager,
    recycleEffect,
    targetedEffect,
    priorityRule,
    actionsEffect, buysEffect, coinsEffect,
    gainActions, gainBuys, gainCoins,
    discharge, charge,
    costReduceNext,
    choice, allowNull, multichoice, Option, asNumberedChoices, asChoice,
    moveMany,
    leq,
    num,
    Token,
    removeToken,
    incrementCost,
} from '../gameLogic.js'

const escalate:CardSpec = {name: 'Escalate',
    fixedCost: free,
    simpleText: [
        `Use Refresh.`,
        `The cost of this event doubles each time you use it.`
    ],
    variableCosts: [costPer(coin(1))],
    effects: [
        {
            text: ['Double the number of cost tokens on this.'],
            transform: (s:State, c:Card) => addToken(c, 'cost', s.find(c).tokens.get('cost'))
        },
        useRefresh()
    ],
    staticTriggers: [{
        text: 'At the start of the game put a charge token on this.',
        kind: 'gameStart',
        handles: () => true,
        transform: (e, s, c) => addToken(c!, 'cost')
    }]
}
boons.push({
        name: 'Escalate',
        description: 'Add Escalate as an event',
        parReduction: 12,
        cards: [],
        events: [escalate],
    })

const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(1),
    simpleText: [
        '+1 buy.',
        'Create a Fair in play.'
    ],
    effects: [buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
}
boons.push(    {
        name: 'Traveling Fair',
        description: 'Add Traveling Fair as an event (no scaling cost)',
        parReduction: 3,
        cards: [],
        events: [travelingFair],
    })

const vault:CardSpec = {name: 'Vault',
    restrictions: [cannotUse],
    staticReplacers: [{
        text: `You can't lose actions, $, or buys (other than by paying costs).`,
        kind: 'resource',
        handles: p => p.amount < 0 && (
            p.resource == 'coin' ||
            p.resource == 'actions' ||
            p.resource == 'buys'
        ),
        replace: p => ({...p, amount:0})
    }],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, +10 actions and +2 buys.',
        handles: () => true,
        transform: (e, state, card) => doAll([gainActions(10, card), gainBuys(2, card)])
    }]
}
boons.push({
    name: 'Vault',
    description: 'Add Vault as an event, start with 10 actions and 2 buys',
    parReduction: 4,
    cards: [],
    events: [vault],
})

import { refresh } from '../gameLogic.js'
const logisticsToken:Token = 'logistics'
const logistics:CardSpec = {
    name: 'Logistics',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
        text: [`Put a ${logisticsToken} token on each supply.`],
        transform: s => doAll(s.events.map(e => addToken(e, 'logistics')))
    }],
    staticReplacers: [{
        text: `Events cost @ less for each logistics token on them, but ${refresh.name} can't cost 0. Whenever this reduces a cost, remove a logistics token.`,
        kind: 'cost',
        handles: p => (p.actionKind == 'use' && p.card.count('logistics') > 0),
        replace: (p, state) => {
            const card = state.find(p.card)
            const maxReduction = (p.card.name == refresh.name) ? p.cost.energy - 1 : p.cost.energy 
            const reduction = Math.max(Math.min(maxReduction, card.count('logistics')), 0)
            return {...p, cost:{...p.cost,
                energy:p.cost.energy-reduction,
                effects:p.cost.effects.concat([removeToken(card, 'logistics', reduction)])
            }}
        }
    }]
}
boons.push({
    name: 'Logistics',
    description: 'Add Logistics as a card',
    parReduction: 4,
    cards: [logistics],
    events: [],
})

const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:5, energy:3},
    simpleText: ['Buy every card in the supply.'],
    effects: [{
        text: [`Repeat this any number of times: buy a card in the supply costing up to $8 that you haven't bought yet.`],
        transform: (state, card) => async function(state) {
            let options:Option<Card>[] = asNumberedChoices(state.supply)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to buy next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'supply'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.buy(card)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id )
                }
            }
        }
    }]
}
boons.push(   {
    name: 'Populate',
    description: 'Add Populate as an event (buys all cards)',
    parReduction: 6,
    cards: [],
    events: [populate],
})

import { multitargetedEffect } from '../gameLogic.js'

const recover:CardSpec = {
    name: 'Recover',
    simpleText: [
        `Put up to two cards from your discard into your hand.`,
        `This costs $1 more each time you use it.`
    ],
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(
        targets => moveMany(targets, 'hand'),
        'Put up to 2 cards from your discard into your hand.',
        state => state.discard,
        2
    ), incrementCost()]
}
boons.push({
    name: 'Recover',
    description: 'Add Recover as an event',
    parReduction: 4,
    cards: [],
    events: [recover],
})

const recycle:CardSpec = {name: 'Recycle',
    fixedCost: energy(1),
    effects: [recycleEffect()],
}
boons.push(    {
        name: 'Recycle',
        description: 'Add Recycle as an event',
        parReduction: 7,
        cards: [],
        events: [recycle],
    })

const flourishName = 'Flourish'
const flourish:CardSpec = {name: flourishName,
    fixedCost: free,
    simpleText: [
        `Once you have 1/16 of the vp requirement, you can use this to Refresh for free.`,
        `You can repeat once you reach 1/8, 1/4, and 1/2 of the requirement.`
    ],
    restrictions: [{
        text: 'You cannot use this if your score times the number of charge tokens on this is less than the vp goal.',
        test: (card, state) => state.points * state.find(card).charge < state.vp_goal
    }],
    effects: [
        useRefresh(),
        {
            text: ['Remove half of the charge tokens from this (rounded down).'],
            transform: (s:State, c:Card) => {
                const currentCharge = s.find(c).charge
                const toRemove = Math.floor(currentCharge / 2)
                return discharge(c, toRemove)
            }
        }
    ],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, put 16 charge tokens on this.',
        handles: () => true,
        transform: (e, state, card) => charge(card!, 16)
    }]
}
boons.push(    {
        name: 'Flourish',
        description: 'Add Flourish as an event',
        parReduction: 9,
        cards: [],
        events: [flourish],
    })

const publicWorks:CardSpec = {name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
boons.push({
        name: 'Public Works',
        description: 'Add Public Works as a card',
        parReduction: 5,
        cards: [publicWorks],
        events: [],
})

const reuse:CardSpec = {
    name: 'Reuse',
    fixedCost: energy(1),
    simpleText: [
        `Play any number of cards in your discard that don't have a reuse token on them.`,
        `Put a reuse token on each card played this way.`
    ],
    effects: [{
        text: [`Repeat any number of times:
                choose a card in your discard without a reuse token
                that was also there at the start of this effect.
                Play it then put a reuse token on it.`],
            transform: (state, card) => async function(state) {
            const cards:Card[] = state.discard.filter(c => c.count('reuse') == 0)
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'discard'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await addToken(picked, 'reuse')(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
boons.push(    {
        name: 'Reuse',
        description: 'Add Reuse as an event',
        parReduction: 7,
        cards: [],
        events: [reuse],
})


const prioritize:CardSpec = {
    simpleText: [
        `Choose a supply.`,
        `The next 8 times you create a card from that supply, play it immediately.`
    ],
    name: 'Prioritize',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        card => addToken(card, 'priority', 8),
        'Put 8 priority tokens on a card in the supply.',
        state => state.supply,
    )],
    rules: [priorityRule],
}
boons.push(   {
        name: 'Prioritize',
        description: 'Add Prioritize as an event',
        parReduction: 5,
        cards: [],
        events: [prioritize],
})

import { startInPlay } from '../gameLogic.js'

const compostingName = 'Composting'
const composting:CardSpec = {
    name: compostingName,
    buyCost: coin(3),
    effects: [],
    triggers: [{
        kind: 'cost',
        text: `Whenever you pay @,
        you may put a card from your discard into your hand.`,
        handles: e => e.cost.energy > 0,
        transform: e => async function(state) {
            const n = e.cost.energy;
            let targets:Card[]; [state, targets] = await multichoice(state,
                `Choose up to ${num(n, 'card')} to put into your hand.`,
                state.discard.map(asChoice), n)
            return moveMany(targets, 'hand')(state)
        }
    }],
    replacers: [{
        kind: 'move',
        text: `Whenever Composting would move to your hand, instead leave it in play.`,
        handles: (p, s, c) => p.toZone == 'hand' && p.card.id == c.id,
        replace: p => ({ ...p, skip: true})
    }],
    staticReplacers: [startInPlay(compostingName)],
}
boons.push({
        name: 'Composting',
        description: 'Add Composting as a card',
        parReduction: 4,
        cards: [composting],
        events: [],
})


const insight:CardSpec = {
    name: 'Insight',
    fixedCost: energy(1),
    simpleText: [
        '+1 action, +1 buy, +$1.',
        'Create a Villager and a Fair in play.'
    ],
    relatedCards: [villager, fair],
    effects: [
        actionsEffect(1),
        buysEffect(1),
        coinsEffect(1),
        createInPlayEffect(villager),
        createInPlayEffect(fair),
    ]
}
boons.push(    {
        name: 'Insight',
        description: 'Add Insight as an event',
        parReduction: 3,
        cards: [],
        events: [insight],
    })

const windfall:CardSpec = {
    name: 'Windfall',
    fixedCost: free,
    simpleText: ['At the start of the game, +$15 and +5 buys.'],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, +$15 and +5 buys.',
        handles: () => true,
        transform: (e, state, card) => doAll([gainCoins(15, card), gainBuys(5, card)])
    }]
}
boons.push({
        name: 'Windfall',
        description: 'Gain $15 and 5 buys at the start of the game',
        parReduction: 10,
        cards: [],
        events: [windfall],
})

const duplicateStart:CardSpec = {
    name: 'Duplication',
    fixedCost: free,
    simpleText: ['At the start of the game, put a duplicate token on each card in the supply.'],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, put a duplicate token on each card in the supply.',
        handles: () => true,
        transform: (e, state, card) => async function(state) {
            for (const supply of state.supply) {
                state = await addToken(supply, 'duplicate')(state)
            }
            return state
        }
    }]
}
boons.push({
        name: 'Duplication',
        description: 'Start with a duplicate token on each supply.',
        parReduction: 5,
        cards: [],
        events: [duplicateStart],
})

const priorityStart:CardSpec = {
    name: 'Prioritization',
    fixedCost: free,
    simpleText: ['At the start of the game, put a priority token on each card in the supply.'],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game, put a priority token on each card in the supply.',
        handles: () => true,
        transform: (e, state, card) => async function(state) {
            for (const supply of state.supply) {
                state = await addToken(supply, 'priority')(state)
            }
            return state
        }
    }]
}
boons.push(   {
        name: 'Acceleration',
        description: 'Start with a priority token on each supply.',
        parReduction: 5,
        cards: [],
        events: [priorityStart],
})