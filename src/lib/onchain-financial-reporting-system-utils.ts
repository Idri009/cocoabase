import { type Address } from 'viem';

export interface FinancialReport {
  id: bigint;
  owner: Address;
  reportType: 'income' | 'expense' | 'profit' | 'loss';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  amount: bigint;
  reportDate: bigint;
  txHash: string;
}

export function createFinancialReport(
  owner: Address,
  reportType: FinancialReport['reportType'],
  period: FinancialReport['period'],
  amount: bigint
): FinancialReport {
  return {
    id: BigInt(Date.now()),
    owner,
    reportType,
    period,
    amount,
    reportDate: BigInt(Date.now()),
    txHash: '',
  };
}
