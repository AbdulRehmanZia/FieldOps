import { verifyToken } from '../utils/jwt.js';
import { error } from '../utils/response.js';

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return error(res, 'Unauthorized', 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return error(res, 'Invalid or expired token', 401);
    }

    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Authentication failed', 401);
  }
}
