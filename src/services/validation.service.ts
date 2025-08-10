import { createHash } from 'crypto';
import { checkDns, DnsCheckResult } from '../checks/dns.js';
import { checkSmtp, SmtpCheckResult } from '../checks/smtp.js';
import { checkSyntax, SyntaxCheckResult } from '../checks/syntax.js';
import { config } from '../config.js';
import { cache } from '../utils/cache.js';
import { logger } from '../utils/logger.js';

export type ValidationStatus =
  | 'deliverable'
  | 'risky'
  | 'undeliverable'
  | 'unknown';

export interface ValidationResult {
  email: string;
  normalized: string;
  valid_syntax: boolean;
  domain_exists: boolean;
  has_mx: boolean;
  is_disposable: boolean;
  is_role: boolean;
  smtp: SmtpCheckResult;
  score: number;
  status: ValidationStatus;
  reasons: string[];
  checked_at: string;
  ttl_seconds: number;
}

type BaseResult = Pick<
  ValidationResult,
  | 'email'
  | 'normalized'
  | 'valid_syntax'
  | 'domain_exists'
  | 'has_mx'
  | 'is_disposable'
  | 'is_role'
  | 'smtp'
>;

function calculateScore(result: BaseResult): number {
  let score = 0;
  if (result.valid_syntax) score += 0.25;
  if (result.domain_exists && result.has_mx) score += 0.25;
  if (!result.is_disposable) score += 0.2;
  if (!result.is_role) score += 0.1;
  if (
    result.smtp.enabled &&
    result.smtp.deliverable &&
    !result.smtp.catch_all_suspected
  )
    score += 0.2;
  return parseFloat(score.toFixed(2));
}

function determineStatus(result: BaseResult): {
  status: ValidationStatus;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!result.valid_syntax) {
    reasons.push('invalid_syntax');
    return { status: 'undeliverable', reasons };
  }
  if (!result.domain_exists) {
    reasons.push('domain_not_found');
    return { status: 'undeliverable', reasons };
  }
  if (!result.has_mx) {
    reasons.push('no_mx_or_a_record');
    return { status: 'undeliverable', reasons };
  }
  if (
    result.smtp.enabled &&
    result.smtp.connection === 'ok' &&
    !result.smtp.deliverable
  ) {
    reasons.push('smtp_rejection');
    return { status: 'undeliverable', reasons };
  }

  let isRisky = false;
  if (result.is_disposable) {
    reasons.push('disposable_email');
    isRisky = true;
  }
  if (result.is_role) {
    reasons.push('role_email');
    isRisky = true;
  }
  if (result.smtp.catch_all_suspected) {
    reasons.push('catch_all_domain');
    isRisky = true;
  }
  if (
    result.smtp.enabled &&
    result.smtp.connection !== 'ok' &&
    result.smtp.connection !== 'not_checked'
  ) {
    reasons.push(`smtp_${result.smtp.connection}`);
    isRisky = true;
  }

  if (isRisky) {
    return { status: 'risky', reasons };
  }

  if (result.smtp.enabled && result.smtp.connection !== 'ok') {
    reasons.push('smtp_probe_failed');
    return { status: 'unknown', reasons };
  }

  reasons.push('ok');
  return { status: 'deliverable', reasons };
}

export async function validateEmail(email: string): Promise<ValidationResult> {
  const log = logger.child({ email });

  const syntaxResult: SyntaxCheckResult = checkSyntax(email);
  const cacheKey = `email:${createHash('sha256').update(syntaxResult.normalized).digest('hex')}`;

  const cachedResult = await cache.get(cacheKey);
  if (cachedResult) {
    log.info('Returning cached result');
    return JSON.parse(cachedResult) as ValidationResult;
  }

  if (!syntaxResult.valid_syntax) {
    const result: ValidationResult = {
      email,
      ...syntaxResult,
      domain_exists: false,
      has_mx: false,
      smtp: {
        enabled: false,
        connection: 'not_checked',
        deliverable: false,
        catch_all_suspected: false,
        notes: 'Syntax invalid',
      },
      score: 0,
      status: 'undeliverable',
      reasons: ['invalid_syntax'],
      checked_at: new Date().toISOString(),
      ttl_seconds: config.CACHE_TTL_SECONDS,
    };
    await cache.set(cacheKey, JSON.stringify(result), config.CACHE_TTL_SECONDS);
    return result;
  }

  const dnsResult: DnsCheckResult = await checkDns(syntaxResult.domain);
  if (!dnsResult.domain_exists || !dnsResult.has_mx) {
    const partial = { email, ...syntaxResult, ...dnsResult } as const;
    const statusResult = determineStatus({
      email: partial.email,
      normalized: partial.normalized,
      valid_syntax: partial.valid_syntax,
      domain_exists: partial.domain_exists,
      has_mx: partial.has_mx,
      is_disposable: partial.is_disposable,
      is_role: partial.is_role,
      smtp: {
        enabled: false,
        connection: 'not_checked',
        deliverable: false,
        catch_all_suspected: false,
        notes: '',
      },
    });
    const score = calculateScore({
      email: partial.email,
      normalized: partial.normalized,
      valid_syntax: partial.valid_syntax,
      domain_exists: partial.domain_exists,
      has_mx: partial.has_mx,
      is_disposable: partial.is_disposable,
      is_role: partial.is_role,
      smtp: {
        enabled: false,
        connection: 'not_checked',
        deliverable: false,
        catch_all_suspected: false,
        notes: '',
      },
    });

    const result: ValidationResult = {
      ...partial,
      smtp: {
        enabled: config.ENABLE_SMTP_PROBE,
        connection: 'not_checked',
        deliverable: false,
        catch_all_suspected: false,
        notes: 'DNS check failed',
      },
      score,
      ...statusResult,
      checked_at: new Date().toISOString(),
      ttl_seconds: config.CACHE_TTL_SECONDS,
    } as ValidationResult;
    await cache.set(cacheKey, JSON.stringify(result), config.CACHE_TTL_SECONDS);
    return result;
  }

  const smtpResult = await checkSmtp(
    dnsResult.mx_records,
    syntaxResult.normalized,
    syntaxResult.domain,
  );

  const combined = {
    email,
    ...syntaxResult,
    ...dnsResult,
    smtp: smtpResult,
  } as const;

  const score = calculateScore({
    email: combined.email,
    normalized: combined.normalized,
    valid_syntax: combined.valid_syntax,
    domain_exists: combined.domain_exists,
    has_mx: combined.has_mx,
    is_disposable: combined.is_disposable,
    is_role: combined.is_role,
    smtp: combined.smtp,
  });
  const { status, reasons } = determineStatus({
    email: combined.email,
    normalized: combined.normalized,
    valid_syntax: combined.valid_syntax,
    domain_exists: combined.domain_exists,
    has_mx: combined.has_mx,
    is_disposable: combined.is_disposable,
    is_role: combined.is_role,
    smtp: combined.smtp,
  });

  const finalResult: ValidationResult = {
    ...(combined as any),
    score,
    status,
    reasons,
    checked_at: new Date().toISOString(),
    ttl_seconds: config.CACHE_TTL_SECONDS,
  };

  log.info(
    {
      status: finalResult.status,
      score: finalResult.score,
      reasons: finalResult.reasons,
    },
    'Validation complete',
  );
  await cache.set(
    cacheKey,
    JSON.stringify(finalResult),
    config.CACHE_TTL_SECONDS,
  );
  return finalResult;
}
