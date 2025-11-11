import { type Address } from 'viem';

export interface MarketplaceListing {
  id: bigint;
  seller: Address;
  product: string;
  price: bigint;
  quantity: bigint;
  active: boolean;
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
    active: true,
  };
}

export function purchaseListing(
  listing: MarketplaceListing,
  buyer: Address,
  quantity: bigint
): { listing: MarketplaceListing; purchase: { buyer: Address; quantity: bigint; total: bigint } } | null {
  if (!listing.active || quantity > listing.quantity) return null;
  const total = listing.price * quantity;
  return {
    listing: {
      ...listing,
      quantity: listing.quantity - quantity,
      active: listing.quantity - quantity > BigInt(0),
    },
    purchase: {
      buyer,
      quantity,
      total,
    },
  };
}

export function cancelListing(listing: MarketplaceListing): MarketplaceListing {
  return {
    ...listing,
    active: false,
  };
}
