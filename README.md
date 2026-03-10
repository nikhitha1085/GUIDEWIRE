# 🛡️ AI-Powered Parametric Insurance for India's Gig Economy

### Empowering Gig Delivery Workers Against Climate & Environmental Disruptions

This repository contains a prototype demonstrating an **AI-enabled parametric insurance platform** designed to protect gig workers (delivery partners, riders, etc.) against income loss caused by external disruptions such as **extreme weather, pollution, or natural disasters**.

---

# 📌 Problem Overview

India's gig delivery workforce (Swiggy, Zomato, Zepto, Amazon etc.) forms the backbone of the digital economy but faces major financial risks.

* Gig workers earn **daily or weekly income with no safety net**
* Weather events can reduce working hours by **20–30%**
* Income loss during heavy rain, heat waves, or pollution can reach **₹300–₹500 per day**
* Existing insurance covers **health, life, accidents, or vehicles** — **not income protection**

---

# 💡 Solution Highlights

Our platform introduces **Parametric Insurance** where payouts are automatically triggered based on **real-time environmental data**.

Key features:

* **Automatic payouts** when weather or pollution thresholds are crossed
* **Weekly pricing model** aligned with gig worker pay cycles
* **AI-enabled fraud detection**
* **Risk-based premium calculation using ML**
* Lightweight **FastAPI backend prototype**

---

# 👤 Target Persona: The Urban Hero

**Name:** Ramesh Kumar
**Age:** 28
**City:** Hyderabad
**Role:** Food Delivery Partner (Swiggy / Zomato)

**Daily Earnings:** ₹700 – ₹1000

**Problem:**
During heavy rain or severe AQI conditions, Ramesh loses about **5 working hours**, resulting in **₹300–₹500 income loss**.

---

# ⚙️ How Parametric Insurance Works

Unlike traditional insurance, this system requires **no claim filing**.

It uses **external data triggers** from weather and pollution APIs.

| Trigger Type     | Metric             | Payout Logic       |
| ---------------- | ------------------ | ------------------ |
| Heavy Rainfall   | > 15 mm in 3 hours | 50% daily coverage |
| Extreme Heat     | Temperature > 44°C | 40% daily coverage |
| Severe Pollution | AQI > 400          | 30% daily coverage |

Once the trigger is detected, **payout is automatically executed**.

---

# 🧠 AI & Technical Architecture

## 1️⃣ Dynamic Risk Pricing (Machine Learning)

A **Random Forest Regressor** calculates a **Weekly Risk Score**.

**Inputs**

* Historical weather patterns
* Weekly weather forecasts
* Worker income history

**Output**

* Personalized weekly premium (₹10 / ₹20 / ₹30)

---

## 2️⃣ Fraud Detection System

To prevent fraudulent claims:

* **GPS validation** verifies the worker’s location with weather station data
* **Activity validation** checks if the worker was active on the delivery platform during the disruption

---

# 📊 Weekly Pricing Model

| Plan     | Weekly Premium | Coverage Limit | Best For                    |
| -------- | -------------- | -------------- | --------------------------- |
| Basic    | ₹10            | ₹500           | Low-risk zones              |
| Standard | ₹20            | ₹700           | Monsoon regions             |
| Premium  | ₹30            | ₹1000          | High pollution / heat zones |

---

# 📂 Project Structure

```
ai_insurance/
├── app.py                      # Main FastAPI application
├── requirements.txt            # Dependencies
├── README.md
├── modules/
│   ├── pricing.py              # Weekly pricing logic
│   ├── payout.py               # Parametric payout calculations
│   ├── fraud_detection.py      # Fraud detection heuristics
│   ├── weather_service.py      # Weather / pollution data API
│   └── models.py               # ML models (fraud, risk scoring)
└── tests/
    ├── test_pricing.py
    ├── test_payout.py
    └── test_fraud_detection.py
```

---

# 🛠 Technology Stack

**Backend:** FastAPI / Spring Boot
**Frontend:** React.js
**Database:** MySQL
**AI/ML:** Python (Scikit-Learn)
**APIs:**

* OpenWeather API (Weather data)
* AQICN API (Air quality)
* Razorpay Sandbox (Simulated payouts)

---

# 🚀 Getting Started

## 1️⃣ Create Virtual Environment

```
python -m venv venv
```

Activate it:

```
venv\Scripts\activate
```

---

## 2️⃣ Install Dependencies

```
pip install -r requirements.txt
```

---

## 3️⃣ Run the Application

```
cd ai_insurance
uvicorn app:app --reload
```

Open API documentation:

```
http://localhost:8000/docs
```

---

# 🔄 System Workflow

1. Worker registers and selects a weekly insurance plan
2. AI calculates personalized premium based on risk score
3. System continuously monitors weather & pollution data
4. When disruption threshold is triggered
5. Automatic payout is credited to worker wallet

---

# 📅 DEVTrails Development Roadmap

* ✅ Phase 1 — Ideation & Architecture
* 🔄 Phase 2 — AI Pricing Engine
* 🔄 Phase 3 — Weather API Integration
* 🔄 Phase 4 — Fraud Detection System
* 🔄 Phase 5 — Mobile UI & Smart Contract payouts

---

# 🌍 Future Enhancements

* Real-time IoT weather feeds
* Blockchain smart-contract payouts
* Mobile app for gig workers
* Advanced ML risk models
* Integration with delivery platforms

---

# 👥 Team Collaboration

Git branch workflow:

```
main
 └── dev
      ├── feature-pricing
      ├── feature-fraud-detection
      ├── feature-weather-api
      └── feature-payout-system
```

Each team member works on a **feature branch** and merges into **dev** via Pull Request.

---
