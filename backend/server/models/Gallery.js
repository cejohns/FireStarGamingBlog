// backend/server/models/Gallery.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
}, { _id: false });

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, required: true, unique: true },
  images: { type: [imageSchema], default: [] },
  status: { type: String, enum: ['draft','published'], default: 'published' },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
