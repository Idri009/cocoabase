import { type Address } from 'viem';

/**
 * Onchain Seed Exchange utilities
 * Decentralized marketplace for seed trading
 */

export interface SeedListing {
  id: bigint;
  seller: Address;
  seedType: string;
  variety: string;
  quantity: bigint;
  price: bigint;
  certification: string;
  status: 'listed' | 'sold' | 'cancelled';
  createdAt: bigint;
  buyer?: Address;
}

export function createSeedListing(
  seller: Address,
  seedType: string,
  variety: string,
  quantity: bigint,
  price: bigint,
  certification: string
): SeedListing {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    seller,
    seedType,
    variety,
    quantity,
    price,
    certification,
    status: 'listed',
    createdAt: now,
  };
}

export function purchaseSeed(
  listing: SeedListing,
  buyer: Address,
  purchaseQuantity: bigint
): SeedListing | null {
  if (listing.status !== 'listed') return null;
  if (purchaseQuantity > listing.quantity) return null;

  return {
    ...listing,
    quantity: listing.quantity - purchaseQuantity,
    buyer,
    status: purchaseQuantity === listing.quantity ? 'sold' : 'listed',
  };
}

export function calculateSeedValue(
  quantity: bigint,
  pricePerUnit: bigint
): bigint {
  return quantity * pricePerUnit;
}

export function verifySeedCertification(certification: string): boolean {
  return certification.length > 0 && (
    certification.startsWith('ORG-') ||
    certification.startsWith('HEIR-') ||
    certification.startsWith('CERT-')
  );
}

export function cancelSeedListing(
  listing: SeedListing,
  canceller: Address
): SeedListing | null {
  if (listing.status !== 'listed') return null;
  if (listing.seller !== canceller) return null;

  return {
    ...listing,
    status: 'cancelled',
  };
}

