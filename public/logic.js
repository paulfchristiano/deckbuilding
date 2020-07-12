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
export var VERSION = "1";
// ----------------------------- Formatting
export function renderCost(cost, full) {
    var e_1, _a;
    if (full === void 0) { full = false; }
    var parts = [];
    var toRender = full ? allCostResources : ['coin', 'energy'];
    try {
        for (var toRender_1 = __values(toRender), toRender_1_1 = toRender_1.next(); !toRender_1_1.done; toRender_1_1 = toRender_1.next()) {
            var name_1 = toRender_1_1.value;
            var x = cost[name_1];
            if (x != undefined && x > 0)
                parts.push(renderResource(name_1, x));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (toRender_1_1 && !toRender_1_1.done && (_a = toRender_1.return)) _a.call(toRender_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return parts.join(' ');
}
//renders either "1 x" or "n xs" as appropriate
function num(n, x) {
    return n + " " + x + (n == 1 ? '' : 's');
}
//renders either "a" or "an" as appropriate
function a(s) {
    var c = s[0].toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s;
    return 'a ' + s;
}
function lowercase(s) {
    return s[0].toLowerCase() + s.slice(1);
}
function renderResource(resource, amount) {
    if (amount < 0)
        return '-' + renderResource(resource, -amount);
    switch (resource) {
        case 'coin': return "$" + amount;
        case 'energy': return repeatSymbol('@', amount);
        case 'points': return amount + " vp";
        case 'actions': return num(amount, 'action');
        case 'buys': return num(amount, 'buy');
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
var free = { coin: 0, energy: 0, actions: 0, buys: 0, effects: [], tests: [] };
var unk = { name: '?' }; //Used as a default when we don't know the source
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
        return new Card(this.spec, this.id, (newValues.ticks === undefined) ? this.ticks : newValues.ticks, (newValues.tokens === undefined) ? this.tokens : newValues.tokens, (newValues.place === undefined) ? this.place : newValues.place, (newValues.zoneIndex === undefined) ? this.zoneIndex : newValues.zoneIndex);
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
    Card.prototype.baseCost = function (state, kind) {
        switch (kind) {
            case 'play':
            case 'use':
                var result = free;
                if (this.spec.fixedCost != undefined)
                    result = this.spec.fixedCost;
                else if (this.spec.calculatedCost != undefined)
                    result = this.spec.calculatedCost.calculate(this, state);
                if (kind == 'play')
                    result = addCosts(result, { actions: 1 });
                return result;
            case 'buy': return addCosts(this.spec.buyCost || free, { buys: 1 });
            case 'activate': return free;
            default: return assertNever(kind);
        }
    };
    // the cost after replacement effects
    Card.prototype.cost = function (kind, state) {
        var card = this;
        var initialCost = {
            kind: 'cost',
            actionKind: kind,
            card: card,
            cost: card.baseCost(state, kind)
        };
        var newCost = replace(initialCost, state);
        return newCost.cost;
    };
    // the transformation that actually pays the cost, with tracking
    Card.prototype.payCost = function (kind) {
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cost;
                return __generator(this, function (_a) {
                    state = state.log("Paying for " + card.name);
                    cost = card.cost(kind, state);
                    return [2 /*return*/, withTracking(payCost(cost, card), { kind: 'cost', card: card, cost: cost })(state)];
                });
            });
        };
    };
    Card.prototype.play = function (source) {
        if (source === void 0) { source = unk; }
        return this.activate('play', source);
    };
    Card.prototype.buy = function (source) {
        if (source === void 0) { source = unk; }
        return this.activate('buy', source);
    };
    Card.prototype.use = function (source) {
        if (source === void 0) { source = unk; }
        return this.activate('use', source);
    };
    Card.prototype.activate = function (kind, source) {
        if (source === void 0) { source = unk; }
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var before, trackingSpec, gameEvent, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            card = state.find(card);
                            before = state;
                            _a = kind;
                            switch (_a) {
                                case 'play': return [3 /*break*/, 1];
                                case 'buy': return [3 /*break*/, 3];
                                case 'use': return [3 /*break*/, 4];
                                case 'activate': return [3 /*break*/, 5];
                            }
                            return [3 /*break*/, 6];
                        case 1:
                            trackingSpec = { kind: 'none', card: card };
                            gameEvent = { kind: 'play', card: card, source: source };
                            state = state.log("Playing " + card.name);
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 2:
                            state = _c.sent();
                            return [3 /*break*/, 7];
                        case 3:
                            trackingSpec = { kind: 'buying', card: card };
                            gameEvent = { kind: 'buy', card: card, source: source };
                            state = state.log("Buying " + card.name);
                            return [3 /*break*/, 7];
                        case 4:
                            trackingSpec = { kind: 'effect', card: card };
                            gameEvent = { kind: 'use', card: card, source: source };
                            state = state.log("Using " + card.name);
                            return [3 /*break*/, 7];
                        case 5:
                            trackingSpec = { kind: 'ability', card: card };
                            gameEvent = { kind: 'activate', card: card, source: source };
                            state = state.log("Activating " + card.name);
                            return [3 /*break*/, 7];
                        case 6: return [2 /*return*/, assertNever(kind)];
                        case 7: return [4 /*yield*/, withTracking(function (state) {
                                return __awaiter(this, void 0, void 0, function () {
                                    var _a, _b, _c, effect, e_2_1, _d, _e, effect, e_3_1;
                                    var e_2, _f, e_3, _g;
                                    return __generator(this, function (_h) {
                                        switch (_h.label) {
                                            case 0: return [4 /*yield*/, trigger(gameEvent)(state)];
                                            case 1:
                                                state = _h.sent();
                                                _a = kind;
                                                switch (_a) {
                                                    case 'use': return [3 /*break*/, 2];
                                                    case 'play': return [3 /*break*/, 2];
                                                    case 'activate': return [3 /*break*/, 10];
                                                    case 'buy': return [3 /*break*/, 18];
                                                }
                                                return [3 /*break*/, 20];
                                            case 2:
                                                _h.trys.push([2, 7, 8, 9]);
                                                _b = __values(card.effects()), _c = _b.next();
                                                _h.label = 3;
                                            case 3:
                                                if (!!_c.done) return [3 /*break*/, 6];
                                                effect = _c.value;
                                                card = state.find(card);
                                                return [4 /*yield*/, effect.transform(state, card)(state)];
                                            case 4:
                                                state = _h.sent();
                                                _h.label = 5;
                                            case 5:
                                                _c = _b.next();
                                                return [3 /*break*/, 3];
                                            case 6: return [3 /*break*/, 9];
                                            case 7:
                                                e_2_1 = _h.sent();
                                                e_2 = { error: e_2_1 };
                                                return [3 /*break*/, 9];
                                            case 8:
                                                try {
                                                    if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                                                }
                                                finally { if (e_2) throw e_2.error; }
                                                return [7 /*endfinally*/];
                                            case 9: return [2 /*return*/, state];
                                            case 10:
                                                _h.trys.push([10, 15, 16, 17]);
                                                _d = __values(card.abilityEffects()), _e = _d.next();
                                                _h.label = 11;
                                            case 11:
                                                if (!!_e.done) return [3 /*break*/, 14];
                                                effect = _e.value;
                                                card = state.find(card);
                                                return [4 /*yield*/, effect.transform(state, card)(state)];
                                            case 12:
                                                state = _h.sent();
                                                _h.label = 13;
                                            case 13:
                                                _e = _d.next();
                                                return [3 /*break*/, 11];
                                            case 14: return [3 /*break*/, 17];
                                            case 15:
                                                e_3_1 = _h.sent();
                                                e_3 = { error: e_3_1 };
                                                return [3 /*break*/, 17];
                                            case 16:
                                                try {
                                                    if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                                                }
                                                finally { if (e_3) throw e_3.error; }
                                                return [7 /*endfinally*/];
                                            case 17: return [2 /*return*/, state];
                                            case 18: return [4 /*yield*/, create(card.spec, 'discard')(state)];
                                            case 19:
                                                state = _h.sent();
                                                return [2 /*return*/, state];
                                            case 20: return [2 /*return*/, assertNever(kind)];
                                        }
                                    });
                                });
                            }, trackingSpec)(state)];
                        case 8:
                            state = _c.sent();
                            card = state.find(card);
                            _b = kind;
                            switch (_b) {
                                case 'play': return [3 /*break*/, 9];
                                case 'use': return [3 /*break*/, 13];
                                case 'buy': return [3 /*break*/, 15];
                                case 'activate': return [3 /*break*/, 17];
                            }
                            return [3 /*break*/, 18];
                        case 9:
                            if (!(card.place == 'resolving')) return [3 /*break*/, 11];
                            return [4 /*yield*/, move(card, 'discard')(state)];
                        case 10:
                            state = _c.sent();
                            _c.label = 11;
                        case 11: return [4 /*yield*/, trigger({
                                kind: 'afterPlay',
                                card: card,
                                source: source,
                                before: before,
                            })(state)];
                        case 12:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 13: return [4 /*yield*/, trigger({
                                kind: 'afterUse',
                                card: card,
                                source: source,
                                before: before,
                            })(state)];
                        case 14:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 15: return [4 /*yield*/, trigger({
                                kind: 'afterBuy',
                                card: card,
                                source: source,
                                before: before
                            })(state)];
                        case 16:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 17: return [2 /*return*/, state];
                        case 18: return [2 /*return*/, assertNever(kind)];
                    }
                });
            });
        };
    };
    Card.prototype.abilityEffects = function () {
        return this.spec.ability || [];
    };
    Card.prototype.effects = function () {
        return this.spec.effects || [];
    };
    Card.prototype.triggers = function () {
        return this.spec.triggers || [];
    };
    Card.prototype.staticTriggers = function () {
        return this.spec.staticTriggers || [];
    };
    Card.prototype.replacers = function () {
        return this.spec.replacers || [];
    };
    Card.prototype.staticReplacers = function () {
        return this.spec.staticReplacers || [];
    };
    Card.prototype.relatedCards = function () {
        return this.spec.relatedCards || [];
    };
    Card.prototype.restrictions = function () {
        return this.spec.restrictions || [];
    };
    Card.prototype.available = function (kind, state) {
        var e_4, _a;
        if (kind == 'activate' && this.spec.ability === undefined)
            return false;
        try {
            for (var _b = __values(this.restrictions()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var restriction = _c.value;
                if (restriction.test(this, state, kind))
                    return false;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return canPay(this.cost(kind, state), state);
    };
    return Card;
}());
export { Card };
var allCostResources = ['coin', 'energy', 'actions', 'buys'];
var allResources = allCostResources.concat(['points']);
var notFound = { found: false, card: null, place: null };
var noUI = {
    choice: function (state, choicePrompt, options, info) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new ReplayEnded(state);
            });
        });
    },
    multichoice: function (state, choicePrompt, options, validator, info) {
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
function get(stateUpdate, k, state) {
    return (stateUpdate[k] === undefined) ? state[k] : stateUpdate[k];
}
export var RANDOM = 'Random';
var State = /** @class */ (function () {
    function State(spec, ui, resources, zones, resolving, nextID, history, future, redo, checkpoint, logs, logIndent) {
        if (spec === void 0) { spec = { kind: 'full', seed: '' }; }
        if (ui === void 0) { ui = noUI; }
        if (resources === void 0) { resources = { coin: 0, energy: 0, points: 0, actions: 0, buys: 0 }; }
        if (zones === void 0) { zones = new Map(); }
        if (resolving === void 0) { resolving = []; }
        if (nextID === void 0) { nextID = 0; }
        if (history === void 0) { history = []; }
        if (future === void 0) { future = []; }
        if (redo === void 0) { redo = []; }
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
        this.redo = redo;
        this.checkpoint = checkpoint;
        this.logs = logs;
        this.logIndent = logIndent;
        this.coin = resources.coin;
        this.energy = resources.energy;
        this.points = resources.points;
        this.actions = resources.actions;
        this.buys = resources.buys;
        this.supply = zones.get('supply') || [];
        this.hand = zones.get('hand') || [];
        this.discard = zones.get('discard') || [];
        this.play = zones.get('play') || [];
        this.aside = zones.get('aside') || [];
        this.events = zones.get('events') || [];
    }
    State.prototype.update = function (stateUpdate) {
        return new State(this.spec, get(stateUpdate, 'ui', this), get(stateUpdate, 'resources', this), get(stateUpdate, 'zones', this), get(stateUpdate, 'resolving', this), get(stateUpdate, 'nextID', this), get(stateUpdate, 'history', this), get(stateUpdate, 'future', this), get(stateUpdate, 'redo', this), get(stateUpdate, 'checkpoint', this), get(stateUpdate, 'logs', this), get(stateUpdate, 'logIndent', this));
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
        card = card.update({ place: zone });
        if (zone == 'resolving')
            return this.addResolving(card);
        var newZones = new Map(this.zones);
        var currentZone = this[zone];
        card = card.update({ zoneIndex: firstFreeIndex(currentZone) });
        newZones.set(zone, insertAt(currentZone, card, loc));
        return this.update({ zones: newZones });
    };
    State.prototype.remove = function (card) {
        var e_5, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones.set(name_2, zone.filter(function (c) { return c.id != card.id; }));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return this.update({ zones: newZones, resolving: this.resolving.filter(function (c) { return c.id != card.id; }) });
    };
    State.prototype.apply = function (f, card) {
        var e_6, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_3 = _d[0], zone = _d[1];
                newZones.set(name_3, zone.map(function (c) { return (c.id == card.id) ? f(c) : c; }));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
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
        var e_7, _a;
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_4 = _d[0], zone_1 = _d[1];
                var matches_1 = zone_1.filter(function (c) { return c.id == card.id; });
                if (matches_1.length > 0)
                    return matches_1[0];
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        var zone = this.resolving;
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
    State.prototype.consumeRedo = function (record) {
        var _a;
        var result, redo;
        _a = __read(popLast(this.redo), 2), result = _a[0], redo = _a[1];
        if (result === null)
            return this;
        return this.update({ redo: arrayEq(result, record) ? redo : [] });
    };
    State.prototype.addHistory = function (record) {
        return this.update({ history: this.history.concat([record]) });
    };
    State.prototype.log = function (msg) {
        //return this
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
        return (last == null) ? null : last.update({
            future: this.history.concat(this.future),
            redo: this.redo
        });
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
    State.prototype.clearFuture = function () {
        return this.update({ future: [] });
    };
    State.prototype.addRedo = function (action) {
        var result = this.update({ redo: this.redo.concat([action]) });
        return result;
    };
    State.prototype.serializeHistory = function (includeVersion) {
        if (includeVersion === void 0) { includeVersion = true; }
        var state = this;
        var prev = state;
        while (prev != null) {
            state = prev;
            prev = state.backup();
        }
        return serializeReplay({
            version: includeVersion ? VERSION : '',
            actions: state.future
        });
    };
    State.fromReplayString = function (s, spec) {
        return State.fromReplay(parseReplay(s), spec);
    };
    State.fromReplay = function (replay, spec) {
        if (replay.version != VERSION)
            throw new VersionMismatch(replay.version || 'null');
        return initialState(spec).update({ future: replay.actions });
    };
    return State;
}());
export { State };
function arrayEq(xs, ys) {
    return (xs.length == ys.length) && xs.every(function (x, i) { return x == ys[i]; });
}
var MalformedReplay = /** @class */ (function (_super) {
    __extends(MalformedReplay, _super);
    function MalformedReplay(s) {
        var _this = _super.call(this, "Not a well-formed replay: " + s) || this;
        _this.s = s;
        Object.setPrototypeOf(_this, MalformedReplay.prototype);
        return _this;
    }
    return MalformedReplay;
}(Error));
export { MalformedReplay };
export function coerceReplayVersion(r) {
    return { version: VERSION, actions: r.actions };
}
export function serializeReplay(r) {
    return [r.version].concat(r.actions.map(function (xs) { return xs.map(String).join(','); })).join(';');
}
export function parseReplay(s) {
    var _a = __read(shiftFirst(s.split(';')), 2), version = _a[0], pieces = _a[1];
    if (version === null)
        throw new MalformedReplay('No version');
    function parsePiece(piece) {
        if (piece == '')
            return [];
        var result = piece.split(',').map(function (x) { return parseInt(x); });
        if (result.some(isNaN))
            throw new MalformedReplay(piece + " is not a valid action");
        return result;
    }
    return { version: version, actions: pieces.map(parsePiece) };
}
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
    var e_8, _a, _b;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    try {
        for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
            var spec = specs_1_1.value;
            var card = void 0;
            _b = __read(createRaw(state, spec, zone, loc), 2), state = _b[0], card = _b[1];
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return state;
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, triggers, _a, _b, card, _c, _d, trigger_1, _e, _f, card, _g, _h, trigger_2, triggers_1, triggers_1_1, _j, card, rawTrigger, trigger_3, e_9_1;
            var e_10, _k, e_11, _l, e_12, _m, e_13, _o, e_9, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        initialState = state;
                        triggers = [];
                        try {
                            for (_a = __values(state.supply), _b = _a.next(); !_b.done; _b = _a.next()) {
                                card = _b.value;
                                try {
                                    for (_c = (e_11 = void 0, __values(card.staticTriggers())), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        trigger_1 = _d.value;
                                        triggers.push([card, trigger_1]);
                                    }
                                }
                                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_l = _c.return)) _l.call(_c);
                                    }
                                    finally { if (e_11) throw e_11.error; }
                                }
                            }
                        }
                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_k = _a.return)) _k.call(_a);
                            }
                            finally { if (e_10) throw e_10.error; }
                        }
                        try {
                            for (_e = __values(state.events.concat(state.play)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                card = _f.value;
                                try {
                                    for (_g = (e_13 = void 0, __values(card.triggers())), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        trigger_2 = _h.value;
                                        triggers.push([card, trigger_2]);
                                    }
                                }
                                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_o = _g.return)) _o.call(_g);
                                    }
                                    finally { if (e_13) throw e_13.error; }
                                }
                            }
                        }
                        catch (e_12_1) { e_12 = { error: e_12_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_m = _e.return)) _m.call(_e);
                            }
                            finally { if (e_12) throw e_12.error; }
                        }
                        _q.label = 1;
                    case 1:
                        _q.trys.push([1, 6, 7, 8]);
                        triggers_1 = __values(triggers), triggers_1_1 = triggers_1.next();
                        _q.label = 2;
                    case 2:
                        if (!!triggers_1_1.done) return [3 /*break*/, 5];
                        _j = __read(triggers_1_1.value, 2), card = _j[0], rawTrigger = _j[1];
                        if (!(rawTrigger.kind == e.kind)) return [3 /*break*/, 4];
                        trigger_3 = rawTrigger;
                        if (!(trigger_3.handles(e, initialState, card)
                            && trigger_3.handles(e, state, card))) return [3 /*break*/, 4];
                        state = state.log("Triggering " + card);
                        return [4 /*yield*/, withTracking(trigger_3.transform(e, state, card), { kind: 'trigger', trigger: trigger_3, card: card })(state)];
                    case 3:
                        state = _q.sent();
                        _q.label = 4;
                    case 4:
                        triggers_1_1 = triggers_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_9_1 = _q.sent();
                        e_9 = { error: e_9_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (triggers_1_1 && !triggers_1_1.done && (_p = triggers_1.return)) _p.call(triggers_1);
                        }
                        finally { if (e_9) throw e_9.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, state];
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
    var e_14, _a, e_15, _b, e_16, _c, e_17, _d, e_18, _e;
    var replacers = [];
    try {
        for (var _f = __values(state.supply), _g = _f.next(); !_g.done; _g = _f.next()) {
            var card = _g.value;
            try {
                for (var _h = (e_15 = void 0, __values(card.staticReplacers())), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var replacer = _j.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_15) throw e_15.error; }
            }
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        }
        finally { if (e_14) throw e_14.error; }
    }
    try {
        for (var _k = __values(state.events.concat(state.play)), _l = _k.next(); !_l.done; _l = _k.next()) {
            var card = _l.value;
            try {
                for (var _m = (e_17 = void 0, __values(card.replacers())), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var replacer = _o.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
        }
        finally { if (e_16) throw e_16.error; }
    }
    try {
        for (var replacers_1 = __values(replacers), replacers_1_1 = replacers_1.next(); !replacers_1_1.done; replacers_1_1 = replacers_1.next()) {
            var _p = __read(replacers_1_1.value, 2), card = _p[0], rawReplacer = _p[1];
            if (rawReplacer.kind == x.kind) {
                var replacer = rawReplacer;
                if (replacer.handles(x, state, card)) {
                    x = replacer.replace(x, state, card);
                }
            }
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_e = replacers_1.return)) _e.call(replacers_1);
        }
        finally { if (e_18) throw e_18.error; }
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
            var params, _a, _b, effect, e_19_1, card;
            var e_19, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        params = { kind: 'create', spec: spec, zone: zone, effects: [] };
                        params = replace(params, state);
                        spec = params.spec;
                        zone = params.zone;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _a = __values(params.effects), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        effect = _b.value;
                        return [4 /*yield*/, effect(state)];
                    case 3:
                        state = _e.sent();
                        _e.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_19_1 = _e.sent();
                        e_19 = { error: e_19_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_19) throw e_19.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        _d = __read(createRaw(state, spec, zone, loc), 2), state = _d[0], card = _d[1];
                        state = state.log("Created " + a(card.name) + " in " + zone);
                        return [4 /*yield*/, trigger({ kind: 'create', card: card, zone: zone })(state)];
                    case 9:
                        state = _e.sent();
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
            var params, _a, _b, effect, e_20_1;
            var e_20, _c;
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
                        e_20_1 = _d.sent();
                        e_20 = { error: e_20_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_20) throw e_20.error; }
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
            var _a, _b, effect, e_21_1;
            var e_21, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (state.coin < c.coin)
                            throw new CostNotPaid("Not enough coin");
                        if (state.actions < c.actions)
                            throw new CostNotPaid("Not enough actions");
                        if (state.buys < c.buys)
                            throw new CostNotPaid("Not enough buys");
                        state = state.setResources({
                            coin: state.coin - c.coin,
                            actions: state.actions - c.actions,
                            buys: state.buys - c.buys,
                            energy: state.energy + c.energy,
                            points: state.points
                        });
                        if (renderCost(c, true) != '')
                            state = state.log("Paid " + renderCost(c, true));
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
                        e_21_1 = _d.sent();
                        e_21 = { error: e_21_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_21) throw e_21.error; }
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
            var newResources, params;
            return __generator(this, function (_a) {
                if (amount == 0)
                    return [2 /*return*/, state];
                newResources = {
                    coin: state.coin,
                    energy: state.energy,
                    points: state.points,
                    actions: state.actions,
                    buys: state.buys,
                };
                params = {
                    kind: 'resource',
                    amount: amount,
                    resource: resource,
                    source: source
                };
                params = replace(params, state);
                resource = params.resource;
                amount = params.amount;
                newResources[resource] = Math.max(newResources[resource] + amount, 0);
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
            var newResources;
            return __generator(this, function (_a) {
                newResources = __assign({}, state.resources);
                newResources[resource] = amount;
                return [2 /*return*/, state.setResources(newResources)];
            });
        });
    };
}
function gainActions(n, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource('actions', n, source)(state)];
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
export var VP_GOAL = 40;
function gainPoints(n, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gainResource('points', n, source)(state)];
                    case 1:
                        state = _a.sent();
                        if (state.points >= VP_GOAL)
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
// -------------------- Utilities for manipulating costs
function addCosts(a, b) {
    return {
        coin: a.coin + (b.coin || 0),
        energy: a.energy + (b.energy || 0),
        actions: a.actions + (b.actions || 0),
        buys: a.buys + (b.buys || 0),
        effects: a.effects.concat(b.effects || []),
        tests: a.tests.concat(b.tests || []),
    };
}
function multiplyCosts(c, n) {
    var e_22, _a;
    var result = {};
    try {
        for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
            var resource = allCostResources_1_1.value;
            var r = c[resource];
            if (r != undefined)
                result[resource] = n * r;
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
        }
        finally { if (e_22) throw e_22.error; }
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
        actions: Math.max(0, c.actions - (reduction.actions || 0)),
        buys: Math.max(0, c.buys - (reduction.buys || 0)),
        effects: c.effects,
        tests: c.tests
    };
}
function eq(a, b) {
    return a.coin == b.coin && a.energy == b.energy && a.actions == b.actions;
}
function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy;
}
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
function addToken(card, token, n) {
    if (n === void 0) { n = 1; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var newCard;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null)
                    return [2 /*return*/, state];
                newCard = card.addTokens(token, n);
                state = state.replace(card, newCard);
                state = logTokenChange(state, card, token, n);
                return [2 /*return*/, trigger({ kind: 'addToken', card: newCard, token: token, amount: n })(state)];
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
function removeToken(card, token, isCost) {
    if (isCost === void 0) { isCost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var removed, newCard;
            return __generator(this, function (_a) {
                removed = 0;
                card = state.find(card);
                if (card.place == null || card.count(token) == 0) {
                    if (isCost)
                        throw new CostNotPaid("Couldn't remove " + token + " token.");
                    return [2 /*return*/, state];
                }
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
var InvalidHistory = /** @class */ (function (_super) {
    __extends(InvalidHistory, _super);
    function InvalidHistory(indices, state) {
        var _this = _super.call(this, "Indices " + indices + " do not correspond to a valid choice") || this;
        _this.indices = indices;
        _this.state = state;
        Object.setPrototypeOf(_this, InvalidHistory.prototype);
        return _this;
    }
    return InvalidHistory;
}(Error));
export { InvalidHistory };
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
function doOrReplay(state, f) {
    return __awaiter(this, void 0, void 0, function () {
        var record, x;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = __read(state.shiftFuture(), 2), state = _a[0], record = _a[1];
                    if (!(record !== null)) return [3 /*break*/, 1];
                    x = record;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, f()];
                case 2:
                    x = _b.sent();
                    state = state.consumeRedo(x);
                    _b.label = 3;
                case 3: return [2 /*return*/, [state.addHistory(x), x]];
            }
        });
    });
}
function multichoice(state, prompt, options, validator, info) {
    if (validator === void 0) { validator = (function (xs) { return true; }); }
    if (info === void 0) { info = []; }
    return __awaiter(this, void 0, void 0, function () {
        var indices, newState;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, doOrReplay(state, function () { return state.ui.multichoice(state, prompt, options, validator, info); })];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), newState = _a[0], indices = _a[1];
                    if (indices.some(function (x) { return x >= options.length; }))
                        throw new InvalidHistory(indices, state);
                    return [2 /*return*/, [newState, indices.map(function (i) { return options[i].value; })]];
            }
        });
    });
}
function choice(state, prompt, options, info) {
    if (info === void 0) { info = []; }
    return __awaiter(this, void 0, void 0, function () {
        var index, indices, newState;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options.length == 0)
                        return [2 /*return*/, [state, null]];
                    return [4 /*yield*/, doOrReplay(state, function () {
                            return __awaiter(this, void 0, void 0, function () { var x; return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, state.ui.choice(state, prompt, options, info)];
                                    case 1:
                                        x = _a.sent();
                                        return [2 /*return*/, [x]];
                                }
                            }); });
                        })];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), newState = _a[0], indices = _a[1];
                    if (indices.length != 1 || indices[0] >= options.length)
                        throw new InvalidHistory(indices, state);
                    return [2 /*return*/, [newState, options[indices[0]].value]];
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
            return state.addRedo(last);
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
export function verifyScore(spec, history, score) {
    return __awaiter(this, void 0, void 0, function () {
        var e_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, playGame(State.fromReplayString(history, spec))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, [true, ""]]; //unreachable
                case 2:
                    e_23 = _a.sent();
                    if (e_23 instanceof Victory) {
                        if (e_23.state.energy == score)
                            return [2 /*return*/, [true, ""]];
                        else
                            return [2 /*return*/, [false, "Computed score was " + e_23.state.energy]];
                    }
                    else if (e_23 instanceof InvalidHistory) {
                        return [2 /*return*/, [false, "" + e_23]];
                    }
                    else if (e_23 instanceof VersionMismatch) {
                        return [2 /*return*/, [false, "" + e_23]];
                    }
                    else if (e_23 instanceof ReplayEnded) {
                        return [2 /*return*/, [false, "" + e_23]];
                    }
                    else {
                        throw e_23;
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
        var picked, _a, card, kind;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                    if (picked == null)
                        throw new Error('No valid options.');
                    _a = __read(picked, 2), card = _a[0], kind = _a[1];
                    return [2 /*return*/, payToDo(card.payCost(kind), card.activate(kind, { name: 'act' }))(state)];
            }
        });
    });
}
function canPay(cost, state) {
    return (cost.coin <= state.coin &&
        cost.actions <= state.actions &&
        cost.buys <= state.buys &&
        cost.tests.every(function (t) { return t(state); }));
}
function actChoice(state) {
    function asActChoice(kind) {
        return function (c) {
            return { render: c.id, value: [c, kind] };
        };
    }
    function available(kind) { return function (c) { return c.available(kind, state); }; }
    var hand = state.hand.filter(available('play')).map(asActChoice('play'));
    var supply = state.supply.filter(available('buy')).map(asActChoice('buy'));
    var events = state.events.filter(available('use')).map(asActChoice('use'));
    var play = state.play.filter(available('activate')).map(asActChoice('activate'));
    return choice(state, "Use an event or card in play,\n        pay a buy to buy a card from the supply,\n        or pay an action to play a card from your hand.", hand.concat(supply).concat(events).concat(play), ['actChoice']);
}
// ------------------------------ Start the game
function supplyKey(spec) {
    if (spec.buyCost === undefined)
        return 0;
    return spec.buyCost.coin;
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
export function cardsAndEvents(spec) {
    switch (spec.kind) {
        case 'full': return { cards: Array(10).fill(RANDOM), events: Array(4).fill(RANDOM) };
        case 'half': return { cards: Array(5).fill(RANDOM), events: Array(2).fill(RANDOM) };
        case 'mini': return { cards: Array(3).fill(RANDOM), events: Array(1).fill(RANDOM) };
        case 'test': return { cards: [], events: [] };
        case 'pick': return { cards: [], events: [] };
        case 'pickR': return { cards: spec.cards, events: spec.events };
        default: return assertNever(spec);
    }
}
export function makeKingdom(spec) {
    switch (spec.kind) {
        case 'test':
            return {
                cards: mixins,
                events: eventMixins.concat(cheats),
            };
        case 'pick':
            return { cards: spec.cards, events: spec.events };
        default:
            var kingdom = cardsAndEvents(spec);
            return {
                cards: pickRandoms(kingdom.cards, mixins, 'cards' + spec.seed),
                events: pickRandoms(kingdom.events, eventMixins, 'events' + spec.seed),
            };
    }
}
function randomSeed() {
    return Math.random().toString(36).substring(2, 7);
}
var MalformedSpec = /** @class */ (function (_super) {
    __extends(MalformedSpec, _super);
    function MalformedSpec(s) {
        var _this = _super.call(this, "Not a well-formed game spec: " + s) || this;
        _this.s = s;
        Object.setPrototypeOf(_this, MalformedSpec.prototype);
        return _this;
    }
    return MalformedSpec;
}(Error));
export { MalformedSpec };
export function getTutorialSpec() {
    return {
        cards: [throneRoom],
        events: [duplicate],
        kind: 'pick'
    };
}
function makeDictionary(xs) {
    var e_24, _a;
    var result = new Map();
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            result.set(x.name, x);
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_24) throw e_24.error; }
    }
    return result;
}
function extractList(s, xs) {
    var e_25, _a;
    if (s.length == 0)
        return [];
    var dictionary = makeDictionary(xs);
    var result = [];
    try {
        for (var _b = __values(s.split(',')), _c = _b.next(); !_c.done; _c = _b.next()) {
            var name_5 = _c.value;
            if (name_5 == RANDOM)
                result.push(RANDOM);
            else {
                var lookup = dictionary.get(name_5);
                if (lookup == undefined)
                    throw new MalformedSpec(name_5 + " is not a valid name");
                result.push(lookup);
            }
        }
    }
    catch (e_25_1) { e_25 = { error: e_25_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_25) throw e_25.error; }
    }
    return result;
}
function mapToURL(args) {
    return Array.from(args.entries()).map(function (x) { return x[0] + "=" + x[1]; }).join('&');
}
function renderSlots(slots) {
    var e_26, _a;
    var result = [];
    try {
        for (var slots_1 = __values(slots), slots_1_1 = slots_1.next(); !slots_1_1.done; slots_1_1 = slots_1.next()) {
            var slot = slots_1_1.value;
            if (slot == RANDOM)
                result.push(slot);
            else
                result.push(slot.name);
        }
    }
    catch (e_26_1) { e_26 = { error: e_26_1 }; }
    finally {
        try {
            if (slots_1_1 && !slots_1_1.done && (_a = slots_1.return)) _a.call(slots_1);
        }
        finally { if (e_26) throw e_26.error; }
    }
    return result.join(',');
}
export function specToURL(spec) {
    var args = new Map();
    if (spec.kind != 'full')
        args.set('kind', spec.kind);
    switch (spec.kind) {
        case 'full':
        case 'mini':
        case 'half':
            args.set('seed', spec.seed);
            break;
        case 'pickR':
            args.set('seed', spec.seed);
            args.set('cards', renderSlots(spec.cards));
            args.set('events', renderSlots(spec.events));
            break;
        case 'pick':
            args.set('cards', renderSlots(spec.cards));
            args.set('events', renderSlots(spec.events));
            break;
        case 'test': break;
        default: return assertNever(spec);
    }
    return mapToURL(args);
}
export function specFromURL(search) {
    var e_27, _a, e_28, _b;
    var searchParams = new URLSearchParams(search);
    var urlKind = searchParams.get('kind');
    var cards = searchParams.get('cards');
    var events = searchParams.get('events');
    var seed = searchParams.get('seed') || randomSeed();
    var kind;
    if ((cards === null) != (events === null)) {
        throw new MalformedSpec('Must pick cards iff picking events.');
    }
    if (urlKind !== null) {
        kind = urlKind;
    }
    else {
        if (cards === null || events === null)
            kind = 'full';
        else if (cards.includes(RANDOM) || events.includes(RANDOM))
            kind = 'pickR';
        else
            kind = 'pick';
    }
    switch (kind) {
        case 'full':
        case 'half':
        case 'mini':
            return { kind: kind, seed: seed };
        case 'pick':
            var cardSpecs = [];
            var eventSpecs = [];
            if (cards === null)
                throw new MalformedSpec('Custom kingdoms must pick cards');
            if (events === null)
                throw new MalformedSpec('Custom kingdoms must pick events');
            try {
                for (var _c = __values(extractList(cards, mixins)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var card = _d.value;
                    if (card == RANDOM)
                        throw new MalformedSpec('Random card is only allowable in type pickR');
                    else
                        cardSpecs.push(card);
                }
            }
            catch (e_27_1) { e_27 = { error: e_27_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_27) throw e_27.error; }
            }
            try {
                for (var _e = __values(extractList(events, eventMixins)), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var card = _f.value;
                    if (card == RANDOM)
                        throw new MalformedSpec('Random card is only allowable in type pickR');
                    else
                        eventSpecs.push(card);
                }
            }
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_28) throw e_28.error; }
            }
            return { kind: kind, cards: cardSpecs, events: eventSpecs };
        case 'pickR':
            if (cards === null)
                throw new MalformedSpec('Custom kingdoms must specify cards');
            if (events === null)
                throw new MalformedSpec('Custom kingdoms must specify events');
            return { kind: kind, seed: seed,
                cards: extractList(cards, mixins),
                events: extractList(events, eventMixins) };
        case 'test': return { kind: 'test' };
        default: throw new MalformedSpec("Invalid kind " + kind);
    }
}
function getFixedKingdom(kingdomString) {
    var e_29, _a, e_30, _b;
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
    catch (e_29_1) { e_29 = { error: e_29_1 }; }
    finally {
        try {
            if (mixins_1_1 && !mixins_1_1.done && (_a = mixins_1.return)) _a.call(mixins_1);
        }
        finally { if (e_29) throw e_29.error; }
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
    catch (e_30_1) { e_30 = { error: e_30_1 }; }
    finally {
        try {
            if (cardStrings_1_1 && !cardStrings_1_1.done && (_b = cardStrings_1.return)) _b.call(cardStrings_1);
        }
        finally { if (e_30) throw e_30.error; }
    }
    return result;
}
function pickRandoms(slots, source, seed) {
    var e_31, _a;
    var taken = new Set();
    var result = [];
    var randoms = 0;
    try {
        for (var slots_2 = __values(slots), slots_2_1 = slots_2.next(); !slots_2_1.done; slots_2_1 = slots_2.next()) {
            var slot = slots_2_1.value;
            if (slot == RANDOM) {
                randoms += 1;
            }
            else {
                taken.add(slot.name);
                result.push(slot);
            }
        }
    }
    catch (e_31_1) { e_31 = { error: e_31_1 }; }
    finally {
        try {
            if (slots_2_1 && !slots_2_1.done && (_a = slots_2.return)) _a.call(slots_2);
        }
        finally { if (e_31) throw e_31.error; }
    }
    return result.concat(randomChoices(source.filter(function (x) { return !taken.has(x.name); }), randoms, hash(seed)));
}
export function initialState(spec) {
    var startingHand = [copper, copper, copper, estate, estate];
    var kingdom = makeKingdom(spec);
    var variableSupplies = kingdom.cards.slice();
    var variableEvents = kingdom.events.slice();
    variableSupplies.sort(supplySort);
    variableEvents.sort(supplySort);
    var supply = coreSupplies.concat(variableSupplies);
    var events = coreEvents.concat(variableEvents);
    var state = new State(spec);
    state = createRawMulti(state, supply, 'supply');
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
var cheats = [];
//
// ----------- UTILS -------------------
//
function createEffect(spec, zone) {
    if (zone === void 0) { zone = 'discard'; }
    return {
        text: ["Create " + a(spec.name) + " in your discard pile."],
        transform: function () { return create(spec, zone); },
    };
}
function supplyForCard(card, cost, extra) {
    if (extra === void 0) { extra = {}; }
    var buyTriggers = (extra.onBuy || []).map(function (t) { return ({
        kind: 'buy',
        handles: function (e, s, c) { return e.card.name == c.name; },
        transform: function (e, s, c) { return t.transform(s, c); },
        //TODO: this is pretty sketchy...
        text: "When you buy this, " + t.text.map(lowercase).join(', '),
    }); });
    var triggers = buyTriggers;
    return __assign(__assign({}, card), { buyCost: cost, staticTriggers: triggers.concat(extra.triggers || []), staticReplacers: extra.replacers });
}
function energy(n) {
    return __assign(__assign({}, free), { energy: n });
}
function coin(n) {
    return __assign(__assign({}, free), { coin: n });
}
function trashThis() {
    return {
        text: ['Trash this.'],
        transform: function (s, c) { return trash(c); }
    };
}
function makeCard(card, cost, selfdestruct) {
    if (selfdestruct === void 0) { selfdestruct = false; }
    var effects = [{
            text: ["Create " + a(card.name) + " in play."],
            transform: function () { return create(card, 'play'); }
        }];
    if (selfdestruct)
        effects.push(trashThis());
    return { name: card.name,
        fixedCost: cost,
        effects: effects,
        relatedCards: [card],
    };
}
function registerEvent(card) {
    eventMixins.push(card);
}
//
//
// ------ CORE ------
//
function sortHand(state) {
    return state.sortZone('hand');
}
function ploughTransform(state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, doAll([
                    moveMany(state.discard, 'hand'),
                    moveMany(state.play, 'hand'),
                    sortHand,
                ])(state)];
        });
    });
}
function ploughEffect() {
    return {
        text: ['Put your discard pile and play into your hand'],
        transform: function () { return ploughTransform; }
    };
}
function refreshEffect(n, doRecycle) {
    if (doRecycle === void 0) { doRecycle = true; }
    var text = ['Lose all $, actions, and buys.'];
    if (doRecycle)
        text.push('Put your discard pile and play into your hand.');
    text.push("+" + num(n, 'action') + ", +1 buy.");
    return {
        text: text,
        transform: function (state, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setResource('coin', 0)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('actions', 0)(state)];
                        case 2:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('buys', 0)(state)];
                        case 3:
                            state = _a.sent();
                            if (!doRecycle) return [3 /*break*/, 5];
                            return [4 /*yield*/, ploughTransform(state)];
                        case 4:
                            state = _a.sent();
                            _a.label = 5;
                        case 5: return [4 /*yield*/, gainActions(n, card)(state)];
                        case 6:
                            state = _a.sent();
                            return [4 /*yield*/, gainBuy(state)];
                        case 7:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }; }
    };
}
function gainCoinEffect(n) {
    return {
        text: ["+$" + n + "."],
        transform: function (s, c) { return gainCoin(n, c); },
    };
}
function gainPointsEffect(n) {
    return {
        text: ["+" + n + " vp."],
        transform: function (s, c) { return gainPoints(n, c); },
    };
}
function actionEffect(n) {
    return {
        text: ["+" + num(n, 'action') + "."],
        transform: function (s, c) { return gainActions(n, c); },
    };
}
function gainBuyEffect(n) {
    return {
        text: ["+" + num(n, 'buy') + "."],
        transform: function (state, card) { return gainBuys(n, card); },
    };
}
function buyEffect() {
    return {
        text: ["+1 buy."],
        transform: function () { return gainBuy; },
    };
}
function chargeEffect() {
    return {
        text: ['Put a charge token on this.'],
        transform: function (s, card) { return charge(card, 1); }
    };
}
var refresh = { name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
};
coreEvents.push(refresh);
var copper = { name: 'Copper',
    buyCost: coin(0),
    effects: [gainCoinEffect(1)]
};
coreSupplies.push(copper);
var silver = { name: 'Silver',
    buyCost: coin(3),
    effects: [gainCoinEffect(2)]
};
coreSupplies.push(silver);
var gold = { name: 'Gold',
    buyCost: coin(6),
    effects: [gainCoinEffect(3)]
};
coreSupplies.push(gold);
var estate = { name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [gainPointsEffect(1)]
};
coreSupplies.push(estate);
var duchy = { name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [gainPointsEffect(2)]
};
coreSupplies.push(duchy);
var province = { name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [gainPointsEffect(3)]
};
coreSupplies.push(province);
//
// ----- MIXINS -----
//
function register(card) {
    mixins.push(card);
}
function buyable(card, n) {
    return buyableAnd(card, n, {});
}
function buyableAnd(card, n, extra) {
    card.buyCost = coin(n);
    register(supplyForCard(card, coin(n), extra));
}
function buyableFree(card, coins) {
    buyableAnd(card, coins, { onBuy: [buyEffect()] });
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
function descriptorForKind(kind) {
    switch (kind) {
        case 'play': return 'Cards you play';
        case 'buy': return 'Cards you buy';
        case 'use': return 'Events you use';
        case 'activate': return 'Abilities you use';
        default: return assertNever(kind);
    }
}
function reducedCost(cost, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var newCost = subtractCost(cost, reduction);
    if (nonzero && leq(newCost, free) && !leq(cost, free)) {
        if (reduction.coin || 0 > 0) {
            newCost = addCosts(newCost, { coin: 1 });
        }
        else if (reduction.energy || 0 > 0) {
            newCost = addCosts(newCost, { energy: 1 });
        }
    }
    return newCost;
}
function costReduce(kind, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var descriptor = descriptorForKind(kind);
    return {
        text: descriptor + " cost " + renderCost(reduction, true) + " less" + (nonzero ? ', but not zero.' : '.'),
        kind: 'cost',
        handles: function (x) { return x.actionKind == kind; },
        replace: function (x, state) {
            var newCost = reducedCost(x.cost, reduction, nonzero);
            return __assign(__assign({}, x), { cost: newCost });
        }
    };
}
function costReduceNext(kind, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var descriptor = descriptorForKind(kind);
    return {
        text: descriptor + " cost " + renderCost(reduction, true) + " less" + (nonzero ? ', but not zero.' : '.') + "\n        Whenever this reduces a cost, discard this.",
        kind: 'cost',
        handles: function (x) { return x.actionKind == kind; },
        replace: function (x, state, card) {
            var newCost = reducedCost(x.cost, reduction, nonzero);
            if (!eq(newCost, x.cost))
                newCost.effects = newCost.effects.concat([move(card, 'discard')]);
            return __assign(__assign({}, x), { cost: newCost });
        }
    };
}
function applyToTarget(f, text, options, isCost) {
    if (isCost === void 0) { isCost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var target;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, choice(state, text, options.map(asChoice), ['applyToTarget'])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        if (!(target != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, f(target)(state)];
                    case 2:
                        state = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (target == null && isCost)
                            throw new CostNotPaid('No valid targets');
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
function targetedEffect(f, text, options) {
    return {
        text: [text],
        transform: function (s, c) { return applyToTarget(function (target) { return f(target, c); }, text, options(s)); }
    };
}
function toPlay() {
    return {
        text: ['Put this in play.'],
        transform: function (state, card) { return move(card, 'play'); }
    };
}
function villageReplacer() {
    return costReduceNext('play', { energy: 1 });
}
var necropolis = { name: 'Necropolis',
    effects: [toPlay()],
    replacers: [villageReplacer()],
};
buyableFree(necropolis, 2);
var hound = { name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
};
buyableFree(hound, 2);
var smithy = { name: 'Smithy',
    fixedCost: energy(1),
    effects: [actionEffect(3)],
};
buyable(smithy, 4);
var village = { name: 'Village',
    effects: [actionEffect(1), toPlay()],
    replacers: [villageReplacer()],
};
buyable(village, 4);
var bridge = { name: 'Bridge',
    fixedCost: energy(1),
    effects: [gainCoinEffect(1), buyEffect(), toPlay()],
    replacers: [costReduce('buy', { coin: 1 }, true)]
};
buyable(bridge, 4);
var coven = { name: 'Coven',
    effects: [toPlay()], replacers: [{
            text: 'Cards in your hand cost @ less if you have no card with the same name'
                + ' in your discard pile or play.'
                + ' Whenever this reduces a cost, discard this and +$2.',
            kind: 'cost',
            handles: function (e, state) { return (state.discard.concat(state.play).every(function (c) { return c.name != e.card.name; })); },
            replace: function (x, state, card) {
                if (x.card.place == 'hand') {
                    var newCost = subtractCost(x.cost, { energy: 1 });
                    if (!eq(newCost, x.cost)) {
                        newCost.effects = newCost.effects.concat([move(card, 'discard'), gainCoin(2)]);
                        return __assign(__assign({}, x), { cost: newCost });
                    }
                }
                return x;
            }
        }]
};
buyable(coven, 4);
var lab = { name: 'Lab',
    effects: [actionEffect(2)]
};
buyable(lab, 5);
var payAction = payCost(__assign(__assign({}, free), { actions: 1 }));
function playTwice() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
            target.play(card),
            tick(card),
            target.play(card),
        ]); }, 'Choose a card to play twice.', state.hand)); }
    };
}
var throneRoom = { name: 'Throne Room',
    fixedCost: energy(1),
    effects: [playTwice()]
};
buyable(throneRoom, 5);
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1),
    effects: [toPlay()], triggers: [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            transform: function (e) { return gainCoin(1); },
        }]
};
buyable(coppersmith, 4);
var scavenger = { name: 'Scavenger',
    fixedCost: energy(1), effects: [gainCoinEffect(2), actionEffect(1), targetedEffect(function (target) { return move(target, 'hand'); }, 'Put a card from your discard pile into your hand.', function (state) { return state.discard; })
    ]
};
buyable(scavenger, 4);
var celebration = { name: 'Celebration',
    fixedCost: energy(2),
    effects: [toPlay()],
    replacers: [costReduce('play', { energy: 1 })]
};
buyable(celebration, 10);
var plough = { name: 'Plough',
    fixedCost: energy(2), effects: [{
            text: ['Put your discard pile and play into your hand.'],
            transform: function () { return ploughTransform; }
        }]
};
buyable(plough, 4);
var construction = { name: 'Construction',
    fixedCost: energy(1),
    effects: [toPlay()], triggers: [{
            text: 'Whenever you pay @, gain twice that many actions.',
            kind: 'cost',
            handles: function () { return true; },
            transform: function (e) { return gainActions(2 * e.cost.energy); }
        }]
};
buyable(construction, 3);
var hallOfMirrors = { name: 'Hall of Mirrors', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [{
            text: ['Put a mirror token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'mirror'); }));
            }
        }],
    triggers: [{
            text: "After playing a card with a mirror token on it \n        other than with this, remove a mirror token and play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) {
                var played = state.find(e.card);
                return played.count('mirror') > 0 && e.source.name != card.name;
            },
            transform: function (e, s, card) { return doAll([
                removeToken(e.card, 'mirror'),
                e.card.play(card),
            ]); },
        }]
};
registerEvent(hallOfMirrors);
function costPlus(initial, increment) {
    return {
        calculate: function (card, state) {
            return addCosts(initial, multiplyCosts(increment, state.find(card).count('cost')));
        },
        text: renderCost(initial, true) + " plus " + renderCost(increment, true) + " for each cost token on this.",
    };
}
function incrementCost() {
    return {
        text: ['Put a cost token on this.'],
        transform: function (s, c) { return addToken(c, 'cost'); }
    };
}
var restock = { name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), refreshEffect(5)],
};
registerEvent(restock);
var scrapeBy = { name: 'Scrape By',
    fixedCost: energy(2),
    effects: [refreshEffect(1)],
};
registerEvent(scrapeBy);
var perpetualMotion = { name: 'Perpetual Motion', restrictions: [{
            test: function (card, state) { return state.hand.length > 0; }
        }],
    effects: [{
            text: ["If you have no cards in your hand,\n        put your discard pile into your hand."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(state.hand.length == 0)) return [3 /*break*/, 2];
                                return [4 /*yield*/, moveMany(state.discard, 'hand')(state)];
                            case 1:
                                state = _a.sent();
                                state = sortHand(state);
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(perpetualMotion);
var desperation = { name: 'Desperation',
    fixedCost: energy(1),
    effects: [gainCoinEffect(1)]
};
registerEvent(desperation);
var travelingFair = { name: 'Traveling Fair',
    fixedCost: coin(2),
    effects: [buyEffect(), chargeEffect()], replacers: [{
            text: "Whenever you would create a card in your discard pile,\n        if this has a charge token on it\n        then instead remove a charge token from this and create the card in your hand.",
            kind: 'create',
            handles: function (e, state, card) { return e.zone == 'discard'
                && state.find(card).charge >= 1; },
            replace: function (x, state, card) {
                return (__assign(__assign({}, x), { zone: 'hand', effects: x.effects.concat([charge(card, -1)]) }));
            }
        }]
};
registerEvent(travelingFair);
var philanthropy = { name: 'Philanthropy', fixedCost: __assign(__assign({}, free), { coin: 4, energy: 2 }),
    effects: [{
            text: ['Lose all $.', '+1 vp per $ lost.'],
            transform: function () { return function (state) {
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
            }; }
        }]
};
registerEvent(philanthropy);
var storytelling = { name: 'Storytelling',
    fixedCost: coin(1), effects: [{
            text: ['Lose all $.', '+1 action per $ lost.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.coin;
                                return [4 /*yield*/, setResource('coin', 0)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainActions(n)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(storytelling);
var monument = { name: 'Monument',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), gainPointsEffect(1)],
};
buyable(monument, 2);
var repurpose = { name: 'Repurpose',
    fixedCost: energy(2), effects: [{
            text: ['Lose all $ and buys.'],
            transform: function (state, card) { return doAll([setResource('coin', 0, card),
                setResource('buys', 0, card)]); }
        }, ploughEffect(), buyEffect()]
};
registerEvent(repurpose);
var vibrantCity = { name: 'Vibrant City',
    effects: [gainPointsEffect(1), actionEffect(1)],
};
buyable(vibrantCity, 6);
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than " + max],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var frontier = { name: 'Frontier',
    fixedCost: energy(1), effects: [chargeUpTo(6), {
            text: ['+1 vp per charge token on this.'],
            transform: function (state, card) { return gainPoints(state.find(card).charge, card); }
        }]
};
buyable(frontier, 7);
var investment = { name: 'Investment',
    fixedCost: energy(0), effects: [chargeUpTo(5), {
            text: ['+$1 per charge token on this.'],
            transform: function (state, card) { return gainCoin(state.find(card).charge, card); },
        }]
};
buyable(investment, 4);
var populate = { name: 'Populate', fixedCost: __assign(__assign({}, free), { coin: 12, energy: 3 }),
    effects: [{
            text: ['Buy each card in the supply.'],
            transform: function (state, card) { return doAll(state.supply.map(function (s) { return s.buy(card); })); }
        }]
};
registerEvent(populate);
var duplicate = { name: 'Duplicate', fixedCost: __assign(__assign({}, free), { coin: 5, energy: 1 }),
    effects: [{
            text: ["Put a duplicate token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'duplicate'); })); }
        }],
    triggers: [{
            text: "After buying a card with a duplicate token on it other than with this,\n        remove a duplicate token from it to buy it again.",
            kind: 'afterBuy',
            handles: function (e, state, card) {
                if (e.source.name == card.name)
                    return false;
                var target = state.find(e.card);
                return target.count('duplicate') > 0;
            },
            transform: function (e, state, card) {
                return payToDo(removeToken(e.card, 'duplicate'), e.card.buy(card));
            }
        }]
};
registerEvent(duplicate);
var royalSeal = { name: 'Royal Seal',
    effects: [gainCoinEffect(2), toPlay()], replacers: [{
            text: "Whenever you would create a card in your discard pile, if this is in play\n        then instead create the card in your hand and discard this.",
            kind: 'create',
            handles: function (e, state, card) { return e.zone == 'discard'
                && state.find(card).place == 'play'; },
            replace: function (x, state, card) {
                return (__assign(__assign({}, x), { zone: 'hand', effects: x.effects.concat([move(card, 'discard')]) }));
            }
        }]
};
buyable(royalSeal, 5);
var workshop = { name: 'Workshop',
    fixedCost: energy(0), effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $4.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(4)); }); })]
};
buyable(workshop, 3);
var shippingLane = { name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), toPlay()], triggers: [{
            text: "After buying a card in the supply,\n            if this is in play and was in play when you bought it,\n            then discard it and buy that card again.",
            kind: 'afterBuy',
            handles: function (e, state, card) { return state.find(card).place == 'play'
                && e.before.find(card).place == 'play'; },
            transform: function (e, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, move(card, 'discard')(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, e.card.buy(card)(state)];
                        }
                    });
                });
            }; }
        }]
};
buyable(shippingLane, 5);
var factory = { name: 'Factory',
    fixedCost: energy(1), effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); })]
};
buyable(factory, 4);
var imitation = { name: 'Imitation',
    fixedCost: energy(1), effects: [targetedEffect(function (target, card) { return create(target.spec, 'hand'); }, 'Choose a card in your hand. Create a fresh copy of it in your hand.', function (state) { return state.hand; })]
};
buyable(imitation, 4);
var feast = { name: 'Feast',
    fixedCost: energy(0), effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); }), trashThis()]
};
buyable(feast, 4);
var mobilization = { name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(10)),
    effects: [chargeEffect(), incrementCost()], replacers: [{
            text: refresh.name + " costs @ less to play for each charge token on this.",
            kind: 'cost',
            handles: function (x) { return (x.card.name == refresh.name); },
            replace: function (x, state, card) {
                return (__assign(__assign({}, x), { cost: subtractCost(x.cost, { energy: state.find(card).charge }) }));
            }
        }]
};
registerEvent(mobilization);
function recycleEffect() {
    return {
        text: ['Put your discard pile into your hand.'],
        transform: function (state) { return doAll([moveMany(state.discard, 'hand'), sortHand]); }
    };
}
var recycle = { name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
};
registerEvent(recycle);
var twin = { name: 'Twin', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 8 }),
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })],
    triggers: [{
            text: "After playing a card with a twin token other than with this, play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) { return (e.card.count('twin') > 0 && e.source.id != card.id); },
            transform: function (e, state, card) { return e.card.play(card); },
        }],
};
registerEvent(twin);
var youngSmith = { name: 'Young Smith',
    fixedCost: energy(1), effects: [chargeUpTo(4), {
            text: ['+1 action per charge token on this.'],
            transform: function (state, card) { return gainActions(state.find(card).charge, card); }
        }]
};
buyable(youngSmith, 3);
var oldSmith = { name: 'Old Smith',
    fixedCost: energy(1), effects: [{
            text: ['+4 actions -1 per charge token on this.'],
            transform: function (state, card) { return gainActions(4 - state.find(card).charge, card); },
        }, chargeEffect()]
};
buyable(oldSmith, 3);
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(1), effects: [{
            text: ['Create two golds in your hand.'],
            transform: function () { return doAll([create(gold, 'hand'), create(gold, 'hand')]); },
        }]
};
buyable(goldMine, 8);
function fragile(card) {
    return {
        text: 'Whenever this leaves play, trash it.',
        kind: 'move',
        handles: function (x) { return x.card.id == card.id; },
        transform: function (x) { return trash(x.card); }
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
var expedite = {
    name: 'Expedite',
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [chargeEffect(), incrementCost()],
    triggers: [{
            text: "Whenever you create a card,\n        remove a charge token from this to play that card.",
            kind: 'create',
            handles: function (e, state, card) { return state.find(card).charge > 0; },
            transform: function (e, state, card) { return payToDo(discharge(card, 1), e.card.play(card)); },
        }],
};
registerEvent(expedite);
function removeAllSupplyTokens(token) {
    return {
        text: ["Remove all " + token + " tokens from cards in the supply."],
        transform: function (state, card) { return doAll(state.supply.map(function (s) { return removeTokens(s, token); })); }
    };
}
var synergy = { name: 'Synergy', fixedCost: __assign(__assign({}, free), { coin: 5, energy: 1 }),
    effects: [removeAllSupplyTokens('synergy'), {
            text: ['Put synergy tokens on two cards in the supply.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, cards_1, cards_1_1, card, e_32_1;
                    var _a, e_32, _b;
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
                                card = cards_1_1.value;
                                return [4 /*yield*/, addToken(card, 'synergy')(state)];
                            case 4:
                                state = _c.sent();
                                _c.label = 5;
                            case 5:
                                cards_1_1 = cards_1.next();
                                return [3 /*break*/, 3];
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                e_32_1 = _c.sent();
                                e_32 = { error: e_32_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                                }
                                finally { if (e_32) throw e_32.error; }
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
    triggers: [{
            text: 'Whenever you buy a card with a synergy token other than with this,'
                + ' buy a different card with a synergy token with equal or lesser cost.',
            kind: 'buy',
            handles: function (e, state, card) { return (e.source.id != card.id && e.card.count('synergy') > 0); },
            transform: function (e, state, card) { return applyToTarget(function (target) { return target.buy(card); }, 'Choose a card to buy.', state.supply.concat(state.events).filter(function (c) { return c.count('synergy') > 0
                && leq(c.cost('buy', state), e.card.cost('buy', state))
                && c.id != e.card.id; })); }
        }]
};
registerEvent(synergy);
var shelter = { name: 'Shelter', effects: [targetedEffect(function (target) { return addToken(target, 'shelter'); }, 'Put a shelter token on a card in play.', function (state) { return state.play; })]
};
buyableAnd(shelter, 3, {
    replacers: [{
            kind: 'move',
            text: "Whenever you would move a card with a shelter token from play,\n               instead remove a shelter token from it.",
            handles: function (x, state) { return (x.fromZone == 'play' && state.find(x.card).count('shelter') > 0); },
            replace: function (x) { return (__assign(__assign({}, x), { toZone: 'play', effects: x.effects.concat([removeToken(x.card, 'shelter')]) })); }
        }]
});
var market = {
    name: 'Market',
    effects: [actionEffect(1), gainCoinEffect(1), buyEffect()],
};
buyable(market, 5);
var spree = { name: 'Spree',
    fixedCost: energy(1),
    effects: [buyEffect()],
};
registerEvent(spree);
var counterfeit = { name: 'Counterfeit', effects: [actionEffect(1), buyEffect(), targetedEffect(function (target, card) { return doAll([target.play(card), trash(target)]); }, 'Play a card in your hand, then trash it.', function (state) { return state.hand; })]
};
buyable(counterfeit, 4);
var ruinedMarket = { name: 'Ruined Market',
    effects: [buyEffect()]
};
buyableFree(ruinedMarket, 2);
var spices = { name: 'Spices',
    effects: [gainCoinEffect(2), buyEffect()],
};
buyableAnd(spices, 5, { onBuy: [gainCoinEffect(4)] });
var onslaught = { name: 'Onslaught',
    calculatedCost: costPlus(coin(6), energy(1)), effects: [incrementCost(), {
            text: ["Set aside your hand, then play any number of those cards in any order\n        and discard the rest."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_1, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.hand;
                                return [4 /*yield*/, moveMany(cards, 'aside')(state)];
                            case 1:
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
                                _a.label = 2;
                            case 2:
                                if (!true) return [3 /*break*/, 4];
                                return [5 /*yield**/, _loop_1()];
                            case 3:
                                state_1 = _a.sent();
                                if (typeof state_1 === "object")
                                    return [2 /*return*/, state_1.value];
                                return [3 /*break*/, 2];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(onslaught);
//TODO: link these together, modules in general?
var colony = { name: 'Colony',
    fixedCost: energy(1),
    effects: [gainPointsEffect(5)],
};
buyable(colony, 16);
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effects: [gainCoinEffect(5)]
};
buyable(platinum, 10);
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionEffect(5)]
};
buyable(greatSmithy, 7);
var pressOn = { name: 'Press On',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
};
registerEvent(pressOn);
function KCEffect() {
    return {
        text: ["Pay an action to play a card in your hand three times."],
        transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card),
        ]); }, 'Choose a card to play three times.', state.hand)); }
    };
}
var kingsCourt = { name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()]
};
buyable(kingsCourt, 10);
var gardens = { name: "Gardens",
    fixedCost: energy(1), effects: [{
            text: ['+1 vp per 10 cards in your hand, discard pile, and play.'],
            transform: function (state, card) { return gainPoints(Math.floor((state.hand.length + state.discard.length + state.play.length) / 10), card); }
        }]
};
buyable(gardens, 4);
var decay = { name: 'Decay',
    fixedCost: coin(3), effects: [{
            text: ['Remove a decay token from each card in your discard pile.'],
            transform: function (state) { return doAll(state.discard.map(function (x) { return removeToken(x, 'decay'); })); }
        }],
    triggers: [{
            text: 'Whenever you move a card to your hand, if it has 3 or more decay tokens on it trash it,' +
                ' otherwise put a decay token on it.',
            kind: 'move',
            handles: function (e) { return e.toZone == 'hand'; },
            transform: function (e) { return (e.card.count('decay') >= 3) ?
                trash(e.card) : addToken(e.card, 'decay'); }
        }]
};
registerEvent(decay);
var reflect = { name: 'Reflect', restrictions: [{
            test: function (c, s, k) { return (s.actions < 1 || s.hand.length == 0); }
        }], calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), playTwice()], };
registerEvent(reflect);
var replicate = { name: 'Replicate',
    calculatedCost: costPlus(energy(1), coin(1)), effects: [incrementCost(), targetedEffect(function (target) { return create(target.spec, 'discard'); }, 'Choose a card in your hand. Create a fresh copy of it in your discard pile.', function (state) { return state.hand; })]
};
registerEvent(replicate);
function setCoinEffect(n) {
    return {
        text: ["Set $ to " + n + "."],
        transform: function (s, c) { return setResource('coin', n, c); },
    };
}
function setBuyEffect(n) {
    return {
        text: ["Set buys to " + n + "."],
        transform: function (s, c) { return setResource('buys', n, c); },
    };
}
var inflation = { name: 'Inflation',
    fixedCost: energy(3),
    effects: [setCoinEffect(15), setBuyEffect(5), chargeEffect()], replacers: [{
            text: 'Cards and events that cost at least $1 cost $1 more per charge token on this.',
            kind: 'cost',
            handles: function (p, state) { return (p.cost.coin >= 1); },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, { coin: card.charge }) })); }
        }]
};
registerEvent(inflation);
var burden = { name: 'Burden',
    fixedCost: energy(1), effects: [targetedEffect(function (target) { return removeToken(target, 'burden'); }, 'Remove a burden token from a card in the supply.', function (state) { return state.supply; })],
    triggers: [{
            text: 'Whenever you buy a card in the supply, put a burden token on it.',
            kind: 'buy',
            handles: function (e, state) { return (state.find(e.card).place == 'supply'); },
            transform: function (e) { return addToken(e.card, 'burden'); }
        }],
    replacers: [{
            kind: 'cost',
            text: 'Cards cost $1 more for each burden token on them.',
            handles: function (x) { return x.card.count('burden') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { cost: addCosts(x.cost, { coin: x.card.count('burden') }) })); }
        }]
};
registerEvent(burden);
var goldsmith = { name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionEffect(2), gainCoinEffect(3)]
};
buyable(goldsmith, 7);
var publicWorks = { name: 'Public Works',
    effects: [toPlay()],
    replacers: [costReduceNext('use', { energy: 1 }, true)],
};
buyable(publicWorks, 4);
function echoEffect(card) {
    return create(card.spec, 'play', 'end', function (c) { return addToken(c, 'echo'); });
}
function fragileEcho() {
    return {
        text: 'Whenever you move a card with an echo token on it, trash it.',
        kind: 'move',
        handles: function (x, state) { return state.find(x.card).count('echo') > 0; },
        transform: function (x) { return trash(x.card); }
    };
}
//TODO: handle skip better, other things shouldn't replace it again...
var echo = { name: 'Echo', effects: [targetedEffect(echoEffect, "Choose a card you have in play.\n        Create a fresh copy of it in play with an echo token on it.", function (state) { return state.play; })]
};
buyableAnd(echo, 4, { triggers: [fragileEcho()] });
function dischargeCost(c, n) {
    if (n === void 0) { n = 1; }
    return __assign(__assign({}, free), { effects: [discharge(c, n)], tests: [function (state) { return state.find(c).charge >= n; }] });
}
function discardFromPlay(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place != 'play')
                    throw new CostNotPaid("Card not in play.");
                return [2 /*return*/, move(card, 'discard')(state)];
            });
        });
    };
}
function discardCost(card) {
    return __assign(__assign({}, free), { effects: [discardFromPlay(card)], tests: [function (state) { return state.find(card).place == 'play'; }] });
}
var mastermind = {
    name: 'Mastermind',
    fixedCost: energy(1),
    effects: [toPlay()],
    restrictions: [{
            test: function (c, s, k) { return k == 'activate' && (c.charge < 1); }
        }],
    replacers: [{
            text: "Whenever you would move this from play to your hand,\n            instead put a charge token on it.",
            kind: 'move',
            handles: function (x, state, card) { return (x.fromZone == 'play' && x.toZone == 'hand'
                && x.card.id == card.id); },
            replace: function (x, state, card) {
                return (__assign(__assign({}, x), { skip: true, effects: x.effects.concat([charge(card, 1)]) }));
            }
        }],
    ability: [{
            text: ["Remove a charge counter from this, discard it, and pay 1 action\n        to play a card from your hand three times."],
            transform: function (state, card) { return payToDo(payCost(__assign(__assign({}, free), { actions: 1, effects: [discharge(card, 1), discardFromPlay(card)] })), applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card)
            ]); }, 'Choose a card to play three times.', state.hand)); }
        }],
};
buyable(mastermind, 6);
function chargeVillage() {
    return {
        text: "Cards in your hand @ less to play for each charge token on this.\n            Whenever this reduces a cost by one or more @, remove that many charge tokens from this.",
        kind: 'cost',
        handles: function (x, state, card) { return (state.find(x.card).place == 'hand') && card.charge > 0; },
        replace: function (x, state, card) {
            card = state.find(card);
            var reduction = Math.min(x.cost.energy, card.charge);
            return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([discharge(card, reduction)]) }) });
        }
    };
}
function unchargeOnMove() {
    return {
        text: 'Whenever this leaves play, remove all charge tokens from it.',
        kind: 'move',
        handles: function (x, state, card) { return (x.card.id == card.id &&
            x.fromZone == 'play' && !x.skip); },
        replace: function (x, state, card) { return (__assign(__assign({}, x), { effects: x.effects.concat([uncharge(card)]) })); }
    };
}
//TODO: should "this is in play" always be a requirement for triggers?
var doubleTime = {
    name: 'Double Time',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
            text: 'Whenever you pay @, put that many charge tokens on this.',
            kind: 'cost',
            handles: function (e, state, card) { return e.cost.energy > 0
                && state.find(card).place == 'play'; },
            transform: function (e, state, card) { return charge(card, e.cost.energy); }
        }],
    replacers: [chargeVillage(), unchargeOnMove()]
};
buyable(doubleTime, 3);
var dragon = { name: 'Dragon', effects: [targetedEffect(function (c) { return trash(c); }, 'Trash a card in your hand.', function (s) { return s.hand; }), actionEffect(4), gainCoinEffect(4), buyEffect()]
};
var egg = { name: 'Egg',
    fixedCost: energy(2),
    relatedCards: [dragon], effects: [chargeEffect(), {
            text: ["If this has three or more charge tokens on it, trash it and \n        create " + a(dragon.name) + " in your hand."],
            transform: function (state, card) { return state.find(card).charge >= 3 ?
                doAll([trash(card), create(dragon, 'hand')]) : noop; }
        }]
};
buyable(egg, 4);
var looter = { name: 'Looter', effects: [{
            text: ["Discard up to three cards from your hand.",
                "+1 action per card you discarded."],
            transform: function () { return function (state) {
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
                                return [4 /*yield*/, gainActions(targets.length)(state)];
                            case 3:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(looter, 5);
var empire = { name: 'Empire',
    fixedCost: energy(1),
    effects: [actionEffect(3), gainPointsEffect(3)]
};
buyable(empire, 10);
var Innovation = 'Innovation';
var innovation = { name: Innovation, effects: [actionEffect(1), {
            text: ["If you don't have any cards named " + Innovation + " in play,\n        put this in play."],
            transform: function (state, card) { return move(card, (state.play.some(function (x) { return x.name == Innovation; })) ? 'discard' : 'play'); }
        }],
    triggers: [{
            text: "When you create a card in your discard pile,\n        discard this to play that card.",
            kind: 'create',
            handles: function (e) { return e.zone == 'discard'; },
            transform: function (e, state, card) { return payToDo(discardFromPlay(card), e.card.play(card)); },
        }]
};
buyable(innovation, 6);
var formation = { name: 'Formation',
    effects: [toPlay()], replacers: [{
            text: 'Cards in your hand cost @ less if you have a card with the same name'
                + ' in your discard pile or play.'
                + ' Whenever this reduces a cost, discard this and +$2.',
            kind: 'cost',
            handles: function (e, state) { return e.card.place == 'hand'
                && state.discard.concat(state.play).some(function (c) { return c.name == e.card.name; }); },
            replace: function (x, state, card) {
                var newCost = subtractCost(x.cost, { energy: 1 });
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([
                        move(card, 'discard'),
                        gainCoin(2)
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                return x;
            }
        }]
};
buyable(formation, 4);
var Traveler = 'Traveler';
var traveler = {
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
            text: ["Pay an action to play a card in your hand once for each charge token on this."],
            transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.find(card).charge;
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < Math.min(n, 3))) return [3 /*break*/, 4];
                                return [4 /*yield*/, target.play(card)(state)];
                            case 2:
                                state = _a.sent();
                                state = tick(card)(state);
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }, "Choose a card to play with " + Traveler + ".", state.hand)); }
        }, chargeUpTo(3)]
};
buyable(traveler, 5);
var fountain = {
    name: 'Fountain',
    fixedCost: energy(1),
    effects: [{
            text: ["Lose all actions and $."],
            transform: function (state, card) { return doAll([
                setResource('coin', 0),
                setResource('actions', 0)
            ]); }
        }, actionEffect(7)]
};
buyable(fountain, 5);
var chameleon = {
    name: 'Chameleon',
    replacers: [{
            text: "As long as this has a charge token on it,\n        whenever you would gain $ instead gain that many actions and vice versa.",
            kind: 'resource',
            handles: function (x, state, card) { return state.find(card).charge > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { resource: (x.resource == 'coin') ? 'actions' :
                    (x.resource == 'actions') ? 'coin' :
                        x.resource })); }
        }],
    effects: [{
            text: ["If this has a charge token on it, remove all charge tokens.\n        Otherwise, put a charge token on it."],
            transform: function (state, card) { return (state.find(card).charge > 0) ?
                uncharge(card) : charge(card, 1); },
        }]
};
registerEvent(chameleon);
var grandMarket = {
    name: 'Grand Market',
    restrictions: [{
            text: "You can't buy this if you have any\n        " + copper.name + "s or " + silver.name + "s\n        in your discard pile.",
            test: function (c, s, k) { return k == 'buy' &&
                s.discard.some(function (x) { return x.name == copper.name || x.name == silver.name; }); }
        }],
    effects: [gainCoinEffect(2), actionEffect(1), buyEffect()],
};
buyable(grandMarket, 6);
var greatHearth = {
    name: 'Great Hearth',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
            text: "Whenever you play " + a(estate.name) + ", +1 action.",
            kind: 'play',
            handles: function (e) { return e.card.name == estate.name; },
            transform: function (e, state, card) { return gainActions(1, card); }
        }]
};
buyable(greatHearth, 3);
var homesteading = {
    name: 'Homesteading',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
            text: "Whenever you play " + a(estate.name) + ", put a charge token on this.",
            kind: 'play',
            handles: function (e, state, card) { return e.card.name == estate.name
                && state.find(card).place == 'play'; },
            transform: function (e, state, card) { return charge(card, 1); },
        }],
    replacers: [chargeVillage(), unchargeOnMove()],
};
buyable(homesteading, 3);
var duke = {
    name: 'Duke',
    effects: [toPlay()],
    triggers: [{
            text: "Whenever you play " + a(duchy.name) + ", +1 vp.",
            kind: 'play',
            handles: function (e) { return e.card.name == duchy.name; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
buyable(duke, 4);
var industry = {
    name: 'Industry',
    fixedCost: energy(1),
    effects: [{
            text: ["+1 action per card in play up to a max of 5."],
            transform: function (state, card) { return gainActions(Math.min(state.play.length, 5), card); }
        }]
};
buyable(industry, 4);
var flourishing = {
    name: 'Flourishing',
    calculatedCost: {
        text: "Costs @ if you have less than 10 vp.",
        calculate: function (card, state) { return (state.points < 10) ? energy(1) : free; }
    },
    effects: [actionEffect(2), {
            text: ["If you have at least 20 vp, +1 action."],
            transform: function (state, card) { return (state.points < 20) ? noop : gainCoin(2); }
        }, {
            text: ["If you have at least 30 vp, +1 action."],
            transform: function (state, card) { return (state.points < 30) ? noop : gainCoin(2); }
        }]
};
buyable(flourishing, 2);
var banquet = {
    name: 'Banquet',
    effects: [gainCoinEffect(4), toPlay(), {
            text: ['Put a neglect token on each card in your hand.'],
            transform: function (state) { return doAll(state.hand.map(function (x) { return addToken(x, 'neglect'); })); }
        }],
    triggers: [{
            text: "Whenever a card moves, remove all neglect tokens from it.",
            kind: 'move',
            handles: function (p) { return p.fromZone != p.toZone; },
            transform: function (p) { return removeTokens(p.card, 'neglect'); }
        }],
    replacers: [{
            text: "Whenever you'd move this to your hand,\n            if you have any cards in your hand with a neglect token,\n            instead leave this in play.",
            kind: 'move',
            handles: function (p, state, card) { return p.card.id == card.id && p.toZone == 'hand'
                && state.hand.some(function (c) { return c.count('neglect') > 0; }); },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { skip: true })); }
        }]
};
buyable(banquet, 3);
function countDistinct(xs) {
    var e_33, _a;
    var distinct = new Set();
    var result = 0;
    try {
        for (var xs_2 = __values(xs), xs_2_1 = xs_2.next(); !xs_2_1.done; xs_2_1 = xs_2.next()) {
            var x = xs_2_1.value;
            if (!distinct.has(x)) {
                result += 1;
                distinct.add(x);
            }
        }
    }
    catch (e_33_1) { e_33 = { error: e_33_1 }; }
    finally {
        try {
            if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
        }
        finally { if (e_33) throw e_33.error; }
    }
    return result;
}
var harvest = {
    name: 'Harvest',
    fixedCost: energy(1),
    effects: [{
            text: ["+$1 for every differently-named card in your discard pile\n            up to a max of 5."],
            transform: function (state) { return gainCoin(countDistinct(state.discard.map(function (x) { return x.name; }))); }
        }]
};
buyable(harvest, 3);
var horseTraders = {
    name: 'Horse Traders',
    fixedCost: energy(1),
    effects: [{
            text: ['If you have any actions, lose 1.'],
            transform: function (state, card) { return gainActions(-1, card); }
        }, gainCoinEffect(4), buyEffect()]
};
buyable(horseTraders, 4);
var supplies = {
    name: 'Supplies',
    effects: [gainCoinEffect(1), toPlay()],
    replacers: [{
            text: 'Whenever you would move this to your hand, first +1 action.',
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.toZone == 'hand'; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { effects: p.effects.concat([gainActions(1, c)]) })); }
        }]
};
buyable(supplies, 2);
//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
var haggler = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [gainCoinEffect(2), toPlay()],
    triggers: [{
            text: "Whenever you buy a card the normal way,\n        buy a card in the supply costing at least $1 less.",
            kind: 'buy',
            handles: function (p) { return p.source.name == 'act'; },
            transform: function (p, state, card) { return applyToTarget(function (target) { return target.buy(card); }, "Choose a cheaper card to buy.", state.supply.filter(function (c) { return leq(addCosts(c.cost('buy', state), { coin: 1 }), p.card.cost('buy', state)); })); }
        }]
};
buyable(haggler, 6);
var reuse = {
    name: 'Reuse',
    fixedCost: energy(2),
    effects: [{
            text: ["Play any number of cards in your discard pile without a reuse token.",
                "Put a reuse token on each card played in this way."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_2, state_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.discard.filter(function (c) { return c.count('reuse') == 0; });
                                options = asNumberedChoices(cards);
                                _loop_2 = function () {
                                    var picked, id_2;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options))];
                                            case 1:
                                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2:
                                                id_2 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_2; });
                                                return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _b.sent();
                                                return [4 /*yield*/, addToken(picked, 'reuse')(state)];
                                            case 4:
                                                state = _b.sent();
                                                _b.label = 5;
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                };
                                _a.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 3];
                                return [5 /*yield**/, _loop_2()];
                            case 2:
                                state_2 = _a.sent();
                                if (typeof state_2 === "object")
                                    return [2 /*return*/, state_2.value];
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(reuse);
var polish = {
    name: 'Polish',
    fixedCost: __assign(__assign({}, free), { coin: 2, energy: 1 }),
    effects: [{
            text: ["Put a polish token on each card in your hand."],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'polish'); })); }
        }],
    triggers: [{
            text: "Whenever you play a card with a polish token on it,\n        remove a polish token from it and +$1.",
            kind: 'play',
            handles: function (e, state) { return (e.card.count('polish') > 0); },
            transform: function (e) { return doAll([removeToken(e.card, 'polish'), gainCoin(1)]); }
        }]
};
registerEvent(polish);
//NOT INCLUDED
var slog = {
    name: 'Slog',
    restrictions: [{
            test: function () { return true; }
        }],
    replacers: [{
            text: "Cards that cost at least @ cost an additional @.",
            kind: 'cost',
            handles: function (p, state) { return p.cost.energy > 0; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, { energy: 1 }) })); }
        }]
};
var hesitation = {
    name: 'Hesitation',
    restrictions: [{
            test: function () { return true; }
        }],
    triggers: [{
            text: "Whenever you buy a card without a hesitation token on it,\n        put a hesitation token on it and gain @@.",
            kind: 'buy',
            handles: function (e, state) { return state.find(e.card).count('hesitation') == 0; },
            transform: function (e, state, card) { return doAll([
                addToken(e.card, 'hesitation'),
                gainEnergy(2, card)
            ]); }
        }]
};
registerEvent(hesitation);
var commerce = {
    name: 'Commerce',
    fixedCost: energy(1),
    effects: [{
            text: ["Lose all $.", "Put a charge token on this for each $ lost."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.coin;
                                return [4 /*yield*/, setResource('coin', 0)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, charge(card, n)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
    replacers: [chargeVillage()]
};
registerEvent(commerce);
var reverberate = {
    name: 'Reverberate',
    calculatedCost: costPlus(energy(1), coin(1)),
    effects: [incrementCost(), {
            text: ["For each card in play without an echo token,\n            create a copy in play with an echo token on it."],
            transform: function (state) { return doAll(state.play.filter(function (c) { return c.count('echo') == 0; }).map(echoEffect)); }
        }],
    triggers: [fragileEcho()]
};
registerEvent(reverberate);
var preparations = {
    name: 'Preparations',
    fixedCost: energy(1),
    effects: [toPlay()],
    replacers: [{
            text: "When you move this to your hand, +$2 and +2 actions.",
            kind: 'move',
            handles: function (p, state, card) { return (p.card.id == card.id && p.toZone == 'hand'); },
            replace: function (p) { return (__assign(__assign({}, p), { effects: p.effects.concat([gainCoin(2), gainActions(2)]) })); }
        }]
};
buyable(preparations, 3);
var highway = {
    name: 'Highway',
    effects: [actionEffect(1), toPlay()],
    replacers: [costReduce('buy', { coin: 1 }, true)],
};
buyable(highway, 7);
function nameHasToken(card, token, state) {
    return state.supply.some(function (s) { return s.name == card.name && s.count(token) > 0; });
}
var prioritize = {
    name: 'Prioritize',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 8); }, 'Put eight priority tokens on a card in the supply.', function (state) { return state.supply; })],
    triggers: [{
            text: "Whenever you create a card with the same name\n            as a card in the supply with a priority token,\n            remove a priority token to play the card.",
            kind: 'create',
            handles: function (e, state) { return nameHasToken(e.card, 'priority', state); },
            transform: function (e, state, card) { return payToDo(applyToTarget(function (target) { return removeToken(target, 'priority', true); }, 'Remove a prioritize token.', state.supply.filter(function (target) { return target.name == e.card.name; }), true), e.card.play(card)); }
        }]
};
registerEvent(prioritize);
var composting = {
    name: 'Composting',
    effects: [actionEffect(1), toPlay()],
    triggers: [{
            kind: 'cost',
            text: "Whenever you gain @,\n        put that many cards from your discard pile into your hand.",
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = e.cost.energy;
                                return [4 /*yield*/, multichoiceIfNeeded(state, "Choose up to " + num(n, 'card') + " to put into your hand.", state.discard.map(asChoice), n, true)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [2 /*return*/, moveMany(targets, 'hand')(state)];
                        }
                    });
                });
            }; }
        }]
};
buyable(composting, 4);
var fairyGold = {
    name: 'Fairy Gold',
    effects: [gainCoinEffect(3), {
            text: ["If this has a charge token on it, trash it."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(state.find(card).charge >= 1)) return [3 /*break*/, 2];
                                return [4 /*yield*/, trash(card)(state)];
                            case 1:
                                state = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, chargeEffect()]
};
buyable(fairyGold, 3);
var pathfinding = {
    name: 'Pathfinding',
    fixedCost: __assign(__assign({}, free), { coin: 8, energy: 1 }),
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(function (target) { return addToken(target, 'pathfinding'); }, "Put a pathfinding token on a card in the supply other than Copper.", function (state) { return state.supply.filter(function (target) { return target.name != copper.name; }); })],
    triggers: [{
            kind: 'play',
            text: "Whenever you play a card that has the same name as a card in the supply\n        with a  pathfinding token on it, +1 action.",
            handles: function (e, state) { return nameHasToken(e.card, 'pathfinding', state); },
            transform: function (e, state, card) { return gainActions(1, card); }
        }]
};
registerEvent(pathfinding);
var fortune = {
    name: 'Fortune',
    effects: [{
            text: ["Double your $."],
            transform: function (state, card) { return gainCoin(state.coin); }
        }, {
            text: ["Double your buys."],
            transform: function (state, card) { return gainBuys(state.buys); }
        }]
};
var fortuneSupply = supplyForCard(fortune, coin(12), {
    onBuy: [trashThis()],
});
var gladiatorName = 'Gladiator';
var gladiator = {
    name: gladiatorName,
    relatedCards: [fortuneSupply],
    fixedCost: energy(1),
    effects: [gainCoinEffect(3), targetedEffect(function (target) { return charge(target, 1); }, "Put a charge token on a card named " + gladiatorName + " in the supply.", function (state) { return state.supply.filter(function (s) { return s.name == gladiatorName; }); })],
};
buyableAnd(gladiator, 3, {
    onBuy: [chargeEffect()],
    triggers: [{
            kind: 'gainCharge',
            text: "Whenever this has 6 or more charge tokens on it,\n        trash it and create a " + fortuneSupply.name + " in the supply.",
            handles: function (e, state, card) { return state.find(card).charge >= 6; },
            transform: function (e, state, card) { return doAll([trash(card), create(fortuneSupply, 'supply')]); }
        }]
});
// ------------------ Testing -------------------
var freeMoney = { name: 'Free money',
    fixedCost: energy(0),
    effects: [gainCoinEffect(100), gainBuyEffect(100)],
};
cheats.push(freeMoney);
var freeActions = { name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionEffect(100)],
};
cheats.push(freeActions);
var freePoints = { name: 'Free points',
    fixedCost: energy(0),
    effects: [gainPointsEffect(10)],
};
cheats.push(freePoints);
// ------------ Random placeholder --------------
export var randomPlaceholder = { name: RANDOM };
//# sourceMappingURL=logic.js.map