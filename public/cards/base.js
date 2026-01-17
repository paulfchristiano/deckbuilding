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
import { choice, asChoice, trash, addCosts, subtractCost, multiplyCosts, eq, leq, noop, gainPoints, gainActions, gainCoins, gainBuys, free, create, move, doAll, multichoice, renderCost, moveMany, payToDo, payCost, addToken, removeToken, charge, discharge, asNumberedChoices, allowNull, setResource, tick, a, num, aOrNum, createAndTrack, villager, fair, bounty, supplyForCard, actionsEffect, buyEffect, buysEffect, pointsEffect, createEffect, refreshEffect, recycleEffect, createInPlayEffect, chargeEffect, targetedEffect, workshopEffect, coinsEffect, energy, coin, repeat, costPer, incrementCost, costReduceNext, countNameTokens, nameHasToken, startsWithCharge, useRefresh, costReduce, applyToTarget, playTwice, payAction, sortHand, discardFromPlay, trashThis, copper, gold, silver, estate, duchy, province, dedupBy, countDistinctNames, playReplacer, trashOnLeavePlay, sourceHasName, cannotUse, renderCostOrZero, echoRule, priorityRule, reflectRule, ferryRule, twinRule } from '../logic.js';
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
var transmogrify = { name: 'Transmogrify',
    simpleText: "Trash a card in your hand. Create a card in your hand costing up to $2 more than it.",
    effects: [actionsEffect(1), {
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
var till = { name: Till,
    effects: [{
            text: ["Put up to 3 non-".concat(Till, " cards from your\n               discard into your hand.")],
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
cards.push(supplyForCard(till, coin(5)));
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
var conclave = { name: 'Conclave',
    replacers: [{
            text: "Cards cost @ less to play if they don't share a name\n               with a card in your discard or in play.\n               Whenever this reduces a cost, discard it and +$2.",
            kind: 'cost',
            handles: function (x, state) { return (x.actionKind == 'play' && state.discard.concat(state.play).every(function (c) { return c.name != x.card.name; })); },
            replace: function (x, state, card) {
                var newCost = subtractCost(x.cost, { energy: 1 });
                if (!eq(newCost, x.cost)) {
                    newCost.effects = newCost.effects.concat([
                        move(card, 'discard'),
                        gainCoins(2, card)
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                else {
                    return x;
                }
            }
        }]
};
// cards.push(supplyForCard(conclave, coin(3))) // removed
var lab = { name: 'Lab',
    effects: [actionsEffect(3)]
};
cards.push(supplyForCard(lab, coin(3)));
function throneroomEffect() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction(card), playTwice(card)); }
    };
}
export var throneRoom = { name: 'Throne Room',
    simpleText: "Pay an action to play a card in your hand twice without paying any @ costs.",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [throneroomEffect()] };
cards.push(throneRoom);
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1),
    effects: [buysEffect(1)],
    triggers: [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            transform: function (e, s, c) { return gainCoins(1, c); },
        }]
};
cards.push(supplyForCard(coppersmith, coin(3)));
var Unearth = 'Unearth';
var unearth = { name: Unearth,
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(function (target) { return move(target, 'hand'); }, "Put a non-".concat(Unearth, " card from your discard into your hand."), function (state) { return state.discard.filter(function (c) { return c.name != Unearth; }); })
    ]
};
cards.push(supplyForCard(unearth, coin(4)));
var celebration = { name: 'Celebration',
    simpleText: "Cards cost @ less to play. When you create this, put it directly into play.",
    fixedCost: energy(1),
    replacers: [costReduce('play', { energy: 1 })] };
cards.push(supplyForCard(celebration, coin(6), { replacers: [{
            text: "Whenever you would create a ".concat(celebration.name, " in your discard,\n    instead create it in play."),
            kind: 'create',
            handles: function (p) { return p.spec.name == celebration.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] }));
var plowName = 'Plow';
var plow = { name: plowName,
    simpleText: "Put your discard into your hand. ".concat(plowName, " goes to play instead of your discard when bought or created."),
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    staticReplacers: [{
            kind: 'create',
            text: "Whenever you would create a ".concat(plowName, ", create it in play."),
            handles: function (p) { return p.spec.name == plowName; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }]
};
cards.push(supplyForCard(plow, coin(4)));
var construction = { name: 'Construction',
    fixedCost: energy(1),
    effects: [actionsEffect(3)],
    triggers: [{
            text: 'Whenever you pay @, +1 action, +$1 and +1 buy.',
            kind: 'cost',
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e, s, c) { return doAll([
                gainActions(e.cost.energy, c),
                gainCoins(e.cost.energy, c),
                gainBuys(e.cost.energy, c)
            ]); }
        }]
};
cards.push(supplyForCard(construction, coin(4)));
var hallOfMirrors = { name: 'Hall of Mirrors',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [{
            text: ['Put a reflect token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'reflect'); }));
            }
        }],
    rules: [reflectRule], };
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
    simpleText: "Use Refresh. This costs more to play each time you use it ($0, $1, $3, $6, $10...).",
    variableCosts: [costPer(coin(1))],
    effects: [
        chargeEffect(),
        {
            text: ['Put a cost token on this for each charge token on it.'],
            transform: function (s, c) { return addToken(c, 'cost', s.find(c).charge); }
        },
        useRefresh()
    ]
};
// events.push(escalate) // removed (boon)
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
    simpleText: "Play then trash any number of cards in your hand.",
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
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _c.sent();
                                                return [4 /*yield*/, trash(picked)(state)];
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
events.push(volley);
var parallelize = { name: 'Parallelize',
    fixedCost: __assign(__assign({}, free), { coin: 1, energy: 1 }),
    simpleText: "Put a parallelize token on each card in your hand. Cards cost @ less to play for each parallelize token on them.",
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
    var extraStr = "".concat(renderCost(increment, true), " for every ").concat(n, " cost tokens on this.");
    return {
        calculate: function (card, state) {
            return multiplyCosts(increment, Math.floor(state.find(card).count('cost') / n));
        },
        text: extraStr,
    };
}
var travelingFair = { name: 'Traveling Fair',
    fixedCost: coin(1),
    variableCosts: [costPerN(coin(1), 5)],
    effects: [incrementCost(), buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair],
};
// events.push(travelingFair) // removed (boon)
var philanthropy = { name: 'Philanthropy',
    fixedCost: coin(10),
    effects: [{
            text: ['Pay all $.', '+1 vp per $ paid.'],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.coin;
                                return [4 /*yield*/, payCost(__assign(__assign({}, free), { coin: n }), c)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainPoints(n, c)(state)];
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
var flowerMarketCard = {
    name: 'Flower Market',
    buyCost: coin(2),
    effects: [buyEffect(), pointsEffect(1)]
};
var flowerMarket = supplyForCard(flowerMarketCard, coin(2), { onBuy: [pointsEffect(1)] });
/*
const territory:CardSpec = {name: 'Territory',
    fixedCost: energy(1),
    effects: [coinsEffect(2), pointsEffect(2), buyEffect()],
}
buyable(territory, 5)
*/
var vault = { name: 'Vault',
    restrictions: [cannotUse],
    staticReplacers: [{
            text: "You can't lose actions, $, or buys (other than by paying costs).",
            kind: 'resource',
            handles: function (p) { return p.amount < 0 && (p.resource == 'coin' ||
                p.resource == 'actions' ||
                p.resource == 'buys'); },
            replace: function (p) { return (__assign(__assign({}, p), { amount: 0 })); }
        }]
};
//events.push(vault)
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
    effects: [pointsEffect(2), actionsEffect(1)],
    buyCost: coin(5),
};
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than ".concat(max, ".")],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var frontierCard = { name: 'Frontier',
    simpleText: "+2 vp. This increases by 1vp each time you play it, up to +6vp.",
    buyCost: coin(4),
    effects: [{
            text: ['+1 vp per charge token on this.'],
            transform: function (state, card) { return gainPoints(state.find(card).charge, card); }
        }, chargeUpTo(6)]
};
var frontier = supplyForCard(frontierCard, coin(4), { replacers: [startsWithCharge(frontierCard.name, 2)] });
var investment = { name: 'Investment',
    simpleText: "+$2. This increases by $1 each time you play it, up to +$6.",
    fixedCost: energy(0),
    effects: [{
            text: ['+$1 per charge token on this.'],
            transform: function (state, card) { return gainCoins(state.find(card).charge, card); },
        }, chargeUpTo(6)]
};
cards.push(supplyForCard(investment, coin(4), { replacers: [startsWithCharge(investment.name, 2)] }));
/*
const populate:CardSpec = {name: 'Populate',
    fixedCost: {...free, coin:2, energy:2},
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card the normal way,
        remove a charge token from this to buy up to 4 other cards
        with equal or lesser cost.`,
        handles: e => e.source == 'act',
        transform: (e, s, c) => payToDo(discharge(c, 1), async function(state) {
            let targets; [state, targets] = await multichoice(state,
                'Choose up to 4 other cards to buy',
                state.supply.filter(target =>
                    leq(target.cost('buy', state), e.card.cost('buy', state))
                    && target.id != e.card.id
                ).map(asChoice), 4)
            for (const target of targets) {
                state = await target.buy(c)(state)
            }
            return state
        })
    }]
}
*/
var populate = { name: 'Populate',
    fixedCost: __assign(__assign({}, free), { coin: 8, energy: 2 }),
    effects: [{
            text: ['Buy up to 5 cards in the supply each costing up to $8.'],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, targets_1, targets_1_1, target, e_1_1;
                    var _a, e_1, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose up to 5 cards to buy', state.supply.filter(function (target) { return leq(target.cost('buy', state), coin(8)); }).map(asChoice), 5)];
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
// events.push(populate) // removed (boon)
export var duplicate = { name: 'Duplicate',
    simpleText: "For each card in the supply, the next time you buy that card buy it again for free.",
    fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    effects: [{
            text: ["Put a duplicate token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'duplicate'); })); }
        }],
    staticTriggers: [{
            text: "After buying a card with a duplicate token on it other than with this,\n        remove a duplicate token from it to buy it again.",
            kind: 'afterBuy',
            handles: function (e, state, card) {
                if (sourceHasName(e.source, card.name))
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
var workshopName = 'Workshop';
var workshop = { name: workshopName,
    fixedCost: energy(0),
    effects: [workshopEffect(4, workshopName)],
};
cards.push(supplyForCard(workshop, coin(3)));
var shippingLane = { name: 'Shipping Lane',
    simpleText: "+$2. The next time you buy a card, buy it again for free.",
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
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
cards.push(supplyForCard(shippingLane, coin(3)));
var factoryName = 'Factory';
var factory = { name: factoryName,
    fixedCost: energy(1),
    effects: [workshopEffect(6, factoryName)],
};
cards.push(supplyForCard(factory, coin(3)));
var imitation = { name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(function (target, card) { return create(target.spec, 'hand'); }, 'Choose a card in your hand. Create a copy of it in your hand.', function (state) { return state.hand; })]
};
cards.push(supplyForCard(imitation, coin(3)));
var feast = { name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); }), trashThis()]
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
// events.push(recycle) // removed (boon)
var twin = { name: 'Twin',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    simpleText: "Put a twin token on a card in your hand. Whenever you play it other than with this effect, play it again.",
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })],
    rules: [twinRule], };
events.push(twin);
function literalOptions(xs, keys) {
    return xs.map(function (x, i) { return ({
        render: { kind: 'string', string: x },
        hotkeyHint: { kind: 'key', val: keys[i] },
        value: x
    }); });
}
var researcher = { name: 'Researcher',
    simpleText: "+3 actions. This increases by +1 action each time you play it.",
    effects: [{
            text: ["+1 action for each charge token on this."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.find(card).charge;
                                return [4 /*yield*/, gainActions(n, card)(state)];
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
cards.push(supplyForCard(researcher, coin(4), { replacers: [startsWithCharge(researcher.name, 3)] }));
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
    effects: [actionsEffect(4)],
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
    simpleText: "The next time you create a card, play it immediately.",
    name: 'Expedite',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard,\n            if this has a charge token then instead\n            remove a charge token to set the card aside.\n            Then play it if it is set aside.", function (p, s, c) { return s.find(c).charge > 0; }, function (p, s, c) { return charge(c, -1); })]
};
events.push(expedite);
function removeAllSupplyTokens(token) {
    return {
        text: ["Remove all ".concat(token, " tokens from cards in the supply.")],
        transform: function (state, card) { return doAll(state.supply.map(function (s) { return removeToken(s, token, 'all'); })); }
    };
}
var synergy = { name: 'Synergy',
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    simpleText: "Put synergy tokens on two cards in the supply. Whenever you buy the more expensive one (or eithe if they are tied), you can buy the other one for free.",
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
            handles: function (e, state, card) { return (!sourceHasName(e.source, card.name) && e.card.count('synergy') > 0); },
            transform: function (e, state, card) { return applyToTarget(function (target) { return target.buy(card); }, 'Choose a card to buy.', function (s) { return s.supply.concat(s.events).filter(function (c) { return c.count('synergy') > 0
                && leq(c.cost('buy', s), e.card.cost('buy', s))
                && c.id != e.card.id; }); }); }
        }]
};
events.push(synergy);
var shelterName = 'Shelter';
var shelter = { name: shelterName,
    buyCost: coin(5),
    simpleText: "Whenever you would move a card from play to your hand, instead leave it in play. Put this in play when you create it.",
    replacers: [{
            kind: 'move',
            text: 'Whenever you would move a card from play to your hand (including this one) instead leave it in place.',
            handles: function (x, state) { return x.fromZone == 'play' && x.toZone == 'hand'; },
            replace: function (x) { return (__assign(__assign({}, x), { skip: true, toZone: 'play' })); }
        }],
    staticReplacers: [{
            kind: 'create',
            text: "Whenever you would create a ".concat(shelterName, " in your discard,\n               instead create it in play."),
            handles: function (p) { return p.spec.name == shelterName && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
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
var sacrifice = { name: 'Sacrifice',
    effects: [actionsEffect(1), buyEffect(), targetedEffect(function (target, card) { return doAll([target.play(card), trash(target)]); }, 'Play a card in your hand, then trash it.', function (state) { return state.hand; })]
};
// cards.push(supplyForCard(sacrifice, coin(3))) // removed
var herbs = { name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()]
};
cards.push(supplyForCard(herbs, coin(2), { 'onBuy': [buyEffect()] }));
var spices = { name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
};
cards.push(supplyForCard(spices, coin(5), { onBuy: [coinsEffect(4)] }));
var onslaught = { name: 'Onslaught',
    fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    simpleText: "Play any number of cards in your hand.",
    effects: [{
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
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _c.sent();
                                                id_2 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_2; });
                                                _c.label = 4;
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
// cards.push(supplyForCard(colony, coin(16))) // removed
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)]
};
cards.push(supplyForCard(platinum, coin(8)));
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(8), buysEffect(2)]
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
        transform: function (state, card) { return payToDo(payAction(card), applyToTarget(function (target) { return doAll([
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
    effects: [{
            text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
            transform: function (state, card) { return gainPoints(Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length) / 8), card); }
        }]
};
// cards.push(supplyForCard(gardens, coin(4))) // removed (vp)
var territoryName = 'Territory';
var territory = {
    simpleText: "+2 vp. Leave this in your hand when you play it.",
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2)],
    staticReplacers: [{
            kind: 'move',
            text: "When you play a ".concat(territoryName, " from your hand, leave it there."),
            handles: function (p) { return p.card.name == territoryName && p.toZone == 'resolving' && p.fromZone == 'hand'; },
            replace: function (p) { return (__assign(__assign({}, p), { skip: true })); }
        }]
};
cards.push(territory);
var farmlandName = 'Farmland';
var farmland = {
    simpleText: "+7 vp if you played this the normal way from your hand.",
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a ".concat(farmlandName, " the normal way, +7 vp."),
            handles: function (e) { return e.source == 'act' && e.card.name == farmlandName; },
            transform: function (e, s, c) { return gainPoints(7, c); }
        }],
};
cards.push(farmland);
/*
const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [
        targetedEffect(
            target => removeToken(target, 'decay'),
            'Remove a decay token from a card.',
            s => s.hand.concat(s.play).concat(s.discard)
                       .filter(c => c.count('decay') > 0)
        )
    ],
    staticTriggers: [{
        text: `Whenever you move a card to your hand,
            if it has two or more decay tokens on it trash it,
            otherwise put a decay token on it.`,
        kind: 'move',
        handles: e => e.toZone == 'hand',
        transform: e => (e.card.count('decay') >= 2) ?
            trash(e.card) : addToken(e.card, 'decay')
    }]
}
events.push(decay)
*/
/*
const decay:CardSpec = {name: 'Decay',
    fixedCost: coin(1),
    effects: [chargeEffect()],
    staticTriggers: [{
        text: `When you play a card from your hand,
            remove a charge token from this.
            If you can't, put a decay token on the card.`,
        kind: 'play',
        handles: function (e) {
          const place =  e.card.place
          return place == 'hand'
        },
        transform: (e, s, c) => payToDo(discharge(c, 1), noop, addToken(e.card, 'decay'))
    }],
    staticReplacers: [{
        text: `Whenever a card with two or more decay tokens would move to your hand or discard,
               trash it instead.`,
        kind: 'move',
        handles: (p, state) => state.find(p.card).count('decay') > 1
            && (p.toZone == 'hand' || p.toZone == 'discard'),
        replace: p => ({...p, toZone: 'void'})
    }]
}
events.push(decay)
*/
var decay = {
    name: 'Decay',
    restrictions: [cannotUse],
    staticTriggers: [{
            text: "When you play a card with fewer than two decay tokens on it the normal way, put a decay token on it.",
            kind: 'play',
            handles: function (e) { return e.card.count('decay') < 2 && e.source == 'act'; },
            transform: function (e, s, c) { return addToken(e.card, 'decay'); },
        }],
    staticReplacers: [{
            kind: 'costIncrease',
            text: "Cards with two or more decay tokens on them cost an additional $1 to play,",
            handles: function (e) { return e.actionKind == 'play' && e.card.count('decay') >= 2; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }]
};
// events.push(decay) // removed (curse)
var reflect = { name: 'Reflect',
    simpleText: "Put a reflect token on a card in your hand. The next time you play that card, play it twice. This costs $1 more each time you use it.",
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })],
    effects: [incrementCost(), targetedEffect(function (target, card) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand', function (state) { return state.hand; })],
    rules: [reflectRule], };
events.push(reflect);
var replicate = { name: 'Replicate',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    simpleText: "The next time you buy a card, buy it again.",
    staticTriggers: [{
            text: "After buying a card other than with this,\n            remove a charge token from this to to buy the card again.",
            kind: 'afterBuy',
            handles: function (e, s, c) { return s.find(c).charge > 0 && !sourceHasName(e.source, c.name); },
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
    fixedCost: energy(5),
    effects: [{
            text: ["Lose all $ and buys."],
            transform: function (s, c) { return doAll([setResource('coin', 0, c), setResource('buys', 0, c)]); }
        }, {
            text: ['+$15, +5 buys.'],
            transform: function (s, c) { return doAll([gainCoins(15, c), gainBuys(5, c)]); }
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
    fixedCost: energy(1),
    effects: [{
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
// events.push(burden) // removed (curse)
/*
const goldsmith:CardSpec = {name: 'Goldsmith',
    fixedCost: energy(1),
    effects: [actionsEffect(3), coinsEffect(3)]
}
buyable(goldsmith, 7)
*/
var procession = { name: 'Procession',
    fixedCost: energy(1),
    effects: [{
            text: ["Pay one action to play a card in your hand twice,\n                then trash it and create a copy of a card in the supply\n                costing exactly $1 or $2 more."],
            transform: function (state, card) { return payToDo(payAction(card), applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(function (target2) { return create(target2.spec); }, 'Choose a card to copy.', function (s) { return s.supply.filter(function (c) { return eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 1 })) || eq(c.cost('buy', s), addCosts(target.cost('buy', s), { coin: 2 })); }); })
            ]); }, 'Choose a card to play twice.', function (s) { return s.hand; })); }
        }]
};
cards.push(supplyForCard(procession, coin(3)));
var publicWorks = { name: 'Public Works',
    buyCost: coin(6),
    effects: [],
    replacers: [costReduceNext('use', { energy: 1 }, true)],
};
//cards.push(publicWorks)
function singleMap(s, t) {
    var result = new Map();
    result.set(s, t);
    return result;
}
var echo = { name: 'Echo',
    effects: [targetedEffect(function (target, card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                var copy;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, createAndTrack(target.spec, 'void', singleMap('echo', 1))(state)];
                        case 1:
                            _a = __read.apply(void 0, [_b.sent(), 2]), copy = _a[0], state = _a[1];
                            if (!(copy != null && state.find(copy).place == 'void')) return [3 /*break*/, 3];
                            return [4 /*yield*/, copy.play(card)(state)];
                        case 2:
                            state = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Choose a card you have in play.\n         Create a copy set aside with an echo token on it.\n         Then play the card if it is set aside.", function (state) { return dedupBy(state.play, function (c) { return c.spec; }); })]
};
// cards.push(supplyForCard(echo, coin(6), {replacers: [fragileEcho('echo')]})) // removed
/*
const tactic:CardSpec = {
    name: 'Tactic',
    ability:[{
        text: [`Trash this and pay an action
        to play a card from your hand three times.`],
        transform: (state, card) => payToDo(payCost({
            ...free, actions:1, effects:[trash(card)]
        }, card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card)
            ]),
            'Choose a card to play three times.',
            s => s.hand
        ))
    }],
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) => k == 'activate' && (s.actions < 1),
    }],
    replacers: [stayInPlay()]
}

const mastermind:CardSpec = {
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    replacers: [{
        text: `When you move this to your hand, create a ${tactic.name} in play.`,
        kind:'move',
        handles: (p, s, c) => p.toZone == 'hand' && p.card.id == c.id,
        replace: p => ({...p, effects: p.effects.concat([create(tactic, 'play')])})
    }],

}
cards.push(supplyForCard(mastermind, coin(6)))
*/
var tactic = {
    name: 'Tactic',
    ability: [{
            text: ["Remove a charge token from this, trash it, and pay an action\n        to play a card from your hand three times."],
            transform: function (state, card) { return payToDo(payCost(__assign(__assign({}, free), { actions: 1, effects: [discharge(card, 1), trash(card)] }), card), applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card)
            ]); }, 'Choose a card to play three times.', function (s) { return s.hand; })); }
        }],
    restrictions: [{
            test: function (c, s, k) { return k == 'activate' && ((s.actions < 1) || c.charge == 0); },
        }],
    replacers: [{
            text: "Whenever you would move this to your hand,\n               instead put a charge token on this.",
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.toZone == 'hand' && p.skip == false; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([
                    charge(c, 1),
                ]) })); }
        }]
};
var mastermind = {
    simpleText: "Create a ".concat(tactic.name, " in play. Whenever it would move to your hand it gains a charge token instead. Once it has a charge token, you can trash it and pay an action to play a card in your hand three times."),
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    effects: [createInPlayEffect(tactic)]
};
cards.push(supplyForCard(mastermind, coin(6)));
var recruitment = {
    name: 'Recruitment',
    relatedCards: [villager, fair],
    effects: [actionsEffect(1)],
    triggers: [{
            text: "Whenever you pay @,\n               create that many ".concat(villager.name, "s and ").concat(fair.name, "s in play."),
            kind: 'cost',
            handles: function (e, state, card) { return e.cost.energy > 0; },
            transform: function (e, state, card) { return doAll([villager, fair].map(function (c) { return repeat(create(c, 'play'), e.cost.energy); })); }
        }]
};
cards.push(supplyForCard(recruitment, coin(3)));
var dragon = { name: 'Dragon',
    buyCost: coin(7),
    effects: [targetedEffect(function (c) { return trash(c); }, 'Trash a card in your hand.', function (s) { return s.hand; }),
        coinsEffect(4), actionsEffect(4), buyEffect()]
};
var hatchery = { name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon],
    effects: [actionsEffect(1), {
            text: ["If this has two charge tokens, remove one and\n                create ".concat(a(dragon.name), " in your hand.\n                Otherwise, put a charge token on this.")],
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
cards.push(supplyForCard(hatchery, coin(4)));
var looter = { name: 'Looter',
    relatedCards: [villager],
    effects: [{
            text: ["Discard any number of cards from your hand for +1 action each."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to discard', state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'discard')(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, gainActions(targets.length, card)(state)];
                            case 3:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, {
            text: ["Trash any number of cards from your discard, and create a ".concat(villager.name, " in play for each.")],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, i;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Choose any number of cards to trash', state.discard.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'void')(state)];
                            case 2:
                                state = _b.sent();
                                i = 0;
                                _b.label = 3;
                            case 3:
                                if (!(i < targets.length)) return [3 /*break*/, 6];
                                return [4 /*yield*/, create(villager, 'play')(state)];
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
            }; }
        }]
};
cards.push(supplyForCard(looter, coin(4)));
var palace = { name: 'Palace',
    fixedCost: energy(1),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
};
// cards.push(supplyForCard(palace, coin(5))) // removed (vp)
var Innovation = 'Innovation';
var innovation = { name: Innovation,
    simpleText: "The next time you create a card in your discard, play it immediately.",
    effects: [actionsEffect(1)],
    replacers: [playReplacer("Whenever you would create a card in your discard,\n        instead discard this to set the card aside.\n        Then play it if it is still set aside.", function (p, s, c) { return s.find(c).place == 'play'; }, function (p, s, c) { return discardFromPlay(c); })]
};
cards.push(supplyForCard(innovation, coin(3)));
var formation = { name: 'Formation',
    effects: [],
    replacers: [{
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
                        gainActions(2, card),
                    ]);
                    return __assign(__assign({}, x), { cost: newCost });
                }
                else {
                    return x;
                }
            }
        }]
};
cards.push(supplyForCard(formation, coin(3)));
var Traveler = 'Traveler';
var traveler = {
    simpleText: "Pay an action to play a card in your hand once for each charge token on this. It starts with 1 charge token and gains 1 each time you play it, up to 3.",
    name: 'Traveler',
    fixedCost: energy(1),
    effects: [{
            text: ["Pay an action to play a card in your hand once for each charge token on this."],
            transform: function (state, card) { return payToDo(payAction(card), applyToTarget(function (target) { return function (state) {
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
            }; }, "Choose a card to play with ".concat(Traveler, "."), function (s) { return s.hand; })); }
        }, chargeUpTo(3)]
};
cards.push(supplyForCard(traveler, coin(6), { replacers: [startsWithCharge(traveler.name, 1)] }));
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
    simpleText: "Choose a card in the supply and put 8 art tokens on it. Whenever you play a card with art tokens on its supply, remove art tokens instead of paying @.",
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    name: 'Lost Arts',
    effects: [targetedEffect(function (card) { return function (state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, addToken(card, 'art', 8)(state)];
                        case 1:
                            state = _a.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        }; }, "Put eight art tokens on a card in the supply.", function (s) { return s.supply; })],
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
    effects: [actionsEffect(1), coinsEffect(2), buysEffect(2)],
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
function industryTransform(n, except, source) {
    if (except === void 0) { except = Industry; }
    return applyToTarget(function (target) { return target.buy(source); }, "Buy a card in the supply costing up to $".concat(n, " not named ").concat(except, "."), function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(n)) && x.name != except; }); });
}
var industry = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
            text: ["Do this twice: buy a card in the supply costing up to $8 other than ".concat(Industry, ".")],
            transform: function (state, card) { return doAll([
                industryTransform(8, Industry, card),
                tick(card),
                industryTransform(8, Industry, card)
            ]); }
        }]
};
cards.push(supplyForCard(industry, coin(6)));
var homesteading = {
    name: 'Homesteading',
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager],
    triggers: [{
            text: "Whenever you play ".concat(a(estate.name), " or ").concat(duchy.name, ",\n               create ").concat(a(villager.name), " in play."),
            kind: 'play',
            handles: function (e, state, card) { return e.card.name == estate.name
                || e.card.name == duchy.name; },
            transform: function (e, state, card) { return create(villager, 'play'); }
        }],
};
// cards.push(supplyForCard(homesteading, coin(3))) // removed
var duke = {
    name: 'Duke',
    buyCost: coin(4),
    effects: [],
    triggers: [{
            text: "Whenever you play ".concat(a(duchy.name), ", +1 vp."),
            kind: 'play',
            handles: function (e) { return e.card.name == duchy.name; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
// cards.push(supplyForCard(duke, coin(4))) // removed (vp)
var carpenter = {
    name: 'Carpenter',
    fixedCost: energy(1),
    effects: [buyEffect(), {
            text: ["+1 action per card in play."],
            transform: function (state, card) { return gainActions(state.play.length, card); }
        }]
};
// cards.push(supplyForCard(carpenter, coin(4))) // removed
var artificer = {
    name: 'Artificer',
    effects: [{
            text: ["Discard any number of cards.", "Choose a card in the supply costing $1 per card you discarded,\n        and create a copy in your hand."],
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
                                return [4 /*yield*/, choice(state, "Choose a card costing $".concat(n, " to gain a copy of."), state.supply.filter(function (c) { return c.cost('buy', state).coin == n; }).map(asChoice))];
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
/*
const banquet:CardSpec = {
    name: 'Banquet',
    restrictions: [{
        test: (c:Card, s:State, k:ActionKind) =>
            k == 'activate' &&
            s.hand.some(c => c.count('neglect') > 0)
    }],
    effects: [coinsEffect(3), {
        text: ['Put a neglect token on each card in your hand.'],
        transform: state => doAll(state.hand.map(c => addToken(c, 'neglect'))),
    }],
    triggers: [{
        text: `Whenever a card moves, remove all neglect tokens from it.`,
        kind: 'move',
        handles: p => p.fromZone != p.toZone,
        transform: p => removeToken(p.card, 'neglect', 'all')

    }],
    replacers: [{
        text: `Whenever you'd move this to your hand, instead leave it in play.`,
        kind: 'move',
        handles: (p, state, card) => p.card.id == card.id && p.toZone == 'hand',
        replace: (p, state, card) => ({...p, skip:true})
    }],
    ability:[{
        text: [`If you have no cards in your hand with neglect tokens on them,
        discard this for +$3.`],
        transform: (state, card) => payToDo(discardFromPlay(card), gainCoins(3))
    }]
}
cards.push(supplyForCard(banquet, coin(4)))
*/
var banquet = {
    name: 'Banquet',
    buyCost: coin(3),
    restrictions: [{
            test: function (c, s, k) { return k == 'activate' && s.hand.length > 0; }
        }],
    effects: [{
            text: ["If you have three or more cards in your hand, +$3."],
            transform: function (state, c) { return (state.hand.length >= 3) ? gainCoins(3, c) : noop; }
        }],
    replacers: [{
            text: "Whenever you'd move this to your hand, instead leave it in play.",
            kind: 'move',
            handles: function (p, state, card) { return p.card.id == card.id && p.toZone == 'hand'; },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { skip: true })); }
        }],
    ability: [{
            text: ["If you have no cards in your hand, discard this for +$3."],
            transform: function (state, card) { return payToDo(discardFromPlay(card), gainCoins(3, card)); }
        }]
};
cards.push(banquet);
var harvest = {
    name: 'Harvest',
    effects: [{
            text: ["+1 action for each differently-named card in your hand."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = countDistinctNames(state.hand);
                                return [4 /*yield*/, gainActions(n, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, {
            text: ["+$1 for each differently-named card in your discard."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = countDistinctNames(state.discard);
                                return [4 /*yield*/, gainCoins(n, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(supplyForCard(harvest, coin(4)));
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
    effects: [{
            text: ["Discard any number of cards from your hand for +$1 each."],
            transform: function (s, card) { return function (state) {
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
                                return [4 /*yield*/, gainCoins(targets.length, card)(state)];
                            case 3:
                                state = _b.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, {
            text: ["Trash any number of cards from your discard for +1 buy each."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, multichoice(state, 'Trash any number of cards for +1 buy each.', state.discard.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                                return [4 /*yield*/, moveMany(targets, 'void')(state)];
                            case 2:
                                state = _b.sent();
                                return [4 /*yield*/, gainBuys(targets.length, card)(state)];
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
    relatedCards: [fair, villager],
    effects: [],
    replacers: [{
            text: "Whenever you would move this to your hand,\n               instead +1 action, +1 buy, +$1, and create a ".concat(fair.name, " and a ").concat(villager.name, " in play."),
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.toZone == 'hand' && p.skip == false; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([
                    gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play'), create(villager, 'play')
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
cards.push(supplyForCard(haggler, coin(3), {
    triggers: [{
            text: "After buying a card the normal way,\n        buy an additional card for each ".concat(haggler.name, " in play.\n        Each card you buy this way must cost at least $1 less than the previous one."),
            kind: 'afterBuy',
            handles: function (p) { return p.source == 'act'; },
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
    simpleText: "Play any number of cards in your discard that don't have a reuse token on them. Put a reuse token on each card played this way.",
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
                                                id_3 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_3; });
                                                _c.label = 5;
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
// events.push(reuse) // removed (boon)
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
            transform: function (e, s, c) { return doAll([removeToken(e.card, 'polish'), gainCoins(1, c)]); }
        }]
};
events.push(polish);
var mire = {
    name: 'Mire',
    fixedCost: energy(3),
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
// events.push(mire) // removed (curse)
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
    rules: [echoRule],
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
                payToDo(discharge(card, 2), gainPoints(1, card))
            ]); }
        }]
};
// cards.push(supplyForCard(turnpike, coin(5))) // removed
var highway = {
    name: 'Highway',
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', { coin: 1 }, true)],
};
cards.push(supplyForCard(highway, coin(5), { replacers: [{
            text: "Whenever you would create a ".concat(highway.name, " in your discard,\n    instead create it in play."),
            kind: 'create',
            handles: function (p) { return p.spec.name == highway.name && p.zone == 'discard'; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }] }));
var prioritize = {
    simpleText: "Choose a supply. The next 5 times you create a card from that supply, play it immediately.",
    name: 'Prioritize',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 5); }, 'Put five priority tokens on a card in the supply.', function (state) { return state.supply; })],
    rules: [priorityRule],
};
// events.push(prioritize) // removed (boon)
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
// cards.push(supplyForCard(composting, coin(3))) // removed
var FairyGold = 'Fairy Gold';
var fairyGold = {
    simpleText: "+$3 and +1 buy. This decreases by $1 each time you play it.",
    name: FairyGold,
    effects: [buyEffect(), {
            text: ["+$1 per charge token on this."],
            transform: function (state, card) { return gainCoins(state.find(card).charge, card); },
        }, {
            text: ["Remove a charge token from this. Then if it has no charge tokens, trash it."],
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
                            case 2:
                                if (!(state.find(card).charge == 0)) return [3 /*break*/, 4];
                                return [4 /*yield*/, trash(card)(state)];
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
    effects: [targetedEffect(function (target) { return addToken(target, 'pathfinding'); }, "Put a pathfinding token on a card in the supply other than Copper.", function (state) { return state.supply.filter(function (target) { return target.name != copper.name; }); })],
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a card whose supply\n        has a  pathfinding token on it, +1 action.",
            handles: function (e, state) { return nameHasToken(e.card, 'pathfinding', state); },
            transform: function (e, state, card) { return gainActions(1, card); }
        }]
};
// events.push(pathfinding) // removed
var fortuneName = 'Fortune';
var fortune = {
    simpleText: "Double your $ and buys. You can only buy Fortune once.",
    name: fortuneName,
    effects: [{
            text: ["Double your $."],
            transform: function (state, card) { return gainCoins(state.coin, card); }
        }, {
            text: ["Double your buys."],
            transform: function (state, card) { return gainBuys(state.buys, card); }
        }],
    staticTriggers: [{
            kind: 'create',
            text: "Whenever you create ".concat(a(fortuneName), ", trash this from the supply."),
            handles: function (e) { return e.card.name == fortuneName; },
            transform: function (e, s, c) { return trash(c); },
        }]
};
cards.push(supplyForCard(fortune, coin(12)));
//cards.push(supplyForCard(fortune, coin(12), {afterBuy: [{text: ['trash it from the supply.'], transform: (s, c) => trash(c)}]}))
// ========== CARDS MOVED FROM EXPANSION ==========
var horse = {
    name: 'Horse',
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
};
var ferry = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(function (target) { return addToken(target, 'ferry'); }, 'Put a ferry token on a supply.', function (state) { return state.supply; })],
    rules: [ferryRule],
};
cards.push(ferry);
var develop = {
    name: 'Develop',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
            text: ["Trash a card in your hand.", "Choose a card in the supply costing $1 or $2 less and create a copy in your hand.", "Choose a card in the supply costing $1 or $2 more and create a copy in your hand."],
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
cards.push(develop);
var logisticsToken = 'logistics';
var logistics = {
    name: 'Logistics',
    buyCost: coin(6),
    fixedCost: energy(1),
    effects: [{
            text: ["Put a ".concat(logisticsToken, " token on each supply.")],
            transform: function (s) { return doAll(s.events.map(function (e) { return addToken(e, 'logistics'); })); }
        }],
    staticReplacers: [{
            text: "Events cost @ less for each logistics token on them but not zero. Whenever this reduces a cost, remove a logistics token.",
            kind: 'cost',
            handles: function (p) { return (p.actionKind == 'use' && p.card.count('logistics') > 0); },
            replace: function (p, state) {
                var card = state.find(p.card);
                var maxReduction = (p.cost.coin > 0) ? p.cost.energy : p.cost.energy - 1;
                var reduction = Math.max(Math.min(maxReduction, card.count('logistics')), 0);
                return __assign(__assign({}, p), { cost: __assign(__assign({}, p.cost), { energy: p.cost.energy - reduction, effects: p.cost.effects.concat([removeToken(card, 'logistics', reduction)]) }) });
            }
        }]
};
cards.push(logistics);
var harrowName = 'Harrow';
var harrow = {
    name: harrowName,
    buyCost: coin(4),
    effects: [{
            text: ["Discard any number of cards from your hand, then put that many non-".concat(harrowName, " cards from your discard into your hand.")],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, n, targets;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, multichoice(state, "Discard any number of cards.", state.hand.map(asChoice))];
                            case 1:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                                n = cards.length;
                                return [4 /*yield*/, moveMany(cards, 'discard')(state)];
                            case 2:
                                state = _c.sent();
                                return [4 /*yield*/, multichoice(state, "Choose ".concat(n, " cards to put into your hand."), state.discard.filter(function (c) { return c.name != harrowName; }).map(asChoice), n, n)];
                            case 3:
                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], targets = _b[1];
                                return [4 /*yield*/, moveMany(targets, 'hand')(state)];
                            case 4:
                                state = _c.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(harrow);
var tavern = {
    name: 'Tavern',
    buyCost: coin(3),
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
};
cards.push(tavern);
var metalworker = {
    name: 'Metalworker',
    buyCost: coin(3),
    effects: [actionsEffect(1)],
    triggers: [{
            kind: 'play',
            text: "When you play a ".concat(silver.name, ", +1 action."),
            handles: function (e) { return e.card.name == silver.name; },
            transform: function (e, s, c) { return gainActions(1, c); },
        }, {
            kind: 'play',
            text: "When you play a ".concat(gold.name, ", +1 buy."),
            handles: function (e) { return e.card.name == gold.name; },
            transform: function (e, s, c) { return doAll([gainBuys(1, c)]); },
        }]
};
cards.push(metalworker);
var exoticMarket = {
    name: 'Exotic Market',
    buyCost: coin(4),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
};
cards.push(exoticMarket);
var queensCourt = {
    name: "Queen's Court",
    buyCost: coin(9),
    fixedCost: energy(2),
    effects: [{
            text: ["Do this three times: pay an action to play a card in your hand twice."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 3)) return [3 /*break*/, 4];
                                return [4 /*yield*/, payToDo(payAction(card), applyToTarget(function (target) { return doAll([
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
cards.push(queensCourt);
var sculpt = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(function (target) { return doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]); }, 'Discard a card in your hand to create two copies of it in your discard.', function (state) { return state.hand; })]
};
cards.push(sculpt);
var tapestry = {
    name: 'Tapestry',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)]
};
cards.push(tapestry);
var silverMine = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
};
cards.push(silverMine);
var livery = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(3)],
    triggers: [{
            kind: 'afterBuy',
            text: "After buying a card costing $3 or more, create ".concat(aOrNum(2, horse.name), " in your discard."),
            handles: function (e, s) { return e.card.cost('buy', s).coin >= 3; },
            transform: function () { return repeat(create(horse, 'discard'), 2); }
        }]
};
cards.push(livery);
var stables = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [createEffect(horse, 'discard', 2)]
};
cards.push(supplyForCard(stables, coin(2), { onBuy: [{
            text: ["Pay all actions to create that many ".concat(horse.name, "s in your discard.")],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.actions;
                                return [4 /*yield*/, payCost(__assign(__assign({}, free), { actions: n }), c)(state)];
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
        }] }));
var ritual = {
    name: 'Ritual',
    buyCost: coin(4),
    effects: [{
            text: ["Play then trash two cards from your hand.", "If you do, choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target1, target2, cost, _a, _b, target;
                    var _c, _d, e_3, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0: return [4 /*yield*/, choice(state, 'Choose a card to play then trash.', state.hand.map(asChoice))];
                            case 1:
                                _c = __read.apply(void 0, [_f.sent(), 2]), state = _c[0], target1 = _c[1];
                                if (target1 == null)
                                    return [2 /*return*/, state];
                                return [4 /*yield*/, target1.play(card)(state)];
                            case 2:
                                state = _f.sent();
                                return [4 /*yield*/, trash(target1)(state)];
                            case 3:
                                state = _f.sent();
                                return [4 /*yield*/, choice(state, "Choose a second card to play then trash (".concat(renderCostOrZero(target1.cost('buy', state)), " so far)"), state.hand.map(asChoice))];
                            case 4:
                                _d = __read.apply(void 0, [_f.sent(), 2]), state = _d[0], target2 = _d[1];
                                if (target2 == null)
                                    return [2 /*return*/, state];
                                return [4 /*yield*/, target2.play(card)(state)];
                            case 5:
                                state = _f.sent();
                                return [4 /*yield*/, trash(target2)(state)];
                            case 6:
                                state = _f.sent();
                                cost = __assign(__assign({}, free), { buys: 1 });
                                try {
                                    for (_a = __values([target1, target2]), _b = _a.next(); !_b.done; _b = _a.next()) {
                                        target = _b.value;
                                        cost = addCosts(cost, target.cost('buy', state));
                                    }
                                }
                                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                    }
                                    finally { if (e_3) throw e_3.error; }
                                }
                                return [4 /*yield*/, applyToTarget(function (copyTarget) { return create(copyTarget.spec, 'discard'); }, 'Choose a card to copy.', function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', state), cost); }); })(state)];
                            case 7:
                                state = _f.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(ritual);
var scepter = {
    name: 'Scepter',
    fixedCost: energy(2),
    buyCost: coin(7),
    effects: [{
            text: ["Pay an action to play a card in your hand three times then trash it."],
            transform: function (state, card) { return payToDo(payAction(card), applyToTarget(function (target) { return doAll([
                target.play(card),
                tick(card),
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
            ]); }, 'Choose a card to play three times.', function (s) { return s.hand; })); }
        }]
};
cards.push(scepter);
var inn = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
};
cards.push(supplyForCard(inn, coin(4), { afterBuy: [createEffect(horse, 'discard', 3)] }));
// ========== EVENTS MOVED FROM EXPANSION ==========
var festival = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 2)],
    relatedCards: [fair]
};
events.push(festival);
function buyCheaper(card, s, source) {
    return applyToTarget(function (target) { return target.buy(source); }, 'Choose a card to buy.', function (state) { return state.supply.filter(function (target) { return leq(addCosts(target.cost('buy', state), coin(1)), card.cost('buy', state)); }); });
}
var haggle = {
    name: 'Haggle',
    simpleText: "The next time you buy a card, immediately buy a cheaper card.",
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
            kind: 'afterBuy',
            text: "After buying a card, remove a charge token from this to buy a card\n        in the supply that costs at least $1 less.",
            handles: function (e, s, c) { return c.charge > 0; },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), buyCheaper(e.card, s, c)); },
        }]
};
events.push(haggle);
var ride = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards: [horse],
    effects: [createEffect(horse)]
};
events.push(ride);
var redouble = {
    name: 'Redouble',
    fixedCost: energy(2),
    effects: [targetedEffect(function (target) { return create(target.spec, 'hand'); }, 'Choose a card in your discard. Create a copy in your hand.', function (state) { return state.discard; })],
};
events.push(redouble);
var splay = {
    name: 'Splay',
    fixedCost: __assign(__assign({}, free), { energy: 1 }),
    effects: [{
            text: ["Put a splay token on each supply."],
            transform: function (s) { return doAll(s.supply.map(function (c) { return addToken(c, 'splay'); })); }
        }],
    simpleText: "Put a splay token on each supply. Whenever you play a card with a splay token on its supply, remove splay tokens instead of paying @.",
    staticReplacers: [{
            text: "Cards you play cost @ less for each splay token on their supply.\n               Whenever this reduces a card's cost by one or more @,\n               remove that many splay tokens from its supply.",
            kind: 'cost',
            handles: function (x, state, card) { return (x.actionKind == 'play')
                && nameHasToken(x.card, 'splay', state); },
            replace: function (x, state, card) {
                card = state.find(card);
                var reduction = Math.min(x.cost.energy, countNameTokens(x.card, 'splay', state));
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([repeat(applyToTarget(function (target) { return removeToken(target, 'splay'); }, 'Remove a splay token from a supply.', function (state) { return state.supply.filter(function (c) { return c.name == x.card.name && c.count('splay') > 0; }); }), reduction)]) }) });
            }
        }]
};
events.push(splay);
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
var recover = {
    name: 'Recover',
    simpleText: "Put up to two cards from your discard into your hand. This costs $1 more each time you use it.",
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(function (targets) { return moveMany(targets, 'hand'); }, 'Put up to 2 cards from your discard into your hand.', function (state) { return state.discard; }, 2), incrementCost()]
};
events.push(recover);
var regroup = {
    name: 'Regroup',
    fixedCost: energy(2),
    restrictions: [{
            text: 'You must have at most 5 cards in your discard.',
            test: function (c, s, k) { return s.discard.length > 5; },
        }],
    effects: [actionsEffect(2), buysEffect(1), recycleEffect()],
};
events.push(regroup);
var summon = {
    name: 'Summon',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [multitargetedEffect(function (targets, card) { return doAll(targets.map(function (target) {
            return create(target.spec, 'hand', function (c) { return addToken(c, 'echo'); });
        })); }, "Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.", function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', s), coin(6)); }); }, 3)],
    rules: [echoRule],
};
events.push(summon);
var reprise = {
    name: 'Reprise',
    fixedCost: energy(1),
    effects: [{
            text: ["Put each card in your discard into your hand with an echo token on it."],
            transform: function (state) { return doAll(state.discard.map(function (c) { return doAll([move(c, 'hand'), addToken(c, 'echo')]); })); }
        }],
    rules: [echoRule],
};
events.push(reprise);
var accelerate = {
    name: 'Accelerate',
    simpleText: "Put a priority token on each card in the supply. Whenever you create a card with a priority token on it, remove the token to play the card immediately.",
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 4 }),
    effects: [{
            text: ["Put a priority token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'priority'); })); }
        }],
    rules: [priorityRule],
};
events.push(accelerate);
var swap = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [targetedEffect(function (target) { return doAll([trash(target), applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, "Choose a card to copy.", function (state) { return state.supply.filter(function (sup) { return leq(sup.cost('buy', state), target.cost('buy', state)); }); })]); }, "Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.", function (state) { return state.hand; })],
};
events.push(swap);
var hallOfEchoes = {
    name: 'Hall of Echoes',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }],
    rules: [echoRule],
};
events.push(hallOfEchoes);
// More cards from expansion.ts
function magpieEffect() {
    return {
        text: ["Create a copy of this in your discard."],
        transform: function (s, c) { return create(c.spec); }
    };
}
var magpie = {
    name: 'Magpie',
    buyCost: coin(4),
    effects: [coinsEffect(2), magpieEffect()]
};
cards.push(magpie);
var crown = {
    name: 'Crown',
    simpleText: "Put a reflect token on a card in your hand. The next time you play it, play it again.",
    buyCost: coin(3),
    effects: [targetedEffect(function (target) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand.', function (s) { return s.hand; })],
    rules: [reflectRule],
};
cards.push(crown);
var churnName = 'Churn';
var churn = {
    name: churnName,
    simpleText: "Put two non-".concat(churnName, " cards from your discard to your hand. This decreases by 1 each time you play it."),
    effects: [actionsEffect(1), {
            text: ["For each charge token on this put a non-".concat(churnName, " card from your discard into your hand.")],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, cards;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = state.find(card).charge;
                                return [4 /*yield*/, multichoice(state, "Choose ".concat(num(n, 'card'), " cards to put into your hand."), state.discard.filter(function (c) { return c.name != churnName; }).map(asChoice), n)];
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
            text: ["Remove a charge token from this. Then if it has no charge tokens, trash it."],
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
                            case 2:
                                if (!(state.find(card).charge == 0)) return [3 /*break*/, 4];
                                return [4 /*yield*/, trash(card)(state)];
                            case 3:
                                state = _a.sent();
                                _a.label = 4;
                            case 4: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(supplyForCard(churn, coin(4), {
    replacers: [startsWithCharge(churn.name, 2)]
}));
var bustlingVillage = {
    name: 'Bustling Village',
    buyCost: coin(3),
    effects: [{
            text: ["+1 action for each card in play."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.play.length;
                                return [4 /*yield*/, gainActions(n, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(bustlingVillage);
var governorName = 'Governor';
var governor = {
    name: governorName,
    buyCost: coin(6),
    relatedCards: [villager],
    effects: [actionsEffect(2), buysEffect(1), createInPlayEffect(villager)],
    staticTriggers: [{
            kind: 'buy',
            handles: function (e) { return (e.card.name == gold.name); },
            text: "Whenever you buy a ".concat(gold.name, ", put all ").concat(governorName, "s in your discard into your hand."),
            transform: function (e, s) { return moveMany(s.discard.filter(function (card) { return card.name == governorName; }), 'hand'); }
        }]
};
cards.push(governor);
var marketSquare = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
};
cards.push(supplyForCard(marketSquare, coin(2), { afterBuy: [createInPlayEffect(fair, 2)] }));
var greatFeastName = 'Great Feast';
var greatFeast = {
    name: greatFeastName,
    buyCost: coin(8),
    effects: [{
            text: ["Do this three times: buy a card in the supply costing up to $8 other than ".concat(greatFeastName)],
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
                                return [4 /*yield*/, applyToTarget(function (target) { return target.buy(card); }, "Buy a card in the supply costing up to $8 other than ".concat(greatFeastName, "."), function (s) { return s.supply.filter(function (x) { return leq(x.cost('buy', s), coin(8)) && x.name != greatFeastName; }); })(state)];
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
cards.push(greatFeast);
var universityName = 'University';
var university = {
    name: universityName,
    buyCost: coin(12),
    relatedCards: [villager],
    effects: [actionsEffect(4), buysEffect(2), createInPlayEffect(villager)],
    staticReplacers: [{
            text: "".concat(universityName, " costs $1 less per action you have, but not less than $1."),
            kind: 'cost',
            handles: function (p) { return (p.card.name == universityName) && p.actionKind == 'buy'; },
            replace: function (p, s) {
                var k = Math.max(Math.min(s.actions, p.cost.coin - 1), 0);
                return __assign(__assign({}, p), { cost: addCosts(p.cost, { coin: -k }) });
            }
        }]
};
cards.push(university);
var moon = {
    name: 'Moon',
    replacers: [{
            text: "Whenever you would move this from play and this has no charge tokens on it,\n               instead put a charge token on it (it becomes full).",
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.skip == false && c.charge == 0; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([charge(c)]) })); }
        }, {
            text: "Whenever you would move this from play and this has at least one charge token on it,\n               instead remove all charge tokens from it (it becomes empty).",
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.skip == false && c.charge > 0; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([discharge(c, c.charge)]) })); }
        }]
};
var werewolf = {
    simpleText: "+3 actions. If there is a full moon, instead +$3 and +1 buy. The moon starts off empty and switches between full and empty each time it would move to your hand.",
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
            text: ["If there is no ".concat(moon.name, " in play, create one.")],
            transform: function (s) { return (s.play.some(function (c) { return c.name == moon.name; })) ? noop : create(moon, 'play'); },
        }, {
            text: ["If a ".concat(moon.name, " in play has an odd number of charge tokens (moon is full), +$3 and +1 buy."), "Otherwise, +3 actions."],
            transform: function (s, c) { return (s.play.some(function (c) { return c.name == moon.name && c.charge % 2 == 1; })) ?
                doAll([gainCoins(3, c), gainBuys(1, c)]) :
                gainActions(3, c); }
        }]
};
cards.push(werewolf);
var embargo = {
    name: 'Embargo',
    replacers: [{
            text: "Cards cost $1 more to buy.",
            kind: 'costIncrease',
            handles: function (p) { return p.actionKind == 'buy'; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }, {
            text: "Events costing at least $1 cost an additional $1 to buy.",
            kind: 'costIncrease',
            handles: function (p) { return p.actionKind == 'use' && p.cost.coin > 0; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }, trashOnLeavePlay()]
};
var contraband = {
    name: 'Contraband',
    buyCost: coin(4),
    simpleText: "+$5 and +5 buys. Create an Embargo in play that increases the cost of cards and events by $1 until it leaves play.",
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo],
};
cards.push(contraband);
var bulkOrder = {
    name: 'Bulk Order',
    fixedCost: coin(3),
    effects: [targetedEffect(function (card) { return addToken(card, 'bulk', 5); }, 'Put five bulk tokens on a card in the supply.', function (state) { return state.supply; })],
    staticTriggers: [{
            text: "After buying a card with a bulk token on it other than with this,\n        remove a bulk token from it to buy it again.",
            kind: 'afterBuy',
            handles: function (e, state, card) {
                if (sourceHasName(e.source, card.name))
                    return false;
                var target = state.find(e.card);
                return target.count('bulk') > 0;
            },
            transform: function (e, state, card) {
                return payToDo(removeToken(e.card, 'bulk'), e.card.buy(card));
            }
        }]
};
events.push(bulkOrder);
// ========== VP MODE EVENTS ==========
var thoroughfare = {
    name: 'Thoroughfare',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a card, +1 vp.",
            handles: function () { return true; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
var monument = {
    name: 'Monument',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'buy',
            text: "Whenever you buy a card costing $3 or more, +1 vp.",
            handles: function (e, state) {
                var cost = e.card.cost('buy', state);
                return cost.coin >= 3;
            },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
var capitalization = {
    name: 'Capitalization',
    fixedCost: coin(1),
    effects: [pointsEffect(1)]
};
// ========== VP MODES ==========
export var vpModes = [
    { name: 'Province', target: 30, cards: [province], events: [] },
    { name: 'Duchy', target: 30, cards: [duchy], events: [] },
    { name: 'Estate', target: 20, cards: [estate], events: [] },
    { name: 'Thoroughfare', target: 80, cards: [], events: [thoroughfare] },
    { name: 'Monument', target: 20, cards: [], events: [monument] },
    { name: 'Capitalization', target: 60, cards: [], events: [capitalization] },
    { name: 'Philanthropy', target: 40, cards: [], events: [philanthropy] },
    { name: 'Duke', target: 50, cards: [duchy, duke], events: [] },
    { name: 'Flower Market', target: 40, cards: [flowerMarket], events: [] },
    { name: 'Farmland', target: 40, cards: [farmland], events: [] },
    { name: 'Vibrant City', target: 40, cards: [vibrantCity], events: [] },
    { name: 'Palace', target: 40, cards: [palace], events: [] },
    { name: 'Territory', target: 40, cards: [territory], events: [] },
    { name: 'Frontier', target: 60, cards: [frontier], events: [] },
    { name: 'Gardens', target: 40, cards: [gardens], events: [] },
];
// ========== POTIONS ==========
export var potionOfActions = {
    name: 'Potion of Actions',
    isPotion: true,
    simpleText: '+10 actions.',
    effects: [actionsEffect(10)]
};
export var potionOfWealth = {
    name: 'Potion of Wealth',
    isPotion: true,
    simpleText: 'Double your money and buys.',
    effects: [{
            text: ['Double your $ and buys.'],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, gainCoins(state.coin, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainBuys(state.buys, card)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
export var potionOfCopper = {
    name: 'Potion of Copper',
    isPotion: true,
    simpleText: 'Create 5 coppers in your hand.',
    effects: [{
            text: ['Create 5 Coppers in your hand.'],
            transform: function () { return repeat(create(copper, 'hand'), 5); }
        }]
};
export var potionOfMining = {
    name: 'Potion of Mining',
    isPotion: true,
    simpleText: 'Trash coppers for silvers, silvers for golds.',
    relatedCards: [copper, silver, gold],
    effects: [{
            text: ['Trash any number of Coppers in your hand, and create that many Silvers in your discard.',
                'Trash any number of Silvers in your hand, and create that many Golds in your discard.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var coppers, coppersToTrash, coppersToTrash_1, coppersToTrash_1_1, c, e_4_1, silvers, silversToTrash, silversToTrash_1, silversToTrash_1_1, c, e_5_1;
                    var _a, e_4, _b, _c, e_5, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                coppers = state.hand.filter(function (c) { return c.name == 'Copper'; });
                                return [4 /*yield*/, multichoice(state, 'Choose Coppers to trash for Silvers.', coppers.map(asChoice), coppers.length)];
                            case 1:
                                _a = __read.apply(void 0, [_e.sent(), 2]), state = _a[0], coppersToTrash = _a[1];
                                _e.label = 2;
                            case 2:
                                _e.trys.push([2, 7, 8, 9]);
                                coppersToTrash_1 = __values(coppersToTrash), coppersToTrash_1_1 = coppersToTrash_1.next();
                                _e.label = 3;
                            case 3:
                                if (!!coppersToTrash_1_1.done) return [3 /*break*/, 6];
                                c = coppersToTrash_1_1.value;
                                return [4 /*yield*/, trash(c)(state)];
                            case 4:
                                state = _e.sent();
                                _e.label = 5;
                            case 5:
                                coppersToTrash_1_1 = coppersToTrash_1.next();
                                return [3 /*break*/, 3];
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                e_4_1 = _e.sent();
                                e_4 = { error: e_4_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (coppersToTrash_1_1 && !coppersToTrash_1_1.done && (_b = coppersToTrash_1.return)) _b.call(coppersToTrash_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                                return [7 /*endfinally*/];
                            case 9: return [4 /*yield*/, repeat(create(silver), coppersToTrash.length)(state)
                                // Trash silvers for golds
                            ];
                            case 10:
                                state = _e.sent();
                                silvers = state.hand.filter(function (c) { return c.name == 'Silver'; });
                                return [4 /*yield*/, multichoice(state, 'Choose Silvers to trash for Golds.', silvers.map(asChoice), silvers.length)];
                            case 11:
                                _c = __read.apply(void 0, [_e.sent(), 2]), state = _c[0], silversToTrash = _c[1];
                                _e.label = 12;
                            case 12:
                                _e.trys.push([12, 17, 18, 19]);
                                silversToTrash_1 = __values(silversToTrash), silversToTrash_1_1 = silversToTrash_1.next();
                                _e.label = 13;
                            case 13:
                                if (!!silversToTrash_1_1.done) return [3 /*break*/, 16];
                                c = silversToTrash_1_1.value;
                                return [4 /*yield*/, trash(c)(state)];
                            case 14:
                                state = _e.sent();
                                _e.label = 15;
                            case 15:
                                silversToTrash_1_1 = silversToTrash_1.next();
                                return [3 /*break*/, 13];
                            case 16: return [3 /*break*/, 19];
                            case 17:
                                e_5_1 = _e.sent();
                                e_5 = { error: e_5_1 };
                                return [3 /*break*/, 19];
                            case 18:
                                try {
                                    if (silversToTrash_1_1 && !silversToTrash_1_1.done && (_d = silversToTrash_1.return)) _d.call(silversToTrash_1);
                                }
                                finally { if (e_5) throw e_5.error; }
                                return [7 /*endfinally*/];
                            case 19: return [4 /*yield*/, repeat(create(gold), silversToTrash.length)(state)];
                            case 20:
                                state = _e.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
export var potionOfCelebration = {
    name: 'Potion of Celebration',
    isPotion: true,
    simpleText: 'Create a Celebration with an echo token in play.',
    relatedCards: [celebration],
    rules: [echoRule],
    effects: [{
            text: ['Create a Celebration with an echo token in play.'],
            transform: function () { return create(celebration, 'play', function (c) { return addToken(c, 'echo'); }); }
        }]
};
export var potionOfBounty = {
    name: 'Potion of Bounty',
    isPotion: true,
    simpleText: 'Create two Bounties in play.',
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty, 2)]
};
export var potionOfFerry = {
    name: 'Potion of Ferry',
    isPotion: true,
    simpleText: 'Put a ferry token on a supply. It costs $2 less.',
    rules: [ferryRule],
    effects: [targetedEffect(function (target) { return addToken(target, 'ferry', 2); }, 'Put two ferry tokens on a supply.', function (state) { return state.supply; })]
};
export var potionOfRecovery = {
    name: 'Potion of Recovery',
    isPotion: true,
    simpleText: 'Put your discard into your hand.',
    effects: [{
            text: ['Put your discard into your hand.'],
            transform: function (state) { return doAll([moveMany(state.discard, 'hand'), sortHand]); }
        }]
};
export var potionOfShelter = {
    name: 'Potion of Shelter',
    isPotion: true,
    simpleText: 'Create 3 Fairs and a Shelter in play.',
    relatedCards: [fair, shelter],
    effects: [
        createInPlayEffect(fair, 3),
        createInPlayEffect(shelter),
    ]
};
export var potionOfVitality = {
    name: 'Potion of Vitality',
    isPotion: true,
    simpleText: '+$1, +1 action, +1 buy, create a Fair and a Villager in play.',
    relatedCards: [fair, villager],
    effects: [
        coinsEffect(1),
        actionsEffect(1),
        buysEffect(1),
        createInPlayEffect(fair),
        createInPlayEffect(villager),
    ]
};
// Gain card potions
export var potionOfWorkshop = {
    name: 'Potion of Workshop',
    isPotion: true,
    simpleText: 'Create a Workshop in your hand.',
    relatedCards: [workshop],
    effects: [{
            text: ['Create a Workshop in your hand.'],
            transform: function () { return create(workshop, 'hand'); }
        }]
};
export var potionOfTavern = {
    name: 'Potion of Tavern',
    isPotion: true,
    simpleText: 'Create a Tavern in your hand.',
    relatedCards: [tavern],
    effects: [{
            text: ['Create a Tavern in your hand.'],
            transform: function () { return create(tavern, 'hand'); }
        }]
};
export var potionOfThroneRoom = {
    name: 'Potion of Throne Room',
    isPotion: true,
    simpleText: 'Create a Throne Room in your hand.',
    relatedCards: [throneRoom],
    effects: [{
            text: ['Create a Throne Room in your hand.'],
            transform: function () { return create(throneRoom, 'hand'); }
        }]
};
export var potionOfInnovation = {
    name: 'Potion of Innovation',
    isPotion: true,
    simpleText: 'Create an Innovation in your hand.',
    relatedCards: [innovation],
    effects: [{
            text: ['Create an Innovation in your hand.'],
            transform: function () { return create(innovation, 'hand'); }
        }]
};
export var potionOfTransmogrify = {
    name: 'Potion of Transmogrify',
    isPotion: true,
    simpleText: 'Create a Transmogrify in your hand.',
    relatedCards: [transmogrify],
    effects: [{
            text: ['Create a Transmogrify in your hand.'],
            transform: function () { return create(transmogrify, 'hand'); }
        }]
};
// Event effect potions
export var potionOfMirrors = {
    name: 'Potion of Mirrors',
    isPotion: true,
    simpleText: 'Put a reflect token on each card in your hand.',
    rules: [reflectRule],
    effects: [{
            text: ['Put a reflect token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'reflect'); }));
            }
        }]
};
export var potionOfEchoes = {
    name: 'Potion of Echoes',
    isPotion: true,
    simpleText: 'For each card in your hand without an echo token, create a copy with an echo token.',
    rules: [echoRule],
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }]
};
export var potionOfOnslaught = {
    name: 'Potion of Onslaught',
    isPotion: true,
    simpleText: 'Play any number of cards in your hand.',
    effects: [{
            text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_4, state_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.hand;
                                options = asNumberedChoices(cards);
                                _loop_4 = function () {
                                    var picked, id_4;
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to play next.', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2: return [4 /*yield*/, picked.play(card)(state)];
                                            case 3:
                                                state = _c.sent();
                                                id_4 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_4; });
                                                _c.label = 4;
                                            case 4: return [2 /*return*/];
                                        }
                                    });
                                };
                                _a.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 3];
                                return [5 /*yield**/, _loop_4()];
                            case 2:
                                state_4 = _a.sent();
                                if (typeof state_4 === "object")
                                    return [2 /*return*/, state_4.value];
                                return [3 /*break*/, 1];
                            case 3: return [2 /*return*/];
                        }
                    });
                });
            }; }
        }]
};
export var potionOfPriority = {
    name: 'Potion of Priority',
    isPotion: true,
    simpleText: 'Put five priority tokens on a supply. The next 5 times you create a card from it, play it immediately.',
    rules: [priorityRule],
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 5); }, 'Put five priority tokens on a card in the supply.', function (state) { return state.supply; })]
};
export var potionOfTwin = {
    name: 'Potion of Twin',
    isPotion: true,
    simpleText: 'Put a twin token on a card in your hand. Whenever you play it, play it again.',
    rules: [twinRule],
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })]
};
// All potions list for random selection
export var allPotions = [
    potionOfActions,
    potionOfWealth,
    potionOfCopper,
    potionOfMining,
    potionOfCelebration,
    potionOfBounty,
    potionOfFerry,
    potionOfRecovery,
    potionOfShelter,
    potionOfVitality,
    potionOfWorkshop,
    potionOfTavern,
    potionOfThroneRoom,
    potionOfInnovation,
    potionOfTransmogrify,
    potionOfMirrors,
    potionOfEchoes,
    potionOfOnslaught,
    potionOfPriority,
    potionOfTwin,
];
// Keep startingPotions for backwards compatibility but it won't be used
export var startingPotions = [];
//# sourceMappingURL=base.js.map