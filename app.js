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
  function appendUpgrades(base, upgrades, getter) {
    var e_1, _a;
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
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (upgrades_1_1 && !upgrades_1_1.done && (_a = upgrades_1.return)) _a.call(upgrades_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return result;
  }
  function displayName(spec) {
    var e_2, _a;
    var name = spec.name;
    try {
      for (var _b = __values(spec.upgrades || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var upgrade = _c.value;
        if (upgrade.name) {
          name = upgrade.name(name);
        }
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
    return name;
  }
  function cardSpecEffects(spec) {
    return appendUpgrades(spec.effects, spec.upgrades, function(upgrade) {
      return upgrade.effects;
    });
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
    var e_3, _a;
    var result = cost;
    try {
      for (var _b = __values(spec.upgrades || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var upgrade = _c.value;
        if (upgrade.cost) {
          result = upgrade.cost(result, kind);
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
        var e_4, _a;
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
                      var _a2, _b2, _c2, effect, e_5_1, _d, _e, effect, e_6_1;
                      var e_5, _f, e_6, _g;
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
                            e_5_1 = _h.sent();
                            e_5 = { error: e_5_1 };
                            return [3, 9];
                          case 8:
                            try {
                              if (_c2 && !_c2.done && (_f = _b2.return)) _f.call(_b2);
                            } finally {
                              if (e_5) throw e_5.error;
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
                            e_6_1 = _h.sent();
                            e_6 = { error: e_6_1 };
                            return [3, 17];
                          case 16:
                            try {
                              if (_e && !_e.done && (_g = _d.return)) _g.call(_d);
                            } finally {
                              if (e_6) throw e_6.error;
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
      Card2.prototype.available = function(kind, state) {
        var e_7, _a;
        if (kind == "activate" && this.spec.ability === void 0)
          return false;
        try {
          for (var _b = __values(this.restrictions()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var restriction = _c.value;
            if (restriction.test(this, state, kind))
              return false;
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
        return canPay(this.cost(kind, state), state);
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
    var e_8, _a;
    var result = {};
    try {
      for (var allCostResources_1 = __values(allCostResources), allCostResources_1_1 = allCostResources_1.next(); !allCostResources_1_1.done; allCostResources_1_1 = allCostResources_1.next()) {
        var resource = allCostResources_1_1.value;
        var r = c[resource];
        if (r != void 0)
          result[resource] = n * r;
      }
    } catch (e_8_1) {
      e_8 = { error: e_8_1 };
    } finally {
      try {
        if (allCostResources_1_1 && !allCostResources_1_1.done && (_a = allCostResources_1.return)) _a.call(allCostResources_1);
      } finally {
        if (e_8) throw e_8.error;
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
        var e_9, _a;
        var result = [];
        try {
          for (var _b = __values(this.resolving), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            if (c.kind == "card")
              result.push(c);
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
        var e_10, _a;
        var newZones = /* @__PURE__ */ new Map();
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_1 = _d[0], zone = _d[1];
            newZones.set(name_1, zone.filter(function(c) {
              return c.id != card.id;
            }));
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
        return this.update({ zones: newZones, resolving: this.resolving.filter(function(c) {
          return c.id != card.id;
        }) });
      };
      State2.prototype.apply = function(f, card) {
        var e_11, _a;
        var newZones = /* @__PURE__ */ new Map();
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_2 = _d[0], zone = _d[1];
            newZones.set(name_2, zone.map(function(c) {
              return c.id == card.id ? f(c) : c;
            }));
          }
        } catch (e_11_1) {
          e_11 = { error: e_11_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_11) throw e_11.error;
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
        var e_12, _a, e_13, _b, e_14, _c;
        var byId = /* @__PURE__ */ new Map();
        try {
          for (var _d = __values(this.zones), _e = _d.next(); !_e.done; _e = _d.next()) {
            var _f = __read(_e.value, 2), name_3 = _f[0], zone = _f[1];
            try {
              for (var zone_1 = (e_13 = void 0, __values(zone)), zone_1_1 = zone_1.next(); !zone_1_1.done; zone_1_1 = zone_1.next()) {
                var card = zone_1_1.value;
                byId.set(card.id, card);
              }
            } catch (e_13_1) {
              e_13 = { error: e_13_1 };
            } finally {
              try {
                if (zone_1_1 && !zone_1_1.done && (_b = zone_1.return)) _b.call(zone_1);
              } finally {
                if (e_13) throw e_13.error;
              }
            }
          }
        } catch (e_12_1) {
          e_12 = { error: e_12_1 };
        } finally {
          try {
            if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
          } finally {
            if (e_12) throw e_12.error;
          }
        }
        try {
          for (var _g = __values(this.resolving), _h = _g.next(); !_h.done; _h = _g.next()) {
            var card = _h.value;
            if (card.kind == "card") {
              byId.set(card.id, card);
            }
          }
        } catch (e_14_1) {
          e_14 = { error: e_14_1 };
        } finally {
          try {
            if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
          } finally {
            if (e_14) throw e_14.error;
          }
        }
        return byId;
      };
      State2.prototype.find = function(card) {
        var e_15, _a;
        try {
          for (var _b = __values(this.zones), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), name_4 = _d[0], zone_2 = _d[1];
            var matches_1 = zone_2.filter(function(c) {
              return c.id == card.id;
            });
            if (matches_1.length > 0)
              return matches_1[0];
          }
        } catch (e_15_1) {
          e_15 = { error: e_15_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_15) throw e_15.error;
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
        var initialState2, rules_1, rules_1_1, rule, ruleCard, _a, _b, rawTrigger, trigger_1, e_16_1, e_17_1, triggers, _c, _d, card, _e, _f, trigger_2, _g, _h, card, _j, _k, trigger_3, triggers_1, triggers_1_1, _l, card, rawTrigger, trigger_4, e_18_1;
        var e_17, _m, e_16, _o, e_19, _p, e_20, _q, e_21, _r, e_22, _s, e_18, _t;
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
              _a = (e_16 = void 0, __values(rule.triggers)), _b = _a.next();
              _u.label = 4;
            case 4:
              if (!!_b.done) return [3, 7];
              rawTrigger = _b.value;
              if (!(rawTrigger.kind == e.kind)) return [3, 6];
              trigger_1 = rawTrigger;
              if (!(trigger_1.handles(e, initialState2, null) && trigger_1.handles(e, state, null))) return [3, 6];
              state = state.log("Triggering ".concat(rule.name, " rule"));
              return [4, withTracking(trigger_1.transform(e, state, null), { kind: "trigger", trigger: trigger_1, card: ruleCard })(state)];
            case 5:
              state = _u.sent();
              _u.label = 6;
            case 6:
              _b = _a.next();
              return [3, 4];
            case 7:
              return [3, 10];
            case 8:
              e_16_1 = _u.sent();
              e_16 = { error: e_16_1 };
              return [3, 10];
            case 9:
              try {
                if (_b && !_b.done && (_o = _a.return)) _o.call(_a);
              } finally {
                if (e_16) throw e_16.error;
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
              e_17_1 = _u.sent();
              e_17 = { error: e_17_1 };
              return [3, 14];
            case 13:
              try {
                if (rules_1_1 && !rules_1_1.done && (_m = rules_1.return)) _m.call(rules_1);
              } finally {
                if (e_17) throw e_17.error;
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
                    for (_e = (e_20 = void 0, __values(card.staticTriggers())), _f = _e.next(); !_f.done; _f = _e.next()) {
                      trigger_2 = _f.value;
                      triggers.push([card, trigger_2]);
                    }
                  } catch (e_20_1) {
                    e_20 = { error: e_20_1 };
                  } finally {
                    try {
                      if (_f && !_f.done && (_q = _e.return)) _q.call(_e);
                    } finally {
                      if (e_20) throw e_20.error;
                    }
                  }
                }
              } catch (e_19_1) {
                e_19 = { error: e_19_1 };
              } finally {
                try {
                  if (_d && !_d.done && (_p = _c.return)) _p.call(_c);
                } finally {
                  if (e_19) throw e_19.error;
                }
              }
              try {
                for (_g = __values(state.play.concat(state.relics)), _h = _g.next(); !_h.done; _h = _g.next()) {
                  card = _h.value;
                  try {
                    for (_j = (e_22 = void 0, __values(card.triggers())), _k = _j.next(); !_k.done; _k = _j.next()) {
                      trigger_3 = _k.value;
                      triggers.push([card, trigger_3]);
                    }
                  } catch (e_22_1) {
                    e_22 = { error: e_22_1 };
                  } finally {
                    try {
                      if (_k && !_k.done && (_s = _j.return)) _s.call(_j);
                    } finally {
                      if (e_22) throw e_22.error;
                    }
                  }
                }
              } catch (e_21_1) {
                e_21 = { error: e_21_1 };
              } finally {
                try {
                  if (_h && !_h.done && (_r = _g.return)) _r.call(_g);
                } finally {
                  if (e_21) throw e_21.error;
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
              trigger_4 = rawTrigger;
              if (!(trigger_4.handles(e, initialState2, card) && trigger_4.handles(e, state, card))) return [3, 18];
              state = state.log("Triggering ".concat(card));
              return [4, withTracking(trigger_4.transform(e, state, card), { kind: "trigger", trigger: trigger_4, card })(state)];
            case 17:
              state = _u.sent();
              _u.label = 18;
            case 18:
              triggers_1_1 = triggers_1.next();
              return [3, 16];
            case 19:
              return [3, 22];
            case 20:
              e_18_1 = _u.sent();
              e_18 = { error: e_18_1 };
              return [3, 22];
            case 21:
              try {
                if (triggers_1_1 && !triggers_1_1.done && (_t = triggers_1.return)) _t.call(triggers_1);
              } finally {
                if (e_18) throw e_18.error;
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
    var e_23, _a, e_24, _b, e_25, _c, e_26, _d, e_27, _e, e_28, _f, e_29, _g;
    try {
      for (var rules_2 = __values(rules), rules_2_1 = rules_2.next(); !rules_2_1.done; rules_2_1 = rules_2.next()) {
        var rule = rules_2_1.value;
        if (rule.replacers) {
          try {
            for (var _h = (e_24 = void 0, __values(rule.replacers)), _j = _h.next(); !_j.done; _j = _h.next()) {
              var rawReplacer = _j.value;
              if (rawReplacer.kind == x.kind) {
                var replacer = rawReplacer;
                if (replacer.handles(x, state, rule)) {
                  x = replacer.replace(x, state, rule);
                }
              }
            }
          } catch (e_24_1) {
            e_24 = { error: e_24_1 };
          } finally {
            try {
              if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
            } finally {
              if (e_24) throw e_24.error;
            }
          }
        }
      }
    } catch (e_23_1) {
      e_23 = { error: e_23_1 };
    } finally {
      try {
        if (rules_2_1 && !rules_2_1.done && (_a = rules_2.return)) _a.call(rules_2);
      } finally {
        if (e_23) throw e_23.error;
      }
    }
    var replacers = [];
    try {
      for (var _k = __values(state.events.concat(state.supply).concat(state.relics)), _l = _k.next(); !_l.done; _l = _k.next()) {
        var card = _l.value;
        try {
          for (var _m = (e_26 = void 0, __values(card.staticReplacers())), _o = _m.next(); !_o.done; _o = _m.next()) {
            var replacer = _o.value;
            replacers.push([card, replacer]);
          }
        } catch (e_26_1) {
          e_26 = { error: e_26_1 };
        } finally {
          try {
            if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
          } finally {
            if (e_26) throw e_26.error;
          }
        }
      }
    } catch (e_25_1) {
      e_25 = { error: e_25_1 };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_25) throw e_25.error;
      }
    }
    try {
      for (var _p = __values(state.play), _q = _p.next(); !_q.done; _q = _p.next()) {
        var card = _q.value;
        try {
          for (var _r = (e_28 = void 0, __values(card.replacers())), _s = _r.next(); !_s.done; _s = _r.next()) {
            var replacer = _s.value;
            replacers.push([card, replacer]);
          }
        } catch (e_28_1) {
          e_28 = { error: e_28_1 };
        } finally {
          try {
            if (_s && !_s.done && (_f = _r.return)) _f.call(_r);
          } finally {
            if (e_28) throw e_28.error;
          }
        }
      }
    } catch (e_27_1) {
      e_27 = { error: e_27_1 };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_27) throw e_27.error;
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
    } catch (e_29_1) {
      e_29 = { error: e_29_1 };
    } finally {
      try {
        if (replacers_1_1 && !replacers_1_1.done && (_g = replacers_1.return)) _g.call(replacers_1);
      } finally {
        if (e_29) throw e_29.error;
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
    var _a, e_30, _b;
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
      } catch (e_30_1) {
        e_30 = { error: e_30_1 };
      } finally {
        try {
          if (tokens_1_1 && !tokens_1_1.done && (_b = tokens_1.return)) _b.call(tokens_1);
        } finally {
          if (e_30) throw e_30.error;
        }
      }
    }
    state = state.addToZone(card, zone);
    return [state, card];
  }
  function createRawMulti(state, specs, zone) {
    var e_31, _a, _b;
    if (zone === void 0) {
      zone = "discard";
    }
    try {
      for (var specs_1 = __values(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
        var spec = specs_1_1.value;
        var card = void 0;
        _b = __read(createRaw(state, spec, zone), 2), state = _b[0], card = _b[1];
      }
    } catch (e_31_1) {
      e_31 = { error: e_31_1 };
    } finally {
      try {
        if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
      } finally {
        if (e_31) throw e_31.error;
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
        var params, card, _a, _b, effect, e_32_1;
        var _c, e_32, _d;
        return __generator(this, function(_e) {
          switch (_e.label) {
            case 0:
              params = { kind: "create", spec, zone, effects: [], tokens };
              params = replace(params, state);
              spec = params.spec;
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
              e_32_1 = _e.sent();
              e_32 = { error: e_32_1 };
              return [3, 9];
            case 8:
              try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
              } finally {
                if (e_32) throw e_32.error;
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
  function move(card, toZone, logged) {
    if (logged === void 0) {
      logged = false;
    }
    return function(state) {
      return __awaiter(this, void 0, void 0, function() {
        var params, _a, _b, effect, e_33_1;
        var e_33, _c;
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
              e_33_1 = _d.sent();
              e_33 = { error: e_33_1 };
              return [3, 9];
            case 8:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_33) throw e_33.error;
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
    var e_34, _a;
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
    } catch (e_34_1) {
      e_34 = { error: e_34_1 };
    } finally {
      try {
        if (toRender_1_1 && !toRender_1_1.done && (_a = toRender_1.return)) _a.call(toRender_1);
      } finally {
        if (e_34) throw e_34.error;
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
        var _a, _b, effect, e_35_1;
        var e_35, _c;
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
              e_35_1 = _d.sent();
              e_35 = { error: e_35_1 };
              return [3, 8];
            case 7:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_35) throw e_35.error;
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
        var newResources, params, _a, _b, transform, e_36_1;
        var e_36, _c;
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
              e_36_1 = _d.sent();
              e_36 = { error: e_36_1 };
              return [3, 8];
            case 7:
              try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
              } finally {
                if (e_36) throw e_36.error;
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
      var e_37, _d, _e;
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
            } catch (e_37_1) {
              e_37 = { error: e_37_1 };
            } finally {
              try {
                if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
              } finally {
                if (e_37) throw e_37.error;
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
    var e_38, _a;
    function asActChoice(kind) {
      return function(c) {
        return { render: { kind: "card", card: c }, value: [c, kind] };
      };
    }
    function available(kind) {
      return function(c) {
        return c.available(kind, state);
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
    } catch (e_38_1) {
      e_38 = { error: e_38_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_38) throw e_38.error;
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
      var e_39, _a;
      try {
        for (var comps_1 = __values(comps), comps_1_1 = comps_1.next(); !comps_1_1.done; comps_1_1 = comps_1.next()) {
          var comp = comps_1_1.value;
          var result = comp(a2, b);
          if (result != 0)
            return result;
        }
      } catch (e_39_1) {
        e_39 = { error: e_39_1 };
      } finally {
        try {
          if (comps_1_1 && !comps_1_1.done && (_a = comps_1.return)) _a.call(comps_1);
        } finally {
          if (e_39) throw e_39.error;
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
    var e_40, _a;
    var max = 0;
    try {
      for (var cards_1 = __values(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
        var card = cards_1_1.value;
        if (card.id > max)
          max = card.id;
      }
    } catch (e_40_1) {
      e_40 = { error: e_40_1 };
    } finally {
      try {
        if (cards_1_1 && !cards_1_1.done && (_a = cards_1.return)) _a.call(cards_1);
      } finally {
        if (e_40) throw e_40.error;
      }
    }
    return max;
  }
  function initialState(spec, ui) {
    var e_41, _a, e_42, _b;
    var state = new State(spec, ui);
    try {
      for (var _c = __values(spec.potions), _d = _c.next(); !_d.done; _d = _c.next()) {
        var potion = _d.value;
        state = state.addToZone(potion, "potions");
      }
    } catch (e_41_1) {
      e_41 = { error: e_41_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_41) throw e_41.error;
      }
    }
    try {
      for (var _e = __values(spec.relics), _f = _e.next(); !_f.done; _f = _e.next()) {
        var relic = _f.value;
        state = state.addToZone(relic, "relics");
      }
    } catch (e_42_1) {
      e_42 = { error: e_42_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_42) throw e_42.error;
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
    var e_43, _a;
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
      } catch (e_43_1) {
        e_43 = { error: e_43_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_43) throw e_43.error;
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
            return [4, trigger({ kind: "gameStart" })(state)];
          case 1:
            state = _a.sent();
            victorious = false;
            _a.label = 2;
          case 2:
            if (false) return [3, 10];
            state = state.setCheckpoint();
            _a.label = 3;
          case 3:
            _a.trys.push([3, 8, , 9]);
            if (!victorious) return [3, 5];
            return [4, state.ui.victory(state)];
          case 4:
            _a.sent();
            return [2, {
              score: state.energy,
              potionsRemaining: state.potions,
              history: state.origin().future
            }];
          case 5:
            return [4, act(state)];
          case 6:
            state = _a.sent();
            _a.label = 7;
          case 7:
            return [3, 9];
          case 8:
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
            return [3, 9];
          case 9:
            return [3, 2];
          case 10:
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
      text: "Whenever a card with an echo token would move to your hand or discard, trash it instead.",
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
      text: "Whenever a card with a shelter token would leave play, remove a shelter token instead.",
      kind: "move",
      handles: function(p, state) {
        return state.find(p.card).count("shelter") > 0 && p.fromZone == "play" && p.toZone != "play";
      },
      replace: function(p, state) {
        var card = state.find(p.card);
        return __assign(__assign({}, p), { skip: true, effects: [removeToken(card, "shelter")] });
      }
    }]
  };
  registerRule(shelterRule);
  var priorityRule = {
    name: "Priority",
    replacers: [playReplacer("Whenever you would create a card in your discard whose supply has a priority token, instead remove a priority token and set the card aside. Then play it if it is still set aside.", function(p, s, c) {
      return p.zone == "discard" && nameHasToken(p.spec, "priority", s);
    }, function(p, s, c) {
      return applyToTarget(function(t) {
        return removeToken(t, "priority", 1, true);
      }, "Remove a priority token.", function(state) {
        return state.supply.filter(function(t) {
          return t.name == p.spec.name;
        });
      });
    })]
  };
  registerRule(priorityRule);
  var reflectRule = {
    name: "Reflect",
    triggers: [{
      text: "After playing a card with a reflect token on it, remove the reflect token and play it again.",
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
      text: "Cards cost $1 less to buy per ferry token on them, but not less than $1.",
      kind: "cost",
      handles: function(p, state) {
        return p.actionKind == "buy" && state.find(p.card).count("ferry") > 0;
      },
      replace: function(p, state) {
        return __assign(__assign({}, p), { cost: reducedCost(p.cost, coin(state.find(p.card).count("ferry")), true) });
      }
    }]
  };
  registerRule(ferryRule);
  var twinRule = {
    name: "Twin",
    triggers: [{
      text: "After playing a card with a twin token other than with this effect, play it again.",
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
      text: "After buying a card with a duplicate token on it other than with this effect, remove a duplicate token from it to buy it again.",
      kind: "afterBuy",
      handles: function(e, state, card) {
        var target = state.find(e.card);
        return target.count("duplicate") > 0 && !sourceHasName(e.source, "Duplicate");
      },
      transform: function(e, state, card) {
        return payToDo(removeToken(e.card, "duplicate"), e.card.buy(duplicateRule));
      }
    }]
  };
  registerRule(duplicateRule);
  function assertNever(x) {
    throw new Error("Unexpected: ".concat(x));
  }
  function countDistinct(xs) {
    var e_44, _a;
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
    } catch (e_44_1) {
      e_44 = { error: e_44_1 };
    } finally {
      try {
        if (xs_1_1 && !xs_1_1.done && (_a = xs_1.return)) _a.call(xs_1);
      } finally {
        if (e_44) throw e_44.error;
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
      text: extraStr
    };
  }
  function incrementCost() {
    return {
      text: ["Put a cost token on this."],
      transform: function(s, c) {
        return addToken(c, "cost");
      }
    };
  }
  function incrementMap(m, k, n) {
    m.set(k, (m.get(k) || 0) + n);
  }
  function startsWithCharge(name, n) {
    return {
      text: "Each ".concat(name, " is created with ").concat(aOrNum(n, "charge token"), " on it."),
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
  function createInPlayEffect(spec, n, tokens) {
    if (n === void 0) {
      n = 1;
    }
    if (tokens === void 0) {
      tokens = null;
    }
    return {
      text: ["Create ".concat(aOrNum(n, spec.name), " in play.")],
      transform: function() {
        return repeat(create(spec, "play", function(c) {
          return noop;
        }, tokens ? tokens : /* @__PURE__ */ new Map()), n);
      }
    };
  }
  function startInPlay(cardName) {
    return {
      kind: "create",
      text: "When you would create ".concat(a(cardName), " in your discard, instead create it in play."),
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
        return leq(x.cost("buy", state), coin(n)) && x.name != except;
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
  function chargeEffect(n) {
    if (n === void 0) {
      n = 1;
    }
    return {
      text: ["Put ".concat(aOrNum(n, "charge token"), " on this.")],
      transform: function(s, card) {
        return charge(card, n);
      }
    };
  }
  function trashOnLeavePlay() {
    return {
      text: "Whenever this would leave play, trash it.",
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
      text: "Cards cost @ less to play. Whenever this reduces a cost, trash it.",
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
  function playReplacer(text, condition, cost) {
    return {
      kind: "create",
      text,
      handles: function(p, s, source) {
        return (p.zone == "discard" || p.zone == "hand") && condition(p, s, source);
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
      }
    };
  }
  var fair = {
    name: "Fair",
    replacers: [{
      text: "Whenever you would create a card in your discard,\n        instead create the card in your hand and trash this.",
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
      text: costReduceDescriptor(kind, reduction, nonzero),
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
  function targetedEffect(f, text, options) {
    return {
      text: [text],
      transform: function(s, c) {
        return applyToTarget(function(target) {
          return f(target, c);
        }, text, options);
      }
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
      text: "When you buy this, ".concat(effect.text.map(lowercaseFirst).join("; then "))
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
      text: "After buying this, ".concat(effect.text.map(lowercaseFirst).join("; then "))
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
  function renderEffects(spec) {
    var e_1, _a;
    var parts = [];
    try {
      for (var _b = __values3(cardSpecEffects(spec)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray3([], __read3(effect.text), false));
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
  function renderAbility(spec) {
    var e_2, _a;
    var parts = [];
    try {
      for (var _b = __values3(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray3([], __read3(effect.text.map(function(x) {
          return "<div>(ability) ".concat(x, "</div>");
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
  function renderTrigger(x, staticTrigger) {
    var desc = staticTrigger ? "(static)" : "(effect)";
    return "<div>".concat(desc, " ").concat(x.text, "</div>");
  }
  function renderVariableCosts(cs) {
    return cs.map(function(c) {
      return "<div>(cost) +".concat(c.text, "</div>");
    }).join("");
  }
  function renderBuyable(bs) {
    return bs.map(function(b) {
      return b.text === void 0 ? "" : "<div>(req) ".concat(b.text, "</div>");
    }).join("");
  }
  function renderRuleText(rule) {
    var e_3, _a, e_4, _b;
    var parts = [];
    try {
      for (var _c = __values3(rule.triggers || []), _d = _c.next(); !_d.done; _d = _c.next()) {
        var trigger3 = _d.value;
        parts.push("<div>(rule) ".concat(trigger3.text, "</div>"));
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    try {
      for (var _e = __values3(rule.replacers || []), _f = _e.next(); !_f.done; _f = _e.next()) {
        var replacer = _f.value;
        parts.push("<div>(rule) ".concat(replacer.text, "</div>"));
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    return parts.join("");
  }
  function cardText(spec) {
    var effectHtml = renderEffects(spec);
    var buyableHtml = spec.restrictions ? renderBuyable(spec.restrictions) : "";
    var costHtml = spec.variableCosts ? renderVariableCosts(spec.variableCosts) : "";
    var abilitiesHtml = renderAbility(spec);
    var triggerHtml = cardSpecTriggers(spec).map(function(x) {
      return renderTrigger(x, false);
    }).join("");
    var replacerHtml = cardSpecReplacers(spec).map(function(x) {
      return renderTrigger(x, false);
    }).join("");
    var staticTriggerHtml = cardSpecStaticTriggers(spec).map(function(x) {
      return renderTrigger(x, true);
    }).join("");
    var staticReplacerHtml = cardSpecStaticReplacers(spec).map(function(x) {
      return renderTrigger(x, true);
    }).join("");
    var rulesHtml = (spec.rules || []).map(renderRuleText).join("");
    return [
      buyableHtml,
      costHtml,
      effectHtml,
      abilitiesHtml,
      triggerHtml,
      replacerHtml,
      staticTriggerHtml,
      staticReplacerHtml,
      rulesHtml
    ].join("");
  }
  function renderSpecSimpleBody(spec) {
    return spec.simpleText && (spec.upgrades || []).length === 0 ? spec.simpleText.map(function(line) {
      return "<div>".concat(line, "</div>");
    }).join("") : cardText(spec);
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
    var rules2 = (spec.rules || []).map(renderRuleText).join("");
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
    var hasRelatedRules = (spec.rules || []).length > 0;
    var hasRelatedContent = hasRelatedCards || hasRelatedRules;
    if (tooltipMode === "onlyRelated" && hasRelatedContent) {
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
      name: "".concat(cardName, " in a Box"),
      triggers: [{
        kind: "gameStart",
        text: "Start each course with a copy of ".concat(cardName, " in hand."),
        handles: function() {
          return true;
        },
        transform: function() {
          return function(state) {
            return __awaiter2(this, void 0, void 0, function() {
              return __generator2(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, create(spec, "hand")(state)];
                  case 1:
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
      rules: spec.rules ? __spreadArray4([], __read4(spec.rules), false) : void 0,
      persistence: {
        kind: "bottledEventPotion"
      },
      effects
    };
  }

  // public/rng.js
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
          _a = __read5([result[j], result[i]], 2), result[i] = _a[0], result[j] = _a[1];
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
  var PIGGY_BANK_SELECTED_INDEX = -2;
  function singingBowlCount(state) {
    return state.data.relics.filter(function(relic) {
      return relic.name === "Singing Bowl";
    }).length;
  }
  function piggyBankCount(state) {
    return state.data.relics.filter(function(relic) {
      return relic.name === "Piggy Bank";
    }).length;
  }
  function hasRelicNamed(state, name) {
    return state.data.relics.some(function(relic) {
      return relic.name === name;
    });
  }
  function lookingGlassCount(state) {
    return state.data.relics.filter(function(relic) {
      return relic.name === "Looking Glass";
    }).length;
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
  function getSimpleRewardOptions(state, metaState) {
    var _this = this;
    var options = state.options;
    return options.map(function(option, i) {
      return {
        label: displayName(option),
        spec: option,
        disabled: state.selectedIndex !== null || state.kind === "relic" && !relicGainRequirementSatisfied(option, metaState),
        checked: state.selectedIndex === i || state.selectedIndex === PIGGY_BANK_SELECTED_INDEX,
        onClick: function() {
          return __awaiter3(_this, void 0, void 0, function() {
            var skipped, transform;
            return __generator3(this, function(_a) {
              skipped = options.filter(function(_, optionIndex) {
                return optionIndex !== i;
              }).map(function(spec) {
                return displayName(spec);
              });
              transform = state.kind === "card" ? gainCard(option, { skipped }) : state.kind === "event" ? gainEvent(option, { skipped }) : state.kind === "potion" ? gainPotion(option, { skipped }) : gainRelic(option, { skipped });
              return [2, {
                newData: __assign2(__assign2({}, state), { selectedIndex: i }),
                transform
              }];
            });
          });
        }
      };
    });
  }
  function getRewardOptions(rewardState, metaState) {
    var _this = this;
    var baseOptions = rewardState.kind === "encounter" ? !rewardState.encounter ? [] : rewardState.encounter.getOptions(rewardState.data, metaState) : getSimpleRewardOptions(rewardState, metaState);
    var alreadySelected = rewardState.kind === "encounter" ? encounterRewardCompleted(rewardState) : rewardState.selectedIndex !== null;
    var piggySelected = rewardState.kind !== "encounter" && rewardState.selectedIndex === PIGGY_BANK_SELECTED_INDEX;
    var hasSingingBowl = rewardState.kind !== "encounter" && singingBowlCount(metaState) > 0;
    if (hasSingingBowl) {
      var optionIndex_1 = baseOptions.length;
      var skippedLabels = baseOptions.map(function(option) {
        return option.label;
      });
      var details_1 = skippedLabels.length > 0 ? "Skipped: ".concat(skippedLabels.join(", ")) : void 0;
      baseOptions.push({
        label: "+2 Buffer",
        compact: true,
        disabled: alreadySelected,
        checked: rewardState.selectedIndex === optionIndex_1,
        onClick: function() {
          return __awaiter3(_this, void 0, void 0, function() {
            var transform;
            return __generator3(this, function(_a) {
              transform = compose(addTimelineAction("Gain 2 buffer", details_1), addBuffer(2));
              return [2, {
                newData: __assign2(__assign2({}, rewardState), { selectedIndex: optionIndex_1 }),
                transform
              }];
            });
          });
        }
      });
    }
    var hasPiggyBank = rewardState.kind !== "encounter" && (piggyBankCount(metaState) > 0 || piggySelected);
    if (hasPiggyBank) {
      var takenNames = rewardState.options.map(function(option) {
        return displayName(option);
      });
      var details_2 = takenNames.length > 0 ? "Taken: ".concat(takenNames.join(", ")) : void 0;
      baseOptions.push({
        label: "Take it all",
        compact: true,
        disabled: alreadySelected,
        checked: piggySelected,
        onClick: function() {
          return __awaiter3(_this, void 0, void 0, function() {
            var transform;
            var _this2 = this;
            return __generator3(this, function(_a) {
              transform = function(state) {
                return __awaiter3(_this2, void 0, void 0, function() {
                  var piggyBank2, _a2, _b, option, e_1_1;
                  var e_1, _c;
                  return __generator3(this, function(_d) {
                    switch (_d.label) {
                      case 0:
                        piggyBank2 = state.data.relics.find(function(relic) {
                          return relic.name === "Piggy Bank";
                        });
                        if (piggyBank2)
                          state.removeRelic(piggyBank2.id);
                        return [4, addTimelineAction("Take it all", details_2)(state)];
                      case 1:
                        _d.sent();
                        _d.label = 2;
                      case 2:
                        _d.trys.push([2, 13, 14, 15]);
                        _a2 = __values4(rewardState.options), _b = _a2.next();
                        _d.label = 3;
                      case 3:
                        if (!!_b.done) return [3, 12];
                        option = _b.value;
                        if (!(rewardState.kind === "card")) return [3, 5];
                        return [4, gainCard(option, { silent: true })(state)];
                      case 4:
                        _d.sent();
                        return [3, 11];
                      case 5:
                        if (!(rewardState.kind === "event")) return [3, 7];
                        return [4, gainEvent(option, { silent: true })(state)];
                      case 6:
                        _d.sent();
                        return [3, 11];
                      case 7:
                        if (!(rewardState.kind === "potion")) return [3, 9];
                        return [4, gainPotion(option, { silent: true })(state)];
                      case 8:
                        _d.sent();
                        return [3, 11];
                      case 9:
                        return [4, gainRelic(option, { silent: true })(state)];
                      case 10:
                        _d.sent();
                        _d.label = 11;
                      case 11:
                        _b = _a2.next();
                        return [3, 3];
                      case 12:
                        return [3, 15];
                      case 13:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 15];
                      case 14:
                        try {
                          if (_b && !_b.done && (_c = _a2.return)) _c.call(_a2);
                        } finally {
                          if (e_1) throw e_1.error;
                        }
                        return [
                          7
                          /*endfinally*/
                        ];
                      case 15:
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              };
              return [2, {
                newData: __assign2(__assign2({}, rewardState), { selectedIndex: PIGGY_BANK_SELECTED_INDEX }),
                transform
              }];
            });
          });
        }
      });
    }
    return baseOptions;
  }
  function updateRewardState(rewardState, newData) {
    if (rewardState.kind === "encounter") {
      return __assign2(__assign2({}, rewardState), { data: newData });
    } else {
      return newData;
    }
  }
  var encounterRegistry = [];
  var encounterUpgradeRegistry = /* @__PURE__ */ new Map();
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
  var BASE_PARS = [26, 24, 22, 20, 18, 16, 14, 4];
  function renderChallenge(spec, state) {
    var gameSpec = makeSpec(state, spec);
    var label = "".concat(challengeSummary(spec), " (").concat(gameSpec.vp, "vp in ").concat(gameSpec.par, "@)");
    var relatedCards = __spreadArray5(__spreadArray5(__spreadArray5([], __read6(spec.vpMode.cards), false), __read6(spec.vpMode.events), false), __read6(spec.boons.flatMap(function(b) {
      return __spreadArray5(__spreadArray5([], __read6(b.cards), false), __read6(b.events), false);
    })), false);
    var tooltipParts = [];
    if (relatedCards.length > 0) {
      tooltipParts.push(relatedCards.map(buildSpecTooltip).join(""));
    }
    if (hasRelicNamed(state, "Looking Glass") && state.data.phase !== "path_select") {
      var lookingGlassRewards = sampleLookingGlassRoundRewards(state, lookingGlassCount(state));
      var lines = [];
      if (lookingGlassRewards.cards.length > 0) {
        lines.push("Added cards: ".concat(lookingGlassRewards.cards.map(displayName).join(", ")));
      }
      if (lookingGlassRewards.events.length > 0) {
        lines.push("Added events: ".concat(lookingGlassRewards.events.map(displayName).join(", ")));
      }
      if (lines.length > 0) {
        var lookingGlassDetails = '<div style="margin-top:6px;">'.concat(lines.join("<br>"), "</div>");
        tooltipParts.push(lookingGlassDetails);
      }
    }
    if (tooltipParts.length === 0)
      return label;
    var tooltipContent = tooltipParts.join("");
    return "".concat(label, "<span class='tooltip'>").concat(tooltipContent, "</span>");
  }
  function challengeSummary(challenge) {
    var boonSummary = challenge.boons.map(function(b) {
      return b.name;
    }).join(" + ");
    return boonSummary.length > 0 ? "".concat(challenge.vpMode.name, " + ").concat(boonSummary) : challenge.vpMode.name;
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
    var e_2, _a;
    var result = [];
    var firstStageRowIndex = /* @__PURE__ */ new Map();
    try {
      for (var timeline_1 = __values4(timeline), timeline_1_1 = timeline_1.next(); !timeline_1_1.done; timeline_1_1 = timeline_1.next()) {
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
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (timeline_1_1 && !timeline_1_1.done && (_a = timeline_1.return)) _a.call(timeline_1);
      } finally {
        if (e_2) throw e_2.error;
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
      return __spreadArray5(__spreadArray5([], __read6(normalized), false), [entry], false);
    var updated = __spreadArray5([], __read6(normalized), false);
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
        var _a;
        this.ui = ui;
        this.redoStack = [];
        this.undoStack = [];
        this.generators = /* @__PURE__ */ new Map();
        this.onChange = onChange;
        this.debugEnabled = (_a = options.debugEnabled) !== null && _a !== void 0 ? _a : false;
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
        var nextData = __assign2(__assign2({}, this.data), updates);
        this.undoStack.push(this.checkpoint);
        this.data = nextData;
        this.checkpoint = nextData;
        this.redoStack = [];
        this.notifyChanged();
      };
      MetaState2.prototype.replaceAndClearHistory = function(updates) {
        var nextData = __assign2(__assign2({}, this.data), updates);
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
        this.data = __assign2(__assign2({}, this.data), updates);
        this.notifyChanged();
      };
      MetaState2.prototype.updateGlobal = function(updates) {
        this.global = __assign2(__assign2({}, this.global), updates);
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
        var redoCheckpoint = checkpointUpdate ? __assign2(__assign2({}, this.checkpoint), checkpointUpdate) : this.checkpoint;
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
        var e_3, _a;
        var snapshots = __spreadArray5(__spreadArray5([this.data, this.checkpoint], __read6(this.undoStack), false), __read6(this.redoStack), false);
        var seen = /* @__PURE__ */ new Set();
        var result = [];
        try {
          for (var snapshots_1 = __values4(snapshots), snapshots_1_1 = snapshots_1.next(); !snapshots_1_1.done; snapshots_1_1 = snapshots_1.next()) {
            var snapshot = snapshots_1_1.value;
            if (!seen.has(snapshot)) {
              seen.add(snapshot);
              result.push(snapshot);
            }
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (snapshots_1_1 && !snapshots_1_1.done && (_a = snapshots_1.return)) _a.call(snapshots_1);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
        return result;
      };
      MetaState2.prototype.mutateAllSnapshots = function(mutator) {
        var e_4, _a;
        try {
          for (var _b = __values4(this.uniqueSnapshots()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var snapshot = _c.value;
            mutator(snapshot);
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
    var e_5, _a;
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
        entries: __spreadArray5([], __read6(value.entries()), false).map(function(_a2) {
          var _b2 = __read6(_a2, 2), key2 = _b2[0], entryValue2 = _b2[1];
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
        for (var _b = __values4(Object.entries(value)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = __read6(_c.value, 2), key = _d[0], entryValue = _d[1];
          result[key] = encodeUnknown(entryValue);
        }
      } catch (e_5_1) {
        e_5 = { error: e_5_1 };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_5) throw e_5.error;
        }
      }
      return result;
    }
    return value;
  }
  function decodeUnknown(value) {
    var e_6, _a;
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
        for (var _b = __values4(Object.entries(record)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var _d = __read6(_c.value, 2), key = _d[0], entryValue = _d[1];
          result[key] = decodeUnknown(entryValue);
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
      return result;
    }
    return value;
  }
  function findBaseSpec(name) {
    var spec = getSpecByName(name);
    if (spec)
      return spec;
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
    var e_7, _a;
    var result = base;
    try {
      for (var upgradeIDs_1 = __values4(upgradeIDs), upgradeIDs_1_1 = upgradeIDs_1.next(); !upgradeIDs_1_1.done; upgradeIDs_1_1 = upgradeIDs_1.next()) {
        var id = upgradeIDs_1_1.value;
        var upgrade = getEncounterUpgradeById(id);
        if (!upgrade) {
          throw new Error('Unknown upgrade id "'.concat(id, '"'));
        }
        result = __assign2(__assign2({}, result), { upgrades: __spreadArray5(__spreadArray5([], __read6(result.upgrades || []), false), [upgrade], false) });
      }
    } catch (e_7_1) {
      e_7 = { error: e_7_1 };
    } finally {
      try {
        if (upgradeIDs_1_1 && !upgradeIDs_1_1.done && (_a = upgradeIDs_1.return)) _a.call(upgradeIDs_1);
      } finally {
        if (e_7) throw e_7.error;
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
      ticks: __spreadArray5([], __read6(card.ticks), false),
      tokens: __spreadArray5([], __read6(card.tokens.entries()), false),
      place: card.place
    };
    if (card instanceof Relic) {
      return __assign2(__assign2({ kind: "relic" }, common), { notedCards: (card.notedCards || []).map(function(spec) {
        return serializeSpec(spec, "card");
      }) });
    }
    return __assign2({ kind: "card" }, common);
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
    return {
      stage: challenge.stage,
      vpModeName: challenge.vpMode.name,
      boonNames: challenge.boons.map(function(boon) {
        return boon.name;
      })
    };
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
    return {
      stage: challenge.stage,
      vpMode,
      boons: resolvedBoons
    };
  }
  function serializePath(path) {
    return {
      rewardStates: path.rewardStates.map(serializeRewardState),
      challenges: path.challenges.map(serializeChallenge)
    };
  }
  function deserializePath(path) {
    return {
      rewardStates: path.rewardStates.map(deserializeRewardState),
      challenges: path.challenges.map(deserializeChallenge)
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
    return {
      vp: spec.vp,
      par: spec.par,
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
      metaStageScores: spec.metaStageScores ? __spreadArray5([], __read6(spec.metaStageScores), false) : void 0,
      metaStagePars: spec.metaStagePars ? __spreadArray5([], __read6(spec.metaStagePars), false) : void 0,
      metaStageTooltips: spec.metaStageTooltips ? __spreadArray5([], __read6(spec.metaStageTooltips), false) : void 0,
      previousScore: spec.previousScore,
      replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray5([], __read6(spec.replayUsedPotionIDs), false) : void 0,
      replayStage: spec.replayStage
    };
  }
  function deserializeGameSpec(spec) {
    return {
      vp: spec.vp,
      par: spec.par,
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
      metaStageScores: spec.metaStageScores ? __spreadArray5([], __read6(spec.metaStageScores), false) : void 0,
      metaStagePars: spec.metaStagePars ? __spreadArray5([], __read6(spec.metaStagePars), false) : void 0,
      metaStageTooltips: spec.metaStageTooltips ? __spreadArray5([], __read6(spec.metaStageTooltips), false) : void 0,
      previousScore: spec.previousScore,
      replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray5([], __read6(spec.replayUsedPotionIDs), false) : void 0,
      replayStage: spec.replayStage
    };
  }
  function serializeMetaStateData(data) {
    validateMetaStateData(data, "serialize");
    return {
      stage: data.stage,
      phase: data.phase,
      challenges: data.challenges.map(serializeChallenge),
      availablePaths: data.availablePaths.map(serializePath),
      stageScores: __spreadArray5([], __read6(data.stageScores), false),
      stagePars: __spreadArray5([], __read6(data.stagePars), false),
      stageReplays: data.stageReplays.map(function(stageReplay) {
        if (stageReplay === null)
          return null;
        return {
          stage: stageReplay.stage,
          challenge: serializeChallenge(stageReplay.challenge),
          spec: serializeGameSpec(stageReplay.spec),
          score: stageReplay.score,
          par: stageReplay.par,
          history: __spreadArray5([], __read6(stageReplay.history), false),
          potionsRemaining: stageReplay.potionsRemaining.map(function(card) {
            return serializeCard(card);
          }),
          bufferBeforeCourse: stageReplay.bufferBeforeCourse,
          bufferAfterCourse: stageReplay.bufferAfterCourse
        };
      }),
      buffer: data.buffer,
      rewardStates: data.rewardStates.map(serializeRewardState),
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
        return __assign2({}, entry);
      }),
      gameHistory: __spreadArray5([], __read6(data.gameHistory), false),
      gameRedo: __spreadArray5([], __read6(data.gameRedo), false)
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
      stageScores: __spreadArray5([], __read6(data.stageScores), false),
      stagePars: __spreadArray5([], __read6(data.stagePars), false),
      stageReplays: data.stageReplays.map(function(stageReplay) {
        if (stageReplay === null)
          return null;
        return {
          stage: stageReplay.stage,
          challenge: deserializeChallenge(stageReplay.challenge),
          spec: deserializeGameSpec(stageReplay.spec),
          score: stageReplay.score,
          par: stageReplay.par,
          history: __spreadArray5([], __read6(stageReplay.history), false),
          potionsRemaining: stageReplay.potionsRemaining.map(function(card) {
            return deserializeCard(card);
          }),
          bufferBeforeCourse: stageReplay.bufferBeforeCourse,
          bufferAfterCourse: stageReplay.bufferAfterCourse
        };
      }),
      buffer: data.buffer,
      rewardStates: data.rewardStates.map(deserializeRewardState),
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
        return __assign2({}, entry);
      })),
      gameHistory: __spreadArray5([], __read6(data.gameHistory), false),
      gameRedo: __spreadArray5([], __read6(data.gameRedo), false)
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
      masterGeneratorState: state.masterGenerator.exportState(),
      generatorStates: __spreadArray5([], __read6(state.generators.entries()), false).map(function(_a) {
        var _b = __read6(_a, 2), key = _b[0], generator = _b[1];
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
  function deserializeMetaGame(ui, serialized, onChange, debugEnabled) {
    var _a, _b;
    if (onChange === void 0) {
      onChange = null;
    }
    if (debugEnabled === void 0) {
      debugEnabled = false;
    }
    if (serialized.version !== 1) {
      throw new Error("Unsupported save version ".concat(serialized.version));
    }
    var state = new MetaState(ui, serialized.seed, onChange, { debugEnabled });
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
      macros: (_a = restoredGlobal.macros) !== null && _a !== void 0 ? _a : [],
      viewingMacros: (_b = restoredGlobal.viewingMacros) !== null && _b !== void 0 ? _b : false
    };
    return state;
  }
  function compose() {
    var transforms = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      transforms[_i] = arguments[_i];
    }
    return function(state) {
      return __awaiter3(this, void 0, void 0, function() {
        var transforms_1, transforms_1_1, t, e_8_1;
        var e_8, _a;
        return __generator3(this, function(_b) {
          switch (_b.label) {
            case 0:
              _b.trys.push([0, 5, 6, 7]);
              transforms_1 = __values4(transforms), transforms_1_1 = transforms_1.next();
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
              e_8_1 = _b.sent();
              e_8 = { error: e_8_1 };
              return [3, 7];
            case 6:
              try {
                if (transforms_1_1 && !transforms_1_1.done && (_a = transforms_1.return)) _a.call(transforms_1);
              } finally {
                if (e_8) throw e_8.error;
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
      return __awaiter3(this, void 0, void 0, function() {
        return __generator3(this, function(_a) {
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
  function addTimelineAction(action, details) {
    return function(state) {
      return __awaiter3(this, void 0, void 0, function() {
        return __generator3(this, function(_a) {
          state.update({
            timeline: __spreadArray5(__spreadArray5([], __read6(state.data.timeline), false), [{
              kind: "action",
              stage: state.data.stage,
              action,
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
      return __awaiter3(this, void 0, void 0, function() {
        var nextData;
        return __generator3(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextData = {
                collectedCards: __spreadArray5(__spreadArray5([], __read6(state.data.collectedCards), false), [card], false)
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray5(__spreadArray5([], __read6(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "card",
                  name: displayName(card),
                  skipped: timelineDetails.skipped ? __spreadArray5([], __read6(timelineDetails.skipped), false) : void 0,
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
      return __awaiter3(this, void 0, void 0, function() {
        var nextData;
        return __generator3(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextData = {
                collectedEvents: __spreadArray5(__spreadArray5([], __read6(state.data.collectedEvents), false), [event], false)
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray5(__spreadArray5([], __read6(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "event",
                  name: displayName(event),
                  skipped: timelineDetails.skipped ? __spreadArray5([], __read6(timelineDetails.skipped), false) : void 0,
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
      return __awaiter3(this, void 0, void 0, function() {
        var nextID, potionCard, nextData;
        return __generator3(this, function(_a) {
          nextID = state.data.nextID;
          potionCard = new Card(potion, nextID);
          nextData = {
            potions: __spreadArray5(__spreadArray5([], __read6(state.data.potions), false), [potionCard], false),
            nextID: nextID + 1
          };
          if (!timelineDetails.silent) {
            nextData.timeline = __spreadArray5(__spreadArray5([], __read6(state.data.timeline), false), [{
              kind: "gain",
              stage: state.data.stage,
              gainKind: "potion",
              name: displayName(potion),
              skipped: timelineDetails.skipped ? __spreadArray5([], __read6(timelineDetails.skipped), false) : void 0,
              details: timelineDetails.details
            }], false);
          }
          state.update(nextData);
          return [
            2
            /*return*/
          ];
        });
      });
    };
  }
  function gainRelic(relic, timelineDetails) {
    if (timelineDetails === void 0) {
      timelineDetails = {};
    }
    return function(state) {
      return __awaiter3(this, void 0, void 0, function() {
        var nextID, relicCard, nextData;
        return __generator3(this, function(_a) {
          switch (_a.label) {
            case 0:
              nextID = state.data.nextID;
              relicCard = new Relic(relic, nextID);
              nextData = {
                relics: __spreadArray5(__spreadArray5([], __read6(state.data.relics), false), [relicCard], false),
                nextID: nextID + 1
              };
              if (!timelineDetails.silent) {
                nextData.timeline = __spreadArray5(__spreadArray5([], __read6(state.data.timeline), false), [{
                  kind: "gain",
                  stage: state.data.stage,
                  gainKind: "relic",
                  name: displayName(relic),
                  skipped: timelineDetails.skipped ? __spreadArray5([], __read6(timelineDetails.skipped), false) : void 0,
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
  function updateRewardAtIndex(state, index, newRewardState) {
    var rewardStates = __spreadArray5([], __read6(state.data.rewardStates), false);
    if (index >= 0 && index < rewardStates.length) {
      rewardStates[index] = newRewardState;
    }
    state.update({ rewardStates });
  }
  function endCourse(score, par, state) {
    return __awaiter3(this, void 0, void 0, function() {
      var newScores, newPars;
      return __generator3(this, function(_a) {
        switch (_a.label) {
          case 0:
            newScores = __spreadArray5([], __read6(state.data.stageScores), false);
            newPars = __spreadArray5([], __read6(state.data.stagePars), false);
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
  function applyMetaReplacers(kind, params, state) {
    var e_9, _a, e_10, _b;
    var relics = state.data.relics;
    try {
      for (var relics_1 = __values4(relics), relics_1_1 = relics_1.next(); !relics_1_1.done; relics_1_1 = relics_1.next()) {
        var relic = relics_1_1.value;
        var metaReplacers = relic.metaReplacers();
        try {
          for (var metaReplacers_1 = (e_10 = void 0, __values4(metaReplacers)), metaReplacers_1_1 = metaReplacers_1.next(); !metaReplacers_1_1.done; metaReplacers_1_1 = metaReplacers_1.next()) {
            var replacer = metaReplacers_1_1.value;
            if (replacer.kind === kind) {
              var replaceFn = replacer.replace;
              params = replaceFn(params, relic);
            }
          }
        } catch (e_10_1) {
          e_10 = { error: e_10_1 };
        } finally {
          try {
            if (metaReplacers_1_1 && !metaReplacers_1_1.done && (_b = metaReplacers_1.return)) _b.call(metaReplacers_1);
          } finally {
            if (e_10) throw e_10.error;
          }
        }
      }
    } catch (e_9_1) {
      e_9 = { error: e_9_1 };
    } finally {
      try {
        if (relics_1_1 && !relics_1_1.done && (_a = relics_1.return)) _a.call(relics_1);
      } finally {
        if (e_9) throw e_9.error;
      }
    }
    return params;
  }
  function signedAmount(amount) {
    return amount > 0 ? "+".concat(amount) : "".concat(amount);
  }
  function describeParCalculation(stage, challenge, relicCards) {
    var e_11, _a, e_12, _b, e_13, _c;
    var _d;
    var basePar = BASE_PARS[stage];
    if (basePar === void 0)
      return "";
    var parts = ["".concat(basePar, " (base)")];
    var par = basePar;
    if (challenge !== null && challenge !== void 0) {
      try {
        for (var _e = __values4(challenge.boons), _f = _e.next(); !_f.done; _f = _e.next()) {
          var boon = _f.value;
          par += boon.parAdjustment;
          if (boon.parAdjustment !== 0) {
            parts.push("".concat(signedAmount(boon.parAdjustment), " for ").concat(boon.name));
          }
        }
      } catch (e_11_1) {
        e_11 = { error: e_11_1 };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_11) throw e_11.error;
        }
      }
    }
    var params = {
      par,
      vpGoal: (_d = challenge === null || challenge === void 0 ? void 0 : challenge.vpMode.target) !== null && _d !== void 0 ? _d : 0,
      cardSpecs: [],
      eventSpecs: []
    };
    try {
      for (var relicCards_1 = __values4(relicCards), relicCards_1_1 = relicCards_1.next(); !relicCards_1_1.done; relicCards_1_1 = relicCards_1.next()) {
        var relicCard = relicCards_1_1.value;
        if (!(relicCard instanceof Relic))
          continue;
        var metaReplacers = relicCard.metaReplacers();
        try {
          for (var metaReplacers_2 = (e_13 = void 0, __values4(metaReplacers)), metaReplacers_2_1 = metaReplacers_2.next(); !metaReplacers_2_1.done; metaReplacers_2_1 = metaReplacers_2.next()) {
            var replacer = metaReplacers_2_1.value;
            if (replacer.kind !== "gameSetup")
              continue;
            var replaceFn = replacer.replace;
            var nextParams = replaceFn(params, relicCard);
            var parDelta = nextParams.par - params.par;
            if (parDelta !== 0) {
              parts.push("".concat(signedAmount(parDelta), " for ").concat(relicCard.name));
            }
            params = nextParams;
          }
        } catch (e_13_1) {
          e_13 = { error: e_13_1 };
        } finally {
          try {
            if (metaReplacers_2_1 && !metaReplacers_2_1.done && (_c = metaReplacers_2.return)) _c.call(metaReplacers_2);
          } finally {
            if (e_13) throw e_13.error;
          }
        }
      }
    } catch (e_12_1) {
      e_12 = { error: e_12_1 };
    } finally {
      try {
        if (relicCards_1_1 && !relicCards_1_1.done && (_b = relicCards_1.return)) _b.call(relicCards_1);
      } finally {
        if (e_12) throw e_12.error;
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
          return describeParCalculation(stage, replayData.challenge, replayData.spec.relics);
        }
      }
      if (stage === state.data.stage && state.data.challenges.length === 1) {
        return describeParCalculation(stage, state.data.challenges[0], state.data.relics);
      }
      return "".concat(basePar, " (base)");
    });
  }
  function trigger2(e, state) {
    return __awaiter3(this, void 0, void 0, function() {
      var _a, _b, relic, metaTriggers, metaTriggers_1, metaTriggers_1_1, rawTrigger, trigger_1, handles, e_14_1, e_15_1;
      var e_15, _c, e_14, _d;
      return __generator3(this, function(_e) {
        switch (_e.label) {
          case 0:
            _e.trys.push([0, 11, 12, 13]);
            _a = __values4(state.data.relics), _b = _a.next();
            _e.label = 1;
          case 1:
            if (!!_b.done) return [3, 10];
            relic = _b.value;
            metaTriggers = relic.metaTriggers();
            if (!metaTriggers) return [3, 9];
            _e.label = 2;
          case 2:
            _e.trys.push([2, 7, 8, 9]);
            metaTriggers_1 = (e_14 = void 0, __values4(metaTriggers)), metaTriggers_1_1 = metaTriggers_1.next();
            _e.label = 3;
          case 3:
            if (!!metaTriggers_1_1.done) return [3, 6];
            rawTrigger = metaTriggers_1_1.value;
            if (!(rawTrigger.kind === e.kind)) return [3, 5];
            trigger_1 = rawTrigger;
            handles = trigger_1.handles(e, state, relic);
            if (!handles) return [3, 5];
            return [4, trigger_1.transform(e, state, relic)(state)];
          case 4:
            _e.sent();
            _e.label = 5;
          case 5:
            metaTriggers_1_1 = metaTriggers_1.next();
            return [3, 3];
          case 6:
            return [3, 9];
          case 7:
            e_14_1 = _e.sent();
            e_14 = { error: e_14_1 };
            return [3, 9];
          case 8:
            try {
              if (metaTriggers_1_1 && !metaTriggers_1_1.done && (_d = metaTriggers_1.return)) _d.call(metaTriggers_1);
            } finally {
              if (e_14) throw e_14.error;
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
            e_15_1 = _e.sent();
            e_15 = { error: e_15_1 };
            return [3, 13];
          case 12:
            try {
              if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            } finally {
              if (e_15) throw e_15.error;
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
  function makeSpec(state, challenge) {
    var e_16, _a;
    var par = BASE_PARS[state.data.stage];
    var vpTarget = challenge.vpMode.target;
    var cards = challenge.vpMode.cards.slice();
    var events = challenge.vpMode.events.slice();
    try {
      for (var _b = __values4(challenge.boons), _c = _b.next(); !_c.done; _c = _b.next()) {
        var boon = _c.value;
        par += boon.parAdjustment;
        cards.push.apply(cards, __spreadArray5([], __read6(boon.cards), false));
        events.push.apply(events, __spreadArray5([], __read6(boon.events), false));
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
    var sortedCollectedCards = __spreadArray5([], __read6(state.data.collectedCards), false).sort(function(a2, b) {
      return coinKey(a2) - coinKey(b);
    });
    var sortedCollectedEvents = __spreadArray5([], __read6(state.data.collectedEvents), false).sort(function(a2, b) {
      return energyEventKey(a2) - energyEventKey(b);
    });
    cards.push.apply(cards, __spreadArray5([], __read6(sortedCollectedCards), false));
    events.push.apply(events, __spreadArray5([], __read6(sortedCollectedEvents), false));
    if (state.debugEnabled) {
      var cheatSpec_1 = getSpecByName("Cheat");
      if (cheatSpec_1 !== null && !events.some(function(event) {
        return event.name === cheatSpec_1.name;
      })) {
        events.push(cheatSpec_1);
      }
    }
    var gameSetupParams = applyMetaReplacers("gameSetup", {
      par,
      vpGoal: vpTarget,
      cardSpecs: cards,
      eventSpecs: events
    }, state);
    var lookingGlassRewards = sampleLookingGlassRoundRewards(state, lookingGlassCount(state));
    var finalCards = __spreadArray5(__spreadArray5([], __read6(gameSetupParams.cardSpecs), false), __read6(lookingGlassRewards.cards), false);
    var finalEvents = __spreadArray5(__spreadArray5([], __read6(gameSetupParams.eventSpecs), false), __read6(lookingGlassRewards.events), false);
    var finalPar = Math.max(0, gameSetupParams.par);
    return {
      vp: gameSetupParams.vpGoal,
      par: finalPar,
      cards: finalCards,
      events: finalEvents,
      potions: state.data.potions,
      relics: state.data.relics,
      metaStage: state.data.stage,
      metaStageScores: __spreadArray5([], __read6(state.data.stageScores), false),
      metaStagePars: __spreadArray5([], __read6(state.data.stagePars), false),
      metaStageTooltips: stageTooltipTexts(state)
    };
  }
  function getRewardOptionCount(state) {
    var params = applyMetaReplacers("reward", { optionCount: 3 }, state);
    return params.optionCount;
  }
  function standardRelicRewards() {
    return relicRewards;
  }
  function sampleLookingGlassRoundRewards(state, targetCopies) {
    var e_17, _a, e_18, _b;
    if (state.data.phase === "path_select") {
      return { cards: [], events: [] };
    }
    var cards = [];
    var events = [];
    if (targetCopies <= 0) {
      return { cards, events };
    }
    var neededCards = 2 * targetCopies;
    var neededEvents = targetCopies;
    var ownedCardNames = new Set(state.data.collectedCards.map(function(card2) {
      return card2.name;
    }));
    var ownedEventNames = new Set(state.data.collectedEvents.map(function(event) {
      return event.name;
    }));
    var selectedCardNames = /* @__PURE__ */ new Set();
    var selectedEventNames = /* @__PURE__ */ new Set();
    var cardOrder = new Generator("".concat(state.seed, "-LOOKINGGLASS-CARDS-").concat(state.data.stage)).permute(__spreadArray5([], __read6(cardRewards), false));
    try {
      for (var cardOrder_1 = __values4(cardOrder), cardOrder_1_1 = cardOrder_1.next(); !cardOrder_1_1.done; cardOrder_1_1 = cardOrder_1.next()) {
        var card = cardOrder_1_1.value;
        if (cards.length >= neededCards)
          break;
        if (ownedCardNames.has(card.name))
          continue;
        if (selectedCardNames.has(card.name))
          continue;
        cards.push(card);
        selectedCardNames.add(card.name);
      }
    } catch (e_17_1) {
      e_17 = { error: e_17_1 };
    } finally {
      try {
        if (cardOrder_1_1 && !cardOrder_1_1.done && (_a = cardOrder_1.return)) _a.call(cardOrder_1);
      } finally {
        if (e_17) throw e_17.error;
      }
    }
    var eventOrder = new Generator("".concat(state.seed, "-LOOKINGGLASS-EVENTS-").concat(state.data.stage)).permute(__spreadArray5([], __read6(eventRewards), false));
    try {
      for (var eventOrder_1 = __values4(eventOrder), eventOrder_1_1 = eventOrder_1.next(); !eventOrder_1_1.done; eventOrder_1_1 = eventOrder_1.next()) {
        var event_1 = eventOrder_1_1.value;
        if (events.length >= neededEvents)
          break;
        if (ownedEventNames.has(event_1.name))
          continue;
        if (selectedEventNames.has(event_1.name))
          continue;
        events.push(event_1);
        selectedEventNames.add(event_1.name);
      }
    } catch (e_18_1) {
      e_18 = { error: e_18_1 };
    } finally {
      try {
        if (eventOrder_1_1 && !eventOrder_1_1.done && (_b = eventOrder_1.return)) _b.call(eventOrder_1);
      } finally {
        if (e_18) throw e_18.error;
      }
    }
    return { cards, events };
  }
  function randomChallenge(state) {
    var stage = state.data.stage;
    var generator = state.generator("challenges".concat(stage));
    var vpMode = generator.sample(vpModes);
    var isFinalStage = stage === TOTAL_STAGES - 1;
    var challengeBoons = isFinalStage ? [] : [generator.sample(boons)];
    return {
      stage,
      vpMode,
      boons: challengeBoons
    };
  }
  function makePaths(state) {
    return __awaiter3(this, void 0, void 0, function() {
      var stage, generator, baseRewardsPerPath, pathRewardParams, totalRewardsPerPath, leftRewards, rightRewards, remainingRewards, chunkSize, sampled, challenge1, challenge2;
      return __generator3(this, function(_a) {
        switch (_a.label) {
          case 0:
            stage = state.data.stage;
            generator = state.generator("paths".concat(stage)).newGenerator();
            baseRewardsPerPath = 2;
            pathRewardParams = applyMetaReplacers("pathRewards", { rewardsPerPath: baseRewardsPerPath }, state);
            return [4, trigger2({
              kind: "path",
              baseRewardsPerPath,
              rewardsPerPath: pathRewardParams.rewardsPerPath
            }, state)];
          case 1:
            _a.sent();
            totalRewardsPerPath = pathRewardParams.rewardsPerPath;
            leftRewards = [];
            rightRewards = [];
            remainingRewards = totalRewardsPerPath;
            while (remainingRewards > 0) {
              chunkSize = Math.min(3, remainingRewards);
              sampled = generator.permute(["card", "card", "event", "potion", "relic", "encounter"]);
              leftRewards.push.apply(leftRewards, __spreadArray5([], __read6(sampled.slice(0, chunkSize)), false));
              rightRewards.push.apply(rightRewards, __spreadArray5([], __read6(sampled.slice(chunkSize, chunkSize * 2)), false));
              remainingRewards -= chunkSize;
            }
            challenge1 = randomChallenge(state);
            challenge2 = randomChallenge(state);
            return [2, [
              { rewards: leftRewards, challenges: [challenge1] },
              { rewards: rightRewards, challenges: [challenge2] }
            ]];
        }
      });
    });
  }
  function pathFromSkeleton(skeleton) {
    var e_19, _a;
    var rewardStates = [];
    try {
      for (var _b = __values4(skeleton.rewards), _c = _b.next(); !_c.done; _c = _b.next()) {
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
    } catch (e_19_1) {
      e_19 = { error: e_19_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_19) throw e_19.error;
      }
    }
    return { rewardStates, challenges: skeleton.challenges };
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
    return __assign2(__assign2({}, spec), { cards: __spreadArray5([], __read6(spec.cards), false), events: __spreadArray5([], __read6(spec.events), false), potions: __spreadArray5([], __read6(spec.potions), false), relics: __spreadArray5([], __read6(spec.relics), false), metaStageScores: spec.metaStageScores ? __spreadArray5([], __read6(spec.metaStageScores), false) : void 0, metaStagePars: spec.metaStagePars ? __spreadArray5([], __read6(spec.metaStagePars), false) : void 0, metaStageTooltips: spec.metaStageTooltips ? __spreadArray5([], __read6(spec.metaStageTooltips), false) : void 0, replayUsedPotionIDs: spec.replayUsedPotionIDs ? __spreadArray5([], __read6(spec.replayUsedPotionIDs), false) : void 0 });
  }
  function cloneStageReplayData(replayData) {
    return __assign2(__assign2({}, replayData), { challenge: __assign2(__assign2({}, replayData.challenge), { boons: __spreadArray5([], __read6(replayData.challenge.boons), false) }), spec: cloneGameSpec(replayData.spec), history: __spreadArray5([], __read6(replayData.history), false), potionsRemaining: __spreadArray5([], __read6(replayData.potionsRemaining), false) });
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
    var collectedBaseNames = new Set(collected.map(function(spec) {
      return spec.name;
    }));
    var eligible = allOptions.filter(function(spec) {
      return !collectedBaseNames.has(spec.name);
    });
    return generator.samples(eligible, count);
  }
  function replaySpecForStage(state, replayData) {
    return __assign2(__assign2({}, cloneGameSpec(replayData.spec)), { metaStage: state.data.stage, metaStageScores: __spreadArray5([], __read6(state.data.stageScores), false), metaStagePars: __spreadArray5([], __read6(state.data.stagePars), false), metaStageTooltips: stageTooltipTexts(state), previousScore: replayData.score, replayUsedPotionIDs: replayUsedPotionIDs(replayData), replayStage: replayData.stage });
  }
  var replaySimulationUI = {
    chooseCard: function(_state, _prompt, _options) {
      return __awaiter3(void 0, void 0, void 0, function() {
        return __generator3(this, function(_a) {
          return [2, null];
        });
      });
    },
    playGame: function(_spec_1) {
      var args_1 = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
      }
      return __awaiter3(void 0, __spreadArray5([_spec_1], __read6(args_1), false), void 0, function(_spec, _gameHistory, _gameRedo, _macros, _viewingMacros, _onProgress) {
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
        return __generator3(this, function(_a) {
          throw new Error("Replay simulation does not support playGame");
        });
      });
    },
    waitForChallenge: function() {
      return __awaiter3(void 0, void 0, void 0, function() {
        return __generator3(this, function(_a) {
          throw new Error("Replay simulation does not support waitForChallenge");
        });
      });
    },
    pickPath: function() {
      return __awaiter3(void 0, void 0, void 0, function() {
        return __generator3(this, function(_a) {
          throw new Error("Replay simulation does not support pickPath");
        });
      });
    },
    chooseOption: function(_state, _prompt, _options) {
      return __awaiter3(void 0, void 0, void 0, function() {
        return __generator3(this, function(_a) {
          return [2, null];
        });
      });
    },
    showMessage: function() {
      return __awaiter3(void 0, void 0, void 0, function() {
        return __generator3(this, function(_a) {
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
    return __awaiter3(this, void 0, void 0, function() {
      var simulationState, data;
      return __generator3(this, function(_a) {
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
              collectedCards: [],
              collectedEvents: [],
              potions: __spreadArray5([], __read6(replayData.spec.potions), false),
              relics: __spreadArray5([], __read6(replayData.spec.relics), false),
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
      var stageScores = __spreadArray5([], __read6(snapshot.stageScores), false);
      stageScores[stage] = replayData.score;
      snapshot.stageScores = stageScores;
      var stagePars = __spreadArray5([], __read6(snapshot.stagePars), false);
      stagePars[stage] = replayData.par;
      snapshot.stagePars = stagePars;
      var stageReplays = __spreadArray5([], __read6(snapshot.stageReplays), false);
      stageReplays[stage] = cloneStageReplayData(replayData);
      snapshot.stageReplays = stageReplays;
      snapshot.buffer += bufferAdjustment;
    });
  }
  function replayCompletedStage(state, stage) {
    return __awaiter3(this, void 0, void 0, function() {
      var replayData, replayResult, e_20, macros, viewingMacros, newBufferAfterCourse, updatedReplayData, bufferAdjustment, usedPotions, stageTimelineEntry;
      var _a, _b, _c, _d;
      return __generator3(this, function(_e) {
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
            e_20 = _e.sent();
            if (e_20 instanceof Undo2) {
              macros = (_a = e_20.macros) !== null && _a !== void 0 ? _a : state.global.macros;
              viewingMacros = (_b = e_20.viewingMacros) !== null && _b !== void 0 ? _b : state.global.viewingMacros;
              state.updateGlobal({ macros, viewingMacros });
              return [
                2
                /*return*/
              ];
            }
            if (e_20 instanceof Redo)
              return [
                2
                /*return*/
              ];
            throw e_20;
          case 4:
            state.updateGlobal({
              macros: (_c = replayResult.macros) !== null && _c !== void 0 ? _c : state.global.macros,
              viewingMacros: (_d = replayResult.viewingMacros) !== null && _d !== void 0 ? _d : state.global.viewingMacros
            });
            return [4, computeReplayBufferAfterCourse(replayData, replayResult.score)];
          case 5:
            newBufferAfterCourse = _e.sent();
            updatedReplayData = __assign2(__assign2({}, replayData), { score: replayResult.score, history: __spreadArray5([], __read6(replayResult.history), false), potionsRemaining: __spreadArray5([], __read6(replayResult.potionsRemaining), false), bufferAfterCourse: newBufferAfterCourse });
            bufferAdjustment = newBufferAfterCourse - replayData.bufferAfterCourse;
            usedPotions = usedPotionNames(replayData.spec.potions, replayResult.potionsRemaining);
            applyReplayResultToAllSnapshots(state, stage, updatedReplayData, bufferAdjustment);
            stageTimelineEntry = {
              kind: "stage",
              stage,
              challenge: challengeSummary(updatedReplayData.challenge),
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
    var rewardStates = path.rewardStates.map(function(rs) {
      if (rs.kind === "encounter" && rs.encounter === null) {
        var generator = state.generator("encounter").newGenerator();
        return getEncounterState(state, generator, state.data.stage);
      } else if (rs.kind === "card" && rs.options.length === 0) {
        var generator = state.generator("rewardscard").newGenerator();
        return {
          kind: "card",
          options: sampleRewardOptionsByBaseName(generator, cardRewards, getRewardOptionCount(state), state.data.collectedCards),
          selectedIndex: null
        };
      } else if (rs.kind === "event" && rs.options.length === 0) {
        var generator = state.generator("rewardsevent").newGenerator();
        return {
          kind: "event",
          options: sampleRewardOptionsByBaseName(generator, eventRewards, getRewardOptionCount(state), state.data.collectedEvents),
          selectedIndex: null
        };
      } else if (rs.kind === "potion" && rs.options.length === 0) {
        var generator = state.generator("rewardspotion").newGenerator();
        return {
          kind: "potion",
          options: generator.samples(potionRewards, getRewardOptionCount(state)),
          selectedIndex: null
        };
      } else if (rs.kind === "relic" && rs.options.length === 0) {
        var generator = state.generator("rewardsrelic").newGenerator();
        return {
          kind: "relic",
          options: generator.samples(standardRelicRewards(), getRewardOptionCount(state)),
          selectedIndex: null
        };
      }
      return rs;
    });
    return { challenges: path.challenges, rewardStates };
  }
  function isRewardTestSpec(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "string";
  }
  function isTestSpec(value) {
    return Array.isArray(value) && value.length === 2 && typeof value[0] === "number" && Number.isInteger(value[0]) && isRewardTestSpec(value[1]);
  }
  function rewardTestsForStage(tests, stageIndex) {
    var stageNumber = stageIndex + 1;
    return tests.filter(function(_a) {
      var _b = __read6(_a, 1), stage = _b[0];
      return stage === stageNumber;
    }).map(function(_a) {
      var _b = __read6(_a, 2), spec = _b[1];
      return spec;
    });
  }
  function makeTestReward(state, spec) {
    switch (spec[0]) {
      case "potion":
      case "event":
      case "card":
        return { kind: spec[0], options: [spec[1]], selectedIndex: null };
      case "relic":
        return { kind: "relic", options: [spec[1]], selectedIndex: null };
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
    return __awaiter3(this, arguments, void 0, function(ui, test2, seed, initialSnapshot, onStateChange, debugEnabled) {
      var state, tests, initialPath, _a, _b, testSpec, _loop_1, state_1;
      var e_21, _c;
      var _d, _e;
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
      return __generator3(this, function(_f) {
        switch (_f.label) {
          case 0:
            state = initialSnapshot ? deserializeMetaGame(ui, initialSnapshot, null, debugEnabled) : new MetaState(ui, seed, null, { debugEnabled });
            state.setChangeListener(onStateChange ? function() {
              return onStateChange(serializeMetaGame(state));
            } : null);
            tests = test2 === null ? [] : isTestSpec(test2) ? [test2] : test2;
            if (!initialSnapshot) {
              initialPath = pathFromSkeleton({
                rewards: ["card", "card", "event", "potion"],
                challenges: [randomChallenge(state), randomChallenge(state)]
              });
              try {
                for (_a = __values4(rewardTestsForStage(tests, 0)), _b = _a.next(); !_b.done; _b = _a.next()) {
                  testSpec = _b.value;
                  initialPath.rewardStates.push(makeTestReward(state, testSpec));
                }
              } catch (e_21_1) {
                e_21 = { error: e_21_1 };
              } finally {
                try {
                  if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                } finally {
                  if (e_21) throw e_21.error;
                }
              }
              state.replaceAndClearHistory(__assign2(__assign2({}, materializePath(state, initialPath)), { phase: "stage_select", availablePaths: [] }));
            } else if (onStateChange) {
              onStateChange(serializeMetaGame(state));
            }
            state.ui.updateBuffer(state);
            _loop_1 = function() {
              var sameReplay_1, stage, gameSpec, startingBuffer, _g, score, potionsRemaining, history_1, macros, viewingMacros, usedPotions, persistedMacros, persistedViewingMacros, stageReplays, stageTimelineEntry, nextStage, paths, _h, _j, testSpec2, paths, path, _k, e_22, selectedChallenge, e_23, e_24, persistedMacros, persistedViewingMacros;
              var e_25, _l;
              return __generator3(this, function(_m) {
                switch (_m.label) {
                  case 0:
                    _m.trys.push([0, 29, , 30]);
                    if (!(state.data.phase === "in_game")) return [3, 6];
                    sameReplay_1 = function(a2, b) {
                      return a2.length === b.length && a2.every(function(value, index) {
                        return value === b[index];
                      });
                    };
                    stage = state.data.stage;
                    gameSpec = makeSpec(state, state.data.challenges[0]);
                    startingBuffer = state.data.buffer;
                    return [4, state.ui.playGame(gameSpec, state.data.gameHistory, state.data.gameRedo, state.global.macros, state.global.viewingMacros, function(progress) {
                      if (!sameReplay_1(state.data.gameHistory, progress.history) || !sameReplay_1(state.data.gameRedo, progress.redo)) {
                        state.update({
                          gameHistory: __spreadArray5([], __read6(progress.history), false),
                          gameRedo: __spreadArray5([], __read6(progress.redo), false)
                        });
                      }
                      state.updateGlobal({
                        macros: progress.macros,
                        viewingMacros: progress.viewingMacros
                      });
                    }, "leave")];
                  case 1:
                    _g = _m.sent(), score = _g.score, potionsRemaining = _g.potionsRemaining, history_1 = _g.history, macros = _g.macros, viewingMacros = _g.viewingMacros;
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
                    _m.sent();
                    stageReplays = __spreadArray5([], __read6(state.data.stageReplays), false);
                    stageReplays[stage] = {
                      stage,
                      challenge: __assign2(__assign2({}, state.data.challenges[0]), { boons: __spreadArray5([], __read6(state.data.challenges[0].boons), false) }),
                      spec: cloneGameSpec(gameSpec),
                      score,
                      par: gameSpec.par,
                      history: __spreadArray5([], __read6(history_1), false),
                      potionsRemaining: __spreadArray5([], __read6(potionsRemaining), false),
                      bufferBeforeCourse: startingBuffer,
                      bufferAfterCourse: state.data.buffer
                    };
                    stageTimelineEntry = {
                      kind: "stage",
                      stage,
                      challenge: challengeSummary(state.data.challenges[0]),
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
                    _m.sent();
                    return [2, { value: void 0 }];
                  case 4:
                    return [4, makePaths(state)];
                  case 5:
                    paths = _m.sent().map(function(skel) {
                      return pathFromSkeleton(skel);
                    });
                    try {
                      for (_h = (e_25 = void 0, __values4(rewardTestsForStage(tests, nextStage))), _j = _h.next(); !_j.done; _j = _h.next()) {
                        testSpec2 = _j.value;
                        paths[0].rewardStates.push(makeTestReward(state, testSpec2));
                      }
                    } catch (e_25_1) {
                      e_25 = { error: e_25_1 };
                    } finally {
                      try {
                        if (_j && !_j.done && (_l = _h.return)) _l.call(_h);
                      } finally {
                        if (e_25) throw e_25.error;
                      }
                    }
                    state.replaceAndClearHistory({
                      phase: "path_select",
                      challenges: [],
                      rewardStates: [],
                      availablePaths: paths
                    });
                    return [3, 28];
                  case 6:
                    if (!(state.data.phase === "path_select")) return [3, 17];
                    paths = state.data.availablePaths;
                    if (paths.length === 0) {
                      throw new Error("Invariant violation: path_select phase missing available paths");
                    }
                    path = void 0;
                    _m.label = 7;
                  case 7:
                    if (false) return [3, 16];
                    _m.label = 8;
                  case 8:
                    _m.trys.push([8, 12, , 15]);
                    if (!(paths.length > 1)) return [3, 10];
                    return [4, state.ui.pickPath(state, paths)];
                  case 9:
                    _k = _m.sent();
                    return [3, 11];
                  case 10:
                    _k = paths[0];
                    _m.label = 11;
                  case 11:
                    path = _k;
                    return [3, 16];
                  case 12:
                    e_22 = _m.sent();
                    if (!(e_22 instanceof ReplayStage)) return [3, 14];
                    return [4, replayCompletedStage(state, e_22.stage)];
                  case 13:
                    _m.sent();
                    return [3, 7];
                  case 14:
                    throw e_22;
                  case 15:
                    return [3, 7];
                  case 16:
                    state.replaceAndClearHistory(__assign2(__assign2({}, materializePath(state, path)), { phase: "stage_select", availablePaths: [] }));
                    return [3, 28];
                  case 17:
                    if (!(state.data.phase === "stage_select")) return [3, 27];
                    selectedChallenge = void 0;
                    _m.label = 18;
                  case 18:
                    if (false) return [3, 25];
                    _m.label = 19;
                  case 19:
                    _m.trys.push([19, 21, , 24]);
                    return [4, state.ui.waitForChallenge(state)];
                  case 20:
                    selectedChallenge = _m.sent();
                    return [3, 25];
                  case 21:
                    e_23 = _m.sent();
                    if (!(e_23 instanceof ReplayStage)) return [3, 23];
                    return [4, replayCompletedStage(state, e_23.stage)];
                  case 22:
                    _m.sent();
                    return [3, 18];
                  case 23:
                    throw e_23;
                  case 24:
                    return [3, 18];
                  case 25:
                    state.update({ challenges: [selectedChallenge], availablePaths: [] });
                    return [4, trigger2({ kind: "start", stage: state.data.stage }, state)];
                  case 26:
                    _m.sent();
                    state.updateAndSetCheckpoint({
                      phase: "in_game",
                      gameHistory: [],
                      gameRedo: []
                    });
                    return [3, 28];
                  case 27:
                    return [2, { value: void 0 }];
                  case 28:
                    return [3, 30];
                  case 29:
                    e_24 = _m.sent();
                    if (e_24 instanceof Undo2) {
                      persistedMacros = (_d = e_24.macros) !== null && _d !== void 0 ? _d : state.global.macros;
                      persistedViewingMacros = (_e = e_24.viewingMacros) !== null && _e !== void 0 ? _e : state.global.viewingMacros;
                      state.updateGlobal({
                        macros: persistedMacros,
                        viewingMacros: persistedViewingMacros
                      });
                      state.undo({
                        gameHistory: e_24.gameHistory,
                        gameRedo: e_24.gameRedo
                      });
                    } else if (e_24 instanceof Redo) {
                      state.redo();
                    } else {
                      throw e_24;
                    }
                    return [3, 30];
                  case 30:
                    return [
                      2
                      /*return*/
                    ];
                }
              });
            };
            _f.label = 1;
          case 1:
            if (false) return [3, 3];
            return [5, _loop_1()];
          case 2:
            state_1 = _f.sent();
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
  }

  // public/data/relics.js
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
  var bagOfCoins = {
    name: "Bag of Coins",
    simpleText: ["Start with an extra copper."],
    triggers: [{
      kind: "gameStart",
      text: "At the start of the game, create a copper in your discard.",
      handles: function() {
        return true;
      },
      transform: function() {
        return create(copper, "discard");
      }
    }]
  };
  relicRewards.push(bagOfCoins);
  var bagOfPreparation = {
    name: "Bag of Preparation",
    simpleText: [
      "At the start of the game, +5 actions.",
      "You can't lose actions except by paying costs."
    ],
    staticReplacers: [{
      text: "You can't lose actions (other than by paying costs).",
      kind: "resource",
      handles: function(p) {
        return p.amount < 0 && p.resource == "actions";
      },
      replace: function(p) {
        return __assign3(__assign3({}, p), { amount: 0 });
      }
    }],
    triggers: [{
      kind: "gameStart",
      handles: function() {
        return true;
      },
      text: "At the start of the game, +5 actions.",
      transform: function(_e, _s, c) {
        return gainActions(5, c);
      }
    }]
  };
  relicRewards.push(bagOfPreparation);
  var courier = {
    name: "Courier",
    simpleText: ["+2 buys each time you refresh."],
    triggers: [{
      kind: "afterUse",
      text: "After using ".concat(refresh.name, ", +2 buys."),
      handles: function(e, s, c) {
        return e.card.name === refresh.name;
      },
      transform: function(e, s, c) {
        return gainBuys(2, c);
      }
    }]
  };
  relicRewards.push(courier);
  var inkwell = {
    name: "Inkwell",
    simpleText: ["Par is 1@ higher on each course."],
    metaReplacers: [{
      kind: "gameSetup",
      replace: function(p) {
        return __assign3(__assign3({}, p), { par: p.par + 1 });
      }
    }]
  };
  relicRewards.push(inkwell);
  var elegantQuill = {
    name: "Elegant Quill",
    simpleText: ["+3@ buffer when you gain this."],
    metaTriggers: [{
      kind: "relic",
      handles: function(e, s, self) {
        return self.id == e.relic.id;
      },
      transform: function(e) {
        return addBuffer(3);
      }
    }]
  };
  relicRewards.push(elegantQuill);
  var brokenLever = {
    name: "Broken Lever",
    simpleText: ["VP targets are 25% lower."],
    metaReplacers: [{
      kind: "gameSetup",
      replace: function(p) {
        return __assign3(__assign3({}, p), { vpGoal: Math.floor(p.vpGoal * 0.75) });
      }
    }]
  };
  relicRewards.push(brokenLever);
  var cursedInkwell = {
    name: "Cursed Inkwell",
    simpleText: [
      "Par is 4@ lower on each course.",
      "Gain 3@ buffer at the start of each course."
    ],
    metaReplacers: [{
      kind: "gameSetup",
      replace: function(p) {
        return __assign3(__assign3({}, p), { par: p.par - 4 });
      }
    }],
    metaTriggers: [{
      kind: "start",
      handles: function(e) {
        return true;
      },
      transform: function(e) {
        return addBuffer(3);
      }
    }]
  };
  relicRewards.push(cursedInkwell);
  var silverMirror = {
    name: "Silver Mirror",
    simpleText: [
      "The next time you gain a relic,",
      "gain two additional copies of that relic."
    ],
    metaTriggers: [{
      kind: "relic",
      handles: function(e, _s, relic) {
        return e.relic.id !== relic.id && e.relic.name !== "Silver Mirror";
      },
      transform: function(e, _s, relic) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            return __generator4(this, function(_a) {
              switch (_a.label) {
                case 0:
                  state.removeRelic(relic.id);
                  return [4, gainRelic(e.relic.spec)(state)];
                case 1:
                  _a.sent();
                  return [4, gainRelic(e.relic.spec)(state)];
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
    }]
  };
  relicRewards.push(silverMirror);
  var sacredBark = {
    name: "Sacred Bark",
    simpleText: ["Whenever you use a potion, repeat its effect."],
    gainRequirement: function(state) {
      return state.data.buffer >= 3;
    },
    metaTriggers: [{
      kind: "relic",
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function() {
        return addBuffer(-3);
      }
    }],
    triggers: [{
      kind: "afterUse",
      text: "After using a potion other than with this, use it again.",
      handles: function(e, _state, _card) {
        return e.card.spec.isPotion === true && !sourceHasName(e.source, "Sacred Bark");
      },
      transform: function(e, _state, card) {
        return e.card.activate("potion", card);
      }
    }]
  };
  relicRewards.push(sacredBark);
  var discountCard = {
    name: "Discount card",
    simpleText: ["Silver and Gold cost $2 less to buy (but not less than $1)."],
    staticReplacers: [{
      text: "Silver and Gold cost $2 less to buy, but not less than $1.",
      kind: "cost",
      handles: function(p) {
        return p.actionKind === "buy" && (p.card.spec.name === silver.name || p.card.spec.name === gold.name);
      },
      replace: function(p) {
        var reduction = Math.max(Math.min(2, p.cost.coin - 1), 0);
        return __assign3(__assign3({}, p), { cost: addCosts(p.cost, { coin: -reduction }) });
      }
    }]
  };
  relicRewards.push(discountCard);
  var singingBowl = {
    name: "Singing Bowl",
    simpleText: ["Whenever you are offered a reward, you may gain 2@ buffer instead."]
  };
  relicRewards.push(singingBowl);
  var piggyBank = {
    name: "Piggy Bank",
    simpleText: ["One time, you can take all of the rewards from a pack."]
  };
  relicRewards.push(piggyBank);
  var matryoshkaDoll = {
    name: "Matryoshka Doll",
    simpleText: ["Your next two stages have an additional reward."],
    metaReplacers: [{
      kind: "pathRewards",
      replace: function(p, self) {
        return self.count("charge") > 0 ? __assign3(__assign3({}, p), { rewardsPerPath: p.rewardsPerPath + 1 }) : p;
      }
    }],
    metaTriggers: [{
      kind: "relic",
      handles: function(e, _s, self) {
        return self.id === e.relic.id;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            var tokens;
            return __generator4(this, function(_a) {
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
      handles: function(_e, _s, self) {
        return self.count("charge") > 0;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            var current, tokens;
            return __generator4(this, function(_a) {
              current = state.data.relics.find(function(r) {
                return r.id === self.id;
              });
              if (!current || current.count("charge") <= 0)
                return [
                  2
                  /*return*/
                ];
              tokens = new Map(current.tokens);
              tokens.set("charge", current.count("charge") - 1);
              state.applyToRelic(function(r) {
                return r.update({ tokens });
              }, current);
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
  relicRewards.push(matryoshkaDoll);
  var calledShot = {
    name: "Called Shot",
    simpleText: ["At end of the next course, gain 1 buffer for each @ you beat par."],
    metaTriggers: [{
      kind: "end",
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(e, _s, self) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            var gain;
            return __generator4(this, function(_a) {
              switch (_a.label) {
                case 0:
                  gain = Math.max(0, e.par - e.score);
                  state.removeRelic(self.id);
                  if (!(gain > 0)) return [3, 2];
                  return [4, addBuffer(gain)(state)];
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
  var delayedGratification = {
    name: "Delayed Gratification",
    simpleText: ["Your next path has an additional reward."],
    metaReplacers: [{
      kind: "pathRewards",
      replace: function(p) {
        return __assign3(__assign3({}, p), { rewardsPerPath: p.rewardsPerPath + 1 });
      }
    }],
    metaTriggers: [{
      kind: "path",
      handles: function(_e, _s, _self) {
        return true;
      },
      transform: function(_e, _s, self) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            return __generator4(this, function(_a) {
              state.removeRelic(self.id);
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
  registerSpec(calledShot);
  registerSpec(delayedGratification);
  var giftBox = {
    name: "Gift Box",
    simpleText: [
      "When you add a card to your deck,",
      "start the next course with a copy in hand."
    ],
    mutableTriggers: function(relic) {
      return [{
        kind: "gameStart",
        text: "At the start of the game, create a copy of each bottled card in your hand.",
        handles: function() {
          return true;
        },
        transform: function() {
          return function(state) {
            return __awaiter4(this, void 0, void 0, function() {
              var _a, _b, spec, e_1_1;
              var e_1, _c;
              return __generator4(this, function(_d) {
                switch (_d.label) {
                  case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values5(relic.notedCards || []), _b = _a.next();
                    _d.label = 1;
                  case 1:
                    if (!!_b.done) return [3, 4];
                    spec = _b.value;
                    return [4, create(spec, "hand")(state)];
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
      }];
    },
    metaTriggers: [{
      kind: "end",
      handles: function() {
        return true;
      },
      transform: function(e, s, relic) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            return __generator4(this, function(_a) {
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
      handles: function() {
        return true;
      },
      transform: function(e, s, relic) {
        return function(state) {
          return __awaiter4(this, void 0, void 0, function() {
            var notedCards;
            return __generator4(this, function(_a) {
              notedCards = relic.notedCards || [];
              state.applyToRelic(function(r) {
                return r.update({ notedCards: __spreadArray6(__spreadArray6([], __read7(notedCards), false), [e.card], false) });
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
  relicRewards.push(giftBox);
  var emptyBottle = {
    name: "Empty Bottle",
    simpleText: ["Whenever you gain an event, gain a potion that uses that event for free."],
    metaTriggers: [{
      kind: "event",
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
  registerSpec(emptyBottle);
  var banner = {
    name: "Banner",
    simpleText: [
      "For each 2@ you beat par,",
      "gain 1@ buffer."
    ],
    metaTriggers: [{
      kind: "end",
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
  relicRewards.push(banner);
  var questionCard = {
    name: "Question Card",
    simpleText: ["Future rewards have 2 more options."],
    metaReplacers: [{
      kind: "reward",
      replace: function(p) {
        return __assign3(__assign3({}, p), { optionCount: p.optionCount + 2 });
      }
    }]
  };
  relicRewards.push(questionCard);
  var lookingGlass = {
    name: "Looking Glass",
    simpleText: ["2 random cards and 1 random event are added to each kingdom."]
  };
  relicRewards.push(lookingGlass);

  // public/data/cards.js
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose up to three cards to put into your hand.", state.discard.filter(function(c) {
                    return c.name != Till;
                  }).map(asChoice), 3)];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
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
      transform: function(state, card) {
        return payToDo(payAction(card), playTwice(card));
      }
    };
  }
  var throneRoom = {
    name: "Throne Room",
    simpleText: ["Pay an action to play a card in your hand twice without paying any @ costs."],
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
      text: "When you play a copper, +$1.",
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
    simpleText: [
      "Put your discard into your hand.",
      "".concat(plowName, " goes to play instead of your discard when played or created.")
    ],
    fixedCost: energy(1),
    effects: [recycleEffect(), toPlay()],
    staticReplacers: [{
      kind: "create",
      text: "Whenever you would create a ".concat(plowName, ", create it in play."),
      handles: function(p) {
        return p.spec.name == plowName;
      },
      replace: function(p) {
        return __assign4(__assign4({}, p), { zone: "play" });
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
      text: "Whenever you pay @, +1 action, +$1 and +1 buy.",
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
  function chargeUpTo(max) {
    return {
      text: ["Put a charge token on this if it has less than ".concat(max, ".")],
      transform: function(state, card) {
        return card.charge >= max ? noop : charge(card, 1);
      }
    };
  }
  var investmentName = "Investment";
  var investment = {
    name: investmentName,
    simpleText: [
      "+$2.",
      "The $ produced increases by 1 each time you play this, up to +$6."
    ],
    buyCost: coin(3),
    fixedCost: energy(0),
    effects: [{
      text: ["+$1 per charge token on this."],
      transform: function(state, card) {
        return gainCoins(state.find(card).charge, card);
      }
    }, chargeUpTo(6)],
    staticReplacers: [startsWithCharge(investmentName, 2)]
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
    simpleText: [
      "+$2.",
      "The next time you buy a card, buy it again for free."
    ],
    buyCost: coin(3),
    fixedCost: energy(1),
    effects: [coinsEffect(2)],
    triggers: [{
      text: "Whenever you buy a card,\n            discard this to buy the card again.",
      kind: "buy",
      handles: function(e, state, card) {
        return state.find(card).place == "play";
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!(state2.find(card).place == "play")) return [3, 2];
                  return [4, move(card, "discard")(state2)];
                case 1:
                  state2 = _a.sent();
                  return [2, e.card.buy(card)(state2)];
                case 2:
                  return [2, state2];
              }
            });
          });
        };
      }
    }]
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
      return state.hand;
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
        return leq(x.cost("buy", state), coin(6));
      });
    }), trashThis()],
    buyCost: coin(3),
    staticTriggers: [buyTrigger(buyEffect())]
  };
  cardRewards.push(feast);
  var researcher = {
    name: "Researcher",
    simpleText: [
      "+3 actions.",
      "This increases by +1 action each time you play it."
    ],
    effects: [{
      text: ["+1 action for each charge token on this."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            var n;
            return __generator5(this, function(_a) {
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
    }, chargeEffect()],
    buyCost: coin(5),
    staticReplacers: [startsWithCharge("Researcher", 3)]
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
    simpleText: [
      "+1 action",
      "Put a shelter token on each card in play. The next time they would leave play, instead remove a shelter token."
    ],
    effects: [actionsEffect(1), {
      text: ["Put a shelter token on each card in play."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            var _a, _b, c, e_1_1;
            var e_1, _c;
            return __generator5(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values6(state2.play), _b = _a.next();
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
      kind: "gameStart",
      text: "At the start of the game, add ".concat(ruinedLab.name, " and ").concat(ruinedMarket.name, " to the supply."),
      handles: function() {
        return true;
      },
      transform: function(e, s, c) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var lab2, market2;
            var _a, _b;
            return __generator5(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, createAndTrack(ruinedLab, "supply")(state)];
                case 1:
                  _a = __read8.apply(void 0, [_c.sent(), 2]), lab2 = _a[0], state = _a[1];
                  if (lab2 != null) {
                    state = state.moveAfter("supply", lab2, c);
                  }
                  return [4, createAndTrack(ruinedMarket, "supply")(state)];
                case 2:
                  _b = __read8.apply(void 0, [_c.sent(), 2]), market2 = _b[0], state = _b[1];
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
    buyCost: coin(1),
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
      transform: function(state, card) {
        return payToDo(payCost(__assign4(__assign4({}, free), { actions: 1, effects: [discharge(card, 1), trash(card)] }), card), applyToTarget(function(target) {
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
      text: "Whenever you would move this to your hand,\n               instead put a charge token on this.",
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.toZone == "hand" && p.skip == false;
      },
      replace: function(p, s, c) {
        return __assign4(__assign4({}, p), { skip: true, effects: p.effects.concat([
          charge(c, 1)
        ]) });
      }
    }]
  };
  var mastermind = {
    simpleText: [
      "Create a ".concat(tactic.name, " in play."),
      "Whenever it would move to your hand it gains a charge token instead.",
      "Once it has a charge token, you can trash it and pay an action to play a card in your hand three times."
    ],
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
      text: "Whenever you pay @,\n               create that many ".concat(villager.name, "s and ").concat(fair.name, "s in play."),
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to discard", state.hand.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets, i;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to trash", state.discard.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
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
    simpleText: ["The next time you create a card in your hand or discard, play it immediately."],
    effects: [actionsEffect(1)],
    replacers: [playReplacer("Whenever you would create a card in your discard,\n        instead discard this to set the card aside.\n        Then play it if it is still set aside.", function(p, s, c) {
      return s.find(c).place == "play";
    }, function(p, s, c) {
      return discardFromPlay(c);
    })],
    buyCost: coin(3)
  };
  cardRewards.push(innovation);
  var formation = {
    name: "Formation",
    effects: [actionsEffect(2)],
    buyCost: coin(4),
    replacers: [{
      text: "Cards cost @ less to play if they share a name with a card in your discard or in play.",
      kind: "cost",
      handles: function(x, state) {
        return x.actionKind == "play" && state.discard.concat(state.play).some(function(c) {
          return c.name == x.card.name;
        });
      },
      replace: function(x, state, card) {
        return __assign4(__assign4({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
      }
    }]
  };
  cardRewards.push(formation);
  var coven = {
    name: "Coven",
    effects: [coinsEffect(1)],
    buyCost: coin(3),
    replacers: [{
      text: "Cards cost @ less to play if they don't share a name with a card in your discard or in play.",
      kind: "cost",
      handles: function(x, state) {
        return x.actionKind == "play" && !state.discard.concat(state.play).some(function(c) {
          return c.name == x.card.name;
        });
      },
      replace: function(x, state, card) {
        return __assign4(__assign4({}, x), { cost: subtractCost(x.cost, { energy: 1 }) });
      }
    }]
  };
  cardRewards.push(coven);
  var Traveler = "Traveler";
  var traveler = {
    simpleText: [
      "Pay an action to play a card in your hand once for each charge token on this.",
      "It starts with 1 charge token and gains 1 each time you play it, up to 3."
    ],
    name: "Traveler",
    fixedCost: energy(1),
    effects: [{
      text: ["Pay an action to play a card in your hand once for each charge token on this."],
      transform: function(state, card) {
        return payToDo(payAction(card), applyToTarget(function(target) {
          return function(state2) {
            return __awaiter5(this, void 0, void 0, function() {
              var n, i;
              return __generator5(this, function(_a) {
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
    }, chargeUpTo(3)],
    buyCost: coin(4),
    staticReplacers: [startsWithCharge(Traveler, 1)]
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
    buyCost: coin(6),
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
        return leq(x.cost("buy", state), coin(n)) && x.name != except;
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets, n, target;
            var _a, _b;
            return __generator5(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Choose any number of cards to discard.", state.hand.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_c.sent(), 2]), state = _a[0], targets = _a[1];
                  return [4, moveMany(targets, "discard")(state)];
                case 2:
                  state = _c.sent();
                  n = targets.length;
                  return [4, choice(state, "Choose a card costing $".concat(n, " to gain a copy of."), state.supply.filter(function(c) {
                    return c.cost("buy", state).coin == n;
                  }).map(asChoice))];
                case 3:
                  _b = __read8.apply(void 0, [_c.sent(), 2]), state = _b[0], target = _b[1];
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
      transform: function(state, c) {
        return charge(c, Math.ceil(state.hand.length / 2));
      }
    }],
    replacers: [{
      text: "Whenever this leaves play, remove all charge tokens from it.",
      kind: "move",
      handles: function(p, state, card) {
        return p.card.id == card.id && p.toZone != "play" && p.skip == false;
      },
      replace: function(p, state, card) {
        return __assign4(__assign4({}, p), { effects: p.effects.concat([discharge(card, p.card.charge)]) });
      }
    }],
    ability: [{
      text: ["If you have no cards in your hand, discard this for +$1 per charge token on it."],
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
          return __awaiter5(this, void 0, void 0, function() {
            var n;
            return __generator5(this, function(_a) {
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
          return __awaiter5(this, void 0, void 0, function() {
            var n;
            return __generator5(this, function(_a) {
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Discard any number of cards for +$1 each.", state.hand.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
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
          return __awaiter5(this, void 0, void 0, function() {
            var targets;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  return [4, multichoice(state, "Trash any number of cards for +1 buy each.", state.discard.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
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
      text: "Whenever you would move this to your hand,\n               instead +1 action, +1 buy, +$1, and create a ".concat(fair.name, " in play."),
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.toZone == "hand" && p.skip == false;
      },
      replace: function(p, s, c) {
        return __assign4(__assign4({}, p), { skip: true, effects: p.effects.concat([
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
      text: "After you buy a card the normal way, you may buy another card that costs less.",
      kind: "afterBuy",
      handles: function(e, state, card) {
        return state.find(card).place == "play" && e.source == "act";
      },
      transform: function(e, state, card) {
        return applyToTarget(function(target) {
          return target.buy(card);
        }, "Buy a card in the supply costing less than $".concat(e.card.cost("buy", state).coin, "."), function(state2) {
          return state2.supply.filter(function(x) {
            return leq(x.cost("buy", state2), coin(e.card.cost("buy", state2).coin - 1));
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
    simpleText: ["Cards cost $1 less to buy.", "When you create this, put it directly into play."],
    replacers: [costReduce("buy", { coin: 1 }, true)],
    buyCost: coin(5),
    staticReplacers: [startInPlay(highwayName)]
  };
  cardRewards.push(highway);
  var FairyGold = "Fairy Gold";
  var fairyGold = {
    simpleText: [
      "+$3 and +1 buy.",
      "The $ produced decreases by 1 each time you play this."
    ],
    name: FairyGold,
    effects: [buyEffect(), {
      text: ["+$1 per charge token on this."],
      transform: function(state, card) {
        return gainCoins(state.find(card).charge, card);
      }
    }, {
      text: ["Remove a charge token from this if it has any."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
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
    staticReplacers: [startsWithCharge(FairyGold, 3)]
  };
  cardRewards.push(fairyGold);
  var fortuneName = "Fortune";
  var fortune = {
    simpleText: [
      "Double your $ and buys.",
      "You can only buy Fortune once."
    ],
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
      text: "Whenever you create ".concat(a(fortuneName), ", trash this from the supply."),
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
    simpleText: ["+1 buy, +$1,", "Put a ferry token on a supply. It costs $1 less."],
    effects: [buysEffect(1), coinsEffect(1), targetedEffect(function(target) {
      return addToken(target, "ferry", 1);
    }, "Put a ferry token on a supply.", function(state) {
      return state.supply;
    })],
    rules: [ferryRule]
  };
  cardRewards.push(ferry);
  var transmogrify = {
    name: "Transmogrify",
    buyCost: coin(3),
    effects: [{
      text: ["Trash a card in your hand.", "Choose a card in the supply costing less and create a copy in your hand.", "Choose a card in the supply costing $1 or $2 more and create a copy in your hand."],
      transform: function(_, c) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, applyToTarget(function(target) {
                    return function(state2) {
                      return __awaiter5(this, void 0, void 0, function() {
                        var cost;
                        return __generator5(this, function(_a2) {
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
                                  return !leq(target.cost("buy", s), c2.cost("buy", s));
                                });
                              })(state2)];
                            case 2:
                              state2 = _a2.sent();
                              return [4, applyToTarget(function(target2) {
                                return create(target2.spec, "hand");
                              }, "Choose a more expensive card to copy.", function(s) {
                                return s.supply.filter(function(c2) {
                                  return eq(c2.cost("buy", s), addCosts(target.cost("buy", s), { coin: 1 })) || eq(c2.cost("buy", s), addCosts(target.cost("buy", s), { coin: 2 }));
                                });
                              })(state2)];
                            case 3:
                              state2 = _a2.sent();
                              return [2, state2];
                          }
                        });
                      });
                    };
                  }, "Choose a card to transmogrify.", function(s) {
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
  cardRewards.push(transmogrify);
  var harrowName = "Harrow";
  var harrow = {
    name: harrowName,
    buyCost: coin(3),
    effects: [{
      text: ["Discard any number of cards from your hand, then put that many non-".concat(harrowName, " cards from your discard into your hand.")],
      transform: function() {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            var cards, n, targets;
            var _a, _b;
            return __generator5(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Discard any number of cards.", state.hand.map(asChoice))];
                case 1:
                  _a = __read8.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                  n = cards.length;
                  return [4, moveMany(cards, "discard")(state)];
                case 2:
                  state = _c.sent();
                  return [4, multichoice(state, "Choose ".concat(n, " cards to put into your hand."), state.discard.filter(function(c) {
                    return c.name != harrowName;
                  }).map(asChoice), n, n)];
                case 3:
                  _b = __read8.apply(void 0, [_c.sent(), 2]), state = _b[0], targets = _b[1];
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
    buyCost: coin(2),
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
      text: "When you play a ".concat(silver.name, ", +1 action."),
      handles: function(e) {
        return e.card.name == silver.name;
      },
      transform: function(e, s, c) {
        return gainActions(1, c);
      }
    }, {
      kind: "play",
      text: "When you play a ".concat(gold.name, ", +1 buy."),
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
          return __awaiter5(this, void 0, void 0, function() {
            var i;
            return __generator5(this, function(_a) {
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
      return state.hand;
    })]
  };
  cardRewards.push(sculpt);
  var tapestry = {
    name: "Tapestry",
    buyCost: coin(4),
    fixedCost: energy(1),
    effects: [coinsEffect(4), createInPlayEffect(fair)]
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
      text: "After buying a card other than ".concat(copper.name, ", create ").concat(aOrNum(2, horse.name), " in your hand."),
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
          return __awaiter5(this, void 0, void 0, function() {
            var n;
            return __generator5(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state.actions;
                  return [4, payCost(__assign4(__assign4({}, free), { actions: n }), c)(state)];
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
      text: ["Play then trash up to three cards from your hand.", "Choose a card in the supply whose cost is less than or equal to the sum of their costs, and create a copy in your discard."],
      transform: function(s, card) {
        return function(state) {
          return __awaiter5(this, void 0, void 0, function() {
            function doCardPlayAndTrash(target2) {
              return function(state2) {
                return __awaiter5(this, void 0, void 0, function() {
                  return __generator5(this, function(_a2) {
                    switch (_a2.label) {
                      case 0:
                        return [4, target2.play(card)(state2)];
                      case 1:
                        state2 = _a2.sent();
                        return [4, trash(target2)(state2)];
                      case 2:
                        state2 = _a2.sent();
                        targets.push(target2);
                        return [2, state2];
                    }
                  });
                });
              };
            }
            var targets, cost, i, target;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  targets = [];
                  cost = __assign4(__assign4({}, free), { buys: 1 });
                  i = 0;
                  _b.label = 1;
                case 1:
                  if (!(i < 3)) return [3, 7];
                  target = void 0;
                  return [4, choice(state, "Choose a card to play then trash (".concat(3 - i, " remaining, $").concat(cost.coin, " total cost so far)"), allowNull(state.hand.map(asChoice)))];
                case 2:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state = _a[0], target = _a[1];
                  if (!(target === null)) return [3, 3];
                  return [3, 6];
                case 3:
                  return [4, target.play(card)(state)];
                case 4:
                  state = _b.sent();
                  return [4, trash(target)(state)];
                case 5:
                  state = _b.sent();
                  cost = addCosts(cost, target.cost("buy", state));
                  _b.label = 6;
                case 6:
                  i++;
                  return [3, 1];
                case 7:
                  return [4, applyToTarget(function(copyTarget) {
                    return create(copyTarget.spec, "discard");
                  }, "Choose a card to copy.", function(s2) {
                    return s2.supply.filter(function(c) {
                      return leq(c.cost("buy", state), cost);
                    });
                  })(state)];
                case 8:
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
    simpleText: [
      "Put a reflect token on a card in your hand.",
      "The next time you play it, play it again."
    ],
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
    simpleText: [
      "Put two non-".concat(churnName, " cards from your discard to your hand."),
      "Return one less card each time you play this."
    ],
    effects: [actionsEffect(1), {
      text: ["For each charge token on this put a non-".concat(churnName, " card from your discard into your hand.")],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            var n, cards;
            var _a;
            return __generator5(this, function(_b) {
              switch (_b.label) {
                case 0:
                  n = state2.find(card).charge;
                  return [4, multichoice(state2, "Choose ".concat(num(n, "card"), " cards to put into your hand."), state2.discard.filter(function(c) {
                    return c.name != churnName;
                  }).map(asChoice), n)];
                case 1:
                  _a = __read8.apply(void 0, [_b.sent(), 2]), state2 = _a[0], cards = _a[1];
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
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            return __generator5(this, function(_a) {
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
    staticReplacers: [startsWithCharge(churnName, 2)]
  };
  cardRewards.push(churn);
  var bustlingVillage = {
    name: "Bustling Village",
    buyCost: coin(3),
    relatedCards: [villager],
    effects: [createInPlayEffect(villager), {
      text: ["+1 action for each card in play."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter5(this, void 0, void 0, function() {
            var n;
            return __generator5(this, function(_a) {
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
    }]
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
      text: "Whenever you buy a card costing $6 or more, put all ".concat(governorName, "s in your discard into your hand."),
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
    staticTriggers: [afterBuyTrigger(createInPlayEffect(fair, 2))]
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
          return __awaiter5(this, void 0, void 0, function() {
            var i;
            return __generator5(this, function(_a) {
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
                      return leq(x.cost("buy", s), coin(8));
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
      text: "".concat(universityName, " costs $1 less per action you have, but not less than $1."),
      kind: "cost",
      handles: function(p) {
        return p.card.name == universityName && p.actionKind == "buy";
      },
      replace: function(p, s) {
        var k = Math.max(Math.min(s.actions, p.cost.coin - 1), 0);
        return __assign4(__assign4({}, p), { cost: addCosts(p.cost, { coin: -k }) });
      }
    }]
  };
  cardRewards.push(university);
  var moon = {
    name: "Moon",
    simpleText: [
      "The moon starts off full.",
      "Whenever you would move this from play, it instead toggles between full and empty."
    ],
    replacers: [{
      text: "Whenever you would move this from play and this has no charge tokens on it,\n               instead put a charge token on it (it becomes full).",
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.skip == false && c.charge == 0;
      },
      replace: function(p, s, c) {
        return __assign4(__assign4({}, p), { skip: true, effects: p.effects.concat([charge(c)]) });
      }
    }, {
      text: "Whenever you would move this from play and this has at least one charge token on it,\n               instead remove all charge tokens from it (it becomes empty).",
      kind: "move",
      handles: function(p, s, c) {
        return p.card.id == c.id && p.skip == false && c.charge > 0;
      },
      replace: function(p, s, c) {
        return __assign4(__assign4({}, p), { skip: true, effects: p.effects.concat([discharge(c, c.charge)]) });
      }
    }]
  };
  var werewolf = {
    simpleText: [
      "+1 buy.",
      "If there is a full moon, +$3.",
      "Otherwise, +3 actions.",
      "The moon starts off full and switches between full and empty each time you Refresh."
    ],
    name: "Werewolf",
    buyCost: coin(3),
    relatedCards: [moon],
    effects: [{
      text: ["+1 buy.", "If a ".concat(moon.name, " in play has an odd number of charge tokens (moon is full), +$3."), "Otherwise, +3 actions."],
      transform: function(s, c) {
        return s.play.some(function(c2) {
          return c2.name == moon.name && c2.charge % 2 == 1;
        }) ? doAll([gainBuys(1, c), gainCoins(3, c)]) : doAll([gainBuys(1, c), gainActions(3, c)]);
      }
    }],
    staticTriggers: [{
      kind: "gameStart",
      text: "At the start of the game, create ".concat(a(moon.name), " in play with a charge token."),
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
      text: "Cards cost $1 more to buy.",
      kind: "costIncrease",
      handles: function(p) {
        return p.actionKind == "buy";
      },
      replace: function(p) {
        return __assign4(__assign4({}, p), { cost: addCosts(p.cost, coin(1)) });
      }
    }, {
      text: "Events costing at least $1 cost an additional $1 to buy.",
      kind: "costIncrease",
      handles: function(p) {
        return p.actionKind == "use" && p.cost.coin > 0;
      },
      replace: function(p) {
        return __assign4(__assign4({}, p), { cost: addCosts(p.cost, coin(1)) });
      }
    }, trashOnLeavePlay()]
  };
  var contraband = {
    name: "Contraband",
    buyCost: coin(4),
    simpleText: [
      "+$5 and +5 buys.",
      "Create an Embargo in play that increases the cost of cards and events by $1 until it leaves play."
    ],
    effects: [coinsEffect(5), buysEffect(5), createInPlayEffect(embargo)],
    relatedCards: [embargo]
  };
  cardRewards.push(contraband);

  // public/data/potions.js
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
  var potionOfInspiration = {
    name: "Potion of Inspiration",
    isPotion: true,
    effects: [{
      text: ["Triple your actions and buys."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
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
    simpleText: ["Double your money and buys."],
    effects: [{
      text: ["Double your $ and buys."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
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
    simpleText: ["Create 8 coppers in your hand."],
    effects: [{
      text: ["Create 8 Coppers in your hand."],
      transform: function() {
        return repeat(create(copper, "hand"), 8);
      }
    }]
  };
  potionRewards.push(potionOfCopper);
  var bounty = {
    name: "Bounty",
    simpleText: ["The next time you buy a card, buy it again."],
    triggers: [{
      text: "Whenever you buy a card, discard this to buy the card again.",
      kind: "buy",
      handles: function(e, state, card) {
        return state.find(card).place == "play";
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  return [4, move(card, "discard")(state2)];
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
  var potionOfBounty = {
    name: "Potion of Bounty",
    isPotion: true,
    simpleText: ["The next time you buy a card, buy it three more times for free."],
    relatedCards: [bounty],
    effects: [createInPlayEffect(bounty, 3)]
  };
  potionRewards.push(potionOfBounty);
  var potionOfTransformation = {
    name: "Potion of Transformation",
    isPotion: true,
    simpleText: ["Trash any number of cards in your hand. For each one, buy a card costing up to double its cost."],
    effects: [{
      text: ["Repeat this any number of times: trash a card in your hand that was there at the start of this process, then buy a card costing up to double its cost."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var options, _loop_1, state_1;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  options = asNumberedChoices(state2.hand);
                  _loop_1 = function() {
                    var picked, trashedCost, cost_1, toBuy;
                    var _b, _c;
                    return __generator6(this, function(_d) {
                      switch (_d.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to trash", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read9.apply(void 0, [_d.sent(), 2]), state2 = _b[0], picked = _b[1];
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
                          _c = __read9.apply(void 0, [_d.sent(), 2]), state2 = _c[0], toBuy = _c[1];
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
  var sailorsBrew = {
    name: "Sailor's Brew",
    isPotion: true,
    simpleText: [
      "Put two ferry tokens on a supply. It costs $2 less."
    ],
    rules: [ferryRule],
    effects: [targetedEffect(function(target) {
      return addToken(target, "ferry", 2);
    }, "Put two ferry tokens on a supply.", function(state) {
      return state.supply;
    })]
  };
  potionRewards.push(sailorsBrew);
  var highwayPotion = {
    name: "Highway Potion",
    isPotion: true,
    effects: [{
      text: ["Create a ".concat(highway.name, " in play.")],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            return __generator6(this, function(_a) {
              return [2, create(highway, "play")(state2)];
            });
          });
        };
      }
    }],
    relatedCards: [highway],
    rules: [echoRule]
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
    }, "Choose a card in your hand to play three times.", function(state) {
      return state.hand;
    })]
  };
  potionRewards.push(royalNectar);
  var potionOfReuse = {
    name: "Potion of Reuse",
    simpleText: ["Play each card in your discard."],
    isPotion: true,
    effects: [{
      text: ["Repeat any number of times:\n                choose a card in your discard\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var cards, options, _loop_2, state_2;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.discard;
                  options = asNumberedChoices(cards);
                  _loop_2 = function() {
                    var picked, id_1;
                    var _b;
                    return __generator6(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "discard";
                          })))];
                        case 1:
                          _b = __read9.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
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
    simpleText: ["Create a ".concat(fair.name, " in play with 16 shelter tokens on it (the first 16 times it would leave play, instead remove a shelter token.).")],
    relatedCards: [fair],
    rules: [shelterRule],
    effects: [
      createInPlayEffect(fair, 1, /* @__PURE__ */ new Map([["shelter", 16]]))
    ]
  };
  potionRewards.push(potionOfFairs);
  var potionOfInsight = {
    name: "Potion of Insight",
    isPotion: true,
    simpleText: [
      "+$1, +1 action, +1 buy.",
      "Create a Fair and a Villager in play."
    ],
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
        return leq(x.cost("buy", state), coin(4));
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
    simpleText: ["Put a reflect token on each card in your hand."],
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
    simpleText: ["Play any number of cards in your hand."],
    effects: [{
      text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var cards, options, _loop_3, state_3;
            return __generator6(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_3 = function() {
                    var picked, id_2;
                    var _b;
                    return __generator6(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "hand";
                          })))];
                        case 1:
                          _b = __read9.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
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
    simpleText: [
      "Put 8 priority tokens on a supply.",
      "The next 8 times you create a card from it, play it immediately."
    ],
    rules: [priorityRule],
    effects: [targetedEffect(function(card) {
      return addToken(card, "priority", 8);
    }, "Put 8 priority tokens on a card in the supply.", function(state) {
      return state.supply;
    })]
  };
  potionRewards.push(potionOfPriority);
  var geminiBrew = {
    name: "Gemini Brew",
    isPotion: true,
    simpleText: [
      "Put a twin token on a card in your hand.",
      "Whenever you would play it, play it twice instead."
    ],
    rules: [twinRule],
    effects: [targetedEffect(function(target) {
      return addToken(target, "twin");
    }, "Put a twin token on a card in your hand.", function(state) {
      return state.hand;
    })]
  };
  potionRewards.push(geminiBrew);
  var mirrorBrew = {
    name: "Mirror Brew",
    isPotion: true,
    effects: [{
      text: ["Choose another potion you have. Create a copy of it and drink it immediately."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter6(this, void 0, void 0, function() {
            var otherPotions, options, picked;
            var _a;
            return __generator6(this, function(_b) {
              switch (_b.label) {
                case 0:
                  otherPotions = state2.potions.filter(function(p) {
                    return p.id !== card.id;
                  });
                  if (otherPotions.length === 0) {
                    return [2, state2];
                  }
                  options = asNumberedChoices(otherPotions);
                  return [4, choice(state2, "Choose a potion to copy.", allowNull(options))];
                case 1:
                  _a = __read9.apply(void 0, [_b.sent(), 2]), state2 = _a[0], picked = _a[1];
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
  var cheat = {
    name: "Cheat",
    fixedCost: free,
    simpleText: ["+100 vp."],
    effects: [pointsEffect(100)]
  };
  registerSpec(cheat);
  var hallOfMirrors = {
    name: "Hall of Mirrors",
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 5 }),
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
    simpleText: ["Play then trash any number of cards in your hand."],
    effects: [{
      text: ["Repeat any number of times:\n        play then trash a card in your hand that was also there\n        at the start of this effect and that you haven't played yet."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var cards, options, _loop_1, state_1;
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_1 = function() {
                    var picked, id_1;
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
    fixedCost: __assign5(__assign5({}, free), { coin: 1, energy: 1 }),
    simpleText: [
      "Put a parallelize token on each card in your hand.",
      "Cards cost @ less to play for each parallelize token on them."
    ],
    effects: [{
      text: ["Put a parallelize token on each card in your hand."],
      transform: function(state) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "parallelize");
        }));
      }
    }],
    staticReplacers: [{
      text: "Cards cost @ less to play for each parallelize token on them.\n            Whenever this reduces a card's cost by one or more @,\n            remove that many parallelize tokens from it.",
      kind: "cost",
      handles: function(x, state, card) {
        return x.actionKind == "play" && x.card.count("parallelize") > 0;
      },
      replace: function(x, state, card) {
        var reduction = Math.min(x.cost.energy, state.find(x.card).count("parallelize"));
        return __assign5(__assign5({}, x), { cost: __assign5(__assign5({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([
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
    simpleText: ["For each card in the supply, the next time you buy that card buy it again for free."],
    fixedCost: __assign5(__assign5({}, free), { coin: 3, energy: 1 }),
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
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 3 }),
    simpleText: [
      "Put a twin token on a card in your hand.",
      "Whenever you would play it, play it twice instead."
    ],
    effects: [targetedEffect(function(target) {
      return addToken(target, "twin");
    }, "Put a twin token on a card in your hand.", function(state) {
      return state.hand;
    })],
    rules: [twinRule]
  };
  eventRewards.push(twin);
  var expedite = {
    simpleText: ["The next time you create a card, play it immediately."],
    name: "Expedite",
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticReplacers: [playReplacer("Whenever you would create a card in your discard,\n            if this has a charge token then instead\n            remove a charge token to set the card aside.\n            Then play it if it is set aside.", function(p, s, c) {
      return s.find(c).charge > 0;
    }, function(p, s, c) {
      return charge(c, -1);
    })]
  };
  eventRewards.push(expedite);
  function removeAllSupplyTokens(token) {
    return {
      text: ["Remove all ".concat(token, " tokens from cards in the supply.")],
      transform: function(state, card) {
        return doAll(state.supply.map(function(s) {
          return removeToken(s, token, "all");
        }));
      }
    };
  }
  var synergy = {
    name: "Synergy",
    fixedCost: __assign5(__assign5({}, free), { coin: 1, energy: 1 }),
    simpleText: [
      "Put synergy tokens on two cards in the supply.",
      "Whenever you buy the more expensive one (or either if they are tied), you can buy the other one for free."
    ],
    effects: [removeAllSupplyTokens("synergy"), {
      text: ["Put synergy tokens on two cards in the supply."],
      transform: function() {
        return function(state) {
          return __awaiter7(this, void 0, void 0, function() {
            var cards, cards_1, cards_1_1, card, e_1_1;
            var _a, e_1, _b;
            return __generator7(this, function(_c) {
              switch (_c.label) {
                case 0:
                  return [4, multichoice(state, "Choose two cards to synergize.", state.supply.map(asChoice), 2, 2)];
                case 1:
                  _a = __read10.apply(void 0, [_c.sent(), 2]), state = _a[0], cards = _a[1];
                  _c.label = 2;
                case 2:
                  _c.trys.push([2, 7, 8, 9]);
                  cards_1 = __values7(cards), cards_1_1 = cards_1.next();
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
      text: "After buying a card with a synergy token other than with this, buy a different card with a synergy token with equal or lesser cost.",
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
    fixedCost: __assign5(__assign5({}, free), { coin: 6, energy: 1 }),
    simpleText: ["Play any number of cards in your hand."],
    effects: [{
      text: ["Repeat any number of times: play a card in your hand\n            that was also there at the start of this effect\n            and that you haven't played yet."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter7(this, void 0, void 0, function() {
            var cards, options, _loop_2, state_2;
            return __generator7(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.hand;
                  options = asNumberedChoices(cards);
                  _loop_2 = function() {
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
    simpleText: [
      "Put a reflect token on a card in your hand.",
      "The next time you play that card, play it twice.",
      "This costs $1 more each time you use it."
    ],
    fixedCost: coin(1),
    variableCosts: [costPer({ coin: 1 })],
    effects: [incrementCost(), targetedEffect(function(target, card) {
      return addToken(target, "reflect");
    }, "Put a reflect token on a card in your hand", function(state) {
      return state.hand;
    })],
    rules: [reflectRule]
  };
  eventRewards.push(reflect);
  var replicate = {
    name: "Replicate",
    fixedCost: energy(1),
    effects: [chargeEffect()],
    simpleText: ["The next time you buy a card, buy it again."],
    staticTriggers: [{
      text: "After buying a card other than with this,\n            remove a charge token from this to to buy the card again.",
      kind: "afterBuy",
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
    simpleText: [
      "Put 8 art tokens on a supply.",
      "Whenever you play a card with art tokens on its supply, remove art tokens instead of paying @."
    ],
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 3 }),
    name: "Lost Arts",
    effects: [targetedEffect(function(card) {
      return function(state) {
        return __awaiter7(this, void 0, void 0, function() {
          return __generator7(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [4, addToken(card, "art", 8)(state)];
              case 1:
                state = _a.sent();
                return [2, state];
            }
          });
        });
      };
    }, "Put eight art tokens on a card in the supply.", function(s) {
      return s.supply;
    })],
    staticReplacers: [{
      text: "Cards cost @ less to play for each art token on their supply.\n               Whenever this reduces a cost by one or more @,\n               remove that many art tokens.",
      kind: "cost",
      handles: function(x, state, card) {
        return x.actionKind == "play" && nameHasToken(x.card, "art", state);
      },
      replace: function(x, state, card) {
        card = state.find(card);
        var reduction = Math.min(x.cost.energy, countNameTokens(x.card, "art", state));
        return __assign5(__assign5({}, x), { cost: __assign5(__assign5({}, x.cost), { energy: x.cost.energy - reduction, effects: x.cost.effects.concat([repeat(applyToTarget(function(target) {
          return removeToken(target, "art");
        }, "Remove an art token from a supply.", function(state2) {
          return state2.supply.filter(function(c) {
            return c.name == x.card.name && c.count("art") > 0;
          });
        }), reduction)]) }) });
      }
    }]
  };
  eventRewards.push(lostArts);
  var polish = {
    name: "Polish",
    fixedCost: __assign5(__assign5({}, free), { coin: 1, energy: 1 }),
    effects: [{
      text: ["Put a polish token on each card in your hand."],
      transform: function(state) {
        return doAll(state.hand.map(function(c) {
          return addToken(c, "polish");
        }));
      }
    }],
    staticTriggers: [{
      text: "Whenever you play a card with a polish token on it,\n        remove a polish token from it and +$1.",
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
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 1 }),
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
        return leq(addCosts(target.cost("buy", state), coin(1)), card.cost("buy", state));
      });
    });
  }
  var haggle = {
    name: "Haggle",
    simpleText: ["The next time you buy a card, immediately buy a cheaper card."],
    fixedCost: energy(1),
    effects: [chargeEffect()],
    staticTriggers: [{
      kind: "afterBuy",
      text: "After buying a card, remove a charge token from this to buy a card\n        in the supply that costs at least $1 less.",
      handles: function(e, s, c) {
        return s.find(c).charge > 0;
      },
      transform: function(e, s, c) {
        return payToDo(discharge(c, 1), buyCheaper(e.card, s, c));
      }
    }]
  };
  eventRewards.push(haggle);
  var summon = {
    name: "Summon",
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 4 }),
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
    simpleText: [
      "Put a priority token on each card in the supply.",
      "Whenever you create a card with a priority token on it, remove the token to play the card immediately."
    ],
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 1 }),
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
          return leq(sup.cost("buy", state), target.cost("buy", state));
        });
      })]);
    }, "Trash a card in your hand. Choose a card in the supply with equal or lesser cost and create a copy in your hand.", function(state) {
      return state.hand;
    })]
  };
  eventRewards.push(swap);
  var hallOfEchoes = {
    name: "Hall of Echoes",
    fixedCost: __assign5(__assign5({}, free), { energy: 1, coin: 3 }),
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
    fixedCost: __assign5(__assign5({}, free), { coin: 2, energy: 1 }),
    simpleText: [
      "Choose a card in the supply.",
      "The next 5 times you buy that card, buy it again for free."
    ],
    effects: [targetedEffect(function(card) {
      return addToken(card, "duplicate", 5);
    }, "Put five duplicate tokens on a card in the supply.", function(state) {
      return state.supply;
    })],
    rules: [duplicateRule]
  };
  eventRewards.push(bulkOrder);

  // public/data/boons.js
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
  var escalate = {
    name: "Escalate",
    fixedCost: free,
    simpleText: [
      "Use Refresh.",
      "The cost of this event doubles each time you use it."
    ],
    variableCosts: [costPer(coin(1))],
    effects: [
      {
        text: ["Double the number of cost tokens on this."],
        transform: function(s, c) {
          return addToken(c, "cost", s.find(c).tokens.get("cost"));
        }
      },
      useRefresh()
    ],
    staticTriggers: [{
      text: "At the start of the game put a charge token on this.",
      kind: "gameStart",
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
    description: "Add Escalate as an event",
    parAdjustment: -9,
    cards: [],
    events: [escalate]
  });
  var travelingFair = {
    name: "Traveling Fair",
    fixedCost: coin(1),
    simpleText: [
      "+1 buy.",
      "Create a Fair in play."
    ],
    effects: [buyEffect(), createInPlayEffect(fair)],
    relatedCards: [fair]
  };
  boons.push({
    name: "Traveling Fair",
    description: "Add Traveling Fair as an event (no scaling cost)",
    parAdjustment: 0,
    cards: [],
    events: [travelingFair]
  });
  var vault = {
    name: "Vault",
    restrictions: [cannotUse],
    staticReplacers: [{
      text: "You can't lose actions, $, or buys (other than by paying costs).",
      kind: "resource",
      handles: function(p) {
        return p.amount < 0 && (p.resource == "coin" || p.resource == "actions" || p.resource == "buys");
      },
      replace: function(p) {
        return __assign6(__assign6({}, p), { amount: 0 });
      }
    }]
  };
  boons.push({
    name: "Vault",
    description: "Add Vault as an event",
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
      text: "Events cost @ less for each logistics token on them, but ".concat(refresh.name, " can't cost 0. Whenever this reduces a cost, remove a logistics token."),
      kind: "cost",
      handles: function(p) {
        return p.actionKind == "use" && p.card.count("logistics") > 0;
      },
      replace: function(p, state) {
        var card = state.find(p.card);
        var maxReduction = p.card.name == refresh.name ? p.cost.energy - 1 : p.cost.energy;
        var reduction = Math.max(Math.min(maxReduction, card.count("logistics")), 0);
        return __assign6(__assign6({}, p), { cost: __assign6(__assign6({}, p.cost), { energy: p.cost.energy - reduction, effects: p.cost.effects.concat([removeToken(card, "logistics", reduction)]) }) });
      }
    }]
  };
  boons.push({
    name: "Logistics",
    description: "Add Logistics as a card",
    parAdjustment: -1,
    cards: [logistics],
    events: []
  });
  var populate = {
    name: "Populate",
    fixedCost: free,
    restrictions: [cannotUse],
    simpleText: ["At the start of the game, buy every card in the supply."],
    staticTriggers: [{
      kind: "gameStart",
      text: "At the start of the game, buy every card in the supply.",
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter8(this, void 0, void 0, function() {
            var _a, _b, supplyCard, e_1_1;
            var e_1, _c;
            return __generator8(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values8(state2.supply), _b = _a.next();
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
    description: "Buy all cards at the start of the game.",
    parAdjustment: -9,
    cards: [],
    events: [populate]
  });
  var recover = {
    name: "Recover",
    simpleText: [
      "Put up to two cards from your discard into your hand.",
      "This costs $1 more each time you use it."
    ],
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
    description: "Add Recover as an event",
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
    description: "Add Recycle as an event",
    parAdjustment: -4,
    cards: [],
    events: [recycle]
  });
  var flourishName = "Flourish";
  var flourish = {
    name: flourishName,
    fixedCost: free,
    simpleText: [
      "Once you have 1/16 of the vp requirement, you can use this to Refresh for free.",
      "You can repeat once you reach 1/8, 1/4, and 1/2 of the requirement."
    ],
    restrictions: [{
      text: "You cannot use this if your score times the number of charge tokens on this is less than the vp goal.",
      test: function(card, state) {
        return state.points * state.find(card).charge < state.vp_goal;
      }
    }],
    effects: [
      useRefresh(),
      {
        text: ["Remove half of the charge tokens from this (rounded down)."],
        transform: function(s, c) {
          var currentCharge = s.find(c).charge;
          var toRemove = Math.floor(currentCharge / 2);
          return discharge(c, toRemove);
        }
      }
    ],
    staticTriggers: [{
      kind: "gameStart",
      text: "At the start of the game, put 16 charge tokens on this.",
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
    description: "Add Flourish as an event",
    parAdjustment: -6,
    cards: [],
    events: [flourish]
  });
  var publicWorks = {
    name: "Public Works",
    buyCost: coin(6),
    effects: [],
    replacers: [{
      text: "Events cost @ less, but ".concat(refresh.name, " can't cost 0. Whenever this reduces a cost, discard it."),
      kind: "cost",
      handles: function(p) {
        return p.actionKind == "use";
      },
      replace: function(p, state, pworks) {
        var card = state.find(p.card);
        var maxReduction = p.card.name == refresh.name ? p.cost.energy - 1 : p.cost.energy;
        var reduction = Math.max(Math.min(maxReduction, 1), 0);
        var extraEffects = reduction > 0 ? [move(pworks, "discard")] : [];
        return __assign6(__assign6({}, p), { cost: __assign6(__assign6({}, p.cost), { energy: p.cost.energy - reduction, effects: p.cost.effects.concat(extraEffects) }) });
      }
    }]
  };
  boons.push({
    name: "Public Works",
    description: "Add Public Works as a card",
    parAdjustment: -2,
    cards: [publicWorks],
    events: []
  });
  var reuse = {
    name: "Reuse",
    fixedCost: energy(1),
    simpleText: [
      "Play any number of cards in your discard that don't have a reuse token on them.",
      "Put a reuse token on each card played this way."
    ],
    effects: [{
      text: ["Repeat any number of times:\n                choose a card in your discard without a reuse token\n                that was also there at the start of this effect.\n                Play it then put a reuse token on it."],
      transform: function(state, card) {
        return function(state2) {
          return __awaiter8(this, void 0, void 0, function() {
            var cards, options, _loop_1, state_1;
            return __generator8(this, function(_a) {
              switch (_a.label) {
                case 0:
                  cards = state2.discard.filter(function(c) {
                    return c.count("reuse") == 0;
                  });
                  options = asNumberedChoices(cards);
                  _loop_1 = function() {
                    var picked, id_1;
                    var _b;
                    return __generator8(this, function(_c) {
                      switch (_c.label) {
                        case 0:
                          picked = void 0;
                          return [4, choice(state2, "Pick a card to play next.", allowNull(options.filter(function(c) {
                            return state2.find(c.value).place == "discard";
                          })))];
                        case 1:
                          _b = __read11.apply(void 0, [_c.sent(), 2]), state2 = _b[0], picked = _b[1];
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
    description: "Add Reuse as an event",
    parAdjustment: -4,
    cards: [],
    events: [reuse]
  });
  var prioritize = {
    simpleText: [
      "Choose a supply.",
      "The next 8 times you create a card from that supply, play it immediately."
    ],
    name: "Prioritize",
    fixedCost: __assign6(__assign6({}, free), { energy: 1, coin: 3 }),
    effects: [targetedEffect(function(card) {
      return addToken(card, "priority", 8);
    }, "Put 8 priority tokens on a card in the supply.", function(state) {
      return state.supply;
    })],
    rules: [priorityRule]
  };
  boons.push({
    name: "Prioritize",
    description: "Add Prioritize as an event",
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
      text: "Whenever you pay @,\n        you may put a card from your discard into your hand.",
      handles: function(e) {
        return e.cost.energy > 0;
      },
      transform: function(e) {
        return function(state) {
          return __awaiter8(this, void 0, void 0, function() {
            var n, targets;
            var _a;
            return __generator8(this, function(_b) {
              switch (_b.label) {
                case 0:
                  n = e.cost.energy;
                  return [4, multichoice(state, "Choose up to ".concat(num(n, "card"), " to put into your hand."), state.discard.map(asChoice), n)];
                case 1:
                  _a = __read11.apply(void 0, [_b.sent(), 2]), state = _a[0], targets = _a[1];
                  return [2, moveMany(targets, "hand")(state)];
              }
            });
          });
        };
      }
    }],
    replacers: [{
      kind: "move",
      text: "Whenever Composting would move to your hand, instead leave it in play.",
      handles: function(p, s, c) {
        return p.toZone == "hand" && p.card.id == c.id;
      },
      replace: function(p) {
        return __assign6(__assign6({}, p), { skip: true });
      }
    }],
    staticReplacers: [startInPlay(compostingName)]
  };
  boons.push({
    name: "Composting",
    description: "Add Composting as a card",
    parAdjustment: 0,
    cards: [composting],
    events: []
  });
  var insight = {
    name: "Insight",
    fixedCost: energy(1),
    simpleText: [
      "+1 action, +1 buy, +$1.",
      "Create a Villager and a Fair in play."
    ],
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
    description: "Add Insight as an event",
    parAdjustment: 0,
    cards: [],
    events: [insight]
  });
  var windfall = {
    name: "Windfall",
    fixedCost: free,
    simpleText: ["At the start of the game, +$15 and +5 buys."],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "gameStart",
      text: "At the start of the game, +$15 and +5 buys.",
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
    description: "Gain $15 and 5 buys at the start of the game",
    parAdjustment: -7,
    cards: [],
    events: [windfall]
  });
  var duplicateStart = {
    name: "Duplication",
    fixedCost: free,
    simpleText: ["At the start of the game, put a duplicate token on each card in the supply."],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "gameStart",
      text: "At the start of the game, put a duplicate token on each card in the supply.",
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return function(state2) {
          return __awaiter8(this, void 0, void 0, function() {
            var _a, _b, supply, e_2_1;
            var e_2, _c;
            return __generator8(this, function(_d) {
              switch (_d.label) {
                case 0:
                  _d.trys.push([0, 5, 6, 7]);
                  _a = __values8(state2.supply), _b = _a.next();
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
    }]
  };
  boons.push({
    name: "Duplication",
    description: "Start with a duplicate token on each supply.",
    parAdjustment: 0,
    cards: [],
    events: [duplicateStart]
  });

  // public/data/victory.js
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
  function chargeUpTo2(max) {
    return {
      text: ["Put a charge token on this if it has less than ".concat(max, ".")],
      transform: function(state, card) {
        return card.charge >= max ? noop : charge(card, 1);
      }
    };
  }
  var frontierName = "Frontier";
  var frontier = {
    name: frontierName,
    simpleText: [
      "+2 vp.",
      "The vp gain increases by 1vp each time you play it, up to +6vp."
    ],
    fixedCost: energy(1),
    buyCost: coin(6),
    effects: [{
      text: ["+1 vp per charge token on this."],
      transform: function(state, card) {
        return gainPoints(state.find(card).charge, card);
      }
    }, chargeUpTo2(6)],
    staticReplacers: [startsWithCharge(frontierName, 2)]
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
    simpleText: [
      "+1 vp.",
      "Leave this in your hand when you play it."
    ],
    name: territoryName,
    buyCost: coin(10),
    fixedCost: energy(1),
    effects: [pointsEffect(1)],
    staticReplacers: [{
      kind: "move",
      text: "When you play a ".concat(territoryName, " from your hand, leave it there."),
      handles: function(p) {
        return p.card.name == territoryName && p.toZone == "resolving" && p.fromZone == "hand";
      },
      replace: function(p) {
        return __assign7(__assign7({}, p), { skip: true });
      }
    }]
  };
  var farmlandName = "Farmland";
  var farmland = {
    simpleText: ["+1 vp if you played this the normal way from your hand."],
    name: farmlandName,
    fixedCost: energy(3),
    buyCost: coin(8),
    staticTriggers: [{
      kind: "play",
      text: "Whenever you play a ".concat(farmlandName, " the normal way, +1 vp."),
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
      text: "Whenever you play ".concat(a(duchy.name), ", +1 vp."),
      kind: "play",
      handles: function(e) {
        return e.card.name == duchy.name;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var philanthropy = {
    name: "Philanthropy",
    fixedCost: coin(10),
    effects: [{
      text: ["Pay all $.", "+1 vp per $ paid."],
      transform: function(s, c) {
        return function(state) {
          return __awaiter9(this, void 0, void 0, function() {
            var n;
            return __generator9(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state.coin;
                  return [4, payCost(__assign7(__assign7({}, free), { coin: n }), c)(state)];
                case 1:
                  state = _a.sent();
                  return [4, gainPoints(n, c)(state)];
                case 2:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  var thoroughfare = {
    name: "Thoroughfare",
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "play",
      text: "Whenever you play a card, +1 vp.",
      handles: function() {
        return true;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var monument = {
    name: "Monument",
    fixedCost: coin(0),
    effects: [],
    restrictions: [cannotUse],
    staticTriggers: [{
      kind: "buy",
      text: "Whenever you buy a card costing $3 or more, +1 vp.",
      handles: function(e, state) {
        var cost = e.card.cost("buy", state);
        return cost.coin >= 3;
      },
      transform: function(e, state, card) {
        return gainPoints(1, card);
      }
    }]
  };
  var capitalization = {
    name: "Capitalization",
    fixedCost: free,
    effects: [{
      text: ["Pay all $.", "+1 vp per $ paid."],
      transform: function(s, c) {
        return function(state) {
          return __awaiter9(this, void 0, void 0, function() {
            var n;
            return __generator9(this, function(_a) {
              switch (_a.label) {
                case 0:
                  n = state.coin;
                  return [4, payCost(__assign7(__assign7({}, free), { coin: n }), c)(state)];
                case 1:
                  state = _a.sent();
                  return [4, gainPoints(n, c)(state)];
                case 2:
                  state = _a.sent();
                  return [2, state];
              }
            });
          });
        };
      }
    }]
  };
  vpModes.push({ name: "Province", target: 10, cards: [province], events: [] }, { name: "Duchy", target: 15, cards: [duchy], events: [] }, { name: "Estate", target: 20, cards: [estate], events: [] }, { name: "Colony", target: 5, cards: [colony], events: [] }, { name: "Thoroughfare", target: 100, cards: [], events: [thoroughfare] }, { name: "Monument", target: 25, cards: [], events: [monument] }, { name: "Capitalization", target: 60, cards: [], events: [capitalization] }, { name: "Philanthropy", target: 40, cards: [], events: [philanthropy] }, { name: "Duke", target: 40, cards: [duchy, duke], events: [] }, { name: "Flower Market", target: 40, cards: [flowerMarket], events: [] }, { name: "Farmland", target: 5, cards: [farmland], events: [] }, { name: "Vibrant City", target: 20, cards: [vibrantCity], events: [] }, { name: "Palace", target: 20, cards: [palace], events: [] }, { name: "Territory", target: 20, cards: [territory], events: [] }, { name: "Frontier", target: 34, cards: [frontier], events: [] }, { name: "Gardens", target: 30, cards: [gardens], events: [] });

  // public/data/encounters.js
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
  var __spreadArray7 = function(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
      return true;
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
  var redesignUpgrade = registerUpgrade("redesign", {
    name: function(name) {
      return "".concat(name, "+");
    },
    cost: function(cost, kind) {
      return kind === "play" ? __assign8(__assign8({}, cost), { energy: Math.max(cost.energy - 1, 0) }) : cost;
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
      text: "Whenever a card that shares a name with this is trashed, create a card costing $1, $2, or $3 more in your hand.",
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
  var bulkPurchaseUpgrade = registerUpgrade("bulkPurchase", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [afterBuyTrigger(buysEffect(1))]
  });
  var streetFairUpgrade = registerUpgrade("streetFair", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticReplacers: [{
      kind: "create",
      text: "Whenever you would create this in your discard, instead create it in your hand.",
      handles: function(p, _state, card) {
        return p.zone === "discard" && p.spec.name === card.name;
      },
      replace: function(p) {
        return __assign8(__assign8({}, p), { zone: "hand" });
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
      return __assign8(__assign8({}, cost), { coin: Math.max(cost.coin - 2, 1) });
    }
  });
  var tacticianStrengthUpgrade = registerUpgrade("tacticianStrength", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [
      {
        kind: "gameStart",
        text: "This starts with 4 reflect tokens.",
        handles: function(_e, state, sourceCard) {
          return true;
        },
        transform: function(_e, _state, sourceCard) {
          return addToken(sourceCard, "reflect", 4);
        }
      },
      {
        text: "After using this other than with this ability, if it has a reflect token on it remove the token to use it again.",
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
      kind: "gameStart",
      text: "This starts with 2 reduction tokens on it.",
      handles: function(_e, state, sourceCard) {
        return state.find(sourceCard).count("reduce") === 0;
      },
      transform: function(_e, _state, sourceCard) {
        return addToken(sourceCard, "reduce", 2);
      }
    }],
    staticReplacers: [{
      kind: "cost",
      text: "This costs @ less to use for each reduction token on it. Whenever this reduces a cost, remove that many reduction tokens.",
      handles: function(params, state, sourceCard) {
        return params.actionKind === "use" && params.card.id === sourceCard.id && state.find(sourceCard).count("reduce") > 0;
      },
      replace: function(params, state, sourceCard) {
        var available = state.find(sourceCard).count("reduce");
        var reduction = Math.min(available, params.cost.energy, 1);
        if (reduction <= 0)
          return params;
        return __assign8(__assign8({}, params), { cost: __assign8(__assign8({}, params.cost), { energy: params.cost.energy - reduction, effects: params.cost.effects.concat([removeToken(params.card, "reduce", reduction, true)]) }) });
      }
    }]
  });
  var tacticianCooperationUpgrade = registerUpgrade("tacticianCooperation", {
    name: function(name) {
      return "".concat(name, "+");
    },
    staticTriggers: [{
      kind: "afterUse",
      text: "Every time you use this, use another event that's cheaper or equal for free.",
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
  function standardRelicRewards2() {
    return relicRewards;
  }
  function upgradeCardSpec(spec, upgrade) {
    return __assign8(__assign8({}, spec), { upgrades: __spreadArray7(__spreadArray7([], __read12(spec.upgrades || []), false), [upgrade], false) });
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
      var hasEvents = metaState.data.collectedEvents.length > 0;
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
                    return [4, metaState.ui.chooseCard(metaState, "Choose a card to bottle:", __spreadArray7([], __read12(metaState.data.collectedCards), false), true)];
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
          label: "Bottle an event",
          description: "Choose an event from your deck, and gain a potion that uses that event for free.",
          disabled: d.selectedIndex !== null || !hasEvents,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var event;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose an event to bottle:", __spreadArray7([], __read12(metaState.data.collectedEvents), false), true)];
                  case 1:
                    event = _a.sent();
                    if (!event) {
                      return [2, { newData: data }];
                    }
                    return [2, {
                      newData: { selectedIndex: 1 },
                      transform: gainPotion(makeBottledEventPotion(event), {
                        details: "Bottled event ".concat(displayName(event))
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
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 2 },
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
          checked: d.selectedIndex === 3,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: { selectedIndex: 3 },
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
                return [4, metaState.ui.chooseCard(metaState, "Choose a card to upgrade:", __spreadArray7([], __read12(metaState.data.collectedCards), false), true)];
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
                            cards = __spreadArray7([], __read12(state.data.collectedCards), false);
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
          label: "Redesign",
          description: "Reduce the play cost by @1 (not below @0).",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(redesignUpgrade, 2, "Redesign")];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(blacksmith);
  var enchantress = {
    name: "Enchantress",
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
                return [4, metaState.ui.chooseCard(metaState, "Choose a card to enchant:", __spreadArray7([], __read12(metaState.data.collectedCards), false), true)];
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
                            cards = __spreadArray7([], __read12(state.data.collectedCards), false);
                            cardIndex = cards.indexOf(card);
                            if (!(cardIndex >= 0)) return [3, 2];
                            cards[cardIndex] = updated;
                            state.update({ collectedCards: cards });
                            return [4, addTimelineAction("Enchantress: Upgraded ".concat(chosenName, " with ").concat(upgradeName))(state)];
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
          label: "Transmute",
          description: "After playing this, trash it and buy a card costing up to $2 more.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(transmuteUpgrade, 0, "Transmute")];
              });
            });
          }
        },
        {
          label: "Fortify",
          description: "When this is trashed, create a card costing $1, $2, or $3 more in your hand.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(fortifyUpgrade, 1, "Fortify")];
              });
            });
          }
        },
        {
          label: "Possess",
          description: "When you buy this, trash a card in hand and copy one costing up to $2 more into hand.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(possessUpgrade, 2, "Possess")];
              });
            });
          }
        }
      ];
    }
  };
  registerEncounter(enchantress);
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
                return [4, metaState.ui.chooseCard(metaState, "Choose a card to upgrade:", __spreadArray7([], __read12(metaState.data.collectedCards), false), true)];
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
                            cards = __spreadArray7([], __read12(state.data.collectedCards), false);
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
          label: "Bulk purchase",
          description: "Add: whenever you buy this, +1 buy.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(bulkPurchaseUpgrade, 0, "Bulk purchase")];
              });
            });
          }
        },
        {
          label: "Street fair",
          description: "Add: whenever this would be created in discard, create it in hand instead.",
          disabled: selectedIndex !== null || !hasCards,
          checked: selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, chooseUpgrade(streetFairUpgrade, 1, "Street fair")];
              });
            });
          }
        },
        {
          label: "Sale",
          description: "Reduce buy cost by $2 (not below $1).",
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
                return [4, metaState.ui.chooseCard(metaState, "Choose an event to upgrade:", __spreadArray7([], __read12(metaState.data.collectedEvents), false), true)];
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
                            events = __spreadArray7([], __read12(state.data.collectedEvents), false);
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
        offers: generator.samples(potionRewards, 4)
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      var _a = __read12(d.offers, 4), first = _a[0], second = _a[1], third = _a[2], fourth = _a[3];
      var bundleDetail = "Potion Shop bundle for 3@: with ".concat(displayName(third), " and ").concat(displayName(fourth));
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
                  newData: __assign8(__assign8({}, d), { selectedIndex: 0 }),
                  transform: gainPotion(first, { details: "Potion Shop: free sample" })
                }];
              });
            });
          }
        },
        {
          label: "Buy ".concat(displayName(second)),
          description: "Spend 1@ to take this potion.",
          tooltipSpec: second,
          disabled: d.selectedIndex !== null || metaState.data.buffer < 1,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign8(__assign8({}, d), { selectedIndex: 1 }),
                  transform: compose(addBuffer(-1), gainPotion(second, { details: "Potion Shop: paid 1@" }))
                }];
              });
            });
          }
        },
        {
          label: "Buy ".concat(displayName(third), " + ").concat(displayName(fourth)),
          description: "Spend 3@ to take both potions.",
          disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a2) {
                return [2, {
                  newData: __assign8(__assign8({}, d), { selectedIndex: 2 }),
                  transform: compose(addBuffer(-3), gainPotion(third, { details: bundleDetail }), gainPotion(fourth, { details: bundleDetail }))
                }];
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
          label: "House special",
          description: "Gain 2 copies of ".concat(offerName, "."),
          tooltipSpec: d.offer,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 0,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: __assign8(__assign8({}, d), { selectedIndex: 0 }),
                  transform: compose(addTimelineAction("Potion Lab: House special", "Gained two ".concat(offerName)), gainPotion(d.offer, { silent: true }), gainPotion(d.offer, { silent: true }))
                }];
              });
            });
          }
        },
        {
          label: "Mirror brew",
          spec: mirrorBrew,
          disabled: d.selectedIndex !== null,
          checked: d.selectedIndex === 1,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: __assign8(__assign8({}, d), { selectedIndex: 1 }),
                  transform: gainPotion(mirrorBrew, { details: "Potion Lab" })
                }];
              });
            });
          }
        },
        {
          label: "Sacred bark",
          spec: sacredBark,
          disabled: d.selectedIndex !== null || metaState.data.buffer < 3,
          checked: d.selectedIndex === 2,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              return __generator10(this, function(_a) {
                return [2, {
                  newData: __assign8(__assign8({}, d), { selectedIndex: 2 }),
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
        offerRelic: generator.sample(standardRelicRewards2())
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
                  newData: __assign8(__assign8({}, currentData), { selectedIndex: 0 }),
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
                  newData: __assign8(__assign8({}, currentData), { selectedIndex: 1 }),
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
                  newData: __assign8(__assign8({}, currentData), { selectedIndex: 2 }),
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
                  newData: __assign8(__assign8({}, currentData), { selectedIndex: 3 }),
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
        offerRelic: generator.sample(standardRelicRewards2()),
        cardTraded: false,
        eventTraded: false,
        potionTraded: false,
        relicTraded: false
      };
    },
    getOptions: function(data, metaState) {
      var _this = this;
      var d = data;
      return [
        {
          label: "Trade Card for ".concat(displayName(d.offerCard)),
          description: "Give up one of your cards to receive this one.",
          tooltipSpec: d.offerCard,
          disabled: d.cardTraded || metaState.data.collectedCards.length === 0,
          checked: d.cardTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var card;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a card to trade away:", __spreadArray7([], __read12(metaState.data.collectedCards), false), true)];
                  case 1:
                    card = _a.sent();
                    if (!card)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign8(__assign8({}, d), { cardTraded: true }),
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
          disabled: d.eventTraded || metaState.data.collectedEvents.length === 0,
          checked: d.eventTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var event;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose an event to trade away:", __spreadArray7([], __read12(metaState.data.collectedEvents), false), true)];
                  case 1:
                    event = _a.sent();
                    if (!event)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign8(__assign8({}, d), { eventTraded: true }),
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
          disabled: d.potionTraded || metaState.data.potions.length === 0,
          checked: d.potionTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var potion;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a potion to trade away:", __spreadArray7([], __read12(metaState.data.potions), false), true)];
                  case 1:
                    potion = _a.sent();
                    if (!potion)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign8(__assign8({}, d), { potionTraded: true }),
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
          disabled: d.relicTraded || metaState.data.relics.length === 0,
          checked: d.relicTraded,
          onClick: function() {
            return __awaiter10(_this, void 0, void 0, function() {
              var relic;
              var _this2 = this;
              return __generator10(this, function(_a) {
                switch (_a.label) {
                  case 0:
                    return [4, metaState.ui.chooseCard(metaState, "Choose a relic to trade away:", metaState.data.relics, true)];
                  case 1:
                    relic = _a.sent();
                    if (!relic)
                      return [2, { newData: data }];
                    return [2, {
                      newData: __assign8(__assign8({}, d), { relicTraded: true }),
                      transform: function(state) {
                        return __awaiter10(_this2, void 0, void 0, function() {
                          return __generator10(this, function(_a2) {
                            switch (_a2.label) {
                              case 0:
                                state.removeRelic(relic.id);
                                return [4, gainRelic(d.offerRelic, {
                                  details: "Traded away ".concat(displayName(relic.spec))
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
        }
      ];
    }
  };
  registerEncounter(tradingPost, { minStage: 4 });
  var cursedInkwell2 = {
    name: "Cursed Inkwell",
    simpleText: ["Par is 1@ lower on each course."],
    metaReplacers: [{
      kind: "gameSetup",
      replace: function(p) {
        return __assign8(__assign8({}, p), { par: p.par - 1 });
      }
    }]
  };
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
        transform: compose(addBuffer(5), gainRelic(cursedInkwell2))
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

  // public/progressSidebar.js
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
      for (var stages_1 = __values9(stages), stages_1_1 = stages_1.next(); !stages_1_1.done; stages_1_1 = stages_1.next()) {
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

  // public/gameUI.js
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
  function showElement(el) {
    el.removeAttribute("hidden");
  }
  function hideElement(el) {
    el.setAttribute("hidden", "");
  }
  function updateGameProgressSidebar(spec) {
    var _a, _b;
    var currentStage = spec.metaStage;
    var activeStage = (_a = spec.replayStage) !== null && _a !== void 0 ? _a : spec.metaStage;
    var stageScores = spec.metaStageScores || [];
    var stagePars = spec.metaStagePars || [];
    var stageTooltips = spec.metaStageTooltips || [];
    var replayStage = spec.replayStage;
    var displays = [];
    for (var stage = 0; stage < BASE_PARS.length; stage++) {
      var display = { stage };
      var basePar = BASE_PARS[stage];
      var tooltip = (_b = stageTooltips[stage]) !== null && _b !== void 0 ? _b : basePar === void 0 ? null : "".concat(basePar, " (base)");
      if (tooltip !== null)
        display.tooltipText = tooltip.replace(/, /g, "\n");
      if (currentStage !== void 0 && stage < currentStage) {
        display.completed = true;
        var score = stageScores[stage];
        var par = stagePars[stage];
        if (score !== null && score !== void 0 && par !== null && par !== void 0) {
          display.scoreText = "".concat(score, "/").concat(par);
          if (score > par)
            display.scoreColor = "red";
          else if (score < par)
            display.scoreColor = "green";
        }
      } else if (currentStage !== void 0 && stage === currentStage) {
        display.current = true;
        if (basePar !== void 0) {
          display.scoreText = "".concat(basePar);
        }
      } else if (basePar !== void 0) {
        display.scoreText = "".concat(basePar);
      }
      if (activeStage !== null && activeStage !== void 0 && stage === activeStage) {
        display.scoreText = "?/".concat(spec.par);
      }
      if (replayStage !== null && replayStage !== void 0 && stage === replayStage) {
        display.replaying = true;
      }
      displays.push(display);
    }
    renderProgressSidebar("#progressLineGame", displays);
  }
  var clearMacroDeleteMenuHandlers = null;
  var activeMacroDeleteMenu = null;
  var inGameDeckDialogOpen = false;
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
      return __assign9({}, step);
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
      startPrompt: macro.startPrompt
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
      for (var cards_1 = __values10(cards), cards_1_1 = cards_1.next(); !cards_1_1.done; cards_1_1 = cards_1.next()) {
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
    var names = new Set(__spreadArray8(__spreadArray8([], __read13(start.keys()), false), __read13(current.keys()), false));
    try {
      for (var names_1 = __values10(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
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
      if (i > 0 && isRefreshStep(steps[i - 1])) {
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
      for (var required_1 = __values10(required), required_1_1 = required_1.next(); !required_1_1.done; required_1_1 = required_1.next()) {
        var _b = __read13(required_1_1.value, 2), name_2 = _b[0], minimum = _b[1];
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
            return __spreadArray8([], __read13(tokens.entries()), false).filter(function(_a3) {
              var _b2 = __read13(_a3, 2), _ = _b2[0], v = _b2[1];
              return v > 0;
            }).map(function(_a3) {
              var _b2 = __read13(_a3, 2), k = _b2[0], v = _b2[1];
              return "".concat(k).concat(v);
            }).sort().join(",");
          }
          function cardGroupKey(card2) {
            return "".concat(card2.name, "|").concat(tokenSketch(card2.tokens));
          }
          var seenGroups = /* @__PURE__ */ new Set();
          var groupRank = 0;
          try {
            for (var cards_2 = __values10(cards), cards_2_1 = cards_2.next(); !cards_2_1.done; cards_2_1 = cards_2.next()) {
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
          for (var options_1 = __values10(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
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
          for (var options_2 = __values10(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
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
          for (var tokens_1 = __values10(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
            var _b = __read13(tokens_1_1.value, 2), token = _b[0], count = _b[1];
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
          for (var tokens_2 = __values10(tokens), tokens_2_1 = tokens_2.next(); !tokens_2_1.done; tokens_2_1 = tokens_2.next()) {
            var _b = __read13(tokens_2_1.value, 2), token = _b[0], count = _b[1];
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
      for (var _b = __values10(cardSpecEffects(spec)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray8([], __read13(effect.text), false));
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
      for (var _b = __values10(spec.ability || []), _c = _b.next(); !_c.done; _c = _b.next()) {
        var effect = _c.value;
        parts.push.apply(parts, __spreadArray8([], __read13(effect.text.map(function(x) {
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
    return "<div>".concat(desc, " ").concat(x.text, "</div>");
  }
  function renderVariableCosts2(cs) {
    return cs.map(function(c) {
      return "<div>(cost) +".concat(c.text, "</div>");
    }).join("");
  }
  function renderBuyable2(bs) {
    return bs.filter(function(b) {
      return b.text;
    }).map(function(b) {
      return "<div>(req) ".concat(b.text, "</div>");
    }).join("");
  }
  function isZero2(c) {
    return !c || renderCost(c) === "";
  }
  function actionCostKindForSpec2(spec) {
    return spec.buyCost === void 0 ? "use" : "play";
  }
  function renderRuleText2(rule) {
    var e_11, _a, e_12, _b;
    var parts = [];
    try {
      for (var _c = __values10(rule.triggers || []), _d = _c.next(); !_d.done; _d = _c.next()) {
        var trigger3 = _d.value;
        parts.push("<div>(rule) ".concat(trigger3.text, "</div>"));
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
    try {
      for (var _e = __values10(rule.replacers || []), _f = _e.next(); !_f.done; _f = _e.next()) {
        var replacer = _f.value;
        parts.push("<div>(rule) ".concat(replacer.text, "</div>"));
      }
    } catch (e_12_1) {
      e_12 = { error: e_12_1 };
    } finally {
      try {
        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
      } finally {
        if (e_12) throw e_12.error;
      }
    }
    return parts.join("");
  }
  function cardText2(spec) {
    return [
      spec.restrictions ? renderBuyable2(spec.restrictions) : "",
      spec.variableCosts ? renderVariableCosts2(spec.variableCosts) : "",
      renderEffects2(spec),
      renderAbility2(spec),
      cardSpecTriggers(spec).map(function(x) {
        return renderTrigger2(x, false);
      }).join(""),
      cardSpecReplacers(spec).map(function(x) {
        return renderTrigger2(x, false);
      }).join(""),
      cardSpecStaticTriggers(spec).map(function(x) {
        return renderTrigger2(x, true);
      }).join(""),
      cardSpecStaticReplacers(spec).map(function(x) {
        return renderTrigger2(x, true);
      }).join(""),
      (spec.rules || []).map(renderRuleText2).join("")
    ].join("");
  }
  function renderTooltipSimple(card, state, tokenRenderer) {
    function renderRelatedSimple(spec) {
      var relatedBuyCost = cardSpecCost(spec, "buy");
      var relatedActionCost = cardSpecCost(spec, actionCostKindForSpec2(spec));
      var relatedBuyStr = !isZero2(relatedBuyCost) ? "(".concat(renderCost(relatedBuyCost), ")") : "---";
      var relatedCostStr = !isZero2(relatedActionCost) ? "(".concat(renderCost(relatedActionCost), ")") : "---";
      var relatedHeader = "<div>---".concat(relatedBuyStr, " ").concat(displayName(spec), " ").concat(relatedCostStr, "---</div>");
      var relatedBody = spec.simpleText && (spec.upgrades || []).length === 0 ? spec.simpleText.map(function(line) {
        return "<div>".concat(line, "</div>");
      }).join("") : cardText2(spec);
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
    var bodyText = card.spec.simpleText && (card.spec.upgrades || []).length === 0 ? card.spec.simpleText.map(function(line) {
      return "<div>".concat(line, "</div>");
    }).join("") : cardText2(card.spec);
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
    var costType = zone === "events" ? "use" : "play";
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
  function buildSpecTooltip2(spec) {
    var buyCost = cardSpecCost(spec, "buy");
    var actionCost = cardSpecCost(spec, actionCostKindForSpec2(spec));
    var buyStr = !isZero2(buyCost) ? "(".concat(renderCost(buyCost), ")") : "---";
    var costStr = !isZero2(actionCost) ? "(".concat(renderCost(actionCost), ")") : "---";
    var header = "<div>---".concat(buyStr, " ").concat(displayName(spec), " ").concat(costStr, "---</div>");
    var baseFilling = header + cardText2(spec);
    var relatedFilling = (spec.relatedCards || []).map(buildSpecTooltip2).join("");
    return baseFilling + relatedFilling;
  }
  function renderSpecNoRelated2(spec) {
    var buyCost = cardSpecCost(spec, "buy");
    var actionCost = cardSpecCost(spec, actionCostKindForSpec2(spec));
    var buyText = isZero2(buyCost) ? "" : "(".concat(renderCost(buyCost), ")&nbsp;");
    var costText = isZero2(actionCost) ? "" : "&nbsp;(".concat(renderCost(actionCost), ")");
    var header = "<div>".concat(buyText, "<strong>").concat(displayName(spec), "</strong>").concat(costText, "</div>");
    var displayText = spec.simpleText && (spec.upgrades || []).length === 0 ? spec.simpleText.map(function(line) {
      return "<div>".concat(line, "</div>");
    }).join("") : cardText2(spec);
    var tooltipHtml = buildSpecTooltip2(spec);
    return "<div class='spec'>".concat(header).concat(displayText, "<span class='tooltip'>").concat(tooltipHtml, "</span></div>");
  }
  function sketchMap(x) {
    return __spreadArray8([], __read13(x.entries()), false).filter(function(_a) {
      var _b = __read13(_a, 2), _ = _b[0], v = _b[1];
      return v > 0;
    }).map(function(_a) {
      var _b = __read13(_a, 2), k = _b[0], v = _b[1];
      return "".concat(k).concat(v);
    }).sort().join(",");
  }
  function sketchCard(card, settings) {
    return "".concat(card.name).concat(sketchMap(card.tokens)).concat(getIfDef(settings.pickMap, card.id)).concat(getIfDef(settings.optionsMap, card.id));
  }
  function sketchCards(cards, settings) {
    var e_13, _a;
    var sketches = [];
    var counts = /* @__PURE__ */ new Map();
    var first = /* @__PURE__ */ new Map();
    var last = /* @__PURE__ */ new Map();
    try {
      for (var cards_3 = __values10(cards), cards_3_1 = cards_3.next(); !cards_3_1.done; cards_3_1 = cards_3.next()) {
        var card = cards_3_1.value;
        var s = sketchCard(card, settings);
        if (!counts.has(s)) {
          sketches.push(s);
          first.set(s, card);
        }
        counts.set(s, (counts.get(s) || 0) + 1);
        last.set(s, card);
      }
    } catch (e_13_1) {
      e_13 = { error: e_13_1 };
    } finally {
      try {
        if (cards_3_1 && !cards_3_1.done && (_a = cards_3.return)) _a.call(cards_3);
      } finally {
        if (e_13) throw e_13.error;
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
      var _c = __read13(_a, 2), _ = _c[0], data = _c[1];
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
    var e_14, _a;
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
      for (var zoneNames_1 = __values10(zoneNames), zoneNames_1_1 = zoneNames_1.next(); !zoneNames_1_1.done; zoneNames_1_1 = zoneNames_1.next()) {
        var zone = zoneNames_1_1.value;
        renderZone(state, zone, settings);
      }
    } catch (e_14_1) {
      e_14 = { error: e_14_1 };
    } finally {
      try {
        if (zoneNames_1_1 && !zoneNames_1_1.done && (_a = zoneNames_1.return)) _a.call(zoneNames_1);
      } finally {
        if (e_14) throw e_14.error;
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
    var e_15, _a;
    try {
      for (var logTypes_1 = __values10(logTypes), logTypes_1_1 = logTypes_1.next(); !logTypes_1_1.done; logTypes_1_1 = logTypes_1.next()) {
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
    } catch (e_15_1) {
      e_15 = { error: e_15_1 };
    } finally {
      try {
        if (logTypes_1_1 && !logTypes_1_1.done && (_a = logTypes_1.return)) _a.call(logTypes_1);
      } finally {
        if (e_15) throw e_15.error;
      }
    }
    displayLogLines(state.logs[logType], ui);
  }
  function displayLogLines(logs, ui) {
    var e_16, _a;
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
      for (var _b = __values10(logs.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read13(_c.value, 2), i = _d[0], _e = __read13(_d[1], 2), _ = _e[0], state = _e[1];
        _loop_2(i, _, state);
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
    var e_17, _a, e_18, _b, e_19, _c;
    if (picks === void 0) {
      picks = [];
    }
    var optionsMap = /* @__PURE__ */ new Map();
    var stringOptions = [];
    try {
      for (var options_3 = __values10(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
        var option = options_3_1.value;
        var rendered = option.render;
        if (rendered.kind === "string") {
          stringOptions.push({ render: rendered.string, value: option.value });
        } else if (rendered.kind === "card") {
          optionsMap.set(rendered.card.id, option.value);
        }
      }
    } catch (e_17_1) {
      e_17 = { error: e_17_1 };
    } finally {
      try {
        if (options_3_1 && !options_3_1.done && (_a = options_3.return)) _a.call(options_3);
      } finally {
        if (e_17) throw e_17.error;
      }
    }
    var pickMap = /* @__PURE__ */ new Map();
    try {
      for (var _d = __values10(picks.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
        var _f = __read13(_e.value, 2), i = _f[0], x = _f[1];
        pickMap.set(renderKey(x), i);
      }
    } catch (e_18_1) {
      e_18 = { error: e_18_1 };
    } finally {
      try {
        if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
      } finally {
        if (e_18) throw e_18.error;
      }
    }
    var hotkeyMap = globalRendererState.hotkeysOn ? globalRendererState.hotkeyMapper.map(state, options) : /* @__PURE__ */ new Map();
    renderState(state, { hotkeyMap, optionsMap, pickMap, updateURL: false });
    if (ui) {
      setVisibleLog(state, globalRendererState.logType, ui);
      bindLogTypeButtons(state, ui);
    }
    getElement("choicePrompt").innerHTML = choicePrompt;
    var optionsEl = getElement("options");
    clearElement(optionsEl);
    try {
      for (var stringOptions_1 = __values10(stringOptions), stringOptions_1_1 = stringOptions_1.next(); !stringOptions_1_1.done; stringOptions_1_1 = stringOptions_1.next()) {
        var option = stringOptions_1_1.value;
        var hotkey = hotkeyMap.get(option.render);
        optionsEl.appendChild(renderStringOption(option, hotkey, pickMap.get(option.render)));
      }
    } catch (e_19_1) {
      e_19 = { error: e_19_1 };
    } finally {
      try {
        if (stringOptions_1_1 && !stringOptions_1_1.done && (_c = stringOptions_1.return)) _c.call(stringOptions_1);
      } finally {
        if (e_19) throw e_19.error;
      }
    }
    getElement("undoArea").innerHTML = renderSpecials(state);
    if (ui)
      bindSpecials(state, ui);
  }
  function renderSpecials(state) {
    return [
      renderBack(),
      renderUndo(state.undoable()),
      renderRedo(state.redo.length > 0),
      renderHotkeyToggle(),
      renderMacroToggle(),
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
    bindInGameDeckDialog(state);
    bindBack(ui);
  }
  function renderInGameDeckSection(title, specs) {
    if (specs.length === 0) {
      return "<div class='deckSection'><div class='deckSectionHeader'><strong>".concat(title, ":</strong></div><div class='deckSectionItems'><div class='saveSeed'>None</div></div></div>");
    }
    var cards = specs.map(function(spec) {
      return renderSpecNoRelated2(spec);
    }).join("");
    return "<div class='deckSection'><div class='deckSectionHeader'><strong>".concat(title, ":</strong></div><div class='deckSectionItems'>").concat(cards, "</div></div>");
  }
  function buildRelicDisplaySpecs(state) {
    return state.relics.map(function(relic) {
      return relic.name === "Winged Boots" ? __assign9(__assign9({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(relic.count("charge"), ")") }) : relic.spec;
    });
  }
  function showInGameDeckDialog(state) {
    var sections = [
      renderInGameDeckSection("Cards", state.spec.cards),
      renderInGameDeckSection("Events", state.spec.events),
      renderInGameDeckSection("Potions", state.potions.map(function(p) {
        return p.spec;
      })),
      renderInGameDeckSection("Relics", buildRelicDisplaySpecs(state))
    ].join("");
    getElement("deckContents").innerHTML = sections;
    getElement("deckDialog").setAttribute("active", "true");
    inGameDeckDialogOpen = true;
  }
  function hideInGameDeckDialog() {
    getElement("deckDialog").setAttribute("active", "false");
    inGameDeckDialogOpen = false;
  }
  function bindInGameDeckDialog(state) {
    var deckIcon = getElement("deckIcon");
    deckIcon.onclick = function() {
      if (inGameDeckDialogOpen)
        hideInGameDeckDialog();
      else
        showInGameDeckDialog(state);
    };
    getElement("deckClose").onclick = function() {
      return hideInGameDeckDialog();
    };
  }
  function bindBack(ui) {
    function pick() {
      if (ui.choiceState) {
        var state = ui.choiceState.state;
        var history_1 = state.origin().future;
        var redo = state.redo;
        ui.choiceState.reject(new UndoPastBeginning(history_1, redo, ui.exportPersistenceData()));
      }
    }
    keyListeners.set("Escape", pick);
    var el = querySelector("[option='back']");
    if (el)
      el.onclick = pick;
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
  function makeMacroButtons(ui, container, state) {
    closeMacroDeleteMenu();
    var macroButtons = ui.macros.map(function(macro, index) {
      return renderPlayMacroButton(macro, index, canPlayMacro(macro, state, ui.choiceState));
    });
    var contents = __spreadArray8([renderRecordMacroButton(ui)], __read13(macroButtons), false).join("");
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
    var buttonText = "".concat(firstStepText, " (").concat(macro.steps.length, ")");
    var statusAttr = enabled ? "choosable" : "disabled='disabled'";
    var styleAttr = enabled ? "" : "style='cursor:default;'";
    return "<span id='playMacro' class='option macroOption' option='macro".concat(index, "' ").concat(statusAttr, " chosen='false' ").concat(styleAttr, "><span class='macroOptionLabel'>").concat(buttonText, "</span><span class='tooltip'>").concat(renderMacroTooltip(macro), "</span></span>");
  }
  function bindRecordMacroButton(ui, state) {
    var el = querySelector("[option='recordMacro']");
    if (el) {
      el.onclick = function() {
        if (ui.recordingMacro === null) {
          ui.recordingMacro = {
            steps: [],
            requirements: emptyMacroRequirements(),
            startPrompt: ui.choiceState ? ui.choiceState.choicePrompt : null
          };
          ui.recordingStates = [state];
        } else if (ui.choiceState === null || ui.recordingMacro.steps.length === 0) {
          ui.recordingMacro = null;
          ui.recordingStates = [];
        } else {
          console.log(ui.recordingMacro.steps);
          console.log(ui.recordingStates);
          ui.recordingMacro.requirements = computeMacroRequirements(ui.recordingStates, ui.recordingMacro.steps);
          ui.macros.push(cloneMacro(ui.recordingMacro));
          ui.recordingMacro = null;
          ui.recordingStates = [];
        }
        makeMacroButtons(ui, getElement("macroSpot"), state);
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
          ui.playingMacro = repeat2(ui.macros[i2].steps, e.shiftKey ? 10 : 1);
          ui.macroStartState = ui.choiceState.state;
          ui.resolveWithMacro();
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
        return __assign9(__assign9({}, x), { verb });
      case "card":
        return { kind: "card", card: macroCardSnapshotFromCard(x.card), chosen, verb };
      default:
        return assertNever2(x);
    }
  }
  function macroMismatch(card, macroCard) {
    var e_20, _a, e_21, _b;
    var result = 0;
    try {
      for (var _c = __values10(card.tokens), _d = _c.next(); !_d.done; _d = _c.next()) {
        var _e = __read13(_d.value, 2), token = _e[0], count = _e[1];
        if ((macroCard.tokens.get(token) || 0) < count)
          result++;
      }
    } catch (e_20_1) {
      e_20 = { error: e_20_1 };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_20) throw e_20.error;
      }
    }
    try {
      for (var _f = __values10(macroCard.tokens), _g = _f.next(); !_g.done; _g = _f.next()) {
        var _h = __read13(_g.value, 2), token = _h[0], count = _h[1];
        if ((card.tokens.get(token) || 0) < count)
          result++;
      }
    } catch (e_21_1) {
      e_21 = { error: e_21_1 };
    } finally {
      try {
        if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
      } finally {
        if (e_21) throw e_21.error;
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
        var _b = __read13(_a, 1), r = _b[0];
        return r.kind === "string" && r.string === macro.string;
      });
      return renders.length > 0 ? renders[0][1] : null;
    }
    renders = renders.filter(function(_a) {
      var _b = __read13(_a, 1), r = _b[0];
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
        this.choiceState = null;
        this.macros = loadMacros(initialMacros);
      }
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
          var cs_1 = this.choiceState;
          if (this.onProgress) {
            this.onProgress(__assign9({ history: __spreadArray8([], __read13(cs_1.state.origin().future), false), redo: __spreadArray8([], __read13(cs_1.state.future), false) }, this.exportPersistenceData()));
          }
          renderChoice(this, cs_1.state, cs_1.choicePrompt, cs_1.options.map(function(x, i) {
            return __assign9(__assign9({}, x), { value: function(shifted) {
              return cs_1.resolve(i, shifted);
            } });
          }), cs_1.chosen.map(function(i) {
            return cs_1.options[i].render;
          }));
        }
      };
      GameUI2.prototype.choice = function(state, choicePrompt, options, info, chosen) {
        var ui = this;
        return new Promise(function(resolve, reject) {
          function newResolve(n, shifted) {
            ui.clearChoice();
            var macroStep = macroStepFromChoice(options[n].render, chosen.includes(n), info);
            ui.observeRecordingState(state);
            ui.recordStep(macroStep);
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
              ui.playingMacro = [];
              ui.macroStartState = null;
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
        return __awaiter11(this, void 0, void 0, function() {
          var ui;
          return __generator11(this, function(_a) {
            ui = this;
            return [2, new Promise(function(resolve, reject) {
              ui.undoing = true;
              function newReject(reason) {
                if (reason instanceof Undo)
                  ui.undoing = true;
                ui.clearChoice();
                reject(reason);
              }
              var options = [{
                render: { kind: "string", string: "Done" },
                value: null,
                hotkeyHint: { kind: "key", val: "!" }
              }];
              ui.choiceState = {
                state,
                choicePrompt: "You won using ".concat(state.energy, " energy!"),
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
    return __awaiter11(this, arguments, void 0, function(spec, initialHistory, initialRedo, initialMacros, initialViewingMacros, onProgress, undoAtBeginning) {
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
      return __generator11(this, function(_a) {
        switch (_a.label) {
          case 0:
            initHotkeys();
            resetGlobalRenderer();
            closeMacroDeleteMenu();
            globalRendererState.viewingMacros = initialViewingMacros;
            ui = new GameUI(initialMacros, onProgress, undoAtBeginning);
            showElement(getElement("gameContainer"));
            hideElement(getElement("stageScreen"));
            hideElement(getElement("pathSelectionScreen"));
            hideElement(getElement("victoryScreen"));
            hideElement(getElement("gameOverScreen"));
            updateGameProgressSidebar(spec);
            return [4, playGame(spec, ui, initialHistory, initialRedo)];
          case 1:
            result = _a.sent();
            return [2, __assign9(__assign9({}, result), ui.exportPersistenceData())];
        }
      });
    });
  }

  // public/metaUI.js
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
  function showElement2(el) {
    el.removeAttribute("hidden");
  }
  function hideElement2(el) {
    el.setAttribute("hidden", "");
  }
  function showScreen(screen) {
    var e_1, _a;
    var screens = {
      stage: "stageScreen",
      path: "pathSelectionScreen",
      game: "gameContainer",
      victory: "victoryScreen",
      gameOver: "gameOverScreen"
    };
    try {
      for (var _b = __values11(Object.entries(screens)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read14(_c.value, 2), name_1 = _d[0], id = _d[1];
        var el = getElement2(id);
        if (name_1 === screen) {
          showElement2(el);
        } else {
          hideElement2(el);
        }
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
    getElement2("bufferDisplay").textContent = "Buffer: ".concat(state.data.buffer);
  }
  function updateProgressSidebar(state, onReplayStage) {
    var renderLine = function(selector, inGameSidebar) {
      var displays = [];
      var _loop_1 = function(stage2) {
        var display = { stage: stage2 };
        var basePar = BASE_PARS[stage2];
        var currentStagePar = stage2 === state.data.stage && state.data.challenges.length === 1 ? makeSpec(state, state.data.challenges[0]).par : null;
        var tooltip = basePar === void 0 ? "" : "".concat(basePar, " (base)");
        if (stage2 < state.data.stage) {
          var replayData = state.data.stageReplays[stage2];
          if (replayData !== null) {
            tooltip = describeParCalculation(stage2, replayData.challenge, replayData.spec.relics);
          }
        } else if (stage2 === state.data.stage && currentStagePar !== null) {
          tooltip = describeParCalculation(stage2, state.data.challenges[0], state.data.relics);
        }
        display.tooltipText = tooltip.replace(/, /g, "\n");
        if (stage2 < state.data.stage) {
          display.completed = true;
          var score = state.data.stageScores[stage2];
          var par = state.data.stagePars[stage2];
          if (score !== null && par !== null) {
            display.scoreText = "".concat(score, "/").concat(par);
            if (score > par)
              display.scoreColor = "red";
            else if (score < par)
              display.scoreColor = "green";
          }
          if (!inGameSidebar && onReplayStage && state.data.stageReplays[stage2] !== null) {
            display.replayable = true;
            display.onClick = function() {
              return onReplayStage(stage2);
            };
          }
        } else if (stage2 === state.data.stage) {
          display.current = true;
          if (state.data.phase === "in_game" && currentStagePar !== null)
            display.scoreText = "?/".concat(currentStagePar);
          else if (basePar !== void 0)
            display.scoreText = "".concat(basePar);
        } else {
          if (basePar !== void 0)
            display.scoreText = "".concat(basePar);
        }
        displays.push(display);
      };
      for (var stage = 0; stage < BASE_PARS.length; stage++) {
        _loop_1(stage);
      }
      renderProgressSidebar(selector, displays);
    };
    renderLine("#progressLine", false);
    renderLine("#progressLinePath", false);
    renderLine("#progressLineGame", true);
  }
  function encounterTooltipText(rewardState, state) {
    var e_2, _a;
    if (rewardState.kind !== "encounter" || rewardState.encounter === null)
      return "";
    var options = getRewardOptions(rewardState, state);
    if (options.length === 0)
      return "";
    var lines = [];
    try {
      for (var options_1 = __values11(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
        var option = options_1_1.value;
        var text = option.description ? "".concat(option.label, ": ").concat(option.description) : option.label;
        lines.push(text);
      }
    } catch (e_2_1) {
      e_2 = { error: e_2_1 };
    } finally {
      try {
        if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
      } finally {
        if (e_2) throw e_2.error;
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
    var e_3, _a;
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
      for (var options_2 = __values11(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
        var card = options_2_1.value;
        _loop_2(card);
      }
    } catch (e_3_1) {
      e_3 = { error: e_3_1 };
    } finally {
      try {
        if (options_2_1 && !options_2_1.done && (_a = options_2.return)) _a.call(options_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }
    var cancelBtn = getElement2("cardPickerCancel");
    if (canCancel) {
      showElement2(cancelBtn);
      cancelBtn.onclick = function() {
        return close(onCancel);
      };
    } else {
      hideElement2(cancelBtn);
    }
    showDialog("cardPickerDialog");
    if (canCancel) {
      unbindDismiss = bindDialogDismiss("cardPickerDialog", function() {
        return close(onCancel);
      });
    }
  }
  function showOptionPicker(prompt, options, canCancel, onSelect, onCancel) {
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
      for (var options_3 = __values11(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
        var option = options_3_1.value;
        _loop_3(option);
      }
    } catch (e_4_1) {
      e_4 = { error: e_4_1 };
    } finally {
      try {
        if (options_3_1 && !options_3_1.done && (_a = options_3.return)) _a.call(options_3);
      } finally {
        if (e_4) throw e_4.error;
      }
    }
    var cancelBtn = getElement2("encounterCancel");
    if (canCancel) {
      showElement2(cancelBtn);
      cancelBtn.onclick = function() {
        return close(onCancel);
      };
    } else {
      hideElement2(cancelBtn);
    }
    showDialog("encounterDialog");
    if (canCancel) {
      unbindDismiss = bindDialogDismiss("encounterDialog", function() {
        return close(onCancel);
      });
    }
  }
  function renderStageScreen(state, onChallenge, onOptionClick, onReplayStage) {
    var e_5, _a;
    showScreen("stage");
    renderCommonUI(state, onReplayStage);
    getElement2("stageTitle").textContent = "Stage ".concat(state.data.stage + 1);
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
        var optionEl;
        if (option.spec) {
          var hasRelatedContent = (option.spec.relatedCards || []).length > 0 || (option.spec.rules || []).length > 0;
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
    var challengeContainer = getElement2("challengeButtons");
    clearElement2(challengeContainer);
    var _loop_4 = function(challenge2) {
      var playBtn = createSpan("option");
      playBtn.setAttribute("choosable", "");
      playBtn.innerHTML = renderChallenge(challenge2, state);
      playBtn.onclick = function() {
        return onChallenge(challenge2);
      };
      challengeContainer.appendChild(playBtn);
    };
    try {
      for (var _b = __values11(state.data.challenges), _c = _b.next(); !_c.done; _c = _b.next()) {
        var challenge = _c.value;
        _loop_4(challenge);
      }
    } catch (e_5_1) {
      e_5 = { error: e_5_1 };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_5) throw e_5.error;
      }
    }
  }
  function renderPathSelectionScreen(state, paths, onSelect, onReplayStage) {
    showScreen("path");
    renderCommonUI(state, onReplayStage);
    console.assert(paths.length === 2, "Expected exactly two paths");
    var _a = __read14(paths, 2), leftPath = _a[0], rightPath = _a[1];
    getElement2("pathTitle").textContent = "Stage ".concat(state.data.stage + 1, " - Choose Your Path");
    renderPathColumn("left", leftPath, state);
    renderPathColumn("right", rightPath, state);
    getElement2("goLeft").onclick = function() {
      return onSelect(leftPath);
    };
    getElement2("goRight").onclick = function() {
      return onSelect(rightPath);
    };
  }
  function renderPathColumn(side, path, state) {
    var e_6, _a;
    var rewardsContainer = getElement2("".concat(side, "Rewards"));
    clearElement2(rewardsContainer);
    try {
      for (var _b = __values11(path.rewardStates), _c = _b.next(); !_c.done; _c = _b.next()) {
        var rewardState = _c.value;
        var rewardDiv = createDiv("pathReward");
        rewardDiv.textContent = getRewardName(rewardState);
        rewardsContainer.appendChild(rewardDiv);
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
    getElement2("".concat(side, "Play")).innerHTML = renderChallenge(path.challenges[0], state);
  }
  var deckDialogOpen = false;
  function showDeckDialog(state) {
    var e_7, _a, e_8, _b;
    var container = getElement2("deckContents");
    clearElement2(container);
    var relicDisplaySpecs = state.data.relics.map(function(relic) {
      return relic.name === "Winged Boots" ? __assign10(__assign10({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(relic.count("charge"), ")") }) : relic.spec;
    });
    var sections = [
      { title: "Cards", items: state.data.collectedCards },
      { title: "Events", items: state.data.collectedEvents },
      { title: "Potions", items: state.data.potions.map(function(p) {
        return p.spec;
      }) },
      { title: "Relics", items: relicDisplaySpecs }
    ];
    var hasContent = false;
    try {
      for (var sections_1 = __values11(sections), sections_1_1 = sections_1.next(); !sections_1_1.done; sections_1_1 = sections_1.next()) {
        var section = sections_1_1.value;
        if (section.items.length > 0) {
          hasContent = true;
          var sectionDiv = createDiv("deckSection");
          var header = createDiv("deckSectionHeader");
          header.innerHTML = "<strong>".concat(section.title, ":</strong>");
          sectionDiv.appendChild(header);
          var itemsRow = createDiv("deckSectionItems");
          try {
            for (var _c = (e_8 = void 0, __values11(section.items)), _d = _c.next(); !_d.done; _d = _c.next()) {
              var spec = _d.value;
              itemsRow.appendChild(createElementFromHTML2(renderSpecNoRelated(spec)));
            }
          } catch (e_8_1) {
            e_8 = { error: e_8_1 };
          } finally {
            try {
              if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            } finally {
              if (e_8) throw e_8.error;
            }
          }
          sectionDiv.appendChild(itemsRow);
          container.appendChild(sectionDiv);
        }
      }
    } catch (e_7_1) {
      e_7 = { error: e_7_1 };
    } finally {
      try {
        if (sections_1_1 && !sections_1_1.done && (_a = sections_1.return)) _a.call(sections_1);
      } finally {
        if (e_7) throw e_7.error;
      }
    }
    if (!hasContent) {
      var msg = createDiv();
      msg.textContent = "No items collected yet.";
      container.appendChild(msg);
    }
    getElement2("deckClose").onclick = hideDeckDialog;
    showDialog("deckDialog");
    deckDialogOpen = true;
  }
  function hideDeckDialog() {
    hideDialog("deckDialog");
    deckDialogOpen = false;
  }
  var MetaGameUI = (
    /** @class */
    (function() {
      function MetaGameUI2() {
        initHotkeys();
      }
      MetaGameUI2.prototype.chooseCard = function(state_1, prompt_1, options_4) {
        return __awaiter12(this, arguments, void 0, function(state, prompt, options, canCancel) {
          if (canCancel === void 0) {
            canCancel = true;
          }
          return __generator12(this, function(_a) {
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
        return __awaiter12(this, arguments, void 0, function(state, prompt, options, canCancel) {
          if (canCancel === void 0) {
            canCancel = true;
          }
          return __generator12(this, function(_a) {
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
        return __awaiter12(this, void 0, void 0, function() {
          var _this = this;
          return __generator12(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              var escapeListener = function() {
                return finishReject(new ExitToLauncher());
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
                    state.update({ challenges: [challenge] });
                    updateProgressSidebar(state);
                    finishResolve(challenge);
                  },
                  // onOptionClick
                  function(rewardIndex, optionIndex) {
                    return __awaiter12(_this, void 0, void 0, function() {
                      var rewardState, options, option, _a2, newData, transform, noOpCancel, newRewardState;
                      return __generator12(this, function(_b) {
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
                            noOpCancel = rewardState.kind === "encounter" && transform === void 0 && newData === rewardState.data;
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
        return __awaiter12(this, void 0, void 0, function() {
          return __generator12(this, function(_a) {
            return [2, new Promise(function(resolve, reject) {
              var escapeListener = function() {
                return finishReject(new ExitToLauncher());
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
        return __awaiter12(this, void 0, void 0, function() {
          return __generator12(this, function(_a) {
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
  var test = [
    [1, ["potion", potionOfWealth]],
    [2, ["relic", sacredBark]],
    [2, ["encounter", potionLab]]
  ];
  var SAVE_STORAGE_KEY = "roguelike.ongoingSaves.v1";
  var MAX_LAUNCHER_SAVES = 10;
  var summaryMetaUI = {
    chooseCard: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
          return [2, null];
        });
      });
    },
    playGame: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
          throw new Error("Summary UI does not support playGame");
        });
      });
    },
    waitForChallenge: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
          throw new Error("Summary UI does not support waitForChallenge");
        });
      });
    },
    pickPath: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
          throw new Error("Summary UI does not support pickPath");
        });
      });
    },
    chooseOption: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
          return [2, null];
        });
      });
    },
    showMessage: function() {
      return __awaiter13(void 0, void 0, void 0, function() {
        return __generator13(this, function(_a) {
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
  function isDebugEnabledFromURL() {
    var params = new URLSearchParams(window.location.search);
    return params.has("debug");
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
        return slot && slot.id && slot.snapshot && slot.seed;
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
  function upsertSaveSlot(id, snapshot) {
    var slots = loadSaveSlots();
    var updated = {
      id,
      updatedAt: Date.now(),
      seed: snapshot.seed,
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
      for (var ids_1 = __values12(ids), ids_1_1 = ids_1.next(); !ids_1_1.done; ids_1_1 = ids_1.next()) {
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
    style.textContent = "\n        #saveLauncher {\n            min-height: 100vh;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: #f6f6f8;\n            color: #222;\n            font-family: system-ui, -apple-system, sans-serif;\n        }\n        #saveLauncherCard {\n            width: min(760px, 92vw);\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 12px;\n            padding: 20px;\n            box-shadow: 0 8px 30px rgba(0,0,0,0.08);\n        }\n        #saveLauncherHeader {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 12px;\n        }\n        #saveList {\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            margin-top: 14px;\n        }\n        .saveRow {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 10px 12px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            gap: 10px;\n            background: #fcfcfd;\n        }\n        .saveMeta {\n            display: flex;\n            flex-direction: column;\n            gap: 2px;\n        }\n        .saveSeed {\n            font-size: 0.8em;\n            color: #777;\n        }\n        .saveActions {\n            display: flex;\n            gap: 8px;\n        }\n        .launcherBtn {\n            border: 1px solid #bbb;\n            border-radius: 6px;\n            padding: 6px 10px;\n            background: #fff;\n            cursor: pointer;\n        }\n        .launcherBtn:hover {\n            border-color: #777;\n        }\n        .dangerBtn {\n            border-color: #d33;\n            color: #b11;\n        }\n        #newGameDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n        }\n        #allSavesDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.25);\n            z-index: 45;\n        }\n        #allSavesCard {\n            width: min(900px, 95vw);\n            max-height: 90vh;\n            overflow: hidden;\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            box-sizing: border-box;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        #allSavesList {\n            overflow-y: auto;\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n            padding-right: 4px;\n        }\n        #newGameCard {\n            background: white;\n            border-radius: 10px;\n            border: 1px solid #ddd;\n            padding: 16px 28px 16px 16px;\n            width: auto;\n            max-width: 92vw;\n            box-sizing: border-box;\n            overflow: hidden;\n            display: flex;\n            flex-direction: column;\n            gap: 10px;\n        }\n        #newGameCard label {\n            font-size: 0.9em;\n            color: #555;\n        }\n        #newGameSeedInput {\n            display: block;\n            font-size: 1.1em;\n            padding: 8px;\n            border: 1px solid #ccc;\n            border-radius: 6px;\n            width: 260px;\n            max-width: 100%;\n            box-sizing: border-box;\n            align-self: flex-start;\n        }\n        #emptySaves {\n            font-size: 0.95em;\n            color: #666;\n            padding: 8px 2px;\n        }\n        .saveFootnote {\n            margin-top: 10px;\n            font-size: 0.85em;\n            color: #777;\n        }\n        .negativeBuffer {\n            color: #b00020;\n            font-weight: 700;\n        }\n        #viewGameDialog {\n            position: fixed;\n            inset: 0;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            background: rgba(0,0,0,0.3);\n            z-index: 50;\n            padding: 20px 0;\n        }\n        #viewGameCard {\n            width: min(1100px, 96vw);\n            max-height: calc(100vh - 40px);\n            overflow-y: auto;\n            background: white;\n            border: 1px solid #ddd;\n            border-radius: 10px;\n            padding: 16px;\n            box-sizing: border-box;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n        }\n        .viewHeader {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 10px;\n        }\n        .viewDeckSection {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 8px;\n            background: #fcfcfd;\n        }\n        .viewDeckTitle {\n            font-weight: 600;\n            margin-bottom: 6px;\n            color: #333;\n        }\n        .viewDeckCards {\n            display: flex;\n            flex-wrap: wrap;\n            gap: 6px;\n        }\n        #viewTimeline {\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            padding: 8px;\n            background: #fcfcfd;\n            display: flex;\n            flex-direction: column;\n            gap: 6px;\n        }\n        .timelineRow {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            gap: 10px;\n            border-bottom: 1px solid #eee;\n            padding: 4px 0;\n        }\n        .timelineText {\n            display: flex;\n            align-items: baseline;\n            gap: 8px;\n            flex-wrap: wrap;\n        }\n        .timelinePrimary {\n            font-size: 0.95em;\n            color: #333;\n        }\n        .timelineSecondary {\n            font-size: 0.82em;\n            color: #777;\n        }\n    ";
    document.head.appendChild(style);
  }
  function runGame(slotID, snapshot, seed) {
    return __awaiter13(this, void 0, void 0, function() {
      var debugEnabled, activeTest, seedDisplay, metaUI, saveCallback, error_1;
      var _a;
      return __generator13(this, function(_b) {
        switch (_b.label) {
          case 0:
            debugEnabled = isDebugEnabledFromURL();
            activeTest = debugEnabled ? test : null;
            seedDisplay = document.getElementById("seedDisplay");
            if (seedDisplay)
              seedDisplay.textContent = "Seed: ".concat(seed);
            setCoreUIVisible(true);
            (_a = document.getElementById("saveLauncher")) === null || _a === void 0 ? void 0 : _a.remove();
            clearLauncherDialogs();
            metaUI = new MetaGameUI();
            saveCallback = function(nextSnapshot) {
              upsertSaveSlot(slotID, nextSnapshot);
            };
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, 4, 5]);
            return [4, playGame2(metaUI, activeTest, seed, snapshot, saveCallback, debugEnabled)];
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
    var _a, _b, _c;
    (_a = document.getElementById("newGameDialog")) === null || _a === void 0 ? void 0 : _a.remove();
    (_b = document.getElementById("viewGameDialog")) === null || _b === void 0 ? void 0 : _b.remove();
    (_c = document.getElementById("allSavesDialog")) === null || _c === void 0 ? void 0 : _c.remove();
  }
  function runReplayFromSnapshot(slot, stage) {
    return __awaiter13(this, void 0, void 0, function() {
      var seedDisplay, state, replayData, bufferDisplay, error_2;
      var _a;
      return __generator13(this, function(_b) {
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
              bufferDisplay.textContent = "Buffer: ".concat(replayData.bufferBeforeCourse);
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
    var _a, _b, _c;
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
      return {
        primary: "Stage ".concat(entry.stage + 1, ": ").concat(entry.action),
        secondary: (_c = entry.details) !== null && _c !== void 0 ? _c : null
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
    var e_2, _a;
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
        for (var specs_1 = __values12(specs), specs_1_1 = specs_1.next(); !specs_1_1.done; specs_1_1 = specs_1.next()) {
          var spec = specs_1_1.value;
          var wrap = document.createElement("div");
          wrap.innerHTML = renderSpecNoRelated(spec);
          cards.appendChild(wrap.firstElementChild);
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (specs_1_1 && !specs_1_1.done && (_a = specs_1.return)) _a.call(specs_1);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }
    section.appendChild(cards);
    return section;
  }
  function openViewDialog(slot) {
    var e_3, _a;
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
    status.textContent = "".concat(done ? "Victory!" : "Stage ".concat(state.data.stage + 1), " \u2022 Buffer ").concat(state.data.buffer, " \u2022 Seed ").concat(slot.seed);
    if (state.data.buffer < 0)
      status.className = "negativeBuffer";
    card.appendChild(status);
    var relicDisplaySpecs = state.data.relics.map(function(relic) {
      return relic.name === "Winged Boots" ? __assign11(__assign11({}, relic.spec), { name: "".concat(relic.spec.name, " (").concat(relic.count("charge"), ")") }) : relic.spec;
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
            return __awaiter13(_this, void 0, void 0, function() {
              return __generator13(this, function(_a2) {
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
        for (var _b = __values12(state.data.timeline), _c = _b.next(); !_c.done; _c = _b.next()) {
          var entry = _c.value;
          _loop_1(entry);
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
    primary.textContent = done ? "Victory! \u2022 Buffer ".concat(slot.snapshot.data.buffer) : "Stage ".concat(slot.snapshot.data.stage + 1, " \u2022 Buffer ").concat(slot.snapshot.data.buffer);
    if (slot.snapshot.data.buffer < 0) {
      primary.className = "negativeBuffer";
    }
    var seedLine = document.createElement("div");
    seedLine.className = "saveSeed";
    seedLine.textContent = "Seed: ".concat(slot.seed);
    meta.appendChild(primary);
    meta.appendChild(seedLine);
    var actions = document.createElement("div");
    actions.className = "saveActions";
    if (!done) {
      var continueButton = document.createElement("button");
      continueButton.className = "launcherBtn";
      continueButton.textContent = "Continue";
      continueButton.onclick = function() {
        return __awaiter13(_this, void 0, void 0, function() {
          return __generator13(this, function(_a) {
            return [2, runGame(slot.id, slot.snapshot, slot.seed)];
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
    var e_4, _a;
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
    var close = document.createElement("button");
    close.className = "launcherBtn";
    close.textContent = "Close";
    close.onclick = function() {
      return dialog.remove();
    };
    header.appendChild(title);
    header.appendChild(close);
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
        for (var slots_1 = __values12(slots), slots_1_1 = slots_1.next(); !slots_1_1.done; slots_1_1 = slots_1.next()) {
          var slot = slots_1_1.value;
          _loop_2(slot);
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (slots_1_1 && !slots_1_1.done && (_a = slots_1.return)) _a.call(slots_1);
        } finally {
          if (e_4) throw e_4.error;
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
    var e_5, _a;
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
    var title = document.createElement("h2");
    title.textContent = "engine-roguelike";
    title.style.margin = "0";
    var headerActions = document.createElement("div");
    headerActions.className = "saveActions";
    var newButton = document.createElement("button");
    newButton.className = "launcherBtn";
    newButton.textContent = "new game";
    newButton.onclick = function() {
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
        return __awaiter13(_this, void 0, void 0, function() {
          var seed, slotID;
          return __generator13(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                seed = normalizeSeed(seedInput.value) || randomString();
                slotID = "".concat(Date.now(), "-").concat(Math.floor(Math.random() * 1e6));
                return [4, runGame(slotID, null, seed)];
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
      seedInput.addEventListener("keydown", function(event) {
        return __awaiter13(_this, void 0, void 0, function() {
          return __generator13(this, function(_a2) {
            switch (_a2.label) {
              case 0:
                if (event.key !== "Enter")
                  return [
                    2
                    /*return*/
                  ];
                event.preventDefault();
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
    header.appendChild(title);
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
        for (var slots_2 = __values12(slots), slots_2_1 = slots_2.next(); !slots_2_1.done; slots_2_1 = slots_2.next()) {
          var slot = slots_2_1.value;
          _loop_3(slot);
        }
      } catch (e_5_1) {
        e_5 = { error: e_5_1 };
      } finally {
        try {
          if (slots_2_1 && !slots_2_1.done && (_a = slots_2.return)) _a.call(slots_2);
        } finally {
          if (e_5) throw e_5.error;
        }
      }
    }
    card.appendChild(list);
    if (allSlots.length > MAX_LAUNCHER_SAVES) {
      var footnote = document.createElement("div");
      footnote.className = "saveFootnote";
      footnote.textContent = "Showing latest ".concat(MAX_LAUNCHER_SAVES, " of ").concat(allSlots.length, " saved games.");
      card.appendChild(footnote);
      var footerActions = document.createElement("div");
      footerActions.className = "saveActions";
      var showAllButton = document.createElement("button");
      showAllButton.className = "launcherBtn";
      showAllButton.textContent = "Show all";
      showAllButton.onclick = function() {
        return openAllSavesDialog();
      };
      footerActions.appendChild(showAllButton);
      card.appendChild(footerActions);
    }
    root.appendChild(card);
    document.body.appendChild(root);
  }
  window.addEventListener("load", function() {
    return __awaiter13(void 0, void 0, void 0, function() {
      return __generator13(this, function(_a) {
        renderLauncher();
        return [
          2
          /*return*/
        ];
      });
    });
  });
})();
