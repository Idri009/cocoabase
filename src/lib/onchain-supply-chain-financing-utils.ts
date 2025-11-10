import { type Address } from 'viem';

/**
 * Onchain Supply Chain Financing utilities
 * Finance supply chain operations onchain
 */

export interface SupplyChainFinance {
  id: bigint;
  borrower: Address;
  lender: Address;
  amount: bigint;
  interestRate: number;
  duration: bigint;
  purpose: string;
  status: 'pending' | 'approved' | 'active' | 'repaid' | 'defaulted';
  createdAt: bigint;
  dueDate?: bigint;
  repaidAmount: bigint;
}

export function createSupplyChainFinance(
  borrower: Address,
  lender: Address,
  amount: bigint,
  interestRate: number,
  duration: bigint,
  purpose: string
): SupplyChainFinance {
  const now = BigInt(Date.now());
  return {
    id: BigInt(0),
    borrower,
    lender,
    amount,
    interestRate,
    duration,
    purpose,
    status: 'pending',
    createdAt: now,
    repaidAmount: BigInt(0),
  };
}

export function approveSupplyChainFinance(
  finance: SupplyChainFinance
): SupplyChainFinance {
  const dueDate = finance.createdAt + finance.duration;
  return {
    ...finance,
    status: 'approved',
    dueDate,
  };
}

export function activateFinance(finance: SupplyChainFinance): SupplyChainFinance {
  if (finance.status !== 'approved') return finance;
  return {
    ...finance,
    status: 'active',
  };
}

export function repayFinance(
  finance: SupplyChainFinance,
  repaymentAmount: bigint
): SupplyChainFinance {
  const newRepaidAmount = finance.repaidAmount + repaymentAmount;
  const totalOwed = finance.amount + calculateInterest(finance);
  const status = newRepaidAmount >= totalOwed ? 'repaid' : 'active';
  
  return {
    ...finance,
    repaidAmount: newRepaidAmount,
    status,
  };
}

export function calculateInterest(finance: SupplyChainFinance): bigint {
  if (finance.status !== 'active' || !finance.dueDate) return BigInt(0);
  const now = BigInt(Date.now());
  const elapsed = now - finance.createdAt;
  const interest = (finance.amount * BigInt(finance.interestRate) * elapsed) / (BigInt(100) * BigInt(31536000));
  return interest;
}

export function isFinanceOverdue(
  finance: SupplyChainFinance,
  currentTime: bigint
): boolean {
  if (finance.status !== 'active' || !finance.dueDate) return false;
  return currentTime > finance.dueDate;
}

