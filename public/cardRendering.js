// cardRendering.ts - Card and spec rendering utilities
// Shared between gameUI and metaUI for consistent card display.
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
import { renderCost } from './gameLogic.js';
// ----------------------------- Helper Functions
function isZero(c) {
    return c === undefined || renderCost(c) === '';
}
// ----------------------------- Text Rendering
function renderEffects(spec) {
    var e_1, _a;
    var parts = [];
    try {
        for (var _b = __values(spec.effects || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var effect = _c.value;
            parts.push.apply(parts, __spreadArray([], __read(effect.text), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return parts.map(function (x) { return "<div>".concat(x, "</div>"); }).join('');
}
function renderAbility(spec) {
    var e_2, _a;
    var parts = [];
    try {
        for (var _b = __values(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
            var effect = _c.value;
            parts.push.apply(parts, __spreadArray([], __read(effect.text.map(function (x) { return "<div>(ability) ".concat(x, "</div>"); })), false));
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return parts.join('');
}
function renderTrigger(x, staticTrigger) {
    var desc = staticTrigger ? '(static)' : '(effect)';
    return "<div>".concat(desc, " ").concat(x.text, "</div>");
}
function renderVariableCosts(cs) {
    return cs.map(function (c) { return "<div>(cost) +".concat(c.text, "</div>"); }).join('');
}
function renderBuyable(bs) {
    return bs.map(function (b) { return b.text === undefined ? '' : "<div>(req) ".concat(b.text, "</div>"); }).join('');
}
function renderRuleText(rule) {
    var e_3, _a, e_4, _b;
    var parts = [];
    try {
        for (var _c = __values((rule.triggers || [])), _d = _c.next(); !_d.done; _d = _c.next()) {
            var trigger = _d.value;
            parts.push("<div>(rule) ".concat(trigger.text, "</div>"));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_3) throw e_3.error; }
    }
    try {
        for (var _e = __values((rule.replacers || [])), _f = _e.next(); !_f.done; _f = _e.next()) {
            var replacer = _f.value;
            parts.push("<div>(rule) ".concat(replacer.text, "</div>"));
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return parts.join('');
}
// ----------------------------- Card Text (Full Detail)
export function cardText(spec) {
    var effectHtml = renderEffects(spec);
    var buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions) : '';
    var costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts) : '';
    var abilitiesHtml = renderAbility(spec);
    var triggerHtml = (spec.triggers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var replacerHtml = (spec.replacers || []).map(function (x) { return renderTrigger(x, false); }).join('');
    var staticTriggerHtml = (spec.staticTriggers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    var staticReplacerHtml = (spec.staticReplacers || []).map(function (x) { return renderTrigger(x, true); }).join('');
    var rulesHtml = (spec.rules || []).map(renderRuleText).join('');
    return [
        buyableHtml, costHtml, effectHtml, abilitiesHtml,
        triggerHtml, replacerHtml, staticTriggerHtml, staticReplacerHtml, rulesHtml
    ].join('');
}
// ----------------------------- Spec Rendering
// Build full HTML tooltip for a card spec (matching in-game tooltip style)
export function buildSpecTooltip(spec) {
    var buyStr = !isZero(spec.buyCost) ? "(".concat(renderCost(spec.buyCost), ")") : '---';
    var costStr = !isZero(spec.fixedCost) ? "(".concat(renderCost(spec.fixedCost), ")") : '---';
    var header = "<div>---".concat(buyStr, " ").concat(spec.name, " ").concat(costStr, "---</div>");
    var baseFilling = header + cardText(spec);
    // Related cards
    var relatedCards = spec.relatedCards || [];
    var relatedFilling = relatedCards.map(function (r) { return buildSpecTooltip(r); }).join('');
    return "".concat(baseFilling).concat(relatedFilling);
}
// Render a CardSpec with full details including related cards
export function renderSpec(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    var me = "<div class='spec'>".concat(header).concat(cardText(spec), "</div>");
    var related = (spec.relatedCards || []).map(renderSpec);
    return __spreadArray([me], __read(related), false).join('');
}
// Render a CardSpec without related cards inline, but with tooltip
// Uses simpleText if available for compact display
export function renderSpecNoRelated(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText, "</div>");
    // Use simpleText if available, otherwise full card text
    var displayText = spec.simpleText
        ? spec.simpleText.map(function (line) { return "<div>".concat(line, "</div>"); }).join('')
        : cardText(spec);
    // Build HTML tooltip matching in-game style
    var tooltipHtml = buildSpecTooltip(spec);
    return "<div class='spec'>".concat(header).concat(displayText, "<span class='tooltip'>").concat(tooltipHtml, "</span></div>");
}
// Render a simple card header (name + cost) without text
export function renderSpecHeader(spec) {
    var buyText = isZero(spec.buyCost) ? '' : "(".concat(renderCost(spec.buyCost), ")&nbsp;");
    var costText = isZero(spec.fixedCost) ? '' : "&nbsp;(".concat(renderCost(spec.fixedCost), ")");
    return "".concat(buyText, "<strong>").concat(spec.name, "</strong>").concat(costText);
}
// Render just the simple description (for tooltips in other contexts)
export function renderSpecSimple(spec) {
    if (spec.simpleText) {
        return spec.simpleText.join(' ');
    }
    return spec.name;
}
//# sourceMappingURL=cardRendering.js.map