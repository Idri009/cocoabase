import { type Address } from 'viem';

/**
 * Onchain Farm-to-Table Traceability utilities
 * Track products from farm to consumer with immutable records
 */

export interface TraceabilityRecord {
  id: bigint;
  productId: string;
  stage: 'planting' | 'harvest' | 'processing' | 'packaging' | 'transport' | 'retail';
  location: string;
  timestamp: bigint;
  handler: Address;
  metadata: string;
  previousStage?: bigint;
}

export function createTraceabilityRecord(
  productId: string,
  stage: TraceabilityRecord['stage'],
  location: string,
  handler: Address,
  metadata: string,
  previousStage?: bigint
): TraceabilityRecord {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    productId,
    stage,
    location,
    timestamp: now,
    handler,
    metadata,
    previousStage,
  };
}

export function advanceTraceabilityStage(
  record: TraceabilityRecord,
  newStage: TraceabilityRecord['stage'],
  location: string,
  handler: Address,
  metadata: string
): TraceabilityRecord {
  return createTraceabilityRecord(
    record.productId,
    newStage,
    location,
    handler,
    metadata,
    record.id
  );
}

export function getTraceabilityChain(
  records: TraceabilityRecord[],
  productId: string
): TraceabilityRecord[] {
  return records
    .filter((r) => r.productId === productId)
    .sort((a, b) => Number(a.timestamp - b.timestamp));
}

export function verifyTraceabilityChain(records: TraceabilityRecord[]): boolean {
  if (records.length === 0) return false;
  for (let i = 1; i < records.length; i++) {
    if (records[i].previousStage !== records[i - 1].id) {
      return false;
    }
  }
  return true;
}

export function calculateTraceabilityScore(records: TraceabilityRecord[]): number {
  const stages = ['planting', 'harvest', 'processing', 'packaging', 'transport', 'retail'];
  const completedStages = new Set(records.map((r) => r.stage));
  return (completedStages.size / stages.length) * 100;
}

