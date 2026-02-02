// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.

import './data/index.js' // Ensure data is loaded


import { playGame } from './metaLogic.js'
import { MetaGameUI } from './metaUI.js'

import { type TestSpec } from './metaLogic.js'

import { tradingPost } from './data/encounters.js'
import { potionOfReuse } from './data/potions.js'

import { cursedVillage } from './data/cards.js'
import { cursedInkwell } from './data/relics.js'
let test: TestSpec | null = ['relic', cursedInkwell]

test = null

// Start the game when the page loads
window.addEventListener('load', async () => {
    const metaUI = new MetaGameUI()
    await playGame(metaUI, test)
})