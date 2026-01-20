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
    potionRewards
} from '../gameLogic.js'

// Import cards that potions reference from base
import {
    celebration, shelter,
    workshop, tavern, throneRoom, innovation, transmogrify,
} from './cards.js'

// ========== POTIONS ==========

export const potionOfActions: CardSpec = {
    name: 'Potion of Actions',
    isPotion: true,
    simpleText: ['+10 actions.'],
    effects: [actionsEffect(10)]
}
potionRewards.push(potionOfActions)

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
    simpleText: ['Create 5 coppers in your hand.'],
    effects: [{
        text: ['Create 5 Coppers in your hand.'],
        transform: () => repeat(create(copper, 'hand'), 5)
    }]
}
potionRewards.push(potionOfCopper)

export const potionOfMining: CardSpec = {
    name: 'Potion of Mining',
    isPotion: true,
    simpleText: ['Trash coppers for silvers, silvers for golds.'],
    relatedCards: [copper, silver, gold],
    effects: [{
        text: ['Trash any number of Coppers in your hand, and create that many Silvers in your discard.',
               'Trash any number of Silvers in your hand, and create that many Golds in your discard.'],
        transform: () => async function(state) {
            // Trash coppers for silvers
            const coppers = state.hand.filter(c => c.name == 'Copper')
            let coppersToTrash: Card[]; [state, coppersToTrash] = await multichoice(state,
                'Choose Coppers to trash for Silvers.',
                coppers.map(asChoice), coppers.length)
            for (const c of coppersToTrash) {
                state = await trash(c)(state)
            }
            state = await repeat(create(silver), coppersToTrash.length)(state)
            // Trash silvers for golds
            const silvers = state.hand.filter(c => c.name == 'Silver')
            let silversToTrash: Card[]; [state, silversToTrash] = await multichoice(state,
                'Choose Silvers to trash for Golds.',
                silvers.map(asChoice), silvers.length)
            for (const c of silversToTrash) {
                state = await trash(c)(state)
            }
            state = await repeat(create(gold), silversToTrash.length)(state)
            return state
        }
    }]
}
potionRewards.push(potionOfMining)

export const potionOfCelebration: CardSpec = {
    name: 'Potion of Celebration',
    isPotion: true,
    simpleText: ['Create a Celebration with an echo token in play.'],
    relatedCards: [celebration],
    rules: [echoRule],
    effects: [{
        text: ['Create a Celebration with an echo token in play.'],
        transform: () => create(celebration, 'play', c => addToken(c, 'echo'))
    }]
}
potionRewards.push(potionOfCelebration)

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
    simpleText: ['The next time you buy a card, buy it two more times for free.'],
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty, 2)]
}
potionRewards.push(potionOfBounty)

export const potionOfFerry: CardSpec = {
    name: 'Potion of Ferry',
    isPotion: true,
    simpleText: [
        'Put a ferry token on a supply. It costs $2 less.',
        '+1 buy.'
    ],
    rules: [ferryRule],
    effects: [targetedEffect(
        target => addToken(target, 'ferry', 1),
        'Put a ferry token on a supply.',
        state => state.supply,
    ), buyEffect()]
}
potionRewards.push(potionOfFerry)

export const potionOfRecovery: CardSpec = {
    name: 'Potion of Recovery',
    isPotion: true,
    simpleText: ['Put your discard into your hand.'],
    effects: [{
        text: ['Put your discard into your hand.'],
        transform: (state) => doAll([moveMany(state.discard, 'hand'), sortHand])
    }]
}
potionRewards.push(potionOfRecovery)

export const potionOfShelter: CardSpec = {
    name: 'Potion of Shelter',
    isPotion: true,
    simpleText: ['Create 3 Fairs and a Shelter in play.'],
    relatedCards: [fair, shelter],
    effects: [
        createInPlayEffect(shelter),
        createInPlayEffect(fair, 3),
    ]
}
potionRewards.push(potionOfShelter)

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

// Gain card potions
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

export const potionOfInnovation: CardSpec = {
    name: 'Potion of Innovation',
    isPotion: true,
    simpleText: ['Create an Innovation in your hand.'],
    relatedCards: [innovation],
    effects: [{
        text: ['Create an Innovation in your hand.'],
        transform: () => create(innovation, 'hand')
    }]
}
potionRewards.push(potionOfInnovation)

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

// Event effect potions
export const potionOfMirrors: CardSpec = {
    name: 'Potion of Mirrors',
    isPotion: true,
    simpleText: ['Put a reflect token on each card in your hand.'],
    rules: [reflectRule],
    effects: [{
        text: ['Put a reflect token on each card in your hand.'],
        transform: (state: State, card: Card) =>
            doAll(state.hand.map(c => addToken(c, 'reflect')))
    }]
}
potionRewards.push(potionOfMirrors)

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

export const potionOfOnslaught: CardSpec = {
    name: 'Potion of Onslaught',
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
potionRewards.push(potionOfOnslaught)

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

export const potionOfTwin: CardSpec = {
    name: 'Potion of Twin',
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
potionRewards.push(potionOfTwin)

export const mirrorBrew: CardSpec = {
    name: 'Mirror Brew',
    isPotion: true,
    simpleText: ['Copy another potion you have.'],
    effects: [{
        text: ['Choose another potion you have. Create a copy of it.'],
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
                state = await create(picked.spec, 'potions')(state)
            }
            return state
        }
    }]
}
potionRewards.push(mirrorBrew)