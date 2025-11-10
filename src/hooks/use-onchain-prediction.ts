import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createPredictionMarket,
  type PredictionMarket,
} from '@/lib/onchain-prediction-utils';

export function useOnchainPrediction() {
  const { address } = useAccount();
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);

  const placePrediction = async (
    marketId: bigint,
    outcome: 'yes' | 'no',
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    console.log('Placing prediction:', { marketId, outcome, amount });
  };

  return { markets, placePrediction, address };
}

