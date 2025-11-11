import { type Address } from 'viem';

export interface ProductionAnalytics {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  metric: string;
  value: bigint;
  period: string;
  recordedDate: bigint;
  txHash: string;
}

export function recordProductionMetric(
  owner: Address,
  plantationId: bigint,
  metric: string,
  value: bigint,
  period: string
): ProductionAnalytics {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    metric,
    value,
    period,
    recordedDate: BigInt(Date.now()),
    txHash: '',
  };
}
