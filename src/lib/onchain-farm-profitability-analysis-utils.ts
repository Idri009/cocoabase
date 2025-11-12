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

export function isProfitable(
  analysis: ProfitabilityAnalysis
): boolean {
  return analysis.profit > BigInt(0);
}

export function getAnalysesByPeriod(
  analyses: ProfitabilityAnalysis[],
  period: string
): ProfitabilityAnalysis[] {
  return analyses.filter((a) => a.period === period);
}

export function getAverageProfitMargin(
  analyses: ProfitabilityAnalysis[]
): number {
  if (analyses.length === 0) return 0;
  const total = analyses.reduce((sum, a) => sum + a.profitMargin, 0);
  return total / analyses.length;
}
