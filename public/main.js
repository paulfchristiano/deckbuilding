// main.ts - Main orchestration
// This file wires together game logic, meta logic, and UI components.
import { playGame } from './metaLogic.js';
import { MetaGameUI } from './metaUI.js';
// Start the game when the page loads
window.addEventListener('load', function () {
    var metaUI = new MetaGameUI();
    playGame(metaUI);
});
//# sourceMappingURL=main.js.map