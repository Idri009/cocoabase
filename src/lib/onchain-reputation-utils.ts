import { type Address } from 'viem';

/**
 * Onchain reputation system utilities
 * Calculate and track wallet reputation based on onchain activity
 */

export interface ReputationScore {
  address: Address;
  score: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  factors: {
    plantations: number;
    harvests: number;
    carbonOffset: number;
    transactions: number;
  };
}

/**
 * Calculate reputation score from onchain metrics
 */
export function calculateReputationScore(
  factors: ReputationScore['factors']
): number {
  const plantationScore = factors.plantations * 10;
  const harvestScore = factors.harvests * 25;
  const carbonScore = factors.carbonOffset * 0.1;
  const txScore = Math.min(factors.transactions * 2, 100);
  return plantationScore + harvestScore + carbonScore + txScore;
}

