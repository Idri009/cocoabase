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

