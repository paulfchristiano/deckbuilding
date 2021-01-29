import { GameSpec, CardSpec, playGame, State } from './logic.js'
import { expansionNames, ExpansionName, specToURL, cardsFrom } from './logic.js'
import { MalformedSpec, ReplayVictory, InvalidHistory, VersionMismatch, ReplayEnded } from './logic.js'
import {
  Kingdom, makeKingdom, goalForSpec, normalize, split, parseExpansionString, randomSeed, RANDOM, extractList
} from './logic.js'

// register cards
import './cards/absurd.js'
import {throneRoom, duplicate} from './cards/base.js'
import './cards/expansion.js'
import './cards/test.js'


export function normalizeURL(url:string): string{
	const spec:GameSpec = specFromURL(url)
    const kingdom:Kingdom = makeKingdom(spec, allCardsEvents)
    let normalizedSpec:GameSpec = {
        kind:'goal', vp:goalForSpec(spec),
        spec: {kind:'pick', cards:kingdom.cards, events:kingdom.events}
    }
    return specToURL(normalizedSpec)
}


export function specFromURL(search:string, excludeGoal:boolean = false): GameSpec {
    const searchParams = new URLSearchParams(search)
    if (!excludeGoal) {
        const vp_goal:string|null = searchParams.get('vp')
        if (vp_goal !== null) {
            return {kind:'goal',
                    vp: Number(vp_goal),
                    spec: specFromURL(search, true)}
        }
    }
    const urlKind:string|null = searchParams.get('kind')
    const cardsString:string|null = searchParams.get('cards')
    const cards:string[] = (cardsString === null) ? []
        : normalize(split(cardsString, ','))
    const eventsString:string|null = searchParams.get('events')
    const events:string[] = (eventsString === null) ? []
        : normalize(split(eventsString, ','))
    const expansionString:string|null = searchParams.get('expansions')
    const expansions:ExpansionName[] = parseExpansionString(expansionString)
    const seed:string|null = searchParams.get('seed') || randomSeed()
    let kind:string

    function pickOrPickR() {
        if (cards.indexOf(RANDOM) >= 0 || events.indexOf(RANDOM) >= 0) {
            return 'pickR'
        } else {
            return 'pick'
        }
    }

    if (urlKind !== null) {
        if (urlKind == 'pick' || urlKind == 'pickR') kind = pickOrPickR()
        else kind = urlKind
    } else {
        if (cards.length == 0 && events.length == 0) kind = 'full';
        else kind = pickOrPickR()
    }

    switch(kind) {
        case 'full':
            return {kind:kind, randomizer: {seed:seed, expansions: expansions}}
        case 'pick':
            const cardSpecs:CardSpec[] = [];
            const eventSpecs:CardSpec[] = [];
            if (cards !== null) {
                for (const card of extractList(cards, allCards)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else cardSpecs.push(card)
                }
            }
            if (events !== null) {
                for (const card of extractList(events, allEvents)) {
                    if (card == RANDOM) throw new MalformedSpec('Random card is only allowable in type pickR');
                    else eventSpecs.push(card)
                }
            }
            return {kind:kind, cards:cardSpecs, events:eventSpecs}
        case 'require':
            return {
                kind:kind, randomizer: {seed:seed, expansions:expansions},
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents),
            }
        case 'pickR':
            return {kind:kind, randomizer: {seed:seed, expansions:expansions},
                    cards:(cards === null) ? [] : extractList(cards, allCards),
                    events:(events === null) ? [] : extractList(events, allEvents)}
        case 'test': return {kind: 'test'}
        default: throw new MalformedSpec(`Invalid kind ${kind}`)
    }
}

export const randomPlaceholder:CardSpec = {name: RANDOM}

export const allCards:CardSpec[] = cardsFrom('cards', expansionNames)
export const allEvents:CardSpec[] = cardsFrom('events', expansionNames)
export const allCardsEvents: Kingdom = {cards: allCards, events: allEvents};

export async function verifyScore(spec:GameSpec, history:string, score:number): Promise<[boolean, string]> {
    try {
        await playGame(State.fromReplayString(history, spec, allCardsEvents))
        return [true, ""] //unreachable
    } catch(e) {
        if (e instanceof ReplayVictory) {
            if (e.state.energy == score)
                return [true, ""]
            else
                return [false, `Computed score was ${e.state.energy}`]
        } else if (e instanceof InvalidHistory) {
            return [false, `${e}`]
        } else if (e instanceof VersionMismatch) {
            return [false, `${e}`]
        } else if (e instanceof ReplayEnded) {
            return [false, `${e}`]
        } else {
            throw e
        }
    }
}

