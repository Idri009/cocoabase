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

export function checkRateLimit(
  limiter: RateLimiter,
  currentTime: bigint
): { limiter: RateLimiter; allowed: boolean } {
  if (currentTime >= limiter.resetTime) {
    return {
      limiter: {
        ...limiter,
        count: BigInt(1),
        resetTime: currentTime + limiter.window,
      },
      allowed: true,
    };
  }
  if (limiter.count >= limiter.limit) {
    return {
      limiter,
      allowed: false,
    };
  }
  return {
    limiter: {
      ...limiter,
      count: limiter.count + BigInt(1),
    },
    allowed: true,
  };
}
