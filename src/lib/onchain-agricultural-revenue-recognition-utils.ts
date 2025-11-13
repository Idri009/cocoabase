import { type Address } from 'viem';

export interface RevenueRecord {
  id: bigint;
  recorder: Address;
  source: string;
  amount: bigint;
  recognitionDate: bigint;
  status: 'pending' | 'recognized';
}

export function createRevenueRecord(
  recorder: Address,
  source: string,
  amount: bigint,
  recognitionDate: bigint
): RevenueRecord {
  return {
    id: BigInt(0),
    recorder,
    source,
    amount,
    recognitionDate,
    status: 'pending',
  };
}

export function recognizeRevenue(record: RevenueRecord): RevenueRecord {
  return {
    ...record,
    status: 'recognized',
  };
}

export function getPendingRevenue(records: RevenueRecord[]): RevenueRecord[] {
  return records.filter((r) => r.status === 'pending');
}

export function calculateTotalRevenue(records: RevenueRecord[]): bigint {
  return records.reduce((total, r) => total + r.amount, BigInt(0));
}
