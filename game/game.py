"""
Critter Bonk Game Orchestration Module.
Encapsulates complete game loop logic, 3x3 grid state, and rules verification.
"""

from typing import Dict, List, Optional, Any
from .state import GameState, GameStateMachine
from .scoring import ScoringEngine, DifficultyTier
from .timer import GameTimer
from .critters import CRITTERS, Critter, get_random_critter
from .storage import StorageManager


class CritterBonkGame:
    TOTAL_HOLES = 9
    GRID_ROWS = 3
    GRID_COLS = 3
    DEFAULT_DURATION_SECONDS = 30.0

    def __init__(self, duration: float = DEFAULT_DURATION_SECONDS):
        self.state_machine = GameStateMachine(GameState.MENU)
        self.scoring = ScoringEngine()
        self.timer = GameTimer(duration)
        self.storage = StorageManager()

        # Grid state: array of 9 slots
        # Each slot holds either None or a dict with active critter info:
        # {"critter": Critter, "active": bool, "spawned_at": float, "has_been_hit": bool}
        self.holes: List[Optional[Dict[str, Any]]] = [None] * self.TOTAL_HOLES
        self.active_hole_index: Optional[int] = None

    @property
    def state(self) -> GameState:
        return self.state_machine.current

    @property
    def score(self) -> int:
        return self.scoring.score

    @property
    def best_score(self) -> int:
        return self.storage.get_best_score()

    @property
    def difficulty_tier(self) -> DifficultyTier:
        return self.scoring.get_difficulty_tier()

    def start_game(self) -> Dict[str, Any]:
        """Starts a new 30-second game and spawns the first critter immediately."""
        self.scoring.reset()
        self.timer.reset()
        self.holes = [None] * self.TOTAL_HOLES
        self.active_hole_index = None

        self.state_machine.transition_to(GameState.PLAYING)
        self.timer.start()

        # Immediate first critter spawn
        first_spawn = self.spawn_critter()
        return {
            "state": self.state.value,
            "score": self.score,
            "best_score": self.best_score,
            "time_remaining": self.timer.remaining_time,
            "difficulty": self.difficulty_tier.value,
            "first_spawn": first_spawn,
        }

    def pause_game(self) -> None:
        """Pauses gameplay, freezing timer and spawning."""
        if self.state == GameState.PLAYING:
            self.timer.pause()
            self.state_machine.transition_to(GameState.PAUSED)

    def resume_game(self) -> None:
        """Resumes gameplay from paused state."""
        if self.state == GameState.PAUSED:
            self.state_machine.transition_to(GameState.PLAYING)
            self.timer.resume()

    def restart_game(self) -> Dict[str, Any]:
        """Cleans up active state and restarts fresh."""
        self.holes = [None] * self.TOTAL_HOLES
        self.active_hole_index = None
        self.scoring.reset()
        self.timer.reset()
        self.state_machine.reset()
        return self.start_game()

    def spawn_critter(self, hole_index: Optional[int] = None) -> Optional[Dict[str, Any]]:
        """Spawns a critter into an available hole."""
        if self.state != GameState.PLAYING:
            return None

        # Despawn previous if still present
        if self.active_hole_index is not None:
            self.despawn_critter(self.active_hole_index)

        import random
        chosen_hole = (
            hole_index
            if hole_index is not None and 0 <= hole_index < self.TOTAL_HOLES
            else random.randint(0, self.TOTAL_HOLES - 1)
        )

        critter = get_random_critter()
        tier_cfg = self.scoring.get_tier_config()

        slot_data = {
            "hole_index": chosen_hole,
            "critter": critter,
            "active": True,
            "has_been_hit": False,
            "visible_duration_ms": tier_cfg["visible_duration_ms"],
        }
        self.holes[chosen_hole] = slot_data
        self.active_hole_index = chosen_hole
        return slot_data

    def despawn_critter(self, hole_index: int) -> None:
        """Removes a critter from a hole without scoring."""
        if 0 <= hole_index < self.TOTAL_HOLES:
            self.holes[hole_index] = None
            if self.active_hole_index == hole_index:
                self.active_hole_index = None

    def bonk_hole(self, hole_index: int) -> Dict[str, Any]:
        """Player attempts to bonk a hole. Enforces single scoring and prevents double hits."""
        if self.state != GameState.PLAYING:
            return {"success": False, "reason": "Not in PLAYING state", "score": self.score}

        if not (0 <= hole_index < self.TOTAL_HOLES):
            return {"success": False, "reason": "Invalid hole index", "score": self.score}

        target = self.holes[hole_index]
        if target is None or not target.get("active", False):
            self.scoring.register_miss()
            return {"success": False, "reason": "Empty hole or missed", "score": self.score}

        if target.get("has_been_hit", False):
            # Already hit - prevent double scoring
            return {"success": False, "reason": "Already bonked", "score": self.score}

        # Successful bonk
        target["has_been_hit"] = True
        target["active"] = False
        critter: Critter = target["critter"]
        new_score = self.scoring.register_hit(critter.points)

        # Update difficulty tier dynamically based on new score
        new_tier = self.scoring.get_difficulty_tier()

        return {
            "success": True,
            "hole_index": hole_index,
            "critter": critter.name,
            "emoji": critter.emoji,
            "points": critter.points,
            "score": new_score,
            "difficulty": new_tier.value,
        }

    def end_game(self) -> Dict[str, Any]:
        """Finishes the game, calculates stats, and checks for high score."""
        self.timer.pause()
        self.holes = [None] * self.TOTAL_HOLES
        self.active_hole_index = None
        self.state_machine.transition_to(GameState.GAME_OVER)

        final_score = self.scoring.score
        total_hits = self.scoring.total_hits
        hpm = self.scoring.calculate_hits_per_minute(self.timer.elapsed_time or 30.0)
        is_new_high = self.storage.save_best_score(final_score)

        return {
            "final_score": final_score,
            "total_hits": total_hits,
            "hits_per_minute": hpm,
            "best_score": self.best_score,
            "is_new_high_score": is_new_high,
        }
