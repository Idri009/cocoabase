import { type Address } from 'viem';

export interface TrendAnalysis {
  id: bigint;
  analyst: Address;
  commodity: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  analysisDate: bigint;
  txHash: string;
}

export function createTrendAnalysis(
  analyst: Address,
  commodity: string,
  trend: 'bullish' | 'bearish' | 'neutral',
  confidence: number
): TrendAnalysis {
  return {
    id: BigInt(Date.now()),
    analyst,
    commodity,
    trend,
    confidence,
    analysisDate: BigInt(Date.now()),
    txHash: '',
  };
}

export function getAnalysesByCommodity(
  analyses: TrendAnalysis[],
  commodity: string
): TrendAnalysis[] {
  return analyses.filter((a) => a.commodity === commodity);
}

export function getBullishAnalyses(
  analyses: TrendAnalysis[]
): TrendAnalysis[] {
  return analyses.filter((a) => a.trend === 'bullish');
}

export function getHighConfidenceAnalyses(
  analyses: TrendAnalysis[],
  threshold: number
): TrendAnalysis[] {
  return analyses.filter((a) => a.confidence >= threshold);
}
