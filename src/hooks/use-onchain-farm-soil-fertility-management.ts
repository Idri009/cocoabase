import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createFertilityAssessment,
  type FertilityAssessment,
} from '@/lib/onchain-farm-soil-fertility-management-utils';

/**
 * Hook for onchain soil fertility management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilFertilityManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [fertilityAssessments, setFertilityAssessments] = useState<FertilityAssessment[]>([]);

  const assessFertility = async (
    contractAddress: Address,
    fieldId: bigint,
    nitrogenLevel: bigint,
    phosphorusLevel: bigint,
    potassiumLevel: bigint,
    organicMatter: bigint,
    phLevel: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const assessment = createFertilityAssessment(
      address,
      fieldId,
      nitrogenLevel,
      phosphorusLevel,
      potassiumLevel,
      organicMatter,
      phLevel
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'fieldId', type: 'uint256' },
            { name: 'nitrogenLevel', type: 'uint256' },
            { name: 'phosphorusLevel', type: 'uint256' },
            { name: 'potassiumLevel', type: 'uint256' },
            { name: 'organicMatter', type: 'uint256' },
            { name: 'phLevel', type: 'uint256' }
          ],
          name: 'assessFertility',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'assessFertility',
      args: [fieldId, nitrogenLevel, phosphorusLevel, potassiumLevel, organicMatter, phLevel],
    });
    
    setFertilityAssessments([...fertilityAssessments, assessment]);
  };

  const implementImprovement = async (
    contractAddress: Address,
    assessmentId: bigint,
    improvementMethod: string,
    expectedImprovement: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'assessmentId', type: 'uint256' },
            { name: 'improvementMethod', type: 'string' },
            { name: 'expectedImprovement', type: 'uint256' }
          ],
          name: 'implementImprovement',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'implementImprovement',
      args: [assessmentId, improvementMethod, expectedImprovement],
    });
  };

  return { 
    fertilityAssessments, 
    assessFertility, 
    implementImprovement, 
    address 
  };
}


