# Critter Bonk — Test Checklist

Use this checklist during quality assurance and playtesting rounds. Every item must be verified before granting a passing score.

## START & SERVER
* [ ] `python main.py` launches successfully on Windows PowerShell
* [ ] Local web server starts on http://127.0.0.1:8000
* [ ] Game page loads cleanly with no 404s or console errors
* [ ] Start button works and transitions to PLAYING state
* [ ] First critter appears immediately (0ms delay) upon clicking Start
* [ ] PLAYING state starts correctly and locks start screen

## GAMEPLAY & MECHANICS
* [ ] 3x3 grid displays with nine distinct, visible holes
* [ ] Hole depth, interior shadow, and foreground mound layer are visible
* [ ] Critters emerge from INSIDE the holes (not floating above)
* [ ] Six animal emojis present: 🐹 Hamster, 🐻 Bear, 🐸 Frog, 🐵 Monkey, 🐰 Rabbit, 🦊 Fox
* [ ] Critters automatically disappear if not clicked
* [ ] Clicking an active critter adds exactly +1 point
* [ ] Double clicking the same critter does NOT award duplicate points
* [ ] Score never becomes negative

## SCORE-DRIVEN DIFFICULTY
* [ ] Starts in EASY mode (Score 0–4, ~2.5s visible duration)
* [ ] Reaching Score 5 transitions to FAST mode (~1.6s visible duration)
* [ ] Reaching Score 10 transitions to FRENZY mode (~1.0s visible duration)
* [ ] Time elapsed alone does NOT trigger speed/difficulty escalation
* [ ] Speed badge in HUD updates dynamically with color and text

## HIT EFFECTS & AUDIO
* [ ] Particle burst radiates from click position
* [ ] Golden `+1` text floats upward and fades out
* [ ] Subtle screen impact shake triggers on container
* [ ] Web Audio API synthesizes arcade bonk without lag
* [ ] FRENZY bonk has distinct energetic pitch
* [ ] Sound toggle button toggles between 🔊 ON and 🔇 OFF
* [ ] When muted, absolutely no game sounds are generated

## TIMER & PROGRESS
* [ ] Starts precisely at 30 seconds
* [ ] Countdown updates smoothly every 100ms
* [ ] Visual progress bar shrinks in sync with remaining time
* [ ] Timer stops cleanly at 0.0s and terminates gameplay

## PAUSE & RESTART ENGINEERING
* [ ] Pause button or P/Esc pauses the countdown timer
* [ ] Critter spawning stops while paused
* [ ] Scoring is locked while paused
* [ ] Resume restarts countdown without loss of seconds
* [ ] Restart cleans all active timeouts and resets game cleanly
* [ ] Repeating Start → Pause → Resume → Pause → Restart does not create duplicate timers

## GAME OVER & STATS
* [ ] Game Over screen triggers automatically when timer reaches 0.0s
* [ ] Final Score is accurately reported
* [ ] Total Hits is accurately reported
* [ ] Hits Per Minute (HPM) is accurately computed: `hits / (30/60)`
* [ ] Best Score is displayed
* [ ] "🏆 NEW HIGH SCORE!" badge displays if best score is exceeded
* [ ] Confetti animation showers the screen on game over
* [ ] "Play Again" button initiates a clean new game

## PERSISTENCE & STORAGE
* [ ] High score persists across page reloads in `localStorage`
* [ ] Storage handles corrupt or missing keys gracefully without crashing

## RESPONSIVE & LAYOUT
* [ ] Desktop layout is crisp and centered
* [ ] Tablet layout maintains comfortable proportions
* [ ] Mobile portrait (<= 480px) scales grid cleanly without overflowing
* [ ] Touch targets are at least 44px
* [ ] Accidental double-tap zoom and text selection are prevented

## ACCESSIBILITY
* [ ] Keyboard navigation: Enter, Space, and 1–9 Numpad bonk holes
* [ ] Focus outlines are visible for interactive elements
* [ ] ARIA labels and roles provided on buttons and modals
* [ ] `@media (prefers-reduced-motion: reduce)` disables screen shake and excessive particles
