const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Skip authentication for specific routes
    const publicRoutes = ['/api/auth/login', '/health'];
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({error: 'Authentication required'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: 'Invalid or expired token'});
    }
};

module.exports = authenticate;