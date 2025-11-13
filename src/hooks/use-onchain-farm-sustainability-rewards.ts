import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createReward,
  type SustainabilityReward,
} from '@/lib/onchain-farm-sustainability-rewards-utils';

/**
 * Hook for onchain farm sustainability rewards
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmSustainabilityRewards() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [rewards, setRewards] = useState<SustainabilityReward[]>([]);

  const claimReward = async (
    plantationId: string,
    sustainabilityScore: number,
    rewardAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const reward = createReward(address, plantationId, sustainabilityScore, rewardAmount);
    setRewards([...rewards, reward]);
  };

  const distributeReward = async (
    contractAddress: Address,
    rewardId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'distributeReward',
      args: [rewardId],
    });
  };

  return { rewards, claimReward, distributeReward, address };
}

