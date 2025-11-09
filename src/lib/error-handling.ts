export type ErrorInfo = {
  message: string;
  code?: string;
  details?: unknown;
  timestamp: number;
  context?: Record<string, unknown>;
};

class ErrorHandler {
  private errors: ErrorInfo[] = [];
  private maxErrors: number = 50;
  private listeners: Set<(error: ErrorInfo) => void> = new Set();

  handle(error: Error | string, context?: Record<string, unknown>): void {
    const errorInfo: ErrorInfo = {
      message: error instanceof Error ? error.message : error,
      code: error instanceof Error ? error.name : undefined,
      details: error instanceof Error ? error.stack : undefined,
      timestamp: Date.now(),
      context,
    };

    this.errors.push(errorInfo);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(errorInfo);
      } catch (e) {
        console.error("[error-handler] Listener error", e);
      }
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[error-handler]", errorInfo);
    }
  }

  subscribe(listener: (error: ErrorInfo) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  getRecentErrors(count: number = 10): ErrorInfo[] {
    return this.errors.slice(-count);
  }

  clear(): void {
    this.errors = [];
  }

  getErrorSummary(): {
    total: number;
    recent: ErrorInfo[];
    byCode: Record<string, number>;
  } {
    const byCode: Record<string, number> = {};

    this.errors.forEach((error) => {
      const code = error.code || "unknown";
      byCode[code] = (byCode[code] || 0) + 1;
    });

    return {
      total: this.errors.length,
      recent: this.getRecentErrors(5),
      byCode,
    };
  }
}

export const errorHandler = new ErrorHandler();

export const createErrorBoundary = (
  fn: () => void | Promise<void>,
  onError?: (error: Error) => void
): (() => void | Promise<void>) => {
  return async () => {
    try {
      await fn();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorHandler.handle(err);
      onError?.(err);
    }
  };
};

export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    errorHandler.handle(error instanceof Error ? error : new Error(String(error)));
    return fallback;
  }
};

export const safeSync = <T>(fn: () => T, fallback?: T): T | undefined => {
  try {
    return fn();
  } catch (error) {
    errorHandler.handle(error instanceof Error ? error : new Error(String(error)));
    return fallback;
  }
};

export const withErrorHandling = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  onError?: (error: Error) => void
): T => {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      errorHandler.handle(err);
      onError?.(err);
      throw err;
    }
  }) as T;
};

