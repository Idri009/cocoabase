import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRegistryEntry,
  type RegistryEntry,
} from '@/lib/onchain-farm-livestock-blockchain-registry-utils';

/**
 * Hook for onchain farm livestock blockchain registry
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainRegistry() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [entries, setEntries] = useState<RegistryEntry[]>([]);

  const registerAnimal = async (
    animalId: string,
    registrationType: string,
    registrationData: string,
    registrationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const entry = createRegistryEntry(address, animalId, registrationType, registrationData, registrationDate);
    setEntries([...entries, entry]);
  };

  const updateRegistry = async (
    contractAddress: Address,
    entryId: string,
    newData: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateRegistry',
      args: [entryId, newData],
    });
  };

  return { entries, registerAnimal, updateRegistry, address };
}

