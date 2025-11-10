import { type Address } from 'viem';

/**
 * Onchain limit order utilities
 * Limit order system for token trading
 */

export interface LimitOrder {
  id: bigint;
  maker: Address;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  limitPrice: bigint;
  expiresAt: bigint;
  filled: bigint;
}

export function createLimitOrder(
  maker: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountIn: bigint,
  limitPrice: bigint,
  expiresAt: bigint
): LimitOrder {
  return {
    id: BigInt(0),
    maker,
    tokenIn,
    tokenOut,
    amountIn,
    limitPrice,
    expiresAt,
    filled: BigInt(0),
  };
}

export function fillLimitOrder(
  order: LimitOrder,
  fillAmount: bigint,
  currentTime: bigint
): LimitOrder {
  if (currentTime > order.expiresAt) return order;
  return { ...order, filled: order.filled + fillAmount };
}
