// gameUI.ts - Game state rendering and interaction during gameplay
// This handles the in-game UI (playing cards, making choices, etc.)
// Extracted from main.ts to separate game UI from meta-game UI.
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
import { Shadow, Card, UndoPastBeginning } from './gameLogic.js';
import { renderCost, renderEnergy } from './gameLogic.js';
import { logTypes } from './gameLogic.js';
import { Undo, SetState } from './gameLogic.js';
import { playGame } from './gameLogic.js';
var zoneNames = ['play', 'supply', 'events', 'hand', 'discard', 'potions', 'relics'];
// ----------------------------- Hotkeys
var keyListeners = new Map();
var symbolHotkeys = ['!', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']'];
var lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'];
var upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];
var numHotkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var supplyAndPlayHotkeys = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys);
var handHotkeys = lowerHotkeys.concat(upperHotkeys);
var hotkeys = supplyAndPlayHotkeys.concat(handHotkeys);
// Initialize hotkey listeners
export function initHotkeys() {
    window.addEventListener('keydown', function (e) {
        var listener = keyListeners.get(e.key);
        if (e.altKey || e.ctrlKey || e.metaKey)
            return;
        if (listener != undefined) {
            e.preventDefault();
            listener();
        }
        if (e.key == ' ') {
            e.preventDefault();
        }
        if (e.key == 'Shift') {
            document.body.classList.add('shift-held');
        }
    });
    window.addEventListener('keyup', function (e) {
        if (e.key == 'Shift') {
            document.body.classList.remove('shift-held');
        }
    });
}
// ----------------------------- Utility Functions
function assertNever(x) {
    throw new Error("Unexpected: ".concat(x));
}
function renderHotkey(hotkey) {
    if (hotkey == ' ')
        hotkey = '&#x23B5;';
    return "<div class=\"hotkey\">".concat(hotkey, "</div> ");
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
        default: return assertNever(hint);
    }
}
function renderKey(x) {
    switch (x.kind) {
        case 'card': return x.card.id;
        case 'string': return x.string;
        default: return assertNever(x);
    }
}
function getIfDef(m, x) {
    return (m == undefined) ? undefined : m.get(x);
}
function repeat(xs, n) {
    return Array(n).fill(xs).flat(1);
}
function bindClickEvent(element, handler) {
    element.unbind('click');
    element.bind('click', function (e) { return handler(e.shiftKey); });
}
// ----------------------------- Hotkey Mapper
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
        // Put zones that are most important not to change earlier
        setFrom(state.events, supplyAndPlayHotkeys);
        setFrom(state.supply, supplyAndPlayHotkeys);
        setFrom(state.hand, handHotkeys);
        setFrom(state.play, supplyAndPlayHotkeys);
        try {
            for (var options_2 = __values(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
                var option = options_2_1.value;
                var hint = interpretHint(option.hotkeyHint);
                if (hint != undefined && !result.has(renderKey(option.render))) {
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
                if (!takenByPickable(key)) {
                    return key;
                }
                else
                    index++;
            }
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
// ----------------------------- Token Renderer
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
                tokenHtmls.push("<span id='token' style='color:".concat(this.tokenColor(token), "'>").concat(f(n), "</span>"));
            }
        }
        return (tokenHtmls.length > 0) ? "(".concat(tokenHtmls.join(''), ")") : '';
    };
    TokenRenderer.prototype.renderTooltip = function (tokens) {
        var e_6, _a, e_7, _b;
        function f(n, s) {
            return (n == 1) ? s : "".concat(s, " (").concat(n, ")");
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
        return (tokenHtmls.length > 0) ? "Tokens: ".concat(tokenHtmls.join(', ')) : '';
    };
    return TokenRenderer;
}());
var globalRendererState = {
    hotkeysOn: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('hotkeysOn')) === true,
    userURL: true,
    viewingKingdom: false,
    viewingMacros: false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: 'energy',
    compress: {
        play: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compressplay')) === true,
        supply: false,
        events: false,
        hand: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compresshand')) === true,
        discard: typeof localStorage !== 'undefined' && JSON.parse(localStorage.getItem('compressdiscard')) === true,
        potions: false,
        relics: false
    }
};
function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper();
    globalRendererState.tokenRenderer = new TokenRenderer();
}
// ----------------------------- Callbacks for Meta-game Integration
// ----------------------------- Card Text Rendering
function describeCost(cost) {
    var coinCost = (cost.coin > 0) ? ["lose $".concat(cost.coin)] : [];
    var energyCost = (cost.energy > 0) ? ["gain ".concat(renderEnergy(cost.energy))] : [];
    var costs = coinCost.concat(energyCost);
    var costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing';
    return "Cost: ".concat(costStr, ".");
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
    return parts.map(function (x) { return "<div>".concat(x, "</div>"); }).join('');
}
function renderAbility(spec) {
    var e_9, _a;
    var parts = [];
    try {
        for (var _b = __values(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var effect = _c.value;
            parts = parts.concat(effect.text.map(function (x) { return "<div>(ability) ".concat(x, "</div>"); }));
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
function renderTrigger(x, staticTrigger) {
    var desc = (staticTrigger) ? '(static)' : '(effect)';
    return "<div>".concat(desc, " ").concat(x.text, "</div>");
}
function renderVariableCosts(cs) {
    return cs.map(function (c) { return "<div>(cost) +".concat(c.text, "</div>"); }).join('');
}
function renderBuyable(bs) {
    return bs.map(function (b) { return (b.text == undefined) ? '' : "<div>(req) ".concat(b.text, "</div>"); }).join('');
}
function isZero(c) {
    return (c === undefined || renderCost(c) == '');
}
function renderRuleText(rule) {
    var e_10, _a, e_11, _b;
    var parts = [];
    try {
        for (var _c = __values((rule.triggers || [])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var trigger = _d.value;
            parts.push("<div>(rule) ".concat(trigger.text, "</div>"));
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_10) throw e_10.error; }
    }
    try {
        for (var _e = __values((rule.replacers || [])), _f = _e.next(); !_f.done; _f = _e.next()) {
            var replacer = _f.value;
            parts.push("<div>(rule) ".concat(replacer.text, "</div>"));
        }
    }
    catch (e_11_1) { e_11 = { error: e_11_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_11) throw e_11.error; }
    }
    return parts.join('');
}
export function cardText(spec) {
    var effectHtml = renderEffects(spec);
    var buyableHtml = (spec.restrictions != undefined) ? renderBuyable(spec.restrictions) : '';
    var costHtml = (spec.variableCosts != undefined) ? renderVariableCosts(spec.variableCosts) : '';
    var abilitiesHtml = renderAbility(spec);
    var triggerHtml = (spec.triggers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var replacerHtml = (spec.replacers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var staticTriggerHtml = (spec.staticTriggers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    var staticReplacerHtml = (spec.staticReplacers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    var rulesHtml = (spec.rules || []).map(renderRuleText).join('');
    return [buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml].join('');
}
// ----------------------------- Tooltip Rendering
function renderTooltipSimple(card, state, tokenRenderer) {
    var buyStr = !isZero(card.spec.buyCost) ?
        "(".concat(renderCost(card.spec.buyCost), ")") : '---';
    var costStr = !isZero(card.spec.fixedCost) ?
        "(".concat(renderCost(card.spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(card.name, " ").concat(costStr, "---</div>");
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var bodyText = card.spec.simpleText
        ? card.spec.simpleText.map(function (line) { return "<div>".concat(line, "</div>"); }).join('')
        : cardText(card.spec);
    return header + bodyText + tokensHtml;
}
function renderTooltipFull(card, state, tokenRenderer) {
    var buyStr = !isZero(card.spec.buyCost) ?
        "(".concat(renderCost(card.spec.buyCost), ")") : '---';
    var costStr = !isZero(card.spec.fixedCost) ?
        "(".concat(renderCost(card.spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(card.name, " ").concat(costStr, "---</div>");
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var baseFilling = header + cardText(card.spec) + tokensHtml;
    function renderRelated(spec) {
        var card = new Card(spec, -1);
        return renderTooltipFull(card, state, tokenRenderer);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "".concat(baseFilling).concat(relatedFilling);
}
// ----------------------------- Card/Shadow Rendering
function renderShadow(shadow, state, tokenRenderer) {
    var card = shadow.spec.card;
    var tokenhtml = tokenRenderer.render(card.tokens);
    var costhtml = '&nbsp';
    var ticktext = "tick=".concat(shadow.tick);
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
            tooltip = "Buying ".concat(shadow.spec.card.name);
            break;
        default: return assertNever(shadow.spec);
    }
    return ["<div class='card' ".concat(ticktext, " ").concat(shadowtext, ">"), "<div class='cardbody'>".concat(card).concat(tokenhtml, "</div>"), "<div class='cardcost'>".concat(costhtml, "</div>"), "<span class='tooltip tooltip-simple'>".concat(tooltip, "</span>"), "</div>"].join('');
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
        var picktext = (options.pick !== undefined) ? "<div class='pickorder'>".concat(options.pick + 1, "</div>") : '';
        var counttext = (count != 1) ? "<div class='cardcount'>".concat(count, "</div>") : '';
        var chosenText = (options.pick !== undefined) ? 'true' : 'false';
        var choosetext = (options.option !== undefined)
            ? "choosable chosen='".concat(chosenText, "' option=").concat(options.option)
            : '';
        var hotkeytext = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : '';
        var ticktext = "tick=".concat(card.ticks[card.ticks.length - 1]);
        var result = "<div id='card".concat(card.id, "' class='card' ").concat(ticktext, " ").concat(choosetext, "> ").concat(picktext, " ").concat(counttext, "\n                    <div class='cardbody'>").concat(hotkeytext, " ").concat(card).concat(tokenhtml, "</div>\n                    <div class='cardcost'>").concat(costhtml, "</div>\n                    <span class='tooltip tooltip-simple'>").concat(renderTooltipSimple(card, state, tokenRenderer), "</span>\n                    <span class='tooltip tooltip-full'>").concat(renderTooltipFull(card, state, tokenRenderer), "</span>\n                </div>");
        return result;
    }
}
// ----------------------------- Spec Rendering (for meta UI)
export function renderSpec(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    var me = "<div class='spec'>".concat(header).concat(cardText(spec), "</div>");
    var related = (spec.relatedCards || []).map(renderSpec);
    return [me].concat(related).join('');
}
export function buildSpecTooltip(spec) {
    var buyStr = !isZero(spec.buyCost) ?
        "(".concat(renderCost(spec.buyCost), ")") : '---';
    var costStr = !isZero(spec.fixedCost) ?
        "(".concat(renderCost(spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(spec.name, " ").concat(costStr, "---</div>");
    var baseFilling = header + cardText(spec);
    var relatedCards = spec.relatedCards || [];
    var relatedFilling = relatedCards.map(function (r) { return buildSpecTooltip(r); }).join('');
    return "".concat(baseFilling).concat(relatedFilling);
}
export function renderSpecNoRelated(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    var displayText = spec.simpleText
        ? spec.simpleText.map(function (line) { return "<div>".concat(line, "</div>"); }).join('')
        : cardText(spec);
    var tooltipHtml = buildSpecTooltip(spec);
    return "<div class='spec'>".concat(header).concat(displayText, "<span class='tooltip'>").concat(tooltipHtml, "</span></div>");
}
// ----------------------------- Zone Rendering
function sketchMap(x) {
    var kvs = __spreadArray([], __read(x.entries()), false).filter(function (kv) { return kv[1] > 0; }).map(function (kv) { return "".concat(kv[0]).concat(kv[1]); });
    kvs.sort();
    return kvs.join(',');
}
function sketchCard(card, settings) {
    return "".concat(card.name).concat(sketchMap(card.tokens), "\n            ").concat(getIfDef(settings.pickMap, card.id), "\n            ").concat(getIfDef(settings.optionsMap, card.id));
}
function sketchCards(cards, settings) {
    var e_12, _a;
    var sketches = [];
    var counts = new Map();
    var first = new Map();
    var last = new Map();
    try {
        for (var cards_2 = __values(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
            var card = cards_2_1.value;
            var s = sketchCard(card, settings);
            if (counts.get(s) === undefined) {
                sketches.push(s);
                first.set(s, card);
            }
            counts.set(s, (counts.get(s) || 0) + 1);
            last.set(s, card);
        }
    }
    catch (e_12_1) { e_12 = { error: e_12_1 }; }
    finally {
        try {
            if (cards_2_1 && !cards_2_1.done && (_a = cards_2.return)) _a.call(cards_2);
        }
        finally { if (e_12) throw e_12.error; }
    }
    return sketches.map(function (s) { return [s, { first: first.get(s), last: last.get(s), count: counts.get(s) || 0 }]; });
}
function renderZone(state, zone, settings) {
    var e_13, _a;
    if (settings === void 0) { settings = {}; }
    var e = $("#".concat(zone));
    var optionsFns = [];
    var optionsIds = [];
    function render(card, count, forceHotkey) {
        if (count === void 0) { count = 1; }
        if (forceHotkey === void 0) { forceHotkey = undefined; }
        var option;
        var optionFn = getIfDef(settings.optionsMap, card.id);
        var hotkey = forceHotkey || getIfDef(settings.hotkeyMap, card.id);
        if (optionFn !== undefined) {
            option = optionsFns.length;
            optionsFns.push(optionFn);
            optionsIds.push(card.id);
            if (hotkey !== undefined)
                keyListeners.set(hotkey, function () { return optionFn(false); });
        }
        var cardRenderOptions = {
            option: option,
            hotkey: hotkey,
            pick: getIfDef(settings.pickMap, card.id),
        };
        return renderCard(card, state, zone, cardRenderOptions, globalRendererState.tokenRenderer, count);
    }
    var cards = state.zones.get(zone) || [];
    var compress = globalRendererState.compress[zone];
    if (compress) {
        var sketches = sketchCards(cards, settings);
        e.html(sketches.map(function (data) { var _a; return render(data[1].last, data[1].count || 0, (_a = settings.hotkeyMap) === null || _a === void 0 ? void 0 : _a.get(data[1].first.id)); }).join(''));
    }
    else {
        e.html(cards.map(function (c) { return render(c); }).join(''));
    }
    try {
        for (var _b = __values(optionsFns.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], fn = _d[1];
            bindClickEvent(e.find("#card".concat(optionsIds[i])), fn);
        }
    }
    catch (e_13_1) { e_13 = { error: e_13_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_13) throw e_13.error; }
    }
}
/*
function linkForState(state: State, campaign: boolean = false): string {
    const cs = campaign ? 'campaign&' : ''
    return `play?${cs}${specToURL(state.spec)}#${state.serializeHistory(false)}`
}
    */
function renderState(state, settings) {
    var e_14, _a;
    if (settings === void 0) { settings = {}; }
    window.renderedState = state;
    clearChoice();
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false;
        // URL update disabled for meta-game integration
    }
    $('#resolvingHeader').html('Resolving:');
    // Display energy as X/Y where Y is par, red if over par
    var par = state.spec.par;
    var energyDisplay = "".concat(state.energy, "/").concat(par);
    if (state.energy > par) {
        $('#energy').html("<span style=\"color: red\">".concat(energyDisplay, "</span>"));
    }
    else {
        $('#energy').html(energyDisplay);
    }
    $('#actions').html(state.actions.toString());
    $('#buys').html(state.buys.toString());
    $('#coin').html(state.coin.toString());
    $('#points').html("".concat(state.points, "/").concat(state.vp_goal));
    $('#resolving').empty();
    $('#resolving').html(state.resolving.map(function (c) { return renderCard(c, state, 'resolving', {}, globalRendererState.tokenRenderer); }).join(''));
    var _loop_1 = function (zone) {
        renderZone(state, zone, settings);
        var e = $("[zone='".concat(zone, "'] .zonename"));
        e.unbind('click');
        e.click(function () {
            globalRendererState.compress[zone] = !globalRendererState.compress[zone];
            localStorage.setItem("compress".concat(zone), JSON.stringify(globalRendererState.compress[zone]));
            renderZone(state, zone, settings);
        });
    };
    try {
        for (var zoneNames_1 = __values(zoneNames), zoneNames_1_1 = zoneNames_1.next(); !zoneNames_1_1.done; zoneNames_1_1 = zoneNames_1.next()) {
            var zone = zoneNames_1_1.value;
            _loop_1(zone);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (zoneNames_1_1 && !zoneNames_1_1.done && (_a = zoneNames_1.return)) _a.call(zoneNames_1);
        }
        finally { if (e_14) throw e_14.error; }
    }
    $('#playsize').html('' + state.play.length);
    $('#handsize').html('' + state.hand.length);
    $('#discardsize').html('' + state.discard.length);
}
// ----------------------------- Log Rendering
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
    var e_15, _a;
    try {
        for (var logTypes_1 = __values(logTypes), logTypes_1_1 = logTypes_1.next(); !logTypes_1_1.done; logTypes_1_1 = logTypes_1.next()) {
            var lt = logTypes_1_1.value;
            var e = $(".logOption[option=".concat(lt, "]"));
            var choosable = e.attr('option') != globalRendererState.logType;
            e.attr('choosable', choosable ? 'true' : null);
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (logTypes_1_1 && !logTypes_1_1.done && (_a = logTypes_1.return)) _a.call(logTypes_1);
        }
        finally { if (e_15) throw e_15.error; }
    }
    displayLogLines(state.logs[logType], ui);
}
function renderLogLine(msg, i) {
    return "<div><span class=\"logLine\" pos=".concat(i, ">").concat(msg, "</span></div>");
}
function displayLogLines(logs, ui) {
    var e_16, _a;
    var result = [];
    for (var i = logs.length - 1; i >= 0; i--) {
        result.push(renderLogLine(logs[i][0], i));
    }
    $('#log').html(result.join(''));
    var _loop_2 = function (i, e) {
        var state = e[1];
        if (state !== null) {
            $(".logLine[pos=".concat(i, "]")).click(function () {
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
    catch (e_16_1) { e_16 = { error: e_16_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_16) throw e_16.error; }
    }
}
// ----------------------------- Choice Rendering
function clearChoice() {
    keyListeners.clear();
    $('#choicePrompt').html('');
    $('#options').html('');
    $('#undoArea').html('');
}
function renderStringOption(option, hotkey, pick) {
    var hotkeyText = (hotkey !== undefined) ? renderHotkey(hotkey) : '';
    if (hotkey !== undefined)
        keyListeners.set(hotkey, function () { return option.value(false); });
    var picktext = (pick !== undefined) ? "<div class='pickorder'>".concat(pick, "</div>") : '';
    var e = $("<span class='option' choosable chosen='false'>".concat(picktext).concat(hotkeyText).concat(option.render, "</span>"));
    bindClickEvent(e, option.value);
    return e;
}
function renderChoice(ui, state, choicePrompt, options, picks) {
    var e_17, _a, e_18, _b;
    if (picks === void 0) { picks = []; }
    var optionsMap = new Map();
    var stringOptions = [];
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
    }
    var pickMap = new Map();
    try {
        for (var _c = __values(picks.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), i = _e[0], x = _e[1];
            pickMap.set(renderKey(x), i);
        }
    }
    catch (e_17_1) { e_17 = { error: e_17_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_17) throw e_17.error; }
    }
    var hotkeyMap = (globalRendererState.hotkeysOn)
        ? globalRendererState.hotkeyMapper.map(state, options)
        : new Map();
    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap: optionsMap,
        pickMap: pickMap,
        updateURL: false
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
            var hotkey = hotkeyMap.get(option.render);
            $('#options').append(renderStringOption(option, hotkey, pickMap.get(option.render)));
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (stringOptions_1_1 && !stringOptions_1_1.done && (_b = stringOptions_1.return)) _b.call(stringOptions_1);
        }
        finally { if (e_18) throw e_18.error; }
    }
    $('#undoArea').html(renderSpecials(state));
    if (ui !== null)
        bindSpecials(state, ui);
}
// ----------------------------- Special Buttons
function renderSpecials(state) {
    return [
        renderBack(),
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
function renderBack() {
    return "<span class='option' option='back' choosable chosen='false'>Back</span>";
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
    return "<span class='option', option='hotkeyToggle' choosable chosen='false'>".concat(renderHotkey('/'), " Hotkeys</span>");
}
function renderHelp() {
    return "<span id='help' class='option', option='help' choosable chosen='false'>".concat(renderHotkey('?'), " Help</span>");
}
function renderDeepLink() {
    return "<span id='deeplink' class='option', option='link' choosable chosen='false'>Link</span>";
}
function renderUndo(undoable) {
    var hotkeyText = renderHotkey('z');
    return "<span class='option', option='undo' choosable chosen='false'>".concat(hotkeyText, "Undo</span>");
}
function renderRedo(redoable) {
    var hotkeyText = renderHotkey('Z');
    return "<span class='option', option='redo' ".concat(redoable ? 'choosable' : '', " chosen='false'>").concat(hotkeyText, "Redo</span>");
}
// ----------------------------- Special Button Bindings
function bindSpecials(state, ui) {
    bindHotkeyToggle(ui);
    bindHelp(state, ui);
    bindRestart(state, ui);
    bindUndo(state, ui);
    bindRedo(state, ui);
    bindMacroToggle(ui);
    bindViewKingdom(state);
    //bindDeepLink(state)
    bindBack(ui);
}
function bindBack(ui) {
    function pick() {
        if (ui.choiceState != null) {
            ui.choiceState.reject(new UndoPastBeginning());
        }
    }
    keyListeners.set('Escape', pick);
    $("[option='back']").on('click', pick);
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
            e.html("<div id='kingdomView'>".concat(contents, "</div>"));
            globalRendererState.viewingKingdom = true;
        }
    }
    $("[option='viewKingdom']").on('click', onClick);
}
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
    e.html("<div id='macros'>".concat(contents, "</div>"));
    bindRecordMacroButton(ui);
    bindPlayMacroButtons(ui);
}
function renderRecordMacroButton(ui) {
    var buttonText = (ui.recordingMacro === null)
        ? 'Start recording'
        : 'Stop recording';
    return "<span id='recordMacro' class='option'\n             option='recordMacro' choosable chosen='false'>\n                 ".concat(buttonText, "\n             </span>");
}
function renderPlayMacroButton(macro, index) {
    var optionText = "macro".concat(index);
    var firstStep = macro[0];
    var firstStepText = (firstStep.kind == 'card')
        ? firstStep.card.name
        : firstStep.string;
    var buttonText = "".concat(firstStepText, " (").concat(macro.length, ")");
    return "<span id='playMacro' class='option'\n             option='".concat(optionText, "' choosable chosen='false'>\n                 ").concat(buttonText, "\n             </span>");
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
    var e_19, _a;
    function onClick(i, shifted) {
        if (shifted === void 0) { shifted = false; }
        if (ui.choiceState !== null && ui.playingMacro.length == 0) {
            ui.playingMacro = repeat(ui.macros[i], shifted ? 10 : 1);
            ui.resolveWithMacro();
        }
    }
    var _loop_3 = function (i, macro) {
        var e = $("[option='macro".concat(i, "'"));
        e.off('click');
        e.on('click', function (e) { return onClick(i, e.shiftKey); });
    };
    try {
        for (var _b = __values(ui.macros.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], macro = _d[1];
            _loop_3(i, macro);
        }
    }
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_19) throw e_19.error; }
    }
}
function bindHotkeyToggle(ui) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn;
        localStorage.setItem('hotkeysOn', JSON.stringify(globalRendererState.hotkeysOn));
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
            ui.choiceState.resolve(state.redo[state.redo.length - 1], false);
        }
    }
    keyListeners.set('Z', pick);
    $("[option='redo']").on('click', pick);
}
function bindUndo(state, ui) {
    function pick() {
        if (ui.choiceState != null) {
            ui.choiceState.reject(new Undo(state));
        }
    }
    keyListeners.set('z', pick);
    $("[option='undo']").on('click', pick);
}
/*
function bindDeepLink(state: State): void {
    $('#deeplink').click(() => showLinkDialog(linkForState(state)))
}
    */
function baseURL() {
    var url = window.location;
    return url.protocol + '//' + url.host;
}
function showLinkDialog(url) {
    $('#scoreSubmitter').attr('active', 'true');
    $('#scoreSubmitter').html("<label for=\"link\">Link:</label>" +
        "<textarea id=\"link\"></textarea>" +
        "<div>" +
        "<span class=\"option\" choosable id=\"copyLink\">".concat(renderHotkey('⏎'), "Copy</span>") +
        "<span class=\"option\" choosable id=\"cancel\">".concat(renderHotkey('Esc'), "Cancel</span>") +
        "</div>");
    $('#link').val("".concat(baseURL(), "?").concat(url));
    $('#link').select();
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
function bindHelp(state, ui) {
    function pick() {
        alert('Hotkeys:\n' +
            '/ - Toggle hotkeys\n' +
            'z - Undo\n' +
            'Z - Redo\n' +
            '? - Help\n' +
            'Shift+click - Repeat action');
    }
    keyListeners.set('?', pick);
    $("[option='help']").on('click', pick);
}
// ----------------------------- Macro Helpers
function macroStepFromChoice(x, chosen) {
    switch (x.kind) {
        case 'string': return x;
        case 'card': return __assign(__assign({}, x), { chosen: chosen });
        default: return assertNever(x);
    }
}
function macroMismatch(card, macroCard) {
    var result = 0;
    function addDisagreements(from, to) {
        var e_20, _a;
        try {
            for (var _b = __values(from.tokens.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], count = _d[1];
                if ((to.tokens.get(token) || 0) < count) {
                    result += 1;
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
        }
    }
    addDisagreements(card, macroCard);
    addDisagreements(macroCard, card);
    return result;
}
function macroMatchCandidate(card, macroCard) {
    return (card.place == macroCard.place) && (card.name == macroCard.name);
}
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
                    && macroMatchCandidate(x[0].card, macro.card)
                    && ((chosen.indexOf(x[1]) >= 0) == macro.chosen);
            });
            var card_1 = macro.card;
            renders.sort(function (a, b) {
                if (a[0].kind == 'card') {
                    if (b[0].kind == 'card') {
                        var c = a[0].card;
                        var d = b[0].card;
                        return macroMismatch(c, card_1) - macroMismatch(d, card_1);
                    }
                    else {
                        return 1;
                    }
                }
                else {
                    return -1;
                }
            });
            return (renders.length > 0) ? renders[0][1] : null;
    }
}
// ----------------------------- GameUI Class (webUI)
var GameUI = /** @class */ (function () {
    function GameUI() {
        this.undoing = false;
        this.macros = [];
        this.recordingMacro = null;
        this.playingMacro = [];
        this.choiceState = null;
    }
    GameUI.prototype.recordStep = function (x) {
        if (this.recordingMacro === null)
            return;
        this.recordingMacro.push(x);
    };
    GameUI.prototype.eraseStep = function () {
        if (this.recordingMacro === null)
            return;
        this.recordingMacro.pop();
    };
    GameUI.prototype.matchNextMacroStep = function () {
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
    GameUI.prototype.clearChoice = function () {
        this.choiceState = null;
        clearChoice();
    };
    GameUI.prototype.resolveWithMacro = function () {
        if (this.choiceState !== null) {
            var option = this.matchNextMacroStep();
            if (option !== null)
                this.choiceState.resolve(option, false);
        }
    };
    GameUI.prototype.render = function () {
        if (this.choiceState != null) {
            var cs_1 = this.choiceState;
            renderChoice(this, cs_1.state, cs_1.choicePrompt, cs_1.options.map(function (x, i) { return (__assign(__assign({}, x), { value: function (shifted) { return cs_1.resolve(i, shifted); } })); }), cs_1.chosen.map(function (i) { return cs_1.options[i].render; }));
        }
    };
    GameUI.prototype.choice = function (state, choicePrompt, options, info, chosen) {
        var ui = this;
        return new Promise(function (resolve, reject) {
            function newResolve(n, shifted) {
                ui.clearChoice();
                var macroStep = macroStepFromChoice(options[n].render, chosen.indexOf(n) >= 0);
                ui.recordStep(macroStep);
                if (shifted)
                    ui.playingMacro = repeat([macroStep], 9);
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
                newResolve(option, false);
            }
            else if (chooseTrivial !== null) {
                if (ui.undoing) {
                    newReject(new Undo(state));
                }
                else {
                    newResolve(chooseTrivial, false);
                }
            }
            else {
                ui.undoing = false;
                ui.render();
            }
        });
    };
    GameUI.prototype.chooseTrivial = function (state, options, info) {
        if (info.indexOf('tutorial') != -1)
            return null;
        if (info.indexOf('actChoice') != -1)
            return null;
        if (options.length == 1)
            return 0;
        return null;
    };
    GameUI.prototype.victory = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var ui, score, remainingPotions, submitOrUndo;
            return __generator(this, function (_a) {
                ui = this;
                score = state.energy;
                remainingPotions = state.potions;
                submitOrUndo = function () {
                    return new Promise(function (resolve, reject) {
                        ui.undoing = true;
                        function newReject(reason) {
                            if (reason instanceof Undo)
                                ui.undoing = true;
                            ui.clearChoice();
                            reject(reason);
                        }
                        var options = [{
                                render: { kind: 'string', string: 'Done' },
                                value: null,
                                hotkeyHint: { kind: 'key', val: '!' }
                            }];
                        ui.choiceState = {
                            state: state,
                            choicePrompt: "You won using ".concat(state.energy, " energy!"),
                            options: options,
                            info: ["victory"],
                            chosen: [],
                            resolve: function (n, shifted) {
                                ui.clearChoice();
                                resolve();
                            },
                            reject: newReject,
                        };
                        ui.render();
                    });
                };
                return [2 /*return*/, submitOrUndo()];
            });
        });
    };
    return GameUI;
}());
export { GameUI };
// ----------------------------- Game Entry Points
export function startGame(spec) {
    return __awaiter(this, void 0, void 0, function () {
        var ui;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resetGlobalRenderer();
                    ui = new GameUI();
                    // Show game container, hide other screens
                    $('#gameContainer').show();
                    $('#stageScreen').hide();
                    $('#pathSelectionScreen').hide();
                    $('#victoryScreen').hide();
                    $('#gameOverScreen').hide();
                    return [4 /*yield*/, playGame(spec, ui)];
                case 1: 
                // Start the game loop
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
//# sourceMappingURL=gameUI.js.map