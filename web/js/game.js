/**
 * Critter Bonk - Core Game Orchestration Module
 * Coordinates state transitions, timer events, input listeners, and module lifecycles.
 */

import { GameState, GameStates } from './state.js';
import { Storage } from './storage.js';
import { GameTimer } from './timer.js';
import { AudioManager } from './audio.js';
import { EffectsManager } from './effects.js';
import { CritterManager } from './critters.js';
import { UIManager } from './ui.js';

export class CritterBonkGame {
  constructor() {
    this.state = new GameState();
    this.storage = Storage;
    this.timer = new GameTimer(30.0);
    this.audio = new AudioManager();
    this.effects = new EffectsManager();
    this.ui = new UIManager(this.state);
    this.critters = new CritterManager(this.state, this.audio, this.effects, this.ui);

    this.isInitialized = false;
  }

  /**
   * Initializes the application, loads stored scores, and binds UI events.
   */
  init() {
    if (this.isInitialized) return;

    // Load persisted data
    this.state.bestScore = this.storage.getBestScore();
    const soundEnabled = this.storage.getSoundEnabled();
    this.state.soundEnabled = soundEnabled;
    this.audio.setSoundEnabled(soundEnabled);

    // Initial UI synchronization
    this.ui.updateHUD();
    this.ui.updateSoundButton(soundEnabled);
    this.ui.updateTimer(30.0, 1.0);
    this.ui.showStartScreen();

    // Wire Timer Callbacks
    this.timer.onTick = (remaining, ratio) => {
      this.state.remainingTime = remaining;
      this.ui.updateTimer(remaining, ratio);
    };

    this.timer.onComplete = () => {
      this.handleGameOver();
    };

    this.bindEvents();
    this.isInitialized = true;
  }

  bindEvents() {
    // Start Game
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.audio.ensureContext();
        this.audio.playClick();
        this.startGame();
      });
    }

    // Pause Controls
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.togglePause();
      });
    }

    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.resumeGame();
      });
    }

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.restartGame();
      });
    }

    // Play Again (Game Over)
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.audio.playClick();
        this.restartGame();
      });
    }

    // Sound Toggle
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        this.toggleSound();
      });
    }

    // Grid Holes (Pointer / Click & Keyboard)
    for (let i = 0; i < 9; i++) {
      const holeEl = document.getElementById(`hole-${i}`);
      if (holeEl) {
        // Pointer down for maximum responsiveness on touch & mouse
        holeEl.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.handleHoleInteraction(i, e);
        });

        // Accessible Keyboard (Enter / Space)
        holeEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleHoleInteraction(i, e);
          }
        });
      }
    }

    // Keyboard Shortcuts (Numpad 1-9 for holes, P / Escape for pause)
    window.addEventListener('keydown', (e) => {
      // Pause shortcuts
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (this.state.isPlaying()) {
          this.pauseGame();
        } else if (this.state.isPaused()) {
          this.resumeGame();
        }
        return;
      }

      // Numpad or number keys 1-9
      const numpadMap = {
        '1': 6, '2': 7, '3': 8, // bottom row
        '4': 3, '5': 4, '6': 5, // middle row
        '7': 0, '8': 1, '9': 2, // top row
      };

      if (this.state.isPlaying() && numpadMap[e.key] !== undefined) {
        const targetHole = numpadMap[e.key];
        this.handleHoleInteraction(targetHole, e);
      }
    });
  }

  handleHoleInteraction(holeIndex, event) {
    if (!this.state.isPlaying()) return;
    this.critters.bonkHole(holeIndex, event);
  }

  /**
   * Starts a fresh game session.
   * Requirement: First critter must appear immediately!
   */
  startGame() {
    this.state.resetGame();
    this.critters.clearAllHoles();
    this.effects.clearEffects();

    if (!this.state.transitionTo(GameStates.PLAYING)) return;

    this.ui.hideStartScreen();
    this.ui.hidePauseScreen();
    this.ui.hideGameOverScreen();
    this.ui.updateHUD();
    this.ui.updateTimer(30.0, 1.0);

    // Start 30s timer
    this.timer.reset(30.0);
    this.timer.start();

    // Critical Requirement: The first critter must appear immediately!
    this.critters.scheduleSpawn(true);
  }

  pauseGame() {
    if (!this.state.isPlaying()) return;
    if (!this.state.transitionTo(GameStates.PAUSED)) return;

    this.timer.pause();
    this.critters.clearSpawnTimeout();
    this.critters.clearDespawnTimeout();
    this.ui.showPauseScreen();
  }

  resumeGame() {
    if (!this.state.isPaused()) return;
    if (!this.state.transitionTo(GameStates.PLAYING)) return;

    this.ui.hidePauseScreen();
    this.timer.resume();
    // Resume spawning
    this.critters.scheduleSpawn(false);
  }

  togglePause() {
    if (this.state.isPlaying()) {
      this.pauseGame();
    } else if (this.state.isPaused()) {
      this.resumeGame();
    }
  }

  restartGame() {
    // Cleanly stop all timers and clear game state
    this.timer.stop();
    this.critters.clearAllHoles();
    this.effects.clearEffects();

    // Reset state machine to MENU so startGame's MENU→PLAYING is always valid
    this.state.currentState = GameStates.MENU;
    this.startGame();
  }

  /**
   * Handles game completion when 30-second timer reaches 0.
   */
  handleGameOver() {
    if (!this.state.transitionTo(GameStates.GAME_OVER)) return;

    this.timer.stop();
    this.critters.clearAllHoles();

    const finalScore = this.state.score;
    const totalHits = this.state.totalHits;
    const hpm = this.state.calculateHitsPerMinute(30.0);
    const isNewHighScore = this.storage.saveBestScore(finalScore);

    if (isNewHighScore) {
      this.state.bestScore = finalScore;
    }

    const stats = {
      finalScore,
      totalHits,
      hitsPerMinute: hpm,
      bestScore: this.state.bestScore,
      isNewHighScore,
    };

    // Update HUD and show Game Over screen
    this.ui.updateHUD();
    this.ui.showGameOverScreen(stats);

    // Trigger Audio & Confetti
    if (isNewHighScore) {
      this.audio.playHighScore();
      this.effects.triggerConfetti();
    } else {
      this.audio.playGameOver();
    }
  }

  toggleSound() {
    const nextState = !this.state.soundEnabled;
    this.state.soundEnabled = nextState;
    this.audio.setSoundEnabled(nextState);
    this.storage.saveSoundEnabled(nextState);
    this.ui.updateSoundButton(nextState);
    if (nextState) {
      this.audio.ensureContext();
      this.audio.playClick();
    }
  }
}
