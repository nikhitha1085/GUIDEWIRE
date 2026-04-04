const { pool } = require('../config/db');
const generatePolicyNumber = require('../utils/generatePolicyNumber');

const createPolicy = async (req, res) => {
  try {
    const { coverage_type } = req.body;
    const worker_id = req.user.id;

    if (!coverage_type) {
      return res.status(400).json({ message: 'Coverage type is required.' });
    }

    const policyNumber = generatePolicyNumber();

    const [result] = await pool.query(
      'INSERT INTO policies (worker_id, policy_number, coverage_type, start_date, end_date, status) VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?)',
      [worker_id, policyNumber, coverage_type, 'active']
    );

    res.status(201).json({
      message: 'Policy created successfully.',
      policy_id: result.insertId,
      policy_number: policyNumber
    });
  } catch (error) {
    console.error('Create Policy Error:', error);
    res.status(500).json({ message: 'Server error creating policy.' });
  }
};

const getMyPolicies = async (req, res) => {
  try {
    const worker_id = req.user.id;
    const [policies] = await pool.query('SELECT * FROM policies WHERE worker_id = ? ORDER BY created_at DESC', [worker_id]);
    res.status(200).json(policies);
  } catch (error) {
    console.error('Get Policies Error:', error);
    res.status(500).json({ message: 'Server error fetching policies.' });
  }
};

const renewPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const worker_id = req.user.id;

    // Check ownership
    const [policies] = await pool.query('SELECT * FROM policies WHERE id = ? AND worker_id = ?', [id, worker_id]);
    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found or unauthorized.' });
    }

    await pool.query(
      "UPDATE policies SET status = 'active', end_date = DATE_ADD(end_date, INTERVAL 1 YEAR) WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: 'Policy renewed successfully.' });
  } catch (error) {
    console.error('Renew Policy Error:', error);
    res.status(500).json({ message: 'Server error renewing policy.' });
  }
};

const cancelPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const worker_id = req.user.id;

    // Check ownership
    const [policies] = await pool.query('SELECT * FROM policies WHERE id = ? AND worker_id = ?', [id, worker_id]);
    if (policies.length === 0) {
      return res.status(404).json({ message: 'Policy not found or unauthorized.' });
    }

    await pool.query(
      "UPDATE policies SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: 'Policy marked as cancelled.' });
  } catch (error) {
    console.error('Cancel Policy Error:', error);
    res.status(500).json({ message: 'Server error cancelling policy.' });
  }
};

module.exports = { createPolicy, getMyPolicies, renewPolicy, cancelPolicy };
