const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure "uploads" directory exists
const uploadPath = path.join("J:/Bloomtech/FirestarBlogSite/uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);  // ✅ Corrected path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ✅ Upload Image and Save to MongoDB
router.post("/image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
});


// ✅ Video Upload API Route
router.post("/", upload.single("video"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
    }
    res.json({ videoUrl: `/uploads/videos/${req.file.filename}` });
});

module.exports = router;
