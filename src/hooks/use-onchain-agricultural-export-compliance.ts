import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createComplianceRecord,
  type ComplianceRecord,
} from '@/lib/onchain-agricultural-export-compliance-utils';

export function useOnchainAgriculturalExportCompliance() {
  const { address } = useAccount();
  const [records, setRecords] = useState<ComplianceRecord[]>([]);

  const create = async (
    standard: string,
    status: 'compliant' | 'non-compliant'
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const record = createComplianceRecord(address, standard, status);
    setRecords([...records, record]);
  };

  return { records, create, address };
}
