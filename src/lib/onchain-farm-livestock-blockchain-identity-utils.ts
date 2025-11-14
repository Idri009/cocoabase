import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain identity utilities
 * Blockchain identity creation
 */

export interface BlockchainIdentity {
  id: string;
  animalId: string;
  createdBy: Address;
  identityHash: string;
  metadata: string;
  registrationDate: bigint;
  timestamp: bigint;
}

export function createBlockchainIdentity(
  address: Address,
  animalId: string,
  identityHash: string,
  metadata: string,
  registrationDate: bigint
): BlockchainIdentity {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    createdBy: address,
    identityHash,
    metadata,
    registrationDate,
    timestamp: BigInt(Date.now()),
  };
}

