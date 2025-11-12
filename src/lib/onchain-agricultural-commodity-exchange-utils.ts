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

export function fillOrder(order: CommodityOrder): CommodityOrder {
  return {
    ...order,
    status: 'filled',
  };
}

export function getOpenOrders(orders: CommodityOrder[]): CommodityOrder[] {
  return orders.filter((o) => o.status === 'open');
}

export function getOrdersByCommodity(
  orders: CommodityOrder[],
  commodity: string
): CommodityOrder[] {
  return orders.filter((o) => o.commodity === commodity);
}
