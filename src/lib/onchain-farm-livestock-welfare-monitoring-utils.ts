import { type Address } from 'viem';

/**
 * Onchain farm livestock welfare monitoring utilities
 * Welfare assessment creation on blockchain
 */

export interface WelfareAssessment {
  id: string;
  animalId: string;
  assessedBy: Address;
  welfareScore: number;
  assessmentCriteria: string[];
  assessmentDate: bigint;
  assessor: string;
  timestamp: bigint;
}

export function createWelfareAssessment(
  address: Address,
  animalId: string,
  welfareScore: number,
  assessmentCriteria: string[],
  assessmentDate: bigint,
  assessor: string
): WelfareAssessment {
  return {
    id: `${Date.now()}-${Math.random()}`,
    animalId,
    assessedBy: address,
    welfareScore,
    assessmentCriteria,
    assessmentDate,
    assessor,
    timestamp: BigInt(Date.now()),
  };
}

