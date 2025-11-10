import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAMMPool,
  swapTokens,
  addLiquidity,
  type AMPool,
} from '@/lib/onchain-amm-pool-utils';

export function useOnchainAMMPool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<AMPool[]>([]);
  const [isSwapping, setIsSwapping] = useState(false);

  const swap = async (
    poolId: bigint,
    tokenIn: Address,
    amountIn: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsSwapping(true);
    try {
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const result = swapTokens(pool, tokenIn, amountIn);
      console.log('Swapping tokens:', result);
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    pools,
    swap,
    addLiquidity,
    isSwapping,
    address,
  };
}

