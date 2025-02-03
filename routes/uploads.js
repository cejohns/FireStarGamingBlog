const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({ storage: storage });

// Upload Image for Gallery
router.post("/image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ message: "Image uploaded successfully", imageUrl: `/uploads/${req.file.filename}` });
});

// Upload Video
router.post("/video", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ message: "Video uploaded successfully", videoUrl: `/uploads/${req.file.filename}` });
});

// Update Image Details
router.put("/image/:id", async (req, res) => {
    try {
        const { title } = req.body;
        const updatedImage = await Gallery.findByIdAndUpdate(req.params.id, { title }, { new: true });

        if (!updatedImage) return res.status(404).json({ error: "Image not found" });

        res.json({ message: "Image updated successfully", updatedImage });
    } catch (err) {
        console.error("Error updating image:", err);
        res.status(500).json({ error: "Failed to update image" });
    }
});

// Update Video Details
router.put("/video/:id", async (req, res) => {
    try {
        const { title } = req.body;
        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, { title }, { new: true });

        if (!updatedVideo) return res.status(404).json({ error: "Video not found" });

        res.json({ message: "Video updated successfully", updatedVideo });
    } catch (err) {
        console.error("Error updating video:", err);
        res.status(500).json({ error: "Failed to update video" });
    }
});


module.exports = router;
