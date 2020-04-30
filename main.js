"use strict";
// TODO: render tokens more nicely if there are multiples
// TODO: move CSS into a separate style file
// TODO: the first 90 lines of this file aren't sorted very well
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: History?
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: Undo isn't in a great position
// TODO: if a zone gets bigger and then, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: probably worth distinguishing items with 1 vs 2 tokens?
// TODO: minimum width for option choices
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
function applyToCard(card, f) {
    return function (state) { return state.apply(f, card); };
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var cardsToTrigger, triggers, effects;
            return __generator(this, function (_a) {
                cardsToTrigger = state.supply.concat(state.play);
                triggers = [].concat(cardsToTrigger.map(function (x) { return x.triggers().map(function (y) { return [x, y]; }); }));
                triggers = triggers.filter(function (trigger) { return trigger[1].handles(e, state); });
                effects = triggers.map(function (trigger) { return function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    state = state.addShadow(trigger[0], 'trigger', trigger[1].description);
                                    state = state.startTicker(trigger[0]);
                                    return [4 /*yield*/, trigger[1].effect(e)(state)];
                                case 1:
                                    state = _a.sent();
                                    state = state.endTicker(trigger[0]);
                                    state = state.popResolving();
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
//each card in play or supply can change properties of x
function replace(x, state) {
    var replacers = state.supply.concat(state.play).map(function (x) { return x.replacers(); }).flat();
    for (var i = 0; i < replacers.length; i++) {
        var replacer = replacers[i];
        if (replacer.handles(x, state)) {
            x = replacer.replace(x, state);
        }
    }
    return x;
}
// this updates a state by incrementing the tick on the given card,
// and ticking its shadow (which we assume is the last thing in resolving)
function tick(card) {
    return function (state) {
        state = state.apply(function (x) { return x.tick(); }, card);
        var last = state.resolving[state.resolving.length - 1];
        if (last instanceof Shadow) {
            state = state.popResolving();
            state = state.addResolving(last.tickUp());
        }
        return state;
    };
}
function read(x, k, fallback) {
    return (x[k] == undefined) ? fallback : x[k];
}
var Card = /** @class */ (function () {
    function Card(spec, id, charge, ticks, tokens) {
        if (charge === void 0) { charge = 0; }
        if (ticks === void 0) { ticks = [0]; }
        if (tokens === void 0) { tokens = []; }
        this.spec = spec;
        this.id = id;
        this.charge = charge;
        this.ticks = ticks;
        this.tokens = tokens;
        this.name = spec.name;
    }
    Card.prototype.toString = function () {
        return this.name;
    };
    Card.prototype.update = function (newValues) {
        return new Card(this.spec, this.id, read(newValues, 'charge', this.charge), read(newValues, 'ticks', this.ticks), read(newValues, 'tokens', this.tokens));
    };
    Card.prototype.startTicker = function () {
        return this.update({ ticks: this.ticks.concat([1]) });
    };
    Card.prototype.endTicker = function () {
        return this.update({ ticks: this.ticks.slice(0, this.ticks.length - 1) });
    };
    Card.prototype.tick = function () {
        var n = this.ticks.length;
        var t = this.ticks[n - 1];
        return this.update({ ticks: this.ticks.slice(0, n - 1).concat([t + 1]) });
    };
    Card.prototype.baseCost = function (state) {
        if (this.spec.fixedCost != undefined)
            return this.spec.fixedCost;
        else if (this.spec.calculatedCost != undefined)
            return this.spec.calculatedCost(this, state);
        else
            return { coin: 0, time: 0 };
    };
    // the cost after replacement effects
    Card.prototype.cost = function (state) {
        var card = this;
        var initialCost = { type: 'cost', card: card, cost: card.baseCost(state) };
        var newCost = replace(initialCost, state);
        return newCost.cost;
    };
    // the transformation that actually pays the cost
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
        if (this.spec.effect == undefined)
            return { description: '', effect: noop };
        return this.spec.effect(this);
    };
    Card.prototype.buy = function (source) {
        if (source === void 0) { source = { name: '?' }; }
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var zone, _a, newCard, _;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _b = __read(state.find(card), 2), card = _b[0], zone = _b[1];
                            if (card == null)
                                return [2 /*return*/];
                            return [4 /*yield*/, trigger({ type: 'buy', card: card, source: source })(state)];
                        case 1:
                            state = _c.sent();
                            state = state.addShadow(card, 'buy');
                            state = state.startTicker(card);
                            return [4 /*yield*/, card.effect().effect(state)];
                        case 2:
                            state = _c.sent();
                            state = state.endTicker(card);
                            state = state.popResolving();
                            _a = __read(state.find(card), 2), newCard = _a[0], _ = _a[1];
                            return [2 /*return*/, trigger({ type: 'afterBuy', before: card, after: newCard, source: source })(state)];
                    }
                });
            });
        };
    };
    Card.prototype.play = function (source) {
        if (source === void 0) { source = { name: '?' }; }
        var effect = this.effect();
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var zone, newCard;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = __read(state.find(card), 2), card = _a[0], zone = _a[1];
                            if (card == null)
                                return [2 /*return*/];
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 1:
                            state = _c.sent();
                            return [4 /*yield*/, trigger({ type: 'play', card: card, source: source })(state)];
                        case 2:
                            state = _c.sent();
                            state = state.startTicker(card);
                            return [4 /*yield*/, effect.effect(state)];
                        case 3:
                            state = _c.sent();
                            state = state.endTicker(card);
                            if (!!effect['skipDiscard']) return [3 /*break*/, 5];
                            return [4 /*yield*/, move(card, 'discard')(state)];
                        case 4:
                            state = _c.sent();
                            _c.label = 5;
                        case 5:
                            _b = __read(state.find(card), 2), newCard = _b[0], zone = _b[1];
                            return [2 /*return*/, trigger({ type: 'afterPlay', before: card, after: newCard, source: source })(state)];
                    }
                });
            });
        };
    };
    Card.prototype.triggers = function () {
        if (this.spec.triggers == undefined)
            return [];
        return this.spec.triggers(this);
    };
    Card.prototype.abilities = function () {
        if (this.spec.abilities == undefined)
            return [];
        return this.spec.abilities(this);
    };
    Card.prototype.replacers = function () {
        if (this.spec.replacers == undefined)
            return [];
        return this.spec.replacers(this);
    };
    Card.prototype.relatedCards = function () {
        return this.spec.relatedCards || [];
    };
    return Card;
}());
var State = /** @class */ (function () {
    function State(counters, zones, resolving, nextID, history, future, checkpoint) {
        this.counters = counters;
        this.zones = zones;
        this.resolving = resolving;
        this.nextID = nextID;
        this.history = history;
        this.future = future;
        this.checkpoint = checkpoint;
        this.coin = counters.coin;
        this.time = counters.time;
        this.points = counters.points;
        this.supply = zones.get('supply');
        this.hand = zones.get('hand');
        this.deck = zones.get('deck');
        this.discard = zones.get('discard');
        this.play = zones.get('play');
        this.aside = zones.get('aside');
    }
    State.prototype.update = function (stateUpdate) {
        return new State(read(stateUpdate, 'counters', this.counters), read(stateUpdate, 'zones', this.zones), read(stateUpdate, 'resolving', this.resolving), read(stateUpdate, 'nextID', this.nextID), read(stateUpdate, 'history', this.history), read(stateUpdate, 'future', this.future), read(stateUpdate, 'checkpoint', this.checkpoint));
    };
    State.prototype.addResolving = function (x) {
        return this.update({ resolving: this.resolving.concat([x]) });
    };
    State.prototype.popResolving = function () {
        return this.update({ resolving: this.resolving.slice(0, this.resolving.length - 1) });
    };
    State.prototype.addToZone = function (card, zone, loc) {
        if (loc === void 0) { loc = 'end'; }
        if (zone == 'hand')
            loc = 'sorted';
        var newZones = new Map(this.zones);
        newZones[zone] = insertAt(this.zones[zone], card, loc);
        return this.update({ zones: newZones });
    };
    State.prototype.remove = function (card) {
        var e_1, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], zone = _d[1];
                newZones[name_1] = zone.filter(function (c) { return c.id != card.id; });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this.update({ zones: newZones });
    };
    State.prototype.apply = function (f, card) {
        var e_2, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones[name_2] = zone.map(function (c) { return (c.id == card.id) ? f(c) : c; });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this.update({ zones: newZones });
    };
    State.prototype.setCoin = function (n) {
        return this.update({ counters: { coin: n, time: this.time, points: this.points } });
    };
    State.prototype.addShadow = function (original, kind, text) {
        var _a;
        var state = this;
        var id;
        _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
        var shadow = new Shadow(id, original, kind, 1, text);
        return state.addResolving(shadow);
    };
    State.prototype.setTime = function (n) {
        return this.update({ counters: { coin: this.coin, time: n, points: this.points } });
    };
    State.prototype.setPoints = function (n) {
        return this.update({ counters: { coin: this.coin, time: this.time, points: n } });
    };
    State.prototype.find = function (card) {
        var e_3, _a;
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_3 = _d[0], zone = _d[1];
                var matches = zone.filter(function (c) { return c.id == card.id; });
                if (matches.length > 0)
                    return [matches[0], name_3];
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return [null, null];
    };
    State.prototype.startTicker = function (card) {
        return this.apply(function (card) { return card.startTicker(); }, card);
    };
    State.prototype.endTicker = function (card) {
        return this.apply(function (card) { return card.endTicker(); }, card);
    };
    State.prototype.addHistory = function (record) {
        return this.update({ history: this.history.concat([record]) });
    };
    State.prototype.shiftFuture = function () {
        var _a;
        var record, future;
        _a = __read(shiftFirst(this.future), 2), record = _a[0], future = _a[1];
        return [this.update({ future: future, }), record];
    };
    State.prototype.popFuture = function () {
        var _a;
        var record, future;
        _a = __read(popLast(this.future), 2), record = _a[0], future = _a[1];
        return [this.update({ future: future, }), record];
    };
    // Invariant: starting from checkpoint and replaying the history gets you to the current state
    // To maintain this invariant, we need to record history every time there is a change
    State.prototype.setCheckpoint = function () {
        return this.update({ history: [], future: this.future, checkpoint: this });
    };
    // backup() leads to the same place as this if you run mainLoop, but it has more future
    // this enables undoing by backing up until you have future, then just popping from the future
    State.prototype.backup = function () {
        return this.checkpoint.update({ future: this.history.concat(this.future) });
    };
    State.prototype.makeID = function () {
        var id = this.nextID;
        return [this.update({ nextID: id + 1 }), id];
    };
    State.prototype.lastReplayable = function () {
        if (this.history.length > 0)
            return this.history[this.history.length - 1];
        else if (this.checkpoint == null)
            return null;
        else
            return this.checkpoint.lastReplayable();
    };
    State.prototype.undoable = function () {
        var record = this.lastReplayable();
        return (record != null && record.kind == 'choice');
    };
    return State;
}());
function popLast(xs) {
    var n = xs.length;
    if (n == 0)
        return [null, xs];
    return [xs[n - 1], xs.slice(0, n - 1)];
}
function shiftFirst(xs) {
    if (xs.length == 0)
        return [null, xs];
    return [xs[0], xs.slice(1)];
}
var emptyState = new State({ coin: 0, time: 0, points: 0 }, new Map([['supply', []], ['hand', []], ['deck', []], ['discard', []], ['play', []], ['aside', []]]), [], 0, [], [], null // resolving, nextID, history, future, checkpoint
);
// ---------- Methods for inserting cards into zones
// tests whether card1 should appear before card2 in sorted order
function comesBefore(card1, card2) {
    var key = function (card) { return card.name + card.charge + card.tokens.join(''); };
    return key(card1) < (key(card2));
}
function assertNever(x) {
    throw new Error("Unexpected: " + x);
}
function insertInto(x, xs, n) {
    return xs.slice(0, n).concat([x]).concat(xs.slice(n + 1));
}
function insertAt(zone, card, loc) {
    switch (loc) {
        case 'start':
        case 'top':
            return [card].concat(zone);
        case 'bottom':
        case 'end':
            return zone.concat([card]);
        case 'sorted':
            for (var i = 0; i < zone.length; i++) {
                if (comesBefore(card, zone[i]))
                    return insertInto(card, zone, i);
            }
            return zone.concat([card]);
        default: return assertNever(loc);
    }
}
var Shadow = /** @class */ (function () {
    function Shadow(id, original, kind, tick, text) {
        this.id = id;
        this.original = original;
        this.kind = kind;
        this.tick = tick;
        this.text = text;
    }
    Shadow.prototype.tickUp = function () {
        return new Shadow(this.id, this.original, this.kind, this.tick + 1, this.text);
    };
    return Shadow;
}());
// ---------------------------------- Transformations that move cards
function create(spec, zone, loc) {
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var id, card;
            var _a;
            return __generator(this, function (_b) {
                _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
                card = new Card(spec, id);
                state = state.addToZone(card, zone, loc);
                return [2 /*return*/, trigger({ type: 'create', card: card, zone: zone })(state)];
            });
        });
    };
}
function recycle(cards) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(randomChoices(state, cards, cards.length), 2), state = _a[0], cards = _a[1];
                        return [4 /*yield*/, trigger({ type: 'recycle', cards: cards })(state)];
                    case 1:
                        state = _b.sent();
                        return [4 /*yield*/, moveMany(cards, 'deck')(state)];
                    case 2:
                        state = _b.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
function move(card, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var fromZone;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(state.find(card), 2), card = _a[0], fromZone = _a[1];
                        if (!(card != null)) return [3 /*break*/, 2];
                        state = state.remove(card);
                        if (toZone == "resolving") {
                            state = state.remove(card).addResolving(card);
                        }
                        else {
                            state = state.addToZone(card, toZone, loc);
                        }
                        return [4 /*yield*/, trigger({ type: 'move', fromZone: fromZone, toZone: toZone, loc: loc, card: card })(state)];
                    case 1:
                        state = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, state];
                }
            });
        });
    };
}
function moveMany(cards, toZone, loc) {
    if (loc === void 0) { loc = 'end'; }
    return doAll(cards.map(function (card) { return move(card, toZone); }));
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
function trash(card) {
    return move(card, null);
}
function draw(n, source) {
    if (source === void 0) { source = { name: '?' }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var drawParams, drawn, i, nextCard, rest;
            var _a;
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
                        nextCard = void 0, rest = void 0;
                        _a = __read(shiftFirst(state.deck), 2), nextCard = _a[0], rest = _a[1];
                        return [4 /*yield*/, move(nextCard, 'hand', 'sorted')(state)];
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
                    case 1: return [4 /*yield*/, multichoice(state, "Choose " + n + " cards to discard.", state.hand.map(asChoice), (function (xs) { return xs.length == n; }))];
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
// --------------- Transforms that change points, time, and coints
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
function setCoin(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var adjustment;
            return __generator(this, function (_a) {
                adjustment = n - state.coin;
                return [2 /*return*/, gainCoin(adjustment)(state)];
            });
        });
    };
}
function gainTime(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = state.setTime(state.time + n);
                return [2 /*return*/, trigger({ type: 'gainTime', amount: n })(state)];
            });
        });
    };
}
var Victory = /** @class */ (function (_super) {
    __extends(Victory, _super);
    function Victory(state) {
        var _this = _super.call(this, 'Victory') || this;
        _this.state = state;
        Object.setPrototypeOf(_this, Victory.prototype);
        return _this;
    }
    return Victory;
}(Error));
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
                        state = state.setPoints(state.points + n);
                        if (state.points > 50)
                            throw new Victory(state);
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
// ------------------------ Utilities for manipulating transformations
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
    return state;
}
// ----------------- Transforms for charge and tokens
function discharge(card, n) {
    return charge(card, -n, true);
}
function charge(card, n, cost) {
    if (cost === void 0) { cost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _, oldCharge, newCharge;
            var _a;
            return __generator(this, function (_b) {
                _a = __read(state.find(card), 2), card = _a[0], _ = _a[1];
                if (card == null) {
                    if (cost)
                        throw new CostNotPaid("card no longer exists");
                    return [2 /*return*/, state];
                }
                else if (card.charge + n < 0 && cost) {
                    throw new CostNotPaid("not enough charge");
                }
                oldCharge = card.charge;
                newCharge = Math.max(oldCharge + n, 0);
                state = state.apply(function (card) { return card.update({ charge: newCharge }); }, card);
                return [2 /*return*/, trigger({ type: 'chargeChange', card: card,
                        oldCharge: oldCharge, newCharge: newCharge, cost: cost })(state)];
            });
        });
    };
}
function addToken(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = state.apply(function (card) { return card.update({ tokens: card.tokens.concat([token]) }); }, card);
                return [2 /*return*/, trigger({ type: 'addToken', card: card, token: token })(state)];
            });
        });
    };
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
function removeTokens(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var removed;
            return __generator(this, function (_a) {
                removed = countTokens(card, token);
                state = state.apply(function (card) { return card.update({ tokens: card.tokens.filter(function (x) { return (x != token); }) }); }, card);
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
                state = state.apply(function (card) { return card.update({ tokens: removeOneToken(card.tokens) }); }, card);
                return [2 /*return*/, trigger({ type: 'removeTokens', token: token, removed: removed })(state)];
            });
        });
    };
}
// ---------------- Randomness
// pseudorandom float in [0,1] based on two integers a, b
// homemade, probably not very good
function PRF(a, b) {
    var N = 123456789;
    return ((a * 1003303882 + b * 6690673372 + b * b * 992036483 +
        a * a * 99202618 + ((a * a + 1) / (b * b + 1)) * 399220 +
        ((b * b + 1) / (a * a + 1)) * 392901666676) % N) / N;
}
function randomChoice(state, xs, seed) {
    var _a;
    if (seed === void 0) { seed = null; }
    if (xs.length == 0)
        return [state, null];
    _a = __read(randomChoices(state, xs, 1, seed), 2), state = _a[0], xs = _a[1];
    return [state, xs[0]];
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
        _a = __read(doOrReplay(state, function () { return (seed == null) ? Math.random() : PRF(seed, result.length); }, 'rng'), 2), state = _a[0], rand = _a[1];
        var k = Math.floor(rand * xs.length);
        result.push(xs[k]);
        xs[k] = xs[xs.length - 1];
        xs = xs.slice(0, xs.length - 1);
    }
    return [state, result];
}
// ------------------ Rendering
function renderCost(cost) {
    var coinHtml = cost.coin > 0 ? "$" + cost.coin : '';
    var timeHtml = renderTime(cost.time);
    if (coinHtml == '' && timeHtml == '')
        return '&nbsp';
    else if (coinHtml == '')
        return timeHtml;
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
function renderShadow(shadow, state) {
    var card = shadow.original;
    var tokenhtml = card.tokens.length > 0 ? '*' : '';
    var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
    var costhtml = renderCost(card.cost(state));
    var ticktext = "tick=" + shadow.tick;
    var shadowtext = "shadow='true'";
    var tooltip;
    switch (shadow.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.text);
            break;
        case 'trigger':
        case 'replacer':
            tooltip = renderStatic(shadow.text);
            break;
        case 'buy':
            tooltip = shadow.original.effect().description;
            break;
        default: assertNever(shadow.kind);
    }
    return ["<div class='card' " + ticktext + " " + shadowtext + ">",
        "<div class='cardbody'>" + card + tokenhtml + chargehtml + "</div>",
        "<div class='cardcost'>" + costhtml + "</div>",
        "<span class='tooltip'>" + tooltip + "</span>",
        "</div>"].join('');
}
function renderCard(card, state, asOption) {
    if (asOption === void 0) { asOption = null; }
    if (card instanceof Shadow) {
        return renderShadow(card, state);
    }
    else if (card instanceof Card) {
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
    var triggerHtml = card.triggers().map(function (x) { return renderStatic(x.description); }).join('');
    var replacerHtml = card.replacers().map(function (x) { return renderStatic(x.description); }).join('');
    var staticHtml = triggerHtml + replacerHtml;
    var tokensHtml = card.tokens.length > 0 ? "Tokens: " + card.tokens.join(', ') : '';
    var baseFilling = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('');
    function renderRelated(spec) {
        var card = new Card(spec, -1);
        var costStr = renderCost(card.cost(emptyState));
        return "<div>---" + card.toString() + " (" + costStr + ")---</div>" + renderTooltip(card, state);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "" + baseFilling + relatedFilling;
}
// make the currently rendered state available in the console for debugging purposes
var renderedState;
function renderState(state, optionsMap) {
    if (optionsMap === void 0) { optionsMap = null; }
    renderedState = state;
    clearChoice();
    function render(card) {
        if (optionsMap != null && optionsMap.has(card.id)) {
            return renderCard(card, state, optionsMap.get(card.id));
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
    $('#supply').html(state.supply.map(render).join(''));
    $('#hand').html(state.hand.map(render).join(''));
    $('#deck').html(state.deck.map(render).join(''));
    $('#discard').html(state.discard.map(render).join(''));
}
// ------------------------------ History replay
function doOrReplay(state, f, kind) {
    var _a;
    var x, k, record;
    _a = __read(state.shiftFuture(), 2), state = _a[0], record = _a[1];
    if (record == null) {
        x = f();
    }
    else {
        if (record.kind != kind)
            throw Error("replaying history we found " + record + " where expecting kind " + kind);
        x = record.value;
    }
    return [state.addHistory({ kind: kind, value: x }), x];
}
//TODO: surely there is some way to unify these?
function asyncDoOrReplay(state, f, kind) {
    return __awaiter(this, void 0, void 0, function () {
        var x, k, record;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = __read(state.shiftFuture(), 2), state = _a[0], record = _a[1];
                    if (!(record == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, f()];
                case 1:
                    x = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    if (record.kind != kind)
                        throw Error("replaying history we found " + record + " where expecting kind " + kind);
                    x = record.value;
                    _b.label = 3;
                case 3: return [2 /*return*/, [state.addHistory({ kind: kind, value: x }), x]];
            }
        });
    });
}
function multichoice(state, prompt, options, validator) {
    if (validator === void 0) { validator = (function (xs) { return true; }); }
    return __awaiter(this, void 0, void 0, function () {
        var indices;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(options.length == 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, [state, []]];
                case 1:
                    indices = void 0;
                    return [4 /*yield*/, asyncDoOrReplay(state, function () { return freshMultichoice(state, prompt, options, validator); }, 'multichoice')];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], indices = _a[1];
                    return [2 /*return*/, [state, indices.map(function (i) { return options[i].value; })]];
            }
        });
    });
}
function choice(state, prompt, options) {
    return __awaiter(this, void 0, void 0, function () {
        var index, index_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(options.length == 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, [state, null]];
                case 1:
                    if (!(options.length == 1)) return [3 /*break*/, 2];
                    return [2 /*return*/, [state, options[0].value]];
                case 2: return [4 /*yield*/, asyncDoOrReplay(state, function () { return freshChoice(state, prompt, options); }, 'choice')];
                case 3:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], index_1 = _a[1];
                    return [2 /*return*/, [state, options[index_1].value]];
            }
        });
    });
}
var yesOrNo = [
    { kind: 'string', render: 'Yes', value: true },
    { kind: 'string', render: 'No', value: false }
];
function asChoice(x) {
    return { kind: 'card', render: x, value: x };
}
function allowNull(options, message) {
    if (message === void 0) { message = "None"; }
    return options.concat([{ kind: 'string', render: message, value: null }]);
}
function renderChoice(state, choicePrompt, options, multi) {
    var optionsMap = new Map(); //map card ids to their position in the choice list
    var stringOptions = [];
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        switch (option.kind) {
            case 'card':
                optionsMap.set(option.render.id, i);
                break;
            case 'string':
                stringOptions.push([i, option.render]);
                break;
            default: assertNever(option);
        }
    }
    if (multi)
        stringOptions.push(['submit', 'Done']);
    renderState(state, optionsMap);
    $('#choicePrompt').html(choicePrompt);
    $('#options').html(stringOptions.map(renderOption).join(''));
    $('#undoArea').html(renderUndo(state.undoable()));
}
function renderOption(option) {
    return "<span class='option' option='" + option[0] + "' choosable='true' chosen='false'>" + option[1] + "</span>";
}
function renderUndo(undoable) {
    return "<span class='option', option='undo' chooseable='" + undoable + "' chosen='false'>Undo</span>";
}
function clearChoice() {
    $('#choicePrompt').html('');
    $('#options').html('');
    $('#undoArea').html('');
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
function bindUndo(state, reject) {
    $("[option='undo']").on('click', function (e) {
        if (state.undoable())
            reject(new Undo(state));
    });
}
function freshChoice(state, choicePrompt, options) {
    renderChoice(state, choicePrompt, options, false);
    return new Promise(function (resolve, reject) {
        var _loop_1 = function (i) {
            var j = i;
            var elem = $("[option='" + i + "']");
            elem.on('click', function (e) {
                clearChoice();
                resolve(j);
            });
        };
        for (var i = 0; i < options.length; i++) {
            _loop_1(i);
        }
        bindUndo(state, reject);
    });
}
//TODO: order can matter, should we make order visible somehow?
//TODO: what to do if you can't pick a valid set for the validator?
function freshMultichoice(state, choicePrompt, options, validator) {
    if (validator === void 0) { validator = (function (xs) { return true; }); }
    renderChoice(state, choicePrompt, options, true);
    var chosen = new Set();
    function chosenOptions() {
        var e_4, _a;
        var result = [];
        try {
            for (var chosen_1 = __values(chosen), chosen_1_1 = chosen_1.next(); !chosen_1_1.done; chosen_1_1 = chosen_1.next()) {
                var i = chosen_1_1.value;
                result.push(options[i].value);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (chosen_1_1 && !chosen_1_1.done && (_a = chosen_1.return)) _a.call(chosen_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    }
    function isReady() {
        return validator(chosenOptions());
    }
    function setReady() {
        if (isReady()) {
            $("[option='submit']").attr('choosable', true);
        }
        else {
            $("[option='submit']").removeAttr('choosable');
        }
    }
    setReady();
    return new Promise(function (resolve, reject) {
        var _loop_2 = function (i) {
            var j = i;
            var elem = $("[option='" + i + "']");
            elem.on('click', function (e) {
                if (chosen.has(j)) {
                    chosen.delete(j);
                    elem.attr('chosen', false);
                }
                else {
                    chosen.add(j);
                    elem.attr('chosen', true);
                }
            });
        };
        for (var i = 0; i < options.length; i++) {
            _loop_2(i);
        }
        $("[option='submit']").on('click', function (e) {
            if (isReady()) {
                resolve(Array.from(chosen.values()));
            }
        });
        bindUndo(state, reject);
    });
}
// --------------------- act
// This is the 'default' choice the player makes when nothing else is happening
function act(state) {
    return __awaiter(this, void 0, void 0, function () {
        var card, zone;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], card = _a[1];
                    if (card == null)
                        throw new Error('No valid options.');
                    _b = __read(state.find(card), 2), card = _b[0], zone = _b[1];
                    switch (zone) {
                        case 'play':
                            return [2 /*return*/, useCard(card)(state)];
                        case 'hand':
                            return [2 /*return*/, tryToPlay(card)(state)];
                        case 'supply':
                            return [2 /*return*/, tryToBuy(card)(state)];
                        case 'aside':
                        case 'discard':
                        case 'deck':
                        case null:
                            throw new Error("Card can't be in zone " + zone);
                        default: assertNever(zone);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function actChoice(state) {
    var validSupplies = state.supply.filter(function (x) { return (x.cost(state).coin <= state.coin); });
    var validHand = state.hand;
    var validPlay = state.play.filter(function (x) { return (x.abilities().length > 0); });
    var cards = validSupplies.concat(validHand).concat(validPlay);
    return choice(state, 'Play from your hand, use an ability, or buy from a supply.', cards.map(asChoice));
}
function useCard(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var ability;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        state = state.startTicker(card);
                        return [4 /*yield*/, choice(state, "Choose an ability to use:", card.abilities().map(function (x) { return ({ kind: 'string', render: x.description, value: x }); }))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], ability = _a[1];
                        state = state.endTicker(card);
                        if (!(ability != null)) return [3 /*break*/, 3];
                        state = state.addShadow(card, 'ability', ability.description);
                        state = state.startTicker(card);
                        return [4 /*yield*/, payToDo(ability.cost, ability.effect)(state)];
                    case 2:
                        state = _b.sent();
                        state = state.endTicker(card);
                        state = state.popResolving();
                        _b.label = 3;
                    case 3: return [2 /*return*/, state];
                }
            });
        });
    };
}
function tryToBuy(card) {
    return payToDo(card.payCost(), card.buy({ name: 'act' }));
}
function tryToPlay(card) {
    return payToDo(card.payCost(), card.play({ name: 'act' }));
}
// ---------------------------- Game loop
function undo(state) {
    var _a;
    while (true) {
        var last = void 0;
        _a = __read(state.popFuture(), 2), state = _a[0], last = _a[1];
        if (last == null) {
            state = state.backup();
            if (state == null)
                throw Error("tried to undo past beginning of time");
        }
        else {
            switch (last.kind) {
                case 'choice':
                case 'multichoice':
                    return state;
                case 'rng':
                    throw Error("tried to undo past randomness");
                default: assertNever(last);
            }
        }
    }
}
function mainLoop(state) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = state.setCheckpoint();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, act(state)];
                case 2:
                    state = _a.sent();
                    return [2 /*return*/, state];
                case 3:
                    error_2 = _a.sent();
                    if (error_2 instanceof Undo) {
                        return [2 /*return*/, undo(error_2.state)];
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
// ------------------------------ Start the game
function supplyKey(card) {
    return card.cost(emptyState).coin;
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2);
}
function playGame(seed) {
    if (seed === void 0) { seed = null; }
    return __awaiter(this, void 0, void 0, function () {
        var startingDeck, state, shuffledDeck, variableSupplies, i, kingdom, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startingDeck = [copper, copper, copper, copper, copper,
                        copper, copper, estate, estate, estate];
                    state = emptyState;
                    _a = __read(randomChoices(state, startingDeck, startingDeck.length, seed + 1), 2), state = _a[0], shuffledDeck = _a[1];
                    return [4 /*yield*/, doAll(shuffledDeck.map(function (x) { return create(x, 'deck'); }))(state)];
                case 1:
                    state = _c.sent();
                    _b = __read(randomChoices(state, mixins, 12, seed), 2), state = _b[0], variableSupplies = _b[1];
                    variableSupplies.sort(supplySort);
                    if (testing.length > 0)
                        for (i = 0; i < cheats.length; i++)
                            testing.push(cheats[i]);
                    kingdom = coreSupplies.concat(variableSupplies).concat(testing);
                    return [4 /*yield*/, doAll(kingdom.map(function (x) { return create(x, 'supply'); }))(state)];
                case 2:
                    state = _c.sent();
                    return [4 /*yield*/, trigger({ type: 'gameStart' })(state)];
                case 3:
                    state = _c.sent();
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, mainLoop(state)];
                case 5:
                    state = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _c.sent();
                    if (error_3 instanceof Victory) {
                        renderState(error_3.state);
                        $('#choicePrompt').html("You won using " + error_3.state.time + " time!");
                    }
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getSeed() {
    var seed = new URLSearchParams(window.location.search).get('seed');
    var n = Number(seed);
    return (isNaN(n)) ? null : n;
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
    return { name: card.name,
        fixedCost: cost,
        effect: function (supply) { return gainCard(card); },
        relatedCards: [card],
    };
}
function register(card, test) {
    if (test === void 0) { test = null; }
    mixins.push(card);
    if (test == 'test')
        testing.push(card);
}
function buyable(card, n, test) {
    if (test === void 0) { test = null; }
    register(supplyForCard(card, coin(n)), test);
}
function time(n) {
    return { time: n, coin: 0 };
}
function coin(n) {
    return { time: 0, coin: n };
}
//renders either "a" or "an" as appropriate
function a(x) {
    var s = x.toString();
    var c = s[0].toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s;
    return 'a ' + s;
}
function makeCard(card, cost, selfdestruct) {
    if (selfdestruct === void 0) { selfdestruct = false; }
    return { name: card.name,
        fixedCost: cost,
        effect: function (supply) { return ({
            description: "Create " + a(card) + " in play." + selfdestruct ? ' Trash this.' : '',
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
        }); },
        relatedCards: [card],
    };
}
//
//
// ------ CORE ------
//
var reboot = { name: 'Reboot',
    fixedCost: time(3),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +5 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoin(0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(5, reboot)(state)];
                    }
                });
            });
        }
    }); }
};
coreSupplies.push(reboot);
var copper = { name: 'Copper',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$1',
        effect: gainCoin(1),
    }); }
};
coreSupplies.push(supplyForCard(copper, coin(1)));
var silver = { name: 'Silver',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$2',
        effect: gainCoin(2)
    }); }
};
coreSupplies.push(supplyForCard(silver, coin(3)));
var gold = { name: 'Gold',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$3',
        effect: gainCoin(3)
    }); }
};
coreSupplies.push(supplyForCard(gold, coin(6)));
var estate = { name: 'Estate',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+1vp',
        effect: gainPoints(1),
    }); }
};
coreSupplies.push(supplyForCard(estate, coin(1)));
var duchy = { name: 'Duchy',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2vp',
        effect: gainPoints(2),
    }); }
};
coreSupplies.push(supplyForCard(duchy, coin(4)));
var province = { name: 'Province',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+3vp',
        effect: gainPoints(3),
    }); }
};
coreSupplies.push(supplyForCard(province, coin(8)));
//
// ----- MIXINS -----
//
var throneRoom = { name: 'Throne Room',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Play a card in your hand. Then if it's in your discard pile play it again.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target, zone;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play twice.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _c.sent();
                            state = tick(card)(state);
                            _b = __read(state.find(target), 2), target = _b[0], zone = _b[1];
                            if (!(zone == 'discard')) return [3 /*break*/, 4];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 3:
                            state = _c.sent();
                            _c.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
buyable(throneRoom, 4);
var mule = { name: 'Mule',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards',
        effect: draw(2)
    }); }
};
buyable(mule, 1);
var smithy = { name: 'Smithy',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+3 cards',
        effect: draw(3)
    }); }
};
buyable(smithy, 4);
var tutor = { name: 'Tutor',
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
};
buyable(tutor, 3);
var cellar = { name: 'Cellar',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Discard any number of cards in your hand, then draw that many cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDiscard;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to discard.', state.hand.map(asChoice), function (xs) { return true; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDiscard = _a[1];
                            return [4 /*yield*/, moveMany(toDiscard, 'discard')(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, draw(toDiscard.length)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(cellar, 2);
var pearlDiver = { name: 'Pearl Diver',
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
};
buyable(pearlDiver, 2);
var peddler = { name: 'Peddler',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    }); }
};
var makePeddler = { name: 'Peddler',
    fixedCost: coin(5),
    effect: function (card) { return ({
        description: 'Create a peddler on top of your deck',
        effect: create(peddler, 'deck', 'top')
    }); },
    relatedCards: [peddler]
};
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
var village = { name: 'Village',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. " + villagestr,
        effect: doAll([draw(1), freeAction, tick(card), freeAction])
    }); }
};
buyable(village, 3);
var bazaar = { name: 'Bazaar',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. +$1. " + villagestr,
        effect: doAll([draw(1), gainCoin(1), freeAction, tick(card), freeAction])
    }); }
};
buyable(bazaar, 5);
var workshop = { name: 'Workshop',
    effect: function (card) { return ({
        description: 'Buy a card in the supply costing up to $4.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supply.filter(function (card) { return (card.cost(state).coin <= 4 && card.cost(state).time <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $4 to buy.', allowNull(options.map(asChoice)))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, target.buy(card)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(workshop, 3);
var shippingLane = { name: 'Shipping Lane',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+$2. Next time you finish buying a card, buy it again if it still exists.",
        effect: doAll([
            gainCoin(2),
            nextTime('Shipping Lane', 'When you finish buying a card, discard this and buy it again if it still exists.', function (e) { return e.type == 'afterBuy'; }, function (e) { return (e.after == null) ? noop : e.after.buy(card); })
        ])
    }); }
};
buyable(shippingLane, 5);
var factory = { name: 'Factory',
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
                            options = state.supply.filter(function (card) { return (card.cost(state).coin <= 6 && card.cost(state).time <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $6 to buy.', allowNull(options.map(asChoice)))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            return [2 /*return*/, target.buy(card)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(factory, 4);
var feast = { name: 'Feast',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$5. Trash this.',
        effect: doAll([gainCoin(5), trash(card)]),
    }); }
    //effect: card => ({
    //    description: 'Buy a card costing up to $6. Trash this.',
    //    effect: async function(state) {
    //        options = state.supply.filter(card => (card.cost(state).coin <= 6 && card.cost(state).time <= 0));
    //        [state, target] = await choice(state, 'Choose a card costing up to $6 to buy.',
    //            allowNull(options.map(asChoice)))
    //        state = await target.buy('feast')(state)
    //        return trash(card)(state)
    //    },
    //    skipDiscard:true,
    //})
};
buyable(feast, 4);
//TODO: let Reboot choose cards arbitrarily if it costs 0
var warFooting = { name: 'War Footing',
    replacers: function (card) { return [{
            description: 'Reboot costs @ less to play.',
            handles: function (x) { return (x.type == 'cost' && x.card == 'Reboot'); },
            replace: applyToKey('cost', applyToKey('time', function (x) { return Math.max(0, x - 1); }))
        }]; }
};
var gainWarFooting = { name: 'War Footing',
    calculatedCost: function (card, state) { return ({ time: 0, coin: 15 + 10 * card.charge }); },
    effect: function (card) { return ({
        description: "Create a " + card.relatedCards()[0] + " in play." +
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(warFooting, 'play'), charge(card, 1)])
    }); },
    relatedCards: [warFooting],
};
mixins.push(gainWarFooting);
var junkDealer = { name: 'Junk Dealer',
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
};
buyable(junkDealer, 5);
var refresh = { name: 'Refresh',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, recycle(state.discard)(state)];
            }); });
        }
    }); }
};
mixins.push(refresh);
var plough = { name: 'Plough',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle any number of cards from your discard pile. +2 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cards;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to recycle.', state.discard.map(asChoice), function (xs) { return true; })];
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
};
buyable(plough, 5);
var vassal = { name: 'Vassal',
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
};
buyable(vassal, 3);
var reinforce = { name: 'Reinforce',
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
                        _a = __read(state.find(e.before), 2), played = _a[0], zone = _a[1];
                        return [2 /*return*/, (zone == 'discard') ? played.play(card)(state) : state];
                    });
                });
            }; }
        }]; },
};
register(reinforce);
var blacksmith = { name: 'Blacksmith',
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
                            _a = __read(state.find(card), 2), played = _a[0], _ = _a[1];
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
};
buyable(blacksmith, 2);
function nextTime(name, description, when, what) {
    var spec = {
        name: name,
        triggers: function (card) { return [{
                description: description,
                handles: when,
                effect: function (e) { return doAll([trash(card), what(e)]); },
            }]; }
    };
    return create(spec, 'play');
}
var expedite = { name: 'Expedite',
    calculatedCost: function (card, state) { return ({ time: 1, coin: card.charge }); },
    effect: function (card) { return ({
        description: 'The next time you create a card, put it into your hand.' +
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: nextTime('Expedite', 'When you create a card, trash this and put it into your hand.', function (e, state) { return (e.type == 'create'); }, function (e) { return move(e.card, 'hand'); })
    }); }
};
register(expedite);
var goldMine = { name: 'Gold Mine',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Create a gold in your hand and a gold on top of your deck.',
        effect: doAll([create(gold, 'hand', 'top'), create(gold, 'hand')]),
    }); }
};
buyable(goldMine, 6);
var vault = { name: 'Vault',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards. Discard any number of cards from your hand, +1 card per card discarded.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDiscard;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(2)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, multichoice(state, 'Discard any number of cards for +$1 each.', state.hand.map(asChoice), function (xs) { return true; })];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDiscard = _a[1];
                            return [4 /*yield*/, moveMany(toDiscard, 'discard')(state)];
                        case 3:
                            state = _b.sent();
                            return [2 /*return*/, draw(toDiscard.length)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(vault, 5);
var cursedKingdom = { name: 'Cursed Kingdom',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+4 vp. Put a charge token on this.',
        effect: doAll([gainPoints(4), charge(card, 1)])
    }); }
};
var gainCursedKingdom = { name: 'Cursed Kingdom',
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
};
mixins.push(gainCursedKingdom);
var junkyard = { name: 'Junkyard',
    fixedCost: time(0),
    triggers: function (card) { return [{
            description: 'Whenever you trash a card, +1 vp.',
            handles: function (e) { return (e.type == 'moved' && e.toZone == null); },
            effect: function (e) { return gainPoints(1); }
        }]; }
};
mixins.push(makeCard(junkyard, { coin: 7, time: 3 }));
var bustlingSquare = { name: 'Bustling Square',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. Set aside all cards in your hand. Play them in any order.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var hand, _loop_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _a.sent();
                            hand = state.hand;
                            return [4 /*yield*/, moveWholeZone('hand', 'aside')(state)];
                        case 2:
                            state = _a.sent();
                            _loop_3 = function () {
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
                            return [5 /*yield**/, _loop_3()];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 5: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
buyable(bustlingSquare, 6);
var colony = { name: 'Colony',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+5vp',
        effect: gainPoints(5),
    }); }
};
buyable(colony, 16);
var windfall = { name: 'Windfall',
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
};
register(windfall);
var stables = { name: 'Stables',
    abilities: function (card) { return [{
            description: 'Remove a charge token from this. If you do, +1 card.',
            cost: discharge(card, 1),
            effect: draw(1, card),
        }]; }
};
var horse = { name: 'Horse',
    fixedCost: coin(2),
    effect: function (card) { return ({
        description: "Put a charge token on a " + stables + " in play.",
        effect: fill(stables, 1),
    }); },
    triggers: function (card) { return [ensureAtStart(stables)]; },
};
register(horse);
var lookout = { name: 'Lookout',
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
                                case 0: return [4 /*yield*/, choice(state, "Pick a card to " + descriptor + ".", picks.map(asChoice))];
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
};
buyable(lookout, 3);
var lab = { name: 'Lab',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+2 cards',
        effect: draw(2)
    }); }
};
buyable(lab, 5);
var roadNetwork = { name: 'Road Network',
    fixedCost: time(0),
    triggers: function (_) { return [{
            description: 'Whenever you create a card in your discard pile, move it to the top of your deck.',
            handles: function (e) { return (e.type == 'create' && e.toZone == 'discard'); },
            effect: function (e) { return move(e.card, 'deck', 'top'); }
        }]; }
};
mixins.push(makeCard(roadNetwork, coin(5), true));
var twins = { name: 'Twins',
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
};
register(makeCard(twins, { time: 0, coin: 6 }));
var masterSmith = { name: 'Master Smith',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: '+5 cards',
        effect: draw(5),
    }); }
};
buyable(masterSmith, 5);
var reuse = { name: 'Reuse',
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
};
mixins.push(reuse);
var reconfigure = { name: 'Reconfigure',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +1 card per card that was in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoin(0)(state)];
                        case 1:
                            state = _a.sent();
                            n = state.hand.length;
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(n, card)(state)];
                    }
                });
            });
        }
    }); }
};
mixins.push(reconfigure);
var bootstrap = { name: 'Bootstrap',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +2 cards.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setCoin(0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, recycle(state.hand.concat(state.discard))(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, draw(2, bootstrap)(state)];
                    }
                });
            });
        }
    }); }
};
mixins.push(bootstrap);
var retry = { name: 'Resume',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Discard your hand, lose all $, and +5 cards.',
        effect: doAll([
            setCoin(0),
            moveWholeZone('hand', 'discard'),
            draw(5, retry)
        ])
    }); }
};
mixins.push(retry);
var research = { name: 'Research',
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
};
mixins.push(research);
var platinum = { name: "Platinum",
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$5',
        effect: gainCoin(5)
    }); }
};
buyable(platinum, 10);
var innovation = { name: "Innovation",
    triggers: function (card) { return [{
            description: "Whenever you create a card in your discard pile, if this has an innovate token on it:" +
                " remove all innovate tokens from this, discard your hand, lose all $, and play the card.",
            handles: function (e) { return (e.type == 'create' && e.toZone == 'discard' && countTokens(card, 'innovate') > 0); },
            effect: function (e) { return doAll([
                removeTokens(card, 'innovate'),
                moveWholeZone('hand', 'discard'),
                setCoin(0),
                e.card.play(card)
            ]); },
        }]; },
    abilities: function (card) { return [{
            description: "Put an innovate token on this.",
            cost: noop,
            effect: addToken(card, 'innovate')
        }]; }
};
register(makeCard(innovation, { coin: 7, time: 0 }, true));
var citadel = { name: "Citadel",
    triggers: function (card) { return [{
            description: "After playing a card the normal way, if it's the only card in your discard pile, play it again.",
            handles: function (e) { return (e.type == 'afterPlay' && e.source.name == 'act'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (e.after != null && state.find(e.after)[1] == 'discard' && state.discard.length == 1) {
                            return [2 /*return*/, e.after.play(card)(state)];
                        }
                        else {
                            return [2 /*return*/, state];
                        }
                        return [2 /*return*/];
                    });
                });
            }; }
        }]; }
};
register(makeCard(citadel, { coin: 8, time: 0 }, true));
var foolsGold = { name: "Fool's Gold",
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
};
buyable(foolsGold, 2);
var hireling = { name: 'Hireling',
    fixedCost: time(0),
    replacers: function (card) { return [{
            description: "Whenever you draw a card from Reboot, draw an additional card.",
            handles: function (x) { return (x.type == 'draw' && x.source.name == reboot.name); },
            replace: function (x) { return update(x, 'draw', x.draw + 1); },
        }]; }
};
register(makeCard(hireling, { coin: 6, time: 2 }));
var sacrifice = { name: 'Sacrifice',
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
};
buyable(sacrifice, 2);
var horseTraders = { name: 'Horse Traders',
    fixedCost: time(1),
    effect: function (_) { return ({
        description: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    }); }
};
buyable(horseTraders, 4);
var purge = { name: 'Purge',
    fixedCost: time(5),
    effect: function (card) { return ({
        description: 'Trash any number of cards from your hand. Trash this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to trash.', state.hand.map(asChoice), function (xs) { return true; })];
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
};
mixins.push(purge);
var chapel = { name: 'Chapel',
    fixedCost: time(1),
    effect: function (_) { return ({
        description: 'Trash up to four cards from your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose up to four cards to trash.', state.hand.map(asChoice), function (xs) { return xs.length <= 4; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toTrash = _a[1];
                            return [2 /*return*/, moveMany(toTrash, null)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(chapel, 3);
var coppersmith = { name: 'Coppersmith',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+$1 per copper in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, gainCoin(state.hand.filter(function (x) { return x.name == copper.name; }).length)(state)];
                });
            });
        }
    }); }
};
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
var harvest = { name: 'Harvest',
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
};
buyable(harvest, 4);
var fortify = { name: 'Fortify',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Put your discard pile in your hand. Trash this.',
        effect: doAll([moveWholeZone('discard', 'hand'), trash(card)]),
        skipDiscard: true,
    }); }
};
var gainFortify = { name: 'Fortify',
    fixedCost: coin(5),
    effect: function (card) { return ({
        description: 'Create a fortify in your discard pile. Discard your hand.',
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }); },
    relatedCards: [fortify],
};
mixins.push(gainFortify);
var explorer = { name: "Explorer",
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
};
buyable(explorer, 5);
var kingsCourt = { name: "King's Court",
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
                            _b = __read(state.find(target), 2), target = _b[0], zone = _b[1];
                            if (zone != 'discard')
                                return [3 /*break*/, 6];
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
};
buyable(kingsCourt, 10);
var gardens = { name: "Gardens",
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
};
mixins.push(gardens);
var pathfinding = { name: 'Pathfinding',
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
};
mixins.push(pathfinding);
var counterfeit = { name: 'Counterfeit',
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
};
buyable(counterfeit, 5);
var decay = { name: 'Decay',
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
};
mixins.push(decay);
var perpetualMotion = { name: 'Perpetual Motion',
    triggers: function (card) { return [{
            description: 'Whenever you have no cards in hand, draw a card.',
            handles: function (e, state) { return (state.hand.length == 0 && state.deck.length > 0); },
            effect: function (e) { return draw(1); },
        }]; }
};
register(makeCard(perpetualMotion, time(7), true));
var looter = { name: 'Looter',
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
                            return [4 /*yield*/, choice(state, 'Choose a card to discard (along with everything above it).', allowNull(state.deck.map(function (x, i) { return ({ kind: 'card', render: state.deck[i], value: i }); })))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], index = _a[1];
                            return [2 /*return*/, (index == null) ? state : moveMany(state.deck.slice(0, index + 1), 'discard')(state)];
                    }
                });
            });
        }
    }); }
};
buyable(looter, 3);
var scavenger = { name: 'Scavenger',
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
};
buyable(scavenger, 4);
var coffers = { name: 'Coffers',
    abilities: function (card) { return [{
            description: 'Remove a charge token from this. If you do, +$1.',
            cost: discharge(card, 1),
            effect: gainCoin(1),
        }]; }
};
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
var fillCoffers = { name: 'Fill Coffers',
    fixedCost: coin(3),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + coffers + " in play.",
        effect: fill(coffers, 2)
    }); },
    triggers: function (card) { return [ensureAtStart(coffers)]; }
};
register(fillCoffers);
var cotr = { name: 'Coin of the Realm',
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
};
buyable(cotr, 3);
var mountainVillage = { name: 'Mountain Village',
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
};
buyable(mountainVillage, 3);
var fillStables = { name: 'Fill Stables',
    fixedCost: coin(4),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + stables + " in play.",
        effect: fill(stables, 2),
    }); },
    triggers: function (card) { return [ensureAtStart(stables)]; },
};
register(fillStables);
var sleigh = { name: 'Sleigh',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + stables + " in play.",
        effect: fill(stables, 2),
    }); }
};
var makeSleigh = { name: 'Sleigh',
    fixedCost: coin(2),
    relatedCards: [sleigh],
    effect: function (card) { return gainCard(sleigh); },
    triggers: function (card) { return [
        ensureAtStart(stables),
        {
            description: "Whenever you create a card, if you have a " + sleigh + " in your hand," +
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
};
register(makeSleigh);
var ferry = { name: 'Ferry',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Put a ferry token on a supply.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Put a ferry token on a supply.', state.supply.map(asChoice))];
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
};
function ferryReduce(cost, n) {
    return update(cost, 'coin', Math.max(cost.coin - n, (cost.time > 0) ? 0 : 1));
}
var makeFerry = { name: 'Ferry',
    fixedCost: coin(3),
    relatedCards: [ferry],
    effect: function (card) { return gainCard(ferry); },
    replacers: function (card) { return [{
            description: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
            handles: function (p) { return (p.type == 'cost' && countTokens(p.card, 'ferry') > 0); },
            replace: function (p) { return update(p, 'cost', ferryReduce(p.cost, countTokens(p.card, 'ferry'))); }
        }]; }
};
register(makeFerry);
var livery = { name: 'Livery',
    replacers: function (card) { return [{
            description: "Whenever you would draw cards other than with " + stables + "," +
                (" put that many charge tokens on a " + stables + " in play instead."),
            handles: function (x) { return (x.type == 'draw' && x.source.name != stables.name); },
            replace: function (x) { return updates(x, { 'draw': 0, 'effects': x.effects.concat([fill(stables, x.draw)]) }); }
        }]; }
};
var makeLivery = { name: 'Livery',
    fixedCost: time(4),
    relatedCards: [livery, stables],
    effect: function (card) { return ({
        description: "Create a " + livery.name + " in play, and a stables if there isn't one. Trash this.",
        effect: doAll([create(livery, 'play'), createIfNeeded(stables), trash(card)])
    }); },
};
register(makeLivery);
function slogCheck(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var zone;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(state.find(card), 2), card = _a[0], zone = _a[1];
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
var slog = { name: 'Slog',
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
};
register(slog);
var burden = { name: 'Burden',
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
                            options = state.supply.filter(function (x) { return countTokens(x, 'burden') > 0; });
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
};
register(burden);
var artisan = { name: 'Artisan',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    }); }
};
buyable(artisan, 6);
var chancellor = { name: 'Chancellor',
    effect: function (card) { return ({
        description: '+$2. You may discard your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var doit;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _b.sent();
                            if (!(state.deck.length > 0)) return [3 /*break*/, 4];
                            doit = void 0;
                            return [4 /*yield*/, choice(state, 'Discard your deck?', yesOrNo)];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], doit = _a[1];
                            if (!doit) return [3 /*break*/, 4];
                            return [4 /*yield*/, moveWholeZone('deck', 'discard')(state)];
                        case 3:
                            state = _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
buyable(chancellor, 4);
// ------------------ Testing -------------------
var freeMoney = { name: 'Free money',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$100',
        effect: gainCoin(100)
    }); }
};
cheats.push(freeMoney);
var freeTutor = { name: 'Free tutor',
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
};
cheats.push(freeTutor);
var freeDraw = { name: 'Free draw',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Draw a card.',
        effect: draw(1),
    }); }
};
cheats.push(freeDraw);
var freeTrash = { name: 'Free trash',
    effect: function (card) { return ({
        description: 'Trash any number of cards in your hand, deck, and discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toTrash;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose cards to trash.', state.deck.concat(state.discard).concat(state.hand).map(asChoice), function (xs) { return true; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toTrash = _a[1];
                            return [2 /*return*/, moveMany(toTrash, null)(state)];
                    }
                });
            });
        }
    }); }
};
cheats.push(freeTrash);
var drawAll = { name: 'Draw all',
    fixedCost: time(0),
    effect: function (card) { return ({
        description: 'Put all cards from your deck and discard pile into your hand.',
        effect: doAll([moveWholeZone('discard', 'hand'), moveWholeZone('deck', 'hand')]),
    }); }
};
cheats.push(drawAll);
//# sourceMappingURL=main.js.map