import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createCarbonOffsetListing,
  type CarbonOffsetListing,
} from '@/lib/onchain-farm-carbon-offset-marketplace-utils';

/**
 * Hook for onchain farm carbon offset marketplace
 * Uses Reown wallet for all transactions
 */
export function useOnchainFarmCarbonOffsetMarketplace() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<CarbonOffsetListing[]>([]);

  const listOffset = async (
    plantationId: string,
    carbonAmount: bigint,
    pricePerTon: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const listing = createCarbonOffsetListing(address, plantationId, carbonAmount, pricePerTon);
    setListings([...listings, listing]);
  };

  const purchaseOffset = async (
    contractAddress: Address,
    listingId: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: contractAddress,
      abi: [],
      functionName: 'purchaseOffset',
      args: [listingId],
    });
  };

  return { listings, listOffset, purchaseOffset, address };
}

