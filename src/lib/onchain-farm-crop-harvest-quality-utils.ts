import { type Address } from 'viem';

export interface QualityGrade {
  id: string;
  gradeId: bigint;
  harvestId: bigint;
  grade: string;
  score: bigint;
  grader: Address;
  gradeDate: bigint;
  verified: boolean;
}

export function createQualityGrade(
  address: Address,
  harvestId: bigint,
  grade: string,
  score: bigint
): QualityGrade {
  return {
    id: `${Date.now()}-${Math.random()}`,
    gradeId: BigInt(0),
    harvestId,
    grade,
    score,
    grader: address,
    gradeDate: BigInt(Date.now()),
    verified: false,
  };
}

