import { type Address } from 'viem';

export interface WasteRecord {
  id: bigint;
  recorder: Address;
  wasteType: string;
  amount: bigint;
  recycled: boolean;
  timestamp: bigint;
}

export function createWasteRecord(
  recorder: Address,
  wasteType: string,
  amount: bigint,
  recycled: boolean
): WasteRecord {
  return {
    id: BigInt(0),
    recorder,
    wasteType,
    amount,
    recycled,
    timestamp: BigInt(Date.now()),
  };
}

export function getRecycledWaste(records: WasteRecord[]): WasteRecord[] {
  return records.filter((r) => r.recycled);
}

export function calculateTotalWaste(records: WasteRecord[]): bigint {
  return records.reduce((total, r) => total + r.amount, BigInt(0));
}

export function calculateRecyclingRate(records: WasteRecord[]): number {
  if (records.length === 0) return 0;
  const recycled = records.filter((r) => r.recycled).length;
  return (recycled / records.length) * 100;
}
