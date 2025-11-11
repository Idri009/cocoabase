import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  recordProductionMetric,
  type ProductionAnalytics,
} from '@/lib/onchain-farm-production-analytics-utils';

export function useOnchainFarmProductionAnalytics() {
  const { address } = useAccount();
  const [analytics, setAnalytics] = useState<ProductionAnalytics[]>([]);

  const record = async (
    plantationId: bigint,
    metric: string,
    value: bigint,
    period: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const metricRecord = recordProductionMetric(address, plantationId, metric, value, period);
    setAnalytics([...analytics, metricRecord]);
  };

  return { analytics, record, address };
}
