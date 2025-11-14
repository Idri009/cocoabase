import { type Address } from 'viem';

/**
 * Onchain farm livestock reproduction tracking utilities
 * Reproduction tracking creation on blockchain
 */

export interface ReproductionTracking {
  id: string;
  animalId: string;
  trackedBy: Address;
  matingDate: bigint;
  expectedCalvingDate: bigint;
  actualCalvingDate?: bigint;
  sireId: string;
  damId: string;
  breedingMethod: string;
  timestamp: bigint;
}

export function createReproductionTracking(
  address: Address,
  animalId: string,
  matingDate: bigint,
  expectedCalvingDate: bigint,
  sireId: string,
  damId: string,
  breedingMethod: string
): ReproductionTracking {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    trackedBy: address,
    matingDate,
    expectedCalvingDate,
    sireId,
    damId,
    breedingMethod,
    timestamp: BigInt(Date.now()),
  };
}

