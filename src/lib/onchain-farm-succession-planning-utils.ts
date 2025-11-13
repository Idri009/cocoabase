import { type Address } from 'viem';

export interface SuccessionPlan {
  id: string;
  planId: bigint;
  currentOwner: Address;
  successor: Address;
  transferDate: bigint;
  planDetails: string;
  approved: boolean;
  executed: boolean;
}

export function createSuccessionPlan(
  currentOwner: Address,
  planId: bigint,
  successor: Address,
  transferDate: bigint,
  planDetails: string
): SuccessionPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    planId,
    currentOwner,
    successor,
    transferDate,
    planDetails,
    approved: false,
    executed: false,
  };
}
