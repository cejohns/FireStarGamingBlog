// routes/comments.js
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// PUT /comments/approve/:id → mark approved
router.put('/approve/:id', async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Comment not found' });
    res.json(updated);
  } catch (err) {
    console.error('Approve comment error:', err);
    res.status(500).json({ error: 'Failed to approve comment' });
  }
});

// DELETE /comments/:id → remove comment
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

module.exports = router;
