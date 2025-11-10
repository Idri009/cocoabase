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

/**
 * Get reputation level from score
 */
export function getReputationLevel(score: number): ReputationScore['level'] {
  if (score >= 1000) return 'platinum';
  if (score >= 500) return 'gold';
  if (score >= 200) return 'silver';
  return 'bronze';
}

/**
 * Calculate reputation boost from achievements
 */
export function calculateReputationBoost(achievements: number): number {
  return Math.min(achievements * 5, 50);
}

