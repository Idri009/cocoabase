import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createNutritionPlan,
  type NutritionPlan,
} from '@/lib/onchain-farm-crop-nutrition-management-utils';

/**
 * Hook for onchain crop nutrition management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropNutritionManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);

  const createPlan = async (
    contractAddress: Address,
    plantationId: bigint,
    cropType: string,
    nitrogenLevel: bigint,
    phosphorusLevel: bigint,
    potassiumLevel: bigint,
    micronutrients: bigint[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const plan = createNutritionPlan(
      address,
      plantationId,
      cropType,
      nitrogenLevel,
      phosphorusLevel,
      potassiumLevel,
      micronutrients
    );
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropType', type: 'string' },
            { name: 'nitrogenLevel', type: 'uint256' },
            { name: 'phosphorusLevel', type: 'uint256' },
            { name: 'potassiumLevel', type: 'uint256' },
            { name: 'micronutrients', type: 'uint256[]' }
          ],
          name: 'createNutritionPlan',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createNutritionPlan',
      args: [plantationId, cropType, nitrogenLevel, phosphorusLevel, potassiumLevel, micronutrients],
    });
    
    setNutritionPlans([...nutritionPlans, plan]);
  };

  const recordResult = async (
    contractAddress: Address,
    planId: bigint,
    growthImprovement: bigint,
    yieldIncrease: bigint,
    healthScore: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'planId', type: 'uint256' },
            { name: 'growthImprovement', type: 'uint256' },
            { name: 'yieldIncrease', type: 'uint256' },
            { name: 'healthScore', type: 'uint256' }
          ],
          name: 'recordNutritionResult',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'recordNutritionResult',
      args: [planId, growthImprovement, yieldIncrease, healthScore],
    });
  };

  return { 
    nutritionPlans, 
    createPlan, 
    recordResult, 
    address 
  };
}


