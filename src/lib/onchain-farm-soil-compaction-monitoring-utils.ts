import { type Address } from 'viem';

/**
 * Onchain farm soil compaction monitoring utilities
 * Compaction reading creation and verification
 */

export interface CompactionReading {
  id: string;
  plantationId: string;
  recordedBy: Address;
  compactionLevel: number;
  depth: number;
  location: string;
  readingDate: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createCompactionReading(
  address: Address,
  plantationId: string,
  compactionLevel: number,
  depth: number,
  location: string,
  readingDate: bigint
): CompactionReading {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    compactionLevel,
    depth,
    location,
    readingDate,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

