import { type Address } from 'viem';

export interface Swap {
  id: bigint;
  swapper: Address;
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  amountOut: bigint;
  slippageTolerance: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: bigint;
  executedAt?: bigint;
}

export function createSwap(
  swapper: Address,
  tokenIn: Address,
  tokenOut: Address,
  amountIn: bigint,
  amountOut: bigint,
  slippageTolerance: number
): Swap {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    swapper,
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    slippageTolerance,
    status: 'pending',
    createdAt: now,
  };
}

export function executeSwap(
  swap: Swap,
  actualAmountOut: bigint,
  currentTime: bigint
): Swap | null {
  if (swap.status !== 'pending') return null;

  const minAmountOut =
    (swap.amountOut * BigInt(Math.floor((100 - swap.slippageTolerance) * 100))) /
    BigInt(10000);

  if (actualAmountOut < minAmountOut) {
    return {
      ...swap,
      status: 'failed',
    };
  }

  return {
    ...swap,
    amountOut: actualAmountOut,
    status: 'completed',
    executedAt: currentTime,
  };
}

export function calculateSwapRate(
  amountIn: bigint,
  amountOut: bigint
): number {
  if (amountIn === BigInt(0)) return 0;
  return Number((amountOut * BigInt(10000)) / amountIn) / 10000;
}

export function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  reserveIn: bigint,
  reserveOut: bigint
): number {
  const k = reserveIn * reserveOut;
  const newReserveIn = reserveIn + amountIn;
  const newReserveOut = k / newReserveIn;
  const expectedOut = reserveOut - newReserveOut;
  const impact = amountOut < expectedOut
    ? expectedOut - amountOut
    : amountOut - expectedOut;
  return expectedOut > BigInt(0)
    ? Number((impact * BigInt(10000)) / expectedOut) / 100
    : 0;
}

export function validateSlippage(
  expectedAmount: bigint,
  actualAmount: bigint,
  slippageTolerance: number
): boolean {
  const minAmount =
    (expectedAmount * BigInt(Math.floor((100 - slippageTolerance) * 100))) /
    BigInt(10000);
  return actualAmount >= minAmount;
}

