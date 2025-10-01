const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

// Validation middleware
// Middleware for validation
const validatePost = [
    body('title').isString().withMessage('Title must be a string'),
    body('author').isString().withMessage('Author must be a string'),
    body('summary').isString().withMessage('Summary must be a string'),
    body('content').isString().withMessage('Content must be a string'),
    body('category').isString().withMessage('Category must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log("📋 Validation results:", errors.array());
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
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 }},
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("Detail route error:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return post
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});

// POST /api/posts/:id/dislike
router.post('/:id/dislike', async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
  return post
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});


// Add a new post
router.post('/', validatePost, async (req, res) => {
    const { title,author, summary, content, category } = req.body;

    try {
        const newPost = new Post({ title, author, summary, content, category });
        const savedPost = await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    } catch (err) {
        console.error('Error saving post:', err.message);
        res.status(500).json({ error: 'Failed to add post' });
    }
});

// Edit a post
router.put('/:id', validatePost, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id); // ✅ You must define `post`
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        post.title = req.body.title;
        post.author = req.body.author;
        post.summary = req.body.summary;
        post.content = req.body.content;
        post.category = req.body.category;

        const updatedPost = await post.save();

        res.json({
            success: true,
            message: "Post updated successfully",
            post: updatedPost,
        });

    } catch (err) {
        console.error("❌ Error updating post:", err.message);
        res.status(500).json({
            error: "Failed to update post",
            message: err.message,
            stack: err.stack,
            name: err.name
        });
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

// ✅ Approve a blog post
router.put("/approve/:id", async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!post) return res.status(404).json({ error: "Post not found" });

        res.json({ message: "Post approved", post });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve post" });
    }
});

// ✅ Publish a blog post
router.put("/publish/:id", async (req, res) => {
    try {
        console.log(`Received publish request for Post ID: ${req.params.id}`);

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            console.error("Invalid Post ID:", req.params.id);
            return res.status(400).json({ error: "Invalid post ID" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            console.error("Post not found:", req.params.id);
            return res.status(404).json({ error: "Post not found" });
        }

        // ✅ Ensure `author` is not missing before updating
        if (!post.author) {
            console.error("Error: Author field is missing for post ID:", req.params.id);
            return res.status(400).json({ error: "Post must have an author before publishing." });
        }

        // ✅ Ensure author is not lost when updating
        post.published = true;
        post.publishedAt = new Date();
        await post.save();

        console.log("Post published successfully:", post);
        res.json({ message: "Post published successfully", post });
    } catch (err) {
        console.error("Unexpected error while publishing post:", err);
        res.status(500).json({ error: "Failed to publish post", details: err.message });
    }
});

// ✅ Get all published blog posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({ published: true });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

router.get("/view/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || !post.approved) {
            return res.status(404).send("Post not found or not approved");
        }

        res.sendFile(path.join(__dirname, "../public/post.html")); // Make sure this exists
    } catch (err) {
        res.status(500).send("Failed to load post");
    }
});


module.exports = router;