// register cards
import * as absurd from './absurd.js'
import * as base from './base.js'
import * as expansion from './expansion.js'
import * as test from './test.js'
import { sets, CardSpec, ExpansionName } from '../logic.js'

function registerAll(cards:CardSpec[], events:CardSpec[], expansion:ExpansionName): void {
    sets[expansion].cards = cards
    sets[expansion].events = events
}

registerAll(absurd.cards, absurd.events, 'absurd')
registerAll(base.cards, base.events, 'base')
registerAll(expansion.cards, expansion.events, 'expansion')
registerAll(test.cards, test.events, 'test')

console.log(sets.expansion.cards)

export const throneRoom = base.throneRoom;
export const duplicate = base.duplicate;