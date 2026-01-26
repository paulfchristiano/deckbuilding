// data/encounters.ts - Encounter definitions using async MetaTransforms
// Ported from main.ts to use the new state-based architecture
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { encounters, addBuffer, gainCard, gainEvent, gainPotion, gainRelic, compose, } from '../metaLogic.js';
import { emptyBottle, inkwell } from './relics.js';
import { create, cardRewards, eventRewards, relicRewards, potionRewards, leq, coin, free } from '../gameLogic.js';
import { mirrorBrew } from './potions.js';
// ----------------------------- Utility Functions
function shuffleArray(array) {
    var _a;
    var result = __spreadArray([], __read(array), false);
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = __read([result[j], result[i]], 2), result[i] = _a[0], result[j] = _a[1];
    }
    return result;
}
// ----------------------------- Encounter Factory Functions
function bottledCard(spec) {
    return {
        name: "Bottled ".concat(spec.name),
        triggers: [{
                kind: 'gameStart',
                text: "Start each course with a copy of ".concat(spec.name, " in hand."),
                handles: function () { return true; },
                transform: function () { return function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, create(spec, 'hand')(state)];
                                case 1:
                                    state = _a.sent();
                                    return [2 /*return*/, state];
                            }
                        });
                    });
                }; }
            }],
        relatedCards: [spec]
    };
}
function simpleEvent(_a) {
    var name = _a.name, description = _a.description, options = _a.options;
    function transform(state) {
        return __awaiter(this, void 0, void 0, function () {
            var takenOptions, _loop_1, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        takenOptions = new Array(options.length).fill(false);
                        _loop_1 = function () {
                            var optionsOpen, choice, option;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        optionsOpen = options.map(function (opt, index) { return (opt.disabled == undefined || !opt.disabled(state)) && !takenOptions[index]; });
                                        if (optionsOpen.every(function (open) { return !open; })) {
                                            return [2 /*return*/, { value: name }];
                                        }
                                        return [4 /*yield*/, state.ui.chooseOption(state, description, options.map(function (opt, index) { return ({
                                                label: opt.name,
                                                description: opt.description,
                                                spec: opt.displaySpec,
                                                disabled: !optionsOpen[index],
                                                value: index
                                            }); }))];
                                    case 1:
                                        choice = _b.sent();
                                        if (choice == null)
                                            return [2 /*return*/, { value: null }];
                                        option = options[choice];
                                        return [4 /*yield*/, option.transform(state)];
                                    case 2:
                                        _b.sent();
                                        if (option.disablesSelf) {
                                            takenOptions[choice] = true;
                                        }
                                        if (option.finishesEncounter === undefined || option.finishesEncounter) {
                                            return [2 /*return*/, { value: name }];
                                        }
                                        return [2 /*return*/];
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
    }
    return { name: name, transform: transform };
}
// Find a Bottle encounter
export function findABottle(s, g) {
    return simpleEvent({
        name: 'Find a Bottle',
        description: 'Choose how to use this magical bottle.',
        options: [
            {
                name: 'Bottle a Card',
                description: 'Lose a card from your deck costing up to $5. Gain a relic that starts each course with a copy of it (with echo).',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var card;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a card to bottle:', __spreadArray([], __read(state.data.collectedCards.filter(function (x) { return leq(x.buyCost || free, coin(5)); })), false), true)];
                                case 1:
                                    card = _a.sent();
                                    if (!card)
                                        return [2 /*return*/];
                                    state.removeCard(card.name);
                                    return [4 /*yield*/, gainRelic(bottledCard(card))(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disabled: function (state) { return state.data.collectedCards.length === 0; },
                finishesEncounter: true,
            },
            {
                name: 'Gain Empty Bottle',
                description: 'Each time you add a card to your deck, start the course with a copy (with echo).',
                transform: gainRelic(emptyBottle),
                finishesEncounter: true,
            }
        ]
    });
}
encounters.push(findABottle);
// TODO: allow someone to cancel from the choice and then go back to the previous screen.
var mirrorName = 'Silver Mirror';
var mirrorRelic = {
    name: mirrorName,
    simpleText: [
        'The next time you gain a relic,',
        'gain an additional copy of that relic.'
    ],
    metaTriggers: [{
            kind: 'relic',
            handles: function (e, s, relic) { return e.relic.name != mirrorName; },
            transform: function (e, s, relic) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, gainRelic(e.relic.spec)(state)];
                            case 1:
                                _a.sent();
                                state.removeRelic(relic.id);
                                return [2 /*return*/];
                        }
                    });
                });
            }; },
        }]
};
// Mirror Maker encounter
function mirrorMaker(s, g) {
    return simpleEvent({
        name: 'Mirror Maker',
        description: 'The mirror maker offers magical duplication.',
        options: [
            {
                // TODO: you should be able to just see the potion mirror brew when you mouse over.
                name: 'Grind the mirror into a potion.',
                description: 'Gain a Mirror Brew.',
                transform: gainPotion(mirrorBrew),
                finishesEncounter: true,
            },
            {
                name: 'Use the mirror.',
                description: 'Copy one of your relics.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var relicSpecs, relic;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    relicSpecs = state.data.relics.map(function (r) { return r.spec; });
                                    return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a relic to duplicate:', relicSpecs, true)];
                                case 1:
                                    relic = _a.sent();
                                    if (!relic)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, gainRelic(relic)(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disabled: function (state) { return state.data.relics.length === 0; },
                finishesEncounter: true,
            },
            {
                name: 'Take the mirror for the road.',
                description: 'The next time you gain a relic, gain another copy.',
                transform: gainRelic(mirrorRelic),
                finishesEncounter: true,
            }
        ]
    });
}
encounters.push(mirrorMaker);
// Variety Pack encounter - pre-generates options at creation time
function varietyPack(s, g) {
    var offerCard = g.sample(cardRewards);
    var offerEvent = g.sample(eventRewards);
    var offerPotion = g.sample(potionRewards);
    var offerRelic = g.sample(relicRewards);
    return simpleEvent({
        name: 'Variety Pack',
        description: 'Choose one reward from the assortment.',
        options: [
            {
                name: 'Take Card',
                description: '',
                displaySpec: offerCard,
                transform: gainCard(offerCard),
                finishesEncounter: true,
            },
            {
                name: 'Take Event',
                description: '',
                displaySpec: offerEvent,
                transform: gainEvent(offerEvent),
                finishesEncounter: true,
            },
            {
                name: 'Take Potion',
                description: '',
                displaySpec: offerPotion,
                transform: gainPotion(offerPotion),
                finishesEncounter: true,
            },
            {
                name: 'Take Relic',
                description: '',
                displaySpec: offerRelic,
                transform: gainRelic(offerRelic),
                finishesEncounter: true,
            }
        ]
    });
}
encounters.push(varietyPack);
// Trading Post encounter - pre-generates offers at creation time
export function tradingPost(state, g) {
    var offerCard = g.sample(cardRewards);
    var offerEvent = g.sample(eventRewards);
    var offerPotion = g.sample(potionRewards);
    var offerRelic = g.sample(relicRewards);
    return simpleEvent({
        name: 'Trading Post',
        description: 'Trade items of the same type. You can make multiple trades.',
        options: [
            {
                name: "Trade Card for ".concat((offerCard === null || offerCard === void 0 ? void 0 : offerCard.name) || 'nothing'),
                description: 'Give up one of your cards to receive this one.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var card;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a card to trade away:', __spreadArray([], __read(state.data.collectedCards), false), true)];
                                case 1:
                                    card = _a.sent();
                                    if (!card)
                                        return [2 /*return*/];
                                    state.removeCard(card.name);
                                    return [4 /*yield*/, gainCard(offerCard)(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disablesSelf: true,
                disabled: function (state) { return state.data.collectedCards.length === 0; },
                finishesEncounter: false,
            },
            {
                name: "Trade Event for ".concat((offerEvent === null || offerEvent === void 0 ? void 0 : offerEvent.name) || 'nothing'),
                description: 'Give up one of your events to receive this one.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var event;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose an event to trade away:', __spreadArray([], __read(state.data.collectedEvents), false), true)];
                                case 1:
                                    event = _a.sent();
                                    if (!event)
                                        return [2 /*return*/];
                                    state.removeEvent(event.name);
                                    return [4 /*yield*/, gainEvent(offerEvent)(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disabled: function (state) { return state.data.collectedEvents.length === 0; },
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: "Trade Potion for ".concat((offerPotion === null || offerPotion === void 0 ? void 0 : offerPotion.name) || 'nothing'),
                description: 'Give up one of your potions to receive this one.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var potion;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a potion to trade away:', __spreadArray([], __read(state.data.potions), false), true)];
                                case 1:
                                    potion = _a.sent();
                                    if (!potion)
                                        return [2 /*return*/];
                                    state.removePotion(potion.id);
                                    return [4 /*yield*/, gainPotion(offerPotion)(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disabled: function (state) { return state.data.potions.length === 0; },
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: "Trade Relic for ".concat((offerRelic === null || offerRelic === void 0 ? void 0 : offerRelic.name) || 'nothing'),
                description: 'Give up one of your relics to receive this one.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () {
                        var relic;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, state.ui.chooseCard(state, 'Choose a relic to trade away:', state.data.relics, true)];
                                case 1:
                                    relic = _a.sent();
                                    if (!relic)
                                        return [2 /*return*/];
                                    state.removeRelic(relic.id);
                                    return [4 /*yield*/, gainRelic(offerRelic)(state)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                },
                disabled: function (state) { return state.data.relics.length === 0; },
                disablesSelf: true,
                finishesEncounter: false,
            },
            {
                name: 'Finish Trading',
                description: 'Done making trades.',
                transform: function (state) {
                    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/];
                    }); });
                },
                finishesEncounter: true,
            }
        ]
    });
}
encounters.push(tradingPost);
var cursedInkwell = {
    name: 'Cursed Inkwell',
    simpleText: ['Par is 1@ lower on each course.'],
    metaReplacers: [{
            kind: 'gameSetup',
            replace: function (p) { return (__assign(__assign({}, p), { par: p.par - 1 })); }
        }]
};
// The Scribe encounter
function theScribe() {
    return simpleEvent({
        name: 'The Scribe',
        description: 'The scribe offers tools for your journey.',
        options: [
            {
                name: 'Take the Inkwell',
                description: 'Par is 1@ higher on each course.',
                transform: gainRelic(inkwell),
                finishesEncounter: true,
            },
            {
                name: 'Use the quill.',
                description: '+3@ buffer.',
                transform: addBuffer(3),
                finishesEncounter: true,
            },
            {
                name: 'Use the cursed quill.',
                description: '+5@ buffer, but par is 1@ lower on each course.',
                transform: compose(addBuffer(5), gainRelic(cursedInkwell)),
                finishesEncounter: true,
            }
        ]
    });
}
encounters.push(theScribe);
//# sourceMappingURL=encounters.js.map