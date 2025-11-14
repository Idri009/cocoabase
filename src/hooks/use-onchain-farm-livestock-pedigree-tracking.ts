import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPedigreeRecord,
  type PedigreeRecord,
} from '@/lib/onchain-farm-livestock-pedigree-tracking-utils';

/**
 * Hook for onchain farm livestock pedigree tracking
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockPedigreeTracking() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<PedigreeRecord[]>([]);

  const recordPedigree = async (
    animalId: string,
    sireId: string,
    damId: string,
    generation: number,
    lineage: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createPedigreeRecord(address, animalId, sireId, damId, generation, lineage);
    setRecords([...records, record]);
  };

  const updatePedigree = async (
    contractAddress: Address,
    recordId: string,
    newLineage: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updatePedigree',
      args: [recordId, newLineage],
    });
  };

  return { records, recordPedigree, updatePedigree, address };
}

