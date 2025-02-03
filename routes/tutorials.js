const express = require("express");
const router = express.Router();
const Tutorial = require("../models/Tutorials");

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

module.exports = router;
