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
    destination: (req, file, cb) => cb(null, uploadDir),
    filename:    (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET /api/galleries - Retrieve all gallery items
router.get("/", async (req, res) => {
    try {
        const galleries = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json(galleries);
    } catch (err) {
        console.error("❌ Error fetching galleries:", err);
        res.status(500).json({ error: "Failed to fetch galleries" });
    }
});

// GET /api/galleries/:id - Retrieve one gallery item by ID
// 2️⃣ DETAIL ROUTE
// GET /api/galleries/:id
router.get("/:id", async (req, res) => {
  try {
      const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!gal) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    return res.status(200).json(gal);
  } catch (err) {
    console.error("❌ Error fetching gallery detail:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST /api/posts/:id/like
router.post('/:id/like', async (req, res) => {
  const gallery = await Gallery.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return gallery
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});

// POST /api/posts/:id/dislike
router.post('/:id/dislike', async (req, res) => {
  const gallery = await Gallery.findByIdAndUpdate(
    req.params.id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
  return gallery
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});


// POST /api/galleries - Upload image & save metadata
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            console.warn("⚠ No file uploaded.");
            return res.status(400).json({ error: "No file uploaded" });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const newGallery = new Gallery({ title: req.body.title, imageUrl });
        const savedGallery = await newGallery.save();
        res.status(201).json(savedGallery);
    } catch (err) {
        console.error("❌ Error adding gallery item:", err);
        res.status(500).json({ error: "Failed to add gallery item", details: err.message });
    }
});

// PUT /api/galleries/approve/:id - Approve an image
router.put("/approve/:id", async (req, res) => {
    try {
        const image = await Gallery.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Image approved", image });
    } catch (err) {
        console.error("❌ Error approving gallery:", err);
        res.status(500).json({ error: "Failed to approve image" });
    }
});

// PUT /api/galleries/:id - Edit gallery item
router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id);
        if (!gallery) return res.status(404).json({ error: "Gallery item not found" });
        if (req.file) {
            const oldFilePath = path.join(uploadDir, path.basename(gallery.imageUrl));
            if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
            gallery.imageUrl = `/uploads/${req.file.filename}`;
        }
        if (req.body.title) gallery.title = req.body.title;
        const updated = await gallery.save();
        res.json({ message: "Gallery updated", gallery: updated });
    } catch (err) {
        console.error("❌ Error editing gallery:", err);
        res.status(500).json({ error: "Failed to edit gallery" });
    }
});

// DELETE /api/galleries/:id - Delete image from DB and filesystem
router.delete("/:id", async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) return res.status(404).json({ error: "Image not found" });
        const filePath = path.join(uploadDir, path.basename(image.imageUrl));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting gallery:", err);
        res.status(500).json({ error: "Failed to delete image" });
    }
});

module.exports = router;
