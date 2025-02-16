const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// ✅ GET /api/galleries - Retrieve all gallery items
router.get("/", async (req, res) => {
    try {
        const galleries = await Gallery.find();
        res.status(200).json(galleries);
    } catch (err) {
        console.error("Error fetching galleries:", err);
        res.status(500).json({ error: "Failed to fetch galleries" });
    }
});

// ✅ POST /api/galleries - Upload image & save metadata
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const { title } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        const newGallery = new Gallery({ title, imageUrl });
        await newGallery.save();

        res.status(201).json(newGallery);
    } catch (err) {
        console.error("Error adding gallery item:", err);
        res.status(500).json({ error: "Failed to add gallery item", details: err.message });
    }
});

// ✅ Approve an Image
router.put("/approve/:id", async (req, res) => {
    try {
        const image = await Gallery.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Image approved", image });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve image" });
    }
});

// ✅ DELETE /api/galleries/:id - Delete image from DB and filesystem
router.delete("/:id", async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Delete file from uploads folder
        const filePath = path.join(uploadDir, path.basename(image.imageUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete image" });
    }
});

module.exports = router;
