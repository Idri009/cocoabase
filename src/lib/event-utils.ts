export type EventHandler<T = unknown> = (event: T) => void | Promise<void>;

class EventEmitter<T extends Record<string, unknown>> {
  private listeners: Map<keyof T, Set<EventHandler>> = new Map();

  on<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    return () => {
      this.off(event, handler);
    };
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`[EventEmitter] Error in handler for ${String(event)}`, error);
        }
      });
    }
  }

  once<K extends keyof T>(event: K, handler: EventHandler<T[K]>): () => void {
    const onceHandler: EventHandler<T[K]> = (data) => {
      handler(data);
      this.off(event, onceHandler);
    };
    return this.on(event, onceHandler);
  }

  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.size || 0;
  }

  eventNames(): Array<keyof T> {
    return Array.from(this.listeners.keys());
  }
}

export const createEventEmitter = <T extends Record<string, unknown>>(): EventEmitter<T> => {
  return new EventEmitter<T>();
};

export const debounceEvent = <T>(
  handler: EventHandler<T>,
  delay: number
): EventHandler<T> => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (event: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      handler(event);
      timeoutId = null;
    }, delay);
  };
};

export const throttleEvent = <T>(
  handler: EventHandler<T>,
  delay: number
): EventHandler<T> => {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return (event: T) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      handler(event);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        handler(event);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
};

export const createCustomEvent = <T>(type: string, detail: T): CustomEvent<T> => {
  return new CustomEvent(type, { detail });
};

export const dispatchCustomEvent = <T>(element: Element, type: string, detail: T): boolean => {
  const event = createCustomEvent(type, detail);
  return element.dispatchEvent(event);
};

export const listenToCustomEvent = <T>(
  element: Element,
  type: string,
  handler: (event: CustomEvent<T>) => void
): () => void => {
  const listener = (e: Event) => {
    handler(e as CustomEvent<T>);
  };
  element.addEventListener(type, listener);
  return () => {
    element.removeEventListener(type, listener);
  };
};

