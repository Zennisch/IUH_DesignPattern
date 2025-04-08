const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { initializeDatabase } = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Product Service is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});