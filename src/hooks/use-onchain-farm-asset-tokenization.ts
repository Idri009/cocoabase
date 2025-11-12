import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenizedAsset,
  redeemTokens,
  calculateTotalValue,
  type TokenizedAsset,
} from '@/lib/onchain-farm-asset-tokenization-utils';

export function useOnchainFarmAssetTokenization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assets, setAssets] = useState<TokenizedAsset[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);

  const tokenize = async (
    assetType: string,
    tokenAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsTokenizing(true);
    try {
      const asset = createTokenizedAsset(address, assetType, tokenAmount);
      console.log('Tokenizing asset:', asset);
    } finally {
      setIsTokenizing(false);
    }
  };

  return {
    assets,
    tokenize,
    redeemTokens,
    calculateTotalValue,
    isTokenizing,
    address,
  };
}
