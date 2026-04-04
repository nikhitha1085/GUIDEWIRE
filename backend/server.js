const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const policyRoutes = require('./routes/policyRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const claimRoutes = require('./routes/claimRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/claims', claimRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Protect Worker API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
