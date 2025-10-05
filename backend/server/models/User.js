// backend/server/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // store a hash, NOT the raw password
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'user'],
      default: 'user',
      index: true,
    },
  },
  { timestamps: true }
);

/** Instance methods */
UserSchema.methods.setPassword = async function setPassword(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function validatePassword(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

/** Static helper to create a user from raw password */
UserSchema.statics.createWithPassword = async function createWithPassword({
  email,
  password,
  role = 'user',
}) {
  const user = new this({ email, role, passwordHash: '' });
  await user.setPassword(password);
  return user.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
