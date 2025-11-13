import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLivestockRecord,
  type LivestockRecord,
} from '@/lib/onchain-farm-livestock-tracking-utils';

/**
 * Hook for onchain farm livestock tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<LivestockRecord[]>([]);

  const recordLivestock = async (
    animalId: string,
    species: string,
    birthDate: bigint,
    healthStatus: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createLivestockRecord(address, animalId, species, birthDate, healthStatus);
    setRecords([...records, record]);
  };

  const updateHealthStatus = async (
    contractAddress: Address,
    recordId: string,
    newStatus: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateHealthStatus',
      args: [recordId, newStatus],
    });
  };

  return { records, recordLivestock, updateHealthStatus, address };
}

