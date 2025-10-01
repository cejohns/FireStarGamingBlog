const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Subscribe to the newsletter
router.post('/subscribe', async (req, res) => {
    const { email, frequency } = req.body;
    try {
        const subscriber = new Subscriber({ email, frequency });
        await subscriber.save();
        res.status(201).json({ message: 'Subscription successful!' });
    } catch (err) {
        res.status(400).json({ message: 'Failed to subscribe.', error: err.message });
    }
});

module.exports = router;
