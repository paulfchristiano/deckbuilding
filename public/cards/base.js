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
import { choice, asChoice, trash, addCosts, subtractCost, multiplyCosts, eq, leq, noop, gainPoints, gainActions, gainCoins, gainBuys, free, create, move, doAll, multichoice, renderCost, moveMany, payToDo, payCost, addToken, removeToken, charge, discharge, asNumberedChoices, allowNull, setResource, tick, a, num, createAndTrack, villager, fair, supplyForCard, actionsEffect, buyEffect, buysEffect, pointsEffect, createEffect, refreshEffect, recycleEffect, createInPlayEffect, chargeEffect, targetedEffect, workshopEffect, coinsEffect, reflectTrigger, energy, coin, repeat, costPer, incrementCost, costReduceNext, countNameTokens, nameHasToken, startsWithCharge, useRefresh, costReduce, applyToTarget, playTwice, payAction, sortHand, discardFromPlay, trashThis, fragileEcho, copper, gold, estate, duchy, dedupBy, countDistinctNames, playReplacer } from '../logic.js';
export var cards = [];
export var events = [];
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
cards.push(supplyForCard(ghostTown, coin(3), { onBuy: [actionsEffect(2)] }));
/*
const hound:CardSpec = {name: 'Hound',
    fixedCost: energy(1),
    effects: [actionEffect(2)],
}
buyableFree(hound, 2)
*/
var transmogrify = { name: 'Transmogrify', effects: [{
            text: ["Trash a card in your hand.\n                If you do, choose a card in the supply costing up to $2 more than it.\n                Create a copy of that card in your hand."],
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
cards.push(supplyForCard(transmogrify, coin(3)));
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
cards.push(supplyForCard(till, coin(3)));
var village = { name: 'Village',
    effects: [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
};
cards.push(supplyForCard(village, coin(3)));
var bridge = { name: 'Bridge',
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce('buy', { coin: 1 }, true)]
};
cards.push(supplyForCard(bridge, coin(4)));
var conclave = { name: 'Conclave', replacers: [{
            text: "Cards @ less to play if they don't share a name\n               with a card in your discard or in play.\n               Whenever this reduces a cost, discard it and +$2.",
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
cards.push(supplyForCard(conclave, coin(4)));
var lab = { name: 'Lab',
    effects: [actionsEffect(2)]
};
cards.push(supplyForCard(lab, coin(2)));
function throneroomEffect() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction, playTwice(card)); }
    };
}
export var throneRoom = { name: 'Throne Room',
    fixedCost: energy(1),
    effects: [throneroomEffect()]
};
cards.push(supplyForCard(throneRoom, coin(5)));
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1), triggers: [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            transform: function (e) { return gainCoins(1); },
        }]
};
cards.push(supplyForCard(coppersmith, coin(3)));
var Unearth = 'Unearth';
var unearth = { name: Unearth,
    fixedCost: energy(1), effects: [coinsEffect(2), actionsEffect(1), targetedEffect(function (target) { return move(target, 'hand'); }, "Put a non-" + Unearth + " card from your discard into your hand.", function (state) { return state.discard.filter(function (c) { return c.name != Unearth; }); })
    ]
};
cards.push(supplyForCard(unearth, coin(4)));
var celebration = { name: 'Celebration',
    fixedCost: energy(1),
    replacers: [costReduce('play', { energy: 1 })]
};
cards.push(supplyForCard(celebration, coin(8), { replacers: [{
            text: "Whenever you would create a " + celebration.name + " in your discard,\n    instead create it in play.",
            kind: 'create',
            handles: function (p) { return p.spec.name == celebration.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] }));
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
cards.push(supplyForCard(plow, coin(4)));
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
cards.push(supplyForCard(construction, coin(5)));
var hallOfMirrors = { name: 'Hall of Mirrors', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [{
            text: ['Put a mirror token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'mirror'); }));
            }
        }], staticTriggers: [reflectTrigger('mirror')], };
events.push(hallOfMirrors);
/*
const restock:CardSpec = {name: 'Restock',
    calculatedCost: costPlus(energy(2), coin(1)),
    effects: [incrementCost(), refreshEffect(5)],
}
registerEvent(restock)
*/
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
events.push(escalate);
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
events.push(volley);
var parallelize = { name: 'Parallelize', fixedCost: __assign(__assign({}, free), { coin: 1, energy: 1 }),
    effects: [{
            text: ["Put a parallelize token on each card in your hand."],
            transform: function (state) { return doAll(state.hand.map(function (c) { return addToken(c, 'parallelize'); })); }
        }],
    staticReplacers: [{
            text: "Cards cost @ less to play for each parallelize token on them.\n            Whenever this reduces a card's cost by one or more @,\n            remove that many parallelize tokens from it.",
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
events.push(parallelize);
var reach = { name: 'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
};
events.push(reach);
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
events.push(travelingFair);
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
events.push(philanthropy);
var finance = { name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
};
events.push(finance);
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
cards.push(supplyForCard(flowerMarket, coin(2), { onBuy: [pointsEffect(1)] }));
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
events.push(vault);
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
cards.push(supplyForCard(vibrantCity, coin(3)));
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than " + max + "."],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var frontier = { name: 'Frontier',
    fixedCost: energy(1),
    buyCost: coin(7), effects: [{
            text: ['+1 vp per charge token on this.'],
            transform: function (state, card) { return gainPoints(state.find(card).charge, card); }
        }, chargeEffect()]
};
cards.push(supplyForCard(frontier, coin(7), { replacers: [startsWithCharge(frontier.name, 2)] }));
var investment = { name: 'Investment',
    fixedCost: energy(0), effects: [{
            text: ['+$1 per charge token on this.'],
            transform: function (state, card) { return gainCoins(state.find(card).charge, card); },
        }, chargeUpTo(6)]
};
cards.push(supplyForCard(investment, coin(4), { replacers: [startsWithCharge(investment.name, 2)] }));
var populate = { name: 'Populate', fixedCost: __assign(__assign({}, free), { coin: 8, energy: 2 }),
    effects: [{
            text: ['Buy up to 6 cards in the supply.'],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, targets_1, targets_1_1, target, e_1_1;
                    var _a, e_1, _b;
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
                                e_1_1 = _c.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (targets_1_1 && !targets_1_1.done && (_b = targets_1.return)) _b.call(targets_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
events.push(populate);
export var duplicate = { name: 'Duplicate', fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
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
events.push(duplicate);
var royalSeal = { name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair]
};
cards.push(supplyForCard(royalSeal, coin(5)));
var workshop = { name: 'Workshop',
    fixedCost: energy(0),
    effects: [workshopEffect(4)],
};
cards.push(supplyForCard(workshop, coin(4)));
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
cards.push(supplyForCard(shippingLane, coin(5)));
var factory = { name: 'Factory',
    fixedCost: energy(1),
    effects: [workshopEffect(6)],
};
cards.push(supplyForCard(factory, coin(3)));
var imitation = { name: 'Imitation',
    fixedCost: energy(1), effects: [targetedEffect(function (target, card) { return create(target.spec, 'hand'); }, 'Choose a card in your hand. Create a copy of it in your hand.', function (state) { return state.hand; })]
};
cards.push(supplyForCard(imitation, coin(3)));
var feast = { name: 'Feast',
    fixedCost: energy(0), effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); }), trashThis()]
};
cards.push(supplyForCard(feast, coin(3), { 'onBuy': [buyEffect()] }));
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
events.push(toil);
var recycle = { name: 'Recycle',
    fixedCost: energy(2),
    effects: [recycleEffect()],
};
events.push(recycle);
var twin = { name: 'Twin', fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })],
    staticTriggers: [{
            text: "After playing a card with a twin token other than with this, play it again.",
            kind: 'afterPlay',
            handles: function (e, state, card) { return (e.card.count('twin') > 0 && e.source.id != card.id); },
            transform: function (e, state, card) { return e.card.play(card); },
        }],
};
events.push(twin);
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
cards.push(supplyForCard(researcher, coin(3), { replacers: [startsWithCharge(researcher.name, 3)] }));
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
cards.push(supplyForCard(lackeys, coin(3), { onBuy: [createInPlayEffect(villager, 1)] }));
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [createEffect(gold, 'hand', 2)]
};
cards.push(supplyForCard(goldMine, coin(6)));
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
    effects: [chargeEffect()],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard,\n            if this has a charge token then instead\n            remove a charge token to set the card aside and play it.", function (p, s, c) { return s.find(c).charge > 0; }, function (p, s, c) { return discharge(c, 1); })]
};
events.push(expedite);
function removeAllSupplyTokens(token) {
    return {
        text: ["Remove all " + token + " tokens from cards in the supply."],
        transform: function (state, card) { return doAll(state.supply.map(function (s) { return removeToken(s, token, 'all'); })); }
    };
}
var synergy = { name: 'Synergy', fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    effects: [removeAllSupplyTokens('synergy'), {
            text: ['Put synergy tokens on two cards in the supply.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, cards_1, cards_1_1, card, e_2_1;
                    var _a, e_2, _b;
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
                                e_2_1 = _c.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                                }
                                finally { if (e_2) throw e_2.error; }
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
events.push(synergy);
var shelter = { name: 'Shelter',
    buyCost: coin(3), effects: [actionsEffect(1), targetedEffect(function (target) { return addToken(target, 'shelter'); }, 'Put a shelter token on a card.', function (state) { return state.play; })],
    staticReplacers: [{
            kind: 'move',
            text: "Whenever you would move a card with a shelter token from play,\n               instead remove a shelter token from it.",
            handles: function (x, state) { return x.fromZone == 'play'
                && x.skip == false
                && state.find(x.card).count('shelter') > 0; },
            replace: function (x) { return (__assign(__assign({}, x), { skip: true, toZone: 'play', effects: x.effects.concat([removeToken(x.card, 'shelter')]) })); }
        }]
};
cards.push(shelter);
var market = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
};
cards.push(supplyForCard(market, coin(3)));
var focus = { name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(1)],
};
events.push(focus);
var sacrifice = { name: 'Sacrifice', effects: [actionsEffect(1), buyEffect(), targetedEffect(function (target, card) { return doAll([target.play(card), trash(target)]); }, 'Play a card in your hand, then trash it.', function (state) { return state.hand; })]
};
cards.push(supplyForCard(sacrifice, coin(4)));
var herbs = { name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
};
cards.push(supplyForCard(herbs, coin(2), { 'onBuy': [buyEffect()] }));
var spices = { name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
};
cards.push(supplyForCard(spices, coin(5), { onBuy: [coinsEffect(4)] }));
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
events.push(onslaught);
//TODO: link these together, modules in general?
var colony = { name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(6)],
};
cards.push(supplyForCard(colony, coin(16)));
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
};
cards.push(supplyForCard(platinum, coin(8)));
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(6), buysEffect(2)]
};
cards.push(supplyForCard(greatSmithy, coin(6)));
var resume = { name: 'Resume',
    fixedCost: energy(1),
    effects: [refreshEffect(5, false)]
};
events.push(resume);
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
cards.push(supplyForCard(kingsCourt, coin(9)));
var gardens = { name: "Gardens",
    fixedCost: energy(1), effects: [{
            text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
            transform: function (state, card) { return gainPoints(Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length) / 8), card); }
        }]
};
cards.push(supplyForCard(gardens, coin(4)));
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
events.push(decay);
var reflect = { name: 'Reflect',
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })], effects: [incrementCost(), targetedEffect(function (target, card) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand', function (state) { return state.hand; })], staticTriggers: [reflectTrigger('reflect')], };
events.push(reflect);
var replicate = { name: 'Replicate',
    fixedCost: energy(1),
    effects: [chargeEffect()], staticTriggers: [{
            text: "After buying a card other than with this,\n            remove a charge token from this to to buy the card again.",
            kind: 'afterBuy',
            handles: function (e, s, c) { return s.find(c).charge > 0 && e.source.id != c.id; },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), e.card.buy(c)); }
        }]
};
events.push(replicate);
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
        }]
};
events.push(inflation);
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
events.push(burden);
/*
const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionsEffect(3), coinsEffect(3)]
}
buyable(goldsmith, 7)
*/
var procession = { name: 'Procession',
    fixedCost: energy(1), effects: [{
            text: ["Pay one action to play a card in your hand twice,\n                then trash it and create a copy of a card in the supply\n                costing exactly $1 or $2 more."],
            transform: function (state, card) { return payToDo(payAction, applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(function (target2) { return create(target2.spec); }, 'Choose a card to buy.', function (s) { return s.supply.filter(function (c) { return eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 1 })) || eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 2 })); }); })
            ]); }, 'Choose a card to play twice.', function (s) { return s.hand; })); }
        }]
};
cards.push(supplyForCard(procession, coin(4)));
var publicWorks = { name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', { energy: 1 }, true)],
};
cards.push(publicWorks);
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
        }; }, "Create a copy of a card you have in play,\n         then put an echo token on the copy and play it.", function (state) { return dedupBy(state.play, function (c) { return c.spec; }); })]
};
cards.push(supplyForCard(echo, coin(6), { replacers: [fragileEcho('echo')] }));
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
cards.push(supplyForCard(mastermind, coin(6)));
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
cards.push(supplyForCard(recruitment, coin(3)));
var dragon = { name: 'Dragon',
    buyCost: coin(7), effects: [targetedEffect(function (c) { return trash(c); }, 'Trash a card in your hand.', function (s) { return s.hand; }), coinsEffect(5), actionsEffect(3), buyEffect()]
};
var hatchery = { name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon], effects: [actionsEffect(1), {
            text: ["If this has two charge tokens, remove one and\n                create " + a(dragon.name) + " in your hand.\n                Otherwise, put a charge token on this."],
            transform: function (state, card) {
                var c = state.find(card);
                return (c.charge >= 2)
                    ? doAll([
                        discharge(c, 1),
                        create(dragon, 'hand')
                    ]) : charge(c);
            }
        }]
};
cards.push(supplyForCard(hatchery, coin(3)));
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
cards.push(supplyForCard(looter, coin(4)));
var palace = { name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
};
cards.push(supplyForCard(palace, coin(5)));
var Innovation = 'Innovation';
var innovation = { name: Innovation,
    effects: [actionsEffect(1)], replacers: [playReplacer("Whenever you would create a card in your discard,\n        instead discard this to set the card aside and play it.", function (p, s, c) { return s.find(c).place == 'play'; }, function (p, s, c) { return discardFromPlay(c); })]
};
cards.push(supplyForCard(innovation, coin(6)));
var formation = { name: 'Formation',
    effects: [], replacers: [{
            text: 'Cards cost @ less to play if they share a name with a card in your discard or in play.'
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
cards.push(supplyForCard(formation, coin(4)));
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
cards.push(supplyForCard(traveler, coin(7), { replacers: [startsWithCharge(traveler.name, 1)] }));
var fountain = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [refreshEffect(5, false)],
};
cards.push(supplyForCard(fountain, coin(4)));
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
                var _a, _b, c, e_3_1;
                var e_3, _c;
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
                            e_3_1 = _d.sent();
                            e_3 = { error: e_3_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_3) throw e_3.error; }
                            return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Put eight art tokens on a card in the supply.\n        Remove all art tokens from other cards in the supply.", function (s) { return s.supply; })],
    staticReplacers: [{
            text: "Cards cost @ less to play for each art token on their supply.\n               Whenever this reduces a cost by one or more @,\n               remove that many art tokens.",
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
events.push(lostArts);
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
cards.push(supplyForCard(grandMarket, coin(5)));
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
cards.push(supplyForCard(industry, coin(6)));
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
cards.push(supplyForCard(homesteading, coin(3)));
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
cards.push(supplyForCard(duke, coin(4)));
var carpenter = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
            text: ["+1 action per card in play."],
            transform: function (state, card) { return gainActions(state.play.length, card); }
        }]
};
cards.push(supplyForCard(carpenter, coin(4)));
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
cards.push(supplyForCard(artificer, coin(3)));
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
cards.push(supplyForCard(banquet, coin(3)));
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
cards.push(supplyForCard(harvest, coin(3)));
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
cards.push(supplyForCard(secretChamber, coin(3)));
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
cards.push(supplyForCard(hireling, coin(2)));
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
cards.push(supplyForCard(haggler, coin(5), {
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
}));
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
                    var cards, options, _loop_3, state_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.discard.filter(function (c) { return c.count('reuse') == 0; });
                                options = asNumberedChoices(cards);
                                _loop_3 = function () {
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
                                return [5 /*yield**/, _loop_3()];
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
events.push(reuse);
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
events.push(polish);
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
events.push(mire);
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
events.push(commerce);
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
events.push(reverberate);
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
cards.push(supplyForCard(turnpike, coin(5)));
var highway = {
    name: 'Highway',
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', { coin: 1 }, true)],
};
cards.push(supplyForCard(highway, coin(6), { replacers: [{
            text: "Whenever you would create a " + highway.name + " in your discard,\n    instead create it in play.",
            kind: 'create',
            handles: function (p) { return p.spec.name == highway.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] }));
var prioritize = {
    name: 'Prioritize',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 6); }, 'Put six priority tokens on a card in the supply.', function (state) { return state.supply; })],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard\n        whose supply has a priority token,\n        instead remove a priority token to set the card aside and play it.", function (p, s, c) { return nameHasToken(p.spec, 'priority', s); }, function (p, s, c) { return applyToTarget(function (t) { return removeToken(t, 'priority', 1, true); }, 'Remove a priority token.', function (state) { return state.supply.filter(function (t) { return t.name == p.spec.name; }); }, { cost: true }); })]
};
events.push(prioritize);
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
cards.push(supplyForCard(composting, coin(3)));
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
cards.push(supplyForCard(fairyGold, coin(3), {
    replacers: [startsWithCharge(fairyGold.name, 3)]
}));
var pathfinding = {
    name: 'Pathfinding',
    fixedCost: coin(6),
    effects: [removeAllSupplyTokens('pathfinding'), targetedEffect(function (target) { return addToken(target, 'pathfinding'); }, "Put a pathfinding token on a card in the supply other than Copper.", function (state) { return state.supply.filter(function (target) { return target.name != copper.name; }); })],
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a card whose supply\n        has a  pathfinding token on it, +1 action.",
            handles: function (e, state) { return nameHasToken(e.card, 'pathfinding', state); },
            transform: function (e, state, card) { return gainActions(1, card); }
        }]
};
events.push(pathfinding);
var fortuneName = 'Fortune';
var fortune = {
    name: fortuneName,
    effects: [{
            text: ["Double your $."],
            transform: function (state, card) { return gainCoins(state.coin); }
        }, {
            text: ["Double your buys."],
            transform: function (state, card) { return gainBuys(state.buys); }
        }],
    staticTriggers: [{
            kind: 'create',
            text: "Whenever you create " + a(fortuneName) + ", trash this from the supply.",
            handles: function (e) { return e.card.name == fortuneName; },
            transform: function (e, s, c) { return trash(c); },
        }]
};
cards.push(supplyForCard(fortune, coin(12)));
//cards.push(supplyForCard(fortune, coin(12), {afterBuy: [{text: ['trash it from the supply.'], transform: (s, c) => trash(c)}]}))
//# sourceMappingURL=base.js.map