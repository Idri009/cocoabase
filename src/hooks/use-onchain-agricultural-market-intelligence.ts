import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  createIntelligence,
  type MarketIntelligence,
} from '@/lib/onchain-agricultural-market-intelligence-utils';

export function useOnchainAgriculturalMarketIntelligence() {
  const { address } = useAccount();
  const [intelligence, setIntelligence] = useState<MarketIntelligence[]>([]);

  const create = async (
    commodity: string,
    price: bigint,
    trend: 'up' | 'down' | 'stable'
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const intel = createIntelligence(address, commodity, price, trend);
    setIntelligence([...intelligence, intel]);
  };

  return { intelligence, create, address };
}
