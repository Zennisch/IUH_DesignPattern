const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authenticate = require('./middlewares/auth');
const setupProxies = require('./routes/proxy');
const authRoutes = require('./routes/auth');
const logger = require('./middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {error: 'Too many requests, please try again later'}
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({status: 'UP'});
});

// Auth routes
app.use('/api/auth', authRoutes);

// Authentication middleware
app.use(authenticate);

// Setup service proxies
setupProxies(app);

// Error handling
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({error: 'Internal Server Error'});
});

// Start server
app.listen(PORT, () => {
    logger.info(`API Gateway running on port ${PORT}`);
    console.log(`API Gateway running on port ${PORT}`);
});