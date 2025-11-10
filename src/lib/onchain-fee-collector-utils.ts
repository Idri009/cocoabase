import { type Address } from 'viem';

export interface FeeCollector {
  id: bigint;
  token: Address;
  totalFees: bigint;
  feeRate: number;
  beneficiaries: Map<Address, number>;
}

export function createFeeCollector(
  token: Address,
  feeRate: number
): FeeCollector {
  return {
    id: BigInt(0),
    token,
    totalFees: BigInt(0),
    feeRate,
    beneficiaries: new Map(),
  };
}
