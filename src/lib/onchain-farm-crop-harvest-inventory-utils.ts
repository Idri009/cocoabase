import { type Address } from 'viem';

/**
 * Onchain farm crop harvest inventory utilities
 * Inventory record creation on blockchain
 */

export interface InventoryRecord {
  id: string;
  harvestId: string;
  recordedBy: Address;
  quantity: bigint;
  location: string;
  recordDate: bigint;
  status: string;
  timestamp: bigint;
}

export function createInventoryRecord(
  address: Address,
  harvestId: string,
  quantity: bigint,
  location: string,
  recordDate: bigint,
  status: string
): InventoryRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    recordedBy: address,
    quantity,
    location,
    recordDate,
    status,
    timestamp: BigInt(Date.now()),
  };
}

