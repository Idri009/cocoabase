import { type Address } from 'viem';

export interface ComplianceReport {
  id: string;
  reportId: bigint;
  reporter: Address;
  reportType: string;
  data: string;
  submissionDate: bigint;
  verified: boolean;
  verifier?: Address;
}

export function createComplianceReport(
  reporter: Address,
  reportId: bigint,
  reportType: string,
  data: string
): ComplianceReport {
  return {
    id: `${Date.now()}-${Math.random()}`,
    reportId,
    reporter,
    reportType,
    data,
    submissionDate: BigInt(Date.now()),
    verified: false,
  };
}
