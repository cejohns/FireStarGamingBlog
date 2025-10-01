import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const run = async () => {
  await connectDB();
  const email = process.argv[2] || 'admin@example.com';
  const password = process.argv[3] || 'ChangeMe123!';
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, role: 'admin', displayName: 'Admin' });
  }
  await user.setPassword(password);
  await user.save();
  console.log(`✅ Admin ready: ${email}`);
  await mongoose.disconnect();
};

run().catch(e => { console.error(e); process.exit(1); });
