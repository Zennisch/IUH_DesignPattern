const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const {initializeDatabase} = require('./db/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Order Service is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({status: 'UP'});
});

// Start server
app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});