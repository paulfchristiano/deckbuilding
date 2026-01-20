// data/victory.ts - Victory point cards, events, and VP modes
// VP modes define victory point cards/events and target scores for stages
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
import { vpModes, coin, energy, pointsEffect, actionsEffect, coinsEffect, buyEffect, gainPoints, buyTrigger, noop, charge, startsWithCharge, a, payCost, free, cannotUse } from '../gameLogic.js';
// ========== VP CARDS ==========
// VP cards - kept for victory modes but not in core supply
export var estate = { name: 'Estate',
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
};
export var duchy = { name: 'Duchy',
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(2)]
};
export var province = { name: 'Province',
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(3)]
};
var colony = { name: 'Colony',
    fixedCost: energy(1),
    effects: [pointsEffect(6)],
};
var flowerMarket = {
    name: 'Flower Market',
    buyCost: coin(2),
    effects: [buyEffect(), pointsEffect(1)],
    staticTriggers: [buyTrigger(pointsEffect(1))]
};
export var vibrantCity = {
    name: 'Vibrant City',
    effects: [pointsEffect(2), actionsEffect(1)],
    buyCost: coin(5),
};
function chargeUpTo(max) {
    return {
        text: ["Put a charge token on this if it has less than ".concat(max, ".")],
        transform: function (state, card) { return (card.charge >= max) ? noop : charge(card, 1); }
    };
}
var frontierName = 'Frontier';
var frontier = {
    name: frontierName,
    simpleText: [
        "+2 vp.",
        "This increases by 1vp each time you play it, up to +6vp."
    ],
    buyCost: coin(4),
    effects: [{
            text: ['+1 vp per charge token on this.'],
            transform: function (state, card) { return gainPoints(state.find(card).charge, card); }
        }, chargeUpTo(6)],
    staticReplacers: [startsWithCharge(frontierName, 2)]
};
export var gardens = {
    name: "Gardens",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
            text: ['+1 vp per 8 cards in your hand, discard, resolving, and play.'],
            transform: function (state, card) { return gainPoints(Math.floor((state.hand.length + state.discard.length
                + state.play.length + state.resolvingCards().length) / 8), card); }
        }]
};
var territoryName = 'Territory';
export var territory = {
    simpleText: [
        "+2 vp.",
        "Leave this in your hand when you play it."
    ],
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(2)],
    staticReplacers: [{
            kind: 'move',
            text: "When you play a ".concat(territoryName, " from your hand, leave it there."),
            handles: function (p) { return p.card.name == territoryName && p.toZone == 'resolving' && p.fromZone == 'hand'; },
            replace: function (p) { return (__assign(__assign({}, p), { skip: true })); }
        }]
};
var farmlandName = 'Farmland';
export var farmland = {
    simpleText: ["+7 vp if you played this the normal way from your hand."],
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a ".concat(farmlandName, " the normal way, +7 vp."),
            handles: function (e) { return e.source == 'act' && e.card.name == farmlandName; },
            transform: function (e, s, c) { return gainPoints(7, c); }
        }],
};
export var palace = {
    name: 'Palace',
    fixedCost: energy(1),
    buyCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(2), coinsEffect(2)]
};
export var duke = {
    name: 'Duke',
    buyCost: coin(4),
    effects: [],
    triggers: [{
            text: "Whenever you play ".concat(a(duchy.name), ", +1 vp."),
            kind: 'play',
            handles: function (e) { return e.card.name == duchy.name; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
// ========== VP EVENTS ==========
export var philanthropy = {
    name: 'Philanthropy',
    fixedCost: coin(10),
    effects: [{
            text: ['Pay all $.', '+1 vp per $ paid.'],
            transform: function (s, c) { return function (state) {
                return __awaiter(this, void 0, void 0, function () {
                    var n;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                n = state.coin;
                                return [4 /*yield*/, payCost(__assign(__assign({}, free), { coin: n }), c)(state)];
                            case 1:
                                state = _a.sent();
                                return [4 /*yield*/, gainPoints(n, c)(state)];
                            case 2:
                                state = _a.sent();
                                return [2 /*return*/, state];
                        }
                    });
                });
            }; }
        }]
};
export var thoroughfare = {
    name: 'Thoroughfare',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'play',
            text: "Whenever you play a card, +1 vp.",
            handles: function () { return true; },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
export var monument = {
    name: 'Monument',
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
            kind: 'buy',
            text: "Whenever you buy a card costing $3 or more, +1 vp.",
            handles: function (e, state) {
                var cost = e.card.cost('buy', state);
                return cost.coin >= 3;
            },
            transform: function (e, state, card) { return gainPoints(1, card); }
        }]
};
export var capitalization = {
    name: 'Capitalization',
    fixedCost: coin(1),
    effects: [pointsEffect(1)]
};
// ========== VP MODES ==========
vpModes.push({ name: 'Province', target: 30, cards: [province], events: [] }, { name: 'Duchy', target: 30, cards: [duchy], events: [] }, { name: 'Estate', target: 20, cards: [estate], events: [] }, { name: 'Thoroughfare', target: 80, cards: [], events: [thoroughfare] }, { name: 'Monument', target: 20, cards: [], events: [monument] }, { name: 'Capitalization', target: 60, cards: [], events: [capitalization] }, { name: 'Philanthropy', target: 40, cards: [], events: [philanthropy] }, { name: 'Duke', target: 50, cards: [duchy, duke], events: [] }, { name: 'Flower Market', target: 40, cards: [flowerMarket], events: [] }, { name: 'Farmland', target: 40, cards: [farmland], events: [] }, { name: 'Vibrant City', target: 40, cards: [vibrantCity], events: [] }, { name: 'Palace', target: 40, cards: [palace], events: [] }, { name: 'Territory', target: 40, cards: [territory], events: [] }, { name: 'Frontier', target: 70, cards: [frontier], events: [] }, { name: 'Gardens', target: 30, cards: [gardens], events: [] });
//# sourceMappingURL=victory.js.map