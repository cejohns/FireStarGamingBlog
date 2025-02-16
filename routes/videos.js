const express = require("express");
const router = express.Router();
const Video = require("../models/Video");

// GET /api/videos - Retrieve all videos
router.get("/", async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (err) {
        console.error("Error fetching videos:", err);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});



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
