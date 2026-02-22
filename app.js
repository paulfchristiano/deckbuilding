"use strict";
(() => {
  // public/gameLogic.js
  var __extends = /* @__PURE__ */ (function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var __assign = function() {
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
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function isBurdened(spec) {
    var e_1, _a;
    if (spec.burden === true)
      return true;
    if (spec.upgrades) {
      try {
        for (var _b = __values(spec.upgrades), _c = _b.next(); !_c.done; _c = _b.next()) {
          var upgrade = _c.value;
          if (upgrade.burden === true)
            return true;
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
    return false;
  }
  function appendUpgrades(base, upgrades, getter) {
    var e_2, _a;
    var result = base ? __spreadArray([], __read(base), false) : [];
    if (!upgrades)
      return result;
    try {
      for (var upgrades_1 = __values(upgrades), upgrades_1_1 = upgrades_1.next(); !upgrades_1_1.done; upgrades_1_1 = upgrades_1.next()) {
        var upgrade = upgrades_1_1.value;
        var extra = getter(upgrade);
        if (extra)
          result.push.apply(result, __spreadArray([], __read(extra), false));
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (upgrades_1_1 && !upgrades_1_1.done && (_a = upgrades_1.return)) _a.call(upgrades_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    return result;
  }
  function displayName(spec) {
    var e_3, _a;
    var name = spec.name;
    try {
      for (var _b = __values(spec.upgrades || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var upgrade = _c.value;
        if (upgrade.name) {
          name = upgrade.name(name);
        }
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    return name;
  }
  function cardSpecEffects(spec) {
    return appendUpgrades(spec.effects, spec.upgrades, function(upgrade) {
      return upgrade.effects;
    });
  }
  function cardSpecRules(spec) {
    return appendUpgrades(spec.rules, spec.upgrades, function(upgrade) {
      return upgrade.rules;
    });
  }
  function cardSpecSimpleLines(spec) {
    var e_4, _a, e_5, _b, e_6, _c, e_7, _d, e_8, _e, e_9, _f, e_10, _g, e_11, _h, e_12, _j, e_13, _k, e_14, _l, e_15, _m;
    var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var lines = [];
    if (spec.simpleText !== void 0) {
      lines.push.apply(lines, __spreadArray([], __read(spec.simpleText), false));
    }
    try {
      for (var _y = __values(spec.restrictions || []), _z = _y.next(); !_z.done; _z = _y.next()) {
        var restriction = _z.value;
        var restrictionLines = restriction.simpleText !== void 0 ? restriction.simpleText : restriction.text;
        if (restrictionLines !== void 0)
          lines.push.apply(lines, __spreadArray([], __read(restrictionLines), false));
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (_z && !_z.done && (_a = _y.return)) _a.call(_y);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    try {
      for (var _0 = __values(cardSpecEffects(spec)), _1 = _0.next(); !_1.done; _1 = _0.next()) {
        var effect = _1.value;
        lines.push.apply(lines, __spreadArray([], __read((_o = effect.simpleText) !== null && _o !== void 0 ? _o : effect.text), false));
      }
    } catch (e_5_1) {
      e_5 = { error: e_5_1 };
    } finally {
      try {
        if (_1 && !_1.done && (_b = _0.return)) _b.call(_0);
      } finally {
        if (e_5) throw e_5.error;
      }
    }
    try {
      for (var _2 = __values(spec.ability || []), _3 = _2.next(); !_3.done; _3 = _2.next()) {
        var abilityEffect = _3.value;
        lines.push.apply(lines, __spreadArray([], __read((_p = abilityEffect.simpleText) !== null && _p !== void 0 ? _p : abilityEffect.text), false));
      }
    } catch (e_6_1) {
      e_6 = { error: e_6_1 };
    } finally {
      try {
        if (_3 && !_3.done && (_c = _2.return)) _c.call(_2);
      } finally {
        if (e_6) throw e_6.error;
      }
    }
    try {
      for (var _4 = __values(cardSpecTriggers(spec)), _5 = _4.next(); !_5.done; _5 = _4.next()) {
        var trigger_1 = _5.value;
        lines.push.apply(lines, __spreadArray([], __read((_q = trigger_1.simpleText) !== null && _q !== void 0 ? _q : trigger_1.text), false));
      }
    } catch (e_7_1) {
      e_7 = { error: e_7_1 };
    } finally {
      try {
        if (_5 && !_5.done && (_d = _4.return)) _d.call(_4);
      } finally {
        if (e_7) throw e_7.error;
      }
    }
    try {
      for (var _6 = __values(cardSpecReplacers(spec)), _7 = _6.next(); !_7.done; _7 = _6.next()) {
        var replacer = _7.value;
        lines.push.apply(lines, __spreadArray([], __read((_r = replacer.simpleText) !== null && _r !== void 0 ? _r : replacer.text), false));
      }
    } catch (e_8_1) {
      e_8 = { error: e_8_1 };
    } finally {
      try {
        if (_7 && !_7.done && (_e = _6.return)) _e.call(_6);
      } finally {
        if (e_8) throw e_8.error;
      }
    }
    try {
      for (var _8 = __values(cardSpecStaticTriggers(spec)), _9 = _8.next(); !_9.done; _9 = _8.next()) {
        var trigger_2 = _9.value;
        lines.push.apply(lines, __spreadArray([], __read((_s = trigger_2.simpleText) !== null && _s !== void 0 ? _s : trigger_2.text), false));
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (_9 && !_9.done && (_f = _8.return)) _f.call(_8);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    try {
      for (var _10 = __values(cardSpecStaticReplacers(spec)), _11 = _10.next(); !_11.done; _11 = _10.next()) {
        var replacer = _11.value;
        lines.push.apply(lines, __spreadArray([], __read((_t = replacer.simpleText) !== null && _t !== void 0 ? _t : replacer.text), false));
      }
    } catch (e_10_1) {
      e_10 = { error: e_10_1 };
    } finally {
      try {
        if (_11 && !_11.done && (_g = _10.return)) _g.call(_10);
      } finally {
        if (e_10) throw e_10.error;
      }
    }
    try {
      for (var _12 = __values(cardSpecRules(spec)), _13 = _12.next(); !_13.done; _13 = _12.next()) {
        var rule = _13.value;
        try {
          for (var _14 = (e_12 = void 0, __values(rule.triggers || [])), _15 = _14.next(); !_15.done; _15 = _14.next()) {
            var trigger_3 = _15.value;
            lines.push.apply(lines, __spreadArray([], __read((_u = trigger_3.simpleText) !== null && _u !== void 0 ? _u : trigger_3.text), false));
          }
        } catch (e_12_1) {
          e_12 = { error: e_12_1 };
        } finally {
          try {
            if (_15 && !_15.done && (_j = _14.return)) _j.call(_14);
          } finally {
            if (e_12) throw e_12.error;
          }
        }
        try {
          for (var _16 = (e_13 = void 0, __values(rule.replacers || [])), _17 = _16.next(); !_17.done; _17 = _16.next()) {
            var replacer = _17.value;
            lines.push.apply(lines, __spreadArray([], __read((_v = replacer.simpleText) !== null && _v !== void 0 ? _v : replacer.text), false));
          }
        } catch (e_13_1) {
          e_13 = { error: e_13_1 };
        } finally {
          try {
            if (_17 && !_17.done && (_k = _16.return)) _k.call(_16);
          } finally {
            if (e_13) throw e_13.error;
          }
        }
      }
    } catch (e_11_1) {
      e_11 = { error: e_11_1 };
    } finally {
      try {
        if (_13 && !_13.done && (_h = _12.return)) _h.call(_12);
      } finally {
        if (e_11) throw e_11.error;
      }
    }
    try {
      for (var _18 = __values(spec.metaReplacers || []), _19 = _18.next(); !_19.done; _19 = _18.next()) {
        var metaReplacer = _19.value;
        lines.push.apply(lines, __spreadArray([], __read((_w = metaReplacer.simpleText) !== null && _w !== void 0 ? _w : metaReplacer.text), false));
      }
    } catch (e_14_1) {
      e_14 = { error: e_14_1 };
    } finally {
      try {
        if (_19 && !_19.done && (_l = _18.return)) _l.call(_18);
      } finally {
        if (e_14) throw e_14.error;
      }
    }
    try {
      for (var _20 = __values(spec.metaTriggers || []), _21 = _20.next(); !_21.done; _21 = _20.next()) {
        var metaTrigger = _21.value;
        lines.push.apply(lines, __spreadArray([], __read((_x = metaTrigger.simpleText) !== null && _x !== void 0 ? _x : metaTrigger.text), false));
      }
    } catch (e_15_1) {
      e_15 = { error: e_15_1 };
    } finally {
      try {
        if (_21 && !_21.done && (_m = _20.return)) _m.call(_20);
      } finally {
        if (e_15) throw e_15.error;
      }
    }
    return lines;
  }
  function cardSpecTriggers(spec) {
    return appendUpgrades(spec.triggers, spec.upgrades, function(upgrade) {
      return upgrade.triggers;
    });
  }
  function cardSpecStaticTriggers(spec) {
    return appendUpgrades(spec.staticTriggers, spec.upgrades, function(upgrade) {
      return upgrade.staticTriggers;
    });
  }
  function cardSpecReplacers(spec) {
    return appendUpgrades(spec.replacers, spec.upgrades, function(upgrade) {
      return upgrade.replacers;
    });
  }
  function cardSpecStaticReplacers(spec) {
    return appendUpgrades(spec.staticReplacers, spec.upgrades, function(upgrade) {
      return upgrade.staticReplacers;
    });
  }
  function applyCardUpgradeCost(spec, cost, kind) {
    var e_16, _a;
    var result = cost;
    try {
      for (var _b = __values(spec.upgrades || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var upgrade = _c.value;
        if (upgrade.cost) {
          result = upgrade.cost(result, kind);
        }
      }
    } catch (e_16_1) {
      e_16 = { error: e_16_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_16) throw e_16.error;
      }
    }
    return result;
  }
  function cardSpecCost(spec, kind) {
    var base = kind === "buy" ? spec.buyCost : spec.fixedCost;
    if (!base)
      return void 0;
    return applyCardUpgradeCost(spec, base, kind);
  }
  var rules = [];
  function registerRule(rule) {
    rules.push(rule);
  }
  var free = { coin: 0, energy: 0, actions: 0, buys: 0, effects: [], tests: [] };
  function sourceHasName(s, name) {
    if (s == "act" || s == null)
      return false;
    return s.name == name;
  }
  function renderCardName(card) {
    return displayName(card.spec);
  }
  var Card = (
    /** @class */
    (function() {
      function Card2(spec, id, ticks, tokens, place) {
        if (ticks === void 0) {
          ticks = [0];
        }
        if (tokens === void 0) {
          tokens = /* @__PURE__ */ new Map();
        }
        if (place === void 0) {
          place = "void";
        }
        this.spec = spec;
        this.id = id;
        this.ticks = ticks;
        this.tokens = tokens;
        this.place = place;
        this.kind = "card";
        this.charge = this.count("charge");
      }
      Object.defineProperty(Card2.prototype, "name", {
        get: function() {
          return this.spec.name;
        },
        enumerable: false,
        configurable: true
      });
      Card2.prototype.toString = function() {
        return renderCardName(this);
      };
      Card2.prototype.update = function(newValues) {
        return new Card2(this.spec, this.id, newValues.ticks === void 0 ? this.ticks : newValues.ticks, newValues.tokens === void 0 ? this.tokens : newValues.tokens, newValues.place === void 0 ? this.place : newValues.place);
      };
      Card2.prototype.setTokens = function(token, n) {
        var tokens = new Map(this.tokens);
        tokens.set(token, n);
        return this.update({ tokens });
      };
      Card2.prototype.addTokens = function(token, n) {
        return this.setTokens(token, this.count(token) + n);
      };
      Card2.prototype.count = function(token) {
        return this.tokens.get(token) || 0;
      };
      Card2.prototype.startTicker = function() {
        return this.update({ ticks: this.ticks.concat([1]) });
      };
      Card2.prototype.endTicker = function() {
        return this.update({ ticks: this.ticks.slice(0, this.ticks.length - 1) });
      };
      Card2.prototype.tick = function() {
        var n = this.ticks.length;
        var t = this.ticks[n - 1];
        return this.update({ ticks: this.ticks.slice(0, n - 1).concat([t + 1]) });
      };
      Card2.prototype.baseCost = function(state, kind) {
        var e_17, _a;
        switch (kind) {
          case "play":
          case "use":
            var result = this.spec.fixedCost || free;
            if (this.spec.variableCosts != void 0) {
              try {
                for (var _b = __values(this.spec.variableCosts), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var vc = _c.value;
                  result = addCosts(result, vc.calculate(this, state));
                }
              } catch (e_17_1) {
                e_17 = { error: e_17_1 };
              } finally {
                try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                } finally {
                  if (e_17) throw e_17.error;
                }
              }
            }
            if (kind == "play")
              result = addCosts(result, { actions: 1 });
            return applyCardUpgradeCost(this.spec, result, kind);
          case "buy": {
            var result_1 = addCosts(this.spec.buyCost || free, { buys: 1 });
            return applyCardUpgradeCost(this.spec, result_1, kind);
          }
          case "activate":
            return free;
          case "potion":
            return free;
          default:
            return assertNever(kind);
        }
      };
      Card2.prototype.cost = function(kind, state) {
        var card = this;
        var initialCost = {
          kind: "costIncrease",
          actionKind: kind,
          card,
          cost: card.baseCost(state, kind)
        };
        var increasedCost = replace(initialCost, state);
        var newCost = replace(__assign(__assign({}, increasedCost), { kind: "cost" }), state);
        return newCost.cost;
      };
      Card2.prototype.payCost = function(kind) {
        var card = this;
        return function(state) {
          return __awaiter(this, void 0, void 0, function() {
            var cost;
            return __generator(this, function(_a) {
              state = state.log("Paying for ".concat(renderCardName(card)));
              cost = card.cost(kind, state);
              return [2, withTracking(payCost(cost, card), { kind: "cost", card, cost })(state)];
            });
          });
        };
      };
      Card2.prototype.play = function(source) {
        return this.activate("play", source);
      };
      Card2.prototype.buy = function(source) {
        return this.activate("buy", source);
      };
      Card2.prototype.use = function(source) {
        return this.activate("use", source);
      };
      Card2.prototype.activate = function(kind, source) {
        var card = this;
        return function(state) {
          return __awaiter(this, void 0, void 0, function() {
            var before, trackingSpec, gameEvent, _a, _b;
            return __generator(this, function(_c) {
              switch (_c.label) {
                case 0:
                  card = state.find(card);
                  state = logAct(state, kind, card);
                  before = state;
                  _a = kind;
                  switch (_a) {
                    case "play":
                      return [3, 1];
                    case "potion":
                      return [3, 3];
                    case "buy":
                      return [3, 5];
                    case "use":
                      return [3, 6];
                    case "activate":
                      return [3, 7];
                  }
                  return [3, 8];
                case 1:
                  trackingSpec = { kind: "none", card };
                  gameEvent = { kind: "play", card, source };
                  state = state.log("Playing ".concat(renderCardName(card)));
                  state = state.indent();
                  return [4, move(card, "resolving")(state)];
                case 2:
                  state = _c.sent();
                  state = state.unindent();
                  return [3, 9];
                case 3:
                  trackingSpec = { kind: "none", card };
                  gameEvent = { kind: "play", card, source };
                  state = state.log("Drinking ".concat(renderCardName(card)));
                  state = state.indent();
                  return [4, move(card, "resolving")(state)];
                case 4:
                  state = _c.sent();
                  state = state.unindent();
                  return [3, 9];
                case 5:
                  trackingSpec = { kind: "buying", card };
                  gameEvent = { kind: "buy", card, source };
                  state = state.log("Buying ".concat(renderCardName(card)));
                  return [3, 9];
                case 6:
                  trackingSpec = { kind: "effect", card };
                  gameEvent = { kind: "use", card, source };
                  state = state.log("Using ".concat(renderCardName(card)));
                  return [3, 9];
                case 7:
                  trackingSpec = { kind: "ability", card };
                  gameEvent = { kind: "activate", card, source };
                  state = state.log("Activating ".concat(renderCardName(card)));
                  return [3, 9];
                case 8:
                  return [2, assertNever(kind)];
                case 9:
                  return [4, withTracking(function(state2) {
                    return __awaiter(this, void 0, void 0, function() {
                      var _a2, _b2, _c2, effect, e_18_1, _d, _e, effect, e_19_1;
                      var e_18, _f, e_19, _g;
                      return __generator(this, function(_h) {
                        switch (_h.label) {
                          case 0:
                            return [4, trigger(gameEvent)(state2)];
                          case 1:
                            state2 = _h.sent();
                            _a2 = kind;
                            switch (_a2) {
                              case "use":
                                return [3, 2];
                              case "play":
                                return [3, 2];
                              case "potion":
                                return [3, 2];
                              case "activate":
                                return [3, 10];
                              case "buy":
                                return [3, 18];
                            }
                            return [3, 20];
                          case 2:
                            _h.trys.push([2, 7, 8, 9]);
                            _b2 = __values(card.effects()), _c2 = _b2.next();
                            _h.label = 3;
                          case 3:
                            if (!!_c2.done) return [3, 6];
                            effect = _c2.value;
                            card = state2.find(card);
                            return [4, effect.transform(state2, card)(state2)];
                          case 4:
                            state2 = _h.sent();
                            _h.label = 5;
                          case 5:
                            _c2 = _b2.next();
                            return [3, 3];
                          case 6:
                            return [3, 9];
                          case 7:
                            e_18_1 = _h.sent();
                            e_18 = { error: e_18_1 };
                            return [3, 9];
                          case 8:
                            try {
                              if (_c2 && !_c2.done && (_f = _b2.return)) _f.call(_b2);
                            } finally {
                              if (e_18) throw e_18.error;
                            }
                            return [
                              7
                              /*endfinally*/
                            ];
                          case 9:
                            return [2, state2];
                          case 10:
                            _h.trys.push([10, 15, 16, 17]);
                            _d = __values(card.abilityEffects()), _e = _d.next();
                            _h.label = 11;
                          case 11:
                            if (!!_e.done) return [3, 14];
                            effect = _e.value;
                            card = state2.find(card);
                            return [4, effect.transform(state2, card)(state2)];
                          case 12:
                            state2 = _h.sent();
                            _h.label = 13;
                          case 13:
                            _e = _d.next();
                            return [3, 11];
                          case 14:
                            return [3, 17];
                          case 15:
                            e_19_1 = _h.sent();
                            e_19 = { error: e_19_1 };
                            return [3, 17];
                          case 16:
                            try {
                              if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                            } finally {
                              if (e_19) throw e_19.error;
                            }
                            return [
                              7
                              /*endfinally*/
                            ];
                          case 17:
                            return [2, state2];
                          case 18:
                            return [4, create(card.spec, "discard")(state2)];
                          case 19:
                            state2 = _h.sent();
                            return [2, state2];
                          case 20:
                            return [2, assertNever(kind)];
                        }
                      });
                    });
                  }, trackingSpec)(state)];
                case 10:
                  state = _c.sent();
                  card = state.find(card);
                  _b = kind;
                  switch (_b) {
                    case "play":
                      return [3, 11];
                    case "potion":
                      return [3, 15];
                    case "use":
                      return [3, 20];
                    case "buy":
                      return [3, 22];
                    case "activate":
                      return [3, 24];
                  }
                  return [3, 25];
                case 11:
                  if (!(card.place == "resolving")) return [3, 13];
                  state = state.indent();
                  return [4, move(card, card.afterPlayDestination())(state)];
                case 12:
                  state = _c.sent();
                  state = state.unindent();
                  _c.label = 13;
                case 13:
                  return [4, trigger({
                    kind: "afterPlay",
                    card,
                    source,
                    before
                  })(state)];
                case 14:
                  state = _c.sent();
                  return [2, state];
                case 15:
                  if (!(card.place == "resolving")) return [3, 17];
                  state = state.indent();
                  return [4, move(card, "void")(state)];
                case 16:
                  state = _c.sent();
                  state = state.unindent();
                  _c.label = 17;
                case 17:
                  return [4, trigger({
                    kind: "afterPlay",
                    card,
                    source,
                    before
                  })(state)];
                case 18:
                  state = _c.sent();
                  return [4, trigger({
                    kind: "afterUse",
                    card,
                    source,
                    before
                  })(state)];
                case 19:
                  state = _c.sent();
                  return [2, state];
                case 20:
                  return [4, trigger({
                    kind: "afterUse",
                    card,
                    source,
                    before
                  })(state)];
                case 21:
                  state = _c.sent();
                  return [2, state];
                case 22:
                  return [4, trigger({
                    kind: "afterBuy",
                    card,
                    source,
                    before
                  })(state)];
                case 23:
                  state = _c.sent();
                  return [2, state];
                case 24:
                  return [2, state];
                case 25:
                  return [2, assertNever(kind)];
              }
            });
          });
        };
      };
      Card2.prototype.afterPlayDestination = function() {
        return this.replacers().length > 0 || this.triggers().length > 0 || this.abilityEffects().length > 0 ? "play" : "discard";
      };
      Card2.prototype.abilityEffects = function() {
        return this.spec.ability || [];
      };
      Card2.prototype.effects = function() {
        return cardSpecEffects(this.spec);
      };
      Card2.prototype.triggers = function() {
        return cardSpecTriggers(this.spec);
      };
      Card2.prototype.staticTriggers = function() {
        return cardSpecStaticTriggers(this.spec);
      };
      Card2.prototype.replacers = function() {
        return cardSpecReplacers(this.spec);
      };
      Card2.prototype.staticReplacers = function() {
        return cardSpecStaticReplacers(this.spec);
      };
      Card2.prototype.relatedCards = function() {
        return this.spec.relatedCards || [];
      };
      Card2.prototype.restrictions = function() {
        return this.spec.restrictions || [];
      };
      Card2.prototype.affordable = function(kind, state) {
        return this.available(kind, state) && canPay(this.cost(kind, state), state);
      };
      Card2.prototype.available = function(kind, state) {
        var e_20, _a;
        if (kind == "activate" && this.spec.ability === void 0)
          return false;
        if (kind == "buy" && !canCreate(this.spec, state))
          return false;
        try {
          for (var _b = __values(this.restrictions()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var restriction = _c.value;
            if (restriction.test(this, state, kind))
              return false;
          }
        } catch (e_20_1) {
          e_20 = { error: e_20_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_20) throw e_20.error;
          }
        }
        return true;
      };
      return Card2;
    })()
  );
  function addCosts(a2, b) {
    return {
      coin: a2.coin + (b.coin || 0),
      energy: a2.energy + (b.energy || 0),
      actions: a2.actions + (b.actions || 0),
      buys: a2.buys + (b.buys || 0),
      effects: a2.effects.concat(b.effects || []),
      tests: a2.tests.concat(b.tests || [])
    };
  }
  function multiplyCosts(c, n) {
    var e_21, _a;
    var result = {};
    try {
      for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
        var resource = allCostResources_1_1.value;
        var r = c[resource];
        if (r != void 0)
          result[resource] = n * r;
      }
    } catch (e_21_1) {
      e_21 = { error: e_21_1 };
    } finally {
      try {
        if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
      } finally {
        if (e_21) throw e_21.error;
      }
    }
    if (c.effects != void 0) {
      result.effects = [];
      for (var i = 0; i < n; i++) {
        result.effects = result.effects.concat(c.effects);
      }
    }
    return result;
  }
  function subtractCost(c, reduction) {
    return {
      coin: Math.max(0, c.coin - (reduction.coin || 0)),
      energy: Math.max(0, c.energy - (reduction.energy || 0)),
      actions: Math.max(0, c.actions - (reduction.actions || 0)),
      buys: Math.max(0, c.buys - (reduction.buys || 0)),
      effects: c.effects,
      tests: c.tests
    };
  }
  function eq(a2, b) {
    return a2.coin == b.coin && a2.energy == b.energy && a2.actions == b.actions;
  }
  function leq(cost1, cost2) {
    return cost1.coin <= cost2.coin && cost1.energy <= cost2.energy;
  }
  function insertAt(zone, card) {
    return zone.concat([card]);
  }
  var allCostResources = ["coin", "energy", "actions", "buys"];
  var allResources = allCostResources.concat(["points"]);
  function get(stateUpdate, k, state) {
    return stateUpdate[k] === void 0 ? state[k] : stateUpdate[k];
  }
  var logTypes = ["all", "energy", "acts", "costs"];
  var emptyLog = { "all": [], "energy": [], "acts": [], "costs": [] };
  var State = (
    /** @class */
    (function() {
      function State2(spec, ui, resources, zones, resolving, nextID, history, future, redo, checkpoint, logs, logIndent) {
        if (resources === void 0) {
          resources = { coin: 0, energy: 0, points: 0, actions: 0, buys: 0 };
        }
        if (zones === void 0) {
          zones = /* @__PURE__ */ new Map();
        }
        if (resolving === void 0) {
          resolving = [];
        }
        if (nextID === void 0) {
          nextID = 0;
        }
        if (history === void 0) {
          history = [];
        }
        if (future === void 0) {
          future = [];
        }
        if (redo === void 0) {
          redo = [];
        }
        if (checkpoint === void 0) {
          checkpoint = null;
        }
        if (logs === void 0) {
          logs = emptyLog;
        }
        if (logIndent === void 0) {
          logIndent = 0;
        }
        this.spec = spec;
        this.ui = ui;
        this.resources = resources;
        this.zones = zones;
        this.resolving = resolving;
        this.nextID = nextID;
        this.history = history;
        this.future = future;
        this.redo = redo;
        this.checkpoint = checkpoint;
        this.logs = logs;
        this.logIndent = logIndent;
        this.coin = resources.coin;
        this.energy = resources.energy;
        this.points = resources.points;
        this.actions = resources.actions;
        this.buys = resources.buys;
        this.supply = zones.get("supply") || [];
        this.hand = zones.get("hand") || [];
        this.discard = zones.get("discard") || [];
        this.play = zones.get("play") || [];
        this.void = zones.get("void") || [];
        this.events = zones.get("events") || [];
        this.potions = zones.get("potions") || [];
        this.relics = zones.get("relics") || [];
        this.vp_goal = spec.vp;
      }
      State2.prototype.update = function(stateUpdate) {
        return new State2(this.spec, this.ui, get(stateUpdate, "resources", this), get(stateUpdate, "zones", this), get(stateUpdate, "resolving", this), get(stateUpdate, "nextID", this), get(stateUpdate, "history", this), get(stateUpdate, "future", this), get(stateUpdate, "redo", this), get(stateUpdate, "checkpoint", this), get(stateUpdate, "logs", this), get(stateUpdate, "logIndent", this));
      };
      State2.prototype.getZone = function(zone) {
        return this.zones.get(zone) || [];
      };
      State2.prototype.addResolving = function(x) {
        return this.update({ resolving: this.resolving.concat([x]) });
      };
      State2.prototype.popResolving = function() {
        return this.update({ resolving: this.resolving.slice(0, this.resolving.length - 1) });
      };
      State2.prototype.sortZone = function(zone) {
        var newZones = new Map(this.zones);
        var newZone = (this.zones.get(zone) || []).slice();
        var supplyOrder = /* @__PURE__ */ new Map();
        this.supply.forEach(function(card, index) {
          if (!supplyOrder.has(card.name)) {
            supplyOrder.set(card.name, index);
          }
        });
        newZone.sort(function(a2, b) {
          var _a, _b;
          var aIndex = (_a = supplyOrder.get(a2.name)) !== null && _a !== void 0 ? _a : Infinity;
          var bIndex = (_b = supplyOrder.get(b.name)) !== null && _b !== void 0 ? _b : Infinity;
          if (aIndex !== Infinity && bIndex !== Infinity) {
            return aIndex - bIndex;
          } else if (aIndex !== Infinity) {
            return -1;
          } else if (bIndex !== Infinity) {
            return 1;
          } else {
            return a2.name.localeCompare(b.name);
          }
        });
        newZones.set(zone, newZone);
        return this.update({ zones: newZones });
      };
      State2.prototype.moveAfter = function(zone, card, afterCard) {
        var newZones = new Map(this.zones);
        if (!this[zone].some(function(c) {
          return c.id == card.id;
        }))
          return this;
        if (!this[zone].some(function(c) {
          return c.id == afterCard.id;
        }))
          return this;
        var currentZone = this[zone].filter(function(c) {
          return c.id != card.id;
        });
        var insertIndex = currentZone.findIndex(function(c) {
          return c.id == afterCard.id;
        }) + 1;
        var newZone = currentZone.slice(0, insertIndex).concat([card]).concat(currentZone.slice(insertIndex));
        newZones.set(zone, newZone);
        return this.update({ zones: newZones });
      };
      State2.prototype.resolvingCards = function() {
        var e_22, _a;
        var result = [];
        try {
          for (var _b = __values(this.resolving), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            if (c.kind == "card")
              result.push(c);
          }
        } catch (e_22_1) {
          e_22 = { error: e_22_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_22) throw e_22.error;
          }
        }
        return result;
      };
      State2.prototype.addToZone = function(card, zone) {
        card = card.update({ place: zone });
        if (zone == "resolving")
          return this.addResolving(card);
        var newZones = new Map(this.zones);
        var currentZone = this[zone];
        newZones.set(zone, insertAt(currentZone, card));
        return this.update({ zones: newZones });
      };
      State2.prototype.remove = function(card) {
        var e_23, _a;
        var newZones = /* @__PURE__ */ new Map();
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_1 = _d[0], zone = _d[1];
            newZones.set(name_1, zone.filter(function(c) {
              return c.id != card.id;
            }));
          }
        } catch (e_23_1) {
          e_23 = { error: e_23_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_23) throw e_23.error;
          }
        }
        return this.update({ zones: newZones, resolving: this.resolving.filter(function(c) {
          return c.id != card.id;
        }) });
      };
      State2.prototype.apply = function(f, card) {
        var e_24, _a;
        var newZones = /* @__PURE__ */ new Map();
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
            newZones.set(name_2, zone.map(function(c) {
              return c.id == card.id ? f(c) : c;
            }));
          }
        } catch (e_24_1) {
          e_24 = { error: e_24_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_24) throw e_24.error;
          }
        }
        function fOnCard(c) {
          if (c instanceof Shadow || c.id != card.id)
            return c;
          return f(c);
        }
        return this.update({ zones: newZones, resolving: this.resolving.map(fOnCard) });
      };
      State2.prototype.replace = function(oldCard, newCard) {
        return this.apply(function(_) {
          return newCard;
        }, oldCard);
      };
      State2.prototype.addShadow = function(spec) {
        var _a;
        var state = this;
        var id;
        _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
        var shadow = new Shadow(id, spec);
        return state.addResolving(shadow);
      };
      State2.prototype.setResources = function(resources) {
        return this.update({ resources });
      };
      State2.prototype.idMap = function() {
        var e_25, _a, e_26, _b, e_27, _c;
        var byId = /* @__PURE__ */ new Map();
        try {
          for (var _d = __values(this.zones), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), name_3 = _f[0], zone = _f[1];
            try {
              for (var zone_1 = (e_26 = void 0, __values(zone)), zone_1_1 = zone_1.next(); !zone_1_1.done; zone_1_1 = zone_1.next()) {
                var card = zone_1_1.value;
                byId.set(card.id, card);
              }
            } catch (e_26_1) {
              e_26 = { error: e_26_1 };
            } finally {
              try {
                if (zone_1_1 && !zone_1_1.done && (_b = zone_1.return)) _b.call(zone_1);
              } finally {
                if (e_26) throw e_26.error;
              }
            }
          }
        } catch (e_25_1) {
          e_25 = { error: e_25_1 };
        } finally {
          try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
          } finally {
            if (e_25) throw e_25.error;
          }
        }
        try {
          for (var _g = __values(this.resolving), _h = _g.next(); !_h.done; _h = _g.next()) {
            var card = _h.value;
            if (card.kind == "card") {
              byId.set(card.id, card);
            }
          }
        } catch (e_27_1) {
          e_27 = { error: e_27_1 };
        } finally {
          try {
            if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
          } finally {
            if (e_27) throw e_27.error;
          }
        }
        return byId;
      };
      State2.prototype.find = function(card) {
        var e_28, _a;
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_4 = _d[0], zone_2 = _d[1];
            var matches_1 = zone_2.filter(function(c) {
              return c.id == card.id;
            });
            if (matches_1.length > 0)
              return matches_1[0];
          }
        } catch (e_28_1) {
          e_28 = { error: e_28_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_28) throw e_28.error;
          }
        }
        var zone = this.resolving;
        var matches = zone.filter(function(c) {
          return c.id == card.id;
        });
        if (matches.length > 0)
          return matches[0];
        return card.update({ place: "void" });
      };
      State2.prototype.startTicker = function(card) {
        return this.apply(function(card2) {
          return card2.startTicker();
        }, card);
      };
      State2.prototype.endTicker = function(card) {
        return this.apply(function(card2) {
          return card2.endTicker();
        }, card);
      };
      State2.prototype.consumeRedo = function(record) {
        var _a;
        var result, redo;
        _a = __read(popLast(this.redo), 2), result = _a[0], redo = _a[1];
        if (result === null)
          return this;
        return this.update({ redo: result == record ? redo : [] });
      };
      State2.prototype.addHistory = function(record) {
        return this.update({ history: this.history.concat([record]) });
      };
      State2.prototype.log = function(msg, logType) {
        if (logType === void 0) {
          logType = "all";
        }
        var logs = __assign({}, this.logs);
        if (logType == "all")
          msg = indent(this.logIndent, msg);
        var state = this.update({ future: [] }).backup();
        logs[logType] = logs[logType].concat([[msg, state]]);
        return this.update({ logs });
      };
      State2.prototype.shiftFuture = function() {
        var _a;
        var result, future;
        _a = __read(shiftFirst(this.future), 2), result = _a[0], future = _a[1];
        return [this.update({ future }), result];
      };
      State2.prototype.popFuture = function() {
        var _a;
        var result, future;
        _a = __read(popLast(this.future), 2), result = _a[0], future = _a[1];
        return [this.update({ future }), result];
      };
      State2.prototype.setCheckpoint = function() {
        return this.update({ history: [], future: this.future, checkpoint: this });
      };
      State2.prototype.indent = function() {
        return this.update({ logIndent: this.logIndent + 1 });
      };
      State2.prototype.unindent = function() {
        return this.update({ logIndent: this.logIndent - 1 });
      };
      State2.prototype.backup = function() {
        var last = this.checkpoint;
        return last == null ? null : last.update({
          future: this.history.concat(this.future),
          redo: this.redo
        });
      };
      State2.prototype.makeID = function() {
        var id = this.nextID;
        return [this.update({ nextID: id + 1 }), id];
      };
      State2.prototype.lastReplayable = function() {
        if (this.history.length > 0)
          return this.history[this.history.length - 1];
        else if (this.checkpoint == null)
          return null;
        else
          return this.checkpoint.lastReplayable();
      };
      State2.prototype.undoable = function() {
        return this.lastReplayable() != null;
      };
      State2.prototype.clearFuture = function() {
        return this.update({ future: [] });
      };
      State2.prototype.addRedo = function(action) {
        var result = this.update({ redo: this.redo.concat([action]) });
        return result;
      };
      State2.prototype.origin = function() {
        var state = this;
        var prev = state;
        while (prev != null) {
          state = prev;
          prev = state.backup();
        }
        return state;
      };
      State2.prototype.hasHistory = function() {
        return this.origin().future.length > 0;
      };
      return State2;
    })()
  );
  var MalformedReplay = (
    /** @class */
    (function(_super) {
      __extends(MalformedReplay2, _super);
      function MalformedReplay2(s) {
        var _this = _super.call(this, "Not a well-formed replay: ".concat(s)) || this;
        _this.s = s;
        Object.setPrototypeOf(_this, MalformedReplay2.prototype);
        return _this;
      }
      return MalformedReplay2;
    })(Error)
  );
  function indent(n, s) {
    var parts = [];
    for (var i = 0; i < n; i++) {
      parts.push("&nbsp;&nbsp;");
    }
    parts.push(s);
    return parts.join("");
  }
  function popLast(xs) {
    var n = xs.length;
    if (n == 0)
      return [null, xs];
    return [xs[n - 1], xs.slice(0, n - 1)];
  }
  function shiftFirst(xs) {
    if (xs.length == 0)
      return [null, xs];
    return [xs[0], xs.slice(1)];
  }
  function trigger(e) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var initialState2, rules_1, rules_1_1, rule, ruleCard, _a, _b, rawTrigger, trigger_4, e_29_1, e_30_1, triggers, _c, _d, card, _e, _f, trigger_5, _g, _h, card, _j, _k, trigger_6, triggers_1, triggers_1_1, _l, card, rawTrigger, trigger_7, e_31_1;
        var e_30, _m, e_29, _o, e_32, _p, e_33, _q, e_34, _r, e_35, _s, e_31, _t;
        return __generator(this, function(_u) {
          switch (_u.label) {
            case 0:
              initialState2 = state;
              _u.label = 1;
            case 1:
              _u.trys.push([1, 12, 13, 14]);
              rules_1 = __values(rules), rules_1_1 = rules_1.next();
              _u.label = 2;
            case 2:
              if (!!rules_1_1.done) return [3, 11];
              rule = rules_1_1.value;
              if (!rule.triggers) return [3, 10];
              ruleCard = new Card({ name: "(rule) ".concat(rule.name) }, -1);
              _u.label = 3;
            case 3:
              _u.trys.push([3, 8, 9, 10]);
              _a = (e_29 = void 0, __values(rule.triggers)), _b = _a.next();
              _u.label = 4;
            case 4:
              if (!!_b.done) return [3, 7];
              rawTrigger = _b.value;
              if (!(rawTrigger.kind == e.kind)) return [3, 6];
              trigger_4 = rawTrigger;
              if (!(trigger_4.handles(e, initialState2, null) && trigger_4.handles(e, state, null))) return [3, 6];
              state = state.log("Triggering ".concat(rule.name, " rule"));
              return [4, withTracking(trigger_4.transform(e, state, null), { kind: "trigger", trigger: trigger_4, card: ruleCard })(state)];
            case 5:
              state = _u.sent();
              _u.label = 6;
            case 6:
              _b = _a.next();
              return [3, 4];
            case 7:
              return [3, 10];
            case 8:
              e_29_1 = _u.sent();
              e_29 = { error: e_29_1 };
              return [3, 10];
            case 9:
              try {
                if (_b && !_b.done && (_o = _a.return)) _o.call(_a);
              } finally {
                if (e_29) throw e_29.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 10:
              rules_1_1 = rules_1.next();
              return [3, 2];
            case 11:
              return [3, 14];
            case 12:
              e_30_1 = _u.sent();
              e_30 = { error: e_30_1 };
              return [3, 14];
            case 13:
              try {
                if (rules_1_1 && !rules_1_1.done && (_m = rules_1.return)) _m.call(rules_1);
              } finally {
                if (e_30) throw e_30.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 14:
              triggers = [];
              try {
                for (_c = __values(state.events.concat(state.supply)), _d = _c.next(); !_d.done; _d = _c.next()) {
                  card = _d.value;
                  try {
                    for (_e = (e_33 = void 0, __values(card.staticTriggers())), _f = _e.next(); !_f.done; _f = _e.next()) {
                      trigger_5 = _f.value;
                      triggers.push([card, trigger_5]);
                    }
                  } catch (e_33_1) {
                    e_33 = { error: e_33_1 };
                  } finally {
                    try {
                      if (_f && !_f.done && (_q = _e.return)) _q.call(_e);
                    } finally {
                      if (e_33) throw e_33.error;
                    }
                  }
                }
              } catch (e_32_1) {
                e_32 = { error: e_32_1 };
              } finally {
                try {
                  if (_d && !_d.done && (_p = _c.return)) _p.call(_c);
                } finally {
                  if (e_32) throw e_32.error;
                }
              }
              try {
                for (_g = __values(state.play.concat(state.relics)), _h = _g.next(); !_h.done; _h = _g.next()) {
                  card = _h.value;
                  try {
                    for (_j = (e_35 = void 0, __values(card.triggers())), _k = _j.next(); !_k.done; _k = _j.next()) {
                      trigger_6 = _k.value;
                      triggers.push([card, trigger_6]);
                    }
                  } catch (e_35_1) {
                    e_35 = { error: e_35_1 };
                  } finally {
                    try {
                      if (_k && !_k.done && (_s = _j.return)) _s.call(_j);
                    } finally {
                      if (e_35) throw e_35.error;
                    }
                  }
                }
              } catch (e_34_1) {
                e_34 = { error: e_34_1 };
              } finally {
                try {
                  if (_h && !_h.done && (_r = _g.return)) _r.call(_g);
                } finally {
                  if (e_34) throw e_34.error;
                }
              }
              _u.label = 15;
            case 15:
              _u.trys.push([15, 20, 21, 22]);
              triggers_1 = __values(triggers), triggers_1_1 = triggers_1.next();
              _u.label = 16;
            case 16:
              if (!!triggers_1_1.done) return [3, 19];
              _l = __read(triggers_1_1.value, 2), card = _l[0], rawTrigger = _l[1];
              if (!(rawTrigger.kind == e.kind)) return [3, 18];
              trigger_7 = rawTrigger;
              if (!(trigger_7.handles(e, initialState2, card) && trigger_7.handles(e, state, card))) return [3, 18];
              state = state.log("Triggering ".concat(card));
              return [4, withTracking(trigger_7.transform(e, state, card), { kind: "trigger", trigger: trigger_7, card })(state)];
            case 17:
              state = _u.sent();
              _u.label = 18;
            case 18:
              triggers_1_1 = triggers_1.next();
              return [3, 16];
            case 19:
              return [3, 22];
            case 20:
              e_31_1 = _u.sent();
              e_31 = { error: e_31_1 };
              return [3, 22];
            case 21:
              try {
                if (triggers_1_1 && !triggers_1_1.done && (_t = triggers_1.return)) _t.call(triggers_1);
              } finally {
                if (e_31) throw e_31.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 22:
              return [2, state];
          }
        });
      });
    };
  }
  function replace(x, state) {
    var e_36, _a, e_37, _b, e_38, _c, e_39, _d, e_40, _e, e_41, _f, e_42, _g;
    try {
      for (var rules_2 = __values(rules), rules_2_1 = rules_2.next(); !rules_2_1.done; rules_2_1 = rules_2.next()) {
        var rule = rules_2_1.value;
        if (rule.replacers) {
          try {
            for (var _h = (e_37 = void 0, __values(rule.replacers)), _j = _h.next(); !_j.done; _j = _h.next()) {
              var rawReplacer = _j.value;
              if (rawReplacer.kind == x.kind) {
                var replacer = rawReplacer;
                if (replacer.handles(x, state, rule)) {
                  x = replacer.replace(x, state, rule);
                }
              }
            }
          } catch (e_37_1) {
            e_37 = { error: e_37_1 };
          } finally {
            try {
              if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
            } finally {
              if (e_37) throw e_37.error;
            }
          }
        }
      }
    } catch (e_36_1) {
      e_36 = { error: e_36_1 };
    } finally {
      try {
        if (rules_2_1 && !rules_2_1.done && (_a = rules_2.return)) _a.call(rules_2);
      } finally {
        if (e_36) throw e_36.error;
      }
    }
    var replacers = [];
    try {
      for (var _k = __values(state.events.concat(state.supply).concat(state.relics)), _l = _k.next(); !_l.done; _l = _k.next()) {
        var card = _l.value;
        try {
          for (var _m = (e_39 = void 0, __values(card.staticReplacers())), _o = _m.next(); !_o.done; _o = _m.next()) {
            var replacer = _o.value;
            replacers.push([card, replacer]);
          }
        } catch (e_39_1) {
          e_39 = { error: e_39_1 };
        } finally {
          try {
            if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
          } finally {
            if (e_39) throw e_39.error;
          }
        }
      }
    } catch (e_38_1) {
      e_38 = { error: e_38_1 };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_38) throw e_38.error;
      }
    }
    try {
      for (var _p = __values(state.play), _q = _p.next(); !_q.done; _q = _p.next()) {
        var card = _q.value;
        try {
          for (var _r = (e_41 = void 0, __values(card.replacers())), _s = _r.next(); !_s.done; _s = _r.next()) {
            var replacer = _s.value;
            replacers.push([card, replacer]);
          }
        } catch (e_41_1) {
          e_41 = { error: e_41_1 };
        } finally {
          try {
            if (_s && !_s.done && (_f = _r.return)) _f.call(_r);
          } finally {
            if (e_41) throw e_41.error;
          }
        }
      }
    } catch (e_40_1) {
      e_40 = { error: e_40_1 };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_40) throw e_40.error;
      }
    }
    try {
      for (var replacers_1 = __values(replacers), replacers_1_1 = replacers_1.next(); !replacers_1_1.done; replacers_1_1 = replacers_1.next()) {
        var _t = __read(replacers_1_1.value, 2), card = _t[0], rawReplacer = _t[1];
        if (rawReplacer.kind == x.kind) {
          var replacer = rawReplacer;
          if (replacer.handles(x, state, card)) {
            x = replacer.replace(x, state, card);
          }
        }
      }
    } catch (e_42_1) {
      e_42 = { error: e_42_1 };
    } finally {
      try {
        if (replacers_1_1 && !replacers_1_1.done && (_g = replacers_1.return)) _g.call(replacers_1);
      } finally {
        if (e_42) throw e_42.error;
      }
    }
    return x;
  }
  var Shadow = (
    /** @class */
    (function() {
      function Shadow2(id, spec, tick2) {
        if (tick2 === void 0) {
          tick2 = 1;
        }
        this.id = id;
        this.spec = spec;
        this.tick = tick2;
        this.kind = "shadow";
      }
      Shadow2.prototype.tickUp = function() {
        return new Shadow2(this.id, this.spec, this.tick + 1);
      };
      return Shadow2;
    })()
  );
  function startTracking(state, spec) {
    if (spec.kind != "none")
      state = state.addShadow(spec);
    state = state.startTicker(spec.card).indent();
    return state;
  }
  function stopTracking(state, spec) {
    state = state.unindent().endTicker(spec.card);
    if (spec.kind != "none")
      state = state.popResolving();
    return state;
  }
  function withTracking(f, spec) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              state = startTracking(state, spec);
              return [4, f(state)];
            case 1:
              state = _a.sent();
              state = stopTracking(state, spec);
              return [2, state];
          }
        });
      });
    };
  }
  function tick(card) {
    return function(state) {
      state = state.apply(function(x) {
        return x.tick();
      }, card);
      var last = state.resolving[state.resolving.length - 1];
      if (last instanceof Shadow) {
        state = state.popResolving();
        state = state.addResolving(last.tickUp());
      }
      return state;
    };
  }
  function create(spec, zone, postprocess, tokens) {
    if (zone === void 0) {
      zone = "discard";
    }
    if (postprocess === void 0) {
      postprocess = function() {
        return noop;
      };
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var card;
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              return [4, createAndTrack(spec, zone, tokens)(state)];
            case 1:
              _a = __read.apply(void 0, [_b.sent(), 2]), card = _a[0], state = _a[1];
              if (!(card != null)) return [3, 3];
              return [4, postprocess(card)(state)];
            case 2:
              state = _b.sent();
              _b.label = 3;
            case 3:
              return [2, state];
          }
        });
      });
    };
  }
  function createRaw(state, spec, zone, tokens) {
    var _a, e_43, _b;
    if (zone === void 0) {
      zone = "discard";
    }
    var id;
    _a = __read(state.makeID(), 2), state = _a[0], id = _a[1];
    var card = new Card(spec, id);
    if (tokens != void 0) {
      try {
        for (var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
          var _c = __read(tokens_1_1.value, 2), token = _c[0], n = _c[1];
          card.tokens.set(token, n);
        }
      } catch (e_43_1) {
        e_43 = { error: e_43_1 };
      } finally {
        try {
          if (tokens_1_1 && !tokens_1_1.done && (_b = tokens_1.return)) _b.call(tokens_1);
        } finally {
          if (e_43) throw e_43.error;
        }
      }
    }
    state = state.addToZone(card, zone);
    return [state, card];
  }
  function createRawMulti(state, specs, zone) {
    var e_44, _a, _b;
    if (zone === void 0) {
      zone = "discard";
    }
    try {
      for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
        var spec = specs_1_1.value;
        var card = void 0;
        _b = __read(createRaw(state, spec, zone), 2), state = _b[0], card = _b[1];
      }
    } catch (e_44_1) {
      e_44 = { error: e_44_1 };
    } finally {
      try {
        if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
      } finally {
        if (e_44) throw e_44.error;
      }
    }
    return state;
  }
  function createAndTrack(spec, zone, tokens) {
    if (zone === void 0) {
      zone = "discard";
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var params, card, _a, _b, effect, e_45_1;
        var _c, e_45, _d;
        return __generator(this, function(_e) {
          switch (_e.label) {
            case 0:
              params = { kind: "create", spec, zone, effects: [], tokens };
              params = replace(params, state);
              spec = params.spec;
              if (!canCreate(spec, state))
                return [2, [null, state]];
              card = null;
              if (!(params.zone != null)) return [3, 9];
              _c = __read(createRaw(state, spec, params.zone, params.tokens), 2), state = _c[0], card = _c[1];
              return [4, trigger({ kind: "create", card, zone: params.zone })(state)];
            case 1:
              state = _e.sent();
              _e.label = 2;
            case 2:
              _e.trys.push([2, 7, 8, 9]);
              _a = __values(params.effects), _b = _a.next();
              _e.label = 3;
            case 3:
              if (!!_b.done) return [3, 6];
              effect = _b.value;
              return [4, effect(card)(state)];
            case 4:
              state = _e.sent();
              _e.label = 5;
            case 5:
              _b = _a.next();
              return [3, 3];
            case 6:
              return [3, 9];
            case 7:
              e_45_1 = _e.sent();
              e_45 = { error: e_45_1 };
              return [3, 9];
            case 8:
              try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
              } finally {
                if (e_45) throw e_45.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 9:
              return [2, [card, state]];
          }
        });
      });
    };
  }
  function canCreate(spec, state) {
    var params = replace({ kind: "canCreate", spec, canCreate: true }, state);
    return params.canCreate;
  }
  function move(card, toZone, logged) {
    if (logged === void 0) {
      logged = false;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var params, _a, _b, effect, e_46_1;
        var e_46, _c;
        return __generator(this, function(_d) {
          switch (_d.label) {
            case 0:
              card = state.find(card);
              if (card.place == null)
                return [2, state];
              params = { kind: "move", card, fromZone: card.place, toZone, effects: [], skip: false };
              params = replace(params, state);
              if (!!params.skip) return [3, 2];
              toZone = params.toZone;
              card = params.card;
              state = state.remove(card);
              if (toZone == "void") {
                if (!logged)
                  state = state.log("Trashed ".concat(renderCardName(card), " from ").concat(card.place));
              } else {
                if (!logged)
                  state = state.log("Moved ".concat(renderCardName(card), " from ").concat(card.place, " to ").concat(toZone));
              }
              state = state.addToZone(card, toZone);
              return [4, trigger({ kind: "move", fromZone: card.place, toZone, card })(state)];
            case 1:
              state = _d.sent();
              _d.label = 2;
            case 2:
              _d.trys.push([2, 7, 8, 9]);
              _a = __values(params.effects), _b = _a.next();
              _d.label = 3;
            case 3:
              if (!!_b.done) return [3, 6];
              effect = _b.value;
              return [4, effect(state)];
            case 4:
              state = _d.sent();
              _d.label = 5;
            case 5:
              _b = _a.next();
              return [3, 3];
            case 6:
              return [3, 9];
            case 7:
              e_46_1 = _d.sent();
              e_46 = { error: e_46_1 };
              return [3, 9];
            case 8:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_46) throw e_46.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 9:
              return [2, state];
          }
        });
      });
    };
  }
  function renderCost(cost, full) {
    var e_47, _a;
    if (full === void 0) {
      full = false;
    }
    var parts = [];
    var toRender = full ? allCostResources : ["coin", "energy"];
    try {
      for (var toRender_1 = __values(toRender), toRender_1_1 = toRender_1.next(); !toRender_1_1.done; toRender_1_1 = toRender_1.next()) {
        var name_5 = toRender_1_1.value;
        var x = cost[name_5];
        if (x != void 0 && x > 0)
          parts.push(renderResource(name_5, x));
      }
    } catch (e_47_1) {
      e_47 = { error: e_47_1 };
    } finally {
      try {
        if (toRender_1_1 && !toRender_1_1.done && (_a = toRender_1.return)) _a.call(toRender_1);
      } finally {
        if (e_47) throw e_47.error;
      }
    }
    return parts.join(" ");
  }
  function num(n, x) {
    return "".concat(n, " ").concat(x).concat(n == 1 ? "" : "s");
  }
  function aOrNum(n, x) {
    return n == 1 ? a(x) : "".concat(n, " ").concat(x, "s");
  }
  function a(s) {
    var c = s[0].toLowerCase();
    if (c == "a" || c == "e" || c == "i" || c == "o" || c == "u")
      return "an " + s;
    return "a " + s;
  }
  function lowercaseFirst(s) {
    return s[0].toLowerCase() + s.slice(1);
  }
  function renderResource(resource, amount) {
    if (amount < 0)
      return "-" + renderResource(resource, -amount);
    switch (resource) {
      case "coin":
        return "$".concat(amount);
      case "energy":
        if (amount > 5 || amount % 1 != 0)
          return "@x".concat(amount);
        else
          return repeatSymbol("@", amount);
      case "points":
        return "".concat(amount, " vp");
      case "actions":
        return num(amount, "action");
      case "buys":
        return num(amount, "buy");
      default:
        assertNever(resource);
    }
  }
  function renderEnergy(amount) {
    return renderResource("energy", amount);
  }
  function repeatSymbol(s, n) {
    var parts = [];
    for (var i = 0; i < n; i++) {
      parts.push(s);
    }
    return parts.join("");
  }
  function logChange(state, noun, n, positive, negative) {
    if (n == 1) {
      return state.log(positive[0] + a(noun) + positive[1]);
    } else if (n > 1) {
      return state.log(positive[0] + "".concat(n, " ") + noun + "s" + positive[1]);
    } else if (n < 0) {
      return logChange(state, noun, -n, negative, positive);
    }
    return state;
  }
  var CostNotPaid = (
    /** @class */
    (function(_super) {
      __extends(CostNotPaid2, _super);
      function CostNotPaid2(message) {
        var _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, CostNotPaid2.prototype);
        return _this;
      }
      return CostNotPaid2;
    })(Error)
  );
  function payCost(c, source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, _b, effect, e_48_1;
        var e_48, _c;
        return __generator(this, function(_d) {
          switch (_d.label) {
            case 0:
              if (state.coin < c.coin)
                throw new CostNotPaid("Not enough coin");
              if (state.actions < c.actions)
                throw new CostNotPaid("Not enough actions");
              if (state.buys < c.buys)
                throw new CostNotPaid("Not enough buys");
              state = state.setResources({
                coin: state.coin - c.coin,
                actions: state.actions - c.actions,
                buys: state.buys - c.buys,
                energy: state.energy + c.energy,
                points: state.points
              });
              if (renderCost(c, true) != "") {
                state = state.log("Paid ".concat(renderCost(c, true)));
              }
              if (renderCost(c, false) != "") {
                state = state.log("".concat(renderCost(c, false), " for ").concat(source), "costs");
              }
              if (c.energy > 0) {
                state = state.log("".concat(c.energy, " for ").concat(source), "energy");
              }
              _d.label = 1;
            case 1:
              _d.trys.push([1, 6, 7, 8]);
              _a = __values(c.effects), _b = _a.next();
              _d.label = 2;
            case 2:
              if (!!_b.done) return [3, 5];
              effect = _b.value;
              return [4, effect(state)];
            case 3:
              state = _d.sent();
              _d.label = 4;
            case 4:
              _b = _a.next();
              return [3, 2];
            case 5:
              return [3, 8];
            case 6:
              e_48_1 = _d.sent();
              e_48 = { error: e_48_1 };
              return [3, 8];
            case 7:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_48) throw e_48.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 8:
              return [2, trigger({ kind: "cost", cost: c, source })(state)];
          }
        });
      });
    };
  }
  function gainResource(resource, amount, source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var newResources, params, _a, _b, transform, e_49_1;
        var e_49, _c;
        return __generator(this, function(_d) {
          switch (_d.label) {
            case 0:
              if (amount == 0)
                return [2, state];
              newResources = {
                coin: state.coin,
                energy: state.energy,
                points: state.points,
                actions: state.actions,
                buys: state.buys
              };
              params = {
                kind: "resource",
                amount,
                resource,
                source,
                effects: []
              };
              params = replace(params, state);
              resource = params.resource;
              amount = params.amount;
              newResources[resource] = Math.max(newResources[resource] + amount, 0);
              state = state.setResources(newResources);
              state = state.log(amount > 0 ? "Gained ".concat(renderResource(resource, amount)) : "Lost ".concat(renderResource(resource, -amount)));
              _d.label = 1;
            case 1:
              _d.trys.push([1, 6, 7, 8]);
              _a = __values(params.effects), _b = _a.next();
              _d.label = 2;
            case 2:
              if (!!_b.done) return [3, 5];
              transform = _b.value;
              return [4, transform(state)];
            case 3:
              state = _d.sent();
              _d.label = 4;
            case 4:
              _b = _a.next();
              return [3, 2];
            case 5:
              return [3, 8];
            case 6:
              e_49_1 = _d.sent();
              e_49 = { error: e_49_1 };
              return [3, 8];
            case 7:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_49) throw e_49.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 8:
              return [2, trigger({ kind: "resource", resource, amount, source })(state)];
          }
        });
      });
    };
  }
  var Victory = (
    /** @class */
    (function(_super) {
      __extends(Victory2, _super);
      function Victory2(state) {
        var _this = _super.call(this, "Victory") || this;
        _this.state = state;
        Object.setPrototypeOf(_this, Victory2.prototype);
        return _this;
      }
      return Victory2;
    })(Error)
  );
  var ReplayVictory = (
    /** @class */
    (function(_super) {
      __extends(ReplayVictory2, _super);
      function ReplayVictory2(state) {
        var _this = _super.call(this, "ReplayVictory") || this;
        _this.state = state;
        Object.setPrototypeOf(_this, ReplayVictory2.prototype);
        return _this;
      }
      return ReplayVictory2;
    })(Error)
  );
  function gainPoints(n, source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var vp_goal, victoryParams;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, gainResource("points", n, source)(state)];
            case 1:
              state = _a.sent();
              vp_goal = state.vp_goal;
              if (vp_goal > 0 && state.points >= vp_goal) {
                victoryParams = replace({ kind: "victory", victory: true }, state);
                if (victoryParams.victory)
                  throw new Victory(state);
              }
              return [2, state];
          }
        });
      });
    };
  }
  function discharge(card, n) {
    return charge(card, -n, true);
  }
  function charge(card, n, cost) {
    if (n === void 0) {
      n = 1;
    }
    if (cost === void 0) {
      cost = false;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var oldCharge, newCharge;
        return __generator(this, function(_a) {
          card = state.find(card);
          if (card.place == null) {
            if (cost)
              throw new CostNotPaid("card no longer exists");
            return [2, state];
          }
          if (card.charge + n < 0 && cost)
            throw new CostNotPaid("not enough charge");
          oldCharge = card.charge;
          newCharge = Math.max(oldCharge + n, 0);
          state = state.apply(function(card2) {
            return card2.setTokens("charge", newCharge);
          }, card);
          state = logChange(state, "charge token", newCharge - oldCharge, ["Added ", " to ".concat(renderCardName(card))], ["Removed ", " from ".concat(renderCardName(card))]);
          return [2, trigger({
            kind: "gainCharge",
            card,
            oldCharge,
            newCharge,
            cost
          })(state)];
        });
      });
    };
  }
  function logTokenChange(state, card, token, n) {
    return logChange(state, "".concat(token, " token"), n, ["Added ", " to ".concat(renderCardName(card))], ["Removed ", " from ".concat(renderCardName(card))]);
  }
  function addToken(card, token, n) {
    if (n === void 0) {
      n = 1;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var newCard;
        return __generator(this, function(_a) {
          card = state.find(card);
          if (card.place == null)
            return [2, state];
          newCard = card.addTokens(token, n);
          state = state.replace(card, newCard);
          state = logTokenChange(state, card, token, n);
          return [2, trigger({ kind: "addToken", card: newCard, token, amount: n })(state)];
        });
      });
    };
  }
  function removeToken(card, token, n, isCost) {
    if (n === void 0) {
      n = 1;
    }
    if (isCost === void 0) {
      isCost = false;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var current, removed, newCard;
        return __generator(this, function(_a) {
          card = state.find(card);
          if (card.place == null) {
            if (isCost)
              throw new CostNotPaid("Couldn't remove ".concat(token, " token."));
            return [2, state];
          }
          current = card.count(token);
          if (n != "all" && n > current && isCost)
            throw new CostNotPaid("Couldn't remove ".concat(num(n, token + " token"), "."));
          removed = n == "all" ? current : Math.min(current, n);
          newCard = card.addTokens(token, -removed);
          state = state.replace(card, newCard);
          state = logTokenChange(state, card, token, -removed);
          return [2, trigger({ kind: "removeTokens", card: newCard, token, removed })(state)];
        });
      });
    };
  }
  var ReplayEnded = (
    /** @class */
    (function(_super) {
      __extends(ReplayEnded2, _super);
      function ReplayEnded2(state) {
        var _this = _super.call(this, "ReplayEnded") || this;
        _this.state = state;
        Object.setPrototypeOf(_this, ReplayEnded2.prototype);
        return _this;
      }
      return ReplayEnded2;
    })(Error)
  );
  var InvalidHistory = (
    /** @class */
    (function(_super) {
      __extends(InvalidHistory2, _super);
      function InvalidHistory2(index, state) {
        var _this = _super.call(this, "Index ".concat(index, " does not correspond to a valid choice")) || this;
        _this.index = index;
        _this.state = state;
        Object.setPrototypeOf(_this, InvalidHistory2.prototype);
        return _this;
      }
      return InvalidHistory2;
    })(Error)
  );
  var Undo = (
    /** @class */
    (function(_super) {
      __extends(Undo3, _super);
      function Undo3(state) {
        var _this = _super.call(this, "Undo") || this;
        _this.state = state;
        Object.setPrototypeOf(_this, Undo3.prototype);
        return _this;
      }
      return Undo3;
    })(Error)
  );
  var UndoPastBeginning = (
    /** @class */
    (function(_super) {
      __extends(UndoPastBeginning2, _super);
      function UndoPastBeginning2(history, redo, macroPersistence) {
        if (history === void 0) {
          history = [];
        }
        if (redo === void 0) {
          redo = [];
        }
        if (macroPersistence === void 0) {
          macroPersistence = null;
        }
        var _this = _super.call(this, "UndoPastBeginning") || this;
        _this.history = history;
        _this.redo = redo;
        _this.macroPersistence = macroPersistence;
        Object.setPrototypeOf(_this, UndoPastBeginning2.prototype);
        return _this;
      }
      return UndoPastBeginning2;
    })(Error)
  );
  var SetState = (
    /** @class */
    (function(_super) {
      __extends(SetState2, _super);
      function SetState2(state) {
        var _this = _super.call(this, "Undo") || this;
        _this.state = state;
        Object.setPrototypeOf(_this, SetState2.prototype);
        return _this;
      }
      return SetState2;
    })(Error)
  );
  function doOrReplay(state, f) {
    return __awaiter(this, void 0, void 0, function() {
      var record, x;
      var _a;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _a = __read(state.shiftFuture(), 2), state = _a[0], record = _a[1];
            if (!(record !== null)) return [3, 1];
            x = record;
            return [3, 3];
          case 1:
            return [4, f()];
          case 2:
            x = _b.sent();
            state = state.consumeRedo(x);
            _b.label = 3;
          case 3:
            return [2, [state.addHistory(x), x]];
        }
      });
    });
  }
  function choice(state_1, prompt_1, options_1) {
    return __awaiter(this, arguments, void 0, function(state, prompt, options, info, chosen, presentedIndices) {
      var index, visibleIndices, boundedVisibleIndices, visibleOptions, canonicalToVisible, _a, _b, _c, visibleIndex, canonicalIndex, visibleChosen, newState;
      var e_50, _d, _e;
      var _this = this;
      if (info === void 0) {
        info = [];
      }
      if (chosen === void 0) {
        chosen = [];
      }
      if (presentedIndices === void 0) {
        presentedIndices = null;
      }
      return __generator(this, function(_f) {
        switch (_f.label) {
          case 0:
            if (options.length == 0 && info.indexOf("actChoice") == -1)
              return [2, [state, null]];
            visibleIndices = presentedIndices !== null && presentedIndices !== void 0 ? presentedIndices : options.map(function(_, i) {
              return i;
            });
            boundedVisibleIndices = visibleIndices.filter(function(i) {
              return i >= 0 && i < options.length;
            });
            visibleOptions = boundedVisibleIndices.map(function(i) {
              return options[i];
            });
            canonicalToVisible = /* @__PURE__ */ new Map();
            try {
              for (_a = __values(boundedVisibleIndices.entries()), _b = _a.next(); !_b.done; _b = _a.next()) {
                _c = __read(_b.value, 2), visibleIndex = _c[0], canonicalIndex = _c[1];
                canonicalToVisible.set(canonicalIndex, visibleIndex);
              }
            } catch (e_50_1) {
              e_50 = { error: e_50_1 };
            } finally {
              try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
              } finally {
                if (e_50) throw e_50.error;
              }
            }
            visibleChosen = chosen.map(function(canonicalIndex2) {
              return canonicalToVisible.get(canonicalIndex2);
            }).filter(function(visibleIndex2) {
              return visibleIndex2 !== void 0;
            });
            if (state.future.length === 0 && visibleOptions.length === 0)
              return [2, [state, null]];
            return [4, doOrReplay(state, function() {
              return __awaiter(_this, void 0, void 0, function() {
                var visibleIndex2;
                return __generator(this, function(_a2) {
                  switch (_a2.label) {
                    case 0:
                      return [4, state.ui.choice(state, prompt, visibleOptions, info, visibleChosen)];
                    case 1:
                      visibleIndex2 = _a2.sent();
                      if (visibleIndex2 >= boundedVisibleIndices.length || visibleIndex2 < 0) {
                        throw new InvalidHistory(visibleIndex2, state);
                      }
                      return [2, boundedVisibleIndices[visibleIndex2]];
                  }
                });
              });
            })];
          case 1:
            _e = __read.apply(void 0, [_f.sent(), 2]), newState = _e[0], index = _e[1];
            if (index >= options.length || index < 0)
              throw new InvalidHistory(index, state);
            return [2, [newState, options[index].value]];
        }
      });
    });
  }
  function multichoice(state_1, prompt_1, options_1) {
    return __awaiter(this, arguments, void 0, function(state, prompt, options, max, min, info) {
      var chosen, nextOptions, next, k;
      var _a;
      if (max === void 0) {
        max = null;
      }
      if (min === void 0) {
        min = 0;
      }
      if (info === void 0) {
        info = [];
      }
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            chosen = [];
            _b.label = 1;
          case 1:
            if (false) return [3, 3];
            if (max != null && chosen.length == max)
              return [3, 3];
            if (chosen.length < min && chosen.length == options.length)
              return [3, 3];
            nextOptions = options.map(function(option, i) {
              return __assign(__assign({}, option), { value: i });
            });
            if (chosen.length >= min) {
              nextOptions = allowNull(nextOptions, "Done");
            }
            next = void 0;
            return [4, choice(state, prompt, nextOptions, info, chosen)];
          case 2:
            _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], next = _a[1];
            if (next === null)
              return [3, 3];
            k = chosen.indexOf(next);
            if (k == -1) {
              chosen.push(next);
            } else {
              chosen.splice(k, 1);
            }
            return [3, 1];
          case 3:
            return [2, [state, chosen.map(function(i) {
              return options[i].value;
            })]];
        }
      });
    });
  }
  function asChoice(x) {
    return { render: { kind: "card", card: x }, value: x };
  }
  function asNumberedChoices(xs) {
    return xs.map(function(card, i) {
      return {
        render: { kind: "card", card },
        value: card,
        hotkeyHint: { kind: "number", val: i }
      };
    });
  }
  function allowNull(options, message) {
    if (message === void 0) {
      message = "None";
    }
    var newOptions = options.slice();
    newOptions.push({
      render: { kind: "string", string: message },
      value: null,
      hotkeyHint: { kind: "none" }
    });
    return newOptions;
  }
  function undo(startState2) {
    var _a;
    var state = startState2;
    while (true) {
      var last = void 0;
      _a = __read(state.popFuture(), 2), state = _a[0], last = _a[1];
      if (last == null) {
        var prevState = state;
        state = state.backup();
        if (state == null) {
          throw new UndoPastBeginning([], prevState.redo);
        }
      } else {
        return state.addRedo(last);
      }
    }
  }
  function doOrAbort(f, fallback) {
    if (fallback === void 0) {
      fallback = null;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var result, error_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 2, , 3]);
              return [4, f(state)];
            case 1:
              result = _a.sent();
              return [2, result];
            case 2:
              error_1 = _a.sent();
              if (error_1 instanceof CostNotPaid) {
                if (fallback != null)
                  return [2, fallback(state)];
                return [2, state];
              } else {
                throw error_1;
              }
              return [3, 3];
            case 3:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function payToDo(cost, effect, fallback) {
    if (fallback === void 0) {
      fallback = null;
    }
    return doOrAbort(function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, cost(state)];
            case 1:
              state = _a.sent();
              return [2, effect(state)];
          }
        });
      });
    }, fallback);
  }
  function doAll(effects) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var i;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              i = 0;
              _a.label = 1;
            case 1:
              if (!(i < effects.length)) return [3, 4];
              return [4, effects[i](state)];
            case 2:
              state = _a.sent();
              _a.label = 3;
            case 3:
              i++;
              return [3, 1];
            case 4:
              return [2, state];
          }
        });
      });
    };
  }
  function repeat(t, n) {
    return doAll(Array(n).fill(t));
  }
  function noop(state) {
    return state;
  }
  function logAct(state, act2, card) {
    switch (act2) {
      case "play":
        return state.log("Played ".concat(renderCardName(card)), "acts");
      case "buy":
        return state.log("Bought ".concat(renderCardName(card)), "acts");
      case "use":
        return state.log("Used ".concat(renderCardName(card)), "acts");
      case "potion":
        return state.log("Drank ".concat(renderCardName(card)), "acts");
      case "activate":
        return state;
      default:
        assertNever(act2);
    }
  }
  function act(state) {
    return __awaiter(this, void 0, void 0, function() {
      var picked, _a, card, kind;
      var _b;
      return __generator(this, function(_c) {
        switch (_c.label) {
          case 0:
            return [4, actChoice(state)];
          case 1:
            _b = __read.apply(void 0, [_c.sent(), 2]), state = _b[0], picked = _b[1];
            if (picked == null) {
              throw new Error("No valid options.");
            }
            _a = __read(picked, 2), card = _a[0], kind = _a[1];
            return [2, payToDo(card.payCost(kind), card.activate(kind, "act"))(state)];
        }
      });
    });
  }
  function canPay(cost, state) {
    return cost.coin <= state.coin && cost.actions <= state.actions && cost.buys <= state.buys && cost.tests.every(function(t) {
      return t(state);
    });
  }
  function actChoice(state) {
    var e_51, _a;
    function asActChoice(kind) {
      return function(c) {
        return { render: { kind: "card", card: c }, value: [c, kind] };
      };
    }
    function available(kind) {
      return function(c) {
        return c.affordable(kind, state);
      };
    }
    var hand = state.hand.filter(available("play")).map(asActChoice("play"));
    var supply = state.supply.filter(available("buy")).map(asActChoice("buy"));
    var events = state.events.filter(available("use")).map(asActChoice("use"));
    var play = state.play.filter(available("activate")).map(asActChoice("activate"));
    var potions = state.potions.filter(available("potion")).map(asActChoice("potion"));
    var nonPotionOptions = hand.concat(supply).concat(events).concat(play);
    var options = nonPotionOptions.concat(potions);
    var replayUsedPotions = state.spec.replayUsedPotionIDs;
    if (replayUsedPotions === void 0) {
      return choice(state, "Buy a card (costs 1 buy),\n        play a card from your hand (costs 1 action),\n        use an event, or drink a potion.", options, ["actChoice"]);
    }
    var allowedPotionIDs = new Set(replayUsedPotions);
    var presentedIndices = nonPotionOptions.map(function(_, i) {
      return i;
    });
    try {
      for (var _b = __values(potions.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2), potionIndex = _d[0], option = _d[1];
        var _e = __read(option.value, 1), card = _e[0];
        if (allowedPotionIDs.has(card.id)) {
          presentedIndices.push(nonPotionOptions.length + potionIndex);
        }
      }
    } catch (e_51_1) {
      e_51 = { error: e_51_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_51) throw e_51.error;
      }
    }
    return choice(state, "Buy a card (costs 1 buy),\n        play a card from your hand (costs 1 action),\n        use an event, or drink a potion.", options, ["actChoice"], [], presentedIndices);
  }
  function coinKey(spec) {
    var cost = cardSpecCost(spec, "buy");
    if (cost)
      return cost.coin;
    return 0;
  }
  function coinEventKey(spec) {
    return (cardSpecCost(spec, "use") || free).coin;
  }
  function energyEventKey(spec) {
    return (cardSpecCost(spec, "use") || free).energy;
  }
  function toComp(key) {
    return function(a2, b) {
      return key(a2) - key(b);
    };
  }
  function nameComp(a2, b) {
    return a2.name.localeCompare(b.name, "en");
  }
  function lexical(comps) {
    return function(a2, b) {
      var e_52, _a;
      try {
        for (var comps_1 = __values(comps), comps_1_1 = comps_1.next(); !comps_1_1.done; comps_1_1 = comps_1.next()) {
          var comp = comps_1_1.value;
          var result = comp(a2, b);
          if (result != 0)
            return result;
        }
      } catch (e_52_1) {
        e_52 = { error: e_52_1 };
      } finally {
        try {
          if (comps_1_1 && !comps_1_1.done && (_a = comps_1.return)) _a.call(comps_1);
        } finally {
          if (e_52) throw e_52.error;
        }
      }
      return 0;
    };
  }
  var supplyComp = lexical([
    toComp(coinKey),
    nameComp
  ]);
  var eventComp = lexical([
    toComp(coinEventKey),
    toComp(energyEventKey),
    nameComp
  ]);
  function maxID(cards) {
    var e_53, _a;
    var max = 0;
    try {
      for (var cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
        var card = cards_1_1.value;
        if (card.id > max)
          max = card.id;
      }
    } catch (e_53_1) {
      e_53 = { error: e_53_1 };
    } finally {
      try {
        if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
      } finally {
        if (e_53) throw e_53.error;
      }
    }
    return max;
  }
  function initialState(spec, ui) {
    var e_54, _a, e_55, _b;
    var state = new State(spec, ui);
    try {
      for (var _c = __values(spec.potions), _d = _c.next(); !_d.done; _d = _c.next()) {
        var potion = _d.value;
        state = state.addToZone(potion, "potions");
      }
    } catch (e_54_1) {
      e_54 = { error: e_54_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_54) throw e_54.error;
      }
    }
    try {
      for (var _e = __values(spec.relics), _f = _e.next(); !_f.done; _f = _e.next()) {
        var relic = _f.value;
        state = state.addToZone(relic, "relics");
      }
    } catch (e_55_1) {
      e_55 = { error: e_55_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_55) throw e_55.error;
      }
    }
    state = state.update({ nextID: maxID(spec.potions.concat(spec.relics)) + 1 });
    state = createRawMulti(state, core.cards.concat(spec.cards), "supply");
    state = createRawMulti(state, core.events.concat(spec.events), "events");
    state = createRawMulti(state, [copper, copper, copper], "discard");
    return state;
  }
  function reversed(it) {
    var xs = Array.from(it);
    xs.reverse();
    return xs.values();
  }
  function undoOrSet(to, from) {
    var e_56, _a;
    var newHistory = to.origin().future;
    var oldHistory = from.origin().future;
    var newRedo = from.redo.slice();
    var predecessor = to.spec == from.spec;
    if (predecessor) {
      try {
        for (var _b = __values(reversed(oldHistory.entries())), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = __read(_c.value, 2), i = _d[0], e = _d[1];
          if (i >= newHistory.length) {
            newRedo.push(e);
          } else if (newHistory[i] != e) {
            predecessor = false;
          }
        }
      } catch (e_56_1) {
        e_56 = { error: e_56_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_56) throw e_56.error;
        }
      }
    }
    return predecessor ? to.update({ redo: newRedo, ui: from.ui }) : to;
  }
  function playGame(spec_1, ui_1) {
    return __awaiter(this, arguments, void 0, function(spec, ui, initialFuture, initialRedo) {
      var state, victorious, error_2;
      if (initialFuture === void 0) {
        initialFuture = [];
      }
      if (initialRedo === void 0) {
        initialRedo = [];
      }
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            state = initialState(spec, ui);
            if (initialFuture.length > 0) {
              state = state.update({ future: initialFuture });
            }
            if (initialRedo.length > 0) {
              state = state.update({ redo: initialRedo });
            }
            return [4, trigger({ kind: "beforeStart" })(state)];
          case 1:
            state = _a.sent();
            return [4, trigger({ kind: "afterStart" })(state)];
          case 2:
            state = _a.sent();
            victorious = false;
            _a.label = 3;
          case 3:
            if (false) return [3, 11];
            state = state.setCheckpoint();
            _a.label = 4;
          case 4:
            _a.trys.push([4, 9, , 10]);
            if (!victorious) return [3, 6];
            return [4, state.ui.victory(state)];
          case 5:
            _a.sent();
            return [2, {
              score: state.energy,
              potionsRemaining: state.potions,
              history: state.origin().future
            }];
          case 6:
            return [4, act(state)];
          case 7:
            state = _a.sent();
            _a.label = 8;
          case 8:
            return [3, 10];
          case 9:
            error_2 = _a.sent();
            victorious = false;
            if (error_2 instanceof Undo) {
              state = undo(error_2.state);
            } else if (error_2 instanceof Victory) {
              state = error_2.state;
              victorious = true;
            } else if (error_2 instanceof SetState) {
              state = undoOrSet(error_2.state, state);
            } else {
              throw error_2;
            }
            return [3, 10];
          case 10:
            return [3, 3];
          case 11:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function refreshEffect(n) {
    return {
      text: [
        "Lose all $, actions, and buys.",
        "Return all cards from your discard and play to your hand.",
        "+".concat(num(n, "action"), ", +1 buy.")
      ],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, setResource("coin", 0, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [4, setResource("actions", 0, card)(state2)];
                case 2:
                  state2 = _a.sent();
                  return [4, setResource("buys", 0, card)(state2)];
                case 3:
                  state2 = _a.sent();
                  return [4, moveMany(state2.discard, "hand")(state2)];
                case 4:
                  state2 = _a.sent();
                  return [4, moveMany(state2.play, "hand")(state2)];
                case 5:
                  state2 = _a.sent();
                  state2 = sortHand(state2);
                  return [4, gainActions(n, card)(state2)];
                case 6:
                  state2 = _a.sent();
                  return [4, gainBuys(1, card)(state2)];
                case 7:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    };
  }
  function fountainTransform(source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, setResource("coin", 0, source)(state)];
            case 1:
              state = _a.sent();
              return [4, setResource("actions", 0, source)(state)];
            case 2:
              state = _a.sent();
              return [4, setResource("buys", 0, source)(state)];
            case 3:
              state = _a.sent();
              return [4, gainActions(5, source)(state)];
            case 4:
              state = _a.sent();
              return [4, gainBuys(1, source)(state)];
            case 5:
              state = _a.sent();
              return [2, state];
          }
        });
      });
    };
  }
  var core = {
    cards: [],
    events: []
  };
  var refresh = {
    name: "Refresh",
    fixedCost: energy(4),
    effects: [refreshEffect(5)]
  };
  core.events.push(refresh);
  var copper = {
    name: "Copper",
    buyCost: coin(0),
    effects: [coinsEffect(1)]
  };
  core.cards.push(copper);
  var silver = {
    name: "Silver",
    buyCost: coin(3),
    effects: [coinsEffect(2)]
  };
  core.cards.push(silver);
  var gold = {
    name: "Gold",
    buyCost: coin(6),
    effects: [coinsEffect(3)]
  };
  core.cards.push(gold);
  var echoRule = {
    name: "Echo",
    replacers: [{
      text: ["Whenever a card with an echo token would move to your hand or discard, trash it instead."],
      simpleText: ["Cards with echo tokens are trashed instead of moving to your hand or discard."],
      kind: "move",
      handles: function(p, state) {
        return state.find(p.card).count("echo") > 0 && (p.toZone == "hand" || p.toZone == "discard");
      },
      replace: function(p) {
        return __assign(__assign({}, p), { toZone: "void" });
      }
    }]
  };
  registerRule(echoRule);
  var shelterRule = {
    name: "Shelter",
    replacers: [{
      text: ["Whenever a card with a shelter token would be trashed, remove a shelter token instead."],
      simpleText: ["Whenever you would trash a card, remove a shelter token instead."],
      kind: "move",
      handles: function(p, state) {
        return state.find(p.card).count("shelter") > 0 && p.fromZone == "play" && p.toZone == "void";
      },
      replace: function(p, state) {
        var card = state.find(p.card);
        return __assign(__assign({}, p), { skip: true, effects: [removeToken(card, "shelter")] });
      }
    }, {
      text: ["Whenever a card with a shelter token would move to your hand, leave it there instead."],
      simpleText: ["Cards with shelter tokens can't move to your hand."],
      kind: "move",
      handles: function(p, state) {
        return state.find(p.card).count("shelter") > 0 && p.toZone == "hand";
      },
      replace: function(p, state) {
        return __assign(__assign({}, p), { skip: true });
      }
    }]
  };
  registerRule(shelterRule);
  var decayRule = {
    name: "Decay",
    triggers: [{
      text: ["Whenever you play a card from your hand, remove a decay token from it. Then if it has no decay tokens, put an echo token on it."],
      simpleText: ["You can only play a card once per decay token on it."],
      kind: "move",
      handles: function(params, state) {
        return state.find(params.card).count("decay") > 0 && params.fromZone == "hand" && params.toZone == "resolving";
      },
      transform: function(params, state) {
        var current = state.find(params.card);
        var shouldEcho = current.count("decay") <= 1;
        return doAll(__spreadArray([
          removeToken(current, "decay", 1)
        ], __read(shouldEcho ? [addToken(current, "echo")] : []), false));
      }
    }]
  };
  registerRule(decayRule);
  var priorityRule = {
    name: "Priority",
    replacers: [playReplacer(["Whenever you would create a card in your discard whose supply has a priority token, instead remove a priority token and set the card aside. Then play it if it is still set aside."], function(p, s, c) {
      return p.zone == "discard" && nameHasToken(p.spec, "priority", s);
    }, function(p, s, c) {
      return applyToTarget(function(t) {
        return removeToken(t, "priority", 1, true);
      }, "Remove a priority token.", function(state) {
        return state.supply.filter(function(t) {
          return t.name == p.spec.name;
        });
      });
    }, ["Whenever you create a card in your discard, remove a priority token from its supply to play it immediately."])]
  };
  registerRule(priorityRule);
  var reflectRule = {
    name: "Reflect",
    triggers: [{
      text: ["After playing a card with a reflect token on it other than with this rule, remove the reflect token and play it again."],
      simpleText: ["When you play a card with a reflect token on it, remove the token to play it again."],
      kind: "afterPlay",
      handles: function(e, state, card) {
        var played = state.find(e.card);
        return played.count("reflect") > 0 && !sourceHasName(e.source, "Reflect");
      },
      transform: function(e, s, card) {
        return doAll([
          removeToken(e.card, "reflect"),
          // Use reflectRule as the source so we can detect rule-triggered plays
          e.card.play(reflectRule)
        ]);
      }
    }]
  };
  registerRule(reflectRule);
  var ferryRule = {
    name: "Ferry",
    replacers: [{
      text: ["Cards cost $1 less to buy per ferry token on them or their supply, but not less than $1."],
      simpleText: ["Cards cost $1 less to buy per ferry token on them, but not less than $1."],
      kind: "cost",
      handles: function(p, state) {
        return p.actionKind == "buy" && countNameTokens(p.card, "ferry", state) > 0;
      },
      replace: function(p, state) {
        return __assign(__assign({}, p), { cost: reducedCost(p.cost, coin(countNameTokens(p.card, "ferry", state)), true) });
      }
    }]
  };
  registerRule(ferryRule);
  var reductionRule = {
    name: "Reduction",
    replacers: [{
      text: ["Cards cost @ less to play for each reduction token on their supply.\n               Whenever this reduces a cost by one or more @,\n               remove that many reduction tokens."],
      simpleText: ["Whenever you play a card with a reduction token on its supply, remove reduction tokens instead of paying @."],
      kind: "cost",
      handles: function(x, state, _rule) {
        return x.actionKind == "play" && nameHasToken(x.card, "reduction", state);
      },
      replace: function(x, state, _rule) {
        var reduction = Math.min(x.cost.energy, countNameTokens(x.card, "reduction", state));
        return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([repeat(applyToTarget(function(target) {
          return removeToken(target, "reduction");
        }, "Remove a reduction token from a supply.", function(state2) {
          return state2.supply.filter(function(c) {
            return c.name == x.card.name && c.count("reduction") > 0;
          });
        }), reduction)]) }) });
      }
    }]
  };
  registerRule(reductionRule);
  var twinRule = {
    name: "Twin",
    triggers: [{
      text: ["After playing a card with a twin token other than with this rule, play it again."],
      simpleText: ["When you play a card with a twin token on it, play it twice instead."],
      kind: "afterPlay",
      handles: function(e, state, card) {
        var played = state.find(e.card);
        return played.count("twin") > 0 && !sourceHasName(e.source, "Twin");
      },
      transform: function(e, s, card) {
        return e.card.play(twinRule);
      }
    }]
  };
  registerRule(twinRule);
  var duplicateRule = {
    name: "Duplicate",
    triggers: [{
      text: ["After buying a card with a duplicate token on it other than with this effect, remove a duplicate token from it to buy it again."],
      kind: "afterBuy",
      handles: function(e, state, card) {
        var target = state.find(e.card);
        return target.count("duplicate") > 0 && !sourceHasName(e.source, "Duplicate");
      },
      transform: function(e, state, card) {
        return payToDo(removeToken(e.card, "duplicate"), e.card.buy(duplicateRule));
      },
      simpleText: ["After buying a card with a duplicate token on it, remove a duplicate token from it to buy it again."]
    }]
  };
  registerRule(duplicateRule);
  function assertNever(x) {
    throw new Error("Unexpected: ".concat(x));
  }
  function countDistinct(xs) {
    var e_57, _a;
    var distinct = /* @__PURE__ */ new Set();
    var result = 0;
    try {
      for (var xs_1 = __values(xs), xs_1_1 = xs_1.next(); !xs_1_1.done; xs_1_1 = xs_1.next()) {
        var x = xs_1_1.value;
        if (!distinct.has(x)) {
          result += 1;
          distinct.add(x);
        }
      }
    } catch (e_57_1) {
      e_57 = { error: e_57_1 };
    } finally {
      try {
        if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
      } finally {
        if (e_57) throw e_57.error;
      }
    }
    return result;
  }
  function countDistinctNames(xs) {
    return countDistinct(xs.map(function(c) {
      return c.name;
    }));
  }
  function showCards(cards) {
    return cards.map(function(card) {
      return renderCardName(card);
    }).join(", ");
  }
  function moveMany(cards, toZone, logged) {
    if (logged === void 0) {
      logged = false;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, doAll(cards.map(function(card) {
                return move(card, toZone, true);
              }))(state)];
            case 1:
              state = _a.sent();
              if (cards.length == 0 || logged) {
                return [2, state];
              } else if (toZone == null) {
                return [2, state.log("Trashed ".concat(showCards(cards)))];
              } else {
                return [2, state.log("Moved ".concat(showCards(cards), " to ").concat(toZone))];
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function trash(card, logged) {
    if (logged === void 0) {
      logged = false;
    }
    return card == null ? noop : move(card, "void", logged);
  }
  function discardFromPlay(card) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          card = state.find(card);
          if (card.place != "play")
            throw new CostNotPaid("Card not in play.");
          return [2, move(card, "discard")(state)];
        });
      });
    };
  }
  function setResource(resource, amount, source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, gainResource(resource, amount - state.resources[resource], source)(state)];
        });
      });
    };
  }
  function gainActions(n, source) {
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, gainResource("actions", n, source)(state)];
        });
      });
    };
  }
  function gainCoins(n, source) {
    return gainResource("coin", n, source);
  }
  function gainBuys(n, source) {
    return gainResource("buys", n, source);
  }
  function payAction(c) {
    return payCost(__assign(__assign({}, free), { actions: 1 }), c);
  }
  function playTwice(card) {
    return applyToTarget(function(target) {
      return doAll([
        target.play(card),
        tick(card),
        target.play(card)
      ]);
    }, "Choose a card to play twice.", function(s) {
      return s.hand;
    });
  }
  function useRefresh() {
    return targetedEffect(function(target, c) {
      return target.use(c);
    }, "Use ".concat(refresh.name, "."), function(state) {
      return state.events.filter(function(c) {
        return c.name == refresh.name;
      });
    });
  }
  function sum(xs, f) {
    return xs.map(f).reduce(function(a2, b) {
      return a2 + b;
    });
  }
  function countNameTokens(card, token, state) {
    return sum(state.supply, function(c) {
      return c.name == card.name ? c.count(token) : 0;
    });
  }
  function nameHasToken(card, token, state) {
    return state.supply.some(function(s) {
      return s.name == card.name && s.count(token) > 0;
    });
  }
  function costPer(increment) {
    var extraStr = "".concat(renderCost(increment, true), " for each cost token on this.");
    return {
      calculate: function(card, state) {
        return multiplyCosts(increment, state.find(card).count("cost"));
      },
      text: [extraStr]
    };
  }
  function incrementCost() {
    return {
      text: ["Put a cost token on this."],
      simpleText: ["This costs $1 more each time you use it."],
      transform: function(s, c) {
        return addToken(c, "cost");
      }
    };
  }
  function incrementMap(m, k, n) {
    m.set(k, (m.get(k) || 0) + n);
  }
  function startsWithCharge(name, n, hideSimple) {
    if (hideSimple === void 0) {
      hideSimple = false;
    }
    return {
      text: ["Each ".concat(name, " is created with ").concat(aOrNum(n, "charge token"), " on it.")],
      simpleText: hideSimple ? [] : ["X starts at ".concat(n, ".")],
      kind: "create",
      handles: function(p) {
        return p.spec.name == name;
      },
      replace: function(p) {
        var tokens = p.tokens || /* @__PURE__ */ new Map();
        incrementMap(tokens, "charge", n);
        return __assign(__assign({}, p), { tokens });
      }
    };
  }
  function createInPlayEffect(spec, n, simpleText) {
    if (n === void 0) {
      n = 1;
    }
    return {
      text: ["Create ".concat(aOrNum(n, spec.name), " in play.")],
      simpleText,
      transform: function() {
        return repeat(create(spec, "play", function(c) {
          return noop;
        }, /* @__PURE__ */ new Map()), n);
      }
    };
  }
  function startInPlay(cardName) {
    return {
      kind: "create",
      text: ["When you would create ".concat(a(cardName), " in your discard, instead create it in play.")],
      simpleText: ["".concat(cardName, " is created in play.")],
      handles: function(p) {
        return p.spec.name == cardName;
      },
      replace: function(p) {
        return __assign(__assign({}, p), { zone: "play" });
      }
    };
  }
  var cannotUse = {
    text: void 0,
    test: function(c, s, k) {
      return k == "use";
    }
  };
  function sortHand(state) {
    return state.sortZone("hand");
  }
  function recycleEffect() {
    return {
      text: ["Put your discard into your hand."],
      transform: function(state) {
        return doAll([moveMany(state.discard, "hand"), sortHand]);
      }
    };
  }
  function workshopEffect(n, except) {
    return targetedEffect(function(target, card) {
      return target.buy(card);
    }, "Buy a card in the supply costing up to $".concat(n, " not named ").concat(except, "."), function(state) {
      return state.supply.filter(function(x) {
        return leq(x.cost("buy", state), coin(n)) && x.name != except && canCreate(x.spec, state);
      });
    });
  }
  function coinsEffect(n) {
    return {
      text: ["+$".concat(n, ".")],
      transform: function(s, c) {
        return gainCoins(n, c);
      }
    };
  }
  function pointsEffect(n) {
    return {
      text: ["+".concat(n, " vp.")],
      transform: function(s, c) {
        return gainPoints(n, c);
      }
    };
  }
  function actionsEffect(n) {
    return {
      text: ["+".concat(num(n, "action"), ".")],
      transform: function(s, c) {
        return gainActions(n, c);
      }
    };
  }
  function buysEffect(n) {
    return {
      text: ["+".concat(num(n, "buy"), ".")],
      transform: function(state, card) {
        return gainBuys(n, card);
      }
    };
  }
  function buyEffect() {
    return buysEffect(1);
  }
  function chargeEffect(n, simpleText) {
    if (n === void 0) {
      n = 1;
    }
    if (simpleText === void 0) {
      simpleText = true;
    }
    return {
      text: ["Put ".concat(aOrNum(n, "charge token"), " on this.")],
      simpleText: simpleText ? ["Increase X by ".concat(n, ".")] : [],
      transform: function(s, card) {
        return charge(card, n);
      }
    };
  }
  function trashOnLeavePlay(hideWhenSimple) {
    if (hideWhenSimple === void 0) {
      hideWhenSimple = true;
    }
    return {
      text: ["Whenever this would leave play, trash it."],
      simpleText: hideWhenSimple ? [] : void 0,
      kind: "move",
      handles: function(x, state, card) {
        return x.card.id == card.id && x.fromZone == "play";
      },
      replace: function(x) {
        return __assign(__assign({}, x), { toZone: "void" });
      }
    };
  }
  var horse = {
    name: "Horse",
    buyCost: coin(1),
    effects: [actionsEffect(2), trashThis()]
  };
  var villager = {
    name: "Villager",
    replacers: [{
      text: ["Cards cost @ less to play. Whenever this reduces a cost, trash it."],
      simpleText: ["Whenever you would pay @ for a card, trash this instead."],
      kind: "cost",
      handles: function(x) {
        return x.actionKind == "play";
      },
      replace: function(x, state, card) {
        if (x.cost.energy > 0) {
          return __assign(__assign({}, x), { cost: __assign(__assign({}, x.cost), { energy: x.cost.energy - 1, effects: x.cost.effects.concat([trash(card)]) }) });
        } else {
          return x;
        }
      }
    }, trashOnLeavePlay()]
  };
  var bounty = {
    name: "Bounty",
    triggers: [{
      text: ["Whenever you buy a card, trash this to buy the card again."],
      simpleText: ["The next time you buy a card, buy it again."],
      kind: "buy",
      handles: function(e, state, card) {
        return state.find(card).place == "play";
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, trash(card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [2, e.card.buy(card)(state2)];
              }
            });
          });
        };
      }
    }],
    replacers: [trashOnLeavePlay()]
  };
  function playReplacer(text, condition, cost, simpleText) {
    return {
      kind: "create",
      text,
      handles: function(p, s, source) {
        return p.zone == "discard" && condition(p, s, source);
      },
      replace: function(p, s, source) {
        return __assign(__assign({}, p), { zone: "void", effects: p.effects.concat([
          function() {
            return cost(p, s, source);
          },
          function(t) {
            return function(state) {
              return __awaiter(this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      t = state.find(t);
                      if (!(t.place == "void")) return [3, 2];
                      return [4, t.play(source)(state)];
                    case 1:
                      state = _a.sent();
                      _a.label = 2;
                    case 2:
                      return [2, state];
                  }
                });
              });
            };
          }
        ]) });
      },
      simpleText
    };
  }
  var fair = {
    name: "Fair",
    replacers: [{
      text: ["Whenever you would create a card in your discard,\n        instead create the card in your hand and trash this."],
      simpleText: ["The next time you create a card in your discard, put it in your hand."],
      kind: "create",
      handles: function(e, state, card) {
        return e.zone == "discard" && state.find(card).place == "play";
      },
      replace: function(x, state, card) {
        return __assign(__assign({}, x), { zone: "hand", effects: x.effects.concat(function() {
          return trash(card);
        }) });
      }
    }, trashOnLeavePlay()]
  };
  function costReduceDescriptor(kind, reduction, nonzero) {
    var d = renderCost(reduction, true);
    var s = nonzero ? " but not zero" : "";
    switch (kind) {
      case "play":
        return "Cards cost ".concat(d, " less to play").concat(s, ".");
      case "buy":
        return "Cards cost ".concat(d, " less to buy").concat(s, ".");
      case "use":
        return "Events cost ".concat(d, " less to use").concat(s, ".");
      case "activate":
        return "Abilities cost ".concat(d, " less to use").concat(s, ".");
      case "potion":
        return "Potions cost ".concat(d, " less to use").concat(s, ".");
      default:
        return assertNever(kind);
    }
  }
  function reducedCost(cost, reduction, nonzero) {
    if (nonzero === void 0) {
      nonzero = false;
    }
    var newCost = subtractCost(cost, reduction);
    if (nonzero && leq(newCost, free) && !leq(cost, free)) {
      if ((reduction.coin || 0) > 0) {
        newCost = addCosts(newCost, { coin: 1 });
      } else if ((reduction.energy || 0) > 0) {
        newCost = addCosts(newCost, { energy: 1 });
      }
    }
    return newCost;
  }
  function costReduce(kind, reduction, nonzero) {
    if (nonzero === void 0) {
      nonzero = false;
    }
    return {
      text: [costReduceDescriptor(kind, reduction, nonzero)],
      kind: "cost",
      handles: function(x) {
        return x.actionKind == kind;
      },
      replace: function(x, state) {
        var newCost = reducedCost(x.cost, reduction, nonzero);
        return __assign(__assign({}, x), { cost: newCost });
      }
    };
  }
  function applyToTarget(f, text, options, special) {
    if (special === void 0) {
      special = {};
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var choices, target;
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              choices = options(state).map(asChoice);
              if (special.optional !== void 0)
                choices = allowNull(choices, special.optional);
              return [4, choice(state, text, choices, ["applyToTarget"])];
            case 1:
              _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
              if (!(target != null)) return [3, 3];
              return [4, f(target)(state)];
            case 2:
              state = _b.sent();
              _b.label = 3;
            case 3:
              if (target == null && special.cost == true)
                throw new CostNotPaid("No valid targets");
              return [2, state];
          }
        });
      });
    };
  }
  function targetedEffect(f, text, options, simpleText) {
    return {
      text: [text],
      transform: function(s, c) {
        return applyToTarget(function(target) {
          return f(target, c);
        }, text, options);
      },
      simpleText
    };
  }
  function multitargetedEffect(f, text, options, max) {
    if (max === void 0) {
      max = null;
    }
    return {
      text: [text],
      transform: function(s, c) {
        return function(state) {
          return __awaiter(this, void 0, void 0, function() {
            var cards;
            var _a;
            return __generator(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, text, options(state, c).map(asChoice), max)];
                case 1:
                  _a = __read.apply(void 0, [_b.sent(), 2]), state = _a[0], cards = _a[1];
                  return [4, f(cards, c)(state)];
                case 2:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    };
  }
  function createEffect(spec, zone, n) {
    if (zone === void 0) {
      zone = "discard";
    }
    if (n === void 0) {
      n = 1;
    }
    var zoneText = zone == "play" ? "play" : "your ".concat(zone);
    return {
      text: ["Create ".concat(aOrNum(n, spec.name), " in ").concat(zoneText, ".")],
      transform: function() {
        return repeat(create(spec, zone), n);
      }
    };
  }
  function buyTrigger(effect) {
    return {
      kind: "buy",
      handles: function(e, s, c) {
        return e.card.id == c.id;
      },
      transform: function(e, s, c) {
        return effect.transform(s, c);
      },
      text: ["When you buy this, ".concat(effect.text.map(lowercaseFirst).join("; then "))]
    };
  }
  function afterBuyTrigger(effect) {
    return {
      kind: "afterBuy",
      handles: function(e, s, c) {
        return e.card.id == c.id;
      },
      transform: function(e, s, c) {
        return effect.transform(s, c);
      },
      text: ["After buying this, ".concat(effect.text.map(lowercaseFirst).join("; then "))]
    };
  }
  function energy(n) {
    return __assign(__assign({}, free), { energy: n });
  }
  function coin(n) {
    return __assign(__assign({}, free), { coin: n });
  }
  function trashThis() {
    return {
      text: ["Trash this."],
      transform: function(s, c) {
        return trash(c);
      }
    };
  }
  var cardRewards = [];
  var eventRewards = [];
  var potionRewards = [];
  var relicRewards = [];
  var boons = [];
  var vpModes = [];

  // public/registry.js
  var __values2 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read2 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray2 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var extraSpecsByName = /* @__PURE__ */ new Map();
  function registerSpec(spec) {
    extraSpecsByName.set(spec.name, spec);
  }
  function registerRelicSpec(spec) {
    spec.isRelic = true;
    registerSpec(spec);
  }
  function addRelicReward(spec) {
    spec.isRelic = true;
    relicRewards.push(spec);
  }
  function getSpecByName(name) {
    var e_1, _a;
    var _b;
    if (extraSpecsByName.has(name))
      return extraSpecsByName.get(name);
    var byName = /* @__PURE__ */ new Map();
    try {
      for (var _c = __values2(allKnownSpecs()), _d = _c.next(); !_d.done; _d = _c.next()) {
        var spec = _d.value;
        if (!byName.has(spec.name))
          byName.set(spec.name, spec);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return (_b = byName.get(name)) !== null && _b !== void 0 ? _b : null;
  }
  function allKnownSpecs() {
    return __spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2(__spreadArray2([], __read2(cardRewards), false), __read2(eventRewards), false), __read2(potionRewards), false), __read2(relicRewards), false), __read2(core.cards), false), __read2(core.events), false), __read2(vpModes.flatMap(function(vpMode) {
      return __spreadArray2(__spreadArray2([], __read2(vpMode.cards), false), __read2(vpMode.events), false);
    })), false), __read2(boons.flatMap(function(boon) {
      return __spreadArray2(__spreadArray2([], __read2(boon.cards), false), __read2(boon.events), false);
    })), false), __read2(extraSpecsByName.values()), false);
  }

  // public/rng.js
  var __read3 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  function randomString() {
    var result = "";
    for (var i = 0; i < 8; i++) {
      var idx = Math.floor(Math.random() * ALPHANUM.length);
      result += ALPHANUM[idx];
    }
    return result;
  }
  var Generator = (
    /** @class */
    (function() {
      function Generator2(seedString, state) {
        if (state === void 0) {
          state = null;
        }
        this.state = state === null ? makeSeedFromString(seedString) : state;
      }
      Generator2.fromState = function(state) {
        return new Generator2("A", state);
      };
      Generator2.prototype.exportState = function() {
        return this.state;
      };
      Generator2.prototype.next = function() {
        this.state |= 0;
        this.state = this.state + 1831565813 | 0;
        var t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
      Generator2.prototype.newGenerator = function() {
        var result = "";
        for (var i = 0; i < 8; i++) {
          var idx = Math.floor(this.next() * ALPHANUM.length);
          result += ALPHANUM[idx];
        }
        return new Generator2(result);
      };
      Generator2.prototype.permute = function(list) {
        var _a;
        var result = list.slice();
        for (var i = result.length - 1; i > 0; i--) {
          var j = Math.floor(this.next() * (i + 1));
          _a = __read3([result[j], result[i]], 2), result[i] = _a[0], result[j] = _a[1];
        }
        return result;
      };
      Generator2.prototype.samples = function(list, k, excludes) {
        if (excludes === void 0) {
          excludes = [];
        }
        if (k == 0)
          return [];
        var arr = this.permute(list);
        var result = [];
        var _loop_1 = function(i2) {
          var candidate = arr[i2];
          if (excludes.every(function(t) {
            return t !== candidate;
          })) {
            result.push(candidate);
          }
          if (result.length >= k) {
            return { value: result };
          }
        };
        for (var i = 0; i < list.length; i++) {
          var state_1 = _loop_1(i);
          if (typeof state_1 === "object")
            return state_1.value;
        }
        console.log("Ran out of items!");
        return result;
      };
      Generator2.prototype.sample = function(list, excludes) {
        if (excludes === void 0) {
          excludes = [];
        }
        return this.samples(list, 1, excludes)[0];
      };
      return Generator2;
    })()
  );
  function makeSeedFromString(s) {
    var str = normalizeSeedString(s);
    var hash = 2166136261;
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function normalizeSeedString(s) {
    return s.toUpperCase();
  }

  // public/cardRendering.js
  var __values3 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read4 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray3 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function isZero(c) {
    return c === void 0 || renderCost(c) === "";
  }
  function actionCostKindForSpec(spec) {
    return spec.buyCost === void 0 ? "use" : "play";
  }
  function asMetaTextSpec(spec) {
    return spec;
  }
  function isRelicSpec(spec) {
    return spec.isRelic === true;
  }
  function renderEffects(spec) {
    var e_1, _a;
    var parts = [];
    try {
      for (var _b = __values3(cardSpecEffects(spec)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray3([], __read4(effect.text), false));
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return parts.map(function(x) {
      return "<div>".concat(x, "</div>");
    }).join("");
  }
  function renderLines(lines, prefix) {
    if (prefix === void 0) {
      prefix = null;
    }
    if (prefix === null)
      return lines.map(function(line) {
        return "<div>".concat(line, "</div>");
      }).join("");
    return lines.map(function(line) {
      return "<div>".concat(prefix, " ").concat(line, "</div>");
    }).join("");
  }
  function renderAbility(spec, plain) {
    var e_2, _a;
    var parts = [];
    try {
      for (var _b = __values3(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray3([], __read4(effect.text.map(function(x) {
          return plain ? "<div>".concat(x, "</div>") : "<div>(ability) ".concat(x, "</div>");
        })), false));
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    return parts.join("");
  }
  function renderTrigger(x, staticTrigger, plain) {
    if (plain)
      return renderLines(x.text);
    var desc = staticTrigger ? "(static)" : "(effect)";
    return renderLines(x.text, desc);
  }
  function renderVariableCosts(cs, plain) {
    var e_3, _a, e_4, _b;
    var parts = [];
    try {
      for (var cs_1 = __values3(cs), cs_1_1 = cs_1.next(); !cs_1_1.done; cs_1_1 = cs_1.next()) {
        var variableCost = cs_1_1.value;
        try {
          for (var _c = (e_4 = void 0, __values3(variableCost.text)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var line = _d.value;
            parts.push(plain ? "<div>+".concat(line, "</div>") : "<div>(cost) +".concat(line, "</div>"));
          }
        } catch (e_4_1) {
          e_4 = { error: e_4_1 };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_4) throw e_4.error;
          }
        }
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (cs_1_1 && !cs_1_1.done && (_a = cs_1.return)) _a.call(cs_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    return parts.join("");
  }
  function renderBuyable(bs, plain) {
    var e_5, _a, e_6, _b;
    var parts = [];
    try {
      for (var bs_1 = __values3(bs), bs_1_1 = bs_1.next(); !bs_1_1.done; bs_1_1 = bs_1.next()) {
        var restriction = bs_1_1.value;
        if (restriction.text === void 0)
          continue;
        try {
          for (var _c = (e_6 = void 0, __values3(restriction.text)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var line = _d.value;
            parts.push(plain ? "<div>".concat(line, "</div>") : "<div>(req) ".concat(line, "</div>"));
          }
        } catch (e_6_1) {
          e_6 = { error: e_6_1 };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_6) throw e_6.error;
          }
        }
      }
    } catch (e_5_1) {
      e_5 = { error: e_5_1 };
    } finally {
      try {
        if (bs_1_1 && !bs_1_1.done && (_a = bs_1.return)) _a.call(bs_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }
    return parts.join("");
  }
  function renderRuleText(rule, plain) {
    var e_7, _a, e_8, _b;
    var parts = [];
    try {
      for (var _c = __values3(rule.triggers || []), _d = _c.next(); !_d.done; _d = _c.next()) {
        var trigger3 = _d.value;
        parts.push(plain ? renderLines(trigger3.text) : renderLines(trigger3.text, "(rule)"));
      }
    } catch (e_7_1) {
      e_7 = { error: e_7_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_7) throw e_7.error;
      }
    }
    try {
      for (var _e = __values3(rule.replacers || []), _f = _e.next(); !_f.done; _f = _e.next()) {
        var replacer = _f.value;
        parts.push(plain ? renderLines(replacer.text) : renderLines(replacer.text, "(rule)"));
      }
    } catch (e_8_1) {
      e_8 = { error: e_8_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_8) throw e_8.error;
      }
    }
    return parts.join("");
  }
  function renderMetaText(spec, plain) {
    var e_9, _a, e_10, _b;
    var x = asMetaTextSpec(spec);
    var parts = [];
    try {
      for (var _c = __values3(x.metaReplacers || []), _d = _c.next(); !_d.done; _d = _c.next()) {
        var replacer = _d.value;
        parts.push(plain ? renderLines(replacer.text) : renderLines(replacer.text, "(meta)"));
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    try {
      for (var _e = __values3(x.metaTriggers || []), _f = _e.next(); !_f.done; _f = _e.next()) {
        var trigger3 = _f.value;
        parts.push(plain ? renderLines(trigger3.text) : renderLines(trigger3.text, "(meta)"));
      }
    } catch (e_10_1) {
      e_10 = { error: e_10_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_10) throw e_10.error;
      }
    }
    return parts.join("");
  }
  function cardText(spec) {
    var plain = isRelicSpec(spec);
    var effectHtml = renderEffects(spec);
    var buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions, plain) : "";
    var costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts, plain) : "";
    var abilitiesHtml = renderAbility(spec, plain);
    var triggerHtml = cardSpecTriggers(spec).map(function(x) {
      return renderTrigger(x, false, plain);
    }).join("");
    var replacerHtml = cardSpecReplacers(spec).map(function(x) {
      return renderTrigger(x, false, plain);
    }).join("");
    var staticTriggerHtml = cardSpecStaticTriggers(spec).map(function(x) {
      return renderTrigger(x, true, plain);
    }).join("");
    var staticReplacerHtml = cardSpecStaticReplacers(spec).map(function(x) {
      return renderTrigger(x, true, plain);
    }).join("");
    var rulesHtml = cardSpecRules(spec).map(function(rule) {
      return renderRuleText(rule, plain);
    }).join("");
    var metaHtml = renderMetaText(spec, plain);
    return [
      buyableHtml,
      costHtml,
      effectHtml,
      abilitiesHtml,
      triggerHtml,
      replacerHtml,
      staticTriggerHtml,
      staticReplacerHtml,
      rulesHtml,
      metaHtml
    ].join("");
  }
  function renderSpecSimpleBody(spec) {
    return cardSpecSimpleLines(spec).map(function(line) {
      return "<div>".concat(line, "</div>");
    }).join("");
  }
  function buildSimpleTooltipForSingleSpec(spec) {
    var buyCost = cardSpecCost(spec, "buy");
    var actionCost = cardSpecCost(spec, actionCostKindForSpec(spec));
    var buyStr = !isZero(buyCost) ? "(".concat(renderCost(buyCost), ")") : "---";
    var costStr = !isZero(actionCost) ? "(".concat(renderCost(actionCost), ")") : "---";
    var header = "<div>---".concat(buyStr, " ").concat(displayName(spec), " ").concat(costStr, "---</div>");
    var body = renderSpecSimpleBody(spec);
    return "".concat(header).concat(body);
  }
  function buildSpecTooltipFull(spec) {
    var buyCost = cardSpecCost(spec, "buy");
    var actionCost = cardSpecCost(spec, actionCostKindForSpec(spec));
    var buyStr = !isZero(buyCost) ? "(".concat(renderCost(buyCost), ")") : "---";
    var costStr = !isZero(actionCost) ? "(".concat(renderCost(actionCost), ")") : "---";
    var header = "<div>---".concat(buyStr, " ").concat(displayName(spec), " ").concat(costStr, "---</div>");
    var baseFilling = header + cardText(spec);
    var relatedCards = spec.relatedCards || [];
    var relatedFilling = relatedCards.map(function(r) {
      return buildSpecTooltip(r);
    }).join("");
    return "".concat(baseFilling).concat(relatedFilling);
  }
  function buildSpecTooltipSimple(spec) {
    var mine = buildSimpleTooltipForSingleSpec(spec);
    var related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join("");
    return "".concat(mine).concat(related);
  }
  function buildSpecTooltipOnlyRelatedSimple(spec) {
    var rules2 = cardSpecRules(spec).map(function(rule) {
      return renderRuleText(rule, false);
    }).join("");
    var related = (spec.relatedCards || []).map(buildSimpleTooltipForSingleSpec).join("");
    return "".concat(rules2).concat(related);
  }
  function renderSpecNoRelated(spec, tooltipMode) {
    if (tooltipMode === void 0) {
      tooltipMode = "default";
    }
    var buyCost = cardSpecCost(spec, "buy");
    var actionCost = cardSpecCost(spec, actionCostKindForSpec(spec));
    var buyText = isZero(buyCost) ? "" : "(".concat(renderCost(buyCost), ")&nbsp;");
    var costText = isZero(actionCost) ? "" : "&nbsp;(".concat(renderCost(actionCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(displayName(spec), "</strong>").concat(costText, "</div>");
    var displayText = renderSpecSimpleBody(spec);
    var hasRelatedCards = (spec.relatedCards || []).length > 0;
    if (tooltipMode === "onlyRelated" && hasRelatedCards) {
      var tooltipSimple = buildSpecTooltipOnlyRelatedSimple(spec);
      var tooltipFull = buildSpecTooltipFull(spec);
      return "<div class='spec has-related-only'>".concat(header).concat(displayText, "<span class='tooltip tooltip-simple'>").concat(tooltipSimple, "</span><span class='tooltip tooltip-full'>").concat(tooltipFull, "</span></div>");
    }
    if (hasRelatedCards) {
      var tooltipSimple = buildSpecTooltipSimple(spec);
      var tooltipFull = buildSpecTooltipFull(spec);
      return "<div class='spec has-related'>".concat(header).concat(displayText, "<span class='tooltip tooltip-simple'>").concat(tooltipSimple, "</span><span class='tooltip tooltip-full'>").concat(tooltipFull, "</span></div>");
    }
    if (tooltipMode === "onlyRelated") {
      return "<div class='spec'>".concat(header).concat(displayText, "</div>");
    }
    var tooltipHtml = buildSpecTooltipFull(spec);
    return "<div class='spec'>".concat(header).concat(displayText, "<span class='tooltip'>").concat(tooltipHtml, "</span></div>");
  }
  function buildSpecTooltip(spec) {
    return buildSpecTooltipFull(spec);
  }

  // public/data/specialSpecs.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator2 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read5 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray4 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function makeCardInABoxRelic(spec) {
    var cardName = displayName(spec);
    return {
      name: "Boxed ".concat(cardName),
      isRelic: true,
      simpleText: [
        "At the start of the game, create a copy of ".concat(cardName, " in your hand."),
        "Trash this."
      ],
      triggers: [{
        kind: "beforeStart",
        text: ["At the start of the game, create a copy of ".concat(cardName, " in your hand, then trash this.")],
        handles: function(_e, _s, sourceCard) {
          return sourceCard !== null;
        },
        transform: function(_e, _s, sourceCard) {
          return function(state) {
            return __awaiter2(this, void 0, void 0, function() {
              return __generator2(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, create(spec, "hand")(state)];
                  case 1:
                    state = _a.sent();
                    return [4, trash(sourceCard)(state)];
                  case 2:
                    state = _a.sent();
                    return [2, state];
                }
              });
            });
          };
        }
      }],
      relatedCards: [spec],
      persistence: {
        kind: "cardInABoxRelic"
      }
    };
  }
  function makeBottledCardPotion(spec) {
    var cardName = displayName(spec);
    return {
      name: "Bottled ".concat(cardName),
      isPotion: true,
      simpleText: ["Create a copy of ".concat(cardName, " in your hand.")],
      relatedCards: [spec],
      persistence: {
        kind: "bottledCardPotion"
      },
      effects: [{
        text: ["Create a copy of ".concat(cardName, " in your hand.")],
        transform: function() {
          return create(spec, "hand");
        }
      }]
    };
  }
  function makeBottledEventPotion(spec) {
    var cardName = displayName(spec);
    var baseName = spec.name;
    var copiedEffects = cardSpecEffects(spec);
    var copiedText = copiedEffects.flatMap(function(effect) {
      return effect.text;
    });
    var effects = [{
      text: copiedText.length > 0 ? copiedText : ["Use ".concat(cardName, ".")],
      transform: function(_state, sourceCard) {
        return function(state) {
          return __awaiter2(this, void 0, void 0, function() {
            var target;
            return __generator2(this, function(_a) {
              target = state.events.find(function(event) {
                return event.name === baseName;
              });
              if (!target) {
                return [2, state];
              }
              return [2, target.use(sourceCard)(state)];
            });
          });
        };
      }
    }];
    return {
      name: "Bottled ".concat(cardName),
      isPotion: true,
      simpleText: ["Use ".concat(cardName, ".")],
      relatedCards: [spec],
      rules: (function() {
        var rules2 = cardSpecRules(spec);
        return rules2.length > 0 ? __spreadArray4([], __read5(rules2), false) : void 0;
      })(),
      persistence: {
        kind: "bottledEventPotion"
      },
      effects
    };
  }

  // public/data/curses.js
  var __assign2 = function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator3 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values4 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read6 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray5 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var minorCursePool = [];
  var majorCursePool = [];
  function variant(minor, major, isMajor) {
    return isMajor ? major : minor;
  }
  function curseName(base, isMajor) {
    return isMajor ? "".concat(base, " (Major)") : base;
  }
  function registerCursePair(minor, major) {
    var e_1, _a, e_2, _b;
    minorCursePool.push(minor);
    majorCursePool.push(major);
    try {
      for (var _c = __values4(minor.events), _d = _c.next(); !_d.done; _d = _c.next()) {
        var event_1 = _d.value;
        registerSpec(event_1);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    try {
      for (var _e = __values4(major.events), _f = _e.next(); !_f.done; _f = _e.next()) {
        var event_2 = _f.value;
        registerSpec(event_2);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  }
  function registerMirroredCurse(factory2) {
    registerCursePair(factory2(false), factory2(true));
  }
  function allMinorCurses() {
    return __spreadArray5([], __read6(minorCursePool), false);
  }
  function allMajorCurses() {
    return __spreadArray5([], __read6(majorCursePool), false);
  }
  registerMirroredCurse(function(isMajor) {
    var decayTokens = variant(3, 2, isMajor);
    return {
      name: curseName("Decay", isMajor),
      events: [{
        name: curseName("Decay", isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
          kind: "create",
          text: ["If a card would be created without decay tokens or with more than ".concat(decayTokens, " decay tokens, instead create it with ").concat(decayTokens, " decay tokens.")],
          simpleText: ["Cards are created with ".concat(decayTokens, " decay tokens.")],
          handles: function() {
            return true;
          },
          replace: function(params) {
            var tokens = new Map(params.tokens || []);
            var currentDecay = tokens.get("decay") || 0;
            if (currentDecay === 0 || currentDecay > decayTokens) {
              tokens.set("decay", decayTokens);
            }
            return __assign2(__assign2({}, params), { tokens });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(isMajor) {
    var maxActionsFromRefresh = variant(3, 1, isMajor);
    return {
      name: curseName("Squeeze", isMajor),
      events: [{
        name: curseName("Squeeze", isMajor),
        fixedCost: energy(1),
        effects: [actionsEffect(1)],
        staticReplacers: [{
          kind: "resource",
          text: ["Whenever you would gain actions from ".concat(refresh.name, ", gain at most ").concat(maxActionsFromRefresh, ".")],
          simpleText: ["You gain at most ".concat(maxActionsFromRefresh, " actions from ").concat(refresh.name, ".")],
          handles: function(params) {
            return params.resource === "actions" && params.amount > 0 && params.source instanceof Card && params.source.name === refresh.name;
          },
          replace: function(params) {
            return __assign2(__assign2({}, params), { amount: Math.min(params.amount, maxActionsFromRefresh) });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(_isMajor) {
    var inflationCostPerToken = 1;
    return {
      name: curseName("Inflation", _isMajor),
      events: [{
        name: curseName("Inflation", _isMajor),
        restrictions: [cannotUse],
        staticTriggers: [{
          kind: "create",
          text: ["Whenever you create a card, put an inflation token on its supply."],
          simpleText: ["Whenever you create a card, put an inflation token on it."],
          handles: function() {
            return true;
          },
          transform: function(e) {
            return function(state) {
              return __awaiter3(void 0, void 0, void 0, function() {
                return __generator3(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      return [4, doAll(state.supply.filter(function(card) {
                        return card.name === e.card.name;
                      }).map(function(card) {
                        return addToken(card, "inflation", 1);
                      }))(state)];
                    case 1:
                      return [2, _a.sent()];
                  }
                });
              });
            };
          }
        }],
        staticReplacers: [{
          kind: "cost",
          text: ["Cards cost $".concat(inflationCostPerToken, " more to buy for each inflation token on them or their supply.")],
          simpleText: ["Cards cost $".concat(inflationCostPerToken, " more to buy for each inflation token on them.")],
          handles: function(params, state) {
            return params.actionKind === "buy" && countNameTokens(params.card, "inflation", state) > 0;
          },
          replace: function(params, state) {
            return __assign2(__assign2({}, params), { cost: addCosts(params.cost, {
              coin: inflationCostPerToken * countNameTokens(params.card, "inflation", state)
            }) });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(isMajor) {
    var removeCount = variant(2, 1, isMajor);
    return {
      name: curseName("Encumber", isMajor),
      events: [{
        name: curseName("Encumber", isMajor),
        fixedCost: energy(1),
        effects: [{
          text: ["Remove ".concat(removeCount, " encumber tokens from each card in the supply.")],
          transform: function(state) {
            return doAll(state.supply.map(function(card) {
              return removeToken(card, "encumber", removeCount);
            }));
          }
        }],
        staticTriggers: [{
          kind: "create",
          text: ["Whenever you create a card, put an encumber token on its supply."],
          handles: function() {
            return true;
          },
          transform: function(e) {
            return function(state) {
              return __awaiter3(void 0, void 0, void 0, function() {
                return __generator3(this, function(_a) {
                  switch (_a.label) {
                    case 0:
                      return [4, doAll(state.supply.filter(function(card) {
                        return card.name === e.card.name;
                      }).map(function(card) {
                        return addToken(card, "encumber", 1);
                      }))(state)];
                    case 1:
                      return [2, _a.sent()];
                  }
                });
              });
            };
          }
        }],
        staticReplacers: [{
          kind: "canCreate",
          text: ["You can't create cards whose supply has 2 encumber tokens."],
          handles: function(params, state) {
            return params.canCreate && countNameTokens(params.spec, "encumber", state) >= 2;
          },
          replace: function(params) {
            return __assign2(__assign2({}, params), { canCreate: false });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(isMajor) {
    var removeCost = variant(2, 4, isMajor);
    return {
      name: curseName("Mire", isMajor),
      events: [{
        name: curseName("Mire", isMajor),
        fixedCost: energy(removeCost),
        effects: [{
          text: ["Remove all mire tokens from cards in your discard."],
          transform: function(state) {
            return doAll(state.discard.map(function(card) {
              return removeToken(card, "mire", "all");
            }));
          }
        }],
        staticTriggers: [{
          kind: "move",
          text: ["When you put a card in your discard or play, put a mire token on it."],
          handles: function(event) {
            return event.toZone === "discard" || event.toZone === "play";
          },
          transform: function(event) {
            return addToken(event.card, "mire");
          }
        }],
        staticReplacers: [{
          kind: "move",
          text: ["When a card with a mire token would move to your hand, instead leave it where it is."],
          handles: function(params, state) {
            return params.toZone === "hand" && state.find(params.card).count("mire") > 0;
          },
          replace: function(params) {
            return __assign2(__assign2({}, params), { skip: true });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(isMajor) {
    var overheadFlat = variant(1, 0, isMajor);
    return {
      name: curseName("Overhead", isMajor),
      events: [{
        name: curseName("Overhead", isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
          kind: "costIncrease",
          text: isMajor ? ["Cards cost 50% more $ (rounded up)."] : ["Cards other than ".concat(copper.name, " cost $1 more.")],
          handles: function(params) {
            return params.actionKind === "buy" && (isMajor || params.card.name !== copper.name) && params.cost.coin > 0;
          },
          replace: function(params) {
            var extraCoin = isMajor ? Math.ceil(params.cost.coin * 0.5) : overheadFlat;
            return __assign2(__assign2({}, params), { cost: addCosts(params.cost, coin(extraCoin)) });
          }
        }]
      }]
    };
  });
  registerMirroredCurse(function(isMajor) {
    var vpMultiplier = variant(2, 4, isMajor);
    return {
      name: curseName("Slog", isMajor),
      events: [{
        name: curseName("Slog", isMajor),
        restrictions: [cannotUse],
        staticReplacers: [{
          kind: "victory",
          text: ["The vp target is ".concat(vpMultiplier, "x higher.")],
          handles: function() {
            return false;
          },
          replace: function(params) {
            return params;
          }
        }]
      }],
      vpTargetMultiplier: vpMultiplier
    };
  });
  registerMirroredCurse(function(isMajor) {
    var freePlays = variant(1, 2, isMajor);
    return {
      name: curseName("Inefficiency", isMajor),
      events: [{
        name: curseName("Inefficiency", isMajor),
        restrictions: [cannotUse],
        simpleText: ["After the first ".concat(freePlays, " plays, cards other than ").concat(copper.name, " cost $1 to play.")],
        staticReplacers: [{
          kind: "create",
          text: ["Whenever you create a card other than ".concat(copper.name, ", put ").concat(freePlays, " efficiency tokens on it.")],
          handles: function(params) {
            return params.spec.name !== copper.name && ["play", "discard", "hand", null].includes(params.zone);
          },
          replace: function(params) {
            var tokens = new Map(params.tokens || []);
            incrementMap(tokens, "efficiency", freePlays);
            return __assign2(__assign2({}, params), { tokens });
          }
        }, {
          kind: "costIncrease",
          text: ["Cards other than ".concat(copper.name, " cost $1 more to play if they have no efficiency tokens.")],
          handles: function(params, state) {
            return params.actionKind === "play" && params.card.name !== copper.name && state.find(params.card).count("efficiency") === 0;
          },
          replace: function(params) {
            return __assign2(__assign2({}, params), { cost: addCosts(params.cost, coin(1)) });
          }
        }],
        staticTriggers: [{
          kind: "play",
          text: ["When you play a card other than ".concat(copper.name, " the normal way, remove an efficiency token from it.")],
          handles: function(event) {
            return event.source === "act" && event.card.name !== copper.name && event.card.count("efficiency") > 0;
          },
          transform: function(event) {
            return removeToken(event.card, "efficiency", 1);
          }
        }]
      }]
    };
  });

  // public/metaLogic.js
  var __extends2 = /* @__PURE__ */ (function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var __assign3 = function() {
    __assign3 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign3.apply(this, arguments);
  };
  var __awaiter4 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator4 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read7 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray6 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var __values5 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var extraOptionRegistry = /* @__PURE__ */ new Map();
  var extraOptionSelectionRegistry = /* @__PURE__ */ new Map();
  function registerExtraOption(definition) {
    if (extraOptionRegistry.has(definition.id)) {
      throw new Error('Duplicate extra option id "'.concat(definition.id, '"'));
    }
    if (extraOptionSelectionRegistry.has(definition.selectionMarker)) {
      throw new Error('Duplicate extra option marker "'.concat(definition.selectionMarker, '"'));
    }
    extraOptionRegistry.set(definition.id, definition);
    extraOptionSelectionRegistry.set(definition.selectionMarker, definition);
  }
  function getRegisteredExtraOptions() {
    return __spreadArray6([], __read7(extraOptionRegistry.values()), false);
  }
  function extraOptionBySelectionMarker(marker) {
    var _a;
    return (_a = extraOptionSelectionRegistry.get(marker)) !== null && _a !== void 0 ? _a : null;
  }
  function encounterRewardCompleted(rewardState) {
    var data = rewardState.data;
    if (data && typeof data === "object") {
      if ("selectedIndex" in data)
        return data.selectedIndex !== null;
      if ("finished" in data)
        return data.finished === true;
    }
    return false;
  }
  function relicGainRequirementSatisfied(relic, state) {
    return relic.gainRequirement ? relic.gainRequirement(state) : true;
  }
  function enabledExtraOptions(state) {
    var allowed = new Set(extraOptionRegistry.keys());
    var params = applyMetaReplacers({ kind: "extraOptions", options: [] }, state);
    return new Set(params.options.filter(function(option) {
      return allowed.has(option);
    }));
  }
  function getSimpleRewardOptions(state, metaState) {
    var _this = this;
    var options = state.options;
    var rewardParams = applyMetaReplacers({
      kind: "reward",
      optionCount: options.length,
      pickBufferAdjustments: [],
      rewardKind: state.kind
    }, metaState);
    return options.map(function(option, i) {
      var _a;
      return {
        label: displayName(option),
        spec: option,
        disabled: state.selectedIndex !== null || state.kind === "relic" && !relicGainRequirementSatisfied(option, metaState),
        checked: state.selectedIndex === i,
        bufferDelta: (_a = rewardParams.pickBufferAdjustments[i]) !== null && _a !== void 0 ? _a : 0,
        onClick: function() {
          return __awaiter4(_this, void 0, void 0, function() {
            var skipped, transform, pickBufferAdjustment;
            var _a2;
            return __generator4(this, function(_b) {
              skipped = options.filter(function(_, optionIndex) {
                return optionIndex !== i;
              }).map(function(spec) {
                return displayName(spec);
              });
              transform = state.kind === "card" ? gainCard(option, { skipped }) : state.kind === "event" ? gainEvent(option, { skipped }) : state.kind === "potion" ? gainPotion(option, { skipped }) : gainRelic(option, { skipped });
              pickBufferAdjustment = (_a2 = rewardParams.pickBufferAdjustments[i]) !== null && _a2 !== void 0 ? _a2 : 0;
              return [2, {
                newData: __assign3(__assign3({}, state), { selectedIndex: i }),
                transform: pickBufferAdjustment === 0 ? transform : compose(transform, addBuffer(pickBufferAdjustment))
              }];
            });
          });
        }
      };
    });
  }
  function getRewardOptions(rewardState, metaState) {
    var e_1, _a;
    var _this = this;
    var baseOptions = rewardState.kind === "encounter" ? !rewardState.encounter ? [] : rewardState.encounter.getOptions(rewardState.data, metaState) : getSimpleRewardOptions(rewardState, metaState);
    var alreadySelected = rewardState.kind === "encounter" ? encounterRewardCompleted(rewardState) : rewardState.selectedIndex !== null;
    if (rewardState.kind !== "encounter") {
      var enabledIDs = enabledExtraOptions(metaState);
      var selectedExtraOption = rewardState.selectedIndex === null ? null : extraOptionBySelectionMarker(rewardState.selectedIndex);
      if (selectedExtraOption !== null)
        enabledIDs.add(selectedExtraOption.id);
      var _loop_1 = function(definition2) {
        if (!enabledIDs.has(definition2.id))
          return "continue";
        var rendered = definition2.render(rewardState, metaState);
        baseOptions.push({
          label: rendered.label,
          description: rendered.description,
          tooltipSpec: rendered.tooltipSpec,
          compact: rendered.compact,
          disabled: alreadySelected,
          checked: rewardState.selectedIndex === definition2.selectionMarker,
          onClick: function() {
            return __awaiter4(_this, void 0, void 0, function() {
              return __generator4(this, function(_a2) {
                return [2, {
                  newData: __assign3(__assign3({}, rewardState), { selectedIndex: definition2.selectionMarker }),
                  transform: rendered.transform
                }];
              });
            });
          }
        });
      };
      try {
        for (var _b = __values5(getRegisteredExtraOptions()), _c = _b.next(); !_c.done; _c = _b.next()) {
          var definition = _c.value;
          _loop_1(definition);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }
    return baseOptions;
  }
  function updateRewardState(rewardState, newData) {
    if (rewardState.kind === "encounter") {
      return __assign3(__assign3({}, rewardState), { data: newData });
    } else {
      return newData;
    }
  }
  function burdenDefinitionById(id) {
    var _a;
    return (_a = burdenRegistry.find(function(definition) {
      return definition.id === id;
    })) !== null && _a !== void 0 ? _a : null;
  }
  function getRegisteredBurdenIds() {
    return burdenRegistry.map(function(definition) {
      return definition.id;
    });
  }
  function isBurdenResolved(burdenState) {
    return burdenState.selectedIndices.length >= burdenState.numPicked;
  }
  function getBurdenOptions(burdenState, metaState) {
    var _this = this;
    return burdenState.options.map(function(option, index) {
      var _a;
      var definition = burdenDefinitionById(option.id);
      if (!definition) {
        throw new Error('Unknown burden option "'.concat(option.id, '"'));
      }
      var applicable = definition.applies(metaState);
      var ruleLines = (definition.rules || []).flatMap(function(rule) {
        var e_2, _a2, e_3, _b;
        var _c, _d;
        var lines = [];
        try {
          for (var _e = __values5(rule.triggers || []), _f = _e.next(); !_f.done; _f = _e.next()) {
            var trigger_1 = _f.value;
            lines.push.apply(lines, __spreadArray6([], __read7((_c = trigger_1.simpleText) !== null && _c !== void 0 ? _c : trigger_1.text), false));
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_f && !_f.done && (_a2 = _e.return)) _a2.call(_e);
          } finally {
            if (e_2) throw e_2.error;
          }
        }
        try {
          for (var _g = __values5(rule.replacers || []), _h = _g.next(); !_h.done; _h = _g.next()) {
            var replacer = _h.value;
            lines.push.apply(lines, __spreadArray6([], __read7((_d = replacer.simpleText) !== null && _d !== void 0 ? _d : replacer.text), false));
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
        return lines;
      });
      var baseDescription = option.description || "";
      var descriptionLines = baseDescription.length > 0 ? __spreadArray6([baseDescription], __read7(ruleLines), false) : ruleLines;
      var resolved = isBurdenResolved(burdenState);
      var alreadyPicked = burdenState.selectedIndices.includes(index);
      return {
        label: option.title,
        description: descriptionLines.join("\n"),
        spec: (_a = option.spec) !== null && _a !== void 0 ? _a : void 0,
        disabled: resolved || alreadyPicked || !applicable,
        checked: alreadyPicked,
        onClick: function() {
          return __awaiter4(_this, void 0, void 0, function() {
            var selectedIndices, isFinalPick, skipped, transform;
            var _a2;
            return __generator4(this, function(_b) {
              switch (_b.label) {
                case 0:
                  if (!definition.applies(metaState)) {
                    return [2, { newData: burdenState }];
                  }
                  selectedIndices = __spreadArray6(__spreadArray6([], __read7(burdenState.selectedIndices), false), [index], false);
                  isFinalPick = selectedIndices.length >= burdenState.numPicked;
                  skipped = isFinalPick ? burdenState.options.filter(function(_, i) {
                    return !selectedIndices.includes(i);
                  }).map(function(o) {
                    return o.title;
                  }) : [];
                  return [4, definition.resolveTransform(option, metaState, skipped)];
                case 1:
                  transform = _b.sent();
                  if (!transform) {
                    return [2, {
                      newData: burdenState
                    }];
                  }
                  return [2, {
                    newData: __assign3(__assign3({}, burdenState), { selectedIndex: (_a2 = selectedIndices[0]) !== null && _a2 !== void 0 ? _a2 : null, selectedIndices }),
                    transform
                  }];
              }
            });
          });
        }
      };
    });
  }
  function updateBurdenState(burdenState, newData) {
    return newData;
  }
  var encounterRegistry = [];
  var encounterUpgradeRegistry = /* @__PURE__ */ new Map();
  var burdenRegistry = [];
  function registerEncounter(encounter, options) {
    var _a, _b;
    encounterRegistry.push({
      encounter,
      minStage: (_a = options === null || options === void 0 ? void 0 : options.minStage) !== null && _a !== void 0 ? _a : 0,
      maxStage: (_b = options === null || options === void 0 ? void 0 : options.maxStage) !== null && _b !== void 0 ? _b : 7
    });
  }
  function registerEncounterUpgrade(id, upgrade) {
    encounterUpgradeRegistry.set(id, upgrade);
  }
  function getEncounterUpgradeById(id) {
    return encounterUpgradeRegistry.get(id) || null;
  }
  function registerBurden(definition) {
    var _a, _b, _c, _d, _e;
    burdenRegistry.push(__assign3(__assign3({}, definition), { weight: (_a = definition.weight) !== null && _a !== void 0 ? _a : 1, minStage: (_b = definition.minStage) !== null && _b !== void 0 ? _b : 0, maxStage: (_c = definition.maxStage) !== null && _c !== void 0 ? _c : TOTAL_STAGES - 1, applies: (_d = definition.applies) !== null && _d !== void 0 ? _d : (function() {
      return true;
    }), createOption: (_e = definition.createOption) !== null && _e !== void 0 ? _e : (function(state, _generator) {
      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        spec: null,
        data: null
      };
    }) }));
  }
  function getEncounterState(state, generator, stage) {
    var ordered = generator.permute(encounterRegistry);
    var registration = ordered.find(function(e) {
      return e.minStage <= stage && stage <= e.maxStage;
    });
    if (!registration) {
      throw new Error("No encounters available for stage ".concat(stage));
    }
    return {
      kind: "encounter",
      encounter: registration.encounter,
      data: registration.encounter.createInitialData(state, generator)
    };
  }
  function getEncounterByName(name) {
    var registration = encounterRegistry.find(function(entry) {
      return entry.encounter.name === name;
    });
    return registration ? registration.encounter : null;
  }
  var TOTAL_STAGES = 8;
  var INITIAL_BUFFER = 10;
  var MINOR_CURSE_STAGE = 3;
  var MAJOR_CURSE_STAGE = 6;
  var BASE_PARS = [26, 24, 22, 20, 18, 16, 14, 4];
  function displayCurseName(curse) {
    return curse.name.replace(/ \(Major\)$/, "");
  }
  function renderChallenge(spec, state) {
    var gameSpec = makeSpec(state, spec);
    var label = "".concat(challengeSummaryWithState(spec, state), " (").concat(gameSpec.vp, "vp in ").concat(gameSpec.par, "@)");
    var stageCurse = selectedCurseForChallenge(spec, state);
    var relatedCards = __spreadArray6(__spreadArray6(__spreadArray6(__spreadArray6([], __read7(spec.vpMode.cards), false), __read7(spec.vpMode.events), false), __read7(stageCurse ? stageCurse.events : []), false), __read7(spec.boons.flatMap(function(b) {
      return __spreadArray6(__spreadArray6([], __read7(b.cards), false), __read7(b.events), false);
    })), false);
    var tooltipParts = [];
    if (relatedCards.length > 0) {
      tooltipParts.push(relatedCards.map(buildSpecTooltip).join(""));
    }
    if (tooltipParts.length === 0)
      return label;
    var tooltipContent = tooltipParts.join("");
    return "".concat(label, "<span class='tooltip'>").concat(tooltipContent, "</span>");
  }
  function challengeSummary(challenge) {
    var parts = __spreadArray6([challenge.vpMode.name], __read7(challenge.boons.map(function(boon) {
      return boon.name;
    })), false);
    if (challenge.curse !== void 0 && challenge.curse !== null) {
      parts.push(displayCurseName(challenge.curse));
    }
    return parts.join(" + ");
  }
  function challengeSummaryWithState(challenge, state) {
    var parts = __spreadArray6([challenge.vpMode.name], __read7(challenge.boons.map(function(boon) {
      return boon.name;
    })), false);
    var stageCurse = selectedCurseForChallenge(challenge, state);
    if (stageCurse !== null) {
      parts.push(displayCurseName(stageCurse));
    }
    return parts.join(" + ");
  }
  var Relic = (
    /** @class */
    (function(_super) {
      __extends2(Relic2, _super);
      function Relic2(spec, id, notedCards, ticks, tokens, place) {
        if (notedCards === void 0) {
          notedCards = void 0;
        }
        if (ticks === void 0) {
          ticks = [0];
        }
        if (tokens === void 0) {
          tokens = /* @__PURE__ */ new Map();
        }
        if (place === void 0) {
          place = "void";
        }
        var _this = _super.call(this, spec, id, ticks, tokens, place) || this;
        _this.spec = spec;
        _this.notedCards = notedCards;
        _this.ticks = ticks;
        _this.tokens = tokens;
        _this.place = place;
        return _this;
      }
      Relic2.prototype.metaReplacers = function() {
        return this.spec.metaReplacers || [];
      };
      Relic2.prototype.metaTriggers = function() {
        return this.spec.metaTriggers || [];
      };
      Relic2.prototype.triggers = function() {
        return (this.spec.mutableTriggers ? this.spec.mutableTriggers(this) : []).concat(_super.prototype.triggers.call(this));
      };
      Relic2.prototype.replacers = function() {
        return (this.spec.mutableReplacers ? this.spec.mutableReplacers(this) : []).concat(_super.prototype.replacers.call(this));
      };
      Relic2.prototype.update = function(newValues) {
        return new Relic2(this.spec, this.id, newValues.notedCards === void 0 ? this.notedCards : newValues.notedCards, newValues.ticks === void 0 ? this.ticks : newValues.ticks, newValues.tokens === void 0 ? this.tokens : newValues.tokens, newValues.place === void 0 ? this.place : newValues.place);
      };
      return Relic2;
    })(Card)
  );
  function normalizeTimelineEntries(timeline) {
    var e_4, _a;
    var result = [];
    var firstStageRowIndex = /* @__PURE__ */ new Map();
    try {
      for (var timeline_1 = __values5(timeline), timeline_1_1 = timeline_1.next(); !timeline_1_1.done; timeline_1_1 = timeline_1.next()) {
        var entry = timeline_1_1.value;
        if (entry.kind !== "stage") {
          result.push(entry);
          continue;
        }
        var existing = firstStageRowIndex.get(entry.stage);
        if (existing === void 0) {
          firstStageRowIndex.set(entry.stage, result.length);
          result.push(entry);
        } else {
          result[existing] = entry;
        }
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (timeline_1_1 && !timeline_1_1.done && (_a = timeline_1.return)) _a.call(timeline_1);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    return result;
  }
  function upsertStageTimelineEntry(timeline, entry) {
    var normalized = normalizeTimelineEntries(timeline);
    var existingIndex = normalized.findIndex(function(t) {
      return t.kind === "stage" && t.stage === entry.stage;
    });
    if (existingIndex < 0)
      return __spreadArray6(__spreadArray6([], __read7(normalized), false), [entry], false);
    var updated = __spreadArray6([], __read7(normalized), false);
    updated[existingIndex] = entry;
    return updated;
  }
  function getRewardName(rewardState) {
    if (rewardState.kind === "encounter") {
      return rewardState.encounter ? rewardState.encounter.name : "???";
    }
    var labels = {
      card: "Add Card",
      event: "Add Event",
      potion: "Add Potion",
      relic: "Add Relic"
    };
    return labels[rewardState.kind];
  }
  var MetaState = (
    /** @class */
    (function() {
      function MetaState2(ui, seed, onChange, options) {
        if (seed === void 0) {
          seed = null;
        }
        if (onChange === void 0) {
          onChange = null;
        }
        if (options === void 0) {
          options = {};
        }
        var _a, _b, _c, _d;
        this.ui = ui;
        this.redoStack = [];
        this.undoStack = [];
        this.generators = /* @__PURE__ */ new Map();
        this.onChange = onChange;
        this.debugEnabled = (_a = options.debugEnabled) !== null && _a !== void 0 ? _a : false;
        this.burdensEnabled = (_b = options.burdensEnabled) !== null && _b !== void 0 ? _b : false;
        this.scarcityEnabled = (_c = options.scarcityEnabled) !== null && _c !== void 0 ? _c : false;
        this.cursesEnabled = (_d = options.cursesEnabled) !== null && _d !== void 0 ? _d : false;
        if (seed === null) {
          this.seed = randomString();
        } else {
          this.seed = seed;
        }
        this.masterGenerator = new Generator(this.seed);
        var data = {
          stage: 0,
          phase: "stage_select",
          buffer: INITIAL_BUFFER,
          stageScores: Array(TOTAL_STAGES).fill(null),
          stagePars: Array(TOTAL_STAGES).fill(null),
          stageReplays: Array(TOTAL_STAGES).fill(null),
          timeline: [],
          challenges: [],
          availablePaths: [],
          rewardStates: [],
          burdenStates: [],
          collectedCards: [],
          collectedEvents: [],
          potions: [],
          relics: [],
          nextID: 1,
          gameHistory: [],
          gameRedo: []
        };
        this.data = data;
        this.checkpoint = data;
        this.global = {
          macros: [],
          viewingMacros: false
        };
      }
      MetaState2.prototype.removeFromZone = function(id, zone) {
        var _a;
        this.update((_a = {}, _a[zone] = this.data[zone].filter(function(c) {
          return c.id !== id;
        }), _a));
      };
      MetaState2.prototype.applyToRelic = function(fn, r) {
        this.update({ relics: this.data.relics.map(function(rel) {
          return rel.id === r.id ? fn(rel) : rel;
        }) });
      };
      MetaState2.prototype.removePotion = function(id) {
        this.removeFromZone(id, "potions");
      };
      MetaState2.prototype.removeRelic = function(id) {
        this.removeFromZone(id, "relics");
      };
      MetaState2.prototype.removeCard = function(name) {
        this.update({
          collectedCards: this.data.collectedCards.filter(function(c) {
            return c.name !== name;
          })
        });
      };
      MetaState2.prototype.removeEvent = function(name) {
        this.update({
          collectedEvents: this.data.collectedEvents.filter(function(e) {
            return e.name !== name;
          })
        });
      };
      MetaState2.prototype.generator = function(key) {
        if (!this.generators.has(key)) {
          var newGen = this.masterGenerator.newGenerator();
          this.generators.set(key, newGen);
        }
        return this.generators.get(key);
      };
      MetaState2.prototype.clearHistory = function() {
        if (this.data.phase === "in_game") {
          throw new Error("Invariant violation: clearHistory() called while in active game");
        }
        this.undoStack = [];
        this.redoStack = [];
        this.checkpoint = this.data;
        this.notifyChanged();
      };
      MetaState2.prototype.setCheckpoint = function() {
        console.assert(this.data.phase !== "path_select");
        this.undoStack.push(this.checkpoint);
        this.checkpoint = this.data;
        this.redoStack = [];
        this.notifyChanged();
      };
      MetaState2.prototype.updateAndSetCheckpoint = function(updates) {
        console.assert(this.data.phase !== "path_select");
        var nextData = __assign3(__assign3({}, this.data), updates);
        this.undoStack.push(this.checkpoint);
        this.data = nextData;
        this.checkpoint = nextData;
        this.redoStack = [];
        this.notifyChanged();
      };
      MetaState2.prototype.replaceAndClearHistory = function(updates) {
        var nextData = __assign3(__assign3({}, this.data), updates);
        if (nextData.phase === "in_game") {
          throw new Error("Invariant violation: replaceAndClearHistory() cannot enter active game");
        }
        this.data = nextData;
        this.undoStack = [];
        this.redoStack = [];
        this.checkpoint = nextData;
        this.notifyChanged();
      };
      MetaState2.prototype.update = function(updates) {
        this.data = __assign3(__assign3({}, this.data), updates);
        this.notifyChanged();
      };
      MetaState2.prototype.updateGlobal = function(updates) {
        this.global = __assign3(__assign3({}, this.global), updates);
        this.notifyChanged();
      };
      MetaState2.prototype.inPathSelection = function() {
        return this.data.challenges.length === 0;
      };
      MetaState2.prototype.undo = function(checkpointUpdate) {
        if (this.inPathSelection()) {
          this.undoStack = [];
          this.redoStack = [];
          this.checkpoint = this.data;
          return;
        }
        if (this.checkpoint != this.data)
          this.data = this.checkpoint;
        if (this.undoStack.length == 0)
          return;
        var previousCheckpoint = this.undoStack.pop();
        var redoCheckpoint = checkpointUpdate ? __assign3(__assign3({}, this.checkpoint), checkpointUpdate) : this.checkpoint;
        this.redoStack.push(redoCheckpoint);
        this.checkpoint = previousCheckpoint;
        this.data = previousCheckpoint;
        this.notifyChanged();
      };
      MetaState2.prototype.redo = function() {
        if (this.inPathSelection())
          return;
        if (this.redoStack.length === 0)
          return;
        var nextState = this.redoStack.pop();
        this.undoStack.push(this.checkpoint);
        this.checkpoint = nextState;
        this.data = nextState;
        this.notifyChanged();
      };
      MetaState2.prototype.canUndo = function() {
        if (this.inPathSelection())
          return false;
        return this.undoStack.length > 0 || this.checkpoint != this.data;
      };
      MetaState2.prototype.canRedo = function() {
        if (this.inPathSelection())
          return false;
        return this.redoStack.length > 0;
      };
      MetaState2.prototype.uniqueSnapshots = function() {
        var e_5, _a;
        var snapshots = __spreadArray6(__spreadArray6([this.data, this.checkpoint], __read7(this.undoStack), false), __read7(this.redoStack), false);
        var seen = /* @__PURE__ */ new Set();
        var result = [];
        try {
          for (var snapshots_1 = __values5(snapshots), snapshots_1_1 = snapshots_1.next(); !snapshots_1_1.done; snapshots_1_1 = snapshots_1.next()) {
            var snapshot = snapshots_1_1.value;
            if (!seen.has(snapshot)) {
              seen.add(snapshot);
              result.push(snapshot);
            }
          }
        } catch (e_5_1) {
          e_5 = { error: e_5_1 };
        } finally {
          try {
            if (snapshots_1_1 && !snapshots_1_1.done && (_a = snapshots_1.return)) _a.call(snapshots_1);
          } finally {
            if (e_5) throw e_5.error;
          }
        }
        return result;
      };
      MetaState2.prototype.mutateAllSnapshots = function(mutator) {
        var e_6, _a;
        try {
          for (var _b = __values5(this.uniqueSnapshots()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var snapshot = _c.value;
            mutator(snapshot);
          }
        } catch (e_6_1) {
          e_6 = { error: e_6_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_6) throw e_6.error;
          }
        }
        this.notifyChanged();
      };
      MetaState2.prototype.setChangeListener = function(listener) {
        this.onChange = listener;
      };
      MetaState2.prototype.notifyChanged = function() {
        if (this.onChange)
          this.onChange();
      };
      return MetaState2;
    })()
  );
  function validateMetaStateData(data, context) {
    if (data.phase === "path_select" && data.availablePaths.length === 0) {
      throw new Error("Invariant violation (".concat(context, "): path_select requires available paths"));
    }
    if (data.phase !== "path_select" && data.availablePaths.length > 0) {
      throw new Error("Invariant violation (".concat(context, "): only path_select may store available paths"));
    }
    if (data.phase === "stage_select" && data.challenges.length === 0) {
      throw new Error("Invariant violation (".concat(context, "): stage_select requires challenge options"));
    }
    if (data.phase === "in_game" && data.challenges.length !== 1) {
      throw new Error("Invariant violation (".concat(context, "): in_game requires exactly one selected challenge"));
    }
    if (data.phase !== "stage_select" && data.burdenStates.length > 0) {
      throw new Error("Invariant violation (".concat(context, "): burden selections only allowed in stage_select"));
    }
    if (data.phase !== "in_game" && (data.gameHistory.length > 0 || data.gameRedo.length > 0)) {
      throw new Error("Invariant violation (".concat(context, "): saved game history only allowed in in_game"));
    }
  }
  function looksLikeCardSpec(value) {
    if (value === null || typeof value !== "object")
      return false;
    var record = value;
    if (typeof record.name !== "string")
      return false;
    if ("spec" in record && "id" in record && "place" in record)
      return false;
    return "effects" in record || "buyCost" in record || "fixedCost" in record || "isPotion" in record || "upgrades" in record || "persistence" in record || "metaReplacers" in record || "metaTriggers" in record || "relatedCards" in record || "simpleText" in record;
  }
  function encodeUnknown(value) {
    var e_7, _a;
    if (value instanceof Relic) {
      return {
        __type: "relic",
        value: serializeCard(value)
      };
    }
    if (value instanceof Card) {
      return {
        __type: "card",
        value: serializeCard(value)
      };
    }
    if (value instanceof Map) {
      return {
        __type: "map",
        entries: __spreadArray6([], __read7(value.entries()), false).map(function(_a2) {
          var _b2 = __read7(_a2, 2), key2 = _b2[0], entryValue2 = _b2[1];
          return [encodeUnknown(key2), encodeUnknown(entryValue2)];
        })
      };
    }
    if (Array.isArray(value)) {
      return value.map(encodeUnknown);
    }
    if (looksLikeCardSpec(value)) {
      return {
        __type: "spec",
        value: serializeSpec(value, "card")
      };
    }
    if (value !== null && typeof value === "object") {
      var result = {};
      try {
        for (var _b = __values5(Object.entries(value)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = __read7(_c.value, 2), key = _d[0], entryValue = _d[1];
          result[key] = encodeUnknown(entryValue);
        }
      } catch (e_7_1) {
        e_7 = { error: e_7_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_7) throw e_7.error;
        }
      }
      return result;
    }
    return value;
  }
  function decodeUnknown(value) {
    var e_8, _a;
    if (Array.isArray(value)) {
      return value.map(decodeUnknown);
    }
    if (value !== null && typeof value === "object") {
      var record = value;
      if (record.__type === "map") {
        var entries = record.entries.map(function(entry) {
          var pair = entry;
          return [decodeUnknown(pair[0]), decodeUnknown(pair[1])];
        });
        return new Map(entries);
      }
      if (record.__type === "spec") {
        return deserializeSpec(record.value);
      }
      if (record.__type === "card" || record.__type === "relic") {
        return deserializeCard(record.value);
      }
      var result = {};
      try {
        for (var _b = __values5(Object.entries(record)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = __read7(_c.value, 2), key = _d[0], entryValue = _d[1];
          result[key] = decodeUnknown(entryValue);
        }
      } catch (e_8_1) {
        e_8 = { error: e_8_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_8) throw e_8.error;
        }
      }
      return result;
    }
    return value;
  }
  function findBaseSpec(name) {
    var spec = getSpecByName(name);
    if (spec)
      return spec;
    if (name.startsWith("Frozen ")) {
      var frozenRelic2 = getSpecByName("Frozen Relic");
      if (frozenRelic2)
        return __assign3(__assign3({}, frozenRelic2), { name });
    }
    throw new Error('Unable to resolve spec "'.concat(name, '"'));
  }
  function serializeSpec(spec, categoryHint) {
    var _a;
    if (spec.persistence) {
      var base = (_a = spec.relatedCards) === null || _a === void 0 ? void 0 : _a[0];
      if (!base) {
        throw new Error('Dynamic spec "'.concat(spec.name, '" is missing related base card'));
      }
      var baseCategory = spec.persistence.kind === "bottledEventPotion" ? "event" : "card";
      return {
        type: "dynamic",
        dynamicKind: spec.persistence.kind,
        base: serializeSpec(base, baseCategory)
      };
    }
    var upgradeIDs = (spec.upgrades || []).map(function(upgrade) {
      return upgrade.id;
    });
    if (upgradeIDs.some(function(id) {
      return id === void 0;
    })) {
      throw new Error('Spec "'.concat(spec.name, '" has non-serializable upgrades'));
    }
    return {
      type: "base",
      category: categoryHint,
      name: spec.name,
      upgradeIDs
    };
  }
  function applyUpgrades(base, upgradeIDs) {
    var e_9, _a;
    var result = base;
    try {
      for (var upgradeIDs_1 = __values5(upgradeIDs), upgradeIDs_1_1 = upgradeIDs_1.next(); !upgradeIDs_1_1.done; upgradeIDs_1_1 = upgradeIDs_1.next()) {
        var id = upgradeIDs_1_1.value;
        var upgrade = getEncounterUpgradeById(id);
        if (!upgrade) {
          throw new Error('Unknown upgrade id "'.concat(id, '"'));
        }
        result = __assign3(__assign3({}, result), { upgrades: __spreadArray6(__spreadArray6([], __read7(result.upgrades || []), false), [upgrade], false) });
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (upgradeIDs_1_1 && !upgradeIDs_1_1.done && (_a = upgradeIDs_1.return)) _a.call(upgradeIDs_1);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    return result;
  }
  function deserializeSpec(spec) {
    if (spec.type === "base") {
      var base_1 = findBaseSpec(spec.name);
      return applyUpgrades(base_1, spec.upgradeIDs);
    }
    var base = deserializeSpec(spec.base);
    switch (spec.dynamicKind) {
      case "cardInABoxRelic":
        return makeCardInABoxRelic(base);
      case "bottledCardPotion":
        return makeBottledCardPotion(base);
      case "bottledEventPotion":
        return makeBottledEventPotion(base);
      default:
        throw new Error("Unknown dynamic spec kind");
    }
  }
  function serializeCard(card) {
    var specCategory = card instanceof Relic ? "relic" : card.spec.isPotion ? "potion" : "card";
    var common = {
      id: card.id,
      spec: serializeSpec(card.spec, specCategory),
      ticks: __spreadArray6([], __read7(card.ticks), false),
      tokens: __spreadArray6([], __read7(card.tokens.entries()), false),
      place: card.place
    };
    if (card instanceof Relic) {
      return __assign3(__assign3({ kind: "relic" }, common), { notedCards: (card.notedCards || []).map(function(spec) {
        return serializeSpec(spec, "card");
      }) });
    }
    return __assign3({ kind: "card" }, common);
  }
  function deserializeCard(card) {
    var spec = deserializeSpec(card.spec);
    var tokens = new Map(card.tokens);
    if (card.kind === "relic") {
      var notedCards = (card.notedCards || []).map(deserializeSpec);
      return new Relic(spec, card.id, notedCards, card.ticks, tokens, card.place);
    }
    return new Card(spec, card.id, card.ticks, tokens, card.place);
  }
  function serializeChallenge(challenge) {
    var _a;
    return {
      stage: challenge.stage,
      vpModeName: challenge.vpMode.name,
      boonNames: challenge.boons.map(function(boon) {
        return boon.name;
      }),
      curseName: (_a = challenge.curse) === null || _a === void 0 ? void 0 : _a.name
    };
  }
  function findCurseByName(name) {
    var _a;
    return (_a = __spreadArray6(__spreadArray6([], __read7(allMinorCurses()), false), __read7(allMajorCurses()), false).find(function(c) {
      return c.name === name;
    })) !== null && _a !== void 0 ? _a : null;
  }
  function deserializeChallenge(challenge) {
    var vpMode = vpModes.find(function(mode) {
      return mode.name === challenge.vpModeName;
    });
    if (!vpMode)
      throw new Error('Unknown vp mode "'.concat(challenge.vpModeName, '"'));
    var resolvedBoons = challenge.boonNames.map(function(name) {
      var boon = boons.find(function(candidate) {
        return candidate.name === name;
      });
      if (!boon)
        throw new Error('Unknown boon "'.concat(name, '"'));
      return boon;
    });
    var curse = challenge.curseName === void 0 ? null : findCurseByName(challenge.curseName);
    return {
      stage: challenge.stage,
      vpMode,
      boons: resolvedBoons,
      curse
    };
  }
  function serializePath(path) {
    return {
      label: path.label,
      onSelectEffects: path.onSelectEffects ? path.onSelectEffects.map(function(effect) {
        return __assign3({}, effect);
      }) : void 0,
      rewardStates: path.rewardStates.map(serializeRewardState),
      burdenStates: path.burdenStates.map(serializeBurdenState)
    };
  }
  function deserializePath(path) {
    var _a;
    return {
      label: (_a = path.label) !== null && _a !== void 0 ? _a : "Path",
      onSelectEffects: (path.onSelectEffects || []).map(function(effect) {
        return __assign3({}, effect);
      }),
      rewardStates: path.rewardStates.map(deserializeRewardState),
      burdenStates: (path.burdenStates || []).map(deserializeBurdenState)
    };
  }
  function serializeBurdenState(burdenState) {
    var _a;
    return {
      selectedIndex: (_a = burdenState.selectedIndices[0]) !== null && _a !== void 0 ? _a : null,
      selectedIndices: __spreadArray6([], __read7(burdenState.selectedIndices), false),
      numPicked: burdenState.numPicked,
      options: burdenState.options.map(function(option) {
        return {
          id: option.id,
          title: option.title,
          description: option.description,
          spec: encodeUnknown(option.spec),
          data: encodeUnknown(option.data)
        };
      })
    };
  }
  function deserializeBurdenState(burdenState) {
    var _a, _b;
    var selectedIndices = burdenState.selectedIndices !== void 0 ? __spreadArray6([], __read7(burdenState.selectedIndices), false) : burdenState.selectedIndex === null ? [] : [burdenState.selectedIndex];
    var numPicked = Math.max(1, (_a = burdenState.numPicked) !== null && _a !== void 0 ? _a : 1);
    return {
      selectedIndex: (_b = selectedIndices[0]) !== null && _b !== void 0 ? _b : null,
      selectedIndices,
      numPicked,
      options: burdenState.options.map(function(option) {
        return {
          id: option.id,
          title: option.title,
          description: option.description,
          spec: decodeUnknown(option.spec),
          data: decodeUnknown(option.data)
        };
      })
    };
  }
  function serializeRewardState(rewardState) {
    if (rewardState.kind === "encounter") {
      return {
        kind: "encounter",
        encounterName: rewardState.encounter ? rewardState.encounter.name : null,
        data: encodeUnknown(rewardState.data)
      };
    }
    var category = rewardState.kind === "card" ? "card" : rewardState.kind === "event" ? "event" : rewardState.kind === "potion" ? "potion" : "relic";
    return {
      kind: rewardState.kind,
      options: rewardState.options.map(function(spec) {
        return serializeSpec(spec, category);
      }),
      selectedIndex: rewardState.selectedIndex
    };
  }
  function deserializeRewardState(rewardState) {
    if (rewardState.kind === "encounter") {
      return {
        kind: "encounter",
        encounter: rewardState.encounterName ? getEncounterByName(rewardState.encounterName) : null,
        data: decodeUnknown(rewardState.data)
      };
    }
    return {
      kind: rewardState.kind,
      options: rewardState.options.map(deserializeSpec),
      selectedIndex: rewardState.selectedIndex
    };
  }
  function serializeGameSpec(spec) {
    var _a, _b;
    return {
      vp: spec.vp,
      par: spec.par,
      buffer: spec.buffer,
      cards: spec.cards.map(function(card) {
        return serializeSpec(card, "card");
      }),
      events: spec.events.map(function(event) {
        return serializeSpec(event, "event");
      }),
      potions: spec.potions.map(function(potion) {
        return serializeCard(potion);
      }),
      relics: spec.relics.map(function(relic) {
        return serializeCard(relic);
      }),
      metaStage: spec.metaStage,
      metaStageScores: spec.metaStageScores ? __spreadArray6([], __read7(spec.metaStageScores), false) : void 0,
      metaStagePars: spec.metaStagePars ? __spreadArray6([], __read7(spec.metaStagePars), false) : void 0,
      metaStageTooltips: spec.metaStageTooltips ? __spreadArray6([], __read7(spec.metaStageTooltips), false) : void 0,
      metaCursesEnabled: spec.metaCursesEnabled,
      previousScore: spec.previousScore,
      replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray6([], __read7(spec.replayUsedPotionIDs), false) : void 0,
      replayStage: spec.replayStage,
      selectedChallengeIndex: spec.selectedChallengeIndex,
      collectedCards: (_a = spec.collectedCards) === null || _a === void 0 ? void 0 : _a.map(function(card) {
        return serializeSpec(card, "card");
      }),
      collectedEvents: (_b = spec.collectedEvents) === null || _b === void 0 ? void 0 : _b.map(function(event) {
        return serializeSpec(event, "event");
      })
    };
  }
  function deserializeGameSpec(spec) {
    var _a, _b;
    return {
      vp: spec.vp,
      par: spec.par,
      buffer: spec.buffer,
      cards: spec.cards.map(function(card) {
        return deserializeSpec(card);
      }),
      events: spec.events.map(function(event) {
        return deserializeSpec(event);
      }),
      potions: spec.potions.map(function(card) {
        return deserializeCard(card);
      }),
      relics: spec.relics.map(function(card) {
        return deserializeCard(card);
      }),
      metaStage: spec.metaStage,
      metaStageScores: spec.metaStageScores ? __spreadArray6([], __read7(spec.metaStageScores), false) : void 0,
      metaStagePars: spec.metaStagePars ? __spreadArray6([], __read7(spec.metaStagePars), false) : void 0,
      metaStageTooltips: spec.metaStageTooltips ? __spreadArray6([], __read7(spec.metaStageTooltips), false) : void 0,
      metaCursesEnabled: spec.metaCursesEnabled,
      previousScore: spec.previousScore,
      replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray6([], __read7(spec.replayUsedPotionIDs), false) : void 0,
      replayStage: spec.replayStage,
      selectedChallengeIndex: spec.selectedChallengeIndex,
      collectedCards: (_a = spec.collectedCards) === null || _a === void 0 ? void 0 : _a.map(function(card) {
        return deserializeSpec(card);
      }),
      collectedEvents: (_b = spec.collectedEvents) === null || _b === void 0 ? void 0 : _b.map(function(event) {
        return deserializeSpec(event);
      })
    };
  }
  function serializeMetaStateData(data) {
    validateMetaStateData(data, "serialize");
    return {
      stage: data.stage,
      phase: data.phase,
      challenges: data.challenges.map(serializeChallenge),
      availablePaths: data.availablePaths.map(serializePath),
      stageScores: __spreadArray6([], __read7(data.stageScores), false),
      stagePars: __spreadArray6([], __read7(data.stagePars), false),
      stageReplays: data.stageReplays.map(function(stageReplay) {
        if (stageReplay === null)
          return null;
        return {
          stage: stageReplay.stage,
          challenge: serializeChallenge(stageReplay.challenge),
          spec: serializeGameSpec(stageReplay.spec),
          score: stageReplay.score,
          par: stageReplay.par,
          history: __spreadArray6([], __read7(stageReplay.history), false),
          potionsRemaining: stageReplay.potionsRemaining.map(function(card) {
            return serializeCard(card);
          }),
          bufferBeforeCourse: stageReplay.bufferBeforeCourse,
          bufferAfterCourse: stageReplay.bufferAfterCourse
        };
      }),
      buffer: data.buffer,
      rewardStates: data.rewardStates.map(serializeRewardState),
      burdenStates: data.burdenStates.map(serializeBurdenState),
      collectedCards: data.collectedCards.map(function(card) {
        return serializeSpec(card, "card");
      }),
      collectedEvents: data.collectedEvents.map(function(event) {
        return serializeSpec(event, "event");
      }),
      potions: data.potions.map(function(card) {
        return serializeCard(card);
      }),
      relics: data.relics.map(function(card) {
        return serializeCard(card);
      }),
      nextID: data.nextID,
      timeline: data.timeline.map(function(entry) {
        return __assign3({}, entry);
      }),
      gameHistory: __spreadArray6([], __read7(data.gameHistory), false),
      gameRedo: __spreadArray6([], __read7(data.gameRedo), false),
      selectedChallengeIndex: data.selectedChallengeIndex
    };
  }
  function cloneSerializedMetaStateData(data) {
    return JSON.parse(JSON.stringify(data));
  }
  function deserializeMetaStateData(data) {
    var _a;
    var phase = (_a = data.phase) !== null && _a !== void 0 ? _a : data.playingGame === true ? "in_game" : data.availablePaths && data.availablePaths.length > 0 ? "path_select" : "stage_select";
    var result = {
      stage: data.stage,
      phase,
      challenges: data.challenges.map(deserializeChallenge),
      availablePaths: (data.availablePaths || []).map(deserializePath),
      stageScores: __spreadArray6([], __read7(data.stageScores), false),
      stagePars: __spreadArray6([], __read7(data.stagePars), false),
      stageReplays: data.stageReplays.map(function(stageReplay) {
        if (stageReplay === null)
          return null;
        return {
          stage: stageReplay.stage,
          challenge: deserializeChallenge(stageReplay.challenge),
          spec: deserializeGameSpec(stageReplay.spec),
          score: stageReplay.score,
          par: stageReplay.par,
          history: __spreadArray6([], __read7(stageReplay.history), false),
          potionsRemaining: stageReplay.potionsRemaining.map(function(card) {
            return deserializeCard(card);
          }),
          bufferBeforeCourse: stageReplay.bufferBeforeCourse,
          bufferAfterCourse: stageReplay.bufferAfterCourse
        };
      }),
      buffer: data.buffer,
      rewardStates: data.rewardStates.map(deserializeRewardState),
      burdenStates: (data.burdenStates || []).map(deserializeBurdenState),
      collectedCards: data.collectedCards.map(function(card) {
        return deserializeSpec(card);
      }),
      collectedEvents: data.collectedEvents.map(function(event) {
        return deserializeSpec(event);
      }),
      potions: data.potions.map(function(card) {
        return deserializeCard(card);
      }),
      relics: data.relics.map(function(card) {
        return deserializeCard(card);
      }),
      nextID: data.nextID,
      timeline: normalizeTimelineEntries((data.timeline || []).map(function(entry) {
        return __assign3({}, entry);
      })),
      gameHistory: __spreadArray6([], __read7(data.gameHistory), false),
      gameRedo: __spreadArray6([], __read7(data.gameRedo), false),
      selectedChallengeIndex: data.selectedChallengeIndex
    };
    if (!data.timeline) {
      result.timeline = normalizeTimelineEntries(result.stageReplays.flatMap(function(stageReplay) {
        if (stageReplay === null)
          return [];
        return [{
          kind: "stage",
          stage: stageReplay.stage,
          challenge: challengeSummary(stageReplay.challenge),
          score: stageReplay.score,
          par: stageReplay.par,
          usedPotions: usedPotionNames(stageReplay.spec.potions, stageReplay.potionsRemaining)
        }];
      }));
    }
    validateMetaStateData(result, "deserialize");
    return result;
  }
  function serializeMetaGame(state) {
    return {
      version: 1,
      seed: state.seed,
      debugEnabled: state.debugEnabled,
      burdensEnabled: state.burdensEnabled,
      scarcityEnabled: state.scarcityEnabled,
      cursesEnabled: state.cursesEnabled,
      masterGeneratorState: state.masterGenerator.exportState(),
      generatorStates: __spreadArray6([], __read7(state.generators.entries()), false).map(function(_a) {
        var _b = __read7(_a, 2), key = _b[0], generator = _b[1];
        return {
          key,
          state: generator.exportState()
        };
      }),
      data: serializeMetaStateData(state.data),
      history: {
        checkpoint: serializeMetaStateData(state.checkpoint),
        undoStack: state.undoStack.map(serializeMetaStateData),
        redoStack: state.redoStack.map(serializeMetaStateData)
      },
      global: encodeUnknown(state.global)
    };
  }
  function deserializeMetaGame(ui, serialized, onChange) {
    var _a, _b, _c, _d, _e, _f;
    if (onChange === void 0) {
      onChange = null;
    }
    if (serialized.version !== 1) {
      throw new Error("Unsupported save version ".concat(serialized.version));
    }
    var debugEnabled = (_a = serialized.debugEnabled) !== null && _a !== void 0 ? _a : false;
    var burdensEnabled = (_b = serialized.burdensEnabled) !== null && _b !== void 0 ? _b : false;
    var scarcityEnabled = (_c = serialized.scarcityEnabled) !== null && _c !== void 0 ? _c : false;
    var cursesEnabled = (_d = serialized.cursesEnabled) !== null && _d !== void 0 ? _d : false;
    var state = new MetaState(ui, serialized.seed, onChange, { debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled });
    state.masterGenerator = Generator.fromState(serialized.masterGeneratorState);
    state.generators = new Map(serialized.generatorStates.map(function(entry) {
      return [entry.key, Generator.fromState(entry.state)];
    }));
    var serializedData = cloneSerializedMetaStateData(serialized.data);
    var history = serialized.history;
    var serializedCheckpoint = history ? cloneSerializedMetaStateData(history.checkpoint) : serializedData;
    var serializedUndo = (history ? history.undoStack : []).map(cloneSerializedMetaStateData);
    var serializedRedo = (history ? history.redoStack : []).map(cloneSerializedMetaStateData);
    var dataBySerialized = /* @__PURE__ */ new Map();
    var decodeSnapshot = function(snapshot) {
      if (!dataBySerialized.has(snapshot)) {
        dataBySerialized.set(snapshot, deserializeMetaStateData(snapshot));
      }
      return dataBySerialized.get(snapshot);
    };
    state.data = decodeSnapshot(serializedData);
    state.checkpoint = history ? decodeSnapshot(serializedCheckpoint) : state.data;
    state.undoStack = serializedUndo.map(decodeSnapshot);
    state.redoStack = serializedRedo.map(decodeSnapshot);
    if (state.data.phase === "in_game" && state.undoStack.length === 0) {
      throw new Error("Malformed save: in-progress game is missing a meta undo checkpoint");
    }
    var restoredGlobal = decodeUnknown(serialized.global);
    state.global = {
      macros: (_e = restoredGlobal.macros) !== null && _e !== void 0 ? _e : [],
      viewingMacros: (_f = restoredGlobal.viewingMacros) !== null && _f !== void 0 ? _f : false
    };
    return state;
  }
  function compose() {
    var transforms = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      transforms[_i] = arguments[_i];
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var transforms_1, transforms_1_1, t, e_10_1;
        var e_10, _a;
        return __generator4(this, function(_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 5, 6, 7]);
              transforms_1 = __values5(transforms), transforms_1_1 = transforms_1.next();
              _b.label = 1;
            case 1:
              if (!!transforms_1_1.done) return [3, 4];
              t = transforms_1_1.value;
              return [4, t(state)];
            case 2:
              _b.sent();
              _b.label = 3;
            case 3:
              transforms_1_1 = transforms_1.next();
              return [3, 1];
            case 4:
              return [3, 7];
            case 5:
              e_10_1 = _b.sent();
              e_10 = { error: e_10_1 };
              return [3, 7];
            case 6:
              try {
                if (transforms_1_1 && !transforms_1_1.done && (_a = transforms_1.return)) _a.call(transforms_1);
              } finally {
                if (e_10) throw e_10.error;
              }
              return [
                7
                /*endfinally*/
              ];
            case 7:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function addBuffer(amount) {
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          state.update({ buffer: state.data.buffer + amount });
          state.ui.updateBuffer(state);
          return [
            2
            /*return*/
          ];
        });
      });
    };
  }
  function addTimelineAction(action, details, skipped) {
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          state.update({
            timeline: __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
              kind: "action",
              stage: state.data.stage,
              action,
              skipped,
              details
            }], false)
          });
          return [
            2
            /*return*/
          ];
        });
      });
    };
  }
  function gainCard(card, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var nextData;
        return __generator4(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextData = {
                collectedCards: __spreadArray6(__spreadArray6([], __read7(state.data.collectedCards), false), [card], false)
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "card",
                  name: displayName(card),
                  skipped: timelineDetails.skipped ? __spreadArray6([], __read7(timelineDetails.skipped), false) : void 0,
                  details: timelineDetails.details
                }], false);
              }
              state.update(nextData);
              return [4, trigger2({ kind: "card", card }, state)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function gainEvent(event, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var nextData;
        return __generator4(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextData = {
                collectedEvents: __spreadArray6(__spreadArray6([], __read7(state.data.collectedEvents), false), [event], false)
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "event",
                  name: displayName(event),
                  skipped: timelineDetails.skipped ? __spreadArray6([], __read7(timelineDetails.skipped), false) : void 0,
                  details: timelineDetails.details
                }], false);
              }
              state.update(nextData);
              return [4, trigger2({ kind: "event", event }, state)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function gainPotion(potion, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var nextID, potionCard, nextData;
        return __generator4(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextID = state.data.nextID;
              potionCard = new Card(potion, nextID);
              nextData = {
                potions: __spreadArray6(__spreadArray6([], __read7(state.data.potions), false), [potionCard], false),
                nextID: nextID + 1
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "potion",
                  name: displayName(potion),
                  skipped: timelineDetails.skipped ? __spreadArray6([], __read7(timelineDetails.skipped), false) : void 0,
                  details: timelineDetails.details
                }], false);
              }
              state.update(nextData);
              return [4, trigger2({ kind: "potion", potion: potionCard }, state)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function gainRelic(relic, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var nextID, relicCard, nextData;
        return __generator4(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextID = state.data.nextID;
              relicCard = new Relic(relic, nextID);
              nextData = {
                relics: __spreadArray6(__spreadArray6([], __read7(state.data.relics), false), [relicCard], false),
                nextID: nextID + 1
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "relic",
                  name: displayName(relic),
                  skipped: timelineDetails.skipped ? __spreadArray6([], __read7(timelineDetails.skipped), false) : void 0,
                  details: timelineDetails.details
                }], false);
              }
              state.update(nextData);
              return [4, trigger2({ kind: "relic", relic: relicCard }, state)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function gainNotedRelic(relic, notedCards, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter4(this, void 0, void 0, function() {
        var nextID, relicCard, nextData;
        return __generator4(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextID = state.data.nextID;
              relicCard = new Relic(relic, nextID, notedCards);
              nextData = {
                relics: __spreadArray6(__spreadArray6([], __read7(state.data.relics), false), [relicCard], false),
                nextID: nextID + 1
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray6(__spreadArray6([], __read7(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "relic",
                  name: displayName(relic),
                  skipped: timelineDetails.skipped ? __spreadArray6([], __read7(timelineDetails.skipped), false) : void 0,
                  details: timelineDetails.details
                }], false);
              }
              state.update(nextData);
              return [4, trigger2({ kind: "relic", relic: relicCard }, state)];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function removeRelic(state, id) {
    return __awaiter4(this, void 0, void 0, function() {
      var relic;
      return __generator4(this, function(_a) {
        switch (_a.label) {
          case 0:
            relic = state.data.relics.find(function(r) {
              return r.id === id;
            });
            if (!relic)
              return [
                2
                /*return*/
              ];
            return [4, trigger2({ kind: "loseRelic", relic }, state)];
          case 1:
            _a.sent();
            state.removeRelic(id);
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function updateRewardAtIndex(state, index, newRewardState) {
    var rewardStates = __spreadArray6([], __read7(state.data.rewardStates), false);
    if (index >= 0 && index < rewardStates.length) {
      rewardStates[index] = newRewardState;
    }
    state.update({ rewardStates });
  }
  function updateBurdenAtIndex(state, index, newBurdenState) {
    var burdenStates = __spreadArray6([], __read7(state.data.burdenStates), false);
    if (index >= 0 && index < burdenStates.length) {
      burdenStates[index] = newBurdenState;
    }
    state.update({ burdenStates });
  }
  function endCourse(score, par, state) {
    return __awaiter4(this, void 0, void 0, function() {
      var newScores, newPars;
      return __generator4(this, function(_a) {
        switch (_a.label) {
          case 0:
            newScores = __spreadArray6([], __read7(state.data.stageScores), false);
            newPars = __spreadArray6([], __read7(state.data.stagePars), false);
            newScores[state.data.stage] = score;
            newPars[state.data.stage] = par;
            state.update({ stageScores: newScores, stagePars: newPars });
            return [4, trigger2({ kind: "end", score, par }, state)];
          case 1:
            _a.sent();
            if (!(score > par)) return [3, 3];
            return [4, addBuffer(par - score)(state)];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function applyMetaReplacers(params, state) {
    var e_11, _a, e_12, _b;
    try {
      for (var _c = __values5(state.data.relics), _d = _c.next(); !_d.done; _d = _c.next()) {
        var relic = _d.value;
        var metaReplacers = relic.metaReplacers();
        try {
          for (var metaReplacers_1 = (e_12 = void 0, __values5(metaReplacers)), metaReplacers_1_1 = metaReplacers_1.next(); !metaReplacers_1_1.done; metaReplacers_1_1 = metaReplacers_1.next()) {
            var rawReplacer = metaReplacers_1_1.value;
            if (rawReplacer.kind !== params.kind)
              continue;
            var replacer = rawReplacer;
            params = replacer.replace(params, state, relic);
          }
        } catch (e_12_1) {
          e_12 = { error: e_12_1 };
        } finally {
          try {
            if (metaReplacers_1_1 && !metaReplacers_1_1.done && (_b = metaReplacers_1.return)) _b.call(metaReplacers_1);
          } finally {
            if (e_12) throw e_12.error;
          }
        }
      }
    } catch (e_11_1) {
      e_11 = { error: e_11_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_11) throw e_11.error;
      }
    }
    return params;
  }
  function signedAmount(amount) {
    return amount > 0 ? "+".concat(amount) : "".concat(amount);
  }
  function scarcityParAdjustment(_stage, state) {
    return state.scarcityEnabled ? -1 : 0;
  }
  function stageCurseLevel(stage, state) {
    if (!state.cursesEnabled)
      return null;
    if (stage === MINOR_CURSE_STAGE)
      return "minor";
    if (stage === MAJOR_CURSE_STAGE)
      return "major";
    return null;
  }
  function sampledCurseForStage(stage, state) {
    var level = stageCurseLevel(stage, state);
    if (level === null)
      return null;
    var pool = level === "minor" ? allMinorCurses() : allMajorCurses();
    if (pool.length === 0) {
      throw new Error("No ".concat(level, " curses registered"));
    }
    var generator = new Generator("".concat(state.seed, "-CURSE-").concat(stage + 1, "-").concat(level.toUpperCase()));
    return generator.sample(pool);
  }
  function selectedCurseForChallenge(challenge, state) {
    if (challenge.curse !== void 0 && challenge.curse !== null)
      return challenge.curse;
    return sampledCurseForStage(challenge.stage, state);
  }
  function stageParMarker(stage, state) {
    var level = stageCurseLevel(stage, state);
    if (level === "minor")
      return "*";
    if (level === "major")
      return "**";
    return "";
  }
  function formatParDisplay(stage, par, state) {
    return "".concat(par).concat(stageParMarker(stage, state));
  }
  function displayBasePar(stage, state) {
    var basePar = BASE_PARS[stage];
    if (basePar === void 0)
      return null;
    return Math.max(0, basePar + scarcityParAdjustment(stage, state));
  }
  function describeBasePar(stage, state) {
    var basePar = BASE_PARS[stage];
    if (basePar === void 0)
      return "";
    var scarcityDelta = scarcityParAdjustment(stage, state);
    if (scarcityDelta === 0)
      return "".concat(basePar, " (base)");
    var adjusted = displayBasePar(stage, state);
    if (adjusted === null)
      return "".concat(basePar, " (base)");
    return "".concat(basePar, " (base), ").concat(signedAmount(scarcityDelta), " for scarcity, = ").concat(adjusted);
  }
  function describeParCalculation(stage, challenge, relicCards, state) {
    var e_13, _a, e_14, _b, e_15, _c;
    var _d;
    var basePar = BASE_PARS[stage];
    if (basePar === void 0)
      return "";
    var parts = ["".concat(basePar, " (base)")];
    var par = basePar;
    var scarcityDelta = scarcityParAdjustment(stage, state);
    if (scarcityDelta !== 0) {
      par += scarcityDelta;
      parts.push("".concat(signedAmount(scarcityDelta), " for scarcity"));
    }
    if (challenge !== null && challenge !== void 0) {
      try {
        for (var _e = __values5(challenge.boons), _f = _e.next(); !_f.done; _f = _e.next()) {
          var boon = _f.value;
          par += boon.parAdjustment;
          if (boon.parAdjustment !== 0) {
            parts.push("".concat(signedAmount(boon.parAdjustment), " for ").concat(boon.name));
          }
        }
      } catch (e_13_1) {
        e_13 = { error: e_13_1 };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_13) throw e_13.error;
        }
      }
    }
    var params = {
      kind: "gameSetup",
      par,
      vpGoal: (_d = challenge === null || challenge === void 0 ? void 0 : challenge.vpMode.target) !== null && _d !== void 0 ? _d : 0,
      cardSpecs: [],
      eventSpecs: []
    };
    try {
      for (var relicCards_1 = __values5(relicCards), relicCards_1_1 = relicCards_1.next(); !relicCards_1_1.done; relicCards_1_1 = relicCards_1.next()) {
        var relicCard = relicCards_1_1.value;
        if (!(relicCard instanceof Relic))
          continue;
        var metaReplacers = relicCard.metaReplacers();
        try {
          for (var metaReplacers_2 = (e_15 = void 0, __values5(metaReplacers)), metaReplacers_2_1 = metaReplacers_2.next(); !metaReplacers_2_1.done; metaReplacers_2_1 = metaReplacers_2.next()) {
            var replacer = metaReplacers_2_1.value;
            if (replacer.kind !== "gameSetup")
              continue;
            var replaceFn = replacer.replace;
            var nextParams = replaceFn(params, state, relicCard);
            var parDelta = nextParams.par - params.par;
            if (parDelta !== 0) {
              parts.push("".concat(signedAmount(parDelta), " for ").concat(relicCard.name));
            }
            params = nextParams;
          }
        } catch (e_15_1) {
          e_15 = { error: e_15_1 };
        } finally {
          try {
            if (metaReplacers_2_1 && !metaReplacers_2_1.done && (_c = metaReplacers_2.return)) _c.call(metaReplacers_2);
          } finally {
            if (e_15) throw e_15.error;
          }
        }
      }
    } catch (e_14_1) {
      e_14 = { error: e_14_1 };
    } finally {
      try {
        if (relicCards_1_1 && !relicCards_1_1.done && (_b = relicCards_1.return)) _b.call(relicCards_1);
      } finally {
        if (e_14) throw e_14.error;
      }
    }
    params.par = Math.max(0, params.par);
    parts.push("= ".concat(params.par));
    return parts.join(", ");
  }
  function stageTooltipTexts(state) {
    return BASE_PARS.map(function(basePar, stage) {
      if (basePar === void 0)
        return null;
      if (stage < state.data.stage) {
        var replayData = state.data.stageReplays[stage];
        if (replayData !== null) {
          return describeParCalculation(stage, replayData.challenge, replayData.spec.relics, state);
        }
      }
      if (stage === state.data.stage && state.data.challenges.length === 1) {
        return describeParCalculation(stage, state.data.challenges[0], state.data.relics, state);
      }
      return describeBasePar(stage, state);
    });
  }
  function trigger2(e, state) {
    return __awaiter4(this, void 0, void 0, function() {
      var _a, _b, relic, metaTriggers, metaTriggers_1, metaTriggers_1_1, rawTrigger, trigger_2, handles, e_16_1, e_17_1;
      var e_17, _c, e_16, _d;
      return __generator4(this, function(_e) {
        switch (_e.label) {
          case 0:
            _e.trys.push([0, 11, 12, 13]);
            _a = __values5(state.data.relics), _b = _a.next();
            _e.label = 1;
          case 1:
            if (!!_b.done) return [3, 10];
            relic = _b.value;
            metaTriggers = relic.metaTriggers();
            if (!metaTriggers) return [3, 9];
            _e.label = 2;
          case 2:
            _e.trys.push([2, 7, 8, 9]);
            metaTriggers_1 = (e_16 = void 0, __values5(metaTriggers)), metaTriggers_1_1 = metaTriggers_1.next();
            _e.label = 3;
          case 3:
            if (!!metaTriggers_1_1.done) return [3, 6];
            rawTrigger = metaTriggers_1_1.value;
            if (!(rawTrigger.kind === e.kind)) return [3, 5];
            trigger_2 = rawTrigger;
            handles = trigger_2.handles(e, state, relic);
            if (!handles) return [3, 5];
            return [4, trigger_2.transform(e, state, relic)(state)];
          case 4:
            _e.sent();
            _e.label = 5;
          case 5:
            metaTriggers_1_1 = metaTriggers_1.next();
            return [3, 3];
          case 6:
            return [3, 9];
          case 7:
            e_16_1 = _e.sent();
            e_16 = { error: e_16_1 };
            return [3, 9];
          case 8:
            try {
              if (metaTriggers_1_1 && !metaTriggers_1_1.done && (_d = metaTriggers_1.return)) _d.call(metaTriggers_1);
            } finally {
              if (e_16) throw e_16.error;
            }
            return [
              7
              /*endfinally*/
            ];
          case 9:
            _b = _a.next();
            return [3, 1];
          case 10:
            return [3, 13];
          case 11:
            e_17_1 = _e.sent();
            e_17 = { error: e_17_1 };
            return [3, 13];
          case 12:
            try {
              if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            } finally {
              if (e_17) throw e_17.error;
            }
            return [
              7
              /*endfinally*/
            ];
          case 13:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function makeSpec(state, challenge, selectedChallengeIndex) {
    var e_18, _a;
    var _b;
    var par = BASE_PARS[state.data.stage];
    par += scarcityParAdjustment(state.data.stage, state);
    var vpTarget = challenge.vpMode.target;
    var cards = challenge.vpMode.cards.slice();
    var events = challenge.vpMode.events.slice();
    var stageCurse = selectedCurseForChallenge(challenge, state);
    if (stageCurse !== null) {
      events.push.apply(events, __spreadArray6([], __read7(stageCurse.events), false));
      vpTarget = Math.ceil(vpTarget * ((_b = stageCurse.vpTargetMultiplier) !== null && _b !== void 0 ? _b : 1));
    }
    try {
      for (var _c = __values5(challenge.boons), _d = _c.next(); !_d.done; _d = _c.next()) {
        var boon = _d.value;
        par += boon.parAdjustment;
        cards.push.apply(cards, __spreadArray6([], __read7(boon.cards), false));
        events.push.apply(events, __spreadArray6([], __read7(boon.events), false));
      }
    } catch (e_18_1) {
      e_18 = { error: e_18_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_18) throw e_18.error;
      }
    }
    var sortedCollectedCards = __spreadArray6([], __read7(state.data.collectedCards), false).sort(function(a2, b) {
      return coinKey(a2) - coinKey(b);
    });
    var sortedCollectedEvents = __spreadArray6([], __read7(state.data.collectedEvents), false).sort(function(a2, b) {
      return energyEventKey(a2) - energyEventKey(b);
    });
    cards.push.apply(cards, __spreadArray6([], __read7(sortedCollectedCards), false));
    events.push.apply(events, __spreadArray6([], __read7(sortedCollectedEvents), false));
    if (state.debugEnabled) {
      var cheatSpec_1 = getSpecByName("Cheat");
      if (cheatSpec_1 !== null && !events.some(function(event) {
        return event.name === cheatSpec_1.name;
      })) {
        events.push(cheatSpec_1);
      }
    }
    var gameSetupParams = applyMetaReplacers({
      kind: "gameSetup",
      par,
      vpGoal: vpTarget,
      cardSpecs: cards,
      eventSpecs: events
    }, state);
    var finalCards = gameSetupParams.cardSpecs;
    var finalEvents = gameSetupParams.eventSpecs;
    var finalPar = Math.max(0, gameSetupParams.par);
    return {
      vp: gameSetupParams.vpGoal,
      par: finalPar,
      buffer: state.data.buffer,
      cards: finalCards,
      events: finalEvents,
      potions: state.data.potions,
      relics: state.data.relics,
      metaStage: state.data.stage,
      metaStageScores: __spreadArray6([], __read7(state.data.stageScores), false),
      metaStagePars: __spreadArray6([], __read7(state.data.stagePars), false),
      metaStageTooltips: stageTooltipTexts(state),
      metaCursesEnabled: state.cursesEnabled,
      selectedChallengeIndex,
      collectedCards: sortedCollectedCards,
      collectedEvents: sortedCollectedEvents
    };
  }
  function getRewardOptionCount(state, rewardKind) {
    var params = applyMetaReplacers({
      kind: "reward",
      optionCount: 3,
      pickBufferAdjustments: [],
      rewardKind
    }, state);
    return params.optionCount;
  }
  function relicAvailableOnStage(relic, stage) {
    var _a, _b;
    var minStage = (_a = relic.minStage) !== null && _a !== void 0 ? _a : 0;
    var maxStage = (_b = relic.maxStage) !== null && _b !== void 0 ? _b : TOTAL_STAGES - 1;
    return minStage <= stage && stage <= maxStage;
  }
  function standardRelicRewards() {
    return relicRewards;
  }
  function sampleEligibleRelicRewards(generator, count, state) {
    var e_19, _a;
    var blockedNames = new Set(state.data.relics.map(function(relic2) {
      return relic2.spec.name;
    }));
    var result = [];
    try {
      for (var _b = __values5(generator.permute(standardRelicRewards())), _c = _b.next(); !_c.done; _c = _b.next()) {
        var relic = _c.value;
        if (blockedNames.has(relic.name))
          continue;
        if (!relicAvailableOnStage(relic, state.data.stage))
          continue;
        result.push(relic);
        blockedNames.add(relic.name);
        if (result.length >= count)
          break;
      }
    } catch (e_19_1) {
      e_19 = { error: e_19_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_19) throw e_19.error;
      }
    }
    return result;
  }
  function sampleEligibleRelicReward(generator, state) {
    var sampled = sampleEligibleRelicRewards(generator, 1, state)[0];
    if (!sampled) {
      throw new Error("No eligible relic rewards for stage ".concat(state.data.stage + 1));
    }
    return sampled;
  }
  function nextDistinctByName(ordered, used, fallbackIndex) {
    var next = ordered.find(function(item) {
      return !used.has(item.name);
    });
    if (next !== void 0) {
      used.add(next.name);
      return next;
    }
    var fallback = ordered[fallbackIndex.value % ordered.length];
    fallbackIndex.value += 1;
    return fallback;
  }
  function sampleChallengesForStage(state, count, challengeTests) {
    var _a, _b, _c;
    if (challengeTests === void 0) {
      challengeTests = [];
    }
    var stage = state.data.stage;
    var generator = state.generator("challenges".concat(stage));
    var vpModeOrder = generator.permute(vpModes);
    var isFinalStage = stage === TOTAL_STAGES - 1;
    var boonOrder = isFinalStage ? [] : generator.permute(boons);
    var curseLevel = stageCurseLevel(stage, state);
    var cursePool = curseLevel === "minor" ? allMinorCurses() : curseLevel === "major" ? allMajorCurses() : [];
    var curseOrder = cursePool.length > 0 ? generator.permute(cursePool) : [];
    var usedVPModes = /* @__PURE__ */ new Set();
    var usedBoons = /* @__PURE__ */ new Set();
    var usedCurses = /* @__PURE__ */ new Set();
    var vpFallbackIndex = { value: 0 };
    var boonFallbackIndex = { value: 0 };
    var curseFallbackIndex = { value: 0 };
    var result = [];
    for (var pathIndex = 0; pathIndex < count; pathIndex++) {
      var overrides = challengeOverridesForStage(challengeTests, stage, pathIndex);
      var vpMode = (_a = overrides.vpMode) !== null && _a !== void 0 ? _a : nextDistinctByName(vpModeOrder, usedVPModes, vpFallbackIndex);
      usedVPModes.add(vpMode.name);
      var challengeBoons = [];
      if (!isFinalStage) {
        var boon = (_b = overrides.boon) !== null && _b !== void 0 ? _b : nextDistinctByName(boonOrder, usedBoons, boonFallbackIndex);
        usedBoons.add(boon.name);
        challengeBoons = [boon];
      }
      var curse = (_c = overrides.curse) !== null && _c !== void 0 ? _c : null;
      if (curse === null && curseOrder.length > 0) {
        curse = nextDistinctByName(curseOrder, usedCurses, curseFallbackIndex);
      }
      result.push({
        stage,
        vpMode,
        boons: challengeBoons,
        curse
      });
    }
    return result;
  }
  function orderedBurdenCandidates(_state, generator) {
    var e_20, _a;
    var weighted = [];
    try {
      for (var burdenRegistry_1 = __values5(burdenRegistry), burdenRegistry_1_1 = burdenRegistry_1.next(); !burdenRegistry_1_1.done; burdenRegistry_1_1 = burdenRegistry_1.next()) {
        var definition = burdenRegistry_1_1.value;
        var weight = Math.max(1, definition.weight);
        for (var index = 0; index < weight; index++) {
          weighted.push(definition);
        }
      }
    } catch (e_20_1) {
      e_20 = { error: e_20_1 };
    } finally {
      try {
        if (burdenRegistry_1_1 && !burdenRegistry_1_1.done && (_a = burdenRegistry_1.return)) _a.call(burdenRegistry_1);
      } finally {
        if (e_20) throw e_20.error;
      }
    }
    return generator.permute(weighted);
  }
  function sampleBurdenState(state, generator) {
    return __awaiter4(this, void 0, void 0, function() {
      var stage, burdenParams, numOptions, numPicked, ordered, options, chosenIDs, ordered_1, ordered_1_1, definition;
      var e_21, _a;
      return __generator4(this, function(_b) {
        switch (_b.label) {
          case 0:
            stage = state.data.stage;
            burdenParams = applyMetaReplacers({
              kind: "burden",
              numOptions: 2,
              numPicked: 1
            }, state);
            return [4, trigger2({ kind: "burdenGeneration" }, state)];
          case 1:
            _b.sent();
            numOptions = Math.max(1, burdenParams.numOptions);
            numPicked = Math.max(1, Math.min(burdenParams.numPicked, numOptions));
            ordered = orderedBurdenCandidates(state, generator);
            options = [];
            chosenIDs = /* @__PURE__ */ new Set();
            try {
              for (ordered_1 = __values5(ordered), ordered_1_1 = ordered_1.next(); !ordered_1_1.done; ordered_1_1 = ordered_1.next()) {
                definition = ordered_1_1.value;
                if (chosenIDs.has(definition.id))
                  continue;
                if (definition.minStage > stage || stage > definition.maxStage)
                  continue;
                if (!definition.applies(state))
                  continue;
                options.push(definition.createOption(state, generator));
                chosenIDs.add(definition.id);
                if (options.length === numOptions)
                  break;
              }
            } catch (e_21_1) {
              e_21 = { error: e_21_1 };
            } finally {
              try {
                if (ordered_1_1 && !ordered_1_1.done && (_a = ordered_1.return)) _a.call(ordered_1);
              } finally {
                if (e_21) throw e_21.error;
              }
            }
            if (options.length < numOptions) {
              throw new Error("No valid burden options for stage ".concat(state.data.stage + 1));
            }
            return [2, {
              options,
              selectedIndex: null,
              selectedIndices: [],
              numPicked
            }];
        }
      });
    });
  }
  function normalizePathOptionSpec(path) {
    if (typeof path === "string")
      return { label: path, onSelectEffects: [] };
    return {
      label: path.label,
      onSelectEffects: (path.onSelectEffects || []).map(function(effect) {
        return __assign3({}, effect);
      })
    };
  }
  function getNumChallengeOptions(state) {
    var params = applyMetaReplacers({
      kind: "pathRewards",
      rewardsPerPath: 2,
      paths: ["Go left", "Go right"],
      numBurdens: 0,
      numChallengeOptions: 2
    }, state);
    return params.numChallengeOptions;
  }
  function makePaths(state) {
    return __awaiter4(this, void 0, void 0, function() {
      var stage, generator, baseRewardsPerPath, basePaths, baseNumBurdens, pathRewardParams, rewardsPerPath, pathOptions, pathCount, numBurdens, rewardsPerSet, fullSet, totalRewards, completeSets, partialSetRewards, rewardPool, i, shuffledRewards, paths, pathIndex, start, end, pathOption;
      var _a;
      return __generator4(this, function(_b) {
        switch (_b.label) {
          case 0:
            stage = state.data.stage;
            generator = state.generator("paths".concat(stage)).newGenerator();
            baseRewardsPerPath = 2;
            basePaths = ["Go left", "Go right"];
            baseNumBurdens = state.burdensEnabled && stage > 0 ? 1 : 0;
            pathRewardParams = applyMetaReplacers({
              kind: "pathRewards",
              rewardsPerPath: baseRewardsPerPath,
              paths: basePaths,
              numBurdens: baseNumBurdens,
              numChallengeOptions: 2
            }, state);
            return [4, trigger2({
              kind: "path",
              baseRewardsPerPath,
              rewardsPerPath: pathRewardParams.rewardsPerPath,
              baseNumBurdens,
              numBurdens: pathRewardParams.numBurdens
            }, state)];
          case 1:
            _b.sent();
            rewardsPerPath = pathRewardParams.rewardsPerPath;
            pathOptions = pathRewardParams.paths.map(normalizePathOptionSpec);
            pathCount = pathOptions.length;
            numBurdens = Math.max(0, pathRewardParams.numBurdens);
            rewardsPerSet = 6;
            fullSet = ["card", "card", "event", "encounter", "potion", "relic"];
            totalRewards = pathCount * rewardsPerPath;
            completeSets = Math.floor(totalRewards / rewardsPerSet);
            partialSetRewards = totalRewards % rewardsPerSet;
            rewardPool = [];
            for (i = 0; i < completeSets; i++)
              rewardPool.push.apply(rewardPool, __spreadArray6([], __read7(fullSet), false));
            if (partialSetRewards > 0)
              rewardPool.push.apply(rewardPool, __spreadArray6([], __read7(generator.samples(fullSet, partialSetRewards)), false));
            shuffledRewards = generator.permute(rewardPool);
            paths = [];
            for (pathIndex = 0; pathIndex < pathCount; pathIndex++) {
              start = pathIndex * rewardsPerPath;
              end = start + rewardsPerPath;
              pathOption = pathOptions[pathIndex];
              paths.push({
                label: (_a = pathOption === null || pathOption === void 0 ? void 0 : pathOption.label) !== null && _a !== void 0 ? _a : "Path",
                onSelectEffects: (pathOption === null || pathOption === void 0 ? void 0 : pathOption.onSelectEffects) || [],
                rewards: shuffledRewards.slice(start, end),
                burdens: numBurdens
              });
            }
            return [2, paths];
        }
      });
    });
  }
  function pathFromSkeleton(skeleton) {
    var e_22, _a;
    var rewardStates = [];
    try {
      for (var _b = __values5(skeleton.rewards), _c = _b.next(); !_c.done; _c = _b.next()) {
        var rewardKind = _c.value;
        if (rewardKind === "encounter") {
          rewardStates.push({ kind: "encounter", encounter: null, data: null });
        } else if (rewardKind === "relic") {
          rewardStates.push({ kind: "relic", options: [], selectedIndex: null });
        } else if (rewardKind === "card") {
          rewardStates.push({ kind: "card", options: [], selectedIndex: null });
        } else if (rewardKind === "event") {
          rewardStates.push({ kind: "event", options: [], selectedIndex: null });
        } else if (rewardKind === "potion") {
          rewardStates.push({ kind: "potion", options: [], selectedIndex: null });
        }
      }
    } catch (e_22_1) {
      e_22 = { error: e_22_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_22) throw e_22.error;
      }
    }
    var burdenStates = [];
    for (var index = 0; index < skeleton.burdens; index++) {
      burdenStates.push({ options: [], selectedIndex: null, selectedIndices: [], numPicked: 1 });
    }
    return {
      label: skeleton.label,
      onSelectEffects: __spreadArray6([], __read7(skeleton.onSelectEffects), false),
      rewardStates,
      burdenStates
    };
  }
  var Undo2 = (
    /** @class */
    (function(_super) {
      __extends2(Undo3, _super);
      function Undo3(gameHistory, gameRedo, macros, viewingMacros) {
        if (gameHistory === void 0) {
          gameHistory = [];
        }
        if (gameRedo === void 0) {
          gameRedo = [];
        }
        if (macros === void 0) {
          macros = null;
        }
        if (viewingMacros === void 0) {
          viewingMacros = null;
        }
        var _this = _super.call(this, "Undo") || this;
        _this.gameHistory = gameHistory;
        _this.gameRedo = gameRedo;
        _this.macros = macros;
        _this.viewingMacros = viewingMacros;
        Object.setPrototypeOf(_this, Undo3.prototype);
        return _this;
      }
      return Undo3;
    })(Error)
  );
  var Redo = (
    /** @class */
    (function(_super) {
      __extends2(Redo2, _super);
      function Redo2() {
        var _this = _super.call(this, "Redo") || this;
        Object.setPrototypeOf(_this, Redo2.prototype);
        return _this;
      }
      return Redo2;
    })(Error)
  );
  var ReplayStage = (
    /** @class */
    (function(_super) {
      __extends2(ReplayStage2, _super);
      function ReplayStage2(stage) {
        var _this = _super.call(this, "ReplayStage") || this;
        _this.stage = stage;
        Object.setPrototypeOf(_this, ReplayStage2.prototype);
        return _this;
      }
      return ReplayStage2;
    })(Error)
  );
  var ExitToLauncher = (
    /** @class */
    (function(_super) {
      __extends2(ExitToLauncher2, _super);
      function ExitToLauncher2() {
        var _this = _super.call(this, "ExitToLauncher") || this;
        Object.setPrototypeOf(_this, ExitToLauncher2.prototype);
        return _this;
      }
      return ExitToLauncher2;
    })(Error)
  );
  function cloneGameSpec(spec) {
    return __assign3(__assign3({}, spec), { buffer: spec.buffer, cards: __spreadArray6([], __read7(spec.cards), false), events: __spreadArray6([], __read7(spec.events), false), potions: __spreadArray6([], __read7(spec.potions), false), relics: __spreadArray6([], __read7(spec.relics), false), metaStageScores: spec.metaStageScores ? __spreadArray6([], __read7(spec.metaStageScores), false) : void 0, metaStagePars: spec.metaStagePars ? __spreadArray6([], __read7(spec.metaStagePars), false) : void 0, metaStageTooltips: spec.metaStageTooltips ? __spreadArray6([], __read7(spec.metaStageTooltips), false) : void 0, replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray6([], __read7(spec.replayUsedPotionIDs), false) : void 0, selectedChallengeIndex: spec.selectedChallengeIndex, collectedCards: spec.collectedCards ? __spreadArray6([], __read7(spec.collectedCards), false) : void 0, collectedEvents: spec.collectedEvents ? __spreadArray6([], __read7(spec.collectedEvents), false) : void 0 });
  }
  function cloneStageReplayData(replayData) {
    return __assign3(__assign3({}, replayData), { challenge: __assign3(__assign3({}, replayData.challenge), { boons: __spreadArray6([], __read7(replayData.challenge.boons), false) }), spec: cloneGameSpec(replayData.spec), history: __spreadArray6([], __read7(replayData.history), false), potionsRemaining: __spreadArray6([], __read7(replayData.potionsRemaining), false) });
  }
  function replayUsedPotionIDs(replayData) {
    var remainingIDs = new Set(replayData.potionsRemaining.map(function(p) {
      return p.id;
    }));
    return replayData.spec.potions.map(function(p) {
      return p.id;
    }).filter(function(id) {
      return !remainingIDs.has(id);
    });
  }
  function usedPotionNames(startingPotions, remainingPotions) {
    var remainingIDs = new Set(remainingPotions.map(function(potion) {
      return potion.id;
    }));
    return startingPotions.filter(function(potion) {
      return !remainingIDs.has(potion.id);
    }).map(function(potion) {
      return displayName(potion.spec);
    });
  }
  function sampleRewardOptionsByBaseName(generator, allOptions, count, collected) {
    var e_23, _a;
    var blockedBaseNames = new Set(collected.map(function(spec2) {
      return spec2.name;
    }));
    var result = [];
    try {
      for (var _b = __values5(generator.permute(allOptions)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var spec = _c.value;
        if (blockedBaseNames.has(spec.name))
          continue;
        result.push(spec);
        blockedBaseNames.add(spec.name);
        if (result.length >= count)
          break;
      }
    } catch (e_23_1) {
      e_23 = { error: e_23_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_23) throw e_23.error;
      }
    }
    return result;
  }
  function replaySpecForStage(state, replayData) {
    return __assign3(__assign3({}, cloneGameSpec(replayData.spec)), { buffer: replayData.bufferBeforeCourse, metaStage: replayData.stage, metaStageScores: __spreadArray6([], __read7(state.data.stageScores), false), metaStagePars: __spreadArray6([], __read7(state.data.stagePars), false), metaStageTooltips: stageTooltipTexts(state), previousScore: replayData.score, replayUsedPotionIDs: replayUsedPotionIDs(replayData), replayStage: replayData.stage });
  }
  var replaySimulationUI = {
    chooseCard: function(_state, _prompt, _options) {
      return __awaiter4(void 0, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          return [2, null];
        });
      });
    },
    playGame: function(_spec_1) {
      var args_1 = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
      }
      return __awaiter4(void 0, __spreadArray6([_spec_1], __read7(args_1), false), void 0, function(_spec, _gameHistory, _gameRedo, _macros, _viewingMacros, _onProgress) {
        if (_gameHistory === void 0) {
          _gameHistory = [];
        }
        if (_gameRedo === void 0) {
          _gameRedo = [];
        }
        if (_macros === void 0) {
          _macros = null;
        }
        if (_viewingMacros === void 0) {
          _viewingMacros = false;
        }
        if (_onProgress === void 0) {
          _onProgress = null;
        }
        return __generator4(this, function(_a) {
          throw new Error("Replay simulation does not support playGame");
        });
      });
    },
    waitForChallenge: function() {
      return __awaiter4(void 0, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          throw new Error("Replay simulation does not support waitForChallenge");
        });
      });
    },
    pickPath: function() {
      return __awaiter4(void 0, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          throw new Error("Replay simulation does not support pickPath");
        });
      });
    },
    chooseOption: function(_state, _prompt, _options) {
      return __awaiter4(void 0, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          return [2, null];
        });
      });
    },
    showMessage: function() {
      return __awaiter4(void 0, void 0, void 0, function() {
        return __generator4(this, function(_a) {
          return [
            2
            /*return*/
          ];
        });
      });
    },
    updateBuffer: function() {
    }
  };
  function computeReplayBufferAfterCourse(replayData, score) {
    return __awaiter4(this, void 0, void 0, function() {
      var simulationState, data;
      return __generator4(this, function(_a) {
        switch (_a.label) {
          case 0:
            simulationState = new MetaState(replaySimulationUI, "replay-sim");
            data = {
              stage: replayData.stage,
              phase: "stage_select",
              challenges: [],
              availablePaths: [],
              stageScores: Array(TOTAL_STAGES).fill(null),
              stagePars: Array(TOTAL_STAGES).fill(null),
              stageReplays: Array(TOTAL_STAGES).fill(null),
              timeline: [],
              buffer: replayData.bufferBeforeCourse,
              rewardStates: [],
              burdenStates: [],
              collectedCards: [],
              collectedEvents: [],
              potions: __spreadArray6([], __read7(replayData.spec.potions), false),
              relics: __spreadArray6([], __read7(replayData.spec.relics), false),
              nextID: 1,
              gameHistory: [],
              gameRedo: []
            };
            simulationState.data = data;
            simulationState.checkpoint = data;
            return [4, endCourse(score, replayData.par, simulationState)];
          case 1:
            _a.sent();
            return [2, simulationState.data.buffer];
        }
      });
    });
  }
  function applyReplayResultToAllSnapshots(state, stage, replayData, bufferAdjustment) {
    state.mutateAllSnapshots(function(snapshot) {
      var stageScores = __spreadArray6([], __read7(snapshot.stageScores), false);
      stageScores[stage] = replayData.score;
      snapshot.stageScores = stageScores;
      var stagePars = __spreadArray6([], __read7(snapshot.stagePars), false);
      stagePars[stage] = replayData.par;
      snapshot.stagePars = stagePars;
      var stageReplays = __spreadArray6([], __read7(snapshot.stageReplays), false);
      stageReplays[stage] = cloneStageReplayData(replayData);
      snapshot.stageReplays = stageReplays;
      snapshot.buffer += bufferAdjustment;
    });
  }
  function replayCompletedStage(state, stage) {
    return __awaiter4(this, void 0, void 0, function() {
      var replayData, replayResult, e_24, macros, viewingMacros, newBufferAfterCourse, updatedReplayData, bufferAdjustment, usedPotions, stageTimelineEntry;
      var _a, _b, _c, _d;
      return __generator4(this, function(_e) {
        switch (_e.label) {
          case 0:
            replayData = state.data.stageReplays[stage];
            if (replayData === null || replayData === void 0)
              return [
                2
                /*return*/
              ];
            _e.label = 1;
          case 1:
            _e.trys.push([1, 3, , 4]);
            return [4, state.ui.playGame(replaySpecForStage(state, replayData), replayData.history, [], state.global.macros, state.global.viewingMacros, null, "nothing")];
          case 2:
            replayResult = _e.sent();
            return [3, 4];
          case 3:
            e_24 = _e.sent();
            if (e_24 instanceof Undo2) {
              macros = (_a = e_24.macros) !== null && _a !== void 0 ? _a : state.global.macros;
              viewingMacros = (_b = e_24.viewingMacros) !== null && _b !== void 0 ? _b : state.global.viewingMacros;
              state.updateGlobal({ macros, viewingMacros });
              return [
                2
                /*return*/
              ];
            }
            if (e_24 instanceof Redo)
              return [
                2
                /*return*/
              ];
            throw e_24;
          case 4:
            state.updateGlobal({
              macros: (_c = replayResult.macros) !== null && _c !== void 0 ? _c : state.global.macros,
              viewingMacros: (_d = replayResult.viewingMacros) !== null && _d !== void 0 ? _d : state.global.viewingMacros
            });
            return [4, computeReplayBufferAfterCourse(replayData, replayResult.score)];
          case 5:
            newBufferAfterCourse = _e.sent();
            updatedReplayData = __assign3(__assign3({}, replayData), { score: replayResult.score, history: __spreadArray6([], __read7(replayResult.history), false), potionsRemaining: __spreadArray6([], __read7(replayResult.potionsRemaining), false), bufferAfterCourse: newBufferAfterCourse });
            bufferAdjustment = newBufferAfterCourse - replayData.bufferAfterCourse;
            usedPotions = usedPotionNames(replayData.spec.potions, replayResult.potionsRemaining);
            applyReplayResultToAllSnapshots(state, stage, updatedReplayData, bufferAdjustment);
            stageTimelineEntry = {
              kind: "stage",
              stage,
              challenge: challengeSummaryWithState(updatedReplayData.challenge, state),
              score: replayResult.score,
              par: updatedReplayData.par,
              usedPotions
            };
            state.update({
              timeline: upsertStageTimelineEntry(state.data.timeline, stageTimelineEntry)
            });
            state.ui.updateBuffer(state);
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function materializePath(state, path) {
    return __awaiter4(this, void 0, void 0, function() {
      var rewardStates, burdenGenerator, burdenStates, _a, _b, burdenState, _c, _d, e_25_1;
      var e_25, _e;
      return __generator4(this, function(_f) {
        switch (_f.label) {
          case 0:
            rewardStates = path.rewardStates.map(function(rs) {
              if (rs.kind === "encounter" && rs.encounter === null) {
                var generator = state.generator("encounter").newGenerator();
                return getEncounterState(state, generator, state.data.stage);
              } else if (rs.kind === "card" && rs.options.length === 0) {
                var generator = state.generator("rewardscard").newGenerator();
                return {
                  kind: "card",
                  options: sampleRewardOptionsByBaseName(generator, cardRewards, getRewardOptionCount(state, "card"), state.data.collectedCards),
                  selectedIndex: null
                };
              } else if (rs.kind === "event" && rs.options.length === 0) {
                var generator = state.generator("rewardsevent").newGenerator();
                return {
                  kind: "event",
                  options: sampleRewardOptionsByBaseName(generator, eventRewards, getRewardOptionCount(state, "event"), state.data.collectedEvents),
                  selectedIndex: null
                };
              } else if (rs.kind === "potion" && rs.options.length === 0) {
                var generator = state.generator("rewardspotion").newGenerator();
                return {
                  kind: "potion",
                  options: generator.samples(potionRewards, getRewardOptionCount(state, "potion")),
                  selectedIndex: null
                };
              } else if (rs.kind === "relic" && rs.options.length === 0) {
                var generator = state.generator("rewardsrelic").newGenerator();
                return {
                  kind: "relic",
                  options: sampleEligibleRelicRewards(generator, getRewardOptionCount(state, "relic"), state),
                  selectedIndex: null
                };
              }
              return rs;
            });
            burdenGenerator = state.generator("rewardsburden").newGenerator();
            burdenStates = [];
            _f.label = 1;
          case 1:
            _f.trys.push([1, 7, 8, 9]);
            _a = __values5(path.burdenStates), _b = _a.next();
            _f.label = 2;
          case 2:
            if (!!_b.done) return [3, 6];
            burdenState = _b.value;
            if (!(burdenState.options.length === 0)) return [3, 4];
            _d = (_c = burdenStates).push;
            return [4, sampleBurdenState(state, burdenGenerator)];
          case 3:
            _d.apply(_c, [_f.sent()]);
            return [3, 5];
          case 4:
            burdenStates.push(burdenState);
            _f.label = 5;
          case 5:
            _b = _a.next();
            return [3, 2];
          case 6:
            return [3, 9];
          case 7:
            e_25_1 = _f.sent();
            e_25 = { error: e_25_1 };
            return [3, 9];
          case 8:
            try {
              if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
            } finally {
              if (e_25) throw e_25.error;
            }
            return [
              7
              /*endfinally*/
            ];
          case 9:
            return [2, { rewardStates, burdenStates }];
        }
      });
    });
  }
  function applyPathOnSelectEffects(state, path) {
    return __awaiter4(this, void 0, void 0, function() {
      var _loop_2, _a, _b, effect;
      var e_26, _c;
      return __generator4(this, function(_d) {
        _loop_2 = function(effect2) {
          if (effect2.kind === "spendRelicCharge") {
            var relic = state.data.relics.find(function(candidate) {
              return candidate.id === effect2.relicID;
            });
            if (!relic)
              return "continue";
            var nextCharge = Math.max(relic.count("charge") - effect2.amount, 0);
            var tokens_1 = new Map(relic.tokens);
            tokens_1.set("charge", nextCharge);
            state.applyToRelic(function(current) {
              return current.update({ tokens: tokens_1 });
            }, relic);
          }
        };
        try {
          for (_a = __values5(path.onSelectEffects || []), _b = _a.next(); !_b.done; _b = _a.next()) {
            effect = _b.value;
            _loop_2(effect);
          }
        } catch (e_26_1) {
          e_26 = { error: e_26_1 };
        } finally {
          try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
          } finally {
            if (e_26) throw e_26.error;
          }
        }
        return [
          2
          /*return*/
        ];
      });
    });
  }
  function isRewardTestSpec(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "string";
  }
  function isTestSpec(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && Number.isInteger(value[0]) && isRewardTestSpec(value[1]);
  }
  function isChallengeStageTest(value) {
    return Array.isArray(value) && value.length === 2 && (value[0] === "vpMode" || value[0] === "boon" || value[0] === "curse") && (typeof value[1] === "string" || value[1] !== null && typeof value[1] === "object");
  }
  function isChallengeTestSpec(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && Number.isInteger(value[0]) && isChallengeStageTest(value[1]);
  }
  function isBurdenTestSpec(value) {
    var isGroup = Array.isArray(value) && value.length === 2 && Array.isArray(value[1]) && value[1].length === 2 && value[1][0] === "burden" && (typeof value[1][1] === "string" || Array.isArray(value[1][1]) && value[1][1].every(function(entry) {
      return typeof entry === "string";
    }));
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && Number.isInteger(value[0]) && (typeof value[1] === "string" || isGroup);
  }
  function isDebugTestConfig(value) {
    if (value === null || typeof value !== "object" || Array.isArray(value))
      return false;
    var record = value;
    var rewards = record.rewards;
    var challenges = record.challenges;
    var burdens = record.burdens;
    var allCards = record.allCards;
    var allEvents = record.allEvents;
    var allPotions = record.allPotions;
    var allRelics = record.allRelics;
    var allBurdens = record.allBurdens;
    var rewardsValid = rewards === void 0 || Array.isArray(rewards) && rewards.every(isTestSpec);
    var challengesValid = challenges === void 0 || Array.isArray(challenges) && challenges.every(isChallengeTestSpec);
    var burdensValid = burdens === void 0 || Array.isArray(burdens) && burdens.every(isBurdenTestSpec);
    var allCardsValid = allCards === void 0 || typeof allCards === "boolean";
    var allEventsValid = allEvents === void 0 || typeof allEvents === "boolean";
    var allPotionsValid = allPotions === void 0 || typeof allPotions === "boolean";
    var allRelicsValid = allRelics === void 0 || typeof allRelics === "boolean";
    var allBurdensValid = allBurdens === void 0 || typeof allBurdens === "boolean";
    return rewardsValid && challengesValid && burdensValid && allCardsValid && allEventsValid && allPotionsValid && allRelicsValid && allBurdensValid;
  }
  function normalizeTests(test2) {
    if (test2 === null)
      return { rewards: [], challenges: [], burdens: [] };
    if (isDebugTestConfig(test2)) {
      var rewards = test2.rewards ? __spreadArray6([], __read7(test2.rewards), false) : [];
      var bulkStage = 1;
      if (test2.allCards) {
        rewards.push([bulkStage, ["card", __spreadArray6([], __read7(cardRewards), false)]]);
      }
      if (test2.allEvents) {
        rewards.push([bulkStage, ["event", __spreadArray6([], __read7(eventRewards), false)]]);
      }
      if (test2.allPotions) {
        rewards.push([bulkStage, ["potion", __spreadArray6([], __read7(potionRewards), false)]]);
      }
      if (test2.allRelics) {
        rewards.push([bulkStage, ["relic", __spreadArray6([], __read7(relicRewards), false)]]);
      }
      var burdens = test2.burdens ? __spreadArray6([], __read7(test2.burdens), false) : [];
      if (test2.allBurdens) {
        burdens.push([bulkStage, ["burden", getRegisteredBurdenIds()]]);
      }
      return {
        rewards,
        challenges: test2.challenges ? __spreadArray6([], __read7(test2.challenges), false) : [],
        burdens
      };
    }
    if (isTestSpec(test2))
      return { rewards: [test2], challenges: [], burdens: [] };
    if (Array.isArray(test2) && test2.every(isTestSpec)) {
      return { rewards: __spreadArray6([], __read7(test2), false), challenges: [], burdens: [] };
    }
    throw new Error("Invalid debug test specification");
  }
  var warnedUnknownVPModeTests = /* @__PURE__ */ new Set();
  var warnedUnknownBoonTests = /* @__PURE__ */ new Set();
  var warnedUnknownCurseTests = /* @__PURE__ */ new Set();
  var warnedUnknownBurdenTests = /* @__PURE__ */ new Set();
  function resolveVPModeTestRef(ref) {
    var _a;
    if (typeof ref !== "string")
      return ref;
    var mode = (_a = vpModes.find(function(vpMode) {
      return vpMode.name === ref;
    })) !== null && _a !== void 0 ? _a : null;
    if (mode === null && !warnedUnknownVPModeTests.has(ref)) {
      warnedUnknownVPModeTests.add(ref);
      console.warn("Unknown vp mode in debug test config: ".concat(ref));
    }
    return mode;
  }
  function resolveBoonTestRef(ref) {
    var _a;
    if (typeof ref !== "string")
      return ref;
    var boon = (_a = boons.find(function(candidate) {
      return candidate.name === ref;
    })) !== null && _a !== void 0 ? _a : null;
    if (boon === null && !warnedUnknownBoonTests.has(ref)) {
      warnedUnknownBoonTests.add(ref);
      console.warn("Unknown boon in debug test config: ".concat(ref));
    }
    return boon;
  }
  function resolveCurseTestRef(ref) {
    if (typeof ref !== "string")
      return ref;
    var curse = findCurseByName(ref);
    if (curse !== null)
      return curse;
    if (!warnedUnknownCurseTests.has(ref)) {
      warnedUnknownCurseTests.add(ref);
      console.warn("Unknown curse in debug test config: ".concat(ref));
    }
    return null;
  }
  function resolveBurdenTestRef(ref) {
    var burden = burdenDefinitionById(ref);
    if (burden === null && !warnedUnknownBurdenTests.has(ref)) {
      warnedUnknownBurdenTests.add(ref);
      console.warn("Unknown burden in debug test config: ".concat(ref));
    }
    return burden;
  }
  function challengeOverridesForStage(tests, stageIndex, pathIndex) {
    var e_27, _a;
    if (pathIndex !== 0)
      return {};
    var stageNumber = stageIndex + 1;
    var overrides = {};
    try {
      for (var tests_1 = __values5(tests), tests_1_1 = tests_1.next(); !tests_1_1.done; tests_1_1 = tests_1.next()) {
        var _b = __read7(tests_1_1.value, 2), stage = _b[0], stageTest = _b[1];
        if (stage !== stageNumber)
          continue;
        if (stageTest[0] === "vpMode") {
          var mode = resolveVPModeTestRef(stageTest[1]);
          if (mode !== null)
            overrides.vpMode = mode;
        } else if (stageTest[0] === "boon") {
          var boon = resolveBoonTestRef(stageTest[1]);
          if (boon !== null)
            overrides.boon = boon;
        } else {
          var curse = resolveCurseTestRef(stageTest[1]);
          if (curse !== null)
            overrides.curse = curse;
        }
      }
    } catch (e_27_1) {
      e_27 = { error: e_27_1 };
    } finally {
      try {
        if (tests_1_1 && !tests_1_1.done && (_a = tests_1.return)) _a.call(tests_1);
      } finally {
        if (e_27) throw e_27.error;
      }
    }
    return overrides;
  }
  function rewardTestsForStage(tests, stageIndex) {
    var stageNumber = stageIndex + 1;
    return tests.filter(function(_a) {
      var _b = __read7(_a, 1), stage = _b[0];
      return stage === stageNumber;
    }).map(function(_a) {
      var _b = __read7(_a, 2), spec = _b[1];
      return spec;
    });
  }
  function burdenTestsForStage(tests, stageIndex) {
    var e_28, _a, e_29, _b;
    var stageNumber = stageIndex + 1;
    var result = [];
    try {
      for (var tests_2 = __values5(tests), tests_2_1 = tests_2.next(); !tests_2_1.done; tests_2_1 = tests_2.next()) {
        var _c = __read7(tests_2_1.value, 2), stage = _c[0], refOrGroup = _c[1];
        if (stage !== stageNumber)
          continue;
        if (typeof refOrGroup === "string") {
          var burden = resolveBurdenTestRef(refOrGroup);
          if (burden !== null)
            result.push([burden]);
          continue;
        }
        var refs = Array.isArray(refOrGroup[1]) ? refOrGroup[1] : [refOrGroup[1]];
        var group = [];
        var seen = /* @__PURE__ */ new Set();
        try {
          for (var refs_1 = (e_29 = void 0, __values5(refs)), refs_1_1 = refs_1.next(); !refs_1_1.done; refs_1_1 = refs_1.next()) {
            var ref = refs_1_1.value;
            var burden = resolveBurdenTestRef(ref);
            if (burden === null || seen.has(burden.id))
              continue;
            seen.add(burden.id);
            group.push(burden);
          }
        } catch (e_29_1) {
          e_29 = { error: e_29_1 };
        } finally {
          try {
            if (refs_1_1 && !refs_1_1.done && (_b = refs_1.return)) _b.call(refs_1);
          } finally {
            if (e_29) throw e_29.error;
          }
        }
        if (group.length > 0)
          result.push(group);
      }
    } catch (e_28_1) {
      e_28 = { error: e_28_1 };
    } finally {
      try {
        if (tests_2_1 && !tests_2_1.done && (_a = tests_2.return)) _a.call(tests_2);
      } finally {
        if (e_28) throw e_28.error;
      }
    }
    return result;
  }
  function makeTestBurdenState(state, burdenDefinitions) {
    var generator = state.generator("test");
    var options = burdenDefinitions.map(function(definition) {
      return definition.createOption(state, generator);
    });
    return {
      options,
      selectedIndex: null,
      selectedIndices: [],
      numPicked: 1
    };
  }
  function makeTestReward(state, spec) {
    switch (spec[0]) {
      case "potion":
      case "event":
      case "card": {
        var options = Array.isArray(spec[1]) ? __spreadArray6([], __read7(spec[1]), false) : [spec[1]];
        return { kind: spec[0], options, selectedIndex: null };
      }
      case "relic":
        return {
          kind: "relic",
          options: Array.isArray(spec[1]) ? __spreadArray6([], __read7(spec[1]), false) : [spec[1]],
          selectedIndex: null
        };
      case "encounter":
        var generator = state.generator("test");
        var encounter = spec[1];
        return {
          kind: "encounter",
          encounter,
          data: encounter.createInitialData(state, generator)
        };
    }
  }
  function playGame2(ui_1) {
    return __awaiter4(this, arguments, void 0, function(ui, test2, seed, initialSnapshot, onStateChange, debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled) {
      var state, tests, initialChallenges, initialPath, _a, _b, testSpec, initialBurdenTests, initialBurdenTests_1, initialBurdenTests_1_1, burdenDefinitions, _c, _d, _e, _loop_3, state_1;
      var e_30, _f, e_31, _g;
      var _h, _j;
      if (test2 === void 0) {
        test2 = null;
      }
      if (seed === void 0) {
        seed = null;
      }
      if (initialSnapshot === void 0) {
        initialSnapshot = null;
      }
      if (onStateChange === void 0) {
        onStateChange = null;
      }
      if (debugEnabled === void 0) {
        debugEnabled = false;
      }
      if (burdensEnabled === void 0) {
        burdensEnabled = false;
      }
      if (scarcityEnabled === void 0) {
        scarcityEnabled = false;
      }
      if (cursesEnabled === void 0) {
        cursesEnabled = false;
      }
      return __generator4(this, function(_k) {
        switch (_k.label) {
          case 0:
            state = initialSnapshot ? deserializeMetaGame(ui, initialSnapshot, null) : new MetaState(ui, seed, null, { debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled });
            state.setChangeListener(onStateChange ? function() {
              return onStateChange(serializeMetaGame(state));
            } : null);
            tests = state.debugEnabled ? normalizeTests(test2) : { rewards: [], challenges: [], burdens: [] };
            if (!!initialSnapshot) return [3, 2];
            initialChallenges = sampleChallengesForStage(state, getNumChallengeOptions(state), tests.challenges);
            initialPath = pathFromSkeleton({
              label: "Go left",
              onSelectEffects: [],
              rewards: ["card", "card", "event", "potion"],
              burdens: 0
            });
            try {
              for (_a = __values5(rewardTestsForStage(tests.rewards, 0)), _b = _a.next(); !_b.done; _b = _a.next()) {
                testSpec = _b.value;
                initialPath.rewardStates.push(makeTestReward(state, testSpec));
              }
            } catch (e_30_1) {
              e_30 = { error: e_30_1 };
            } finally {
              try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
              } finally {
                if (e_30) throw e_30.error;
              }
            }
            initialBurdenTests = burdenTestsForStage(tests.burdens, 0);
            try {
              for (initialBurdenTests_1 = __values5(initialBurdenTests), initialBurdenTests_1_1 = initialBurdenTests_1.next(); !initialBurdenTests_1_1.done; initialBurdenTests_1_1 = initialBurdenTests_1.next()) {
                burdenDefinitions = initialBurdenTests_1_1.value;
                initialPath.burdenStates.push(makeTestBurdenState(state, burdenDefinitions));
              }
            } catch (e_31_1) {
              e_31 = { error: e_31_1 };
            } finally {
              try {
                if (initialBurdenTests_1_1 && !initialBurdenTests_1_1.done && (_g = initialBurdenTests_1.return)) _g.call(initialBurdenTests_1);
              } finally {
                if (e_31) throw e_31.error;
              }
            }
            _d = (_c = state).replaceAndClearHistory;
            _e = [{}];
            return [4, materializePath(state, initialPath)];
          case 1:
            _d.apply(_c, [__assign3.apply(void 0, [__assign3.apply(void 0, _e.concat([_k.sent()])), { challenges: initialChallenges, phase: "stage_select", availablePaths: [] }])]);
            return [3, 3];
          case 2:
            if (onStateChange) {
              onStateChange(serializeMetaGame(state));
            }
            _k.label = 3;
          case 3:
            state.ui.updateBuffer(state);
            _loop_3 = function() {
              var sameReplay_1, stage, gameSpec, startingBuffer, _l, score, potionsRemaining, history_1, macros, viewingMacros, usedPotions, persistedMacros, persistedViewingMacros, stageReplays, stageTimelineEntry, nextStage, paths, _m, _o, testSpec2, pathBurdenTests, pathBurdenTests_1, pathBurdenTests_1_1, burdenDefinitions2, paths, path, _p, e_32, materialized, challenges, selectedChallenge, e_33, selectedChallengeIndex, e_34, persistedMacros, persistedViewingMacros;
              var e_35, _q, e_36, _r;
              return __generator4(this, function(_s) {
                switch (_s.label) {
                  case 0:
                    _s.trys.push([0, 31, , 32]);
                    if (!(state.data.phase === "in_game")) return [3, 6];
                    sameReplay_1 = function(a2, b) {
                      return a2.length === b.length && a2.every(function(value, index) {
                        return value === b[index];
                      });
                    };
                    stage = state.data.stage;
                    gameSpec = makeSpec(state, state.data.challenges[0], state.data.selectedChallengeIndex);
                    startingBuffer = state.data.buffer;
                    return [4, state.ui.playGame(gameSpec, state.data.gameHistory, state.data.gameRedo, state.global.macros, state.global.viewingMacros, function(progress) {
                      if (!sameReplay_1(state.data.gameHistory, progress.history) || !sameReplay_1(state.data.gameRedo, progress.redo)) {
                        state.update({
                          gameHistory: __spreadArray6([], __read7(progress.history), false),
                          gameRedo: __spreadArray6([], __read7(progress.redo), false)
                        });
                      }
                      state.updateGlobal({
                        macros: progress.macros,
                        viewingMacros: progress.viewingMacros
                      });
                    }, "leave")];
                  case 1:
                    _l = _s.sent(), score = _l.score, potionsRemaining = _l.potionsRemaining, history_1 = _l.history, macros = _l.macros, viewingMacros = _l.viewingMacros;
                    usedPotions = usedPotionNames(gameSpec.potions, potionsRemaining);
                    persistedMacros = macros !== null && macros !== void 0 ? macros : state.global.macros;
                    persistedViewingMacros = viewingMacros !== null && viewingMacros !== void 0 ? viewingMacros : state.global.viewingMacros;
                    state.updateGlobal({
                      macros: persistedMacros,
                      viewingMacros: persistedViewingMacros
                    });
                    state.update({
                      potions: potionsRemaining,
                      gameHistory: [],
                      gameRedo: []
                    });
                    return [4, endCourse(score, gameSpec.par, state)];
                  case 2:
                    _s.sent();
                    stageReplays = __spreadArray6([], __read7(state.data.stageReplays), false);
                    stageReplays[stage] = {
                      stage,
                      challenge: __assign3(__assign3({}, state.data.challenges[0]), { boons: __spreadArray6([], __read7(state.data.challenges[0].boons), false) }),
                      spec: cloneGameSpec(gameSpec),
                      score,
                      par: gameSpec.par,
                      history: __spreadArray6([], __read7(history_1), false),
                      potionsRemaining: __spreadArray6([], __read7(potionsRemaining), false),
                      bufferBeforeCourse: startingBuffer,
                      bufferAfterCourse: state.data.buffer
                    };
                    stageTimelineEntry = {
                      kind: "stage",
                      stage,
                      challenge: challengeSummaryWithState(state.data.challenges[0], state),
                      score,
                      par: gameSpec.par,
                      usedPotions
                    };
                    state.update({
                      stageReplays,
                      timeline: upsertStageTimelineEntry(state.data.timeline, stageTimelineEntry)
                    });
                    nextStage = state.data.stage + 1;
                    state.update({ stage: nextStage });
                    if (!(nextStage >= TOTAL_STAGES)) return [3, 4];
                    state.update({ phase: "game_over" });
                    return [4, state.ui.showMessage(state, "Congratulations! You have completed all stages!")];
                  case 3:
                    _s.sent();
                    return [2, { value: void 0 }];
                  case 4:
                    return [4, makePaths(state)];
                  case 5:
                    paths = _s.sent().map(function(skel) {
                      return pathFromSkeleton(skel);
                    });
                    try {
                      for (_m = (e_35 = void 0, __values5(rewardTestsForStage(tests.rewards, nextStage))), _o = _m.next(); !_o.done; _o = _m.next()) {
                        testSpec2 = _o.value;
                        paths[0].rewardStates.push(makeTestReward(state, testSpec2));
                      }
                    } catch (e_35_1) {
                      e_35 = { error: e_35_1 };
                    } finally {
                      try {
                        if (_o && !_o.done && (_q = _m.return)) _q.call(_m);
                      } finally {
                        if (e_35) throw e_35.error;
                      }
                    }
                    pathBurdenTests = burdenTestsForStage(tests.burdens, nextStage);
                    try {
                      for (pathBurdenTests_1 = (e_36 = void 0, __values5(pathBurdenTests)), pathBurdenTests_1_1 = pathBurdenTests_1.next(); !pathBurdenTests_1_1.done; pathBurdenTests_1_1 = pathBurdenTests_1.next()) {
                        burdenDefinitions2 = pathBurdenTests_1_1.value;
                        paths[0].burdenStates.push(makeTestBurdenState(state, burdenDefinitions2));
                      }
                    } catch (e_36_1) {
                      e_36 = { error: e_36_1 };
                    } finally {
                      try {
                        if (pathBurdenTests_1_1 && !pathBurdenTests_1_1.done && (_r = pathBurdenTests_1.return)) _r.call(pathBurdenTests_1);
                      } finally {
                        if (e_36) throw e_36.error;
                      }
                    }
                    state.replaceAndClearHistory({
                      phase: "path_select",
                      challenges: [],
                      rewardStates: [],
                      burdenStates: [],
                      availablePaths: paths
                    });
                    return [3, 30];
                  case 6:
                    if (!(state.data.phase === "path_select")) return [3, 19];
                    paths = state.data.availablePaths;
                    if (paths.length === 0) {
                      throw new Error("Invariant violation: path_select phase missing available paths");
                    }
                    path = void 0;
                    _s.label = 7;
                  case 7:
                    if (false) return [3, 16];
                    _s.label = 8;
                  case 8:
                    _s.trys.push([8, 12, , 15]);
                    if (!(paths.length > 1)) return [3, 10];
                    return [4, state.ui.pickPath(state, paths)];
                  case 9:
                    _p = _s.sent();
                    return [3, 11];
                  case 10:
                    _p = paths[0];
                    _s.label = 11;
                  case 11:
                    path = _p;
                    return [3, 16];
                  case 12:
                    e_32 = _s.sent();
                    if (!(e_32 instanceof ReplayStage)) return [3, 14];
                    return [4, replayCompletedStage(state, e_32.stage)];
                  case 13:
                    _s.sent();
                    return [3, 7];
                  case 14:
                    throw e_32;
                  case 15:
                    return [3, 7];
                  case 16:
                    return [4, applyPathOnSelectEffects(state, path)];
                  case 17:
                    _s.sent();
                    return [4, materializePath(state, path)];
                  case 18:
                    materialized = _s.sent();
                    challenges = sampleChallengesForStage(state, getNumChallengeOptions(state), tests.challenges);
                    state.replaceAndClearHistory(__assign3(__assign3({}, materialized), { challenges, phase: "stage_select", availablePaths: [] }));
                    return [3, 30];
                  case 19:
                    if (!(state.data.phase === "stage_select")) return [3, 29];
                    selectedChallenge = void 0;
                    _s.label = 20;
                  case 20:
                    if (false) return [3, 27];
                    _s.label = 21;
                  case 21:
                    _s.trys.push([21, 23, , 26]);
                    return [4, state.ui.waitForChallenge(state)];
                  case 22:
                    selectedChallenge = _s.sent();
                    return [3, 27];
                  case 23:
                    e_33 = _s.sent();
                    if (!(e_33 instanceof ReplayStage)) return [3, 25];
                    return [4, replayCompletedStage(state, e_33.stage)];
                  case 24:
                    _s.sent();
                    return [3, 20];
                  case 25:
                    throw e_33;
                  case 26:
                    return [3, 20];
                  case 27:
                    selectedChallengeIndex = state.data.challenges.indexOf(selectedChallenge);
                    state.update({ challenges: [selectedChallenge], selectedChallengeIndex, availablePaths: [] });
                    return [4, trigger2({ kind: "start", stage: state.data.stage }, state)];
                  case 28:
                    _s.sent();
                    if (state.data.burdenStates.some(function(burden) {
                      return !isBurdenResolved(burden);
                    })) {
                      throw new Error("Invariant violation: cannot start stage with unresolved burdens");
                    }
                    state.updateAndSetCheckpoint({
                      phase: "in_game",
                      rewardStates: [],
                      burdenStates: [],
                      gameHistory: [],
                      gameRedo: []
                    });
                    return [3, 30];
                  case 29:
                    return [2, { value: void 0 }];
                  case 30:
                    return [3, 32];
                  case 31:
                    e_34 = _s.sent();
                    if (e_34 instanceof Undo2) {
                      persistedMacros = (_h = e_34.macros) !== null && _h !== void 0 ? _h : state.global.macros;
                      persistedViewingMacros = (_j = e_34.viewingMacros) !== null && _j !== void 0 ? _j : state.global.viewingMacros;
                      state.updateGlobal({
                        macros: persistedMacros,
                        viewingMacros: persistedViewingMacros
                      });
                      state.undo({
                        gameHistory: e_34.gameHistory,
                        gameRedo: e_34.gameRedo
                      });
                    } else if (e_34 instanceof Redo) {
                      state.redo();
                    } else {
                      throw e_34;
                    }
                    return [3, 32];
                  case 32:
                    return [
                      2
                      /*return*/
                    ];
                }
              });
            };
            _k.label = 4;
          case 4:
            if (false) return [3, 6];
            return [5, _loop_3()];
          case 5:
            state_1 = _k.sent();
            if (typeof state_1 === "object")
              return [2, state_1.value];
            return [3, 4];
          case 6:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }

  // public/data/relics.js
  var __assign4 = function() {
    __assign4 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign4.apply(this, arguments);
  };
  var __awaiter5 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator5 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read8 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray7 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var __values6 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var bagOfCoins = {
    name: "Bag of Coins",
    triggers: [{
      kind: "beforeStart",
      text: ["At the start of the game, create two coppers in your discard."],
      simpleText: ["Start with two extra coppers."],
      handles: function() {
        return true;
      },
      transform: function() {
        return repeat(create(copper, "discard"), 2);
      }
    }]
  };
  addRelicReward(bagOfCoins);
  var bagOfPreparation = {
    name: "Bag of Preparation",
    staticReplacers: [{
      text: ["You can't lose actions other than by playing cards."],
      kind: "resource",
      handles: function(p) {
        return p.amount < 0 && p.resource == "actions";
      },
      replace: function(p) {
        return __assign4(__assign4({}, p), { amount: 0 });
      }
    }],
    triggers: [{
      kind: "afterStart",
      handles: function() {
        return true;
      },
      text: ["At the start of the game, +5 actions."],
      transform: function(_e, _s, c) {
        return gainActions(5, c);
      }
    }]
  };
  addRelicReward(bagOfPreparation);
  var courier = {
    name: "Courier",
    replacers: [{
      kind: "resource",
      text: ["".concat(refresh.name, " gives you 2 more buys.")],
      handles: function(e, s, c) {
        return sourceHasName(e.source, refresh.name) && e.resource === "buys";
      },
      replace: function(e, s, c) {
        return __assign4(__assign4({}, e), { amount: e.amount + 2 });
      }
    }]
  };
  addRelicReward(courier);
  var inkwell = {
    name: "Inkwell",
    metaReplacers: [{
      kind: "gameSetup",
      text: ["Par is 1@ higher on each course."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { par: p.par + 1 });
      }
    }]
  };
  addRelicReward(inkwell);
  var elegantQuill = {
    name: "Elegant Quill",
    metaTriggers: [
      {
        kind: "relic",
        text: ["When you gain this, gain 3@ buffer."],
        handles: function(e, _s, self) {
          return self.id === e.relic.id;
        },
        transform: function(_e) {
          return addBuffer(3);
        }
      },
      {
        kind: "loseRelic",
        text: ["When you lose this, lose 3@ buffer."],
        handles: function(e, _s, self) {
          return self.id === e.relic.id;
        },
        transform: function(_e) {
          return addBuffer(-3);
        }
      }
    ]
  };
  addRelicReward(elegantQuill);
  var brokenLever = {
    name: "Broken Lever",
    metaReplacers: [{
      kind: "gameSetup",
      text: ["VP targets are 25% lower (rounded up)."],
      simpleText: ["VP targets are 25% lower."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { vpGoal: Math.ceil(p.vpGoal * 0.75) });
      }
    }]
  };
  addRelicReward(brokenLever);
  var darkBanner = {
    name: "Dark Banner",
    maxStage: 6,
    metaReplacers: [{
      kind: "gameSetup",
      text: ["Par is 1@ lower on each course."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { par: p.par - 1 });
      }
    }],
    metaTriggers: [{
      kind: "end",
      text: ["At end of course, gain 1@ buffer for each 1@ you beat par up to a max of 4@."],
      simpleText: ["For each 1@ you beat par, gain 1@ buffer up to a max of 4@."],
      handles: function(e) {
        return e.score < e.par;
      },
      transform: function(e) {
        var energyUnderPar = e.par - e.score;
        var bufferGain = Math.min(energyUnderPar, 4);
        return addBuffer(bufferGain);
      }
    }]
  };
  addRelicReward(darkBanner);
  var mirrorName = "Silver Mirror";
  var silverMirror = {
    name: mirrorName,
    maxStage: 6,
    metaTriggers: [{
      kind: "relic",
      simpleText: ["The next time you gain a relic, gain two additional copies of it."],
      text: ["Whenever you gain a relic other than ".concat(mirrorName, ", gain two additional copies of that relic and destroy this.")],
      handles: function(e, _s, relic) {
        return e.relic.id !== relic.id && e.relic.name !== mirrorName && !isBurdened(e.relic.spec);
      },
      transform: function(e, _s, relic) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, removeRelic(state, relic.id)];
                case 1:
                  _a.sent();
                  return [4, gainRelic(e.relic.spec)(state)];
                case 2:
                  _a.sent();
                  return [4, gainRelic(e.relic.spec)(state)];
                case 3:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  addRelicReward(silverMirror);
  var sacredBark = {
    name: "Sacred Bark",
    gainRequirement: function(state) {
      return state.data.buffer >= 3;
    },
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, lose 3 buffer."],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function() {
        return addBuffer(-3);
      }
    }],
    triggers: [{
      kind: "afterUse",
      text: ["After using a potion other than with this, use it again."],
      simpleText: ["Whenever you use a potion, repeat its effect."],
      handles: function(e, _state, _card) {
        return e.card.spec.isPotion === true && !sourceHasName(e.source, "Sacred Bark");
      },
      transform: function(e, _state, card) {
        return e.card.activate("potion", card);
      }
    }]
  };
  addRelicReward(sacredBark);
  var discountCard = {
    name: "Discount card",
    staticReplacers: [{
      text: ["Silver and Gold cost $2 less to buy, but not less than $1."],
      kind: "cost",
      handles: function(p) {
        return p.actionKind === "buy" && (p.card.spec.name === silver.name || p.card.spec.name === gold.name);
      },
      replace: function(p) {
        var reduction = Math.max(Math.min(2, p.cost.coin - 1), 0);
        return __assign4(__assign4({}, p), { cost: addCosts(p.cost, { coin: -reduction }) });
      }
    }]
  };
  addRelicReward(discountCard);
  var singingBowl = {
    name: "Singing Bowl",
    metaReplacers: [{
      kind: "extraOptions",
      text: ["Whenever you are offered a reward, you may gain 2@ buffer instead."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { options: p.options.concat(["singingBowl"]) });
      }
    }]
  };
  addRelicReward(singingBowl);
  var piggyBank = {
    name: "Piggy Bank",
    metaReplacers: [{
      kind: "extraOptions",
      simpleText: ["One time, you can take all of the rewards from a pack."],
      text: ["All reward packs contain a new option 'take it all.'", "When you select that option, take all the rewards from the pack and trash this."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { options: p.options.concat(["takeItAll"]) });
      }
    }]
  };
  addRelicReward(piggyBank);
  var wingedBoots = {
    name: "Winged Boots",
    metaReplacers: [{
      kind: "pathRewards",
      text: ["Each stage has two additional paths."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { paths: __spreadArray7(__spreadArray7([], __read8(p.paths), false), ["Use Winged Boots", "Use Winged Boots"], false) });
      }
    }]
  };
  addRelicReward(wingedBoots);
  var compass = {
    name: "Compass",
    metaReplacers: [{
      kind: "pathRewards",
      text: ["Each stage has an additional challenge option."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { numChallengeOptions: p.numChallengeOptions + 1 });
      }
    }]
  };
  addRelicReward(compass);
  var flywheel = {
    name: "Flywheel",
    metaTriggers: [{
      kind: "end",
      text: ["At end of each course, remove all charge counters from this."],
      simpleText: [],
      handles: function() {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              state.applyToRelic(function(r) {
                return r.update({ tokens: /* @__PURE__ */ new Map() });
              }, self);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }],
    triggers: [{
      kind: "play",
      text: [
        "After you play a card, put a charge token on this, then if it has 5 or more tokens, remove 5 and +1 action."
      ],
      simpleText: ["Every 5 cards you play, +1 action."],
      handles: function() {
        return true;
      },
      transform: function(_e, _s, source) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var relic, current;
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  relic = source;
                  return [4, charge(relic, 1)(state)];
                case 1:
                  state = _a.sent();
                  _a.label = 2;
                case 2:
                  if (false) return [3, 5];
                  current = state.find(relic);
                  if (!current || current.charge < 5)
                    return [2, state];
                  return [4, charge(relic, -5)(state)];
                case 3:
                  state = _a.sent();
                  return [4, gainActions(1, relic)(state)];
                case 4:
                  state = _a.sent();
                  return [3, 2];
                case 5:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  addRelicReward(flywheel);
  var creditVoucher = {
    name: "Credit Voucher",
    triggers: [{
      kind: "buy",
      text: ["Whenever you buy a card costing $4 or more, +1 buy."],
      handles: function(e, _s, _c) {
        return e.card.cost("buy", _s).coin >= 4;
      },
      transform: function(e, s, source) {
        return gainBuys(1, source);
      }
    }]
  };
  addRelicReward(creditVoucher);
  var matryoshkaDoll = {
    name: "Matryoshka Doll",
    maxStage: 5,
    metaReplacers: [{
      kind: "pathRewards",
      text: ["Each stage has an additional reward."],
      simpleText: ["Your next two stages have an additional reward on each path."],
      replace: function(p, self) {
        return __assign4(__assign4({}, p), { rewardsPerPath: p.rewardsPerPath + 1 });
      }
    }],
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, put 2 charge tokens on it."],
      simpleText: [],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var tokens;
            return __generator5(this, function(_a) {
              tokens = new Map(self.tokens);
              tokens.set("charge", 2);
              state.applyToRelic(function(r) {
                return r.update({ tokens });
              }, self);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }, {
      kind: "path",
      text: ["After generating a path, remove a charge token from this. Then if it has no charge tokens destroy it."],
      simpleText: [],
      handles: function(_e, _s, self) {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var current, tokens;
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  current = state.data.relics.find(function(r) {
                    return r.id === self.id;
                  });
                  if (!current)
                    return [
                      2
                      /*return*/
                    ];
                  tokens = new Map(current.tokens);
                  if (current.charge > 0) {
                    tokens.set("charge", current.count("charge") - 1);
                    state.applyToRelic(function(r) {
                      return r.update({ tokens });
                    }, current);
                  }
                  if (!(tokens.get("charge") === 0)) return [3, 2];
                  return [4, removeRelic(state, current.id)];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  addRelicReward(matryoshkaDoll);
  var calledShot = {
    name: "Called Shot",
    maxStage: 6,
    metaTriggers: [{
      kind: "end",
      text: ["At end of stage, gain 1 buffer for each @ you beat par, then destroy this."],
      simpleText: ["At end of this stage, gain 1 buffer for each @ you beat par."],
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(e, _s, self) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var gain;
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  gain = Math.max(0, e.par - e.score);
                  return [4, removeRelic(state, self.id)];
                case 1:
                  _a.sent();
                  if (!(gain > 0)) return [3, 3];
                  return [4, addBuffer(gain)(state)];
                case 2:
                  _a.sent();
                  _a.label = 3;
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  var delayedGratification = {
    name: "Delayed Gratification",
    metaReplacers: [{
      kind: "pathRewards",
      text: ["Each path has an additional reward."],
      simpleText: ["Your next stage has an additional reward on each path."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { rewardsPerPath: p.rewardsPerPath + 1 });
      }
    }],
    metaTriggers: [{
      kind: "path",
      text: ["When a path is generated, destroy this."],
      simpleText: [],
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, removeRelic(state, self.id)];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(calledShot);
  registerRelicSpec(delayedGratification);
  var giftBox = {
    name: "Gift Box",
    mutableTriggers: function(relic) {
      return [{
        kind: "afterStart",
        text: ["At the start of the game, create a copy of each boxed card in your hand."],
        simpleText: [],
        handles: function() {
          return true;
        },
        transform: function() {
          return function(state) {
            return __awaiter5(this, void 0, void 0, function() {
              var _a, _b, spec, e_1_1;
              var e_1, _d;
              return __generator5(this, function(_f) {
                switch (_f.label) {
                  case 0:
                    _f.trys.push([0, 5, 6, 7]);
                    _a = __values6(relic.notedCards || []), _b = _a.next();
                    _f.label = 1;
                  case 1:
                    if (!!_b.done) return [3, 4];
                    spec = _b.value;
                    return [4, create(spec, "hand")(state)];
                  case 2:
                    state = _f.sent();
                    _f.label = 3;
                  case 3:
                    _b = _a.next();
                    return [3, 1];
                  case 4:
                    return [3, 7];
                  case 5:
                    e_1_1 = _f.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 7];
                  case 6:
                    try {
                      if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                    } finally {
                      if (e_1) throw e_1.error;
                    }
                    return [
                      7
                      /*endfinally*/
                    ];
                  case 7:
                    return [2, state];
                }
              });
            });
          };
        }
      }];
    },
    metaTriggers: [{
      kind: "end",
      text: ["At end of each course, remove all boxed cards."],
      simpleText: [],
      handles: function() {
        return true;
      },
      transform: function(_e, _s, relic) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              state.applyToRelic(function(r) {
                return r.update({ notedCards: [] });
              }, relic);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }, {
      kind: "card",
      text: ["Whenever you add a card to your deck, box it in this."],
      simpleText: ["When you add a card to your deck, start the next course with a copy in hand."],
      handles: function() {
        return true;
      },
      transform: function(e, _s, relic) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var notedCards;
            return __generator5(this, function(_a) {
              notedCards = relic.notedCards || [];
              state.applyToRelic(function(r) {
                return r.update({ notedCards: __spreadArray7(__spreadArray7([], __read8(notedCards), false), [e.card], false) });
              }, relic);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }]
  };
  addRelicReward(giftBox);
  var emptyBottle = {
    name: "Empty Bottle",
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, choose an event and gain a potion that uses it for free."],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function() {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var event;
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (state.data.collectedEvents.length === 0)
                    return [
                      2
                      /*return*/
                    ];
                  return [4, state.ui.chooseCard(state, "Choose an event to bottle:", __spreadArray7([], __read8(state.data.collectedEvents), false), true)];
                case 1:
                  event = _a.sent();
                  if (!event)
                    return [
                      2
                      /*return*/
                    ];
                  return [4, gainPotion(makeBottledEventPotion(event), {
                    details: "Bottled ".concat(displayName(event))
                  })(state)];
                case 2:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }, {
      kind: "event",
      text: ["Whenever you gain an event, gain a potion that uses it for free."],
      handles: function() {
        return true;
      },
      transform: function(e) {
        return gainPotion(makeBottledEventPotion(e.event), {
          details: "Bottled ".concat(displayName(e.event))
        });
      }
    }]
  };
  registerRelicSpec(emptyBottle);
  var banner = {
    name: "Banner",
    maxStage: 6,
    metaTriggers: [{
      kind: "end",
      text: ["At end of course, gain 1@ buffer for each 2@ you beat par."],
      simpleText: ["For each 2@ you beat par, gain 1@ buffer."],
      handles: function(e) {
        return e.score < e.par;
      },
      transform: function(e) {
        var energyUnderPar = e.par - e.score;
        var bufferGain = Math.floor(energyUnderPar / 2);
        return addBuffer(bufferGain);
      }
    }]
  };
  addRelicReward(banner);
  var questionCard = {
    name: "Question Card",
    maxStage: 6,
    metaReplacers: [{
      kind: "reward",
      text: ["All reward packs are generated with 2 more options."],
      simpleText: ["All reward packs have 2 more options."],
      replace: function(p) {
        return __assign4(__assign4({}, p), { optionCount: p.optionCount + 2 });
      }
    }]
  };
  addRelicReward(questionCard);
  function lookingGlassNewKingdom(state, cards, events) {
    var e_2, _a, e_3, _b;
    var result = { cards: cards.slice(), events: events.slice() };
    var neededCards = 2;
    var neededEvents = 1;
    var skipCardNames = new Set(cards.map(function(card2) {
      return card2.name;
    }));
    var skipEventNames = new Set(events.map(function(event) {
      return event.name;
    }));
    var generator = new Generator("".concat(state.seed, "-LOOKINGGLASS-").concat(state.data.stage));
    var allCards = generator.permute(__spreadArray7([], __read8(cardRewards), false));
    var addedCards = [];
    try {
      for (var allCards_1 = __values6(allCards), allCards_1_1 = allCards_1.next(); !allCards_1_1.done; allCards_1_1 = allCards_1.next()) {
        var card = allCards_1_1.value;
        if (addedCards.length >= neededCards)
          break;
        if (skipCardNames.has(card.name))
          continue;
        addedCards.push(card);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (allCards_1_1 && !allCards_1_1.done && (_a = allCards_1.return)) _a.call(allCards_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    var allEvents = generator.permute(__spreadArray7([], __read8(eventRewards), false));
    var addedEvents = [];
    try {
      for (var allEvents_1 = __values6(allEvents), allEvents_1_1 = allEvents_1.next(); !allEvents_1_1.done; allEvents_1_1 = allEvents_1.next()) {
        var event_1 = allEvents_1_1.value;
        if (addedEvents.length >= neededEvents)
          break;
        if (skipEventNames.has(event_1.name))
          continue;
        addedEvents.push(event_1);
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (allEvents_1_1 && !allEvents_1_1.done && (_b = allEvents_1.return)) _b.call(allEvents_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    return { cards: cards.concat(addedCards), events: events.concat(addedEvents) };
  }
  var lookingGlass = {
    name: "Looking Glass",
    metaReplacers: [{
      kind: "gameSetup",
      text: ["At the start of each stage add 2 random cards and 1 random event to the supply."],
      replace: function(p, state, self) {
        var newKingdom = lookingGlassNewKingdom(state, p.cardSpecs, p.eventSpecs);
        return __assign4(__assign4({}, p), { cardSpecs: newKingdom.cards, eventSpecs: newKingdom.events });
      }
    }]
  };
  addRelicReward(lookingGlass);

  // public/data/cards.js
  var __assign5 = function() {
    __assign5 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign5.apply(this, arguments);
  };
  var __awaiter6 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator6 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read9 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __values7 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function toPlay() {
    return {
      text: ["Put this in play."],
      transform: function(state, c) {
        return move(c, "play");
      }
    };
  }
  var ghostTown = {
    name: "Ghost Town",
    buyCost: coin(3),
    effects: [createInPlayEffect(villager)],
    relatedCards: [villager],
    staticTriggers: [buyTrigger(actionsEffect(3))]
  };
  cardRewards.push(ghostTown);
  var Till = "Till";
  var till = {
    name: Till,
    buyCost: coin(4),
    effects: [{
      text: ["Put up to 3 non-".concat(Till, " cards from your\n               discard into your hand.")],
      transform: function() {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose up to three cards to put into your hand.", state.discard.filter(function(c) {
                    return c.name != Till;
                  }).map(asChoice), 3)];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "hand")(state)];
                case 2:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(till);
  var village = {
    name: "Village",
    buyCost: coin(2),
    effects: [actionsEffect(1), createInPlayEffect(villager)],
    relatedCards: [villager]
  };
  cardRewards.push(village);
  var bridge = {
    name: "Bridge",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(1), buyEffect()],
    replacers: [costReduce("buy", { coin: 1 }, true)]
  };
  cardRewards.push(bridge);
  var lab = {
    name: "Lab",
    buyCost: coin(2),
    effects: [actionsEffect(3)]
  };
  cardRewards.push(lab);
  function throneroomEffect() {
    return {
      text: ["Pay an action to play a card in your hand twice."],
      simpleText: ["Pay an action to play a card in your hand twice without paying any @ costs."],
      transform: function(state, card) {
        return payToDo(payAction(card), playTwice(card));
      }
    };
  }
  var throneRoom = {
    name: "Throne Room",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [throneroomEffect()]
  };
  cardRewards.push(throneRoom);
  var coppersmith = {
    name: "Coppersmith",
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [buysEffect(1)],
    triggers: [{
      kind: "play",
      text: ["When you play a copper, +$1."],
      handles: function(e) {
        return e.card.name == copper.name;
      },
      transform: function(e, s, c) {
        return gainCoins(1, c);
      }
    }]
  };
  cardRewards.push(coppersmith);
  var Unearth = "Unearth";
  var unearth = {
    name: Unearth,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [
      coinsEffect(2),
      actionsEffect(1),
      targetedEffect(function(target) {
        return move(target, "hand");
      }, "Put a non-".concat(Unearth, " card from your discard into your hand."), function(state) {
        return state.discard.filter(function(c) {
          return c.name != Unearth;
        });
      })
    ]
  };
  cardRewards.push(unearth);
  var plowName = "Plow";
  var plow = {
    name: plowName,
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    staticReplacers: [{
      kind: "create",
      text: ["Whenever you would create a ".concat(plowName, ", create it in play.")],
      simpleText: ["".concat(plowName, " is created in play.")],
      handles: function(p) {
        return p.spec.name == plowName;
      },
      replace: function(p) {
        return __assign5(__assign5({}, p), { zone: "play" });
      }
    }]
  };
  cardRewards.push(plow);
  var construction = {
    name: "Construction",
    fixedCost: energy(1),
    buyCost: coin(4),
    effects: [actionsEffect(3)],
    triggers: [{
      text: ["Whenever you pay @, +1 action, +$1 and +1 buy."],
      kind: "cost",
      handles: function(e) {
        return e.cost.energy > 0;
      },
      transform: function(e, s, c) {
        return doAll([
          gainActions(e.cost.energy, c),
          gainCoins(e.cost.energy, c),
          gainBuys(e.cost.energy, c)
        ]);
      }
    }]
  };
  cardRewards.push(construction);
  function chargeUpTo(max, simpleText) {
    return {
      text: ["Put a charge token on this if it has less than ".concat(max, ".")],
      simpleText,
      transform: function(state, card) {
        return card.charge >= max ? noop : charge(card, 1);
      }
    };
  }
  var investmentName = "Investment";
  var investment = {
    name: investmentName,
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [{
      text: ["+$1 per charge token on this."],
      simpleText: ["+$2"],
      transform: function(state, card) {
        return gainCoins(state.find(card).charge, card);
      }
    }, chargeUpTo(6, ["This creates $1 more each time you play it up to a max of $6."])],
    staticReplacers: [startsWithCharge(investmentName, 2, true)]
  };
  cardRewards.push(investment);
  var royalSeal = {
    name: "Royal Seal",
    effects: [coinsEffect(2), createInPlayEffect(fair, 2)],
    relatedCards: [fair],
    buyCost: coin(5)
  };
  cardRewards.push(royalSeal);
  var workshopName = "Workshop";
  var workshop = {
    name: workshopName,
    fixedCost: energy(0),
    buyCost: coin(3),
    effects: [workshopEffect(4, workshopName)]
  };
  cardRewards.push(workshop);
  var shippingLane = {
    name: "Shipping Lane",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2), createInPlayEffect(bounty)],
    relatedCards: [bounty]
  };
  cardRewards.push(shippingLane);
  var factoryName = "Factory";
  var factory = {
    name: factoryName,
    fixedCost: energy(1),
    effects: [workshopEffect(6, factoryName)],
    buyCost: coin(3)
  };
  cardRewards.push(factory);
  var imitation = {
    name: "Imitation",
    fixedCost: energy(1),
    effects: [targetedEffect(function(target, card) {
      return create(target.spec, "hand");
    }, "Choose a card in your hand. Create a copy of it in your hand.", function(state) {
      return state.hand.filter(function(card) {
        return canCreate(card.spec, state);
      });
    })],
    buyCost: coin(3)
  };
  cardRewards.push(imitation);
  var feast = {
    name: "Feast",
    fixedCost: energy(0),
    effects: [targetedEffect(function(target, card) {
      return target.buy(card);
    }, "Buy a card in the supply costing up to $6.", function(state) {
      return state.supply.filter(function(x) {
        return leq(x.cost("buy", state), coin(6)) && canCreate(x.spec, state);
      });
    }), trashThis()],
    buyCost: coin(3),
    staticTriggers: [buyTrigger(buyEffect())]
  };
  cardRewards.push(feast);
  var researcher = {
    name: "Researcher",
    effects: [{
      text: ["+1 action for each charge token on this."],
      simpleText: ["+3 actions"],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var n;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state2.find(card).charge;
                  return [4, gainActions(n, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [
                    2,
                    state2
                    /*
                    for (let i = 0; i < n; i++) {
                        let mode:string|null; [state, mode] = await choice(
                            state,
                            `Choose a benefit (${n - i} remaining)`,
                            literalOptions(['action', 'coin'], ['a', 'c'])
                        )
                        switch(mode) {
                            case 'coin':
                                state = await gainCoins(1, card)(state)
                                break
                            case 'action':
                                state = await gainActions(1, card)(state)
                                break
                        }
                    }
                    return state
                    */
                  ];
              }
            });
          });
        };
      }
    }, {
      text: ["Put a charge token on this."],
      simpleText: ["This gets +1 action each time you play it."],
      transform: function(state, card) {
        return charge(card, 1);
      }
    }],
    buyCost: coin(5),
    staticReplacers: [startsWithCharge("Researcher", 3, true)]
  };
  cardRewards.push(researcher);
  var lackeys = {
    name: "Lackeys",
    fixedCost: energy(1),
    effects: [actionsEffect(4)],
    relatedCards: [villager],
    buyCost: coin(4),
    staticTriggers: [buyTrigger(createInPlayEffect(villager, 2))]
  };
  cardRewards.push(lackeys);
  var goldMine = {
    name: "Gold Mine",
    fixedCost: energy(1),
    effects: [createEffect(gold, "hand", 2)],
    buyCost: coin(6)
  };
  cardRewards.push(goldMine);
  var shelterName = "Shelter";
  var shelter = {
    name: shelterName,
    buyCost: coin(3),
    effects: [actionsEffect(1), {
      text: ["Put a shelter token on each card in play. The next time they woudl leave play, instead remove a shelter token."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var _a, _b, c, e_1_1;
            var e_1, _c;
            return __generator6(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values7(state2.play), _b = _a.next();
                  _d.label = 1;
                case 1:
                  if (!!_b.done) return [3, 4];
                  c = _b.value;
                  return [4, addToken(c, "shelter")(state2)];
                case 2:
                  state2 = _d.sent();
                  _d.label = 3;
                case 3:
                  _b = _a.next();
                  return [3, 1];
                case 4:
                  return [3, 7];
                case 5:
                  e_1_1 = _d.sent();
                  e_1 = { error: e_1_1 };
                  return [3, 7];
                case 6:
                  try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 7:
                  return [2, state2];
              }
            });
          });
        };
      }
    }],
    rules: [shelterRule]
  };
  cardRewards.push(shelter);
  var market = {
    name: "Market",
    effects: [actionsEffect(1), coinsEffect(1), buyEffect()],
    buyCost: coin(2)
  };
  cardRewards.push(market);
  var ruinedLab = {
    name: "Ruined Lab",
    effects: [actionsEffect(2)],
    buyCost: coin(2)
  };
  var ruinedMarket = {
    name: "Ruined Market",
    effects: [coinsEffect(1), buyEffect()],
    buyCost: coin(2)
  };
  var ruinedVillage = {
    name: "Ruined Village",
    effects: [createInPlayEffect(villager)],
    buyCost: coin(2),
    relatedCards: [ruinedLab, ruinedMarket, villager],
    staticTriggers: [{
      kind: "beforeStart",
      text: ["At the start of the game, add ".concat(ruinedLab.name, " and ").concat(ruinedMarket.name, " to the supply.")],
      handles: function() {
        return true;
      },
      transform: function(e, s, c) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var lab2, market2;
            var _a, _b;
            return __generator6(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, createAndTrack(ruinedLab, "supply")(state)];
                case 1:
                  _a = __read9.apply(void 0, [_c.sent(), 2]), lab2 = _a[0], state = _a[1];
                  if (lab2 != null) {
                    state = state.moveAfter("supply", lab2, c);
                  }
                  return [4, createAndTrack(ruinedMarket, "supply")(state)];
                case 2:
                  _b = __read9.apply(void 0, [_c.sent(), 2]), market2 = _b[0], state = _b[1];
                  if (market2 != null) {
                    state = state.moveAfter("supply", market2, c);
                  }
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(ruinedVillage);
  var herbs = {
    name: "Herbs",
    effects: [coinsEffect(1), buyEffect()],
    buyCost: coin(2),
    staticTriggers: [buyTrigger(buyEffect())]
  };
  cardRewards.push(herbs);
  var spices = {
    name: "Spices",
    effects: [coinsEffect(2), buyEffect()],
    buyCost: coin(5),
    staticTriggers: [buyTrigger(coinsEffect(4))]
  };
  cardRewards.push(spices);
  var platinum = {
    name: "Platinum",
    fixedCost: energy(0),
    effects: [coinsEffect(6)],
    buyCost: coin(8)
  };
  cardRewards.push(platinum);
  var greatSmithy = {
    name: "Great Smithy",
    fixedCost: energy(2),
    effects: [actionsEffect(8), buysEffect(2)],
    buyCost: coin(6)
  };
  cardRewards.push(greatSmithy);
  function KCEffect() {
    return {
      text: ["Pay an action to play a card in your hand three times."],
      transform: function(state, card) {
        return payToDo(payAction(card), applyToTarget(function(target) {
          return doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card)
          ]);
        }, "Choose a card to play three times.", function(s) {
          return s.hand;
        }));
      }
    };
  }
  var kingsCourt = {
    name: "King's Court",
    fixedCost: energy(2),
    effects: [KCEffect()],
    buyCost: coin(9)
  };
  cardRewards.push(kingsCourt);
  var tactic = {
    name: "Tactic",
    ability: [{
      text: ["Remove a charge token from this, trash it, and pay an action\n        to play a card from your hand three times."],
      simpleText: ["Once this has a charge token, you can trash it and pay an action to play a card from your hand three times."],
      transform: function(state, card) {
        return payToDo(payCost(__assign5(__assign5({}, free), { actions: 1, effects: [discharge(card, 1), trash(card)] }), card), applyToTarget(function(target) {
          return doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card)
          ]);
        }, "Choose a card to play three times.", function(s) {
          return s.hand;
        }));
      }
    }],
    restrictions: [{
      test: function(c, s, k) {
        return k == "activate" && (s.actions < 1 || c.charge == 0);
      }
    }],
    replacers: [{
      text: ["Whenever you would move this to your hand,\n               instead put a charge token on it."],
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.toZone == "hand" && p.skip == false;
      },
      replace: function(p, s, c) {
        return __assign5(__assign5({}, p), { skip: true, effects: p.effects.concat([
          charge(c, 1)
        ]) });
      }
    }]
  };
  var mastermind = {
    name: "Mastermind",
    fixedCost: energy(1),
    relatedCards: [tactic],
    effects: [createInPlayEffect(tactic)],
    buyCost: coin(6)
  };
  cardRewards.push(mastermind);
  var recruitment = {
    name: "Recruitment",
    relatedCards: [villager, fair],
    effects: [actionsEffect(1)],
    triggers: [{
      text: ["Whenever you pay @,\n               create that many ".concat(villager.name, "s and ").concat(fair.name, "s in play.")],
      kind: "cost",
      handles: function(e, state, card) {
        return e.cost.energy > 0;
      },
      transform: function(e, state, card) {
        return doAll([villager, fair].map(function(c) {
          return repeat(create(c, "play"), e.cost.energy);
        }));
      }
    }],
    buyCost: coin(3)
  };
  cardRewards.push(recruitment);
  var looter = {
    name: "Looter",
    relatedCards: [villager],
    effects: [{
      text: ["Discard any number of cards from your hand for +1 action each."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to discard", state.hand.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "discard")(state)];
                case 2:
                  state = _b.sent();
                  return [4, gainActions(targets.length, card)(state)];
                case 3:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }, {
      text: ["Trash any number of cards from your discard, and create a ".concat(villager.name, " in play for each.")],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets, i;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to trash", state.discard.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "void")(state)];
                case 2:
                  state = _b.sent();
                  i = 0;
                  _b.label = 3;
                case 3:
                  if (!(i < targets.length)) return [3, 6];
                  return [4, create(villager, "play")(state)];
                case 4:
                  state = _b.sent();
                  _b.label = 5;
                case 5:
                  i++;
                  return [3, 3];
                case 6:
                  return [2, state];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(4)
  };
  cardRewards.push(looter);
  var Innovation = "Innovation";
  var innovation = {
    name: Innovation,
    effects: [actionsEffect(1)],
    replacers: [playReplacer(["Whenever you would create a card in your discard,\n        instead discard this to set the card aside.\n        Then play it if it is still set aside."], function(p, s, c) {
      return s.find(c).place == "play";
    }, function(p, s, c) {
      return discardFromPlay(c);
    }, ["The next time you create a card in your discard, play it immediately."])],
    buyCost: coin(3)
  };
  cardRewards.push(innovation);
  var formation = {
    name: "Formation",
    effects: [actionsEffect(2)],
    buyCost: coin(4),
    replacers: [{
      text: ["Cards cost @ less to play if they share a name with a card in your discard or in play."],
      kind: "cost",
      handles: function(x, state) {
        return x.actionKind == "play" && state.discard.concat(state.play).some(function(c) {
          return c.name == x.card.name;
        });
      },
      replace: function(x, state, card) {
        return __assign5(__assign5({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
      }
    }]
  };
  cardRewards.push(formation);
  var coven = {
    name: "Coven",
    effects: [coinsEffect(1)],
    buyCost: coin(3),
    replacers: [{
      text: ["Cards cost @ less to play if they don't share a name with a card in your discard or in play."],
      kind: "cost",
      handles: function(x, state) {
        return x.actionKind == "play" && !state.discard.concat(state.play).some(function(c) {
          return c.name == x.card.name;
        });
      },
      replace: function(x, state, card) {
        return __assign5(__assign5({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
      }
    }]
  };
  cardRewards.push(coven);
  var Traveler = "Traveler";
  var traveler = {
    name: "Traveler",
    fixedCost: energy(1),
    effects: [{
      text: ["Pay an action to play a card in your hand once for each charge token on this."],
      simpleText: ["Pay an action to play a card in your hand X times."],
      transform: function(state, card) {
        return payToDo(payAction(card), applyToTarget(function(target) {
          return function(state2) {
            return __awaiter6(this, void 0, void 0, function() {
              var n, i;
              return __generator6(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    n = state2.find(card).charge;
                    i = 0;
                    _a.label = 1;
                  case 1:
                    if (!(i < n)) return [3, 4];
                    return [4, target.play(card)(state2)];
                  case 2:
                    state2 = _a.sent();
                    state2 = tick(card)(state2);
                    _a.label = 3;
                  case 3:
                    i++;
                    return [3, 1];
                  case 4:
                    return [2, state2];
                }
              });
            });
          };
        }, "Choose a card to play with ".concat(Traveler, "."), function(s) {
          return s.hand;
        }));
      }
    }, chargeUpTo(3, ["X starts at 1 and increases by 1 each time you play this up to a max of 3."])],
    buyCost: coin(4),
    staticReplacers: [startsWithCharge(Traveler, 1, true)]
  };
  cardRewards.push(traveler);
  var fountain = {
    name: "Fountain",
    fixedCost: energy(0),
    effects: [actionsEffect(1)],
    ability: [{
      transform: function(state, card) {
        return payToDo(discardFromPlay(card), fountainTransform(card));
      },
      text: ["Discard this from play to lose all actions, $, and buy, then gain +5 actions and +1 buy."]
    }],
    buyCost: coin(3)
  };
  cardRewards.push(fountain);
  var grandMarket = {
    name: "Grand Market",
    buyCost: coin(7),
    effects: [actionsEffect(1), coinsEffect(3), buysEffect(2)]
  };
  cardRewards.push(grandMarket);
  var Industry = "Industry";
  function industryTransform(n, except, source) {
    if (except === void 0) {
      except = Industry;
    }
    return applyToTarget(function(target) {
      return target.buy(source);
    }, "Buy a card in the supply costing up to $".concat(n, " not named ").concat(except, "."), function(state) {
      return state.supply.filter(function(x) {
        return leq(x.cost("buy", state), coin(n)) && x.name != except && canCreate(x.spec, state);
      });
    });
  }
  var industry = {
    name: Industry,
    fixedCost: energy(2),
    effects: [{
      text: ["Do this twice: buy a card in the supply costing up to $8 other than ".concat(Industry, ".")],
      transform: function(state, card) {
        return doAll([
          industryTransform(8, Industry, card),
          tick(card),
          industryTransform(8, Industry, card)
        ]);
      }
    }],
    buyCost: coin(6)
  };
  cardRewards.push(industry);
  var artificer = {
    name: "Artificer",
    effects: [{
      text: ["Discard any number of cards.", "Choose a card in the supply costing $1 per card you discarded,\n        and create a copy in your hand."],
      transform: function() {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets, n, target;
            var _a, _b;
            return __generator6(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to discard.", state.hand.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_c.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "discard")(state)];
                case 2:
                  state = _c.sent();
                  n = targets.length;
                  return [4, choice(state, "Choose a card costing $".concat(n, " to gain a copy of."), state.supply.filter(function(c) {
                    return c.cost("buy", state).coin == n && canCreate(c.spec, state);
                  }).map(asChoice))];
                case 3:
                  _b = __read9.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
                  if (!(target != null)) return [3, 5];
                  return [4, create(target.spec, "hand")(state)];
                case 4:
                  state = _c.sent();
                  _c.label = 5;
                case 5:
                  return [2, state];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(3)
  };
  cardRewards.push(artificer);
  var banquet = {
    name: "Banquet",
    buyCost: coin(3),
    restrictions: [{
      test: function(c, s, k) {
        return k == "activate" && s.hand.length > 0;
      }
    }],
    effects: [{
      text: ["Put a charge token on this for every 2 cards in your hand, rounded up."],
      simpleText: ["When you play this, X becomes half the number of cards in your hand (rounded up)."],
      transform: function(state, c) {
        return charge(c, Math.ceil(state.hand.length / 2));
      }
    }],
    replacers: [{
      text: ["Whenever this leaves play, remove all charge tokens from it."],
      simpleText: [],
      kind: "move",
      handles: function(p, state, card) {
        return p.card.id == card.id && p.toZone != "play" && p.skip == false;
      },
      replace: function(p, state, card) {
        return __assign5(__assign5({}, p), { effects: p.effects.concat([discharge(card, p.card.charge)]) });
      }
    }],
    ability: [{
      text: ["If you have no cards in your hand, discard this for +$1 per charge token on it."],
      simpleText: ["Once you have no cards in your hand, you can discard this from play to gain +$X."],
      transform: function(state, card) {
        return payToDo(discardFromPlay(card), gainCoins(card.charge, card));
      }
    }]
  };
  cardRewards.push(banquet);
  var harvest = {
    name: "Harvest",
    fixedCost: energy(1),
    effects: [{
      text: ["+1 action for each differently-named card in your hand."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var n;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = countDistinctNames(state2.hand);
                  return [4, gainActions(n, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }, {
      text: ["+$1 for each differently-named card in your discard."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var n;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = countDistinctNames(state2.discard);
                  return [4, gainCoins(n, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(3)
  };
  cardRewards.push(harvest);
  var secretChamber = {
    name: "Secret Chamber",
    effects: [{
      text: ["Discard any number of cards from your hand for +$1 each."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Discard any number of cards for +$1 each.", state.hand.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "discard")(state)];
                case 2:
                  state = _b.sent();
                  return [4, gainCoins(targets.length, card)(state)];
                case 3:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }, {
      text: ["Trash any number of cards from your discard for +1 buy each."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Trash any number of cards for +1 buy each.", state.discard.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "void")(state)];
                case 2:
                  state = _b.sent();
                  return [4, gainBuys(targets.length, card)(state)];
                case 3:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(3)
  };
  cardRewards.push(secretChamber);
  var hireling = {
    name: "Hireling",
    relatedCards: [fair],
    effects: [],
    replacers: [{
      text: ["Whenever you would move this to your hand,\n               instead +1 action, +1 buy, +$1, and create a ".concat(fair.name, " in play.")],
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.toZone == "hand" && p.skip == false;
      },
      replace: function(p, s, c) {
        return __assign5(__assign5({}, p), { skip: true, effects: p.effects.concat([
          gainActions(1, c),
          gainBuys(1, c),
          gainCoins(1, c),
          create(fair, "play")
        ]) });
      }
    }],
    buyCost: coin(2)
  };
  cardRewards.push(hireling);
  var hagglerName = "Haggler";
  var haggler = {
    name: hagglerName,
    fixedCost: energy(1),
    buyCost: coin(3),
    effects: [coinsEffect(2)],
    triggers: [{
      text: ["After you buy a card the normal way, you may buy another card that costs less."],
      kind: "afterBuy",
      handles: function(e, state, card) {
        return state.find(card).place == "play" && e.source == "act";
      },
      transform: function(e, state, card) {
        return applyToTarget(function(target) {
          return target.buy(card);
        }, "Buy a card in the supply costing less than $".concat(e.card.cost("buy", state).coin, "."), function(state2) {
          return state2.supply.filter(function(x) {
            return leq(x.cost("buy", state2), coin(e.card.cost("buy", state2).coin - 1)) && canCreate(x.spec, state2);
          });
        });
      }
    }]
  };
  cardRewards.push(haggler);
  var highwayName = "Highway";
  var highway = {
    name: highwayName,
    effects: [actionsEffect(1)],
    replacers: [costReduce("buy", { coin: 1 }, true)],
    buyCost: coin(5),
    staticReplacers: [startInPlay(highwayName)]
  };
  cardRewards.push(highway);
  var FairyGold = "Fairy Gold";
  var fairyGold = {
    name: FairyGold,
    effects: [buyEffect(), {
      text: ["+$1 per charge token on this."],
      simpleText: ["+$3"],
      transform: function(state, card) {
        return gainCoins(state.find(card).charge, card);
      }
    }, {
      text: ["Remove a charge token from this if it has any."],
      simpleText: ["This creates $1 less each time you play it."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(state2.find(card).charge > 0)) return [3, 2];
                  return [4, discharge(card, 1)(state2)];
                case 1:
                  state2 = _a.sent();
                  _a.label = 2;
                case 2:
                  return [2, state2];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(FairyGold, 3, true)]
  };
  cardRewards.push(fairyGold);
  var fortuneName = "Fortune";
  var fortune = {
    name: fortuneName,
    effects: [{
      text: ["Double your $."],
      transform: function(state, card) {
        return gainCoins(state.coin, card);
      }
    }, {
      text: ["Double your buys."],
      transform: function(state, card) {
        return gainBuys(state.buys, card);
      }
    }],
    staticTriggers: [{
      kind: "create",
      text: ["Whenever you create ".concat(a(fortuneName), ", trash this from the supply.")],
      simpleText: ["You can only buy ".concat(fortuneName, " once per game.")],
      handles: function(e) {
        return e.card.name == fortuneName;
      },
      transform: function(e, s, c) {
        return trash(c);
      }
    }],
    buyCost: coin(12)
  };
  cardRewards.push(fortune);
  var ferry = {
    name: "Ferry",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(function(target) {
      return addToken(target, "ferry", 1);
    }, "Put a ferry token on a supply.", function(state) {
      return state.supply;
    })],
    rules: [ferryRule]
  };
  cardRewards.push(ferry);
  var develop = {
    name: "Develop",
    buyCost: coin(4),
    effects: [{
      text: ["Trash a card in your hand.", "Choose a card in the supply costing less and create a copy in your hand.", "Choose a card in the supply costing $1 or $2 more and create a copy in your hand."],
      transform: function(_, c) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, applyToTarget(function(target) {
                    return function(state2) {
                      return __awaiter6(this, void 0, void 0, function() {
                        var cost;
                        return __generator6(this, function(_a2) {
                          switch (_a2.label) {
                            case 0:
                              return [4, trash(target)(state2)];
                            case 1:
                              state2 = _a2.sent();
                              cost = target.cost("buy", state2);
                              return [4, applyToTarget(function(target2) {
                                return create(target2.spec, "hand");
                              }, "Choose a cheaper card to copy.", function(s) {
                                return s.supply.filter(function(c2) {
                                  return !leq(target.cost("buy", s), c2.cost("buy", s)) && canCreate(c2.spec, s);
                                });
                              })(state2)];
                            case 2:
                              state2 = _a2.sent();
                              return [4, applyToTarget(function(target2) {
                                return create(target2.spec, "hand");
                              }, "Choose a more expensive card to copy.", function(s) {
                                return s.supply.filter(function(c2) {
                                  return (eq(c2.cost("buy", s), addCosts(target.cost("buy", s), { coin: 1 })) || eq(c2.cost("buy", s), addCosts(target.cost("buy", s), { coin: 2 }))) && canCreate(c2.spec, s);
                                });
                              })(state2)];
                            case 3:
                              state2 = _a2.sent();
                              return [2, state2];
                          }
                        });
                      });
                    };
                  }, "Choose a card to develop.", function(s) {
                    return s.hand;
                  })(state)];
                case 1:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(develop);
  var harrowName = "Harrow";
  var harrow = {
    name: harrowName,
    buyCost: coin(3),
    effects: [{
      text: ["Discard any number of cards from your hand, then put that many non-".concat(harrowName, " cards from your discard into your hand.")],
      transform: function() {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var cards, n, targets;
            var _a, _b;
            return __generator6(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Discard any number of cards.", state.hand.map(asChoice))];
                case 1:
                  _a = __read9.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                  n = cards.length;
                  return [4, moveMany(cards, "discard")(state)];
                case 2:
                  state = _c.sent();
                  return [4, multichoice(state, "Choose ".concat(n, " cards to put into your hand."), state.discard.filter(function(c) {
                    return c.name != harrowName;
                  }).map(asChoice), n, n)];
                case 3:
                  _b = __read9.apply(void 0, [_c.sent(), 2]), state = _b[0], targets = _b[1];
                  return [4, moveMany(targets, "hand")(state)];
                case 4:
                  state = _c.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(harrow);
  var tavern = {
    name: "Tavern",
    buyCost: coin(3),
    relatedCards: [villager, fair],
    effects: [createInPlayEffect(fair), createInPlayEffect(villager)]
  };
  cardRewards.push(tavern);
  var metalworker = {
    name: "Metalworker",
    buyCost: coin(3),
    effects: [actionsEffect(1)],
    triggers: [{
      kind: "play",
      text: ["When you play a ".concat(silver.name, ", +1 action.")],
      handles: function(e) {
        return e.card.name == silver.name;
      },
      transform: function(e, s, c) {
        return gainActions(1, c);
      }
    }, {
      kind: "play",
      text: ["When you play a ".concat(gold.name, ", +1 buy.")],
      handles: function(e) {
        return e.card.name == gold.name;
      },
      transform: function(e, s, c) {
        return doAll([gainBuys(1, c)]);
      }
    }]
  };
  cardRewards.push(metalworker);
  var exoticMarket = {
    name: "Exotic Market",
    buyCost: coin(3),
    effects: [actionsEffect(2), coinsEffect(1), buysEffect(1)]
  };
  cardRewards.push(exoticMarket);
  var queensCourt = {
    name: "Queen's Court",
    buyCost: coin(9),
    fixedCost: energy(2),
    effects: [{
      text: ["Do this three times: pay an action to play a card in your hand twice."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var i;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  i = 0;
                  _a.label = 1;
                case 1:
                  if (!(i < 3)) return [3, 4];
                  return [4, payToDo(payAction(card), applyToTarget(function(target) {
                    return doAll([
                      target.play(card),
                      target.play(card)
                    ]);
                  }, "Choose a card to play twice.", function(s2) {
                    return s2.hand;
                  }, { optional: "None" }))(state)];
                case 2:
                  state = _a.sent();
                  state = tick(card)(state);
                  _a.label = 3;
                case 3:
                  i++;
                  return [3, 1];
                case 4:
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(queensCourt);
  var sculpt = {
    name: "Sculpt",
    buyCost: coin(3),
    effects: [actionsEffect(1), targetedEffect(function(target) {
      return doAll([move(target, "discard"), repeat(create(target.spec, "discard"), 2)]);
    }, "Discard a card in your hand to create two copies of it in your discard.", function(state) {
      return state.hand.filter(function(card) {
        return canCreate(card.spec, state);
      });
    })]
  };
  cardRewards.push(sculpt);
  var tapestry = {
    name: "Tapestry",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)],
    relatedCards: [fair]
  };
  cardRewards.push(tapestry);
  var silverMine = {
    name: "Silver Mine",
    buyCost: coin(6),
    effects: [actionsEffect(1), createEffect(silver, "hand", 2)]
  };
  cardRewards.push(silverMine);
  var livery = {
    name: "Livery",
    buyCost: coin(4),
    fixedCost: energy(1),
    relatedCards: [horse],
    effects: [coinsEffect(3)],
    triggers: [{
      kind: "afterBuy",
      text: ["After buying a card other than ".concat(copper.name, ", create ").concat(aOrNum(2, horse.name), " in your hand.")],
      handles: function(e, s) {
        return e.card.name != copper.name;
      },
      transform: function() {
        return repeat(create(horse, "hand"), 2);
      }
    }]
  };
  cardRewards.push(livery);
  var stables = {
    name: "Stables",
    relatedCards: [horse],
    effects: [actionsEffect(1), createEffect(horse, "discard", 2)],
    buyCost: coin(2),
    staticTriggers: [buyTrigger({
      text: ["Pay all actions to create that many ".concat(horse.name, "s in your discard.")],
      transform: function(s, c) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var n;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state.actions;
                  return [4, payCost(__assign5(__assign5({}, free), { actions: n }), c)(state)];
                case 1:
                  state = _a.sent();
                  return [4, repeat(create(horse), n)(state)];
                case 2:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    })]
  };
  cardRewards.push(stables);
  var ritual = {
    name: "Ritual",
    buyCost: coin(4),
    effects: [{
      text: ["Play then trash two cards from your hand.", "If you do, choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter6(this, void 0, void 0, function() {
            var cost, i, target;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  cost = __assign5(__assign5({}, free), { buys: 1 });
                  i = 0;
                  _b.label = 1;
                case 1:
                  if (!(i < 2)) return [3, 6];
                  target = void 0;
                  return [4, choice(state, "Choose a card to play then trash (".concat(2 - i, " remaining, $").concat(cost.coin, " total cost so far)"), state.hand.map(asChoice))];
                case 2:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                  if (target === null)
                    return [2, state];
                  return [4, target.play(card)(state)];
                case 3:
                  state = _b.sent();
                  return [4, trash(target)(state)];
                case 4:
                  state = _b.sent();
                  cost = addCosts(cost, target.cost("buy", state));
                  _b.label = 5;
                case 5:
                  i++;
                  return [3, 1];
                case 6:
                  return [4, applyToTarget(function(copyTarget) {
                    return create(copyTarget.spec, "discard");
                  }, "Choose a card to copy.", function(s2) {
                    return s2.supply.filter(function(c) {
                      return leq(c.cost("buy", state), cost);
                    });
                  })(state)];
                case 7:
                  state = _b.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  cardRewards.push(ritual);
  var scepter = {
    name: "Scepter",
    fixedCost: energy(2),
    buyCost: coin(5),
    effects: [{
      text: ["Pay an action to play a card in your hand three times then trash it."],
      transform: function(state, card) {
        return payToDo(payAction(card), applyToTarget(function(target) {
          return doAll([
            target.play(card),
            tick(card),
            target.play(card),
            tick(card),
            target.play(card),
            trash(target)
          ]);
        }, "Choose a card to play three times.", function(s) {
          return s.hand;
        }));
      }
    }]
  };
  cardRewards.push(scepter);
  var inn = {
    name: "Inn",
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager, 2)],
    buyCost: coin(4),
    staticTriggers: [afterBuyTrigger(createEffect(horse, "discard", 3))]
  };
  cardRewards.push(inn);
  function magpieEffect() {
    return {
      text: ["Create a copy of this in your discard."],
      transform: function(s, c) {
        return create(c.spec);
      }
    };
  }
  var magpie = {
    name: "Magpie",
    buyCost: coin(4),
    effects: [coinsEffect(2), magpieEffect()]
  };
  cardRewards.push(magpie);
  var crown = {
    name: "Crown",
    buyCost: coin(3),
    effects: [targetedEffect(function(target) {
      return addToken(target, "reflect");
    }, "Put a reflect token on a card in your hand.", function(s) {
      return s.hand;
    })],
    rules: [reflectRule]
  };
  cardRewards.push(crown);
  var churnName = "Churn";
  var churn = {
    name: churnName,
    effects: [actionsEffect(1), {
      text: ["For each charge token on this put a non-".concat(churnName, " card from your discard into your hand.")],
      simpleText: ["Put 2 non-".concat(churnName, " cards from your discard into your hand.")],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var n, cards;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  n = state2.find(card).charge;
                  return [4, multichoice(state2, "Choose ".concat(num(n, "card"), " cards to put into your hand."), state2.discard.filter(function(c) {
                    return c.name != churnName;
                  }).map(asChoice), n)];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state2 = _a[0], cards = _a[1];
                  return [4, moveMany(cards, "hand")(state2)];
                case 2:
                  state2 = _b.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }, {
      text: ["Remove a charge token from this. Then if it has no charge tokens, trash it."],
      simpleText: ["This returns one less card each time you play it."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(state2.find(card).charge > 0)) return [3, 2];
                  return [4, discharge(card, 1)(state2)];
                case 1:
                  state2 = _a.sent();
                  _a.label = 2;
                case 2:
                  if (!(state2.find(card).charge == 0)) return [3, 4];
                  return [4, trash(card)(state2)];
                case 3:
                  state2 = _a.sent();
                  _a.label = 4;
                case 4:
                  return [2, state2];
              }
            });
          });
        };
      }
    }],
    buyCost: coin(3),
    staticReplacers: [startsWithCharge(churnName, 2, true)]
  };
  cardRewards.push(churn);
  var bustlingVillage = {
    name: "Bustling Village",
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [{
      text: ["+1 action for each card in play."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var n;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state2.play.length;
                  return [4, gainActions(n, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }, createInPlayEffect(villager)]
  };
  cardRewards.push(bustlingVillage);
  var governorName = "Governor";
  var governor = {
    name: governorName,
    buyCost: coin(5),
    relatedCards: [villager],
    effects: [actionsEffect(2), createInPlayEffect(villager)],
    staticTriggers: [{
      kind: "buy",
      handles: function(e, s) {
        return leq(coin(6), e.card.cost("buy", s));
      },
      text: ["Whenever you buy a card costing $6 or more, put all ".concat(governorName, "s in your discard into your hand.")],
      transform: function(e, s) {
        return moveMany(s.discard.filter(function(card) {
          return card.name == governorName;
        }), "hand");
      }
    }]
  };
  cardRewards.push(governor);
  var marketSquare = {
    name: "Market Square",
    relatedCards: [fair],
    effects: [actionsEffect(1), buysEffect(1)],
    buyCost: coin(2),
    staticTriggers: [afterBuyTrigger(createInPlayEffect(fair))]
  };
  cardRewards.push(marketSquare);
  var greatFeastName = "Great Feast";
  var greatFeast = {
    name: greatFeastName,
    buyCost: coin(10),
    effects: [{
      text: ["Do this three times: buy a card in the supply costing up to $8."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var i;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  i = 0;
                  _a.label = 1;
                case 1:
                  if (!(i < 3)) return [3, 4];
                  return [4, applyToTarget(function(target) {
                    return target.buy(card);
                  }, "Buy a card in the supply costing up to $8", function(s) {
                    return s.supply.filter(function(x) {
                      return leq(x.cost("buy", s), coin(8)) && canCreate(x.spec, s);
                    });
                  })(state2)];
                case 2:
                  state2 = _a.sent();
                  state2 = tick(card)(state2);
                  _a.label = 3;
                case 3:
                  i++;
                  return [3, 1];
                case 4:
                  return [2, state2];
              }
            });
          });
        };
      }
    }, trashThis()]
  };
  cardRewards.push(greatFeast);
  var universityName = "University";
  var university = {
    name: universityName,
    buyCost: coin(10),
    effects: [actionsEffect(4), buysEffect(2)],
    staticReplacers: [{
      text: ["".concat(universityName, " costs $1 less per action you have, but not less than $1.")],
      kind: "cost",
      handles: function(p) {
        return p.card.name == universityName && p.actionKind == "buy";
      },
      replace: function(p, s) {
        var k = Math.max(Math.min(s.actions, p.cost.coin - 1), 0);
        return __assign5(__assign5({}, p), { cost: addCosts(p.cost, { coin: -k }) });
      }
    }]
  };
  cardRewards.push(university);
  var moon = {
    name: "Moon",
    replacers: [{
      text: ["Whenever you would move this from play and this has no charge tokens on it,\n               instead put a charge token on it (it becomes full)."],
      simpleText: ["Whenever you would move this from play, instead it switches between full and empty."],
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.skip == false && c.charge == 0;
      },
      replace: function(p, s, c) {
        return __assign5(__assign5({}, p), { skip: true, effects: p.effects.concat([charge(c)]) });
      }
    }, {
      text: ["Whenever you would move this from play and this has at least one charge token on it,\n               instead remove all charge tokens from it (it becomes empty)."],
      simpleText: [],
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.skip == false && c.charge > 0;
      },
      replace: function(p, s, c) {
        return __assign5(__assign5({}, p), { skip: true, effects: p.effects.concat([discharge(c, c.charge)]) });
      }
    }]
  };
  var werewolf = {
    name: "Werewolf",
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [buyEffect(), {
      text: ["If a ".concat(moon.name, " in play has an odd number of charge tokens (moon is full) +$3, otherwise +3 actions.")],
      simpleText: ["If there is a full moon, +$3. Otherwise, +3 actions."],
      transform: function(s, c) {
        return s.play.some(function(c2) {
          return c2.name == moon.name && c2.charge % 2 == 1;
        }) ? gainCoins(3, c) : gainActions(3, c);
      }
    }],
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, create ".concat(a(moon.name), " in play with a charge token.")],
      simpleText: ["At the start of the game, create a full ".concat(moon.name, " in play. It switches between full and empty each time you Refresh.")],
      handles: function() {
        return true;
      },
      transform: function() {
        return create(moon, "play", function(card) {
          return charge(card, 1);
        });
      }
    }]
  };
  cardRewards.push(werewolf);
  var embargo = {
    name: "Embargo",
    replacers: [{
      text: ["Cards cost $1 more to buy."],
      kind: "costIncrease",
      handles: function(p) {
        return p.actionKind == "buy";
      },
      replace: function(p) {
        return __assign5(__assign5({}, p), { cost: addCosts(p.cost, coin(1)) });
      }
    }, {
      text: ["Non-free events cost $1 more to use."],
      kind: "costIncrease",
      handles: function(p) {
        return p.actionKind == "use" && p.cost.coin > 0;
      },
      replace: function(p) {
        return __assign5(__assign5({}, p), { cost: addCosts(p.cost, coin(1)) });
      }
    }, trashOnLeavePlay()]
  };
  var contraband = {
    name: "Contraband",
    buyCost: coin(4),
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo]
  };
  cardRewards.push(contraband);

  // public/data/potions.js
  var __awaiter7 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator7 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read10 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var potionOfInspiration = {
    name: "Potion of Inspiration",
    isPotion: true,
    effects: [{
      text: ["Triple your actions and buys."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, gainActions(2 * state2.actions, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [4, gainBuys(2 * state2.buys, card)(state2)];
                case 2:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(potionOfInspiration);
  var potionOfWealth = {
    name: "Potion of Wealth",
    isPotion: true,
    effects: [{
      text: ["Double your $ and buys."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, gainCoins(state2.coin, card)(state2)];
                case 1:
                  state2 = _a.sent();
                  return [4, gainBuys(state2.buys, card)(state2)];
                case 2:
                  state2 = _a.sent();
                  return [2, state2];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(potionOfWealth);
  var potionOfCopper = {
    name: "Potion of Copper",
    isPotion: true,
    effects: [{
      text: ["Create 8 Coppers in your hand."],
      transform: function() {
        return repeat(create(copper, "hand"), 8);
      }
    }]
  };
  potionRewards.push(potionOfCopper);
  var beggarsBrew = {
    name: "Beggar's Brew",
    isPotion: true,
    burden: true,
    effects: [coinsEffect(1)]
  };
  registerSpec(beggarsBrew);
  var potionOfBounty = {
    name: "Potion of Bounty",
    isPotion: true,
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty, 3)]
  };
  potionRewards.push(potionOfBounty);
  var potionOfTransformation = {
    name: "Potion of Transformation",
    isPotion: true,
    effects: [{
      text: ["Repeat this any number of times: trash a card in your hand that was there at the start of this process, then choose a card in the supply costing up to double its cost and create a copy in your hand."],
      simpleText: ["Trash any number of cards in your hand. For each one, create a card in your hand with up to double the cost."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var options, _loop_1, state_1;
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  options = asNumberedChoices(state2.hand);
                  _loop_1 = function() {
                    var picked, trashedCost, cost_1, toBuy;
                    var _b, _c;
                    return __generator7(this, function(_d) {
                      switch (_d.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to trash", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read10.apply(void 0, [_d.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          trashedCost = picked.cost("buy", state2);
                          cost_1 = addCosts(trashedCost, trashedCost);
                          return [4, trash(picked)(state2)];
                        case 3:
                          state2 = _d.sent();
                          toBuy = void 0;
                          return [4, choice(state2, "Pick a card to buy costing up to ".concat(renderCost(cost_1)), state2.supply.filter(function(c) {
                            return leq(c.cost("buy", state2), cost_1);
                          }).map(asChoice))];
                        case 4:
                          _c = __read10.apply(void 0, [_d.sent(), 2]), state2 = _c[0], toBuy = _c[1];
                          if (!(toBuy != null)) return [3, 6];
                          return [4, create(toBuy.spec, "hand")(state2)];
                        case 5:
                          state2 = _d.sent();
                          _d.label = 6;
                        case 6:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_1()];
                case 2:
                  state_1 = _a.sent();
                  if (typeof state_1 === "object")
                    return [2, state_1.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(potionOfTransformation);
  var ferryPotion = {
    name: "Ferry Potion",
    isPotion: true,
    rules: [ferryRule],
    effects: [targetedEffect(function(target) {
      return addToken(target, "ferry", 2);
    }, "Put two ferry tokens on a supply.", function(state) {
      return state.supply;
    })]
  };
  potionRewards.push(ferryPotion);
  var highwayPotion = {
    name: "Highway Potion",
    isPotion: true,
    effects: [{
      text: ["Put a ferry token on each supply."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            return __generator7(this, function(_a) {
              return [2, doAll(state2.supply.map(function(s) {
                return addToken(s, "ferry", 1);
              }))(state2)];
            });
          });
        };
      }
    }],
    rules: [ferryRule]
  };
  potionRewards.push(highwayPotion);
  var royalNectar = {
    name: "Royal Nectar",
    isPotion: true,
    effects: [targetedEffect(function(target, card) {
      return doAll([
        target.play(card),
        tick(card),
        target.play(card),
        tick(card),
        target.play(card)
      ]);
    }, "Play a card in your hand three times.", function(state) {
      return state.hand;
    })]
  };
  potionRewards.push(royalNectar);
  var potionOfReuse = {
    name: "Potion of Reuse",
    isPotion: true,
    effects: [{
      simpleText: ["Play each card in your discard."],
      text: ["Repeat any number of times:\n                choose a card in your discard\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var cards, options, _loop_2, state_2;
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.discard;
                  options = asNumberedChoices(cards);
                  _loop_2 = function() {
                    var picked, id_1;
                    var _b;
                    return __generator7(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "discard";
                          })))];
                        case 1:
                          _b = __read10.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          return [4, picked.play(card)(state2)];
                        case 3:
                          state2 = _c.sent();
                          id_1 = picked.id;
                          options = options.filter(function(c) {
                            return c.value.id != id_1;
                          });
                          _c.label = 4;
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_2()];
                case 2:
                  state_2 = _a.sent();
                  if (typeof state_2 === "object")
                    return [2, state_2.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(potionOfReuse);
  var potionOfFairs = {
    name: "Potion of Fairs",
    isPotion: true,
    simpleText: [],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [{
      text: ["Create a ".concat(fair.name, " in play with 15 shelter tokens on it.")],
      transform: function(state, card) {
        return create(fair, "play", function(c) {
          return noop;
        }, /* @__PURE__ */ new Map([["shelter", 15]]));
      }
    }]
  };
  potionRewards.push(potionOfFairs);
  var potionOfInsight = {
    name: "Potion of Insight",
    isPotion: true,
    relatedCards: [fair, villager],
    effects: [
      coinsEffect(1),
      actionsEffect(1),
      buysEffect(1),
      createInPlayEffect(fair),
      createInPlayEffect(villager)
    ]
  };
  potionRewards.push(potionOfInsight);
  var potionOfCreation = {
    name: "Potion of Creation",
    isPotion: true,
    effects: [targetedEffect(function(target, card) {
      return target.buy(card);
    }, "Buy a card in the supply costing up to $4.", function(state) {
      return state.supply.filter(function(x) {
        return leq(x.cost("buy", state), coin(4)) && canCreate(x.spec, state);
      });
    })]
  };
  potionRewards.push(potionOfCreation);
  var elixerOfInnovation = {
    name: "Elixer of Innovation",
    isPotion: true,
    relatedCards: [innovation],
    effects: [{
      text: ["Create two Innovations in your hand."],
      transform: function() {
        return repeat(create(innovation, "hand"), 2);
      }
    }]
  };
  potionRewards.push(elixerOfInnovation);
  var potionOfReflection = {
    name: "Potion of Reflection",
    isPotion: true,
    rules: [reflectRule],
    effects: [{
      text: ["Put a reflect token on each card in your hand."],
      transform: function(state, card) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "reflect");
        }));
      }
    }]
  };
  potionRewards.push(potionOfReflection);
  var sanguineElixir = {
    name: "Sanguine Elixir",
    isPotion: true,
    effects: [{
      text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
      simpleText: ["Play any number of cards in your hand."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var cards, options, _loop_3, state_3;
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_3 = function() {
                    var picked, id_2;
                    var _b;
                    return __generator7(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read10.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          return [4, picked.play(card)(state2)];
                        case 3:
                          state2 = _c.sent();
                          id_2 = picked.id;
                          options = options.filter(function(c) {
                            return c.value.id != id_2;
                          });
                          _c.label = 4;
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_3()];
                case 2:
                  state_3 = _a.sent();
                  if (typeof state_3 === "object")
                    return [2, state_3.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(sanguineElixir);
  var potionOfPriority = {
    name: "Potion of Priority",
    isPotion: true,
    rules: [priorityRule],
    effects: [targetedEffect(function(card) {
      return addToken(card, "priority", 8);
    }, "Put 8 priority tokens on a card in the supply.", function(state) {
      return state.supply;
    })]
  };
  potionRewards.push(potionOfPriority);
  var artistsBrew = {
    name: "Artist's Brew",
    isPotion: true,
    rules: [reductionRule],
    effects: [targetedEffect(function(card) {
      return addToken(card, "reduction", 16);
    }, "Put 16 reduction tokens on a card in the supply.", function(state) {
      return state.supply;
    })]
  };
  potionRewards.push(artistsBrew);
  var geminiBrew = {
    name: "Gemini Brew",
    isPotion: true,
    rules: [twinRule],
    effects: [targetedEffect(function(target) {
      return addToken(target, "twin");
    }, "Put a twin token on a card in your hand.", function(state) {
      return state.hand;
    })]
  };
  potionRewards.push(geminiBrew);
  var mirrorBrewName = "Mirror Brew";
  var mirrorBrew = {
    name: mirrorBrewName,
    isPotion: true,
    effects: [{
      text: ["Choose another potion you have other than ".concat(mirrorBrewName, ". Create a copy of it and use it immediately.")],
      simpleText: ["Copy the effect of another one of your potions."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var otherPotions, options, picked;
            var _a;
            return __generator7(this, function(_b) {
              switch (_b.label) {
                case 0:
                  otherPotions = state2.potions.filter(function(p) {
                    return p.name !== mirrorBrewName;
                  });
                  if (otherPotions.length === 0) {
                    return [2, state2];
                  }
                  options = asNumberedChoices(otherPotions);
                  return [4, choice(state2, "Choose a potion to copy.", allowNull(options))];
                case 1:
                  _a = __read10.apply(void 0, [_b.sent(), 2]), state2 = _a[0], picked = _a[1];
                  if (!(picked !== null)) return [3, 3];
                  return [4, create(picked.spec, "potions", function(potion) {
                    return potion.activate("potion", card);
                  })(state2)];
                case 2:
                  state2 = _b.sent();
                  _b.label = 3;
                case 3:
                  return [2, state2];
              }
            });
          });
        };
      }
    }]
  };
  potionRewards.push(mirrorBrew);

  // public/data/events.js
  var __assign6 = function() {
    __assign6 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign6.apply(this, arguments);
  };
  var __awaiter8 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator8 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read11 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __values8 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var cheat = {
    name: "Cheat",
    fixedCost: free,
    simpleText: ["+100 vp."],
    effects: [pointsEffect(100)]
  };
  registerSpec(cheat);
  var hallOfMirrors = {
    name: "Hall of Mirrors",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 5 }),
    effects: [{
      text: ["Put a reflect token on each card in your hand."],
      transform: function(state, card) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "reflect");
        }));
      }
    }],
    rules: [reflectRule]
  };
  eventRewards.push(hallOfMirrors);
  var volley = {
    name: "Volley",
    fixedCost: energy(1),
    effects: [{
      text: ["Repeat any number of times:\n        play then trash a card in your hand that was also there\n        at the start of this effect and that you haven't played yet."],
      simpleText: ["Play then trash any number of cards in your hand."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter8(this, void 0, void 0, function() {
            var cards, options, _loop_1, state_1;
            return __generator8(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_1 = function() {
                    var picked, id_1;
                    var _b;
                    return __generator8(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read11.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          return [4, picked.play(card)(state2)];
                        case 3:
                          state2 = _c.sent();
                          return [4, trash(picked)(state2)];
                        case 4:
                          state2 = _c.sent();
                          id_1 = picked.id;
                          options = options.filter(function(c) {
                            return c.value.id != id_1;
                          });
                          _c.label = 5;
                        case 5:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_1()];
                case 2:
                  state_1 = _a.sent();
                  if (typeof state_1 === "object")
                    return [2, state_1.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  eventRewards.push(volley);
  var parallelize = {
    name: "Parallelize",
    fixedCost: __assign6(__assign6({}, free), { coin: 1, energy: 1 }),
    effects: [{
      text: ["Put a parallelize token on each card in your hand."],
      simpleText: ["Put a parallelize token on each card in your hand. They cost @ less the next time you play them."],
      transform: function(state) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "parallelize");
        }));
      }
    }],
    staticReplacers: [{
      text: ["Cards cost @ less to play for each parallelize token on them.\n            Whenever this reduces a card's cost by one or more @,\n            remove that many parallelize tokens from it."],
      simpleText: [],
      // Already described under the first effect.
      kind: "cost",
      handles: function(x, state, card) {
        return x.actionKind == "play" && x.card.count("parallelize") > 0;
      },
      replace: function(x, state, card) {
        var reduction = Math.min(x.cost.energy, state.find(x.card).count("parallelize"));
        return __assign6(__assign6({}, x), { cost: __assign6(__assign6({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([
          removeToken(x.card, "parallelize", reduction, true)
        ]) }) });
      }
    }]
  };
  eventRewards.push(parallelize);
  var reach = {
    name: "Reach",
    fixedCost: energy(1),
    effects: [coinsEffect(2)]
  };
  eventRewards.push(reach);
  var finance = {
    name: "Finance",
    fixedCost: coin(1),
    effects: [actionsEffect(1)]
  };
  eventRewards.push(finance);
  var duplicate = {
    name: "Duplicate",
    fixedCost: __assign6(__assign6({}, free), { coin: 3, energy: 1 }),
    effects: [{
      text: ["Put a duplicate token on each card in the supply."],
      transform: function(state, card) {
        return doAll(state.supply.map(function(c) {
          return addToken(c, "duplicate");
        }));
      }
    }],
    rules: [duplicateRule]
  };
  eventRewards.push(duplicate);
  var toil = {
    name: "Toil",
    fixedCost: energy(1),
    effects: [createInPlayEffect(villager, 3)]
  };
  eventRewards.push(toil);
  var twin = {
    name: "Twin",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function(target) {
      return addToken(target, "twin");
    }, "Put a twin token on a card in your hand.", function(state) {
      return state.hand;
    })],
    rules: [twinRule]
  };
  eventRewards.push(twin);
  var expedite = {
    name: "Expedite",
    fixedCost: energy(1),
    effects: [chargeEffect(1, false)],
    staticReplacers: [playReplacer(["Whenever you would create a card in your discard,\n            if this has a charge token then instead\n            remove a charge token to set the card aside.\n            Then play it if it is set aside."], function(p, s, c) {
      return s.find(c).charge > 0;
    }, function(p, s, c) {
      return charge(c, -1);
    }, ["The next time you create a card, play it immediately."])]
  };
  eventRewards.push(expedite);
  function removeAllSupplyTokens(token, hideSimpleText) {
    if (hideSimpleText === void 0) {
      hideSimpleText = true;
    }
    return {
      text: ["Remove all ".concat(token, " tokens from cards in the supply.")],
      simpleText: hideSimpleText ? [] : void 0,
      transform: function(state, card) {
        return doAll(state.supply.map(function(s) {
          return removeToken(s, token, "all");
        }));
      }
    };
  }
  var synergy = {
    name: "Synergy",
    fixedCost: __assign6(__assign6({}, free), { energy: 1 }),
    effects: [removeAllSupplyTokens("synergy"), {
      text: ["Put synergy tokens on two cards in the supply."],
      simpleText: [
        "Put synergy tokens on two cards in the supply.",
        "Whenever you buy the more expensive one (or either if they are tied), you can buy the other one for free."
      ],
      transform: function() {
        return function(state) {
          return __awaiter8(this, void 0, void 0, function() {
            var cards, cards_1, cards_1_1, card, e_1_1;
            var _a, e_1, _b;
            return __generator8(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Choose two cards to synergize.", state.supply.map(asChoice), 2, 2)];
                case 1:
                  _a = __read11.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                  _c.label = 2;
                case 2:
                  _c.trys.push([2, 7, 8, 9]);
                  cards_1 = __values8(cards), cards_1_1 = cards_1.next();
                  _c.label = 3;
                case 3:
                  if (!!cards_1_1.done) return [3, 6];
                  card = cards_1_1.value;
                  return [4, addToken(card, "synergy")(state)];
                case 4:
                  state = _c.sent();
                  _c.label = 5;
                case 5:
                  cards_1_1 = cards_1.next();
                  return [3, 3];
                case 6:
                  return [3, 9];
                case 7:
                  e_1_1 = _c.sent();
                  e_1 = { error: e_1_1 };
                  return [3, 9];
                case 8:
                  try {
                    if (cards_1_1 && !cards_1_1.done && (_b = cards_1.return)) _b.call(cards_1);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 9:
                  return [2, state];
              }
            });
          });
        };
      }
    }],
    staticTriggers: [{
      text: ["After buying a card with a synergy token other than with this, buy a different card with a synergy token with equal or lesser cost."],
      simpleText: [],
      // Already described under the first effect.
      kind: "afterBuy",
      handles: function(e, state, card) {
        return !sourceHasName(e.source, card.name) && e.card.count("synergy") > 0;
      },
      transform: function(e, state, card) {
        return applyToTarget(function(target) {
          return target.buy(card);
        }, "Choose a card to buy.", function(s) {
          return s.supply.concat(s.events).filter(function(c) {
            return c.count("synergy") > 0 && leq(c.cost("buy", s), e.card.cost("buy", s)) && c.id != e.card.id;
          });
        });
      }
    }]
  };
  eventRewards.push(synergy);
  var focus = {
    name: "Focus",
    fixedCost: energy(1),
    effects: [buysEffect(2), actionsEffect(2)]
  };
  eventRewards.push(focus);
  var onslaught = {
    name: "Onslaught",
    fixedCost: __assign6(__assign6({}, free), { coin: 6, energy: 1 }),
    effects: [{
      text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
      simpleText: ["Play any number of cards in your hand."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter8(this, void 0, void 0, function() {
            var cards, options, _loop_2, state_2;
            return __generator8(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_2 = function() {
                    var picked, id_2;
                    var _b;
                    return __generator8(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read11.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          return [4, picked.play(card)(state2)];
                        case 3:
                          state2 = _c.sent();
                          id_2 = picked.id;
                          options = options.filter(function(c) {
                            return c.value.id != id_2;
                          });
                          _c.label = 4;
                        case 4:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_2()];
                case 2:
                  state_2 = _a.sent();
                  if (typeof state_2 === "object")
                    return [2, state_2.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  eventRewards.push(onslaught);
  var reflect = {
    name: "Reflect",
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })],
    effects: [targetedEffect(function(target, card) {
      return addToken(target, "reflect");
    }, "Put a reflect token on a card in your hand", function(state) {
      return state.hand;
    }), incrementCost()],
    rules: [reflectRule]
  };
  eventRewards.push(reflect);
  var replicate = {
    name: "Replicate",
    fixedCost: energy(1),
    effects: [chargeEffect(1, false)],
    staticTriggers: [{
      text: ["After buying a card other than with this,\n            remove a charge token from this to to buy the card again."],
      kind: "afterBuy",
      simpleText: ["The next time you buy a card, buy it again."],
      handles: function(e, s, c) {
        return s.find(c).charge > 0 && !sourceHasName(e.source, c.name);
      },
      transform: function(e, s, c) {
        return payToDo(discharge(c, 1), e.card.buy(c));
      }
    }]
  };
  eventRewards.push(replicate);
  var lostArts = {
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 3 }),
    name: "Lost Arts",
    effects: [targetedEffect(function(card) {
      return function(state) {
        return __awaiter8(this, void 0, void 0, function() {
          return __generator8(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, addToken(card, "reduction", 8)(state)];
              case 1:
                state = _a.sent();
                return [2, state];
            }
          });
        });
      };
    }, "Put 8 reduction tokens on a card in the supply.", function(s) {
      return s.supply;
    })],
    rules: [reductionRule]
  };
  eventRewards.push(lostArts);
  var polish = {
    name: "Polish",
    fixedCost: __assign6(__assign6({}, free), { coin: 1, energy: 1 }),
    effects: [{
      text: ["Put a polish token on each card in your hand."],
      transform: function(state) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "polish");
        }));
      }
    }],
    staticTriggers: [{
      text: ["Whenever you play a card with a polish token on it,\n        remove a polish token from it and +$1."],
      kind: "play",
      handles: function(e, state) {
        return e.card.count("polish") > 0;
      },
      transform: function(e, s, c) {
        return doAll([removeToken(e.card, "polish"), gainCoins(1, c)]);
      }
    }]
  };
  eventRewards.push(polish);
  var commerce = {
    name: "Commerce",
    fixedCost: coin(2),
    relatedCards: [villager, horse],
    effects: [createInPlayEffect(villager), createEffect(horse, "discard", 2)]
  };
  eventRewards.push(commerce);
  function reverbEffect(card) {
    return create(card.spec, "play", function(c) {
      return addToken(c, "echo");
    });
  }
  var reverberate = {
    name: "Reverberate",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 1 }),
    effects: [{
      text: ["For each card in play without an echo token,\n            create a copy in play with an echo token."],
      transform: function(state) {
        return doAll(state.play.filter(function(c) {
          return c.count("echo") == 0;
        }).map(reverbEffect));
      }
    }],
    rules: [echoRule]
  };
  eventRewards.push(reverberate);
  var festival = {
    name: "Festival",
    fixedCost: energy(1),
    effects: [createInPlayEffect(fair, 3)],
    relatedCards: [fair]
  };
  eventRewards.push(festival);
  function buyCheaper(card, s, source) {
    return applyToTarget(function(target) {
      return target.buy(source);
    }, "Choose a card to buy.", function(state) {
      return state.supply.filter(function(target) {
        return leq(addCosts(target.cost("buy", state), coin(1)), card.cost("buy", state)) && canCreate(target.spec, state);
      });
    });
  }
  var haggle = {
    name: "Haggle",
    fixedCost: energy(1),
    effects: [chargeEffect(2, false)],
    staticTriggers: [{
      kind: "afterBuy",
      text: ["After buying a card costing $1 or more, remove a charge token from this to buy a card\n        in the supply that costs at least $1 less."],
      simpleText: ["The next two times you buy a card, immediately buy a cheaper card."],
      handles: function(e, s, c) {
        return s.find(c).charge > 0 && leq(coin(1), e.card.cost("buy", s));
      },
      transform: function(e, s, c) {
        return payToDo(discharge(c, 1), buyCheaper(e.card, s, c));
      }
    }]
  };
  eventRewards.push(haggle);
  var splay = {
    name: "Splay",
    fixedCost: __assign6(__assign6({}, free), { coin: 2 }),
    effects: [{
      text: ["Put a reduction token on each supply."],
      transform: function(s) {
        return doAll(s.supply.map(function(c) {
          return addToken(c, "reduction");
        }));
      }
    }],
    rules: [reductionRule]
  };
  eventRewards.push(splay);
  var summon = {
    name: "Summon",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 4 }),
    effects: [multitargetedEffect(function(targets, card) {
      return doAll(targets.map(function(target) {
        return create(target.spec, "hand", function(c) {
          return addToken(c, "echo");
        });
      }));
    }, "Choose up to three cards in the supply costing up to $6. Create a copy of each in your hand with an echo token.", function(s) {
      return s.supply.filter(function(c) {
        return leq(c.cost("buy", s), coin(6));
      });
    }, 3)],
    rules: [echoRule]
  };
  eventRewards.push(summon);
  var reprise = {
    name: "Reprise",
    fixedCost: energy(1),
    effects: [{
      text: ["Put each card in your discard into your hand with an echo token on it."],
      transform: function(state) {
        return doAll(state.discard.map(function(c) {
          return doAll([move(c, "hand"), addToken(c, "echo")]);
        }));
      }
    }],
    rules: [echoRule]
  };
  eventRewards.push(reprise);
  var accelerate = {
    name: "Accelerate",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 1 }),
    effects: [{
      text: ["Put a priority token on each card in the supply."],
      transform: function(state, card) {
        return doAll(state.supply.map(function(c) {
          return addToken(c, "priority");
        }));
      }
    }],
    rules: [priorityRule]
  };
  eventRewards.push(accelerate);
  var swap = {
    name: "Swap",
    fixedCost: coin(1),
    effects: [targetedEffect(function(target) {
      return doAll([trash(target), applyToTarget(function(target2) {
        return create(target2.spec, "hand");
      }, "Choose a card to copy.", function(state) {
        return state.supply.filter(function(sup) {
          return leq(sup.cost("buy", state), target.cost("buy", state)) && canCreate(sup.spec, state);
        });
      })]);
    }, "Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.", function(state) {
      return state.hand;
    })]
  };
  eventRewards.push(swap);
  var hallOfEchoes = {
    name: "Hall of Echoes",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 3 }),
    effects: [{
      text: ["For each card in your hand without an echo token,\n                create a copy in your hand with an echo token."],
      transform: function(state) {
        return doAll(state.hand.filter(function(c) {
          return c.count("echo") == 0;
        }).map(function(c) {
          return create(c.spec, "hand", function(x) {
            return addToken(x, "echo");
          });
        }));
      }
    }],
    rules: [echoRule]
  };
  eventRewards.push(hallOfEchoes);
  var bulkOrder = {
    name: "Bulk Order",
    fixedCost: __assign6(__assign6({}, free), { coin: 2, energy: 1 }),
    effects: [targetedEffect(function(card) {
      return addToken(card, "duplicate", 5);
    }, "Put five duplicate tokens on a card in the supply.", function(state) {
      return state.supply;
    })],
    rules: [duplicateRule]
  };
  eventRewards.push(bulkOrder);

  // public/data/boons.js
  var __assign7 = function() {
    __assign7 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign7.apply(this, arguments);
  };
  var __awaiter9 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator9 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values9 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read12 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var escalate = {
    name: "Escalate",
    fixedCost: free,
    variableCosts: [costPer(coin(1))],
    effects: [
      useRefresh(),
      {
        text: ["Double the number of cost tokens on this."],
        simpleText: ["The cost of this event doubles each time you use it."],
        transform: function(s, c) {
          return addToken(c, "cost", s.find(c).tokens.get("cost"));
        }
      }
    ],
    staticTriggers: [{
      text: ["At the start of the game put a charge token on this."],
      kind: "afterStart",
      handles: function() {
        return true;
      },
      transform: function(e, s, c) {
        return addToken(c, "cost");
      }
    }]
  };
  boons.push({
    name: "Escalate",
    parAdjustment: -9,
    cards: [],
    events: [escalate]
  });
  var travelingFair = {
    name: "Traveling Fair",
    fixedCost: coin(1),
    effects: [buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair]
  };
  boons.push({
    name: "Traveling Fair",
    parAdjustment: 0,
    cards: [],
    events: [travelingFair]
  });
  var vault = {
    name: "Vault",
    restrictions: [cannotUse],
    staticReplacers: [{
      text: ["You can't lose actions, $, or buys (other than by paying costs)."],
      kind: "resource",
      handles: function(p) {
        return p.amount < 0 && (p.resource == "coin" || p.resource == "actions" || p.resource == "buys");
      },
      replace: function(p) {
        return __assign7(__assign7({}, p), { amount: 0 });
      }
    }]
  };
  boons.push({
    name: "Vault",
    parAdjustment: 3,
    cards: [],
    events: [vault]
  });
  var logisticsToken = "logistics";
  var logistics = {
    name: "Logistics",
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [{
      text: ["Put a ".concat(logisticsToken, " token on each supply.")],
      transform: function(s) {
        return doAll(s.events.map(function(e) {
          return addToken(e, "logistics");
        }));
      }
    }],
    staticReplacers: [{
      text: ["Events cost @ less for each logistics token on them, but ".concat(refresh.name, " can't cost 0. Whenever this reduces a cost, remove a logistics token.")],
      kind: "cost",
      handles: function(p) {
        return p.actionKind == "use" && p.card.count("logistics") > 0;
      },
      replace: function(p, state) {
        var card = state.find(p.card);
        var maxReduction = p.card.name == refresh.name ? p.cost.energy - 1 : p.cost.energy;
        var reduction = Math.max(Math.min(maxReduction, card.count("logistics")), 0);
        return __assign7(__assign7({}, p), { cost: __assign7(__assign7({}, p.cost), { energy: p.cost.energy - reduction, effects: p.cost.effects.concat([removeToken(card, "logistics", reduction)]) }) });
      }
    }]
  };
  boons.push({
    name: "Logistics",
    parAdjustment: -1,
    cards: [logistics],
    events: []
  });
  var populate = {
    name: "Populate",
    fixedCost: free,
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, buy every card in the supply."],
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter9(this, void 0, void 0, function() {
            var _a, _b, supplyCard, e_1_1;
            var e_1, _c;
            return __generator9(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values9(state2.supply), _b = _a.next();
                  _d.label = 1;
                case 1:
                  if (!!_b.done) return [3, 4];
                  supplyCard = _b.value;
                  return [4, supplyCard.buy(card)(state2)];
                case 2:
                  state2 = _d.sent();
                  _d.label = 3;
                case 3:
                  _b = _a.next();
                  return [3, 1];
                case 4:
                  return [3, 7];
                case 5:
                  e_1_1 = _d.sent();
                  e_1 = { error: e_1_1 };
                  return [3, 7];
                case 6:
                  try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 7:
                  return [2, state2];
              }
            });
          });
        };
      }
    }]
  };
  boons.push({
    name: "Populate",
    parAdjustment: -9,
    cards: [],
    events: [populate]
  });
  var recover = {
    name: "Recover",
    fixedCost: coin(1),
    variableCosts: [costPer(coin(1))],
    effects: [multitargetedEffect(function(targets) {
      return moveMany(targets, "hand");
    }, "Put up to 2 cards from your discard into your hand.", function(state) {
      return state.discard;
    }, 2), incrementCost()]
  };
  boons.push({
    name: "Recover",
    parAdjustment: -1,
    cards: [],
    events: [recover]
  });
  var recycle = {
    name: "Recycle",
    fixedCost: energy(1),
    effects: [recycleEffect()]
  };
  boons.push({
    name: "Recycle",
    parAdjustment: -4,
    cards: [],
    events: [recycle]
  });
  var flourishName = "Flourish";
  var flourish = {
    name: flourishName,
    fixedCost: free,
    restrictions: [{
      text: ["You cannot use this if your score times the number of charge tokens on this is less than the vp goal."],
      simpleText: ["You cannot use this unless you have 1/16 of the points needed to win."],
      test: function(card, state) {
        return state.points * state.find(card).charge < state.vp_goal;
      }
    }],
    effects: [
      useRefresh(),
      {
        text: ["Remove half of the charge tokens from this (rounded down)."],
        simpleText: ["The vp requirement doubles each time you use this event."],
        transform: function(s, c) {
          var currentCharge = s.find(c).charge;
          var toRemove = Math.floor(currentCharge / 2);
          return discharge(c, toRemove);
        }
      }
    ],
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, put 16 charge tokens on this."],
      simpleText: [],
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return charge(card, 16);
      }
    }]
  };
  boons.push({
    name: "Flourish",
    parAdjustment: -6,
    cards: [],
    events: [flourish]
  });
  var publicWorks = {
    name: "Public Works",
    buyCost: coin(6),
    effects: [],
    replacers: [{
      text: ["Events cost @ less, but ".concat(refresh.name, " can't cost 0. Whenever this reduces a cost, discard it.")],
      kind: "cost",
      handles: function(p) {
        return p.actionKind == "use";
      },
      replace: function(p, state, pworks) {
        var card = state.find(p.card);
        var maxReduction = p.card.name == refresh.name ? p.cost.energy - 1 : p.cost.energy;
        var reduction = Math.max(Math.min(maxReduction, 1), 0);
        var extraEffects = reduction > 0 ? [move(pworks, "discard")] : [];
        return __assign7(__assign7({}, p), { cost: __assign7(__assign7({}, p.cost), { energy: p.cost.energy - reduction, effects: p.cost.effects.concat(extraEffects) }) });
      }
    }]
  };
  boons.push({
    name: "Public Works",
    parAdjustment: -2,
    cards: [publicWorks],
    events: []
  });
  var reuse = {
    name: "Reuse",
    fixedCost: energy(1),
    effects: [{
      text: ["Repeat any number of times:\n                choose a card in your discard without a reuse token\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
      simpleText: [
        "Play any number of cards in your discard that don't have a reuse token on them.",
        "Put a reuse token on each card played this way."
      ],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter9(this, void 0, void 0, function() {
            var cards, options, _loop_1, state_1;
            return __generator9(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.discard.filter(function(c) {
                    return c.count("reuse") == 0;
                  });
                  options = asNumberedChoices(cards);
                  _loop_1 = function() {
                    var picked, id_1;
                    var _b;
                    return __generator9(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "discard";
                          })))];
                        case 1:
                          _b = __read12.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
                          if (!(picked == null)) return [3, 2];
                          return [2, { value: state2 }];
                        case 2:
                          return [4, picked.play(card)(state2)];
                        case 3:
                          state2 = _c.sent();
                          return [4, addToken(picked, "reuse")(state2)];
                        case 4:
                          state2 = _c.sent();
                          id_1 = picked.id;
                          options = options.filter(function(c) {
                            return c.value.id != id_1;
                          });
                          _c.label = 5;
                        case 5:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  };
                  _a.label = 1;
                case 1:
                  if (false) return [3, 3];
                  return [5, _loop_1()];
                case 2:
                  state_1 = _a.sent();
                  if (typeof state_1 === "object")
                    return [2, state_1.value];
                  return [3, 1];
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  boons.push({
    name: "Reuse",
    parAdjustment: -4,
    cards: [],
    events: [reuse]
  });
  var prioritize = {
    name: "Prioritize",
    fixedCost: __assign7(__assign7({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function(card) {
      return addToken(card, "priority", 8);
    }, "Put 8 priority tokens on a card in the supply.", function(state) {
      return state.supply;
    })],
    rules: [priorityRule]
  };
  boons.push({
    name: "Prioritize",
    parAdjustment: -2,
    cards: [],
    events: [prioritize]
  });
  var compostingName = "Composting";
  var composting = {
    name: compostingName,
    buyCost: coin(3),
    effects: [],
    triggers: [{
      kind: "cost",
      text: ["Whenever you pay @,\n        you may put a card from your discard into your hand."],
      handles: function(e) {
        return e.cost.energy > 0;
      },
      transform: function(e) {
        return function(state) {
          return __awaiter9(this, void 0, void 0, function() {
            var n, targets;
            var _a;
            return __generator9(this, function(_b) {
              switch (_b.label) {
                case 0:
                  n = e.cost.energy;
                  return [4, multichoice(state, "Choose up to ".concat(num(n, "card"), " to put into your hand."), state.discard.map(asChoice), n)];
                case 1:
                  _a = __read12.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [2, moveMany(targets, "hand")(state)];
              }
            });
          });
        };
      }
    }],
    replacers: [{
      kind: "move",
      text: ["Whenever Composting would move to your hand, instead leave it in play."],
      handles: function(p, s, c) {
        return p.toZone == "hand" && p.card.id == c.id;
      },
      replace: function(p) {
        return __assign7(__assign7({}, p), { skip: true });
      }
    }],
    staticReplacers: [startInPlay(compostingName)]
  };
  var wait = {
    name: "Wait",
    fixedCost: energy(1),
    effects: [{
      text: ["Do nothing."],
      transform: function() {
        return noop;
      }
    }]
  };
  boons.push({
    name: "Composting",
    parAdjustment: 0,
    cards: [composting],
    events: [wait]
  });
  var insight = {
    name: "Insight",
    fixedCost: energy(1),
    relatedCards: [villager, fair],
    effects: [
      actionsEffect(1),
      buysEffect(1),
      coinsEffect(1),
      createInPlayEffect(villager),
      createInPlayEffect(fair)
    ]
  };
  boons.push({
    name: "Insight",
    parAdjustment: 0,
    cards: [],
    events: [insight]
  });
  var windfall = {
    name: "Windfall",
    fixedCost: free,
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, +$15 and +5 buys."],
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return doAll([gainCoins(15, card), gainBuys(5, card)]);
      }
    }]
  };
  boons.push({
    name: "Windfall",
    parAdjustment: -7,
    cards: [],
    events: [windfall]
  });
  var duplicateStart = {
    name: "Duplication",
    fixedCost: free,
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, put a duplicate token on each card in the supply."],
      simpleText: ["The first time you buy each card, buy it again."],
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter9(this, void 0, void 0, function() {
            var _a, _b, supply, e_2_1;
            var e_2, _c;
            return __generator9(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values9(state2.supply), _b = _a.next();
                  _d.label = 1;
                case 1:
                  if (!!_b.done) return [3, 4];
                  supply = _b.value;
                  return [4, addToken(supply, "duplicate")(state2)];
                case 2:
                  state2 = _d.sent();
                  _d.label = 3;
                case 3:
                  _b = _a.next();
                  return [3, 1];
                case 4:
                  return [3, 7];
                case 5:
                  e_2_1 = _d.sent();
                  e_2 = { error: e_2_1 };
                  return [3, 7];
                case 6:
                  try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                  } finally {
                    if (e_2) throw e_2.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 7:
                  return [2, state2];
              }
            });
          });
        };
      }
    }],
    rules: [duplicateRule]
  };
  boons.push({
    name: "Duplication",
    parAdjustment: 0,
    cards: [],
    events: [duplicateStart]
  });

  // public/data/victory.js
  var __assign8 = function() {
    __assign8 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign8.apply(this, arguments);
  };
  var estate = {
    name: "Estate",
    buyCost: coin(1),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
  };
  var duchy = {
    name: "Duchy",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
  };
  var province = {
    name: "Province",
    buyCost: coin(8),
    fixedCost: energy(1),
    effects: [pointsEffect(1)]
  };
  var colony = {
    name: "Colony",
    fixedCost: energy(1),
    buyCost: coin(15),
    effects: [pointsEffect(1)]
  };
  var flowerMarket = {
    name: "Flower Market",
    buyCost: coin(2),
    effects: [buyEffect(), pointsEffect(1)],
    staticTriggers: [buyTrigger(pointsEffect(1))]
  };
  var vibrantCity = {
    name: "Vibrant City",
    effects: [pointsEffect(1), actionsEffect(1)],
    buyCost: coin(5)
  };
  var frontierName = "Frontier";
  var frontier = {
    name: frontierName,
    fixedCost: energy(1),
    buyCost: coin(6),
    effects: [{
      text: ["+1 vp per charge token on this."],
      simpleText: ["+1 vp"],
      transform: function(state, card) {
        return gainPoints(state.find(card).charge, card);
      }
    }, {
      text: ["Put a charge token on this."],
      simpleText: ["This gets +1 vp each time you play it."],
      transform: function(state, card) {
        return charge(card, 1);
      }
    }],
    staticReplacers: [startsWithCharge(frontierName, 1, true)]
  };
  var gardens = {
    name: "Gardens",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [{
      text: ["+1 vp per 8 cards in your hand, discard, resolving, and play."],
      transform: function(state, card) {
        return gainPoints(Math.floor((state.hand.length + state.discard.length + state.play.length + state.resolvingCards().length) / 8), card);
      }
    }]
  };
  var territoryName = "Territory";
  var territory = {
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(1)],
    staticReplacers: [{
      kind: "move",
      text: ["When you play a ".concat(territoryName, " from your hand, leave it there.")],
      simpleText: ["Leave this in your hand when you play it."],
      handles: function(p) {
        return p.card.name == territoryName && p.toZone == "resolving" && p.fromZone == "hand";
      },
      replace: function(p) {
        return __assign8(__assign8({}, p), { skip: true });
      }
    }]
  };
  var farmlandName = "Farmland";
  var farmland = {
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
      kind: "play",
      text: ["Whenever you play a ".concat(farmlandName, " the normal way, +1 vp.")],
      simpleText: ["+1 vp if you played this the normal way (paying its cost from your hand)."],
      handles: function(e) {
        return e.source == "act" && e.card.name == farmlandName;
      },
      transform: function(e, s, c) {
        return gainPoints(1, c);
      }
    }]
  };
  var palace = {
    name: "Palace",
    fixedCost: energy(1),
    buyCost: coin(5),
    effects: [actionsEffect(2), pointsEffect(1), coinsEffect(2)]
  };
  var duke = {
    name: "Duke",
    buyCost: coin(4),
    effects: [],
    triggers: [{
      text: ["Whenever you play ".concat(a(duchy.name), ", +1 vp.")],
      kind: "play",
      handles: function(e) {
        return e.card.name == duchy.name;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var monument = {
    name: "Monument",
    fixedCost: coin(50),
    effects: [pointsEffect(50)]
  };
  var thoroughfare = {
    name: "Thoroughfare",
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "play",
      text: ["Whenever you play a card, +1 vp."],
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var foundation = {
    name: "Foundation",
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "buy",
      text: ["Whenever you buy a card other than ".concat(copper.name, ", +1 vp.")],
      handles: function(e, state) {
        return e.card.name != copper.name;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var capitalize = {
    name: "Capitalize",
    fixedCost: coin(1),
    effects: [pointsEffect(1)]
  };
  var frontierVPMode = { name: "Frontier", target: 25, cards: [frontier], events: [] };
  vpModes.push({ name: "Province", target: 10, cards: [province], events: [] }, { name: "Duchy", target: 15, cards: [duchy], events: [] }, { name: "Estate", target: 20, cards: [estate], events: [] }, { name: "Colony", target: 5, cards: [colony], events: [] }, { name: "Thoroughfare", target: 80, cards: [], events: [thoroughfare] }, { name: "Foundation", target: 25, cards: [], events: [foundation] }, { name: "Capitalize", target: 70, cards: [], events: [capitalize] }, { name: "Monument", target: 50, cards: [], events: [monument] }, { name: "Duke", target: 40, cards: [duchy, duke], events: [] }, { name: "Flower Market", target: 40, cards: [flowerMarket], events: [] }, { name: "Farmland", target: 5, cards: [farmland], events: [] }, { name: "Vibrant City", target: 20, cards: [vibrantCity], events: [] }, { name: "Palace", target: 20, cards: [palace], events: [] }, { name: "Territory", target: 20, cards: [territory], events: [] }, frontierVPMode, { name: "Gardens", target: 30, cards: [gardens], events: [] });

  // public/data/encounters.js
  var __assign9 = function() {
    __assign9 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign9.apply(this, arguments);
  };
  var __awaiter10 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator10 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read13 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray8 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var __values10 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function registerUpgrade(id, upgrade) {
    upgrade.id = id;
    registerEncounterUpgrade(id, upgrade);
    return upgrade;
  }
  function cooperationTargets(state, sourceCard) {
    var source = state.find(sourceCard);
    var maxCost = source.cost("use", state);
    return state.events.filter(function(event) {
      if (event.id === source.id)
        return false;
      if (!leq(event.cost("use", state), maxCost))
        return false;
      return event.available("use", state);
    });
  }
  var polishUpgrade = registerUpgrade("polish", {
    name: function(name) {
      return "".concat(name, "+");
    },
    effects: [coinsEffect(1)]
  });
  var sharpenUpgrade = registerUpgrade("sharpen", {
    name: function(name) {
      return "".concat(name, "+");
    },
    effects: [actionsEffect(1)]
  });
  var streamlineUpgrade = registerUpgrade("streamline", {
    name: function(name) {
      return "".concat(name, "+");
    },
    cost: function(cost, kind) {
      return kind === "play" ? __assign9(__assign9({}, cost), { energy: Math.max(cost.energy - 1, 0) }) : cost;
    }
  });
  var transmuteUpgrade = registerUpgrade("transmute", {
    name: function(name) {
      return "".concat(name, "+");
    },
    effects: [{
      text: [
        "Trash this.",
        "Buy a card in the supply costing up to $2 more than this."
      ],
      transform: function(_state, sourceCard) {
        return function(state) {
          return __awaiter10(this, void 0, void 0, function() {
            var maxCost;
            return __generator10(this, function(_a) {
              switch (_a.label) {
                case 0:
                  maxCost = addCosts(sourceCard.cost("buy", state), coin(2));
                  return [4, trash(sourceCard)(state)];
                case 1:
                  state = _a.sent();
                  return [4, applyToTarget(function(target) {
                    return target.buy(sourceCard);
                  }, "Choose a card to buy.", function(s) {
                    return s.supply.filter(function(c) {
                      return leq(c.cost("buy", s), maxCost);
                    });
                  })(state)];
                case 2:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  });
  var fortifyUpgrade = registerUpgrade("fortify", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "move",
      text: ["Whenever a card that shares a name with this is trashed, create a card costing $1, $2, or $3 more in your hand."],
      handles: function(e, _state, card) {
        return e.toZone === "void" && card !== null && e.card.name === card.name;
      },
      transform: function(e, _state, _card) {
        return function(state) {
          return __awaiter10(this, void 0, void 0, function() {
            var trashedCard, trashedCost, minCoin, maxCoin;
            return __generator10(this, function(_a) {
              switch (_a.label) {
                case 0:
                  trashedCard = state.find(e.card);
                  trashedCost = trashedCard.cost("buy", state);
                  minCoin = trashedCost.coin + 1;
                  maxCoin = trashedCost.coin + 3;
                  return [4, applyToTarget(function(target) {
                    return create(target.spec, "hand");
                  }, "Choose a card to create in hand.", function(s) {
                    return s.supply.filter(function(candidate) {
                      var candidateCost = candidate.cost("buy", s).coin;
                      return candidateCost >= minCoin && candidateCost <= maxCoin;
                    });
                  })(state)];
                case 1:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  });
  var possessUpgrade = registerUpgrade("possess", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [buyTrigger({
      text: [
        "Trash a card in your hand.",
        "Choose a card in the supply costing up to $2 more than it and create a copy in your hand."
      ],
      transform: function(_state, _sourceCard) {
        return function(state) {
          return __awaiter10(this, void 0, void 0, function() {
            return __generator10(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (state.hand.length === 0) {
                    return [2, state];
                  }
                  return [4, applyToTarget(function(trashed) {
                    return function(state2) {
                      return __awaiter10(this, void 0, void 0, function() {
                        var maxCost;
                        return __generator10(this, function(_a2) {
                          switch (_a2.label) {
                            case 0:
                              maxCost = addCosts(trashed.cost("buy", state2), coin(2));
                              return [4, trash(trashed)(state2)];
                            case 1:
                              state2 = _a2.sent();
                              return [4, applyToTarget(function(target) {
                                return create(target.spec, "hand");
                              }, "Choose a card to copy.", function(s) {
                                return s.supply.filter(function(c) {
                                  return leq(c.cost("buy", s), maxCost);
                                });
                              })(state2)];
                            case 2:
                              state2 = _a2.sent();
                              return [2, state2];
                          }
                        });
                      });
                    };
                  }, "Choose a card to trash.", function(s) {
                    return s.hand;
                  })(state)];
                case 1:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    })]
  });
  var buyOneGetOneUpgrade = registerUpgrade("buyOneGetOne", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "beforeStart",
      text: ["At the start of the game, put a duplicate token on this."],
      simpleText: ["The first time you buy this each stage, buy it again for free."],
      handles: function() {
        return true;
      },
      transform: function(_e, _s, card) {
        return addToken(card, "duplicate", 1);
      }
    }]
  });
  var rushOrderUpgrade = registerUpgrade("rushOrder", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "afterStart",
      text: ["At the start of the game, put a priority token on this."],
      handles: function(p, _state, card) {
        return true;
      },
      transform: function(_e, _s, card) {
        return addToken(card, "priority", 1);
      }
    }]
  });
  var saleUpgrade = registerUpgrade("sale", {
    name: function(name) {
      return "".concat(name, "+");
    },
    cost: function(cost, kind) {
      if (kind !== "buy" || cost.coin <= 1) {
        return cost;
      }
      return __assign9(__assign9({}, cost), { coin: Math.max(cost.coin - 2, 1) });
    }
  });
  var tacticianStrengthUpgrade = registerUpgrade("tacticianStrength", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [
      {
        kind: "afterStart",
        text: ["This starts with 4 reflect tokens."],
        handles: function(_e, state, sourceCard) {
          return true;
        },
        transform: function(_e, _state, sourceCard) {
          return addToken(sourceCard, "reflect", 4);
        }
      },
      {
        text: ["After using this other than with this ability, if it has a reflect token on it remove the token to use it again."],
        kind: "afterUse",
        handles: function(e, state, card) {
          var played = state.find(e.card);
          return played.count("reflect") > 0 && !sourceHasName(e.source, card.name);
        },
        transform: function(e, s, card) {
          return doAll([
            removeToken(e.card, "reflect"),
            e.card.use(card)
            // the source is the card itself
          ]);
        }
      }
    ]
  });
  var tacticianAgilityUpgrade = registerUpgrade("tacticianAgility", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "afterStart",
      text: ["This starts with 2 reduction tokens on it."],
      handles: function(_e, state, sourceCard) {
        return state.find(sourceCard).count("reduce") === 0;
      },
      transform: function(_e, _state, sourceCard) {
        return addToken(sourceCard, "reduce", 2);
      }
    }],
    staticReplacers: [{
      kind: "cost",
      text: ["This costs @ less to use for each reduction token on it. Whenever this reduces a cost, remove that many reduction tokens."],
      handles: function(params, state, sourceCard) {
        return params.actionKind === "use" && params.card.id === sourceCard.id && state.find(sourceCard).count("reduce") > 0;
      },
      replace: function(params, state, sourceCard) {
        var available = state.find(sourceCard).count("reduce");
        var reduction = Math.min(available, params.cost.energy, 1);
        if (reduction <= 0)
          return params;
        return __assign9(__assign9({}, params), { cost: __assign9(__assign9({}, params.cost), { energy: params.cost.energy - reduction, effects: params.cost.effects.concat([removeToken(params.card, "reduce", reduction, true)]) }) });
      }
    }]
  });
  var tacticianCooperationUpgrade = registerUpgrade("tacticianCooperation", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "afterUse",
      text: ["Every time you use this, use another event that's cheaper or equal for free."],
      handles: function(e, state, sourceCard) {
        return e.card.id === sourceCard.id && !sourceHasName(e.source, sourceCard.name) && cooperationTargets(state, sourceCard).length > 0;
      },
      transform: function(_e, _state, sourceCard) {
        return function(state) {
          return __awaiter10(this, void 0, void 0, function() {
            var source;
            return __generator10(this, function(_a) {
              source = state.find(sourceCard);
              return [2, applyToTarget(function(target) {
                return target.use(source);
              }, "Choose another event with equal or lesser cost to use for free.", function(s) {
                return cooperationTargets(s, source);
              }, { optional: "none" })(state)];
            });
          });
        };
      }
    }]
  });
  function upgradeCardSpec(spec, upgrade) {
    return __assign9(__assign9({}, spec), { upgrades: __spreadArray8(__spreadArray8([], __read13(spec.upgrades || []), false), [upgrade], false) });
  }
  function simpleEncounter(config) {
    return {
      name: config.name,
      createInitialData: function() {
        return { selectedIndex: null };
      },
      getOptions: function(data, metaState) {
        var _this = this;
        var selectedIndex = data.selectedIndex;
        return config.options.map(function(opt, i) {
          return {
            label: opt.label,
            description: opt.description,
            spec: opt.spec,
            disabled: selectedIndex !== null || (opt.disabled ? opt.disabled(metaState) : false),
            checked: selectedIndex === i,
            onClick: function() {
              return __awaiter10(_this, void 0, void 0, function() {
                return __generator10(this, function(_a) {
                  return [2, {
                    newData: { selectedIndex: i },
                    transform: opt.transform
                  }];
                });
              });
            }
          };
        });
      }
    };
  }
  var distillery = {
    name: "Distillery",
    createInitialData: function() {
      return { selectedIndex: null };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      var hasCards = metaState.data.collectedCards.length > 0;
      return [
        {
          label: "Bottle a card",
          description: "Choose a card from your deck, and gain a potion that creates a copy of that card in your hand.",
          disabled: d.selectedIndex !== null || !hasCards,
          checked: d.selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var card;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a card to bottle:", __spreadArray8([], __read13(metaState.data.collectedCards), false), true)];
                  case 1:
                    card = _a.sent();
                    if (!card) {
                      return [2, { newData: data }];
                    }
                    return [2, {
                      newData: { selectedIndex: 0 },
                      transform: gainPotion(makeBottledCardPotion(card), {
                        details: "Bottled card ".concat(displayName(card))
                      })
                    }];
                }
              });
            });
          }
        },
        {
          label: "Gift Box",
          spec: giftBox,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 1 },
                  transform: gainRelic(giftBox)
                }];
              });
            });
          }
        },
        {
          label: "Empty Bottle",
          spec: emptyBottle,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 2 },
                  transform: gainRelic(emptyBottle)
                }];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(distillery);
  var mirrorMaker = {
    name: "Mirror Maker",
    createInitialData: function() {
      return { selectedIndex: null };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var selectedIndex = data.selectedIndex;
      var hasRelics = metaState.data.relics.length > 0;
      return [
        {
          label: "Distill the mirror",
          description: "Gain a Mirror Brew.",
          disabled: selectedIndex !== null,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 0 },
                  transform: gainPotion(mirrorBrew)
                }];
              });
            });
          }
        },
        {
          label: "Use the mirror",
          description: "Copy one of your relics.",
          disabled: selectedIndex !== null || !hasRelics,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var relicSpecs, relic;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    relicSpecs = metaState.data.relics.map(function(r) {
                      return r.spec;
                    });
                    return [4, metaState.ui.chooseCard(metaState, "Choose a relic to duplicate:", relicSpecs, true)];
                  case 1:
                    relic = _a.sent();
                    if (!relic) {
                      return [2, { newData: data }];
                    }
                    return [2, {
                      newData: { selectedIndex: 1 },
                      transform: gainRelic(relic, {
                        details: "Mirrored ".concat(displayName(relic))
                      })
                    }];
                }
              });
            });
          }
        },
        {
          label: "Take the mirror for the road",
          description: "The next time you gain a relic, gain two additional copies.",
          disabled: selectedIndex !== null,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 2 },
                  transform: gainRelic(silverMirror)
                }];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(mirrorMaker);
  var blacksmith = {
    name: "The Blacksmith",
    createInitialData: function() {
      return { selectedIndex: null };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var selectedIndex = data.selectedIndex;
      var hasCards = metaState.data.collectedCards.length > 0;
      var chooseUpgrade = function(upgrade, index, upgradeName) {
        return __awaiter10(_this, void 0, void 0, function() {
          var card, chosenName;
          var _this2 = this;
          return __generator10(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, metaState.ui.chooseCard(metaState, "Choose a card to upgrade:", __spreadArray8([], __read13(metaState.data.collectedCards), false), true)];
              case 1:
                card = _a.sent();
                if (!card) {
                  return [2, { newData: data }];
                }
                chosenName = displayName(card);
                return [2, {
                  newData: { selectedIndex: index },
                  transform: function(state) {
                    return __awaiter10(_this2, void 0, void 0, function() {
                      var updated, cards, cardIndex;
                      return __generator10(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            updated = upgradeCardSpec(card, upgrade);
                            cards = __spreadArray8([], __read13(state.data.collectedCards), false);
                            cardIndex = cards.indexOf(card);
                            if (!(cardIndex >= 0)) return [3, 2];
                            cards[cardIndex] = updated;
                            state.update({ collectedCards: cards });
                            return [4, addTimelineAction("The Blacksmith: Upgraded ".concat(chosenName, " with ").concat(upgradeName))(state)];
                          case 1:
                            _a2.sent();
                            _a2.label = 2;
                          case 2:
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  }
                }];
            }
          });
        });
      };
      return [
        {
          label: "Polish",
          description: "Add +$1 to a card.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(polishUpgrade, 0, "Polish")];
              });
            });
          }
        },
        {
          label: "Sharpen",
          description: "Add +1 action to a card.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(sharpenUpgrade, 1, "Sharpen")];
              });
            });
          }
        },
        {
          label: "Streamline",
          description: "Reduce the play cost of a card by @.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(streamlineUpgrade, 2, "Streamline")];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(blacksmith);
  var shopkeeper = {
    name: "Shopkeeper",
    createInitialData: function() {
      return { selectedIndex: null };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var selectedIndex = data.selectedIndex;
      var hasCards = metaState.data.collectedCards.length > 0;
      var chooseUpgrade = function(upgrade, index, upgradeName) {
        return __awaiter10(_this, void 0, void 0, function() {
          var card, chosenName;
          var _this2 = this;
          return __generator10(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, metaState.ui.chooseCard(metaState, "Choose a card to upgrade:", __spreadArray8([], __read13(metaState.data.collectedCards), false), true)];
              case 1:
                card = _a.sent();
                if (!card) {
                  return [2, { newData: data }];
                }
                chosenName = displayName(card);
                return [2, {
                  newData: { selectedIndex: index },
                  transform: function(state) {
                    return __awaiter10(_this2, void 0, void 0, function() {
                      var updated, cards, cardIndex;
                      return __generator10(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            updated = upgradeCardSpec(card, upgrade);
                            cards = __spreadArray8([], __read13(state.data.collectedCards), false);
                            cardIndex = cards.indexOf(card);
                            if (!(cardIndex >= 0)) return [3, 2];
                            cards[cardIndex] = updated;
                            state.update({ collectedCards: cards });
                            return [4, addTimelineAction("Shopkeeper: Upgraded ".concat(chosenName, " with ").concat(upgradeName))(state)];
                          case 1:
                            _a2.sent();
                            _a2.label = 2;
                          case 2:
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  }
                }];
            }
          });
        });
      };
      return [
        {
          label: "Buy one get one",
          description: "Choose a card. The first time you buy it each stage, buy it again for free.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(buyOneGetOneUpgrade, 0, "Buy one get one")];
              });
            });
          }
        },
        {
          label: "Rush order",
          description: "Choose a card. The first time you create it each stage, play it for free.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(rushOrderUpgrade, 1, "Rush order")];
              });
            });
          }
        },
        {
          label: "Sale",
          description: "Choose a card. Reduce its buy cost by $2 (but not less than $1).",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(saleUpgrade, 2, "Sale")];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(shopkeeper);
  var tactician = {
    name: "Tactician",
    createInitialData: function() {
      return { selectedIndex: null };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var selectedIndex = data.selectedIndex;
      var hasEvents = metaState.data.collectedEvents.length > 0;
      var chooseUpgrade = function(upgrade, index, upgradeName) {
        return __awaiter10(_this, void 0, void 0, function() {
          var event, chosenName;
          var _this2 = this;
          return __generator10(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, metaState.ui.chooseCard(metaState, "Choose an event to upgrade:", __spreadArray8([], __read13(metaState.data.collectedEvents), false), true)];
              case 1:
                event = _a.sent();
                if (!event) {
                  return [2, { newData: data }];
                }
                chosenName = displayName(event);
                return [2, {
                  newData: { selectedIndex: index },
                  transform: function(state) {
                    return __awaiter10(_this2, void 0, void 0, function() {
                      var updated, events, eventIndex;
                      return __generator10(this, function(_a2) {
                        switch (_a2.label) {
                          case 0:
                            updated = upgradeCardSpec(event, upgrade);
                            events = __spreadArray8([], __read13(state.data.collectedEvents), false);
                            eventIndex = events.indexOf(event);
                            if (!(eventIndex >= 0)) return [3, 2];
                            events[eventIndex] = updated;
                            state.update({ collectedEvents: events });
                            return [4, addTimelineAction("Tactician: Upgraded ".concat(chosenName, " with ").concat(upgradeName))(state)];
                          case 1:
                            _a2.sent();
                            _a2.label = 2;
                          case 2:
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  }
                }];
            }
          });
        });
      };
      return [
        {
          label: "Brute Force",
          description: "Brute Force. Upgrade an event. The first four times you use that event each stage, use it again.",
          disabled: selectedIndex !== null || !hasEvents,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(tacticianStrengthUpgrade, 0, "Brute Force")];
              });
            });
          }
        },
        {
          label: "Finesse",
          description: "Finesse. Upgrade an event. The first two times you use it it costs @ less.",
          disabled: selectedIndex !== null || !hasEvents,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(tacticianAgilityUpgrade, 1, "Finesse")];
              });
            });
          }
        },
        {
          label: "Teamwork",
          description: "Teamwork. Upgrade an event. Every time you use that event, use another event that's cheaper or equal for free.",
          disabled: selectedIndex !== null || !hasEvents,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(tacticianCooperationUpgrade, 2, "Teamwork")];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(tactician);
  var potionShop = {
    name: "Potion Shop",
    createInitialData: function(_metaState, generator) {
      return {
        selectedIndex: null,
        offers: generator.samples(potionRewards, 3)
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      var _a = __read13(d.offers, 3), first = _a[0], second = _a[1], third = _a[2];
      var sellablePotions = metaState.data.potions.filter(function(potion) {
        return !isBurdened(potion.spec);
      });
      var bundleDetail = "Potion Shop bundle for 3@: with ".concat(displayName(second), " and ").concat(displayName(third));
      var bundleTooltipSpec = __assign9(__assign9({}, second), { relatedCards: __spreadArray8(__spreadArray8([], __read13(second.relatedCards || []), false), [third], false) });
      return [
        {
          label: "Take ".concat(displayName(first)),
          description: "Take this potion for free.",
          tooltipSpec: first,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, d), { selectedIndex: 0 }),
                  transform: gainPotion(first, { details: "Potion Shop: free sample" })
                }];
              });
            });
          }
        },
        {
          label: "Buy ".concat(displayName(second), " + ").concat(displayName(third)),
          description: "Lose 3@ buffer to buy both potions.",
          tooltipSpec: bundleTooltipSpec,
          disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, d), { selectedIndex: 1 }),
                  transform: compose(addBuffer(-3), gainPotion(second, { details: bundleDetail }), gainPotion(third, { details: bundleDetail }))
                }];
              });
            });
          }
        },
        {
          label: "Sell a potion",
          description: "Lose a potion and gain 4@ buffer.",
          disabled: d.selectedIndex !== null || sellablePotions.length === 0,
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var potion;
              var _this2 = this;
              return __generator10(this, function(_a2) {
                switch (_a2.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a potion to give up:", sellablePotions, true)];
                  case 1:
                    potion = _a2.sent();
                    if (!potion)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign9(__assign9({}, d), { selectedIndex: 2 }),
                      transform: compose(function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a3) {
                            state.removePotion(potion.id);
                            return [
                              2
                              /*return*/
                            ];
                          });
                        });
                      }, addBuffer(4), addTimelineAction("Potion Shop", "Gave up ".concat(displayName(potion.spec), " for 4@")))
                    }];
                }
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(potionShop);
  var potionLab = {
    name: "Potion Lab",
    createInitialData: function(_metaState, generator) {
      return {
        selectedIndex: null,
        offer: generator.sample(potionRewards)
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      var offerName = displayName(d.offer);
      return [
        {
          label: "Double batch",
          description: "Gain 2 copies of ".concat(offerName, "."),
          tooltipSpec: d.offer,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: __assign9(__assign9({}, d), { selectedIndex: 0 }),
                  transform: compose(addTimelineAction("Potion Lab: Double batch", "Gained two ".concat(offerName)), gainPotion(d.offer, { silent: true }), gainPotion(d.offer, { silent: true }))
                }];
              });
            });
          }
        },
        {
          label: "Duplication",
          description: "For each potion you have, gain a copy of that potion.",
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var copiedPotionNames, details;
              var _this2 = this;
              return __generator10(this, function(_a) {
                copiedPotionNames = metaState.data.potions.map(function(p) {
                  return displayName(p.spec);
                });
                details = copiedPotionNames.length > 0 ? "Copied: ".concat(copiedPotionNames.join(", ")) : "Copied: none";
                return [2, {
                  newData: __assign9(__assign9({}, d), { selectedIndex: 1 }),
                  transform: function(state) {
                    return __awaiter10(_this2, void 0, void 0, function() {
                      var potionSpecs, potionSpecs_1, potionSpecs_1_1, spec, e_1_1;
                      var e_1, _a2;
                      return __generator10(this, function(_b) {
                        switch (_b.label) {
                          case 0:
                            return [4, addTimelineAction("Potion Lab", details)(state)];
                          case 1:
                            _b.sent();
                            potionSpecs = state.data.potions.map(function(p) {
                              return p.spec;
                            });
                            _b.label = 2;
                          case 2:
                            _b.trys.push([2, 7, 8, 9]);
                            potionSpecs_1 = __values10(potionSpecs), potionSpecs_1_1 = potionSpecs_1.next();
                            _b.label = 3;
                          case 3:
                            if (!!potionSpecs_1_1.done) return [3, 6];
                            spec = potionSpecs_1_1.value;
                            return [4, gainPotion(spec, { silent: true })(state)];
                          case 4:
                            _b.sent();
                            _b.label = 5;
                          case 5:
                            potionSpecs_1_1 = potionSpecs_1.next();
                            return [3, 3];
                          case 6:
                            return [3, 9];
                          case 7:
                            e_1_1 = _b.sent();
                            e_1 = { error: e_1_1 };
                            return [3, 9];
                          case 8:
                            try {
                              if (potionSpecs_1_1 && !potionSpecs_1_1.done && (_a2 = potionSpecs_1.return)) _a2.call(potionSpecs_1);
                            } finally {
                              if (e_1) throw e_1.error;
                            }
                            return [
                              7
                              /*endfinally*/
                            ];
                          case 9:
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  }
                }];
              });
            });
          }
        },
        {
          label: "Sacred Bark",
          spec: sacredBark,
          disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: __assign9(__assign9({}, d), { selectedIndex: 2 }),
                  transform: gainRelic(sacredBark, { details: "Potion Lab" })
                }];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(potionLab);
  var varietyPack = {
    name: "Variety Pack",
    createInitialData: function(metaState, generator) {
      return {
        selectedIndex: null,
        offerCard: generator.sample(cardRewards),
        offerEvent: generator.sample(eventRewards),
        offerPotion: generator.sample(potionRewards),
        offerRelic: sampleEligibleRelicReward(generator, metaState)
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var _a = data, selectedIndex = _a.selectedIndex, offerCard = _a.offerCard, offerEvent = _a.offerEvent, offerPotion = _a.offerPotion, offerRelic = _a.offerRelic;
      var currentData = { selectedIndex, offerCard, offerEvent, offerPotion, offerRelic };
      var allOptionNames = [
        displayName(offerCard),
        displayName(offerEvent),
        displayName(offerPotion),
        displayName(offerRelic)
      ];
      return [
        {
          label: "Take Card",
          spec: offerCard,
          disabled: selectedIndex !== null,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, currentData), { selectedIndex: 0 }),
                  transform: gainCard(offerCard, { skipped: allOptionNames.filter(function(_, i) {
                    return i !== 0;
                  }) })
                }];
              });
            });
          }
        },
        {
          label: "Take Event",
          spec: offerEvent,
          disabled: selectedIndex !== null,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, currentData), { selectedIndex: 1 }),
                  transform: gainEvent(offerEvent, { skipped: allOptionNames.filter(function(_, i) {
                    return i !== 1;
                  }) })
                }];
              });
            });
          }
        },
        {
          label: "Take Potion",
          spec: offerPotion,
          disabled: selectedIndex !== null,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, currentData), { selectedIndex: 2 }),
                  transform: gainPotion(offerPotion, { skipped: allOptionNames.filter(function(_, i) {
                    return i !== 2;
                  }) })
                }];
              });
            });
          }
        },
        {
          label: "Take Relic",
          spec: offerRelic,
          disabled: selectedIndex !== null,
          checked: selectedIndex === 3,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign9(__assign9({}, currentData), { selectedIndex: 3 }),
                  transform: gainRelic(offerRelic, { skipped: allOptionNames.filter(function(_, i) {
                    return i !== 3;
                  }) })
                }];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(varietyPack);
  var tradingPost = {
    name: "Trading Post",
    createInitialData: function(metaState, generator) {
      return {
        offerCard: generator.sample(cardRewards),
        offerEvent: generator.sample(eventRewards),
        offerPotion: generator.sample(potionRewards),
        offerRelic: sampleEligibleRelicReward(generator, metaState),
        cardTraded: false,
        eventTraded: false,
        potionTraded: false,
        relicTraded: false
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      var tradableCards = metaState.data.collectedCards.filter(function(card) {
        return !isBurdened(card);
      });
      var tradableEvents = metaState.data.collectedEvents.filter(function(event) {
        return !isBurdened(event);
      });
      var tradablePotions = metaState.data.potions.filter(function(potion) {
        return !isBurdened(potion.spec);
      });
      var tradableRelics = metaState.data.relics.filter(function(relic) {
        return !isBurdened(relic.spec);
      });
      var offeredRelicIsBad = isBurdened(d.offerRelic);
      return [
        {
          label: "Trade Card for ".concat(displayName(d.offerCard)),
          description: "Give up one of your cards to receive this one.",
          tooltipSpec: d.offerCard,
          disabled: d.cardTraded || tradableCards.length === 0,
          checked: d.cardTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var card;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a card to trade away:", tradableCards, true)];
                  case 1:
                    card = _a.sent();
                    if (!card)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign9(__assign9({}, d), { cardTraded: true }),
                      transform: function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                state.removeCard(card.name);
                                return [4, gainCard(d.offerCard, {
                                  details: "Traded away ".concat(displayName(card))
                                })(state)];
                              case 1:
                                _a2.sent();
                                return [
                                  2
                                  /*return*/
                                ];
                            }
                          });
                        });
                      }
                    }];
                }
              });
            });
          }
        },
        {
          label: "Trade Event for ".concat(displayName(d.offerEvent)),
          description: "Give up one of your events to receive this one.",
          tooltipSpec: d.offerEvent,
          disabled: d.eventTraded || tradableEvents.length === 0,
          checked: d.eventTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var event;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose an event to trade away:", tradableEvents, true)];
                  case 1:
                    event = _a.sent();
                    if (!event)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign9(__assign9({}, d), { eventTraded: true }),
                      transform: function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                state.removeEvent(event.name);
                                return [4, gainEvent(d.offerEvent, {
                                  details: "Traded away ".concat(displayName(event))
                                })(state)];
                              case 1:
                                _a2.sent();
                                return [
                                  2
                                  /*return*/
                                ];
                            }
                          });
                        });
                      }
                    }];
                }
              });
            });
          }
        },
        {
          label: "Trade Potion for ".concat(displayName(d.offerPotion)),
          description: "Give up one of your potions to receive this one.",
          tooltipSpec: d.offerPotion,
          disabled: d.potionTraded || tradablePotions.length === 0,
          checked: d.potionTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var potion;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a potion to trade away:", tradablePotions, true)];
                  case 1:
                    potion = _a.sent();
                    if (!potion)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign9(__assign9({}, d), { potionTraded: true }),
                      transform: function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                state.removePotion(potion.id);
                                return [4, gainPotion(d.offerPotion, {
                                  details: "Traded away ".concat(displayName(potion.spec))
                                })(state)];
                              case 1:
                                _a2.sent();
                                return [
                                  2
                                  /*return*/
                                ];
                            }
                          });
                        });
                      }
                    }];
                }
              });
            });
          }
        },
        {
          label: "Trade Relic for ".concat(displayName(d.offerRelic)),
          description: "Give up one of your relics to receive this one.",
          tooltipSpec: d.offerRelic,
          disabled: d.relicTraded || tradableRelics.length === 0 || offeredRelicIsBad,
          checked: d.relicTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var relic;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    if (offeredRelicIsBad)
                      return [2, { newData: data }];
                    return [4, metaState.ui.chooseCard(metaState, "Choose a relic to trade away:", tradableRelics, true)];
                  case 1:
                    relic = _a.sent();
                    if (!relic)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign9(__assign9({}, d), { relicTraded: true }),
                      transform: function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                return [4, removeRelic(state, relic.id)];
                              case 1:
                                _a2.sent();
                                return [4, gainRelic(d.offerRelic, {
                                  details: "Traded away ".concat(displayName(relic.spec))
                                })(state)];
                              case 2:
                                _a2.sent();
                                return [
                                  2
                                  /*return*/
                                ];
                            }
                          });
                        });
                      }
                    }];
                }
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(tradingPost, { minStage: 4 });
  var cursedInkwell = {
    name: "Cursed Inkwell",
    burden: true,
    metaReplacers: [{
      kind: "gameSetup",
      text: ["Par is 1@ lower on each course."],
      replace: function(p) {
        return __assign9(__assign9({}, p), { par: p.par - 1 });
      }
    }]
  };
  registerRelicSpec(cursedInkwell);
  var theScribe = simpleEncounter({
    name: "The Scribe",
    options: [
      {
        label: "Take the Inkwell",
        description: "Par is 1@ higher on each course.",
        transform: gainRelic(inkwell)
      },
      {
        label: "Use the quill",
        description: "+3@ buffer.",
        transform: addBuffer(3)
      },
      {
        label: "Use the cursed quill",
        description: "+5@ buffer, but par is 1@ lower on each course.",
        transform: compose(addBuffer(5), gainRelic(cursedInkwell))
      }
    ]
  });
  registerEncounter(theScribe, { maxStage: 4 });
  var callYourShot = simpleEncounter({
    name: "Call your shot",
    options: [
      {
        label: "Go for it",
        description: "This stage, gain 1 buffer for each @ you beat par.",
        transform: gainRelic(calledShot)
      },
      {
        label: "Wait for it",
        description: "Get 1 additional reward next stage.",
        transform: gainRelic(delayedGratification)
      }
    ]
  });
  registerEncounter(callYourShot, { maxStage: 4 });

  // public/data/burdens.js
  var __assign10 = function() {
    __assign10 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign10.apply(this, arguments);
  };
  var __awaiter11 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator11 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __read14 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray9 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  var __values11 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function upgradeCardSpec2(spec, upgrade) {
    return __assign10(__assign10({}, spec), { upgrades: __spreadArray9(__spreadArray9([], __read14(spec.upgrades || []), false), [upgrade], false) });
  }
  var frozenRelic = {
    name: "Frozen Relic",
    burden: true,
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, put 3 charge tokens on it."],
      simpleText: ["This starts with 3 charge tokens on it."],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var tokens;
            return __generator11(this, function(_a) {
              if (!state.data.relics.some(function(r) {
                return r.id === self.id;
              }))
                return [
                  2
                  /*return*/
                ];
              tokens = new Map(self.tokens);
              tokens.set("charge", 3);
              state.applyToRelic(function(r) {
                return r.update({ tokens });
              }, self);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }, {
      kind: "start",
      text: ["At the start of each course, remove a charge token from this. Then if it has no charge tokens, destroy it and regain the frozen relic."],
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var current, nextCharge, tokens, thawed;
            var _a, _b;
            return __generator11(this, function(_c) {
              switch (_c.label) {
                case 0:
                  current = state.data.relics.find(function(r) {
                    return r.id === self.id;
                  });
                  if (!current)
                    return [
                      2
                      /*return*/
                    ];
                  nextCharge = Math.max(current.count("charge") - 1, 0);
                  tokens = new Map(current.tokens);
                  tokens.set("charge", nextCharge);
                  state.applyToRelic(function(r) {
                    return r.update({ tokens });
                  }, current);
                  if (nextCharge > 0)
                    return [
                      2
                      /*return*/
                    ];
                  thawed = (_b = (_a = current.notedCards) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
                  return [4, removeRelic(state, current.id)];
                case 1:
                  _c.sent();
                  if (!thawed) return [3, 3];
                  return [4, gainRelic(thawed, { details: "Thawed ".concat(displayName(thawed)) })(state)];
                case 2:
                  _c.sent();
                  _c.label = 3;
                case 3:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(frozenRelic);
  function makeFrozenRelicSpec(baseRelic) {
    return __assign10(__assign10({}, frozenRelic), { name: "Frozen ".concat(displayName(baseRelic)) });
  }
  var fakeCoin = {
    name: "Fake Coin",
    burden: true,
    triggers: [{
      kind: "beforeStart",
      text: ["At the start of the game, put a decay token on a Copper without any, or if all of your Coppers have a decay token remove all but one token from a Copper with the maximal number of decay tokens."],
      simpleText: ["One of your coppers starts with a decay token."],
      handles: function() {
        return true;
      },
      transform: function() {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var target;
            return __generator11(this, function(_a) {
              target = state.discard.filter(function(card) {
                return card.name === copper.name;
              }).reduce(function(best, card) {
                if (!best)
                  return card;
                if (card.count("decay") == 0)
                  return card;
                else if (card.count("decay") > best.count("decay"))
                  return card;
                return best;
              }, null);
              if (target != null) {
                return [2, setDecayTransform(target, 1)(state)];
              } else {
                return [2, state];
              }
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }],
    rules: [decayRule]
  };
  registerRelicSpec(fakeCoin);
  var miserlyTouch = {
    name: "Miserly Touch",
    burden: true,
    triggers: [{
      kind: "beforeStart",
      text: ["At the start of the game, put 3 decay tokens on each Copper in your discard without decay tokens or with more than 3 tokens."],
      simpleText: ["Your coppers start with 3 decay tokens."],
      handles: function() {
        return true;
      },
      transform: function() {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var _a, _b, target, e_1_1;
            var e_1, _c;
            return __generator11(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values11(state.discard.filter(function(card) {
                    return card.name === copper.name;
                  })), _b = _a.next();
                  _d.label = 1;
                case 1:
                  if (!!_b.done) return [3, 4];
                  target = _b.value;
                  return [4, setDecayTransform(target, 3)(state)];
                case 2:
                  state = _d.sent();
                  _d.label = 3;
                case 3:
                  _b = _a.next();
                  return [3, 1];
                case 4:
                  return [3, 7];
                case 5:
                  e_1_1 = _d.sent();
                  e_1 = { error: e_1_1 };
                  return [3, 7];
                case 6:
                  try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 7:
                  return [2, state];
              }
            });
          });
        };
      }
    }],
    rules: [decayRule]
  };
  registerRelicSpec(miserlyTouch);
  var heavyStone = {
    name: "Heavy Stone",
    burden: true,
    staticReplacers: [{
      kind: "resource",
      text: ["Whenever you would gain actions from ".concat(refresh.name, ", gain 1 less action.")],
      handles: function(params) {
        return params.resource === "actions" && params.amount > 0 && params.source instanceof Card && params.source.name === refresh.name;
      },
      replace: function(params) {
        return __assign10(__assign10({}, params), { amount: Math.max(0, params.amount - 1) });
      }
    }]
  };
  registerRelicSpec(heavyStone);
  var cursedHourglass = {
    name: "Leaking Inkwell",
    burden: true,
    metaReplacers: [{
      kind: "gameSetup",
      text: ["Each stage has par 1 lower."],
      simpleText: ["Your next 2 stages have par 1 lower."],
      replace: function(params, _state, self) {
        return __assign10(__assign10({}, params), { par: params.par - 1 });
      }
    }],
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, put 2 charge tokens on it."],
      simpleText: [],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var tokens;
            return __generator11(this, function(_a) {
              if (!state.data.relics.some(function(r) {
                return r.id === self.id;
              }))
                return [
                  2
                  /*return*/
                ];
              tokens = new Map(self.tokens);
              tokens.set("charge", 2);
              state.applyToRelic(function(r) {
                return r.update({ tokens });
              }, self);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }, {
      kind: "end",
      text: ["At the end of each stage remove a charge token from this. Then if it has no charge tokens, destroy it."],
      simpleText: [],
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var current, nextCharge, tokens;
            return __generator11(this, function(_a) {
              switch (_a.label) {
                case 0:
                  current = state.data.relics.find(function(r) {
                    return r.id === self.id;
                  });
                  if (!current)
                    return [
                      2
                      /*return*/
                    ];
                  nextCharge = Math.max(current.count("charge") - 1, 0);
                  tokens = new Map(current.tokens);
                  tokens.set("charge", nextCharge);
                  state.applyToRelic(function(r) {
                    return r.update({ tokens });
                  }, current);
                  if (!(nextCharge === 0)) return [3, 2];
                  return [4, removeRelic(state, current.id)];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(cursedHourglass);
  var cursedDoll = {
    name: "Cursed Doll",
    burden: true,
    metaReplacers: [{
      kind: "burden",
      simpleText: ["In the next burden you encounter, pick 2 of 3 options instead of 1 of 2."],
      text: ["In the next burden you encounter, pick 2 of 3 options instead of 1 of 2."],
      replace: function(params) {
        return __assign10(__assign10({}, params), { numOptions: params.numOptions + 1, numPicked: params.numPicked + 1 });
      }
    }],
    metaTriggers: [{
      kind: "burdenGeneration",
      text: [],
      simpleText: [],
      handles: function() {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            return __generator11(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, removeRelic(state, self.id)];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(cursedDoll);
  var cursedKey = {
    name: "Cursed Key",
    burden: true,
    metaReplacers: [{
      kind: "pathRewards",
      text: ["There is 1 less reward on the final stage."],
      replace: function(params, state) {
        return state.data.stage === TOTAL_STAGES - 1 ? __assign10(__assign10({}, params), { rewardsPerPath: Math.max(0, params.rewardsPerPath - 1) }) : params;
      }
    }, {
      kind: "extraOptions",
      text: ["You can skip any reward to destroy this."],
      replace: function(params) {
        return __assign10(__assign10({}, params), { options: params.options.concat(["destroyCursedKey"]) });
      }
    }]
  };
  registerRelicSpec(cursedKey);
  var cursedBoots = {
    name: "Cursed Boots",
    burden: true,
    metaReplacers: [{
      kind: "pathRewards",
      text: [
        "Remove the first path option.",
        'If this has a charge token, add a path option "Use Cursed Boots."'
      ],
      simpleText: ["Remove first path; if charged, add Use Cursed Boots."],
      replace: function(params, _state, self) {
        var paths = params.paths.slice(1);
        if (self.count("charge") > 0) {
          paths.push({
            label: "Use Cursed Boots",
            onSelectEffects: [{ kind: "spendRelicCharge", relicID: self.id, amount: 1 }]
          });
        }
        return __assign10(__assign10({}, params), { paths });
      }
    }],
    metaTriggers: [{
      kind: "relic",
      text: ["When you gain this, put a charge token on it."],
      simpleText: ["This starts with a charge token."],
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            var tokens;
            return __generator11(this, function(_a) {
              if (!state.data.relics.some(function(r) {
                return r.id === self.id;
              }))
                return [
                  2
                  /*return*/
                ];
              tokens = new Map(self.tokens);
              tokens.set("charge", 1);
              state.applyToRelic(function(r) {
                return r.update({ tokens });
              }, self);
              return [
                2
                /*return*/
              ];
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(cursedBoots);
  var cursedBanner = {
    name: "Cursed Hourglass",
    burden: true,
    metaReplacers: [{
      kind: "gameSetup",
      text: ["Par is 3 lower on the final stage."],
      replace: function(params, state) {
        return state.data.stage === TOTAL_STAGES - 1 ? __assign10(__assign10({}, params), { par: params.par - 3 }) : params;
      }
    }],
    metaTriggers: [{
      kind: "end",
      text: ["Whenever you beat par by 3 or more, destroy this."],
      handles: function(e) {
        return e.score <= e.par - 3;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter11(this, void 0, void 0, function() {
            return __generator11(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, removeRelic(state, self.id)];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
      }
    }]
  };
  registerRelicSpec(cursedBanner);
  var cursedSozu = {
    name: "Sozu",
    burden: true,
    metaReplacers: [{
      kind: "reward",
      text: ["Whenever you pick a potion reward, lose 1 buffer."],
      simpleText: ["Potion reward options: lose 1 buffer."],
      replace: function(params) {
        var _a;
        if (params.rewardKind !== "potion")
          return params;
        var pickBufferAdjustments = __spreadArray9([], __read14(params.pickBufferAdjustments), false);
        for (var i = 0; i < params.optionCount; i++) {
          pickBufferAdjustments[i] = ((_a = pickBufferAdjustments[i]) !== null && _a !== void 0 ? _a : 0) - 1;
        }
        return __assign10(__assign10({}, params), { pickBufferAdjustments });
      }
    }]
  };
  registerRelicSpec(cursedSozu);
  var expensiveFlask = {
    name: "Expensive Flask",
    burden: true,
    staticReplacers: [{
      kind: "cost",
      text: ["Potions cost $1 more to drink."],
      handles: function(params) {
        return params.card.spec.isPotion === true && (params.actionKind === "potion" || params.actionKind === "use");
      },
      replace: function(params) {
        return __assign10(__assign10({}, params), { cost: addCosts(params.cost, coin(1)) });
      }
    }]
  };
  registerRelicSpec(expensiveFlask);
  var brokenCrown = {
    name: "Broken Crown",
    burden: true,
    metaReplacers: [{
      kind: "reward",
      text: ["When you pick the third option from a reward pack, lose 1 buffer."],
      replace: function(params) {
        var _a;
        var pickBufferAdjustments = __spreadArray9([], __read14(params.pickBufferAdjustments), false);
        pickBufferAdjustments[2] = ((_a = pickBufferAdjustments[2]) !== null && _a !== void 0 ? _a : 0) - 1;
        return __assign10(__assign10({}, params), { pickBufferAdjustments });
      }
    }]
  };
  registerRelicSpec(brokenCrown);
  var taxCardUpgrade = {
    id: "burden_tax_card",
    burden: true,
    name: function(name) {
      return "".concat(name, "\u2212");
    },
    cost: function(cost, kind) {
      return kind === "buy" ? __assign10(__assign10({}, cost), { coin: cost.coin + 2 }) : cost;
    }
  };
  registerEncounterUpgrade("burden_tax_card", taxCardUpgrade);
  function setDecayTransform(card, numTokens) {
    return function(state) {
      return __awaiter11(this, void 0, void 0, function() {
        var currentCount;
        return __generator11(this, function(_a) {
          switch (_a.label) {
            case 0:
              currentCount = card.count("decay");
              if (currentCount < numTokens && currentCount > 0)
                return [2, state];
              return [4, addToken(card, "decay", numTokens - currentCount)(state)];
            case 1:
              state = _a.sent();
              return [2, state];
          }
        });
      });
    };
  }
  function setDecayReplacer(numTokens) {
    return function(params) {
      var tokens = new Map(params.tokens || []);
      if (!tokens.has("decay") || tokens.get("decay") > numTokens) {
        tokens.set("decay", numTokens);
      }
      return __assign10(__assign10({}, params), { tokens });
    };
  }
  var decayCardUpgrade = {
    id: "burden_decay_card",
    burden: true,
    name: function(name) {
      return "".concat(name, "-");
    },
    rules: [decayRule],
    staticReplacers: [{
      kind: "create",
      text: ["When you create this, if it has no decay tokens put 2 on it. If it has more than 2 decay tokens, remove all but 2."],
      simpleText: ["This is created with 2 decay tokens on it."],
      handles: function(params, s, source) {
        return params.zone === "discard" && params.spec.name === source.name;
      },
      replace: setDecayReplacer(2)
    }]
  };
  registerEncounterUpgrade("burden_decay_card", decayCardUpgrade);
  var dullCardUpgrade = {
    id: "burden_dull_card",
    burden: true,
    name: function(name) {
      return "".concat(name, "-");
    },
    cost: function(cost, kind) {
      return kind === "play" ? __assign10(__assign10({}, cost), { coin: cost.coin + 1 }) : cost;
    }
  };
  registerEncounterUpgrade("burden_dull_card", dullCardUpgrade);
  var taxEventUpgrade = {
    id: "burden_tax_event",
    burden: true,
    name: function(name) {
      return "".concat(name, "-");
    },
    cost: function(cost, kind) {
      return kind === "use" ? __assign10(__assign10({}, cost), { coin: cost.coin + 2 }) : cost;
    }
  };
  registerEncounterUpgrade("burden_tax_event", taxEventUpgrade);
  function relicBurdenOption(spec, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    var id = spec.name;
    registerBurden(__assign10(__assign10({ id, title: displayName(spec) }, options), { applies: function(state) {
      return !state.data.relics.some(function(relic) {
        return relic.spec.name === spec.name;
      });
    }, createOption: function() {
      return {
        id,
        title: displayName(spec),
        spec,
        data: null
      };
    }, resolveTransform: function(_option, _state, skipped) {
      return __awaiter11(_this, void 0, void 0, function() {
        return __generator11(this, function(_a) {
          return [2, gainRelic(spec, { skipped })];
        });
      });
    } }));
  }
  relicBurdenOption(fakeCoin);
  relicBurdenOption(miserlyTouch);
  relicBurdenOption(heavyStone);
  relicBurdenOption(cursedHourglass, { maxStage: TOTAL_STAGES - 2 });
  relicBurdenOption(cursedDoll, { maxStage: TOTAL_STAGES - 3 });
  relicBurdenOption(cursedKey, { maxStage: TOTAL_STAGES - 2 });
  relicBurdenOption(cursedBoots, { maxStage: TOTAL_STAGES - 3 });
  relicBurdenOption(cursedBanner);
  relicBurdenOption(cursedSozu, { maxStage: TOTAL_STAGES - 2 });
  relicBurdenOption(expensiveFlask);
  relicBurdenOption(brokenCrown, { maxStage: TOTAL_STAGES - 2 });
  registerBurden({
    id: "lose_anything",
    title: "Forsake",
    description: "Give up a card, event, potion, or relic.",
    weight: 3,
    applies: function(state) {
      return state.data.collectedCards.some(function(card) {
        return !isBurdened(card);
      }) || state.data.collectedEvents.some(function(event) {
        return !isBurdened(event);
      }) || state.data.potions.some(function(potion) {
        return !isBurdened(potion.spec);
      }) || state.data.relics.some(function(relic) {
        return !isBurdened(relic.spec);
      });
    },
    resolveTransform: function(_option, state, skipped) {
      return __awaiter11(void 0, void 0, void 0, function() {
        var cardOptions, eventOptions, potionOptions, relicOptions, options, picked, chosenName_1, chosenName_2, chosenName_3, chosenName;
        return __generator11(this, function(_a) {
          switch (_a.label) {
            case 0:
              cardOptions = state.data.collectedCards.filter(function(card) {
                return !isBurdened(card);
              });
              eventOptions = state.data.collectedEvents.filter(function(event) {
                return !isBurdened(event);
              });
              potionOptions = state.data.potions.filter(function(potion) {
                return !isBurdened(potion.spec);
              });
              relicOptions = state.data.relics.filter(function(candidate) {
                return !isBurdened(candidate.spec);
              });
              options = __spreadArray9(__spreadArray9(__spreadArray9(__spreadArray9([], __read14(cardOptions), false), __read14(eventOptions), false), __read14(potionOptions), false), __read14(relicOptions), false);
              if (options.length === 0)
                return [2, null];
              return [4, state.ui.chooseCard(state, "Choose what to give up:", options, true)];
            case 1:
              picked = _a.sent();
              if (!picked)
                return [2, null];
              if (picked instanceof Relic) {
                chosenName_1 = displayName(picked.spec);
                return [2, function(innerState) {
                  return __awaiter11(this, void 0, void 0, function() {
                    return __generator11(this, function(_a2) {
                      switch (_a2.label) {
                        case 0:
                          return [4, removeRelic(innerState, picked.id)];
                        case 1:
                          _a2.sent();
                          return [4, addTimelineAction("Burden: Lost a relic", chosenName_1, skipped)(innerState)];
                        case 2:
                          _a2.sent();
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }];
              }
              if (picked instanceof Card) {
                chosenName_2 = displayName(picked.spec);
                return [2, function(innerState) {
                  return __awaiter11(this, void 0, void 0, function() {
                    return __generator11(this, function(_a2) {
                      switch (_a2.label) {
                        case 0:
                          innerState.removePotion(picked.id);
                          return [4, addTimelineAction("Burden: Lost a potion", chosenName_2, skipped)(innerState)];
                        case 1:
                          _a2.sent();
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }];
              }
              if (eventOptions.includes(picked)) {
                chosenName_3 = displayName(picked);
                return [2, function(innerState) {
                  return __awaiter11(this, void 0, void 0, function() {
                    return __generator11(this, function(_a2) {
                      switch (_a2.label) {
                        case 0:
                          innerState.removeEvent(picked.name);
                          return [4, addTimelineAction("Burden: Lost an event", chosenName_3, skipped)(innerState)];
                        case 1:
                          _a2.sent();
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }];
              }
              chosenName = displayName(picked);
              return [2, function(innerState) {
                return __awaiter11(this, void 0, void 0, function() {
                  return __generator11(this, function(_a2) {
                    switch (_a2.label) {
                      case 0:
                        innerState.removeCard(picked.name);
                        return [4, addTimelineAction("Burden: Lost a card", chosenName, skipped)(innerState)];
                      case 1:
                        _a2.sent();
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }];
          }
        });
      });
    }
  });
  registerBurden({
    id: "lose_buffer",
    title: "Falter",
    description: "Lose 1 buffer.",
    weight: 2,
    applies: function(state) {
      return state.data.buffer > 0;
    },
    resolveTransform: function(_option, _state, skipped) {
      return __awaiter11(void 0, void 0, void 0, function() {
        return __generator11(this, function(_a) {
          return [2, function(state) {
            return __awaiter11(this, void 0, void 0, function() {
              return __generator11(this, function(_a2) {
                switch (_a2.label) {
                  case 0:
                    return [4, addBuffer(-1)(state)];
                  case 1:
                    _a2.sent();
                    return [4, addTimelineAction("Burden: Lost 1 buffer", void 0, skipped)(state)];
                  case 2:
                    _a2.sent();
                    return [
                      2
                      /*return*/
                    ];
                }
              });
            });
          }];
        });
      });
    }
  });
  registerBurden({
    id: "lose_potion_brew",
    title: "Trade a potion",
    description: "Give up a potion and gain ".concat(beggarsBrew.name, "."),
    applies: function(state) {
      return state.data.potions.some(function(potion) {
        return !isBurdened(potion.spec);
      });
    },
    resolveTransform: function(_option, state, skipped) {
      return __awaiter11(void 0, void 0, void 0, function() {
        var validPotions, picked, chosenName;
        return __generator11(this, function(_a) {
          switch (_a.label) {
            case 0:
              validPotions = state.data.potions.filter(function(potion) {
                return !isBurdened(potion.spec);
              });
              return [4, state.ui.chooseCard(state, "Choose a potion to give up:", validPotions, true)];
            case 1:
              picked = _a.sent();
              if (!picked)
                return [2, null];
              chosenName = displayName(picked.spec);
              return [2, function(innerState) {
                return __awaiter11(this, void 0, void 0, function() {
                  return __generator11(this, function(_a2) {
                    switch (_a2.label) {
                      case 0:
                        innerState.removePotion(picked.id);
                        return [4, gainPotion(beggarsBrew, { details: "Gave up ".concat(chosenName), skipped })(innerState)];
                      case 1:
                        _a2.sent();
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }];
          }
        });
      });
    }
  });
  registerBurden({
    id: "freeze_relic",
    title: "Freeze a relic",
    description: "Freeze a relic for the next 2 stages.",
    maxStage: 5,
    applies: function(state) {
      return state.data.relics.some(function(relic) {
        return !isBurdened(relic.spec);
      });
    },
    resolveTransform: function(_option, state, skipped) {
      return __awaiter11(void 0, void 0, void 0, function() {
        var options, picked, chosenName, frozenSpec;
        return __generator11(this, function(_a) {
          switch (_a.label) {
            case 0:
              options = state.data.relics.filter(function(relic) {
                return !isBurdened(relic.spec);
              });
              if (options.length === 0)
                return [2, null];
              return [4, state.ui.chooseCard(state, "Choose a relic to freeze:", options, true)];
            case 1:
              picked = _a.sent();
              if (!picked)
                return [2, null];
              chosenName = displayName(picked.spec);
              frozenSpec = makeFrozenRelicSpec(picked.spec);
              return [2, function(innerState) {
                return __awaiter11(this, void 0, void 0, function() {
                  return __generator11(this, function(_a2) {
                    switch (_a2.label) {
                      case 0:
                        return [4, removeRelic(innerState, picked.id)];
                      case 1:
                        _a2.sent();
                        return [4, gainNotedRelic(frozenSpec, [picked.spec], { silent: true })(innerState)];
                      case 2:
                        _a2.sent();
                        return [4, addTimelineAction("Froze ".concat(chosenName), void 0, skipped)(innerState)];
                      case 3:
                        _a2.sent();
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }];
          }
        });
      });
    }
  });
  function registerDowngradeBurden(options) {
    var _this = this;
    registerBurden({
      id: options.id,
      title: options.title,
      description: options.description,
      rules: options.rules,
      applies: function(state) {
        return state.data[options.collection].some(function(spec) {
          return !isBurdened(spec);
        });
      },
      resolveTransform: function(_option, state, skipped) {
        return __awaiter11(_this, void 0, void 0, function() {
          var valid, picked, chosenName;
          return __generator11(this, function(_a) {
            switch (_a.label) {
              case 0:
                valid = state.data[options.collection].filter(function(spec) {
                  return !isBurdened(spec);
                });
                return [4, state.ui.chooseCard(state, options.prompt, valid, true)];
              case 1:
                picked = _a.sent();
                if (!picked)
                  return [2, null];
                chosenName = displayName(picked);
                return [2, function(innerState) {
                  return __awaiter11(this, void 0, void 0, function() {
                    var items, index;
                    var _a2;
                    return __generator11(this, function(_b) {
                      switch (_b.label) {
                        case 0:
                          items = __spreadArray9([], __read14(innerState.data[options.collection]), false);
                          index = items.indexOf(picked);
                          if (!(index >= 0)) return [3, 2];
                          items[index] = upgradeCardSpec2(items[index], options.upgrade);
                          innerState.update((_a2 = {}, _a2[options.collection] = items, _a2));
                          return [4, addTimelineAction(options.timelineLabel, chosenName, skipped)(innerState)];
                        case 1:
                          _b.sent();
                          _b.label = 2;
                        case 2:
                          return [
                            2
                            /*return*/
                          ];
                      }
                    });
                  });
                }];
            }
          });
        });
      }
    });
  }
  registerDowngradeBurden({
    id: "tax_card",
    title: "Tax a card",
    description: "Choose a card. It costs $2 more to buy.",
    upgrade: taxCardUpgrade,
    collection: "collectedCards",
    prompt: "Choose a card to tax:",
    timelineLabel: "Burden: Taxed a card"
  });
  registerDowngradeBurden({
    id: "decay_card",
    title: "Weaken a card",
    description: "Choose a card. Whenever that card is created, put 2 decay tokens on it.",
    upgrade: decayCardUpgrade,
    collection: "collectedCards",
    prompt: "Choose a card to decay:",
    timelineLabel: "Burden: Decayed a card",
    rules: [decayRule]
  });
  registerDowngradeBurden({
    id: "dull_card",
    title: "Dull a card",
    description: "Choose a card. It costs $1 more to play.",
    upgrade: dullCardUpgrade,
    collection: "collectedCards",
    prompt: "Choose a card to dull:",
    timelineLabel: "Burden: Dulled a card"
  });
  registerDowngradeBurden({
    id: "tax_event",
    title: "Tax an event",
    description: "Choose an event. It costs $2 more to use.",
    upgrade: taxEventUpgrade,
    collection: "collectedEvents",
    prompt: "Choose an event to tax:",
    timelineLabel: "Burden: Taxed an event"
  });

  // public/data/extraOptions.js
  var __awaiter12 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator12 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values12 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function rewardOptionNames(rewardState) {
    return rewardState.options.map(function(option) {
      return displayName(option);
    });
  }
  registerExtraOption({
    id: "singingBowl",
    selectionMarker: -4,
    render: function(rewardState) {
      var skipped = rewardOptionNames(rewardState);
      var details = skipped.length > 0 ? "Skipped: ".concat(skipped.join(", ")) : void 0;
      return {
        label: "+2 Buffer",
        compact: true,
        transform: function(state) {
          return __awaiter12(void 0, void 0, void 0, function() {
            return __generator12(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, addTimelineAction("Gain 2 buffer", details)(state)];
                case 1:
                  _a.sent();
                  return [4, addBuffer(2)(state)];
                case 2:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        }
      };
    }
  });
  registerExtraOption({
    id: "takeItAll",
    selectionMarker: -2,
    render: function(rewardState) {
      var taken = rewardOptionNames(rewardState);
      var details = taken.length > 0 ? "Taken: ".concat(taken.join(", ")) : void 0;
      return {
        label: "Take it all",
        compact: true,
        transform: function(state) {
          return __awaiter12(void 0, void 0, void 0, function() {
            var piggyBank2, _a, _b, option, e_1_1;
            var e_1, _c;
            return __generator12(this, function(_d) {
              switch (_d.label) {
                case 0:
                  piggyBank2 = state.data.relics.find(function(relic) {
                    return relic.name === "Piggy Bank";
                  });
                  if (!piggyBank2) return [3, 2];
                  return [4, removeRelic(state, piggyBank2.id)];
                case 1:
                  _d.sent();
                  _d.label = 2;
                case 2:
                  return [4, addTimelineAction("Take it all", details)(state)];
                case 3:
                  _d.sent();
                  _d.label = 4;
                case 4:
                  _d.trys.push([4, 15, 16, 17]);
                  _a = __values12(rewardState.options), _b = _a.next();
                  _d.label = 5;
                case 5:
                  if (!!_b.done) return [3, 14];
                  option = _b.value;
                  if (!(rewardState.kind === "card")) return [3, 7];
                  return [4, gainCard(option, { silent: true })(state)];
                case 6:
                  _d.sent();
                  return [3, 13];
                case 7:
                  if (!(rewardState.kind === "event")) return [3, 9];
                  return [4, gainEvent(option, { silent: true })(state)];
                case 8:
                  _d.sent();
                  return [3, 13];
                case 9:
                  if (!(rewardState.kind === "potion")) return [3, 11];
                  return [4, gainPotion(option, { silent: true })(state)];
                case 10:
                  _d.sent();
                  return [3, 13];
                case 11:
                  return [4, gainRelic(option, { silent: true })(state)];
                case 12:
                  _d.sent();
                  _d.label = 13;
                case 13:
                  _b = _a.next();
                  return [3, 5];
                case 14:
                  return [3, 17];
                case 15:
                  e_1_1 = _d.sent();
                  e_1 = { error: e_1_1 };
                  return [3, 17];
                case 16:
                  try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                  } finally {
                    if (e_1) throw e_1.error;
                  }
                  return [
                    7
                    /*endfinally*/
                  ];
                case 17:
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        }
      };
    }
  });
  registerExtraOption({
    id: "destroyCursedKey",
    selectionMarker: -3,
    render: function(rewardState) {
      var skipped = rewardOptionNames(rewardState);
      var details = skipped.length > 0 ? "Skipped: ".concat(skipped.join(", ")) : void 0;
      return {
        label: "Destroy Cursed Key",
        compact: true,
        transform: function(state) {
          return __awaiter12(void 0, void 0, void 0, function() {
            var cursedKey2;
            return __generator12(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cursedKey2 = state.data.relics.find(function(relic) {
                    return relic.name === "Cursed Key";
                  });
                  if (!cursedKey2) return [3, 2];
                  return [4, removeRelic(state, cursedKey2.id)];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  return [4, addTimelineAction("Destroy Cursed Key", details)(state)];
                case 3:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        }
      };
    }
  });

  // public/gameUI.js
  var __extends3 = /* @__PURE__ */ (function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  })();
  var __assign11 = function() {
    __assign11 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign11.apply(this, arguments);
  };
  var __awaiter13 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator13 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values13 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read15 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray10 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  function getElement(id) {
    return document.getElementById(id);
  }
  function querySelector(selector) {
    return document.querySelector(selector);
  }
  function querySelectorAll(selector) {
    return document.querySelectorAll(selector);
  }
  function clearElement(el) {
    el.innerHTML = "";
  }
  function createElementFromHTML(html) {
    var template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  var clearMacroDeleteMenuHandlers = null;
  var activeMacroDeleteMenu = null;
  function closeMacroDeleteMenu() {
    if (activeMacroDeleteMenu !== null) {
      activeMacroDeleteMenu.remove();
      activeMacroDeleteMenu = null;
    }
    if (clearMacroDeleteMenuHandlers !== null) {
      clearMacroDeleteMenuHandlers();
      clearMacroDeleteMenuHandlers = null;
    }
  }
  function openMacroDeleteMenu(anchor, onDelete) {
    closeMacroDeleteMenu();
    var menu = document.createElement("div");
    menu.className = "macroDeleteMenuOverlay";
    var deleteButton = document.createElement("button");
    deleteButton.className = "macroDeleteButton";
    deleteButton.textContent = "Delete macro";
    deleteButton.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeMacroDeleteMenu();
      onDelete();
    };
    menu.appendChild(deleteButton);
    document.body.appendChild(menu);
    var anchorRect = anchor.getBoundingClientRect();
    var menuRect = menu.getBoundingClientRect();
    var left = anchorRect.left;
    if (left + menuRect.width + 8 > window.innerWidth) {
      left = window.innerWidth - menuRect.width - 8;
    }
    left = Math.max(8, left);
    var top = anchorRect.bottom + 6;
    if (top + menuRect.height + 8 > window.innerHeight) {
      top = Math.max(8, anchorRect.top - menuRect.height - 6);
    }
    menu.style.left = "".concat(left, "px");
    menu.style.top = "".concat(top, "px");
    activeMacroDeleteMenu = menu;
    var onMouseDown = function(e) {
      if (!menu.contains(e.target))
        closeMacroDeleteMenu();
    };
    var onKeyDown = function(e) {
      if (e.key === "Escape")
        closeMacroDeleteMenu();
    };
    var onViewportChange = function() {
      return closeMacroDeleteMenu();
    };
    document.addEventListener("mousedown", onMouseDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("resize", onViewportChange, true);
    window.addEventListener("scroll", onViewportChange, true);
    clearMacroDeleteMenuHandlers = function() {
      document.removeEventListener("mousedown", onMouseDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("resize", onViewportChange, true);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }
  var zoneNames = ["play", "supply", "events", "hand", "discard", "potions", "relics"];
  var keyListeners = /* @__PURE__ */ new Map();
  var potionHotkeys = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
  var symbolHotkeys = ["!", "%", "^", "&", "*", "(", ")", "-", "+", "=", "{", "}", "[", "]"];
  var lowerHotkeys = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y"
  ];
  var upperHotkeys = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y"
  ];
  var numHotkeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var supplyAndPlayHotkeys = numHotkeys.concat(symbolHotkeys).concat(upperHotkeys);
  var handHotkeys = lowerHotkeys.concat(upperHotkeys);
  var hotkeys = potionHotkeys.concat(supplyAndPlayHotkeys).concat(handHotkeys);
  var hotkeysInitialized = false;
  function initHotkeys() {
    if (hotkeysInitialized)
      return;
    hotkeysInitialized = true;
    window.addEventListener("keydown", function(e) {
      if (e.altKey || e.ctrlKey || e.metaKey)
        return;
      var listener = keyListeners.get(e.key);
      if (listener) {
        e.preventDefault();
        listener();
      }
      if (e.key === " ") {
        e.preventDefault();
      }
      if (e.key === "Shift") {
        document.body.classList.add("shift-held");
      }
    });
    window.addEventListener("keyup", function(e) {
      if (e.key === "Shift") {
        document.body.classList.remove("shift-held");
      }
    });
  }
  function assertNever2(x) {
    throw new Error("Unexpected: ".concat(x));
  }
  function renderHotkey(hotkey) {
    if (hotkey === " ")
      hotkey = "&#x23B5;";
    return '<div class="hotkey">'.concat(hotkey, "</div> ");
  }
  function interpretHint(hint) {
    if (!hint)
      return void 0;
    switch (hint.kind) {
      case "number":
        var candidates = numHotkeys.concat(lowerHotkeys).concat(upperHotkeys);
        return hint.val < candidates.length ? candidates[hint.val] : void 0;
      case "none":
        return " ";
      case "boolean":
        return hint.val ? "y" : "n";
      case "key":
        return hint.val;
      default:
        return assertNever2(hint);
    }
  }
  function renderKey(x) {
    switch (x.kind) {
      case "card":
        return x.card.id;
      case "string":
        return x.string;
      default:
        return assertNever2(x);
    }
  }
  function getIfDef(m, x) {
    return m === null || m === void 0 ? void 0 : m.get(x);
  }
  function repeat2(xs, n) {
    return Array(n).fill(xs).flat(1);
  }
  function cloneMacroCardSnapshot(card) {
    return {
      name: card.name,
      displayName: card.displayName,
      place: card.place,
      tokens: new Map(card.tokens)
    };
  }
  function macroCardSnapshotFromCard(card) {
    return {
      name: card.name,
      displayName: displayName(card.spec),
      place: card.place,
      tokens: new Map(card.tokens)
    };
  }
  function cloneMacroStep(step) {
    if (step.kind === "string") {
      return __assign11({}, step);
    }
    return {
      kind: "card",
      card: cloneMacroCardSnapshot(step.card),
      chosen: step.chosen,
      verb: step.verb
    };
  }
  function cloneMacro(macro) {
    return {
      steps: macro.steps.map(cloneMacroStep),
      requirements: {
        coin: macro.requirements.coin,
        actions: macro.requirements.actions,
        buys: macro.requirements.buys,
        hand: new Map(macro.requirements.hand),
        discard: new Map(macro.requirements.discard)
      },
      startPrompt: macro.startPrompt,
      displayLabelMain: macro.displayLabelMain,
      displayLabelMeta: macro.displayLabelMeta,
      resetFirst: macro.resetFirst === true,
      stageFilter: macro.stageFilter
    };
  }
  function cloneMacros(macros) {
    return macros.map(cloneMacro);
  }
  function loadMacros(raw) {
    if (!Array.isArray(raw))
      return [];
    return cloneMacros(raw);
  }
  function emptyMacroRequirements() {
    return {
      coin: 0,
      actions: 0,
      buys: 0,
      hand: /* @__PURE__ */ new Map(),
      discard: /* @__PURE__ */ new Map()
    };
  }
  function cardCountsByName(cards) {
    var e_1, _a;
    var counts = /* @__PURE__ */ new Map();
    try {
      for (var cards_1 = __values13(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
        var card = cards_1_1.value;
        counts.set(card.name, (counts.get(card.name) || 0) + 1);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return counts;
  }
  function noteDecrease(target, start, current) {
    var e_2, _a;
    var names = new Set(__spreadArray10(__spreadArray10([], __read15(start.keys()), false), __read15(current.keys()), false));
    try {
      for (var names_1 = __values13(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
        var name_1 = names_1_1.value;
        var decrease = (start.get(name_1) || 0) - (current.get(name_1) || 0);
        if (decrease > 0) {
          target.set(name_1, Math.max(target.get(name_1) || 0, decrease));
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  }
  function isRefreshStep(step) {
    return step.kind === "card" && step.verb === "Use" && step.card.name === refresh.name;
  }
  function computeMacroRequirements(states, steps) {
    var requirements = emptyMacroRequirements();
    if (states.length === 0)
      return requirements;
    var startState2 = states[0];
    var startHandCounts = cardCountsByName(startState2.hand);
    var startDiscardCounts = cardCountsByName(startState2.discard);
    var hasEmptiedDiscard = false;
    var discardNonempty = false;
    for (var i = 0; i < states.length; i++) {
      if (i > 0 && i - 1 < steps.length && isRefreshStep(steps[i - 1])) {
        return requirements;
      }
      var state = states[i];
      var nowEmpty = state.discard.length === 0;
      hasEmptiedDiscard = hasEmptiedDiscard || nowEmpty && discardNonempty;
      discardNonempty = !nowEmpty;
      requirements.coin = Math.max(requirements.coin, startState2.coin - state.coin);
      requirements.actions = Math.max(requirements.actions, startState2.actions - state.actions);
      requirements.buys = Math.max(requirements.buys, startState2.buys - state.buys);
      if (!hasEmptiedDiscard) {
        noteDecrease(requirements.hand, startHandCounts, cardCountsByName(state.hand));
        noteDecrease(requirements.discard, startDiscardCounts, cardCountsByName(state.discard));
      }
    }
    return requirements;
  }
  function hasRequiredCounts(required, current) {
    var e_3, _a;
    try {
      for (var required_1 = __values13(required), required_1_1 = required_1.next(); !required_1_1.done; required_1_1 = required_1.next()) {
        var _b = __read15(required_1_1.value, 2), name_2 = _b[0], minimum = _b[1];
        if ((current.get(name_2) || 0) < minimum)
          return false;
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (required_1_1 && !required_1_1.done && (_a = required_1.return)) _a.call(required_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    return true;
  }
  function canPlayMacro(macro, state, choiceState) {
    if (macro.resetFirst === true) {
      return choiceState !== null && macro.steps.length > 0;
    }
    if (state.coin < macro.requirements.coin)
      return false;
    if (state.actions < macro.requirements.actions)
      return false;
    if (state.buys < macro.requirements.buys)
      return false;
    if (!hasRequiredCounts(macro.requirements.hand, cardCountsByName(state.hand)))
      return false;
    if (!hasRequiredCounts(macro.requirements.discard, cardCountsByName(state.discard)))
      return false;
    if (choiceState === null)
      return false;
    if (macro.startPrompt !== choiceState.choicePrompt)
      return false;
    var firstStep = macro.steps[0];
    if (firstStep === void 0)
      return false;
    if (matchMacro(firstStep, choiceState.state, choiceState.options, choiceState.chosen) === null)
      return false;
    return true;
  }
  function macroStepVerb(step) {
    return step.verb;
  }
  function macroStepLabel(step) {
    var _a;
    if (step.kind === "string")
      return step.string;
    return (_a = step.card.displayName) !== null && _a !== void 0 ? _a : step.card.name;
  }
  function renderMacroTooltip(macro) {
    if (macro.steps.length === 0)
      return "<div>No actions recorded.</div>";
    return macro.steps.map(function(step) {
      return "<div>".concat(macroStepVerb(step), " ").concat(macroStepLabel(step), "</div>");
    }).join("");
  }
  var ReplayMacroCaptureComplete = (
    /** @class */
    (function(_super) {
      __extends3(ReplayMacroCaptureComplete2, _super);
      function ReplayMacroCaptureComplete2() {
        var _this = _super.call(this, "ReplayMacroCaptureComplete") || this;
        Object.setPrototypeOf(_this, ReplayMacroCaptureComplete2.prototype);
        return _this;
      }
      return ReplayMacroCaptureComplete2;
    })(Error)
  );
  function buildReplayMacroFromState(targetState) {
    return __awaiter13(this, void 0, void 0, function() {
      var history, steps, recordingStates, startPrompt, cursor, captureUI, error_1;
      return __generator13(this, function(_a) {
        switch (_a.label) {
          case 0:
            history = __spreadArray10([], __read15(targetState.origin().future), false);
            if (history.length === 0)
              return [2, null];
            steps = [];
            recordingStates = [];
            startPrompt = null;
            cursor = 0;
            captureUI = {
              choice: function(state, prompt, options, info, chosen) {
                return __awaiter13(this, void 0, void 0, function() {
                  var index;
                  return __generator13(this, function(_a2) {
                    if (cursor >= history.length)
                      throw new ReplayMacroCaptureComplete();
                    index = history[cursor];
                    if (index < 0 || index >= options.length) {
                      throw new Error("Unable to save replay: history index ".concat(index, " is invalid at step ").concat(cursor, "."));
                    }
                    if (recordingStates.length === 0)
                      recordingStates.push(state);
                    recordingStates.push(state);
                    steps.push(macroStepFromChoice(options[index].render, chosen.includes(index), info));
                    if (startPrompt === null)
                      startPrompt = prompt;
                    cursor += 1;
                    return [2, index];
                  });
                });
              },
              victory: function() {
                return __awaiter13(this, void 0, void 0, function() {
                  return __generator13(this, function(_a2) {
                    if (cursor >= history.length)
                      throw new ReplayMacroCaptureComplete();
                    throw new Error("Unable to save replay: replay reached victory before consuming history.");
                  });
                });
              }
            };
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4, playGame(targetState.spec, captureUI)];
          case 2:
            _a.sent();
            return [3, 4];
          case 3:
            error_1 = _a.sent();
            if (!(error_1 instanceof ReplayMacroCaptureComplete))
              throw error_1;
            return [3, 4];
          case 4:
            if (cursor !== history.length) {
              throw new Error("Unable to save replay: consumed ".concat(cursor, " of ").concat(history.length, " steps."));
            }
            if (steps.length === 0)
              return [2, null];
            return [2, {
              steps,
              requirements: computeMacroRequirements(recordingStates, steps),
              startPrompt,
              displayLabelMain: "Replay",
              displayLabelMeta: "".concat(targetState.energy, "@"),
              resetFirst: true,
              stageFilter: targetState.spec.metaStage !== void 0 && targetState.spec.selectedChallengeIndex !== void 0 ? { stage: targetState.spec.metaStage, challengeIndex: targetState.spec.selectedChallengeIndex } : void 0
            }];
        }
      });
    });
  }
  var HotkeyMapper = (
    /** @class */
    (function() {
      function HotkeyMapper2() {
      }
      HotkeyMapper2.prototype.map = function(state, options) {
        var e_4, _a, e_5, _b;
        var result = /* @__PURE__ */ new Map();
        var taken = /* @__PURE__ */ new Map();
        var pickable = new Set(options.map(function(o) {
          return renderKey(o.render);
        }));
        function takenByPickable(key) {
          var takenBy = taken.get(key);
          return takenBy !== void 0 && pickable.has(takenBy);
        }
        function set(x, k) {
          result.set(x, k);
          taken.set(k, x);
        }
        function setFrom(cards, preferredHotkeys) {
          var e_6, _a2;
          var preferredSet = new Set(preferredHotkeys);
          var otherHotkeys = hotkeys.filter(function(x) {
            return !preferredSet.has(x);
          });
          var toAssign = preferredHotkeys.concat(otherHotkeys).filter(function(x) {
            return !taken.has(x);
          });
          function tokenSketch(tokens) {
            return __spreadArray10([], __read15(tokens.entries()), false).filter(function(_a3) {
              var _b2 = __read15(_a3, 2), _ = _b2[0], v = _b2[1];
              return v > 0;
            }).map(function(_a3) {
              var _b2 = __read15(_a3, 2), k = _b2[0], v = _b2[1];
              return "".concat(k).concat(v);
            }).sort().join(",");
          }
          function cardGroupKey(card2) {
            return "".concat(card2.name, "|").concat(tokenSketch(card2.tokens));
          }
          var seenGroups = /* @__PURE__ */ new Set();
          var groupRank = 0;
          try {
            for (var cards_2 = __values13(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
              var card = cards_2_1.value;
              var groupKey = cardGroupKey(card);
              if (seenGroups.has(groupKey))
                continue;
              seenGroups.add(groupKey);
              if (groupRank < toAssign.length) {
                set(card.id, toAssign[groupRank]);
              }
              groupRank += 1;
            }
          } catch (e_6_1) {
            e_6 = { error: e_6_1 };
          } finally {
            try {
              if (cards_2_1 && !cards_2_1.done && (_a2 = cards_2.return)) _a2.call(cards_2);
            } finally {
              if (e_6) throw e_6.error;
            }
          }
        }
        setFrom(state.events, supplyAndPlayHotkeys);
        setFrom(state.supply, supplyAndPlayHotkeys);
        setFrom(state.hand, handHotkeys);
        setFrom(state.play, supplyAndPlayHotkeys);
        setFrom(state.potions, potionHotkeys);
        try {
          for (var options_1 = __values13(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
            var option = options_1_1.value;
            var hint = interpretHint(option.hotkeyHint);
            if (hint && !result.has(renderKey(option.render)) && !takenByPickable(hint)) {
              set(renderKey(option.render), hint);
            }
          }
        } catch (e_4_1) {
          e_4 = { error: e_4_1 };
        } finally {
          try {
            if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
          } finally {
            if (e_4) throw e_4.error;
          }
        }
        var index = 0;
        try {
          for (var options_2 = __values13(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
            var option = options_2_1.value;
            if (!result.has(renderKey(option.render))) {
              while (index < hotkeys.length && takenByPickable(hotkeys[index])) {
                index++;
              }
              if (index < hotkeys.length) {
                set(renderKey(option.render), hotkeys[index]);
              }
            }
          }
        } catch (e_5_1) {
          e_5 = { error: e_5_1 };
        } finally {
          try {
            if (options_2_1 && !options_2_1.done && (_b = options_2.return)) _b.call(options_2);
          } finally {
            if (e_5) throw e_5.error;
          }
        }
        return result;
      };
      return HotkeyMapper2;
    })()
  );
  var TokenRenderer = (
    /** @class */
    (function() {
      function TokenRenderer2() {
        this.tokenTypes = ["charge"];
        this.tokenColors = ["black", "red", "orange", "green", "fuchsia", "blue"];
      }
      TokenRenderer2.prototype.getTokenIndex = function(token) {
        var idx = this.tokenTypes.indexOf(token);
        if (idx < 0) {
          this.tokenTypes.push(token);
          idx = this.tokenTypes.length - 1;
        }
        return idx;
      };
      TokenRenderer2.prototype.render = function(tokens) {
        var e_7, _a;
        var parts = [];
        try {
          for (var tokens_1 = __values13(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
            var _b = __read15(tokens_1_1.value, 2), token = _b[0], count = _b[1];
            if (count > 0) {
              var idx = this.getTokenIndex(token);
              var color = this.tokenColors[idx % this.tokenColors.length];
              var display = count === 1 ? "*" : count.toString();
              parts.push("<span id='token' style='color:".concat(color, "'>").concat(display, "</span>"));
            }
          }
        } catch (e_7_1) {
          e_7 = { error: e_7_1 };
        } finally {
          try {
            if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
        return parts.length > 0 ? "(".concat(parts.join(""), ")") : "";
      };
      TokenRenderer2.prototype.renderTooltip = function(tokens) {
        var e_8, _a;
        var parts = [];
        try {
          for (var tokens_2 = __values13(tokens), tokens_2_1 = tokens_2.next(); !tokens_2_1.done; tokens_2_1 = tokens_2.next()) {
            var _b = __read15(tokens_2_1.value, 2), token = _b[0], count = _b[1];
            if (count > 0) {
              parts.push(count === 1 ? token : "".concat(token, " (").concat(count, ")"));
            }
          }
        } catch (e_8_1) {
          e_8 = { error: e_8_1 };
        } finally {
          try {
            if (tokens_2_1 && !tokens_2_1.done && (_a = tokens_2.return)) _a.call(tokens_2);
          } finally {
            if (e_8) throw e_8.error;
          }
        }
        return parts.length > 0 ? "Tokens: ".concat(parts.join(", ")) : "";
      };
      return TokenRenderer2;
    })()
  );
  var globalRendererState = {
    hotkeysOn: typeof localStorage !== "undefined" && JSON.parse(localStorage.getItem("hotkeysOn")) === true,
    userURL: true,
    viewingKingdom: false,
    viewingMacros: false,
    hotkeyMapper: new HotkeyMapper(),
    tokenRenderer: new TokenRenderer(),
    logType: "energy"
  };
  function resetGlobalRenderer() {
    globalRendererState.hotkeyMapper = new HotkeyMapper();
    globalRendererState.tokenRenderer = new TokenRenderer();
  }
  function describeCost(cost) {
    var parts = [];
    if (cost.coin > 0)
      parts.push("lose $".concat(cost.coin));
    if (cost.energy > 0)
      parts.push("gain ".concat(renderEnergy(cost.energy)));
    return "Cost: ".concat(parts.length > 0 ? parts.join(" and ") : "do nothing", ".");
  }
  function renderEffects2(spec) {
    var e_9, _a;
    var parts = [];
    try {
      for (var _b = __values13(cardSpecEffects(spec)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray10([], __read15(effect.text), false));
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    return parts.map(function(x) {
      return "<div>".concat(x, "</div>");
    }).join("");
  }
  function renderAbility2(spec) {
    var e_10, _a;
    var parts = [];
    try {
      for (var _b = __values13(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray10([], __read15(effect.text.map(function(x) {
          return "<div>(ability) ".concat(x, "</div>");
        })), false));
      }
    } catch (e_10_1) {
      e_10 = { error: e_10_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_10) throw e_10.error;
      }
    }
    return parts.join("");
  }
  function renderTrigger2(x, staticTrigger) {
    var desc = staticTrigger ? "(static)" : "(effect)";
    return x.text.map(function(line) {
      return "<div>".concat(desc, " ").concat(line, "</div>");
    }).join("");
  }
  function isZero2(c) {
    return !c || renderCost(c) === "";
  }
  function actionCostKindForSpec2(spec) {
    return spec.buyCost === void 0 ? "use" : "play";
  }
  function cardText2(spec) {
    return cardText(spec);
  }
  function renderTooltipSimple(card, state, tokenRenderer) {
    function renderRelatedSimple(spec) {
      var relatedBuyCost = cardSpecCost(spec, "buy");
      var relatedActionCost = cardSpecCost(spec, actionCostKindForSpec2(spec));
      var relatedBuyStr = !isZero2(relatedBuyCost) ? "(".concat(renderCost(relatedBuyCost), ")") : "---";
      var relatedCostStr = !isZero2(relatedActionCost) ? "(".concat(renderCost(relatedActionCost), ")") : "---";
      var relatedHeader = "<div>---".concat(relatedBuyStr, " ").concat(displayName(spec), " ").concat(relatedCostStr, "---</div>");
      var relatedBody = cardSpecSimpleLines(spec).map(function(line) {
        return "<div>".concat(line, "</div>");
      }).join("");
      var nested = (spec.relatedCards || []).map(renderRelatedSimple).join("");
      return relatedHeader + relatedBody + nested;
    }
    var costKind = card.place === "events" ? "use" : "play";
    var buyCost = cardSpecCost(card.spec, "buy");
    var playCost = cardSpecCost(card.spec, costKind);
    var buyStr = !isZero2(buyCost) ? "(".concat(renderCost(buyCost), ")") : "---";
    var costStr = !isZero2(playCost) ? "(".concat(renderCost(playCost), ")") : "---";
    var header = "<div>---".concat(buyStr, " ").concat(displayName(card.spec), " ").concat(costStr, "---</div>");
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var bodyText = cardSpecSimpleLines(card.spec).map(function(line) {
      return "<div>".concat(line, "</div>");
    }).join("");
    var relatedSimple = card.relatedCards().map(renderRelatedSimple).join("");
    return header + bodyText + tokensHtml + relatedSimple;
  }
  function renderTooltipFull(card, state, tokenRenderer) {
    var costKind = card.place === "events" ? "use" : "play";
    var buyCost = cardSpecCost(card.spec, "buy");
    var playCost = cardSpecCost(card.spec, costKind);
    var buyStr = !isZero2(buyCost) ? "(".concat(renderCost(buyCost), ")") : "---";
    var costStr = !isZero2(playCost) ? "(".concat(renderCost(playCost), ")") : "---";
    var header = "<div>---".concat(buyStr, " ").concat(displayName(card.spec), " ").concat(costStr, "---</div>");
    var tokensHtml = tokenRenderer.renderTooltip(card.tokens);
    var baseFilling = header + cardText2(card.spec) + tokensHtml;
    var relatedFilling = card.relatedCards().map(function(spec) {
      var tempCard = new Card(spec, -1);
      return renderTooltipFull(tempCard, state, tokenRenderer);
    }).join("");
    return baseFilling + relatedFilling;
  }
  function renderShadow(shadow, state, tokenRenderer) {
    var card = shadow.spec.card;
    var tokenhtml = tokenRenderer.render(card.tokens);
    var tooltip;
    switch (shadow.spec.kind) {
      case "ability":
        tooltip = renderAbility2(shadow.spec.card.spec);
        break;
      case "trigger":
        tooltip = renderTrigger2(shadow.spec.trigger, false);
        break;
      case "effect":
        tooltip = renderEffects2(shadow.spec.card.spec);
        break;
      case "cost":
        tooltip = describeCost(shadow.spec.cost);
        break;
      case "buying":
        tooltip = "Buying ".concat(displayName(shadow.spec.card.spec));
        break;
      default:
        return assertNever2(shadow.spec);
    }
    return "<div class='card' tick=".concat(shadow.tick, " shadow='true'>\n        <div class='cardbody'>").concat(card).concat(tokenhtml, "</div>\n        <div class='cardcost'>&nbsp</div>\n        <span class='tooltip tooltip-simple'>").concat(tooltip, "</span>\n    </div>");
  }
  function renderCard(card, state, zone, options, tokenRenderer, count) {
    if (count === void 0) {
      count = 1;
    }
    if (card instanceof Shadow) {
      return renderShadow(card, state, tokenRenderer);
    }
    var costType = zone === "events" || zone === "potions" ? "use" : "play";
    var tokenhtml = tokenRenderer.render(card.tokens);
    var costhtml = zone === "supply" ? renderCost(card.cost("buy", state)) || "&nbsp" : renderCost(card.cost(costType, state)) || "&nbsp";
    var picktext = options.pick !== void 0 ? "<div class='pickorder'>".concat(options.pick + 1, "</div>") : "";
    var counttext = count !== 1 ? "<div class='cardcount'>".concat(count, "</div>") : "";
    var chosenText = options.pick !== void 0 ? "true" : "false";
    var choosetext = options.option !== void 0 ? "choosable chosen='".concat(chosenText, "' option=").concat(options.option) : "";
    var hotkeytext = options.hotkey ? renderHotkey(options.hotkey) : "";
    var ticktext = "tick=".concat(card.ticks[card.ticks.length - 1]);
    var replayUsedPotion = zone === "potions" && state.spec.replayUsedPotionIDs !== void 0 && state.spec.replayUsedPotionIDs.includes(card.id);
    var replayPotionClass = replayUsedPotion ? " replay-used-potion" : "";
    return "<div id='card".concat(card.id, "' class='card").concat(replayPotionClass, "' ").concat(ticktext, " ").concat(choosetext, ">\n        ").concat(picktext, " ").concat(counttext, "\n        <div class='cardbody'>").concat(hotkeytext, " ").concat(card).concat(tokenhtml, "</div>\n        <div class='cardcost'>").concat(costhtml, "</div>\n        <span class='tooltip tooltip-simple'>").concat(renderTooltipSimple(card, state, tokenRenderer), "</span>\n        <span class='tooltip tooltip-full'>").concat(renderTooltipFull(card, state, tokenRenderer), "</span>\n    </div>");
  }
  function sketchMap(x) {
    return __spreadArray10([], __read15(x.entries()), false).filter(function(_a) {
      var _b = __read15(_a, 2), _ = _b[0], v = _b[1];
      return v > 0;
    }).map(function(_a) {
      var _b = __read15(_a, 2), k = _b[0], v = _b[1];
      return "".concat(k).concat(v);
    }).sort().join(",");
  }
  function sketchCard(card, settings) {
    return "".concat(card.name).concat(sketchMap(card.tokens)).concat(getIfDef(settings.pickMap, card.id)).concat(getIfDef(settings.optionsMap, card.id));
  }
  function sketchCards(cards, settings) {
    var e_17, _a;
    var sketches = [];
    var counts = /* @__PURE__ */ new Map();
    var first = /* @__PURE__ */ new Map();
    var last = /* @__PURE__ */ new Map();
    try {
      for (var cards_3 = __values13(cards), cards_3_1 = cards_3.next(); !cards_3_1.done; cards_3_1 = cards_3.next()) {
        var card = cards_3_1.value;
        var s = sketchCard(card, settings);
        if (!counts.has(s)) {
          sketches.push(s);
          first.set(s, card);
        }
        counts.set(s, (counts.get(s) || 0) + 1);
        last.set(s, card);
      }
    } catch (e_17_1) {
      e_17 = { error: e_17_1 };
    } finally {
      try {
        if (cards_3_1 && !cards_3_1.done && (_a = cards_3.return)) _a.call(cards_3);
      } finally {
        if (e_17) throw e_17.error;
      }
    }
    return sketches.map(function(s2) {
      return [s2, { first: first.get(s2), last: last.get(s2), count: counts.get(s2) || 0 }];
    });
  }
  function renderZone(state, zone, settings) {
    if (settings === void 0) {
      settings = {};
    }
    var container = getElement(zone);
    var optionsFns = [];
    var optionsIds = [];
    function render(card, count, forceHotkey) {
      if (count === void 0) {
        count = 1;
      }
      var option;
      var optionFn = getIfDef(settings.optionsMap, card.id);
      var hotkey = forceHotkey || getIfDef(settings.hotkeyMap, card.id);
      if (optionFn) {
        option = optionsFns.length;
        optionsFns.push(optionFn);
        optionsIds.push(card.id);
        if (hotkey)
          keyListeners.set(hotkey, function() {
            return optionFn(false);
          });
      }
      return renderCard(card, state, zone, { option, hotkey, pick: getIfDef(settings.pickMap, card.id) }, globalRendererState.tokenRenderer, count);
    }
    var cards = state.zones.get(zone) || [];
    var sketches = sketchCards(cards, settings);
    container.innerHTML = sketches.map(function(_a) {
      var _b;
      var _c = __read15(_a, 2), _ = _c[0], data = _c[1];
      return render(data.last, data.count, (_b = settings.hotkeyMap) === null || _b === void 0 ? void 0 : _b.get(data.first.id));
    }).join("");
    var _loop_1 = function(i2) {
      var cardEl = getElement("card".concat(optionsIds[i2]));
      if (cardEl) {
        cardEl.onclick = function(e) {
          return optionsFns[i2](e.shiftKey);
        };
      }
    };
    for (var i = 0; i < optionsFns.length; i++) {
      _loop_1(i);
    }
  }
  function renderState(state, settings) {
    var e_18, _a;
    if (settings === void 0) {
      settings = {};
    }
    window.renderedState = state;
    clearChoice();
    if (settings.updateURL === void 0 || settings.updateURL) {
      globalRendererState.userURL = false;
    }
    getElement("resolvingHeader").innerHTML = "Resolving:";
    var par = state.spec.par;
    var previousScore = state.spec.previousScore;
    var previousDisplay = previousScore === void 0 || previousScore === null ? "" : " (previous: ".concat(previousScore, ")");
    var energyDisplay = "".concat(state.energy, "/").concat(par).concat(previousDisplay);
    var energyEl = getElement("energy");
    if (state.energy > par) {
      energyEl.innerHTML = '<span style="color: red">'.concat(energyDisplay, "</span>");
    } else {
      energyEl.innerHTML = energyDisplay;
    }
    getElement("actions").innerHTML = state.actions.toString();
    getElement("buys").innerHTML = state.buys.toString();
    getElement("coin").innerHTML = state.coin.toString();
    getElement("points").innerHTML = "".concat(state.points, "/").concat(state.vp_goal);
    var resolvingEl = getElement("resolving");
    resolvingEl.innerHTML = state.resolving.map(function(c) {
      return renderCard(c, state, "resolving", {}, globalRendererState.tokenRenderer);
    }).join("");
    try {
      for (var zoneNames_1 = __values13(zoneNames), zoneNames_1_1 = zoneNames_1.next(); !zoneNames_1_1.done; zoneNames_1_1 = zoneNames_1.next()) {
        var zone = zoneNames_1_1.value;
        renderZone(state, zone, settings);
      }
    } catch (e_18_1) {
      e_18 = { error: e_18_1 };
    } finally {
      try {
        if (zoneNames_1_1 && !zoneNames_1_1.done && (_a = zoneNames_1.return)) _a.call(zoneNames_1);
      } finally {
        if (e_18) throw e_18.error;
      }
    }
    getElement("playsize").innerHTML = "" + state.play.length;
    getElement("handsize").innerHTML = "" + state.hand.length;
    getElement("discardsize").innerHTML = "" + state.discard.length;
  }
  function bindLogTypeButtons(state, ui) {
    var inputs = querySelectorAll("input[name='logType']");
    inputs.forEach(function(input) {
      input.onchange = function() {
        var logType = this.value;
        globalRendererState.logType = logType;
        setVisibleLog(state, logType, ui);
      };
    });
  }
  function setVisibleLog(state, logType, ui) {
    var e_19, _a;
    try {
      for (var logTypes_1 = __values13(logTypes), logTypes_1_1 = logTypes_1.next(); !logTypes_1_1.done; logTypes_1_1 = logTypes_1.next()) {
        var lt = logTypes_1_1.value;
        var el = querySelector(".logOption[option=".concat(lt, "]"));
        if (el) {
          if (lt === globalRendererState.logType) {
            el.removeAttribute("choosable");
          } else {
            el.setAttribute("choosable", "true");
          }
        }
      }
    } catch (e_19_1) {
      e_19 = { error: e_19_1 };
    } finally {
      try {
        if (logTypes_1_1 && !logTypes_1_1.done && (_a = logTypes_1.return)) _a.call(logTypes_1);
      } finally {
        if (e_19) throw e_19.error;
      }
    }
    displayLogLines(state.logs[logType], ui);
  }
  function displayLogLines(logs, ui) {
    var e_20, _a;
    var result = [];
    for (var i = logs.length - 1; i >= 0; i--) {
      result.push('<div><span class="logLine" pos='.concat(i, ">").concat(logs[i][0], "</span></div>"));
    }
    getElement("log").innerHTML = result.join("");
    var _loop_2 = function(i2, _2, state2) {
      if (state2 !== null) {
        var logLine = querySelector(".logLine[pos='".concat(i2, "']"));
        if (logLine) {
          logLine.onclick = function() {
            if (ui.choiceState) {
              ui.choiceState.reject(new SetState(state2));
            }
          };
        }
      }
    };
    try {
      for (var _b = __values13(logs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read15(_c.value, 2), i = _d[0], _e = __read15(_d[1], 2), _ = _e[0], state = _e[1];
        _loop_2(i, _, state);
      }
    } catch (e_20_1) {
      e_20 = { error: e_20_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_20) throw e_20.error;
      }
    }
  }
  function clearChoice() {
    keyListeners.clear();
    getElement("choicePrompt").innerHTML = "";
    getElement("options").innerHTML = "";
    getElement("undoArea").innerHTML = "";
  }
  function renderStringOption(option, hotkey, pick) {
    var hotkeyText = hotkey ? renderHotkey(hotkey) : "";
    if (hotkey)
      keyListeners.set(hotkey, function() {
        return option.value(false);
      });
    var picktext = pick !== void 0 ? "<div class='pickorder'>".concat(pick, "</div>") : "";
    var el = createElementFromHTML("<span class='option' choosable chosen='false'>".concat(picktext).concat(hotkeyText).concat(option.render, "</span>"));
    el.onclick = function(e) {
      return option.value(e.shiftKey);
    };
    return el;
  }
  function renderChoice(ui, state, choicePrompt, options, picks) {
    var e_21, _a, e_22, _b, e_23, _c;
    if (picks === void 0) {
      picks = [];
    }
    var optionsMap = /* @__PURE__ */ new Map();
    var stringOptions = [];
    try {
      for (var options_3 = __values13(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
        var option = options_3_1.value;
        var rendered = option.render;
        if (rendered.kind === "string") {
          stringOptions.push({ render: rendered.string, value: option.value });
        } else if (rendered.kind === "card") {
          optionsMap.set(rendered.card.id, option.value);
        }
      }
    } catch (e_21_1) {
      e_21 = { error: e_21_1 };
    } finally {
      try {
        if (options_3_1 && !options_3_1.done && (_a = options_3.return)) _a.call(options_3);
      } finally {
        if (e_21) throw e_21.error;
      }
    }
    var pickMap = /* @__PURE__ */ new Map();
    try {
      for (var _d = __values13(picks.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
        var _f = __read15(_e.value, 2), i = _f[0], x = _f[1];
        pickMap.set(renderKey(x), i);
      }
    } catch (e_22_1) {
      e_22 = { error: e_22_1 };
    } finally {
      try {
        if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
      } finally {
        if (e_22) throw e_22.error;
      }
    }
    var hotkeyMap = globalRendererState.hotkeysOn ? globalRendererState.hotkeyMapper.map(state, options) : /* @__PURE__ */ new Map();
    renderState(state, { hotkeyMap, optionsMap, pickMap, updateURL: false });
    setVisibleLog(state, globalRendererState.logType, ui);
    bindLogTypeButtons(state, ui);
    getElement("choicePrompt").innerHTML = choicePrompt;
    var optionsEl = getElement("options");
    clearElement(optionsEl);
    try {
      for (var stringOptions_1 = __values13(stringOptions), stringOptions_1_1 = stringOptions_1.next(); !stringOptions_1_1.done; stringOptions_1_1 = stringOptions_1.next()) {
        var option = stringOptions_1_1.value;
        var hotkey = hotkeyMap.get(option.render);
        optionsEl.appendChild(renderStringOption(option, hotkey, pickMap.get(option.render)));
      }
    } catch (e_23_1) {
      e_23 = { error: e_23_1 };
    } finally {
      try {
        if (stringOptions_1_1 && !stringOptions_1_1.done && (_c = stringOptions_1.return)) _c.call(stringOptions_1);
      } finally {
        if (e_23) throw e_23.error;
      }
    }
    getElement("undoArea").innerHTML = renderSpecials(state, ui);
    bindSpecials(state, ui);
  }
  function saveReplayEnabled(state, ui) {
    return state.hasHistory() && ui.recordingMacro === null && ui.playingMacro.length === 0;
  }
  function renderSpecials(state, ui) {
    return [
      renderBack(),
      renderUndo(state.undoable()),
      renderRedo(state.redo.length > 0),
      renderHotkeyToggle(),
      renderMacroToggle(),
      renderSaveReplay(saveReplayEnabled(state, ui)),
      renderRestart()
    ].join("");
  }
  function renderBack() {
    return "<span class='option' option='back' choosable chosen='false'>".concat(renderHotkey("Esc"), "Back</span>");
  }
  function renderRestart() {
    return "<span id='restart' class='option' option='restart' choosable chosen='false'>Restart</span>";
  }
  function renderMacroToggle() {
    return "<span id='macroToggle' class='option' option='macroToggle' choosable chosen='false'>Macros</span>";
  }
  function renderSaveReplay(enabled) {
    var statusAttr = enabled ? "choosable" : "disabled='disabled'";
    var styleAttr = enabled ? "" : "style='cursor:default;opacity:0.5;'";
    return "<span id='saveReplay' class='option' option='saveReplay' ".concat(statusAttr, " chosen='false' ").concat(styleAttr, ">Save replay</span>");
  }
  function renderHotkeyToggle() {
    return "<span class='option' option='hotkeyToggle' choosable chosen='false'>".concat(renderHotkey("/"), " Hotkeys</span>");
  }
  function renderUndo(undoable) {
    return "<span class='option' option='undo' choosable chosen='false'>".concat(renderHotkey("z"), "Undo</span>");
  }
  function renderRedo(redoable) {
    return "<span class='option' option='redo' ".concat(redoable ? "choosable" : "", " chosen='false'>").concat(renderHotkey("Z"), "Redo</span>");
  }
  function bindSpecials(state, ui) {
    bindHotkeyToggle(ui);
    bindRestart(state, ui);
    bindUndo(state, ui);
    bindRedo(state, ui);
    bindMacroToggle(state, ui);
    bindSaveReplay(state, ui);
    bindBack(ui);
  }
  function bindBack(ui) {
    function back() {
      if (ui.choiceState) {
        var state = ui.choiceState.state;
        var history_1 = state.origin().future;
        var redo = state.redo;
        ui.choiceState.reject(new UndoPastBeginning(history_1, redo, ui.exportPersistenceData()));
      }
    }
    function pick() {
      var deckDialog = getElement("deckDialog");
      if (deckDialog.getAttribute("active") === "true") {
        deckDialog.setAttribute("active", "false");
      } else {
        back();
      }
    }
    keyListeners.set("Escape", pick);
    var el = querySelector("[option='back']");
    if (el)
      el.onclick = back;
  }
  function bindMacroToggle(state, ui) {
    function updateMacroDisplay() {
      var container = getElement("macroSpot");
      if (globalRendererState.viewingMacros) {
        makeMacroButtons(ui, container, state);
      } else {
        closeMacroDeleteMenu();
        container.innerHTML = "";
      }
    }
    updateMacroDisplay();
    var el = querySelector("[option='macroToggle']");
    if (el) {
      el.onclick = function() {
        globalRendererState.viewingMacros = !globalRendererState.viewingMacros;
        updateMacroDisplay();
      };
    }
  }
  function bindSaveReplay(state, ui) {
    var _this = this;
    var el = querySelector("[option='saveReplay']");
    if (!el)
      return;
    el.onclick = function() {
      return __awaiter13(_this, void 0, void 0, function() {
        var macro;
        return __generator13(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!saveReplayEnabled(state, ui))
                return [
                  2
                  /*return*/
                ];
              globalRendererState.viewingMacros = true;
              return [4, buildReplayMacroFromState(state)];
            case 1:
              macro = _a.sent();
              if (macro !== null) {
                ui.macros.push(cloneMacro(macro));
              }
              if (globalRendererState.viewingMacros) {
                makeMacroButtons(ui, getElement("macroSpot"), ui.choiceState ? ui.choiceState.state : state);
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    };
  }
  function makeMacroButtons(ui, container, state) {
    closeMacroDeleteMenu();
    var macroButtons = ui.macros.map(function(macro, index) {
      if (macro.stageFilter !== void 0) {
        if (macro.stageFilter.stage !== state.spec.metaStage || macro.stageFilter.challengeIndex !== state.spec.selectedChallengeIndex) {
          return "";
        }
      }
      return renderPlayMacroButton(macro, index, canPlayMacro(macro, state, ui.choiceState));
    });
    var contents = __spreadArray10([renderRecordMacroButton(ui)], __read15(macroButtons), false).join("");
    container.innerHTML = "<div id='macros'>".concat(contents, "</div>");
    bindRecordMacroButton(ui, state);
    bindPlayMacroButtons(ui, state);
  }
  function renderRecordMacroButton(ui) {
    var buttonText = ui.recordingMacro === null ? "Start recording" : "Stop recording";
    return "<span id='recordMacro' class='option' option='recordMacro' choosable chosen='false'>".concat(buttonText, "</span>");
  }
  function renderPlayMacroButton(macro, index, enabled) {
    var firstStep = macro.steps[0];
    var firstStepText = firstStep ? macroStepLabel(firstStep) : "(empty)";
    var fallbackLabel = firstStepText;
    var fallbackMeta = "(".concat(macro.steps.length, ")");
    var labelText = fallbackLabel;
    var labelMeta = fallbackMeta;
    if (macro.displayLabelMain !== void 0) {
      labelText = macro.displayLabelMain;
      labelMeta = macro.displayLabelMeta ? "(".concat(macro.displayLabelMeta, ")") : "";
    }
    var statusAttr = enabled ? "choosable" : "disabled='disabled'";
    var styleAttr = enabled ? "" : "style='cursor:default;'";
    var metaHTML = labelMeta ? "<span style='color:#888;font-weight:normal;'> ".concat(labelMeta, "</span>") : "";
    return "<span id='playMacro' class='option macroOption' option='macro".concat(index, "' ").concat(statusAttr, " chosen='false' ").concat(styleAttr, "><span class='macroOptionLabel'><span class='macroOptionLabelPrimary'>").concat(labelText, "</span>").concat(metaHTML, "</span><span class='tooltip'>").concat(renderMacroTooltip(macro), "</span></span>");
  }
  function bindRecordMacroButton(ui, state) {
    var el = querySelector("[option='recordMacro']");
    if (el) {
      el.onclick = function() {
        if (ui.recordingMacro === null) {
          ui.recordingMacro = {
            steps: [],
            requirements: emptyMacroRequirements(),
            startPrompt: ui.choiceState ? ui.choiceState.choicePrompt : null,
            displayLabelMain: void 0,
            displayLabelMeta: void 0
          };
          ui.recordingStates = [state];
        } else if (ui.choiceState === null || ui.recordingMacro.steps.length === 0) {
          ui.recordingMacro = null;
          ui.recordingStates = [];
        } else {
          console.log(ui.recordingMacro.steps);
          console.log(ui.recordingStates);
          ui.recordingStates.push(state);
          ui.recordingMacro.requirements = computeMacroRequirements(ui.recordingStates, ui.recordingMacro.steps);
          ui.macros.push(cloneMacro(ui.recordingMacro));
          ui.recordingMacro = null;
          ui.recordingStates = [];
        }
        if (ui.choiceState !== null) {
          ui.render();
        } else {
          makeMacroButtons(ui, getElement("macroSpot"), state);
        }
      };
    }
  }
  function bindPlayMacroButtons(ui, state) {
    var _loop_3 = function(i2) {
      var el = querySelector("[option='macro".concat(i2, "']"));
      if (!el)
        return "continue";
      var macroButton = el;
      macroButton.oncontextmenu = function(e) {
        e.preventDefault();
        e.stopPropagation();
        openMacroDeleteMenu(macroButton, function() {
          ui.macros.splice(i2, 1);
          makeMacroButtons(ui, getElement("macroSpot"), ui.choiceState ? ui.choiceState.state : state);
        });
        return false;
      };
      if (!canPlayMacro(ui.macros[i2], state, ui.choiceState))
        return "continue";
      macroButton.onclick = function(e) {
        closeMacroDeleteMenu();
        if (ui.choiceState && ui.playingMacro.length === 0) {
          var macro = ui.macros[i2];
          ui.playingMacro = repeat2(macro.steps, e.shiftKey ? 10 : 1);
          if (macro.resetFirst === true) {
            var reset = startState(ui.choiceState.state);
            ui.macroStartState = reset;
            ui.preserveMacroOnNextSetState = true;
            ui.choiceState.reject(new SetState(reset));
          } else {
            ui.macroStartState = ui.choiceState.state;
            ui.resolveWithMacro();
          }
        }
      };
    };
    for (var i = 0; i < ui.macros.length; i++) {
      _loop_3(i);
    }
  }
  function bindHotkeyToggle(ui) {
    function pick() {
      globalRendererState.hotkeysOn = !globalRendererState.hotkeysOn;
      localStorage.setItem("hotkeysOn", JSON.stringify(globalRendererState.hotkeysOn));
      ui.render();
    }
    keyListeners.set("/", pick);
    var el = querySelector("[option='hotkeyToggle']");
    if (el)
      el.onclick = pick;
  }
  function startState(state) {
    return state.origin().update({ future: [] });
  }
  function bindRestart(state, ui) {
    var el = querySelector("[option='restart']");
    if (el) {
      el.onclick = function() {
        if (ui.choiceState) {
          ui.choiceState.reject(new SetState(startState(state)));
        }
      };
    }
  }
  function bindRedo(state, ui) {
    function pick() {
      if (ui.choiceState && state.redo.length > 0) {
        ui.choiceState.resolve(state.redo[state.redo.length - 1], false);
      }
    }
    keyListeners.set("Z", pick);
    var el = querySelector("[option='redo']");
    if (el)
      el.onclick = pick;
  }
  function bindUndo(state, ui) {
    function pick() {
      if (ui.choiceState) {
        if (ui.undoAtBeginningMode === "nothing" && !state.undoable())
          return;
        ui.choiceState.reject(new Undo(state));
      }
    }
    keyListeners.set("z", pick);
    var el = querySelector("[option='undo']");
    if (el)
      el.onclick = pick;
  }
  function choiceVerb(x, info) {
    if (!info.includes("actChoice"))
      return "Choose";
    if (x.kind === "string")
      return "Choose";
    switch (x.card.place) {
      case "supply":
        return "Buy";
      case "hand":
        return "Play";
      case "events":
        return "Use";
      case "potions":
        return "Use";
      case "play":
        return "Use";
      default:
        return "Choose";
    }
  }
  function macroStepFromChoice(x, chosen, info) {
    var verb = choiceVerb(x, info);
    switch (x.kind) {
      case "string":
        return __assign11(__assign11({}, x), { verb });
      case "card":
        return { kind: "card", card: macroCardSnapshotFromCard(x.card), chosen, verb };
      default:
        return assertNever2(x);
    }
  }
  function macroMismatch(card, macroCard) {
    var e_24, _a, e_25, _b;
    var result = 0;
    try {
      for (var _c = __values13(card.tokens), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read15(_d.value, 2), token = _e[0], count = _e[1];
        if ((macroCard.tokens.get(token) || 0) < count)
          result++;
      }
    } catch (e_24_1) {
      e_24 = { error: e_24_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_24) throw e_24.error;
      }
    }
    try {
      for (var _f = __values13(macroCard.tokens), _g = _f.next(); !_g.done; _g = _f.next()) {
        var _h = __read15(_g.value, 2), token = _h[0], count = _h[1];
        if ((card.tokens.get(token) || 0) < count)
          result++;
      }
    } catch (e_25_1) {
      e_25 = { error: e_25_1 };
    } finally {
      try {
        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
      } finally {
        if (e_25) throw e_25.error;
      }
    }
    return result;
  }
  function macroMatchCandidate(card, macroCard) {
    return card.place === macroCard.place && card.name === macroCard.name;
  }
  function matchMacro(macro, state, options, chosen) {
    var renders = options.map(function(x, i) {
      return [x.render, i];
    });
    if (macro.kind === "string") {
      renders = renders.filter(function(_a) {
        var _b = __read15(_a, 1), r = _b[0];
        return r.kind === "string" && r.string === macro.string;
      });
      return renders.length > 0 ? renders[0][1] : null;
    }
    renders = renders.filter(function(_a) {
      var _b = __read15(_a, 1), r = _b[0];
      return r.kind === "card" && macroMatchCandidate(r.card, macro.card) && chosen.includes(renders.find(function(x) {
        return x[0] === r;
      })[1]) === macro.chosen;
    });
    renders.sort(function(a2, b) {
      if (a2[0].kind === "card" && b[0].kind === "card") {
        return macroMismatch(a2[0].card, macro.card) - macroMismatch(b[0].card, macro.card);
      }
      return 0;
    });
    return renders.length > 0 ? renders[0][1] : null;
  }
  var GameUI = (
    /** @class */
    (function() {
      function GameUI2(initialMacros, onProgress, undoAtBeginningMode) {
        if (initialMacros === void 0) {
          initialMacros = null;
        }
        if (onProgress === void 0) {
          onProgress = null;
        }
        if (undoAtBeginningMode === void 0) {
          undoAtBeginningMode = "leave";
        }
        this.onProgress = onProgress;
        this.undoAtBeginningMode = undoAtBeginningMode;
        this.undoing = false;
        this.macros = [];
        this.recordingMacro = null;
        this.recordingStates = [];
        this.playingMacro = [];
        this.macroStartState = null;
        this.preserveMacroOnNextSetState = false;
        this.choiceState = null;
        this.macros = loadMacros(initialMacros);
      }
      GameUI2.prototype.recordResolvedChoice = function(state, choicePrompt, options, info, chosen, index) {
        if (this.recordingMacro === null)
          return;
        if (index < 0 || index >= options.length)
          return;
        this.observeRecordingState(state);
        var macroStep = macroStepFromChoice(options[index].render, chosen.includes(index), info);
        this.recordStep(macroStep);
        if (this.recordingMacro.startPrompt === null) {
          this.recordingMacro.startPrompt = choicePrompt;
        }
      };
      GameUI2.prototype.exportPersistenceData = function() {
        return {
          macros: cloneMacros(this.macros),
          viewingMacros: globalRendererState.viewingMacros
        };
      };
      GameUI2.prototype.recordStep = function(x) {
        if (this.recordingMacro) {
          this.recordingMacro.steps.push(x);
        }
      };
      GameUI2.prototype.eraseStep = function() {
        if (this.recordingMacro) {
          if (this.recordingMacro.steps.length === 0) {
            this.recordingMacro = null;
            this.recordingStates = [];
            return;
          }
          console.log(this.recordingMacro.steps);
          console.log(this.recordingStates);
          this.recordingMacro.steps.pop();
          console.assert(this.recordingStates.length > 1, "There should be a recording state to match each macro step");
          this.recordingStates.pop();
          console.log(this.recordingMacro.steps);
          console.log(this.recordingStates);
        }
      };
      GameUI2.prototype.observeRecordingState = function(state) {
        if (this.recordingMacro === null)
          return;
        this.recordingStates.push(state);
      };
      GameUI2.prototype.matchNextMacroStep = function() {
        var macro = this.playingMacro.shift();
        if (macro && this.choiceState) {
          var option = matchMacro(macro, this.choiceState.state, this.choiceState.options, this.choiceState.chosen);
          if (option === null) {
            this.playingMacro = [];
            return { option: null, failed: true };
          }
          return { option, failed: false };
        }
        return { option: null, failed: false };
      };
      GameUI2.prototype.clearChoice = function() {
        this.choiceState = null;
        clearChoice();
      };
      GameUI2.prototype.resolveWithMacro = function() {
        if (this.choiceState) {
          var match = this.matchNextMacroStep();
          if (match.option !== null) {
            this.choiceState.resolve(match.option, false);
          }
        }
      };
      GameUI2.prototype.render = function() {
        if (this.choiceState) {
          var cs_2 = this.choiceState;
          if (this.onProgress) {
            this.onProgress(__assign11({ history: __spreadArray10([], __read15(cs_2.state.origin().future), false), redo: __spreadArray10([], __read15(cs_2.state.future), false) }, this.exportPersistenceData()));
          }
          renderChoice(this, cs_2.state, cs_2.choicePrompt, cs_2.options.map(function(x, i) {
            return __assign11(__assign11({}, x), { value: function(shifted) {
              return cs_2.resolve(i, shifted);
            } });
          }), cs_2.chosen.map(function(i) {
            return cs_2.options[i].render;
          }));
        }
      };
      GameUI2.prototype.choice = function(state, choicePrompt, options, info, chosen) {
        var ui = this;
        return new Promise(function(resolve, reject) {
          function newResolve(n, shifted) {
            ui.clearChoice();
            ui.recordResolvedChoice(state, choicePrompt, options, info, chosen, n);
            var macroStep = macroStepFromChoice(options[n].render, chosen.includes(n), info);
            if (shifted)
              ui.playingMacro = repeat2([macroStep], 9);
            if (ui.playingMacro.length === 0) {
              ui.macroStartState = null;
            }
            resolve(n);
          }
          function newReject(reason) {
            if (reason instanceof Undo) {
              ui.undoing = true;
              ui.eraseStep();
            }
            if (reason instanceof SetState) {
              if (ui.preserveMacroOnNextSetState) {
                ui.preserveMacroOnNextSetState = false;
              } else {
                ui.playingMacro = [];
                ui.macroStartState = null;
              }
            }
            ui.clearChoice();
            reject(reason);
          }
          ui.choiceState = {
            state,
            choicePrompt,
            options,
            info,
            chosen,
            resolve: newResolve,
            reject: newReject
          };
          var macroMatch = ui.matchNextMacroStep();
          if (macroMatch.failed && ui.macroStartState !== null) {
            newReject(new SetState(ui.macroStartState));
            return;
          }
          var chooseTrivial = ui.chooseTrivial(state, options, info);
          if (macroMatch.option !== null) {
            newResolve(macroMatch.option, false);
          } else if (chooseTrivial !== null) {
            if (ui.undoing) {
              newReject(new Undo(state));
            } else {
              newResolve(chooseTrivial, false);
            }
          } else {
            ui.undoing = false;
            ui.render();
          }
        });
      };
      GameUI2.prototype.chooseTrivial = function(state, options, info) {
        if (info.includes("tutorial") || info.includes("actChoice"))
          return null;
        if (options.length === 1)
          return 0;
        return null;
      };
      GameUI2.prototype.victory = function(state) {
        return __awaiter13(this, void 0, void 0, function() {
          var ui;
          return __generator13(this, function(_a) {
            ui = this;
            return [2, new Promise(function(resolve, reject) {
              var _a2;
              ui.undoing = true;
              function newReject(reason) {
                if (reason instanceof Undo)
                  ui.undoing = true;
                ui.clearChoice();
                reject(reason);
              }
              var isReplay = state.spec.replayStage !== null && state.spec.replayStage !== void 0;
              var overPar = Math.max(0, state.energy - state.spec.par);
              var buffer = (_a2 = state.spec.buffer) !== null && _a2 !== void 0 ? _a2 : 0;
              var blockedByBuffer = !isReplay && overPar > buffer;
              var choicePrompt = blockedByBuffer ? "You went ".concat(overPar, " over par, but only have ").concat(buffer, " buffer") : "You won using ".concat(state.energy, " energy!");
              var options = blockedByBuffer ? [] : [{
                render: { kind: "string", string: "Done" },
                value: null,
                hotkeyHint: { kind: "key", val: "!" }
              }];
              ui.choiceState = {
                state,
                choicePrompt,
                options,
                info: ["victory"],
                chosen: [],
                resolve: function() {
                  ui.clearChoice();
                  resolve();
                },
                reject: newReject
              };
              ui.render();
            })];
          });
        });
      };
      return GameUI2;
    })()
  );
  function startGame(spec_1) {
    return __awaiter13(this, arguments, void 0, function(spec, initialHistory, initialRedo, initialMacros, initialViewingMacros, onProgress, undoAtBeginning) {
      var ui, result;
      if (initialHistory === void 0) {
        initialHistory = [];
      }
      if (initialRedo === void 0) {
        initialRedo = [];
      }
      if (initialMacros === void 0) {
        initialMacros = null;
      }
      if (initialViewingMacros === void 0) {
        initialViewingMacros = false;
      }
      if (onProgress === void 0) {
        onProgress = null;
      }
      if (undoAtBeginning === void 0) {
        undoAtBeginning = "leave";
      }
      return __generator13(this, function(_a) {
        switch (_a.label) {
          case 0:
            initHotkeys();
            resetGlobalRenderer();
            closeMacroDeleteMenu();
            globalRendererState.viewingMacros = initialViewingMacros;
            ui = new GameUI(initialMacros, onProgress, undoAtBeginning);
            return [4, playGame(spec, ui, initialHistory, initialRedo)];
          case 1:
            result = _a.sent();
            return [2, __assign11(__assign11({}, result), ui.exportPersistenceData())];
        }
      });
    });
  }

  // public/progressSidebar.js
  var __values14 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  function createTooltip(text) {
    var tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.style.whiteSpace = "pre-line";
    tooltip.textContent = text;
    return tooltip;
  }
  function renderProgressSidebar(selector, stages) {
    var e_1, _a;
    var circles = document.querySelectorAll("".concat(selector, " .progressCircle"));
    var byStage = /* @__PURE__ */ new Map();
    try {
      for (var stages_1 = __values14(stages), stages_1_1 = stages_1.next(); !stages_1_1.done; stages_1_1 = stages_1.next()) {
        var stage = stages_1_1.value;
        byStage.set(stage.stage, stage);
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (stages_1_1 && !stages_1_1.done && (_a = stages_1.return)) _a.call(stages_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    circles.forEach(function(circle) {
      var el = circle;
      var stage2 = parseInt(el.getAttribute("data-stage") || "-1");
      var display = byStage.get(stage2);
      el.classList.remove("completed", "current", "replayable", "replaying");
      el.onclick = null;
      var existingScore = el.querySelector(".progressScore");
      if (existingScore)
        existingScore.remove();
      var existingTooltips = el.querySelectorAll(".tooltip");
      existingTooltips.forEach(function(node) {
        return node.remove();
      });
      if (!display)
        return;
      if (display.completed)
        el.classList.add("completed");
      if (display.current)
        el.classList.add("current");
      if (display.replayable)
        el.classList.add("replayable");
      if (display.replaying)
        el.classList.add("replaying");
      if (display.onClick)
        el.onclick = display.onClick;
      var tooltipTarget = el;
      if (display.scoreText !== void 0) {
        var scoreSpan = document.createElement("span");
        scoreSpan.className = "progressScore";
        scoreSpan.textContent = display.scoreText;
        if (display.scoreColor)
          scoreSpan.style.color = display.scoreColor;
        el.appendChild(scoreSpan);
        tooltipTarget = scoreSpan;
      }
      if (display.tooltipText && display.tooltipText.length > 0) {
        tooltipTarget.appendChild(createTooltip(display.tooltipText));
      }
    });
  }

  // public/metaUI.js
  var __assign12 = function() {
    __assign12 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign12.apply(this, arguments);
  };
  var __awaiter14 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator14 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values15 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read16 = function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  function getElement2(id) {
    return document.getElementById(id);
  }
  function clearElement2(el) {
    el.innerHTML = "";
  }
  function createDiv(className) {
    var div = document.createElement("div");
    if (className)
      div.className = className;
    return div;
  }
  function createSpan(className) {
    var span = document.createElement("span");
    if (className)
      span.className = className;
    return span;
  }
  function createElementFromHTML2(html) {
    var template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild;
  }
  function createTooltip2(text) {
    var tooltip = createSpan("tooltip");
    tooltip.style.whiteSpace = "pre-line";
    tooltip.textContent = text;
    return tooltip;
  }
  function showElement(el) {
    el.removeAttribute("hidden");
  }
  function hideElement(el) {
    el.setAttribute("hidden", "");
  }
  function setBufferDisplayText(text) {
    var bufferDisplay = document.getElementById("bufferDisplay");
    if (!bufferDisplay)
      return;
    bufferDisplay.textContent = text;
  }
  function showScreen(screen) {
    var e_1, _a, e_2, _b;
    var screens = {
      stage: "stageScreen",
      path: "pathSelectionScreen",
      game: "gameContainer",
      victory: "victoryScreen",
      gameOver: "gameOverScreen"
    };
    try {
      for (var _c = __values15(Object.entries(screens)), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read16(_d.value, 2), name_1 = _e[0], id = _e[1];
        var el = getElement2(id);
        if (name_1 === screen) {
          showElement(el);
        } else {
          hideElement(el);
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    var showShared = screen === "stage" || screen === "path" || screen === "game";
    var sharedElements = ["progressSidebar", "bufferDisplay", "deckIcon"];
    try {
      for (var sharedElements_1 = __values15(sharedElements), sharedElements_1_1 = sharedElements_1.next(); !sharedElements_1_1.done; sharedElements_1_1 = sharedElements_1.next()) {
        var id = sharedElements_1_1.value;
        var el = document.getElementById(id);
        if (el) {
          if (showShared)
            showElement(el);
          else
            hideElement(el);
        }
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (sharedElements_1_1 && !sharedElements_1_1.done && (_b = sharedElements_1.return)) _b.call(sharedElements_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  }
  function showDialog(id) {
    getElement2(id).setAttribute("active", "true");
  }
  function hideDialog(id) {
    getElement2(id).setAttribute("active", "false");
  }
  function bindDialogDismiss(dialogId, onDismiss) {
    var dialog = getElement2(dialogId);
    var onKeyDown = function(e) {
      if (e.key === "Escape" || e.key === "z") {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }
    };
    var onMouseDown = function(e) {
      var target = e.target;
      if (target !== null && !dialog.contains(target)) {
        onDismiss();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onMouseDown, true);
    return function() {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("mousedown", onMouseDown, true);
    };
  }
  var currentUndoRedoState = {
    state: null,
    onUndo: null,
    onRedo: null
  };
  var modalDialogDepth = 0;
  function refreshUndoRedoButtons() {
    var state = currentUndoRedoState.state;
    var onUndo = currentUndoRedoState.onUndo;
    var onRedo = currentUndoRedoState.onRedo;
    if (state === null || onUndo === null || onRedo === null)
      return;
    var dialogsOpen = modalDialogDepth > 0;
    var undoEnabled = !dialogsOpen && state.canUndo();
    var redoEnabled = !dialogsOpen && state.canRedo();
    var undoButtons = document.querySelectorAll("#metaUndo, #metaUndoPath");
    var redoButtons = document.querySelectorAll("#metaRedo, #metaRedoPath");
    undoButtons.forEach(function(btn) {
      var el = btn;
      if (undoEnabled) {
        el.removeAttribute("disabled");
        el.onclick = onUndo;
      } else {
        el.setAttribute("disabled", "disabled");
        el.onclick = null;
      }
    });
    redoButtons.forEach(function(btn) {
      var el = btn;
      if (redoEnabled) {
        el.removeAttribute("disabled");
        el.onclick = onRedo;
      } else {
        el.setAttribute("disabled", "disabled");
        el.onclick = null;
      }
    });
    if (undoEnabled) {
      keyListeners.set("z", onUndo);
    } else {
      keyListeners.delete("z");
    }
    if (redoEnabled) {
      keyListeners.set("Z", onRedo);
    } else {
      keyListeners.delete("Z");
    }
  }
  function enterModalDialog() {
    modalDialogDepth++;
    refreshUndoRedoButtons();
  }
  function exitModalDialog() {
    modalDialogDepth = Math.max(0, modalDialogDepth - 1);
    refreshUndoRedoButtons();
  }
  function updateBufferDisplay(state) {
    setBufferDisplayText("Buffer: ".concat(state.data.buffer));
  }
  function updateProgressSidebar(state, onReplayStage) {
    var _a;
    var inGame = state.data.phase === "in_game";
    var displays = [];
    var _loop_1 = function(stage2) {
      var display = { stage: stage2 };
      var basePar = BASE_PARS[stage2];
      var shownBasePar = displayBasePar(stage2, state);
      var currentStageSpec = stage2 === state.data.stage && state.data.challenges.length === 1 ? makeSpec(state, state.data.challenges[0]) : null;
      var currentStagePar = (_a = currentStageSpec === null || currentStageSpec === void 0 ? void 0 : currentStageSpec.par) !== null && _a !== void 0 ? _a : null;
      var tooltip = basePar === void 0 ? "" : describeBasePar(stage2, state);
      if (stage2 < state.data.stage) {
        var replayData = state.data.stageReplays[stage2];
        if (replayData !== null) {
          tooltip = describeParCalculation(stage2, replayData.challenge, replayData.spec.relics, state);
        }
      } else if (stage2 === state.data.stage && currentStagePar !== null) {
        tooltip = describeParCalculation(stage2, state.data.challenges[0], state.data.relics, state);
      }
      display.tooltipText = tooltip.replace(/, /g, "\n");
      if (stage2 < state.data.stage) {
        display.completed = true;
        var score = state.data.stageScores[stage2];
        var par = state.data.stagePars[stage2];
        if (score !== null && par !== null) {
          display.scoreText = "".concat(score, "/").concat(formatParDisplay(stage2, par, state));
          if (score > par)
            display.scoreColor = "red";
          else if (score < par)
            display.scoreColor = "green";
        }
        if (!inGame && onReplayStage && state.data.stageReplays[stage2] !== null) {
          display.replayable = true;
          display.onClick = function() {
            return onReplayStage(stage2);
          };
        }
      } else if (stage2 === state.data.stage) {
        display.current = true;
        if (state.data.phase === "in_game" && currentStagePar !== null)
          display.scoreText = "?/".concat(formatParDisplay(stage2, currentStagePar, state));
        else if (shownBasePar !== null)
          display.scoreText = formatParDisplay(stage2, shownBasePar, state);
      } else {
        if (shownBasePar !== null)
          display.scoreText = formatParDisplay(stage2, shownBasePar, state);
      }
      displays.push(display);
    };
    for (var stage = 0; stage < BASE_PARS.length; stage++) {
      _loop_1(stage);
    }
    renderProgressSidebar("#progressLine", displays);
  }
  function encounterTooltipText(rewardState, state) {
    var e_3, _a;
    if (rewardState.kind !== "encounter" || rewardState.encounter === null)
      return "";
    var options = getRewardOptions(rewardState, state);
    if (options.length === 0)
      return "";
    var lines = [];
    try {
      for (var options_1 = __values15(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
        var option = options_1_1.value;
        var text = option.description ? "".concat(option.label, ": ").concat(option.description) : option.label;
        lines.push(text);
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    return lines.join("\n");
  }
  function bindUndoRedoButtons(state, onUndo, onRedo) {
    currentUndoRedoState = { state, onUndo, onRedo };
    refreshUndoRedoButtons();
  }
  function renderCommonUI(state, onReplayStage) {
    updateBufferDisplay(state);
    updateProgressSidebar(state, onReplayStage);
    var deckIcon = getElement2("deckIcon");
    deckIcon.onclick = function() {
      return deckDialogOpen ? hideDeckDialog() : showDeckDialog(state);
    };
  }
  function showCardPicker(prompt, options, canCancel, onSelect, onCancel) {
    var e_4, _a;
    enterModalDialog();
    var closed = false;
    var unbindDismiss = function() {
    };
    function close(next) {
      if (closed)
        return;
      closed = true;
      unbindDismiss();
      hideDialog("cardPickerDialog");
      exitModalDialog();
      next();
    }
    getElement2("cardPickerTitle").textContent = prompt;
    var container = getElement2("cardPickerOptions");
    clearElement2(container);
    var _loop_2 = function(card2) {
      var spec = "spec" in card2 ? card2.spec : card2;
      if (card2 instanceof Relic) {
        var charges = card2.count("charge");
        if (charges > 0) {
          spec = __assign12(__assign12({}, spec), { name: "".concat(spec.name, " (").concat(charges, ")") });
        }
      }
      var optionEl = createElementFromHTML2(renderSpecNoRelated(spec));
      optionEl.style.cursor = "pointer";
      optionEl.onclick = function() {
        return close(function() {
          return onSelect(card2);
        });
      };
      container.appendChild(optionEl);
    };
    try {
      for (var options_2 = __values15(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
        var card = options_2_1.value;
        _loop_2(card);
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (options_2_1 && !options_2_1.done && (_a = options_2.return)) _a.call(options_2);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    var cancelBtn = getElement2("cardPickerCancel");
    if (canCancel) {
      showElement(cancelBtn);
      cancelBtn.onclick = function() {
        return close(onCancel);
      };
    } else {
      hideElement(cancelBtn);
    }
    showDialog("cardPickerDialog");
    if (canCancel) {
      unbindDismiss = bindDialogDismiss("cardPickerDialog", function() {
        return close(onCancel);
      });
    }
  }
  function showOptionPicker(prompt, options, canCancel, onSelect, onCancel) {
    var e_5, _a;
    enterModalDialog();
    var closed = false;
    var unbindDismiss = function() {
    };
    function close(next) {
      if (closed)
        return;
      closed = true;
      unbindDismiss();
      hideDialog("encounterDialog");
      exitModalDialog();
      next();
    }
    getElement2("encounterTitle").textContent = prompt;
    getElement2("encounterDescription").textContent = "";
    var container = getElement2("encounterOptions");
    clearElement2(container);
    var _loop_3 = function(option2) {
      var optionDiv = createDiv("encounterOption");
      if (option2.spec) {
        var specEl = createElementFromHTML2(renderSpecNoRelated(option2.spec));
        if (option2.disabled) {
          specEl.style.opacity = "0.5";
          specEl.style.cursor = "default";
        } else {
          specEl.style.cursor = "pointer";
          specEl.onclick = function() {
            return close(function() {
              return onSelect(option2.value);
            });
          };
        }
        optionDiv.appendChild(specEl);
        var subtitle = createDiv("encounterOptionSubtitle");
        subtitle.textContent = option2.label;
        optionDiv.appendChild(subtitle);
      } else {
        var nameSpan = createSpan("option encounterOptionName");
        nameSpan.setAttribute("choosable", "");
        nameSpan.textContent = option2.label;
        if (option2.disabled) {
          nameSpan.style.opacity = "0.5";
          nameSpan.style.cursor = "default";
        } else {
          nameSpan.style.cursor = "pointer";
          nameSpan.onclick = function() {
            return close(function() {
              return onSelect(option2.value);
            });
          };
        }
        optionDiv.appendChild(nameSpan);
        if (option2.description) {
          var descDiv = createDiv("encounterOptionDesc");
          descDiv.textContent = option2.description;
          optionDiv.appendChild(descDiv);
        }
      }
      container.appendChild(optionDiv);
    };
    try {
      for (var options_3 = __values15(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
        var option = options_3_1.value;
        _loop_3(option);
      }
    } catch (e_5_1) {
      e_5 = { error: e_5_1 };
    } finally {
      try {
        if (options_3_1 && !options_3_1.done && (_a = options_3.return)) _a.call(options_3);
      } finally {
        if (e_5) throw e_5.error;
      }
    }
    var cancelBtn = getElement2("encounterCancel");
    if (canCancel) {
      showElement(cancelBtn);
      cancelBtn.onclick = function() {
        return close(onCancel);
      };
    } else {
      hideElement(cancelBtn);
    }
    showDialog("encounterDialog");
    if (canCancel) {
      unbindDismiss = bindDialogDismiss("encounterDialog", function() {
        return close(onCancel);
      });
    }
  }
  function renderStageScreen(state, onChallenge, onOptionClick, onBurdenClick, onReplayStage) {
    var e_6, _a;
    showScreen("stage");
    renderCommonUI(state, onReplayStage);
    var debugTag = state.debugEnabled ? " [Debug]" : "";
    getElement2("stageTitle").textContent = "Stage ".concat(state.data.stage + 1).concat(debugTag);
    var rewardContainer = getElement2("rewardButtons");
    clearElement2(rewardContainer);
    state.data.rewardStates.forEach(function(rewardState, rewardIndex) {
      var rewardRow = createDiv("rewardRow");
      var labelDiv = createDiv("rewardLabel");
      labelDiv.textContent = getRewardName(rewardState);
      if (rewardState.kind === "encounter") {
        var tooltipText = encounterTooltipText(rewardState, state);
        if (tooltipText !== "") {
          labelDiv.appendChild(createTooltip2(tooltipText));
        }
      }
      rewardRow.appendChild(labelDiv);
      var optionsDiv = createDiv("rewardOptions");
      var options = getRewardOptions(rewardState, state);
      options.forEach(function(option, optionIndex) {
        var _a2, _b2;
        var optionEl;
        if (option.spec) {
          var hasRelatedContent = (option.spec.relatedCards || []).length > 0;
          var useRelatedTooltipMode = rewardState.kind === "card" || rewardState.kind === "potion" || rewardState.kind === "event";
          var tooltipMode = useRelatedTooltipMode && hasRelatedContent ? "onlyRelated" : "default";
          optionEl = createElementFromHTML2(renderSpecNoRelated(option.spec, tooltipMode));
          optionEl.classList.add("rewardOption");
        } else {
          optionEl = createDiv("rewardOption option");
          if (option.compact)
            optionEl.classList.add("rewardOptionCompact");
          var nameDiv = createDiv("rewardOptionNameText");
          nameDiv.textContent = option.label;
          optionEl.appendChild(nameDiv);
          if (option.description) {
            var descDiv = createDiv("rewardOptionDescriptionText");
            descDiv.textContent = option.description;
            optionEl.appendChild(descDiv);
          }
          if (option.tooltipSpec) {
            var tooltipSimple = createSpan("tooltip tooltip-simple");
            tooltipSimple.innerHTML = buildSpecTooltipSimple(option.tooltipSpec);
            optionEl.appendChild(tooltipSimple);
            var tooltipFull = createSpan("tooltip tooltip-full");
            tooltipFull.innerHTML = buildSpecTooltipFull(option.tooltipSpec);
            optionEl.appendChild(tooltipFull);
          }
        }
        if (((_a2 = option.bufferDelta) !== null && _a2 !== void 0 ? _a2 : 0) !== 0) {
          var bufferBadge = createSpan("rewardOptionBufferBadge");
          if (((_b2 = option.bufferDelta) !== null && _b2 !== void 0 ? _b2 : 0) < 0) {
            bufferBadge.classList.add("negative");
          } else {
            bufferBadge.classList.add("positive");
          }
          bufferBadge.textContent = "".concat(option.bufferDelta);
          optionEl.appendChild(bufferBadge);
        }
        if (option.disabled) {
          optionEl.setAttribute("disabled", "disabled");
          if (option.checked) {
            optionEl.classList.add("checked");
            var checkmark = createSpan("checkmark");
            checkmark.textContent = " \u2713";
            optionEl.appendChild(checkmark);
          }
        } else {
          optionEl.setAttribute("choosable", "");
          optionEl.style.cursor = "pointer";
          optionEl.onclick = function() {
            return onOptionClick(rewardIndex, optionIndex);
          };
        }
        optionsDiv.appendChild(optionEl);
      });
      rewardRow.appendChild(optionsDiv);
      rewardContainer.appendChild(rewardRow);
    });
    state.data.burdenStates.forEach(function(burdenState, burdenIndex) {
      var burdenRow = createDiv("rewardRow");
      var labelDiv = createDiv("rewardLabel");
      labelDiv.textContent = "Take Burden";
      burdenRow.appendChild(labelDiv);
      var optionsDiv = createDiv("rewardOptions");
      var options = getBurdenOptions(burdenState, state);
      options.forEach(function(option, optionIndex) {
        var e_7, _a2;
        var optionEl;
        if (option.spec) {
          optionEl = createElementFromHTML2(renderSpecNoRelated(option.spec));
          optionEl.classList.add("rewardOption");
        } else {
          optionEl = createDiv("rewardOption option");
          var nameDiv = createDiv("rewardOptionNameText");
          nameDiv.textContent = option.label;
          optionEl.appendChild(nameDiv);
          if (option.description) {
            try {
              for (var _b2 = __values15(option.description.split("\n")), _c2 = _b2.next(); !_c2.done; _c2 = _b2.next()) {
                var line = _c2.value;
                if (line.length === 0)
                  continue;
                var descDiv = createDiv("rewardOptionDescriptionText");
                descDiv.textContent = line;
                optionEl.appendChild(descDiv);
              }
            } catch (e_7_1) {
              e_7 = { error: e_7_1 };
            } finally {
              try {
                if (_c2 && !_c2.done && (_a2 = _b2.return)) _a2.call(_b2);
              } finally {
                if (e_7) throw e_7.error;
              }
            }
          }
        }
        if (option.disabled) {
          optionEl.setAttribute("disabled", "disabled");
          if (option.checked) {
            optionEl.classList.add("checked");
            var checkmark = createSpan("checkmark");
            checkmark.textContent = " \u2713";
            optionEl.appendChild(checkmark);
          }
        } else {
          optionEl.setAttribute("choosable", "");
          optionEl.style.cursor = "pointer";
          optionEl.onclick = function() {
            return onBurdenClick(burdenIndex, optionIndex);
          };
        }
        optionsDiv.appendChild(optionEl);
      });
      burdenRow.appendChild(optionsDiv);
      rewardContainer.appendChild(burdenRow);
    });
    var challengeContainer = getElement2("challengeButtons");
    clearElement2(challengeContainer);
    var unresolvedBurdens = state.data.burdenStates.some(function(burdenState) {
      return !isBurdenResolved(burdenState);
    });
    var _loop_4 = function(challenge2) {
      var playBtn = createSpan("option");
      if (!unresolvedBurdens)
        playBtn.setAttribute("choosable", "");
      playBtn.innerHTML = renderChallenge(challenge2, state);
      if (unresolvedBurdens) {
        playBtn.setAttribute("disabled", "disabled");
      } else {
        playBtn.onclick = function() {
          return onChallenge(challenge2);
        };
      }
      challengeContainer.appendChild(playBtn);
    };
    try {
      for (var _b = __values15(state.data.challenges), _c = _b.next(); !_c.done; _c = _b.next()) {
        var challenge = _c.value;
        _loop_4(challenge);
      }
    } catch (e_6_1) {
      e_6 = { error: e_6_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_6) throw e_6.error;
      }
    }
  }
  function renderPathSelectionScreen(state, paths, onSelect, onReplayStage) {
    var e_8, _a;
    showScreen("path");
    renderCommonUI(state, onReplayStage);
    var debugTag = state.debugEnabled ? " [Debug]" : "";
    getElement2("pathTitle").textContent = "Stage ".concat(state.data.stage + 1).concat(debugTag, " - Choose Your Path");
    var columns = getElement2("pathColumns");
    clearElement2(columns);
    try {
      for (var _b = __values15(paths.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read16(_c.value, 2), index = _d[0], path = _d[1];
        columns.appendChild(renderPathColumn(path, state, onSelect, index));
      }
    } catch (e_8_1) {
      e_8 = { error: e_8_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_8) throw e_8.error;
      }
    }
  }
  function renderPathColumn(path, state, onSelect, index) {
    var e_9, _a;
    var pathColumn = createDiv("pathColumn");
    var pathChoice = createSpan("option pathChoice");
    pathChoice.setAttribute("choosable", "");
    var fallbackLabel = index < 2 ? index === 0 ? "Go left" : "Go right" : "Use Winged Boots";
    pathChoice.textContent = path.label === "Path" ? fallbackLabel : path.label;
    pathChoice.onclick = function() {
      return onSelect(path);
    };
    pathColumn.appendChild(pathChoice);
    var rewardsContainer = createDiv("pathRewards");
    try {
      for (var _b = __values15(path.rewardStates), _c = _b.next(); !_c.done; _c = _b.next()) {
        var rewardState = _c.value;
        var rewardDiv = createDiv("pathReward");
        rewardDiv.textContent = getRewardName(rewardState);
        rewardsContainer.appendChild(rewardDiv);
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    for (var burdenIndex = 0; burdenIndex < path.burdenStates.length; burdenIndex++) {
      var burdenDiv = createDiv("pathReward");
      burdenDiv.textContent = "Burden";
      rewardsContainer.appendChild(burdenDiv);
    }
    pathColumn.appendChild(rewardsContainer);
    return pathColumn;
  }
  var deckDialogOpen = false;
  function showDeckDialog(state) {
    var sections = [
      { title: "Cards", items: state.data.collectedCards },
      { title: "Events", items: state.data.collectedEvents },
      { title: "Potions", items: state.data.potions.map(function(p) {
        return p.spec;
      }) },
      { title: "Relics", items: state.data.relics.map(function(relic) {
        var charges = relic.count("charge");
        if (charges > 0) {
          return __assign12(__assign12({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(charges, ")") });
        }
        return relic.spec;
      }) }
    ];
    renderDeckSections(sections);
  }
  function showDeckDialogForSpec(spec) {
    var _a, _b;
    var sections = [
      { title: "Cards", items: (_a = spec.collectedCards) !== null && _a !== void 0 ? _a : spec.cards },
      { title: "Events", items: (_b = spec.collectedEvents) !== null && _b !== void 0 ? _b : spec.events },
      { title: "Potions", items: spec.potions.map(function(p) {
        return p.spec;
      }) },
      { title: "Relics", items: spec.relics.map(function(relic) {
        var charges = relic.count("charge");
        if (charges > 0) {
          return __assign12(__assign12({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(charges, ")") });
        }
        return relic.spec;
      }) }
    ];
    renderDeckSections(sections);
  }
  function renderDeckSections(sections) {
    var e_10, _a, e_11, _b;
    var container = getElement2("deckContents");
    clearElement2(container);
    var hasContent = false;
    try {
      for (var sections_1 = __values15(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
        var section = sections_1_1.value;
        if (section.items.length > 0) {
          hasContent = true;
          var sectionDiv = createDiv("deckSection");
          var header = createDiv("deckSectionHeader");
          header.innerHTML = "<strong>".concat(section.title, ":</strong>");
          sectionDiv.appendChild(header);
          var itemsRow = createDiv("deckSectionItems");
          try {
            for (var _c = (e_11 = void 0, __values15(section.items)), _d = _c.next(); !_d.done; _d = _c.next()) {
              var spec = _d.value;
              itemsRow.appendChild(createElementFromHTML2(renderSpecNoRelated(spec)));
            }
          } catch (e_11_1) {
            e_11 = { error: e_11_1 };
          } finally {
            try {
              if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            } finally {
              if (e_11) throw e_11.error;
            }
          }
          sectionDiv.appendChild(itemsRow);
          container.appendChild(sectionDiv);
        }
      }
    } catch (e_10_1) {
      e_10 = { error: e_10_1 };
    } finally {
      try {
        if (sections_1_1 && !sections_1_1.done && (_a = sections_1.return)) _a.call(sections_1);
      } finally {
        if (e_10) throw e_10.error;
      }
    }
    if (!hasContent) {
      var msg = createDiv();
      msg.textContent = "No items collected yet.";
      container.appendChild(msg);
    }
    var dialog = getElement2("deckDialog");
    var specs = dialog.querySelectorAll(".spec");
    specs.forEach(function(spec2) {
      var tooltips = spec2.querySelectorAll(".tooltip, .tooltip-simple, .tooltip-full");
      spec2.addEventListener("mouseenter", function() {
        var rect = spec2.getBoundingClientRect();
        tooltips.forEach(function(tooltip) {
          var el = tooltip;
          el.style.position = "fixed";
          el.style.top = "".concat(rect.bottom, "px");
          el.style.left = "".concat(rect.left, "px");
        });
      });
    });
    showDialog("deckDialog");
    deckDialogOpen = true;
  }
  function hideDeckDialog() {
    hideDialog("deckDialog");
    deckDialogOpen = false;
  }
  function isDeckDialogOpen() {
    return deckDialogOpen;
  }
  var MetaGameUI = (
    /** @class */
    (function() {
      function MetaGameUI2() {
        initHotkeys();
      }
      MetaGameUI2.prototype.chooseCard = function(state_1, prompt_1, options_4) {
        return __awaiter14(this, arguments, void 0, function(state, prompt, options, canCancel) {
          if (canCancel === void 0) {
            canCancel = true;
          }
          return __generator14(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              bindUndoRedoButtons(state, function() {
                return reject(new Undo2());
              }, function() {
                return reject(new Redo());
              });
              showCardPicker(prompt, options, canCancel, function(card) {
                return resolve(card);
              }, function() {
                return resolve(null);
              });
            })];
          });
        });
      };
      MetaGameUI2.prototype.chooseOption = function(state_1, prompt_1, options_4) {
        return __awaiter14(this, arguments, void 0, function(state, prompt, options, canCancel) {
          if (canCancel === void 0) {
            canCancel = true;
          }
          return __generator14(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              bindUndoRedoButtons(state, function() {
                return reject(new Undo2());
              }, function() {
                return reject(new Redo());
              });
              showOptionPicker(prompt, options, canCancel, function(value) {
                return resolve(value);
              }, function() {
                return resolve(null);
              });
            })];
          });
        });
      };
      MetaGameUI2.prototype.waitForChallenge = function(state) {
        return __awaiter14(this, void 0, void 0, function() {
          var _this = this;
          return __generator14(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              var escapeListener = function() {
                if (isDeckDialogOpen()) {
                  hideDeckDialog();
                  return;
                }
                finishReject(new ExitToLauncher());
              };
              var cleanupEscapeListener = function() {
                if (keyListeners.get("Escape") === escapeListener)
                  keyListeners.delete("Escape");
                if (keyListeners.get("Esc") === escapeListener)
                  keyListeners.delete("Esc");
              };
              var finishResolve = function(challenge) {
                cleanupEscapeListener();
                resolve(challenge);
              };
              var finishReject = function(error) {
                cleanupEscapeListener();
                reject(error);
              };
              keyListeners.set("Escape", escapeListener);
              keyListeners.set("Esc", escapeListener);
              var render = function() {
                bindUndoRedoButtons(state, function() {
                  return finishReject(new Undo2());
                }, function() {
                  return finishReject(new Redo());
                });
                renderStageScreen(
                  state,
                  // onChallenge - returns the selected challenge
                  function(challenge) {
                    finishResolve(challenge);
                  },
                  // onOptionClick
                  function(rewardIndex, optionIndex) {
                    return __awaiter14(_this, void 0, void 0, function() {
                      var rewardState, options, option, _a2, newData, transform, noOpCancel, newRewardState;
                      return __generator14(this, function(_b) {
                        switch (_b.label) {
                          case 0:
                            rewardState = state.data.rewardStates[rewardIndex];
                            options = getRewardOptions(rewardState, state);
                            option = options[optionIndex];
                            if (option.disabled)
                              return [
                                2
                                /*return*/
                              ];
                            return [4, option.onClick()];
                          case 1:
                            _a2 = _b.sent(), newData = _a2.newData, transform = _a2.transform;
                            noOpCancel = transform === void 0 && (newData === rewardState || rewardState.kind === "encounter" && newData === rewardState.data);
                            if (noOpCancel) {
                              render();
                              return [
                                2
                                /*return*/
                              ];
                            }
                            newRewardState = updateRewardState(rewardState, newData);
                            updateRewardAtIndex(state, rewardIndex, newRewardState);
                            if (!transform) return [3, 3];
                            return [
                              4,
                              transform(state)
                              // Set checkpoint for undo
                            ];
                          case 2:
                            _b.sent();
                            _b.label = 3;
                          case 3:
                            state.setCheckpoint();
                            render();
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  },
                  function(burdenIndex, optionIndex) {
                    return __awaiter14(_this, void 0, void 0, function() {
                      var burdenState, options, option, _a2, newData, transform, noOpCancel, newBurdenState;
                      return __generator14(this, function(_b) {
                        switch (_b.label) {
                          case 0:
                            burdenState = state.data.burdenStates[burdenIndex];
                            options = getBurdenOptions(burdenState, state);
                            option = options[optionIndex];
                            if (option.disabled)
                              return [
                                2
                                /*return*/
                              ];
                            return [4, option.onClick()];
                          case 1:
                            _a2 = _b.sent(), newData = _a2.newData, transform = _a2.transform;
                            noOpCancel = transform === void 0 && newData === burdenState;
                            if (noOpCancel) {
                              render();
                              return [
                                2
                                /*return*/
                              ];
                            }
                            newBurdenState = updateBurdenState(burdenState, newData);
                            updateBurdenAtIndex(state, burdenIndex, newBurdenState);
                            if (!transform) return [3, 3];
                            return [4, transform(state)];
                          case 2:
                            _b.sent();
                            _b.label = 3;
                          case 3:
                            state.setCheckpoint();
                            render();
                            return [
                              2
                              /*return*/
                            ];
                        }
                      });
                    });
                  },
                  function(stage) {
                    return finishReject(new ReplayStage(stage));
                  }
                );
              };
              render();
            })];
          });
        });
      };
      MetaGameUI2.prototype.pickPath = function(state, paths) {
        return __awaiter14(this, void 0, void 0, function() {
          return __generator14(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              var escapeListener = function() {
                if (isDeckDialogOpen()) {
                  hideDeckDialog();
                  return;
                }
                finishReject(new ExitToLauncher());
              };
              var cleanupEscapeListener = function() {
                if (keyListeners.get("Escape") === escapeListener)
                  keyListeners.delete("Escape");
                if (keyListeners.get("Esc") === escapeListener)
                  keyListeners.delete("Esc");
              };
              var finishResolve = function(path) {
                cleanupEscapeListener();
                resolve(path);
              };
              var finishReject = function(error) {
                cleanupEscapeListener();
                reject(error);
              };
              keyListeners.set("Escape", escapeListener);
              keyListeners.set("Esc", escapeListener);
              bindUndoRedoButtons(state, function() {
                return finishReject(new Undo2());
              }, function() {
                return finishReject(new Redo());
              });
              renderPathSelectionScreen(state, paths, finishResolve, function(stage) {
                return finishReject(new ReplayStage(stage));
              });
            })];
          });
        });
      };
      MetaGameUI2.prototype.showMessage = function(state, message) {
        return __awaiter14(this, void 0, void 0, function() {
          return __generator14(this, function(_a) {
            console.log("[MetaUI]: ".concat(message));
            return [
              2
              /*return*/
            ];
          });
        });
      };
      MetaGameUI2.prototype.updateBuffer = function(state) {
        updateBufferDisplay(state);
      };
      MetaGameUI2.prototype.playGame = function(spec, gameHistory, gameRedo, macros, viewingMacros, onProgress, undoAtBeginning) {
        if (gameHistory === void 0) {
          gameHistory = [];
        }
        if (gameRedo === void 0) {
          gameRedo = [];
        }
        if (macros === void 0) {
          macros = null;
        }
        if (viewingMacros === void 0) {
          viewingMacros = false;
        }
        if (onProgress === void 0) {
          onProgress = null;
        }
        if (undoAtBeginning === void 0) {
          undoAtBeginning = "leave";
        }
        showScreen("game");
        hideDeckDialog();
        if (spec.metaStage !== void 0) {
          var circle = document.querySelector('#progressLine .progressCircle[data-stage="'.concat(spec.metaStage, '"]'));
          if (circle) {
            var existing = circle.querySelector(".progressScore");
            if (existing)
              existing.remove();
            var score = document.createElement("span");
            score.className = "progressScore";
            score.textContent = "?/".concat(spec.par);
            circle.appendChild(score);
          }
        }
        if (spec.replayStage !== void 0 && spec.replayStage !== null) {
          var replayCircle = document.querySelector('#progressLine .progressCircle[data-stage="'.concat(spec.replayStage, '"]'));
          if (replayCircle)
            replayCircle.classList.add("replaying");
        }
        var deckIcon = getElement2("deckIcon");
        deckIcon.onclick = function() {
          if (isDeckDialogOpen()) {
            hideDeckDialog();
          } else {
            showDeckDialogForSpec(spec);
          }
        };
        getElement2("deckClose").onclick = function() {
          return hideDeckDialog();
        };
        return startGame(spec, gameHistory, gameRedo, macros, viewingMacros, onProgress, undoAtBeginning).catch(function(e) {
          var _a, _b;
          if (e instanceof UndoPastBeginning) {
            var persistence = e.macroPersistence;
            throw new Undo2(e.history, e.redo, (_a = persistence === null || persistence === void 0 ? void 0 : persistence.macros) !== null && _a !== void 0 ? _a : macros, (_b = persistence === null || persistence === void 0 ? void 0 : persistence.viewingMacros) !== null && _b !== void 0 ? _b : viewingMacros);
          }
          throw e;
        });
      };
      return MetaGameUI2;
    })()
  );

  // public/main.js
  var __assign13 = function() {
    __assign13 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign13.apply(this, arguments);
  };
  var __awaiter15 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator15 = function(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __values16 = function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var test = {
    burdens: [
      [1, ["burden", "tax_card"]],
      [1, ["burden", "decay_card"]],
      [1, ["burden", "dull_card"]],
      [1, ["burden", "tax_event"]]
    ]
  };
  var SAVE_STORAGE_KEY = "roguelike.ongoingSaves.v1";
  var RUN_TIMER_STORAGE_KEY = "roguelike.runTimerSeconds.v1";
  var HELP_SEEN_STORAGE_KEY = "roguelike.helpSeen.v1";
  var BURDENS_SETTING_STORAGE_KEY = "roguelike.newGameBurdensEnabled.v1";
  var SCARCITY_SETTING_STORAGE_KEY = "roguelike.newGameScarcityEnabled.v1";
  var CURSES_SETTING_STORAGE_KEY = "roguelike.newGameCursesEnabled.v1";
  var MAX_LAUNCHER_SAVES = 10;
  var runTimerSeconds = 0;
  var activeRunSlotID = null;
  var runTimerIntervalID = null;
  var removeHelpEscapeHandler = null;
  var newGameBurdensEnabled = false;
  var newGameScarcityEnabled = false;
  var newGameCursesEnabled = false;
  var HELP_ITEMS = [
    "Click new game to start a game. You can press escape to return to this screen, and resume games at any time.",
    'There are 8 stages, each involves playing a round of engine-game. You can learn how to play at <a href="https://engine-game.com/tutorial" target="_blank" rel="noopener noreferrer">engine-game.com/tutorial</a>, though some of the cards are different.',
    "Each stage has a par. You start with 10 buffer, and you lose buffer for all energy you go over the par.",
    "Each stage has a random choice of vp card, and a random event that\u2019s added.",
    "The base pars are indicated on the left sidebar. The pars are adjusted based on the random event. You can mouseover the pars on the left side to see how they are calculated.",
    "You can undo freely, including past the start of the game. Undoing only becomes impossible when you get new random information, which happens only when you finish a level or select a path.",
    "You can also click on a completed stage in the left sidebar to replay it and get a better score, which will increase your buffer accordingly. You have to use the same set of potions when you replay a stage, all you can change is getting a lower score.",
    "The final stage has a low par and no boon, so you\u2019ll need to prepare.",
    "You can see the text of cards by hovering over them. If you hold shift you can see the exact rules rather than the simplified text that is displayed by default.",
    "If you shift+click on an item, you will use it 10 times.",
    "You can record macros to replay common sequences of actions, or you can click \u201Csave replay\u201D to record a macro from the beginning of the game to your current state (for example if you want to save your state and experiment with different picks). Right click a macro to delete it.",
    "You can enable any of 3 challenge modes: scarcity (decreases pars by 1), burdens (pick a negative effect each stage), and curses (two stages have a curse that makes them harder)."
  ];
  function loadRunTimerSeconds() {
    try {
      var raw = localStorage.getItem(RUN_TIMER_STORAGE_KEY);
      if (!raw)
        return 0;
      var parsedJSON = JSON.parse(raw);
      if (typeof parsedJSON.elapsedSeconds === "number" && Number.isFinite(parsedJSON.elapsedSeconds) && parsedJSON.elapsedSeconds >= 0) {
        return parsedJSON.elapsedSeconds;
      }
      var parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch (_a) {
      return 0;
    }
  }
  function persistRunTimerSeconds() {
    var payload = {
      slotID: activeRunSlotID,
      elapsedSeconds: runTimerSeconds
    };
    localStorage.setItem(RUN_TIMER_STORAGE_KEY, JSON.stringify(payload));
  }
  function formatRunTimer(totalSeconds) {
    var seconds = totalSeconds % 60;
    var minutesTotal = Math.floor(totalSeconds / 60);
    if (minutesTotal >= 60) {
      var hours = Math.floor(minutesTotal / 60);
      var minutes = minutesTotal % 60;
      return "".concat(hours.toString().padStart(2, "0"), ":").concat(minutes.toString().padStart(2, "0"), ":").concat(seconds.toString().padStart(2, "0"));
    }
    return "".concat(minutesTotal, ":").concat(seconds.toString().padStart(2, "0"));
  }
  function renderRunTimer() {
    var runTimerDisplay = document.getElementById("runTimerDisplay");
    if (!runTimerDisplay)
      return;
    if (activeRunSlotID === null) {
      runTimerDisplay.setAttribute("hidden", "");
      return;
    }
    runTimerDisplay.removeAttribute("hidden");
    var formatted = formatRunTimer(runTimerSeconds);
    runTimerDisplay.textContent = formatted;
  }
  function runTimerActive() {
    return document.visibilityState === "visible" && document.hasFocus();
  }
  function tickRunTimer() {
    if (activeRunSlotID === null || !runTimerActive())
      return;
    runTimerSeconds += 1;
    persistRunTimerSeconds();
    var slots = loadSaveSlots();
    var index = slots.findIndex(function(slot) {
      return slot.id === activeRunSlotID;
    });
    if (index >= 0) {
      slots[index].elapsedSeconds = runTimerSeconds;
      persistSaveSlots(slots);
    }
    renderRunTimer();
  }
  function initRunTimer() {
    runTimerSeconds = loadRunTimerSeconds();
    renderRunTimer();
    if (runTimerIntervalID === null) {
      runTimerIntervalID = window.setInterval(tickRunTimer, 1e3);
    }
    document.addEventListener("visibilitychange", renderRunTimer);
    window.addEventListener("focus", renderRunTimer);
    window.addEventListener("blur", renderRunTimer);
  }
  var summaryMetaUI = {
    chooseCard: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          return [2, null];
        });
      });
    },
    playGame: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          throw new Error("Summary UI does not support playGame");
        });
      });
    },
    waitForChallenge: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          throw new Error("Summary UI does not support waitForChallenge");
        });
      });
    },
    pickPath: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          throw new Error("Summary UI does not support pickPath");
        });
      });
    },
    chooseOption: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          return [2, null];
        });
      });
    },
    showMessage: function() {
      return __awaiter15(void 0, void 0, void 0, function() {
        return __generator15(this, function(_a) {
          return [
            2
            /*return*/
          ];
        });
      });
    },
    updateBuffer: function() {
    }
  };
  function resolveSeedFromURL() {
    var params = new URLSearchParams(window.location.search);
    var urlSeed = (params.get("seed") || "").trim();
    return urlSeed.length > 0 ? urlSeed.toUpperCase() : null;
  }
  function normalizeSeed(seed) {
    return seed.replace(/\s+/g, "").toUpperCase();
  }
  function isDebugGame(snapshot) {
    return snapshot.debugEnabled === true;
  }
  function isBurdensGame(snapshot) {
    return snapshot.burdensEnabled === true;
  }
  function isScarcityGame(snapshot) {
    return snapshot.scarcityEnabled === true;
  }
  function isCursesGame(snapshot) {
    return snapshot.cursesEnabled === true;
  }
  function loadNewGameBurdensEnabled() {
    try {
      return localStorage.getItem(BURDENS_SETTING_STORAGE_KEY) === "1";
    } catch (_a) {
      return false;
    }
  }
  function loadNewGameScarcityEnabled() {
    try {
      return localStorage.getItem(SCARCITY_SETTING_STORAGE_KEY) === "1";
    } catch (_a) {
      return false;
    }
  }
  function loadNewGameCursesEnabled() {
    try {
      return localStorage.getItem(CURSES_SETTING_STORAGE_KEY) === "1";
    } catch (_a) {
      return false;
    }
  }
  function persistNewGameBurdensEnabled() {
    try {
      localStorage.setItem(BURDENS_SETTING_STORAGE_KEY, newGameBurdensEnabled ? "1" : "0");
    } catch (_a) {
    }
  }
  function persistNewGameScarcityEnabled() {
    try {
      localStorage.setItem(SCARCITY_SETTING_STORAGE_KEY, newGameScarcityEnabled ? "1" : "0");
    } catch (_a) {
    }
  }
  function persistNewGameCursesEnabled() {
    try {
      localStorage.setItem(CURSES_SETTING_STORAGE_KEY, newGameCursesEnabled ? "1" : "0");
    } catch (_a) {
    }
  }
  function updateLauncherBurdensTag() {
    var tag = document.getElementById("launcherBurdensTag");
    if (!tag)
      return;
    if (newGameBurdensEnabled) {
      tag.removeAttribute("hidden");
    } else {
      tag.setAttribute("hidden", "");
    }
  }
  function updateLauncherScarcityTag() {
    var tag = document.getElementById("launcherScarcityTag");
    if (!tag)
      return;
    if (newGameScarcityEnabled) {
      tag.removeAttribute("hidden");
    } else {
      tag.setAttribute("hidden", "");
    }
  }
  function updateLauncherCursesTag() {
    var tag = document.getElementById("launcherCursesTag");
    if (!tag)
      return;
    if (newGameCursesEnabled) {
      tag.removeAttribute("hidden");
    } else {
      tag.setAttribute("hidden", "");
    }
  }
  function loadSaveSlots() {
    try {
      var raw = localStorage.getItem(SAVE_STORAGE_KEY);
      if (!raw)
        return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed))
        return [];
      return parsed.filter(function(slot) {
        return slot && typeof slot.id === "string" && slot.snapshot && typeof slot.seed === "string";
      }).map(function(slot) {
        return {
          id: slot.id,
          seed: slot.seed,
          snapshot: slot.snapshot,
          updatedAt: typeof slot.updatedAt === "number" && Number.isFinite(slot.updatedAt) ? slot.updatedAt : 0,
          elapsedSeconds: typeof slot.elapsedSeconds === "number" && Number.isFinite(slot.elapsedSeconds) && slot.elapsedSeconds >= 0 ? slot.elapsedSeconds : 0
        };
      }).sort(function(a2, b) {
        return b.updatedAt - a2.updatedAt;
      });
    } catch (_a) {
      return [];
    }
  }
  function persistSaveSlots(slots) {
    var sorted = slots.sort(function(a2, b) {
      return b.updatedAt - a2.updatedAt;
    });
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(sorted));
  }
  function upsertSaveSlot(id, snapshot, elapsedSeconds) {
    var slots = loadSaveSlots();
    var normalizedElapsed = Number.isFinite(elapsedSeconds) && elapsedSeconds >= 0 ? Math.floor(elapsedSeconds) : 0;
    var updated = {
      id,
      updatedAt: Date.now(),
      seed: snapshot.seed,
      elapsedSeconds: normalizedElapsed,
      snapshot
    };
    var index = slots.findIndex(function(slot) {
      return slot.id === id;
    });
    if (index >= 0) {
      slots[index] = updated;
    } else {
      slots.unshift(updated);
    }
    persistSaveSlots(slots);
  }
  function removeSaveSlot(id) {
    var slots = loadSaveSlots().filter(function(slot) {
      return slot.id !== id;
    });
    persistSaveSlots(slots);
  }
  function removeAllSaveSlots() {
    persistSaveSlots([]);
  }
  function hasSeenHelp() {
    return localStorage.getItem(HELP_SEEN_STORAGE_KEY) === "1";
  }
  function markHelpSeen() {
    localStorage.setItem(HELP_SEEN_STORAGE_KEY, "1");
  }
  function setCoreUIVisible(visible) {
    var e_1, _a;
    var hidden = !visible;
    var ids = [
      "stageScreen",
      "pathSelectionScreen",
      "gameContainer",
      "victoryScreen",
      "gameOverScreen",
      "bufferDisplay",
      "deckIcon",
      "seedDisplay"
    ];
    try {
      for (var ids_1 = __values16(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
        var id = ids_1_1.value;
        var el = document.getElementById(id);
        if (!el)
          continue;
        if (hidden) {
          el.setAttribute("hidden", "");
        } else {
          el.removeAttribute("hidden");
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) _a.call(ids_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }
  function ensureLauncherStyles() {
    if (document.getElementById("saveLauncherStyles"))
      return;
    var style = document.createElement("style");
    style.id = "saveLauncherStyles";
    style.textContent = "\n        #saveLauncher {\n            min-height: 100vh;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: #f6f6f8;\n            color: #222;\n            font-family: system-ui, -apple-system, sans-serif;\n        }\n        #saveLauncherCard {\n            width: min(760px, 92vw);\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 12px;\n            padding: 20px;\n            box-shadow: 0 8px 30px rgba(0,0,0,0.08);\n        }\n        #saveLauncherHeader {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 12px;\n        }\n        .launcherTitleRow {\n            display: flex;\n            align-items: flex-end;\n            gap: 8px;\n        }\n        #saveList {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            margin-top: 14px;\n        }\n        .saveRow {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 10px 12px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            gap: 10px;\n            background: #fcfcfd;\n        }\n        .saveMeta {\n            display: flex;\n            flex-direction: column;\n            gap: 2px;\n        }\n        .saveSeed {\n            font-size: 0.8em;\n            color: #777;\n        }\n        .burdenTag {\n            font-size: 0.8em;\n            color: #3d6fdc;\n            margin-left: 6px;\n        }\n        .scarcityTag {\n            font-size: 0.8em;\n            color: #c53838;\n            margin-left: 6px;\n        }\n        .cursesTag {\n            font-size: 0.8em;\n            color: #2f9f4a;\n            margin-left: 6px;\n        }\n        .saveActions {\n            display: flex;\n            gap: 8px;\n        }\n        .launcherBtn {\n            border: 1px solid #bbb;\n            border-radius: 6px;\n            padding: 6px 10px;\n            background: #fff;\n            cursor: pointer;\n        }\n        .launcherBtn:hover {\n            border-color: #777;\n        }\n        .dangerBtn {\n            border-color: #d33;\n            color: #b11;\n        }\n        #newGameDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n        }\n        #challengeSettingsDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n            z-index: 45;\n        }\n        #challengeSettingsCard {\n            background: #fff;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            min-width: 320px;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        .challengeSettingRow {\n            display: flex;\n            align-items: flex-start;\n            gap: 10px;\n        }\n        .challengeSettingLabel {\n            display: flex;\n            flex-direction: column;\n            gap: 2px;\n        }\n        .challengeSettingHint {\n            font-size: 0.8em;\n            color: #777;\n        }\n        #allSavesDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n            z-index: 45;\n        }\n        #helpDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n            z-index: 46;\n        }\n        #helpCard {\n            width: min(760px, 94vw);\n            max-height: 86vh;\n            overflow-y: auto;\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            box-sizing: border-box;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        #helpList {\n            margin: 0;\n            padding-left: 20px;\n            display: flex;\n            flex-direction: column;\n            gap: 8px;\n            color: #333;\n        }\n        .helpFooter {\n            display: flex;\n            justify-content: flex-start;\n            margin-top: 6px;\n        }\n        .launcherFooter {\n            margin-top: 10px;\n            display: flex;\n            justify-content: flex-end;\n            align-items: center;\n            gap: 8px;\n        }\n        .launcherFooterWithLeft {\n            justify-content: space-between;\n        }\n        #allSavesCard {\n            width: min(900px, 95vw);\n            max-height: 90vh;\n            overflow: hidden;\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            box-sizing: border-box;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        #allSavesList {\n            overflow-y: auto;\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            padding-right: 4px;\n        }\n        #newGameCard {\n            background: white;\n            border-radius: 10px;\n            border: 1px solid #ddd;\n            padding: 16px 28px 16px 16px;\n            width: auto;\n            max-width: 92vw;\n            box-sizing: border-box;\n            overflow: hidden;\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n        }\n        #newGameCard label {\n            font-size: 0.9em;\n            color: #555;\n        }\n        #newGameSeedInput {\n            display: block;\n            font-size: 1.1em;\n            padding: 8px;\n            border: 1px solid #ccc;\n            border-radius: 6px;\n            width: 260px;\n            max-width: 100%;\n            box-sizing: border-box;\n            align-self: flex-start;\n        }\n        #emptySaves {\n            font-size: 0.95em;\n            color: #666;\n            padding: 8px 2px;\n        }\n        .saveFootnote {\n            margin-top: 10px;\n            font-size: 0.85em;\n            color: #777;\n        }\n        .negativeBuffer {\n            color: #b00020;\n            font-weight: 700;\n        }\n        #viewGameDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.3);\n            z-index: 50;\n            padding: 20px 0;\n        }\n        #viewGameCard {\n            width: min(1100px, 96vw);\n            max-height: calc(100vh - 40px);\n            overflow-y: auto;\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            box-sizing: border-box;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        .viewHeader {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 10px;\n        }\n        .viewDeckSection {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 8px;\n            background: #fcfcfd;\n        }\n        .viewDeckTitle {\n            font-weight: 600;\n            margin-bottom: 6px;\n            color: #333;\n        }\n        .viewDeckCards {\n            display: flex;\n            flex-wrap: wrap;\n            gap: 6px;\n        }\n        #viewTimeline {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 8px;\n            background: #fcfcfd;\n            display: flex;\n            flex-direction: column;\n            gap: 6px;\n        }\n        .timelineRow {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 10px;\n            border-bottom: 1px solid #eee;\n            padding: 4px 0;\n        }\n        .timelineText {\n            display: flex;\n            align-items: baseline;\n            gap: 8px;\n            flex-wrap: wrap;\n        }\n        .timelinePrimary {\n            font-size: 0.95em;\n            color: #333;\n        }\n        .timelineSecondary {\n            font-size: 0.82em;\n            color: #777;\n        }\n    ";
    document.head.appendChild(style);
  }
  function runGame(slotID_1, snapshot_1, seed_1) {
    return __awaiter15(this, arguments, void 0, function(slotID, snapshot, seed, newGameDebugEnabled, initialElapsedSeconds, newGameBurdensSetting, newGameScarcitySetting, newGameCursesSetting) {
      var debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled, activeTest, seedDisplay, metaUI, saveCallback, error_1;
      var _a;
      if (newGameDebugEnabled === void 0) {
        newGameDebugEnabled = false;
      }
      if (initialElapsedSeconds === void 0) {
        initialElapsedSeconds = 0;
      }
      if (newGameBurdensSetting === void 0) {
        newGameBurdensSetting = false;
      }
      if (newGameScarcitySetting === void 0) {
        newGameScarcitySetting = false;
      }
      if (newGameCursesSetting === void 0) {
        newGameCursesSetting = false;
      }
      return __generator15(this, function(_b) {
        switch (_b.label) {
          case 0:
            debugEnabled = snapshot ? isDebugGame(snapshot) : newGameDebugEnabled;
            burdensEnabled = snapshot ? isBurdensGame(snapshot) : newGameBurdensSetting;
            scarcityEnabled = snapshot ? isScarcityGame(snapshot) : newGameScarcitySetting;
            cursesEnabled = snapshot ? isCursesGame(snapshot) : newGameCursesSetting;
            activeTest = debugEnabled ? test : null;
            activeRunSlotID = slotID;
            runTimerSeconds = Math.max(0, Math.floor(initialElapsedSeconds));
            persistRunTimerSeconds();
            renderRunTimer();
            seedDisplay = document.getElementById("seedDisplay");
            if (seedDisplay)
              seedDisplay.textContent = "Seed: ".concat(seed);
            setCoreUIVisible(true);
            (_a = document.getElementById("saveLauncher")) === null || _a === void 0 ? void 0 : _a.remove();
            clearLauncherDialogs();
            metaUI = new MetaGameUI();
            saveCallback = function(nextSnapshot) {
              upsertSaveSlot(slotID, nextSnapshot, runTimerSeconds);
            };
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, 4, 5]);
            return [4, playGame2(metaUI, activeTest, seed, snapshot, saveCallback, debugEnabled, burdensEnabled, scarcityEnabled, cursesEnabled)];
          case 2:
            _b.sent();
            return [3, 5];
          case 3:
            error_1 = _b.sent();
            if (error_1 instanceof ExitToLauncher)
              return [
                2
                /*return*/
              ];
            console.error(error_1);
            alert("Failed to load or run this game. You can abandon it from the launcher.");
            return [3, 5];
          case 4:
            activeRunSlotID = null;
            renderRunTimer();
            renderLauncher();
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function clearLauncherDialogs() {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById("newGameDialog")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.getElementById("challengeSettingsDialog")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = document.getElementById("viewGameDialog")) === null || _c === void 0 ? void 0 : _c.remove();
    (_d = document.getElementById("allSavesDialog")) === null || _d === void 0 ? void 0 : _d.remove();
    (_e = document.getElementById("helpDialog")) === null || _e === void 0 ? void 0 : _e.remove();
    if (removeHelpEscapeHandler !== null) {
      removeHelpEscapeHandler();
      removeHelpEscapeHandler = null;
    }
  }
  function openHelpDialog() {
    var e_2, _a;
    clearLauncherDialogs();
    var dialog = document.createElement("div");
    dialog.id = "helpDialog";
    var card = document.createElement("div");
    card.id = "helpCard";
    var title = document.createElement("h3");
    title.style.margin = "0";
    title.textContent = "Help";
    card.appendChild(title);
    var list = document.createElement("ul");
    list.id = "helpList";
    try {
      for (var HELP_ITEMS_1 = __values16(HELP_ITEMS), HELP_ITEMS_1_1 = HELP_ITEMS_1.next(); !HELP_ITEMS_1_1.done; HELP_ITEMS_1_1 = HELP_ITEMS_1.next()) {
        var item = HELP_ITEMS_1_1.value;
        var li = document.createElement("li");
        li.innerHTML = item;
        list.appendChild(li);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (HELP_ITEMS_1_1 && !HELP_ITEMS_1_1.done && (_a = HELP_ITEMS_1.return)) _a.call(HELP_ITEMS_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    card.appendChild(list);
    var footer = document.createElement("div");
    footer.className = "helpFooter";
    var backButton = document.createElement("button");
    backButton.className = "launcherBtn";
    backButton.textContent = "Back";
    var close = function() {
      dialog.remove();
      if (removeHelpEscapeHandler !== null) {
        removeHelpEscapeHandler();
        removeHelpEscapeHandler = null;
      }
    };
    backButton.onclick = close;
    footer.appendChild(backButton);
    card.appendChild(footer);
    dialog.appendChild(card);
    dialog.addEventListener("mousedown", function(e) {
      if (e.target === dialog)
        close();
    });
    var onKeyDown = function(e) {
      if (e.key !== "Escape")
        return;
      e.preventDefault();
      e.stopPropagation();
      close();
    };
    document.addEventListener("keydown", onKeyDown, true);
    removeHelpEscapeHandler = function() {
      return document.removeEventListener("keydown", onKeyDown, true);
    };
    document.body.appendChild(dialog);
  }
  function openChallengesDialog() {
    clearLauncherDialogs();
    var dialog = document.createElement("div");
    dialog.id = "challengeSettingsDialog";
    var card = document.createElement("div");
    card.id = "challengeSettingsCard";
    var title = document.createElement("h3");
    title.style.margin = "0";
    title.textContent = "Challenges";
    card.appendChild(title);
    var row = document.createElement("label");
    row.className = "challengeSettingRow";
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = newGameBurdensEnabled;
    checkbox.onchange = function() {
      newGameBurdensEnabled = checkbox.checked;
      persistNewGameBurdensEnabled();
      updateLauncherBurdensTag();
    };
    var label = document.createElement("div");
    label.className = "challengeSettingLabel";
    var name = document.createElement("span");
    name.textContent = "Burdens";
    var hint = document.createElement("span");
    hint.className = "challengeSettingHint";
    hint.textContent = "Add a mandatory burden in each round after the first.";
    label.appendChild(name);
    label.appendChild(hint);
    row.appendChild(checkbox);
    row.appendChild(label);
    card.appendChild(row);
    var scarcityRow = document.createElement("label");
    scarcityRow.className = "challengeSettingRow";
    var scarcityCheckbox = document.createElement("input");
    scarcityCheckbox.type = "checkbox";
    scarcityCheckbox.checked = newGameScarcityEnabled;
    scarcityCheckbox.onchange = function() {
      newGameScarcityEnabled = scarcityCheckbox.checked;
      persistNewGameScarcityEnabled();
      updateLauncherScarcityTag();
    };
    var scarcityLabel = document.createElement("div");
    scarcityLabel.className = "challengeSettingLabel";
    var scarcityName = document.createElement("span");
    scarcityName.textContent = "Scarcity";
    var scarcityHint = document.createElement("span");
    scarcityHint.className = "challengeSettingHint";
    scarcityHint.textContent = "Reduce par by 1 on every stage.";
    scarcityLabel.appendChild(scarcityName);
    scarcityLabel.appendChild(scarcityHint);
    scarcityRow.appendChild(scarcityCheckbox);
    scarcityRow.appendChild(scarcityLabel);
    card.appendChild(scarcityRow);
    var cursesRow = document.createElement("label");
    cursesRow.className = "challengeSettingRow";
    var cursesCheckbox = document.createElement("input");
    cursesCheckbox.type = "checkbox";
    cursesCheckbox.checked = newGameCursesEnabled;
    cursesCheckbox.onchange = function() {
      newGameCursesEnabled = cursesCheckbox.checked;
      persistNewGameCursesEnabled();
      updateLauncherCursesTag();
    };
    var cursesLabel = document.createElement("div");
    cursesLabel.className = "challengeSettingLabel";
    var cursesName = document.createElement("span");
    cursesName.textContent = "Curses";
    var cursesHint = document.createElement("span");
    cursesHint.className = "challengeSettingHint";
    cursesHint.textContent = "Add a minor curse on stage 4 and a major curse on stage 7.";
    cursesLabel.appendChild(cursesName);
    cursesLabel.appendChild(cursesHint);
    cursesRow.appendChild(cursesCheckbox);
    cursesRow.appendChild(cursesLabel);
    card.appendChild(cursesRow);
    var actions = document.createElement("div");
    actions.className = "saveActions";
    var close = document.createElement("button");
    close.className = "launcherBtn";
    close.textContent = "Close";
    close.onclick = function() {
      return dialog.remove();
    };
    actions.appendChild(close);
    card.appendChild(actions);
    dialog.appendChild(card);
    dialog.addEventListener("mousedown", function(event) {
      if (event.target === dialog)
        dialog.remove();
    });
    document.body.appendChild(dialog);
  }
  function runReplayFromSnapshot(slot, stage) {
    return __awaiter15(this, void 0, void 0, function() {
      var seedDisplay, state, replayData, bufferDisplay, debugTag, error_2;
      var _a;
      return __generator15(this, function(_b) {
        switch (_b.label) {
          case 0:
            seedDisplay = document.getElementById("seedDisplay");
            if (seedDisplay)
              seedDisplay.textContent = "Seed: ".concat(slot.seed);
            setCoreUIVisible(true);
            (_a = document.getElementById("saveLauncher")) === null || _a === void 0 ? void 0 : _a.remove();
            clearLauncherDialogs();
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, 4, 5]);
            state = deserializeMetaGame(summaryMetaUI, slot.snapshot, null);
            replayData = state.data.stageReplays[stage];
            if (!replayData) {
              alert("No replay available for that stage.");
              return [
                2
                /*return*/
              ];
            }
            bufferDisplay = document.getElementById("bufferDisplay");
            if (bufferDisplay) {
              debugTag = state.debugEnabled ? " [Debug]" : "";
              setBufferDisplayText("Buffer: ".concat(replayData.bufferBeforeCourse).concat(debugTag));
            }
            return [4, startGame(replaySpecForStage(state, replayData), replayData.history, [], state.global.macros, state.global.viewingMacros, null, "nothing")];
          case 2:
            _b.sent();
            return [3, 5];
          case 3:
            error_2 = _b.sent();
            if (!(error_2 instanceof UndoPastBeginning)) {
              console.error(error_2);
              alert("Failed to open replay.");
            }
            return [3, 5];
          case 4:
            renderLauncher();
            openViewDialog(slot);
            return [
              7
              /*endfinally*/
            ];
          case 5:
            return [
              2
              /*return*/
            ];
        }
      });
    });
  }
  function timelineRowContent(entry, stageScores, stagePars) {
    var _a, _b;
    if (entry.kind === "stage") {
      var score = (_a = stageScores[entry.stage]) !== null && _a !== void 0 ? _a : entry.score;
      var par = (_b = stagePars[entry.stage]) !== null && _b !== void 0 ? _b : entry.par;
      var usedText = entry.usedPotions && entry.usedPotions.length > 0 ? entry.usedPotions.map(function(name) {
        return "used ".concat(name);
      }).join(", ") : null;
      return {
        primary: "Stage ".concat(entry.stage + 1, ": ").concat(entry.challenge, " \u2022 Score ").concat(score, "/").concat(par),
        secondary: usedText
      };
    }
    if (entry.kind === "action") {
      var secondaryParts_1 = [];
      if (entry.details)
        secondaryParts_1.push(entry.details);
      if (entry.skipped && entry.skipped.length > 0) {
        secondaryParts_1.push("Skipped: ".concat(entry.skipped.join(", ")));
      }
      return {
        primary: "Stage ".concat(entry.stage + 1, ": ").concat(entry.action),
        secondary: secondaryParts_1.length > 0 ? secondaryParts_1.join(" \u2022 ") : null
      };
    }
    var secondaryParts = [];
    if (entry.details)
      secondaryParts.push(entry.details);
    if (entry.skipped && entry.skipped.length > 0) {
      secondaryParts.push("Skipped: ".concat(entry.skipped.join(", ")));
    }
    return {
      primary: "Stage ".concat(entry.stage + 1, ": Added ").concat(entry.name),
      secondary: secondaryParts.length > 0 ? secondaryParts.join(" \u2022 ") : null
    };
  }
  function renderDeckSection(title, specs) {
    var e_3, _a;
    var section = document.createElement("div");
    section.className = "viewDeckSection";
    var heading = document.createElement("div");
    heading.className = "viewDeckTitle";
    heading.textContent = title;
    section.appendChild(heading);
    var cards = document.createElement("div");
    cards.className = "viewDeckCards";
    if (specs.length === 0) {
      var empty = document.createElement("div");
      empty.className = "saveSeed";
      empty.textContent = "None";
      cards.appendChild(empty);
    } else {
      try {
        for (var specs_1 = __values16(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
          var spec = specs_1_1.value;
          var wrap = document.createElement("div");
          wrap.innerHTML = renderSpecNoRelated(spec);
          cards.appendChild(wrap.firstElementChild);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
    }
    section.appendChild(cards);
    return section;
  }
  function openViewDialog(slot) {
    var e_4, _a;
    var _this = this;
    clearLauncherDialogs();
    var state;
    try {
      state = deserializeMetaGame(summaryMetaUI, slot.snapshot, null);
    } catch (error) {
      console.error(error);
      alert("Failed to load summary for this game.");
      return;
    }
    var dialog = document.createElement("div");
    dialog.id = "viewGameDialog";
    var card = document.createElement("div");
    card.id = "viewGameCard";
    var header = document.createElement("div");
    header.className = "viewHeader";
    var title = document.createElement("h3");
    title.style.margin = "0";
    title.textContent = "Game Summary";
    var close = document.createElement("button");
    close.className = "launcherBtn";
    close.textContent = "Close";
    close.onclick = function() {
      return dialog.remove();
    };
    header.appendChild(title);
    header.appendChild(close);
    card.appendChild(header);
    var status = document.createElement("div");
    var done = state.data.phase === "game_over" || state.data.stage >= 8;
    var statusDebugTag = state.debugEnabled ? " [Debug]" : "";
    status.textContent = "".concat(done ? "Victory!" : "Stage ".concat(state.data.stage + 1), " \u2022 Buffer ").concat(state.data.buffer).concat(statusDebugTag, " \u2022 Seed ").concat(slot.seed);
    if (isBurdensGame(slot.snapshot)) {
      var burdenTag = document.createElement("span");
      burdenTag.className = "burdenTag";
      burdenTag.textContent = "(burdens)";
      status.appendChild(burdenTag);
    }
    if (isScarcityGame(slot.snapshot)) {
      var scarcityTag = document.createElement("span");
      scarcityTag.className = "scarcityTag";
      scarcityTag.textContent = "(scarcity)";
      status.appendChild(scarcityTag);
    }
    if (isCursesGame(slot.snapshot)) {
      var cursesTag = document.createElement("span");
      cursesTag.className = "cursesTag";
      cursesTag.textContent = "(curses)";
      status.appendChild(cursesTag);
    }
    if (state.data.buffer < 0)
      status.className = "negativeBuffer";
    card.appendChild(status);
    var relicDisplaySpecs = state.data.relics.map(function(relic) {
      var charges = relic.count("charge");
      if (charges > 0) {
        return __assign13(__assign13({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(charges, ")") });
      }
      return relic.spec;
    });
    card.appendChild(renderDeckSection("Cards", state.data.collectedCards));
    card.appendChild(renderDeckSection("Events", state.data.collectedEvents));
    card.appendChild(renderDeckSection("Potions", state.data.potions.map(function(p) {
      return p.spec;
    })));
    card.appendChild(renderDeckSection("Relics", relicDisplaySpecs));
    var timelineTitle = document.createElement("div");
    timelineTitle.className = "viewDeckTitle";
    timelineTitle.textContent = "Timeline";
    card.appendChild(timelineTitle);
    var timeline = document.createElement("div");
    timeline.id = "viewTimeline";
    if (state.data.timeline.length === 0) {
      var empty = document.createElement("div");
      empty.className = "saveSeed";
      empty.textContent = "No events recorded yet.";
      timeline.appendChild(empty);
    } else {
      var _loop_1 = function(entry2) {
        var row = document.createElement("div");
        row.className = "timelineRow";
        var text = document.createElement("div");
        text.className = "timelineText";
        var content = timelineRowContent(entry2, state.data.stageScores, state.data.stagePars);
        var primary = document.createElement("span");
        primary.className = "timelinePrimary";
        primary.textContent = content.primary;
        text.appendChild(primary);
        if (content.secondary) {
          var secondary = document.createElement("span");
          secondary.className = "timelineSecondary";
          secondary.textContent = content.secondary;
          text.appendChild(secondary);
        }
        row.appendChild(text);
        if (entry2.kind === "stage" && state.data.stageReplays[entry2.stage] !== null) {
          var replayButton = document.createElement("button");
          replayButton.className = "launcherBtn";
          replayButton.textContent = "View replay";
          replayButton.onclick = function() {
            return __awaiter15(_this, void 0, void 0, function() {
              return __generator15(this, function(_a2) {
                switch (_a2.label) {
                  case 0:
                    dialog.remove();
                    return [4, runReplayFromSnapshot(slot, entry2.stage)];
                  case 1:
                    _a2.sent();
                    return [
                      2
                      /*return*/
                    ];
                }
              });
            });
          };
          row.appendChild(replayButton);
        }
        timeline.appendChild(row);
      };
      try {
        for (var _b = __values16(state.data.timeline), _c = _b.next(); !_c.done; _c = _b.next()) {
          var entry = _c.value;
          _loop_1(entry);
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
    }
    card.appendChild(timeline);
    dialog.appendChild(card);
    dialog.addEventListener("mousedown", function(e) {
      if (e.target === dialog)
        dialog.remove();
    });
    document.body.appendChild(dialog);
  }
  function createSaveRow(slot, onAbandon) {
    var _this = this;
    var row = document.createElement("div");
    row.className = "saveRow";
    var meta = document.createElement("div");
    meta.className = "saveMeta";
    var primary = document.createElement("div");
    var done = slot.snapshot.data.phase === "game_over" || slot.snapshot.data.stage >= 8;
    var debugTag = isDebugGame(slot.snapshot) ? " [Debug]" : "";
    primary.textContent = done ? "Victory! \u2022 Buffer ".concat(slot.snapshot.data.buffer).concat(debugTag) : "Stage ".concat(slot.snapshot.data.stage + 1, " \u2022 Buffer ").concat(slot.snapshot.data.buffer).concat(debugTag);
    if (isBurdensGame(slot.snapshot)) {
      var burdenTag = document.createElement("span");
      burdenTag.className = "burdenTag";
      burdenTag.textContent = "(burdens)";
      primary.appendChild(burdenTag);
    }
    if (isScarcityGame(slot.snapshot)) {
      var scarcityTag = document.createElement("span");
      scarcityTag.className = "scarcityTag";
      scarcityTag.textContent = "(scarcity)";
      primary.appendChild(scarcityTag);
    }
    if (isCursesGame(slot.snapshot)) {
      var cursesTag = document.createElement("span");
      cursesTag.className = "cursesTag";
      cursesTag.textContent = "(curses)";
      primary.appendChild(cursesTag);
    }
    if (slot.snapshot.data.buffer < 0) {
      primary.className = "negativeBuffer";
    }
    var seedLine = document.createElement("div");
    seedLine.className = "saveSeed";
    seedLine.textContent = "Seed: ".concat(slot.seed, " \u2022 ").concat(formatRunTimer(slot.elapsedSeconds));
    meta.appendChild(primary);
    meta.appendChild(seedLine);
    var actions = document.createElement("div");
    actions.className = "saveActions";
    if (!done) {
      var continueButton = document.createElement("button");
      continueButton.className = "launcherBtn";
      continueButton.textContent = "Continue";
      continueButton.onclick = function() {
        return __awaiter15(_this, void 0, void 0, function() {
          return __generator15(this, function(_a) {
            return [2, runGame(slot.id, slot.snapshot, slot.seed, false, slot.elapsedSeconds)];
          });
        });
      };
      actions.appendChild(continueButton);
    }
    var viewButton = document.createElement("button");
    viewButton.className = "launcherBtn";
    viewButton.textContent = "View";
    viewButton.onclick = function() {
      return openViewDialog(slot);
    };
    var abandonButton = document.createElement("button");
    abandonButton.className = "launcherBtn dangerBtn";
    abandonButton.textContent = "Abandon";
    abandonButton.onclick = onAbandon;
    actions.appendChild(viewButton);
    actions.appendChild(abandonButton);
    row.appendChild(meta);
    row.appendChild(actions);
    return row;
  }
  function openAllSavesDialog() {
    var e_5, _a;
    clearLauncherDialogs();
    var slots = loadSaveSlots();
    var dialog = document.createElement("div");
    dialog.id = "allSavesDialog";
    var card = document.createElement("div");
    card.id = "allSavesCard";
    var header = document.createElement("div");
    header.className = "viewHeader";
    var title = document.createElement("h3");
    title.style.margin = "0";
    title.textContent = "All Saved Games (".concat(slots.length, ")");
    var headerActions = document.createElement("div");
    headerActions.className = "saveActions";
    var deleteAll = document.createElement("button");
    deleteAll.className = "launcherBtn dangerBtn";
    deleteAll.textContent = "Delete all games";
    deleteAll.onclick = function() {
      if (!window.confirm("Really delete all of your games?"))
        return;
      removeAllSaveSlots();
      dialog.remove();
      renderLauncher();
    };
    var close = document.createElement("button");
    close.className = "launcherBtn";
    close.textContent = "Close";
    close.onclick = function() {
      return dialog.remove();
    };
    headerActions.appendChild(deleteAll);
    headerActions.appendChild(close);
    header.appendChild(title);
    header.appendChild(headerActions);
    card.appendChild(header);
    var list = document.createElement("div");
    list.id = "allSavesList";
    if (slots.length === 0) {
      var empty = document.createElement("div");
      empty.className = "saveSeed";
      empty.textContent = "No saved games.";
      list.appendChild(empty);
    } else {
      var _loop_2 = function(slot2) {
        list.appendChild(createSaveRow(slot2, function() {
          removeSaveSlot(slot2.id);
          dialog.remove();
          renderLauncher();
          openAllSavesDialog();
        }));
      };
      try {
        for (var slots_1 = __values16(slots), slots_1_1 = slots_1.next(); !slots_1_1.done; slots_1_1 = slots_1.next()) {
          var slot = slots_1_1.value;
          _loop_2(slot);
        }
      } catch (e_5_1) {
        e_5 = { error: e_5_1 };
      } finally {
        try {
          if (slots_1_1 && !slots_1_1.done && (_a = slots_1.return)) _a.call(slots_1);
        } finally {
          if (e_5) throw e_5.error;
        }
      }
    }
    card.appendChild(list);
    dialog.appendChild(card);
    dialog.addEventListener("mousedown", function(e) {
      if (e.target === dialog)
        dialog.remove();
    });
    document.body.appendChild(dialog);
  }
  function renderLauncher() {
    var e_6, _a;
    var _this = this;
    var _b;
    ensureLauncherStyles();
    setCoreUIVisible(false);
    (_b = document.getElementById("saveLauncher")) === null || _b === void 0 ? void 0 : _b.remove();
    clearLauncherDialogs();
    var root = document.createElement("div");
    root.id = "saveLauncher";
    var card = document.createElement("div");
    card.id = "saveLauncherCard";
    var header = document.createElement("div");
    header.id = "saveLauncherHeader";
    var titleRow = document.createElement("div");
    titleRow.className = "launcherTitleRow";
    var title = document.createElement("h2");
    title.textContent = "engine-roguelike";
    title.style.margin = "0";
    var burdenTag = document.createElement("span");
    burdenTag.id = "launcherBurdensTag";
    burdenTag.className = "burdenTag";
    burdenTag.textContent = "(burdens)";
    if (!newGameBurdensEnabled) {
      burdenTag.setAttribute("hidden", "");
    }
    var scarcityTag = document.createElement("span");
    scarcityTag.id = "launcherScarcityTag";
    scarcityTag.className = "scarcityTag";
    scarcityTag.textContent = "(scarcity)";
    if (!newGameScarcityEnabled) {
      scarcityTag.setAttribute("hidden", "");
    }
    var cursesTag = document.createElement("span");
    cursesTag.id = "launcherCursesTag";
    cursesTag.className = "cursesTag";
    cursesTag.textContent = "(curses)";
    if (!newGameCursesEnabled) {
      cursesTag.setAttribute("hidden", "");
    }
    titleRow.appendChild(title);
    titleRow.appendChild(burdenTag);
    titleRow.appendChild(scarcityTag);
    titleRow.appendChild(cursesTag);
    var headerActions = document.createElement("div");
    headerActions.className = "saveActions";
    var newButton = document.createElement("button");
    newButton.className = "launcherBtn";
    newButton.textContent = "new game";
    newButton.onclick = function(event) {
      var debugNewGame = event.shiftKey;
      clearLauncherDialogs();
      var dialog = document.createElement("div");
      dialog.id = "newGameDialog";
      var dialogCard = document.createElement("div");
      dialogCard.id = "newGameCard";
      var label = document.createElement("label");
      label.htmlFor = "newGameSeedInput";
      label.textContent = "Seed:";
      var seedInput = document.createElement("input");
      seedInput.id = "newGameSeedInput";
      seedInput.value = normalizeSeed(resolveSeedFromURL() || randomString());
      seedInput.autocomplete = "off";
      seedInput.addEventListener("input", function() {
        var normalized = normalizeSeed(seedInput.value);
        if (seedInput.value !== normalized) {
          seedInput.value = normalized;
        }
      });
      var actions = document.createElement("div");
      actions.className = "saveActions";
      var startButton = document.createElement("button");
      startButton.className = "launcherBtn";
      startButton.textContent = "start";
      var startNewGame = function() {
        return __awaiter15(_this, void 0, void 0, function() {
          var seed, slotID;
          return __generator15(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                seed = normalizeSeed(seedInput.value) || randomString();
                slotID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * 1e6));
                return [4, runGame(slotID, null, seed, debugNewGame, 0, newGameBurdensEnabled, newGameScarcityEnabled, newGameCursesEnabled)];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      };
      startButton.onclick = startNewGame;
      seedInput.addEventListener("keydown", function(event2) {
        return __awaiter15(_this, void 0, void 0, function() {
          return __generator15(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (event2.key !== "Enter")
                  return [
                    2
                    /*return*/
                  ];
                event2.preventDefault();
                return [4, startNewGame()];
              case 1:
                _a2.sent();
                return [
                  2
                  /*return*/
                ];
            }
          });
        });
      });
      var cancelButton = document.createElement("button");
      cancelButton.className = "launcherBtn";
      cancelButton.textContent = "Cancel";
      cancelButton.onclick = function() {
        return dialog.remove();
      };
      actions.appendChild(startButton);
      actions.appendChild(cancelButton);
      dialogCard.appendChild(label);
      dialogCard.appendChild(seedInput);
      dialogCard.appendChild(actions);
      dialog.appendChild(dialogCard);
      dialog.addEventListener("mousedown", function(e) {
        if (e.target === dialog)
          dialog.remove();
      });
      document.body.appendChild(dialog);
      seedInput.focus();
      seedInput.select();
    };
    headerActions.appendChild(newButton);
    header.appendChild(titleRow);
    header.appendChild(headerActions);
    card.appendChild(header);
    var list = document.createElement("div");
    list.id = "saveList";
    var allSlots = loadSaveSlots();
    var slots = allSlots.slice(0, MAX_LAUNCHER_SAVES);
    if (slots.length === 0) {
      var empty = document.createElement("div");
      empty.id = "emptySaves";
      empty.textContent = "No saved games.";
      list.appendChild(empty);
    } else {
      var _loop_3 = function(slot2) {
        list.appendChild(createSaveRow(slot2, function() {
          removeSaveSlot(slot2.id);
          renderLauncher();
        }));
      };
      try {
        for (var slots_2 = __values16(slots), slots_2_1 = slots_2.next(); !slots_2_1.done; slots_2_1 = slots_2.next()) {
          var slot = slots_2_1.value;
          _loop_3(slot);
        }
      } catch (e_6_1) {
        e_6 = { error: e_6_1 };
      } finally {
        try {
          if (slots_2_1 && !slots_2_1.done && (_a = slots_2.return)) _a.call(slots_2);
        } finally {
          if (e_6) throw e_6.error;
        }
      }
    }
    card.appendChild(list);
    var footerActions = document.createElement("div");
    footerActions.className = "launcherFooter";
    if (allSlots.length > MAX_LAUNCHER_SAVES) {
      var footnote = document.createElement("div");
      footnote.className = "saveFootnote";
      footnote.textContent = "Showing latest ".concat(MAX_LAUNCHER_SAVES, " of ").concat(allSlots.length, " saved games.");
      card.appendChild(footnote);
      footerActions.classList.add("launcherFooterWithLeft");
      var showAllButton = document.createElement("button");
      showAllButton.className = "launcherBtn";
      showAllButton.textContent = "Show all";
      showAllButton.onclick = function() {
        return openAllSavesDialog();
      };
      footerActions.appendChild(showAllButton);
    }
    var challengesButton = document.createElement("button");
    challengesButton.className = "launcherBtn";
    challengesButton.textContent = "Challenges";
    challengesButton.onclick = function() {
      return openChallengesDialog();
    };
    footerActions.appendChild(challengesButton);
    var helpButton = document.createElement("button");
    helpButton.className = "launcherBtn";
    helpButton.textContent = "Help";
    helpButton.onclick = function() {
      markHelpSeen();
      openHelpDialog();
    };
    footerActions.appendChild(helpButton);
    card.appendChild(footerActions);
    root.appendChild(card);
    document.body.appendChild(root);
    updateLauncherBurdensTag();
    updateLauncherScarcityTag();
    updateLauncherCursesTag();
    if (!hasSeenHelp()) {
      markHelpSeen();
      openHelpDialog();
    }
  }
  window.addEventListener("load", function() {
    return __awaiter15(void 0, void 0, void 0, function() {
      return __generator15(this, function(_a) {
        newGameBurdensEnabled = loadNewGameBurdensEnabled();
        newGameScarcityEnabled = loadNewGameScarcityEnabled();
        newGameCursesEnabled = loadNewGameCursesEnabled();
        initRunTimer();
        renderLauncher();
        return [
          2
          /*return*/
        ];
      });
    });
  });
})();
