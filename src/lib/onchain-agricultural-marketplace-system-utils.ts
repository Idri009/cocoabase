import { type Address } from 'viem';

export interface MarketplaceListing {
  id: bigint;
  seller: Address;
  product: string;
  price: bigint;
  quantity: bigint;
  status: 'active' | 'sold' | 'cancelled';
}

export function createListing(
  seller: Address,
  product: string,
  price: bigint,
  quantity: bigint
): MarketplaceListing {
  return {
    id: BigInt(0),
    seller,
    product,
    price,
    quantity,
    status: 'active',
  };
}

export function purchaseListing(
  listing: MarketplaceListing,
  buyer: Address,
  quantity: bigint
): MarketplaceListing | null {
  if (listing.status !== 'active') return null;
  if (quantity > listing.quantity) return null;
  const remaining = listing.quantity - quantity;
  return {
    ...listing,
    quantity: remaining,
    status: remaining === BigInt(0) ? 'sold' : 'active',
  };
}

export function getActiveListings(
  listings: MarketplaceListing[]
): MarketplaceListing[] {
  return listings.filter((l) => l.status === 'active');
}

export function calculateTotalValue(
  listings: MarketplaceListing[]
): bigint {
  return listings.reduce(
    (total, listing) => total + listing.price * listing.quantity,
    BigInt(0)
  );
}
