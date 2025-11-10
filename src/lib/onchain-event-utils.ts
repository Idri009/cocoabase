import { type Address, type Hash } from 'viem';

/**
 * Onchain event listener utilities
 * Subscribe to and parse blockchain events
 */

export interface EventFilter {
  address?: Address;
  topics?: string[];
  fromBlock?: bigint;
  toBlock?: bigint;
}

export interface ParsedEvent {
  name: string;
  args: Record<string, unknown>;
  blockNumber: bigint;
  txHash: Hash;
  logIndex: number;
}

/**
 * Create event filter
 */
export function createEventFilter(
  address?: Address,
  topics?: string[]
): EventFilter {
  return { address, topics };
}

