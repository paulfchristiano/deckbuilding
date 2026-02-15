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
    fair, villager, bounty,
    potionRewards,
    shelterRule,
    coin,
    addCosts,
    renderCost,
    leq,
    gainActions,
    tick,
    reductionRule,
    noop
} from '../gameLogic.js'

// Import cards that potions reference from base
import {
    shelter, bridge, highway,
    workshop, tavern, throneRoom, innovation, develop,
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

export const potionOfBounty: CardSpec = {
    name: 'Potion of Bounty',
    isPotion: true,
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty,3)]
}
potionRewards.push(potionOfBounty)

export const potionOfTransformation: CardSpec = {
    name: 'Potion of Transformation',
    isPotion: true,
    effects: [{
        text: ['Repeat this any number of times: trash a card in your hand that was there at the start of this process, then choose a card in the supply costing up to double its cost and create a copy in your hand.'],
        simpleText: ['Trash any number of cards in your hand. For each one, create a card in your hand with up to double the cost.'],
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

export const ferryPotion: CardSpec = {
    name: `Ferry Potion`,
    isPotion: true,
    rules: [ferryRule],
    effects: [targetedEffect(
        target => addToken(target, 'ferry', 2),
        'Put two ferry tokens on a supply.',
        state => state.supply,
    )]
}
potionRewards.push(ferryPotion)

export const highwayPotion: CardSpec = {
    name: 'Highway Potion',
    isPotion: true,
    effects: [{
        text: [`Put a ferry token on each supply.`],
        transform: (state, card) => async function(state) {
            return doAll(state.supply.map(s => addToken(s, 'ferry', 1)))(state)
        }
    }],
    rules: [ferryRule]
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
        'Play a card in your hand three times.',
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
    isPotion: true,
    effects: [{
        simpleText: ['Play each card in your discard.'],
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
    simpleText: [],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [{
        text: [`Create a ${fair.name} in play with 15 shelter tokens on it.`],
        transform: (state, card) => create(fair, 'play', (c:Card) => noop, new Map([['shelter', 15]]))
    }]
}
potionRewards.push(potionOfFairs)

export const potionOfInsight: CardSpec = {
    name: 'Potion of Insight',
    isPotion: true,
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
    effects: [{
        text: [`Repeat any number of times: play a card in your hand
            that was also there at the start of this effect
            and that you haven't played yet.`],
        simpleText: ['Play any number of cards in your hand.'],
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
    rules: [priorityRule],
    effects: [targetedEffect(
        card => addToken(card, 'priority', 8),
        'Put 8 priority tokens on a card in the supply.',
        state => state.supply,
    )]
}
potionRewards.push(potionOfPriority)

export const artistsBrew: CardSpec = {
    name: `Artist's Brew`,
    isPotion: true,
    rules: [reductionRule],
    effects: [targetedEffect(
        card => addToken(card, 'reduction', 8),
        'Put 8 reduction tokens on a card in the supply.',
        state => state.supply,
    )]
}
potionRewards.push(artistsBrew)

export const geminiBrew: CardSpec = {
    name: 'Gemini Brew',
    isPotion: true,
    rules: [twinRule],
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)]
}
potionRewards.push(geminiBrew)

const mirrorBrewName = 'Mirror Brew'
export const mirrorBrew: CardSpec = {
    name: mirrorBrewName,
    isPotion: true,
    effects: [{
        text: [`Choose another potion you have other than ${mirrorBrewName}. Create a copy of it and use it immediately.`],
        simpleText: [`Copy the effect of another one of your potions.`],
        transform: (state, card) => async function(state) {
            const otherPotions = state.potions.filter(p => p.name !== mirrorBrewName)
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
