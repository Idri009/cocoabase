import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createQualityGrade,
  type QualityGrade,
} from '@/lib/onchain-farm-crop-harvest-quality-utils';

export function useOnchainFarmCropHarvestQuality() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [grades, setGrades] = useState<QualityGrade[]>([]);

  const gradeHarvest = async (
    contractAddress: Address,
    harvestId: bigint,
    grade: string,
    score: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const qualityGrade = createQualityGrade(address, harvestId, grade, score);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'harvestId', type: 'uint256' },
            { name: 'grade', type: 'string' },
            { name: 'score', type: 'uint256' }
          ],
          name: 'gradeHarvest',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'gradeHarvest',
      args: [harvestId, grade, score],
    });
    
    setGrades([...grades, qualityGrade]);
  };

  return { grades, gradeHarvest, address };
}

