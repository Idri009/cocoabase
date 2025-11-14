import { type Address } from 'viem';

/**
 * Onchain farm livestock blockchain whitelist utilities
 * Whitelist entry creation on blockchain
 */

export interface WhitelistEntry {
  id: string;
  animalId: string;
  createdBy: Address;
  whitelistedAddress: Address;
  whitelistDate: bigint;
  reason: string;
  removed: boolean;
  timestamp: bigint;
}

export function createWhitelistEntry(
  address: Address,
  animalId: string,
  whitelistedAddress: Address,
  whitelistDate: bigint,
  reason: string
): WhitelistEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    createdBy: address,
    whitelistedAddress,
    whitelistDate,
    reason,
    removed: false,
    timestamp: BigInt(Date.now()),
  };
}

