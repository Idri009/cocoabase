import { type Address } from 'viem';

export interface TradeFinance {
  id: bigint;
  borrower: Address;
  lender: Address;
  amount: bigint;
  interestRate: bigint;
  term: bigint;
  status: 'pending' | 'approved' | 'repaid';
  txHash: string;
}

export function createTradeFinance(
  borrower: Address,
  lender: Address,
  amount: bigint,
  interestRate: bigint,
  term: bigint
): TradeFinance {
  return {
    id: BigInt(Date.now()),
    borrower,
    lender,
    amount,
    interestRate,
    term,
    status: 'pending',
    txHash: '',
  };
}

export function approveFinance(
  finance: TradeFinance,
  approver: Address
): TradeFinance | null {
  if (finance.lender.toLowerCase() !== approver.toLowerCase()) return null;
  return {
    ...finance,
    status: 'approved',
  };
}

export function calculateInterest(
  finance: TradeFinance,
  principal: bigint
): bigint {
  return (principal * finance.interestRate) / BigInt(10000);
}
