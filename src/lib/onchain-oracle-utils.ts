import { type Address } from 'viem';

/**
 * Onchain oracle utilities
 * Price feeds, data oracles, and external data
 */

export interface PriceFeed {
  token: Address;
  price: bigint;
  decimals: number;
  updatedAt: number;
}

/**
 * Get price from oracle
 */
export function getOraclePrice(feed: PriceFeed): bigint {
  return feed.price;
}
