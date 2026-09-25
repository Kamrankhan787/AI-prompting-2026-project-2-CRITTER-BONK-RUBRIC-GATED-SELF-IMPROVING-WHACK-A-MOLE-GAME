"""
Critter Bonk Game Engine Package
Provides Python simulation, verification, and data modeling for game rules.
"""

from .state import GameState, GameStateMachine
from .critters import CRITTERS, Critter, get_random_critter
from .scoring import ScoringEngine, DifficultyTier
from .timer import GameTimer
from .effects import EffectConfig
from .audio import AudioConfig
from .storage import StorageManager
from .game import CritterBonkGame

__all__ = [
    "GameState",
    "GameStateMachine",
    "CRITTERS",
    "Critter",
    "get_random_critter",
    "ScoringEngine",
    "DifficultyTier",
    "GameTimer",
    "EffectConfig",
    "AudioConfig",
    "StorageManager",
    "CritterBonkGame",
]
