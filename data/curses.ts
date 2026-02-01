const decay:CardSpec = {
    name: 'Decay',
    restrictions: [cannotUse],
    staticTriggers: [{
        text: `When you play a card with fewer than two decay tokens on it the normal way, put a decay token on it.`,
        kind: 'play',
        handles: e => e.card.count('decay') < 2 && e.source == 'act',
        transform: (e, s, c) => addToken(e.card, 'decay'),
    }],
    staticReplacers: [{
        kind: 'costIncrease',
        text: `Cards with two or more decay tokens on them cost an additional $1 to play,`,
        handles: e => e.actionKind == 'play' && e.card.count('decay') >= 2,
        replace: p => ({...p, cost:addCosts(p.cost, coin(1))})
    }] 
}

const burden:CardSpec = {name: 'Burden',
    fixedCost: energy(1),
    effects: [{
        text: ['Remove a burden token from each supply.'],
        transform: state => doAll(state.supply.map(c => removeToken(c, 'burden')))
    }],
    staticTriggers: [{
        text: 'Whenever you create a card, put a burden token on its supply.',
        kind:'create',
        handles: (e, state) => true,
        transform: (e, state) => doAll(state.supply.filter(
            c => c.name == e.card.name
        ).map(
            c => addToken(c, 'burden')
        ))
    }],
    staticReplacers: [{
        kind: 'costIncrease',
        text: 'Cards cost $2 more to buy for each burden token on them or their supply.',
        handles: (x, state) => (nameHasToken(x.card, 'burden', state)) && x.actionKind == 'buy',
        replace: (x, state) => ({...x, cost: addCosts(x.cost, {coin:2 * (countNameTokens(x.card, 'burden', state))})})
    }]
}

const mire:CardSpec = {
    name: 'Mire',
    fixedCost: energy(3),
    effects: [{
        text: [`Remove all mire tokens from all cards.`],
        transform: (state:State) => doAll(state.discard.concat(state.play).concat(state.hand).map(
            c => removeToken(c, 'mire', 'all'),
        ))
    }],
    staticTriggers: [{
        text: `Whenever a card leaves your hand, put a mire token on it.`,
        kind: 'move',
        handles: (e, state) => e.fromZone == 'hand',
        transform: e => addToken(e.card, 'mire'),
    }],
    staticReplacers: [{
        text: `Cards with mire tokens can't move to your hand.`,
        kind: 'move',
        handles: x => (x.toZone == 'hand') && x.card.count('mire') > 0,
        replace: x => ({...x, skip:true})
    }]
}
// events.push(mire) // removed (curse)
