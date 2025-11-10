import { type Address } from 'viem';

/**
 * Onchain marketplace utilities
 * List, buy, and sell NFTs and tokens
 */

export interface MarketplaceListing {
  id: bigint;
  seller: Address;
  tokenAddress: Address;
  tokenId: bigint;
  price: bigint;
  currency: Address;
  active: boolean;
}

export interface MarketplaceOffer {
  id: bigint;
  buyer: Address;
  listingId: bigint;
  amount: bigint;
  expiresAt: number;
}

/**
 * Calculate marketplace fee
 */
export function calculateMarketplaceFee(
  price: bigint,
  feePercent: number = 2.5
): bigint {
  return (price * BigInt(Math.floor(feePercent * 100))) / BigInt(10000);
}

/**
 * Calculate seller proceeds
 */
export function calculateSellerProceeds(
  price: bigint,
  feePercent: number = 2.5
): bigint {
  return price - calculateMarketplaceFee(price, feePercent);
}

/**
 * Check if offer is valid
 */
export function isOfferValid(offer: MarketplaceOffer): boolean {
  return offer.expiresAt > Date.now();
}

/**
 * Calculate total cost including fees
 */
export function calculateTotalCost(
  price: bigint,
  feePercent: number = 2.5
): bigint {
  return price + calculateMarketplaceFee(price, feePercent);
}

/**
 * Format listing price
 */
export function formatListingPrice(
  price: bigint,
  decimals: number = 18
): string {
  const divisor = BigInt(10 ** decimals);
  const whole = price / divisor;
  const fraction = price % divisor;
  return `${whole.toString()}.${fraction.toString().padStart(decimals, '0').slice(0, 4)}`;
}

