// backend/server/models/Post.js
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true },
  body:  { type: String, default: '' },
  summary: { type: String, default: '' },
  status: { type: String, enum: ['draft','published'], default: 'published' },
  tags: { type: [String], default: [] },
  heroImage: { type: String, default: '' },
  // Vlog fields (optional)
  videoUrl: { type: String, default: '' },
  videoProvider: { type: String, enum: ['','youtube','vimeo','twitch','other'], default: '' },
  videoId: { type: String, default: '' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Post', postSchema);

