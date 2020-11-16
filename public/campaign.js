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
function makeCredentials(username, password) {
    return { username: username, hashedPassword: hashPassword(username, password) };
}
function loginLocal(credentials) {
    localStorage.setItem('campaignUsername', credentials.username);
    localStorage.setItem('hashedPassword', credentials.hashedPassword);
}
function logout() {
    delete localStorage.campaignUsername;
    delete localStorage.hashedPassword;
}
function escapePeriods(id) {
    return id.replace('.', '\\.');
}
export function getCredentials() {
    var username = localStorage.campaignUsername;
    var hashedPassword = localStorage.hashedPassword;
    if (username !== undefined && hashedPassword !== undefined) {
        return {
            username: username,
            hashedPassword: hashedPassword
        };
    }
    else {
        return null;
    }
}
function toggleRules() {
    var active = $('#rules').attr('active');
    console.log(active);
    $('#rules').attr('active', (active == 'true') ? 'false' : 'true');
}
export function load() {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, info, _a, _b, _c, name_1, url, _d, _e, _f, name_2, reason, _g, _h, _j, name_3, awards;
        var e_1, _k, e_2, _l, e_3, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    credentials = getCredentials();
                    $('#logoutButton').click(logout);
                    if (credentials !== null)
                        $('#namespan').text(credentials.username);
                    $('#showRules').unbind('click');
                    $('#showRules').click(toggleRules);
                    if (!(credentials === null)) return [3 /*break*/, 1];
                    displayLogin();
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, getCampaignInfo(credentials)];
                case 2:
                    info = _o.sent();
                    $('#numAwards').text(" " + info.numAwards);
                    try {
                        for (_a = __values(info.urls), _b = _a.next(); !_b.done; _b = _a.next()) {
                            _c = __read(_b.value, 2), name_1 = _c[0], url = _c[1];
                            if (url !== null) {
                                $("#" + $.escapeSelector(name_1) + " a").attr('href', "play?campaign&" + url);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_b && !_b.done && (_k = _a.return)) _k.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    try {
                        for (_d = __values(info.lockReasons), _e = _d.next(); !_e.done; _e = _d.next()) {
                            _f = __read(_e.value, 2), name_2 = _f[0], reason = _f[1];
                            $("#" + $.escapeSelector(name_2) + " .req").html(" (&#128274;" + reason + ")");
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_e && !_e.done && (_l = _d.return)) _l.call(_d);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    try {
                        for (_g = __values(info.awardsByLevels), _h = _g.next(); !_h.done; _h = _g.next()) {
                            _j = __read(_h.value, 2), name_3 = _j[0], awards = _j[1];
                            $("#" + $.escapeSelector(name_3) + " .stars").text(renderStars(awards));
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_h && !_h.done && (_m = _g.return)) _m.call(_g);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    _o.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function renderStars(n) {
    if (n == 0)
        return '';
    return "(" + Array(n).fill('*').join('') + ")";
}
function loginRemote(credentials) {
    return new Promise(function (resolve) {
        $.post("login?" + credentialParams(credentials), function (data) {
            if (data != 'ok') {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}
function signupRemote(credentials) {
    return new Promise(function (resolve) {
        if (credentials.username == '') {
            alert('Enter a username and password and click signup');
        }
        else {
            $.post("signup?" + credentialParams(credentials), function (data) {
                if (data != 'ok') {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        }
    });
}
function displayLogin() {
    $('#loginDialog').html("<label for=\"name\">Name:</label>" +
        "<input type='text' id=\"name\"></textarea>" +
        "<div>" +
        "<label for=\"password\">Password:</label>" +
        "<input type='password' id=\"password\"></textarea>" +
        "</div>" +
        "<div>" +
        "<span class=\"option\" choosable id=\"signup\">Sign up</span>" +
        "<span class=\"option\" choosable id=\"login\">Log in</span>" +
        "</div>");
    //TODO: alert when credentials are no good
    function credentialsFromForm() {
        return makeCredentials($('#name').val(), $('#password').val());
    }
    function exit() {
        $('#loginDialog').html('');
        $('#loginDialog').attr('active', 'false');
    }
    function login() {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        credentials = credentialsFromForm();
                        if (!(credentials !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, loginRemote(credentials)];
                    case 1:
                        success = _a.sent();
                        if (success) {
                            loginLocal(credentials);
                            exit();
                            load();
                        }
                        else {
                            alert('No existing user found with that name+password');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function signup() {
        return __awaiter(this, void 0, void 0, function () {
            var credentials, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        credentials = credentialsFromForm();
                        if (!(credentials !== null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, signupRemote(credentials)
                            //TODO actually do things the right way with errors etc.
                        ];
                    case 1:
                        success = _a.sent();
                        //TODO actually do things the right way with errors etc.
                        if (success) {
                            loginLocal(credentials);
                            exit();
                            load();
                        }
                        else {
                            alert('Error signing up (probably someone else has that username)');
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    $('#loginDialog').attr('active', 'true');
    $('.option[id="login"]').click(login);
    $('.option[id="signup"]').click(signup);
}
function credentialParams(credentials) {
    return "username=" + credentials.username + "&hashedPassword=" + credentials.hashedPassword;
}
function isCheating() {
    var search = new URLSearchParams(window.location.search);
    return search.get('cheat') !== null;
}
function getCampaignInfo(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var cheatStr;
        return __generator(this, function (_a) {
            cheatStr = isCheating() ? '&cheat' : '';
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    $.get("campaignInfo?" + credentialParams(credentials) + cheatStr, function (data) {
                        if (data == 'error') {
                            alert('invalid credentials');
                            logout();
                            reject();
                            return;
                        }
                        //TODO: resolve with the right thing
                        resolve(data);
                    });
                })];
        });
    });
}
//this is intended only to prevent dev from seeing plaintext passwords
//(hopefully no users reuse passwords anyway, but might as well)
export function hashPassword(username, password) {
    return hash(password).toString(16);
}
// Source: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// (definitely not a PRF)
function hash(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
//# sourceMappingURL=campaign.js.map