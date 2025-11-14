import { type Address } from 'viem';

/**
 * Onchain farm livestock breeding program utilities
 * Breeding program creation on blockchain
 */

export interface BreedingProgram {
  id: string;
  programName: string;
  createdBy: Address;
  sireId: string;
  damId: string;
  startDate: bigint;
  objectives: string[];
  timestamp: bigint;
}

export function createBreedingProgram(
  address: Address,
  programName: string,
  sireId: string,
  damId: string,
  startDate: bigint,
  objectives: string[]
): BreedingProgram {
  return {
    id: `${Date.now()}-${Math.random()}`,
    programName,
    createdBy: address,
    sireId,
    damId,
    startDate,
    objectives,
    timestamp: BigInt(Date.now()),
  };
}

