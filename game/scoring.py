"""
Scoring and difficulty module for Critter Bonk.
Strictly drives difficulty based on player score, NOT elapsed time.
"""

from enum import Enum
from typing import Dict, Any


class DifficultyTier(str, Enum):
    EASY = "EASY"
    FAST = "FAST"
    FRENZY = "FRENZY"


class ScoringEngine:
    """Handles score calculation, difficulty tier determination, and stats."""

    # Timing configurations per difficulty tier in milliseconds
    TIER_SETTINGS: Dict[DifficultyTier, Dict[str, Any]] = {
        DifficultyTier.EASY: {
            "name": "EASY",
            "min_score": 0,
            "max_score": 4,
            "visible_duration_ms": 2500,
            "spawn_delay_min_ms": 600,
            "spawn_delay_max_ms": 900,
            "badge_color": "#4ade80",  # Green
        },
        DifficultyTier.FAST: {
            "name": "FAST",
            "min_score": 5,
            "max_score": 9,
            "visible_duration_ms": 1600,
            "spawn_delay_min_ms": 400,
            "spawn_delay_max_ms": 650,
            "badge_color": "#facc15",  # Yellow
        },
        DifficultyTier.FRENZY: {
            "name": "FRENZY",
            "min_score": 10,
            "max_score": float("inf"),
            "visible_duration_ms": 1050,
            "spawn_delay_min_ms": 250,
            "spawn_delay_max_ms": 450,
            "badge_color": "#f87171",  # Red
        },
    }

    def __init__(self):
        self._score: int = 0
        self._total_hits: int = 0
        self._misses: int = 0

    @property
    def score(self) -> int:
        return self._score

    @property
    def total_hits(self) -> int:
        return self._total_hits

    @property
    def misses(self) -> int:
        return self._misses

    def register_hit(self, points: int = 1) -> int:
        if points > 0:
            self._score += points
            self._total_hits += 1
        return self._score

    def register_miss(self) -> None:
        self._misses += 1

    def get_difficulty_tier(self, score: int = None) -> DifficultyTier:
        """Determines tier strictly based on current player score."""
        s = self._score if score is None else score
        if s >= 10:
            return DifficultyTier.FRENZY
        if s >= 5:
            return DifficultyTier.FAST
        return DifficultyTier.EASY

    def get_tier_config(self, score: int = None) -> Dict[str, Any]:
        tier = self.get_difficulty_tier(score)
        return self.TIER_SETTINGS[tier]

    def calculate_hits_per_minute(self, elapsed_seconds: float) -> float:
        """Calculates hits per minute: total hits / (elapsed seconds / 60.0)."""
        # Minimum baseline of 1 second to prevent division by near-zero during instant tests
        effective_seconds = max(1.0, float(elapsed_seconds))
        minutes = effective_seconds / 60.0
        return round(self._total_hits / minutes, 1)

    def reset(self) -> None:
        self._score = 0
        self._total_hits = 0
        self._misses = 0
