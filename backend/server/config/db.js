import mongoose from 'mongoose';
import config from './env.js';

export const connectDB = async () => {
  await mongoose.connect(config.mongoUri, { autoIndex: true });
  console.log('✅ MongoDB connected');
};
