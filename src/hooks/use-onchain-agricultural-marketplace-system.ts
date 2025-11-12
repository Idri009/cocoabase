import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createListing,
  purchaseListing,
  getActiveListings,
  calculateTotalValue,
  type MarketplaceListing,
} from '@/lib/onchain-agricultural-marketplace-system-utils';

export function useOnchainAgriculturalMarketplaceSystem() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const purchase = async (
    listingId: bigint,
    quantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPurchasing(true);
    try {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) throw new Error('Listing not found');
      const updated = purchaseListing(listing, address, quantity);
      if (updated) {
        console.log('Purchasing listing:', { listingId, quantity });
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    listings,
    purchase,
    getActiveListings,
    calculateTotalValue,
    isPurchasing,
    address,
  };
}
