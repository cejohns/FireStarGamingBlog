// server/middlewares/auth.js
import { verifyJWT } from '../utils/jwt.js';

/**
 * requireAuth(['admin','editor'])
 * - Accepts token from:
 *   - Authorization: Bearer <token>  (preferred)
 *   - Cookie: token=<token>          (optional if you set it)
 * - Skips OPTIONS (CORS preflight)
 * - 401 when missing/invalid, 403 when role not allowed
 */
export const requireAuth = (roles = []) => {
  const allowAnyRole = roles.length === 0;

  return (req, res, next) => {
    try {
      // Skip CORS preflight
      if (req.method === 'OPTIONS') return res.sendStatus(204);

      // 1) Authorization header (case-insensitive)
      const auth = req.headers.authorization || req.headers.Authorization || '';
      let token = null;
      if (typeof auth === 'string' && auth.startsWith('Bearer ')) {
        token = auth.slice(7).trim();
      }

      // 2) Fallback: cookie named "token" (if you ever set it)
      if (!token && req.headers.cookie) {
        const m = req.headers.cookie.match(/(?:^|;\s*)token=([^;]+)/);
        if (m) token = decodeURIComponent(m[1]);
      }

      if (!token) return res.status(401).json({ message: 'Missing token' });

      const payload = verifyJWT(token); // throws on invalid/expired
      req.user = payload;

      if (!allowAnyRole && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      return next();
    } catch (_err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};
