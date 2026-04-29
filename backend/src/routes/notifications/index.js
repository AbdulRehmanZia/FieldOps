import { Router } from 'express';
import { attachGetMiddleware } from './get.js';
import { attachPutMiddleware } from './put.js';

const router = Router();

attachGetMiddleware(router);
attachPutMiddleware(router);

export default router;
