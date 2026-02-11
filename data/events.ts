import {
    eventRewards,
    State, Card, CardSpec, Source,
    free, coin, energy,
    doAll,
    addToken, removeToken, countNameTokens, nameHasToken,
    create,
    trash,
    gainCoins,
    applyToTarget,
    createInPlayEffect,
    targetedEffect, multitargetedEffect,
    chargeEffect,
    charge, discharge,
    payToDo,
    sourceHasName,
    costPer,
    incrementCost,
    playReplacer,
    repeat,
    actionsEffect,
    buysEffect,
    recycleEffect,
    refreshEffect,
    coinsEffect, buyEffect,
    createEffect,
    choice, asNumberedChoices, Option, allowNull, multichoice, asChoice,
    villager, fair, horse,
    duplicateRule, twinRule, reflectRule,
    Token, Effect, 
    leq,
    Transform,
    addCosts,
    priorityRule,
    echoRule,
    move, moveMany,
    fountainEffect,
    artRule,
} from '../gameLogic.js'

const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:1, coin:5},
    effects: [{
        text: ['Put a reflect token on each card in your hand.'],
        transform: (state:State, card:Card) =>
            doAll(state.hand.map(c => addToken(c, 'reflect')))
    }],
    rules: [reflectRule],
}
eventRewards.push(hallOfMirrors)


const volley:CardSpec = {
    name: 'Volley',
    fixedCost: energy(1),
    simpleText: [`Play then trash any number of cards in your hand.`],
    effects: [{
        text: [`Repeat any number of times:
        play then trash a card in your hand that was also there
        at the start of this effect and that you haven't played yet.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(c => state.find(c.value).place == 'hand')))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    state = await trash(picked)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                }
            }
        }
    }]
}
eventRewards.push(volley)

const parallelize:CardSpec = {name: 'Parallelize',
    fixedCost: {...free, coin:1, energy:1},
    simpleText: [
        `Put a parallelize token on each card in your hand.`,
        `Cards cost @ less to play for each parallelize token on them.`
    ],
    effects: [{
        text: [`Put a parallelize token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'parallelize')))
    }],
    staticReplacers: [{
        text: `Cards cost @ less to play for each parallelize token on them.
            Whenever this reduces a card's cost by one or more @,
            remove that many parallelize tokens from it.`,
        kind: 'cost',
        handles: (x, state, card) => x.actionKind == 'play'&& x.card.count('parallelize') > 0,
        replace: (x, state, card) => {
            const reduction = Math.min(
                x.cost.energy,
                state.find(x.card).count('parallelize')
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([
                    removeToken(x.card, 'parallelize', reduction, true)
                ])
            }}
        }
    }]
}
eventRewards.push(parallelize)

const reach:CardSpec = {name:'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(2)]
}
eventRewards.push(reach)

const finance:CardSpec = {name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
}
eventRewards.push(finance)

export const duplicate:CardSpec = {name: 'Duplicate',
    simpleText: [`For each card in the supply, the next time you buy that card buy it again for free.`],
    fixedCost: {...free, coin:3, energy:1},
    effects: [{
        text: [`Put a duplicate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'duplicate')))
    }],
    rules: [duplicateRule],
}
eventRewards.push(duplicate)

const toil:CardSpec = {name:'Toil',
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
}
eventRewards.push(toil)


const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:3},
    simpleText: [
        `Put a twin token on a card in your hand.`,
        `Whenever you would play it, play it twice instead.`
    ],
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    rules: [twinRule],
}
eventRewards.push(twin)

const expedite: CardSpec = {
    simpleText: [`The next time you create a card, play it immediately.`],
    name: 'Expedite',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticReplacers: [playReplacer(
        `Whenever you would create a card in your discard,
            if this has a charge token then instead
            remove a charge token to set the card aside.
            Then play it if it is set aside.`,
        (p, s, c) => s.find(c).charge > 0,
        (p, s, c) => charge(c, -1)
    )]
}
eventRewards.push(expedite)

function removeAllSupplyTokens(token:Token): Effect {
    return {
        text: [`Remove all ${token} tokens from cards in the supply.`],
        transform: (state, card) => doAll(state.supply.map(s => removeToken(s, token, 'all')))
    }
}

const synergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:1, energy:1},
    simpleText: [
        `Put synergy tokens on two cards in the supply.`,
        `Whenever you buy the more expensive one (or either if they are tied), you can buy the other one for free.`
    ],
    effects: [removeAllSupplyTokens('synergy'), {
        text: ['Put synergy tokens on two cards in the supply.'],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Choose two cards to synergize.',
                state.supply.map(asChoice), 2, 2)
            for (const card of cards) state = await addToken(card, 'synergy')(state)
            return state
        }
    }],
    staticTriggers: [{
        text: 'After buying a card with a synergy token other than with this,'
        + ' buy a different card with a synergy token with equal or lesser cost.',
        kind:'afterBuy',
        handles: (e, state, card) => (!sourceHasName(e.source, card!.name) && e.card.count('synergy') > 0),
        transform: (e, state, card) => applyToTarget(
            target => target.buy(card),
            'Choose a card to buy.',
            s => s.supply.concat(s.events).filter(
                c => c.count('synergy') > 0
                && leq(c.cost('buy', s), e.card.cost('buy', s))
                && c.id != e.card.id
            )
        )
    }]
}
eventRewards.push(synergy)

const focus:CardSpec = {name: 'Focus',
    fixedCost: energy(1),
    effects: [buysEffect(2), actionsEffect(2)],
}
eventRewards.push(focus)


const onslaught:CardSpec = {name: 'Onslaught',
    fixedCost: {...free, coin:6, energy:1},
    simpleText: [`Play any number of cards in your hand.`],
    effects: [{
        text: [`Repeat any number of times: play a card in your hand
            that was also there at the start of this effect
            and that you haven't played yet.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand;
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options.filter(
                        c => state.find(c.value).place == 'hand'
                    )))
                if (picked == null) {
                    return state
                } else {
                    state = await picked.play(card)(state)
                    const id = picked.id
                    options = options.filter(c => c.value.id != id )
                }
            }
        }
    }]
}
eventRewards.push(onslaught)

/*
export const resume:CardSpec = {name: 'Resume',
    fixedCost: energy(1),
    effects: [fountainEffect()],
    restrictions: [{
        text: 'You must have at least one card in your hand.',
        test: (c, s, k) => s.hand.length == 0,
    }]
}
eventRewards.push(resume)
*/

const reflect:CardSpec = {name: 'Reflect',
    simpleText: [
        `Put a reflect token on a card in your hand.`,
        `The next time you play that card, play it twice.`,
        `This costs $1 more each time you use it.`
    ],
    fixedCost: coin(1),
    variableCosts: [costPer({coin:1})],
    effects: [incrementCost(), targetedEffect(
    	(target, card) => addToken(target, 'reflect'),
    	'Put a reflect token on a card in your hand',
    	state => state.hand
	)],
    rules: [reflectRule],
}
eventRewards.push(reflect)

const replicate:CardSpec = {name: 'Replicate',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    simpleText: [`The next time you buy a card, buy it again.`],
    staticTriggers: [{
        text: `After buying a card other than with this,
            remove a charge token from this to to buy the card again.`,
        kind: 'afterBuy',
        handles: (e, s, c) => s.find(c!).charge > 0 && !sourceHasName(e.source, c!.name),
        transform: (e, s, c) => payToDo(discharge(c!, 1), e.card.buy(c))
    }]
}
eventRewards.push(replicate)

const lostArts:CardSpec = {
    simpleText: [
        `Put 8 art tokens on a supply.`,
        `Whenever you play a card with art tokens on its supply, remove art tokens instead of paying @.`
    ],
    fixedCost: {...free, energy:1, coin:3},
    name: 'Lost Arts',
    effects: [targetedEffect(
        card => async function(state) {
            state = await addToken(card, 'art', 8)(state)
            return state
        },
        `Put eight art tokens on a card in the supply.`,
        s => s.supply
    )],
    rules: [artRule],
}
eventRewards.push(lostArts)

const polish:CardSpec = {
    name: 'Polish',
    fixedCost: {...free, coin:1, energy:1},
    effects: [{
        text: [`Put a polish token on each card in your hand.`],
        transform: state => doAll(state.hand.map(c => addToken(c, 'polish')))
    }],
    staticTriggers: [{
        text: `Whenever you play a card with a polish token on it,
        remove a polish token from it and +$1.`,
        kind: 'play',
        handles: (e, state) => (e.card.count('polish') > 0),
        transform: (e, s, c) => doAll([removeToken(e.card, 'polish'), gainCoins(1, c)])
    }]
}
eventRewards.push(polish)

const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: coin(2),
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager), createEffect(horse, 'discard', 2)],
}

eventRewards.push(commerce)

function reverbEffect(card:Card): Transform {
    return create(card.spec, 'play', c => addToken(c, 'echo'))
}

const reverberate:CardSpec = {
    name: 'Reverberate',
    fixedCost: {...free, energy:1, coin:1},
    effects: [{
        text: [`For each card in play without an echo token,
            create a copy in play with an echo token.`],
        transform: state => doAll(
            state.play.filter(c => c.count('echo') == 0).map(reverbEffect)
        )
    }],
    rules: [echoRule],
}
eventRewards.push(reverberate)

const festival:CardSpec = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 3)],
    relatedCards: [fair]
}
eventRewards.push(festival)

function buyCheaper(card:Card, s:State, source:Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        'Choose a card to buy.',
        state => state.supply.filter(target => leq(
            addCosts(target.cost('buy', state), coin(1)),
            card.cost('buy', state))
        )
    )
}

const haggle:CardSpec = {
    name: 'Haggle',
    simpleText: [`The next time you buy a card, immediately buy a cheaper card.`],
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card, remove a charge token from this to buy a card
        in the supply that costs at least $1 less.`,
        handles: (e, s, c) => s.find(c!).charge > 0,
        transform: (e, s, c) => payToDo(discharge(c!, 1), buyCheaper(e.card, s, c)),
    }]
}
eventRewards.push(haggle)

/*
const ride:CardSpec = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards:[horse],
    effects: [createEffect(horse)]
}
eventRewards.push(ride)
*/

/*
const redouble:CardSpec = {
    name:'Redouble',
    fixedCost: energy(2),
    effects: [targetedEffect(
        target => create(target.spec, 'hand'),
        'Choose a card in your discard. Create a copy in your hand.',
        state => state.discard,
    )],
}
eventRewards.push(redouble)
*/

/*
const splay:CardSpec = {
    name:'Splay',
    fixedCost: {...free, energy: 1},
    effects: [{
        text: [`Put a splay token on each supply.`],
        transform: s => doAll(s.supply.map(c => addToken(c, 'splay')))
    }],
    simpleText: [
        `Put a splay token on each supply.`,
        `Whenever you play a card with a splay token on its supply, remove splay tokens instead of paying @.`
    ],
    staticReplacers: [{
        text: `Cards you play cost @ less for each splay token on their supply.
               Whenever this reduces a card's cost by one or more @,
               remove that many splay tokens from its supply.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && nameHasToken(x.card, 'splay', state),
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(
                x.cost.energy,
                countNameTokens(x.card, 'splay', state)
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([repeat(
                    applyToTarget(
                        target => removeToken(target, 'splay'),
                        'Remove a splay token from a supply.',
                        state => state.supply.filter(
                            c => c.name == x.card.name && c.count('splay') > 0
                        )
                    )
                    , reduction
                )])
            }}
        }
    }]
}
eventRewards.push(splay)
*/

/*
const regroup:CardSpec = {
    name: 'Regroup',
    fixedCost: energy(2),
    restrictions: [{
        text: 'You must have at most 5 cards in your discard.',
        test: (c, s, k) => s.discard.length > 5,
    }],
    effects: [actionsEffect(2), buysEffect(1), recycleEffect()],
}
eventRewards.push(regroup)
*/

const summon:CardSpec = {
    name: 'Summon',
    fixedCost: {...free, energy:1, coin:4},
    effects: [multitargetedEffect(
        (targets, card) => doAll(targets.map(target =>
            create(target.spec, 'hand', c => addToken(c, 'echo'))
        )),
        `Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.`,
        s => s.supply.filter(c => leq(c.cost('buy', s), coin(6))), 3
    )],
    rules: [echoRule],
}
eventRewards.push(summon)

const reprise:CardSpec = {
    name: 'Reprise',
    fixedCost: energy(1),
    effects: [{
        text: [`Put each card in your discard into your hand with an echo token on it.`],
        transform: (state) => doAll(state.discard.map(
            c => doAll([move(c, 'hand'), addToken(c, 'echo')])
        ))
    }],
    rules: [echoRule],
}
eventRewards.push(reprise)

export const accelerate:CardSpec = {
    name: 'Accelerate',
    simpleText: [
        `Put a priority token on each card in the supply.`,
        `Whenever you create a card with a priority token on it, remove the token to play the card immediately.`
    ],
    fixedCost: {...free, energy:1, coin:1},
    effects: [{
        text: [`Put a priority token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'priority')))
    }],
    rules: [priorityRule],
}
eventRewards.push(accelerate)

const swap:CardSpec = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [targetedEffect(
        target => doAll([trash(target), applyToTarget(
            target2 => create(target2.spec, 'hand'),
            `Choose a card to copy.`,
            state => state.supply.filter(sup => leq(sup.cost('buy', state), target.cost('buy', state)))
        )]),
        `Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.`,
        state => state.hand,
    )],
}
eventRewards.push(swap)

const hallOfEchoes:CardSpec = {
    name: 'Hall of Echoes',
    fixedCost: {...free, energy:1, coin:3},
    effects: [{
        text: [`For each card in your hand without an echo token,
                create a copy in your hand with an echo token.`],
        transform: state => doAll(
            state.hand.filter(c => c.count('echo') == 0).map(
                c => create(c.spec, 'hand', x => addToken(x, 'echo'))
            )
        )
    }],
    rules: [echoRule],
}
eventRewards.push(hallOfEchoes)


const bulkOrder:CardSpec = {
    name: 'Bulk Order',
    fixedCost: {...free, coin:2, energy:1},
    simpleText: [
        `Choose a card in the supply.`,
        `The next 5 times you buy that card, buy it again for free.`
    ],
    effects: [targetedEffect(
        card => addToken(card, 'duplicate', 5),
        'Put five duplicate tokens on a card in the supply.',
        state => state.supply,
    )],
    rules: [duplicateRule],
}
eventRewards.push(bulkOrder)
