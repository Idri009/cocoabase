import { type Address } from 'viem';

/**
 * Onchain farm livestock weight tracking utilities
 * Weight record creation and verification
 */

export interface WeightRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  weight: bigint;
  measurementDate: bigint;
  measurementMethod: string;
  verified: boolean;
  timestamp: bigint;
}

export function createWeightRecord(
  address: Address,
  animalId: string,
  weight: bigint,
  measurementDate: bigint,
  measurementMethod: string
): WeightRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    weight,
    measurementDate,
    measurementMethod,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

