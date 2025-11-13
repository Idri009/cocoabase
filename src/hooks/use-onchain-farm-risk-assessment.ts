import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRiskAssessment,
  type RiskAssessment,
} from '@/lib/onchain-farm-risk-assessment-utils';

/**
 * Hook for onchain farm risk assessment
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmRiskAssessment() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [assessments, setAssessments] = useState<RiskAssessment[]>([]);

  const createAssessment = async (
    contractAddress: Address,
    riskType: string,
    riskLevel: bigint,
    description: string,
    mitigation: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'riskType', type: 'string' },
            { name: 'riskLevel', type: 'uint256' },
            { name: 'description', type: 'string' },
            { name: 'mitigation', type: 'string' }
          ],
          name: 'createAssessment',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createAssessment',
      args: [riskType, riskLevel, description, mitigation],
    });
  };

  const markAsMitigated = async (
    contractAddress: Address,
    assessmentId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'assessmentId', type: 'uint256' }],
          name: 'markAsMitigated',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'markAsMitigated',
      args: [assessmentId],
    });
  };

  return { 
    assessments, 
    createAssessment, 
    markAsMitigated, 
    address 
  };
}

