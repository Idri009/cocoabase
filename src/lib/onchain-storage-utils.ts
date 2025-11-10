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

/**
 * Pack multiple values into storage slot
 */
export function packStorageSlot(values: bigint[]): bigint {
  return values.reduce((acc, val, idx) => {
    return acc | (val << BigInt(idx * 64));
  }, BigInt(0));
}

/**
 * Unpack storage slot into values
 */
export function unpackStorageSlot(
  slot: bigint,
  count: number
): bigint[] {
  return Array.from({ length: count }, (_, idx) => {
    return (slot >> BigInt(idx * 64)) & BigInt('0xFFFFFFFFFFFFFFFF');
  });
}

