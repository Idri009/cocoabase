import { type Address } from 'viem';

/**
 * Onchain farm crop harvest forecasting utilities
 * Harvest forecast creation and updates
 */

export interface HarvestForecast {
  id: string;
  plantationId: string;
  createdBy: Address;
  predictedYield: bigint;
  forecastDate: bigint;
  confidence: number;
  factors: string[];
  timestamp: bigint;
}

export function createForecast(
  address: Address,
  plantationId: string,
  predictedYield: bigint,
  forecastDate: bigint,
  confidence: number,
  factors: string[]
): HarvestForecast {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    createdBy: address,
    predictedYield,
    forecastDate,
    confidence,
    factors,
    timestamp: BigInt(Date.now()),
  };
}

