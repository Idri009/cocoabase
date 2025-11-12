import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createComplianceRecord,
  getCompliant,
  checkExpiry,
  type ComplianceRecord,
} from '@/lib/onchain-farm-compliance-tracking-utils';

export function useOnchainFarmComplianceTracking() {
  const { address } = useAccount();
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  const record = (
    standard: string,
    status: 'compliant' | 'non-compliant' | 'pending',
    expiryDate: bigint
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const complianceRecord = createComplianceRecord(address, standard, status, expiryDate);
    setRecords((prev) => [...prev, complianceRecord]);
    console.log('Recording compliance:', { standard, status });
  };

  return {
    records,
    record,
    getCompliant,
    checkExpiry,
    address,
  };
}

