import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWaterSource,
  type WaterSource,
} from '@/lib/onchain-farm-water-source-management-utils';

/**
 * Hook for onchain farm water source management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWaterSourceManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [sources, setSources] = useState<WaterSource[]>([]);

  const registerSource = async (
    sourceType: string,
    location: string,
    capacity: bigint,
    quality: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const source = createWaterSource(address, sourceType, location, capacity, quality);
    setSources([...sources, source]);
  };

  const updateQuality = async (
    contractAddress: Address,
    sourceId: string,
    newQuality: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateQuality',
      args: [sourceId, newQuality],
    });
  };

  return { sources, registerSource, updateQuality, address };
}

