const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Route to fetch analytics
router.get('/', async (req, res) => {
    try {
        const totalPosts = await Post.countDocuments();
        const totalComments = await Comment.countDocuments();
        const popularPosts = await Post.find().sort({ views: -1 }).limit(5);
        res.json({ totalPosts, totalComments, popularPosts });
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
