import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createListing,
  type MarketplaceListing,
} from '@/lib/onchain-agricultural-marketplace-system-utils';

export function useOnchainAgriculturalMarketplaceSystem() {
  const { address } = useAccount();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);

  const create = async (
    productType: string,
    quantity: bigint,
    price: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const listing = createListing(address, productType, quantity, price);
    setListings([...listings, listing]);
  };

  return { listings, create, address };
}
