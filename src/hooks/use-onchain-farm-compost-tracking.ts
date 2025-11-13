import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCompostRecord,
  type CompostRecord,
} from '@/lib/onchain-farm-compost-tracking-utils';

/**
 * Hook for onchain farm compost tracking
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCompostTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<CompostRecord[]>([]);

  const recordCompost = async (
    plantationId: string,
    compostType: string,
    amount: bigint,
    carbonContent: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createCompostRecord(address, plantationId, compostType, amount, carbonContent);
    setRecords([...records, record]);
  };

  const verifyCompost = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyCompost',
      args: [recordId],
    });
  };

  return { records, recordCompost, verifyCompost, address };
}

