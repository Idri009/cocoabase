import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  type Swap,
} from '@/lib/onchain-swap-utils';

export function useOnchainSwap() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [swaps, setSwaps] = useState<Swap[]>([]);

  const swapTokens = async (
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'swap',
      args: [tokenIn, tokenOut, amountIn],
    });
  };

  return { swaps, swapTokens, address };
}
