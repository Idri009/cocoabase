export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const round = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

export const floor = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
};

export const ceil = (value: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
};

export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatNumber = (
  value: number,
  options?: {
    decimals?: number;
    thousandSeparator?: boolean;
    currency?: string;
  }
): string => {
  const { decimals = 0, thousandSeparator = true, currency } = options || {};

  const formatterOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: thousandSeparator,
  };

  if (currency) {
    formatterOptions.style = "currency";
    formatterOptions.currency = currency;
  }

  return new Intl.NumberFormat(undefined, formatterOptions).format(value);
};

export const parseNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value.replace(/[^\d.-]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

export const isEven = (value: number): boolean => {
  return value % 2 === 0;
};

export const isOdd = (value: number): boolean => {
  return value % 2 !== 0;
};

export const isInteger = (value: number): boolean => {
  return Number.isInteger(value);
};

export const isPositive = (value: number): boolean => {
  return value > 0;
};

export const isNegative = (value: number): boolean => {
  return value < 0;
};

export const isZero = (value: number): boolean => {
  return value === 0;
};

export const isBetween = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const toPercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

export const fromPercentage = (percentage: number, total: number): number => {
  return (percentage / 100) * total;
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * clamp(t, 0, 1);
};

export const inverseLerp = (start: number, end: number, value: number): number => {
  if (end === start) return 0;
  return clamp((value - start) / (end - start), 0, 1);
};

export const remap = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number => {
  const t = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
};

export const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

export const denormalize = (normalized: number, min: number, max: number): number => {
  return normalized * (max - min) + min;
};

export const sum = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val, 0);
};

export const average = (values: number[]): number => {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
};

export const median = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
};

export const mode = (values: number[]): number | null => {
  if (values.length === 0) return null;
  const frequency: Record<number, number> = {};
  values.forEach((val) => {
    frequency[val] = (frequency[val] || 0) + 1;
  });
  let maxFreq = 0;
  let modeValue: number | null = null;
  Object.keys(frequency).forEach((key) => {
    const freq = frequency[Number(key)];
    if (freq > maxFreq) {
      maxFreq = freq;
      modeValue = Number(key);
    }
  });
  return modeValue;
};

export const min = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.min(...values);
};

export const max = (values: number[]): number => {
  if (values.length === 0) return 0;
  return Math.max(...values);
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

export const gcd = (a: number, b: number): number => {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
};

export const lcm = (a: number, b: number): number => {
  return Math.abs(a * b) / gcd(a, b);
};

export const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

export const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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

export const formatFileSize = (bytes: number): string => {
  return formatBytes(bytes);
};

export const padNumber = (value: number, length: number, pad: string = "0"): string => {
  return value.toString().padStart(length, pad);
};

