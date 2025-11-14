import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain custody utilities
 * Custody record creation on blockchain
 */

export interface CustodyRecord {
  id: string;
  animalId: string;
  transferredBy: Address;
  fromOwner: Address;
  toOwner: Address;
  transferDate: bigint;
  reason: string;
  verified: boolean;
  timestamp: bigint;
}

export function createCustodyRecord(
  address: Address,
  animalId: string,
  fromOwner: Address,
  toOwner: Address,
  transferDate: bigint,
  reason: string
): CustodyRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    transferredBy: address,
    fromOwner,
    toOwner,
    transferDate,
    reason,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

