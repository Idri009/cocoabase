export type PerformanceMetric = {
  name: string;
  duration: number;
  timestamp: number;
};

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics: number = 100;

  start(name: string): () => void {
    const startTime = performance.now();
    const timestamp = Date.now();

    return () => {
      const duration = performance.now() - startTime;
      this.record(name, duration, timestamp);
    };
  }

  record(name: string, duration: number, timestamp: number = Date.now()): void {
    this.metrics.push({ name, duration, timestamp });
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter((m) => m.name === name);
    }
    return [...this.metrics];
  }

  getAverage(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name);
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
    return sum / filtered.length;
  }

  getSlowest(count: number = 10): PerformanceMetric[] {
    return [...this.metrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, count);
  }

  clear(): void {
    this.metrics = [];
  }

  getSummary(): {
    total: number;
    average: number;
    slowest: PerformanceMetric[];
    byName: Record<string, { count: number; average: number }>;
  } {
    const byName: Record<string, { count: number; total: number }> = {};

    this.metrics.forEach((metric) => {
      if (!byName[metric.name]) {
        byName[metric.name] = { count: 0, total: 0 };
      }
      byName[metric.name].count++;
      byName[metric.name].total += metric.duration;
    });

    const byNameSummary: Record<string, { count: number; average: number }> =
      {};
    Object.keys(byName).forEach((name) => {
      byNameSummary[name] = {
        count: byName[name].count,
        average: byName[name].total / byName[name].count,
      };
    });

    const total = this.metrics.reduce((acc, m) => acc + m.duration, 0);
    const average = this.metrics.length > 0 ? total / this.metrics.length : 0;

    return {
      total: Math.round(total * 100) / 100,
      average: Math.round(average * 100) / 100,
      slowest: this.getSlowest(5),
      byName: byNameSummary,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const end = performanceMonitor.start(name);
  try {
    const result = await fn();
    end();
    return result;
  } catch (error) {
    end();
    throw error;
  }
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  const end = performanceMonitor.start(name);
  try {
    const result = fn();
    end();
    return result;
  } catch (error) {
    end();
    throw error;
  }
};

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
};

export const memoize = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyGenerator
      ? keyGenerator(...args)
      : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
};

export const batch = <T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => Promise<void> | void
): Promise<void> => {
  return new Promise(async (resolve) => {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processor(batch);
    }
    resolve();
  });
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError || new Error("Retry failed");
};

