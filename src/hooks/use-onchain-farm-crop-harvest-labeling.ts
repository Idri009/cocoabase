import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLabel,
  type HarvestLabel,
} from '@/lib/onchain-farm-crop-harvest-labeling-utils';

/**
 * Hook for onchain farm crop harvest labeling
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestLabeling() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [labels, setLabels] = useState<HarvestLabel[]>([]);

  const createLabel = async (
    harvestId: string,
    labelType: string,
    labelContent: string,
    labelingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const label = createLabel(address, harvestId, labelType, labelContent, labelingDate);
    setLabels([...labels, label]);
  };

  const verifyLabel = async (
    contractAddress: Address,
    labelId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyLabel',
      args: [labelId],
    });
  };

  return { labels, createLabel, verifyLabel, address };
}

