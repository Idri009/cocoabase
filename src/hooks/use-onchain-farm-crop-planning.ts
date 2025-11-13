import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCropPlan,
  type CropPlan,
} from '@/lib/onchain-farm-crop-planning-utils';

/**
 * Hook for onchain farm crop planning
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCropPlanning() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<CropPlan[]>([]);

  const createPlan = async (
    plantationId: string,
    cropType: string,
    plantingDate: bigint,
    expectedHarvestDate: bigint,
    expectedYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createCropPlan(address, plantationId, cropType, plantingDate, expectedHarvestDate, expectedYield);
    setPlans([...plans, plan]);
  };

  const updatePlan = async (
    contractAddress: Address,
    planId: string,
    newExpectedYield: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updatePlan',
      args: [planId, newExpectedYield],
    });
  };

  return { plans, createPlan, updatePlan, address };
}

