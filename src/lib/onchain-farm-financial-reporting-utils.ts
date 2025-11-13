import { type Address } from 'viem';

/**
 * Onchain farm financial reporting utilities
 * Financial report generation and verification
 */

export interface FinancialReport {
  id: string;
  plantationId: string;
  generatedBy: Address;
  period: string;
  revenue: bigint;
  expenses: bigint;
  profit: bigint;
  verified: boolean;
  timestamp: bigint;
}

export function createFinancialReport(
  address: Address,
  plantationId: string,
  period: string,
  revenue: bigint,
  expenses: bigint,
  profit: bigint
): FinancialReport {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    generatedBy: address,
    period,
    revenue,
    expenses,
    profit,
    verified: false,
    timestamp: BigInt(Date.now()),
  };
}

