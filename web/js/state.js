/**
 * Critter Bonk - State Management Module
 * Enforces explicit finite state machine states and centralized state tracking.
 */

export const GameStates = Object.freeze({
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
});

export const DifficultyTiers = Object.freeze({
  EASY: 'EASY',
  FAST: 'FAST',
  FRENZY: 'FRENZY',
});

export class GameState {
  constructor() {
    this.currentState = GameStates.MENU;
    this.score = 0;
    this.bestScore = 0;
    this.remainingTime = 30.0;
    this.totalDuration = 30.0;
    this.totalHits = 0;
    this.misses = 0;
    this.soundEnabled = true;

    // 9 holes: null or active critter object
    this.holes = new Array(9).fill(null);
    this.activeHoleIndex = null;
  }

  get state() {
    return this.currentState;
  }

  isMenu() {
    return this.currentState === GameStates.MENU;
  }

  isPlaying() {
    return this.currentState === GameStates.PLAYING;
  }

  isPaused() {
    return this.currentState === GameStates.PAUSED;
  }

  isGameOver() {
    return this.currentState === GameStates.GAME_OVER;
  }

  transitionTo(nextState) {
    const validTransitions = {
      [GameStates.MENU]: [GameStates.PLAYING],
      [GameStates.PLAYING]: [GameStates.PAUSED, GameStates.GAME_OVER, GameStates.PLAYING],
      [GameStates.PAUSED]: [GameStates.PLAYING, GameStates.MENU],
      [GameStates.GAME_OVER]: [GameStates.PLAYING, GameStates.MENU],
    };

    const allowed = validTransitions[this.currentState] || [];
    if (!allowed.includes(nextState)) {
      console.warn(`Illegal state transition attempted: ${this.currentState} -> ${nextState}`);
      return false;
    }

    this.currentState = nextState;
    return true;
  }

  /**
   * Evaluates difficulty tier STRICTLY by player score (never by elapsed time).
   */
  getDifficultyTier() {
    if (this.score >= 10) {
      return DifficultyTiers.FRENZY;
    }
    if (this.score >= 5) {
      return DifficultyTiers.FAST;
    }
    return DifficultyTiers.EASY;
  }

  getTierConfig() {
    const tier = this.getDifficultyTier();
    switch (tier) {
      case DifficultyTiers.FRENZY:
        return {
          tier: DifficultyTiers.FRENZY,
          visibleDurationMs: 1050,
          spawnDelayMinMs: 250,
          spawnDelayMaxMs: 450,
          badgeColor: '#ef4444',
        };
      case DifficultyTiers.FAST:
        return {
          tier: DifficultyTiers.FAST,
          visibleDurationMs: 1600,
          spawnDelayMinMs: 400,
          spawnDelayMaxMs: 650,
          badgeColor: '#f59e0b',
        };
      case DifficultyTiers.EASY:
      default:
        return {
          tier: DifficultyTiers.EASY,
          visibleDurationMs: 2500,
          spawnDelayMinMs: 600,
          spawnDelayMaxMs: 900,
          badgeColor: '#10b981',
        };
    }
  }

  calculateHitsPerMinute(elapsedSeconds) {
    const effectiveSecs = Math.max(1.0, elapsedSeconds || (this.totalDuration - this.remainingTime) || 30.0);
    const minutes = effectiveSecs / 60.0;
    return Math.round((this.totalHits / minutes) * 10) / 10;
  }

  resetGame() {
    this.score = 0;
    this.totalHits = 0;
    this.misses = 0;
    this.remainingTime = this.totalDuration;
    this.holes = new Array(9).fill(null);
    this.activeHoleIndex = null;
  }
}
