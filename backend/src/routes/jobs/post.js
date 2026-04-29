import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { createJob } from '../../controllers/jobs.js';

const createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  clientId: Joi.string().required(),
  technicianId: Joi.string().optional(),
  scheduledAt: Joi.string().isoDate().optional(),
});

export async function createJobHandler(req, res, next) {
  return createJob(req, res, next);
}

export function attachPostMiddleware(router) {
  router.post(
    '/',
    authMiddleware,
    rbac('ADMIN'),
    validate(createJobSchema),
    createJobHandler
  );
}
