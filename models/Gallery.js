const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Admin approval system
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Gallery", GallerySchema);
