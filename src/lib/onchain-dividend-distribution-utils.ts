import { type Address } from 'viem';

export interface DividendDistribution {
  id: bigint;
  token: Address;
  dividendToken: Address;
  totalDividends: bigint;
  shareholders: Map<Address, bigint>;
  distributionDate: bigint;
}

export function createDividendDistribution(
  token: Address,
  dividendToken: Address,
  distributionDate: bigint
): DividendDistribution {
  return {
    id: BigInt(0),
    token,
    dividendToken,
    totalDividends: BigInt(0),
    shareholders: new Map(),
    distributionDate,
  };
}

