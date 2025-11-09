export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogEntry = {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: unknown;
  context?: Record<string, unknown>;
};

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private level: LogLevel = "info";
  private listeners: Set<(entry: LogEntry) => void> = new Set();

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.level];
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      data,
      context,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    const consoleMethod = level === "debug" ? "debug" : level;
    if (console[consoleMethod]) {
      console[consoleMethod](`[${level.toUpperCase()}]`, message, data || "", context || "");
    }

    // Notify listeners
    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch (error) {
        console.error("[Logger] Listener error", error);
      }
    });
  }

  debug(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log("debug", message, data, context);
  }

  info(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log("info", message, data, context);
  }

  warn(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log("warn", message, data, context);
  }

  error(message: string, data?: unknown, context?: Record<string, unknown>): void {
    this.log("error", message, data, context);
  }

  subscribe(listener: (entry: LogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  clear(): void {
    this.logs = [];
  }

  getStats(): {
    total: number;
    byLevel: Record<LogLevel, number>;
    recentErrors: LogEntry[];
  } {
    const byLevel: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };

    this.logs.forEach((log) => {
      byLevel[log.level]++;
    });

    return {
      total: this.logs.length,
      byLevel,
      recentErrors: this.logs.filter((log) => log.level === "error").slice(-5),
    };
  }
}

export const logger = new Logger();

export const createLogger = (level: LogLevel = "info"): Logger => {
  const newLogger = new Logger();
  newLogger.setLevel(level);
  return newLogger;
};

