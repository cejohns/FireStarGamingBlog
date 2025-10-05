// backend/server/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true },
  provider: { type: String, enum: ['youtube','vimeo','twitch','other'], default: 'youtube' },
  videoId: { type: String, default: '' },       // e.g. YouTube ID
  url: { type: String, required: true },        // canonical URL
  description: { type: String, default: '' },
  status: { type: String, enum: ['draft','published'], default: 'published' },
  tags: { type: [String], default: [] },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);
