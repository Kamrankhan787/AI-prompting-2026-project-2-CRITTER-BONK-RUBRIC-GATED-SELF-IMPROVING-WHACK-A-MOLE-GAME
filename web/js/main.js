/**
 * Critter Bonk - Main Application Bootstrap
 * Listens for DOMContentLoaded and initializes the game orchestrator.
 */

import { CritterBonkGame } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const game = new CritterBonkGame();
  game.init();

  // Expose instance on window for automated browser testing and quality evaluation
  window.__critterBonk = game;
});
