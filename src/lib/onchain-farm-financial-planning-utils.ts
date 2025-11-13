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
