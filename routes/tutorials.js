const express = require("express");
const router = express.Router();
const Tutorial = require("../models/Tutorials");


// GET /api/tutorials - Retrieve all tutorials
router.get("/", async (req, res) => {
    try {
        const tutorials = await Tutorial.find();
        res.status(200).json(tutorials);
    } catch (err) {
        console.error("Error fetching tutorials:", err);
        res.status(500).json({ error: "Failed to fetch tutorials" });
    }
});

// Create a Tutorial
router.post("/", async (req, res) => {
    const { title, summary, content, category } = req.body;
    try {
        const newTutorial = new Tutorial({ title, summary, content, category });
        await newTutorial.save();
        res.status(201).json({ message: "Tutorial added!", tutorial: newTutorial });
    } catch (err) {
        res.status(500).json({ error: "Failed to add tutorial" });
    }
});

// Approve a Tutorial
router.put("/approve/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Tutorial approved", tutorial });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve tutorial" });
    }
});

// Delete a Tutorial
router.delete("/:id", async (req, res) => {
    try {
        await Tutorial.findByIdAndDelete(req.params.id);
        res.json({ message: "Tutorial deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete tutorial" });
    }
});

router.put("/publish/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, { published: true }, { new: true });
        if (!tutorial) return res.status(404).json({ error: "Tutorial not found" });

        res.json({ message: "Tutorial published", tutorial });
    } catch (err) {
        console.error("Error publishing tutorial:", err);
        res.status(500).json({ error: "Failed to publish tutorial" });
    }
});


// ✅ Approve a tutorial
router.put("/approve/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        if (!tutorial) return res.status(404).json({ error: "Tutorial not found" });

        res.json({ message: "Tutorial approved", tutorial });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve tutorial" });
    }
});

// ✅ Publish a tutorial
router.put("/publish/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id);
        if (!tutorial) return res.status(404).json({ error: "Tutorial not found" });

        tutorial.published = true;
        tutorial.publishedAt = new Date();
        await tutorial.save();

        res.json({ message: "Tutorial published successfully", tutorial });
    } catch (err) {
        res.status(500).json({ error: "Failed to publish tutorial" });
    }
});

// ✅ Get all published tutorials
router.get("/", async (req, res) => {
    try {
        const tutorials = await Tutorial.find({ published: true });
        res.json(tutorials);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tutorials" });
    }
});


module.exports = router;
