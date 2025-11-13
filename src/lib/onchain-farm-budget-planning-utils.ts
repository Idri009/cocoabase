import { type Address } from 'viem';

export interface Budget {
  id: string;
  budgetId: bigint;
  owner: Address;
  totalAmount: bigint;
  spentAmount: bigint;
  periodStart: bigint;
  periodEnd: bigint;
  budgetName: string;
  active: boolean;
}

export function createBudget(
  owner: Address,
  budgetId: bigint,
  totalAmount: bigint,
  periodStart: bigint,
  periodEnd: bigint,
  budgetName: string
): Budget {
  return {
    id: `${Date.now()}-${Math.random()}`,
    budgetId,
    owner,
    totalAmount,
    spentAmount: BigInt(0),
    periodStart,
    periodEnd,
    budgetName,
    active: true,
  };
}
