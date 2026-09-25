"""
Critters module for Critter Bonk.
Defines critter types, attributes, and randomized selection.
"""

from dataclasses import dataclass
import random
from typing import List, Optional


@dataclass(frozen=True)
class Critter:
    id: str
    name: str
    emoji: str
    points: int = 1
    sound_freq: float = 440.0


CRITTERS: List[Critter] = [
    Critter(id="hamster", name="Hamster", emoji="🐹", points=1, sound_freq=520.0),
    Critter(id="bear", name="Bear", emoji="🐻", points=1, sound_freq=330.0),
    Critter(id="frog", name="Frog", emoji="🐸", points=1, sound_freq=480.0),
    Critter(id="monkey", name="Monkey", emoji="🐵", points=1, sound_freq=560.0),
    Critter(id="rabbit", name="Rabbit", emoji="🐰", points=1, sound_freq=600.0),
    Critter(id="fox", name="Fox", emoji="🦊", points=1, sound_freq=440.0),
]


def get_critter_by_id(critter_id: str) -> Optional[Critter]:
    for critter in CRITTERS:
        if critter.id == critter_id:
            return critter
    return None


def get_random_critter(exclude_id: Optional[str] = None) -> Critter:
    pool = [c for c in CRITTERS if c.id != exclude_id] if exclude_id else CRITTERS
    return random.choice(pool or CRITTERS)
