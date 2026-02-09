// data/potions.ts - Potion definitions
// Potions are single-use items that persist across stages until used

import {
    CardSpec, Card, State,
    gainCoins, gainBuys,
    create, trash,
    doAll, multichoice, choice,
    asChoice, asNumberedChoices, allowNull,
    Option,
    repeat, addToken, moveMany,
    actionsEffect, coinsEffect, buysEffect, buyEffect,
    createInPlayEffect, targetedEffect,
    copper,
    sortHand,
    echoRule, priorityRule, reflectRule, ferryRule, twinRule,
    // Card specs used by potions
    fair, villager,  move,
    trashOnLeavePlay,
    potionRewards,
    shelterRule,
    coin,
    addCosts,
    renderCost,
    leq,
    gainActions,
    tick
} from '../gameLogic.js'

// Import cards that potions reference from base
import {
    shelter, bridge, highway,
    workshop, tavern, throneRoom, innovation, transmogrify,
} from './cards.js'

// ========== POTIONS ==========

export const potionOfInspiration: CardSpec = {
    name: 'Potion of Inspiration',
    isPotion: true,
    effects: [{
            text: ['Triple your actions and buys.'], 
            transform: (state, card) => async function(state) {
                state = await gainActions(2 * state.actions, card)(state)
                state = await gainBuys(2 * state.buys, card)(state)
                return state
            }
    }]
}
potionRewards.push(potionOfInspiration)

export const potionOfWealth: CardSpec = {
    name: 'Potion of Wealth',
    isPotion: true,
    simpleText: ['Double your money and buys.'],
    effects: [{
        text: ['Double your $ and buys.'],
        transform: (state, card) => async function(state) {
            state = await gainCoins(state.coin, card)(state)
            state = await gainBuys(state.buys, card)(state)
            return state
        }
    }]
}
potionRewards.push(potionOfWealth)

export const potionOfCopper: CardSpec = {
    name: 'Potion of Copper',
    isPotion: true,
    simpleText: ['Create 8 coppers in your hand.'],
    effects: [{
        text: ['Create 8 Coppers in your hand.'],
        transform: () => repeat(create(copper, 'hand'), 8)
    }]
}
potionRewards.push(potionOfCopper)

/*
export const celebratoryBrew: CardSpec = {
    name: 'Celebratory Brew',
    isPotion: true,
    relatedCards: [celebration],
    rules: [echoRule],
    effects: [{
        text: [`Create a ${celebration.name} in play.`],
        transform: () => create(celebration, 'play',)
    }]
}
potionRewards.push(celebratoryBrew)
*/

const bounty: CardSpec = {
    name: 'Bounty',
    simpleText: ['The next time you buy a card, buy it again.'],
    triggers: [{
        text: `Whenever you buy a card, discard this to buy the card again.`,
        kind: 'buy',
        handles: (e, state, card) => state.find(card!).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card!, 'discard')(state)
            return e.card.buy(card)(state)
        }
    }],
    replacers: [trashOnLeavePlay()]
}

export const potionOfBounty: CardSpec = {
    name: 'Potion of Bounty',
    isPotion: true,
    simpleText: ['The next time you buy a card, buy it three more times for free.'],
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty,3)]
}
potionRewards.push(potionOfBounty)

export const potionOfTransformation: CardSpec = {
    name: 'Potion of Transformation',
    isPotion: true,
    simpleText: ['Trash any number of cards in your hand. For each one, buy a card costing up to double its cost.'],
    effects: [{
        text: ['Repeat this any number of times: trash a card in your hand that was there at the start of this process, then buy a card costing up to double its cost.'],
        transform: (state, card) => async function(state) {
            const options = asNumberedChoices(state.hand)
            while (true) {
                let picked: Card | null; [state, picked] = await choice(state,
                    'Pick a card to trash',
                    allowNull(options.filter(c => state.find(c.value).place == 'hand'))
                )
                if (picked == null) {
                    return state
                } else {
                    const trashedCost = picked.cost('buy', state)
                    const cost = addCosts(trashedCost, trashedCost)
                    state = await trash(picked)(state)
                    let toBuy: Card | null; [state, toBuy] = await choice(state,
                        `Pick a card to buy costing up to ${renderCost(cost)}`,
                        state.supply.filter(c => leq(c.cost('buy', state), cost)).map(asChoice)
                    )
                    if (toBuy != null) {
                        state = await create(toBuy.spec, 'hand')(state)
                    }
                }
            }
        }
    }]
}
potionRewards.push(potionOfTransformation)

export const sailorsBrew: CardSpec = {
    name: `Sailor's Brew`,
    isPotion: true,
    simpleText: [
        'Put two ferry tokens on a supply. It costs $2 less.',
    ],
    rules: [ferryRule],
    effects: [targetedEffect(
        target => addToken(target, 'ferry', 2),
        'Put two ferry tokens on a supply.',
        state => state.supply,
    )]
}
potionRewards.push(sailorsBrew)

export const highwayPotion: CardSpec = {
    name: 'Highway Potion',
    isPotion: true,
    effects: [{
        text: [`Create a ${highway.name} in play.`],
        transform: (state, card) => async function(state) {
            return create(highway, 'play',)(state)
        }
    }],
    relatedCards: [highway],
    rules: [echoRule],
}
potionRewards.push(highwayPotion)

export const royalNectar: CardSpec = {
    name: 'Royal Nectar',
    isPotion: true,
    effects: [targetedEffect(
        (target:Card, card:Card) => doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card),
        ]),
        'Choose a card in your hand to play three times.',
        state => state.hand
    )],
}
potionRewards.push(royalNectar)

/*
export const potionOfRecovery: CardSpec = {
    name: 'Potion of Recovery',
    isPotion: true,
    effects: [{
        text: ['Put your discard and play into your hand.'],
        transform: (state) => doAll([moveMany(state.play, 'hand'), moveMany(state.discard, 'hand'), sortHand])
    }]
}
potionRewards.push(potionOfRecovery)
*/

export const potionOfReuse: CardSpec = {
    name: 'Potion of Reuse',
    simpleText: ['Play each card in your discard.'],
    isPotion: true,
    effects: [{
        text: [`Repeat any number of times:
                choose a card in your discard
                that was also there at the start of this effect.
                Play it then put a reuse token on it.`],
            transform: (state, card) => async function(state) {
            const cards:Card[] = state.discard
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
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
potionRewards.push(potionOfReuse)

export const potionOfFairs: CardSpec = {
    name: 'Potion of Fairs',
    isPotion: true,
    simpleText: [`Create a ${fair.name} in play with 16 shelter tokens on it (the first 16 times it would leave play, instead remove a shelter token.).`],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [
        createInPlayEffect(fair, 1, new Map([['shelter', 16]])),
    ]
}
potionRewards.push(potionOfFairs)

export const potionOfInsight: CardSpec = {
    name: 'Potion of Insight',
    isPotion: true,
    simpleText: [
        '+$1, +1 action, +1 buy.',
        'Create a Fair and a Villager in play.'
    ],
    relatedCards: [fair, villager],
    effects: [
        coinsEffect(1),
        actionsEffect(1),
        buysEffect(1),
        createInPlayEffect(fair),
        createInPlayEffect(villager),
    ]
}
potionRewards.push(potionOfInsight)

/*
export const potionOfWorkshop: CardSpec = {
    name: 'Potion of Workshop',
    isPotion: true,
    simpleText: ['Create a Workshop in your hand.'],
    relatedCards: [workshop],
    effects: [{
        text: ['Create a Workshop in your hand.'],
        transform: () => create(workshop, 'hand')
    }]
}
potionRewards.push(potionOfWorkshop)
*/

export const potionOfCreation: CardSpec = {
    name: 'Potion of Creation',
    isPotion: true,
    effects: [targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing up to $4.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(4))
        )
    )]
}
potionRewards.push(potionOfCreation)

/*
export const potionOfTavern: CardSpec = {
    name: 'Potion of Tavern',
    isPotion: true,
    simpleText: ['Create a Tavern in your hand.'],
    relatedCards: [tavern],
    effects: [{
        text: ['Create a Tavern in your hand.'],
        transform: () => create(tavern, 'hand')
    }]
}
potionRewards.push(potionOfTavern)
*/

export const elixerOfInnovation: CardSpec = {
    name: 'Elixer of Innovation',
    isPotion: true,
    relatedCards: [innovation],
    effects: [{
        text: ['Create two Innovations in your hand.'],
        transform: () => repeat(create(innovation, 'hand'), 2)
    }]
}
potionRewards.push(elixerOfInnovation)

/*
export const potionOfTransmogrify: CardSpec = {
    name: 'Potion of Transmogrify',
    isPotion: true,
    simpleText: ['Create a Transmogrify in your hand.'],
    relatedCards: [transmogrify],
    effects: [{
        text: ['Create a Transmogrify in your hand.'],
        transform: () => create(transmogrify, 'hand')
    }]
}
potionRewards.push(potionOfTransmogrify)
*/

// Event effect potions
export const potionOfReflection: CardSpec = {
    name: 'Potion of Reflection',
    isPotion: true,
    simpleText: ['Put a reflect token on each card in your hand.'],
    rules: [reflectRule],
    effects: [{
        text: ['Put a reflect token on each card in your hand.'],
        transform: (state: State, card: Card) =>
            doAll(state.hand.map(c => addToken(c, 'reflect')))
    }]
}
potionRewards.push(potionOfReflection)

export const sanguineElixir: CardSpec = {
    name: 'Sanguine Elixir',
    isPotion: true,
    simpleText: ['Play any number of cards in your hand.'],
    effects: [{
        text: [`Repeat any number of times: play a card in your hand
            that was also there at the start of this effect
            and that you haven't played yet.`],
        transform: (state, card) => async function(state) {
            const cards: Card[] = state.hand;
            let options: Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked: Card | null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'hand'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
potionRewards.push(sanguineElixir)

export const potionOfPriority: CardSpec = {
    name: 'Potion of Priority',
    isPotion: true,
    simpleText: [
        'Put 8 priority tokens on a supply.',
        'The next 8 times you create a card from it, play it immediately.'
    ],
    rules: [priorityRule],
    effects: [targetedEffect(
        card => addToken(card, 'priority', 8),
        'Put 8 priority tokens on a card in the supply.',
        state => state.supply,
    )]
}
potionRewards.push(potionOfPriority)

export const geminiBrew: CardSpec = {
    name: 'Gemini Brew',
    isPotion: true,
    simpleText: [
        'Put a twin token on a card in your hand.',
        'Whenever you would play it, play it twice instead.'
    ],
    rules: [twinRule],
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)]
}
potionRewards.push(geminiBrew)

export const mirrorBrew: CardSpec = {
    name: 'Mirror Brew',
    isPotion: true,
    effects: [{
        text: ['Choose another potion you have. Create a copy of it and drink it immediately.'],
        transform: (state, card) => async function(state) {
            const otherPotions = state.potions.filter(p => p.id !== card.id)
            if (otherPotions.length === 0) {
                return state
            }
            const options: Option<Card>[] = asNumberedChoices(otherPotions)
            let picked: Card | null;
            [state, picked] = await choice(state,
                'Choose a potion to copy.',
                allowNull(options))
            if (picked !== null) {
                state = await create(picked.spec, 'potions', (potion) => potion.activate('potion', card))(state)

            }
            return state
        }
    }]
}
potionRewards.push(mirrorBrew)
