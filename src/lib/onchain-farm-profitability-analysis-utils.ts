import { type Address } from 'viem';

export interface ProfitabilityAnalysis {
  id: bigint;
  owner: Address;
  period: string;
  revenue: bigint;
  costs: bigint;
  profit: bigint;
  profitMargin: number;
  analysisDate: bigint;
  txHash: string;
}

export function createProfitabilityAnalysis(
  owner: Address,
  period: string,
  revenue: bigint,
  costs: bigint
): ProfitabilityAnalysis {
  const profit = revenue - costs;
  const profitMargin = Number(profit) / Number(revenue);
  return {
    id: BigInt(Date.now()),
    owner,
    period,
    revenue,
    costs,
    profit,
    profitMargin,
    analysisDate: BigInt(Date.now()),
    txHash: '',
  };
}
