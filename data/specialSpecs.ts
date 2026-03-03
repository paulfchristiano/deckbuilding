import { Card, CardSpec, State, cardSpecEffects, cardSpecRules, create, displayName, trash } from '../gameLogic.js'
import type { RelicSpec } from '../metaLogic.js'

export function makeCardInABoxRelic(spec: CardSpec): RelicSpec {
    const cardName = displayName(spec)
    return {
        name: `Boxed ${cardName}`,
        simpleText: [
            `At the start of the game, create a copy of ${cardName} in your hand.`,
            'Trash this.'
        ],
        triggers: [{
            kind: 'beforeStart',
            text: [`At the start of the game, create a copy of ${cardName} in your hand, then trash this.`],
            handles: (_e, _s, sourceCard) => sourceCard !== null,
            transform: (_e, _s, sourceCard) => async function (state: State) {
                state = await create(spec, 'hand')(state)
                state = await trash(sourceCard)(state)
                return state
            }
        }],
        relatedCards: [spec],
        persistence: {
            kind: 'cardInABoxRelic'
        }
    }
}

export function makeBottledCardPotion(spec: CardSpec): CardSpec {
    const cardName = displayName(spec)
    return {
        name: `Bottled ${cardName}`,
        isPotion: true,
        simpleText: [`Create a copy of ${cardName} in your hand.`],
        relatedCards: [spec],
        persistence: {
            kind: 'bottledCardPotion'
        },
        effects: [{
            text: [`Create a copy of ${cardName} in your hand.`],
            transform: () => create(spec, 'hand')
        }]
    }
}

export function makeBottledEventPotion(
    spec: CardSpec
): CardSpec {
    const cardName = displayName(spec)
    const baseName = spec.name
    const copiedEffects = cardSpecEffects(spec)
    const copiedText = copiedEffects.flatMap(effect => effect.text)
    const effects = [{
        text: copiedText.length > 0 ? copiedText : [`Use ${cardName}.`],
        transform: (_state: State, sourceCard: Card) => async function (state: State) {
            const target = state.events.find(event => event.name === baseName)
            if (!target) {
                return state
            }
            return target.use(sourceCard)(state)
        }
    }]

    return {
        name: `Bottled ${cardName}`,
        isPotion: true,
        simpleText: [`Use ${cardName}.`],
        relatedCards: [spec],
        rules: (() => {
            const rules = cardSpecRules(spec)
            return rules.length > 0 ? [...rules] : undefined
        })(),
        persistence: {
            kind: 'bottledEventPotion'
        },
        effects,
    }
}
