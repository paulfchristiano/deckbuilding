// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.

import * as index from './data/index.js' // Ensure data is loaded

import { playGame } from './metaLogic.js'
import { MetaGameUI } from './metaUI.js'

// Start the game when the page loads
window.addEventListener('load', () => {
    const metaUI = new MetaGameUI()
    playGame(metaUI)
})