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

export interface Prediction {
  predictor: Address;
  outcome: 'A' | 'B';
  amount: bigint;
  odds: number;
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

export function placePrediction(
  market: PredictionMarket,
  predictor: Address,
  outcome: 'A' | 'B',
  amount: bigint
): { market: PredictionMarket; prediction: Prediction } {
  return {
    market: {
      ...market,
      totalVolume: market.totalVolume + amount,
    },
    prediction: {
      predictor,
      outcome,
      amount,
      odds: 50,
    },
  };
}

export function resolveMarket(
  market: PredictionMarket,
  winningOutcome: 'A' | 'B'
): PredictionMarket {
  return {
    ...market,
    status: 'resolved',
  };
}
