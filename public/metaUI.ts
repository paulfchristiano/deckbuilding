// metaUI.ts - Meta-game UI rendering
// Handles stage selection, path selection, card pickers, etc.
// Renders directly from MetaState - no legacy globals.

import { Card, CardSpec, GameSpec, UndoPastBeginning, VictoryData } from './gameLogic.js'
import {
    MetaState, Reward, Path,
    MetaUI, MetaOption,
    renderChallenge,
    RewardKind,
    ChallengeOrReward,
    Undo, Redo
} from './metaLogic.js'
import { renderSpecNoRelated } from './cardRendering.js'
import { initHotkeys, startGame } from './gameUI.js'

// ----------------------------- State

let deckDialogOpen = false
let activeEncounterIndex: number | null = null

// ----------------------------- MetaUI Implementation

// Resolver for pending async choice operations
//let pendingChoiceResolver: ((value: any) => void) | null = null

export class MetaGameUI implements MetaUI {
    constructor() {
        initHotkeys() // TODO: understand and fix this
    }
    async chooseCard<T extends CardSpec | Card>(
        state: MetaState,
        prompt: string,
        options: T[],
        canCancel: boolean = true
    ): Promise<T | null> {
        return new Promise((resolve, reject) => {
            bindUndoEvents(state, reject)
            //pendingChoiceResolver = resolve

            $('#cardPickerTitle').text(prompt)
            const container = $('#cardPickerOptions')
            container.empty()

            for (const card of options) {
                const specHtml = renderSpecNoRelated('spec' in card ? card.spec : card)
                const optionEl = $(specHtml)
                optionEl.css('cursor', 'pointer')
                optionEl.on('click', () => {
                    hideCardPicker()
                    //pendingChoiceResolver = null
                    resolve(card)
                })
                container.append(optionEl)
            }

            if (canCancel) {
                $('#cardPickerCancel').show()
                $('#cardPickerCancel').off('click').on('click', () => {
                    hideCardPicker()
                    //pendingChoiceResolver = null
                    resolve(null)
                })
            } else {
                $('#cardPickerCancel').hide()
            }

            $('#cardPickerDialog').attr('active', 'true')
        })
    }

    async pickNextStep(state: MetaState): Promise<ChallengeOrReward> {
        return new Promise((resolve, reject) => {
            bindUndoEvents(state, reject)
            renderStageScreen(state, resolve)
        })
    }

    async pickPath(state: MetaState, paths: Path[]): Promise<Path> {
        return new Promise((resolve, reject) => {
            bindUndoEvents(state, reject)
            renderPathSelectionScreen(state, paths, resolve)
        })
    }

    async chooseOption<T>(
        state: MetaState,
        prompt: string,
        options: MetaOption<T>[],
        canCancel: boolean = true
    ): Promise<T | null> {
        return new Promise((resolve, reject) => {
            bindUndoEvents(state, reject)
            //pendingChoiceResolver = resolve

            $('#encounterTitle').text(prompt)
            $('#encounterDescription').text('')
            const container = $('#encounterOptions')
            container.empty()

            for (const option of options) {
                const optionDiv = $('<div class="encounterOption"></div>')

                if (option.spec) {
                    // Show the card spec with label as subtitle
                    const specHtml = renderSpecNoRelated(option.spec)
                    const specEl = $(specHtml)
                    if (option.disabled) {
                        specEl.css('opacity', '0.5')
                        specEl.css('cursor', 'default')
                    } else {
                        specEl.css('cursor', 'pointer')
                        specEl.on('click', () => {
                            hideEncounterPicker()
                            //pendingChoiceResolver = null
                            resolve(option.value)
                        })
                    }
                    optionDiv.append(specEl)

                    const subtitleSpan = $('<div class="encounterOptionSubtitle"></div>')
                    subtitleSpan.text(option.label)
                    optionDiv.append(subtitleSpan)
                } else {
                    // Standard name + description display
                    const nameSpan = $('<span class="option encounterOptionName" choosable></span>')
                    nameSpan.text(option.label)
                    const specEl = nameSpan // TODO: copy-pasted claude code, should fix up an dunifu with previous case.
                    if (option.disabled) {
                        specEl.css('opacity', '0.5')
                        specEl.css('cursor', 'default')
                    } else {
                        specEl.css('cursor', 'pointer')
                        specEl.on('click', () => {
                            hideEncounterPicker()
                            //pendingChoiceResolver = null
                            resolve(option.value)
                        })
                    }
                    if (option.description) {
                        const descSpan = $('<div class="encounterOptionDesc"></div>')
                        descSpan.text(option.description)
                        optionDiv.append(nameSpan)
                        optionDiv.append(descSpan)
                    } else {
                        optionDiv.append(nameSpan)
                    }
                }

                container.append(optionDiv)
            }

            if (canCancel) {
                $('#encounterCancel').show()
                $('#encounterCancel').off('click').on('click', () => {
                    hideEncounterPicker()
                    //pendingChoiceResolver = null
                    resolve(null)
                })
            } else {
                $('#encounterCancel').hide()
            }

            $('#encounterDialog').attr('active', 'true')
        })
    }

    async showMessage(state: MetaState, message: string): Promise<void> {
        // For now, just log to console. Could show a dialog in the future.
        console.log(`[MetaUI Message]: ${message}`)
    }

    playGame(spec: GameSpec): Promise<VictoryData> {
         return startGame(spec).catch(e => {
            if (e instanceof UndoPastBeginning) {
                throw new Undo() // We transform an undo past the beginnig in the object level game into an undo in the meta game.
            } else {
                throw e
            }
        })
    }

    /*
    render(state: MetaState): void {
        renderMetaUI(state)
    }
        */
}

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

function updateBufferDisplay(state: MetaState): void {
    $('#bufferDisplay').text(`Buffer: ${state.data.buffer}`)
}

// ----------------------------- Progress Sidebar

function updateProgressSidebar(state: MetaState): void {
    $('#progressLine .progressCircle, #progressLinePath .progressCircle').each(function () {
        const stage = parseInt($(this).attr('data-stage') || '0')
        $(this).removeClass('completed current')
        $(this).find('.progressScore').remove()

        if (stage < state.data.stage) {
            $(this).addClass('completed')
            const score = state.data.stageScores[stage]
            const par = state.data.stagePars[stage]
            if (score !== null && par !== null) {
                const scoreDisplay = `${score}/${par}`
                const color = score > par ? 'color: red' : (score < par ? 'color: green' : '')
                $(this).append(`<span class="progressScore" style="${color}">${scoreDisplay}</span>`)
            }
        } else if (stage === state.data.stage) {
            $(this).addClass('current')
        }
    })
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

function renderStageScreen(state: MetaState, callback: (x: ChallengeOrReward) => void): void {
    showStageScreenUI()
    $('#stageTitle').text(`Stage ${state.data.stage}`)
    render(state)

    // Render reward buttons
    renderRewardButtons(state, callback)

    if (state.data.challenge) {
        $('#playKingdom').html(renderChallenge(state.data.challenge, state))
        $('#playKingdom').off('click').on('click', () => callback({kind: 'challenge'}))
    }
}

// TODO: stop using jquery
function renderRewardButtons(state: MetaState, callback: (x: ChallengeOrReward) => void): void {
    const container = $('#rewardButtons')
    container.empty()

    state.data.rewards.forEach((reward, index) => {
        const row = $('<div class="gameRow"></div>')

        // Card/Event/Potion/Relic picker
        const label = reward.result
            ? `✓ ${reward.result}`
            : getRewardLabel(reward.kind)
        const button = $(`<span class="option" choosable>${label}</span>`)

        if (reward.result) {
            button.attr('disabled', 'disabled')
            button.removeAttr('choosable')
        } else {
            button.on('click', () => callback({kind: 'reward', index}))
        }

        row.append(button)
        container.append(row)
    })

    
}

function getRewardLabel(kind: RewardKind): string {
    switch (kind) {
        case 'card': return 'Add Card'
        case 'event': return 'Add Event'
        case 'potion': return 'Add Potion'
        case 'relic': return 'Add Relic'
        case 'encounter': return '???'
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

function hideCardPicker(): void {
    $('#cardPickerDialog').attr('active', 'false')
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

function hideEncounterPicker(): void {
    $('#encounterDialog').attr('active', 'false')
    activeEncounterIndex = null
}

// ----------------------------- Path Selection Screen

export function renderPathSelectionScreen(state: MetaState, paths: Path[], callback: (path:Path) => void): void {
    showPathSelectionUI()
    console.assert(paths.length === 2, 'There must be exactly two path options to choose from.')
    const [leftPath, rightPath] = paths

    render(state)

    $('#pathTitle').text(`Stage ${state.data.stage} - Choose Your Path`)

    // Populate left path
    renderPathColumn('left', leftPath, state, callback)
    $('#goLeft').off('click').on('click', () => {
        callback(leftPath)
    })
    
    // Populate right path
    renderPathColumn('right', rightPath, state, callback)
    $('#goRight').off('click').on('click', () => {
        callback(rightPath)
    })
}

function renderPathColumn(side: 'left' | 'right', path: Path, state: MetaState, callback: (path:Path) => void): void {
    const rewardsContainer = $(`#${side}Rewards`)
    rewardsContainer.empty()

    for (const reward of path.rewards) {
        const rewardText = getRewardLabel(reward.kind)
        rewardsContainer.append(`<div class="pathReward">${rewardText}</div>`)
    }

    $(`#${side}Play`).text(renderChallenge(path.challenge, state))
}

// ----------------------------- Deck Dialog

// Undo, hotkeys, etc.?
function render(state: MetaState): void {
    $('#deckIcon').off('click').on('click', () => {showDeckDialog(state)})
    updateBufferDisplay(state)
    updateProgressSidebar(state)
}

export function showDeckDialog(state: MetaState): void {
    const container = $('#deckContents')
    container.empty()

    // Show collected cards
    if (state.data.collectedCards.length > 0) {
        container.append('<div><strong>Cards:</strong></div>')
        for (const card of state.data.collectedCards) {
            container.append(renderSpecNoRelated(card))
        }
    }

    // Show collected events
    if (state.data.collectedEvents.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Events:</strong></div>')
        for (const event of state.data.collectedEvents) {
            container.append(renderSpecNoRelated(event))
        }
    }

    // Show potions
    if (state.data.potions.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Potions:</strong></div>')
        for (const potion of state.data.potions) {
            container.append(renderSpecNoRelated(potion.spec))
        }
    }

    // Show relics
    if (state.data.relics.length > 0) {
        container.append('<div style="margin-top: 10px;"><strong>Relics:</strong></div>')
        for (const relic of state.data.relics) {
            container.append(renderSpecNoRelated(relic.spec))
        }
    }

    if (state.data.collectedCards.length === 0 && state.data.collectedEvents.length === 0 &&
        state.data.potions.length === 0 && state.data.relics.length === 0) {
        container.append('<div>No items collected yet.</div>')
    }

    $('#deckClose').off('click').on('click', () => {
        hideDeckDialog()
    })

    $('#deckDialog').attr('active', 'true')
    deckDialogOpen = true
}

export function hideDeckDialog(): void {
    $('#deckDialog').attr('active', 'false')
    deckDialogOpen = false
}

export function isDeckDialogOpen(): boolean {
    return deckDialogOpen
}

// ----------------------------- Victory/Game Over Screens

export function showVictoryScreen(): void {
    $('#stageScreen').hide()
    $('#pathSelectionScreen').hide()
    $('#gameContainer').hide()
    $('#gameOverScreen').hide()
    $('#victoryScreen').show()
}

export function showGameOverScreen(): void {
    $('#stageScreen').hide()
    $('#pathSelectionScreen').hide()
    $('#gameContainer').hide()
    $('#victoryScreen').hide()
    $('#gameOverScreen').show()
}

// ----------------------------- Screen Visibility

export function showStageScreenUI(): void {
    $('#stageScreen').show()
    $('#pathSelectionScreen').hide()
    $('#gameContainer').hide()
    $('#victoryScreen').hide()
    $('#gameOverScreen').hide()
}

export function showPathSelectionUI(): void {
    $('#stageScreen').hide()
    $('#pathSelectionScreen').show()
    $('#gameContainer').hide()
    $('#victoryScreen').hide()
    $('#gameOverScreen').hide()
}

export function hideAllMetaUI(): void {
    $('#stageScreen').hide()
    $('#pathSelectionScreen').hide()
    $('#victoryScreen').hide()
    $('#gameOverScreen').hide()
}

// ----------------------------- Undo Events

function bindUndoEvents(state: MetaState, reject: (e:Error) => void): void {
    const canUndo = state.canUndo()
    const canRedo = state.canRedo()

    $('#metaUndo, #metaUndoPath').each(function () {
        if (canUndo) {
            $(this).removeAttr('disabled')
            $(this).off('click').on('click', () => reject(new Undo()))
        } else {
            $(this).attr('disabled', 'disabled')
        }
    })

    $('#metaRedo, #metaRedoPath').each(function () {
        if (canRedo) {
            $(this).removeAttr('disabled')
            $(this).off('click').on('click', () => reject(new Redo()))
        } else {
            $(this).attr('disabled', 'disabled')
        }
    })
}