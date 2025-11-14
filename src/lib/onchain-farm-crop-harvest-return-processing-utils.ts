import { type Address } from 'viem';

/**
 * Onchain farm crop harvest return processing utilities
 * Return record creation on blockchain
 */

export interface ReturnRecord {
  id: string;
  harvestId: string;
  processedBy: Address;
  returnReason: string;
  returnQuantity: bigint;
  returnDate: bigint;
  returnedBy: Address;
  approved: boolean;
  timestamp: bigint;
}

export function createReturnRecord(
  address: Address,
  harvestId: string,
  returnReason: string,
  returnQuantity: bigint,
  returnDate: bigint,
  returnedBy: Address
): ReturnRecord {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    processedBy: address,
    returnReason,
    returnQuantity,
    returnDate,
    returnedBy,
    approved: false,
    timestamp: BigInt(Date.now()),
  };
}

