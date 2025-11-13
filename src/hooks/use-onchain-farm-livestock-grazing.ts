import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createGrazingRecord,
  type GrazingRecord,
} from '@/lib/onchain-farm-livestock-grazing-utils';

/**
 * Hook for onchain farm livestock grazing
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockGrazing() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<GrazingRecord[]>([]);

  const recordGrazing = async (
    animalId: string,
    pastureId: string,
    grazingDate: bigint,
    duration: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createGrazingRecord(address, animalId, pastureId, grazingDate, duration);
    setRecords([...records, record]);
  };

  const verifyGrazing = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyGrazing',
      args: [recordId],
    });
  };

  return { records, recordGrazing, verifyGrazing, address };
}

