import { type Address } from 'viem';

/**
 * Onchain farm crop seedling management utilities
 * Seedling record creation and count updates
 */

export interface SeedlingRecord {
  id: string;
  plantationId: string;
  recordedBy: Address;
  seedlingCount: number;
  plantingDate: bigint;
  seedSource: string;
  timestamp: bigint;
}

export function createSeedlingRecord(
  address: Address,
  plantationId: string,
  seedlingCount: number,
  plantingDate: bigint,
  seedSource: string
): SeedlingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    seedlingCount,
    plantingDate,
    seedSource,
    timestamp: BigInt(Date.now()),
  };
}

