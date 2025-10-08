// backend/server/models/Tutorial.js
import mongoose from 'mongoose';

const StepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const TutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, trim: true, lowercase: true },
    topic: { type: String, trim: true, default: '' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    summary: { type: String, trim: true, default: '' },
    body: { type: String, trim: true, default: '' },
    steps: { type: [StepSchema], default: [] },
    // IMPORTANT: array of strings; not part of any text index
    tags: { type: [String], default: [], index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    assets: {
      type: [
        {
          kind: { type: String, enum: ['image', 'video', 'link'], default: 'image' },
          url: { type: String, trim: true },
          title: { type: String, trim: true, default: '' },
        },
      ],
      default: [],
    },
    publishedAt: { type: Date },
  },
  { timestamps: true, collection: 'tutorials' }
);

// unique slug
TutorialSchema.index({ slug: 1 }, { unique: true, name: 'slug_unique' });

// ONLY text index we want
TutorialSchema.index(
  { title: 'text', summary: 'text', body: 'text' },
  { name: 'tutorial_text', weights: { title: 5, summary: 3, body: 1 } }
);

const Tutorial = mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema);
export default Tutorial;
