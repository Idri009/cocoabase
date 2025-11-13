import { type Address } from 'viem';

/**
 * Onchain farm yield prediction utilities
 * Yield prediction models and accuracy tracking
 */

export interface YieldPrediction {
  id: string;
  plantationId: string;
  predictedBy: Address;
  expectedYield: bigint;
  confidence: number;
  timestamp: bigint;
  actualYield?: bigint;
  accuracy?: number;
}

export function createYieldPrediction(
  address: Address,
  plantationId: string,
  expectedYield: bigint,
  confidence: number
): YieldPrediction {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    predictedBy: address,
    expectedYield,
    confidence,
    timestamp: BigInt(Date.now()),
  };
}

export function calculatePredictionAccuracy(
  predicted: bigint,
  actual: bigint
): number {
  if (actual === BigInt(0)) return 0;
  const difference = predicted > actual ? predicted - actual : actual - predicted;
  return Number((BigInt(100) - (difference * BigInt(100)) / actual));
}
