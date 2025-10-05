// backend/server/models/Article.js
import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    link:  { type: String, required: true, trim: true },
    source:{ type: String, trim: true },
    summary:{ type: String, default: '' },
    content:{ type: String, default: '' },
    publishedAt: { type: Date, index: true },
    status:{ type: String, enum: ['draft','published'], default: 'published', index: true },
    tags:  [{ type: String, trim: true }]
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
