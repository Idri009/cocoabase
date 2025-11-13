import { type Address } from 'viem';

/**
 * Onchain farm livestock tracking utilities
 * Livestock record management
 */

export interface LivestockRecord {
  id: string;
  animalId: string;
  owner: Address;
  species: string;
  birthDate: bigint;
  healthStatus: string;
  timestamp: bigint;
}

export function createLivestockRecord(
  address: Address,
  animalId: string,
  species: string,
  birthDate: bigint,
  healthStatus: string
): LivestockRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    owner: address,
    species,
    birthDate,
    healthStatus,
    timestamp: BigInt(Date.now()),
  };
}

