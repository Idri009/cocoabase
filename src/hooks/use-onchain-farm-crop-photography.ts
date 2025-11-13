import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPhotoRecord,
  type PhotoRecord,
} from '@/lib/onchain-farm-crop-photography-utils';

/**
 * Hook for onchain farm crop photography
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropPhotography() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PhotoRecord[]>([]);

  const recordPhoto = async (
    plantationId: string,
    photoHash: string,
    photoDate: bigint,
    description: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createPhotoRecord(address, plantationId, photoHash, photoDate, description);
    setRecords([...records, record]);
  };

  const verifyPhoto = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyPhoto',
      args: [recordId],
    });
  };

  return { records, recordPhoto, verifyPhoto, address };
}

