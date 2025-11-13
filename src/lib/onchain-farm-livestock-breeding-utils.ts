import { type Address } from 'viem';

/**
 * Onchain farm livestock breeding utilities
 * Livestock breeding record creation and birth recording
 */

export interface LivestockBreedingRecord {
  id: string;
  sireId: string;
  damId: string;
  recordedBy: Address;
  breedingDate: bigint;
  expectedBirthDate: bigint;
  offspringId?: string;
  timestamp: bigint;
}

export function createBreedingRecord(
  address: Address,
  sireId: string,
  damId: string,
  breedingDate: bigint,
  expectedBirthDate: bigint
): LivestockBreedingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    sireId,
    damId,
    recordedBy: address,
    breedingDate,
    expectedBirthDate,
    timestamp: BigInt(Date.now()),
  };
}

