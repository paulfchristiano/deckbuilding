var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
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
export var VERSION = "1.8";
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
function aOrNum(n, x) {
    return (n == 1) ? a(x) : n + " " + x + "s";
}
//renders either "a" or "an" as appropriate
function a(s) {
    var c = s[0].toLowerCase();
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u')
        return 'an ' + s;
    return 'a ' + s;
}
function lowercaseFirst(s) {
    return s[0].toLowerCase() + s.slice(1);
}
function renderResource(resource, amount) {
    if (amount < 0)
        return '-' + renderResource(resource, -amount);
    switch (resource) {
        case 'coin': return "$" + amount;
        case 'energy':
            if (amount > 5 || amount % 1 != 0)
                return "@x" + amount;
            else
                return repeatSymbol('@', amount);
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
        var e_2, _a;
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
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
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
                            state = logAct(state, kind, card);
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
                            state = state.indent();
                            return [4 /*yield*/, move(card, 'resolving')(state)];
                        case 2:
                            state = _c.sent();
                            state = state.unindent();
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
                                    var _a, _b, _c, effect, e_3_1, _d, _e, effect, e_4_1;
                                    var e_3, _f, e_4, _g;
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
                                                e_3_1 = _h.sent();
                                                e_3 = { error: e_3_1 };
                                                return [3 /*break*/, 9];
                                            case 8:
                                                try {
                                                    if (_c && !_c.done && (_f = _b.return)) _f.call(_b);
                                                }
                                                finally { if (e_3) throw e_3.error; }
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
                                                e_4_1 = _h.sent();
                                                e_4 = { error: e_4_1 };
                                                return [3 /*break*/, 17];
                                            case 16:
                                                try {
                                                    if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                                                }
                                                finally { if (e_4) throw e_4.error; }
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
                            state = state.indent();
                            return [4 /*yield*/, move(card, card.afterPlayDestination())(state)];
                        case 10:
                            state = _c.sent();
                            state = state.unindent();
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
        var e_5, _a;
        if (kind == 'activate' && this.spec.ability === undefined)
            return false;
        try {
            for (var _b = __values(this.restrictions()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var restriction = _c.value;
                if (restriction.test(this, state, kind))
                    return false;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
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
    victory: function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new ReplayVictory(state);
            });
        });
    }
};
function get(stateUpdate, k, state) {
    return (stateUpdate[k] === undefined) ? state[k] : stateUpdate[k];
}
export var RANDOM = 'random';
export var logTypes = ['all', 'energy', 'acts', 'costs'];
var emptyLog = { 'all': [], 'energy': [], 'acts': [], 'costs': [] };
var State = /** @class */ (function () {
    function State(spec, ui, resources, zones, resolving, nextID, history, future, redo, checkpoint, logs, logIndent) {
        if (spec === void 0) { spec = { kind: 'full', randomizer: { expansions: [], seed: '' } }; }
        if (ui === void 0) { ui = noUI; }
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
        this.vp_goal = goalForSpec(spec);
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
                var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
                newZones.set(name_2, zone.filter(function (c) { return c.id != card.id; }));
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
                var _d = __read(_c.value, 2), name_3 = _d[0], zone = _d[1];
                newZones.set(name_3, zone.map(function (c) { return (c.id == card.id) ? f(c) : c; }));
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
                var _f = __read(_e.value, 2), name_4 = _f[0], zone = _f[1];
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
                var _d = __read(_c.value, 2), name_5 = _d[0], zone_2 = _d[1];
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
    State.prototype.serializeHistory = function (includeVersion) {
        if (includeVersion === void 0) { includeVersion = true; }
        return serializeReplay({
            version: includeVersion ? VERSION : '',
            actions: this.origin().future
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
    return [r.version].concat(r.actions.map(function (x) { return x.toString(); })).join(';');
}
export function parseReplay(s) {
    var _a = __read(shiftFirst(s.split(';')), 2), version = _a[0], pieces = _a[1];
    if (version === null)
        throw new MalformedReplay('No version');
    function parsePiece(piece) {
        var result = parseInt(piece);
        if (isNaN(result)) {
            throw new MalformedReplay(piece + " is not a valid action");
        }
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
function insertAt(zone, card) {
    return zone.concat([card]);
}
function createRaw(state, spec, zone, loc) {
    var _a;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    var id;
    _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
    var card = new Card(spec, id);
    state = state.addToZone(card, zone);
    return [state, card];
}
function createRawMulti(state, specs, zone, loc) {
    var e_13, _a, _b;
    if (zone === void 0) { zone = 'discard'; }
    if (loc === void 0) { loc = 'bottom'; }
    try {
        for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
            var spec = specs_1_1.value;
            var card = void 0;
            _b = __read(createRaw(state, spec, zone, loc), 2), state = _b[0], card = _b[1];
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    return state;
}
//e is an event that just happened
//each card in play and aura can have a followup
//NOTE: this is slow, we should cache triggers (in a dictionary by event type) if it becomes a problem
function trigger(e) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var initialState, triggers, _a, _b, card, _c, _d, trigger_1, _e, _f, card, _g, _h, trigger_2, triggers_1, triggers_1_1, _j, card, rawTrigger, trigger_3, e_14_1;
            var e_15, _k, e_16, _l, e_17, _m, e_18, _o, e_14, _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        initialState = state;
                        triggers = [];
                        try {
                            for (_a = __values(state.events.concat(state.supply)), _b = _a.next(); !_b.done; _b = _a.next()) {
                                card = _b.value;
                                try {
                                    for (_c = (e_16 = void 0, __values(card.staticTriggers())), _d = _c.next(); !_d.done; _d = _c.next()) {
                                        trigger_1 = _d.value;
                                        triggers.push([card, trigger_1]);
                                    }
                                }
                                catch (e_16_1) { e_16 = { error: e_16_1 }; }
                                finally {
                                    try {
                                        if (_d && !_d.done && (_l = _c.return)) _l.call(_c);
                                    }
                                    finally { if (e_16) throw e_16.error; }
                                }
                            }
                        }
                        catch (e_15_1) { e_15 = { error: e_15_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_k = _a.return)) _k.call(_a);
                            }
                            finally { if (e_15) throw e_15.error; }
                        }
                        try {
                            for (_e = __values(state.play), _f = _e.next(); !_f.done; _f = _e.next()) {
                                card = _f.value;
                                try {
                                    for (_g = (e_18 = void 0, __values(card.triggers())), _h = _g.next(); !_h.done; _h = _g.next()) {
                                        trigger_2 = _h.value;
                                        triggers.push([card, trigger_2]);
                                    }
                                }
                                catch (e_18_1) { e_18 = { error: e_18_1 }; }
                                finally {
                                    try {
                                        if (_h && !_h.done && (_o = _g.return)) _o.call(_g);
                                    }
                                    finally { if (e_18) throw e_18.error; }
                                }
                            }
                        }
                        catch (e_17_1) { e_17 = { error: e_17_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_m = _e.return)) _m.call(_e);
                            }
                            finally { if (e_17) throw e_17.error; }
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
                        e_14_1 = _q.sent();
                        e_14 = { error: e_14_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (triggers_1_1 && !triggers_1_1.done && (_p = triggers_1.return)) _p.call(triggers_1);
                        }
                        finally { if (e_14) throw e_14.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, state];
                }
            });
        });
    };
}
function replace(x, state) {
    var e_19, _a, e_20, _b, e_21, _c, e_22, _d, e_23, _e;
    var replacers = [];
    try {
        for (var _f = __values(state.events.concat(state.supply)), _g = _f.next(); !_g.done; _g = _f.next()) {
            var card = _g.value;
            try {
                for (var _h = (e_20 = void 0, __values(card.staticReplacers())), _j = _h.next(); !_j.done; _j = _h.next()) {
                    var replacer = _j.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
                }
                finally { if (e_20) throw e_20.error; }
            }
        }
    }
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
        }
        finally { if (e_19) throw e_19.error; }
    }
    try {
        for (var _k = __values(state.play), _l = _k.next(); !_l.done; _l = _k.next()) {
            var card = _l.value;
            try {
                for (var _m = (e_22 = void 0, __values(card.replacers())), _o = _m.next(); !_o.done; _o = _m.next()) {
                    var replacer = _o.value;
                    replacers.push([card, replacer]);
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
                }
                finally { if (e_22) throw e_22.error; }
            }
        }
    }
    catch (e_21_1) { e_21 = { error: e_21_1 }; }
    finally {
        try {
            if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
        }
        finally { if (e_21) throw e_21.error; }
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
    catch (e_23_1) { e_23 = { error: e_23_1 }; }
    finally {
        try {
            if (replacers_1_1 && !replacers_1_1.done && (_e = replacers_1.return)) _e.call(replacers_1);
        }
        finally { if (e_23) throw e_23.error; }
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
function create(spec, zone, postprocess) {
    if (zone === void 0) { zone = 'discard'; }
    if (postprocess === void 0) { postprocess = function () { return noop; }; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var card;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, createAndTrack(spec, zone)(state)];
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
function createAndTrack(spec, zone) {
    if (zone === void 0) { zone = 'discard'; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params, card, _a, _b, effect, e_24_1;
            var _c, e_24, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        params = { kind: 'create', spec: spec, zone: zone, effects: [] };
                        params = replace(params, state);
                        spec = params.spec;
                        card = null;
                        if (!(params.zone != null)) return [3 /*break*/, 10];
                        _c = __read(createRaw(state, spec, params.zone), 2), state = _c[0], card = _c[1];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 8]);
                        _a = __values(params.effects), _b = _a.next();
                        _e.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        effect = _b.value;
                        return [4 /*yield*/, effect(card)(state)];
                    case 3:
                        state = _e.sent();
                        _e.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_24_1 = _e.sent();
                        e_24 = { error: e_24_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                        }
                        finally { if (e_24) throw e_24.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        state = state.log("Created " + a(card.name) + " in " + params.zone);
                        return [4 /*yield*/, trigger({ kind: 'create', card: card, zone: params.zone })(state)];
                    case 9:
                        state = _e.sent();
                        _e.label = 10;
                    case 10: return [2 /*return*/, [card, state]];
                }
            });
        });
    };
}
function createAndPlay(spec, source) {
    if (source === void 0) { source = unk; }
    return create(spec, 'void', (function (c) { return c.play(source); }));
}
function move(card, toZone, logged) {
    if (logged === void 0) { logged = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b, effect, e_25_1;
            var e_25, _c;
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
                                state = state.log("Trashed " + card.name + " from " + card.place);
                        }
                        else {
                            state = state.addToZone(card, toZone);
                            if (!logged)
                                state = state.log("Moved " + card.name + " from " + card.place + " to " + toZone);
                        }
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
                        e_25_1 = _d.sent();
                        e_25 = { error: e_25_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_25) throw e_25.error; }
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
function moveMany(cards, toZone, logged) {
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
    return (card == null) ? noop : move(card, 'void', logged);
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
                    case 1: return [4 /*yield*/, multichoice(state, "Choose " + n + " cards to discard.", state.hand.map(asChoice), n, n)];
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
            var _a, _b, effect, e_26_1;
            var e_26, _c;
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
                            state = state.log("Paid " + renderCost(c, true));
                        }
                        if (renderCost(c, false) != '') {
                            state = state.log(renderCost(c, false) + " for " + source, 'costs');
                        }
                        if (c.energy > 0) {
                            state = state.log(c.energy + " for " + source, "energy");
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
                        e_26_1 = _d.sent();
                        e_26 = { error: e_26_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_26) throw e_26.error; }
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
            var newResources, params, _a, _b, transform, e_27_1;
            var e_27, _c;
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
                            "Gained " + renderResource(resource, amount) :
                            "Lost " + renderResource(resource, -amount));
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
                        e_27_1 = _d.sent();
                        e_27 = { error: e_27_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_27) throw e_27.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, trigger({ kind: 'resource', resource: resource, amount: amount, source: source })(state)];
                }
            });
        });
    };
}
function setResource(resource, amount, source) {
    if (source === void 0) { source = unk; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, gainResource(resource, amount - state.resources[resource], source)(state)];
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
function gainEnergy(n, source) {
    if (source === void 0) { source = unk; }
    return gainResource('energy', n, source);
}
export var DEFAULT_VP_GOAL = 40;
function gainPoints(n, source) {
    if (source === void 0) { source = unk; }
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
function gainCoins(n, source) {
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
    var e_28, _a;
    var result = {};
    try {
        for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
            var resource = allCostResources_1_1.value;
            var r = c[resource];
            if (r != undefined)
                result[resource] = n * r;
        }
    }
    catch (e_28_1) { e_28 = { error: e_28_1 }; }
    finally {
        try {
            if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
        }
        finally { if (e_28) throw e_28.error; }
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
function removeToken(card, token, n, isCost) {
    if (n === void 0) { n = 1; }
    if (isCost === void 0) { isCost = false; }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var current, removed, newCard;
            return __generator(this, function (_a) {
                card = state.find(card);
                if (card.place == null) {
                    if (isCost)
                        throw new CostNotPaid("Couldn't remove " + token + " token.");
                    return [2 /*return*/, state];
                }
                current = card.count(token);
                if (n != 'all' && n > current && isCost)
                    throw new CostNotPaid("Couldn't remove " + num(n, token + ' token') + ".");
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
        var _this = _super.call(this, "Index " + index + " does not correspond to a valid choice") || this;
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
function choice(state, prompt, options, info, chosen) {
    if (info === void 0) { info = []; }
    if (chosen === void 0) { chosen = []; }
    return __awaiter(this, void 0, void 0, function () {
        var index, indices, newState;
        var _a;
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
function multichoice(state, prompt, options, max, min, info) {
    if (max === void 0) { max = null; }
    if (min === void 0) { min = 0; }
    if (info === void 0) { info = []; }
    return __awaiter(this, void 0, void 0, function () {
        var chosen, nextOptions, next, k;
        var _a;
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
function range(n) {
    var result = [];
    for (var i = 0; i < n; i++)
        result.push(i);
    return result;
}
function chooseNatural(n) {
    return range(n).map(function (x) { return ({
        render: { kind: 'string', string: String(x) },
        value: x,
        hotkeyHint: { kind: 'number', val: x }
    }); });
}
function asChoice(x) {
    return { render: { kind: 'card', card: x }, value: x };
}
function asNumberedChoices(xs) {
    return xs.map(function (card, i) { return ({
        render: { kind: 'card', card: card },
        value: card,
        hotkeyHint: { kind: 'number', val: i }
    }); });
}
function allowNull(options, message) {
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
                throw Error("tried to undo past beginning of the game");
        }
        else {
            return state.addRedo(last);
        }
    }
}
export function verifyScore(spec, history, score) {
    return __awaiter(this, void 0, void 0, function () {
        var e_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, playGame(State.fromReplayString(history, spec))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, [true, ""]]; //unreachable
                case 2:
                    e_29 = _a.sent();
                    if (e_29 instanceof ReplayVictory) {
                        if (e_29.state.energy == score)
                            return [2 /*return*/, [true, ""]];
                        else
                            return [2 /*return*/, [false, "Computed score was " + e_29.state.energy]];
                    }
                    else if (e_29 instanceof InvalidHistory) {
                        return [2 /*return*/, [false, "" + e_29]];
                    }
                    else if (e_29 instanceof VersionMismatch) {
                        return [2 /*return*/, [false, "" + e_29]];
                    }
                    else if (e_29 instanceof ReplayEnded) {
                        return [2 /*return*/, [false, "" + e_29]];
                    }
                    else {
                        throw e_29;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// --------------------- act
// This is the 'default' choice the player makes when nothing else is happening
function logAct(state, act, card) {
    switch (act) {
        case 'play': return state.log("Played " + card.name, 'acts');
        case 'buy':
            //state = state.log(card.name, 'buys')
            return state.log("Bought " + card.name, 'acts');
        case 'use':
            //state = state.log(card.name, 'buys')
            return state.log("Used " + card.name, 'acts');
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
            return { render: { kind: 'card', card: c }, value: [c, kind] };
        };
    }
    function available(kind) { return function (c) { return c.available(kind, state); }; }
    var hand = state.hand.filter(available('play')).map(asActChoice('play'));
    var supply = state.supply.filter(available('buy')).map(asActChoice('buy'));
    var events = state.events.filter(available('use')).map(asActChoice('use'));
    var play = state.play.filter(available('activate')).map(asActChoice('activate'));
    return choice(state, "Buy a card (costs 1 buy),\n        play a card from your hand (costs 1 action),\n        or use an event.", hand.concat(supply).concat(events).concat(play), ['actChoice']);
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
        var e_30, _a;
        try {
            for (var comps_1 = __values(comps), comps_1_1 = comps_1.next(); !comps_1_1.done; comps_1_1 = comps_1.next()) {
                var comp = comps_1_1.value;
                var result = comp(a, b);
                if (result != 0)
                    return result;
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (comps_1_1 && !comps_1_1.done && (_a = comps_1.return)) _a.call(comps_1);
            }
            finally { if (e_30) throw e_30.error; }
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
// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
function fillTo(n, filler, xs) {
    var m = n - xs.length;
    return (m > 0) ? xs.concat(Array(m).fill(filler)) : xs;
}
export function cardsAndEvents(spec) {
    switch (spec.kind) {
        case 'goal': return cardsAndEvents(spec.spec);
        case 'full': return { cards: Array(10).fill(RANDOM), events: Array(4).fill(RANDOM) };
        case 'test': return { cards: [], events: [] };
        case 'pick': return { cards: [], events: [] };
        case 'pickR': return { cards: spec.cards, events: spec.events };
        case 'require': return {
            cards: fillTo(10, RANDOM, spec.cards),
            events: fillTo(4, RANDOM, spec.events)
        };
        default: return assertNever(spec);
    }
}
function usableExpansions(spec) {
    switch (spec.kind) {
        case 'test': return expansionNames;
        case 'pick': return [];
        case 'goal': return usableExpansions(spec.spec);
        default: return spec.randomizer.expansions;
    }
}
var expansionNames = ['base', 'expansion', 'absurd', 'test'];
function emptySet() {
    return { 'cards': [], 'events': [] };
}
export var sets = {
    'core': emptySet(),
    'base': emptySet(),
    'expansion': emptySet(),
    'absurd': emptySet(),
    'test': emptySet(),
};
export function makeKingdom(spec) {
    switch (spec.kind) {
        case 'test':
            return {
                cards: allCards,
                events: allEvents.concat(cheats),
            };
        case 'pick':
            return { cards: spec.cards, events: spec.events };
        case 'goal':
            return makeKingdom(spec.spec);
        default:
            var kingdom = cardsAndEvents(spec);
            var expansions = usableExpansions(spec);
            return {
                cards: pickRandoms(kingdom.cards, cardsFrom('cards', expansions), 'cards' + spec.randomizer.seed),
                events: pickRandoms(kingdom.events, cardsFrom('events', expansions), 'events' + spec.randomizer.seed),
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
function stringComp(a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase(), 'en');
}
function normalizeString(s) {
    return s.split('').filter(function (c) { return c != ' ' && c != "'"; }).join('').toLowerCase();
}
function normalizePreservingCase(xs) {
    function f(s) {
        return s.split('').filter(function (c) { return c != ' ' && c != "'"; }).join('');
    }
    return xs.map(f).sort(stringComp);
}
function normalize(xs) {
    return xs.map(normalizeString).sort(stringComp);
}
function makeDictionary(xs) {
    var e_31, _a;
    var result = new Map();
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            result.set(normalizeString(x.name), x);
        }
    }
    catch (e_31_1) { e_31 = { error: e_31_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_31) throw e_31.error; }
    }
    return result;
}
function extractList(names, xs) {
    var e_32, _a;
    var dictionary = makeDictionary(xs);
    var result = [];
    try {
        for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
            var name_6 = names_1_1.value;
            if (normalizeString(name_6) == normalizeString(RANDOM)) {
                result.push(RANDOM);
            }
            else {
                var lookup = dictionary.get(normalizeString(name_6));
                if (lookup == undefined)
                    throw new MalformedSpec(name_6 + " is not a valid name");
                result.push(lookup);
            }
        }
    }
    catch (e_32_1) { e_32 = { error: e_32_1 }; }
    finally {
        try {
            if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
        }
        finally { if (e_32) throw e_32.error; }
    }
    return result;
}
function mapToURL(args) {
    return Array.from(args.entries()).map(function (x) { return x[0] + "=" + x[1]; }).join('&');
}
function renderSlots(slots) {
    var e_33, _a;
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
    catch (e_33_1) { e_33 = { error: e_33_1 }; }
    finally {
        try {
            if (slots_1_1 && !slots_1_1.done && (_a = slots_1.return)) _a.call(slots_1);
        }
        finally { if (e_33) throw e_33.error; }
    }
    return normalizePreservingCase(result).join(',');
}
function nontrivialExpansions(expansionNames) {
    return (expansionNames.length != 1 || expansionNames[0] != 'base');
}
export function specToURL(spec) {
    var args = new Map();
    if (spec.kind != 'full')
        args.set('kind', spec.kind);
    switch (spec.kind) {
        case 'goal':
            var goal = spec.vp;
            return (goal == DEFAULT_VP_GOAL)
                ? specToURL(spec.spec)
                : specToURL(spec.spec) + "&vp=" + spec.vp;
        case 'full':
            if (nontrivialExpansions(spec.randomizer.expansions)) {
                args.set('expansions', spec.randomizer.expansions.join(','));
            }
            args.set('seed', spec.randomizer.seed);
            break;
        case 'pickR':
        case 'require':
            args.set('cards', renderSlots(spec.cards));
            args.set('events', renderSlots(spec.events));
            if (nontrivialExpansions(spec.randomizer.expansions)) {
                args.set('expansions', spec.randomizer.expansions.join(','));
            }
            args.set('seed', spec.randomizer.seed);
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
function split(s, sep) {
    if (s.length == 0) {
        return [];
    }
    else {
        return s.split(sep);
    }
}
export function parseExpansionString(expansionString) {
    var e_34, _a;
    var expansionStrings = (expansionString === null) ? ['base']
        : normalize(split(expansionString, ','));
    var expansions = [];
    try {
        for (var expansionStrings_1 = __values(expansionStrings), expansionStrings_1_1 = expansionStrings_1.next(); !expansionStrings_1_1.done; expansionStrings_1_1 = expansionStrings_1.next()) {
            var s = expansionStrings_1_1.value;
            var n = expansionNames.indexOf(s);
            if (n < 0) {
                throw new MalformedSpec("Invalid expansion name " + s);
            }
            else {
                expansions.push(expansionNames[n]);
            }
        }
    }
    catch (e_34_1) { e_34 = { error: e_34_1 }; }
    finally {
        try {
            if (expansionStrings_1_1 && !expansionStrings_1_1.done && (_a = expansionStrings_1.return)) _a.call(expansionStrings_1);
        }
        finally { if (e_34) throw e_34.error; }
    }
    return expansions;
}
export function specFromURL(search, excludeGoal) {
    var e_35, _a, e_36, _b;
    if (excludeGoal === void 0) { excludeGoal = false; }
    var searchParams = new URLSearchParams(search);
    if (!excludeGoal) {
        var vp_goal = searchParams.get('vp');
        if (vp_goal !== null) {
            return { kind: 'goal',
                vp: Number(vp_goal),
                spec: specFromURL(search, true) };
        }
    }
    var urlKind = searchParams.get('kind');
    var cardsString = searchParams.get('cards');
    var cards = (cardsString === null) ? []
        : normalize(split(cardsString, ','));
    var eventsString = searchParams.get('events');
    var events = (eventsString === null) ? []
        : normalize(split(eventsString, ','));
    var expansionString = searchParams.get('expansions');
    var expansions = parseExpansionString(expansionString);
    var seed = searchParams.get('seed') || randomSeed();
    var kind;
    function pickOrPickR() {
        if (cards.indexOf(RANDOM) >= 0 || events.indexOf(RANDOM) >= 0) {
            return 'pickR';
        }
        else {
            return 'pick';
        }
    }
    if (urlKind !== null) {
        if (urlKind == 'pick' || urlKind == 'pickR')
            kind = pickOrPickR();
        else
            kind = urlKind;
    }
    else {
        if (cards.length == 0 && events.length == 0)
            kind = 'full';
        else
            kind = pickOrPickR();
    }
    switch (kind) {
        case 'full':
            return { kind: kind, randomizer: { seed: seed, expansions: expansions } };
        case 'pick':
            var cardSpecs = [];
            var eventSpecs = [];
            if (cards !== null) {
                try {
                    for (var _c = __values(extractList(cards, allCards)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var card = _d.value;
                        if (card == RANDOM)
                            throw new MalformedSpec('Random card is only allowable in type pickR');
                        else
                            cardSpecs.push(card);
                    }
                }
                catch (e_35_1) { e_35 = { error: e_35_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_35) throw e_35.error; }
                }
            }
            if (events !== null) {
                try {
                    for (var _e = __values(extractList(events, allEvents)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var card = _f.value;
                        if (card == RANDOM)
                            throw new MalformedSpec('Random card is only allowable in type pickR');
                        else
                            eventSpecs.push(card);
                    }
                }
                catch (e_36_1) { e_36 = { error: e_36_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_36) throw e_36.error; }
                }
            }
            return { kind: kind, cards: cardSpecs, events: eventSpecs };
        case 'require':
            return {
                kind: kind, randomizer: { seed: seed, expansions: expansions },
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents),
            };
        case 'pickR':
            return { kind: kind, randomizer: { seed: seed, expansions: expansions },
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents) };
        case 'test': return { kind: 'test' };
        default: throw new MalformedSpec("Invalid kind " + kind);
    }
}
function pickRandoms(slots, source, seed) {
    var e_37, _a;
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
    catch (e_37_1) { e_37 = { error: e_37_1 }; }
    finally {
        try {
            if (slots_2_1 && !slots_2_1.done && (_a = slots_2.return)) _a.call(slots_2);
        }
        finally { if (e_37) throw e_37.error; }
    }
    return result.concat(randomChoices(source.filter(function (x) { return !taken.has(x.name); }), randoms, hash(seed)));
}
function goalForSpec(spec) {
    switch (spec.kind) {
        case 'goal': return spec.vp;
        default: return DEFAULT_VP_GOAL;
    }
}
export function normalizeURL(url) {
    var spec = specFromURL(url);
    var kingdom = makeKingdom(spec);
    var normalizedSpec = {
        kind: 'goal', vp: goalForSpec(spec),
        spec: { kind: 'pick', cards: kingdom.cards, events: kingdom.events }
    };
    return specToURL(normalizedSpec);
}
export function initialState(spec) {
    var startingHand = [copper, copper, copper, estate, estate];
    var kingdom = makeKingdom(spec);
    var variableSupplies = kingdom.cards.slice();
    var variableEvents = kingdom.events.slice();
    variableSupplies.sort(supplyComp);
    variableEvents.sort(eventComp);
    var supply = sets.core.cards.concat(variableSupplies);
    var events = sets.core.events.concat(variableEvents);
    var state = new State(spec);
    state = createRawMulti(state, supply, 'supply');
    state = createRawMulti(state, events, 'events');
    state = createRawMulti(state, startingHand, 'discard');
    return state;
}
export function playGame(state, resume) {
    if (resume === void 0) { resume = false; }
    return __awaiter(this, void 0, void 0, function () {
        var checkpoint, victorious, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!resume) return [3 /*break*/, 1];
                    checkpoint = state.backup();
                    if (checkpoint != null)
                        state = checkpoint;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, trigger({ kind: 'gameStart' })(state)];
                case 2:
                    state = _a.sent();
                    _a.label = 3;
                case 3:
                    victorious = false;
                    _a.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 12];
                    state = state.setCheckpoint();
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 10, , 11]);
                    if (!victorious) return [3 /*break*/, 7];
                    //never returns, only outcome is raising Undo
                    return [4 /*yield*/, state.ui.victory(state)];
                case 6:
                    //never returns, only outcome is raising Undo
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, act(state)];
                case 8:
                    state = _a.sent();
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_2 = _a.sent();
                    victorious = false;
                    if (error_2 instanceof Undo) {
                        state = undo(error_2.state);
                    }
                    else if (error_2 instanceof SetState) {
                        state = undoOrSet(error_2.state, state);
                    }
                    else if (error_2 instanceof Victory) {
                        state = error_2.state;
                        victorious = true;
                    }
                    else {
                        throw error_2;
                    }
                    return [3 /*break*/, 11];
                case 11: return [3 /*break*/, 4];
                case 12: return [2 /*return*/];
            }
        });
    });
}
function reversed(it) {
    var xs = Array.from(it);
    xs.reverse();
    return xs.values();
}
// ------------------------- Browsing
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
//
// ----------------- CARDS -----------------
//
var cheats = [];
//
// ----------- UTILS -------------------
//
function createEffect(spec, zone, n) {
    if (zone === void 0) { zone = 'discard'; }
    if (n === void 0) { n = 1; }
    var zoneText = (zone == 'play') ? 'play' : "your " + zone;
    return {
        text: ["Create " + aOrNum(n, spec.name) + " in " + zoneText + "."],
        transform: function () { return repeat(create(spec, zone), n); },
    };
}
function supplyForCard(card, cost, extra) {
    if (extra === void 0) { extra = {}; }
    var buyTriggers = (extra.onBuy || []).map(function (t) { return ({
        kind: 'buy',
        handles: function (e, s, c) { return e.card.name == c.name; },
        transform: function (e, s, c) { return t.transform(s, c); },
        //TODO: this is pretty sketchy...
        text: "When you buy this, " + t.text.map(lowercaseFirst).join(', '),
    }); });
    var afterTriggers = (extra.afterBuy || []).map(function (t) { return ({
        kind: 'afterBuy',
        handles: function (e, s, c) { return e.card.name == c.name; },
        transform: function (e, s, c) { return t.transform(s, c); },
        //TODO: this is pretty sketchy...
        text: "After buying this, " + t.text.map(lowercaseFirst).join(', '),
    }); });
    var triggers = buyTriggers
        .concat(afterTriggers)
        .concat(extra.triggers || []);
    return __assign(__assign({}, card), { buyCost: cost, staticTriggers: triggers, staticReplacers: extra.replacers });
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
function registerEvent(card, set) {
    sets[set]['events'].push(card);
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
        text: ['Put your discard and play into your hand'],
        transform: function () { return ploughTransform; }
    };
}
function refreshEffect(n, doRecycle) {
    if (doRecycle === void 0) { doRecycle = true; }
    var text = ['Lose all $, actions, and buys.'];
    if (doRecycle)
        text.push('Put your discard and play into your hand.');
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
function coinsEffect(n) {
    return {
        text: ["+$" + n + "."],
        transform: function (s, c) { return gainCoins(n, c); },
    };
}
function pointsEffect(n) {
    return {
        text: ["+" + n + " vp."],
        transform: function (s, c) { return gainPoints(n, c); },
    };
}
function actionsEffect(n) {
    return {
        text: ["+" + num(n, 'action') + "."],
        transform: function (s, c) { return gainActions(n, c); },
    };
}
function buysEffect(n) {
    return {
        text: ["+" + num(n, 'buy') + "."],
        transform: function (state, card) { return gainBuys(n, card); },
    };
}
function buyEffect() { return buysEffect(1); }
function chargeEffect(n) {
    if (n === void 0) { n = 1; }
    return {
        text: ["Put " + aOrNum(n, 'charge token') + " on this."],
        transform: function (s, card) { return charge(card, n); }
    };
}
var refresh = { name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
};
registerEvent(refresh, 'core');
var copper = { name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
};
register(copper, 'core');
var silver = { name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
};
register(silver, 'core');
var gold = { name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
};
register(gold, 'core');
var estate = { name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
};
register(estate, 'core');
var duchy = { name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
};
register(duchy, 'core');
var province = { name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
};
register(province, 'core');
//
// ----- MIXINS -----
//
function register(card, set) {
    sets[set].cards.push(card);
}
function buyable(card, n, set, extra) {
    if (extra === void 0) { extra = {}; }
    card.buyCost = coin(n);
    register(supplyForCard(card, coin(n), extra), set);
}
function buyableFree(card, coins, set) {
    buyable(card, coins, set, { onBuy: [buyEffect()] });
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
        if ((reduction.coin || 0) > 0) {
            newCost = addCosts(newCost, { coin: 1 });
        }
        else if ((reduction.energy || 0) > 0) {
            newCost = addCosts(newCost, { energy: 1 });
        }
    }
    return newCost;
}
function costReduce(kind, reduction, nonzero) {
    if (nonzero === void 0) { nonzero = false; }
    var descriptor = descriptorForKind(kind);
    return {
        text: descriptor + " cost " + renderCost(reduction, true) + "\n               less" + (nonzero ? ' unless it would make them free' : '') + ".",
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
        text: descriptor + " cost " + renderCost(reduction, true) + "\n               less" + (nonzero ? ' unless it would make them free' : '') + ".\n        Whenever this reduces a cost, discard it.",
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
function applyToTarget(f, text, options, special) {
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
function targetedEffect(f, text, options) {
    return {
        text: [text],
        transform: function (s, c) { return applyToTarget(function (target) { return f(target, c); }, text, options); }
    };
}
function villageReplacer() {
    return costReduceNext('play', { energy: 1 });
}
var villager = {
    name: 'Villager',
    replacers: [{
            text: "Cards you play cost @ less. Whenever this reduces a cost, trash it.",
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
function repeat(t, n) {
    return doAll(Array(n).fill(t));
}
function createInPlayEffect(spec, n) {
    if (n === void 0) { n = 1; }
    return {
        text: ["Create " + aOrNum(n, spec.name) + " in play."],
        transform: function () { return repeat(create(spec, 'play'), n); }
    };
}
/*
const necropolis:CardSpec = {name: 'Necropolis',
    effects: [villagerEffect()],
    relatedCards: [villager],
}
buyableAnd(necropolis, 2, {onBuy: [villagerEffect()]})
*/
var ghostTown = { name: 'Ghost Town',
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager]
};
buyable(ghostTown, 3, 'base', { onBuy: [actionsEffect(2)] });
/*
const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
}
buyableFree(hound, 2)
*/
var transmogrify = { name: 'Transmogrify', effects: [{
            text: ["Trash a card in your hand.\n                If you do, choose a card in the supply costing up to $2 more than it.\n                Create a fresh copy of that card in your hand."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target, cost_1, target2;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, choice(state, 'Choose a card to transmogrify.', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target != null)) return [3 /*break*/, 5];
                                return [4 /*yield*/, trash(target)(state)];
                            case 2:
                                state = _c.sent();
                                cost_1 = addCosts(target.cost('buy', state), coin(2));
                                target2 = void 0;
                                return [4 /*yield*/, choice(state, 'Choose a card to copy.', state.supply.filter(function (c) { return leq(c.cost('buy', state), cost_1); }).map(asChoice))];
                            case 3:
                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target2 = _b[1];
                                if (!(target2 != null)) return [3 /*break*/, 5];
                                return [4 /*yield*/, create(target2.spec, 'hand')(state)];
                            case 4:
                                state = _c.sent();
                                _c.label = 5;
                            case 5: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(transmogrify, 3, 'base');
/*
const smithy:CardSpec = {name: 'Smithy',
    fixedCost: energy(1),
    effects: [actionEffect(3)],
}
buyable(smithy, 4)
*/
var Till = 'Till';
var till = { name: Till, effects: [{
            text: ["Put up to 3 non-" + Till + " cards from your\n               discard into your hand."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose up to three cards to put into your hand.', state.discard.filter(function (c) { return c.name != Till; }).map(asChoice), 3)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'hand')(state)];
                            case 2:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(till, 3, 'base');
var village = { name: 'Village',
    effects: [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
};
buyable(village, 4, 'base');
var bridge = { name: 'Bridge',
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce('buy', { coin: 1 }, true)]
};
buyable(bridge, 4, 'base');
var conclave = { name: 'Conclave', replacers: [{
            text: "Cards you play cost @ less if they don't share a name\n               with a card in your discard or in play.\n               Whenever this reduces a cost, discard it and +$2.",
            kind: 'cost',
            handles: function (x, state) { return (x.actionKind == 'play' && state.discard.concat(state.play).every(function (c) { return c.name != x.card.name; })); },
            replace: function (x, state, card) {
                var newCost = subtractCost(x.cost, { energy: 1 });
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([
                        move(card, 'discard'),
                        gainCoins(2)
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                else {
                    return x;
                }
            }
        }]
};
buyable(conclave, 4, 'base');
var lab = { name: 'Lab',
    effects: [actionsEffect(2)]
};
buyable(lab, 3, 'base');
var payAction = payCost(__assign(__assign({}, free), { actions: 1 }));
function tickEffect() {
    return {
        text: [],
        transform: function (state, card) { return tick(card); }
    };
}
function playTwice(card) {
    return applyToTarget(function (target) { return doAll([
        target.play(card),
        tick(card),
        target.play(card),
    ]); }, 'Choose a card to play twice.', function (s) { return s.hand; });
}
function throneroomEffect() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction, playTwice(card)); }
    };
}
var throneRoom = { name: 'Throne Room',
    fixedCost: energy(1),
    effects: [throneroomEffect()]
};
buyable(throneRoom, 5, 'base');
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1), triggers: [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            transform: function (e) { return gainCoins(1); },
        }]
};
buyable(coppersmith, 3, 'base');
var Unearth = 'Unearth';
var unearth = { name: Unearth,
    fixedCost: energy(1), effects: [coinsEffect(2), actionsEffect(1), targetedEffect(function (target) { return move(target, 'hand'); }, "Put a non-" + Unearth + " card from your discard into your hand.", function (state) { return state.discard.filter(function (c) { return c.name != Unearth; }); })
    ]
};
buyable(unearth, 4, 'base');
var celebration = { name: 'Celebration',
    fixedCost: energy(1),
    replacers: [costReduce('play', { energy: 1 })]
};
buyable(celebration, 8, 'base', { replacers: [{
            text: "Whenever you would create a " + celebration.name + " in your discard,\n    instead create it in play.",
            kind: 'create',
            handles: function (p) { return p.spec.name == celebration.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] });
var Plow = 'Plow';
var plow = { name: Plow,
    fixedCost: energy(1), effects: [{
            text: ["Put all non-" + Plow + " cards from your discard into your hand."],
            transform: function (state) { return doAll([
                moveMany(state.discard.filter(function (c) { return c.name != Plow; }), 'hand'),
                sortHand
            ]); }
        }]
};
buyable(plow, 4, 'base');
var construction = { name: 'Construction',
    fixedCost: energy(1),
    effects: [actionsEffect(3)], triggers: [{
            text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
            kind: 'cost',
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e) { return doAll([
                gainActions(e.cost.energy),
                gainCoins(e.cost.energy),
                gainBuys(e.cost.energy)
            ]); }
        }]
};
buyable(construction, 5, 'base');
var hallOfMirrors = { name: 'Hall of Mirrors', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [{
            text: ['Put a mirror token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'mirror'); }));
            }
        }], staticTriggers: [reflectTrigger('mirror')], };
registerEvent(hallOfMirrors, 'base');
function costPer(increment) {
    var extraStr = renderCost(increment, true) + " for each cost token on this.";
    return {
        calculate: function (card, state) {
            return multiplyCosts(increment, state.find(card).count('cost'));
        },
        text: extraStr,
    };
}
function incrementCost() {
    return {
        text: ['Put a cost token on this.'],
        transform: function (s, c) { return addToken(c, 'cost'); }
    };
}
/*
const restock:CardSpec = {name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), refreshEffect(5)],
}
registerEvent(restock)
*/
function useRefresh() {
    return targetedEffect(function (target, c) { return target.use(c); }, "Use " + refresh.name + ".", function (state) { return state.events.filter(function (c) { return c.name == refresh.name; }); });
}
var escalate = { name: 'Escalate',
    fixedCost: energy(1),
    variableCosts: [costPer(coin(1))], effects: [
        chargeEffect(),
        {
            text: ['Put a cost token on this for each charge token on it.'],
            transform: function (s, c) { return addToken(c, 'cost', s.find(c).charge); }
        },
        useRefresh()
    ]
};
registerEvent(escalate, 'base');
/*
const perpetualMotion:CardSpec = {name:'Perpetual Motion',
    restrictions: [{
        test: (card, state) => state.hand.length > 0
    }],
    effects: [{
        text: [`If you have no cards in your hand,
        put your discard into your hand.`],
        transform: () => async function(state) {
            if (state.hand.length == 0) {
                state = await moveMany(state.discard, 'hand')(state)
                state = sortHand(state)
            }
            return state
        }
    }]
}
registerEvent(perpetualMotion)

const scrapeBy:CardSpec = {name:'Scrape By',
    fixedCost: energy(2),
    effects: [refreshEffect(1)],
}
registerEvent(scrapeBy)
*/
var volley = {
    name: 'Volley',
    fixedCost: energy(1),
    effects: [{
            text: ["Repeat any number of times:\n        play then trash a card in your hand that was also there\n        at the start of this effect and that you haven't played yet."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_1, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.hand;
                                options = asNumberedChoices(cards);
                                _loop_1 = function () {
                                    var picked, id_1;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _b.sent();
                                                return [4 /*yield*/, trash(picked)(state)];
                                            case 4:
                                                state = _b.sent();
                                                id_1 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_1; });
                                                _b.label = 5;
                                            case 5: return [2 /*return*/];
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
            }; }
        }]
};
registerEvent(volley, 'base');
var parallelize = { name: 'Parallelize', fixedCost: __assign(__assign({}, free), { coin: 1, energy: 1 }),
    effects: [{
            text: ["Put a parallelize token on each card in your hand."],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'parallelize'); })); }
        }],
    staticReplacers: [{
            text: "Cards you play cost @ less to play for each parallelize token on them.\n            Whenever this reduces a card's cost by one or more @,\n            remove that many parallelize tokens from it.",
            kind: 'cost',
            handles: function (x, state, card) { return x.actionKind == 'play' && x.card.count('parallelize') > 0; },
            replace: function (x, state, card) {
                var reduction = Math.min(x.cost.energy, state.find(x.card).count('parallelize'));
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([
                            removeToken(x.card, 'parallelize', reduction, true)
                        ]) }) });
            }
        }]
};
registerEvent(parallelize, 'base');
var reach = { name: 'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
};
registerEvent(reach, 'base');
function trashOnLeavePlay() {
    return {
        text: "Whenever this would leave play, trash it.",
        kind: 'move',
        handles: function (x, state, card) { return x.card.id == card.id && x.fromZone == 'play'; },
        replace: function (x) { return (__assign(__assign({}, x), { toZone: 'void' })); }
    };
}
var fair = {
    name: 'Fair',
    replacers: [{
            text: "Whenever you would create a card in your discard,\n        instead create the card in your hand and trash this.",
            kind: 'create',
            handles: function (e, state, card) { return e.zone == 'discard'
                && state.find(card).place == 'play'; },
            replace: function (x, state, card) { return (__assign(__assign({}, x), { zone: 'hand', effects: x.effects.concat(function () { return trash(card); }) })); }
        }, trashOnLeavePlay()]
};
function costPerN(increment, n) {
    var extraStr = renderCost(increment, true) + " for every " + n + " cost tokens on this.";
    return {
        calculate: function (card, state) {
            return multiplyCosts(increment, Math.floor(state.find(card).count('cost') / n));
        },
        text: extraStr,
    };
}
var travelingFair = { name: 'Traveling Fair',
    fixedCost: coin(1),
    variableCosts: [costPerN(coin(1), 10)],
    effects: [incrementCost(), buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
};
registerEvent(travelingFair, 'base');
var philanthropy = { name: 'Philanthropy', fixedCost: __assign(__assign({}, free), { coin: 6, energy: 1 }),
    effects: [{
            text: ['Pay all $.', '+1 vp per $ paid.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.coin;
                                return [4 /*yield*/, payCost(__assign(__assign({}, free), { coin: n }))(state)];
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
registerEvent(philanthropy, 'base');
var finance = { name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
};
registerEvent(finance, 'base');
/*
const Orchard = 'Orchard'
const orchard:CardSpec = {
    name: Orchard,
    effects: [targetedEffect(
        (target, card) => target.buy(card),
        `Buy ${a(Orchard)} in the supply.`,
        state => state.supply.filter(c => c.name == Orchard)
    )]
}
buyable(orchard, 2, {onBuy: [pointsEffect(1)]})
*/
var flowerMarket = {
    name: 'Flower Market',
    effects: [buyEffect(), pointsEffect(1)]
};
buyable(flowerMarket, 2, 'base', { onBuy: [pointsEffect(1)] });
/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/
var vault = { name: 'Vault', restrictions: [{
            text: undefined,
            test: function (c, s, k) { return k == 'use'; }
        }],
    staticReplacers: [{
            text: "You can't lose actions, $, or buys (other than by paying costs).",
            kind: 'resource',
            handles: function (p) { return p.amount < 0 && (p.resource == 'coin' ||
                p.resource == 'actions' ||
                p.resource == 'buys'); },
            replace: function (p) { return (__assign(__assign({}, p), { amount: 0 })); }
        }]
};
registerEvent(vault, 'base');
/*
const coffers:CardSpec = {name: 'Coffers',
    restrictions: [{
        text: undefined,
        test: (c:Card, s:State, k:ActionKind) => k == 'use'
    }],
    staticReplacers: [{
        text: `You can't lose $ (other than by paying costs).`,
        kind: 'resource',
        handles: p => p.amount < 0 && p.resource == 'coin',
        replace: p => ({...p, amount:0})
    }]
}
registerEvent(coffers)
*/
var vibrantCity = { name: 'Vibrant City',
    effects: [pointsEffect(1), actionsEffect(1)],
};
buyable(vibrantCity, 3, 'base');
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than " + max + "."],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var frontier = { name: 'Frontier',
    fixedCost: energy(1), effects: [{
            text: ['+1 vp per charge token on this.'],
            transform: function (state, card) { return gainPoints(state.find(card).charge, card); }
        }, chargeEffect()]
};
buyable(frontier, 7, 'base', { replacers: [startsWithCharge(frontier.name, 2)] });
var investment = { name: 'Investment',
    fixedCost: energy(0), effects: [{
            text: ['+$1 per charge token on this.'],
            transform: function (state, card) { return gainCoins(state.find(card).charge, card); },
        }, chargeUpTo(6)]
};
buyable(investment, 4, 'base', { replacers: [startsWithCharge(investment.name, 2)] });
var populate = { name: 'Populate', fixedCost: __assign(__assign({}, free), { coin: 8, energy: 2 }),
    effects: [{
            text: ['Buy up to 6 cards in the supply.'],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, targets_1, targets_1_1, target, e_39_1;
                    var _a, e_39, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose up to 6 cards to buy', state.supply.map(asChoice), 6)];
                            case 1:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], targets = _a[1];
                                _c.label = 2;
                            case 2:
                                _c.trys.push([2, 7, 8, 9]);
                                targets_1 = __values(targets), targets_1_1 = targets_1.next();
                                _c.label = 3;
                            case 3:
                                if (!!targets_1_1.done) return [3 /*break*/, 6];
                                target = targets_1_1.value;
                                return [4 /*yield*/, target.buy(card)(state)];
                            case 4:
                                state = _c.sent();
                                _c.label = 5;
                            case 5:
                                targets_1_1 = targets_1.next();
                                return [3 /*break*/, 3];
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                e_39_1 = _c.sent();
                                e_39 = { error: e_39_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (targets_1_1 && !targets_1_1.done && (_b = targets_1.return)) _b.call(targets_1);
                                }
                                finally { if (e_39) throw e_39.error; }
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(populate, 'base');
var duplicate = { name: 'Duplicate', fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    effects: [{
            text: ["Put a duplicate token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'duplicate'); })); }
        }],
    staticTriggers: [{
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
registerEvent(duplicate, 'base');
var royalSeal = { name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair]
};
buyable(royalSeal, 5, 'base');
function workshopEffect(n) {
    return targetedEffect(function (target, card) { return target.buy(card); }, "Buy a card in the supply costing up to $" + n + ".", function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)); }); });
}
var workshop = { name: 'Workshop',
    fixedCost: energy(0),
    effects: [workshopEffect(4)],
};
buyable(workshop, 4, 'base');
var shippingLane = { name: 'Shipping Lane',
    fixedCost: energy(1),
    effects: [coinsEffect(2)], triggers: [{
            text: "Whenever you buy a card,\n            discard this to buy the card again.",
            kind: 'buy',
            handles: function (e, state, card) { return state.find(card).place == 'play'; },
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
buyable(shippingLane, 5, 'base');
var factory = { name: 'Factory',
    fixedCost: energy(1),
    effects: [workshopEffect(6)],
};
buyable(factory, 3, 'base');
var imitation = { name: 'Imitation',
    fixedCost: energy(1), effects: [targetedEffect(function (target, card) { return create(target.spec, 'hand'); }, 'Choose a card in your hand. Create a fresh copy of it in your hand.', function (state) { return state.hand; })]
};
buyable(imitation, 3, 'base');
var feast = { name: 'Feast',
    fixedCost: energy(0), effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); }), trashThis()]
};
buyableFree(feast, 3, 'base');
/*
const mobilization:CardSpec = {name: 'Mobilization',
    calculatedCost: costPlus(coin(10), coin(5)),
    effects: [chargeEffect(), incrementCost()],
    replacers: [{
        text: `${refresh.name} costs @ less to play for each charge token on this.`,
        kind:'cost',
        handles: x => (x.card.name == refresh.name),
        replace: (x, state, card) =>
            ({...x, cost:subtractCost(x.cost, {energy:state.find(card).charge})})
    }]
}
registerEvent(mobilization)
*/
var toil = { name: 'Toil',
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
};
registerEvent(toil, 'base');
function recycleEffect() {
    return {
        text: ['Put your discard into your hand.'],
        transform: function (state) { return doAll([moveMany(state.discard, 'hand'), sortHand]); }
    };
}
var recycle = { name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
};
registerEvent(recycle, 'base');
var twin = { name: 'Twin', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })],
    staticTriggers: [{
            text: "After playing a card with a twin token other than with this, play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) { return (e.card.count('twin') > 0 && e.source.id != card.id); },
            transform: function (e, state, card) { return e.card.play(card); },
        }],
};
registerEvent(twin, 'base');
function startsWithCharge(name, n) {
    return {
        text: "Each " + name + " is created with " + aOrNum(n, 'charge token') + " on it.",
        kind: 'create',
        handles: function (p) { return p.spec.name == name; },
        replace: function (p) { return (__assign(__assign({}, p), { effects: p.effects.concat([function (c) { return charge(c, n); }]) })); }
    };
}
function literalOptions(xs, keys) {
    return xs.map(function (x, i) { return ({
        render: { kind: 'string', string: x },
        hotkeyHint: { kind: 'key', val: keys[i] },
        value: x
    }); });
}
var researcher = { name: 'Researcher',
    fixedCost: energy(1), effects: [{
            text: ["+1 action for each charge token on this."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.find(card).charge;
                                return [4 /*yield*/, gainActions(n)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state
                                    /*
                                    for (let i = 0; i < n; i++) {
                                        let mode:string|null; [state, mode] = await choice(
                                            state,
                                            `Choose a benefit (${n - i} remaining)`,
                                            literalOptions(['action', 'coin'], ['a', 'c'])
                                        )
                                        switch(mode) {
                                            case 'coin':
                                                state = await gainCoins(1, card)(state)
                                                break
                                            case 'action':
                                                state = await gainActions(1, card)(state)
                                                break
                                        }
                                    }
                                    return state
                                    */
                                ];
                        }
                    });
                });
            }; }
        }, chargeEffect()]
};
buyable(researcher, 3, 'base', { replacers: [startsWithCharge(researcher.name, 3)] });
/*
const youngSmith:CardSpec = {name: 'Young Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+1 action per charge token on this.'],
        transform: (state, card) => gainActions(state.find(card).charge, card)
    }, chargeEffect()]
}
buyable(youngSmith, 3, {replacers: [startsWithCharge(youngSmith.name, 2)]})

const oldSmith:CardSpec = {name: 'Old Smith',
    fixedCost: energy(1),
    effects: [{
        text: ['+4 actions -1 per charge token on this.'],
        transform: (state, card) => gainActions(4 - state.find(card).charge, card),
    }, chargeEffect()]
}
buyable(oldSmith, 3)
*/
var lackeys = { name: 'Lackeys',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    relatedCards: [villager],
};
buyable(lackeys, 3, 'base', { onBuy: [createInPlayEffect(villager, 1)] });
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(1), effects: [{
            text: ['Create two golds in your hand.'],
            transform: function () { return doAll([create(gold, 'hand'), create(gold, 'hand')]); },
        }]
};
buyable(goldMine, 6, 'base');
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
    fixedCost: energy(1),
    effects: [targetedEffect(function (card) { return addToken(card, 'expedite', 1); }, 'Put an expedite token on a card in the supply.', function (state) { return state.supply; })],
    staticTriggers: [{
            text: "Whenever you create a card whose supply has an expedite token,\n               remove an expedite token to play the card.",
            kind: 'create',
            handles: function (e, state) { return nameHasToken(e.card, 'expedite', state); },
            transform: function (e, state, card) { return payToDo(applyToTarget(function (target) { return removeToken(target, 'expedite', 1, true); }, 'Remove an expedite token.', function (s) { return s.supply.filter(function (target) { return target.name == e.card.name; }); }, { cost: true }), e.card.play(card)); }
        }]
};
registerEvent(expedite, 'base');
function removeAllSupplyTokens(token) {
    return {
        text: ["Remove all " + token + " tokens from cards in the supply."],
        transform: function (state, card) { return doAll(state.supply.map(function (s) { return removeToken(s, token, 'all'); })); }
    };
}
var synergy = { name: 'Synergy', fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    effects: [removeAllSupplyTokens('synergy'), {
            text: ['Put synergy tokens on two cards in the supply.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, cards_1, cards_1_1, card, e_40_1;
                    var _a, e_40, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose two cards to synergize.', state.supply.map(asChoice), 2, 2)];
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
                                e_40_1 = _c.sent();
                                e_40 = { error: e_40_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                                }
                                finally { if (e_40) throw e_40.error; }
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
    staticTriggers: [{
            text: 'After buying a card with a synergy token other than with this,'
                + ' buy a different card with a synergy token with equal or lesser cost.',
            kind: 'afterBuy',
            handles: function (e, state, card) { return (e.source.id != card.id && e.card.count('synergy') > 0); },
            transform: function (e, state, card) { return applyToTarget(function (target) { return target.buy(card); }, 'Choose a card to buy.', function (s) { return s.supply.concat(s.events).filter(function (c) { return c.count('synergy') > 0
                && leq(c.cost('buy', s), e.card.cost('buy', s))
                && c.id != e.card.id; }); }); }
        }]
};
registerEvent(synergy, 'base');
var shelter = { name: 'Shelter', effects: [actionsEffect(1), targetedEffect(function (target) { return addToken(target, 'shelter'); }, 'Put a shelter token on a card.', function (state) { return state.play; })]
};
buyable(shelter, 3, 'base', {
    /*
    replacers: [{
        kind: 'move',
        text: `Whenever you would move a card with a shelter token,
               instead remove a shelter token from it.`,
        handles: (x, state) => x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x, skip:true,
            effects:x.effects.concat([removeToken(x.card, 'shelter')])
        })
    }]
    */
    replacers: [{
            kind: 'move',
            text: "Whenever you would move a card with a shelter token from play,\n               instead remove a shelter token from it.",
            handles: function (x, state) { return x.fromZone == 'play'
                && x.skip == false
                && state.find(x.card).count('shelter') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { skip: true, toZone: 'play', effects: x.effects.concat([removeToken(x.card, 'shelter')]) })); }
        }]
    /*
    }, {
        kind: 'move',
        text: `Whenever you would discard a card with a shelter token after playing it,
               instead put it in your hand and remove a shelter token.`,
        handles: (x, state) => x.fromZone == 'resolving'
            && x.toZone == 'discard'
            && x.skip == false
            && state.find(x.card).count('shelter') > 0,
        replace: x => ({...x, toZone:'hand', effects:x.effects.concat([removeToken(x.card, 'shelter')])})
    }]
    */
});
var market = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
};
buyable(market, 3, 'base');
var focus = { name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(1)],
};
registerEvent(focus, 'base');
var sacrifice = { name: 'Sacrifice', effects: [actionsEffect(1), buyEffect(), targetedEffect(function (target, card) { return doAll([target.play(card), trash(target)]); }, 'Play a card in your hand, then trash it.', function (state) { return state.hand; })]
};
buyable(sacrifice, 4, 'base');
var herbs = { name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
};
buyableFree(herbs, 2, 'base');
var spices = { name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
};
buyable(spices, 5, 'base', { onBuy: [coinsEffect(4)] });
var onslaught = { name: 'Onslaught', fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }), variableCosts: [costPer({ coin: 3 })], effects: [incrementCost(), {
            text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_2, state_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.hand;
                                options = asNumberedChoices(cards);
                                _loop_2 = function () {
                                    var picked, id_2;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _b.sent();
                                                id_2 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_2; });
                                                _b.label = 4;
                                            case 4: return [2 /*return*/];
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
    /*
    
        {
            text: [`Play any number of cards in your hand
            and discard the rest.`],
            transform: (state, card) => async function(state) {
                const cards:Card[] = state.hand
                state = await moveMany(cards, 'aside')(state)
                let options:Option<Card>[] = asNumberedChoices(cards)
                while (true) {
                    let picked:Card|null; [state, picked] = await choice(state,
                        'Pick a card to play next.',
                        allowNull(options))
                    if (picked == null) {
                        state = await moveMany(cards.filter(c => state.find(c).place == 'aside'), 'discard')(state)
                        return state
                    } else {
                        const id = picked.id
                        options = options.filter(c => c.value.id != id)
                        state = await picked.play(card)(state)
                    }
                }
            }
        }]
        */
};
registerEvent(onslaught, 'base');
//TODO: link these together, modules in general?
var colony = { name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(6)],
};
buyable(colony, 16, 'base');
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
};
buyable(platinum, 8, 'base');
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(6), buysEffect(2)]
};
buyable(greatSmithy, 6, 'base');
var resume = { name: 'Resume',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
};
registerEvent(resume, 'base');
function KCEffect() {
    return {
        text: ["Pay an action to play a card in your hand three times."],
        transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card),
        ]); }, 'Choose a card to play three times.', function (s) { return s.hand; })); }
    };
}
var kingsCourt = { name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()]
};
buyable(kingsCourt, 9, 'base');
var gardens = { name: "Gardens",
    fixedCost: energy(1), effects: [{
            text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
            transform: function (state, card) { return gainPoints(Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length) / 8), card); }
        }]
};
buyable(gardens, 4, 'base');
var decay = { name: 'Decay',
    fixedCost: coin(1), effects: [
        targetedEffect(function (target) { return removeToken(target, 'decay'); }, 'Remove a decay token from a card.', function (s) { return s.hand.concat(s.play).concat(s.discard)
            .filter(function (c) { return c.count('decay') > 0; }); })
    ],
    staticTriggers: [{
            text: "Whenever you move a card to your hand,\n            if it has two or more decay tokens on it trash it,\n            otherwise put a decay token on it.",
            kind: 'move',
            handles: function (e) { return e.toZone == 'hand'; },
            transform: function (e) { return (e.card.count('decay') >= 2) ?
                trash(e.card) : addToken(e.card, 'decay'); }
        }]
};
registerEvent(decay, 'base');
function reflectTrigger(token) {
    return {
        text: "After playing a card with " + a(token) + " token on it\n        other than with this, remove " + a(token) + " token and play it again.",
        kind: 'afterPlay',
        handles: function (e, state, card) {
            var played = state.find(e.card);
            return played.count(token) > 0 && e.source.name != card.name;
        },
        transform: function (e, s, card) { return doAll([
            removeToken(e.card, token),
            e.card.play(card),
        ]); },
    };
}
var reflect = { name: 'Reflect',
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })], effects: [incrementCost(), targetedEffect(function (target, card) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand', function (state) { return state.hand; })], staticTriggers: [reflectTrigger('reflect')], };
registerEvent(reflect, 'base');
var replicate = { name: 'Replicate',
    fixedCost: energy(1), effects: [targetedEffect(function (card) { return addToken(card, 'replicate', 1); }, 'Put a replicate token on a card in the supply.', function (state) { return state.supply; })],
    staticTriggers: [{
            text: "After buying a card with a replicate token on it other than with this,\n        remove a replicate token from it to buy it again.",
            kind: 'afterBuy',
            handles: function (e, state, card) {
                if (e.source.name == card.name)
                    return false;
                var target = state.find(e.card);
                return target.count('replicate') > 0;
            },
            transform: function (e, state, card) {
                return payToDo(removeToken(e.card, 'replicate'), e.card.buy(card));
            }
        }]
};
registerEvent(replicate, 'base');
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
/*
const inflation:CardSpec = {name: 'Inflation',
    calculatedCost: costPlus(energy(3), energy(1)),
    effects: [incrementCost(), setCoinEffect(15), setBuyEffect(5)],
    staticReplacers: [{
        text: `All costs of $1 or more are increased by $1 per cost token on this.`,
        kind: 'cost',
        handles: (p, state) => p.cost.coin > 0,
        replace: (p, state, card) => ({...p, cost:addCosts(p.cost, {coin:card.count('cost')})})
    }]
}
registerEvent(inflation)
*/
var inflation = { name: 'Inflation',
    fixedCost: energy(5), effects: [{
            text: ["Lose all $ and buys."],
            transform: function () { return doAll([setResource('coin', 0), setResource('buys', 0)]); }
        }, {
            text: ['+$15, +5 buys.'],
            transform: function () { return doAll([gainCoins(15), gainBuys(5)]); }
        }, incrementCost()],
    staticReplacers: [{
            text: "Cards cost $1 more to buy for each cost token on this.",
            kind: 'cost',
            handles: function (p, state) { return p.actionKind == 'buy'; },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, { coin: card.count('cost') }) })); }
        }, {
            text: "Events that cost at least $1 cost $1 more to use for each cost token on this.",
            kind: 'cost',
            handles: function (p, state) { return p.actionKind == 'use' && p.cost.coin > 0; },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, { coin: card.count('cost') }) })); }
        }]
};
registerEvent(inflation, 'base');
var burden = { name: 'Burden',
    fixedCost: energy(1), effects: [{
            text: ['Remove a burden token from each supply.'],
            transform: function (state) { return doAll(state.supply.map(function (c) { return removeToken(c, 'burden'); })); }
        }],
    staticTriggers: [{
            text: 'Whenever you create a card, put a burden token on its supply.',
            kind: 'create',
            handles: function (e, state) { return true; },
            transform: function (e, state) { return doAll(state.supply.filter(function (c) { return c.name == e.card.name; }).map(function (c) { return addToken(c, 'burden'); })); }
        }],
    staticReplacers: [{
            kind: 'costIncrease',
            text: 'Cards cost $2 more to buy for each burden token on them or their supply.',
            handles: function (x, state) { return (nameHasToken(x.card, 'burden', state)) && x.actionKind == 'buy'; },
            replace: function (x, state) { return (__assign(__assign({}, x), { cost: addCosts(x.cost, { coin: 2 * (countNameTokens(x.card, 'burden', state)) }) })); }
        }]
};
registerEvent(burden, 'base');
/*
const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionsEffect(3), coinsEffect(3)]
}
buyable(goldsmith, 7)
*/
var procession = { name: 'Procession',
    fixedCost: energy(1), effects: [{
            text: ["Pay one action to play a card in your hand twice,\n                then trash it and buy a card in the supply\n                costing exactly $1 or $2 more."],
            transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(function (target2) { return target2.buy(card); }, 'Choose a card to buy.', function (s) { return s.supply.filter(function (c) { return eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 1 })) || eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 2 })); }); })
            ]); }, 'Choose a card to play twice.', function (s) { return s.hand; })); }
        }]
};
buyable(procession, 4, 'base');
var publicWorks = { name: 'Public Works',
    effects: [],
    replacers: [costReduceNext('use', { energy: 1 }, true)],
};
buyable(publicWorks, 6, 'base');
function fragileEcho(t) {
    if (t === void 0) { t = 'echo'; }
    return {
        text: "Whenever a card with " + a(t) + " token would move to your hand or discard,\n               trash it instead.",
        kind: 'move',
        handles: function (p, state) { return state.find(p.card).count(t) > 0
            && (p.toZone == 'hand' || p.toZone == 'discard'); },
        replace: function (p) { return (__assign(__assign({}, p), { toZone: 'void' })); }
    };
}
function dedupBy(xs, f) {
    var e_41, _a;
    var result = [];
    var _loop_3 = function (x) {
        if (result.every(function (r) { return f(r) != f(x); })) {
            result.push(x);
        }
    };
    try {
        for (var xs_2 = __values(xs), xs_2_1 = xs_2.next(); !xs_2_1.done; xs_2_1 = xs_2.next()) {
            var x = xs_2_1.value;
            _loop_3(x);
        }
    }
    catch (e_41_1) { e_41 = { error: e_41_1 }; }
    finally {
        try {
            if (xs_2_1 && !xs_2_1.done && (_a = xs_2.return)) _a.call(xs_2);
        }
        finally { if (e_41) throw e_41.error; }
    }
    return result;
}
var echo = { name: 'Echo', effects: [targetedEffect(function (target, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createAndTrack(target.spec, 'void')(state)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), copy = _a[0], state = _a[1];
                            if (!(copy != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, addToken(copy, 'echo')(state)];
                        case 2:
                            state = _b.sent();
                            return [4 /*yield*/, copy.play(card)(state)];
                        case 3:
                            state = _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Create a fresh copy of a card you have in play,\n         then put an echo token on the copy and play it.", function (state) { return dedupBy(state.play, function (c) { return c.spec; }); })]
};
buyable(echo, 6, 'base', { replacers: [fragileEcho('echo')] });
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
    effects: [],
    restrictions: [{
            test: function (c, s, k) { return k == 'activate' && (c.charge < 1); }
        }],
    replacers: [{
            text: "Whenever you would move this from play to your hand,\n        instead leave it in play. If it doesn't have a charge token on it, put one on it.",
            kind: 'move',
            handles: function (x, state, card) { return (x.fromZone == 'play' && x.toZone == 'hand'
                && x.card.id == card.id); },
            replace: function (x, state, card) {
                return (__assign(__assign({}, x), { skip: true, effects: x.effects.concat([
                        function (state) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(state.find(card).charge == 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, charge(card, 1)(state)];
                                        case 1:
                                            state = _a.sent();
                                            _a.label = 2;
                                        case 2: return [2 /*return*/, state];
                                    }
                                });
                            });
                        }
                    ]) }));
            }
        }],
    ability: [{
            text: ["Remove a charge token from this and pay an action\n        to play a card from your hand three times. If you do, discard this."],
            transform: function (state, card) { return payToDo(payCost(__assign(__assign({}, free), { actions: 1, effects: [discharge(card, 1)] })), applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
                move(card, 'discard')
            ]); }, 'Choose a card to play three times.', function (s) { return s.hand; })); }
        }],
};
buyable(mastermind, 6, 'base');
function chargeVillage() {
    return {
        text: "Cards you play cost @ less for each charge token on this.\n            Whenever this reduces a cost by one or more @, remove that many charge tokens from this.",
        kind: 'cost',
        handles: function (x, state, card) { return (x.actionKind == 'play') && card.charge > 0; },
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
var recruitment = {
    name: 'Recruitment',
    relatedCards: [villager, fair],
    effects: [actionsEffect(1)],
    triggers: [{
            text: "Whenever you pay @,\n               create that many " + villager.name + "s and " + fair.name + "s in play.",
            kind: 'cost',
            handles: function (e, state, card) { return e.cost.energy > 0; },
            transform: function (e, state, card) { return doAll([villager, fair].map(function (c) { return repeat(create(c, 'play'), e.cost.energy); })); }
        }]
};
buyable(recruitment, 3, 'base');
var dragon = { name: 'Dragon',
    buyCost: coin(7), effects: [targetedEffect(function (c) { return trash(c); }, 'Trash a card in your hand.', function (s) { return s.hand; }), coinsEffect(5), actionsEffect(3), buyEffect()]
};
var hatchery = { name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon], effects: [actionsEffect(1), {
            text: ["If this has a charge token, remove it and\n                create " + a(dragon.name) + " in your discard.\n                Otherwise, put a charge token on this."],
            transform: function (state, card) {
                var c = state.find(card);
                return (c.charge >= 1)
                    ? doAll([
                        discharge(c, 1),
                        create(dragon, 'discard')
                    ]) : charge(c);
            }
        }]
};
buyable(hatchery, 3, 'base');
var looter = { name: 'Looter', effects: [{
            text: ["Discard up to four cards from your hand for +1 action each."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose up to four cards to discard', state.hand.map(asChoice), 4)];
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
buyable(looter, 4, 'base');
var palace = { name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
};
buyable(palace, 5, 'base');
var Innovation = 'Innovation';
var innovation = { name: Innovation,
    effects: [actionsEffect(1), toPlay()],
};
buyable(innovation, 6, 'base', { triggers: [{
            text: "When you create a card in your discard,\n    discard an " + innovation.name + " from play in order to play it.\n    (If you have multiple, discard the oldest.)",
            kind: 'create',
            handles: function (e) { return e.zone == 'discard'; },
            transform: function (e, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var innovations;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                innovations = state.play.filter(function (c) { return c.name == innovation.name; });
                                if (!(innovations.length > 0)) return [3 /*break*/, 3];
                                return [4 /*yield*/, move(innovations[0], 'discard')(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, e.card.play(card)(state)];
                            case 2:
                                state = _a.sent();
                                _a.label = 3;
                            case 3: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }] });
var formation = { name: 'Formation',
    effects: [], replacers: [{
            text: 'Cards you play cost @ less if they share a name with a card in your discard or in play.'
                + ' Whenever this reduces a cost, discard it and +2 actions.',
            kind: 'cost',
            handles: function (x, state) { return x.actionKind == 'play'
                && state.discard.concat(state.play).some(function (c) { return c.name == x.card.name; }); },
            replace: function (x, state, card) {
                var newCost = subtractCost(x.cost, { energy: 1 });
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([
                        move(card, 'discard'),
                        gainActions(2),
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                else {
                    return x;
                }
            }
        }]
};
buyable(formation, 4, 'base');
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
                                if (!(i < n)) return [3 /*break*/, 4];
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
            }; }, "Choose a card to play with " + Traveler + ".", function (s) { return s.hand; })); }
        }, chargeUpTo(3)]
};
buyable(traveler, 7, 'base', { replacers: [startsWithCharge(traveler.name, 1)] });
var fountain = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [refreshEffect(5, false)],
};
buyable(fountain, 4, 'base');
/*
const chameleon:CardSpec = {
    name:'Chameleon',
    replacers: [{
        text: `As long as this has a charge token on it,
        whenever you would gain $ instead gain that many actions and vice versa.`,
        kind: 'resource',
        handles: (x, state, card) => state.find(card).charge > 0 && x.amount > 0,
        replace: x => ({...x, resource:
            (x.resource == 'coin') ? 'actions' :
            (x.resource == 'actions') ? 'coin' :
            x.resource })
    }],
    effects: [{
        text: [`If this has a charge token on it, remove all charge tokens.
        Otherwise, put a charge token on it.`],
        transform: (state, card) => (state.find(card).charge > 0) ?
            uncharge(card) : charge(card, 1),
    }]
}
registerEvent(chameleon)
const ball:CardSpec = {
    name: 'Ball',
    fixedCost: {...free, energy:1, coin:1},
    effects: [chargeEffect()],
    triggers: [{
        text:`Whenever you buy a card,
              remove a charge token from this to buy a card of equal or lesser cost.`,
        kind:'buy',
        handles: (e, s, c) => s.find(c).charge > 0,
        transform: (e, s, c) => payToDo(
            discharge(c, 1),
            applyToTarget(
                target => target.buy(c),
                'Choose a card to buy.',
                state => state.supply.filter(option =>
                    leq(option.cost('buy', s), e.card.cost('buy', s))
                )
            )
        )
    }]
}
registerEvent(ball)
*/
var lostArts = {
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    name: 'Lost Arts',
    effects: [targetedEffect(function (card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, c, e_42_1;
                var e_42, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, addToken(card, 'art', 8)(state)];
                        case 1:
                            state = _d.sent();
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 7, 8, 9]);
                            _a = __values(state.supply), _b = _a.next();
                            _d.label = 3;
                        case 3:
                            if (!!_b.done) return [3 /*break*/, 6];
                            c = _b.value;
                            if (!(c.id != card.id)) return [3 /*break*/, 5];
                            return [4 /*yield*/, removeToken(c, 'art', 'all')(state)];
                        case 4:
                            state = _d.sent();
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_42_1 = _d.sent();
                            e_42 = { error: e_42_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_42) throw e_42.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Put eight art tokens on a card in the supply.\n        Remove all art tokens from other cards in the supply.", function (s) { return s.supply; })],
    staticReplacers: [{
            text: "Cards you play cost @ less for each art token on their supply.\n               Whenever this reduces a cost by one or more @,\n               remove that many art tokens.",
            kind: 'cost',
            handles: function (x, state, card) { return (x.actionKind == 'play')
                && nameHasToken(x.card, 'art', state); },
            replace: function (x, state, card) {
                card = state.find(card);
                var reduction = Math.min(x.cost.energy, countNameTokens(x.card, 'art', state));
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([repeat(applyToTarget(function (target) { return removeToken(target, 'art'); }, 'Remove an art token from a supply.', function (state) { return state.supply.filter(function (c) { return c.name == x.card.name && c.count('art') > 0; }); }), reduction)]) }) });
            }
        }]
};
registerEvent(lostArts, 'base');
var grandMarket = {
    name: 'Grand Market',
    /*
    restrictions: [{
        text: `You can't buy this if you have any
        ${copper.name}s in your discard.`,
        test: (c:Card, s:State, k:ActionKind) => k == 'buy' &&
            s.discard.some(x => x.name == copper.name)
    }],
    */
    effects: [coinsEffect(2), actionsEffect(1), buyEffect()],
};
buyable(grandMarket, 5, 'base');
/*
const greatHearth:CardSpec = {
    name: 'Great Hearth',
    effects: [actionEffect(1)],
    triggers: [{
        text: `Whenever you play ${a(estate.name)}, +1 action.`,
        kind: 'play',
        handles: e => e.card.name == estate.name,
        transform: (e, state, card) => gainActions(1, card)
    }]
}
buyable(greatHearth, 3)
*/
var Industry = 'Industry';
function industryTransform(n, except) {
    if (except === void 0) { except = Industry; }
    return applyToTarget(function (target) { return target.buy(); }, "Buy a card in the supply costing up to $" + n + " not named " + except + ".", function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)) && x.name != Industry; }); });
}
var industry = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
            text: ["Do this twice: buy a card in the supply costing up to $8 other than " + Industry + "."],
            transform: function (state, card) { return doAll([
                industryTransform(8, Industry),
                tick(card),
                industryTransform(8, Industry)
            ]); }
        }]
};
buyable(industry, 6, 'base');
var homesteading = {
    name: 'Homesteading',
    effects: [actionsEffect(1)],
    relatedCards: [villager],
    triggers: [{
            text: "Whenever you play " + a(estate.name) + " or " + duchy.name + ",\n               create " + a(villager.name) + " in play.",
            kind: 'play',
            handles: function (e, state, card) { return e.card.name == estate.name
                || e.card.name == duchy.name; },
            transform: function (e, state, card) { return create(villager, 'play'); }
        }],
};
buyable(homesteading, 3, 'base');
var duke = {
    name: 'Duke',
    effects: [],
    triggers: [{
            text: "Whenever you play " + a(duchy.name) + ", +1 vp.",
            kind: 'play',
            handles: function (e) { return e.card.name == duchy.name; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
buyable(duke, 4, 'base');
var carpenter = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
            text: ["+1 action per card in play."],
            transform: function (state, card) { return gainActions(state.play.length, card); }
        }]
};
buyable(carpenter, 4, 'base');
var artificer = {
    name: 'Artificer',
    effects: [{
            text: ["Discard any number of cards.",
                "Choose a card in the supply costing $1 per card you discarded,\n        and create a copy in your hand."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, n, target;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to discard.', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'discard')(state)];
                            case 2:
                                state = _c.sent();
                                n = targets.length;
                                return [4 /*yield*/, choice(state, "Choose a card costing $" + n + " to gain a copy of.", state.supply.filter(function (c) { return c.cost('buy', state).coin == n; }).map(asChoice))];
                            case 3:
                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                                if (!(target != null)) return [3 /*break*/, 5];
                                return [4 /*yield*/, create(target.spec, 'hand')(state)];
                            case 4:
                                state = _c.sent();
                                _c.label = 5;
                            case 5: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(artificer, 3, 'base');
var banquet = {
    name: 'Banquet',
    restrictions: [{
            test: function (c, s, k) {
                return k == 'activate' &&
                    s.hand.some(function (c) { return c.count('neglect') > 0; });
            }
        }],
    effects: [coinsEffect(3), {
            text: ['Put a neglect token on each card in your hand.'],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'neglect'); })); },
        }],
    triggers: [{
            text: "Whenever a card moves, remove all neglect tokens from it.",
            kind: 'move',
            handles: function (p) { return p.fromZone != p.toZone; },
            transform: function (p) { return removeToken(p.card, 'neglect', 'all'); }
        }],
    replacers: [{
            text: "Whenever you'd move this to your hand, instead leave it in play.",
            kind: 'move',
            handles: function (p, state, card) { return p.card.id == card.id && p.toZone == 'hand'; },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { skip: true })); }
        }],
    ability: [{
            text: ["If you have no cards in your hand with neglect tokens on them,\n        discard this for +$3."],
            transform: function (state, card) { return payToDo(discardFromPlay(card), gainCoins(3)); }
        }]
};
buyable(banquet, 3, 'base');
function countDistinct(xs) {
    var e_43, _a;
    var distinct = new Set();
    var result = 0;
    try {
        for (var xs_3 = __values(xs), xs_3_1 = xs_3.next(); !xs_3_1.done; xs_3_1 = xs_3.next()) {
            var x = xs_3_1.value;
            if (!distinct.has(x)) {
                result += 1;
                distinct.add(x);
            }
        }
    }
    catch (e_43_1) { e_43 = { error: e_43_1 }; }
    finally {
        try {
            if (xs_3_1 && !xs_3_1.done && (_a = xs_3.return)) _a.call(xs_3);
        }
        finally { if (e_43) throw e_43.error; }
    }
    return result;
}
function countDistinctNames(xs) {
    return countDistinct(xs.map(function (c) { return c.name; }));
}
var harvest = {
    name: 'Harvest',
    fixedCost: energy(1),
    effects: [{
            text: ["+1 action for each differently-named card in your hand."],
            transform: function (state) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = countDistinctNames(state.hand);
                                return [4 /*yield*/, gainActions(n)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, {
            text: ["+$1 for each differently-named card in your discard."],
            transform: function (state) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = countDistinctNames(state.discard);
                                return [4 /*yield*/, gainCoins(n)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(harvest, 3, 'base');
/*
const horseTraders:CardSpec = {
    name:'Horse Traders',
    fixedCost: energy(1),
    effects: [{
        text: ['If you have any actions, lose 1.'],
        transform: (state, card) => gainActions(-1, card)
    }, gainCoinEffect(4), buyEffect()]
}
buyable(horseTraders, 4)
*/
var secretChamber = {
    name: 'Secret Chamber',
    fixedCost: energy(1),
    effects: [{
            text: ["Discard any number of cards from your hand for +$1 each."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Discard any number of cards for +$1 each.', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'discard')(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, gainCoins(targets.length)(state)];
                            case 3:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(secretChamber, 3, 'base');
var hireling = {
    name: 'Hireling',
    relatedCards: [fair],
    effects: [],
    replacers: [{
            text: "Whenever you would move this to your hand,\n               instead +1 action, +1 buy, +$1, and create a " + fair.name + " in play.",
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.toZone == 'hand' && p.skip == false; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([
                    gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play')
                ]) })); }
        }]
};
buyable(hireling, 2, 'base');
/*
const hirelings:CardSpec = {
    name: 'Hirelings',
    effects: [buyEffect()],
    replacers: [{
        text: 'Whenever you would move this to your hand, instead +2 actions and +1 buy.',
        kind: 'move',
        handles: (p, s, c) => p.card.id == c.id && p.toZone == 'hand' && p.skip == false,
        replace: (p, s, c) => ({...p, skip:true, effects:p.effects.concat([
            gainActions(2, c), gainBuys(1, c)
        ])})
    }]
}
buyable(hirelings, 3)
*/
function toPlay() {
    return {
        text: ["Put this in play."],
        transform: function (state, c) { return move(c, 'play'); }
    };
}
//TODO: "buy normal way" should maybe be it's own trigger with a cost field?
var haggler = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
};
buyable(haggler, 5, 'base', {
    triggers: [{
            text: "After buying a card the normal way,\n        buy an additional card for each " + haggler.name + " in play.\n        Each card you buy this way must cost at least $1 less than the previous one.",
            kind: 'afterBuy',
            handles: function (p) { return p.source.name == 'act'; },
            transform: function (p, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var lastCard, hagglers, haggler_1, target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                lastCard = p.card;
                                hagglers = state.play.filter(function (c) { return c.name == haggler.name; });
                                _b.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 5];
                                haggler_1 = hagglers.shift();
                                if (haggler_1 === undefined) {
                                    return [2 /*return*/, state];
                                }
                                state = state.startTicker(haggler_1);
                                lastCard = state.find(lastCard);
                                target = void 0;
                                return [4 /*yield*/, choice(state, "Choose a cheaper card than " + lastCard.name + " to buy.", state.supply.filter(function (c) { return leq(addCosts(c.cost('buy', state), { coin: 1 }), lastCard.cost('buy', state)); }).map(asChoice))];
                            case 2:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target !== null)) return [3 /*break*/, 4];
                                lastCard = target;
                                return [4 /*yield*/, target.buy(card)(state)];
                            case 3:
                                state = _b.sent();
                                _b.label = 4;
                            case 4:
                                state = state.endTicker(haggler_1);
                                hagglers = hagglers.filter(function (c) { return state.find(c).place == 'play'; });
                                return [3 /*break*/, 1];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
});
/*
const haggler:CardSpec = {
    name: 'Haggler',
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `Whenever you buy a card the normal way,
        buy a card in the supply costing at least $1 less.`,
        kind: 'buy',
        handles: p => p.source.name == 'act',
        transform: (p, state, card) => applyToTarget(
            target => target.buy(card),
            "Choose a cheaper card to buy.",
            s => s.supply.filter(
                c => leq(
                    addCosts(c.cost('buy', s), {coin:1}),
                    p.card.cost('buy', s)
                )
            )
        )
    }]
}
buyable(haggler, 6)
*/
var reuse = {
    name: 'Reuse',
    fixedCost: energy(2),
    effects: [{
            text: ["Repeat any number of times:\n                choose a card in your discard without a reuse token\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_4, state_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.discard.filter(function (c) { return c.count('reuse') == 0; });
                                options = asNumberedChoices(cards);
                                _loop_4 = function () {
                                    var picked, id_3;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'discard'; })))];
                                            case 1:
                                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _b.sent();
                                                return [4 /*yield*/, addToken(picked, 'reuse')(state)];
                                            case 4:
                                                state = _b.sent();
                                                id_3 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_3; });
                                                _b.label = 5;
                                            case 5: return [2 /*return*/];
                                        }
                                    });
                                };
                                _a.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 3];
                                return [5 /*yield**/, _loop_4()];
                            case 2:
                                state_3 = _a.sent();
                                if (typeof state_3 === "object")
                                    return [2 /*return*/, state_3.value];
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(reuse, 'base');
var polish = {
    name: 'Polish',
    fixedCost: __assign(__assign({}, free), { coin: 1, energy: 1 }),
    effects: [{
            text: ["Put a polish token on each card in your hand."],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'polish'); })); }
        }],
    staticTriggers: [{
            text: "Whenever you play a card with a polish token on it,\n        remove a polish token from it and +$1.",
            kind: 'play',
            handles: function (e, state) { return (e.card.count('polish') > 0); },
            transform: function (e) { return doAll([removeToken(e.card, 'polish'), gainCoins(1)]); }
        }]
};
registerEvent(polish, 'base');
var mire = {
    name: 'Mire',
    fixedCost: energy(4),
    effects: [{
            text: ["Remove all mire tokens from all cards."],
            transform: function (state) { return doAll(state.discard.concat(state.play).concat(state.hand).map(function (c) { return removeToken(c, 'mire', 'all'); })); }
        }],
    staticTriggers: [{
            text: "Whenever a card leaves your hand, put a mire token on it.",
            kind: 'move',
            handles: function (e, state) { return e.fromZone == 'hand'; },
            transform: function (e) { return addToken(e.card, 'mire'); },
        }],
    staticReplacers: [{
            text: "Cards with mire tokens can't move to your hand.",
            kind: 'move',
            handles: function (x) { return (x.toZone == 'hand') && x.card.count('mire') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { skip: true })); }
        }]
};
registerEvent(mire, 'base');
var commerce = {
    name: 'Commerce',
    fixedCost: coin(1),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager)],
};
/*
const commerce:CardSpec = {
    name: 'Commerce',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay all $.`, `Put a charge token on this for each $ paid.`],
        transform: (state, card) => async function(state) {
            const n = state.coin
            state = await payCost({...free, coin:n})(state)
            state = await charge(card, n)(state)
            return state
        }
    }],
    staticReplacers: [chargeVillage()]
}
*/
registerEvent(commerce, 'base');
function reverbEffect(card) {
    return create(card.spec, 'play', function (c) { return addToken(c, 'echo'); });
}
var reverberate = {
    name: 'Reverberate',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 1 }),
    effects: [{
            text: ["For each card in play without an echo token,\n            create a copy in play with an echo token."],
            transform: function (state) { return doAll(state.play.filter(function (c) { return c.count('echo') == 0; }).map(reverbEffect)); }
        }],
    staticReplacers: [fragileEcho('echo')]
};
registerEvent(reverberate, 'base');
/*
const preparations:CardSpec = {
    name: 'Preparations',
    fixedCost: energy(1),
    effects: [],
    replacers: [{
        text: `When you would move this to your hand,
            instead move it to your discard and gain +1 buy, +$2, and +3 actions.`,
        kind: 'move',
        handles: (p, state, card) => (p.card.id == card.id && p.toZone == 'hand'),
        replace: p => ({...p,
            toZone:'discard',
            effects:p.effects.concat([gainBuys(1), gainCoin(2), gainActions(3)])
        })
    }]
}
buyable(preparations, 3)
*/
var turnpike = {
    name: 'Turnpike',
    fixedCost: energy(2),
    effects: [],
    triggers: [{
            kind: 'play',
            text: "Whenever you play a card, put a charge token on this.\n        If it has two charge tokens, remove them for +1vp.",
            handles: function () { return true; },
            transform: function (e, state, card) { return doAll([
                charge(card, 1),
                payToDo(discharge(card, 2), gainPoints(1))
            ]); }
        }]
};
buyable(turnpike, 5, 'base');
var highway = {
    name: 'Highway',
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', { coin: 1 }, true)],
};
buyable(highway, 6, 'base', { replacers: [{
            text: "Whenever you would create a " + highway.name + " in your discard,\n    instead create it in play.",
            kind: 'create',
            handles: function (p) { return p.spec.name == highway.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] });
function sum(xs, f) {
    return xs.map(f).reduce(function (a, b) { return a + b; });
}
function countNameTokens(card, token, state) {
    return sum(state.supply, function (c) { return (c.name == card.name) ? c.count(token) : 0; });
}
function nameHasToken(card, token, state) {
    return state.supply.some(function (s) { return s.name == card.name && s.count(token) > 0; });
}
var prioritize = {
    name: 'Prioritize',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 6); }, 'Put six priority tokens on a card in the supply.', function (state) { return state.supply; })],
    staticTriggers: [{
            text: "Whenever you create a card whose supply\n            has a priority token,\n            remove a priority token to play the card.",
            kind: 'create',
            handles: function (e, state) { return nameHasToken(e.card, 'priority', state); },
            transform: function (e, state, card) { return payToDo(applyToTarget(function (target) { return removeToken(target, 'priority', 1, true); }, 'Remove a priority token.', function (s) { return s.supply.filter(function (target) { return target.name == e.card.name; }); }, { cost: true }), e.card.play(card)); }
        }]
};
registerEvent(prioritize, 'base');
var composting = {
    name: 'Composting',
    effects: [actionsEffect(1)],
    triggers: [{
            kind: 'cost',
            text: "Whenever you pay @,\n        you may put a card from your discard into your hand.",
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = e.cost.energy;
                                return [4 /*yield*/, multichoice(state, "Choose up to " + num(n, 'card') + " to put into your hand.", state.discard.map(asChoice), n)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [2 /*return*/, moveMany(targets, 'hand')(state)];
                        }
                    });
                });
            }; }
        }]
};
buyable(composting, 3, 'base');
var FairyGold = 'Fairy Gold';
var fairyGold = {
    name: FairyGold,
    effects: [buyEffect(), {
            text: ["+$1 per charge token on this."],
            transform: function (state, card) { return gainCoins(state.find(card).charge); },
        }, {
            text: ["Remove a charge token from this. If you can't, trash it."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(state.find(card).charge > 0)) return [3 /*break*/, 2];
                                return [4 /*yield*/, discharge(card, 1)(state)];
                            case 1:
                                state = _a.sent();
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, trash(card)(state)];
                            case 3:
                                state = _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
};
buyable(fairyGold, 3, 'base', {
    replacers: [startsWithCharge(fairyGold.name, 3)]
});
var pathfinding = {
    name: 'Pathfinding',
    fixedCost: __assign(__assign({}, free), { coin: 7, energy: 1 }),
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(function (target) { return addToken(target, 'pathfinding'); }, "Put a pathfinding token on a card in the supply other than Copper.", function (state) { return state.supply.filter(function (target) { return target.name != copper.name; }); })],
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a card whose supply\n        has a  pathfinding token on it, +1 action.",
            handles: function (e, state) { return nameHasToken(e.card, 'pathfinding', state); },
            transform: function (e, state, card) { return gainActions(1, card); }
        }]
};
registerEvent(pathfinding, 'base');
var fortune = {
    name: 'Fortune',
    effects: [{
            text: ["Double your $."],
            transform: function (state, card) { return gainCoins(state.coin); }
        }, {
            text: ["Double your buys."],
            transform: function (state, card) { return gainBuys(state.buys); }
        }]
};
buyable(fortune, 12, 'base', { afterBuy: [{ text: ['trash it from the supply.'], transform: function (s, c) { return trash(c); } }] });
// ------------------- Expansion ---------------
var flourish = {
    name: 'Flourish',
    fixedCost: energy(1),
    effects: [{
            text: ["Double the number of cost tokens on this, then add one."],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        return [2 /*return*/, addToken(c, 'cost', state.find(c).count('cost') + 1)(state)];
                    });
                });
            }; }
        }, useRefresh()],
    restrictions: [{
            text: 'You must have at least 1 vp per cost token on this.',
            test: function (c, s, k) { return s.points < s.find(c).count('cost'); }
        }]
};
registerEvent(flourish, 'expansion');
var greed = {
    name: 'Greed',
    fixedCost: energy(1),
    effects: [{
            text: ["Lose all vp. For each lost, +$2, +1 action and +1 buy."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.points;
                                return [4 /*yield*/, gainPoints(-n)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainCoins(2 * n)(state)];
                            case 2:
                                state = _a.sent();
                                return [4 /*yield*/, gainActions(n)(state)];
                            case 3:
                                state = _a.sent();
                                return [4 /*yield*/, gainBuys(n)(state)];
                            case 4:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(greed, 'expansion');
var strive = {
    name: 'Strive',
    fixedCost: __assign(__assign({}, free), { energy: 2, coin: 3 }),
    effects: [workshopEffect(7)]
};
registerEvent(strive, 'expansion');
var delve = {
    name: 'Delve',
    fixedCost: coin(2),
    effects: [createEffect(silver)]
};
registerEvent(delve, 'expansion');
var hesitation = {
    name: 'Hesitation',
    restrictions: [{
            text: undefined,
            test: function (c, s, k) { return k == 'use'; }
        }],
    staticReplacers: [{
            text: "Cards cost an extra @ to play or use.",
            kind: 'cost',
            handles: function (p, s, c) { return (p.actionKind == 'play' || p.actionKind == 'use')
                && p.card.id != c.id; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: __assign(__assign({}, p.cost), { energy: p.cost.energy + 1 }) })); }
        }]
};
//registerEvent(hesitation, 'expansion')
/*
const pillage:CardSpec = {
    name: 'Pillage',
    effects: [targetedEffect(
        (target, card) => addToken(target, 'pillage'),
        'Put a pillage token on a card in the supply.',
        s => s.supply
    )],
    staticTriggers: [{
        text: `Whenever you create a card whose supply has a pillage token on it,
        trash the supply to play the card.`,
        kind: 'create',
        handles: (e, s) => s.supply.some(
            sup => sup.count('pillage') > 0 &&
            sup.name == e.card.name
        ),
        transform: (e, s, c) => payToDo(
            applyToTarget(
                target => trash(target),
                'Choose a supply to trash.',
                state => state.supply.filter(sup => sup.name == e.card.name),
                {cost: true}
            ), e.card.play(c)
        )
    }]
}
registerEvent(pillage, 'expansion')
*/
var festival = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 3)],
    relatedCards: [fair]
};
registerEvent(festival, 'expansion');
/*
const Import:CardSpec = {
    name: 'Import',
    fixedCost: energy(1),
    effects: [targetedEffect(
        (target, card) => addToken(target, 'import', 3),
        'Put three import tokens on a card in the supply.',
        s => s.supply
    )],
    staticReplacers: [{
        text: `Whenever you would create a card in your discard,
            if its supply has an import token on it,
            instead remove a token and create the card in your hand.`,
        kind: 'create',
        handles: (p, s, c) => p.zone == 'discard' && s.supply.some(
            sup => sup.count('import') > 0 &&
            sup.name == p.spec.name
        ),
        replace: p => ({...p, zone:'hand', effects:p.effects.concat([
            () => applyToTarget(
                target => removeToken(target, 'import'),
                `remove an import token.`,
                state => state.supply.filter(sup => sup.name == p.spec.name && sup.count('import') > 0)
            )
        ])})
    }]
}
registerEvent(Import, 'expansion')
*/
var squeeze = {
    name: 'Squeeze',
    fixedCost: energy(1),
    effects: [actionsEffect(1)],
    staticReplacers: [{
            text: "You can't gain actions from " + refresh.name + ".",
            kind: 'resource',
            handles: function (p, s, c) { return p.resource == 'actions' && p.source.name == refresh.name; },
            replace: function (p) { return (__assign(__assign({}, p), { amount: 0 })); },
        }]
};
registerEvent(squeeze, 'expansion');
var inspiration = {
    name: 'Inspiration',
    effects: [{
            text: ['Remove a charge token from this to double your actions and buys.'],
            transform: function (s, c) { return payToDo(discharge(c, 1), function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, gainActions(state.actions)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainBuys(state.buys)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }); }
        }],
    staticTriggers: [{
            text: 'At the start of the game, put 3 charge tokens on this.',
            kind: 'gameStart',
            handles: function () { return true; },
            transform: function (e, s, c) { return charge(c, 3); },
        }],
    restrictions: [{
            test: function (c, state, kind) { return c.charge == 0 && kind == 'use'; }
        }]
};
registerEvent(inspiration, 'expansion');
/*
const chain:CardSpec = {
    name: 'Chain',
    fixedCost: {...free, energy:1, coin:1},
    effects: [targetedEffect(
        target => addToken(target, 'chain'),
        `Put a chain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterPlay',
        text: `After playing a card whose supply has a chain token,
               you may play a card that costs at least $1 less whose supply also has a chain token.`,
        handles: (e, s) => nameHasToken(e.card, 'chain', s),
        transform: (e, s, c) => applyToTarget(
            target => target.play(c),
            'Choose a card to play.',
            state => state.hand.filter(
                handCard => state.supply.some(
                    supplyCard => (supplyCard.name == handCard.name) && supplyCard.count('chain') > 0
                ) && leq(addCosts(handCard.cost('buy', state), coin(1)), e.card.cost('buy', state))
            ), {optional: "Don't play"}
        )
    }]
}
registerEvent(chain, 'expansion')
*/
function buyCheaper(card, s, source) {
    return applyToTarget(function (target) { return target.buy(source); }, 'Choose a card to buy.', function (state) { return state.supply.filter(function (target) { return leq(addCosts(target.cost('buy', state), coin(1)), card.cost('buy', state)); }); });
}
var bargain = {
    name: 'Bargain',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 4 }),
    effects: [targetedEffect(function (target) { return addToken(target, 'bargain'); }, "Put a bargain token on a card in the supply.", function (s) { return s.supply; })],
    staticTriggers: [{
            kind: 'afterBuy',
            text: "After buying a card with a bargain token,\n               buy a card in the supply that costs at least $1 less.",
            handles: function (e, s) { return e.card.count('bargain') > 0; },
            transform: function (e, s, c) { return buyCheaper(e.card, s, c); }
        }]
};
registerEvent(bargain, 'expansion');
var haggle = {
    name: 'Haggle',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
            kind: 'afterBuy',
            text: "After buying a card, remove a charge token from this to buy a card\n        in the supply that costs at least $1 less.",
            handles: function (e, s, c) { return c.charge > 0; },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), buyCheaper(e.card, s, c)); },
        }]
};
registerEvent(haggle, 'expansion');
var horse = {
    name: 'Horse',
    effects: [actionsEffect(2), trashThis()]
};
var ride = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards: [horse],
    effects: [createEffect(horse)]
};
registerEvent(ride, 'expansion');
var foreshadow = {
    name: 'Foreshadow',
    fixedCost: energy(2),
    effects: [targetedEffect(function (target) { return create(target.spec, 'hand'); }, 'Choose a card in your discard. Create a copy in your hand.', function (state) { return state.discard; })],
};
registerEvent(foreshadow, 'expansion');
var splay = {
    name: 'Splay',
    fixedCost: energy(2),
    effects: [{
            text: ["Put a splay token on each supply."],
            transform: function (s) { return doAll(s.supply.map(function (c) { return addToken(c, 'splay'); })); }
        }],
    staticReplacers: [{
            text: "Cards you play cost @ less for each splay token on their supply.\n               Whenever this reduces a card's cost by one or more @,\n               remove that many splay tokens from it.",
            kind: 'cost',
            handles: function (x, state, card) { return (x.actionKind == 'play')
                && nameHasToken(x.card, 'splay', state); },
            replace: function (x, state, card) {
                card = state.find(card);
                var reduction = Math.min(x.cost.energy, countNameTokens(x.card, 'splay', state));
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([repeat(applyToTarget(function (target) { return removeToken(target, 'splay'); }, 'Remove a fan token from a supply.', function (state) { return state.supply.filter(function (c) { return c.name == x.card.name && c.count('splay') > 0; }); }), reduction)]) }) });
            }
        }]
};
registerEvent(splay, 'expansion');
var recover = {
    name: 'Recover',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(function (targets) { return moveMany(targets, 'hand'); }, 'Put up to 2 cards from your discard into your hand.', function (state) { return state.discard; }, 2), incrementCost()]
};
registerEvent(recover, 'expansion');
function multitargetedEffect(f, text, options, max) {
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
var regroup = {
    name: 'Regroup',
    fixedCost: energy(2),
    effects: [actionsEffect(2), buysEffect(1), multitargetedEffect(function (targets) { return moveMany(targets, 'hand'); }, 'Put up to four cards from your discard into your hand.', function (state) { return state.discard; }, 4)]
};
registerEvent(regroup, 'expansion');
/*
const multitask:CardSpec = {
    name: 'Multitask',
    fixedCost: {...free, energy:3, coin:6},
    effects: [multitargetedEffect(
        (cards, c) => doAll(cards.map(card => card.use(c))),
        'Use any number of other events.',
        (state, c) => state.events.filter(card => card.id != c.id)
    )]
}
registerEvent(multitask, 'expansion')
*/
var summon = {
    name: 'Summon',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [multitargetedEffect(function (targets, card) { return doAll(targets.map(function (target) {
            return create(target.spec, 'hand', function (c) { return addToken(c, 'echo'); });
        })); }, "Choose up to three cards in the supply. Create a copy of each in your hand with an echo token.", function (s) { return s.supply; }, 3)],
    staticReplacers: [fragileEcho('echo')]
};
registerEvent(summon, 'expansion');
/*
const misfitName:string = 'Misfit'
const misfit:CardSpec = {
    name: misfitName,
    buyCost: coin(1),
    effects: [actionsEffect(1), {
        text: [`Choose a card in the supply costing up to $1
        for each charge token on this.
        Create a copy of that card in your hand with an echo token on it.`],
        transform: (s, c) => applyToTarget(
            target => create(target.spec, 'hand', n => addToken(n, 'echo')),
            'Choose a card to copy.',
            state => state.supply.filter(target =>
                leq(target.cost('buy', state), coin(c.charge))
            )
        )
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${misfitName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == misfitName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
register(misfit, 'expansion')
*/
/*
const bandOfMisfitsName = 'Band of Misfits'
const bandOfMisfits:CardSpec = {
    name: bandOfMisfitsName,
    buyCost: coin(2),
    effects: [actionsEffect(1), {
        text: [`Choose up to two cards in the supply each costing up to $1
        per charge token on this.
        Create a copy of each card in your hand with an echo token on it.`],
        transform: (s, c) => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Choose up to two cards to copy.',
                state.supply.filter(
                    target => leq(target.cost('buy', state), coin(c.charge))
                ).map(asChoice),
                2
            )
            for (const target of cards) {
                state = await create(target.spec, 'hand', n => addToken(n, 'echo'))(state)
            }
            return state
        }
    }],
    staticTriggers: [
        {
            kind: 'create',
            text: `Whenever you create a ${bandOfMisfitsName}, you may pay any amount of $
            to put that many charge tokens on it.`,
            handles: e => e.card.name == bandOfMisfitsName,
            transform: e => async function(state) {
                let n:number|null; [state, n] = await choice(
                    state,
                    'How much $ do you want to pay?',
                    chooseNatural(state.coin+1)
                )
                if (n != null) {
                    state = await payCost(coin(n), e.card)(state)
                    state = await charge(e.card, n)(state)
                }
                return state
            }
        }, fragileEcho(),
    ]
}
register(bandOfMisfits, 'expansion')
*/
function magpieEffect() {
    return {
        text: ["Create a copy of this in your discard."],
        transform: function (s, c) { return create(c.spec); }
    };
}
var magpie = {
    name: 'Magpie',
    buyCost: coin(2),
    effects: [coinsEffect(1), magpieEffect()]
};
register(magpie, 'expansion');
var crown = {
    name: 'Crown',
    buyCost: coin(4),
    effects: [targetedEffect(function (target) { return addToken(target, 'crown'); }, 'Put a crown token on a card in your hand.', function (s) { return s.hand; })],
    staticTriggers: [reflectTrigger('crown')],
};
register(crown, 'expansion');
var remake = {
    name: 'Remake',
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    effects: [{
            text: ["Do this up to six times: trash a card in your hand,\n        then buy a card costing up to $2 more."],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var N, _loop_5, i, state_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                N = 6;
                                _loop_5 = function (i) {
                                    var card, cost_2, target;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                card = void 0;
                                                return [4 /*yield*/, choice(state, "Choose a card to remake (" + i + " remaining).", allowNull(state.hand.map(asChoice)))];
                                            case 1:
                                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], card = _a[1];
                                                if (!(card == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, "break"];
                                            case 2: return [4 /*yield*/, trash(card)(state)];
                                            case 3:
                                                state = _c.sent();
                                                cost_2 = addCosts(card.cost('buy', state), coin(2));
                                                target = void 0;
                                                return [4 /*yield*/, choice(state, "Choose a card to buy (" + i + " remaining).", state.supply.filter(function (t) { return leq(t.cost('buy', state), cost_2); }).map(asChoice))];
                                            case 4:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                                                if (!(target != null)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, target.buy(c)(state)];
                                            case 5:
                                                state = _c.sent();
                                                _c.label = 6;
                                            case 6: return [2 /*return*/];
                                        }
                                    });
                                };
                                i = N - 1;
                                _a.label = 1;
                            case 1:
                                if (!(i >= 0)) return [3 /*break*/, 4];
                                return [5 /*yield**/, _loop_5(i)];
                            case 2:
                                state_4 = _a.sent();
                                if (state_4 === "break")
                                    return [3 /*break*/, 4];
                                _a.label = 3;
                            case 3:
                                i--;
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(remake, 'expansion');
/*
const remake:CardSpec = {
    name: 'Remake',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: [`Do this up to eight times: trash a card in your hand,
        then buy a card costing up to $2 more.`],
        transform: (s, c) => async function(state) {
            const N = 8;
            for (let i = N-1; i >= 0; i--) {
                let card:Card|null; [state, card] = await choice(state,
                    `Choose a card to remake (${i} remaining).`,
                    allowNull(state.hand.map(asChoice))
                )
                if (card == null) {
                    break
                } else {
                    state = await trash(card)(state)
                    const cost = addCosts(card.cost('buy', state), coin(2))
                    let target:Card|null; [state, target] = await choice(state,
                        `Choose a card to buy (${i} remaining).`,
                        state.supply.filter(t => leq(t.cost('buy', state), cost)).map(asChoice)
                    )
                    if (target != null) state = await target.buy(c)(state)
                }
            }
            return state
        }
    }]
}
register(remake, 'expansion')
*/
var ferry = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(function (target) { return addToken(target, 'ferry'); }, 'Put a ferry token on a supply.', function (state) { return state.supply; })],
    staticReplacers: [{
            text: "Cards cost $1 less to buy per ferry token on them, but not zero.",
            kind: 'cost',
            handles: function (p) { return p.actionKind == 'buy'; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: reducedCost(p.cost, coin(p.card.count('ferry')), true) })); }
        }]
};
register(ferry, 'expansion');
var develop = {
    name: 'Develop',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
            text: ["Trash a card in your hand.",
                "Choose a card in the supply costing $1 or $2 less and create a copy in your hand.",
                "Choose a card in the supply costing $1 or $2 more and create a copy in your hand."],
            transform: function (_, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, applyToTarget(function (target) { return function (state) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        var cost;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, trash(target)(state)];
                                                case 1:
                                                    state = _a.sent();
                                                    cost = target.cost('buy', state);
                                                    return [4 /*yield*/, applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, 'Choose a cheaper card to copy.', function (s) { return s.supply.filter(function (c) { return eq(target.cost('buy', s), addCosts(c.cost('buy', s), { coin: 1 })) || eq(target.cost('buy', s), addCosts(c.cost('buy', s), { coin: 2 })); }); })(state)];
                                                case 2:
                                                    state = _a.sent();
                                                    return [4 /*yield*/, applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, 'Choose a more expensive card to copy.', function (s) { return s.supply.filter(function (c) { return eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 1 })) || eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 2 })); }); })(state)];
                                                case 3:
                                                    state = _a.sent();
                                                    return [2 /*return*/, state];
                                            }
                                        });
                                    });
                                }; }, 'Choose a card to develop.', function (s) { return s.hand; })(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(develop, 'expansion');
var logistics = {
    name: 'Logistics',
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [],
    replacers: [costReduce('use', energy(1), true)]
};
register(logistics, 'expansion');
var territory = {
    name: 'Territory',
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2), {
            text: ['Put this in your hand.'],
            transform: function (s, c) { return move(c, 'hand'); }
        }]
};
register(territory, 'expansion');
var resound = {
    name: 'Resound',
    fixedCost: energy(1),
    effects: [{
            text: ["Put each card in your discard into your hand with an echo token on it."],
            transform: function (state) { return doAll(state.discard.map(function (c) { return doAll([move(c, 'hand'), addToken(c, 'echo')]); })); }
        }],
    staticReplacers: [fragileEcho('echo')]
};
registerEvent(resound, 'expansion');
/*
const fossilize:CardSpec = {
    name: 'Fossilize',
    buyCost: coin(3),
    effects: [{
        text: [`Put any number of cards from your discard into your hand.`,
         `Put a fragile token on each of them.`],
        transform: () => async function(state) {
            let cards:Card[]; [state, cards] = await multichoice(state,
                'Put any number of cards from your discard into your hand.',
                state.discard.map(asChoice)
            )
            state = await moveMany(cards, 'hand')(state)
            for (const card of cards) {
                state = await addToken(card, 'fragile')(state)
            }
            return state
        }
    }],
    staticTriggers: [fragileEcho('fragile')]
}
register(fossilize, 'expansion')
*/
var harrowName = 'Harrow';
var harrow = {
    name: harrowName,
    buyCost: coin(3),
    effects: [{
            text: ["Discard your hand, then put that many cards from your discard into your hand."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, n, targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                cards = state.hand;
                                n = cards.length;
                                return [4 /*yield*/, moveMany(cards, 'discard')(state)];
                            case 1:
                                state = _b.sent();
                                return [4 /*yield*/, multichoice(state, "Choose up to " + n + " cards to put into your hand.", state.discard.map(asChoice), n)];
                            case 2:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'hand')(state)];
                            case 3:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(harrow, 'expansion');
var churnName = "Churn";
var churn = {
    name: churnName,
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [recycleEffect()],
    replacers: [{
            text: "Cards named " + churnName + " cost an additional @ to play.",
            kind: 'costIncrease',
            handles: function (p) { return (p.card.name == churnName) && (p.actionKind == 'play'); },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, energy(1)) })); }
        }]
};
register(churn, 'expansion');
var smithy = {
    name: 'Smithy',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [actionsEffect(3), buysEffect(1)],
};
register(smithy, 'expansion');
var marketSquare = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
};
buyable(marketSquare, 2, 'expansion', { afterBuy: [createInPlayEffect(fair, 2)] });
/*
const brigade:CardSpec = {name: 'Brigade',
    effects: [],
    replacers: [{
        text: `Cards you play cost @ less if they share a name
               with a card in your discard and another card in your hand.
               Whenever this reduces a cost, discard it for +$2 and +2 actions.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play' && state.hand.some(
            c => c.name == x.card.name && c.id != x.card.id
        ) && state.discard.some(c => c.name == x.card.name)),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainCoins(2),
                    gainActions(2),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
buyable(brigade, 4, 'expansion')
*/
var brigade = { name: 'Brigade',
    effects: [], replacers: [{
            text: "Cards you play cost @ less if they have no brigade token on them.\n               Whenever this reduces a card's cost, put a brigade token on it,\n               discard this, and get +$1 and +1 action.",
            kind: 'cost',
            handles: function (x, state) { return (x.actionKind == 'play' && x.card.count('brigade') == 0); },
            replace: function (x, state, card) {
                var newCost = subtractCost(x.cost, { energy: 1 });
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([
                        addToken(x.card, 'brigade'),
                        move(card, 'discard'),
                        gainCoins(1),
                        gainActions(1),
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                else {
                    return x;
                }
            }
        }]
};
buyable(brigade, 4, 'expansion');
var recruiter = {
    name: 'Recruiter',
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
};
buyable(recruiter, 3, 'expansion');
var silversmith = {
    name: 'Silversmith',
    buyCost: coin(3),
    effects: [],
    triggers: [{
            kind: 'play',
            text: "When you play a Silver, +1 action.",
            handles: function (e) { return e.card.name == silver.name; },
            transform: function (e) { return gainActions(1); },
        }]
};
register(silversmith, 'expansion');
var exoticMarket = {
    name: 'Exotic Market',
    buyCost: coin(5),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
};
register(exoticMarket, 'expansion');
var royalChambers = {
    name: 'Royal Chambers',
    buyCost: coin(6),
    fixedCost: energy(2),
    effects: [{
            text: ["Do this twice: pay an action to play a card in your hand twice."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 2)) return [3 /*break*/, 4];
                                return [4 /*yield*/, payToDo(payAction, applyToTarget(function (target) { return doAll([
                                        target.play(card),
                                        target.play(card),
                                    ]); }, 'Choose a card to play twice.', function (s) { return s.hand; }, { optional: 'None' }))(state)];
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
            }; }
        }]
};
register(royalChambers, 'expansion');
var sculpt = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [targetedEffect(function (target) { return doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]); }, 'Discard a card in your hand to create two copies of it in your discard.', function (state) { return state.hand; })]
};
register(sculpt, 'expansion');
var masterpiece = {
    name: 'Masterpiece',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(5)]
};
register(masterpiece, 'expansion');
function workshopTransform(n, source) {
    return applyToTarget(function (target) { return target.buy(source); }, "Buy a card in the supply costing up to $" + n + ".", function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)); }); });
}
var greatFeast = {
    name: 'Great Feast',
    buyCost: coin(9),
    effects: [{
            text: ["Do this three times: buy a card in the supply costing up to $8"],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 4];
                                return [4 /*yield*/, workshopTransform(8, card)(state)];
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
            }; }
        }, trashThis()]
};
register(greatFeast, 'expansion');
/*
const scaffold:CardSpec = {
    name: 'Scaffold',
    buyCost: coin(5),
    effects: [{
        text: [`Do this two times: buy a card in the supply costing up to $4.`],
        transform: (state, card) => async function(state) {
            for (let i = 0; i < 2; i++) {
                state = await applyToTarget(
                    target => create(target.spec, 'hand'),
                    'Choose a card to copy.',
                    state => state.supply.filter(target => leq(target.cost('buy', state),coin(5)))
                )(state)
                state = tick(card)(state)
            }
            return state
        }
    }, trashThis()]
}
register(scaffold, 'expansion')
*/
var universityName = 'University';
var university = {
    name: universityName,
    buyCost: coin(12),
    effects: [actionsEffect(4), buysEffect(1)],
    staticReplacers: [{
            text: universityName + " costs $1 less to buy for each action you have, but not zero.",
            kind: 'cost',
            handles: function (p) { return (p.card.name == universityName) && p.actionKind == 'buy'; },
            replace: function (p, s) { return (__assign(__assign({}, p), { cost: reducedCost(p.cost, coin(s.actions), true) })); }
        }]
};
register(university, 'expansion');
var steelName = 'Steel';
var steel = {
    name: steelName,
    buyCost: coin(3),
    effects: [coinsEffect(4)],
    staticReplacers: [{
            text: "Whenever you would create a " + steelName + ", first pay a buy.\n            If you can't, then don't create it.",
            kind: 'create',
            handles: function (p) { return p.spec.name == steelName; },
            replace: function (p, s) { return (s.buys == 0)
                ? __assign(__assign({}, p), { zone: null }) : __assign(__assign({}, p), { effects: [function (c) { return payCost(__assign(__assign({}, free), { buys: 1 })); }].concat(p.effects) }); }
        }]
};
register(steel, 'expansion');
var silverMine = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
};
register(silverMine, 'expansion');
var livery = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(2)],
    triggers: [{
            kind: 'afterBuy',
            text: "After buying a card costing $4 or more, create " + aOrNum(2, horse.name) + " in your discard.",
            handles: function (e, s) { return e.card.cost('buy', s).coin >= 1; },
            transform: function () { return repeat(create(horse, 'discard'), 2); }
        }]
};
register(livery, 'expansion');
var stables = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [createEffect(horse, 'discard', 2)]
};
buyable(stables, 3, 'expansion', { onBuy: [{
            text: ["Pay all actions to create that many " + horse.name + "s in your discard."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.actions;
                                return [4 /*yield*/, payCost(__assign(__assign({}, free), { actions: n }))(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, repeat(create(horse), n)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }] });
var bustlingVillage = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [{
            text: ["+1 action per " + villager.name + " in play up to a max of +3."],
            transform: function (s) { return gainActions(Math.min(3, s.play.filter(function (c) { return c.name == villager.name; }).length)); },
        }, createInPlayEffect(villager)]
};
register(bustlingVillage, 'expansion');
/*
const inn:CardSpec = {
    name: 'Inn',
    buyCost: coin(6),
    relatedCards: [horse, villager],
    effects: [createEffect(horse, 'discard', 2), createInPlayEffect(villager, 2)],
}
register(inn, 'expansion')
*/
var guildHall = {
    name: 'Guild Hall',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
            text: "Whenever you use an event,\n            discard this to use it again.",
            kind: 'use',
            handles: function (e, state, card) { return state.find(card).place == 'play'; },
            transform: function (e, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, move(card, 'discard')(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, e.card.use(card)(state)];
                        }
                    });
                });
            }; }
        }]
};
register(guildHall, 'expansion');
/*
const overextend:CardSpec = {
    name: 'Overextend',
    buyCost: coin(4),
    effects: [actionsEffect(4), createInPlayEffect(villager, 4)],
    relatedCards: [villager],
    replacers: [{
        text: `Cards cost @ more to play.`,
        kind: 'costIncrease',
        handles: p => p.actionKind == 'play',
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
register(overextend, 'expansion')
*/
var contraband = {
    name: 'Contraband',
    buyCost: coin(4),
    effects: [coinsEffect(3), buysEffect(3)],
    replacers: [{
            text: "Cards cost $1 more to buy.",
            kind: 'costIncrease',
            handles: function (p) { return p.actionKind == 'buy'; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }]
};
register(contraband, 'expansion');
/*
const diamond:CardSpec = {
    name: 'Diamond',
    buyCost: coin(4),
    effects: [coinsEffect(2), pointsEffect(1)],
}
register(diamond, 'expansion')
*/
var lurkerName = 'Lurker';
var lurker = {
    name: lurkerName,
    buyCost: coin(3),
    effects: [actionsEffect(1), {
            text: ["Trash a card in your hand.\n               If you trash a " + lurkerName + ", buy a card in the supply costing up to $8,\n               otherwise buy a " + lurkerName + "."],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var card;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, choice(state, 'Choose a card to trash.', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], card = _a[1];
                                if (!(card != null)) return [3 /*break*/, 3];
                                return [4 /*yield*/, trash(card)(state)];
                            case 2:
                                state = _b.sent();
                                _b.label = 3;
                            case 3:
                                if (!(card !== null && card.name == lurkerName)) return [3 /*break*/, 5];
                                return [4 /*yield*/, workshopTransform(8, c)(state)];
                            case 4:
                                state = _b.sent();
                                return [3 /*break*/, 7];
                            case 5: return [4 /*yield*/, applyToTarget(function (target) { return target.buy(c); }, 'Choose a card to buy.', function (state) { return state.supply.filter(function (sup) { return sup.name == lurkerName; }); })(state)];
                            case 6:
                                state = _b.sent();
                                _b.label = 7;
                            case 7: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(lurker, 'expansion');
var kiln = {
    name: 'Kiln',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
            text: "After playing a card with this in play, discard this to create a copy of the card you played in your discard.",
            kind: 'afterPlay',
            handles: function (e, s, c) { return s.find(c).place == 'play' && e.before.find(c).place == 'play'; },
            transform: function (e, s, c) { return doAll([move(c, 'discard'), create(e.card.spec, 'discard')]); }
        }]
};
register(kiln, 'expansion');
/*
const werewolfName = 'Werewolf'
const werewolf:CardSpec = {
    name: 'Werewolf',
    buyCost: coin(3),
    effects: [{
        text: [`If a ${werewolfName} in the supply has an odd number of charge tokens on it, +3 actions.
        Otherwise, +$3.`],
        transform: () => async function(state) {
            if (state.supply.some(sup => (sup.name == werewolfName) && (sup.charge % 2 == 1) )) {
                state = await gainActions(3)(state)
            } else {
                state = await gainCoins(3)(state)
            }
            return state
        }
    }],
    staticTriggers: [{
        text: `Whenever you use ${refresh.name}, put a charge token on this.`,
        kind: 'use',
        handles: e => e.card.name == refresh.name,
        transform: (e, s, c) => charge(c)
    }]
}
register(werewolf, 'expansion')
*/
var moon = {
    name: 'Moon',
    replacers: [{
            text: "Whenever you would move this from play,\n               instead put a charge token on it.",
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.skip == false; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([charge(c)]) })); }
        }]
};
var werewolf = {
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
            text: ["If there is no " + moon.name + " in play, create one."],
            transform: function (s) { return (s.play.some(function (c) { return c.name == moon.name; })) ? noop : create(moon, 'play'); },
        }, {
            text: ["If a " + moon.name + " in play has an odd number of charge tokens, +$3 and +1 buy.\n                Otherwise, +3 actions."],
            transform: function (s) { return (s.play.some(function (c) { return c.name == moon.name && c.charge % 2 == 1; })) ?
                doAll([gainCoins(3), gainBuys(1)]) :
                gainActions(3); }
        }]
};
register(werewolf, 'expansion');
var uncoverName = 'Uncover';
var uncover = {
    name: uncoverName,
    effects: [actionsEffect(1), {
            text: ["For each charge token on this put a non-" + uncoverName + " card from your discard into your hand."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, cards;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = state.find(card).charge;
                                return [4 /*yield*/, multichoice(state, "Choose " + n + " cards to put into your hand.", state.discard.filter(function (c) { return c.name != uncoverName; }).map(asChoice), n)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], cards = _a[1];
                                return [4 /*yield*/, moveMany(cards, 'hand')(state)];
                            case 2:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, {
            text: ["Remove a charge token from this."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(state.find(card).charge > 0)) return [3 /*break*/, 2];
                                return [4 /*yield*/, discharge(card, 1)(state)];
                            case 1:
                                state = _a.sent();
                                _a.label = 2;
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(uncover, 4, 'expansion', {
    replacers: [startsWithCharge(uncover.name, 3)]
});
var masonry = {
    name: 'Masonry',
    fixedCost: coin(2),
    effects: [chargeEffect()],
    staticTriggers: [{
            kind: 'afterBuy',
            text: "After buying a card other than with this, remove a charge token from this to buy a card\n        in the supply with equal or lesser cost.",
            handles: function (e, s, c) { return c.charge > 0 && e.source.id != c.id; },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), applyToTarget(function (target) { return target.buy(c); }, "Choose a card to buy.", function (state) { return state.supply.filter(function (sup) { return leq(sup.cost('buy', state), e.card.cost('buy', state)); }); })); }
        }]
};
registerEvent(masonry, 'expansion');
var swap = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [chargeEffect()],
    staticTriggers: [{
            kind: 'afterPlay',
            text: "After playing a card, if this has a charge token and the card is in your discard,\n        then remove a charge token and trash the card to buy a card in the supply\n        with equal or lesser cost.",
            handles: function (e, s, c) { return (c.charge > 0 && s.find(e.card).place == 'discard'); },
            transform: function (e, s, c) { return payToDo(doAll([discharge(c, 1), trash(e.card)]), applyToTarget(function (target) { return doAll([trash(e.card), target.buy(c)]); }, "Choose a card to buy.", function (state) { return state.supply.filter(function (sup) { return leq(sup.cost('buy', state), e.card.cost('buy', state)); }); })); }
        }]
};
registerEvent(swap, 'expansion');
var infrastructure = {
    name: 'Infrastructure',
    replacers: [{
            text: "Events cost @ less to use. Whenever this reduces a cost, trash it.",
            kind: 'cost',
            handles: function (x) { return x.actionKind == 'use'; },
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
var planning = {
    name: 'Planning',
    buyCost: coin(6),
    effects: [],
    relatedCards: [infrastructure],
    triggers: [{
            text: "Whenever you pay @,\n               create that many " + infrastructure.name + "s in play.",
            kind: 'cost',
            handles: function (e, state, card) { return e.cost.energy > 0; },
            transform: function (e, state, card) { return repeat(create(infrastructure, 'play'), e.cost.energy); }
        }]
};
register(planning, 'expansion');
var privateWorks = {
    name: 'Private Works',
    relatedCards: [infrastructure],
    fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    effects: [createInPlayEffect(infrastructure, 2)]
};
registerEvent(privateWorks, 'expansion');
function gainExactly(n) {
    return targetedEffect(function (target, card) { return target.buy(card); }, "Buy a card in the supply costing $" + n + ".", function (state) { return state.supply.filter(function (x) { return eq(x.cost('buy', state), coin(n)); }); });
}
/* Swell:
transform: (state, card) => async function(state) {
    for (let i = 0; i < 6; i++) {
        let target:Card|null; [state, target] = await choice(state,
            `Buy a card costing $${i}`,
            state.supply.filter(c => c.cost('buy', state).coin == i).map(asChoice)
        )
        if (target != null) state = await target.buy(card)(state)
    }
    return state
}
*/
var alliance = {
    name: 'Alliance',
    fixedCost: __assign(__assign({}, free), { coin: 6, energy: 1 }),
    effects: [{
            text: ["Create a " + province.name + ", " + duchy.name + ", " + estate.name + ", " + gold.name + ", " + silver.name + ", and " + copper.name + " in your discard."],
            transform: function () { return doAll([province, duchy, estate, gold, silver, copper].map(function (c) { return create(c); })); }
        }]
};
registerEvent(alliance, 'expansion');
var buildUp = {
    name: 'Build Up',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [createInPlayEffect(infrastructure), incrementCost()],
    relatedCards: [infrastructure]
};
registerEvent(buildUp, 'expansion');
/*
const avenue:CardSpec = {
    name: 'Avenue',
    effects: [actionsEffect(1), coinsEffect(1)],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && s.play.length < 2
    }],
    ability: [{
        text: [`Discard this and another card from play for +$1 and +1 action.`],
        transform: (state, c) => payToDo(
            doAll([discardFromPlay(c), applyToTarget(
                target => discardFromPlay(target),
                `Discard a card from play.`,
                state => state.play,
                {cost: true}
            )]),
            doAll([gainActions(1), gainCoins(1)])
        )
    }]
}
buyable(avenue, 5, 'expansion')
*/
var inn = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
};
buyable(inn, 5, 'expansion', { onBuy: [createEffect(horse, 'discard', 3)] });
/*
const exploit:CardSpec = {
    name: 'Exploit',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash all cards in play for +1 vp each.`],
        transform: state => doAll(state.play.map(c => doAll([trash(c), gainPoints(1)])))
    }]
}
registerEvent(exploit, 'expansion')
*/
var treasury = {
    name: 'Treasury',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    triggers: [{
            text: "Whenever you gain more than one action, gain that much $ minus one.",
            kind: 'resource',
            handles: function (e) { return e.resource == 'actions' && e.amount > 1; },
            transform: function (e) { return gainCoins(e.amount - 1); }
        }]
};
buyable(treasury, 4, 'expansion');
var statue = {
    name: 'Statue',
    fixedCost: energy(1),
    effects: [],
    triggers: [{
            text: "Whenever you buy a card costing $1 or more, +1 vp.",
            kind: 'buy',
            handles: function (e, s) { return e.card.cost('buy', s).coin > 0; },
            transform: function (e) { return gainPoints(1); },
        }]
};
buyable(statue, 5, 'expansion');
var scepter = {
    name: 'Scepter',
    fixedCost: energy(1),
    effects: [{
            text: ["Pay an action to play a card in your hand three times then trash it."],
            transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
            ]); }, 'Choose a card to play three times.', function (s) { return s.hand; })); }
        }]
};
buyable(scepter, 7, 'expansion');
var farmlandName = 'Farmland';
var farmland = {
    name: farmlandName,
    fixedCost: energy(3),
    effects: [],
    restrictions: [{
            test: function (card, state, kind) {
                return kind == 'activate' && state.play.some(function (c) { return c.name == farmlandName && c.id != card.id; });
            }
        }],
    ability: [{
            text: ["If you have no other " + farmlandName + "s in play, discard this for +7 vp."],
            transform: function (s, c) { return payToDo(discardFromPlay(c), gainPoints(7)); },
        }],
};
buyable(farmland, 8, 'expansion');
var hallOfEchoes = {
    name: 'Hall of Echoes',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }],
    staticReplacers: [fragileEcho()],
};
registerEvent(hallOfEchoes, 'expansion');
// ----------------- Absurd --------------------
var confusion = {
    name: 'Confusion',
    buyCost: free,
    staticTriggers: [{
            text: "After buying a card, move it to the events.",
            kind: 'afterBuy',
            handles: function () { return true; },
            transform: function (e) { return move(e.card, 'events'); }
        }, {
            text: "After using an event, move it to the supply.",
            kind: "afterUse",
            handles: function () { return true; },
            transform: function (e) { return move(e.card, 'supply'); }
        }]
};
register(confusion, 'absurd');
var chaos = {
    name: 'Chaos',
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [targetedEffect(function (target) { return move(target, 'events'); }, "Move a card in your discard to the events.", function (state) { return state.discard; })],
    staticTriggers: [{
            text: "Whenever you use an event, move it to your discard.",
            kind: 'use',
            handles: function () { return true; },
            transform: function (e) { return move(e.card, 'discard'); }
        }]
};
register(chaos, 'absurd');
var misplace = {
    name: 'Misplace',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 2 }),
    effects: [chargeEffect()],
    staticTriggers: [{
            text: "After buying a card the normal way, remove a charge token from this to buy all other cards in the supply with the same name.",
            kind: 'afterBuy',
            handles: function (e, s, c) { return c.charge > 0 && e.source.name == 'act'; },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), doAll(s.supply.filter(function (target) { return target.name == e.card.name && target.id != e.card.id; }).map(function (target) { return target.buy(c); }))); }
        }, {
            text: "After buying a card, move it to your discard.",
            kind: 'afterBuy',
            handles: function () { return true; },
            transform: function (e) { return move(e.card, 'discard'); }
        }, {
            text: "After playing a card, move it to the supply.",
            kind: 'afterPlay',
            handles: function () { return true; },
            transform: function (e) { return move(e.card, 'supply'); }
        }]
};
registerEvent(misplace, 'absurd');
var echoName = 'Weird Echo';
var weirdEcho = { name: echoName,
    buyCost: coin(7), effects: [targetedEffect(function (target, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createAndTrack(target.spec, 'void')(state)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), copy = _a[0], state = _a[1];
                            if (!(copy != null)) return [3 /*break*/, 4];
                            return [4 /*yield*/, addToken(copy, 'echo')(state)];
                        case 2:
                            state = _b.sent();
                            return [4 /*yield*/, copy.play(card)(state)];
                        case 3:
                            state = _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Create a fresh copy of a card you have in play,\n         then put an echo token on the copy and play it.", function (state) { return dedupBy(state.play, function (c) { return c.spec; }); })], staticReplacers: [fragileEcho('echo')], staticTriggers: [{
            text: "After playing a card, put it into play unless its name contains the word \"Echo\".",
            kind: 'afterPlay',
            handles: function (e) { return !e.card.name.includes("Echo"); },
            transform: function (e) { return move(e.card, 'play'); }
        }]
};
register(weirdEcho, 'absurd');
var weirdCarpenter = {
    name: 'Weird Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
            text: ["+1 action per card in play."],
            transform: function (state, card) { return gainActions(state.play.length, card); }
        }],
    triggers: [{
            text: "After playing a card, put it into play.",
            kind: 'afterPlay',
            handles: function (e) { return true; },
            transform: function (e) { return move(e.card, 'play'); }
        }]
};
buyable(weirdCarpenter, 5, 'absurd');
/*
const amalgam:CardSpec = {
    name: 'Amalgam',
    fixedCost: energy(0.5),
    buyCost: coin(3),
    effects: [coinsEffect(3)]
}
register(amalgam, 'absurd')
*/
var shinySilver = {
    name: 'Shiny Silver',
    buyCost: coin(2.5),
    effects: [coinsEffect(2.5)]
};
register(shinySilver, 'absurd');
var xSpec = { name: 'X' };
var ySpec = { name: 'Y' };
function xHatchery(x) {
    if (x === void 0) { x = xSpec; }
    return {
        name: "Hatchery(" + x.name + ")",
        buyCost: coin(3),
        effects: [actionsEffect(1), createEffect(x)],
        relatedCards: (x.name == xSpec.name) ? [] : [x]
    };
}
var metaHatchery = {
    name: 'Meta Hatchery',
    buyCost: coin(3),
    relatedCards: [xHatchery()],
    effects: [actionsEffect(1), {
            text: ["Choose a card X in your hand.",
                "Create an X Hatchery in your discard."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, choice(state, "Choose card X.", state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target != null)) return [3 /*break*/, 3];
                                return [4 /*yield*/, create(xHatchery(target.spec))(state)];
                            case 2:
                                state = _b.sent();
                                _b.label = 3;
                            case 3: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(metaHatchery, 'absurd');
var invertedPalace = {
    name: 'Inverted Palace',
    buyCost: energy(1),
    fixedCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)],
};
register(invertedPalace, 'absurd');
/* Change name, and make resources round down? */
/*
const unfocus:CardSpec = {
    name: 'Unfocus',
    fixedCost: energy(0.01),
    effects: [actionsEffect(1)]
}
registerEvent(unfocus, 'absurd')
*/
function concatIfdef(xs, ys) {
    return (xs || []).concat(ys || []);
}
function addIfdef(x, y) {
    return addCosts(x || free, y || free);
}
function mergeSpecs(x, y) {
    if (x === void 0) { x = xSpec; }
    if (y === void 0) { y = ySpec; }
    return {
        name: x.name + " + " + y.name,
        buyCost: addIfdef(x.buyCost, y.buyCost),
        fixedCost: addIfdef(x.fixedCost, y.fixedCost),
        variableCosts: concatIfdef(x.variableCosts, y.variableCosts),
        effects: concatIfdef(x.effects, y.effects),
        triggers: concatIfdef(x.triggers, y.triggers),
        replacers: concatIfdef(x.replacers, y.replacers),
        staticTriggers: concatIfdef(x.staticTriggers, y.staticTriggers),
        staticReplacers: concatIfdef(x.staticReplacers, y.staticReplacers)
    };
}
var combiner = {
    name: 'Combiner',
    buyCost: coin(3),
    effects: [{
            text: [
                "Trash two cards X and Y from your hand.",
                "If you do, create an X+Y in your hand that combines all of their costs, effects, and so on."
            ],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose two cards to combine.', state.hand.map(asChoice), 2, 2)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                if (!(targets.length == 2)) return [3 /*break*/, 5];
                                return [4 /*yield*/, trash(targets[0])(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, trash(targets[1])(state)];
                            case 3:
                                state = _b.sent();
                                return [4 /*yield*/, create(mergeSpecs(targets[0].spec, targets[1].spec), 'hand')(state)];
                            case 4:
                                state = _b.sent();
                                _b.label = 5;
                            case 5: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(combiner, 'absurd');
var merge = {
    name: 'Merge',
    fixedCost: energy(1),
    effects: [{
            text: ["Trash two cards in the supply each costing at least $1.",
                "If you do, create an X+Y in the supply that combines all of their costs, effects, and so on."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose two cards to combine.', state.supply.filter(function (c) { return c.cost('buy', state).coin > 0; }).map(asChoice), 2, 2)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                if (!(targets.length == 2)) return [3 /*break*/, 5];
                                return [4 /*yield*/, trash(targets[0])(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, trash(targets[1])(state)];
                            case 3:
                                state = _b.sent();
                                return [4 /*yield*/, create(mergeSpecs(targets[0].spec, targets[1].spec), 'supply')(state)];
                            case 4:
                                state = _b.sent();
                                _b.label = 5;
                            case 5: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
registerEvent(merge, 'absurd');
var idealize = {
    name: 'Idealize',
    fixedCost: __assign(__assign({}, free), { coin: 2, energy: 1 }),
    effects: [{
            text: ["Move a card in your hand to the supply and put an ideal token on it."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, choice(state, 'Choose a card to idealize.', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target != null)) return [3 /*break*/, 4];
                                return [4 /*yield*/, move(target, 'events')(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, addToken(target, 'ideal')(state)];
                            case 3:
                                state = _b.sent();
                                _b.label = 4;
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
    staticReplacers: [{
            text: 'Events cost an additional @ to use for each ideal token on them.',
            kind: 'costIncrease',
            handles: function (e) { return e.actionKind == 'use' && e.card.count('ideal') > 0; },
            replace: function (e) { return (__assign(__assign({}, e), { cost: __assign(__assign({}, e.cost), { energy: e.cost.energy + e.card.count('ideal') }) })); }
        }]
};
registerEvent(idealize, 'absurd');
var enshrine = {
    name: 'Enshrine',
    fixedCost: energy(1),
    effects: [targetedEffect(function (target) { return move(target, 'events'); }, 'Move a supply costing at least $1 to the events.', function (s) { return s.supply.filter(function (c) { return c.cost('buy', s).coin >= 1; }); })],
    staticReplacers: [{
            text: "The cost to use events is increased by however much $ and @ they would have cost to buy.",
            kind: 'costIncrease',
            handles: function (p) { return p.actionKind == 'use'; },
            replace: function (p, state) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, __assign(__assign({}, p.card.cost('buy', state)), { buys: 0 })) })); }
        }]
};
registerEvent(enshrine, 'absurd');
var reify = {
    name: 'Reify',
    fixedCost: energy(1),
    effects: [{
            text: ["Choose an event. Create two copies in your hand with echo tokens on them."],
            transform: function () { return applyToTarget(function (target) { return repeat(create(target.spec, 'hand', function (c) { return addToken(c, 'echo'); }), 2); }, 'Choose a card to reify.', function (s) { return s.events; }); }
        }],
    staticReplacers: [fragileEcho()],
};
registerEvent(reify, 'absurd');
var showOff = {
    name: 'Show Off',
    effects: [chargeEffect()],
    staticReplacers: [{
            text: "If this has a charge token, you can't win the game.",
            kind: 'victory',
            handles: function (e, s, c) { return c.charge > 0; },
            replace: function (e) { return (__assign(__assign({}, e), { victory: false })); }
        }],
    staticTriggers: [{
            text: "If you have at least 10 times more victory points than needed to win the game\n            and this has any charge tokens on it, then remove them and lose 10 @.",
            kind: 'resource',
            handles: function (e, s, c) { return s.points >= 10 * s.vp_goal && s.find(c).charge > 0; },
            transform: function (e, s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, discharge(c, state.find(c).charge)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainResource('energy', -10, c)(state)];
                            case 2:
                                state = _a.sent();
                                throw new Victory(state);
                        }
                    });
                });
            }; }
        }],
};
registerEvent(showOff, 'absurd');
function cardsInState(s) {
    return s.events.concat(s.supply).concat(s.hand).concat(s.play).concat(s.discard);
}
var reconfigure = {
    name: 'Reconfigure',
    effects: [{
            text: ["Remove all tokens from any card. Then put back the same total number of tokens of the same types."],
            transform: function () { return applyToTarget(function (target) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var allTokens, tokenCount, _a, _b, _c, token, count, e_44_1, numTypes, currentType, allTokens_1, allTokens_1_1, token, n, e_45_1;
                    var e_44, _d, e_45, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                target = state.find(target);
                                allTokens = new Set();
                                tokenCount = 0;
                                _g.label = 1;
                            case 1:
                                _g.trys.push([1, 6, 7, 8]);
                                _a = __values(target.tokens), _b = _a.next();
                                _g.label = 2;
                            case 2:
                                if (!!_b.done) return [3 /*break*/, 5];
                                _c = __read(_b.value, 2), token = _c[0], count = _c[1];
                                allTokens.add(token);
                                tokenCount += count;
                                return [4 /*yield*/, removeToken(target, token, 'all')(state)];
                            case 3:
                                state = _g.sent();
                                _g.label = 4;
                            case 4:
                                _b = _a.next();
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 8];
                            case 6:
                                e_44_1 = _g.sent();
                                e_44 = { error: e_44_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                }
                                finally { if (e_44) throw e_44.error; }
                                return [7 /*endfinally*/];
                            case 8:
                                numTypes = allTokens.size;
                                currentType = 0;
                                _g.label = 9;
                            case 9:
                                _g.trys.push([9, 17, 18, 19]);
                                allTokens_1 = __values(allTokens), allTokens_1_1 = allTokens_1.next();
                                _g.label = 10;
                            case 10:
                                if (!!allTokens_1_1.done) return [3 /*break*/, 16];
                                token = allTokens_1_1.value;
                                currentType += 1;
                                n = void 0;
                                if (!(currentType == numTypes)) return [3 /*break*/, 11];
                                n = tokenCount;
                                return [3 /*break*/, 13];
                            case 11: return [4 /*yield*/, choice(state, "How many " + token + " tokens do you want to add? (" + tokenCount + " remaining)", chooseNatural(tokenCount + 1))];
                            case 12:
                                _f = __read.apply(void 0, [_g.sent(), 2]), state = _f[0], n = _f[1];
                                _g.label = 13;
                            case 13:
                                if (!(n != null && n > 0)) return [3 /*break*/, 15];
                                tokenCount -= n;
                                return [4 /*yield*/, addToken(target, token, n)(state)];
                            case 14:
                                state = _g.sent();
                                _g.label = 15;
                            case 15:
                                allTokens_1_1 = allTokens_1.next();
                                return [3 /*break*/, 10];
                            case 16: return [3 /*break*/, 19];
                            case 17:
                                e_45_1 = _g.sent();
                                e_45 = { error: e_45_1 };
                                return [3 /*break*/, 19];
                            case 18:
                                try {
                                    if (allTokens_1_1 && !allTokens_1_1.done && (_e = allTokens_1.return)) _e.call(allTokens_1);
                                }
                                finally { if (e_45) throw e_45.error; }
                                return [7 /*endfinally*/];
                            case 19: return [2 /*return*/, state];
                        }
                    });
                });
            }; }, 'Choose a card to reconfigure.', function (state) { return cardsInState(state); }); }
        }]
};
buyable(reconfigure, 4, 'absurd', { onBuy: [{
            text: ["Add a reconfigure token to each card in your hand."],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'reconfigure'); })); }
        }] });
var steal = {
    name: 'Steal',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (target) { return move(target, 'discard'); }, "Move a supply to your discard.", function (state) { return state.supply; })]
};
registerEvent(steal, 'absurd');
var hoard = {
    name: 'Hoard',
    fixedCost: __assign(__assign({}, free), { energy: 2, coin: 8 }),
    effects: [{
            text: ["Move all cards to your hand."],
            transform: function (s) { return moveMany(cardsInState(s), 'hand'); }
        }]
};
registerEvent(hoard, 'absurd');
var redistribute = {
    name: 'Redistribute',
    effects: [{
            text: ["Choose two cards.\n                For each type of token that is on both of them, redistribute tokens of that type arbitrarily between them."],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, _a, _b, _c, token, count, total, targets_2, targets_2_1, target, e_46_1, n, e_47_1;
                    var _d, e_47, _e, e_46, _f, _g;
                    return __generator(this, function (_h) {
                        switch (_h.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose two cards to redistribute tokens between.', cardsInState(state).map(asChoice), 2, 2)];
                            case 1:
                                _d = __read.apply(void 0, [_h.sent(), 2]), state = _d[0], targets = _d[1];
                                if (!(targets.length == 2)) return [3 /*break*/, 19];
                                _h.label = 2;
                            case 2:
                                _h.trys.push([2, 17, 18, 19]);
                                _a = __values(targets[0].tokens), _b = _a.next();
                                _h.label = 3;
                            case 3:
                                if (!!_b.done) return [3 /*break*/, 16];
                                _c = __read(_b.value, 2), token = _c[0], count = _c[1];
                                if (!(targets[0].count(token) > 0 && targets[1].count(token) > 0)) return [3 /*break*/, 15];
                                total = targets[0].count(token) + targets[1].count(token);
                                _h.label = 4;
                            case 4:
                                _h.trys.push([4, 9, 10, 11]);
                                targets_2 = (e_46 = void 0, __values(targets)), targets_2_1 = targets_2.next();
                                _h.label = 5;
                            case 5:
                                if (!!targets_2_1.done) return [3 /*break*/, 8];
                                target = targets_2_1.value;
                                return [4 /*yield*/, removeToken(target, token, 'all')(state)];
                            case 6:
                                state = _h.sent();
                                _h.label = 7;
                            case 7:
                                targets_2_1 = targets_2.next();
                                return [3 /*break*/, 5];
                            case 8: return [3 /*break*/, 11];
                            case 9:
                                e_46_1 = _h.sent();
                                e_46 = { error: e_46_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (targets_2_1 && !targets_2_1.done && (_f = targets_2.return)) _f.call(targets_2);
                                }
                                finally { if (e_46) throw e_46.error; }
                                return [7 /*endfinally*/];
                            case 11:
                                n = void 0;
                                return [4 /*yield*/, choice(state, "How many " + token + " tokens do you want to put on " + targets[0].name + "?", chooseNatural(total + 1))];
                            case 12:
                                _g = __read.apply(void 0, [_h.sent(), 2]), state = _g[0], n = _g[1];
                                if (!(n != null)) return [3 /*break*/, 15];
                                return [4 /*yield*/, addToken(targets[0], token, n)(state)];
                            case 13:
                                state = _h.sent();
                                return [4 /*yield*/, addToken(targets[1], token, total - n)(state)];
                            case 14:
                                state = _h.sent();
                                _h.label = 15;
                            case 15:
                                _b = _a.next();
                                return [3 /*break*/, 3];
                            case 16: return [3 /*break*/, 19];
                            case 17:
                                e_47_1 = _h.sent();
                                e_47 = { error: e_47_1 };
                                return [3 /*break*/, 19];
                            case 18:
                                try {
                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                }
                                finally { if (e_47) throw e_47.error; }
                                return [7 /*endfinally*/];
                            case 19: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(redistribute, 4, 'absurd', { replacers: [startsWithCharge(redistribute.name, 2)] });
var manor = {
    name: 'Manor',
    buyCost: coin(6),
    fixedCost: energy(1),
    triggers: [{
            text: 'Whenever you pay @, gain that many vp.',
            kind: 'cost',
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e) { return gainPoints(e.cost.energy); }
        }]
};
register(manor, 'test');
var ballista = {
    name: 'Ballista',
    buyCost: coin(5),
    effects: [{
            text: ["Play then trash two cards from your hand.",
                "If you do, gain a card from the supply whose cost is at most the sum of their costs."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, targets_3, targets_3_1, target, e_48_1, cost_3;
                    var _a, e_48, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose two cards to play.', state.hand.map(asChoice), 2, 2)];
                            case 1:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], targets = _a[1];
                                _c.label = 2;
                            case 2:
                                _c.trys.push([2, 8, 9, 10]);
                                targets_3 = __values(targets), targets_3_1 = targets_3.next();
                                _c.label = 3;
                            case 3:
                                if (!!targets_3_1.done) return [3 /*break*/, 7];
                                target = targets_3_1.value;
                                return [4 /*yield*/, target.play(card)(state)];
                            case 4:
                                state = _c.sent();
                                return [4 /*yield*/, trash(target)(state)];
                            case 5:
                                state = _c.sent();
                                _c.label = 6;
                            case 6:
                                targets_3_1 = targets_3.next();
                                return [3 /*break*/, 3];
                            case 7: return [3 /*break*/, 10];
                            case 8:
                                e_48_1 = _c.sent();
                                e_48 = { error: e_48_1 };
                                return [3 /*break*/, 10];
                            case 9:
                                try {
                                    if (targets_3_1 && !targets_3_1.done && (_b = targets_3.return)) _b.call(targets_3);
                                }
                                finally { if (e_48) throw e_48.error; }
                                return [7 /*endfinally*/];
                            case 10:
                                if (!(targets.length == 2)) return [3 /*break*/, 12];
                                cost_3 = addCosts(targets[0].cost('buy', state), targets[1].cost('buy', state));
                                return [4 /*yield*/, applyToTarget(function (target2) { return target2.buy(card); }, 'Choose a card to buy.', function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', state), cost_3); }); })(state)];
                            case 11:
                                state = _c.sent();
                                _c.label = 12;
                            case 12: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
register(ballista, 'test');
// ------------------ Testing -------------------
var freeMoney = { name: 'Free money',
    fixedCost: energy(0),
    effects: [coinsEffect(100), buysEffect(100)],
};
cheats.push(freeMoney);
var freeActions = { name: 'Free actions',
    fixedCost: energy(0),
    effects: [actionsEffect(100)],
};
cheats.push(freeActions);
var freePoints = { name: 'Free points',
    fixedCost: energy(0),
    effects: [pointsEffect(10)],
};
cheats.push(freePoints);
var doItAll = { name: 'Do it all',
    fixedCost: energy(0), effects: [{
            text: ["Remove all mire tokens from all cards."],
            transform: function (state) { return doAll(state.discard.concat(state.play).concat(state.hand).map(function (c) { return removeToken(c, 'mire', 'all'); })); }
        }, {
            text: ['Remove all decay tokens from cards in your discard and play.'],
            transform: function (state) { return doAll(state.discard.concat(state.play).concat(state.hand).map(function (c) { return removeToken(c, 'decay', 'all'); })); }
        }, refreshEffect(100), coinsEffect(100), buysEffect(100)]
};
cheats.push(doItAll);
// ------------ Random placeholder --------------
export var randomPlaceholder = { name: RANDOM };
function cardsFrom(kind, expansions) {
    return expansions.map(function (c) { return sets[c][kind]; }).flat(1);
}
export var allCards = cardsFrom('cards', expansionNames);
export var allEvents = cardsFrom('events', expansionNames);
//# sourceMappingURL=logic.js.map