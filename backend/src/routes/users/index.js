import { Router } from 'express';
import { attachGetMiddleware } from './get.js';
import { attachPostMiddleware } from './post.js';
import { attachPutMiddleware } from './put.js';

const router = Router();

attachGetMiddleware(router);
attachPostMiddleware(router);
attachPutMiddleware(router);

export default router;
