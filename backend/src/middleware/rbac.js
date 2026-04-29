import { error } from '../utils/response.js';

export function rbac(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Forbidden: You do not have permission to access this resource', 403);
    }

    next();
  };
}
