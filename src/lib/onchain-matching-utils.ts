import { type Address } from 'viem';

export interface Order {
  id: bigint;
  maker: Address;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  amountOut: bigint;
  type: 'buy' | 'sell';
  status: 'open' | 'filled' | 'cancelled';
  createdAt: bigint;
  expiresAt?: bigint;
}

export function createOrder(
  maker: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountIn: bigint,
  amountOut: bigint,
  type: 'buy' | 'sell',
  expiresAt?: bigint
): Order {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    maker,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    type,
    status: 'open',
    createdAt: now,
    expiresAt,
  };
}

export function matchOrders(
  buyOrder: Order,
  sellOrder: Order,
  currentTime: bigint
): { buyOrder: Order; sellOrder: Order; fillAmount: bigint } | null {
  if (buyOrder.status !== 'open' || sellOrder.status !== 'open') return null;
  if (buyOrder.expiresAt && currentTime > buyOrder.expiresAt) return null;
  if (sellOrder.expiresAt && currentTime > sellOrder.expiresAt) return null;
  if (buyOrder.tokenIn !== sellOrder.tokenOut) return null;
  if (buyOrder.tokenOut !== sellOrder.tokenIn) return null;
  if (buyOrder.amountOut < sellOrder.amountIn) return null;

  const fillAmount = buyOrder.amountIn < sellOrder.amountOut
    ? buyOrder.amountIn
    : sellOrder.amountOut;

  return {
    buyOrder: { ...buyOrder, status: 'filled' },
    sellOrder: { ...sellOrder, status: 'filled' },
    fillAmount,
  };
}

export function cancelOrder(order: Order): Order | null {
  if (order.status !== 'open') return null;
  return { ...order, status: 'cancelled' };
}

export function isOrderExpired(order: Order, currentTime: bigint): boolean {
  return order.expiresAt !== undefined && currentTime > order.expiresAt;
}
