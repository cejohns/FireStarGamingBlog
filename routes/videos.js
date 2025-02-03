const express = require("express");
const router = express.Router();
const Video = require("../models/Video");

// Upload a Video
router.post("/", async (req, res) => {
    const { title, videoUrl } = req.body;
    try {
        const newVideo = new Video({ title, videoUrl });
        await newVideo.save();
        res.status(201).json({ message: "Video uploaded successfully!", video: newVideo });
    } catch (err) {
        res.status(500).json({ error: "Failed to upload video" });
    }
});

// Approve a Video
router.put("/approve/:id", async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Video approved", video });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve video" });
    }
});

// Delete a Video
router.delete("/:id", async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete video" });
    }
});

module.exports = router;
