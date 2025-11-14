import { type Address } from 'viem';

/**
 * Onchain farm livestock pedigree tracking utilities
 * Pedigree record creation on blockchain
 */

export interface PedigreeRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  sireId: string;
  damId: string;
  generation: number;
  lineage: string[];
  timestamp: bigint;
}

export function createPedigreeRecord(
  address: Address,
  animalId: string,
  sireId: string,
  damId: string,
  generation: number,
  lineage: string[]
): PedigreeRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    sireId,
    damId,
    generation,
    lineage,
    timestamp: BigInt(Date.now()),
  };
}

