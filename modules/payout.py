"""Parametric payout calculations."""

from typing import Dict


# thresholds for pay-out triggers; in real world fetched from policy terms
PAYOUT_THRESHOLDS = {
    "temperature": 45.0,  # degrees Celsius
    "wind_speed": 50.0,   # km/h
    "aqi": 300,           # Air Quality Index
}


def evaluate_payout(conditions: Dict, avg_weekly_income: float) -> float:
    """Given external conditions and insured income, compute payout amount.

    Payout = proportion of income lost; for prototype we simply trigger full
    weekly benefit if ANY threshold is exceeded.
    """
    for key, threshold in PAYOUT_THRESHOLDS.items():
        if conditions.get(key, 0) >= threshold:
            # full weekly income paid in case of trigger
            return avg_weekly_income
    return 0.0
