import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { validationRouter } from './validation.routes.js';
import { unsubscribeRouter } from './unsubscribe.routes.js';
import { config } from '../config.js';

const router = Router();

router.use(healthRouter);
router.use(validationRouter);
router.use(unsubscribeRouter);

// Endpoint de depuración para verificar variables de entorno en runtime
router.get('/__debug/env/a1b2c3d4', (_req, res) => {
  res.json({
    message: 'Estado actual de variables de entorno',
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    API_KEYS_RAW: process.env.API_KEYS ?? '(no definida)',
    API_KEYS_PARSED: (config as any).API_KEYS,
  });
});

export { router as apiRouter };
