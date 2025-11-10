import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateSwapAmountOut,
  type AMMPool,
} from '@/lib/onchain-amm-utils';

export function useOnchainAMM() {
  const { address } = useAccount();
  const [pools, setPools] = useState<AMMPool[]>([]);

  const swap = async (
    pool: Address,
    amountIn: bigint,
    tokenIn: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    console.log('Swapping tokens:', { pool, amountIn, tokenIn });
  };

  return { pools, swap, address };
}

