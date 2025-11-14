import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createWelfareAssessment,
  type WelfareAssessment,
} from '@/lib/onchain-farm-livestock-welfare-monitoring-utils';

export function useOnchainFarmLivestockWelfareMonitoring() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [welfareAssessments, setWelfareAssessments] = useState<WelfareAssessment[]>([]);

  const assessWelfare = async (
    contractAddress: Address,
    livestockId: bigint,
    healthScore: bigint,
    behaviorScore: bigint,
    environmentScore: bigint,
    nutritionScore: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const assessment = createWelfareAssessment(
      address,
      livestockId,
      healthScore,
      behaviorScore,
      environmentScore,
      nutritionScore
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'livestockId', type: 'uint256' },
            { name: 'healthScore', type: 'uint256' },
            { name: 'behaviorScore', type: 'uint256' },
            { name: 'environmentScore', type: 'uint256' },
            { name: 'nutritionScore', type: 'uint256' }
          ],
          name: 'assessWelfare',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'assessWelfare',
      args: [livestockId, healthScore, behaviorScore, environmentScore, nutritionScore],
    });
    
    setWelfareAssessments([...welfareAssessments, assessment]);
  };

  return { 
    welfareAssessments, 
    assessWelfare, 
    address 
  };
}
