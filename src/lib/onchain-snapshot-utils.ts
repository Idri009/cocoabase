import { type Address } from 'viem';

/**
 * Onchain snapshot utilities
 * Token snapshots for airdrops and distributions
 */

export interface Snapshot {
  blockNumber: bigint;
  timestamp: number;
  balances: Map<Address, bigint>;
}

/**
 * Get balance from snapshot
 */
export function getSnapshotBalance(
  snapshot: Snapshot,
  address: Address
): bigint {
  return snapshot.balances.get(address) || BigInt(0);
}

