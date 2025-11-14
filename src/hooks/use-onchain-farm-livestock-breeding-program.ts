import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBreedingProgram,
  type BreedingProgram,
} from '@/lib/onchain-farm-livestock-breeding-program-utils';

/**
 * Hook for onchain farm livestock breeding program
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBreedingProgram() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [programs, setPrograms] = useState<BreedingProgram[]>([]);

  const createProgram = async (
    programName: string,
    sireId: string,
    damId: string,
    startDate: bigint,
    objectives: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const program = createBreedingProgram(address, programName, sireId, damId, startDate, objectives);
    setPrograms([...programs, program]);
  };

  const updateProgram = async (
    contractAddress: Address,
    programId: string,
    newObjectives: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateProgram',
      args: [programId, newObjectives],
    });
  };

  return { programs, createProgram, updateProgram, address };
}

