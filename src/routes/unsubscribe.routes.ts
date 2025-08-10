import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export const unsubscribeRouter = Router();

unsubscribeRouter.post('/unsubscribe', (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  logger.info({ email }, 'Unsubscribe request received');
  res.status(202).json({ message: 'Unsubscribe request accepted' });
});
