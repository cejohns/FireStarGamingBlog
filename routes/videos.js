const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ GET /api/videos - Retrieve all videos
router.get("/", async (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        const videos = files.map(file => ({
            filename: file,
            videoUrl: `/uploads/videos/${file}`
        }));
        res.status(200).json(videos);
    } catch (err) {
        console.error("Error fetching videos:", err);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// ✅ POST /api/videos - Upload video
router.post("/", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
    }
    res.json({ videoUrl: `/uploads/videos/${req.file.filename}` });
});

module.exports = router;
