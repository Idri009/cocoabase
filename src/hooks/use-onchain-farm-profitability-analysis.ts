import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createProfitabilityAnalysis,
  type ProfitabilityAnalysis,
} from '@/lib/onchain-farm-profitability-analysis-utils';

export function useOnchainFarmProfitabilityAnalysis() {
  const { address } = useAccount();
  const [analyses, setAnalyses] = useState<ProfitabilityAnalysis[]>([]);

  const create = async (
    period: string,
    revenue: bigint,
    costs: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const analysis = createProfitabilityAnalysis(address, period, revenue, costs);
    setAnalyses([...analyses, analysis]);
  };

  return { analyses, create, address };
}
