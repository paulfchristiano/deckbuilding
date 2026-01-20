// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.

import './data/index.js' // Ensure data is loaded

import { playGame } from './metaLogic.js'
import { MetaGameUI } from './metaUI.js'

// Start the game when the page loads
window.addEventListener('load', async () => {
    const metaUI = new MetaGameUI()
    await playGame(metaUI)
})