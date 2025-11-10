import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRewardPool,
  claimReward,
  calculateRemainingRewards,
  isRewardPoolActive,
  type RewardPool,
  type RewardClaim,
} from '@/lib/onchain-reward-pool-utils';

export function useOnchainRewardPool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<RewardPool[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);

  const claim = async (poolId: bigint, amount: bigint): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsClaiming(true);
    try {
      const currentTime = BigInt(Date.now());
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const result = claimReward(pool, address, amount, currentTime);
      if (result) {
        console.log('Claiming reward:', result);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    pools,
    claims,
    claim,
    calculateRemainingRewards,
    isRewardPoolActive,
    isClaiming,
    address,
  };
}

