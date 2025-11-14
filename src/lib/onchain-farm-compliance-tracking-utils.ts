import { type Address } from 'viem';

export interface ComplianceRecord {
  id: bigint;
  recorder: Address;
  standard: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  expiryDate: bigint;
}

export function createComplianceRecord(
  recorder: Address,
  standard: string,
  status: 'compliant' | 'non-compliant' | 'pending',
  expiryDate: bigint
): ComplianceRecord {
  return {
    id: BigInt(0),
    recorder,
    standard,
    status,
    expiryDate,
  };
}

export function getCompliant(records: ComplianceRecord[]): ComplianceRecord[] {
  return records.filter((r) => r.status === 'compliant');
}

export function checkExpiry(record: ComplianceRecord, currentTime: bigint): boolean {
  return currentTime >= record.expiryDate;
}


