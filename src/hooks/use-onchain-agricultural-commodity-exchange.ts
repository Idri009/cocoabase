import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createOrder,
  fillOrder,
  getOpenOrders,
  getOrdersByCommodity,
  type CommodityOrder,
} from '@/lib/onchain-agricultural-commodity-exchange-utils';

export function useOnchainAgriculturalCommodityExchange() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [orders, setOrders] = useState<CommodityOrder[]>([]);
  const [isFilling, setIsFilling] = useState(false);

  const fill = async (orderId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsFilling(true);
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) throw new Error('Order not found');
      const updated = fillOrder(order, address);
      console.log('Filling order:', { orderId });
    } finally {
      setIsFilling(false);
    }
  };

  return {
    orders,
    fill,
    getOpenOrders,
    getOrdersByCommodity,
    isFilling,
    address,
  };
}
