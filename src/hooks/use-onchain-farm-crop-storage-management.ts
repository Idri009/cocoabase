import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStorageRecord,
  type StorageRecord,
} from '@/lib/onchain-farm-crop-storage-management-utils';

/**
 * Hook for onchain farm crop storage management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropStorageManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<StorageRecord[]>([]);

  const storeCrop = async (
    cropId: string,
    storageLocation: string,
    quantity: bigint,
    storageDate: bigint,
    conditions: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createStorageRecord(address, cropId, storageLocation, quantity, storageDate, conditions);
    setRecords([...records, record]);
  };

  const retrieveCrop = async (
    contractAddress: Address,
    recordId: string,
    quantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'retrieveCrop',
      args: [recordId, quantity],
    });
  };

  return { records, storeCrop, retrieveCrop, address };
}

