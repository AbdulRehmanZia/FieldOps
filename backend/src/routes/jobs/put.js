import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import { rbac } from '../../middleware/rbac.js';
import { assignJob, updateJobStatus, addJobNote } from '../../controllers/jobs.js';

const assignJobSchema = Joi.object({
  technicianId: Joi.string().required(),
});

const updateJobStatusSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED').required(),
});

const addJobNoteSchema = Joi.object({
  content: Joi.string().required(),
});

export async function assignJobHandler(req, res, next) {
  return assignJob(req, res, next);
}

export async function updateJobStatusHandler(req, res, next) {
  return updateJobStatus(req, res, next);
}

export async function addJobNoteHandler(req, res, next) {
  return addJobNote(req, res, next);
}

export function attachPutMiddleware(router) {
  router.put(
    '/:id/assign',
    authMiddleware,
    rbac('ADMIN'),
    validate(assignJobSchema),
    assignJobHandler
  );
  router.put(
    '/:id/status',
    authMiddleware,
    validate(updateJobStatusSchema),
    updateJobStatusHandler
  );
  router.put(
    '/:id/notes',
    authMiddleware,
    rbac('ADMIN', 'TECHNICIAN'),
    validate(addJobNoteSchema),
    addJobNoteHandler
  );
}
