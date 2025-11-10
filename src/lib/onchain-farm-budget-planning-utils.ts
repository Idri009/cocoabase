import { type Address } from 'viem';

/**
 * Onchain Farm Budget Planning utilities
 * Plan and track farm budgets onchain with Reown wallet integration
 */

export interface BudgetPlan {
  id: bigint;
  farmer: Address;
  season: string;
  totalBudget: bigint;
  allocatedCategories: Record<string, bigint>;
  spentAmount: bigint;
  remainingAmount: bigint;
  status: 'draft' | 'active' | 'completed';
  createdAt: bigint;
}

export function createBudgetPlan(
  farmer: Address,
  season: string,
  totalBudget: bigint,
  allocatedCategories: Record<string, bigint>
): BudgetPlan {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    farmer,
    season,
    totalBudget,
    allocatedCategories,
    spentAmount: BigInt(0),
    remainingAmount: totalBudget,
    status: 'draft',
    createdAt: now,
  };
}

export function activateBudget(plan: BudgetPlan): BudgetPlan {
  return {
    ...plan,
    status: 'active',
  };
}

export function recordExpense(
  plan: BudgetPlan,
  category: string,
  amount: bigint
): BudgetPlan {
  const newSpent = plan.spentAmount + amount;
  const newRemaining = plan.totalBudget - newSpent;
  return {
    ...plan,
    spentAmount: newSpent,
    remainingAmount: newRemaining,
  };
}

export function calculateBudgetUtilization(plan: BudgetPlan): number {
  if (plan.totalBudget === BigInt(0)) return 0;
  return Number((plan.spentAmount * BigInt(100)) / plan.totalBudget);
}

