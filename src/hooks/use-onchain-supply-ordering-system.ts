import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createSupplyOrder,
  type SupplyOrder,
} from '@/lib/onchain-supply-ordering-system-utils';

export function useOnchainSupplyOrderingSystem() {
  const { address } = useAccount();
  const [orders, setOrders] = useState<SupplyOrder[]>([]);

  const createOrder = async (
    supplyType: string,
    quantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const order = createSupplyOrder(address, supplyType, quantity);
    setOrders([...orders, order]);
  };

  return { orders, createOrder, address };
}
