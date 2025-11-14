import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDistribution,
  type HarvestDistribution,
} from '@/lib/onchain-farm-crop-harvest-distribution-utils';

/**
 * Hook for onchain farm crop harvest distribution
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropHarvestDistribution() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [distributions, setDistributions] = useState<HarvestDistribution[]>([]);

  const createDistribution = async (
    harvestId: string,
    recipient: Address,
    amount: bigint,
    distributionDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const distribution = createDistribution(address, harvestId, recipient, amount, distributionDate);
    setDistributions([...distributions, distribution]);
  };

  const confirmDistribution = async (
    contractAddress: Address,
    distributionId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'confirmDistribution',
      args: [distributionId],
    });
  };

  return { distributions, createDistribution, confirmDistribution, address };
}

