import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateRewardAmount,
  type Reward,
} from '@/lib/onchain-rewards-utils';

export function useOnchainRewards() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [rewards, setRewards] = useState<Reward[]>([]);

  const claimReward = async (
    rewardId: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'claimReward',
      args: [rewardId],
    });
  };

  return { rewards, claimReward, address };
}
