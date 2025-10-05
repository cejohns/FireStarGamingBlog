// backend/server/models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug:  { type: String, required: true, unique: true, index: true, trim: true },
    body:  { type: String, default: '' },
    status:{ type: String, enum: ['draft','published'], default: 'draft', index: true },
    tags:  [{ type: String, trim: true }],
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

// Reuse if already compiled (hot-reload friendly)
export default mongoose.models.Post || mongoose.model('Post', PostSchema);
