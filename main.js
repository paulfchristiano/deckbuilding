// TODO: render tokens more nicely if there are multiples
// TODO: nicer architecture where we separate out intrinsic properties of cards from charge/tokens/etc.?
// TODO: use types
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: History?
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: annoying how undo jumps around
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
// returns a copy x of object with x.k = v for all k:v in kvs
function updates(object, kvs) {
    var result = Object.assign({}, object);
    Object.assign(result, kvs);
    Object.setPrototypeOf(result, Object.getPrototypeOf(object));
    return result;
}
// returns a copy of x object with x.key = value
function update(object, key, value) {
    var result = Object.assign({}, object);
    result[key] = value;
    Object.setPrototypeOf(result, Object.getPrototypeOf(object));
    return result;
}
// the function that sets x.k = f(x.k)
function applyToKey(k, f) {
    return function (x) { return update(x, k, f(x[k])); };
}
//TODO: operating on a given card involves a linear scan, could speed up with clever datastructure
// the function that applies f to the card with a given id
function applyToCard(card, f) {
    var id = card.id;
    return function (state) {
        var _a = __read(find(state, id), 2), _ = _a[0], zone = _a[1];
        return (zone == null) ? state : update(state, zone, state[zone].map(function (x) { return (x.id == id) ? f(x) : x; }));
    };
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var triggers, effects;
            return __generator(this, function (_a) {
                triggers = state.play.concat(state.supplies).concat(state.auras).map(function (x) { return x.triggers().map(function (y) { return [x, y]; }); }).flat();
                triggers = triggers.filter(function (trigger) { return trigger[1].handles(e, state); });
                effects = triggers.map(function (trigger) { return function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var shadow;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = __read(addShadow(state, trigger[0], 'trigger', trigger[1].description), 2), state = _a[0], shadow = _a[1];
                                    state = startTick(trigger[0])(state);
                                    return [4 /*yield*/, trigger[1].effect(e)(state)];
                                case 1:
                                    state = _b.sent();
                                    state = endTick(trigger[0])(state);
                                    state = removeShadow(state, shadow);
                                    return [2 /*return*/, state];
                            }
                        });
                    });
                }; });
                return [2 /*return*/, doAll(effects)(state)];
            });
        });
    };
}
//x is an event that is about to happen
//each card in play and aura can change properties of x
function replace(x, state) {
    var replacers = state.play.concat(state.supplies).concat(state.auras).map(function (x) { return x.replacers(); }).flat();
    for (var i = 0; i < replacers.length; i++) {
        var replacer = replacers[i];
        if (replacer.handles(x, state)) {
            x = replacer.replace(x, state);
        }
    }
    return x;
}
//the effect that adds aura
function addAura(aura) {
    return function (state) {
        var state, newaura;
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                _a = __read(assignUID(state, aura), 2), state = _a[0], newaura = _a[1];
                return [2 /*return*/, update(state, 'auras', state.auras.concat([newaura]))];
            });
        });
    };
}
//the effect that deletes an aura with the given id,
function deleteAura(id) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = removeIfPresent(state.auras, id);
                if (result.found) {
                    return [2 /*return*/, update(state, 'auras', result.without)];
                }
                else {
                    return [2 /*return*/, state];
                }
                return [2 /*return*/];
            });
        });
    };
}
function clearAurasFrom(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, update(state, 'auras', state.auras.filter(function (x) { return x.source.id != card.id; }))];
            });
        });
    };
}
//add an aura that triggers what(e) next time an event matching when(e) occurs, then deletes itself
function nextTime(when, what, source) {
    if (source === void 0) { source = {}; }
    var aura = {
        replacers: function () { return []; },
        triggers: function () {
            var id = this.id;
            return [{
                    handles: function (e) { return when(e); },
                    effect: function (e) { return doAll([deleteAura(id), what(e)]); }
                }];
        },
        source: source
    };
    return addAura(aura);
}
function applyToLast(f) {
    return function (xs) {
        return xs.slice(0, xs.length - 1).concat([f(xs[xs.length - 1])]);
    };
}
//applies the function f to the latest shadow that matches the card
//(this would cause trouble if a card had a shadow and then was played the normal way)
//TODO: probably in ticks a card should just record the shadow that it wants to tick with it
function updateLastShadow(state, card, f) {
    var lastIndex = null;
    for (var i = 0; i < state.resolving.length; i++) {
        var x = state.resolving[i];
        if (x instanceof Shadow && x.original.id == card.id) {
            lastIndex = i;
        }
    }
    if (lastIndex == null)
        return state;
    return applyToKey('resolving', function (xs) { return xs.map(function (x, i) { return (i == lastIndex) ? f(x) : x; }); })(state);
}
// this updates a state by incrementing the tick on the given card,
// and ticking its shadow
function tick(card) {
    return function (state) {
        state = applyToCard(card, applyToKey('ticks', applyToLast(function (x) { return x + 1; })))(state);
        state = updateLastShadow(state, card, applyToKey('tick', function (x) { return x + 1; }));
        return state;
    };
}
function startTick(card) {
    return applyToCard(card, applyToKey('ticks', function (xs) { return xs.concat([1]); }));
}
// or by removing the tick
function endTick(card) {
    return applyToCard(card, applyToKey('ticks', function (xs) { return xs.slice(0, xs.length - 1); }));
}
var Card = /** @class */ (function () {
    function Card(name, props) {
        this.charge = 0;
        this.ticks = [0];
        this.tokens = [];
        this.name = name;
        this.props = props;
    }
    Card.prototype.toString = function () {
        return this.name;
    };
    // cost can depend on the state of the game
    // is measured in time
    Card.prototype.baseCost = function (state) {
        if (state === void 0) { state = null; }
        if (this.props.fixedCost != undefined)
            return this.props.fixedCost;
        else if (this.props.calculatedCost != undefined)
            return this.props.calculatedCost(this, state);
        else
            return { coin: 0, time: 0 };
    };
    // the cost after replacement effects
    Card.prototype.cost = function (state) {
        var thisCard = this;
        var initialCost = { type: 'cost', card: thisCard, cost: thisCard.baseCost() };
        var newCost = replace(initialCost, state);
        return newCost.cost;
    };
    // the effect that actually pays the cost
    Card.prototype.payCost = function () {
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cost;
                return __generator(this, function (_a) {
                    cost = card.cost(state);
                    return [2 /*return*/, doAll([gainTime(cost.time), payCoin(cost.coin)])(state)];
                });
            });
        };
    };
    Card.prototype.effect = function () {
        return callOr(this.props.effect, this, { description: '' });
    };
    Card.prototype.buy = function (source) {
        if (source === void 0) { source = {}; }
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var zone, shadow, _a, newCard, _;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = __read(find(state, card.id), 2), card = _b[0], zone = _b[1];
                            if (card == null)
                                return [2 /*return*/];
                            return [4 /*yield*/, trigger({ type: 'buy', card: card, source: source })(state)];
                        case 1:
                            state = _d.sent();
                            _c = __read(addShadow(state, card, 'buy'), 2), state = _c[0], shadow = _c[1];
                            state = startTick(card)(state);
                            return [4 /*yield*/, card.effect().effect(state)];
                        case 2:
                            state = _d.sent();
                            state = endTick(card)(state);
                            state = removeShadow(state, shadow);
                            _a = __read(find(state, card.id), 2), newCard = _a[0], _ = _a[1];
                            return [2 /*return*/, trigger({ type: 'afterBuy', before: card, after: newCard, source: source })(state)];
                    }
                });
            });
        };
    };
    Card.prototype.play = function (source) {
        if (source === void 0) { source = {}; }
        var effect = this.effect();
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var zone, _a, newCard, _;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = __read(find(state, card.id), 2), card = _b[0], zone = _b[1];
                            if (card == null)
                                return [2 /*return*/];
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 1:
                            state = _c.sent();
                            return [4 /*yield*/, trigger({ type: 'play', card: card, source: source })(state)];
                        case 2:
                            state = _c.sent();
                            state = startTick(card)(state);
                            return [4 /*yield*/, effect.effect(state)];
                        case 3:
                            state = _c.sent();
                            if (!!effect['skipDiscard']) return [3 /*break*/, 5];
                            return [4 /*yield*/, move(card, 'discard')(state)];
                        case 4:
                            state = _c.sent();
                            _c.label = 5;
                        case 5:
                            state = endTick(card)(state);
                            _a = __read(find(state, card.id), 2), newCard = _a[0], _ = _a[1];
                            return [2 /*return*/, trigger({ type: 'afterPlay', before: card, after: newCard, source: source })(state)];
                    }
                });
            });
        };
    };
    Card.prototype.triggers = function () {
        return callOr(this.props.triggers, this, []);
    };
    Card.prototype.abilities = function () {
        return callOr(this.props.abilities, this, []);
    };
    Card.prototype.replacers = function () {
        return callOr(this.props.replacers, this, []);
    };
    Card.prototype.relatedCards = function () {
        return this.props.relatedCards || [];
    };
    return Card;
}());
function callOr(f, x, fallback) {
    return (f == undefined) ? fallback : f(x);
}
// these are displayed in the resolving area to help track what's going on
var Shadow = /** @class */ (function () {
    function Shadow(original, kind, text) {
        this.tick = 1;
        this.original = original;
        this.kind = kind;
        this.text = text;
    }
    return Shadow;
}());
function addShadow(state, original, kind, text) {
    var _a;
    var shadow;
    _a = __read(assignUID(state, new Shadow(original, kind, text)), 2), state = _a[0], shadow = _a[1];
    state = applyToKey('resolving', function (xs) { return xs.concat([shadow]); })(state);
    return [state, shadow];
}
function removeShadow(state, shadow) {
    return applyToKey('resolving', function (xs) { return xs.filter(function (x) { return x.id != shadow.id; }); })(state);
}
function getShadow(state, card) {
    for (var i = 0; i < state.resolving.length; i++) {
        if (state.resolving[i] instanceof Shadow && state.resolving[i].original.id == card.id) {
            return state.resolving[i];
        }
    }
}
function a(x) {
    var s = x.toString();
    var c = s[0].toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s;
    return 'a ' + s;
}
function assignUID(state, card) {
    var id = state.nextID;
    return [update(state, 'nextID', id + 1), update(card, 'id', id)];
}
function create(card, toZone, loc) {
    if (toZone === void 0) { toZone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(assignUID(state, card), 2), state = _a[0], card = _a[1];
                        return [4 /*yield*/, addToZone(card, toZone, loc)(state)];
                    case 1:
                        state = _b.sent();
                        return [2 /*return*/, trigger({ type: 'create', card: card, toZone: toZone })(state)];
                }
            });
        });
    };
}
function recycle(cards) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                _a = __read(randomChoices(state, cards, cards.length), 2), state = _a[0], cards = _a[1];
                return [2 /*return*/, moveMany(cards, 'deck')(state)];
            });
        });
    };
}
function comesBefore(card1, card2) {
    var key = function (card) { return card.name + card.charge + card.tokens.join(''); };
    return key(card1) < (key(card2));
}
function insertAt(card, zone, i) {
    return zone.slice(0, i).concat([card]).concat(zone.slice(i));
}
function insertSorted(card, zone) {
    for (var i = 0; i < zone.length; i++) {
        if (comesBefore(card, zone[i]))
            return insertAt(card, zone, i);
    }
    return zone.concat([card]);
}
function addToZone(card, zoneName, loc) {
    if (loc === void 0) { loc = 'end'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var insert;
            return __generator(this, function (_a) {
                if (loc == 'end' || loc == 'bottom') {
                    insert = function (card, zone) { return zone.concat([card]); };
                }
                else if (loc == 'start' || loc == 'top') {
                    insert = function (card, zone) { return [card].concat(zone); };
                }
                else if (loc == 'sorted') {
                    insert = insertSorted;
                }
                else {
                    insert = function (card, zone) { return insertAt(card, zone, loc); };
                }
                state = update(state, zoneName, insert(card, state[zoneName]));
                return [2 /*return*/, trigger({ type: 'added', zone: zoneName, card: card, loc: loc })(state)];
            });
        });
    };
}
function removeIfPresent(xs, id) {
    for (var i = 0; i < xs.length; i++) {
        if (xs[i].id == id) {
            return {
                found: true,
                card: xs[i],
                without: xs.slice(0, i).concat(xs.slice(i + 1))
            };
        }
    }
    return { found: false };
}
function find(state, id) {
    for (var i = 0; i < ZONES.length; i++) {
        var zone = state[ZONES[i]];
        for (var j = 0; j < zone.length; j++) {
            if (zone[j].id == id)
                return [zone[j], ZONES[i]];
        }
    }
    return [null, null];
}
function move(card, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _, fromZone;
            return __generator(this, function (_b) {
                _a = __read(find(state, card.id), 2), _ = _a[0], fromZone = _a[1];
                if (fromZone == null)
                    return [2 /*return*/, state];
                return [2 /*return*/, moveFromTo(card, fromZone, toZone, loc)(state)];
            });
        });
    };
}
//TODO: should we move them all at once, with one trigger?
//Could do this by changing move
function moveMany(cards, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    return doAll(cards.map(function (card) { return move(card, toZone); }));
}
function trash(card) {
    return move(card, null);
}
function moveFromTo(card, fromZone, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    if (toZone == 'hand')
        loc = 'sorted'; //TODO: this is a kind of hacky way to maintain a sort
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = removeIfPresent(state[fromZone], card.id);
                        if (!result.found)
                            return [2 /*return*/, state];
                        state = update(state, fromZone, result.without);
                        if (!(toZone != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, addToZone(result.card, toZone, loc)(state)];
                    case 1:
                        state = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, trigger({ type: 'moved', card: result.card, fromZone: fromZone, toZone: toZone })(state)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
}
function moveWholeZone(fromZone, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, moveMany(state[fromZone], toZone, loc)(state)];
            });
        });
    };
}
// pseudorandom float in [0,1] based on two integers a, b
function PRF(a, b) {
    var N = 123456789;
    return ((a * 1003303882 + b * 6690673372 + b * b * 992036483 +
        a * a * 99202618 + ((a * a + 1) / (b * b + 1)) * 399220 +
        ((b * b + 1) / (a * a + 1)) * 392901666676) % N) / N;
}
function randomChoice(state, xs, seed) {
    var _a, _b;
    if (seed === void 0) { seed = null; }
    if (xs.length == 0)
        return [state, null];
    var x;
    _a = __read(randomChoices(state, xs, 1, seed), 2), state = _a[0], _b = __read(_a[1], 1), x = _b[0];
    return [state, x];
}
function randomChoices(state, xs, n, seed) {
    var _a;
    if (seed === void 0) { seed = null; }
    var result = [];
    xs = xs.slice();
    while (result.length < n) {
        if (xs.length == 0)
            return [state, result];
        if (xs.length == 1)
            return [state, result.concat(xs)];
        var rand = void 0;
        _a = __read(doOrReplay(state, function (_) { return (seed == null) ? Math.random() : PRF(seed, result.length); }, 'rng'), 2), state = _a[0], rand = _a[1];
        var k = Math.floor(rand * xs.length);
        result.push(xs[k]);
        xs[k] = xs[xs.length - 1];
        xs = xs.slice(0, xs.length - 1);
    }
    return [state, result];
}
function draw(n, source) {
    if (source === void 0) { source = {}; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var drawParams, drawn, i, _a, nextCard, rest;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        drawParams = { type: 'draw', draw: n, source: source, effects: [] };
                        drawParams = replace(drawParams, state);
                        return [4 /*yield*/, doAll(drawParams.effects)(state)];
                    case 1:
                        state = _b.sent();
                        n = drawParams.draw;
                        drawn = 0;
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < n)) return [3 /*break*/, 5];
                        if (!(state.deck.length > 0)) return [3 /*break*/, 4];
                        _a = __read(shiftFirst(state.deck), 2), nextCard = _a[0], rest = _a[1];
                        return [4 /*yield*/, moveFromTo(nextCard, 'deck', 'hand', 'sorted')(state)];
                    case 3:
                        state = _b.sent();
                        drawn += 1;
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, trigger({ type: 'draw', drawn: drawn, triedToDraw: n, source: source })(state)];
                }
            });
        });
    };
}
function discard(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var toDiscard, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(state.hand.length <= n)) return [3 /*break*/, 1];
                        _a = [state, state.hand];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, choice(state, "Choose " + n + " cards to discard.", state.hand.map(asChoice), (function (xs) { return xs.length == n; }))];
                    case 2:
                        _a = _c.sent();
                        _c.label = 3;
                    case 3:
                        _b = __read.apply(void 0, [_a, 2]), state = _b[0], toDiscard = _b[1];
                        return [2 /*return*/, moveMany(toDiscard, 'discard')(state)];
                }
            });
        });
    };
}
var CostNotPaid = /** @class */ (function (_super) {
    __extends(CostNotPaid, _super);
    function CostNotPaid(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CostNotPaid.prototype);
        return _this;
    }
    return CostNotPaid;
}(Error));
function payCoin(n) {
    return gainCoin(-n, true);
}
function setCoins(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustment;
            return __generator(this, function (_a) {
                adjustment = n - state.coin;
                state = update(state, 'coin', n);
                return [2 /*return*/, trigger({ type: 'gainCoin', amount: adjustment, cost: false })(state)];
            });
        });
    };
}
function gainTime(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = update(state, 'time', state.time + n);
                return [2 /*return*/, trigger({ type: 'gainTime', amount: n })(state)];
            });
        });
    };
}
function gainPoints(n, source) {
    if (source === void 0) { source = {}; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { type: 'gainPoints', points: n, effects: [], source: source };
                        params = replace(params, state);
                        return [4 /*yield*/, doAll(params.effects)(state)];
                    case 1:
                        state = _a.sent();
                        n = params.points;
                        state = update(state, 'points', state.points + n);
                        return [2 /*return*/, trigger({ type: 'gainPoints', points: n, source: source })(state)];
                }
            });
        });
    };
}
function gainCoin(n, cost) {
    if (cost === void 0) { cost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustment;
            return __generator(this, function (_a) {
                if (state.coin + n < 0 && cost)
                    throw new CostNotPaid("Not enough coin");
                adjustment = state.coin + n < 0 ? -state.coin : n;
                state = update(state, 'coin', state.coin + adjustment);
                return [2 /*return*/, trigger({ type: 'gainCoin', amount: adjustment, cost: cost })(state)];
            });
        });
    };
}
function doOrAbort(f, fallback) {
    if (fallback === void 0) { fallback = null; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, f(state)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        error_1 = _a.sent();
                        if (error_1 instanceof CostNotPaid) {
                            if (fallback != null)
                                return [2 /*return*/, fallback(state)];
                            return [2 /*return*/, state];
                        }
                        else {
                            throw error_1;
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
}
function payToDo(cost, effect) {
    return doOrAbort(function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, cost(state)];
                    case 1:
                        state = _a.sent();
                        return [2 /*return*/, effect(state)];
                }
            });
        });
    });
}
// trying to pay cost is mandatory
function payOrDo(cost, effect) {
    return doOrAbort(cost, effect);
}
function removeElement(xs, i) {
    return xs.slice(i).concat(xs.slice(i + 1, xs.length));
}
//options is a list of [string, cost] pairs
function payAny(options) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var costAndIndex, _a, cost, i;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, choice(state, "Choose which cost to pay:", options.map(function (x, i) { return [['string', x[0]], [x[1], i]]; }))];
                    case 1:
                        _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], costAndIndex = _b[1];
                        if (costAndIndex == null)
                            throw new CostNotPaid("no options available");
                        _a = __read(costAndIndex, 2), cost = _a[0], i = _a[1];
                        return [2 /*return*/, payOrDo(cost, payAny(removeElement(options, i)))];
                }
            });
        });
    };
}
function doAll(effects) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < effects.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, effects[i](state)];
                    case 2:
                        state = _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, state];
                }
            });
        });
    };
}
function noop(state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, state];
        });
    });
}
//options is a list of [string, effect] pairs
function doAny(options) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var effect;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, choice(state, "Choose an effect to do:", options.map(function (x) { return [['string', x[0]], x[1]]; }))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], effect = _a[1];
                        return [2 /*return*/, effect(state)];
                }
            });
        });
    };
}
function discharge(card, n) {
    return charge(card, -n, true);
}
function addToken(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = applyToCard(card, applyToKey('tokens', function (x) { return x.concat([token]); }))(state);
                return [2 /*return*/, trigger({ type: 'addToken', card: card, token: token })(state)];
            });
        });
    };
}
function removeTokens(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var removed;
            return __generator(this, function (_a) {
                removed = countTokens(card, token);
                state = applyToCard(card, applyToKey('tokens', function (xs) { return xs.filter(function (x) { return (x != token); }); }))(state);
                return [2 /*return*/, trigger({ type: 'removeTokens', token: token, removed: removed })(state)];
            });
        });
    };
}
function removeOneToken(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            function removeOneToken(tokens) {
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i] == token) {
                        removed = 1;
                        return tokens.slice(0, i).concat(tokens.slice(i + 1));
                    }
                }
                return tokens;
            }
            var removed;
            return __generator(this, function (_a) {
                removed = 0;
                state = applyToCard(card, applyToKey('tokens', removeOneToken))(state);
                return [2 /*return*/, trigger({ type: 'removeTokens', token: token, removed: removed })(state)];
            });
        });
    };
}
function charge(card, n, cost) {
    if (cost === void 0) { cost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _, oldcharge, newcharge;
            var _a;
            return __generator(this, function (_b) {
                _a = __read(find(state, card.id), 2), card = _a[0], _ = _a[1];
                if (card == null) {
                    if (cost)
                        throw new CostNotPaid("card no longer exists");
                    return [2 /*return*/, state];
                }
                else if (card.charge + n < 0 && cost) {
                    throw new CostNotPaid("not enough charge");
                }
                oldcharge = card.charge;
                newcharge = (oldcharge + n < 0) ? 0 : oldcharge + n;
                state = applyToCard(card, applyToKey('charge', function (_) { return newcharge; }))(state);
                return [2 /*return*/, trigger({ type: 'chargeChange', card: card,
                        oldcharge: oldcharge, newcharge: newcharge, cost: cost })(state)];
            });
        });
    };
}
function time(n) {
    return { time: n, coin: 0 };
}
function coin(n) {
    return { time: 0, coin: n };
}
function countTokens(card, token) {
    var count = 0;
    var tokens = card.tokens;
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i] == token) {
            count += 1;
        }
    }
    return count;
}
function renderStatic(text) {
    return "<div>(static) " + text + "</div>";
}
function renderAbility(text) {
    return "<div>(ability) " + text + "</div>";
}
function renderTooltip(card, state) {
    var effectHtml = "<div>" + card.effect().description + "</div>";
    var abilitiesHtml = card.abilities().map(function (x) { return renderAbility(x.description); }).join('');
    var staticHtml = card.triggers().concat(card.replacers()).map(function (x) { return renderStatic(x.description); }).join('');
    var tokensHtml = card.tokens.length > 0 ? "Tokens: " + card.tokens.join(', ') : '';
    var baseFilling = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('');
    function renderRelated(x) {
        var cost = x.cost(state);
        var costStr = (cost.coin == 0 && cost.time == 0) ? '0' : renderCost(cost);
        return "<div>---" + x.toString() + " (" + costStr + ")---</div>" + renderTooltip(x, state);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "" + baseFilling + relatedFilling;
}
function renderShadow(shadow, state) {
    var card = shadow.original;
    var tokenhtml = card.tokens.length > 0 ? '*' : '';
    var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
    var costhtml = renderCost(card.cost(state));
    var ticktext = "tick=" + shadow.tick;
    var shadowtext = "shadow='true'";
    var tooltip;
    if (shadow.kind == 'ability')
        tooltip = renderAbility(shadow.text);
    if (shadow.kind == 'trigger')
        tooltip = renderStatic(shadow.text);
    if (shadow.kind == 'replacer')
        tooltip = renderStatic(shadow.text);
    if (shadow.kind == 'buy')
        tooltip = shadow.original.effect().description;
    return ["<div class='card' " + ticktext + " " + shadowtext + ">",
        "<div class='cardbody'>" + card + tokenhtml + chargehtml + "</div>",
        "<div class='cardcost'>" + costhtml + "</div>",
        "<span class='tooltip'>" + tooltip + "</span>",
        "</div>"].join('');
}
function renderCard(card, state, asOption) {
    if (asOption === void 0) { asOption = null; }
    if (card instanceof Shadow)
        return renderShadow(card, state);
    var tokenhtml = card.tokens.length > 0 ? '*' : '';
    var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
    var costhtml = renderCost(card.cost(state));
    var choosetext = asOption == null ? '' : "choosable chosen='false' option=" + asOption;
    var ticktext = "tick=" + card.ticks[card.ticks.length - 1];
    return ["<div class='card' " + ticktext + " " + choosetext + ">",
        "<div class='cardbody'>" + card + tokenhtml + chargehtml + "</div>",
        "<div class='cardcost'>" + costhtml + "</div>",
        "<span class='tooltip'>" + renderTooltip(card, state) + "</span>",
        "</div>"].join('');
}
var renderedState;
//TODO: sort hand?
//TODO: sort deck in way that is robust when you are offered choice
function renderState(state, optionsMap) {
    if (optionsMap === void 0) { optionsMap = null; }
    renderedState = state;
    function render(card, i) {
        if (optionsMap != null && optionsMap[card.id] != undefined) {
            return renderCard(card, state, optionsMap[card.id]);
        }
        else {
            return renderCard(card, state);
        }
    }
    $('#time').html(state.time);
    $('#coin').html(state.coin);
    $('#points').html(state.points);
    $('#aside').html(state.aside.map(render).join(''));
    $('#resolving').html(state.resolving.map(render).join(''));
    $('#play').html(state.play.map(render).join(''));
    $('#supplies').html(state.supplies.map(render).join(''));
    $('#hand').html(state.hand.map(render).join(''));
    $('#deck').html(state.deck.map(render).join(''));
    $('#discard').html(state.discard.map(render).join(''));
}
function renderCost(cost) {
    var coinHtml = cost.coin > 0 ? "$" + cost.coin : '';
    var timeHtml = renderTime(cost.time);
    if (coinHtml == '') {
        if (timeHtml == '')
            return '&nbsp;';
        else
            return timeHtml;
    }
    else
        return [coinHtml, timeHtml].join(' ');
}
function renderTime(n) {
    var result = [];
    for (var i = 0; i < n; i++) {
        result.push('@');
    }
    return result.join('');
}
var ZONES = ['hand', 'deck', 'discard', 'play', 'supplies', 'resolving', 'aside'];
var RESOURCES = ['coin', 'time', 'points'];
var emptyState = { nextID: 0, auras: [], future: [], history: [], checkpoint: null };
for (var i = 0; i < ZONES.length; i++)
    emptyState[ZONES[i]] = [];
for (var i = 0; i < RESOURCES.length; i++)
    emptyState[RESOURCES[i]] = 0;
function clearChoice() {
    $('#choicePrompt').html('');
    $('#options').html('');
}
function useCard(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var ability, shadow;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        state = startTick(card)(state);
                        return [4 /*yield*/, choice(state, "Choose an ability to use:", card.abilities().map(function (x) { return [['string', x.description], x]; }))];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], ability = _a[1];
                        state = endTick(card)(state);
                        if (!(ability != null)) return [3 /*break*/, 3];
                        shadow = void 0;
                        _b = __read(addShadow(state, card, 'ability', ability.description), 2), state = _b[0], shadow = _b[1];
                        state = startTick(card)(state);
                        return [4 /*yield*/, payToDo(ability.cost, ability.effect)(state)];
                    case 2:
                        state = _c.sent();
                        state = endTick(card)(state);
                        state = removeShadow(state, shadow);
                        _c.label = 3;
                    case 3: return [2 /*return*/, state];
                }
            });
        });
    };
}
function tryToBuy(supply) {
    return payToDo(supply.payCost(), supply.buy({ name: 'act' }));
}
function allCards(state) {
    return state.play.concat(state.hand).concat(state.deck).concat(state.discard).concat(state.trash);
}
function cardExists(state, id) {
    return allCards(state).some(function (x) { return x.id == id; });
}
function tryToPlay(card) {
    return payToDo(card.payCost(), card.play({ name: 'act' }));
}
function act(state) {
    return __awaiter(this, void 0, void 0, function () {
        var card, _a, _, zone;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], card = _b[1];
                    _a = __read(find(state, card.id), 2), _ = _a[0], zone = _a[1];
                    if (zone == 'play') {
                        return [2 /*return*/, useCard(card)(state)];
                    }
                    else if (zone == 'hand') {
                        return [2 /*return*/, tryToPlay(card)(state)];
                    }
                    else if (zone == 'supplies') {
                        return [2 /*return*/, tryToBuy(card)(state)];
                    }
                    else {
                        throw new Error("Unrecognized choice zone " + zone);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function renderOption(z) {
    var _a = __read(z, 2), option = _a[0], i = _a[1];
    return "<span class='option' option='" + i + "' choosable='true' chosen='false'>" + option + "</span>";
}
function doOrReplay(state, f, key) {
    var _a, _b;
    var x, future, k;
    if (state.future.length == 0) {
        x = f();
    }
    else {
        _a = __read(shiftFirst(state.future), 2), _b = __read(_a[0], 2), k = _b[0], x = _b[1], future = _a[1];
        if (k != key)
            throw Error("replaying history we found " + [k, x] + " where expecting key " + key);
        state = update(state, 'future', future);
    }
    var newHistory = state.history.concat([[key, x]]);
    return [update(state, 'history', newHistory), x];
}
//TODO: surely there is some way to unify these?
function asyncDoOrReplay(state, f, key) {
    return __awaiter(this, void 0, void 0, function () {
        var x, future, k, newHistory;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(state.future.length == 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, f()];
                case 1:
                    x = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = __read(shiftFirst(state.future), 2), _b = __read(_a[0], 2), k = _b[0], x = _b[1], future = _a[1];
                    if (k != key)
                        throw Error("replaying history we found " + [k, x] + " where expecting key " + key);
                    state = update(state, 'future', future);
                    _c.label = 3;
                case 3:
                    newHistory = state.history.concat([[key, x]]);
                    return [2 /*return*/, [update(state, 'history', newHistory), x]];
            }
        });
    });
}
function choice(state, choicePrompt, options, multichoiceValidator) {
    if (multichoiceValidator === void 0) { multichoiceValidator = null; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (options.length == 0 && multichoiceValidator == null)
                return [2 /*return*/, [state, null]];
            else if (options.length == 0)
                return [2 /*return*/, [state, []]];
            else if (options.length == 1 && multichoiceValidator == null) {
                return [2 /*return*/, [state, options[0][1]]];
            }
            else
                return [2 /*return*/, asyncDoOrReplay(state, function (_) { return freshChoice(state, choicePrompt, options, multichoiceValidator); }, 'choice')];
            return [2 /*return*/];
        });
    });
}
function getLastEvent(state) {
    var n = state.history.length;
    if (n > 0)
        return state.history[n - 1];
    else if (state.checkpoint == null)
        return null;
    else
        return getLastEvent(state.checkpoint);
}
function undoIsPossible(state) {
    var lastEvent = getLastEvent(state);
    return (lastEvent != null && lastEvent[0] == 'choice');
}
var yesOrNo = [[['string', 'yes'], true], [['string', 'no'], false]];
function asChoice(x) {
    if (x instanceof Card)
        return [['card', x.id], x];
    else
        return [['string', x.toString()], x];
}
function allowNull(options, message) {
    if (message === void 0) { message = "None"; }
    return options.concat([[['string', message], null]]);
}
//TODO: what to do if you can't pick a valid set for the validator?
function freshChoice(state, choicePrompt, options, multichoiceValidator) {
    if (multichoiceValidator === void 0) { multichoiceValidator = null; }
    var undoable = undoIsPossible(state);
    var optionsMap = {}; //map card ids to their position in the choice list
    var stringOptions = [];
    var chosen = {}; //records what options are being chosen for multithoice
    for (i = 0; i < options.length; i++) {
        var _a = __read(options[i][0], 2), type = _a[0], x = _a[1];
        if (type == 'card') {
            optionsMap[x] = i;
        }
        else if (type == 'string') {
            stringOptions.push([x, i]);
        }
        else {
            throw new Error("Got type " + type);
        }
    }
    if (multichoiceValidator != null)
        stringOptions.push(['Done', 'submit']);
    stringOptions.push(['Undo', 'undo']);
    renderState(state, optionsMap);
    $('#choicePrompt').html(choicePrompt);
    $('#options').html(stringOptions.map(renderOption).join(''));
    function chosenOptions() {
        var result = [];
        for (var i = 0; i < options.length; i++) {
            if (chosen[i])
                result.push(options[i][1]);
        }
        return result;
    }
    function isReady() {
        return multichoiceValidator(chosenOptions());
    }
    function setReady() {
        if (isReady()) {
            $("[option='submit']").attr('choosable', true);
        }
        else {
            $("[option='submit']").removeAttr('choosable');
        }
    }
    if (multichoiceValidator != null)
        setReady();
    if (!undoable)
        $("[option='undo']").removeAttr('choosable');
    return new Promise(function (resolve, reject) {
        var _loop_1 = function () {
            var j = i;
            var elem = $("[option='" + i + "']");
            elem.on('click', function (e) {
                if (multichoiceValidator == null) {
                    clearChoice();
                    resolve(options[j][1]);
                }
                else {
                    elem.attr('chosen', elem.attr('chosen') != 'true');
                    chosen[j] = (chosen[j] != true);
                    setReady();
                }
            });
        };
        for (var i = 0; i < options.length; i++) {
            _loop_1();
        }
        if (multichoiceValidator != null) {
            $("[option='submit']").on('click', function (e) {
                if (isReady())
                    resolve(chosenOptions());
            });
        }
        if (undoable) {
            $("[option='undo']").on('click', function (e) {
                reject(new Undo(state));
            });
        }
    });
}
//TODO: introduce an isPayable for costs?
function actChoice(state) {
    var validSupplies = state.supplies.filter(function (x) { return (x.cost(state).coin <= state.coin); });
    var validHand = state.hand;
    var validPlay = state.play.filter(function (x) { return (x.abilities().length > 0); });
    var cards = validSupplies.concat(validHand).concat(validPlay);
    return choice(state, 'Play from your hand, use an ability, or buy from a supply.', cards.map(asChoice));
}
function supplyKey(card) {
    return card.cost(emptyState).coin;
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2);
}
var Undo = /** @class */ (function (_super) {
    __extends(Undo, _super);
    function Undo(state) {
        var _this = _super.call(this, 'Undo') || this;
        _this.state = state;
        Object.setPrototypeOf(_this, Undo.prototype);
        return _this;
    }
    return Undo;
}(Error));
// Invariant: starting from checkpoint and replaying the history gets you to the current state
// To maintain this invariant, we need to record history every time there is a change
function checkpoint(state) {
    return updates(state, { history: [], checkpoint: state });
}
// backup(state) leads to the same place as state if you run mainLoop, but it has more future
// this enables undoing by backing up until you have future, then just popping from the future
function backup(state) {
    return updates(state.checkpoint, { future: state.history.concat(state.future) });
}
function popLast(xs) {
    var n = xs.length;
    return [xs[n - 1], xs.slice(0, n - 1)];
}
function shiftFirst(xs) {
    return [xs[0], xs.slice(1)];
}
function mainLoop(state) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2, _a, last, future;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    state = checkpoint(state);
                    renderState(state);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, act(state)];
                case 2:
                    state = _b.sent();
                    return [2 /*return*/, state];
                case 3:
                    error_2 = _b.sent();
                    if (error_2 instanceof Undo) {
                        state = error_2.state;
                        while (state.future.length == 0) {
                            if (state.checkpoint == null) {
                                throw Error("tried to undo past beginning of time");
                            }
                            else {
                                state = backup(state);
                            }
                        }
                        _a = __read(popLast(state.future), 2), last = _a[0], future = _a[1];
                        if (last[0] == 'choice') {
                            return [2 /*return*/, update(state, 'future', future)];
                        }
                        else {
                            throw Error("tried to undo past randomness");
                        }
                    }
                    else {
                        throw error_2;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function playGame(seed) {
    if (seed === void 0) { seed = null; }
    return __awaiter(this, void 0, void 0, function () {
        var state, startingDeck, _a, _, shuffledDeck, variableSupplies, i_1, kingdom;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    state = emptyState;
                    startingDeck = [copper, copper, copper, copper, copper,
                        copper, copper, estate, estate, estate];
                    _a = __read(randomChoices(state, startingDeck, startingDeck.length, seed + 1), 2), _ = _a[0], shuffledDeck = _a[1];
                    return [4 /*yield*/, doAll(shuffledDeck.map(function (x) { return create(x, 'deck'); }))(state)];
                case 1:
                    state = _c.sent();
                    _b = __read(randomChoices(state, mixins, 12, seed), 2), state = _b[0], variableSupplies = _b[1];
                    variableSupplies.sort(supplySort);
                    if (testing.length > 0 || test)
                        for (i_1 = 0; i_1 < cheats.length; i_1++)
                            testing.push(cheats[i_1]);
                    kingdom = coreSupplies.concat(variableSupplies).concat(testing);
                    return [4 /*yield*/, doAll(kingdom.map(function (x) { return create(x, 'supplies'); }))(state)];
                case 2:
                    state = _c.sent();
                    return [4 /*yield*/, trigger({ type: 'gameStart' })(state)];
                case 3:
                    state = _c.sent();
                    _c.label = 4;
                case 4:
                    if (!(state.points < 50)) return [3 /*break*/, 6];
                    return [4 /*yield*/, mainLoop(state)];
                case 5:
                    state = _c.sent();
                    return [3 /*break*/, 4];
                case 6:
                    renderState(state);
                    $('#choicePrompt').html("You won using " + state.time + " time!");
                    return [2 /*return*/];
            }
        });
    });
}
function getSeed() {
    var seed = new URLSearchParams(window.location.search).get('seed');
    var n = Number(seed);
    return (seed == null || isNaN(n)) ? null : seed;
}
function load() {
    playGame(getSeed());
}
//
// ----------------- CARDS -----------------
//
var coreSupplies = [];
var mixins = [];
var testing = [];
var cheats = [];
//
// ----------- UTILS -------------------
//
function gainCard(card) {
    return {
        description: "Create a " + card + " in your discard pile.",
        effect: create(card)
    };
}
function supplyForCard(card, cost) {
    return new Card(card.name, {
        fixedCost: cost,
        effect: function (_) { return gainCard(card); },
        relatedCards: [card],
    });
}
function register(card, test) {
    mixins.push(card);
    if (test == 'test')
        testing.push(card);
    else if (test != undefined)
        throw Error("bad argument to register");
}
function buyable(card, n, test) {
    register(supplyForCard(card, coin(n)), test);
}
//
//
// ------ CORE ------
//
var reboot = new Card('Reboot', {
    fixedCost: time(3),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +5 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoins(0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(5, 'reboot')(state)];
                    }
                });
            });
        }
    }); }
});
coreSupplies.push(reboot);
var copper = new Card('Copper', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$1',
        effect: gainCoin(1),
    }); }
});
coreSupplies.push(supplyForCard(copper, coin(1)));
var silver = new Card('Silver', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$2',
        effect: gainCoin(2)
    }); }
});
coreSupplies.push(supplyForCard(silver, coin(3)));
var gold = new Card('Gold', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$3',
        effect: gainCoin(3)
    }); }
});
coreSupplies.push(supplyForCard(gold, coin(6)));
var estate = new Card('Estate', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+1vp',
        effect: gainPoints(1),
    }); }
});
coreSupplies.push(supplyForCard(estate, coin(1)));
var duchy = new Card('Duchy', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2vp',
        effect: gainPoints(2),
    }); }
});
coreSupplies.push(supplyForCard(duchy, coin(4)));
var province = new Card('Province', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+3vp',
        effect: gainPoints(3),
    }); }
});
coreSupplies.push(supplyForCard(province, coin(8)));
//
// ----- MIXINS -----
//
function makeCard(card, cost, selfdestruct) {
    if (selfdestruct === void 0) { selfdestruct = false; }
    return new Card(card.name, {
        fixedCost: cost,
        effect: function (supply) { return ({
            description: "Create " + a(card) + " in play." + (selfdestruct ? ' Trash this.' : ''),
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
        }); },
        relatedCards: [card],
    });
}
var throneRoom = new Card('Throne Room', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Play a card in your hand. Then if it's in your discard pile play it again.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, _a, newCard, zone;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play twice.', state.hand.map(asChoice))];
                        case 1:
                            _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _c.sent();
                            state = tick(card)(state);
                            _a = __read(find(state, target.id), 2), newCard = _a[0], zone = _a[1];
                            if (!(zone == 'discard')) return [3 /*break*/, 4];
                            return [4 /*yield*/, newCard.play(card)(state)];
                        case 3:
                            state = _c.sent();
                            _c.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
buyable(throneRoom, 4);
var crown = new Card('Crown', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: "Pay the cost of a card in your hand to play it. Then if it's in your discard pile play it again.",
        effect: doOrAbort(function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, _a, newCard, zone;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play twice.', state.hand.map(asChoice))];
                        case 1:
                            _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.payCost()(state)];
                        case 2:
                            state = _c.sent();
                            return [4 /*yield*/, target.play(card)(state)];
                        case 3:
                            state = _c.sent();
                            state = tick(card)(state);
                            _a = __read(find(state, target.id), 2), newCard = _a[0], zone = _a[1];
                            if (!(zone == 'discard')) return [3 /*break*/, 5];
                            return [4 /*yield*/, newCard.play(card)(state)];
                        case 4:
                            state = _c.sent();
                            _c.label = 5;
                        case 5: return [2 /*return*/, state];
                    }
                });
            });
        })
    }); }
});
buyable(crown, 5);
var mule = new Card('Mule', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards',
        effect: draw(2)
    }); }
});
buyable(mule, 1);
var smithy = new Card('Smithy', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+3 cards',
        effect: draw(3)
    }); }
});
buyable(smithy, 4);
var tutor = new Card('Tutor', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Put any card from your deck into your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDraw;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put in your hand.', state.deck.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDraw = _a[1];
                            if (toDraw == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, move(toDraw, 'hand')(state)];
                    }
                });
            });
        }
    }); }
});
buyable(tutor, 3);
var cellar = new Card('Cellar', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Discard any number of cards in your hand, then draw that many cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDiscard;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose any number of cards to discard.', state.hand.map(asChoice), function (xs) { return true; })
                            //TODO: discard all at once
                        ];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent()
                                //TODO: discard all at once
                                , 2]), state = _a[0], toDiscard = _a[1];
                            return [4 /*yield*/, moveMany(toDiscard, 'discard')(state)];
                        case 2:
                            //TODO: discard all at once
                            state = _b.sent();
                            return [2 /*return*/, draw(toDiscard.length)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(cellar, 2);
var pearlDiver = new Card('Pearl Diver', {
    fixedCost: time(0),
    effect: function (_) { return ({
        description: '+1 card. You may put the bottom card of your deck on top of your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, moveIt;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _b.sent();
                            if (state.deck.length == 0)
                                return [2 /*return*/, state];
                            target = state.deck[state.deck.length - 1];
                            return [4 /*yield*/, choice(state, "Move " + target.name + " to the top of your deck?", yesOrNo)];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], moveIt = _a[1];
                            return [2 /*return*/, moveIt ? move(target, 'deck', 'top')(state) : state];
                    }
                });
            });
        }
    }); }
});
buyable(pearlDiver, 2);
var peddler = new Card('Peddler', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    }); }
});
var makePeddler = new Card('Peddler', {
    fixedCost: coin(5),
    effect: function (card) { return ({
        description: 'Create a peddler on top of your deck',
        effect: create(peddler, 'deck', 'top')
    }); },
    relatedCards: [peddler]
});
register(makePeddler);
function freeAction(state) {
    return __awaiter(this, void 0, void 0, function () {
        var options, target;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = state.hand.filter(function (card) { return (card.cost(state).time <= 1); }).map(asChoice);
                    return [4 /*yield*/, choice(state, 'Choose a card costing up to @ to play', allowNull(options))];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                    return [2 /*return*/, (target == null) ? state : target.play()(state)];
            }
        });
    });
}
var villagestr = 'Do this up to two times: play a card in your hand costing up to @.';
var village = new Card('Village', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. " + villagestr,
        effect: doAll([draw(1), freeAction, tick(card), freeAction])
    }); }
});
buyable(village, 3);
var bazaar = new Card('Bazaar', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. +$1. " + villagestr,
        effect: doAll([draw(1), gainCoin(1), freeAction, tick(card), freeAction])
    }); }
});
buyable(bazaar, 5);
var workshop = new Card('Workshop', {
    effect: function (card) { return ({
        description: 'Buy a card in the supply costing up to $4.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supplies.filter(function (card) { return (card.cost(state).coin <= 4 && card.cost(state).time <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $4 to buy.', allowNull(options.map(asChoice)))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, target.buy(card)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(workshop, 3);
var shippingLane = new Card('Shipping Lane', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+$2. Next time you finish buying a card this turn, buy it again if it still exists.",
        effect: doAll([
            gainCoin(2),
            nextTime(function (e) { return e.type == 'afterBuy'; }, function (e) { return (e.after == null) ? noop : e.after.buy(card); })
        ])
    }); }
});
buyable(shippingLane, 5);
var factory = new Card('Factory', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Buy a card in the supply costing up to $6.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supplies.filter(function (card) { return (card.cost(state).coin <= 6 && card.cost(state).time <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $6 to buy.', allowNull(options.map(asChoice)))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, target.buy(card)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(factory, 4);
var feast = new Card('Feast', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$5. Trash this.',
        effect: doAll([gainCoin(5), trash(card)]),
    }); }
    //effect: card => ({
    //    description: 'Buy a card costing up to $6. Trash this.',
    //    effect: async function(state) {
    //        options = state.supplies.filter(card => (card.cost(state).coin <= 6 && card.cost(state).time <= 0));
    //        [state, target] = await choice(state, 'Choose a card costing up to $6 to buy.',
    //            allowNull(options.map(asChoice)))
    //        state = await target.buy('feast')(state)
    //        return trash(card)(state)
    //    },
    //    skipDiscard:true,
    //})
});
buyable(feast, 4);
//TODO: let Reboot choose cards arbitrarily if it costs 0
var warFooting = new Card('War Footing', {
    replacers: function (card) { return [{
            description: 'Reboot costs @ less to play.',
            handles: function (x) { return (x.type == 'cost' && x.card == 'Reboot'); },
            replace: applyToKey('cost', applyToKey('time', function (x) { return Math.max(0, x - 1); }))
        }]; }
});
var gainWarFooting = new Card('War Footing', {
    calculatedCost: function (card, state) { return ({ time: 0, coin: 15 + 10 * card.charge }); },
    effect: function (card) { return ({
        description: "Create a " + card.relatedCards()[0] + " in play." +
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(warFooting, 'play'), charge(card, 1)])
    }); },
    relatedCards: [warFooting],
});
mixins.push(gainWarFooting);
var junkDealer = new Card('Junk Dealer', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+1 card. +$1. Trash a card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, gainCoin(1)(state)];
                        case 2:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to trash.', state.hand.map(asChoice))];
                        case 3:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, (target == null) ? state : trash(target)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(junkDealer, 5);
var refresh = new Card('Refresh', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, recycle(state.discard)(state)];
            }); });
        }
    }); }
});
mixins.push(refresh);
var plough = new Card('Plough', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle any number of cards from your discard pile. +2 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cards;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose any number of cards to recycle.', state.discard.map(asChoice), function (xs) { return true; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], cards = _a[1];
                            return [4 /*yield*/, recycle(cards)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, draw(2)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(plough, 5);
var vassal = new Card('Vassal', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+$2. Look at a random card from your deck. You may play it.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, playIt;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _b.sent();
                            if (state.deck.length == 0)
                                return [2 /*return*/, state];
                            target = state.deck[0];
                            return [4 /*yield*/, choice(state, "Play " + target.name + "?", yesOrNo)];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], playIt = _a[1];
                            return [2 /*return*/, playIt ? target.play(card)(state) : state];
                    }
                });
            });
        }
    }); }
});
buyable(vassal, 3);
var reinforce = new Card('Reinforce', {
    fixedCost: { time: 2, coin: 7 },
    effect: function (card) { return ({
        description: 'Put a reinforce token on a card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put a reinforce token on.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], card = _a[1];
                            if (card == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, addToken(card, 'reinforce')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            'description': "After playing a card with a reinforce token other than with this, if it's in your discard pile play it again.",
            'handles': function (e) { return (e.type == 'afterPlay' && e.before.tokens.includes('reinforce') && e.source.id != card.id); },
            'effect': function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, played, zone;
                    return __generator(this, function (_b) {
                        _a = __read(find(state, e.before.id), 2), played = _a[0], zone = _a[1];
                        return [2 /*return*/, (zone == 'discard') ? played.play(card)(state) : state];
                    });
                });
            }; }
        }]; },
});
register(reinforce);
var blacksmith = new Card('Blacksmith', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Add a charge token to this, then +1 card per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, played, _;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _b.sent();
                            _a = __read(find(state, card.id), 2), played = _a[0], _ = _a[1];
                            return [4 /*yield*/, draw(played.charge)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, move(played, 'discard')(state)];
                    }
                });
            });
        },
        skipDiscard: true
    }); }
});
buyable(blacksmith, 2);
var expedite = new Card('Expedite', {
    calculatedCost: function (card, state) { return ({ time: 1, coin: card.charge }); },
    effect: function (card) { return ({
        description: 'The next time you gain a card this turn, put it into your hand.' +
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: doAll([charge(card, 1), nextTime(function (e) { return (e.type == 'create'); }, function (e) { return move(e.card, 'hand'); })])
    }); }
});
register(expedite);
var goldMine = new Card('Gold Mine', {
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Create two golds in your deck.',
        effect: doAll([create(gold, 'deck'), create(gold, 'deck')]),
    }); }
});
buyable(goldMine, 6);
var vault = new Card('Vault', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards. Discard any number of cards from your hand, +$1 per card discarded.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDiscard;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(2)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Discard any number of cards for +$1 each.', state.hand.map(asChoice), function (xs) { return true; })];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDiscard = _a[1];
                            return [4 /*yield*/, moveMany(toDiscard, 'discard')(state)];
                        case 3:
                            state = _b.sent();
                            return [2 /*return*/, gainCoin(toDiscard.length)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(vault, 5);
var cursedKingdom = new Card('Cursed Kingdom', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+4 vp. Put a charge token on this.',
        effect: doAll([gainPoints(4), charge(card, 1)])
    }); }
});
var gainCursedKingdom = new Card('Cursed Kingdom', {
    fixedCost: coin(5),
    relatedCards: [cursedKingdom],
    effect: function (card) { return ({
        description: "Create a " + card.name + " in your discard pile.",
        effect: create(cursedKingdom, 'discard')
    }); },
    triggers: function (card) { return [{
            description: "Whenever you put a " + card.name + " into your hand, +@ for each charge token on it.",
            handles: function (e) { return (e.type == 'moved' && e.card.name == card.name && e.toZone == 'hand'); },
            effect: function (e) { return gainTime(e.card.charge); }
        }]; }
});
mixins.push(gainCursedKingdom);
var junkyard = new Card('Junkyard', {
    fixedCost: time(0),
    triggers: function (card) { return [{
            description: 'Whenever you trash a card, +1 vp.',
            handles: function (e) { return (e.type == 'moved' && e.toZone == null); },
            effect: function (e) { return gainPoints(1); }
        }]; }
});
mixins.push(makeCard(junkyard, { coin: 7, time: 3 }));
var bustlingSquare = new Card('Bustling Square', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. Set aside all cards in your hand. Play them in any order.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var hand, _loop_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _a.sent();
                            hand = state.hand;
                            return [4 /*yield*/, moveWholeZone('hand', 'aside')(state)];
                        case 2:
                            state = _a.sent();
                            _loop_2 = function () {
                                var target;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, choice(state, 'Choose which card to play next.', hand.map(asChoice))];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                            return [4 /*yield*/, target.play(card)(state)];
                                        case 2:
                                            state = _b.sent();
                                            hand = hand.filter(function (c) { return c.id != target.id; });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 3;
                        case 3:
                            if (!(hand.length > 0)) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_2()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 5: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
buyable(bustlingSquare, 6);
var colony = new Card('Colony', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+5vp',
        effect: gainPoints(5),
    }); }
});
buyable(colony, 16);
var windfall = new Card('Windfall', {
    fixedCost: { time: 0, coin: 6 },
    effect: function (card) { return ({
        description: 'If there are no cards in your deck, create two golds in your discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, (state.deck.length == 0) ? doAll([create(gold), create(gold)])(state) : state];
                });
            });
        }
    }); }
});
mixins.push(windfall);
var horse = new Card('Horse', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+2 cards. Trash this.',
        skipDiscard: true,
        effect: doAll([draw(2), trash(card)])
    }); }
});
buyable(horse, 2);
var lookout = new Card('Lookout', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Look at the top 3 cards from your deck. Trash one then discard one.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                function pickOne(descriptor, zone, state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var pick;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, choice(state, "Pick a card to " + descriptor + ".", picks.map(function (card) { return [['card', card.id], card]; }))];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], pick = _a[1];
                                    picks = picks.filter(function (card) { return card.id != pick.id; });
                                    return [2 /*return*/, move(pick, zone)(state)];
                            }
                        });
                    });
                }
                var picks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            picks = state.deck.slice(0, 3);
                            if (!(picks.length > 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, pickOne('trash', null, state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!(picks.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, pickOne('discard', 'discard', state)];
                        case 3:
                            state = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
buyable(lookout, 3);
var lab = new Card('Lab', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+2 cards',
        effect: draw(2)
    }); }
});
buyable(lab, 5);
var roadNetwork = new Card('Road Network', {
    fixedCost: time(0),
    triggers: function (_) { return [{
            description: 'Whenever you create a card in your discard pile, move it to your deck.',
            handles: function (e) { return (e.type == 'create' && e.toZone == 'discard'); },
            effect: function (e) { return move(e.card, 'deck'); }
        }]; }
});
mixins.push(makeCard(roadNetwork, coin(5)));
var twins = new Card('Twins', {
    fixedCost: time(0),
    triggers: function (card) { return [{
            description: "When you finish playing a card other than with " + card + ", if it costs @ or more then you may play a card in your hand with the same name.",
            handles: function (e) { return (e.type == 'afterPlay' && e.source.name != twins.name); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cardOptions, replay;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (e.before.cost(state).time == 0)
                                    return [2 /*return*/, state];
                                cardOptions = state.hand.filter(function (x) { return (x.name == e.before.name); });
                                return [4 /*yield*/, choice(state, "Choose a card named '" + e.before.name + "' to play.", allowNull(cardOptions.map(asChoice), "Don't play"))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], replay = _a[1];
                                return [2 /*return*/, (replay == null) ? state : replay.play(card)(state)];
                        }
                    });
                });
            }; }
        }]; }
});
register(makeCard(twins, { time: 0, coin: 6 }));
var masterSmith = new Card('Master Smith', {
    fixedCost: time(2),
    effect: function (card) { return ({
        description: '+5 cards',
        effect: draw(5),
    }); }
});
buyable(masterSmith, 5);
var reuse = new Card('Reuse', {
    calculatedCost: function (card, state) { return ({ time: 1, coin: card.charge }); },
    effect: function (card) { return ({
        description: 'Put a card from your discard into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put into your hand.', state.discard.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, (target == null) ? state : move(target, 'hand')(state)];
                    }
                });
            });
        }
    }); }
});
mixins.push(reuse);
var reconfigure = new Card('Reconfigure', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +1 card per card that was in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoins(0)(state)];
                        case 1:
                            state = _a.sent();
                            n = state.hand.length;
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(n, 'reconfigure')(state)];
                    }
                });
            });
        }
    }); }
});
mixins.push(reconfigure);
var bootstrap = new Card('Bootstrap', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +2 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoins(0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(2, 'bootstrap')(state)];
                    }
                });
            });
        }
    }); }
});
mixins.push(bootstrap);
var retry = new Card('Resume', {
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Discard your hand, lose all $, and +5 cards.',
        effect: doAll([
            setCoins(0),
            moveWholeZone('hand', 'discard'),
            draw(5, 'retry')
        ])
    }); }
});
mixins.push(retry);
var research = new Card('Research', {
    calculatedCost: function (card, state) { return ({ time: 1, coin: card.charge }); },
    effect: function (card) { return ({
        description: 'Put a card from your deck into your hand. Put a charge token on this. This costs +$1 per charge token on it.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put into your hand.', state.deck.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, (target == null) ? state : move(target, 'hand')(state)];
                    }
                });
            });
        }
    }); }
});
mixins.push(research);
var platinum = new Card("Platinum", {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$5',
        effect: gainCoin(5)
    }); }
});
buyable(platinum, 10);
var innovation = new Card("Innovation", {
    triggers: function (card) { return [{
            description: "Whenever you create a card in your discard pile, if this has an innovate token on it:" +
                " remove all innovate tokens from this, discard your hand, lose all $, and play the card.",
            handles: function (e) { return (e.type == 'create' && e.toZone == 'discard' && countTokens(card, 'innovate') > 0); },
            effect: function (e) { return doAll([
                removeTokens(card, 'innovate'),
                moveWholeZone('hand', 'discard'),
                setCoins(0),
                e.card.play(card)
            ]); },
        }]; },
    abilities: function (card) { return [{
            description: "Put an innovate token on this.",
            cost: noop,
            effect: addToken(card, 'innovate')
        }]; }
});
register(makeCard(innovation, { coin: 7, time: 0 }, true));
var citadel = new Card("Citadel", {
    triggers: function (card) { return [{
            description: "After playing a card the normal way, if it's the only card in your discard pile, play it again.",
            handles: function (e) { return (e.type == 'afterPlay' && e.source.name == 'act'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (find(state, e.card.id)[1] == 'discard' && state.discard.length == 1) {
                            return [2 /*return*/, e.card.play(card)(state)];
                        }
                        else {
                            return [2 /*return*/, state];
                        }
                        return [2 /*return*/];
                    });
                });
            }; }
        }]; }
});
mixins.push(makeCard(citadel, { coin: 8, time: 0 }, true));
var foolsGold = new Card("Fool's Gold", {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: "+$1. +$1 per Fool's Gold in your discard pile.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.discard.filter(function (x) { return x.name == card.name; }).length;
                    return [2 /*return*/, gainCoin(n + 1)(state)];
                });
            });
        }
    }); }
});
buyable(foolsGold, 2);
var hireling = new Card('Hireling', {
    fixedCost: time(0),
    replacers: function (card) { return [{
            description: "Whenever you draw a card from Reboot, draw an additional card.",
            handles: function (x) { return (x.type == 'draw', x.source.name == reboot.name); },
            replace: function (x, state) { return update(x, 'draw', x.draw + 1); },
        }]; }
});
mixins.push(makeCard(hireling, { coin: 6, time: 2 }));
var sacrifice = new Card('Sacrifice', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Play a card in your hand, then trash it.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play and trash.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _b.sent();
                            return [4 /*yield*/, move(target, null)(state)];
                        case 3: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        }
    }); }
});
buyable(sacrifice, 2);
var horseTraders = new Card('Horse Traders', {
    fixedCost: time(1),
    effect: function (_) { return ({
        description: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    }); }
});
buyable(horseTraders, 4);
var purge = new Card('Purge', {
    fixedCost: time(5),
    effect: function (card) { return ({
        description: 'Trash any number of cards from your hand. Trash this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose any number of cards to trash.', state.hand.map(asChoice), (function (xs) { return true; }))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toTrash = _a[1];
                            return [4 /*yield*/, moveMany(toTrash, null)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, trash(card)(state)];
                    }
                });
            });
        }
    }); }
});
mixins.push(purge);
var chapel = new Card('Chapel', {
    fixedCost: time(1),
    effect: function (_) { return ({
        description: 'Trash up to four cards from your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose up to four cards to trash.', state.hand.map(asChoice), (function (xs) { return xs.length <= 4; }))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toTrash = _a[1];
                            return [2 /*return*/, moveMany(toTrash, null)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(chapel, 3);
var coppersmith = new Card('Coppersmith', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Put all coppers in your discard pile into your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, moveMany(state.discard.filter(function (x) { return x.name == 'Copper'; }), 'hand')(state)];
                });
            });
        }
    }); }
});
buyable(coppersmith, 3);
function countDistinct(xs) {
    var y = {};
    var result = 0;
    for (var i = 0; i < xs.length; i++) {
        if (y[xs[i]] == undefined) {
            y[xs[i]] = true;
            result += 1;
        }
    }
    return result;
}
var harvest = new Card('Harvest', {
    fixedCost: time(1),
    effect: function (_) { return ({
        description: '+$1 per differently named card in your hand, up to +$4.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, gainCoin(Math.min(4, countDistinct(state.hand.map(function (x) { return x.name; }))))(state)];
                });
            });
        }
    }); }
});
buyable(harvest, 4);
var fortify = new Card('Fortify', {
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Put your discard pile in your hand. Trash this.',
        effect: doAll([moveWholeZone('discard', 'hand'), trash(card)]),
        skipDiscard: true,
    }); }
});
var gainFortify = new Card('Fortify', {
    fixedCost: coin(5),
    effect: function (card) { return ({
        description: 'Create a fortify in your discard pile. Discard your hand.',
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }); },
    relatedCards: [fortify],
});
mixins.push(gainFortify);
var explorer = new Card("Explorer", {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Create a silver in your hand. " +
            "If you have a province in your hand, instead create a gold in your hand.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    for (i = 0; i < state.hand.length; i++) {
                        if (state.hand[i].name == 'Province')
                            return [2 /*return*/, create(gold, 'hand')(state)];
                    }
                    return [2 /*return*/, create(silver, 'hand')(state)];
                });
            });
        }
    }); }
});
buyable(explorer, 5);
var kingsCourt = new Card("King's Court", {
    fixedCost: time(2),
    effect: function (card) { return ({
        description: "Choose a card in your hand. Play it, " +
            "then if it's in your discard pile play it again, " +
            "then if it's in your discard pile play it again.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, i, zone;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play three times.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _c.sent();
                            i = 0;
                            _c.label = 3;
                        case 3:
                            if (!(i < 2)) return [3 /*break*/, 6];
                            state = tick(card)(state);
                            zone = void 0;
                            _b = __read(find(state, target.id), 2), target = _b[0], zone = _b[1];
                            if (!(zone == 'discard')) return [3 /*break*/, 5];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 4:
                            state = _c.sent();
                            _c.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 3];
                        case 6: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
buyable(kingsCourt, 10);
var gardens = new Card("Gardens", {
    fixedCost: { time: 1, coin: 4 },
    effect: function (card) { return ({
        description: "+1 vp per 10 cards in your deck, hand, and discard pile.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.hand.length + state.deck.length + state.discard.length;
                    return [2 /*return*/, gainPoints(Math.floor(n / 10))(state)];
                });
            });
        }
    }); }
});
mixins.push(gardens);
var pathfinding = new Card('Pathfinding', {
    fixedCost: { coin: 5, time: 1 },
    effect: function (card) { return ({
        description: 'Put a path token on a card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put a path token on.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (card == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, addToken(target, 'path')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you play a card, draw a card per path token on it.',
            handles: function (e) { return (e.type == 'play' && e.card.tokens.includes('path')); },
            effect: function (e) { return draw(countTokens(e.card, 'path')); }
        }]; },
});
mixins.push(pathfinding);
var counterfeit = new Card('Counterfeit', {
    effect: function (card) { return ({
        description: 'Play a card from your deck, then trash it.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (state.deck.length == 0)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, choice(state, 'Choose a card to play then trash.', state.deck.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [4 /*yield*/, target.play()(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, trash(target)(state)];
                    }
                });
            });
        }
    }); }
});
buyable(counterfeit, 5);
var decay = new Card('Decay', {
    fixedCost: coin(4),
    effect: function (card) { return ({
        description: 'Remove all decay tokens from all cards in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.hand.map(function (x) { return removeTokens(x, 'decay'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you play a card, put a decay token on it.',
            handles: function (e) { return (e.type == 'play'); },
            effect: function (e) { return addToken(e.card, 'decay'); }
        }, {
            description: 'After you play a card, if it has 3 or more decay tokens on it trash it.',
            handles: function (e) { return (e.type == 'afterPlay' && e.after != null && countTokens(e.after, 'decay') >= 3); },
            effect: function (e) { return trash(e.after); },
        }]; }
});
mixins.push(decay);
var perpetualMotion = new Card('Perpetual Motion', {
    triggers: function (card) { return [{
            description: 'Whenever you have no cards in hand, draw a card.',
            handles: function (e, state) { return (state.hand.length == 0 && state.deck.length > 0); },
            effect: function (e) { return draw(1); },
        }]; }
});
register(makeCard(perpetualMotion, time(7), true));
var looter = new Card('Looter', {
    effect: function (card) { return ({
        description: '+1 card. Discard any number of cards from the top of your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var index;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to discard (along with everything above it).', allowNull(state.deck.map(function (x, i) { return [['card', state.deck[i].id], i]; })))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], index = _a[1];
                            return [2 /*return*/, (index == null) ? state : moveMany(state.deck.slice(0, index + 1), 'discard')(state)];
                    }
                });
            });
        }
    }); }
});
buyable(looter, 3);
var scavenger = new Card('Scavenger', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+$2. Put a card from your discard pile on top of your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to put on top of your deck.', allowNull(state.discard.map(asChoice)))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, (target == null) ? state : move(target, 'deck', 'top')(state)];
                    }
                });
            });
        }
    }); }
});
buyable(scavenger, 4);
var coffers = new Card('Coffers', {
    abilities: function (card) { return [{
            description: 'Remove a charge token from this. If you do, +$1.',
            cost: discharge(card, 1),
            effect: gainCoin(1),
        }]; }
});
function createIfNeeded(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (state.play.some(function (x) { return x.name == card.name; }))
                    return [2 /*return*/, state];
                return [2 /*return*/, create(card, 'play')(state)];
            });
        });
    };
}
function ensureAtStart(card) {
    return {
        description: "At the start of the game, create a " + card + " in play if there isn't one.",
        handles: function (e) { return e.type == 'gameStart'; },
        effect: function (e) { return createIfNeeded(card); }
    };
}
function fill(card, n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, choice(state, "Place two charge tokens on a " + card + ".", state.play.filter(function (c) { return c.name == card.name; }).map(asChoice))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        return [2 /*return*/, (target == null) ? state : charge(target, n)(state)];
                }
            });
        });
    };
}
var fillCoffers = new Card('Fill Coffers', {
    fixedCost: coin(3),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + coffers + " in play.",
        effect: fill(coffers, 2)
    }); },
    triggers: function (card) { return [ensureAtStart(coffers)]; }
});
register(fillCoffers);
var cotr = new Card('Coin of the Realm', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+$1. Put this in play.',
        skipDiscard: true,
        effect: doAll([gainCoin(1), move(card, 'play')])
    }); },
    abilities: function (card) { return [{
            description: villagestr + " Discard this.",
            cost: noop,
            effect: doAll([freeAction, tick(card), freeAction, move(card, 'discard')]),
        }]; }
});
buyable(cotr, 3);
var mountainVillage = new Card('Mountain Village', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "You may play a card in your hand or discard pile costing up to @." +
            " You may play a card in your hand costing up to @.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.hand.concat(state.discard).filter(function (card) { return (card.cost(state).time <= 1); }).map(asChoice);
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to @ to play', allowNull(options))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, target.play()(state)];
                        case 2:
                            state = _b.sent();
                            _b.label = 3;
                        case 3:
                            state = tick(card)(state);
                            return [2 /*return*/, freeAction(state)];
                    }
                });
            });
        }
    }); }
});
buyable(mountainVillage, 3);
var stables = new Card('Stables', {
    abilities: function (card) { return [{
            description: 'Remove a charge token from this. If you do, +1 card.',
            cost: discharge(card, 1),
            effect: draw(1, card),
        }]; }
});
var fillStables = new Card('Fill Stables', {
    fixedCost: coin(4),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + stables + " in play.",
        effect: fill(stables, 2),
    }); },
    triggers: function (card) { return [ensureAtStart(stables)]; },
});
register(fillStables);
var sleigh = new Card('Sleigh', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + stables + " in play.",
        effect: fill(stables, 2),
    }); }
});
var makeSleigh = new Card('Sleigh', {
    fixedCost: coin(2),
    relatedCards: [sleigh],
    effect: function (card) { return gainCard(sleigh); },
    triggers: function (card) { return [
        ensureAtStart(stables),
        {
            description: 'Whenever you create a card, if you have a sleigh in your hand,' +
                ' you may discard it to put the card into your hand.',
            handles: function (e) { return (e.type == 'create'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                options = state.hand.filter(function (x) { return x.name == sleigh.name; });
                                return [4 /*yield*/, choice(state, 'Discard a sleigh?', allowNull(options.map(asChoice)))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target != null)) return [3 /*break*/, 4];
                                return [4 /*yield*/, move(target, 'discard')(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, move(e.card, 'hand')(state)];
                            case 3:
                                state = _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }
    ]; }
});
register(makeSleigh);
var ferry = new Card('Ferry', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Put a ferry token on a supply.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Put a ferry token on a supply.', state.supplies.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, addToken(target, 'ferry')(state)];
                        case 2:
                            state = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
function ferryReduce(cost, n) {
    return update(cost, 'coin', Math.max(cost.coin - n, (cost.time > 0) ? 0 : 1));
}
var makeFerry = new Card('Ferry', {
    fixedCost: coin(3),
    effect: function (card) { return gainCard(ferry); },
    replacers: function (card) { return [{
            description: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
            handles: function (p) { return (p.type == 'cost' && countTokens(p.card, 'ferry') > 0); },
            replace: function (p) { return update(p, 'cost', ferryReduce(p.cost, countTokens(p.card, 'ferry'))); }
        }]; }
});
register(makeFerry);
var livery = new Card('Livery', {
    replacers: function (card) { return [{
            description: "Whenever you would draw cards other than with " + stables + "," +
                (" put that many charge tokens on a " + stables + " in play instead."),
            handles: function (x) { return (x.type == 'draw' && x.source.name != stables.name); },
            replace: function (x) { return updates(x, { 'draw': 0, 'effects': x.effects.concat([fill(stables, x.draw)]) }); }
        }]; }
});
var makeLivery = new Card('Livery', {
    fixedCost: time(4),
    relatedCards: [livery, stables],
    effect: function (card) { return ({
        description: "Create a " + livery.name + " in play, and a stables if there isn't one. Trash this.",
        effect: doAll([create(livery, 'play'), createIfNeeded(stables), trash(card)])
    }); },
});
register(makeLivery);
function slogCheck(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(find(state, card.id), 2), card = _a[0], _ = _a[1];
                        if (!(card != null && card.charge >= 100)) return [3 /*break*/, 2];
                        return [4 /*yield*/, gainPoints(100, card)(state)];
                    case 1:
                        state = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, state];
                }
            });
        });
    };
}
var slog = new Card('Slog', {
    fixedCost: coin(4),
    effect: function (card) { return ({
        description: 'Add a charge token to this. Whenever this has 100 or more charge tokens, +100 points.',
        effect: doAll([charge(card, 1), slogCheck(card)]),
    }); },
    replacers: function (card) { return [{
            description: 'Whenever you gain points other than with this, instead put that many charge tokens on this.',
            handles: function (x) { return (x.type == 'gainPoints' && x.source.id != card.id); },
            replace: function (x) { return updates(x, { points: 0, effects: x.effects.concat([charge(card, x.points), slogCheck(card)]) }); }
        }]; }
});
register(slog);
var burden = new Card('Burden', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Remove a burden token from a card in the supply',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supplies.filter(function (x) { return countTokens(x, 'burden') > 0; });
                            return [4 /*yield*/, choice(state, 'Choose a supply to unburden.', allowNull(options.map(asChoice)))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, removeOneToken(target, 'burden')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you buy a card costing $, put a burden token on it.',
            handles: function (e, state) { return (e.type == 'buy' && e.card.cost(state).coin >= 1); },
            effect: function (e) { return addToken(e.card, 'burden'); }
        }]; },
    replacers: function (card) { return [{
            description: 'Cards cost $1 more for each burden token on them.',
            handles: function (x) { return (x.type == 'cost' && countTokens(x.card, 'burden') > 0); },
            replace: function (x) { return applyToKey('cost', applyToKey('coin', function (c) { return c + countTokens(x.card, 'burden'); }))(x); }
        }]; }
});
register(burden);
var artisan = new Card('Artisan', {
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    }); }
});
buyable(artisan, 6);
var chancellor = new Card('Chancellor', {
    effect: function (card) { return ({
        description: '+$2. You may discard your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var doit;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Discard your deck?', yesOrNo)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], doit = _a[1];
                            if (!doit) return [3 /*break*/, 3];
                            return [4 /*yield*/, moveWholeZone('deck', 'discard')(state)];
                        case 2:
                            state = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
});
buyable(chancellor, 4);
// ------------------ Testing -------------------
var freeMoney = new Card('Free money', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$100',
        effect: gainCoin(100)
    }); }
});
cheats.push(freeMoney);
var freeTutor = new Card('Free tutor', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Put any card from your deck or discard pile into your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDraw;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put in your hand.', state.deck.concat(state.discard).map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDraw = _a[1];
                            if (toDraw == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, move(toDraw, 'hand')(state)];
                    }
                });
            });
        }
    }); }
});
cheats.push(freeTutor);
var freeDraw = new Card('Free draw', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Draw a card.',
        effect: draw(1),
    }); }
});
cheats.push(freeDraw);
var freeTrash = new Card('Free trash', {
    effect: function (card) { return ({
        description: 'Trash any number of cards in your hand, deck, and discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose cards to trash.', state.deck.concat(state.discard).concat(state.hand).map(asChoice), function (xs) { return true; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toTrash = _a[1];
                            return [2 /*return*/, moveMany(toTrash, null)(state)];
                    }
                });
            });
        }
    }); }
});
cheats.push(freeTrash);
var drawAll = new Card('Draw all', {
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Put all cards from your deck and discard pile into your hand.',
        effect: doAll([moveWholeZone('discard', 'hand'), moveWholeZone('deck', 'hand')]),
    }); }
});
cheats.push(drawAll);
var test = false;
//test = true
//# sourceMappingURL=main.js.map