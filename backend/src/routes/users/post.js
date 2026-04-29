import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { createUser } from '../../controllers/users.js';

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid('TECHNICIAN', 'ADMIN').required(),
});

export async function createUserHandler(req, res, next) {
  return createUser(req, res, next);
}

export function attachPostMiddleware(router) {
  router.post(
    '/',
    authMiddleware,
    rbac('ADMIN'),
    validate(createUserSchema),
    createUserHandler
  );
}
