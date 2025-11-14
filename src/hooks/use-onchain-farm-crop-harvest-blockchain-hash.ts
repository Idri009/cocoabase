import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHashRecord,
  type HashRecord,
} from '@/lib/onchain-farm-crop-harvest-blockchain-hash-utils';

/**
 * Hook for onchain farm crop harvest blockchain hash
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainHash() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<HashRecord[]>([]);

  const createHash = async (
    harvestId: string,
    dataHash: string,
    hashAlgorithm: string,
    hashDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createHashRecord(address, harvestId, dataHash, hashAlgorithm, hashDate);
    setRecords([...records, record]);
  };

  const verifyHash = async (
    contractAddress: Address,
    recordId: string,
    data: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyHash',
      args: [recordId, data],
    });
  };

  return { records, createHash, verifyHash, address };
}

