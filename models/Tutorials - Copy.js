const mongoose = require("mongoose");

const TutorialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: {type: String, required:true},
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
     comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    approved: { type: Boolean, default: false }, // Admin approval system
    published: { type: Boolean, default: false },// ✅ Added published status
    createdAt: { type: Date, default: Date.now },
    
  // ── analytics fields ─────────────────────────
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  dislikes:    { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
});

module.exports = mongoose.model("Tutorial", TutorialSchema);
