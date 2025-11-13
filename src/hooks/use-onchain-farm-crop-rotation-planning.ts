import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRotationPlan,
  type CropRotationPlan,
} from '@/lib/onchain-farm-crop-rotation-planning-utils';

/**
 * Hook for onchain farm crop rotation planning
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropRotationPlanning() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<CropRotationPlan[]>([]);

  const createPlan = async (
    fieldId: string,
    crops: string[],
    rotationYears: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createRotationPlan(address, fieldId, crops, rotationYears);
    setPlans([...plans, plan]);
  };

  const executeRotation = async (
    contractAddress: Address,
    planId: string,
    currentCrop: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'executeRotation',
      args: [planId, currentCrop],
    });
  };

  return { plans, createPlan, executeRotation, address };
}

