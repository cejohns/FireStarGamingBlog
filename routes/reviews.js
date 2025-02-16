const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { body, validationResult } = require("express-validator");

// Validation middleware
const validateReview = [
    body("title").isString().withMessage("Title must be a string"),
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
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.status(200).json(review);
    } catch (err) {
        console.error("Error fetching review:", err);
        res.status(500).json({ error: "Failed to fetch review" });
    }
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

module.exports = router;
