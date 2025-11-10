import { type Address } from 'viem';

export interface PriceStabilizer {
  id: bigint;
  token: Address;
  targetPrice: bigint;
  currentPrice: bigint;
  reserve: bigint;
  algorithm: 'peg' | 'band' | 'smoothing';
}

export function createPriceStabilizer(
  token: Address,
  targetPrice: bigint,
  algorithm: 'peg' | 'band' | 'smoothing'
): PriceStabilizer {
  return {
    id: BigInt(0),
    token,
    targetPrice,
    currentPrice: targetPrice,
    reserve: BigInt(0),
    algorithm,
  };
}
