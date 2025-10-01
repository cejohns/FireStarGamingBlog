import mongoose from 'mongoose';

const tutorialSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, index: true },
  body: String,
  difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  coverImageUrl: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  tags: [String]
}, { timestamps: true });

export default mongoose.model('Tutorial', tutorialSchema);
