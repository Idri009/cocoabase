import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createThreshold,
  type Threshold,
} from '@/lib/onchain-farm-livestock-blockchain-threshold-utils';

/**
 * Hook for onchain farm livestock blockchain threshold
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainThreshold() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [thresholds, setThresholds] = useState<Threshold[]>([]);

  const setThreshold = async (
    animalId: string,
    thresholdValue: bigint,
    thresholdType: string,
    thresholdDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const threshold = createThreshold(address, animalId, thresholdValue, thresholdType, thresholdDate);
    setThresholds([...thresholds, threshold]);
  };

  const updateThreshold = async (
    contractAddress: Address,
    thresholdId: string,
    newValue: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateThreshold',
      args: [thresholdId, newValue],
    });
  };

  return { thresholds, setThreshold, updateThreshold, address };
}

