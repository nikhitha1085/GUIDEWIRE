from modules.payout import evaluate_payout


def test_evaluate_payout_trigger():
    conditions = {"temperature": 50, "wind_speed": 10, "aqi": 100}
    payout = evaluate_payout(conditions, 800)
    assert payout == 800


def test_no_payout():
    conditions = {"temperature": 30, "wind_speed": 10, "aqi": 100}
    payout = evaluate_payout(conditions, 800)
    assert payout == 0
