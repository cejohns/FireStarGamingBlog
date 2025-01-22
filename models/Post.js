const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const router = express.Router();

// Validation rules for creating a new post
router.post(
    '/create',
    [
        // Validation and sanitization for the title
        body('title')
            .isString().withMessage('Title must be a string')
            .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long')
            .trim().escape(),

        // Validation and sanitization for the summary
        body('summary')
            .isString().withMessage('Summary must be a string')
            .isLength({ min: 10 }).withMessage('Summary must be at least 10 characters long')
            .trim().escape(),

        // Validation and sanitization for the content
        body('content')
            .isString().withMessage('Content must be a string')
            .isLength({ min: 20 }).withMessage('Content must be at least 20 characters long')
            .trim().escape(),
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new post if validation passes
        const { title, summary, content } = req.body;

        try {
            const newPost = new Post({ title, summary, content });
            await newPost.save();
            res.status(201).json({ message: 'Post created successfully', post: newPost });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error. Could not create post.' });
        }
    }
);

module.exports = router;
