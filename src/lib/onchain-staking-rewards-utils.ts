import { type Address } from 'viem';

export interface StakingRewards {
  id: bigint;
  stakingToken: Address;
  rewardToken: Address;
  rewardRate: bigint;
  totalStaked: bigint;
  lastUpdateTime: bigint;
}

export interface StakerReward {
  staker: Address;
  stakedAmount: bigint;
  rewardDebt: bigint;
  pendingRewards: bigint;
}

export function createStakingRewards(
  stakingToken: Address,
  rewardToken: Address,
  rewardRate: bigint
): StakingRewards {
  return {
    id: BigInt(0),
    stakingToken,
    rewardToken,
    rewardRate,
    totalStaked: BigInt(0),
    lastUpdateTime: BigInt(Date.now()),
  };
}

export function stakeTokens(
  rewards: StakingRewards,
  staker: Address,
  amount: bigint
): { rewards: StakingRewards; stakerReward: StakerReward } {
  return {
    rewards: {
      ...rewards,
      totalStaked: rewards.totalStaked + amount,
    },
    stakerReward: {
      staker,
      stakedAmount: amount,
      rewardDebt: BigInt(0),
      pendingRewards: BigInt(0),
    },
  };
}

export function calculatePendingRewards(
  stakerReward: StakerReward,
  rewards: StakingRewards,
  currentTime: bigint
): bigint {
  if (rewards.totalStaked === BigInt(0)) return BigInt(0);
  const timeDelta = currentTime - rewards.lastUpdateTime;
  const rewardPerToken = (rewards.rewardRate * timeDelta) / rewards.totalStaked;
  return (stakerReward.stakedAmount * rewardPerToken) - stakerReward.rewardDebt;
}
