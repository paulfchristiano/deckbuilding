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
import { choice, asChoice, trash, addCosts, leq, gainPoints, gainActions, gainCoins, gainBuys, free, addToken, tick, allowNull, targetedEffect, energy, coin, applyToTarget, cannotUse } from '../logic.js';
export var cards = [];
export var events = [];
var manor = {
    name: 'Manor',
    buyCost: coin(6),
    fixedCost: energy(1),
    triggers: [{
            text: 'Whenever you pay @, gain that many vp.',
            kind: 'cost',
            handles: function (e) { return e.cost.energy > 0; },
            transform: function (e, s, c) { return gainPoints(e.cost.energy, c); }
        }]
};
cards.push(manor);
var ballista = {
    name: 'Ballista',
    buyCost: coin(5),
    effects: [{
            text: ["Play then trash up to two cards from your hand.",
                "Gain a card from the supply whose cost is at most the sum of their costs."],
            transform: function (s, card) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var targets, i, target, cost, targets_1, targets_1_1, target;
                    var _a, e_1, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                targets = [];
                                i = 0;
                                _c.label = 1;
                            case 1:
                                if (!(i < 2)) return [3 /*break*/, 8];
                                target = void 0;
                                return [4 /*yield*/, choice(state, 'Choose a card to play then trash.', allowNull(state.hand.map(asChoice)))];
                            case 2:
                                _a = __read.apply(void 0, [_c.sent(), 2]), state = _a[0], target = _a[1];
                                if (!(target != null)) return [3 /*break*/, 5];
                                return [4 /*yield*/, target.play(card)(state)];
                            case 3:
                                state = _c.sent();
                                return [4 /*yield*/, trash(target)(state)];
                            case 4:
                                state = _c.sent();
                                targets.push(target);
                                _c.label = 5;
                            case 5:
                                if (!(i == 0)) return [3 /*break*/, 7];
                                return [4 /*yield*/, tick(card)(state)];
                            case 6:
                                state = _c.sent();
                                _c.label = 7;
                            case 7:
                                i++;
                                return [3 /*break*/, 1];
                            case 8:
                                cost = __assign(__assign({}, free), { buys: 1 });
                                try {
                                    for (targets_1 = __values(targets), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                                        target = targets_1_1.value;
                                        cost = addCosts(cost, target.cost('buy', state));
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (targets_1_1 && !targets_1_1.done && (_b = targets_1.return)) _b.call(targets_1);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                                return [4 /*yield*/, applyToTarget(function (target2) { return target2.buy(card); }, 'Choose a card to buy.', function (s) { return s.supply.filter(function (c) { return leq(c.cost('buy', state), cost); }); })(state)];
                            case 9:
                                state = _c.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
cards.push(ballista);
var reducerCard = { name: 'Reducer Card',
    buyCost: coin(5), effects: [targetedEffect(function (target, card) { return addToken(target, 'reduce'); }, "Put a reduce token on a card. Cards you play cost @ less to play for each reduce token on them.", function (state) { return state.hand; })],
    staticReplacers: [{
            text: "Cards you play cost @ less to play for each reduce token on them",
            kind: 'cost',
            handles: function (x, state, card) { return state.find(x.card).count('reduce') > 0; },
            replace: function (x, state, card) {
                var reduction = Math.min(x.cost.energy, state.find(x.card).count('reduce'));
                return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction }) });
            }
        }]
};
cards.push(reducerCard);
var betterGreed = {
    name: 'Better Greed',
    fixedCost: __assign(__assign({}, free), { energy: 1 }),
    effects: [{
            text: ["Pay all vp. For each vp lost, +$2, +1 action, and +1 buy."],
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
                                return [4 /*yield*/, gainCoins(2 * n, card)(state)];
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
events.push(betterGreed);
var newDecay = {
    name: 'New Decay',
    restrictions: [cannotUse],
    staticTriggers: [{
            text: "When you play a card with fewer than two decay tokens on it, put a decay token on it.",
            kind: 'play',
            handles: function (e) { return e.card.count('decay') < 2; },
            transform: function (e, s, c) { return addToken(e.card, 'decay'); },
        }],
    staticReplacers: [{
            kind: 'costIncrease',
            text: "Cards with two or more decay tokens on them cost an additional $1 to play,",
            handles: function (e) { return e.actionKind == 'play' && e.card.count('decay') >= 2; },
            replace: function (p) { return (__assign(__assign({}, p), { cost: addCosts(p.cost, coin(1)) })); }
        }]
};
events.push(newDecay);
//# sourceMappingURL=test.js.map