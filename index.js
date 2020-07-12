var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import express from 'express';
var PORT = process.env.PORT || 5000;
import { verifyScore, VERSION, specFromURL } from './public/logic.js';
import postgres from 'postgres';
var sql = (process.env.DATABASE_URL == undefined) ? null : postgres(process.env.DATABASE_URL);
//TODO: get rid of these any's
//TODO: this is probably horribly insecure
function randomString() {
    return Math.random().toString(36).substring(2, 7);
}
function renderTimeSince(date) {
    var e_1, _a;
    var secondsAgo = ((new Date()).getTime() - date.getTime()) / 1000;
    var units = [
        ["year", 31536000],
        ["month", 2592000],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
        ["second", 1],
    ];
    try {
        for (var units_1 = __values(units), units_1_1 = units_1.next(); !units_1_1.done; units_1_1 = units_1.next()) {
            var _b = __read(units_1_1.value, 2), unitName = _b[0], unitSize = _b[1];
            var unitsAgo = Math.floor(secondsAgo / unitSize);
            if (unitsAgo > 1)
                return unitsAgo + " " + unitName + "s ago";
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (units_1_1 && !units_1_1.done && (_a = units_1.return)) _a.call(units_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return 'Just now';
}
function renderTime(date) {
    return date.toLocaleString('en-US', { timeZone: 'America/New_York' });
}
var challengeTypes = ['full', 'mini'];
function ensureNextMonth() {
    return __awaiter(this, void 0, void 0, function () {
        var d, i, dailyTypes_1, dailyTypes_1_1, type, key, secret, results, e_2_1;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (sql == null)
                        return [2 /*return*/];
                    d = new Date();
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < 30)) return [3 /*break*/, 15];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 11, 12, 13]);
                    dailyTypes_1 = (e_2 = void 0, __values(dailyTypes)), dailyTypes_1_1 = dailyTypes_1.next();
                    _b.label = 3;
                case 3:
                    if (!!dailyTypes_1_1.done) return [3 /*break*/, 10];
                    type = dailyTypes_1_1.value;
                    key = makeDailyKey(type, d);
                    secret = void 0;
                    return [4 /*yield*/, sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT secret FROM secrets WHERE key=", ""], ["SELECT secret FROM secrets WHERE key=", ""])), key)];
                case 4:
                    results = _b.sent();
                    if (!(results.length == 0)) return [3 /*break*/, 6];
                    secret = randomString();
                    return [4 /*yield*/, sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["INSERT INTO secrets (key, secret)\n                                  VALUES (", ", ", ")\n                      ON CONFLICT DO NOTHING"], ["INSERT INTO secrets (key, secret)\n                                  VALUES (", ", ", ")\n                      ON CONFLICT DO NOTHING"])), key, secret)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    secret = results[0].secret;
                    _b.label = 7;
                case 7: return [4 /*yield*/, sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n              INSERT INTO dailies (type, key, secret, url)\n                          values (", ", ", ", ", ", ", ")\n              ON CONFLICT DO NOTHING\n          "], ["\n              INSERT INTO dailies (type, key, secret, url)\n                          values (", ", ", ", ", ", ", ")\n              ON CONFLICT DO NOTHING\n          "])), type, key, secret, makeDailyURL(key, secret))];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    dailyTypes_1_1 = dailyTypes_1.next();
                    return [3 /*break*/, 3];
                case 10: return [3 /*break*/, 13];
                case 11:
                    e_2_1 = _b.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 13];
                case 12:
                    try {
                        if (dailyTypes_1_1 && !dailyTypes_1_1.done && (_a = dailyTypes_1.return)) _a.call(dailyTypes_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                    return [7 /*endfinally*/];
                case 13:
                    d.setDate(d.getDate() + 1);
                    _b.label = 14;
                case 14:
                    i++;
                    return [3 /*break*/, 1];
                case 15: return [2 /*return*/];
            }
        });
    });
}
var dailyTypes = ['weekly', 'full'];
function makeDailyKey(type, inputDate) {
    if (inputDate === void 0) { inputDate = null; }
    var d = (inputDate == null) ? new Date() : new Date(inputDate);
    //TODO: this seems like a bad way to handle timezones...
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - 240); //east coast time
    switch (type) {
        case 'weekly':
            //new weekly challenges only at beginning of Monday
            while (d.getDay() != 1)
                d.setDate(d.getDate() - 1);
            return d.toLocaleDateString().split('/').join('.');
        case 'full':
            return d.toLocaleDateString().split('/').join('.');
    }
}
function dailyURL(type) {
    return __awaiter(this, void 0, void 0, function () {
        var key, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = makeDailyKey(type);
                    if (sql == null)
                        return [2 /*return*/, makeDailyURL(key, 'offline')];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 6];
                    return [4 /*yield*/, sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          SELECT secret FROM secrets\n          WHERE key=", "\n        "], ["\n          SELECT secret FROM secrets\n          WHERE key=", "\n        "])), key)];
                case 2:
                    results = _a.sent();
                    if (!(results.length == 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ensureNextMonth()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, makeDailyURL(key, results[0].secret)];
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function makeDailyURL(key, secret) {
    return "seed=" + key + "." + secret;
}
function submitForDaily(username, url, score) {
    return __awaiter(this, void 0, void 0, function () {
        var dailyTypes_2, dailyTypes_2_1, type, _a, e_3_1;
        var e_3, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (sql == null)
                        return [2 /*return*/];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, 8, 9]);
                    dailyTypes_2 = __values(dailyTypes), dailyTypes_2_1 = dailyTypes_2.next();
                    _c.label = 2;
                case 2:
                    if (!!dailyTypes_2_1.done) return [3 /*break*/, 6];
                    type = dailyTypes_2_1.value;
                    _a = url;
                    return [4 /*yield*/, dailyURL(type)];
                case 3:
                    if (!(_a == (_c.sent()))) return [3 /*break*/, 5];
                    return [4 /*yield*/, sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n            UPDATE dailies\n            SET best_user = ", ", best_score=", ", version=", "\n            WHERE url = ", " AND type = ", " AND\n                (version = ", " OR version ISNULL) AND\n                (best_score > ", " OR best_score ISNULL)\n        "], ["\n            UPDATE dailies\n            SET best_user = ", ", best_score=", ", version=", "\n            WHERE url = ", " AND type = ", " AND\n                (version = ", " OR version ISNULL) AND\n                (best_score > ", " OR best_score ISNULL)\n        "])), username, score, VERSION, url, type, VERSION, score)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    dailyTypes_2_1 = dailyTypes_2.next();
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_3_1 = _c.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (dailyTypes_2_1 && !dailyTypes_2_1.done && (_b = dailyTypes_2.return)) _b.call(dailyTypes_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function serveMain(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.render('pages/main', { url: undefined, tutorial: false });
            }
            catch (err) {
                console.error(err);
                res.send(err.toString());
            }
            return [2 /*return*/];
        });
    });
}
function dailyTypeFromReq(req) {
    var e_4, _a;
    var typeString = req.query.type;
    var type = undefined;
    try {
        for (var dailyTypes_3 = __values(dailyTypes), dailyTypes_3_1 = dailyTypes_3.next(); !dailyTypes_3_1.done; dailyTypes_3_1 = dailyTypes_3.next()) {
            var dailyType = dailyTypes_3_1.value;
            if (typeString == dailyType)
                type = dailyType;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (dailyTypes_3_1 && !dailyTypes_3_1.done && (_a = dailyTypes_3.return)) _a.call(dailyTypes_3);
        }
        finally { if (e_4) throw e_4.error; }
    }
    if (typeString === undefined)
        type = 'full';
    if (type === undefined)
        throw Error("Invalid daily type " + typeString);
    return type;
}
function serveDailyByType(type, res) {
    return __awaiter(this, void 0, void 0, function () {
        var url, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dailyURL(type)];
                case 1:
                    url = _a.sent();
                    res.render('pages/main', { url: url, tutorial: false });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    res.send(err_1.toString());
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function serveWeekly(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serveDailyByType('weekly', res)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function serveDaily(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var type, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    type = dailyTypeFromReq(req);
                    return [4 /*yield*/, serveDailyByType(type, res)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error(err_2);
                    res.send(err_2.toString());
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function serveDailiesByType(type, res) {
    return __awaiter(this, void 0, void 0, function () {
        var results, results_1, results_1_1, result, err_3;
        var e_5, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n          SELECT key, url, version, best_score, best_user, type,\n                 to_date(key, 'MM.DD.YYYY') as date\n          FROM dailies\n          WHERE type = ", "\n          ORDER BY date DESC\n      "], ["\n          SELECT key, url, version, best_score, best_user, type,\n                 to_date(key, 'MM.DD.YYYY') as date\n          FROM dailies\n          WHERE type = ", "\n          ORDER BY date DESC\n      "])), type)];
                case 1:
                    results = _b.sent();
                    try {
                        for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                            result = results_1_1.value;
                            results.current = (result.version == VERSION);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    res.render('pages/dailies', { type: type, dailies: results.filter(function (r) { return r.best_user != null; }) });
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _b.sent();
                    console.error(err_3);
                    res.send(err_3.toString());
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function serveTutorial(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.render('pages/main', { url: undefined, tutorial: true });
            return [2 /*return*/];
        });
    });
}
express()
    .use(express.static('./public'))
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/topScore', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, version, results, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('none');
                    return [2 /*return*/];
                }
                url = decodeURIComponent(req.query.url);
                version = req.query.version;
                if (version != VERSION) {
                    res.send('version mismatch');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              SELECT username, score, submitted FROM scoreboard\n              WHERE url=", " AND version=", "\n              ORDER BY score ASC, submitted ASC\n          "], ["\n              SELECT username, score, submitted FROM scoreboard\n              WHERE url=", " AND version=", "\n              ORDER BY score ASC, submitted ASC\n          "])), url, version)];
            case 1:
                results = _a.sent();
                if (results.length == 0)
                    res.send('none');
                else
                    res.send(results[0].score.toString());
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                console.error(err_4);
                res.send(err_4.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/recent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, recents, results_2, results_2_1, result, oldBest, err_5;
    var e_6, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('Not connected to a database');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n              SELECT username, score, submitted, url, version FROM scoreboard\n              ORDER BY submitted DESC\n          "], ["\n              SELECT username, score, submitted, url, version FROM scoreboard\n              ORDER BY submitted DESC\n          "])))];
            case 1:
                results = _b.sent();
                recents = new Map();
                try {
                    for (results_2 = __values(results), results_2_1 = results_2.next(); !results_2_1.done; results_2_1 = results_2.next()) {
                        result = results_2_1.value;
                        oldBest = recents.get(result.url);
                        if (oldBest != undefined && oldBest.score > result.score && oldBest.version == result.version) {
                            recents.delete(result.url);
                        }
                        if (!recents.has(result.url)) {
                            recents.set(result.url, {
                                url: result.url,
                                version: result.version,
                                age: renderTime(result.submitted),
                                score: result.score,
                                username: result.username
                            });
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (results_2_1 && !results_2_1.done && (_a = results_2.return)) _a.call(results_2);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                res.render('pages/recent', { recents: Array.from(recents.values()) });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _b.sent();
                console.error(err_5);
                res.send(err_5.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/dailies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var type, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('Not connected to a database');
                    return [2 /*return*/];
                }
                type = dailyTypeFromReq(req);
                return [4 /*yield*/, serveDailiesByType(type, res)];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                console.error(err_6);
                res.send(err_6.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/weeklies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, serveDailiesByType('weekly', res)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .get('/scoreboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, results, entries, entriesByVersion, entries_1, entries_1_1, entry, lastVersion, err_7;
    var e_7, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                url = decodeURIComponent(req._parsedUrl.query);
                if (sql == null) {
                    res.send('Not connected to a database.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n              SELECT username, score, submitted, version FROM scoreboard\n              WHERE url=", "\n              ORDER BY version DESC, score ASC, submitted ASC\n          "], ["\n              SELECT username, score, submitted, version FROM scoreboard\n              WHERE url=", "\n              ORDER BY version DESC, score ASC, submitted ASC\n          "])), url)];
            case 1:
                results = _b.sent();
                entries = results.map(function (x) { return (__assign(__assign({}, x), { timesince: renderTime(x.submitted) })); });
                entriesByVersion = [];
                try {
                    for (entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        entry = entries_1_1.value;
                        if (entriesByVersion.length == 0) {
                            entriesByVersion.push([entry.version, [entry]]);
                        }
                        else {
                            lastVersion = entriesByVersion[entriesByVersion.length - 1];
                            if (lastVersion[0] != entry.version) {
                                lastVersion = [entry.version, []];
                                entriesByVersion.push(lastVersion);
                            }
                            lastVersion[1].push(entry);
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                res.render('pages/scoreboard', { entriesByVersion: entriesByVersion, url: url, currentVersion: VERSION });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _b.sent();
                console.error(err_7);
                res.send(err_7.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/random', serveMain)
    .get('/play', serveMain)
    //    .get('/', serveDaily)
    .get('/daily', serveDaily)
    .get('/weekly', serveWeekly)
    .get('/tutorial', serveTutorial)
    .post('/submit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var url, spec, score, username, history_1, _a, valid, explanation, results, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                if (sql == null) {
                    res.send('Not connected to db.');
                    return [2 /*return*/];
                }
                url = decodeURIComponent(req.query.url);
                spec = specFromURL(url);
                score = req.query.score;
                username = req.query.username;
                history_1 = req.query.history;
                return [4 /*yield*/, verifyScore(spec, history_1, score)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 2]), valid = _a[0], explanation = _a[1];
                if (!valid) return [3 /*break*/, 4];
                return [4 /*yield*/, sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n                  INSERT INTO scoreboard (username, score, url, version, history)\n                  VALUES (", ", ", ", ", ", ", ", ", ")\n                "], ["\n                  INSERT INTO scoreboard (username, score, url, version, history)\n                  VALUES (", ", ", ", ", ", ", ", ", ")\n                "])), username, score, url, VERSION, history_1)];
            case 2:
                results = _b.sent();
                return [4 /*yield*/, submitForDaily(username, url, score)];
            case 3:
                _b.sent();
                res.send("OK");
                return [3 /*break*/, 5];
            case 4:
                res.send("Score did not validate: " + explanation);
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_8 = _b.sent();
                console.error(err_8);
                res.send(err_8.toString());
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); })
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=index.js.map