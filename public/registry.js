// registry.ts - Central registries for all game and meta-game data
// This file holds the mutable registries that data files populate on import.
// Uses 'any' for card types to avoid circular dependencies - proper typing
// is enforced at the usage sites.
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
function emptySet() {
    return { cards: [], events: [] };
}
export var expansionNames = ['base'];
export var sets = {
    'core': emptySet(),
    'base': emptySet(),
};
// VP-generating cards/events to exclude from random selection
export var vpCardNames = new Set([
    'Estate', 'Duchy', 'Province',
    'Flower Market', 'Vibrant City', 'Frontier', 'Colony', 'Gardens', 'Palace', 'Duke', 'Turnpike',
    'Territory', 'Statue', 'Farmland',
    'Inverted Palace',
]);
export var vpEventNames = new Set([
    'Philanthropy',
]);
export var vpModes = [];
// ----------------------------- Meta-game Data Registries
// Potions - single-use items that persist across stages until used
export var allPotions = [];
// Relics - permanent items with meta-game effects
export var allRelics = [];
export var allBoons = [];
export var allEncounters = [];
// ----------------------------- Registration Functions
export function registerCards(cards, expansion) {
    sets[expansion].cards = cards;
}
export function registerEvents(events, expansion) {
    sets[expansion].events = events;
}
export function registerVPMode(mode) {
    vpModes.push(mode);
}
export function registerPotion(potion) {
    allPotions.push(potion);
}
export function registerRelic(relic) {
    allRelics.push(relic);
}
export function registerBoon(boon) {
    allBoons.push(boon);
}
export function registerEncounter(encounter) {
    allEncounters.push(encounter);
}
// ----------------------------- Query Functions
export function getAllCards() {
    var e_1, _a;
    var result = [];
    try {
        for (var expansionNames_1 = __values(expansionNames), expansionNames_1_1 = expansionNames_1.next(); !expansionNames_1_1.done; expansionNames_1_1 = expansionNames_1.next()) {
            var name_1 = expansionNames_1_1.value;
            result.push.apply(result, __spreadArray([], __read(sets[name_1].cards), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (expansionNames_1_1 && !expansionNames_1_1.done && (_a = expansionNames_1.return)) _a.call(expansionNames_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
export function getAllEvents() {
    var e_2, _a;
    var result = [];
    try {
        for (var expansionNames_2 = __values(expansionNames), expansionNames_2_1 = expansionNames_2.next(); !expansionNames_2_1.done; expansionNames_2_1 = expansionNames_2.next()) {
            var name_2 = expansionNames_2_1.value;
            result.push.apply(result, __spreadArray([], __read(sets[name_2].events), false));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (expansionNames_2_1 && !expansionNames_2_1.done && (_a = expansionNames_2.return)) _a.call(expansionNames_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return result;
}
export function getAvailableCards() {
    var _a;
    return ((_a = sets['base']) === null || _a === void 0 ? void 0 : _a.cards) || [];
}
export function getAvailableEvents() {
    var _a;
    return ((_a = sets['base']) === null || _a === void 0 ? void 0 : _a.events) || [];
}
//# sourceMappingURL=registry.js.map