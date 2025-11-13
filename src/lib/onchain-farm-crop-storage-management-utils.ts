import { type Address } from 'viem';

/**
 * Onchain farm crop storage management utilities
 * Crop storage recording and retrieval
 */

export interface StorageRecord {
  id: string;
  cropId: string;
  storedBy: Address;
  storageLocation: string;
  quantity: bigint;
  storageDate: bigint;
  conditions: string;
  remainingQuantity: bigint;
  timestamp: bigint;
}

export function createStorageRecord(
  address: Address,
  cropId: string,
  storageLocation: string,
  quantity: bigint,
  storageDate: bigint,
  conditions: string
): StorageRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    cropId,
    storedBy: address,
    storageLocation,
    quantity,
    storageDate,
    conditions,
    remainingQuantity: quantity,
    timestamp: BigInt(Date.now()),
  };
}

