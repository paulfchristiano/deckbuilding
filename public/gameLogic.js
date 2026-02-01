// ----------------------------- Cards
// Note: Meta-game types (MetaReplacer, MetaTrigger) are in metaLogic.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
// Registry of all rules
export var rules = [];
export function registerRule(rule) {
    rules.push(rule);
}
export var free = { coin: 0, energy: 0, actions: 0, buys: 0, effects: [], tests: [] };
export function sourceHasName(s, name) {
    if (s == 'act' || s == null)
        return false;
    return s.name == name;
}
var Card = /** @class */ (function () {
    function Card(spec, id, ticks, tokens, place, 
    // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
    zoneIndex) {
        if (ticks === void 0) { ticks = [0]; }
        if (tokens === void 0) { tokens = new Map(); }
        if (place === void 0) { place = 'void'; }
        if (zoneIndex === void 0) { zoneIndex = 0; }
        this.spec = spec;
        this.id = id;
        this.ticks = ticks;
        this.tokens = tokens;
        this.place = place;
        this.zoneIndex = zoneIndex;
        this.kind = 'card';
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
        var e_1, _a;
        switch (kind) {
            case 'play':
            case 'use':
                var result = this.spec.fixedCost || free;
                if (this.spec.variableCosts != undefined) {
                    try {
                        for (var _b = __values(this.spec.variableCosts), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var vc = _c.value;
                            result = addCosts(result, vc.calculate(this, state));
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                if (kind == 'play')
                    result = addCosts(result, { actions: 1 });
                return result;
            case 'buy': return addCosts(this.spec.buyCost || free, { buys: 1 });
            case 'activate': return free;
            case 'potion': return free;
            default: return assertNever(kind);
        }
    };
    // the cost after replacement effects
    Card.prototype.cost = function (kind, state) {
        var card = this;
        var initialCost = {
            kind: 'costIncrease',
            actionKind: kind,
            card: card,
            cost: card.baseCost(state, kind)
        };
        var increasedCost = replace(initialCost, state);
        var newCost = replace(__assign(__assign({}, increasedCost), { kind: 'cost' }), state);
        return newCost.cost;
    };
    // the transformation that actually pays the cost, with tracking
    Card.prototype.payCost = function (kind) {
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cost;
                return __generator(this, function (_a) {
                    state = state.log("Paying for ".concat(card.name));
                    cost = card.cost(kind, state);
                    return [2 /*return*/, withTracking(payCost(cost, card), { kind: 'cost', card: card, cost: cost })(state)];
                });
            });
        };
    };
    Card.prototype.play = function (source) {
        return this.activate('play', source);
    };
    Card.prototype.buy = function (source) {
        return this.activate('buy', source);
    };
    Card.prototype.use = function (source) {
        return this.activate('use', source);
    };
    Card.prototype.activate = function (kind, source) {
        var card = this;
        return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var before, trackingSpec, gameEvent, _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            card = state.find(card);
                            state = logAct(state, kind, card);
                            before = state;
                            _a = kind;
                            switch (_a) {
                                case 'play': return [3 /*break*/, 1];
                                case 'potion': return [3 /*break*/, 3];
                                case 'buy': return [3 /*break*/, 5];
                                case 'use': return [3 /*break*/, 6];
                                case 'activate': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 8];
                        case 1:
                            trackingSpec = { kind: 'none', card: card };
                            gameEvent = { kind: 'play', card: card, source: source };
                            state = state.log("Playing ".concat(card.name));
                            state = state.indent();
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 2:
                            state = _c.sent();
                            state = state.unindent();
                            return [3 /*break*/, 9];
                        case 3:
                            trackingSpec = { kind: 'none', card: card };
                            gameEvent = { kind: 'play', card: card, source: source };
                            state = state.log("Drinking ".concat(card.name));
                            state = state.indent();
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 4:
                            state = _c.sent();
                            state = state.unindent();
                            return [3 /*break*/, 9];
                        case 5:
                            trackingSpec = { kind: 'buying', card: card };
                            gameEvent = { kind: 'buy', card: card, source: source };
                            state = state.log("Buying ".concat(card.name));
                            return [3 /*break*/, 9];
                        case 6:
                            trackingSpec = { kind: 'effect', card: card };
                            gameEvent = { kind: 'use', card: card, source: source };
                            state = state.log("Using ".concat(card.name));
                            return [3 /*break*/, 9];
                        case 7:
                            trackingSpec = { kind: 'ability', card: card };
                            gameEvent = { kind: 'activate', card: card, source: source };
                            state = state.log("Activating ".concat(card.name));
                            return [3 /*break*/, 9];
                        case 8: return [2 /*return*/, assertNever(kind)];
                        case 9: return [4 /*yield*/, withTracking(function (state) {
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
                                                    case 'potion': return [3 /*break*/, 2];
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
                        case 10:
                            state = _c.sent();
                            card = state.find(card);
                            _b = kind;
                            switch (_b) {
                                case 'play': return [3 /*break*/, 11];
                                case 'potion': return [3 /*break*/, 15];
                                case 'use': return [3 /*break*/, 19];
                                case 'buy': return [3 /*break*/, 21];
                                case 'activate': return [3 /*break*/, 23];
                            }
                            return [3 /*break*/, 24];
                        case 11:
                            if (!(card.place == 'resolving')) return [3 /*break*/, 13];
                            state = state.indent();
                            return [4 /*yield*/, move(card, card.afterPlayDestination())(state)];
                        case 12:
                            state = _c.sent();
                            state = state.unindent();
                            _c.label = 13;
                        case 13: return [4 /*yield*/, trigger({
                                kind: 'afterPlay',
                                card: card,
                                source: source,
                                before: before,
                            })(state)];
                        case 14:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 15:
                            if (!(card.place == 'resolving')) return [3 /*break*/, 17];
                            state = state.indent();
                            return [4 /*yield*/, move(card, 'void')(state)];
                        case 16:
                            state = _c.sent();
                            state = state.unindent();
                            _c.label = 17;
                        case 17: return [4 /*yield*/, trigger({
                                kind: 'afterPlay',
                                card: card,
                                source: source,
                                before: before,
                            })(state)];
                        case 18:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 19: return [4 /*yield*/, trigger({
                                kind: 'afterUse',
                                card: card,
                                source: source,
                                before: before,
                            })(state)];
                        case 20:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 21: return [4 /*yield*/, trigger({
                                kind: 'afterBuy',
                                card: card,
                                source: source,
                                before: before
                            })(state)];
                        case 22:
                            state = _c.sent();
                            return [2 /*return*/, state];
                        case 23: return [2 /*return*/, state];
                        case 24: return [2 /*return*/, assertNever(kind)];
                    }
                });
            });
        };
    };
    Card.prototype.afterPlayDestination = function () {
        return (this.replacers().length > 0 || this.triggers().length > 0 || this.abilityEffects().length > 0) ?
            'play' : 'discard';
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
// -------------------- Utilities for manipulating costs
export function addCosts(a, b) {
    return {
        coin: a.coin + (b.coin || 0),
        energy: a.energy + (b.energy || 0),
        actions: a.actions + (b.actions || 0),
        buys: a.buys + (b.buys || 0),
        effects: a.effects.concat(b.effects || []),
        tests: a.tests.concat(b.tests || []),
    };
}
export function multiplyCosts(c, n) {
    var e_5, _a;
    var result = {};
    try {
        for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
            var resource = allCostResources_1_1.value;
            var r = c[resource];
            if (r != undefined)
                result[resource] = n * r;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
    if (c.effects != undefined) {
        result.effects = [];
        for (var i = 0; i < n; i++) {
            result.effects = result.effects.concat(c.effects);
        }
    }
    return result;
}
export function subtractCost(c, reduction) {
    return {
        coin: Math.max(0, c.coin - (reduction.coin || 0)),
        energy: Math.max(0, c.energy - (reduction.energy || 0)),
        actions: Math.max(0, c.actions - (reduction.actions || 0)),
        buys: Math.max(0, c.buys - (reduction.buys || 0)),
        effects: c.effects,
        tests: c.tests
    };
}
export function eq(a, b) {
    return a.coin == b.coin && a.energy == b.energy && a.actions == b.actions;
}
export function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy;
}
function firstFreeIndex(cards) {
    var indices = new Set(cards.map(function (card) { return card.zoneIndex; }));
    for (var i = 0; i < cards.length + 1; i++) {
        if (!indices.has(i))
            return i;
    }
}
function insertAt(zone, card) {
    return zone.concat([card]);
}
export var allCostResources = ['coin', 'energy', 'actions', 'buys'];
export var allResources = allCostResources.concat(['points']);
function get(stateUpdate, k, state) {
    return (stateUpdate[k] === undefined) ? state[k] : stateUpdate[k];
}
export var RANDOM = 'random';
export var logTypes = ['all', 'energy', 'acts', 'costs'];
var emptyLog = { 'all': [], 'energy': [], 'acts': [], 'costs': [] };
var State = /** @class */ (function () {
    function State(spec, ui, resources, zones, resolving, nextID, history, future, redo, checkpoint, logs, logIndent) {
        if (resources === void 0) { resources = { coin: 0, energy: 0, points: 0, actions: 0, buys: 0 }; }
        if (zones === void 0) { zones = new Map(); }
        if (resolving === void 0) { resolving = []; }
        if (nextID === void 0) { nextID = 0; }
        if (history === void 0) { history = []; }
        if (future === void 0) { future = []; }
        if (redo === void 0) { redo = []; }
        if (checkpoint === void 0) { checkpoint = null; }
        if (logs === void 0) { logs = emptyLog; }
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
        this.void = zones.get('void') || [];
        this.events = zones.get('events') || [];
        this.potions = zones.get('potions') || [];
        this.relics = zones.get('relics') || [];
        this.vp_goal = spec.vp;
    }
    State.prototype.update = function (stateUpdate) {
        return new State(this.spec, this.ui, get(stateUpdate, 'resources', this), get(stateUpdate, 'zones', this), get(stateUpdate, 'resolving', this), get(stateUpdate, 'nextID', this), get(stateUpdate, 'history', this), get(stateUpdate, 'future', this), get(stateUpdate, 'redo', this), get(stateUpdate, 'checkpoint', this), get(stateUpdate, 'logs', this), get(stateUpdate, 'logIndent', this));
    };
    State.prototype.getZone = function (zone) {
        return this.zones.get(zone) || [];
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
    // Puts card into the position after afterCard, assuming that it was already in the same zone
    State.prototype.moveAfter = function (zone, card, afterCard) {
        var newZones = new Map(this.zones);
        // Check to see that both cards are in the zone, otherwise return
        if (!this[zone].some(function (c) { return c.id == card.id; }))
            return this;
        if (!this[zone].some(function (c) { return c.id == afterCard.id; }))
            return this;
        var currentZone = this[zone].filter(function (c) { return c.id != card.id; });
        var insertIndex = currentZone.findIndex(function (c) { return c.id == afterCard.id; }) + 1;
        var newZone = currentZone.slice(0, insertIndex).concat([card]).concat(currentZone.slice(insertIndex));
        newZone = newZone.map(function (x, i) { return x.update({ zoneIndex: i }); });
        newZones.set(zone, newZone);
        return this.update({ zones: newZones });
    };
    State.prototype.resolvingCards = function () {
        var e_6, _a;
        var result = [];
        try {
            for (var _b = __values(this.resolving), _c = _b.next(); !_c.done; _c = _b.next()) {
                var c = _c.value;
                if (c.kind == 'card')
                    result.push(c);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return result;
    };
    State.prototype.addToZone = function (card, zone) {
        card = card.update({ place: zone });
        if (zone == 'resolving')
            return this.addResolving(card);
        var newZones = new Map(this.zones);
        var currentZone = this[zone];
        card = card.update({ zoneIndex: firstFreeIndex(currentZone) });
        newZones.set(zone, insertAt(currentZone, card));
        return this.update({ zones: newZones });
    };
    State.prototype.remove = function (card) {
        var e_7, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_1 = _d[0], zone = _d[1];
                newZones.set(name_1, zone.filter(function (c) { return c.id != card.id; }));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return this.update({ zones: newZones, resolving: this.resolving.filter(function (c) { return c.id != card.id; }) });
    };
    State.prototype.apply = function (f, card) {
        var e_8, _a;
        var newZones = new Map();
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones.set(name_2, zone.map(function (c) { return (c.id == card.id) ? f(c) : c; }));
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
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
    State.prototype.idMap = function () {
        var e_9, _a, e_10, _b, e_11, _c;
        var byId = new Map();
        try {
            for (var _d = __values(this.zones), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), name_3 = _f[0], zone = _f[1];
                try {
                    for (var zone_1 = (e_10 = void 0, __values(zone)), zone_1_1 = zone_1.next(); !zone_1_1.done; zone_1_1 = zone_1.next()) {
                        var card = zone_1_1.value;
                        byId.set(card.id, card);
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (zone_1_1 && !zone_1_1.done && (_b = zone_1.return)) _b.call(zone_1);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_9) throw e_9.error; }
        }
        try {
            for (var _g = __values(this.resolving), _h = _g.next(); !_h.done; _h = _g.next()) {
                var card = _h.value;
                if (card.kind == 'card') {
                    byId.set(card.id, card);
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return byId;
    };
    State.prototype.find = function (card) {
        var e_12, _a;
        try {
            for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), name_4 = _d[0], zone_2 = _d[1];
                var matches_1 = zone_2.filter(function (c) { return c.id == card.id; });
                if (matches_1.length > 0)
                    return matches_1[0];
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var zone = this.resolving;
        var matches = zone.filter(function (c) { return c.id == card.id; });
        if (matches.length > 0)
            return matches[0];
        return card.update({ place: 'void' });
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
        return this.update({ redo: result == record ? redo : [] });
    };
    State.prototype.addHistory = function (record) {
        return this.update({ history: this.history.concat([record]) });
    };
    State.prototype.log = function (msg, logType) {
        if (logType === void 0) { logType = 'all'; }
        //return this
        var logs = __assign({}, this.logs);
        if (logType == 'all')
            msg = indent(this.logIndent, msg);
        //we need to obliterate future, since we want to log what's happening now
        //we need to backup since we won't remember where we are in the code
        var state = this.update({ future: [] }).backup();
        logs[logType] = logs[logType].concat([[msg, state]]);
        return this.update({ logs: logs });
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
    State.prototype.origin = function () {
        var state = this;
        var prev = state;
        while (prev != null) {
            state = prev;
            prev = state.backup();
        }
        return state;
    };
    State.prototype.hasHistory = function () {
        return this.origin().future.length > 0;
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
        var _this = _super.call(this, "Not a well-formed replay: ".concat(s)) || this;
        _this.s = s;
        Object.setPrototypeOf(_this, MalformedReplay.prototype);
        return _this;
    }
    return MalformedReplay;
}(Error));
export { MalformedReplay };
export function coerceReplayVersion(r) {
    return { actions: r.actions };
}
export function serializeReplay(r) {
    return r.actions.map(function (x) { return x.toString(); }).join(';');
}
export function parseReplay(s) {
    var _a = __read(shiftFirst(s.split(';')), 2), version = _a[0], pieces = _a[1];
    if (version === null)
        throw new MalformedReplay('No version');
    function parsePiece(piece) {
        var result = parseInt(piece);
        if (isNaN(result)) {
            throw new MalformedReplay("".concat(piece, " is not a valid action"));
        }
        return result;
    }
    return { actions: pieces.map(parsePiece) };
}
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
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, rules_1, rules_1_1, rule, ruleCard, _a, _b, rawTrigger, trigger_1, e_13_1, e_14_1, triggers, _c, _d, card, _e, _f, trigger_2, _g, _h, card, _j, _k, trigger_3, triggers_1, triggers_1_1, _l, card, rawTrigger, trigger_4, e_15_1;
            var e_14, _m, e_13, _o, e_16, _p, e_17, _q, e_18, _r, e_19, _s, e_15, _t;
            return __generator(this, function (_u) {
                switch (_u.label) {
                    case 0:
                        initialState = state;
                        _u.label = 1;
                    case 1:
                        _u.trys.push([1, 12, 13, 14]);
                        rules_1 = __values(rules), rules_1_1 = rules_1.next();
                        _u.label = 2;
                    case 2:
                        if (!!rules_1_1.done) return [3 /*break*/, 11];
                        rule = rules_1_1.value;
                        if (!rule.triggers) return [3 /*break*/, 10];
                        ruleCard = new Card({ name: "(rule) ".concat(rule.name) }, -1);
                        _u.label = 3;
                    case 3:
                        _u.trys.push([3, 8, 9, 10]);
                        _a = (e_13 = void 0, __values(rule.triggers)), _b = _a.next();
                        _u.label = 4;
                    case 4:
                        if (!!_b.done) return [3 /*break*/, 7];
                        rawTrigger = _b.value;
                        if (!(rawTrigger.kind == e.kind)) return [3 /*break*/, 6];
                        trigger_1 = rawTrigger;
                        if (!(trigger_1.handles(e, initialState, null)
                            && trigger_1.handles(e, state, null))) return [3 /*break*/, 6];
                        state = state.log("Triggering ".concat(rule.name, " rule"));
                        return [4 /*yield*/, withTracking(trigger_1.transform(e, state, null), { kind: 'trigger', trigger: trigger_1, card: ruleCard })(state)];
                    case 5:
                        state = _u.sent();
                        _u.label = 6;
                    case 6:
                        _b = _a.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_13_1 = _u.sent();
                        e_13 = { error: e_13_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_b && !_b.done && (_o = _a.return)) _o.call(_a);
                        }
                        finally { if (e_13) throw e_13.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        rules_1_1 = rules_1.next();
                        return [3 /*break*/, 2];
                    case 11: return [3 /*break*/, 14];
                    case 12:
                        e_14_1 = _u.sent();
                        e_14 = { error: e_14_1 };
                        return [3 /*break*/, 14];
                    case 13:
                        try {
                            if (rules_1_1 && !rules_1_1.done && (_m = rules_1.return)) _m.call(rules_1);
                        }
                        finally { if (e_14) throw e_14.error; }
                        return [7 /*endfinally*/];
                    case 14:
                        triggers = [];
                        try {
                            for (_c = __values(state.events.concat(state.supply)), _d = _c.next(); !_d.done; _d = _c.next()) {
                                card = _d.value;
                                try {
                                    for (_e = (e_17 = void 0, __values(card.staticTriggers())), _f = _e.next(); !_f.done; _f = _e.next()) {
                                        trigger_2 = _f.value;
                                        triggers.push([card, trigger_2]);
                                    }
                                }
                                catch (e_17_1) { e_17 = { error: e_17_1 }; }
                                finally {
                                    try {
                                        if (_f && !_f.done && (_q = _e.return)) _q.call(_e);
                                    }
                                    finally { if (e_17) throw e_17.error; }
                                }
                            }
                        }
                        catch (e_16_1) { e_16 = { error: e_16_1 }; }
                        finally {
                            try {
                                if (_d && !_d.done && (_p = _c.return)) _p.call(_c);
                            }
                            finally { if (e_16) throw e_16.error; }
                        }
                        try {
                            for (_g = __values(state.play.concat(state.relics)), _h = _g.next(); !_h.done; _h = _g.next()) {
                                card = _h.value;
                                try {
                                    for (_j = (e_19 = void 0, __values(card.triggers())), _k = _j.next(); !_k.done; _k = _j.next()) {
                                        trigger_3 = _k.value;
                                        triggers.push([card, trigger_3]);
                                    }
                                }
                                catch (e_19_1) { e_19 = { error: e_19_1 }; }
                                finally {
                                    try {
                                        if (_k && !_k.done && (_s = _j.return)) _s.call(_j);
                                    }
                                    finally { if (e_19) throw e_19.error; }
                                }
                            }
                        }
                        catch (e_18_1) { e_18 = { error: e_18_1 }; }
                        finally {
                            try {
                                if (_h && !_h.done && (_r = _g.return)) _r.call(_g);
                            }
                            finally { if (e_18) throw e_18.error; }
                        }
                        _u.label = 15;
                    case 15:
                        _u.trys.push([15, 20, 21, 22]);
                        triggers_1 = __values(triggers), triggers_1_1 = triggers_1.next();
                        _u.label = 16;
                    case 16:
                        if (!!triggers_1_1.done) return [3 /*break*/, 19];
                        _l = __read(triggers_1_1.value, 2), card = _l[0], rawTrigger = _l[1];
                        if (!(rawTrigger.kind == e.kind)) return [3 /*break*/, 18];
                        trigger_4 = rawTrigger;
                        if (!(trigger_4.handles(e, initialState, card)
                            && trigger_4.handles(e, state, card))) return [3 /*break*/, 18];
                        state = state.log("Triggering ".concat(card));
                        return [4 /*yield*/, withTracking(trigger_4.transform(e, state, card), { kind: 'trigger', trigger: trigger_4, card: card })(state)];
                    case 17:
                        state = _u.sent();
                        _u.label = 18;
                    case 18:
                        triggers_1_1 = triggers_1.next();
                        return [3 /*break*/, 16];
                    case 19: return [3 /*break*/, 22];
                    case 20:
                        e_15_1 = _u.sent();
                        e_15 = { error: e_15_1 };
                        return [3 /*break*/, 22];
                    case 21:
                        try {
                            if (triggers_1_1 && !triggers_1_1.done && (_t = triggers_1.return)) _t.call(triggers_1);
                        }
                        finally { if (e_15) throw e_15.error; }
                        return [7 /*endfinally*/];
                    case 22: return [2 /*return*/, state];
                }
            });
        });
    };
}
function replace(x, state) {
    var e_20, _a, e_21, _b, e_22, _c, e_23, _d, e_24, _e, e_25, _f, e_26, _g;
    // First, process normal replacers
    var replacers = [];
    try {
        for (var _h = __values(state.events.concat(state.supply).concat(state.relics)), _j = _h.next(); !_j.done; _j = _h.next()) {
            var card = _j.value;
            try {
                for (var _k = (e_21 = void 0, __values(card.staticReplacers())), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var replacer = _l.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
                }
                finally { if (e_21) throw e_21.error; }
            }
        }
    }
    catch (e_20_1) { e_20 = { error: e_20_1 }; }
    finally {
        try {
            if (_j && !_j.done && (_a = _h.return)) _a.call(_h);
        }
        finally { if (e_20) throw e_20.error; }
    }
    try {
        for (var _m = __values(state.play), _o = _m.next(); !_o.done; _o = _m.next()) {
            var card = _o.value;
            try {
                for (var _p = (e_23 = void 0, __values(card.replacers())), _q = _p.next(); !_q.done; _q = _p.next()) {
                    var replacer = _q.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_23_1) { e_23 = { error: e_23_1 }; }
            finally {
                try {
                    if (_q && !_q.done && (_d = _p.return)) _d.call(_p);
                }
                finally { if (e_23) throw e_23.error; }
            }
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (_o && !_o.done && (_c = _m.return)) _c.call(_m);
        }
        finally { if (e_22) throw e_22.error; }
    }
    try {
        for (var replacers_1 = __values(replacers), replacers_1_1 = replacers_1.next(); !replacers_1_1.done; replacers_1_1 = replacers_1.next()) {
            var _r = __read(replacers_1_1.value, 2), card = _r[0], rawReplacer = _r[1];
            if (rawReplacer.kind == x.kind) {
                var replacer = rawReplacer;
                if (replacer.handles(x, state, card)) {
                    x = replacer.replace(x, state, card);
                }
            }
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_e = replacers_1.return)) _e.call(replacers_1);
        }
        finally { if (e_24) throw e_24.error; }
    }
    try {
        // Then, process rule replacers (they replace after all other replacers)
        for (var rules_2 = __values(rules), rules_2_1 = rules_2.next(); !rules_2_1.done; rules_2_1 = rules_2.next()) {
            var rule = rules_2_1.value;
            if (rule.replacers) {
                try {
                    for (var _s = (e_26 = void 0, __values(rule.replacers)), _t = _s.next(); !_t.done; _t = _s.next()) {
                        var rawReplacer = _t.value;
                        if (rawReplacer.kind == x.kind) {
                            var replacer = rawReplacer;
                            if (replacer.handles(x, state, rule)) {
                                x = replacer.replace(x, state, rule);
                            }
                        }
                    }
                }
                catch (e_26_1) { e_26 = { error: e_26_1 }; }
                finally {
                    try {
                        if (_t && !_t.done && (_g = _s.return)) _g.call(_s);
                    }
                    finally { if (e_26) throw e_26.error; }
                }
            }
        }
    }
    catch (e_25_1) { e_25 = { error: e_25_1 }; }
    finally {
        try {
            if (rules_2_1 && !rules_2_1.done && (_f = rules_2.return)) _f.call(rules_2);
        }
        finally { if (e_25) throw e_25.error; }
    }
    return x;
}
var Shadow = /** @class */ (function () {
    function Shadow(id, spec, tick) {
        if (tick === void 0) { tick = 1; }
        this.id = id;
        this.spec = spec;
        this.tick = tick;
        this.kind = 'shadow';
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
export function tick(card) {
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
// ---------------------- Creating and moving cards
export function create(spec, zone, postprocess, tokens) {
    if (zone === void 0) { zone = 'discard'; }
    if (postprocess === void 0) { postprocess = function () { return noop; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var card;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createAndTrack(spec, zone, tokens)(state)];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), card = _a[0], state = _a[1];
                        if (!(card != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, postprocess(card)(state)];
                    case 2:
                        state = _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, state];
                }
            });
        });
    };
}
function createRaw(state, spec, zone, tokens) {
    var _a, e_27, _b;
    if (zone === void 0) { zone = 'discard'; }
    var id;
    _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
    var card = new Card(spec, id);
    if (tokens != undefined) {
        try {
            for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                var _c = __read(tokens_1_1.value, 2), token = _c[0], n = _c[1];
                card.tokens.set(token, n);
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (tokens_1_1 && !tokens_1_1.done && (_b = tokens_1.return)) _b.call(tokens_1);
            }
            finally { if (e_27) throw e_27.error; }
        }
    }
    state = state.addToZone(card, zone);
    return [state, card];
}
function createRawMulti(state, specs, zone) {
    var e_28, _a, _b;
    if (zone === void 0) { zone = 'discard'; }
    try {
        for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
            var spec = specs_1_1.value;
            var card = void 0;
            _b = __read(createRaw(state, spec, zone), 2), state = _b[0], card = _b[1];
        }
    }
    catch (e_28_1) { e_28 = { error: e_28_1 }; }
    finally {
        try {
            if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        }
        finally { if (e_28) throw e_28.error; }
    }
    return state;
}
export function createAndTrack(spec, zone, tokens) {
    if (zone === void 0) { zone = 'discard'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params, card, _a, _b, effect, e_29_1;
            var _c, e_29, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        params = { kind: 'create', spec: spec, zone: zone, effects: [], tokens: tokens };
                        params = replace(params, state);
                        spec = params.spec;
                        card = null;
                        if (!(params.zone != null)) return [3 /*break*/, 9];
                        _c = __read(createRaw(state, spec, params.zone, params.tokens), 2), state = _c[0], card = _c[1];
                        return [4 /*yield*/, trigger({ kind: 'create', card: card, zone: params.zone })(state)];
                    case 1:
                        state = _e.sent();
                        _e.label = 2;
                    case 2:
                        _e.trys.push([2, 7, 8, 9]);
                        _a = __values(params.effects), _b = _a.next();
                        _e.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        effect = _b.value;
                        return [4 /*yield*/, effect(card)(state)];
                    case 4:
                        state = _e.sent();
                        _e.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_29_1 = _e.sent();
                        e_29 = { error: e_29_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_29) throw e_29.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, [card, state]];
                }
            });
        });
    };
}
export function createAndPlay(spec, source) {
    return create(spec, 'void', (function (c) { return c.play(source); }));
}
export function move(card, toZone, logged) {
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b, effect, e_30_1;
            var e_30, _c;
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
                        if (toZone == 'void') {
                            if (!logged)
                                state = state.log("Trashed ".concat(card.name, " from ").concat(card.place));
                        }
                        else {
                            if (!logged)
                                state = state.log("Moved ".concat(card.name, " from ").concat(card.place, " to ").concat(toZone));
                        }
                        state = state.addToZone(card, toZone);
                        return [4 /*yield*/, trigger({ kind: 'move', fromZone: card.place, toZone: toZone, card: card })(state)];
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
                        e_30_1 = _d.sent();
                        e_30 = { error: e_30_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_30) throw e_30.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, state];
                }
            });
        });
    };
}
// ----------------------------- Formatting
export function renderCost(cost, full) {
    var e_31, _a;
    if (full === void 0) { full = false; }
    var parts = [];
    var toRender = full ? allCostResources : ['coin', 'energy'];
    try {
        for (var toRender_1 = __values(toRender), toRender_1_1 = toRender_1.next(); !toRender_1_1.done; toRender_1_1 = toRender_1.next()) {
            var name_5 = toRender_1_1.value;
            var x = cost[name_5];
            if (x != undefined && x > 0)
                parts.push(renderResource(name_5, x));
        }
    }
    catch (e_31_1) { e_31 = { error: e_31_1 }; }
    finally {
        try {
            if (toRender_1_1 && !toRender_1_1.done && (_a = toRender_1.return)) _a.call(toRender_1);
        }
        finally { if (e_31) throw e_31.error; }
    }
    return parts.join(' ');
}
export function renderCostOrZero(cost) {
    return renderCost(cost) || '$0';
}
//renders either "1 x" or "n xs" as appropriate
export function num(n, x) {
    return "".concat(n, " ").concat(x).concat(n == 1 ? '' : 's');
}
export function aOrNum(n, x) {
    return (n == 1) ? a(x) : "".concat(n, " ").concat(x, "s");
}
//renders either "a" or "an" as appropriate
export function a(s) {
    var c = s[0].toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s;
    return 'a ' + s;
}
export function lowercaseFirst(s) {
    return s[0].toLowerCase() + s.slice(1);
}
function renderResource(resource, amount) {
    if (amount < 0)
        return '-' + renderResource(resource, -amount);
    switch (resource) {
        case 'coin': return "$".concat(amount);
        case 'energy':
            if (amount > 5 || amount % 1 != 0)
                return "@x".concat(amount);
            else
                return repeatSymbol('@', amount);
        case 'points': return "".concat(amount, " vp");
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
// ---------------------- Gaining resoucres
function logChange(state, noun, n, positive, negative) {
    if (n == 1) {
        return state.log(positive[0] + a(noun) + positive[1]);
    }
    else if (n > 1) {
        return state.log(positive[0] + "".concat(n, " ") + noun + 's' + positive[1]);
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
export function payCost(c, source) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, effect, e_32_1;
            var e_32, _c;
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
                        if (renderCost(c, true) != '') {
                            state = state.log("Paid ".concat(renderCost(c, true)));
                        }
                        if (renderCost(c, false) != '') {
                            state = state.log("".concat(renderCost(c, false), " for ").concat(source), 'costs');
                        }
                        if (c.energy > 0) {
                            state = state.log("".concat(c.energy, " for ").concat(source), "energy");
                        }
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
                        e_32_1 = _d.sent();
                        e_32 = { error: e_32_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_32) throw e_32.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, trigger({ kind: 'cost', cost: c, source: source })(state)];
                }
            });
        });
    };
}
export function gainResource(resource, amount, source) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var newResources, params, _a, _b, transform, e_33_1;
            var e_33, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
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
                            source: source,
                            effects: []
                        };
                        params = replace(params, state);
                        resource = params.resource;
                        amount = params.amount;
                        newResources[resource] = Math.max(newResources[resource] + amount, 0);
                        state = state.setResources(newResources);
                        state = state.log(amount > 0 ?
                            "Gained ".concat(renderResource(resource, amount)) :
                            "Lost ".concat(renderResource(resource, -amount)));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(params.effects), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        transform = _b.value;
                        return [4 /*yield*/, transform(state)];
                    case 3:
                        state = _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_33_1 = _d.sent();
                        e_33 = { error: e_33_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_33) throw e_33.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, trigger({ kind: 'resource', resource: resource, amount: amount, source: source })(state)];
                }
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
var ReplayVictory = /** @class */ (function (_super) {
    __extends(ReplayVictory, _super);
    function ReplayVictory(state) {
        var _this = _super.call(this, 'ReplayVictory') || this;
        _this.state = state;
        Object.setPrototypeOf(_this, ReplayVictory.prototype);
        return _this;
    }
    return ReplayVictory;
}(Error));
export { ReplayVictory };
export var DEFAULT_VP_GOAL = 40;
export function gainPoints(n, source) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var vp_goal, victoryParams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gainResource('points', n, source)(state)];
                    case 1:
                        state = _a.sent();
                        vp_goal = state.vp_goal;
                        if (vp_goal > 0 && state.points >= vp_goal) {
                            victoryParams = replace({ kind: 'victory', victory: true }, state);
                            if (victoryParams.victory)
                                throw new Victory(state);
                        }
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
export function literalOptions(xs, keys) {
    return xs.map(function (x, i) { return ({
        render: { kind: 'string', string: x },
        hotkeyHint: { kind: 'key', val: keys[i] },
        value: x
    }); });
}
export function discharge(card, n) {
    return charge(card, -n, true);
}
export function uncharge(card) {
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
export function charge(card, n, cost) {
    if (n === void 0) { n = 1; }
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
                state = logChange(state, 'charge token', newCharge - oldCharge, ['Added ', " to ".concat(card.name)], ['Removed ', " from ".concat(card.name)]);
                return [2 /*return*/, trigger({ kind: 'gainCharge', card: card,
                        oldCharge: oldCharge, newCharge: newCharge, cost: cost })(state)];
            });
        });
    };
}
function logTokenChange(state, card, token, n) {
    return logChange(state, "".concat(token, " token"), n, ['Added ', " to ".concat(card.name)], ['Removed ', " from ".concat(card.name)]);
}
export function addToken(card, token, n) {
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
export function removeToken(card, token, n, isCost) {
    if (n === void 0) { n = 1; }
    if (isCost === void 0) { isCost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var current, removed, newCard;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null) {
                    if (isCost)
                        throw new CostNotPaid("Couldn't remove ".concat(token, " token."));
                    return [2 /*return*/, state];
                }
                current = card.count(token);
                if (n != 'all' && n > current && isCost)
                    throw new CostNotPaid("Couldn't remove ".concat(num(n, token + ' token'), "."));
                removed = (n == 'all') ? current : Math.min(current, n);
                newCard = card.addTokens(token, -removed);
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
    function InvalidHistory(index, state) {
        var _this = _super.call(this, "Index ".concat(index, " does not correspond to a valid choice")) || this;
        _this.index = index;
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
var UndoPastBeginning = /** @class */ (function (_super) {
    __extends(UndoPastBeginning, _super);
    function UndoPastBeginning() {
        var _this = _super.call(this, 'UndoPastBeginning') || this;
        Object.setPrototypeOf(_this, UndoPastBeginning.prototype);
        return _this;
    }
    return UndoPastBeginning;
}(Error));
export { UndoPastBeginning };
var SetState = /** @class */ (function (_super) {
    __extends(SetState, _super);
    function SetState(state) {
        var _this = _super.call(this, 'Undo') || this;
        _this.state = state;
        Object.setPrototypeOf(_this, SetState.prototype);
        return _this;
    }
    return SetState;
}(Error));
export { SetState };
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
export function choice(state_1, prompt_1, options_1) {
    return __awaiter(this, arguments, void 0, function (state, prompt, options, info, chosen) {
        var index, indices, newState;
        var _a;
        if (info === void 0) { info = []; }
        if (chosen === void 0) { chosen = []; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (options.length == 0 && info.indexOf('actChoice') == -1)
                        return [2 /*return*/, [state, null]];
                    return [4 /*yield*/, doOrReplay(state, function () { return state.ui.choice(state, prompt, options, info, chosen); })];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 2]), newState = _a[0], index = _a[1];
                    if (index >= options.length || index < 0)
                        throw new InvalidHistory(index, state);
                    return [2 /*return*/, [newState, options[index].value]];
            }
        });
    });
}
export function multichoice(state_1, prompt_1, options_1) {
    return __awaiter(this, arguments, void 0, function (state, prompt, options, max, min, info) {
        var chosen, nextOptions, next, k;
        var _a;
        if (max === void 0) { max = null; }
        if (min === void 0) { min = 0; }
        if (info === void 0) { info = []; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chosen = [];
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    if (max != null && chosen.length == max)
                        return [3 /*break*/, 3];
                    if (chosen.length < min && chosen.length == options.length)
                        return [3 /*break*/, 3];
                    nextOptions = options.map(function (option, i) { return (__assign(__assign({}, option), { value: i })); });
                    if (chosen.length >= min) {
                        nextOptions = allowNull(nextOptions, 'Done');
                    }
                    next = void 0;
                    return [4 /*yield*/, choice(state, prompt, nextOptions, info, chosen)];
                case 2:
                    _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], next = _a[1];
                    if (next === null)
                        return [3 /*break*/, 3];
                    k = chosen.indexOf(next);
                    if (k == -1) {
                        chosen.push(next);
                    }
                    else {
                        chosen.splice(k, 1);
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, [state, chosen.map(function (i) { return options[i].value; })]];
            }
        });
    });
}
export function asChoice(x) {
    return { render: { kind: 'card', card: x }, value: x };
}
export function asNumberedChoices(xs) {
    return xs.map(function (card, i) { return ({
        render: { kind: 'card', card: card },
        value: card,
        hotkeyHint: { kind: 'number', val: i }
    }); });
}
export function allowNull(options, message) {
    if (message === void 0) { message = "None"; }
    var newOptions = options.slice();
    newOptions.push({
        render: { kind: 'string', string: message },
        value: null,
        hotkeyHint: { kind: 'none' }
    });
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
                throw new UndoPastBeginning();
        }
        else {
            return state.addRedo(last);
        }
    }
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
export function payToDo(cost, effect, fallback) {
    if (fallback === void 0) { fallback = null; }
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
    }, fallback);
}
export function doAll(effects) {
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
export function repeat(t, n) {
    return doAll(Array(n).fill(t));
}
export function noop(state) {
    return state;
}
// --------------------- act
// This is the 'default' choice the player makes when nothing else is happening
function logAct(state, act, card) {
    switch (act) {
        case 'play': return state.log("Played ".concat(card.name), 'acts');
        case 'buy':
            //state = state.log(card.name, 'buys')
            return state.log("Bought ".concat(card.name), 'acts');
        case 'use':
            //state = state.log(card.name, 'buys')
            return state.log("Used ".concat(card.name), 'acts');
        case 'potion': return state.log("Drank ".concat(card.name), 'acts');
        case 'activate': return state;
        default: assertNever(act);
    }
}
function act(state) {
    return __awaiter(this, void 0, void 0, function () {
        var picked, _a, card, kind;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, actChoice(state)];
                case 1:
                    _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                    if (picked == null) {
                        throw new Error('No valid options.');
                    }
                    _a = __read(picked, 2), card = _a[0], kind = _a[1];
                    return [2 /*return*/, payToDo(card.payCost(kind), card.activate(kind, 'act'))(state)];
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
            return { render: { kind: 'card', card: c }, value: [c, kind] };
        };
    }
    function available(kind) { return function (c) { return c.available(kind, state); }; }
    var hand = state.hand.filter(available('play')).map(asActChoice('play'));
    var supply = state.supply.filter(available('buy')).map(asActChoice('buy'));
    var events = state.events.filter(available('use')).map(asActChoice('use'));
    var play = state.play.filter(available('activate')).map(asActChoice('activate'));
    var potions = state.potions.filter(available('potion')).map(asActChoice('potion'));
    return choice(state, "Buy a card (costs 1 buy),\n        play a card from your hand (costs 1 action),\n        use an event, or drink a potion.", hand.concat(supply).concat(events).concat(play).concat(potions), ['actChoice']);
    /*
    return choice(state, `Use an event or card in play,
        pay a buy to buy a card from the supply,
        or pay an action to play a card from your hand.`,
        hand.concat(supply).concat(events).concat(play), ['actChoice'])
    */
}
// ------------------------------ Start the game
export function coinKey(spec) {
    if (spec.buyCost !== undefined)
        return spec.buyCost.coin;
    return 0;
}
export function coinEventKey(spec) {
    return (spec.fixedCost || free).coin;
}
export function energyEventKey(spec) {
    return (spec.fixedCost || free).energy;
}
export function toComp(key) {
    return function (a, b) { return key(a) - key(b); };
}
export function nameComp(a, b) {
    return a.name.localeCompare(b.name, 'en');
}
function lexical(comps) {
    return function (a, b) {
        var e_34, _a;
        try {
            for (var comps_1 = __values(comps), comps_1_1 = comps_1.next(); !comps_1_1.done; comps_1_1 = comps_1.next()) {
                var comp = comps_1_1.value;
                var result = comp(a, b);
                if (result != 0)
                    return result;
            }
        }
        catch (e_34_1) { e_34 = { error: e_34_1 }; }
        finally {
            try {
                if (comps_1_1 && !comps_1_1.done && (_a = comps_1.return)) _a.call(comps_1);
            }
            finally { if (e_34) throw e_34.error; }
        }
        return 0;
    };
}
export var supplyComp = lexical([
    toComp(coinKey), nameComp
]);
export var eventComp = lexical([
    toComp(coinEventKey), toComp(energyEventKey), nameComp
]);
function maxID(cards) {
    var e_35, _a;
    var max = 0;
    try {
        for (var cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
            var card = cards_1_1.value;
            if (card.id > max)
                max = card.id;
        }
    }
    catch (e_35_1) { e_35 = { error: e_35_1 }; }
    finally {
        try {
            if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
        }
        finally { if (e_35) throw e_35.error; }
    }
    return max;
}
export function initialState(spec, ui) {
    var e_36, _a, e_37, _b;
    var state = new State(spec, ui);
    try {
        for (var _c = __values(spec.potions), _d = _c.next(); !_d.done; _d = _c.next()) {
            var potion = _d.value;
            state = state.addToZone(potion, 'potions');
        }
    }
    catch (e_36_1) { e_36 = { error: e_36_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_36) throw e_36.error; }
    }
    try {
        for (var _e = __values(spec.relics), _f = _e.next(); !_f.done; _f = _e.next()) {
            var relic = _f.value;
            state = state.addToZone(relic, 'relics');
        }
    }
    catch (e_37_1) { e_37 = { error: e_37_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_37) throw e_37.error; }
    }
    state = state.update({ nextID: maxID(spec.potions.concat(spec.relics)) + 1 });
    state = createRawMulti(state, core.cards.concat(spec.cards), 'supply');
    state = createRawMulti(state, core.events.concat(spec.events), 'events');
    state = createRawMulti(state, [copper, copper, copper], 'discard');
    return state;
}
function reversed(it) {
    var xs = Array.from(it);
    xs.reverse();
    return xs.values();
}
function undoOrSet(to, from) {
    var e_38, _a;
    var newHistory = to.origin().future;
    var oldHistory = from.origin().future;
    var newRedo = from.redo.slice();
    var predecessor = to.spec == from.spec;
    if (predecessor) {
        try {
            for (var _b = __values(reversed(oldHistory.entries())), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), i = _d[0], e = _d[1];
                if (i >= newHistory.length) {
                    newRedo.push(e);
                }
                else if (newHistory[i] != e) {
                    predecessor = false;
                }
            }
        }
        catch (e_38_1) { e_38 = { error: e_38_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_38) throw e_38.error; }
        }
    }
    return predecessor ? to.update({ redo: newRedo, ui: from.ui }) : to;
}
export function playGame(spec, ui) {
    return __awaiter(this, void 0, void 0, function () {
        var state, victorious, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    state = initialState(spec, ui);
                    return [4 /*yield*/, trigger({ kind: 'gameStart' })(state)];
                case 1:
                    state = _a.sent();
                    victorious = false;
                    _a.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 10];
                    state = state.setCheckpoint();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, , 9]);
                    if (!victorious) return [3 /*break*/, 5];
                    return [4 /*yield*/, state.ui.victory(state)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, { score: state.energy, potionsRemaining: state.potions }];
                case 5: return [4 /*yield*/, act(state)];
                case 6:
                    state = _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_2 = _a.sent();
                    victorious = false;
                    if (error_2 instanceof Undo) {
                        state = undo(error_2.state);
                    }
                    else if (error_2 instanceof Victory) {
                        state = error_2.state;
                        victorious = true;
                    }
                    else if (error_2 instanceof SetState) {
                        state = undoOrSet(error_2.state, state);
                    }
                    else {
                        throw error_2;
                    }
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 2];
                case 10: return [2 /*return*/];
            }
        });
    });
}
export function refreshEffect(n) {
    return {
        text: [
            'Lose all $, actions, and buys.',
            "Return all cards from your discard and play to your hand.",
            "+".concat(num(n, 'action'), ", +1 buy.")
        ],
        transform: function (state, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setResource('coin', 0, card)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('actions', 0, card)(state)];
                        case 2:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('buys', 0, card)(state)];
                        case 3:
                            state = _a.sent();
                            return [4 /*yield*/, moveMany(state.discard, 'hand')(state)];
                        case 4:
                            state = _a.sent();
                            return [4 /*yield*/, moveMany(state.play, 'hand')(state)];
                        case 5:
                            state = _a.sent();
                            state = sortHand(state);
                            return [4 /*yield*/, gainActions(n, card)(state)];
                        case 6:
                            state = _a.sent();
                            return [4 /*yield*/, gainBuys(1, card)(state)];
                        case 7:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }; }
    };
}
export function fountainEffect() {
    return {
        text: [
            'Lose all $, actions, and buys.',
            "+5 actions, +1 buy."
        ],
        transform: function (state, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, setResource('coin', 0, card)(state)];
                        case 1:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('actions', 0, card)(state)];
                        case 2:
                            state = _a.sent();
                            return [4 /*yield*/, setResource('buys', 0, card)(state)];
                        case 3:
                            state = _a.sent();
                            return [4 /*yield*/, gainActions(5, card)(state)];
                        case 4:
                            state = _a.sent();
                            return [4 /*yield*/, gainBuys(1, card)(state)];
                        case 5:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }; }
    };
}
//
//
// ------ CORE ------
//
export var core = {
    cards: [],
    events: []
};
export var refresh = { name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
};
core.events.push(refresh);
export var cheat = { name: 'Cheat',
    fixedCost: energy(0),
    effects: [pointsEffect(10)],
};
//core.events.push(cheat)
export var copper = { name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
};
core.cards.push(copper);
export var silver = { name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
};
core.cards.push(silver);
export var gold = { name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
};
core.cards.push(gold);
// ========== GLOBAL RULES ==========
// Echo rule: cards with echo tokens are trashed when moving to hand or discard
export var echoRule = {
    name: 'Echo',
    replacers: [{
            text: "Whenever a card with an echo token would move to your hand or discard, trash it instead.",
            kind: 'move',
            handles: function (p, state) { return state.find(p.card).count('echo') > 0
                && (p.toZone == 'hand' || p.toZone == 'discard'); },
            replace: function (p) { return (__assign(__assign({}, p), { toZone: 'void' })); }
        }]
};
registerRule(echoRule);
export var shelterRule = {
    name: 'Shelter',
    replacers: [{
            text: "Whenever a card with a shelter token would leave play, remove a shelter token instead.",
            kind: 'move',
            handles: function (p, state) { return state.find(p.card).count('shelter') > 0
                && p.fromZone == 'play' && p.toZone != 'play'; },
            replace: function (p, state) {
                var card = state.find(p.card);
                return __assign(__assign({}, p), { skip: true, effects: [removeToken(card, 'shelter')] });
            }
        }]
};
registerRule(shelterRule);
// Priority rule: cards created from supplies with priority tokens are played immediately
export var priorityRule = {
    name: 'Priority',
    replacers: [playReplacer("Whenever you would create a card in your hand or discard whose supply has a priority token, instead remove a priority token and set the card aside. Then play it if it is still set aside.", function (p, s, c) { return nameHasToken(p.spec, 'priority', s); }, function (p, s, c) { return applyToTarget(function (t) { return removeToken(t, 'priority', 1, true); }, 'Remove a priority token.', function (state) { return state.supply.filter(function (t) { return t.name == p.spec.name; }); }); })]
};
registerRule(priorityRule);
// Reflect rule: after playing a card with a reflect token, play it again
export var reflectRule = {
    name: 'Reflect',
    triggers: [{
            text: "After playing a card with a reflect token on it, remove the reflect token and play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) {
                var played = state.find(e.card);
                // Don't trigger if the play was already from this rule (prevent infinite loops)
                return played.count('reflect') > 0 && !sourceHasName(e.source, 'Reflect');
            },
            transform: function (e, s, card) { return doAll([
                removeToken(e.card, 'reflect'),
                // Use reflectRule as the source so we can detect rule-triggered plays
                e.card.play(reflectRule),
            ]); },
        }]
};
registerRule(reflectRule);
export var hagglerName = 'Haggler';
export var hagglerRule = {
    name: 'Haggle',
    triggers: [{
            text: "After buying a card the normal way,\n                buy an additional card for each ".concat(hagglerName, " in play.\n                Each card you buy this way must cost at least $1 less than the previous one."),
            kind: 'afterBuy',
            handles: function (p) { return p.source == 'act'; },
            transform: function (p, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var lastCard, hagglers, haggler, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                lastCard = p.card;
                                hagglers = state.play.filter(function (c) { return c.name == hagglerName; });
                                _b.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 5];
                                haggler = hagglers.shift();
                                if (haggler === undefined) {
                                    return [2 /*return*/, state];
                                }
                                state = state.startTicker(haggler);
                                lastCard = state.find(lastCard);
                                target = void 0;
                                return [4 /*yield*/, choice(state, "Choose a cheaper card than ".concat(lastCard.name, " to buy."), state.supply.filter(function (c) { return leq(addCosts(c.cost('buy', state), { coin: 1 }), lastCard.cost('buy', state)); }).map(asChoice))];
                            case 2:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target !== null)) return [3 /*break*/, 4];
                                lastCard = target;
                                return [4 /*yield*/, target.buy(card)(state)];
                            case 3:
                                state = _b.sent();
                                _b.label = 4;
                            case 4:
                                state = state.endTicker(haggler);
                                hagglers = hagglers.filter(function (c) { return state.find(c).place == 'play'; });
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
};
// Ferry rule: cards with ferry tokens cost $1 less per token (but not zero)
export var ferryRule = {
    name: 'Ferry',
    replacers: [{
            text: "Cards cost $1 less to buy per ferry token on them, but not less than $1.",
            kind: 'cost',
            handles: function (p, state) { return p.actionKind == 'buy' && state.find(p.card).count('ferry') > 0; },
            replace: function (p, state) { return (__assign(__assign({}, p), { cost: reducedCost(p.cost, coin(state.find(p.card).count('ferry')), true) })); }
        }]
};
registerRule(ferryRule);
// Twin rule: after playing a card with a twin token, play it again
export var twinRule = {
    name: 'Twin',
    triggers: [{
            text: "After playing a card with a twin token other than with this effect, play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) {
                var played = state.find(e.card);
                return played.count('twin') > 0 && !sourceHasName(e.source, 'Twin');
            },
            transform: function (e, s, card) { return e.card.play(twinRule); },
        }]
};
registerRule(twinRule);
// Duplicate rule: after buying a card with a duplicate token, buy it again
export var duplicateRule = {
    name: 'Duplicate',
    triggers: [{
            text: "After buying a card with a duplicate token on it other than with this effect, remove a duplicate token from it to buy it again.",
            kind: 'afterBuy',
            handles: function (e, state, card) {
                var target = state.find(e.card);
                return target.count('duplicate') > 0 && !sourceHasName(e.source, 'Duplicate');
            },
            transform: function (e, state, card) { return payToDo(removeToken(e.card, 'duplicate'), e.card.buy(duplicateRule)); },
        }]
};
registerRule(duplicateRule);
function assertNever(x) {
    throw new Error("Unexpected: ".concat(x));
}
function insertInto(x, xs, n) {
    return xs.slice(0, n).concat([x]).concat(xs.slice(n));
}
function countDistinct(xs) {
    var e_39, _a;
    var distinct = new Set();
    var result = 0;
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            if (!distinct.has(x)) {
                result += 1;
                distinct.add(x);
            }
        }
    }
    catch (e_39_1) { e_39 = { error: e_39_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_39) throw e_39.error; }
    }
    return result;
}
export function countDistinctNames(xs) {
    return countDistinct(xs.map(function (c) { return c.name; }));
}
// ---------------------------------- Transformations that move cards
function showCards(cards) {
    return cards.map(function (card) { return card.name; }).join(', ');
}
export function moveMany(cards, toZone, logged) {
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, doAll(cards.map(function (card) { return move(card, toZone, true); }))(state)];
                    case 1:
                        state = _a.sent();
                        if (cards.length == 0 || logged) {
                            return [2 /*return*/, state];
                        }
                        else if (toZone == null) {
                            return [2 /*return*/, state.log("Trashed ".concat(showCards(cards)))];
                        }
                        else {
                            return [2 /*return*/, state.log("Moved ".concat(showCards(cards), " to ").concat(toZone))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
}
export function trash(card, logged) {
    if (logged === void 0) { logged = false; }
    return (card == null) ? noop : move(card, 'void', logged);
}
export function discard(n) {
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
                    case 1: return [4 /*yield*/, multichoice(state, "Choose ".concat(n, " cards to discard."), state.hand.map(asChoice), n, n)];
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
export function discardFromPlay(card) {
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
// --------------- Transforms that change points, energy, and coins
export function setResource(resource, amount, source) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource(resource, amount - state.resources[resource], source)(state)];
            });
        });
    };
}
export function gainActions(n, source) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource('actions', n, source)(state)];
            });
        });
    };
}
function gainEnergy(n, source) {
    return gainResource('energy', n, source);
}
export function gainCoins(n, source) {
    return gainResource('coin', n, source);
}
export function gainBuys(n, source) {
    return gainResource('buys', n, source);
}
export function dischargeCost(c, n) {
    if (n === void 0) { n = 1; }
    return __assign(__assign({}, free), { effects: [discharge(c, n)], tests: [function (state) { return state.find(c).charge >= n; }] });
}
export function discardCost(card) {
    return __assign(__assign({}, free), { effects: [discardFromPlay(card)], tests: [function (state) { return state.find(card).place == 'play'; }] });
}
export function fragileEcho(t) {
    if (t === void 0) { t = 'echo'; }
    return {
        text: "Whenever a card with ".concat(a(t), " token would move to your hand or discard,\n               trash it instead."),
        kind: 'move',
        handles: function (p, state) { return state.find(p.card).count(t) > 0
            && (p.toZone == 'hand' || p.toZone == 'discard'); },
        replace: function (p) { return (__assign(__assign({}, p), { toZone: 'void' })); }
    };
}
export function dedupBy(xs, f) {
    var e_40, _a;
    var result = [];
    var _loop_1 = function (x) {
        if (result.every(function (r) { return f(r) != f(x); })) {
            result.push(x);
        }
    };
    try {
        for (var xs_2 = __values(xs), xs_2_1 = xs_2.next(); !xs_2_1.done; xs_2_1 = xs_2.next()) {
            var x = xs_2_1.value;
            _loop_1(x);
        }
    }
    catch (e_40_1) { e_40 = { error: e_40_1 }; }
    finally {
        try {
            if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
        }
        finally { if (e_40) throw e_40.error; }
    }
    return result;
}
export function payAction(c) { return payCost(__assign(__assign({}, free), { actions: 1 }), c); }
export function tickEffect() {
    return {
        text: [],
        transform: function (state, card) { return tick(card); }
    };
}
export function playTwice(card) {
    return applyToTarget(function (target) { return doAll([
        target.play(card),
        tick(card),
        target.play(card),
    ]); }, 'Choose a card to play twice.', function (s) { return s.hand; });
}
export function throneroomEffect() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction(card), playTwice(card)); }
    };
}
export function useRefresh() {
    return targetedEffect(function (target, c) { return target.use(c); }, "Use ".concat(refresh.name, "."), function (state) { return state.events.filter(function (c) { return c.name == refresh.name; }); });
}
export function sum(xs, f) {
    return xs.map(f).reduce(function (a, b) { return a + b; });
}
export function countNameTokens(card, token, state) {
    return sum(state.supply, function (c) { return (c.name == card.name) ? c.count(token) : 0; });
}
export function nameHasToken(card, token, state) {
    return state.supply.some(function (s) { return s.name == card.name && s.count(token) > 0; });
}
export function costPer(increment) {
    var extraStr = "".concat(renderCost(increment, true), " for each cost token on this.");
    return {
        calculate: function (card, state) {
            return multiplyCosts(increment, state.find(card).count('cost'));
        },
        text: extraStr,
    };
}
export function incrementCost() {
    return {
        text: ['Put a cost token on this.'],
        transform: function (s, c) { return addToken(c, 'cost'); }
    };
}
export function incrementMap(m, k, n) {
    m.set(k, (m.get(k) || 0) + n);
}
export function startsWithCharge(name, n) {
    return {
        text: "Each ".concat(name, " is created with ").concat(aOrNum(n, 'charge token'), " on it."),
        kind: 'create',
        handles: function (p) { return p.spec.name == name; },
        replace: function (p) {
            var tokens = p.tokens || new Map();
            incrementMap(tokens, 'charge', n);
            return __assign(__assign({}, p), { tokens: tokens });
        }
    };
}
// ----------------------- Uncategorized
export function createInPlayEffect(spec, n, tokens) {
    if (n === void 0) { n = 1; }
    if (tokens === void 0) { tokens = null; }
    return {
        text: ["Create ".concat(aOrNum(n, spec.name), " in play.")],
        transform: function () { return repeat(create(spec, 'play', function (c) { return noop; }, tokens ? tokens : new Map()), n); }
    };
}
export function startInPlay(cardName) {
    return {
        kind: 'create',
        text: "When you would create ".concat(a(cardName), " in your discard, instead create it in play."),
        handles: function (p) { return p.spec.name == cardName; },
        replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
    };
}
export var cannotUse = {
    text: undefined,
    test: function (c, s, k) { return k == 'use'; }
};
// ------------------- Choice utilities
var yesOrNo = [
    {
        render: { kind: 'string', string: 'Yes' },
        value: true,
        hotkeyHint: { kind: 'boolean', val: true }
    }, {
        render: { kind: 'string', string: 'No' },
        value: false,
        hotkeyHint: { kind: 'boolean', val: false }
    }
];
export function range(n) {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(i);
    return result;
}
export function chooseNatural(n) {
    return range(n).map(function (x) { return ({
        render: { kind: 'string', string: String(x) },
        value: x,
        hotkeyHint: { kind: 'number', val: x }
    }); });
}
// ---------------- More effects
export function sortHand(state) {
    return state.sortZone('hand');
}
export function recycleEffect() {
    return {
        text: ['Put your discard into your hand.'],
        transform: function (state) { return doAll([moveMany(state.discard, 'hand'), sortHand]); }
    };
}
export function workshopEffect(n, except) {
    return targetedEffect(function (target, card) { return target.buy(card); }, "Buy a card in the supply costing up to $".concat(n, " not named ").concat(except, "."), function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)) && x.name != except; }); });
}
export function coinsEffect(n) {
    return {
        text: ["+$".concat(n, ".")],
        transform: function (s, c) { return gainCoins(n, c); },
    };
}
export function pointsEffect(n) {
    return {
        text: ["+".concat(n, " vp.")],
        transform: function (s, c) { return gainPoints(n, c); },
    };
}
export function actionsEffect(n) {
    return {
        text: ["+".concat(num(n, 'action'), ".")],
        transform: function (s, c) { return gainActions(n, c); },
    };
}
export function buysEffect(n) {
    return {
        text: ["+".concat(num(n, 'buy'), ".")],
        transform: function (state, card) { return gainBuys(n, card); },
    };
}
export function buyEffect() { return buysEffect(1); }
export function chargeEffect(n) {
    if (n === void 0) { n = 1; }
    return {
        text: ["Put ".concat(aOrNum(n, 'charge token'), " on this.")],
        transform: function (s, card) { return charge(card, n); }
    };
}
//
//
// ------ CORE CREATED CARDS ------
//
export function trashOnLeavePlay() {
    return {
        text: "Whenever this would leave play, trash it.",
        kind: 'move',
        handles: function (x, state, card) { return x.card.id == card.id && x.fromZone == 'play'; },
        replace: function (x) { return (__assign(__assign({}, x), { toZone: 'void' })); }
    };
}
export function stayInPlay() {
    return {
        text: "This doesn't move to your hand.",
        kind: 'move',
        handles: function (x, state, card) { return x.card.id == card.id && x.fromZone == 'play' && x.toZone == 'hand'; },
        replace: function (x) { return (__assign(__assign({}, x), { skip: true })); }
    };
}
function villageReplacer() {
    return costReduceNext('play', { energy: 1 });
}
export var horse = {
    name: 'Horse',
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
};
export var villager = {
    name: 'Villager',
    replacers: [{
            text: "Cards cost @ less to play. Whenever this reduces a cost, trash it.",
            kind: 'cost',
            handles: function (x) { return x.actionKind == 'play'; },
            replace: function (x, state, card) {
                if (x.cost.energy > 0) {
                    return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - 1, effects: x.cost.effects.concat([trash(card)]) }) });
                }
                else {
                    return x;
                }
            }
        }, trashOnLeavePlay()]
};
export function playReplacer(text, condition, cost) {
    return {
        kind: 'create',
        text: text,
        handles: function (p, s, source) { return (p.zone == 'discard' || p.zone == 'hand') && condition(p, s, source); },
        replace: function (p, s, source) { return (__assign(__assign({}, p), { zone: 'void', effects: p.effects.concat([
                function () { return cost(p, s, source); },
                function (t) { return function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    t = state.find(t);
                                    if (!(t.place == 'void')) return [3 /*break*/, 2];
                                    return [4 /*yield*/, t.play(source)(state)];
                                case 1:
                                    state = _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/, state];
                            }
                        });
                    });
                }; }
            ]) })); }
    };
}
export var fair = {
    name: 'Fair',
    replacers: [{
            text: "Whenever you would create a card in your discard,\n        instead create the card in your hand and trash this.",
            kind: 'create',
            handles: function (e, state, card) { return e.zone == 'discard'
                && state.find(card).place == 'play'; },
            replace: function (x, state, card) { return (__assign(__assign({}, x), { zone: 'hand', effects: x.effects.concat(function () { return trash(card); }) })); }
        }, trashOnLeavePlay()]
};
//
// ----- MIXINS -----
//
function playAgain(target, source) {
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
function costReduceDescriptor(kind, reduction, nonzero) {
    var d = renderCost(reduction, true);
    var s = nonzero ? ' but not zero' : '';
    switch (kind) {
        case 'play': return "Cards cost ".concat(d, " less to play").concat(s, ".");
        case 'buy': return "Cards cost ".concat(d, " less to buy").concat(s, ".");
        case 'use': return "Events cost ".concat(d, " less to use").concat(s, ".");
        case 'activate': return "Abilities cost ".concat(d, " less to use").concat(s, ".");
        case 'potion': return "Potions cost ".concat(d, " less to use").concat(s, ".");
        default: return assertNever(kind);
    }
}
export function reducedCost(cost, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var newCost = subtractCost(cost, reduction);
    if (nonzero && leq(newCost, free) && !leq(cost, free)) {
        if ((reduction.coin || 0) > 0) {
            newCost = addCosts(newCost, { coin: 1 });
        }
        else if ((reduction.energy || 0) > 0) {
            newCost = addCosts(newCost, { energy: 1 });
        }
    }
    return newCost;
}
export function costReduce(kind, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    return {
        text: costReduceDescriptor(kind, reduction, nonzero),
        kind: 'cost',
        handles: function (x) { return x.actionKind == kind; },
        replace: function (x, state) {
            var newCost = reducedCost(x.cost, reduction, nonzero);
            return __assign(__assign({}, x), { cost: newCost });
        }
    };
}
export function costReduceNext(kind, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    return {
        text: costReduceDescriptor(kind, reduction, nonzero) +
            ' Whenever this reduces a cost, discard it',
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
export function applyToTarget(f, text, options, special) {
    if (special === void 0) { special = {}; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var choices, target;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        choices = options(state).map(asChoice);
                        if (special.optional !== undefined)
                            choices = allowNull(choices, special.optional);
                        return [4 /*yield*/, choice(state, text, choices, ['applyToTarget'])];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                        if (!(target != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, f(target)(state)];
                    case 2:
                        state = _b.sent();
                        _b.label = 3;
                    case 3:
                        if (target == null && special.cost == true)
                            throw new CostNotPaid('No valid targets');
                        return [2 /*return*/, state];
                }
            });
        });
    };
}
export function targetedEffect(f, text, options) {
    return {
        text: [text],
        transform: function (s, c) { return applyToTarget(function (target) { return f(target, c); }, text, options); }
    };
}
export function multitargetedEffect(f, text, options, max) {
    if (max === void 0) { max = null; }
    return {
        text: [text],
        transform: function (s, c) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var cards;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, multichoice(state, text, options(state, c).map(asChoice), max)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], cards = _a[1];
                            return [4 /*yield*/, f(cards, c)(state)];
                        case 2:
                            state = _b.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }; }
    };
}
//
// ----------- UTILS -------------------
//
export function createEffect(spec, zone, n) {
    if (zone === void 0) { zone = 'discard'; }
    if (n === void 0) { n = 1; }
    var zoneText = (zone == 'play') ? 'play' : "your ".concat(zone);
    return {
        text: ["Create ".concat(aOrNum(n, spec.name), " in ").concat(zoneText, ".")],
        transform: function () { return repeat(create(spec, zone), n); },
    };
}
export function buyTrigger(effect) {
    return {
        kind: 'buy',
        handles: function (e, s, c) { return e.card.id == c.id; },
        transform: function (e, s, c) { return effect.transform(s, c); },
        text: "When you buy this, ".concat(effect.text.map(lowercaseFirst).join('; then '))
    };
}
export function afterBuyTrigger(effect) {
    return {
        kind: 'afterBuy',
        handles: function (e, s, c) { return e.card.id == c.id; },
        transform: function (e, s, c) { return effect.transform(s, c); },
        text: "After buying this, ".concat(effect.text.map(lowercaseFirst).join('; then '))
    };
}
/*
interface Extras {
    triggers?:TypedTrigger[];
    replacers?:TypedReplacer[];
    onBuy?:Effect[];
    afterBuy?:Effect[];
}
export function supplyForCard(
    card:CardSpec,
    extra:Extras={}
): CardSpec {
    const buyTriggers:Trigger<BuyEvent>[] = (extra.onBuy || []).map(
        t => ({
            kind: 'buy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `When you buy this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const afterTriggers:Trigger<AfterBuyEvent>[] = (extra.afterBuy || []).map(
        t => ({
            kind: 'afterBuy',
            handles: (e, s, c) => e.card.name == c.name,
            transform: (e, s, c) => t.transform(s, c),
            //TODO: this is pretty sketchy...
            text: `After buying this, ${t.text.map(lowercaseFirst).join(', ')}`,
        }))
    const triggers:TypedTrigger[] = (buyTriggers as TypedTrigger[])
        .concat(afterTriggers as TypedTrigger[])
        .concat(extra.triggers || [])
    return {
        ...card,
        staticTriggers: (card.staticTriggers || []).concat(triggers),
        staticReplacers: (card.staticReplacers || []).concat(extra.replacers || []),
    }
}
    */
export function energy(n) {
    return __assign(__assign({}, free), { energy: n });
}
export function coin(n) {
    return __assign(__assign({}, free), { coin: n });
}
export function trashThis() {
    return {
        text: ['Trash this.'],
        transform: function (s, c) { return trash(c); }
    };
}
function makeCard(card, cost, selfdestruct) {
    if (selfdestruct === void 0) { selfdestruct = false; }
    var effects = [{
            text: ["Create ".concat(a(card.name), " in play.")],
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
export var cardRewards = [];
export var eventRewards = [];
export var potionRewards = [];
export var relicRewards = [];
export var boons = [];
export var vpModes = [];
//# sourceMappingURL=gameLogic.js.map