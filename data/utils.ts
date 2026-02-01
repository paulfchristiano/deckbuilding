// data/utils.ts - Shared helper functions for cards and events

import {
    CardSpec, Card, State, Effect, Transform,
    Cost, VariableCost, Token,
    Trigger, MoveEvent, Replacer, MoveParams,
    Option, Key, Source,
    noop, charge, trash, move, create,
    doAll, multichoice, asChoice,
    addToken, removeToken,
    renderCost, multiplyCosts, addCosts, leq,
    payToDo, payAction, playTwice, applyToTarget,
    tick, coin,
} from '../gameLogic.js'

// Effect that lets you pay an action to play a card twice
export function throneroomEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand twice.`],
        transform: (state, card) => payToDo(payAction(card), playTwice(card))
    }
}

// Variable cost that increases per N cost tokens
export function costPerN(increment: Partial<Cost>, n: number): VariableCost {
    const extraStr: string = `${renderCost(increment, true)} for every ${n} cost tokens on this.`
    return {
        calculate: function(card: Card, state: State) {
            return multiplyCosts(
                increment,
                Math.floor(state.find(card).count('cost') / n)
            )
        },
        text: extraStr,
    }
}

// Effect that adds charge up to a maximum
export function chargeUpTo(max: number): Effect {
    return {
        text: [`Put a charge token on this if it has less than ${max}.`],
        transform: (state, card) => (card.charge >= max) ? noop : charge(card, 1)
    }
}

// Create options from string array with hotkeys
export function literalOptions(xs: string[], keys: Key[]): Option<string>[] {
    return xs.map((x, i) => ({
        render: { kind: 'string', string: x },
        hotkeyHint: { kind: 'key', val: keys[i] },
        value: x
    }))
}

// Trigger that trashes card when it leaves play
export function fragile(card: Card): Trigger<MoveEvent> {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: x => x.card.id == card.id,
        transform: x => trash(x.card)
    }
}

// Replacer that keeps card in play
export function robust(card: Card): Replacer<MoveParams> {
    return {
        text: 'Whenever this would move, leave it in play instead.',
        kind: 'move',
        handles: x => (x.card.id == card.id && x.toZone != null && x.fromZone == 'play'),
        replace: x => ({ ...x, skip: true })
    }
}

// Effect that removes all tokens of a type from supply
export function removeAllSupplyTokens(token: Token): Effect {
    return {
        text: [`Remove all ${token} tokens from cards in the supply.`],
        transform: (state, card) => doAll(state.supply.map(s => removeToken(s, token, 'all')))
    }
}

// King's Court effect - play a card three times
export function KCEffect(): Effect {
    return {
        text: [`Pay an action to play a card in your hand three times.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
            ]), 'Choose a card to play three times.', s => s.hand))
    }
}

// Transform for buying cards up to a cost
export function industryTransform(n: number, except: string, source: Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        `Buy a card in the supply costing up to $${n} not named ${except}.`,
        state => state.supply.filter(
            x => leq(x.cost('buy', state), coin(n)) && x.name != except
        )
    )
}

// Effect that moves card to play
export function toPlay(): Effect {
    return {
        text: [`Put this in play.`],
        transform: (state, c) => move(c, 'play')
    }
}

// Transform that creates a copy with echo token
export function reverbEffect(card: Card): Transform {
    return create(card.spec, 'play', c => addToken(c, 'echo'))
}

// Transform for buying a cheaper card
export function buyCheaper(card: Card, s: State, source: Source): Transform {
    return applyToTarget(
        target => target.buy(source),
        'Choose a card to buy.',
        state => state.supply.filter(target => leq(
            addCosts(target.cost('buy', state), coin(1)),
            card.cost('buy', state))
        )
    )
}

// Effect for multi-target selection
export function multitargetedEffect(
    f: (targets: Card[], c: Card) => Transform,
    text: string,
    options: (s: State, c: Card) => Card[],
    max: number | null = null
): Effect {
    return {
        text: [text],
        transform: (s, c) => async function(state) {
            let cards: Card[];
            [state, cards] = await multichoice(
                state, text, options(state, c).map(asChoice), max
            )
            state = await f(cards, c)(state)
            return state
        }
    }
}

// Effect that creates a copy in discard
export function magpieEffect(): Effect {
    return {
        text: [`Create a copy of this in your discard.`],
        transform: (s, c) => create(c.spec)
    }
}
