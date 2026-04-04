const express = require('express');
const router = express.Router();
const { getWorkersWithWeather, getNotifications, triggerPoll } = require('../controllers/weatherController');

router.get('/workers', getWorkersWithWeather);
router.get('/notifications', getNotifications);
router.post('/poll', triggerPoll);

module.exports = router;
