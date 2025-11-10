import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createNFTListing,
  createNFTOffer,
  acceptOffer,
  calculateMarketplaceFee,
  isListingExpired,
  type NFTListing,
  type NFTOffer,
} from '@/lib/onchain-nft-marketplace-utils';

export function useOnchainNFTMarketplace() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [listings, setListings] = useState<NFTListing[]>([]);
  const [offers, setOffers] = useState<NFTOffer[]>([]);
  const [isListing, setIsListing] = useState(false);
  const [isOffering, setIsOffering] = useState(false);

  const listNFT = async (
    tokenId: bigint,
    contract: Address,
    price: bigint,
    token: Address,
    expiresAt?: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsListing(true);
    try {
      const listing = createNFTListing(
        address,
        tokenId,
        contract,
        price,
        token,
        expiresAt
      );
      console.log('Listing NFT:', listing);
    } finally {
      setIsListing(false);
    }
  };

  const makeOffer = async (
    listingId: bigint,
    offerAmount: bigint,
    token: Address,
    expiresAt?: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    setIsOffering(true);
    try {
      const offer = createNFTOffer(
        address,
        listingId,
        offerAmount,
        token,
        expiresAt
      );
      console.log('Making offer:', offer);
    } finally {
      setIsOffering(false);
    }
  };

  return {
    listings,
    offers,
    listNFT,
    makeOffer,
    acceptOffer,
    calculateMarketplaceFee,
    isListingExpired,
    isListing,
    isOffering,
    address,
  };
}

