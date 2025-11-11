import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  tokenizeAsset,
  type TokenizedAsset,
} from '@/lib/onchain-farm-asset-tokenization-utils';

export function useOnchainFarmAssetTokenization() {
  const { address } = useAccount();
  const [assets, setAssets] = useState<TokenizedAsset[]>([]);

  const tokenize = async (
    assetType: TokenizedAsset['assetType'],
    tokenAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const asset = tokenizeAsset(address, assetType, tokenAmount);
    setAssets([...assets, asset]);
  };

  return { assets, tokenize, address };
}
