import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain migration utilities
 * Migration record creation on blockchain
 */

export interface MigrationRecord {
  id: string;
  harvestId: string;
  migratedBy: Address;
  fromChain: string;
  toChain: string;
  migrationDate: bigint;
  migrationHash: string;
  verified: boolean;
  timestamp: bigint;
}

export function createMigrationRecord(
  address: Address,
  harvestId: string,
  fromChain: string,
  toChain: string,
  migrationDate: bigint,
  migrationHash: string
): MigrationRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    migratedBy: address,
    fromChain,
    toChain,
    migrationDate,
    migrationHash,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}



