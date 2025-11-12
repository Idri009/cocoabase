import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { Address } from 'viem';
import {
  createSustainabilityScore,
  getScoresByCategory,
  calculateAverageScore,
  getHighScores,
  type SustainabilityScore,
} from '@/lib/onchain-farm-sustainability-scoring-utils';

export function useOnchainFarmSustainabilityScoring() {
  const { address } = useAccount();
  const [scores, setScores] = useState<SustainabilityScore[]>([]);

  const record = (
    category: 'environmental' | 'social' | 'economic' | 'overall',
    score: number
  ) => {
    if (!address) throw new Error('Wallet not connected via Reown');
    const sustainabilityScore = createSustainabilityScore(address, category, score);
    setScores((prev) => [...prev, sustainabilityScore]);
    console.log('Recording sustainability score:', { category, score });
  };

  return {
    scores,
    record,
    getScoresByCategory,
    calculateAverageScore,
    getHighScores,
    address,
  };
}
