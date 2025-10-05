// backend/server/routes/galleries.routes.js
import { Router } from 'express';
import Gallery from '../models/Gallery.js';
import { crudRouter } from '../utils/crudRouter.js';

const r = Router();
r.use('/', crudRouter(Gallery, { sort: { createdAt: -1 } }));
export default r;
