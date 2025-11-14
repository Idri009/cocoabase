import { type Address } from 'viem';

/**
 * Onchain farm livestock vaccination records utilities
 * Vaccination record creation on blockchain
 */

export interface VaccinationRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  vaccineType: string;
  batchNumber: string;
  vaccinationDate: bigint;
  veterinarian: string;
  verified: boolean;
  timestamp: bigint;
}

export function createVaccinationRecord(
  address: Address,
  animalId: string,
  vaccineType: string,
  batchNumber: string,
  vaccinationDate: bigint,
  veterinarian: string
): VaccinationRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    vaccineType,
    batchNumber,
    vaccinationDate,
    veterinarian,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

