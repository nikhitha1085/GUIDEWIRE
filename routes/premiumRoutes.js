const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { calculatePremium, getPremiumByPolicyId } = require('../controllers/premiumController');

router.use(authenticate);

router.post('/calculate', calculatePremium);
router.get('/:policy_id', getPremiumByPolicyId);

module.exports = router;
