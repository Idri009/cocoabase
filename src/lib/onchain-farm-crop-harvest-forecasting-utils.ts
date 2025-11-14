import { type Address } from 'viem';

export interface HarvestForecast {
  id: string;
  plantationId: bigint;
  cropType: string;
  predictedHarvestDate: bigint;
  predictedYield: bigint;
  confidenceLevel: bigint;
  forecaster: Address;
}

export function createHarvestForecast(
  address: Address,
  plantationId: bigint,
  cropType: string,
  predictedHarvestDate: bigint,
  predictedYield: bigint,
  confidenceLevel: bigint
): HarvestForecast {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    cropType,
    predictedHarvestDate,
    predictedYield,
    confidenceLevel,
    forecaster: address,
  };
}
