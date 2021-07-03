import { text } from 'express';
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
  tick, a, num,
  createAndTrack,
  villager, fair,
  supplyForCard,
  actionsEffect, buyEffect, buysEffect, pointsEffect, createEffect,
  refreshEffect, recycleEffect, createInPlayEffect, chargeEffect,
  targetedEffect, workshopEffect,
  coinsEffect,
  reflectTrigger,
  energy, coin, repeat,
  costPer, incrementCost, costReduceNext,
  countNameTokens, nameHasToken,
  startsWithCharge,
  useRefresh, costReduce, applyToTarget,
  playTwice, payAction, sortHand, discardFromPlay,
  trashThis, fragileEcho,
  copper, gold, estate, duchy,
  dedupBy, countDistinctNames,
  playReplacer, trashOnLeavePlay
} from '../logic.js'

export const cards:CardSpec[] = [];
export const events:CardSpec[] = [];

/*
const necropolis:CardSpec = {name: 'Necropolis',
    effects: [villagerEffect()],
    relatedCards: [villager],
}
buyableAnd(necropolis, 2, {onBuy: [villagerEffect()]})
*/
const ghostTown:CardSpec = {name: 'Ghost Town',
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager]
}
cards.push(supplyForCard(ghostTown, coin(3), {onBuy: [actionsEffect(2)]}))


/*
const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
}
buyableFree(hound, 2)
*/
const transmogrify:CardSpec = {name: 'Transmogrify',
    effects: [{
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
cards.push(supplyForCard(transmogrify, coin(3)))

/*
const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effects: [actionEffect(3)],
}
buyable(smithy, 4)
*/
const Till = 'Till'
const till:CardSpec = {name: Till,
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
cards.push(supplyForCard(till, coin(3)))

const village:CardSpec = {name: 'Village',
    effects:  [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
}
cards.push(supplyForCard(village, coin(3)))

const bridge:CardSpec = {name: 'Bridge',
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce('buy', {coin:1}, true)]
}
cards.push(supplyForCard(bridge, coin(4)))

const conclave:CardSpec = {name: 'Conclave',
    replacers: [{
        text: `Cards cost @ less to play if they don't share a name
               with a card in your discard or in play.
               Whenever this reduces a cost, discard it and +$2.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && state.discard.concat(state.play).every(c => c.name != x.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoins(2)
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
cards.push(supplyForCard(conclave, coin(4)))

const lab:CardSpec = {name: 'Lab',
    effects: [actionsEffect(2)]
}
cards.push(supplyForCard(lab, coin(2)))

function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction, playTwice(card))
    }
}

export const throneRoom:CardSpec = {name: 'Throne Room',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [throneroomEffect()]
}
cards.push(throneRoom)

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    triggers: [{
        kind: 'play',
        text: `When you play a copper, +$1.`,
        handles: e => e.card.name == copper.name,
        transform: e => gainCoins(1),
    }]
}
cards.push(supplyForCard(coppersmith, coin(3)))

const Unearth = 'Unearth'
const unearth:CardSpec = {name: Unearth,
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(
            target => move(target, 'hand'),
            `Put a non-${Unearth} card from your discard into your hand.`,
            state => state.discard.filter(c => c.name != Unearth)
        )
    ]
}
cards.push(supplyForCard(unearth, coin(4)))

const celebration:CardSpec = {name: 'Celebration',
    fixedCost: energy(1),
    replacers: [costReduce('play', {energy:1})]
}
cards.push(supplyForCard(celebration, coin(8), {replacers: [{
    text: `Whenever you would create a ${celebration.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == celebration.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]}))

const plowName = 'Plow'
const plow:CardSpec = {name: plowName,
    fixedCost: energy(1),
    effects: [{
        text: [`Put your discard into your hand.`],
        transform: state => doAll([
            moveMany(state.discard, 'hand'),
            sortHand
        ])
    }, toPlay()],
    staticReplacers: [{
        kind: 'create',
        text: `Whenever you would create a ${plowName}, create it in play.`,
        handles: p => p.spec.name == plowName,
        replace: p => ({...p, zone:'play'})
    }]
}
cards.push(supplyForCard(plow, coin(4)))

const construction:CardSpec = {name: 'Construction',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    triggers: [{
        text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
        kind: 'cost',
        handles: (e) => e.cost.energy > 0,
        transform: e => doAll([
            gainActions(e.cost.energy),
            gainCoins(e.cost.energy),
            gainBuys(e.cost.energy)
        ])
    }]
}
cards.push(supplyForCard(construction, coin(5)))

const hallOfMirrors:CardSpec = {name: 'Hall of Mirrors',
    fixedCost: {...free, energy:1, coin:5},
    effects: [{
        text: ['Put a mirror token on each card in your hand.'],
        transform: (state:State, card:Card) =>
            doAll(state.hand.map(c => addToken(c, 'mirror')))
    }],
    staticTriggers: [reflectTrigger('mirror')],
}
events.push(hallOfMirrors)

/*
const restock:CardSpec = {name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), refreshEffect(5)],
}
registerEvent(restock)
*/

const escalate:CardSpec = {name: 'Escalate',
    fixedCost: energy(1),
    variableCosts: [costPer(coin(1))],
    effects: [
        chargeEffect(),
        {
            text: ['Put a cost token on this for each charge token on it.'],
            transform: (s:State, c:Card) => addToken(c, 'cost', s.find(c).charge)
        },
        useRefresh()
    ]
}
events.push(escalate)

/*
const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    restrictions: [{
        test: (card, state) => state.hand.length > 0
    }],
    effects: [{
        text: [`If you have no cards in your hand,
        put your discard into your hand.`],
        transform: () => async function(state) {
            if (state.hand.length == 0) {
                state = await moveMany(state.discard, 'hand')(state)
                state = sortHand(state)
            }
            return state
        }
    }]
}
registerEvent(perpetualMotion)

const scrapeBy:CardSpec = {name:'Scrape By',
    fixedCost: energy(2),
    effects: [refreshEffect(1)],
}
registerEvent(scrapeBy)
*/

const volley:CardSpec = {
    name: 'Volley',
    fixedCost: energy(1),
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
events.push(volley)


const parallelize:CardSpec = {name: 'Parallelize',
    fixedCost: {...free, coin:1, energy:1},
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
events.push(parallelize)

const reach:CardSpec = {name:'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
}
events.push(reach)

function costPerN(increment:Partial<Cost>, n:number): VariableCost {
    const extraStr:string = `${renderCost(increment, true)} for every ${n} cost tokens on this.`
    return {
        calculate: function(card:Card, state:State) {
            return multiplyCosts(
                increment,
                Math.floor(state.find(card).count('cost') / n)
            )
        },
        text: extraStr,
    }
}

const travelingFair:CardSpec = {name:'Traveling Fair',
    fixedCost: coin(1),
    variableCosts: [costPerN(coin(1), 10)],
    effects: [incrementCost(), buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
}
events.push(travelingFair)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: {...free, coin:6, energy:1},
    effects: [{
        text: ['Pay all $.', '+1 vp per $ paid.'],
        transform: () => async function(state) {
            const n = state.coin
            state = await payCost({...free, coin:n})(state)
            state = await gainPoints(n)(state)
            return state
        }
    }]
}
events.push(philanthropy)

const finance:CardSpec = {name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
}
events.push(finance)

/*
const Orchard = 'Orchard'
const orchard:CardSpec = {
    name: Orchard,
    effects: [targetedEffect(
        (target, card) => target.buy(card),
        `Buy ${a(Orchard)} in the supply.`,
        state => state.supply.filter(c => c.name == Orchard)
    )]
}
buyable(orchard, 2, {onBuy: [pointsEffect(1)]})
*/
const flowerMarket:CardSpec = {
    name: 'Flower Market',
    effects: [buyEffect(), pointsEffect(1)]
}
cards.push(supplyForCard(flowerMarket, coin(2), {onBuy: [pointsEffect(1)]}))


/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/

const vault:CardSpec = {name: 'Vault',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
    staticReplacers: [{
        text: `You can't lose actions, $, or buys (other than by paying costs).`,
        kind: 'resource',
        handles: p => p.amount < 0 && (
            p.resource == 'coin' ||
            p.resource == 'actions' ||
            p.resource == 'buys'
        ),
        replace: p => ({...p, amount:0})
    }]
}
events.push(vault)

/*
const coffers:CardSpec = {name: 'Coffers',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
	staticReplacers: [{
		text: `You can't lose $ (other than by paying costs).`,
		kind: 'resource',
		handles: p => p.amount < 0 && p.resource == 'coin',
		replace: p => ({...p, amount:0})
	}]
}
registerEvent(coffers)
*/

const vibrantCity:CardSpec = {name: 'Vibrant City',
    effects: [pointsEffect(1), actionsEffect(1)],
}
cards.push(supplyForCard(vibrantCity, coin(3)))

function chargeUpTo(max:number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontier:CardSpec = {name: 'Frontier',
    fixedCost: energy(1),
    buyCost: coin(7),
    effects: [{
        text: ['+1 vp per charge token on this.'],
        transform: (state, card) => gainPoints(state.find(card).charge, card)
    }, chargeEffect()]
}
cards.push(supplyForCard(
    frontier, coin(7), 
    {replacers: [startsWithCharge(frontier.name, 2)]}
))

const investment:CardSpec = {name: 'Investment',
    fixedCost: energy(0),
    effects: [{
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, chargeUpTo(6)]
}
cards.push(supplyForCard(investment, coin(4), {replacers: [startsWithCharge(investment.name, 2)]}))

//TODO check this
const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:2, energy:2},
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card the normal way,
        remove a charge token from this to buy up to 5 other cards
        with equal or lesser cost.`,
        handles: e => e.source.name == 'act',
        transform: (e, s, c) => payToDo(discharge(c, 1), async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 5 other cards to buy',
                state.supply.filter(target => 
                    leq(target.cost('buy', state), e.card.cost('buy', state))
                    && target.id != e.card.id
                ).map(asChoice), 5)
            for (const target of targets) {
                state = await target.buy(c)(state)
            }
            return state
        })
    }]
}
/*
const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:8, energy:2},
    effects: [{
        text: ['Buy up to 6 cards in the supply.'],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 6 cards to buy',
                state.supply.map(asChoice), 6)
            for (const target of targets) {
                state = await target.buy(card)(state)
            }
            return state
        }
    }]
}
*/
events.push(populate)

export const duplicate:CardSpec = {name: 'Duplicate',
    fixedCost: {...free, coin:4, energy:1},
    effects: [{
        text: [`Put a duplicate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'duplicate')))
    }],
    staticTriggers: [{
        text: `After buying a card with a duplicate token on it other than with this,
        remove a duplicate token from it to buy it again.`,
        kind:'afterBuy',
        handles: (e, state, card) => {
            if (e.source.name == card.name) return false
            const target:Card = state.find(e.card);
            return target.count('duplicate') > 0
        },
        transform: (e, state, card) =>
            payToDo(removeToken(e.card, 'duplicate'), e.card.buy(card))
    }]
}
events.push(duplicate)

const royalSeal:CardSpec = {name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair]
}
cards.push(supplyForCard(royalSeal, coin(5)))

const workshop:CardSpec = {name: 'Workshop',
    fixedCost: energy(0),
    effects: [workshopEffect(4)],
}
cards.push(supplyForCard(workshop, coin(4)))

const shippingLane:CardSpec = {name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `Whenever you buy a card,
            discard this to buy the card again.`,
        kind: 'buy',
        handles: (e, state, card) => state.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.buy(card)(state)
        }
    }]
}
cards.push(supplyForCard(shippingLane, coin(5)))

const factory:CardSpec = {name: 'Factory',
    fixedCost: energy(1),
    effects: [workshopEffect(6)],
}
cards.push(supplyForCard(factory, coin(3)))

const imitation:CardSpec = {name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => create(target.spec, 'hand'),
        'Choose a card in your hand. Create a copy of it in your hand.',
        state => state.hand,
    )]
}
cards.push(supplyForCard(imitation, coin(3)))

const feast:CardSpec = {name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect((target, card) => target.buy(card),
        'Buy a card in the supply costing up to $6.',
        state => state.supply.filter(x => leq(x.cost('buy', state), coin(6)))
    ), trashThis()]
}
cards.push(supplyForCard(feast, coin(3), {'onBuy': [buyEffect()]}))

/*
const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(5)),
    effects: [chargeEffect(), incrementCost()],
    replacers: [{
        text: `${refresh.name} costs @ less to play for each charge token on this.`,
        kind:'cost',
        handles: x => (x.card.name == refresh.name),
        replace: (x, state, card) =>
            ({...x, cost:subtractCost(x.cost, {energy:state.find(card).charge})})
    }]
}
registerEvent(mobilization)
*/

const toil:CardSpec = {name:'Toil',
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
}
events.push(toil)

const recycle:CardSpec = {name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
}
events.push(recycle)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    staticTriggers: [{
        text: `After playing a card with a twin token other than with this, play it again.`,
        kind: 'afterPlay',
        handles: (e, state, card) => (e.card.count('twin') > 0 && e.source.id != card.id),
        transform: (e, state, card) => e.card.play(card),
    }],
}
events.push(twin)

function literalOptions(xs:string[], keys:Key[]): Option<string>[] {
    return xs.map((x, i) => ({
        render: {kind:'string', string:x},
        hotkeyHint: {kind:'key', val:keys[i]},
        value:x
    }))
}

const researcher:CardSpec = {name: 'Researcher',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action for each charge token on this.`],
        transform: (state, card) => async function(state) {
            const n = state.find(card).charge
            state = await gainActions(n)(state)
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
    }, chargeEffect()]
}
cards.push(supplyForCard(researcher, coin(3), {replacers: [startsWithCharge(researcher.name, 3)]}))

/*
const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+1 action per charge token on this.'],
        transform: (state, card) => gainActions(state.find(card).charge, card)
    }, chargeEffect()]
}
buyable(youngSmith, 3, {replacers: [startsWithCharge(youngSmith.name, 2)]})

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+4 actions -1 per charge token on this.'],
        transform: (state, card) => gainActions(4 - state.find(card).charge, card),
    }, chargeEffect()]
}
buyable(oldSmith, 3)
*/
const lackeys:CardSpec = {name: 'Lackeys',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    relatedCards: [villager],
}
cards.push(supplyForCard(lackeys, coin(3), {onBuy:[createInPlayEffect(villager, 1)]}))

const goldMine:CardSpec = {name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [createEffect(gold, 'hand', 2)]
}
cards.push(supplyForCard(goldMine, coin(6)))

function fragile(card:Card):Trigger<MoveEvent> {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: x => x.card.id == card.id,
        transform: x => trash(x.card)
    }
}
function robust(card:Card):Replacer<MoveParams> {
    return {
        text: 'Whenever this would move, leave it in play instead.',
        kind: 'move',
        handles: x => (x.card.id == card.id && x.toZone != null && x.fromZone == 'play'),
        replace: x => ({...x, skip:true})
    }
}

const expedite: CardSpec = {
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
events.push(expedite)

function removeAllSupplyTokens(token:Token): Effect {
    return {
        text: [`Remove all ${token} tokens from cards in the supply.`],
        transform: (state, card) => doAll(state.supply.map(s => removeToken(s, token, 'all')))
    }
}

const synergy:CardSpec = {name: 'Synergy',
    fixedCost: {...free, coin:3, energy:1},
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
        handles: (e, state, card) => (e.source.id != card.id && e.card.count('synergy') > 0),
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
events.push(synergy)

const shelter:CardSpec = {name: 'Shelter',
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(
        target => addToken(target, 'shelter'),
        'Put a shelter token on a card.',
        state => state.play
    )],
    staticReplacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token from play,
               instead remove a shelter token from it.`,
        handles: (x, state) => x.fromZone == 'play'
            && x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x,
            skip:true, toZone:'play',
            effects:x.effects.concat([removeToken(x.card, 'shelter')])
        })
    }]
}
cards.push(shelter)

const market:CardSpec = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
}
cards.push(supplyForCard(market, coin(3)))

const focus:CardSpec = {name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(1)],
}
events.push(focus)

const sacrifice:CardSpec = {name: 'Sacrifice',
    effects: [actionsEffect(1), buyEffect(), targetedEffect(
        (target, card) => doAll([target.play(card), trash(target)]),
        'Play a card in your hand, then trash it.',
        state => state.hand)]
}
cards.push(supplyForCard(sacrifice, coin(3)))

const herbs:CardSpec = {name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
}
cards.push(supplyForCard(herbs, coin(2), {'onBuy': [buyEffect()]}))

const spices:CardSpec = {name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
}
cards.push(supplyForCard(spices, coin(5), {onBuy: [coinsEffect(4)]}))

const onslaught:CardSpec = {name: 'Onslaught',
    fixedCost: {...free, coin:3, energy:1},
	variableCosts: [costPer({coin:3})],
    effects: [incrementCost(), {
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
/*

    {
        text: [`Play any number of cards in your hand
        and discard the rest.`],
        transform: (state, card) => async function(state) {
            const cards:Card[] = state.hand
            state = await moveMany(cards, 'aside')(state)
            let options:Option<Card>[] = asNumberedChoices(cards)
            while (true) {
                let picked:Card|null; [state, picked] = await choice(state,
                    'Pick a card to play next.',
                    allowNull(options))
                if (picked == null) {
                    state = await moveMany(cards.filter(c => state.find(c).place == 'aside'), 'discard')(state)
                    return state
                } else {
                    const id = picked.id
                    options = options.filter(c => c.value.id != id)
                    state = await picked.play(card)(state)
                }
            }
        }
    }]
    */
}
events.push(onslaught)

//TODO: link these together, modules in general?

const colony:CardSpec = {name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(6)],
}
cards.push(supplyForCard(colony, coin(16)))

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
}
cards.push(supplyForCard(platinum, coin(8)))

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(6), buysEffect(2)]
}
cards.push(supplyForCard(greatSmithy, coin(6)))

const resume:CardSpec = {name: 'Resume',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
}
events.push(resume)

function KCEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand three times.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
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
    effects: [KCEffect()]
}
cards.push(supplyForCard(kingsCourt, coin(9)))

const gardens:CardSpec = {name: "Gardens",
    fixedCost: energy(1),
    effects: [{
        text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
        transform: (state, card) => gainPoints(
            Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length)/8),
            card
        )
    }]
}
cards.push(supplyForCard(gardens, coin(4)))

/*
const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [
        targetedEffect(
            target => removeToken(target, 'decay'),
            'Remove a decay token from a card.',
            s => s.hand.concat(s.play).concat(s.discard)
                       .filter(c => c.count('decay') > 0)
        )
    ],
    staticTriggers: [{
        text: `Whenever you move a card to your hand,
            if it has two or more decay tokens on it trash it,
            otherwise put a decay token on it.`,
        kind: 'move',
        handles: e => e.toZone == 'hand',
        transform: e => (e.card.count('decay') >= 2) ?
            trash(e.card) : addToken(e.card, 'decay')
    }]
}
events.push(decay)
*/
const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `After playing a card,
            remove a charge token from this.
            If you can't, put a decay token on the card.
            If it already had a decay token trash it instead.`,
        kind: 'afterPlay',
        handles: () => true,
        transform: (e, s, c) => payToDo(discharge(c, 1), noop,
            s.find(e.card).count('decay') > 0 ? trash(e.card) : addToken(e.card, 'decay'))
    }]
}
events.push(decay)

const reflect:CardSpec = {name: 'Reflect',
    fixedCost: coin(1),
    variableCosts: [costPer({coin:1})],
    effects: [incrementCost(), targetedEffect(
    	(target, card) => addToken(target, 'reflect'),
    	'Put a reflect token on a card in your hand',
    	state => state.hand
	)],
    staticTriggers: [reflectTrigger('reflect')],
}
events.push(reflect)

const replicate:CardSpec = {name: 'Replicate',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `After buying a card other than with this,
            remove a charge token from this to to buy the card again.`,
        kind: 'afterBuy',
        handles: (e, s, c) => s.find(c).charge > 0 && e.source.id != c.id,
        transform: (e, s, c) => payToDo(discharge(c, 1), e.card.buy(c))
    }]
}
events.push(replicate)

/*
const inflation:CardSpec = {name: 'Inflation',
    calculatedCost: costPlus(energy(3), energy(1)),
    effects: [incrementCost(), setCoinEffect(15), setBuyEffect(5)],
    staticReplacers: [{
        text: `All costs of $1 or more are increased by $1 per cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.cost.coin > 0,
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
registerEvent(inflation)
*/
const inflation:CardSpec = {name: 'Inflation',
    fixedCost: energy(5),
    effects: [{
    	text: [`Lose all $ and buys.`],
    	transform: () => doAll([setResource('coin', 0), setResource('buys', 0)])
    }, {
    	text: ['+$15, +5 buys.'],
    	transform: () => doAll([gainCoins(15), gainBuys(5)])
    }, incrementCost()],
    staticReplacers: [{
        text: `Cards cost $1 more to buy for each cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.actionKind == 'buy',
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
events.push(inflation)

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effects: [{
        text: ['Remove a burden token from each supply.'],
        transform: state => doAll(state.supply.map(c => removeToken(c, 'burden')))
    }],
    staticTriggers: [{
        text: 'Whenever you create a card, put a burden token on its supply.',
        kind:'create',
        handles: (e, state) => true,
        transform: (e, state) => doAll(state.supply.filter(
            c => c.name == e.card.name
        ).map(
            c => addToken(c, 'burden')
        ))
    }],
    staticReplacers: [{
        kind: 'costIncrease',
        text: 'Cards cost $2 more to buy for each burden token on them or their supply.',
        handles: (x, state) => (nameHasToken(x.card, 'burden', state)) && x.actionKind == 'buy',
        replace: (x, state) => ({...x, cost: addCosts(x.cost, {coin:2 * (countNameTokens(x.card, 'burden', state))})})
    }]
}
events.push(burden)

/*
const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionsEffect(3), coinsEffect(3)]
}
buyable(goldsmith, 7)
*/
const procession:CardSpec = {name: 'Procession',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay one action to play a card in your hand twice,
                then trash it and create a copy of a card in the supply
                costing exactly $1 or $2 more.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
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
    }]
}
cards.push(supplyForCard(procession, coin(5)))

const publicWorks:CardSpec = {name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
cards.push(publicWorks)

function singleMap<S, T>(s:S, t:T): Map<S, T> {
    const result = new Map()
    result.set(s, t)
    return result
}

const echo:CardSpec = {name: 'Echo',
    effects: [targetedEffect(
        (target, card) => async function(state) {
            let copy:Card|null; [copy, state] = await createAndTrack(target.spec, 'void', singleMap('echo', 1))(state)
            if (copy != null && state.find(copy).place == 'void') {
                state = await copy.play(card)(state)
            }
            return state
        },
        `Choose a card you have in play.
         Create a copy set aside with an echo token on it.
         Then play the card if it is still set aside.`,
        state => dedupBy(state.play, c => c.spec)
    )]
}
cards.push(supplyForCard(echo, coin(6), {replacers: [fragileEcho('echo')]}))

const tactic:CardSpec = {
    name: 'Tactic',
    ability:[{
        text: [`Trash this and pay an action
        to play a card from your hand three times.`],
        transform: (state, card) => payToDo(payCost({
            ...free, actions:1, effects:[trash(card)]
        }), applyToTarget(
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
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && (s.actions < 1),
    }],
    replacers: [trashOnLeavePlay()]
}

const mastermind:CardSpec = {
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    replacers: [{
        text: `Whenever you would move this to your hand, first create a ${tactic.name} in play.`,
        kind:'move',
        handles: (p, s, c) => p.toZone == 'hand' && p.card.id == c.id,
        replace: p => ({...p, effects: p.effects.concat([create(tactic, 'play')])}) 
    }],

}
cards.push(supplyForCard(mastermind, coin(6)))

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
    }]
}
cards.push(supplyForCard(recruitment, coin(3)))

const dragon:CardSpec = {name: 'Dragon',
    buyCost: coin(7),
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              coinsEffect(5), actionsEffect(3), buyEffect()]
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
    }]
}
cards.push(supplyForCard(hatchery, coin(3)))

const looter:CardSpec = {name: 'Looter',
    effects: [{
        text: [`Discard up to four cards from your hand for +1 action each.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to four cards to discard',
                state.hand.map(asChoice), 4)
            state = await moveMany(targets, 'discard')(state)
            state = await gainActions(targets.length)(state)
            return state
        }
    }]
}
cards.push(supplyForCard(looter, coin(4)))

const palace:CardSpec = {name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
}
cards.push(supplyForCard(palace, coin(5)))


const Innovation:string = 'Innovation'
const innovation:CardSpec = {name: Innovation,
    effects: [actionsEffect(1)],
    replacers: [playReplacer(
        `Whenever you would create a card in your discard,
        instead discard this to set the card aside.
        Then play it if it is still set aside.`,
        (p, s, c) => s.find(c).place == 'play',
        (p, s, c) => discardFromPlay(c),
    )]
}
cards.push(supplyForCard(innovation, coin(6)))

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
                    gainActions(2),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
cards.push(supplyForCard(formation, coin(4)))

const Traveler = 'Traveler'
const traveler:CardSpec = {
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay an action to play a card in your hand once for each charge token on this.`],
        transform: (state, card) => payToDo(payAction, applyToTarget(
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
    }, chargeUpTo(3)]
}
cards.push(supplyForCard(
    traveler, coin(7),
    {replacers:[startsWithCharge(traveler.name, 1)]}
))

const fountain:CardSpec = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [refreshEffect(5, false)],
}
cards.push(supplyForCard(fountain, coin(4)))

/*
const chameleon:CardSpec = {
    name:'Chameleon',
    replacers: [{
        text: `As long as this has a charge token on it,
        whenever you would gain $ instead gain that many actions and vice versa.`,
        kind: 'resource',
        handles: (x, state, card) => state.find(card).charge > 0 && x.amount > 0,
        replace: x => ({...x, resource:
            (x.resource == 'coin') ? 'actions' :
            (x.resource == 'actions') ? 'coin' :
            x.resource })
    }],
    effects: [{
        text: [`If this has a charge token on it, remove all charge tokens.
        Otherwise, put a charge token on it.`],
        transform: (state, card) => (state.find(card).charge > 0) ?
            uncharge(card) : charge(card, 1),
    }]
}
registerEvent(chameleon)
const ball:CardSpec = {
    name: 'Ball',
    fixedCost: {...free, energy:1, coin:1},
    effects: [chargeEffect()],
    triggers: [{
        text:`Whenever you buy a card,
              remove a charge token from this to buy a card of equal or lesser cost.`,
        kind:'buy',
        handles: (e, s, c) => s.find(c).charge > 0,
        transform: (e, s, c) => payToDo(
            discharge(c, 1),
            applyToTarget(
                target => target.buy(c),
                'Choose a card to buy.',
                state => state.supply.filter(option =>
                    leq(option.cost('buy', s), e.card.cost('buy', s))
                )
            )
        )
    }]
}
registerEvent(ball)
*/
const lostArts:CardSpec = {
    fixedCost: {...free, energy:1, coin:3},
    name: 'Lost Arts',
    effects: [targetedEffect(
        card => async function(state) {
            state = await addToken(card, 'art', 8)(state)
            for (const c of state.supply) {
                if (c.id != card.id) {
                    state = await removeToken(c, 'art', 'all')(state)
                }
            }
            return state
        },
        `Put eight art tokens on a card in the supply.
        Remove all art tokens from other cards in the supply.`,
        s => s.supply
    )],
    staticReplacers: [{
        text: `Cards cost @ less to play for each art token on their supply.
               Whenever this reduces a cost by one or more @,
               remove that many art tokens.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && nameHasToken(x.card, 'art', state),
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(
                x.cost.energy,
                countNameTokens(x.card, 'art', state)
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([repeat(
                    applyToTarget(
                        target => removeToken(target, 'art'),
                        'Remove an art token from a supply.',
                        state => state.supply.filter(
                            c => c.name == x.card.name && c.count('art') > 0
                        )
                    )
                    , reduction
                )])
            }}
        }
    }]
}
events.push(lostArts)

const grandMarket:CardSpec = {
    name: 'Grand Market',
    /*
    restrictions: [{
        text: `You can't buy this if you have any
        ${copper.name}s in your discard.`,
        test: (c:Card, s:State, k:ActionKind) => k == 'buy' &&
            s.discard.some(x => x.name == copper.name)
    }],
    */
    effects: [coinsEffect(2), actionsEffect(1), buyEffect()],
}
cards.push(supplyForCard(grandMarket, coin(5)))

/*
const greatHearth:CardSpec = {
    name: 'Great Hearth',
    effects: [actionEffect(1)],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, +1 action.`,
        kind: 'play',
        handles: e => e.card.name == estate.name,
        transform: (e, state, card) => gainActions(1, card)
    }]
}
buyable(greatHearth, 3)
*/
const Industry = 'Industry'
function industryTransform(n:number, except:string=Industry):Transform{
    return applyToTarget(
        target => target.buy(),
        `Buy a card in the supply costing up to $${n} not named ${except}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n)) && x.name != Industry
        )
    )
}
const industry:CardSpec = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
        text: [`Do this twice: buy a card in the supply costing up to $8 other than ${Industry}.`],
        transform: (state, card) => doAll([
            industryTransform(8, Industry),
            tick(card),
            industryTransform(8, Industry)
        ])
    }]
}
cards.push(supplyForCard(industry, coin(6)))

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [actionsEffect(1)],
    relatedCards: [villager],
    triggers: [{
        text: `Whenever you play ${a(estate.name)} or ${duchy.name},
               create ${a(villager.name)} in play.`,
        kind: 'play',
        handles: (e, state, card) => e.card.name == estate.name
            || e.card.name == duchy.name,
        transform: (e, state, card) => create(villager, 'play')
    }],
}
cards.push(supplyForCard(homesteading, coin(3)))

const duke:CardSpec = {
    name: 'Duke',
    effects: [],
    triggers: [{
        text: `Whenever you play ${a(duchy.name)}, +1 vp.`,
        kind: 'play',
        handles: e => e.card.name == duchy.name,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}
cards.push(supplyForCard(duke, coin(4)))

const carpenter:CardSpec = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }]
}
cards.push(supplyForCard(carpenter, coin(4)))

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

    }]
}
cards.push(supplyForCard(artificer, coin(3)))

const banquet:CardSpec = {
    name: 'Banquet',
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) =>
            k == 'activate' &&
            s.hand.some(c => c.count('neglect') > 0)
    }],
    effects: [coinsEffect(3), {
        text: ['Put a neglect token on each card in your hand.'],
        transform: state => doAll(state.hand.map(c => addToken(c, 'neglect'))),
    }],
    triggers: [{
        text: `Whenever a card moves, remove all neglect tokens from it.`,
        kind: 'move',
        handles: p => p.fromZone != p.toZone,
        transform: p => removeToken(p.card, 'neglect', 'all')

    }],
    replacers: [{
        text: `Whenever you'd move this to your hand, instead leave it in play.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone == 'hand',
        replace: (p, state, card) => ({...p, skip:true})
    }],
    ability:[{
        text: [`If you have no cards in your hand with neglect tokens on them,
        discard this for +$3.`],
        transform: (state, card) => payToDo(discardFromPlay(card), gainCoins(3))
    }]
}
cards.push(supplyForCard(banquet, coin(3)))


const harvest:CardSpec = {
    name:'Harvest',
    fixedCost: energy(1),
    effects: [{
        text: [`+1 action for each differently-named card in your hand.`],
        transform: state => async function(state) {
            const n = countDistinctNames(state.hand)
            state = await gainActions(n)(state)
            return state
        }
    },{
        text: [`+$1 for each differently-named card in your discard.`],
        transform: state => async function(state) {
            const n = countDistinctNames(state.discard)
            state = await gainCoins(n)(state)
            return state
        }
    } ]
}
cards.push(supplyForCard(harvest, coin(3)))

/*
const horseTraders:CardSpec = {
    name:'Horse Traders',
    fixedCost: energy(1),
    effects: [{
        text: ['If you have any actions, lose 1.'],
        transform: (state, card) => gainActions(-1, card)
    }, gainCoinEffect(4), buyEffect()]
}
buyable(horseTraders, 4)
*/

const secretChamber:CardSpec = {
    name: 'Secret Chamber',
    fixedCost: energy(1),
    effects: [{
        text: [`Discard any number of cards from your hand for +$1 each.`],
        transform: () => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Discard any number of cards for +$1 each.',
                state.hand.map(asChoice))
            state = await moveMany(targets, 'discard')(state)
            state = await gainCoins(targets.length)(state)
            return state
        }
    }]
}
cards.push(supplyForCard(secretChamber, coin(3)))


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
    }]
}
cards.push(supplyForCard(hireling, coin(2)))
/*
const hirelings:CardSpec = {
    name: 'Hirelings',
    effects: [buyEffect()],
    replacers: [{
        text: 'Whenever you would move this to your hand, instead +2 actions and +1 buy.',
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(2, c), gainBuys(1, c)
        ])})
    }]
}
buyable(hirelings, 3)
*/

function toPlay(): Effect {
    return {
        text: [`Put this in play.`],
        transform: (state, c) => move(c, 'play')
    }
}

//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
}
cards.push(supplyForCard(haggler, coin(5), {
    triggers: [{
        text: `After buying a card the normal way,
        buy an additional card for each ${haggler.name} in play.
        Each card you buy this way must cost at least $1 less than the previous one.`,
        kind: 'afterBuy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => async function(state) {
            let lastCard:Card = p.card
            let hagglers:Card[] = state.play.filter(c => c.name == haggler.name)
            while (true) {
                const haggler:Card|undefined = hagglers.shift()
                if (haggler === undefined) {
                    return state
                }
                state = state.startTicker(haggler)
                lastCard = state.find(lastCard)
                let target:Card|null; [state, target] = await choice(state,
                    `Choose a cheaper card than ${lastCard.name} to buy.`,
                     state.supply.filter(c => leq(
                        addCosts(c.cost('buy', state), {coin:1}),
                        lastCard.cost('buy', state)
                    )).map(asChoice)
                )
                if (target !== null) {
                    lastCard = target
                    state = await target.buy(card)(state)
                }
                state = state.endTicker(haggler)
                hagglers = hagglers.filter(c => state.find(c).place=='play')
            }
        }
    }]
}))
/*
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `Whenever you buy a card the normal way,
        buy a card in the supply costing at least $1 less.`,
        kind: 'buy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => applyToTarget(
            target => target.buy(card),
            "Choose a cheaper card to buy.",
            s => s.supply.filter(
                c => leq(
                    addCosts(c.cost('buy', s), {coin:1}),
                    p.card.cost('buy', s)
                )
            )
        )
    }]
}
buyable(haggler, 6)
*/

const reuse:CardSpec = {
    name: 'Reuse',
    fixedCost: energy(2),
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
events.push(reuse)

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
        transform: e => doAll([removeToken(e.card, 'polish'), gainCoins(1)])
    }]
}
events.push(polish)

const mire:CardSpec = {
    name: 'Mire',
    fixedCost: energy(4),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }],
    staticTriggers: [{
        text: `Whenever a card leaves your hand, put a mire token on it.`,
        kind: 'move',
        handles: (e, state) => e.fromZone == 'hand',
        transform: e => addToken(e.card, 'mire'),
    }],
    staticReplacers: [{
        text: `Cards with mire tokens can't move to your hand.`,
        kind: 'move',
        handles: x => (x.toZone == 'hand') && x.card.count('mire') > 0,
        replace: x => ({...x, skip:true})
    }]
}
events.push(mire)

const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: coin(1),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager)],
}
/*
const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay all $.`, `Put a charge token on this for each $ paid.`],
        transform: (state, card) => async function(state) {
            const n = state.coin
            state = await payCost({...free, coin:n})(state)
            state = await charge(card, n)(state)
            return state
        }
    }],
    staticReplacers: [chargeVillage()]
}
*/
events.push(commerce)

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
    staticReplacers: [fragileEcho('echo')]
}
events.push(reverberate)

/*
const preparations:CardSpec = {
    name: 'Preparations',
    fixedCost: energy(1),
    effects: [],
    replacers: [{
        text: `When you would move this to your hand,
            instead move it to your discard and gain +1 buy, +$2, and +3 actions.`,
        kind: 'move',
        handles: (p, state, card) => (p.card.id == card.id && p.toZone == 'hand'),
        replace: p => ({...p,
            toZone:'discard',
            effects:p.effects.concat([gainBuys(1), gainCoin(2), gainActions(3)])
        })
    }]
}
buyable(preparations, 3)
*/

const turnpike:CardSpec = {
    name: 'Turnpike',
    fixedCost: energy(2),
    effects: [],
    triggers: [{
        kind:'play',
        text: `Whenever you play a card, put a charge token on this.
        If it has two charge tokens, remove them for +1vp.`,
        handles: () => true,
        transform: (e, state, card) => doAll([
            charge(card, 1),
            payToDo(discharge(card, 2), gainPoints(1))
        ])
    }]
}
cards.push(supplyForCard(turnpike, coin(5)))

const highway:CardSpec = {
    name: 'Highway',
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', {coin:1}, true)],
}
cards.push(supplyForCard(highway, coin(6), {replacers: [{
    text: `Whenever you would create a ${highway.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == highway.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]}))

const prioritize:CardSpec = {
    name: 'Prioritize',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        card => addToken(card, 'priority', 6),
        'Put six priority tokens on a card in the supply.',
        state => state.supply,
    )],
    staticReplacers: [playReplacer(
        `Whenever you would create a card in your discard
        whose supply has a priority token,
        instead remove a priority token to set the card aside.
        Then play it if it is still set aside.`,
        (p, s, c) => nameHasToken(p.spec, 'priority', s),
        (p, s, c) => applyToTarget(
            t => removeToken(t, 'priority', 1, true),
            'Remove a priority token.',
            state => state.supply.filter(t => t.name == p.spec.name)
        )
    )]
}
events.push(prioritize)

const composting:CardSpec = {
    name: 'Composting',
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
    }]
}
cards.push(supplyForCard(composting, coin(3)))

const FairyGold = 'Fairy Gold'
const fairyGold:CardSpec = {
    name: FairyGold,
    effects: [buyEffect(), {
        text: [`+$1 per charge token on this.`],
        transform: (state, card) => gainCoins(state.find(card).charge),
    }, {
        text: [`Remove a charge token from this. If you can't, trash it.`],
        transform: (state, card) => async function(state) {
            if (state.find(card).charge > 0) {
                state = await discharge(card, 1)(state)
            } else {
                state = await trash(card)(state)
            }
            return state
        }

    }],
}
cards.push(supplyForCard(fairyGold, coin(3), {
    replacers: [startsWithCharge(fairyGold.name, 3)]
}))

const pathfinding:CardSpec = {
    name: 'Pathfinding',
    fixedCost: coin(6),
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(
        target => addToken(target, 'pathfinding'),
        `Put a pathfinding token on a card in the supply other than Copper.`,
        state => state.supply.filter(target => target.name != copper.name)
    )],
    staticTriggers: [{
        kind: 'play',
        text: `Whenever you play a card whose supply
        has a  pathfinding token on it, +1 action.`,
        handles: (e, state) => nameHasToken(e.card, 'pathfinding', state),
        transform: (e, state, card) => gainActions(1, card)
    }]
}
events.push(pathfinding)

const fortuneName = 'Fortune'
const fortune:CardSpec = {
    name: fortuneName,
    effects: [{
        text: [`Double your $.`],
        transform: (state, card) => gainCoins(state.coin)
    }, {
        text: [`Double your buys.`],
        transform: (state, card) => gainBuys(state.buys)
    }],
    staticTriggers: [{
        kind: 'create',
        text: `Whenever you create ${a(fortuneName)}, trash this from the supply.`,
        handles: e => e.card.name == fortuneName,
        transform: (e, s, c) => trash(c),        
    }]
}
cards.push(supplyForCard(fortune, coin(12)))
//cards.push(supplyForCard(fortune, coin(12), {afterBuy: [{text: ['trash it from the supply.'], transform: (s, c) => trash(c)}]}))

