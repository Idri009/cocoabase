import { type Address } from 'viem';

export interface TokenSplit {
  id: bigint;
  token: Address;
  splitRatio: number;
  newToken: Address;
  timestamp: bigint;
}

export function createTokenSplit(
  token: Address,
  splitRatio: number,
  newToken: Address
): TokenSplit {
  return {
    id: BigInt(0),
    token,
    splitRatio,
    newToken,
    timestamp: BigInt(Date.now()),
  };
}

export function calculateSplitAmount(
  split: TokenSplit,
  amount: bigint
): bigint {
  return (amount * BigInt(Math.floor(split.splitRatio * 100))) / BigInt(10000);
}

export function validateSplitRatio(ratio: number): boolean {
  return ratio > 0 && ratio <= 100;
}
