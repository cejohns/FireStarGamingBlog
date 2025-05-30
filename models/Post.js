const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    comments: [CommentSchema],
    approved: { type: Boolean, default: false }, // ✅ Added approval status
    createdAt: { type: Date, default: Date.now },

    // ── analytics fields ─────────────────────────
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  dislikes:    { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);
