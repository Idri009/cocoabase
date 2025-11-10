import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import type { Address } from 'viem';
import {
  createPredictionMarket,
  type PredictionMarket,
} from '@/lib/onchain-prediction-utils';

export function useOnchainPrediction() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);

  const placePrediction = async (
    marketId: bigint,
    outcome: 'yes' | 'no',
    amount: bigint
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected via Reown');
    await writeContract({
      address: '0x0000000000000000000000000000000000000000' as Address,
      abi: [],
      functionName: 'placePrediction',
      args: [marketId, outcome, amount],
    });
  };

  return { markets, placePrediction, address };
}
