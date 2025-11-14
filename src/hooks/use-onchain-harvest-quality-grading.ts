import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityGrade,
  calculateOverallScore,
  determineGrade,
  type QualityGrade,
} from '@/lib/onchain-harvest-quality-grading-utils';

/**
 * Hook for onchain harvest quality grading operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainHarvestQualityGrading() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [grades, setGrades] = useState<QualityGrade[]>([]);
  const [isGrading, setIsGrading] = useState(false);

  const gradeHarvest = async (
    harvestId: string,
    criteria: QualityGrade['criteria'],
    grader: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsGrading(true);
    try {
      const grade = createQualityGrade(address, harvestId, criteria, grader);
      setGrades((prev) => [...prev, grade]);
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'gradeHarvest',
        args: [harvestId, criteria, grader],
      });
    } finally {
      setIsGrading(false);
    }
  };

  return {
    grades,
    gradeHarvest,
    calculateOverallScore,
    determineGrade,
    isGrading,
    address,
  };
}


