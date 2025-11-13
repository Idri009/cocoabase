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