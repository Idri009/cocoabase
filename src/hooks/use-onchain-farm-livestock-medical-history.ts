import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMedicalHistory,
  type MedicalHistory,
} from '@/lib/onchain-farm-livestock-medical-history-utils';

/**
 * Hook for onchain farm livestock medical history
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockMedicalHistory() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [histories, setHistories] = useState<MedicalHistory[]>([]);

  const addMedicalRecord = async (
    animalId: string,
    condition: string,
    treatment: string,
    veterinarian: string,
    recordDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const history = createMedicalHistory(address, animalId, condition, treatment, veterinarian, recordDate);
    setHistories([...histories, history]);
  };

  const updateMedicalRecord = async (
    contractAddress: Address,
    historyId: string,
    newTreatment: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateMedicalRecord',
      args: [historyId, newTreatment],
    });
  };

  return { histories, addMedicalRecord, updateMedicalRecord, address };
}

