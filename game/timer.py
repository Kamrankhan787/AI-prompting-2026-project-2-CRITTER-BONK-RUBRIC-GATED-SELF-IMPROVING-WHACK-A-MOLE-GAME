"""
Timer module for Critter Bonk.
Manages the 30-second countdown, pause/resume time calculations, and elapsed time.
"""

import time
from typing import Optional, Callable


class GameTimer:
    DEFAULT_DURATION_SECONDS = 30.0

    def __init__(self, duration: float = DEFAULT_DURATION_SECONDS):
        self.total_duration = duration
        self.remaining_time = duration
        self.is_running = False
        self._last_tick_timestamp: Optional[float] = None
        self._on_tick_callback: Optional[Callable[[float], None]] = None
        self._on_complete_callback: Optional[Callable[[], None]] = None

    def start(self) -> None:
        self.is_running = True
        self._last_tick_timestamp = time.time()

    def pause(self) -> None:
        if not self.is_running:
            return
        self.update()
        self.is_running = False
        self._last_tick_timestamp = None

    def resume(self) -> None:
        if self.is_running or self.remaining_time <= 0:
            return
        self.is_running = True
        self._last_tick_timestamp = time.time()

    def update(self) -> float:
        """Updates the remaining time based on wall clock drift compensation."""
        if not self.is_running or self._last_tick_timestamp is None:
            return self.remaining_time

        now = time.time()
        delta = now - self._last_tick_timestamp
        self._last_tick_timestamp = now

        self.remaining_time = max(0.0, self.remaining_time - delta)
        if self._on_tick_callback:
            self._on_tick_callback(self.remaining_time)

        if self.remaining_time <= 0:
            self.is_running = False
            if self._on_complete_callback:
                self._on_complete_callback()

        return self.remaining_time

    @property
    def elapsed_time(self) -> float:
        return max(0.0, self.total_duration - self.remaining_time)

    def reset(self, duration: Optional[float] = None) -> None:
        if duration is not None:
            self.total_duration = duration
        self.remaining_time = self.total_duration
        self.is_running = False
        self._last_tick_timestamp = None
