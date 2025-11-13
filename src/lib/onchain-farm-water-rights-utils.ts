import { type Address } from 'viem';

/**
 * Onchain farm water rights utilities
 * Water rights management and usage tracking
 */

export interface WaterRight {
  id: string;
  rightId: bigint;
  owner: Address;
  allocationAmount: bigint;
  usedAmount: bigint;
  startDate: bigint;
  endDate: bigint;
  source: string;
  active: boolean;
}

export function createWaterRight(
  address: Address,
  rightId: bigint,
  allocationAmount: bigint,
  startDate: bigint,
  endDate: bigint,
  source: string
): WaterRight {
  return {
    id: `${Date.now()}-${Math.random()}`,
    rightId,
    owner: address,
    allocationAmount,
    usedAmount: BigInt(0),
    startDate,
    endDate,
    source,
    active: true,
  };
}

