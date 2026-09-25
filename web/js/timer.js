/**
 * Critter Bonk - Timer Engineering Module
 * Drift-compensated countdown clock with strict interval safety, pause/resume, and zero leak guarantees.
 */

export class GameTimer {
  constructor(durationSeconds = 30.0) {
    this.totalDuration = durationSeconds;
    this.remainingTime = durationSeconds;
    this.isRunning = false;

    this.timerId = null;
    this.lastTickTime = null;

    this.onTick = null;       // callback(remainingTime, progressRatio)
    this.onComplete = null;   // callback()
  }

  /**
   * Starts or resumes the countdown timer.
   */
  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastTickTime = performance.now();

    // Use a precise 50ms interval for ultra-smooth UI progress updates
    this.clearTimerLoop();
    this.timerId = window.setInterval(() => {
      this.tick();
    }, 50);

    // Initial immediate tick
    this.tick();
  }

  /**
   * Evaluates delta time with drift compensation.
   */
  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaMs = now - (this.lastTickTime || now);
    this.lastTickTime = now;

    this.remainingTime = Math.max(0.0, this.remainingTime - deltaMs / 1000.0);
    const progressRatio = Math.max(0.0, Math.min(1.0, this.remainingTime / this.totalDuration));

    if (typeof this.onTick === 'function') {
      this.onTick(this.remainingTime, progressRatio);
    }

    if (this.remainingTime <= 0.001) {
      this.stop();
      if (typeof this.onComplete === 'function') {
        this.onComplete();
      }
    }
  }

  /**
   * Pauses the timer, preserving remaining time without drift.
   */
  pause() {
    if (!this.isRunning) return;

    // Do a final tick to capture elapsed time right up to pause moment
    this.tick();
    this.isRunning = false;
    this.clearTimerLoop();
    this.lastTickTime = null;
  }

  /**
   * Resumes the timer from current remaining time.
   */
  resume() {
    if (this.isRunning || this.remainingTime <= 0) return;
    this.start();
  }

  /**
   * Stops and clears the timer.
   */
  stop() {
    this.isRunning = false;
    this.clearTimerLoop();
    this.lastTickTime = null;
  }

  /**
   * Resets timer to fresh duration.
   */
  reset(newDuration = null) {
    this.stop();
    if (newDuration !== null && newDuration > 0) {
      this.totalDuration = newDuration;
    }
    this.remainingTime = this.totalDuration;
  }

  clearTimerLoop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}
