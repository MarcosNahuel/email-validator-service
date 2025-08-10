import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

export const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.RATE_LIMIT_IP_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after a minute',
  },
});

export const apiKeyRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.RATE_LIMIT_KEY_PER_MIN,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, _res) => (req.header('x-api-key') ?? req.ip) as string,
  message: {
    error: 'API key rate limit exceeded, please try again after a minute',
  },
});
