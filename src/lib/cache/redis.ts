// In-memory + Upstash Redis abstraction layer with TTL support
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryStore = new Map<string, CacheEntry<unknown>>();

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const entry = memoryStore.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return entry.data as T;
  },

  async set<T>(key: string, data: T, ttlSeconds = 900): Promise<void> {
    memoryStore.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  },

  async del(key: string): Promise<void> {
    memoryStore.delete(key);
  },

  size(): number {
    return memoryStore.size;
  }
};
