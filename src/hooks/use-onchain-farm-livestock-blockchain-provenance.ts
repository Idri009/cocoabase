import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createProvenanceRecord,
  type ProvenanceRecord,
} from '@/lib/onchain-farm-livestock-blockchain-provenance-utils';

/**
 * Hook for onchain farm livestock blockchain provenance
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBlockchainProvenance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<ProvenanceRecord[]>([]);

  const recordProvenance = async (
    animalId: string,
    origin: string,
    history: string[],
    recordDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createProvenanceRecord(address, animalId, origin, history, recordDate);
    setRecords([...records, record]);
  };

  const updateProvenance = async (
    contractAddress: Address,
    recordId: string,
    newHistory: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateProvenance',
      args: [recordId, newHistory],
    });
  };

  return { records, recordProvenance, updateProvenance, address };
}

