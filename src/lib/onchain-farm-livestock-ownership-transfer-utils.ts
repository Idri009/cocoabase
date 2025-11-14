import { type Address } from 'viem';

/**
 * Onchain farm livestock ownership transfer utilities
 * Ownership transfer creation on blockchain
 */

export interface OwnershipTransfer {
  id: string;
  animalId: string;
  transferredBy: Address;
  fromOwner: Address;
  toOwner: Address;
  transferDate: bigint;
  transferReason: string;
  confirmed: boolean;
  timestamp: bigint;
}

export function createOwnershipTransfer(
  address: Address,
  animalId: string,
  fromOwner: Address,
  toOwner: Address,
  transferDate: bigint,
  transferReason: string
): OwnershipTransfer {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    transferredBy: address,
    fromOwner,
    toOwner,
    transferDate,
    transferReason,
    confirmed: false,
    timestamp: BigInt(Date.now()),
  };
}

