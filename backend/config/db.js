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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    if (rows[0].count === 0) {
      console.log('Seeding initial data...');
      const hpwd = await bcrypt.hash('123456', 10);
      
      const [w1] = await pool.query(
        'INSERT INTO workers (name, phone, aadhaar, occupation, zone, weekly_income, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Ramesh Kumar', '9999999999', '123456789012', 'construction', 'low', 2000, hpwd]
      );
      
      const [w2] = await pool.query(
        'INSERT INTO workers (name, phone, aadhaar, occupation, zone, weekly_income, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['Suresh Singh', '8888888888', '987654321098', 'agriculture', 'high', 1500, hpwd]
      );

      // Seed policies
      await pool.query(
        'INSERT INTO policies (worker_id, policy_number, coverage_type, start_date, end_date, status) VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?)',
        [w1.insertId, 'PWK-2026-10001', 'standard', 'active']
      );

      await pool.query(
        'INSERT INTO policies (worker_id, policy_number, coverage_type, start_date, end_date, status) VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 YEAR), ?)',
        [w2.insertId, 'PWK-2026-10002', 'premium', 'active']
      );
      console.log('Seed data inserted successfully.');
    }

  } catch (err) {
    console.error('Database connection or initialization failed:', err.message);
  }
};

module.exports = { pool, initDB };
