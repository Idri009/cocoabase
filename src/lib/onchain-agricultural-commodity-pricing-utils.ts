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
