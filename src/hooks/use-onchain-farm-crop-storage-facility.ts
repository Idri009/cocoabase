import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStorageFacility,
  type StorageFacility,
} from '@/lib/onchain-farm-crop-storage-facility-utils';

/**
 * Hook for onchain farm crop storage facility management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropStorageFacility() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [facilities, setFacilities] = useState<StorageFacility[]>([]);

  const createFacility = async (
    facilityName: string,
    capacity: bigint,
    location: string,
    storageType: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const facility = createStorageFacility(address, facilityName, capacity, location, storageType);
    setFacilities([...facilities, facility]);
  };

  const updateCapacity = async (
    contractAddress: Address,
    facilityId: string,
    newCapacity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateCapacity',
      args: [facilityId, newCapacity],
    });
  };

  return { facilities, createFacility, updateCapacity, address };
}

