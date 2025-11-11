import { type Address } from 'viem';

export interface RateLimiter {
  id: bigint;
  address: Address;
  limit: bigint;
  window: bigint;
  count: bigint;
  resetTime: bigint;
}

export function createRateLimiter(
  address: Address,
  limit: bigint,
  window: bigint
): RateLimiter {
  return {
    id: BigInt(0),
    address,
    limit,
    window,
    count: BigInt(0),
    resetTime: BigInt(Date.now()) + window,
  };
}

