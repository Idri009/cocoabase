import { type Address } from 'viem';

export interface RevenueShare {
  id: bigint;
  token: Address;
  totalRevenue: bigint;
  shareholders: Map<Address, bigint>;
  distributionPeriod: bigint;
}

export function createRevenueShare(
  token: Address,
  distributionPeriod: bigint
): RevenueShare {
  return {
    id: BigInt(0),
    token,
    totalRevenue: BigInt(0),
    shareholders: new Map(),
    distributionPeriod,
  };
}
