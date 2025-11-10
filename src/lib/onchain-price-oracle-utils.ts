import { type Address } from 'viem';

export interface PriceOracle {
  id: bigint;
  asset: string;
  price: bigint;
  decimals: number;
  lastUpdated: bigint;
  confidence: number;
}

export function createPriceOracle(
  asset: string,
  price: bigint,
  decimals: number
): PriceOracle {
  return {
    id: BigInt(0),
    asset,
    price,
    decimals,
    lastUpdated: BigInt(Date.now()),
    confidence: 100,
  };
}

export function updateOraclePrice(
  oracle: PriceOracle,
  newPrice: bigint,
  confidence: number
): PriceOracle {
  return {
    ...oracle,
    price: newPrice,
    confidence,
    lastUpdated: BigInt(Date.now()),
  };
}

export function isOracleStale(
  oracle: PriceOracle,
  maxAge: bigint,
  currentTime: bigint
): boolean {
  return currentTime - oracle.lastUpdated > maxAge;
}

export function calculatePriceDeviation(
  oracle: PriceOracle,
  marketPrice: bigint
): number {
  if (oracle.price === BigInt(0)) return 0;
  const diff = oracle.price > marketPrice
    ? oracle.price - marketPrice
    : marketPrice - oracle.price;
  return Number((diff * BigInt(10000)) / oracle.price) / 100;
}
