import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { logger } from './utils/logger.js';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ipRateLimiter } from './middleware/rateLimit.js';
import { cache } from './utils/cache.js';
import { initializeDisposableService } from './services/disposable.service.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Connect to cache and initialize services
  try {
    await cache.connect?.();
  } catch (err) {
    logger.warn({ err }, 'Cache connect failed; continuing');
  }
  await initializeDisposableService();

  // Core Middleware
  app.use(
    cors({
      origin: config.ALLOWED_ORIGINS,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // General rate limiter
  app.use(ipRateLimiter);

  // API Documentation
  const openapiFilePath = path.join(__dirname, '../../openapi.yaml');
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerUrl: '/docs/openapi.yaml',
      customSiteTitle: 'Email Verifier API Docs',
    }),
  );
  app.get('/docs/openapi.yaml', (_req, res) => {
    res.sendFile(openapiFilePath);
  });

  // Routes
  app.use('/', apiRouter);

  // Error handler
  app.use(errorHandler);

  app.listen(config.PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server is running on http://0.0.0.0:${config.PORT}`);
    logger.info(`📚 API docs at http://localhost:${config.PORT}/docs`);
    logger.info(
      `Prometheus metrics at http://localhost:${config.PORT}/metrics`,
    );
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    try {
      cache.disconnect?.();
    } catch {}
    process.exit(0);
  });
}

startServer().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
