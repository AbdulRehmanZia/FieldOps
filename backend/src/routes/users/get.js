import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { getUsers, getUserById } from '../../controllers/users.js';

export async function getUsersHandler(req, res, next) {
  return getUsers(req, res, next);
}

export async function getUserByIdHandler(req, res, next) {
  return getUserById(req, res, next);
}

export function attachGetMiddleware(router) {
  router.get(
    '/',
    authMiddleware,
    rbac('ADMIN'),
    getUsersHandler
  );
  router.get(
    '/:id',
    authMiddleware,
    getUserByIdHandler
  );
}
