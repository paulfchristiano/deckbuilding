// metaUI.ts - Meta-game UI for roguelike progression
// Handles stage selection, path selection, reward pickers, deck viewing

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

// ----------------------------- Progress & Buffer Display

function updateBufferDisplay(state: MetaState): void {
    getElement('bufferDisplay').textContent = `Buffer: ${state.data.buffer}`
}

function updateProgressSidebar(state: MetaState): void {
    const circles = document.querySelectorAll('#progressLine .progressCircle, #progressLinePath .progressCircle')

    circles.forEach(circle => {
        const el = circle as HTMLElement
        const stage = parseInt(el.getAttribute('data-stage') || '0')

        el.classList.remove('completed', 'current')
        const existingScore = el.querySelector('.progressScore')
        if (existingScore) existingScore.remove()

        if (stage < state.data.stage) {
            el.classList.add('completed')
            const score = state.data.stageScores[stage]
            const par = state.data.stagePars[stage]
            if (score !== null && par !== null) {
                const scoreSpan = createSpan('progressScore')
                scoreSpan.textContent = `${score}/${par}`
                if (score > par) {
                    scoreSpan.style.color = 'red'
                } else if (score < par) {
                    scoreSpan.style.color = 'green'
                }
                el.appendChild(scoreSpan)
            }
        } else if (stage === state.data.stage) {
            el.classList.add('current')
        }
    })
}

// ----------------------------- Undo/Redo Button Binding

function bindUndoRedoButtons(state: MetaState, onUndo: () => void, onRedo: () => void): void {
    const undoButtons = document.querySelectorAll('#metaUndo, #metaUndoPath')
    const redoButtons = document.querySelectorAll('#metaRedo, #metaRedoPath')

    undoButtons.forEach(btn => {
        const el = btn as HTMLElement
        if (state.canUndo()) {
            el.removeAttribute('disabled')
            el.onclick = onUndo
        } else {
            el.setAttribute('disabled', 'disabled')
            el.onclick = null
        }
    })

    redoButtons.forEach(btn => {
        const el = btn as HTMLElement
        if (state.canRedo()) {
            el.removeAttribute('disabled')
            el.onclick = onRedo
        } else {
            el.setAttribute('disabled', 'disabled')
            el.onclick = null
        }
    })
}

// ----------------------------- Common State Rendering

function renderCommonUI(state: MetaState): void {
    updateBufferDisplay(state)
    updateProgressSidebar(state)

    // Bind deck icon
    const deckIcon = getElement('deckIcon')
    deckIcon.onclick = () => showDeckDialog(state)
}

// ----------------------------- Card Picker Dialog

function showCardPicker<T extends CardSpec | Card>(
    prompt: string,
    options: T[],
    canCancel: boolean,
    onSelect: (card: T) => void,
    onCancel: () => void
): void {
    getElement('cardPickerTitle').textContent = prompt

    const container = getElement('cardPickerOptions')
    clearElement(container)

    for (const card of options) {
        const spec: CardSpec = 'spec' in card ? (card as Card).spec : card as CardSpec
        const optionEl = createElementFromHTML(renderSpecNoRelated(spec))
        optionEl.style.cursor = 'pointer'
        optionEl.onclick = () => {
            hideDialog('cardPickerDialog')
            onSelect(card)
        }
        container.appendChild(optionEl)
    }

    const cancelBtn = getElement('cardPickerCancel')
    if (canCancel) {
        showElement(cancelBtn)
        cancelBtn.onclick = () => {
            hideDialog('cardPickerDialog')
            onCancel()
        }
    } else {
        hideElement(cancelBtn)
    }

    showDialog('cardPickerDialog')
}

// ----------------------------- Option Picker Dialog (for encounters)

function showOptionPicker<T>(
    prompt: string,
    options: MetaOption<T>[],
    canCancel: boolean,
    onSelect: (value: T) => void,
    onCancel: () => void
): void {
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
                specEl.onclick = () => {
                    hideDialog('encounterDialog')
                    onSelect(option.value)
                }
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
                nameSpan.onclick = () => {
                    hideDialog('encounterDialog')
                    onSelect(option.value)
                }
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
        cancelBtn.onclick = () => {
            hideDialog('encounterDialog')
            onCancel()
        }
    } else {
        hideElement(cancelBtn)
    }

    showDialog('encounterDialog')
}

// ----------------------------- Stage Screen

function renderStageScreen(
    state: MetaState,
    onChoice: (choice: ChallengeOrReward) => void
): void {
    showScreen('stage')
    renderCommonUI(state)

    getElement('stageTitle').textContent = `Stage ${state.data.stage}`

    // Render reward buttons
    const rewardContainer = getElement('rewardButtons')
    clearElement(rewardContainer)

    state.data.rewards.forEach((reward, index) => {
        const row = createDiv('gameRow')
        const label = reward.result ? `✓ ${reward.result}` : getRewardLabel(reward.kind)

        const button = createSpan('option')
        button.textContent = label

        if (reward.result) {
            button.setAttribute('disabled', 'disabled')
        } else {
            button.setAttribute('choosable', '')
            button.onclick = () => onChoice({ kind: 'reward', index })
        }

        row.appendChild(button)
        rewardContainer.appendChild(row)
    })

    // Render play button
    if (state.data.challenge) {
        const playBtn = getElement('playKingdom')
        playBtn.innerHTML = renderChallenge(state.data.challenge, state)
        playBtn.onclick = () => onChoice({ kind: 'challenge' })
    }
}

function getRewardLabel(kind: RewardKind): string {
    const labels: Record<RewardKind, string> = {
        card: 'Add Card',
        event: 'Add Event',
        potion: 'Add Potion',
        relic: 'Add Relic',
        encounter: '???'
    }
    return labels[kind]
}

// ----------------------------- Path Selection Screen

function renderPathSelectionScreen(
    state: MetaState,
    paths: Path[],
    onSelect: (path: Path) => void
): void {
    showScreen('path')
    renderCommonUI(state)

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

    for (const reward of path.rewards) {
        const rewardDiv = createDiv('pathReward')
        rewardDiv.textContent = getRewardLabel(reward.kind)
        rewardsContainer.appendChild(rewardDiv)
    }

    getElement(`${side}Play`).textContent = renderChallenge(path.challenge, state)
}

// ----------------------------- Deck Dialog

let deckDialogOpen = false

function showDeckDialog(state: MetaState): void {
    const container = getElement('deckContents')
    clearElement(container)

    const sections: Array<{ title: string, items: CardSpec[] }> = [
        { title: 'Cards', items: state.data.collectedCards },
        { title: 'Events', items: state.data.collectedEvents },
        { title: 'Potions', items: state.data.potions.map(p => p.spec) },
        { title: 'Relics', items: state.data.relics.map(r => r.spec) }
    ]

    let hasContent = false
    for (const section of sections) {
        if (section.items.length > 0) {
            hasContent = true
            const header = document.createElement('div')
            header.innerHTML = `<strong>${section.title}:</strong>`
            if (container.children.length > 0) {
                header.style.marginTop = '10px'
            }
            container.appendChild(header)

            for (const spec of section.items) {
                container.appendChild(createElementFromHTML(renderSpecNoRelated(spec)))
            }
        }
    }

    if (!hasContent) {
        const msg = document.createElement('div')
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

    async pickNextStep(state: MetaState): Promise<ChallengeOrReward> {
        return new Promise((resolve, reject) => {
            bindUndoRedoButtons(
                state,
                () => reject(new Undo()),
                () => reject(new Redo())
            )
            renderStageScreen(state, resolve)
        })
    }

    async pickPath(state: MetaState, paths: Path[]): Promise<Path> {
        return new Promise((resolve, reject) => {
            bindUndoRedoButtons(
                state,
                () => reject(new Undo()),
                () => reject(new Redo())
            )
            renderPathSelectionScreen(state, paths, resolve)
        })
    }

    async showMessage(state: MetaState, message: string): Promise<void> {
        console.log(`[MetaUI]: ${message}`)
    }

    playGame(spec: GameSpec): Promise<VictoryData> {
        return startGame(spec).catch(e => {
            if (e instanceof UndoPastBeginning) {
                throw new Undo()
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
