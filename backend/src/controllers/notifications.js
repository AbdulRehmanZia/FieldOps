import { prisma } from '../utils/prisma.js';
import { success, error } from '../utils/response.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        job: { select: { id: true, title: true, status: true } },
      },
      orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
    });

    return success(res, notifications);
  } catch (err) {
    next(err);
  }
}

export async function markNotificationAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get notification
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return error(res, 'Notification not found', 404);
    }

    // Verify ownership
    if (notification.userId !== userId) {
      return error(res, 'Forbidden: You can only mark your own notifications as read', 403);
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
      include: {
        job: { select: { id: true, title: true, status: true } },
      },
    });

    return success(res, updatedNotification);
  } catch (err) {
    next(err);
  }
}
