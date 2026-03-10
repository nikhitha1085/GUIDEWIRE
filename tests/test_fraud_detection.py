from modules.fraud_detection import simple_rule_check


def test_fraud_rule():
    claim = {"avg_weekly_income": 500, "claimed_income_loss": 2000}
    assert simple_rule_check(claim) is True

    claim2 = {"avg_weekly_income": 500, "claimed_income_loss": 400}
    assert simple_rule_check(claim2) is False
