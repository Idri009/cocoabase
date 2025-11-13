import { type Address } from 'viem';

export interface AnalyticsData {
  id: bigint;
  analyst: Address;
  metric: string;
  value: bigint;
  timestamp: bigint;
}

export function createAnalyticsData(
  analyst: Address,
  metric: string,
  value: bigint
): AnalyticsData {
  return {
    id: BigInt(Date.now()),
    analyst,
    metric,
    value,
    timestamp: BigInt(Date.now()),
  };
}

export function getAverageValue(
  data: AnalyticsData[],
  metric: string
): number {
  const filtered = data.filter((d) => d.metric === metric);
  if (filtered.length === 0) return 0;
  const total = filtered.reduce((sum, d) => sum + Number(d.value), 0);
  return total / filtered.length;
}

export function getDataByMetric(
  data: AnalyticsData[],
  metric: string
): AnalyticsData[] {
  return data.filter((d) => d.metric === metric);
}