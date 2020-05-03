"use strict";
// TODO: the first section of this file isn't 't sorted very well
// TODO: don't currently get type checking for replacement and triggers; checking types would catch a lot of bugs
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: if a zone gets bigger and then, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay things out more nicely
// TODO: minimum width for option choices
// TODO: starting to see performance hiccups in big games
// TODO: probably just want to stop things moving in/out of resolving, as if they didn't exist...
// TODO: accept string seeds
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        var initialCost = { kind: 'cost', card: card, cost: card.baseCost(state) };
        //TODO: would be nice to type check manipulations of these params, but seems harder
        var newCost = replace(initialCost, state);
        return newCost.cost;
    };
    // the transformation that actually pays the cost
    Card.prototype.payCost = function () {
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    state = state.log("Paying for " + card.name);
                    return [2 /*return*/, withTracking(function (state) {
                            return __awaiter(this, void 0, void 0, function () {
                                var cost;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            cost = card.cost(state);
                                            return [4 /*yield*/, gainTime(cost.time)(state)];
                                        case 1:
                                            state = _a.sent();
                                            return [4 /*yield*/, payCoin(cost.coin)(state)];
                                        case 2:
                                            state = _a.sent();
                                            return [2 /*return*/, state];
                                    }
                                });
                            });
                        }, { kind: 'effect', card: card })(state)];
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
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = state.find(card);
                            if (!result.found)
                                return [2 /*return*/, state];
                            card = result.card;
                            return [4 /*yield*/, (state)];
                        case 1:
                            state = _a.sent();
                            state = state.log("Buying " + card.name);
                            return [4 /*yield*/, withTracking(doAll([
                                    trigger({ kind: 'buy', card: card, source: source }),
                                    card.effect().effect,
                                ]), { kind: 'effect', card: card })(state)];
                        case 2:
                            state = _a.sent();
                            return [4 /*yield*/, trigger({ kind: 'afterBuy', before: card, after: state.find(card).card, source: source })(state)];
                        case 3:
                            state = _a.sent();
                            return [2 /*return*/, state];
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
                var result, toZone, toLoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            result = state.find(card);
                            switch (result.found) {
                                case false:
                                    return [2 /*return*/, state];
                                case true:
                                    card = result.card;
                            }
                            return [4 /*yield*/, move(card, 'resolving', 'end', true)(state)];
                        case 1:
                            state = _a.sent();
                            state = state.log("Playing " + card.name);
                            return [4 /*yield*/, withTracking(function (state) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, trigger({ kind: 'play', card: card, source: source })(state)];
                                                case 1:
                                                    state = _a.sent();
                                                    return [4 /*yield*/, effect.effect(state)];
                                                case 2:
                                                    state = _a.sent();
                                                    return [2 /*return*/, state];
                                            }
                                        });
                                    });
                                }, { kind: 'none', card: card })(state)];
                        case 2:
                            state = _a.sent();
                            toZone = (effect['toZone'] == undefined) ? 'discard' : effect['toZone'];
                            toLoc = effect['toLoc'] || 'end';
                            return [4 /*yield*/, move(card, toZone, toLoc, toZone == 'discard')(state)];
                        case 3:
                            state = _a.sent();
                            return [4 /*yield*/, trigger({ kind: 'afterPlay', before: card, after: state.find(card).card, source: source })(state)];
                        case 4:
                            state = _a.sent();
                            return [2 /*return*/, state];
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
var notFound = { found: false, card: null, place: null };
var State = /** @class */ (function () {
    function State(counters, zones, resolving, nextID, history, future, checkpoint, logs, logIndent) {
        this.counters = counters;
        this.zones = zones;
        this.resolving = resolving;
        this.nextID = nextID;
        this.history = history;
        this.future = future;
        this.checkpoint = checkpoint;
        this.logs = logs;
        this.logIndent = logIndent;
        this.coin = counters.coin;
        this.time = counters.time;
        this.points = counters.points;
        this.supply = zones.get('supply') || [];
        this.hand = zones.get('hand') || [];
        this.deck = zones.get('deck') || [];
        this.discard = zones.get('discard') || [];
        this.play = zones.get('play') || [];
        this.aside = zones.get('aside') || [];
    }
    State.prototype.update = function (stateUpdate) {
        return new State(read(stateUpdate, 'counters', this.counters), read(stateUpdate, 'zones', this.zones), read(stateUpdate, 'resolving', this.resolving), read(stateUpdate, 'nextID', this.nextID), read(stateUpdate, 'history', this.history), read(stateUpdate, 'future', this.future), read(stateUpdate, 'checkpoint', this.checkpoint), read(stateUpdate, 'logs', this.logs), read(stateUpdate, 'logIndent', this.logIndent));
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
            loc = 'handSort';
        if (zone == 'resolving')
            return this.addResolving(card);
        var newZones = new Map(this.zones);
        newZones.set(zone, insertAt(this[zone], card, loc));
        return this.update({ zones: newZones });
    };
    State.prototype.remove = function (card) {
        var e_1, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], zone = _d[1];
                newZones.set(name_1, zone.filter(function (c) { return c.id != card.id; }));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this.update({ zones: newZones, resolving: this.resolving.filter(function (c) { return c.id != card.id; }) });
    };
    State.prototype.apply = function (f, card) {
        var e_2, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones.set(name_2, zone.map(function (c) { return (c.id == card.id) ? f(c) : c; }));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        function fOnCard(c) {
            if (c instanceof Shadow || c.id != card.id)
                return c;
            return f(c);
        }
        return this.update({ zones: newZones, resolving: this.resolving.map(fOnCard) });
    };
    State.prototype.replace = function (oldCard, newCard) {
        return this.apply(function (_) { return newCard; }, oldCard);
    };
    State.prototype.setCoin = function (n) {
        return this.update({ counters: { coin: n, time: this.time, points: this.points } });
    };
    State.prototype.addShadow = function (spec) {
        var _a;
        var state = this;
        var id;
        _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
        var shadow = new Shadow(id, spec);
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
                var _d = __read(_c.value, 2), name_3 = _d[0], zone_1 = _d[1];
                var matches_1 = zone_1.filter(function (c) { return c.id == card.id; });
                if (matches_1.length > 0)
                    return { found: true, card: matches_1[0], place: name_3 };
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var name = 'resolving', zone = this.resolving;
        var matches = zone.filter(function (c) { return c.id == card.id; });
        if (matches.length > 0)
            return { found: true, card: matches[0], place: name };
        return notFound;
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
    State.prototype.log = function (msg) {
        return this.update({ logs: this.logs.concat([indent(this.logIndent, msg)]) });
    };
    State.prototype.shiftFuture = function () {
        var _a;
        var result, future;
        _a = __read(shiftFirst(this.future), 2), result = _a[0], future = _a[1];
        return [this.update({ future: future, }), result];
    };
    State.prototype.popFuture = function () {
        var _a;
        var result, future;
        _a = __read(popLast(this.future), 2), result = _a[0], future = _a[1];
        return [this.update({ future: future, }), result];
    };
    // Invariant: starting from checkpoint and replaying the history gets you to the current state
    // To maintain this invariant, we need to record history every time there is a change
    State.prototype.setCheckpoint = function () {
        return this.update({ history: [], future: this.future, checkpoint: this });
    };
    State.prototype.indent = function () {
        return this.update({ logIndent: this.logIndent + 1 });
    };
    State.prototype.unindent = function () {
        return this.update({ logIndent: this.logIndent - 1 });
    };
    // backup() leads to the same place as this if you run mainLoop, but it has more future
    // this enables undoing by backing up until you have future, then just popping from the future
    State.prototype.backup = function () {
        var last = this.checkpoint;
        return (last == null) ? null : last.update({ future: this.history.concat(this.future) });
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
function indent(n, s) {
    var parts = [];
    for (var i = 0; i < n; i++) {
        parts.push('&nbsp;&nbsp;');
    }
    parts.push(s);
    return parts.join('');
}
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
var emptyState = new State({ coin: 0, time: 0, points: 0 }, new Map([['supply', []], ['hand', []], ['deck', []], ['discard', []], ['play', []], ['aside', []]]), [], 0, [], [], null, [], 0 // resolving, nextID, history, future, checkpoint, logs, logIndent
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
    return xs.slice(0, n).concat([x]).concat(xs.slice(n));
}
function insertAt(zone, card, loc) {
    switch (loc) {
        case 'start':
        case 'top':
            return [card].concat(zone);
        case 'bottom':
        case 'end':
            return zone.concat([card]);
        case 'handSort':
            for (var i = 0; i < zone.length; i++) {
                if (comesBefore(card, zone[i]))
                    return insertInto(card, zone, i);
            }
            return zone.concat([card]);
        default: return assertNever(loc);
    }
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, _a, _b, card, _c, _d, rawtrigger, trigger_1, e_4_1, e_5_1;
            var e_5, _e, e_4, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        initialState = state;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 12, 13, 14]);
                        _a = __values(state.supply.concat(state.play)), _b = _a.next();
                        _g.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        card = _b.value;
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 8, 9, 10]);
                        _c = (e_4 = void 0, __values(card.triggers())), _d = _c.next();
                        _g.label = 4;
                    case 4:
                        if (!!_d.done) return [3 /*break*/, 7];
                        rawtrigger = _d.value;
                        if (!(rawtrigger.kind == e.kind)) return [3 /*break*/, 6];
                        trigger_1 = rawtrigger;
                        if (!(trigger_1.handles(e, initialState) && trigger_1.handles(e, state))) return [3 /*break*/, 6];
                        state = state.log("Triggering " + card);
                        return [4 /*yield*/, withTracking(trigger_1.effect(e), { kind: 'trigger', trigger: trigger_1, card: card })(state)];
                    case 5:
                        state = _g.sent();
                        _g.label = 6;
                    case 6:
                        _d = _c.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_4_1 = _g.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_5_1 = _g.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/, state];
                }
            });
        });
    };
}
//TODO: this should maybe be async and return a new state?
//(e.g. the "put it into your hand" should maybe be replacement effects)
//x is an event that is about to happen
//each card in play or supply can change properties of x
function replace(x, state) {
    var e_6, _a;
    var replacers = state.supply.concat(state.play).map(function (x) { return x.replacers(); }).flat();
    try {
        for (var replacers_1 = __values(replacers), replacers_1_1 = replacers_1.next(); !replacers_1_1.done; replacers_1_1 = replacers_1.next()) {
            var rawreplacer = replacers_1_1.value;
            if (rawreplacer.kind == x.kind) {
                var replacer = rawreplacer;
                if (replacer.handles(x, state)) {
                    x = replacer.replace(x, state);
                }
            }
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_a = replacers_1.return)) _a.call(replacers_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return x;
}
var Shadow = /** @class */ (function () {
    function Shadow(id, spec, tick) {
        if (tick === void 0) { tick = 1; }
        this.id = id;
        this.spec = spec;
        this.tick = tick;
    }
    Shadow.prototype.tickUp = function () {
        return new Shadow(this.id, this.spec, this.tick + 1);
    };
    return Shadow;
}());
function startTracking(state, spec) {
    if (spec.kind != 'none')
        state = state.addShadow(spec);
    state = state.startTicker(spec.card).indent();
    return state;
}
function stopTracking(state, spec) {
    state = state.unindent().endTicker(spec.card);
    if (spec.kind != 'none')
        state = state.popResolving();
    return state;
}
function withTracking(f, spec) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        state = startTracking(state, spec);
                        return [4 /*yield*/, f(state)];
                    case 1:
                        state = _a.sent();
                        state = stopTracking(state, spec);
                        return [2 /*return*/, state];
                }
            });
        });
    };
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
                state = state.log("Created " + a(card.name) + " in " + zone);
                return [2 /*return*/, trigger({ kind: 'create', card: card, zone: zone })(state)];
            });
        });
    };
}
function move(card, toZone, loc, logged) {
    if (loc === void 0) { loc = 'end'; }
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result, card_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = state.find(card);
                        if (!result.found) return [3 /*break*/, 2];
                        card_1 = result.card;
                        state = state.remove(card_1);
                        if (toZone == null) {
                            if (!logged)
                                state = state.log("Trashed " + card_1.name + " from " + result.place);
                        }
                        else {
                            state = state.addToZone(card_1, toZone, loc);
                            if (!logged)
                                state = state.log("Moved " + card_1.name + " from " + result.place + " to " + toZone);
                        }
                        return [4 /*yield*/, trigger({ kind: 'move', fromZone: result.place, toZone: toZone, loc: loc, card: card_1 })(state)];
                    case 1:
                        state = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, state];
                }
            });
        });
    };
}
function showCards(cards) {
    return cards.map(function (card) { return card.name; }).join(', ');
}
function moveMany(cards, toZone, loc, logged) {
    if (loc === void 0) { loc = 'end'; }
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, doAll(cards.map(function (card) { return move(card, toZone, loc, true); }))(state)];
                    case 1:
                        state = _a.sent();
                        if (cards.length == 0 || logged) {
                            return [2 /*return*/, state];
                        }
                        else if (toZone == null) {
                            return [2 /*return*/, state.log("Trashed " + showCards(cards))];
                        }
                        else {
                            return [2 /*return*/, state.log("Moved " + showCards(cards) + " to " + toZone)];
                        }
                        return [2 /*return*/];
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
function trash(card, logged) {
    if (logged === void 0) { logged = false; }
    return (card == null) ? noop : move(card, null, 'end', logged);
}
function recycle(cards) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(randomChoices(state, cards, cards.length), 2), state = _a[0], cards = _a[1];
                        if (cards.length > 0) {
                            state = state.log("Recycled " + showCards(cards) + " to bottom of deck");
                        }
                        return [4 /*yield*/, moveMany(cards, 'deck', 'bottom', true)(state)];
                    case 1:
                        state = _b.sent();
                        return [4 /*yield*/, trigger({ kind: 'recycle', cards: cards })(state)];
                    case 2:
                        state = _b.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
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
                        drawParams = { kind: 'draw', draw: n, source: source, effects: [] };
                        drawParams = replace(drawParams, state);
                        return [4 /*yield*/, doAll(drawParams.effects)(state)];
                    case 1:
                        state = _b.sent();
                        n = drawParams.draw;
                        drawn = [];
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < n)) return [3 /*break*/, 5];
                        nextCard = void 0, rest = void 0;
                        _a = __read(shiftFirst(state.deck), 2), nextCard = _a[0], rest = _a[1];
                        if (!(nextCard != null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, move(nextCard, 'hand', 'handSort', true)(state)];
                    case 3:
                        state = _b.sent();
                        drawn.push(nextCard);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (drawn.length > 0) {
                            state = state.log("Drew " + showCards(drawn));
                        }
                        return [2 /*return*/, trigger({ kind: 'draw', drawn: drawn.length, cards: drawn, triedToDraw: n, source: source })(state)];
                }
            });
        });
    };
}
function discard(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var cards, _a;
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
                        _b = __read.apply(void 0, [_a, 2]), state = _b[0], cards = _b[1];
                        return [4 /*yield*/, moveMany(cards, 'discard')(state)];
                    case 4:
                        state = _c.sent();
                        return [2 /*return*/, trigger({ kind: 'discard', cards: cards })(state)];
                }
            });
        });
    };
}
// --------------- Transforms that change points, time, and coins
function logChange(state, noun, n, positive, negative) {
    if (n == 1) {
        return state.log(positive[0] + a(noun) + positive[1]);
    }
    else if (n > 1) {
        return state.log(positive[0] + (n + " ") + noun + 's' + positive[1]);
    }
    else if (n < 0) {
        return logChange(state, noun, -n, negative, positive);
    }
    return state;
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
function gainTime(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = state.setTime(state.time + n);
                if (n != 0)
                    state = state.log("Gained " + renderTime(n));
                return [2 /*return*/, trigger({ kind: 'gainTime', amount: n })(state)];
            });
        });
    };
}
function gainPoints(n, source) {
    if (source === void 0) { source = { name: '?' }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { kind: 'gainPoints', points: n, effects: [], source: source };
                        params = replace(params, state);
                        return [4 /*yield*/, doAll(params.effects)(state)];
                    case 1:
                        state = _a.sent();
                        n = params.points;
                        state = state.setPoints(state.points + n);
                        if (n != 0)
                            state = state.log(n > 0 ? "Gained " + n + " vp" : "Lost " + -n + " vp");
                        if (state.points >= 50)
                            throw new Victory(state);
                        return [2 /*return*/, trigger({ kind: 'gainPoints', amount: n, source: source })(state)];
                }
            });
        });
    };
}
function gainCoin(n, cost) {
    if (cost === void 0) { cost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (state.coin + n < 0) {
                    if (cost)
                        throw new CostNotPaid("Not enough coin");
                    n = -state.coin;
                }
                state = state.setCoin(state.coin + n);
                if (n != 0)
                    state = state.log(n > 0 ? "Gained $" + n : "Lost $" + -n);
                return [2 /*return*/, trigger({ kind: 'gainCoin', amount: n, cost: cost })(state)];
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
            var result, oldCharge, newCharge;
            return __generator(this, function (_a) {
                result = state.find(card);
                if (!result.found) {
                    if (cost)
                        throw new CostNotPaid("card no longer exists");
                    return [2 /*return*/, state];
                }
                card = result.card;
                if (card.charge + n < 0 && cost)
                    throw new CostNotPaid("not enough charge");
                oldCharge = card.charge;
                newCharge = Math.max(oldCharge + n, 0);
                state = state.apply(function (card) { return card.update({ charge: newCharge }); }, card);
                state = logChange(state, 'charge token', newCharge - oldCharge, ['Added ', " to " + card.name], ['Removed ', " from " + card.name]);
                return [2 /*return*/, trigger({ kind: 'gainCharge', card: card,
                        oldCharge: oldCharge, newCharge: newCharge, cost: cost })(state)];
            });
        });
    };
}
function logTokenChange(state, card, token, n) {
    return logChange(state, token + " token", n, ['Added ', " to " + card.name], ['Removed ', " from " + card.name]);
}
function addToken(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var newCard;
            return __generator(this, function (_a) {
                newCard = card.update({ tokens: card.tokens.concat([token]) });
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, 1);
                return [2 /*return*/, trigger({ kind: 'addToken', card: newCard, token: token })(state)];
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
            var removed, newCard;
            return __generator(this, function (_a) {
                removed = countTokens(card, token);
                newCard = card.update({ tokens: card.tokens.filter(function (x) { return (x != token); }) });
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, -removed);
                return [2 /*return*/, trigger({ kind: 'removeTokens', card: newCard, token: token, removed: removed })(state)];
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
            var removed, newCard;
            return __generator(this, function (_a) {
                removed = 0;
                newCard = card.update({ tokens: removeOneToken(card.tokens) });
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, -removed);
                return [2 /*return*/, trigger({ kind: 'removeTokens', card: newCard, token: token, removed: removed })(state)];
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
    if (xs.length == 0)
        return [state, null];
    _a = __read(randomChoices(state, xs, 1, seed), 2), state = _a[0], xs = _a[1];
    return [state, xs[0]];
}
function randomChoices(state, xs, n, seed) {
    var _a;
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
        return '';
    else if (coinHtml == '')
        return timeHtml;
    else
        return [coinHtml, timeHtml].join(' ');
}
function renderTime(n) {
    var result = [];
    if (n < 0)
        return '-' + renderTime(-n);
    for (var i = 0; i < n; i++) {
        result.push('@');
    }
    return result.join('');
}
function describeCost(cost) {
    var coinCost = (cost.coin > 0) ? ["lose $" + cost.coin] : [];
    var timeCost = (cost.time > 0) ? ["gain " + renderTime(cost.time)] : [];
    var costs = coinCost.concat(timeCost);
    var costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing';
    return "Cost: " + costStr + ".";
}
function renderShadow(shadow, state) {
    var card = shadow.spec.card;
    var tokenhtml = card.tokens.length > 0 ? '*' : '';
    var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
    var costhtml = renderCost(card.cost(state)) || '&nbsp';
    var ticktext = "tick=" + shadow.tick;
    var shadowtext = "shadow='true'";
    var tooltip;
    switch (shadow.spec.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.spec.ability);
            break;
        case 'trigger':
            tooltip = renderStatic(shadow.spec.trigger);
            break;
        case 'effect':
            tooltip = card.effect().description;
            break;
        case 'abilities':
            tooltip = card.abilities().map(renderAbility).join('');
            break;
        case 'cost':
            tooltip = describeCost(card.cost(state));
            break;
        default: assertNever(shadow.spec);
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
    else {
        var tokenhtml = card.tokens.length > 0 ? '*' : '';
        var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
        var costhtml = renderCost(card.cost(state)) || '&nbsp';
        var choosetext = asOption == null ? '' : "choosable chosen='false' option=" + asOption;
        var ticktext = "tick=" + card.ticks[card.ticks.length - 1];
        return ["<div class='card' " + ticktext + " " + choosetext + ">",
            "<div class='cardbody'>" + card + tokenhtml + chargehtml + "</div>",
            "<div class='cardcost'>" + costhtml + "</div>",
            "<span class='tooltip'>" + renderTooltip(card, state) + "</span>",
            "</div>"].join('');
    }
}
function renderStatic(x) {
    return "<div>(static) " + x.description + "</div>";
}
function renderAbility(x) {
    return "<div>(ability) " + x.description + "</div>";
}
function renderTokens(tokens) {
    var e_7, _a, e_8, _b;
    var counter = new Map();
    try {
        for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
            var token = tokens_1_1.value;
            counter.set(token, (counter.get(token) || 0) + 1);
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
        }
        finally { if (e_7) throw e_7.error; }
    }
    var parts = [];
    try {
        for (var counter_1 = __values(counter), counter_1_1 = counter_1.next(); !counter_1_1.done; counter_1_1 = counter_1.next()) {
            var _c = __read(counter_1_1.value, 2), token = _c[0], count = _c[1];
            parts.push((count == 1) ? token : token + "(" + count + ")");
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (counter_1_1 && !counter_1_1.done && (_b = counter_1.return)) _b.call(counter_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return parts.join(', ');
}
function renderTooltip(card, state) {
    var effectHtml = "<div>" + card.effect().description + "</div>";
    var abilitiesHtml = card.abilities().map(function (x) { return renderAbility(x); }).join('');
    var triggerHtml = card.triggers().map(function (x) { return renderStatic(x); }).join('');
    var replacerHtml = card.replacers().map(function (x) { return renderStatic(x); }).join('');
    var staticHtml = triggerHtml + replacerHtml;
    var tokensHtml = card.tokens.length > 0 ? "Tokens: " + renderTokens(card.tokens) : '';
    var baseFilling = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('');
    function renderRelated(spec) {
        var card = new Card(spec, -1);
        var costStr = renderCost(card.cost(emptyState));
        var header = (costStr.length > 0) ?
            "<div>---" + card.toString() + " (" + costStr + ")---</div>" :
            "<div>-----" + card.toString() + "----</div>";
        return header + renderTooltip(card, state);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "" + baseFilling + relatedFilling;
}
function render_log(msg) {
    return "<div class=\".log\">" + msg + "</div>";
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
    $('#log').html(state.logs.slice().reverse().map(render_log).join(''));
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
function multichoiceIfNeeded(state, prompt, options, n, upto) {
    return __awaiter(this, void 0, void 0, function () {
        var x;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(n == 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, [state, []]];
                case 1:
                    if (!(n == 1)) return [3 /*break*/, 3];
                    x = void 0;
                    return [4 /*yield*/, choice(state, prompt, upto ? allowNull(options) : options)];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], x = _a[1];
                    return [2 /*return*/, (x == null) ? [state, []] : [state, [x]]];
                case 3: return [2 /*return*/, multichoice(state, prompt, options, function (xs) { return (upto ? xs.length <= n : xs.length == n); })];
            }
        });
    });
}
var yesOrNo = [
    { kind: 'string', render: 'Yes', value: true },
    { kind: 'string', render: 'No', value: false }
];
function range(n) {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(i);
    return result;
}
function chooseNatural(n) {
    return range(n).map(function (x) { return ({ kind: 'string', render: String(x), value: x }); });
}
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
    return "<span class='option' option='" + option[0] + "' choosable chosen='false'>" + option[1] + "</span>";
}
function renderUndo(undoable) {
    return "<span class='option', option='undo' " + (undoable ? 'choosable' : '') + " chosen='false'>Undo</span>";
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
        var e_9, _a;
        var result = [];
        try {
            for (var chosen_1 = __values(chosen), chosen_1_1 = chosen_1.next(); !chosen_1_1.done; chosen_1_1 = chosen_1.next()) {
                var i = chosen_1_1.value;
                result.push(options[i].value);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (chosen_1_1 && !chosen_1_1.done && (_a = chosen_1.return)) _a.call(chosen_1);
            }
            finally { if (e_9) throw e_9.error; }
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
                setReady();
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
        var card, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], card = _a[1];
                    if (card == null)
                        throw new Error('No valid options.');
                    result = state.find(card);
                    switch (result.place) {
                        case 'play':
                            return [2 /*return*/, useCard(card)(state)];
                        case 'hand':
                            return [2 /*return*/, tryToPlay(card)(state)];
                        case 'supply':
                            return [2 /*return*/, tryToBuy(card)(state)];
                        case 'aside':
                        case 'discard':
                        case 'deck':
                        case 'resolving':
                        case null:
                            throw new Error("Card can't be in zone " + result.place);
                        default: assertNever(result);
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
                        state = startTracking(state, { kind: 'abilities', card: card });
                        ability = null;
                        if (!(card.abilities().length == 1)) return [3 /*break*/, 1];
                        ability = card.abilities()[0];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, choice(state, "Choose an ability to use:", allowNull(card.abilities().map(function (x) { return ({ kind: 'string', render: x.description, value: x }); })))];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], ability = _a[1];
                        _b.label = 3;
                    case 3:
                        state = stopTracking(state, { kind: 'abilities', card: card });
                        if (!(ability != null)) return [3 /*break*/, 5];
                        state = state.log("Activating " + card.name);
                        return [4 /*yield*/, withTracking(payToDo(ability.cost, ability.effect), { card: card, kind: 'ability', ability: ability })(state)];
                    case 4:
                        state = _b.sent();
                        _b.label = 5;
                    case 5: return [2 /*return*/, state];
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
function undo(startState) {
    var _a;
    var state = startState;
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
function supplyKey(spec) {
    return new Card(spec, -1).cost(emptyState).coin;
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2);
}
function playGame(seed) {
    return __awaiter(this, void 0, void 0, function () {
        var startingDeck, state, shuffledDeck, variableSupplies, i, kingdom, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    startingDeck = [copper, copper, copper, copper, copper,
                        copper, copper, estate, estate, estate];
                    state = emptyState;
                    _a = __read(randomChoices(state, startingDeck, startingDeck.length, seed), 2), state = _a[0], shuffledDeck = _a[1];
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
                    return [4 /*yield*/, trigger({ kind: 'gameStart' })(state)];
                case 3:
                    state = _c.sent();
                    state = state.log("Setup done, game starting");
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 8, , 9]);
                    _c.label = 5;
                case 5:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, mainLoop(state)];
                case 6:
                    state = _c.sent();
                    return [3 /*break*/, 5];
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_3 = _c.sent();
                    if (error_3 instanceof Victory) {
                        renderState(error_3.state);
                        $('#choicePrompt').html("You won using " + error_3.state.time + " time!");
                    }
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function getSeed() {
    var seed = new URLSearchParams(window.location.search).get('seed');
    var n = Number(seed);
    return (isNaN(n)) ? undefined : n;
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
        description: "Create " + a(card.name) + " in your discard pile.",
        effect: create(card)
    };
}
function supplyForCard(card, cost, triggers) {
    if (triggers === void 0) { triggers = []; }
    return { name: card.name,
        fixedCost: cost,
        effect: function (supply) { return gainCard(card); },
        relatedCards: [card],
        triggers: function (card) { return triggers; },
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
function buyableAnd(card, n, triggers, test) {
    if (test === void 0) { test = null; }
    register(supplyForCard(card, coin(n), triggers), test);
}
function time(n) {
    return { time: n, coin: 0 };
}
function coin(n) {
    return { time: 0, coin: n };
}
//renders either "a" or "an" as appropriate
function a(s) {
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
            description: "Create " + a(card.name) + " in play." + (selfdestruct ? ' Trash this.' : ''),
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
                            return [4 /*yield*/, draw(5, reboot)(state)];
                        case 3:
                            state = _a.sent();
                            return [2 /*return*/, state];
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
                var target, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play twice.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _b.sent();
                            state = tick(card)(state);
                            result = state.find(target);
                            if (!(result.place == 'discard')) return [3 /*break*/, 4];
                            return [4 /*yield*/, result.card.play(card)(state)];
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
var teacher = { name: 'Teacher',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Put up to three cards from your deck into your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toDraw;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoiceIfNeeded(state, 'Choose up to three cards to put in your hand.', state.deck.map(asChoice), 3, true)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], toDraw = _a[1];
                            return [2 /*return*/, moveMany(toDraw, 'hand')(state)];
                    }
                });
            });
        }
    }); }
};
buyable(teacher, 4);
var philanthropy = { name: 'Philanthropy',
    fixedCost: { coin: 10, time: 2 },
    effect: function (card) { return ({
        description: 'Lose all $, then +1 vp per coin lost.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            n = state.coin;
                            return [4 /*yield*/, gainCoin(-n)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, gainPoints(n)(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
register(philanthropy);
var relearn = { name: 'Relearn',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Recycle your hand and discard pile, lose all $, and +1 card per coin lost.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            n = state.coin;
                            return [4 /*yield*/, setCoin(0)(state)];
                        case 1:
                            state = _a.sent();
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
register(relearn);
var crafts = { name: 'Crafts',
    triggers: function (card) { return [{
            description: "After playing " + a(estate.name) + ", +$1.",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.name == estate.name); },
            effect: function (e) { return gainCoin(1); },
        }]; }
};
register(makeCard(crafts, time(2), true));
var homestead = { name: 'Homesteading',
    triggers: function (card) { return [{
            description: "After playing " + a(estate.name) + ", +1 card",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.name == estate.name); },
            effect: function (e) { return draw(1); }
        }]; }
};
register(makeCard(homestead, time(2), true));
var monument = { name: 'Monument',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+$2, +1 vp.',
        effect: doAll([gainCoin(2), gainPoints(1)])
    }); }
};
buyable(monument, 2);
var expansion = { name: 'Expansion',
    effect: function (card) { return ({
        description: '+1vp, +1 card.',
        effect: doAll([gainPoints(1), draw(1)])
    }); }
};
buyable(expansion, 8);
var tower = { name: 'Tower',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Add a charge token to this, then +1 vp per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            result = state.find(card);
                            if (!result.found) return [3 /*break*/, 3];
                            return [4 /*yield*/, gainPoints(result.card.charge)(state)];
                        case 2:
                            state = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(tower, 8);
var tradeRoute = { name: 'Trade Route',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Add a charge token to this, then +1 vp per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            result = state.find(card);
                            if (!result.found) return [3 /*break*/, 3];
                            return [4 /*yield*/, gainCoin(result.card.charge)(state)];
                        case 2:
                            state = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(tradeRoute, 3);
var populate = { name: 'Populate',
    fixedCost: { coin: 10, time: 3 },
    effect: function (card) { return ({
        description: 'Buy any number of cards in the supply other than this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, _loop_3, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = state.supply.filter(function (c) { return c.id != card.id; });
                            _loop_3 = function () {
                                var picked, id_1;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            picked = void 0;
                                            return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.map(asChoice)))];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                            if (!(picked == null)) return [3 /*break*/, 2];
                                            return [2 /*return*/, { value: state }];
                                        case 2:
                                            id_1 = picked.id;
                                            options = options.filter(function (c) { return c.id != id_1; });
                                            return [4 /*yield*/, picked.buy(card)(state)];
                                        case 3:
                                            state = _b.sent();
                                            _b.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 1;
                        case 1:
                            if (!true) return [3 /*break*/, 3];
                            return [5 /*yield**/, _loop_3()];
                        case 2:
                            state_1 = _a.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        }
    }); }
};
register(populate);
var populism = { name: 'Populism',
    triggers: function (card) { return [{
            description: "After playing " + a(estate.name) + ", play cards from your hand with total cost up to @.",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.name == estate.name); },
            effect: function (e) { return freeActions(1, card); },
        }]; }
};
//register(makeCard(populism, time(2), true))
var youngSmith = { name: 'Young Smith',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Put this in play with 4 charge tokens on it.',
        effect: charge(card, 4),
        toZone: 'play'
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you gain time, you may remove up to that many charge tokens from this.' +
                ' Draw a card per token removed, then if there are no charge tokens left discard this.',
            kind: 'gainTime',
            handles: function (e) { return e.amount > 0; },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, options, m, n, after;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                result = state.find(card);
                                if (!result.found) return [3 /*break*/, 5];
                                options = chooseNatural(Math.min(e.amount, result.card.charge) + 1);
                                m = void 0;
                                return [4 /*yield*/, choice(state, 'How many charge counters do you want to remove?', options)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], m = _a[1];
                                n = m;
                                return [4 /*yield*/, charge(card, -n)(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, draw(n)(state)];
                            case 3:
                                state = _b.sent();
                                after = state.find(card);
                                if (!(after.found && after.card.charge == 0)) return [3 /*break*/, 5];
                                return [4 /*yield*/, move(card, 'discard')(state)];
                            case 4:
                                state = _b.sent();
                                _b.label = 5;
                            case 5: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]; }
};
buyable(youngSmith, 3);
var duplicate = { name: 'Duplicate',
    fixedCost: { coin: 5, time: 1 },
    effect: function (card) { return ({
        description: "Put a duplicate token on each card in the supply other than this.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.supply.filter(function (c) { return c.id != card.id; }).map(function (c) { return addToken(c, 'duplicate'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: "After buying a card with a duplicate token on it, remove all duplicate tokens from it and buy it again.",
            kind: 'afterBuy',
            handles: function (e) { return (e.after != null && countTokens(e.after, 'duplicate') > 0); },
            effect: function (e) { return (e.after != null) ? doAll([removeTokens(e.after, 'duplicate'), e.after.buy(card)]) : noop; },
        }]; }
};
register(duplicate);
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
buyable(cellar, 1);
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
function freeActions(totalTime, card, constraint) {
    if (constraint === void 0) { constraint = function (c) { return true; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var remainingTime, options, target, timeCost, i;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        remainingTime = totalTime;
                        _b.label = 1;
                    case 1:
                        if (!(remainingTime > 0)) return [3 /*break*/, 4];
                        options = state.hand.filter(function (card) { return (card.cost(state).time <= remainingTime)
                            && constraint(card, state); });
                        target = void 0;
                        return [4 /*yield*/, choice(state, "Choose a card costing up to " + renderTime(remainingTime) + " to play", allowNull(options.map(asChoice)))];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        if (target == null)
                            return [3 /*break*/, 4];
                        timeCost = target.cost(state).time;
                        return [4 /*yield*/, target.play()(state)];
                    case 3:
                        state = _b.sent();
                        remainingTime -= timeCost;
                        for (i = 0; i < timeCost; i++)
                            state = tick(card)(state);
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, state];
                }
            });
        });
    };
}
function villagestr(n) {
    return "Play cards from your hand with total cost at most " + renderTime(n) + ".";
}
var coven = { name: 'Coven',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: villagestr(2) + ' None of them may have the same name as a card in yor discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                function constraint(cardInHand, s) {
                    return s.discard.every(function (cardInDiscard) { return cardInDiscard.name != cardInHand.name; });
                }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _a.sent();
                            return [2 /*return*/, freeActions(2, card, constraint)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(coven, 4);
var canal = { name: 'Canal',
    replacers: function (card) { return [{
            description: 'Cards in the supply cost $1 less, unless it would make them cost 0.',
            kind: 'cost',
            handles: function () { return true; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reduceCoinNonzero(p.cost, 1) })); }
        }]; }
};
register(makeCard(canal, { coin: 7, time: 1 }));
var village = { name: 'Village',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. " + villagestr(2),
        effect: doAll([draw(1), freeActions(2, card)]),
    }); }
};
buyable(village, 3);
var bazaar = { name: 'Bazaar',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. +$1. " + villagestr(2),
        effect: doAll([draw(1), gainCoin(1), freeActions(2, card)])
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
                            return [2 /*return*/, (target == null) ? state : target.buy(card)(state)];
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
            nextTime('Shipping Lane', 'When you finish buying a card, discard this and buy it again if it still exists.', 'afterBuy', function (e) { return true; }, function (e) { return (e.after == null) ? noop : e.after.buy(card); })
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
                            return [2 /*return*/, (target == null) ? state : target.buy(card)(state)];
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
};
buyable(feast, 4);
var mobilization = { name: 'Mobilization',
    replacers: function (card) { return [{
            description: 'Reboot costs @ less to play, but not zero.',
            kind: 'cost',
            handles: function (x) { return (x.card.name == 'Reboot'); },
            replace: function (x) { return (__assign(__assign({}, x), { cost: reduceTimeNonzero(x.cost, 1) })); }
        }]; }
};
var gainMobilization = { name: 'Mobilization',
    calculatedCost: function (card, state) { return ({ time: 0, coin: 15 + 10 * card.charge }); },
    effect: function (card) { return ({
        description: "Create a " + mobilization.name + " in play." +
            ' Put a charge token on this. It costs $10 more per charge token on it.',
        effect: doAll([create(mobilization, 'play'), charge(card, 1)])
    }); },
    relatedCards: [mobilization],
};
register(gainMobilization);
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
    fixedCost: time(2),
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
                            return [2 /*return*/, draw(3)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(plough, 4);
var vassal = { name: 'Vassal',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+$2. Play the top card of your deck.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _a.sent();
                            if (state.deck.length == 0)
                                return [2 /*return*/, state];
                            return [2 /*return*/, state.deck[0].play(card)(state)];
                    }
                });
            });
        }
    }); }
};
buyable(vassal, 3);
var twin = { name: 'Twin',
    fixedCost: { time: 1, coin: 8 },
    effect: function (card) { return ({
        description: 'Put a twin token on a card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to put a twin token on.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, addToken(target, 'twin')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: "After playing a card with a twin token other than with this, if it's in your discard pile play it again.",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.tokens.includes('twin') && e.source.id != card.id); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        result = state.find(e.before);
                        console.log(card);
                        console.log(e.source);
                        return [2 /*return*/, (result.place == 'discard') ? result.card.play(card)(state) : state];
                    });
                });
            }; }
        }]; },
};
register(twin);
var blacksmith = { name: 'Blacksmith',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: 'Add a charge token to this, then +1 card per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            result = state.find(card);
                            if (!result.found) return [3 /*break*/, 3];
                            return [4 /*yield*/, draw(result.card.charge)(state)];
                        case 2:
                            state = _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(blacksmith, 2);
function nextTime(name, description, kind, when, what) {
    function triggers(card) {
        return [{
                description: description,
                kind: kind,
                handles: function (e, state) { return (when(e, state) && state.find(card).place == 'play'); },
                effect: function (e) { return doAll([trash(card), what(e)]); },
            }];
    }
    var spec = { name: name, triggers: triggers };
    return create(spec, 'play');
}
var expedite = { name: 'Expedite',
    calculatedCost: function (card, state) { return ({ time: 1, coin: card.charge }); },
    effect: function (card) { return ({
        description: "The next time you create a card, if it's in your discard pile put it into your hand." +
            ' Put a charge token on this. It costs $1 more per charge token on it.',
        effect: doAll([
            nextTime('Expedite', "When you create a card, if it's in your discard pile" +
                " then trash this and put it into your hand.", 'create', function (e, state) { return (state.find(e.card).place == 'discard'); }, function (e) { return move(e.card, 'hand'); }),
            charge(card, 1),
        ])
    }); }
};
register(expedite);
var goldMine = { name: 'Gold Mine',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: 'Create a gold in your hand and a gold on top of your deck.',
        effect: doAll([create(gold, 'deck', 'top'), create(gold, 'hand')]),
    }); }
};
buyable(goldMine, 6);
var warehouse = { name: 'Warehouse',
    effect: function (card) { return ({
        description: 'Draw 3 cards, then discard 3 cards.',
        effect: doAll([draw(3), discard(3)]),
    }); }
};
buyable(warehouse, 3);
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
            kind: 'move',
            handles: function (e) { return (e.card.name == card.name && e.toZone == 'hand'); },
            effect: function (e) { return gainTime(e.card.charge); }
        }]; }
};
mixins.push(gainCursedKingdom);
var junkyard = { name: 'Junkyard',
    fixedCost: time(0),
    triggers: function (card) { return [{
            description: 'Whenever you trash a card, +1 vp.',
            kind: 'move',
            handles: function (e) { return (e.toZone == null); },
            effect: function (e) { return gainPoints(1); }
        }]; }
};
//mixins.push(makeCard(junkyard, {coin:5, time:2}))
function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.time <= cost2.time;
}
var synergy = { name: 'Synergy',
    triggers: function (card) { return [{
            description: 'Whenever you buy a card with a synergy token other than with this,'
                + ' afterwards buy a different card with a synergy token with equal or lesser cost.',
            kind: 'afterBuy',
            handles: function (e) { return (e.source.id != card.id && countTokens(e.before, 'synergy') > 0); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                options = state.supply.filter(function (c) { return countTokens(c, 'synergy') > 0
                                    && leq(c.cost(state), e.before.cost(state))
                                    && c.id != e.before.id; });
                                return [4 /*yield*/, choice(state, 'Choose a card to buy.', options.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (target == null) {
                                    return [2 /*return*/, state];
                                }
                                else {
                                    return [2 /*return*/, target.buy(card)(state)];
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]; }
};
var makeSynergy = { name: 'Synergy',
    relatedCards: [synergy],
    fixedCost: { coin: 5, time: 1 },
    effect: function (card) { return ({
        description: 'Put a synergy token on two cards in the supply,' +
            (" create a " + synergy.name + " in play, and trash this."),
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cards, cards_1, cards_1_1, card_2, e_10_1;
                var _a, e_10, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, multichoiceIfNeeded(state, 'Choose two cards to synergize.', state.supply.map(asChoice), 2, false)];
                        case 1:
                            _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 7, 8, 9]);
                            cards_1 = __values(cards), cards_1_1 = cards_1.next();
                            _c.label = 3;
                        case 3:
                            if (!!cards_1_1.done) return [3 /*break*/, 6];
                            card_2 = cards_1_1.value;
                            return [4 /*yield*/, addToken(card_2, 'synergy')(state)];
                        case 4:
                            state = _c.sent();
                            _c.label = 5;
                        case 5:
                            cards_1_1 = cards_1.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_10_1 = _c.sent();
                            e_10 = { error: e_10_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                            }
                            finally { if (e_10) throw e_10.error; }
                            return [7 /*endfinally*/];
                        case 9: return [4 /*yield*/, create(synergy, 'play')(state)];
                        case 10:
                            state = _c.sent();
                            return [4 /*yield*/, trash(card)(state)];
                        case 11:
                            state = _c.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
register(makeSynergy);
var bustlingSquare = { name: 'Bustling Square',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 card. Set aside all cards in your hand. Play them in any order.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var hand, _loop_4, state_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _a.sent();
                            hand = state.hand;
                            return [4 /*yield*/, moveWholeZone('hand', 'aside')(state)];
                        case 2:
                            state = _a.sent();
                            _loop_4 = function () {
                                var target, id_2;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            target = void 0;
                                            return [4 /*yield*/, choice(state, 'Choose which card to play next.', hand.map(asChoice))];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                            if (!(target == null)) return [3 /*break*/, 2];
                                            return [2 /*return*/, { value: state }];
                                        case 2: return [4 /*yield*/, target.play(card)(state)];
                                        case 3:
                                            state = _b.sent();
                                            id_2 = target.id;
                                            hand = hand.filter(function (c) { return c.id != id_2; });
                                            _b.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 3;
                        case 3:
                            if (!true) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_4()];
                        case 4:
                            state_2 = _a.sent();
                            if (typeof state_2 === "object")
                                return [2 /*return*/, state_2.value];
                            return [3 /*break*/, 3];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    }); }
};
buyable(bustlingSquare, 6);
function ensureInSupply(spec) {
    return {
        description: "At the beginning of the game, add " + spec.name + " to the supply" +
            " if it isn't already there.",
        kind: 'gameStart',
        handles: function () { return true; },
        effect: function (e) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!state.supply.every(function (c) { return c.name != spec.name; })) return [3 /*break*/, 2];
                            return [4 /*yield*/, create(spec, 'supply')(state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, state];
                    }
                });
            });
        }; }
    };
}
var colony = { name: 'Colony',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+5vp',
        effect: gainPoints(5),
    }); }
};
var buyColony = { name: 'Colony',
    fixedCost: coin(14),
    effect: function (card) { return gainCard(colony); },
    triggers: function (card) { return [ensureInSupply(buyPlatinum)]; },
};
register(buyColony);
var platinum = { name: "Platinum",
    fixedCost: time(0),
    effect: function (card) { return ({
        description: '+$5',
        effect: gainCoin(5)
    }); }
};
var buyPlatinum = { name: 'Platinum',
    fixedCost: coin(10),
    effect: function (card) { return gainCard(colony); },
    triggers: function (card) { return [ensureInSupply(buyColony)]; },
};
register(buyPlatinum);
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
        description: "Put a charge token on a " + stables.name + " in play.",
        effect: fill(stables, 1),
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
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
                        var pick, id;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, choice(state, "Pick a card to " + descriptor + ".", picks.map(asChoice))];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], pick = _a[1];
                                    if (pick == null)
                                        return [2 /*return*/, state]; // shouldn't be possible
                                    id = pick.id;
                                    picks = picks.filter(function (card) { return card.id != id; });
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
            description: "Whenever you create a card," +
                " if it's in your discard pile then move it to the top of your deck.",
            kind: 'create',
            handles: function (e, state) { return (state.find(e.card).place == 'discard'); },
            effect: function (e) { return move(e.card, 'deck', 'top'); }
        }]; }
};
register(makeCard(roadNetwork, coin(5), true));
var formation = { name: 'Formation',
    fixedCost: time(0),
    triggers: function (card) { return [{
            description: "When you finish playing a card other than with " + formation.name + ", if it costs @ or more then you may play a card in your hand with the same name.",
            kind: 'afterPlay',
            handles: function (e) { return (e.source.name != formation.name); },
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
register(makeCard(formation, { time: 0, coin: 6 }));
var forge = { name: 'Forge',
    fixedCost: time(2),
    effect: function (card) { return ({
        description: '+6 cards',
        effect: draw(6),
    }); }
};
buyable(forge, 5);
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
var regroup = { name: 'Regroup',
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
mixins.push(regroup);
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
var innovation = { name: "Innovation",
    triggers: function (card) { return [{
            description: "Whenever you create a card, if it's in your discard pile and this has an innovate token on it:" +
                " remove an innovate token from this, discard your hand, lose all $, and play the card.",
            kind: 'create',
            handles: function (e, state) { return (countTokens(card, 'innovate') > 0 && state.find(e.card).place == 'discard'); },
            effect: function (e) { return doAll([
                removeOneToken(card, 'innovate'),
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
            kind: 'afterPlay',
            handles: function (e, state) { return (e.source.name == 'act' && state.discard.length == 1); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(e.after != null && state.find(e.after).place == 'discard')) return [3 /*break*/, 2];
                                return [4 /*yield*/, e.after.play(card)(state)];
                            case 1:
                                state = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
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
            kind: 'draw',
            handles: function (x) { return x.source.name == reboot.name; },
            replace: function (x) { return (__assign(__assign({}, x), { draw: x.draw + 1 })); }
        }]; }
};
register(makeCard(hireling, { coin: 6, time: 1 }));
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
    var e_11, _a;
    var y = new Set();
    var result = 0;
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            if (!y.has(x)) {
                result += 1;
                y.add(x);
            }
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_11) throw e_11.error; }
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
        effect: moveWholeZone('discard', 'hand'),
        toZone: null,
    }); }
};
var gainFortify = { name: 'Fortify',
    fixedCost: coin(5),
    effect: function (card) { return ({
        description: "Create " + a(fortify.name) + " in your discard pile. Discard your hand.",
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }); },
    relatedCards: [fortify],
};
mixins.push(gainFortify);
var explorer = { name: "Explorer",
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Create " + a(silver.name) + " in your hand." +
            (" If you have " + a(province.name) + " in your hand, instead create " + a(gold.name) + " in your hand."),
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
                var target, targetNullable, i, result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play three times.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targetNullable = _a[1];
                            if (targetNullable == null)
                                return [2 /*return*/, state];
                            else
                                target = targetNullable;
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _b.sent();
                            i = 0;
                            _b.label = 3;
                        case 3:
                            if (!(i < 2)) return [3 /*break*/, 6];
                            state = tick(card)(state);
                            result = state.find(target);
                            if (result.place != 'discard')
                                return [3 /*break*/, 6];
                            else
                                target = result.card;
                            return [4 /*yield*/, target.play(card)(state)];
                        case 4:
                            state = _b.sent();
                            _b.label = 5;
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
                            if (target == null)
                                return [2 /*return*/, state];
                            return [2 /*return*/, addToken(target, 'path')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you play a card, draw a card per path token on it.',
            kind: 'play',
            handles: function (e) { return e.card.tokens.includes('path'); },
            effect: function (e) { return draw(countTokens(e.card, 'path')); }
        }]; },
};
register(pathfinding);
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
                            if (target == null)
                                return [2 /*return*/, state];
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
    fixedCost: coin(2),
    effect: function (card) { return ({
        description: 'Remove a decay token from each card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.hand.map(function (x) { return removeOneToken(x, 'decay'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            description: 'Whenever you recycle a card, put a decay token on it.',
            kind: 'recycle',
            handles: function () { return true; },
            effect: function (e) { return doAll(e.cards.map(function (c) { return addToken(c, 'decay'); })); }
        }, {
            description: 'After you play a card, if it has 3 or more decay tokens on it trash it.',
            kind: 'afterPlay',
            handles: function (e) { return (e.after != null && countTokens(e.after, 'decay') >= 3); },
            effect: function (e) { return trash(e.after); },
        }]; }
};
register(decay);
var perpetualMotion = { name: 'Perpetual Motion',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "If you have no cards in hand, +2 cards.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(state.hand.length == 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, draw(2, card)(state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
register(perpetualMotion);
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
function createIfNeeded(spec) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (state.play.some(function (x) { return x.name == spec.name; }))
                    return [2 /*return*/, state];
                return [2 /*return*/, create(spec, 'play')(state)];
            });
        });
    };
}
function ensureInPlay(spec) {
    return {
        description: "At the start of the game, create " + a(spec.name) + " in play if there isn't one.",
        kind: 'gameStart',
        handles: function () { return true; },
        effect: function (e) { return createIfNeeded(spec); }
    };
}
function fill(spec, n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, choice(state, "Place two " + n + " tokens on a " + spec.name + " in play.", state.play.filter(function (c) { return c.name == spec.name; }).map(asChoice))];
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
        description: "Put two charge tokens on a " + coffers.name + " in play.",
        effect: fill(coffers, 2)
    }); },
    triggers: function (card) { return [ensureInPlay(coffers)]; }
};
register(fillCoffers);
var cotr = { name: 'Coin of the Realm',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: '+$1. Put this in play.',
        toZone: 'play',
        effect: doAll([gainCoin(1), move(card, 'play')])
    }); },
    abilities: function (card) { return [{
            description: villagestr(2) + " Discard this.",
            cost: noop,
            effect: doAll([freeActions(2, card), move(card, 'discard')]),
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
                            return [2 /*return*/, freeActions(1, card)(state)];
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
        description: "Put two charge tokens on a " + stables.name + " in play.",
        effect: fill(stables, 2),
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
};
//register(fillStables)
var treasury = { name: 'Treasury',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Put three charge tokens on a " + coffers.name + " in play.",
        effect: fill(coffers, 3),
    }); }
};
buyableAnd(treasury, 4, [ensureInPlay(coffers)]);
var duchess = { name: 'Duchess',
    calculatedCost: function (card, state) { return time(state.hand.some(function (c) { return c.name == duchy.name; }) ? 0 : 1); },
    effect: function (card) { return ({
        description: "Draw two cards. This costs @ less to play if you have a " + duchy.name + " in your hand.",
        effect: draw(2)
    }); }
};
buyable(duchess, 3);
var oasis = { name: 'Oasis',
    effect: function (card) { return ({
        description: "+1 card. You may discard a card to add a charge counter to a " + coffers.name + " in play.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to discard.', allowNull(state.hand.map(asChoice)))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 5];
                            return [4 /*yield*/, move(target, 'discard')(state)];
                        case 3:
                            state = _b.sent();
                            return [4 /*yield*/, fill(coffers, 1)(state)];
                        case 4:
                            state = _b.sent();
                            _b.label = 5;
                        case 5: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
buyableAnd(oasis, 3, [ensureInPlay(coffers)]);
var woodcutter = { name: "Woodcutter",
    fixedCost: time(1),
    effect: function (card) { return ({ description: '+$3', effect: gainCoin(3) }); }
};
buyable(woodcutter, 3);
var desperation = { name: 'Desperation',
    fixedCost: time(1),
    effect: function (card) { return ({ description: '+$1', effect: gainCoin(1) }); }
};
register(desperation);
var duke = { name: 'Duke',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "+1 vp per duchy in your hand or discard pile.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, gainPoints(state.hand.concat(state.discard).filter(function (card) { return card.name == duchy.name; }).length)(state)];
                });
            });
        }
    }); }
};
buyable(duke, 4);
var inflation = { name: 'Inflation',
    replacers: function (card) { return [{
            description: 'Cards in the supply that cost at least $1 cost $1 more.',
            kind: 'cost',
            handles: function (p, state) { return (p.cost.coin >= 1 && state.find(p.card).place == 'supply'); },
            replace: function (p) { return (__assign(__assign({}, p), { cost: { coin: p.cost.coin + 1, time: p.cost.time } })); }
        }]; }
};
var makeInflation = { name: 'Inflation',
    fixedCost: time(3),
    relatedCards: [inflation],
    effect: function (card) { return ({
        description: "+$15. Create an " + inflation.name + " in play. Trash this.",
        effect: doAll([gainCoin(15), create(inflation, 'play'), trash(card)]),
    }); }
};
register(makeInflation);
var publicWorksReduction = { name: 'Public Works',
    replacers: function (card) { return [{
            description: "Cards in the supply cost @ less.",
            kind: 'cost',
            handles: function (e, state) { return state.find(e.card).place == 'supply'; },
            replace: function (e) { return (__assign(__assign({}, e), { cost: reduceTime(e.cost, 1) })); }
        }]; },
    triggers: function (card) { return [{
            description: "When you buy a card, trash this.",
            kind: 'buy',
            handles: function () { return true; },
            effect: function (e) { return trash(card); }
        }]; }
};
var publicWorks = { name: 'Public Works',
    effect: function (card) { return ({
        description: "The next card you buy this turn costs @ less.",
        effect: create(publicWorksReduction, 'play')
    }); }
};
buyable(publicWorks, 4);
var sleigh = { name: 'Sleigh',
    fixedCost: time(1),
    effect: function (card) { return ({
        description: "Put two charge tokens on a " + stables.name + " in play.",
        effect: fill(stables, 2),
    }); }
};
var makeSleigh = { name: 'Sleigh',
    fixedCost: coin(2),
    relatedCards: [sleigh],
    effect: function (card) { return gainCard(sleigh); },
    triggers: function (card) { return [
        ensureInPlay(stables),
        {
            description: "Whenever you create a card, "
                + (" if it's in your discard pile and you have " + a(sleigh.name) + " in your hand,")
                + (" you may discard the " + sleigh.name + " to put the new card into your hand."),
            kind: 'create',
            handles: function (e, state) { return (state.find(e.card).place == 'discard'); },
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
function reduceCoin(cost, n) {
    return { coin: Math.max(cost.coin - n, 0), time: cost.time };
}
function reduceTime(cost, n) {
    return { time: Math.max(cost.time - n, 0), coin: cost.coin };
}
function isZeroCost(cost) {
    return cost.coin == 0 && cost.time == 0;
}
function reduceCoinNonzero(cost, n) {
    var newCost = reduceCoin(cost, n);
    return (isZeroCost(newCost)) ? cost : newCost;
}
function reduceTimeNonzero(cost, n) {
    var newCost = reduceTime(cost, n);
    return (isZeroCost(newCost)) ? cost : newCost;
}
var makeFerry = { name: 'Ferry',
    fixedCost: coin(3),
    relatedCards: [ferry],
    effect: function (card) { return gainCard(ferry); },
    replacers: function (card) { return [{
            description: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
            kind: 'cost',
            handles: function (p) { return countTokens(p.card, 'ferry') > 0; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reduceCoinNonzero(p.cost, countTokens(p.card, 'ferry')) })); }
        }]; }
};
register(makeFerry);
var livery = { name: 'Livery',
    replacers: function (card) { return [{
            description: "Whenever you would draw cards other than with " + stables.name + "," +
                (" put that many charge tokens on a " + stables.name + " in play instead."),
            kind: 'draw',
            handles: function (x) { return (x.source.name != stables.name); },
            replace: function (x) { return (__assign(__assign({}, x), { draw: 0, effects: x.effects.concat([fill(stables, x.draw)]) })); }
        }]; }
};
var makeLivery = { name: 'Livery',
    fixedCost: time(4),
    relatedCards: [livery, stables],
    effect: function (card) { return ({
        description: "Create " + a(livery.name) + " in play. Trsh this.",
        effect: doAll([create(livery, 'play'), trash(card)])
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
};
register(makeLivery);
function slogCheck(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = state.find(card);
                        if (!(result.found && result.card.charge >= 100)) return [3 /*break*/, 2];
                        return [4 /*yield*/, gainPoints(100, card)(state)];
                    case 1:
                        state = _a.sent();
                        _a.label = 2;
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
            kind: 'gainPoints',
            description: 'Whenever you would gain points other than with this, instead put that many charge tokens on this.',
            handles: function (x) { return x.source.id != card.id; },
            replace: function (x) { return (__assign(__assign({}, x), { points: 0, effects: x.effects.concat([charge(card, x.points), slogCheck(card)]) })); }
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
            kind: 'buy',
            handles: function (e, state) { return (card.cost(state).coin >= 1); },
            effect: function (e) { return addToken(e.card, 'burden'); }
        }]; },
    replacers: function (card) { return [{
            kind: 'cost',
            description: 'Cards cost $1 more for each burden token on them.',
            handles: function (x) { return countTokens(x.card, 'burden') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { cost: { time: x.cost.time, coin: x.cost.coin + countTokens(x.card, 'burden') } })); }
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
var barracks = { name: 'Barracks',
    triggers: function (card) { return [{
            description: 'Whenever you draw 4 or more cards, play cards from your hand with total cost up to @.',
            kind: 'draw',
            handles: function (e) { return e.drawn >= 4; },
            effect: function (e) { return freeActions(1, card); }
        }]; }
};
register(makeCard(barracks, coin(5)));
var composting = { name: 'Composting',
    triggers: function (card) { return [{
            description: 'Whenever you gain time, you may recycle that many cards from your discard pile.',
            kind: 'gainTime',
            handles: function (e) { return e.amount > 0; },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, prompt, cards;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = e.amount;
                                prompt = (n == 1) ? 'Choose a card to recycle.' : "Choose up to " + n + " cards to recycle";
                                return [4 /*yield*/, multichoiceIfNeeded(state, prompt, state.discard.map(asChoice), n, true)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], cards = _a[1];
                                return [2 /*return*/, recycle(cards)(state)];
                        }
                    });
                });
            }; }
        }]; }
};
register(makeCard(composting, coin(6)));
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