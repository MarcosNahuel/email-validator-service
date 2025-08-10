import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FALLBACK_LIST_PATH = path.join(
  __dirname,
  'disposable_domains.fallback.json',
);

let disposableDomains = new Set<string>();

async function fetchFromSource(url: string): Promise<string[] | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      logger.warn(
        `Failed to fetch disposable list from ${url}: ${response.statusText}`,
      );
      return;
    }
    const text = await response.text();
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !!line && !line.startsWith('#'))
      .map((d) => d.toLowerCase());
  } catch (error) {
    logger.error({ err: error, url }, 'Error fetching disposable list');
    return;
  }
}

async function loadFallbackList(): Promise<Set<string>> {
  try {
    const data = await fs.readFile(FALLBACK_LIST_PATH, 'utf-8');
    const domains: string[] = JSON.parse(data);
    logger.info(
      `Loaded ${domains.length} disposable domains from fallback list.`,
    );
    return new Set(domains);
  } catch (error) {
    logger.warn(
      { err: error },
      'Fallback disposable list missing, using small hardcoded list.',
    );
    return new Set(['yopmail.com', 'mailinator.com', 'temp-mail.org']);
  }
}

export async function updateDisposableDomains(): Promise<void> {
  logger.info('Updating disposable domain list...');
  const allDomains = new Set<string>();

  const results = await Promise.all(
    config.DISPOSABLE_SOURCES.map((u) => fetchFromSource(u)),
  );
  results
    .filter((arr): arr is string[] => Array.isArray(arr))
    .flat()
    .forEach((domain) => allDomains.add(domain));

  if (allDomains.size > 0) {
    disposableDomains = allDomains;
    logger.info(
      `Updated disposable domain list with ${disposableDomains.size} domains.`,
    );
    try {
      await fs.writeFile(
        FALLBACK_LIST_PATH,
        JSON.stringify(Array.from(disposableDomains)),
      );
      logger.info('Updated fallback disposable domain list file.');
    } catch (error) {
      logger.error({ err: error }, 'Could not write updated fallback list.');
    }
  } else {
    logger.warn(
      'Failed to fetch any new disposable domains. Using existing or fallback list.',
    );
    if (disposableDomains.size === 0) {
      disposableDomains = await loadFallbackList();
    }
  }
}

export async function initializeDisposableService(): Promise<void> {
  disposableDomains = await loadFallbackList();
  updateDisposableDomains().catch((err) =>
    logger.error({ err }, 'Background disposable update failed.'),
  );
  setInterval(updateDisposableDomains, 24 * 60 * 60 * 1000);
}

export function isDisposable(domain: string): boolean {
  if (!config.BLOCK_DISPOSABLE) return false;
  return disposableDomains.has(domain);
}

// Create a fallback file if it doesn't exist (best-effort)
fs.access(FALLBACK_LIST_PATH).catch(async () => {
  try {
    await fs.writeFile(
      FALLBACK_LIST_PATH,
      JSON.stringify(['yopmail.com', 'mailinator.com', 'temp-mail.org']),
    );
  } catch {}
});
