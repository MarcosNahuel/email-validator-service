import IORedis, { RedisOptions } from 'ioredis';
import { LRUCache } from 'lru-cache';
import { config } from '../config.js';
import { logger } from './logger.js';

export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
  connect?(): Promise<void>;
  disconnect?(): void;
}

class RedisCache implements CacheClient {
  private client: any;

  constructor(url: string) {
    const opts: RedisOptions = {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    } as RedisOptions;
    this.client = new (IORedis as any)(url, opts);

    this.client.on('error', (err: any) => {
      logger.error({ err }, 'Redis connection error');
    });
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async connect(): Promise<void> {
    // ioredis connects automatically on first command; ensure readiness with a ping
    try {
      await (this.client as any).connect?.();
    } catch {}
    await this.client.ping();
    logger.info('Successfully connected to Redis.');
  }

  disconnect(): void {
    (this.client as any).disconnect?.();
  }
}

class MemoryCache implements CacheClient {
  private client: LRUCache<string, string>;

  constructor() {
    this.client = new LRUCache<string, string>({
      max: 5000,
      ttl: config.CACHE_TTL_SECONDS * 1000,
    });
    logger.info('Using in-memory LRU cache.');
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key) ?? null;
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    this.client.set(key, value, { ttl: ttlSeconds * 1000 });
  }

  async del(key: string): Promise<void> {
    this.client.delete(key);
  }
}

export const cache: CacheClient = config.REDIS_URL
  ? new RedisCache(config.REDIS_URL)
  : new MemoryCache();
