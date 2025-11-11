import { type Address } from 'viem';

export interface CommodityPrice {
  id: bigint;
  provider: Address;
  commodity: string;
  price: bigint;
  unit: string;
  priceDate: bigint;
  market: string;
  txHash: string;
}

export function updateCommodityPrice(
  provider: Address,
  commodity: string,
  price: bigint,
  unit: string,
  market: string
): CommodityPrice {
  return {
    id: BigInt(Date.now()),
    provider,
    commodity,
    price,
    unit,
    priceDate: BigInt(Date.now()),
    market,
    txHash: '',
  };
}

export function getLatestPrice(
  prices: CommodityPrice[],
  commodity: string
): CommodityPrice | null {
  const relevant = prices.filter((p) => p.commodity === commodity);
  if (relevant.length === 0) return null;
  return relevant.reduce((latest, current) =>
    current.priceDate > latest.priceDate ? current : latest
  );
}

export function getPricesByMarket(
  prices: CommodityPrice[],
  market: string
): CommodityPrice[] {
  return prices.filter((p) => p.market === market);
}

export function getPriceHistory(
  prices: CommodityPrice[],
  commodity: string
): CommodityPrice[] {
  return prices
    .filter((p) => p.commodity === commodity)
    .sort((a, b) => (a.priceDate > b.priceDate ? -1 : 1));
}
