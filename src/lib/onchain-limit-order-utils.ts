import { type Address } from 'viem';

export interface LimitOrder {
  id: bigint;
  maker: Address;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  limitPrice: bigint;
  status: 'open' | 'filled' | 'cancelled' | 'expired';
  expiresAt: bigint;
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
    status: 'open',
    expiresAt,
  };
}

export function fillLimitOrder(
  order: LimitOrder,
  currentPrice: bigint,
  currentTime: bigint
): LimitOrder | null {
  if (order.status !== 'open') return null;
  if (currentTime > order.expiresAt) return null;
  if (currentPrice < order.limitPrice) return null;
  return { ...order, status: 'filled' };
}

export function cancelLimitOrder(order: LimitOrder): LimitOrder | null {
  if (order.status !== 'open') return null;
  return { ...order, status: 'cancelled' };
}

