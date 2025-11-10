import { type Address } from 'viem';

/**
 * Onchain royalty utilities
 * NFT royalties and fee calculations
 */

export interface RoyaltyInfo {
  recipient: Address;
  percentage: number; // Basis points (e.g., 250 = 2.5%)
}

/**
 * Calculate royalty amount
 */
export function calculateRoyalty(
  salePrice: bigint,
  royalty: RoyaltyInfo
): bigint {
  return (salePrice * BigInt(royalty.percentage)) / BigInt(10000);
}
