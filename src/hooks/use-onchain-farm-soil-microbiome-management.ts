import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createMicrobiomeAssessment,
  type MicrobiomeAssessment,
} from '@/lib/onchain-farm-soil-microbiome-management-utils';

export function useOnchainFarmSoilMicrobiomeManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assessments, setAssessments] = useState<MicrobiomeAssessment[]>([]);

  const assessMicrobiome = async (
    contractAddress: Address,
    fieldId: bigint,
    diversityScore: bigint,
    healthScore: bigint,
    microorganismTypes: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const assessment = createMicrobiomeAssessment(
      address,
      fieldId,
      diversityScore,
      healthScore,
      microorganismTypes
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'fieldId', type: 'uint256' },
            { name: 'diversityScore', type: 'uint256' },
            { name: 'healthScore', type: 'uint256' },
            { name: 'microorganismTypes', type: 'string[]' }
          ],
          name: 'assessMicrobiome',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'assessMicrobiome',
      args: [fieldId, diversityScore, healthScore, microorganismTypes],
    });
    
    setAssessments([...assessments, assessment]);
  };

  return { 
    assessments, 
    assessMicrobiome, 
    address 
  };
}



