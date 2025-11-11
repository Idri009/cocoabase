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
