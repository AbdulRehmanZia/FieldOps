import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { updateUser } from '../../controllers/users.js';

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('TECHNICIAN', 'ADMIN', 'CLIENT').optional(),
});

export async function updateUserHandler(req, res, next) {
  return updateUser(req, res, next);
}

export function attachPutMiddleware(router) {
  router.put(
    '/:id',
    authMiddleware,
    validate(updateUserSchema),
    updateUserHandler
  );
}
