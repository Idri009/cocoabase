import { type Address } from 'viem';

/**
 * Onchain AMM integration utilities
 * Automated market maker operations
 */

export interface AMMPool {
  address: Address;
  token0: Address;
  token1: Address;
  reserve0: bigint;
  reserve1: bigint;
  fee: number;
  k: bigint;
}

export function calculateAMMPrice(
  pool: AMMPool,
  tokenIn: Address
): bigint {
  const reserveIn = tokenIn === pool.token0 ? pool.reserve0 : pool.reserve1;
  const reserveOut = tokenIn === pool.token0 ? pool.reserve1 : pool.reserve0;
  if (reserveOut === BigInt(0)) return BigInt(0);
  return (reserveIn * BigInt(10 ** 18)) / reserveOut;
}

export function calculateSwapAmountOut(
  amountIn: bigint,
  reserveIn: bigint,
  reserveOut: bigint,
  fee: number = 0.003
): bigint {
  const amountInWithFee = amountIn * BigInt(Math.floor((1 - fee) * 1000000));
  const numerator = amountInWithFee * reserveOut;
  const denominator = (reserveIn * BigInt(1000000)) + amountInWithFee;
  return numerator / denominator;
}

export function calculateAddLiquidity(
  amount0: bigint,
  amount1: bigint,
  reserve0: bigint,
  reserve1: bigint
): { amount0Optimal: bigint; amount1Optimal: bigint } {
  if (reserve0 === BigInt(0) || reserve1 === BigInt(0)) {
    return { amount0Optimal: amount0, amount1Optimal: amount1 };
  }
  const amount1Optimal = (amount0 * reserve1) / reserve0;
  if (amount1Optimal <= amount1) {
    return { amount0Optimal: amount0, amount1Optimal: amount1Optimal };
  }
  const amount0Optimal = (amount1 * reserve0) / reserve1;
  return { amount0Optimal: amount0Optimal, amount1Optimal: amount1 };
}

export function calculateRemoveLiquidity(
  lpAmount: bigint,
  totalSupply: bigint,
  reserve0: bigint,
  reserve1: bigint
): { amount0: bigint; amount1: bigint } {
  const amount0 = (lpAmount * reserve0) / totalSupply;
  const amount1 = (lpAmount * reserve1) / totalSupply;
  return { amount0, amount1 };
}

export function updatePoolReserves(
  pool: AMMPool,
  reserve0: bigint,
  reserve1: bigint
): AMMPool {
  return {
    ...pool,
    reserve0,
    reserve1,
    k: reserve0 * reserve1,
  };
}

export function calculatePriceImpact(
  amountIn: bigint,
  reserveIn: bigint
): number {
  if (reserveIn === BigInt(0)) return 0;
  return (Number(amountIn) / Number(reserveIn)) * 100;
}
