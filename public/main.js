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
import { Shadow, State, Card } from './logic.js';
import { renderCost, renderEnergy } from './logic.js';
import { emptyState } from './logic.js';
import { logTypes } from './logic.js';
import { Undo, InvalidHistory } from './logic.js';
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
                pickable.add(option.render);
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
                if (hint != undefined && !result.has(option.render)) {
                    if (!takenByPickable(hint))
                        set(option.render, hint);
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
                if (!result.has(option.render)) {
                    var key = nextHotkey();
                    if (key != null)
                        set(option.render, key);
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
function renderCard(card, state, zone, options, tokenRenderer) {
    if (card instanceof Shadow) {
        return renderShadow(card, state, tokenRenderer);
    }
    else {
        var costType = (zone == 'events') ? 'use' : 'play';
        var tokenhtml = tokenRenderer.render(card.tokens);
        var costhtml = (zone == 'supply') ?
            renderCost(card.cost('buy', state)) || '&nbsp' :
            renderCost(card.cost(costType, state)) || '&nbsp';
        var picktext = (options.pick !== undefined) ? "<div class='pickorder'>" + options.pick + "</div>" : '';
        var choosetext = (options.option !== undefined) ? "choosable chosen='false' option=" + options.option : '';
        var hotkeytext = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : '';
        var ticktext = "tick=" + card.ticks[card.ticks.length - 1];
        return "<div class='card' " + ticktext + " " + choosetext + "> " + picktext + "\n                    <div class='cardbody'>" + hotkeytext + " " + card + tokenhtml + "</div>\n                    <div class='cardcost'>" + costhtml + "</div>\n                    <span class='tooltip'>" + renderTooltip(card, state, tokenRenderer) + "</span>\n                </div>";
    }
}
function renderTrigger(x, staticTrigger) {
    var desc = (staticTrigger) ? '(static)' : '(effect)';
    return "<div>" + desc + " " + x.text + "</div>";
}
function renderCalculatedCost(c) {
    return "<div>(cost) " + c.text + "</div>";
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
    var costHtml = (spec.calculatedCost != undefined) ? renderCalculatedCost(spec.calculatedCost) : '';
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
        "(" + renderCost(card.cost('play', emptyState)) + ")" : '---';
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
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: 'energy',
};
function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper();
    globalRendererState.tokenRenderer = new TokenRenderer();
}
function renderState(state, settings) {
    if (settings === void 0) { settings = {}; }
    window.renderedState = state;
    clearChoice();
    function render(zone) {
        return function (card) {
            var cardRenderOptions = {
                option: getIfDef(settings.optionsMap, card.id),
                hotkey: getIfDef(settings.hotkeyMap, card.id),
                pick: getIfDef(settings.pickMap, card.id),
            };
            return renderCard(card, state, zone, cardRenderOptions, globalRendererState.tokenRenderer);
        };
    }
    if (settings.updateURL === undefined || settings.updateURL) {
        globalRendererState.userURL = false;
        window.history.replaceState(null, "", "play?" + specToURL(state.spec) + "#" + state.serializeHistory(false));
    }
    $('#resolvingHeader').html('Resolving:');
    $('#energy').html(state.energy.toString());
    $('#actions').html(state.actions.toString());
    $('#buys').html(state.buys.toString());
    $('#coin').html(state.coin.toString());
    $('#points').html(state.points.toString());
    $('#aside').html(state.aside.map(render('aside')).join(''));
    $('#resolving').html(state.resolving.map(render('resolving')).join(''));
    $('#play').html(state.play.map(render('play')).join(''));
    $('#supply').html(state.supply.map(render('supply')).join(''));
    $('#events').html(state.events.map(render('events')).join(''));
    $('#hand').html(state.hand.map(render('hand')).join(''));
    $('#discard').html(state.discard.map(render('discard')).join(''));
    $('#playsize').html('' + state.play.length);
    $('#handsize').html('' + state.hand.length);
    $('#discardsize').html('' + state.discard.length);
    setVisibleLog(state, globalRendererState.logType);
    bindLogTypeButtons(state);
}
function bindLogTypeButtons(state) {
    var e = $("input[name='logType']");
    e.off('change');
    e.change(function () {
        var logType = this.value;
        globalRendererState.logType = logType;
        setVisibleLog(state, logType);
    });
}
function setVisibleLog(state, logType) {
    var e_10, _a;
    try {
        for (var logTypes_1 = __values(logTypes), logTypes_1_1 = logTypes_1.next(); !logTypes_1_1.done; logTypes_1_1 = logTypes_1.next()) {
            var logType_1 = logTypes_1_1.value;
            var e = $(".logOption[option=" + logType_1 + "]");
            var choosable = e.attr('option') != globalRendererState.logType;
            e.attr('choosable', choosable ? 'true' : null);
        }
    }
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (logTypes_1_1 && !logTypes_1_1.done && (_a = logTypes_1.return)) _a.call(logTypes_1);
        }
        finally { if (e_10) throw e_10.error; }
    }
    $('#log').html(renderLogLines(state.logs[logType]));
}
function renderLogLine(msg) {
    return "<div class=\"logLine\">" + msg + "</div>";
}
function renderLogLines(logs) {
    var result = [];
    for (var i = logs.length - 1; i >= 0; i--) {
        result.push(renderLogLine(logs[i]));
        /*
        if (i > 0 && result.length > 100) {
            result.push(renderLogLine('... (earlier events truncated)'))
            break
        }
        */
    }
    return result.join('');
}
// ------------------------------- Rendering choices
var webUI = /** @class */ (function () {
    function webUI() {
        this.undoing = false;
    }
    webUI.prototype.choice = function (state, choicePrompt, options, info) {
        var ui = this;
        var automate = this.automateChoice(state, options, info);
        if (automate !== null) {
            if (this.undoing)
                throw new Undo(state);
            else
                return Promise.resolve(automate);
        }
        this.undoing = false;
        return new Promise(function (resolve, reject) {
            function newReject(reason) {
                if (reason instanceof Undo)
                    ui.undoing = true;
                reject(reason);
            }
            function pick(i) {
                clearChoice();
                resolve(i);
            }
            function renderer() {
                renderChoice(state, choicePrompt, options.map(function (x, i) { return (__assign(__assign({}, x), { value: function () { return pick(i); } })); }), function (x) { return resolve(x[0]); }, newReject, renderer);
            }
            renderer();
        });
    };
    webUI.prototype.automateChoice = function (state, options, info) {
        if (info.indexOf('tutorial') != -1)
            return null;
        if (info.indexOf('actChoice') != -1)
            return null;
        if (options.length == 1)
            return 0;
        return null;
    };
    webUI.prototype.multichoice = function (state, choicePrompt, options, validator, info) {
        if (validator === void 0) { validator = (function (xs) { return true; }); }
        var ui = this;
        var automate = this.automateMultichoice(state, options, info);
        if (automate !== null) {
            if (this.undoing)
                throw new Undo(state);
            else
                return Promise.resolve(automate);
        }
        this.undoing = false;
        return new Promise(function (resolve, reject) {
            function newReject(reason) {
                if (reason instanceof Undo)
                    ui.undoing = true;
                reject(reason);
            }
            var chosen = new Set();
            function chosenOptions() {
                var e_11, _a;
                var result = [];
                try {
                    for (var chosen_1 = __values(chosen), chosen_1_1 = chosen_1.next(); !chosen_1_1.done; chosen_1_1 = chosen_1.next()) {
                        var i = chosen_1_1.value;
                        result.push(options[i].value);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (chosen_1_1 && !chosen_1_1.done && (_a = chosen_1.return)) _a.call(chosen_1);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
                return result;
            }
            function isReady() {
                return validator(chosenOptions());
            }
            var submitIndex = options.length;
            function setReady() {
                if (isReady()) {
                    $("[option='" + submitIndex + "']").attr('choosable', 'true');
                }
                else {
                    $("[option='" + submitIndex + "']").removeAttr('choosable');
                }
            }
            function elem(i) {
                return $("[option='" + i + "']");
            }
            function picks() {
                var e_12, _a;
                var result = new Map();
                var i = 0;
                try {
                    for (var chosen_2 = __values(chosen), chosen_2_1 = chosen_2.next(); !chosen_2_1.done; chosen_2_1 = chosen_2.next()) {
                        var k = chosen_2_1.value;
                        result.set(options[k].render, i++);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (chosen_2_1 && !chosen_2_1.done && (_a = chosen_2.return)) _a.call(chosen_2);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                return result;
            }
            function pick(i) {
                if (chosen.has(i)) {
                    chosen.delete(i);
                    elem(i).attr('chosen', false);
                }
                else {
                    chosen.add(i);
                    elem(i).attr('chosen', true);
                }
                renderer();
                setReady();
            }
            var newOptions = options.map(function (x, i) { return (__assign(__assign({}, x), { value: function () { return pick(i); } })); });
            var hint = { kind: 'key', val: ' ' };
            newOptions.push({ render: 'Done', hotkeyHint: hint, value: function () {
                    if (isReady()) {
                        resolve(Array.from(chosen.values()));
                    }
                } });
            chosen.clear();
            function renderer() {
                var e_13, _a;
                renderChoice(state, choicePrompt, newOptions, resolve, newReject, renderer, picks);
                try {
                    for (var chosen_3 = __values(chosen), chosen_3_1 = chosen_3.next(); !chosen_3_1.done; chosen_3_1 = chosen_3.next()) {
                        var j = chosen_3_1.value;
                        elem(j).attr('chosen', true);
                    }
                }
                catch (e_13_1) { e_13 = { error: e_13_1 }; }
                finally {
                    try {
                        if (chosen_3_1 && !chosen_3_1.done && (_a = chosen_3.return)) _a.call(chosen_3);
                    }
                    finally { if (e_13) throw e_13.error; }
                }
            }
            renderer();
        });
    };
    webUI.prototype.automateMultichoice = function (state, options, info) {
        if (options.length == 0)
            return [];
        return null;
    };
    //NOTE: we always undo after resolving the victory promise
    //(and we won't catch an undo here)
    //(would be nice to clean this up so you use undo to go back)
    webUI.prototype.victory = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var ui, submitOrUndo;
            return __generator(this, function (_a) {
                ui = this;
                submitOrUndo = function () {
                    return new Promise(function (resolve, reject) {
                        ui.undoing = true;
                        heartbeat(state.spec);
                        var submitDialog = function () {
                            keyListeners.clear();
                            renderScoreSubmission(state, function () { return submitOrUndo().then(resolve, reject); });
                        };
                        var options = (!submittable(state.spec)) ? [] : [{
                                render: 'Submit',
                                value: submitDialog,
                                hotkeyHint: { kind: 'key', val: '!' }
                            }];
                        renderChoice(state, "You won using " + state.energy + " energy!", options, resolve, resolve, function () { });
                    });
                };
                return [2 /*return*/, submitOrUndo()];
            });
        });
    };
    return webUI;
}());
function renderChoice(state, choicePrompt, options, resolve, reject, renderer, picks) {
    var optionsMap = new Map(); //map card ids to their position in the choice list
    var stringOptions = []; // values are indices into options
    for (var i = 0; i < options.length; i++) {
        var rendered = options[i].render;
        if (typeof rendered == 'string') {
            stringOptions.push({ render: rendered, value: i });
        }
        else if (typeof rendered === 'number') {
            optionsMap.set(rendered, i);
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
    if (picks != undefined) {
        pickMap = picks();
    }
    else {
        pickMap = new Map();
    }
    renderState(state, {
        hotkeyMap: hotkeyMap,
        optionsMap: optionsMap,
        pickMap: pickMap,
        updateURL: (!globalRendererState.userURL || state.hasHistory())
    });
    $('#choicePrompt').html(choicePrompt);
    $('#options').html(stringOptions.map(localRender).join(''));
    $('#undoArea').html(renderSpecials(state));
    bindSpecials(state, resolve, reject, renderer);
    function elem(i) {
        return $("[option='" + i + "']");
    }
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        var f = option.value;
        elem(i).on('click', f);
        var hotkey = hotkeyMap.get(option.render);
        if (hotkey != undefined)
            keyListeners.set(hotkey, f);
    }
    function localRender(option) {
        return renderStringOption(option, hotkeyMap.get(option.render), pickMap.get(option.render));
    }
}
function renderStringOption(option, hotkey, pick) {
    var hotkeyText = (hotkey !== undefined) ? renderHotkey(hotkey) : '';
    var picktext = (pick !== undefined) ? "<div class='pickorder'>" + pick + "</div>" : '';
    return "<span class='option' option='" + option.value + "' choosable chosen='false'>" + picktext + hotkeyText + option.render + "</span>";
}
function renderSpecials(state) {
    return [
        renderUndo(state.undoable()),
        renderRedo(state.redo.length > 0),
        renderHotkeyToggle(),
        renderKingdomViewer(),
        renderHelp(),
        renderRestart()
    ].join('');
}
function renderRestart() {
    return "<span id='deeplink' class='option', option='restart' choosable chosen='false'>Restart</span>";
}
function renderKingdomViewer() {
    return "<span id='viewKingdom' class='option', option='viewKingdom' choosable chosen='false'>Kingdom</span>";
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
function bindSpecials(state, accept, reject, renderer) {
    bindHotkeyToggle(renderer);
    bindUndo(state, reject);
    bindHelp(state, renderer);
    bindRestart(state);
    bindRedo(state, accept);
    bindViewKingdom(state);
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
function bindHotkeyToggle(renderer) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn;
        renderer();
    }
    keyListeners.set('/', pick);
    $("[option='hotkeyToggle']").on('click', pick);
}
function bindRestart(state) {
    $("[option='restart']").on('click', function () { return restart(state); });
}
function bindRedo(state, accept) {
    function pick() {
        if (state.redo.length > 0)
            accept(state.redo[state.redo.length - 1]);
    }
    keyListeners.set('Z', pick);
    $("[option='redo']").on('click', pick);
}
function bindUndo(state, reject) {
    function pick() {
        if (state.undoable())
            reject(new Undo(state));
    }
    keyListeners.set('z', pick);
    $("[option='undo']").on('click', pick);
}
function showLinkDialog(url) {
    $('#scoreSubmitter').attr('active', 'true');
    $('#scoreSubmitter').html("<label for=\"link\">Link:</label>" +
        "<textarea id=\"link\"></textarea>" +
        "<div>" +
        ("<span class=\"option\" choosable id=\"copyLink\">" + renderHotkey('⏎') + "Copy</span>") +
        ("<span class=\"option\" choosable id=\"cancel\">" + renderHotkey('Esc') + "Cancel</span>") +
        "</div>");
    $('#link').val(url);
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
    tutorialUI.prototype.choice = function (state, choicePrompt, options, info) {
        return __awaiter(this, void 0, void 0, function () {
            var stage, validIndex_1, result;
            var _this = this;
            return __generator(this, function (_a) {
                if (this.stage < this.stages.length) {
                    stage = this.stages[this.stage];
                    validIndex_1 = stage.nextAction;
                    if (validIndex_1 != undefined)
                        options = [options[validIndex_1]];
                    result = this.innerUI.choice(state, choicePrompt, options, info.concat(['tutorial'])).then(function (x) {
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
                    return [2 /*return*/, this.innerUI.choice(state, choicePrompt, options, info)];
                return [2 /*return*/];
            });
        });
    };
    tutorialUI.prototype.multichoice = function (state, choicePrompt, options, validator, info) {
        if (validator === void 0) { validator = (function (xs) { return true; }); }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.innerUI.multichoice(state, choicePrompt, options, validator, info.concat(['tutorial']))];
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
function bindHelp(state, renderer) {
    function attach(f) {
        $('#help').on('click', f);
        keyListeners.set('?', f);
    }
    function pick() {
        attach(renderer);
        var helpLines = [
            "Rules:",
            "The goal of the game is to get to " + VP_GOAL + " points (vp) using as little energy (@) as possible.",
            "To buy a card, pay its buy cost then create a copy of it in your discard pile.",
            "To play a card or use an event, pay its cost then follow its instructions.",
            "If an effect instructs you to play or buy a card, you don't have to pay a cost.",
            "The symbols below a card's name indicate its cost or buy cost.",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to pay it.",
            "When a cost is measured in coin ($) then you can only pay it if you have enough coin.",
            'After playing a card, discard it.',
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (effect) apply whenever the card is in play.",
            "Effects marked with (static) apply whenever the card is in the supply.",
            "&nbsp;",
            "Other help:",
            "Click the 'Kingdom' button to view the text of all cards at once.",
            "Press 'z' or click the 'Undo' button to undo the last move.",
            "Press '/' or click the 'Hotkeys' button to turn on hotkeys.",
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
//TODO: many of the URLs seem wrong
//TODO: play is not successfuly defaulting to a random seed
//TODO: make it so that you combine the daily seed
function dateString() {
    var date = new Date();
    return (String(date.getMonth() + 1)) + String(date.getDate()).padStart(2, '0') + date.getFullYear();
}
// ------------------------------ High score submission
function submittable(spec) {
    return true;
}
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; max-age=315360000; path=/";
}
function getCookie(name) {
    var e_14, _a;
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    try {
        for (var _b = __values(document.cookie.split(';')), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
    }
    catch (e_14_1) { e_14 = { error: e_14_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_14) throw e_14.error; }
    }
    return null;
}
function rememberUsername(username) {
    setCookie('username', username);
}
function getUsername() {
    return getCookie('username');
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
            console.log(url);
            var query = [
                "url=" + encodeURIComponent(url),
                "score=" + score,
                "username=" + username,
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
//TODO: live updates?
function heartbeat(spec, interval) {
    if (submittable(spec)) {
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
export function load(fixedURL) {
    if (fixedURL === void 0) { fixedURL = ''; }
    var url = (fixedURL.length == 0) ? window.location.search : fixedURL;
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
            alert(e);
        }
    });
}
function restart(state) {
    //TODO: detach the UI to avoid a race?
    //TODO: clear hearatbeat? (currently assumes spec is the same...)
    var spec = state.spec;
    state = initialState(spec);
    globalRendererState.userURL = false;
    window.history.pushState(null, "");
    playGame(state.attachUI(new webUI())).catch(function (e) {
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
    var e_15, _a;
    var count = 0;
    try {
        for (var s_1 = __values(s), s_1_1 = s_1.next(); !s_1_1.done; s_1_1 = s_1.next()) {
            var x = s_1_1.value;
            if (f(x))
                count += 1;
        }
    }
    catch (e_15_1) { e_15 = { error: e_15_1 }; }
    finally {
        try {
            if (s_1_1 && !s_1_1.done && (_a = s_1.return)) _a.call(s_1);
        }
        finally { if (e_15) throw e_15.error; }
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
    renderChoice(state, 'Choose which events and cards to use.', state.supply.map(function (card, i) { return ({
        render: card.id,
        value: function () { return pick(i); }
    }); }).concat(state.events.map(function (card, i) { return ({
        render: card.id,
        value: function () { return pick(cards.length + i); }
    }); })), trivial, trivial, trivial, undefined);
}
//# sourceMappingURL=main.js.map