import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createListing,
  purchaseListing,
  calculateTotalValue,
  type MarketplaceListing,
} from '@/lib/onchain-agricultural-marketplace-system-utils';

export function useOnchainAgriculturalMarketplaceSystem() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const create = async (
    product: string,
    price: bigint,
    quantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsCreating(true);
    try {
      const listing = createListing(address, product, price, quantity);
      console.log('Creating listing:', listing);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    listings,
    create,
    purchaseListing,
    calculateTotalValue,
    isCreating,
    address,
  };
}
