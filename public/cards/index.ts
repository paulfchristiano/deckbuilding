import {
  SetName, GameSpec, Card, CardSpec, State, doAll, moveMany,
  num, aOrNum, a,
  free, create, move, choice, discharge,
  CreateParams,
  VariableCost, Cost, Source, unk,
  CostParams, Replacer, trash, Transform, setResource, MoveParams,
  gainActions, gainBuys, gainBuy, gainCoins, gainPoints,
  Token, addToken, removeToken,
  addCosts, subtractCost, multiplyCosts,
  asChoice,
  leq, eq,
  Option, allowNull,
  ZoneName,
  renderCost,
  tick, payCost, CostNotPaid,
  assertNever,
  Effect, charge,
  Trigger,
  TypedTrigger, TypedReplacer,
  lowercaseFirst,
  ActionKind, BuyEvent, AfterBuyEvent, AfterPlayEvent
} from '../logic.js'

import './base.js'
import './expansion.js'
import './absurd.js'
import './cheats.js'
import './test.js'

type SetSpec = {
    'cards': CardSpec[],
    'events': CardSpec[],
}

function emptySet(): SetSpec {
    return {'cards': [], 'events': []}
}

export const sets: {[expansion: string]: SetSpec} = {
    'core': emptySet(),
    'base': emptySet(),
    'expansion': emptySet(),
    'absurd': emptySet(),
    'test': emptySet(),
}

export function register(card:CardSpec, set:SetName):void {
    sets[set].cards.push(card)
}

export function buyable(card:CardSpec, n:number, set:SetName, extra:Extras={}) {
    card.buyCost = coin(n)
    register(supplyForCard(card, coin(n), extra), set)
}

export function buyableFree(card:CardSpec, coins:number, set:SetName): void {
    buyable(card, coins, set, {onBuy: [buyEffect()]})
}

export function registerEvent(card:CardSpec, set:SetName):void {
    sets[set]['events'].push(card)
}

//
// ----- MIXINS -----
//


function playAgain(target:Card, source:Source=unk): Transform {
    return async function(state:State) {
        target = state.find(target)
        if (target.place == 'discard') state = await target.play(source)(state)
        return state
    }
}

function descriptorForKind(kind:ActionKind):string {
    switch (kind) {
        case 'play': return 'Cards you play'
        case 'buy': return 'Cards you buy'
        case 'use': return 'Events you use'
        case 'activate': return 'Abilities you use'
        default: return assertNever(kind)
    }
}

export function reducedCost(cost:Cost, reduction:Partial<Cost>, nonzero:boolean=false) {
    let newCost:Cost = subtractCost(cost, reduction)
    if (nonzero && leq(newCost, free) && !leq(cost, free)) {
        if ((reduction.coin || 0) > 0) {
            newCost = addCosts(newCost, {coin:1})
        } else if ((reduction.energy || 0) > 0) {
            newCost = addCosts(newCost, {energy:1})
        }
    }
    return newCost
}

export function costReduce(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false,
): Replacer<CostParams> {
    const descriptor = descriptorForKind(kind)
    return {
        text: `${descriptor} cost ${renderCost(reduction, true)}
               less${nonzero ? ' unless it would make them free' : ''}.`,
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            return {...x, cost:newCost}
        }
    }
}

export function costReduceNext(
    kind:ActionKind,
    reduction:Partial<Cost>,
    nonzero:boolean=false
): Replacer<CostParams> {
    const descriptor = descriptorForKind(kind)
    return {
        text: `${descriptor} cost ${renderCost(reduction, true)}
               less${nonzero ? ' unless it would make them free' : ''}.
        Whenever this reduces a cost, discard it.`,
        kind: 'cost',
        handles: x => x.actionKind == kind,
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = reducedCost(x.cost, reduction, nonzero)
            if (!eq(newCost, x.cost)) newCost.effects = newCost.effects.concat([move(card, 'discard')])
            return {...x, cost:newCost}
        }
    }
}

export function applyToTarget(
    f:(target:Card) => Transform,
    text:string,
    options:(s:State) => Card[],
    special:{optional?:string, cost?:boolean} = {},
): Transform {
    return async function(state) {
        let choices:Option<Card|null>[] = options(state).map(asChoice)
        if (special.optional !== undefined) choices = allowNull(choices, special.optional)
        let target:Card|null; [state, target] = await choice(
            state, text, choices, ['applyToTarget']
        )
        if (target != null) state = await f(target)(state);
        if (target == null && special.cost == true) throw new CostNotPaid('No valid targets')
        return state
    }
}

export function repeat(t:Transform, n:number): Transform {
    return doAll(Array(n).fill(t))
}

export function createInPlayEffect(spec:CardSpec, n:number=1) {
    return {
        text: [`Create ${aOrNum(n, spec.name)} in play.`],
        transform: () => repeat(create(spec, 'play'), n)
    }
}


export const payAction = payCost({...free, actions:1})

export function tickEffect(): Effect {
    return {
        text: [],
        transform: (state, card) => tick(card)
    }
}

export function playTwice(card:Card): Transform {
    return applyToTarget(
        target => doAll([
            target.play(card),
            tick(card),
            target.play(card),
        ]), 'Choose a card to play twice.', s => s.hand
    )
}


export function costPer(increment:Partial<Cost>): VariableCost {
    const extraStr:string = `${renderCost(increment, true)} for each cost token on this.`
    return {
        calculate: function(card:Card, state:State) {
            return multiplyCosts(increment, state.find(card).count('cost'))
        },
        text: extraStr,
    }
}

export function incrementCost(): Effect {
    return {
        text: ['Put a cost token on this.'],
        transform: (s:State, c:Card) => addToken(c, 'cost')
    }
}

export function trashOnLeavePlay():Replacer<MoveParams> {
    return {
        text: `Whenever this would leave play, trash it.`,
        kind: 'move',
        handles: (x, state, card) => x.card.id == card.id && x.fromZone == 'play',
        replace: x => ({...x, toZone:'void'})
    }
}


export function dischargeCost(c:Card, n:number=1): Cost {
    return {...free,
        effects: [discharge(c, n)],
        tests: [state => state.find(c).charge >= n]
    }
}

export function discardFromPlay(card:Card): Transform {
    return async function(state) {
        card = state.find(card)
        if (card.place != 'play') throw new CostNotPaid("Card not in play.");
        return move(card, 'discard')(state)
    }
}

export function discardCost(card:Card): Cost {
    return {...free,
        effects: [discardFromPlay(card)],
        tests: [state => state.find(card).place == 'play'],
    }
}
//
// ----------- UTILS -------------------
//

export function createEffect(spec:CardSpec, zone:ZoneName='discard', n:number=1): Effect {
    const zoneText = (zone == 'play') ? 'play' : `your ${zone}`
    return {
        text: [`Create ${aOrNum(n, spec.name)} in ${zoneText}.`],
        transform: () => repeat(create(spec, zone), n),
    }
}

export interface Extras {
    triggers?:TypedTrigger[];
    replacers?:TypedReplacer[];
    onBuy?:Effect[];
    afterBuy?:Effect[];
}
export function supplyForCard(
    card:CardSpec,
    cost:Cost,
    extra:Extras={}
): CardSpec {
    const buyTriggers:Trigger<BuyEvent>[] = (extra.onBuy || []).map(
        t => ({
            kind: 'buy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `When you buy this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const afterTriggers:Trigger<AfterBuyEvent>[] = (extra.afterBuy || []).map(
        t => ({
            kind: 'afterBuy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `After buying this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const triggers:TypedTrigger[] = (buyTriggers as TypedTrigger[])
        .concat(afterTriggers as TypedTrigger[])
        .concat(extra.triggers || [])
    return {
        ...card,
        buyCost: cost,
        staticTriggers: triggers,
        staticReplacers: extra.replacers,
    }
}
export function energy(n:number):Cost {
    return {...free, energy:n}
}
export function coin(n:number):Cost {
    return {...free, coin:n}
}
export function trashThis():Effect {
    return {
        text: ['Trash this.'],
        transform: (s:State, c:Card) => trash(c)
    }
}

export function dedupBy<T>(xs:T[], f:(x:T) => any): T[] {
    const result:T[] = []
    for (const x of xs) {
        if (result.every(r => f(r) != f(x))) {
            result.push(x)
        }
    }
    return result
}


// NOTE: unused?
function makeCard(card:CardSpec, cost:Cost, selfdestruct:boolean=false):CardSpec  {
    const effects:Effect[] = [{
        text: [`Create ${a(card.name)} in play.`],
        transform: () => create(card, 'play')
    }]
    if (selfdestruct) effects.push(trashThis())
    return {name:card.name,
        fixedCost: cost,
        effects: effects,
        relatedCards: [card],
    }
}

//
//
// ------ Basic effects ------
//

export function sortHand(state:State): State {
    return state.sortZone('hand')
}


export function coinsEffect(n:number): Effect {
    return {
        text: [`+$${n}.`],
        transform: (s:State, c:Card) => gainCoins(n, c),
    }
}
export function pointsEffect(n:number): Effect {
    return {
        text: [`+${n} vp.`],
        transform: (s:State, c:Card) => gainPoints(n, c),
    }
}
export function actionsEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'action')}.`],
        transform: (s:State, c:Card) => gainActions(n, c),
    }
}
export function buysEffect(n:number): Effect {
    return {
        text: [`+${num(n, 'buy')}.`],
        transform: (state, card) => gainBuys(n, card),
    }
}
export function buyEffect() { return buysEffect(1) }

export function chargeEffect(n:number=1): Effect {
    return {
        text: [`Put ${aOrNum(n, 'charge token')} on this.`],
        transform: (s, card) => charge(card, n)
    }
}

export function targetedEffect(
    f:(target:Card, card:Card) => Transform,
    text:string,
    options:(s:State) => Card[]
): Effect {
    return {
        text: [text],
        transform: (s:State, c:Card) => applyToTarget(
            target => f(target, c),
            text,
            options,
        )
    }
}

async function ploughTransform(state:State): Promise<State> {
    return doAll([
        moveMany(state.discard, 'hand'),
        moveMany(state.play, 'hand'),
        sortHand,
    ])(state)
}


export function ploughEffect(): Effect {
    return {
        text: ['Put your discard and play into your hand'],
        transform: () => ploughTransform
    }
}

export function refreshEffect(n:number, doRecycle:boolean=true): Effect {
    let text:string[] = ['Lose all $, actions, and buys.']
    if (doRecycle) text.push('Put your discard and play into your hand.');
    text.push(`+${num(n, 'action')}, +1 buy.`)
    return {
        text: text,
        transform: (state, card) => async function(state) {
            state = await setResource('coin', 0)(state)
            state = await setResource('actions', 0)(state)
            state = await setResource('buys', 0)(state)
            if (doRecycle) state = await ploughTransform(state);
            state = await gainActions(n, card)(state)
            state = await gainBuy(state)
            return state
        }
    }
}

export function recycleEffect(): Effect {
    return {
        text: ['Put your discard into your hand.'],
        transform: state => doAll([moveMany(state.discard, 'hand'), sortHand])
    }
}



//
//
// ------ COMMON HELPERS ------
//
//
//
export function fragileEcho(t:Token = 'echo'): Replacer<MoveParams> {
    return {
        text: `Whenever a card with ${a(t)} token would move to your hand or discard,
               trash it instead.`,
        kind: 'move',
        handles: (p, state) => state.find(p.card).count(t) > 0
            && (p.toZone == 'hand' || p.toZone == 'discard'),
        replace: p => ({...p, toZone: 'void'})
    }
}

export function workshopEffect(n:number):Effect {
    return targetedEffect(
        (target, card) => target.buy(card),
        `Buy a card in the supply costing up to $${n}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n))
        )
    )
}

export function useRefresh(): Effect {
    return targetedEffect(
        (target, c) => target.use(c),
        `Use ${refresh.name}.`,
        state => state.events.filter(c => c.name == refresh.name)
    )
}

export function startsWithCharge(name:string, n:number):Replacer<CreateParams> {
    return {
        text: `Each ${name} is created with ${aOrNum(n, 'charge token')} on it.`,
        kind: 'create',
        handles: p => p.spec.name == name,
        replace: p => ({...p, effects:p.effects.concat([c => charge(c, n)])})
    }
}

function sum<T>(xs:T[], f:(x:T) => number): number {
    return xs.map(f).reduce((a, b) => a+b)
}


export function countNameTokens(card:Card, token:Token, state:State): number {
    return sum(
        state.supply,
        c => (c.name == card.name) ? c.count(token) : 0
    )
}

export function nameHasToken(card:Card, token:Token, state:State): boolean {
    return state.supply.some(s => s.name == card.name && s.count(token) > 0)
}

export function reflectTrigger(token:Token): Trigger<AfterPlayEvent> {
    return {
        text: `After playing a card with ${a(token)} token on it
        other than with this, remove ${a(token)} token and play it again.`,
        kind:'afterPlay',
        handles: (e, state, card) => {
            const played:Card = state.find(e.card)
            return played.count(token) > 0 && e.source.name != card.name
        },
        transform: (e, s, card) => doAll([
            removeToken(e.card, token),
            e.card.play(card),
        ]),
    }
}


//
//
// ------ CORE ------
//
//
//

export const refresh:CardSpec = {name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
}
registerEvent(refresh, 'core')

export const copper:CardSpec = {name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
}
register(copper, 'core')

export const silver:CardSpec = {name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
}
register(silver, 'core')

export const gold:CardSpec = {name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
}
register(gold, 'core')

export const estate:CardSpec = {name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
}
register(estate, 'core')

export const duchy:CardSpec = {name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
}
register(duchy, 'core')

export const province:CardSpec = {name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
}
register(province, 'core')

//
//
// ------ CORE CREATED ------
//

export const villager:CardSpec = {
    name: 'Villager',
    replacers: [{
        text: `Cards you play cost @ less. Whenever this reduces a cost, trash it.`,
        kind: 'cost',
        handles: x => x.actionKind == 'play',
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

export const fair:CardSpec = {
    name: 'Fair',
    replacers: [{
        text: `Whenever you would create a card in your discard,
        instead create the card in your hand and trash this.`,
        kind: 'create',
        handles: (e, state, card) => e.zone == 'discard'
            && state.find(card).place == 'play',
        replace: (x, state, card) => ({
            ...x, zone:'hand', effects:x.effects.concat(() => trash(card))
        })
    }, trashOnLeavePlay()]
}

