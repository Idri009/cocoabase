import { type Address } from 'viem';

export interface SoilHealthRecord {
  id: bigint;
  recorder: Address;
  ph: number;
  nutrients: string[];
  organicMatter: number;
  timestamp: bigint;
}

export function createSoilHealthRecord(
  recorder: Address,
  ph: number,
  nutrients: string[],
  organicMatter: number
): SoilHealthRecord {
  return {
    id: BigInt(0),
    recorder,
    ph,
    nutrients,
    organicMatter,
    timestamp: BigInt(Date.now()),
  };
}

export function getHealthySoil(records: SoilHealthRecord[]): SoilHealthRecord[] {
  return records.filter((r) => r.ph >= 6.0 && r.ph <= 7.5 && r.organicMatter >= 3.0);
}

export function calculateAveragePh(records: SoilHealthRecord[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.ph, 0);
  return total / records.length;
}

