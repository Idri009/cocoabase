import { type Address } from 'viem';

export interface SupplyOrder {
  id: bigint;
  owner: Address;
  supplyType: string;
  quantity: bigint;
  orderDate: bigint;
  status: 'pending' | 'ordered' | 'delivered' | 'cancelled';
  txHash: string;
}

export function createSupplyOrder(
  owner: Address,
  supplyType: string,
  quantity: bigint
): SupplyOrder {
  return {
    id: BigInt(Date.now()),
    owner,
    supplyType,
    quantity,
    orderDate: BigInt(Date.now()),
    status: 'pending',
    txHash: '',
  };
}

export function markOrderDelivered(
  order: SupplyOrder
): SupplyOrder {
  return {
    ...order,
    status: 'delivered',
  };
}

export function getPendingOrders(
  orders: SupplyOrder[]
): SupplyOrder[] {
  return orders.filter((o) => o.status === 'pending');
}

export function getTotalOrderedQuantity(
  orders: SupplyOrder[]
): bigint {
  return orders.reduce((total, o) => total + o.quantity, BigInt(0));
}
