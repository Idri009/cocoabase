import { type Address } from 'viem';

export interface FinancialPlan {
  id: bigint;
  planner: Address;
  planType: string;
  budget: bigint;
  period: string;
  timestamp: bigint;
}

export function createFinancialPlan(
  planner: Address,
  planType: string,
  budget: bigint,
  period: string
): FinancialPlan {
  return {
    id: BigInt(Date.now()),
    planner,
    planType,
    budget,
    period,
    timestamp: BigInt(Date.now()),
  };
}

export function getTotalBudget(
  plans: FinancialPlan[]
): bigint {
  return plans.reduce((total, p) => total + p.budget, BigInt(0));
}

export function getPlansByPeriod(
  plans: FinancialPlan[],
  period: string
): FinancialPlan[] {
  return plans.filter((p) => p.period === period);
}
