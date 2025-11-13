import { type Address } from 'viem';

/**
 * Onchain farm compost tracking utilities
 * Compost application tracking
 */

export interface CompostRecord {
  id: string;
  plantationId: string;
  recordedBy: Address;
  compostType: string;
  amount: bigint;
  carbonContent: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createCompostRecord(
  address: Address,
  plantationId: string,
  compostType: string,
  amount: bigint,
  carbonContent: bigint
): CompostRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    recordedBy: address,
    compostType,
    amount,
    carbonContent,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

