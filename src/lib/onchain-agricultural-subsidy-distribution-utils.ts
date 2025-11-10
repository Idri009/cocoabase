import { type Address } from 'viem';

/**
 * Onchain Agricultural Subsidy Distribution utilities
 * Distribute agricultural subsidies onchain
 */

export interface Subsidy {
  id: bigint;
  recipient: Address;
  subsidyType: 'fertilizer' | 'seeds' | 'equipment' | 'irrigation' | 'general';
  amount: bigint;
  status: 'pending' | 'approved' | 'distributed' | 'rejected';
  appliedAt: bigint;
  approvedAt?: bigint;
  distributedAt?: bigint;
  eligibilityScore: number;
}

export function createSubsidyApplication(
  recipient: Address,
  subsidyType: Subsidy['subsidyType'],
  amount: bigint,
  eligibilityScore: number
): Subsidy {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    recipient,
    subsidyType,
    amount,
    status: 'pending',
    appliedAt: now,
    eligibilityScore,
  };
}

export function approveSubsidy(subsidy: Subsidy): Subsidy {
  const now = BigInt(Date.now());
  return {
    ...subsidy,
    status: 'approved',
    approvedAt: now,
  };
}

export function distributeSubsidy(subsidy: Subsidy): Subsidy {
  const now = BigInt(Date.now());
  return {
    ...subsidy,
    status: 'distributed',
    distributedAt: now,
  };
}

export function rejectSubsidy(subsidy: Subsidy): Subsidy {
  return {
    ...subsidy,
    status: 'rejected',
  };
}

export function isEligibleForSubsidy(eligibilityScore: number): boolean {
  return eligibilityScore >= 50;
}

export function calculateSubsidyAmount(
  baseAmount: bigint,
  eligibilityScore: number
): bigint {
  const multiplier = BigInt(Math.floor(eligibilityScore));
  return (baseAmount * multiplier) / BigInt(100);
}

