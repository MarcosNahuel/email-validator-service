import pino from 'pino';
import { config } from '../config.js';

const transport =
  config.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined;

export const logger = pino({
  level: config.LOG_LEVEL,
  transport,
  formatters: {
    log(object) {
      // Obfuscate email for privacy in logs, except in debug mode
      if (config.LOG_LEVEL !== 'debug' && (object as any).email) {
        const [local, domain] = ((object as any).email as string).split('@');
        if (local && domain) {
          const obfuscatedLocal =
            local.length > 2
              ? `${local.substring(0, 2)}...`
              : `${local.substring(0, 1)}...`;
          (object as any).email = `${obfuscatedLocal}@${domain}`;
        }
      }
      return object as any;
    },
  },
});
