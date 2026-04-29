import { success, error } from '../../utils/response.js'
import { authMiddleware } from '../../middleware/auth.js'
import { prisma } from '../../utils/prisma.js'

export async function getCurrentUserHandler(req, res, next) {
  try {
    if (!req.user) {
      return error(res, 'Unauthorized', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    })

    if (!user) {
      return error(res, 'User not found', 404)
    }

    return success(res, user)
  } catch (err) {
    next(err)
  }
}

export function attachGetMiddleware(router) {
  router.get('/me', authMiddleware, getCurrentUserHandler)
}
