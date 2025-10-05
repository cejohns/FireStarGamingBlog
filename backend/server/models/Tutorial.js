import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  body:  { type: String, default: '' },   // markdown or HTML
  media: { type: String, default: '' },   // optional image/video URL per step
  durationMinutes: { type: Number, default: 0 },
}, { _id: false });

const tutorialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug:  { type: String, required: true, unique: true, trim: true, lowercase: true },
  summary: { type: String, default: '' },
  body: { type: String, default: '' },             // optional full text
  steps: { type: [stepSchema], default: [] },      // structured steps
  difficulty: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  tags: { type: [String], default: [] },
  heroImage: { type: String, default: '' },
  videoUrl: { type: String, default: '' },         // for tutorial walkthroughs
  readTime: { type: Number, default: 0 },          // minutes
  sources: { type: [String], default: [] },        // reference links
  status: { type: String, enum: ['draft','published'], default: 'published' },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

tutorialSchema.index({ slug: 1 }, { unique: true });
tutorialSchema.index({ title: 'text', summary: 'text', tags: 1 });

export default mongoose.model('Tutorial', tutorialSchema);
