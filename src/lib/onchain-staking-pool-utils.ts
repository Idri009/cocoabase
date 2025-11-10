import { type Address } from 'viem';

export interface StakingPool {
  id: bigint;
  token: Address;
  rewardToken: Address;
  totalStaked: bigint;
  rewardRate: bigint;
  lockPeriod: bigint;
  owner: Address;
}

export function createStakingPool(
  token: Address,
  rewardToken: Address,
  rewardRate: bigint,
  lockPeriod: bigint,
  owner: Address
): StakingPool {
  return {
    id: BigInt(0),
    token,
    rewardToken,
    totalStaked: BigInt(0),
    rewardRate,
    lockPeriod,
    owner,
  };
}

