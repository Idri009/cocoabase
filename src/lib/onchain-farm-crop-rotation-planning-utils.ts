import { type Address } from 'viem';

/**
 * Onchain farm crop rotation planning utilities
 * Crop rotation plan creation and execution
 */

export interface CropRotationPlan {
  id: string;
  fieldId: string;
  createdBy: Address;
  crops: string[];
  rotationYears: number;
  currentYear: number;
  timestamp: bigint;
}

export function createRotationPlan(
  address: Address,
  fieldId: string,
  crops: string[],
  rotationYears: number
): CropRotationPlan {
  return {
    id: `${Date.now()}-${Math.random()}`,
    fieldId,
    createdBy: address,
    crops,
    rotationYears,
    currentYear: 0,
    timestamp: BigInt(Date.now()),
  };
}

