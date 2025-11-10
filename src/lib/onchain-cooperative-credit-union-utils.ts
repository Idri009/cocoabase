import { type Address } from 'viem';

/**
 * Onchain Cooperative Credit Union utilities
 * Decentralized credit union system for farmers
 */

export interface CreditUnionMember {
  address: Address;
  joinedAt: bigint;
  shareBalance: bigint;
  loanBalance: bigint;
  depositBalance: bigint;
}

export interface CreditUnionLoan {
  id: bigint;
  borrower: Address;
  amount: bigint;
  interestRate: number;
  duration: bigint;
  status: 'pending' | 'active' | 'repaid' | 'defaulted';
  createdAt: bigint;
  dueDate: bigint;
  repaidAmount: bigint;
}

export function createCreditUnionMember(address: Address): CreditUnionMember {
  const now = BigInt(Date.now());
  return {
    address,
    joinedAt: now,
    shareBalance: BigInt(0),
    loanBalance: BigInt(0),
    depositBalance: BigInt(0),
  };
}

export function requestCreditUnionLoan(
  borrower: Address,
  amount: bigint,
  interestRate: number,
  duration: bigint
): CreditUnionLoan {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    borrower,
    amount,
    interestRate,
    duration,
    status: 'pending',
    createdAt: now,
    dueDate: now + duration,
    repaidAmount: BigInt(0),
  };
}

export function calculateLoanInterest(
  loan: CreditUnionLoan,
  currentTime: bigint
): bigint {
  if (loan.status !== 'active') return BigInt(0);
  const elapsed = currentTime - loan.createdAt;
  const interest = (loan.amount * BigInt(loan.interestRate) * elapsed) / (BigInt(100) * BigInt(31536000));
  return interest;
}

export function repayLoan(
  loan: CreditUnionLoan,
  repaymentAmount: bigint
): CreditUnionLoan {
  const newRepaidAmount = loan.repaidAmount + repaymentAmount;
  const totalOwed = loan.amount + calculateLoanInterest(loan, BigInt(Date.now()));
  const status = newRepaidAmount >= totalOwed ? 'repaid' : 'active';
  
  return {
    ...loan,
    repaidAmount: newRepaidAmount,
    status,
  };
}

export function calculateShareDividends(
  member: CreditUnionMember,
  totalProfit: bigint,
  totalShares: bigint
): bigint {
  if (totalShares === BigInt(0)) return BigInt(0);
  return (member.shareBalance * totalProfit) / totalShares;
}

