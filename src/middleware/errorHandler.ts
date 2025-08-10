import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

interface HttpError extends Error {
  status?: number;
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
  }

  const statusCode = (err.status as number) || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(
    { err, statusCode, path: req.path, method: req.method },
    'An unhandled error occurred',
  );

  res.status(statusCode).json({ error: message });
};
