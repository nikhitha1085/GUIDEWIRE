from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from modules.weather_service import get_current_conditions
from modules.pricing import compute_weekly_premium
from modules.payout import evaluate_payout
from modules.fraud_detection import simple_rule_check, FraudModel

app = FastAPI(title="Gig Worker Parametric Insurance API")


class QuoteRequest(BaseModel):
    avg_weekly_income: float
    location: str
    weather_risk: str  # low, medium, high


class PayoutRequest(BaseModel):
    policy_id: str
    avg_weekly_income: float
    claimed_income_loss: float
    location: str


@app.post("/quote")
def quote(req: QuoteRequest):
    q = compute_weekly_premium(req.avg_weekly_income, req.weather_risk)
    return {"premium": q.premium, "details": q._asdict()}


@app.post("/trigger")
def trigger_payout(req: PayoutRequest):
    # check fraud first
    if simple_rule_check(req.dict()):
        return {"status": "rejected", "reason": "suspicious claim"}
    fraud_model = FraudModel()
    score = fraud_model.predict(req.dict())
    if score > 0.5:
        return {"status": "rejected", "reason": "fraud risk high", "score": score}

    conditions = get_current_conditions(req.location)
    payout_amount = evaluate_payout(conditions, req.avg_weekly_income)
    if payout_amount <= 0:
        return {"status": "no_payout", "conditions": conditions}
    return {"status": "approved", "payout": payout_amount, "conditions": conditions}
