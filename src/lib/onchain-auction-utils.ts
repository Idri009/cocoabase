import { type Address } from 'viem';

/**
 * Onchain auction utilities
 * Decentralized auction system for NFT and asset trading
 */

export interface Auction {
  id: bigint;
  seller: Address;
  tokenId: bigint;
  tokenContract: Address;
  startingPrice: bigint;
  currentBid: bigint;
  highestBidder: Address;
  status: 'active' | 'ended' | 'cancelled';
  startTime: bigint;
  endTime: bigint;
  reservePrice?: bigint;
}

export function createAuction(
  seller: Address,
  tokenId: bigint,
  tokenContract: Address,
  startingPrice: bigint,
  duration: bigint
): Auction {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    seller,
    tokenId,
    tokenContract,
    startingPrice,
    currentBid: BigInt(0),
    highestBidder: '0x0' as Address,
    status: 'active',
    startTime: now,
    endTime: now + duration,
  };
}

export function placeBid(
  auction: Auction,
  bidder: Address,
  bidAmount: bigint,
  currentTime: bigint
): Auction | null {
  if (auction.status !== 'active') return null;
  if (currentTime >= auction.endTime) return null;
  if (bidAmount <= auction.currentBid) return null;
  if (auction.reservePrice && bidAmount < auction.reservePrice) return null;

  return {
    ...auction,
    currentBid: bidAmount,
    highestBidder: bidder,
  };
}

export function isAuctionActive(
  auction: Auction,
  currentTime: bigint
): boolean {
  return (
    auction.status === 'active' &&
    currentTime < auction.endTime &&
    currentTime >= auction.startTime
  );
}

export function endAuction(
  auction: Auction,
  currentTime: bigint
): Auction | null {
  if (auction.status !== 'active') return null;
  if (currentTime < auction.endTime) return null;

  return {
    ...auction,
    status: 'ended',
  };
}

export function calculateAuctionFee(
  bidAmount: bigint,
  feePercent: number = 0.025
): bigint {
  return (bidAmount * BigInt(Math.floor(feePercent * 10000))) / BigInt(10000);
}

export function getTimeRemaining(
  auction: Auction,
  currentTime: bigint
): bigint {
  if (currentTime >= auction.endTime) return BigInt(0);
  return auction.endTime - currentTime;
}

