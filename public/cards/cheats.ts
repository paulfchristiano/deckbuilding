import {
  State,
  CardSpec,
  removeToken,
  doAll,
} from '../logic.js'
import {
  actionsEffect, buyEffect, buysEffect, pointsEffect, coinsEffect,
  refreshEffect,
  energy, coin,
} from './index.js'


export const cheats:CardSpec[] = []

const freeMoney:CardSpec = {name: 'Free money and buys',
    fixedCost: energy(0),
    effects: [coinsEffect(100), buysEffect(100)],
}
cheats.push(freeMoney)

const freeActions:CardSpec = {name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionsEffect(100)],
}
cheats.push(freeActions)

const freePoints:CardSpec = {name: 'Free points',
    fixedCost: energy(0),
    effects: [pointsEffect(10)],
}
cheats.push(freePoints)

const doItAll:CardSpec = {name: 'Do it all',
    fixedCost: energy(0),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }, {
        text: ['Remove all decay tokens from cards in your discard and play.'],
        transform: state => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'decay', 'all'),
        ))
    },refreshEffect(100), coinsEffect(100), buysEffect(100)]
}
cheats.push(doItAll)

