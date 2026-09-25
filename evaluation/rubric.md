# Critter Bonk — Quality Evaluation Rubric (100 Points)

## 1. Rubric Matrix

| # | Category | Points | Description & Evaluation Criteria |
|---|---|---:|---|
| 1 | **Core Gameplay** | 20 | 3×3 grid with 9 visible holes; reliable critter spawning; responsive click/tap detection; exactly +1 point per hit; no double scoring; no negative scores. |
| 2 | **Critter Emergence & Hole Animation** | 10 | Critters rise visibly from *inside* the hole using layered masks/rims (not floating above); smooth rise, settle, and retreat animations; bonk impact squash. |
| 3 | **Score-Driven Difficulty** | 10 | Difficulty tier strictly scales with player score (EASY 0-4, FAST 5-9, FRENZY 10+); shorter visible durations and faster spawn rates as score rises; time passage alone does not increase difficulty. |
| 4 | **Hit Feedback & Juice** | 10 | Simultaneous particle burst, rising & fading floating `+1` text, subtle screen impact shake, and responsive audio feedback on every valid hit. |
| 5 | **Timer & Game Flow Engineering** | 10 | 30.0s exact countdown; visual progress bar; zero timer drift; clean pause/resume; restart destroys all prior intervals without duplicate loops or orphaned timers. |
| 6 | **UI / Visual Design (Twilight Garden)** | 10 | Cohesive Twilight Garden aesthetic; deep midnight blue sky, emerald foliage, rich burrow dirt, glowing gold accents, animated twinkling stars, polished typography, and clean HUD. |
| 7 | **Game Over Experience** | 10 | Clean cessation of game loop at 0s; displays Final Score, Total Hits, Hits Per Minute (HPM), Best Score; animated "NEW HIGH SCORE!" badge if achieved; celebratory confetti. |
| 8 | **Audio System** | 5 | Web Audio API procedural synthesis (no missing file 404s); crisp retro bonks; distinct frenzy tones; game over fanfare; working sound toggle with persistence. |
| 9 | **Responsive Design** | 5 | Flawless scaling from 320px mobile screens to desktop ultra-wide; touch targets >= 44px; no awkward overflows; no accidental text selection or double-tap zoom delay. |
| 10 | **Code Architecture & Modularity** | 5 | Clean ES module separation (`state.js`, `timer.js`, `critters.js`, `effects.js`, `audio.js`, `storage.js`, `ui.js`, `game.js`, `main.js`); zero global pollution; idiomatic code. |
| 11 | **Persistence** | 3 | High score survives page refreshes and browser restarts via `localStorage`; robust error handling for private mode and corrupt JSON/values. |
| 12 | **Accessibility** | 2 | Keyboard navigation (Enter, Space, 1-9 shortcuts); visible focus rings; ARIA roles and labels; `prefers-reduced-motion` compliance. |
| **TOTAL** | | **100** | **Passing Quality Gate: Score >= 90/100 AND Zero Critical Failures** |

---

## 2. Critical Failure Conditions (Automatic Rejection)

The game fails the quality gate immediately if ANY of the following occurs:
* `main.py` fails to launch the application.
* Game does not start when Start is clicked.
* First critter does not appear immediately upon start.
* Critters cannot be clicked or scored.
* Critters float above the holes rather than emerging from inside them.
* Score does not increment by exactly +1 or can be clicked multiple times per spawn.
* Difficulty increases with elapsed time instead of player score.
* Timer does not stop at 0.0 seconds or gameplay continues past game over.
* Pause fails to freeze gameplay or scoring.
* Restart introduces duplicate timers or accelerated game loops.
* Hit effects (particles, floating +1, screen shake, audio) fail to execute.
* Best score fails to persist across reloads.
* Sound toggle fails to mute sound.
