import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBirthRecord,
  type BirthRecord,
} from '@/lib/onchain-farm-livestock-birth-records-utils';

/**
 * Hook for onchain farm livestock birth records
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockBirthRecords() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [records, setRecords] = useState<BirthRecord[]>([]);

  const recordBirth = async (
    animalId: string,
    sireId: string,
    damId: string,
    birthDate: bigint,
    birthWeight: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const record = createBirthRecord(address, animalId, sireId, damId, birthDate, birthWeight);
    setRecords([...records, record]);
  };

  const verifyBirth = async (
    contractAddress: Address,
    recordId: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'verifyBirth',
      args: [recordId],
    });
  };

  return { records, recordBirth, verifyBirth, address };
}

