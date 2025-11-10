import { type Address } from 'viem';

/**
 * DeFi integration utilities
 * Lending, staking, and yield farming operations
 */

export interface LendingPool {
  address: Address;
  apy: number;
  totalLiquidity: bigint;
  tokenAddress: Address;
}

export interface StakingPool {
  address: Address;
  rewardRate: number;
  totalStaked: bigint;
  lockPeriod: number;
}

/**
 * Calculate APY from interest rate
 */
export function calculateAPY(
  interestRate: number,
  compoundingFrequency: number = 365
): number {
  return (1 + interestRate / compoundingFrequency) ** compoundingFrequency - 1;
}

