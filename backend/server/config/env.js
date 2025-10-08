import dotenv from 'dotenv';
dotenv.config();

const env = (name, fallback) => process.env[name] ?? fallback;

export default {
  nodeEnv: env('NODE_ENV', 'development'),
  port: Number(env('PORT', 5000)),
  corsOrigin: env('CORS_ORIGIN', 'http://localhost:5173'),
  mongoUri: env('MONGO_URI', 'mongodb://127.0.0.1:27017/firestar_gaming_blog'),
  jwtSecret: env('JWT_SECRET', 'PLEASE_CHANGE_ME'),
  jwtExpiresIn: env('JWT_EXPIRES_IN', '7d'),
  rateLimitWindowMs: Number(env('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
  rateLimitMax: Number(env('RATE_LIMIT_MAX', 100)),
  rawgApiKey: process.env.RAWG_API_KEY || '',
  uploadDir: env('UPLOAD_DIR', 'uploads'),
  maxUploadMb: Number(env('MAX_UPLOAD_MB', 10)),
  allowedImageTypes: env('ALLOWED_IMAGE_TYPES', 'image/jpeg,image/png,image/webp')
    .split(','),
  mail: {
    host: env('MAIL_HOST', ''),
    port: Number(env('MAIL_PORT', 587)),
    user: env('MAIL_USER', ''),
    pass: env('MAIL_PASS', ''),
    from: env('MAIL_FROM', '"FireStar Gaming" <noreply@example.com>')
  }
};
