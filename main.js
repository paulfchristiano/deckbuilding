//TODO: totally eliminate the [result, state] convention, transformations are just async functions turning states to states
//TODO: improve rendering of static abilities, right now seems tricky
//TODO: fix the "pay any cost" so that it makes you try again if you fail on one option
//TODO: fix doAny()
//TODO: have a 'Resolving' zone
//TODO: have a 'Set aside' zone
//TODO: remove 'Trash' zone
//TODO: introduce tokens
//TODO: fix the deck sorting for rendering

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
// the function that applies f to all cards in zone that have an id of id
function applyToId(state, id, f) {
    zone = currentZone(state, id)
    return update(state, zone, state[zone].map(x => (x.id == id) ? f(x) : x))
}

// returns the first card in a given zone that has a given id
function getById(state, id) {
    zone = currentZone(state, id)
    const matches = state[zone].filter(x => x.id == id)
    if (matches.length == 0) return null
    return matches[0]
}

function applyToIndex(n, f) {
    return list => list.map((x, i) => (i == n) ? f(x) : x)
}

//e is an event that just happened
//each card in play and aura can have a followup
async function trigger(e, state) {
    var triggers = state.play.concat(state.supplies).concat(state.auras).map(x => x.triggers()).flat()
    triggers = triggers.filter(trigger => trigger.handles(e))
    const effects = triggers.map(trigger => trigger.effect(e))
    for (var i = 0; i < effects.length; i++) {
        const result = await effects[i](state)
        state = result[1]
    }
    return state
}

//x is an event that is about to happen
//each card in play and aura can change properties of x
function replace(x, state) {
    var replacers = state.play.concat(state.supplies).concat(state.auras).map(x => x.replacers()).flat()
    for (var i = 0; i < replacers.length; i++) {
        replacers = replacers[i]
        if (replacer.handles(x)) {
            x = replacer.change(x, state)
        }
    }
    return x
}

//the effect that adds aura
function addAura(aura) {
    return async function(state) {
        var [state, newaura] = assignUID(state, aura)
        return [newaura, update(state, 'auras', state.auras.concat([newaura]))]
    }
}

//the effect that deletes an aura with the given id, 
function deleteAura(id) {
    return async function(state) {
        const result = removeIfPresent(state.auras, id)
        if (result.found) {
            return [true, update(state, 'auras', result.without)]
        } else {
            return [false, state]
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
                effect(e) { return doAll(what(e), deleteAura(id)) }
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
    //template for the trivial on-play effect that puts this in the discard pile
    //before you play a card, you need to remove it from play
    effect() {
        const thisCard = this
        return {
            description:'Do nothing.',
            effect: addToDiscard(thisCard)
        }
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
        var [_, state] = await addToZone(card, toZone)(state)
        state = await trigger({type:'create', card:card, toZone:toZone}, state)
        return [card, state]
    }
}

function addToDiscard(card) {
    return addToZone(card, 'discard')
}

function addToZone(card, toZone) {
    return async function(state) {
        return [card, update(state, toZone, state[toZone].concat([card]))]
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

ZONES = ['hand', 'deck', 'discard', 'play', 'supplies', 'trash']

function currentZone(state, id) {
    for (var i = 0; i < ZONES.length; i++) {
        if (state[ZONES[i]].some(x => x.id == id)) {
            return ZONES[i]
        }
    }
    return null
}

function moveTo(id, toZone) {
    return async function(state) {
        const fromZone = currentZone(state, id)
        if (fromZone != null) {
            const [result, newstate] = await move(id, fromZone, toZone)(state)
            return [fromZone, newstate]
        } else {
            return [null, state]
        }
    }
}

function move(id, fromZone, toZone) {
    return async function(state) {
        const result = removeIfPresent(state[fromZone], id)
        if (result.found) {
            state = update(state, fromZone, result.without)
            if (toZone != null) {
                const z = await addToZone(result.card, toZone)(state)
                state = z[1]
            }
            state = await trigger({type:'moved', card:result.card, fromZone:fromZone, toZone:toZone}, state)
        }
        return [result.found, state]
    }
}

function moveWholeZone(fromZone, toZone) {
    return async function(state) {
        const cards = state[fromZone]
        state = update(state, fromZone, [])
        state = update(state, toZone, state[toZone].concat(cards))
        for (var i = 0; i < cards.length; i++) {
            state = await trigger({type:'moved', card:cards[i], fromZone:fromZone, toZone:toZone}, state)
        }
        return [cards, state]
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
        var _
        var nextCard
        for (var i = 0; i < n; i++) {
            if (state.deck.length > 0) {
                nextCard = randomChoice(state.deck)
                const result = await move(nextCard.id, 'deck', 'hand')(state)
                state = result[1]
                drawn += 1
            }
        }
        state = await trigger({type:'draw', drawn:drawn, triedToDraw:n}, state)
        return [drawn, state]
    }
}

//TODO: way to choose multiple (this should be pretty elegant)
//TODO: generalize 'choose' so that it can pick things by clicking directly in zone)
//(and maybe have things somehow indicate that they are a valid choice)
//(I guess an option can either specify a string, or specify a card in a zone?)
//TODO: write discard(n)

function annotate(xs) {
    return xs.map(x => [x.toString(), x])
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
        state = await trigger({type:'gainCoin', amount:adjustment, cost:false}, state)
        return [adjustment, state]
    }
}

function gainTime(n) {
    return async function(state) {
        state = update(state, 'time', state.time+n)
        state = await trigger({type:'gainTime', amount:n}, state)
        return [null, state]
    }
}

function gainPoints(n, cost=false) {
    return async function(state) {
        if (state.coin + n < 0 && cost) throw new CostNotPaid("Not enough points")
        state = update(state, 'points', state.points + n)
        state = await trigger({type:'gainPoints', amount:n, cost:cost}, state)
        return [null, state]
    }
}

function gainCoin(n, cost=false) {
    return async function(state) {
        if (state.coin + n < 0 && cost) throw new CostNotPaid("Not enough coin")
        const adjustment = state.coin + n < 0 ? - state.coin : n
        state = update(state, 'coin', state.coin + adjustment)
        state = await trigger({type:'gainCoin', amount:adjustment, cost:cost}, state)
        return [null, state]
    }
}

// trying to pay cost is mandatory
// TODO: better calculus for this stuff
function payToDo(cost, effect) {
    return async function(state) {
        try {
            var [costResult, state] = await cost(state)
            var [effectResult, state] = await effect(state)
            return [[true, [costResult, effectResult]], state]
        } catch(e) {
            if (e instanceof CostNotPaid) {
                return [[false, null], state]
            } else {
                throw e
            }
        }
    }
}

// trying to pay cost is mandatory
function payOrDo(cost, effect) {
    return async function(state) {
        try {
            var [result, state] = await cost(state)
            return [['cost', result], state]
        } catch (e) {
            if (e instanceof CostNotPaid) {
                var [result, state] = await effect(state)
                return [['effect', result], state]
            } else {
                throw e
            }
        }
    }
}

//TODO: remove cost from consideration and keep going if you can't pay it
function payAny(...args) {
    return async function(state) {
        const cost = await choice(state, "Choose which cost to pay:", args)
        if (cost == null) throw CostNotPaid("no options available")
        return cost(state)
    }
}

function doAll(...args) {
    return async function(state) {
        const results = []
        for (var i = 0; i < args.length; i++) {
            const z = await args[i](state)
            var result
            [result, state] = z
            results.push(result)
        }
        return [results, state]
    }
}

function doAny(...args) {
    return async function(state) {
        const effect = await choice(state, "Choose an effect:", args)
        return effect(state)
    }
}

function discardCost(id, fromZone='play') {
    return async function(state) {
        var [result, state] = await (move(id, fromZone, 'discard')(state))
        if (!result) {
            throw CostNotPaid("failed to discard")
        }
    }
}

function discharge(id, n, zone='play') {
    return charge(id, -n, zone, cost=true)
}

function charge(id, n, cost=false) {
    return async function(state) {
        card = getById(state, id)
        if (card == null) {
            if (cost) throw new CostNotPaid(`card no longer in ${zone}`)
            return [0, state]
        } else if (card.charge + n < 0 && cost) {
            throw new CostNotPaid(`not enough charge`)
        }
        const f = x => (x+n < 0) ? 0 : x+n
        const oldcharge = card.charge
        const newcharge = (oldcharge + n < 0) ? 0 : oldcharge + n
        state = applyToId(state, id, updateKey('charge', newcharge))
        state = await trigger({type:'chargeChange', card:card,
            oldcharge:oldcharge, newcharge:newcharge, cost:cost}, state)
        return [newcharge - oldcharge, state]
    }
}

function entersPlay(id) {
    return (e => (e.type == 'moved') && (e.toZone == 'play') && (e.card.id == id))
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
                if (card == null) {
                    return [[false, null], state]
                }
                var [_, state] = await costForCard(card)(state)
                var [_, state] = await play(card)(state)
                if (currentZone(state, card.id) == 'discard') {
                    [_, state] = await play(card)(state)
                    return [true, state]
                }
                return [false, state]
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
            effect: async function(state) {
                var [_, state] = await draw(card.charge)(state)
                const newCard = update(card, 'charge', card.charge+1)
                var [_, state] = await addToDiscard(newCard)(state)
                return [null, state]
            }
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
            effect: doAll(
                setCoins(0),
                moveWholeZone('hand', 'deck'),
                moveWholeZone('discard', 'deck'),
                draw(5)
            )
        }
    }
}



function tooltipText(card) {
}

//TODO: probably have other text that gets included, e.g. for replacements?
//TODO: improve this formatting
function renderTooltip(card, state) {
    const baseFilling = [card.effect()].concat(card.abilities()).concat(card.triggers()).concat().map(
        x => `<div>${x.description}</div>`
    )
    function renderRelated(x) {
        const cost = x.cost(state)
        const costStr = (cost.coin == 0 && cost.time == 0) ? '0' : renderCost(cost)
        return `<div>---${x.toString()} (${costStr})---</div>${renderTooltip(x, state)}`
    }
    const relatedFilling = card.relatedCards().map(renderRelated).join('')
    return `${baseFilling}${relatedFilling}`
}

function renderCard(card, state, i, asOption=null) {
    const chargehtml = card.charge > 0 ? `(${card.charge})` : ''
    const costhtml = renderCost(card.cost(state))
    const attrtext = asOption == null ? '' : `choosable option=${asOption}`
    return [`<div class='card' id='${i}'${attrtext}>`,
            `<div class='cardbody'>${card}${chargehtml}</div><div class='cardcost'>${costhtml}</div>`,
            `<span class='tooltip'>${renderTooltip(card, state)}</span>`,
            `</div>`].join('')
}

function renderState(state, optionsMap=null) {
    function render(card, i) {
        if (optionsMap != null && optionsMap[card.id] != undefined) {
            console.log(card, state, i, optionsMap[card.id])
            return renderCard(card, state, i, optionsMap[card.id])
        } else {
            return renderCard(card, state, i)
        }
    }
    $('#time').html(state.time)
    $('#coin').html(state.coin)
    $('#points').html(state.points)
    $('#play').html(state.play.map(render).join(''))
    $('#supplies').html(state.supplies.map(render).join(''))
    $('#hand').html(state.hand.map(render).join(''))
    const deckCards = state.deck.map(render)
    deckCards.sort()
    $('#deck').html(deckCards.join(''))
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

async function useAbility(ability, state) {
    const [result, newstate] = await doOrAbort(async function(state){
        var [result, state] = await ability.cost(state)
        var [_, state] = await (ability.effect(result))(state)
        return [null, state]
    })(state)
    return newstate
}

async function useCard(card, state) {
    ability = await choice(state, "Choose an ability to use:",
        card.abilities().map(x => [['string', x.description], x]))
    if (ability == null) return state
    return useAbility(ability, state)
}

function costForCard(card) {
    return async function(state) {
        const cost = card.cost(state)
        const result = doAll(gainTime(cost.time), payCoin(cost.coin))(state)
        return result
    }
}

function doOrAbort(f) {
    return async function(state) {
        try {
            const [result, newstate] = await f(state)
            return [[true, result], newstate]
        } catch(error){
            if (error instanceof CostNotPaid) {
                return [[false, null], state]
            } else {
                throw error
            }
        }
    }
}

async function useSupply(supply, state) {
    const [result, newstate] = await doOrAbort(async function(state) {
        var [_, state] = await costForCard(supply)(state)
        var [_, state] = await supply.effect().effect(state)
        return [null, state]
    })(state)
    return newstate
}

function allCards(state) {
    return state.play.concat(state.hand).concat(state.deck).concat(state.discard).concat(state.trash)
}

function cardExists(state, id) {
    return allCards(state).some(x => x.id == id)
}

function play(card, normalWay=false) {
    return async function(state) {
        var [_, state] = await moveTo(card.id, null)(state)
        var [_, state] = await card.effect().effect(state)
        if (!cardExists(state, card.id)) {
            var [_, state] = await addToDiscard(card)(state)
        }
        state = await trigger({type:'played', card:card, normalWay:normalWay}, state)
        return [null, state]
    }
}

async function tryToPlay(card, state) {
    const [result, newstate] = await doOrAbort(async function(state) {
        var [_, state] = (await costForCard(card)(state))
        const z = (await play(card, true)(state))
        state = z[1]
        return [null, state]
    })(state)
    return newstate
}

async function act(state) {
    const chosen = await coreChoice(state)
    choiceType = currentZone(state, chosen.id)
    if (choiceType == 'play') {
        return useItem(chosen, state)
    } else if (choiceType == 'hand') {
        return tryToPlay(chosen, state)
    } else if (choiceType == 'supplies') {
        return useSupply(chosen, state)
    } else {
        throw new Error(`Unrecognized choice zone ${choiceType}`)
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
    console.log(options)
    console.log(optionsMap)
    console.log(stringOptions)
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
    room, room, room, room, room
]

async function playGame(seed=0) {
    var state = emptyState
    for (var i = 0; i < startingDeck.length; i++) {
        var [_, state] = await create(startingDeck[i], 'deck')(state)
    }
    for (var i = 0; i < allSupplies.length; i++) {
        var [_, state] = await create(allSupplies[i], 'supplies')(state)
    }
    state = await trigger({type:'gameStart'}, state)
    while (true) {
        console.log(state)
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
