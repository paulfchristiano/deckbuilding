import { Card, CardSpec, State, addToken, cardSpecEffects, create, displayName } from '../gameLogic.js'
import type { RelicSpec } from '../metaLogic.js'

export function makeCardInABoxRelic(spec: CardSpec): RelicSpec {
    const cardName = displayName(spec)
    return {
        name: `${cardName} in a Box`,
        triggers: [{
            kind: 'gameStart',
            text: `Start each course with a copy of ${cardName} in hand.`,
            handles: () => true,
            transform: () => async function (state: State) {
                state = await create(spec, 'hand')(state)
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
        simpleText: [`Create a copy of ${cardName} with an echo token and play it.`],
        relatedCards: [spec],
        persistence: {
            kind: 'bottledCardPotion'
        },
        effects: [{
            text: [`Create a copy of ${cardName} with an echo token and play it.`],
            transform: (_state: State, sourceCard: Card) => async function (state: State) {
                return create(spec, 'void', created => async function (state: State) {
                    state = await addToken(created, 'echo')(state)
                    state = await created.play(sourceCard)(state)
                    return state
                })(state)
            }
        }]
    }
}

export function makeBottledEventPotion(
    spec: CardSpec,
    options: { useUnderlyingEvent?: boolean } = {}
): CardSpec {
    const cardName = displayName(spec)
    const copiedEffects = cardSpecEffects(spec)
    const useUnderlyingEvent = options.useUnderlyingEvent ?? true
    const copiedText = copiedEffects.flatMap(effect => effect.text)
    const displayText = spec.simpleText
        ? [...spec.simpleText]
        : (copiedText.length > 0 ? copiedText : [`Use ${cardName}.`])

    const effects = useUnderlyingEvent
        ? [{
            text: copiedText.length > 0 ? copiedText : [`Use ${cardName}.`],
            transform: (_state: State, sourceCard: Card) => async function (state: State) {
                const target = state.events.find(event => event.name === cardName)
                if (!target) {
                    return state
                }
                return target.use(sourceCard)(state)
            }
        }]
        : copiedEffects

    return {
        name: `Bottled ${cardName}`,
        isPotion: true,
        simpleText: displayText,
        relatedCards: [spec],
        rules: spec.rules ? [...spec.rules] : undefined,
        persistence: {
            kind: 'bottledEventPotion',
            useUnderlyingEvent
        },
        effects,
    }
}
