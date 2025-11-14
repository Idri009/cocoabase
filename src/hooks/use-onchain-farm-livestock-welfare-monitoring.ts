import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWelfareAssessment,
  type WelfareAssessment,
} from '@/lib/onchain-farm-livestock-welfare-monitoring-utils';

/**
 * Hook for onchain farm livestock welfare monitoring
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmLivestockWelfareMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assessments, setAssessments] = useState<WelfareAssessment[]>([]);

  const assessWelfare = async (
    animalId: string,
    welfareScore: number,
    assessmentCriteria: string[],
    assessmentDate: bigint,
    assessor: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const assessment = createWelfareAssessment(address, animalId, welfareScore, assessmentCriteria, assessmentDate, assessor);
    setAssessments([...assessments, assessment]);
  };

  const updateWelfareScore = async (
    contractAddress: Address,
    assessmentId: string,
    newScore: number
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateWelfareScore',
      args: [assessmentId, newScore],
    });
  };

  return { assessments, assessWelfare, updateWelfareScore, address };
}

