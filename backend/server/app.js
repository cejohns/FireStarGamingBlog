// backend/server/app.js
// @ts-nocheck
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import listEndpoints from 'express-list-endpoints';

import config from './config/env.js';
import rateLimiter from './middlewares/rateLimit.js';
import errorHandler from './middlewares/error.js';

// Routers (all under backend/server/)
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import tutorialsRoutes from './routes/tutorials.routes.js';
import sourcesRoutes from './routes/sources.routes.js';
import articlesRoutes from './routes/articles.routes.js';
import newsRoutes from './routes/newsRoutes.js'; // keep only if this file exists

const app = express();

console.log('🔥 backend/server/app.js LOADED from:', import.meta.url);

// Core middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimiter);

// ROUTE MOUNTS (order matters — above the catch-all)
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/tutorials', tutorialsRoutes);
app.use('/api/gaming-news', newsRoutes);
app.use('/api/sources', sourcesRoutes);
app.use('/api/articles', articlesRoutes);

// Health & root
app.get('/healthz', (_req, res) => res.status(204).end());
app.get('/', (_req, res) => {
  res.json({
    name: 'FireStar Gaming Blog API',
    status: 'ok',
    endpoints: [
      '/api/posts',
      '/api/reviews',
      '/api/tutorials',
      '/api/auth/login',
      '/api/articles',
    ],
  });
});

// Extra introspection (handy while debugging)
app.get('/__whoami-app', (_req, res) => {
  res.json({
    from: 'backend/server/app.js',
    appFile: import.meta.url,
    cwd: process.cwd(),
    node: process.version,
    time: new Date().toISOString(),
  });
});

app.get('/__introspect-app', (_req, res) => {
  res.json({
    routes: listEndpoints(app).filter(e => e.path.startsWith('/api') || e.path.startsWith('/__')),
  });
});

// Catch-all for unknown /api/* (KEEP LAST)
app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handler LAST
app.use(errorHandler);

export default app;
