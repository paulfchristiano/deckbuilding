// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.

import './data/index.js' // Ensure data is loaded


import { playGame, SerializedMetaGame } from './metaLogic.js'
import { MetaGameUI } from './metaUI.js'
import { randomString } from './rng.js'

import type { TestSpec } from './metaLogic.js'

let test: TestSpec | null = null

const SAVE_STORAGE_KEY = 'roguelike.ongoingSaves.v1'
const MAX_ONGOING_SAVES = 5

interface SaveSlot {
    id: string
    updatedAt: number
    seed: string
    snapshot: SerializedMetaGame
}

function resolveSeedFromURL(): string | null {
    const params = new URLSearchParams(window.location.search)
    const urlSeed = (params.get('seed') || '').trim()
    return urlSeed.length > 0 ? urlSeed.toUpperCase() : null
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
            .slice(0, MAX_ONGOING_SAVES)
    } catch {
        return []
    }
}

function persistSaveSlots(slots: SaveSlot[]): void {
    const trimmed = slots
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, MAX_ONGOING_SAVES)
    localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(trimmed))
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
        #newGameCard {
            background: white;
            border-radius: 10px;
            border: 1px solid #ddd;
            padding: 16px;
            width: min(400px, 90vw);
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
            width: 100%;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
        }
        #emptySaves {
            font-size: 0.95em;
            color: #666;
            padding: 8px 2px;
        }
    `
    document.head.appendChild(style)
}

async function runGame(slotID: string, snapshot: SerializedMetaGame | null, seed: string): Promise<void> {
    const seedDisplay = document.getElementById('seedDisplay')
    if (seedDisplay) seedDisplay.textContent = `Seed: ${seed}`
    setCoreUIVisible(true)
    document.getElementById('saveLauncher')?.remove()
    document.getElementById('newGameDialog')?.remove()

    const metaUI = new MetaGameUI()
    const saveCallback = (nextSnapshot: SerializedMetaGame) => {
        upsertSaveSlot(slotID, nextSnapshot)
    }

    try {
        await playGame(metaUI, test, seed, snapshot, saveCallback)
        removeSaveSlot(slotID)
    } catch (error) {
        console.error(error)
        alert('Failed to load or run this game. You can abandon it from the launcher.')
    } finally {
        renderLauncher()
    }
}

function renderLauncher(): void {
    ensureLauncherStyles()
    setCoreUIVisible(false)
    document.getElementById('saveLauncher')?.remove()
    document.getElementById('newGameDialog')?.remove()

    const root = document.createElement('div')
    root.id = 'saveLauncher'

    const card = document.createElement('div')
    card.id = 'saveLauncherCard'

    const header = document.createElement('div')
    header.id = 'saveLauncherHeader'
    const title = document.createElement('h2')
    title.textContent = 'Roguelike Deckbuilder'
    title.style.margin = '0'
    const newButton = document.createElement('button')
    newButton.className = 'launcherBtn'
    newButton.textContent = 'new game'
    newButton.onclick = () => {
        document.getElementById('newGameDialog')?.remove()
        const dialog = document.createElement('div')
        dialog.id = 'newGameDialog'
        const dialogCard = document.createElement('div')
        dialogCard.id = 'newGameCard'

        const label = document.createElement('label')
        label.htmlFor = 'newGameSeedInput'
        label.textContent = 'Seed:'

        const seedInput = document.createElement('input')
        seedInput.id = 'newGameSeedInput'
        seedInput.value = resolveSeedFromURL() || randomString()
        seedInput.autocomplete = 'off'

        const actions = document.createElement('div')
        actions.className = 'saveActions'

        const startButton = document.createElement('button')
        startButton.className = 'launcherBtn'
        startButton.textContent = 'start'
        startButton.onclick = async () => {
            const seed = seedInput.value.trim().toUpperCase() || randomString()
            const slotID = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
            await runGame(slotID, null, seed)
        }

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
    header.appendChild(title)
    header.appendChild(newButton)
    card.appendChild(header)

    const list = document.createElement('div')
    list.id = 'saveList'

    const slots = loadSaveSlots().slice(0, MAX_ONGOING_SAVES)
    if (slots.length === 0) {
        const empty = document.createElement('div')
        empty.id = 'emptySaves'
        empty.textContent = 'No ongoing games.'
        list.appendChild(empty)
    } else {
        for (const slot of slots) {
            const row = document.createElement('div')
            row.className = 'saveRow'

            const meta = document.createElement('div')
            meta.className = 'saveMeta'
            const primary = document.createElement('div')
            primary.textContent = `Stage ${slot.snapshot.data.stage + 1} • Buffer ${slot.snapshot.data.buffer}`
            const seedLine = document.createElement('div')
            seedLine.className = 'saveSeed'
            seedLine.textContent = `Seed: ${slot.seed}`
            meta.appendChild(primary)
            meta.appendChild(seedLine)

            const actions = document.createElement('div')
            actions.className = 'saveActions'
            const continueButton = document.createElement('button')
            continueButton.className = 'launcherBtn'
            continueButton.textContent = 'Continue'
            continueButton.onclick = async () => runGame(slot.id, slot.snapshot, slot.seed)
            const abandonButton = document.createElement('button')
            abandonButton.className = 'launcherBtn dangerBtn'
            abandonButton.textContent = 'Abandon'
            abandonButton.onclick = () => {
                removeSaveSlot(slot.id)
                renderLauncher()
            }
            actions.appendChild(continueButton)
            actions.appendChild(abandonButton)

            row.appendChild(meta)
            row.appendChild(actions)
            list.appendChild(row)
        }
    }

    card.appendChild(list)
    root.appendChild(card)
    document.body.appendChild(root)
}

// Start the game when the page loads
window.addEventListener('load', async () => {
    renderLauncher()
})
