const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple mock authentication - replace with real auth in production
router.post('/login', (req, res) => {
    const {username, password} = req.body;

    // Demo credentials - replace with database validation
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign(
            {userId: 1, username, role: 'admin'},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        return res.json({token});
    }

    return res.status(401).json({error: 'Invalid credentials'});
});

module.exports = router;