import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createOptimizationPlan,
  type OptimizationPlan,
} from '@/lib/onchain-farm-resource-optimization-utils';

/**
 * Hook for onchain farm resource optimization
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmResourceOptimization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<OptimizationPlan[]>([]);

  const createOptimizationPlan = async (
    contractAddress: Address,
    resourceType: string,
    currentUsage: bigint,
    optimalUsage: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'resourceType', type: 'string' },
            { name: 'currentUsage', type: 'uint256' },
            { name: 'optimalUsage', type: 'uint256' }
          ],
          name: 'createOptimizationPlan',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createOptimizationPlan',
      args: [resourceType, currentUsage, optimalUsage],
    });
  };

  const implementPlan = async (
    contractAddress: Address,
    planId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'planId', type: 'uint256' }],
          name: 'implementPlan',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'implementPlan',
      args: [planId],
    });
  };

  return { 
    plans, 
    createOptimizationPlan, 
    implementPlan, 
    address 
  };
}
