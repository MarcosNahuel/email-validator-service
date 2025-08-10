import { Router, Request, Response, NextFunction } from 'express';
import {
  validateEmail,
  ValidationResult,
} from '../services/validation.service.js';
import {
  validateEmailSchema,
  validateEmailQuerySchema,
  validateBulkEmailSchema,
} from '../validators/email.validator.js';
import { apiKeyAuth } from '../middleware/auth.js';
import { apiKeyRateLimiter } from '../middleware/rateLimit.js';

export const validationRouter = Router();

const validateRequest =
  (schema: any) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      next(error);
    }
  };

validationRouter.get(
  '/validate',
  apiKeyAuth,
  apiKeyRateLimiter,
  validateRequest(validateEmailQuerySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = String(req.query.email);
      const result = await validateEmail(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

validationRouter.post(
  '/validate',
  apiKeyAuth,
  apiKeyRateLimiter,
  validateRequest(validateEmailSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body as { email: string };
      const result = await validateEmail(email);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

validationRouter.post(
  '/bulk/validate',
  apiKeyAuth,
  apiKeyRateLimiter,
  validateRequest(validateBulkEmailSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { emails } = req.body as { emails: string[] };
      const concurrencyLimit = 10;
      const results: ValidationResult[] = [];
      for (let i = 0; i < emails.length; i += concurrencyLimit) {
        const batch = emails.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
          batch.map((email) => validateEmail(email)),
        );
        results.push(...batchResults);
      }
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
);
