// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.
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
import { supplyComp, eventComp } from './gameLogic.js';
import { goalForSpec } from './gameLogic.js';
import { createInitialMetaState, TOTAL_STAGES, calculatePar, getRewardOptionCount, applyMetaReplacers, applyMetaTriggers, collectCard, collectEvent, addPotion, addRelic, } from './metaLogic.js';
import { vpModes, vpCardNames, vpEventNames, allPotions, allRelics, allBoons, getAvailableCards, getAvailableEvents, } from './registry.js';
import { startGame, createInitialGameState, initHotkeys, setCurrentPar } from './gameUI.js';
import { renderMetaUI, renderPathSelectionScreen, setMetaUICallbacks, bindMetaUIEvents, showStageScreenUI, showPathSelectionUI, showVictoryScreen, showGameOverScreen, showDeckDialog, hideDeckDialog, hideAllMetaUI, metaUIInstance, } from './metaUI.js';
// Import data to trigger registration
import './data/index.js';
import { getRandomEncounter } from './data/encounters.js';
// ----------------------------- Global State
var metaState = createInitialMetaState();
// ----------------------------- State Management
function setMetaState(newState) {
    metaState = newState;
    renderCurrentScreen();
}
function renderCurrentScreen() {
    // Determine which screen to show based on state
    if (metaState.stage > TOTAL_STAGES) {
        showVictoryScreen();
    }
    else if (metaState.leftPath && metaState.rightPath && !metaState.kingdom) {
        // Path selection needed
        renderPathSelectionScreen(metaState);
        showPathSelectionUI();
    }
    else {
        // Stage screen
        renderMetaUI(metaState);
        showStageScreenUI();
    }
}
// ----------------------------- Random Utilities
function shuffleArray(array) {
    var _a;
    var result = __spreadArray([], __read(array), false);
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = __read([result[j], result[i]], 2), result[i] = _a[0], result[j] = _a[1];
    }
    return result;
}
function generateRandomSeed() {
    return Math.random().toString(36).substring(2, 10);
}
function hashString(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        hash = ((hash << 5) - hash) + s.charCodeAt(i);
    }
    return hash;
}
// ----------------------------- Stage Generation
function generateStageRewards() {
    var optionCount = getRewardOptionCount(metaState);
    // Get available pools, excluding already collected items
    var cardPool = getAvailableCards().filter(function (c) {
        return !vpCardNames.has(c.name) &&
            c.name !== 'Copper' && c.name !== 'Silver' && c.name !== 'Gold' &&
            !metaState.collectedCards.some(function (cc) { return cc.name === c.name; });
    });
    var eventPool = getAvailableEvents().filter(function (e) {
        return !vpEventNames.has(e.name) && e.name !== 'Refresh' &&
            !metaState.collectedEvents.some(function (ce) { return ce.name === e.name; });
    });
    var potionPool = allPotions.filter(function (p) {
        return !metaState.potions.some(function (cp) { return cp.name === p.name; });
    });
    var relicPool = allRelics.filter(function (r) {
        return !metaState.relics.some(function (cr) { return cr.spec.name === r.name; });
    });
    var shuffledCards = shuffleArray(cardPool);
    var shuffledEvents = shuffleArray(eventPool);
    var shuffledPotions = shuffleArray(potionPool);
    var shuffledRelics = shuffleArray(relicPool);
    var rewards = [
        { kind: 'card', options: shuffledCards.slice(0, optionCount), used: false, selectedCard: null },
        { kind: 'card', options: shuffledCards.slice(optionCount, optionCount * 2), used: false, selectedCard: null },
        { kind: 'event', options: shuffledEvents.slice(0, optionCount), used: false, selectedCard: null },
        { kind: 'potion', options: shuffledPotions.slice(0, optionCount), used: false, selectedCard: null },
        { kind: 'relic', options: shuffledRelics.slice(0, optionCount), used: false, selectedCard: null },
    ];
    // Add random encounter (generated based on current state)
    var randomEncounter = getRandomEncounter(metaState);
    rewards.push({
        kind: 'encounter',
        options: [],
        encounter: randomEncounter,
        used: false,
        selectedCard: null
    });
    return rewards;
}
function generateKingdom() {
    var seed = generateRandomSeed();
    var h = hashString(seed + 'vpmode');
    var modeIndex = ((h % vpModes.length) + vpModes.length) % vpModes.length;
    var kingdom = {
        kind: 'full',
        randomizer: {
            seed: seed,
            expansions: ['base']
        }
    };
    var vpModeName = vpModes[modeIndex].name;
    // Select random boon (no boon on final stage)
    var boon = null;
    if (metaState.stage !== TOTAL_STAGES && allBoons.length > 0) {
        boon = shuffleArray(__spreadArray([], __read(allBoons), false))[0];
    }
    return { kingdom: kingdom, vpModeName: vpModeName, boon: boon };
}
function generatePathOptions() {
    var optionCount = getRewardOptionCount(metaState);
    var cardPool = getAvailableCards().filter(function (c) {
        return !vpCardNames.has(c.name) &&
            c.name !== 'Copper' && c.name !== 'Silver' && c.name !== 'Gold' &&
            !metaState.collectedCards.some(function (cc) { return cc.name === c.name; });
    });
    var eventPool = getAvailableEvents().filter(function (e) {
        return !vpEventNames.has(e.name) && e.name !== 'Refresh' &&
            !metaState.collectedEvents.some(function (ce) { return ce.name === e.name; });
    });
    var potionPool = allPotions.filter(function (p) {
        return !metaState.potions.some(function (cp) { return cp.name === p.name; });
    });
    var shuffledCards = shuffleArray(cardPool);
    var shuffledEvents = shuffleArray(eventPool);
    var shuffledPotions = shuffleArray(potionPool);
    // Create 4 rewards
    var allRewards = [
        { kind: 'card', options: shuffledCards.slice(0, optionCount) },
        { kind: 'card', options: shuffledCards.slice(optionCount, optionCount * 2) },
        { kind: 'event', options: shuffledEvents.slice(0, optionCount) },
        { kind: 'potion', options: shuffledPotions.slice(0, optionCount) },
    ];
    // Shuffle and split 2-2
    var shuffledRewards = shuffleArray(allRewards);
    var leftRewards = shuffledRewards.slice(0, 2);
    var rightRewards = shuffledRewards.slice(2, 4);
    // Generate kingdoms for each path
    var leftKingdom = generateKingdom();
    var rightKingdom = generateKingdom();
    return {
        left: __assign({ rewards: leftRewards }, leftKingdom),
        right: __assign({ rewards: rightRewards }, rightKingdom)
    };
}
// ----------------------------- Game Actions
function handleSelectReward(rewardIndex, card) {
    return __awaiter(this, void 0, void 0, function () {
        var reward, newState, _a, updatedRewards;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reward = metaState.rewards[rewardIndex];
                    if (!reward || reward.used)
                        return [2 /*return*/];
                    newState = metaState;
                    _a = reward.kind;
                    switch (_a) {
                        case 'card': return [3 /*break*/, 1];
                        case 'event': return [3 /*break*/, 2];
                        case 'potion': return [3 /*break*/, 3];
                        case 'relic': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 6];
                case 1:
                    newState = collectCard(card)(newState);
                    return [3 /*break*/, 6];
                case 2:
                    newState = collectEvent(card)(newState);
                    return [3 /*break*/, 6];
                case 3:
                    newState = addPotion(card)(newState);
                    return [3 /*break*/, 6];
                case 4:
                    newState = addRelic(card)(newState);
                    return [4 /*yield*/, applyMetaTriggers('acquisition', { relic: card }, newState)];
                case 5:
                    // Apply acquisition triggers (async)
                    newState = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    updatedRewards = __spreadArray([], __read(newState.rewards), false);
                    updatedRewards[rewardIndex] = __assign(__assign({}, updatedRewards[rewardIndex]), { used: true, selectedCard: card });
                    newState = newState.updateSilent({ rewards: updatedRewards });
                    // Create checkpoint for undo
                    setMetaState(metaState.update(newState.toData()));
                    return [2 /*return*/];
            }
        });
    });
}
function handleSelectEncounterOption(rewardIndex, optionIndex) {
    return __awaiter(this, void 0, void 0, function () {
        var reward, encounter, option, newState, updatedRewards;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reward = metaState.rewards[rewardIndex];
                    if (!reward || reward.kind !== 'encounter' || !reward.encounter)
                        return [2 /*return*/];
                    encounter = reward.encounter;
                    option = encounter.options[optionIndex];
                    if (!option)
                        return [2 /*return*/];
                    return [4 /*yield*/, option.transform(metaState)
                        // Mark encounter as used if not multiUse or if this option finishes it
                    ];
                case 1:
                    newState = _a.sent();
                    // Mark encounter as used if not multiUse or if this option finishes it
                    if (!encounter.multiUse || option.finishesEncounter) {
                        updatedRewards = __spreadArray([], __read(newState.rewards), false);
                        updatedRewards[rewardIndex] = __assign(__assign({}, updatedRewards[rewardIndex]), { used: true });
                        setMetaState(metaState.update(newState.updateSilent({ rewards: updatedRewards }).toData()));
                    }
                    else {
                        // For multi-use encounters, create checkpoint and re-render
                        setMetaState(metaState.update(newState.toData()));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleSelectPath(direction) {
    var selectedPath = direction === 'left' ? metaState.leftPath : metaState.rightPath;
    if (!selectedPath)
        return;
    // Convert path rewards to reward options
    var rewards = selectedPath.rewards.map(function (reward) { return ({
        kind: reward.kind,
        options: reward.options,
        encounter: reward.encounter,
        used: false,
        selectedCard: null
    }); });
    setMetaState(metaState.update({
        kingdom: selectedPath.kingdom,
        vpModeName: selectedPath.vpModeName,
        boon: selectedPath.boon,
        rewards: rewards,
        leftPath: null,
        rightPath: null,
    }));
}
function handlePlayKingdom() {
    return __awaiter(this, void 0, void 0, function () {
        var state, vpMode, vpCards, vpEvents, boonCards, boonEvents, sortedCards, sortedEvents, baseVpGoal, gameSetupParams, effectiveSpec, gameState, par;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!metaState.kingdom)
                        return [2 /*return*/];
                    return [4 /*yield*/, applyMetaTriggers('courseStart', { stage: metaState.stage }, metaState)
                        // Update buffer display after triggers
                    ];
                case 1:
                    state = _c.sent();
                    // Update buffer display after triggers
                    setMetaState(state);
                    vpMode = vpModes.find(function (m) { return m.name === metaState.vpModeName; });
                    vpCards = (vpMode === null || vpMode === void 0 ? void 0 : vpMode.cards) || [];
                    vpEvents = (vpMode === null || vpMode === void 0 ? void 0 : vpMode.events) || [];
                    boonCards = ((_a = metaState.boon) === null || _a === void 0 ? void 0 : _a.cards) || [];
                    boonEvents = ((_b = metaState.boon) === null || _b === void 0 ? void 0 : _b.events) || [];
                    sortedCards = __spreadArray(__spreadArray(__spreadArray([], __read(vpCards), false), __read(boonCards), false), __read(metaState.collectedCards), false).sort(supplyComp);
                    sortedEvents = __spreadArray(__spreadArray(__spreadArray([], __read(vpEvents), false), __read(boonEvents), false), __read(metaState.collectedEvents), false).sort(eventComp);
                    baseVpGoal = goalForSpec(metaState.kingdom);
                    gameSetupParams = applyMetaReplacers('gameSetup', {
                        par: 0,
                        vpGoal: baseVpGoal,
                        cardSpecs: sortedCards,
                        eventSpecs: sortedEvents
                    }, metaState.relics);
                    effectiveSpec = metaState.kingdom;
                    if (gameSetupParams.vpGoal !== baseVpGoal) {
                        effectiveSpec = { kind: 'goal', vp: gameSetupParams.vpGoal, spec: metaState.kingdom };
                    }
                    gameState = createInitialGameState(effectiveSpec, sortedCards, sortedEvents, metaState.potions, metaState.relics);
                    par = calculatePar(metaState);
                    setCurrentPar(par);
                    // Hide meta UI and start game
                    hideAllMetaUI();
                    startGame(gameState, {
                        onVictory: handleGameVictory,
                        onBack: function () { return renderCurrentScreen(); }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function handleGameVictory(score, remainingPotions, relicStates) {
    return __awaiter(this, void 0, void 0, function () {
        var par, newStageScores, newStagePars, newBuffer, newState, nextStage, paths;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    par = calculatePar(metaState);
                    newStageScores = __spreadArray([], __read(metaState.stageScores), false);
                    newStagePars = __spreadArray([], __read(metaState.stagePars), false);
                    newStageScores[metaState.stage - 1] = score;
                    newStagePars[metaState.stage - 1] = par;
                    newBuffer = metaState.buffer;
                    if (score > par) {
                        newBuffer -= (score - par);
                    }
                    newState = metaState.update({
                        stageScores: newStageScores,
                        stagePars: newStagePars,
                        buffer: newBuffer,
                        potions: remainingPotions,
                        relics: relicStates,
                    });
                    return [4 /*yield*/, applyMetaTriggers('gameEnd', { score: score, par: par }, newState)
                        // Check for game over
                    ];
                case 1:
                    newState = _a.sent();
                    // Check for game over
                    if (newState.buffer < 0) {
                        setMetaState(newState);
                        showGameOverScreen();
                        bindRestartButton();
                        return [2 /*return*/];
                    }
                    nextStage = metaState.stage + 1;
                    if (nextStage > TOTAL_STAGES) {
                        setMetaState(newState.updateSilent({ stage: nextStage }));
                        showVictoryScreen();
                        bindRestartButton();
                    }
                    else {
                        paths = generatePathOptions();
                        setMetaState(newState.updateSilent({
                            stage: nextStage,
                            kingdom: null,
                            leftPath: paths.left,
                            rightPath: paths.right,
                            rewards: [],
                            emptyBottleBoughtCards: [],
                        }));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function handleUndo() {
    var undone = metaState.undo();
    if (undone) {
        setMetaState(undone);
    }
}
function handleRedo() {
    var redone = metaState.redo();
    if (redone) {
        setMetaState(redone);
    }
}
function handleOpenDeck() {
    showDeckDialog(metaState);
}
function handleCloseDeck() {
    hideDeckDialog();
}
function bindRestartButton() {
    $('#restartGame, #gameOverRestart').off('click').on('click', function () {
        showLandingPage();
    });
}
// ----------------------------- Initialization
export function showLandingPage() {
    // Create fresh meta state with UI attached
    metaState = createInitialMetaState().attachUI(metaUIInstance);
    // Generate initial stage
    var _a = generateKingdom(), kingdom = _a.kingdom, vpModeName = _a.vpModeName, boon = _a.boon;
    var rewards = generateStageRewards();
    metaState = metaState.updateSilent({
        kingdom: kingdom,
        vpModeName: vpModeName,
        boon: boon,
        rewards: rewards,
    });
    // Set up UI callbacks
    setMetaUICallbacks({
        onSelectReward: handleSelectReward,
        onSelectEncounterOption: handleSelectEncounterOption,
        onSelectPath: handleSelectPath,
        onPlayKingdom: handlePlayKingdom,
        onUndo: handleUndo,
        onRedo: handleRedo,
        onOpenDeck: handleOpenDeck,
        onCloseDeck: handleCloseDeck,
    });
    // Bind UI events
    bindMetaUIEvents();
    // Render initial screen
    renderCurrentScreen();
}
// Initialize on load
initHotkeys();
//# sourceMappingURL=mainNew.js.map