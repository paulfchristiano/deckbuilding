// TODO: improve sorting of hand/deck
// TODO: visually mark on TR/crown/village/bazaar whether we are on the first or second part
// (could do slightly different colors or something?)
// TODO: when a triggered effect or buy is resolving, put a greyed-out item in the resolving area?
// (e.g. so you know that you are currently playing from twin/innovation/citadel)
// TODO: be able to highlight cards during a choice? (so that Sage doesn't have to set aside)
// TODO: set aside should show up at top somehow? (maybe next to resolving?)
// TODO: adjust balance (plough, refresh, research?, workshop, boostrap at 1/2?, pathfinding to $4?, blacksmith? cursed province -> cursed kingdom at +4 vp)
// TODO: add cards (KC, gardens event, explorer, anti-bootstrap like 5 for 7 cards?)
//
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
        triggers = triggers.filter(trigger => trigger.handles(e, state))
        const effects = triggers.map(trigger => trigger.effect(e, state))
        return doAll(effects)(state)
    }
}

//x is an event that is about to happen
//each card in play and aura can change properties of x
function replace(x, state) {
    var replacers = state.play.concat(state.supplies).concat(state.auras).map(x => x.replacers()).flat()
    for (var i = 0; i < replacers.length; i++) {
        replacer = replacers[i]
        if (replacer.handles(x, state)) {
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

function countDistinct(xs) {
    const y = {}
    var result = 0
    for (var i = 0; i < xs.length; i++) {
        if (y[xs[i]] == undefined) {
            y[xs[i]] = true
            result += 1
        }
    }
    return result
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
        if (this.props.fixedCost != undefined)
            return this.props.fixedCost
        else if (this.props.calculatedCost != undefined)
            return this.props.calculatedCost(this, state)
        else
            return {coin:0, time:0}
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
    buy(source=null) {
        const card = this
        return doAll([
            trigger({type:'buy', card:card, source:source}),
            this.effect().effect,
            trigger({type:'afterBuy', card:card, source:source})
        ])
    }
    play(source=null) {
        const effect = this.effect()
        const card = this
        return doAll([
            move(card, 'resolving'),
            trigger({type:'play', card:card, source:source}),
            effect.effect,
            effect['skipDiscard'] ? noop : move(card, 'discard'),
            trigger({type:'afterPlay', card:card, source:source}),
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

function callOr(f, x, fallback) {
    return (f == undefined) ? fallback : f(x)
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

function makeCard(card, cost, selfdestruct=false)  {
    return new Card(card.name, {
        fixedCost: cost,
        effect: supply => ({
            description:`Create a ${card} in play.${selfdestruct ? ' Trash this.' : ''}`,
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
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

function move(card, toZone) {
    return async function(state) {
        const [_, fromZone] = find(state, card.id)
        if (fromZone == null) return state
        return moveFromTo(card, fromZone, toZone)(state)
    }
}

//TODO: should we move them all at once, with one trigger?
//Could do this by changing move
function moveMany(cards, toZone) {
    return doAll(cards.map(card => move(card, toZone)))
}

function trash(card) {
    return move(card, null)
}

function moveFromTo(card, fromZone, toZone) {
    return async function(state) {
        const result = removeIfPresent(state[fromZone], card.id)
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

// pseudorandom float in [0,1] based on two integers a, b
function PRF(a, b) {
    const N = 123456789
    return ((a * 1003303882 + b * 6690673372 + b * b * 992036483 + 
        a * a * 99202618 + ((a*a+1) / (b*b+1)) * 399220 + 
        ((b*b+1) / (a*a+1)) * 392901666676)  % N) / N
}

function randomChoice(state, xs, seed=null) {
    if (xs.length == 0) return [state, null];
    [state, [x]] = randomChoices(state, xs, 1, seed)
    return [state, x]
}

function randomChoices(state, xs, n, seed=null) {
    result = []
    xs = xs.slice()
    while (result.length < n) {
        if (xs.length == 0) return result;
        [state, rand] = doOrReplay(state, _ => (seed == null) ? Math.random() : PRF(seed, result.length), 'rng')
        const k = Math.floor(rand * xs.length)
        result.push(xs[k])
        xs[k] = xs[xs.length-1]
        xs = xs.slice(0, xs.length-1)
    }
    return [state, result]
}

function draw(n, source=null) {
    return async function(state) {
        var drawParams = {type:'draw', draw:n, source:source}
        drawParams = replace(drawParams, state)
        n = drawParams.draw
        var drawn = 0
        for (var i = 0; i < n; i++) {
            if (state.deck.length > 0) {
                [state, nextCard] = randomChoice(state, state.deck);
                state = await moveFromTo(nextCard, 'deck', 'hand')(state)
                drawn += 1
            }
        }
        return trigger({type:'draw', drawn:drawn, triedToDraw:n, source:source})(state)
    }
}

//TODO: discard all at once?
function discard(n) {
    return async function(state) {
        [state, toDiscard] = (state.hand.length < n) ? state.hand :
            await choice(state, `Choose ${n} cards to discard.`, state.hand.map(asChoice),
                (xs => xs.length == n))
        return moveMany(toDiscard, 'hand', 'discard')(state)
    }
}

class CostNotPaid extends Error { }


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
        [state, costAndIndex] = await choice(state,
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
        [state, effect] = await choice(state,
            "Choose an effect to do:",
            options.map(x => [['string', x[0]], x[1]]))
        return effect(state)
    }
}

function discharge(card, n) {
    return charge(card, -n, cost=true)
}

function addToken(id, token) {
    return async function(state) {
        state = applyToId(id, applyToKey('tokens', x => x.concat([token])))(state)
        return trigger({type:'addToken', id:id, token:token})(state)
    }
}

function charge(card, n, cost=false) {
    return async function(state) {
        [card, _] = find(state, card.id)
        if (card == null) {
            if (cost) throw new CostNotPaid(`card no longer in ${zone}`)
            return state
        } else if (card.charge + n < 0 && cost) {
            throw new CostNotPaid(`not enough charge`)
        }
        const oldcharge = card.charge
        const newcharge = (oldcharge + n < 0) ? 0 : oldcharge + n
        state = applyToId(card.id, updateKey('charge', newcharge))(state)
        return trigger({type:'chargeChange', card:card,
            oldcharge:oldcharge, newcharge:newcharge, cost:cost})(state)
    }
}

function time(n) {
    return {time:n, coin:0}
}
function coin(n) {
    return {time:0, coin:n}
}

yesOrNo = [[['string', 'yes'], true], [['string', 'no'], false]]

function asChoice(x) {
    if (x instanceof Card) return [['card', x.id], x]
    else return [['string', x.toString()], x]
}

function allowNull(options, message="None") {
    return options.concat([[['string', message], null]])
}


function playById(id, source) {
    return async function(state) {
        //TODO: we are doing multiple linear scans unnecessarily...
        const [card, _] = find(state, id)
        return (card == null) ? state : card.play(source)(state)
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


function renderTooltip(card, state) {
    const effectHtml = `<div>${card.effect().description}</div>`
    const abilitiesHtml = card.abilities().map(x => `<div>${x.description}</div>`).join('')
    const staticHtml = card.triggers().concat(card.replacers()).map(x => `<div>(static) ${x.description}</div>`).join('')
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
    const attrtext = asOption == null ? '' : `choosable chosen='false' option=${asOption}`
    return [`<div class='card' ${attrtext}>`,
            `<div class='cardbody'>${card}${tokenhtml}${chargehtml}</div>`,
            `<div class='cardcost'>${costhtml}</div>`,
            `<span class='tooltip'>${renderTooltip(card, state)}</span>`,
            `</div>`].join('')
}

var renderedState

//TODO: sort hand?
//TODO: sort deck in way that is robust when you are offered choice
function renderState(state, optionsMap=null) {
    renderedState = state
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
const emptyState = {nextID: 0, auras:[], future:[], history:[], checkpoint:null}
for (var i = 0; i < ZONES.length; i++) emptyState[ZONES[i]] = []
for (var i = 0; i < RESOURCES.length; i++) emptyState[RESOURCES[i]] = 0

function clearChoice() {
    $('#choicePrompt').html('')
    $('#options').html('')
}

function useCard(card) {
    return async function(state) {
        [state, ability] = await choice(state, "Choose an ability to use:",
            card.abilities().map(x => [['string', x.description], x]))
        if (ability == null) return state
        return payToDo(ability.cost, ability.effect)(state)
    }
}

function tryToBuy(supply) {
    return payToDo(supply.payCost(), supply.buy('act'))
}

function allCards(state) {
    return state.play.concat(state.hand).concat(state.deck).concat(state.discard).concat(state.trash)
}

function cardExists(state, id) {
    return allCards(state).some(x => x.id == id)
}

function tryToPlay(card) {
    return payToDo(card.payCost(), card.play('act'))
}

async function act(state) {
    [state, card] = await actChoice(state)
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
    return `<span class='option' option='${i}' choosable='true' chosen='false'>${option}</span>`
}

function doOrReplay(state, f, key) {
    var x, future, k
    if (state.future.length == 0) {
        x = f()
    } else {
        [[k, x], future] = shiftFirst(state.future)
        if (k != key) throw Error(`replaying history we found ${[k, x]} where expecting key ${key}`)
        state = update(state, 'future', future)
    }
    const newHistory = state.history.concat([[key, x]])
    return [update(state, 'history', newHistory), x]
}

//TODO: surely there is some way to unify these?
async function asyncDoOrReplay(state, f, key) {
    var x, future, k
    if (state.future.length == 0) {
        x = await f()
    } else {
        [[k, x], future] = shiftFirst(state.future)
        if (k != key) throw Error(`replaying history we found ${[k, x]} where expecting key ${key}`)
        state = update(state, 'future', future)
    }
    const newHistory = state.history.concat([[key, x]])
    return [update(state, 'history', newHistory), x]
}

function choice(state, ...args) {
    if (isTrivial(state, ...args)) return Promise.resolve([state, null])
    return asyncDoOrReplay(state, _ => freshChoice(state, ...args), 'choice')
}

function getLastEvent(state) {
    const n = state.history.length
    if (n > 0) return state.history[n-1]
    else if (state.checkpoint == null) return null
    else return getLastEvent(state.checkpoint)
}

function undoIsPossible(state) {
    const lastEvent = getLastEvent(state)
    return (lastEvent != null && lastEvent[0] == 'choice')
}

function isTrivial(state, choicePromopt, options, multichoiceValidator=null) {
    return (options.length == 0 && multichoiceValidator == null)
}

//TODO: what to do if you can't pick a valid set for the validator?
function freshChoice(state, choicePrompt, options, multichoiceValidator=null) {
    const undoable = undoIsPossible(state)
    const optionsMap = {} //map card ids to their position in the choice list
    const stringOptions = []
    const chosen = {} //records what options are being chosen for multithoice
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
    if (multichoiceValidator!=null) stringOptions.push(['Done', 'submit'])
    stringOptions.push(['Undo', 'undo'])
    renderState(state, optionsMap)
    $('#choicePrompt').html(choicePrompt)
    $('#options').html(stringOptions.map(renderOption).join(''))
    function chosenOptions() {
        const result = []
        for (var i = 0; i < options.length; i++) {
            if (chosen[i]) result.push(options[i][1])
        }
        return result
    }
    function isReady() {
        return multichoiceValidator(chosenOptions())
    }
    function setReady() {
        if (isReady()) {
            $(`[option='submit']`).attr('choosable', true)
        } else {
            $(`[option='submit']`).removeAttr('choosable')
        }
    }
    if (multichoiceValidator != null) setReady(isReady())
    if (!undoable) $(`[option='undo']`).removeAttr('choosable')
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < options.length; i++) {
            const j = i;
            const elem = $(`[option='${i}']`)
            elem.on('click', function (e) {
                if (multichoiceValidator == null) {
                    clearChoice()
                    resolve(options[j][1])
                } else {
                    elem.attr('chosen', elem.attr('chosen') != 'true')
                    chosen[j] = (chosen[j] != true)
                    setReady()
                }
            })
        }
        if (multichoiceValidator != null) {
            $(`[option='submit']`).on('click', function(e) {
                if (isReady()) resolve(chosenOptions())
            })
        }
        if (undoable) {
            $(`[option='undo']`).on('click', function(e) {
                reject(new Undo(state))
            })
        }
    })
}

//TODO: introduce an isPayable for costs?
function actChoice(state) {
    const validSupplies = state.supplies.filter(x => (x.cost(state).coin <= state.coin))
    const validHand = state.hand
    const validPlay = state.play.filter(x => (x.abilities().length > 0))
    const cards = validSupplies.concat(validHand).concat(validPlay)
    return choice(state,
        'Play from your hand, use an ability, or buy from a supply.',
        cards.map(asChoice))
}

function supplyKey(card) {
    return card.cost(emptyState).coin
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2)
}

class Undo extends Error { 
    constructor(state) {
        super('Undo')
        this.state = state
    }
}

// Invariant: starting from checkpoint and replaying the history gets you to the current state
// To maintain this invariant, we need to record history every time there is a change
function checkpoint(state) {
    return updates(state, {history:[], checkpoint:state})
}

// backup(state) leads to the same place as state if you run mainLoop, but it has more future
// this enables undoing by backing up until you have future, then just popping from the future
function backup(state) {
    return updates(state.checkpoint, {future: state.history.concat(state.future)})
}

function popLast(xs) {
    const n = xs.length
    return [xs[n-1], xs.slice(0, n-1)]
}

function shiftFirst(xs) {
    return [xs[0], xs.slice(1)]
}


async function mainLoop(state) {
    state = checkpoint(state)
    renderState(state)
    try {
        state = await act(state)
        return state
    } catch (error) {
        if (error instanceof Undo) {
            state = error.state
            while (state.future.length == 0) {
                if (state.checkpoint == null) {
                    throw Error("tried to undo past beginning of time")
                } else {
                    state = backup(state)
                }
            }
            const [last, future] = popLast(state.future)
            if (last[0] == 'choice') {
                return update(state, 'future', future)
            } else {
                throw Error("tried to undo past randomness")
            }
        } else {
            throw error
        }
    }
}

async function playGame(seed=null) {
    var state = emptyState
    const startingDeck = [copper, copper, copper, copper, copper,
                          copper, copper, estate, estate, estate]
    state = await doAll(startingDeck.map(x => create(x, 'deck')))(state);
    [state, variableSupplies] = randomChoices(state, mixins, 12, seed)
    variableSupplies.sort(supplySort)
    if (testing.length > 0) testing.push(freeMoney)
    if (testing.length > 0) testing.push(freeTutor)
    const kingdom = coreSupplies.concat(variableSupplies).concat(testing)
    state = await doAll(kingdom.map(x => create(x, 'supplies')))(state)
    state = await trigger({type:'gameStart'})(state)
    while (state.points < 50) {
        state = await mainLoop(state)
    }
    renderState(state)
    $('#choicePrompt').html(`You got to 50vp using ${state.time} time!`)
}

function getSeed() {
    const seed = new URLSearchParams(window.location.search).get('seed')
    const n = Number(seed)
    return (seed == null || isNaN(n)) ? null : seed

}

function load() {
    playGame(getSeed())
}

//
// ----------------- CARDS ----------------- 
//

const coreSupplies = []
const mixins = []
const testing = []

//
// ------ CORE ------ 
//

const reboot = new Card('Reboot', {
    fixedCost: time(3),
    effect: card => ({
        description: 'Put your hand and discard pile into your deck, lose all $, and +5 cards.',
        effect: doAll([
            setCoins(0),
            moveWholeZone('hand', 'deck'),
            moveWholeZone('discard', 'deck'),
            draw(5, 'reboot')
        ])
    })
})
coreSupplies.push(reboot)

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

//
// ----- MIXINS ----- 
//

function buyable(card, n, test=null) {
    mixins.push(gainCard(card, coin(n)))
    if (test=='test') testing.push(gainCard(card, coin(n)))
}

const throneRoom = new Card('Throne Room', {
    fixedCost: time(1),
    effect: card => ({
        description: `Play a card in your hand. Then if it's in your discard pile play it again.`,
        effect: async function(state) {
            [state, card] = await choice(state,
                'Choose a card to play twice.',
                state.hand.map(asChoice))
            if (card == null) return state
            state = await card.play('throneRoom')(state)
            const [newCard, zone] = find(state, card.id)
            if (zone == 'discard') state = await newCard.play('throneRoom')(state)
            return state
        }
    })
})
buyable(throneRoom, 4)

const crown = new Card('Crown', {
    fixedCost: time(0),
    effect: card => ({
        description: `Pay the cost of a card in your hand to play it. Then if it's in your discard pile play it again.`,
        effect: doOrAbort(async function(state) {
            [state, card] = await choice(state,
                'Choose a card to play twice.',
                state.hand.map(asChoice))
            if (card == null) return state
            state = await card.payCost()(state)
            state = await card.play('crown')(state)
            const [newCard, zone] = find(state, card.id)
            if (zone == 'discard') state = await newCard.play('crown')(state)
            return state
        })
    })
})
buyable(crown, 5)

const mule = new Card('Mule', {
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
})
mixins.push(gainCard(mule, coin(2)))


const smithy = new Card('Smithy', {
    fixedCost: time(1),
    effect: card => ({
        description: '+3 cards',
        effect: draw(3)
    })
})
buyable(smithy, 4)

const tutor = new Card('Tutor', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Put any card from your deck into your hand.',
        effect: async function(state) {
            [state, toDraw] = await choice(state,
                'Choose a card to put in your hand.',
                state.deck.map(asChoice))
            if (toDraw == null) return state
            return move(toDraw, 'hand')(state)
        }
    })
})
buyable(tutor, 3)

const cellar = new Card('Cellar', {
    fixedCost: time(0),
    effect: card => ({
        description: 'Discard any number of cards in your hand, then draw that many cards.',
        effect: async function(state) {
            [state, toDiscard] = await choice(state, 'Choose any number of cards to discard.',
                state.hand.map(asChoice), xs => true)
            //TODO: discard all at once
            state = await moveMany(toDiscard, 'discard')(state)
            return draw(toDiscard.length)(state)
        }
    })
})
buyable(cellar, 2)

const sage = new Card('Sage', {
    fixedCost: time(0),
    effect: _ => ({
        description: 'Set aside a random card from your deck. Put it into either your deck or discard pile. +1 card.',
        effect: async function(state) {
            if (state.deck.length > 0) {
                [state, card] = randomChoice(state, state.deck)
                state = await move(card, 'aside')(state);
                [state, targetZone] = await choice(state, `Discard ${card.name} or put it in your deck?`,
                    [[['string', 'Discard'], 'discard'], [['string', 'Deck'], 'deck']])
                state = await move(card, targetZone)(state)
            }
            return draw(1)(state)
        }
    })
})
buyable(sage, 1)

const peddler = new Card('Peddler', {
    fixedCost: time(0),
    effect: card => ({
        description: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    })
})
const makePeddler = new Card('Peddler', {
    fixedCost: coin(5),
    effect: card => ({
        description: 'Create a peddler in your deck.',
        effect: create(peddler, 'deck')
    }),
    relatedCards: [peddler]
})
mixins.push(makePeddler)

async function freeAction(state) {
    options = state.hand.filter(card => (card.cost(state).time <= 1)).map(asChoice);
    [state, target] = await choice(state, 'Choose a card costing up to @ to play',allowNull(options))
    return (target == null) ? state : target.play()(state)
}

const village = new Card('Village', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1 card. You may play a card in your hand costing up to @, twice.',
        effect: doAll([draw(1), freeAction, freeAction])
    })
})
buyable(village, 3)

const bazaar = new Card('Bazaar', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1 card. +$1. You may play a card in your hand costing up to @, twice.',
        effect: doAll([draw(1), gainCoin(1), freeAction, freeAction])
    })
})
buyable(bazaar, 5)

const workshop = new Card('Workshop', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Buy a card in the supply costing up to $4.',
        effect: async function(state) {
            options = state.supplies.filter(card => (card.cost(state).coin <= 4 && card.cost(state).time <= 0));
            [state, target] = await choice(state, 'Choose a card costing up to $4 to buy.',
                allowNull(options.map(asChoice)))
            return target.buy('workshop')(state)
        }
    })
})
buyable(workshop, 3)

const feast = new Card('Feast', {
    fixedCost: time(0),
    effect: card => ({
        description: 'Buy a card costing up to $6. Trash this.',
        effect: async function(state) {
            options = state.supplies.filter(card => (card.cost(state).coin <= 6 && card.cost(state).time <= 0));
            [state, target] = await choice(state, 'Choose a card costing up to $6 to buy.',
                allowNull(options.map(asChoice)))
            state = await target.buy('feast')(state)
            return trash(card)(state)
        },
        skipDiscard:true,
    })
})
buyable(feast, 4)

//TODO: let Reboot choose cards arbitrarily if it costs 0
const warFooting = new Card('War Footing', {
    replacers: card => [{
        description: 'Reboot costs @ less to play.',
        handles: x => (x.type == 'cardCost' && x.card == 'Reboot'),
        replace: applyToKey('cost', applyToKey('time', x=>Math.max(0, x-1)))
    }]
})
const gainWarFooting = new Card('War Footing', {
    calculatedCost: (card, state) => ({time:0, coin:15+10*card.charge}),
    effect: card => ({
        description: `Create a ${card.relatedCards()[0]} in play.` + 
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(warFooting, 'play'), charge(card, 1)])
    }),
    relatedCards: [warFooting],
})
mixins.push(gainWarFooting)

const junkDealer = new Card('Junk Dealer', {
    fixedCost: time(0),
    effect: card => ({
        description: '+1 card. +$1.',
        effect: async function(state) {
            state = await draw(1)(state);
            state = await gainCoin(1)(state);
            [state, target] = await choice(state, 'Choose a card to trash.', state.hand.map(asChoice))
            return (target == null) ? state : trash(target)(state)
        }
    })
})
buyable(junkDealer, 5)

const refresh = new Card('Refresh', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Put any number of cards from your discard pile into your deck.',
        effect: async function(state) {
            [state, cards] = await choice(state, 'Choose any number of cards to move to your deck.',
                state.discard.map(asChoice), xs => true)
            return moveMany(cards, 'deck')(state)
        }
    })
})
mixins.push(refresh)

const plough = new Card('Plough', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Put any number of cards from your discard pile into your deck. +2 cards.',
        effect: async function(state) {
            [state, cards] = await choice(state, 'Choose any number of cards to move to your deck.',
                state.discard.map(asChoice), xs => true)
            state = await moveMany(cards, 'deck')(state)
            return draw(2)(state)
        }
    })
})
buyable(plough, 4)

const vassal = new Card('Vassal', {
    fixedCost: time(1),
    effect: card => ({
        description: "+$2. Look at a random card from your deck. You may play it.",
        effect: async function(state) {
            state = await gainCoin(2)(state);
            [state, target] = randomChoice(state, state.deck)
            if (target != null) [state, target] = await choice(state, `Play ${target.name}?`,
                allowNull([asChoice(target), [['string', 'Play'], target]], "Don't play"))
            return (target == null) ? state : target.play('vassal')(state)
        }
    })
})
buyable(vassal, 3)

const reinforce = new Card('Reinforce', {
    fixedCost: {time:2, coin:7},
    effect: card => ({
        description: 'Put a reinforce token on a card in your hand.',
        effect: async function(state) {
            [state, card] = await choice(state,
                'Choose a card to put a reinforce token on.',
                state.hand.map(asChoice))
            if (card == null) return state
            return addToken(card.id, 'reinforce')(state)
        }
    }),
    triggers: card => [{
        'description': "After playing a card with a reinforce token other than with reinforce, if it's in your discard plile play it again.",
        'handles':e => (e.type == 'afterPlay' && e.card.tokens.includes('reinforce') && e.source != 'reinforce'),
        'effect':e => async function(state) {
            const [played, zone] = find(state, e.card.id)
            return (zone == 'discard') ? played.play('reinforce')(state) : state
        }
    }],
})
mixins.push(reinforce)

const blacksmith = new Card('Blacksmith', {
    fixedCost: time(1),
    effect: card => ({
        description: '+1 card per charge token on this, then add a charge token to this.',
        effect: doAll([draw(card.charge), charge(card, 1), move(card, 'discard')]),
        skipDiscard: true
    })
})
buyable(blacksmith, 2)

const expedite = new Card('Expedite', {
    calculatedCost: (card, state) => ({time:1, coin:card.charge}),
    effect: card => ({
        description: 'The next time you gain a card this turn, put it into your hand.'+
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: doAll([charge(card, 1), nextTime(
            e => (e.type == 'create'),
            e => move(e.card, 'hand')
        )])
    })
})
mixins.push(expedite)

const goldMine = new Card('Gold Mine', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Create two golds in your deck.',
        effect: doAll([create(gold, 'deck'), create(gold, 'deck')]),
    })
})
buyable(goldMine, 6)

const vault = new Card('Vault', {
    fixedCost: time(1),
    effect: card => ({
        description: '+2 cards. Discard any number of cards from your hand, +$1 per card discarded.',
        effect: async function(state) {
            state = await draw(2)(state);
            [state, toDiscard] = await choice(state, 'Discard any number of cards for +$1 each.',
                state.hand.map(asChoice), xs => true)
            state = await moveMany(toDiscard, 'discard')(state)
            return gainCoin(toDiscard.length)(state)
        }
    })
})
buyable(vault, 5)

const cursedProvince = new Card('Cursed Province', {
    fixedCost: time(0),
    effect: card => ({
        description: '+3 vp. Put a charge token on this.',
        effect: doAll([gainPoints(3), charge(card, 1)])
    })
})
const gainCursedProvince = new Card('Cursed Province', {
    fixedCost: coin(5),
    relatedCards: [cursedProvince],
    effect: card => ({
        description: 'Create a Cursed Province in your discard pile.',
        effect: create(cursedProvince, 'discard')
    }),
    triggers: card => [{
        description: 'Whenever you put a Cursed Province into your hand, +@ for each charge token on it.',
        handles: e => (e.type == 'moved' && e.card.name == 'Cursed Province' && e.toZone == 'hand'),
        effect: e => gainTime(e.card.charge)
    }]
})
mixins.push(gainCursedProvince)

const junkyard = new Card('Junkyard', {
    fixedCost: time(0),
    triggers: card => [{
        description: 'Whenever you trash a card, +1 vp.',
        handles: e => (e.type == 'moved' && e.toZone == null),
        effect: e => gainPoints(1)
    }]
})
mixins.push(makeCard(junkyard, {coin:7, time:3}))


const bustlingSquare = new Card('Bustling Square', {
    fixedCost: time(1),
    effect: card => ({
        description: `+1 card. Set aside all cards in your hand. Play them in any order.`,
        effect: async function(state) {
            state = await draw(1)(state)
            var ids = state.hand.map(x => x.id)
            state = await moveWholeZone('hand', 'aside')(state)
            while (ids.length > 0) {
                [state, id] = await choice(state, 'Choose which card to play next.',
                    ids.map(x => [['card', x], x]))
                state = await playById(id, 'bustlingSquare')(state)
                ids = ids.filter(x => x != id)
            }
            return state
        }
    })
})
buyable(bustlingSquare, 6)

const colony = new Card('Colony', {
    fixedCost: time(1),
    effect: card => ({
        description: '+5vp',
        effect: gainPoints(5),
    })
})
buyable(colony, 16)

const windfall = new Card('Windfall', {
    fixedCost: {time:0, coin:6},
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
        effect: doAll([draw(2), trash(card)])
    })
})
buyable(horse, 2)

const lookout = new Card('Lookout', {
    fixedCost: time(0),
    effect: card => ({
        description: 'Look at 3 random cards from your deck. Trash one.',
        effect: async function(state) {
            [state, picks] = randomChoices(state, state.deck, 3)
            async function pickOne(descriptor, zone, state) {
                [state, pick] = await choice(state, `Pick a card to ${descriptor}.`,
                    picks.map(card => [['card', card.id], card]))
                picks = picks.filter(card => card.id != pick.id)
                return move(pick, zone)(state)
            }
            if (picks.length > 0) 
                state = await pickOne('trash', null, state)
            return state
        }
    })
})
buyable(lookout, 1)

const lab = new Card('Lab', {
    fixedCost: time(0),
    effect: card => ({
        description: '+2 cards',
        effect: draw(2)
    })
})
buyable(lab, 5)

const roadNetwork = new Card('Road Network', {
    fixedCost: time(0),
    triggers: _ => [{
        description: 'Whenever you create a card in your discard pile, move it to your deck.',
        handles: e => (e.type == 'create' && e.toZone == 'discard'),
        effect: e => move(e.card, 'deck')
    }]
})
mixins.push(makeCard(roadNetwork, coin(5)))

const twins = new Card('Twins', {
    fixedCost: time(0),
    triggers: card => [{
        description: "When you finish playing a card other than with Twins, if it costs @ or more then you may play a card in your hand with the same name.",
        handles: (e, state) => (e.type == 'afterPlay' && e.source != 'twins' && e.card.cost(state).time >= 1),
        effect: e => async function(state) {
            const cardOptions = state.hand.filter(x => x.name == e.card.name)
            if (cardOptions.length == 0) return state;
            [state, replay] = await choice(state, `Choose a card named '${e.card.name}' to play.`,
                cardOptions.map(asChoice).concat([[['string', "Don't play"], null]]))
            return (replay == null) ? state : replay.play('twins')(state)
        }
    }]
})
mixins.push(makeCard(twins, {time:0, coin:6}))
testing.push(makeCard(twins, {time:0, coin:6}))

const masterSmith = new Card('Master Smith', {
    fixedCost: time(2),
    effect: card => ({
        description: '+5 cards',
        effect: draw(5),
    })
})
buyable(masterSmith, 5)

const reuse = new Card('Reuse', {
    calculatedCost: (card, state) => ({time:1, coin:card.charge}),
    effect: card => ({
        description: 'Put a card from your discard into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: async function(state) {
            [state, target] = await choice(state, 'Choose a card to put into your hand.',
                state.discard.map(asChoice))
            state = await charge(card, 1)(state)
            return (target == null) ? state : move(target, 'hand')(state)
        }
    })
})
mixins.push(reuse)

const reconfigure = new Card('Reconfigure', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your hand and discard pile into your deck, lose all $, and +1 card per card that was in your hand.',
        effect: async function(state) {
            const n = state.hand.length
            return doAll([
                setCoins(0),
                moveWholeZone('hand', 'deck'),
                moveWholeZone('discard', 'deck'),
                draw(n, 'reconfigure')
            ])(state)
        }
    })
})
mixins.push(reconfigure)

const bootstrap = new Card('Bootstrap', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your hand and discard pile into your deck, lose all $, and +3 cards.',
        effect: doAll([
            setCoins(0),
            moveWholeZone('hand', 'deck'),
            moveWholeZone('discard', 'deck'),
            draw(3, 'bootstrap')
        ])
    })
})
mixins.push(bootstrap)

const retry = new Card('Resume', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your hand into your discard pile, lose all $, and +5 cards.',
        effect: doAll([
            setCoins(0),
            moveWholeZone('hand', 'discard'),
            draw(5, 'retry')
        ])
    })
})
mixins.push(retry)

const research = new Card('Research', {
    calculatedCost: (card, state) => ({time:1, coin:2 * card.charge}),
    effect: card => ({
        description: 'Put a card from your deck into your hand. Put a charge token on this. This costs +$2 per charge token on it.',
        effect: async function(state) {
            [state, target] = await choice(state, 'Choose a card to put into your hand.',
                state.deck.map(asChoice))
            state = await charge(card, 1)(state)
            return (target == null) ? state : move(target, 'hand')(state)
        }
    })
})
mixins.push(research)

const platinum = new Card("Platinum", {
    fixedCost: time(0),
    effect: card => ({
        description: '+$5',
        effect: gainCoin(5)
    })
})
buyable(platinum, 10)

//TODO: this should probably be an ability that makes a next time aura rather than an optoinal trigger?
const innovation = new Card("Innovation", {
    triggers: card => [{
        description: "Whenever you create a card in your discard pile, you may discard your hand, lose all $, and play it.",
        handles: e => (e.type == 'create' && e.toZone == 'discard'),
        effect: e => async function(state) {
            [state, activate] = await choice(state, `Do you want to discard your hand, lose all $, and play ${e.card.name}?`, yesOrNo)
            if (!activate) return state
            state = await moveWholeZone('hand', 'discard')(state)
            state = await setCoins(0)(state)
            return e.card.play('innovation')(state)
        }
    }]
})
mixins.push(makeCard(innovation, {coin:8, time:0}, true))

const citadel = new Card("Citadel", {
    triggers: card => [{
        description: `After playing a card other than with ${card.name}, if it's the only card in your discard pile, play it again.`,
        handles: e => (e.type == 'afterPlay' && e.source != 'citadel'),
        effect: e => async function(state) {
            if (find(state, e.card.id)[1] == 'discard' && state.discard.length == 1) {
                return e.card.play('citadel')(state)
            } else {
                return state
            }
        }
    }]
})
mixins.push(makeCard(citadel, {coin:8, time:0}, true))

const foolsGold = new Card("Fool's Gold", {
    fixedCost: time(0),
    effect: card => ({
        description: "+$1. +$1 per Fool's Gold in your discard pile.",
        effect: async function(state) {
            n = state.discard.filter(x => x.name == card.name).length
            return gainCoin(n+1)(state)
        }
    })
})
buyable(foolsGold, 2)

const hireling = new Card('Hireling', {
    fixedCost: time(0),
    replacers: card => [{
        description: "Whenever you draw a card from Reboot, draw an additional card.",
        handles: x => (x.type == 'draw', x.source == 'reboot'),
        replace: (x, state) => update(x, 'draw', x.draw+1),
    }]
})
mixins.push(makeCard(hireling, {coin:6, time:2}))

const sacrifice = new Card('Sacrifice', {
    fixedCost: time(0),
    effect: _ => ({
        description: 'Play a card in your hand, then trash it.',
        effect: async function(state) {
            [state, card] = await choice(state,
                'Choose a card to play and trash.',
                state.hand.map(asChoice))
            if (card == null) return state
            state = await card.play('sacrifice')(state)
            return await move(card, null)(state)
        }
    })
})
buyable(sacrifice, 2)
 
const horseTraders = new Card('Horse Traders', {
    fixedCost: time(1),
    effect: _ => ({
        description: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    })
})
buyable(horseTraders, 4)

const purge = new Card('Purge', {
    fixedCost: time(5),
    effect: card => ({
        description: 'Trash any number of cards from your hand. Trash this.',
        effect: async function(state) {
            [state, toTrash] = await choice(state, 'Choose any number of cards to trash.',
                state.hand.map(asChoice), (xs => true))
            state = await moveMany(toTrash, null)(state)
            return trash(card)(state)
        }
    })
})
mixins.push(purge)

const chapel = new Card('Chapel', {
    fixedCost: time(1),
    effect: _ => ({
        description: 'Trash up to four cards from your hand.',
        effect: async function(state) {
            [state, toTrash] = await choice(state, 'Choose up to four cards to trash.',
                state.hand.map(asChoice), (xs => xs.length <= 4))
            return moveMany(toTrash, null)(state)
        }
    })
})
buyable(chapel, 3)

const coppersmith = new Card('Coppersmith', {
    fixedCost: time(1),
    effect: card => ({
        description: 'Put all coppers in your discard pile into your hand.',
        effect: async function(state) {
            return moveMany(state.discard.filter(x => x.name == 'Copper'), 'hand')(state)
        }
    })
})
buyable(coppersmith, 3)

const harvest = new Card('Harvest', {
    fixedCost: time(1),
    effect: _ => ({
        description: '+$1 per differently named card in your hand, up to +$4.',
        effect: async function(state) {
            return gainCoin(Math.min(4, countDistinct(state.hand.map(x => x.name))))(state)
        }
    })
})
buyable(harvest, 4)

const fortify = new Card('Fortify', {
    fixedCost: time(2),
    effect: card => ({
        description: 'Put your discard pile in your hand. Trash this.',
        effect: doAll([moveWholeZone('discard', 'hand'), trash(card)]),
        skipDiscard:true,
    })
})
const gainFortify = new Card('Fortify', {
    fixedCost: coin(5),
    effect: card => ({
        description: 'Create a fortify in your discard pile. Discard your hand.',
        effect: doAll([moveWholeZone('hand', 'discard'), create(fortify, 'discard')])
    }),
    relatedCards: [fortify],
})
mixins.push(gainFortify)

const pathfinding = new Card('Pathfinding', {
    fixedCost: {time:1, coin:5},
    effect: card => ({
        description: 'Put a path token on a card in your hand.',
        effect: async function(state) {
            [state, card] = await choice(state,
                'Choose a card to put a path token on.',
                state.hand.map(asChoice))
            if (card == null) return state
            return addToken(card.id, 'path')(state)
        }
    }),
    triggers: card => [{
        description: 'Whenever you play a card, draw a card per path token on it.',
        handles:e => (e.type == 'play' && e.card.tokens.includes('path')),
        effect:e => draw(countTokens(e.card, 'path'))
    }],
})
mixins.push(pathfinding)

// ------------------ Testing -------------------

const freeMoney = new Card('Free money', {
    fixedCost: time(0),
    effect: card => ({
        description: '+$10',
        effect: gainCoin(10)
    })
})

const freeTutor = new Card('Free tutor', {
    fixedCost: time(0),
    effect: card => ({
        description: 'Put any card from your deck or discard pile into your hand.',
        effect: async function(state) {
            [state, toDraw] = await choice(state,
                'Choose a card to put in your hand.',
                state.deck.concat(state.discard).map(asChoice))
            if (toDraw == null) return state
            return move(toDraw, 'hand')(state)
        }
    })
})
