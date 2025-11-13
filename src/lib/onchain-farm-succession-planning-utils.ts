import { type Address } from 'viem';

export interface SuccessionPlan {
  id: bigint;
  owner: Address;
  successor: Address;
  planType: string;
  effectiveDate: bigint;
  status: 'draft' | 'active';
  timestamp: bigint;
}

export function createSuccessionPlan(
  owner: Address,
  successor: Address,
  planType: string,
  effectiveDate: bigint
): SuccessionPlan {
  return {
    id: BigInt(Date.now()),
    owner,
    successor,
    planType,
    effectiveDate,
    status: 'draft',
    timestamp: BigInt(Date.now()),
  };
}

export function activatePlan(
  plan: SuccessionPlan
): SuccessionPlan {
  return {
    ...plan,
    status: 'active',
  };
}

export function getActivePlans(
  plans: SuccessionPlan[]
): SuccessionPlan[] {
  return plans.filter((p) => p.status === 'active');
}
