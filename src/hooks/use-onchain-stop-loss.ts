import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStopLossOrder,
  triggerStopLoss,
  cancelStopLoss,
  type StopLossOrder,
} from '@/lib/onchain-stop-loss-utils';

export function useOnchainStopLoss() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [orders, setOrders] = useState<StopLossOrder[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createOrder = async (
    token: Address,
    amount: bigint,
    stopPrice: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const order = createStopLossOrder(address, token, amount, stopPrice);
      console.log('Creating stop loss order:', order);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    orders,
    createOrder,
    triggerStopLoss,
    cancelStopLoss,
    isCreating,
    address,
  };
}

