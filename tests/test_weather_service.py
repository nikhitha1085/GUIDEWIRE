import random
from modules.weather_service import get_current_conditions

def test_current_conditions_structure(monkeypatch):
    # force deterministic values from random functions
    monkeypatch.setattr(random, "uniform", lambda a, b: a)
    monkeypatch.setattr(random, "randint", lambda a, b: a)

    cond = get_current_conditions("test-location")
    # ensure required keys exist
    assert set(cond.keys()) >= {"timestamp", "location", "temperature", "wind_speed", "aqi"}
    assert cond["location"] == "test-location"
    assert cond["temperature"] == 20  # monkeypatched to return a
    assert cond["wind_speed"] == 5    # monkeypatched to return a
    assert cond["aqi"] == 50          # monkeypatched to return a


def test_temperature_range():
    # call multiple times to ensure range
    for _ in range(5):
        cond = get_current_conditions("x")
        assert 20 <= cond["temperature"] <= 40
        assert 5 <= cond["wind_speed"] <= 60
        assert 50 <= cond["aqi"] <= 500