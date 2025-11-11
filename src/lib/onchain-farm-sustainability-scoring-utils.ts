import { type Address } from 'viem';

export interface SustainabilityScore {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  score: number;
  category: 'environmental' | 'social' | 'economic' | 'overall';
  assessmentDate: bigint;
  txHash: string;
}

export function recordSustainabilityScore(
  owner: Address,
  plantationId: bigint,
  score: number,
  category: SustainabilityScore['category']
): SustainabilityScore {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    score,
    category,
    assessmentDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getScoresByCategory(
  scores: SustainabilityScore[],
  category: SustainabilityScore['category']
): SustainabilityScore[] {
  return scores.filter((s) => s.category === category);
}

export function calculateAverageScore(
  scores: SustainabilityScore[]
): number {
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return total / scores.length;
}

export function getHighSustainabilityScores(
  scores: SustainabilityScore[],
  minScore: number
): SustainabilityScore[] {
  return scores.filter((s) => s.score >= minScore);
}
