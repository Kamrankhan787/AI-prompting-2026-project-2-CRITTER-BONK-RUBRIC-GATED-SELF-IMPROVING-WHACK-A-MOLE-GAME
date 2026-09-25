"""
Effects configuration module for Critter Bonk.
Specifies parameters for particle burst, +1 floating text, screen shake, and confetti.
"""

from dataclasses import dataclass, field
from typing import List


@dataclass
class EffectConfig:
    # Particles
    particle_count: int = 14
    particle_colors: List[str] = field(
        default_factory=lambda: ["#ffd166", "#f72585", "#4cc9f0", "#7209b7", "#06d6a0"]
    )
    particle_lifetime_ms: int = 650
    particle_speed_min: float = 60.0
    particle_speed_max: float = 180.0

    # +1 Floating Text
    floating_text_duration_ms: int = 750
    floating_text_color: str = "#ffd166"
    floating_distance_px: int = 45

    # Screen Shake
    shake_duration_ms: int = 180
    shake_intensity_px: int = 5

    # Confetti (Game Over / High Score)
    confetti_count: int = 60
    confetti_duration_ms: int = 2400
