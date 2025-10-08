// backend/server/middlewares/auth.js
// @ts-nocheck
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || req.headers.Authorization;
    if (!hdr || !hdr.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = hdr.slice(7).trim();
    const payload = jwt.verify(token, config.jwtSecret);
    // attach a normalized user object
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}
