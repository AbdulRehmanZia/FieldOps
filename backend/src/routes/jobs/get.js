import Joi from 'joi';
import { validate } from '../../middleware/validate.js';
import { authMiddleware } from '../../middleware/auth.js';
import { getJobs, getJobsSummary } from '../../controllers/jobs.js';

export async function getJobsHandler(req, res, next) {
  return getJobs(req, res, next);
}

export async function getJobsSummaryHandler(req, res, next) {
  return getJobsSummary(req, res, next);
}

export function attachGetMiddleware(router) {
  router.get(
    '/',
    authMiddleware,
    getJobsHandler
  );
  router.get(
    '/summary',
    authMiddleware,
    getJobsSummaryHandler
  );
}
