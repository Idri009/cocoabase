import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createTimestampRecord,
  type TimestampRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-timestamp-utils';

/**
 * Hook for onchain farm crop harvest blockchain timestamp
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainTimestamp() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<TimestampRecord[]>([]);

  const createTimestamp = async (
    harvestId: string,
    eventType: string,
    eventData: string,
    timestamp: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createTimestampRecord(address, harvestId, eventType, eventData, timestamp);
    setRecords([...records, record]);
  };

  const verifyTimestamp = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyTimestamp',
      args: [recordId],
    });
  };

  return { records, createTimestamp, verifyTimestamp, address };
}

