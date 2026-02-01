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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { gainActions, gainBuys, create, copper, refresh, relicRewards, sourceHasName } from '../gameLogic.js';
import { addBuffer, } from '../metaLogic.js';
// Bag of Coins: Start with an extra copper
export var bagOfCoins = {
    name: 'Bag of Coins',
    simpleText: ['Start with an extra copper.'],
    triggers: [{
            kind: 'gameStart',
            text: 'At the start of the game, create a copper in your discard.',
            handles: function () { return true; },
            transform: function () { return create(copper, 'discard'); }
        }]
};
relicRewards.push(bagOfCoins);
export var bagOfPreparation = {
    name: 'Bag of Preparation',
    simpleText: ['+2 actions each time you refresh.'],
    triggers: [{
            kind: 'afterUse',
            handles: function (e, s, c) { return e.card.name === refresh.name; },
            text: 'After using Refresh, +2 actions.',
            transform: function (e, s, c) { return gainActions(2, c); }
        }],
};
relicRewards.push(bagOfPreparation);
export var courier = {
    name: 'Courier',
    simpleText: ['+1 buy each time you refresh.'],
    triggers: [{
            kind: 'resource',
            text: 'Whenever you gain actions from refreshing, gain 1 buy.',
            handles: function (e, state, card) {
                return e.resource === 'actions' && e.source !== 'act' &&
                    typeof e.source !== 'string' && sourceHasName(e.source, refresh.name);
            },
            transform: function (e, s, card) { return gainBuys(1, card); }
        }]
};
relicRewards.push(courier);
// Inkwell: Par is 1@ higher on each course
export var inkwell = {
    name: 'Inkwell',
    simpleText: ["Par is 1@ higher on each course."],
    metaReplacers: [{
            kind: 'gameSetup',
            replace: function (p) { return (__assign(__assign({}, p), { par: p.par + 1 })); }
        }]
};
relicRewards.push(inkwell);
// Elegant Quill: Gain 3@ buffer (one-time effect on acquisition)
export var elegantQuill = {
    name: 'Elegant Quill',
    simpleText: ["+3@ buffer when you gain this."],
    metaTriggers: [{
            kind: 'relic',
            handles: function (e, s, self) { return self.id == e.relic.id; },
            transform: function (e) { return addBuffer(3); }
        }]
};
relicRewards.push(elegantQuill);
// Broken Lever: VP targets are 25% lower
export var brokenLever = {
    name: 'Broken Lever',
    simpleText: ["VP targets are 25% lower."],
    metaReplacers: [{
            kind: 'gameSetup',
            replace: function (p) { return (__assign(__assign({}, p), { vpGoal: Math.floor(p.vpGoal * 0.75) })); }
        }]
};
relicRewards.push(brokenLever);
// Cursed Quill: Par is 6@ lower, gain 2@ buffer at start of each course
export var cursedInkwell = {
    name: 'Cursed Inkwell',
    simpleText: [
        'Par is 4@ lower on each course.',
        'Gain 3@ buffer at the start of each course.'
    ],
    metaReplacers: [{
            kind: 'gameSetup',
            replace: function (p) { return (__assign(__assign({}, p), { par: p.par - 4 })); }
        }],
    metaTriggers: [{
            kind: 'start',
            handles: function (e) { return true; },
            transform: function (e) { return addBuffer(3); }
        }]
};
relicRewards.push(cursedInkwell);
// TODO: implement
// Need to have a replacer that can put in cards into the challengespec
// But then also want it to take effect immediately.
/*
export const lookingGlass: CardSpec = {
    name: 'Looking Glass',
    simpleText: [
        '2 random cards and 1 random event',
        'in all future encounters.'
    ],
    // This relic's effect requires random selection from available cards/events,
    // which must be done in main.ts. We use a gameSetup replacer with a marker.
    metaReplacers: [{
        kind: 'gameSetup',
        replace: (p: GameSetupParams) => ({
            ...p,
            // Add markers that main.ts will interpret
            // The actual random cards/events are added by main.ts before calling this
        })
    }]
}
    */
export var emptyBottle = {
    name: 'Empty Bottle',
    simpleText: [
        'When you add a card to your deck,',
        'start the next course with a copy in hand.'
    ],
    mutableTriggers: function (relic) { return [{
            kind: 'gameStart',
            text: 'At the start of the game, create a copy of each bottled card in your hand.',
            handles: function () { return true; },
            transform: function () { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, _b, spec, e_1_1;
                    var e_1, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                _d.trys.push([0, 5, 6, 7]);
                                _a = __values(relic.notedCards || []), _b = _a.next();
                                _d.label = 1;
                            case 1:
                                if (!!_b.done) return [3 /*break*/, 4];
                                spec = _b.value;
                                return [4 /*yield*/, create(spec, 'hand')(state)];
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
        }]; },
    metaTriggers: [{
            kind: 'end',
            handles: function () { return true; },
            transform: function (e, s, relic) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        state.applyToRelic(function (r) { return r.update({ notedCards: [] }); }, relic);
                        return [2 /*return*/];
                    });
                });
            }; },
        }, {
            kind: 'card',
            handles: function () { return true; },
            transform: function (e, s, relic) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var notedCards;
                    return __generator(this, function (_a) {
                        notedCards = relic.notedCards || [];
                        state.applyToRelic(function (r) { return r.update({ notedCards: __spreadArray(__spreadArray([], __read(notedCards), false), [e.card], false) }); }, relic);
                        return [2 /*return*/];
                    });
                });
            }; },
        }]
};
relicRewards.push(emptyBottle);
export var banner = {
    name: 'Banner',
    simpleText: [
        'For each 2@ you beat par,',
        'gain 1@ buffer.'
    ],
    metaTriggers: [{
            kind: 'end',
            handles: function (e) { return e.score < e.par; },
            transform: function (e) {
                var energyUnderPar = e.par - e.score;
                var bufferGain = Math.floor(energyUnderPar / 2);
                return addBuffer(bufferGain);
            }
        }]
};
relicRewards.push(banner);
// Question Card: Future rewards have 1 more option
export var questionCard = {
    name: 'Question Card',
    simpleText: ['Future rewards have 2 more options.'],
    metaReplacers: [{
            kind: 'reward',
            replace: function (p) { return (__assign(__assign({}, p), { optionCount: p.optionCount + 2 })); }
        }]
};
relicRewards.push(questionCard);
//# sourceMappingURL=relics.js.map