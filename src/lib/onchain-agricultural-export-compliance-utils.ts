import { type Address } from 'viem';

export interface ComplianceRecord {
  id: bigint;
  exporter: Address;
  standard: string;
  status: 'compliant' | 'non-compliant';
  timestamp: bigint;
}

export function createComplianceRecord(
  exporter: Address,
  standard: string,
  status: 'compliant' | 'non-compliant'
): ComplianceRecord {
  return {
    id: BigInt(Date.now()),
    exporter,
    standard,
    status,
    timestamp: BigInt(Date.now()),
  };
}
