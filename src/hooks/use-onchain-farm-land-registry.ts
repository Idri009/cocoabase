import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  registerLand,
  type LandRegistry,
} from '@/lib/onchain-farm-land-registry-utils';

/**
 * Hook for onchain farm land registry
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLandRegistry() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [registrations, setRegistrations] = useState<LandRegistry[]>([]);

  const registerLandParcel = async (
    parcelId: string,
    area: bigint,
    coordinates: string,
    legalDocHash: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const registration = registerLand(address, parcelId, area, coordinates, legalDocHash);
    setRegistrations([...registrations, registration]);
  };

  const transferOwnership = async (
    contractAddress: Address,
    registrationId: string,
    newOwner: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'transferOwnership',
      args: [registrationId, newOwner],
    });
  };

  return { registrations, registerLandParcel, transferOwnership, address };
}

