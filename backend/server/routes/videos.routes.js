// backend/server/routes/videos.routes.js
import { Router } from 'express';
import Video from '../models/Video.js';
import { crudRouter } from '../utils/crudRouter.js';

const r = Router();
r.use('/', crudRouter(Video, { sort: { publishedAt: -1, createdAt: -1 } }));
export default r;
