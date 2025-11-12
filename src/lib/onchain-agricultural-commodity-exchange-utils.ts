import { type Address } from 'viem';

export interface CommodityOrder {
  id: bigint;
  trader: Address;
  commodity: string;
  orderType: 'buy' | 'sell';
  quantity: bigint;
  price: bigint;
  status: 'open' | 'filled' | 'cancelled';
}

export function createOrder(
  trader: Address,
  commodity: string,
  orderType: 'buy' | 'sell',
  quantity: bigint,
  price: bigint
): CommodityOrder {
  return {
    id: BigInt(0),
    trader,
    commodity,
    orderType,
    quantity,
    price,
    status: 'open',
  };
}
