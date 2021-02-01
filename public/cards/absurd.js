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
import { choice, asChoice, trash, addCosts, move, create, payToDo, free, discharge, addToken, removeToken, gainActions, gainResource, createAndTrack, doAll, moveMany, multichoice, chooseNatural, Victory, register, buyable, registerEvent, actionsEffect, buyEffect, pointsEffect, coinsEffect, targetedEffect, chargeEffect, createEffect, startsWithCharge, applyToTarget, fragileEcho, dedupBy, coin, energy, repeat, } from '../logic.js';
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
                    var allTokens, tokenCount, _a, _b, _c, token, count, e_1_1, numTypes, currentType, allTokens_1, allTokens_1_1, token, n, e_2_1;
                    var e_1, _d, e_2, _e, _f;
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
                                e_1_1 = _g.sent();
                                e_1 = { error: e_1_1 };
                                return [3 /*break*/, 8];
                            case 7:
                                try {
                                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
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
                                e_2_1 = _g.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 19];
                            case 18:
                                try {
                                    if (allTokens_1_1 && !allTokens_1_1.done && (_e = allTokens_1.return)) _e.call(allTokens_1);
                                }
                                finally { if (e_2) throw e_2.error; }
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
                    var targets, _a, _b, _c, token, count, total, targets_1, targets_1_1, target, e_3_1, n, e_4_1;
                    var _d, e_4, _e, e_3, _f, _g;
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
                                targets_1 = (e_3 = void 0, __values(targets)), targets_1_1 = targets_1.next();
                                _h.label = 5;
                            case 5:
                                if (!!targets_1_1.done) return [3 /*break*/, 8];
                                target = targets_1_1.value;
                                return [4 /*yield*/, removeToken(target, token, 'all')(state)];
                            case 6:
                                state = _h.sent();
                                _h.label = 7;
                            case 7:
                                targets_1_1 = targets_1.next();
                                return [3 /*break*/, 5];
                            case 8: return [3 /*break*/, 11];
                            case 9:
                                e_3_1 = _h.sent();
                                e_3 = { error: e_3_1 };
                                return [3 /*break*/, 11];
                            case 10:
                                try {
                                    if (targets_1_1 && !targets_1_1.done && (_f = targets_1.return)) _f.call(targets_1);
                                }
                                finally { if (e_3) throw e_3.error; }
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
                                e_4_1 = _h.sent();
                                e_4 = { error: e_4_1 };
                                return [3 /*break*/, 19];
                            case 18:
                                try {
                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                }
                                finally { if (e_4) throw e_4.error; }
                                return [7 /*endfinally*/];
                            case 19: return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
buyable(redistribute, 4, 'absurd', { replacers: [startsWithCharge(redistribute.name, 2)] });
//# sourceMappingURL=absurd.js.map