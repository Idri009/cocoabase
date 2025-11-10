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
