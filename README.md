# AI-Powered Parametric Insurance for India's Gig Economy

This repository contains a prototype demonstrating an **AI-enabled parametric insurance platform** designed to protect gig workers (delivery partners, riders, etc.) against income loss due to external disruptions (e.g., extreme weather, pollution, natural disasters).

## Problem Overview

- Gig workers earn on a weekly basis, with no safety net for uncontrollable events.
- External disruptions can reduce working hours by 20–30% and depress income.
- Existing insurance products focus on health, life, accidental or vehicle damage — **not income protection**.

## Solution Highlights

- **Parametric coverage**: payouts automatically triggered by external data (weather, pollution) hitting predefined thresholds.
- **Weekly pricing model** to match typical earning cycles.
- **AI-enabled fraud detection** to guard against false claims.
- Lightweight Python backend (FastAPI) serving as demonstration.

## Project Structure

```
ai_insurance/
├── app.py                      # Main FastAPI application
├── requirements.txt            # Dependencies
├── README.md
├── modules/
│   ├── pricing.py              # Weekly pricing logic
│   ├── payout.py               # Parametric payout calculations
│   ├── fraud_detection.py      # Basic fraud detection heuristics
│   ├── weather_service.py      # External disruption data source
│   └── models.py               # Placeholder ML models (fraud, risk)
└── tests/
    ├── test_pricing.py
    ├── test_payout.py
    └── test_fraud_detection.py
```

## Getting Started

1. Create a virtual environment (e.g., `python -m venv venv`).
2. Activate and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   cd ai_insurance
   uvicorn app:app --reload
   ```
4. Access API docs at `http://localhost:8000/docs`.

## Next Steps

- Tie in with real external APIs (weather, pollution) or IoT feeds.
- Develop ML models for pricing, risk scoring and fraud detection.
- Integrate with blockchain/smart-contracts for transparent payout execution.
- Add a frontend or mobile UI for gig partners to purchase and track policies.

# Example Usage

# example once you know the ID, e.g. 2
from vscode import get_terminal_output
print(get_terminal_output(id="2"))
