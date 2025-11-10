import { type Address } from 'viem';

export interface Analytics {
  contract: Address;
  totalTransactions: bigint;
  totalVolume: bigint;
  uniqueUsers: bigint;
  averageGas: bigint;
  lastUpdated: bigint;
}

export function createAnalytics(contract: Address): Analytics {
  return {
    contract,
    totalTransactions: BigInt(0),
    totalVolume: BigInt(0),
    uniqueUsers: BigInt(0),
    averageGas: BigInt(0),
    lastUpdated: BigInt(Date.now()),
  };
}

export function updateAnalytics(
  analytics: Analytics,
  volume: bigint,
  gasUsed: bigint
): Analytics {
  const newTxCount = analytics.totalTransactions + BigInt(1);
  const newVolume = analytics.totalVolume + volume;
  const newAvgGas =
    (analytics.averageGas * analytics.totalTransactions + gasUsed) / newTxCount;
  return {
    ...analytics,
    totalTransactions: newTxCount,
    totalVolume: newVolume,
    averageGas: newAvgGas,
    lastUpdated: BigInt(Date.now()),
  };
}

export function calculateVolumeGrowth(
  current: bigint,
  previous: bigint
): number {
  if (previous === BigInt(0)) return 0;
  return Number(((current - previous) * BigInt(10000)) / previous) / 100;
}
