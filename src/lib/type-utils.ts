export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === "boolean";
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isFunction = (value: unknown): value is Function => {
  return typeof value === "function";
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNullish = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const isDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

export const isError = (value: unknown): value is Error => {
  return value instanceof Error;
};

export const isPromise = <T = unknown>(value: unknown): value is Promise<T> => {
  return value instanceof Promise || (isObject(value) && "then" in value && isFunction((value as { then: unknown }).then));
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!isObject(value)) return false;
  if (Object.getPrototypeOf(value) === null) return true;
  return Object.getPrototypeOf(value) === Object.prototype;
};

export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (isString(value) || isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  if (isNumber(value)) return value === 0;
  return false;
};

export const isEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (typeof a !== typeof b) return false;

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  if (isDate(a) && isDate(b)) {
    return a.getTime() === b.getTime();
  }

  return false;
};

export const isInstanceOf = <T>(value: unknown, constructor: new (...args: unknown[]) => T): value is T => {
  return value instanceof constructor;
};

export const hasProperty = <K extends string>(
  value: unknown,
  key: K
): value is Record<K, unknown> => {
  return isObject(value) && key in value;
};

export const hasMethod = <K extends string>(
  value: unknown,
  method: K
): value is Record<K, Function> => {
  return isObject(value) && method in value && isFunction(value[method]);
};

export const getType = (value: unknown): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (isArray(value)) return "array";
  if (isDate(value)) return "date";
  if (isError(value)) return "error";
  if (isPromise(value)) return "promise";
  return typeof value;
};

export const toType = <T>(value: unknown, type: string): T | null => {
  try {
    switch (type.toLowerCase()) {
      case "string":
        return String(value) as T;
      case "number":
        return Number(value) as T;
      case "boolean":
        return Boolean(value) as T;
      case "object":
        return (typeof value === "string" ? JSON.parse(value) : value) as T;
      case "array":
        return (isArray(value) ? value : [value]) as T;
      default:
        return null;
    }
  } catch {
    return null;
  }
};

export const cast = <T>(value: unknown): T => {
  return value as T;
};

export const assert = (condition: boolean, message?: string): asserts condition => {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
};

export const assertIsString = (value: unknown, message?: string): asserts value is string => {
  if (!isString(value)) {
    throw new Error(message || "Expected string");
  }
};

export const assertIsNumber = (value: unknown, message?: string): asserts value is number => {
  if (!isNumber(value)) {
    throw new Error(message || "Expected number");
  }
};

export const assertIsObject = (value: unknown, message?: string): asserts value is Record<string, unknown> => {
  if (!isObject(value)) {
    throw new Error(message || "Expected object");
  }
};

export const assertIsArray = (value: unknown, message?: string): asserts value is unknown[] => {
  if (!isArray(value)) {
    throw new Error(message || "Expected array");
  }
};

export const ensure = <T>(value: T | null | undefined, defaultValue: T): T => {
  return value ?? defaultValue;
};

export const ensureString = (value: unknown, defaultValue: string = ""): string => {
  return isString(value) ? value : defaultValue;
};

export const ensureNumber = (value: unknown, defaultValue: number = 0): number => {
  return isNumber(value) ? value : defaultValue;
};

export const ensureBoolean = (value: unknown, defaultValue: boolean = false): boolean => {
  return isBoolean(value) ? value : defaultValue;
};

export const ensureArray = <T>(value: unknown, defaultValue: T[] = []): T[] => {
  return isArray(value) ? (value as T[]) : defaultValue;
};

export const ensureObject = (value: unknown, defaultValue: Record<string, unknown> = {}): Record<string, unknown> => {
  return isObject(value) ? value : defaultValue;
};

