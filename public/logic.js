// ----------------------------- Formatting
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
export function renderCost(cost) {
    var coinHtml = cost.coin > 0 ? "$" + cost.coin : '';
    var energyHtml = renderEnergy(cost.energy);
    if (coinHtml == '' && energyHtml == '')
        return '';
    else if (coinHtml == '')
        return energyHtml;
    else
        return [coinHtml, energyHtml].join(' ');
}
export function renderEnergy(n) {
    var result = [];
    if (n < 0)
        return '-' + renderEnergy(-n);
    for (var i = 0; i < n; i++) {
        result.push('@');
    }
    return result.join('');
}
function read(x, k, fallback) {
    return (x[k] == undefined) ? fallback : x[k];
}
//TODO: should Token be a type? can avoid token name typos...
var Card = /** @class */ (function () {
    function Card(spec, id, ticks, tokens, 
    // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
    zoneIndex) {
        if (ticks === void 0) { ticks = [0]; }
        if (tokens === void 0) { tokens = new Map(); }
        if (zoneIndex === void 0) { zoneIndex = 0; }
        this.spec = spec;
        this.id = id;
        this.ticks = ticks;
        this.tokens = tokens;
        this.zoneIndex = zoneIndex;
        this.name = spec.name;
        this.charge = this.count('charge');
    }
    Card.prototype.toString = function () {
        return this.name;
    };
    Card.prototype.update = function (newValues) {
        return new Card(this.spec, this.id, read(newValues, 'ticks', this.ticks), read(newValues, 'tokens', this.tokens), read(newValues, 'zoneIndex', this.zoneIndex));
    };
    Card.prototype.setTokens = function (token, n) {
        var tokens = new Map(this.tokens);
        tokens.set(token, n);
        return this.update({ tokens: tokens });
    };
    Card.prototype.addTokens = function (token, n) {
        return this.setTokens(token, this.count(token) + n);
    };
    Card.prototype.count = function (token) {
        return this.tokens.get(token) || 0;
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
            return this.spec.calculatedCost.calculate(this, state);
        else
            return { coin: 0, energy: 0 };
    };
    // the cost after replacement effects
    Card.prototype.cost = function (state) {
        var card = this;
        var initialCost = { kind: 'cost', card: card, cost: card.baseCost(state) };
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
                                            return [4 /*yield*/, gainEnergy(cost.energy)(state)];
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
            return { text: '', effect: noop };
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
export { Card };
var notFound = { found: false, card: null, place: null };
var noUI = {
    choice: function (state, choicePrompt, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new ReplayEnded(state);
            });
        });
    },
    multichoice: function (state, choicePrompt, options, validator) {
        if (validator === void 0) { validator = (function (xs) { return true; }); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new ReplayEnded(state);
            });
        });
    },
    victory: function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Victory(state);
            });
        });
    }
};
var State = /** @class */ (function () {
    function State(spec, ui, counters, zones, resolving, nextID, history, future, checkpoint, logs, logIndent) {
        if (spec === void 0) { spec = { seed: '', kingdom: null }; }
        if (ui === void 0) { ui = noUI; }
        if (counters === void 0) { counters = { coin: 0, energy: 0, points: 0 }; }
        if (zones === void 0) { zones = new Map(); }
        if (resolving === void 0) { resolving = []; }
        if (nextID === void 0) { nextID = 0; }
        if (history === void 0) { history = []; }
        if (future === void 0) { future = []; }
        if (checkpoint === void 0) { checkpoint = null; }
        if (logs === void 0) { logs = []; }
        if (logIndent === void 0) { logIndent = 0; }
        this.spec = spec;
        this.ui = ui;
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
        this.energy = counters.energy;
        this.points = counters.points;
        this.supply = zones.get('supply') || [];
        this.hand = zones.get('hand') || [];
        this.deck = zones.get('deck') || [];
        this.discard = zones.get('discard') || [];
        this.play = zones.get('play') || [];
        this.aside = zones.get('aside') || [];
    }
    State.prototype.update = function (stateUpdate) {
        return new State(this.spec, read(stateUpdate, 'ui', this.ui), read(stateUpdate, 'counters', this.counters), read(stateUpdate, 'zones', this.zones), read(stateUpdate, 'resolving', this.resolving), read(stateUpdate, 'nextID', this.nextID), read(stateUpdate, 'history', this.history), read(stateUpdate, 'future', this.future), read(stateUpdate, 'checkpoint', this.checkpoint), read(stateUpdate, 'logs', this.logs), read(stateUpdate, 'logIndent', this.logIndent));
    };
    State.prototype.attachUI = function (ui) {
        if (ui === void 0) { ui = noUI; }
        return this.update({ ui: ui });
    };
    State.prototype.addResolving = function (x) {
        return this.update({ resolving: this.resolving.concat([x]) });
    };
    State.prototype.popResolving = function () {
        return this.update({ resolving: this.resolving.slice(0, this.resolving.length - 1) });
    };
    State.prototype.addToZone = function (card, zone, loc) {
        if (loc === void 0) { loc = 'end'; }
        //if (zone == 'hand') loc = 'handSort'
        if (zone == 'resolving')
            return this.addResolving(card);
        var newZones = new Map(this.zones);
        var currentZone = this[zone];
        card = card.update({ zoneIndex: firstFreeIndex(currentZone) });
        newZones.set(zone, insertAt(currentZone, card, loc));
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
        return this.update({ counters: { coin: n, energy: this.energy, points: this.points } });
    };
    State.prototype.addShadow = function (spec) {
        var _a;
        var state = this;
        var id;
        _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
        var shadow = new Shadow(id, spec);
        return state.addResolving(shadow);
    };
    State.prototype.setEnergy = function (n) {
        return this.update({ counters: { coin: this.coin, energy: n, points: this.points } });
    };
    State.prototype.setPoints = function (n) {
        return this.update({ counters: { coin: this.coin, energy: this.energy, points: n } });
    };
    State.prototype.find = function (card) {
        var e_3, _a;
        if (card == null)
            return notFound;
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
    // To maintain this invariant, we need to record history every energy there is a change
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
    //TODO: serialize the full history
    //TODO: make a version of state that raises an exception if player choice is required
    //TODO: write a routine that creates dummy state and a proposed score, and tells if it's valid
    State.prototype.serializeHistory = function () {
        var state = this;
        var prev = state;
        while (prev != null) {
            state = prev;
            prev = state.backup();
        }
        return state.future.map(function (xs) { return xs.join(','); }).join(';');
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
        return (this.lastReplayable() != null);
    };
    State.fromHistory = function (s, spec) {
        var pieces = s.split(';');
        var future = pieces.map(function (piece) { return piece.split(',').map(function (x) { return parseInt(x); }); });
        return initialState(spec).update({ future: future });
    };
    return State;
}());
export { State };
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
export var emptyState = new State();
function assertNever(x) {
    throw new Error("Unexpected: " + x);
}
function insertInto(x, xs, n) {
    return xs.slice(0, n).concat([x]).concat(xs.slice(n));
}
function firstFreeIndex(cards) {
    var indices = new Set(cards.map(function (card) { return card.zoneIndex; }));
    for (var i = 0; i < cards.length + 1; i++) {
        if (!indices.has(i))
            return i;
    }
}
function insertAt(zone, card, loc) {
    switch (loc) {
        case 'start':
        case 'top':
            return [card].concat(zone);
        case 'bottom':
        case 'end':
            return zone.concat([card]);
        default: return assertNever(loc);
    }
}
function createRaw(state, spec, zone, loc) {
    var _a;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    var id;
    _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
    var card = new Card(spec, id);
    state = state.addToZone(card, zone, loc);
    return [state, card];
}
function createRawMulti(state, specs, zone, loc) {
    var e_4, _a, _b;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    try {
        for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
            var spec = specs_1_1.value;
            var card = void 0;
            _b = __read(createRaw(state, spec, zone, loc), 2), state = _b[0], card = _b[1];
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return state;
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, _a, _b, card, _c, _d, rawtrigger, trigger_1, e_5_1, e_6_1;
            var e_6, _e, e_5, _f;
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
                        _c = (e_5 = void 0, __values(card.triggers())), _d = _c.next();
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
                        e_5_1 = _g.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_6_1 = _g.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_6) throw e_6.error; }
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
    var e_7, _a;
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
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_a = replacers_1.return)) _a.call(replacers_1);
        }
        finally { if (e_7) throw e_7.error; }
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
export { Shadow };
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
            var card;
            var _a;
            return __generator(this, function (_b) {
                _a = __read(createRaw(state, spec, zone, loc), 2), state = _a[0], card = _a[1];
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
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = { cards: cards, kind: 'recycle' };
                        params = replace(params, state);
                        cards = params.cards;
                        if (cards.length > 0) {
                            state = state.log("Recycled " + showCards(cards) + " to bottom of deck");
                        }
                        return [4 /*yield*/, moveMany(cards, 'deck', 'bottom', true)(state)];
                    case 1:
                        state = _a.sent();
                        return [4 /*yield*/, trigger({ kind: 'recycle', cards: cards })(state)];
                    case 2:
                        state = _a.sent();
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
                        return [4 /*yield*/, move(nextCard, 'hand', 'end', true)(state)];
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
// --------------- Transforms that change points, energy, and coins
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
export { Victory };
function gainEnergy(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state = state.setEnergy(state.energy + n);
                if (n != 0)
                    state = state.log("Gained " + renderEnergy(n));
                return [2 /*return*/, trigger({ kind: 'gainEnergy', amount: n })(state)];
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
function uncharge(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var find;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        find = state.find(card);
                        if (!find.found) return [3 /*break*/, 2];
                        return [4 /*yield*/, charge(find.card, -find.card.charge)(state)];
                    case 1:
                        state = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, state];
                }
            });
        });
    };
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
                state = state.apply(function (card) { return card.setTokens('charge', newCharge); }, card);
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
            var result, newCard;
            return __generator(this, function (_a) {
                result = state.find(card);
                if (!result.found)
                    return [2 /*return*/, state];
                card = result.card;
                newCard = card.addTokens(token, 1);
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, 1);
                return [2 /*return*/, trigger({ kind: 'addToken', card: newCard, token: token })(state)];
            });
        });
    };
}
function removeTokens(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result, removed, newCard;
            return __generator(this, function (_a) {
                result = state.find(card);
                if (!result.found)
                    return [2 /*return*/, state];
                card = result.card;
                removed = card.count(token);
                newCard = card.setTokens(token, 0);
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
            var removed, result, newCard;
            return __generator(this, function (_a) {
                removed = 0;
                result = state.find(card);
                if (!result.found)
                    return [2 /*return*/, state];
                card = result.card;
                if (card.count(token) == 0)
                    return [2 /*return*/, state];
                newCard = card.addTokens(token, -1);
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
function randomChoices(xs, n, seed) {
    var result = [];
    xs = xs.slice();
    while (result.length < n) {
        if (xs.length == 0)
            return result;
        if (xs.length == 1)
            return result.concat(xs);
        var rand = (seed == null) ? Math.random() : PRF(seed, result.length);
        var k = Math.floor(rand * xs.length);
        result.push(xs[k]);
        xs[k] = xs[xs.length - 1];
        xs = xs.slice(0, xs.length - 1);
    }
    return result;
}
var ReplayEnded = /** @class */ (function (_super) {
    __extends(ReplayEnded, _super);
    function ReplayEnded(state) {
        var _this = _super.call(this, 'ReplayEnded') || this;
        _this.state = state;
        Object.setPrototypeOf(_this, ReplayEnded.prototype);
        return _this;
    }
    return ReplayEnded;
}(Error));
export { ReplayEnded };
function doOrReplay(state, f) {
    return __awaiter(this, void 0, void 0, function () {
        var record, x, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = __read(state.shiftFuture(), 2), state = _b[0], record = _b[1];
                    if (!(record == null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, f()];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = record;
                    _c.label = 3;
                case 3:
                    x = _a;
                    return [2 /*return*/, [state.addHistory(x), x]];
            }
        });
    });
}
function multichoice(state, prompt, options, validator, automateTrivial) {
    if (validator === void 0) { validator = (function (xs) { return true; }); }
    if (automateTrivial === void 0) { automateTrivial = true; }
    return __awaiter(this, void 0, void 0, function () {
        var indices;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(automateTrivial && options.length == 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, [state, []]];
                case 1:
                    indices = void 0;
                    return [4 /*yield*/, doOrReplay(state, function () { return state.ui.multichoice(state, prompt, options, validator); })];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], indices = _a[1];
                    if (indices.some(function (x) { return x > options.length; }))
                        throw new HistoryMismatch(indices, state);
                    return [2 /*return*/, [state, indices.map(function (i) { return options[i].value; })]];
            }
        });
    });
}
var HistoryMismatch = /** @class */ (function (_super) {
    __extends(HistoryMismatch, _super);
    function HistoryMismatch(indices, state) {
        var _this = _super.call(this, 'HistoryMismatch') || this;
        _this.indices = indices;
        _this.state = state;
        Object.setPrototypeOf(_this, HistoryMismatch.prototype);
        return _this;
    }
    return HistoryMismatch;
}(Error));
export { HistoryMismatch };
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
export { Undo };
function choice(state, prompt, options, automateTrivial) {
    if (automateTrivial === void 0) { automateTrivial = true; }
    return __awaiter(this, void 0, void 0, function () {
        var index, indices;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(options.length == 0)) return [3 /*break*/, 1];
                    return [2 /*return*/, [state, null]];
                case 1:
                    if (!(automateTrivial && options.length == 1)) return [3 /*break*/, 2];
                    return [2 /*return*/, [state, options[0].value]];
                case 2:
                    indices = void 0;
                    return [4 /*yield*/, doOrReplay(state, function () {
                            return __awaiter(this, void 0, void 0, function () { var x; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, state.ui.choice(state, prompt, options)];
                                    case 1:
                                        x = _a.sent();
                                        return [2 /*return*/, [x]];
                                }
                            }); });
                        })];
                case 3:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], indices = _a[1];
                    if (indices.length != 1 || indices[0] >= options.length)
                        throw new HistoryMismatch(indices, state);
                    return [2 /*return*/, [state, options[indices[0]].value]];
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
    { render: 'Yes', value: true, hotkeyHint: { kind: 'boolean', val: true } },
    { render: 'No', value: false, hotkeyHint: { kind: 'boolean', val: false } }
];
function range(n) {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(i);
    return result;
}
function chooseNatural(n) {
    return range(n).map(function (x) { return ({ render: String(x), value: x, hotkeyHint: { kind: 'number', val: x } }); });
}
function asChoice(x) {
    return { render: x.id, value: x };
}
function asNumberedChoices(xs) {
    return xs.map(function (card, i) { return ({ render: card.id, value: card, hotkeyHint: { kind: 'number', val: i } }); });
}
function allowNull(options, message) {
    if (message === void 0) { message = "None"; }
    var newOptions = options.slice();
    newOptions.push({ render: message, value: null, hotkeyHint: { kind: 'none' } });
    return newOptions;
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
                throw Error("tried to undo past beginning of the game");
        }
        else {
            return state;
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
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, act(state)];
                case 2:
                    state = _a.sent();
                    return [2 /*return*/, state];
                case 3:
                    error_2 = _a.sent();
                    if (!(error_2 instanceof Undo)) return [3 /*break*/, 4];
                    return [2 /*return*/, undo(error_2.state)];
                case 4:
                    if (!(error_2 instanceof Victory)) return [3 /*break*/, 6];
                    state = error_2.state;
                    return [4 /*yield*/, state.ui.victory(state)];
                case 5:
                    _a.sent();
                    return [2 /*return*/, undo(state)];
                case 6: throw error_2;
                case 7: return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
export function verifyScore(seed, history, score) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, playGame(State.fromHistory(history, { seed: seed, kingdom: null }))
                    .then(function (x) { return [true, ""]; }) //won't ever fire
                    .catch(function (e) {
                    if (e instanceof Victory) {
                        if (e.state.energy == score)
                            return [true, ""];
                        else
                            return [false, "Computed score was " + e.state.energy];
                    }
                    else if (e instanceof HistoryMismatch) {
                        return [false, "" + e];
                    }
                    else if (e instanceof ReplayEnded) {
                        return [false, "" + e];
                    }
                    else {
                        throw e;
                    }
                })];
        });
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
    var validHand = state.hand;
    var validSupplies = state.supply.filter(function (x) { return (x.cost(state).coin <= state.coin); });
    var validPlay = state.play.filter(function (x) { return (x.abilities().length > 0); });
    var cards = validHand.concat(validSupplies).concat(validPlay);
    return choice(state, 'Play a card from your hand, use an ability of a card in play, or buy a card from the supply.', cards.map(asChoice), false);
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
                    case 1: return [4 /*yield*/, choice(state, "Choose an ability to use:", allowNull(card.abilities().map(function (x) { return ({ kind: 'string', render: x.text, value: x }); })))];
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
// ------------------------------ Start the game
function supplyKey(spec) {
    return new Card(spec, -1).cost(emptyState).coin;
}
function supplySort(card1, card2) {
    return supplyKey(card1) - supplyKey(card2);
}
// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
function getFixedKingdom(kingdomString) {
    var e_8, _a, e_9, _b;
    if (kingdomString == null)
        return null;
    var cardStrings = kingdomString.split(',');
    var mixinsByName = new Map();
    try {
        for (var mixins_1 = __values(mixins), mixins_1_1 = mixins_1.next(); !mixins_1_1.done; mixins_1_1 = mixins_1.next()) {
            var spec = mixins_1_1.value;
            mixinsByName.set(spec.name, spec);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (mixins_1_1 && !mixins_1_1.done && (_a = mixins_1.return)) _a.call(mixins_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    var result = [];
    try {
        for (var cardStrings_1 = __values(cardStrings), cardStrings_1_1 = cardStrings_1.next(); !cardStrings_1_1.done; cardStrings_1_1 = cardStrings_1.next()) {
            var cardString = cardStrings_1_1.value;
            var cardSpec = mixinsByName.get(cardString);
            if (cardSpec == undefined) {
                alert("URL specified invalid card " + cardString);
                return null;
            }
            else {
                result.push(cardSpec);
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (cardStrings_1_1 && !cardStrings_1_1.done && (_b = cardStrings_1.return)) _b.call(cardStrings_1);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return result;
}
export function initialState(spec) {
    var startingDeck = [copper, copper, copper, copper, copper,
        copper, copper, estate, estate, estate];
    var intSeed = hash(spec.seed);
    var shuffledDeck = randomChoices(startingDeck, startingDeck.length, intSeed);
    var variableSupplies = randomChoices(mixins, 12, intSeed + 1);
    var fixedKingdom = getFixedKingdom(spec.kingdom);
    if (fixedKingdom != null)
        variableSupplies = fixedKingdom;
    variableSupplies.sort(supplySort);
    if (spec.testing) {
        for (var i = 0; i < cheats.length; i++)
            testing.push(cheats[i]);
        variableSupplies = variableSupplies.concat(testing);
    }
    var kingdom = coreSupplies.concat(variableSupplies);
    var state = new State(spec);
    state = createRawMulti(state, kingdom, 'supply');
    state = createRawMulti(state, shuffledDeck, 'deck');
    return state;
}
export function playGame(state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trigger({ kind: 'gameStart' })(state)];
                case 1:
                    state = _a.sent();
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, mainLoop(state)];
                case 3:
                    state = _a.sent();
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//
// ----------------- CARDS -----------------
//
var coreSupplies = [];
export var mixins = [];
var testing = [];
var cheats = [];
//
// ----------- UTILS -------------------
//
function gainCard(card) {
    return {
        text: "Create " + a(card.name) + " in your discard pile.",
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
function energy(n) {
    return { energy: n, coin: 0 };
}
function coin(n) {
    return { energy: 0, coin: n };
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
            text: "Create " + a(card.name) + " in play." + (selfdestruct ? ' Trash this.' : ''),
            effect: doAll([create(card, 'play'), selfdestruct ? trash(supply) : noop])
        }); },
        relatedCards: [card],
    };
}
//
//
// ------ CORE ------
//
function reboot(card, n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setCoin(0)(state)];
                    case 1:
                        state = _a.sent();
                        return [4 /*yield*/, recycle(state.discard)(state)];
                    case 2:
                        state = _a.sent();
                        return [4 /*yield*/, recycle(state.hand)(state)];
                    case 3:
                        state = _a.sent();
                        return [4 /*yield*/, draw(n, card)(state)];
                    case 4:
                        state = _a.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
var regroup = { name: 'Regroup',
    fixedCost: energy(3),
    effect: function (card) { return ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +5 cards.',
        effect: reboot(card, 5),
    }); }
};
coreSupplies.push(regroup);
var copper = { name: 'Copper',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$1',
        effect: gainCoin(1),
    }); }
};
coreSupplies.push(supplyForCard(copper, coin(1)));
var silver = { name: 'Silver',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$2',
        effect: gainCoin(2)
    }); }
};
coreSupplies.push(supplyForCard(silver, coin(3)));
var gold = { name: 'Gold',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$3',
        effect: gainCoin(3)
    }); }
};
coreSupplies.push(supplyForCard(gold, coin(6)));
var estate = { name: 'Estate',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+1vp',
        effect: gainPoints(1),
    }); }
};
coreSupplies.push(supplyForCard(estate, coin(1)));
var duchy = { name: 'Duchy',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+2vp',
        effect: gainPoints(2),
    }); }
};
coreSupplies.push(supplyForCard(duchy, coin(4)));
var province = { name: 'Province',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+3vp',
        effect: gainPoints(3),
    }); }
};
coreSupplies.push(supplyForCard(province, coin(8)));
//
// ----- MIXINS -----
//
function playAgain(target, source) {
    if (source === void 0) { source = { name: '?' }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = state.find(target);
                        if (!(result.place == 'discard')) return [3 /*break*/, 2];
                        return [4 /*yield*/, result.card.play(source)(state)];
                    case 1:
                        state = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, state];
                }
            });
        });
    };
}
function playTwice(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
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
                        return [2 /*return*/, playAgain(target, card)(state)];
                }
            });
        });
    };
}
var throneRoom = { name: 'Throne Room',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "Play a card in your hand. Then if it's in your discard pile play it again.",
        effect: playTwice(card)
    }); }
};
buyable(throneRoom, 4);
var hound = { name: 'Hound',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+2 cards',
        effect: draw(2)
    }); }
};
buyable(hound, 1);
var smithy = { name: 'Smithy',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+3 cards',
        effect: draw(3)
    }); }
};
buyable(smithy, 4);
var tutor = { name: 'Tutor',
    effect: function (card) { return ({
        text: 'Put any card from your deck into your hand.',
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
var education = { name: 'Education',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Put up to three cards from your deck into your hand.',
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
buyable(education, 4);
var philanthropy = { name: 'Philanthropy',
    fixedCost: { coin: 10, energy: 2 },
    effect: function (card) { return ({
        text: 'Lose all $, then +1 vp per coin lost.',
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
var repurpose = { name: 'Repurpose',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +1 card per coin lost.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.coin;
                    return [2 /*return*/, reboot(card, n)(state)];
                });
            });
        }
    }); }
};
register(repurpose);
var crafting = { name: 'Crafting',
    triggers: function (card) { return [{
            text: "After playing " + a(estate.name) + ", +$1.",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.name == estate.name); },
            effect: function (e) { return gainCoin(1); },
        }]; }
};
register(makeCard(crafting, energy(1), true));
var homestead = { name: 'Homesteading',
    triggers: function (card) { return [{
            text: "After playing " + a(estate.name) + ", +1 card",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.name == estate.name); },
            effect: function (e) { return draw(1); }
        }]; }
};
register(makeCard(homestead, energy(2), true));
var monument = { name: 'Monument',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$2, +1 vp.',
        effect: doAll([gainCoin(2), gainPoints(1)])
    }); }
};
buyable(monument, 2);
var vibrantCity = { name: 'Vibrant City',
    effect: function (card) { return ({
        text: '+1vp, +1 card.',
        effect: doAll([gainPoints(1), draw(1)])
    }); }
};
buyable(vibrantCity, 8);
var frontier = { name: 'Frontier',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Add a charge token to this, then +1 vp per charge token on this. Put it on the bottom of your deck.',
        toZone: 'deck',
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
buyable(frontier, 6);
var investment = { name: 'Investment',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Add a charge token to this, then +$1 per charge token on this.',
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
buyable(investment, 3);
var populate = { name: 'Populate',
    fixedCost: { coin: 12, energy: 5 },
    effect: function (card) { return ({
        text: 'Buy any number of cards in the supply other than this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, _loop_1, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            options = state.supply.filter(function (c) { return c.id != card.id; });
                            _loop_1 = function () {
                                var picked, id_1;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            picked = void 0;
                                            return [4 /*yield*/, choice(state, 'Pick a card to buy next.', allowNull(options.map(asChoice)))];
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
                            return [5 /*yield**/, _loop_1()];
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
var oldSmith = { name: 'Old Smith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Put this in play with 4 charge tokens on it.',
        effect: charge(card, 4),
        toZone: 'play'
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you gain energy, you may remove up to that many charge tokens from this.' +
                ' Draw a card per token removed, then if there are no charge tokens left discard this.',
            kind: 'gainEnergy',
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
                                return [4 /*yield*/, choice(state, 'How many charge tokens do you want to remove?', options)];
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
buyable(oldSmith, 3);
var duplicate = { name: 'Duplicate',
    fixedCost: { coin: 5, energy: 1 },
    effect: function (card) { return ({
        text: "Put a duplicate token on each card in the supply other than this.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.supply.filter(function (c) { return c.id != card.id; }).map(function (c) { return addToken(c, 'duplicate'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: "After buying a card with a duplicate token on it, remove all duplicate tokens from it and buy it again.",
            kind: 'afterBuy',
            handles: function (e) { return (e.after != null && e.after.count('duplicate') > 0); },
            effect: function (e) { return (e.after != null) ? doAll([removeTokens(e.after, 'duplicate'), e.after.buy(card)]) : noop; },
        }]; }
};
register(duplicate);
var hallOfMirrors = { name: 'Hall of Mirrors',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Put a mirror token on each card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, card_2, e_10_1;
                var e_10, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _d.trys.push([0, 5, 6, 7]);
                            _a = __values(state.hand), _b = _a.next();
                            _d.label = 1;
                        case 1:
                            if (!!_b.done) return [3 /*break*/, 4];
                            card_2 = _b.value;
                            return [4 /*yield*/, addToken(card_2, 'mirror')(state)];
                        case 2:
                            state = _d.sent();
                            _d.label = 3;
                        case 3:
                            _b = _a.next();
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_10_1 = _d.sent();
                            e_10 = { error: e_10_1 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_10) throw e_10.error; }
                            return [7 /*endfinally*/];
                        case 7: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
var makeHallOfMirrors = { name: 'Hall of Mirrors',
    fixedCost: coin(6),
    effect: function (card) { return gainCard(hallOfMirrors); },
    relatedCards: [hallOfMirrors],
    triggers: function (card) { return [{
            text: "Whenever you finish playing a card with a mirror token other than with this," +
                " if it's in your discard pile remove a mirror token from it and play it again.",
            kind: 'afterPlay',
            handles: function (e) { return (e.after != null && e.after.count('mirror') > 0 && e.source.id != card.id); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(e.after != null && state.find(e.after).place == 'discard')) return [3 /*break*/, 3];
                                return [4 /*yield*/, removeOneToken(e.after, 'mirror')(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, e.after.play(card)(state)];
                            case 2:
                                state = _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]; }
};
register(makeHallOfMirrors);
var royalCarriage = { name: 'Royal Carriage',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: "Put this in play.",
        toZone: 'play',
        effect: noop,
    }); },
    abilities: function (card) { return [{
            text: "Put a charge token on this.",
            cost: noop,
            effect: charge(card, 1),
        }]; },
    triggers: function (card) { return [{
            text: "When you finish playing a card the normal way, if this has a charge token on it then"
                + " remove all charge tokens, discard this, and play the card again if it's in your discard pile.",
            kind: 'afterPlay',
            handles: function (e) { return (e.source.name == 'act'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var findCarriage, findCard;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                findCarriage = state.find(card);
                                findCard = state.find(e.after);
                                if (!(findCarriage.found && findCarriage.card.charge > 0
                                    && findCard.place == 'discard')) return [3 /*break*/, 4];
                                card = findCarriage.card;
                                return [4 /*yield*/, uncharge(card)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, move(card, 'discard')(state)];
                            case 2:
                                state = _a.sent();
                                return [4 /*yield*/, playAgain(e.after)(state)];
                            case 3:
                                state = _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]; }
};
buyable(royalCarriage, 5);
var royalSeal = { name: 'Royal Seal',
    effect: function (card) { return ({
        text: '+$2. Next time you create a card in your discard pile, put it into your hand.',
        effect: doAll([
            gainCoin(2),
            nextTime('Capital', "When you create a card in your discard pile, trash this"
                + " and put that card into your hand.", 'create', function (e) { return (e.zone == 'discard'); }, function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(state.find(e.card).place == 'discard')) return [3 /*break*/, 2];
                                return [4 /*yield*/, move(e.card, 'hand')(state)];
                            case 1:
                                state = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; })
        ])
    }); }
};
buyable(royalSeal, 6);
var bridge = { name: 'Bridge',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$2. Put this in play.',
        toZone: 'play',
        effect: gainCoin(2),
    }); },
    replacers: function (card) { return [{
            text: 'Cards cost $1 less, unless it would make them cost 0.',
            kind: 'cost',
            handles: function (p) { return true; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reduceCoinNonzero(p.cost, 1) })); }
        }, {
            text: 'Whenever you recycle one or more cards, also recycle this.',
            kind: 'recycle',
            handles: function (p) { return p.cards.length > 0; },
            replace: function (p) { return (__assign(__assign({}, p), { cards: p.cards.concat([card]) })); }
        }]; }
};
buyable(bridge, 4);
var cellar = { name: 'Cellar',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Discard any number of cards in your hand, then draw that many cards.',
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
    fixedCost: energy(0),
    effect: function (_) { return ({
        text: '+1 card. You may put the bottom card of your deck on top of your deck.',
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
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+1 card. +$1.',
        effect: doAll([draw(1), gainCoin(1)]),
    }); }
};
var makePeddler = { name: 'Peddler',
    fixedCost: coin(5),
    effect: function (card) { return ({
        text: 'Create a peddler on top of your deck',
        effect: create(peddler, 'deck', 'top')
    }); },
    relatedCards: [peddler]
};
register(makePeddler);
function freeActions(totalEnergy, card, constraint) {
    if (constraint === void 0) { constraint = function (c) { return true; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var remainingEnergy, options, target, energyCost, i;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        remainingEnergy = totalEnergy;
                        _b.label = 1;
                    case 1:
                        if (!(remainingEnergy > 0)) return [3 /*break*/, 4];
                        options = state.hand.filter(function (card) { return (card.cost(state).energy <= remainingEnergy)
                            && constraint(card, state); });
                        target = void 0;
                        return [4 /*yield*/, choice(state, "Choose a card costing up to " + renderEnergy(remainingEnergy) + " to play", allowNull(options.map(asChoice)))];
                    case 2:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        if (target == null)
                            return [3 /*break*/, 4];
                        energyCost = target.cost(state).energy;
                        return [4 /*yield*/, target.play()(state)];
                    case 3:
                        state = _b.sent();
                        remainingEnergy -= energyCost;
                        for (i = 0; i < energyCost; i++)
                            state = tick(card)(state);
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, state];
                }
            });
        });
    };
}
function villagestr(n) {
    return "Play cards from your hand with total cost at most " + renderEnergy(n) + ".";
}
var coven = { name: 'Coven',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+$2. " + villagestr(2) + " None of them may have the same name as a card in your discard pile.",
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
            text: 'Cards in the supply cost $1 less, unless it would make them cost 0.',
            kind: 'cost',
            handles: function () { return true; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reduceCoinNonzero(p.cost, 1) })); }
        }]; }
};
register(makeCard(canal, { coin: 7, energy: 1 }));
var village = { name: 'Village',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+1 card. " + villagestr(2),
        effect: doAll([draw(1), freeActions(2, card)]),
    }); }
};
buyable(village, 4);
var bazaar = { name: 'Bazaar',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+1 card. +$1. " + villagestr(2),
        effect: doAll([draw(1), gainCoin(1), freeActions(2, card)])
    }); }
};
buyable(bazaar, 5);
var workshop = { name: 'Workshop',
    effect: function (card) { return ({
        text: 'Buy a card in the supply costing up to $4.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supply.filter(function (card) { return (card.cost(state).coin <= 4 && card.cost(state).energy <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $4 to buy.', options.map(asChoice))];
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+$2. Next time you finish buying a card the normal way, buy it again if it still exists.",
        effect: doAll([
            gainCoin(2),
            nextTime('Shipping Lane', "When you finish buying a card the normal way,"
                + " discard this and buy it again if it's still in the supply.", 'afterBuy', function (e) { return (e.source.name == 'act'); }, function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                result = state.find(e.before);
                                if (!(result.found && result.place == 'supply')) return [3 /*break*/, 2];
                                return [4 /*yield*/, result.card.buy(card)(state)];
                            case 1:
                                state = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; })
        ])
    }); }
};
buyable(shippingLane, 5);
var factory = { name: 'Factory',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Buy a card in the supply costing up to $6.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supply.filter(function (card) { return (card.cost(state).coin <= 6 && card.cost(state).energy <= 0); });
                            return [4 /*yield*/, choice(state, 'Choose a card costing up to $6 to buy.', options.map(asChoice))];
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
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$5. Trash this.',
        effect: doAll([gainCoin(5), trash(card)]),
    }); }
};
buyable(feast, 4);
function costPlus(base, addition) {
    return {
        text: "This costs " + renderCost(addition) + " more per charge token on it.",
        calculate: function (c, s) { return ({
            coin: base.coin + c.charge * addition.coin,
            energy: base.energy + c.charge * addition.energy
        }); }
    };
}
var mobilization = { name: 'Mobilization',
    replacers: function (card) { return [{
            text: regroup.name + " costs @ less to play, unless that would make it cost 0.",
            kind: 'cost',
            handles: function (x) { return (x.card.name == 'Regroup'); },
            replace: function (x) { return (__assign(__assign({}, x), { cost: reduceEnergyNonzero(x.cost, 1) })); }
        }]; }
};
var gainMobilization = { name: 'Mobilization',
    calculatedCost: costPlus(coin(15), coin(10)),
    effect: function (card) { return ({
        text: "Create a " + mobilization.name + " in play. Put a charge token on this.",
        effect: doAll([create(mobilization, 'play'), charge(card, 1)])
    }); },
    relatedCards: [mobilization],
};
register(gainMobilization);
var junkDealer = { name: 'Junk Dealer',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+1 card. +$1. Trash a card in your hand.',
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Recycle your discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, recycle(state.discard)(state)];
            }); });
        }
    }); }
};
mixins.push(refresh);
var plough = { name: 'Plough',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Recycle any number of cards from your discard pile. +2 cards.',
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+$2. Play the top card of your deck.",
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
    fixedCost: { energy: 1, coin: 8 },
    effect: function (card) { return ({
        text: 'Put a twin token on a card in your hand.',
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
            text: "After playing a card with a twin token other than with this, if it's in your discard pile play it again.",
            kind: 'afterPlay',
            handles: function (e) { return (e.before.count('twin') > 0 && e.source.id != card.id); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        result = state.find(e.before);
                        return [2 /*return*/, (result.place == 'discard') ? result.card.play(card)(state) : state];
                    });
                });
            }; }
        }]; },
};
register(twin);
var youngSmith = { name: 'Young Smith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Add a charge token to this, then +1 card per charge token on this.',
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
buyable(youngSmith, 1);
function nextTime(name, text, kind, when, what) {
    function triggers(card) {
        return [{
                text: text,
                kind: kind,
                handles: function (e, state) { return (when(e, state) && state.find(card).place == 'play'); },
                effect: function (e) { return doAll([trash(card), what(e)]); },
            }];
    }
    var spec = { name: name, triggers: triggers };
    return create(spec, 'play');
}
var expedite = { name: 'Expedite',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "The next energy you create a card, if it's in your discard pile put it into your hand." +
            ' Put a charge token on this.',
        effect: doAll([
            nextTime('Expedite', "When you create a card, if it's in your discard pile" +
                " then trash this and put it into your hand.", 'create', function (e, state) { return (state.find(e.card).place == 'discard'); }, function (e) { return move(e.card, 'hand'); }),
            charge(card, 1),
        ])
    }); }
};
register(expedite);
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Create a gold in your hand and a gold on top of your deck.',
        effect: doAll([create(gold, 'deck', 'top'), create(gold, 'hand')]),
    }); }
};
buyable(goldMine, 6);
var warehouse = { name: 'Warehouse',
    effect: function (card) { return ({
        text: 'Draw 3 cards, then discard 3 cards.',
        effect: doAll([draw(3), discard(3)]),
    }); }
};
buyable(warehouse, 3);
var cursedKingdom = { name: 'Cursed Kingdom',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+4 vp. Put a charge token on this.',
        effect: doAll([gainPoints(4), charge(card, 1)])
    }); }
};
var gainCursedKingdom = { name: 'Cursed Kingdom',
    fixedCost: coin(5),
    relatedCards: [cursedKingdom],
    effect: function (card) { return ({
        text: "Create a " + card.name + " in your discard pile.",
        effect: create(cursedKingdom, 'discard')
    }); },
    triggers: function (card) { return [{
            text: "Whenever you put a " + card.name + " into your hand, +@ for each charge token on it.",
            kind: 'move',
            handles: function (e) { return (e.card.name == card.name && e.toZone == 'hand'); },
            effect: function (e) { return gainEnergy(e.card.charge); }
        }]; }
};
mixins.push(gainCursedKingdom);
var junkyard = { name: 'Junkyard',
    fixedCost: energy(0),
    triggers: function (card) { return [{
            text: 'Whenever you trash a card, +1 vp.',
            kind: 'move',
            handles: function (e) { return (e.toZone == null); },
            effect: function (e) { return gainPoints(1); }
        }]; }
};
//mixins.push(makeCard(junkyard, {coin:5, energy:2}))
function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy;
}
var makeSynergy = { name: 'Synergy',
    fixedCost: { coin: 5, energy: 1 },
    effect: function (card) { return ({
        text: 'Remove all synergy tokens from cards in the supply,' +
            " then put synergy tokens on two cards in the supply.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, card_3, e_11_1, cards, cards_1, cards_1_1, card_4, e_12_1;
                var e_11, _c, _d, e_12, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 5, 6, 7]);
                            _a = __values(state.supply), _b = _a.next();
                            _f.label = 1;
                        case 1:
                            if (!!_b.done) return [3 /*break*/, 4];
                            card_3 = _b.value;
                            if (!(card_3.count('synergy') > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, removeTokens(card_3, 'synergy')(state)];
                        case 2:
                            state = _f.sent();
                            _f.label = 3;
                        case 3:
                            _b = _a.next();
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_11_1 = _f.sent();
                            e_11 = { error: e_11_1 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_11) throw e_11.error; }
                            return [7 /*endfinally*/];
                        case 7: return [4 /*yield*/, multichoiceIfNeeded(state, 'Choose two cards to synergize.', state.supply.map(asChoice), 2, false)];
                        case 8:
                            _d = __read.apply(void 0, [_f.sent(), 2]), state = _d[0], cards = _d[1];
                            _f.label = 9;
                        case 9:
                            _f.trys.push([9, 14, 15, 16]);
                            cards_1 = __values(cards), cards_1_1 = cards_1.next();
                            _f.label = 10;
                        case 10:
                            if (!!cards_1_1.done) return [3 /*break*/, 13];
                            card_4 = cards_1_1.value;
                            return [4 /*yield*/, addToken(card_4, 'synergy')(state)];
                        case 11:
                            state = _f.sent();
                            _f.label = 12;
                        case 12:
                            cards_1_1 = cards_1.next();
                            return [3 /*break*/, 10];
                        case 13: return [3 /*break*/, 16];
                        case 14:
                            e_12_1 = _f.sent();
                            e_12 = { error: e_12_1 };
                            return [3 /*break*/, 16];
                        case 15:
                            try {
                                if (cards_1_1 && !cards_1_1.done && (_e = cards_1.return)) _e.call(cards_1);
                            }
                            finally { if (e_12) throw e_12.error; }
                            return [7 /*endfinally*/];
                        case 16: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you buy a card with a synergy token other than with this,'
                + ' afterwards buy a different card with a synergy token with equal or lesser cost.',
            kind: 'afterBuy',
            handles: function (e) { return (e.source.id != card.id && e.before.count('synergy') > 0); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                options = state.supply.filter(function (c) { return c.count('synergy') > 0
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
register(makeSynergy);
var bustlingSquare = { name: 'Bustling Square',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+1 card. Set aside all cards in your hand. Play any number of them," +
            " then discard the rest.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var hand, _loop_2, state_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _a.sent();
                            hand = asNumberedChoices(state.hand);
                            return [4 /*yield*/, moveWholeZone('hand', 'aside')(state)];
                        case 2:
                            state = _a.sent();
                            _loop_2 = function () {
                                var target, id_2;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            target = void 0;
                                            return [4 /*yield*/, choice(state, 'Choose which card to play next.', allowNull(hand))];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                            if (!(target == null)) return [3 /*break*/, 2];
                                            return [2 /*return*/, { value: moveMany(hand.map(function (option) { return option.value; }), 'discard')(state) }];
                                        case 2: return [4 /*yield*/, target.play(card)(state)];
                                        case 3:
                                            state = _b.sent();
                                            id_2 = target.id;
                                            hand = hand.filter(function (option) { return option.value.id != id_2; });
                                            _b.label = 4;
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 3;
                        case 3:
                            if (!true) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_2()];
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
        text: "At the beginning of the game, add " + spec.name + " to the supply" +
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+5vp',
        effect: gainPoints(5),
    }); }
};
var buyColony = { name: 'Colony',
    fixedCost: coin(16),
    effect: function (card) { return gainCard(colony); },
    triggers: function (card) { return [ensureInSupply(buyPlatinum)]; },
    relatedCards: [colony],
};
register(buyColony);
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$5',
        effect: gainCoin(5)
    }); }
};
var buyPlatinum = { name: 'Platinum',
    fixedCost: coin(10),
    effect: function (card) { return gainCard(platinum); },
    triggers: function (card) { return [ensureInSupply(buyColony)]; },
    relatedCards: [platinum],
};
register(buyPlatinum);
var windfall = { name: 'Windfall',
    fixedCost: { energy: 0, coin: 6 },
    effect: function (card) { return ({
        text: 'If there are no cards in your deck, create two golds in your discard pile.',
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
            text: 'Remove a charge token from this. If you do, +1 card.',
            cost: discharge(card, 1),
            effect: draw(1, card),
        }]; }
};
var horse = { name: 'Horse',
    fixedCost: coin(2),
    effect: function (card) { return ({
        text: "Put a charge token on a " + stables.name + " in play.",
        effect: fill(stables, 1),
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
};
register(horse);
var lookout = { name: 'Lookout',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Look at the top 3 cards from your deck. Trash one then discard one.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                function pickOne(descriptor, zone, state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var pick, id;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, choice(state, "Pick a card to " + descriptor + ".", picks)];
                                case 1:
                                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], pick = _a[1];
                                    if (pick == null)
                                        return [2 /*return*/, state]; // shouldn't be possible
                                    id = pick.id;
                                    picks = picks.filter(function (pick) { return pick.value.id != id; });
                                    return [2 /*return*/, move(pick, zone)(state)];
                            }
                        });
                    });
                }
                var picks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            picks = asNumberedChoices(state.deck.slice(0, 3));
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
buyable(lookout, 4);
var lab = { name: 'Lab',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+2 cards',
        effect: draw(2)
    }); }
};
buyable(lab, 5);
var expressway = { name: 'Expressway',
    fixedCost: energy(0),
    triggers: function (_) { return [{
            text: "Whenever you create a card," +
                " if it's in your discard pile then move it to the top of your deck.",
            kind: 'create',
            handles: function (e, state) { return (state.find(e.card).place == 'discard'); },
            effect: function (e) { return move(e.card, 'deck', 'top'); }
        }]; }
};
register(makeCard(expressway, coin(5), true));
var formation = { name: 'Formation',
    fixedCost: energy(0),
    triggers: function (card) { return [{
            text: "When you finish playing a card other than with " + formation.name + ", if it costs @ or more then you may play a card in your hand with the same name.",
            kind: 'afterPlay',
            handles: function (e) { return (e.source.name != formation.name); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cardOptions, replay;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (e.before.cost(state).energy == 0)
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
register(makeCard(formation, { energy: 0, coin: 6 }));
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: '+5 cards',
        effect: draw(5),
    }); }
};
buyable(greatSmithy, 5);
var reuse = { name: 'Reuse',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: 'Put a card from your discard into your hand. Put a charge token on this.',
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
var remake = { name: 'Remake',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +1 card per card that was in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.hand.length;
                    return [2 /*return*/, reboot(card, n)(state)];
                });
            });
        }
    }); }
};
mixins.push(remake);
var bootstrap = { name: 'Bootstrap',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Recycle your discard pile, recycle your hand, lose all $, and +2 cards.',
        effect: reboot(card, 2)
    }); }
};
mixins.push(bootstrap);
var pressOn = { name: 'Press On',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Discard your hand, lose all $, and +5 cards.',
        effect: doAll([
            setCoin(0),
            moveWholeZone('hand', 'discard'),
            draw(5, pressOn)
        ])
    }); }
};
mixins.push(pressOn);
var seek = { name: 'Seek',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: 'Put a card from your deck into your hand. Put a charge token on this.',
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
mixins.push(seek);
var innovation = { name: "Innovation",
    triggers: function (card) { return [{
            text: "Whenever you create a card, if it's in your discard pile and this has a charge token on it," +
                " remove all charge tokens and play the card.",
            kind: 'create',
            handles: function (e, state) { return (card.charge > 0 && state.find(e.card).place == 'discard'); },
            effect: function (e) { return doAll([
                uncharge(card),
                e.card.play(card)
            ]); },
        }, {
            text: "Whenever you draw 5 or more cards, put a charge token on this.",
            kind: 'draw',
            handles: function (e) { return e.cards.length >= 5; },
            effect: function (e) { return charge(card, 1); },
        }]; }
};
register(makeCard(innovation, { coin: 9, energy: 2 }, true));
var citadel = { name: "Citadel",
    triggers: function (card) { return [{
            text: "Wheneve you draw 5 or more cards, put a charge token on this.",
            kind: 'draw',
            handles: function (e) { return e.cards.length >= 5; },
            effect: function (e) { return charge(card, 1); }
        }, {
            text: "After playing a card other the normal way, if there's a charge token on this," +
                " remove all charge tokens and play the card again if it's in your discard pile.",
            kind: 'afterPlay',
            handles: function (e, state) { return (e.source.name == 'act'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                result = state.find(card);
                                if (!(result.found && result.card.charge > 0)) return [3 /*break*/, 3];
                                card = result.card;
                                return [4 /*yield*/, uncharge(card)(state)];
                            case 1:
                                state = _a.sent();
                                if (!(e.after != null && state.find(e.after).place == 'discard')) return [3 /*break*/, 3];
                                return [4 /*yield*/, e.after.play(card)(state)];
                            case 2:
                                state = _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]; }
};
register(makeCard(citadel, { coin: 8, energy: 0 }, true));
var foolsGold = { name: "Fool's Gold",
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: "+$4 if there is " + a(foolsGold.name) + " in your discard pile, otherwise +$1.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.discard.filter(function (x) { return x.name == card.name; }).length;
                    return [2 /*return*/, gainCoin(n > 0 ? 4 : 1)(state)];
                });
            });
        }
    }); }
};
buyable(foolsGold, 3);
var hireling = { name: 'Hireling',
    fixedCost: energy(0),
    replacers: function (card) { return [{
            text: "Whenever you draw a card from Regroup, draw an additional card.",
            kind: 'draw',
            handles: function (x) { return x.source.name == regroup.name; },
            replace: function (x) { return (__assign(__assign({}, x), { draw: x.draw + 1 })); }
        }]; }
};
register(makeCard(hireling, { coin: 6, energy: 1 }));
var sacrifice = { name: 'Sacrifice',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Play a card in your hand, then trash it.',
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
    fixedCost: energy(1),
    effect: function (_) { return ({
        text: 'Discard 2 cards from your hand. +$5.',
        effect: doAll([discard(2), gainCoin(5)])
    }); }
};
buyable(horseTraders, 4);
var purge = { name: 'Purge',
    fixedCost: energy(5),
    effect: function (card) { return ({
        text: 'Trash any number of cards from your hand. Trash this.',
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
    fixedCost: energy(1),
    effect: function (_) { return ({
        text: 'Trash up to four cards from your hand.',
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$1 per copper in your hand.',
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
    var e_13, _a;
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
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return result;
}
var harvest = { name: 'Harvest',
    fixedCost: energy(1),
    effect: function (_) { return ({
        text: '+$1 per differently named card in your hand, up to +$4.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, gainCoin(Math.min(4, countDistinct(state.hand.map(function (x) { return x.name; }))))(state)];
                });
            });
        }
    }); }
};
buyable(harvest, 3);
var fortify = { name: 'Fortify',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Put your discard pile in your hand. Trash this.',
        effect: moveWholeZone('discard', 'hand'),
        toZone: null,
    }); }
};
var gainFortify = { name: 'Fortify',
    fixedCost: coin(5),
    effect: function (card) { return ({
        text: "Create " + a(fortify.name) + " in your discard pile. Discard your hand.",
        effect: doAll([create(fortify, 'discard'), moveWholeZone('hand', 'discard')])
    }); },
    relatedCards: [fortify],
};
mixins.push(gainFortify);
var explorer = { name: "Explorer",
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: "Create " + a(silver.name) + " in your hand." +
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
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: "Choose a card in your hand. Play it, " +
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
    fixedCost: { energy: 1, coin: 0 },
    effect: function (card) { return ({
        text: "+1 vp per 5 cards in your deck.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.deck.length;
                    return [2 /*return*/, gainPoints(Math.floor(n / 5))(state)];
                });
            });
        }
    }); }
};
buyable(gardens, 7);
var pathfinding = { name: 'Pathfinding',
    fixedCost: { coin: 5, energy: 1 },
    effect: function (card) { return ({
        text: 'Put a path token on a card in your hand.',
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
            text: 'Whenever you play a card, draw a card per path token on it.',
            kind: 'play',
            handles: function (e) { return e.card.count('path') > 0; },
            effect: function (e) { return draw(e.card.count('path')); }
        }]; },
};
register(pathfinding);
var offering = { name: 'Offering',
    effect: function (card) { return ({
        text: 'Play a card from your deck, then trash it.',
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
buyable(offering, 5);
var decay = { name: 'Decay',
    fixedCost: coin(2),
    effect: function (card) { return ({
        text: 'Remove a decay token from each card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.hand.map(function (x) { return removeOneToken(x, 'decay'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you recycle a card, put a decay token on it.',
            kind: 'recycle',
            handles: function () { return true; },
            effect: function (e) { return doAll(e.cards.map(function (c) { return addToken(c, 'decay'); })); }
        }, {
            text: 'After you play a card, if it has 3 or more decay tokens on it trash it.',
            kind: 'afterPlay',
            handles: function (e) { return (e.after != null && e.after.count('decay') >= 3); },
            effect: function (e) { return trash(e.after); },
        }]; }
};
register(decay);
var perpetualMotion = { name: 'Perpetual Motion',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "If you have no cards in hand, +2 cards.",
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
        text: '+1 card. Discard any number of cards from the top of your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var index;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, draw(1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to discard (along with everything above it).', allowNull(state.deck.map(function (x, i) { return ({ render: state.deck[i].id, value: i }); })))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], index = _a[1];
                            return [2 /*return*/, (index == null) ? state : moveMany(state.deck.slice(0, index + 1), 'discard')(state)];
                    }
                });
            });
        }
    }); }
};
buyable(looter, 2);
var scavenger = { name: 'Scavenger',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$2. Put up to three cards from your discard pile on top of your deck.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var targets;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, gainCoin(2)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, multichoice(state, 'Choose up to three cards to put on top of your deck.', state.discard.map(asChoice), function (xs) { return xs.length <= 3; })];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                            return [2 /*return*/, moveMany(targets, 'deck', 'top')(state)];
                    }
                });
            });
        }
    }); }
};
buyable(scavenger, 4);
var reflect = { name: 'Reflect',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Play a card in your hand. Then if it's in your discard pile, play it again." +
            " Put a charge token on this.",
        effect: doAll([charge(card, 1), playTwice(card)])
    }); }
};
register(reflect);
//TODO: add
var cleanse = { name: 'Offering',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Trash a card in your hand. Put a charge token on this.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to trash', state.hand.map(asChoice))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, trash(target)(state)];
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
//TODO: add
var replicate = { name: 'Replicate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Create a copy of a card in your hand in your discard pile. Put a charge count on this.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to replicate.', state.hand.map(asChoice))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, create(target.spec, 'discard')(state)];
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
var coffers = { name: 'Coffers',
    abilities: function (card) { return [{
            text: 'Remove a charge token from this. If you do, +$1.',
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
        text: "At the start of the game, create " + a(spec.name) + " in play if there isn't one.",
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
        text: "Put two charge tokens on a " + coffers.name + " in play.",
        effect: fill(coffers, 2)
    }); },
    triggers: function (card) { return [ensureInPlay(coffers)]; }
};
register(fillCoffers);
var cotr = { name: 'Coin of the Realm',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$1. Put this in play.',
        toZone: 'play',
        effect: doAll([gainCoin(1)])
    }); },
    abilities: function (card) { return [{
            text: villagestr(2) + " Discard this.",
            cost: noop,
            effect: doAll([freeActions(2, card), move(card, 'discard')]),
        }]; }
};
buyable(cotr, 3);
var mountainVillage = { name: 'Mountain Village',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "You may play a card in your hand or discard pile costing up to @." +
            " You may play a card in your hand costing up to @.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                function playOne(cards) {
                    return function (state) {
                        return __awaiter(this, void 0, void 0, function () {
                            var options, target;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        options = cards.filter(function (card) { return (card.cost(state).energy <= 1); }).map(asChoice);
                                        return [4 /*yield*/, choice(state, 'Choose a card costing up to @ to play', allowNull(options))];
                                    case 1:
                                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                        if (!(target != null)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, target.play()(state)];
                                    case 2:
                                        state = _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/, state];
                                }
                            });
                        });
                    };
                }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, playOne(state.hand.concat(state.discard))(state)];
                        case 1:
                            state = _a.sent();
                            state = tick(card)(state);
                            return [4 /*yield*/, playOne(state.hand)(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, state];
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
        text: "Put two charge tokens on a " + stables.name + " in play.",
        effect: fill(stables, 2),
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
};
//register(fillStables)
var savings = { name: 'Savings',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "Put three charge tokens on a " + coffers.name + " in play.",
        effect: fill(coffers, 3),
    }); }
};
buyableAnd(savings, 3, [ensureInPlay(coffers)]);
var duchess = { name: 'Duchess',
    calculatedCost: {
        calculate: function (card, state) { return energy(state.hand.some(function (c) { return c.name == duchy.name; }) ? 0 : 1); },
        text: "This costs @ less if you have a " + duchy.name + " in your hand.",
    },
    effect: function (card) { return ({
        text: "Draw two cards.",
        effect: draw(2)
    }); }
};
buyable(duchess, 3);
var oasis = { name: 'Oasis',
    effect: function (card) { return ({
        text: "+1 card. You may discard a card to add a charge token to a " + coffers.name + " in play.",
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
var desperation = { name: 'Desperation',
    fixedCost: energy(1),
    effect: function (card) { return ({ text: '+$1', effect: gainCoin(1) }); }
};
register(desperation);
var duke = { name: 'Duke',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+1 vp per duchy in your hand or discard pile.",
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
            text: 'Cards in the supply that cost at least $1 cost $1 more.',
            kind: 'cost',
            handles: function (p, state) { return (p.cost.coin >= 1 && state.find(p.card).place == 'supply'); },
            replace: function (p) { return (__assign(__assign({}, p), { cost: { coin: p.cost.coin + 1, energy: p.cost.energy } })); }
        }]; }
};
var makeInflation = { name: 'Inflation',
    fixedCost: energy(3),
    relatedCards: [inflation],
    effect: function (card) { return ({
        text: "+$15. Create an " + inflation.name + " in play. Trash this.",
        effect: doAll([gainCoin(15), create(inflation, 'play'), trash(card)]),
    }); }
};
register(makeInflation);
var publicWorksReduction = { name: 'Public Works',
    replacers: function (card) { return [{
            text: "Cards in the supply cost @ less, but not 0.",
            kind: 'cost',
            handles: function (e, state) { return state.find(e.card).place == 'supply'; },
            replace: function (e) { return (__assign(__assign({}, e), { cost: reduceEnergyNonzero(e.cost, 1) })); }
        }]; },
    triggers: function (card) { return [{
            text: "When you buy a card, trash this.",
            kind: 'buy',
            handles: function () { return true; },
            effect: function (e) { return trash(card); }
        }]; }
};
var publicWorks = { name: 'Public Works',
    effect: function (card) { return ({
        text: "The next card you buy costs @ less, but not 0.",
        effect: create(publicWorksReduction, 'play')
    }); }
};
buyable(publicWorks, 5);
var sleigh = { name: 'Sleigh',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "Put two charge tokens on a " + stables.name + " in play.",
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
            text: "Whenever you create a card, "
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
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Put a ferry token on a supply.',
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
    return { coin: Math.max(cost.coin - n, 0), energy: cost.energy };
}
function reduceEnergy(cost, n) {
    return { energy: Math.max(cost.energy - n, 0), coin: cost.coin };
}
function isZeroCost(cost) {
    return cost.coin == 0 && cost.energy == 0;
}
function reduceCoinNonzero(cost, n) {
    var newCost = reduceCoin(cost, n);
    return (isZeroCost(newCost)) ? cost : newCost;
}
function reduceEnergyNonzero(cost, n) {
    var newCost = reduceEnergy(cost, n);
    return (isZeroCost(newCost)) ? cost : newCost;
}
var makeFerry = { name: 'Ferry',
    fixedCost: coin(3),
    relatedCards: [ferry],
    effect: function (card) { return gainCard(ferry); },
    replacers: function (card) { return [{
            text: 'Cards cost $1 less per ferry token on them, unless it would make them cost 0.',
            kind: 'cost',
            handles: function (p) { return p.card.count('ferry') > 0; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reduceCoinNonzero(p.cost, p.card.count('ferry')) })); }
        }]; }
};
register(makeFerry);
//TODO: keep updating names
var horsemanship = { name: 'Horsemanship',
    replacers: function (card) { return [{
            text: "Whenever you would draw cards other than with " + stables.name + "," +
                (" put that many charge tokens on a " + stables.name + " in play instead."),
            kind: 'draw',
            handles: function (x) { return (x.source.name != stables.name); },
            replace: function (x) { return (__assign(__assign({}, x), { draw: 0, effects: x.effects.concat([fill(stables, x.draw)]) })); }
        }]; }
};
var makeHorsemanship = { name: 'Horsemanship',
    fixedCost: energy(4),
    relatedCards: [horsemanship, stables],
    effect: function (card) { return ({
        text: "Create " + a(horsemanship.name) + " in play. Trsh this.",
        effect: doAll([create(horsemanship, 'play'), trash(card)])
    }); },
    triggers: function (card) { return [ensureInPlay(stables)]; },
};
register(makeHorsemanship);
var wasteland = { name: 'Wasteland',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+1 card.',
        effect: draw(1)
    }); }
};
var stripMine = { name: 'Strip Mine',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: "+$6. Create a " + wasteland.name + " in your discard pile.",
        effect: doAll([gainCoin(6), create(wasteland, 'discard')])
    }); },
    relatedCards: [wasteland],
};
buyable(stripMine, 4);
var burden = { name: 'Burden',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Remove a burden token from a card in the supply',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supply.filter(function (x) { return x.count('burden') > 0; });
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
            text: 'Whenever you buy a card costing $, put a burden token on it.',
            kind: 'buy',
            handles: function (e, state) { return (e.card.cost(state).coin >= 1); },
            effect: function (e) { return addToken(e.card, 'burden'); }
        }]; },
    replacers: function (card) { return [{
            kind: 'cost',
            text: 'Cards cost $1 more for each burden token on them.',
            handles: function (x) { return x.card.count('burden') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { cost: { energy: x.cost.energy, coin: x.cost.coin + x.card.count('burden') } })); }
        }]; }
};
register(burden);
var goldsmith = { name: 'Goldsmith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+2 cards. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    }); }
};
buyable(goldsmith, 7);
var chancellor = { name: 'Chancellor',
    effect: function (card) { return ({
        text: '+$2. You may discard your deck.',
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
            text: 'Whenever you draw 5 or more cards, play cards from your hand with total cost up to @.',
            kind: 'draw',
            handles: function (e) { return e.drawn >= 5; },
            effect: function (e) { return freeActions(1, card); }
        }]; }
};
register(makeCard(barracks, coin(5)));
var composting = { name: 'Composting',
    triggers: function (card) { return [{
            text: 'Whenever you gain energy, you may recycle that many cards from your discard pile.',
            kind: 'gainEnergy',
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
register(makeCard(composting, coin(4)));
// ------------------ Testing -------------------
var freeMoney = { name: 'Free money',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$100',
        effect: gainCoin(100)
    }); }
};
cheats.push(freeMoney);
var freeTutor = { name: 'Free tutor',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Put any card from your deck or discard pile into your hand.',
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
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Draw a card.',
        effect: draw(1),
    }); }
};
cheats.push(freeDraw);
var freeTrash = { name: 'Free trash',
    effect: function (card) { return ({
        text: 'Trash any number of cards in your hand, deck, and discard pile.',
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
var freePoints = { name: 'Free points',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+10vp',
        effect: gainPoints(10),
    }); }
};
cheats.push(freePoints);
var drawAll = { name: 'Draw all',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Put all cards from your deck and discard pile into your hand.',
        effect: doAll([moveWholeZone('discard', 'hand'), moveWholeZone('deck', 'hand')]),
    }); }
};
cheats.push(drawAll);
//# sourceMappingURL=logic.js.map