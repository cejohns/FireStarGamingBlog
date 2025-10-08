// backend/server/models/Review.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, index: true },
    game: String,
    rating: { type: Number, min: 0, max: 10 },
    pros: [String],
    cons: [String],
    body: String,
    author: String,
    status: { type: String, default: 'published' },
    publishedAt: Date,
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
