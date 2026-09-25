# 🐹 Critter Bonk 🐰

> **Bonk the critters. Chase the high score!**
>
> A polished browser-based Whack-a-Mole arcade game built as a demonstration of a **rubric-driven self-improvement development workflow**.

---

## Project Overview

Critter Bonk is a 30-second casual arcade game set in a Twilight Garden — a magical nocturnal landscape with twinkling stars, dark emerald grass, and rich earthen burrow mounds. Six cute critters (🐹 🐻 🐸 🐵 🐰 🦊) peek out from their holes. Your job: bonk as many as you can before the clock hits zero.

The project demonstrates a complete **AI-assisted development workflow** including brainstorming, theme selection, iterative building, rubric-driven evaluation, and self-improvement loops — achieving a final quality score of **91/100**.

---

## Features

- **Twilight Garden Theme** — Deep midnight blue sky, twinkling gold stars, dark emerald garden, rich soil burrow mounds
- **3×3 Grid of 9 Holes** — Critters emerge from inside holes with smooth CSS animation
- **Score-Driven Difficulty** — EASY → FAST → FRENZY (triggered by score, not time)
- **30-Second Countdown** — Drift-compensated timer with animated progress bar
- **Hit Feedback Suite** — Canvas particles, floating +1, screen shake, procedural audio
- **Pause / Resume / Restart** — Full timer-safe state management
- **Game Over Statistics** — Final Score, Total Hits, Hits/Min, Best Score
- **High Score Persistence** — Browser `localStorage` with private-mode fallback
- **Web Audio API** — Zero external audio files; all sounds synthesized procedurally
- **Accessible** — Keyboard bonking (1–9 numpad), P/Esc pause, ARIA labels, `prefers-reduced-motion`
- **Responsive** — Desktop, tablet, and mobile portrait layouts

---

## Gameplay

1. Click **Start Bonking!** — the first critter appears immediately
2. Click/tap any critter as it peeks from its hole — score +1
3. Each critter automatically retreats if you miss it
4. Score higher to increase speed (EASY → FAST → FRENZY)
5. The game ends after exactly 30 seconds

---

## Difficulty

Difficulty escalates **strictly by player score** — not by elapsed time:

| Tier | Score Range | Critter Visible Time | Spawn Interval |
|---|---|---|---|
| 🟢 EASY | 0–4 points | ~2.5 seconds | 600–900ms |
| 🟡 FAST | 5–9 points | ~1.6 seconds | 400–650ms |
| 🔴 FRENZY | 10+ points | ~1.05 seconds | 250–450ms |

The moment you score your 5th or 10th point, the next spawn immediately reflects the new difficulty.

---

## Architecture

```text
Python Server (main.py)           Browser Client (web/)
      │                                   │
  http.server                      ES Modules (type="module")
  Serves web/                             │
  Port 8000                    ┌──────────┼──────────┐
                           game.js    critters.js   timer.js
                               │                      │
                         state.js              audio.js  effects.js
                               │
                         storage.js   ui.js
```

The Python layer (`game/` package) provides a mirrored headless simulation engine for rule validation and CI testing. The browser frontend (`web/js/`) is a pure vanilla JavaScript ES module architecture with zero external runtime dependencies.

---

## Project Structure

```text
CRITTER-BONK/
├── main.py                     # Entry point: python main.py
├── README.md
├── requirements.txt            # No external dependencies (standard library only)
│
├── game/                       # Python simulation engine
│   ├── game.py, state.py, critters.py, scoring.py
│   ├── timer.py, effects.py, audio.py, storage.py
│
├── web/                        # Browser game client
│   ├── index.html
│   ├── css/   style.css, animations.css, responsive.css
│   ├── js/    main.js, game.js, state.js, critters.js
│   │          effects.js, audio.js, storage.js, timer.js, ui.js
│   └── assets/README.md
│
├── evaluation/                 # Quality engineering
│   ├── rubric.md               # 100-point scoring rubric
│   ├── test-checklist.md       # Functional test checklist
│   ├── evaluation-report.md    # Final scored evaluation
│   └── improvement-log.md      # Iteration history
│
└── docs/
    ├── architecture.md
    ├── gameplay-flow.md
    └── workflow.md
```

---

## Development Workflow

This project uses a **rubric-gated self-improvement loop**:

```text
BRAINSTORM (3 themes: Twilight Garden, Monster Playground, Woodland Adventure)
        ↓
THEME SELECTION (Twilight Garden chosen for premium arcade aesthetic)
        ↓
GOAL + INPUT + OUTPUT SPECIFICATION (documented in docs/workflow.md)
        ↓
BUILD (v1 implementation)
        ↓
PLAYTEST + SCREENSHOT (browser session, captured screenshots)
        ↓
RUBRIC EVALUATION (scored against 100-point rubric)
        ↓
IDENTIFY FAILURES (critters invisible, high score bug, layout overflow)
        ↓
IMPROVE (CSS critter fix, storage guard, layout compact)
        ↓
CODE REVIEW + RE-EVALUATE
        ↓
QUALITY GATE: Score ≥ 90/100 AND zero critical failures → DONE
```

---

## Quality Gate

The project must achieve **≥ 90/100** on the rubric AND all critical requirements must pass before completion is declared. See [`evaluation/rubric.md`](evaluation/rubric.md) for the full scoring matrix.

**Final score: 91/100** ✅

---

## Running the Project

```powershell
# From the project root:
python main.py
```

Expected output:
```
Critter Bonk server running at:

http://127.0.0.1:8000

Press Ctrl+C to stop.
```

Open `http://127.0.0.1:8000` in your browser. No installation, no `pip install`, no build step required.

**Requirements**: Python 3.8+ (standard library only).

---

## Testing

See [`evaluation/test-checklist.md`](evaluation/test-checklist.md) for the complete functional test checklist covering:
- Server startup
- Start / Gameplay / Difficulty
- Pause / Resume / Restart
- Timer / Game Over
- Effects / Audio
- Persistence / Responsive / Accessibility

---

## Evaluation

- **Rubric**: [`evaluation/rubric.md`](evaluation/rubric.md) — 100-point quality matrix
- **Report**: [`evaluation/evaluation-report.md`](evaluation/evaluation-report.md) — scored results per category
- **Log**: [`evaluation/improvement-log.md`](evaluation/improvement-log.md) — iteration history with before/after analysis
