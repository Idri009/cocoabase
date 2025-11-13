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

export function getRecordsByProduct(
  records: TraceabilityRecord[],
  productId: bigint
): TraceabilityRecord[] {
  return records.filter((r) => r.productId === productId);
}

export function getRecordsByLocation(
  records: TraceabilityRecord[],
  location: string
): TraceabilityRecord[] {
  return records.filter((r) => r.location === location);
}