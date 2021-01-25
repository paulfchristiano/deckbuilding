import {
  CardSpec, Card, choice, asChoice, trash, Cost, addCosts,
  State, Token,
  leq, Effect, move, create,
  payToDo, free,
  charge, discharge,
  addToken, removeToken,
  gainActions,
  gainResource,
  createAndTrack, doAll, moveMany, multichoice,
  chooseNatural,
  Victory,
  register, villager, buyable, registerEvent,
  actionsEffect, buyEffect, pointsEffect, refreshEffect, coinsEffect,
  targetedEffect, chargeEffect, createEffect,
  startsWithCharge,
  applyToTarget,
  fragileEcho,
  dedupBy,
  coin, energy,
  repeat,
} from '../logic.js'


// ----------------- Absurd --------------------

const confusion:CardSpec = {
    name: 'Confusion',
    buyCost: free,
    staticTriggers: [{
        text: `After buying a card, move it to the events.`,
        kind: 'afterBuy',
        handles: () => true,
        transform: e => move(e.card, 'events')
    }, {
        text: `After using an event, move it to the supply.`,
        kind: `afterUse`,
        handles: () => true,
        transform: e => move(e.card, 'supply')
    }]
}
register(confusion, 'absurd')

const chaos:CardSpec = {
    name: 'Chaos',
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [targetedEffect(
        target => move(target, 'events'),
        `Move a card in your discard to the events.`,
        state => state.discard,
    )],
    staticTriggers: [{
        text: `Whenever you use an event, move it to your discard.`,
        kind: 'use',
        handles: () => true,
        transform: e => move(e.card, 'discard')
    }]
}
register(chaos, 'absurd')

const misplace:CardSpec = {
    name: 'Misplace',
    fixedCost: {...free, energy:1, coin:2},
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `After buying a card the normal way, remove a charge token from this to buy all other cards in the supply with the same name.`,
        kind: 'afterBuy',
        handles: (e, s, c) => c.charge > 0 && e.source.name == 'act',
        transform: (e, s, c) => payToDo(discharge(c, 1),
            doAll(s.supply.filter(target => target.name == e.card.name && target.id != e.card.id).map(target => target.buy(c)))
        )
    }, {
        text: `After buying a card, move it to your discard.`,
        kind: 'afterBuy',
        handles: () => true,
        transform: e => move(e.card, 'discard')
    }, {
        text: `After playing a card, move it to the supply.`,
        kind: 'afterPlay',
        handles: () => true,
        transform: e => move(e.card, 'supply')
    }]
}
registerEvent(misplace, 'absurd')

let echoName = 'Weird Echo'
const weirdEcho:CardSpec = {name: echoName,
    buyCost: coin(7),
    effects: [targetedEffect(
        (target, card) => async function(state) {
            let copy:Card|null; [copy, state] = await createAndTrack(target.spec, 'void')(state)
            if (copy != null) {
                state = await addToken(copy, 'echo')(state)
                state = await copy.play(card)(state)
            }
            return state
        },
        `Create a fresh copy of a card you have in play,
         then put an echo token on the copy and play it.`,
        state => dedupBy(state.play, c => c.spec)
    )],
    staticReplacers: [fragileEcho('echo')],
    staticTriggers: [{
        text: `After playing a card, put it into play unless its name contains the word "Echo".`,
        kind: 'afterPlay',
        handles: e => !e.card.name.includes("Echo"),
        transform: e => move(e.card, 'play')
    }]
}
register(weirdEcho, 'absurd')

const weirdCarpenter:CardSpec = {
    name: 'Weird Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }],
    triggers: [{
        text: `After playing a card, put it into play.`,
        kind: 'afterPlay',
        handles: e => true,
        transform: e => move(e.card, 'play')
    }]
}
buyable(weirdCarpenter, 5, 'absurd')
/*
const amalgam:CardSpec = {
    name: 'Amalgam',
    fixedCost: energy(0.5),
    buyCost: coin(3),
    effects: [coinsEffect(3)]
}
register(amalgam, 'absurd')
*/

const shinySilver:CardSpec = {
    name: 'Shiny Silver',
    buyCost: coin(2.5),
    effects: [coinsEffect(2.5)]
}
register(shinySilver, 'absurd')

const xSpec:CardSpec = {name: 'X'}
const ySpec:CardSpec = {name: 'Y'}
function xHatchery(x:CardSpec=xSpec): CardSpec {
    return {
        name: `Hatchery(${x.name})`,
        buyCost: coin(3),
        effects: [actionsEffect(1), createEffect(x)],
        relatedCards: (x.name == xSpec.name) ? [] : [x]
    }
}

const metaHatchery:CardSpec = {
    name: 'Meta Hatchery',
    buyCost: coin(3),
    relatedCards: [xHatchery()],
    effects: [actionsEffect(1), {
        text: [`Choose a card X in your hand.`,
               `Create an X Hatchery in your discard.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                `Choose card X.`,
                state.hand.map(asChoice)
            )
            if (target != null) {
                state = await create(xHatchery(target.spec))(state)
            }
            return state
        }
    }]
}
register(metaHatchery, 'absurd')

const invertedPalace:CardSpec = {
    name: 'Inverted Palace',
    buyCost: energy(1),
    fixedCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)],
}
register(invertedPalace, 'absurd')

/* Change name, and make resources round down? */
/*
const unfocus:CardSpec = {
    name: 'Unfocus',
    fixedCost: energy(0.01),
    effects: [actionsEffect(1)]
}
registerEvent(unfocus, 'absurd')
*/

function concatIfdef<T>(xs:T[]|undefined, ys:T[]|undefined): T[] {
    return (xs || []).concat(ys || [])
}

function addIfdef<T>(x:Cost|undefined, y:Cost|undefined): Cost {
    return addCosts(x || free, y || free)
}

function mergeSpecs(x:CardSpec=xSpec, y:CardSpec=ySpec): CardSpec {
    return {
        name: `${x.name} + ${y.name}`,
        buyCost: addIfdef(x.buyCost, y.buyCost),
        fixedCost: addIfdef(x.fixedCost, y.fixedCost),
        variableCosts: concatIfdef(x.variableCosts, y.variableCosts),
        effects: concatIfdef(x.effects, y.effects),
        triggers: concatIfdef(x.triggers, y.triggers),
        replacers: concatIfdef(x.replacers, y.replacers),
        staticTriggers: concatIfdef(x.staticTriggers, y.staticTriggers),
        staticReplacers: concatIfdef(x.staticReplacers, y.staticReplacers)
    }
}
const combiner:CardSpec = {
    name: 'Combiner',
    buyCost: coin(3),
    effects: [{
        text: [
            `Trash two cards X and Y from your hand.`,
            `If you do, create an X+Y in your hand that combines all of their costs, effects, and so on.`
        ],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(state,
                'Choose two cards to combine.',
                state.hand.map(asChoice),
                2, 2
            )
            if (targets.length == 2) {
                state = await trash(targets[0])(state)
                state = await trash(targets[1])(state)
                state = await create(mergeSpecs(targets[0].spec, targets[1].spec), 'hand')(state)
            }
            return state
        }
    }]
}
register(combiner, 'absurd')

const merge:CardSpec = {
    name: 'Merge',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash two cards in the supply each costing at least $1.`,
                `If you do, create an X+Y in the supply that combines all of their costs, effects, and so on.`],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(state,
                'Choose two cards to combine.',
                state.supply.filter(c => c.cost('buy', state).coin > 0).map(asChoice),
                2, 2
            )
            if (targets.length == 2) {
                state = await trash(targets[0])(state)
                state = await trash(targets[1])(state)
                state = await create(mergeSpecs(targets[0].spec, targets[1].spec), 'supply')(state)
            }
            return state
        }
    }]
}
registerEvent(merge, 'absurd')

const idealize:CardSpec = {
    name: 'Idealize',
    fixedCost: {...free, coin:2, energy:1},
    effects: [{
        text: [`Move a card in your hand to the supply and put an ideal token on it.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to idealize.', state.hand.map(asChoice))
            if (target != null) {
                state = await move(target, 'events')(state)
                state = await addToken(target, 'ideal')(state)
            }
            return state
        }
    }],
    staticReplacers: [{
        text: 'Events cost an additional @ to use for each ideal token on them.',
        kind: 'costIncrease',
        handles: e => e.actionKind == 'use' && e.card.count('ideal') > 0,
        replace: e => ({...e, cost: {...e.cost, energy: e.cost.energy + e.card.count('ideal')}})
    }]
}
registerEvent(idealize, 'absurd')

const enshrine:CardSpec = {
    name: 'Enshrine',
    fixedCost: energy(1),
    effects: [targetedEffect(
        target => move(target, 'events'),
        'Move a supply costing at least $1 to the events.',
        s => s.supply.filter(c => c.cost('buy', s).coin >= 1)
    )],
    staticReplacers: [{
        text: `The cost to use events is increased by however much $ and @ they would have cost to buy.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'use',
        replace: (p, state) => ({...p, cost: addCosts(p.cost, {...p.card.cost('buy', state), buys:0})})
    }]
}
registerEvent(enshrine, 'absurd')

const reify:CardSpec = {
    name: 'Reify',
    fixedCost: energy(1),
    effects: [{
        text: [`Choose an event. Create two copies in your hand with echo tokens on them.`],
        transform: () => applyToTarget(
            target => repeat(create(target.spec, 'hand', c => addToken(c, 'echo')), 2),
            'Choose a card to reify.',
            s => s.events
        )
    }],
    staticReplacers: [fragileEcho()],
}
registerEvent(reify, 'absurd')

const showOff:CardSpec = {
    name: 'Show Off',
    effects: [chargeEffect()],
    staticReplacers: [{
        text: `If this has a charge token, you can't win the game.`,
        kind: 'victory',
        handles: (e, s, c) => c.charge > 0,
        replace: e => ({...e, victory:false})
    }],
    staticTriggers: [{
        text: `If you have at least 10 times more victory points than needed to win the game
            and this has any charge tokens on it, then remove them and lose 10 @.`,
        kind: 'resource',
        handles: (e, s, c) => s.points >= 10 * s.vp_goal && s.find(c).charge > 0,
        transform: (e, s, c) => async function(state) {
            state = await discharge(c, state.find(c).charge)(state)
            state = await gainResource('energy', -10, c)(state)
            throw new Victory(state)
        }
    }],
}
registerEvent(showOff, 'absurd')

function cardsInState(s:State): Card[] {
    return s.events.concat(s.supply).concat(s.hand).concat(s.play).concat(s.discard)
}

const reconfigure:CardSpec = {
    name: 'Reconfigure',
    effects: [{
        text: [`Remove all tokens from any card. Then put back the same total number of tokens of the same types.`],
        transform: () => applyToTarget(
            target => async function(state) {
                target = state.find(target)
                const allTokens:Set<Token> = new Set()
                let tokenCount:number = 0
                for (const [token, count] of target.tokens) {
                    allTokens.add(token)
                    tokenCount += count
                    state = await removeToken(target, token, 'all')(state)
                }
                const numTypes = allTokens.size;
                let currentType = 0;
                for (const token of allTokens) {
                    currentType += 1;
                    let n:number|null;
                    if (currentType == numTypes) {
                        n = tokenCount
                    } else {
                        [state, n] = await choice(state,
                        `How many ${token} tokens do you want to add? (${tokenCount} remaining)`,
                        chooseNatural(tokenCount+1)
                        )
                    }
                    if (n != null && n >0) {
                        tokenCount -= n
                        state = await addToken(target, token, n)(state)
                    }
                }
                return state
            },
            'Choose a card to reconfigure.',
            state => cardsInState(state),
        )
    }]
}
buyable(reconfigure, 4, 'absurd', {onBuy: [{
    text: [`Add a reconfigure token to each card in your hand.`],
    transform: state => doAll(state.hand.map(c => addToken(c, 'reconfigure')))
}]})

const steal:CardSpec = {
    name: 'Steal',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        target => move(target, 'discard'),
        `Move a supply to your discard.`,
        state => state.supply
    )]
}
registerEvent(steal, 'absurd')

const hoard:CardSpec = {
    name: 'Hoard',
    fixedCost: {...free, energy:2, coin:8},
    effects: [{
        text: [`Move all cards to your hand.`],
        transform: s => moveMany(cardsInState(s), 'hand')
    }]
}
registerEvent(hoard, 'absurd')

const redistribute:CardSpec = {
    name: 'Redistribute',
    effects: [{
        text: [`Choose two cards.
                For each type of token that is on both of them, redistribute tokens of that type arbitrarily between them.`],
        transform: () => async function(state) {
            let targets:Card[]; [state, targets] = await multichoice(
                state, 'Choose two cards to redistribute tokens between.',
                cardsInState(state).map(asChoice), 2, 2
            )
            if (targets.length == 2) {
                for (const [token, count] of targets[0].tokens) {
                    if (targets[0].count(token) > 0 && targets[1].count(token) > 0) {
                        const total = targets[0].count(token) + targets[1].count(token)
                        for (const target of targets) {
                            state = await removeToken(target, token, 'all')(state)
                        }
                        let n:number|null; [state, n] = await choice(state,
                            `How many ${token} tokens do you want to put on ${targets[0].name}?`,
                            chooseNatural(total+1)
                        )
                        if (n != null) {
                            state = await addToken(targets[0], token, n)(state)
                            state = await addToken(targets[1], token, total - n)(state)
                        }
                    }
                }
            }
            return state
        }
    }]
}
buyable(redistribute, 4, 'absurd', {replacers: [startsWithCharge(redistribute.name, 2)]})

