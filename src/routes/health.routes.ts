import { Router, Request, Response } from 'express';
import { register, collectDefaultMetrics } from 'prom-client';
import { cache } from '../utils/cache.js';
import { config } from '../config.js';

export const healthRouter = Router();

collectDefaultMetrics();

healthRouter.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

healthRouter.get('/readyz', async (_req: Request, res: Response) => {
  if (config.REDIS_URL) {
    try {
      await cache.connect?.();
      res.status(200).json({ status: 'ok', dependencies: { redis: 'ok' } });
    } catch (error) {
      res
        .status(503)
        .json({ status: 'unavailable', dependencies: { redis: 'error' } });
    }
  } else {
    res
      .status(200)
      .json({ status: 'ok', dependencies: { redis: 'not_configured' } });
  }
});

healthRouter.get('/metrics', async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
