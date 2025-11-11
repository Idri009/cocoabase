import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  calculateCreditScore,
  type CreditScore,
} from '@/lib/onchain-agricultural-credit-scoring-utils';

export function useOnchainAgriculturalCreditScoring() {
  const { address } = useAccount();
  const [scores, setScores] = useState<CreditScore[]>([]);

  const calculate = async (
    score: number,
    factors: string
  ): Promise<void> => {
    if (!address) throw new Error('Wallet not connected');
    const credit = calculateCreditScore(address, score, factors);
    setScores([...scores, credit]);
  };

  return { scores, calculate, address };
}
