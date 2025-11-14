import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain provenance utilities
 * Provenance record creation on blockchain
 */

export interface ProvenanceRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  origin: string;
  history: string[];
  recordDate: bigint;
  timestamp: bigint;
}

export function createProvenanceRecord(
  address: Address,
  animalId: string,
  origin: string,
  history: string[],
  recordDate: bigint
): ProvenanceRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    origin,
    history,
    recordDate,
    timestamp: BigInt(Date.now()),
  };
}

