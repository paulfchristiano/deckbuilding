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
import { choice, asChoice, trash, addCosts, leq, gainPoints, gainActions, gainCoins, gainBuys, free, create, doAll, multichoice, moveMany, addToken, removeToken, payToDo, tick, eq, move, noop, charge, discharge, payCost, aOrNum, allowNull, villager, fair, supplyForCard, actionsEffect, buysEffect, pointsEffect, coinsEffect, recycleEffect, reflectTrigger, createInPlayEffect, targetedEffect, chargeEffect, startsWithCharge, energy, coin, useRefresh, reducedCost, applyToTarget, countNameTokens, nameHasToken, incrementCost, costPer, createEffect, repeat, copper, silver, gold, estate, duchy, province, trashOnLeavePlay, trashThis, payAction, fragileEcho, playReplacer, countDistinctNames, sourceHasName, renderCostOrZero } from '../logic.js';
// ------------------- Expansion ---------------
export var cards = [];
export var events = [];
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
events.push(flourish);
var greed = {
    name: 'Greed',
    fixedCost: __assign(__assign({}, free), { energy: 1 }),
    effects: [{
            text: ["Pay all vp. For each vp lost, +$1, +1 action, and +1 buy."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.points;
                                return [4 /*yield*/, gainPoints(-n, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainCoins(n, card)(state)];
                            case 2:
                                state = _a.sent();
                                return [4 /*yield*/, gainActions(n, card)(state)];
                            case 3:
                                state = _a.sent();
                                return [4 /*yield*/, gainBuys(n, card)(state)];
                            case 4:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
events.push(greed);
/*
const strive:CardSpec = {
    name: 'Strive',
    fixedCost: {...free, energy:2, coin:3},
    effects: [workshopEffect(7)]
}
events.push(strive)
*/
/*
const delve:CardSpec = {
    name: 'Delve',
    fixedCost: coin(2),
    effects: [createEffect(silver)]
}
events.push(delve)
*/
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
//events.push(hesitation)
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
events.push(pillage)
*/
var festival = {
    name: 'Festival',
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 2)],
    relatedCards: [fair]
};
events.push(festival);
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
events.push(Import)
*/
var squeeze = {
    name: 'Squeeze',
    fixedCost: energy(1),
    effects: [actionsEffect(1)],
    staticReplacers: [{
            text: "You can't gain more than 1 action at a time from events.",
            kind: 'resource',
            handles: function (p, s, c) { return p.resource == 'actions' && p.source != 'act' && s.find(p.source).place == 'events'; },
            replace: function (p) { return (__assign(__assign({}, p), { amount: Math.min(p.amount, 1) })); },
        }]
};
events.push(squeeze);
var inspire = {
    name: 'Inspire',
    variableCosts: [costPer(energy(1))],
    effects: [{
            text: ['Double your actions and buys.'],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, gainActions(state.actions, c)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainBuys(state.buys, c)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, incrementCost()],
    staticReplacers: [{
            text: copper.name + " costs $1 more to buy if this has a cost token on it.",
            kind: 'cost',
            handles: function (p, state, card) { return p.actionKind == 'buy' && p.card.name == copper.name && state.find(card).count('cost') > 0; },
            replace: function (p, state, card) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }]
};
events.push(inspire);
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
events.push(chain)
*/
function buyCheaper(card, s, source) {
    return applyToTarget(function (target) { return target.buy(source); }, 'Choose a card to buy.', function (state) { return state.supply.filter(function (target) { return leq(addCosts(target.cost('buy', state), coin(1)), card.cost('buy', state)); }); });
}
var bulkOrder = {
    name: 'Bulk Order',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
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
/*
const bargain:CardSpec = {
    name: 'Bargain',
    fixedCost: {...free, energy:1, coin:4},
    effects: [targetedEffect(
        target => addToken(target, 'bargain'),
        `Put a bargain token on a card in the supply.`,
        s => s.supply,
    )],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card with a bargain token,
               buy a card in the supply that costs at least $1 less.`,
        handles: (e, s) => e.card.count('bargain') > 0,
        transform: (e, s, c) => buyCheaper(e.card, s, c)
    }]
}
events.push(bargain)
*/
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
events.push(haggle);
var horse = {
    name: 'Horse',
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
};
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
    staticReplacers: [{
            text: "Cards you play cost @ less for each splay token on their supply.\n               Whenever this reduces a card's cost by one or more @,\n               remove that many splay tokens from its supply.",
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
events.push(splay);
var recover = {
    name: 'Recover',
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(function (targets) { return moveMany(targets, 'hand'); }, 'Put up to 2 cards from your discard into your hand.', function (state) { return state.discard; }, 2), incrementCost()]
};
events.push(recover);
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
    restrictions: [{
            text: 'You must have at most 5 cards in your discard.',
            test: function (c, s, k) { return s.discard.length > 5; },
        }],
    effects: [actionsEffect(2), buysEffect(1), recycleEffect()],
};
events.push(regroup);
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
events.push(multitask)
*/
var summon = {
    name: 'Summon',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 5 }),
    effects: [multitargetedEffect(function (targets, card) { return doAll(targets.map(function (target) {
            return create(target.spec, 'hand', function (c) { return addToken(c, 'echo'); });
        })); }, "Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.", function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', s), coin(6)); }); }, 3)],
    staticReplacers: [fragileEcho('echo')]
};
events.push(summon);
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
cards.push($1)
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
cards.push(bandOfMisfits)
*/
function magpieEffect() {
    return {
        text: ["Create a copy of this in your discard."],
        transform: function (s, c) { return create(c.spec); }
    };
}
var rats = {
    name: 'Rats',
    buyCost: coin(3),
    effects: [coinsEffect(2), targetedEffect(function (c) { return trash(c); }, 'Trash a card in your hand.', function (s) { return s.hand; }), magpieEffect()]
};
cards.push(rats);
var crown = {
    name: 'Crown',
    buyCost: coin(4),
    effects: [targetedEffect(function (target) { return addToken(target, 'crown'); }, 'Put a crown token on a card in your hand.', function (s) { return s.hand; })],
    staticTriggers: [reflectTrigger('crown')],
};
cards.push(crown);
var remake = {
    name: 'Remake',
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    effects: [{
            text: ["Do this up to six times: trash a card in your hand,\n        then create a copy of a card in the supply costing up to $2 more."],
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
                                                return [4 /*yield*/, choice(state, "Choose a card to copy (" + i + " remaining).", state.supply.filter(function (t) { return leq(t.cost('buy', state), cost_1); }).map(asChoice))];
                                            case 4:
                                                _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                                                if (!(target != null)) return [3 /*break*/, 6];
                                                return [4 /*yield*/, create(target.spec)(state)];
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
events.push(remake);
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
cards.push(remake)
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
cards.push(ferry);
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
cards.push(develop);
var logisticsToken = 'logistics';
var logistics = {
    name: 'Logistics',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [{
            text: ["Put a " + logisticsToken + " token on each supply."],
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
function territoryTransform(state) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, create(territory, 'hand')(state)];
        });
    });
}
/*
{
    text: [`Put this in your hand.`],
    transform: (s, c) => move(c, 'hand')
}
*/
var territoryName = 'Territory';
var territory = {
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2)],
    staticReplacers: [{
            kind: 'move',
            text: "When you play a " + territoryName + " from your hand, leave it there.",
            handles: function (p) { return p.card.name == territoryName && p.toZone == 'resolving' && p.fromZone == 'hand'; },
            replace: function (p) { return (__assign(__assign({}, p), { skip: true })); }
        }]
};
cards.push(territory);
var reprise = {
    name: 'Reprise',
    fixedCost: energy(1),
    effects: [{
            text: ["Put each card in your discard into your hand with an echo token on it."],
            transform: function (state) { return doAll(state.discard.map(function (c) { return doAll([move(c, 'hand'), addToken(c, 'echo')]); })); }
        }],
    staticReplacers: [fragileEcho('echo')]
};
events.push(reprise);
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
cards.push(fossilize)
*/
var harrowName = 'Harrow';
var harrow = {
    name: harrowName,
    buyCost: coin(4),
    effects: [{
            text: ["Discard any number of cards from your hand, then put that many non-" + harrowName + " cards from your discard into your hand."],
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
                                return [4 /*yield*/, multichoice(state, "Choose " + n + " cards to put into your hand.", state.discard.filter(function (c) { return c.name != harrowName; }).map(asChoice), n, n)];
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
/*
const chiselPlowName = "Chisel Plow"
const chiselPlow:CardSpec = {
    name: chiselPlowName,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
        text: [`If you have less than ${num(3, chiselPlowName)} in play,
            put your discard into your hand and put this in play.`],
        transform: (s, card) => async function(state) {
            if (state.play.filter(c => c.name == chiselPlowName).length < 3) {
                state = await moveMany(state.discard, 'hand')(state)
                state = await move(card, 'play')(state)
            }
            return state
        }
    }],
    replacers: [{
        text: `Cards named ${churnName} cost an additional @ to play.`,
        kind: 'costIncrease',
        handles: p => (p.card.name == churnName) && (p.actionKind == 'play'),
        replace: p => ({...p, cost: addCosts(p.cost, energy(1))})
    }]
}
cards.push(chiselPlow)
*/
var smithy = {
    name: 'Smithy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [actionsEffect(4), buysEffect(1)],
};
cards.push(smithy);
var marketSquare = {
    name: 'Market Square',
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
};
cards.push(supplyForCard(marketSquare, coin(2), { afterBuy: [createInPlayEffect(fair, 1)] }));
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
cards.push(supplyForCard((brigade, 4, 'expansion')

const brigade:CardSpec = {name: 'Brigade',
    buyCost: coin(4),
    staticReplacers: [{
        text: `Cards cost @ more to play for each brigade token on them.
               Whenever this increases a card's cost, remove all brigade tokens from it.`,
        kind: 'cost',
        handles: (x, state, card) => (x.actionKind == 'play')
            && state.find(x.card).count('brigade') > 0,
        replace: (x, state, card) => {
            const increase = x.card.count('brigade')
            return {...x, cost:{...x.cost,
                energy:x.cost.energy+increase,
                effects: x.cost.effects.concat([removeToken(x.card, 'brigade', 'all')]),
            }}
        }
    }],
    replacers: [{
        text: `Cards you play cost @ less.
               Whenever this reduces a card's cost, put a brigade token on it.`,
        kind: 'cost',
        handles: (x, state) => (x.actionKind == 'play'),
        replace: function(x:CostParams, state:State, card:Card) {
            const newCost:Cost = subtractCost(x.cost, {energy:1})
            if (!eq(newCost, x.cost)) {
                newCost.effects = newCost.effects.concat([
                    addToken(x.card, 'brigade'),
                ])
                return {...x, cost:newCost}
            } else {
                return x
            }
        }
    }]
}
cards.push(brigade)
*/
var governorName = 'Governor';
var governor = {
    name: governorName,
    buyCost: coin(6),
    relatedCards: [villager],
    effects: [actionsEffect(2), buysEffect(1), createInPlayEffect(villager)],
    staticTriggers: [{
            kind: 'buy',
            handles: function (e) { return (e.card.name == province.name); },
            text: "Whenever you buy a " + province.name + ", put all " + governorName + "s in your discard into your hand.",
            transform: function (e, s) { return moveMany(s.discard.filter(function (card) { return card.name == governorName; }), 'hand'); }
        }]
};
cards.push(governor);
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
            text: "When you play a " + silver.name + ", +1 action.",
            handles: function (e) { return e.card.name == silver.name; },
            transform: function (e, s, c) { return gainActions(1, c); },
        }, {
            kind: 'play',
            text: "When you play a " + gold.name + ", +1 buy.",
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
    /*effects: [{
        text: [`Choose one: discard a card in your hand to create two copies of it in your discard,
        or trash a card in your discard to return up to two cards with the same name to your hand.`],
        transform: () => async function(state) {
            let target:Card|null; [state, target] = await choice(
                state,
                `Choose a card in your hand to discard in order to create two copies;
                or choose a card in your discard to trash in order to return up to two cards with the same name to your hand.`,
                state.hand.concat(state.discard).map(asChoice)
            )
            if (target === null) {
                return state
            } else if (state.find(target).place == 'discard') {
                state = await trash(target)(state)
                const name:string = target.name
                let targets:Card[]; [state, targets] = await multichoice(
                    state,
                    `Choose up to 2 cards named ${name} to return to your hand`,
                    state.discard.filter(c => c.name == name).map(asChoice),
                    2
                )
                state = await moveMany(targets, 'hand')(state)
                return state
            } else if (state.find(target).place == 'hand') {
                state = await move(target, 'discard')(state)
                state = await repeat(create(target.spec, 'discard'), 2)(state)
                return state
            }
            return state
        }
    }]*/
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
cards.push(greatFeast);
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
cards.push(scaffold)
*/
var universityName = 'University';
var university = {
    name: universityName,
    buyCost: coin(12),
    effects: [actionsEffect(4), buysEffect(2)],
    staticReplacers: [{
            text: universityName + " costs $1 less per action you have, but not less than $1.",
            kind: 'cost',
            handles: function (p) { return (p.card.name == universityName) && p.actionKind == 'buy'; },
            replace: function (p, s) {
                var k = Math.max(Math.min(s.actions, p.cost.coin - 1), 0);
                return __assign(__assign({}, p), { cost: addCosts(p.cost, { coin: -k }) });
            }
        }]
};
cards.push(university);
/*
const steelName = 'Steel'
const steel:CardSpec = {
    name: steelName,
    buyCost: coin(3),
    effects: [coinsEffect(4)],
    staticReplacers: [{
        text: `Whenever you would create a ${steelName}, first pay a buy.
            If you can't, then don't create it.` ,
        kind: 'create',
        handles: p => p.spec.name == steelName,
        replace: (p, s) => (s.buys == 0)
            ? {...p, zone:null}
            : {...p, effects: [(c:Card) => payCost({...free, buys: 1})].concat(p.effects)}
    }]
}
cards.push(steel)
*/
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
    effects: [coinsEffect(2)],
    triggers: [{
            kind: 'afterBuy',
            text: "After buying a card costing $3 or more, create " + aOrNum(2, horse.name) + " in your discard.",
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
            text: ["Pay all actions to create that many " + horse.name + "s in your discard."],
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
var bustlingVillage = {
    name: 'Bustling Village',
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [{
            text: ["+1 action for each differently-named card in play."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = countDistinctNames(state.play);
                                return [4 /*yield*/, gainActions(n, card)(state)];
                            case 1:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }, createInPlayEffect(villager)]
};
cards.push(bustlingVillage);
/*
const inn:CardSpec = {
    name: 'Inn',
    buyCost: coin(6),
    relatedCards: [horse, villager],
    effects: [createEffect(horse, 'discard', 2), createInPlayEffect(villager, 2)],
}
cards.push(inn)
*/
/*
const guildHall:CardSpec = {
    name: 'Guild Hall',
    buyCost: coin(5),
    fixedCost: energy(1),
    effects: [coinsEffect(3)],
    triggers: [{
        text: `Whenever you use an event,
            discard this to use it again.`,
        kind: 'use',
        handles: (e, state, card) => state.find(card).place == 'play',
        transform: (e, state, card) => async function(state) {
            state = await move(card, 'discard')(state)
            return e.card.use(card)(state)
        }
    }]
}
cards.push(guildHall)
*/
var ritual = {
    name: 'Ritual',
    buyCost: coin(4),
    effects: [{
            text: ["Play then trash two cards from your hand.",
                "If you do, choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var target1, target2, cost, _a, _b, target;
                    var _c, _d, e_1, _e;
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
                                return [4 /*yield*/, choice(state, "Choose a second card to play then trash (" + renderCostOrZero(target1.cost('buy', state)) + " so far)", state.hand.map(asChoice))];
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
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                    }
                                    finally { if (e_1) throw e_1.error; }
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
cards.push(overextend)
*/
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
    effects: [coinsEffect(4), buysEffect(4), createInPlayEffect(embargo)],
    relatedCards: [embargo],
};
cards.push(contraband);
/*
const diamond:CardSpec = {
    name: 'Diamond',
    buyCost: coin(4),
    effects: [coinsEffect(2), pointsEffect(1)],
}
cards.push(diamond)

const lurkerName = 'Lurker'
const lurker:CardSpec = {
    name: lurkerName,
    buyCost: coin(3),
    effects: [actionsEffect(1), {
        text: [`Trash a card in your hand.
               If you trash a ${lurkerName}, buy a card in the supply costing up to $8,
               otherwise buy a ${lurkerName}.`],
        transform: (s, c) => async function(state) {
            let card:Card|null; [state, card] = await choice(state,
                'Choose a card to trash.',
                state.hand.map(asChoice))
            if (card != null) state = await trash(card)(state)
            if (card !== null && card.name == lurkerName) {
                state = await workshopTransform(8, c)(state)
            } else {
                state = await applyToTarget(
                    target => target.buy(c),
                    'Choose a card to buy.',
                    state => state.supply.filter(sup => sup.name == lurkerName)
                )(state)
            }
            return state
        }
    }]
}
cards.push(lurker)
*/
var coffers = {
    name: 'Coffers',
    buyCost: coin(3),
    effects: [coinsEffect(1), buysEffect(1), chargeEffect(1)],
    ability: [{
            text: ["Trash this. For each charge token onit, +$1 and +1 action."],
            transform: function (state, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.find(c).charge;
                                return [4 /*yield*/, trash(c)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainCoins(n, c)(state)];
                            case 2:
                                state = _a.sent();
                                return [4 /*yield*/, gainActions(n, c)(state)];
                            case 3:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(coffers);
/*
const kiln:CardSpec = {
    name: 'Kiln',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
        text: `When you play a card, discard this to create a copy of the card you played.`,
        kind: 'play',
        handles: (e, s, c) => true,
        transform: (e, s, c) => doAll([move(c, 'discard'), create(e.card.spec, 'discard')])
    }]
}
cards.push(kiln)
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
cards.push(werewolf)
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
            text: ["If a " + moon.name + " in play has an odd number of charge tokens, trash a card, +$3 and +1 buy.",
                "Otherwise, +3 actions."],
            transform: function (s, c) { return (s.play.some(function (c) { return c.name == moon.name && c.charge % 2 == 1; })) ?
                doAll([applyToTarget(function (card) { return trash(card); }, "Trash a card in your hand.", function (state) { return state.hand; }), gainCoins(3, c), gainBuys(1, c)]) :
                gainActions(3, c); }
        }]
};
cards.push(werewolf);
var churnName = 'Churn';
var churn = {
    name: churnName,
    effects: [actionsEffect(1), {
            text: ["For each charge token on this put a non-" + churnName + " card from your discard into your hand."],
            transform: function (state, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n, cards;
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                n = state.find(card).charge;
                                return [4 /*yield*/, multichoice(state, "Choose " + n + " cards to put into your hand.", state.discard.filter(function (c) { return c.name != churnName; }).map(asChoice), n)];
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
        }]
};
cards.push(supplyForCard(churn, coin(3), {
    replacers: [startsWithCharge(churn.name, 2)]
}));
var accelerate = {
    name: 'Accelerate',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 4 }),
    effects: [{
            text: ["Put an accelerate token on each card in the supply."],
            transform: function (state, card) { return doAll(state.supply.map(function (c) { return addToken(c, 'accelerate'); })); }
        }],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard\n        whose supply has an accelerate token,\n        instead remove an accelerate token to set the card aside.\n        Then play it it is set aside.", function (p, s, c) { return nameHasToken(p.spec, 'accelerate', s); }, function (p, s, c) { return applyToTarget(function (t) { return removeToken(t, 'accelerate', 1, true); }, 'Remove an accelerate token.', function (state) { return state.supply.filter(function (t) { return t.name == p.spec.name; }); }, { cost: true }); })]
};
events.push(accelerate);
/*
const masonry:CardSpec = {
    name: 'Masonry',
    fixedCost: coin(2),
    effects: [chargeEffect()],
    staticTriggers: [{
        kind: 'afterBuy',
        text: `After buying a card other than with this, remove a charge token from this to buy a card
        in the supply with equal cost.`,
        handles: (e, s, c) => c.charge > 0 && e.source.id != c.id,
        transform: (e, s, c) => payToDo(discharge(c, 1), applyToTarget(
            target => target.buy(c),
            `Choose a card to buy.`,
            state => state.supply.filter(sup => eq(sup.cost('buy', state), e.card.cost('buy', state)))
        ))
    }]
}
events.push(masonry)
*/
var swap = {
    name: 'Swap',
    fixedCost: coin(1),
    effects: [targetedEffect(function (target) { return doAll([trash(target), applyToTarget(function (target2) { return create(target2.spec, 'hand'); }, "Choose a card to copy.", function (state) { return state.supply.filter(function (sup) { return leq(sup.cost('buy', state), target.cost('buy', state)); }); })]); }, "Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.", function (state) { return state.hand; })],
};
events.push(swap);
/*
const :CardSpec = {
    name: 'Planning',
    buyCost: coin(6),
    effects: [],
    relatedCards: [infrastructure],
    triggers: [{
        text: `Whenever you pay @,
               create that many ${infrastructure.name}s in play.`,
        kind: 'cost',
        handles: (e, state, card) => e.cost.energy > 0,
        transform: (e, state, card) => repeat(create(infrastructure, 'play'), e.cost.energy)
    }]
}
cards.push(planning)
*/
var privateWorksName = 'Private Works';
var infrastructure = {
    name: 'Infrastructure',
    replacers: [{
            text: "Events other than " + privateWorksName + " cost @ less to use. Whenever this reduces a cost, trash it.",
            kind: 'cost',
            handles: function (x) { return x.actionKind == 'use' && x.card.name != privateWorksName; },
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
var privateWorks = {
    name: privateWorksName,
    relatedCards: [infrastructure],
    fixedCost: __assign(__assign({}, free), { coin: 3, energy: 1 }),
    effects: [createInPlayEffect(infrastructure, 2)]
};
events.push(privateWorks);
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
events.push(alliance);
/*
const buildUp:CardSpec = {
    name: 'Urbanize',
    fixedCost: coin(3),
    variableCosts: [costPer(coin(1))],
    effects: [createInPlayEffect(infrastructure), incrementCost()],
    relatedCards: [infrastructure]
}
events.push(buildUp)

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
cards.push(supplyForCard((avenue, 5, 'expansion')
*/
var inn = {
    name: 'Inn',
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)]
};
cards.push(supplyForCard(inn, coin(5), { afterBuy: [createEffect(horse, 'discard', 3)] }));
/*
const exploit:CardSpec = {
    name: 'Exploit',
    fixedCost: energy(1),
    effects: [{
        text: [`Trash all cards in play for +1 vp each.`],
        transform: state => doAll(state.play.map(c => doAll([trash(c), gainPoints(1)])))
    }]
}
events.push(exploit)
*/
/*
const treasury:CardSpec = {
    name: 'Treasury',
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [actionsEffect(3)],
    triggers: [{
        text: `Whenever you gain more than one action, gain that much $ minus one.`,
        kind: 'resource',
        handles: e => e.resource == 'actions' && e.amount > 1,
        transform: e => gainCoins(e.amount - 1)
    }]
}
cards.push(treasury)
*/
var statue = {
    name: 'Statue',
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1)],
    triggers: [{
            text: "Whenever you buy a card costing $3 or more, +1 vp.",
            kind: 'buy',
            handles: function (e, s) { return e.card.cost('buy', s).coin >= 3; },
            transform: function (e, s, c) { return gainPoints(1, c); },
        }]
};
cards.push(statue);
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
var farmlandName = 'Farmland';
var farmland = {
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a " + farmlandName + " the normal way, +7 vp.",
            handles: function (e) { return e.source == 'act' && e.card.name == farmlandName; },
            transform: function (e, s, c) { return gainPoints(7, c); }
        }],
};
cards.push(farmland);
var hallOfEchoes = {
    name: 'Hall of Echoes',
    fixedCost: __assign(__assign({}, free), { energy: 1, coin: 3 }),
    effects: [{
            text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
            transform: function (state) { return doAll(state.hand.filter(function (c) { return c.count('echo') == 0; }).map(function (c) { return create(c.spec, 'hand', function (x) { return addToken(x, 'echo'); }); })); }
        }],
    staticReplacers: [fragileEcho()],
};
events.push(hallOfEchoes);
//# sourceMappingURL=expansion.js.map