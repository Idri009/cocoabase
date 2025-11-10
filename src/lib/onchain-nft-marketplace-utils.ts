import { type Address } from 'viem';

export interface NFTListing {
  id: bigint;
  seller: Address;
  tokenId: bigint;
  contract: Address;
  price: bigint;
  token: Address;
  status: 'listed' | 'sold' | 'cancelled';
  createdAt: bigint;
  expiresAt?: bigint;
}

export interface NFTOffer {
  id: bigint;
  buyer: Address;
  listingId: bigint;
  offerAmount: bigint;
  token: Address;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: bigint;
  expiresAt?: bigint;
}

export function createNFTListing(
  seller: Address,
  tokenId: bigint,
  contract: Address,
  price: bigint,
  token: Address,
  expiresAt?: bigint
): NFTListing {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    seller,
    tokenId,
    contract,
    price,
    token,
    status: 'listed',
    createdAt: now,
    expiresAt,
  };
}

export function createNFTOffer(
  buyer: Address,
  listingId: bigint,
  offerAmount: bigint,
  token: Address,
  expiresAt?: bigint
): NFTOffer {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    buyer,
    listingId,
    offerAmount,
    token,
    status: 'pending',
    createdAt: now,
    expiresAt,
  };
}

export function acceptOffer(
  listing: NFTListing,
  offer: NFTOffer
): { listing: NFTListing; offer: NFTOffer } | null {
  if (listing.status !== 'listed') return null;
  if (offer.status !== 'pending') return null;
  if (offer.listingId !== listing.id) return null;

  return {
    listing: { ...listing, status: 'sold' },
    offer: { ...offer, status: 'accepted' },
  };
}

export function calculateMarketplaceFee(
  price: bigint,
  feePercent: number = 0.025
): bigint {
  return (price * BigInt(Math.floor(feePercent * 10000))) / BigInt(10000);
}

export function isListingExpired(
  listing: NFTListing,
  currentTime: bigint
): boolean {
  return listing.expiresAt !== undefined && currentTime > listing.expiresAt;
}

