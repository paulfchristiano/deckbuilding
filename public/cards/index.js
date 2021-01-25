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
import { doAll, moveMany, num, aOrNum, a, free, create, move, choice, discharge, unk, trash, setResource, gainActions, gainBuys, gainBuy, gainCoins, gainPoints, addToken, removeToken, addCosts, subtractCost, multiplyCosts, asChoice, leq, eq, allowNull, renderCost, tick, payCost, CostNotPaid, assertNever, charge, lowercaseFirst } from '../logic.js';
import './base.js';
import './expansion.js';
import './absurd.js';
import './cheats.js';
import './test.js';
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
export function register(card, set) {
    sets[set].cards.push(card);
}
export function buyable(card, n, set, extra) {
    if (extra === void 0) { extra = {}; }
    card.buyCost = coin(n);
    register(supplyForCard(card, coin(n), extra), set);
}
export function buyableFree(card, coins, set) {
    buyable(card, coins, set, { onBuy: [buyEffect()] });
}
export function registerEvent(card, set) {
    sets[set]['events'].push(card);
}
//
// ----- MIXINS -----
//
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
export function costReduceNext(kind, reduction, nonzero) {
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
export function repeat(t, n) {
    return doAll(Array(n).fill(t));
}
export function createInPlayEffect(spec, n) {
    if (n === void 0) { n = 1; }
    return {
        text: ["Create " + aOrNum(n, spec.name) + " in play."],
        transform: function () { return repeat(create(spec, 'play'), n); }
    };
}
export var payAction = payCost(__assign(__assign({}, free), { actions: 1 }));
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
export function costPer(increment) {
    var extraStr = renderCost(increment, true) + " for each cost token on this.";
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
export function trashOnLeavePlay() {
    return {
        text: "Whenever this would leave play, trash it.",
        kind: 'move',
        handles: function (x, state, card) { return x.card.id == card.id && x.fromZone == 'play'; },
        replace: function (x) { return (__assign(__assign({}, x), { toZone: 'void' })); }
    };
}
export function dischargeCost(c, n) {
    if (n === void 0) { n = 1; }
    return __assign(__assign({}, free), { effects: [discharge(c, n)], tests: [function (state) { return state.find(c).charge >= n; }] });
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
export function discardCost(card) {
    return __assign(__assign({}, free), { effects: [discardFromPlay(card)], tests: [function (state) { return state.find(card).place == 'play'; }] });
}
//
// ----------- UTILS -------------------
//
export function createEffect(spec, zone, n) {
    if (zone === void 0) { zone = 'discard'; }
    if (n === void 0) { n = 1; }
    var zoneText = (zone == 'play') ? 'play' : "your " + zone;
    return {
        text: ["Create " + aOrNum(n, spec.name) + " in " + zoneText + "."],
        transform: function () { return repeat(create(spec, zone), n); },
    };
}
export function supplyForCard(card, cost, extra) {
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
export function dedupBy(xs, f) {
    var e_1, _a;
    var result = [];
    var _loop_1 = function (x) {
        if (result.every(function (r) { return f(r) != f(x); })) {
            result.push(x);
        }
    };
    try {
        for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
            var x = xs_1_1.value;
            _loop_1(x);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
// NOTE: unused?
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
//
//
// ------ Basic effects ------
//
export function sortHand(state) {
    return state.sortZone('hand');
}
export function coinsEffect(n) {
    return {
        text: ["+$" + n + "."],
        transform: function (s, c) { return gainCoins(n, c); },
    };
}
export function pointsEffect(n) {
    return {
        text: ["+" + n + " vp."],
        transform: function (s, c) { return gainPoints(n, c); },
    };
}
export function actionsEffect(n) {
    return {
        text: ["+" + num(n, 'action') + "."],
        transform: function (s, c) { return gainActions(n, c); },
    };
}
export function buysEffect(n) {
    return {
        text: ["+" + num(n, 'buy') + "."],
        transform: function (state, card) { return gainBuys(n, card); },
    };
}
export function buyEffect() { return buysEffect(1); }
export function chargeEffect(n) {
    if (n === void 0) { n = 1; }
    return {
        text: ["Put " + aOrNum(n, 'charge token') + " on this."],
        transform: function (s, card) { return charge(card, n); }
    };
}
export function targetedEffect(f, text, options) {
    return {
        text: [text],
        transform: function (s, c) { return applyToTarget(function (target) { return f(target, c); }, text, options); }
    };
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
export function ploughEffect() {
    return {
        text: ['Put your discard and play into your hand'],
        transform: function () { return ploughTransform; }
    };
}
export function refreshEffect(n, doRecycle) {
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
export function recycleEffect() {
    return {
        text: ['Put your discard into your hand.'],
        transform: function (state) { return doAll([moveMany(state.discard, 'hand'), sortHand]); }
    };
}
//
//
// ------ COMMON HELPERS ------
//
//
//
export function fragileEcho(t) {
    if (t === void 0) { t = 'echo'; }
    return {
        text: "Whenever a card with " + a(t) + " token would move to your hand or discard,\n               trash it instead.",
        kind: 'move',
        handles: function (p, state) { return state.find(p.card).count(t) > 0
            && (p.toZone == 'hand' || p.toZone == 'discard'); },
        replace: function (p) { return (__assign(__assign({}, p), { toZone: 'void' })); }
    };
}
export function workshopEffect(n) {
    return targetedEffect(function (target, card) { return target.buy(card); }, "Buy a card in the supply costing up to $" + n + ".", function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)); }); });
}
export function useRefresh() {
    return targetedEffect(function (target, c) { return target.use(c); }, "Use " + refresh.name + ".", function (state) { return state.events.filter(function (c) { return c.name == refresh.name; }); });
}
export function startsWithCharge(name, n) {
    return {
        text: "Each " + name + " is created with " + aOrNum(n, 'charge token') + " on it.",
        kind: 'create',
        handles: function (p) { return p.spec.name == name; },
        replace: function (p) { return (__assign(__assign({}, p), { effects: p.effects.concat([function (c) { return charge(c, n); }]) })); }
    };
}
function sum(xs, f) {
    return xs.map(f).reduce(function (a, b) { return a + b; });
}
export function countNameTokens(card, token, state) {
    return sum(state.supply, function (c) { return (c.name == card.name) ? c.count(token) : 0; });
}
export function nameHasToken(card, token, state) {
    return state.supply.some(function (s) { return s.name == card.name && s.count(token) > 0; });
}
export function reflectTrigger(token) {
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
//
//
// ------ CORE ------
//
//
//
export var refresh = { name: 'Refresh',
    fixedCost: energy(4),
    effects: [refreshEffect(5)],
};
registerEvent(refresh, 'core');
export var copper = { name: 'Copper',
    buyCost: coin(0),
    effects: [coinsEffect(1)]
};
register(copper, 'core');
export var silver = { name: 'Silver',
    buyCost: coin(3),
    effects: [coinsEffect(2)]
};
register(silver, 'core');
export var gold = { name: 'Gold',
    buyCost: coin(6),
    effects: [coinsEffect(3)]
};
register(gold, 'core');
export var estate = { name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
};
register(estate, 'core');
export var duchy = { name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
};
register(duchy, 'core');
export var province = { name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
};
register(province, 'core');
//
//
// ------ CORE CREATED ------
//
export var villager = {
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
//# sourceMappingURL=index.js.map