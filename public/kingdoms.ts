import {
  GameSpec, State, CardSpec, Kingdom, makeKingdom,
  supplyComp, eventComp, createRawMulti
} from './logic.js'

import {
  copper, estate,
  sets,
} from './cards/index.js'

import {
  throneRoom, duplicate,
} from './cards/base.js'


export function initialState(spec:GameSpec): State {
    const startingHand:CardSpec[] = [copper, copper, copper, estate, estate]

    const kingdom:Kingdom = makeKingdom(spec)

    const variableSupplies = kingdom.cards.slice()
    const variableEvents = kingdom.events.slice()
    variableSupplies.sort(supplyComp)
    variableEvents.sort(eventComp)

    const supply = sets.core.cards.concat(variableSupplies)
    const events = sets.core.events.concat(variableEvents)

    let state = new State(spec)
    state = createRawMulti(state, supply, 'supply')
    state = createRawMulti(state, events, 'events')
    state = createRawMulti(state, startingHand, 'discard')
    return state
}

export function getTutorialSpec(): GameSpec {
    return {
        cards:[throneRoom],
        events:[duplicate],
        kind: 'pick'
    }
}

