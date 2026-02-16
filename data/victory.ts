// data/victory.ts - Victory point cards, events, and VP modes
// VP modes define victory point cards/events and target scores for stages

import {
    VPMode, vpModes,
    CardSpec, Card, State, Effect, Transform,
    coin, energy,
    pointsEffect, actionsEffect, coinsEffect, buyEffect, gainPoints,
    buyTrigger,
    noop,
    charge, startsWithCharge,
    a, payCost, free,
    cannotUse,
    chargeEffect,
    copper
} from '../gameLogic.js'

// ========== VP CARDS ==========


// VP cards - kept for victory modes but not in core supply
export const estate:CardSpec = {name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}

export const duchy:CardSpec = {name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}

export const province:CardSpec = {name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    buyCost: coin(15),
    effects: [pointsEffect(1)],
}

const flowerMarket: CardSpec = {
    name: 'Flower Market',
    buyCost: coin(2),
    effects: [buyEffect(), pointsEffect(1)],
    staticTriggers: [buyTrigger(pointsEffect(1))]
}

export const vibrantCity: CardSpec = {
    name: 'Vibrant City',
    effects: [pointsEffect(1), actionsEffect(1)],
    buyCost: coin(5),
}

function chargeUpTo(max: number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontierName = 'Frontier'
const frontier: CardSpec = {
    name: frontierName,
    fixedCost: energy(1),
    buyCost: coin(6),
    effects: [{
        text: ['+1 vp per charge token on this.'],
        simpleText: [`+1 vp`],
        transform: (state, card) => gainPoints(state.find(card).charge, card)
    }, {
        text: ['Put a charge token on this.'],
        simpleText: [`This gets +1 vp each time you play it.`],
        transform: (state, card) => charge(card, 1)
    }],
    staticReplacers: [startsWithCharge(frontierName, 1, true)]
}

export const gardens: CardSpec = {
    name: "Gardens",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
        transform: (state, card) => gainPoints(
            Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length) / 8),
            card
        )
    }]
}

const territoryName = 'Territory'
export const territory: CardSpec = {
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(1)],
    staticReplacers: [{
        kind: 'move',
        text: [`When you play a ${territoryName} from your hand, leave it there.`],
        simpleText: [`Leave this in your hand when you play it.`],
        handles: p => p.card.name == territoryName && p.toZone == 'resolving' && p.fromZone == 'hand',
        replace: p => ({ ...p, skip: true })
    }]
}

const farmlandName = 'Farmland'
export const farmland: CardSpec = {
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
        kind: 'play',
        text: [`Whenever you play a ${farmlandName} the normal way, +1 vp.`],
        simpleText: [`+1 vp if you played this the normal way (paying its cost from your hand).`],
        handles: e => e.source == 'act' && e.card.name == farmlandName,
        transform: (e, s, c) => gainPoints(1, c)
    }],
}

export const palace: CardSpec = {
    name: 'Palace',
    fixedCost: energy(1),
    buyCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(1), coinsEffect(2)]
}

export const duke: CardSpec = {
    name: 'Duke',
    buyCost: coin(4),
    effects: [],
    triggers: [{
        text: [`Whenever you play ${a(duchy.name)}, +1 vp.`],
        kind: 'play',
        handles: e => e.card.name == duchy.name,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}

// ========== VP EVENTS ==========

export const monument: CardSpec = {
    name: 'Monument',
    fixedCost: coin(50),
    effects: [pointsEffect(50)],
}

export const thoroughfare: CardSpec = {
    name: 'Thoroughfare',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'play',
        text: [`Whenever you play a card, +1 vp.`],
        handles: () => true,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}

export const foundation: CardSpec = {
    name: 'Foundation',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'buy',
        text: [`Whenever you buy a card other than ${copper.name}, +1 vp.`],
        handles: (e, state) => {
            return e.card.name != copper.name
        },
        transform: (e, state, card) => gainPoints(1, card)
    }]
}

export const capitalize: CardSpec = {
    name: 'Capitalize',
    fixedCost: coin(1),
    effects: [pointsEffect(1)],
}


// ========== VP MODES ==========

vpModes.push(
    { name: 'Province', target: 10, cards: [province], events: [] },
    { name: 'Duchy', target: 15, cards: [duchy], events: [] },
    { name: 'Estate', target: 20, cards: [estate], events: [] },
    { name: 'Colony', target: 5, cards: [colony], events: [] },
    { name: 'Thoroughfare', target: 80, cards: [], events: [thoroughfare] },
    { name: 'Foundation', target: 25, cards: [], events: [foundation] },
    { name: 'Capitalize', target: 70, cards: [], events: [capitalize] },
    { name: 'Monument', target: 50, cards: [], events: [monument] },
    { name: 'Duke', target: 40, cards: [duchy, duke], events: [] },
    { name: 'Flower Market', target: 40, cards: [flowerMarket], events: [] },
    { name: 'Farmland', target: 5, cards: [farmland], events: [] },
    { name: 'Vibrant City', target: 20, cards: [vibrantCity], events: [] },
    { name: 'Palace', target: 20, cards: [palace], events: [] },
    { name: 'Territory', target: 20, cards: [territory], events: [] },
    { name: 'Frontier', target: 25, cards: [frontier], events: [] },
    { name: 'Gardens', target: 30, cards: [gardens], events: [] },
)