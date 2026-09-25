"""
Storage manager module for Critter Bonk.
Simulates and validates best score persistence logic.
"""

from typing import Optional, Any


class StorageManager:
    """Manages best score persistence with strict validation."""

    STORAGE_KEY = "critter_bonk_best_score"

    def __init__(self, initial_best: int = 0):
        self._memory_best_score = max(0, int(initial_best))

    def get_best_score(self) -> int:
        return self._memory_best_score

    def save_best_score(self, new_score: int) -> bool:
        """Validates and updates high score. Returns True if new high score."""
        try:
            val = int(new_score)
            if val > self._memory_best_score:
                self._memory_best_score = val
                return True
        except (ValueError, TypeError):
            pass
        return False

    def sanitize_raw_value(self, raw_value: Any) -> int:
        """Sanitizes raw stored values to prevent malformed score injection."""
        try:
            val = int(raw_value)
            return max(0, val)
        except (ValueError, TypeError):
            return 0
