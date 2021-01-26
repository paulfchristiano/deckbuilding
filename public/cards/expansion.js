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
import { choice, asChoice, trash, addCosts, leq, gainPoints, gainActions, gainCoins, gainBuys, free, create, doAll, multichoice, moveMany, addToken, removeToken, payToDo, tick, eq, move, noop, charge, discharge, payCost, subtractCost, aOrNum, allowNull, } from '../logic.js';
import { villager, fair, refresh, buyable, registerEvent, register, actionsEffect, buysEffect, pointsEffect, coinsEffect, recycleEffect, reflectTrigger, createInPlayEffect, targetedEffect, workshopEffect, chargeEffect, startsWithCharge, energy, coin, useRefresh, costReduce, reducedCost, applyToTarget, countNameTokens, nameHasToken, incrementCost, costPer, createEffect, repeat, copper, silver, gold, estate, duchy, province, trashOnLeavePlay, discardFromPlay, trashThis, payAction, fragileEcho, } from './index.js';
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
                    var N, _loop_1, i, state_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                N = 6;
                                _loop_1 = function (i) {
                                    var card, cost_1, target;
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
                                                cost_1 = addCosts(card.cost('buy', state), coin(2));
                                                target = void 0;
                                                return [4 /*yield*/, choice(state, "Choose a card to buy (" + i + " remaining).", state.supply.filter(function (t) { return leq(t.cost('buy', state), cost_1); }).map(asChoice))];
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
                                return [5 /*yield**/, _loop_1(i)];
                            case 2:
                                state_1 = _a.sent();
                                if (state_1 === "break")
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
    effects: [],
    replacers: [{
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
//# sourceMappingURL=expansion.js.map