import {
  CardSpec, Card, choice, asChoice, trash, Cost, addCosts,
  leq, Effect, move, payToDo, free,
  gainPoints
} from '../logic.js'
import {
  register, villager, buyable, registerEvent, actionsEffect, buyEffect, pointsEffect, refreshEffect,
  targetedEffect, chargeEffect,
  coin, energy,
} from './index.js'

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
register(manor, 'test')

