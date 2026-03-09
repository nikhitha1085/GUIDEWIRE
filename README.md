# 🛡️ AI-Powered Parametric Insurance for Gig Delivery Workers
### *Empowering India's Gig Economy against Climate & Environmental Disruptions*

## 📌 Project Overview
India's delivery partners (Swiggy, Zomato, Zepto, Amazon) are the backbone of the digital economy but face **20-30% income loss** due to external disruptions like heavy rain, extreme heat, or severe pollution. 

**Our Solution:** A "zero-touch" parametric insurance platform that triggers instant payouts based on real-time environmental data, ensuring financial stability for workers like Ramesh.

---

## 👤 Target Persona: The Urban Hero
* **Name:** Ramesh Kumar (28, Hyderabad)
* **Role:** Food Delivery Partner (Swiggy/Zomato)
* **Daily Earnings:** ₹700 – ₹1000
* **The Pain Point:** During heavy rain or "Severe" AQI levels, Ramesh loses ~5 hours of active work, leading to a direct loss of ₹300–₹500.
* **Persona Document:** [📄 View Detailed Persona PDF](./docs/Devtrails_TeamTech_Persona.pdf)

---

## ⚙️ How It Works: The Parametric Model
Unlike traditional insurance, this system requires **no claim filing**. It relies on **hard data triggers** from IoT and Weather APIs.

| Trigger Type | Metric / Parameter | Payout Logic |
| :--- | :--- | :--- |
| **Heavy Rainfall** | > 15mm in a 3-hour window | 50% Daily Coverage |
| **Extreme Heat** | Temp > 44°C for 3+ hours | 40% Daily Coverage |
| **Severe Pollution** | AQI > 400 (Severe category) | 30% Daily Coverage |



---

## 🧠 AI & Technical Architecture

### 1. Dynamic Risk Pricing (AI/ML)
We use a **Random Forest Regressor** to calculate the "Weekly Risk Score."
* **Inputs:** Historical weather patterns + Upcoming week's forecast + Worker's historical earnings.
* **Output:** A personalized weekly premium (₹10, ₹20, or ₹30).

### 2. Intelligent Fraud Detection
To satisfy the **Scale Phase** requirements:
* **GPS Validation:** Cross-references the worker's real-time coordinates with specific weather station data.
* **Activity Check:** AI verifies if the worker was "Online" on their delivery app during the disruption to prevent idle/fake claims.



---

## 📊 Weekly Pricing Model
*Aligned with the gig worker's weekly payout cycle.*

| Plan Type | Weekly Premium | Coverage Limit | Best For |
| :--- | :--- | :--- | :--- |
| **Basic** | ₹10 | ₹500 / week | Low-risk/Stable zones |
| **Standard** | ₹20 | ₹700 / week | Monsoon-heavy regions |
| **Premium** | ₹30 | ₹1,000 / week | High-pollution/Extreme heat zones |

---

## 🛠️ Technology Stack
* **Frontend:** React.js (Mobile-responsive UI)
* **Backend:** Spring Boot (Java)
* **Database:** MySQL (User Profiles & Policy Logs)
* **AI/ML Engine:** Python (Scikit-Learn)
* **APIs:** * *OpenWeather API* (Rainfall/Temp data)
    * *AQICN API* (Pollution/Air Quality)
    * *Razorpay Sandbox* (Simulated Instant Payouts)

---

## 🚀 System Workflow
1. **Onboarding:** Worker registers and selects a weekly plan.
2. **Risk Analysis:** AI calculates the premium based on the worker's city/zone.
3. **Monitoring:** System runs an hourly cron job to fetch API data for active disruption zones.
4. **Auto-Trigger:** If the threshold (e.g., 20mm rain) is hit, the system identifies all covered workers in that Geo-fence.
5. **Instant Payout:** Payment is pushed to the worker's linked UPI/Wallet via Mock API.

---

## 📅 Roadmap (DEVTrails Phases)
- [x] **Phase 1 (Seed):** Ideation, Persona, and Architecture.
- [ ] **Phase 2 (Scale):** Developing AI Pricing Engine & Spring Boot CRUDs.
- [ ] **Phase 3 (Soar):** Integrating Weather APIs & Fraud Detection Logic.
