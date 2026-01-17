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
  useRefresh, costReduce, reducedCost, applyToTarget,
  playTwice, payAction, sortHand, discardFromPlay,
  trashThis, fragileEcho,
  copper, gold, silver, estate, duchy, province,
  dedupBy, countDistinctNames,
  playReplacer, trashOnLeavePlay, stayInPlay,
  sourceHasName, Source,
  VPMode, cannotUse, renderCostOrZero
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
    simpleText: `Trash a card in your hand. Create a card in your hand costing up to $2 more than it.`,
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
cards.push(supplyForCard(till, coin(5)))

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
                    gainCoins(2, card)
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
// cards.push(supplyForCard(conclave, coin(3))) // removed

const lab:CardSpec = {name: 'Lab',
    effects: [actionsEffect(3)]
}
cards.push(supplyForCard(lab, coin(3)))

function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction(card), playTwice(card))
    }
}

export const throneRoom:CardSpec = {name: 'Throne Room',
    simpleText: `Pay an action to play a card in your hand twice without paying any @ costs.`,
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [throneroomEffect()]
}
cards.push(throneRoom)

const coppersmith:CardSpec = {name: 'Coppersmith',
    fixedCost: energy(1),
    effects: [buysEffect(1)],
    triggers: [{
        kind: 'play',
        text: `When you play a copper, +$1.`,
        handles: e => e.card.name == copper.name,
        transform: (e, s, c) => gainCoins(1, c),
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
    simpleText: `Cards cost @ less to play. When you create this, put it directly into play.`,
    fixedCost: energy(1),
    replacers: [costReduce('play', {energy:1})]
}
cards.push(supplyForCard(celebration, coin(6), {replacers: [{
    text: `Whenever you would create a ${celebration.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == celebration.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]}))

const plowName = 'Plow'
const plow:CardSpec = {name: plowName,
    simpleText: `Put your discard into your hand. ${plowName} goes to play instead of your discard when bought or created.`,
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
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
        transform: (e, s, c) => doAll([
            gainActions(e.cost.energy, c),
            gainCoins(e.cost.energy, c),
            gainBuys(e.cost.energy, c)
        ])
    }]
}
cards.push(supplyForCard(construction, coin(4)))

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
    simpleText: `Use Refresh. This costs more to play each time you use it ($0, $1, $3, $6, $10...).`,
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
// events.push(escalate) // removed (boon)

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
    simpleText: `Play then trash any number of cards in your hand.`,
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
    simpleText: `Put a parallelize token on each card in your hand. Cards cost @ less to play for each parallelize token on them.`,
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
    variableCosts: [costPerN(coin(1), 5)],
    effects: [incrementCost(), buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
}
// events.push(travelingFair) // removed (boon)

const philanthropy:CardSpec = {name: 'Philanthropy',
    fixedCost: coin(10),
    effects: [{
        text: ['Pay all $.', '+1 vp per $ paid.'],
        transform: (s, c) => async function(state) {
            const n = state.coin
            state = await payCost({...free,  coin:n}, c)(state)
            state = await gainPoints(n, c)(state)
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
const flowerMarketCard:CardSpec = {
    name: 'Flower Market',
    buyCost: coin(2),
    effects: [buyEffect(), pointsEffect(1)]
}
const flowerMarket = supplyForCard(
    flowerMarketCard, coin(2),
    {onBuy: [pointsEffect(1)]}
)

/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/

const vault:CardSpec = {name: 'Vault',
    restrictions: [cannotUse],
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
//events.push(vault)

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
    effects: [pointsEffect(2), actionsEffect(1)],
}
// cards.push(supplyForCard(vibrantCity, coin(5))) // removed (vp)

function chargeUpTo(max:number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

const frontierCard:CardSpec = {name: 'Frontier',
    simpleText: `+2 vp. This increases by 1vp each time you play it, up to +6vp.`,
    buyCost: coin(4),
    effects: [{
        text: ['+1 vp per charge token on this.'],
        transform: (state, card) => gainPoints(state.find(card).charge, card)
    }, chargeUpTo(6)]
}
const frontier:CardSpec = supplyForCard(
    frontierCard, coin(4),
    {replacers: [startsWithCharge(frontierCard.name, 2)]}
)

const investment:CardSpec = {name: 'Investment',
    simpleText: `+$2. This increases by $1 each time you play it, up to +$6.`,
    fixedCost: energy(0),
    effects: [{
        text: ['+$1 per charge token on this.'],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
    }, chargeUpTo(6)]
}
cards.push(supplyForCard(investment, coin(4), {replacers: [startsWithCharge(investment.name, 2)]}))

/*
const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:2, energy:2},
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card the normal way,
        remove a charge token from this to buy up to 4 other cards
        with equal or lesser cost.`,
        handles: e => e.source == 'act',
        transform: (e, s, c) => payToDo(discharge(c, 1), async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 4 other cards to buy',
                state.supply.filter(target => 
                    leq(target.cost('buy', state), e.card.cost('buy', state))
                    && target.id != e.card.id
                ).map(asChoice), 4)
            for (const target of targets) {
                state = await target.buy(c)(state)
            }
            return state
        })
    }]
}
*/
const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:8, energy:2},
    effects: [{
        text: ['Buy up to 5 cards in the supply each costing up to $8.'],
        transform: (s, card) => async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 5 cards to buy',
                state.supply.filter(target => leq(target.cost('buy', state), coin(8))).map(asChoice), 5)
            for (const target of targets) {
                state = await target.buy(card)(state)
            }
            return state
        }
    }]
}
// events.push(populate) // removed (boon)

export const duplicate:CardSpec = {name: 'Duplicate',
    simpleText: `For each card in the supply, the next time you buy that card buy it again for free.`,
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
            if (sourceHasName(e.source, card.name)) return false
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

const workshopName = 'Workshop'
const workshop:CardSpec = {name: workshopName,
    fixedCost: energy(0),
    effects: [workshopEffect(4, workshopName)],
}
cards.push(supplyForCard(workshop, coin(3)))

const shippingLane:CardSpec = {name: 'Shipping Lane',
    simpleText: `+$2. The next time you buy a card, buy it again for free.`,
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
cards.push(supplyForCard(shippingLane, coin(3)))

const factoryName = 'Factory'
const factory:CardSpec = {name: factoryName,
    fixedCost: energy(1),
    effects: [workshopEffect(6, factoryName)],
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
// events.push(recycle) // removed (boon)

const twin:CardSpec = {name: 'Twin',
    fixedCost: {...free, energy:1, coin:3},
    simpleText: `Put a twin token on a card in your hand. Whenever you play it other than with this effect, play it again.`,
    effects: [targetedEffect(
        target => addToken(target, 'twin'),
        'Put a twin token on a card in your hand.',
        state => state.hand)],
    staticTriggers: [{
        text: `After playing a card with a twin token other than with this, play it again.`,
        kind: 'afterPlay',
        handles: (e, state, card) => (e.card.count('twin') > 0 && !sourceHasName(e.source, card.name)),
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
    simpleText: `+3 actions. This increases by +1 action each time you play it.`,
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
    }, chargeEffect()]
}
cards.push(supplyForCard(researcher, coin(4), {replacers: [startsWithCharge(researcher.name, 3)]}))

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
    effects: [actionsEffect(4)],
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
    simpleText: `The next time you create a card, play it immediately.`,
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
    simpleText: `Put synergy tokens on two cards in the supply. Whenever you buy the more expensive one (or eithe if they are tied), you can buy the other one for free.`,
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
        handles: (e, state, card) => (!sourceHasName(e.source, card.name) && e.card.count('synergy') > 0),
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
// cards.push(shelter) // removed

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
// cards.push(supplyForCard(sacrifice, coin(3))) // removed

const herbs:CardSpec = {name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
}
cards.push(supplyForCard(herbs, coin(2), {'onBuy': [buyEffect()]}))

const spices:CardSpec = {name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
}
cards.push(supplyForCard(spices, coin(5), {onBuy: [coinsEffect(4)]}))

const onslaught:CardSpec = {name: 'Onslaught',
    fixedCost: {...free, coin:4, energy:1},
    simpleText: `Play any number of cards in your hand.`,
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
// cards.push(supplyForCard(colony, coin(16))) // removed

const platinum:CardSpec = {name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
}
cards.push(supplyForCard(platinum, coin(8)))

const greatSmithy:CardSpec = {name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(8), buysEffect(2)]
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
    effects: [KCEffect()]
}
cards.push(supplyForCard(kingsCourt, coin(9)))

const gardens:CardSpec = {name: "Gardens",
    effects: [{
        text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
        transform: (state, card) => gainPoints(
            Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length)/8),
            card
        )
    }]
}
// cards.push(supplyForCard(gardens, coin(4))) // removed (vp)

const territoryName = 'Territory'
const territory:CardSpec = {
    simpleText: `+2 vp. Leave this in your hand when you play it.`,
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2)],
    staticReplacers: [{
        kind: 'move',
        text: `When you play a ${territoryName} from your hand, leave it there.`,
        handles: p => p.card.name == territoryName && p.toZone == 'resolving' && p.fromZone == 'hand',
        replace: p => ({...p, skip: true})
    }]
}
cards.push(territory)

const farmlandName = 'Farmland'
const farmland:CardSpec = {
    simpleText: `+7 vp if you played this the normal way from your hand.`,
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
        kind: 'play',
        text: `Whenever you play a ${farmlandName} the normal way, +7 vp.`,
        handles: e => e.source == 'act' && e.card.name == farmlandName,
        transform: (e, s, c) => gainPoints(7, c)
    }],
}
cards.push(farmland)

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
/*
const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `When you play a card from your hand,
            remove a charge token from this.
            If you can't, put a decay token on the card.`,
        kind: 'play',
        handles: function (e) {
          const place =  e.card.place
          return place == 'hand'
        },
        transform: (e, s, c) => payToDo(discharge(c, 1), noop, addToken(e.card, 'decay'))
    }],
    staticReplacers: [{
        text: `Whenever a card with two or more decay tokens would move to your hand or discard,
               trash it instead.`,
        kind: 'move',
        handles: (p, state) => state.find(p.card).count('decay') > 1
            && (p.toZone == 'hand' || p.toZone == 'discard'),
        replace: p => ({...p, toZone: 'void'})
    }]
}
events.push(decay)
*/
const decay:CardSpec = {
    name: 'Decay',
    restrictions: [cannotUse],
    staticTriggers: [{
        text: `When you play a card with fewer than two decay tokens on it the normal way, put a decay token on it.`,
        kind: 'play',
        handles: e => e.card.count('decay') < 2 && e.source == 'act',
        transform: (e, s, c) => addToken(e.card, 'decay'),
    }],
    staticReplacers: [{
        kind: 'costIncrease',
        text: `Cards with two or more decay tokens on them cost an additional $1 to play,`,
        handles: e => e.actionKind == 'play' && e.card.count('decay') >= 2,
        replace: p => ({...p, cost:addCosts(p.cost, coin(1))})
    }] 
}
// events.push(decay) // removed (curse)

const reflect:CardSpec = {name: 'Reflect',
    simpleText: `Put a reflect token on a card in your hand. The next time you play that card, play it twice. This costs $1 more each time you use it.`,
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
    simpleText: `The next time you buy a card, buy it again.`,
    staticTriggers: [{
        text: `After buying a card other than with this,
            remove a charge token from this to to buy the card again.`,
        kind: 'afterBuy',
        handles: (e, s, c) => s.find(c).charge > 0 && !sourceHasName(e.source, c.name),
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
    	transform: (s, c) => doAll([setResource('coin', 0, c), setResource('buys', 0, c)])
    }, {
    	text: ['+$15, +5 buys.'],
    	transform: (s, c) => doAll([gainCoins(15, c), gainBuys(5, c)])
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
// events.push(burden) // removed (curse)

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
    }]
}
cards.push(supplyForCard(procession, coin(3)))

const publicWorks:CardSpec = {name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', {energy:1}, true)],
}
//cards.push(publicWorks)

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
         Then play the card if it is set aside.`,
        state => dedupBy(state.play, c => c.spec)
    )]
}
// cards.push(supplyForCard(echo, coin(6), {replacers: [fragileEcho('echo')]})) // removed

/*
const tactic:CardSpec = {
    name: 'Tactic',
    ability:[{
        text: [`Trash this and pay an action
        to play a card from your hand three times.`],
        transform: (state, card) => payToDo(payCost({
            ...free, actions:1, effects:[trash(card)]
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
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && (s.actions < 1),
    }],
    replacers: [stayInPlay()]
}

const mastermind:CardSpec = {
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    replacers: [{
        text: `When you move this to your hand, create a ${tactic.name} in play.`,
        kind:'move',
        handles: (p, s, c) => p.toZone == 'hand' && p.card.id == c.id,
        replace: p => ({...p, effects: p.effects.concat([create(tactic, 'play')])}) 
    }],

}
cards.push(supplyForCard(mastermind, coin(6)))
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
    simpleText: `Create a ${tactic.name} in play. Whenever it would move to your hand it gains a charge token instead. Once it has a charge token, you can trash it and pay an action to play a card in your hand three times.`,
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    effects: [createInPlayEffect(tactic)]
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
    }]
}
cards.push(supplyForCard(hatchery, coin(4)))

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
    }]
}
cards.push(supplyForCard(looter, coin(4)))

const  palace:CardSpec = {name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
}
// cards.push(supplyForCard(palace, coin(5))) // removed (vp)


const Innovation:string = 'Innovation'
const innovation:CardSpec = {name: Innovation,
    simpleText: `The next time you create a card in your discard, play it immediately.`,
    effects: [actionsEffect(1)],
    replacers: [playReplacer(
        `Whenever you would create a card in your discard,
        instead discard this to set the card aside.
        Then play it if it is still set aside.`,
        (p, s, c) => s.find(c).place == 'play',
        (p, s, c) => discardFromPlay(c),
    )]
}
cards.push(supplyForCard(innovation, coin(3)))

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
    }]
}
cards.push(supplyForCard(formation, coin(3)))

const Traveler = 'Traveler'
const traveler:CardSpec = {
    simpleText: `Pay an action to play a card in your hand once for each charge token on this. It starts with 1 charge token and gains 1 each time you play it, up to 3.`,
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
    }, chargeUpTo(3)]
}
cards.push(supplyForCard(
    traveler, coin(6),
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
    simpleText: `Choose a card in the supply and put 8 art tokens on it. Whenever you play a card with art tokens on its supply, remove art tokens instead of paying @.`,
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
    effects: [actionsEffect(1), coinsEffect(2), buysEffect(2)],
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
    }]
}
cards.push(supplyForCard(industry, coin(6)))

const homesteading:CardSpec = {
    name: 'Homesteading',
    effects: [createInPlayEffect(villager)],
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
// cards.push(supplyForCard(homesteading, coin(3))) // removed

const duke:CardSpec = {
    name: 'Duke',
    buyCost: coin(4),
    effects: [],
    triggers: [{
        text: `Whenever you play ${a(duchy.name)}, +1 vp.`,
        kind: 'play',
        handles: e => e.card.name == duchy.name,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}
// cards.push(supplyForCard(duke, coin(4))) // removed (vp)

const carpenter:CardSpec = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
        text: [`+1 action per card in play.`],
        transform: (state, card) => gainActions(state.play.length, card)
    }]
}
// cards.push(supplyForCard(carpenter, coin(4))) // removed

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

/*
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
cards.push(supplyForCard(banquet, coin(4)))
*/
const banquet:CardSpec = {
    name: 'Banquet',
    buyCost: coin(3),
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && s.hand.length > 0
    }],
    effects: [{
        text: [`If you have three or more cards in your hand, +$3.`],
        transform: (state, c) => (state.hand.length >= 3) ? gainCoins(3, c) : noop
    }],
    replacers: [{
        text: `Whenever you'd move this to your hand, instead leave it in play.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone == 'hand',
        replace: (p, state, card) => ({...p, skip:true})
    }],
    ability: [{
        text: [`If you have no cards in your hand, discard this for +$3.`],
        transform: (state, card) => payToDo(discardFromPlay(card), gainCoins(3, card))
    }]
    
}
cards.push(banquet)


const harvest:CardSpec = {
    name:'Harvest',
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
    } ]
}
cards.push(supplyForCard(harvest, coin(4)))

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
    }]
}
cards.push(supplyForCard(secretChamber, coin(3)))


const hireling:CardSpec = {
    name: 'Hireling',
    relatedCards: [fair, villager],
    effects: [],
    replacers: [{
        text: `Whenever you would move this to your hand,
               instead +1 action, +1 buy, +$1, and create a ${fair.name} and a ${villager.name} in play.`,
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play'), create(villager, 'play')
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
cards.push(supplyForCard(haggler, coin(3), {
    triggers: [{
        text: `After buying a card the normal way,
        buy an additional card for each ${haggler.name} in play.
        Each card you buy this way must cost at least $1 less than the previous one.`,
        kind: 'afterBuy',
        handles: p => p.source == 'act',
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
    simpleText: `Play any number of cards in your discard that don't have a reuse token on them. Put a reuse token on each card played this way.`,
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
// events.push(reuse) // removed (boon)

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
events.push(polish)

const mire:CardSpec = {
    name: 'Mire',
    fixedCost: energy(3),
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
// events.push(mire) // removed (curse)

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
            payToDo(discharge(card, 2), gainPoints(1, card))
        ])
    }]
}
// cards.push(supplyForCard(turnpike, coin(5))) // removed

const highway:CardSpec = {
    name: 'Highway',
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', {coin:1}, true)],
}
cards.push(supplyForCard(highway, coin(5), {replacers: [{
    text: `Whenever you would create a ${highway.name} in your discard,
    instead create it in play.`,
    kind:'create',
    handles: p => p.spec.name == highway.name && p.zone == 'discard',
    replace: p => ({...p, zone:'play'})
}]}))

const prioritize:CardSpec = {
    simpleText: `Choose a supply. The next 5 times you create a card from that supply, play it immediately.`,
    name: 'Prioritize',
    fixedCost: {...free, energy:1, coin:3},
    effects: [targetedEffect(
        card => addToken(card, 'priority', 5),
        'Put five priority tokens on a card in the supply.',
        state => state.supply,
    )],
    staticReplacers: [playReplacer(
        `Whenever you would create a card in your discard
        whose supply has a priority token,
        instead remove a priority token and set the card aside.
        Then play it if it is still set aside.`,
        (p, s, c) => nameHasToken(p.spec, 'priority', s),
        (p, s, c) => applyToTarget(
            t => removeToken(t, 'priority', 1, true),
            'Remove a priority token.',
            state => state.supply.filter(t => t.name == p.spec.name)
        )
    )]
}
// events.push(prioritize) // removed (boon)

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
// cards.push(supplyForCard(composting, coin(3))) // removed

const FairyGold = 'Fairy Gold'
const fairyGold:CardSpec = {
    simpleText: `+$3 and +1 buy. This decreases by $1 each time you play it.`,
    name: FairyGold,
    effects: [buyEffect(), {
        text: [`+$1 per charge token on this.`],
        transform: (state, card) => gainCoins(state.find(card).charge, card),
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
}
cards.push(supplyForCard(fairyGold, coin(3), {
    replacers: [startsWithCharge(fairyGold.name, 3)]
}))

const pathfinding:CardSpec = {
    name: 'Pathfinding',
    fixedCost: coin(6),
    effects: [targetedEffect(
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
// events.push(pathfinding) // removed

const fortuneName = 'Fortune'
const fortune:CardSpec = {
    simpleText: `Double your $ and buys. You can only buy Fortune once.`,
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
    }]
}
cards.push(supplyForCard(fortune, coin(12)))
//cards.push(supplyForCard(fortune, coin(12), {afterBuy: [{text: ['trash it from the supply.'], transform: (s, c) => trash(c)}]}))

// ========== CARDS MOVED FROM EXPANSION ==========

const horse:CardSpec = {
    name: 'Horse',
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
}

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

const logisticsToken:Token = 'logistics'
const logistics:CardSpec = {
    name: 'Logistics',
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [{
        text: [`Put a ${logisticsToken} token on each supply.`],
        transform: s => doAll(s.events.map(e => addToken(e, 'logistics')))
    }],
    staticReplacers: [{
        text: `Events cost @ less for each logistics token on them but not zero. Whenever this reduces a cost, remove a logistics token.`,
        kind: 'cost',
        handles: p => (p.actionKind == 'use' && p.card.count('logistics') > 0),
        replace: (p, state) => {
            const card = state.find(p.card)
            const maxReduction = (p.cost.coin > 0) ? p.cost.energy : p.cost.energy - 1
            const reduction = Math.max(Math.min(maxReduction, card.count('logistics')), 0)
            return {...p, cost:{...p.cost,
                energy:p.cost.energy-reduction,
                effects:p.cost.effects.concat([removeToken(card, 'logistics', reduction)])
            }}
        }
    }]
}
cards.push(logistics)

const harrowName = 'Harrow'
const harrow:CardSpec = {
    name: harrowName,
    buyCost: coin(4),
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
cards.push(harrow)

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
        transform: (e, s, c)  => gainActions(1, c),
    }, {
        kind: 'play',
        text: `When you play a ${gold.name}, +1 buy.`,
        handles: e => e.card.name == gold.name,
        transform: (e, s, c) => doAll([gainBuys(1, c)]),
    }]
}
cards.push(metalworker)

const exoticMarket:CardSpec = {
    name: 'Exotic Market',
    buyCost: coin(4),
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
cards.push(queensCourt)

const sculpt:CardSpec = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(
        target => doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]),
        'Discard a card in your hand to create two copies of it in your discard.',
        state => state.hand,
    )]
}
cards.push(sculpt)

const tapestry:CardSpec = {
    name: 'Tapestry',
    buyCost:coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)]
}
cards.push(tapestry)

const silverMine:CardSpec = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
}
cards.push(silverMine)

const livery:CardSpec = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(3)],
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
    transform: (s, c) => async function(state) {
        const n = state.actions
        state = await payCost({...free, actions:n}, c)(state)
        state = await repeat(create(horse), n)(state)
        return state
    }
}]}))

const ritual:CardSpec = {
    name: 'Ritual',
    buyCost: coin(4),
    effects: [{
        text: [`Play then trash two cards from your hand.`,
                `If you do, choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard.`],
        transform: (s, card) => async function(state) {
            let target1:Card|null; [state, target1] = await choice(
                state,
                'Choose a card to play then trash.',
                state.hand.map(asChoice)
            )
            if (target1 == null) return state
            state = await target1.play(card)(state)
            state = await trash(target1)(state)
            let target2:Card|null; [state, target2] = await choice(
                state,
                `Choose a second card to play then trash (${renderCostOrZero(target1.cost('buy', state))} so far)`,
                state.hand.map(asChoice)
            )
            if (target2 == null) return state
            state = await target2.play(card)(state)
            state = await trash(target2)(state)
            let cost:Cost = {...free, buys:1}
            for (const target of [target1, target2]) {
                cost = addCosts(cost, target.cost('buy', state))
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
cards.push(ritual)

const scepter:CardSpec = {
    name: 'Scepter',
    fixedCost: energy(2),
    buyCost: coin(7),
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
cards.push(scepter)

const inn:CardSpec = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
}
cards.push(supplyForCard(inn,coin(4), {afterBuy: [createEffect(horse, 'discard', 3)]}))

// ========== EVENTS MOVED FROM EXPANSION ==========

const festival:CardSpec = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 2)],
    relatedCards: [fair]
}
events.push(festival)

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
    simpleText: `The next time you buy a card, immediately buy a cheaper card.`,
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
    fixedCost: {...free, energy: 1},
    effects: [{
        text: [`Put a splay token on each supply.`],
        transform: s => doAll(s.supply.map(c => addToken(c, 'splay')))
    }],
    simpleText: `Put a splay token on each supply. Whenever you play a card with a splay token on its supply, remove splay tokens instead of paying @.`,
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
events.push(splay)

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

const recover:CardSpec = {
    name: 'Recover',
    simpleText: `Put up to two cards from your discard into your hand. This costs $1 more each time you use it.`,
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

const regroup:CardSpec = {
    name: 'Regroup',
    fixedCost: energy(2),
    restrictions: [{
        text: 'You must have at most 5 cards in your discard.',
        test: (c, s, k) => s.discard.length > 5,
    }],
    effects: [actionsEffect(2), buysEffect(1), recycleEffect()],
}
events.push(regroup)

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

const reprise:CardSpec = {
    name: 'Reprise',
    fixedCost: energy(1),
    effects: [{
        text: [`Put each card in your discard into your hand with an echo token on it.`],
        transform: (state) => doAll(state.discard.map(
            c => doAll([move(c, 'hand'), addToken(c, 'echo')])
        ))
    }],
    staticReplacers: [fragileEcho('echo')]
}
events.push(reprise)

const accelerate:CardSpec = {
    name: 'Accelerate',
    simpleText: `Put an accelerate token on each card in the supply. Whenever you create a card with an accelerate token on it, remove the token to play the card immediately.`,
    fixedCost: {...free, energy:1, coin:4},
    effects: [{
        text: [`Put an accelerate token on each card in the supply.`],
        transform: (state, card) => doAll(state.supply.map(c => addToken(c, 'accelerate')))
    }],
    staticReplacers: [playReplacer(
        `Whenever you would create a card in your discard
        whose supply has an accelerate token,
        instead remove an accelerate token and set the card aside.
        Then play it it is set aside.`,
        (p, s, c) => nameHasToken(p.spec, 'accelerate', s),
        (p, s, c) => applyToTarget(
            t => removeToken(t, 'accelerate', 1, true),
            'Remove an accelerate token.',
            state => state.supply.filter(t => t.name == p.spec.name)
        )
    )]
}
events.push(accelerate)

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
    staticReplacers: [fragileEcho()],
}
events.push(hallOfEchoes)

// More cards from expansion.ts

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
cards.push(magpie)

const crown:CardSpec = {
    name: 'Crown',
    simpleText: `Put a crown token on a card in your hand. The next time you play it, play it again.`,
    buyCost: coin(3),
    effects: [targetedEffect(
        target => addToken(target, 'crown'),
        'Put a crown token on a card in your hand.',
        s => s.hand
    )],
    staticTriggers: [reflectTrigger('crown')],
}
cards.push(crown)

const churnName = 'Churn'
const churn:CardSpec = {
    name: churnName,
    simpleText: `Put two non-${churnName} cards from your discard to your hand. This decreases by 1 each time you play it.`,
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

    }]
}
cards.push(supplyForCard(churn,coin(4), {
    replacers: [startsWithCharge(churn.name, 2)]
}))

const bustlingVillage:CardSpec = {
    name: 'Bustling Village',
    buyCost: coin(3),
    effects: [{
        text: [`+1 action for each card in play.`],
        transform: (state, card) => async function(state) {
            const n = state.play.length
            state = await gainActions(n, card)(state)
            return state
        }
    }]
}
cards.push(bustlingVillage)

const governorName = 'Governor'
const governor:CardSpec = {
    name: governorName,
    buyCost: coin(6),
    relatedCards: [villager],
    effects: [actionsEffect(2), buysEffect(1), createInPlayEffect(villager)],
    staticTriggers: [{
        kind: 'buy',
        handles: (e) => (e.card.name == gold.name),
        text: `Whenever you buy a ${gold.name}, put all ${governorName}s in your discard into your hand.`,
        transform: (e, s) => moveMany(s.discard.filter(card => card.name == governorName), 'hand')
    }]
}
cards.push(governor)

const marketSquare:CardSpec = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
}
cards.push(supplyForCard(marketSquare, coin(2), {afterBuy: [createInPlayEffect(fair, 2)]}))

const greatFeastName = 'Great Feast'
const greatFeast:CardSpec = {
    name: greatFeastName,
    buyCost: coin(8),
    effects: [{
        text: [`Do this three times: buy a card in the supply costing up to $8 other than ${greatFeastName}`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 3; i++) {
                state = await applyToTarget(
                    target => target.buy(card),
                    `Buy a card in the supply costing up to $8 other than ${greatFeastName}.`,
                    s => s.supply.filter(
                        x => leq(x.cost('buy', s), coin(8)) && x.name != greatFeastName
                    )
                )(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
cards.push(greatFeast)

const universityName = 'University'
const university:CardSpec = {
    name: universityName,
    buyCost: coin(12),
    relatedCards: [villager],
    effects: [actionsEffect(4), buysEffect(2), createInPlayEffect(villager)],
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
cards.push(university)

const moon:CardSpec = {
    name: 'Moon',
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
    simpleText: `+3 actions. If there is a full moon, instead +$3 and +1 buy. The moon starts off empty and switches between full and empty each time it would move to your hand.`,
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
        text: [`If there is no ${moon.name} in play, create one.`],
        transform: s => (s.play.some(c => c.name == moon.name)) ? noop : create(moon, 'play'),
    }, {
        text: [`If a ${moon.name} in play has an odd number of charge tokens (moon is full), +$3 and +1 buy.`,
                `Otherwise, +3 actions.`],
        transform: (s, c) => (s.play.some(c => c.name == moon.name && c.charge % 2 == 1)) ?
            doAll([gainCoins(3, c), gainBuys(1, c)]) :
            gainActions(3, c)
    }]
}
cards.push(werewolf)

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
    simpleText: `+$5 and +5 buys. Create an Embargo in play that increases the cost of cards and events by $1 until it leaves play.`,
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo],
}
cards.push(contraband)

const bulkOrder:CardSpec = {
    name: 'Bulk Order',
    fixedCost: coin(3),
    effects: [targetedEffect(
        card => addToken(card, 'bulk', 5),
        'Put five bulk tokens on a card in the supply.',
        state => state.supply,
    )],

    staticTriggers: [{
        text: `After buying a card with a bulk token on it other than with this,
        remove a bulk token from it to buy it again.`,
        kind:'afterBuy',
        handles: (e, state, card) => {
            if (sourceHasName(e.source, card.name)) return false
            const target:Card = state.find(e.card);
            return target.count('bulk') > 0
        },
        transform: (e, state, card) =>
            payToDo(removeToken(e.card, 'bulk'), e.card.buy(card))
    }]
}
events.push(bulkOrder)

// ========== VP MODE EVENTS ==========

const thoroughfare:CardSpec = {
    name: 'Thoroughfare',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'play',
        text: `Whenever you play a card, +1 vp.`,
        handles: () => true,
        transform: (e, state, card) => gainPoints(1, card)
    }]
}

const monument:CardSpec = {
    name: 'Monument',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
        kind: 'buy',
        text: `Whenever you buy a card costing $3 or more, +1 vp.`,
        handles: (e, state) => {
            const cost = e.card.cost('buy', state)
            return cost.coin >= 3
        },
        transform: (e, state, card) => gainPoints(1, card)
    }]
}

const capitalization:CardSpec = {
    name: 'Capitalization',
    fixedCost: coin(1),
    effects: [pointsEffect(1)]
}

// ========== VP MODES ==========

export const vpModes: VPMode[] = [
    { name: 'Province', target: 30, cards: [province], events: [] },
    { name: 'Duchy', target: 30, cards: [duchy], events: [] },
    { name: 'Estate', target: 20, cards: [estate], events: [] },
    { name: 'Thoroughfare', target: 80, cards: [], events: [thoroughfare] },
    { name: 'Monument', target: 20, cards: [], events: [monument] },
    { name: 'Capitalization', target: 60, cards: [], events: [capitalization] },
    { name: 'Philanthropy', target: 40, cards: [], events: [philanthropy] },
    { name: 'Duke', target: 50, cards: [duchy, duke], events: [] },
    { name: 'Flower Market', target: 40, cards: [flowerMarket], events: [] },
    { name: 'Farmland', target: 40, cards: [farmland], events: [] },
    { name: 'Vibrant City', target: 40, cards: [vibrantCity], events: [] },
    { name: 'Palace', target: 40, cards: [palace], events: [] },
    { name: 'Territory', target: 40, cards: [territory], events: [] },
    { name: 'Frontier', target: 60, cards: [frontier], events: [] },
    { name: 'Gardens', target: 40, cards: [gardens], events: [] },
]

// ========== POTIONS ==========

export const potionOfWealth:CardSpec = {
    name: 'Potion of Wealth',
    isPotion: true,
    simpleText: 'Double your money and buys.',
    effects: [{
        text: ['Double your $ and buys.'],
        transform: (state, card) => async function(state) {
            state = await gainCoins(state.coin, card)(state)
            state = await gainBuys(state.buys, card)(state)
            return state
        }
    }]
}

export const potionOfRecovery:CardSpec = {
    name: 'Potion of Recovery',
    isPotion: true,
    simpleText: 'Put your discard into your hand.',
    effects: [{
        text: ['Put your discard into your hand.'],
        transform: (state) => doAll([moveMany(state.discard, 'hand'), sortHand])
    }]
}

export const potionOfCopper:CardSpec = {
    name: 'Potion of Copper',
    isPotion: true,
    simpleText: 'Create 5 coppers in your hand.',
    effects: [{
        text: ['Create 5 Coppers in your hand.'],
        transform: () => repeat(create(copper, 'hand'), 5)
    }]
}

export const potionOfVitality:CardSpec = {
    name: 'Potion of Vitality',
    isPotion: true,
    simpleText: '+$1, +1 action, +1 buy, create a Fair and a Villager in play.',
    relatedCards: [fair, villager],
    effects: [
        coinsEffect(1),
        actionsEffect(1),
        buysEffect(1),
        createInPlayEffect(fair),
        createInPlayEffect(villager),
    ]
}

export const startingPotions:CardSpec[] = [
    potionOfWealth,
    potionOfRecovery,
    potionOfCopper,
    potionOfVitality,
]

