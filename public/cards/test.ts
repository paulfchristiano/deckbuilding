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
  } from '../logic.js'

export const cards:CardSpec[] = [];
export const events:CardSpec[] = [];

const manor:CardSpec = {
    name: 'Manor',
    buyCost: coin(6),
    fixedCost: energy(1),
    triggers: [{
        text: 'Whenever you pay @, gain that many vp.',
        kind: 'cost',
        handles: (e) => e.cost.energy > 0,
        transform: (e, s, c) => gainPoints(e.cost.energy, c)
    }]
}
cards.push(manor)

const ballista:CardSpec = {
    name: 'Ballista',
    buyCost: coin(5),
    effects: [{
        text: [`Play then trash up to two cards from your hand.`,
                `Gain a card from the supply whose cost is at most the sum of their costs.`],

        transform: (s, card) => async function(state) {
            const targets:Card[] = [];
            for (let i = 0; i < 2; i ++) {
                let target:Card|null; [state, target] = await choice(state,
                    'Choose a card to play then trash.',
                    allowNull(state.hand.map(asChoice))
                )
                if (target != null) {
                    state = await target.play(card)(state)
                    state = await trash(target)(state)
                    targets.push(target)
                }
                if (i == 0) state = await tick(card)(state)
            }
            let cost:Cost = {...free, buys:1}
            for (const target of targets) {
                cost = addCosts(cost, target.cost('buy', state))
            }
            state = await applyToTarget(
                target2 => target2.buy(card),
                'Choose a card to buy.',
                s => s.supply.filter(c => leq(
                    c.cost('buy', state), cost
                ))
            )(state)
            return state
        }
    }]
}
cards.push(ballista)

const reducerCard:CardSpec = {name: 'Reducer Card',
    buyCost: coin(5),
    effects: [targetedEffect(
        (target, card) => addToken(target, 'reduce'),
        `Put a reduce token on a card. Cards you play cost @ less to play for each reduce token on them.`,
        state => state.hand)],
    staticReplacers: [{
        text: `Cards you play cost @ less to play for each reduce token on them`,
        kind: 'cost',
        handles: (x, state, card) => state.find(x.card).count('reduce') > 0,
        replace: function(x:CostParams, state:State, card:Card) {
            const reduction = Math.min(
                x.cost.energy,
                state.find(x.card).count('reduce')
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                //effects:x.cost.effects.concat([removeToken(x.card, 'reduce', reduction, true)])
            }}
        }
        }]
    }
    
cards.push(reducerCard)
