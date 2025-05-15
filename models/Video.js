// models/Video.js

const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  videoUrl:    { type: String, required: true },
  description: { type: String, required: true },
  comments:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  approved:    { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now },
  views:       { type: Number, default: 0 },
  likes:       { type: Number, default: 0 },
  dislikes:    { type: Number, default: 0 },
  commentCount:{ type: Number, default: 0 },
});

module.exports = mongoose.model("Video", VideoSchema);
