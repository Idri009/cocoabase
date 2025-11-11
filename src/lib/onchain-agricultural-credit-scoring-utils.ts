import { type Address } from 'viem';

export interface CreditScore {
  id: bigint;
  owner: Address;
  score: number;
  factors: string;
  assessmentDate: bigint;
  status: 'good' | 'fair' | 'poor';
  txHash: string;
}

export function calculateCreditScore(
  owner: Address,
  score: number,
  factors: string
): CreditScore {
  const status: CreditScore['status'] = 
    score >= 700 ? 'good' : score >= 600 ? 'fair' : 'poor';
  
  return {
    id: BigInt(Date.now()),
    owner,
    score,
    factors,
    assessmentDate: BigInt(Date.now()),
    status,
    txHash: '',
  };
}
