export type QueueItem<T> = {
  id: string;
  data: T;
  priority?: number;
  timestamp: number;
};

class Queue<T> {
  private items: QueueItem<T>[] = [];
  private maxSize?: number;

  constructor(maxSize?: number) {
    this.maxSize = maxSize;
  }

  enqueue(item: T, priority: number = 0): string {
    const queueItem: QueueItem<T> = {
      id: this.generateId(),
      data: item,
      priority,
      timestamp: Date.now(),
    };

    if (this.maxSize && this.items.length >= this.maxSize) {
      this.dequeue();
    }

    this.items.push(queueItem);
    this.sortByPriority();
    return queueItem.id;
  }

  dequeue(): T | undefined {
    const item = this.items.shift();
    return item?.data;
  }

  peek(): T | undefined {
    return this.items[0]?.data;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toArray(): T[] {
    return this.items.map((item) => item.data);
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  private sortByPriority(): void {
    this.items.sort((a, b) => {
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return a.timestamp - b.timestamp;
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

export const createQueue = <T>(maxSize?: number): Queue<T> => {
  return new Queue<T>(maxSize);
};

export class PriorityQueue<T> {
  private items: Array<{ priority: number; data: T }> = [];

  enqueue(data: T, priority: number): void {
    this.items.push({ priority, data });
    this.items.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.data;
  }

  peek(): T | undefined {
    return this.items[0]?.data;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

export const createPriorityQueue = <T>(): PriorityQueue<T> => {
  return new PriorityQueue<T>();
};

export class CircularQueue<T> {
  private items: (T | undefined)[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;

  constructor(size: number) {
    this.items = new Array(size);
  }

  enqueue(item: T): boolean {
    if (this.isFull()) {
      return false;
    }
    this.items[this.rear] = item;
    this.rear = (this.rear + 1) % this.items.length;
    this.count++;
    return true;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.front];
    this.items[this.front] = undefined;
    this.front = (this.front + 1) % this.items.length;
    this.count--;
    return item;
  }

  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.front];
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.items.length;
  }

  size(): number {
    return this.count;
  }

  clear(): void {
    this.items = new Array(this.items.length);
    this.front = 0;
    this.rear = 0;
    this.count = 0;
  }
}

export const createCircularQueue = <T>(size: number): CircularQueue<T> => {
  return new CircularQueue<T>(size);
};

