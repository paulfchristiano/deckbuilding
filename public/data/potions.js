// data/potions.ts - Potion definitions
// Potions are single-use items that persist across stages until used
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
import { gainCoins, gainBuys, create, trash, doAll, choice, asChoice, asNumberedChoices, allowNull, repeat, addToken, moveMany, actionsEffect, coinsEffect, buysEffect, buyEffect, createInPlayEffect, targetedEffect, copper, silver, gold, sortHand, echoRule, priorityRule, reflectRule, ferryRule, twinRule, 
// Card specs used by potions
fair, villager, move, trashOnLeavePlay, potionRewards, shelterRule, coin, addCosts, renderCost, leq } from '../gameLogic.js';
// Import cards that potions reference from base
import { celebration, innovation, } from './cards.js';
// ========== POTIONS ==========
export var potionOfActions = {
    name: 'Potion of Actions',
    isPotion: true,
    simpleText: ['+10 actions.'],
    effects: [actionsEffect(10)]
};
potionRewards.push(potionOfActions);
export var potionOfWealth = {
    name: 'Potion of Wealth',
    isPotion: true,
    simpleText: ['Double your money and buys.'],
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
potionRewards.push(potionOfWealth);
export var potionOfCopper = {
    name: 'Potion of Copper',
    isPotion: true,
    simpleText: ['Create 5 coppers in your hand.'],
    effects: [{
            text: ['Create 5 Coppers in your hand.'],
            transform: function () { return repeat(create(copper, 'hand'), 5); }
        }]
};
potionRewards.push(potionOfCopper);
export var potionOfMining = {
    name: 'Potion of Mining',
    isPotion: true,
    simpleText: ['Trash coppers for silvers, silvers for golds.'],
    relatedCards: [copper, silver, gold],
    effects: [{
            text: ['Trash all Coppers from your hand then create that many Silvers in your discard.',
                'Trash all Silvers from your hand then create that many Golds in your discard.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var coppers, coppers_1, coppers_1_1, c, e_1_1, silvers, silvers_1, silvers_1_1, c, e_2_1;
                    var e_1, _a, e_2, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                coppers = state.hand.filter(function (c) { return c.name == copper.name; });
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 7, 8, 9]);
                                coppers_1 = __values(coppers), coppers_1_1 = coppers_1.next();
                                _c.label = 2;
                            case 2:
                                if (!!coppers_1_1.done) return [3 /*break*/, 6];
                                c = coppers_1_1.value;
                                return [4 /*yield*/, trash(c)(state)];
                            case 3:
                                state = _c.sent();
                                return [4 /*yield*/, create(silver)(state)];
                            case 4:
                                state = _c.sent();
                                _c.label = 5;
                            case 5:
                                coppers_1_1 = coppers_1.next();
                                return [3 /*break*/, 2];
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                e_1_1 = _c.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (coppers_1_1 && !coppers_1_1.done && (_a = coppers_1.return)) _a.call(coppers_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 9:
                                silvers = state.hand.filter(function (c) { return c.name == silver.name; });
                                _c.label = 10;
                            case 10:
                                _c.trys.push([10, 16, 17, 18]);
                                silvers_1 = __values(silvers), silvers_1_1 = silvers_1.next();
                                _c.label = 11;
                            case 11:
                                if (!!silvers_1_1.done) return [3 /*break*/, 15];
                                c = silvers_1_1.value;
                                return [4 /*yield*/, trash(c)(state)];
                            case 12:
                                state = _c.sent();
                                return [4 /*yield*/, create(gold)(state)];
                            case 13:
                                state = _c.sent();
                                _c.label = 14;
                            case 14:
                                silvers_1_1 = silvers_1.next();
                                return [3 /*break*/, 11];
                            case 15: return [3 /*break*/, 18];
                            case 16:
                                e_2_1 = _c.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 18];
                            case 17:
                                try {
                                    if (silvers_1_1 && !silvers_1_1.done && (_b = silvers_1.return)) _b.call(silvers_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                                return [7 /*endfinally*/];
                            case 18: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
potionRewards.push(potionOfMining);
export var potionOfCelebration = {
    name: 'Potion of Celebration',
    isPotion: true,
    simpleText: ['Create a Celebration in play.'],
    relatedCards: [celebration],
    rules: [echoRule],
    effects: [{
            text: ['Create a Celebration with an echo token in play.'],
            transform: function () { return create(celebration, 'play'); }
        }]
};
potionRewards.push(potionOfCelebration);
var bounty = {
    name: 'Bounty',
    simpleText: ['The next time you buy a card, buy it again.'],
    triggers: [{
            text: "Whenever you buy a card, discard this to buy the card again.",
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
        }],
    replacers: [trashOnLeavePlay()]
};
export var potionOfBounty = {
    name: 'Potion of Bounty',
    isPotion: true,
    simpleText: ['The next time you buy a card, buy it three more times for free.'],
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty, 3)]
};
potionRewards.push(potionOfBounty);
export var potionOfTransformation = {
    name: 'Potion of Transformation',
    isPotion: true,
    simpleText: ['Trash any number of cards in your hand. For each one, buy a card costing up to $2 more than it in your hand.'],
    effects: [{
            text: ['Repeat this any number of times: trash a card in your hand that was there at the start of this process, then buy a card costing up to $2 more than it.'],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var options, _loop_1, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                options = asNumberedChoices(state.hand);
                                _loop_1 = function () {
                                    var picked, cost_1, toBuy;
                                    var _b, _c;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                picked = void 0;
                                                return [4 /*yield*/, choice(state, 'Pick a card to trash', allowNull(options.filter(function (c) { return state.find(c.value).place == 'hand'; })))];
                                            case 1:
                                                _b = __read.apply(void 0, [_d.sent(), 2]), state = _b[0], picked = _b[1];
                                                if (!(picked == null)) return [3 /*break*/, 2];
                                                return [2 /*return*/, { value: state }];
                                            case 2:
                                                cost_1 = addCosts(picked.cost('buy', state), coin(2));
                                                return [4 /*yield*/, trash(picked)(state)];
                                            case 3:
                                                state = _d.sent();
                                                toBuy = void 0;
                                                return [4 /*yield*/, choice(state, "Pick a card to buy costing up to ".concat(renderCost(cost_1)), state.supply.filter(function (c) { return leq(c.cost('buy', state), cost_1); }).map(asChoice))];
                                            case 4:
                                                _c = __read.apply(void 0, [_d.sent(), 2]), state = _c[0], toBuy = _c[1];
                                                if (!(toBuy != null)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, create(toBuy.spec, 'hand')(state)];
                                            case 5:
                                                state = _d.sent();
                                                _d.label = 6;
                                            case 6: return [2 /*return*/];
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
export var potionOfFerry = {
    name: 'Potion of Ferry',
    isPotion: true,
    simpleText: [
        'Put a ferry token on a supply. It costs $1 less.',
        '+$2 and +1 buy.'
    ],
    rules: [ferryRule],
    effects: [targetedEffect(function (target) { return addToken(target, 'ferry', 1); }, 'Put a ferry token on a supply.', function (state) { return state.supply; }), buyEffect(), coinsEffect(2)]
};
potionRewards.push(potionOfFerry);
export var potionOfRecovery = {
    name: 'Potion of Recovery',
    isPotion: true,
    effects: [{
            text: ['Put your discard and play into your hand.'],
            transform: function (state) { return doAll([moveMany(state.play, 'hand'), moveMany(state.discard, 'hand'), sortHand]); }
        }]
};
potionRewards.push(potionOfRecovery);
export var potionOfReuse = {
    name: 'Potion of Reuse',
    simpleText: ['Play each card in your discard.'],
    isPotion: true,
    effects: [{
            text: ["Repeat any number of times:\n                choose a card in your discard\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_2, state_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.discard;
                                options = asNumberedChoices(cards);
                                _loop_2 = function () {
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
                                                id_1 = picked.id;
                                                options = options.filter(function (c) { return c.value.id != id_1; });
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
};
potionRewards.push(potionOfReuse);
export var potionOfFairs = {
    name: 'Potion of Fairs',
    isPotion: true,
    simpleText: ['Create 3 Fairs in play with shelter tokens on them (the first time each would leave play, instead remove the token.).'],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [
        createInPlayEffect(fair, 3, new Map([['shelter', 1]])),
    ]
};
potionRewards.push(potionOfFairs);
export var potionOfVitality = {
    name: 'Potion of Vitality',
    isPotion: true,
    simpleText: [
        '+$1, +1 action, +1 buy.',
        'Create a Fair and a Villager in play.'
    ],
    relatedCards: [fair, villager],
    effects: [
        coinsEffect(1),
        actionsEffect(1),
        buysEffect(1),
        createInPlayEffect(fair),
        createInPlayEffect(villager),
    ]
};
potionRewards.push(potionOfVitality);
/*
export const potionOfWorkshop: CardSpec = {
    name: 'Potion of Workshop',
    isPotion: true,
    simpleText: ['Create a Workshop in your hand.'],
    relatedCards: [workshop],
    effects: [{
        text: ['Create a Workshop in your hand.'],
        transform: () => create(workshop, 'hand')
    }]
}
potionRewards.push(potionOfWorkshop)
*/
export var potionOfCreation = {
    name: 'Potion of Creation',
    isPotion: true,
    effects: [targetedEffect(function (target, card) { return target.buy(card); }, "Buy a card in the supply costing up to $4.", function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(4)); }); })]
};
/*
export const potionOfTavern: CardSpec = {
    name: 'Potion of Tavern',
    isPotion: true,
    simpleText: ['Create a Tavern in your hand.'],
    relatedCards: [tavern],
    effects: [{
        text: ['Create a Tavern in your hand.'],
        transform: () => create(tavern, 'hand')
    }]
}
potionRewards.push(potionOfTavern)
*/
export var potionOfInnovation = {
    name: 'Potion of Innovation',
    isPotion: true,
    relatedCards: [innovation],
    effects: [{
            text: ['Create three Innovations in your hand.'],
            transform: function () { return repeat(create(innovation, 'hand'), 3); }
        }]
};
potionRewards.push(potionOfInnovation);
/*
export const potionOfTransmogrify: CardSpec = {
    name: 'Potion of Transmogrify',
    isPotion: true,
    simpleText: ['Create a Transmogrify in your hand.'],
    relatedCards: [transmogrify],
    effects: [{
        text: ['Create a Transmogrify in your hand.'],
        transform: () => create(transmogrify, 'hand')
    }]
}
potionRewards.push(potionOfTransmogrify)
*/
// Event effect potions
export var potionOfReflection = {
    name: 'Potion of Reflection',
    isPotion: true,
    simpleText: ['Put a reflect token on each card in your hand.'],
    rules: [reflectRule],
    effects: [{
            text: ['Put a reflect token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'reflect'); }));
            }
        }]
};
potionRewards.push(potionOfReflection);
export var potionOfEchoes = {
    name: 'Potion of Echoes',
    isPotion: true,
    simpleText: ['For each card in your hand without an echo token, create a copy with an echo token.'],
    rules: [echoRule],
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }]
};
potionRewards.push(potionOfEchoes);
export var potionOfOnslaught = {
    name: 'Potion of Onslaught',
    isPotion: true,
    simpleText: ['Play any number of cards in your hand.'],
    effects: [{
            text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, options, _loop_3, state_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                cards = state.hand;
                                options = asNumberedChoices(cards);
                                _loop_3 = function () {
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
potionRewards.push(potionOfOnslaught);
export var potionOfPriority = {
    name: 'Potion of Priority',
    isPotion: true,
    simpleText: [
        'Put five priority tokens on a supply.',
        'The next 5 times you create a card from it, play it immediately.'
    ],
    rules: [priorityRule],
    effects: [targetedEffect(function (card) { return addToken(card, 'priority', 5); }, 'Put five priority tokens on a card in the supply.', function (state) { return state.supply; })]
};
potionRewards.push(potionOfPriority);
export var geminiPotion = {
    name: 'Gemini Potion',
    isPotion: true,
    simpleText: [
        'Put a twin token on a card in your hand.',
        'Whenever you play it, play it again.'
    ],
    rules: [twinRule],
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })]
};
potionRewards.push(geminiPotion);
export var mirrorBrew = {
    name: 'Mirror Brew',
    isPotion: true,
    simpleText: ['Copy the effect of another potion.'],
    effects: [{
            text: ['Choose another potion you have. Create a copy of it and drink it immediately.'],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var otherPotions, options, picked;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                otherPotions = state.potions.filter(function (p) { return p.id !== card.id; });
                                if (otherPotions.length === 0) {
                                    return [2 /*return*/, state];
                                }
                                options = asNumberedChoices(otherPotions);
                                return [4 /*yield*/, choice(state, 'Choose a potion to copy.', allowNull(options))];
                            case 1:
                                _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], picked = _a[1];
                                if (!(picked !== null)) return [3 /*break*/, 3];
                                return [4 /*yield*/, create(picked.spec, 'potions', function (potion) { return potion.activate('potion', card); })(state)];
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
potionRewards.push(mirrorBrew);
//# sourceMappingURL=potions.js.map