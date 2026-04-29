import { Router } from 'express';
import { attachPostMiddleware } from './post.js';
import { attachGetMiddleware } from './get.js';

const router = Router();

attachGetMiddleware(router);
attachPostMiddleware(router);

export default router;
