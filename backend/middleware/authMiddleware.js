// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// It's crucial to use an environment variable for your JWT secret in production.
// For example, in a .env file: JWT_SECRET=your_super_secret_key
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Handle specific JWT errors if needed, e.g., TokenExpiredError
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access Denied: Token expired' });
            }
            return res.status(403).json({ message: 'Access Denied: Invalid token' });
        }
        req.user = user; // Attach user payload (id, email) from token to the request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = { authenticateToken };