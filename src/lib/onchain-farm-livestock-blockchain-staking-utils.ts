import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain staking utilities
 * Staking record creation on blockchain
 */

export interface StakingRecord {
  id: string;
  animalId: string;
  stakedBy: Address;
  amount: bigint;
  stakingPeriod: number;
  stakingDate: bigint;
  unstaked: boolean;
  timestamp: bigint;
}

export function createStakingRecord(
  address: Address,
  animalId: string,
  amount: bigint,
  stakingPeriod: number,
  stakingDate: bigint
): StakingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    stakedBy: address,
    amount,
    stakingPeriod,
    stakingDate,
    unstaked: false,
    timestamp: BigInt(Date.now()),
  };
}

