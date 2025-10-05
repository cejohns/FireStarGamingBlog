import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const signJWT = (payload, opts={}) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn, ...opts });

export const verifyJWT = (token) =>
  jwt.verify(token, config.jwtSecret);
