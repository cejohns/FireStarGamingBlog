// @ts-nocheck
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env.js';
import rateLimiter from './middlewares/rateLimit.js';
import errorHandler from './middlewares/error.js';

import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import tutorialsRoutes from './routes/tutorials.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/tutorials', tutorialsRoutes);

// Health / root route
app.get('/healthz', (_req, res) => res.status(204).end());
app.get('/', (_req, res) => {
  res.json({
    name: 'FireStar Gaming Blog API',
    status: 'ok',
    endpoints: ['/api/posts', '/api/reviews', '/api/tutorials', '/api/auth/login']
  });
});

app.use(errorHandler);

export default app;
