import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain rate limit utilities
 * Rate limit creation on blockchain
 */

export interface RateLimit {
  id: string;
  harvestId: string;
  setBy: Address;
  limitAmount: bigint;
  timeWindow: number;
  limitDate: bigint;
  timestamp: bigint;
}

export function createRateLimit(
  address: Address,
  harvestId: string,
  limitAmount: bigint,
  timeWindow: number,
  limitDate: bigint
): RateLimit {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    setBy: address,
    limitAmount,
    timeWindow,
    limitDate,
    timestamp: BigInt(Date.now()),
  };
}

