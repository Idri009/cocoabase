export class Timer {
  private timeoutId: NodeJS.Timeout | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private startTime: number = 0;
  private elapsed: number = 0;
  private isRunning: boolean = false;

  start(callback: () => void, delay: number): void {
    this.stop();
    this.startTime = Date.now();
    this.isRunning = true;
    this.timeoutId = setTimeout(() => {
      callback();
      this.isRunning = false;
    }, delay);
  }

  startInterval(callback: () => void, interval: number): void {
    this.stop();
    this.isRunning = true;
    this.intervalId = setInterval(callback, interval);
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.isRunning) {
      this.elapsed += Date.now() - this.startTime;
    }
    this.isRunning = false;
  }

  reset(): void {
    this.stop();
    this.elapsed = 0;
    this.startTime = 0;
  }

  getElapsed(): number {
    if (this.isRunning) {
      return this.elapsed + (Date.now() - this.startTime);
    }
    return this.elapsed;
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export const createTimer = (): Timer => {
  return new Timer();
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  fn: T,
  delayMs: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delayMs) {
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
      }, delayMs - timeSinceLastCall);
    }
  };
};

export const createInterval = (
  callback: () => void,
  interval: number
): (() => void) => {
  const id = setInterval(callback, interval);
  return () => clearInterval(id);
};

export const createTimeout = (
  callback: () => void,
  delay: number
): (() => void) => {
  const id = setTimeout(callback, delay);
  return () => clearTimeout(id);
};

export const requestAnimationFrame = (callback: () => void): number => {
  if (typeof window === "undefined") {
    return setTimeout(callback, 16) as unknown as number;
  }
  return window.requestAnimationFrame(callback);
};

export const cancelAnimationFrame = (id: number): void => {
  if (typeof window === "undefined") {
    clearTimeout(id);
    return;
  }
  window.cancelAnimationFrame(id);
};

export const createAnimationLoop = (
  callback: (deltaTime: number) => void
): (() => void) => {
  let lastTime = 0;
  let animationId: number | null = null;
  let isRunning = false;

  const loop = (currentTime: number) => {
    if (!isRunning) return;

    const deltaTime = lastTime === 0 ? 0 : currentTime - lastTime;
    lastTime = currentTime;

    callback(deltaTime);
    animationId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (isRunning) return;
    isRunning = true;
    lastTime = 0;
    animationId = requestAnimationFrame(loop);
  };

  const stop = () => {
    isRunning = false;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  start();

  return stop;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

export const parseDuration = (duration: string): number => {
  const units: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };

  const match = duration.match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/i);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const unit = (match[2] || "ms").toLowerCase();
  const multiplier = units[unit] || 1;

  return Math.round(value * multiplier);
};

export const countdown = (
  duration: number,
  onTick: (remaining: number) => void,
  onComplete: () => void
): (() => void) => {
  let remaining = duration;
  const interval = setInterval(() => {
    remaining -= 1000;
    if (remaining <= 0) {
      clearInterval(interval);
      onComplete();
    } else {
      onTick(remaining);
    }
  }, 1000);

  return () => clearInterval(interval);
};

export const stopwatch = (
  onTick: (elapsed: number) => void,
  interval: number = 100
): (() => void) => {
  let startTime = Date.now();
  const id = setInterval(() => {
    const elapsed = Date.now() - startTime;
    onTick(elapsed);
  }, interval);

  return () => {
    clearInterval(id);
  };
};

