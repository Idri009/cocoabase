import { type Address } from 'viem';

export interface StakingRewards {
  id: bigint;
  stakingToken: Address;
  rewardToken: Address;
  rewardRate: bigint;
  totalStaked: bigint;
  periodFinish: bigint;
}

export interface StakingPosition {
  staker: Address;
  amount: bigint;
  stakedAt: bigint;
  rewardsEarned: bigint;
}

export function createStakingRewards(
  stakingToken: Address,
  rewardToken: Address,
  rewardRate: bigint,
  duration: bigint
): StakingRewards {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    stakingToken,
    rewardToken,
    rewardRate,
    totalStaked: BigInt(0),
    periodFinish: now + duration,
  };
}

export function stakeTokens(
  rewards: StakingRewards,
  staker: Address,
  amount: bigint,
  currentTime: bigint
): { rewards: StakingRewards; position: StakingPosition } {
  return {
    rewards: {
      ...rewards,
      totalStaked: rewards.totalStaked + amount,
    },
    position: {
      staker,
      amount,
      stakedAt: currentTime,
      rewardsEarned: BigInt(0),
    },
  };
}

export function calculateRewards(
  position: StakingPosition,
  rewards: StakingRewards,
  currentTime: bigint
): bigint {
  if (currentTime > rewards.periodFinish) return BigInt(0);
  const stakedDuration = currentTime - position.stakedAt;
  const share = rewards.totalStaked > BigInt(0)
    ? (position.amount * BigInt(10000)) / rewards.totalStaked
    : BigInt(0);
  return (rewards.rewardRate * share * stakedDuration) / BigInt(86400) / BigInt(10000);
}
