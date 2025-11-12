import { type Address } from 'viem';

export interface CreditScore {
  id: bigint;
  borrower: Address;
  score: number;
  factors: string[];
  timestamp: bigint;
}

export function calculateCreditScore(
  borrower: Address,
  score: number,
  factors: string[]
): CreditScore {
  return {
    id: BigInt(0),
    borrower,
    score,
    factors,
    timestamp: BigInt(Date.now()),
  };
}
