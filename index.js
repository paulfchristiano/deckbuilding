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
import { verifyScore, VERSION } from './public/logic.js';
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
function ensureNextMonth() {
    return __awaiter(this, void 0, void 0, function () {
        var d, i, secret, datestring, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (sql == null)
                        return [2 /*return*/];
                    d = new Date();
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 30)) return [3 /*break*/, 4];
                    secret = randomString();
                    datestring = renderEastCoastDate(d);
                    return [4 /*yield*/, sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            INSERT INTO dailies (datestring, secret, seed)\n                        values (", ", ", ", ", ")\n            ON CONFLICT DO NOTHING\n        "], ["\n            INSERT INTO dailies (datestring, secret, seed)\n                        values (", ", ", ", ", ")\n            ON CONFLICT DO NOTHING\n        "])), datestring, secret, makeSeed(datestring, secret))];
                case 2:
                    results = _a.sent();
                    d.setDate(d.getDate() + 1);
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderEastCoastDate(inputDate) {
    if (inputDate === void 0) { inputDate = null; }
    var d = (inputDate == null) ? new Date() : new Date(inputDate);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset() - 240);
    return d.toLocaleDateString().split('/').join('.');
}
function dailySeed() {
    return __awaiter(this, void 0, void 0, function () {
        var datestring, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    datestring = renderEastCoastDate();
                    if (sql == null)
                        return [2 /*return*/, datestring];
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 6];
                    return [4 /*yield*/, sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n          SELECT seed FROM dailies\n          WHERE datestring=", "\n        "], ["\n          SELECT seed FROM dailies\n          WHERE datestring=", "\n        "])), datestring)];
                case 2:
                    results = _a.sent();
                    if (!(results.length == 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, ensureNextMonth()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, results[0].seed];
                case 5: return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function makeSeed(datestring, secret) {
    return datestring + "." + secret;
}
function submitForDaily(username, seed, score) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (sql == null)
                        return [2 /*return*/];
                    return [4 /*yield*/, sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n        UPDATE dailies\n        SET best_user = ", ", best_score=", ", version=", "\n        WHERE seed = ", " AND\n            (version = ", " OR version ISNULL) AND\n            (best_score > ", " OR best_score ISNULL)\n    "], ["\n        UPDATE dailies\n        SET best_user = ", ", best_score=", ", version=", "\n        WHERE seed = ", " AND\n            (version = ", " OR version ISNULL) AND\n            (best_score > ", " OR best_score ISNULL)\n    "])), username, score, VERSION, seed, VERSION, score)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function serveMain(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.render('pages/main', { seed: undefined });
            }
            catch (err) {
                console.error(err);
                res.send(err);
            }
            return [2 /*return*/];
        });
    });
}
function serveDaily(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var seed, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dailySeed()];
                case 1:
                    seed = _a.sent();
                    res.render('pages/main', { seed: seed });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error(err_1);
                    res.send('Error: ' + err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
express()
    .use(express.static('./public'))
    .set('view engine', 'ejs')
    .set('views', './views')
    .get('/topScore', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var seed, version, results, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('none');
                    return [2 /*return*/];
                }
                seed = req.query.seed;
                version = req.query.version;
                if (version != VERSION) {
                    res.send('version mismatch');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n              SELECT username, score, submitted FROM scoreboard\n              WHERE seed=", " AND version=", "\n              ORDER BY score ASC, submitted ASC\n          "], ["\n              SELECT username, score, submitted FROM scoreboard\n              WHERE seed=", " AND version=", "\n              ORDER BY score ASC, submitted ASC\n          "])), seed, version)];
            case 1:
                results = _a.sent();
                if (results.length == 0)
                    res.send('none');
                else
                    res.send(results[0].score.toString());
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error(err_2);
                res.send('Error: ' + err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/recent', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, recents, results_1, results_1_1, result, oldBest, err_3;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('Not connected to a database');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n              SELECT username, score, submitted, seed, version FROM scoreboard\n              ORDER BY submitted DESC\n          "], ["\n              SELECT username, score, submitted, seed, version FROM scoreboard\n              ORDER BY submitted DESC\n          "])))];
            case 1:
                results = _b.sent();
                recents = new Map();
                try {
                    for (results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                        result = results_1_1.value;
                        oldBest = recents.get(result.seed);
                        if (oldBest != undefined && oldBest.score > result.score && oldBest.version == result.version) {
                            recents.delete(result.seed);
                        }
                        if (!recents.has(result.seed)) {
                            recents.set(result.seed, {
                                seed: result.seed,
                                version: result.version,
                                age: renderTimeSince(result.submitted),
                                score: result.score,
                                username: result.username
                            });
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                res.render('pages/recent', { recents: Array.from(recents.values()) });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                console.error(err_3);
                res.send('Error: ' + err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/dailies', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, results_2, results_2_1, result, err_4;
    var e_3, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (sql == null) {
                    res.send('Not connected to a database');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n              SELECT datestring, seed, version, best_score, best_user,\n                     to_date(datestring, 'MM.DD.YYYY') as date\n              FROM dailies\n              ORDER BY date DESC\n          "], ["\n              SELECT datestring, seed, version, best_score, best_user,\n                     to_date(datestring, 'MM.DD.YYYY') as date\n              FROM dailies\n              ORDER BY date DESC\n          "])))];
            case 1:
                results = _b.sent();
                try {
                    for (results_2 = __values(results), results_2_1 = results_2.next(); !results_2_1.done; results_2_1 = results_2.next()) {
                        result = results_2_1.value;
                        results.current = (result.version == VERSION);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (results_2_1 && !results_2_1.done && (_a = results_2.return)) _a.call(results_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                res.render('pages/dailies', { dailies: results.filter(function (r) { return r.best_user != null; }) });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _b.sent();
                console.error(err_4);
                res.send('Error: ' + err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/scoreboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var seed, results, entries, entriesByVersion, entries_1, entries_1_1, entry, lastVersion, err_5;
    var e_4, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                seed = req.query.seed;
                if (sql == null) {
                    res.send('Not connected to a database.');
                    return [2 /*return*/];
                }
                return [4 /*yield*/, sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n              SELECT username, score, submitted, version FROM scoreboard\n              WHERE seed=", "\n              ORDER BY version DESC, score ASC, submitted ASC\n          "], ["\n              SELECT username, score, submitted, version FROM scoreboard\n              WHERE seed=", "\n              ORDER BY version DESC, score ASC, submitted ASC\n          "])), seed)];
            case 1:
                results = _b.sent();
                entries = results.map(function (x) { return (__assign(__assign({}, x), { timesince: renderTimeSince(x.submitted) })); });
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
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                res.render('pages/scoreboard', { entriesByVersion: entriesByVersion, seed: seed, currentVersion: VERSION });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _b.sent();
                console.error(err_5);
                res.send('Error: ' + err_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })
    .get('/random', serveMain)
    .get('/play', serveMain)
    .get('/', serveDaily)
    .get('/daily', serveDaily)
    .post('/submit', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var seed, score, username, history_1, _a, valid, explanation, results, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                if (sql == null) {
                    res.send('Not connected to db.');
                    return [2 /*return*/];
                }
                seed = req.query.seed;
                score = req.query.score;
                username = req.query.username;
                history_1 = req.query.history;
                return [4 /*yield*/, verifyScore({ seed: seed, type: 'main' }, history_1, score)];
            case 1:
                _a = __read.apply(void 0, [_b.sent(), 2]), valid = _a[0], explanation = _a[1];
                if (!valid) return [3 /*break*/, 4];
                return [4 /*yield*/, sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n                  INSERT INTO scoreboard (username, score, seed, version, history)\n                  VALUES (", ", ", ", ", ", ", ", ", ")\n                "], ["\n                  INSERT INTO scoreboard (username, score, seed, version, history)\n                  VALUES (", ", ", ", ", ", ", ", ", ")\n                "])), username, score, seed, VERSION, history_1)];
            case 2:
                results = _b.sent();
                return [4 /*yield*/, submitForDaily(username, seed, score)];
            case 3:
                _b.sent();
                res.send("OK");
                return [3 /*break*/, 5];
            case 4:
                res.send("Score did not validate: " + explanation);
                _b.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_6 = _b.sent();
                console.error(err_6);
                res.send('Error: ' + err_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); })
    .listen(PORT, function () { return console.log("Listening on " + PORT); });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=index.js.map