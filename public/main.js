// TODO: make calculated costs render as "(cost) X"
// TODO: make the tooltip nice---should show up immediately, but be impossible to keep it alive by mousing over it
// TODO: I think the cost framework isn't really appropriate any more, but maybe think a bit before getting rid of it
// TODO: if a zone gets bigger and then smaller, it's annoying to keep resizing it. As soon as a zone gets big I want to leave it big probably.
// TODO: lay out the zones a bit more nicely
// TODO: starting to see performance hiccups in big games
// TODO: probably just want to stop things moving in/out of resolving, as if they didn't exist...
// TODO: it basically breaks the game if you move stuff from set aside or play without putting them there,
// I could probably enforce that through type system
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
import { Shadow, Card } from './logic.js';
import { renderCost, renderEnergy } from './logic.js';
import { emptyState } from './logic.js';
import { Undo } from './logic.js';
import { playGame, initialState } from './logic.js';
import { mixins } from './logic.js';
// ------------------ Rendering State
function assertNever(x) {
    throw new Error("Unexpected: " + x);
}
function describeCost(cost) {
    var coinCost = (cost.coin > 0) ? ["lose $" + cost.coin] : [];
    var energyCost = (cost.energy > 0) ? ["gain " + renderEnergy(cost.energy)] : [];
    var costs = coinCost.concat(energyCost);
    var costStr = (costs.length > 0) ? costs.join(' and ') : 'do nothing';
    return "Cost: " + costStr + ".";
}
function renderShadow(shadow, state) {
    var card = shadow.spec.card;
    var tokenhtml = card.tokens.length > 0 ? '*' : '';
    var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
    var costhtml = renderCost(card.cost(state)) || '&nbsp';
    var ticktext = "tick=" + shadow.tick;
    var shadowtext = "shadow='true'";
    var tooltip;
    switch (shadow.spec.kind) {
        case 'ability':
            tooltip = renderAbility(shadow.spec.ability);
            break;
        case 'trigger':
            tooltip = renderStatic(shadow.spec.trigger);
            break;
        case 'effect':
            tooltip = card.effect().text;
            break;
        case 'abilities':
            tooltip = card.abilities().map(renderAbility).join('');
            break;
        case 'cost':
            tooltip = describeCost(card.cost(state));
            break;
        default: assertNever(shadow.spec);
    }
    return ["<div class='card' " + ticktext + " " + shadowtext + ">",
        "<div class='cardbody'>" + card + tokenhtml + chargehtml + "</div>",
        "<div class='cardcost'>" + costhtml + "</div>",
        "<span class='tooltip'>" + tooltip + "</span>",
        "</div>"].join('');
}
function renderCard(card, state, options) {
    if (card instanceof Shadow) {
        return renderShadow(card, state);
    }
    else {
        var tokenhtml = card.tokens.length > 0 ? '*' : '';
        var chargehtml = card.charge > 0 ? "(" + card.charge + ")" : '';
        var costhtml = renderCost(card.cost(state)) || '&nbsp';
        var picktext = (options.pick !== undefined) ? "<div class='pickorder'>" + options.pick + "</div>" : '';
        var choosetext = (options.option !== undefined) ? "choosable chosen='false' option=" + options.option : '';
        var hotkeytext = (options.hotkey !== undefined) ? renderHotkey(options.hotkey) : '';
        var ticktext = "tick=" + card.ticks[card.ticks.length - 1];
        return ["<div class='card' " + ticktext + " " + choosetext + "> " + picktext,
            "<div class='cardbody'>" + hotkeytext + card + tokenhtml + chargehtml + "</div>",
            "<div class='cardcost'>" + costhtml + "</div>",
            "<span class='tooltip'>" + renderTooltip(card, state) + "</span>",
            "</div>"].join('');
    }
}
function renderStatic(x) {
    return "<div>(static) " + x.text + "</div>";
}
function renderAbility(x) {
    return "<div>(ability) " + x.text + "</div>";
}
function renderTokens(tokens) {
    var e_1, _a, e_2, _b;
    var counter = new Map();
    try {
        for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
            var token = tokens_1_1.value;
            counter.set(token, (counter.get(token) || 0) + 1);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var parts = [];
    try {
        for (var counter_1 = __values(counter), counter_1_1 = counter_1.next(); !counter_1_1.done; counter_1_1 = counter_1.next()) {
            var _c = __read(counter_1_1.value, 2), token = _c[0], count = _c[1];
            parts.push((count == 1) ? token : token + "(" + count + ")");
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (counter_1_1 && !counter_1_1.done && (_b = counter_1.return)) _b.call(counter_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return parts.join(', ');
}
function renderTooltip(card, state) {
    var effectHtml = "<div>" + card.effect().text + "</div>";
    var abilitiesHtml = card.abilities().map(function (x) { return renderAbility(x); }).join('');
    var triggerHtml = card.triggers().map(function (x) { return renderStatic(x); }).join('');
    var replacerHtml = card.replacers().map(function (x) { return renderStatic(x); }).join('');
    var staticHtml = triggerHtml + replacerHtml;
    var tokensHtml = card.tokens.length > 0 ? "Tokens: " + renderTokens(card.tokens) : '';
    var baseFilling = [effectHtml, abilitiesHtml, staticHtml, tokensHtml].join('');
    function renderRelated(spec) {
        var card = new Card(spec, -1);
        var costStr = renderCost(card.cost(emptyState));
        var header = (costStr.length > 0) ?
            "<div>---" + card.toString() + " (" + costStr + ")---</div>" :
            "<div>-----" + card.toString() + "----</div>";
        return header + renderTooltip(card, state);
    }
    var relatedFilling = card.relatedCards().map(renderRelated).join('');
    return "" + baseFilling + relatedFilling;
}
function render_log(msg) {
    return "<div class=\".log\">" + msg + "</div>";
}
function getIfDef(m, x) {
    return (m == undefined) ? undefined : m.get(x);
}
function renderState(state, settings) {
    if (settings === void 0) { settings = {}; }
    window.renderedState = state;
    clearChoice();
    function render(card) {
        var cardRenderOptions = {
            option: getIfDef(settings.optionsMap, card.id),
            hotkey: getIfDef(settings.hotkeyMap, card.id),
            pick: getIfDef(settings.pickMap, card.id),
        };
        return renderCard(card, state, cardRenderOptions);
    }
    $('#resolvingHeader').html('Resolving:');
    $('#energy').html(state.energy);
    $('#coin').html(state.coin);
    $('#points').html(state.points);
    $('#aside').html(state.aside.map(render).join(''));
    $('#resolving').html(state.resolving.map(render).join(''));
    $('#play').html(state.play.map(render).join(''));
    $('#supply').html(state.supply.map(render).join(''));
    $('#hand').html(state.hand.map(render).join(''));
    $('#deck').html(state.deck.map(render).join(''));
    $('#discard').html(state.discard.map(render).join(''));
    $('#log').html(state.logs.slice().reverse().map(render_log).join(''));
}
var keyListeners = new Map();
var handHotkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
    '!', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '{', '}', '[', ']']; // '@' is confusing
var lowerHotkeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
];
var upperHotkeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var numHotkeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].concat(lowerHotkeys);
var supplyAndPlayHotkeys = lowerHotkeys.concat(upperHotkeys);
// want to put zones that are least likely to change earlier, to not distrupt assignment
var hotkeys = supplyAndPlayHotkeys.concat(handHotkeys).concat([' ']);
var choiceHotkeys = handHotkeys.concat(supplyAndPlayHotkeys);
$(document).keydown(function (e) {
    var listener = keyListeners.get(e.key);
    if (listener != undefined) {
        e.preventDefault();
        listener();
    }
});
function renderHotkey(hotkey) {
    if (hotkey == ' ')
        hotkey = '&#x23B5;';
    return "<span class=\"hotkey\">" + hotkey + "</span> ";
}
function interpretHint(hint) {
    if (hint == undefined)
        return undefined;
    switch (hint.kind) {
        case "number":
            var n = hint.val;
            if (n < numHotkeys.length)
                return numHotkeys[n];
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
        var e_3, _a, e_4, _b, e_5, _c;
        var result = new Map();
        var taken = new Map();
        var pickable = new Set();
        try {
            for (var options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                var option = options_1_1.value;
                pickable.add(option.render);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
            }
            finally { if (e_3) throw e_3.error; }
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
            var e_6, _a;
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
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        //want to put zones that are most important not to change earlier
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
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (options_2_1 && !options_2_1.done && (_b = options_2.return)) _b.call(options_2);
            }
            finally { if (e_4) throw e_4.error; }
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
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (options_3_1 && !options_3_1.done && (_c = options_3.return)) _c.call(options_3);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    return HotkeyMapper;
}());
var globalRendererState = {
    hotkeysOn: false,
    hotkeyMapper: new HotkeyMapper()
};
// ------------------------------- Rendering choices
var webUI = {
    choice: function (state, choicePrompt, options) {
        return new Promise(function (resolve, reject) {
            function pick(i) {
                clearChoice();
                resolve(i);
            }
            function renderer() {
                renderChoice(state, choicePrompt, options.map(function (x, i) { return (__assign(__assign({}, x), { value: function () { return pick(i); } })); }), reject, renderer);
            }
            renderer();
        });
    },
    multichoice: function (state, choicePrompt, options, validator) {
        if (validator === void 0) { validator = (function (xs) { return true; }); }
        return new Promise(function (resolve, reject) {
            var chosen = new Set();
            function chosenOptions() {
                var e_7, _a;
                var result = [];
                try {
                    for (var chosen_1 = __values(chosen), chosen_1_1 = chosen_1.next(); !chosen_1_1.done; chosen_1_1 = chosen_1.next()) {
                        var i = chosen_1_1.value;
                        result.push(options[i].value);
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (chosen_1_1 && !chosen_1_1.done && (_a = chosen_1.return)) _a.call(chosen_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                return result;
            }
            function isReady() {
                return validator(chosenOptions());
            }
            var submitIndex = options.length;
            function setReady() {
                if (isReady()) {
                    $("[option='" + submitIndex + "']").attr('choosable', true);
                }
                else {
                    $("[option='" + submitIndex + "']").removeAttr('choosable');
                }
            }
            function elem(i) {
                return $("[option='" + i + "']");
            }
            function picks() {
                var e_8, _a;
                var result = new Map();
                var i = 0;
                try {
                    for (var chosen_2 = __values(chosen), chosen_2_1 = chosen_2.next(); !chosen_2_1.done; chosen_2_1 = chosen_2.next()) {
                        var k = chosen_2_1.value;
                        result.set(options[k].render, i++);
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (chosen_2_1 && !chosen_2_1.done && (_a = chosen_2.return)) _a.call(chosen_2);
                    }
                    finally { if (e_8) throw e_8.error; }
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
                var e_9, _a;
                renderChoice(state, choicePrompt, newOptions, reject, renderer, picks);
                try {
                    for (var chosen_3 = __values(chosen), chosen_3_1 = chosen_3.next(); !chosen_3_1.done; chosen_3_1 = chosen_3.next()) {
                        var j = chosen_3_1.value;
                        elem(j).attr('chosen', true);
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (chosen_3_1 && !chosen_3_1.done && (_a = chosen_3.return)) _a.call(chosen_3);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
            }
            renderer();
        });
    },
    victory: function (state) {
        return __awaiter(this, void 0, void 0, function () {
            var submitOrUndo;
            return __generator(this, function (_a) {
                submitOrUndo = function () {
                    return new Promise(function (resolve, reject) {
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
                        renderChoice(state, "You won using " + state.energy + " energy!", options, function () { return resolve(); }, function () { });
                    });
                };
                return [2 /*return*/, submitOrUndo()];
            });
        });
    }
};
function renderChoice(state, choicePrompt, options, reject, renderer, picks) {
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
    renderState(state, { hotkeyMap: hotkeyMap, optionsMap: optionsMap, pickMap: pickMap });
    $('#choicePrompt').html(choicePrompt);
    $('#options').html(stringOptions.map(localRender).join(''));
    $('#undoArea').html(renderSpecials(state.undoable()));
    bindSpecials(state, reject, renderer);
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
function renderSpecials(undoable) {
    return renderUndo(undoable) + renderHotkeyToggle() + renderHelp();
}
function renderHotkeyToggle() {
    return "<span class='option', option='hotkeyToggle' choosable chosen='false'>" + renderHotkey('/') + " Hotkeys</span>";
}
function renderHelp() {
    return "<span id='help' class='option', option='help' choosable chosen='false'>" + renderHotkey('?') + " Help</span>";
}
function renderUndo(undoable) {
    var hotkeyText = renderHotkey('z');
    return "<span class='option', option='undo' " + (undoable ? 'choosable' : '') + " chosen='false'>" + hotkeyText + "Undo</span>";
}
function bindSpecials(state, reject, renderer) {
    bindHotkeyToggle(renderer);
    bindUndo(state, reject);
    bindHelp(state, renderer);
}
function bindHotkeyToggle(renderer) {
    function pick() {
        globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn;
        renderer();
    }
    keyListeners.set('/', pick);
    $("[option='hotkeyToggle']").on('click', pick);
}
function bindUndo(state, reject) {
    function pick() {
        if (state.undoable())
            reject(new Undo(state));
    }
    keyListeners.set('z', pick);
    $("[option='undo']").on('click', pick);
}
function clearChoice() {
    keyListeners.clear();
    $('#choicePrompt').html('');
    $('#options').html('');
    $('#undoArea').html('');
}
// ------------------------------------------ Help
function bindHelp(state, renderer) {
    function attach(f) {
        $('#help').on('click', f);
        keyListeners.set('?', f);
    }
    function pick() {
        attach(renderer);
        var helpLines = [
            'The goal of the game is to get to 50 points (vp) using as little energy (@) as possible.',
            "When you play or buy a card, follow its instructions. After playing a card, discard it.",
            "You can pay a card's cost in order to buy it from the supply or play it from your hand.",
            "The symbols below a card's name indicate its cost.",
            "When a cost is measured in energy (@, @@, ...) then you use that much energy to play it.",
            "When a cost is measured in coin ($) then you can only buy it if you have enough coin.",
            "'Recycling' cards means to put them on the bottom of your deck (preserving their order).",
            "You can activate the abilities of cards in play, marked with (ability).",
            "Effects marked with (static) apply whenever the card is in play or in the supply.",
            "The game is played with a kingdom of 7 core cards and 12 randomized cards.",
            "You can play today's <a href='daily'>daily kingdom</a>, which refreshes midnight EDT.",
            "Or you can visit <a href=\"" + replayURL(state.spec) + "\">this link</a> to replay this kingdom anytime.",
            "Or visit the <a href=\"picker.html\">kingdom picker<a> to pick a kingdom.",
        ];
        if (submittable(state.spec))
            helpLines.push("Check out the scoreboard <a href=" + scoreboardURL(state.spec) + ">here</a>.");
        else
            helpLines.push("There is no scoreboard when you specify a kingdom manually.");
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
function dateSeedURL() {
    return "play?seed=" + dateString();
}
function replayURL(spec) {
    var args = ["seed=" + spec.seed];
    if (spec.kingdom != null)
        args.push("kingdom=" + spec.kingdom);
    return "play?" + args.join('&');
}
// ------------------------------ High score submission
//TODO: allow submitting custom kingdoms
function submittable(spec) {
    return (spec.kingdom == null) && (spec.testing != true);
}
function setCookie(name, value) {
    document.cookie = name + "=" + value + "; max-age=315360000; path=/";
}
function getCookie(name) {
    var e_10, _a;
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
    catch (e_10_1) { e_10 = { error: e_10_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_10) throw e_10.error; }
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
    var seed = state.spec.seed;
    $('#scoreSubmitter').attr('active', true);
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
        $('#scoreSubmitter').attr('active', false);
        done();
    }
    function submit() {
        var username = $('#username').val();
        if (username.length > 0) {
            rememberUsername(username);
            var query = [
                "seed=" + seed,
                "score=" + score,
                "username=" + username,
                "history=" + state.serializeHistory()
            ].join('&');
            $.post("submit?" + query).done(function (x) {
                heartbeat(state.spec);
                console.log(x);
            });
            exit();
        }
    }
    $('#username').on('keydown', function (e) {
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
    return "scoreboard?seed=" + spec.seed;
}
//TODO: live updates?
function heartbeat(spec) {
    if (spec.kingdom == null) {
        $.get("topScore?seed=" + spec.seed).done(function (x) {
            var n = parseInt(x, 10);
            if (!isNaN(n))
                renderBest(n, spec);
        });
    }
}
function renderBest(best, spec) {
    $('#best').html("Fastest win on this seed: " + best + " (<a href='" + scoreboardURL(spec) + "'>scoreboard</a>)");
}
// Creating the game spec and starting the game ------------------------------
function makeGameSpec() {
    return { seed: getSeed(), kingdom: getKingdom(), testing: isTesting() };
}
function isTesting() {
    return new URLSearchParams(window.location.search).get('test') != null;
}
function getKingdom() {
    return new URLSearchParams(window.location.search).get('kingdom');
}
function getSeed() {
    var seed = new URLSearchParams(window.location.search).get('seed');
    var urlSeed = (seed == null || seed.length == 0) ? [] : [seed];
    var windowSeed = (window.serverSeed == undefined || window.serverSeed.length == 0) ? [] : [window.serverSeed];
    var seeds = windowSeed.concat(urlSeed);
    return (seeds.length == 0) ? Math.random().toString(36).substring(2, 7) : seeds.join('.');
}
export function load() {
    var spec = makeGameSpec();
    heartbeat(spec);
    setInterval(function () { return heartbeat(spec); }, 30000);
    playGame(initialState(spec).attachUI(webUI));
}
// ----------------------------------- Kingdom picker
//
function kingdomURL(specs) {
    return "play?kingdom=" + specs.map(function (card) { return card.name; }).join(',');
}
//TODO: refactor the logic into logic.ts, probably just state initialization
export function loadPicker() {
    var state = emptyState;
    var specs = mixins.slice();
    specs.sort(function (spec1, spec2) { return spec1.name.localeCompare(spec2.name); });
    for (var i = 0; i < specs.length; i++) {
        var spec = specs[i];
        state = state.addToZone(new Card(spec, i), 'supply');
    }
    function trivial() { }
    function elem(i) {
        return $("[option='" + i + "']");
    }
    function prefix(s) {
        var parts = s.split('/');
        return parts.slice(0, parts.length - 1).join('/');
    }
    function kingdomLink() {
        return kingdomURL(Array.from(chosen.values()).map(function (i) { return specs[i]; }));
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
        $('#count').html(String(chosen.size));
        if (chosen.size > 0) {
            $('#kingdomLink').attr('href', kingdomLink());
        }
        else {
            $('#kingdomLink').removeAttr('href');
        }
    }
    renderChoice(state, 'Choose which cards to include in the supply.', state.supply.map(function (card, i) { return ({
        render: card.id,
        value: function () { return pick(i); }
    }); }), trivial, trivial);
}
//# sourceMappingURL=main.js.map