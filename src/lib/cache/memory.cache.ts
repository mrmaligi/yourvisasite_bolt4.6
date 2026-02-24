interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>>;
  private defaultTTL: number; // in milliseconds

  constructor(defaultTTL = 60 * 1000) { // Default 1 minute
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Helper to get or compute if missing
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = this.defaultTTL): Promise<T> {
    const cached = this.get<T>(key);
    if (cached) {
      return cached;
    }

    const value = await fetcher();
    this.set(key, value, ttl);
    return value;
  }
}

// Export a singleton instance for global use
export const globalCache = new MemoryCache();
