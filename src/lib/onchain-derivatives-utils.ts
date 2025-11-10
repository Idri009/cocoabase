import { type Address } from 'viem';

/**
 * Onchain derivatives utilities
 * Decentralized derivatives trading for agricultural commodities
 */

export interface Derivative {
  id: bigint;
  creator: Address;
  underlyingAsset: string;
  strikePrice: bigint;
  expiryTime: bigint;
  premium: bigint;
  token: Address;
  type: 'call' | 'put';
  status: 'active' | 'exercised' | 'expired';
  positionSize: bigint;
}

export function createDerivative(
  creator: Address,
  underlyingAsset: string,
  strikePrice: bigint,
  expiryTime: bigint,
  premium: bigint,
  token: Address,
  type: 'call' | 'put',
  positionSize: bigint
): Derivative {
  return {
    id: BigInt(0),
    creator,
    underlyingAsset,
    strikePrice,
    expiryTime,
    premium,
    token,
    type,
    status: 'active',
    positionSize,
  };
}

export function exerciseDerivative(
  derivative: Derivative,
  exerciser: Address,
  currentPrice: bigint,
  currentTime: bigint
): Derivative | null {
  if (derivative.status !== 'active') return null;
  if (currentTime > derivative.expiryTime) return null;

  const isProfitable =
    derivative.type === 'call'
      ? currentPrice > derivative.strikePrice
      : currentPrice < derivative.strikePrice;

  if (!isProfitable) return null;

  return {
    ...derivative,
    status: 'exercised',
  };
}

export function isDerivativeExpired(
  derivative: Derivative,
  currentTime: bigint
): boolean {
  return currentTime > derivative.expiryTime && derivative.status === 'active';
}

export function calculateDerivativePayout(
  derivative: Derivative,
  currentPrice: bigint
): bigint {
  if (derivative.type === 'call') {
    if (currentPrice <= derivative.strikePrice) return BigInt(0);
    return (currentPrice - derivative.strikePrice) * derivative.positionSize;
  } else {
    if (currentPrice >= derivative.strikePrice) return BigInt(0);
    return (derivative.strikePrice - currentPrice) * derivative.positionSize;
  }
}

