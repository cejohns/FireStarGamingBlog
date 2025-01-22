const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Fetch all comments
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

// Approve a comment
router.post('/approve', async (req, res) => {
    const { commentId } = req.body;
    try {
        const comment = await Comment.findByIdAndUpdate(commentId, { approved: true }, { new: true });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: "Failed to approve comment" });
    }
});

// Delete a comment
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Comment.findByIdAndDelete(id);
        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete comment" });
    }
});

module.exports = router;
