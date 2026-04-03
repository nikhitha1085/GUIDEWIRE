const { pool } = require('../config/db');
const generateClaimNumber = require('../utils/generateClaimNumber');
const { runTriggers } = require('../utils/mockTriggers');

const createClaim = async (req, res) => {
  try {
    const { policy_id, description, amount_requested } = req.body;
    const worker_id = req.user.id;

    if (!policy_id || !description || !amount_requested) {
      return res.status(400).json({ message: 'Policy ID, description, and amount requested are required.' });
    }

    // Verify policy
    const [policies] = await pool.query('SELECT * FROM policies WHERE id = ? AND worker_id = ? AND status = "active"', [policy_id, worker_id]);
    if (policies.length === 0) {
      return res.status(400).json({ message: 'Active policy not found or unauthorized.' });
    }

    // Fetch worker details for triggers
    const [workers] = await pool.query('SELECT * FROM workers WHERE id = ?', [worker_id]);
    const worker = workers[0];

    const claimNumber = generateClaimNumber();

    // Save claim initially as pending
    const [result] = await pool.query(
      'INSERT INTO claims (worker_id, policy_id, claim_number, description, amount_requested, status) VALUES (?, ?, ?, ?, ?, ?)',
      [worker_id, policy_id, claimNumber, description, amount_requested, 'pending']
    );
    const claim_id = result.insertId;

    // Run Oracle zero-touch triggers
    const { logs, firedCount } = await runTriggers(worker, description);

    // Save logs in triggers_log table
    for (const log of logs) {
      await pool.query(
        'INSERT INTO triggers_log (claim_id, trigger_name, result, detail) VALUES (?, ?, ?, ?)',
        [claim_id, log.trigger_name, log.result, log.detail]
      );
    }

    let finalStatus = 'manual_review';
    let amountApproved = 0.00;
    let resolvedAt = null;

    // Automation rule: If 3 or more triggers fire, auto-approve
    if (firedCount >= 3) {
      finalStatus = 'auto_approved';
      amountApproved = amount_requested;
      resolvedAt = new Date();
      console.log(`\n========================================`);
      console.log(`✅ [PAYOUT INITIATED] Claim ${claimNumber}`);
      console.log(`Amount: ₹${amountApproved} to Worker ${worker_id} (${worker.name})`);
      console.log(`========================================\n`);
    }

    // Update claim with final judgment
    await pool.query(
      'UPDATE claims SET status = ?, amount_approved = ?, resolved_at = ? WHERE id = ?',
      [finalStatus, amountApproved, resolvedAt ? new Date() : null, claim_id]
    );

    res.status(201).json({
      message: 'Claim processed via Zero-Touch Automation.',
      claim_id,
      claim_number: claimNumber,
      decision: finalStatus,
      triggers_fired: firedCount
    });
  } catch (error) {
    console.error('Create Claim Error:', error);
    res.status(500).json({ message: 'Server error processing claim.' });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const worker_id = req.user.id;
    const [claims] = await pool.query('SELECT * FROM claims WHERE worker_id = ? ORDER BY created_at DESC', [worker_id]);
    res.status(200).json(claims);
  } catch (error) {
    console.error('Get Claims Error:', error);
    res.status(500).json({ message: 'Server error fetching claims.' });
  }
};

const getClaimById = async (req, res) => {
  try {
    const { id } = req.params;
    const worker_id = req.user.id;

    // Get claim details
    const [claims] = await pool.query('SELECT * FROM claims WHERE id = ? AND worker_id = ?', [id, worker_id]);
    if (claims.length === 0) {
      return res.status(404).json({ message: 'Claim not found or unauthorized.' });
    }

    // Get trigger logs for this claim
    const [logs] = await pool.query('SELECT * FROM triggers_log WHERE claim_id = ? ORDER BY id ASC', [id]);

    const claimData = claims[0];
    claimData.triggers = logs;

    res.status(200).json(claimData);
  } catch (error) {
    console.error('Get Claim Detail Error:', error);
    res.status(500).json({ message: 'Server error fetching claim detail.' });
  }
};

module.exports = { createClaim, getMyClaims, getClaimById };
