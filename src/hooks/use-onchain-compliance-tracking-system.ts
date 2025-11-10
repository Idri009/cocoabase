import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordCompliance,
  type ComplianceRecord,
} from '@/lib/onchain-compliance-tracking-system-utils';

export function useOnchainComplianceTrackingSystem() {
  const { address } = useAccount();
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  const record = async (
    complianceType: string,
    status: ComplianceRecord['status']
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const record = recordCompliance(address, complianceType, status);
    setRecords([...records, record]);
  };

  return { records, record, address };
}
