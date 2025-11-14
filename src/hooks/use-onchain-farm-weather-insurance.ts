import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInsurancePolicy,
  type InsurancePolicy,
} from '@/lib/onchain-farm-weather-insurance-utils';

/**
 * Hook for onchain weather insurance
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmWeatherInsurance() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);

  const createPolicy = async (
    contractAddress: Address,
    plantationId: bigint,
    coverageAmount: bigint,
    premium: bigint,
    endDate: bigint,
    weatherConditions: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const policy = createInsurancePolicy(
      address,
      plantationId,
      coverageAmount,
      premium,
      endDate,
      weatherConditions
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'coverageAmount', type: 'uint256' },
            { name: 'premium', type: 'uint256' },
            { name: 'endDate', type: 'uint256' },
            { name: 'weatherConditions', type: 'string' }
          ],
          name: 'createPolicy',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createPolicy',
      args: [plantationId, coverageAmount, premium, endDate, weatherConditions],
    });
    
    setPolicies([...policies, policy]);
  };

  const fileClaim = async (
    contractAddress: Address,
    policyId: bigint,
    claimAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'policyId', type: 'uint256' },
            { name: 'claimAmount', type: 'uint256' }
          ],
          name: 'fileClaim',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'fileClaim',
      args: [policyId, claimAmount],
    });
  };

  return { 
    policies, 
    createPolicy, 
    fileClaim, 
    address 
  };
}
