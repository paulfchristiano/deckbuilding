// data/boons.ts - Boon definitions
// Boons are stage modifiers that affect gameplay with a par reduction trade-off
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
import { doAll, boons, free, coin, energy, costPer, useRefresh, buyEffect, createInPlayEffect, addToken, cannotUse, fair, villager, recycleEffect, targetedEffect, priorityRule, actionsEffect, buysEffect, coinsEffect, gainActions, gainBuys, gainCoins, discharge, charge, costReduceNext, choice, allowNull, multichoice, asNumberedChoices, asChoice, moveMany, leq, num, } from '../gameLogic.js';
var escalate = { name: 'Escalate',
    fixedCost: free,
    simpleText: [
        "Use Refresh.",
        "The cost of this event doubles each time you use it."
    ],
    variableCosts: [costPer(coin(1))],
    effects: [
        {
            text: ['Double the number of cost tokens on this.'],
            transform: function (s, c) { return addToken(c, 'cost', s.find(c).tokens.get('cost')); }
        },
        useRefresh()
    ],
    staticTriggers: [{
            text: 'At the start of the game put a charge token on this.',
            kind: 'gameStart',
            handles: function () { return true; },
            transform: function (e, s, c) { return addToken(c, 'cost'); }
        }]
};
boons.push({
    name: 'Escalate',
    description: 'Add Escalate as an event',
    parReduction: 12,
    cards: [],
    events: [escalate],
});
var travelingFair = { name: 'Traveling Fair',
    fixedCost: coin(1),
    simpleText: [
        '+1 buy.',
        'Create a Fair in play.'
    ],
    effects: [buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
};
boons.push({
    name: 'Traveling Fair',
    description: 'Add Traveling Fair as an event (no scaling cost)',
    parReduction: 6,
    cards: [],
    events: [travelingFair],
});
var vault = { name: 'Vault',
    restrictions: [cannotUse],
    staticReplacers: [{
            text: "You can't lose actions, $, or buys (other than by paying costs).",
            kind: 'resource',
            handles: function (p) { return p.amount < 0 && (p.resource == 'coin' ||
                p.resource == 'actions' ||
                p.resource == 'buys'); },
            replace: function (p) { return (__assign(__assign({}, p), { amount: 0 })); }
        }],
    staticTriggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, +10 actions and +2 buys.',
            handles: function () { return true; },
            transform: function (e, state, card) { return doAll([gainActions(10, card), gainBuys(2, card)]); }
        }]
};
boons.push({
    name: 'Vault',
    description: 'Add Vault as an event, start with 10 actions and 2 buys',
    parReduction: 4,
    cards: [],
    events: [vault],
});
var populate = { name: 'Populate',
    fixedCost: __assign(__assign({}, free), { coin: 8, energy: 2 }),
    simpleText: ['Buy every card in the supply costing up to $8.'],
    effects: [{
            text: ['Buy every card in the supply costing up to $8.'],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, targets_1, targets_1_1, target, e_1_1;
                    var e_1, _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                targets = state.supply.filter(function (target) { return leq(target.cost('buy', state), coin(8)); });
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 6, 7, 8]);
                                targets_1 = __values(targets), targets_1_1 = targets_1.next();
                                _b.label = 2;
                            case 2:
                                if (!!targets_1_1.done) return [3 /*break*/, 5];
                                target = targets_1_1.value;
                                return [4 /*yield*/, target.buy(card)(state)];
                            case 3:
                                state = _b.sent();
                                _b.label = 4;
                            case 4:
                                targets_1_1 = targets_1.next();
                                return [3 /*break*/, 2];
                            case 5: return [3 /*break*/, 8];
                            case 6:
                                e_1_1 = _b.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (targets_1_1 && !targets_1_1.done && (_a = targets_1.return)) _a.call(targets_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 8: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
boons.push({
    name: 'Populate',
    description: 'Add Populate as an event (buys all cards)',
    parReduction: 3,
    cards: [],
    events: [populate],
});
var recycle = { name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
};
boons.push({
    name: 'Recycle',
    description: 'Add Recycle as an event',
    parReduction: 5,
    cards: [],
    events: [recycle],
});
var flourishName = 'Flourish';
var flourish = { name: flourishName,
    fixedCost: free,
    simpleText: [
        "Once you have 1/16 of the vp requirement, you can use this to Refresh for free.",
        "You can repeat once you reach 1/8, 1/4, and 1/2 of the requirement."
    ],
    restrictions: [{
            text: 'You cannot use this if your score times the number of charge tokens on this is less than the vp goal.',
            test: function (card, state) { return state.points * state.find(card).charge < state.vp_goal; }
        }],
    effects: [
        useRefresh(),
        {
            text: ['Remove half of the charge tokens from this (rounded down).'],
            transform: function (s, c) {
                var currentCharge = s.find(c).charge;
                var toRemove = Math.floor(currentCharge / 2);
                return discharge(c, toRemove);
            }
        }
    ],
    staticTriggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, put 16 charge tokens on this.',
            handles: function () { return true; },
            transform: function (e, state, card) { return charge(card, 16); }
        }]
};
boons.push({
    name: 'Flourish',
    description: 'Add Flourish as an event',
    parReduction: 7,
    cards: [],
    events: [flourish],
});
var publicWorks = { name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', { energy: 1 }, true)],
};
boons.push({
    name: 'Public Works',
    description: 'Add Public Works as a card',
    parReduction: 5,
    cards: [publicWorks],
    events: [],
});
var reuse = {
    name: 'Reuse',
    fixedCost: energy(2),
    simpleText: [
        "Play any number of cards in your discard that don't have a reuse token on them.",
        "Put a reuse token on each card played this way."
    ],
    effects: [{
            text: ["Repeat any number of times:\n                choose a card in your discard without a reuse token\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_1, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.discard.filter(function (c) { return c.count('reuse') == 0; });
                                options = asNumberedChoices(cards);
                                _loop_1 = function () {
                                    var picked, id_1;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'discard'; })))];
                                            case 1:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _c.sent();
                                                return [4 /*yield*/, addToken(picked, 'reuse')(state)];
                                            case 4:
                                                state = _c.sent();
                                                id_1 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_1; });
                                                _c.label = 5;
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
boons.push({
    name: 'Reuse',
    description: 'Add Reuse as an event',
    parReduction: 7,
    cards: [],
    events: [reuse],
});
var prioritize = {
    simpleText: [
        "Choose a supply.",
        "The next 5 times you create a card from that supply, play it immediately."
    ],
    name: 'Prioritize',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 5); }, 'Put five priority tokens on a card in the supply.', function (state) { return state.supply; })],
    rules: [priorityRule],
};
boons.push({
    name: 'Prioritize',
    description: 'Add Prioritize as an event',
    parReduction: 5,
    cards: [],
    events: [prioritize],
});
var composting = {
    name: 'Composting',
    effects: [],
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
                                return [4 /*yield*/, multichoice(state, "Choose up to ".concat(num(n, 'card'), " to put into your hand."), state.discard.map(asChoice), n)];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [2 /*return*/, moveMany(targets, 'hand')(state)];
                        }
                    });
                });
            }; }
        }]
};
boons.push({
    name: 'Composting',
    description: 'Add Composting as a card',
    parReduction: 4,
    cards: [composting],
    events: [],
});
var insight = {
    name: 'Insight',
    fixedCost: energy(1),
    simpleText: [
        '+1 action, +1 buy, +$1.',
        'Create a Villager and a Fair in play.'
    ],
    relatedCards: [villager, fair],
    effects: [
        actionsEffect(1),
        buysEffect(1),
        coinsEffect(1),
        createInPlayEffect(villager),
        createInPlayEffect(fair),
    ]
};
boons.push({
    name: 'Insight',
    description: 'Add Insight as an event',
    parReduction: 3,
    cards: [],
    events: [insight],
});
var windfall = {
    name: 'Windfall',
    fixedCost: free,
    simpleText: ['At the start of the game, +$15 and +5 buys.'],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, +$15 and +5 buys.',
            handles: function () { return true; },
            transform: function (e, state, card) { return doAll([gainCoins(15, card), gainBuys(5, card)]); }
        }]
};
boons.push({
    name: 'Windfall',
    description: 'Gain $15 and 5 buys at the start of the game',
    parReduction: 10,
    cards: [],
    events: [windfall],
});
var duplicateStart = {
    name: 'Duplication',
    fixedCost: free,
    simpleText: ['At the start of the game, put a duplicate token on each card in the supply.'],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, put a duplicate token on each card in the supply.',
            handles: function () { return true; },
            transform: function (e, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, supply, e_2_1;
                    var e_2, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 5, 6, 7]);
                                _a = __values(state.supply), _b = _a.next();
                                _d.label = 1;
                            case 1:
                                if (!!_b.done) return [3 /*break*/, 4];
                                supply = _b.value;
                                return [4 /*yield*/, addToken(supply, 'duplicate')(state)];
                            case 2:
                                state = _d.sent();
                                _d.label = 3;
                            case 3:
                                _b = _a.next();
                                return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 7];
                            case 5:
                                e_2_1 = _d.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 7];
                            case 6:
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 7: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
boons.push({
    name: 'Duplication',
    description: 'Start with a duplicate token on each supply.',
    parReduction: 5,
    cards: [],
    events: [duplicateStart],
});
var priorityStart = {
    name: 'Prioritization',
    fixedCost: free,
    simpleText: ['At the start of the game, put a priority token on each card in the supply.'],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, put a priority token on each card in the supply.',
            handles: function () { return true; },
            transform: function (e, state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, supply, e_3_1;
                    var e_3, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 5, 6, 7]);
                                _a = __values(state.supply), _b = _a.next();
                                _d.label = 1;
                            case 1:
                                if (!!_b.done) return [3 /*break*/, 4];
                                supply = _b.value;
                                return [4 /*yield*/, addToken(supply, 'priority')(state)];
                            case 2:
                                state = _d.sent();
                                _d.label = 3;
                            case 3:
                                _b = _a.next();
                                return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 7];
                            case 5:
                                e_3_1 = _d.sent();
                                e_3 = { error: e_3_1 };
                                return [3 /*break*/, 7];
                            case 6:
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                                return [7 /*endfinally*/];
                            case 7: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
boons.push({
    name: 'Acceleration',
    description: 'Start with a priority token on each supply.',
    parReduction: 5,
    cards: [],
    events: [priorityStart],
});
//# sourceMappingURL=boons.js.map