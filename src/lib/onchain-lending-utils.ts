import { type Address } from 'viem';

export interface Loan {
  id: bigint;
  borrower: Address;
  lender: Address;
  principal: bigint;
  interestRate: bigint;
  duration: bigint;
  collateral: bigint;
  status: 'active' | 'repaid' | 'defaulted';
  createdAt: bigint;
  dueDate: bigint;
}

