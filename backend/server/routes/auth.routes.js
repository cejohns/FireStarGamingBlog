// @ts-nocheck
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import config from '../config/env.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

// register (already exists in your project)
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role = 'user' } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ email, password: hash, role });
    return res.status(201).json({ id: u._id.toString(), email: u.email });
  } catch (e) { next(e); }
});

// login (already exists)
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign(
      { sub: u._id.toString(), email: u.email, role: u.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
    res.json({ token, role: u.role, email: u.email });
  } catch (e) { next(e); }
});

// NEW: who am I
router.get('/me', requireAuth, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});

export default router;
