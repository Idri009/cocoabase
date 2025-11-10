import { type Address } from 'viem';

/**
 * Onchain auction utilities
 * NFT and asset auction system
 */

export interface Auction {
  id: bigint;
  asset: Address;
  tokenId: bigint;
  seller: Address;
  startingPrice: bigint;
  reservePrice: bigint;
  endTime: bigint;
  highestBid: bigint;
  highestBidder: Address | null;
}

export function isValidBid(
  auction: Auction,
  bidAmount: bigint
): boolean {
  return bidAmount > auction.highestBid;
}

export function isAuctionEnded(
  auction: Auction,
  currentTime: bigint
): boolean {
  return currentTime >= auction.endTime;
}
