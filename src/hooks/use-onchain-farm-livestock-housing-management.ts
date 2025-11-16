import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createHousingAssessment,
  type HousingAssessment,
} from '@/lib/onchain-farm-livestock-housing-management-utils';

export function useOnchainFarmLivestockHousingManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assessments, setAssessments] = useState<HousingAssessment[]>([]);

  const assessHousing = async (
    contractAddress: Address,
    housingId: bigint,
    spaceScore: bigint,
    ventilationScore: bigint,
    cleanlinessScore: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const assessment = createHousingAssessment(
      address,
      housingId,
      spaceScore,
      ventilationScore,
      cleanlinessScore
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'housingId', type: 'uint256' },
            { name: 'spaceScore', type: 'uint256' },
            { name: 'ventilationScore', type: 'uint256' },
            { name: 'cleanlinessScore', type: 'uint256' }
          ],
          name: 'assessHousing',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'assessHousing',
      args: [housingId, spaceScore, ventilationScore, cleanlinessScore],
    });
    
    setAssessments([...assessments, assessment]);
  };

  return { 
    assessments, 
    assessHousing, 
    address 
  };
}



