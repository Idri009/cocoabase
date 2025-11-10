import { type Address } from 'viem';

/**
 * Staking utilities
 * Stake tokens, calculate rewards, and manage positions
 */

export interface StakingPosition {
  staker: Address;
  amount: bigint;
  startTime: number;
  lockPeriod: number;
  rewardRate: number;
  claimedRewards: bigint;
}

export interface StakingReward {
  positionId: bigint;
  amount: bigint;
  timestamp: number;
}

/**
 * Calculate staking rewards
 */
export function calculateStakingReward(
  amount: bigint,
  rewardRate: number,
  duration: number
): bigint {
  const dailyRate = rewardRate / 365;
  return (amount * BigInt(Math.floor(dailyRate * duration * 10000))) / BigInt(10000);
}

