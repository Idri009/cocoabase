import { type Address } from 'viem';

export interface ProductivityRecord {
  id: bigint;
  recorder: Address;
  worker: Address;
  task: string;
  output: bigint;
  hours: bigint;
  timestamp: bigint;
}

export function createProductivityRecord(
  recorder: Address,
  worker: Address,
  task: string,
  output: bigint,
  hours: bigint
): ProductivityRecord {
  return {
    id: BigInt(0),
    recorder,
    worker,
    task,
    output,
    hours,
    timestamp: BigInt(Date.now()),
  };
}

export function getRecordsByWorker(
  records: ProductivityRecord[],
  worker: Address
): ProductivityRecord[] {
  return records.filter((r) => r.worker === worker);
}

export function calculateProductivity(
  record: ProductivityRecord
): bigint {
  if (record.hours === BigInt(0)) return BigInt(0);
  return record.output / record.hours;
}

export function getRecentRecords(
  records: ProductivityRecord[],
  days: number
): ProductivityRecord[] {
  const cutoff = BigInt(Date.now()) - BigInt(days * 24 * 60 * 60 * 1000);
  return records.filter((r) => r.timestamp >= cutoff);
}
