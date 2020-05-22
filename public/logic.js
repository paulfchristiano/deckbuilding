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
export var VERSION = "0.3.1";
// ----------------------------- Formatting
export function renderCost(cost) {
    var e_1, _a;
    var parts = [];
    try {
        for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
            var name_1 = allCostResources_1_1.value;
            var x = cost[name_1];
            if (x != undefined && x > 0)
                parts.push(renderResource(name_1, x));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return parts.join(' ');
}
function renderResource(resource, amount) {
    if (amount < 0)
        return '-' + renderResource(resource, -amount);
    switch (resource) {
        case 'coin': return "$" + amount;
        case 'energy': return repeatSymbol('@', amount);
        case 'points': return amount + " vp";
        case 'draws': return amount + " card" + (amount == 1 ? '' : 's');
        case 'buys': return amount + " buy" + (amount == 1 ? '' : 's');
        default: assertNever(resource);
    }
}
export function renderEnergy(amount) {
    return renderResource('energy', amount);
}
function repeatSymbol(s, n) {
    var parts = [];
    for (var i = 0; i < n; i++) {
        parts.push(s);
    }
    return parts.join('');
}
var free = { coin: 0, energy: 0, draws: 0, buys: 0, effects: [] };
function addCosts(a, b) {
    return {
        coin: a.coin + (b.coin || 0),
        energy: a.energy + (b.energy || 0),
        draws: a.draws + (b.draws || 0),
        buys: a.buys + (b.buys || 0),
        effects: a.effects.concat(b.effects || []),
    };
}
function multiplyCosts(c, n) {
    var e_2, _a;
    var result = {};
    try {
        for (var allCostResources_2 = __values(allCostResources), allCostResources_2_1 = allCostResources_2.next(); !allCostResources_2_1.done; allCostResources_2_1 = allCostResources_2.next()) {
            var resource = allCostResources_2_1.value;
            var r = c[resource];
            if (r != undefined)
                result[resource] = n * r;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (allCostResources_2_1 && !allCostResources_2_1.done && (_a = allCostResources_2.return)) _a.call(allCostResources_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    if (c.effects != undefined) {
        result.effects = [];
        for (var i = 0; i < n; i++) {
            result.effects = result.effects.concat(c.effects);
        }
    }
    return result;
}
function subtractCost(c, reduction) {
    return {
        coin: Math.max(0, c.coin - (reduction.coin || 0)),
        energy: Math.max(0, c.energy - (reduction.energy || 0)),
        draws: Math.max(0, c.draws - (reduction.draws || 0)),
        buys: Math.max(0, c.buys - (reduction.buys || 0)),
        effects: c.effects,
    };
}
function eq(a, b) {
    return a.coin == b.coin && a.energy == b.energy && a.draws == b.draws;
}
var unk = { name: '?' }; //Used as a default when we don't know the source
function read(x, k, fallback) {
    return (x[k] == undefined) ? fallback : x[k];
}
//TODO: should Token be a type? can avoid token name typos...
//(could also have token rendering hints...)
var Card = /** @class */ (function () {
    function Card(spec, id, ticks, tokens, place, 
    // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
    zoneIndex) {
        if (ticks === void 0) { ticks = [0]; }
        if (tokens === void 0) { tokens = new Map(); }
        if (place === void 0) { place = null; }
        if (zoneIndex === void 0) { zoneIndex = 0; }
        this.spec = spec;
        this.id = id;
        this.ticks = ticks;
        this.tokens = tokens;
        this.place = place;
        this.zoneIndex = zoneIndex;
        this.name = spec.name;
        this.charge = this.count('charge');
    }
    Card.prototype.toString = function () {
        return this.name;
    };
    Card.prototype.update = function (newValues) {
        return new Card(this.spec, this.id, (newValues.ticks == undefined) ? this.ticks : newValues.ticks, (newValues.tokens == undefined) ? this.tokens : newValues.tokens, (newValues.place == undefined) ? this.place : newValues.place, (newValues.zoneIndex == undefined) ? this.zoneIndex : newValues.zoneIndex);
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
            return free;
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
                var cost;
                return __generator(this, function (_a) {
                    state = state.log("Paying for " + card.name);
                    cost = card.cost(state);
                    return [2 /*return*/, withTracking(payCost(cost, card), { kind: 'effect', card: card })(state)];
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
        if (source === void 0) { source = unk; }
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            card = state.find(card);
                            if (card.place == null)
                                return [2 /*return*/, state];
                            state = state.log("Buying " + card.name);
                            return [4 /*yield*/, withTracking(doAll([
                                    trigger({ kind: 'buy', card: card, source: source }),
                                    card.effect().effect,
                                ]), { kind: 'effect', card: card })(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, trigger({ kind: 'afterBuy', card: card, source: source })(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        };
    };
    Card.prototype.play = function (source) {
        if (source === void 0) { source = unk; }
        var effect = this.effect();
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var toZone, toLoc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            card = state.find(card);
                            if (card.place == null)
                                return [2 /*return*/, state];
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
                            toZone = (effect['toZone'] === undefined) ? 'discard' : effect['toZone'];
                            toLoc = effect['toLoc'] || 'end';
                            return [4 /*yield*/, move(card, toZone, toLoc, toZone == 'discard')(state)];
                        case 3:
                            state = _a.sent();
                            return [4 /*yield*/, trigger({ kind: 'afterPlay', card: card, source: source })(state)];
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
    Card.prototype.buyable = function (state) {
        if (this.spec.buyable == undefined)
            return true;
        return this.spec.buyable.test(this, state);
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
var allCostResources = ['coin', 'energy', 'draws', 'buys'];
var allResources = allCostResources.concat(['points']);
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
    function State(spec, ui, resources, zones, resolving, nextID, history, future, checkpoint, logs, logIndent) {
        if (spec === void 0) { spec = { seed: '', kingdom: null }; }
        if (ui === void 0) { ui = noUI; }
        if (resources === void 0) { resources = { coin: 0, energy: 0, points: 0, draws: 0, buys: 0 }; }
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
        this.resources = resources;
        this.zones = zones;
        this.resolving = resolving;
        this.nextID = nextID;
        this.history = history;
        this.future = future;
        this.checkpoint = checkpoint;
        this.logs = logs;
        this.logIndent = logIndent;
        this.coin = resources.coin;
        this.energy = resources.energy;
        this.points = resources.points;
        this.draws = resources.draws;
        this.buys = resources.buys;
        this.supply = zones.get('supply') || [];
        this.hand = zones.get('hand') || [];
        this.discard = zones.get('discard') || [];
        this.play = zones.get('play') || [];
        this.aside = zones.get('aside') || [];
        this.events = zones.get('events') || [];
    }
    State.prototype.update = function (stateUpdate) {
        return new State(this.spec, read(stateUpdate, 'ui', this.ui), read(stateUpdate, 'resources', this.resources), read(stateUpdate, 'zones', this.zones), read(stateUpdate, 'resolving', this.resolving), read(stateUpdate, 'nextID', this.nextID), read(stateUpdate, 'history', this.history), read(stateUpdate, 'future', this.future), read(stateUpdate, 'checkpoint', this.checkpoint), read(stateUpdate, 'logs', this.logs), read(stateUpdate, 'logIndent', this.logIndent));
    };
    State.prototype.getZone = function (zone) {
        return this.zones.get(zone) || [];
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
    State.prototype.sortZone = function (zone) {
        var newZones = new Map(this.zones);
        var newZone = (this.zones.get(zone) || []).slice();
        newZone.sort(function (a, b) { return (a.name.localeCompare(b.name)); });
        newZone = newZone.map(function (x, i) { return x.update({ zoneIndex: i }); });
        newZones.set(zone, newZone);
        return this.update({ zones: newZones });
    };
    State.prototype.addToZone = function (card, zone, loc) {
        if (loc === void 0) { loc = 'end'; }
        if (zone == 'resolving')
            return this.addResolving(card);
        var newZones = new Map(this.zones);
        var currentZone = this[zone];
        card = card.update({ zoneIndex: firstFreeIndex(currentZone), place: zone });
        newZones.set(zone, insertAt(currentZone, card, loc));
        return this.update({ zones: newZones });
    };
    State.prototype.remove = function (card) {
        var e_3, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones.set(name_2, zone.filter(function (c) { return c.id != card.id; }));
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return this.update({ zones: newZones, resolving: this.resolving.filter(function (c) { return c.id != card.id; }) });
    };
    State.prototype.apply = function (f, card) {
        var e_4, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_3 = _d[0], zone = _d[1];
                newZones.set(name_3, zone.map(function (c) { return (c.id == card.id) ? f(c) : c; }));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
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
    State.prototype.addShadow = function (spec) {
        var _a;
        var state = this;
        var id;
        _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
        var shadow = new Shadow(id, spec);
        return state.addResolving(shadow);
    };
    State.prototype.setResources = function (resources) {
        return this.update({ resources: resources });
    };
    State.prototype.find = function (card) {
        var e_5, _a;
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_4 = _d[0], zone_1 = _d[1];
                var matches_1 = zone_1.filter(function (c) { return c.id == card.id; });
                if (matches_1.length > 0)
                    return matches_1[0];
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var name = 'resolving', zone = this.resolving;
        var matches = zone.filter(function (c) { return c.id == card.id; });
        if (matches.length > 0)
            return matches[0];
        return card.update({ place: null });
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
    State.prototype.serializeHistory = function () {
        var state = this;
        var prev = state;
        while (prev != null) {
            state = prev;
            prev = state.backup();
        }
        return [VERSION].concat(state.future.map(function (xs) { return xs.map(function (x) { return "" + x; }).join(','); })).join(';');
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
        var _a;
        var historyVersion;
        var pieces;
        _a = __read(shiftFirst(s.split(';')), 2), historyVersion = _a[0], pieces = _a[1];
        if (VERSION != historyVersion) {
            throw new VersionMismatch(historyVersion || 'null');
        }
        function renderPiece(piece) {
            if (piece == '')
                return [];
            return piece.split(',').map(function (x) { return parseInt(x); });
        }
        var future = pieces.map(renderPiece);
        return initialState(spec).update({ future: future });
    };
    return State;
}());
export { State };
var VersionMismatch = /** @class */ (function (_super) {
    __extends(VersionMismatch, _super);
    function VersionMismatch(historyVersion) {
        var _this = _super.call(this, "Current version " + VERSION + " does not match replay version " + historyVersion) || this;
        _this.historyVersion = historyVersion;
        Object.setPrototypeOf(_this, VersionMismatch.prototype);
        return _this;
    }
    return VersionMismatch;
}(Error));
export { VersionMismatch };
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
    var e_6, _a, _b;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    try {
        for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
            var spec = specs_1_1.value;
            var card = void 0;
            _b = __read(createRaw(state, spec, zone, loc), 2), state = _b[0], card = _b[1];
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return state;
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, _a, _b, card, _c, _d, rawtrigger, trigger_1, e_7_1, e_8_1;
            var e_8, _e, e_7, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        initialState = state;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 12, 13, 14]);
                        _a = __values(state.events.concat(state.supply).concat(state.play)), _b = _a.next();
                        _g.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 11];
                        card = _b.value;
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 8, 9, 10]);
                        _c = (e_7 = void 0, __values(card.triggers())), _d = _c.next();
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
                        e_7_1 = _g.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_8_1 = _g.sent();
                        e_8 = { error: e_8_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                        }
                        finally { if (e_8) throw e_8.error; }
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
    var e_9, _a;
    var replacers = state.events.concat(state.supply).concat(state.play).map(function (x) { return x.replacers(); }).flat();
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
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_a = replacers_1.return)) _a.call(replacers_1);
        }
        finally { if (e_9) throw e_9.error; }
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
function create(spec, zone, loc, postprocess) {
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    if (postprocess === void 0) { postprocess = function () { return noop; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var card;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(createRaw(state, spec, zone, loc), 2), state = _a[0], card = _a[1];
                        state = state.log("Created " + a(card.name) + " in " + zone);
                        return [4 /*yield*/, trigger({ kind: 'create', card: card, zone: zone })(state)];
                    case 1:
                        state = _b.sent();
                        return [2 /*return*/, postprocess(card)(state)];
                }
            });
        });
    };
}
function move(card, toZone, loc, logged) {
    if (loc === void 0) { loc = 'end'; }
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b, effect, e_10_1;
            var e_10, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        card = state.find(card);
                        if (card.place == null)
                            return [2 /*return*/, state];
                        params = { kind: 'move', card: card, fromZone: card.place, toZone: toZone, effects: [], skip: false };
                        params = replace(params, state);
                        if (!!params.skip) return [3 /*break*/, 2];
                        toZone = params.toZone;
                        card = params.card;
                        state = state.remove(card);
                        if (toZone == null) {
                            if (!logged)
                                state = state.log("Trashed " + card.name + " from " + card.place);
                        }
                        else {
                            state = state.addToZone(card, toZone, loc);
                            if (!logged)
                                state = state.log("Moved " + card.name + " from " + card.place + " to " + toZone);
                        }
                        return [4 /*yield*/, trigger({ kind: 'move', fromZone: card.place, toZone: toZone, loc: loc, card: card })(state)];
                    case 1:
                        state = _d.sent();
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 9]);
                        _a = __values(params.effects), _b = _a.next();
                        _d.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        effect = _b.value;
                        return [4 /*yield*/, effect(state)];
                    case 4:
                        state = _d.sent();
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_10_1 = _d.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_10) throw e_10.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, state];
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
function trash(card, logged) {
    if (logged === void 0) { logged = false; }
    return (card == null) ? noop : move(card, null, 'end', logged);
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
function payCost(c, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, effect, e_11_1;
            var e_11, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (state.coin < c.coin)
                            throw new CostNotPaid("Not enough coin");
                        if (state.draws < c.draws)
                            throw new CostNotPaid("Not enough draws");
                        if (state.buys < c.buys)
                            throw new CostNotPaid("Not enough buys");
                        state = state.setResources({
                            coin: state.coin - c.coin,
                            draws: state.draws - c.draws,
                            buys: state.buys - c.buys,
                            energy: state.energy + c.energy,
                            points: state.points
                        });
                        if (renderCost(c) != '')
                            state = state.log("Paid " + renderCost(c));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(c.effects), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        effect = _b.value;
                        return [4 /*yield*/, effect(state)];
                    case 3:
                        state = _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_11_1 = _d.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, trigger({ kind: 'cost', cost: c, source: source })(state)];
                }
            });
        });
    };
}
function gainResource(resource, amount, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var newResources;
            return __generator(this, function (_a) {
                if (amount == 0)
                    return [2 /*return*/, state];
                newResources = {
                    coin: state.coin,
                    energy: state.energy,
                    points: state.points,
                    draws: state.draws,
                    buys: state.buys,
                };
                newResources[resource] = newResources[resource] + amount;
                state = state.setResources(newResources);
                state = state.log(amount > 0 ?
                    "Gained " + renderResource(resource, amount) :
                    "Lost " + renderResource(resource, -amount));
                return [2 /*return*/, trigger({ kind: 'resource', resource: resource, amount: amount, source: source })(state)];
            });
        });
    };
}
function setResource(resource, amount, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource(resource, amount - state[resource], source)(state)];
            });
        });
    };
}
function gainCards(n, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource('draws', n, source)(state)];
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
function gainEnergy(n, source) {
    if (source === void 0) { source = unk; }
    return gainResource('energy', n, source);
}
function gainPoints(n, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gainResource('points', n, source)(state)];
                    case 1:
                        state = _a.sent();
                        if (state.points >= 40)
                            throw new Victory(state);
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
function gainCoin(n, source) {
    if (source === void 0) { source = unk; }
    return gainResource('coin', n, source);
}
function gainBuys(n, source) {
    if (source === void 0) { source = unk; }
    return gainResource('buys', n, source);
}
var gainBuy = gainBuys(1);
function draw(n, source) {
    if (source === void 0) { source = unk; }
    return gainResource('draws', n, source);
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        card = state.find(card);
                        if (!(card.place != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, charge(card, -card.charge)(state)];
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
            var oldCharge, newCharge;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null) {
                    if (cost)
                        throw new CostNotPaid("card no longer exists");
                    return [2 /*return*/, state];
                }
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
            var newCard;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null)
                    return [2 /*return*/, state];
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
            var removed, newCard;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null)
                    return [2 /*return*/, state];
                removed = card.count(token);
                newCard = card.setTokens(token, 0);
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, -removed);
                return [2 /*return*/, trigger({ kind: 'removeTokens', card: newCard, token: token, removed: removed })(state)];
            });
        });
    };
}
function removeToken(card, token) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var removed, newCard;
            return __generator(this, function (_a) {
                removed = 0;
                card = state.find(card);
                if (card.place == null)
                    return [2 /*return*/, state];
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
                    if (indices.some(function (x) { return x >= options.length; }))
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
        var e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, playGame(State.fromHistory(history, { seed: seed, kingdom: null }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, [true, ""]]; //unreachable
                case 2:
                    e_12 = _a.sent();
                    if (e_12 instanceof Victory) {
                        if (e_12.state.energy == score)
                            return [2 /*return*/, [true, ""]];
                        else
                            return [2 /*return*/, [false, "Computed score was " + e_12.state.energy]];
                    }
                    else if (e_12 instanceof HistoryMismatch) {
                        return [2 /*return*/, [false, "" + e_12]];
                    }
                    else if (e_12 instanceof VersionMismatch) {
                        return [2 /*return*/, [false, "" + e_12]];
                    }
                    else if (e_12 instanceof ReplayEnded) {
                        return [2 /*return*/, [false, "" + e_12]];
                    }
                    else {
                        throw e_12;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --------------------- act
// This is the 'default' choice the player makes when nothing else is happening
function act(state) {
    return __awaiter(this, void 0, void 0, function () {
        var card, newCard;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], card = _a[1];
                    if (card == null)
                        throw new Error('No valid options.');
                    newCard = state.find(card);
                    switch (newCard.place) {
                        case 'play':
                            return [2 /*return*/, useCard(card)(state)];
                        case 'hand':
                            return [2 /*return*/, tryToPlay(card)(state)];
                        case 'supply':
                            return [2 /*return*/, tryToBuy(card, 'supply')(state)];
                        case 'events':
                            return [2 /*return*/, tryToBuy(card, 'event')(state)];
                        case 'aside':
                        case 'discard':
                        case 'resolving':
                        case null:
                            throw new Error("Card can't be in zone " + newCard.place);
                        default: assertNever(newCard.place);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function canPay(cost, state) {
    return (cost.coin <= state.coin && cost.draws <= state.draws && cost.buys <= state.buys);
}
function canAffordIn(state, extra) {
    if (extra === void 0) { extra = free; }
    return function (x) { return canPay(addCosts(x.cost(state), extra), state); };
}
function actChoice(state) {
    var validHand = state.hand.filter(canAffordIn(state, actCost('play')));
    var validSupplies = state.supply.
        filter(function (x) { return x.buyable(state) && canAffordIn(state, actCost('supply'))(x); });
    var validEvents = state.events.
        filter(function (x) { return x.buyable(state) && canAffordIn(state, actCost('event'))(x); });
    var validPlay = state.play.filter(function (x) { return (x.abilities().length > 0); });
    var cards = validHand.concat(validEvents).concat(validSupplies).concat(validPlay);
    return choice(state, 'Buy an event, use a card in play, pay 1 buy to buy a card from the supply, or pay 1 draw to play a card from your hand.', cards.map(asChoice), false);
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
function actCost(kind) {
    switch (kind) {
        case 'supply': return __assign(__assign({}, free), { buys: 1 });
        case 'event': return free;
        case 'play': return __assign(__assign({}, free), { draws: 1 });
        default: return assertNever(kind);
    }
}
function tryToBuy(card, kind) {
    return payToDo(doAll([payCost(actCost(kind)), card.payCost()]), card.buy({ name: 'act' }));
}
function tryToPlay(card) {
    return payToDo(doAll([payCost(actCost('play')), card.payCost()]), card.play({ name: 'act' }));
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
    var e_13, _a, e_14, _b;
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
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (mixins_1_1 && !mixins_1_1.done && (_a = mixins_1.return)) _a.call(mixins_1);
        }
        finally { if (e_13) throw e_13.error; }
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
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (cardStrings_1_1 && !cardStrings_1_1.done && (_b = cardStrings_1.return)) _b.call(cardStrings_1);
        }
        finally { if (e_14) throw e_14.error; }
    }
    return result;
}
export function initialState(spec) {
    var startingHand = [copper, copper, copper, estate, estate];
    var intSeed = hash(spec.seed);
    var variableSupplies = randomChoices(mixins, 10, intSeed);
    var variableEvents = randomChoices(eventMixins, 4, intSeed + 1);
    var fixedKingdom = getFixedKingdom(spec.kingdom);
    if (fixedKingdom != null)
        variableSupplies = fixedKingdom;
    variableSupplies.sort(supplySort);
    variableEvents.sort(supplySort);
    if (spec.testing) {
        for (var i = 0; i < cheats.length; i++)
            variableEvents.push(cheats[i]);
        variableSupplies = variableSupplies.concat(testSupplies);
        variableEvents = variableEvents.concat(testEvents);
    }
    var kingdom = coreSupplies.concat(variableSupplies);
    var events = coreEvents.concat(variableEvents);
    var state = new State(spec);
    state = createRawMulti(state, kingdom, 'supply');
    state = createRawMulti(state, events, 'events');
    state = createRawMulti(state, startingHand, 'discard');
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
var coreEvents = [];
export var mixins = [];
export var eventMixins = [];
var testSupplies = [];
var testEvents = [];
var cheats = [];
//
// ----------- UTILS -------------------
//
function supplyForCard(card, cost, extra) {
    if (extra === void 0) { extra = {}; }
    return { name: card.name,
        fixedCost: cost,
        effect: function (supply) { return ({
            text: ((extra.text === undefined) ? '' : extra.text + ' ') +
                ("Create " + a(card.name) + " in your discard pile."),
            effect: doAll([create(card), extra.onBuy || noop])
        }); },
        relatedCards: [card],
        triggers: extra.triggers,
        replacers: extra.replacers,
    };
}
function energy(n) {
    return __assign(__assign({}, free), { energy: n });
}
function coin(n) {
    return __assign(__assign({}, free), { coin: n });
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
function registerEvent(card, test) {
    if (test === void 0) { test = null; }
    eventMixins.push(card);
    if (test == 'test')
        testEvents.push(card);
}
//
//
// ------ CORE ------
//
function recycle(state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, moveMany(state.discard, 'hand')(state)];
                case 1:
                    state = _a.sent();
                    return [4 /*yield*/, moveMany(state.play, 'hand')(state)];
                case 2:
                    state = _a.sent();
                    state = state.sortZone('hand');
                    return [2 /*return*/, state];
            }
        });
    });
}
function regroupText(n) {
    return "Lose all $, draws, and buy. Put your discard pile and play into your hand. +" + n + " draws, +1 buy.";
}
function regroupEffect(n) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, setResource('coin', 0)(state)];
                    case 1:
                        state = _a.sent();
                        return [4 /*yield*/, setResource('draws', 0)(state)];
                    case 2:
                        state = _a.sent();
                        return [4 /*yield*/, setResource('buys', 0)(state)];
                    case 3:
                        state = _a.sent();
                        return [4 /*yield*/, recycle(state)];
                    case 4:
                        state = _a.sent();
                        return [4 /*yield*/, draw(n)(state)];
                    case 5:
                        state = _a.sent();
                        return [4 /*yield*/, gainBuy(state)];
                    case 6:
                        state = _a.sent();
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
var regroup = { name: 'Regroup',
    fixedCost: energy(4),
    effect: function (card) { return ({
        text: regroupText(5),
        effect: regroupEffect(5)
    }); }
};
coreEvents.push(regroup);
var copper = { name: 'Copper',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$1',
        effect: gainCoin(1),
    }); }
};
coreSupplies.push(supplyForCard(copper, coin(0)));
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
coreSupplies.push(supplyForCard(estate, coin(2)));
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
function register(card, test) {
    if (test === void 0) { test = null; }
    mixins.push(card);
    if (test == 'test')
        testSupplies.push(card);
}
function buyable(card, n, test) {
    if (test === void 0) { test = null; }
    register(supplyForCard(card, __assign(__assign({}, free), { coin: n })), test);
}
function playAgain(target, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = state.find(target);
                        if (!(target.place == 'discard')) return [3 /*break*/, 2];
                        return [4 /*yield*/, target.play(source)(state)];
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
function descriptorForZone(zone) {
    switch (zone) {
        case 'hand': return 'Cards in your hand';
        case 'supply': return 'Cards in the supply';
        case 'events': return 'Events';
        default: return assertNever(zone);
    }
}
function costReduce(card, zone, reduction) {
    var descriptor = descriptorForZone(zone);
    return {
        text: descriptor + " cost " + renderCost(reduction) + " less.",
        kind: 'cost',
        handles: function () { return true; },
        replace: function (x, state) {
            if (x.card.place == zone)
                return __assign(__assign({}, x), { cost: subtractCost(x.cost, reduction) });
            return x;
        }
    };
}
function costReduceNext(card, zone, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var descriptor = descriptorForZone(zone);
    return {
        text: descriptor + " cost " + renderCost(reduction) + " less" + (nonzero ? ', but not zero.' : '.') + "\n        Whenever this reduces a cost, discard this.",
        kind: 'cost',
        handles: function () { return true; },
        replace: function (x, state) {
            if (x.card.place == zone) {
                var newCost = subtractCost(x.cost, reduction);
                if (nonzero && leq(newCost, free) && !leq(x.cost, free)) {
                    if (reduction.coin || 0 > 0) {
                        newCost = addCosts(newCost, { coin: 1 });
                    }
                    else if (reduction.energy || 0 > 0) {
                        newCost = addCosts(newCost, { energy: 1 });
                    }
                }
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([move(card, 'discard')]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
            }
            return x;
        }
    };
}
function buyableFree(card, coins, test) {
    if (test === void 0) { test = null; }
    var supply = { name: card.name,
        fixedCost: coin(coins),
        effect: function (supply) { return ({
            text: "+1 buy. Create " + a(card.name) + " in your discard pile.",
            effect: doAll([gainBuy, create(card)]),
        }); },
        relatedCards: [card],
    };
    register(supply, test);
}
var necropolis = { name: 'Necropolis',
    effect: function (card) { return ({
        text: 'Put this in play.',
        effect: noop,
        toZone: 'play',
    }); },
    replacers: function (card) { return [costReduceNext(card, 'hand', { energy: 1 })]; },
};
buyableFree(necropolis, 2);
var hound = { name: 'Hound',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+2 draws.',
        effect: gainCards(2),
    }); }
};
buyableFree(hound, 2);
var smithy = { name: 'Smithy',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+3 draws.',
        effect: gainCards(3),
    }); }
};
buyable(smithy, 4);
var village = { name: 'Village',
    effect: cantripPlay,
    replacers: function (card) { return [costReduceNext(card, 'hand', { energy: 1 })]; },
};
buyable(village, 4);
var bridge = { name: 'Bridge',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+1 buy. Put this in play',
        effect: gainResource('buys', 1),
        toZone: 'play'
    }); },
    replacers: function (card) { return [costReduce(card, 'supply', { coin: 1 })]; }
};
buyable(bridge, 6);
var coven = { name: 'Coven',
    effect: justPlay,
    replacers: function (card) { return [{
            text: 'Cards in your hand cost @ less if you have no card with the same name'
                + ' in your discard pile or play.'
                + ' Whenever this reduces a cost, discard this and +$2.',
            kind: 'cost',
            handles: function (e, state) { return (state.discard.concat(state.play).every(function (c) { return c.name != e.card.name; })); },
            replace: function (x, state) {
                if (x.card.place == 'hand') {
                    var newCost = subtractCost(x.cost, { energy: 1 });
                    if (!eq(newCost, x.cost)) {
                        newCost.effects = newCost.effects.concat([move(card, 'discard'), gainCoin(2)]);
                        return __assign(__assign({}, x), { cost: newCost });
                    }
                }
                return x;
            }
        }]; }
};
buyable(coven, 4);
var lab = { name: 'Lab',
    effect: function (card) { return ({
        text: '+2 draws.',
        effect: gainResource('draws', 2),
    }); },
};
buyable(lab, 5);
function justPlay(card) {
    return {
        text: 'Put this in play.',
        toZone: 'play',
        effect: noop
    };
}
function cantripPlay(card) {
    return {
        text: '+1 draw. Put this in play.',
        toZone: 'play',
        effect: gainCards(1),
    };
}
var throneRoom = { name: 'Throne Room',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "Pay 1 draw to play a card in your hand. Then if it's in your discard pile play it again.",
        effect: payToDo(payCost(__assign(__assign({}, free), { draws: 1 })), function (state) {
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
        })
    }); }
};
buyable(throneRoom, 5);
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1),
    effect: justPlay,
    triggers: function (card) { return [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            effect: function (e) { return gainCoin(1); },
        }]; }
};
buyable(coppersmith, 4);
var scavenger = { name: 'Scavenger',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$2. Put a card from your discard pile into yor hand.',
        effect: doAll([
            gainCoin(2),
            applyToTarget(function (c) { return move(c, 'hand'); }, 'Choose a card to put into your hand.', 'discard')
        ])
    }); }
};
buyable(scavenger, 4);
var celebration = { name: 'Celebration',
    fixedCost: energy(2),
    effect: justPlay,
    replacers: function (card) { return [costReduce(card, 'hand', { energy: 1 })]; }
};
buyable(celebration, 10);
var plough = { name: 'Plough',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Put your discard pile and play into your hand.',
        effect: recycle
    }); }
};
buyable(plough, 4);
var construction = { name: 'Construction',
    fixedCost: energy(1),
    effect: justPlay,
    triggers: function (card) { return [{
            text: 'Whenever you pay @, gain twice that many draws.',
            kind: 'cost',
            handles: function () { return true; },
            effect: function (e) { return draw(2 * e.cost.energy); }
        }]; }
};
buyable(construction, 3);
//TODO: I would prefer 'other than with this'
var hallOfMirrors = { name: 'Hall of Mirrors',
    fixedCost: __assign(__assign({}, free), { energy: 2, coin: 5 }),
    effect: function (card) { return ({
        text: 'Put a mirror token on each card in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.hand.map(function (c) { return addToken(c, 'mirror'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you finish playing a card with a mirror token on it other than with this,' +
                " if it's in your discard pile remove a mirror token and play it again.",
            kind: 'afterPlay',
            handles: function (e, state) { return state.find(e.card).count('mirror') > 0 && e.source.name != card.name; },
            effect: function (e) { return doAll([playAgain(e.card, card), removeToken(e.card, 'mirror')]); },
        }]; }
};
registerEvent(hallOfMirrors);
function costPlus(initial, increment) {
    return {
        calculate: function (card, state) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).count('cost')));
        },
        text: renderCost(initial) + " plus " + renderCost(increment) + " for each cost token on this.",
    };
}
var retrench = { name: 'Retrench',
    calculatedCost: costPlus(energy(2), coin(1)),
    effect: function (card) { return ({
        text: 'Put a cost token on this. ' + regroupText(5),
        effect: doAll([addToken(card, 'cost'), regroupEffect(5)])
    }); }
};
registerEvent(retrench);
var respite = { name: 'Respite',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: regroupText(2),
        effect: regroupEffect(2)
    }); }
};
registerEvent(respite);
var perpetualMotion = { name: 'Perpetual Motion',
    fixedCost: energy(2),
    buyable: {
        text: 'You have no cards in hand.',
        test: function (card, state) { return state.hand.length == 0; }
    },
    effect: function (card) { return ({
        text: regroupText(4),
        effect: regroupEffect(4)
    }); }
};
registerEvent(perpetualMotion);
var desperation = { name: 'Desperation',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$1.',
        effect: gainCoin(1),
    }); }
};
registerEvent(desperation);
var travelingFair = { name: 'Traveling Fair',
    fixedCost: coin(2),
    effect: function (card) { return ({
        text: "+1 buy. Put a charge token on this.",
        effect: doAll([gainBuy, charge(card, 1)]),
    }); },
    triggers: function (card) { return [{
            text: "Whenever you create a card, if it's in your discard pile and this has a charge token on it,\n               remove a charge token from this and put the card in your hand",
            kind: 'create',
            handles: function (e, state) { return (card.charge > 0 && state.find(e.card).place == 'discard'); },
            effect: function (e) { return doAll([charge(card, -1), move(e.card, 'hand')]); }
        }]; }
};
registerEvent(travelingFair);
var philanthropy = { name: 'Philanthropy',
    fixedCost: __assign(__assign({}, free), { coin: 10, energy: 2 }),
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
registerEvent(philanthropy);
var storytelling = { name: 'Storytelling',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Lose all $. +1 draw per $ you lost.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            n = state.coin;
                            return [4 /*yield*/, setResource('coin', 0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, draw(n)(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
registerEvent(storytelling);
var monument = { name: 'Monument',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+$2, +1 vp.',
        effect: doAll([gainCoin(2), gainPoints(1)])
    }); }
};
buyable(monument, 2);
var repurpose = { name: 'Repurpose',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Lose all $ and buys. Put your discard pile and play into your deck. +1 buy.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, regroupEffect(state.draws)(state)];
                });
            });
        }
    }); }
};
registerEvent(repurpose);
var vibrantCity = { name: 'Vibrant City',
    effect: function (card) { return ({
        text: '+1 vp, +1 draw.',
        effect: doAll([gainPoints(1), draw(1)])
    }); }
};
buyable(vibrantCity, 6);
var frontier = { name: 'Frontier',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Add a charge token to this if it has less than 6, then +1 vp per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            card = state.find(card);
                            if (!(card.charge < 6)) return [3 /*break*/, 2];
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2:
                            card = state.find(card);
                            if (!(card.place != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, gainPoints(card.charge)(state)];
                        case 3:
                            state = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(frontier, 7);
var investment = { name: 'Investment',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: 'Add a charge token to this if it has less than 5, then +$1 per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            card = state.find(card);
                            if (!(card.charge < 5)) return [3 /*break*/, 2];
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2:
                            card = state.find(card);
                            if (!(card.place != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, gainCoin(card.charge)(state)];
                        case 3:
                            state = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(investment, 4);
var populate = { name: 'Populate',
    fixedCost: __assign(__assign({}, free), { coin: 12, energy: 3 }),
    effect: function (card) { return ({
        text: 'Buy any number of cards in the supply.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var options, options_1, options_1_1, supply_card, e_15_1;
                var e_15, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            options = state.supply.filter(function (c) { return c.id != card.id; });
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 6, 7, 8]);
                            options_1 = __values(options), options_1_1 = options_1.next();
                            _b.label = 2;
                        case 2:
                            if (!!options_1_1.done) return [3 /*break*/, 5];
                            supply_card = options_1_1.value;
                            return [4 /*yield*/, supply_card.buy(card)(state)];
                        case 3:
                            state = _b.sent();
                            _b.label = 4;
                        case 4:
                            options_1_1 = options_1.next();
                            return [3 /*break*/, 2];
                        case 5: return [3 /*break*/, 8];
                        case 6:
                            e_15_1 = _b.sent();
                            e_15 = { error: e_15_1 };
                            return [3 /*break*/, 8];
                        case 7:
                            try {
                                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
                            }
                            finally { if (e_15) throw e_15.error; }
                            return [7 /*endfinally*/];
                        case 8: return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
registerEvent(populate);
var duplicate = { name: 'Duplicate',
    fixedCost: __assign(__assign({}, free), { coin: 5, energy: 1 }),
    effect: function (card) { return ({
        text: "Put a duplicate token on each card in the supply.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.supply.map(function (c) { return addToken(c, 'duplicate'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: "After buying a card with a duplicate token on it the normal way, remove a duplicate tokens from it and buy it again.",
            kind: 'afterBuy',
            handles: function (e, state) {
                if (e.source.name != 'act')
                    return false;
                var target = state.find(e.card);
                return target.place != null && target.count('duplicate') > 0;
            },
            effect: function (e) { return doAll([removeToken(e.card, 'duplicate'), e.card.buy(card)]); }
        }]; }
};
registerEvent(duplicate);
var royalSeal = { name: 'Royal Seal',
    effect: function (card) { return ({
        text: '+$2. Put this in play.',
        effect: gainCoin(2),
        toZone: 'play',
    }); },
    triggers: function (card) { return [{
            text: "Whenever you create a card, if it's in your discard pile\n               and this is in play, discard this and put the card into your hand.",
            kind: 'create',
            handles: function (e, state) { return state.find(e.card).place == 'discard' && state.find(card).place == 'play'; },
            effect: function (e) { return doAll([move(card, 'discard'), move(e.card, 'hand')]); }
        }]; }
};
buyable(royalSeal, 6);
var workshop = { name: 'Workshop',
    fixedCost: energy(0),
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
        text: "+$2. Put this in play.",
        effect: gainCoin(2),
        toZone: 'play'
    }); },
    triggers: function (card) { return [{
            text: "When you finish buying a card or event the normal way,"
                + " if this is in play and that card hasn't moved, discard this and buy that card again.",
            kind: 'afterBuy',
            handles: function (e, state) { return (e.source.name == 'act' && state.find(card).place == 'play'); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var bought;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bought = state.find(e.card);
                                return [4 /*yield*/, move(card, 'discard')(state)];
                            case 1:
                                state = _a.sent();
                                if (!(bought.place == e.card.place)) return [3 /*break*/, 3];
                                return [4 /*yield*/, bought.buy(card)(state)];
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
var imitation = { name: 'Imitation',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Choose a card in your hand. Create a fresh copy of it in your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to replicate.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, create(target.spec, 'hand')(state)];
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
buyable(imitation, 4);
var feast = { name: 'Feast',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$5. +1 buy. Trash this.',
        toZone: null,
        effect: doAll([gainCoin(5), gainBuy]),
    }); }
};
buyable(feast, 4);
var mobilization = { name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(10)),
    effect: function (card) { return ({
        text: "Put a charge token and a cost token on this.",
        effect: doAll([addToken(card, 'cost'), charge(card, 1)])
    }); },
    replacers: function (card) { return [{
            text: regroup.name + " costs @ less to play for each cost token on this.",
            kind: 'cost',
            handles: function (x) { return (x.card.name == regroup.name); },
            replace: function (x) { return (__assign(__assign({}, x), { cost: subtractCost(x.cost, { energy: card.charge }) })); }
        }]; }
};
registerEvent(mobilization);
var refresh = { name: 'Refresh',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: 'Put your discard pile into your hand.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, moveMany(state.discard, 'hand')(state)];
                        case 1:
                            state = _a.sent();
                            state = state.sortZone('hand');
                            return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
registerEvent(refresh);
var twin = { name: 'Twin',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 8 }),
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
            handles: function (e) { return (e.card.count('twin') > 0 && e.source.id != card.id); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target;
                    return __generator(this, function (_a) {
                        target = state.find(e.card);
                        return [2 /*return*/, (target.place == 'discard' && target.count('twin') > 0) ? target.play(card)(state) : state];
                    });
                });
            }; }
        }]; },
};
registerEvent(twin);
var youngSmith = { name: 'Young Smith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Add a charge token to this if it has less than 4, then +1 draw per charge token on this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            card = state.find(card);
                            if (!(card.charge < 4)) return [3 /*break*/, 2];
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 1:
                            state = _a.sent();
                            _a.label = 2;
                        case 2:
                            card = state.find(card);
                            if (!(card.place != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, draw(card.charge)(state)];
                        case 3:
                            state = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(youngSmith, 3);
var oldSmith = { name: 'Old Smith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+4 draws -1 per charge token on this, then add a charge token to this.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, draw(4 - state.find(card).charge)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, charge(card, 1)(state)];
                        case 2:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        },
    }); }
};
buyable(oldSmith, 3);
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Create two golds in your hand.',
        effect: doAll([create(gold, 'hand'), create(gold, 'hand')]),
    }); }
};
buyable(goldMine, 8);
function fragile(card) {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: function (x) { return x.card.id == card.id; },
        effect: function (x) { return trash(x.card); }
    };
}
function robust(card) {
    return {
        text: 'Whenever this would move, leave it in play instead.',
        kind: 'move',
        handles: function (x) { return (x.card.id == card.id && x.toZone != null && x.fromZone == 'play'); },
        replace: function (x) { return (__assign(__assign({}, x), { skip: true })); }
    };
}
var expedite = { name: 'Expedite',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Put a charge token and a cost token on this.",
        effect: doAll([addToken(card, 'cost'), charge(card, 1)])
    }); },
    triggers: function (card) { return [{
            text: "When you create a card, if it's in your discard pile and this has a charge token on it,\n               remove a charge token from this and play the card.",
            kind: 'create',
            handles: function (e, state) { return state.find(e.card).place == 'discard' && state.find(card).charge > 0; },
            effect: function (e) { return doAll([charge(card, -1), playAgain(e.card, card)]); }
        }]; },
};
registerEvent(expedite);
function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy;
}
var makeSynergy = { name: 'Synergy',
    fixedCost: __assign(__assign({}, free), { coin: 5, energy: 1 }),
    effect: function (card) { return ({
        text: 'Remove all synergy tokens from cards in the supply or events,' +
            " then put synergy tokens on two cards in the supply or events.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, card_1, e_16_1, cards, cards_1, cards_1_1, card_2, e_17_1;
                var e_16, _c, _d, e_17, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 5, 6, 7]);
                            _a = __values(state.supply.concat(state.events)), _b = _a.next();
                            _f.label = 1;
                        case 1:
                            if (!!_b.done) return [3 /*break*/, 4];
                            card_1 = _b.value;
                            if (!(card_1.count('synergy') > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, removeTokens(card_1, 'synergy')(state)];
                        case 2:
                            state = _f.sent();
                            _f.label = 3;
                        case 3:
                            _b = _a.next();
                            return [3 /*break*/, 1];
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            e_16_1 = _f.sent();
                            e_16 = { error: e_16_1 };
                            return [3 /*break*/, 7];
                        case 6:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_16) throw e_16.error; }
                            return [7 /*endfinally*/];
                        case 7: return [4 /*yield*/, multichoiceIfNeeded(state, 'Choose two cards to synergize.', state.supply.concat(state.events).map(asChoice), 2, false)];
                        case 8:
                            _d = __read.apply(void 0, [_f.sent(), 2]), state = _d[0], cards = _d[1];
                            _f.label = 9;
                        case 9:
                            _f.trys.push([9, 14, 15, 16]);
                            cards_1 = __values(cards), cards_1_1 = cards_1.next();
                            _f.label = 10;
                        case 10:
                            if (!!cards_1_1.done) return [3 /*break*/, 13];
                            card_2 = cards_1_1.value;
                            return [4 /*yield*/, addToken(card_2, 'synergy')(state)];
                        case 11:
                            state = _f.sent();
                            _f.label = 12;
                        case 12:
                            cards_1_1 = cards_1.next();
                            return [3 /*break*/, 10];
                        case 13: return [3 /*break*/, 16];
                        case 14:
                            e_17_1 = _f.sent();
                            e_17 = { error: e_17_1 };
                            return [3 /*break*/, 16];
                        case 15:
                            try {
                                if (cards_1_1 && !cards_1_1.done && (_e = cards_1.return)) _e.call(cards_1);
                            }
                            finally { if (e_17) throw e_17.error; }
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
            handles: function (e) { return (e.source.id != card.id && e.card.count('synergy') > 0); },
            effect: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                options = state.supply.concat(state.events).filter(function (c) { return c.count('synergy') > 0
                                    && leq(c.cost(state), e.card.cost(state))
                                    && c.buyable(state)
                                    && c.id != e.card.id; });
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
registerEvent(makeSynergy);
var shelter = { name: 'Shelter',
    effect: function (card) { return ({
        text: 'Put a shelter token on a card in play.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to shelter.', state.play.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, addToken(target, 'shelter')(state)];
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
register(supplyForCard(shelter, coin(3), {
    replacers: function (card) { return [{
            kind: 'move',
            text: "Whenever you would move a card with a shelter token from play,\n               instead remove a shelter token from it.",
            handles: function (x, state) { return (x.fromZone == 'play' && state.find(x.card).count('shelter') > 0); },
            replace: function (x) { return (__assign(__assign({}, x), { toZone: 'play', effects: x.effects.concat([removeToken(x.card, 'shelter')]) })); }
        }]; }
}));
var market = { name: 'Market',
    effect: function (card) { return ({
        text: '+1 draw. +$1. +1 buy.',
        effect: doAll([gainCards(1), gainCoin(1), gainBuy]),
    }); }
};
buyable(market, 5);
var spree = { name: 'Spree',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+1 buy.',
        effect: gainBuy,
    }); }
};
registerEvent(spree);
var counterfeit = { name: 'Counterfeit',
    effect: function (card) { return ({
        text: '+1 draw. Play a card in your hand, then trash it. If you do, +1 buy.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, gainCards(1)(state)];
                        case 1:
                            state = _b.sent();
                            return [4 /*yield*/, choice(state, 'Choose a card to play then trash', state.hand.map(asChoice))];
                        case 2:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, doAll([target.play(card), trash(target), gainBuy])(state)];
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
buyable(counterfeit, 4);
var ruinedMarket = { name: 'Ruined Market',
    effect: function (card) { return ({
        text: '+1 buy',
        effect: gainBuy
    }); }
};
buyableFree(ruinedMarket, 2);
//TODO: onbuy should probably just have an effect and text field, and map a card...
var spices = { name: 'Spices',
    effect: function (card) { return ({
        text: '+$2. +1 buy.',
        effect: doAll([gainCoin(2), gainBuy]),
    }); }
};
register(supplyForCard(spices, coin(5), { onBuy: gainCoin(4), text: '+$4.' }));
var onslaught = { name: 'Onslaught',
    calculatedCost: costPlus(coin(6), energy(1)),
    effect: function (card) { return ({
        text: "Put a cost token on this.\n        Set aside your hand, then play any number of those cards in any order and discard the rest.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cards, options, _loop_1, state_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addToken(card, 'cost')(state)];
                        case 1:
                            state = _a.sent();
                            cards = state.hand;
                            return [4 /*yield*/, moveMany(cards, 'aside')(state)];
                        case 2:
                            state = _a.sent();
                            options = asNumberedChoices(cards);
                            _loop_1 = function () {
                                var picked, id_1;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            picked = void 0;
                                            return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options))];
                                        case 1:
                                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                            if (!(picked == null)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, moveMany(cards.filter(function (c) { return state.find(c).place == 'aside'; }), 'discard')(state)];
                                        case 2:
                                            state = _b.sent();
                                            return [2 /*return*/, { value: state }];
                                        case 3:
                                            id_1 = picked.id;
                                            options = options.filter(function (c) { return c.value.id != id_1; });
                                            return [4 /*yield*/, picked.play(card)(state)];
                                        case 4:
                                            state = _b.sent();
                                            _b.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            };
                            _a.label = 3;
                        case 3:
                            if (!true) return [3 /*break*/, 5];
                            return [5 /*yield**/, _loop_1()];
                        case 4:
                            state_1 = _a.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            return [3 /*break*/, 3];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
    }); }
};
registerEvent(onslaught);
//TODO: link these together, modules in general?
var colony = { name: 'Colony',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+5 vp',
        effect: gainPoints(5),
    }); }
};
buyable(colony, 16);
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$5',
        effect: gainCoin(5)
    }); }
};
buyable(platinum, 10);
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: '+5 draws',
        effect: draw(5),
    }); }
};
buyable(greatSmithy, 7);
var pressOn = { name: 'Press On',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: 'Discard your hand, lose all $, set draws to 5.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll([
                            setResource('coin', 0),
                            setResource('draws', 5),
                        ])(state)];
                });
            });
        }
    }); }
};
var kingsCourt = { name: "King's Court",
    fixedCost: energy(2),
    effect: function (card) { return ({
        text: "Pay 1 draw to play a card in your hand.\n        Then if it's in your discard pile, play it again.\n        Then if it's in your discard pile, play it a third time.",
        effect: payToDo(payCost(__assign(__assign({}, free), { draws: 1 })), function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to play three times.', state.hand.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (target == null)
                                return [2 /*return*/, state];
                            return [4 /*yield*/, target.play(card)(state)];
                        case 2:
                            state = _b.sent();
                            state = tick(card)(state);
                            return [4 /*yield*/, playAgain(target, card)(state)];
                        case 3:
                            state = _b.sent();
                            state = tick(card)(state);
                            return [4 /*yield*/, playAgain(target, card)(state)];
                        case 4:
                            state = _b.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        })
    }); }
};
buyable(kingsCourt, 10);
var gardens = { name: "Gardens",
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: "+1 vp per 10 cards in your hand, discard pile, and play.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var n;
                return __generator(this, function (_a) {
                    n = state.hand.length + state.discard.length + state.play.length;
                    return [2 /*return*/, gainPoints(Math.floor(n / 10))(state)];
                });
            });
        }
    }); }
};
buyable(gardens, 4);
var decay = { name: 'Decay',
    fixedCost: coin(3),
    effect: function (card) { return ({
        text: 'Remove a decay token from each card in your discard pile.',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, doAll(state.discard.map(function (x) { return removeToken(x, 'decay'); }))(state)];
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you move a card to your hand, if it has 3 or more decay tokens on it trash it,' +
                ' otherwise put a decay token on it.',
            kind: 'move',
            handles: function (e) { return e.toZone == 'hand'; },
            effect: function (e) { return (e.card.count('decay') >= 3) ? trash(e.card) : addToken(e.card, 'decay'); }
        }]; }
};
registerEvent(decay);
var reflect = { name: 'Reflect',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Put a cost token on this.\n               Pay 1 draw to play a card in your hand. Then if it's in your discard pile, play it again.",
        effect: doAll([addToken(card, 'cost'), payToDo(payCost(__assign(__assign({}, free), { draws: 1 })), playTwice(card))])
    }); }
};
registerEvent(reflect);
var replicate = { name: 'Replicate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effect: function (card) { return ({
        text: "Put a cost token on this.\n               Choose a card in your hand. Create a fresh copy of it in your discard pile.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, addToken(card, 'cost')(state)];
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
registerEvent(replicate);
var inflation = { name: 'Inflation',
    fixedCost: energy(3),
    effect: function (card) { return ({
        text: '+$15. +5 buys. Put a charge token on this.',
        effect: doAll([gainCoin(15), gainBuys(5), charge(card, 1)])
    }); },
    replacers: function (card) { return [{
            text: 'Cards that cost at least $1 cost $1 more per charge token on this.',
            kind: 'cost',
            handles: function (p, state) { return (p.cost.coin >= 1); },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, { coin: card.charge }) })); }
        }]; }
};
registerEvent(inflation);
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
                            return [2 /*return*/, removeToken(target, 'burden')(state)];
                    }
                });
            });
        }
    }); },
    triggers: function (card) { return [{
            text: 'Whenever you buy a card in the supply, put a burden token on it.',
            kind: 'buy',
            handles: function (e, state) { return (state.find(e.card).place == 'supply'); },
            effect: function (e) { return addToken(e.card, 'burden'); }
        }]; },
    replacers: function (card) { return [{
            kind: 'cost',
            text: 'Cards cost $1 more for each burden token on them.',
            handles: function (x) { return x.card.count('burden') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { cost: addCosts(x.cost, { coin: x.card.count('burden') }) })); }
        }]; }
};
registerEvent(burden);
var goldsmith = { name: 'Goldsmith',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+2 draws. +$3.',
        effect: doAll([draw(2), gainCoin(3)]),
    }); }
};
buyable(goldsmith, 7);
var publicWorks = { name: 'Public Works',
    effect: justPlay,
    replacers: function (card) { return [costReduceNext(card, 'events', { energy: 1 }, true)]; },
};
buyable(publicWorks, 5);
//TODO: handle skip better, other things shouldn't replace it again...
var echo = { name: 'Echo',
    effect: function (card) { return ({
        text: "Choose a card you have in play.\n        Create a fresh copy of it in play and put an echo token on it.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, choice(state, 'Choose a card to copy.', state.play.map(asChoice))];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                            if (!(target != null)) return [3 /*break*/, 3];
                            return [4 /*yield*/, create(target.spec, 'play', 'end', function (c) { return addToken(c, 'echo'); })(state)];
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
register(supplyForCard(echo, coin(4), {
    triggers: function (card) { return [{
            text: 'Whenever you move a card with an echo token on it, trash it.',
            kind: 'move',
            handles: function (x, state) { return x.card.count('echo') > 0; },
            effect: function (x) { return trash(x.card); }
        }]; }
}));
var preparations = { name: 'Preparations',
    effect: justPlay,
    replacers: function (card) { return [{
            text: "Whenever you would move this from play to your hand,\n            if it has no charge tokens on it instead put a charge token on it.",
            kind: 'move',
            handles: function (x, state) { return (x.fromZone == 'play' && x.toZone == 'hand'
                && x.card.id == card.id && state.find(card).charge == 0); },
            replace: function (x) { return (__assign(__assign({}, x), { skip: true, effects: x.effects.concat([charge(card, 1)]) })); }
        }]; },
    triggers: function (card) { return [{
            text: "Whenever you finish playing a card, if it's in your discard pile and\n            this is in play with a charge token on it,\n            remove the charge token, discard this, and play that card again.",
            kind: 'afterPlay',
            handles: function (e, state) {
                card = state.find(card);
                return card.place == 'play' && card.charge > 0
                    && state.find(e.card).place == 'discard';
            },
            effect: function (e) { return doAll([uncharge(card), move(card, 'discard'), playAgain(e.card)]); }
        }]; }
};
buyable(preparations, 3);
var bulkDiscount = { name: 'Bulk Discount',
    triggers: function (card) { return [{
            text: 'Whenever you buy a card costing $4 or more the normal way, put a charge token on this.',
            kind: 'buy',
            handles: function (e, state) { return e.card.cost(state).coin >= 4 && e.source.name == 'act'; },
            effect: function (e) { return charge(card, 1); }
        }]; },
    abilities: function (card) { return [{
            text: 'Remove two charge tokens from this to buy a card in the supply costing up to $4.',
            cost: discharge(card, 2),
            effect: applyToTarget(function (c) { return c.buy(card); }, 'Choose a card to buy.', 'supply', function (c, state) { return leq(c.cost(state), coin(4)); })
        }]; },
    replacers: function (card) { return [robust(card)]; },
};
register(makeCard(bulkDiscount, coin(3)));
var doubleTime = { name: 'Double Time',
    effect: cantripPlay,
    triggers: function (card) { return [{
            text: 'Whenever you pay @, that many charge tokens on this.',
            kind: 'cost',
            handles: function () { return true; },
            effect: function (e) { return charge(card, e.cost.energy); }
        }]; },
    replacers: function (card) { return [{
            text: "Cards in your hand @ less to play for each charge token on this.\n            Whenever this reduces a cost by one or more @, remove that many charge tokens from this.",
            kind: 'cost',
            handles: function () { return card.charge > 0; },
            replace: function (x, state) {
                card = state.find(card);
                var reduction = Math.min(x.cost.energy, card.charge);
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([discharge(card, reduction)]) }) });
            }
        }]; }
};
buyable(doubleTime, 2);
function applyToTarget(f, text, zone, filter) {
    if (filter === void 0) { filter = function () { return true; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, choice(state, text, state.getZone(zone).filter(function (c) { return filter(c, state); }).map(asChoice))];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        if (!(target != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, f(target)(state)];
                    case 2:
                        state = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, state];
                }
            });
        });
    };
}
var dragon = { name: 'Dragon',
    effect: function (card) { return ({
        text: 'Trash a card in your hand. +4 cards. +$4. +1 buy.',
        effect: doAll([applyToTarget(trash, 'Choose a card to trash', 'hand'), gainCards(4), gainCoin(4), gainBuy])
    }); }
};
//TODO: adaptively moving cards is tough, need to rework toZone
var egg = { name: 'Egg',
    fixedCost: energy(2),
    relatedCards: [dragon],
    effect: function (card) { return ({
        text: "If this has two or more charge tokens on it, trash it and create a " + dragon.name + " in your hand.\n        Otherwise, put a charge token on this.",
        toZone: (card.charge >= 2) ? null : 'discard',
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (card.charge >= 2)
                        return [2 /*return*/, create(dragon, 'hand')(state)];
                    else
                        return [2 /*return*/, charge(card, 1)(state)];
                    return [2 /*return*/];
                });
            });
        }
    }); }
};
buyable(egg, 4);
var looter = { name: 'Looter',
    effect: function (card) { return ({
        text: "Discard up to three cards from your hand. +1 card per card you discarded.",
        effect: function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var targets;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, 'Choose up to three cards to discard', state.hand.map(asChoice), function (xs) { return xs.length <= 3; })];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                            return [4 /*yield*/, moveMany(targets, 'discard')(state)];
                        case 2:
                            state = _b.sent();
                            return [4 /*yield*/, draw(targets.length)(state)];
                        case 3:
                            state = _b.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }
    }); }
};
buyable(looter, 4);
var empire = { name: 'Empire',
    fixedCost: energy(1),
    effect: function (card) { return ({
        text: '+3 cards. +3 vp.',
        effect: doAll([gainCards(3), gainPoints(3)])
    }); }
};
buyable(empire, 10);
var innovation = { name: 'Innovation',
    effect: cantripPlay,
    triggers: function (card) { return [{
            text: "When you create a card,\n            if it's in your discard pile and this is in play,\n            discard this and play the card.",
            kind: 'create',
            handles: function (e, state) { return (state.find(e.card).place == 'discard' && state.find(card).place == 'play'); },
            effect: function (e) { return doAll([move(card, 'discard'), playAgain(e.card)]); },
        }]; }
};
buyable(innovation, 9);
var formation = { name: 'Formation',
    effect: function (card) { return ({
        text: "+1 card, +1 buy. Put this in play.",
        toZone: 'play',
        effect: doAll([gainCards(1), gainBuy])
    }); },
    replacers: function (card) { return [{
            text: 'Cards in your hand cost @ less if you have a card with the same name'
                + ' in your discard pile or play.'
                + ' Whenever this reduces a cost, discard this.',
            kind: 'cost',
            handles: function (e, state) { return (state.discard.concat(state.play).some(function (c) { return c.name == e.card.name; })); },
            replace: function (x, state) {
                if (x.card.place == 'hand') {
                    var newCost = subtractCost(x.cost, { energy: 1 });
                    if (!eq(newCost, x.cost)) {
                        newCost.effects = newCost.effects.concat([move(card, 'discard'), gainBuy]);
                        return __assign(__assign({}, x), { cost: newCost });
                    }
                }
                return x;
            }
        }]; }
};
buyable(formation, 4);
// ------------------ Testing -------------------
var freeMoney = { name: 'Money and buys',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+$100, +100 buys',
        effect: doAll([gainCoin(100), gainBuys(100)])
    }); }
};
cheats.push(freeMoney);
var freePoints = { name: 'Free points',
    fixedCost: energy(0),
    effect: function (card) { return ({
        text: '+10vp',
        effect: gainPoints(10),
    }); }
};
cheats.push(freePoints);
//# sourceMappingURL=logic.js.map