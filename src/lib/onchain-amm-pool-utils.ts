import { type Address } from 'viem';

export interface AMPool {
  id: bigint;
  tokenA: Address;
  tokenB: Address;
  reserveA: bigint;
  reserveB: bigint;
  totalSupply: bigint;
  fee: number;
}

export function createAMMPool(
  tokenA: Address,
  tokenB: Address,
  reserveA: bigint,
  reserveB: bigint,
  fee: number
): AMPool {
  return {
    id: BigInt(0),
    tokenA,
    tokenB,
    reserveA,
    reserveB,
    totalSupply: BigInt(0),
    fee,
  };
}

export function swapTokens(
  pool: AMPool,
  tokenIn: Address,
  amountIn: bigint
): { pool: AMPool; amountOut: bigint } {
  const isTokenA = tokenIn === pool.tokenA;
  const reserveIn = isTokenA ? pool.reserveA : pool.reserveB;
  const reserveOut = isTokenA ? pool.reserveB : pool.reserveA;
  const amountInWithFee = amountIn * BigInt(10000 - pool.fee) / BigInt(10000);
  const amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
  return {
    pool: {
      ...pool,
      reserveA: isTokenA ? pool.reserveA + amountIn : pool.reserveA - amountOut,
      reserveB: isTokenA ? pool.reserveB - amountOut : pool.reserveB + amountIn,
    },
    amountOut,
  };
}

export function addLiquidity(
  pool: AMPool,
  amountA: bigint,
  amountB: bigint
): { pool: AMPool; liquidity: bigint } {
  const liquidity = pool.totalSupply === BigInt(0)
    ? BigInt(Math.sqrt(Number(amountA * amountB)))
    : (amountA * pool.totalSupply) / pool.reserveA;
  return {
    pool: {
      ...pool,
      reserveA: pool.reserveA + amountA,
      reserveB: pool.reserveB + amountB,
      totalSupply: pool.totalSupply + liquidity,
    },
    liquidity,
  };
}
