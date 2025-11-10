import { type Address } from 'viem';

export interface FeeCollector {
  id: bigint;
  token: Address;
  totalFees: bigint;
  collectedFees: bigint;
  feeRate: number;
}

export function createFeeCollector(
  token: Address,
  feeRate: number
): FeeCollector {
  return {
    id: BigInt(0),
    token,
    totalFees: BigInt(0),
    collectedFees: BigInt(0),
    feeRate,
  };
}

export function collectFee(
  collector: FeeCollector,
  amount: bigint
): FeeCollector {
  const fee = (amount * BigInt(Math.floor(collector.feeRate * 100))) / BigInt(10000);
  return {
    ...collector,
    totalFees: collector.totalFees + fee,
  };
}

export function withdrawFees(
  collector: FeeCollector,
  amount: bigint
): FeeCollector | null {
  if (collector.collectedFees + amount > collector.totalFees) return null;
  return {
    ...collector,
    collectedFees: collector.collectedFees + amount,
  };
}

export function calculateAvailableFees(collector: FeeCollector): bigint {
  return collector.totalFees - collector.collectedFees;
}
