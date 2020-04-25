//TODO: change the way that card management works
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
    constructor() {
        this.charge = 0
        this.tokens = []
        this.name = addSpacesToCamel(this.constructor.name)
    }
    toString() {
        return this.name
    }
    // cost can depend on the state of the game
    // is measured in time
    rawCost(state) {
        return {coin:0, time:0}
    }
    // the cost after replacement effects
    cost(state) {
        const thisCard = this
        const initialCost = {type:'cardCost', card:thisCard, cost:thisCard.rawCost()}
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
    mainEffect() {
        throw Error('Not implemented.')
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
            trigger({type:'play', card:card, normalWay:normalWay})
            effect.effect,
            effect['skipDiscard'] ? nothing : moveTo(card.id, 'discard'),
        ])
    }
    triggers() {
        return []
    }
    abilities() {
        return []
    }
    replacers() {
        return []
    }
    relatedCards() {
        return []
    }
}

async function nothing(state) {
    return state
}

class GainCard extends Card {
    constructor(card, cost) {
        super()
        this.fixedCost = {coin:cost, time:0}
        this.card = card
    }
    toString() {
        return this.card.toString()
    }
    rawCost(state) {
        return this.fixedCost
    }
    effect() {
        const supply = this
        return {
            description:`Create a ${supply.card.toString()} in your discard pile.`,
            effect: create(supply.card)
        }
    }
    relatedCards() {
        return [this.card]
    }
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

ZONES = ['hand', 'deck', 'discard', 'play', 'supplies', 'resolving', 'aside']

function find(state, id) {
    for (var i = 0; i < ZONES.length; i++) {
        const zone = state[ZONES[i]]
        for (var j = 0; j < zone.length; j++) {
            if (zone[j].id == id) return [zone[j], ZONES[i]]
        }
    }
    return null
}

function moveTo(id, toZone) {
    return async function(state) {
        const [_, fromZone] = find(state, id)
        if (fromZone == null) return state
        return move(id, fromZone, toZone)(state)
    }
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

function randomChoice(xs) {
    const result = xs[Math.floor(Math.random() * xs.length)]
    return result
}

//TODO all of these are going to have to have hooks for replacement, e.g. "draw one more" or whatever
function draw(n) {
    return async function(state) {
        var drawn = 0
        for (var i = 0; i < n; i++) {
            if (state.deck.length > 0) {
                const nextCard = randomChoice(state.deck)
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

class Copper extends Card {
    rawCost(state) {
        return {time:0, coin:0}
    }
    effect() {
        return {
            description: '+$1',
            effect: gainCoin(1)
        }
    }
}

class Silver extends Card {
    rawCost(state) {
        return {time:0, coin:0}
    }
    effect() {
        return {
            description: '+$2',
            effect: gainCoin(2)
        }
    }
}
class Estate extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        return {
            description: '+1vp',
            effect: gainPoints(1)
        }
    }
}
class Donkey extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        return {
            description: '+1 card',
            effect: draw(1),
        }
    }
}
class Mule extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        return {
            description: '+2 cards',
            effect: draw(2),
        }
    }
}
class Duchy extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        return {
            description: '+2 vp',
            effect: gainPoints(2),
        }
    }
}
class Province extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        return {
            description: '+3 vp',
            effect: gainPoints(3),
        }
    }
}

function cardAsChoice(card) {
    return [['card', card.id], card]
}

//TODO: clean up the entire making card process
class ThroneRoom extends Card {
    rawCost(state) {
        return {time:0, coin:0}
    }
    effect() {
        return {
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
        }
    }
}
class Blacksmith extends Card {
    rawCost(state) {
        return {time:1, coin:0}
    }
    effect() {
        const card = this
        return {
            description: '+1 card per charge token on this, then add a charge token to this.',
            effect: doAll([draw(card.charge), charge(card.id, 1), moveTo(card.id, 'discard')]),
            skipDiscard:true,
        }
    }
}
class Expedite extends Card {
    rawCost(state) {
        return {time:1, coin:1}
    }
    effect() {
        return {
            description: `The next time you gain a card this turn, put it into your hand.`,
            effect: nextTime(
                e => (e.type == 'create'),
                e => moveTo(e.card.id, 'hand')
            )
        }
    }
}

class Reboot extends Card{
    rawCost(state) {
        return {time:3, coin:0}
    }
    effect() {
        return {
            description: 'Put your hand and discard pile into your deck, then +5 cards.',
            effect: doAll([
                setCoins(0),
                moveWholeZone('hand', 'deck'),
                moveWholeZone('discard', 'deck'),
                draw(5)
            ])
        }
    }
}
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
class Pathfinding extends Card{
    rawCost(state) {
        return {coin:5, time:1}
    }
    effect() {
        return {
            description: 'Put a path token on a card in your hand.',
            effect: async function(state) {
                const card = await choice(state,
                    'Choose a card to put a path token on.',
                    state.hand.map(cardAsChoice))
                if (card == null) return state
                console.log(state)
                console.log(card)
                state = await addToken(card.id, 'path')(state)
                console.log(state)
                return state
            }
        }
    }
    triggers() {
        return [{
            'description': 'Whenever you play a card, draw a card per path token on it.',
            'handles':e => (e.type == 'play' && e.card.tokens.includes('path')),
            'effect':e => draw(countTokens(e.card, 'path'))
        }]
    }
}


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
    console.log(deckHtmls)
    deckHtmls.sort()
    console.log(deckHtmls)
    $('#deck').html(deckHtmls.join(''))
    $('#discard').html(state.discard.map(render).join(''))
    $('#trash').html(state.trash.map(render).join(''))
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

const emptyState = {
    play: [],
    aside: [],
    resolving: [],
    hand: [],
    discard: [],
    deck: [],
    //supplies: [],
    supplies:[],
    trash: [],
    auras: [],
    coin: 0,
    time: 0,
    points: 0,
    nextID: 0,
}

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

//TODO: allow multi-choices (with test for 'is this set of choices OK', test with horse traders)
function choice(state, choicePrompt, options) {
    if (options.length == 0) return null
    const optionsMap = {} //map card ids to their position in the choice list
    const stringOptions = []
    for (i = 0; i < options.length; i++) {
        const [type, x] = options[i][0]
        if (type == 'card') {
            optionsMap[x] = i
        } else if (type == 'string') {
            flatOptions.push([x, i])
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

//TODO: introduce payable test for costs? wouldn't always work but that's OK
function coreChoice(state) {
    const validSupplies = state.supplies.filter(x => (x.cost(state).coin <= state.coin))
    const validHand = state.hand
    const validPlay = state.play.filter(x => (x.abilities().length > 0))
    const cards = validSupplies.concat(validHand).concat(validPlay)
    return choice(state,
        'Play from your hand, use an ability, or buy from a supply.',
        cards.map(cardAsChoice))
}

allSupplies = [
    new GainCard(new Copper(), 1),
    new GainCard(new Silver(), 3),
    new GainCard(new Estate(), 1),
    new GainCard(new Duchy(), 5),
    new GainCard(new Province(), 8),
    new GainCard(new Blacksmith(), 2),
    new GainCard(new ThroneRoom(), 4),
    new Reboot(),
    new Pathfinding(),
    new Expedite(),
]
room = new ThroneRoom()
copper = new Copper()
estate = new Estate()
donkey = new Donkey()
startingDeck = [
    copper, copper, copper, copper, copper, copper,
    estate, estate,
    donkey, donkey,
]

async function playGame(seed=0) {
    var state = emptyState
    state = await doAll(startingDeck.map(x => create(x, 'deck')))(state)
    state = await doAll(allSupplies.map(x => create(x, 'supplies')))(state)
    state = await trigger({type:'gameStart'})(state)
    while (true) {
        renderState(state)
        state = await act(state)
    }
}

//TODO: history
//TODO: undo (by clicking history)
function load() {
    playGame().then(function () {
        console.log('done!')
    })
}
