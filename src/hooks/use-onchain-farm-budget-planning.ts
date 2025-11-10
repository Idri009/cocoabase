import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createBudgetPlan,
  activateBudget,
  recordExpense,
  calculateBudgetUtilization,
  type BudgetPlan,
} from '@/lib/onchain-farm-budget-planning-utils';

/**
 * Hook for onchain farm budget planning operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainFarmBudgetPlanning() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [budgets, setBudgets] = useState<BudgetPlan[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createBudget = async (
    season: string,
    totalBudget: bigint,
    allocatedCategories: Record<string, bigint>
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const budget = createBudgetPlan(address, season, totalBudget, allocatedCategories);
      setBudgets((prev) => [...prev, budget]);
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'createBudgetPlan',
        args: [season, totalBudget, allocatedCategories],
      });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    budgets,
    createBudget,
    activateBudget,
    recordExpense,
    calculateBudgetUtilization,
    isCreating,
    address,
  };
}

