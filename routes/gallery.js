const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");

// Upload an Image
router.post("/", async (req, res) => {
    const { title, imageUrl } = req.body;
    try {
        const newImage = new Gallery({ title, imageUrl });
        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully!", image: newImage });
    } catch (err) {
        res.status(500).json({ error: "Failed to upload image", details: err.message });
    }
});

// Approve an Image
router.put("/approve/:id", async (req, res) => {
    try {
        const image = await Gallery.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
        res.json({ message: "Image approved", image });
    } catch (err) {
        res.status(500).json({ error: "Failed to approve image" });
    }
});

// Delete an Image
router.delete("/:id", async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: "Image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete image" });
    }
});

module.exports = router;
