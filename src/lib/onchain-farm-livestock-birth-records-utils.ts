import { type Address } from 'viem';

/**
 * Onchain farm livestock birth records utilities
 * Birth record creation on blockchain
 */

export interface BirthRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  sireId: string;
  damId: string;
  birthDate: bigint;
  birthWeight: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createBirthRecord(
  address: Address,
  animalId: string,
  sireId: string,
  damId: string,
  birthDate: bigint,
  birthWeight: bigint
): BirthRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    sireId,
    damId,
    birthDate,
    birthWeight,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

