import { type Address } from 'viem';

export interface ComplianceReport {
  id: bigint;
  reporter: Address;
  reportType: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: bigint;
}

export function createComplianceReport(
  reporter: Address,
  reportType: string
): ComplianceReport {
  return {
    id: BigInt(Date.now()),
    reporter,
    reportType,
    status: 'pending',
    timestamp: BigInt(Date.now()),
  };
}
