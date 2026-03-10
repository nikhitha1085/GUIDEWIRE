"""Weekly pricing engine for parametric coverage."""

from typing import NamedTuple


class Quote(NamedTuple):
    base_weekly_income: float
    weather_risk_factor: float
    premium: float


# simple linear pricing formula for prototype
BASE_RATE = 0.1  # 10% of average weekly income as starting point
WEATHER_MULTIPLIERS = {
    "low": 1.0,
    "medium": 1.25,
    "high": 1.5,
}


def compute_weekly_premium(avg_weekly_income: float, weather_risk: str) -> Quote:
    """Return a Quote object containing premium and components.

    weather_risk should be one of 'low', 'medium', 'high' based on external
    analysis (e.g. frequency of storms or AQI warnings in the locale).
    """
    factor = WEATHER_MULTIPLIERS.get(weather_risk, 1.0)
    premium = avg_weekly_income * BASE_RATE * factor
    return Quote(avg_weekly_income, factor, premium)
