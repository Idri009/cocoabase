import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createConservationRecord,
  type WaterConservationRecord,
} from '@/lib/onchain-farm-water-conservation-tracking-utils';

/**
 * Hook for onchain farm water conservation tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWaterConservationTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<WaterConservationRecord[]>([]);

  const recordConservation = async (
    plantationId: string,
    method: string,
    waterSaved: bigint,
    date: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createConservationRecord(address, plantationId, method, waterSaved, date);
    setRecords([...records, record]);
  };

  const verifyConservation = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyConservation',
      args: [recordId],
    });
  };

  return { records, recordConservation, verifyConservation, address };
}

