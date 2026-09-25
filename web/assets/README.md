# Critter Bonk — Web Assets Architecture

## 1. Visual & Graphic Assets
Critter Bonk leverages vector SVG styling, pure CSS art, and system unicode emojis for ultra-fast loading, zero asset HTTP requests, and crystal-clear rendering on Retina / high-DPI displays:

* **Critters**:
  * 🐹 Hamster
  * 🐻 Bear
  * 🐸 Frog
  * 🐵 Monkey
  * 🐰 Rabbit
  * 🦊 Fox
* **Hole Art**:
  * Multi-tiered CSS layer system:
    1. Outer grass mound shadow
    2. Deep dirt rim border (`#3e2c23`)
    3. Radial-gradient burrow interior (`#140d0a` to `#241812`)
    4. Subterranean emergence chamber with `overflow: hidden`
    5. Foreground earthen lip (`pointer-events: none`) to guarantee emergence depth
* **Environment**:
  * Twilight Garden background canvas generating 70 twinkling stars with differing phases and sizes.

## 2. Procedural Audio System
All game sounds are generated procedurally using the browser's native **Web Audio API**:
* No external `.mp3` or `.wav` files required.
* Zero network latency, zero 404 errors, zero CORS issues.
* Clean AudioContext initialization/resumption upon user gesture.
* Audio synthesizer produces:
  * Regular Bonk: Exponential frequency drop (320Hz → 120Hz, triangle oscillator).
  * Frenzy Bonk: High-energy sawtooth sweep (640Hz → 220Hz).
  * Miss: Low subtle sine blip (160Hz → 90Hz).
  * High Score: Ascending melodic arpeggio (C5 - E5 - G5 - C6).
  * Game Over: Descending melancholy chord progression (A4 - G4 - F4 - D4).
  * Button Clicks: Subtle high-frequency UI tick (700Hz → 900Hz).
