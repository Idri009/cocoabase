import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSwap,
  executeSwap,
  calculateSwapRate,
  calculatePriceImpact,
  validateSlippage,
  type Swap,
} from '@/lib/onchain-swap-utils';

export function useOnchainSwap() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [isSwapping, setIsSwapping] = useState(false);

  const createNewSwap = async (
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint,
    amountOut: bigint,
    slippageTolerance: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsSwapping(true);
    try {
      const swap = createSwap(
        address,
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        slippageTolerance
      );
      console.log('Creating swap:', swap);
    } finally {
      setIsSwapping(false);
    }
  };

  const executeSwapTransaction = async (
    swapId: bigint,
    actualAmountOut: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsSwapping(true);
    try {
      const currentTime = BigInt(Date.now());
      const swap = swaps.find((s) => s.id === swapId);
      if (!swap) throw new Error('Swap not found');
      const updated = executeSwap(swap, actualAmountOut, currentTime);
      if (updated) {
        console.log('Executing swap:', { swapId, address });
      }
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    swaps,
    createNewSwap,
    executeSwapTransaction,
    calculateSwapRate,
    calculatePriceImpact,
    validateSlippage,
    isSwapping,
    address,
  };
}

