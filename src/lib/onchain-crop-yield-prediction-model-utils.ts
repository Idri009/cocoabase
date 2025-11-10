import { type Address } from 'viem';

export interface YieldPrediction {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  predictedYield: bigint;
  confidence: number;
  predictionDate: bigint;
  modelVersion: string;
  txHash: string;
}

export function createYieldPrediction(
  owner: Address,
  plantationId: bigint,
  predictedYield: bigint,
  confidence: number,
  modelVersion: string
): YieldPrediction {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    predictedYield,
    confidence,
    predictionDate: BigInt(Date.now()),
    modelVersion,
    txHash: '',
  };
}

export function getPredictionsByPlantation(
  predictions: YieldPrediction[],
  plantationId: bigint
): YieldPrediction[] {
  return predictions
    .filter((p) => p.plantationId === plantationId)
    .sort((a, b) => (a.predictionDate > b.predictionDate ? -1 : 1));
}

export function getHighConfidencePredictions(
  predictions: YieldPrediction[],
  minConfidence: number
): YieldPrediction[] {
  return predictions.filter((p) => p.confidence >= minConfidence);
}

export function calculateAveragePredictedYield(
  predictions: YieldPrediction[]
): bigint {
  if (predictions.length === 0) return BigInt(0);
  const total = predictions.reduce((sum, p) => sum + p.predictedYield, BigInt(0));
  return total / BigInt(predictions.length);
}
