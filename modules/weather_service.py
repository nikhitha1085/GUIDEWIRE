"""Module to fetch external conditions (mock or real APIs).

Parametric policies will be triggered when certain environmental metrics
exceed configurable thresholds. This service abstracts the data source.
"""

import random
from datetime import datetime


def get_current_conditions(location: str) -> dict:
    """Return a dictionary of conditions for a given location.

    In a real system, this would call a weather/pollution API (OpenWeather,
    AccuWeather, local govt. sensors). For prototype purposes, we simulate
    values.
    """
    # simulate temperature (°C), wind speed (km/h), AQI (Air Quality Index)
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "location": location,
        "temperature": random.uniform(20, 40),
        "wind_speed": random.uniform(5, 60),
        "aqi": random.randint(50, 500),
    }
