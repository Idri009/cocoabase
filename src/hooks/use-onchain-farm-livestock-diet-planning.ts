import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createDietPlan,
  type DietPlan,
} from '@/lib/onchain-farm-livestock-diet-planning-utils';

/**
 * Hook for onchain farm livestock diet planning
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmLivestockDietPlanning() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<DietPlan[]>([]);

  const createPlan = async (
    animalId: string,
    feedComponents: string[],
    dailyAmount: bigint,
    startDate: bigint,
    duration: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createDietPlan(address, animalId, feedComponents, dailyAmount, startDate, duration);
    setPlans([...plans, plan]);
  };

  const updatePlan = async (
    contractAddress: Address,
    planId: string,
    newDailyAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updatePlan',
      args: [planId, newDailyAmount],
    });
  };

  return { plans, createPlan, updatePlan, address };
}

