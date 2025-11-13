import { type Address } from 'viem';

export interface WasteRecord {
  id: bigint;
  recorder: Address;
  type: string;
  amount: bigint;
  disposalMethod: string;
  timestamp: bigint;
}

export function createWasteRecord(
  recorder: Address,
  type: string,
  amount: bigint,
  disposalMethod: string
): WasteRecord {
  return {
    id: BigInt(Date.now()),
    recorder,
    type,
    amount,
    disposalMethod,
    timestamp: BigInt(Date.now()),
  };
}

export function getTotalWaste(
  records: WasteRecord[]
): bigint {
  return records.reduce((total, r) => total + r.amount, BigInt(0));
}

export function getWasteByType(
  records: WasteRecord[],
  type: string
): WasteRecord[] {
  return records.filter((r) => r.type === type);
}
