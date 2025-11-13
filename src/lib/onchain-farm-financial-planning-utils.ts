import { type Address } from 'viem';

export interface FinancialPlan {
  id: string;
  planId: bigint;
  owner: Address;
  totalBudget: bigint;
  allocatedBudget: bigint;
  startDate: bigint;
  endDate: bigint;
  planType: string;
  active: boolean;
}

export interface BudgetItem {
  id: string;
  itemId: bigint;
  planId: bigint;
  category: string;
  allocated: bigint;
  spent: bigint;
}

export function createFinancialPlan(
  owner: Address,
  planId: bigint,
  totalBudget: bigint,
  startDate: bigint,
  endDate: bigint,
  planType: string
): FinancialPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    planId,
    owner,
    totalBudget,
    allocatedBudget: BigInt(0),
    startDate,
    endDate,
    planType,
    active: true,
  };
}
