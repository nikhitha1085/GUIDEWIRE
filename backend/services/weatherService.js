const { pool } = require('../config/db');

const pollWeatherForAllWorkers = async () => {
  try {
    const [workers] = await pool.query('SELECT id, name, location_name, lat, lon FROM workers WHERE lat IS NOT NULL AND lon IS NOT NULL');
    if (!workers.length) return;

    // Fetch open-meteo in parallel (open-meteo can fail with bulk arrays, so we use Promise.all)
    const promises = workers.map(w => 
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${w.lat}&longitude=${w.lon}&current_weather=true`)
        .then(res => res.json())
        .catch(err => {
          console.error(`Failed to fetch weather for worker ${w.id}`, err);
          return null;
        })
    );

    const results = await Promise.all(promises);

    for (let i = 0; i < workers.length; i++) {
      const data = results[i];
      const workerWeather = data?.current_weather;
      if (!workerWeather) continue;

      const isHot = workerWeather.temperature >= 35;
      const isStormy = workerWeather.weathercode >= 61;

      if (isHot || isStormy) {
        const riskType = isHot ? 'Severe Heat' : 'Heavy Rainfall & Hazards';
        const surgeAmount = isHot ? '₹80' : '₹150';
        const message = `Weather Surge Active! Hello ${workers[i].name}, ${riskType.toLowerCase()} detected at your current GPS location (${workers[i].location_name}). Your surge trigger amount of +${surgeAmount} is now active for upcoming assignments.`;

        // Check if a similar notification already exists in the last 30 minutes to avoid spam scaling
        const [existing] = await pool.query(
          'SELECT id FROM weather_notifications WHERE worker_id = ? AND risk_type = ? AND created_at >= NOW() - INTERVAL 30 MINUTE',
          [workers[i].id, riskType]
        );

        if (existing.length === 0) {
          await pool.query(
            'INSERT INTO weather_notifications (worker_id, risk_type, temperature, weathercode, message) VALUES (?, ?, ?, ?, ?)',
            [workers[i].id, riskType, workerWeather.temperature, workerWeather.weathercode, message]
          );
        }
      }
    }
  } catch (err) {
    console.error('Weather Background Polling Error:', err.message);
  }
};

module.exports = { pollWeatherForAllWorkers };
