import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { validationRouter } from './validation.routes.js';
import { unsubscribeRouter } from './unsubscribe.routes.js';

const router = Router();

router.use(healthRouter);
router.use(validationRouter);
router.use(unsubscribeRouter);

export { router as apiRouter };
