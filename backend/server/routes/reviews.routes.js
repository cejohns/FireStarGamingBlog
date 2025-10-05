// backend/server/routes/reviews.routes.js
import { Router } from 'express';
import Review from '../models/Review.js';
import { crudRouter } from '../utils/crudRouter.js';

const r = Router();
r.use('/', crudRouter(Review, { sort: { createdAt: -1 } }));
export default r;
