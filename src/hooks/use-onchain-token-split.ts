import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenSplit,
  calculateSplitAmount,
  validateSplitRatio,
  type TokenSplit,
} from '@/lib/onchain-token-split-utils';

export function useOnchainTokenSplit() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [splits, setSplits] = useState<TokenSplit[]>([]);

  const split = async (
    token: Address,
    splitRatio: number,
    newToken: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    if (!validateSplitRatio(splitRatio)) throw new Error('Invalid split ratio');
    const split = createTokenSplit(token, splitRatio, newToken);
    console.log('Splitting token:', split);
  };

  return {
    splits,
    split,
    calculateSplitAmount,
    validateSplitRatio,
    address,
  };
}

