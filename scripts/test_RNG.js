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
var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
import { makeKingdom } from '../public/logic.js';
var N = 100000;
var counts = new Map();
function increment(x, key) {
    x.set(key, (x.get(key) || 0) + 1);
}
for (var i = 0; i < N; i++) {
    var seed = "testseed." + i;
    var spec = { kind: 'full', seed: seed };
    var kingdom = makeKingdom(spec);
    var names = kingdom.cards.map(function (c) { return c.name; });
    try {
        for (var names_1 = (e_1 = void 0, __values(names)), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
            var a = names_1_1.value;
            try {
                for (var names_2 = (e_2 = void 0, __values(names)), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                    var b = names_2_1.value;
                    try {
                        for (var names_3 = (e_3 = void 0, __values(names)), names_3_1 = names_3.next(); !names_3_1.done; names_3_1 = names_3.next()) {
                            var c = names_3_1.value;
                            if (a != b && a != c && b != c) {
                                var key = a + b + c;
                                increment(counts, key);
                            }
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (names_3_1 && !names_3_1.done && (_c = names_3.return)) _c.call(names_3);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (names_2_1 && !names_2_1.done && (_b = names_2.return)) _b.call(names_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
var countCounts = new Map();
var K = 10000;
try {
    for (var counts_1 = __values(counts), counts_1_1 = counts_1.next(); !counts_1_1.done; counts_1_1 = counts_1.next()) {
        var _e = __read(counts_1_1.value, 2), key = _e[0], count = _e[1];
        increment(countCounts, Math.floor(count * K / N));
    }
}
catch (e_4_1) { e_4 = { error: e_4_1 }; }
finally {
    try {
        if (counts_1_1 && !counts_1_1.done && (_d = counts_1.return)) _d.call(counts_1);
    }
    finally { if (e_4) throw e_4.error; }
}
for (var i = 0; i < K; i++) {
    if (countCounts.has(i)) {
        console.log(i + ": " + (countCounts.get(i) || 0) / 6);
    }
}
//# sourceMappingURL=test_RNG.js.map