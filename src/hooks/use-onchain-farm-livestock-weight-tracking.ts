import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWeightRecord,
  type WeightRecord,
} from '@/lib/onchain-farm-livestock-weight-tracking-utils';

/**
 * Hook for onchain farm livestock weight tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockWeightTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<WeightRecord[]>([]);

  const recordWeight = async (
    animalId: string,
    weight: bigint,
    measurementDate: bigint,
    measurementMethod: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createWeightRecord(address, animalId, weight, measurementDate, measurementMethod);
    setRecords([...records, record]);
  };

  const verifyWeight = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyWeight',
      args: [recordId],
    });
  };

  return { records, recordWeight, verifyWeight, address };
}

