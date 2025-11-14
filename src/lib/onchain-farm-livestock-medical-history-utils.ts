import { type Address } from 'viem';

/**
 * Onchain farm livestock medical history utilities
 * Medical history creation on blockchain
 */

export interface MedicalHistory {
  id: string;
  animalId: string;
  recordedBy: Address;
  condition: string;
  treatment: string;
  veterinarian: string;
  recordDate: bigint;
  timestamp: bigint;
}

export function createMedicalHistory(
  address: Address,
  animalId: string,
  condition: string,
  treatment: string,
  veterinarian: string,
  recordDate: bigint
): MedicalHistory {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    condition,
    treatment,
    veterinarian,
    recordDate,
    timestamp: BigInt(Date.now()),
  };
}

