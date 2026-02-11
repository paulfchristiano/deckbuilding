import {
  CardSpec, Card, choice, asChoice, trash,
  Cost, addCosts, subtractCost, multiplyCosts,
  eq, leq, Effect, noop,
  gainPoints, gainActions, gainCoins, gainBuys,
  free, create, move,
  doAll, multichoice,
  VariableCost, renderCost,
  moveMany, payToDo, payCost,
  Token, addToken, removeToken,
  charge, discharge, uncharge,
  CostParams, State, Trigger, MoveEvent, Replacer, MoveParams,
  asNumberedChoices,
  Option, Key, ActionKind,
  allowNull,
  setResource, Transform,
  tick, a, num, aOrNum,
  createAndTrack,
  villager, fair, horse,
  actionsEffect, buyEffect, buysEffect, pointsEffect, createEffect,
  refreshEffect, recycleEffect, createInPlayEffect, chargeEffect,
  targetedEffect, workshopEffect,
  coinsEffect,
  energy, coin, repeat,
  costPer, incrementCost, costReduceNext,
  countNameTokens, nameHasToken,
  startsWithCharge,
  useRefresh, costReduce, reducedCost, applyToTarget,
  playTwice, payAction, sortHand, discardFromPlay,
  trashThis,
  copper, gold, silver,
  dedupBy, countDistinctNames,
  playReplacer, trashOnLeavePlay, stayInPlay,
  sourceHasName, Source,
  cannotUse, renderCostOrZero,
  echoRule, priorityRule, reflectRule, ferryRule, twinRule, duplicateRule,
  cardRewards,
  buyTrigger, afterBuyTrigger,
  fountainEffect,
  shelterRule,
  startInPlay,
  discard,
  fountainTransform,
} from '../gameLogic.js'

function toPlay(): Effect {
    return {
        text: [`Put this in play.`],
        transform: (state, c) => move(c, 'play')
    }
}

const ghostTown:CardSpec = {name: 'Ghost Town',
    buyCost: coin(3),
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager],
    staticTriggers: [buyTrigger(actionsEffect(3))]
}
cardRewards.push(ghostTown)

/*
export const transmogrify:CardSpec = {name: 'Transmogrify',
    buyCost: coin(3),
    simpleText: [
        `Trash a card in your hand.`,
        `Create a card in your hand costing up to $2 more than it.`
    ],
    effects: [actionsEffect(1), {
        text: [`Trash a card in your hand.
                If you do, choose a card in the supply costing up to $2 more than it.
                Create a copy of that card in your hand.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to transmogrify.',
                state.hand.map(asChoice)
            )
            if (target != null) {
                state = await trash(target)(state)
                const cost:Cost = addCosts(
                    target.cost('buy', state),
                    coin(2)
                )
                let target2:Card|null; [state, target2] = await choice(
                    state, 'Choose a card to copy.',
                    state.supply.filter(
                        c => leq(c.cost('buy', state), cost)
                    ).map(asChoice)
                )
                if (target2 != null) {
                    state = await create(target2.spec, 'hand')(state)
                }
            }
            return state
        }
    }]
}
cardRewards.push(transmogrify)
*/

const Till = 'Till'
const till:CardSpec = {name: Till,
    buyCost: coin(4),
    effects: [{
        text: [`Put up to 3 non-${Till} cards from your
               discard into your hand.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to three cards to put into your hand.',
                state.discard.filter(c => c.name != Till).map(asChoice),
                3)
            state = await moveMany(targets, 'hand')(state)
            return state
        }
    }]
}
cardRewards.push(till)


export const village:CardSpec = {name: 'Village',
    buyCost: coin(2),
    effects:  [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
}
cardRewards.push(village)

export const bridge:CardSpec = {name: 'Bridge',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce('buy', {coin:1}, true)]
}
cardRewards.push(bridge)

const lab:CardSpec = {name: 'Lab',
    buyCost: coin(2),
    effects: [actionsEffect(3)]
}
cardRewards.push(lab)

function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction(card), playTwice(card))
    }
}

export const throneRoom:CardSpec = {name: 'Throne Room',
    simpleText: [`Pay an action to play a card in your hand twice without paying any @ costs.`],
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [throneroomEffect()]
}
cardRewards.push(throneRoom)

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [buysEffect(1)],
    triggers: [{
        kind: 'play',
        text: `When you play a copper, +$1.`,
        handles: e => e.card.name == copper.name,
        transform: (e, s, c) => gainCoins(1, c),
    }]
}
cardRewards.push(coppersmith)

const Unearth = 'Unearth'
const unearth:CardSpec = {name: Unearth,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(
            target => move(target, 'hand'),
            `Put a non-${Unearth} card from your discard into your hand.`,
            state => state.discard.filter(c => c.name != Unearth)
        )
    ]
}
cardRewards.push(unearth)

/*
const celebrationName = 'Celebration'
export const celebration:CardSpec = {name: celebrationName,
    buyCost: coin(6),
    simpleText: [
        `Cards cost @ less to play.`,
        `When you create this, put it directly into play.`
    ],
    fixedCost: energy(1),
    replacers: [costReduce('play', {energy:1})],
    staticReplacers: [startInPlay(celebrationName)]
}
cardRewards.push(celebration)
*/

const plowName = 'Plow'
const plow:CardSpec = {name: plowName,
    buyCost: coin(4),
    simpleText: [
        `Put your discard into your hand.`,
        `${plowName} goes to play instead of your discard when played or created.`
    ],
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    staticReplacers: [{
        kind: 'create',
        text: `Whenever you would create a ${plowName}, create it in play.`,
        handles: p => p.spec.name == plowName,
        replace: p => ({...p, zone:'play'})
    }]
}
cardRewards.push(plow)

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    buyCost: coin(4),
    effects: [actionsEffect(3)],
    triggers: [{
        text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
        kind: 'cost',
        handles: (e) => e.cost.energy > 0,
        transform: (e, s, c) => doAll([
            gainActions(e.cost.energy, c),
            gainCoins(e.cost.energy, c),
            gainBuys(e.cost.energy, c)
        ])
    }]
}
cardRewards.push(construction)


function chargeUpTo(max: number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const investmentName = 'Investment'
const investment:CardSpec = {name: investmentName,
    simpleText: [
        `+$2.`,
        `The $ produced increases by 1 each time you play this, up to +$6.`
    ],
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [{
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, chargeUpTo(6)],
    staticReplacers: [startsWithCharge(investmentName, 2)]
}
cardRewards.push(investment)



const royalSeal:CardSpec = {name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair],
    buyCost: coin(5),
}
cardRewards.push(royalSeal)

const workshopName = 'Workshop'
export const workshop:CardSpec = {name: workshopName,
    fixedCost: energy(0),
    buyCost: coin(3),
    effects: [workshopEffect(4, workshopName)],
}
cardRewards.push(workshop)

const shippingLane:CardSpec = {name: 'Shipping Lane',
    simpleText: [
        `+$2.`,
        `The next time you buy a card, buy it again for free.`
    ],
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `Whenever you buy a card,
            discard this to buy the card again.`,
        kind: 'buy',
        handles: (e, state, card) => state.find(card!).place == 'play',
        transform: (e, state, card) => async function(state) {
            if (state.find(card!).place == 'play') {
                state = await move(card!, 'discard')(state)
                return e.card.buy(card)(state)
            } else {
                return state
            }
        }
    }]
}
cardRewards.push(shippingLane)

const factoryName = 'Factory'
const factory:CardSpec = {name: factoryName,
    fixedCost: energy(1),
    effects: [workshopEffect(6, factoryName)],
    buyCost: coin(3)
}
cardRewards.push(factory)

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a copy of it in your hand.',
        state => state.hand,
    )],
    buyCost: coin(3),
}
cardRewards.push(imitation)

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
    ), trashThis()],
    buyCost: coin(3),
    staticTriggers: [buyTrigger(buyEffect())]
}
cardRewards.push(feast)


const researcher:CardSpec = {name: 'Researcher',
    simpleText: [
        `+3 actions.`,
        `This increases by +1 action each time you play it.`
    ],
    effects: [{
        text: [`+1 action for each charge token on this.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            state = await gainActions(n, card)(state)
            return state
            /*
            for (let i = 0; i < n; i++) {
                let mode:string|null; [state, mode] = await choice(
                    state,
                    `Choose a benefit (${n - i} remaining)`,
                    literalOptions(['action', 'coin'], ['a', 'c'])
                )
                switch(mode) {
                    case 'coin':
                        state = await gainCoins(1, card)(state)
                        break
                    case 'action':
                        state = await gainActions(1, card)(state)
                        break
                }
            }
            return state
            */
        }
    }, chargeEffect()],
    buyCost: coin(5),
    staticReplacers: [startsWithCharge('Researcher', 3)],
}
cardRewards.push(researcher)

const lackeys:CardSpec = {name: 'Lackeys',
    fixedCost: energy(1),
    effects: [actionsEffect(4)],
    relatedCards: [villager],
    buyCost: coin(4),
    staticTriggers: [buyTrigger(createInPlayEffect(villager, 2))]
}
cardRewards.push(lackeys)

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [createEffect(gold, 'hand', 2)],
    buyCost: coin(6),
}
cardRewards.push(goldMine)


const shelterName = 'Shelter'
export const shelter:CardSpec = {name: shelterName,
    buyCost: coin(3),
    simpleText: [
        `+1 action`,
        `Put a shelter token on each card in play. The next time they would leave play, instead remove a shelter token.`
    ],
    effects: [actionsEffect(1), {
        text: [`Put a shelter token on each card in play.`],
        transform: (state, card) => async function(state) {
            for (const c of state.play) {
                state = await addToken(c, 'shelter')(state)
            }
            return state
        }
    }],
    rules: [shelterRule]
}
cardRewards.push(shelter)


const market:CardSpec = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
    buyCost: coin(2),
}
cardRewards.push(market)

const ruinedLab:CardSpec = {
    name: 'Ruined Lab',
    effects: [actionsEffect(2)],
    buyCost: coin(2),
}
const ruinedMarket:CardSpec = {
    name: 'Ruined Market',
    effects: [coinsEffect(1), buyEffect()],
    buyCost: coin(2),
}
export const ruinedVillage:CardSpec = {
    name: 'Ruined Village',
    effects: [createInPlayEffect(villager)],
    buyCost: coin(2),
    relatedCards: [ruinedLab, ruinedMarket, villager],
    staticTriggers: [{
        kind: 'gameStart',
        text: `At the start of the game, add ${ruinedLab.name} and ${ruinedMarket.name} to the supply.`,
        handles: () => true,
        transform: (e, s, c) => async function (state: State) {
            let lab; [lab, state] = await createAndTrack(ruinedLab, 'supply')(state)
            if (lab != null) {
                state = state.moveAfter('supply', lab, c!)
            }
            let market; [market, state] = await createAndTrack(ruinedMarket, 'supply')(state)
            if (market != null) {
                state = state.moveAfter('supply', market, c!)
            }
            return state
        }
    }]
}
cardRewards.push(ruinedVillage)

const herbs:CardSpec = {name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()],
    buyCost: coin(1),
    staticTriggers: [buyTrigger(buyEffect())]
}
cardRewards.push(herbs)

const spices:CardSpec = {name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
    buyCost: coin(5),
    staticTriggers: [buyTrigger(coinsEffect(4))]
}
cardRewards.push(spices)


const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)],
    buyCost: coin(8),
}
cardRewards.push(platinum)

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(8), buysEffect(2)],
    buyCost: coin(6),
}
cardRewards.push(greatSmithy)


function KCEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand three times.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
            ]), 'Choose a card to play three times.', s => s.hand))
    }
}

const kingsCourt:CardSpec = {name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()],
    buyCost: coin(9),
}
cardRewards.push(kingsCourt)

/*
const procession:CardSpec = {name: 'Procession',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay one action to play a card in your hand twice,
                then trash it and create a copy of a card in the supply
                costing exactly $1 or $2 more.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(
                    target2 => create(target2.spec),
                    'Choose a card to copy.',
                    s => s.supply.filter(c => eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:1})
                    ) || eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:2})
                    ))
                )
            ]), 'Choose a card to play twice.', s => s.hand
        ))
    }],
    buyCost: coin(3),
}
cardRewards.push(procession)
*/

const tactic:CardSpec = {
    name: 'Tactic',
    ability:[{
        text: [`Remove a charge token from this, trash it, and pay an action
        to play a card from your hand three times.`],
        transform: (state, card) => payToDo(payCost({
            ...free, actions:1, effects:[discharge(card, 1), trash(card)]
        }, card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card)
            ]),
            'Choose a card to play three times.',
            s => s.hand
        ))
    }],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && ((s.actions < 1) || c.charge == 0),
    }],
    replacers: [{
        text: `Whenever you would move this to your hand,
               instead put a charge token on this.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            charge(c, 1),
        ])})
    }]
}

const mastermind:CardSpec = {
    simpleText: [
        `Create a ${tactic.name} in play.`,
        `Whenever it would move to your hand it gains a charge token instead.`,
        `Once it has a charge token, you can trash it and pay an action to play a card in your hand three times.`
    ],
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    effects: [createInPlayEffect(tactic)],
    buyCost: coin(6),
}
cardRewards.push(mastermind)

const recruitment:CardSpec = {
    name: 'Recruitment',
    relatedCards: [villager, fair],
    effects: [actionsEffect(1)],
    triggers: [{
        text: `Whenever you pay @,
               create that many ${villager.name}s and ${fair.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => doAll([villager, fair].map(
            c => repeat(create(c, 'play'), e.cost.energy)
        ))
    }],
    buyCost: coin(3),
}
cardRewards.push(recruitment)

/*
const dragon:CardSpec = {name: 'Dragon',
    buyCost: coin(7),
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              coinsEffect(4), actionsEffect(4), buyEffect()]
}
const hatchery:CardSpec = {name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon],
    effects: [actionsEffect(1), {
        text: [`If this has two charge tokens, remove one and
                create ${a(dragon.name)} in your hand.
                Otherwise, put a charge token on this.`],
        transform: (state, card) => {
            const c = state.find(card);
            return (c.charge >= 2)
                ? doAll([
                    discharge(c, 1),
                    create(dragon, 'hand')
                ]) : charge(c)
        }
    }],
    buyCost: coin(4)
}
cardRewards.push(hatchery)
*/

const looter:CardSpec = {name: 'Looter',
    relatedCards: [villager],
    effects: [{
        text: [`Discard any number of cards from your hand for +1 action each.`],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose any number of cards to discard',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            state = await gainActions(targets.length, card)(state)
            return state
        }
    }, {
        text: [`Trash any number of cards from your discard, and create a ${villager.name} in play for each.`],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose any number of cards to trash',
                state.discard.map(asChoice))
            state = await moveMany(targets, 'void')(state)
            for (let i = 0; i < targets.length; i++) {
                state = await create(villager, 'play')(state)
            }
            return state
        }
    }],
    buyCost: coin(4),
}
cardRewards.push(looter)

const Innovation:string = 'Innovation'
export const innovation:CardSpec = {name: Innovation,
    simpleText: [`The next time you create a card in your hand or discard, play it immediately.`],
    effects: [actionsEffect(1)],
    replacers: [playReplacer(
        `Whenever you would create a card in your discard,
        instead discard this to set the card aside.
        Then play it if it is still set aside.`,
        (p, s, c) => s.find(c).place == 'play',
        (p, s, c) => discardFromPlay(c),
    )],
    buyCost: coin(3),
}
cardRewards.push(innovation)

/*
const formation:CardSpec = {name: 'Formation',
    effects: [],
    replacers: [{
        text: 'Cards cost @ less to play if they share a name with a card in your discard or in play.'
         + ' Whenever this reduces a cost, discard it and +2 actions.',
        kind: 'cost',
        handles: (x, state) => x.actionKind == 'play'
            && state.discard.concat(state.play).some(c => c.name == x.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainActions(2, card),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }],
    buyCost: coin(4),
}
*/
const formation:CardSpec = {
    name: 'Formation',
    effects: [actionsEffect(2)],
    buyCost: coin(4),
    replacers: [{
        text: `Cards cost @ less to play if they share a name with a card in your discard or in play.`,
        kind: 'cost',
        handles: (x, state) => x.actionKind == 'play' && state.discard.concat(state.play).some(c => c.name == x.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            return {...x, cost:subtractCost(x.cost, {energy:1})}
        }
    }]
}
cardRewards.push(formation)

const coven:CardSpec = {
    name: 'Coven',
    effects: [coinsEffect(1)],
    buyCost: coin(3),
    replacers: [{
        text: `Cards cost @ less to play if they don't share a name with a card in your discard or in play.`,
        kind: 'cost',
        handles: (x, state) => x.actionKind == 'play' && !state.discard.concat(state.play).some(c => c.name == x.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            return {...x, cost:subtractCost(x.cost, {energy:1})}
        }
    }]
}
cardRewards.push(coven)

const Traveler = 'Traveler'
const traveler:CardSpec = {
    simpleText: [
        `Pay an action to play a card in your hand once for each charge token on this.`,
        `It starts with 1 charge token and gains 1 each time you play it, up to 3.`
    ],
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay an action to play a card in your hand once for each charge token on this.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
            target => async function(state){
                const n = state.find(card).charge
                for (let i = 0; i < n; i++) {
                    state = await target.play(card)(state)
                    state = tick(card)(state)
                }
                return state
            },
            `Choose a card to play with ${Traveler}.`,
            s => s.hand
        ))
    }, chargeUpTo(3)],
    buyCost: coin(4),
    staticReplacers: [startsWithCharge(Traveler, 1)],
}
cardRewards.push(traveler)

export const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [actionsEffect(1)],
    ability: [{
        transform: (state, card) => payToDo(discardFromPlay(card), fountainTransform(card)),
        text: [`Discard this from play to lose all actions, $, and buy, then gain +5 actions and +1 buy.`]
    }],
    buyCost: coin(3),
}
cardRewards.push(fountain)


const grandMarket:CardSpec = {
    name: 'Grand Market',
    buyCost: coin(6),
    effects: [actionsEffect(1), coinsEffect(3), buysEffect(2)],
}
cardRewards.push(grandMarket)

const Industry = 'Industry'
function industryTransform(n:number, except:string=Industry, source:Source):Transform{
    return applyToTarget(
        target => target.buy(source),
        `Buy a card in the supply costing up to $${n} not named ${except}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n)) && x.name != except
        )
    )
}
const industry:CardSpec = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
        text: [`Do this twice: buy a card in the supply costing up to $8 other than ${Industry}.`],
        transform: (state, card) => doAll([
            industryTransform(8, Industry, card),
            tick(card),
            industryTransform(8, Industry, card)
        ])
    }],
    buyCost: coin(6),
}
cardRewards.push(industry)

const artificer:CardSpec = {
    name: 'Artificer',
    effects: [{
        text: [`Discard any number of cards.`,
        `Choose a card in the supply costing $1 per card you discarded,
        and create a copy in your hand.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose any number of cards to discard.',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            const n = targets.length
            let target; [state, target] = await choice(state,
                `Choose a card costing $${n} to gain a copy of.`,
                state.supply.filter(
                    c => c.cost('buy', state).coin == n
                ).map(asChoice))
            if (target != null) {
                state = await create(target.spec, 'hand')(state)
            }
            return state
        }

    }],
    buyCost: coin(3),
}
cardRewards.push(artificer)

export const banquet:CardSpec = {
    name: 'Banquet',
    buyCost: coin(3),
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && s.hand.length > 0
    }],
    effects: [{
        text: [`Put a charge token on this for every 2 cards in your hand, rounded up.`],
        transform: (state, c) => charge(c, Math.ceil(state.hand.length / 2))
    }],
    replacers: [{
        text: `Whenever this leaves play, remove all charge tokens from it.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone != 'play' && p.skip == false,
        replace: (p, state, card) => ({...p, effects: p.effects.concat([discharge(card, p.card.charge)])})
    }],
    ability: [{
        text: [`If you have no cards in your hand, discard this for +$1 per charge token on it.`],
        transform: (state, card) => payToDo(discardFromPlay(card), gainCoins(card.charge, card))
    }]
    
}
cardRewards.push(banquet)

const harvest:CardSpec = {
    name:'Harvest',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action for each differently-named card in your hand.`],
        transform: (state, card) => async function(state) {
            const n = countDistinctNames(state.hand)
            state = await gainActions(n, card)(state)
            return state
        }
    },{
        text: [`+$1 for each differently-named card in your discard.`],
        transform: (state, card) => async function(state) {
            const n = countDistinctNames(state.discard)
            state = await gainCoins(n, card)(state)
            return state
        }
    } ],
    buyCost: coin(3)
}
cardRewards.push(harvest)

const secretChamber:CardSpec = {
    name: 'Secret Chamber',
    effects: [{
        text: [`Discard any number of cards from your hand for +$1 each.`],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Discard any number of cards for +$1 each.',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            state = await gainCoins(targets.length, card)(state)
            return state
        }
    }, {
        text: [`Trash any number of cards from your discard for +1 buy each.`],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Trash any number of cards for +1 buy each.',
                state.discard.map(asChoice))
            state = await moveMany(targets, 'void')(state)
            state = await gainBuys(targets.length, card)(state)
            return state
        }
    }],
    buyCost: coin(3),
}
cardRewards.push(secretChamber)

const hireling:CardSpec = {
    name: 'Hireling',
    relatedCards: [fair],
    effects: [],
    replacers: [{
        text: `Whenever you would move this to your hand,
               instead +1 action, +1 buy, +$1, and create a ${fair.name} in play.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play')
        ])})
    }],
    buyCost: coin(2),
}
cardRewards.push(hireling)

const hagglerName = 'Haggler'
export const haggler:CardSpec = {
    name: hagglerName,
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `After you buy a card the normal way, you may buy another card that costs less.`,
        kind: 'afterBuy',
        handles: (e, state, card) => state.find(card!).place == 'play' && e.source == 'act',
        transform: (e, state, card) =>  applyToTarget(
            target => target.buy(card),
            `Buy a card in the supply costing less than $${e.card.cost('buy', state).coin}.`,
            state => state.supply.filter(
                x => leq(x.cost('buy', state), coin(e.card.cost('buy', state).coin - 1))
            )
        )
    }]
}
cardRewards.push(haggler)

const highwayName = 'Highway'
export const highway:CardSpec = {
    name: highwayName,
    effects: [actionsEffect(1)],
    simpleText: [`Cards cost $1 less to buy.`,
    `When you create this, put it directly into play.`],
    replacers: [costReduce('buy', {coin:1}, true)],
    buyCost: coin(5),
    staticReplacers: [startInPlay(highwayName)]
}
cardRewards.push(highway)



const FairyGold = 'Fairy Gold'
const fairyGold:CardSpec = {
    simpleText: [
        `+$3 and +1 buy.`,
        `The $ produced decreases by 1 each time you play this.`
    ],
    name: FairyGold,
    effects: [buyEffect(), {
        text: [`+$1 per charge token on this.`],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, {
        text: [`Remove a charge token from this if it has any.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            }
            return state
        }

    }],
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(FairyGold, 3)]
}
cardRewards.push(fairyGold)


const fortuneName = 'Fortune'
const fortune:CardSpec = {
    simpleText: [
        `Double your $ and buys.`,
        `You can only buy Fortune once.`
    ],
    name: fortuneName,
    effects: [{
        text: [`Double your $.`],
        transform: (state, card) => gainCoins(state.coin, card)
    }, {
        text: [`Double your buys.`],
        transform: (state, card) => gainBuys(state.buys, card)
    }],
    staticTriggers: [{
        kind: 'create',
        text: `Whenever you create ${a(fortuneName)}, trash this from the supply.`,
        handles: e => e.card.name == fortuneName,
        transform: (e, s, c) => trash(c),        
    }],
    buyCost: coin(12),
}
cardRewards.push(fortune)


const ferry:CardSpec = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    simpleText: [`+1 buy, +$1,`,
    `Put a ferry token on a supply. It costs $1 less.`],
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(
        target => addToken(target, 'ferry', 1),
        'Put a ferry token on a supply.',
        state => state.supply,
    )],
    rules: [ferryRule],
}
cardRewards.push(ferry)

export const transmogrify:CardSpec = {
    name: 'Transmogrify',
    buyCost: coin(3),
    effects: [{
        text: [`Trash a card in your hand.`,
        `Choose a card in the supply costing less and create a copy in your hand.`,
        `Choose a card in the supply costing $1 or $2 more and create a copy in your hand.`],
        transform: (_, c) => async function(state) {
            state = await applyToTarget(
                target => async function(state) {
                    state = await trash(target)(state)
                    const cost = target.cost('buy', state)
                    state = await applyToTarget(
                        target2 => create(target2.spec, 'hand'),
                        'Choose a cheaper card to copy.',
                        s => s.supply.filter(c => !leq(
                            target.cost('buy', s), c.cost('buy', s)
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
                }, 'Choose a card to transmogrify.',
                s => s.hand,
            )(state)
            return state
        }
    }]
}
cardRewards.push(transmogrify)

const harrowName = 'Harrow'
const harrow:CardSpec = {
    name: harrowName,
    buyCost: coin(3),
    effects: [{
        text: [`Discard any number of cards from your hand, then put that many non-${harrowName} cards from your discard into your hand.`],
        transform: () => async function(state) {
            let cards; [state, cards] = await multichoice(state,
                `Discard any number of cards.`,
                state.hand.map(asChoice))
            const n = cards.length
            state = await moveMany(cards, 'discard')(state)
            let targets; [state, targets] = await multichoice(state,
                `Choose ${n} cards to put into your hand.`,
                state.discard.filter(c => c.name != harrowName).map(asChoice),
                n, n)
            state = await moveMany(targets, 'hand')(state)
            return state
        }
    }]
}
cardRewards.push(harrow)

export const tavern:CardSpec = {
    name: 'Tavern',
    buyCost: coin(2),
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
}
cardRewards.push(tavern)

const metalworker:CardSpec = {
    name: 'Metalworker',
    buyCost: coin(3),
    effects: [actionsEffect(1)],
    triggers: [{
        kind: 'play',
        text: `When you play a ${silver.name}, +1 action.`,
        handles: e => e.card.name == silver.name,
        transform: (e, s, c)  => gainActions(1, c),
    }, {
        kind: 'play',
        text: `When you play a ${gold.name}, +1 buy.`,
        handles: e => e.card.name == gold.name,
        transform: (e, s, c) => doAll([gainBuys(1, c)]),
    }]
}
cardRewards.push(metalworker)

const exoticMarket:CardSpec = {
    name: 'Exotic Market',
    buyCost: coin(3),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
}
cardRewards.push(exoticMarket)

const queensCourt:CardSpec = {
    name: "Queen's Court",
    buyCost: coin(9),
    fixedCost: energy(2),
    effects: [{
        text: [`Do this three times: pay an action to play a card in your hand twice.`],
        transform: (s, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await payToDo(payAction(card), applyToTarget(
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
cardRewards.push(queensCourt)

const sculpt:CardSpec = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(
        target => doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]),
        'Discard a card in your hand to create two copies of it in your discard.',
        state => state.hand,
    )]
}
cardRewards.push(sculpt)

const tapestry:CardSpec = {
    name: 'Tapestry',
    buyCost:coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)]
}
cardRewards.push(tapestry)

const silverMine:CardSpec = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
}
cardRewards.push(silverMine)

const livery:CardSpec = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(3)],
    triggers: [{
        kind: 'afterBuy',
        text: `After buying a card other than ${copper.name}, create ${aOrNum(2, horse.name)} in your hand.`,
        handles: (e,s) => e.card.name != copper.name,
        transform: () => repeat(create(horse, 'hand'), 2)
    }]
}
cardRewards.push(livery)

const stables:CardSpec = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [actionsEffect(1), createEffect(horse, 'discard', 2)],
    buyCost: coin(2),
    staticTriggers: [buyTrigger({
        text: [`Pay all actions to create that many ${horse.name}s in your discard.`],
        transform: (s, c) => async function(state) {
            const n = state.actions
            state = await payCost({...free, actions:n}, c)(state)
            state = await repeat(create(horse), n)(state)
            return state
        }
    })]
}
cardRewards.push(stables)

const ritual:CardSpec = {
    name: 'Ritual',
    buyCost: coin(4),
    effects: [{
        text: [`Play then trash up to three cards from your hand.`,
                `Choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard.`],
        transform: (s, card) => async function(state) {
            const targets:Card[] = []
            function doCardPlayAndTrash(target:Card):Transform {
                return async function(state:State) {
                    state = await target.play(card)(state)
                    state = await trash(target)(state)
                    targets.push(target)
                    return state
                }
            }
            let cost:Cost = {...free, buys:1}
            for (let i = 0; i < 3; i++) {
                let target:Card|null; [state, target] = await choice(
                    state,
                    `Choose a card to play then trash (${3-i} remaining, $${cost.coin} total cost so far)`,
                    allowNull(state.hand.map(asChoice))
                )
                if (target === null) {
                    continue
                } else {
                    state = await target.play(card)(state)
                    state = await trash(target)(state)
                    cost = addCosts(cost, target.cost('buy', state))
                }
            }
            state = await applyToTarget(
                copyTarget => create(copyTarget.spec, 'discard'),
                'Choose a card to copy.',
                s => s.supply.filter(c => leq(
                    c.cost('buy', state), cost
                ))
            )(state)
            return state
        }
    }]
}
cardRewards.push(ritual)

const scepter:CardSpec = {
    name: 'Scepter',
    fixedCost: energy(2),
    buyCost: coin(5),
    effects: [{
        text: [`Pay an action to play a card in your hand three times then trash it.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
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
cardRewards.push(scepter)

const inn:CardSpec = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)],
    buyCost: coin(4),
    staticTriggers: [afterBuyTrigger(createEffect(horse, 'discard', 3))]
}
cardRewards.push(inn)


function magpieEffect(): Effect {
    return {
        text: [`Create a copy of this in your discard.`],
        transform: (s, c) => create(c.spec)
    }
}

const magpie:CardSpec = {
    name: 'Magpie',
    buyCost: coin(4),
    effects: [coinsEffect(2), magpieEffect()]
}
cardRewards.push(magpie)

const crown:CardSpec = {
    name: 'Crown',
    simpleText: [
        `Put a reflect token on a card in your hand.`,
        `The next time you play it, play it again.`
    ],
    buyCost: coin(3),
    effects: [targetedEffect(
        target => addToken(target, 'reflect'),
        'Put a reflect token on a card in your hand.',
        s => s.hand
    )],
    rules: [reflectRule],
}
cardRewards.push(crown)

const churnName = 'Churn'
const churn:CardSpec = {
    name: churnName,
    simpleText: [
        `Put two non-${churnName} cards from your discard to your hand.`,
        `Return one less card each time you play this.`
    ],
    effects: [actionsEffect(1), {
        text: [`For each charge token on this put a non-${churnName} card from your discard into your hand.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            let cards:Card[]; [state, cards] = await multichoice(state,
                `Choose ${num(n, 'card')} cards to put into your hand.`,
                state.discard.filter(c => c.name != churnName).map(asChoice), n
            )
            state = await moveMany(cards, 'hand')(state)
            return state
        }
    }, {
        text: [`Remove a charge token from this. Then if it has no charge tokens, trash it.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            }
            if (state.find(card).charge == 0) {
                state = await trash(card)(state)
            }
            return state
        }

    }],
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(churnName, 2)]
}
cardRewards.push(churn)

const bustlingVillage:CardSpec = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager), {
        text: [`+1 action for each card in play.`],
        transform: (state, card) => async function(state) {
            const n = state.play.length
            state = await gainActions(n, card)(state)
            return state
        }
    }]
}
cardRewards.push(bustlingVillage)

const governorName = 'Governor'
const governor:CardSpec = {
    name: governorName,
    buyCost: coin(5),
    relatedCards: [villager],
    effects: [actionsEffect(2), createInPlayEffect(villager)],
    staticTriggers: [{
        kind: 'buy',
        handles: (e, s) => (leq(coin(6), e.card.cost('buy', s))),
        text: `Whenever you buy a card costing $6 or more, put all ${governorName}s in your discard into your hand.`,
        transform: (e, s) => moveMany(s.discard.filter(card => card.name == governorName), 'hand')
    }]
}
cardRewards.push(governor)

const marketSquare:CardSpec = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
    buyCost: coin(2),
    staticTriggers: [afterBuyTrigger(createInPlayEffect(fair, 2))]
}
cardRewards.push(marketSquare)

const greatFeastName = 'Great Feast'
const greatFeast:CardSpec = {
    name: greatFeastName,
    buyCost: coin(10),
    effects: [{
        text: [`Do this three times: buy a card in the supply costing up to $8.`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await applyToTarget(
                    target => target.buy(card),
                    `Buy a card in the supply costing up to $8`,
                    s => s.supply.filter(
                        x => leq(x.cost('buy', s), coin(8))
                    )
                )(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
cardRewards.push(greatFeast)

const universityName = 'University'
const university:CardSpec = {
    name: universityName,
    buyCost: coin(10),
    effects: [actionsEffect(4), buysEffect(2)],
    staticReplacers: [{
        text: `${universityName} costs $1 less per action you have, but not less than $1.`,
        kind: 'cost',
        handles: p => (p.card.name == universityName) && p.actionKind == 'buy',
        replace: function(p, s) {
            const k = Math.max(Math.min(s.actions, p.cost.coin-1), 0)
            return {...p, cost: addCosts(p.cost, {coin: -k})}
        }
    }]
}
cardRewards.push(university)

const moon:CardSpec = {
    name: 'Moon',
    simpleText: [
        `The moon starts off full.`,
        `Whenever you would move this from play, it instead toggles between full and empty.`,
    ],
    replacers: [{
        text: `Whenever you would move this from play and this has no charge tokens on it,
               instead put a charge token on it (it becomes full).`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.skip == false && c.charge == 0,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([charge(c)])})
    }, {
        text: `Whenever you would move this from play and this has at least one charge token on it,
               instead remove all charge tokens from it (it becomes empty).`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.skip == false && c.charge > 0,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([discharge(c, c.charge)])})
    }]
}

const werewolf:CardSpec = {
    simpleText: [
        `+1 buy.`,
        `If there is a full moon, +$3.`,
        `Otherwise, +3 actions.`,
        `The moon starts off full and switches between full and empty each time you Refresh.`
    ],
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
        text: [`+1 buy.`,
            `If a ${moon.name} in play has an odd number of charge tokens (moon is full), +$3.`,
            `Otherwise, +3 actions.`],
        transform: (s, c) => (s.play.some(c => c.name == moon.name && c.charge % 2 == 1))
            ? doAll([gainBuys(1, c), gainCoins(3, c)])
            : doAll([gainBuys(1, c), gainActions(3, c)])
    }],
    staticTriggers: [{
        kind: 'gameStart',
        text: `At the start of the game, create ${a(moon.name)} in play with a charge token.`,
        handles: () => true,   
        transform: () => create(moon, 'play', card => charge(card, 1))
    }]
}
cardRewards.push(werewolf)

const embargo:CardSpec = {
    name: 'Embargo',
    replacers: [{
        text: `Cards cost $1 more to buy.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'buy',
        replace: p => ({...p, cost: addCosts(p.cost, coin(1))})
    }, {
        text: `Events costing at least $1 cost an additional $1 to buy.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'use' && p.cost.coin > 0,
        replace: p => ({...p, cost:addCosts(p.cost, coin(1))})
    }, trashOnLeavePlay()]
}

const contraband:CardSpec = {
    name: 'Contraband',
    buyCost: coin(4),
    simpleText: [
        `+$5 and +5 buys.`,
        `Create an Embargo in play that increases the cost of cards and events by $1 until it leaves play.`
    ],
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo],
}
cardRewards.push(contraband)
