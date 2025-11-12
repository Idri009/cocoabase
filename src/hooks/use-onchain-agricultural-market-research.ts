import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createMarketResearch,
  getHighDemand,
  getResearchByCommodity,
  type MarketResearch,
} from '@/lib/onchain-agricultural-market-research-utils';

export function useOnchainAgriculturalMarketResearch() {
  const { address } = useAccount();
  const [research, setResearch] = useState<MarketResearch[]>([]);

  const record = (
    commodity: string,
    price: bigint,
    demand: 'low' | 'medium' | 'high'
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const marketResearch = createMarketResearch(address, commodity, price, demand);
    setResearch((prev) => [...prev, marketResearch]);
    console.log('Recording market research:', { commodity, price, demand });
  };

  return {
    research,
    record,
    getHighDemand,
    getResearchByCommodity,
    address,
  };
}

