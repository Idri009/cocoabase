import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createTrendAnalysis,
  type TrendAnalysis,
} from '@/lib/onchain-agricultural-market-trend-analysis-utils';

export function useOnchainAgriculturalMarketTrendAnalysis() {
  const { address } = useAccount();
  const [analyses, setAnalyses] = useState<TrendAnalysis[]>([]);

  const create = async (
    commodity: string,
    trend: 'bullish' | 'bearish' | 'neutral',
    confidence: number
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const analysis = createTrendAnalysis(address, commodity, trend, confidence);
    setAnalyses([...analyses, analysis]);
  };

  return { analyses, create, address };
}
