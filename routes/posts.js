const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// Validation middleware
// Middleware for validation
const validatePost = [
    body('title').isString().withMessage('Title must be a string'),
    body('summary').isString().withMessage('Summary must be a string'),
    body('content').isString().withMessage('Content must be a string'),
    body('category').isString().withMessage('Category must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];



// GET /api/posts - Retrieve all posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /api/posts/:id - Retrieve a specific post
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error('Error fetching post:', err.message);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});



// Add a new post
router.post('/', validatePost, async (req, res) => {
    const { title, summary, content, category } = req.body;

    try {
        const newPost = new Post({ title, summary, content, category });
        const savedPost = await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    } catch (err) {
        console.error('Error saving post:', err.message);
        res.status(500).json({ error: 'Failed to add post' });
    }
});

// Edit a post
router.put('/:id', validatePost, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, content, category } = req.body;
        
        const errors = validatePost(req);
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

// Approve a post
router.put("/approve/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!post) return res.status(404).json({ error: "Post not found" });

        res.json({ message: "Post approved", post });
    } catch (err) {
        console.error("Error approving post:", err);
        res.status(500).json({ error: "Failed to approve post" });
    }
});


module.exports = router;