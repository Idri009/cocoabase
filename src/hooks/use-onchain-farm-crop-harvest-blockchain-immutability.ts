import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createImmutabilityRecord,
  type ImmutabilityRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-immutability-utils';

/**
 * Hook for onchain farm crop harvest blockchain immutability
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainImmutability() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<ImmutabilityRecord[]>([]);

  const createRecord = async (
    harvestId: string,
    dataHash: string,
    recordDate: bigint,
    immutable: boolean
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createImmutabilityRecord(address, harvestId, dataHash, recordDate, immutable);
    setRecords([...records, record]);
  };

  const verifyImmutability = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyImmutability',
      args: [recordId],
    });
  };

  return { records, createRecord, verifyImmutability, address };
}

