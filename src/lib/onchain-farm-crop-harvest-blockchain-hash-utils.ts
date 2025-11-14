import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain hash utilities
 * Hash record creation on blockchain
 */

export interface HashRecord {
  id: string;
  harvestId: string;
  createdBy: Address;
  dataHash: string;
  hashAlgorithm: string;
  hashDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createHashRecord(
  address: Address,
  harvestId: string,
  dataHash: string,
  hashAlgorithm: string,
  hashDate: bigint
): HashRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    dataHash,
    hashAlgorithm,
    hashDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

