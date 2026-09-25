"""
Audio configuration module for Critter Bonk.
Specifies synthesizer profiles for Web Audio API procedural synthesis.
"""

from dataclasses import dataclass
from typing import Dict, Any


@dataclass
class AudioProfile:
    waveform: str
    freq_start: float
    freq_end: float
    duration_sec: float
    gain_peak: float = 0.35


class AudioConfig:
    """Sound profiles used by the frontend Web Audio API procedural engine."""

    SOUNDS: Dict[str, Dict[str, Any]] = {
        "bonk": {
            "waveform": "triangle",
            "freq_start": 320.0,
            "freq_end": 120.0,
            "duration_sec": 0.14,
            "gain_peak": 0.35,
        },
        "frenzy_bonk": {
            "waveform": "sawtooth",
            "freq_start": 640.0,
            "freq_end": 220.0,
            "duration_sec": 0.16,
            "gain_peak": 0.30,
        },
        "miss": {
            "waveform": "sine",
            "freq_start": 160.0,
            "freq_end": 90.0,
            "duration_sec": 0.10,
            "gain_peak": 0.15,
        },
        "click": {
            "waveform": "sine",
            "freq_start": 700.0,
            "freq_end": 900.0,
            "duration_sec": 0.05,
            "gain_peak": 0.20,
        },
        "game_over": {
            "waveform": "triangle",
            "notes": [440.0, 392.0, 349.2, 293.7],
            "note_duration_sec": 0.18,
            "gain_peak": 0.30,
        },
        "high_score": {
            "waveform": "sine",
            "notes": [523.25, 659.25, 783.99, 1046.50],
            "note_duration_sec": 0.14,
            "gain_peak": 0.35,
        },
    }
