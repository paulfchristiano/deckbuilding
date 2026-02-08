// metaUI.ts - Meta-game UI for roguelike progression
// Handles stage selection, path selection, reward pickers, deck viewing

import { Card, CardSpec, GameSpec, UndoPastBeginning, VictoryData } from './gameLogic.js'
import {
    MetaState, RewardState, Path, ChallengeSpec,
    MetaUI, MetaOption,
    BASE_PARS, describeParCalculation,
    makeSpec,
    ActiveGameProgress,
    renderChallenge,
    getRewardOptions, getRewardName, updateRewardState, updateRewardAtIndex,
    Undo, Redo, ReplayStage, ExitToLauncher
} from './metaLogic.js'
import { buildSpecTooltipFull, buildSpecTooltipSimple, renderSpecNoRelated } from './cardRendering.js'
import { initHotkeys, startGame, keyListeners } from './gameUI.js'
import { ProgressStageDisplay, renderProgressSidebar } from './progressSidebar.js'

// ----------------------------- DOM Helpers

function getElement(id: string): HTMLElement {
    return document.getElementById(id)!
}

function clearElement(el: HTMLElement): void {
    el.innerHTML = ''
}

function createDiv(className?: string): HTMLDivElement {
    const div = document.createElement('div')
    if (className) div.className = className
    return div
}

function createSpan(className?: string): HTMLSpanElement {
    const span = document.createElement('span')
    if (className) span.className = className
    return span
}

function createElementFromHTML(html: string): HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.firstChild as HTMLElement
}

function createTooltip(text: string): HTMLSpanElement {
    const tooltip = createSpan('tooltip')
    tooltip.style.whiteSpace = 'pre-line'
    tooltip.textContent = text
    return tooltip
}

function showElement(el: HTMLElement): void {
    el.removeAttribute('hidden')
}

function hideElement(el: HTMLElement): void {
    el.setAttribute('hidden', '')
}

// ----------------------------- Screen Management

type Screen = 'stage' | 'path' | 'game' | 'victory' | 'gameOver'

function showScreen(screen: Screen): void {
    const screens: Record<Screen, string> = {
        stage: 'stageScreen',
        path: 'pathSelectionScreen',
        game: 'gameContainer',
        victory: 'victoryScreen',
        gameOver: 'gameOverScreen'
    }

    for (const [name, id] of Object.entries(screens)) {
        const el = getElement(id)
        if (name === screen) {
            showElement(el)
        } else {
            hideElement(el)
        }
    }
}

// ----------------------------- Dialog Management

function showDialog(id: string): void {
    getElement(id).setAttribute('active', 'true')
}

function hideDialog(id: string): void {
    getElement(id).setAttribute('active', 'false')
}

function bindDialogDismiss(dialogId: string, onDismiss: () => void): () => void {
    const dialog = getElement(dialogId)
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'z') {
            e.preventDefault()
            e.stopPropagation()
            onDismiss()
        }
    }
    const onMouseDown = (e: MouseEvent) => {
        const target = e.target as Node | null
        if (target !== null && !dialog.contains(target)) {
            onDismiss()
        }
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('mousedown', onMouseDown, true)
    return () => {
        document.removeEventListener('keydown', onKeyDown, true)
        document.removeEventListener('mousedown', onMouseDown, true)
    }
}

let currentUndoRedoState: {
    state: MetaState | null,
    onUndo: (() => void) | null,
    onRedo: (() => void) | null
} = {
    state: null,
    onUndo: null,
    onRedo: null
}

let modalDialogDepth = 0

function refreshUndoRedoButtons(): void {
    const state = currentUndoRedoState.state
    const onUndo = currentUndoRedoState.onUndo
    const onRedo = currentUndoRedoState.onRedo
    if (state === null || onUndo === null || onRedo === null) return

    const dialogsOpen = modalDialogDepth > 0
    const undoEnabled = !dialogsOpen && state.canUndo()
    const redoEnabled = !dialogsOpen && state.canRedo()

    const undoButtons = document.querySelectorAll('#metaUndo, #metaUndoPath')
    const redoButtons = document.querySelectorAll('#metaRedo, #metaRedoPath')

    undoButtons.forEach(btn => {
        const el = btn as HTMLElement
        if (undoEnabled) {
            el.removeAttribute('disabled')
            el.onclick = onUndo
        } else {
            el.setAttribute('disabled', 'disabled')
            el.onclick = null
        }
    })

    redoButtons.forEach(btn => {
        const el = btn as HTMLElement
        if (redoEnabled) {
            el.removeAttribute('disabled')
            el.onclick = onRedo
        } else {
            el.setAttribute('disabled', 'disabled')
            el.onclick = null
        }
    })

    if (undoEnabled) {
        keyListeners.set('z', onUndo)
    } else {
        keyListeners.delete('z')
    }
    if (redoEnabled) {
        keyListeners.set('Z', onRedo)
    } else {
        keyListeners.delete('Z')
    }
}

function enterModalDialog(): void {
    modalDialogDepth++
    refreshUndoRedoButtons()
}

function exitModalDialog(): void {
    modalDialogDepth = Math.max(0, modalDialogDepth - 1)
    refreshUndoRedoButtons()
}

// ----------------------------- Progress & Buffer Display

function updateBufferDisplay(state: MetaState): void {
    getElement('bufferDisplay').textContent = `Buffer: ${state.data.buffer}`
}

function updateProgressSidebar(state: MetaState, onReplayStage?: (stage: number) => void): void {
    const renderLine = (selector: string, inGameSidebar: boolean): void => {
        const displays: ProgressStageDisplay[] = []
        for (let stage = 0; stage < BASE_PARS.length; stage++) {
            const display: ProgressStageDisplay = { stage }
            const basePar = BASE_PARS[stage]
            const currentStagePar = (
                stage === state.data.stage &&
                state.data.challenges.length === 1
            )
                ? makeSpec(state, state.data.challenges[0]).par
                : null

            let tooltip = basePar === undefined ? '' : `${basePar} (base)`
            if (stage < state.data.stage) {
                const replayData = state.data.stageReplays[stage]
                if (replayData !== null) {
                    tooltip = describeParCalculation(stage, replayData.challenge, replayData.spec.relics)
                }
            } else if (stage === state.data.stage && currentStagePar !== null) {
                tooltip = describeParCalculation(stage, state.data.challenges[0], state.data.relics)
            }
            display.tooltipText = tooltip.replace(/, /g, '\n')

            if (stage < state.data.stage) {
                display.completed = true
                const score = state.data.stageScores[stage]
                const par = state.data.stagePars[stage]
                if (score !== null && par !== null) {
                    display.scoreText = `${score}/${par}`
                    if (score > par) display.scoreColor = 'red'
                    else if (score < par) display.scoreColor = 'green'
                }
                if (!inGameSidebar && onReplayStage && state.data.stageReplays[stage] !== null) {
                    display.replayable = true
                    display.onClick = () => onReplayStage(stage)
                }
            } else if (stage === state.data.stage) {
                display.current = true
                if (state.data.phase === 'in_game' && currentStagePar !== null) display.scoreText = `?/${currentStagePar}`
                else if (basePar !== undefined) display.scoreText = `${basePar}`
            } else {
                if (basePar !== undefined) display.scoreText = `${basePar}`
            }
            displays.push(display)
        }
        renderProgressSidebar(selector, displays)
    }

    renderLine('#progressLine', false)
    renderLine('#progressLinePath', false)
    renderLine('#progressLineGame', true)
}

function encounterTooltipText(rewardState: RewardState, state: MetaState): string {
    if (rewardState.kind !== 'encounter' || rewardState.encounter === null) return ''
    const options = getRewardOptions(rewardState, state)
    if (options.length === 0) return ''
    const lines: string[] = []
    for (const option of options) {
        const text = option.description ? `${option.label}: ${option.description}` : option.label
        lines.push(text)
    }
    return lines.join('\n')
}

// ----------------------------- Undo/Redo Button Binding

function bindUndoRedoButtons(state: MetaState, onUndo: () => void, onRedo: () => void): void {
    currentUndoRedoState = { state, onUndo, onRedo }
    refreshUndoRedoButtons()
}

// ----------------------------- Common State Rendering

function renderCommonUI(state: MetaState, onReplayStage?: (stage: number) => void): void {
    updateBufferDisplay(state)
    updateProgressSidebar(state, onReplayStage)

    // Bind deck icon (toggle on click)
    const deckIcon = getElement('deckIcon')
    deckIcon.onclick = () => deckDialogOpen ? hideDeckDialog() : showDeckDialog(state)
}

// ----------------------------- Card Picker Dialog

function showCardPicker<T extends CardSpec | Card>(
    prompt: string,
    options: T[],
    canCancel: boolean,
    onSelect: (card: T) => void,
    onCancel: () => void
): void {
    enterModalDialog()
    let closed = false
    let unbindDismiss = () => {}
    function close(next: () => void): void {
        if (closed) return
        closed = true
        unbindDismiss()
        hideDialog('cardPickerDialog')
        exitModalDialog()
        next()
    }

    getElement('cardPickerTitle').textContent = prompt

    const container = getElement('cardPickerOptions')
    clearElement(container)

    for (const card of options) {
        const spec: CardSpec = 'spec' in card ? (card as Card).spec : card as CardSpec
        const optionEl = createElementFromHTML(renderSpecNoRelated(spec))
        optionEl.style.cursor = 'pointer'
        optionEl.onclick = () => close(() => onSelect(card))
        container.appendChild(optionEl)
    }

    const cancelBtn = getElement('cardPickerCancel')
    if (canCancel) {
        showElement(cancelBtn)
        cancelBtn.onclick = () => close(onCancel)
    } else {
        hideElement(cancelBtn)
    }

    showDialog('cardPickerDialog')
    if (canCancel) {
        unbindDismiss = bindDialogDismiss('cardPickerDialog', () => close(onCancel))
    }
}

// ----------------------------- Option Picker Dialog (for encounters)

function showOptionPicker<T>(
    prompt: string,
    options: MetaOption<T>[],
    canCancel: boolean,
    onSelect: (value: T) => void,
    onCancel: () => void
): void {
    enterModalDialog()
    let closed = false
    let unbindDismiss = () => {}
    function close(next: () => void): void {
        if (closed) return
        closed = true
        unbindDismiss()
        hideDialog('encounterDialog')
        exitModalDialog()
        next()
    }

    getElement('encounterTitle').textContent = prompt
    getElement('encounterDescription').textContent = ''

    const container = getElement('encounterOptions')
    clearElement(container)

    for (const option of options) {
        const optionDiv = createDiv('encounterOption')

        if (option.spec) {
            // Display as card spec with label subtitle
            const specEl = createElementFromHTML(renderSpecNoRelated(option.spec))

            if (option.disabled) {
                specEl.style.opacity = '0.5'
                specEl.style.cursor = 'default'
            } else {
                specEl.style.cursor = 'pointer'
                specEl.onclick = () => close(() => onSelect(option.value))
            }
            optionDiv.appendChild(specEl)

            const subtitle = createDiv('encounterOptionSubtitle')
            subtitle.textContent = option.label
            optionDiv.appendChild(subtitle)
        } else {
            // Display as text option
            const nameSpan = createSpan('option encounterOptionName')
            nameSpan.setAttribute('choosable', '')
            nameSpan.textContent = option.label

            if (option.disabled) {
                nameSpan.style.opacity = '0.5'
                nameSpan.style.cursor = 'default'
            } else {
                nameSpan.style.cursor = 'pointer'
                nameSpan.onclick = () => close(() => onSelect(option.value))
            }

            optionDiv.appendChild(nameSpan)

            if (option.description) {
                const descDiv = createDiv('encounterOptionDesc')
                descDiv.textContent = option.description
                optionDiv.appendChild(descDiv)
            }
        }

        container.appendChild(optionDiv)
    }

    const cancelBtn = getElement('encounterCancel')
    if (canCancel) {
        showElement(cancelBtn)
        cancelBtn.onclick = () => close(onCancel)
    } else {
        hideElement(cancelBtn)
    }

    showDialog('encounterDialog')
    if (canCancel) {
        unbindDismiss = bindDialogDismiss('encounterDialog', () => close(onCancel))
    }
}

// ----------------------------- Stage Screen

function renderStageScreen(
    state: MetaState,
    onChallenge: (challenge: ChallengeSpec) => void,
    onOptionClick: (rewardIndex: number, optionIndex: number) => void,
    onReplayStage: (stage: number) => void
): void {
    showScreen('stage')
    renderCommonUI(state, onReplayStage)

    getElement('stageTitle').textContent = `Stage ${state.data.stage}`

    // Render rewards with inline options
    const rewardContainer = getElement('rewardButtons')
    clearElement(rewardContainer)

    state.data.rewardStates.forEach((rewardState, rewardIndex) => {
        const rewardRow = createDiv('rewardRow')

        // Add reward name/label
        const labelDiv = createDiv('rewardLabel')
        labelDiv.textContent = getRewardName(rewardState)
        if (rewardState.kind === 'encounter') {
            const tooltipText = encounterTooltipText(rewardState, state)
            if (tooltipText !== '') {
                labelDiv.appendChild(createTooltip(tooltipText))
            }
        }
        rewardRow.appendChild(labelDiv)

        // Add options container
        const optionsDiv = createDiv('rewardOptions')

        const options = getRewardOptions(rewardState, state)
        options.forEach((option, optionIndex) => {
            let optionEl: HTMLElement

            if (option.spec) {
                // Render as card
                const hasRelatedContent = (option.spec.relatedCards || []).length > 0 || (option.spec.rules || []).length > 0
                const useRelatedTooltipMode =
                    rewardState.kind === 'card' ||
                    rewardState.kind === 'potion' ||
                    rewardState.kind === 'event'
                const tooltipMode = useRelatedTooltipMode && hasRelatedContent
                    ? 'onlyRelated'
                    : 'default'
                optionEl = createElementFromHTML(renderSpecNoRelated(option.spec, tooltipMode))
                optionEl.classList.add('rewardOption')
            } else {
                // Render as text button
                optionEl = createDiv('rewardOption option')
                if (option.compact) optionEl.classList.add('rewardOptionCompact')
                const nameDiv = createDiv('rewardOptionNameText')
                nameDiv.textContent = option.label
                optionEl.appendChild(nameDiv)
                if (option.description) {
                    const descDiv = createDiv('rewardOptionDescriptionText')
                    descDiv.textContent = option.description
                    optionEl.appendChild(descDiv)
                }
                if (option.tooltipSpec) {
                    const tooltipSimple = createSpan('tooltip tooltip-simple')
                    tooltipSimple.innerHTML = buildSpecTooltipSimple(option.tooltipSpec)
                    optionEl.appendChild(tooltipSimple)

                    const tooltipFull = createSpan('tooltip tooltip-full')
                    tooltipFull.innerHTML = buildSpecTooltipFull(option.tooltipSpec)
                    optionEl.appendChild(tooltipFull)
                }
            }

            if (option.disabled) {
                optionEl.setAttribute('disabled', 'disabled')
                if (option.checked) {
                    optionEl.classList.add('checked')
                    // Add checkmark
                    const checkmark = createSpan('checkmark')
                    checkmark.textContent = ' ✓'
                    optionEl.appendChild(checkmark)
                }
            } else {
                optionEl.setAttribute('choosable', '')
                optionEl.style.cursor = 'pointer'
                optionEl.onclick = () => onOptionClick(rewardIndex, optionIndex)
            }

            optionsDiv.appendChild(optionEl)
        })

        rewardRow.appendChild(optionsDiv)
        rewardContainer.appendChild(rewardRow)
    })

    // Render challenge button(s)
    const challengeContainer = getElement('challengeButtons')
    clearElement(challengeContainer)

    for (const challenge of state.data.challenges) {
        const playBtn = createSpan('option')
        playBtn.setAttribute('choosable', '')
        playBtn.innerHTML = renderChallenge(challenge, state)
        playBtn.onclick = () => onChallenge(challenge)
        challengeContainer.appendChild(playBtn)
    }
}

// ----------------------------- Path Selection Screen

function renderPathSelectionScreen(
    state: MetaState,
    paths: Path[],
    onSelect: (path: Path) => void,
    onReplayStage: (stage: number) => void
): void {
    showScreen('path')
    renderCommonUI(state, onReplayStage)

    console.assert(paths.length === 2, 'Expected exactly two paths')
    const [leftPath, rightPath] = paths

    getElement('pathTitle').textContent = `Stage ${state.data.stage} - Choose Your Path`

    renderPathColumn('left', leftPath, state)
    renderPathColumn('right', rightPath, state)

    getElement('goLeft').onclick = () => onSelect(leftPath)
    getElement('goRight').onclick = () => onSelect(rightPath)
}

function renderPathColumn(side: 'left' | 'right', path: Path, state: MetaState): void {
    const rewardsContainer = getElement(`${side}Rewards`)
    clearElement(rewardsContainer)

    for (const rewardState of path.rewardStates) {
        const rewardDiv = createDiv('pathReward')
        rewardDiv.textContent = getRewardName(rewardState)
        rewardsContainer.appendChild(rewardDiv)
    }

    // Each path has one challenge (singleton list for later stages)
    getElement(`${side}Play`).innerHTML = renderChallenge(path.challenges[0], state)
}

// ----------------------------- Deck Dialog

let deckDialogOpen = false

function showDeckDialog(state: MetaState): void {
    const container = getElement('deckContents')
    clearElement(container)
    const relicDisplaySpecs = state.data.relics.map(relic => (
        relic.name === 'Winged Boots'
            ? { ...relic.spec, name: `${relic.spec.name} (${relic.count('charge')})` }
            : relic.spec
    ))

    const sections: Array<{ title: string, items: CardSpec[] }> = [
        { title: 'Cards', items: state.data.collectedCards },
        { title: 'Events', items: state.data.collectedEvents },
        { title: 'Potions', items: state.data.potions.map(p => p.spec) },
        { title: 'Relics', items: relicDisplaySpecs }
    ]

    let hasContent = false
    for (const section of sections) {
        if (section.items.length > 0) {
            hasContent = true

            // Create section container
            const sectionDiv = createDiv('deckSection')

            // Header
            const header = createDiv('deckSectionHeader')
            header.innerHTML = `<strong>${section.title}:</strong>`
            sectionDiv.appendChild(header)

            // Items row
            const itemsRow = createDiv('deckSectionItems')
            for (const spec of section.items) {
                itemsRow.appendChild(createElementFromHTML(renderSpecNoRelated(spec)))
            }
            sectionDiv.appendChild(itemsRow)

            container.appendChild(sectionDiv)
        }
    }

    if (!hasContent) {
        const msg = createDiv()
        msg.textContent = 'No items collected yet.'
        container.appendChild(msg)
    }

    getElement('deckClose').onclick = hideDeckDialog
    showDialog('deckDialog')
    deckDialogOpen = true
}

function hideDeckDialog(): void {
    hideDialog('deckDialog')
    deckDialogOpen = false
}

export function isDeckDialogOpen(): boolean {
    return deckDialogOpen
}

// ----------------------------- MetaGameUI Implementation

export class MetaGameUI implements MetaUI {
    constructor() {
        initHotkeys()
    }

    async chooseCard<T extends CardSpec | Card>(
        state: MetaState,
        prompt: string,
        options: T[],
        canCancel: boolean = true
    ): Promise<T | null> {
        return new Promise((resolve, reject) => {
            bindUndoRedoButtons(
                state,
                () => reject(new Undo()),
                () => reject(new Redo())
            )

            showCardPicker(
                prompt,
                options,
                canCancel,
                card => resolve(card),
                () => resolve(null)
            )
        })
    }

    async chooseOption<T>(
        state: MetaState,
        prompt: string,
        options: MetaOption<T>[],
        canCancel: boolean = true
    ): Promise<T | null> {
        return new Promise((resolve, reject) => {
            bindUndoRedoButtons(
                state,
                () => reject(new Undo()),
                () => reject(new Redo())
            )

            showOptionPicker(
                prompt,
                options,
                canCancel,
                value => resolve(value),
                () => resolve(null)
            )
        })
    }

    async waitForChallenge(state: MetaState): Promise<ChallengeSpec> {
        return new Promise((resolve, reject) => {
            const escapeListener = () => finishReject(new ExitToLauncher())
            const cleanupEscapeListener = () => {
                if (keyListeners.get('Escape') === escapeListener) keyListeners.delete('Escape')
                if (keyListeners.get('Esc') === escapeListener) keyListeners.delete('Esc')
            }
            const finishResolve = (challenge: ChallengeSpec) => {
                cleanupEscapeListener()
                resolve(challenge)
            }
            const finishReject = (error: Error) => {
                cleanupEscapeListener()
                reject(error)
            }
            keyListeners.set('Escape', escapeListener)
            keyListeners.set('Esc', escapeListener)
            const render = () => {
                bindUndoRedoButtons(
                    state,
                    () => finishReject(new Undo()),
                    () => finishReject(new Redo())
                )
                renderStageScreen(
                    state,
                    // onChallenge - returns the selected challenge
                    (challenge) => {
                        state.update({ challenges: [challenge] })
                        updateProgressSidebar(state)
                        finishResolve(challenge)
                    },
                    // onOptionClick
                    async (rewardIndex, optionIndex) => {
                        const rewardState = state.data.rewardStates[rewardIndex]
                        const options = getRewardOptions(rewardState, state)
                        const option = options[optionIndex]

                        if (option.disabled) return

                        // Call the option's onClick handler
                        const { newData, transform } = await option.onClick()

                        const noOpCancel =
                            rewardState.kind === 'encounter' &&
                            transform === undefined &&
                            newData === rewardState.data
                        if (noOpCancel) {
                            render()
                            return
                        }

                        // Update the reward state
                        const newRewardState = updateRewardState(rewardState, newData)
                        updateRewardAtIndex(state, rewardIndex, newRewardState)

                        // Apply the transform (gainCard, addBuffer, etc.)
                        if (transform) await transform(state)

                        // Set checkpoint for undo
                        state.setCheckpoint()

                        // Re-render
                        render()
                    },
                    (stage) => finishReject(new ReplayStage(stage))
                )
            }
            render()
        })
    }

    async pickPath(state: MetaState, paths: Path[]): Promise<Path> {
        return new Promise((resolve, reject) => {
            const escapeListener = () => finishReject(new ExitToLauncher())
            const cleanupEscapeListener = () => {
                if (keyListeners.get('Escape') === escapeListener) keyListeners.delete('Escape')
                if (keyListeners.get('Esc') === escapeListener) keyListeners.delete('Esc')
            }
            const finishResolve = (path: Path) => {
                cleanupEscapeListener()
                resolve(path)
            }
            const finishReject = (error: Error) => {
                cleanupEscapeListener()
                reject(error)
            }
            keyListeners.set('Escape', escapeListener)
            keyListeners.set('Esc', escapeListener)
            bindUndoRedoButtons(
                state,
                () => finishReject(new Undo()),
                () => finishReject(new Redo())
            )
            renderPathSelectionScreen(
                state,
                paths,
                finishResolve,
                (stage) => finishReject(new ReplayStage(stage))
            )
        })
    }

    async showMessage(state: MetaState, message: string): Promise<void> {
        console.log(`[MetaUI]: ${message}`)
    }

    updateBuffer(state: MetaState): void {
        updateBufferDisplay(state)
    }

    playGame(
        spec: GameSpec,
        gameHistory: number[] = [],
        gameRedo: number[] = [],
        macros: unknown = null,
        viewingMacros: boolean = false,
        onProgress: ((progress: ActiveGameProgress) => void) | null = null
    ): Promise<VictoryData> {
        return startGame(spec, gameHistory, gameRedo, macros, viewingMacros, onProgress).catch(e => {
            if (e instanceof UndoPastBeginning) {
                // Pass history and redo to meta Undo for restoration on redo
                const persistence = e.macroPersistence as { macros?: unknown, viewingMacros?: boolean } | null
                throw new Undo(
                    e.history,
                    e.redo,
                    persistence?.macros ?? macros,
                    persistence?.viewingMacros ?? viewingMacros
                )
            }
            throw e
        })
    }
}

// ----------------------------- Exported Screen Functions

export function showVictoryScreen(): void {
    showScreen('victory')
}

export function showGameOverScreen(): void {
    showScreen('gameOver')
}

export function showStageScreenUI(): void {
    showScreen('stage')
}

export function showPathSelectionUI(): void {
    showScreen('path')
}

export function hideAllMetaUI(): void {
    hideElement(getElement('stageScreen'))
    hideElement(getElement('pathSelectionScreen'))
    hideElement(getElement('victoryScreen'))
    hideElement(getElement('gameOverScreen'))
}
