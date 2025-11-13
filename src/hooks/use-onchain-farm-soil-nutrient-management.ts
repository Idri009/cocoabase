import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createNutrientPlan,
  type NutrientManagementPlan,
} from '@/lib/onchain-farm-soil-nutrient-management-utils';

/**
 * Hook for onchain farm soil nutrient management
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSoilNutrientManagement() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [plans, setPlans] = useState<NutrientManagementPlan[]>([]);

  const createNutrientPlan = async (
    plantationId: string,
    nitrogen: bigint,
    phosphorus: bigint,
    potassium: bigint,
    applicationDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const plan = createNutrientPlan(address, plantationId, nitrogen, phosphorus, potassium, applicationDate);
    setPlans([...plans, plan]);
  };

  const applyNutrients = async (
    contractAddress: Address,
    planId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'applyNutrients',
      args: [planId],
    });
  };

  return { plans, createNutrientPlan, applyNutrients, address };
}

