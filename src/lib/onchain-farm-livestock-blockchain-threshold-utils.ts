import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain threshold utilities
 * Threshold creation on blockchain
 */

export interface Threshold {
  id: string;
  animalId: string;
  setBy: Address;
  thresholdValue: bigint;
  thresholdType: string;
  thresholdDate: bigint;
  timestamp: bigint;
}

export function createThreshold(
  address: Address,
  animalId: string,
  thresholdValue: bigint,
  thresholdType: string,
  thresholdDate: bigint
): Threshold {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    setBy: address,
    thresholdValue,
    thresholdType,
    thresholdDate,
    timestamp: BigInt(Date.now()),
  };
}

