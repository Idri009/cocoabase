import { type Address } from 'viem';

/**
 * Onchain farm grain storage utilities
 * Grain storage management and tracking
 */

export interface StorageRecord {
  id: string;
  storageId: bigint;
  grainType: string;
  quantity: bigint;
  storageDate: bigint;
  expiryDate: bigint;
  storageLocation: string;
  temperature: bigint;
  humidity: bigint;
  owner: Address;
  isActive: boolean;
  lastInspection: bigint;
}

export function createStorageRecord(
  address: Address,
  grainType: string,
  quantity: bigint,
  expiryDate: bigint,
  storageLocation: string,
  temperature: bigint,
  humidity: bigint
): StorageRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    storageId: BigInt(0),
    grainType,
    quantity,
    storageDate: BigInt(Date.now()),
    expiryDate,
    storageLocation,
    temperature,
    humidity,
    owner: address,
    isActive: true,
    lastInspection: BigInt(Date.now()),
  };
}

