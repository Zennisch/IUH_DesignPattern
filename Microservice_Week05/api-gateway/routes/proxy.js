const {createProxyMiddleware} = require('http-proxy-middleware');
const logger = require('../middlewares/logger');

// Proxy configuration for services
const setupProxies = (app) => {
    // Product service routes
    app.use(
        '/api/products',
        createProxyMiddleware({
            target: process.env.PRODUCT_SERVICE_URL,
            pathRewrite: {'^/api/products': '/products'},
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                logger.info(`Proxying request to Product Service: ${req.method} ${req.path}`);
            },
            onError: (err, req, res) => {
                logger.error(`Proxy error: ${err.message}`);
                res.status(500).json({error: 'Service unavailable'});
            },
        })
    );

    // Order service routes
    app.use(
        '/api/orders',
        createProxyMiddleware({
            target: process.env.ORDER_SERVICE_URL,
            pathRewrite: {'^/api/orders': '/orders'},
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                logger.info(`Proxying request to Order Service: ${req.method} ${req.path}`);
            },
            onError: (err, req, res) => {
                logger.error(`Proxy error: ${err.message}`);
                res.status(500).json({error: 'Service unavailable'});
            },
        })
    );

    // Customer service routes
    app.use(
        '/api/customers',
        createProxyMiddleware({
            target: process.env.CUSTOMER_SERVICE_URL,
            pathRewrite: {'^/api/customers': '/customers'},
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                logger.info(`Proxying request to Customer Service: ${req.method} ${req.path}`);
            },
            onError: (err, req, res) => {
                logger.error(`Proxy error: ${err.message}`);
                res.status(500).json({error: 'Service unavailable'});
            },
        })
    );

    app.use(
        '/api/inventory',
        createProxyMiddleware({
            target: process.env.INVENTORY_SERVICE_URL,
            pathRewrite: {'^/api/inventory': '/inventory'},
            changeOrigin: true,
            onProxyReq: (proxyReq, req, res) => {
                logger.info(`Proxying request to Inventory Service: ${req.method} ${req.path}`);
            },
            onError: (err, req, res) => {
                logger.error(`Proxy error: ${err.message}`);
                res.status(500).json({error: 'Service unavailable'});
            },
        })
    );
};

module.exports = setupProxies;
