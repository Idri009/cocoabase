import { type Address } from 'viem';

export interface PriceOracle {
  id: bigint;
  provider: Address;
  commodity: string;
  price: bigint;
  timestamp: bigint;
  txHash: string;
}

export function updatePrice(
  provider: Address,
  commodity: string,
  price: bigint
): PriceOracle {
  return {
    id: BigInt(Date.now()),
    provider,
    commodity,
    price,
    timestamp: BigInt(Date.now()),
    txHash: '',
  };
}

export function getLatestPrice(
  oracles: PriceOracle[],
  commodity: string
): PriceOracle | null {
  const relevant = oracles.filter((o) => o.commodity === commodity);
  if (relevant.length === 0) return null;
  return relevant.reduce((latest, current) =>
    current.timestamp > latest.timestamp ? current : latest
  );
}

export function getPriceHistory(
  oracles: PriceOracle[],
  commodity: string
): PriceOracle[] {
  return oracles
    .filter((o) => o.commodity === commodity)
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
}
