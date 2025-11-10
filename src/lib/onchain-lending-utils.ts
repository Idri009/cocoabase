import { type Address } from 'viem';

/**
 * Onchain lending utilities
 * DeFi lending protocol for agricultural loans
 */

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

export function createLoan(
  borrower: Address,
  lender: Address,
  principal: bigint,
  interestRate: bigint,
  duration: bigint,
  collateral: bigint
): Loan {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    borrower,
    lender,
    principal,
    interestRate,
    duration,
    collateral,
    status: 'active',
    createdAt: now,
    dueDate: now + duration,
  };
}

export function calculateInterest(
  principal: bigint,
  interestRate: bigint,
  duration: bigint
): bigint {
  return (principal * interestRate * duration) / (BigInt(365) * BigInt(10000));
}

export function repayLoan(loan: Loan, currentTime: bigint): Loan | null {
  if (loan.status !== 'active') return null;
  return {
    ...loan,
    status: 'repaid',
  };
}

export function isLoanDefaulted(loan: Loan, currentTime: bigint): boolean {
  return loan.status === 'active' && currentTime > loan.dueDate;
}

export function calculateTotalRepayment(loan: Loan): bigint {
  const interest = calculateInterest(loan.principal, loan.interestRate, loan.duration);
  return loan.principal + interest;
}

