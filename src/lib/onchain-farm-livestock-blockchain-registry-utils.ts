import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain registry utilities
 * Registry entry creation on blockchain
 */

export interface RegistryEntry {
  id: string;
  animalId: string;
  registeredBy: Address;
  registrationType: string;
  registrationData: string;
  registrationDate: bigint;
  timestamp: bigint;
}

export function createRegistryEntry(
  address: Address,
  animalId: string,
  registrationType: string,
  registrationData: string,
  registrationDate: bigint
): RegistryEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    registeredBy: address,
    registrationType,
    registrationData,
    registrationDate,
    timestamp: BigInt(Date.now()),
  };
}

