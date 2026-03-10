"""Basic fraud detection heuristics and AI placeholders."""

from typing import Dict


def simple_rule_check(claim: Dict) -> bool:
    """Return True if claim seems suspicious."""
    # Example: if claimed loss > 200% of typical weekly income, flag it
    if claim.get("claimed_income_loss", 0) > 2 * claim.get("avg_weekly_income", 0):
        return True
    return False


# placeholder for a more advanced ML model
class FraudModel:
    def predict(self, features: Dict) -> float:
        """Return probability of fraud (0-1)."""
        # stub: always low risk
        return 0.05
