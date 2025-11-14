import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createAuthentication,
  type HarvestAuthentication,
} from '@/lib/onchain-farm-crop-harvest-authentication-utils';

/**
 * Hook for onchain farm crop harvest authentication
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestAuthentication() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [authentications, setAuthentications] = useState<HarvestAuthentication[]>([]);

  const authenticateHarvest = async (
    harvestId: string,
    authenticator: string,
    authenticationMethod: string,
    authenticationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const auth = createAuthentication(address, harvestId, authenticator, authenticationMethod, authenticationDate);
    setAuthentications([...authentications, auth]);
  };

  const verifyAuthentication = async (
    contractAddress: Address,
    authId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyAuthentication',
      args: [authId],
    });
  };

  return { authentications, authenticateHarvest, verifyAuthentication, address };
}

