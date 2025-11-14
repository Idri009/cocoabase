import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityGrade,
  type QualityGrade,
} from '@/lib/onchain-farm-crop-harvest-quality-grading-utils';

/**
 * Hook for onchain farm crop harvest quality grading
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestQualityGrading() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [grades, setGrades] = useState<QualityGrade[]>([]);

  const gradeHarvest = async (
    harvestId: string,
    grade: string,
    gradeCriteria: string[],
    grader: string,
    gradingDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const qualityGrade = createQualityGrade(address, harvestId, grade, gradeCriteria, grader, gradingDate);
    setGrades([...grades, qualityGrade]);
  };

  const updateGrade = async (
    contractAddress: Address,
    gradeId: string,
    newGrade: string
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateGrade',
      args: [gradeId, newGrade],
    });
  };

  return { grades, gradeHarvest, updateGrade, address };
}

