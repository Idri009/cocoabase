import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createAnalyticsData,
  type AnalyticsData,
} from '@/lib/onchain-agricultural-data-analytics-utils';

export function useOnchainAgriculturalDataAnalytics() {
  const { address } = useAccount();
  const [data, setData] = useState<AnalyticsData[]>([]);

  const create = async (
    metric: string,
    value: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const analyticsData = createAnalyticsData(address, metric, value);
    setData([...data, analyticsData]);
  };

  return { data, create, address };
}