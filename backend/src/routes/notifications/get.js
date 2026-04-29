import { authMiddleware } from '../../middleware/auth.js';
import { getNotifications } from '../../controllers/notifications.js';

export async function getNotificationsHandler(req, res, next) {
  return getNotifications(req, res, next);
}

export function attachGetMiddleware(router) {
  router.get(
    '/',
    authMiddleware,
    getNotificationsHandler
  );
}
