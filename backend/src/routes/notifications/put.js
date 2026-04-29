import { authMiddleware } from '../../middleware/auth.js';
import { markNotificationAsRead } from '../../controllers/notifications.js';

export async function markNotificationAsReadHandler(req, res, next) {
  return markNotificationAsRead(req, res, next);
}

export function attachPutMiddleware(router) {
  router.put(
    '/:id/read',
    authMiddleware,
    markNotificationAsReadHandler
  );
}
