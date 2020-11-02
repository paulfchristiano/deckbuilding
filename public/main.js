// TODO: merge in the refactor from branch nodeck
// TODO: if a zone gets bigger and then smaller, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay out the zones a bit more nicely
// TODO: starting to see performance hiccups in big games
// TODO: probably don't want the public move method to allow moves into or out of resolving.
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { Shadow, State, Card } from './logic.js';
import { renderCost, renderEnergy } from './logic.js';
import { emptyState } from './logic.js';
import { logTypes } from './logic.js';
import { SetState, Undo, InvalidHistory } from './logic.js';
import { playGame, initialState } from './logic.js';
import { coerceReplayVersion, parseReplay, MalformedReplay } from './logic.js';
import { mixins, eventMixins, randomPlaceholder } from './logic.js';
import { VERSION, VP_GOAL } from './logic.js';
import { MalformedSpec, getTutorialSpec, specToURL, specFromURL } from './logic.js';
var keyListeners = new Map();
var symbolHotkeys = ['!', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']']; // '@', '#', '$' are confusing
var lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y']; // 'z' reserved for undo
var upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y']; // 'Z' reserved for redo
var numHotkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var supplyAndPlayHotkeys = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys);
var handHotkeys = lowerHotkeys.concat(upperHotkeys);
// want to put zones that are least likely to change earlier, to not distrupt assignment
var hotkeys = supplyAndPlayHotkeys.concat(handHotkeys).concat(symbolHotkeys);
var choiceHotkeys = handHotkeys.concat(supplyAndPlayHotkeys);
$(document).keydown(function (e) {
    var listener = keyListeners.get(e.key);
    if (e.altKey || e.ctrlKey || e.metaKey)
        return;
    if (listener != undefined) {
        e.preventDefault();
        listener();
    }
    if (e.key == ' ') { //It's easy and annoying to accidentally hit space
        e.preventDefault();
    }
});
function renderHotkey(hotkey) {
    if (hotkey == ' ')
        hotkey = '&#x23B5;';
    return "<div class=\"hotkey\">" + hotkey + "</div> ";
}
function interpretHint(hint) {
    if (hint == undefined)
        return undefined;
    switch (hint.kind) {
        case "number":
            var n = hint.val;
            var candidates = numHotkeys.concat(lowerHotkeys).concat(upperHotkeys);
            if (n < candidates.length)
                return candidates[n];
            else
                return undefined;
        case "none":
            return ' ';
        case "boolean":
            return (hint.val) ? 'y' : 'n';
        case "key":
            return hint.val;
        default: assertNever(hint);
    }
}
function renderKey(x) {
    switch (x.kind) {
        case 'card': return x.card.id;
        case 'string': return x.string;
        default: assertNever(x);
    }
}
var HotkeyMapper = /** @class */ (function () {
    function HotkeyMapper() {
    }
    HotkeyMapper.prototype.map = function (state, options) {
        var e_1, _a, e_2, _b, e_3, _c;
        var result = new Map();
        var taken = new Map();
        var pickable = new Set();
        try {
            for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                var option = options_1_1.value;
                pickable.add(renderKey(option.render));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        function takenByPickable(key) {
            var takenBy = taken.get(key);
            return (takenBy != undefined && pickable.has(takenBy));
        }
        function set(x, k) {
            result.set(x, k);
            taken.set(k, x);
        }
        function setFrom(cards, preferredHotkeys) {
            var e_4, _a;
            var preferredSet = new Set(preferredHotkeys);
            var otherHotkeys = hotkeys.filter(function (x) { return !preferredSet.has(x); });
            var toAssign = (preferredHotkeys.concat(otherHotkeys)).filter(function (x) { return !taken.has(x); });
            try {
                for (var cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
                    var card = cards_1_1.value;
                    var n = card.zoneIndex;
                    if (n < toAssign.length) {
                        set(card.id, toAssign[n]);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        //want to put zones that are most important not to change earlier
        setFrom(state.events, supplyAndPlayHotkeys);
        setFrom(state.supply, supplyAndPlayHotkeys);
        setFrom(state.hand, handHotkeys);
        setFrom(state.play, supplyAndPlayHotkeys);
        try {
            for (var options_2 = __values(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
                var option = options_2_1.value;
                var hint = interpretHint(option.hotkeyHint);
                if (hint != undefined &&
                    !result.has(renderKey(option.render))) {
                    if (!takenByPickable(hint))
                        set(renderKey(option.render), hint);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (options_2_1 && !options_2_1.done && (_b = options_2.return)) _b.call(options_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var index = 0;
        function nextHotkey() {
            while (true) {
                var key = hotkeys[index];
                if (!takenByPickable(key))
                    return key;
                else
                    index++;
            }
            return hotkeys[index];
        }
        try {
            for (var options_3 = __values(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
                var option = options_3_1.value;
                if (!result.has(renderKey(option.render))) {
                    var key = nextHotkey();
                    if (key != null)
                        set(renderKey(option.render), key);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (options_3_1 && !options_3_1.done && (_c = options_3.return)) _c.call(options_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    return HotkeyMapper;
}());
// ------------------ Rendering State
function assertNever(x) {
    throw new Error("Unexpected: " + x);
}
var TokenRenderer = /** @class */ (function () {
    function TokenRenderer() {
        this.tokenTypes = ['charge'];
    }
    TokenRenderer.prototype.tokenColor = function (token) {
        var tokenColors = ['black', 'red', 'orange', 'green', 'fuchsia', 'blue'];
        return tokenColors[this.tokenType(token) % tokenColors.length];
    };
    TokenRenderer.prototype.tokenType = function (token) {
        var n = this.tokenTypes.indexOf(token);
        if (n >= 0)
            return n;
        this.tokenTypes.push(token);
        return this.tokenTypes.length - 1;
    };
    TokenRenderer.prototype.render = function (tokens) {
        var e_5, _a;
        function f(n) {
            return (n == 1) ? '*' : n.toString();
        }
        var tokenHtmls = [];
        try {
            for (var _b = __values(tokens.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var token = _c.value;
                this.tokenType(token);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        for (var i = 0; i < this.tokenTypes.length; i++) {
            var token = this.tokenTypes[i];
            var n = tokens.get(token) || 0;
            if (n > 0) {
                tokenHtmls.push("<span id='token' style='color:" + this.tokenColor(token) + "'>" + f(n) + "</span>");
            }
        }
        return (tokenHtmls.length > 0) ? "(" + tokenHtmls.join('') + ")" : '';
    };
    TokenRenderer.prototype.renderTooltip = function (tokens) {
        var e_6, _a, e_7, _b;
        function f(n, s) {
            return (n == 1) ? s : s + " (" + n + ")";
        }
        var tokenHtmls = [];
        try {
            for (var _c = __values(tokens.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var token = _d.value;
                this.tokenType(token);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var _e = __values(this.tokenTypes), _f = _e.next(); !_f.done; _f = _e.next()) {
                var token = _f.value;
                var n = tokens.get(token) || 0;
                if (n > 0)
                    tokenHtmls.push(f(n, token));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return (tokenHtmls.length > 0) ? "Tokens: " + tokenHtmls.join(', ') : '';
    };
    return TokenRenderer;
}());
function describeCost(cost) {
    var coinCost = (cost.coin > 0) ? ["lose $" + cost.coin] : [];
    var energyCost = (cost.energy > 0) ? ["gain " + renderEnergy(cost.energy)] : [];
    var costs = coinCost.concat(energyCost);
    var costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing';
    return "Cost: " + costStr + ".";
}
function renderShadow(shadow, state, tokenRenderer) {
    var card = shadow.spec.card;
    var tokenhtml = tokenRenderer.render(card.tokens);
    var costhtml = '&nbsp';
    var ticktext = "tick=" + shadow.tick;
    var shadowtext = "shadow='true'";
    var tooltip;
    switch (shadow.spec.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.spec.card.spec);
            break;
        case 'trigger':
            tooltip = renderTrigger(shadow.spec.trigger, false);
            break;
        case 'effect':
            tooltip = renderEffects(shadow.spec.card.spec);
            break;
        case 'cost':
            tooltip = describeCost(shadow.spec.cost);
            break;
        case 'buying':
            tooltip = "Buying " + shadow.spec.card.name;
            break;
        default: assertNever(shadow.spec);
    }
    return ["<div class='card' " + ticktext + " " + shadowtext + ">",
        "<div class='cardbody'>" + card + tokenhtml + "</div>",
        "<div class='cardcost'>" + costhtml + "</div>",
        "<span class='tooltip'>" + tooltip + "</span>",
        "</div>"].join('');
}
function renderEffects(spec) {
    var e_8, _a;
    var parts = [];
    try {
        for (var _b = __values(spec.effects || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var effect = _c.value;
            parts = parts.concat(effect.text);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return parts.map(function (x) { return "<div>" + x + "</div>"; }).join('');
}
function renderAbility(spec) {
    var e_9, _a;
    var parts = [];
    try {
        for (var _b = __values(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var effect = _c.value;
            parts = parts.concat(effect.text.map(function (x) { return "<div>(ability) " + x + "</div>"; }));
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return parts.join('');
}
function renderCard(card, state, zone, options, tokenRenderer, count) {
    if (count === void 0) { count = 1; }
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer);
    }
    else {
        var costType = (zone == 'events') ? 'use' : 'play';
        var tokenhtml = tokenRenderer.render(card.tokens);
        var costhtml = (zone == 'supply') ?
            renderCost(card.cost('buy', state)) || '&nbsp' :
            renderCost(card.cost(costType, state)) || '&nbsp';
        var picktext = (options.pick !== undefined) ? "<div class='pickorder'>" + (options.pick + 1) + "</div>" : '';
        var counttext = (count != 1) ? "<div class='cardcount'>" + count + "</div>" : '';
        var chosenText = (options.pick !== undefined) ? 'true' : 'false';
        var choosetext = (options.option !== undefined)
            ? "choosable chosen='" + chosenText + "' option=" + options.option
            : '';
        var hotkeytext = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : '';
        var ticktext = "tick=" + card.ticks[card.ticks.length - 1];
        var result = "<div id='card" + card.id + "' class='card' " + ticktext + " " + choosetext + "> " + picktext + " " + counttext + "\n                    <div class='cardbody'>" + hotkeytext + " " + card + tokenhtml + "</div>\n                    <div class='cardcost'>" + costhtml + "</div>\n                    <span class='tooltip'>" + renderTooltip(card, state, tokenRenderer) + "</span>\n                </div>";
        return result;
    }
}
function renderTrigger(x, staticTrigger) {
    var desc = (staticTrigger) ? '(static)' : '(effect)';
    return "<div>" + desc + " " + x.text + "</div>";
}
function renderVariableCost(fixed, c) {
    var fixedStr = (fixed === undefined) ? '' : renderCost(fixed, true) + ' + ';
    return "<div>(cost) " + fixedStr + c.text + "</div>";
}
function renderBuyable(bs) {
    return bs.map(function (b) { return (b.text == undefined) ? '' : "<div>(static) " + b.text + "</div>"; }).join('');
}
function isZero(c) {
    return (c === undefined || renderCost(c) == '');
}
function cardText(spec) {
    var effectHtml = renderEffects(spec);
    var buyableHtml = (spec.restrictions != undefined) ? renderBuyable(spec.restrictions) : '';
    var costHtml = (spec.variableCost != undefined)
        ? renderVariableCost(spec.fixedCost, spec.variableCost) : '';
    var abilitiesHtml = renderAbility(spec);
    var triggerHtml = (spec.triggers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var replacerHtml = (spec.replacers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var staticTriggerHtml = (spec.staticTriggers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    var staticReplacerHtml = (spec.staticReplacers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    return [buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml].join('');
}
function renderTooltip(card, state, tokenRenderer) {
    var buyStr = !isZero(card.spec.buyCost) ?
        "(" + renderCost(card.spec.buyCost) + ")" : '---';
    var costStr = !isZero(card.spec.fixedCost) ?
        "(" + renderCost(card.baseCost(state, 'play')) + ")" : '---';
    var header = "<div>---" + buyStr + " " + card.name + " " + costStr + "---</div>";
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var baseFilling = header + cardText(card.spec) + tokensHtml;
    function renderRelated(spec) {
        var card = new Card(spec, -1);
        return renderTooltip(card, state, tokenRenderer);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "" + baseFilling + relatedFilling;
}
function renderSpec(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(" + renderCost(spec.buyCost) + ")&nbsp;";
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(" + renderCost(spec.fixedCost) + ")";
    var header = "<div>" + buyText + "<strong>" + spec.name + "</strong>" + costText + "</div>";
    var me = "<div class='spec'>" + header + cardText(spec) + "</div>";
    var related = (spec.relatedCards || []).map(renderSpec);
    return [me].concat(related).join('');
}
function getIfDef(m, x) {
    return (m == undefined) ? undefined : m.get(x);
}
var globalRendererState = {
    hotkeysOn: false,
    userURL: true,
    viewingKingdom: false,
    viewingMacros: false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: 'energy',
    compress: { play: false, supply: false, events: false, hand: false, discard: false }
};
var zoneNames = ['play', 'supply', 'events', 'hand', 'discard'];
function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper();
    globalRendererState.tokenRenderer = new TokenRenderer();
}
function linkForState(state, campaign) {
    if (campaign === void 0) { campaign = false; }
    var cs = campaign ? 'campaign&' : '';
    return "play?" + cs + specToURL(state.spec) + "#" + state.serializeHistory(false);
}
//Two maps should have the same sketch if the keys and values serialize the same
//0 is treated the same as no entry
function sketchMap(x) {
    var kvs = __spread(x.entries()).filter(function (kv) { return kv[1] > 0; }).map(function (kv) { return "" + kv[0] + kv[1]; });
    kvs.sort();
    return kvs.join(',');
}
function renderZone(state, zone, settings) {
    var e_10, _a, e_11, _b;
    if (settings === void 0) { settings = {}; }
    var e = $("#" + zone);
    var optionsFns = [];
    var optionsIds = [];
    function render(card, count) {
        if (count === void 0) { count = 1; }
        var option;
        var optionFn = getIfDef(settings.optionsMap, card.id);
        if (optionFn !== undefined) {
            option = optionsFns.length;
            optionsFns.push(optionFn);
            optionsIds.push(card.id);
        }
        var cardRenderOptions = {
            option: option,
            hotkey: getIfDef(settings.hotkeyMap, card.id),
            pick: getIfDef(settings.pickMap, card.id),
        };
        return renderCard(card, state, zone, cardRenderOptions, globalRendererState.tokenRenderer, count);
    }
    // two cards are rendered together in compress mode iff they have the same sketch
    function sketch(card) {
        return "" + card.name + sketchMap(card.tokens) + "\n                " + getIfDef(settings.pickMap, card.id) + "\n                " + getIfDef(settings.optionsMap, card.id);
    }
    var cards = state.zones.get(zone) || [];
    var compress = globalRendererState.compress[zone];
    var sketches = cards.map(sketch);
    if (compress) {
        var seen = new Set();
        var counts_1 = new Map();
        var distinctCards = [];
        try {
            for (var cards_2 = __values(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
                var card = cards_2_1.value;
                var s = sketch(card);
                if (counts_1.get(s) === undefined) {
                    distinctCards.push(card);
                }
                counts_1.set(s, (counts_1.get(s) || 0) + 1);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (cards_2_1 && !cards_2_1.done && (_a = cards_2.return)) _a.call(cards_2);
            }
            finally { if (e_10) throw e_10.error; }
        }
        var distinctCounts_1 = distinctCards.map(function (c) { return counts_1.get(sketch(c)) || 0; });
        var rendered = [];
        e.html(distinctCards.map(function (card, i) { return render(card, distinctCounts_1[i]); }).join(''));
    }
    else {
        e.html(cards.map(function (c) { return render(c); }).join(''));
    }
    try {
        for (var _c = __values(optionsFns.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), i = _e[0], fn = _e[1];
            e.find("#card" + optionsIds[i]).click(fn);
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
        }
        finally { if (e_11) throw e_11.error; }
    }
}
function renderState(state, settings) {
    var e_12, _a;
    if (settings === void 0) { settings = {}; }
    window.renderedState = state;
    clearChoice();
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false;
        window.history.replaceState(null, "", linkForState(state, isCampaign));
    }
    $('#resolvingHeader').html('Resolving:');
    $('#energy').html(state.energy.toString());
    $('#actions').html(state.actions.toString());
    $('#buys').html(state.buys.toString());
    $('#coin').html(state.coin.toString());
    $('#points').html(state.points.toString());
    $('#resolving').empty();
    $('#resolving').html(state.resolving.map(function (c) { return renderCard(c, state, 'resolving', {}, globalRendererState.tokenRenderer); }).join(''));
    var _loop_1 = function (zone) {
        renderZone(state, zone, settings);
        var e = $("[zone='" + zone + "'] .zonename");
        e.unbind('click');
        e.click(function () {
            globalRendererState.compress[zone] = !globalRendererState.compress[zone];
            renderZone(state, zone, settings);
        });
    };
    try {
        for (var zoneNames_1 = __values(zoneNames), zoneNames_1_1 = zoneNames_1.next(); !zoneNames_1_1.done; zoneNames_1_1 = zoneNames_1.next()) {
            var zone = zoneNames_1_1.value;
            _loop_1(zone);
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (zoneNames_1_1 && !zoneNames_1_1.done && (_a = zoneNames_1.return)) _a.call(zoneNames_1);
        }
        finally { if (e_12) throw e_12.error; }
    }
    $('#playsize').html('' + state.play.length);
    $('#handsize').html('' + state.hand.length);
    $('#discardsize').html('' + state.discard.length);
}
function bindLogTypeButtons(state, ui) {
    var e = $("input[name='logType']");
    e.off('change');
    e.change(function () {
        var logType = this.value;
        globalRendererState.logType = logType;
        setVisibleLog(state, logType, ui);
    });
}
function setVisibleLog(state, logType, ui) {
    var e_13, _a;
    try {
        for (var logTypes_1 = __values(logTypes), logTypes_1_1 = logTypes_1.next(); !logTypes_1_1.done; logTypes_1_1 = logTypes_1.next()) {
            var logType_1 = logTypes_1_1.value;
            var e = $(".logOption[option=" + logType_1 + "]");
            var choosable = e.attr('option') != globalRendererState.logType;
            e.attr('choosable', choosable ? 'true' : null);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (logTypes_1_1 && !logTypes_1_1.done && (_a = logTypes_1.return)) _a.call(logTypes_1);
        }
        finally { if (e_13) throw e_13.error; }
    }
    displayLogLines(state.logs[logType], ui);
}
function renderLogLine(msg, i) {
    return "<div><span class=\"logLine\" pos=" + i + ">" + msg + "</span></div>";
}
function displayLogLines(logs, ui) {
    var e_14, _a;
    var result = [];
    for (var i = logs.length - 1; i >= 0; i--) {
        result.push(renderLogLine(logs[i][0], i));
    }
    $('#log').html(result.join(''));
    var _loop_2 = function (i, e) {
        var state = e[1];
        if (state !== null) {
            $(".logLine[pos=" + i + "]").click(function () {
                if (ui.choiceState !== null) {
                    ui.choiceState.reject(new SetState(state));
                }
            });
        }
    };
    try {
        for (var _b = __values(logs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], e = _d[1];
            _loop_2(i, e);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_14) throw e_14.error; }
    }
}
//TODO: prefer better card matches
function matchMacro(macro, state, options, chosen) {
    var renders;
    renders = options.map(function (x, i) { return [x.render, i]; });
    switch (macro.kind) {
        case 'string':
            renders = renders.filter(function (x) {
                return x[0].kind == 'string'
                    && x[0].string == macro.string;
            });
            return (renders.length > 0) ? renders[0][1] : null;
        case 'card':
            renders = renders.filter(function (x) {
                return x[0].kind == 'card'
                    && x[0].card.name == macro.card.name
                    && x[0].card.place == macro.card.place
                    && ((chosen.indexOf(x[1]) >= 0) == macro.chosen);
            });
            return (renders.length > 0) ? renders[0][1] : null;
    }
}
var webUI = /** @class */ (function () {
    function webUI() {
        this.undoing = false;
        this.macros = [];
        this.recordingMacro = null;
        //invariant: whenever undoing = true, playingMacro = []
        this.playingMacro = [];
        //If the game is paused, these are the continuation
        //(resolve is used to give an answer, reject to Undo)
        //render is used to refresh the state
        this.choiceState = null;
    }
    webUI.prototype.recordStep = function (x, chosen) {
        if (this.recordingMacro === null)
            return;
        switch (x.kind) {
            case 'string':
                this.recordingMacro.push(x);
                break;
            case 'card':
                this.recordingMacro.push(__assign(__assign({}, x), { chosen: chosen }));
                break;
            default:
                assertNever(x);
        }
    };
    webUI.prototype.eraseStep = function () {
        if (this.recordingMacro === null)
            return;
        this.recordingMacro.pop();
    };
    webUI.prototype.matchNextMacroStep = function () {
        var macro = this.playingMacro.shift();
        if (macro !== undefined && this.choiceState != null) {
            var option = matchMacro(macro, this.choiceState.state, this.choiceState.options, this.choiceState.chosen);
            if (option === null)
                this.playingMacro = [];
            return option;
        }
        else {
            return null;
        }
    };
    webUI.prototype.clearChoice = function () {
        this.choiceState = null;
        clearChoice();
    };
    webUI.prototype.resolveWithMacro = function () {
        if (this.choiceState !== null) {
            var option = this.matchNextMacroStep();
            if (option !== null)
                this.choiceState.resolve(option);
        }
    };
    webUI.prototype.render = function () {
        if (this.choiceState != null) {
            var cs_1 = this.choiceState;
            renderChoice(this, cs_1.state, cs_1.choicePrompt, cs_1.options.map(function (x, i) { return (__assign(__assign({}, x), { value: function () { return cs_1.resolve(i); } })); }), cs_1.chosen.map(function (i) { return cs_1.options[i].render; }));
        }
    };
    webUI.prototype.choice = function (state, choicePrompt, options, info, chosen) {
        var ui = this;
        return new Promise(function (resolve, reject) {
            function newResolve(n) {
                ui.clearChoice();
                ui.recordStep(options[n].render, chosen.indexOf(n) >= 0);
                resolve(n);
            }
            function newReject(reason) {
                if (reason instanceof Undo) {
                    ui.undoing = true;
                    ui.eraseStep();
                }
                ui.clearChoice();
                reject(reason);
            }
            ui.choiceState = {
                state: state,
                choicePrompt: choicePrompt,
                options: options,
                info: info,
                chosen: chosen,
                resolve: newResolve,
                reject: newReject,
            };
            var option = ui.matchNextMacroStep();
            var chooseTrivial = ui.chooseTrivial(state, options, info);
            if (option != null) {
                newResolve(option);
            }
            else if (chooseTrivial !== null) {
                if (ui.undoing) {
                    newReject(new Undo(state));
                }
                else {
                    newResolve(chooseTrivial);
                }
            }
            else {
                ui.undoing = false;
                ui.render();
            }
        });
    };
    webUI.prototype.chooseTrivial = function (state, options, info) {
        if (info.indexOf('tutorial') != -1)
            return null;
        if (info.indexOf('actChoice') != -1)
            return null;
        if (options.length == 1)
            return 0;
        return null;
    };
    //NOTE: we always undo after resolving the victory promise
    //(and we won't catch an undo here)
    //(would be nice to clean this up so you use undo to go back)
    webUI.prototype.victory = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var ui, score, url, query, submitOrUndo;
            return __generator(this, function (_a) {
                ui = this;
                if (isCampaign) {
                    score = state.energy;
                    url = specToURL(state.spec);
                    query = [
                        credentialParams(),
                        "url=" + encodeURIComponent(url),
                        "score=" + score,
                        "history=" + state.serializeHistory()
                    ].join('&');
                    $.post("campaignSubmit?" + query);
                    heartbeat(state.spec);
                }
                submitOrUndo = function () {
                    return new Promise(function (resolve, reject) {
                        ui.undoing = true;
                        heartbeat(state.spec);
                        var submitDialog = function () {
                            keyListeners.clear();
                            renderScoreSubmission(state, function () { return submitOrUndo().then(resolve, reject); });
                        };
                        function newReject(reason) {
                            if (reason instanceof Undo)
                                ui.undoing = true;
                            ui.clearChoice();
                            reject(reason);
                        }
                        var options = (!submittable(state.spec)) ? [] : [{
                                render: { kind: 'string', string: 'Submit' },
                                value: submitDialog,
                                hotkeyHint: { kind: 'key', val: '!' }
                            }];
                        ui.choiceState = {
                            state: state,
                            choicePrompt: "You won using " + state.energy + " energy!",
                            options: options,
                            info: ["victory"],
                            chosen: [],
                            resolve: submitDialog,
                            reject: newReject,
                        };
                        ui.render();
                    });
                };
                return [2 /*return*/, submitOrUndo()];
            });
        });
    };
    return webUI;
}());
function renderChoice(ui, state, choicePrompt, options, picks) {
    var e_15, _a, e_16, _b;
    if (picks === void 0) { picks = []; }
    var optionsMap = new Map(); //map card ids to the corresponding option
    var stringOptions = []; // values are indices into options
    for (var i = 0; i < options.length; i++) {
        var rendered = options[i].render;
        switch (rendered.kind) {
            case 'string':
                stringOptions.push({ render: rendered.string, value: options[i].value });
                break;
            case 'card':
                optionsMap.set(rendered.card.id, options[i].value);
                break;
            default: assertNever(rendered);
        }
        if (typeof rendered == 'string') {
        }
        else if (typeof rendered === 'number') {
        }
    }
    var hotkeyMap;
    var pickMap;
    if (globalRendererState.hotkeysOn) {
        hotkeyMap = globalRendererState.hotkeyMapper.map(state, options);
    }
    else {
        hotkeyMap = new Map();
    }
    pickMap = new Map();
    try {
        for (var _c = __values(picks.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), i = _e[0], x = _e[1];
            pickMap.set(renderKey(x), i);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_15) throw e_15.error; }
    }
    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap: optionsMap,
        pickMap: pickMap,
        updateURL: (!globalRendererState.userURL || state.hasHistory())
    });
    if (ui != null) {
        setVisibleLog(state, globalRendererState.logType, ui);
        bindLogTypeButtons(state, ui);
    }
    $('#choicePrompt').html(choicePrompt);
    $('#options').empty();
    try {
        for (var stringOptions_1 = __values(stringOptions), stringOptions_1_1 = stringOptions_1.next(); !stringOptions_1_1.done; stringOptions_1_1 = stringOptions_1.next()) {
            var option = stringOptions_1_1.value;
            $('#options').append(renderStringOption(option, hotkeyMap.get(option.render), pickMap.get(option.render)));
            var e = renderStringOption;
        }
    }
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (stringOptions_1_1 && !stringOptions_1_1.done && (_b = stringOptions_1.return)) _b.call(stringOptions_1);
        }
        finally { if (e_16) throw e_16.error; }
    }
    $('#undoArea').html(renderSpecials(state));
    if (ui !== null)
        bindSpecials(state, ui);
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        var f = option.value;
        var hotkey = hotkeyMap.get(renderKey(option.render));
        if (hotkey != undefined)
            keyListeners.set(hotkey, f);
    }
}
function renderStringOption(option, hotkey, pick) {
    var hotkeyText = (hotkey !== undefined) ? renderHotkey(hotkey) : '';
    var picktext = (pick !== undefined) ? "<div class='pickorder'>" + pick + "</div>" : '';
    var e = $("<span class='option' choosable chosen='false'>" + picktext + hotkeyText + option.render + "</span>");
    e.click(option.value);
    return e;
}
function renderSpecials(state) {
    return [
        renderUndo(state.undoable()),
        renderRedo(state.redo.length > 0),
        renderHotkeyToggle(),
        renderMacroToggle(),
        renderKingdomViewer(),
        renderHelp(),
        renderRestart(),
        renderDeepLink()
    ].join('');
}
function renderRestart() {
    return "<span id='restart' class='option', option='restart' choosable chosen='false'>Restart</span>";
}
function renderKingdomViewer() {
    return "<span id='viewKingdom' class='option', option='viewKingdom' choosable chosen='false'>Kingdom</span>";
}
function renderMacroToggle() {
    return "<span id='macroToggle' class='option', option='macroToggle' choosable chosen='false'>Macros</span>";
}
function renderHotkeyToggle() {
    return "<span class='option', option='hotkeyToggle' choosable chosen='false'>" + renderHotkey('/') + " Hotkeys</span>";
}
function renderHelp() {
    return "<span id='help' class='option', option='help' choosable chosen='false'>" + renderHotkey('?') + " Help</span>";
}
function renderDeepLink() {
    return "<span id='deeplink' class='option', option='link' choosable chosen='false'>Link</span>";
}
function renderUndo(undoable) {
    var hotkeyText = renderHotkey('z');
    return "<span class='option', option='undo' " + (undoable ? 'choosable' : '') + " chosen='false'>" + hotkeyText + "Undo</span>";
}
function renderRedo(redoable) {
    var hotkeyText = renderHotkey('Z');
    return "<span class='option', option='redo' " + (redoable ? 'choosable' : '') + " chosen='false'>" + hotkeyText + "Redo</span>";
}
function bindSpecials(state, ui) {
    bindHotkeyToggle(ui);
    bindHelp(state, ui);
    bindRestart(state, ui);
    bindUndo(state, ui);
    bindRedo(state, ui);
    if (ui !== null)
        bindMacroToggle(ui);
    bindViewKingdom(state);
    bindDeepLink(state);
}
function bindViewKingdom(state) {
    function onClick() {
        var e = $('#kingdomViewSpot');
        if (globalRendererState.viewingKingdom) {
            e.html('');
            globalRendererState.viewingKingdom = false;
        }
        else {
            var contents = state.events.concat(state.supply).map(function (card) { return renderSpec(card.spec); }).join('');
            e.html("<div id='kingdomView'>" + contents + "</div>");
            globalRendererState.viewingKingdom = true;
        }
    }
    $("[option='viewKingdom']").on('click', onClick);
}
//TODO: move globalRendererState into the webUI...
//TODO: these should probably all be webUI methods...
function bindMacroToggle(ui) {
    function makeMacroButtonsIfNeeded() {
        var e = $('#macroSpot');
        if (globalRendererState.viewingMacros) {
            makeMacroButtons(ui, e);
        }
        else {
            e.html('');
        }
    }
    makeMacroButtonsIfNeeded();
    function onClick() {
        globalRendererState.viewingMacros = !globalRendererState.viewingMacros;
        makeMacroButtonsIfNeeded();
    }
    var e = $("[option='macroToggle']");
    e.off('click');
    e.on('click', onClick);
}
function makeMacroButtons(ui, e) {
    var contents = [renderRecordMacroButton(ui)].concat(ui.macros.map(renderPlayMacroButton)).join('');
    e.html("<div id='macros'>" + contents + "</div>");
    bindRecordMacroButton(ui);
    bindPlayMacroButtons(ui);
}
function renderRecordMacroButton(ui) {
    var buttonText = (ui.recordingMacro === null)
        ? 'Start recording'
        : 'Stop recording';
    return "<span id='recordMacro' class='option'\n             option='recordMacro' choosable chosen='false'>\n                 " + buttonText + "\n             </span>";
}
function renderPlayMacroButton(macro, index) {
    var optionText = "macro" + index;
    var firstStep = macro[0];
    var firstStepText = (firstStep.kind == 'card')
        ? firstStep.card.name
        : firstStep.string;
    var buttonText = firstStepText + " (" + macro.length + ")";
    return "<span id='playMacro' class='option'\n             option='" + optionText + "' choosable chosen='false'>\n                 " + buttonText + "\n             </span>";
}
function bindRecordMacroButton(ui) {
    function onClick() {
        if (ui.recordingMacro === null) {
            ui.recordingMacro = [];
        }
        else if (ui.recordingMacro.length == 0) {
            ui.recordingMacro = null;
        }
        else {
            ui.macros.push(ui.recordingMacro);
            ui.recordingMacro = null;
        }
        makeMacroButtons(ui, $('#macroSpot'));
    }
    var e = $("[option='recordMacro'");
    e.off('click');
    e.on('click', onClick);
}
function bindPlayMacroButtons(ui) {
    var e_17, _a;
    function onClick(i) {
        if (ui.choiceState !== null && ui.playingMacro.length == 0) {
            ui.playingMacro = ui.macros[i].slice();
            ui.resolveWithMacro();
        }
    }
    var _loop_3 = function (i, macro) {
        var e = $("[option='macro" + i + "'");
        e.off('click');
        e.on('click', function () { return onClick(i); });
    };
    try {
        for (var _b = __values(ui.macros.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], macro = _d[1];
            _loop_3(i, macro);
        }
    }
    catch (e_17_1) { e_17 = { error: e_17_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_17) throw e_17.error; }
    }
}
function unbindPlayMacroButtons(ui) {
    var e_18, _a;
    try {
        for (var _b = __values(ui.macros.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], macro = _d[1];
            var e = $("[option='macro" + i + "'");
            e.off('click');
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_18) throw e_18.error; }
    }
}
function bindHotkeyToggle(ui) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn;
        ui.render();
    }
    keyListeners.set('/', pick);
    $("[option='hotkeyToggle']").on('click', pick);
}
function startState(state) {
    return state.origin().update({ future: [] });
}
function bindRestart(state, ui) {
    function pick() {
        if (ui.choiceState !== null) {
            ui.choiceState.reject(new SetState(startState(state)));
        }
    }
    $("[option='restart']").on('click', pick);
}
function bindRedo(state, ui) {
    function pick() {
        if (ui.choiceState != null && state.redo.length > 0) {
            ui.choiceState.resolve(state.redo[state.redo.length - 1]);
        }
    }
    keyListeners.set('Z', pick);
    $("[option='redo']").on('click', pick);
}
function bindUndo(state, ui) {
    function pick() {
        if (ui.choiceState != null && state.undoable()) {
            ui.choiceState.reject(new Undo(state));
        }
    }
    keyListeners.set('z', pick);
    $("[option='undo']").on('click', pick);
}
function bindDeepLink(state) {
    $('#deeplink').click(function () { return showLinkDialog(linkForState(state)); });
}
function randomString() {
    return Math.random().toString(36).substring(2, 8);
}
function baseURL() {
    var url = window.location;
    return url.protocol + '//' + url.host;
}
function showLinkDialog(url) {
    $('#scoreSubmitter').attr('active', 'true');
    $('#scoreSubmitter').html("<label for=\"link\">Link:</label>" +
        "<textarea id=\"link\"></textarea>" +
        "<div>" +
        ("<span class=\"option\" choosable id=\"copyLink\">" + renderHotkey('⏎') + "Copy</span>") +
        ("<span class=\"option\" choosable id=\"cancel\">" + renderHotkey('Esc') + "Cancel</span>") +
        "</div>");
    var id = randomString();
    //TOOD: include base URL
    $('#link').val(baseURL() + "/g/" + id);
    $('#link').select();
    $.get("link?id=" + id + "&url=" + encodeURIComponent(url)).done(function (x) {
        if (x != 'ok') {
            alert(x);
        }
    });
    function exit() {
        $('#link').blur();
        $('#scoreSubmitter').attr('active', 'false');
    }
    function submit() {
        $('#link').select();
        document.execCommand('copy');
        exit();
    }
    $('#cancel').click(exit);
    $('#copyLink').click(submit);
    $('#link').keydown(function (e) {
        if (e.keyCode == 27) {
            exit();
            e.preventDefault();
        }
        else if (e.keyCode == 13) {
            submit();
            e.preventDefault();
        }
    });
}
function clearChoice() {
    keyListeners.clear();
    $('#choicePrompt').html('');
    $('#options').html('');
    $('#undoArea').html('');
}
var tutorialStages = [
    {
        text: ["Welcome to the tutorial.\n        It will walk you through the first few actions of a simple game.\n        Press enter or click 'Next' to advance.",
            "When you use an event or play a card, you first pay its cost\n        then follow its instructions.",
            "You can read what a card does by hovering over it,\n        or view all cards by clicking the 'Kingdom' button\n        at the top of the screen. After pressing 'Next',\n        read what Refresh does, then click on it to use it."],
        nextAction: 0,
    },
    {
        text: ["When you used Refresh you spent @@@@,\n        because that's the cost of Refresh.\n         You can see how much @ you've spent in the resources row,\n         directly above the events (it might be behind this popup).\n         The goal of the game is to spend as little as possible.",
            "After paying Refresh's cost, you put your discard pile into your hand.\n         These are the cards available to play.",
            "Then you gained 5 actions, which you can use to play cards from your hand,\n         and 1 buy, which you can use to buy a card from the supply.\n         Your actions and buys are visible above the events.",
            "You have $0, so you can't buy much.\n         But you can use an action to play a Copper from your hand."],
        nextAction: 0,
    },
    {
        text: [
            "When you play Copper, you follow its instructions and gain $1.\n             You can see your $ above the events.\n             You can also see that you've spent 1 action so have 4 remaining.",
        ],
        nextAction: 0
    },
    { text: [], nextAction: 0 },
    {
        text: ["Now that you have $3 and a buy, you can buy a Silver."],
        nextAction: 3
    },
    {
        text: ["When you buy a card, you lose a buy and the $ you spent on it.\n        Then you gain a copy of that card in your discard pile.\n        Next time you Refresh you will have an extra Silver to play.",
            "Note that using an event like Refresh or Duplicate doesn't require a buy.",
            "For now, click on an Estate to play it."],
        nextAction: 0
    },
    {
        text: ["You spent @ to play the estate, and gained 1 vp.\n        The goal of the game is to get to " + VP_GOAL + "vp\n        using as little @ as possible.",
            "If you play an Estate using a Throne Room, you won't pay @. You only\n        pay a card's cost when you play or buy it the 'normal' way.\n        You also wouldn't pay an action, except that Throne Room tells you to.",
            "This is a very small kingdom for the purposes of learning.\n        The fastest win with these cards is 38@. Good luck!",
            "You can press '?' or click 'Help' to view the help at any time."],
    },
];
var tutorialUI = /** @class */ (function () {
    function tutorialUI(stages, innerUI) {
        if (innerUI === void 0) { innerUI = new webUI(); }
        this.stages = stages;
        this.innerUI = innerUI;
        this.stage = 0;
    }
    tutorialUI.prototype.choice = function (state, choicePrompt, options, info, chosen) {
        return __awaiter(this, void 0, void 0, function () {
            var stage, validIndex_1, result;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.stage < this.stages.length) {
                    stage = this.stages[this.stage];
                    validIndex_1 = stage.nextAction;
                    if (validIndex_1 != undefined)
                        options = [options[validIndex_1]];
                    result = this.innerUI.choice(state, choicePrompt, options, info.concat(['tutorial']), chosen).then(function (x) {
                        _this.stage += 1;
                        return (validIndex_1 != undefined) ? validIndex_1 : x;
                    }).catch(function (e) {
                        if (e instanceof Undo) {
                            if (validIndex_1 === undefined)
                                _this.stage += 1;
                            else
                                _this.stage -= 1;
                        }
                        throw e;
                    });
                    renderTutorialMessage(stage.text);
                    return [2 /*return*/, result];
                }
                else
                    return [2 /*return*/, this.innerUI.choice(state, choicePrompt, options, info, chosen)];
                return [2 /*return*/];
            });
        });
    };
    tutorialUI.prototype.victory = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.innerUI.victory(state)];
            });
        });
    };
    return tutorialUI;
}());
function renderTutorialMessage(text) {
    $('#tutorialDialog').html("<div id='tutorialText'></div>" +
        ("<span class=\"option\" choosable id=\"tutorialNext\">\n             " + renderHotkey('⏎') + " Next\n         </span>"));
    var step = 0;
    $('#tutorialDialog').attr('active', 'true');
    function next() {
        if (step >= text.length) {
            $('#tutorialDialog').attr('active', 'false');
        }
        else {
            $('#tutorialText').html(text[step]);
            step += 1;
        }
    }
    keyListeners.set('Enter', next);
    next();
    $('#tutorialDialog').keydown(function (e) {
        if (e.keyCode == 13 || e.keyCode == 27) {
            next();
            e.preventDefault();
        }
    });
    $('#tutorialNext').on('click', next);
}
export function loadTutorial() {
    var state = initialState(getTutorialSpec());
    startGame(state, new tutorialUI(tutorialStages));
}
// ------------------------------------------ Help
//TODO: should handle help and the kingdom view in the same way
function bindHelp(state, ui) {
    function attach(f) {
        $('#help').on('click', f);
        keyListeners.set('?', f);
    }
    function pick() {
        attach(function () { return ui.render(); });
        var helpLines = [
            "Rules:",
            "The goal of the game is to get to " + VP_GOAL + " points (vp) using as little energy (@) as possible.",
            "To buy a card, spend a buy and pay its buy cost.",
            "When you buy a card, create a copy of it in your discard pile.",
            "To play a card, spend an action and pay its cost.",
            "When you play a card, put it in the resolving zone and follow its instructions.",
            "After playing a card, discard it if it's still in the resolving zone.",
            "To use an event, pay its cost. When you use an event, folllow its instructions.",
            "The symbols below a card's name indicate its cost (or buy cost for cards in the supply).",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to pay it.",
            "When a cost is measured in coin ($) then you can only pay it if you have enough coin.",
            "If an effect instructs you to play or buy a card, you don't have to pay the normal cost.",
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (effect) apply whenever the card is in play.",
            "Effects marked with (static) apply whenever the card is in the supply or events zone.",
            "&nbsp;",
            "Other help:",
            "Click the 'Kingdom' button to view the text of all cards at once.",
            "Press 'z' or click the 'Undo' button to undo the last move.",
            "Press '/' or click the 'Hotkeys' button to turn on hotkeys.",
            "Click the 'Link' button to copy a shortlink to the current state.",
            "Click on a zone's name to compress identical cards in that zone.",
            "Go <a href='index.html'>here</a> to see all the ways to play the game.",
            "Check out the scoreboard <a href=" + scoreboardURL(state.spec) + ">here</a>.",
            "Copy <a href='play?" + specToURL(state.spec) + "'>this link</a> to replay this game any time.",
            "You can use the URL in the address bar to link to the current state of this game.",
        ];
        $('#choicePrompt').html('');
        $('#resolvingHeader').html('');
        $('#resolving').html(helpLines.map(function (x) { return "<div class='helpLine'>" + x + "</div class='helpline'>"; }).join(''));
    }
    attach(pick);
}
function dateString() {
    var date = new Date();
    return (String(date.getMonth() + 1)) + String(date.getDate()).padStart(2, '0') + date.getFullYear();
}
// ------------------------------ High score submission
function submittable(spec) {
    return true;
}
function rememberUsername(username) {
    localStorage.setItem('username', username);
}
function getUsername() {
    return localStorage.username;
}
function credentialParams() {
    return "username=" + localStorage.campaignUsername + "&hashedPassword=" + localStorage.hashedPassword;
}
//TODO: should factor credentials differently
function renderCampaignSubmission(state, done) {
    var score = state.energy;
    var url = specToURL(state.spec);
    $('#campaignSubmitter').attr('active', 'true');
    function exit() {
        $('#campaignSubmitter').attr('active', 'false');
    }
    function submit() {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                query = [
                    credentialParams(),
                    "url=" + encodeURIComponent(url),
                    "score=" + score,
                    "history=" + state.serializeHistory()
                ].join('&');
                return [2 /*return*/, $.post("campaignSubmit?" + query)];
            });
        });
    }
    //TODO: handle bad submissions here
    submit().then(function (data) {
        $('#newbest').text(score);
        $('#priorbest').text(data.priorBest);
        $('#awards').text(data.newAwards);
        $('#nextAward').text(data.nextAward);
        heartbeat(state.spec);
    });
    $('#campaignSubmitter').focus();
    $('#campaignSubmitter').keydown(function (e) {
        if (e.keyCode == 13) {
            exit();
            e.preventDefault();
        }
        else if (e.keyCode == 27) {
            exit();
            e.preventDefault();
        }
    });
    $('#campaignSubmitter').on('click', exit);
}
function renderScoreSubmission(state, done) {
    var score = state.energy;
    var url = specToURL(state.spec);
    $('#scoreSubmitter').attr('active', 'true');
    var pattern = "[a-ZA-Z0-9]";
    $('#scoreSubmitter').html("<label for=\"username\">Name:</label>" +
        "<textarea id=\"username\"></textarea>" +
        "<div>" +
        ("<span class=\"option\" choosable id=\"submitScore\">" + renderHotkey('⏎') + "Submit</span>") +
        ("<span class=\"option\" choosable id=\"cancelSubmit\">" + renderHotkey('Esc') + "Cancel</span>") +
        "</div>");
    var username = getUsername();
    if (username != null)
        $('#username').val(username);
    $('#username').focus();
    function exit() {
        $('#scoreSubmitter').attr('active', 'false');
        done();
    }
    function submit() {
        var username = $('#username').val();
        if (username.length > 0) {
            rememberUsername(username);
            var query = [
                "url=" + encodeURIComponent(url),
                "score=" + score,
                "username=" + encodeURIComponent(username),
                "history=" + state.serializeHistory()
            ].join('&');
            $.post("submit?" + query).done(function (resp) {
                if (resp == 'OK') {
                    heartbeat(state.spec);
                }
                else {
                    alert(resp);
                }
            });
            exit();
        }
    }
    $('#username').keydown(function (e) {
        if (e.keyCode == 13) {
            submit();
            e.preventDefault();
        }
        else if (e.keyCode == 8) {
        }
        else if (e.keyCode == 189) {
        }
        else if (e.keyCode == 27) {
            exit();
            e.preventDefault();
        }
        else if (e.keyCode < 48 || e.keyCode > 90) {
            e.preventDefault();
        }
    });
    $('#submitScore').on('click', submit);
    $('#cancelSubmit').on('click', exit);
}
function scoreboardURL(spec) {
    return "scoreboard?" + specToURL(spec);
}
//TODO: change the sidebar based on whether you are in a campaign
function campaignHeartbeat(spec, interval) {
    var queryStr = "campaignHeartbeat?" + credentialParams() + "&url=" + encodeURIComponent(specToURL(spec)) + "&version=" + VERSION;
    $('#homeLink').attr('href', 'campaign.html');
    $.get(queryStr).done(function (x) {
        if (x == 'version mismatch') {
            clearInterval(interval);
            alert("The server has updated to a new version, please refresh. You will get an error and your game will restart if the history is no longer valid.");
            return;
        }
        if (x == 'user not found') {
            clearInterval(interval);
            alert("Your username+password were not recognized");
            return;
        }
        var _a = __read(x, 2), personalBest = _a[0], nextAward = _a[1];
        var personalBestStr = personalBest !== null
            ? "<div>Your best: " + personalBest + "</div>"
            : "";
        var nextAwardStr = nextAward !== null
            ? "<div>Next award: " + nextAward + "</div>"
            : "<div>Kingdom complete!</div>";
        $('#best').html(personalBestStr + nextAwardStr);
    });
}
//TODO: still need to refactor global state
var isCampaign = false;
function heartbeat(spec, interval) {
    if (isCampaign) {
        campaignHeartbeat(spec, interval);
    }
    else if (submittable(spec)) {
        $.get("topScore?url=" + encodeURIComponent(specToURL(spec)) + "&version=" + VERSION).done(function (x) {
            if (x == 'version mismatch') {
                clearInterval(interval);
                alert("The server has updated to a new version, please refresh. You will get an error and your game will restart if the history is no longer valid.");
            }
            var n = parseInt(x, 10);
            if (!isNaN(n))
                renderBest(n, spec);
            else
                renderScoreboardLink(spec);
        });
    }
}
function renderBest(best, spec) {
    $('#best').html("Fastest win on this kingdom: " + best + " (<a target='_blank' href=\"" + scoreboardURL(spec) + "\">scoreboard</a>)");
}
function renderScoreboardLink(spec) {
    $('#best').html("No wins yet for this kingdom (<a target='_blank' href=\"" + scoreboardURL(spec) + "\">scoreboard</a>)");
}
// Creating the game spec and starting the game ------------------------------
function getHistory() {
    return window.location.hash.substring(1) || null;
}
function isURLCampaign(url) {
    var searchParams = new URLSearchParams(url);
    return searchParams.get('campaign') !== null;
}
export function load(fixedURL) {
    if (fixedURL === void 0) { fixedURL = ''; }
    var url = (fixedURL.length == 0) ? window.location.search : fixedURL;
    isCampaign = isURLCampaign(url);
    var spec;
    try {
        spec = specFromURL(url);
    }
    catch (e) {
        if (e instanceof MalformedSpec) {
            alert(e);
            spec = specFromURL('');
        }
        else {
            throw e;
        }
    }
    var history = null;
    var historyString = getHistory();
    if (historyString != null) {
        try {
            history = coerceReplayVersion(parseReplay(historyString));
        }
        catch (e) {
            if (e instanceof MalformedReplay) {
                alert(e);
                history = null;
            }
            else {
                throw e;
            }
        }
    }
    var state;
    if (history !== null) {
        try {
            state = State.fromReplay(history, spec);
        }
        catch (e) {
            alert("Error loading history: " + e);
            state = initialState(spec);
        }
    }
    else {
        state = initialState(spec);
    }
    startGame(state);
}
function startGame(state, ui) {
    if (ui === undefined)
        ui = new webUI();
    heartbeat(state.spec);
    var interval = setInterval(function () { return heartbeat(state.spec, interval); }, 10000);
    window.addEventListener("hashchange", function () { return load(); }, false);
    playGame(state.attachUI(ui)).catch(function (e) {
        if (e instanceof InvalidHistory) {
            alert(e);
            playGame(e.state.clearFuture());
        }
        else {
            //alert(e)
            throw e;
        }
    });
}
function restart(state) {
    //TODO: detach the UI to avoid a race?
    //TODO: clear hearatbeat? (currently assumes spec is the same...)
    var spec = state.spec;
    var ui = state.ui;
    state = initialState(spec);
    globalRendererState.userURL = false;
    window.history.pushState(null, "");
    playGame(state.attachUI(ui)).catch(function (e) {
        if (e instanceof InvalidHistory) {
            alert(e);
            playGame(e.state.clearFuture());
        }
        else {
            alert(e);
        }
    });
}
// ----------------------------------- Kingdom picker
//
function kingdomURL(kindParam, cards, events) {
    return "play?" + kindParam + "cards=" + cards.map(function (card) { return card.name; }).join(',') + "&events=" + events.map(function (card) { return card.name; });
}
function countIn(s, f) {
    var e_19, _a;
    var count = 0;
    try {
        for (var s_1 = __values(s), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
            var x = s_1_1.value;
            if (f(x))
                count += 1;
        }
    }
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (s_1_1 && !s_1_1.done && (_a = s_1.return)) _a.call(s_1);
        }
        finally { if (e_19) throw e_19.error; }
    }
    return count;
}
//TODO: refactor the logic into logic.ts, probably just state initialization
export function loadPicker() {
    var state = emptyState;
    var cards = mixins.slice();
    var events = eventMixins.slice();
    cards.sort(function (spec1, spec2) { return spec1.name.localeCompare(spec2.name); });
    events.sort(function (spec1, spec2) { return spec1.name.localeCompare(spec2.name); });
    for (var i = 0; i < 8; i++)
        events.push(randomPlaceholder);
    for (var i = 0; i < 20; i++)
        cards.push(randomPlaceholder);
    for (var i = 0; i < cards.length; i++) {
        var spec = cards[i];
        state = state.addToZone(new Card(spec, i), 'supply');
    }
    for (var i = 0; i < events.length; i++) {
        var spec = events[i];
        state = state.addToZone(new Card(events[i], cards.length + i), 'events');
    }
    var specs = cards.concat(events);
    function trivial() { }
    function elem(i) {
        return $("[option='" + i + "']");
    }
    function prefix(s) {
        var parts = s.split('/');
        return parts.slice(0, parts.length - 1).join('/');
    }
    function kingdomLink(kind) {
        if (kind === void 0) { kind = ''; }
        return kingdomURL(kind, Array.from(chosen.values()).filter(function (i) { return i < cards.length; }).map(function (i) { return cards[i]; }), Array.from(chosen.values()).filter(function (i) { return i >= cards.length; }).map(function (i) { return events[i - cards.length]; }));
    }
    var chosen = new Set();
    function pick(i) {
        if (chosen.has(i)) {
            chosen.delete(i);
            elem(i).attr('chosen', false);
        }
        else {
            chosen.add(i);
            elem(i).attr('chosen', true);
        }
        $('#cardCount').html(String(countIn(chosen, function (x) { return x < cards.length; })));
        $('#eventCount').html(String(countIn(chosen, function (x) { return x >= cards.length; })));
        if (chosen.size > 0) {
            $('#pickLink').attr('href', kingdomLink());
            $('#requireLink').attr('href', kingdomLink('kind=require&'));
        }
        else {
            $('#pickLink').removeAttr('href');
            $('#requireLink').removeAttr('href');
        }
    }
    function makeOption(card, i) {
        return {
            value: function () { return pick(i); },
            render: { kind: 'card', card: card }
        };
    }
    renderChoice(null, state, 'Choose which events and cards to use.', state.supply.map(function (card, i) { return makeOption(card, i); }).concat(state.events.map(function (card, i) { return makeOption(card, cards.length + i); })));
}
//# sourceMappingURL=main.js.map