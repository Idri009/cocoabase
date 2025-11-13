import { type Address } from 'viem';

export interface Loan {
  id: bigint;
  borrower: Address;
  lender: Address;
  amount: bigint;
  interestRate: number;
  status: 'active' | 'repaid' | 'defaulted';
  timestamp: bigint;
}

export function createLoan(
  borrower: Address,
  lender: Address,
  amount: bigint,
  interestRate: number
): Loan {
  return {
    id: BigInt(Date.now()),
    borrower,
    lender,
    amount,
    interestRate,
    status: 'active',
    timestamp: BigInt(Date.now()),
  };
}
