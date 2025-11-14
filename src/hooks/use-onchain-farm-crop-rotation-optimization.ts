import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRotationPlan,
  type RotationPlan,
} from '@/lib/onchain-farm-crop-rotation-optimization-utils';

export function useOnchainFarmCropRotationOptimization() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<RotationPlan[]>([]);

  const createRotationPlanAction = async (
    contractAddress: Address,
    plantationId: bigint,
    cropSequence: string[],
    rotationPeriods: bigint[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    const plan = createRotationPlan(address, plantationId, cropSequence, rotationPeriods);
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [
            { name: 'plantationId', type: 'uint256' },
            { name: 'cropSequence', type: 'string[]' },
            { name: 'rotationPeriods', type: 'uint256[]' }
          ],
          name: 'createRotationPlan',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'createRotationPlan',
      args: [plantationId, cropSequence, rotationPeriods],
    });
    
    setPlans([...plans, plan]);
  };

  const activatePlan = async (
    contractAddress: Address,
    planId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    
    await writeContract({
      address: contractAddress,
      abi: [
        {
          inputs: [{ name: 'planId', type: 'uint256' }],
          name: 'activatePlan',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ],
      functionName: 'activatePlan',
      args: [planId],
    });
  };

  return { plans, createRotationPlanAction, activatePlan, address };
}


