import { type Address } from 'viem';

export interface ProductionMetric {
  id: bigint;
  recorder: Address;
  plantation: Address;
  metric: string;
  value: bigint;
  period: string;
  timestamp: bigint;
}

export function createProductionMetric(
  recorder: Address,
  plantation: Address,
  metric: string,
  value: bigint,
  period: string
): ProductionMetric {
  return {
    id: BigInt(0),
    recorder,
    plantation,
    metric,
    value,
    period,
    timestamp: BigInt(Date.now()),
  };
}

export function getMetricsByPlantation(
  metrics: ProductionMetric[],
  plantation: Address
): ProductionMetric[] {
  return metrics.filter((m) => m.plantation === plantation);
}

export function getMetricsByPeriod(
  metrics: ProductionMetric[],
  period: string
): ProductionMetric[] {
  return metrics.filter((m) => m.period === period);
}

export function calculateAverageMetric(
  metrics: ProductionMetric[],
  metric: string
): bigint {
  const filtered = metrics.filter((m) => m.metric === metric);
  if (filtered.length === 0) return BigInt(0);
  const total = filtered.reduce((sum, m) => sum + m.value, BigInt(0));
  return total / BigInt(filtered.length);
}

  id: bigint;
  recorder: Address;
  plantation: Address;
  metric: string;
  value: bigint;
  period: string;
  timestamp: bigint;
}

export function createProductionMetric(
  recorder: Address,
  plantation: Address,
  metric: string,
  value: bigint,
  period: string
): ProductionMetric {
  return {
    id: BigInt(0),
    recorder,
    plantation,
    metric,
    value,
    period,
    timestamp: BigInt(Date.now()),
  };
}

export function getMetricsByPlantation(
  metrics: ProductionMetric[],
  plantation: Address
): ProductionMetric[] {
  return metrics.filter((m) => m.plantation === plantation);
}

export function getMetricsByPeriod(
  metrics: ProductionMetric[],
  period: string
): ProductionMetric[] {
  return metrics.filter((m) => m.period === period);
}

export function calculateAverageMetric(
  metrics: ProductionMetric[],
  metric: string
): bigint {
  const filtered = metrics.filter((m) => m.metric === metric);
  if (filtered.length === 0) return BigInt(0);
  const total = filtered.reduce((sum, m) => sum + m.value, BigInt(0));
  return total / BigInt(filtered.length);
}
