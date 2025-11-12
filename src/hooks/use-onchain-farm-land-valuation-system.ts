import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createValuation,
  getValuationsByLand,
  getRecentValuations,
  calculateAverageValuation,
  type LandValuation,
} from '@/lib/onchain-farm-land-valuation-system-utils';

export function useOnchainFarmLandValuationSystem() {
  const { address } = useAccount();
  const [valuations, setValuations] = useState<LandValuation[]>([]);
  const [isValuing, setIsValuing] = useState(false);

  const value = async (
    landId: bigint,
    value: bigint,
    factors: string[]
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    setIsValuing(true);
    try {
      const valuation = createValuation(landId, address, value, factors);
      setValuations((prev) => [...prev, valuation]);
      console.log('Creating valuation:', valuation);
    } finally {
      setIsValuing(false);
    }
  };

  return {
    valuations,
    value,
    getValuationsByLand,
    getRecentValuations,
    calculateAverageValuation,
    isValuing,
    address,
  };
}
