/**
 * Critter Bonk - UI & HUD Management Module
 * Synchronizes DOM elements with game state, handles modal overlays, and updates HUD indicators.
 */

export class UIManager {
  constructor(gameState) {
    this.gameState = gameState;

    // HUD Elements
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.bestScoreDisplay = document.getElementById('bestScoreDisplay');
    this.timeDisplay = document.getElementById('timeDisplay');
    this.speedBadge = document.getElementById('speedBadge');
    this.progressBar = document.getElementById('progressBar');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.soundIcon = document.getElementById('soundIcon');
    this.soundLabel = document.getElementById('soundLabel');

    // Screens / Overlays
    this.startScreen = document.getElementById('startScreen');
    this.pauseScreen = document.getElementById('pauseScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');

    // Game Over Elements
    this.finalScoreDisplay = document.getElementById('finalScoreDisplay');
    this.totalHitsDisplay = document.getElementById('totalHitsDisplay');
    this.hpmDisplay = document.getElementById('hpmDisplay');
    this.summaryBestScoreDisplay = document.getElementById('summaryBestScoreDisplay');
    this.highScoreBadge = document.getElementById('highScoreBadge');
  }

  /**
   * Updates all HUD fields based on current state.
   */
  updateHUD() {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = this.gameState.score;
    }

    if (this.bestScoreDisplay) {
      this.bestScoreDisplay.textContent = this.gameState.bestScore;
    }

    const tier = this.gameState.getDifficultyTier();
    if (this.speedBadge) {
      this.speedBadge.textContent = tier;
      this.speedBadge.className = 'speed-badge';
      if (tier === 'FAST') {
        this.speedBadge.classList.add('fast');
      } else if (tier === 'FRENZY') {
        this.speedBadge.classList.add('frenzy');
      }
    }
  }

  /**
   * Updates the timer display and progress bar.
   * @param {number} remainingSeconds
   * @param {number} progressRatio (1.0 to 0.0)
   */
  updateTimer(remainingSeconds, progressRatio) {
    if (this.timeDisplay) {
      const displaySecs = Math.max(0, Math.ceil(remainingSeconds));
      this.timeDisplay.textContent = `${displaySecs}s`;
    }

    if (this.progressBar) {
      const pct = Math.max(0, Math.min(100, progressRatio * 100));
      this.progressBar.style.width = `${pct}%`;
    }
  }

  updateSoundButton(enabled) {
    if (this.soundIcon) {
      this.soundIcon.textContent = enabled ? '🔊' : '🔇';
    }
    if (this.soundLabel) {
      this.soundLabel.textContent = enabled ? 'Sound ON' : 'Sound OFF';
    }
  }

  showStartScreen() {
    if (this.startScreen) this.startScreen.classList.remove('hidden');
    if (this.pauseScreen) this.pauseScreen.classList.add('hidden');
    if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';
  }

  hideStartScreen() {
    if (this.startScreen) this.startScreen.classList.add('hidden');
    if (this.pauseBtn) this.pauseBtn.style.display = 'inline-flex';
  }

  showPauseScreen() {
    if (this.pauseScreen) this.pauseScreen.classList.remove('hidden');
  }

  hidePauseScreen() {
    if (this.pauseScreen) this.pauseScreen.classList.add('hidden');
  }

  /**
   * Displays the game over screen with full statistics breakdown.
   * @param {Object} stats
   */
  showGameOverScreen(stats) {
    if (this.pauseBtn) this.pauseBtn.style.display = 'none';
    if (this.gameOverScreen) this.gameOverScreen.classList.remove('hidden');

    if (this.finalScoreDisplay) this.finalScoreDisplay.textContent = stats.finalScore;
    if (this.totalHitsDisplay) this.totalHitsDisplay.textContent = stats.totalHits;
    if (this.hpmDisplay) this.hpmDisplay.textContent = stats.hitsPerMinute;
    if (this.summaryBestScoreDisplay) this.summaryBestScoreDisplay.textContent = stats.bestScore;

    if (this.highScoreBadge) {
      if (stats.isNewHighScore) {
        this.highScoreBadge.classList.remove('hidden');
      } else {
        this.highScoreBadge.classList.add('hidden');
      }
    }
  }

  hideGameOverScreen() {
    if (this.gameOverScreen) this.gameOverScreen.classList.add('hidden');
  }
}
