import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLiquidityMiningPool,
  stakeLiquidity,
  calculateLiquidityRewards,
  type LiquidityMiningPool,
  type LiquidityPosition,
} from '@/lib/onchain-liquidity-mining-utils';

export function useOnchainLiquidityMining() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<LiquidityMiningPool[]>([]);
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);
  const [isStaking, setIsStaking] = useState(false);

  const stake = async (
    poolId: bigint,
    liquidity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsStaking(true);
    try {
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const currentTime = BigInt(Date.now());
      const result = stakeLiquidity(pool, address, liquidity, currentTime);
      console.log('Staking liquidity:', result);
    } finally {
      setIsStaking(false);
    }
  };

  return {
    pools,
    positions,
    stake,
    calculateLiquidityRewards,
    isStaking,
    address,
  };
}

