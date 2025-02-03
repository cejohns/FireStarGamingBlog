const express = require("express");
const router = express.Router();
const Review = require("../models/Reviews");

// Create a Review
router.post("/", async (req, res) => {
    const { title, summary, content, rating, category } = req.body;
    try {
        const newReview = new Review({ title, summary, content, rating, category });
        await newReview.save();
        res.status(201).json({ message: "Review added!", review: newReview });
    } catch (err) {
        res.status(500).json({ error: "Failed to add review" });
    }
});

// Approve a Review
router.put("/approve/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Review approved", review });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve review" });
    }
});

// Delete a Review
router.delete("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete review" });
    }
});

module.exports = router;
