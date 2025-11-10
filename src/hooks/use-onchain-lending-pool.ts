import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createLendingPool,
  supplyLiquidity,
  borrow,
  calculateBorrowRate,
  type LendingPool,
} from '@/lib/onchain-lending-pool-utils';

export function useOnchainLendingPool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<LendingPool[]>([]);
  const [isSupplying, setIsSupplying] = useState(false);

  const supply = async (
    poolId: bigint,
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsSupplying(true);
    try {
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const updated = supplyLiquidity(pool, address, amount);
      console.log('Supplying liquidity:', { poolId, amount });
    } finally {
      setIsSupplying(false);
    }
  };

  return {
    pools,
    supply,
    borrow,
    calculateBorrowRate,
    isSupplying,
    address,
  };
}
