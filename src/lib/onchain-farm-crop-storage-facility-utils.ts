import { type Address } from 'viem';

/**
 * Onchain farm crop storage facility utilities
 * Storage facility creation and capacity management
 */

export interface StorageFacility {
  id: string;
  facilityName: string;
  owner: Address;
  capacity: bigint;
  location: string;
  storageType: string;
  currentUsage: bigint;
  timestamp: bigint;
}

export function createStorageFacility(
  address: Address,
  facilityName: string,
  capacity: bigint,
  location: string,
  storageType: string
): StorageFacility {
  return {
    id: `${Date.now()}-${Math.random()}`,
    facilityName,
    owner: address,
    capacity,
    location,
    storageType,
    currentUsage: BigInt(0),
    timestamp: BigInt(Date.now()),
  };
}

