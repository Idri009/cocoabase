import { type Address } from 'viem';

export interface RewardPool {
  id: bigint;
  rewardToken: Address;
  totalRewards: bigint;
  distributed: bigint;
  startTime: bigint;
  endTime: bigint;
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

