const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to register user.', error: err.message });
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (err) {
        res.status(500).json({ message: 'Failed to log in.', error: err.message });
    }
});

module.exports = router;
