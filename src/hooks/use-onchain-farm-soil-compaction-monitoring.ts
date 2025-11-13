import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCompactionReading,
  type CompactionReading,
} from '@/lib/onchain-farm-soil-compaction-monitoring-utils';

/**
 * Hook for onchain farm soil compaction monitoring
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilCompactionMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [readings, setReadings] = useState<CompactionReading[]>([]);

  const recordCompaction = async (
    plantationId: string,
    compactionLevel: number,
    depth: number,
    location: string,
    readingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const reading = createCompactionReading(address, plantationId, compactionLevel, depth, location, readingDate);
    setReadings([...readings, reading]);
  };

  const verifyReading = async (
    contractAddress: Address,
    readingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyReading',
      args: [readingId],
    });
  };

  return { readings, recordCompaction, verifyReading, address };
}

