const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    category: { type: String, required: true },
     comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    approved: { type: Boolean, default: false },
    published: { type: Boolean, default: false }, // ✅ Added published status
    publishedAt: { type: Date }, // ✅ Added published date
    createdAt: { type: Date, default: Date.now },

  
  // ── analytics fields ─────────────────────────
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  dislikes:    { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
});

module.exports = mongoose.model("Review", ReviewSchema);
