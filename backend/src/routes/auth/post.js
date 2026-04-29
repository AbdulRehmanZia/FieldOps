import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { register, login, logout, createTechnicianOrAdmin } from '../../controllers/auth.js';
import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createTechnicianAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  role: Joi.string().valid('TECHNICIAN', 'ADMIN').required(),
});

export async function registerHandler(req, res, next) {
  return register(req, res, next);
}

export async function loginHandler(req, res, next) {
  return login(req, res, next);
}

export async function logoutHandler(req, res, next) {
  return logout(req, res, next);
}

export async function createTechnicianAdminHandler(req, res, next) {
  return createTechnicianOrAdmin(req, res, next);
}

export function attachPostMiddleware(router) {
  router.post(
    '/register',
    validate(registerSchema),
    registerHandler
  );
  router.post(
    '/login',
    validate(loginSchema),
    loginHandler
  );
  router.post(
    '/logout',
    authMiddleware,
    logoutHandler
  );
  router.post(
    '/create-technician-admin',
    authMiddleware,
    rbac('ADMIN'),
    validate(createTechnicianAdminSchema),
    createTechnicianAdminHandler
  );
}
