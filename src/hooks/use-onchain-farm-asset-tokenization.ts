import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTokenizedAsset,
  redeemAsset,
  getActiveAssets,
  calculateTotalValue,
  type TokenizedAsset,
} from '@/lib/onchain-farm-asset-tokenization-utils';

export function useOnchainFarmAssetTokenization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assets, setAssets] = useState<TokenizedAsset[]>([]);

  const redeem = async (assetId: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) throw new Error('Asset not found');
    const updated = redeemAsset(asset);
    console.log('Redeeming asset:', { assetId });
  };

  return {
    assets,
    redeem,
    getActiveAssets,
    calculateTotalValue,
    address,
  };
}
