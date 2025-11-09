export type CacheOptions = {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items
};

type CacheEntry<T> = {
  value: T;
  timestamp: number;
  ttl?: number;
};

class Cache<K, V> {
  private cache: Map<K, CacheEntry<V>> = new Map();
  private options: CacheOptions;

  constructor(options: CacheOptions = {}) {
    this.options = options;
  }

  set(key: K, value: V, ttl?: number): void {
    const entry: CacheEntry<V> = {
      value,
      timestamp: Date.now(),
      ttl: ttl ?? this.options.ttl,
    };

    if (this.options.maxSize && this.cache.size >= this.options.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, entry);
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      return undefined;
    }

    if (entry.ttl) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
        return undefined;
      }
    }

    return entry.value;
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (entry.ttl) {
      const age = Date.now() - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
        return false;
      }
    }

    return true;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): K[] {
    return Array.from(this.cache.keys());
  }

  values(): V[] {
    return Array.from(this.cache.values())
      .filter((entry) => {
        if (entry.ttl) {
          const age = Date.now() - entry.timestamp;
          if (age > entry.ttl) {
            return false;
          }
        }
        return true;
      })
      .map((entry) => entry.value);
  }

  entries(): Array<[K, V]> {
    return Array.from(this.cache.entries())
      .filter(([_, entry]) => {
        if (entry.ttl) {
          const age = Date.now() - entry.timestamp;
          if (age > entry.ttl) {
            return false;
          }
        }
        return true;
      })
      .map(([key, entry]) => [key, entry.value]);
  }

  cleanup(): number {
    let cleaned = 0;
    const now = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    });

    return cleaned;
  }

  getStats(): {
    size: number;
    maxSize?: number;
    hitRate?: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
    };
  }
}

export const createCache = <K, V>(options: CacheOptions = {}): Cache<K, V> => {
  return new Cache<K, V>(options);
};

export const createLRUCache = <K, V>(maxSize: number): Cache<K, V> => {
  const cache = new Cache<K, V>({ maxSize });
  const accessOrder: K[] = [];

  const originalGet = cache.get.bind(cache);
  const originalSet = cache.set.bind(cache);

  cache.get = (key: K) => {
    const index = accessOrder.indexOf(key);
    if (index !== -1) {
      accessOrder.splice(index, 1);
      accessOrder.push(key);
    }
    return originalGet(key);
  };

  cache.set = (key: K, value: V, ttl?: number) => {
    if (!cache.has(key)) {
      if (accessOrder.length >= maxSize) {
        const oldest = accessOrder.shift();
        if (oldest !== undefined) {
          cache.delete(oldest);
        }
      }
      accessOrder.push(key);
    } else {
      const index = accessOrder.indexOf(key);
      if (index !== -1) {
        accessOrder.splice(index, 1);
        accessOrder.push(key);
      }
    }
    originalSet(key, value, ttl);
  };

  return cache;
};

export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: CacheOptions = {}
): T => {
  const cache = createCache<string, ReturnType<T>>(options);

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
};

