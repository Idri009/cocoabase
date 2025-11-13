import { type Address } from 'viem';

/**
 * Onchain farm livestock grazing utilities
 * Grazing record creation and verification
 */

export interface GrazingRecord {
  id: string;
  animalId: string;
  recordedBy: Address;
  pastureId: string;
  grazingDate: bigint;
  duration: number;
  verified: boolean;
  timestamp: bigint;
}

export function createGrazingRecord(
  address: Address,
  animalId: string,
  pastureId: string,
  grazingDate: bigint,
  duration: number
): GrazingRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    recordedBy: address,
    pastureId,
    grazingDate,
    duration,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

