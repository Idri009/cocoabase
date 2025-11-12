import { type Address } from 'viem';

export interface CommodityOrder {
  id: bigint;
  trader: Address;
  commodity: string;
  orderType: 'buy' | 'sell';
  price: bigint;
  quantity: bigint;
  status: 'open' | 'filled' | 'cancelled';
}

export function createOrder(
  trader: Address,
  commodity: string,
  orderType: 'buy' | 'sell',
  price: bigint,
  quantity: bigint
): CommodityOrder {
  return {
    id: BigInt(0),
    trader,
    commodity,
    orderType,
    price,
    quantity,
    status: 'open',
  };
}
