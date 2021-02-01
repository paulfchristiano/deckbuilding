import {
  CardSpec, Card, choice, asChoice, trash, Cost, addCosts,
  leq, Effect, move, payToDo, free,
  gainPoints, allowNull, tick,
  villager, actionsEffect, buyEffect, pointsEffect, refreshEffect,
  targetedEffect, chargeEffect,
  coin, energy,
  applyToTarget,
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
        transform: e => gainPoints(e.cost.energy)
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

