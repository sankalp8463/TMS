// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Still need jwt here for token generation
const { authenticateToken } = require('../middleware/authMiddleware'); // Import the middleware

// --- Configuration (keep these for token generation in login) ---
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this_in_production';
const TOKEN_EXPIRATION = '1h'; // e.g., 1 hour

// --- Routes ---

// Register a new user
router.post('/register', async (req, res) => {
    console.log("Registering user:", req.body);
    const { name, email, password, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, phone });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        // The payload (id, email) will be accessible in req.user after authentication
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        res.status(200).json({ message: 'Login successful', token, role: user.role, name: user.name, email: user.email }); // Send token and role back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (Protected Route)
// Apply the `authenticateToken` middleware here
router.get('/users', authenticateToken, async (req, res) => {
    try {
        // req.user contains the decoded payload from the token
        // console.log("Authenticated user:", req.user);

        // You can add role-based authorization here if needed
        // For example, only admins can view all users:
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only administrators can view all users.' });
        }

        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;