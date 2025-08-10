import { promises as dns } from 'dns';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';

async function resolveMxViaDoH(domain: string): Promise<string[]> {
  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
      domain,
    )}&type=MX`;
    const res = await fetch(url, {
      headers: { accept: 'application/dns-json' },
      signal: AbortSignal.timeout(config.DNS_TIMEOUT_MS),
    } as any);
    if (!res.ok) return [];
    const data: any = await res.json();
    const answers: any[] = data.Answer || [];
    const mxHosts: { priority: number; exchange: string }[] = answers
      .map((a) => String(a.data || ''))
      .map((line) => line.trim())
      .filter((line) => /\s/.test(line))
      .map((line) => {
        const [prioStr, host] = line.split(/\s+/, 2);
        const exchange = host?.replace(/\.$/, '') || '';
        return { priority: parseInt(prioStr, 10) || 0, exchange };
      });
    mxHosts.sort((a, b) => a.priority - b.priority);
    return mxHosts.map((m) => m.exchange).filter(Boolean);
  } catch (err) {
    return [];
  }
}

export interface DnsCheckResult {
  domain_exists: boolean;
  has_mx: boolean;
  mx_records: string[];
  reason?: 'domain_not_found' | 'no_mx_records';
}

export async function checkDns(domain: string): Promise<DnsCheckResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.DNS_TIMEOUT_MS);
    // dns.resolveMx no acepta AbortController, así que aplicamos timeout manual con Promise.race
    const mxRecords = (await Promise.race([
      dns.resolveMx(domain),
      new Promise<any[]>((_, rej) =>
        setTimeout(
          () => rej(new Error('DNS_MX_TIMEOUT')),
          config.DNS_TIMEOUT_MS,
        ),
      ),
    ])) as any[];
    clearTimeout(timeout);
    if (mxRecords && mxRecords.length > 0) {
      const sorted = mxRecords.sort((a, b) => a.priority - b.priority);
      return {
        domain_exists: true,
        has_mx: true,
        mx_records: sorted.map((r) => r.exchange),
      };
    }
  } catch (error: any) {
    if (
      error?.code !== 'ENODATA' &&
      error?.code !== 'ENOTFOUND' &&
      error?.message !== 'DNS_MX_TIMEOUT'
    ) {
      logger.warn({ err: error, domain }, 'Unexpected DNS MX lookup error');
    }
  }

  // Fallback: DoH (DNS over HTTPS) para entornos donde el UDP/53 está bloqueado
  try {
    const mxViaDoh = await resolveMxViaDoH(domain);
    if (mxViaDoh.length > 0) {
      return { domain_exists: true, has_mx: true, mx_records: mxViaDoh };
    }
  } catch {}

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
