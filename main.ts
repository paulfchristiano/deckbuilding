// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.

import './data/index.js' // Ensure data is loaded


import {
    playGame,
    SerializedMetaGame,
    MetaUI,
    MetaTimelineEntry,
    deserializeMetaGame,
    replaySpecForStage,
    ExitToLauncher
} from './metaLogic.js'
import { MetaGameUI } from './metaUI.js'
import { randomString } from './rng.js'
import { startGame } from './gameUI.js'
import { renderSpecNoRelated } from './cardRendering.js'
import { Card, CardSpec, UndoPastBeginning } from './gameLogic.js'

import type { DebugTestConfig } from './metaLogic.js'
import { giftBox } from './data/relics.js'

let test: DebugTestConfig | null = {
    rewards: [
        [1, ['relic', giftBox]],
    ],
    challenges: []
}

const SAVE_STORAGE_KEY = 'roguelike.ongoingSaves.v1'
const MAX_LAUNCHER_SAVES = 10

interface SaveSlot {
    id: string
    updatedAt: number
    seed: string
    snapshot: SerializedMetaGame
}

const summaryMetaUI: MetaUI = {
    chooseCard: async <T extends CardSpec | Card>(): Promise<T | null> => null,
    playGame: async () => { throw new Error('Summary UI does not support playGame') },
    waitForChallenge: async () => { throw new Error('Summary UI does not support waitForChallenge') },
    pickPath: async () => { throw new Error('Summary UI does not support pickPath') },
    chooseOption: async <T>(): Promise<T | null> => null,
    showMessage: async () => {},
    updateBuffer: () => {}
}

function resolveSeedFromURL(): string | null {
    const params = new URLSearchParams(window.location.search)
    const urlSeed = (params.get('seed') || '').trim()
    return urlSeed.length > 0 ? urlSeed.toUpperCase() : null
}

function normalizeSeed(seed: string): string {
    return seed.replace(/\s+/g, '').toUpperCase()
}

function isDebugGame(snapshot: SerializedMetaGame): boolean {
    return snapshot.debugEnabled === true
}

function loadSaveSlots(): SaveSlot[] {
    try {
        const raw = localStorage.getItem(SAVE_STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw) as SaveSlot[]
        if (!Array.isArray(parsed)) return []
        return parsed
            .filter(slot => slot && slot.id && slot.snapshot && slot.seed)
            .sort((a, b) => b.updatedAt - a.updatedAt)
    } catch {
        return []
    }
}

function persistSaveSlots(slots: SaveSlot[]): void {
    const sorted = slots
        .sort((a, b) => b.updatedAt - a.updatedAt)
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(sorted))
}

function upsertSaveSlot(id: string, snapshot: SerializedMetaGame): void {
    const slots = loadSaveSlots()
    const updated: SaveSlot = {
        id,
        updatedAt: Date.now(),
        seed: snapshot.seed,
        snapshot
    }
    const index = slots.findIndex(slot => slot.id === id)
    if (index >= 0) {
        slots[index] = updated
    } else {
        slots.unshift(updated)
    }
    persistSaveSlots(slots)
}

function removeSaveSlot(id: string): void {
    const slots = loadSaveSlots().filter(slot => slot.id !== id)
    persistSaveSlots(slots)
}

function removeAllSaveSlots(): void {
    persistSaveSlots([])
}

function setCoreUIVisible(visible: boolean): void {
    const hidden = !visible
    const ids = [
        'stageScreen',
        'pathSelectionScreen',
        'gameContainer',
        'victoryScreen',
        'gameOverScreen',
        'bufferDisplay',
        'deckIcon',
        'seedDisplay'
    ]
    for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (hidden) {
            el.setAttribute('hidden', '')
        } else {
            el.removeAttribute('hidden')
        }
    }
}

function ensureLauncherStyles(): void {
    if (document.getElementById('saveLauncherStyles')) return
    const style = document.createElement('style')
    style.id = 'saveLauncherStyles'
    style.textContent = `
        #saveLauncher {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f6f6f8;
            color: #222;
            font-family: system-ui, -apple-system, sans-serif;
        }
        #saveLauncherCard {
            width: min(760px, 92vw);
            background: white;
            border: 1px solid #ddd;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }
        #saveLauncherHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
        }
        #saveList {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 14px;
        }
        .saveRow {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 10px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            background: #fcfcfd;
        }
        .saveMeta {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .saveSeed {
            font-size: 0.8em;
            color: #777;
        }
        .saveActions {
            display: flex;
            gap: 8px;
        }
        .launcherBtn {
            border: 1px solid #bbb;
            border-radius: 6px;
            padding: 6px 10px;
            background: #fff;
            cursor: pointer;
        }
        .launcherBtn:hover {
            border-color: #777;
        }
        .dangerBtn {
            border-color: #d33;
            color: #b11;
        }
        #newGameDialog {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.25);
        }
        #allSavesDialog {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.25);
            z-index: 45;
        }
        #allSavesCard {
            width: min(900px, 95vw);
            max-height: 90vh;
            overflow: hidden;
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        #allSavesList {
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding-right: 4px;
        }
        #newGameCard {
            background: white;
            border-radius: 10px;
            border: 1px solid #ddd;
            padding: 16px 28px 16px 16px;
            width: auto;
            max-width: 92vw;
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #newGameCard label {
            font-size: 0.9em;
            color: #555;
        }
        #newGameSeedInput {
            display: block;
            font-size: 1.1em;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            width: 260px;
            max-width: 100%;
            box-sizing: border-box;
            align-self: flex-start;
        }
        #emptySaves {
            font-size: 0.95em;
            color: #666;
            padding: 8px 2px;
        }
        .saveFootnote {
            margin-top: 10px;
            font-size: 0.85em;
            color: #777;
        }
        .negativeBuffer {
            color: #b00020;
            font-weight: 700;
        }
        #viewGameDialog {
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            z-index: 50;
            padding: 20px 0;
        }
        #viewGameCard {
            width: min(1100px, 96vw);
            max-height: calc(100vh - 40px);
            overflow-y: auto;
            background: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .viewHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
        .viewDeckSection {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
            background: #fcfcfd;
        }
        .viewDeckTitle {
            font-weight: 600;
            margin-bottom: 6px;
            color: #333;
        }
        .viewDeckCards {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        #viewTimeline {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
            background: #fcfcfd;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .timelineRow {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #eee;
            padding: 4px 0;
        }
        .timelineText {
            display: flex;
            align-items: baseline;
            gap: 8px;
            flex-wrap: wrap;
        }
        .timelinePrimary {
            font-size: 0.95em;
            color: #333;
        }
        .timelineSecondary {
            font-size: 0.82em;
            color: #777;
        }
    `
    document.head.appendChild(style)
}

async function runGame(
    slotID: string,
    snapshot: SerializedMetaGame | null,
    seed: string,
    newGameDebugEnabled: boolean = false
): Promise<void> {
    const debugEnabled = snapshot ? isDebugGame(snapshot) : newGameDebugEnabled
    const activeTest: DebugTestConfig | null = debugEnabled ? test : null
    const seedDisplay = document.getElementById('seedDisplay')
    if (seedDisplay) seedDisplay.textContent = `Seed: ${seed}`
    setCoreUIVisible(true)
    document.getElementById('saveLauncher')?.remove()
    clearLauncherDialogs()

    const metaUI = new MetaGameUI()
    const saveCallback = (nextSnapshot: SerializedMetaGame) => {
        upsertSaveSlot(slotID, nextSnapshot)
    }

    try {
        await playGame(metaUI, activeTest, seed, snapshot, saveCallback, debugEnabled)
    } catch (error) {
        if (error instanceof ExitToLauncher) return
        console.error(error)
        alert('Failed to load or run this game. You can abandon it from the launcher.')
    } finally {
        renderLauncher()
    }
}

function clearLauncherDialogs(): void {
    document.getElementById('newGameDialog')?.remove()
    document.getElementById('viewGameDialog')?.remove()
    document.getElementById('allSavesDialog')?.remove()
}

async function runReplayFromSnapshot(slot: SaveSlot, stage: number): Promise<void> {
    const seedDisplay = document.getElementById('seedDisplay')
    if (seedDisplay) seedDisplay.textContent = `Seed: ${slot.seed}`
    setCoreUIVisible(true)
    document.getElementById('saveLauncher')?.remove()
    clearLauncherDialogs()
    try {
        const state = deserializeMetaGame(summaryMetaUI, slot.snapshot, null)
        const replayData = state.data.stageReplays[stage]
        if (!replayData) {
            alert('No replay available for that stage.')
            return
        }
        const bufferDisplay = document.getElementById('bufferDisplay')
        if (bufferDisplay) {
            const debugTag = state.debugEnabled ? ' [Debug]' : ''
            bufferDisplay.textContent = `Buffer: ${replayData.bufferBeforeCourse}${debugTag}`
        }
        await startGame(
            replaySpecForStage(state, replayData),
            replayData.history,
            [],
            state.global.macros,
            state.global.viewingMacros,
            null,
            'nothing'
        )
    } catch (error) {
        if (!(error instanceof UndoPastBeginning)) {
            console.error(error)
            alert('Failed to open replay.')
        }
    } finally {
        renderLauncher()
        openViewDialog(slot)
    }
}

function timelineRowContent(
    entry: MetaTimelineEntry,
    stageScores: (number | null)[],
    stagePars: (number | null)[]
): { primary: string, secondary: string | null } {
    if (entry.kind === 'stage') {
        const score = stageScores[entry.stage] ?? entry.score
        const par = stagePars[entry.stage] ?? entry.par
        const usedText = (entry.usedPotions && entry.usedPotions.length > 0)
            ? entry.usedPotions.map(name => `used ${name}`).join(', ')
            : null
        return {
            primary: `Stage ${entry.stage + 1}: ${entry.challenge} • Score ${score}/${par}`,
            secondary: usedText
        }
    }
    if (entry.kind === 'action') {
        return {
            primary: `Stage ${entry.stage + 1}: ${entry.action}`,
            secondary: entry.details ?? null
        }
    }
    const secondaryParts: string[] = []
    if (entry.details) secondaryParts.push(entry.details)
    if (entry.skipped && entry.skipped.length > 0) {
        secondaryParts.push(`Skipped: ${entry.skipped.join(', ')}`)
    }
    return {
        primary: `Stage ${entry.stage + 1}: Added ${entry.name}`,
        secondary: secondaryParts.length > 0 ? secondaryParts.join(' • ') : null
    }
}

function renderDeckSection(title: string, specs: CardSpec[]): HTMLElement {
    const section = document.createElement('div')
    section.className = 'viewDeckSection'
    const heading = document.createElement('div')
    heading.className = 'viewDeckTitle'
    heading.textContent = title
    section.appendChild(heading)
    const cards = document.createElement('div')
    cards.className = 'viewDeckCards'
    if (specs.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'saveSeed'
        empty.textContent = 'None'
        cards.appendChild(empty)
    } else {
        for (const spec of specs) {
            const wrap = document.createElement('div')
            wrap.innerHTML = renderSpecNoRelated(spec)
            cards.appendChild(wrap.firstElementChild as HTMLElement)
        }
    }
    section.appendChild(cards)
    return section
}

function openViewDialog(slot: SaveSlot): void {
    clearLauncherDialogs()
    let state
    try {
        state = deserializeMetaGame(summaryMetaUI, slot.snapshot, null)
    } catch (error) {
        console.error(error)
        alert('Failed to load summary for this game.')
        return
    }

    const dialog = document.createElement('div')
    dialog.id = 'viewGameDialog'
    const card = document.createElement('div')
    card.id = 'viewGameCard'

    const header = document.createElement('div')
    header.className = 'viewHeader'
    const title = document.createElement('h3')
    title.style.margin = '0'
    title.textContent = `Game Summary`
    const close = document.createElement('button')
    close.className = 'launcherBtn'
    close.textContent = 'Close'
    close.onclick = () => dialog.remove()
    header.appendChild(title)
    header.appendChild(close)
    card.appendChild(header)

    const status = document.createElement('div')
    const done = state.data.phase === 'game_over' || state.data.stage >= 8
    const statusDebugTag = state.debugEnabled ? ' [Debug]' : ''
    status.textContent = `${done ? 'Victory!' : `Stage ${state.data.stage + 1}`} • Buffer ${state.data.buffer}${statusDebugTag} • Seed ${slot.seed}`
    if (state.data.buffer < 0) status.className = 'negativeBuffer'
    card.appendChild(status)
    const relicDisplaySpecs = state.data.relics.map(relic => relic.spec)

    card.appendChild(renderDeckSection('Cards', state.data.collectedCards))
    card.appendChild(renderDeckSection('Events', state.data.collectedEvents))
    card.appendChild(renderDeckSection('Potions', state.data.potions.map(p => p.spec)))
    card.appendChild(renderDeckSection('Relics', relicDisplaySpecs))

    const timelineTitle = document.createElement('div')
    timelineTitle.className = 'viewDeckTitle'
    timelineTitle.textContent = 'Timeline'
    card.appendChild(timelineTitle)

    const timeline = document.createElement('div')
    timeline.id = 'viewTimeline'
    if (state.data.timeline.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'saveSeed'
        empty.textContent = 'No events recorded yet.'
        timeline.appendChild(empty)
    } else {
        for (const entry of state.data.timeline) {
            const row = document.createElement('div')
            row.className = 'timelineRow'
            const text = document.createElement('div')
            text.className = 'timelineText'
            const content = timelineRowContent(entry, state.data.stageScores, state.data.stagePars)
            const primary = document.createElement('span')
            primary.className = 'timelinePrimary'
            primary.textContent = content.primary
            text.appendChild(primary)
            if (content.secondary) {
                const secondary = document.createElement('span')
                secondary.className = 'timelineSecondary'
                secondary.textContent = content.secondary
                text.appendChild(secondary)
            }
            row.appendChild(text)
            if (entry.kind === 'stage' && state.data.stageReplays[entry.stage] !== null) {
                const replayButton = document.createElement('button')
                replayButton.className = 'launcherBtn'
                replayButton.textContent = 'View replay'
                replayButton.onclick = async () => {
                    dialog.remove()
                    await runReplayFromSnapshot(slot, entry.stage)
                }
                row.appendChild(replayButton)
            }
            timeline.appendChild(row)
        }
    }
    card.appendChild(timeline)

    dialog.appendChild(card)
    dialog.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.target === dialog) dialog.remove()
    })
    document.body.appendChild(dialog)
}

function createSaveRow(slot: SaveSlot, onAbandon: () => void): HTMLElement {
    const row = document.createElement('div')
    row.className = 'saveRow'

    const meta = document.createElement('div')
    meta.className = 'saveMeta'
    const primary = document.createElement('div')
    const done = slot.snapshot.data.phase === 'game_over' || slot.snapshot.data.stage >= 8
    const debugTag = isDebugGame(slot.snapshot) ? ' [Debug]' : ''
    primary.textContent = done
        ? `Victory! • Buffer ${slot.snapshot.data.buffer}${debugTag}`
        : `Stage ${slot.snapshot.data.stage + 1} • Buffer ${slot.snapshot.data.buffer}${debugTag}`
    if (slot.snapshot.data.buffer < 0) {
        primary.className = 'negativeBuffer'
    }
    const seedLine = document.createElement('div')
    seedLine.className = 'saveSeed'
    seedLine.textContent = `Seed: ${slot.seed}`
    meta.appendChild(primary)
    meta.appendChild(seedLine)

    const actions = document.createElement('div')
    actions.className = 'saveActions'
    if (!done) {
        const continueButton = document.createElement('button')
        continueButton.className = 'launcherBtn'
        continueButton.textContent = 'Continue'
        continueButton.onclick = async () => runGame(slot.id, slot.snapshot, slot.seed)
        actions.appendChild(continueButton)
    }
    const viewButton = document.createElement('button')
    viewButton.className = 'launcherBtn'
    viewButton.textContent = 'View'
    viewButton.onclick = () => openViewDialog(slot)
    const abandonButton = document.createElement('button')
    abandonButton.className = 'launcherBtn dangerBtn'
    abandonButton.textContent = 'Abandon'
    abandonButton.onclick = onAbandon
    actions.appendChild(viewButton)
    actions.appendChild(abandonButton)

    row.appendChild(meta)
    row.appendChild(actions)
    return row
}

function openAllSavesDialog(): void {
    clearLauncherDialogs()
    const slots = loadSaveSlots()

    const dialog = document.createElement('div')
    dialog.id = 'allSavesDialog'
    const card = document.createElement('div')
    card.id = 'allSavesCard'

    const header = document.createElement('div')
    header.className = 'viewHeader'
    const title = document.createElement('h3')
    title.style.margin = '0'
    title.textContent = `All Saved Games (${slots.length})`
    const headerActions = document.createElement('div')
    headerActions.className = 'saveActions'
    const deleteAll = document.createElement('button')
    deleteAll.className = 'launcherBtn dangerBtn'
    deleteAll.textContent = 'Delete all games'
    deleteAll.onclick = () => {
        if (!window.confirm('Really delete all of your games?')) return
        removeAllSaveSlots()
        dialog.remove()
        renderLauncher()
    }
    const close = document.createElement('button')
    close.className = 'launcherBtn'
    close.textContent = 'Close'
    close.onclick = () => dialog.remove()
    headerActions.appendChild(deleteAll)
    headerActions.appendChild(close)
    header.appendChild(title)
    header.appendChild(headerActions)
    card.appendChild(header)

    const list = document.createElement('div')
    list.id = 'allSavesList'
    if (slots.length === 0) {
        const empty = document.createElement('div')
        empty.className = 'saveSeed'
        empty.textContent = 'No saved games.'
        list.appendChild(empty)
    } else {
        for (const slot of slots) {
            list.appendChild(createSaveRow(slot, () => {
                removeSaveSlot(slot.id)
                dialog.remove()
                renderLauncher()
                openAllSavesDialog()
            }))
        }
    }

    card.appendChild(list)
    dialog.appendChild(card)
    dialog.addEventListener('mousedown', (e: MouseEvent) => {
        if (e.target === dialog) dialog.remove()
    })
    document.body.appendChild(dialog)
}

function renderLauncher(): void {
    ensureLauncherStyles()
    setCoreUIVisible(false)
    document.getElementById('saveLauncher')?.remove()
    clearLauncherDialogs()

    const root = document.createElement('div')
    root.id = 'saveLauncher'

    const card = document.createElement('div')
    card.id = 'saveLauncherCard'

    const header = document.createElement('div')
    header.id = 'saveLauncherHeader'
    const title = document.createElement('h2')
    title.textContent = 'engine-roguelike'
    title.style.margin = '0'
    const headerActions = document.createElement('div')
    headerActions.className = 'saveActions'
    const newButton = document.createElement('button')
    newButton.className = 'launcherBtn'
    newButton.textContent = 'new game'
    newButton.onclick = (event: MouseEvent) => {
        const debugNewGame = event.shiftKey
        clearLauncherDialogs()
        const dialog = document.createElement('div')
        dialog.id = 'newGameDialog'
        const dialogCard = document.createElement('div')
        dialogCard.id = 'newGameCard'

        const label = document.createElement('label')
        label.htmlFor = 'newGameSeedInput'
        label.textContent = 'Seed:'

        const seedInput = document.createElement('input')
        seedInput.id = 'newGameSeedInput'
        seedInput.value = normalizeSeed(resolveSeedFromURL() || randomString())
        seedInput.autocomplete = 'off'
        seedInput.addEventListener('input', () => {
            const normalized = normalizeSeed(seedInput.value)
            if (seedInput.value !== normalized) {
                seedInput.value = normalized
            }
        })

        const actions = document.createElement('div')
        actions.className = 'saveActions'

        const startButton = document.createElement('button')
        startButton.className = 'launcherBtn'
        startButton.textContent = 'start'
        const startNewGame = async () => {
            const seed = normalizeSeed(seedInput.value) || randomString()
            const slotID = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
            await runGame(slotID, null, seed, debugNewGame)
        }
        startButton.onclick = startNewGame
        seedInput.addEventListener('keydown', async (event: KeyboardEvent) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            await startNewGame()
        })

        const cancelButton = document.createElement('button')
        cancelButton.className = 'launcherBtn'
        cancelButton.textContent = 'Cancel'
        cancelButton.onclick = () => dialog.remove()

        actions.appendChild(startButton)
        actions.appendChild(cancelButton)
        dialogCard.appendChild(label)
        dialogCard.appendChild(seedInput)
        dialogCard.appendChild(actions)
        dialog.appendChild(dialogCard)
        dialog.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target === dialog) dialog.remove()
        })
        document.body.appendChild(dialog)
        seedInput.focus()
        seedInput.select()
    }
    headerActions.appendChild(newButton)
    header.appendChild(title)
    header.appendChild(headerActions)
    card.appendChild(header)

    const list = document.createElement('div')
    list.id = 'saveList'

    const allSlots = loadSaveSlots()
    const slots = allSlots.slice(0, MAX_LAUNCHER_SAVES)
    if (slots.length === 0) {
        const empty = document.createElement('div')
        empty.id = 'emptySaves'
        empty.textContent = 'No saved games.'
        list.appendChild(empty)
    } else {
        for (const slot of slots) {
            list.appendChild(createSaveRow(slot, () => {
                removeSaveSlot(slot.id)
                renderLauncher()
            }))
        }
    }

    card.appendChild(list)
    if (allSlots.length > MAX_LAUNCHER_SAVES) {
        const footnote = document.createElement('div')
        footnote.className = 'saveFootnote'
        footnote.textContent = `Showing latest ${MAX_LAUNCHER_SAVES} of ${allSlots.length} saved games.`
        card.appendChild(footnote)

        const footerActions = document.createElement('div')
        footerActions.className = 'saveActions'
        const showAllButton = document.createElement('button')
        showAllButton.className = 'launcherBtn'
        showAllButton.textContent = 'Show all'
        showAllButton.onclick = () => openAllSavesDialog()
        footerActions.appendChild(showAllButton)
        card.appendChild(footerActions)
    }
    root.appendChild(card)
    document.body.appendChild(root)
}

// Start the game when the page loads
window.addEventListener('load', async () => {
    renderLauncher()
})
