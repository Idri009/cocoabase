import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRateLimit,
  type RateLimit,
} from '@/lib/onchain-farm-crop-harvest-blockchain-ratelimit-utils';

/**
 * Hook for onchain farm crop harvest blockchain rate limit
 * Uses blockchain wallet for all web3 transactions
 */
export function useOnchainFarmCropHarvestBlockchainRateLimit() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [limits, setLimits] = useState<RateLimit[]>([]);

  const setRateLimit = async (
    harvestId: string,
    limitAmount: bigint,
    timeWindow: number,
    limitDate: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    const limit = createRateLimit(address, harvestId, limitAmount, timeWindow, limitDate);
    setLimits([...limits, limit]);
  };

  const updateRateLimit = async (
    contractAddress: Address,
    limitId: string,
    newLimitAmount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Web3 wallet not connected');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'updateRateLimit',
      args: [limitId, newLimitAmount],
    });
  };

  return { limits, setRateLimit, updateRateLimit, address };
}

