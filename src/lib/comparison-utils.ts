export const compare = <T>(a: T, b: T): number => {
  if (a === b) return 0;
  if (a < b) return -1;
  return 1;
};

export const compareBy = <T, K>(
  a: T,
  b: T,
  selector: (item: T) => K,
  direction: "asc" | "desc" = "asc"
): number => {
  const aValue = selector(a);
  const bValue = selector(b);
  const result = compare(aValue, bValue);
  return direction === "asc" ? result : -result;
};

export const compareMultiple = <T>(
  a: T,
  b: T,
  comparators: Array<(a: T, b: T) => number>
): number => {
  for (const comparator of comparators) {
    const result = comparator(a, b);
    if (result !== 0) return result;
  }
  return 0;
};

export const createComparator = <T>(
  selector: (item: T) => number | string,
  direction: "asc" | "desc" = "asc"
): (a: T, b: T) => number => {
  return (a: T, b: T) => {
    const aValue = selector(a);
    const bValue = selector(b);
    const result = compare(aValue, bValue);
    return direction === "asc" ? result : -result;
  };
};

export const diff = <T extends Record<string, unknown>>(
  oldObj: T,
  newObj: T
): Partial<T> => {
  const changes: Partial<T> = {};
  for (const key in newObj) {
    if (oldObj[key] !== newObj[key]) {
      changes[key] = newObj[key];
    }
  }
  return changes;
};

export const deepDiff = <T extends Record<string, unknown>>(
  oldObj: T,
  newObj: T
): Partial<T> => {
  const changes: Partial<T> = {};
  for (const key in newObj) {
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    if (typeof oldValue === "object" && typeof newValue === "object" && oldValue !== null && newValue !== null && !Array.isArray(oldValue) && !Array.isArray(newValue)) {
      const nestedChanges = deepDiff(
        oldValue as Record<string, unknown>,
        newValue as Record<string, unknown>
      );
      if (Object.keys(nestedChanges).length > 0) {
        changes[key] = nestedChanges as T[Extract<keyof T, string>];
      }
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = newValue;
    }
  }
  return changes;
};

export const isEqual = <T>(a: T, b: T): boolean => {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) {
    return false;
  }
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a) as Array<keyof T>;
    const keysB = Object.keys(b) as Array<keyof T>;
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
};

export const isGreaterThan = <T>(a: T, b: T): boolean => {
  return compare(a, b) > 0;
};

export const isLessThan = <T>(a: T, b: T): boolean => {
  return compare(a, b) < 0;
};

export const isGreaterThanOrEqual = <T>(a: T, b: T): boolean => {
  return compare(a, b) >= 0;
};

export const isLessThanOrEqual = <T>(a: T, b: T): boolean => {
  return compare(a, b) <= 0;
};

export const clamp = <T extends number | string>(value: T, min: T, max: T): T => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const min = <T>(values: T[]): T | undefined => {
  if (values.length === 0) return undefined;
  return values.reduce((acc, val) => (compare(val, acc) < 0 ? val : acc));
};

export const max = <T>(values: T[]): T | undefined => {
  if (values.length === 0) return undefined;
  return values.reduce((acc, val) => (compare(val, acc) > 0 ? val : acc));
};

export const range = (start: number, end: number, step: number = 1): number[] => {
  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i);
    }
  } else if (step < 0) {
    for (let i = start; i > end; i += step) {
      result.push(i);
    }
  }
  return result;
};

export const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);
  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }

  return 0;
};

export const compareDates = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getTime() - d2.getTime();
};

export const sortBy = <T>(
  items: T[],
  selector: (item: T) => number | string,
  direction: "asc" | "desc" = "asc"
): T[] => {
  const sorted = [...items];
  const comparator = createComparator(selector, direction);
  sorted.sort(comparator);
  return sorted;
};

export const groupBy = <T, K extends string | number>(
  items: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  const groups = {} as Record<K, T[]>;
  items.forEach((item) => {
    const key = keySelector(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });
  return groups;
};

