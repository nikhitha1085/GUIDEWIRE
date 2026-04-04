const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { createClaim, getMyClaims, getClaimById } = require('../controllers/claimController');

router.use(authenticate);

router.post('/', createClaim);
router.get('/my', getMyClaims);
router.get('/:id', getClaimById);

module.exports = router;
