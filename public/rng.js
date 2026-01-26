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
    Generator.prototype.permute = function (list) {
        var _a;
        var result = list.slice(); // copy
        for (var i = result.length - 1; i > 0; i--) {
            var j = Math.floor(this.prng() * (i + 1));
            _a = __read([result[j], result[i]], 2), result[i] = _a[0], result[j] = _a[1];
        }
        return result;
    };
    Generator.prototype.samples = function (list, k, excludes) {
        if (excludes === void 0) { excludes = []; }
        if (k == 0)
            return [];
        var arr = this.permute(list);
        var result = [];
        var _loop_1 = function (i) {
            var candidate = arr[i];
            if (excludes.every(function (t) { return (t !== candidate); })) {
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
        console.log('Ran out of items!');
        return result;
    };
    Generator.prototype.sample = function (list, excludes) {
        if (excludes === void 0) { excludes = []; }
        return this.samples(list, 1, excludes)[0];
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