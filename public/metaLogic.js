// metaLogic.ts - Meta-game state and transformations
// This handles the roguelike progression layer on top of the core game.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { Card, vpModes, boons, cardRewards, eventRewards, coinKey, energyEventKey } from './gameLogic.js';
export var encounters = [];
// ----------------------------- Constants
export var TOTAL_STAGES = 8;
export var INITIAL_BUFFER = 8;
// Base par values for each stage
export var BASE_PARS = [30, 27, 24, 20, 18, 16, 14, 8];
// TODO: add a tooltip that shows you the par and target, the cards, etc.
export function renderChallenge(spec, state) {
    var gameSpec = makeSpec(state, spec);
    return "".concat(spec.vpMode.name, " + ").concat(spec.boons.map(function (b) { return b.name; }).join(' + '), " (").concat(gameSpec.vp, "vp in ").concat(gameSpec.par, "@)");
}
var Relic = /** @class */ (function (_super) {
    __extends(Relic, _super);
    function Relic(spec, id, notedCards, ticks, tokens, place, 
    // we assign each card the smallest unused index in its current zone, for consistency of hotkey mappings
    zoneIndex) {
        if (notedCards === void 0) { notedCards = undefined; }
        if (ticks === void 0) { ticks = [0]; }
        if (tokens === void 0) { tokens = new Map(); }
        if (place === void 0) { place = 'void'; }
        if (zoneIndex === void 0) { zoneIndex = 0; }
        var _this = _super.call(this, spec, id, ticks, tokens, place, zoneIndex) || this;
        _this.spec = spec;
        _this.notedCards = notedCards;
        _this.ticks = ticks;
        _this.tokens = tokens;
        _this.place = place;
        _this.zoneIndex = zoneIndex;
        return _this;
    }
    Relic.prototype.metaReplacers = function () {
        return this.spec.metaReplacers || [];
    };
    Relic.prototype.metaTriggers = function () {
        return this.spec.metaTriggers || [];
    };
    Relic.prototype.triggers = function () {
        return (this.spec.mutableTriggers ? this.spec.mutableTriggers(this) : []).concat(_super.prototype.triggers.call(this));
    };
    Relic.prototype.replacers = function () {
        return (this.spec.mutableReplacers ? this.spec.mutableReplacers(this) : []).concat(_super.prototype.replacers.call(this));
    };
    Relic.prototype.update = function (newValues) {
        return new Relic(this.spec, this.id, (newValues.notedCards === undefined) ? this.notedCards : newValues.notedCards, (newValues.ticks === undefined) ? this.ticks : newValues.ticks, (newValues.tokens === undefined) ? this.tokens : newValues.tokens, (newValues.place === undefined) ? this.place : newValues.place, (newValues.zoneIndex === undefined) ? this.zoneIndex : newValues.zoneIndex);
    };
    return Relic;
}(Card));
export { Relic };
function doReward(state, rewardIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var reward, _a, result, card, event_1, potion, relic;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reward = state.data.rewards[rewardIndex];
                    _a = reward.kind;
                    switch (_a) {
                        case 'encounter': return [3 /*break*/, 1];
                        case 'card': return [3 /*break*/, 3];
                        case 'event': return [3 /*break*/, 7];
                        case 'potion': return [3 /*break*/, 11];
                        case 'relic': return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 19];
                case 1: return [4 /*yield*/, reward.encounter.transform(state)];
                case 2:
                    result = _b.sent();
                    markRewardResult(state, rewardIndex, result);
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a card reward', reward.options)];
                case 4:
                    card = _b.sent();
                    if (!(card !== null)) return [3 /*break*/, 6];
                    return [4 /*yield*/, gainCard(card)(state)];
                case 5:
                    _b.sent();
                    markRewardResult(state, rewardIndex, card.name);
                    _b.label = 6;
                case 6: return [2 /*return*/];
                case 7: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose an event reward:', reward.options)];
                case 8:
                    event_1 = _b.sent();
                    if (!(event_1 !== null)) return [3 /*break*/, 10];
                    return [4 /*yield*/, gainEvent(event_1)(state)];
                case 9:
                    _b.sent();
                    markRewardResult(state, rewardIndex, event_1.name);
                    _b.label = 10;
                case 10: return [2 /*return*/];
                case 11: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a potion reward:', reward.options)];
                case 12:
                    potion = _b.sent();
                    if (!(potion !== null)) return [3 /*break*/, 14];
                    return [4 /*yield*/, gainPotion(potion)(state)];
                case 13:
                    _b.sent();
                    markRewardResult(state, rewardIndex, potion.name);
                    _b.label = 14;
                case 14: return [2 /*return*/];
                case 15: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a relic reward:', reward.options)];
                case 16:
                    relic = _b.sent();
                    if (!(relic !== null)) return [3 /*break*/, 18];
                    return [4 /*yield*/, gainRelic(relic)(state)];
                case 17:
                    _b.sent();
                    markRewardResult(state, rewardIndex, relic.name);
                    _b.label = 18;
                case 18: return [2 /*return*/];
                case 19: return [2 /*return*/];
            }
        });
    });
}
import { Generator, randomString } from './rng.js';
var MetaState = /** @class */ (function () {
    function MetaState(ui, seed) {
        if (seed === void 0) { seed = null; }
        this.ui = ui;
        this.redoStack = [];
        this.undoStack = [];
        this.generators = new Map();
        if (seed === null) {
            this.seed = randomString();
        }
        else {
            this.seed = seed;
        }
        this.masterGenerator = new Generator(this.seed);
        var data = {
            stage: 0,
            buffer: INITIAL_BUFFER,
            stageScores: Array(TOTAL_STAGES).fill(null),
            stagePars: Array(TOTAL_STAGES).fill(null),
            challenge: null,
            rewards: [],
            collectedCards: [],
            collectedEvents: [],
            potions: [],
            relics: [],
            nextID: 1,
            playingGame: false,
        };
        this.data = data;
        this.checkpoint = data;
    }
    MetaState.prototype.removeFromZone = function (id, zone) {
        var _a;
        this.update((_a = {},
            _a[zone] = this.data[zone].filter(function (c) { return c.id !== id; }),
            _a));
    };
    MetaState.prototype.applyToRelic = function (fn, r) {
        this.update({ relics: this.data.relics.map(function (rel) { return rel.id === r.id ? fn(rel) : rel; }) });
    };
    MetaState.prototype.removePotion = function (id) {
        this.removeFromZone(id, 'potions');
    };
    MetaState.prototype.removeRelic = function (id) {
        this.removeFromZone(id, 'relics');
    };
    MetaState.prototype.removeCard = function (name) {
        this.update({
            collectedCards: this.data.collectedCards.filter(function (c) { return c.name !== name; })
        });
    };
    MetaState.prototype.removeEvent = function (name) {
        this.update({
            collectedEvents: this.data.collectedEvents.filter(function (e) { return e.name !== name; })
        });
    };
    MetaState.prototype.generator = function (key) {
        if (!this.generators.has(key)) {
            var newGen = this.masterGenerator.newGenerator();
            this.generators.set(key, newGen);
        }
        return this.generators.get(key);
    };
    MetaState.prototype.clearHistory = function () {
        this.undoStack = [];
        this.redoStack = [];
        this.checkpoint = this.data;
        console.assert(this.data.challenge != null); // Should not a set checkpoint while selecting paths.
    };
    MetaState.prototype.setCheckpoint = function () {
        console.assert(this.data.challenge != null); // Should not a set checkpoint while selecting paths.
        this.undoStack.push(this.checkpoint);
        this.checkpoint = this.data;
        this.redoStack = [];
    };
    MetaState.prototype.update = function (updates) {
        this.data = __assign(__assign({}, this.data), updates);
    };
    // Undo to previous checkpoint
    MetaState.prototype.undo = function () {
        if (this.checkpoint != this.data)
            this.data = this.checkpoint;
        if (this.undoStack.length == 0)
            return;
        var previousCheckpoint = this.undoStack.pop();
        this.redoStack.push(this.checkpoint);
        this.checkpoint = previousCheckpoint;
        this.data = previousCheckpoint;
    };
    // Redo a previously undone action
    MetaState.prototype.redo = function () {
        if (this.redoStack.length === 0)
            return;
        var nextState = this.redoStack.pop();
        this.undoStack.push(this.checkpoint);
        this.checkpoint = nextState;
        this.data = nextState;
    };
    MetaState.prototype.canUndo = function () {
        return this.undoStack.length > 0 || this.checkpoint != this.data;
    };
    MetaState.prototype.canRedo = function () {
        return this.redoStack.length > 0;
    };
    return MetaState;
}());
export { MetaState };
// Identity transform - does nothing
export var noop = function (state) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
};
// Compose multiple transforms (handles async)
export function compose() {
    var transforms = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        transforms[_i] = arguments[_i];
    }
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var transforms_1, transforms_1_1, t, e_1_1;
            var e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        transforms_1 = __values(transforms), transforms_1_1 = transforms_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!transforms_1_1.done) return [3 /*break*/, 4];
                        t = transforms_1_1.value;
                        return [4 /*yield*/, t(state)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        transforms_1_1 = transforms_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (transforms_1_1 && !transforms_1_1.done && (_a = transforms_1.return)) _a.call(transforms_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
}
// ----------------------------- Transform Builders
// Add buffer
export function addBuffer(amount) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state.update({ buffer: state.data.buffer + amount });
                return [2 /*return*/];
            });
        });
    };
}
// Add a card to collection
export function gainCard(card) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state.update({ collectedCards: __spreadArray(__spreadArray([], __read(state.data.collectedCards), false), [card], false) });
                return [2 /*return*/];
            });
        });
    };
}
// Add an event to collection
export function gainEvent(event) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                state.update({ collectedEvents: __spreadArray(__spreadArray([], __read(state.data.collectedEvents), false), [event], false) });
                return [2 /*return*/];
            });
        });
    };
}
// Add a potion
export function gainPotion(potion) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var nextID, potionCard;
            return __generator(this, function (_a) {
                nextID = state.data.nextID;
                potionCard = new Card(potion, nextID);
                state.update({
                    potions: __spreadArray(__spreadArray([], __read(state.data.potions), false), [potionCard], false),
                    nextID: nextID + 1
                });
                return [2 /*return*/];
            });
        });
    };
}
// Add a relic
export function gainRelic(relic) {
    return function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var nextID, relicCard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextID = state.data.nextID;
                        relicCard = new Relic(relic, nextID);
                        state.update({
                            relics: __spreadArray(__spreadArray([], __read(state.data.relics), false), [relicCard], false),
                            nextID: nextID + 1
                        });
                        return [4 /*yield*/, trigger({ kind: 'relic', relic: relicCard }, state)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
}
// Remove a card from collection by name
export function removeCard(state, name) {
    state.update({
        collectedCards: state.data.collectedCards.filter(function (c) { return c.name !== name; })
    });
}
export function removeRelic(state, id) {
    state.update({
        relics: state.data.relics.filter(function (c) { return c.id !== id; })
    });
}
// Remove an event from collection by name
export function removeEvent(state, name) {
    state.update({
        collectedEvents: state.data.collectedEvents.filter(function (e) { return e.name !== name; })
    });
}
// Mark a reward as used with selected card
export function markRewardResult(state, index, result) {
    var rewards = __spreadArray([], __read(state.data.rewards), false);
    if (index >= 0 && index < rewards.length) {
        rewards[index] = __assign(__assign({}, rewards[index]), { result: result });
    }
    state.update({ rewards: rewards });
}
export function endCourse(score, par, state) {
    return __awaiter(this, void 0, void 0, function () {
        var newScores, newPars;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newScores = __spreadArray([], __read(state.data.stageScores), false);
                    newPars = __spreadArray([], __read(state.data.stagePars), false);
                    newScores[state.data.stage] = score;
                    newPars[state.data.stage] = par;
                    state.update({ stageScores: newScores, stagePars: newPars });
                    return [4 /*yield*/, trigger({ kind: 'end', score: score, par: par }, state)];
                case 1:
                    _a.sent();
                    if (!(score > par)) return [3 /*break*/, 3];
                    return [4 /*yield*/, addBuffer(par - score)(state)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
export function applyMetaReplacers(kind, params, state) {
    var e_2, _a, e_3, _b;
    var relics = state.data.relics;
    try {
        for (var relics_1 = __values(relics), relics_1_1 = relics_1.next(); !relics_1_1.done; relics_1_1 = relics_1.next()) {
            var relic = relics_1_1.value;
            var metaReplacers = relic.metaReplacers();
            try {
                for (var metaReplacers_1 = (e_3 = void 0, __values(metaReplacers)), metaReplacers_1_1 = metaReplacers_1.next(); !metaReplacers_1_1.done; metaReplacers_1_1 = metaReplacers_1.next()) {
                    var replacer = metaReplacers_1_1.value;
                    if (replacer.kind === kind) {
                        // Type assertion via unknown needed due to TypeScript limitations with discriminated unions
                        var replaceFn = replacer.replace;
                        params = replaceFn(params);
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (metaReplacers_1_1 && !metaReplacers_1_1.done && (_b = metaReplacers_1.return)) _b.call(metaReplacers_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (relics_1_1 && !relics_1_1.done && (_a = relics_1.return)) _a.call(relics_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return params;
}
// ----------------------------- Meta Trigger Application
function trigger(e, state) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, relic, metaTriggers, metaTriggers_1, metaTriggers_1_1, rawTrigger, trigger_1, handles, e_4_1, e_5_1;
        var e_5, _c, e_4, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 11, 12, 13]);
                    _a = __values(state.data.relics), _b = _a.next();
                    _e.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 10];
                    relic = _b.value;
                    metaTriggers = relic.metaTriggers();
                    if (!metaTriggers) return [3 /*break*/, 9];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 7, 8, 9]);
                    metaTriggers_1 = (e_4 = void 0, __values(metaTriggers)), metaTriggers_1_1 = metaTriggers_1.next();
                    _e.label = 3;
                case 3:
                    if (!!metaTriggers_1_1.done) return [3 /*break*/, 6];
                    rawTrigger = metaTriggers_1_1.value;
                    if (!(rawTrigger.kind === e.kind)) return [3 /*break*/, 5];
                    trigger_1 = rawTrigger;
                    handles = trigger_1.handles(e, state, relic);
                    if (!handles) return [3 /*break*/, 5];
                    return [4 /*yield*/, trigger_1.transform(e, state, relic)(state)];
                case 4:
                    _e.sent();
                    _e.label = 5;
                case 5:
                    metaTriggers_1_1 = metaTriggers_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_4_1 = _e.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (metaTriggers_1_1 && !metaTriggers_1_1.done && (_d = metaTriggers_1.return)) _d.call(metaTriggers_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                    return [7 /*endfinally*/];
                case 9:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_5_1 = _e.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 13];
                case 12:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_5) throw e_5.error; }
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    });
}
// ----------------------------- Utility Functions
// Create a spec for a given challenge.
export function makeSpec(state, challenge) {
    var e_6, _a;
    var par = BASE_PARS[state.data.stage];
    var vpTarget = challenge.vpMode.target;
    var cards = challenge.vpMode.cards.slice();
    var events = challenge.vpMode.events.slice();
    try {
        for (var _b = __values(challenge.boons), _c = _b.next(); !_c.done; _c = _b.next()) {
            var boon = _c.value;
            par -= boon.parReduction;
            cards.push.apply(cards, __spreadArray([], __read(boon.cards), false));
            events.push.apply(events, __spreadArray([], __read(boon.events), false));
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_6) throw e_6.error; }
    }
    // Add collected cards and events, sorted by cost
    var sortedCollectedCards = __spreadArray([], __read(state.data.collectedCards), false).sort(function (a, b) { return coinKey(a) - coinKey(b); });
    var sortedCollectedEvents = __spreadArray([], __read(state.data.collectedEvents), false).sort(function (a, b) { return energyEventKey(a) - energyEventKey(b); });
    cards.push.apply(cards, __spreadArray([], __read(sortedCollectedCards), false));
    events.push.apply(events, __spreadArray([], __read(sortedCollectedEvents), false));
    var gameSetupParams = applyMetaReplacers('gameSetup', {
        par: par,
        vpGoal: vpTarget,
        cardSpecs: cards,
        eventSpecs: events
    }, state);
    return {
        vp: gameSetupParams.vpGoal,
        par: gameSetupParams.par,
        cards: gameSetupParams.cardSpecs,
        events: gameSetupParams.eventSpecs,
        potions: state.data.potions,
        relics: state.data.relics,
    };
}
// Get reward option count based on relics
export function getRewardOptionCount(state) {
    var params = applyMetaReplacers('reward', { optionCount: 3 }, state);
    return params.optionCount;
}
// ----------------------- Generate data
function randomChallenge(state) {
    var stage = state.data.stage;
    var generator = state.generator("challenges".concat(stage));
    var vpMode = generator.sample(vpModes);
    var boon = generator.sample(boons);
    // For now, no replacement effects
    return {
        stage: stage,
        vpMode: vpMode,
        boons: [boon],
    };
}
function makePaths(state) {
    var stage = state.data.stage;
    var generator = state.generator("paths".concat(stage)).newGenerator();
    var allOptions = ['card', 'card', 'event', 'potion', 'relic', 'encounter'];
    var shuffledOptions = generator.samples(allOptions, 4);
    var challenge1 = randomChallenge(state);
    var challenge2 = randomChallenge(state);
    return [
        { rewards: shuffledOptions.slice(0, 2), challenge: challenge1 },
        { rewards: shuffledOptions.slice(2, 4), challenge: challenge2 },
    ];
}
// TODO: actually create these in gameLogic and then then fill them in the ./data files
import { potionRewards, relicRewards } from './gameLogic.js';
// TODO: avoid repeating (by passing in a list of already-chosen items to avoid, and making the PRG re-sample after hitting one)
function fillPath(state, skeleton) {
    var e_7, _a;
    var rewards = [];
    try {
        for (var _b = __values(skeleton.rewards), _c = _b.next(); !_c.done; _c = _b.next()) {
            var rewardKind = _c.value;
            // Generate options for each reward
            // For now, just use placeholder empty arrays
            var generator = state.generator("rewards".concat(rewardKind)).newGenerator();
            if (rewardKind === 'encounter') {
                var factory = generator.sample(encounters);
                var encounter = factory(state, generator);
                rewards.push({ kind: 'encounter', encounter: encounter, result: null });
            }
            else if (rewardKind === 'card') {
                var options = generator.samples(cardRewards, getRewardOptionCount(state));
                rewards.push({ kind: 'card', options: options, result: null });
            }
            else if (rewardKind === 'event') {
                var options = generator.samples(eventRewards, getRewardOptionCount(state));
                rewards.push({ kind: 'event', options: options, result: null });
            }
            else if (rewardKind === 'potion') {
                var options = generator.samples(potionRewards, getRewardOptionCount(state));
                rewards.push({ kind: 'potion', options: options, result: null });
            }
            else if (rewardKind === 'relic') {
                var options = generator.samples(relicRewards, getRewardOptionCount(state));
                rewards.push({ kind: 'relic', options: options, result: null });
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return { rewards: rewards, challenge: skeleton.challenge };
}
var Undo = /** @class */ (function (_super) {
    __extends(Undo, _super);
    function Undo() {
        var _this = _super.call(this, 'Undo') || this;
        Object.setPrototypeOf(_this, Undo.prototype);
        return _this;
    }
    return Undo;
}(Error));
export { Undo };
var Redo = /** @class */ (function (_super) {
    __extends(Redo, _super);
    function Redo() {
        var _this = _super.call(this, 'Redo') || this;
        Object.setPrototypeOf(_this, Redo.prototype);
        return _this;
    }
    return Redo;
}(Error));
export { Redo };
function adoptPath(state, path) {
    state.update({ challenge: path.challenge, rewards: path.rewards });
}
// TODO: implement undo (figure out how it is done right now).
// Note that all checkpoints are at a point where you want to back into the main loop in this method.
export function playGame(ui) {
    return __awaiter(this, void 0, void 0, function () {
        var state, initialPath, gameSpec, _a, score, potionsRemaining, paths, path, _b, challengeOrReward, _c, e_8;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    state = new MetaState(ui);
                    initialPath = fillPath(state, {
                        rewards: ['card', 'card', 'event', 'potion'],
                        challenge: randomChallenge(state)
                    });
                    adoptPath(state, initialPath);
                    state.clearHistory();
                    _d.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 19];
                    console.assert(state.checkpoint == state.data); // Should always be at a checkpoint when starting this loop
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 17, , 18]);
                    if (!state.data.playingGame) return [3 /*break*/, 10];
                    gameSpec = makeSpec(state, state.data.challenge);
                    return [4 /*yield*/, state.ui.playGame(gameSpec)];
                case 3:
                    _a = _d.sent(), score = _a.score, potionsRemaining = _a.potionsRemaining;
                    state.update({ potions: potionsRemaining });
                    return [4 /*yield*/, endCourse(score, gameSpec.par, state)];
                case 4:
                    _d.sent();
                    state.update({ stage: state.data.stage + 1 });
                    if (!(state.data.stage >= TOTAL_STAGES)) return [3 /*break*/, 6];
                    // Game over - player has completed all stages
                    return [4 /*yield*/, state.ui.showMessage(state, 'Congratulations! You have completed all stages!')];
                case 5:
                    // Game over - player has completed all stages
                    _d.sent();
                    return [2 /*return*/];
                case 6:
                    paths = makePaths(state).map(function (skel) { return fillPath(state, skel); });
                    if (!(paths.length > 1)) return [3 /*break*/, 8];
                    return [4 /*yield*/, state.ui.pickPath(state, paths)];
                case 7:
                    _b = _d.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _b = paths[0];
                    _d.label = 9;
                case 9:
                    path = _b;
                    state.update({ challenge: path.challenge, rewards: path.rewards, playingGame: false });
                    state.clearHistory();
                    return [3 /*break*/, 16];
                case 10: return [4 /*yield*/, state.ui.pickNextStep(state)];
                case 11:
                    challengeOrReward = _d.sent();
                    _c = challengeOrReward.kind;
                    switch (_c) {
                        case ('challenge'): return [3 /*break*/, 12];
                        case ('reward'): return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 12: return [4 /*yield*/, trigger({ kind: 'start', stage: state.data.stage }, state)];
                case 13:
                    _d.sent();
                    state.update({ playingGame: true });
                    state.setCheckpoint();
                    return [3 /*break*/, 16];
                case 14: return [4 /*yield*/, doReward(state, challengeOrReward.index)];
                case 15:
                    _d.sent();
                    state.setCheckpoint();
                    return [3 /*break*/, 16];
                case 16: return [3 /*break*/, 18];
                case 17:
                    e_8 = _d.sent();
                    console.log(e_8);
                    if (e_8 instanceof Undo) {
                        state.undo();
                    }
                    else if (e_8 instanceof Redo) {
                        state.redo();
                    }
                    else {
                        throw e_8;
                    }
                    return [3 /*break*/, 18];
                case 18: return [3 /*break*/, 1];
                case 19: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=metaLogic.js.map