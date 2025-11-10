import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateRewardAmount,
  type Reward,
} from '@/lib/onchain-rewards-utils';

export function useOnchainRewards() {
  const { address } = useAccount();
  const [rewards, setRewards] = useState<Reward[]>([]);

  const claimReward = async (
    rewardId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    // Claim reward onchain
    console.log('Claiming reward:', { rewardId, address });
  };

  return { rewards, claimReward, address };
}

