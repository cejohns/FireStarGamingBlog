// backend/server/models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true },
  product: { type: String, default: '' },     // game or item name
  platform: { type: String, default: '' },    // PS5, PC, etc.
  score: { type: Number, min: 0, max: 10, required: true },
  summary: { type: String, default: '' },
  body: { type: String, default: '' },
  status: { type: String, enum: ['draft','published'], default: 'published' },
  tags: { type: [String], default: [] },
  heroImage: { type: String, default: '' },   // URL to uploaded image
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
