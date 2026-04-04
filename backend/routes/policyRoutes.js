const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createPolicy, getMyPolicies, renewPolicy, cancelPolicy } = require('../controllers/policyController');

router.use(authenticate);

router.post('/', createPolicy);
router.get('/my', getMyPolicies);
router.patch('/:id/renew', renewPolicy);
router.delete('/:id', cancelPolicy);

module.exports = router;
