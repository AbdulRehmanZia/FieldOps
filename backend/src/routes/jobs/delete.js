import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { deleteJob } from '../../controllers/jobs.js';

export async function deleteJobHandler(req, res, next) {
  return deleteJob(req, res, next);
}

export function attachDeleteMiddleware(router) {
  router.delete(
    '/:id',
    authMiddleware,
    rbac('ADMIN'),
    deleteJobHandler
  );
}
