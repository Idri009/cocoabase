import { type Address } from 'viem';

export interface TokenMerge {
  id: bigint;
  tokenA: Address;
  tokenB: Address;
  mergedToken: Address;
  mergeRatio: number;
  timestamp: bigint;
}

export function createTokenMerge(
  tokenA: Address,
  tokenB: Address,
  mergedToken: Address,
  mergeRatio: number
): TokenMerge {
  return {
    id: BigInt(0),
    tokenA,
    tokenB,
    mergedToken,
    mergeRatio,
    timestamp: BigInt(Date.now()),
  };
}

