import { type Address } from 'viem';

export interface MarketIntelligence {
  id: bigint;
  provider: Address;
  commodity: string;
  price: bigint;
  trend: 'up' | 'down' | 'stable';
  timestamp: bigint;
  txHash: string;
}

export function createIntelligence(
  provider: Address,
  commodity: string,
  price: bigint,
  trend: 'up' | 'down' | 'stable'
): MarketIntelligence {
  return {
    id: BigInt(Date.now()),
    provider,
    commodity,
    price,
    trend,
    timestamp: BigInt(Date.now()),
    txHash: '',
  };
}

export function getIntelligenceByCommodity(
  intelligence: MarketIntelligence[],
  commodity: string
): MarketIntelligence[] {
  return intelligence.filter((i) => i.commodity === commodity);
}

export function getLatestIntelligence(
  intelligence: MarketIntelligence[]
): MarketIntelligence | null {
  if (intelligence.length === 0) return null;
  return intelligence.reduce((latest, current) =>
    current.timestamp > latest.timestamp ? current : latest
  );
}

export function getTrendingCommodities(
  intelligence: MarketIntelligence[]
): string[] {
  const upTrending = intelligence
    .filter((i) => i.trend === 'up')
    .map((i) => i.commodity);
  return [...new Set(upTrending)];
}
