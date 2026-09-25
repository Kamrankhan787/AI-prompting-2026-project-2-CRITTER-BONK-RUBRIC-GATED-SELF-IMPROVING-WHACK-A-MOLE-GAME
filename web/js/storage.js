/**
 * Critter Bonk - Storage Module
 * Resilient localStorage manager with memory fallback and defensive parsing.
 */

const HIGH_SCORE_KEY = 'critter_bonk_best_score';
const SOUND_KEY = 'critter_bonk_sound_enabled';

class MemoryStorageFallback {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

function resolveStorage() {
  try {
    const testKey = '__cb_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    console.warn('localStorage is unavailable. Falling back to memory storage.', e);
    return new MemoryStorageFallback();
  }
}

const storage = resolveStorage();

export const Storage = {
  /**
   * Retrieves the persisted best score.
   * @returns {number}
   */
  getBestScore() {
    try {
      const raw = storage.getItem(HIGH_SCORE_KEY);
      if (raw === null || raw === undefined) return 0;
      const parsed = parseInt(raw, 10);
      return Number.isNaN(parsed) || parsed < 0 ? 0 : parsed;
    } catch (e) {
      console.warn('Error reading best score:', e);
      return 0;
    }
  },

  /**
   * Updates best score if new score exceeds it.
   * @param {number} newScore
   * @returns {boolean} True if a new high score was set.
   */
  saveBestScore(newScore) {
    try {
      const safeScore = Math.max(0, parseInt(newScore, 10) || 0);
      const currentBest = this.getBestScore();
      if (safeScore > 0 && safeScore > currentBest) {
        storage.setItem(HIGH_SCORE_KEY, String(safeScore));
        return true;
      }
      return false;
    } catch (e) {
      console.warn('Error saving best score:', e);
      return false;
    }
  },

  /**
   * Gets sound enabled preference.
   * @returns {boolean}
   */
  getSoundEnabled() {
    try {
      const raw = storage.getItem(SOUND_KEY);
      if (raw === null) return true; // Default ON
      return raw === 'true';
    } catch (e) {
      return true;
    }
  },

  /**
   * Saves sound preference.
   * @param {boolean} enabled
   */
  saveSoundEnabled(enabled) {
    try {
      storage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
    } catch (e) {
      // Ignore
    }
  },
};
