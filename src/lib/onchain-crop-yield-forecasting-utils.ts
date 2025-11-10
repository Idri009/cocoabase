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
