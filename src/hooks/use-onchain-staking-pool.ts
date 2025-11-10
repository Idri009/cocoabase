import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createStakingPool,
  stake,
  calculateRewards,
  type StakingPool,
  type StakingPosition,
} from '@/lib/onchain-staking-pool-utils';

export function useOnchainStakingPool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [positions, setPositions] = useState<StakingPosition[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const createPool = async (
    token: Address,
    rewardToken: Address,
    rewardRate: bigint,
    lockPeriod: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const pool = createStakingPool(token, rewardToken, rewardRate, lockPeriod, address);
      console.log('Creating staking pool:', pool);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    pools,
    positions,
    createPool,
    stake,
    calculateRewards,
    isCreating,
    address,
  };
}

