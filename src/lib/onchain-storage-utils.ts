import { type Address, type Hash } from 'viem';

/**
 * Onchain storage utilities
 * Store and retrieve data onchain efficiently
 */

export interface StorageSlot {
  contract: Address;
  slot: bigint;
  value: Hash;
}

export interface StorageProof {
  slot: bigint;
  proof: string[];
  value: Hash;
}

/**
 * Calculate storage slot for mapping
 */
export function calculateStorageSlot(
  key: string,
  position: number = 0
): bigint {
  const hash = key.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);
  return BigInt(Math.abs(hash)) + BigInt(position);
}

