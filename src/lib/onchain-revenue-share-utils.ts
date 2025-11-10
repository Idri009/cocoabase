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

export function addShareholder(
  share: RevenueShare,
  shareholder: Address,
  shares: bigint
): RevenueShare {
  const newShareholders = new Map(share.shareholders);
  const existing = newShareholders.get(shareholder) || BigInt(0);
  newShareholders.set(shareholder, existing + shares);
  return {
    ...share,
    shareholders: newShareholders,
  };
}

export function recordRevenue(
  share: RevenueShare,
  amount: bigint
): RevenueShare {
  return {
    ...share,
    totalRevenue: share.totalRevenue + amount,
  };
}

export function calculateShareholderShare(
  share: RevenueShare,
  shareholder: Address
): bigint {
  const shareholderShares = share.shareholders.get(shareholder) || BigInt(0);
  const totalShares = Array.from(share.shareholders.values()).reduce(
    (sum, s) => sum + s,
    BigInt(0)
  );
  if (totalShares === BigInt(0)) return BigInt(0);
  return (share.totalRevenue * shareholderShares) / totalShares;
}
