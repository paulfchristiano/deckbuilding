// register cards
import * as base from './base.js'
import { sets, CardSpec, ExpansionName, vpModes } from '../logic.js'

function registerAll(cards:CardSpec[], events:CardSpec[], expansion:ExpansionName): void {
    sets[expansion].cards = cards
    sets[expansion].events = events
}

registerAll(base.cards, base.events, 'base')

// Register VP modes
for (const mode of base.vpModes) {
    vpModes.push(mode)
}

export const throneRoom = base.throneRoom;
export const duplicate = base.duplicate;
export const startingPotions = base.startingPotions;
export const allPotions = base.allPotions;
export const boonCards = base.boonCards;
export const boonEvents = base.boonEvents;