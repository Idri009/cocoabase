import { type Address } from 'viem';

/**
 * Onchain royalty distribution utilities
 * Royalty payments and distribution
 */

export interface Royalty {
  id: bigint;
  nft: Address;
  tokenId: bigint;
  recipient: Address;
  percentage: number;
  accumulated: bigint;
  distributed: bigint;
}

export interface RoyaltyPayment {
  royalty: bigint;
  recipient: Address;
  amount: bigint;
  timestamp: bigint;
  txHash: string;
}

export function createRoyalty(
  nft: Address,
  tokenId: bigint,
  recipient: Address,
  percentage: number
): Royalty {
  return {
    id: BigInt(0),
    nft,
    tokenId,
    recipient,
    percentage,
    accumulated: BigInt(0),
    distributed: BigInt(0),
  };
}

export function calculateRoyaltyAmount(
  salePrice: bigint,
  royaltyPercentage: number
): bigint {
  return (salePrice * BigInt(Math.floor(royaltyPercentage * 100))) / BigInt(10000);
}

export function accumulateRoyalty(
  royalty: Royalty,
  salePrice: bigint
): Royalty {
  const amount = calculateRoyaltyAmount(salePrice, royalty.percentage);
  return {
    ...royalty,
    accumulated: royalty.accumulated + amount,
  };
}

export function distributeRoyalty(
  royalty: Royalty,
  amount: bigint
): { royalty: Royalty; payment: RoyaltyPayment } {
  const payment: RoyaltyPayment = {
    royalty: royalty.id,
    recipient: royalty.recipient,
    amount,
    timestamp: BigInt(Date.now()),
    txHash: '',
  };
  return {
    royalty: {
      ...royalty,
      distributed: royalty.distributed + amount,
      accumulated: royalty.accumulated - amount,
    },
    payment,
  };
}

export function calculatePendingRoyalties(
  royalty: Royalty
): bigint {
  return royalty.accumulated - royalty.distributed;
}

export function validateRoyaltyPercentage(
  percentage: number
): boolean {
  return percentage >= 0 && percentage <= 100;
}

export function splitRoyalties(
  totalAmount: bigint,
  royalties: Royalty[]
): Map<Address, bigint> {
  const distribution = new Map<Address, bigint>();
  royalties.forEach(royalty => {
    const amount = calculateRoyaltyAmount(totalAmount, royalty.percentage);
    const current = distribution.get(royalty.recipient) || BigInt(0);
    distribution.set(royalty.recipient, current + amount);
  });
  return distribution;
}
