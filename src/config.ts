import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal'])
    .default('info'),
  API_KEYS: z
    .string()
    .default('')
    .transform((val) => (val ? val.split(',').map((key) => key.trim()) : [])),
  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000')
    .transform((val) => val.split(',').map((origin) => origin.trim())),
  RATE_LIMIT_IP_PER_MIN: z.coerce.number().default(60),
  RATE_LIMIT_KEY_PER_MIN: z.coerce.number().default(600),
  REDIS_URL: z.string().optional(),
  CACHE_TTL_SECONDS: z.coerce.number().default(86400),
  BLOCK_ROLES: z.coerce.boolean().default(true),
  BLOCK_DISPOSABLE: z.coerce.boolean().default(true),
  ENABLE_SMTP_PROBE: z.coerce.boolean().default(true),
  SMTP_TIMEOUT_MS: z.coerce.number().default(5000),
  SMTP_HELO_DOMAIN: z.string().default('verifier.yourdomain.com'),
  SMTP_FROM_EMAIL: z.string().email().default('bounce@verifier.yourdomain.com'),
  DISPOSABLE_SOURCES: z
    .string()
    .default(
      'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt,https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blocklist.conf',
    )
    .transform((val) => val.split(',').map((url) => url.trim())),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables (continuing with safe defaults):',
    parsedEnv.error.flatten().fieldErrors,
  );
}

// Si el parse falla, usa los defaults del schema para no detener la app
export const config = parsedEnv.success ? parsedEnv.data : envSchema.parse({});
