import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  calculateCreditScore,
  getGoodCredit,
  getRecentScores,
  calculateAverageScore,
  type CreditScore,
} from '@/lib/onchain-agricultural-credit-scoring-utils';

export function useOnchainAgriculturalCreditScoring() {
  const { address } = useAccount();
  const [scores, setScores] = useState<CreditScore[]>([]);

  const calculate = (score: number, factors: string[]) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const creditScore = calculateCreditScore(address, score, factors);
    setScores((prev) => [...prev, creditScore]);
    console.log('Calculating credit score:', { score, factors });
  };

  return {
    scores,
    calculate,
    getGoodCredit,
    getRecentScores,
    calculateAverageScore,
    address,
  };
}
