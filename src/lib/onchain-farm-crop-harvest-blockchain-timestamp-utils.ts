import { type Address } from 'viem';

/**
 * Onchain farm crop harvest blockchain timestamp utilities
 * Timestamp record creation on blockchain
 */

export interface TimestampRecord {
  id: string;
  harvestId: string;
  createdBy: Address;
  eventType: string;
  eventData: string;
  timestamp: bigint;
  verified: boolean;
  createdAt: bigint;
}

export function createTimestampRecord(
  address: Address,
  harvestId: string,
  eventType: string,
  eventData: string,
  timestamp: bigint
): TimestampRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    createdBy: address,
    eventType,
    eventData,
    timestamp,
    verified: false,
    createdAt: BigInt(Date.now()),
  };
}

