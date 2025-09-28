import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, index: true },
  body: String,
  rating: { type: Number, min: 0, max: 10 },
  coverImageUrl: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  tags: [String]
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
