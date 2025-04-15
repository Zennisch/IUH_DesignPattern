const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');
const { initializeDatabase } = require('./db/db');
const messageConsumer = require('./messaging/consumer');
const messagePublisher = require('./messaging/publisher');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3004;

// Initialize database
initializeDatabase();

// Initialize messaging
messageConsumer.initialize();
messagePublisher.initialize();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/inventory', inventoryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('Inventory Service is running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  
  // Close RabbitMQ connections
  await messageConsumer.close();
  await messagePublisher.close();
  
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory Service running on port ${PORT}`);
});