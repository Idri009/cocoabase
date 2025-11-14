import { type Address } from 'viem';

/**
 * Onchain farm livestock genetic tracking utilities
 * Genetic record creation and verification
 */

export interface LivestockGeneticRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  geneticMarker: string;
  trait: string;
  recordDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createGeneticRecord(
  address: Address,
  animalId: string,
  geneticMarker: string,
  trait: string,
  recordDate: bigint
): LivestockGeneticRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    geneticMarker,
    trait,
    recordDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

