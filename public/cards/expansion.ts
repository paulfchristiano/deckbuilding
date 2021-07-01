import { CardSpec, Card, choice, asChoice, trash, Cost, addCosts, leq, Effect,
  gainPoints, gainActions, gainCoins, gainBuys, free, create,
  doAll, multichoice,
  ActionKind,
  moveMany, addToken, removeToken, payToDo,
  tick, eq, move, noop,
  CostParams, Transform, Source,
  charge, discharge,
  State, payCost, subtractCost, aOrNum,
  allowNull,
  villager, fair, refresh,
  supplyForCard,
  actionsEffect, buyEffect, buysEffect, pointsEffect, coinsEffect,
  refreshEffect, recycleEffect,
  reflectTrigger,
  createInPlayEffect,
  targetedEffect, workshopEffect, chargeEffect,
  startsWithCharge,
  energy, coin,
  useRefresh, costReduce, reducedCost,
  applyToTarget,
  countNameTokens, nameHasToken,
  incrementCost, costPer,
  createEffect, repeat,
  copper, silver, gold, estate, duchy, province,
  trashOnLeavePlay, discardFromPlay, trashThis,
  payAction,
  fragileEcho,
  num, playReplacer, countDistinctNames
} from '../logic.js'


// ------------------- Expansion ---------------

export const cards:CardSpec[] = [];
export const events:CardSpec[] = [];

const flourish:CardSpec = {
    name: 'Flourish',
    fixedCost: energy(1),
    effects: [{
        text: [`Double the number of cost tokens on this.`],
        transform: (s, c) => async function(state) {
            return addToken(c, 'cost', state.find(c).count('cost'))(state)
        }
    }, useRefresh()],
    restrictions: [{
        text: 'You must have at least 1 vp per cost token on this.',
        test: (c, s, k) => s.points < s.find(c).count('cost')
    }],
    staticTriggers: [{
        kind: 'gameStart',
        text: 'At the start of the game put a cost token on this.',
        handles: () => true,
        transform: (e, s, c) => addToken(c, 'cost')
    }]
}
events.push(flourish)

const greed:CardSpec = {
    name: 'Greed',
    fixedCost: {...free, energy:1},
    effects: [{
        text: [`Pay all vp. For each vp lost, +$1, +1 action, and +1 buy.`],
        transform: () => async function(state) {
            const n = state.points
            state = await gainPoints(-n)(state)
            state = await gainCoins(n)(state)
            state = await gainActions(n)(state)
            state = await gainBuys(n)(state)
            return state
        }
    }]
}
events.push(greed)

/*
const strive:CardSpec = {
    name: 'Strive',
    fixedCost: {...free, energy:2, coin:3},
    effects: [workshopEffect(7)]
}
events.push(strive)
*/

/*
const delve:CardSpec = {
    name: 'Delve',
    fixedCost: coin(2),
    effects: [createEffect(silver)]
}
events.push(delve)
*/

const hesitation:CardSpec = {
    name: 'Hesitation',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
    staticReplacers: [{
        text: `Cards cost an extra @ to play or use.`,
        kind: 'cost',
        handles: (p, s, c) => (p.actionKind == 'play' || p.actionKind == 'use')
            && p.card.id != c.id,
        replace: p => ({...p, cost: {...p.cost, energy:p.cost.energy + 1}})
    }]
}
//events.push(hesitation)

/*
const pillage:CardSpec = {
    name: 'Pillage',
    effects: [targetedEffect(
        (target, card) => addToken(target, 'pillage'),
        'Put a pillage token on a card in the supply.',
        s => s.supply
    )],
    staticTriggers: [{
        text: `Whenever you create a card whose supply has a pillage token on it,
        trash the supply to play the card.`,
        kind: 'create',
        handles: (e, s) => s.supply.some(
            sup => sup.count('pillage') > 0 &&
            sup.name == e.card.name
        ),
        transform: (e, s, c) => payToDo(
            applyToTarget(
                target => trash(target),
                'Choose a supply to trash.',
                state => state.supply.filter(sup => sup.name == e.card.name),
                {cost: true}
            ), e.card.play(c)
        )
    }]
}
events.push(pillage)
*/

const festival:CardSpec = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 2)],
    relatedCards: [fair]
}
events.push(festival)

/*
const Import:CardSpec = {
    name: 'Import',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => addToken(target, 'import', 3),
        'Put three import tokens on a card in the supply.',
        s => s.supply
    )],
    staticReplacers: [{
        text: `Whenever you would create a card in your discard,
            if its supply has an import token on it,
            instead remove a token and create the card in your hand.`,
        kind: 'create',
        handles: (p, s, c) => p.zone == 'discard' && s.supply.some(
            sup => sup.count('import') > 0 &&
            sup.name == p.spec.name
        ),
        replace: p => ({...p, zone:'hand', effects:p.effects.concat([
            () => applyToTarget(
                target => removeToken(target, 'import'),
                `remove an import token.`,
                state => state.supply.filter(sup => sup.name == p.spec.name && sup.count('import') > 0)
            )
        ])})
    }]
}
events.push(Import)
*/

const squeeze:CardSpec = {
    name: 'Squeeze',
    fixedCost: energy(1),
    effects: [actionsEffect(1)],
    staticReplacers: [{
        text: `You can't gain actions from ${refresh.name}.`,
        kind: 'resource',
        handles: (p, s, c) => p.resource == 'actions' && p.source.name == refresh.name,
        replace: p => ({...p, amount:0}),
    }]
}
events.push(squeeze)

const inspiration:CardSpec = {
    name: 'Inspiration',
    variableCosts: [costPer(energy(1))],
    effects: [{
        text: ['Double your actions and buys.'],
        transform: (s, c) => async function(state) {
            state = await gainActions(state.actions)(state)
            state = await gainBuys(state.buys)(state)
            return state
        }
    }, incrementCost()]

}
events.push(inspiration)

/*
const chain:CardSpec = {
    name: 'Chain',
    fixedCost: {...free, energy:1, coin:1},
    effects: [targetedEffect(
        target => addToken(target, 'chain'),
        `Put a chain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterPlay',
        text: `After playing a card whose supply has a chain token,
               you may play a card that costs at least $1 less whose supply also has a chain token.`,
        handles: (e, s) => nameHasToken(e.card, 'chain', s),
        transform: (e, s, c) => applyToTarget(
            target => target.play(c),
            'Choose a card to play.',
            state => state.hand.filter(
                handCard => state.supply.some(
                    supplyCard => (supplyCard.name == handCard.name) && supplyCard.count('chain') > 0
                ) && leq(addCosts(handCard.cost('buy', state), coin(1)), e.card.cost('buy', state))
            ), {optional: "Don't play"}
        )
    }]
}
events.push(chain)
*/

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

const bulkOrder:CardSpec = {
    name: 'Bulk Order',
    fixedCost: {...free, energy:1, coin:2},
    effects: [targetedEffect(
        card => addToken(card, 'bulk', 6),
        'Put six bulk tokens on a card in the supply.',
        state => state.supply,
    )],

    staticTriggers: [{
        text: `After buying a card with a bulk token on it other than with this,
        remove a bulk token from it to buy it again.`,
        kind:'afterBuy',
        handles: (e, state, card) => {
            if (e.source.name == card.name) return false
            const target:Card = state.find(e.card);
            return target.count('bulk') > 0
        },
        transform: (e, state, card) =>
            payToDo(removeToken(e.card, 'bulk'), e.card.buy(card))
    }]
}
events.push(bulkOrder)


/*
const bargain:CardSpec = {
    name: 'Bargain',
    fixedCost: {...free, energy:1, coin:4},
    effects: [targetedEffect(
        target => addToken(target, 'bargain'),
        `Put a bargain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card with a bargain token,
               buy a card in the supply that costs at least $1 less.`,
        handles: (e, s) => e.card.count('bargain') > 0,
        transform: (e, s, c) => buyCheaper(e.card, s, c)
    }]
}
events.push(bargain)
*/

const haggle:CardSpec = {
    name: 'Haggle',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card, remove a charge token from this to buy a card
        in the supply that costs at least $1 less.`,
        handles: (e, s, c) => c.charge > 0,
        transform: (e, s, c) => payToDo(discharge(c, 1), buyCheaper(e.card, s, c)),
    }]
}
events.push(haggle)

const horse:CardSpec = {
    name: 'Horse',
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
}

const ride:CardSpec = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards:[horse],
    effects: [createEffect(horse)]
}
events.push(ride)

const redouble:CardSpec = {
    name:'Redouble',
    fixedCost: energy(2),
    effects: [targetedEffect(
        target => create(target.spec, 'hand'),
        'Choose a card in your discard. Create a copy in your hand.',
        state => state.discard,
    )],
}
events.push(redouble)

const splay:CardSpec = {
    name:'Splay',
    fixedCost: {...free, energy: 1, coin: 1},
    effects: [{
        text: [`Put a splay token on each supply.`],
        transform: s => doAll(s.supply.map(c => addToken(c, 'splay')))
    }],
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
                        'Remove a fan token from a supply.',
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
events.push(splay)

const recover:CardSpec = {
    name: 'Recover',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(
        targets => moveMany(targets, 'hand'),
        'Put up to 2 cards from your discard into your hand.',
        state => state.discard,
        2
    ), incrementCost()]
}
events.push(recover)

function multitargetedEffect(
    f: (targets:Card[], c:Card) => Transform,
    text: string,
    options: (s:State, c:Card) => Card[],
    max: number|null = null
): Effect {
    return {
        text: [text],
        transform: (s, c) => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(
                state, text, options(state, c).map(asChoice), max
            )
            state = await f(cards, c)(state)
            return state
        }
    }
}

const regroup:CardSpec = {
    name: 'Regroup',
    fixedCost: energy(2),
    effects: [actionsEffect(2), buysEffect(1), multitargetedEffect(
        targets => moveMany(targets, 'hand'),
        'Put up to four cards from your discard into your hand.',
        state => state.discard, 4
    )]
}
events.push(regroup)

/*
const multitask:CardSpec = {
    name: 'Multitask',
    fixedCost: {...free, energy:3, coin:6},
    effects: [multitargetedEffect(
        (cards, c) => doAll(cards.map(card => card.use(c))),
        'Use any number of other events.',
        (state, c) => state.events.filter(card => card.id != c.id)
    )]
}
events.push(multitask)
*/
const summon:CardSpec = {
    name: 'Summon',
    fixedCost: {...free, energy:1, coin:5},
    effects: [multitargetedEffect(
        (targets, card) => doAll(targets.map(target =>
            create(target.spec, 'hand', c => addToken(c, 'echo'))
        )),
        `Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.`,
        s => s.supply.filter(c => leq(c.cost('buy', s), coin(6))), 3
    )],
    staticReplacers: [fragileEcho('echo')]
}
events.push(summon)

/*
const misfitName:string = 'Misfit'
const misfit:CardSpec = {
    name: misfitName,
    buyCost: coin(1),
    effects: [actionsEffect(1), {
        text: [`Choose a card in the supply costing up to $1
        for each charge token on this.
        Create a copy of that card in your hand with an echo token on it.`],
        transform: (s, c) => applyToTarget(
            target => create(target.spec, 'hand', n => addToken(n, 'echo')),
            'Choose a card to copy.',
            state => state.supply.filter(target =>
                leq(target.cost('buy', state), coin(c.charge))
            )
        )
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${misfitName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == misfitName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
cards.push($1)
*/

/*
const bandOfMisfitsName = 'Band of Misfits'
const bandOfMisfits:CardSpec = {
    name: bandOfMisfitsName,
    buyCost: coin(2),
    effects: [actionsEffect(1), {
        text: [`Choose up to two cards in the supply each costing up to $1
        per charge token on this.
        Create a copy of each card in your hand with an echo token on it.`],
        transform: (s, c) => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Choose up to two cards to copy.',
                state.supply.filter(
                    target => leq(target.cost('buy', state), coin(c.charge))
                ).map(asChoice),
                2
            )
            for (const target of cards) {
                state = await create(target.spec, 'hand', n => addToken(n, 'echo'))(state)
            }
            return state
        }
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${bandOfMisfitsName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == bandOfMisfitsName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
cards.push(bandOfMisfits)
*/

function magpieEffect(): Effect {
    return {
        text: [`Create a copy of this in your discard.`],
        transform: (s, c) => create(c.spec)
    }
}

const magpie:CardSpec = {
    name: 'Magpie',
    buyCost: coin(3),
    effects: [coinsEffect(2), magpieEffect()]
}
cards.push(magpie)

const crown:CardSpec = {
    name: 'Crown',
    buyCost: coin(4),
    effects: [targetedEffect(
        target => addToken(target, 'crown'),
        'Put a crown token on a card in your hand.',
        s => s.hand
    )],
    staticTriggers: [reflectTrigger('crown')],
}
cards.push(crown)

const remake:CardSpec = {
    name: 'Remake',
    fixedCost: {...free, coin:3, energy:1},
    effects: [{
        text: [`Do this up to six times: trash a card in your hand,
        then create a copy of a card in the supply costing up to $2 more.`],
        transform: (s, c) => async function(state) {
            const N = 6;
            for (let i = N-1; i >= 0; i--) {
                let card:Card|null; [state, card] = await choice(state,
                    `Choose a card to remake (${i} remaining).`,
                    allowNull(state.hand.map(asChoice))
                )
                if (card == null) {
                    break
                } else {
                    state = await trash(card)(state)
                    const cost = addCosts(card.cost('buy', state), coin(2))
                    let target:Card|null; [state, target] = await choice(state,
                        `Choose a card to copy (${i} remaining).`,
                        state.supply.filter(t => leq(t.cost('buy', state), cost)).map(asChoice)
                    )
                    if (target != null) state = await create(target.spec)(state)
                }
            }
            return state
        }
    }]
}
events.push(remake)

/*
const remake:CardSpec = {
    name: 'Remake',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: [`Do this up to eight times: trash a card in your hand,
        then buy a card costing up to $2 more.`],
        transform: (s, c) => async function(state) {
            const N = 8;
            for (let i = N-1; i >= 0; i--) {
                let card:Card|null; [state, card] = await choice(state,
                    `Choose a card to remake (${i} remaining).`,
                    allowNull(state.hand.map(asChoice))
                )
                if (card == null) {
                    break
                } else {
                    state = await trash(card)(state)
                    const cost = addCosts(card.cost('buy', state), coin(2))
                    let target:Card|null; [state, target] = await choice(state,
                        `Choose a card to buy (${i} remaining).`,
                        state.supply.filter(t => leq(t.cost('buy', state), cost)).map(asChoice)
                    )
                    if (target != null) state = await target.buy(c)(state)
                }
            }
            return state
        }
    }]
}
cards.push(remake)
*/

const ferry:CardSpec = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(
        target => addToken(target, 'ferry'),
        'Put a ferry token on a supply.',
        state => state.supply,
    )],
    staticReplacers: [{
        text: `Cards cost $1 less to buy per ferry token on them, but not zero.`,
        kind: 'cost',
        handles: p => p.actionKind == 'buy',
        replace: p => ({...p, cost: reducedCost(p.cost, coin(p.card.count('ferry')), true)})
    }]
}
cards.push(ferry)

const develop:CardSpec = {
    name: 'Develop',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
        text: [`Trash a card in your hand.`,
        `Choose a card in the supply costing $1 or $2 less and create a copy in your hand.`,
        `Choose a card in the supply costing $1 or $2 more and create a copy in your hand.`],
        transform: (_, c) => async function(state) {
            state = await applyToTarget(
                target => async function(state) {
                    state = await trash(target)(state)
                    const cost = target.cost('buy', state)
                    state = await applyToTarget(
                        target2 => create(target2.spec, 'hand'),
                        'Choose a cheaper card to copy.',
                        s => s.supply.filter(c => eq(
                            target.cost('buy', s),
                            addCosts(c.cost('buy', s), {coin:1})
                        ) || eq(
                            target.cost('buy', s),
                            addCosts(c.cost('buy', s), {coin:2})
                        ))
                    )(state)
                    state = await applyToTarget(
                        target2 => create(target2.spec, 'hand'),
                        'Choose a more expensive card to copy.',
                        s => s.supply.filter(c => eq(
                            c.cost('buy', s),
                            addCosts(target.cost('buy', s), {coin:1})
                        ) || eq(
                            c.cost('buy', s),
                            addCosts(target.cost('buy', s), {coin:2})
                        ))
                    )(state)
                    return state
                }, 'Choose a card to develop.',
                s => s.hand,
            )(state)
            return state
        }
    }]
}
cards.push(develop)

const logistics = {
    name: 'Logistics',
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [],
    replacers: [costReduce('use', energy(1), true)]
}
cards.push(logistics)

const territory:CardSpec = {
    name: 'Territory',
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2), {
        text: ['Put this in your hand.'],
        transform: (s, c) => move(c, 'hand')
    }]
}
cards.push(territory)

const lastStand:CardSpec = {
    name: 'Last Stand',
    fixedCost: energy(1),
    effects: [{
        text: [`Put each card in your discard into your hand with an echo token on it.`],
        transform: (state) => doAll(state.discard.map(
            c => doAll([move(c, 'hand'), addToken(c, 'echo')])
        ))
    }],
    staticReplacers: [fragileEcho('echo')]
}
events.push(lastStand)
/*
const fossilize:CardSpec = {
    name: 'Fossilize',
    buyCost: coin(3),
    effects: [{
        text: [`Put any number of cards from your discard into your hand.`,
         `Put a fragile token on each of them.`],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Put any number of cards from your discard into your hand.',
                state.discard.map(asChoice)
            )
            state = await moveMany(cards, 'hand')(state)
            for (const card of cards) {
                state = await addToken(card, 'fragile')(state)
            }
            return state
        }
    }],
    staticTriggers: [fragileEcho('fragile')]
}
cards.push(fossilize)
*/

const harrowName = 'Harrow'
const harrow:CardSpec = {
    name: harrowName,
    buyCost: coin(4),
    effects: [{
        text: [`Discard any number of cards from your hand, then put that many cards from your discard into your hand.`],
        transform: () => async function(state) {
            let cards; [state, cards] = await multichoice(state,
                `Discard any number of cards.`,
                state.hand.map(asChoice))
            const n = cards.length
            state = await moveMany(cards, 'discard')(state)
            let targets; [state, targets] = await multichoice(state,
                `Choose ${n} cards to put into your hand.`,
                state.discard.map(asChoice),
                n, n)
            state = await moveMany(targets, 'hand')(state)
            return state
        }
    }]
}
cards.push(harrow)

/*
const chiselPlowName = "Chisel Plow"
const chiselPlow:CardSpec = {
    name: chiselPlowName,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: [`If you have less than ${num(3, chiselPlowName)} in play,
            put your discard into your hand and put this in play.`],
        transform: (s, card) => async function(state) {
            if (state.play.filter(c => c.name == chiselPlowName).length < 3) {
                state = await moveMany(state.discard, 'hand')(state)
                state = await move(card, 'play')(state)
            }
            return state
        }
    }],
    replacers: [{
        text: `Cards named ${churnName} cost an additional @ to play.`,
        kind: 'costIncrease',
        handles: p => (p.card.name == churnName) && (p.actionKind == 'play'),
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
cards.push(chiselPlow)
*/

const smithy:CardSpec = {
    name: 'Smithy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [actionsEffect(4), buysEffect(1)],
}
cards.push(smithy)

const marketSquare:CardSpec = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
}
cards.push(supplyForCard(marketSquare, coin(2), {afterBuy: [createInPlayEffect(fair, 1)]}))

/*
const brigade:CardSpec = {name: 'Brigade',
    effects: [],
    replacers: [{
        text: `Cards you play cost @ less if they share a name
               with a card in your discard and another card in your hand.
               Whenever this reduces a cost, discard it for +$2 and +2 actions.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && state.hand.some(
            c => c.name == x.card.name && c.id != x.card.id
        ) && state.discard.some(c => c.name == x.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoins(2),
                    gainActions(2),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
cards.push(supplyForCard((brigade, 4, 'expansion')
*/

const brigade:CardSpec = {name: 'Brigade',
    buyCost: coin(3),
    effects: [actionsEffect(1), coinsEffect(1)],
    replacers: [{
        text: `Cards you play cost @ less if they have no brigade token on them.
               Whenever this reduces a card's cost, put a brigade token on it and discard this.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && x.card.count('brigade') == 0),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    addToken(x.card, 'brigade'),
                    move(card, 'discard'),
                    gainCoins(1),
                    gainActions(1),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
cards.push(brigade)

const tavern:CardSpec = {
    name: 'Tavern',
    buyCost: coin(3),
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
}
cards.push(tavern)

const metalworker:CardSpec = {
    name: 'Metalworker',
    buyCost: coin(3),
    effects: [actionsEffect(1)],
    triggers: [{
        kind: 'play',
        text: `When you play a ${silver.name}, +1 action.`,
        handles: e => e.card.name == silver.name,
        transform: e => gainActions(1),
    }, {
        kind: 'play',
        text: `When you play a ${gold.name}, +1 action and +1 buy.`,
        handles: e => e.card.name == gold.name,
        transform: e => doAll([gainActions(1), gainBuys(1)]),
    }]
}
cards.push(metalworker)

const exoticMarket:CardSpec = {
    name: 'Exotic Market',
    buyCost: coin(5),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
}
cards.push(exoticMarket)

const queensCourt:CardSpec = {
    name: "Queen's Court",
    buyCost: coin(9),
    fixedCost: energy(2),
    effects: [{
        text: [`Do this three times: pay an action to play a card in your hand twice.`],
        transform: (s, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await payToDo(payAction, applyToTarget(
                    target => doAll([
                        target.play(card),
                        target.play(card),
                    ]), 'Choose a card to play twice.', s => s.hand, {optional: 'None'}
                ))(state)
                state = tick(card)(state)
            }
            return state
        }
    }]
}
cards.push(queensCourt)

const sculpt:CardSpec = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [targetedEffect(
        target => doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]),
        'Discard a card in your hand to create two copies of it in your discard.',
        state => state.hand
    )]
}
cards.push(sculpt)

const masterpiece:CardSpec = {
    name: 'Masterpiece',
    buyCost:coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(5)]
}
cards.push(masterpiece)

function workshopTransform(n:number, source:Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        `Buy a card in the supply costing up to $${n}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n))
        )
    )
}

const greatFeast:CardSpec = {
    name: 'Great Feast',
    buyCost: coin(9),
    effects: [{
        text: [`Do this three times: buy a card in the supply costing up to $8`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await workshopTransform(8, card)(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
cards.push(greatFeast)

/*
const scaffold:CardSpec = {
    name: 'Scaffold',
    buyCost: coin(5),
    effects: [{
        text: [`Do this two times: buy a card in the supply costing up to $4.`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 2; i++) {
                state = await applyToTarget(
                    target => create(target.spec, 'hand'),
                    'Choose a card to copy.',
                    state => state.supply.filter(target => leq(target.cost('buy', state),coin(5)))
                )(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
cards.push(scaffold)
*/

const universityName = 'University'
const university:CardSpec = {
    name: universityName,
    buyCost: coin(12),
    effects: [actionsEffect(4), buysEffect(1)],
    staticReplacers: [{
        text: `${universityName} costs $1 less to buy for each action you have, but not zero.`,
        kind: 'cost',
        handles: p => (p.card.name == universityName) && p.actionKind == 'buy',
        replace: (p, s) => ({...p, cost: reducedCost(p.cost, coin(s.actions), true)})
    }]
}
cards.push(university)

const steelName = 'Steel'
const steel:CardSpec = {
    name: steelName,
    buyCost: coin(3),
    effects: [coinsEffect(4)],
    staticReplacers: [{
        text: `Whenever you would create a ${steelName}, first pay a buy.
            If you can't, then don't create it.` ,
        kind: 'create',
        handles: p => p.spec.name == steelName,
        replace: (p, s) => (s.buys == 0)
            ? {...p, zone:null}
            : {...p, effects: [(c:Card) => payCost({...free, buys: 1})].concat(p.effects)}
    }]
}
cards.push(steel)

/*
const silverMine:CardSpec = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
}
cards.push(silverMine)
*/

const livery:CardSpec = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(2)],
    triggers: [{
        kind: 'afterBuy',
        text: `After buying a card costing $3 or more, create ${aOrNum(2, horse.name)} in your discard.`,
        handles: (e,s) => e.card.cost('buy', s).coin >= 3,
        transform: () => repeat(create(horse, 'discard'), 2)
    }]
}
cards.push(livery)

const stables:CardSpec = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [createEffect(horse, 'discard', 2)]
}
cards.push(supplyForCard(stables, coin(2), {onBuy: [{
    text: [`Pay all actions to create that many ${horse.name}s in your discard.`],
    transform: () => async function(state) {
        const n = state.actions
        state = await payCost({...free, actions:n})(state)
        state = await repeat(create(horse), n)(state)
        return state
    }
}]}))

const bustlingVillage:CardSpec = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [{
        text: [`+1 action for each differently-named card in play.`],
        transform: state => async function(state) {
            const n = countDistinctNames(state.play)
            state = await gainActions(n)(state)
            return state
        }
    }, createInPlayEffect(villager)]
}
cards.push(bustlingVillage)

/*
const inn:CardSpec = {
    name: 'Inn',
    buyCost: coin(6),
    relatedCards: [horse, villager],
    effects: [createEffect(horse, 'discard', 2), createInPlayEffect(villager, 2)],
}
cards.push(inn)
*/

const guildHall:CardSpec = {
    name: 'Guild Hall',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [coinsEffect(3)],
    triggers: [{
        text: `Whenever you use an event,
            discard this to use it again.`,
        kind: 'use',
        handles: (e, state, card) => state.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.use(card)(state)
        }
    }]
}
cards.push(guildHall)
/*
const overextend:CardSpec = {
    name: 'Overextend',
    buyCost: coin(4),
    effects: [actionsEffect(4), createInPlayEffect(villager, 4)],
    relatedCards: [villager],
    replacers: [{
        text: `Cards cost @ more to play.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'play',
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
cards.push(overextend)
*/

const contraband:CardSpec = {
    name: 'Contraband',
    buyCost: coin(3),
    effects: [coinsEffect(3), buysEffect(3)],
    replacers: [{
        text: `Cards cost $1 more to buy.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'buy',
        replace: p => ({...p, cost: addCosts(p.cost, coin(1))})
    }]
}
cards.push(contraband)
/*
const diamond:CardSpec = {
    name: 'Diamond',
    buyCost: coin(4),
    effects: [coinsEffect(2), pointsEffect(1)],
}
cards.push(diamond)

const lurkerName = 'Lurker'
const lurker:CardSpec = {
    name: lurkerName,
    buyCost: coin(3),
    effects: [actionsEffect(1), {
        text: [`Trash a card in your hand.
               If you trash a ${lurkerName}, buy a card in the supply costing up to $8,
               otherwise buy a ${lurkerName}.`],
        transform: (s, c) => async function(state) {
            let card:Card|null; [state, card] = await choice(state,
                'Choose a card to trash.',
                state.hand.map(asChoice))
            if (card != null) state = await trash(card)(state)
            if (card !== null && card.name == lurkerName) {
                state = await workshopTransform(8, c)(state)
            } else {
                state = await applyToTarget(
                    target => target.buy(c),
                    'Choose a card to buy.',
                    state => state.supply.filter(sup => sup.name == lurkerName)
                )(state)
            }
            return state
        }
    }]
}
cards.push(lurker)
*/

const kiln:CardSpec = {
    name: 'Kiln',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `After playing a card with this in play, discard this to create a copy of the card you played.`,
        kind: 'afterPlay',
        handles: (e, s, c) => s.find(c).place == 'play' && e.before.find(c).place == 'play',
        transform: (e, s, c) => doAll([move(c, 'discard'), create(e.card.spec, 'discard')])
    }]
}
cards.push(kiln)

/*
const werewolfName = 'Werewolf'
const werewolf:CardSpec = {
    name: 'Werewolf',
    buyCost: coin(3),
    effects: [{
        text: [`If a ${werewolfName} in the supply has an odd number of charge tokens on it, +3 actions.
        Otherwise, +$3.`],
        transform: () => async function(state) {
            if (state.supply.some(sup => (sup.name == werewolfName) && (sup.charge % 2 == 1) )) {
                state = await gainActions(3)(state)
            } else {
                state = await gainCoins(3)(state)
            }
            return state
        }
    }],
    staticTriggers: [{
        text: `Whenever you use ${refresh.name}, put a charge token on this.`,
        kind: 'use',
        handles: e => e.card.name == refresh.name,
        transform: (e, s, c) => charge(c)
    }]
}
cards.push(werewolf)
*/

const moon:CardSpec = {
    name: 'Moon',
    replacers: [{
        text: `Whenever you would move this from play,
               instead put a charge token on it.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([charge(c)])})
    }]
}

const werewolf:CardSpec = {
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
        text: [`If there is no ${moon.name} in play, create one.`],
        transform: s => (s.play.some(c => c.name == moon.name)) ? noop : create(moon, 'play'),
    }, {
        text: [`If a ${moon.name} in play has an odd number of charge tokens, +$3 and +1 buy.
                Otherwise, +3 actions.`],
        transform: s => (s.play.some(c => c.name == moon.name && c.charge % 2 == 1)) ?
            doAll([gainCoins(3), gainBuys(1)]) :
            gainActions(3)
    }]
}
cards.push(werewolf)

const churnName = 'Churn'
const churn:CardSpec = {
    name: churnName,
    effects: [actionsEffect(1), {
        text: [`For each charge token on this put a non-${churnName} card from your discard into your hand.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            let cards:Card[]; [state, cards] = await multichoice(state,
                `Choose ${n} cards to put into your hand.`,
                state.discard.filter(c => c.name != churnName).map(asChoice), n
            )
            state = await moveMany(cards, 'hand')(state)
            return state
        }
    }, {
        text: [`Remove a charge token from this.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            }
            return state
        }
    }]
}
cards.push(supplyForCard(churn,coin(4), {
    replacers: [startsWithCharge(churn.name, 3)]
}))

const accelerate:CardSpec = {
    name: 'Accelerate',
    fixedCost: {...free, energy:1, coin:3},
    effects: [{
        text: [`Put an accelerate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'accelerate')))
    }],
    staticReplacers: [playReplacer(
        `Whenever you would create a card in your discard
        whose supply has an accelerate token,
        instead remove an accelerate token to set the card aside and play it.`,
        (p, s, c) => nameHasToken(p.spec, 'accelerate', s),
        (p, s, c) => applyToTarget(
            t => removeToken(t, 'accelerate', 1, true),
            'Remove an accelerate token.',
            state => state.supply.filter(t => t.name == p.spec.name),
            {cost: true}
        )
    )]
}
events.push(accelerate)

/*
const masonry:CardSpec = {
    name: 'Masonry',
    fixedCost: coin(2),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card other than with this, remove a charge token from this to buy a card
        in the supply with equal cost.`,
        handles: (e, s, c) => c.charge > 0 && e.source.id != c.id,
        transform: (e, s, c) => payToDo(discharge(c, 1), applyToTarget(
            target => target.buy(c),
            `Choose a card to buy.`,
            state => state.supply.filter(sup => eq(sup.cost('buy', state), e.card.cost('buy', state)))
        ))
    }]
}
events.push(masonry)
*/

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
events.push(swap)

const infrastructure:CardSpec = {
    name: 'Infrastructure',
    replacers: [{
        text: `Events cost @ less to use. Whenever this reduces a cost, trash it.`,
        kind: 'cost',
        handles: x => x.actionKind == 'use',
        replace: function(x:CostParams, state:State, card:Card) {
            if (x.cost.energy > 0) {
                return {...x, cost: {...x.cost,
                    energy:x.cost.energy - 1,
                    effects:x.cost.effects.concat([trash(card)])
                }}
            } else {
                return x
            }
        }
    }, trashOnLeavePlay()]
}

const planning:CardSpec = {
    name: 'Planning',
    buyCost: coin(6),
    effects: [],
    relatedCards: [infrastructure],
    triggers: [{
        text: `Whenever you pay @,
               create that many ${infrastructure.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => repeat(create(infrastructure, 'play'), e.cost.energy)
    }]
}
cards.push(planning)

const privateWorks:CardSpec = {
    name: 'Private Works',
    relatedCards: [infrastructure],
    fixedCost: {...free, coin:4, energy:1},
    effects: [createInPlayEffect(infrastructure, 2)]
}
events.push(privateWorks)

function gainExactly(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing $${n}.`,
        state => state.supply.filter(
            x => eq(x.cost('buy', state), coin(n))
        )
    )
}

        /* Swell:
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 6; i++) {
                let target:Card|null; [state, target] = await choice(state,
                    `Buy a card costing $${i}`,
                    state.supply.filter(c => c.cost('buy', state).coin == i).map(asChoice)
                )
                if (target != null) state = await target.buy(card)(state)
            }
            return state
        }
        */
const alliance:CardSpec = {
    name: 'Alliance',
    fixedCost: {...free, coin:6, energy:1},
    effects: [{
        text: [`Create a ${province.name}, ${duchy.name}, ${estate.name}, ${gold.name}, ${silver.name}, and ${copper.name} in your discard.`],
        transform: () => doAll([province, duchy, estate, gold, silver, copper].map(c => create(c)))
    }]
}
events.push(alliance)

const buildUp:CardSpec = {
    name: 'Urbanize',
    fixedCost: coin(3),
    variableCosts: [costPer(coin(1))],
    effects: [createInPlayEffect(infrastructure), incrementCost()],
    relatedCards: [infrastructure]
}
events.push(buildUp)

/*
const avenue:CardSpec = {
    name: 'Avenue',
    effects: [actionsEffect(1), coinsEffect(1)],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && s.play.length < 2
    }],
    ability: [{
        text: [`Discard this and another card from play for +$1 and +1 action.`],
        transform: (state, c) => payToDo(
            doAll([discardFromPlay(c), applyToTarget(
                target => discardFromPlay(target),
                `Discard a card from play.`,
                state => state.play,
                {cost: true}
            )]),
            doAll([gainActions(1), gainCoins(1)])
        )
    }]
}
cards.push(supplyForCard((avenue, 5, 'expansion')
*/

const inn:CardSpec = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
}
cards.push(supplyForCard(inn,coin(5), {onBuy: [createEffect(horse, 'discard', 3)]}))

/*
const exploit:CardSpec = {
    name: 'Exploit',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash all cards in play for +1 vp each.`],
        transform: state => doAll(state.play.map(c => doAll([trash(c), gainPoints(1)])))
    }]
}
events.push(exploit)

const treasury:CardSpec = {
    name: 'Treasury',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    triggers: [{
        text: `Whenever you gain more than one action, gain that much $ minus one.`,
        kind: 'resource',
        handles: e => e.resource == 'actions' && e.amount > 1,
        transform: e => gainCoins(e.amount - 1)
    }]
}
cards.push(supplyForCard((treasury, 4, 'expansion')
*/

const statue:CardSpec = {
    name: 'Statue',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [],
    triggers: [{
        text: `Whenever you buy a card costing $1 or more, +1 vp.`,
        kind: 'buy',
        handles: (e, s) => e.card.cost('buy', s).coin > 0,
        transform: e => gainPoints(1),
    }]
}
cards.push(statue)

const scepter:CardSpec = {
    name: 'Scepter',
    fixedCost: energy(2),
    buyCost: coin(7),
    effects: [{
        text: [`Pay an action to play a card in your hand three times then trash it.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),

            ]), 'Choose a card to play three times.', s => s.hand
        ))
    }]
}
cards.push(scepter)

const farmlandName = 'Farmland'
const farmland:CardSpec = {
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    effects: [],
    restrictions: [{
        test: (card, state, kind) =>
            kind == 'activate' && state.play.some(c => c.name == farmlandName && c.id != card.id)
    }],
    ability: [{
        text: [`If you have no other ${farmlandName}s in play, discard this for +8 vp.`],
        transform: (s, c) => payToDo(discardFromPlay(c), gainPoints(8)),
    }],
}
cards.push(farmland)

const hallOfEchoes:CardSpec = {
    name: 'Hall of Echoes',
    fixedCost: {...free, energy:1, coin:5},
    effects: [{
        text: [`For each card in your hand without an echo token,
                create a copy in your hand with an echo token.`],
        transform: state => doAll(
            state.hand.filter(c => c.count('echo') == 0).map(
                c => create(c.spec, 'hand', x => addToken(x, 'echo'))
            )
        )
    }],
    staticReplacers: [fragileEcho()],
}
events.push(hallOfEchoes)
