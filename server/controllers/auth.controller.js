import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, displayName, role } = req.body;
    const user = new User({ email, displayName, role });
    await user.setPassword(password);
    await user.save();
    res.status(201).json({ id: user._id, email: user.email });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u || !(await u.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ sub: u._id, email: u.email, role: u.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.json({ token, role: u.role, email: u.email, displayName: u.displayName });
  } catch (e) { next(e); }
};
