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

// 🛠 PUT /api/galleries/:id - Edit gallery item
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) {
            return res.status(404).json({ error: "Gallery item not found" });
        }

        // If new image uploaded, replace the old one
        if (req.file) {
            const oldFilePath = path.join(uploadDir, path.basename(gallery.imageUrl));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            gallery.imageUrl = `/uploads/${req.file.filename}`;
        }

        // Update title if provided
        if (req.body.title) {
            gallery.title = req.body.title;
        }

        const updated = await gallery.save();
        res.json({ message: "Gallery updated", gallery: updated });
    } catch (err) {
        console.error("❌ Error editing gallery:", err);
        res.status(500).json({ error: "Failed to edit gallery" });
    }
});

// 🗑️ DELETE /api/videos/:filename - Delete video file
router.delete("/:filename", async (req, res) => {
    try {
        const filePath = path.join(uploadDir, req.params.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Video not found" });
        }

        fs.unlinkSync(filePath);

        res.json({ message: "Video deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting video:", err);
        res.status(500).json({ error: "Failed to delete video" });
    }
});

router.get("/view/:id", async (req, res) => {
    try {
        const video = await videos.findById(req.params.id); // ✅ use 'tutorial'
        if (!video || !video.approved) {
            return res.status(404).send("Tutorial not found or not approved");
        }

        res.sendFile(path.join(__dirname, "../public/tutorial.html"));
    } catch (err) {
        console.error("❌ Error loading tutorial:", err.message);
        res.status(500).send("Failed to load tutorial");
    }
});

module.exports = router;
