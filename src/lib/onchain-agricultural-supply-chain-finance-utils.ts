import { type Address } from 'viem';

export interface FinanceRequest {
  id: bigint;
  borrower: Address;
  amount: bigint;
  collateral: bigint;
  interestRate: number;
  status: 'pending' | 'approved' | 'rejected' | 'repaid';
}

export function createFinanceRequest(
  borrower: Address,
  amount: bigint,
  collateral: bigint,
  interestRate: number
): FinanceRequest {
  return {
    id: BigInt(0),
    borrower,
    amount,
    collateral,
    interestRate,
    status: 'pending',
  };
}
