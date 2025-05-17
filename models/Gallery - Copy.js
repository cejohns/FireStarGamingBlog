const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
     comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    approved: { type: Boolean, default: false }, // Admin approval system
    createdAt: { type: Date, default: Date.now },

      // ── analytics fields ─────────────────────────
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  dislikes:    { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
});

module.exports = mongoose.model("Gallery", GallerySchema);
