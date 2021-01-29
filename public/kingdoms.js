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
import { playGame, State } from './logic.js';
import { expansionNames, specToURL, cardsFrom } from './logic.js';
import { MalformedSpec, ReplayVictory, InvalidHistory, VersionMismatch, ReplayEnded } from './logic.js';
import { makeKingdom, goalForSpec, normalize, split, parseExpansionString, randomSeed, RANDOM, extractList } from './logic.js';
// register cards
import './cards/absurd.js';
import './cards/expansion.js';
import './cards/test.js';
export function normalizeURL(url) {
    var spec = specFromURL(url);
    var kingdom = makeKingdom(spec, allCardsEvents);
    var normalizedSpec = {
        kind: 'goal', vp: goalForSpec(spec),
        spec: { kind: 'pick', cards: kingdom.cards, events: kingdom.events }
    };
    return specToURL(normalizedSpec);
}
export function specFromURL(search, excludeGoal) {
    var e_1, _a, e_2, _b;
    if (excludeGoal === void 0) { excludeGoal = false; }
    var searchParams = new URLSearchParams(search);
    if (!excludeGoal) {
        var vp_goal = searchParams.get('vp');
        if (vp_goal !== null) {
            return { kind: 'goal',
                vp: Number(vp_goal),
                spec: specFromURL(search, true) };
        }
    }
    var urlKind = searchParams.get('kind');
    var cardsString = searchParams.get('cards');
    var cards = (cardsString === null) ? []
        : normalize(split(cardsString, ','));
    var eventsString = searchParams.get('events');
    var events = (eventsString === null) ? []
        : normalize(split(eventsString, ','));
    var expansionString = searchParams.get('expansions');
    var expansions = parseExpansionString(expansionString);
    var seed = searchParams.get('seed') || randomSeed();
    var kind;
    function pickOrPickR() {
        if (cards.indexOf(RANDOM) >= 0 || events.indexOf(RANDOM) >= 0) {
            return 'pickR';
        }
        else {
            return 'pick';
        }
    }
    if (urlKind !== null) {
        if (urlKind == 'pick' || urlKind == 'pickR')
            kind = pickOrPickR();
        else
            kind = urlKind;
    }
    else {
        if (cards.length == 0 && events.length == 0)
            kind = 'full';
        else
            kind = pickOrPickR();
    }
    switch (kind) {
        case 'full':
            return { kind: kind, randomizer: { seed: seed, expansions: expansions } };
        case 'pick':
            var cardSpecs = [];
            var eventSpecs = [];
            if (cards !== null) {
                try {
                    for (var _c = __values(extractList(cards, allCards)), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var card = _d.value;
                        if (card == RANDOM)
                            throw new MalformedSpec('Random card is only allowable in type pickR');
                        else
                            cardSpecs.push(card);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (events !== null) {
                try {
                    for (var _e = __values(extractList(events, allEvents)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var card = _f.value;
                        if (card == RANDOM)
                            throw new MalformedSpec('Random card is only allowable in type pickR');
                        else
                            eventSpecs.push(card);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return { kind: kind, cards: cardSpecs, events: eventSpecs };
        case 'require':
            return {
                kind: kind, randomizer: { seed: seed, expansions: expansions },
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents),
            };
        case 'pickR':
            return { kind: kind, randomizer: { seed: seed, expansions: expansions },
                cards: (cards === null) ? [] : extractList(cards, allCards),
                events: (events === null) ? [] : extractList(events, allEvents) };
        case 'test': return { kind: 'test' };
        default: throw new MalformedSpec("Invalid kind " + kind);
    }
}
export var randomPlaceholder = { name: RANDOM };
export var allCards = cardsFrom('cards', expansionNames);
export var allEvents = cardsFrom('events', expansionNames);
export var allCardsEvents = { cards: allCards, events: allEvents };
export function verifyScore(spec, history, score) {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, playGame(State.fromReplayString(history, spec, allCardsEvents))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, [true, ""]]; //unreachable
                case 2:
                    e_3 = _a.sent();
                    if (e_3 instanceof ReplayVictory) {
                        if (e_3.state.energy == score)
                            return [2 /*return*/, [true, ""]];
                        else
                            return [2 /*return*/, [false, "Computed score was " + e_3.state.energy]];
                    }
                    else if (e_3 instanceof InvalidHistory) {
                        return [2 /*return*/, [false, "" + e_3]];
                    }
                    else if (e_3 instanceof VersionMismatch) {
                        return [2 /*return*/, [false, "" + e_3]];
                    }
                    else if (e_3 instanceof ReplayEnded) {
                        return [2 /*return*/, [false, "" + e_3]];
                    }
                    else {
                        throw e_3;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=kingdoms.js.map