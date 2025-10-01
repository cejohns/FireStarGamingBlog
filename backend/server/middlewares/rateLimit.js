import rateLimit from 'express-rate-limit';
import config from '../config/env.js';

export default rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false
});
