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
import { choice, asChoice, trash, addCosts, subtractCost, eq, leq, noop, gainActions, gainCoins, gainBuys, free, create, move, doAll, multichoice, moveMany, payToDo, payCost, addToken, charge, discharge, tick, a, num, aOrNum, villager, fair, horse, actionsEffect, buyEffect, buysEffect, createEffect, recycleEffect, createInPlayEffect, chargeEffect, targetedEffect, workshopEffect, coinsEffect, energy, coin, repeat, startsWithCharge, costReduce, applyToTarget, playTwice, payAction, discardFromPlay, trashThis, copper, gold, silver, countDistinctNames, playReplacer, trashOnLeavePlay, renderCostOrZero, reflectRule, ferryRule, cardRewards, buyTrigger, afterBuyTrigger, fountainEffect, shelterRule, startInPlay, hagglerRule, hagglerName, } from '../gameLogic.js';
function toPlay() {
    return {
        text: ["Put this in play."],
        transform: function (state, c) { return move(c, 'play'); }
    };
}
var ghostTown = { name: 'Ghost Town',
    buyCost: coin(3),
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager],
    staticTriggers: [buyTrigger(actionsEffect(2))]
};
cardRewards.push(ghostTown);
/*
export const transmogrify:CardSpec = {name: 'Transmogrify',
    buyCost: coin(3),
    simpleText: [
        `Trash a card in your hand.`,
        `Create a card in your hand costing up to $2 more than it.`
    ],
    effects: [actionsEffect(1), {
        text: [`Trash a card in your hand.
                If you do, choose a card in the supply costing up to $2 more than it.
                Create a copy of that card in your hand.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(state,
                'Choose a card to transmogrify.',
                state.hand.map(asChoice)
            )
            if (target != null) {
                state = await trash(target)(state)
                const cost:Cost = addCosts(
                    target.cost('buy', state),
                    coin(2)
                )
                let target2:Card|null; [state, target2] = await choice(
                    state, 'Choose a card to copy.',
                    state.supply.filter(
                        c => leq(c.cost('buy', state), cost)
                    ).map(asChoice)
                )
                if (target2 != null) {
                    state = await create(target2.spec, 'hand')(state)
                }
            }
            return state
        }
    }]
}
cardRewards.push(transmogrify)
*/
var Till = 'Till';
var till = { name: Till,
    buyCost: coin(4),
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
cardRewards.push(till);
var village = { name: 'Village',
    buyCost: coin(3),
    effects: [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager],
};
cardRewards.push(village);
var bridge = { name: 'Bridge',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce('buy', { coin: 1 }, true)]
};
cardRewards.push(bridge);
var lab = { name: 'Lab',
    buyCost: coin(3),
    effects: [actionsEffect(3)]
};
cardRewards.push(lab);
function throneroomEffect() {
    return {
        text: ["Pay an action to play a card in your hand twice."],
        transform: function (state, card) { return payToDo(payAction(card), playTwice(card)); }
    };
}
export var throneRoom = { name: 'Throne Room',
    simpleText: ["Pay an action to play a card in your hand twice without paying any @ costs."],
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [throneroomEffect()] };
cardRewards.push(throneRoom);
var coppersmith = { name: 'Coppersmith',
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [buysEffect(1)],
    triggers: [{
            kind: 'play',
            text: "When you play a copper, +$1.",
            handles: function (e) { return e.card.name == copper.name; },
            transform: function (e, s, c) { return gainCoins(1, c); },
        }]
};
cardRewards.push(coppersmith);
var Unearth = 'Unearth';
var unearth = { name: Unearth,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(2), actionsEffect(1), targetedEffect(function (target) { return move(target, 'hand'); }, "Put a non-".concat(Unearth, " card from your discard into your hand."), function (state) { return state.discard.filter(function (c) { return c.name != Unearth; }); })
    ]
};
cardRewards.push(unearth);
var celebrationName = 'Celebration';
export var celebration = { name: celebrationName,
    buyCost: coin(6),
    simpleText: [
        "Cards cost @ less to play.",
        "When you create this, put it directly into play."
    ],
    fixedCost: energy(1),
    replacers: [costReduce('play', { energy: 1 })],
    staticReplacers: [startInPlay(celebrationName)] };
cardRewards.push(celebration);
var plowName = 'Plow';
var plow = { name: plowName,
    buyCost: coin(4),
    simpleText: [
        "Put your discard into your hand.",
        "".concat(plowName, " goes to play instead of your discard when bought or created.")
    ],
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    staticReplacers: [{
            kind: 'create',
            text: "Whenever you would create a ".concat(plowName, ", create it in play."),
            handles: function (p) { return p.spec.name == plowName; },
            replace: function (p) { return (__assign(__assign({}, p), { zone: 'play' })); }
        }]
};
cardRewards.push(plow);
var construction = { name: 'Construction',
    fixedCost: energy(1),
    buyCost: coin(4),
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
cardRewards.push(construction);
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than ".concat(max, ".")],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var investmentName = 'Investment';
var investment = { name: investmentName,
    simpleText: [
        "+$2.",
        "This increases by $1 each time you play it, up to +$6."
    ],
    buyCost: coin(4),
    fixedCost: energy(0),
    effects: [{
            text: ['+$1 per charge token on this.'],
            transform: function (state, card) { return gainCoins(state.find(card).charge, card); },
        }, chargeUpTo(6)],
    staticReplacers: [startsWithCharge(investmentName, 2)] };
cardRewards.push(investment);
var royalSeal = { name: 'Royal Seal',
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair],
    buyCost: coin(5),
};
cardRewards.push(royalSeal);
var workshopName = 'Workshop';
export var workshop = { name: workshopName,
    fixedCost: energy(0),
    buyCost: coin(3),
    effects: [workshopEffect(4, workshopName)],
};
cardRewards.push(workshop);
var shippingLane = { name: 'Shipping Lane',
    simpleText: [
        "+$2.",
        "The next time you buy a card, buy it again for free."
    ],
    buyCost: coin(4),
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
                            case 0:
                                if (!(state.find(card).place == 'play')) return [3 /*break*/, 2];
                                return [4 /*yield*/, move(card, 'discard')(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, e.card.buy(card)(state)];
                            case 2: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cardRewards.push(shippingLane);
var factoryName = 'Factory';
var factory = { name: factoryName,
    fixedCost: energy(1),
    effects: [workshopEffect(6, factoryName)],
    buyCost: coin(3)
};
cardRewards.push(factory);
var imitation = { name: 'Imitation',
    fixedCost: energy(1),
    effects: [targetedEffect(function (target, card) { return create(target.spec, 'hand'); }, 'Choose a card in your hand. Create a copy of it in your hand.', function (state) { return state.hand; })],
    buyCost: coin(3), };
cardRewards.push(imitation);
var feast = { name: 'Feast',
    fixedCost: energy(0),
    effects: [targetedEffect(function (target, card) { return target.buy(card); }, 'Buy a card in the supply costing up to $6.', function (state) { return state.supply.filter(function (x) { return leq(x.cost('buy', state), coin(6)); }); }), trashThis()],
    buyCost: coin(3),
    staticTriggers: [buyTrigger(buyEffect())] };
cardRewards.push(feast);
var researcher = { name: 'Researcher',
    simpleText: [
        "+3 actions.",
        "This increases by +1 action each time you play it."
    ],
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
        }, chargeEffect()],
    buyCost: coin(4),
    staticReplacers: [startsWithCharge('Researcher', 3)], };
cardRewards.push(researcher);
var lackeys = { name: 'Lackeys',
    fixedCost: energy(1),
    effects: [actionsEffect(4)],
    relatedCards: [villager],
    buyCost: coin(3),
    staticTriggers: [buyTrigger(createInPlayEffect(villager, 1))]
};
cardRewards.push(lackeys);
var goldMine = { name: 'Gold Mine',
    fixedCost: energy(1),
    effects: [createEffect(gold, 'hand', 2)],
    buyCost: coin(6),
};
cardRewards.push(goldMine);
var shelterName = 'Shelter';
export var shelter = { name: shelterName,
    buyCost: coin(3),
    simpleText: [
        "+1 action",
        "Put a shelter token on each card in play. The next time they would leave play, instead remove a shelter token."
    ],
    effects: [actionsEffect(1), {
            text: ["Put a shelter token on each card in play."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, c, e_1_1;
                    var e_1, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 5, 6, 7]);
                                _a = __values(state.play), _b = _a.next();
                                _d.label = 1;
                            case 1:
                                if (!!_b.done) return [3 /*break*/, 4];
                                c = _b.value;
                                return [4 /*yield*/, addToken(c, 'shelter')(state)];
                            case 2:
                                state = _d.sent();
                                _d.label = 3;
                            case 3:
                                _b = _a.next();
                                return [3 /*break*/, 1];
                            case 4: return [3 /*break*/, 7];
                            case 5:
                                e_1_1 = _d.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 7];
                            case 6:
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                                return [7 /*endfinally*/];
                            case 7: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }],
    rules: [shelterRule] };
cardRewards.push(shelter);
var market = {
    name: 'Market',
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
    buyCost: coin(3),
};
cardRewards.push(market);
var herbs = { name: 'Herbs',
    effects: [coinsEffect(1), buyEffect()],
    buyCost: coin(2),
    staticTriggers: [buyTrigger(buyEffect())]
};
cardRewards.push(herbs);
var spices = { name: 'Spices',
    effects: [coinsEffect(2), buyEffect()],
    buyCost: coin(5),
    staticTriggers: [buyTrigger(coinsEffect(4))]
};
cardRewards.push(spices);
var platinum = { name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)],
    buyCost: coin(8),
};
cardRewards.push(platinum);
var greatSmithy = { name: 'Great Smithy',
    fixedCost: energy(2),
    effects: [actionsEffect(8), buysEffect(2)],
    buyCost: coin(6),
};
cardRewards.push(greatSmithy);
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
    effects: [KCEffect()],
    buyCost: coin(9),
};
cardRewards.push(kingsCourt);
/*
const procession:CardSpec = {name: 'Procession',
    fixedCost: energy(1),
    effects: [{
        text: [`Pay one action to play a card in your hand twice,
                then trash it and create a copy of a card in the supply
                costing exactly $1 or $2 more.`],
        transform: (state, card) => payToDo(payAction(card), applyToTarget(
            target => doAll([
                target.play(card),
                tick(card),
                target.play(card),
                trash(target),
                applyToTarget(
                    target2 => create(target2.spec),
                    'Choose a card to copy.',
                    s => s.supply.filter(c => eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:1})
                    ) || eq(
                        c.cost('buy', s),
                        addCosts(target.cost('buy', s), {coin:2})
                    ))
                )
            ]), 'Choose a card to play twice.', s => s.hand
        ))
    }],
    buyCost: coin(3),
}
cardRewards.push(procession)
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
    simpleText: [
        "Create a ".concat(tactic.name, " in play."),
        "Whenever it would move to your hand it gains a charge token instead.",
        "Once it has a charge token, you can trash it and pay an action to play a card in your hand three times."
    ],
    name: 'Mastermind',
    fixedCost: energy(1),
    relatedCards: [tactic],
    effects: [createInPlayEffect(tactic)],
    buyCost: coin(6),
};
cardRewards.push(mastermind);
var recruitment = {
    name: 'Recruitment',
    relatedCards: [villager, fair],
    effects: [actionsEffect(1)],
    triggers: [{
            text: "Whenever you pay @,\n               create that many ".concat(villager.name, "s and ").concat(fair.name, "s in play."),
            kind: 'cost',
            handles: function (e, state, card) { return e.cost.energy > 0; },
            transform: function (e, state, card) { return doAll([villager, fair].map(function (c) { return repeat(create(c, 'play'), e.cost.energy); })); }
        }],
    buyCost: coin(3),
};
cardRewards.push(recruitment);
/*
const dragon:CardSpec = {name: 'Dragon',
    buyCost: coin(7),
    effects: [targetedEffect(c => trash(c), 'Trash a card in your hand.', s => s.hand),
              coinsEffect(4), actionsEffect(4), buyEffect()]
}
const hatchery:CardSpec = {name: 'Hatchery',
    fixedCost: energy(0),
    relatedCards: [dragon],
    effects: [actionsEffect(1), {
        text: [`If this has two charge tokens, remove one and
                create ${a(dragon.name)} in your hand.
                Otherwise, put a charge token on this.`],
        transform: (state, card) => {
            const c = state.find(card);
            return (c.charge >= 2)
                ? doAll([
                    discharge(c, 1),
                    create(dragon, 'hand')
                ]) : charge(c)
        }
    }],
    buyCost: coin(4)
}
cardRewards.push(hatchery)
*/
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
        }],
    buyCost: coin(4), };
cardRewards.push(looter);
var Innovation = 'Innovation';
export var innovation = { name: Innovation,
    simpleText: ["The next time you create a card in your hand or discard, play it immediately."],
    effects: [actionsEffect(1)],
    replacers: [playReplacer("Whenever you would create a card in your discard,\n        instead discard this to set the card aside.\n        Then play it if it is still set aside.", function (p, s, c) { return s.find(c).place == 'play'; }, function (p, s, c) { return discardFromPlay(c); })],
    buyCost: coin(3), };
cardRewards.push(innovation);
/*
const formation:CardSpec = {name: 'Formation',
    effects: [],
    replacers: [{
        text: 'Cards cost @ less to play if they share a name with a card in your discard or in play.'
         + ' Whenever this reduces a cost, discard it and +2 actions.',
        kind: 'cost',
        handles: (x, state) => x.actionKind == 'play'
            && state.discard.concat(state.play).some(c => c.name == x.card.name),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    move(card, 'discard'),
                    gainActions(2, card),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }],
    buyCost: coin(4),
}
*/
var formation = {
    name: 'Formation',
    effects: [actionsEffect(2)],
    buyCost: coin(4),
    replacers: [{
            text: "Cards cost @ less to play if they share a name with a card in your discard or in play.",
            kind: 'cost',
            handles: function (x, state) { return x.actionKind == 'play' && state.discard.concat(state.play).some(function (c) { return c.name == x.card.name; }); },
            replace: function (x, state, card) {
                return __assign(__assign({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
            }
        }]
};
cardRewards.push(formation);
var coven = {
    name: 'Coven',
    effects: [coinsEffect(1)],
    buyCost: coin(3),
    replacers: [{
            text: "Cards cost @ less to play if they don't share a name with a card in your discard or in play.",
            kind: 'cost',
            handles: function (x, state) { return x.actionKind == 'play' && !state.discard.concat(state.play).some(function (c) { return c.name == x.card.name; }); },
            replace: function (x, state, card) {
                return __assign(__assign({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
            }
        }]
};
cardRewards.push(coven);
var Traveler = 'Traveler';
var traveler = {
    simpleText: [
        "Pay an action to play a card in your hand once for each charge token on this.",
        "It starts with 1 charge token and gains 1 each time you play it, up to 3."
    ],
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
        }, chargeUpTo(3)],
    buyCost: coin(6),
    staticReplacers: [startsWithCharge(Traveler, 1)],
};
cardRewards.push(traveler);
var fountain = {
    name: 'Fountain',
    fixedCost: energy(0),
    effects: [fountainEffect()],
    buyCost: coin(3),
};
cardRewards.push(fountain);
var grandMarket = {
    name: 'Grand Market',
    buyCost: coin(5),
    effects: [actionsEffect(1), coinsEffect(2), buysEffect(2)],
};
cardRewards.push(grandMarket);
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
        }],
    buyCost: coin(6),
};
cardRewards.push(industry);
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
        }],
    buyCost: coin(3),
};
cardRewards.push(artificer);
var banquet = {
    name: 'Banquet',
    buyCost: coin(4),
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
cardRewards.push(banquet);
var harvest = {
    name: 'Harvest',
    fixedCost: energy(1),
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
        }],
    buyCost: coin(3)
};
cardRewards.push(harvest);
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
        }],
    buyCost: coin(3),
};
cardRewards.push(secretChamber);
var hireling = {
    name: 'Hireling',
    relatedCards: [fair],
    effects: [],
    replacers: [{
            text: "Whenever you would move this to your hand,\n               instead +1 action, +1 buy, +$1, and create a ".concat(fair.name, " in play."),
            kind: 'move',
            handles: function (p, s, c) { return p.card.id == c.id && p.toZone == 'hand' && p.skip == false; },
            replace: function (p, s, c) { return (__assign(__assign({}, p), { skip: true, effects: p.effects.concat([
                    gainActions(1, c), gainBuys(1, c), gainCoins(1, c), create(fair, 'play')
                ]) })); }
        }],
    buyCost: coin(2),
};
cardRewards.push(hireling);
var haggler = {
    name: hagglerName,
    fixedCost: energy(1),
    effects: [coinsEffect(2), toPlay()],
    simpleText: ["After buying a card the normal way,\n            buy an additional card for each ".concat(hagglerName, " in play.\n            Each card you buy this way must cost at least $1 less than the previous one.")],
    buyCost: coin(3),
    rules: [hagglerRule]
};
cardRewards.push(haggler);
var highwayName = 'Highway';
var highway = {
    name: highwayName,
    effects: [actionsEffect(1)],
    replacers: [costReduce('buy', { coin: 1 }, true)],
    buyCost: coin(5),
    staticReplacers: [startInPlay(highwayName)]
};
cardRewards.push(highway);
var FairyGold = 'Fairy Gold';
var fairyGold = {
    simpleText: [
        "+$3 and +1 buy.",
        "This decreases by $1 each time you play it."
    ],
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
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(FairyGold, 3)]
};
cardRewards.push(fairyGold);
var fortuneName = 'Fortune';
var fortune = {
    simpleText: [
        "Double your $ and buys.",
        "You can only buy Fortune once."
    ],
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
        }],
    buyCost: coin(12),
};
cardRewards.push(fortune);
var ferry = {
    name: 'Ferry',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(function (target) { return addToken(target, 'ferry', 1); }, 'Put a ferry token on a supply.', function (state) { return state.supply; })],
    rules: [ferryRule],
};
cardRewards.push(ferry);
export var transmogrify = {
    name: 'Transmogrify',
    buyCost: coin(3),
    effects: [{
            text: ["Trash a card in your hand.", "Choose a card in the supply costing less and create a copy in your hand.", "Choose a card in the supply costing $1 or $2 more and create a copy in your hand."],
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
                                                    return [4 /*yield*/, applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, 'Choose a cheaper card to copy.', function (s) { return s.supply.filter(function (c) { return leq(target.cost('buy', s), c.cost('buy', s)); }); })(state)];
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
cardRewards.push(transmogrify);
var harrowName = 'Harrow';
var harrow = {
    name: harrowName,
    buyCost: coin(3),
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
cardRewards.push(harrow);
export var tavern = {
    name: 'Tavern',
    buyCost: coin(3),
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
};
cardRewards.push(tavern);
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
cardRewards.push(metalworker);
var exoticMarket = {
    name: 'Exotic Market',
    buyCost: coin(4),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
};
cardRewards.push(exoticMarket);
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
cardRewards.push(queensCourt);
var sculpt = {
    name: 'Sculpt',
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(function (target) { return doAll([move(target, 'discard'), repeat(create(target.spec, 'discard'), 2)]); }, 'Discard a card in your hand to create two copies of it in your discard.', function (state) { return state.hand; })]
};
cardRewards.push(sculpt);
var tapestry = {
    name: 'Tapestry',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)]
};
cardRewards.push(tapestry);
var silverMine = {
    name: 'Silver Mine',
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, 'hand', 2)]
};
cardRewards.push(silverMine);
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
cardRewards.push(livery);
var stables = {
    name: 'Stables',
    relatedCards: [horse],
    effects: [actionsEffect(1), createEffect(horse, 'discard', 2)],
    buyCost: coin(2),
    staticTriggers: [buyTrigger({
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
        })]
};
cardRewards.push(stables);
var ritual = {
    name: 'Ritual',
    buyCost: coin(4),
    effects: [{
            text: ["Play then trash two cards from your hand.", "If you do, choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target1, target2, cost, _a, _b, target;
                    var _c, _d, e_2, _e;
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
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                    }
                                    finally { if (e_2) throw e_2.error; }
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
cardRewards.push(ritual);
var scepter = {
    name: 'Scepter',
    fixedCost: energy(2),
    buyCost: coin(5),
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
cardRewards.push(scepter);
var inn = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)],
    buyCost: coin(4),
    staticTriggers: [afterBuyTrigger(createEffect(horse, 'discard', 3))]
};
cardRewards.push(inn);
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
cardRewards.push(magpie);
var crown = {
    name: 'Crown',
    simpleText: [
        "Put a reflect token on a card in your hand.",
        "The next time you play it, play it again."
    ],
    buyCost: coin(3),
    effects: [targetedEffect(function (target) { return addToken(target, 'reflect'); }, 'Put a reflect token on a card in your hand.', function (s) { return s.hand; })],
    rules: [reflectRule],
};
cardRewards.push(crown);
var churnName = 'Churn';
var churn = {
    name: churnName,
    simpleText: [
        "Put two non-".concat(churnName, " cards from your discard to your hand."),
        "This decreases by 1 each time you play it."
    ],
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
        }],
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(churnName, 2)]
};
cardRewards.push(churn);
var bustlingVillage = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager), {
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
cardRewards.push(bustlingVillage);
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
cardRewards.push(governor);
var marketSquare = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
    buyCost: coin(2),
    staticTriggers: [afterBuyTrigger(createInPlayEffect(fair, 2))]
};
cardRewards.push(marketSquare);
var greatFeastName = 'Great Feast';
var greatFeast = {
    name: greatFeastName,
    buyCost: coin(10),
    effects: [{
            text: ["Do this three times: buy a card in the supply costing up to $8."],
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
                                return [4 /*yield*/, applyToTarget(function (target) { return target.buy(card); }, "Buy a card in the supply costing up to $8", function (s) { return s.supply.filter(function (x) { return leq(x.cost('buy', s), coin(8)); }); })(state)];
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
cardRewards.push(greatFeast);
var universityName = 'University';
var university = {
    name: universityName,
    buyCost: coin(12),
    effects: [actionsEffect(4), buysEffect(2)],
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
cardRewards.push(university);
var moon = {
    name: 'Moon',
    simpleText: [
        "The moon starts off empty.",
        "Whenever you would move this from play, it instead toggles between full and empty.",
    ],
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
    simpleText: [
        "+3 actions. If there is a full moon, instead +$3 and +1 buy.",
        "The moon starts off empty and switches between full and empty each time you Refresh."
    ],
    name: 'Werewolf',
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
            text: ["If a ".concat(moon.name, " in play has an odd number of charge tokens (moon is full), +$3 and +1 buy."), "Otherwise, +3 actions."],
            transform: function (s, c) { return (s.play.some(function (c) { return c.name == moon.name && c.charge % 2 == 1; })) ?
                doAll([gainCoins(3, c), gainBuys(1, c)]) :
                gainActions(3, c); }
        }],
    staticTriggers: [{
            kind: 'gameStart',
            text: "At the start of the game, create ".concat(a(moon.name), " in play."),
            handles: function () { return true; },
            transform: function () { return create(moon, 'play'); }
        }]
};
cardRewards.push(werewolf);
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
    simpleText: [
        "+$5 and +5 buys.",
        "Create an Embargo in play that increases the cost of cards and events by $1 until it leaves play."
    ],
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo],
};
cardRewards.push(contraband);
//# sourceMappingURL=cards.js.map