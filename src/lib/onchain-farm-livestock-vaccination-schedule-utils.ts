import { type Address } from 'viem';

/**
 * Onchain farm livestock vaccination schedule utilities
 * Vaccination schedule creation on blockchain
 */

export interface VaccinationSchedule {
  id: string;
  animalId: string;
  scheduledBy: Address;
  vaccineType: string;
  scheduledDate: bigint;
  veterinarian: string;
  completed: boolean;
  timestamp: bigint;
}

export function createVaccinationSchedule(
  address: Address,
  animalId: string,
  vaccineType: string,
  scheduledDate: bigint,
  veterinarian: string
): VaccinationSchedule {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    scheduledBy: address,
    vaccineType,
    scheduledDate,
    veterinarian,
    completed: false,
    timestamp: BigInt(Date.now()),
  };
}

