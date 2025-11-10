import { type Address } from 'viem';

export interface PriceStabilizer {
  id: bigint;
  token: Address;
  targetPrice: bigint;
  currentPrice: bigint;
  stabilityRange: number;
  reserve: bigint;
}

export function createPriceStabilizer(
  token: Address,
  targetPrice: bigint,
  stabilityRange: number,
  reserve: bigint
): PriceStabilizer {
  return {
    id: BigInt(0),
    token,
    targetPrice,
    currentPrice: targetPrice,
    stabilityRange,
    reserve,
  };
}

