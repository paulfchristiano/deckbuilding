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
import { Shadow, State, Card } from './logic.js';
import { renderCost, renderEnergy } from './logic.js';
import { emptyState } from './logic.js';
import { logTypes } from './logic.js';
import { sets } from './logic.js';
import { SetState, Undo, InvalidHistory } from './logic.js';
import { playGame, initialState } from './logic.js';
import { coerceReplayVersion, parseReplay, MalformedReplay } from './logic.js';
import { randomPlaceholder } from './logic.js';
import { MalformedSpec, specToURL, specFromURL } from './logic.js';
import { vpModes, vpCardNames, vpEventNames } from './logic.js';
import { supplyComp, eventComp } from './logic.js';
// register cards
import { throneRoom, duplicate, allPotions, boonCards, boonEvents } from './cards/index.js';
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
var hotkeys = supplyAndPlayHotkeys.concat(handHotkeys);
var choiceHotkeys = handHotkeys.concat(supplyAndPlayHotkeys);
window.addEventListener('keydown', function (e) {
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
    if (e.key == 'Shift') {
        document.body.classList.add('shift-held');
    }
});
window.addEventListener('keyup', function (e) {
    if (e.key == 'Shift') {
        document.body.classList.remove('shift-held');
    }
});
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
// ------------------ Rendering State
function assertNever(x) {
    throw new Error("Unexpected: ".concat(x));
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
function describeCost(cost) {
    var coinCost = (cost.coin > 0) ? ["lose $".concat(cost.coin)] : [];
    var energyCost = (cost.energy > 0) ? ["gain ".concat(renderEnergy(cost.energy))] : [];
    var costs = coinCost.concat(energyCost);
    var costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing';
    return "Cost: ".concat(costStr, ".");
}
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
        default: assertNever(shadow.spec);
    }
    return ["<div class='card' ".concat(ticktext, " ").concat(shadowtext, ">"), "<div class='cardbody'>".concat(card).concat(tokenhtml, "</div>"), "<div class='cardcost'>".concat(costhtml, "</div>"), "<span class='tooltip tooltip-simple'>".concat(tooltip, "</span>"), "</div>"].join('');
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
function cardText(spec) {
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
// Simple tooltip: uses simpleText if available, no related cards
function renderTooltipSimple(card, state, tokenRenderer) {
    var buyStr = !isZero(card.spec.buyCost) ?
        "(".concat(renderCost(card.spec.buyCost), ")") : '---';
    var costStr = !isZero(card.spec.fixedCost) ?
        "(".concat(renderCost(card.spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(card.name, " ").concat(costStr, "---</div>");
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var bodyText = card.spec.simpleText
        ? "<div>".concat(card.spec.simpleText, "</div>")
        : cardText(card.spec);
    return header + bodyText + tokensHtml;
}
// Full tooltip: full card text plus related cards
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
// Legacy function for compatibility
function renderTooltip(card, state, tokenRenderer) {
    return renderTooltipFull(card, state, tokenRenderer);
}
function renderSpec(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    var me = "<div class='spec'>".concat(header).concat(cardText(spec), "</div>");
    var related = (spec.relatedCards || []).map(renderSpec);
    return [me].concat(related).join('');
}
// Build full HTML tooltip for a card spec (matching in-game tooltip style)
function buildSpecTooltip(spec) {
    var buyStr = !isZero(spec.buyCost) ?
        "(".concat(renderCost(spec.buyCost), ")") : '---';
    var costStr = !isZero(spec.fixedCost) ?
        "(".concat(renderCost(spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(spec.name, " ").concat(costStr, "---</div>");
    var baseFilling = header + cardText(spec);
    // Related cards
    var relatedCards = spec.relatedCards || [];
    var relatedFilling = relatedCards.map(function (r) { return buildSpecTooltip(r); }).join('');
    return "".concat(baseFilling).concat(relatedFilling);
}
// Render spec without related cards inline, but with tooltip
function renderSpecNoRelated(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    // Use simpleText if available, otherwise full card text
    var displayText = spec.simpleText
        ? "<div>".concat(spec.simpleText, "</div>")
        : cardText(spec);
    // Build HTML tooltip matching in-game style
    var tooltipHtml = buildSpecTooltip(spec);
    return "<div class='spec'>".concat(header).concat(displayText, "<span class='tooltip'>").concat(tooltipHtml, "</span></div>");
}
function getIfDef(m, x) {
    return (m == undefined) ? undefined : m.get(x);
}
var globalRendererState = {
    hotkeysOn: JSON.parse(localStorage.getItem('hotkeysOn')) === true,
    userURL: true,
    viewingKingdom: false,
    viewingMacros: false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: 'energy',
    compress: {
        play: JSON.parse(localStorage.getItem('compressplay')) === true,
        supply: false,
        events: false,
        hand: JSON.parse(localStorage.getItem('compresshand')) === true,
        discard: JSON.parse(localStorage.getItem('compressdiscard')) === true,
        potions: false
    }
};
var zoneNames = ['play', 'supply', 'events', 'hand', 'discard', 'potions'];
function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper();
    globalRendererState.tokenRenderer = new TokenRenderer();
}
function linkForState(state, campaign) {
    if (campaign === void 0) { campaign = false; }
    var cs = campaign ? 'campaign&' : '';
    return "play?".concat(cs).concat(specToURL(state.spec), "#").concat(state.serializeHistory(false));
}
//Two maps should have the same sketch if the keys and values serialize the same
//0 is treated the same as no entry
function sketchMap(x) {
    var kvs = __spreadArray([], __read(x.entries()), false).filter(function (kv) { return kv[1] > 0; }).map(function (kv) { return "".concat(kv[0]).concat(kv[1]); });
    kvs.sort();
    return kvs.join(',');
}
// two cards are rendered together in compress mode iff they have the same sketch
function sketchCard(card, settings) {
    return "".concat(card.name).concat(sketchMap(card.tokens), "\n            ").concat(getIfDef(settings.pickMap, card.id), "\n            ").concat(getIfDef(settings.optionsMap, card.id));
}
// Returns a list of distinct sketches appearing amongst cards, in order
// For each includes the first, last, and # of cards with that sketch
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
function bindClickEvent(element, handler) {
    element.unbind('click');
    element.bind('click', function (e) { return handler(e.shiftKey); });
}
function renderState(state, settings) {
    var e_14, _a;
    if (settings === void 0) { settings = {}; }
    window.renderedState = state;
    clearChoice();
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false;
        window.history.replaceState(null, "", linkForState(state, isCampaign));
    }
    $('#resolvingHeader').html('Resolving:');
    // Display energy as X/Y where Y is par, red if over par
    var par = getCurrentPar();
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
            var logType_1 = logTypes_1_1.value;
            var e = $(".logOption[option=".concat(logType_1, "]"));
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
// We will prefer the card option that has the lowest mismatch
function macroMismatch(card, macroCard) {
    // Take the number of token counts where they disagree
    // (Could instead do total magnitude of disagreement, but this is probably best)
    var result = 0;
    function addDisagreements(from, to) {
        var e_17, _a;
        try {
            for (var _b = __values(from.tokens.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), token = _d[0], count = _d[1];
                // We count a disagreement only on the side with more tokens
                // (since it might not appear in the tokens dict on the other side)
                if ((to.tokens.get(token) || 0) < count) {
                    result += 1;
                }
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
    addDisagreements(card, macroCard);
    addDisagreements(macroCard, card);
    return result;
}
// A card must pass this filter to be considered as a macro match
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
function macroStepFromChoice(x, chosen) {
    switch (x.kind) {
        case 'string': return x;
        case 'card': return __assign(__assign({}, x), { chosen: chosen });
        default: return assertNever(x);
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
    webUI.prototype.recordStep = function (x) {
        if (this.recordingMacro === null)
            return;
        this.recordingMacro.push(x);
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
                this.choiceState.resolve(option, false);
        }
    };
    webUI.prototype.render = function () {
        if (this.choiceState != null) {
            var cs_1 = this.choiceState;
            renderChoice(this, cs_1.state, cs_1.choicePrompt, cs_1.options.map(function (x, i) { return (__assign(__assign({}, x), { value: function (shifted) { return cs_1.resolve(i, shifted); } })); }), cs_1.chosen.map(function (i) { return cs_1.options[i].render; }));
        }
    };
    webUI.prototype.choice = function (state, choicePrompt, options, info, chosen) {
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
            var ui, score, remainingPotions, doneAction, submitOrUndo;
            return __generator(this, function (_a) {
                ui = this;
                score = state.energy;
                remainingPotions = state.potions.map(function (card) { return card.spec; });
                doneAction = function () {
                    onKingdomVictory(score, remainingPotions);
                };
                submitOrUndo = function () {
                    return new Promise(function (resolve, reject) {
                        ui.undoing = true;
                        heartbeat(state.spec);
                        function newReject(reason) {
                            if (reason instanceof Undo)
                                ui.undoing = true;
                            ui.clearChoice();
                            reject(reason);
                        }
                        var options = [{
                                render: { kind: 'string', string: 'Done' },
                                value: doneAction,
                                hotkeyHint: { kind: 'key', val: '!' }
                            }];
                        ui.choiceState = {
                            state: state,
                            choicePrompt: "You won using ".concat(state.energy, " energy!"),
                            options: options,
                            info: ["victory"],
                            chosen: [],
                            resolve: doneAction,
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
function renderCheckbox(div, additionalHtml, checked, cb) {
    div.html("<input type=\"checkbox\" ".concat(checked ? 'checked' : '', "> ").concat(additionalHtml));
    div.off('click');
    div.click(function (e) { return cb(e.target.checked); });
}
function renderChoice(ui, state, choicePrompt, options, picks) {
    var e_18, _a, e_19, _b;
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
    var pickMap;
    pickMap = new Map();
    try {
        for (var _c = __values(picks.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), i = _e[0], x = _e[1];
            pickMap.set(renderKey(x), i);
        }
    }
    catch (e_18_1) { e_18 = { error: e_18_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_18) throw e_18.error; }
    }
    var hotkeyMap = (globalRendererState.hotkeysOn)
        ? globalRendererState.hotkeyMapper.map(state, options)
        : new Map();
    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap: optionsMap,
        pickMap: pickMap,
        updateURL: false // Disabled for static version: (!globalRendererState.userURL || state.hasHistory())
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
    catch (e_19_1) { e_19 = { error: e_19_1 }; }
    finally {
        try {
            if (stringOptions_1_1 && !stringOptions_1_1.done && (_b = stringOptions_1.return)) _b.call(stringOptions_1);
        }
        finally { if (e_19) throw e_19.error; }
    }
    $('#undoArea').html(renderSpecials(state));
    if (ui !== null)
        bindSpecials(state, ui);
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
    return "<span class='option', option='undo' ".concat(undoable ? 'choosable' : '', " chosen='false'>").concat(hotkeyText, "Undo</span>");
}
function renderRedo(redoable) {
    var hotkeyText = renderHotkey('Z');
    return "<span class='option', option='redo' ".concat(redoable ? 'choosable' : '', " chosen='false'>").concat(hotkeyText, "Redo</span>");
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
    bindBack();
}
function bindBack() {
    $("[option='back']").on('click', function () { return goBackToStage(); });
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
function repeat(xs, n) {
    return Array(n).fill(xs).flat(1);
}
function bindPlayMacroButtons(ui) {
    var e_20, _a;
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
    catch (e_20_1) { e_20 = { error: e_20_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_20) throw e_20.error; }
    }
}
function unbindPlayMacroButtons(ui) {
    var e_21, _a;
    try {
        for (var _b = __values(ui.macros.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), i = _d[0], macro = _d[1];
            var e = $("[option='macro".concat(i, "'"));
            e.off('click');
        }
    }
    catch (e_21_1) { e_21 = { error: e_21_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_21) throw e_21.error; }
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
        "<span class=\"option\" choosable id=\"copyLink\">".concat(renderHotkey('⏎'), "Copy</span>") +
        "<span class=\"option\" choosable id=\"cancel\">".concat(renderHotkey('Esc'), "Cancel</span>") +
        "</div>");
    // Use full URL instead of shortened link (no server)
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
function clearChoice() {
    keyListeners.clear();
    $('#choicePrompt').html('');
    $('#options').html('');
    $('#undoArea').html('');
}
var tutorialStages = [
    {
        text: ["Welcome to the tutorial.\n        It will walk you through the first few actions of a simple game.\n        Press enter or click 'Next' to advance.", "When you use an event or play a card, you first pay its cost\n        then follow its instructions.", "You can read what a card does by hovering over it,\n        or view all cards by clicking the 'Kingdom' button\n        at the top of the screen. After pressing 'Next',\n        read what Refresh does, then click on it to use it."],
        nextAction: 0,
    },
    {
        text: ["When you used Refresh you spent @@@@,\n        because that's the cost of Refresh.\n         You can see how much @ you've spent in the resources row,\n         directly above the events.\n         The goal of the game is to spend as little as possible.", "After paying Refresh's cost, you put your discard pile into your hand.\n         These are the cards available to play.", "Then you gained 5 actions, which you can use to play cards from your hand,\n         and 1 buy, which you can use to buy a card from the supply.\n         Your actions and buys are visible above the events.", "You have $0, so you can't buy much.\n         But you can use an action to play a Copper from your hand."],
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
        text: ["When you buy a card, you lose a buy and the $ you spent on it.\n        Then you create a copy of that card in your discard.\n        Next time you Refresh you will be able to play your new Silver.", "Note that using an event like Refresh or Duplicate doesn't require a buy.", "For now, click on an Estate to play it."],
        nextAction: 0
    },
    {
        text: ["You spent @ to play the estate, and gained 1 vp.\n        The goal of the game is to get to the target vp\n        using as little @ as possible.", "If you play an Estate using a Throne Room, you won't pay @. You only\n        pay a card's cost when you play or buy it the 'normal' way.\n        You also wouldn't pay an action, except that Throne Room tells you to.", "This is a very small kingdom for the purposes of learning.\n        The fastest win with these cards is 38@. Good luck!", "You can press '?' or click 'Help' to view the help at any time."],
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
        "<span class=\"option\" choosable id=\"tutorialNext\">\n             ".concat(renderHotkey('⏎'), " Next\n         </span>"));
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
function getTutorialSpec() {
    return {
        cards: [throneRoom],
        events: [duplicate],
        kind: 'pick'
    };
}
export function loadTutorial() {
    var state = initialState(getTutorialSpec());
    console.log(state);
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
            "The goal of the game is to get to the target vp (shown in the display) using as little energy (@) as possible.",
            "You can buy a card by spending a buy and paying its buy cost.",
            "When you buy a card, create a copy of it. Cards you create go in your discard by default.",
            "You can play a card by spending an action and paying its cost.",
            "When you play a card, put it in the resolving zone and follow its instructions.",
            "After playing a card, discard it if it's still in the resolving zone.",
            "You can use an event by paying its cost. When you use an event, folllow its instructions.",
            "The symbols below a card's name indicate its cost (or buy cost for cards in the supply).",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to pay it.",
            "When a cost is measured in coin ($) then you can only pay it if you have enough coin.",
            "If an effect instructs you to play or buy a card, you don't have to pay the normal cost.",
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (effect) apply whenever the card is in play.",
            "If a card has an (effect), then put it in play after playing it, instead of discarding it.",
            "Effects marked with (static) apply whenever the card is in the supply or events zone.",
            "&nbsp;",
            "Other help:",
            "Click the 'Kingdom' button to view the text of all cards at once.",
            "Press 'z' or click the 'Undo' button to undo the last move.",
            "Press '/' or click the 'Hotkeys' button to turn on hotkeys.",
            "Click the 'Link' button to copy a shortlink to the current state.",
            "Click on a zone's name to compress identical cards in that zone.",
            "Go <a href='index.html'>here</a> to see all the ways to play the game.",
            "Check out the scoreboard <a href=".concat(scoreboardURL(state.spec), ">here</a>."),
            "Copy <a href='play?".concat(specToURL(state.spec), "'>this link</a> to replay this game any time."),
            "Use the URL in the address bar to link to the current state of this game.",
            "(Or click the 'Link' button to get a shortlink.)",
            "Click the 'Macros' button to record and replay sequences of actions.",
            "Shift+click a card or macro to repeat that action up to 10 times."
        ];
        $('#choicePrompt').html('');
        $('#resolvingHeader').html('');
        $('#resolving').html(helpLines.map(function (x) { return "<div class='helpLine'>".concat(x, "</div class='helpline'>"); }).join(''));
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
    return "username=".concat(localStorage.campaignUsername, "&hashedPassword=").concat(localStorage.hashedPassword);
}
// Campaign submission disabled for static version
function renderCampaignSubmission(state, done) {
    done();
}
function renderScoreSubmission(state, done) {
    var score = state.energy;
    var url = specToURL(state.spec);
    $('#scoreSubmitter').attr('active', 'true');
    var pattern = "[a-ZA-Z0-9]";
    $('#scoreSubmitter').html("<label for=\"username\">Name:</label>" +
        "<textarea id=\"username\"></textarea>" +
        "<div>" +
        "<span class=\"option\" choosable id=\"submitScore\">".concat(renderHotkey('⏎'), "Submit</span>") +
        "<span class=\"option\" choosable id=\"cancelSubmit\">".concat(renderHotkey('Esc'), "Cancel</span>") +
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
        // Score submission disabled for static version
        exit();
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
    return "scoreboard?".concat(specToURL(spec));
}
//TODO: change the sidebar based on whether you are in a campaign
function campaignHeartbeat(spec, interval) {
    // Campaign disabled for static version
}
//TODO: still need to refactor global state
var isCampaign = false;
function heartbeat(spec, interval) {
    // Server features disabled for static version
}
function renderBest(best, spec) {
    $('#best').html("Fastest win on this kingdom: ".concat(best, " (<a target='_blank' href=\"").concat(scoreboardURL(spec), "\">scoreboard</a>)"));
}
function renderScoreboardLink(spec) {
    $('#best').html("No wins yet for this kingdom (<a target='_blank' href=\"".concat(scoreboardURL(spec), "\">scoreboard</a>)"));
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
            alert("Error loading history: ".concat(e));
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
            playGame(e.state.clearFuture(), true);
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
            playGame(e.state.clearFuture(), true);
        }
        else {
            alert(e);
        }
    });
}
// ----------------------------------- Kingdom picker
//
function kingdomURL(kindParam, cards, events) {
    return "play?".concat(kindParam, "cards=").concat(cards.map(function (card) { return card.name; }).join(','), "&events=").concat(events.map(function (card) { return card.name; }));
}
function countIn(s, f) {
    var e_22, _a;
    var count = 0;
    try {
        for (var s_1 = __values(s), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
            var x = s_1_1.value;
            if (f(x))
                count += 1;
        }
    }
    catch (e_22_1) { e_22 = { error: e_22_1 }; }
    finally {
        try {
            if (s_1_1 && !s_1_1.done && (_a = s_1.return)) _a.call(s_1);
        }
        finally { if (e_22) throw e_22.error; }
    }
    return count;
}
//TODO: refactor the logic into logic.ts, probably just state initialization
export function loadPicker(picked_sets) {
    var state = emptyState;
    var cards = [];
    var events = [];
    picked_sets.forEach(function (picked_set) {
        cards.push.apply(cards, __spreadArray([], __read(sets[picked_set]['cards'].slice()), false));
        events.push.apply(events, __spreadArray([], __read(sets[picked_set]['events'].slice()), false));
    });
    $('#expansionPicker').empty();
    Object.keys(sets).forEach(function (set_option_str) {
        if (set_option_str === 'core') {
            return;
        }
        var set_option = set_option_str;
        var d = $('<div>');
        renderCheckbox(d, set_option, picked_sets.includes(set_option), function (checked) {
            var new_picked_sets = picked_sets.slice();
            if (checked) {
                new_picked_sets.push(set_option);
            }
            else {
                new_picked_sets = new_picked_sets.filter(function (x) { return x !== set_option; });
            }
            loadPicker(new_picked_sets);
        });
        $('#expansionPicker').append(d);
    });
    // allCards.slice()
    // allEvents.slice()
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
    function elem(i, kind) {
        var id = (kind == 'card') ? 'supply' : 'events';
        return $("#".concat(id, " [option='").concat(i, "']"));
    }
    function prefix(s) {
        var parts = s.split('/');
        return parts.slice(0, parts.length - 1).join('/');
    }
    function kingdomLink(kind) {
        if (kind === void 0) { kind = ''; }
        return kingdomURL(kind, Array.from(chosen.card.values()).map(function (i) { return cards[i]; }), Array.from(chosen.event.values()).map(function (i) { return events[i]; }));
    }
    var chosen = {
        'card': new Set(),
        'event': new Set(),
    };
    $('#cardCount').html(String(chosen.card.size));
    $('#eventCount').html(String(chosen.event.size));
    function pick(i, kind) {
        if (chosen[kind].has(i)) {
            chosen[kind].delete(i);
            elem(i, kind).attr('chosen', false);
        }
        else {
            chosen[kind].add(i);
            elem(i, kind).attr('chosen', true);
        }
        $('#cardCount').html(String(chosen.card.size));
        $('#eventCount').html(String(chosen.event.size));
        if (chosen.card.size > 0 || chosen.event.size > 0) {
            $('#pickLink').attr('href', kingdomLink());
            $('#requireLink').attr('href', kingdomLink('kind=require&'));
        }
        else {
            $('#pickLink').removeAttr('href');
            $('#requireLink').removeAttr('href');
        }
    }
    function makeOption(card, i, kind) {
        return {
            value: function () { return pick(i, kind); },
            render: { kind: 'card', card: card }
        };
    }
    renderChoice(null, state, 'Choose which events and cards to use.', state.supply.map(function (card, i) { return makeOption(card, i, 'card'); }).concat(state.events.map(function (card, i) { return makeOption(card, i, 'event'); })));
}
// ----------------------------------- Landing Page
// Stage-based game state
var TOTAL_STAGES = 8;
var BASE_PARS = [40, 35, 30, 37, 24, 21, 18, 0]; // Base par for each stage (0-indexed)
var currentStage = 1;
var currentKingdom = null;
var currentVPModeName = '';
var currentBoon = null;
var stageScores = Array(TOTAL_STAGES).fill(null);
var stagePars = Array(TOTAL_STAGES).fill(null); // Actual par for each completed stage
var currentBuffer = 16;
var ALL_BOONS = [
    {
        name: 'Windfall',
        description: 'Gain $15 and 5 buys at the start of the game',
        parReduction: 10,
        cards: [],
        events: [boonEvents.windfall],
    },
    {
        name: 'Escalate',
        description: 'Add Escalate as an event',
        parReduction: 12,
        cards: [],
        events: [boonEvents.escalate],
    },
    {
        name: 'Public Works',
        description: 'Add Public Works as a card',
        parReduction: 5,
        cards: [boonCards.publicWorks],
        events: [],
    },
    {
        name: 'Reuse',
        description: 'Add Reuse as an event',
        parReduction: 7,
        cards: [],
        events: [boonEvents.reuse],
    },
    {
        name: 'Flourish',
        description: 'Add Flourish as an event',
        parReduction: 7,
        cards: [],
        events: [boonEvents.flourish],
    },
    {
        name: 'Recycle',
        description: 'Add Recycle as an event',
        parReduction: 5,
        cards: [],
        events: [boonEvents.recycle],
    },
    {
        name: 'Vault',
        description: 'Add Vault as an event, start with 10 actions and 2 buys',
        parReduction: 4,
        cards: [],
        events: [boonEvents.vault, boonEvents.vaultStart],
    },
    {
        name: 'Duplicate',
        description: 'Start with a duplicate token on everything',
        parReduction: 5,
        cards: [],
        events: [boonEvents.duplicateStart],
    },
    {
        name: 'Accelerate',
        description: 'Start with a priority token on everything',
        parReduction: 5,
        cards: [],
        events: [boonEvents.priorityStart],
    },
    {
        name: 'Prioritize',
        description: 'Add Prioritize as an event',
        parReduction: 5,
        cards: [],
        events: [boonEvents.prioritize],
    },
    {
        name: 'Traveling Fair',
        description: 'Add Traveling Fair as an event (no scaling cost)',
        parReduction: 6,
        cards: [],
        events: [boonEvents.travelingFair],
    },
    {
        name: 'Populate',
        description: 'Add Populate as an event (buys all cards)',
        parReduction: 3,
        cards: [],
        events: [boonEvents.populate],
    },
    {
        name: 'Insight',
        description: 'Add Insight as an event',
        parReduction: 3,
        cards: [],
        events: [boonEvents.insight],
    },
];
function getCurrentPar() {
    var basePar = BASE_PARS[currentStage - 1] || 0;
    // No boon on final stage (stage 8)
    if (currentStage === TOTAL_STAGES || !currentBoon) {
        return basePar;
    }
    return Math.max(0, basePar - currentBoon.parReduction);
}
var stageAddButtonStates = [];
var collectedCards = [];
var collectedEvents = [];
var currentPotions = [];
var deckDialogOpen = false;
var leftPath = null;
var rightPath = null;
// Get cards only from base and expansion
function getAvailableCards() {
    var _a;
    return ((_a = sets['base']) === null || _a === void 0 ? void 0 : _a.cards) || [];
}
function getAvailableEvents() {
    var _a;
    return ((_a = sets['base']) === null || _a === void 0 ? void 0 : _a.events) || [];
}
function shuffleArray(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = __read([array[j], array[i]], 2), array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function generateRandomSeed() {
    return Math.random().toString(36).substring(2, 10);
}
// Simple hash function matching the one in logic.ts
function hashString(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
function generateStageOptions() {
    // Generate add button options for this stage (only from base and expansion)
    var cardPool = getAvailableCards().filter(function (c) {
        return !vpCardNames.has(c.name) &&
            c.name !== 'Copper' && c.name !== 'Silver' && c.name !== 'Gold' &&
            !collectedCards.some(function (cc) { return cc.name === c.name; });
    });
    var eventPool = getAvailableEvents().filter(function (e) {
        return !vpEventNames.has(e.name) && e.name !== 'Refresh' &&
            !collectedEvents.some(function (ce) { return ce.name === e.name; });
    });
    // Filter potions to exclude ones already collected
    var potionPool = allPotions.filter(function (p) {
        return !currentPotions.some(function (cp) { return cp.name === p.name; });
    });
    var shuffledCards = shuffleArray(__spreadArray([], __read(cardPool), false));
    var shuffledEvents = shuffleArray(__spreadArray([], __read(eventPool), false));
    var shuffledPotions = shuffleArray(__spreadArray([], __read(potionPool), false));
    stageAddButtonStates = [
        { kind: 'card', options: shuffledCards.slice(0, 3), used: false, selectedCard: null },
        { kind: 'card', options: shuffledCards.slice(3, 6), used: false, selectedCard: null },
        { kind: 'event', options: shuffledEvents.slice(0, 3), used: false, selectedCard: null },
        { kind: 'potion', options: shuffledPotions.slice(0, 3), used: false, selectedCard: null },
    ];
    // Select random boon (no boon on final stage)
    if (currentStage === TOTAL_STAGES) {
        currentBoon = null;
    }
    else {
        var shuffledBoons = shuffleArray(__spreadArray([], __read(ALL_BOONS), false));
        currentBoon = shuffledBoons[0];
    }
    // Generate kingdom for this stage
    var seed = generateRandomSeed();
    var h = hashString(seed + 'vpmode');
    var modeIndex = ((h % vpModes.length) + vpModes.length) % vpModes.length;
    currentKingdom = {
        kind: 'full',
        randomizer: {
            seed: seed,
            expansions: ['base']
        }
    };
    currentVPModeName = vpModes[modeIndex].name;
}
function generatePathOptions() {
    // Generate all 4 rewards: 2 cards, 1 event, 1 potion
    var cardPool = getAvailableCards().filter(function (c) {
        return !vpCardNames.has(c.name) &&
            c.name !== 'Copper' && c.name !== 'Silver' && c.name !== 'Gold' &&
            !collectedCards.some(function (cc) { return cc.name === c.name; });
    });
    var eventPool = getAvailableEvents().filter(function (e) {
        return !vpEventNames.has(e.name) && e.name !== 'Refresh' &&
            !collectedEvents.some(function (ce) { return ce.name === e.name; });
    });
    var potionPool = allPotions.filter(function (p) {
        return !currentPotions.some(function (cp) { return cp.name === p.name; });
    });
    var shuffledCards = shuffleArray(__spreadArray([], __read(cardPool), false));
    var shuffledEvents = shuffleArray(__spreadArray([], __read(eventPool), false));
    var shuffledPotions = shuffleArray(__spreadArray([], __read(potionPool), false));
    // Create 4 rewards
    var allRewards = [
        { kind: 'card', options: shuffledCards.slice(0, 3) },
        { kind: 'card', options: shuffledCards.slice(3, 6) },
        { kind: 'event', options: shuffledEvents.slice(0, 3) },
        { kind: 'potion', options: shuffledPotions.slice(0, 3) },
    ];
    // Shuffle and split 2-2
    var shuffledRewards = shuffleArray(__spreadArray([], __read(allRewards), false));
    var leftRewards = shuffledRewards.slice(0, 2);
    var rightRewards = shuffledRewards.slice(2, 4);
    // Generate kingdom and boon for left path
    var leftSeed = generateRandomSeed();
    var leftH = hashString(leftSeed + 'vpmode');
    var leftModeIndex = ((leftH % vpModes.length) + vpModes.length) % vpModes.length;
    var shuffledBoonsLeft = shuffleArray(__spreadArray([], __read(ALL_BOONS), false));
    // Generate kingdom and boon for right path
    var rightSeed = generateRandomSeed();
    var rightH = hashString(rightSeed + 'vpmode');
    var rightModeIndex = ((rightH % vpModes.length) + vpModes.length) % vpModes.length;
    var shuffledBoonsRight = shuffleArray(__spreadArray([], __read(ALL_BOONS), false));
    leftPath = {
        rewards: leftRewards,
        vpModeName: vpModes[leftModeIndex].name,
        boon: currentStage === TOTAL_STAGES ? null : shuffledBoonsLeft[0],
        kingdom: {
            kind: 'full',
            randomizer: { seed: leftSeed, expansions: ['base'] }
        }
    };
    rightPath = {
        rewards: rightRewards,
        vpModeName: vpModes[rightModeIndex].name,
        boon: currentStage === TOTAL_STAGES ? null : shuffledBoonsRight[0],
        kingdom: {
            kind: 'full',
            randomizer: { seed: rightSeed, expansions: ['base'] }
        }
    };
}
function showPathSelectionScreen() {
    var e_23, _a, e_24, _b;
    if (!leftPath || !rightPath)
        return;
    // Update progress sidebar
    updateProgressSidebarPath();
    // Update title
    $('#pathTitle').text("Stage ".concat(currentStage, " - Choose Your Path"));
    // Populate left path
    $('#leftRewards').empty();
    try {
        for (var _c = __values(leftPath.rewards), _d = _c.next(); !_d.done; _d = _c.next()) {
            var reward = _d.value;
            var rewardText = reward.kind === 'card' ? 'Add Card' :
                reward.kind === 'event' ? 'Add Event' : 'Add Potion';
            $('#leftRewards').append("<div class=\"pathReward\">".concat(rewardText, "</div>"));
        }
    }
    catch (e_23_1) { e_23 = { error: e_23_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_23) throw e_23.error; }
    }
    var leftPlayText = "Play: ".concat(leftPath.vpModeName);
    if (leftPath.boon) {
        leftPlayText += " + ".concat(leftPath.boon.name);
    }
    $('#leftPlay').text(leftPlayText);
    // Populate right path
    $('#rightRewards').empty();
    try {
        for (var _e = __values(rightPath.rewards), _f = _e.next(); !_f.done; _f = _e.next()) {
            var reward = _f.value;
            var rewardText = reward.kind === 'card' ? 'Add Card' :
                reward.kind === 'event' ? 'Add Event' : 'Add Potion';
            $('#rightRewards').append("<div class=\"pathReward\">".concat(rewardText, "</div>"));
        }
    }
    catch (e_24_1) { e_24 = { error: e_24_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_24) throw e_24.error; }
    }
    var rightPlayText = "Play: ".concat(rightPath.vpModeName);
    if (rightPath.boon) {
        rightPlayText += " + ".concat(rightPath.boon.name);
    }
    $('#rightPlay').text(rightPlayText);
    // Set up click handlers
    $('#goLeft').off('click').on('click', function () { return selectPath('left'); });
    $('#goRight').off('click').on('click', function () { return selectPath('right'); });
    // Show path selection screen
    $('#stageScreen').hide();
    $('#pathSelectionScreen').show();
    $('#gameContainer').hide();
    $('#victoryScreen').hide();
}
function updateProgressSidebarPath() {
    $('#progressLinePath .progressCircle').each(function () {
        var stage = parseInt($(this).attr('data-stage') || '0');
        $(this).removeClass('completed current');
        $(this).find('.progressScore').remove();
        if (stage < currentStage) {
            $(this).addClass('completed');
            var score = stageScores[stage - 1];
            var par = stagePars[stage - 1];
            if (score !== null && par !== null) {
                $(this).append("<span class=\"progressScore\">".concat(score, "/").concat(par, "</span>"));
            }
        }
        else if (stage === currentStage) {
            $(this).addClass('current');
        }
    });
}
function selectPath(direction) {
    var selectedPath = direction === 'left' ? leftPath : rightPath;
    if (!selectedPath)
        return;
    // Set up the stage with the selected path's options
    currentKingdom = selectedPath.kingdom;
    currentVPModeName = selectedPath.vpModeName;
    currentBoon = selectedPath.boon;
    // Convert path rewards to add button states
    stageAddButtonStates = selectedPath.rewards.map(function (reward) { return ({
        kind: reward.kind,
        options: reward.options,
        used: false,
        selectedCard: null
    }); });
    // Hide path selection, show stage screen
    $('#pathSelectionScreen').hide();
    showStageScreen();
}
function showCardPicker(buttonIndex) {
    var e_25, _a;
    var state = stageAddButtonStates[buttonIndex];
    if (state.used)
        return;
    var titles = {
        'card': 'Choose a card:',
        'event': 'Choose an event:',
        'potion': 'Choose a potion:'
    };
    $('#cardPickerTitle').text(titles[state.kind]);
    $('#cardPickerOptions').empty();
    var _loop_4 = function (card) {
        var specHtml = renderSpecNoRelated(card);
        var optionEl = $(specHtml);
        optionEl.on('click', function () { return selectCard(buttonIndex, card); });
        $('#cardPickerOptions').append(optionEl);
    };
    try {
        for (var _b = __values(state.options), _c = _b.next(); !_c.done; _c = _b.next()) {
            var card = _c.value;
            _loop_4(card);
        }
    }
    catch (e_25_1) { e_25 = { error: e_25_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_25) throw e_25.error; }
    }
    $('#cardPickerCancel').off('click').on('click', hideCardPicker);
    $('#cardPickerDialog').attr('active', 'true');
}
function hideCardPicker() {
    $('#cardPickerDialog').attr('active', 'false');
}
function selectCard(buttonIndex, card) {
    var state = stageAddButtonStates[buttonIndex];
    state.used = true;
    state.selectedCard = card;
    if (state.kind === 'card') {
        collectedCards.push(card);
    }
    else if (state.kind === 'event') {
        collectedEvents.push(card);
    }
    else if (state.kind === 'potion') {
        currentPotions.push(card);
    }
    updateAddButtonDisplay(buttonIndex);
    hideCardPicker();
}
function updateAddButtonDisplay(buttonIndex) {
    // Simply regenerate all buttons to update the display
    setupAddButtons();
}
function setupAddButtons() {
    var _a;
    // Clear and regenerate reward buttons
    var container = $('#rewardButtons');
    container.empty();
    var buttonLabels = {
        'card': 'Add Card',
        'event': 'Add Event',
        'potion': 'Add Potion'
    };
    var _loop_5 = function (i) {
        var state = stageAddButtonStates[i];
        var row = $('<div class="gameRow"></div>');
        var button = $('<span class="option" choosable></span>');
        if (state.used) {
            button.text(((_a = state.selectedCard) === null || _a === void 0 ? void 0 : _a.name) || buttonLabels[state.kind]);
            button.attr('disabled', 'true');
            button.removeAttr('choosable');
        }
        else {
            button.text(buttonLabels[state.kind]);
        }
        var buttonIndex = i;
        button.on('click', function () {
            if (!stageAddButtonStates[buttonIndex].used)
                showCardPicker(buttonIndex);
        });
        row.append(button);
        container.append(row);
    };
    for (var i = 0; i < stageAddButtonStates.length; i++) {
        _loop_5(i);
    }
    // Debug button - adds all available cards and events to the deck
    var debugRow = $('<div class="gameRow"></div>');
    var debugButton = $('<span class="option" id="debugButton" choosable>Debug</span>');
    debugButton.on('click', function () {
        var e_26, _a, e_27, _b;
        var allCards = getAvailableCards().filter(function (c) {
            return !vpCardNames.has(c.name) &&
                c.name !== 'Copper' && c.name !== 'Silver' && c.name !== 'Gold';
        });
        var allEvents = getAvailableEvents().filter(function (e) {
            return !vpEventNames.has(e.name) && e.name !== 'Refresh';
        });
        var _loop_6 = function (card) {
            if (!collectedCards.some(function (cc) { return cc.name === card.name; })) {
                collectedCards.push(card);
            }
        };
        try {
            for (var allCards_1 = __values(allCards), allCards_1_1 = allCards_1.next(); !allCards_1_1.done; allCards_1_1 = allCards_1.next()) {
                var card = allCards_1_1.value;
                _loop_6(card);
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (allCards_1_1 && !allCards_1_1.done && (_a = allCards_1.return)) _a.call(allCards_1);
            }
            finally { if (e_26) throw e_26.error; }
        }
        var _loop_7 = function (event_1) {
            if (!collectedEvents.some(function (ce) { return ce.name === event_1.name; })) {
                collectedEvents.push(event_1);
            }
        };
        try {
            for (var allEvents_1 = __values(allEvents), allEvents_1_1 = allEvents_1.next(); !allEvents_1_1.done; allEvents_1_1 = allEvents_1.next()) {
                var event_1 = allEvents_1_1.value;
                _loop_7(event_1);
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (allEvents_1_1 && !allEvents_1_1.done && (_b = allEvents_1.return)) _b.call(allEvents_1);
            }
            finally { if (e_27) throw e_27.error; }
        }
        $(this).text('Added All');
        $(this).attr('disabled', 'true');
        $(this).removeAttr('choosable');
    });
    debugRow.append(debugButton);
    container.append(debugRow);
}
function updateProgressSidebar() {
    $('#progressLine .progressCircle').each(function () {
        var stage = parseInt($(this).attr('data-stage') || '0');
        $(this).removeClass('completed current');
        // Remove old score display
        $(this).find('.progressScore').remove();
        if (stage < currentStage) {
            $(this).addClass('completed');
            // Show score as X/Y where Y is par, red if over par
            var score = stageScores[stage - 1];
            var par = stagePars[stage - 1];
            if (score !== null && par !== null) {
                var scoreDisplay = "".concat(score, "/").concat(par);
                if (score > par) {
                    $(this).append("<span class=\"progressScore\" style=\"color: red\">".concat(scoreDisplay, "</span>"));
                }
                else {
                    $(this).append("<span class=\"progressScore\">".concat(scoreDisplay, "</span>"));
                }
            }
        }
        else if (stage === currentStage) {
            $(this).addClass('current');
        }
    });
}
function showDeckDialog() {
    var e_28, _a, e_29, _b;
    $('#deckContents').empty();
    if (collectedCards.length === 0 && collectedEvents.length === 0) {
        $('#deckContents').append('<div>No cards collected yet.</div>');
    }
    else {
        try {
            for (var collectedCards_1 = __values(collectedCards), collectedCards_1_1 = collectedCards_1.next(); !collectedCards_1_1.done; collectedCards_1_1 = collectedCards_1.next()) {
                var card = collectedCards_1_1.value;
                $('#deckContents').append(renderSpecNoRelated(card));
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (collectedCards_1_1 && !collectedCards_1_1.done && (_a = collectedCards_1.return)) _a.call(collectedCards_1);
            }
            finally { if (e_28) throw e_28.error; }
        }
        try {
            for (var collectedEvents_1 = __values(collectedEvents), collectedEvents_1_1 = collectedEvents_1.next(); !collectedEvents_1_1.done; collectedEvents_1_1 = collectedEvents_1.next()) {
                var event_2 = collectedEvents_1_1.value;
                $('#deckContents').append(renderSpecNoRelated(event_2));
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (collectedEvents_1_1 && !collectedEvents_1_1.done && (_b = collectedEvents_1.return)) _b.call(collectedEvents_1);
            }
            finally { if (e_29) throw e_29.error; }
        }
    }
    $('#deckClose').off('click').on('click', hideDeckDialog);
    $('#deckDialog').attr('active', 'true');
    deckDialogOpen = true;
}
function hideDeckDialog() {
    $('#deckDialog').attr('active', 'false');
    deckDialogOpen = false;
}
function toggleDeckDialog() {
    if (deckDialogOpen) {
        hideDeckDialog();
    }
    else {
        showDeckDialog();
    }
}
var deckIconSetup = false;
function setupDeckIcon() {
    if (deckIconSetup)
        return;
    deckIconSetup = true;
    var deckIcon = document.getElementById('deckIcon');
    if (deckIcon) {
        deckIcon.addEventListener('click', toggleDeckDialog);
    }
}
function updateBufferDisplay() {
    $('#bufferDisplay').text("Buffer: ".concat(currentBuffer));
}
export function showLandingPage() {
    // Initialize first stage
    currentStage = 1;
    collectedCards = [];
    collectedEvents = [];
    currentPotions = [];
    stageScores = Array(TOTAL_STAGES).fill(null);
    stagePars = Array(TOTAL_STAGES).fill(null);
    currentBuffer = 16;
    currentBoon = null;
    generateStageOptions();
    setupDeckIcon();
    updateBufferDisplay();
    showStageScreen();
}
function showStageScreen() {
    // Update stage title
    $('#stageTitle').text("Stage ".concat(currentStage));
    // Update buffer display
    updateBufferDisplay();
    // Update progress sidebar
    updateProgressSidebar();
    // Set up add buttons
    setupAddButtons();
    // Set up play kingdom button with VP mode and boon
    var playButtonText = "Play: ".concat(currentVPModeName);
    if (currentBoon) {
        playButtonText += " + ".concat(currentBoon.name);
    }
    $('#playKingdom').html(playButtonText);
    $('#playKingdom').off('click').on('click', startCurrentKingdom);
    // Set up back button
    $('#backButton').off('click').on('click', goBackToStage);
    // Show stage screen, hide others
    $('#stageScreen').show();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').hide();
    $('#victoryScreen').hide();
}
function startCurrentKingdom() {
    if (!currentKingdom)
        return;
    // Hide other screens, show game
    $('#stageScreen').hide();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').show();
    // Remove focus from button
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
    // Combine boon cards/events with collected cards/events
    // Boon cards/events come first (after VP mode), then player's collected cards
    var boonCardsList = (currentBoon === null || currentBoon === void 0 ? void 0 : currentBoon.cards) || [];
    var boonEventsList = (currentBoon === null || currentBoon === void 0 ? void 0 : currentBoon.events) || [];
    var sortedCards = __spreadArray(__spreadArray([], __read(boonCardsList), false), __read(__spreadArray([], __read(collectedCards), false).sort(supplyComp)), false);
    var sortedEvents = __spreadArray(__spreadArray([], __read(boonEventsList), false), __read(__spreadArray([], __read(collectedEvents), false).sort(eventComp)), false);
    var state = initialState(currentKingdom, sortedCards, sortedEvents, currentPotions);
    startGame(state);
}
function goBackToStage() {
    showStageScreen();
}
function advanceToNextStage() {
    currentStage++;
    if (currentStage > TOTAL_STAGES) {
        showFinalVictory();
    }
    else {
        // For stages 2+, show path selection
        generatePathOptions();
        showPathSelectionScreen();
    }
}
function showFinalVictory() {
    $('#stageScreen').hide();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').hide();
    $('#victoryScreen').show();
    $('#restartGame').off('click').on('click', function () {
        showLandingPage();
    });
}
// Called when player wins a kingdom
function onKingdomVictory(score, remainingPotions) {
    // Save the score and par for this stage
    var par = getCurrentPar();
    stageScores[currentStage - 1] = score;
    stagePars[currentStage - 1] = par;
    // Calculate buffer loss: lose buffer equal to (energy - par) if over par
    if (score > par) {
        currentBuffer -= (score - par);
    }
    updateBufferDisplay();
    // Carry forward remaining potions to next stage
    currentPotions = remainingPotions;
    advanceToNextStage();
}
//# sourceMappingURL=main.js.map