import { type Address } from 'viem';

/**
 * Onchain Harvest Quality Grading utilities
 * Grade harvest quality onchain with Reown wallet integration
 */

export interface QualityGrade {
  id: bigint;
  farmer: Address;
  harvestId: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  criteria: {
    size: number;
    color: number;
    texture: number;
    ripeness: number;
    defects: number;
  };
  overallScore: number;
  gradedAt: bigint;
  grader: string;
}

export function createQualityGrade(
  farmer: Address,
  harvestId: string,
  criteria: QualityGrade['criteria'],
  grader: string
): QualityGrade {
  const now = BigInt(Date.now());
  const overallScore = calculateOverallScore(criteria);
  const grade = determineGrade(overallScore);
  return {
    id: BigInt(0),
    farmer,
    harvestId,
    grade,
    criteria,
    overallScore,
    gradedAt: now,
    grader,
  };
}

export function calculateOverallScore(criteria: QualityGrade['criteria']): number {
  const weights = { size: 0.2, color: 0.2, texture: 0.2, ripeness: 0.3, defects: 0.1 };
  const defectPenalty = criteria.defects * 5;
  return (
    criteria.size * weights.size +
    criteria.color * weights.color +
    criteria.texture * weights.texture +
    criteria.ripeness * weights.ripeness -
    defectPenalty
  );
}

export function determineGrade(score: number): QualityGrade['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B+';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}



