import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createRevenueShare,
  addRevenue,
  distributeRevenue,
  addShareholder,
  type RevenueShare,
} from '@/lib/onchain-revenue-share-utils';

export function useOnchainRevenueShare() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [revenueShares, setRevenueShares] = useState<RevenueShare[]>([]);
  const [isDistributing, setIsDistributing] = useState(false);

  const distribute = async (
    revenueShareId: bigint,
    shareholder: Address
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsDistributing(true);
    try {
      const revenueShare = revenueShares.find((r) => r.id === revenueShareId);
      if (!revenueShare) throw new Error('Revenue share not found');
      const amount = distributeRevenue(revenueShare, shareholder);
      console.log('Distributing revenue:', { revenueShareId, shareholder, amount });
    } finally {
      setIsDistributing(false);
    }
  };

  return {
    revenueShares,
    distribute,
    addRevenue,
    addShareholder,
    isDistributing,
    address,
  };
}

