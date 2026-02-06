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
    copper, silver, gold,
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
    gainActions
} from '../gameLogic.js'

// Import cards that potions reference from base
import {
    celebration, shelter,
    workshop, tavern, throneRoom, innovation, transmogrify,
} from './cards.js'

// ========== POTIONS ==========

export const potionOfInsight: CardSpec = {
    name: 'Potion of Insight',
    isPotion: true,
    effects: [{
            text: ['Quadruple your actions and buys.'], 
            transform: (state, card) => async function(state) {
                state = await gainActions(3 * state.actions, card)(state)
                state = await gainBuys(3 * state.buys, card)(state)
                return state
            }
    }]
}
potionRewards.push(potionOfInsight)

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
    simpleText: ['Create 10 coppers in your hand.'],
    effects: [{
        text: ['Create 10 Coppers in your hand.'],
        transform: () => repeat(create(copper, 'hand'), 10)
    }]
}
potionRewards.push(potionOfCopper)

export const potionOfMining: CardSpec = {
    name: 'Potion of Mining',
    isPotion: true,
    relatedCards: [copper, silver, gold],
    effects: [{
        text: ['Trash all Coppers and Silvers in your discard. Create a Silver for each trashed Copper and a Gold for each trashed Silver.'],
        transform: () => async function(state) {
            const toTrash = state.discard.filter(c => c.name == copper.name || c.name == silver.name)
            for (const c of toTrash) {
                state = await trash(c)(state)
                if (c.name == copper.name) {
                    state = await create(silver)(state)
                } else if (c.name == silver.name) {
                    state = await create(gold)(state)
                }
            }
            return state
        }
    }]
}
potionRewards.push(potionOfMining)

export const celebratoryBrew: CardSpec = {
    name: 'Celebratory Brew',
    isPotion: true,
    simpleText: ['Create a Celebration in play.'],
    relatedCards: [celebration],
    rules: [echoRule],
    effects: [{
        text: ['Create a Celebration with an echo token in play.'],
        transform: () => create(celebration, 'play',)
    }]
}
potionRewards.push(celebratoryBrew)

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
    simpleText: ['Trash any number of cards in your hand. For each one, buy a card costing up to $2 more than it in your hand.'],
    effects: [{
        text: ['Repeat this any number of times: trash a card in your hand that was there at the start of this process, then buy a card costing up to $2 more than it.'],
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
                    const cost = addCosts(picked.cost('buy', state), coin(2))
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

export const potionOfTransportation: CardSpec = {
    name: 'Potion of Transportation',
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
potionRewards.push(potionOfTransportation)

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
    simpleText: [`Create a ${fair.name} in play with 10 shelter tokens on it (the first 10 times it would leave play, instead remove a shelter token.).`],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [
        createInPlayEffect(fair, 1, new Map([['shelter', 10]])),
    ]
}
potionRewards.push(potionOfFairs)

export const potionOfVitality: CardSpec = {
    name: 'Potion of Vitality',
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
potionRewards.push(potionOfVitality)

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

export const potionOfEchoes: CardSpec = {
    name: 'Potion of Echoes',
    isPotion: true,
    simpleText: ['For each card in your hand without an echo token, create a copy with an echo token.'],
    rules: [echoRule],
    effects: [{
        text: [`For each card in your hand without an echo token,
                create a copy in your hand with an echo token.`],
        transform: state => doAll(
            state.hand.filter(c => c.count('echo') == 0).map(
                c => create(c.spec, 'hand', x => addToken(x, 'echo'))
            )
        )
    }]
}
potionRewards.push(potionOfEchoes)

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
        'Put five priority tokens on a supply.',
        'The next 5 times you create a card from it, play it immediately.'
    ],
    rules: [priorityRule],
    effects: [targetedEffect(
        card => addToken(card, 'priority', 5),
        'Put five priority tokens on a card in the supply.',
        state => state.supply,
    )]
}
potionRewards.push(potionOfPriority)

export const geminiBrew: CardSpec = {
    name: 'Gemini Brew',
    isPotion: true,
    simpleText: [
        'Put a twin token on a card in your hand.',
        'Whenever you play it, play it again.'
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