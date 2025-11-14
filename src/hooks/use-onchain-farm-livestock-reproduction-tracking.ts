import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createReproductionTracking,
  type ReproductionTracking,
} from '@/lib/onchain-farm-livestock-reproduction-tracking-utils';

/**
 * Hook for onchain farm livestock reproduction tracking
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockReproductionTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [trackings, setTrackings] = useState<ReproductionTracking[]>([]);

  const trackReproduction = async (
    animalId: string,
    matingDate: bigint,
    expectedCalvingDate: bigint,
    sireId: string,
    damId: string,
    breedingMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const tracking = createReproductionTracking(address, animalId, matingDate, expectedCalvingDate, sireId, damId, breedingMethod);
    setTrackings([...trackings, tracking]);
  };

  const updateTracking = async (
    contractAddress: Address,
    trackingId: string,
    actualCalvingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateTracking',
      args: [trackingId, actualCalvingDate],
    });
  };

  return { trackings, trackReproduction, updateTracking, address };
}

