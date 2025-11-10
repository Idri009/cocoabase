import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRewardPool,
  addParticipant,
  distributeRewards,
  calculateRemainingRewards,
  type RewardPool,
} from '@/lib/onchain-reward-pool-utils';

export function useOnchainRewardPool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<RewardPool[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);

  const distribute = async (
    poolId: bigint,
    recipient: Address,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsDistributing(true);
    try {
      const currentTime = BigInt(Date.now());
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const updated = distributeRewards(pool, recipient, amount, currentTime);
      if (updated) {
        console.log('Distributing rewards:', { poolId, recipient, amount });
      }
    } finally {
      setIsDistributing(false);
    }
  };

  return {
    pools,
    distribute,
    addParticipant,
    calculateRemainingRewards,
    isDistributing,
    address,
  };
}
