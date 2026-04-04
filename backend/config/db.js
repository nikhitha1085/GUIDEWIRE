const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'protect_worker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDB = async () => {
  try {
    // We create a temporary connection without database selected to create the database if it doesn't exist
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'protect_worker'}\`;`);
    await connection.end();

    console.log('Database connected successfully.');

    // Create Workers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS workers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        aadhaar VARCHAR(12) UNIQUE NOT NULL,
        occupation VARCHAR(100) NOT NULL,
        zone VARCHAR(50) NOT NULL,
        weekly_income DECIMAL(10,2) NOT NULL,
        password VARCHAR(255) NOT NULL,
        lat DECIMAL(10,4),
        lon DECIMAL(10,4),
        location_name VARCHAR(100),
        vehicle VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safely add columns if the table already existed without them
    try { await pool.query('ALTER TABLE workers ADD COLUMN lat DECIMAL(10,4)'); } catch(e){}
    try { await pool.query('ALTER TABLE workers ADD COLUMN lon DECIMAL(10,4)'); } catch(e){}
    try { await pool.query('ALTER TABLE workers ADD COLUMN location_name VARCHAR(100)'); } catch(e){}
    try { await pool.query('ALTER TABLE workers ADD COLUMN vehicle VARCHAR(50)'); } catch(e){}

    // Create weather_notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS weather_notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        worker_id INT NOT NULL,
        risk_type VARCHAR(100) NOT NULL,
        temperature DECIMAL(5,2),
        weathercode INT,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
      )
    `);

    // Create Policies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        worker_id INT NOT NULL,
        policy_number VARCHAR(50) UNIQUE NOT NULL,
        coverage_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
      )
    `);

    // Create Premiums table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS premiums (
        id INT AUTO_INCREMENT PRIMARY KEY,
        policy_id INT NOT NULL,
        base_amount DECIMAL(10,2) NOT NULL,
        zone_risk_score DECIMAL(5,2) NOT NULL,
        weather_risk_score DECIMAL(5,2) NOT NULL,
        adjustment DECIMAL(10,2) NOT NULL,
        final_amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
      )
    `);

    // Create Claims table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS claims (
        id INT AUTO_INCREMENT PRIMARY KEY,
        worker_id INT NOT NULL,
        policy_id INT NOT NULL,
        claim_number VARCHAR(50) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        amount_requested DECIMAL(10,2) NOT NULL,
        amount_approved DECIMAL(10,2) DEFAULT 0.00,
        status ENUM('pending', 'auto_approved', 'manual_review', 'rejected', 'completed') DEFAULT 'pending',
        resolved_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
        FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
      )
    `);

    // Create Triggers Log table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS triggers_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        claim_id INT NOT NULL,
        trigger_name VARCHAR(100) NOT NULL,
        result BOOLEAN NOT NULL,
        detail VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE
      )
    `);

    // Seed Data
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM workers');
    if (rows[0].count < 10) { // re-seed if we don't have the 10 mock workers
      console.log('Seeding initial mock workers data...');
      
      // Clean up before seeding to avoid unique constraint issues
      await pool.query('SET FOREIGN_KEY_CHECKS = 0');
      await pool.query('TRUNCATE TABLE workers');
      await pool.query('TRUNCATE TABLE policies');
      await pool.query('SET FOREIGN_KEY_CHECKS = 1');

      const hpwd = await bcrypt.hash('123456', 10);
      
      const mockWorkers = [
        { name: 'Raj Kumar', phone: '9876543210', aadhaar:'111111111111', lat: 28.6139, lon: 77.2090, locationName: 'Delhi', vehicle: 'Motorcycle' },
        { name: 'Ramesh Singh', phone: '9876543211', aadhaar:'111111111112', lat: 19.0760, lon: 72.8777, locationName: 'Mumbai', vehicle: 'Scooter' },
        { name: 'Suresh Iyer', phone: '9876543212', aadhaar:'111111111113', lat: 13.0827, lon: 80.2707, locationName: 'Chennai', vehicle: 'Motorcycle' },
        { name: 'Amit Das', phone: '9876543213', aadhaar:'111111111114', lat: 22.5726, lon: 88.3639, locationName: 'Kolkata', vehicle: 'Bicycle' },
        { name: 'Karthik Gowda', phone: '9876543214', aadhaar:'111111111115', lat: 12.9716, lon: 77.5946, locationName: 'Bangalore', vehicle: 'Motorcycle' },
        { name: 'Mohammed Ali', phone: '9876543215', aadhaar:'111111111116', lat: 17.3850, lon: 78.4867, locationName: 'Hyderabad', vehicle: 'Scooter' },
        { name: 'Vikram Patel', phone: '9876543216', aadhaar:'111111111117', lat: 23.0225, lon: 72.5714, locationName: 'Ahmedabad', vehicle: 'Motorcycle' },
        { name: 'Manoj Tiwari', phone: '9876543217', aadhaar:'111111111118', lat: 26.8467, lon: 80.9462, locationName: 'Lucknow', vehicle: 'Bicycle' },
        { name: 'Ravi Verma', phone: '9876543218', aadhaar:'111111111119', lat: 21.1458, lon: 79.0882, locationName: 'Nagpur', vehicle: 'Motorcycle' },
        { name: 'Sanjay Gupta', phone: '9876543219', aadhaar:'111111111120', lat: 26.1420, lon: 91.7314, locationName: 'Guwahati', vehicle: 'Motorcycle' },
      ];

      for (let i = 0; i < mockWorkers.length; i++) {
        const w = mockWorkers[i];
        const [result] = await pool.query(
          'INSERT INTO workers (name, phone, aadhaar, occupation, zone, weekly_income, password, lat, lon, location_name, vehicle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [w.name, w.phone, w.aadhaar, 'delivery', 'medium', 2000, hpwd, w.lat, w.lon, w.locationName, w.vehicle]
        );
        
        await pool.query(
          'INSERT INTO policies (worker_id, policy_number, coverage_type, start_date, end_date, status) VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?)',
          [result.insertId, `PWK-2026-100${i}`, 'standard', 'active']
        );
      }
      
      console.log('Seed data inserted successfully.');
    }

  } catch (err) {
    console.error('Database connection or initialization failed:', err.message);
  }
};

module.exports = { pool, initDB };
