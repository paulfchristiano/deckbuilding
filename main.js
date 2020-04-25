//TODO: add multi-select

// returns a copy x of object with x.k = v for all k:v in kvs
function updates(object, kvs) {
    const result = Object.assign({}, object)
    Object.assign(result, kvs)
    Object.setPrototypeOf(result, Object.getPrototypeOf(object))
    return result
}

// returns a copy of x object with x.key = value
function update(object, key, value) {
    const result = Object.assign({}, object)
    result[key] = value
    Object.setPrototypeOf(result, Object.getPrototypeOf(object))
    return result
}

// the function that sets x.k = v
function updateKey(k, v) {
    return x => update(x, k, v)
}

// the function that sets x.k = f(x.k)
function applyToKey(k, f) {
    return x => update(x, k, f(x[k]))
}

//TODO: operating on a given card involves a linear scan, could speed up with clever datastructure 
// the function that applies f to the card with a given id
function applyToId(id, f) {
    return function(state) {
        const [_, zone] = find(state, id)
        return update(state, zone, state[zone].map(x => (x.id == id) ? f(x) : x))
    }
}

//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return async function(state) {
        var triggers = state.play.concat(state.supplies).concat(state.auras).map(x => x.triggers()).flat()
        triggers = triggers.filter(trigger => trigger.handles(e))
        const effects = triggers.map(trigger => trigger.effect(e))
        return doAll(effects)(state)
    }
}

//x is an event that is about to happen
//each card in play and aura can change properties of x
function replace(x, state) {
    var replacers = state.play.concat(state.supplies).concat(state.auras).map(x => x.replacers()).flat()
    for (var i = 0; i < replacers.length; i++) {
        replacers = replacers[i]
        if (replacer.handles(x)) {
            x = replacer.replace(x, state)
        }
    }
    return x
}

//the effect that adds aura
function addAura(aura) {
    return async function(state) {
        var [state, newaura] = assignUID(state, aura)
        return update(state, 'auras', state.auras.concat([newaura]))
    }
}

//the effect that deletes an aura with the given id, 
function deleteAura(id) {
    return async function(state) {
        const result = removeIfPresent(state.auras, id)
        if (result.found) {
            return update(state, 'auras', result.without)
        } else {
            return state
        }
    }
}

//add an aura that triggers what(e) next time an event matching when(e) occurs, then deletes itself
function nextTime(when, what) {
    aura = {
        replacers() { return [] },
        triggers() {
            const id = this.id
            return [{
                handles(e) { return when(e) },
                effect(e) { return doAll([what(e), deleteAura(id)]) }
            }]
        }
    }
    return addAura(aura)
}

function addSpacesToCamel(name) {
    result = []
    for (var i = 0; i < name.length; i++) {
       const c = name[i]
        if (c == c.toUpperCase() && i > 0) {
            result.push(' ')
        }
        result.push(c)
    }
    return result.join('')
}

class Card {
    constructor(name, props) {
        this.charge = 0
        this.tokens = []
        this.name = name
        this.props = props
    }
    toString() {
        return this.name
    }
    // cost can depend on the state of the game
    // is measured in time
    baseCost(state) {
        return this.props.fixedCost || this.props.calculatedCost(this, state)
    }
    // the cost after replacement effects
    cost(state) {
        const thisCard = this
        const initialCost = {type:'cardCost', card:thisCard, cost:thisCard.baseCost()}
        const newCost = replace(initialCost, state)
        return newCost.cost
    }
    // the effect that actually pays the cost
    payCost() {
        const card = this
        return async function(state) {
            const cost = card.cost(state)
            return doAll([gainTime(cost.time), payCoin(cost.coin)])(state)
        }
    }
    effect() {
        return callOr(this.props.effect, this, {description:''})
    }
    buy(normalWay=false) {
        const card = this
        return doAll([
            this.effect().effect,
            trigger({type:'buy', card:card, normalWay:normalWay})
        ])
    }
    play(normalWay=false) {
        const effect = this.effect()
        const card = this
        return doAll([
            moveTo(card.id, 'resolving'),
            trigger({type:'play', card:card, normalWay:normalWay}),
            effect.effect,
            effect['skipDiscard'] ? noop : moveTo(card.id, 'discard'),
            trigger({type:'afterPlay', card:card, normalWay:normalWay}),
        ])
    }
    triggers() {
        return callOr(this.props.triggers, this, [])
    }
    abilities() {
        return callOr(this.props.abilities, this, [])
    }
    replacers() {
        return callOr(this.props.replacers, this, [])
    }
    relatedCards() {
        return this.props.relatedCards || []
    }
}

function callOr(f, x, backup) {
    return (f == undefined) ? backup : f(x)
}

function gainCard(card, cost)  {
    return new Card(card.name, {
        fixedCost: cost,
        effect: _ => ({
            description:`Create a ${card} in your discard pile.`,
            effect: create(card)
        }),
        relatedCards: [card],
    })
}

function makeCard(card, cost)  {
    return new Card(card.name, {
        fixedCost: cost,
        effect: _ => ({
            description:`Create a ${card} in play.`,
            effect: create(card, 'play')
        }),
        relatedCards: [card],
    })
}

function assignUID(state, card) {
    id = state.nextID
    return [update(state, 'nextID', id+1), updates(card, {id:id})]
}

function create(card, toZone='discard') {
    return async function(state) {
        [state, card] = assignUID(state, card)
        state = await addToZone(card, toZone)(state)
        return trigger({type:'create', card:card, toZone:toZone})(state)
    }
}

function addToZone(card, toZone) {
    return async function(state) {
        state = update(state, toZone, state[toZone].concat([card]))
        return trigger({type:'added', zone:toZone, card:card})(state)
    }
}

function removeIfPresent(xs, id) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].id == id) {
            return {
                found:true,
                card:xs[i],
                without:xs.slice(0,i).concat(xs.slice(i+1))
            }
        }
    }
    return {found:false}
}

function find(state, id) {
    for (var i = 0; i < ZONES.length; i++) {
        const zone = state[ZONES[i]]
        for (var j = 0; j < zone.length; j++) {
            if (zone[j].id == id) return [zone[j], ZONES[i]]
        }
    }
    return [null, null]
}

function moveTo(id, toZone) {
    return async function(state) {
        const [_, fromZone] = find(state, id)
        if (fromZone == null) return state
        return move(id, fromZone, toZone)(state)
    }
}

function trash(id) {
    return moveTo(id, null)
}

function move(id, fromZone, toZone) {
    return async function(state) {
        const result = removeIfPresent(state[fromZone], id)
        if (!result.found) return state
        state = update(state, fromZone, result.without)
        if (toZone != null) state = await addToZone(result.card, toZone)(state)
        return await trigger({type:'moved', card:result.card, fromZone:fromZone, toZone:toZone})(state)
    }
}

function moveWholeZone(fromZone, toZone) {
    return async function(state) {
        const cards = state[fromZone]
        state = update(state, fromZone, [])
        state = update(state, toZone, state[toZone].concat(cards))
        for (var i = 0; i < cards.length; i++) {
            state = await trigger({type:'moved', card:cards[i], fromZone:fromZone, toZone:toZone})(state)
        }
        return state
    }
}

function randomChoice(xs, n=1) {
    result = []
    xs = xs.slice()
    while (result.length < n) {
        if (xs.length == 0) throw Error("No items left to get.")
        const k = Math.floor(Math.random() * xs.length)
        result.push(xs[k])
        xs[k] = xs[xs.length-1]
        xs = xs.slice(0, xs.length-1)
    }
    return result
}

//TODO all of these are going to have to have hooks for replacement, e.g. "draw one more" or whatever
function draw(n) {
    return async function(state) {
        var drawn = 0
        for (var i = 0; i < n; i++) {
            if (state.deck.length > 0) {
                const nextCard = randomChoice(state.deck)[0]
                state = await move(nextCard.id, 'deck', 'hand')(state)
                drawn += 1
            }
        }
        return trigger({type:'draw', drawn:drawn, triedToDraw:n})(state)
    }
}

class CostNotPaid extends Error {
}


function payCoin(n) {
    return gainCoin(-n, true)
}

function setCoins(n) {
    return async function(state) {
        const adjustment = n - state.coin
        state = update(state, 'coin', n)
        return trigger({type:'gainCoin', amount:adjustment, cost:false})(state)
    }
}

function gainTime(n) {
    return async function(state) {
        state = update(state, 'time', state.time+n)
        return trigger({type:'gainTime', amount:n})(state)
    }
}

function gainPoints(n, cost=false) {
    return async function(state) {
        if (state.coin + n < 0 && cost) throw new CostNotPaid("Not enough points")
        state = update(state, 'points', state.points + n)
        return trigger({type:'gainPoints', amount:n, cost:cost})(state)
    }
}

function gainCoin(n, cost=false) {
    return async function(state) {
        if (state.coin + n < 0 && cost) throw new CostNotPaid("Not enough coin")
        const adjustment = state.coin + n < 0 ? - state.coin : n
        state = update(state, 'coin', state.coin + adjustment)
        return trigger({type:'gainCoin', amount:adjustment, cost:cost})(state)
    }
}

function doOrAbort(f, fallback=null) {
    return async function(state) {
        try {
            return f(state)
        } catch(error){
            if (error instanceof CostNotPaid) {
                if (fallback != null) return fallback(state)
                return state
            } else {
                throw error
            }
        }
    }
}


function payToDo(cost, effect) {
    return doOrAbort(async function(state){
        state = await cost(state)
        return effect(state)
    })
}

// trying to pay cost is mandatory
function payOrDo(cost, effect) {
    return doOrAbort(cost, effect)
}

function removeElement(xs, i) {
    return xs.slice(i).concat(xs.slice(i+1, xs.length))
}

//options is a list of [string, cost] pairs
function payAny(options) {
    return async function(state) {
        const costAndIndex = await choice(state,
            "Choose which cost to pay:",
            options.map(x,i => [['string', x[0]], [x[1], i]])
        )
        if (costAndIndex == null) throw CostNotPaid("no options available")
        const [cost, i] = costAndIndex
        return payOrDo(cost, payAny(removeElement(options, i)))
    }
}

function doAll(effects) {
    return async function(state) {
        for (var i = 0; i < effects.length; i++) {
            state = await effects[i](state)
        }
        return state
    }
}

async function noop(state) {
    return state
}


//options is a list of [string, effect] pairs
function doAny(options) {
    return async function(state) {
        const effect = await choice(state,
            "Choose an effect to do:",
            options.map(x => [['string', x[0]], x[1]]))
        return effect(state)
    }
}

function discharge(id, n) {
    return charge(id, -n, cost=true)
}

function addToken(id, token) {
    return async function(state) {
        state = applyToId(id, applyToKey('tokens', x => x.concat([token])))(state)
        return trigger({type:'addToken', id:id, token:token})(state)
    }
}

function charge(id, n, cost=false) {
    return async function(state) {
        const [card, _] = find(state, id)
        if (card == null) {
            if (cost) throw new CostNotPaid(`card no longer in ${zone}`)
            return state
        } else if (card.charge + n < 0 && cost) {
            throw new CostNotPaid(`not enough charge`)
        }
        const oldcharge = card.charge
        const newcharge = (oldcharge + n < 0) ? 0 : oldcharge + n
        state = applyToId(id, updateKey('charge', newcharge))(state)
        return trigger({type:'chargeChange', card:card,
            oldcharge:oldcharge, newcharge:newcharge, cost:cost})(state)
    }
}

const coreSupplies = []
const mixins = []

function time(n) {
    return {time:n, coin:0}
}
function coin(n) {
    return {time:0, coin:n}
}

const copper = new Card('Copper', {
    fixedCost: time(0),
    effect: card => ({
        description: '+$1',
        effect: gainCoin(1),
    })
})
coreSupplies.push(gainCard(copper, coin(1)))

const silver = new Card('Silver', {
    fixedCost: time(0),
    effect: card => ({
        description: '+$2',
        effect: gainCoin(2)
    })
})
coreSupplies.push(gainCard(silver, coin(3)))

const gold = new Card('Gold', {
    fixedCost: time(0),
    effect: card => ({
        description: '+$3',
        effect: gainCoin(3)
    })
})
coreSupplies.push(gainCard(gold, coin(6)))

const estate = new Card('Estate', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1vp',
        effect: gainPoints(1),
    })
})
coreSupplies.push(gainCard(estate, coin(2)))

const duchy = new Card('Duchy', {
    fixedCost: time(1),
    effect: card => ({
        description: '+2vp',
        effect: gainPoints(2),
    })
})
coreSupplies.push(gainCard(duchy, coin(4)))

const province = new Card('Province', {
    fixedCost: time(1),
    effect: card => ({
        description: '+3vp',
        effect: gainPoints(3),
    })
})
coreSupplies.push(gainCard(province, coin(8)))

const donkey = new Card('Donkey', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1 card',
        effect: draw(1)
    })
})

const mule = new Card('Mule', {
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
})
coreSupplies.push(gainCard(mule, coin(2)))

const reboot = new Card('Reboot', {
    fixedCost: time(3),
    effect: card => ({
        description: 'Put your hand and discard pile into your deck, then +5 cards.',
        effect: doAll([
            setCoins(0),
            moveWholeZone('hand', 'deck'),
            moveWholeZone('discard', 'deck'),
            draw(5)
        ])
    })
})
coreSupplies.push(reboot)

function cardAsChoice(card) {
    return [['card', card.id], card]
}

const throneRoom = new Card('Throne Room', {
    fixedCost: time(0),
    effect: card => ({
        description: `Pay the cost of a card in your hand to play it. Then if it's in your discard pile play it again.`,
        effect: doOrAbort(async function(state) {
            const card = await choice(state,
                'Choose a card to play twice with Throne Room.',
                state.hand.map(cardAsChoice))
            if (card == null) return state
            state = await card.payCost()(state)
            state = await card.play()(state)
            const [newCard, zone] = find(state, card.id)
            if (zone == 'discard') state = await newCard.play()(state)
            return state
        })
    })
})
mixins.push(gainCard(throneRoom, coin(4)))

const smithy = new Card('Smithy', {
    fixedCost: time(1),
    effect: card => ({
        description: '+3 cards',
        effect: draw(3)
    })
})
mixins.push(gainCard(smithy, coin(4)))

const tutor = new Card('Tutor', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Put any card from your deck into your hand.',
        effect: async function(state) {
            const toDraw = await choice(state,
                'Choose a card to put in your hand.',
                state.deck.map(cardAsChoice))
            if (toDraw == null) return state
            return moveTo(toDraw.id, 'hand')(state)
        }
    })
})
mixins.push(gainCard(tutor, coin(4)))

const vassal = new Card('Vassal', {
    fixedCost: time(0),
    effect: card => ({
        description: "Set aside a random card from your deck. You may play it or discard it.",
        effect: async function(state) {
            const picks = randomChoice(state.deck, 1)
            if (picks.length < 1) return state
            const target = picks[0]
            state = await moveTo(target.id, 'aside')(state)
            const playIt = await choice(state, `Play or discard ${target.name}?`,
                [[['string', 'Play'], true], [['string', 'Discard'], false]])
            if (playIt)
                state = await playById(target.id)(state)
            else
                state = await moveTo(target.id, 'discard')(state)
            return state
        }
    })
})
mixins.push(gainCard(vassal, coin(3)))

const reinforce = new Card('Reinforce', {
    fixedCost: {time:2, coin:7},
    effect: card => ({
        description: 'Put a reinforce token on a card in your hand.',
        effect: async function(state) {
            const card = await choice(state,
                'Choose a card to put a reinforce token on.',
                state.hand.map(cardAsChoice))
            if (card == null) return state
            return addToken(card.id, 'reinforce')(state)
        }
    }),
    triggers: card => [{
        'description': "After playing a card with a reinforce token the normal way, if it's in your discard plile play it again.",
        'handles':e => (e.type == 'afterPlay' && e.card.tokens.includes('reinforce') && e.normalWay),
        'effect':e => async function(state) {
            const [played, zone] = find(state, e.card.id)
            return (zone == 'discard') ? played.play()(state) : state
        }
    }],
})
mixins.push(reinforce)

const blacksmith = new Card('Blacksmith', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1 card per charge token on this, then add a charge token to this.',
        effect: doAll([draw(card.charge), charge(card.id, 1), moveTo(card.id, 'discard')]),
        skipDiscard: true
    })
})
mixins.push(gainCard(blacksmith, coin(2)))

const expedite = new Card('Expedite', {
    fixedCost: {time:1, coin:1},
    effect: card => ({
        description: `The next time you gain a card this turn, put it into your hand.`,
        effect: nextTime(
            e => (e.type == 'create'),
            e => moveTo(e.card.id, 'hand')
        )
    })
})
mixins.push(expedite)

function playById(id) {
    return async function(state) {
        //TODO: we are doing multiple linear scans unnecessarily...
        const [card, _] = find(state, id)
        return (card == null) ? state : card.play()(state)
    }
}

const bustlingSquare = new Card('Bustling Square', {
    fixedCost: time(2),
    effect: card => ({
        description: `Set aside all cards in your hand. Play them in any order.`,
        effect: async function(state) {
            //TODO: we are assuming invariant: if you set something aside, you can count on it still being there
            //TODO: this may cause trouble with undos
            var ids = state.hand.map(x => x.id)
            state = await moveWholeZone('hand', 'aside')(state)
            while (ids.length > 0) {
                const id = await choice(state, 'Choose which card to play next.',
                    ids.map(x => [['card', x], x]))
                state = await playById(id)(state)
                ids = ids.filter(x => x != id)
            }
            return state
        }
    })
})
mixins.push(gainCard(bustlingSquare, coin(6)))

const colony = new Card('Colony', {
    fixedCost: time(1),
    effect: card => ({
        description: '+5vp',
        effect: gainPoints(4),
    })
})
mixins.push(gainCard(colony, coin(16)))

const windfall = new Card('Windfall', {
    fixedCost: {time:1, coin:5},
    effect: card => ({
        description: 'If there are no cards in your deck, create two golds in your discard pile.',
        effect: async function(state) {
            return (state.deck.length == 0) ? doAll([create(gold), create(gold)])(state) : state
        }
    })
})
mixins.push(windfall)

const horse = new Card('Horse', {
    fixedCost: time(0),
    effect: card => ({
        description: '+2 cards. Trash this.',
        skipDiscard: true,
        effect: doAll([draw(2), trash(card.id)])
    })
})
mixins.push(gainCard(horse, coin(2)))

const lookout = new Card('Lookout', {
    fixedCost: time(0),
    effect: card => ({
        description: 'Set aside 3 random cards from your deck. Put one into your hand, discard one, and trash one.', 
        effect: async function(state) {
            var picks = randomChoice(state.deck, 3)
            for (var i = 0; i < picks.length; i++) state = await moveTo(picks[i].id, 'aside')(state)
            async function pickOne(descriptor, zone, state) {
                const pick = await choice(state, `Pick a card to ${descriptor}.`,
                    picks.map(card => [['card', card.id], card.id]))
                picks = picks.filter(card => card.id != pick)
                return moveTo(pick, zone)(state)
            }
            if (picks.length > 0)
                state = await pickOne('put into your hand', 'hand', state)
            if (picks.length > 0) 
                state = await pickOne('discard', 'discard', state)
            if (picks.length > 0) 
                state = await pickOne('trash', null, state)
            return state
        }
    })
})
mixins.push(gainCard(lookout, coin(3)))

const lab = new Card('Lab', {
    fixedCost: time(0),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
})
mixins.push(gainCard(lab, coin(5)))

const twins = new Card('Twins', {
    fixedCost: time(0),
    triggers: card => [{
        description: 'When you finish playing a card the normal way, you may play a card in your hand with the same name.',
        handles: e => (e.type == 'afterPlay' && e.normalWay),
        effect: e => async function(state) {
            const cardOptions = state.hand.filter(x => x.name == e.card.name)
            if (cardOptions.length == 0) return state
            const replay = await choice(state, `Choose a card named '${e.card.name}' to play.`,
                cardOptions.map(cardAsChoice).concat([[['string', "Don't play"], null]]))
            return (replay == null) ? state : replay.play()(state)
        }
    }]
})
mixins.push(makeCard(twins, {time:1, coin:6}))

const recycle = new Card('Recycle', {
    fixedCost: {coin:1, time:1},
    effect: _ => ({
        description: 'Put a card from your discard into your hand.',
        effect: async function(state) {
            const card = await choice(state, 'Choose a card to put into your hand.',
                state.discard.map(cardAsChoice))
            return (card == null) ? state : moveTo(card.id, 'hand')(state)
        }
    })
})
mixins.push(recycle)

const fortify = new Card('Fortify', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your discard pile in your hand. Trash this.',
        effect: doAll([moveWholeZone('discard', 'hand'), trash(card.id)]),
        skipDiscard:true,
    })
})
const gainFortify = new Card('Fortify', {
    fixedCost: coin(5),
    effect: card => ({
        description: 'Create a fortify in your discrad pile. Discard your hand.',
        effect: doAll([moveWholeZone('hand', 'discard'), create(fortify, 'discard')])
    }),
    relatedCards: [fortify],
})
mixins.push(gainFortify)

function countTokens(card, token) {
    var count = 0
    const tokens = card.tokens
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i]  == token) {
            count += 1
        }
    }
    return count
}

const pathfinding = new Card('Pathfinding', {
    fixedCost: {time:1, coin:5},
    effect: card => ({
        description: 'Put a path token on a card in your hand.',
        effect: async function(state) {
            const card = await choice(state,
                'Choose a card to put a path token on.',
                state.hand.map(cardAsChoice))
            if (card == null) return state
            return addToken(card.id, 'path')(state)
        }
    }),
    triggers: card => [{
        'description': 'Whenever you play a card, draw a card per path token on it.',
        'handles':e => (e.type == 'play' && e.card.tokens.includes('path')),
        'effect':e => draw(countTokens(e.card, 'path'))
    }],
})
mixins.push(pathfinding)


function renderTooltip(card, state) {
    const effectHtml = `<div>${card.effect().description}</div>`
    const abilitiesHtml = card.abilities().map(x => `<div>${x.description}</div>`)
    const staticHtml = card.triggers().concat(card.replacers()).map(x => `<div>(static) ${x.description}</div>`)
    const tokensHtml = card.tokens.length > 0 ? `Tokens: ${card.tokens.join(', ')}` : ''
    const baseFilling = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('')
    function renderRelated(x) {
        const cost = x.cost(state)
        const costStr = (cost.coin == 0 && cost.time == 0) ? '0' : renderCost(cost)
        return `<div>---${x.toString()} (${costStr})---</div>${renderTooltip(x, state)}`
    }
    const relatedFilling = card.relatedCards().map(renderRelated).join('')
    return `${baseFilling}${relatedFilling}`
}

function renderCard(card, state, i, asOption=null) {
    const tokenhtml = card.tokens.length > 0 ? '*' : ''
    const chargehtml = card.charge > 0 ? `(${card.charge})` : ''
    const costhtml = renderCost(card.cost(state))
    const attrtext = asOption == null ? '' : `choosable option=${asOption}`
    return [`<div class='card' ${attrtext}>`,
            `<div class='cardbody'>${card}${tokenhtml}${chargehtml}</div>`,
            `<div class='cardcost'>${costhtml}</div>`,
            `<span class='tooltip'>${renderTooltip(card, state)}</span>`,
            `</div>`].join('')
}

//TODO: sort hand?
//TODO: sort deck in way that is robust when you are offered choice
function renderState(state, optionsMap=null) {
    function render(card, i) {
        if (optionsMap != null && optionsMap[card.id] != undefined) {
            return renderCard(card, state, i, optionsMap[card.id])
        } else {
            return renderCard(card, state, i)
        }
    }
    $('#time').html(state.time)
    $('#coin').html(state.coin)
    $('#points').html(state.points)
    $('#aside').html(state.aside.map(render).join(''))
    $('#resolving').html(state.resolving.map(render).join(''))
    $('#play').html(state.play.map(render).join(''))
    $('#supplies').html(state.supplies.map(render).join(''))
    $('#hand').html(state.hand.map(render).join(''))
    const deckHtmls = state.deck.map(render)
    deckHtmls.sort()
    $('#deck').html(deckHtmls.join(''))
    $('#discard').html(state.discard.map(render).join(''))
}

function renderCost(cost) {
    coinHtml = cost.coin > 0 ? `$${cost.coin}` : ''
    timeHtml = renderTime(cost.time)
    if (coinHtml == '') {
        if (timeHtml == '') return '&nbsp;'
        else return timeHtml
    } else return [coinHtml, timeHtml].join(' ')
}

function renderTime(n) {
    const result = []
    for (var i = 0; i < n; i++) {
        result.push('@')
    }
    return result.join('')
}

const ZONES = ['hand', 'deck', 'discard', 'play', 'supplies', 'resolving', 'aside']
const RESOURCES = ['coin', 'time', 'points']
const emptyState = {nextID: 0, auras:[]}
for (var i = 0; i < ZONES.length; i++) emptyState[ZONES[i]] = []
for (var i = 0; i < RESOURCES.length; i++) emptyState[RESOURCES[i]] = 0

function clearChoice() {
    $('#choicePrompt').html('')
    $('#options').html('')
}

function useCard(card) {
    return async function(state) {
        ability = await choice(state, "Choose an ability to use:",
            card.abilities().map(x => [['string', x.description], x]))
        if (ability == null) return state
        return payToDo(ability.cost, ability.effect)(state)
    }
}

function tryToBuy(supply) {
    return payToDo(supply.payCost(), supply.buy())
}

function allCards(state) {
    return state.play.concat(state.hand).concat(state.deck).concat(state.discard).concat(state.trash)
}

function cardExists(state, id) {
    return allCards(state).some(x => x.id == id)
}

function tryToPlay(card) {
    return payToDo(card.payCost(), card.play(true))
}

async function act(state) {
    const card = await coreChoice(state)
    const [_, zone] = find(state, card.id)
    if (zone == 'play') {
        return useCard(card)(state)
    } else if (zone == 'hand') {
        return tryToPlay(card)(state)
    } else if (zone == 'supplies') {
        return tryToBuy(card)(state)
    } else {
        throw new Error(`Unrecognized choice zone ${zone}`)
    }
}

function renderOption(z) {
    const [option, i] = z
    return `<span class='option' id='${i}' option='${i}' choosable>${option}</span>`
}

function choice(state, choicePrompt, options) {
    if (options.length == 0) return null
    const optionsMap = {} //map card ids to their position in the choice list
    const stringOptions = []
    for (i = 0; i < options.length; i++) {
        const [type, x] = options[i][0]
        if (type == 'card') {
            optionsMap[x] = i
        } else if (type == 'string') {
            stringOptions.push([x, i])
        } else {
            throw new Error(`Got type ${type}`)
        }
    }
    renderState(state, optionsMap)
    $('#choicePrompt').html(choicePrompt)
    $('#options').html(stringOptions.map(renderOption))
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < options.length; i++) {
            const j = i;
            $(`[option='${i}']`).on('click', function (e) {
                clearChoice()
                resolve(options[j][1])
            })
        }
    })
}

//TODO: introduce an isPayable for costs?
function coreChoice(state) {
    const validSupplies = state.supplies.filter(x => (x.cost(state).coin <= state.coin))
    const validHand = state.hand
    const validPlay = state.play.filter(x => (x.abilities().length > 0))
    const cards = validSupplies.concat(validHand).concat(validPlay)
    return choice(state,
        'Play from your hand, use an ability, or buy from a supply.',
        cards.map(cardAsChoice))
}

startingDeck = [
    copper, copper, copper, copper, copper, copper,
    estate, estate,
    donkey, donkey,
]

//TODO: improve sort
function supplyKey(card) {
    if (card.props.fixedCost == undefined) {
        return 10
    } else {
        return card.props.fixedCost.coin
    }
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2)
}

async function playGame(seed=0) {
    var state = emptyState
    state = await doAll(startingDeck.map(x => create(x, 'deck')))(state)
    const variableSupplies = randomChoice(mixins, 10)
    variableSupplies.sort(supplySort)
    const kingdom = coreSupplies.concat(variableSupplies)
    state = await doAll(kingdom.map(x => create(x, 'supplies')))(state)
    state = await trigger({type:'gameStart'})(state)
    while (state.points < 50) {
        renderState(state)
        state = await act(state)
    }
    //TODO: do something when you win
}

function load() {
    playGame().then(function () {
        console.log('done!')
    })
}
