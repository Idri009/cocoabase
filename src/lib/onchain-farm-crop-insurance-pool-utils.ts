import { type Address } from 'viem';

/**
 * Onchain farm crop insurance pool utilities
 * Crop insurance pooling system
 */

export interface PoolMember {
  farmer: Address;
  contribution: bigint;
  coverageAmount: bigint;
  isActive: boolean;
  joinDate: bigint;
}

export interface Claim {
  id: string;
  claimId: bigint;
  farmer: Address;
  claimAmount: bigint;
  reason: string;
  claimDate: bigint;
  approved: boolean;
  processed: boolean;
}

export function createPoolMember(
  address: Address,
  contribution: bigint,
  coverageAmount: bigint
): PoolMember {
  return {
    farmer: address,
    contribution,
    coverageAmount,
    isActive: true,
    joinDate: BigInt(Date.now()),
  };
}

export function createClaim(
  address: Address,
  claimAmount: bigint,
  reason: string
): Claim {
  return {
    id: `${Date.now()}-${Math.random()}`,
    claimId: BigInt(0),
    farmer: address,
    claimAmount,
    reason,
    claimDate: BigInt(Date.now()),
    approved: false,
    processed: false,
  };
}

