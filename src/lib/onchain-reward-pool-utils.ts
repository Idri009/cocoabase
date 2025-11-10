import { type Address } from 'viem';

export interface RewardPool {
  id: bigint;
  rewardToken: Address;
  totalRewards: bigint;
  distributed: bigint;
  startTime: bigint;
  endTime: bigint;
}

export interface RewardClaim {
  claimant: Address;
  amount: bigint;
  claimedAt: bigint;
}

export function createRewardPool(
  rewardToken: Address,
  totalRewards: bigint,
  duration: bigint
): RewardPool {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    rewardToken,
    totalRewards,
    distributed: BigInt(0),
    startTime: now,
    endTime: now + duration,
  };
}

export function claimReward(
  pool: RewardPool,
  claimant: Address,
  amount: bigint,
  currentTime: bigint
): { pool: RewardPool; claim: RewardClaim } | null {
  if (currentTime < pool.startTime || currentTime > pool.endTime) return null;
  if (pool.distributed + amount > pool.totalRewards) return null;
  return {
    pool: {
      ...pool,
      distributed: pool.distributed + amount,
    },
    claim: {
      claimant,
      amount,
      claimedAt: currentTime,
    },
  };
}

export function calculateRemainingRewards(pool: RewardPool): bigint {
  return pool.totalRewards - pool.distributed;
}

export function isRewardPoolActive(
  pool: RewardPool,
  currentTime: bigint
): boolean {
  return currentTime >= pool.startTime && currentTime <= pool.endTime;
}
