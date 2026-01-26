// metaUI.ts - Meta-game UI rendering
// Handles stage selection, path selection, card pickers, etc.
// Renders directly from MetaState - no legacy globals.
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { UndoPastBeginning } from './gameLogic.js';
import { renderChallenge, Undo, Redo } from './metaLogic.js';
import { renderSpecNoRelated } from './cardRendering.js';
import { initHotkeys, startGame } from './gameUI.js';
// ----------------------------- State
var deckDialogOpen = false;
var activeEncounterIndex = null;
// ----------------------------- MetaUI Implementation
// Resolver for pending async choice operations
//let pendingChoiceResolver: ((value: any) => void) | null = null
var MetaGameUI = /** @class */ (function () {
    function MetaGameUI() {
        initHotkeys(); // TODO: understand and fix this
    }
    MetaGameUI.prototype.chooseCard = function (state_1, prompt_1, options_1) {
        return __awaiter(this, arguments, void 0, function (state, prompt, options, canCancel) {
            if (canCancel === void 0) { canCancel = true; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var e_1, _a;
                        bindUndoEvents(state, reject);
                        //pendingChoiceResolver = resolve
                        $('#cardPickerTitle').text(prompt);
                        var container = $('#cardPickerOptions');
                        container.empty();
                        var _loop_1 = function (card) {
                            var specHtml = renderSpecNoRelated('spec' in card ? card.spec : card);
                            var optionEl = $(specHtml);
                            optionEl.css('cursor', 'pointer');
                            optionEl.on('click', function () {
                                hideCardPicker();
                                //pendingChoiceResolver = null
                                resolve(card);
                            });
                            container.append(optionEl);
                        };
                        try {
                            for (var options_2 = __values(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
                                var card = options_2_1.value;
                                _loop_1(card);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (options_2_1 && !options_2_1.done && (_a = options_2.return)) _a.call(options_2);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        if (canCancel) {
                            $('#cardPickerCancel').show();
                            $('#cardPickerCancel').off('click').on('click', function () {
                                hideCardPicker();
                                //pendingChoiceResolver = null
                                resolve(null);
                            });
                        }
                        else {
                            $('#cardPickerCancel').hide();
                        }
                        $('#cardPickerDialog').attr('active', 'true');
                    })];
            });
        });
    };
    MetaGameUI.prototype.pickNextStep = function (state) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        bindUndoEvents(state, reject);
                        renderStageScreen(state, resolve);
                    })];
            });
        });
    };
    MetaGameUI.prototype.pickPath = function (state, paths) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        bindUndoEvents(state, reject);
                        renderPathSelectionScreen(state, paths, resolve);
                    })];
            });
        });
    };
    MetaGameUI.prototype.chooseOption = function (state_1, prompt_1, options_1) {
        return __awaiter(this, arguments, void 0, function (state, prompt, options, canCancel) {
            if (canCancel === void 0) { canCancel = true; }
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var e_2, _a;
                        bindUndoEvents(state, reject);
                        //pendingChoiceResolver = resolve
                        $('#encounterTitle').text(prompt);
                        $('#encounterDescription').text('');
                        var container = $('#encounterOptions');
                        container.empty();
                        var _loop_2 = function (option) {
                            var optionDiv = $('<div class="encounterOption"></div>');
                            if (option.spec) {
                                // Show the card spec with label as subtitle
                                var specHtml = renderSpecNoRelated(option.spec);
                                var specEl = $(specHtml);
                                if (option.disabled) {
                                    specEl.css('opacity', '0.5');
                                    specEl.css('cursor', 'default');
                                }
                                else {
                                    specEl.css('cursor', 'pointer');
                                    specEl.on('click', function () {
                                        hideEncounterPicker();
                                        //pendingChoiceResolver = null
                                        resolve(option.value);
                                    });
                                }
                                optionDiv.append(specEl);
                                var subtitleSpan = $('<div class="encounterOptionSubtitle"></div>');
                                subtitleSpan.text(option.label);
                                optionDiv.append(subtitleSpan);
                            }
                            else {
                                // Standard name + description display
                                var nameSpan = $('<span class="option encounterOptionName" choosable></span>');
                                nameSpan.text(option.label);
                                var specEl = nameSpan; // TODO: copy-pasted claude code, should fix up an dunifu with previous case.
                                if (option.disabled) {
                                    specEl.css('opacity', '0.5');
                                    specEl.css('cursor', 'default');
                                }
                                else {
                                    specEl.css('cursor', 'pointer');
                                    specEl.on('click', function () {
                                        hideEncounterPicker();
                                        //pendingChoiceResolver = null
                                        resolve(option.value);
                                    });
                                }
                                if (option.description) {
                                    var descSpan = $('<div class="encounterOptionDesc"></div>');
                                    descSpan.text(option.description);
                                    optionDiv.append(nameSpan);
                                    optionDiv.append(descSpan);
                                }
                                else {
                                    optionDiv.append(nameSpan);
                                }
                            }
                            container.append(optionDiv);
                        };
                        try {
                            for (var options_3 = __values(options), options_3_1 = options_3.next(); !options_3_1.done; options_3_1 = options_3.next()) {
                                var option = options_3_1.value;
                                _loop_2(option);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (options_3_1 && !options_3_1.done && (_a = options_3.return)) _a.call(options_3);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (canCancel) {
                            $('#encounterCancel').show();
                            $('#encounterCancel').off('click').on('click', function () {
                                hideEncounterPicker();
                                //pendingChoiceResolver = null
                                resolve(null);
                            });
                        }
                        else {
                            $('#encounterCancel').hide();
                        }
                        $('#encounterDialog').attr('active', 'true');
                    })];
            });
        });
    };
    MetaGameUI.prototype.showMessage = function (state, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // For now, just log to console. Could show a dialog in the future.
                console.log("[MetaUI Message]: ".concat(message));
                return [2 /*return*/];
            });
        });
    };
    MetaGameUI.prototype.playGame = function (spec) {
        return startGame(spec).catch(function (e) {
            if (e instanceof UndoPastBeginning) {
                throw new Undo(); // We transform an undo past the beginnig in the object level game into an undo in the meta game.
            }
            else {
                throw e;
            }
        });
    };
    return MetaGameUI;
}());
export { MetaGameUI };
// ----------------------------- Main Render Function
/*
export function renderMetaUI(state: MetaState): void {
    updateBufferDisplay(state)
    updateProgressSidebar(state)
    renderStageScreen(state)
    updateUndoRedoButtons(state)
}
*/
// ----------------------------- Buffer Display
function updateBufferDisplay(state) {
    $('#bufferDisplay').text("Buffer: ".concat(state.data.buffer));
}
// ----------------------------- Progress Sidebar
function updateProgressSidebar(state) {
    $('#progressLine .progressCircle, #progressLinePath .progressCircle').each(function () {
        var stage = parseInt($(this).attr('data-stage') || '0');
        $(this).removeClass('completed current');
        $(this).find('.progressScore').remove();
        if (stage < state.data.stage) {
            $(this).addClass('completed');
            var score = state.data.stageScores[stage];
            var par = state.data.stagePars[stage];
            if (score !== null && par !== null) {
                var scoreDisplay = "".concat(score, "/").concat(par);
                var color = score > par ? 'color: red' : (score < par ? 'color: green' : '');
                $(this).append("<span class=\"progressScore\" style=\"".concat(color, "\">").concat(scoreDisplay, "</span>"));
            }
        }
        else if (stage === state.data.stage) {
            $(this).addClass('current');
        }
    });
}
// ----------------------------- Undo/Redo Buttons
/*
function updateUndoRedoButtons(state: MetaState): void {
    const canUndo = state.canUndo()
    const canRedo = state.canRedo()

    $('#metaUndo, #metaUndoPath').each(function () {
        if (canUndo) {
            $(this).removeAttr('disabled')
        } else {
            $(this).attr('disabled', 'disabled')
        }
    })

    $('#metaRedo, #metaRedoPath').each(function () {
        if (canRedo) {
            $(this).removeAttr('disabled')
        } else {
            $(this).attr('disabled', 'disabled')
        }
    })
}
*/
// ----------------------------- Stage Screen
function renderStageScreen(state, callback) {
    showStageScreenUI();
    $('#stageTitle').text("Stage ".concat(state.data.stage));
    render(state);
    // Render reward buttons
    renderRewardButtons(state, callback);
    if (state.data.challenge) {
        $('#playKingdom').html(renderChallenge(state.data.challenge, state));
        $('#playKingdom').off('click').on('click', function () { return callback({ kind: 'challenge' }); });
    }
}
// TODO: stop using jquery
function renderRewardButtons(state, callback) {
    var container = $('#rewardButtons');
    container.empty();
    state.data.rewards.forEach(function (reward, index) {
        var row = $('<div class="gameRow"></div>');
        // Card/Event/Potion/Relic picker
        var label = reward.result
            ? "\u2713 ".concat(reward.result)
            : getRewardLabel(reward.kind);
        var button = $("<span class=\"option\" choosable>".concat(label, "</span>"));
        if (reward.result) {
            button.attr('disabled', 'disabled');
            button.removeAttr('choosable');
        }
        else {
            button.on('click', function () { return callback({ kind: 'reward', index: index }); });
        }
        row.append(button);
        container.append(row);
    });
}
function getRewardLabel(kind) {
    switch (kind) {
        case 'card': return 'Add Card';
        case 'event': return 'Add Event';
        case 'potion': return 'Add Potion';
        case 'relic': return 'Add Relic';
        case 'encounter': return '???';
    }
}
// ----------------------------- Card Picker
/*
function showCardPicker(state: MetaState, rewardIndex: number): void {
    const reward = state.rewards[rewardIndex]
    if (!reward || reward.result) return

    const title = `Choose ${getRewardLabel(reward.kind).replace('Add ', '')}:`
    $('#cardPickerTitle').text(title)

    const container = $('#cardPickerOptions')
    container.empty()

    for (const card of reward.options) {
        const specHtml = renderSpecNoRelated(card)
        const optionEl = $(specHtml)
        optionEl.css('cursor', 'pointer')
        optionEl.on('click', () => {
            hideCardPicker()
            if (callbacks) {
                callbacks.onSelectReward(rewardIndex, card)
            }
        })
        container.append(optionEl)
    }

    $('#cardPickerCancel').off('click').on('click', hideCardPicker)
    $('#cardPickerDialog').attr('active', 'true')
}
*/
function hideCardPicker() {
    $('#cardPickerDialog').attr('active', 'false');
}
// ----------------------------- Encounter Picker
/*
function showEncounterPicker(state: MetaState, rewardIndex: number): void {
    const reward = state.rewards[rewardIndex]
    if (!reward || reward.used || reward.kind !== 'encounter' || !reward.encounter) return

    activeEncounterIndex = rewardIndex
    const encounter = reward.encounter

    $('#encounterTitle').text(encounter.name)
    $('#encounterDescription').text(encounter.description)

    const container = $('#encounterOptions')
    container.empty()

    encounter.options.forEach((option, optionIndex) => {
        const optionDiv = $('<div class="encounterOption"></div>')
        const isDisabled = option.disabled ? option.disabled(state) : false

        const handleOptionClick = () => {
            if (!encounter.multiUse || option.finishesEncounter) {
                hideEncounterPicker()
            }
            if (callbacks) {
                callbacks.onSelectEncounterOption(rewardIndex, optionIndex)
            }
        }

        if (option.displaySpec) {
            // Show the card spec with name as subtitle
            const specHtml = renderSpecNoRelated(option.displaySpec)
            const specEl = $(specHtml)
            if (isDisabled) {
                specEl.css('opacity', '0.5')
                specEl.css('cursor', 'default')
            } else {
                specEl.css('cursor', 'pointer')
                specEl.on('click', handleOptionClick)
            }
            optionDiv.append(specEl)

            const subtitleSpan = $('<div class="encounterOptionSubtitle"></div>')
            subtitleSpan.text(option.name)
            optionDiv.append(subtitleSpan)
        } else {
            // Standard name + description display
            const nameSpan = $('<span class="option encounterOptionName" choosable></span>')
            nameSpan.text(option.name)
            if (isDisabled) {
                nameSpan.attr('disabled', 'true')
                nameSpan.removeAttr('choosable')
            }

            const descSpan = $('<div class="encounterOptionDesc"></div>')
            descSpan.text(option.description)

            optionDiv.append(nameSpan)
            optionDiv.append(descSpan)

            if (!isDisabled) {
                nameSpan.on('click', handleOptionClick)
            }
        }

        container.append(optionDiv)
    })

    $('#encounterCancel').off('click').on('click', hideEncounterPicker)
    $('#encounterDialog').attr('active', 'true')
}
*/
function hideEncounterPicker() {
    $('#encounterDialog').attr('active', 'false');
    activeEncounterIndex = null;
}
// ----------------------------- Path Selection Screen
export function renderPathSelectionScreen(state, paths, callback) {
    showPathSelectionUI();
    console.assert(paths.length === 2, 'There must be exactly two path options to choose from.');
    var _a = __read(paths, 2), leftPath = _a[0], rightPath = _a[1];
    render(state);
    $('#pathTitle').text("Stage ".concat(state.data.stage, " - Choose Your Path"));
    // Populate left path
    renderPathColumn('left', leftPath, state, callback);
    $('#goLeft').off('click').on('click', function () {
        callback(leftPath);
    });
    // Populate right path
    renderPathColumn('right', rightPath, state, callback);
    $('#goRight').off('click').on('click', function () {
        callback(rightPath);
    });
}
function renderPathColumn(side, path, state, callback) {
    var e_3, _a;
    var rewardsContainer = $("#".concat(side, "Rewards"));
    rewardsContainer.empty();
    try {
        for (var _b = __values(path.rewards), _c = _b.next(); !_c.done; _c = _b.next()) {
            var reward = _c.value;
            var rewardText = getRewardLabel(reward.kind);
            rewardsContainer.append("<div class=\"pathReward\">".concat(rewardText, "</div>"));
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_3) throw e_3.error; }
    }
    $("#".concat(side, "Play")).text(renderChallenge(path.challenge, state));
}
// ----------------------------- Deck Dialog
// Undo, hotkeys, etc.?
function render(state) {
    $('#deckIcon').off('click').on('click', function () { showDeckDialog(state); });
    updateBufferDisplay(state);
    updateProgressSidebar(state);
}
export function showDeckDialog(state) {
    var e_4, _a, e_5, _b, e_6, _c, e_7, _d;
    var container = $('#deckContents');
    container.empty();
    // Show collected cards
    if (state.data.collectedCards.length > 0) {
        container.append('<div><strong>Cards:</strong></div>');
        try {
            for (var _e = __values(state.data.collectedCards), _f = _e.next(); !_f.done; _f = _e.next()) {
                var card = _f.value;
                container.append(renderSpecNoRelated(card));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_4) throw e_4.error; }
        }
    }
    // Show collected events
    if (state.data.collectedEvents.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Events:</strong></div>');
        try {
            for (var _g = __values(state.data.collectedEvents), _h = _g.next(); !_h.done; _h = _g.next()) {
                var event_1 = _h.value;
                container.append(renderSpecNoRelated(event_1));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_5) throw e_5.error; }
        }
    }
    // Show potions
    if (state.data.potions.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Potions:</strong></div>');
        try {
            for (var _j = __values(state.data.potions), _k = _j.next(); !_k.done; _k = _j.next()) {
                var potion = _k.value;
                container.append(renderSpecNoRelated(potion.spec));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
            }
            finally { if (e_6) throw e_6.error; }
        }
    }
    // Show relics
    if (state.data.relics.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Relics:</strong></div>');
        try {
            for (var _l = __values(state.data.relics), _m = _l.next(); !_m.done; _m = _l.next()) {
                var relic = _m.value;
                container.append(renderSpecNoRelated(relic.spec));
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
            }
            finally { if (e_7) throw e_7.error; }
        }
    }
    if (state.data.collectedCards.length === 0 && state.data.collectedEvents.length === 0 &&
        state.data.potions.length === 0 && state.data.relics.length === 0) {
        container.append('<div>No items collected yet.</div>');
    }
    $('#deckClose').off('click').on('click', function () {
        hideDeckDialog();
    });
    $('#deckDialog').attr('active', 'true');
    deckDialogOpen = true;
}
export function hideDeckDialog() {
    $('#deckDialog').attr('active', 'false');
    deckDialogOpen = false;
}
export function isDeckDialogOpen() {
    return deckDialogOpen;
}
// ----------------------------- Victory/Game Over Screens
export function showVictoryScreen() {
    $('#stageScreen').hide();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').hide();
    $('#gameOverScreen').hide();
    $('#victoryScreen').show();
}
export function showGameOverScreen() {
    $('#stageScreen').hide();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').hide();
    $('#victoryScreen').hide();
    $('#gameOverScreen').show();
}
// ----------------------------- Screen Visibility
export function showStageScreenUI() {
    $('#stageScreen').show();
    $('#pathSelectionScreen').hide();
    $('#gameContainer').hide();
    $('#victoryScreen').hide();
    $('#gameOverScreen').hide();
}
export function showPathSelectionUI() {
    $('#stageScreen').hide();
    $('#pathSelectionScreen').show();
    $('#gameContainer').hide();
    $('#victoryScreen').hide();
    $('#gameOverScreen').hide();
}
export function hideAllMetaUI() {
    $('#stageScreen').hide();
    $('#pathSelectionScreen').hide();
    $('#victoryScreen').hide();
    $('#gameOverScreen').hide();
}
// ----------------------------- Undo Events
function bindUndoEvents(state, reject) {
    var canUndo = state.canUndo();
    var canRedo = state.canRedo();
    $('#metaUndo, #metaUndoPath').each(function () {
        if (canUndo) {
            $(this).removeAttr('disabled');
            $(this).off('click').on('click', function () { return reject(new Undo()); });
        }
        else {
            $(this).attr('disabled', 'disabled');
        }
    });
    $('#metaRedo, #metaRedoPath').each(function () {
        if (canRedo) {
            $(this).removeAttr('disabled');
            $(this).off('click').on('click', function () { return reject(new Redo()); });
        }
        else {
            $(this).attr('disabled', 'disabled');
        }
    });
}
//# sourceMappingURL=metaUI.js.map