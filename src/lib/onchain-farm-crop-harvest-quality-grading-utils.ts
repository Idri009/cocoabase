import { type Address } from 'viem';

/**
 * Onchain farm crop harvest quality grading utilities
 * Quality grade creation on blockchain
 */

export interface QualityGrade {
  id: string;
  harvestId: string;
  gradedBy: Address;
  grade: string;
  gradeCriteria: string[];
  grader: string;
  gradingDate: bigint;
  timestamp: bigint;
}

export function createQualityGrade(
  address: Address,
  harvestId: string,
  grade: string,
  gradeCriteria: string[],
  grader: string,
  gradingDate: bigint
): QualityGrade {
  return {
    id: `${Date.now()}-${Math.random()}`,
    harvestId,
    gradedBy: address,
    grade,
    gradeCriteria,
    grader,
    gradingDate,
    timestamp: BigInt(Date.now()),
  };
}

