/**
 * Critter Bonk - Critter Management Module
 * Handles critter spawning, hole emergence physics, hit idempotency, and despawn scheduling.
 */

export const CRITTER_TYPES = Object.freeze([
  { id: 'hamster', name: 'Hamster', emoji: '🐹' },
  { id: 'bear', name: 'Bear', emoji: '🐻' },
  { id: 'frog', name: 'Frog', emoji: '🐸' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵' },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
  { id: 'fox', name: 'Fox', emoji: '🦊' },
]);

export class CritterManager {
  constructor(gameState, audioManager, effectsManager, uiManager) {
    this.gameState = gameState;
    this.audio = audioManager;
    this.effects = effectsManager;
    this.ui = uiManager;

    this.spawnTimeoutId = null;
    this.despawnTimeoutId = null;
    this.despawnAfterHitTimeoutId = null;

    this.lastCritterId = null;
    this.lastHoleIndex = null;
  }

  /**
   * Spawns a critter immediately or schedules next spawn based on current tier.
   * @param {boolean} immediate If true, spawns with 0ms delay.
   */
  scheduleSpawn(immediate = false) {
    this.clearSpawnTimeout();

    if (!this.gameState.isPlaying()) {
      return;
    }

    if (immediate) {
      this.spawn();
      return;
    }

    const tierCfg = this.gameState.getTierConfig();
    const delay = Math.floor(
      Math.random() * (tierCfg.spawnDelayMaxMs - tierCfg.spawnDelayMinMs) + tierCfg.spawnDelayMinMs
    );

    this.spawnTimeoutId = window.setTimeout(() => {
      this.spawn();
    }, delay);
  }

  /**
   * Selects hole and critter, triggering emergence animation.
   */
  spawn() {
    if (!this.gameState.isPlaying()) return;

    // Despawn currently active critter if any
    if (this.gameState.activeHoleIndex !== null) {
      this.despawnCurrent(false);
    }

    // Pick hole (different from last hole if possible)
    let holeIndex;
    const totalHoles = 9;
    do {
      holeIndex = Math.floor(Math.random() * totalHoles);
    } while (holeIndex === this.lastHoleIndex && Math.random() > 0.15);
    this.lastHoleIndex = holeIndex;

    // Pick critter type
    let critter;
    const pool = CRITTER_TYPES.filter((c) => c.id !== this.lastCritterId);
    critter = pool[Math.floor(Math.random() * pool.length)] || CRITTER_TYPES[0];
    this.lastCritterId = critter.id;

    const tierCfg = this.gameState.getTierConfig();

    const activeSlot = {
      holeIndex,
      critter,
      hasBeenHit: false,
      spawnedAt: performance.now(),
      visibleDurationMs: tierCfg.visibleDurationMs,
    };

    this.gameState.holes[holeIndex] = activeSlot;
    this.gameState.activeHoleIndex = holeIndex;

    // Update DOM: inject emoji and trigger emergence class
    const holeEl = document.getElementById(`hole-${holeIndex}`);
    const critterEl = document.getElementById(`critter-${holeIndex}`);

    if (holeEl && critterEl) {
      critterEl.textContent = critter.emoji;
      critterEl.classList.remove('bonked-anim');
      holeEl.classList.remove('bonked');
      holeEl.classList.add('active');
    }

    // Schedule natural despawn if player misses
    this.clearDespawnTimeout();
    this.despawnTimeoutId = window.setTimeout(() => {
      this.despawnCurrent(false);
    }, tierCfg.visibleDurationMs);
  }

  /**
   * Handles player bonking a hole.
   * @param {number} holeIndex
   * @param {PointerEvent|MouseEvent|KeyboardEvent} event
   * @returns {boolean} True if hit successfully.
   */
  bonkHole(holeIndex, event = null) {
    if (!this.gameState.isPlaying()) return false;

    const slot = this.gameState.holes[holeIndex];
    const holeEl = document.getElementById(`hole-${holeIndex}`);
    const critterEl = document.getElementById(`critter-${holeIndex}`);

    // If hole is empty or already bonked, register miss or ignore
    if (!slot || slot.hasBeenHit) {
      this.audio.playMiss();
      return false;
    }

    // Critical Requirement: Mark immediately to prevent double scoring
    slot.hasBeenHit = true;
    this.gameState.score += 1;
    this.gameState.totalHits += 1;

    // Clear automatic despawn timer
    this.clearDespawnTimeout();

    // Trigger visual hit reaction
    if (holeEl && critterEl) {
      holeEl.classList.remove('active');
      holeEl.classList.add('bonked');
      critterEl.classList.add('bonked-anim');
    }

    // Compute coordinate for particle burst and floating +1
    let hitX = 0;
    let hitY = 0;
    if (holeEl) {
      const rect = holeEl.getBoundingClientRect();
      const parentRect = holeEl.parentElement.getBoundingClientRect();
      hitX = rect.left - parentRect.left + rect.width / 2;
      hitY = rect.top - parentRect.top + rect.height / 2;
    }

    const isFrenzy = this.gameState.getDifficultyTier() === 'FRENZY';

    // 1. Audio
    if (isFrenzy) {
      this.audio.playFrenzyBonk();
    } else {
      this.audio.playBonk();
    }

    // 2. Particle Burst
    this.effects.triggerParticleBurst(hitX, hitY, isFrenzy);

    // 3. Floating +1
    this.effects.triggerFloatingScore(hitX, hitY);

    // 4. Subtle Screen Shake
    this.effects.triggerScreenShake();

    // 5. Update HUD immediately (score, speed badge, animations)
    this.ui.updateHUD();

    // Schedule cleanup of this hole and queue next spawn
    if (this.despawnAfterHitTimeoutId !== null) {
      window.clearTimeout(this.despawnAfterHitTimeoutId);
    }
    this.despawnAfterHitTimeoutId = window.setTimeout(() => {
      this.despawnAfterHitTimeoutId = null;
      this.despawnCurrent(true);
    }, 220);

    return true;
  }

  /**
   * Despawns active critter.
   * @param {boolean} wasHit
   */
  despawnCurrent(wasHit = false) {
    this.clearDespawnTimeout();
    if (this.despawnAfterHitTimeoutId !== null) {
      window.clearTimeout(this.despawnAfterHitTimeoutId);
      this.despawnAfterHitTimeoutId = null;
    }

    const holeIndex = this.gameState.activeHoleIndex;
    if (holeIndex !== null) {
      const holeEl = document.getElementById(`hole-${holeIndex}`);
      const critterEl = document.getElementById(`critter-${holeIndex}`);

      if (holeEl && critterEl) {
        holeEl.classList.remove('active');
        holeEl.classList.remove('bonked');
        critterEl.classList.remove('bonked-anim');
      }

      if (!wasHit && this.gameState.holes[holeIndex] && !this.gameState.holes[holeIndex].hasBeenHit) {
        this.gameState.misses += 1;
      }

      this.gameState.holes[holeIndex] = null;
      this.gameState.activeHoleIndex = null;
    }

    // Chain to next spawn if still playing
    if (this.gameState.isPlaying()) {
      this.scheduleSpawn(false);
    }
  }

  clearAllHoles() {
    this.clearSpawnTimeout();
    this.clearDespawnTimeout();
    if (this.despawnAfterHitTimeoutId !== null) {
      window.clearTimeout(this.despawnAfterHitTimeoutId);
      this.despawnAfterHitTimeoutId = null;
    }

    for (let i = 0; i < 9; i++) {
      const holeEl = document.getElementById(`hole-${i}`);
      const critterEl = document.getElementById(`critter-${i}`);
      if (holeEl && critterEl) {
        holeEl.classList.remove('active');
        holeEl.classList.remove('bonked');
        critterEl.classList.remove('bonked-anim');
        critterEl.textContent = '';
      }
    }

    this.gameState.holes = new Array(9).fill(null);
    this.gameState.activeHoleIndex = null;
  }

  clearSpawnTimeout() {
    if (this.spawnTimeoutId !== null) {
      window.clearTimeout(this.spawnTimeoutId);
      this.spawnTimeoutId = null;
    }
  }

  clearDespawnTimeout() {
    if (this.despawnTimeoutId !== null) {
      window.clearTimeout(this.despawnTimeoutId);
      this.despawnTimeoutId = null;
    }
  }
}
