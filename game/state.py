"""
State management module for Critter Bonk.
Enforces explicit state machine rules and transitions:
MENU -> PLAYING <-> PAUSED
PLAYING -> GAME_OVER
GAME_OVER -> PLAYING / MENU
"""

from enum import Enum
from typing import Set


class GameState(str, Enum):
    MENU = "MENU"
    PLAYING = "PLAYING"
    PAUSED = "PAUSED"
    GAME_OVER = "GAME_OVER"


class GameStateMachine:
    """Manages game state and validates legal state transitions."""

    VALID_TRANSITIONS = {
        GameState.MENU: {GameState.PLAYING},
        GameState.PLAYING: {GameState.PAUSED, GameState.GAME_OVER, GameState.PLAYING},
        GameState.PAUSED: {GameState.PLAYING, GameState.MENU},
        GameState.GAME_OVER: {GameState.PLAYING, GameState.MENU},
    }

    def __init__(self, initial_state: GameState = GameState.MENU):
        self._current_state = initial_state

    @property
    def current(self) -> GameState:
        return self._current_state

    def can_transition_to(self, target_state: GameState) -> bool:
        allowed: Set[GameState] = self.VALID_TRANSITIONS.get(self._current_state, set())
        return target_state in allowed

    def transition_to(self, target_state: GameState) -> GameState:
        if not self.can_transition_to(target_state):
            raise ValueError(
                f"Illegal state transition: Cannot transition from {self._current_state.value} to {target_state.value}"
            )
        self._current_state = target_state
        return self._current_state

    def reset(self) -> None:
        self._current_state = GameState.MENU

    def is_playing(self) -> bool:
        return self._current_state == GameState.PLAYING

    def is_paused(self) -> bool:
        return self._current_state == GameState.PAUSED

    def is_game_over(self) -> bool:
        return self._current_state == GameState.GAME_OVER

    def is_menu(self) -> bool:
        return self._current_state == GameState.MENU
