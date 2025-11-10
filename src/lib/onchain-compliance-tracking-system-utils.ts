import { type Address } from 'viem';

export interface ComplianceRecord {
  id: bigint;
  owner: Address;
  complianceType: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  checkDate: bigint;
  txHash: string;
}

export function recordCompliance(
  owner: Address,
  complianceType: string,
  status: ComplianceRecord['status']
): ComplianceRecord {
  return {
    id: BigInt(Date.now()),
    owner,
    complianceType,
    status,
    checkDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getNonCompliantRecords(
  records: ComplianceRecord[]
): ComplianceRecord[] {
  return records.filter((r) => r.status === 'non-compliant');
}

export function getComplianceRate(
  records: ComplianceRecord[]
): number {
  if (records.length === 0) return 0;
  const compliant = records.filter((r) => r.status === 'compliant').length;
  return (compliant / records.length) * 100;
}
