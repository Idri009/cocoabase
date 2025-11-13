import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSeedlingRecord,
  type SeedlingRecord,
} from '@/lib/onchain-farm-crop-seedling-management-utils';

/**
 * Hook for onchain farm crop seedling management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropSeedlingManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<SeedlingRecord[]>([]);

  const recordSeedling = async (
    plantationId: string,
    seedlingCount: number,
    plantingDate: bigint,
    seedSource: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createSeedlingRecord(address, plantationId, seedlingCount, plantingDate, seedSource);
    setRecords([...records, record]);
  };

  const updateSeedlingCount = async (
    contractAddress: Address,
    recordId: string,
    newCount: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateSeedlingCount',
      args: [recordId, newCount],
    });
  };

  return { records, recordSeedling, updateSeedlingCount, address };
}

