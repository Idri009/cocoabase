import { type Address } from 'viem';

/**
 * Onchain farm microfinance utilities
 * Microfinance loans for farmers
 */

export interface Loan {
  id: string;
  loanId: bigint;
  borrower: Address;
  principal: bigint;
  interestRate: bigint;
  termDays: bigint;
  startDate: bigint;
  dueDate: bigint;
  amountPaid: bigint;
  isRepaid: boolean;
  isDefaulted: boolean;
  purpose: string;
}

export function createLoan(
  address: Address,
  principal: bigint,
  interestRate: bigint,
  termDays: bigint,
  purpose: string
): Loan {
  const startDate = BigInt(Date.now());
  const termMs = termDays * BigInt(24 * 60 * 60 * 1000);
  const dueDate = startDate + termMs;

  return {
    id: `${Date.now()}-${Math.random()}`,
    loanId: BigInt(0),
    borrower: address,
    principal,
    interestRate,
    termDays,
    startDate,
    dueDate,
    amountPaid: BigInt(0),
    isRepaid: false,
    isDefaulted: false,
    purpose,
  };
}

