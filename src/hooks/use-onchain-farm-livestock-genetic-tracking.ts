import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createGeneticRecord,
  type LivestockGeneticRecord,
} from '@/lib/onchain-farm-livestock-genetic-tracking-utils';

/**
 * Hook for onchain farm livestock genetic tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockGeneticTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<LivestockGeneticRecord[]>([]);

  const recordGenetics = async (
    animalId: string,
    geneticMarker: string,
    trait: string,
    recordDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createGeneticRecord(address, animalId, geneticMarker, trait, recordDate);
    setRecords([...records, record]);
  };

  const verifyGenetic = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyGenetic',
      args: [recordId],
    });
  };

  return { records, recordGenetics, verifyGenetic, address };
}

