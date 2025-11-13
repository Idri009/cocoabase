import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBreedingRecord,
  type LivestockBreedingRecord,
} from '@/lib/onchain-farm-livestock-breeding-utils';

/**
 * Hook for onchain farm livestock breeding
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockBreeding() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<LivestockBreedingRecord[]>([]);

  const recordBreeding = async (
    sireId: string,
    damId: string,
    breedingDate: bigint,
    expectedBirthDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createBreedingRecord(address, sireId, damId, breedingDate, expectedBirthDate);
    setRecords([...records, record]);
  };

  const recordBirth = async (
    contractAddress: Address,
    recordId: string,
    offspringId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'recordBirth',
      args: [recordId, offspringId],
    });
  };

  return { records, recordBreeding, recordBirth, address };
}

