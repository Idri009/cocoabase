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

export function recordShareholder(
  distribution: DividendDistribution,
  shareholder: Address,
  shares: bigint
): DividendDistribution {
  const newShareholders = new Map(distribution.shareholders);
  newShareholders.set(shareholder, shares);
  return {
    ...distribution,
    shareholders: newShareholders,
  };
}

export function addDividends(
  distribution: DividendDistribution,
  amount: bigint
): DividendDistribution {
  return {
    ...distribution,
    totalDividends: distribution.totalDividends + amount,
  };
}

export function calculateDividendShare(
  distribution: DividendDistribution,
  shareholder: Address,
  totalSupply: bigint
): bigint {
  const shareholderShares = distribution.shareholders.get(shareholder) || BigInt(0);
  if (totalSupply === BigInt(0)) return BigInt(0);
  return (distribution.totalDividends * shareholderShares) / totalSupply;
}
