import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateSwapAmountOut,
  type AMMPool,
} from '@/lib/onchain-amm-utils';

export function useOnchainAMM() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<AMMPool[]>([]);

  const swap = async (
    pool: Address,
    amountIn: bigint,
    tokenIn: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: pool,
      abi: [],
      functionName: 'swap',
      args: [amountIn, tokenIn],
    });
  };

  return { pools, swap, address };
}
