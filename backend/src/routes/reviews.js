const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateReview = [
    body("title").isString().withMessage("Title must be a string"),
    body('author').isString().withMessage('Author must be a string'),
    body("summary").isString().withMessage("Summary must be a string"),
    body("content").isString().withMessage("Content must be a string"),
    body("rating").isInt({ min: 0, max: 10 }).withMessage("Rating must be between 0 and 10"),
    body("category").isString().withMessage("Category must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// GET all reviews
router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});


// GET a single review by ID
router.get("/:id", async (req, res) => {
    try {
          const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
        if (!review) return res.status(404).json({ error: "Review not found" });

        res.status(200).json(review);
    } catch (err) {
        console.error("Error fetching review:", err);
        res.status(500).json({ error: "Failed to fetch review" });
    }
});

// POST /api/reviews/:id/like
router.post('/:id/like', async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return review
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});

// POST /api/reviews/:id/dislike
router.post('/:id/dislike', async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
  return review
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});


// POST a new review
router.post("/", validateReview, async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json({ message: "Review added!", review: newReview });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ error: "Failed to add review" });
    }
});

// PUT update a review
router.put("/:id", validateReview, async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReview) return res.status(404).json({ error: "Review not found" });
        res.json({ message: "Review updated successfully", review: updatedReview });
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ error: "Failed to update review" });
    }
});

// DELETE a review
router.delete("/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ error: "Failed to delete review" });
    }
});

// ✅ Ensure the approve route exists
router.put("/approve/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!review) return res.status(404).json({ error: "Review not found" });

        res.json({ message: "Review approved", review });
    } catch (err) {
        console.error("Error approving review:", err);
        res.status(500).json({ error: "Failed to approve review" });
    }
});

// ✅ Ensure the publish route exists
router.put("/publish/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        // ✅ Ensure `author` is present before publishing
        if (!review.author) {
            return res.status(400).json({ error: "Author is required to publish this review" });
        }

        // ✅ Set published status
        review.published = true;
        review.publishedAt = new Date();

        await review.save();

        res.json({
            message: "Review published successfully",
            review: {
                title: review.title,
                author: review.author,
                summary: review.summary,
                content: review.content,
                rating: review.rating,
                category: review.category,
                publishedAt: review.publishedAt
            }
        });
    } catch (err) {
        console.error("Error publishing review:", err);
        res.status(500).json({ error: "Failed to publish review" });
    }
});

const path = require("path");

// Serve public review page for approved reviews
router.get("/view/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review || !review.approved) {
            return res.status(404).send("Review not found or not approved");
        }

        // Serve the review.html file
        res.sendFile(path.join(__dirname, "../public/review.html"));
    } catch (err) {
        console.error("Error loading review page:", err.message);
        res.status(500).send("Failed to load review page");
    }
});


module.exports = router;
