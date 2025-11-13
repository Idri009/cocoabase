import { type Address } from 'viem';

/**
 * Onchain farm water conservation tracking utilities
 * Water conservation recording and verification
 */

export interface WaterConservationRecord {
  id: string;
  plantationId: string;
  recordedBy: Address;
  method: string;
  waterSaved: bigint;
  date: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createConservationRecord(
  address: Address,
  plantationId: string,
  method: string,
  waterSaved: bigint,
  date: bigint
): WaterConservationRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    method,
    waterSaved,
    date,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

