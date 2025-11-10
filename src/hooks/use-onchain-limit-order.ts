import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLimitOrder,
  fillLimitOrder,
  cancelLimitOrder,
  type LimitOrder,
} from '@/lib/onchain-limit-order-utils';

export function useOnchainLimitOrder() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createOrder = async (
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint,
    limitPrice: bigint,
    expiresAt: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const order = createLimitOrder(
        address,
        tokenIn,
        tokenOut,
        amountIn,
        limitPrice,
        expiresAt
      );
      console.log('Creating limit order:', order);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    orders,
    createOrder,
    fillLimitOrder,
    cancelLimitOrder,
    isCreating,
    address,
  };
}

