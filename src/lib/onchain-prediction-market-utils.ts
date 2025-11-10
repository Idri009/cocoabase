import { type Address } from 'viem';

export interface PredictionMarket {
  id: bigint;
  question: string;
  outcomeA: string;
  outcomeB: string;
  resolutionTime: bigint;
  status: 'open' | 'closed' | 'resolved';
  totalVolume: bigint;
}

export function createPredictionMarket(
  question: string,
  outcomeA: string,
  outcomeB: string,
  resolutionTime: bigint
): PredictionMarket {
  return {
    id: BigInt(0),
    question,
    outcomeA,
    outcomeB,
    resolutionTime,
    status: 'open',
    totalVolume: BigInt(0),
  };
}

