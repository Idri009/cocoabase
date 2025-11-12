import { type Address } from 'viem';

export interface CarbonRecord {
  id: bigint;
  recorder: Address;
  activity: string;
  emissions: bigint;
  offset: bigint;
  timestamp: bigint;
}

export function createCarbonRecord(
  recorder: Address,
  activity: string,
  emissions: bigint,
  offset: bigint
): CarbonRecord {
  return {
    id: BigInt(0),
    recorder,
    activity,
    emissions,
    offset,
    timestamp: BigInt(Date.now()),
  };
}

export function calculateNetEmissions(record: CarbonRecord): bigint {
  return record.emissions > record.offset
    ? record.emissions - record.offset
    : BigInt(0);
}

export function calculateTotalEmissions(records: CarbonRecord[]): bigint {
  return records.reduce((total, r) => total + r.emissions, BigInt(0));
}

export function calculateTotalOffset(records: CarbonRecord[]): bigint {
  return records.reduce((total, r) => total + r.offset, BigInt(0));
}
