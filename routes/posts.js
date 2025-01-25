const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validatePost = [
    body('title')
        .isString().withMessage('Title must be a string')
        .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long')
        .trim(),
    body('summary')
        .isString().withMessage('Summary must be a string')
        .isLength({ min: 10 }).withMessage('Summary must be at least 10 characters long')
        .trim(),
    body('content')
        .isString().withMessage('Content must be a string')
        .isLength({ min: 20 }).withMessage('Content must be at least 20 characters long')
        .trim(),
    body('category')
        .isString().withMessage('Category must be a string')
        .notEmpty().withMessage('Category is required')
        .trim()
];

// Fetch all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Add a new post
router.post('/', validatePost, async (req, res) => {
    try {
        console.log('Received post request:', req.body); // Debug log

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { title, summary, content, category } = req.body;
        
        // Additional validation
        if (!title || !summary || !content || !category) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                received: { title, summary, content, category }
            });
        }

        const newPost = new Post({ title, summary, content, category });
        console.log('Creating new post:', newPost); // Debug log
        
        const savedPost = await newPost.save();
        console.log('Post saved successfully:', savedPost); // Debug log
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: savedPost
        });
    } catch (err) {
        console.error('Error saving post:', err);
        res.status(500).json({ 
            error: 'Failed to add post. Please try again.',
            details: err.message 
        });
    }
});

// Edit a post
router.put('/:id', validatePost, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, category } = req.body;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, summary, content, category },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost
        });
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).json({ error: "Failed to update post" });
    }
});

// Delete a post
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);
        
        if (!deletedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

module.exports = router;