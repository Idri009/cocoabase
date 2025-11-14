import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBehaviorRecord,
  type BehaviorRecord,
} from '@/lib/onchain-farm-livestock-behavior-tracking-utils';

/**
 * Hook for onchain farm livestock behavior tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockBehaviorTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<BehaviorRecord[]>([]);

  const recordBehavior = async (
    animalId: string,
    behaviorType: string,
    observation: string,
    observationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createBehaviorRecord(address, animalId, behaviorType, observation, observationDate);
    setRecords([...records, record]);
  };

  const verifyBehavior = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyBehavior',
      args: [recordId],
    });
  };

  return { records, recordBehavior, verifyBehavior, address };
}

