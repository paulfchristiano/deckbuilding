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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
import { eventRewards, free, coin, energy, doAll, addToken, removeToken, countNameTokens, nameHasToken, create, trash, gainCoins, applyToTarget, createInPlayEffect, targetedEffect, multitargetedEffect, chargeEffect, charge, discharge, payToDo, sourceHasName, costPer, incrementCost, playReplacer, repeat, actionsEffect, coinsEffect, buyEffect, createEffect, choice, asNumberedChoices, allowNull, multichoice, asChoice, villager, fair, horse, duplicateRule, twinRule, reflectRule, leq, addCosts, priorityRule, echoRule, move, fountainEffect, } from '../gameLogic.js';
var hallOfMirrors = { name: 'Hall of Mirrors',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [{
            text: ['Put a reflect token on each card in your hand.'],
            transform: function (state, card) {
                return doAll(state.hand.map(function (c) { return addToken(c, 'reflect'); }));
            }
        }],
    rules: [reflectRule], };
eventRewards.push(hallOfMirrors);
var volley = {
    name: 'Volley',
    fixedCost: energy(1),
    simpleText: ["Play then trash any number of cards in your hand."],
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
eventRewards.push(volley);
var parallelize = { name: 'Parallelize',
    fixedCost: __assign(__assign({}, free), { coin: 1, energy: 1 }),
    simpleText: [
        "Put a parallelize token on each card in your hand.",
        "Cards cost @ less to play for each parallelize token on them."
    ],
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
eventRewards.push(parallelize);
var reach = { name: 'Reach',
    fixedCost: energy(1),
    effects: [coinsEffect(1)]
};
eventRewards.push(reach);
var finance = { name: 'Finance',
    fixedCost: coin(1),
    effects: [actionsEffect(1)],
};
eventRewards.push(finance);
export var duplicate = { name: 'Duplicate',
    simpleText: ["For each card in the supply, the next time you buy that card buy it again for free."],
    fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    effects: [{
            text: ["Put a duplicate token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'duplicate'); })); }
        }],
    rules: [duplicateRule], };
eventRewards.push(duplicate);
var toil = { name: 'Toil',
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
};
eventRewards.push(toil);
var twin = { name: 'Twin',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    simpleText: [
        "Put a twin token on a card in your hand.",
        "Whenever you play it other than with this effect, play it again."
    ],
    effects: [targetedEffect(function (target) { return addToken(target, 'twin'); }, 'Put a twin token on a card in your hand.', function (state) { return state.hand; })],
    rules: [twinRule], };
eventRewards.push(twin);
var expedite = {
    simpleText: ["The next time you create a card, play it immediately."],
    name: 'Expedite',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard,\n            if this has a charge token then instead\n            remove a charge token to set the card aside.\n            Then play it if it is set aside.", function (p, s, c) { return s.find(c).charge > 0; }, function (p, s, c) { return charge(c, -1); })]
};
eventRewards.push(expedite);
function removeAllSupplyTokens(token) {
    return {
        text: ["Remove all ".concat(token, " tokens from cards in the supply.")],
        transform: function (state, card) { return doAll(state.supply.map(function (s) { return removeToken(s, token, 'all'); })); }
    };
}
var synergy = { name: 'Synergy',
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    simpleText: [
        "Put synergy tokens on two cards in the supply.",
        "Whenever you buy the more expensive one (or either if they are tied), you can buy the other one for free."
    ],
    effects: [removeAllSupplyTokens('synergy'), {
            text: ['Put synergy tokens on two cards in the supply.'],
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var cards, cards_1, cards_1_1, card, e_1_1;
                    var _a, e_1, _b;
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
                                e_1_1 = _c.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                                }
                                finally { if (e_1) throw e_1.error; }
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
eventRewards.push(synergy);
var focus = { name: 'Focus',
    fixedCost: energy(1),
    effects: [buyEffect(), actionsEffect(2)],
};
eventRewards.push(focus);
var onslaught = { name: 'Onslaught',
    fixedCost: __assign(__assign({}, free), { coin: 4, energy: 1 }),
    simpleText: ["Play any number of cards in your hand."],
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
};
eventRewards.push(onslaught);
var resume = { name: 'Resume',
    fixedCost: energy(1),
    effects: [fountainEffect()]
};
eventRewards.push(resume);
var reflect = { name: 'Reflect',
    simpleText: [
        "Put a reflect token on a card in your hand.",
        "The next time you play that card, play it twice.",
        "This costs $1 more each time you use it."
    ],
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })],
    effects: [incrementCost(), targetedEffect(function (target, card) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand', function (state) { return state.hand; })],
    rules: [reflectRule], };
eventRewards.push(reflect);
var replicate = { name: 'Replicate',
    fixedCost: energy(1),
    effects: [chargeEffect()],
    simpleText: ["The next time you buy a card, buy it again."],
    staticTriggers: [{
            text: "After buying a card other than with this,\n            remove a charge token from this to to buy the card again.",
            kind: 'afterBuy',
            handles: function (e, s, c) { return s.find(c).charge > 0 && !sourceHasName(e.source, c.name); },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), e.card.buy(c)); }
        }]
};
eventRewards.push(replicate);
var lostArts = {
    simpleText: [
        "Put 8 art tokens on a supply.",
        "Whenever you play a card with art tokens on its supply, remove art tokens instead of paying @."
    ],
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
eventRewards.push(lostArts);
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
eventRewards.push(polish);
var commerce = {
    name: 'Commerce',
    fixedCost: coin(1),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager)],
};
eventRewards.push(commerce);
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
eventRewards.push(reverberate);
var festival = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 2)],
    relatedCards: [fair]
};
eventRewards.push(festival);
function buyCheaper(card, s, source) {
    return applyToTarget(function (target) { return target.buy(source); }, 'Choose a card to buy.', function (state) { return state.supply.filter(function (target) { return leq(addCosts(target.cost('buy', state), coin(1)), card.cost('buy', state)); }); });
}
var haggle = {
    name: 'Haggle',
    simpleText: ["The next time you buy a card, immediately buy a cheaper card."],
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
            kind: 'afterBuy',
            text: "After buying a card, remove a charge token from this to buy a card\n        in the supply that costs at least $1 less.",
            handles: function (e, s, c) { return s.find(c).charge > 0 && !sourceHasName(e.source, c.name); },
            transform: function (e, s, c) { return payToDo(discharge(c, 1), buyCheaper(e.card, s, c)); },
        }]
};
eventRewards.push(haggle);
var ride = {
    name: 'Ride',
    fixedCost: coin(1),
    relatedCards: [horse],
    effects: [createEffect(horse)]
};
eventRewards.push(ride);
var redouble = {
    name: 'Redouble',
    fixedCost: energy(2),
    effects: [targetedEffect(function (target) { return create(target.spec, 'hand'); }, 'Choose a card in your discard. Create a copy in your hand.', function (state) { return state.discard; })],
};
eventRewards.push(redouble);
/*
const splay:CardSpec = {
    name:'Splay',
    fixedCost: {...free, energy: 1},
    effects: [{
        text: [`Put a splay token on each supply.`],
        transform: s => doAll(s.supply.map(c => addToken(c, 'splay')))
    }],
    simpleText: [
        `Put a splay token on each supply.`,
        `Whenever you play a card with a splay token on its supply, remove splay tokens instead of paying @.`
    ],
    staticReplacers: [{
        text: `Cards you play cost @ less for each splay token on their supply.
               Whenever this reduces a card's cost by one or more @,
               remove that many splay tokens from its supply.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && nameHasToken(x.card, 'splay', state),
        replace: (x, state, card) => {
            card = state.find(card)
            const reduction = Math.min(
                x.cost.energy,
                countNameTokens(x.card, 'splay', state)
            )
            return {...x, cost:{...x.cost,
                energy:x.cost.energy-reduction,
                effects:x.cost.effects.concat([repeat(
                    applyToTarget(
                        target => removeToken(target, 'splay'),
                        'Remove a splay token from a supply.',
                        state => state.supply.filter(
                            c => c.name == x.card.name && c.count('splay') > 0
                        )
                    )
                    , reduction
                )])
            }}
        }
    }]
}
eventRewards.push(splay)
*/
/*
const regroup:CardSpec = {
    name: 'Regroup',
    fixedCost: energy(2),
    restrictions: [{
        text: 'You must have at most 5 cards in your discard.',
        test: (c, s, k) => s.discard.length > 5,
    }],
    effects: [actionsEffect(2), buysEffect(1), recycleEffect()],
}
eventRewards.push(regroup)
*/
var summon = {
    name: 'Summon',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 4 }),
    effects: [multitargetedEffect(function (targets, card) { return doAll(targets.map(function (target) {
            return create(target.spec, 'hand', function (c) { return addToken(c, 'echo'); });
        })); }, "Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.", function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', s), coin(6)); }); }, 3)],
    rules: [echoRule],
};
eventRewards.push(summon);
var reprise = {
    name: 'Reprise',
    fixedCost: energy(1),
    effects: [{
            text: ["Put each card in your discard into your hand with an echo token on it."],
            transform: function (state) { return doAll(state.discard.map(function (c) { return doAll([move(c, 'hand'), addToken(c, 'echo')]); })); }
        }],
    rules: [echoRule],
};
eventRewards.push(reprise);
var accelerate = {
    name: 'Accelerate',
    simpleText: [
        "Put a priority token on each card in the supply.",
        "Whenever you create a card with a priority token on it, remove the token to play the card immediately."
    ],
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [{
            text: ["Put a priority token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'priority'); })); }
        }],
    rules: [priorityRule],
};
eventRewards.push(accelerate);
var swap = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [targetedEffect(function (target) { return doAll([trash(target), applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, "Choose a card to copy.", function (state) { return state.supply.filter(function (sup) { return leq(sup.cost('buy', state), target.cost('buy', state)); }); })]); }, "Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.", function (state) { return state.hand; })],
};
eventRewards.push(swap);
var hallOfEchoes = {
    name: 'Hall of Echoes',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }],
    rules: [echoRule],
};
eventRewards.push(hallOfEchoes);
var bulkOrder = {
    name: 'Bulk Order',
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    simpleText: [
        "Choose a card in the supply.",
        "The next 5 times you buy that card, buy it again for free."
    ],
    effects: [targetedEffect(function (card) { return addToken(card, 'duplicate', 5); }, 'Put five duplicate tokens on a card in the supply.', function (state) { return state.supply; })],
    rules: [duplicateRule],
};
eventRewards.push(bulkOrder);
//# sourceMappingURL=events.js.map