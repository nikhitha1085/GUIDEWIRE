const axios = require('axios');
const { pool } = require('../config/db');
require('dotenv').config();

const calculatePremium = async (req, res) => {
  try {
    const { policy_id } = req.body;
    const worker_id = req.user.id;

    if (!policy_id) {
      return res.status(400).json({ message: 'Policy ID is required.' });
    }

    // Verify policy ownership and fetch worker info
    const [policies] = await pool.query('SELECT * FROM policies WHERE id = ? AND worker_id = ?', [policy_id, worker_id]);
    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found or unauthorized.' });
    }

    const [workers] = await pool.query('SELECT * FROM workers WHERE id = ?', [worker_id]);
    const worker = workers[0];

    // Call ML Microservice
    let mlResponse;
    try {
      const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(`${mlUrl}/predict`, {
        zone: worker.zone,
        occupation: worker.occupation,
        weekly_income: worker.weekly_income
      });
      mlResponse = response.data;
      /*
        Expected from ML:
        base_amount, zone_risk_score, weather_risk_score, adjustment, final_amount
      */
    } catch (mlError) {
      console.warn('ML Microservice is down or unreachable. Using fallback logic for demo.', mlError.message);
      
      // Fallback calculation if ML service is down
      const base_amount = 30;
      const zone_risk_score = worker.zone.toLowerCase() === 'high' ? 0.8 : (worker.zone.toLowerCase() === 'low' ? 0.2 : 0.5);
      const weather_risk_score = 0.4;
      const adjustment = zone_risk_score < 0.3 ? -2 : 0;
      const final_amount = base_amount + (zone_risk_score * 10) + (weather_risk_score * 10) + adjustment;
      
      mlResponse = {
        base_amount,
        zone_risk_score,
        weather_risk_score,
        adjustment,
        final_amount
      };
    }

    // Apply strict rule: If zone_risk_score < 0.3 -> subtract ₹2 (if ML didn't do it)
    if (mlResponse.zone_risk_score < 0.3 && mlResponse.adjustment === 0) {
      mlResponse.adjustment = -2;
      mlResponse.final_amount -= 2;
    }

    // Store premium record
    await pool.query(
      'INSERT INTO premiums (policy_id, base_amount, zone_risk_score, weather_risk_score, adjustment, final_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [policy_id, mlResponse.base_amount, mlResponse.zone_risk_score, mlResponse.weather_risk_score, mlResponse.adjustment, mlResponse.final_amount]
    );

    res.status(200).json({
      message: 'Premium calculated and saved.',
      breakdown: mlResponse
    });
  } catch (error) {
    console.error('Calculate Premium Error:', error);
    res.status(500).json({ message: 'Server error calculating premium.' });
  }
};

const getPremiumByPolicyId = async (req, res) => {
  try {
    const { policy_id } = req.params;
    const worker_id = req.user.id;

    const [policies] = await pool.query('SELECT * FROM policies WHERE id = ? AND worker_id = ?', [policy_id, worker_id]);
    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found or unauthorized.' });
    }

    const [premiums] = await pool.query('SELECT * FROM premiums WHERE policy_id = ? ORDER BY created_at DESC LIMIT 1', [policy_id]);
    
    if (premiums.length === 0) {
      return res.status(404).json({ message: 'No premium calculated for this policy yet.' });
    }

    res.status(200).json(premiums[0]);
  } catch (error) {
    console.error('Get Premium Error:', error);
    res.status(500).json({ message: 'Server error retrieving premium.' });
  }
};

module.exports = { calculatePremium, getPremiumByPolicyId };
