/**
 * Critter Bonk - Effects Engine
 * Renders high-performance particle bursts, floating +1 markers, screen shake, and celebratory confetti.
 */

export class EffectsManager {
  constructor() {
    this.effectsCanvas = document.getElementById('effectsCanvas');
    this.effectsCtx = this.effectsCanvas ? this.effectsCanvas.getContext('2d') : null;

    this.confettiCanvas = document.getElementById('confettiCanvas');
    this.confettiCtx = this.confettiCanvas ? this.confettiCanvas.getContext('2d') : null;

    this.starsCanvas = document.getElementById('starsCanvas');
    this.starsCtx = this.starsCanvas ? this.starsCanvas.getContext('2d') : null;

    this.floatingContainer = document.getElementById('floatingTextContainer');
    this.gameContainer = document.getElementById('gameContainer');

    this.particles = [];
    this.confettiPieces = [];
    this.stars = [];

    this.effectsAnimId = null;
    this.confettiAnimId = null;
    this.starsAnimId = null;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.initCanvases();
    this.initStars();
  }

  initCanvases() {
    this.resizeCanvases();
    window.addEventListener('resize', () => {
      this.resizeCanvases();
      this.initStars();
    });
  }

  resizeCanvases() {
    if (this.effectsCanvas) {
      const rect = this.effectsCanvas.parentElement.getBoundingClientRect();
      this.effectsCanvas.width = rect.width;
      this.effectsCanvas.height = rect.height;
    }
    if (this.confettiCanvas) {
      const rect = this.confettiCanvas.parentElement.getBoundingClientRect();
      this.confettiCanvas.width = rect.width;
      this.confettiCanvas.height = rect.height;
    }
    if (this.starsCanvas) {
      this.starsCanvas.width = window.innerWidth;
      this.starsCanvas.height = window.innerHeight;
    }
  }

  /**
   * Initializes the Twilight Garden starry night background.
   */
  initStars() {
    if (!this.starsCanvas || !this.starsCtx) return;

    this.stars = [];
    const count = Math.min(85, Math.floor((window.innerWidth * window.innerHeight) / 12000));
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.starsCanvas.width,
        y: Math.random() * this.starsCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    if (!this.starsAnimId) {
      this.renderStars();
    }
  }

  renderStars() {
    if (!this.starsCanvas || !this.starsCtx) return;
    const ctx = this.starsCtx;
    ctx.clearRect(0, 0, this.starsCanvas.width, this.starsCanvas.height);

    for (let star of this.stars) {
      star.alpha += star.twinkleSpeed;
      if (star.alpha > 0.95 || star.alpha < 0.15) {
        star.twinkleSpeed = -star.twinkleSpeed;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0.1, star.alpha)})`;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffd166';
      ctx.fill();
    }

    this.starsAnimId = requestAnimationFrame(() => this.renderStars());
  }

  /**
   * Triggers a localized particle explosion at (x, y).
   */
  triggerParticleBurst(x, y, isFrenzy = false) {
    if (this.prefersReducedMotion || !this.effectsCtx) return;

    const count = isFrenzy ? 18 : 12;
    const palette = isFrenzy
      ? ['#ef4444', '#f59e0b', '#fbbf24', '#ffffff']
      : ['#fbbf24', '#f59e0b', '#10b981', '#ffffff', '#38bdf8'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 4.5 + 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.0,
        size: Math.random() * 3.5 + 2.5,
        color: palette[Math.floor(Math.random() * palette.length)],
        life: 1.0,
        decay: Math.random() * 0.035 + 0.035,
      });
    }

    if (!this.effectsAnimId) {
      this.runEffectsLoop();
    }
  }

  runEffectsLoop() {
    if (!this.effectsCanvas || !this.effectsCtx) return;
    const ctx = this.effectsCtx;

    ctx.clearRect(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12; // gentle gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (this.particles.length > 0) {
      this.effectsAnimId = requestAnimationFrame(() => this.runEffectsLoop());
    } else {
      this.effectsAnimId = null;
      ctx.clearRect(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);
    }
  }

  /**
   * Spawns a floating +1 text above the hit point.
   */
  triggerFloatingScore(x, y) {
    if (!this.floatingContainer) return;

    const el = document.createElement('div');
    el.className = 'floating-score';
    el.textContent = '+1';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    this.floatingContainer.appendChild(el);

    // Guaranteed DOM cleanup
    setTimeout(() => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 800);
  }

  /**
   * Triggers a subtle screen shake impact on the game container.
   */
  triggerScreenShake() {
    if (this.prefersReducedMotion || !this.gameContainer) return;

    this.gameContainer.classList.remove('shake-impact');
    // Force reflow
    void this.gameContainer.offsetWidth;
    this.gameContainer.classList.add('shake-impact');

    setTimeout(() => {
      if (this.gameContainer) {
        this.gameContainer.classList.remove('shake-impact');
      }
    }, 220);
  }

  /**
   * Celebratory confetti rain for high scores and game over.
   */
  triggerConfetti() {
    if (this.prefersReducedMotion || !this.confettiCanvas || !this.confettiCtx) return;

    this.resizeCanvases();
    const count = 75;
    const colors = ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8', '#ec4899', '#a855f7'];

    this.confettiPieces = [];
    for (let i = 0; i < count; i++) {
      this.confettiPieces.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * -this.confettiCanvas.height * 0.4,
        w: Math.random() * 8 + 5,
        h: Math.random() * 6 + 4,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
      });
    }

    if (!this.confettiAnimId) {
      this.runConfettiLoop();
    }
  }

  runConfettiLoop() {
    if (!this.confettiCanvas || !this.confettiCtx) return;
    const ctx = this.confettiCtx;

    ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

    for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
      const c = this.confettiPieces[i];
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotationSpeed;

      if (c.y > this.confettiCanvas.height + 20) {
        this.confettiPieces.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      ctx.restore();
    }

    if (this.confettiPieces.length > 0) {
      this.confettiAnimId = requestAnimationFrame(() => this.runConfettiLoop());
    } else {
      this.confettiAnimId = null;
      ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
  }

  clearEffects() {
    this.particles = [];
    this.confettiPieces = [];
    if (this.effectsCtx && this.effectsCanvas) {
      this.effectsCtx.clearRect(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);
    }
    if (this.confettiCtx && this.confettiCanvas) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
    }
    if (this.floatingContainer) {
      this.floatingContainer.innerHTML = '';
    }
    if (this.effectsAnimId) {
      cancelAnimationFrame(this.effectsAnimId);
      this.effectsAnimId = null;
    }
    if (this.confettiAnimId) {
      cancelAnimationFrame(this.confettiAnimId);
      this.confettiAnimId = null;
    }
  }
}
