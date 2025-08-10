import { promises as dns } from 'dns';
import { logger } from '../utils/logger.js';

export interface DnsCheckResult {
  domain_exists: boolean;
  has_mx: boolean;
  mx_records: string[];
  reason?: 'domain_not_found' | 'no_mx_records';
}

export async function checkDns(domain: string): Promise<DnsCheckResult> {
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
      return {
        domain_exists: true,
        has_mx: true,
        mx_records: sorted.map((r) => r.exchange),
      };
    }
  } catch (error: any) {
    if (error?.code !== 'ENODATA' && error?.code !== 'ENOTFOUND') {
      logger.warn({ err: error, domain }, 'Unexpected DNS MX lookup error');
    }
  }

  try {
    const [aRecords, aaaaRecords] = await Promise.all([
      dns.resolve(domain, 'A').catch(() => [] as string[]),
      dns.resolve(domain, 'AAAA').catch(() => [] as string[]),
    ]);

    if (aRecords.length > 0 || aaaaRecords.length > 0) {
      return {
        domain_exists: true,
        has_mx: false,
        mx_records: [domain],
        reason: 'no_mx_records',
      };
    }
  } catch (error: any) {
    if (error?.code !== 'ENOTFOUND') {
      logger.warn({ err: error, domain }, 'Unexpected DNS A/AAAA lookup error');
    }
  }

  return {
    domain_exists: false,
    has_mx: false,
    mx_records: [],
    reason: 'domain_not_found',
  };
}
