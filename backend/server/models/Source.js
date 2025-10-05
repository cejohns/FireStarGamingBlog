import mongoose from 'mongoose';
const SourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url:  { type: String, required: true, unique: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Source', SourceSchema);
