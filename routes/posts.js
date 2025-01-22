const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Add a new post
router.post('/', async (req, res) => {
    const { title, summary, content } = req.body;
    try {
        const newPost = new Post({ title, summary, content });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: "Failed to add post" });
    }
});

// Edit a post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, summary, content } = req.body;
    try {
        const updatedPost = await Post.findByIdAndUpdate(id, { title, summary, content }, { new: true });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: "Failed to update post" });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);
        res.json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = router;
