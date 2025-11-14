import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain immutability utilities
 * Immutability record creation on blockchain
 */

export interface ImmutabilityRecord {
  id: string;
  harvestId: string;
  createdBy: Address;
  dataHash: string;
  recordDate: bigint;
  immutable: boolean;
  verified: boolean;
  timestamp: bigint;
}

export function createImmutabilityRecord(
  address: Address,
  harvestId: string,
  dataHash: string,
  recordDate: bigint,
  immutable: boolean
): ImmutabilityRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    dataHash,
    recordDate,
    immutable,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

