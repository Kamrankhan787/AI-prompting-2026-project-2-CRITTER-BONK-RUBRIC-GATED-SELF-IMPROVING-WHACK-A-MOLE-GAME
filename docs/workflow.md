# Development Workflow & Theme Specification

## 1. Initial Brainstorming & Theme Exploration

Before implementation, three visual themes were conceptualized and evaluated for arcade engagement, visual contrast, and aesthetic polish:

### Theme A — Twilight Garden (SELECTED)
* **Visual Palette**: Deep midnight blue sky (`#070b19`, `#0f172a`), dark emerald grass (`#064e3b`, `#047857`), rich earth soil (`#271c19`, `#3e2c23`), with warm glowing gold accents (`#fbbf24`, `#f59e0b`).
* **Environment**: Atmospheric twinkling stars, subtle night garden firefly dust, soft moonlit rim lighting on burrow mounds.
* **Critters**: Playful daytime/crepuscular garden animals (Hamster, Bear, Frog, Monkey, Rabbit, Fox) peeking out under the starlight.
* **Atmosphere**: Enchanting, cozy, polished, arcade-like with high contrast and calming tones.

### Theme B — Monster Playground
* **Visual Palette**: Deep purple and neon indigo environment with electric pink and radioactive green accents.
* **Critters**: Playful alien/slime monsters with quirky eye stalks.
* **Reason Not Selected**: Higher visual fatigue; neon palette can cause contrast and accessibility conflicts for long sessions.

### Theme C — Woodland Adventure
* **Visual Palette**: Sunny forest green, warm wood browns, amber sunlight rays.
* **Critters**: Traditional forest critters.
* **Reason Not Selected**: Too common in traditional Whack-a-Mole implementations; lacks the luminous contrast and arcade punch of the Twilight Garden.

---

## 2. Decision: TWILIGHT GARDEN

**Twilight Garden** was formally selected as the unified art and UX direction. Its luminous stars, dark emerald foliage, and golden glowing accents deliver a premium, modern arcade aesthetic while maintaining outstanding readability, accessibility, and hit feedback contrast.

---

## 3. Specification: Goal / Input / Output

### Goal
Build a premium, highly responsive 30-second Whack-a-Mole browser game ("Critter Bonk") where cute animals emerge from inside deep 3D-styled holes and the player taps/clicks them to score. The gameplay difficulty must strictly escalate based on player score (EASY → FAST → FRENZY), governed by a rubric-gated self-improvement quality loop.

### Input
* **Player Gestures**: Pointer/Click/Touch events on active critter holes.
* **Keyboard Navigation**: Accessible keyboard triggers (Enter/Space on active holes, Numpad 1–9 grid shortcuts, P / Escape for Pause/Resume).
* **Game Controls**: Start Game, Pause, Resume, Restart, Play Again, Sound Toggle (Mute / Unmute).

### Output
* **Visual Presentation**:
  * 3×3 grid of 9 multi-layered dirt holes with rim depth and internal shadow.
  * Critters smoothly rising from deep within the hole (not floating above).
  * Real-time HUD: Score, Best Score, 30s Countdown timer, Speed tier badge (EASY / FAST / FRENZY), and animated timer progress bar.
  * Hit Feedback: Procedural particle burst, floating `+1` text rising & fading, subtle screen impact shake, and Web Audio API synthesized audio bonk.
  * Game Over Summary: Final score, total hits, hits-per-minute (HPM), high score badge with confetti celebration.
* **Persistence**: Best score reliably stored in browser `localStorage`.

---

## 4. The Self-Improvement Development Loop

This project embraces an explicit, rubric-governed self-improvement cycle:

```text
       BRAINSTORM (Themes A, B, C)
                   ↓
         THEME SELECTION (Twilight Garden)
                   ↓
         GOAL + INPUT + OUTPUT SPEC
                   ↓
                 BUILD
                   ↓
               PLAYTEST
                   ↓
           RUBRIC EVALUATION
                   ↓
          IDENTIFY FAILURES
                   ↓
                IMPROVE
                   ↓
            PLAYTEST AGAIN
                   ↓
             RE-EVALUATE
                   ↓
       QUALITY GATE (Score >= 90 & 0 Critical Fails)
                   ↓
                 DONE
```

Evaluation is treated as an active development driver rather than a post-hoc rubber stamp. Each defect identified during playtesting prompts code refinements, architectural hardening, and re-scoring until the quality threshold is satisfied.
