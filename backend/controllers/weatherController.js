const { pool } = require('../config/db');
const { pollWeatherForAllWorkers } = require('../services/weatherService');

const getWorkersWithWeather = async (req, res) => {
  try {
    const [workers] = await pool.query('SELECT id, name, location_name, lat, lon, vehicle, phone FROM workers WHERE lat IS NOT NULL AND lon IS NOT NULL');
    res.json({ workers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(`
      SELECT wn.*, w.name as workerName, w.location_name as location 
      FROM weather_notifications wn
      JOIN workers w ON wn.worker_id = w.id
      ORDER BY wn.created_at DESC
      LIMIT 100
    `);
    
    // Map to frontend expected format
    const mapped = notifications.map(n => ({
      id: n.id,
      workerId: n.worker_id,
      workerName: n.workerName,
      location: n.location,
      riskType: n.risk_type,
      temperature: n.temperature,
      weathercode: n.weathercode,
      message: n.message,
      read: n.is_read,
      timestamp: new Date(n.created_at).getTime()
    }));

    res.json({ notifications: mapped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const triggerPoll = async (req, res) => {
  try {
    await pollWeatherForAllWorkers();
    res.json({ success: true, message: 'Weather poll completed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getWorkersWithWeather, getNotifications, triggerPoll };
