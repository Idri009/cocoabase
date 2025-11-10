import { type Address } from 'viem';

export interface LiquidityMiningPool {
  id: bigint;
  tokenA: Address;
  tokenB: Address;
  rewardToken: Address;
  rewardRate: bigint;
  totalLiquidity: bigint;
}

export function createLiquidityMiningPool(
  tokenA: Address,
  tokenB: Address,
  rewardToken: Address,
  rewardRate: bigint
): LiquidityMiningPool {
  return {
    id: BigInt(0),
    tokenA,
    tokenB,
    rewardToken,
    rewardRate,
    totalLiquidity: BigInt(0),
  };
}

