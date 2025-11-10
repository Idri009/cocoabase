import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordDisease,
  type DiseaseRecord,
} from '@/lib/onchain-crop-disease-monitoring-utils';

export function useOnchainCropDiseaseMonitoring() {
  const { address } = useAccount();
  const [records, setRecords] = useState<DiseaseRecord[]>([]);

  const record = async (
    plantationId: bigint,
    diseaseType: string,
    severity: DiseaseRecord['severity']
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const disease = recordDisease(address, plantationId, diseaseType, severity);
    setRecords([...records, disease]);
  };

  return { records, record, address };
}
