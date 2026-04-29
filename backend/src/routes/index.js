import { Router } from 'express';
import authRoutes from './auth/index.js';
import jobsRoutes from './jobs/index.js';
import usersRoutes from './users/index.js';
import notificationsRoutes from './notifications/index.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/users', usersRoutes);
router.use('/notifications', notificationsRoutes);

export default router;
