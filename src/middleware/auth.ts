import { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

const apiKeys = new Set(config.API_KEYS);

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header('x-api-key');
  if (!key) {
    return res.status(401).json({ error: 'API key is missing' });
  }
  if (!apiKeys.has(key)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  next();
};
