import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createSeedListing,
  purchaseSeed,
  calculateSeedValue,
  verifySeedCertification,
  cancelSeedListing,
  type SeedListing,
} from '@/lib/onchain-seed-exchange-utils';

/**
 * Hook for onchain seed exchange operations
 * Requires Reown wallet connection via useAccount
 */
export function useOnchainSeedExchange() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<SeedListing[]>([]);
  const [isListing, setIsListing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const listSeed = async (
    seedType: string,
    variety: string,
    quantity: bigint,
    price: bigint,
    certification: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    if (!verifySeedCertification(certification)) {
      throw new Error('Invalid seed certification');
    }
    setIsListing(true);
    try {
      const listing = createSeedListing(
        address,
        seedType,
        variety,
        quantity,
        price,
        certification
      );
      setListings((prev) => [...prev, listing]);
      console.log('Listing seed:', listing);
      // Onchain listing via smart contract
      await writeContract({
        address: '0x0000000000000000000000000000000000000000' as Address,
        abi: [],
        functionName: 'listSeed',
        args: [seedType, variety, quantity, price, certification],
      });
    } finally {
      setIsListing(false);
    }
  };

  const purchaseSeedListing = async (
    listingId: bigint,
    purchaseQuantity: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsPurchasing(true);
    try {
      const listing = listings.find((l) => l.id === listingId);
      if (!listing) throw new Error('Listing not found');
      const updated = purchaseSeed(listing, address, purchaseQuantity);
      if (updated) {
        setListings((prev) =>
          prev.map((l) => (l.id === listingId ? updated : l))
        );
        console.log('Purchasing seed:', { listingId, address, purchaseQuantity });
        // Onchain purchase via smart contract
        await writeContract({
          address: '0x0000000000000000000000000000000000000000' as Address,
          abi: [],
          functionName: 'purchaseSeed',
          args: [listingId, purchaseQuantity],
        });
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    listings,
    listSeed,
    purchaseSeedListing,
    calculateSeedValue,
    verifySeedCertification,
    cancelSeedListing,
    isListing,
    isPurchasing,
    address,
  };
}

