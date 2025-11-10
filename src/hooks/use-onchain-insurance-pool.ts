import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createInsurancePool,
  purchasePolicy,
  fileClaim,
  type InsurancePool,
  type InsurancePolicy,
} from '@/lib/onchain-insurance-pool-utils';

export function useOnchainInsurancePool() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [pools, setPools] = useState<InsurancePool[]>([]);
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchase = async (
    poolId: bigint,
    coverage: bigint,
    duration: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPurchasing(true);
    try {
      const pool = pools.find((p) => p.id === poolId);
      if (!pool) throw new Error('Pool not found');
      const { policy } = purchasePolicy(pool, address, coverage, duration);
      console.log('Purchasing policy:', policy);
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    pools,
    policies,
    purchase,
    fileClaim,
    isPurchasing,
    address,
  };
}
