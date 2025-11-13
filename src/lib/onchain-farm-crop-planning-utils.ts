import { type Address } from 'viem';

/**
 * Onchain farm crop planning utilities
 * Crop plan creation and updates
 */

export interface CropPlan {
  id: string;
  plantationId: string;
  createdBy: Address;
  cropType: string;
  plantingDate: bigint;
  expectedHarvestDate: bigint;
  expectedYield: bigint;
  timestamp: bigint;
}

export function createCropPlan(
  address: Address,
  plantationId: string,
  cropType: string,
  plantingDate: bigint,
  expectedHarvestDate: bigint,
  expectedYield: bigint
): CropPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    plantationId,
    createdBy: address,
    cropType,
    plantingDate,
    expectedHarvestDate,
    expectedYield,
    timestamp: BigInt(Date.now()),
  };
}

