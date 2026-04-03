const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const register = async (req, res) => {
  try {
    const { name, phone, aadhaar, occupation, zone, weekly_income, password } = req.body;

    // Validation
    if (!name || !phone || !aadhaar || !occupation || !zone || !weekly_income || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check unique
    const [existing] = await pool.query('SELECT * FROM workers WHERE phone = ? OR aadhaar = ?', [phone, aadhaar]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Phone or Aadhaar already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert
    const [result] = await pool.query(
      'INSERT INTO workers (name, phone, aadhaar, occupation, zone, weekly_income, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone, aadhaar, occupation, zone, weekly_income, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.insertId, phone },
      process.env.JWT_SECRET || 'super_secret_protect_worker_key_123',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Worker registered successfully',
      token,
      user: { id: result.insertId, name, phone, occupation, zone }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required.' });
    }

    const [workers] = await pool.query('SELECT * FROM workers WHERE phone = ?', [phone]);
    if (workers.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const worker = workers[0];
    const isMatch = await bcrypt.compare(password, worker.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: worker.id, phone: worker.phone },
      process.env.JWT_SECRET || 'super_secret_protect_worker_key_123',
      { expiresIn: '30d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: worker.id, name: worker.name, phone: worker.phone, occupation: worker.occupation, zone: worker.zone }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

module.exports = { register, login };
