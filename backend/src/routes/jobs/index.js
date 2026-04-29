import { Router } from 'express';
import { attachGetMiddleware } from './get.js';
import { attachPostMiddleware } from './post.js';
import { attachPutMiddleware } from './put.js';
import { attachDeleteMiddleware } from './delete.js';

const router = Router();

attachGetMiddleware(router);
attachPostMiddleware(router);
attachPutMiddleware(router);
attachDeleteMiddleware(router);

export default router;
