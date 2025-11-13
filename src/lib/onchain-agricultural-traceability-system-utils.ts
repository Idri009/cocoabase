import { type Address } from 'viem';

export interface TraceabilityRecord {
  id: bigint;
  creator: Address;
  productId: bigint;
  location: string;
  timestamp: bigint;
}

export function createTraceabilityRecord(
  creator: Address,
  productId: bigint,
  location: string
): TraceabilityRecord {
  return {
    id: BigInt(Date.now()),
    creator,
    productId,
    location,
    timestamp: BigInt(Date.now()),
  };
}