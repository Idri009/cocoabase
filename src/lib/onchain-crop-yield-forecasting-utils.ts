import { type Address } from 'viem';

export interface YieldForecast {
  id: bigint;
  owner: Address;
  plantationId: bigint;
  forecastDate: bigint;
  predictedYield: bigint;
  confidence: number;
  txHash: string;
}

export function createYieldForecast(
  owner: Address,
  plantationId: bigint,
  predictedYield: bigint,
  confidence: number
): YieldForecast {
  return {
    id: BigInt(Date.now()),
    owner,
    plantationId,
    forecastDate: BigInt(Date.now()),
    predictedYield,
    confidence,
    txHash: '',
  };
}

export function getForecastsByPlantation(
  forecasts: YieldForecast[],
  plantationId: bigint
): YieldForecast[] {
  return forecasts
    .filter((f) => f.plantationId === plantationId)
    .sort((a, b) => (a.forecastDate > b.forecastDate ? -1 : 1));
}

export function calculateAverageYield(
  forecasts: YieldForecast[]
): bigint {
  if (forecasts.length === 0) return BigInt(0);
  const total = forecasts.reduce((sum, f) => sum + f.predictedYield, BigInt(0));
  return total / BigInt(forecasts.length);
}
