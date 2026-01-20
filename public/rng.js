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
var ALPHANUM = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function randomString() {
    var result = "";
    for (var i = 0; i < 8; i++) {
        var idx = Math.floor(Math.random() * ALPHANUM.length);
        result += ALPHANUM[idx];
    }
    return result;
}
var Generator = /** @class */ (function () {
    function Generator(seedString) {
        this.prng = PRNGFromString(seedString);
    }
    Generator.prototype.newGenerator = function () {
        var result = "";
        for (var i = 0; i < 8; i++) {
            var idx = Math.floor(this.prng() * ALPHANUM.length);
            result += ALPHANUM[idx];
        }
        return new Generator(result);
    };
    Generator.prototype.samples = function (list, k) {
        var _a;
        console.assert(k <= list.length, "k cannot be larger than list length");
        var arr = list.slice(); // copy
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(this.prng() * (i + 1));
            _a = __read([arr[j], arr[i]], 2), arr[i] = _a[0], arr[j] = _a[1];
        }
        return arr.slice(0, k);
    };
    Generator.prototype.sample = function (list) {
        console.assert(list.length > 0, "Cannot sample from empty list");
        var idx = Math.floor(this.prng() * list.length);
        return list[idx];
    };
    return Generator;
}());
export { Generator };
/** Hash string into a 32-bit seed */
function makeSeedFromString(s) {
    var str = normalizeSeedString(s);
    var hash = 2166136261;
    for (var i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
}
/** Deterministic PRNG */
function PRNGFromString(seedString) {
    var seed = makeSeedFromString(seedString);
    return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
/** Normalize the input string (capitalization only) */
function normalizeSeedString(s) {
    return s.toUpperCase();
}
//# sourceMappingURL=rng.js.map