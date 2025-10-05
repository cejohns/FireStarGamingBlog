// backend/server/index.js
import http from 'http';
import listEndpoints from 'express-list-endpoints';
import { startNewsCron } from './jobs/newsIngest.js';
import app from './app.js';
import { connectDB } from './config/db.js';
import config from './config/env.js';

const PORT = config.port || 5000;

async function start() {
  try {
    console.log('🚀 backend/server/index.js START from:', import.meta.url);

    await connectDB();
    startNewsCron();

    // Probes (so we know which file is actually running)
    app.get('/__whoami', (_req, res) => {
      res.json({
        from: 'backend/server/index.js',
        indexFile: import.meta.url,
        cwd: process.cwd(),
        node: process.version,
        time: new Date().toISOString(),
      });
    });

    app.get('/__introspect', (_req, res) => {
      res.json({ routes: listEndpoints(app) });
    });

    // TEMP: guarantee /api/articles exists while wiring (remove later)
    //app.get('/api/articles', (_req, res) => res.json([]));

    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ API listening on http://localhost:${PORT} (PID ${process.pid})`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} already in use.`);
        console.error(`  netstat -ano | findstr :${PORT}`);
        console.error('  taskkill /PID <PID> /F');
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
